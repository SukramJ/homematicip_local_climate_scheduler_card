import {
  WeekdayData,
  ScheduleSlot,
  BackendWeekdayData,
  SimpleWeekdayData,
  SimpleSchedulePeriod,
} from "./types";

// Re-export types for use in this module
export type { ScheduleSlot, BackendWeekdayData, SimpleWeekdayData, SimpleSchedulePeriod };

export type ValidationMessageKey =
  | "blockEndBeforeStart"
  | "blockZeroDuration"
  | "invalidStartTime"
  | "invalidEndTime"
  | "temperatureOutOfRange"
  | "invalidSlotCount"
  | "invalidSlotKey"
  | "missingSlot"
  | "slotMissingValues"
  | "slotTimeBackwards"
  | "slotTimeExceedsDay"
  | "lastSlotMustEnd"
  | "scheduleMustBeObject"
  | "missingWeekday"
  | "invalidWeekdayData"
  | "weekdayValidationError";

export interface ValidationMessage {
  key: ValidationMessageKey;
  params?: Record<string, string>;
  nested?: ValidationMessage;
}

/**
 * Convert time string (HH:MM) to minutes
 */
export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

/**
 * Convert minutes to time string (HH:MM)
 */
export function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
}

/**
 * Parse weekday schedule data into time blocks
 */
export interface TimeBlock {
  startTime: string;
  startMinutes: number;
  endTime: string;
  endMinutes: number;
  temperature: number;
  slot: number;
}

export function parseWeekdaySchedule(weekdayData: WeekdayData): TimeBlock[] {
  const blocks: TimeBlock[] = [];
  let previousEndTime = "00:00";
  let previousEndMinutes = 0;

  // Sort slots by slot number
  const sortedSlots = Object.entries(weekdayData)
    .map(([slot, data]) => ({ slot: parseInt(slot), data }))
    .sort((a, b) => a.slot - b.slot);

  for (const { slot, data } of sortedSlots) {
    // Skip null/undefined or malformed slots gracefully
    if (!data || typeof data.ENDTIME !== "string" || data.TEMPERATURE === undefined) {
      continue;
    }
    const endTime = data.ENDTIME;
    const endMinutes = timeToMinutes(endTime);

    // Skip if this is the same as previous end time (unused slot)
    if (endMinutes > previousEndMinutes && endMinutes <= 1440) {
      blocks.push({
        startTime: previousEndTime,
        startMinutes: previousEndMinutes,
        endTime: endTime,
        endMinutes: endMinutes,
        temperature: data.TEMPERATURE,
        slot: slot,
      });

      previousEndTime = endTime;
      previousEndMinutes = endMinutes;
    }

    // Stop at 24:00
    if (endMinutes >= 1440) {
      break;
    }
  }

  return blocks;
}

/**
 * Convert time blocks back to weekday data format
 * Ensures blocks are sorted by time and slot numbers are sequential before converting
 */
export function timeBlocksToWeekdayData(blocks: TimeBlock[]): WeekdayData {
  const weekdayData: WeekdayData = {};

  // Sort blocks by end time to ensure ascending order
  const sortedBlocks = [...blocks].sort((a, b) => a.endMinutes - b.endMinutes);

  // Renumber slots sequentially after sorting (1, 2, 3, ...)
  const renumberedBlocks = sortedBlocks.map((block, index) => ({
    ...block,
    slot: index + 1,
  }));

  // Ensure the last provided block ends at 24:00
  if (renumberedBlocks.length > 0) {
    const lastIndex = renumberedBlocks.length - 1;
    const lastBlock = renumberedBlocks[lastIndex];
    if (lastBlock.endMinutes !== 1440) {
      renumberedBlocks[lastIndex] = {
        ...lastBlock,
        endTime: "24:00",
        endMinutes: 1440,
      };
    }
  }

  // Only include existing blocks; do not fill up to 13
  for (let i = 0; i < renumberedBlocks.length; i++) {
    const block = renumberedBlocks[i];
    weekdayData[(i + 1).toString()] = {
      ENDTIME: block.endTime,
      TEMPERATURE: block.temperature,
    };
  }

  return weekdayData;
}

// Frontend no longer normalizes or fills missing slots; backend is responsible.

/**
 * Convert WeekdayData to backend format with integer keys
 * Backend (aiohomematic) expects dict[int, dict[str, str|float]]
 */
