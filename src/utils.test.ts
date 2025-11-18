import {
  timeToMinutes,
  minutesToTime,
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
  getTemperatureColor,
  getTemperatureGradient,
  roundTimeToQuarter,
  formatTemperature,
  TimeBlock,
  ValidationMessage,
  ValidationMessageKey,
} from "./utils";
import { WeekdayData, SimpleWeekdayData, SimpleProfileData } from "./types";

const findMessage = (
  messages: ValidationMessage[],
  key: ValidationMessageKey,
): ValidationMessage | undefined => messages.find((message) => message.key === key);

describe("Utils", () => {
  describe("timeToMinutes", () => {
    it("should convert time string to minutes", () => {
      expect(timeToMinutes("00:00")).toBe(0);
      expect(timeToMinutes("01:00")).toBe(60);
      expect(timeToMinutes("12:30")).toBe(750);
      expect(timeToMinutes("23:59")).toBe(1439);
      expect(timeToMinutes("24:00")).toBe(1440);
    });
  });

  describe("minutesToTime", () => {
    it("should convert minutes to time string", () => {
      expect(minutesToTime(0)).toBe("00:00");
      expect(minutesToTime(60)).toBe("01:00");
      expect(minutesToTime(750)).toBe("12:30");
      expect(minutesToTime(1439)).toBe("23:59");
      expect(minutesToTime(1440)).toBe("24:00");
    });
  });

  describe("parseWeekdaySchedule", () => {
    it("should parse weekday schedule into time blocks", () => {
      const weekdayData: WeekdayData = {
        "1": { ENDTIME: "06:00", TEMPERATURE: 18 },
        "2": { ENDTIME: "22:00", TEMPERATURE: 21 },
        "3": { ENDTIME: "24:00", TEMPERATURE: 18 },
        "4": { ENDTIME: "24:00", TEMPERATURE: 16 },
        "5": { ENDTIME: "24:00", TEMPERATURE: 16 },
        "6": { ENDTIME: "24:00", TEMPERATURE: 16 },
        "7": { ENDTIME: "24:00", TEMPERATURE: 16 },
        "8": { ENDTIME: "24:00", TEMPERATURE: 16 },
        "9": { ENDTIME: "24:00", TEMPERATURE: 16 },
        "10": { ENDTIME: "24:00", TEMPERATURE: 16 },
        "11": { ENDTIME: "24:00", TEMPERATURE: 16 },
        "12": { ENDTIME: "24:00", TEMPERATURE: 16 },
        "13": { ENDTIME: "24:00", TEMPERATURE: 16 },
      };

      const blocks = parseWeekdaySchedule(weekdayData);

      expect(blocks).toHaveLength(3);
      expect(blocks[0]).toEqual({
        startTime: "00:00",
        startMinutes: 0,
        endTime: "06:00",
        endMinutes: 360,
        temperature: 18,
        slot: 1,
      });
      expect(blocks[1]).toEqual({
        startTime: "06:00",
        startMinutes: 360,
        endTime: "22:00",
        endMinutes: 1320,
        temperature: 21,
        slot: 2,
      });
      expect(blocks[2]).toEqual({
        startTime: "22:00",
        startMinutes: 1320,
        endTime: "24:00",
        endMinutes: 1440,
        temperature: 18,
        slot: 3,
      });
    });

    it("should handle empty slots correctly", () => {
      const weekdayData: WeekdayData = {
        "1": { ENDTIME: "08:00", TEMPERATURE: 20 },
        "2": { ENDTIME: "24:00", TEMPERATURE: 18 },
        "3": { ENDTIME: "24:00", TEMPERATURE: 16 },
        "4": { ENDTIME: "24:00", TEMPERATURE: 16 },
        "5": { ENDTIME: "24:00", TEMPERATURE: 16 },
        "6": { ENDTIME: "24:00", TEMPERATURE: 16 },
        "7": { ENDTIME: "24:00", TEMPERATURE: 16 },
        "8": { ENDTIME: "24:00", TEMPERATURE: 16 },
        "9": { ENDTIME: "24:00", TEMPERATURE: 16 },
        "10": { ENDTIME: "24:00", TEMPERATURE: 16 },
        "11": { ENDTIME: "24:00", TEMPERATURE: 16 },
        "12": { ENDTIME: "24:00", TEMPERATURE: 16 },
        "13": { ENDTIME: "24:00", TEMPERATURE: 16 },
      };

      const blocks = parseWeekdaySchedule(weekdayData);

      expect(blocks).toHaveLength(2);
    });
  });

  describe("timeBlocksToWeekdayData", () => {
    it("should convert time blocks to weekday data format (no fill-up)", () => {
      const blocks = [
        {
          startTime: "00:00",
          startMinutes: 0,
          endTime: "06:00",
          endMinutes: 360,
          temperature: 18,
          slot: 1,
        },
        {
          startTime: "06:00",
          startMinutes: 360,
          endTime: "22:00",
          endMinutes: 1320,
          temperature: 21,
          slot: 2,
        },
        {
          startTime: "22:00",
          startMinutes: 1320,
          endTime: "24:00",
          endMinutes: 1440,
          temperature: 18,
          slot: 3,
        },
      ];

      const weekdayData = timeBlocksToWeekdayData(blocks);

      expect(Object.keys(weekdayData)).toHaveLength(3);
      expect(weekdayData["1"]).toEqual({ ENDTIME: "06:00", TEMPERATURE: 18 });
      expect(weekdayData["2"]).toEqual({ ENDTIME: "22:00", TEMPERATURE: 21 });
      expect(weekdayData["3"]).toEqual({ ENDTIME: "24:00", TEMPERATURE: 18 });
    });

    it("should sort blocks by endMinutes in ascending order", () => {
      // Blocks intentionally in wrong order
      const blocks = [
        {
          startTime: "06:00",
          startMinutes: 360,
          endTime: "22:00",
          endMinutes: 1320,
          temperature: 21,
          slot: 1,
        },
        {
          startTime: "22:00",
          startMinutes: 1320,
          endTime: "24:00",
          endMinutes: 1440,
          temperature: 18,
          slot: 2,
        },
        {
          startTime: "00:00",
          startMinutes: 0,
          endTime: "06:00",
          endMinutes: 360,
          temperature: 18,
          slot: 3,
        },
      ];

      const weekdayData = timeBlocksToWeekdayData(blocks);

      // Should be sorted: slot 1 (06:00), slot 2 (22:00), slot 3 (24:00)
      expect(weekdayData["1"]).toEqual({ ENDTIME: "06:00", TEMPERATURE: 18 });
      expect(weekdayData["2"]).toEqual({ ENDTIME: "22:00", TEMPERATURE: 21 });
      expect(weekdayData["3"]).toEqual({ ENDTIME: "24:00", TEMPERATURE: 18 });
    });

    it("should renumber slot numbers sequentially after sorting (no fill-up)", () => {
      // Blocks with wrong slot numbers and in wrong order
      const blocks = [
        {
          startTime: "12:00",
          startMinutes: 720,
          endTime: "18:00",
          endMinutes: 1080,
          temperature: 22,
          slot: 5, // Wrong slot number
        },
        {
          startTime: "18:00",
          startMinutes: 1080,
          endTime: "24:00",
          endMinutes: 1440,
          temperature: 19,
          slot: 7, // Wrong slot number
        },
        {
          startTime: "00:00",
          startMinutes: 0,
          endTime: "06:00",
          endMinutes: 360,
          temperature: 17,
          slot: 10, // Wrong slot number
        },
        {
          startTime: "06:00",
          startMinutes: 360,
          endTime: "12:00",
          endMinutes: 720,
          temperature: 20,
          slot: 2, // Wrong slot number
        },
      ];

      const weekdayData = timeBlocksToWeekdayData(blocks);

      // After sorting and renumbering, should be:
      // Slot 1: 00:00-06:00 (17°)
      // Slot 2: 06:00-12:00 (20°)
      // Slot 3: 12:00-18:00 (22°)
      // Slot 4: 18:00-24:00 (19°)
      expect(weekdayData["1"]).toEqual({ ENDTIME: "06:00", TEMPERATURE: 17 });
      expect(weekdayData["2"]).toEqual({ ENDTIME: "12:00", TEMPERATURE: 20 });
      expect(weekdayData["3"]).toEqual({ ENDTIME: "18:00", TEMPERATURE: 22 });
      expect(weekdayData["4"]).toEqual({ ENDTIME: "24:00", TEMPERATURE: 19 });

      // No extra slots should be added
      expect(Object.keys(weekdayData).length).toBe(4);
    });

    it("should fix the exact scenario from user report (no fill-up, last=24:00)", () => {
      // Real-world scenario: 18:00 comes after 19:00 in slot order
      const blocks = [
        {
          startTime: "00:00",
          startMinutes: 0,
          endTime: "10:00",
          endMinutes: 600,
          temperature: 15,
          slot: 1,
        },
        {
          startTime: "10:00",
          startMinutes: 600,
          endTime: "11:00",
          endMinutes: 660,
          temperature: 16,
          slot: 2,
        },
        {
          startTime: "11:00",
          startMinutes: 660,
          endTime: "12:00",
          endMinutes: 720,
          temperature: 22,
          slot: 3,
        },
        {
          startTime: "12:00",
          startMinutes: 720,
          endTime: "15:00",
          endMinutes: 900,
          temperature: 15,
          slot: 4,
        },
        {
          startTime: "15:00",
          startMinutes: 900,
          endTime: "19:00",
          endMinutes: 1140,
          temperature: 12,
          slot: 5,
        },
        {
          startTime: "19:00",
          startMinutes: 1140,
          endTime: "18:00", // ERROR: 18:00 after 19:00!
          endMinutes: 1080,
          temperature: 14,
          slot: 6,
        },
      ];

      const weekdayData = timeBlocksToWeekdayData(blocks);

      // After sorting, 18:00 should come before 19:00
      expect(weekdayData["1"]).toEqual({ ENDTIME: "10:00", TEMPERATURE: 15 });
      expect(weekdayData["2"]).toEqual({ ENDTIME: "11:00", TEMPERATURE: 16 });
      expect(weekdayData["3"]).toEqual({ ENDTIME: "12:00", TEMPERATURE: 22 });
      expect(weekdayData["4"]).toEqual({ ENDTIME: "15:00", TEMPERATURE: 15 });
      expect(weekdayData["5"]).toEqual({ ENDTIME: "18:00", TEMPERATURE: 14 }); // Fixed!
      expect(weekdayData["6"]).toEqual({ ENDTIME: "24:00", TEMPERATURE: 12 }); // 19:00 -> 24:00
      expect(Object.keys(weekdayData).length).toBe(6);
    });

    it("should force last block to end at 24:00", () => {
      const blocks = [
        {
          startTime: "00:00",
          startMinutes: 0,
          endTime: "06:00",
          endMinutes: 360,
          temperature: 18,
          slot: 1,
        },
        {
          startTime: "06:00",
          startMinutes: 360,
          endTime: "22:00",
          endMinutes: 1320,
          temperature: 21,
          slot: 2,
        },
      ];

      const weekdayData = timeBlocksToWeekdayData(blocks);

      // Last block should be corrected to 24:00
      expect(weekdayData["2"]).toEqual({ ENDTIME: "24:00", TEMPERATURE: 21 });
    });
  });

  describe("convertToBackendFormat", () => {
    it("should convert string keys to integer keys", () => {
      const weekdayData: WeekdayData = {
        "1": { ENDTIME: "06:00", TEMPERATURE: 18 },
        "2": { ENDTIME: "22:00", TEMPERATURE: 21 },
        "3": { ENDTIME: "24:00", TEMPERATURE: 18 },
      };

      const backendData = convertToBackendFormat(weekdayData);

      // Check that keys are integers (object keys are always strings in JS,
      // but they should be numeric strings that represent integers)
      expect(backendData[1]).toEqual({ ENDTIME: "06:00", TEMPERATURE: 18 });
      expect(backendData[2]).toEqual({ ENDTIME: "22:00", TEMPERATURE: 21 });
      expect(backendData[3]).toEqual({ ENDTIME: "24:00", TEMPERATURE: 18 });
      // Only existing slots should be present
      expect(Object.keys(backendData).length).toBe(3);
    });

    it("should maintain sequential slot numbers in backend format", () => {
      // Create unsorted blocks, convert to weekday data (which sorts and renumbers),
      // then convert to backend format
      const unsortedBlocks = [
        {
          startTime: "12:00",
          startMinutes: 720,
          endTime: "24:00",
          endMinutes: 1440,
          temperature: 22,
          slot: 99, // Intentionally wrong
        },
        {
          startTime: "00:00",
          startMinutes: 0,
          endTime: "06:00",
          endMinutes: 360,
          temperature: 17,
          slot: 50, // Intentionally wrong
        },
        {
          startTime: "06:00",
          startMinutes: 360,
          endTime: "12:00",
          endMinutes: 720,
          temperature: 20,
          slot: 10, // Intentionally wrong
        },
      ];

      const weekdayData = timeBlocksToWeekdayData(unsortedBlocks);
      const backendData = convertToBackendFormat(weekdayData);

      // Backend should have slots 1..N with ascending times only for provided blocks
      // After sorting: slot 1 (06:00), slot 2 (12:00), slot 3 (24:00)
      expect(backendData[1]).toEqual({ ENDTIME: "06:00", TEMPERATURE: 17 }); // Earliest
      expect(backendData[2]).toEqual({ ENDTIME: "12:00", TEMPERATURE: 20 }); // Middle
      expect(backendData[3]).toEqual({ ENDTIME: "24:00", TEMPERATURE: 22 }); // Last active
      expect(Object.keys(backendData).length).toBe(3);
    });

    it("should preserve ENDTIME and TEMPERATURE values", () => {
      const weekdayData: WeekdayData = {
        "1": { ENDTIME: "09:30", TEMPERATURE: 22.5 },
        "2": { ENDTIME: "17:45", TEMPERATURE: 19.0 },
        "3": { ENDTIME: "24:00", TEMPERATURE: 16.5 },
      };

      const backendData = convertToBackendFormat(weekdayData);

      expect(backendData[1].ENDTIME).toBe("09:30");
      expect(backendData[1].TEMPERATURE).toBe(22.5);
      expect(backendData[2].ENDTIME).toBe("17:45");
      expect(backendData[2].TEMPERATURE).toBe(19.0);
    });
  });

  describe("validateWeekdayData", () => {
    it("should validate correct weekday data", () => {
      const weekdayData: WeekdayData = {
        "1": { ENDTIME: "06:00", TEMPERATURE: 18 },
        "2": { ENDTIME: "22:00", TEMPERATURE: 21 },
        "3": { ENDTIME: "24:00", TEMPERATURE: 18 },
      };

      expect(validateWeekdayData(weekdayData)).toBeNull();
    });

    it("should accept incomplete data without normalization", () => {
      const incompleteData: WeekdayData = {
        "1": { ENDTIME: "06:00", TEMPERATURE: 18 },
        "2": { ENDTIME: "22:00", TEMPERATURE: 21 },
        "3": { ENDTIME: "24:00", TEMPERATURE: 18 },
      };

      // Should pass validation without needing normalization
      expect(validateWeekdayData(incompleteData)).toBeNull();
    });

    it("should accept single slot data", () => {
      const singleSlot: WeekdayData = {
        "1": { ENDTIME: "24:00", TEMPERATURE: 18 },
      };

      // Should pass validation
      expect(validateWeekdayData(singleSlot)).toBeNull();
    });

    it("should accept data with missing middle slots (no fill-up)", () => {
      const weekdayData: WeekdayData = {
        "1": { ENDTIME: "24:00", TEMPERATURE: 18 },
        "2": { ENDTIME: "24:00", TEMPERATURE: 18 },
        "3": { ENDTIME: "24:00", TEMPERATURE: 18 },
        "4": { ENDTIME: "24:00", TEMPERATURE: 18 },
        "5": { ENDTIME: "24:00", TEMPERATURE: 18 },
        "6": { ENDTIME: "24:00", TEMPERATURE: 18 },
        "7": { ENDTIME: "24:00", TEMPERATURE: 18 },
        // Missing slot 8
        "9": { ENDTIME: "24:00", TEMPERATURE: 18 },
        "10": { ENDTIME: "24:00", TEMPERATURE: 18 },
        "11": { ENDTIME: "24:00", TEMPERATURE: 18 },
        "12": { ENDTIME: "24:00", TEMPERATURE: 18 },
        "13": { ENDTIME: "24:00", TEMPERATURE: 18 },
      };

      // Should pass validation; frontend does not fill missing slots
      expect(validateWeekdayData(weekdayData)).toBeNull();
    });

    it("should ignore null slots without failing", () => {
      const weekdayData = {
        "1": { ENDTIME: "06:00", TEMPERATURE: 18 },
        "2": { ENDTIME: "22:00", TEMPERATURE: 18 },
        "3": { ENDTIME: "24:00", TEMPERATURE: 18 },
        "4": { ENDTIME: "24:00", TEMPERATURE: 18 },
        "5": { ENDTIME: "24:00", TEMPERATURE: 18 },
        "6": { ENDTIME: "24:00", TEMPERATURE: 18 },
        "7": { ENDTIME: "24:00", TEMPERATURE: 18 },
        "8": null, // Null slot
        "9": { ENDTIME: "24:00", TEMPERATURE: 18 },
        "10": { ENDTIME: "24:00", TEMPERATURE: 18 },
        "11": { ENDTIME: "24:00", TEMPERATURE: 18 },
        "12": { ENDTIME: "24:00", TEMPERATURE: 18 },
        "13": { ENDTIME: "24:00", TEMPERATURE: 18 },
      } as unknown as WeekdayData;

      // Validation should ignore the null slot
      const error = validateWeekdayData(weekdayData);
      expect(error).toBeNull();
    });

    it("should reject backwards time", () => {
      const weekdayData: WeekdayData = {
        "1": { ENDTIME: "12:00", TEMPERATURE: 18 },
        "2": { ENDTIME: "08:00", TEMPERATURE: 21 }, // Goes backwards
        "3": { ENDTIME: "24:00", TEMPERATURE: 18 },
        "4": { ENDTIME: "24:00", TEMPERATURE: 16 },
        "5": { ENDTIME: "24:00", TEMPERATURE: 16 },
        "6": { ENDTIME: "24:00", TEMPERATURE: 16 },
        "7": { ENDTIME: "24:00", TEMPERATURE: 16 },
        "8": { ENDTIME: "24:00", TEMPERATURE: 16 },
        "9": { ENDTIME: "24:00", TEMPERATURE: 16 },
        "10": { ENDTIME: "24:00", TEMPERATURE: 16 },
        "11": { ENDTIME: "24:00", TEMPERATURE: 16 },
        "12": { ENDTIME: "24:00", TEMPERATURE: 16 },
        "13": { ENDTIME: "24:00", TEMPERATURE: 16 },
      };

      const error = validateWeekdayData(weekdayData);
      expect(error?.key).toBe("slotTimeBackwards");
      expect(error?.params).toEqual({ slot: "2", time: "08:00" });
    });

    it("should reject when last slot does not end at 24:00", () => {
      const weekdayData: WeekdayData = {
        "1": { ENDTIME: "06:00", TEMPERATURE: 18 },
        "2": { ENDTIME: "22:00", TEMPERATURE: 21 },
        "3": { ENDTIME: "23:00", TEMPERATURE: 18 },
      };

      const error = validateWeekdayData(weekdayData);
      expect(error?.key).toBe("lastSlotMustEnd");
    });

    it("should reject slot with missing ENDTIME", () => {
      const weekdayData: WeekdayData = {
        "1": { ENDTIME: "06:00", TEMPERATURE: 18 },
        "2": { ENDTIME: "", TEMPERATURE: 21 }, // Missing ENDTIME
        "3": { ENDTIME: "24:00", TEMPERATURE: 18 },
      };

      const error = validateWeekdayData(weekdayData);
      expect(error?.key).toBe("slotMissingValues");
      expect(error?.params).toEqual({ slot: "2" });
    });

    it("should reject slot with time exceeding 24:00", () => {
      const weekdayData: WeekdayData = {
        "1": { ENDTIME: "06:00", TEMPERATURE: 18 },
        "2": { ENDTIME: "25:00", TEMPERATURE: 21 }, // Exceeds 24:00
        "3": { ENDTIME: "24:00", TEMPERATURE: 18 },
      };

      const error = validateWeekdayData(weekdayData);
      expect(error?.key).toBe("slotTimeExceedsDay");
      expect(error?.params).toEqual({ slot: "2", time: "25:00" });
    });

    it("should ignore non-numeric slot keys", () => {
      const weekdayData = {
        "1": { ENDTIME: "06:00", TEMPERATURE: 18 },
        "2": { ENDTIME: "22:00", TEMPERATURE: 18 },
        "3": { ENDTIME: "24:00", TEMPERATURE: 18 },
        "4": { ENDTIME: "24:00", TEMPERATURE: 18 },
        "5": { ENDTIME: "24:00", TEMPERATURE: 18 },
        "6": { ENDTIME: "24:00", TEMPERATURE: 18 },
        "7": { ENDTIME: "24:00", TEMPERATURE: 18 },
        abc: { ENDTIME: "24:00", TEMPERATURE: 18 }, // Non-numeric key (ignored)
        "9": { ENDTIME: "24:00", TEMPERATURE: 18 },
        "10": { ENDTIME: "24:00", TEMPERATURE: 18 },
        "11": { ENDTIME: "24:00", TEMPERATURE: 18 },
        "12": { ENDTIME: "24:00", TEMPERATURE: 18 },
        "13": { ENDTIME: "24:00", TEMPERATURE: 18 },
      } as unknown as WeekdayData;

      // Validation should ignore non-numeric keys
      const error = validateWeekdayData(weekdayData);
      expect(error).toBeNull();
    });
  });

  describe("getTemperatureColor", () => {
    it("should return correct colors for temperature ranges", () => {
      expect(getTemperatureColor(10)).toBe("#3498db"); // Cold - Blue
      expect(getTemperatureColor(14)).toBe("#5dade2"); // Cool - Light Blue
      expect(getTemperatureColor(17)).toBe("#58d68d"); // Mild - Green
      expect(getTemperatureColor(19)).toBe("#f39c12"); // Warm - Orange
      expect(getTemperatureColor(21)).toBe("#e67e22"); // Warmer - Dark Orange
      expect(getTemperatureColor(23)).toBe("#e74c3c"); // Hot - Red
    });
  });

  describe("getTemperatureGradient", () => {
    it("should return solid color when no adjacent blocks exist", () => {
      const result = getTemperatureGradient(20, null, null);
      expect(result).toBe("#e67e22"); // Solid color for 20°C (20-22 range)
    });

    it("should return solid color when no adjacent blocks exist (different temperature)", () => {
      const result = getTemperatureGradient(15, null, null);
      expect(result).toBe("#5dade2"); // Solid color for 15°C
    });

    it("should create gradient from previous to current when only previous block exists", () => {
      const result = getTemperatureGradient(20, 15, null);
      expect(result).toContain("linear-gradient");
      expect(result).toContain("to bottom");
      expect(result).toContain("#5dade2"); // Color for 15°C (prev)
      expect(result).toContain("#e67e22"); // Color for 20°C (current)
    });

    it("should create gradient from previous to current with different temperatures", () => {
      const result = getTemperatureGradient(22, 10, null);
      expect(result).toContain("linear-gradient");
      expect(result).toContain("to bottom");
      expect(result).toContain("#3498db"); // Color for 10°C (prev)
      expect(result).toContain("#e74c3c"); // Color for 22°C (current)
    });

    it("should create gradient from current to next when only next block exists", () => {
      const result = getTemperatureGradient(20, null, 25);
      expect(result).toContain("linear-gradient");
      expect(result).toContain("to bottom");
      expect(result).toContain("#e67e22"); // Color for 20°C (current)
      expect(result).toContain("#e74c3c"); // Color for 25°C (next)
    });

    it("should create gradient from current to next with different temperatures", () => {
      const result = getTemperatureGradient(15, null, 10);
      expect(result).toContain("linear-gradient");
      expect(result).toContain("to bottom");
      expect(result).toContain("#5dade2"); // Color for 15°C (current)
      expect(result).toContain("#3498db"); // Color for 10°C (next)
    });

    it("should create gradient through current when both adjacent blocks exist", () => {
      const result = getTemperatureGradient(20, 15, 25);
      expect(result).toContain("linear-gradient");
      expect(result).toContain("to bottom");
      expect(result).toContain("#5dade2"); // Color for 15°C (prev)
      expect(result).toContain("#e67e22"); // Color for 20°C (current)
      expect(result).toContain("50%"); // Current color at 50%
      expect(result).toContain("#e74c3c"); // Color for 25°C (next)
    });

    it("should create gradient with all three colors when both adjacent blocks exist (different temps)", () => {
      const result = getTemperatureGradient(19, 10, 23);
      expect(result).toContain("linear-gradient");
      expect(result).toContain("to bottom");
      expect(result).toContain("#3498db"); // Color for 10°C (prev)
      expect(result).toContain("#f39c12"); // Color for 19°C (current, 18-20 range)
      expect(result).toContain("50%"); // Current color at 50%
      expect(result).toContain("#e74c3c"); // Color for 23°C (next)
    });

    it("should handle edge case with same temperature for all blocks", () => {
      const result = getTemperatureGradient(20, 20, 20);
      expect(result).toContain("linear-gradient");
      expect(result).toContain("#e67e22"); // All same color (20-22 range)
    });

    it("should handle edge case with very low temperature", () => {
      const result = getTemperatureGradient(5, null, null);
      expect(result).toBe("#3498db"); // Cold - Blue
    });

    it("should handle edge case with very high temperature", () => {
      const result = getTemperatureGradient(30, null, null);
      expect(result).toBe("#e74c3c"); // Hot - Red
    });

    it("should handle temperature boundaries correctly (11.9°C vs 12°C)", () => {
      const color1 = getTemperatureColor(11.9);
      const color2 = getTemperatureColor(12);
      const gradient = getTemperatureGradient(12, 11.9, null);
      expect(gradient).toContain(color1);
      expect(gradient).toContain(color2);
    });

    it("should handle descending temperature gradient", () => {
      const result = getTemperatureGradient(15, 25, 10);
      expect(result).toContain("linear-gradient");
      expect(result).toContain("#e74c3c"); // Color for 25°C (prev)
      expect(result).toContain("#5dade2"); // Color for 15°C (current)
      expect(result).toContain("#3498db"); // Color for 10°C (next)
    });
  });

  describe("roundTimeToQuarter", () => {
    it("should round time to nearest 15 minutes", () => {
      expect(roundTimeToQuarter(0)).toBe(0);
      expect(roundTimeToQuarter(7)).toBe(0); // 7 rounds down to 0
      expect(roundTimeToQuarter(8)).toBe(15); // 8 rounds up to 15
      expect(roundTimeToQuarter(22)).toBe(15); // 22 rounds down to 15
      expect(roundTimeToQuarter(23)).toBe(30); // 23 rounds up to 30
      expect(roundTimeToQuarter(37)).toBe(30); // 37 rounds down to 30 (37/15=2.467)
      expect(roundTimeToQuarter(38)).toBe(45); // 38 rounds up to 45 (38/15=2.533)
      expect(roundTimeToQuarter(53)).toBe(60); // 53 rounds up to 60
    });
  });

  describe("formatTemperature", () => {
    it("should format temperature with unit", () => {
      expect(formatTemperature(20.5)).toBe("20.5°C");
      expect(formatTemperature(18.0, "°F")).toBe("18.0°F");
      expect(formatTemperature(22.3)).toBe("22.3°C");
    });
  });

  describe("validateTimeBlocks", () => {
    it("should return no warnings for valid blocks", () => {
      const blocks: TimeBlock[] = [
        {
          startTime: "00:00",
          startMinutes: 0,
          endTime: "08:00",
          endMinutes: 480,
          temperature: 18.0,
          slot: 1,
        },
        {
          startTime: "08:00",
          startMinutes: 480,
          endTime: "22:00",
          endMinutes: 1320,
          temperature: 21.0,
          slot: 2,
        },
        {
          startTime: "22:00",
          startMinutes: 1320,
          endTime: "24:00",
          endMinutes: 1440,
          temperature: 18.0,
          slot: 3,
        },
      ];

      const warnings = validateTimeBlocks(blocks);
      expect(warnings).toHaveLength(0);
    });

    it("should warn when block has backwards time", () => {
      const blocks: TimeBlock[] = [
        {
          startTime: "12:00",
          startMinutes: 720,
          endTime: "10:00",
          endMinutes: 600,
          temperature: 20.0,
          slot: 1,
        },
      ];

      const warnings = validateTimeBlocks(blocks);
      const warning = findMessage(warnings, "blockEndBeforeStart");
      expect(warning?.params?.block).toBe("1");
    });

    it("should warn when middle block has backwards time", () => {
      const blocks: TimeBlock[] = [
        {
          startTime: "00:00",
          startMinutes: 0,
          endTime: "08:00",
          endMinutes: 480,
          temperature: 18.0,
          slot: 1,
        },
        {
          startTime: "08:00",
          startMinutes: 480,
          endTime: "06:00", // Backwards time in middle block
          endMinutes: 360,
          temperature: 20.0,
          slot: 2,
        },
        {
          startTime: "06:00",
          startMinutes: 360,
          endTime: "24:00",
          endMinutes: 1440,
          temperature: 18.0,
          slot: 3,
        },
      ];

      const warnings = validateTimeBlocks(blocks);
      const warning = findMessage(warnings, "blockEndBeforeStart");
      expect(warning?.params?.block).toBe("2");
    });

    it("should warn when block has zero duration", () => {
      const blocks: TimeBlock[] = [
        {
          startTime: "08:00",
          startMinutes: 480,
          endTime: "08:00",
          endMinutes: 480,
          temperature: 20.0,
          slot: 1,
        },
        {
          startTime: "08:00",
          startMinutes: 480,
          endTime: "24:00",
          endMinutes: 1440,
          temperature: 21.0,
          slot: 2,
        },
      ];

      const warnings = validateTimeBlocks(blocks);
      const warning = findMessage(warnings, "blockZeroDuration");
      expect(warning?.params?.block).toBe("1");
    });

    it("should warn when temperature is out of range", () => {
      const blocks: TimeBlock[] = [
        {
          startTime: "00:00",
          startMinutes: 0,
          endTime: "12:00",
          endMinutes: 720,
          temperature: 3.0, // Too low
          slot: 1,
        },
        {
          startTime: "12:00",
          startMinutes: 720,
          endTime: "24:00",
          endMinutes: 1440,
          temperature: 35.0, // Too high
          slot: 2,
        },
      ];

      const warnings = validateTimeBlocks(blocks);
      const tempWarnings = warnings.filter((w) => w.key === "temperatureOutOfRange");
      expect(tempWarnings).toHaveLength(2);
    });

    it("should allow empty blocks array (base temperature is sufficient)", () => {
      const blocks: TimeBlock[] = [];

      const warnings = validateTimeBlocks(blocks);
      expect(warnings.length).toBe(0);
    });

    it("should warn when time values are invalid", () => {
      const blocks: TimeBlock[] = [
        {
          startTime: "00:00",
          startMinutes: -10, // Invalid
          endTime: "12:00",
          endMinutes: 720,
          temperature: 20.0,
          slot: 1,
        },
        {
          startTime: "12:00",
          startMinutes: 720,
          endTime: "25:00",
          endMinutes: 1500, // Invalid (exceeds 1440)
          temperature: 20.0,
          slot: 2,
        },
      ];

      const warnings = validateTimeBlocks(blocks);
      expect(findMessage(warnings, "invalidStartTime")?.params?.block).toBe("1");
      expect(findMessage(warnings, "invalidEndTime")?.params?.block).toBe("2");
    });

    it("should detect multiple warnings in one block set", () => {
      const blocks: TimeBlock[] = [
        {
          startTime: "00:00",
          startMinutes: 0,
          endTime: "08:00",
          endMinutes: 480,
          temperature: 35.0, // Out of range
          slot: 1,
        },
        {
          startTime: "09:00",
          startMinutes: 540,
          endTime: "23:00",
          endMinutes: 1380,
          temperature: 20.0,
          slot: 2,
        },
      ];

      const warnings = validateTimeBlocks(blocks);
      expect(warnings.length).toBeGreaterThan(0);
      expect(findMessage(warnings, "temperatureOutOfRange")).toBeDefined();
    });

    it("should use custom min/max temperature range", () => {
      const blocks: TimeBlock[] = [
        {
          startTime: "00:00",
          startMinutes: 0,
          endTime: "12:00",
          endMinutes: 720,
          temperature: 12.0,
          slot: 1,
        },
        {
          startTime: "12:00",
          startMinutes: 720,
          endTime: "24:00",
          endMinutes: 1440,
          temperature: 25.0,
          slot: 2,
        },
      ];

      // Test with custom range 10-28°C
      const warnings = validateTimeBlocks(blocks, 10, 28);
      expect(warnings).toHaveLength(0);
    });

    it("should warn when temperature is below custom min", () => {
      const blocks: TimeBlock[] = [
        {
          startTime: "00:00",
          startMinutes: 0,
          endTime: "24:00",
          endMinutes: 1440,
          temperature: 8.0, // Below custom min of 10
          slot: 1,
        },
      ];

      const warnings = validateTimeBlocks(blocks, 10, 28);
      const warning = findMessage(warnings, "temperatureOutOfRange");
      expect(warning).toBeDefined();
      expect(warning?.params).toEqual({ block: "1", min: "10", max: "28" });
    });

    it("should warn when temperature is above custom max", () => {
      const blocks: TimeBlock[] = [
        {
          startTime: "00:00",
          startMinutes: 0,
          endTime: "24:00",
          endMinutes: 1440,
          temperature: 30.0, // Above custom max of 28
          slot: 1,
        },
      ];

      const warnings = validateTimeBlocks(blocks, 10, 28);
      const warning = findMessage(warnings, "temperatureOutOfRange");
      expect(warning).toBeDefined();
      expect(warning?.params).toEqual({ block: "1", min: "10", max: "28" });
    });

    it("should accept temperature at custom min boundary", () => {
      const blocks: TimeBlock[] = [
        {
          startTime: "00:00",
          startMinutes: 0,
          endTime: "24:00",
          endMinutes: 1440,
          temperature: 10.0, // Exactly at custom min
          slot: 1,
        },
      ];

      const warnings = validateTimeBlocks(blocks, 10, 28);
      expect(findMessage(warnings, "temperatureOutOfRange")).toBeUndefined();
    });

    it("should accept temperature at custom max boundary", () => {
      const blocks: TimeBlock[] = [
        {
          startTime: "00:00",
          startMinutes: 0,
          endTime: "24:00",
          endMinutes: 1440,
          temperature: 28.0, // Exactly at custom max
          slot: 1,
        },
      ];

      const warnings = validateTimeBlocks(blocks, 10, 28);
      expect(findMessage(warnings, "temperatureOutOfRange")).toBeUndefined();
    });

    it("should use default range when no parameters provided", () => {
      const blocks: TimeBlock[] = [
        {
          startTime: "00:00",
          startMinutes: 0,
          endTime: "24:00",
          endMinutes: 1440,
          temperature: 20.0,
          slot: 1,
        },
      ];

      const warnings = validateTimeBlocks(blocks);
      expect(warnings).toHaveLength(0);
    });
  });

  describe("validateProfileData", () => {
    it("should validate correct profile data", () => {
      const profileData = {
        MONDAY: {
          "1": { ENDTIME: "08:00", TEMPERATURE: 18 },
          "2": { ENDTIME: "22:00", TEMPERATURE: 21 },
          "3": { ENDTIME: "24:00", TEMPERATURE: 18 },
          "4": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "5": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "6": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "7": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "8": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "9": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "10": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "11": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "12": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "13": { ENDTIME: "24:00", TEMPERATURE: 16 },
        },
        TUESDAY: {
          "1": { ENDTIME: "24:00", TEMPERATURE: 20 },
          "2": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "3": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "4": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "5": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "6": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "7": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "8": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "9": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "10": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "11": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "12": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "13": { ENDTIME: "24:00", TEMPERATURE: 16 },
        },
        WEDNESDAY: {
          "1": { ENDTIME: "24:00", TEMPERATURE: 20 },
          "2": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "3": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "4": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "5": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "6": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "7": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "8": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "9": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "10": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "11": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "12": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "13": { ENDTIME: "24:00", TEMPERATURE: 16 },
        },
        THURSDAY: {
          "1": { ENDTIME: "24:00", TEMPERATURE: 20 },
          "2": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "3": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "4": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "5": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "6": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "7": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "8": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "9": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "10": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "11": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "12": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "13": { ENDTIME: "24:00", TEMPERATURE: 16 },
        },
        FRIDAY: {
          "1": { ENDTIME: "24:00", TEMPERATURE: 20 },
          "2": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "3": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "4": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "5": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "6": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "7": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "8": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "9": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "10": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "11": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "12": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "13": { ENDTIME: "24:00", TEMPERATURE: 16 },
        },
        SATURDAY: {
          "1": { ENDTIME: "24:00", TEMPERATURE: 20 },
          "2": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "3": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "4": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "5": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "6": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "7": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "8": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "9": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "10": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "11": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "12": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "13": { ENDTIME: "24:00", TEMPERATURE: 16 },
        },
        SUNDAY: {
          "1": { ENDTIME: "24:00", TEMPERATURE: 20 },
          "2": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "3": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "4": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "5": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "6": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "7": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "8": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "9": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "10": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "11": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "12": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "13": { ENDTIME: "24:00", TEMPERATURE: 16 },
        },
      };

      expect(validateProfileData(profileData)).toBeNull();
    });

    it("should reject non-object data", () => {
      expect(validateProfileData(null)?.key).toBe("scheduleMustBeObject");
      expect(validateProfileData(undefined)?.key).toBe("scheduleMustBeObject");
      expect(validateProfileData("string")?.key).toBe("scheduleMustBeObject");
      expect(validateProfileData(123)?.key).toBe("scheduleMustBeObject");
    });

    it("should reject missing weekdays", () => {
      const profileData = {
        MONDAY: {
          "1": { ENDTIME: "24:00", TEMPERATURE: 20 },
          "2": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "3": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "4": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "5": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "6": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "7": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "8": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "9": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "10": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "11": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "12": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "13": { ENDTIME: "24:00", TEMPERATURE: 16 },
        },
        // Missing other weekdays
      };

      const error = validateProfileData(profileData);
      expect(error?.key).toBe("missingWeekday");
      expect(error?.params).toEqual({ weekday: "TUESDAY" });
    });

    it("should reject invalid weekday data structure", () => {
      const profileData = {
        MONDAY: "invalid",
        TUESDAY: {
          "1": { ENDTIME: "24:00", TEMPERATURE: 20 },
          "2": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "3": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "4": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "5": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "6": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "7": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "8": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "9": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "10": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "11": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "12": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "13": { ENDTIME: "24:00", TEMPERATURE: 16 },
        },
        WEDNESDAY: {
          "1": { ENDTIME: "24:00", TEMPERATURE: 20 },
          "2": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "3": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "4": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "5": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "6": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "7": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "8": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "9": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "10": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "11": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "12": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "13": { ENDTIME: "24:00", TEMPERATURE: 16 },
        },
        THURSDAY: {
          "1": { ENDTIME: "24:00", TEMPERATURE: 20 },
          "2": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "3": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "4": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "5": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "6": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "7": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "8": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "9": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "10": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "11": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "12": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "13": { ENDTIME: "24:00", TEMPERATURE: 16 },
        },
        FRIDAY: {
          "1": { ENDTIME: "24:00", TEMPERATURE: 20 },
          "2": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "3": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "4": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "5": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "6": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "7": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "8": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "9": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "10": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "11": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "12": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "13": { ENDTIME: "24:00", TEMPERATURE: 16 },
        },
        SATURDAY: {
          "1": { ENDTIME: "24:00", TEMPERATURE: 20 },
          "2": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "3": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "4": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "5": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "6": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "7": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "8": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "9": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "10": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "11": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "12": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "13": { ENDTIME: "24:00", TEMPERATURE: 16 },
        },
        SUNDAY: {
          "1": { ENDTIME: "24:00", TEMPERATURE: 20 },
          "2": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "3": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "4": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "5": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "6": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "7": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "8": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "9": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "10": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "11": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "12": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "13": { ENDTIME: "24:00", TEMPERATURE: 16 },
        },
      };

      const error = validateProfileData(profileData);
      expect(error?.key).toBe("invalidWeekdayData");
      expect(error?.params).toEqual({ weekday: "MONDAY" });
    });

    it("should reject invalid slot data within weekday", () => {
      const profileData = {
        MONDAY: {
          "1": { ENDTIME: "08:00", TEMPERATURE: 18 },
          "2": { ENDTIME: "06:00", TEMPERATURE: 21 }, // Time goes backwards
          "3": { ENDTIME: "24:00", TEMPERATURE: 18 },
          "4": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "5": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "6": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "7": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "8": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "9": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "10": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "11": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "12": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "13": { ENDTIME: "24:00", TEMPERATURE: 16 },
        },
        TUESDAY: {
          "1": { ENDTIME: "24:00", TEMPERATURE: 20 },
          "2": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "3": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "4": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "5": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "6": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "7": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "8": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "9": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "10": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "11": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "12": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "13": { ENDTIME: "24:00", TEMPERATURE: 16 },
        },
        WEDNESDAY: {
          "1": { ENDTIME: "24:00", TEMPERATURE: 20 },
          "2": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "3": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "4": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "5": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "6": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "7": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "8": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "9": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "10": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "11": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "12": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "13": { ENDTIME: "24:00", TEMPERATURE: 16 },
        },
        THURSDAY: {
          "1": { ENDTIME: "24:00", TEMPERATURE: 20 },
          "2": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "3": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "4": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "5": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "6": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "7": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "8": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "9": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "10": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "11": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "12": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "13": { ENDTIME: "24:00", TEMPERATURE: 16 },
        },
        FRIDAY: {
          "1": { ENDTIME: "24:00", TEMPERATURE: 20 },
          "2": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "3": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "4": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "5": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "6": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "7": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "8": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "9": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "10": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "11": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "12": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "13": { ENDTIME: "24:00", TEMPERATURE: 16 },
        },
        SATURDAY: {
          "1": { ENDTIME: "24:00", TEMPERATURE: 20 },
          "2": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "3": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "4": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "5": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "6": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "7": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "8": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "9": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "10": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "11": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "12": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "13": { ENDTIME: "24:00", TEMPERATURE: 16 },
        },
        SUNDAY: {
          "1": { ENDTIME: "24:00", TEMPERATURE: 20 },
          "2": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "3": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "4": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "5": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "6": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "7": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "8": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "9": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "10": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "11": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "12": { ENDTIME: "24:00", TEMPERATURE: 16 },
          "13": { ENDTIME: "24:00", TEMPERATURE: 16 },
        },
      };

      const error = validateProfileData(profileData);
      expect(error?.key).toBe("weekdayValidationError");
      expect(error?.params).toEqual({ weekday: "MONDAY" });
      expect(error?.nested?.key).toBe("slotTimeBackwards");
    });
  });

  describe("parseSimpleWeekdaySchedule", () => {
    it("should parse simple weekday schedule into time blocks", () => {
      const simpleData: SimpleWeekdayData = [
        20.0,
        [
          { STARTTIME: "06:00", ENDTIME: "08:00", TEMPERATURE: 22.0 },
          { STARTTIME: "18:00", ENDTIME: "22:00", TEMPERATURE: 21.5 },
        ],
      ];

      const { blocks, baseTemperature } = parseSimpleWeekdaySchedule(simpleData);

      expect(baseTemperature).toBe(20.0);
      expect(blocks).toHaveLength(2);
      expect(blocks[0]).toEqual({
        startTime: "06:00",
        startMinutes: 360,
        endTime: "08:00",
        endMinutes: 480,
        temperature: 22.0,
        slot: 1,
      });
      expect(blocks[1]).toEqual({
        startTime: "18:00",
        startMinutes: 1080,
        endTime: "22:00",
        endMinutes: 1320,
        temperature: 21.5,
        slot: 2,
      });
    });

    it("should handle empty periods array", () => {
      const simpleData: SimpleWeekdayData = [19.5, []];

      const { blocks, baseTemperature } = parseSimpleWeekdaySchedule(simpleData);

      expect(baseTemperature).toBe(19.5);
      expect(blocks).toHaveLength(0);
    });

    it("should sort periods by start time", () => {
      const simpleData: SimpleWeekdayData = [
        20.0,
        [
          { STARTTIME: "18:00", ENDTIME: "22:00", TEMPERATURE: 21.5 },
          { STARTTIME: "06:00", ENDTIME: "08:00", TEMPERATURE: 22.0 },
        ],
      ];

      const { blocks } = parseSimpleWeekdaySchedule(simpleData);

      expect(blocks[0].startTime).toBe("06:00");
      expect(blocks[1].startTime).toBe("18:00");
    });
  });

  describe("timeBlocksToSimpleWeekdayData", () => {
    it("should convert time blocks to simple weekday data", () => {
      const blocks: TimeBlock[] = [
        {
          startTime: "06:00",
          startMinutes: 360,
          endTime: "08:00",
          endMinutes: 480,
          temperature: 22.0,
          slot: 1,
        },
        {
          startTime: "18:00",
          startMinutes: 1080,
          endTime: "22:00",
          endMinutes: 1320,
          temperature: 21.5,
          slot: 2,
        },
      ];

      const simpleData = timeBlocksToSimpleWeekdayData(blocks, 20.0);

      expect(simpleData[0]).toBe(20.0);
      expect(simpleData[1]).toHaveLength(2);
      expect(simpleData[1][0]).toEqual({
        STARTTIME: "06:00",
        ENDTIME: "08:00",
        TEMPERATURE: 22.0,
      });
      expect(simpleData[1][1]).toEqual({
        STARTTIME: "18:00",
        ENDTIME: "22:00",
        TEMPERATURE: 21.5,
      });
    });

    it("should handle empty blocks array", () => {
      const blocks: TimeBlock[] = [];

      const simpleData = timeBlocksToSimpleWeekdayData(blocks, 19.5);

      expect(simpleData[0]).toBe(19.5);
      expect(simpleData[1]).toHaveLength(0);
    });

    it("should sort blocks by time before converting", () => {
      const blocks: TimeBlock[] = [
        {
          startTime: "18:00",
          startMinutes: 1080,
          endTime: "22:00",
          endMinutes: 1320,
          temperature: 21.5,
          slot: 2,
        },
        {
          startTime: "06:00",
          startMinutes: 360,
          endTime: "08:00",
          endMinutes: 480,
          temperature: 22.0,
          slot: 1,
        },
      ];

      const simpleData = timeBlocksToSimpleWeekdayData(blocks, 20.0);

      expect(simpleData[1][0].STARTTIME).toBe("06:00");
      expect(simpleData[1][1].STARTTIME).toBe("18:00");
    });
  });

  describe("calculateBaseTemperature", () => {
    it("should return default temperature for empty blocks", () => {
      const blocks: TimeBlock[] = [];

      const baseTemp = calculateBaseTemperature(blocks);

      expect(baseTemp).toBe(20.0);
    });

    it("should calculate base temperature as most common temperature", () => {
      const blocks: TimeBlock[] = [
        {
          startTime: "00:00",
          startMinutes: 0,
          endTime: "06:00",
          endMinutes: 360,
          temperature: 18.0,
          slot: 1,
        },
        {
          startTime: "06:00",
          startMinutes: 360,
          endTime: "22:00",
          endMinutes: 1320,
          temperature: 21.0,
          slot: 2,
        },
        {
          startTime: "22:00",
          startMinutes: 1320,
          endTime: "24:00",
          endMinutes: 1440,
          temperature: 18.0,
          slot: 3,
        },
      ];

      const baseTemp = calculateBaseTemperature(blocks);

      // 21.0 covers 960 minutes (16 hours), most common
      expect(baseTemp).toBe(21.0);
    });

    it("should handle single block", () => {
      const blocks: TimeBlock[] = [
        {
          startTime: "00:00",
          startMinutes: 0,
          endTime: "24:00",
          endMinutes: 1440,
          temperature: 19.5,
          slot: 1,
        },
      ];

      const baseTemp = calculateBaseTemperature(blocks);

      expect(baseTemp).toBe(19.5);
    });
  });

  describe("validateSimpleWeekdayData", () => {
    it("should validate correct simple weekday data", () => {
      const simpleData: SimpleWeekdayData = [
        20.0,
        [
          { STARTTIME: "06:00", ENDTIME: "08:00", TEMPERATURE: 22.0 },
          { STARTTIME: "18:00", ENDTIME: "22:00", TEMPERATURE: 21.5 },
        ],
      ];

      const error = validateSimpleWeekdayData(simpleData);

      expect(error).toBeNull();
    });

    it("should reject base temperature out of range", () => {
      const simpleData: SimpleWeekdayData = [
        35.0,
        [{ STARTTIME: "06:00", ENDTIME: "08:00", TEMPERATURE: 22.0 }],
      ];

      const error = validateSimpleWeekdayData(simpleData);

      expect(error?.key).toBe("temperatureOutOfRange");
      expect(error?.params?.block).toBe("base");
    });

    it("should reject period temperature out of range", () => {
      const simpleData: SimpleWeekdayData = [
        20.0,
        [{ STARTTIME: "06:00", ENDTIME: "08:00", TEMPERATURE: 35.0 }],
      ];

      const error = validateSimpleWeekdayData(simpleData);

      expect(error?.key).toBe("temperatureOutOfRange");
      expect(error?.params?.block).toBe("1");
    });

    it("should reject period with end before start", () => {
      const simpleData: SimpleWeekdayData = [
        20.0,
        [{ STARTTIME: "08:00", ENDTIME: "06:00", TEMPERATURE: 22.0 }],
      ];

      const error = validateSimpleWeekdayData(simpleData);

      expect(error?.key).toBe("blockEndBeforeStart");
    });

    it("should reject overlapping periods", () => {
      const simpleData: SimpleWeekdayData = [
        20.0,
        [
          { STARTTIME: "06:00", ENDTIME: "10:00", TEMPERATURE: 22.0 },
          { STARTTIME: "08:00", ENDTIME: "12:00", TEMPERATURE: 21.5 },
        ],
      ];

      const error = validateSimpleWeekdayData(simpleData);

      expect(error?.key).toBe("slotTimeBackwards");
    });

    it("should reject period with missing values", () => {
      const simpleData: SimpleWeekdayData = [
        20.0,
        [{ STARTTIME: "06:00", ENDTIME: "", TEMPERATURE: 22.0 }],
      ];

      const error = validateSimpleWeekdayData(simpleData);

      expect(error?.key).toBe("slotMissingValues");
    });

    it("should use custom temperature range", () => {
      const simpleData: SimpleWeekdayData = [
        25.0,
        [{ STARTTIME: "06:00", ENDTIME: "08:00", TEMPERATURE: 28.0 }],
      ];

      const error = validateSimpleWeekdayData(simpleData, 10, 30);

      expect(error).toBeNull();
    });
  });

  describe("validateSimpleProfileData", () => {
    it("should validate correct simple profile data", () => {
      const profileData: SimpleProfileData = {
        MONDAY: [20.0, [{ STARTTIME: "06:00", ENDTIME: "08:00", TEMPERATURE: 22.0 }]],
        TUESDAY: [20.0, [{ STARTTIME: "06:00", ENDTIME: "08:00", TEMPERATURE: 22.0 }]],
        WEDNESDAY: [20.0, [{ STARTTIME: "06:00", ENDTIME: "08:00", TEMPERATURE: 22.0 }]],
        THURSDAY: [20.0, [{ STARTTIME: "06:00", ENDTIME: "08:00", TEMPERATURE: 22.0 }]],
        FRIDAY: [20.0, [{ STARTTIME: "06:00", ENDTIME: "08:00", TEMPERATURE: 22.0 }]],
        SATURDAY: [20.0, [{ STARTTIME: "06:00", ENDTIME: "08:00", TEMPERATURE: 22.0 }]],
        SUNDAY: [20.0, [{ STARTTIME: "06:00", ENDTIME: "08:00", TEMPERATURE: 22.0 }]],
      };

      const error = validateSimpleProfileData(profileData);

      expect(error).toBeNull();
    });

    it("should reject non-object data", () => {
      const error = validateSimpleProfileData(null);

      expect(error?.key).toBe("scheduleMustBeObject");
    });

    it("should reject missing weekday", () => {
      const profileData = {
        MONDAY: [20.0, [{ STARTTIME: "06:00", ENDTIME: "08:00", TEMPERATURE: 22.0 }]],
        TUESDAY: [20.0, [{ STARTTIME: "06:00", ENDTIME: "08:00", TEMPERATURE: 22.0 }]],
      };

      const error = validateSimpleProfileData(profileData);

      expect(error?.key).toBe("missingWeekday");
      expect(error?.params?.weekday).toBe("WEDNESDAY");
    });

    it("should reject invalid weekday data structure", () => {
      const profileData = {
        MONDAY: [20.0], // Missing periods array
        TUESDAY: [20.0, [{ STARTTIME: "06:00", ENDTIME: "08:00", TEMPERATURE: 22.0 }]],
        WEDNESDAY: [20.0, [{ STARTTIME: "06:00", ENDTIME: "08:00", TEMPERATURE: 22.0 }]],
        THURSDAY: [20.0, [{ STARTTIME: "06:00", ENDTIME: "08:00", TEMPERATURE: 22.0 }]],
        FRIDAY: [20.0, [{ STARTTIME: "06:00", ENDTIME: "08:00", TEMPERATURE: 22.0 }]],
        SATURDAY: [20.0, [{ STARTTIME: "06:00", ENDTIME: "08:00", TEMPERATURE: 22.0 }]],
        SUNDAY: [20.0, [{ STARTTIME: "06:00", ENDTIME: "08:00", TEMPERATURE: 22.0 }]],
      };

      const error = validateSimpleProfileData(profileData);

      expect(error?.key).toBe("invalidWeekdayData");
      expect(error?.params?.weekday).toBe("MONDAY");
    });

    it("should reject non-array weekday data", () => {
      const profileData = {
        MONDAY: { base: 20.0 }, // Wrong structure
        TUESDAY: [20.0, [{ STARTTIME: "06:00", ENDTIME: "08:00", TEMPERATURE: 22.0 }]],
        WEDNESDAY: [20.0, [{ STARTTIME: "06:00", ENDTIME: "08:00", TEMPERATURE: 22.0 }]],
        THURSDAY: [20.0, [{ STARTTIME: "06:00", ENDTIME: "08:00", TEMPERATURE: 22.0 }]],
        FRIDAY: [20.0, [{ STARTTIME: "06:00", ENDTIME: "08:00", TEMPERATURE: 22.0 }]],
        SATURDAY: [20.0, [{ STARTTIME: "06:00", ENDTIME: "08:00", TEMPERATURE: 22.0 }]],
        SUNDAY: [20.0, [{ STARTTIME: "06:00", ENDTIME: "08:00", TEMPERATURE: 22.0 }]],
      };

      const error = validateSimpleProfileData(profileData);

      expect(error?.key).toBe("invalidWeekdayData");
      expect(error?.params?.weekday).toBe("MONDAY");
    });

    it("should propagate weekday validation errors", () => {
      const profileData: SimpleProfileData = {
        MONDAY: [
          20.0,
          [{ STARTTIME: "08:00", ENDTIME: "06:00", TEMPERATURE: 22.0 }], // End before start
        ],
        TUESDAY: [20.0, [{ STARTTIME: "06:00", ENDTIME: "08:00", TEMPERATURE: 22.0 }]],
        WEDNESDAY: [20.0, [{ STARTTIME: "06:00", ENDTIME: "08:00", TEMPERATURE: 22.0 }]],
        THURSDAY: [20.0, [{ STARTTIME: "06:00", ENDTIME: "08:00", TEMPERATURE: 22.0 }]],
        FRIDAY: [20.0, [{ STARTTIME: "06:00", ENDTIME: "08:00", TEMPERATURE: 22.0 }]],
        SATURDAY: [20.0, [{ STARTTIME: "06:00", ENDTIME: "08:00", TEMPERATURE: 22.0 }]],
        SUNDAY: [20.0, [{ STARTTIME: "06:00", ENDTIME: "08:00", TEMPERATURE: 22.0 }]],
      };

      const error = validateSimpleProfileData(profileData);

      expect(error?.key).toBe("weekdayValidationError");
      expect(error?.params?.weekday).toBe("MONDAY");
      expect(error?.nested?.key).toBe("blockEndBeforeStart");
    });
  });
});
