import { LitElement, html, css, PropertyValues } from "lit";
import { repeat } from "lit/directives/repeat.js";
import { customElement, property, state } from "lit/decorators.js";
import {
  HomematicScheduleCardConfig,
  HomeAssistant,
  ScheduleEntityAttributes,
  WEEKDAYS,
  ProfileData,
  Weekday,
  WeekdayData,
  SimpleProfileData,
} from "./types";
import {
  parseWeekdaySchedule,
  timeBlocksToWeekdayData,
  convertToBackendFormat,
  validateWeekdayData,
  validateTimeBlocks,
  validateProfileData,
  parseSimpleWeekdaySchedule,
  timeBlocksToSimpleWeekdayData,
  calculateBaseTemperature,
  validateSimpleWeekdayData,
  validateSimpleProfileData,
  ValidationMessage,
  getTemperatureColor,
  getTemperatureGradient,
  formatTemperature,
  TimeBlock,
  minutesToTime,
  timeToMinutes,
  mergeConsecutiveBlocks,
  insertBlockWithSplitting,
  fillGapsWithBaseTemperature,
  sortBlocksChronologically,
} from "./utils";
import { getTranslations, formatString, Translations } from "./localization";

// Static time labels for the schedule view (cached to avoid recreation)
const TIME_LABELS = (() => {
  const labels = [];
  for (let hour = 0; hour <= 24; hour += 3) {
    labels.push({
      hour,
      label: `${hour.toString().padStart(2, "0")}:00`,
      position: (hour / 24) * 100,
    });
  }
  return labels;
})();

