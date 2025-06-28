import * as vscode from "vscode";
import { ConfigManager } from "./configManager";
import { ThemeManager } from "./themeManager";
import { SystemThemeDetector } from "./systemThemeDetector";
import { ScheduleManager } from "./scheduleManager";
import { I18nManager } from "./i18n";

/**
 * 侧边栏数据项接口
 */
interface SidebarItem {
  label: string;
  description?: string;
  tooltip?: string;
  contextValue?: string;
  iconPath?: vscode.ThemeIcon;
  collapsibleState?: vscode.TreeItemCollapsibleState;
  command?: vscode.Command;
}

/**
 * 主题状态视图提供者
 */
export class ThemeStatusProvider
  implements vscode.TreeDataProvider<SidebarItem>
{
  private _onDidChangeTreeData: vscode.EventEmitter<
    SidebarItem | undefined | null | void
  > = new vscode.EventEmitter<SidebarItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<
    SidebarItem | undefined | null | void
  > = this._onDidChangeTreeData.event;

  constructor(
    private configManager: ConfigManager,
    private themeManager: ThemeManager,
    private systemThemeDetector: SystemThemeDetector,
    private scheduleManager: ScheduleManager,
    private i18nManager: I18nManager
  ) {}

  /**
   * 刷新视图
   */
  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  /**
   * 获取树项
   */
  getTreeItem(element: SidebarItem): vscode.TreeItem {
    const treeItem = new vscode.TreeItem(
      element.label,
      element.collapsibleState
    );
    treeItem.description = element.description;
    treeItem.tooltip = element.tooltip;
    treeItem.contextValue = element.contextValue;
    treeItem.iconPath = element.iconPath;
    treeItem.command = element.command;
    return treeItem;
  }

  /**
   * 获取子项
   */
  getChildren(element?: SidebarItem): Thenable<SidebarItem[]> {
    if (!element) {
      return Promise.resolve(this.getStatusItems());
    }
    return Promise.resolve([]);
  }

  /**
   * 获取状态项
   */
  private getStatusItems(): SidebarItem[] {
    const items: SidebarItem[] = [];

    // 当前主题信息
    const currentTheme = this.themeManager.getCurrentThemeName();
    items.push({
      label: this.i18nManager.getSidebarStatus("currentTheme"),
      description: currentTheme,
      tooltip: this.i18nManager
        .getSidebarStatus("currentThemeTooltip")
        .replace("{theme}", currentTheme),
      iconPath: new vscode.ThemeIcon("symbol-color"),
    });

    // 自动切换状态
    const isEnabled = this.configManager.isEnabled();
    items.push({
      label: this.i18nManager.getSidebarStatus("autoSwitch"),
      description: isEnabled
        ? this.i18nManager.getSidebarStatus("enabled")
        : this.i18nManager.getSidebarStatus("disabled"),
      tooltip: this.i18nManager
        .getSidebarStatus("autoSwitchTooltip")
        .replace(
          "{status}",
          isEnabled
            ? this.i18nManager.getSidebarStatus("enabled")
            : this.i18nManager.getSidebarStatus("disabled")
        ),
      iconPath: new vscode.ThemeIcon(isEnabled ? "check" : "x"),
    });

    // 跟随系统状态
    if (isEnabled) {
      const followSystem = this.configManager.shouldFollowSystem();
      items.push({
        label: this.i18nManager.getSidebarStatus("followSystem"),
        description: followSystem
          ? this.i18nManager.getSidebarStatus("enabled")
          : this.i18nManager.getSidebarStatus("disabled"),
        tooltip: this.i18nManager
          .getSidebarStatus("followSystemTooltip")
          .replace(
            "{status}",
            followSystem
              ? this.i18nManager.getSidebarStatus("enabled")
              : this.i18nManager.getSidebarStatus("disabled")
          ),
        iconPath: new vscode.ThemeIcon(
          followSystem ? "device-desktop" : "clock"
        ),
      });

      // 系统主题检测状态
      if (followSystem) {
        const systemStatus = this.systemThemeDetector.getStatus();
        items.push({
          label: this.i18nManager.getSidebarStatus("systemTheme"),
          description:
            systemStatus.lastSystemTheme === "unknown"
              ? this.i18nManager.getSidebarStatus("detecting")
              : systemStatus.lastSystemTheme,
          tooltip: this.i18nManager
            .getSidebarStatus("systemThemeTooltip")
            .replace(
              "{status}",
              systemStatus.isRunning
                ? this.i18nManager.getSidebarStatus("running")
                : this.i18nManager.getSidebarStatus("stopped")
            ),
          iconPath: new vscode.ThemeIcon("eye"),
        });
      }

      // 定时切换状态
      const scheduledSwitch = this.configManager.isScheduledSwitchEnabled();
      if (!followSystem && scheduledSwitch) {
        const scheduleStatus = this.scheduleManager.getStatus();
        items.push({
          label: this.i18nManager.getSidebarStatus("scheduledSwitch"),
          description: this.i18nManager.getSidebarStatus("enabled"),
          tooltip: this.i18nManager
            .getSidebarStatus("scheduledSwitchTooltip")
            .replace("{time}", scheduleStatus.nextSwitchTime),
          iconPath: new vscode.ThemeIcon("clock"),
        });

        items.push({
          label: this.i18nManager.getSidebarStatus("currentPeriod"),
          description: scheduleStatus.currentThemeType,
          tooltip: this.i18nManager.getSidebarStatus("currentPeriodTooltip"),
          iconPath: new vscode.ThemeIcon("calendar"),
        });

        items.push({
          label: this.i18nManager.getSidebarStatus("nextSwitch"),
          description: scheduleStatus.nextSwitchTime,
          tooltip: this.i18nManager.getSidebarStatus("nextSwitchTooltip"),
          iconPath: new vscode.ThemeIcon("watch"),
        });
      }
    }

    // 主题配置
    items.push({
      label: this.i18nManager.getSidebarStatus("lightTheme"),
      description: this.configManager.getLightTheme(),
      tooltip: this.i18nManager
        .getSidebarStatus("lightThemeTooltip")
        .replace("{theme}", this.configManager.getLightTheme()),
      iconPath: new vscode.ThemeIcon("sun"),
    });

    items.push({
      label: this.i18nManager.getSidebarStatus("darkTheme"),
      description: this.configManager.getDarkTheme(),
      tooltip: this.i18nManager
        .getSidebarStatus("darkThemeTooltip")
        .replace("{theme}", this.configManager.getDarkTheme()),
      iconPath: new vscode.ThemeIcon("moon"),
    });

    return items;
  }
}