export function convertToBackendFormat(weekdayData: WeekdayData): BackendWeekdayData {
  const backendData: BackendWeekdayData = {};

  // Only include existing numeric keys in ascending order
  const keys = Object.keys(weekdayData)
    .map((k) => parseInt(k))
    .filter((n) => !isNaN(n) && n >= 1 && n <= 13)
    .sort((a, b) => a - b);

  for (const i of keys) {
    const slot = weekdayData[i.toString()];
    if (slot) {
      backendData[i] = {
        ENDTIME: slot.ENDTIME,
        TEMPERATURE: slot.TEMPERATURE,
      };
    }
  }

  return backendData;
}

/**
 * Validate time blocks in the editor
 * Returns array of warning messages (empty if valid)
 * @param blocks Time blocks to validate
 * @param minTemp Minimum allowed temperature (default: 5)
 * @param maxTemp Maximum allowed temperature (default: 30.5)
 */
export function validateTimeBlocks(
  blocks: TimeBlock[],
  minTemp: number = 5,
  maxTemp: number = 30.5,
): ValidationMessage[] {
  const warnings: ValidationMessage[] = [];

  // Allow empty blocks - base temperature is sufficient
  if (blocks.length === 0) {
    return warnings;
  }

  // Check for time overlaps and gaps
  for (let i = 0; i < blocks.length - 1; i++) {
    const currentBlock = blocks[i];

    // Check for backwards time
    if (currentBlock.endMinutes < currentBlock.startMinutes) {
      warnings.push({ key: "blockEndBeforeStart", params: { block: `${i + 1}` } });
    }

    // Check if end time equals start time (zero duration)
    if (currentBlock.endMinutes === currentBlock.startMinutes) {
      warnings.push({ key: "blockZeroDuration", params: { block: `${i + 1}` } });
    }
  }

  // Check last block
  const lastBlock = blocks[blocks.length - 1];

  if (lastBlock.endMinutes < lastBlock.startMinutes) {
    warnings.push({ key: "blockEndBeforeStart", params: { block: `${blocks.length}` } });
  }

  // Check for invalid time values
  blocks.forEach((block, index) => {
    if (block.startMinutes < 0 || block.startMinutes > 1440) {
      warnings.push({ key: "invalidStartTime", params: { block: `${index + 1}` } });
    }
    if (block.endMinutes < 0 || block.endMinutes > 1440) {
      warnings.push({ key: "invalidEndTime", params: { block: `${index + 1}` } });
    }
    if (block.temperature < minTemp || block.temperature > maxTemp) {
      warnings.push({
        key: "temperatureOutOfRange",
        params: { block: `${index + 1}`, min: `${minTemp}`, max: `${maxTemp}` },
      });
    }
  });

  return warnings;
}

/**
 * Validate schedule data
 * Now accepts incomplete data and normalizes it before validation
 */
export function validateWeekdayData(weekdayData: WeekdayData): ValidationMessage | null {
  // Accept fewer than 13 slots; validate only ordering and bounds of existing slots
  const keys = Object.keys(weekdayData)
    .map((k) => parseInt(k))
    .filter((n) => !isNaN(n) && n >= 1 && n <= 13)
    .sort((a, b) => a - b);

  let previousEndMinutes = 0;

  for (const i of keys) {
    const slot = weekdayData[i.toString()];
    if (!slot) {
      // Skip null/undefined slots; backend will handle filling
      continue;
    }

    if (!slot.ENDTIME || slot.TEMPERATURE === undefined) {
      return { key: "slotMissingValues", params: { slot: `${i}` } };
    }

    const endMinutes = timeToMinutes(slot.ENDTIME);

    if (endMinutes < previousEndMinutes) {
      return { key: "slotTimeBackwards", params: { slot: `${i}`, time: slot.ENDTIME } };
    }

    if (endMinutes > 1440) {
      return { key: "slotTimeExceedsDay", params: { slot: `${i}`, time: slot.ENDTIME } };
    }

    previousEndMinutes = endMinutes;
  }

  // If any slots exist, the last slot must end at 24:00
  if (keys.length > 0) {
    const lastKey = keys[keys.length - 1].toString();
    const last = weekdayData[lastKey];
    if (last && last.ENDTIME !== "24:00") {
      return { key: "lastSlotMustEnd" };
    }
  }

  return null;
}

/**
 * Get temperature color based on value
 */
