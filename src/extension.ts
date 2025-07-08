import * as vscode from "vscode";
import { ThemeManager } from "./themeManager";
import { ConfigManager } from "./configManager";
import { SystemThemeDetector } from "./systemThemeDetector";
import { ScheduleManager } from "./scheduleManager";
import { SidebarManager } from "./sidebarProvider";
import { I18nManager } from "./i18n";

let themeManager: ThemeManager;
let configManager: ConfigManager;
let systemThemeDetector: SystemThemeDetector;
let scheduleManager: ScheduleManager;
let sidebarManager: SidebarManager;
let i18nManager: I18nManager;
let statusBarItem: vscode.StatusBarItem;

/**
 * 插件激活时调用
 */
export function activate(context: vscode.ExtensionContext) {
  // 初始化管理器
  i18nManager = I18nManager.getInstance();
  console.log(i18nManager.getMessage("system.extensionActivated"));
  configManager = new ConfigManager();
  themeManager = new ThemeManager(configManager);
  systemThemeDetector = new SystemThemeDetector(
    themeManager,
    configManager,
    i18nManager
  );
  scheduleManager = new ScheduleManager(
    themeManager,
    configManager,
    i18nManager
  );
  sidebarManager = new SidebarManager(
    configManager,
    themeManager,
    systemThemeDetector,
    scheduleManager,
    i18nManager,
    context.extensionUri
  );

  // 设置手动切换主题时的回调函数
  themeManager.setOnManualSwitchCallback(() => {
    handleManualThemeSwitch();
  });

  // 注册命令
  registerCommands(context);

  // 注册侧边栏
  sidebarManager.register(context);

  // 创建状态栏项目
  createStatusBarItem(context);

  // 启动自动切换功能
  initializeAutoSwitch();

  // 监听配置变化
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration("autoTheme")) {
        handleConfigurationChange();
      }
    })
  );
}

/**
 * 创建状态栏项目
 */
function createStatusBarItem(context: vscode.ExtensionContext): void {
  statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  statusBarItem.command = "autoTheme.toggleTheme";
  statusBarItem.show();
  
  // 初始化状态栏显示
  updateStatusBarItem();
  
  context.subscriptions.push(statusBarItem);
}

/**
 * 更新状态栏项目显示
 */
function updateStatusBarItem(): void {
  if (!statusBarItem) return;
  
  const currentTheme = vscode.workspace.getConfiguration("workbench").get("colorTheme") as string;
  const isDark = currentTheme.toLowerCase().includes("dark");
  
  if (isDark) {
    statusBarItem.text = i18nManager.getMessage("statusBar.darkTheme");
    statusBarItem.tooltip = i18nManager.getMessage("statusBar.tooltip", i18nManager.getMessage("statusBar.darkTheme"));
  } else {
    statusBarItem.text = i18nManager.getMessage("statusBar.lightTheme");
    statusBarItem.tooltip = i18nManager.getMessage("statusBar.tooltip", i18nManager.getMessage("statusBar.lightTheme"));
  }
}

/**
 * 注册所有命令
 */
