#!/bin/bash

# 生日派对项目部署脚本
# 用于部署到 GitHub Pages

set -e

echo "🎂 开始部署蟹老板生日派对项目..."

# 检查是否在正确的目录
if [ ! -f "index.html" ]; then
    echo "❌ 错误: 请在 birthday-party 项目目录中运行此脚本"
    exit 1
fi

# 检查 git 仓库
if [ ! -d ".git" ]; then
    echo "❌ 错误: 当前目录不是 Git 仓库"
    exit 1
fi

# 检查 GitHub 远程仓库
if ! git remote -v | grep -q "github.*\.git"; then
    echo "❌ 错误: 未找到 GitHub 远程仓库"
    echo "请先添加 GitHub 远程仓库:"
    echo "git remote add origin <your-github-repo-url>"
    exit 1
fi

# 检查是否有未提交的更改
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  发现未提交的更改，正在自动提交..."
    git add .
    git commit -m "🎂 更新生日派对项目 - 添加3D漫游游戏"
    echo "✅ 已提交更改"
fi

# 获取当前分支
current_branch=$(git branch --show-current)
echo "📋 当前分支: $current_branch"

# 推送到 GitHub
echo "🚀 推送到 GitHub..."
git push origin $current_branch

echo "✅ 部署完成！"
echo ""
echo "🌐 访问地址: https://iyow.github.io/birthday-party/"
echo ""
echo "🎮 新增功能:"
echo "   - 3D漫游游戏 (roaming-game.html)"
echo "   - 基于Three.js的3D生日派对世界"
echo "   - 收集金币和礼物"
echo "   - 第一人称控制"
echo ""
echo "💡 提示:"
echo "   - 等待1-2分钟让 GitHub Pages 生效"
echo "   - 如果部署失败，请检查 GitHub Actions 日志"