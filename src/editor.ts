import { LitElement, html, css, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import type { HomeAssistant, HomematicScheduleCardConfig } from "./types";

// Schema type for ha-form
interface HaFormSchema {
  name: string;
  selector: Record<string, unknown>;
  required?: boolean;
  default?: unknown;
}

// Fire event helper
const fireEvent = (node: HTMLElement, type: string, detail?: Record<string, unknown>): void => {
  const event = new CustomEvent(type, {
    bubbles: true,
    composed: true,
    detail,
  });
  node.dispatchEvent(event);
};

export class HomematicScheduleCardEditor extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: HomematicScheduleCardConfig;

  private static readonly SCHEMA: HaFormSchema[] = [
    {
      name: "entities",
      required: true,
      selector: { entity: { domain: "climate", multiple: true } },
    },
    {
      name: "name",
      selector: { text: {} },
    },
    {
      name: "show_profile_selector",
      selector: { boolean: {} },
      default: true,
    },
    {
      name: "editable",
      selector: { boolean: {} },
      default: true,
    },
    {
      name: "show_temperature",
      selector: { boolean: {} },
      default: true,
    },
    {
      name: "show_gradient",
      selector: { boolean: {} },
      default: false,
    },
    {
      name: "hour_format",
      selector: {
        select: {
          options: [
            { value: "24", label: "24h" },
            { value: "12", label: "12h (AM/PM)" },
          ],
        },
      },
      default: "24",
    },
  ];

  public setConfig(config: HomematicScheduleCardConfig): void {
    this._config = config;
  }

  protected render() {
    if (!this.hass || !this._config) {
      return nothing;
    }

    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${HomematicScheduleCardEditor.SCHEMA}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
  }

  private _computeLabel = (schema: HaFormSchema): string => {
    const labels: Record<string, string> = {
      entities: "Entities",
      name: "Name (optional)",
      show_profile_selector: "Show profile selector",
      editable: "Allow editing",
      show_temperature: "Show temperature values",
      show_gradient: "Show color gradient",
      hour_format: "Time format",
    };
    return labels[schema.name] || schema.name;
  };

  private _valueChanged(ev: CustomEvent): void {
    const config = ev.detail.value as HomematicScheduleCardConfig;
    fireEvent(this, "config-changed", { config });
  }

  static styles = css`
    ha-form {
      display: block;
    }
  `;
}

// Register custom element
customElements.define(
  "homematicip-local-climate-schedule-card-editor",
  HomematicScheduleCardEditor,
);

declare global {
  interface HTMLElementTagNameMap {
    "homematicip-local-climate-schedule-card-editor": HomematicScheduleCardEditor;
  }
}
