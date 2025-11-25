#!/bin/bash

echo "========================================="
echo "玩法交换系统 - 完整测试"
echo "========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: 获取今日精选
echo -e "${YELLOW}测试 1: 获取今日精选 (无需登录)${NC}"
echo "--------------------------------------"
RESULT=$(curl -s http://localhost:3000/api/play-exchange/daily-featured)
SUCCESS=$(echo "$RESULT" | node -p "JSON.parse(require('fs').readFileSync(0)).success")
if [ "$SUCCESS" = "true" ]; then
  echo -e "${GREEN}✓ 成功${NC}"
  echo "$RESULT" | node -p "const d=JSON.parse(require('fs').readFileSync(0)); console.log('  日期:', d.data.date); console.log('  主题:', d.data.theme_label); console.log('  玩法数量:', d.data.plays.length); d.data.plays.forEach((p,i) => console.log(\`  卡片 \${i+1}: \${p.title}\`)); ''"
else
  echo -e "${RED}✗ 失败${NC}"
  echo "$RESULT"
fi
echo ""

# Test 2: 访问前端页面
echo -e "${YELLOW}测试 2: 访问前端页面${NC}"
echo "--------------------------------------"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/play-exchange)
if [ "$HTTP_CODE" = "200" ]; then
  echo -e "${GREEN}✓ 页面加载成功 (HTTP $HTTP_CODE)${NC}"
else
  echo -e "${RED}✗ 页面加载失败 (HTTP $HTTP_CODE)${NC}"
fi
echo ""

# Test 3: 数据库表检查
echo -e "${YELLOW}测试 3: 数据库表检查${NC}"
echo "--------------------------------------"
export PGPASSWORD='Mygcdjmyxzg2026!'
TABLES="user_profiles daily_featured_plays user_play_exchanges user_submitted_plays credit_transactions referrals"

for TABLE in $TABLES; do
  COUNT=$(PGPASSWORD='Mygcdjmyxzg2026!' psql -h localhost -U directus -d directus_play -t -c "SELECT COUNT(*) FROM $TABLE;" 2>/dev/null | xargs)
  if [ -n "$COUNT" ]; then
    echo -e "${GREEN}✓${NC} $TABLE: $COUNT 条记录"
  else
    echo -e "${RED}✗${NC} $TABLE: 表不存在或无法访问"
  fi
done
echo ""

# Test 4: 检查 user_profiles 字段
echo -e "${YELLOW}测试 4: 检查 user_profiles 扩展字段${NC}"
echo "--------------------------------------"
COLUMNS=$(PGPASSWORD='Mygcdjmyxzg2026!' psql -h localhost -U directus -d directus_play -t -c "\d user_profiles" 2>/dev/null | grep -E "credits|first_draw_used|referral_code|referred_by" | wc -l | xargs)
if [ "$COLUMNS" -ge "4" ]; then
  echo -e "${GREEN}✓ user_profiles 扩展字段已添加${NC}"
  PGPASSWORD='Mygcdjmyxzg2026!' psql -h localhost -U directus -d directus_play -t -c "\d user_profiles" 2>/dev/null | grep -E "credits|first_draw_used|referral_code|referred_by"
else
  echo -e "${RED}✗ user_profiles 扩展字段未完全添加${NC}"
fi
echo ""

# Test 5: 检查触发器
echo -e "${YELLOW}测试 5: 检查数据库触发器${NC}"
echo "--------------------------------------"
TRIGGERS=$(PGPASSWORD='Mygcdjmyxzg2026!' psql -h localhost -U directus -d directus_play -t -c "SELECT tgname FROM pg_trigger WHERE tgname LIKE '%play%' OR tgname LIKE '%referral%';" 2>/dev/null | wc -l | xargs)
if [ "$TRIGGERS" -gt "0" ]; then
  echo -e "${GREEN}✓ 找到 $TRIGGERS 个相关触发器${NC}"
  PGPASSWORD='Mygcdjmyxzg2026!' psql -h localhost -U directus -d directus_play -t -c "SELECT tgname FROM pg_trigger WHERE tgname LIKE '%play%' OR tgname LIKE '%referral%';" 2>/dev/null
else
  echo -e "${YELLOW}⚠ 未找到相关触发器${NC}"
fi
echo ""

# Test 6: 检查今日精选配置
echo -e "${YELLOW}测试 6: 检查今日精选配置${NC}"
echo "--------------------------------------"
FEATURED_COUNT=$(PGPASSWORD='Mygcdjmyxzg2026!' psql -h localhost -U directus -d directus_play -t -c "SELECT COUNT(*) FROM daily_featured_plays WHERE is_active = true;" 2>/dev/null | xargs)
if [ "$FEATURED_COUNT" -gt "0" ]; then
  echo -e "${GREEN}✓ 找到 $FEATURED_COUNT 个激活的今日精选配置${NC}"
  PGPASSWORD='Mygcdjmyxzg2026!' psql -h localhost -U directus -d directus_play -c "SELECT feature_date, theme_label, is_active FROM daily_featured_plays WHERE is_active = true LIMIT 3;" 2>/dev/null
else
  echo -e "${RED}✗ 未找到激活的今日精选配置${NC}"
fi
echo ""

# Test 7: API 健康检查总结
echo -e "${YELLOW}测试 7: API 端点健康检查${NC}"
echo "--------------------------------------"
ENDPOINTS=(
  "/api/play-exchange/daily-featured:GET:无需登录"
)

for ENDPOINT_INFO in "${ENDPOINTS[@]}"; do
  IFS=':' read -r ENDPOINT METHOD AUTH <<< "$ENDPOINT_INFO"
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000$ENDPOINT")
  if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓${NC} $METHOD $ENDPOINT ($AUTH) - HTTP $HTTP_CODE"
  else
    echo -e "${RED}✗${NC} $METHOD $ENDPOINT ($AUTH) - HTTP $HTTP_CODE"
  fi
done
echo ""

# Summary
echo "========================================="
echo -e "${GREEN}测试完成！${NC}"
echo "========================================="
echo ""
echo "后续测试需要登录的功能:"
echo "  1. 注册/登录用户"
echo "  2. 首次免费翻牌"
echo "  3. 消耗积分翻牌"
echo "  4. 提交玩法"
echo "  5. 邀请好友"
echo ""
echo "请在浏览器中访问: http://localhost:3000/play-exchange"
echo ""
