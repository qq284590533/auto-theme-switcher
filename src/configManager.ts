import * as vscode from 'vscode';

/**
 * 配置管理器 - 负责管理插件的所有配置选项
 */
export class ConfigManager {
    private readonly configSection = 'autoTheme';

    /**
     * 获取配置对象
     */
    private getConfig(): vscode.WorkspaceConfiguration {
        return vscode.workspace.getConfiguration(this.configSection);
    }

    /**
     * 检查是否启用自动切换
     */
    isEnabled(): boolean {
        return this.getConfig().get('enabled', false);
    }

    /**
     * 设置是否启用自动切换
     */
    async setEnabled(enabled: boolean): Promise<void> {
        await this.getConfig().update('enabled', enabled, vscode.ConfigurationTarget.Global);
    }

    /**
     * 设置是否跟随系统主题（会自动禁用定时切换）
     */
    async setFollowSystem(followSystem: boolean): Promise<void> {
        await this.getConfig().update('followSystem', followSystem, vscode.ConfigurationTarget.Global);
        if (followSystem) {
            // 启用跟随系统时，自动禁用定时切换
            await this.getConfig().update('scheduledSwitch', false, vscode.ConfigurationTarget.Global);
        }
    }

    /**
     * 设置是否启用定时切换（会自动禁用跟随系统）
     */
    async setScheduledSwitch(enabled: boolean): Promise<void> {
        await this.getConfig().update('scheduledSwitch', enabled, vscode.ConfigurationTarget.Global);
        if (enabled) {
            // 启用定时切换时，自动禁用跟随系统
            await this.getConfig().update('followSystem', false, vscode.ConfigurationTarget.Global);
        }
    }

    /**
     * 检查是否跟随系统主题
     */
    shouldFollowSystem(): boolean {
        return this.getConfig().get('followSystem', true);
    }

    /**
     * 检查是否跟随系统主题（别名方法）
     */
    isFollowSystem(): boolean {
        return this.shouldFollowSystem();
    }

    /**
     * 获取浅色主题名称
     */
    getLightTheme(): string {
        return this.getConfig().get('lightTheme', 'Default Light+');
    }

    /**
     * 获取深色主题名称
     */
    getDarkTheme(): string {
        return this.getConfig().get('darkTheme', 'Default Dark+');
    }

    /**
     * 检查是否启用定时切换
     */
    isScheduledSwitchEnabled(): boolean {
        return this.getConfig().get('scheduledSwitch', false);
    }

    /**
     * 获取浅色主题开始时间
     */
    getLightStartTime(): string {
        return this.getConfig().get('lightStartTime', '06:00');
    }

    /**
     * 获取深色主题开始时间
     */
    getDarkStartTime(): string {
        return this.getConfig().get('darkStartTime', '18:00');
    }

    /**
     * 设置浅色主题开始时间
     */
    async setLightStartTime(time: string): Promise<void> {
        // 验证时间格式
        if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
            throw new Error('Invalid time format. Expected HH:MM');
        }
        await this.getConfig().update('lightStartTime', time, vscode.ConfigurationTarget.Global);
    }

    /**
     * 设置深色主题开始时间
     */
    async setDarkStartTime(time: string): Promise<void> {
        // 验证时间格式
        if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
            throw new Error('Invalid time format. Expected HH:MM');
        }
        await this.getConfig().update('darkStartTime', time, vscode.ConfigurationTarget.Global);
    }

    /**
     * 解析时间字符串为小时和分钟
     */
    parseTime(timeString: string): { hours: number; minutes: number } {
        const [hours, minutes] = timeString.split(':').map(Number);
        return { hours: hours || 0, minutes: minutes || 0 };
    }

    /**
     * 检查当前时间是否应该使用浅色主题
     */
    shouldUseLightTheme(): boolean {
        if (!this.isScheduledSwitchEnabled()) {
            return true; // 默认返回浅色主题
        }

        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentTime = currentHour * 60 + currentMinute;

        const lightTime = this.parseTime(this.getLightStartTime());
        const darkTime = this.parseTime(this.getDarkStartTime());
        
        const lightStartMinutes = lightTime.hours * 60 + lightTime.minutes;
        const darkStartMinutes = darkTime.hours * 60 + darkTime.minutes;

        // 如果浅色时间小于深色时间（正常情况，如 6:00 到 18:00）
        if (lightStartMinutes < darkStartMinutes) {
            return currentTime >= lightStartMinutes && currentTime < darkStartMinutes;
        } else {
            // 如果浅色时间大于深色时间（跨天情况，如 18:00 到 6:00）
            return currentTime >= lightStartMinutes || currentTime < darkStartMinutes;
        }
    }

    /**
     * 获取下次切换时间（分钟数）
     */
    getNextSwitchTime(): number {
        if (!this.isScheduledSwitchEnabled()) {
            return -1;
        }

        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();
        
        const lightTime = this.parseTime(this.getLightStartTime());
        const darkTime = this.parseTime(this.getDarkStartTime());
        
        const lightStartMinutes = lightTime.hours * 60 + lightTime.minutes;
        const darkStartMinutes = darkTime.hours * 60 + darkTime.minutes;

        // 计算到下次切换的时间
        let nextSwitchTime: number;
        
        if (this.shouldUseLightTheme()) {
            // 当前是浅色主题时间，下次切换到深色
            if (darkStartMinutes > currentTime) {
                nextSwitchTime = darkStartMinutes - currentTime;
            } else {
                nextSwitchTime = (24 * 60) - currentTime + darkStartMinutes;
            }
        } else {
            // 当前是深色主题时间，下次切换到浅色
            if (lightStartMinutes > currentTime) {
                nextSwitchTime = lightStartMinutes - currentTime;
            } else {
                nextSwitchTime = (24 * 60) - currentTime + lightStartMinutes;
            }
        }

        return nextSwitchTime;
    }

    /**
     * 设置浅色主题
     */
    async setLightTheme(themeName: string): Promise<void> {
        await this.getConfig().update('lightTheme', themeName, vscode.ConfigurationTarget.Global);
    }

    /**
     * 设置深色主题
     */
    async setDarkTheme(themeName: string): Promise<void> {
        await this.getConfig().update('darkTheme', themeName, vscode.ConfigurationTarget.Global);
    }

    /**
     * 获取所有配置的摘要
     */
    getConfigSummary(): string {
        return `启用: ${this.isEnabled()}, 跟随系统: ${this.shouldFollowSystem()}, 定时切换: ${this.isScheduledSwitchEnabled()}, 浅色主题: ${this.getLightTheme()}, 深色主题: ${this.getDarkTheme()}`;
    }
}