import {
  timeToMinutes,
  minutesToTime,
  parseWeekdaySchedule,
  timeBlocksToWeekdayData,
  convertToBackendFormat,
  validateWeekdayData,
  getTemperatureColor,
  roundTimeToQuarter,
  formatTemperature,
} from "./utils";
import { WeekdayData } from "./types";

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
    it("should convert time blocks to weekday data format", () => {
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

      expect(Object.keys(weekdayData)).toHaveLength(13);
      expect(weekdayData["1"]).toEqual({ ENDTIME: "06:00", TEMPERATURE: 18 });
      expect(weekdayData["2"]).toEqual({ ENDTIME: "22:00", TEMPERATURE: 21 });
      expect(weekdayData["3"]).toEqual({ ENDTIME: "24:00", TEMPERATURE: 18 });
      expect(weekdayData["4"]).toEqual({ ENDTIME: "24:00", TEMPERATURE: 16 });
      expect(weekdayData["13"]).toEqual({ ENDTIME: "24:00", TEMPERATURE: 16 });
    });
  });

  describe("convertToBackendFormat", () => {
    it("should convert string keys to integer keys", () => {
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

      const backendData = convertToBackendFormat(weekdayData);

      // Check that keys are integers (object keys are always strings in JS,
      // but they should be numeric strings that represent integers)
      expect(backendData[1]).toEqual({ ENDTIME: "06:00", TEMPERATURE: 18 });
      expect(backendData[2]).toEqual({ ENDTIME: "22:00", TEMPERATURE: 21 });
      expect(backendData[13]).toEqual({ ENDTIME: "24:00", TEMPERATURE: 16 });

      // Verify all 13 slots are present
      for (let i = 1; i <= 13; i++) {
        expect(backendData[i]).toBeDefined();
        expect(backendData[i].ENDTIME).toBeDefined();
        expect(backendData[i].TEMPERATURE).toBeDefined();
      }
    });

    it("should preserve ENDTIME and TEMPERATURE values", () => {
      const weekdayData: WeekdayData = {
        "1": { ENDTIME: "09:30", TEMPERATURE: 22.5 },
        "2": { ENDTIME: "17:45", TEMPERATURE: 19.0 },
        "3": { ENDTIME: "24:00", TEMPERATURE: 16.5 },
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

      expect(validateWeekdayData(weekdayData)).toBeNull();
    });

    it("should reject invalid number of slots", () => {
      const weekdayData: WeekdayData = {
        "1": { ENDTIME: "24:00", TEMPERATURE: 18 },
      };

      const error = validateWeekdayData(weekdayData);
      expect(error).toContain("Invalid number of slots");
    });

    it("should reject incorrect number of slots (detected via count)", () => {
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

      const error = validateWeekdayData(weekdayData);
      // Should detect incorrect number of slots (12 instead of 13)
      expect(error).toContain("Invalid number of slots");
    });

    it("should reject slot with null/undefined value", () => {
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

      const error = validateWeekdayData(weekdayData);
      // Should detect missing slot during iteration
      expect(error).toContain("Missing slot 8");
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
      expect(error).toContain("time goes backwards");
    });

    it("should reject last slot not ending at 24:00", () => {
      const weekdayData: WeekdayData = {
        "1": { ENDTIME: "06:00", TEMPERATURE: 18 },
        "2": { ENDTIME: "22:00", TEMPERATURE: 21 },
        "3": { ENDTIME: "23:00", TEMPERATURE: 18 },
        "4": { ENDTIME: "23:00", TEMPERATURE: 16 },
        "5": { ENDTIME: "23:00", TEMPERATURE: 16 },
        "6": { ENDTIME: "23:00", TEMPERATURE: 16 },
        "7": { ENDTIME: "23:00", TEMPERATURE: 16 },
        "8": { ENDTIME: "23:00", TEMPERATURE: 16 },
        "9": { ENDTIME: "23:00", TEMPERATURE: 16 },
        "10": { ENDTIME: "23:00", TEMPERATURE: 16 },
        "11": { ENDTIME: "23:00", TEMPERATURE: 16 },
        "12": { ENDTIME: "23:00", TEMPERATURE: 16 },
        "13": { ENDTIME: "23:00", TEMPERATURE: 16 }, // Should be 24:00
      };

      const error = validateWeekdayData(weekdayData);
      expect(error).toContain("Last slot must end at 24:00");
    });

    it("should reject slot with missing ENDTIME", () => {
      const weekdayData: WeekdayData = {
        "1": { ENDTIME: "06:00", TEMPERATURE: 18 },
        "2": { ENDTIME: "", TEMPERATURE: 21 }, // Missing ENDTIME
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
      expect(error).toContain("missing ENDTIME or TEMPERATURE");
    });

    it("should reject slot with time exceeding 24:00", () => {
      const weekdayData: WeekdayData = {
        "1": { ENDTIME: "06:00", TEMPERATURE: 18 },
        "2": { ENDTIME: "25:00", TEMPERATURE: 21 }, // Exceeds 24:00
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
      expect(error).toContain("time exceeds 24:00");
    });

    it("should reject non-numeric slot keys", () => {
      const weekdayData = {
        "1": { ENDTIME: "06:00", TEMPERATURE: 18 },
        "2": { ENDTIME: "22:00", TEMPERATURE: 18 },
        "3": { ENDTIME: "24:00", TEMPERATURE: 18 },
        "4": { ENDTIME: "24:00", TEMPERATURE: 18 },
        "5": { ENDTIME: "24:00", TEMPERATURE: 18 },
        "6": { ENDTIME: "24:00", TEMPERATURE: 18 },
        "7": { ENDTIME: "24:00", TEMPERATURE: 18 },
        abc: { ENDTIME: "24:00", TEMPERATURE: 18 }, // Non-numeric key
        "9": { ENDTIME: "24:00", TEMPERATURE: 18 },
        "10": { ENDTIME: "24:00", TEMPERATURE: 18 },
        "11": { ENDTIME: "24:00", TEMPERATURE: 18 },
        "12": { ENDTIME: "24:00", TEMPERATURE: 18 },
        "13": { ENDTIME: "24:00", TEMPERATURE: 18 },
      } as unknown as WeekdayData;

      const error = validateWeekdayData(weekdayData);
      expect(error).toContain("Invalid slot key");
      expect(error).toContain("must be integer 1-13");
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
});
