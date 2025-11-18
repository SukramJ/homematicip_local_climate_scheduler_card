export interface HomematicScheduleCardConfig {
  type: string;
  entity?: string;
  entities?: string[];
  name?: string;
  profile?: string;
  show_profile_selector?: boolean;
  editable?: boolean;
  show_temperature?: boolean;
  temperature_unit?: string;
  hour_format?: "12" | "24";
  language?: "en" | "de";
  show_gradient?: boolean;
  time_step_minutes?: number;
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

/**
 * Simple schedule period with start time, end time, and temperature
 */
export interface SimpleSchedulePeriod {
  STARTTIME: string;
  ENDTIME: string;
  TEMPERATURE: number;
}

/**
 * Simple weekday data: [base_temperature, periods[]]
 * This is the new simplified format from aiohomematic
 */
export type SimpleWeekdayData = [number, SimpleSchedulePeriod[]];

/**
 * Simple profile data mapping weekdays to simple weekday data
 */
export interface SimpleProfileData {
  [weekday: string]: SimpleWeekdayData;
}

export interface ScheduleEntityAttributes {
  active_profile: string;
  available_profiles: string[];
  simple_schedule_data?: SimpleProfileData;
  schedule_data?: ProfileData; // Keep for backward compatibility
  friendly_name?: string;
  min_temp?: number;
  max_temp?: number;
  target_temp_step?: number;
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
  language?: string;
  locale?: { language: string };
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
