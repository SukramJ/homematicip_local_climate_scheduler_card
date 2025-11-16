import { WeekdayData, ScheduleSlot, BackendWeekdayData } from "./types";

// Re-export types for use in this module
export type { ScheduleSlot, BackendWeekdayData };

export type ValidationMessageKey =
  | "noBlocks"
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

  if (blocks.length === 0) {
    warnings.push({ key: "noBlocks" });
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
