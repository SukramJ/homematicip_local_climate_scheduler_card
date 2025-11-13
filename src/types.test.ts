import { WEEKDAYS, WEEKDAY_LABELS, WEEKDAY_LABELS_DE, Weekday } from "./types";

describe("Types", () => {
  describe("WEEKDAYS", () => {
    it("should contain all 7 weekdays", () => {
      expect(WEEKDAYS).toHaveLength(7);
      expect(WEEKDAYS).toEqual([
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY",
        "SUNDAY",
      ]);
    });
  });

  describe("WEEKDAY_LABELS", () => {
    it("should have labels for all weekdays", () => {
      expect(Object.keys(WEEKDAY_LABELS)).toHaveLength(7);
      expect(WEEKDAY_LABELS.MONDAY).toBe("Mo");
      expect(WEEKDAY_LABELS.TUESDAY).toBe("Tu");
      expect(WEEKDAY_LABELS.WEDNESDAY).toBe("We");
      expect(WEEKDAY_LABELS.THURSDAY).toBe("Th");
      expect(WEEKDAY_LABELS.FRIDAY).toBe("Fr");
      expect(WEEKDAY_LABELS.SATURDAY).toBe("Sa");
      expect(WEEKDAY_LABELS.SUNDAY).toBe("Su");
    });
  });

  describe("WEEKDAY_LABELS_DE", () => {
    it("should have German labels for all weekdays", () => {
      expect(Object.keys(WEEKDAY_LABELS_DE)).toHaveLength(7);
      expect(WEEKDAY_LABELS_DE.MONDAY).toBe("Mo");
      expect(WEEKDAY_LABELS_DE.TUESDAY).toBe("Di");
      expect(WEEKDAY_LABELS_DE.WEDNESDAY).toBe("Mi");
      expect(WEEKDAY_LABELS_DE.THURSDAY).toBe("Do");
      expect(WEEKDAY_LABELS_DE.FRIDAY).toBe("Fr");
      expect(WEEKDAY_LABELS_DE.SATURDAY).toBe("Sa");
      expect(WEEKDAY_LABELS_DE.SUNDAY).toBe("So");
    });
  });

  describe("Weekday type", () => {
    it("should accept valid weekday values", () => {
      const monday: Weekday = "MONDAY";
      const tuesday: Weekday = "TUESDAY";

      expect(monday).toBe("MONDAY");
      expect(tuesday).toBe("TUESDAY");
    });
  });
});
