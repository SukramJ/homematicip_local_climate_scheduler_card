# CLAUDE.md - AI Development Guide

This document provides comprehensive context for AI assistants working with the HomematicIP Local Climate Scheduler Card codebase.

## Project Overview

**Name**: HomematicIP Local Climate Scheduler Card
**Type**: Custom Lovelace Card for Home Assistant
**Version**: 0.3.2
**License**: MIT
**Primary Language**: TypeScript
**Framework**: Lit (Web Components)

### Purpose

A custom Lovelace card that displays and allows editing of weekly thermostat schedules for HomematicIP devices using the HomematicIP Local integration in Home Assistant.

## Project Structure

```
homematicip_local_climate_scheduler_card/
├── src/                                    # Source code
│   ├── homematicip-local-climate-scheduler-card.ts  # Main card component
│   ├── types.ts                            # TypeScript type definitions
│   ├── utils.ts                            # Utility functions
│   ├── localization.ts                     # i18n/translation support
│   └── *.test.ts                           # Jest unit tests
├── dist/                                   # Build output (generated)
├── jest/                                   # Jest configuration
├── package.json                            # Dependencies and scripts
├── tsconfig.json                           # TypeScript configuration
├── rollup.config.mjs                       # Build configuration
├── jest.config.js                          # Test configuration
├── eslint.config.mjs                       # Linting configuration
└── README.md                               # User documentation
```

## Core Technologies

- **Lit 3.0**: Web Components framework for building the UI
- **TypeScript 5.3**: Type-safe JavaScript
- **Rollup**: Module bundler
- **Jest**: Testing framework with ts-jest
- **ESLint**: Code linting with TypeScript support
- **Prettier**: Code formatting
- **Husky**: Git hooks management
- **lint-staged**: Pre-commit hook automation

## Key Components

### Main Card Component (`src/homematicip-local-climate-scheduler-card.ts`)

The primary Lit custom element that:

- Extends `LitElement`
- Implements Home Assistant's custom card interface
- Manages state for schedule viewing and editing
- Renders the week view, profile selector, and edit dialogs
- Handles Home Assistant service calls

### Type Definitions (`src/types.ts`)

Core TypeScript interfaces including:

- Home Assistant specific types (`HomeAssistant`, `LovelaceCardConfig`)
- Schedule data structures (`Schedule`, `TimeBlock`, `DaySchedule`)
- Card configuration options
- Climate entity attributes

### Utilities (`src/utils.ts`)

Helper functions for:

- Temperature color mapping
- Time formatting (12h/24h)
- Schedule data manipulation
- Validation logic

### Localization (`src/localization.ts`)

Translation system that:

- Follows Home Assistant language settings
- Provides German and English translations
- Includes day names, UI labels, and messages

## Development Workflow

### Initial Setup

```bash
npm install
```

### Build Commands

```bash
npm run build          # Production build
npm run watch          # Development mode with auto-rebuild
npm run serve          # Alias for watch
```

### Testing

```bash
npm test               # Run all tests
npm run test:watch     # Watch mode for TDD
npm run test:coverage  # Generate coverage report
```

### Code Quality

```bash
npm run lint           # Check for linting errors
npm run lint:fix       # Auto-fix linting issues
npm run type-check     # TypeScript validation
npm run format         # Format code with Prettier
npm run format:check   # Check formatting without changes
npm run validate       # Run all checks + build
```

### Pre-commit Hooks

Husky automatically runs on commit:

1. **lint-staged**: ESLint + Prettier on staged `.ts` files
2. **Jest tests**: Related tests for changed files
3. Full pipeline includes type-check, test, and build

To bypass (emergency only):

```bash
git commit --no-verify -m "message"
```

See `PRE_COMMIT_HOOKS.md` for detailed documentation.

## Integration with Home Assistant

### Required Integration

This card requires the **HomematicIP Local** integration:

- GitHub: https://github.com/sukramj/homematicip_local
- Provides climate entities with schedule attributes
- Exposes necessary service calls

### Service Calls Used

1. **`homematicip_local.set_schedule_profile_weekday`**
   - Updates schedule for a specific day
   - Parameters: `entity_id`, `profile`, `weekday`, `schedule_data`

2. **`homematicip_local.set_schedule_active_profile`**
   - Switches active profile (P1, P2, P3, etc.)
   - Parameters: `entity_id`, `profile`

### Entity Attributes Expected

Climate entities should expose:

- `schedule_profiles`: Available profile names
- `active_schedule_profile`: Currently active profile
- `schedule_data`: Week schedule with time blocks per day

## Card Configuration

### Minimal Configuration

```yaml
type: custom:homematicip-local-climate-scheduler-card
entity: climate.living_room
```

### Multi-Entity Configuration

```yaml
type: custom:homematicip-local-climate-scheduler-card
entities:
  - climate.living_room
  - climate.bedroom
  - climate.office
```

### All Options

| Option                  | Type     | Default        | Description                     |
| ----------------------- | -------- | -------------- | ------------------------------- |
| `entity`                | string   | —              | Single entity ID                |
| `entities`              | string[] | —              | Multiple entities with dropdown |
| `name`                  | string   | Entity name    | Custom card title               |
| `profile`               | string   | Active profile | Force specific profile          |
| `show_profile_selector` | boolean  | `true`         | Show profile dropdown           |
| `editable`              | boolean  | `true`         | Enable editing                  |
| `show_temperature`      | boolean  | `true`         | Show temps on blocks            |
| `temperature_unit`      | string   | `°C`           | Temperature unit                |
| `hour_format`           | string   | `24`           | `12` or `24` hour format        |
| `time_step_minutes`     | number   | `15`           | Time picker step size           |

## Common Development Tasks

### Adding a New Feature

1. Implement in `src/homematicip-local-climate-scheduler-card.ts`
2. Add types to `src/types.ts` if needed
3. Create tests in corresponding `.test.ts` file
4. Update `README.md` if user-facing
5. Run `npm run validate` before committing

### Modifying Schedule Logic

1. Check `src/utils.ts` for helper functions
2. Update `TimeBlock` or `DaySchedule` types if data structure changes
3. Ensure backward compatibility with existing schedules
4. Add unit tests for edge cases

### Changing Translations

1. Edit `src/localization.ts`
2. Add keys to both `de` and `en` objects
3. Use translations via `localize(this.hass, key)`
4. Test with different Home Assistant language settings

### Updating Styles

Styles are defined using Lit's `css` tagged template literals in the main component:

- Use CSS custom properties for theming
- Follow Home Assistant's design patterns
- Test in both light and dark themes

## Testing Guidelines

### Unit Test Structure

```typescript
describe('ComponentName', () => {
  it('should do something specific', () => {
    // Arrange
    const input = ...;

    // Act
    const result = functionToTest(input);

    // Assert
    expect(result).toBe(expected);
  });
});
```

### Coverage Goals

- Aim for >80% code coverage
- Focus on business logic and data transformations
- Mock Home Assistant dependencies where appropriate

### Running Specific Tests

```bash
npm test -- utils.test.ts              # Single file
npm test -- --testNamePattern="pattern"  # By name
```

## Build Process

### Rollup Configuration (`rollup.config.mjs`)

The build pipeline:

1. **TypeScript compilation**: `.ts` → `.js` with type checking
2. **Module resolution**: Bundles dependencies
3. **Terser minification**: Optimizes for production
4. **Output**: Single `dist/homematicip-local-climate-scheduler-card.js`

### Build Outputs

- `dist/homematicip-local-climate-scheduler-card.js`: Production bundle
- `dist/*.d.ts`: TypeScript declarations (if enabled)
- `dist/*.map`: Source maps

## HACS Integration

HACS (Home Assistant Community Store) compatibility:

