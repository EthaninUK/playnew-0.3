#!/bin/bash

# 启动 n8n 八卦采集器
# 使用方法: ./start-n8n.sh

set -e

echo "🚀 启动 n8n Twitter 八卦采集器..."
echo ""

# 检查 .env 文件
if [ ! -f .env ]; then
  echo "❌ 错误: .env 文件不存在"
  echo ""
  echo "请先创建 .env 文件并配置以下变量:"
  echo "  - DIRECTUS_ADMIN_TOKEN"
  echo "  - TWITTER_BEARER_TOKEN"
  echo "  - OPENAI_API_KEY"
  echo ""
  exit 1
fi

# 检查必需的环境变量
source .env

if [ -z "$DIRECTUS_ADMIN_TOKEN" ]; then
  echo "⚠️  警告: DIRECTUS_ADMIN_TOKEN 未设置"
  echo ""
  echo "获取 Token 的方法:"
  echo "  curl -X POST http://localhost:8055/auth/login \\"
  echo "    -H 'Content-Type: application/json' \\"
  echo "    -d '{\"email\":\"the_uk1@outlook.com\",\"password\":\"Mygcdjmyxzg2026!\"}' \\"
  echo "    | jq -r '.data.access_token'"
  echo ""
  read -p "是否继续？(y/N) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
fi

if [ -z "$TWITTER_BEARER_TOKEN" ]; then
  echo "⚠️  警告: TWITTER_BEARER_TOKEN 未设置"
  echo "    工作流中的 Twitter 节点将无法工作"
  echo ""
fi

if [ -z "$OPENAI_API_KEY" ]; then
  echo "⚠️  警告: OPENAI_API_KEY 未设置"
  echo "    AI 分析功能将不可用（但不影响基础采集）"
  echo ""
fi

# 创建 n8n 数据目录
mkdir -p n8n-data

# 检查网络是否存在
if ! docker network inspect playnew-network >/dev/null 2>&1; then
  echo "📡 创建 Docker 网络: playnew-network"
  docker network create playnew-network
fi

# 启动 n8n
echo "🐳 启动 n8n 容器..."
docker-compose -f docker-compose.n8n.yml up -d

# 等待 n8n 启动
echo ""
echo "⏳ 等待 n8n 启动..."
sleep 5

# 检查容器状态
if docker ps | grep -q playnew-n8n; then
  echo ""
  echo "✅ n8n 启动成功！"
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  echo "📍 访问 n8n 界面:"
  echo "   http://localhost:5678"
  echo ""
  echo "📋 下一步操作:"
  echo "   1. 首次访问需要创建账号（本地账号）"
  echo "   2. 导入工作流: n8n-workflows/twitter-gossip-collector.json"
  echo "   3. 配置 Twitter/OpenAI/Directus 凭证"
  echo "   4. 手动测试工作流"
  echo "   5. 启用自动调度"
  echo ""
  echo "📖 详细文档:"
  echo "   n8n-workflows/SETUP-GUIDE.md"
  echo ""
  echo "🔍 查看日志:"
  echo "   docker logs playnew-n8n -f"
  echo ""
  echo "🛑 停止 n8n:"
  echo "   docker-compose -f docker-compose.n8n.yml down"
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
else
  echo ""
  echo "❌ n8n 启动失败"
  echo ""
  echo "查看错误日志:"
  echo "  docker logs playnew-n8n"
  echo ""
  exit 1
fi
