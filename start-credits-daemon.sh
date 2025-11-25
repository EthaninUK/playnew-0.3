#!/bin/bash

echo "🚀 启动积分自动发放服务..."
echo ""

# 检查 PM2 是否安装
if ! command -v pm2 &> /dev/null; then
    echo "⚠️  PM2 未安装"
    echo "正在安装 PM2..."
    npm install -g pm2
fi

# 创建日志目录
mkdir -p /Users/m1/PlayNew_0.3/logs

# 启动服务
echo "📦 启动 PM2 守护进程..."
pm2 start /Users/m1/PlayNew_0.3/pm2-credits-daemon.config.js

echo ""
echo "✅ 服务启动成功！"
echo ""
echo "📊 查看状态:"
pm2 list

echo ""
echo "📝 实用命令:"
echo "   查看日志: pm2 logs credits-daemon"
echo "   停止服务: pm2 stop credits-daemon"
echo "   重启服务: pm2 restart credits-daemon"
echo "   删除服务: pm2 delete credits-daemon"
echo "   手动运行: node /Users/m1/PlayNew_0.3/auto-award-credits-daemon.js"
echo ""
echo "💡 提示: 服务每 5 分钟自动检查并发放积分"
echo ""