@customElement("homematicip-local-climate-schedule-card")
export class HomematicScheduleCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config?: HomematicScheduleCardConfig;
  @state() private _currentProfile?: string;
  @state() private _scheduleData?: ProfileData;
  @state() private _simpleScheduleData?: SimpleProfileData;
  @state() private _availableProfiles: string[] = [];
  @state() private _activeEntityId?: string;
  @state() private _editingWeekday?: Weekday;
  @state() private _editingBlocks?: TimeBlock[];
  @state() private _editingBaseTemperature?: number;
  @state() private _copiedSchedule?: {
    weekday: Weekday;
    blocks: TimeBlock[];
    baseTemperature?: number;
  };
  @state() private _isLoading: boolean = false;
  private _loadingTimeoutId?: number;
  @state() private _currentTimePercent: number = 0;
  private _timeUpdateInterval?: number;
  @state() private _currentTimeMinutes: number = 0;
  @state() private _currentWeekday?: Weekday;
  private _historyStack: TimeBlock[][] = [];
  private _historyIndex: number = -1;
  private _keyDownHandler: (e: KeyboardEvent) => void;
  @state() private _translations: Translations = getTranslations("en");
  @state() private _isCompactView: boolean = false;
  @state() private _validationWarnings: ValidationMessage[] = [];
  private _parsedScheduleCache: WeakMap<WeekdayData, TimeBlock[]> = new WeakMap();
  private _weekdayShortLabelMap?: Record<Weekday, string>;
  private _weekdayLongLabelMap?: Record<Weekday, string>;
  @state() private _pendingChanges: Map<Weekday, TimeBlock[]> = new Map();
  @state() private _isDragging: boolean = false;
  @state() private _isDragDropMode: boolean = false;
  @state() private _minTemp: number = 5.0;
  @state() private _maxTemp: number = 30.5;
  @state() private _tempStep: number = 0.5;
  @state() private _editingSlotIndex?: number;
  @state() private _editingSlotData?: {
    startTime: string;
    endTime: string;
    temperature: number;
  };
  private _dragState?: {
    weekday: Weekday;
    blockIndex: number;
    boundary: "start" | "end" | "temperature";
    initialY: number;
    initialMinutes: number;
    initialTemperature?: number;
    originalBlocks: TimeBlock[];
  };

  constructor() {
    super();
    this._keyDownHandler = this._handleKeyDown.bind(this);
  }

  public setConfig(config: HomematicScheduleCardConfig): void {
    const entityIds: string[] = [];
    const addEntity = (entityId?: string) => {
      if (!entityId) return;
      const trimmed = entityId.trim();
      if (!trimmed) return;
      if (!entityIds.includes(trimmed)) {
        entityIds.push(trimmed);
      }
    };

    addEntity(config.entity);
    if (Array.isArray(config.entities)) {
      config.entities.forEach((entityId) => addEntity(entityId));
    }

    if (entityIds.length === 0) {
      throw new Error("You need to define at least one entity");
    }

    entityIds.sort((a, b) => a.localeCompare(b));

    const previousEntity = this._activeEntityId;
    const fallbackEntity = entityIds[0];
    const nextActiveEntity =
      previousEntity && entityIds.includes(previousEntity) ? previousEntity : fallbackEntity;

    this._config = {
      show_profile_selector: true,
      editable: true,
      show_temperature: true,
      temperature_unit: "°C",
      hour_format: "24",
      time_step_minutes: 15,
      ...config,
      entity: fallbackEntity,
      entities: [...entityIds],
    };

    this._activeEntityId = nextActiveEntity;
    this._pendingChanges.clear();
    this._copiedSchedule = undefined;
    this._editingWeekday = undefined;
    this._editingBlocks = undefined;
    this._parsedScheduleCache = new WeakMap();

    // Set language from config or detect from Home Assistant
    this._updateLanguage();
  }

  private _getPreferredLanguage(hassInstance?: HomeAssistant): string | undefined {
    return hassInstance?.language || hassInstance?.locale?.language;
  }

  private _updateLanguage(): void {
    let language = "en"; // Default to English

    // Priority 1: Explicit language setting in card config
    if (this._config?.language) {
      language = this._config.language;
    }
    // Priority 2: Home Assistant language setting
    else {
      const hassLanguage = this._getPreferredLanguage(this.hass);
      if (hassLanguage) {
        language = hassLanguage;
      }
    }

    // Load translations for the detected language
    this._translations = getTranslations(language);

    // Cache weekday label map to avoid recreating on every call
    this._weekdayShortLabelMap = this._createWeekdayLabelMap("short");
    this._weekdayLongLabelMap = this._createWeekdayLabelMap("long");
  }

  private _createWeekdayLabelMap(format: "short" | "long"): Record<Weekday, string> {
    const labels =
      format === "short" ? this._translations.weekdays.short : this._translations.weekdays.long;
    return {
      MONDAY: labels.monday,
      TUESDAY: labels.tuesday,
      WEDNESDAY: labels.wednesday,
      THURSDAY: labels.thursday,
      FRIDAY: labels.friday,
      SATURDAY: labels.saturday,
      SUNDAY: labels.sunday,
    };
  }

  private _getWeekdayLabel(weekday: Weekday, format: "short" | "long" = "short"): string {
    if (format === "long") {
      if (!this._weekdayLongLabelMap) {
        this._weekdayLongLabelMap = this._createWeekdayLabelMap("long");
      }
      return this._weekdayLongLabelMap[weekday];
    }

    if (!this._weekdayShortLabelMap) {
      this._weekdayShortLabelMap = this._createWeekdayLabelMap("short");
    }
    return this._weekdayShortLabelMap[weekday];
  }

  private _getEntityOptions(): string[] {
    if (!this._config) {
      return [];
    }
    if (this._config.entities?.length) {
      return [...this._config.entities].sort((a, b) => a.localeCompare(b));
    }
    return this._config.entity ? [this._config.entity] : [];
  }

  private _getActiveEntityId(): string | undefined {
    const entities = this._getEntityOptions();
    if (entities.length === 0) {
      return undefined;
    }
    if (this._activeEntityId && entities.includes(this._activeEntityId)) {
      return this._activeEntityId;
    }
    return entities[0];
  }

  private _formatValidationParams(params?: Record<string, string>): Record<string, string> {
    if (!params) {
      return {};
    }
    const formatted: Record<string, string> = {};
    for (const [key, value] of Object.entries(params)) {
      if (key === "weekday" && (WEEKDAYS as readonly Weekday[]).includes(value as Weekday)) {
        formatted.weekday = this._getWeekdayLabel(value as Weekday, "long");
      } else {
        formatted[key] = value;
      }
    }
    return formatted;
  }

  private _translateValidationMessage(message: ValidationMessage): string {
    const template = this._translations.validationMessages[message.key] || message.key;
    const params = this._formatValidationParams(message.params);

    if (message.nested) {
      params.details = this._translateValidationMessage(message.nested);
    }

    return formatString(template, params);
  }

  public getCardSize(): number {
    return 12;
  }

  public connectedCallback(): void {
    super.connectedCallback();
    this._updateCurrentTime();
    // Update every minute
    this._timeUpdateInterval = window.setInterval(() => {
      this._updateCurrentTime();
    }, 60000);
    // Add keyboard listener for undo/redo shortcuts
    window.addEventListener("keydown", this._keyDownHandler);
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._timeUpdateInterval !== undefined) {
      clearInterval(this._timeUpdateInterval);
      this._timeUpdateInterval = undefined;
    }
    if (this._loadingTimeoutId !== undefined) {
      clearTimeout(this._loadingTimeoutId);
      this._loadingTimeoutId = undefined;
    }
    // Remove keyboard listener
    window.removeEventListener("keydown", this._keyDownHandler);
  }

  private _updateCurrentTime(): void {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const totalMinutes = hours * 60 + minutes;
    // Calculate percentage (0-100%) of the day
    this._currentTimePercent = (totalMinutes / 1440) * 100;
    this._currentTimeMinutes = totalMinutes;

    // Get current weekday (0=Sunday, 1=Monday, ..., 6=Saturday)
    const dayIndex = now.getDay();
    const weekdayMap: Weekday[] = [
      "SUNDAY",
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
    ];
    this._currentWeekday = weekdayMap[dayIndex];
  }

  private _isBlockActive(weekday: Weekday, block: TimeBlock): boolean {
    if (!this._currentWeekday || this._currentWeekday !== weekday) {
      return false;
    }

    // Check if current time falls within this block's time range
    return (
      this._currentTimeMinutes >= block.startMinutes && this._currentTimeMinutes < block.endMinutes
    );
  }

  private _handleKeyDown(e: KeyboardEvent): void {
    // Only handle shortcuts when editor is open
    if (!this._editingWeekday || !this._editingBlocks) return;

    // Check for Ctrl/Cmd key (support both Windows/Linux and Mac)
    const isCtrlOrCmd = e.ctrlKey || e.metaKey;

    if (isCtrlOrCmd && e.key === "z" && !e.shiftKey) {
      // Ctrl+Z or Cmd+Z: Undo
      e.preventDefault();
      this._undo();
    } else if (isCtrlOrCmd && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
      // Ctrl+Y, Cmd+Y, Ctrl+Shift+Z, or Cmd+Shift+Z: Redo
      e.preventDefault();
      this._redo();
    }
  }

  private _saveHistoryState(): void {
    if (!this._editingBlocks) return;

    // Deep copy the current state
    const stateCopy = JSON.parse(JSON.stringify(this._editingBlocks)) as TimeBlock[];

    // Remove any states after current index (for redo branch)
    this._historyStack = this._historyStack.slice(0, this._historyIndex + 1);

    // Add new state
    this._historyStack.push(stateCopy);
    this._historyIndex++;

    // Limit history to 50 states
    if (this._historyStack.length > 50) {
      this._historyStack.shift();
      this._historyIndex--;
    }
  }

  private _undo(): void {
    if (this._historyIndex <= 0) return;

    this._historyIndex--;
    this._editingBlocks = JSON.parse(
      JSON.stringify(this._historyStack[this._historyIndex]),
    ) as TimeBlock[];
    this._updateValidationWarnings();
  }

  private _redo(): void {
    if (this._historyIndex >= this._historyStack.length - 1) return;

    this._historyIndex++;
    this._editingBlocks = JSON.parse(
      JSON.stringify(this._historyStack[this._historyIndex]),
    ) as TimeBlock[];
    this._updateValidationWarnings();
  }

  private _canUndo(): boolean {
    return this._historyIndex > 0;
  }

  private _canRedo(): boolean {
    return this._historyIndex < this._historyStack.length - 1;
  }

  private _toggleViewMode(): void {
    this._isCompactView = !this._isCompactView;
  }

  private _toggleDragDropMode(): void {
    // If trying to disable drag & drop mode with pending changes, confirm first
    if (this._isDragDropMode && this._pendingChanges.size > 0) {
      const message = this._translations.ui.confirmDiscardChanges;
      if (confirm(message)) {
        // Discard changes and exit mode
        this._discardPendingChanges();
        this._isDragDropMode = false;
      }
      // If user cancels, stay in drag & drop mode
      return;
    }

    // Toggle drag & drop mode
    this._isDragDropMode = !this._isDragDropMode;
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    // Always update if config changed
    if (changedProps.has("_config")) {
      return true;
    }

    // Check if hass entity state actually changed
    if (changedProps.has("hass")) {
      const oldHass = changedProps.get("hass") as HomeAssistant | undefined;
      const newHass = this.hass;

      // If no config, don't update
      if (!this._config) {
        return false;
      }

      // If hass is new or entity changed, update
      if (!oldHass || !newHass) {
        return true;
      }

      const entityId = this._getActiveEntityId();
      if (!entityId) {
        return true;
      }

      const oldEntity = oldHass.states?.[entityId];
      const newEntity = newHass.states?.[entityId];

      // Update if entity state or attributes changed
      if (oldEntity !== newEntity) {
        return true;
      }

      // Check language change
      const newLanguage = newHass?.language || newHass?.locale?.language;
      const oldLanguage = oldHass?.language || oldHass?.locale?.language;
      if (newLanguage !== oldLanguage) {
        return true;
      }

      // If nothing relevant changed, skip update
      return false;
    }

    // Update for all other property changes
    return true;
  }

  protected updated(changedProps: PropertyValues): void {
    super.updated(changedProps);

    if (changedProps.has("hass") && this._config) {
      this._updateFromEntity();

      const oldHass = changedProps.get("hass") as HomeAssistant | undefined;
      const newLanguage = this._getPreferredLanguage(this.hass);
      const oldLanguage = this._getPreferredLanguage(oldHass);

      if (newLanguage !== oldLanguage) {
        this._updateLanguage();
      }
    }
  }

  private _updateFromEntity(): void {
    if (!this.hass || !this._config) return;

    const entityId = this._getActiveEntityId();
    if (!entityId) {
      this._currentProfile = undefined;
      this._scheduleData = undefined;
      this._simpleScheduleData = undefined;
      this._availableProfiles = [];
      this._pendingChanges.clear();
      return;
    }

    const entityState = this.hass.states?.[entityId];
    if (!entityState) {
      this._currentProfile = undefined;
      this._scheduleData = undefined;
      this._simpleScheduleData = undefined;
      this._availableProfiles = [];
      this._pendingChanges.clear();
      return;
    }

    const attrs = entityState.attributes as ScheduleEntityAttributes;

    this._currentProfile = this._config.profile || attrs.active_profile;
    // Use simple_schedule_data if available, fall back to schedule_data for backward compatibility
    this._simpleScheduleData = attrs.simple_schedule_data;
    this._scheduleData = attrs.schedule_data;
    this._availableProfiles = (attrs.available_profiles || [])
      .slice()
      .sort((a, b) => a.localeCompare(b));

    // Update temperature range from backend (with fallback to default values)
    this._minTemp = attrs.min_temp ?? 5.0;
    this._maxTemp = attrs.max_temp ?? 30.5;
    this._tempStep = attrs.target_temp_step ?? 0.5;

    // Clear cache when schedule data changes
    this._parsedScheduleCache = new WeakMap();
  }

  private _getBaseTemperature(weekday: Weekday): number {
    // Try to get base temperature from simple schedule data
    if (this._simpleScheduleData) {
      const simpleWeekdayData = this._simpleScheduleData[weekday];
      if (simpleWeekdayData) {
        const { baseTemperature } = parseSimpleWeekdaySchedule(simpleWeekdayData);
        return baseTemperature;
      }
    }

    // For legacy schedule data or when no data exists, return default
    return 20.0; // Default base temperature
  }

  private _getParsedBlocks(weekday: Weekday): TimeBlock[] {
    // Check for pending changes first
    if (this._pendingChanges.has(weekday)) {
      return this._pendingChanges.get(weekday)!;
    }

    // Prefer simple_schedule_data over schedule_data
    if (this._simpleScheduleData) {
      const simpleWeekdayData = this._simpleScheduleData[weekday];
      if (!simpleWeekdayData) return [];

      const cachedBlocks = this._parsedScheduleCache.get(
        simpleWeekdayData as unknown as WeekdayData,
      );
      if (cachedBlocks) {
        return cachedBlocks;
      }

      const { blocks } = parseSimpleWeekdaySchedule(simpleWeekdayData);
      this._parsedScheduleCache.set(simpleWeekdayData as unknown as WeekdayData, blocks);
      return blocks;
    }

    // Fallback to old schedule_data for backward compatibility
    if (this._scheduleData) {
      const weekdayData = this._scheduleData[weekday];
      if (!weekdayData) return [];

      const cachedBlocks = this._parsedScheduleCache.get(weekdayData);
      if (cachedBlocks) {
        return cachedBlocks;
      }

      const blocks = parseWeekdaySchedule(weekdayData);
      this._parsedScheduleCache.set(weekdayData, blocks);
      return blocks;
    }

    return [];
  }

  private async _handleProfileChange(e: Event): Promise<void> {
    const select = e.target as HTMLSelectElement;
    const newProfile = select.value;

    const entityId = this._getActiveEntityId();
    if (!this._config || !this.hass || !entityId) return;

    try {
      await this.hass.callService("homematicip_local", "set_schedule_active_profile", {
        entity_id: entityId,
        profile: newProfile,
      });

      this._currentProfile = newProfile;
    } catch (err) {
      console.error("Failed to change profile:", err);
      alert(formatString(this._translations.errors.failedToChangeProfile, { error: String(err) }));
    }
  }

  private _updateValidationWarnings(): void {
    if (!this._editingBlocks) {
      this._validationWarnings = [];
      return;
    }
    this._validationWarnings = validateTimeBlocks(
      this._editingBlocks,
      this._minTemp,
      this._maxTemp,
    );
  }

  private _handleWeekdayClick(weekday: Weekday): void {
    if (!this._config?.editable) return;
    if (!this._simpleScheduleData && !this._scheduleData) return;

    // Don't open editor when in drag & drop mode
    if (this._isDragDropMode) return;

    this._editingWeekday = weekday;
    this._editingBlocks = this._getParsedBlocks(weekday);

    // Extract base temperature if using simple schedule
    if (this._simpleScheduleData) {
      const simpleWeekdayData = this._simpleScheduleData[weekday];
      if (simpleWeekdayData) {
        const { baseTemperature } = parseSimpleWeekdaySchedule(simpleWeekdayData);
        this._editingBaseTemperature = baseTemperature;
      } else {
        this._editingBaseTemperature = 20.0; // Default
      }
    } else {
      // Calculate base temperature from blocks for old format
      this._editingBaseTemperature = calculateBaseTemperature(this._editingBlocks);
    }

    // Initialize history stack with the initial state
    this._historyStack = [JSON.parse(JSON.stringify(this._editingBlocks)) as TimeBlock[]];
    this._historyIndex = 0;

    // Update validation warnings
    this._updateValidationWarnings();
  }

  private _closeEditor(): void {
    this._editingWeekday = undefined;
    this._editingBlocks = undefined;
    this._editingBaseTemperature = undefined;
    // Clear slot editing state
    this._editingSlotIndex = undefined;
    this._editingSlotData = undefined;
    // Clear history stack
    this._historyStack = [];
    this._historyIndex = -1;
  }

  private _snapToQuarterHour(minutes: number): number {
    // Snap to nearest 15-minute interval (0, 15, 30, 45)
    return Math.round(minutes / 15) * 15;
  }

  private _startDrag(
    e: MouseEvent | TouchEvent,
    weekday: Weekday,
    blockIndex: number,
    boundary: "start" | "end" | "temperature",
  ): void {
    if (!this._config?.editable) return;

    e.preventDefault();
    e.stopPropagation();

    const clientY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
    const blocks = this._pendingChanges.get(weekday) || this._getParsedBlocks(weekday);

    this._dragState = {
      weekday,
      blockIndex,
      boundary,
      initialY: clientY,
      initialMinutes:
        boundary === "start"
          ? blocks[blockIndex].startMinutes
          : boundary === "end"
            ? blocks[blockIndex].endMinutes
            : 0,
      initialTemperature: boundary === "temperature" ? blocks[blockIndex].temperature : undefined,
      originalBlocks: JSON.parse(JSON.stringify(blocks)),
    };

    this._isDragging = true;

    // Add global event listeners
    const moveHandler = (e: Event) => {
      if (e instanceof MouseEvent || e instanceof TouchEvent) {
        this._onDragMove(e);
      }
    };
    const endHandler = () => this._endDrag(moveHandler, endHandler);

    document.addEventListener("mousemove", moveHandler);
    document.addEventListener("touchmove", moveHandler, { passive: false });
    document.addEventListener("mouseup", endHandler);
    document.addEventListener("touchend", endHandler);
  }

  private _onDragMove(e: MouseEvent | TouchEvent): void {
    if (!this._dragState) return;

    e.preventDefault();

    const clientY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
    const deltaY = clientY - this._dragState.initialY;

    const { blockIndex, boundary, weekday } = this._dragState;
    const blocks = [...this._dragState.originalBlocks];

    if (boundary === "temperature") {
      // Temperature adjustment mode
      // Drag down = increase temperature, drag up = decrease temperature
      // Convert pixels to temperature (e.g., 50 pixels = 1°C)
      const pixelsPerDegree = 50;
      const deltaTemp = -deltaY / pixelsPerDegree; // Negative because down is positive Y

      // Snap to temperature step increments (e.g., 0.5°C, 1°C, etc.)
      const tempChange = Math.round(deltaTemp / this._tempStep) * this._tempStep;
      const newTemp = (this._dragState.initialTemperature || 20.0) + tempChange;

      // Constrain temperature between min and max from backend
      const constrainedTemp = Math.max(this._minTemp, Math.min(this._maxTemp, newTemp));

      // Update block temperature
      blocks[blockIndex] = {
        ...blocks[blockIndex],
        temperature: constrainedTemp,
      };

      // Store pending changes
      this._pendingChanges.set(weekday, blocks);
      this.requestUpdate();
      return;
    }

    // Time boundary adjustment mode (existing logic)
    const dayContainer = this.shadowRoot?.querySelector(".schedule-grid");
    if (!dayContainer) return;

    const containerHeight = dayContainer.clientHeight;
    const minutesPerPixel = 1440 / containerHeight;
    const deltaMinutes = deltaY * minutesPerPixel;

    const newMinutes = this._snapToQuarterHour(this._dragState.initialMinutes + deltaMinutes);

    if (boundary === "start") {
      // Start time must be >= previous block's end time (or 0 for first block)
      const minMinutes = blockIndex > 0 ? blocks[blockIndex - 1].endMinutes : 0;
      // Start time must be < this block's end time
      const maxMinutes = blocks[blockIndex].endMinutes - 15;

      const constrainedMinutes = Math.max(minMinutes, Math.min(maxMinutes, newMinutes));

      // Update the previous block's end time (if not first block)
      if (blockIndex > 0) {
        blocks[blockIndex - 1] = {
          ...blocks[blockIndex - 1],
          endMinutes: constrainedMinutes,
          endTime: minutesToTime(constrainedMinutes),
        };
      }

      // Update current block's start time
      blocks[blockIndex] = {
        ...blocks[blockIndex],
        startMinutes: constrainedMinutes,
        startTime: minutesToTime(constrainedMinutes),
      };
    } else if (boundary === "end") {
      // End time must be > this block's start time
      const minMinutes = blocks[blockIndex].startMinutes + 15;
      // End time must be <= next block's start time (or 1440 for last block)
      const maxMinutes = blockIndex < blocks.length - 1 ? blocks[blockIndex + 1].endMinutes : 1440;

      const constrainedMinutes = Math.max(minMinutes, Math.min(maxMinutes, newMinutes));

      // Update current block's end time
      blocks[blockIndex] = {
        ...blocks[blockIndex],
        endMinutes: constrainedMinutes,
        endTime: minutesToTime(constrainedMinutes),
      };

      // Update next block's start time (if not last block)
      if (blockIndex < blocks.length - 1) {
        blocks[blockIndex + 1] = {
          ...blocks[blockIndex + 1],
          startMinutes: constrainedMinutes,
          startTime: minutesToTime(constrainedMinutes),
        };
      }
    }

    // Store pending changes
    this._pendingChanges.set(weekday, blocks);
    this.requestUpdate();
  }

  private _endDrag(moveHandler: EventListener, endHandler: EventListener): void {
    this._isDragging = false;
    this._dragState = undefined;

    // Remove global event listeners
    document.removeEventListener("mousemove", moveHandler);
    document.removeEventListener("touchmove", moveHandler);
    document.removeEventListener("mouseup", endHandler);
    document.removeEventListener("touchend", endHandler);

    this.requestUpdate();
  }

  private async _savePendingChanges(): Promise<void> {
    const entityId = this._getActiveEntityId();
    if (
      !this._config ||
      !this.hass ||
      !this._currentProfile ||
      this._pendingChanges.size === 0 ||
      !entityId
    ) {
      return;
    }

    // Set loading state
    this._isLoading = true;
    this._loadingTimeoutId = window.setTimeout(() => {
      this._isLoading = false;
      this._loadingTimeoutId = undefined;
    }, 10000);

    try {
      // Save all pending changes sequentially
      for (const [weekday, blocks] of this._pendingChanges) {
        const weekdayData = timeBlocksToWeekdayData(blocks);
        const validationError = validateWeekdayData(weekdayData);

        if (validationError) {
          const localizedError = this._translateValidationMessage(validationError);
          const weekdayLabel = this._getWeekdayLabel(weekday, "long");
          throw new Error(`${weekdayLabel}: ${localizedError}`);
        }

        const backendData = convertToBackendFormat(weekdayData);

        await this.hass.callService("homematicip_local", "set_schedule_profile_weekday", {
          entity_id: entityId,
          profile: this._currentProfile,
          weekday: weekday,
          weekday_data: backendData,
        });

        // Update local state
        if (this._scheduleData) {
          this._scheduleData = {
            ...this._scheduleData,
            [weekday]: weekdayData,
          };
        }
      }

      // Clear pending changes
      this._pendingChanges.clear();

      // Force update from entity
      this._updateFromEntity();
      this.requestUpdate();
    } catch (err) {
      console.error("Failed to save pending changes:", err);
      alert(formatString(this._translations.errors.failedToSaveSchedule, { error: String(err) }));
    } finally {
      if (this._loadingTimeoutId !== undefined) {
        clearTimeout(this._loadingTimeoutId);
        this._loadingTimeoutId = undefined;
      }
      this._isLoading = false;
    }
  }

  private _discardPendingChanges(): void {
    this._pendingChanges.clear();
    this.requestUpdate();
  }

  private async _saveSchedule(): Promise<void> {
    if (
      !this._config ||
      !this.hass ||
      !this._editingWeekday ||
      !this._editingBlocks ||
      !this._currentProfile ||
      this._editingBaseTemperature === undefined
    ) {
      return;
    }

    const entityId = this._getActiveEntityId();
    if (!entityId) {
      return;
    }

    // Convert blocks to simple weekday data format
    const simpleWeekdayData = timeBlocksToSimpleWeekdayData(
      this._editingBlocks,
      this._editingBaseTemperature,
    );

    // Validate schedule data before sending
    const validationError = validateSimpleWeekdayData(
      simpleWeekdayData,
      this._minTemp,
      this._maxTemp,
    );
    if (validationError) {
      const localizedError = this._translateValidationMessage(validationError);
      alert(formatString(this._translations.errors.invalidSchedule, { error: localizedError }));
      return;
    }

    // Set loading state with 10-second timeout
    this._isLoading = true;
    this._loadingTimeoutId = window.setTimeout(() => {
      this._isLoading = false;
      this._loadingTimeoutId = undefined;
    }, 10000);

    try {
      // Call the new simple schedule service
      await this.hass.callService("homematicip_local", "set_schedule_simple_weekday", {
        entity_id: entityId,
        profile: this._currentProfile,
        weekday: this._editingWeekday,
        simple_weekday_data: simpleWeekdayData,
      });

      // Update local state
      if (this._simpleScheduleData) {
        this._simpleScheduleData = {
          ...this._simpleScheduleData,
          [this._editingWeekday]: simpleWeekdayData,
        };
      }

      // Force update from entity to get latest backend data
      this._updateFromEntity();
      this.requestUpdate();

      this._closeEditor();
    } catch (err) {
      console.error("Failed to save schedule:", err);
      alert(formatString(this._translations.errors.failedToSaveSchedule, { error: String(err) }));
    } finally {
      // Clear loading state and timeout
      if (this._loadingTimeoutId !== undefined) {
        clearTimeout(this._loadingTimeoutId);
        this._loadingTimeoutId = undefined;
      }
      this._isLoading = false;
    }
  }

  private _copySchedule(weekday: Weekday): void {
    if (!this._simpleScheduleData && !this._scheduleData) return;

    const blocks = this._getParsedBlocks(weekday);

    // Get base temperature if using simple schedule
    let baseTemperature: number | undefined;
    if (this._simpleScheduleData) {
      const simpleWeekdayData = this._simpleScheduleData[weekday];
      if (simpleWeekdayData) {
        baseTemperature = parseSimpleWeekdaySchedule(simpleWeekdayData).baseTemperature;
      }
    } else {
      baseTemperature = calculateBaseTemperature(blocks);
    }

    this._copiedSchedule = {
      weekday,
      blocks: JSON.parse(JSON.stringify(blocks)), // Deep copy
      baseTemperature,
    };

    // Show feedback
    console.info(`Copied schedule from ${weekday}`);
  }

  private async _pasteSchedule(weekday: Weekday): Promise<void> {
    if (!this._config || !this.hass || !this._currentProfile || !this._copiedSchedule) {
      return;
    }

    const entityId = this._getActiveEntityId();
    if (!entityId) {
      return;
    }

    // Get base temperature from copied schedule or calculate it
    const baseTemperature =
      this._copiedSchedule.baseTemperature ?? calculateBaseTemperature(this._copiedSchedule.blocks);

    // Convert copied blocks to simple weekday data
    const simpleWeekdayData = timeBlocksToSimpleWeekdayData(
      this._copiedSchedule.blocks,
      baseTemperature,
    );

    // Validate schedule data
    const validationError = validateSimpleWeekdayData(
      simpleWeekdayData,
      this._minTemp,
      this._maxTemp,
    );
    if (validationError) {
      const localizedError = this._translateValidationMessage(validationError);
      alert(formatString(this._translations.errors.invalidSchedule, { error: localizedError }));
      return;
    }

    // Set loading state with 10-second timeout
    this._isLoading = true;
    this._loadingTimeoutId = window.setTimeout(() => {
      this._isLoading = false;
      this._loadingTimeoutId = undefined;
    }, 10000);

    try {
      // Call the new simple schedule service
      await this.hass.callService("homematicip_local", "set_schedule_simple_weekday", {
        entity_id: entityId,
        profile: this._currentProfile,
        weekday: weekday,
        simple_weekday_data: simpleWeekdayData,
      });

      // Update local state
      if (this._simpleScheduleData) {
        this._simpleScheduleData = {
          ...this._simpleScheduleData,
          [weekday]: simpleWeekdayData,
        };
      }

      // Force update from entity to get latest backend data
      this._updateFromEntity();
      this.requestUpdate();

      console.info(`Pasted schedule to ${weekday}`);
    } catch (err) {
      console.error("Failed to paste schedule:", err);
      alert(formatString(this._translations.errors.failedToPasteSchedule, { error: String(err) }));
    } finally {
      // Clear loading state and timeout
      if (this._loadingTimeoutId !== undefined) {
        clearTimeout(this._loadingTimeoutId);
        this._loadingTimeoutId = undefined;
      }
      this._isLoading = false;
    }
  }

  private _exportSchedule(): void {
    if (!this._currentProfile) {
      return;
    }

    // Prefer simple schedule data if available
    const scheduleToExport = this._simpleScheduleData || this._scheduleData;
    if (!scheduleToExport) {
      return;
    }

    try {
      // Create export data with metadata
      const exportData = {
        version: this._simpleScheduleData ? "2.0" : "1.0",
        profile: this._currentProfile,
        exported: new Date().toISOString(),
        scheduleData: scheduleToExport,
        format: this._simpleScheduleData ? "simple" : "legacy",
      };

      // Convert to JSON string with formatting
      const jsonString = JSON.stringify(exportData, null, 2);

      // Create blob and download
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `schedule-${this._currentProfile}-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.info("Schedule exported successfully");
    } catch (err) {
      console.error("Failed to export schedule:", err);
      alert(formatString(this._translations.errors.failedToExport, { error: String(err) }));
    }
  }

  private _importSchedule(): void {
    // Create file input element
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,application/json";

    input.onchange = async (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) {
        return;
      }

      // Validate file type
      if (!file.name.endsWith(".json") && file.type !== "application/json") {
        alert(this._translations.errors.invalidImportFile);
        return;
      }

      try {
        // Read file content
        const text = await file.text();
        let importData: unknown;

        // Parse JSON
        try {
          importData = JSON.parse(text);
        } catch {
          alert(this._translations.errors.invalidImportFormat);
          return;
        }

        // Validate structure
        if (!importData || typeof importData !== "object") {
          alert(this._translations.errors.invalidImportFormat);
          return;
        }

        const data = importData as Record<string, unknown>;

        // Extract schedule data (support both with and without metadata wrapper)
        let scheduleData: unknown;
        let isSimpleFormat = false;
        if ("scheduleData" in data) {
          scheduleData = data.scheduleData;
          const format = "format" in data ? data.format : undefined;
          const version = "version" in data ? data.version : undefined;
          isSimpleFormat = format === "simple" || version === "2.0";
        } else {
          // Assume the entire file is schedule data
          scheduleData = importData;
          // Try to detect format by checking first weekday structure
          const firstWeekday =
            scheduleData && typeof scheduleData === "object" && "MONDAY" in scheduleData
              ? (scheduleData as Record<string, unknown>).MONDAY
              : null;
          isSimpleFormat = Array.isArray(firstWeekday);
        }

        // Validate schedule data based on format
        let validationError: ValidationMessage | null;
        if (isSimpleFormat) {
          validationError = validateSimpleProfileData(scheduleData);
        } else {
          validationError = validateProfileData(scheduleData);
        }

        if (validationError) {
          const localizedError = this._translateValidationMessage(validationError);
          alert(
            formatString(this._translations.errors.invalidImportData, { error: localizedError }),
          );
          return;
        }

        // Apply imported schedule
        const entityId = this._getActiveEntityId();
        if (!this._config || !this.hass || !this._currentProfile || !entityId) {
          return;
        }

        // Set loading state
        this._isLoading = true;
        this._loadingTimeoutId = window.setTimeout(() => {
          this._isLoading = false;
          this._loadingTimeoutId = undefined;
        }, 10000);

        try {
          if (isSimpleFormat) {
            // Import simple format
            const importedSchedule = scheduleData as SimpleProfileData;
            for (const weekday of WEEKDAYS) {
              const simpleWeekdayData = importedSchedule[weekday];
              if (simpleWeekdayData) {
                await this.hass.callService("homematicip_local", "set_schedule_simple_weekday", {
                  entity_id: entityId,
                  profile: this._currentProfile,
                  weekday: weekday,
                  simple_weekday_data: simpleWeekdayData,
                });
              }
            }

            // Update local state
            this._simpleScheduleData = importedSchedule;
          } else {
            // Import legacy format (backward compatibility)
            const importedSchedule = scheduleData as ProfileData;
            for (const weekday of WEEKDAYS) {
              const weekdayData = importedSchedule[weekday];
              if (weekdayData) {
                const backendData = convertToBackendFormat(weekdayData);
                await this.hass.callService("homematicip_local", "set_schedule_profile_weekday", {
                  entity_id: entityId,
                  profile: this._currentProfile,
                  weekday: weekday,
                  weekday_data: backendData,
                });
              }
            }

            // Update local state
            this._scheduleData = importedSchedule;
          }

          this._updateFromEntity();
          this.requestUpdate();

          console.info("Schedule imported successfully");
          alert(this._translations.ui.importSuccess);
        } catch (err) {
          console.error("Failed to import schedule:", err);
          alert(formatString(this._translations.errors.failedToImport, { error: String(err) }));
        } finally {
          // Clear loading state and timeout
          if (this._loadingTimeoutId !== undefined) {
            clearTimeout(this._loadingTimeoutId);
            this._loadingTimeoutId = undefined;
          }
          this._isLoading = false;
        }
      } catch (err) {
        console.error("Failed to read import file:", err);
        alert(formatString(this._translations.errors.failedToImport, { error: String(err) }));
      }
    };

    // Trigger file selection
    input.click();
  }

  private _addTimeBlock(): void {
    if (!this._editingBlocks) return;

    const lastBlock = this._editingBlocks[this._editingBlocks.length - 1];
    const newStartMinutes = lastBlock ? lastBlock.endMinutes : 0;
    const newEndMinutes = Math.min(newStartMinutes + 60, 1440);

    if (newEndMinutes > newStartMinutes && this._editingBlocks.length < 12) {
      // Save state before modification
      this._saveHistoryState();

      this._editingBlocks = [
        ...this._editingBlocks,
        {
          startTime: minutesToTime(newStartMinutes),
          startMinutes: newStartMinutes,
          endTime: minutesToTime(newEndMinutes),
          endMinutes: newEndMinutes,
          temperature: 20.0,
          slot: this._editingBlocks.length + 1,
        },
      ];

      this._updateValidationWarnings();
    }
  }

  private _removeTimeBlock(index: number): void {
    if (!this._editingBlocks || this._editingBlocks.length <= 1) return;

    // Save state before modification
    this._saveHistoryState();

    this._editingBlocks = this._editingBlocks.filter((_, i) => i !== index);

    // Renumber slots
    this._editingBlocks = this._editingBlocks.map((block, i) => ({
      ...block,
      slot: i + 1,
    }));

    this._updateValidationWarnings();
  }

  private _updateTimeBlock(index: number, updates: Partial<TimeBlock>): void {
    if (!this._editingBlocks) return;

    // Save state before modification
    this._saveHistoryState();

    this._editingBlocks = this._editingBlocks.map((block, i) => {
      if (i !== index) return block;

      const updated = { ...block, ...updates };

      // Recalculate minutes if time changed
      if (updates.endTime) {
        updated.endMinutes = timeToMinutes(updates.endTime);
      }

      return updated;
    });

    // Update start times for subsequent blocks
    for (let i = index + 1; i < this._editingBlocks.length; i++) {
      const prevBlock = this._editingBlocks[i - 1];
      this._editingBlocks[i] = {
        ...this._editingBlocks[i],
        startTime: prevBlock.endTime,
        startMinutes: prevBlock.endMinutes,
      };
    }

    this._editingBlocks = [...this._editingBlocks];
    this._updateValidationWarnings();
  }

  protected render() {
    if (!this._config || !this.hass) {
      return html``;
    }

    const entityOptions = this._getEntityOptions();
    const multipleEntities = entityOptions.length > 1;
    const activeEntityId = this._getActiveEntityId();
    const entityState = activeEntityId ? this.hass.states?.[activeEntityId] : undefined;

    const headerContent = multipleEntities
      ? this._renderEntitySelector(entityOptions, activeEntityId)
      : this._config.name ||
        entityState?.attributes.friendly_name ||
        this._translations.ui.schedule;

    if (!entityState) {
      return html`
        <ha-card>
          <div class="card-header">
            <div class="name">${headerContent}</div>
          </div>
          <div class="card-content">
            <div class="error">
              ${formatString(this._translations.ui.entityNotFound, {
                entity: activeEntityId || this._translations.ui.schedule,
              })}
            </div>
          </div>
        </ha-card>
      `;
    }

    return html`
      <ha-card>
        <div class="card-header">
          <div class="name">${headerContent}</div>
        </div>
        <div class="header-controls">
          ${this._config.show_profile_selector && this._availableProfiles.length > 0
            ? html`
                <select
                  class="profile-selector"
                  @change=${this._handleProfileChange}
                  .value=${this._currentProfile || ""}
                >
                  ${this._availableProfiles.map(
                    (profile) => html`
                      <option value=${profile} ?selected=${profile === this._currentProfile}>
                        ${profile}
                      </option>
                    `,
                  )}
                </select>
              `
            : ""}
          ${this._config?.editable
            ? html`
                <button
                  class="dragdrop-toggle-btn ${this._isDragDropMode ? "active" : ""}"
                  @click=${this._toggleDragDropMode}
                  title="${this._isDragDropMode
                    ? this._translations.ui.disableDragDrop
                    : this._translations.ui.enableDragDrop}"
                >
                  ${this._isDragDropMode ? "🔒" : "✋"}
                </button>
              `
            : ""}
          <button
            class="view-toggle-btn"
            @click=${this._toggleViewMode}
            title="${this._isCompactView
              ? this._translations.ui.toggleFullView
              : this._translations.ui.toggleCompactView}"
          >
            ${this._isCompactView ? "⬜" : "▭"}
          </button>
          <button
            class="export-btn"
            @click=${this._exportSchedule}
            title="${this._translations.ui.exportTooltip}"
            ?disabled=${!this._scheduleData}
          >
            ⬇️
          </button>
          <button
            class="import-btn"
            @click=${this._importSchedule}
            title="${this._translations.ui.importTooltip}"
          >
            ⬆️
          </button>
        </div>

        <div class="card-content">
          ${this._editingWeekday
            ? this._renderEditor()
            : this._scheduleData
              ? this._renderScheduleView()
              : html`<div class="loading">${this._translations.ui.loading}</div>`}
        </div>

        ${this._isLoading
          ? html`
              <div class="loading-overlay">
                <div class="loading-spinner"></div>
              </div>
            `
          : ""}
      </ha-card>
    `;
  }

  private _renderScheduleView() {
    // Check if we have schedule data (either simple or legacy format)
    if (!this._simpleScheduleData && !this._scheduleData) return html``;

    return html`
      <div
        class="schedule-container ${this._isCompactView ? "compact" : ""} ${this._isDragDropMode
          ? "drag-drop-mode"
          : ""}"
      >
        <!-- Time axis on the left -->
        <div class="time-axis">
          <div class="time-axis-header"></div>
          <div class="time-axis-labels">
            ${repeat(
              TIME_LABELS,
              (time) => time.hour,
              (time) => html`
                <div class="time-label" style="top: ${time.position}%">${time.label}</div>
              `,
            )}
          </div>
        </div>

        <!-- Schedule grid -->
        <div class="schedule-grid ${this._isCompactView ? "compact" : ""}">
          ${repeat(
            WEEKDAYS,
            (weekday) => weekday,
            (weekday) => {
              // Try to get blocks from either simple or legacy schedule
              let blocks = this._getParsedBlocks(weekday);

              // If no blocks exist, create a full-day block with base temperature
              if (!blocks || blocks.length === 0) {
                const baseTemp = this._getBaseTemperature(weekday);
                blocks = [
                  {
                    startTime: "00:00",
                    startMinutes: 0,
                    endTime: "24:00",
                    endMinutes: 1440,
                    temperature: baseTemp,
                    slot: 0,
                  },
                ];
              }

              const isCopiedSource = this._copiedSchedule?.weekday === weekday;

              return html`
                <div class="weekday-column ${this._config?.editable ? "editable" : ""}">
                  <div class="weekday-header">
                    <div class="weekday-label">${this._getWeekdayLabel(weekday, "short")}</div>
                    ${this._config?.editable
                      ? html`
                          <div class="weekday-actions">
                            <button
                              class="copy-btn ${isCopiedSource ? "active" : ""}"
                              @click=${(e: Event) => {
                                e.stopPropagation();
                                this._copySchedule(weekday);
                              }}
                              title="${this._translations.ui.copySchedule}"
                            >
                              📋
                            </button>
                            <button
                              class="paste-btn"
                              @click=${(e: Event) => {
                                e.stopPropagation();
                                this._pasteSchedule(weekday);
                              }}
                              title="${this._translations.ui.pasteSchedule}"
                              ?disabled=${!this._copiedSchedule}
                            >
                              📄
                            </button>
                          </div>
                        `
                      : ""}
                  </div>
                  <div
                    class="time-blocks"
                    @click=${() => this._config?.editable && this._handleWeekdayClick(weekday)}
                  >
                    ${repeat(
                      blocks,
                      (block) => block.slot,
                      (block, blockIndex) => {
                        const isActive = this._isBlockActive(weekday, block);

                        // Determine background style based on gradient config
                        let backgroundStyle: string;
                        if (this._config?.show_gradient) {
                          const prevTemp =
                            blockIndex > 0 ? blocks[blockIndex - 1].temperature : null;
                          const nextTemp =
                            blockIndex < blocks.length - 1
                              ? blocks[blockIndex + 1].temperature
                              : null;
                          const gradient = getTemperatureGradient(
                            block.temperature,
                            prevTemp,
                            nextTemp,
                          );
                          backgroundStyle = `background: ${gradient};`;
                        } else {
                          backgroundStyle = `background-color: ${getTemperatureColor(block.temperature)};`;
                        }

                        return html`
                          <div
                            class="time-block ${isActive
                              ? "active"
                              : ""} ${this._pendingChanges.has(weekday) ? "pending" : ""}"
                            style="
                              height: ${((block.endMinutes - block.startMinutes) / 1440) * 100}%;
                              ${backgroundStyle}
                            "
                          >
                            ${this._config?.editable && this._isDragDropMode && blockIndex > 0
                              ? html`
                                  <div
                                    class="drag-handle drag-handle-top"
                                    @mousedown=${(e: MouseEvent) => {
                                      e.stopPropagation();
                                      this._startDrag(e, weekday, blockIndex, "start");
                                    }}
                                    @touchstart=${(e: TouchEvent) => {
                                      e.stopPropagation();
                                      this._startDrag(e, weekday, blockIndex, "start");
                                    }}
                                  ></div>
                                `
                              : ""}
                            ${this._config?.editable && this._isDragDropMode
                              ? html`
                                  <div
                                    class="temperature-drag-area"
                                    @mousedown=${(e: MouseEvent) => {
                                      e.stopPropagation();
                                      this._startDrag(e, weekday, blockIndex, "temperature");
                                    }}
                                    @touchstart=${(e: TouchEvent) => {
                                      e.stopPropagation();
                                      this._startDrag(e, weekday, blockIndex, "temperature");
                                    }}
                                  >
                                    ${this._config?.show_temperature
                                      ? html`<span class="temperature"
                                          >${block.temperature.toFixed(1)}°</span
                                        >`
                                      : ""}
                                  </div>
                                `
                              : this._config?.show_temperature
                                ? html`<span class="temperature"
                                    >${block.temperature.toFixed(1)}°</span
                                  >`
                                : ""}
                            <div class="time-block-tooltip">
                              <div class="tooltip-time">${block.startTime} - ${block.endTime}</div>
                              <div class="tooltip-temp">
                                ${formatTemperature(
                                  block.temperature,
                                  this._config?.temperature_unit,
                                )}
                              </div>
                            </div>
                            ${this._config?.editable &&
                            this._isDragDropMode &&
                            blockIndex < blocks.length - 1
                              ? html`
                                  <div
                                    class="drag-handle drag-handle-bottom"
                                    @mousedown=${(e: MouseEvent) => {
                                      e.stopPropagation();
                                      this._startDrag(e, weekday, blockIndex, "end");
                                    }}
                                    @touchstart=${(e: TouchEvent) => {
                                      e.stopPropagation();
                                      this._startDrag(e, weekday, blockIndex, "end");
                                    }}
                                  ></div>
                                `
                              : ""}
                          </div>
                        `;
                      },
                    )}
                  </div>
                </div>
              `;
            },
          )}

          <!-- Current time indicator line -->
          <div class="current-time-indicator" style="top: ${this._currentTimePercent}%"></div>
        </div>
      </div>

      ${this._pendingChanges.size > 0
        ? html`
            <div class="pending-changes-banner">
              <div class="pending-changes-info">
                <span class="pending-icon">⚠️</span>
                <span class="pending-text">${this._translations.ui.unsavedChanges}</span>
              </div>
              <div class="pending-changes-actions">
                <button class="discard-btn" @click=${this._discardPendingChanges}>
                  ${this._translations.ui.discard}
                </button>
                <button class="save-all-btn" @click=${this._savePendingChanges}>
                  ${this._translations.ui.saveAll}
                </button>
              </div>
            </div>
          `
        : ""}
      ${this._config?.editable && this._pendingChanges.size === 0
        ? html`<div class="hint">${this._translations.ui.clickToEdit}</div>`
        : ""}
    `;
  }

  private _renderEntitySelector(entityIds: string[], activeEntityId?: string) {
    const selected =
      activeEntityId && entityIds.includes(activeEntityId) ? activeEntityId : entityIds[0];
    return html`
      <select
        class="profile-selector entity-selector"
        @change=${this._handleEntitySelection}
        .value=${selected}
      >
        ${[...entityIds]
          .sort((a, b) => a.localeCompare(b))
          .map((entityId) => {
            const label = this.hass?.states?.[entityId]?.attributes.friendly_name || entityId;
            return html`<option value=${entityId}>${label}</option>`;
          })}
      </select>
    `;
  }

  private _handleEntitySelection(e: Event): void {
    const select = e.target as HTMLSelectElement;
    const entityId = select.value;
    if (!entityId || entityId === this._getActiveEntityId()) {
      return;
    }

    this._activeEntityId = entityId;
    this._pendingChanges.clear();
    this._editingWeekday = undefined;
    this._editingBlocks = undefined;
    this._copiedSchedule = undefined;
    this._validationWarnings = [];
    this._isDragDropMode = false;
    this._isDragging = false;
    this._dragState = undefined;
    this._parsedScheduleCache = new WeakMap();
    this._updateFromEntity();
  }

  private _startSlotEdit(editingIndex: number): void {
    if (!this._editingBlocks || editingIndex < 0 || editingIndex >= this._editingBlocks.length)
      return;

    const block = this._editingBlocks[editingIndex];
    this._editingSlotIndex = editingIndex;
    this._editingSlotData = {
      startTime: block.startTime,
      endTime: block.endTime,
      temperature: block.temperature,
    };
  }

  private _startSlotEditFromDisplay(displayIndex: number, displayBlocks: TimeBlock[]): void {
    if (!this._editingBlocks) return;

    const displayBlock = displayBlocks[displayIndex];

    // Find the corresponding block in _editingBlocks
    const editingIndex = this._editingBlocks.findIndex(
      (b) =>
        b.startMinutes === displayBlock.startMinutes &&
        b.endMinutes === displayBlock.endMinutes &&
        b.temperature === displayBlock.temperature,
    );

    if (editingIndex === -1) return;

    this._startSlotEdit(editingIndex);
  }

  private _cancelSlotEdit(): void {
    this._editingSlotIndex = undefined;
    this._editingSlotData = undefined;
  }

  private _saveSlotEdit(): void {
    if (
      this._editingSlotIndex === undefined ||
      !this._editingSlotData ||
      !this._editingBlocks ||
      this._editingBaseTemperature === undefined
    ) {
      return;
    }

    const index = this._editingSlotIndex;
    const { startTime, endTime, temperature } = this._editingSlotData;

    // Create the updated block
    const updatedBlock: TimeBlock = {
      startTime,
      startMinutes: timeToMinutes(startTime),
      endTime,
      endMinutes: timeToMinutes(endTime),
      temperature,
      slot: index + 1,
    };

    // Get existing blocks without the one being edited
    const otherBlocks = this._editingBlocks.filter((_, i) => i !== index);

    // Insert the updated block, handling overlaps
    const newBlocks = insertBlockWithSplitting(
      otherBlocks,
      updatedBlock,
      this._editingBaseTemperature,
    );

    // Sort chronologically and merge consecutive blocks with same temperature
    const sortedBlocks = sortBlocksChronologically(newBlocks);
    const mergedBlocks = mergeConsecutiveBlocks(sortedBlocks);

    // Save history state
    this._saveHistoryState();

    // Update editing blocks
    this._editingBlocks = mergedBlocks;
    this._editingSlotIndex = undefined;
    this._editingSlotData = undefined;

    // Update validation warnings
    this._updateValidationWarnings();
  }

  private _addNewSlot(): void {
    if (!this._editingBlocks || this._editingBaseTemperature === undefined) return;
    if (this._editingBlocks.length >= 12) return;

    // Find the first available gap or add at end
    let newStartMinutes = 0;
    let newEndMinutes = 60; // Default 1 hour slot

    if (this._editingBlocks.length > 0) {
      const sortedBlocks = sortBlocksChronologically(this._editingBlocks);
      const lastBlock = sortedBlocks[sortedBlocks.length - 1];

      // Check if there's room after the last block
      if (lastBlock.endMinutes < 1440) {
        newStartMinutes = lastBlock.endMinutes;
        newEndMinutes = Math.min(newStartMinutes + 60, 1440);
      } else {
        // Find a gap in existing blocks
        let foundGap = false;
        for (let i = 0; i < sortedBlocks.length; i++) {
          const expectedStart = i === 0 ? 0 : sortedBlocks[i - 1].endMinutes;
          if (sortedBlocks[i].startMinutes > expectedStart) {
            newStartMinutes = expectedStart;
            newEndMinutes = sortedBlocks[i].startMinutes;
            foundGap = true;
            break;
          }
        }
        if (!foundGap) {
          // No gaps available, don't add
          return;
        }
      }
    }

    const newBlock: TimeBlock = {
      startTime: minutesToTime(newStartMinutes),
      startMinutes: newStartMinutes,
      endTime: minutesToTime(newEndMinutes),
      endMinutes: newEndMinutes,
      temperature: this._editingBaseTemperature,
      slot: this._editingBlocks.length + 1,
    };

    // Save history state
    this._saveHistoryState();

    // Insert the new block
    const newBlocks = insertBlockWithSplitting(
      this._editingBlocks,
      newBlock,
      this._editingBaseTemperature,
    );
    const mergedBlocks = mergeConsecutiveBlocks(sortBlocksChronologically(newBlocks));

    this._editingBlocks = mergedBlocks;

    // Start editing the newly added slot
    const newIndex = mergedBlocks.findIndex(
      (b) => b.startMinutes === newStartMinutes && b.endMinutes === newEndMinutes,
    );
    if (newIndex >= 0) {
      this._startSlotEdit(newIndex);
    }

    this._updateValidationWarnings();
  }

  private _renderEditor() {
    if (!this._editingWeekday || !this._editingBlocks) return html``;

    // Fill gaps with base temperature for display
    const displayBlocks =
      this._editingBaseTemperature !== undefined
        ? fillGapsWithBaseTemperature(this._editingBlocks, this._editingBaseTemperature)
        : this._editingBlocks;

    return html`
      <div class="editor">
        <div class="editor-header">
          <h3>
            ${formatString(this._translations.ui.edit, {
              weekday: this._getWeekdayLabel(this._editingWeekday, "long"),
            })}
          </h3>
          <div class="editor-actions">
            <button
              class="undo-btn"
              @click=${this._undo}
              ?disabled=${!this._canUndo()}
              title="${this._translations.ui.undoShortcut}"
            >
              ↶
            </button>
            <button
              class="redo-btn"
              @click=${this._redo}
              ?disabled=${!this._canRedo()}
              title="${this._translations.ui.redoShortcut}"
            >
              ↷
            </button>
            <button class="close-btn" @click=${this._closeEditor}>✕</button>
          </div>
        </div>

        ${this._validationWarnings.length > 0
          ? html`
              <div class="validation-warnings">
                <div class="warnings-header">
                  <span class="warning-icon">⚠️</span>
                  <span class="warnings-title">${this._translations.warnings.title}</span>
                </div>
                <ul class="warnings-list">
                  ${this._validationWarnings.map(
                    (warning) =>
                      html`<li class="warning-item">
                        ${this._translateValidationMessage(warning)}
                      </li>`,
                  )}
                </ul>
              </div>
            `
          : ""}

        <!-- Base Temperature Section -->
        <div class="base-temperature-section">
          <div class="base-temperature-header">
            <span class="base-temp-label">${this._translations.ui.baseTemperature}</span>
            <span class="base-temp-description"
              >${this._translations.ui.baseTemperatureDescription}</span
            >
          </div>
          <div class="base-temperature-input">
            <input
              type="number"
              class="temp-input base-temp-input"
              .value=${this._editingBaseTemperature?.toString() || "20.0"}
              step=${this._tempStep}
              min=${this._minTemp}
              max=${this._maxTemp}
              @change=${(e: Event) => {
                this._saveHistoryState();
                this._editingBaseTemperature = parseFloat((e.target as HTMLInputElement).value);
                this.requestUpdate();
              }}
            />
            <span class="temp-unit">${this._config?.temperature_unit || "°C"}</span>
            <div
              class="color-indicator"
              style="background-color: ${getTemperatureColor(this._editingBaseTemperature || 20.0)}"
            ></div>
          </div>
        </div>

        <div class="editor-content-label">${this._translations.ui.temperaturePeriods}</div>
        <div class="editor-content">
          <div class="time-block-header">
            <span class="header-cell header-from">${this._translations.ui.from}</span>
            <span class="header-cell header-to">${this._translations.ui.to}</span>
            <span class="header-cell header-temp">Temp</span>
            <span class="header-cell header-actions"></span>
          </div>
          ${displayBlocks.map((block, displayIndex) => {
            // Find if this display block corresponds to an editing block
            const editingIndex = this._editingBlocks!.findIndex(
              (b) =>
                b.startMinutes === block.startMinutes &&
                b.endMinutes === block.endMinutes &&
                b.temperature === block.temperature,
            );

            const isActualBlock = editingIndex !== -1;
            const isEditing =
              this._editingSlotIndex !== undefined &&
              this._editingSlotIndex === editingIndex &&
              this._editingSlotData !== undefined;

            const isBaseTemp = !isActualBlock;

            if (isEditing && this._editingSlotData) {
              // Editing mode for this slot
              return html`
                <div class="time-block-editor editing">
                  <input
                    type="time"
                    class="time-input"
                    .value=${this._editingSlotData.startTime}
                    step="${(this._config?.time_step_minutes || 15) * 60}"
                    @change=${(e: Event) => {
                      if (this._editingSlotData) {
                        this._editingSlotData = {
                          ...this._editingSlotData,
                          startTime: (e.target as HTMLInputElement).value,
                        };
                        this.requestUpdate();
                      }
                    }}
                  />
                  <input
                    type="time"
                    class="time-input"
                    .value=${this._editingSlotData.endTime === "24:00"
                      ? "23:59"
                      : this._editingSlotData.endTime}
                    step="${(this._config?.time_step_minutes || 15) * 60}"
                    @change=${(e: Event) => {
                      if (this._editingSlotData) {
                        let value = (e.target as HTMLInputElement).value;
                        // Convert 23:59 to 24:00 for end of day
                        if (value === "23:59") value = "24:00";
                        this._editingSlotData = {
                          ...this._editingSlotData,
                          endTime: value,
                        };
                        this.requestUpdate();
                      }
                    }}
                  />
                  <div class="temp-input-group">
                    <input
                      type="number"
                      class="temp-input"
                      .value=${this._editingSlotData.temperature.toString()}
                      step=${this._tempStep}
                      min=${this._minTemp}
                      max=${this._maxTemp}
                      @change=${(e: Event) => {
                        if (this._editingSlotData) {
                          this._editingSlotData = {
                            ...this._editingSlotData,
                            temperature: parseFloat((e.target as HTMLInputElement).value),
                          };
                          this.requestUpdate();
                        }
                      }}
                    />
                    <span class="temp-unit">${this._config?.temperature_unit || "°C"}</span>
                  </div>
                  <div class="slot-actions">
                    <button class="slot-save-btn" @click=${this._saveSlotEdit}>
                      ${this._translations.ui.saveSlot}
                    </button>
                    <button class="slot-cancel-btn" @click=${this._cancelSlotEdit}>
                      ${this._translations.ui.cancelSlotEdit}
                    </button>
                  </div>
                  <div
                    class="color-indicator"
                    style="background-color: ${getTemperatureColor(
                      this._editingSlotData.temperature,
                    )}"
                  ></div>
                </div>
              `;
            }

            // Display mode for this slot
            return html`
              <div class="time-block-editor ${isBaseTemp ? "base-temp-slot" : ""}">
                <span class="time-display">${block.startTime}</span>
                <span class="time-display">${block.endTime}</span>
                <div class="temp-display-group">
                  <span class="temp-display">${block.temperature.toFixed(1)}</span>
                  <span class="temp-unit">${this._config?.temperature_unit || "°C"}</span>
                </div>
                <div class="slot-actions">
                  ${isBaseTemp
                    ? html``
                    : html`
                        <button
                          class="slot-edit-btn"
                          @click=${() =>
                            this._startSlotEditFromDisplay(displayIndex, displayBlocks)}
                          ?disabled=${this._editingSlotIndex !== undefined}
                        >
                          ${this._translations.ui.editSlot}
                        </button>
                        <button
                          class="remove-btn"
                          @click=${() => this._removeTimeBlockByIndex(displayIndex, displayBlocks)}
                          ?disabled=${this._editingSlotIndex !== undefined}
                        >
                          🗑️
                        </button>
                      `}
                </div>
                <div
                  class="color-indicator"
                  style="background-color: ${getTemperatureColor(block.temperature)}"
                ></div>
              </div>
            `;
          })}
          ${this._editingBlocks.length < 12 && this._editingSlotIndex === undefined
            ? html`
                <button class="add-btn" @click=${this._addNewSlot}>
                  ${this._translations.ui.addTimeBlock}
                </button>
              `
            : ""}
        </div>

        <div class="editor-footer">
          <button class="cancel-btn" @click=${this._closeEditor}>
            ${this._translations.ui.cancel}
          </button>
          <button class="save-btn" @click=${this._saveSchedule}>
            ${this._translations.ui.save}
          </button>
        </div>
      </div>
    `;
  }

  private _removeTimeBlockByIndex(displayIndex: number, displayBlocks: TimeBlock[]): void {
    if (!this._editingBlocks || this._editingBaseTemperature === undefined) return;

    const blockToRemove = displayBlocks[displayIndex];

    // Find the corresponding block in _editingBlocks
    const editingIndex = this._editingBlocks.findIndex(
      (b) =>
        b.startMinutes === blockToRemove.startMinutes &&
        b.endMinutes === blockToRemove.endMinutes &&
        b.temperature === blockToRemove.temperature,
    );

    if (editingIndex === -1) return;

    // Save history state
    this._saveHistoryState();

    // Remove the block
    const newBlocks = this._editingBlocks.filter((_, i) => i !== editingIndex);

    // Merge consecutive blocks with same temperature
    this._editingBlocks = mergeConsecutiveBlocks(sortBlocksChronologically(newBlocks));

    this._updateValidationWarnings();
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      ha-card {
        padding: 16px;
      }

      .card-header {
        display: block;
        margin-bottom: 8px;
      }

      .name {
        font-size: 24px;
        font-weight: 400;
        color: var(--primary-text-color);
        margin-bottom: 8px;
      }

      .header-controls {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        margin-bottom: 24px;
      }

      .profile-selector {
        padding: 8px 12px;
        border: 1px solid var(--divider-color);
        border-radius: 4px;
        background-color: var(--card-background-color);
        color: var(--primary-text-color);
        font-size: 14px;
        cursor: pointer;
      }

      .entity-selector {
        width: 100%;
        font-size: 16px;
      }

      .view-toggle-btn {
        padding: 8px 12px;
        border: 1px solid var(--divider-color);
        border-radius: 4px;
        background-color: var(--card-background-color);
        color: var(--primary-text-color);
        font-size: 18px;
        cursor: pointer;
        transition: background-color 0.2s;
        line-height: 1;
      }

      .view-toggle-btn:hover {
        background-color: var(--divider-color);
      }

      .export-btn,
      .import-btn {
        padding: 8px 12px;
        border: 1px solid var(--divider-color);
        border-radius: 4px;
        background-color: var(--card-background-color);
        color: var(--primary-text-color);
        font-size: 18px;
        cursor: pointer;
        transition: background-color 0.2s;
        line-height: 1;
      }

      .export-btn:hover,
      .import-btn:hover {
        background-color: var(--divider-color);
      }

      .export-btn:disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }

      .export-btn:disabled:hover {
        background-color: var(--card-background-color);
      }

      .card-content {
        position: relative;
      }

      .schedule-container {
        display: flex;
        gap: 8px;
        min-height: 400px;
        overflow-x: auto;
        overflow-y: visible;
        width: 100%;
        box-sizing: border-box;
      }

      /* Time axis on the left */
      .time-axis {
        display: flex;
        flex-direction: column;
        min-width: 50px;
        flex-shrink: 0;
      }

      .time-axis-header {
        height: 36px;
        flex-shrink: 0;
      }

      .time-axis-labels {
        position: relative;
        flex: 1;
        border-right: 2px solid var(--divider-color);
      }

      .time-label {
        position: absolute;
        right: 8px;
        transform: translateY(-50%);
        font-size: 11px;
        color: var(--secondary-text-color);
        white-space: nowrap;
      }

      .schedule-grid {
        display: grid;
        grid-template-columns: repeat(7, minmax(0, 1fr));
        gap: 8px;
        flex: 1;
        min-width: 0;
        overflow: visible;
        position: relative;
      }

      /* Compact view styles */
      .schedule-container.compact {
        gap: 4px;
      }

      .schedule-grid.compact {
        gap: 4px;
      }

      .schedule-grid.compact .weekday-column {
        min-width: 50px;
      }

      .schedule-grid.compact .weekday-header {
        padding: 2px 4px;
        font-size: 11px;
      }

      .schedule-grid.compact .weekday-label {
        font-size: 11px;
      }

      .schedule-grid.compact .weekday-actions {
        display: none;
      }

      .schedule-grid.compact .temperature {
        font-size: 10px;
      }

      .current-time-indicator {
        position: absolute;
        left: 0;
        right: 0;
        height: 2px;
        background-color: var(--error-color, #ff0000);
        border-top: 2px dashed var(--error-color, #ff0000);
        pointer-events: none;
        z-index: 100;
        transform: translateY(-50%);
        box-shadow: 0 0 4px rgba(255, 0, 0, 0.5);
        will-change: top;
      }

      .current-time-indicator::before {
        content: "";
        position: absolute;
        left: -6px;
        top: 50%;
        transform: translateY(-50%);
        width: 8px;
        height: 8px;
        background-color: var(--error-color, #ff0000);
        border-radius: 50%;
        box-shadow: 0 0 4px rgba(255, 0, 0, 0.7);
      }

      .weekday-column {
        display: flex;
        flex-direction: column;
        border: 1px solid var(--divider-color);
        border-radius: 4px;
        overflow: visible;
      }

      .weekday-column.editable .time-blocks {
        cursor: pointer;
      }

      .weekday-column.editable {
        will-change: transform, box-shadow;
      }

      .weekday-column.editable:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      }

      /* Disable hover effects when in drag & drop mode */
      .schedule-container.drag-drop-mode .weekday-column.editable:hover {
        transform: none;
        box-shadow: none;
      }

      .weekday-header {
        padding: 4px 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        background-color: var(--primary-color);
        color: var(--text-primary-color);
      }

      .weekday-label {
        font-weight: 500;
        font-size: 14px;
      }

      .weekday-actions {
        display: flex;
        gap: 4px;
      }

      .copy-btn,
      .paste-btn {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 14px;
        padding: 2px 4px;
        border-radius: 3px;
        transition: background-color 0.2s;
        opacity: 0.7;
      }

      .copy-btn:hover,
      .paste-btn:not(:disabled):hover {
        opacity: 1;
        background-color: rgba(255, 255, 255, 0.2);
      }

      .copy-btn.active {
        opacity: 1;
        background-color: rgba(255, 255, 255, 0.3);
        animation: pulse 1s ease-in-out;
        will-change: transform;
      }

      @keyframes pulse {
        0%,
        100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.1);
        }
      }

      .paste-btn:disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }

      .time-blocks {
        flex: 1;
        display: flex;
        flex-direction: column;
        position: relative;
        overflow: visible;
      }

      .time-block {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 12px;
        font-weight: 500;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
        transition: opacity 0.2s;
        cursor: pointer;
      }

      .time-block:hover {
        opacity: 0.9;
      }

      .time-block:hover .time-block-tooltip {
        opacity: 1;
        visibility: visible;
      }

      /* Disable hover effects when in drag & drop mode */
      .schedule-container.drag-drop-mode .time-block:hover {
        opacity: 1;
      }

      .schedule-container.drag-drop-mode .time-block:hover .time-block-tooltip {
        opacity: 0;
        visibility: hidden;
      }

      .temperature {
        user-select: none;
        position: relative;
        z-index: 1;
      }

      /* Active block highlighting */
      .time-block.active {
        box-shadow:
          inset 0 0 0 3px rgba(255, 255, 255, 0.9),
          0 0 20px rgba(255, 255, 255, 0.6),
          0 0 30px rgba(255, 255, 255, 0.4);
        animation: pulse-glow 2s ease-in-out infinite;
        z-index: 10;
        will-change: box-shadow;
      }

      @keyframes pulse-glow {
        0%,
        100% {
          box-shadow:
            inset 0 0 0 3px rgba(255, 255, 255, 0.9),
            0 0 15px rgba(255, 255, 255, 0.5),
            0 0 25px rgba(255, 255, 255, 0.3);
        }
        50% {
          box-shadow:
            inset 0 0 0 3px rgba(255, 255, 255, 1),
            0 0 25px rgba(255, 255, 255, 0.8),
            0 0 40px rgba(255, 255, 255, 0.6);
        }
      }

      /* Tooltip styling */
      .time-block-tooltip {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: rgba(0, 0, 0, 0.95);
        color: white;
        padding: 6px 10px;
        border-radius: 4px;
        font-size: 10px;
        white-space: nowrap;
        opacity: 0;
        visibility: hidden;
        transition:
          opacity 0.2s,
          visibility 0.2s;
        z-index: 1000;
        pointer-events: none;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
        min-width: 80px;
      }

      .tooltip-time {
        font-weight: 500;
        margin-bottom: 2px;
        text-align: center;
        font-size: 10px;
        line-height: 1.2;
      }

      .tooltip-temp {
        text-align: center;
        font-size: 11px;
        font-weight: 600;
        line-height: 1.2;
      }

      /* Drag and Drop Styles */
      .time-block.pending {
        outline: 2px dashed var(--warning-color, #ff9800);
        outline-offset: -2px;
      }

      .drag-handle {
        position: absolute;
        left: 0;
        right: 0;
        height: 8px;
        cursor: ns-resize;
        z-index: 20;
        background: rgba(255, 255, 255, 0);
        transition: background 0.2s;
      }

      .drag-handle:hover {
        background: rgba(255, 255, 255, 0.3);
      }

      .drag-handle-top {
        top: 0;
        border-top: 2px solid rgba(255, 255, 255, 0);
      }

      .drag-handle-top:hover {
        border-top: 2px solid rgba(255, 255, 255, 0.8);
      }

      .drag-handle-bottom {
        bottom: 0;
        border-bottom: 2px solid rgba(255, 255, 255, 0);
      }

      .drag-handle-bottom:hover {
        border-bottom: 2px solid rgba(255, 255, 255, 0.8);
      }

      /* Temperature Drag Area */
      .temperature-drag-area {
        position: absolute;
        top: 8px;
        bottom: 8px;
        left: 0;
        right: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: ns-resize;
        z-index: 10;
        user-select: none;
      }

      .temperature-drag-area:hover {
        background: rgba(255, 255, 255, 0.1);
      }

      .temperature-drag-area .temperature {
        pointer-events: none;
      }

      /* Pending Changes Banner */
      .pending-changes-banner {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 16px;
        padding: 12px 16px;
        background-color: var(--warning-color, #ff9800);
        color: white;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      }

      .pending-changes-info {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .pending-icon {
        font-size: 18px;
      }

      .pending-text {
        font-weight: 500;
        font-size: 14px;
      }

      .pending-changes-actions {
        display: flex;
        gap: 8px;
      }

      .discard-btn,
      .save-all-btn {
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
      }

      .discard-btn {
        background-color: rgba(255, 255, 255, 0.2);
        color: white;
      }

      .discard-btn:hover {
        background-color: rgba(255, 255, 255, 0.3);
      }

      .save-all-btn {
        background-color: var(--primary-color);
        color: var(--text-primary-color);
      }

      .save-all-btn:hover {
        background-color: var(--primary-color);
        filter: brightness(1.1);
      }

      .hint {
        margin-top: 12px;
        text-align: center;
        font-size: 12px;
        color: var(--secondary-text-color);
      }

      .loading,
      .error {
        padding: 20px;
        text-align: center;
        color: var(--secondary-text-color);
      }

      .error {
        color: var(--error-color);
      }

      /* Editor Styles */
      .editor {
        background-color: var(--card-background-color);
      }

      .editor-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        padding-bottom: 12px;
        border-bottom: 1px solid var(--divider-color);
      }

      .editor-header h3 {
        margin: 0;
        font-size: 20px;
        font-weight: 500;
      }

      .editor-actions {
        display: flex;
        gap: 8px;
        align-items: center;
      }

      .undo-btn,
      .redo-btn,
      .close-btn {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: var(--secondary-text-color);
        padding: 0;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition:
          background-color 0.2s,
          opacity 0.2s;
      }

      .undo-btn:hover:not(:disabled),
      .redo-btn:hover:not(:disabled),
      .close-btn:hover {
        background-color: var(--divider-color);
      }

      .undo-btn:disabled,
      .redo-btn:disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }

      .validation-warnings {
        background-color: rgba(255, 152, 0, 0.1);
        border: 1px solid rgba(255, 152, 0, 0.3);
        border-radius: 4px;
        padding: 12px;
        margin: 12px 0;
      }

      .warnings-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
        font-weight: 500;
        color: var(--primary-text-color);
      }

      .warning-icon {
        font-size: 18px;
      }

      .warnings-title {
        font-size: 14px;
      }

      .warnings-list {
        margin: 0;
        padding-left: 28px;
        list-style-type: disc;
      }

      .warning-item {
        color: var(--secondary-text-color);
        font-size: 13px;
        line-height: 1.6;
        margin: 4px 0;
      }

      /* Base Temperature Section */
      .base-temperature-section {
        background-color: rgba(var(--rgb-primary-color, 3, 169, 244), 0.1);
        border: 1px solid var(--divider-color);
        border-radius: 4px;
        padding: 12px;
        margin: 12px 0;
      }

      .base-temperature-header {
        display: flex;
        flex-direction: column;
        gap: 4px;
        margin-bottom: 8px;
      }

      .base-temp-label {
        font-weight: 500;
        font-size: 14px;
        color: var(--primary-text-color);
      }

      .base-temp-description {
        font-size: 12px;
        color: var(--secondary-text-color);
      }

      .base-temperature-input {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .base-temp-input {
        width: 80px;
        font-weight: 500;
      }

      .editor-content-label {
        font-weight: 500;
        font-size: 14px;
        color: var(--primary-text-color);
        margin: 16px 0 8px 0;
        padding-left: 8px;
      }

      .editor-content {
        max-height: 500px;
        overflow-y: auto;
      }

      .time-block-header {
        display: grid;
        grid-template-columns: 70px 70px 90px 1fr 24px;
        gap: 8px;
        align-items: center;
        padding: 8px;
        border-bottom: 2px solid var(--divider-color);
        font-weight: 500;
        font-size: 12px;
        color: var(--secondary-text-color);
        text-transform: uppercase;
      }

      .header-cell {
        text-align: left;
      }

      .time-block-editor {
        display: grid;
        grid-template-columns: 70px 70px 90px 1fr 24px;
        gap: 8px;
        align-items: center;
        padding: 8px;
        border-bottom: 1px solid var(--divider-color);
      }

      .time-block-editor.editing {
        background-color: var(--primary-color-light, rgba(3, 169, 244, 0.1));
        border: 1px solid var(--primary-color);
        border-radius: 4px;
        margin: 4px 0;
      }

      .time-block-editor.base-temp-slot {
        opacity: 0.6;
        background-color: var(--divider-color);
      }

      .time-display {
        font-size: 14px;
        color: var(--primary-text-color);
        font-family: monospace;
      }

      .temp-display-group,
      .temp-input-group {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .temp-display {
        font-size: 14px;
        color: var(--primary-text-color);
        font-weight: 500;
      }

      .slot-actions {
        display: flex;
        gap: 4px;
        justify-content: flex-end;
      }

      .slot-edit-btn,
      .slot-save-btn,
      .slot-cancel-btn {
        padding: 4px 8px;
        border: 1px solid var(--divider-color);
        border-radius: 4px;
        background-color: var(--card-background-color);
        color: var(--primary-text-color);
        font-size: 12px;
        cursor: pointer;
        white-space: nowrap;
      }

      .slot-edit-btn:hover,
      .slot-save-btn:hover,
      .slot-cancel-btn:hover {
        background-color: var(--divider-color);
      }

      .slot-save-btn {
        background-color: var(--primary-color);
        color: var(--text-primary-color);
        border-color: var(--primary-color);
      }

      .slot-cancel-btn {
        background-color: var(--error-color, #e74c3c);
        color: white;
        border-color: var(--error-color, #e74c3c);
      }

      .slot-edit-btn:disabled,
      .remove-btn:disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }

      .block-number {
        font-weight: 500;
        color: var(--secondary-text-color);
      }

      .time-input,
      .temp-input {
        padding: 6px 8px;
        border: 1px solid var(--divider-color);
        border-radius: 4px;
        background-color: var(--card-background-color);
        color: var(--primary-text-color);
        font-size: 14px;
        width: 100%;
        box-sizing: border-box;
      }

      .time-input {
        max-width: 70px;
      }

      .temp-input {
        max-width: 60px;
      }

      .temp-unit {
        color: var(--secondary-text-color);
        font-size: 14px;
      }

      .remove-btn {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 18px;
        padding: 4px;
      }

      .remove-btn:hover {
        opacity: 0.7;
      }

      .color-indicator {
        width: 20px;
        height: 20px;
        border-radius: 4px;
        border: 1px solid var(--divider-color);
        flex-shrink: 0;
      }

      .add-btn {
        margin: 12px 0;
        padding: 10px 16px;
        background-color: var(--primary-color);
        color: var(--text-primary-color);
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        width: 100%;
      }

      .add-btn:hover {
        opacity: 0.9;
      }

      .editor-footer {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px solid var(--divider-color);
      }

      .cancel-btn,
      .save-btn {
        padding: 10px 24px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
      }

      .cancel-btn {
        background-color: var(--divider-color);
        color: var(--primary-text-color);
      }

      .save-btn {
        background-color: var(--primary-color);
        color: var(--text-primary-color);
      }

      .cancel-btn:hover,
      .save-btn:hover {
        opacity: 0.9;
      }

      /* Loading overlay */
      .loading-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        border-radius: 4px;
      }

      .loading-spinner {
        width: 50px;
        height: 50px;
        border: 5px solid rgba(255, 255, 255, 0.3);
        border-top-color: var(--primary-color);
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      /* Mobile Optimization */
      @media (max-width: 768px) {
        ha-card {
          padding: 12px;
        }

        .card-header {
          flex-direction: column;
          align-items: stretch;
          gap: 12px;
          margin-bottom: 12px;
        }

        .name {
          font-size: 20px;
          text-align: center;
        }

        .header-controls {
          justify-content: center;
          flex-wrap: wrap;
        }

        .profile-selector,
        .view-toggle-btn,
        .export-btn,
        .import-btn {
          min-height: 44px;
          padding: 10px 16px;
          font-size: 16px;
        }

        .schedule-container {
          gap: 4px;
          min-height: 350px;
        }

        .time-axis {
          min-width: 40px;
        }

        .time-label {
          font-size: 10px;
          right: 4px;
        }

        .schedule-grid {
          gap: 4px;
        }

        .weekday-header {
          padding: 6px 4px;
        }

        .weekday-label {
          font-size: 12px;
        }

        .weekday-actions {
          gap: 6px;
        }

        .copy-btn,
        .paste-btn {
          font-size: 16px;
          padding: 6px 8px;
          min-width: 44px;
          min-height: 44px;
        }

        .temperature {
          font-size: 11px;
        }

        .time-block-tooltip {
          font-size: 11px;
          padding: 8px 12px;
        }

        .hint {
          font-size: 14px;
        }

        /* Editor mobile styles */
        .editor-header h3 {
          font-size: 18px;
        }

        .undo-btn,
        .redo-btn,
        .close-btn {
          width: 44px;
          height: 44px;
          font-size: 28px;
        }

        .editor-content {
          max-height: 400px;
        }

        .time-block-editor {
          grid-template-columns: 30px 1fr 70px 40px 44px 20px;
          gap: 6px;
          padding: 10px 6px;
        }

        .block-number {
          font-size: 13px;
        }

        .time-input,
        .temp-input {
          padding: 10px 8px;
          font-size: 16px;
          min-height: 44px;
        }

        .temp-unit {
          font-size: 13px;
        }

        .remove-btn {
          font-size: 22px;
          padding: 8px;
          min-width: 44px;
          min-height: 44px;
        }

        .add-btn {
          padding: 14px 16px;
          font-size: 16px;
          min-height: 48px;
        }

        .editor-footer {
          flex-direction: column-reverse;
          gap: 8px;
        }

        .cancel-btn,
        .save-btn {
          width: 100%;
          padding: 14px 24px;
          font-size: 16px;
          min-height: 48px;
        }

        .validation-warnings {
          padding: 10px;
          margin: 10px 0;
        }

        .warnings-title {
          font-size: 13px;
        }

        .warning-item {
          font-size: 12px;
        }
      }

      /* Small mobile devices (portrait phones) */
      @media (max-width: 480px) {
        ha-card {
          padding: 8px;
        }

        .name {
          font-size: 18px;
        }

        .schedule-container {
          gap: 2px;
          min-height: 300px;
        }

        .time-axis {
          min-width: 35px;
        }

        .time-label {
          font-size: 9px;
          right: 2px;
        }

        .schedule-grid {
          gap: 2px;
        }

        .weekday-label {
          font-size: 11px;
        }

        .temperature {
          font-size: 10px;
        }

        .time-block-editor {
          grid-template-columns: 25px 1fr 60px 35px 44px 16px;
          gap: 4px;
          padding: 8px 4px;
        }

        .block-number {
          font-size: 12px;
        }

        .editor-header h3 {
          font-size: 16px;
        }
      }

      /* Landscape mobile optimization */
      @media (max-width: 768px) and (orientation: landscape) {
        .schedule-container {
          min-height: 250px;
        }

        .editor-content {
          max-height: 200px;
        }
      }

      /* Touch-specific optimizations */
      @media (hover: none) and (pointer: coarse) {
        .weekday-column.editable:hover {
          transform: none;
          box-shadow: none;
        }

        .weekday-column.editable:active {
          transform: scale(0.98);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .time-block:hover {
          opacity: 1;
        }

        .time-block:active {
          opacity: 0.85;
        }

        /* Show tooltip on tap instead of hover */
        .time-block:active .time-block-tooltip {
          opacity: 1;
          visibility: visible;
        }

        /* Disable hover effects, use active states */
        .copy-btn:hover,
        .paste-btn:not(:disabled):hover,
        .undo-btn:hover:not(:disabled),
        .redo-btn:hover:not(:disabled),
        .close-btn:hover,
        .add-btn:hover,
        .cancel-btn:hover,
        .save-btn:hover,
        .view-toggle-btn:hover,
        .export-btn:hover,
        .import-btn:hover,
        .remove-btn:hover {
          opacity: 1;
          background-color: transparent;
        }

        .copy-btn:active,
        .paste-btn:not(:disabled):active {
          background-color: rgba(255, 255, 255, 0.3);
        }

        .undo-btn:active:not(:disabled),
        .redo-btn:active:not(:disabled),
        .close-btn:active {
          background-color: var(--divider-color);
        }

        .view-toggle-btn:active,
        .export-btn:active:not(:disabled),
        .import-btn:active {
          background-color: var(--divider-color);
        }

        .add-btn:active,
        .save-btn:active {
          opacity: 0.85;
        }

        .cancel-btn:active {
          opacity: 0.85;
        }

        .remove-btn:active {
          opacity: 0.5;
        }
      }
    `;
  }
}

// Declare the custom element for Home Assistant
declare global {
  interface HTMLElementTagNameMap {
    "homematicip-local-climate-schedule-card": HomematicScheduleCard;
  }
  interface Window {
    customCards?: Array<{
      type: string;
      name: string;
      description: string;
      preview?: boolean;
    }>;
  }
}

// Register the card with Home Assistant
window.customCards = window.customCards || [];
window.customCards.push({
  type: "homematicip-local-climate-schedule-card",
  name: "Homematic(IP) Local Climate Schedule Card",
  description: "Display and edit Homematic thermostat schedules",
  preview: true,
});

console.info(
  "%c HOMEMATICIP-LOCAL-CLIMATE-SCHEDULE-CARD %c v0.4.0 ",
  "color: white; background: #3498db; font-weight: 700;",
  "color: #3498db; background: white; font-weight: 700;",
);
