import { WeekdayData, ScheduleSlot, BackendWeekdayData } from "./types";

// Re-export types for use in this module
export type { ScheduleSlot, BackendWeekdayData };

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
 */
export function timeBlocksToWeekdayData(blocks: TimeBlock[]): WeekdayData {
  const weekdayData: WeekdayData = {};

  // Fill in all 13 slots
  for (let i = 1; i <= 13; i++) {
    const block = blocks[i - 1];
    if (block) {
      weekdayData[i.toString()] = {
        ENDTIME: block.endTime,
        TEMPERATURE: block.temperature,
      };
    } else {
      // Fill unused slots with 24:00
      weekdayData[i.toString()] = {
        ENDTIME: "24:00",
        TEMPERATURE: 16.0,
      };
    }
  }

  return weekdayData;
}

/**
 * Convert WeekdayData to backend format with integer keys
 * Backend (aiohomematic) expects dict[int, dict[str, str|float]]
 */
export function convertToBackendFormat(weekdayData: WeekdayData): BackendWeekdayData {
  const backendData: BackendWeekdayData = {};

  for (let i = 1; i <= 13; i++) {
    const slot = weekdayData[i.toString()];
    if (slot) {
      // Convert string key to integer key for backend
      backendData[i] = {
        ENDTIME: slot.ENDTIME,
        TEMPERATURE: slot.TEMPERATURE,
      };
    }
  }

  return backendData;
}

/**
 * Validate schedule data
 */
export function validateWeekdayData(weekdayData: WeekdayData): string | null {
  const slots = Object.keys(weekdayData);

  // Must have exactly 13 slots
  if (slots.length !== 13) {
    return `Invalid number of slots: ${slots.length} (expected 13)`;
  }

  // Validate that all keys are numeric strings
  for (const key of slots) {
    const num = parseInt(key, 10);
    if (isNaN(num) || num < 1 || num > 13 || key !== num.toString()) {
      return `Invalid slot key: ${key} (must be integer 1-13)`;
    }
  }

  let previousEndMinutes = 0;

  for (let i = 1; i <= 13; i++) {
    const slot = weekdayData[i.toString()];

    if (!slot) {
      return `Missing slot ${i}`;
    }

    if (!slot.ENDTIME || slot.TEMPERATURE === undefined) {
      return `Slot ${i} missing ENDTIME or TEMPERATURE`;
    }

    const endMinutes = timeToMinutes(slot.ENDTIME);

    if (endMinutes < previousEndMinutes) {
      return `Slot ${i} time goes backwards: ${slot.ENDTIME}`;
    }

    if (endMinutes > 1440) {
      return `Slot ${i} time exceeds 24:00: ${slot.ENDTIME}`;
    }

    previousEndMinutes = endMinutes;
  }

  // Last slot must be 24:00
  if (weekdayData["13"].ENDTIME !== "24:00") {
    return `Last slot must end at 24:00`;
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
