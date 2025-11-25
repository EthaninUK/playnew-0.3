#!/bin/bash

echo "========================================="
echo "   PlayNew 服务状态检查"
echo "========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 1. Docker 服务
echo -e "${BLUE}1. Docker 服务${NC}"
echo "--------------------------------------"

# Directus
if curl -s http://localhost:8055/server/health > /dev/null 2>&1; then
  echo -e "${GREEN}✓${NC} Directus 运行中 (http://localhost:8055)"
else
  echo -e "${RED}✗${NC} Directus 未运行"
fi

# Meilisearch
if curl -s http://localhost:7700/health > /dev/null 2>&1; then
  echo -e "${GREEN}✓${NC} Meilisearch 运行中 (http://localhost:7700)"
else
  echo -e "${RED}✗${NC} Meilisearch 未运行"
fi

# n8n
if curl -s http://localhost:5678 > /dev/null 2>&1; then
  echo -e "${GREEN}✓${NC} n8n 运行中 (http://localhost:5678)"
else
  echo -e "${RED}✗${NC} n8n 未运行"
fi

echo ""

# 2. 前端服务
echo -e "${BLUE}2. Next.js 前端${NC}"
echo "--------------------------------------"

if curl -s http://localhost:3000 > /dev/null 2>&1; then
  echo -e "${GREEN}✓${NC} Next.js 运行中 (http://localhost:3000)"

  # 检查关键页面
  if curl -s http://localhost:3000/play-exchange > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} 玩法交换页面可访问 (http://localhost:3000/play-exchange)"
  else
    echo -e "${RED}✗${NC} 玩法交换页面无法访问"
  fi
else
  echo -e "${RED}✗${NC} Next.js 未运行"
fi

echo ""

# 3. 数据库
echo -e "${BLUE}3. PostgreSQL 数据库${NC}"
echo "--------------------------------------"

# 检查 Directus 使用的数据库
if PGPASSWORD='Mygcdjmyxzg2026!' psql -h localhost -U directus -d directus_play -c "SELECT 1" > /dev/null 2>&1; then
  echo -e "${GREEN}✓${NC} PostgreSQL 运行中"

  # 检查玩法交换相关表
  TABLE_COUNT=$(PGPASSWORD='Mygcdjmyxzg2026!' psql -h localhost -U directus -d directus_play -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('daily_featured_plays', 'user_play_exchanges', 'user_submitted_plays', 'credit_transactions', 'referrals');" 2>/dev/null | xargs)

  if [ "$TABLE_COUNT" = "5" ]; then
    echo -e "${GREEN}✓${NC} 玩法交换表已创建 (5/5)"
  elif [ "$TABLE_COUNT" -gt "0" ]; then
    echo -e "${YELLOW}⚠${NC} 部分玩法交换表已创建 ($TABLE_COUNT/5)"
  else
    echo -e "${RED}✗${NC} 玩法交换表未创建 (0/5)"
    echo -e "  ${YELLOW}→ 需要在 Supabase Dashboard 执行 SQL 迁移${NC}"
  fi
else
  echo -e "${RED}✗${NC} PostgreSQL 无法连接"
fi

echo ""

# 4. API 端点
echo -e "${BLUE}4. API 端点${NC}"
echo "--------------------------------------"

# Play Exchange API
if curl -s http://localhost:3000/api/play-exchange/daily-featured > /dev/null 2>&1; then
  echo -e "${GREEN}✓${NC} 玩法交换 API 运行中"

  # 检查是否有数据
  PLAYS_COUNT=$(curl -s http://localhost:3000/api/play-exchange/daily-featured | node -p "JSON.parse(require('fs').readFileSync(0)).data?.plays?.length || 0" 2>/dev/null)
  if [ "$PLAYS_COUNT" = "3" ]; then
    echo -e "${GREEN}✓${NC} 今日精选数据已配置 (3 个玩法)"
  elif [ "$PLAYS_COUNT" -gt "0" ]; then
    echo -e "${YELLOW}⚠${NC} 今日精选数据不完整 ($PLAYS_COUNT/3 个玩法)"
  else
    echo -e "${RED}✗${NC} 今日精选数据未配置"
    echo -e "  ${YELLOW}→ 运行: node add-daily-featured-sample.js${NC}"
  fi
else
  echo -e "${RED}✗${NC} 玩法交换 API 无法访问"
fi

echo ""

# 5. 环境变量
echo -e "${BLUE}5. 环境配置${NC}"
echo "--------------------------------------"

if [ -f "/Users/m1/PlayNew_0.3/frontend/.env.local" ]; then
  echo -e "${GREEN}✓${NC} .env.local 存在"

  # 检查关键变量
  if grep -q "NEXT_PUBLIC_SUPABASE_URL" /Users/m1/PlayNew_0.3/frontend/.env.local; then
    echo -e "${GREEN}✓${NC} Supabase 配置已设置"
  else
    echo -e "${RED}✗${NC} Supabase 配置缺失"
  fi

  if grep -q "NEXT_PUBLIC_DIRECTUS_URL" /Users/m1/PlayNew_0.3/frontend/.env.local; then
    echo -e "${GREEN}✓${NC} Directus 配置已设置"
  else
    echo -e "${RED}✗${NC} Directus 配置缺失"
  fi
else
  echo -e "${RED}✗${NC} .env.local 不存在"
fi

echo ""

# 总结
echo "========================================="
echo -e "${GREEN}服务检查完成！${NC}"
echo "========================================="
echo ""
echo "📋 快速访问:"
echo "  • 前端: ${BLUE}http://localhost:3000${NC}"
echo "  • 玩法交换: ${BLUE}http://localhost:3000/play-exchange${NC}"
echo "  • Directus: ${BLUE}http://localhost:8055${NC}"
echo "  • n8n: ${BLUE}http://localhost:5678${NC}"
echo ""
echo "📚 文档:"
echo "  • 快速开始: ${GREEN}README-PLAY-EXCHANGE.md${NC}"
echo "  • 部署指南: ${GREEN}PLAY-EXCHANGE-DEPLOYMENT-GUIDE.md${NC}"
echo ""