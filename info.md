# HomematicIP Local Climate Schedule Card

![HomematicIP Local Climate Schedule Card](logo.png)

A custom Lovelace card for Home Assistant to display and edit Homematic thermostat schedules.

## Features

- 📅 Visual week schedule display with color-coded temperature blocks
- ✏️ Interactive schedule editor with weekday tabs and time/temperature controls
- 🎨 Color-coded temperature visualization aligned with Home Assistant 2025.12.x
- 🔄 Profile switching support
- 📱 Responsive design for desktop and mobile
- 🌍 Compatible with HomematicIP Local integration v2.0.0+

## Installation via HACS

1. Open HACS in your Home Assistant instance
2. Go to "Frontend"
3. Click the three dots menu in the top right corner
4. Select "Custom repositories"
5. Add this repository URL and select "Lovelace" as category
6. Click "Install"
7. Restart Home Assistant

## Manual Installation

1. Download the `homematicip-local-climate-schedule-card.js` file
2. Copy it to your `config/www` folder
3. Add the following to your Lovelace resources:

```yaml
resources:
  - url: /local/homematicip-local-climate-schedule-card.js
    type: module
```

## Configuration

Add the card to your dashboard:

```yaml
type: custom:homematicip-local-climate-schedule-card
entity: climate.your_thermostat
name: Living Room Schedule
show_profile_selector: true
editable: true
show_temperature: true
temperature_unit: "°C"
```

### Options

| Name                    | Type    | Default        | Description                              |
| ----------------------- | ------- | -------------- | ---------------------------------------- |
| `entity`                | string  | **Required**   | The climate entity with schedule support |
| `name`                  | string  | Entity name    | Card title                               |
| `profile`               | string  | Active profile | Force a specific profile                 |
| `show_profile_selector` | boolean | `true`         | Show profile dropdown                    |
| `editable`              | boolean | `true`         | Allow schedule editing                   |
| `show_temperature`      | boolean | `true`         | Display temperature values               |
| `temperature_unit`      | string  | `°C`           | Temperature unit to display              |
| `hour_format`           | string  | `24`           | Time format (12 or 24)                   |

## Requirements

- Home Assistant 2023.1 or newer
- HomematicIP Local integration installed and configured
- HomematicIP thermostat with schedule support

## Usage

### Viewing Schedules

The card displays a week view with each day showing temperature blocks. Colors aligned with Home Assistant 2025.12.x climate state colors:

- 🔵 Blue (< 10°C): Cold (HA Cool Blue)
- 💙 Light Blue (10-14°C): Cool
- 🩵 Cyan (14-17°C): Mild Cool
- 💚 Green (17-19°C): Comfort Low
- 🟢 Light Green (19-21°C): Comfort
- 🟠 Light Orange (21-23°C): Warm
- 🟠 Orange (23-25°C): Warmer (HA Heat Orange)
- 🔴 Deep Orange (≥ 25°C): Hot

### Editing Schedules

1. Click on any day in the week view
2. Modify time slots and temperatures
3. Add or remove time blocks
4. Click "Save" to apply changes to your device

## Support

For issues and feature requests, please visit: [GitHub Issues](https://github.com/YOUR_USERNAME/homematicip_local_climate_schedule_card/issues)

## License

MIT License - see LICENSE file for details
