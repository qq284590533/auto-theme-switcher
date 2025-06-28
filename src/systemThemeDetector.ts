import * as vscode from 'vscode';
import { ThemeManager } from './themeManager';
import { ConfigManager } from './configManager';
import { I18nManager } from './i18n';

/**
 * 系统主题检测器 - 负责检测系统主题变化并自动切换VSCode主题
 */
export class SystemThemeDetector {
    private isRunning: boolean = false;
    private checkInterval: NodeJS.Timeout | undefined;
    private lastSystemTheme: 'light' | 'dark' | 'unknown' = 'unknown';
    private readonly checkIntervalMs = 5000; // 每5秒检查一次

    constructor(
        private themeManager: ThemeManager,
        private configManager: ConfigManager,
        private i18nManager: I18nManager
    ) {}

    /**
     * 启动系统主题检测
     */
    start(): void {
        if (this.isRunning) {
            return;
        }

        console.log(this.i18nManager.getMessage('system.detectionStarted'));
        this.isRunning = true;
        
        // 立即检查一次
        this.checkSystemTheme();
        
        // 设置定时检查
        this.checkInterval = setInterval(() => {
            this.checkSystemTheme();
        }, this.checkIntervalMs);
    }

    /**
     * 停止系统主题检测
     */
    stop(): void {
        if (!this.isRunning) {
            return;
        }

        console.log(this.i18nManager.getMessage('system.detectionStopped'));
        this.isRunning = false;
        
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = undefined;
        }
    }

    /**
     * 检查系统主题
     */
    private async checkSystemTheme(): Promise<void> {
        try {
            const systemTheme = await this.detectSystemTheme();
            
            if (systemTheme !== this.lastSystemTheme && systemTheme !== 'unknown') {
                console.log(`系统主题变化: ${this.lastSystemTheme} -> ${systemTheme}`);
                this.lastSystemTheme = systemTheme;
                await this.applyThemeBasedOnSystem(systemTheme);
            }
        } catch (error) {
            console.error(this.i18nManager.getMessage('error.systemThemeDetectionFailed', String(error)));
        }
    }

    /**
     * 检测系统主题（Windows特定实现）
     */
    private async detectSystemTheme(): Promise<'light' | 'dark' | 'unknown'> {
        try {
            // 在Windows上，我们可以通过注册表检测系统主题
            // 这里使用VSCode的API来检测
            const config = vscode.workspace.getConfiguration();
            const autoDetectColorScheme = config.get('window.autoDetectColorScheme', false);
            
            if (autoDetectColorScheme) {
                // 如果VSCode已经启用了自动检测，我们可以通过当前主题来推断
                const currentTheme = config.get('workbench.colorTheme', '');
                return this.inferThemeTypeFromName(currentTheme);
            }

            // 尝试通过Windows API检测（需要额外的实现）
            return await this.detectWindowsSystemTheme();
        } catch (error) {
            console.error('Failed to detect system theme:', error);
            return 'unknown';
        }
    }

    /**
     * 通过主题名称推断主题类型
     */
    private inferThemeTypeFromName(themeName: string): 'light' | 'dark' | 'unknown' {
        const lowerName = themeName.toLowerCase();
        
        if (lowerName.includes('light') || lowerName.includes('bright')) {
            return 'light';
        } else if (lowerName.includes('dark') || lowerName.includes('black')) {
            return 'dark';
        }
        
        return 'unknown';
    }

    /**
     * 检测Windows系统主题
     */
    private async detectWindowsSystemTheme(): Promise<'light' | 'dark' | 'unknown'> {
        try {
            // 使用child_process执行PowerShell命令来检测Windows主题
            const { exec } = require('child_process');
            
            return new Promise((resolve) => {
                const command = 'powershell -Command "Get-ItemProperty -Path HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize -Name AppsUseLightTheme"';
                
                exec(command, (error: any, stdout: string, stderr: string) => {
                    if (error) {
                        console.error('Failed to execute PowerShell command:', error);
                        resolve('unknown');
                        return;
                    }
                    
                    try {
                        // 解析输出
                        const output = stdout.trim();
                        if (output.includes('AppsUseLightTheme') && output.includes(': 1')) {
                            resolve('light');
                        } else if (output.includes('AppsUseLightTheme') && output.includes(': 0')) {
                            resolve('dark');
                        } else {
                            resolve('unknown');
                        }
                    } catch (parseError) {
                        console.error('Failed to parse PowerShell output:', parseError);
                        resolve('unknown');
                    }
                });
            });
        } catch (error) {
            console.error('Failed to detect Windows system theme:', error);
            return 'unknown';
        }
    }

    /**
     * 根据系统主题应用VSCode主题
     */
    private async applyThemeBasedOnSystem(systemTheme: 'light' | 'dark'): Promise<void> {
        try {
            if (systemTheme === 'light') {
                await this.themeManager.switchToLight();
                vscode.window.showInformationMessage(this.i18nManager.getMessage('system.switchedToLight'));
            } else if (systemTheme === 'dark') {
                await this.themeManager.switchToDark();
                vscode.window.showInformationMessage(this.i18nManager.getMessage('system.switchedToDark'));
            }
        } catch (error) {
            console.error(this.i18nManager.getMessage('error.applySystemThemeFailed', String(error)));
            vscode.window.showErrorMessage(this.i18nManager.getMessage('error.applySystemThemeFailed', String(error)));
        }
    }

    /**
     * 获取当前检测状态
     */
    getStatus(): { isRunning: boolean; lastSystemTheme: string } {
        return {
            isRunning: this.isRunning,
            lastSystemTheme: this.lastSystemTheme
        };
    }

    /**
     * 手动触发一次系统主题检测
     */
    async triggerCheck(): Promise<void> {
        if (this.isRunning) {
            await this.checkSystemTheme();
        }
    }
}