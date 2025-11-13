import { LitElement, html, css, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  HomematicScheduleCardConfig,
  HomeAssistant,
  ScheduleEntityAttributes,
  WEEKDAYS,
  WEEKDAY_LABELS,
  ProfileData,
  Weekday,
} from "./types";
import {
  parseWeekdaySchedule,
  timeBlocksToWeekdayData,
  convertToBackendFormat,
  getTemperatureColor,
  formatTemperature,
  TimeBlock,
  minutesToTime,
  timeToMinutes,
} from "./utils";

@customElement("homematic-schedule-card")
export class HomematicScheduleCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config?: HomematicScheduleCardConfig;
  @state() private _currentProfile?: string;
  @state() private _scheduleData?: ProfileData;
  @state() private _availableProfiles: string[] = [];
  @state() private _editingWeekday?: Weekday;
  @state() private _editingBlocks?: TimeBlock[];

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
  }

  public getCardSize(): number {
    return 6;
  }

  protected updated(changedProps: PropertyValues): void {
    super.updated(changedProps);

    if (changedProps.has("hass") && this._config) {
      this._updateFromEntity();
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
      alert(`Failed to change profile: ${err}`);
    }
  }

  private _handleWeekdayClick(weekday: Weekday): void {
    if (!this._config?.editable || !this._scheduleData) return;

    const weekdayData = this._scheduleData[weekday];
    if (!weekdayData) return;

    this._editingWeekday = weekday;
    this._editingBlocks = parseWeekdaySchedule(weekdayData);
  }

  private _closeEditor(): void {
    this._editingWeekday = undefined;
    this._editingBlocks = undefined;
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

    const weekdayData = timeBlocksToWeekdayData(this._editingBlocks);

    // Convert to backend format with integer keys for aiohomematic
    const backendData = convertToBackendFormat(weekdayData);

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

      this._closeEditor();
    } catch (err) {
      console.error("Failed to save schedule:", err);
      alert(`Failed to save schedule: ${err}`);
    }
  }

  private _addTimeBlock(): void {
    if (!this._editingBlocks) return;

    const lastBlock = this._editingBlocks[this._editingBlocks.length - 1];
    const newStartMinutes = lastBlock ? lastBlock.endMinutes : 0;
    const newEndMinutes = Math.min(newStartMinutes + 60, 1440);

    if (newEndMinutes > newStartMinutes && this._editingBlocks.length < 12) {
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
    }
  }

  private _removeTimeBlock(index: number): void {
    if (!this._editingBlocks || this._editingBlocks.length <= 1) return;

    this._editingBlocks = this._editingBlocks.filter((_, i) => i !== index);

    // Renumber slots
    this._editingBlocks = this._editingBlocks.map((block, i) => ({
      ...block,
      slot: i + 1,
    }));
  }

  private _updateTimeBlock(index: number, updates: Partial<TimeBlock>): void {
    if (!this._editingBlocks) return;

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
  }

  protected render() {
    if (!this._config || !this.hass) {
      return html``;
    }

    const entityState = this.hass.states?.[this._config.entity];
    if (!entityState) {
      return html`
        <ha-card>
          <div class="error">Entity ${this._config.entity} not found</div>
        </ha-card>
      `;
    }

    return html`
      <ha-card>
        <div class="card-header">
          <div class="name">
            ${this._config.name || entityState.attributes.friendly_name || "Schedule"}
          </div>
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
        </div>

        <div class="card-content">
          ${this._editingWeekday
            ? this._renderEditor()
            : this._scheduleData
              ? this._renderScheduleView()
              : html`<div class="loading">Loading schedule data...</div>`}
        </div>
      </ha-card>
    `;
  }

  private _renderScheduleView() {
    if (!this._scheduleData) return html``;

    return html`
      <div class="schedule-grid">
        ${WEEKDAYS.map((weekday) => {
          const weekdayData = this._scheduleData![weekday];
          if (!weekdayData) return html``;

          const blocks = parseWeekdaySchedule(weekdayData);

          return html`
            <div
              class="weekday-column ${this._config?.editable ? "editable" : ""}"
              @click=${() => this._handleWeekdayClick(weekday)}
            >
              <div class="weekday-header">${WEEKDAY_LABELS[weekday]}</div>
              <div class="time-blocks">
                ${blocks.map(
                  (block) => html`
                    <div
                      class="time-block"
                      style="
                        height: ${((block.endMinutes - block.startMinutes) / 1440) * 100}%;
                        background-color: ${getTemperatureColor(block.temperature)};
                      "
                      title="${block.startTime} - ${block.endTime}: ${formatTemperature(
                        block.temperature,
                        this._config?.temperature_unit,
                      )}"
                    >
                      ${this._config?.show_temperature
                        ? html`<span class="temperature">${block.temperature.toFixed(1)}°</span>`
                        : ""}
                    </div>
                  `,
                )}
              </div>
            </div>
          `;
        })}
      </div>

      ${this._config?.editable
        ? html`<div class="hint">Click on a day to edit its schedule</div>`
        : ""}
    `;
  }

  private _renderEditor() {
    if (!this._editingWeekday || !this._editingBlocks) return html``;

    return html`
      <div class="editor">
        <div class="editor-header">
          <h3>Edit ${this._editingWeekday}</h3>
          <button class="close-btn" @click=${this._closeEditor}>✕</button>
        </div>

        <div class="editor-content">
          ${this._editingBlocks.map(
            (block, index) => html`
              <div class="time-block-editor">
                <div class="block-number">${index + 1}</div>
                <input
                  type="time"
                  class="time-input"
                  .value=${block.endTime}
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
            `,
          )}
          ${this._editingBlocks.length < 12
            ? html` <button class="add-btn" @click=${this._addTimeBlock}>+ Add Time Block</button> `
            : ""}
        </div>

        <div class="editor-footer">
          <button class="cancel-btn" @click=${this._closeEditor}>Cancel</button>
          <button class="save-btn" @click=${this._saveSchedule}>Save</button>
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
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }

      .name {
        font-size: 24px;
        font-weight: 400;
        color: var(--primary-text-color);
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

      .card-content {
        position: relative;
      }

      .schedule-grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 8px;
        min-height: 400px;
      }

      .weekday-column {
        display: flex;
        flex-direction: column;
        border: 1px solid var(--divider-color);
        border-radius: 4px;
        overflow: hidden;
      }

      .weekday-column.editable {
        cursor: pointer;
        transition: transform 0.2s;
      }

      .weekday-column.editable:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      }

      .weekday-header {
        padding: 8px;
        text-align: center;
        font-weight: 500;
        background-color: var(--primary-color);
        color: var(--text-primary-color);
      }

      .time-blocks {
        flex: 1;
        display: flex;
        flex-direction: column;
        position: relative;
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
      }

      .time-block:hover {
        opacity: 0.9;
      }

      .temperature {
        user-select: none;
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
      }

      .close-btn:hover {
        background-color: var(--divider-color);
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
  "%c HOMEMATIC-SCHEDULE-CARD %c v0.1.0 ",
  "color: white; background: #3498db; font-weight: 700;",
  "color: #3498db; background: white; font-weight: 700;",
);
