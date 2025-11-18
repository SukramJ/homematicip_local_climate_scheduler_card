# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.1] - 2025-11-18

### Fixed

- Completed renaming of card references across all documentation files
- Updated package.json metadata to reflect correct card name
- Fixed remaining references to old card name in CONTRIBUTING.md, QUICKSTART.md, and info.md

## [0.4.0] - 2025-11-18

### Breaking Changes

- Card renamed from `homematicip-local-climate-scheduler-card` to `homematicip-local-climate-schedule-card` (removed 'r' from scheduler)
- Card now uses `simple_schedule_data` attribute instead of `schedule_data` (backward compatible - falls back to `schedule_data` if `simple_schedule_data` is not available)
- Service call changed from `set_schedule_profile_weekday` to `set_schedule_simple_weekday`
- New data model uses base temperature + time periods instead of 13-slot format

### Added

- Base temperature UI in editor for setting temperature of unscheduled periods
- Base temperature input field with visual temperature indicator (color-coded)
- Support for new `simple_schedule_data` data model from HomematicIP Local integration
- `SimpleSchedulePeriod`, `SimpleWeekdayData`, and `SimpleProfileData` type definitions
- Utility functions for parsing and converting simple schedule format:
  - `parseSimpleWeekdaySchedule()` - converts simple schedule to TimeBlocks
  - `timeBlocksToSimpleWeekdayData()` - converts TimeBlocks to simple schedule
  - `calculateBaseTemperature()` - intelligently determines base temperature from blocks
  - `validateSimpleWeekdayData()` - validates simple schedule data
  - `validateSimpleProfileData()` - validates complete simple profile
- Dual-format import/export support:
  - Auto-detects format when importing (simple vs legacy)
  - Exports in format matching current schedule data
  - Export files include format metadata (version 2.0 for simple, 1.0 for legacy)
- "Temperature Periods" label in editor to distinguish periods from base temperature

### Changed

- Card custom element name changed from `custom:homematicip-local-climate-scheduler-card` to `custom:homematicip-local-climate-schedule-card`
- Card file renamed from `homematicip-local-climate-scheduler-card.js` to `homematicip-local-climate-schedule-card.js`
- Card display name changed from "Homematic(IP) Local Climate Scheduler Card" to "Homematic(IP) Local Climate Schedule Card"
- Card reads `simple_schedule_data` attribute with automatic fallback to `schedule_data` for backward compatibility
- Service calls use `set_schedule_simple_weekday` with simple weekday data tuple `[base_temperature, periods[]]`
- Copy/paste operations now include base temperature
- Export format updated to version 2.0 for simple schedules, includes format field
- Editor layout reorganized with base temperature section at top, periods list below

### Technical

- Simple schedule format uses base temperature plus list of time periods (STARTTIME, ENDTIME, TEMPERATURE)
- More efficient than 13-slot format - only stores explicit temperature deviations
- Base temperature automatically calculated from most common temperature in schedule
- All existing tests (88 tests) still pass
- Maintained full backward compatibility with legacy `schedule_data` format

## [0.3.2] - 2025-11-16

### Changed

- Card file renamed from `homematic-schedule-card.ts` to `homematicip-local-climate-scheduler-card.ts`
- Frontend no longer fills weekday schedule slots to 13; backend is responsible for missing slots
- Validation accepts fewer than 13 slots and ensures the last slot (if any) ends at `24:00`
- Parsing of weekday data is resilient to null/undefined or malformed slot entries
- Conversion to backend format includes only existing numeric keys (no fill-up)
- Card parses schedules directly without any frontend normalization

### Fixed

- Card correctly handles backend responses with incomplete schedule data (no frontend fill-up)

## [0.3.1] - 2025-11-14

### Fixed

- Time input step attribute browser compatibility: `step` attribute is now properly set but may not be enforced by all browsers due to limited HTML5 time input support across different browsers (Chrome/Edge partially support it, Firefox/Safari ignore it)
- Card automatically follows the Home Assistant UI language whenever no explicit `language` option is set

### Note

- The `time_step_minutes` configuration works correctly for drag & drop operations (15-minute snapping) and internal validation, but native browser time pickers may still allow minute-precise input due to browser limitations

## [0.3.0] - 2025-11-14

### Added

