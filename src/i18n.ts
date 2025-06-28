import * as vscode from "vscode";

/**
 * 国际化管理器
 * 提供多语言字符串支持
 */
export class I18nManager {
  private static instance: I18nManager;
  private locale: string;
  private messages: { [key: string]: string } = {};

  private constructor() {
    this.locale = vscode.env.language || "en";
    this.loadMessages();
  }

  /**
   * 获取单例实例
   */
  public static getInstance(): I18nManager {
    if (!I18nManager.instance) {
      I18nManager.instance = new I18nManager();
    }
    return I18nManager.instance;
  }

  /**
   * 加载语言消息
   */
  private loadMessages(): void {
    // 默认英文消息
    this.messages = {
      // 命令相关
      "command.toggleTheme": "Toggle Theme",
      "command.openSettings": "Open Theme Settings",
      "command.enableAutoSwitch": "Enable Auto Switch",
      "command.disableAutoSwitch": "Disable Auto Switch",
      "command.switchToLight": "Switch to Light Theme",
      "command.switchToDark": "Switch to Dark Theme",

      // 消息提示
      "message.themeToggled": "Theme has been toggled",
      "message.autoSwitchEnabled": "Auto theme switching enabled",
      "message.autoSwitchDisabled": "Auto theme switching disabled",
      "message.switchedToLight": "Switched to light theme",
      "message.switchedToDark": "Switched to dark theme",

      // 侧边栏状态
      "sidebar.currentTheme": "Current Theme",
      "sidebar.autoSwitch": "Auto Switch",
      "sidebar.followSystem": "Follow System",
      "sidebar.systemTheme": "System Theme",
      "sidebar.scheduledSwitch": "Scheduled Switch",
      "sidebar.currentPeriod": "Current Period",
      "sidebar.nextSwitch": "Next Switch",
      "sidebar.detecting": "Detecting...",
      "sidebar.running": "Running",
      "sidebar.stopped": "Stopped",
      "sidebar.light": "Light",
      "sidebar.dark": "Dark",

      // 控制面板
      "controls.toggleTheme": "Toggle Theme",
      "controls.enableAutoSwitch": "Enable Auto Switch",
      "controls.disableAutoSwitch": "Disable Auto Switch",
      "controls.openSettings": "Open Settings",
      "controls.openSettingsTooltip": "Open Auto Theme Switcher settings page",
      "controls.switchToLight": "Switch to Light Theme",
      "controls.switchToLightTooltip": "Switch to light theme: {theme}",
      "controls.switchToDark": "Switch to Dark Theme",
      "controls.switchToDarkTooltip": "Switch to dark theme: {theme}",

      // 工具提示
      "tooltip.toggleTheme": "Quickly switch between light and dark themes",
      "tooltip.autoSwitch": "Auto switch function is {0}",
      "tooltip.followSystem": "System theme following is {0}",
      "tooltip.systemTheme": "System theme detection status: {0}",
      "tooltip.scheduledSwitch": "Scheduled switch enabled, next switch: {0}",
      "tooltip.openSettings": "Open Auto Theme Switcher settings page",
      "tooltip.switchToLight": "Switch to light theme: {0}",
      "tooltip.switchToDark": "Switch to dark theme: {0}",

      // 时间设置
      "time.lightTimeUpdated": "Light theme time updated to {0}",
      "time.darkTimeUpdated": "Dark theme time updated to {0}",
      "time.updateFailed": "Failed to update time settings",
      "time.invalidFormat": "Invalid time format. Expected HH:MM",

      // 系统消息
      "system.extensionActivated": "Auto Theme Switcher extension activated",
      "system.extensionDeactivated":
        "Auto Theme Switcher extension deactivated",
      "system.configChanged":
        "Configuration changed, reinitializing auto switch",
      "system.scheduleStarted": "Started scheduled theme switching",
      "system.scheduleStopped": "Stopped scheduled theme switching",
      "system.detectionStarted": "Started system theme detection",
      "system.detectionStopped": "Stopped system theme detection",
      "system.switchedToLight": "Switched to light theme (following system)",
      "system.switchedToDark": "Switched to dark theme (following system)",

      // 侧边栏界面
      "sidebar.themeControl": "Theme Control",
      "sidebar.enabled": "Enabled",
      "sidebar.disabled": "Disabled",
      "sidebar.autoSwitchEnabled": "Auto theme switching is enabled",
      "sidebar.autoSwitchDisabled": "Auto theme switching is disabled",
      "sidebar.toggleTheme": "🔄 Toggle Theme",
      "sidebar.disableAutoSwitch": "⏹️ Disable Auto Switch",
      "sidebar.enableAutoSwitch": "▶️ Enable Auto Switch",
      "sidebar.switchMode": "Switch Mode",
      "sidebar.selectSwitchMode": "Select theme switching mode",
      "sidebar.disableFollowSystem": "👁️‍🗨️ Disable Follow System",
      "sidebar.enableFollowSystem": "👁️ Enable Follow System",
      "sidebar.disableScheduledSwitch": "⏰ Disable Scheduled Switch",
      "sidebar.enableScheduledSwitch": "⏱️ Enable Scheduled Switch",
      "sidebar.quickSwitch": "Quick Switch",
      "sidebar.switchToSpecificTheme": "Switch to specific theme",
      "sidebar.lightTheme": "☀️ Light",
      "sidebar.darkTheme": "🌙 Dark",
      "sidebar.lightThemeLabel": "Light",
      "sidebar.darkThemeLabel": "Dark",

      "sidebar.installedThemes": "Installed Themes",
      "sidebar.selectFromInstalledThemes": "Select from all installed themes",
      "sidebar.allThemes": "All",
      "sidebar.lightThemesTab": "Light",
      "sidebar.darkThemesTab": "Dark",
      "sidebar.lightType": "Light",
      "sidebar.darkType": "Dark",
      "sidebar.unknownType": "Unknown",
      "sidebar.setAsLightTheme": "Set as Light Theme",
      "sidebar.setAsDarkTheme": "Set as Dark Theme",
      "sidebar.lightThemeSetTo": "Light theme set to: {0}",
      "sidebar.darkThemeSetTo": "Dark theme set to: {0}",
      "message.lightThemeSet": "Light theme set to: {0}",
      "message.darkThemeSet": "Dark theme set to: {0}",
      "message.lightThemeConfigured": "Light theme configured to: {0}",
      "message.darkThemeConfigured": "Dark theme configured to: {0}",
      "message.themeSetFailed": "Failed to set theme",
      "sidebar.failedToSetTheme": "Failed to set theme",
      "sidebar.lightThemeShort": "Light",
      "sidebar.darkThemeShort": "Dark",
      "sidebar.themeConfiguration": "Theme Configuration",
      "sidebar.configureThemePreferences": "Configure your light and dark theme preferences",
      "sidebar.lightThemeConfig": "Light Theme",
      "sidebar.darkThemeConfig": "Dark Theme",
      "sidebar.selectTheme": "Select a theme...",
      "sidebar.currentSelection": "Current",
      "message.themeChanged": "Theme changed to: {0}",
      "message.themeChangeFailed": "Failed to change theme",
    "message.followSystemEnabled": "Follow system theme enabled",
    "message.followSystemDisabled": "Follow system theme disabled",
    "message.scheduledSwitchEnabled": "Scheduled switch enabled",
    "message.scheduledSwitchDisabled": "Scheduled switch disabled",

    // 通知相关 主题切换通知
      "notification.lightTheme": "Light Theme",
      "notification.darkTheme": "Dark Theme",
      "notification.scheduledSwitch": "Scheduled Switch",

      // 时间相关
      "time.nextSwitchIn": "Next theme switch in {0} minutes",
      "time.hoursMinutes": "{0} hours {1} minutes later",
      "time.minutesOnly": "{0} minutes later",
      "time.lightThemeTime": "Light theme time",
      "time.darkThemeTime": "Dark theme time",
      "time.notScheduled": "Not scheduled",

      // 错误消息
      "error.applyScheduledThemeFailed": "Failed to apply scheduled theme: {0}",
      "error.scheduledSwitchFailed": "Scheduled theme switch failed: {0}",
      "error.executeScheduledSwitchFailed":
        "Failed to execute scheduled switch: {0}",
      "error.systemThemeDetectionFailed": "System theme detection failed: {0}",
      "error.applySystemThemeFailed": "Failed to apply system theme: {0}",
      "error.switchThemeFailed": "Failed to switch theme: {0}",
      "error.themeNotFound": "Theme not found: {0}",

      // 通知消息
      "notification.switchedTo": "Switched to {0} ({1})",
      "notification.autoSwitchDisabledByManual":
        "Manual theme switch detected. Auto-switch has been disabled. Use command palette or sidebar to re-enable if needed.",
    };

    // 如果是中文环境，加载中文消息
    if (this.locale.startsWith("zh")) {
      this.loadChineseMessages();
    }
  }

