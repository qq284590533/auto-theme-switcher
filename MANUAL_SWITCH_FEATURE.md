# 手动切换主题自动禁用功能

## 功能描述

当用户手动切换主题时，插件会自动禁用自动切换功能，避免用户的手动设置被自动功能覆盖。

## 实现原理

1. **回调机制**: 在 `ThemeManager` 中添加了回调函数机制，当检测到手动切换时触发回调
2. **参数标识**: 所有手动切换方法都添加了 `isManualSwitch` 参数来区分手动和自动切换
3. **自动禁用**: 当检测到手动切换时，自动禁用自动切换功能并停止相关服务

## 触发场景

以下操作会触发自动禁用功能：

- 使用命令 `Auto Theme: 一键切换主题`
- 使用命令 `Auto Theme: 切换到浅色主题`
- 使用命令 `Auto Theme: 切换到深色主题`
- 在侧边栏中点击主题切换按钮

## 用户体验

1. **智能检测**: 只有在自动切换功能启用时才会触发禁用
2. **友好提示**: 显示国际化的提示消息，告知用户功能已被禁用
3. **易于重启**: 用户可以通过命令面板或侧边栏重新启用自动切换

## 技术实现

### 主要修改文件

- `themeManager.ts`: 添加回调机制和手动切换标识
- `extension.ts`: 实现手动切换处理逻辑
- `i18n.ts`: 添加相关国际化文本

### 代码示例

```typescript
// 设置回调函数
themeManager.setOnManualSwitchCallback(() => {
  handleManualThemeSwitch();
});

// 手动切换处理
async function handleManualThemeSwitch() {
  if (configManager.isEnabled()) {
    await configManager.setEnabled(false);
    systemThemeDetector.stop();
    scheduleManager.stop();
    sidebarManager.refresh();
    vscode.window.showInformationMessage(
      i18nManager.getMessage("notification.autoSwitchDisabledByManual")
    );
  }
}
```

## 测试建议

1. 启用自动切换功能（跟随系统或定时切换）
2. 使用任意手动切换命令
3. 验证自动切换功能是否被禁用
4. 检查是否显示了正确的提示消息
5. 验证侧边栏状态是否正确更新