- Dynamic temperature range support using `min_temp` and `max_temp` values from backend entity attributes
- Temperature validation now uses device-specific limits instead of hardcoded 5-30.5°C range
- Fallback to default range (5-30.5°C) when backend doesn't provide temperature limits
- Input field constraints dynamically adjusted based on backend temperature range
- Drag & drop temperature adjustment respects device-specific min/max values
- 6 new tests for custom temperature range validation covering boundaries and edge cases
- Dynamic temperature step support using `target_temp_step` value from backend entity attributes
- Temperature step used for input field increment/decrement and drag & drop snapping
- Fallback to default step (0.5°C) when backend doesn't provide temperature step
- Configurable time step for time selection in detail editor via `time_step_minutes` configuration option
- Time input field now uses step attribute to control minute increments (default: 15 minutes)
- Support for custom time step values (e.g., 1, 5, 10, 15, 30 minutes) in editor time picker
- Multiple entity support with a header drop-down to switch the currently edited schedule inline
- Localized weekday labels now provide both short (Mo, Di, …) and long (Montag, Dienstag, …) forms for each language

### Changed

- `validateTimeBlocks()` function now accepts optional `minTemp` and `maxTemp` parameters (defaults to 5 and 30.5)
- Temperature validation error messages now display actual min/max range (e.g., "10-28°C" instead of always "5-30.5°C")
- `ScheduleEntityAttributes` interface extended with optional `min_temp`, `max_temp`, and `target_temp_step` fields
- Editor input fields now use dynamic `min`, `max`, and `step` attributes from state instead of hardcoded values
- Drag & drop temperature snapping now uses dynamic step size from backend instead of hardcoded 0.5°C increments
- `HomematicScheduleCardConfig` interface extended with optional `time_step_minutes` field for configurable time picker step
- Time input in editor now enforces configured step size instead of allowing minute-precise inputs
- Schedule overview continues to show short weekday headers, while the detail editor now always displays the long, fully translated weekday name
- Validation warnings and error details shown in the editor/import flow now use localized translations instead of fixed English strings
- Validation logic now returns structured message keys with parameters, ensuring any new locales automatically inherit consistent error formatting
- Rollup build now runs in production mode without sourcemaps, tree-shakes side effects, and applies more aggressive terser compression to shrink the shipped bundle
- Entity and profile dropdowns are now consistently sorted alphabetically for easier selection

## [0.2.1] - 2025-11-13

### Changed

- Disabled mouse hover effects (weekday column lift animation and time block tooltips) when drag & drop mode is active to prevent visual interference with drag operations
- Removed unnecessary validation warnings from the editor: "Last block must end at 24:00" and "Gap detected between block X and Y" (backend automatically corrects these issues)

### Performance

- Optimized rendering performance with static TIME_LABELS constant
- Added CSS `will-change` properties for animated elements (current-time-indicator, weekday-column.editable, copy-btn.active, time-block.active)
- Improved browser rendering pipeline for frequently animated components

## [0.2.0] - 2025-11-13

### Added

