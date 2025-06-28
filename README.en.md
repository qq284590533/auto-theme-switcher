# Auto Theme Switcher

A powerful VSCode extension that supports automatic theme switching, keeping your editor in optimal visual experience at all times.

[中文](README.md) | **English**

## Features

### 🎨 Multiple Switching Modes

- **System Theme Following**: Automatically detects system theme changes and synchronizes VSCode theme switching
- **Scheduled Switching**: Automatically switches between light and dark themes based on set times
- **One-Click Toggle**: Manually switch themes quickly

### ⚙️ Flexible Configuration

- Customize light and dark themes
- Set scheduled switching time points
- Enable/disable various automatic switching features

### 🔧 Easy to Use

- Simple configuration interface
- Real-time status feedback
- Intelligent theme detection
- **Dedicated Sidebar**: Intuitive status monitoring and quick operation panel

## Usage

### Quick Start

1. After installing the extension, press `Ctrl+Shift+P` to open the command palette
2. Type "Auto Theme" to view all available commands
3. Select "Auto Theme: Open Theme Settings" to configure

### Sidebar Features

The extension provides a dedicated sidebar panel that allows you to:

- **Real-time Monitoring**: View current theme status, auto-switch status, next switch time, etc.
- **Quick Operations**: Quickly switch themes and enable/disable features through buttons
- **Status Feedback**: All status changes are reflected in the sidebar in real-time

Click the "Auto Theme Switcher" icon in the VS Code activity bar to open the sidebar.

### Available Commands

- `Auto Theme: Toggle Theme` - Quickly switch between light and dark themes
- `Auto Theme: Open Theme Settings` - Open extension configuration page
- `Auto Theme: Enable Auto Switch` - Enable automatic theme switching
- `Auto Theme: Disable Auto Switch` - Disable automatic theme switching
- `Auto Theme: Switch to Light Theme` - Force switch to configured light theme
- `Auto Theme: Switch to Dark Theme` - Force switch to configured dark theme
- `Auto Theme: Refresh Sidebar` - Manually refresh sidebar display

## Configuration Options

### Basic Settings

| Configuration            | Type    | Default          | Description                |
| ------------------------ | ------- | ---------------- | -------------------------- |
| `autoTheme.enabled`      | boolean | false            | Enable automatic theme switching |
| `autoTheme.followSystem` | boolean | true             | Follow system theme        |
| `autoTheme.lightTheme`   | string  | "Default Light+" | Light theme name           |
| `autoTheme.darkTheme`    | string  | "Default Dark+"  | Dark theme name            |

### Scheduled Switching Settings

| Configuration               | Type    | Default | Description                      |
| --------------------------- | ------- | ------- | -------------------------------- |
| `autoTheme.scheduledSwitch` | boolean | false   | Enable scheduled switching       |
| `autoTheme.lightStartTime`  | string  | "06:00" | Light theme start time (HH:MM)   |
| `autoTheme.darkStartTime`   | string  | "18:00" | Dark theme start time (HH:MM)    |

### Configuration Example

```json
{
  "autoTheme.enabled": true,
  "autoTheme.followSystem": false,
  "autoTheme.scheduledSwitch": true,
  "autoTheme.lightTheme": "GitHub Light",
  "autoTheme.darkTheme": "GitHub Dark",
  "autoTheme.lightStartTime": "07:00",
  "autoTheme.darkStartTime": "19:00"
}
```

## Use Cases

### Scenario 1: Follow System Theme

Suitable for users who want VSCode theme to stay consistent with the system.

1. Enable `autoTheme.enabled`
2. Enable `autoTheme.followSystem`
3. Set your preferred light and dark themes

### Scenario 2: Scheduled Switching

Suitable for users with fixed schedules who want themes to switch automatically at specific times.

1. Enable `autoTheme.enabled`
2. Disable `autoTheme.followSystem`
3. Enable `autoTheme.scheduledSwitch`
4. Set switching time points

### Scenario 3: Manual Control

Suitable for users who want complete manual control over theme switching.

1. Disable `autoTheme.enabled`
2. Use "Toggle Theme" command to switch manually

## Supported Themes

The extension supports all installed VSCode themes, including:

- Built-in themes (Default Light+, Default Dark+, etc.)
- Third-party themes (GitHub Theme, One Dark Pro, etc.)
- Custom themes

## Troubleshooting

### System Theme Detection Not Working

1. Ensure you are using Windows system
2. Check if VSCode has sufficient permissions to access system settings
3. Try restarting VSCode

### Scheduled Switching Inaccurate

1. Check if system time is correct
2. Confirm time format is "HH:MM" (24-hour format)
3. Re-enable scheduled switching feature

### Theme Switching Failed

1. Confirm theme name spelling is correct
2. Check if theme is installed
3. View error information in VSCode output panel

---

**Enjoy your coding time!** 🎉