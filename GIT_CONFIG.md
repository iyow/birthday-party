# Git 提交者配置说明

## 如何让提交显示为特定作者？

要让 GitHub 上的提交显示为"海绵宝宝"或其他名字，需要配置 Git 的用户信息。

### 方式一：全局配置（影响所有仓库）

```bash
git config --global user.name "海绵宝宝 (SpongeBob)"
git config --global user.email "spongebob@bikinibottom.com"
```

### 方式二：单仓库配置（仅影响当前仓库）✅ 当前使用

```bash
cd /Users/admin/.openclaw/workspace/birthday-party
git config user.name "海绵宝宝 (SpongeBob)"
git config user.email "spongebob@bikinibottom.com"
```

### 方式三：每次提交时指定作者

```bash
git commit --author="海绵宝宝 (SpongeBob) <spongebob@bikinibottom.com>" -m "提交信息"
```

## 为什么别人的提交显示为机器人？

有两种常见方式：

### 1. GitHub Actions Bot（GitHub官方机器人）

当通过 GitHub Actions 自动提交代码时，提交者会显示为 `github-actions[bot]`

### 2. 自定义机器人账户

- 创建一个 GitHub 账户（如 `spongebob-bot`）
- 使用该账户的 Token（Personal Access Token）进行提交
- 配置 Git 使用该账户的信息

```bash
git config user.name "海绵宝宝机器人"
git config user.email "spongebob-bot@users.noreply.github.com"
```

## 当前项目配置

本项目已配置为单仓库模式，提交者显示为：
- **姓名**: 海绵宝宝 (SpongeBob)
- **邮箱**: spongebob@bikinibottom.com

## 提交信息格式建议

为了明确标识提交来源，建议在 commit message 中包含标识：

```
[🧽] 标题

详细描述...

Committed by: 🧽 海绵宝宝
```

## 注意事项

⚠️ **重要**：Git 配置存储在本地，不会自动同步。每次克隆仓库或在新设备上操作时，都需要重新配置。

## 查看当前配置

```bash
cd /Users/admin/.openclaw/workspace/birthday-party
git config user.name
git config user.email
```

## 查看提交历史

```bash
git log --format="%h - %an (%ae) - %s" -10
```