/**
 * 控制面板WebView提供者 - 卡片样式
 */
export class ThemeControlsProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "autoThemeControls";
  private _view?: vscode.WebviewView;

  constructor(
    private configManager: ConfigManager,
    private themeManager: ThemeManager,
    private i18nManager: I18nManager,
    private _extensionUri: vscode.Uri
  ) {}

  /**
   * 解析WebView视图
   */
  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    // 处理来自WebView的消息
    webviewView.webview.onDidReceiveMessage(
      (message) => {
        switch (message.command) {
          case "toggleTheme":
            vscode.commands.executeCommand("autoTheme.toggleTheme");
            break;
          case "enableAutoSwitch":
            vscode.commands.executeCommand("autoTheme.enableAutoSwitch");
            break;
          case "disableAutoSwitch":
            vscode.commands.executeCommand("autoTheme.disableAutoSwitch");
            break;

          case "toggleFollowSystem":
            vscode.commands.executeCommand("autoTheme.toggleFollowSystem");
            break;
          case "toggleScheduledSwitch":
            vscode.commands.executeCommand("autoTheme.toggleScheduledSwitch");
            break;
          case "switchToLight":
            vscode.commands.executeCommand("autoTheme.switchToLight");
            break;
          case "switchToDark":
            vscode.commands.executeCommand("autoTheme.switchToDark");
            break;
          case "updateLightTime":
            this.updateLightTime(message.time);
            break;
          case "updateDarkTime":
            this.updateDarkTime(message.time);
            break;
          case "setTheme":
            this.setTheme(message.themeLabel);
            break;
          case "setLightTheme":
            this.setLightTheme(message.themeLabel, message.shouldSwitch);
            break;
          case "setDarkTheme":
            this.setDarkTheme(message.themeLabel, message.shouldSwitch);
            break;
        }
      },
      undefined,
      []
    );
  }

  /**
   * 刷新视图
   */
  refresh(): void {
    if (this._view) {
      this._view.webview.html = this._getHtmlForWebview(this._view.webview);
    }
  }

  /**
   * 更新浅色主题开始时间
   */
  private async updateLightTime(time: string): Promise<void> {
    try {
      await this.configManager.setLightStartTime(time);
      this.refresh();
      const message = this.i18nManager
        .getMessage("time.lightTimeUpdated")
        .replace("{0}", time);
      vscode.window.showInformationMessage(message);
    } catch (error) {
      const errorMessage =
        error instanceof Error && error.message.includes("Invalid time format")
          ? this.i18nManager.getMessage("time.invalidFormat")
          : this.i18nManager.getMessage("time.updateFailed");
      vscode.window.showErrorMessage(errorMessage);
    }
  }

  /**
   * 更新深色主题开始时间
   */
  private async updateDarkTime(time: string): Promise<void> {
    try {
      await this.configManager.setDarkStartTime(time);
      this.refresh();
      const message = this.i18nManager
        .getMessage("time.darkTimeUpdated")
        .replace("{0}", time);
      vscode.window.showInformationMessage(message);
    } catch (error) {
      const errorMessage =
        error instanceof Error && error.message.includes("Invalid time format")
          ? this.i18nManager.getMessage("time.invalidFormat")
          : this.i18nManager.getMessage("time.updateFailed");
      vscode.window.showErrorMessage(errorMessage);
    }
  }

  /**
   * 设置指定主题
   */
  private async setTheme(themeLabel: string): Promise<void> {
    try {
      await this.themeManager.setThemeByLabel(themeLabel, true);
      this.refresh();
      const message = this.i18nManager
        .getMessage("message.themeChanged")
        .replace("{0}", themeLabel);
      vscode.window.showInformationMessage(message);
    } catch (error) {
      const errorMessage = this.i18nManager.getMessage(
        "message.themeChangeFailed"
      );
      vscode.window.showErrorMessage(errorMessage);
    }
  }

  /**
   * 设置浅色主题
   * @param themeLabel 主题名称
   * @param shouldSwitch 是否立即切换到该主题（默认为true，兼容旧调用）
   */
  private async setLightTheme(themeLabel: string, shouldSwitch: boolean = true): Promise<void> {
    try {
      await this.configManager.setLightTheme(themeLabel);
      
      // 如果需要立即切换且当前在浅色模式，则切换主题
      if (shouldSwitch) {
        await this.themeManager.setThemeByLabel(themeLabel);
      }
      
      this.refresh();
      const message = shouldSwitch 
        ? this.i18nManager.getMessage("message.lightThemeSet").replace("{0}", themeLabel)
        : this.i18nManager.getMessage("message.lightThemeConfigured").replace("{0}", themeLabel);
      vscode.window.showInformationMessage(message);
    } catch (error) {
      const errorMessage = this.i18nManager.getMessage(
        "message.themeSetFailed"
      );
      vscode.window.showErrorMessage(errorMessage);
    }
  }

  /**
   * 设置深色主题
   * @param themeLabel 主题名称
   * @param shouldSwitch 是否立即切换到该主题（默认为true，兼容旧调用）
   */
  private async setDarkTheme(themeLabel: string, shouldSwitch: boolean = true): Promise<void> {
    try {
      await this.configManager.setDarkTheme(themeLabel);
      
      // 如果需要立即切换且当前在深色模式，则切换主题
      if (shouldSwitch) {
        await this.themeManager.setThemeByLabel(themeLabel);
      }
      
      this.refresh();
      const message = shouldSwitch 
        ? this.i18nManager.getMessage("message.darkThemeSet").replace("{0}", themeLabel)
        : this.i18nManager.getMessage("message.darkThemeConfigured").replace("{0}", themeLabel);
      vscode.window.showInformationMessage(message);
    } catch (error) {
      const errorMessage = this.i18nManager.getMessage(
        "message.themeSetFailed"
      );
      vscode.window.showErrorMessage(errorMessage);
    }
  }

  /**
   * 生成主题选项HTML
   */
  private generateThemeOptions(
    themes: Array<{
      label: string;
      uiTheme: string;
    }>,
    selectedTheme: string
  ): string {
    return themes
      .map((theme) => {
        const isSelected = theme.label === selectedTheme;
        return `<option value="${theme.label.replace(/"/g, '&quot;')}" ${isSelected ? 'selected' : ''}>${theme.label}</option>`;
      })
      .join('');
  }

  /**
   * 生成主题列表HTML
   */
  private generateThemeListHTML(
    themes: Array<{
      id: string;
      label: string;
      uiTheme: string;
      extensionId: string;
      isBuiltIn: boolean;
    }>
  ): string {
    const currentTheme = this.themeManager.getCurrentThemeName();
    const currentLightTheme = this.configManager.getLightTheme();
    const currentDarkTheme = this.configManager.getDarkTheme();

    return themes
      .map((theme) => {
        const isCurrentTheme = theme.label === currentTheme;
        const isLightTheme = theme.label === currentLightTheme;
        const isDarkTheme = theme.label === currentDarkTheme;
        const themeTypeText = this.getThemeTypeText(theme.uiTheme);
        
        // 构建状态标签
        let statusBadges = '';
        if (isLightTheme) {
          statusBadges += `<span class="theme-badge light-badge">☀️ ${this.i18nManager.getMessage("sidebar.lightThemeShort")}</span>`;
        }
        if (isDarkTheme) {
          statusBadges += `<span class="theme-badge dark-badge">🌙 ${this.i18nManager.getMessage("sidebar.darkThemeShort")}</span>`;
        }
        if (isCurrentTheme) {
          statusBadges += `<span class="theme-badge current-badge">✓ ${this.i18nManager.getMessage("sidebar.currentTheme")}</span>`;
        }

        return `
                <div class="theme-item ${
                  isCurrentTheme ? "current" : ""
                }" data-theme="${theme.label.replace(/'/g, "\\'")}"> 
                    <div class="theme-main" onclick="selectTheme('${theme.label.replace(/'/g, "\\'")}')"> 
                        <div class="theme-header">
                            <span class="theme-name">${theme.label}</span>
                            <span class="theme-type">${themeTypeText}</span>
                        </div>
                        ${statusBadges ? `<div class="theme-badges">${statusBadges}</div>` : ''}
                    </div>
                    <div class="theme-config">
                        <button class="config-btn ${isLightTheme ? 'active' : ''}" 
                                onclick="event.stopPropagation(); setLightTheme('${theme.label.replace(/'/g, "\\'")}')" 
                                title="${this.i18nManager.getMessage("sidebar.setAsLightTheme")}">
                            ☀️
                        </button>
                        <button class="config-btn ${isDarkTheme ? 'active' : ''}" 
                                onclick="event.stopPropagation(); setDarkTheme('${theme.label.replace(/'/g, "\\'")}')" 
                                title="${this.i18nManager.getMessage("sidebar.setAsDarkTheme")}">
                            🌙
                        </button>
                    </div>
                </div>
            `;
      })
      .join("");
  }

  /**
   * 获取主题类型文本
   */
  private getThemeTypeText(uiTheme: string): string {
    switch (uiTheme) {
      case "vs":
      case "hc-light":
        return this.i18nManager.getMessage("sidebar.light");
      case "vs-dark":
      case "hc-black":
        return this.i18nManager.getMessage("sidebar.dark");
      default:
        return this.i18nManager.getMessage("sidebar.unknown");
    }
  }

  /**
   * 生成WebView的HTML内容
   */
  private _getHtmlForWebview(webview: vscode.Webview): string {
    const isEnabled = this.configManager.isEnabled();
    const followSystem = this.configManager.isFollowSystem();
    const scheduledSwitch = this.configManager.isScheduledSwitchEnabled();
    const lightTheme = this.configManager.getLightTheme();
    const darkTheme = this.configManager.getDarkTheme();
    const allThemes = this.themeManager.getInstalledThemes();
    const lightThemes = this.themeManager.getLightThemes();
    const darkThemes = this.themeManager.getDarkThemes();

    return `<!DOCTYPE html>
        <html lang="zh-CN">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>主题控制面板</title>
            <style>
                body {
                    font-family: var(--vscode-font-family);
                    font-size: var(--vscode-font-size);
                    color: var(--vscode-foreground);
                    background-color: var(--vscode-sideBar-background);
                    margin: 0;
                    padding: 12px;
                    line-height: 1.4;
                }

                .card {
                    background-color: var(--vscode-editor-background);
                    border: 1px solid var(--vscode-panel-border);
                    border-radius: 8px;
                    padding: 16px;
                    margin-bottom: 12px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    transition: all 0.2s ease;
                }

                .card:hover {
                    border-color: var(--vscode-focusBorder);
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
                }

                .card-header {
                    display: flex;
                    align-items: center;
                    margin-bottom: 12px;
                    font-weight: 600;
                    color: var(--vscode-editor-foreground);
                }

                .card-icon {
                    margin-right: 8px;
                    font-size: 16px;
                }

                .card-title {
                    flex: 1;
                    font-size: 14px;
                }

                .card-content {
                    margin-bottom: 12px;
                }

                .card-description {
                    font-size: 12px;
                    color: var(--vscode-descriptionForeground);
                    margin-bottom: 8px;
                }

                .button {
                    background-color: var(--vscode-button-background);
                    color: var(--vscode-button-foreground);
                    border: none;
                    border-radius: 4px;
                    padding: 8px 16px;
                    font-size: 12px;
                    cursor: pointer;
                    transition: background-color 0.2s ease;
                    width: 100%;
                    margin-bottom: 6px;
                }

                .button:hover {
                    background-color: var(--vscode-button-hoverBackground);
                }

                .button:active {
                    background-color: var(--vscode-button-background);
                    transform: translateY(1px);
                }

                .button.secondary {
                    background-color: var(--vscode-button-secondaryBackground);
                    color: var(--vscode-button-secondaryForeground);
                }

                .button.secondary:hover {
                    background-color: var(--vscode-button-secondaryHoverBackground);
                }

                .button.danger {
                    background-color: var(--vscode-errorForeground);
                    color: var(--vscode-editor-background);
                }

                .button.success {
                    background-color: var(--vscode-testing-iconPassed);
                    color: var(--vscode-editor-background);
                }

                .status-badge {
                    display: inline-block;
                    padding: 2px 8px;
                    border-radius: 12px;
                    font-size: 10px;
                    font-weight: 500;
                    margin-left: 8px;
                }

                .status-enabled {
                    background-color: var(--vscode-testing-iconPassed);
                    color: var(--vscode-editor-background);
                }

                .status-disabled {
                    background-color: var(--vscode-errorForeground);
                    color: var(--vscode-editor-background);
                }

                .theme-info {
                    font-size: 11px;
                    color: var(--vscode-descriptionForeground);
                    font-style: italic;
                }

                .time-settings {
                    margin-top: 12px;
                    padding: 12px;
                    background-color: var(--vscode-textBlockQuote-background);
                    border-radius: 6px;
                    border: 1px solid var(--vscode-panel-border);
                }

                .time-input-group {
                    display: flex;
                    align-items: center;
                    margin-bottom: 8px;
                }

                .time-input-group:last-child {
                    margin-bottom: 0;
                }

                .time-input-group label {
                    flex: 1;
                    font-size: 12px;
                    color: var(--vscode-foreground);
                    margin-right: 8px;
                }

                .time-input-group input[type="time"] {
                    background-color: var(--vscode-input-background);
                    color: var(--vscode-input-foreground);
                    border: 1px solid var(--vscode-input-border);
                    border-radius: 4px;
                    padding: 4px 8px;
                    font-size: 12px;
                    width: 80px;
                }

                .time-input-group input[type="time"]:focus {
                    outline: none;
                    border-color: var(--vscode-focusBorder);
                    box-shadow: 0 0 0 1px var(--vscode-focusBorder);
                }

                .button-group {
                    display: flex;
                    gap: 6px;
                }

                .button-group .button {
                    flex: 1;
                    margin-bottom: 0;
                }

                .theme-list {
                    max-height: 200px;
                    overflow-y: auto;
                    border: 1px solid var(--vscode-panel-border);
                    border-radius: 4px;
                    background-color: var(--vscode-input-background);
                }

                .theme-item {
                    border-bottom: 1px solid var(--vscode-panel-border);
                    display: flex;
                    align-items: stretch;
                    font-size: 12px;
                    transition: all 0.2s ease;
                }

                .theme-item:last-child {
                    border-bottom: none;
                }

                .theme-item:hover {
                    background-color: var(--vscode-list-hoverBackground);
                }

                .theme-item.current {
                    background-color: var(--vscode-list-activeSelectionBackground);
                    color: var(--vscode-list-activeSelectionForeground);
                }

                .theme-main {
                    flex: 1;
                    padding: 12px;
                    cursor: pointer;
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }

                .theme-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .theme-name {
                    font-weight: 500;
                    color: var(--vscode-foreground);
                }

                .theme-type {
                    font-size: 10px;
                    padding: 2px 6px;
                    border-radius: 3px;
                    background-color: var(--vscode-badge-background);
                    color: var(--vscode-badge-foreground);
                }

                .theme-badges {
                    display: flex;
                    gap: 4px;
                    flex-wrap: wrap;
                }

                .theme-badge {
                    font-size: 10px;
                    padding: 2px 6px;
                    border-radius: 10px;
                    font-weight: 500;
                }

                .theme-badge.light-badge {
                    background-color: #fef3c7;
                    color: #92400e;
                }

                .theme-badge.dark-badge {
                    background-color: #e5e7eb;
                    color: #374151;
                }

                .theme-badge.current-badge {
                    background-color: var(--vscode-button-background);
                    color: var(--vscode-button-foreground);
                }

                .theme-config {
                    display: flex;
                    flex-direction: column;
                    padding: 8px;
                    gap: 4px;
                    border-left: 1px solid var(--vscode-panel-border);
                    background-color: var(--vscode-sideBar-background);
                }

                .config-btn {
                    background: var(--vscode-button-secondaryBackground);
                    border: 1px solid var(--vscode-panel-border);
                    border-radius: 4px;
                    padding: 6px 8px;
                    cursor: pointer;
                    font-size: 14px;
                    color: var(--vscode-button-secondaryForeground);
                    transition: all 0.2s ease;
                    min-width: 36px;
                    text-align: center;
                }

                .config-btn:hover {
                    background-color: var(--vscode-button-secondaryHoverBackground);
                    border-color: var(--vscode-focusBorder);
                    transform: scale(1.05);
                }

                .config-btn.active {
                    background-color: var(--vscode-button-background);
                    color: var(--vscode-button-foreground);
                    border-color: var(--vscode-button-background);
                    box-shadow: 0 0 0 1px var(--vscode-focusBorder);
                }

                .theme-config-group {
                    margin-bottom: 16px;
                    padding: 12px;
                    border-radius: 6px;
                    background-color: var(--vscode-editor-background);
                    border: 1px solid var(--vscode-panel-border);
                }

                .theme-config-label {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 8px;
                    font-weight: 500;
                    color: var(--vscode-foreground);
                }

                .theme-icon {
                    font-size: 16px;
                }

                .theme-select {
                    width: 100%;
                    padding: 8px 10px;
                    border-radius: 4px;
                    background-color: var(--vscode-input-background);
                    color: var(--vscode-input-foreground);
                    border: 1px solid var(--vscode-input-border, var(--vscode-panel-border));
                    outline: none;
                    margin-bottom: 8px;
                }

                .theme-select:focus {
                    border-color: var(--vscode-focusBorder);
                    outline: 1px solid var(--vscode-focusBorder);
                }

                .current-theme-info {
                    font-size: 12px;
                    color: var(--vscode-descriptionForeground);
                    padding: 4px 0;
                }

                .current-theme-info strong {
                    color: var(--vscode-foreground);
                }

                .theme-tabs {
                    display: flex;
                    margin-bottom: 8px;
                    border-bottom: 1px solid var(--vscode-panel-border);
                }

                .theme-tab {
                    flex: 1;
                    padding: 8px;
                    text-align: center;
                    cursor: pointer;
                    border: none;
                    background: none;
                    color: var(--vscode-foreground);
                    font-size: 12px;
                }

                .theme-tab.active {
                    border-bottom: 2px solid var(--vscode-focusBorder);
                    color: var(--vscode-focusBorder);
                }

                .theme-tab:hover {
                    background-color: var(--vscode-list-hoverBackground);
                }
            </style>
        </head>
        <body>
            <!-- 主要控制卡片 -->
            <div class="card">
                <div class="card-header">
                    <span class="card-icon">🎨</span>
                    <span class="card-title">${this.i18nManager.getMessage(
                      "sidebar.themeControl"
                    )}</span>
                    <span class="status-badge ${
                      isEnabled ? "status-enabled" : "status-disabled"
                    }">
                        ${
                          isEnabled
                            ? this.i18nManager.getMessage("sidebar.enabled")
                            : this.i18nManager.getMessage("sidebar.disabled")
                        }
                    </span>
                </div>
                <div class="card-content">
                    <div class="card-description">
                        ${
                          isEnabled
                            ? this.i18nManager.getMessage(
                                "sidebar.autoSwitchEnabled"
                              )
                            : this.i18nManager.getMessage(
                                "sidebar.autoSwitchDisabled"
                              )
                        }
                    </div>
                    <button class="button" onclick="toggleTheme()">
                        ${this.i18nManager.getMessage("sidebar.toggleTheme")}
                    </button>
                    ${
                      isEnabled
                        ? `<button class="button danger" onclick="disableAutoSwitch()">${this.i18nManager.getMessage(
                            "sidebar.disableAutoSwitch"
                          )}</button>`
                        : `<button class="button success" onclick="enableAutoSwitch()">${this.i18nManager.getMessage(
                            "sidebar.enableAutoSwitch"
                          )}</button>`
                    }
                </div>
            </div>

            <!-- 模式选择卡片 -->
            <div class="card">
                <div class="card-header">
                    <span class="card-icon">⚙️</span>
                    <span class="card-title">${this.i18nManager.getMessage(
                      "sidebar.switchMode"
                    )}</span>
                </div>
                <div class="card-content">
                    <div class="card-description">
                        ${this.i18nManager.getMessage(
                          "sidebar.selectSwitchMode"
                        )}
                    </div>
                    <button class="button ${
                      followSystem ? "danger" : "success"
                    }" onclick="toggleFollowSystem()">
                        ${
                          followSystem
                            ? this.i18nManager.getMessage(
                                "sidebar.disableFollowSystem"
                              )
                            : this.i18nManager.getMessage(
                                "sidebar.enableFollowSystem"
                              )
                        }
                    </button>
                    <button class="button ${
                      scheduledSwitch ? "danger" : "success"
                    }" onclick="toggleScheduledSwitch()">
                        ${
                          scheduledSwitch
                            ? this.i18nManager.getMessage(
                                "sidebar.disableScheduledSwitch"
                              )
                            : this.i18nManager.getMessage(
                                "sidebar.enableScheduledSwitch"
                              )
                        }
                    </button>
                    ${
                      scheduledSwitch
                        ? `
                    <div class="time-settings">
                        <div class="time-input-group">
                            <label>☀️ ${this.i18nManager.getMessage(
                              "time.lightThemeTime"
                            )}:</label>
                            <input type="time" id="lightTime" value="${this.configManager.getLightStartTime()}" onchange="updateLightTime()">
                        </div>
                        <div class="time-input-group">
                            <label>🌙 ${this.i18nManager.getMessage(
                              "time.darkThemeTime"
                            )}:</label>
                            <input type="time" id="darkTime" value="${this.configManager.getDarkStartTime()}" onchange="updateDarkTime()">
                        </div>
                    </div>`
                        : ""
                    }
                </div>
            </div>

            <!-- 快速切换卡片 -->
            <div class="card">
                <div class="card-header">
                    <span class="card-icon">🌓</span>
                    <span class="card-title">${this.i18nManager.getMessage(
                      "sidebar.quickSwitch"
                    )}</span>
                </div>
                <div class="card-content">
                    <div class="card-description">
                        ${this.i18nManager.getMessage(
                          "sidebar.switchToSpecificTheme"
                        )}
                    </div>
                    <div class="button-group">
                        <button class="button secondary" onclick="switchToLight()">
                            ${this.i18nManager.getMessage("sidebar.lightTheme")}
                        </button>
                        <button class="button secondary" onclick="switchToDark()">
                            ${this.i18nManager.getMessage("sidebar.darkTheme")}
                        </button>
                    </div>
                    <div class="theme-info">
                        ${this.i18nManager.getMessage(
                          "sidebar.lightThemeLabel"
                        )}: ${lightTheme}<br>
                        ${this.i18nManager.getMessage(
                          "sidebar.darkThemeLabel"
                        )}: ${darkTheme}
                    </div>
                </div>
            </div>

            <!-- 主题配置卡片 -->
            <div class="card">
                <div class="card-header">
                    <span class="card-icon">🎨</span>
                    <span class="card-title">${this.i18nManager.getMessage(
                      "sidebar.themeConfiguration"
                    )}</span>
                </div>
                <div class="card-content">
                    <div class="card-description">
                        ${this.i18nManager.getMessage(
                          "sidebar.configureThemePreferences"
                        )}
                    </div>
                    
                    <!-- 浅色主题配置 -->
                    <div class="theme-config-group">
                        <label class="theme-config-label">
                            <span class="theme-icon">☀️</span>
                            ${this.i18nManager.getMessage("sidebar.lightThemeConfig")}
                        </label>
                        <select class="theme-select" id="lightThemeSelect" onchange="onLightThemeChange()">
                            <option value="">${this.i18nManager.getMessage("sidebar.selectTheme")}</option>
                            ${this.generateThemeOptions(lightThemes, lightTheme)}
                        </select>
                        <div class="current-theme-info">
                            ${this.i18nManager.getMessage("sidebar.currentSelection")}: <strong>${lightTheme}</strong>
                        </div>
                    </div>
                    
                    <!-- 深色主题配置 -->
                    <div class="theme-config-group">
                        <label class="theme-config-label">
                            <span class="theme-icon">🌙</span>
                            ${this.i18nManager.getMessage("sidebar.darkThemeConfig")}
                        </label>
                        <select class="theme-select" id="darkThemeSelect" onchange="onDarkThemeChange()">
                            <option value="">${this.i18nManager.getMessage("sidebar.selectTheme")}</option>
                            ${this.generateThemeOptions(darkThemes, darkTheme)}
                        </select>
                        <div class="current-theme-info">
                            ${this.i18nManager.getMessage("sidebar.currentSelection")}: <strong>${darkTheme}</strong>
                        </div>
                    </div>
                </div>
            </div>

            <script>
                const vscode = acquireVsCodeApi();

                function toggleTheme() {
                    vscode.postMessage({ command: 'toggleTheme' });
                }

                function enableAutoSwitch() {
                    vscode.postMessage({ command: 'enableAutoSwitch' });
                }

                function disableAutoSwitch() {
                    vscode.postMessage({ command: 'disableAutoSwitch' });
                }

                function toggleFollowSystem() {
                    vscode.postMessage({ command: 'toggleFollowSystem' });
                }

                function toggleScheduledSwitch() {
                    vscode.postMessage({ command: 'toggleScheduledSwitch' });
                }

                function switchToLight() {
                    vscode.postMessage({ command: 'switchToLight' });
                }

                function switchToDark() {
                    vscode.postMessage({ command: 'switchToDark' });
                }

                function updateLightTime() {
                    const lightTime = document.getElementById('lightTime').value;
                    vscode.postMessage({ command: 'updateLightTime', time: lightTime });
                }

                function updateDarkTime() {
                    const darkTime = document.getElementById('darkTime').value;
                    vscode.postMessage({ command: 'updateDarkTime', time: darkTime });
                }

                function selectTheme(themeLabel) {
                    vscode.postMessage({ command: 'setTheme', themeLabel: themeLabel });
                }

                function setLightTheme(themeLabel) {
                    vscode.postMessage({ command: 'setLightTheme', themeLabel: themeLabel });
                }

                function setDarkTheme(themeLabel) {
                    vscode.postMessage({ command: 'setDarkTheme', themeLabel: themeLabel });
                }

                function onLightThemeChange() {
                    const select = document.getElementById('lightThemeSelect');
                    const selectedTheme = select.value;
                    if (selectedTheme) {
                        // 检查当前主题类型，只有在浅色模式下才立即切换
                        const currentTheme = '${this.themeManager.getCurrentThemeName()}';
                        const currentThemeType = getCurrentThemeType(currentTheme);
                        
                        vscode.postMessage({ 
                            command: 'setLightTheme', 
                            themeLabel: selectedTheme,
                            shouldSwitch: currentThemeType === 'light'
                        });
                    }
                }

                function onDarkThemeChange() {
                    const select = document.getElementById('darkThemeSelect');
                    const selectedTheme = select.value;
                    if (selectedTheme) {
                        // 检查当前主题类型，只有在深色模式下才立即切换
                        const currentTheme = '${this.themeManager.getCurrentThemeName()}';
                        const currentThemeType = getCurrentThemeType(currentTheme);
                        
                        vscode.postMessage({ 
                            command: 'setDarkTheme', 
                            themeLabel: selectedTheme,
                            shouldSwitch: currentThemeType === 'dark'
                        });
                    }
                }

                // 获取当前主题类型的辅助函数
                function getCurrentThemeType(themeName) {
                    const allThemes = ${JSON.stringify(allThemes).replace(/\\/g, "\\\\").replace(/'/g, "\\\'")};
                    const theme = allThemes.find(t => t.label === themeName);
                    if (!theme) return 'unknown';
                    
                    switch (theme.uiTheme) {
                        case 'vs':
                        case 'hc-light':
                            return 'light';
                        case 'vs-dark':
                        case 'hc-black':
                            return 'dark';
                        default:
                            return 'unknown';
                    }
                }

                function getThemeTypeText(uiTheme) {
                     switch (uiTheme) {
                         case 'vs':
                         case 'hc-light':
                             return '${this.i18nManager.getMessage(
                               "sidebar.lightType"
                             )}';
                         case 'vs-dark':
                         case 'hc-black':
                             return '${this.i18nManager.getMessage(
                               "sidebar.darkType"
                             )}';
                         default:
                              return '${this.i18nManager.getMessage(
                                "sidebar.unknownType"
                              )}';
                      }
                  }

                 // 主题配置界面已加载
             </script>
         </body>
        </html>`;
  }
}