export function getTemperatureColor(temperature: number): string {
  if (temperature < 12) return "#3498db"; // Cold - Blue
  if (temperature < 16) return "#5dade2"; // Cool - Light Blue
  if (temperature < 18) return "#58d68d"; // Mild - Green
  if (temperature < 20) return "#f39c12"; // Warm - Orange
  if (temperature < 22) return "#e67e22"; // Warmer - Dark Orange
  return "#e74c3c"; // Hot - Red
}

/**
 * Get gradient background for a temperature block based on adjacent blocks
 * @param currentTemp Current block temperature
 * @param prevTemp Previous block temperature (null if first block)
 * @param nextTemp Next block temperature (null if last block)
 * @returns CSS gradient string or solid color
 */
export function getTemperatureGradient(
  currentTemp: number,
  prevTemp: number | null,
  nextTemp: number | null,
): string {
  const currentColor = getTemperatureColor(currentTemp);

  // If no adjacent blocks, use solid color
  if (prevTemp === null && nextTemp === null) {
    return currentColor;
  }

  // If only one adjacent block, create gradient from that direction
  if (prevTemp !== null && nextTemp === null) {
    const prevColor = getTemperatureColor(prevTemp);
    return `linear-gradient(to bottom, ${prevColor}, ${currentColor})`;
  }

  if (prevTemp === null && nextTemp !== null) {
    const nextColor = getTemperatureColor(nextTemp);
    return `linear-gradient(to bottom, ${currentColor}, ${nextColor})`;
  }

  // Both adjacent blocks exist - create gradient from prev through current to next
  // This branch is guaranteed to execute since all other cases are handled above
  const prevColor = getTemperatureColor(prevTemp!);
  const nextColor = getTemperatureColor(nextTemp!);
  return `linear-gradient(to bottom, ${prevColor}, ${currentColor} 50%, ${nextColor})`;
}

/**
 * Round time to nearest 15 minutes
 */
export function roundTimeToQuarter(minutes: number): number {
  return Math.round(minutes / 15) * 15;
}

/**
 * Format temperature for display
 */
export function formatTemperature(temperature: number, unit: string = "°C"): string {
  return `${temperature.toFixed(1)}${unit}`;
}

/**
 * Validate imported ProfileData structure
 * Returns error message if invalid, null if valid
 */
export function validateProfileData(data: unknown): ValidationMessage | null {
  if (!data || typeof data !== "object") {
    return { key: "scheduleMustBeObject" };
  }

  const profileData = data as Record<string, unknown>;
  const validWeekdays = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ];

  // Check if all required weekdays are present
  for (const weekday of validWeekdays) {
    if (!(weekday in profileData)) {
      return { key: "missingWeekday", params: { weekday } };
    }

    const weekdayData = profileData[weekday];
    if (!weekdayData || typeof weekdayData !== "object") {
      return { key: "invalidWeekdayData", params: { weekday } };
    }

    // Validate weekday data structure
    const error = validateWeekdayData(weekdayData as WeekdayData);
    if (error) {
      return { key: "weekdayValidationError", params: { weekday }, nested: error };
    }
  }

  return null;
}

/**
 * Parse simple weekday schedule data into time blocks
 * SimpleWeekdayData is a tuple: [base_temperature, periods[]]
 */
export function parseSimpleWeekdaySchedule(simpleData: SimpleWeekdayData): {
  blocks: TimeBlock[];
  baseTemperature: number;
} {
  const [baseTemperature, periods] = simpleData;
  const blocks: TimeBlock[] = [];

  // Sort periods by start time
  const sortedPeriods = [...periods].sort((a, b) => {
    const aStart = timeToMinutes(a.STARTTIME);
    const bStart = timeToMinutes(b.STARTTIME);
    return aStart - bStart;
  });

  // Convert periods to time blocks
  for (let i = 0; i < sortedPeriods.length; i++) {
    const period = sortedPeriods[i];
    blocks.push({
      startTime: period.STARTTIME,
      startMinutes: timeToMinutes(period.STARTTIME),
      endTime: period.ENDTIME,
      endMinutes: timeToMinutes(period.ENDTIME),
      temperature: period.TEMPERATURE,
      slot: i + 1,
    });
  }

  return { blocks, baseTemperature };
}

/**
 * Convert time blocks to simple weekday data format
 * Returns tuple: [base_temperature, periods[]]
 */