- Loading indicator overlay with spinner during backend interactions
- 10-second timeout for loading indicator when saving or pasting schedules
- Visual feedback when data is being sent to backend via `set_schedule_profile_weekday`
- Current time indicator line displayed horizontally across all weekdays
- Real-time update of current time indicator (updates every minute)
- Red dashed line with circular marker showing the current time of day
- Active temperature block highlighting with pulsing glow effect
- Visual feedback showing which temperature block is currently active based on current time and weekday
- Automatic detection of current weekday and time to highlight the active schedule block
- Undo/redo functionality for editing actions before saving
- History stack maintaining up to 50 previous states of schedule edits
- Undo and redo buttons in the editor interface with visual feedback for enabled/disabled states
- Keyboard shortcuts: Ctrl+Z (or Cmd+Z on Mac) for undo, Ctrl+Y (or Cmd+Y/Ctrl+Shift+Z on Mac) for redo
- Automatic state saving before add, remove, and update operations on time blocks
- Comprehensive testing documentation (TESTING.md) describing feature validation procedures
- Manual test cases for undo/redo, loading state, time tracking, and active block detection
- Testing strategy documentation explaining automated and manual testing approaches
- Internationalization (i18n) support with English and German translations
- Automatic language detection from Home Assistant settings
- `language` configuration option to manually set card language (en/de)
- Translation system for all UI text: buttons, labels, error messages, and tooltips
- Localized weekday labels for different languages
- Dynamic language switching when Home Assistant language changes
- View mode toggle button to switch between full view and compact view
- Compact view mode with smaller day columns for better space utilization on smaller screens
- Reduced gaps, font sizes, and hidden copy/paste actions in compact mode
- Icon-based toggle button (⬜ for full view, ▭ for compact view) with localized tooltips
- Temperature gradient visualization option with `show_gradient` configuration setting
- Smooth gradient colors on temperature blocks based on temperature transitions between adjacent blocks
- `getTemperatureGradient()` utility function to generate CSS linear-gradient strings
- Conditional rendering: gradient mode creates smooth color transitions, solid mode keeps discrete colors
- Real-time validation warnings in the schedule editor
- Visual warning panel displaying issues with time blocks (gaps, backwards time, temperature out of range, etc.)
- `validateTimeBlocks()` utility function for real-time validation of editing state
- Automatic validation updates after any editing action (add, remove, update, undo, redo)
- Localized warning messages in English and German
- Warning panel with orange-tinted background and warning icon for visibility
- Comprehensive tests for validation function covering all warning scenarios (37 total tests)
- Mobile optimization with responsive layout and touch-friendly interface
- Responsive CSS media queries for tablets (768px), phones (480px), and landscape orientation
- Touch-optimized button sizes with 44px minimum touch targets following accessibility guidelines
- Mobile-specific layout adjustments: stacked header controls, full-width editor buttons, responsive grid spacing
- Touch event handling with `:active` states instead of `:hover` for better mobile feedback
- Optimized font sizes and spacing for smaller screens (reduced padding, adjusted font sizes)
- Landscape orientation support with adjusted heights for better space utilization
- Touch-specific pointer detection using `@media (hover: none) and (pointer: coarse)` for native touch devices
- Responsive time-block-editor grid that adapts column widths for mobile screens
- Mobile-friendly tooltips that appear on tap/active state instead of hover
- Export/Import functionality for schedule backup and sharing
- Export button to download current schedule as JSON file with metadata (profile name, export date)
- Import button to load schedule from JSON file with comprehensive validation
- `validateProfileData()` utility function to validate imported schedule structure
- Automatic validation of imported data: checks for all weekdays, valid time slots, and correct data format
- Support for importing files with or without metadata wrapper
- Visual feedback with success/error messages during export/import operations
- Loading indicator during import process with 10-second timeout
- Localized UI labels and error messages for export/import in English and German
- Export file naming includes profile name and date (e.g., `schedule-P1-2025-11-13.json`)
- Comprehensive tests for import validation (42 total tests including 5 new validateProfileData tests)
- Drag-and-drop functionality for time block boundaries with visual adjustment of start/end times
- Automatic snapping to 15-minute intervals (0, 15, 30, 45) during drag operations
- Visual drag handles on time block boundaries with hover effects
- Batch save mode: changes are not sent to backend immediately during drag operations
- Pending changes banner displayed when unsaved changes exist
- "Save all" button to commit all pending changes to backend in a single batch operation
- "Discard" button to revert all pending changes without saving
- Visual indication of blocks with pending changes (dashed outline)
- Touch support for drag-and-drop on mobile devices
- Localized UI labels for pending changes banner in English and German
- Vertical drag-and-drop on time block centers to adjust temperature values
- Drag up to decrease temperature, drag down to increase temperature
- Automatic snapping to 0.5°C increments during temperature drag operations
- Temperature constraints (5°C - 30.5°C) enforced during drag
- Visual cursor feedback (ns-resize) when hovering over temperature drag areas
- Hover effect on temperature drag areas for better discoverability
- Temperature drag integrates with batch save mode (pending changes system)
- Touch support for temperature adjustment on mobile devices
- 50 pixels of vertical movement equals 1°C temperature change
- Drag & drop mode toggle button to enable/disable drag-and-drop functionality
- Drag handles and temperature drag areas only visible when drag & drop mode is enabled
- Detail editor (click on day) is disabled when in drag & drop mode
- Confirmation dialog when exiting drag & drop mode with unsaved changes
- Users can choose to save or discard pending changes before exiting mode
- Icon-based toggle button (✋ for disabled, 🔒 for enabled) with localized tooltips
- Localized UI labels for drag & drop mode toggle in English and German
- Time axis on the left side showing hours (00:00 - 24:00)
- Enhanced tooltips on hover showing start time, end time, and temperature
- Automatic sorting of time slots by end time in ascending order
- Automatic renumbering of slot numbers after sorting (1, 2, 3, ...)
- Validation of schedule data before saving to backend
- UI constraints (min/max) for time input fields to prevent invalid entries
- Backend format conversion with integer keys for aiohomematic compatibility
- Tests for time block ordering and slot renumbering
- Tests for backend format with sequential slot numbers

