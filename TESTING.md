# Testing Documentation

This document describes how to test the HomematicIP Local Climate Scheduler Card functionality.

## Unit Tests

The project includes comprehensive unit tests for utility functions and types. Run tests with:

```bash
npm test
```

### Test Coverage

- **Utils (src/utils.test.ts)**: Tests for time conversion, schedule parsing, validation, and formatting functions
- **Types (src/types.test.ts)**: Tests for type constants and weekday definitions

## Feature Validation

The following features have been implemented and can be validated manually or through integration tests.

### 1. Undo/Redo Functionality

**Feature**: Users can undo and redo editing actions before saving schedules.

**How to Test**:

1. Open the card in Home Assistant
2. Click on any weekday to open the editor
3. Make changes to time blocks (add, remove, or modify)
4. Click the undo button (↶) or press Ctrl+Z (Cmd+Z on Mac)
   - **Expected**: Changes should be reverted to previous state
5. Click the redo button (↷) or press Ctrl+Y (Cmd+Y on Mac)
   - **Expected**: Undone changes should be reapplied
6. Verify that:
   - Undo button is disabled when at the beginning of history
   - Redo button is disabled when at the end of history
   - History supports up to 50 states
   - Making a new edit after undo clears the redo history

**Test Cases**:

- ✅ Add a time block, then undo
- ✅ Remove a time block, then undo
- ✅ Modify temperature, then undo
- ✅ Modify time, then undo
- ✅ Undo multiple times, then redo multiple times
- ✅ Undo, make new change (redo history should be cleared)
- ✅ Keyboard shortcuts work (Ctrl+Z, Ctrl+Y, Ctrl+Shift+Z)
- ✅ Buttons show correct enabled/disabled state

### 2. Loading State Management

**Feature**: Visual feedback during backend operations with automatic timeout.

**How to Test**:

1. Open the card in Home Assistant
2. Click on any weekday to open the editor
3. Make a change and click "Save"
   - **Expected**: Loading overlay with spinner appears
   - **Expected**: Overlay disappears when backend responds or after 10 seconds
4. Copy a schedule from one day
5. Paste to another day
   - **Expected**: Loading overlay appears during paste operation
   - **Expected**: Overlay disappears when complete or after 10 seconds

**Test Cases**:

- ✅ Loading spinner appears when saving schedule
- ✅ Loading spinner appears when pasting schedule
- ✅ Loading state clears after successful save
- ✅ Loading state clears after 10-second timeout if backend doesn't respond
- ✅ UI is blocked during loading state
- ✅ Loading state is cleaned up on component disconnect

### 3. Current Time Tracking

**Feature**: Visual indicator showing current time of day and highlighting active temperature block.

**How to Test**:

1. Open the card in Home Assistant during normal hours
2. Observe the schedule view
   - **Expected**: Red dashed line appears horizontally across all weekdays at current time
   - **Expected**: Line includes a circular marker on the left side
   - **Expected**: Current day's active temperature block has a pulsing white glow
3. Wait for 1 minute
   - **Expected**: Time indicator updates to new position
4. Check at different times of day:
   - Midnight: Line should be at the top (0%)
   - Noon: Line should be in the middle (50%)
   - Evening: Line should be in the lower section

**Test Cases**:

- ✅ Current time indicator line is visible
- ✅ Line position corresponds to current time (% of day)
- ✅ Line updates every minute
- ✅ Current weekday is correctly identified
- ✅ Active temperature block on current weekday is highlighted
- ✅ Blocks on other weekdays are not highlighted
- ✅ Blocks before/after current time are not highlighted
- ✅ Highlight uses pulsing glow animation
- ✅ Interval is set up on component connect
- ✅ Interval is cleared on component disconnect

### 4. Time Percentage Calculation

**Mathematical Validation**:

Current time as percentage of day = (hours × 60 + minutes) / 1440 × 100

**Test Cases**:

- 00:00 → 0 minutes → 0%
- 06:00 → 360 minutes → 25%
- 12:00 → 720 minutes → 50%
- 18:00 → 1080 minutes → 75%
- 23:59 → 1439 minutes → 99.93%

### 5. Active Block Detection

**Logic**:
A block is active when:

- Current weekday matches block's weekday
- Current time in minutes >= block start time
- Current time in minutes < block end time (exclusive)

**Test Cases**:

- ✅ Block from 08:00-16:00, current time 12:00 → Active
- ✅ Block from 08:00-16:00, current time 07:59 → Not active
- ✅ Block from 08:00-16:00, current time 16:00 → Not active (boundary)
- ✅ Block from 08:00-16:00, current time 08:00 → Active (boundary)
- ✅ Correct weekday, correct time → Active
- ✅ Wrong weekday, correct time → Not active
- ✅ Correct weekday, wrong time → Not active

### 6. Export/Import Functionality

**Feature**: Export current schedule to JSON file and import from file with validation.

**How to Test Export**:

1. Open the card in Home Assistant
2. Ensure a schedule is loaded
3. Click the export button (⬇️) in the header
   - **Expected**: JSON file downloads automatically
   - **Expected**: Filename includes profile name and date (e.g., `schedule-P1-2025-11-13.json`)
4. Open the downloaded JSON file
   - **Expected**: Contains `version`, `profile`, `exported`, and `scheduleData` fields
   - **Expected**: `scheduleData` has all 7 weekdays (MONDAY-SUNDAY)
   - **Expected**: Each weekday has 13 slots with ENDTIME and TEMPERATURE