export function timeBlocksToSimpleWeekdayData(
  blocks: TimeBlock[],
  baseTemperature: number,
): SimpleWeekdayData {
  const periods: SimpleSchedulePeriod[] = [];

  // Sort blocks by time
  const sortedBlocks = [...blocks].sort((a, b) => a.startMinutes - b.startMinutes);

  // Convert blocks to periods (only periods that differ from base temperature)
  for (const block of sortedBlocks) {
    periods.push({
      STARTTIME: block.startTime,
      ENDTIME: block.endTime,
      TEMPERATURE: block.temperature,
    });
  }

  return [baseTemperature, periods];
}

/**
 * Calculate base temperature from time blocks
 * The base temperature is the temperature that covers the most time in a day
 */
export function calculateBaseTemperature(blocks: TimeBlock[]): number {
  if (blocks.length === 0) {
    return 20.0; // Default base temperature
  }

  // Calculate total minutes for each temperature
  const tempMinutes = new Map<number, number>();

  // Add time from blocks
  for (const block of blocks) {
    const duration = block.endMinutes - block.startMinutes;
    const current = tempMinutes.get(block.temperature) || 0;
    tempMinutes.set(block.temperature, current + duration);
  }

  // Calculate gaps (time not covered by blocks) and assign to first block's temperature
  // This is a simplification; in reality, gaps would use base temperature
  // But since we're calculating base temp, we'll just use the most common temperature

  // Find temperature with most minutes
  let maxMinutes = 0;
  let baseTemp = 20.0;

  for (const [temp, minutes] of tempMinutes.entries()) {
    if (minutes > maxMinutes) {
      maxMinutes = minutes;
      baseTemp = temp;
    }
  }

  return baseTemp;
}

/**
 * Validate simple weekday data
 */
export function validateSimpleWeekdayData(
  simpleData: SimpleWeekdayData,
  minTemp: number = 5,
  maxTemp: number = 30.5,
): ValidationMessage | null {
  const [baseTemperature, periods] = simpleData;

  // Validate base temperature
  if (baseTemperature < minTemp || baseTemperature > maxTemp) {
    return {
      key: "temperatureOutOfRange",
      params: { block: "base", min: `${minTemp}`, max: `${maxTemp}` },
    };
  }

  // Validate periods
  let previousEndMinutes = 0;

  for (let i = 0; i < periods.length; i++) {
    const period = periods[i];

    if (!period.STARTTIME || !period.ENDTIME || period.TEMPERATURE === undefined) {
      return { key: "slotMissingValues", params: { slot: `${i + 1}` } };
    }

    const startMinutes = timeToMinutes(period.STARTTIME);
    const endMinutes = timeToMinutes(period.ENDTIME);

    // Check for valid time range
    if (endMinutes <= startMinutes) {
      return { key: "blockEndBeforeStart", params: { block: `${i + 1}` } };
    }

    // Check for overlaps
    if (startMinutes < previousEndMinutes) {
      return { key: "slotTimeBackwards", params: { slot: `${i + 1}`, time: period.STARTTIME } };
    }

    // Check for valid temperature
    if (period.TEMPERATURE < minTemp || period.TEMPERATURE > maxTemp) {
      return {
        key: "temperatureOutOfRange",
        params: { block: `${i + 1}`, min: `${minTemp}`, max: `${maxTemp}` },
      };
    }

    previousEndMinutes = endMinutes;
  }

  return null;
}

/**
 * Validate simple profile data structure
 */
export function validateSimpleProfileData(data: unknown): ValidationMessage | null {
  if (!data || typeof data !== "object") {
    return { key: "scheduleMustBeObject" };
  }

  const profileData = data as Record<string, unknown>;
  const validWeekdays = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ];

  // Check if all required weekdays are present
  for (const weekday of validWeekdays) {
    if (!(weekday in profileData)) {
      return { key: "missingWeekday", params: { weekday } };
    }

    const weekdayData = profileData[weekday];
    if (!Array.isArray(weekdayData) || weekdayData.length !== 2) {
      return { key: "invalidWeekdayData", params: { weekday } };
    }

    // Validate simple weekday data structure
    const error = validateSimpleWeekdayData(weekdayData as SimpleWeekdayData);
    if (error) {
      return { key: "weekdayValidationError", params: { weekday }, nested: error };
    }
  }

  return null;
}