/**
 * 侧边栏管理器
 */
export class SidebarManager {
  private statusProvider: ThemeStatusProvider;
  private controlsProvider: ThemeControlsProvider;

  constructor(
    private configManager: ConfigManager,
    private themeManager: ThemeManager,
    private systemThemeDetector: SystemThemeDetector,
    private scheduleManager: ScheduleManager,
    private i18nManager: I18nManager,
    private extensionUri: vscode.Uri
  ) {
    this.statusProvider = new ThemeStatusProvider(
      configManager,
      themeManager,
      systemThemeDetector,
      scheduleManager,
      i18nManager
    );

    this.controlsProvider = new ThemeControlsProvider(
      configManager,
      themeManager,
      i18nManager,
      extensionUri
    );
  }

  /**
   * 注册侧边栏视图
   */
  register(context: vscode.ExtensionContext): void {
    // 注册状态视图
    const statusView = vscode.window.createTreeView("autoThemeStatus", {
      treeDataProvider: this.statusProvider,
      showCollapseAll: false,
    });

    // 注册控制面板WebView视图
    const controlsViewProvider = vscode.window.registerWebviewViewProvider(
      ThemeControlsProvider.viewType,
      this.controlsProvider
    );

    // 注册刷新命令
    const refreshCommand = vscode.commands.registerCommand(
      "autoTheme.refreshSidebar",
      () => {
        this.refresh();
      }
    );

    context.subscriptions.push(
      statusView,
      controlsViewProvider,
      refreshCommand
    );
  }

  /**
   * 刷新所有视图
   */
  refresh(): void {
    this.statusProvider.refresh();
    this.controlsProvider.refresh();
  }

  /**
   * 获取状态提供者
   */
  getStatusProvider(): ThemeStatusProvider {
    return this.statusProvider;
  }

  /**
   * 获取控制面板提供者
   */
  getControlsProvider(): ThemeControlsProvider {
    return this.controlsProvider;
  }
}
