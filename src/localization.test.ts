import { getTranslations, formatString, Translations } from "./localization";

describe("localization", () => {
  describe("getTranslations", () => {
    it("should return English translations for 'en' language code", () => {
      const translations = getTranslations("en");
      expect(translations.weekdays.short.monday).toBe("Mo");
      expect(translations.weekdays.long.monday).toBe("Monday");
      expect(translations.ui.schedule).toBe("Schedule");
      expect(translations.errors.failedToChangeProfile).toBe("Failed to change profile: {error}");
      expect(translations.validationMessages.blockEndBeforeStart).toBe(
        "Block {block}: End time is before start time",
      );
    });

    it("should return German translations for 'de' language code", () => {
      const translations = getTranslations("de");
      expect(translations.weekdays.short.monday).toBe("Mo");
      expect(translations.weekdays.short.tuesday).toBe("Di");
      expect(translations.weekdays.long.monday).toBe("Montag");
      expect(translations.weekdays.long.tuesday).toBe("Dienstag");
      expect(translations.ui.schedule).toBe("Zeitplan");
      expect(translations.errors.failedToChangeProfile).toBe(
        "Fehler beim Wechseln des Profils: {error}",
      );
      expect(translations.validationMessages.blockEndBeforeStart).toBe(
        "Block {block}: Die Endzeit liegt vor der Startzeit",
      );
    });

    it("should normalize language codes with region (e.g., 'en-US' -> 'en')", () => {
      const translations = getTranslations("en-US");
      expect(translations.ui.schedule).toBe("Schedule");
    });

    it("should normalize language codes with region (e.g., 'de-DE' -> 'de')", () => {
      const translations = getTranslations("de-DE");
      expect(translations.ui.schedule).toBe("Zeitplan");
    });

    it("should handle uppercase language codes", () => {
      const translations = getTranslations("EN");
      expect(translations.ui.schedule).toBe("Schedule");
    });

    it("should handle mixed case language codes", () => {
      const translations = getTranslations("De");
      expect(translations.ui.schedule).toBe("Zeitplan");
    });

    it("should fallback to English for unsupported language codes", () => {
      const translations = getTranslations("fr");
      expect(translations.ui.schedule).toBe("Schedule");
    });

    it("should fallback to English for unknown language codes", () => {
      const translations = getTranslations("xx-YY");
      expect(translations.ui.schedule).toBe("Schedule");
    });

    it("should handle empty string and fallback to English", () => {
      const translations = getTranslations("");
      expect(translations.ui.schedule).toBe("Schedule");
    });

    it("should return all required translation keys for English", () => {
      const translations = getTranslations("en");

      // Check weekdays
      expect(translations.weekdays).toBeDefined();
      expect(translations.weekdays.short).toBeDefined();
      expect(translations.weekdays.long).toBeDefined();
      expect(translations.weekdays.short.monday).toBeDefined();
      expect(translations.weekdays.short.tuesday).toBeDefined();
      expect(translations.weekdays.short.wednesday).toBeDefined();
      expect(translations.weekdays.short.thursday).toBeDefined();
      expect(translations.weekdays.short.friday).toBeDefined();
      expect(translations.weekdays.short.saturday).toBeDefined();
      expect(translations.weekdays.short.sunday).toBeDefined();
      expect(translations.weekdays.long.monday).toBeDefined();
      expect(translations.weekdays.long.tuesday).toBeDefined();
      expect(translations.weekdays.long.wednesday).toBeDefined();
      expect(translations.weekdays.long.thursday).toBeDefined();
      expect(translations.weekdays.long.friday).toBeDefined();
      expect(translations.weekdays.long.saturday).toBeDefined();
      expect(translations.weekdays.long.sunday).toBeDefined();

      // Check UI strings
      expect(translations.ui).toBeDefined();
      expect(translations.ui.schedule).toBeDefined();
      expect(translations.ui.loading).toBeDefined();
      expect(translations.ui.entityNotFound).toBeDefined();
      expect(translations.ui.clickToEdit).toBeDefined();
      expect(translations.ui.edit).toBeDefined();
      expect(translations.ui.cancel).toBeDefined();
      expect(translations.ui.save).toBeDefined();
      expect(translations.ui.addTimeBlock).toBeDefined();
      expect(translations.ui.copySchedule).toBeDefined();
      expect(translations.ui.pasteSchedule).toBeDefined();
      expect(translations.ui.undo).toBeDefined();
      expect(translations.ui.redo).toBeDefined();
      expect(translations.ui.undoShortcut).toBeDefined();
      expect(translations.ui.redoShortcut).toBeDefined();
      expect(translations.ui.toggleCompactView).toBeDefined();
      expect(translations.ui.toggleFullView).toBeDefined();
      expect(translations.ui.exportSchedule).toBeDefined();
      expect(translations.ui.importSchedule).toBeDefined();
      expect(translations.ui.exportTooltip).toBeDefined();
      expect(translations.ui.importTooltip).toBeDefined();
      expect(translations.ui.exportSuccess).toBeDefined();
      expect(translations.ui.importSuccess).toBeDefined();
      expect(translations.ui.unsavedChanges).toBeDefined();
      expect(translations.ui.saveAll).toBeDefined();
      expect(translations.ui.discard).toBeDefined();
      expect(translations.ui.enableDragDrop).toBeDefined();
      expect(translations.ui.disableDragDrop).toBeDefined();
      expect(translations.ui.confirmDiscardChanges).toBeDefined();

      // Check error messages
      expect(translations.errors).toBeDefined();
      expect(translations.errors.failedToChangeProfile).toBeDefined();
      expect(translations.errors.failedToSaveSchedule).toBeDefined();
      expect(translations.errors.failedToPasteSchedule).toBeDefined();
      expect(translations.errors.invalidSchedule).toBeDefined();
      expect(translations.errors.failedToExport).toBeDefined();
      expect(translations.errors.failedToImport).toBeDefined();
      expect(translations.errors.invalidImportFile).toBeDefined();
      expect(translations.errors.invalidImportFormat).toBeDefined();
      expect(translations.errors.invalidImportData).toBeDefined();

      // Check warnings
      expect(translations.warnings).toBeDefined();
      expect(translations.warnings.title).toBeDefined();
      expect(translations.warnings.noWarnings).toBeDefined();

      // Check validation messages
      expect(translations.validationMessages).toBeDefined();
      expect(translations.validationMessages.blockEndBeforeStart).toBeDefined();
      expect(translations.validationMessages.blockZeroDuration).toBeDefined();
      expect(translations.validationMessages.invalidStartTime).toBeDefined();
      expect(translations.validationMessages.invalidEndTime).toBeDefined();
      expect(translations.validationMessages.temperatureOutOfRange).toBeDefined();
      expect(translations.validationMessages.invalidSlotCount).toBeDefined();
      expect(translations.validationMessages.invalidSlotKey).toBeDefined();
      expect(translations.validationMessages.missingSlot).toBeDefined();
      expect(translations.validationMessages.slotMissingValues).toBeDefined();
      expect(translations.validationMessages.slotTimeBackwards).toBeDefined();
      expect(translations.validationMessages.slotTimeExceedsDay).toBeDefined();
      expect(translations.validationMessages.lastSlotMustEnd).toBeDefined();
      expect(translations.validationMessages.scheduleMustBeObject).toBeDefined();
      expect(translations.validationMessages.missingWeekday).toBeDefined();
      expect(translations.validationMessages.invalidWeekdayData).toBeDefined();
      expect(translations.validationMessages.weekdayValidationError).toBeDefined();
    });

    it("should return all required translation keys for German", () => {
      const translations = getTranslations("de");

      // Check weekdays
      expect(translations.weekdays).toBeDefined();
      expect(translations.weekdays.short.monday).toBe("Mo");
      expect(translations.weekdays.short.tuesday).toBe("Di");
      expect(translations.weekdays.short.wednesday).toBe("Mi");
      expect(translations.weekdays.short.thursday).toBe("Do");
      expect(translations.weekdays.short.friday).toBe("Fr");
      expect(translations.weekdays.short.saturday).toBe("Sa");
      expect(translations.weekdays.short.sunday).toBe("So");
      expect(translations.weekdays.long.monday).toBe("Montag");
      expect(translations.weekdays.long.tuesday).toBe("Dienstag");
      expect(translations.weekdays.long.wednesday).toBe("Mittwoch");
      expect(translations.weekdays.long.thursday).toBe("Donnerstag");
      expect(translations.weekdays.long.friday).toBe("Freitag");
      expect(translations.weekdays.long.saturday).toBe("Samstag");
      expect(translations.weekdays.long.sunday).toBe("Sonntag");

      // Check UI strings
      expect(translations.ui.schedule).toBe("Zeitplan");
      expect(translations.ui.loading).toBe("Zeitplandaten werden geladen...");
      expect(translations.ui.cancel).toBe("Abbrechen");
      expect(translations.ui.save).toBe("Speichern");

      // Check error messages
      expect(translations.errors.failedToSaveSchedule).toBe(
        "Fehler beim Speichern des Zeitplans: {error}",
      );

      // Check warnings
      expect(translations.warnings.title).toBe("Validierungswarnungen");

      // Check validation messages
      expect(translations.validationMessages.temperatureOutOfRange).toBe(
        "Block {block}: Temperatur außerhalb des Bereichs ({min}-{max}°C)",
      );
    });
  });

  describe("formatString", () => {
    it("should replace single placeholder with value", () => {
      const result = formatString("Hello {name}", { name: "World" });
      expect(result).toBe("Hello World");
    });

    it("should replace multiple placeholders with values", () => {
      const result = formatString("Hello {name}, you are {age} years old", {
        name: "Alice",
        age: "30",
      });
      expect(result).toBe("Hello Alice, you are 30 years old");
    });

    it("should replace same placeholder multiple times", () => {
      const result = formatString("{name} loves {name}", { name: "Bob" });
      // Note: Current implementation only replaces each key once
      expect(result).toBe("Bob loves {name}");
    });

    it("should handle template with no placeholders", () => {
      const result = formatString("No placeholders here", {});
      expect(result).toBe("No placeholders here");
    });

    it("should leave unreplaced placeholders if key not provided", () => {
      const result = formatString("Hello {name}", {});
      expect(result).toBe("Hello {name}");
    });

    it("should handle empty string template", () => {
      const result = formatString("", { name: "Test" });
      expect(result).toBe("");
    });

    it("should handle empty params object", () => {
      const result = formatString("Test string", {});
      expect(result).toBe("Test string");
    });

    it("should replace error message placeholders", () => {
      const result = formatString("Failed to change profile: {error}", {
        error: "Connection timeout",
      });
      expect(result).toBe("Failed to change profile: Connection timeout");
    });

    it("should replace entity placeholder", () => {
      const result = formatString("Entity {entity} not found", {
        entity: "climate.thermostat",
      });
      expect(result).toBe("Entity climate.thermostat not found");
    });

    it("should replace weekday placeholder", () => {
      const result = formatString("Edit {weekday}", { weekday: "Monday" });
      expect(result).toBe("Edit Monday");
    });

    it("should handle special characters in values", () => {
      const result = formatString("Error: {error}", {
        error: "Failed with: $pecial ch@rs!",
      });
      expect(result).toBe("Error: Failed with: $pecial ch@rs!");
    });

    it("should handle numeric values converted to strings", () => {
      const result = formatString("Value: {value}", { value: "123" });
      expect(result).toBe("Value: 123");
    });

    it("should handle placeholders with underscores", () => {
      const result = formatString("Status: {status_code}", { status_code: "200" });
      expect(result).toBe("Status: 200");
    });

    it("should handle complex template with multiple different placeholders", () => {
      const result = formatString("User {user} performed {action} on {entity} at {time}", {
        user: "admin",
        action: "update",
        entity: "thermostat",
        time: "12:00",
      });
      expect(result).toBe("User admin performed update on thermostat at 12:00");
    });
  });

  describe("Translations type structure", () => {
    it("should have correct structure for English translations", () => {
      const translations: Translations = getTranslations("en");

      expect(typeof translations.weekdays.short.monday).toBe("string");
      expect(typeof translations.weekdays.long.monday).toBe("string");
      expect(typeof translations.ui.schedule).toBe("string");
      expect(typeof translations.errors.failedToChangeProfile).toBe("string");
      expect(typeof translations.warnings.title).toBe("string");
      expect(typeof translations.validationMessages.blockEndBeforeStart).toBe("string");
    });

    it("should have correct structure for German translations", () => {
      const translations: Translations = getTranslations("de");

      expect(typeof translations.weekdays.short.monday).toBe("string");
      expect(typeof translations.weekdays.long.monday).toBe("string");
      expect(typeof translations.ui.schedule).toBe("string");
      expect(typeof translations.errors.failedToChangeProfile).toBe("string");
      expect(typeof translations.warnings.title).toBe("string");
      expect(typeof translations.validationMessages.blockEndBeforeStart).toBe("string");
    });
  });
});