- **Type**: Lovelace (frontend plugin)
- **Configuration**: `hacs.json`
- **Assets**: Icons and logos in repository root
- **Info**: `info.md` for HACS plugin page

## Troubleshooting Common Issues

### Build Errors

- **"Cannot find module"**: Run `npm install`
- **TypeScript errors**: Check `tsconfig.json` and type imports
- **Rollup errors**: Verify all imports are valid

### Test Failures

- **Import errors**: Ensure Jest is configured for TypeScript (ts-jest)
- **DOM not available**: Use `jest-environment-jsdom`
- **Timeout**: Increase timeout in test config

### Runtime Issues

- **Card not loading**: Check browser console for import errors
- **Entity not found**: Verify entity ID and integration status
- **Service call fails**: Check Home Assistant logs and service parameters

## Best Practices

### Code Style

- Use TypeScript strict mode
- Follow ESLint rules (configured in `eslint.config.mjs`)
- Use Prettier for consistent formatting
- Prefer `const` over `let`, avoid `var`
- Use meaningful variable names

### Component Development

- Keep components small and focused
- Use Lit reactive properties with `@property()` decorator
- Leverage Lit's lifecycle methods appropriately
- Handle errors gracefully with user feedback

### State Management

- Use Lit's reactive properties for internal state
- Store configuration in `_config` property
- Update Home Assistant state via service calls
- Avoid direct DOM manipulation

### Accessibility

- Use semantic HTML elements
- Provide appropriate ARIA labels
- Ensure keyboard navigation works
- Test with screen readers when possible

## Version Control

### Branch Strategy

- `main`: Stable releases
- Feature branches: `feature/description`
- Bug fixes: `fix/description`

### Commit Messages

Follow conventional commits:

```
type(scope): description

feat(schedule): add support for half-hour intervals
fix(editor): prevent duplicate time blocks
docs(readme): update installation instructions
```

### Release Process

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create git tag: `git tag -a v0.3.2 -m "Release 0.3.2"`
4. Push tag: `git push origin v0.3.2`
5. GitHub releases automatically built

## Useful Resources

### Documentation

- [Lit Documentation](https://lit.dev/)
- [Home Assistant Custom Cards](https://developers.home-assistant.io/docs/frontend/custom-ui/lovelace-custom-card/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Jest Documentation](https://jestjs.io/)

### Related Projects

- [HomematicIP Local Integration](https://github.com/sukramj/homematicip_local)
- [Custom Card Helpers](https://github.com/custom-cards/custom-card-helpers)
- [Lovelace UI](https://www.home-assistant.io/lovelace/)

## Getting Help

### Project Documentation

- `README.md`: User-facing documentation
- `CONTRIBUTING.md`: Contribution guidelines
- `QUICKSTART.md`: Quick start guide
- `TESTING.md`: Testing documentation
- `PRE_COMMIT_HOOKS.md`: Git hooks documentation

### When Stuck

1. Check existing tests for usage examples
2. Review Home Assistant developer docs
3. Search GitHub issues for similar problems
4. Test changes in a live Home Assistant instance

## Notes for AI Assistants

When working with this codebase:

1. **Always run tests** after making changes: `npm test`
2. **Type-check** before committing: `npm run type-check`
3. **Follow existing patterns** in the codebase for consistency
4. **Update tests** when modifying functionality
5. **Consider backward compatibility** when changing config options
6. **Document user-facing changes** in README.md
7. **Use the pre-commit hooks** to ensure quality
8. **Test with actual Home Assistant** when possible for integration testing

### Quick Commands Reference

```bash
# Development
npm run watch              # Auto-rebuild on changes

# Quality checks (before committing)
npm run validate           # Run all checks + build

# Testing specific features
npm test -- --watch        # TDD mode
npm test -- utils.test     # Test specific file

# Fix issues
npm run lint:fix           # Auto-fix linting
npm run format             # Auto-format code
```
