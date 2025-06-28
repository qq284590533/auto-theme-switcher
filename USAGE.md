# Auto Theme Switcher 使用指南

## 快速开始

### 1. 安装和启用插件

1. 在VSCode中按 `F5` 启动扩展开发主机
2. 在新打开的VSCode窗口中，插件将自动加载
3. 按 `Ctrl+Shift+P` 打开命令面板
4. 输入 "Auto Theme" 查看可用命令
5. 在活动栏中点击 "Auto Theme Switcher" 图标打开侧边栏

### 2. 基本配置

#### 方法一：通过命令面板
1. 按 `Ctrl+Shift+P`
2. 输入 "Auto Theme: 打开主题设置"
3. 在设置页面中配置插件选项

#### 方法二：直接编辑settings.json
```json
{
    "autoTheme.enabled": true,
    "autoTheme.followSystem": true,
    "autoTheme.lightTheme": "Default Light+",
    "autoTheme.darkTheme": "Default Dark+"
}
```

#### 方法三：使用侧边栏
1. 在活动栏中点击 "Auto Theme Switcher" 图标
2. 在侧边栏中查看当前状态
3. 使用控制面板中的按钮进行快速操作
4. 点击 "打开设置" 按钮直接跳转到配置页面

## 使用场景示例

### 场景1：跟随系统主题

**适用人群**：希望VSCode主题与系统保持同步的用户

**配置步骤**：
1. 启用插件：`"autoTheme.enabled": true`
2. 启用系统跟随：`"autoTheme.followSystem": true`
3. 设置主题：
   ```json
   {
       "autoTheme.lightTheme": "GitHub Light",
       "autoTheme.darkTheme": "GitHub Dark"
   }
   ```

**效果**：当系统切换到深色模式时，VSCode自动切换到深色主题；切换到浅色模式时，自动切换到浅色主题。

### 场景2：定时自动切换

**适用人群**：有固定作息时间，希望在特定时间自动切换主题的用户

**配置步骤**：
1. 启用插件：`"autoTheme.enabled": true`
2. 禁用系统跟随：`"autoTheme.followSystem": false`
3. 启用定时切换：`"autoTheme.scheduledSwitch": true`
4. 设置切换时间：
   ```json
   {
       "autoTheme.lightStartTime": "07:00",
       "autoTheme.darkStartTime": "19:00"
   }
   ```

**效果**：每天早上7点自动切换到浅色主题，晚上7点自动切换到深色主题。

### 场景3：手动控制

**适用人群**：希望完全手动控制主题切换的用户

**配置步骤**：
1. 禁用自动功能：`"autoTheme.enabled": false`
2. 设置喜欢的主题：
   ```json
   {
       "autoTheme.lightTheme": "One Light",
       "autoTheme.darkTheme": "One Dark Pro"
   }
   ```

**使用方法**：
- 按 `Ctrl+Shift+P`
- 输入 "Auto Theme: 一键切换主题"
- 或者设置快捷键绑定

## 高级配置

### 自定义快捷键

在 `keybindings.json` 中添加：
```json
[
    {
        "key": "ctrl+alt+t",
        "command": "autoTheme.toggleTheme"
    },
    {
        "key": "ctrl+alt+e",
        "command": "autoTheme.enableAutoSwitch"
    },
    {
        "key": "ctrl+alt+d",
        "command": "autoTheme.disableAutoSwitch"
    }
]
```

### 工作区特定配置

在项目的 `.vscode/settings.json` 中：
```json
{
    "autoTheme.lightTheme": "Quiet Light",
    "autoTheme.darkTheme": "Monokai"
}
```

### 多时间段配置示例

```json
{
    "autoTheme.enabled": true,
    "autoTheme.followSystem": false,
    "autoTheme.scheduledSwitch": true,
    "autoTheme.lightStartTime": "06:30",
    "autoTheme.darkStartTime": "20:30",
    "autoTheme.lightTheme": "Solarized Light",
    "autoTheme.darkTheme": "Solarized Dark"
}
```

## 故障排除

### 问题1：系统主题检测不工作

**可能原因**：
- 系统权限不足
- Windows版本不支持
- VSCode权限限制

**解决方案**：
1. 以管理员身份运行VSCode
2. 检查Windows版本（需要Windows 10 1903+）
3. 重启VSCode

### 问题2：定时切换不准确

**可能原因**：
- 系统时间不正确
- 时间格式错误
- 计算机休眠

**解决方案**：
1. 检查系统时间
2. 确保时间格式为 "HH:MM"（24小时制）
3. 重新启用定时功能

### 问题3：主题切换失败

**可能原因**：
- 主题名称错误
- 主题未安装
- VSCode配置冲突

**解决方案**：
1. 检查主题名称拼写
2. 确认主题已安装
3. 查看开发者控制台错误信息

## 开发和调试

### 启动开发模式

1. 在项目根目录按 `F5`
2. 选择 "运行扩展"
3. 新窗口将加载开发版本的插件

### 查看日志

1. 按 `Ctrl+Shift+U` 打开输出面板
2. 选择 "Log (Extension Host)"
3. 查看插件运行日志

### 调试技巧

1. 在代码中添加 `console.log()` 语句
2. 使用VSCode调试器设置断点
3. 查看开发者工具控制台

## 常用命令总结

| 命令 | 功能 | 快捷键建议 |
|------|------|------------|
| `autoTheme.toggleTheme` | 一键切换主题 | `Ctrl+Alt+T` |
| `autoTheme.openSettings` | 打开设置 | - |
| `autoTheme.enableAutoSwitch` | 启用自动切换 | `Ctrl+Alt+E` |
| `autoTheme.disableAutoSwitch` | 禁用自动切换 | `Ctrl+Alt+D` |

## 推荐主题组合

### 经典组合
- 浅色：Default Light+
- 深色：Default Dark+

### GitHub风格
- 浅色：GitHub Light
- 深色：GitHub Dark

### Solarized风格
- 浅色：Solarized Light
- 深色：Solarized Dark

### One系列
- 浅色：One Light
- 深色：One Dark Pro

---

**提示**：配置更改后，插件会自动重新加载配置，无需重启VSCode。