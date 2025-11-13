export interface HomematicScheduleCardConfig {
  type: string;
  entity: string;
  name?: string;
  profile?: string;
  show_profile_selector?: boolean;
  editable?: boolean;
  show_temperature?: boolean;
  temperature_unit?: string;
  hour_format?: "12" | "24";
}

export interface ScheduleSlot {
  ENDTIME: string;
  TEMPERATURE: number;
}

/**
 * WeekdayData stores schedule slots for a single day (frontend representation)
 * Keys are numeric strings ('1' through '13') representing slot numbers
 * Note: JavaScript object keys are always strings, even when using numbers
 * Backend expects integer keys, conversion happens before sending
 */
export interface WeekdayData {
  [slot: string]: ScheduleSlot;
}

/**
 * Backend representation of WeekdayData with integer keys
 * This is what Home Assistant/aiohomematic expects
 */
export type BackendWeekdayData = Record<number, ScheduleSlot>;

export interface ProfileData {
  [weekday: string]: WeekdayData;
}

export interface ScheduleEntityAttributes {
  active_profile: string;
  available_profiles: string[];
  schedule_data: ProfileData;
  friendly_name?: string;
}

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: ScheduleEntityAttributes;
  last_changed: string;
  last_updated: string;
}

export interface HomeAssistant {
  states: { [entity_id: string]: HassEntity };
  callService: (
    domain: string,
    service: string,
    serviceData?: Record<string, unknown>,
  ) => Promise<void>;
  callWS: (message: Record<string, unknown>) => Promise<unknown>;
  // Add other HA properties as needed
}

export const WEEKDAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
] as const;

export type Weekday = (typeof WEEKDAYS)[number];

export const WEEKDAY_LABELS: Record<Weekday, string> = {
  MONDAY: "Mo",
  TUESDAY: "Tu",
  WEDNESDAY: "We",
  THURSDAY: "Th",
  FRIDAY: "Fr",
  SATURDAY: "Sa",
  SUNDAY: "Su",
};

export const WEEKDAY_LABELS_DE: Record<Weekday, string> = {
  MONDAY: "Mo",
  TUESDAY: "Di",
  WEDNESDAY: "Mi",
  THURSDAY: "Do",
  FRIDAY: "Fr",
  SATURDAY: "Sa",
  SUNDAY: "So",
};