function registerCommands(context: vscode.ExtensionContext) {
  // 一键切换主题
  const toggleCommand = vscode.commands.registerCommand(
    "autoTheme.toggleTheme",
    async () => {
      await themeManager.toggleTheme(true); // 明确标记为手动切换
      updateStatusBarItem(); // 更新状态栏显示
      sidebarManager.refresh();
      vscode.window.showInformationMessage(
        i18nManager.getMessage("message.themeToggled")
      );
    }
  );

  // 打开设置
  const settingsCommand = vscode.commands.registerCommand(
    "autoTheme.openSettings",
    () => {
      vscode.commands.executeCommand(
        "workbench.action.openSettings",
        "autoTheme"
      );
    }
  );

  // 启用自动切换
  const enableCommand = vscode.commands.registerCommand(
    "autoTheme.enableAutoSwitch",
    async () => {
      await configManager.setEnabled(true);
      initializeAutoSwitch();
      sidebarManager.refresh();
      vscode.window.showInformationMessage(
        i18nManager.getMessage("autoSwitchEnabled")
      );
    }
  );

  // 禁用自动切换
  const disableCommand = vscode.commands.registerCommand(
    "autoTheme.disableAutoSwitch",
    async () => {
      await configManager.setEnabled(false);
      systemThemeDetector.stop();
      scheduleManager.stop();
      sidebarManager.refresh();
      vscode.window.showInformationMessage(
        i18nManager.getMessage("autoSwitchDisabled")
      );
    }
  );

  // 注意：refreshSidebar 命令已在 SidebarManager 中注册，此处不再重复注册

  // 切换跟随系统模式
  const toggleFollowSystemCommand = vscode.commands.registerCommand(
    "autoTheme.toggleFollowSystem",
    async () => {
      const currentFollowSystem = configManager.isFollowSystem();
      await configManager.setFollowSystem(!currentFollowSystem);
      initializeAutoSwitch();
      sidebarManager.refresh();
      const message = !currentFollowSystem
        ? i18nManager.getMessage("message.followSystemEnabled")
        : i18nManager.getMessage("message.followSystemDisabled");
      vscode.window.showInformationMessage(message);
    }
  );

  // 切换定时切换模式
  const toggleScheduledSwitchCommand = vscode.commands.registerCommand(
    "autoTheme.toggleScheduledSwitch",
    async () => {
      const currentScheduledSwitch = configManager.isScheduledSwitchEnabled();
      await configManager.setScheduledSwitch(!currentScheduledSwitch);
      initializeAutoSwitch();
      sidebarManager.refresh();
      const message = !currentScheduledSwitch
        ? i18nManager.getMessage("message.scheduledSwitchEnabled")
        : i18nManager.getMessage("message.scheduledSwitchDisabled");
      vscode.window.showInformationMessage(message);
    }
  );

  // 切换到浅色主题
  const switchToLightCommand = vscode.commands.registerCommand(
    "autoTheme.switchToLight",
    async () => {
      await themeManager.switchToLight(true); // 明确标记为手动切换
      updateStatusBarItem(); // 更新状态栏显示
      sidebarManager.refresh();
      vscode.window.showInformationMessage(
        i18nManager.getMessage("message.switchedToLight")
      );
    }
  );

  // 切换到深色主题
  const switchToDarkCommand = vscode.commands.registerCommand(
    "autoTheme.switchToDark",
    async () => {
      await themeManager.switchToDark(true); // 明确标记为手动切换
      updateStatusBarItem(); // 更新状态栏显示
      sidebarManager.refresh();
      vscode.window.showInformationMessage(
        i18nManager.getMessage("message.switchedToDark")
      );
    }
  );

  context.subscriptions.push(
    toggleCommand,
    settingsCommand,
    enableCommand,
    disableCommand,
    toggleFollowSystemCommand,
    toggleScheduledSwitchCommand,
    switchToLightCommand,
    switchToDarkCommand
  );
}

/**
 * 初始化自动切换功能
 */
function initializeAutoSwitch() {
  if (!configManager.isEnabled()) {
    return;
  }

  if (configManager.shouldFollowSystem()) {
    systemThemeDetector.start();
    scheduleManager.stop();
  } else if (configManager.isScheduledSwitchEnabled()) {
    scheduleManager.start();
    systemThemeDetector.stop();
  } else {
    systemThemeDetector.stop();
    scheduleManager.stop();
  }
}

/**
 * 处理手动主题切换
 * 当用户手动切换主题时，自动禁用自动切换功能
 */
async function handleManualThemeSwitch() {
  if (configManager.isEnabled()) {
    console.log("Manual theme switch detected, auto-switch disabled");
    await configManager.setEnabled(false);
    systemThemeDetector.stop();
    scheduleManager.stop();
    sidebarManager.refresh();
    vscode.window.showInformationMessage(
      i18nManager.getMessage("notification.autoSwitchDisabledByManual")
    );
  }
}

/**
 * 处理配置变化
 */
function handleConfigurationChange() {
  console.log(i18nManager.getMessage("system.configChanged"));
  initializeAutoSwitch();
  updateStatusBarItem(); // 更新状态栏显示
  if (sidebarManager) {
    sidebarManager.refresh();
  }
}

/**
 * 插件停用时调用
 */
export function deactivate() {
  if (systemThemeDetector) {
    systemThemeDetector.stop();
  }
  if (scheduleManager) {
    scheduleManager.stop();
  }
  console.log(i18nManager.getMessage("system.extensionDeactivated"));
}
