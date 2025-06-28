# 安装说明

## VS Code 插件打包完成

✅ **插件已成功打包为 VSIX 文件**

- 文件名：`auto-theme-switcher-1.0.0.vsix`
- 文件大小：39.9 KB
- 包含文件：21 个文件

## 安装方式

### 方式一：通过 VS Code 安装

1. 打开 VS Code
2. 按 `Ctrl+Shift+P` 打开命令面板
3. 输入 "Extensions: Install from VSIX..."
4. 选择 `auto-theme-switcher-1.0.0.vsix` 文件
5. 重启 VS Code

### 方式二：通过命令行安装

```bash
code --install-extension auto-theme-switcher-1.0.0.vsix
```

## 发布到市场

如需发布到 VS Code 插件市场，请执行：

```bash
vsce publish
```

**注意**：发布前需要：
1. 注册 Azure DevOps 账户
2. 创建个人访问令牌
3. 使用 `vsce login <publisher-name>` 登录

## 插件功能

- ✅ 自动主题切换
- ✅ 系统主题跟随
- ✅ 定时切换
- ✅ 手动切换
- ✅ 侧边栏控制面板
- ✅ 多语言支持（中文/英文）

## 市场页面配置

### 详情页面
- 基本信息：来自 `package.json`
- 详细说明：来自 `README.md`
- 国际化：`package.nls.json` 和 `package.nls.zh-cn.json`

### 功能页面
- 命令列表：9 个注册命令
- 配置项：7 个可配置选项
- 视图容器：专用侧边栏面板

### 更改日志页面
- 版本历史：来自 `CHANGELOG.md`
- 功能更新记录
- 版本发布说明