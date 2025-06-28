# 更新日志

## [1.0.0] - 2025-06-29

### 新增

- 📊 **专用侧边栏面板**

  - 实时显示主题状态信息
  - 快速操作控制面板
  - 自动刷新状态显示
  - 右键菜单快捷操作

- 🌐 **完整国际化支持**
  - 支持中文和英文界面
  - 自动检测系统语言
  - 所有用户界面元素完全本地化
  - 错误消息和通知的多语言支持
- 🎨 **系统主题跟随功能**

  - 自动检测 Windows 系统主题变化
  - 实时同步 VSCode 主题与系统主题
  - 支持浅色/深色主题自动切换

- ⏰ **定时切换功能**

  - 支持自定义浅色主题开始时间
  - 支持自定义深色主题开始时间
  - 智能计算下次切换时间
  - 精确到分钟的时间控制

- 🔄 **一键切换功能**

  - 快速在浅色和深色主题间切换
  - 支持命令面板调用
  - 可配置快捷键绑定

- ⚙️ **灵活配置选项**

  - 启用/禁用自动切换
  - 自定义浅色主题名称
  - 自定义深色主题名称
  - 选择跟随系统或定时切换模式

- 🎯 **用户友好的界面**

  - 集成 VSCode 设置页面
  - 实时状态反馈
  - 详细的配置说明
  - 中文界面支持

- 🔧 **开发者功能**
  - 完整的 TypeScript 支持
  - 模块化代码架构
  - 详细的日志记录
  - 错误处理机制

### 支持的命令

- `autoTheme.toggleTheme` - 一键切换主题
- `autoTheme.openSettings` - 打开主题设置
- `autoTheme.enableAutoSwitch` - 启用自动切换
- `autoTheme.disableAutoSwitch` - 禁用自动切换
- `autoTheme.toggleFollowSystem` - 切换跟随系统主题模式
- `autoTheme.toggleScheduledSwitch` - 切换定时切换模式
- `autoTheme.showSidebar` - 显示主题切换侧边栏

### 配置选项

- `autoTheme.enabled` - 启用自动主题切换
- `autoTheme.followSystem` - 跟随系统主题
- `autoTheme.lightTheme` - 浅色主题名称
- `autoTheme.darkTheme` - 深色主题名称
- `autoTheme.scheduledSwitch` - 启用定时切换
- `autoTheme.lightStartTime` - 浅色主题开始时间
- `autoTheme.darkStartTime` - 深色主题开始时间

### 语言支持

- 简体中文 (zh-cn)
- English (en)
- 自动检测系统语言设置

### 发布信息

- 插件已完成开发并成功打包为 VSIX 文件
- 支持通过 VS Code 扩展市场或本地安装
- 完整的功能测试和国际化验证
- 代码质量检查通过，无诊断问题

### 已知限制

- 系统主题检测目前仅支持 Windows
- 需要 PowerShell 支持进行系统主题检测
- 定时切换精度为分钟级别
