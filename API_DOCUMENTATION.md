# Auto Theme Switcher - API 文档

本文档总结了 Auto Theme Switcher 项目中使用的所有 API 及其功能说明。

## VS Code Extension API

### 核心扩展 API

#### `vscode.ExtensionContext`
- **功能**: 扩展上下文对象，提供扩展的生命周期管理
- **使用位置**: `extension.ts`
- **主要用途**: 
  - 管理扩展订阅 (`context.subscriptions`)
  - 获取扩展 URI (`context.extensionUri`)
  - 扩展激活和停用时的资源管理

#### `vscode.workspace`
- **功能**: 工作区相关 API
- **使用的方法**:
  - `getConfiguration()`: 获取配置对象
  - `onDidChangeConfiguration()`: 监听配置变化事件
- **使用位置**: `extension.ts`, `themeManager.ts`, `configManager.ts`, `systemThemeDetector.ts`

#### `vscode.commands`
- **功能**: 命令系统 API
- **使用的方法**:
  - `registerCommand()`: 注册命令
  - `executeCommand()`: 执行命令
- **注册的命令**:
  - `autoTheme.toggleTheme`: 切换主题
  - `autoTheme.openSettings`: 打开设置
  - `autoTheme.enableAutoSwitch`: 启用自动切换
  - `autoTheme.disableAutoSwitch`: 禁用自动切换
  - `autoTheme.toggleFollowSystem`: 切换跟随系统模式
  - `autoTheme.toggleScheduledSwitch`: 切换定时切换模式
  - `autoTheme.switchToLight`: 切换到浅色主题
  - `autoTheme.switchToDark`: 切换到深色主题
  - `autoTheme.refreshSidebar`: 刷新侧边栏

#### `vscode.window`
- **功能**: 窗口和用户界面 API
- **使用的方法**:
  - `showInformationMessage()`: 显示信息消息
  - `showErrorMessage()`: 显示错误消息
  - `createTreeView()`: 创建树视图
  - `registerWebviewViewProvider()`: 注册 WebView 视图提供者

### 配置管理 API

#### `vscode.WorkspaceConfiguration`
- **功能**: 工作区配置管理
- **使用的方法**:
  - `get()`: 获取配置值
  - `update()`: 更新配置值
- **配置项**:
  - `autoTheme.enabled`: 是否启用自动切换
  - `autoTheme.followSystem`: 是否跟随系统主题
  - `autoTheme.scheduledSwitch`: 是否启用定时切换
  - `autoTheme.lightTheme`: 浅色主题名称
  - `autoTheme.darkTheme`: 深色主题名称
  - `autoTheme.lightStartTime`: 浅色主题开始时间
  - `autoTheme.darkStartTime`: 深色主题开始时间
  - `workbench.colorTheme`: VS Code 主题设置

#### `vscode.ConfigurationTarget`
- **功能**: 配置目标枚举
- **使用的值**: `Global` - 全局配置

### 侧边栏和视图 API

#### `vscode.TreeDataProvider<T>`
- **功能**: 树视图数据提供者接口
- **实现类**: `ThemeStatusProvider`
- **主要方法**:
  - `getTreeItem()`: 获取树项
  - `getChildren()`: 获取子项
  - `onDidChangeTreeData`: 数据变化事件

#### `vscode.TreeItem`
- **功能**: 树视图项
- **属性**:
  - `label`: 标签
  - `description`: 描述
  - `tooltip`: 工具提示
  - `iconPath`: 图标路径
  - `collapsibleState`: 折叠状态
  - `command`: 关联命令

#### `vscode.ThemeIcon`
- **功能**: 主题图标
- **使用的图标**:
  - `symbol-color`: 颜色符号
  - `check`: 勾选
  - `x`: 叉号
  - `eye`: 眼睛
  - `clock`: 时钟
  - `calendar`: 日历
  - `watch`: 手表
  - `sun`: 太阳
  - `moon`: 月亮
  - `play`: 播放
  - `stop`: 停止
  - `refresh`: 刷新
  - `settings-gear`: 设置齿轮

#### `vscode.WebviewViewProvider`
- **功能**: WebView 视图提供者接口
- **实现类**: `ThemeControlsProvider`
- **主要方法**: `resolveWebviewView()`: 解析 WebView 视图

#### `vscode.WebviewView`
- **功能**: WebView 视图
- **属性**: `webview`: WebView 对象

#### `vscode.Webview`
- **功能**: WebView 组件
- **属性**:
  - `html`: HTML 内容
  - `onDidReceiveMessage`: 消息接收事件

### 事件系统 API

#### `vscode.EventEmitter<T>`
- **功能**: 事件发射器
- **使用位置**: `sidebarProvider.ts`
- **用途**: 树视图数据变化通知

#### `vscode.Event<T>`
- **功能**: 事件接口
- **使用位置**: `sidebarProvider.ts`
- **用途**: 树视图数据变化事件

### 扩展系统 API

#### `vscode.extensions`
- **功能**: 扩展管理 API
- **使用的属性**: `all` - 所有已安装的扩展
- **用途**: 获取可用主题列表

#### `vscode.env`
- **功能**: 环境信息 API
- **使用的属性**: `language` - 当前语言设置
- **用途**: 国际化语言检测

## Node.js API

### 定时器 API

#### `setInterval()`
- **功能**: 设置重复执行的定时器
- **使用位置**: 
  - `systemThemeDetector.ts`: 系统主题检测
  - `scheduleManager.ts`: 定时切换检查
- **参数**: 回调函数, 时间间隔(毫秒)