### Performance

- Optimized rendering performance with schedule block caching
- Reduced redundant computations with memoized weekday label lookups
- Implemented `shouldUpdate` lifecycle optimization to prevent unnecessary re-renders
- Added parsed schedule cache with automatic invalidation on data changes
- Cached weekday label map to avoid repeated object creation
- Cached static time labels array to eliminate recreation on every render
- Added CSS `will-change` properties for animated elements (current-time-indicator, hover transforms, pulse animations)
- Optimized browser rendering pipeline for frequently animated components

### Fixed

- View now updates automatically after saving or pasting schedules
- Added explicit `_updateFromEntity()` and `requestUpdate()` calls after successful backend operations
- Ensures UI reflects latest data immediately without waiting for backend events
- Editor dialog now displays translated and properly formatted weekday names instead of raw constants (e.g., "Mi bearbeiten" instead of "WEDNESDAY bearbeiten")

### Changed

- Upgraded ESLint from 8.x to 9.x with flat config format (eslint.config.mjs)
- Updated TypeScript-ESLint packages to v8.16.0 for ESLint 9 compatibility
- Last time block is automatically corrected to end at 24:00
- Release workflow now uses tags without 'v' prefix (e.g., 0.2.0 instead of v0.2.0)
- Release workflow permissions added for GITHUB_TOKEN
- Replaced deprecated create-release action with action-gh-release@v2

### Fixed

- Time slots are now guaranteed to be in ascending chronological order
- Slot numbers are always sequential (1-13) regardless of input order
- Fixed deprecation warnings for `glob@7.2.3` and `inflight@1.0.6` by upgrading to `test-exclude@7.0.1`
- Fixed release workflow permission errors
- Schedule data now validated before transmission to prevent backend errors

### Technical

- Added `convertToBackendFormat()` function for integer key conversion
- Added `validateWeekdayData()` call before saving schedules
- Enhanced `timeBlocksToWeekdayData()` to sort and renumber slots
- Time input fields now have dynamic min/max constraints based on adjacent blocks
- Added override for `test-exclude` to use v7.0.1 (fixes deprecated dependencies)

## [0.1.0] - 2025-11-13

### Added

- Initial release
- Visual week schedule display with color-coded temperature blocks
- Interactive schedule editor with time and temperature controls
- Profile switching support
- Temperature visualization with color coding
- Responsive design for desktop and mobile
- Unit tests with Jest
- CI/CD pipeline with GitHub Actions
- HACS support
- Comprehensive documentation

### Features

- Display weekly schedule for Homematic thermostats
- Edit schedule by clicking on any day
- Add/remove time blocks
- Adjust temperatures and time ranges
- Switch between different schedule profiles
- Color-coded temperature visualization
- Integration with HomematicIP Local

### Technical

- Built with Lit web components
- TypeScript for type safety
- Rollup for bundling
- ESLint for code quality
- Jest for testing
- GitHub Actions for CI/CD

[Unreleased]: https://github.com/YOUR_USERNAME/homematicip_local_climate_schedule_card/compare/0.4.1...HEAD
[0.4.1]: https://github.com/YOUR_USERNAME/homematicip_local_climate_schedule_card/compare/0.4.0...0.4.1
[0.4.0]: https://github.com/YOUR_USERNAME/homematicip_local_climate_schedule_card/compare/0.3.2...0.4.0
[0.3.2]: https://github.com/YOUR_USERNAME/homematicip_local_climate_schedule_card/compare/0.3.1...0.3.2
[0.3.1]: https://github.com/YOUR_USERNAME/homematicip_local_climate_schedule_card/compare/0.3.0...0.3.1
[0.3.0]: https://github.com/YOUR_USERNAME/homematicip_local_climate_schedule_card/compare/0.2.1...0.3.0
[0.2.1]: https://github.com/YOUR_USERNAME/homematicip_local_climate_schedule_card/compare/0.2.0...0.2.1
[0.2.0]: https://github.com/YOUR_USERNAME/homematicip_local_climate_schedule_card/compare/0.1.0...0.2.0
[0.1.0]: https://github.com/YOUR_USERNAME/homematicip_local_climate_schedule_card/releases/tag/0.1.0
