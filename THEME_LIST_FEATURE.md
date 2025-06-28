W# 主题列表功能 (Theme List Feature)

## 功能概述

本功能允许用户在VS Code扩展的侧边栏中查看和选择所有已安装的主题，提供了一个直观的主题管理界面。

## 主要特性

### 1. 主题分类显示
- **全部主题**: 显示所有已安装的主题
- **浅色主题**: 仅显示浅色主题 (vs, hc-light)
- **深色主题**: 仅显示深色主题 (vs-dark, hc-black)

### 2. 主题信息展示
- 主题名称
- 主题类型标识 (浅色/深色/未知)
- 当前激活主题的高亮显示
- 每个分类的主题数量统计

### 3. 交互功能
- 点击主题名称即可切换到该主题
- 选项卡切换查看不同类型的主题
- 响应式界面设计

## 技术实现

### 核心API使用

```typescript
// 获取所有已安装的主题
getInstalledThemes(): ThemeInfo[] {
    const themes: ThemeInfo[] = [];
    
    for (const ext of vscode.extensions.all) {
        const contributes = ext.packageJSON.contributes;
        if (contributes && contributes.themes) {
            for (const theme of contributes.themes) {
                themes.push({
                    label: theme.label || theme.id,
                    uiTheme: theme.uiTheme,
                    path: theme.path
                });
            }
        }
    }
    
    return themes;
}
```

### 主要修改文件

#### 1. `themeManager.ts`
- 新增 `getInstalledThemes()` 方法
- 新增 `getLightThemes()` 和 `getDarkThemes()` 方法
- 新增 `setThemeByLabel()` 方法用于按名称设置主题

#### 2. `sidebarProvider.ts`
- 在 `ThemeControlsProvider` 中添加主题列表卡片
- 实现主题分类和显示逻辑
- 添加主题选择的交互功能
- 新增相关CSS样式

#### 3. `i18n.ts`
- 添加主题列表相关的国际化文本
- 支持中英文界面

### 界面设计

```css
.theme-list-card {
    background: var(--vscode-editor-background);
    border: 1px solid var(--vscode-panel-border);
    border-radius: 6px;
    padding: 16px;
    margin-bottom: 16px;
}

.theme-tabs {
    display: flex;
    margin-bottom: 12px;
    border-bottom: 1px solid var(--vscode-panel-border);
}

.theme-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    cursor: pointer;
    border-radius: 4px;
}

.theme-item:hover {
    background: var(--vscode-list-hoverBackground);
}

.theme-item.current {
    background: var(--vscode-list-activeSelectionBackground);
    color: var(--vscode-list-activeSelectionForeground);
}
```

## 用户体验

### 1. 直观的主题浏览
- 用户可以快速浏览所有已安装的主题
- 清晰的分类让用户能够快速找到想要的主题类型
- 当前主题的高亮显示帮助用户了解当前状态

### 2. 便捷的主题切换
- 一键切换到任意已安装的主题
- 无需记住复杂的主题名称
- 实时预览主题效果

### 3. 国际化支持
- 完整的中英文界面支持
- 本地化的主题类型描述

## 与现有功能的集成

### 1. 手动切换检测
- 通过主题列表切换主题时，会触发手动切换检测
- 自动禁用自动切换功能，避免冲突

### 2. 状态同步
- 主题切换后自动刷新侧边栏状态
- 与其他主题管理功能保持同步

## 测试建议

### 1. 功能测试
- 验证主题列表是否正确显示所有已安装主题
- 测试主题分类功能是否正常工作
- 确认主题切换功能正常

### 2. 界面测试
- 检查不同主题下的界面显示效果
- 验证响应式设计在不同窗口大小下的表现
- 测试国际化文本显示

### 3. 集成测试
- 验证与自动切换功能的集成
- 测试手动切换检测机制
- 确认状态同步正常

## 扩展可能性

### 1. 主题预览
- 可以考虑添加主题预览功能
- 鼠标悬停时显示主题截图

### 2. 主题收藏
- 允许用户收藏常用主题
- 提供快速访问收藏主题的功能

### 3. 主题搜索
- 添加主题搜索功能
- 支持按名称或类型筛选主题

### 4. 主题推荐
- 基于用户使用习惯推荐主题
- 显示热门或推荐主题

这个功能大大增强了用户对主题的管理和使用体验，使得主题切换变得更加直观和便捷。