**How to Test Import**:

1. Click the import button (⬆️) in the header
2. Select a valid JSON schedule file
   - **Expected**: Loading indicator appears
   - **Expected**: Success message shown after import completes
   - **Expected**: Schedule view updates with imported data
   - **Expected**: All weekdays reflect the imported schedule
3. Try importing an invalid file (e.g., text file)
   - **Expected**: Error message: "Invalid file format. Please select a JSON file."
4. Try importing a JSON file with invalid structure
   - **Expected**: Error message with validation details
5. Try importing a JSON file with backwards time
   - **Expected**: Error message indicating the validation issue

**Test Cases**:

- ✅ Export button is disabled when no schedule data is available
- ✅ Export creates valid JSON file with correct structure
- ✅ Export file naming includes profile name and current date
- ✅ Import button is always enabled
- ✅ Import accepts .json files
- ✅ Import rejects non-JSON files
- ✅ Import validates file contains all 7 weekdays
- ✅ Import validates each weekday has 13 slots
- ✅ Import validates time values are sequential
- ✅ Import validates temperature values are in range
- ✅ Import shows loading indicator during upload
- ✅ Import shows success message on completion
- ✅ Import shows specific error messages for validation failures
- ✅ Import supports files with metadata wrapper
- ✅ Import supports files without metadata wrapper (raw schedule data)
- ✅ Import applies all weekdays to current profile
- ✅ Schedule view updates immediately after successful import

**Validation Tests**:

- ✅ `validateProfileData()` rejects null/undefined/non-object data
- ✅ `validateProfileData()` rejects missing weekdays
- ✅ `validateProfileData()` rejects invalid weekday data structure
- ✅ `validateProfileData()` rejects invalid slot data (backwards time, wrong slot count, etc.)
- ✅ `validateProfileData()` accepts valid complete schedule data

### 7. Multi-Entity Selector

**Feature**: When multiple entities are configured, the card header shows a dropdown to switch the active schedule; single-entity setups continue to show the friendly name.

**How to Test**:

1. Configure the card with multiple entities:

   ```yaml
   type: custom:homematicip-local-climate-scheduler-card
   entities:
     - climate.living_room
     - climate.bedroom
     - climate.office
   ```

2. Open the card.
   - **Expected**: Header contains a select element listing all configured entities.
   - **Expected**: The initial selection matches the first available entity or the last active entity stored in the card state.
3. Switch to another entity via the dropdown.
   - **Expected**: Schedule grid reloads with the newly selected entity's data.
   - **Expected**: Pending edits, copy buffers, drag mode, and validation warnings reset during the switch.
4. Configure the card with only one entity (either via `entity` or `entities: [id]`).
   - **Expected**: Header falls back to showing the friendly name or custom `name`.
   - **Expected**: No dropdown is rendered.

**Test Cases**:

- ✅ Header selector renders only when more than one entity is configured.
- ✅ Dropdown labels use each entity’s `friendly_name` when available.
- ✅ Switching entities updates `_activeEntityId`, loads fresh schedule data, and clears cached blocks.
- ✅ Service calls (save, paste, import, profile change) target the currently selected entity.
- ✅ Error message references the active entity if it becomes unavailable.
- ✅ Single-entity configurations behave exactly as before (name text, no selector).

## Integration Testing

### End-to-End Workflow Test

1. **Setup**: Install card in Home Assistant
2. **Load**: Open card and verify schedule loads correctly
3. **Edit**: Click weekday, modify schedule
4. **Undo/Redo**: Test undo/redo functionality
5. **Save**: Save changes, verify loading indicator
6. **Verify**: Check that changes persist after reload
7. **Time Indicator**: Verify current time line appears
8. **Active Block**: Verify current block is highlighted
9. **Copy/Paste**: Test copy/paste between days
10. **Profile Switch**: Test switching between profiles
11. **Export**: Export schedule to JSON file
12. **Import**: Import schedule from JSON file with validation

## Automated Testing Strategy

### Current State

- ✅ Unit tests for utility functions (42 tests)
- ✅ Type validation tests
- ⚠️ Lit component excluded from Jest (requires complex mocking)

### Why Component Tests Are Not Included

The HomematicScheduleCard is a Lit web component that:

- Uses Lit decorators and reactive properties
- Requires DOM rendering and shadow DOM
- Depends on Home Assistant's global objects
- Requires complex mocking setup for Jest

The component is excluded from Jest coverage (see `jest.config.js`) because:

1. Lit components are better tested with browser-based tools (Playwright, Cypress)
2. Manual testing ensures real-world behavior
3. Core logic is thoroughly tested in utility functions

### Future Testing Improvements

- Add Playwright or Cypress for E2E browser tests
- Add visual regression testing
- Add integration tests with mock Home Assistant instance

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- utils.test.ts
```

## Test Results

Current test status: **42 tests passing**

```
Test Suites: 2 passed, 2 total
Tests:       42 passed, 42 total
```

## Contributing Tests

When adding new features:

1. Add unit tests for utility functions in `src/utils.test.ts`
2. Add type tests if new types are introduced in `src/types.test.ts`
3. Update this TESTING.md with manual validation steps
4. Document expected behavior and edge cases
5. Ensure all tests pass before submitting PR

## Known Limitations

- Lit component tests require browser environment (not included in Jest)
- Time-dependent tests use mocked dates for consistency
- Backend interactions are not mocked in current test suite
- Visual appearance tests are manual only
