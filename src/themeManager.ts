import * as vscode from "vscode";
import { ConfigManager } from "./configManager";
import { I18nManager } from "./i18n";

/**
 * 主题管理器 - 负责主题的切换和管理
 */
export class ThemeManager {
  private currentTheme: string = "";
  private onManualSwitchCallback?: () => void;
  private i18nManager: I18nManager;

  constructor(private configManager: ConfigManager) {
    this.currentTheme = this.getCurrentTheme();
    this.i18nManager = I18nManager.getInstance();
  }

  /**
   * 设置手动切换主题时的回调函数
   * @param callback 当手动切换主题时调用的回调函数
   */
  setOnManualSwitchCallback(callback: () => void): void {
    this.onManualSwitchCallback = callback;
  }

  /**
   * 获取当前主题
   */
  private getCurrentTheme(): string {
    const config = vscode.workspace.getConfiguration();
    return config.get("workbench.colorTheme", "");
  }

  /**
   * 设置主题
   * @param themeName 主题名称
   * @param isManualSwitch 是否为手动切换（默认为false）
   */
  private async setTheme(
    themeName: string,
    isManualSwitch: boolean = false
  ): Promise<void> {
    try {
      const config = vscode.workspace.getConfiguration();
      await config.update(
        "workbench.colorTheme",
        themeName,
        vscode.ConfigurationTarget.Global
      );
      this.currentTheme = themeName;
      console.log(`Theme switched to: ${themeName}`);

      // 如果是手动切换，触发回调以禁用自动切换
      if (isManualSwitch && this.onManualSwitchCallback) {
        this.onManualSwitchCallback();
      }
    } catch (error) {
      console.error("Failed to switch theme:", error);
      vscode.window.showErrorMessage(this.i18nManager.getMessage('error.switchThemeFailed', String(error)));
    }
  }

  /**
   * 切换到浅色主题
   * @param isManualSwitch 是否为手动切换（默认为false）
   */
  async switchToLight(isManualSwitch: boolean = false): Promise<void> {
    const lightTheme = this.configManager.getLightTheme();
    if (this.currentTheme !== lightTheme) {
      await this.setTheme(lightTheme, isManualSwitch);
    }
  }

  /**
   * 切换到深色主题
   * @param isManualSwitch 是否为手动切换（默认为false）
   */
  async switchToDark(isManualSwitch: boolean = false): Promise<void> {
    const darkTheme = this.configManager.getDarkTheme();
    if (this.currentTheme !== darkTheme) {
      await this.setTheme(darkTheme, isManualSwitch);
    }
  }

  /**
   * 一键切换主题（在浅色和深色之间切换）
   * @param isManualSwitch 是否为手动切换（默认为true，因为这通常是用户主动操作）
   */
  async toggleTheme(isManualSwitch: boolean = true): Promise<void> {
    const lightTheme = this.configManager.getLightTheme();
    const darkTheme = this.configManager.getDarkTheme();

    if (this.currentTheme === lightTheme) {
      await this.switchToDark(isManualSwitch);
    } else {
      await this.switchToLight(isManualSwitch);
    }
  }

  /**
   * 检查当前是否为浅色主题
   */
  isLightTheme(): boolean {
    return this.currentTheme === this.configManager.getLightTheme();
  }

  /**
   * 检查当前是否为深色主题
   */
  isDarkTheme(): boolean {
    return this.currentTheme === this.configManager.getDarkTheme();
  }

  /**
   * 获取当前主题名称
   */
  getCurrentThemeName(): string {
    return this.currentTheme;
  }

  /**
   * 刷新当前主题状态
   */
  refreshCurrentTheme(): void {
    this.currentTheme = this.getCurrentTheme();
  }

  /**
   * 获取所有已安装的主题
   * @returns 包含主题信息的数组
   */
  getInstalledThemes(): Array<{
    id: string;
    label: string;
    uiTheme: string;
    extensionId: string;
    isBuiltIn: boolean;
  }> {
    const themes: Array<{
      id: string;
      label: string;
      uiTheme: string;
      extensionId: string;
      isBuiltIn: boolean;
    }> = [];

    // 遍历所有已安装的扩展
    vscode.extensions.all.forEach((extension) => {
      const packageJSON = extension.packageJSON;

      // 检查扩展是否贡献了主题
      if (packageJSON.contributes && packageJSON.contributes.themes) {
        const contributedThemes = packageJSON.contributes.themes;

        contributedThemes.forEach((theme: any) => {
          themes.push({
            id: theme.id || theme.label,
            label: theme.label,
            uiTheme: theme.uiTheme || "vs-dark", // 默认为深色主题
            extensionId: extension.id,
            isBuiltIn: extension.packageJSON.isBuiltin || false,
          });
        });
      }
    });

    // 按主题名称排序
    return themes.sort((a, b) => a.label.localeCompare(b.label));
  }

  /**
   * 获取浅色主题列表
   * @returns 浅色主题数组
   */
  getLightThemes(): Array<{
    id: string;
    label: string;
    uiTheme: string;
    extensionId: string;
    isBuiltIn: boolean;
  }> {
    return this.getInstalledThemes().filter(
      (theme) => theme.uiTheme === "vs" || theme.uiTheme === "hc-light"
    );
  }

  /**
   * 获取深色主题列表
   * @returns 深色主题数组
   */
  getDarkThemes(): Array<{
    id: string;
    label: string;
    uiTheme: string;
    extensionId: string;
    isBuiltIn: boolean;
  }> {
    return this.getInstalledThemes().filter(
      (theme) => theme.uiTheme === "vs-dark" || theme.uiTheme === "hc-black"
    );
  }

  /**
   * 根据主题名称设置主题
   * @param themeLabel 主题显示名称
   * @param isManualSwitch 是否为手动切换
   */
  async setThemeByLabel(
    themeLabel: string,
    isManualSwitch: boolean = false
  ): Promise<void> {
    const allThemes = this.getInstalledThemes();
    const targetTheme = allThemes.find((theme) => theme.label === themeLabel);

    if (targetTheme) {
      await this.setTheme(targetTheme.label, isManualSwitch);
    } else {
      vscode.window.showErrorMessage(this.i18nManager.getMessage('error.themeNotFound', themeLabel));
    }
  }
}
