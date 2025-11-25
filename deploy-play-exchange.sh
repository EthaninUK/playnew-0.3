#!/bin/bash

echo "============================================"
echo "   玩法交换系统 - 快速部署脚本"
echo "============================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 错误处理
set -e
trap 'last_command=$current_command; current_command=$BASH_COMMAND' DEBUG
trap 'echo -e "${RED}✗ 命令失败: $last_command${NC}"' ERR

# 步骤 1: 检查前置条件
echo -e "${BLUE}步骤 1/4: 检查前置条件${NC}"
echo "--------------------------------------"

# 检查 Directus
if docker-compose ps directus | grep -q "Up"; then
  echo -e "${GREEN}✓${NC} Directus 正在运行"
else
  echo -e "${RED}✗${NC} Directus 未运行"
  echo "启动 Directus..."
  docker-compose up -d directus
  echo "等待 Directus 启动... (30秒)"
  sleep 30
fi

# 检查前端
if curl -s http://localhost:3000 > /dev/null; then
  echo -e "${GREEN}✓${NC} 前端服务正在运行"
else
  echo -e "${YELLOW}⚠${NC} 前端服务未运行"
  echo "请在另一个终端运行: cd frontend && npm run dev"
  read -p "前端服务启动后按 Enter 继续..."
fi

echo ""

# 步骤 2: 提示用户执行 SQL
echo -e "${BLUE}步骤 2/4: 数据库迁移${NC}"
echo "--------------------------------------"
echo -e "${YELLOW}重要: 需要在 Supabase Dashboard 中手动执行 SQL${NC}"
echo ""
echo "1. 打开 Supabase Dashboard: https://supabase.com/dashboard"
echo "2. 选择你的项目"
echo "3. 点击左侧菜单 'SQL Editor'"
echo "4. 点击 'New query' 创建新查询"
echo "5. 复制以下文件的内容到编辑器:"
echo ""
echo -e "${GREEN}   sql/play_exchange_add_to_existing.sql${NC}"
echo ""
echo "6. 点击 'Run' 执行"
echo "7. 确认看到 'Success. No rows returned'"
echo ""
read -p "SQL 执行完成后按 Enter 继续..."
echo ""

# 步骤 3: 配置 Directus 权限
echo -e "${BLUE}步骤 3/4: 配置 Directus 权限${NC}"
echo "--------------------------------------"
node configure-play-exchange-permissions.js

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓ 权限配置成功${NC}"
else
  echo -e "${RED}✗ 权限配置失败${NC}"
  echo "请检查错误信息并手动配置"
  exit 1
fi
echo ""

# 步骤 4: 添加测试数据
echo -e "${BLUE}步骤 4/4: 添加测试数据${NC}"
echo "--------------------------------------"
node add-daily-featured-sample.js

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓ 测试数据添加成功${NC}"
else
  echo -e "${RED}✗ 测试数据添加失败${NC}"
  echo "请检查错误信息"
  exit 1
fi
echo ""

# 验证部署
echo "============================================"
echo -e "${GREEN}   部署完成！${NC}"
echo "============================================"
echo ""
echo "🎉 玩法交换系统已成功部署！"
echo ""
echo "📋 下一步:"
echo "  1. 访问: ${BLUE}http://localhost:3000/play-exchange${NC}"
echo "  2. 注册一个测试账号"
echo "  3. 测试首次免费翻牌"
echo "  4. 测试提交玩法"
echo "  5. 测试邀请好友"
echo ""
echo "📚 文档:"
echo "  - 部署指南: ${GREEN}PLAY-EXCHANGE-DEPLOYMENT-GUIDE.md${NC}"
echo "  - API 文档: ${GREEN}PLAY-EXCHANGE-API-GUIDE.md${NC}"
echo "  - 前端集成: ${GREEN}FRONTEND-INTEGRATION-GUIDE.md${NC}"
echo "  - 实施总结: ${GREEN}PLAY-EXCHANGE-IMPLEMENTATION-SUMMARY.md${NC}"
echo ""
echo "🧪 运行完整测试:"
echo "  ${BLUE}./test-play-exchange-complete.sh${NC}"
echo ""