  /**
   * 加载中文消息
   */
  private loadChineseMessages(): void {
    const chineseMessages = {
      // 命令相关
      "command.toggleTheme": "一键切换主题",
      "command.openSettings": "打开主题设置",
      "command.enableAutoSwitch": "启用自动切换",
      "command.disableAutoSwitch": "禁用自动切换",
      "command.switchToLight": "切换到浅色主题",
      "command.switchToDark": "切换到深色主题",

      // 消息提示
      "message.themeToggled": "主题已切换",
      "message.autoSwitchEnabled": "自动主题切换已启用",
      "message.autoSwitchDisabled": "自动主题切换已禁用",
      "message.switchedToLight": "已切换到浅色主题",
      "message.switchedToDark": "已切换到深色主题",

      // 侧边栏状态
      "sidebar.currentTheme": "当前主题",
      "sidebar.autoSwitch": "自动切换",
      "sidebar.followSystem": "跟随系统",
      "sidebar.systemTheme": "系统主题",
      "sidebar.scheduledSwitch": "定时切换",
      "sidebar.currentPeriod": "当前时段",
      "sidebar.nextSwitch": "下次切换",
      "sidebar.detecting": "检测中...",
      "sidebar.running": "运行中",
      "sidebar.stopped": "已停止",
      "sidebar.light": "浅色",
      "sidebar.dark": "深色",

      // 控制面板
      "controls.toggleTheme": "一键切换主题",
      "controls.enableAutoSwitch": "启用自动切换",
      "controls.disableAutoSwitch": "禁用自动切换",
      "controls.openSettings": "打开设置",
      "controls.openSettingsTooltip": "打开Auto Theme Switcher设置页面",
      "controls.switchToLight": "切换到浅色主题",
      "controls.switchToLightTooltip": "切换到浅色主题: {theme}",
      "controls.switchToDark": "切换到深色主题",
      "controls.switchToDarkTooltip": "切换到深色主题: {theme}",

      // 工具提示
      "tooltip.toggleTheme": "在浅色和深色主题之间快速切换",
      "tooltip.autoSwitch": "自动切换功能{0}",
      "tooltip.followSystem": "系统主题跟随{0}",
      "tooltip.systemTheme": "系统主题检测状态: {0}",
      "tooltip.scheduledSwitch": "定时切换已启用，下次切换: {0}",
      "tooltip.openSettings": "打开Auto Theme Switcher设置页面",
      "tooltip.switchToLight": "切换到浅色主题: {0}",
      "tooltip.switchToDark": "切换到深色主题: {0}",

      // 时间设置
      "time.lightTimeUpdated": "浅色主题时间已更新为 {0}",
      "time.darkTimeUpdated": "深色主题时间已更新为 {0}",
      "time.updateFailed": "更新时间设置失败",
      "time.invalidFormat": "时间格式无效，请使用 HH:MM 格式",

      // 系统消息
      "system.extensionActivated": "Auto Theme Switcher 插件已激活",
      "system.extensionDeactivated": "Auto Theme Switcher 插件已停用",
      "system.configChanged": "配置已更改，重新初始化自动切换",
      "system.scheduleStarted": "启动定时主题切换",
      "system.scheduleStopped": "停止定时主题切换",
      "system.detectionStarted": "启动系统主题检测",
      "system.detectionStopped": "停止系统主题检测",
      "system.switchedToLight": "已切换到浅色主题（跟随系统）",
      "system.switchedToDark": "已切换到深色主题（跟随系统）",

      // 侧边栏界面
      "sidebar.themeControl": "主题控制",
      "sidebar.enabled": "已启用",
      "sidebar.disabled": "已禁用",
      "sidebar.autoSwitchEnabled": "自动主题切换功能已启用",
      "sidebar.autoSwitchDisabled": "自动主题切换功能已禁用",
      "sidebar.toggleTheme": "🔄 一键切换主题",
      "sidebar.disableAutoSwitch": "⏹️ 禁用自动切换",
      "sidebar.enableAutoSwitch": "▶️ 启用自动切换",
      "sidebar.switchMode": "切换模式",
      "sidebar.selectSwitchMode": "选择主题切换的工作模式",
      "sidebar.disableFollowSystem": "👁️‍🗨️ 禁用跟随系统",
      "sidebar.enableFollowSystem": "👁️ 启用跟随系统",
      "sidebar.disableScheduledSwitch": "⏰ 禁用定时切换",
      "sidebar.enableScheduledSwitch": "⏱️ 启用定时切换",
      "sidebar.quickSwitch": "快速切换",
      "sidebar.switchToSpecificTheme": "直接切换到指定主题",
      "sidebar.lightTheme": "☀️ 浅色",
      "sidebar.darkTheme": "🌙 深色",
      "sidebar.lightThemeLabel": "浅色",
      "sidebar.darkThemeLabel": "深色",
    "sidebar.installedThemes": "已安装主题",
      "sidebar.selectFromInstalledThemes": "从所有已安装的主题中选择",
      "sidebar.allThemes": "全部",
      "sidebar.lightThemesTab": "浅色",
      "sidebar.darkThemesTab": "深色",
      "sidebar.lightType": "浅色",
      "sidebar.darkType": "深色",
      "sidebar.unknownType": "未知",
      "sidebar.setAsLightTheme": "设为浅色主题",
      "sidebar.setAsDarkTheme": "设为深色主题",
      "sidebar.lightThemeSetTo": "浅色主题已设置为: {0}",
      "sidebar.darkThemeSetTo": "深色主题已设置为: {0}",
      "sidebar.failedToSetTheme": "设置主题失败",
      "sidebar.lightThemeShort": "浅色",
      "sidebar.darkThemeShort": "深色",
      "sidebar.themeConfiguration": "主题配置",
      "sidebar.configureThemePreferences": "配置您的浅色和深色主题偏好",
      "sidebar.lightThemeConfig": "浅色主题",
      "sidebar.darkThemeConfig": "深色主题",
      "sidebar.selectTheme": "选择主题...",
      "sidebar.currentSelection": "当前选择",
      "message.themeChanged": "主题已切换到: {0}",
    "message.themeChangeFailed": "切换主题失败",
    "message.lightThemeSet": "浅色主题已设置为: {0}",
    "message.darkThemeSet": "深色主题已设置为: {0}",
    "message.lightThemeConfigured": "浅色主题已配置为: {0}",
    "message.darkThemeConfigured": "深色主题已配置为: {0}",
    "message.themeSetFailed": "设置主题失败",
    "message.followSystemEnabled": "已启用跟随系统主题",
    "message.followSystemDisabled": "已禁用跟随系统主题",
    "message.scheduledSwitchEnabled": "已启用定时切换",
    "message.scheduledSwitchDisabled": "已禁用定时切换",

    // 通知相关 主题切换通知
      "notification.lightTheme": "浅色主题",
      "notification.darkTheme": "深色主题",
      "notification.scheduledSwitch": "定时切换",

      // 时间相关
      "time.nextSwitchIn": "下次主题切换将在 {0} 分钟后进行",
      "time.hoursMinutes": "{0}小时{1}分钟后",
      "time.minutesOnly": "{0}分钟后",
      "time.lightThemeTime": "浅色主题时间",
      "time.darkThemeTime": "深色主题时间",
      "time.notScheduled": "未安排",

      // 错误消息
      "error.applyScheduledThemeFailed": "应用定时主题失败: {0}",
      "error.scheduledSwitchFailed": "定时切换主题失败: {0}",
      "error.executeScheduledSwitchFailed": "执行定时切换失败: {0}",
      "error.systemThemeDetectionFailed": "检测系统主题时出错: {0}",
      "error.applySystemThemeFailed": "应用系统主题失败: {0}",
      "error.switchThemeFailed": "切换主题失败: {0}",
      "error.themeNotFound": "未找到主题: {0}",

      // 通知消息
      "notification.switchedTo": "已切换到{0}（{1}）",
      "notification.autoSwitchDisabledByManual":
      "检测到手动主题切换，已自动禁用自动切换功能。如需重新启用，请使用命令面板或侧边栏。",
    };

    // 合并中文消息
    this.messages = { ...this.messages, ...chineseMessages };
  }

  /**
   * 获取本地化字符串
   * @param key 消息键
   * @param args 格式化参数
   * @returns 本地化字符串
   */
  public getMessage(key: string, ...args: string[]): string {
    let message = this.messages[key] || key;

    // 替换占位符
    args.forEach((arg, index) => {
      message = message.replace(`{${index}}`, arg);
    });

    return message;
  }

  /**
   * 获取当前语言环境
   */
  public getLocale(): string {
    return this.locale;
  }

  /**
   * 检查是否为中文环境
   */
  public isChinese(): boolean {
    return this.locale.startsWith("zh");
  }

  /**
   * 获取侧边栏状态相关的本地化字符串
   */
  public getSidebarStatus(key: string): string {
    return this.getMessage(`sidebar.${key}`);
  }

  /**
   * 获取侧边栏控制相关的本地化字符串
   */
  public getSidebarControls(key: string): string {
    return this.getMessage(`controls.${key}`);
  }
}

// 导出便捷函数
const i18n = I18nManager.getInstance();
export const t = (key: string, ...args: string[]): string =>
  i18n.getMessage(key, ...args);
export const locale = (): string => i18n.getLocale();
export const isChinese = (): boolean => i18n.isChinese();
