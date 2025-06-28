# Auto Theme Switcher

一个强大的 VSCode 插件，支持自动切换主题，让你的编辑器始终保持最佳的视觉体验。

**中文** | [English](README.en.md)

## 功能特性

### 🎨 多种切换模式

- **系统主题跟随**: 自动检测系统主题变化并同步切换 VSCode 主题
- **定时切换**: 根据设定的时间自动在浅色和深色主题间切换
- **一键切换**: 手动快速切换主题

### ⚙️ 灵活配置

- 自定义浅色和深色主题
- 设置定时切换的时间点
- 启用/禁用各种自动切换功能

### 🔧 易于使用

- 简洁的配置界面
- 实时状态反馈
- 智能主题检测
- **专用侧边栏**: 直观的状态监控和快速操作面板

## 使用方法

### 快速开始

1. 安装插件后，按 `Ctrl+Shift+P` 打开命令面板
2. 输入 "Auto Theme" 查看所有可用命令
3. 选择 "Auto Theme: 打开主题设置" 进行配置

### 侧边栏功能

插件提供了专用的侧边栏面板，让您可以：

- **实时监控**: 查看当前主题状态、自动切换状态、下次切换时间等
- **快速操作**: 通过按钮快速切换主题、启用/禁用功能
- **状态反馈**: 所有状态变化都会实时反映在侧边栏中

在 VS Code 活动栏中点击 "Auto Theme Switcher" 图标即可打开侧边栏。

### 可用命令

- `Auto Theme: 一键切换主题` - 在浅色和深色主题间快速切换
- `Auto Theme: 打开主题设置` - 打开插件配置页面
- `Auto Theme: 启用自动切换` - 启用自动主题切换功能
- `Auto Theme: 禁用自动切换` - 禁用自动主题切换功能
- `Auto Theme: 切换到浅色主题` - 强制切换到配置的浅色主题
- `Auto Theme: 切换到深色主题` - 强制切换到配置的深色主题
- `Auto Theme: 刷新侧边栏` - 手动刷新侧边栏显示

## 配置选项

### 基本设置

| 配置项                   | 类型    | 默认值           | 说明             |
| ------------------------ | ------- | ---------------- | ---------------- |
| `autoTheme.enabled`      | boolean | false            | 启用自动主题切换 |
| `autoTheme.followSystem` | boolean | true             | 跟随系统主题     |
| `autoTheme.lightTheme`   | string  | "Default Light+" | 浅色主题名称     |
| `autoTheme.darkTheme`    | string  | "Default Dark+"  | 深色主题名称     |

### 定时切换设置

| 配置项                      | 类型    | 默认值  | 说明                     |
| --------------------------- | ------- | ------- | ------------------------ |
| `autoTheme.scheduledSwitch` | boolean | false   | 启用定时切换             |
| `autoTheme.lightStartTime`  | string  | "06:00" | 浅色主题开始时间 (HH:MM) |
| `autoTheme.darkStartTime`   | string  | "18:00" | 深色主题开始时间 (HH:MM) |

### 配置示例

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

## 使用场景

### 场景 1: 跟随系统主题

适合希望 VSCode 主题与系统保持一致的用户。

1. 启用 `autoTheme.enabled`
2. 启用 `autoTheme.followSystem`
3. 设置你喜欢的浅色和深色主题

### 场景 2: 定时切换

适合有固定作息时间，希望在特定时间自动切换主题的用户。

1. 启用 `autoTheme.enabled`
2. 禁用 `autoTheme.followSystem`
3. 启用 `autoTheme.scheduledSwitch`
4. 设置切换时间点

### 场景 3: 手动控制

适合希望完全手动控制主题切换的用户。

1. 禁用 `autoTheme.enabled`
2. 使用 "一键切换主题" 命令手动切换

## 支持的主题

插件支持所有已安装的 VSCode 主题，包括：

- 内置主题（Default Light+, Default Dark+等）
- 第三方主题（GitHub Theme, One Dark Pro 等）
- 自定义主题

## 故障排除

### 系统主题检测不工作

1. 确保你使用的是 Windows 系统
2. 检查 VSCode 是否有足够的权限访问系统设置
3. 尝试重启 VSCode

### 定时切换不准确

1. 检查系统时间是否正确
2. 确认时间格式为 "HH:MM"（24 小时制）
3. 重新启用定时切换功能

### 主题切换失败

1. 确认主题名称拼写正确
2. 检查主题是否已安装
3. 查看 VSCode 输出面板的错误信息

---

**享受你的编码时光！** 🎉