#### `clearInterval()`
- **功能**: 清除重复执行的定时器
- **使用位置**: 
  - `systemThemeDetector.ts`: 停止系统主题检测
  - `scheduleManager.ts`: 停止定时切换检查

#### `setTimeout()`
- **功能**: 设置一次性执行的定时器
- **使用位置**: `scheduleManager.ts`
- **用途**: 安排下次主题切换

#### `clearTimeout()`
- **功能**: 清除一次性执行的定时器
- **使用位置**: `scheduleManager.ts`
- **用途**: 取消已安排的主题切换

### 控制台 API

#### `console.log()`
- **功能**: 输出日志信息
- **使用位置**: 所有模块
- **用途**: 调试和状态记录

#### `console.error()`
- **功能**: 输出错误信息
- **使用位置**: 所有模块
- **用途**: 错误记录和调试

### 子进程 API

#### `require('child_process')`
- **功能**: 子进程模块
- **使用位置**: `systemThemeDetector.ts`
- **使用的方法**: `exec()` - 执行系统命令
- **用途**: 在 Windows 系统上检测系统主题

## 自定义 API 架构

### 管理器类

#### `ThemeManager`
- **功能**: 主题管理和切换
- **主要方法**:
  - `toggleTheme()`: 切换主题
  - `switchToLight()`: 切换到浅色主题
  - `switchToDark()`: 切换到深色主题
  - `getCurrentThemeName()`: 获取当前主题名称
  - `isLightTheme()`: 判断是否为浅色主题
  - `isDarkTheme()`: 判断是否为深色主题
  - `setOnManualSwitchCallback()`: 设置手动切换回调

#### `ConfigManager`
- **功能**: 配置管理
- **主要方法**:
  - `isEnabled()`: 检查是否启用自动切换
  - `setEnabled()`: 设置是否启用自动切换
  - `shouldFollowSystem()`: 检查是否跟随系统主题
  - `setFollowSystem()`: 设置是否跟随系统主题
  - `isScheduledSwitchEnabled()`: 检查是否启用定时切换
  - `setScheduledSwitch()`: 设置是否启用定时切换
  - `getLightTheme()`: 获取浅色主题名称
  - `getDarkTheme()`: 获取深色主题名称
  - `getLightStartTime()`: 获取浅色主题开始时间
  - `getDarkStartTime()`: 获取深色主题开始时间

#### `SystemThemeDetector`
- **功能**: 系统主题检测
- **主要方法**:
  - `start()`: 启动系统主题检测
  - `stop()`: 停止系统主题检测
  - `detectSystemTheme()`: 检测系统主题
  - `detectWindowsSystemTheme()`: 检测 Windows 系统主题

#### `ScheduleManager`
- **功能**: 定时切换管理
- **主要方法**:
  - `start()`: 启动定时切换
  - `stop()`: 停止定时切换
  - `checkAndApplyCurrentTheme()`: 检查并应用当前主题
  - `scheduleNextSwitch()`: 安排下次切换

#### `SidebarManager`
- **功能**: 侧边栏管理
- **主要方法**:
  - `register()`: 注册侧边栏
  - `refresh()`: 刷新侧边栏

#### `I18nManager`
- **功能**: 国际化管理
- **主要方法**:
  - `getInstance()`: 获取单例实例
  - `getMessage()`: 获取国际化消息
  - `getSidebarStatus()`: 获取侧边栏状态消息
  - `getSidebarControls()`: 获取侧边栏控制消息

### 数据接口

#### `SidebarItem`
- **功能**: 侧边栏项数据结构
- **属性**:
  - `label`: 标签
  - `description`: 描述
  - `tooltip`: 工具提示
  - `contextValue`: 上下文值
  - `iconPath`: 图标路径
  - `collapsibleState`: 折叠状态
  - `command`: 关联命令

## WebView 消息 API

### 前端到后端消息

- `toggleTheme`: 切换主题
- `enableAutoSwitch`: 启用自动切换
- `disableAutoSwitch`: 禁用自动切换
- `toggleFollowSystem`: 切换跟随系统模式
- `toggleScheduledSwitch`: 切换定时切换模式
- `switchToLight`: 切换到浅色主题
- `switchToDark`: 切换到深色主题
- `updateLightTime`: 更新浅色主题时间
- `updateDarkTime`: 更新深色主题时间
- `setTheme`: 设置主题
- `setLightTheme`: 设置浅色主题
- `setDarkTheme`: 设置深色主题
- `getThemeList`: 获取主题列表
- `refreshThemeList`: 刷新主题列表

## 错误处理

### 错误类型

- 主题切换失败
- 系统主题检测失败
- 定时切换执行失败
- 配置更新失败
- PowerShell 命令执行失败

### 错误处理机制

- `try-catch` 块捕获异常
- `console.error()` 记录错误日志
- `vscode.window.showErrorMessage()` 显示用户友好的错误消息
- 国际化错误消息支持

## 性能优化

### 定时器管理

- 系统主题检测: 每 5 秒检查一次
- 定时切换检查: 每分钟检查一次
- 及时清理定时器避免内存泄漏

### 事件处理

- 配置变化监听
- 手动主题切换检测
- 侧边栏数据变化通知

### 资源管理

- 扩展停用时清理所有定时器
- 使用 `context.subscriptions` 管理订阅
- WebView 消息处理优化

## 总结

本项目主要使用了以下 API 类别:

1. **VS Code Extension API**: 扩展开发的核心 API
2. **Node.js API**: 定时器、控制台、子进程等基础 API
3. **自定义管理器 API**: 项目特定的业务逻辑封装
4. **WebView 通信 API**: 前后端消息传递

通过合理的 API 使用和架构设计，实现了一个功能完整、性能良好的 VS Code 主题自动切换扩展。