# Quick Start Guide

Quick guide to get started with the project.

## Prerequisites

- Node.js 18.x or 20.x
- npm (comes with Node.js)
- Git

## Installation

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/homematicip_local_climate_scheduler_card.git
cd homematicip_local_climate_scheduler_card

# Install dependencies
npm install
```

## Development

### Create First Build

```bash
npm run build
```

The generated file will be located at: `dist/homematicip-local-climate-scheduler-card.js`

### Development Mode (with Auto-Rebuild)

```bash
npm run watch
```

Changes to source files will automatically trigger a rebuild.

### Run Tests

```bash
# Run all tests once
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Check Code Quality

```bash
# Linting
npm run lint

# Linting with auto-fix
npm run lint:fix
```

## Testing in Home Assistant

1. **Create build**:

   ```bash
   npm run build
   ```

2. **Copy file**:

   ```bash
   cp dist/homematicip-local-climate-scheduler-card.js \
      /path/to/homeassistant/config/www/
   ```

3. **Add resource in Home Assistant**:
   - Settings → Dashboards → Resources
   - Click "Add Resource"
   - URL: `/local/homematicip-local-climate-scheduler-card.js`
   - Resource type: JavaScript Module

4. **Add card to dashboard**:

   ```yaml
   type: custom:homematic-schedule-card
   entity: climate.your_thermostat
   ```

5. **Clear browser cache**: Ctrl+F5 (Cmd+Shift+R on Mac)

## Common Development Workflows

### Developing a Feature

```bash
# Create feature branch
git checkout -b feature/my-new-feature

# Start development mode
npm run watch

# ... Make changes ...

# Run tests
npm test

# Check linting
npm run lint

# Commit
git add .
git commit -m "Add: My new feature"

# Push
git push origin feature/my-new-feature
```

### Fixing a Bug

```bash
# Create bugfix branch
git checkout -b fix/bugfix-description

# Write tests for bug (TDD)
# ... Write test in *.test.ts ...

# Test should fail
npm test

# Fix bug
# ... Make changes ...

# Test should now pass
npm test

# Commit
git add .
git commit -m "Fix: Bugfix description"
```

## Understanding Project Structure

```
src/
├── homematic-schedule-card.ts  # Main component
├── types.ts                    # Type definitions
├── utils.ts                    # Utility functions
└── *.test.ts                   # Unit tests

dist/                           # Build output
└── homematicip-local-climate-scheduler-card.js

.github/workflows/              # CI/CD
├── ci.yml                      # Tests & Build
├── release.yml                 # Release automation
└── validate.yml                # HACS validation
```

## Useful Commands

| Command                 | Description                      |
| ----------------------- | -------------------------------- |
| `npm install`           | Install dependencies             |
| `npm run build`         | Production build                 |
| `npm run watch`         | Development with auto-rebuild    |
| `npm test`              | Run tests                        |
| `npm run test:coverage` | Run tests with coverage report   |
| `npm run lint`          | Code linting                     |
| `npm run lint:fix`      | Automatically fix linting errors |

## Troubleshooting

### "Module not found" Error

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Build Fails

```bash
# Clear TypeScript compiler cache
rm -rf dist/
npm run build
```

### Tests Fail

```bash
# Clear Jest cache
npm test -- --clearCache
npm test
```

### ESLint Errors

```bash
# Try auto-fix
npm run lint:fix

# If that doesn't help, fix manually
npm run lint
```

## Additional Documentation

- **README.md**: Complete project documentation
- **CONTRIBUTING.md**: Contribution guidelines
- **PROJECT_STRUCTURE.md**: Detailed project structure
- **CHANGELOG.md**: Version history

## Getting Help

- GitHub Issues: For bugs and feature requests
- GitHub Discussions: For questions and discussions
- README.md: For detailed documentation

## Next Steps

1. ✅ Project setup completed
2. 📖 Read README.md for complete documentation
3. 🔨 Create first build: `npm run build`
4. 🧪 Run tests: `npm test`
5. 🚀 Test in Home Assistant
6. 💡 Develop features or fix bugs

Good luck! 🎉
