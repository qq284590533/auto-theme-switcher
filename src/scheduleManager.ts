import * as vscode from 'vscode';
import { ThemeManager } from './themeManager';
import { ConfigManager } from './configManager';
import { I18nManager } from './i18n';

/**
 * 定时管理器 - 负责根据用户设置的时间自动切换主题
 */
export class ScheduleManager {
    private isRunning: boolean = false;
    private checkInterval: NodeJS.Timeout | undefined;
    private nextSwitchTimeout: NodeJS.Timeout | undefined;
    private readonly checkIntervalMs = 60000; // 每分钟检查一次

    constructor(
        private themeManager: ThemeManager,
        private configManager: ConfigManager,
        private i18nManager: I18nManager
    ) {}

    /**
     * 启动定时切换
     */
    start(): void {
        if (this.isRunning) {
            return;
        }

        console.log(this.i18nManager.getMessage('system.scheduleStarted'));
        this.isRunning = true;
        
        // 立即检查并应用当前应该使用的主题
        this.checkAndApplyCurrentTheme();
        
        // 设置下次切换的定时器
        this.scheduleNextSwitch();
        
        // 设置定期检查（防止定时器失效）
        this.checkInterval = setInterval(() => {
            this.checkAndApplyCurrentTheme();
            this.scheduleNextSwitch();
        }, this.checkIntervalMs);
    }

    /**
     * 停止定时切换
     */
    stop(): void {
        if (!this.isRunning) {
            return;
        }

        console.log(this.i18nManager.getMessage('system.scheduleStopped'));
        this.isRunning = false;
        
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = undefined;
        }
        
        if (this.nextSwitchTimeout) {
            clearTimeout(this.nextSwitchTimeout);
            this.nextSwitchTimeout = undefined;
        }
    }

    /**
     * 检查并应用当前应该使用的主题
     */
    private async checkAndApplyCurrentTheme(): Promise<void> {
        try {
            const shouldUseLightTheme = this.configManager.shouldUseLightTheme();
            
            if (shouldUseLightTheme) {
                if (!this.themeManager.isLightTheme()) {
                    await this.themeManager.switchToLight();
                    this.showSwitchNotification(this.i18nManager.getMessage('notification.lightTheme'), this.i18nManager.getMessage('notification.scheduledSwitch'));
                }
            } else {
                if (!this.themeManager.isDarkTheme()) {
                    await this.themeManager.switchToDark();
                    this.showSwitchNotification(this.i18nManager.getMessage('notification.darkTheme'), this.i18nManager.getMessage('notification.scheduledSwitch'));
                }
            }
        } catch (error) {
            console.error(this.i18nManager.getMessage('error.applyScheduledThemeFailed', String(error)));
            vscode.window.showErrorMessage(this.i18nManager.getMessage('error.scheduledSwitchFailed', String(error)));
        }
    }

    /**
     * 安排下次切换
     */
    private scheduleNextSwitch(): void {
        // 清除现有的定时器
        if (this.nextSwitchTimeout) {
            clearTimeout(this.nextSwitchTimeout);
            this.nextSwitchTimeout = undefined;
        }

        const nextSwitchMinutes = this.configManager.getNextSwitchTime();
        
        if (nextSwitchMinutes <= 0) {
            return;
        }

        const nextSwitchMs = nextSwitchMinutes * 60 * 1000;
        
        console.log(this.i18nManager.getMessage('time.nextSwitchIn', nextSwitchMinutes.toString()));
        
        this.nextSwitchTimeout = setTimeout(() => {
            this.performScheduledSwitch();
        }, nextSwitchMs);
    }

    /**
     * 执行定时切换
     */
    private async performScheduledSwitch(): Promise<void> {
        try {
            const shouldUseLightTheme = this.configManager.shouldUseLightTheme();
            
            if (shouldUseLightTheme) {
                await this.themeManager.switchToLight();
                this.showSwitchNotification(this.i18nManager.getMessage('notification.lightTheme'), this.i18nManager.getMessage('notification.scheduledSwitch'));
            } else {
                await this.themeManager.switchToDark();
                this.showSwitchNotification(this.i18nManager.getMessage('notification.darkTheme'), this.i18nManager.getMessage('notification.scheduledSwitch'));
            }
            
            // 安排下次切换
            this.scheduleNextSwitch();
        } catch (error) {
            console.error(this.i18nManager.getMessage('error.executeScheduledSwitchFailed', String(error)));
            vscode.window.showErrorMessage(this.i18nManager.getMessage('error.scheduledSwitchFailed', String(error)));
        }
    }

    /**
     * 显示切换通知
     */
    private showSwitchNotification(themeName: string, reason: string): void {
        const message = this.i18nManager.getMessage('notification.switchedTo', themeName, reason);
        vscode.window.showInformationMessage(message);
        console.log(message);
    }

    /**
     * 获取下次切换时间的可读格式
     */
    getNextSwitchTimeFormatted(): string {
        const nextSwitchMinutes = this.configManager.getNextSwitchTime();
        
        if (nextSwitchMinutes <= 0) {
            return this.i18nManager.getMessage('time.notScheduled');
        }
        
        const hours = Math.floor(nextSwitchMinutes / 60);
        const minutes = nextSwitchMinutes % 60;
        
        if (hours > 0) {
            return this.i18nManager.getMessage('time.hoursMinutes', hours.toString(), minutes.toString());
        } else {
            return this.i18nManager.getMessage('time.minutesOnly', minutes.toString());
        }
    }

    /**
     * 获取当前状态
     */
    getStatus(): {
        isRunning: boolean;
        nextSwitchTime: string;
        currentThemeType: string;
    } {
        const shouldUseLightTheme = this.configManager.shouldUseLightTheme();
        
        return {
            isRunning: this.isRunning,
            nextSwitchTime: this.getNextSwitchTimeFormatted(),
            currentThemeType: shouldUseLightTheme ? this.i18nManager.getMessage('time.lightThemeTime') : this.i18nManager.getMessage('time.darkThemeTime')
        };
    }

    /**
     * 手动触发一次检查
     */
    async triggerCheck(): Promise<void> {
        if (this.isRunning) {
            await this.checkAndApplyCurrentTheme();
            this.scheduleNextSwitch();
        }
    }

    /**
     * 重新启动（用于配置更改后）
     */
    restart(): void {
        if (this.isRunning) {
            this.stop();
            this.start();
        }
    }
}