# HomematicIP Local Climate Scheduler Card

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/custom-components/hacs)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A custom Lovelace card for Home Assistant to display and edit Homematic thermostat schedules with the HomematicIP Local integration.

![Card Preview](https://via.placeholder.com/800x400?text=Card+Preview)

## Features

- 📅 **Visual Week Schedule Display**: See your entire week at a glance with color-coded temperature blocks
- ✏️ **Interactive Editor**: Click any day to edit schedule with intuitive time and temperature controls
- 🎨 **Temperature Visualization**: Color-coded blocks (blue for cold, red for hot)
- 🔄 **Profile Switching**: Easy dropdown to switch between different schedule profiles
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices
- 🌍 **Integration Ready**: Seamlessly works with HomematicIP Local integration

## Installation

### HACS (Recommended)

1. Make sure [HACS](https://hacs.xyz/) is installed
2. In HACS, go to "Frontend"
3. Click the three-dot menu and select "Custom repositories"
4. Add this repository URL: `https://github.com/YOUR_USERNAME/homematicip_local_climate_scheduler_card`
5. Select category "Lovelace"
6. Click "Install"
7. Restart Home Assistant

### Manual Installation

1. Download the `homematicip-local-climate-scheduler-card.js` file from the latest release
2. Copy it to your `config/www` folder
3. Add the resource to your Lovelace dashboard:
   - Go to Settings → Dashboards → Resources
   - Click "Add Resource"
   - URL: `/local/homematicip-local-climate-scheduler-card.js`
   - Resource type: JavaScript Module

## Configuration

### Basic Configuration

```yaml
type: custom:homematic-schedule-card
entity: climate.your_thermostat
```

### Full Configuration

```yaml
type: custom:homematic-schedule-card
entity: climate.living_room_thermostat
name: Living Room Schedule
show_profile_selector: true
editable: true
show_temperature: true
temperature_unit: "°C"
hour_format: "24"
```

### Configuration Options

| Option                  | Type    | Default        | Description                                |
| ----------------------- | ------- | -------------- | ------------------------------------------ |
| `entity`                | string  | **Required**   | Entity ID of your Homematic climate device |
| `name`                  | string  | Entity name    | Custom name for the card                   |
| `profile`               | string  | Active profile | Force display of a specific profile        |
| `show_profile_selector` | boolean | `true`         | Show/hide the profile selector dropdown    |
| `editable`              | boolean | `true`         | Enable/disable schedule editing            |
| `show_temperature`      | boolean | `true`         | Show/hide temperature values on blocks     |
| `temperature_unit`      | string  | `°C`           | Temperature unit to display                |
| `hour_format`           | string  | `24`           | Time format: `12` or `24` hour             |

## Usage

### Viewing Schedules

The card displays your week schedule with color-coded temperature blocks:

- 🔵 **Blue** (< 12°C): Very cold
- 💙 **Light Blue** (12-16°C): Cool
- 💚 **Green** (16-18°C): Mild
- 🟠 **Orange** (18-20°C): Warm
- 🟠 **Dark Orange** (20-22°C): Warmer
- 🔴 **Red** (≥ 22°C): Hot

Hover over any block to see the exact time range and temperature.

### Editing Schedules

1. Click on any day in the week view
2. The editor opens showing all time slots for that day
3. Modify end times and temperatures as needed
4. Add new time blocks with the "+ Add Time Block" button
5. Remove unwanted blocks with the trash icon
6. Click "Save" to apply changes to your thermostat

### Profile Switching

If your thermostat supports multiple profiles (P1, P2, P3, etc.), use the dropdown in the card header to switch between them.

## Requirements

- Home Assistant 2023.1 or newer
- [HomematicIP Local](https://github.com/sukramj/homematicip_local) integration installed and configured
- HomematicIP thermostat device with schedule support (e.g., HmIP-eTRV, HmIP-BWTH)

## Compatibility

This card is specifically designed for the **HomematicIP Local** integration and requires:

- Schedule entities exposed by the integration
- Service calls: `homematicip_local.set_schedule_profile_weekday`
- Service calls: `homematicip_local.set_schedule_active_profile`

## Development

### Setup

```bash
npm install
```

### Build

```bash
npm run build
```

### Watch Mode

```bash
npm run watch
```

### Testing

```bash
npm test
npm run test:coverage
```

### Linting

```bash
npm run lint
npm run lint:fix
```

### Pre-commit Hooks

This project uses Husky for Git hooks. When you commit, the following checks run automatically:

1. **Lint-staged**: ESLint + Prettier on staged files
2. **Type Check**: TypeScript validation
3. **Tests**: All unit tests
4. **Build**: Production build

See [PRE_COMMIT_HOOKS.md](PRE_COMMIT_HOOKS.md) for detailed documentation.

To bypass hooks (emergency only):

```bash
git commit --no-verify -m "emergency commit"
```

## Troubleshooting

### Card not appearing

1. Clear your browser cache (Ctrl+F5)
2. Check that the resource is properly added to Lovelace
3. Verify the file is accessible at `/local/homematicip-local-climate-scheduler-card.js`

### Entity not found

1. Make sure your climate entity ID is correct
2. Verify the entity has schedule attributes from HomematicIP Local integration
3. Check Home Assistant logs for errors

### Changes not saving

1. Check Home Assistant logs for service call errors
2. Ensure your CCU/thermostat is reachable
3. Verify you have proper permissions in the integration

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Lit](https://lit.dev/)
- Designed for [Home Assistant](https://www.home-assistant.io/)
- Compatible with [HomematicIP Local](https://github.com/sukramj/homematicip_local) integration

## Support

If you find this card useful, please consider:

- Giving it a star on GitHub
- Reporting issues or suggesting features
- Contributing to the code

For issues and questions, please use the [GitHub Issues](https://github.com/YOUR_USERNAME/homematicip_local_climate_scheduler_card/issues) page.
