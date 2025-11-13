import { LitElement, html, css, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  HomematicScheduleCardConfig,
  HomeAssistant,
  ScheduleEntityAttributes,
  WEEKDAYS,
  ProfileData,
  Weekday,
} from "./types";
import {
  parseWeekdaySchedule,
  timeBlocksToWeekdayData,
  convertToBackendFormat,
  validateWeekdayData,
  validateTimeBlocks,
  validateProfileData,
  getTemperatureColor,
  getTemperatureGradient,
  formatTemperature,
  TimeBlock,
  minutesToTime,
  timeToMinutes,
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

@customElement("homematic-schedule-card")
export class HomematicScheduleCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config?: HomematicScheduleCardConfig;
  @state() private _currentProfile?: string;
  @state() private _scheduleData?: ProfileData;
  @state() private _availableProfiles: string[] = [];
  @state() private _editingWeekday?: Weekday;
  @state() private _editingBlocks?: TimeBlock[];
  @state() private _copiedSchedule?: { weekday: Weekday; blocks: TimeBlock[] };
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
  @state() private _validationWarnings: string[] = [];
  private _parsedScheduleCache: Map<string, TimeBlock[]> = new Map();
  private _weekdayLabelMap?: Record<Weekday, string>;
  @state() private _pendingChanges: Map<Weekday, TimeBlock[]> = new Map();
  @state() private _isDragging: boolean = false;
  @state() private _isDragDropMode: boolean = false;
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
    if (!config.entity) {
      throw new Error("You need to define an entity");
    }
    this._config = {
      show_profile_selector: true,
      editable: true,
      show_temperature: true,
      temperature_unit: "°C",
      hour_format: "24",
      ...config,
    };

    // Set language from config or detect from Home Assistant
    this._updateLanguage();
  }

  private _updateLanguage(): void {
    let language = "en"; // Default to English

    // Priority 1: Explicit language setting in card config
    if (this._config?.language) {
      language = this._config.language;
    }
    // Priority 2: Home Assistant language setting
    else if (this.hass?.language) {
      language = this.hass.language;
    }
    // Priority 3: Home Assistant locale setting
    else if (this.hass?.locale?.language) {
      language = this.hass.locale.language;
    }

    // Load translations for the detected language
    this._translations = getTranslations(language);

    // Cache weekday label map to avoid recreating on every call
    this._weekdayLabelMap = {
      MONDAY: this._translations.weekdays.monday,
      TUESDAY: this._translations.weekdays.tuesday,
      WEDNESDAY: this._translations.weekdays.wednesday,
      THURSDAY: this._translations.weekdays.thursday,
      FRIDAY: this._translations.weekdays.friday,
      SATURDAY: this._translations.weekdays.saturday,
      SUNDAY: this._translations.weekdays.sunday,
    };
  }

  private _getWeekdayLabel(weekday: Weekday): string {
    // Use cached map instead of recreating on every call
    if (!this._weekdayLabelMap) {
      this._weekdayLabelMap = {
        MONDAY: this._translations.weekdays.monday,
        TUESDAY: this._translations.weekdays.tuesday,
        WEDNESDAY: this._translations.weekdays.wednesday,
        THURSDAY: this._translations.weekdays.thursday,
        FRIDAY: this._translations.weekdays.friday,
        SATURDAY: this._translations.weekdays.saturday,
        SUNDAY: this._translations.weekdays.sunday,
      };
    }
    return this._weekdayLabelMap[weekday];
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

      const oldEntity = oldHass.states?.[this._config.entity];
      const newEntity = newHass.states?.[this._config.entity];

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

      // Update language if Home Assistant language changed
      if (changedProps.get("hass")) {
        const oldHass = changedProps.get("hass") as HomeAssistant | undefined;
        const newLanguage = this.hass?.language || this.hass?.locale?.language;
        const oldLanguage = oldHass?.language || oldHass?.locale?.language;

        if (newLanguage !== oldLanguage) {
          this._updateLanguage();
        }
      }
    }
  }

  private _updateFromEntity(): void {
    if (!this.hass || !this._config) return;

    const entityState = this.hass.states?.[this._config.entity];
    if (!entityState) return;

    const attrs = entityState.attributes as ScheduleEntityAttributes;

    this._currentProfile = this._config.profile || attrs.active_profile;
    this._scheduleData = attrs.schedule_data;
    this._availableProfiles = attrs.available_profiles || [];

    // Clear cache when schedule data changes
    this._parsedScheduleCache.clear();
  }

  private _getParsedBlocks(weekday: Weekday): TimeBlock[] {
    // Check for pending changes first
    if (this._pendingChanges.has(weekday)) {
      return this._pendingChanges.get(weekday)!;
    }

    if (!this._scheduleData) return [];

    const weekdayData = this._scheduleData[weekday];
    if (!weekdayData) return [];

    // Create cache key from weekday and data hash
    const cacheKey = `${weekday}-${JSON.stringify(weekdayData)}`;

    // Return cached result if available
    if (this._parsedScheduleCache.has(cacheKey)) {
      return this._parsedScheduleCache.get(cacheKey)!;
    }

    // Parse and cache the result
    const blocks = parseWeekdaySchedule(weekdayData);
    this._parsedScheduleCache.set(cacheKey, blocks);

    return blocks;
  }

  private async _handleProfileChange(e: Event): Promise<void> {
    const select = e.target as HTMLSelectElement;
    const newProfile = select.value;

    if (!this._config || !this.hass) return;

    try {
      await this.hass.callService("homematicip_local", "set_schedule_active_profile", {
        entity_id: this._config.entity,
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
    this._validationWarnings = validateTimeBlocks(this._editingBlocks);
  }

  private _handleWeekdayClick(weekday: Weekday): void {
    if (!this._config?.editable || !this._scheduleData) return;

    // Don't open editor when in drag & drop mode
    if (this._isDragDropMode) return;

    const weekdayData = this._scheduleData[weekday];
    if (!weekdayData) return;

    this._editingWeekday = weekday;
    this._editingBlocks = this._getParsedBlocks(weekday);

    // Initialize history stack with the initial state
    this._historyStack = [JSON.parse(JSON.stringify(this._editingBlocks)) as TimeBlock[]];
    this._historyIndex = 0;

    // Update validation warnings
    this._updateValidationWarnings();
  }

  private _closeEditor(): void {
    this._editingWeekday = undefined;
    this._editingBlocks = undefined;
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

      // Snap to 0.5°C increments
      const tempChange = Math.round(deltaTemp * 2) / 2;
      const newTemp = (this._dragState.initialTemperature || 20.0) + tempChange;

      // Constrain temperature between 5°C and 30.5°C
      const constrainedTemp = Math.max(5.0, Math.min(30.5, newTemp));

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
    if (!this._config || !this.hass || !this._currentProfile || this._pendingChanges.size === 0) {
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
          throw new Error(`${weekday}: ${validationError}`);
        }

        const backendData = convertToBackendFormat(weekdayData);

        await this.hass.callService("homematicip_local", "set_schedule_profile_weekday", {
          entity_id: this._config.entity,
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
      !this._currentProfile
    ) {
      return;
    }

    // Convert blocks to weekday data (automatically sorts by time)
    const weekdayData = timeBlocksToWeekdayData(this._editingBlocks);

    // Validate schedule data before sending
    const validationError = validateWeekdayData(weekdayData);
    if (validationError) {
      alert(formatString(this._translations.errors.invalidSchedule, { error: validationError }));
      return;
    }

    // Convert to backend format with integer keys for aiohomematic
    const backendData = convertToBackendFormat(weekdayData);

    // Set loading state with 10-second timeout
    this._isLoading = true;
    this._loadingTimeoutId = window.setTimeout(() => {
      this._isLoading = false;
      this._loadingTimeoutId = undefined;
    }, 10000);

    try {
      await this.hass.callService("homematicip_local", "set_schedule_profile_weekday", {
        entity_id: this._config.entity,
        profile: this._currentProfile,
        weekday: this._editingWeekday,
        weekday_data: backendData,
      });

      // Update local state (keep as WeekdayData format internally)
      if (this._scheduleData) {
        this._scheduleData = {
          ...this._scheduleData,
          [this._editingWeekday]: weekdayData,
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
    if (!this._scheduleData) return;

    const weekdayData = this._scheduleData[weekday];
    if (!weekdayData) return;

    const blocks = this._getParsedBlocks(weekday);
    this._copiedSchedule = {
      weekday,
      blocks: JSON.parse(JSON.stringify(blocks)), // Deep copy
    };

    // Show feedback
    console.info(`Copied schedule from ${weekday}`);
  }

  private async _pasteSchedule(weekday: Weekday): Promise<void> {
    if (
      !this._config ||
      !this.hass ||
      !this._currentProfile ||
      !this._copiedSchedule ||
      !this._scheduleData
    ) {
      return;
    }

    // Convert copied blocks to weekday data
    const weekdayData = timeBlocksToWeekdayData(this._copiedSchedule.blocks);

    // Validate schedule data
    const validationError = validateWeekdayData(weekdayData);
    if (validationError) {
      alert(formatString(this._translations.errors.invalidSchedule, { error: validationError }));
      return;
    }

    // Convert to backend format
    const backendData = convertToBackendFormat(weekdayData);

    // Set loading state with 10-second timeout
    this._isLoading = true;
    this._loadingTimeoutId = window.setTimeout(() => {
      this._isLoading = false;
      this._loadingTimeoutId = undefined;
    }, 10000);

    try {
      await this.hass.callService("homematicip_local", "set_schedule_profile_weekday", {
        entity_id: this._config.entity,
        profile: this._currentProfile,
        weekday: weekday,
        weekday_data: backendData,
      });

      // Update local state
      this._scheduleData = {
        ...this._scheduleData,
        [weekday]: weekdayData,
      };

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
    if (!this._scheduleData || !this._currentProfile) {
      return;
    }

    try {
      // Create export data with metadata
      const exportData = {
        version: "1.0",
        profile: this._currentProfile,
        exported: new Date().toISOString(),
        scheduleData: this._scheduleData,
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
        if ("scheduleData" in data) {
          scheduleData = data.scheduleData;
        } else {
          // Assume the entire file is schedule data
          scheduleData = importData;
        }

        // Validate schedule data
        const validationError = validateProfileData(scheduleData);
        if (validationError) {
          alert(
            formatString(this._translations.errors.invalidImportData, { error: validationError }),
          );
          return;
        }

        // Apply imported schedule
        if (!this._config || !this.hass || !this._currentProfile) {
          return;
        }

        // Set loading state
        this._isLoading = true;
        this._loadingTimeoutId = window.setTimeout(() => {
          this._isLoading = false;
          this._loadingTimeoutId = undefined;
        }, 10000);

        try {
          // Import each weekday
          const importedSchedule = scheduleData as ProfileData;
          for (const weekday of WEEKDAYS) {
            const weekdayData = importedSchedule[weekday];
            if (weekdayData) {
              const backendData = convertToBackendFormat(weekdayData);
              await this.hass.callService("homematicip_local", "set_schedule_profile_weekday", {
                entity_id: this._config.entity,
                profile: this._currentProfile,
                weekday: weekday,
                weekday_data: backendData,
              });
            }
          }

          // Update local state
          this._scheduleData = importedSchedule;
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

    const entityState = this.hass.states?.[this._config.entity];
    if (!entityState) {
      return html`
        <ha-card>
          <div class="error">
            ${formatString(this._translations.ui.entityNotFound, { entity: this._config.entity })}
          </div>
        </ha-card>
      `;
    }

    return html`
      <ha-card>
        <div class="card-header">
          <div class="name">
            ${this._config.name ||
            entityState.attributes.friendly_name ||
            this._translations.ui.schedule}
          </div>
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
    if (!this._scheduleData) return html``;

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
            ${TIME_LABELS.map(
              (time) => html`
                <div class="time-label" style="top: ${time.position}%">${time.label}</div>
              `,
            )}
          </div>
        </div>

        <!-- Schedule grid -->
        <div class="schedule-grid ${this._isCompactView ? "compact" : ""}">
          ${WEEKDAYS.map((weekday) => {
            const weekdayData = this._scheduleData![weekday];
            if (!weekdayData) return html``;

            const blocks = this._getParsedBlocks(weekday);

            const isCopiedSource = this._copiedSchedule?.weekday === weekday;

            return html`
              <div class="weekday-column ${this._config?.editable ? "editable" : ""}">
                <div class="weekday-header">
                  <div class="weekday-label">${this._getWeekdayLabel(weekday)}</div>
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
                  ${blocks.map((block, blockIndex) => {
                    const isActive = this._isBlockActive(weekday, block);

                    // Determine background style based on gradient config
                    let backgroundStyle: string;
                    if (this._config?.show_gradient) {
                      const prevTemp = blockIndex > 0 ? blocks[blockIndex - 1].temperature : null;
                      const nextTemp =
                        blockIndex < blocks.length - 1 ? blocks[blockIndex + 1].temperature : null;
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
                        class="time-block ${isActive ? "active" : ""} ${this._pendingChanges.has(
                          weekday,
                        )
                          ? "pending"
                          : ""}"
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
                            ${formatTemperature(block.temperature, this._config?.temperature_unit)}
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
                  })}
                </div>
              </div>
            `;
          })}

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

  private _renderEditor() {
    if (!this._editingWeekday || !this._editingBlocks) return html``;

    return html`
      <div class="editor">
        <div class="editor-header">
          <h3>
            ${formatString(this._translations.ui.edit, {
              weekday: this._getWeekdayLabel(this._editingWeekday),
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
                    (warning) => html`<li class="warning-item">${warning}</li>`,
                  )}
                </ul>
              </div>
            `
          : ""}

        <div class="editor-content">
          ${this._editingBlocks.map((block, index) => {
            // Calculate min/max time constraints
            const prevBlock = index > 0 ? this._editingBlocks![index - 1] : null;
            const nextBlock =
              index < this._editingBlocks!.length - 1 ? this._editingBlocks![index + 1] : null;
            const minTime = prevBlock ? prevBlock.endTime : "00:00";
            const maxTime = nextBlock ? nextBlock.endTime : "24:00";

            return html`
              <div class="time-block-editor">
                <div class="block-number">${index + 1}</div>
                <input
                  type="time"
                  class="time-input"
                  .value=${block.endTime}
                  min=${minTime}
                  max=${maxTime}
                  @change=${(e: Event) =>
                    this._updateTimeBlock(index, {
                      endTime: (e.target as HTMLInputElement).value,
                    })}
                />
                <input
                  type="number"
                  class="temp-input"
                  .value=${block.temperature.toString()}
                  step="0.5"
                  min="5"
                  max="30.5"
                  @change=${(e: Event) =>
                    this._updateTimeBlock(index, {
                      temperature: parseFloat((e.target as HTMLInputElement).value),
                    })}
                />
                <span class="temp-unit">${this._config?.temperature_unit || "°C"}</span>
                ${this._editingBlocks!.length > 1
                  ? html`
                      <button class="remove-btn" @click=${() => this._removeTimeBlock(index)}>
                        🗑️
                      </button>
                    `
                  : ""}
                <div
                  class="color-indicator"
                  style="background-color: ${getTemperatureColor(block.temperature)}"
                ></div>
              </div>
            `;
          })}
          ${this._editingBlocks.length < 12
            ? html`
                <button class="add-btn" @click=${this._addTimeBlock}>
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

      .editor-content {
        max-height: 500px;
        overflow-y: auto;
      }

      .time-block-editor {
        display: grid;
        grid-template-columns: 40px 100px 80px 40px 40px 20px;
        gap: 8px;
        align-items: center;
        padding: 8px;
        border-bottom: 1px solid var(--divider-color);
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
    "homematic-schedule-card": HomematicScheduleCard;
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
  type: "homematic-schedule-card",
  name: "Homematic Schedule Card",
  description: "Display and edit Homematic thermostat schedules",
  preview: true,
});

console.info(
  "%c HOMEMATIC-SCHEDULE-CARD %c v0.2.0 ",
  "color: white; background: #3498db; font-weight: 700;",
  "color: #3498db; background: white; font-weight: 700;",
);
