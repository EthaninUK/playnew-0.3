#!/bin/bash

# 排行榜系统快速验证脚本
# Quick verification script for leaderboard system
# Usage: bash verify-leaderboard-system.sh

echo "🏆 排行榜系统验证脚本"
echo "======================================"
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 计数器
PASSED=0
FAILED=0

# 测试函数
test_endpoint() {
    local name=$1
    local url=$2
    local expected_type=$3

    echo -n "测试 $name ... "

    response=$(curl -s "$url")

    if echo "$response" | grep -q "\"type\":\"$expected_type\""; then
        echo -e "${GREEN}✅ 通过${NC}"
        ((PASSED++))

        # 显示策略数量
        count=$(echo "$response" | grep -o '"total":[0-9]*' | grep -o '[0-9]*')
        echo "   └─ 策略数: $count"
    else
        echo -e "${RED}❌ 失败${NC}"
        ((FAILED++))
    fi
}

echo "📡 测试 API 端点"
echo "--------------------------------------"

# 测试各个排行榜 API
test_endpoint "热度榜 🔥" "http://localhost:3000/api/leaderboard?type=trending&limit=5" "trending"
test_endpoint "收益榜 💰" "http://localhost:3000/api/leaderboard?type=top_apy&limit=5" "top_apy"
test_endpoint "新人榜 🎯" "http://localhost:3000/api/leaderboard?type=beginner&limit=5" "beginner"
test_endpoint "快速榜 ⚡" "http://localhost:3000/api/leaderboard?type=quick&limit=5" "quick"
test_endpoint "社区榜 ⭐" "http://localhost:3000/api/leaderboard?type=community&limit=5" "community"
test_endpoint "精选榜 ✨" "http://localhost:3000/api/leaderboard?type=editor&limit=5" "editor"

echo ""
echo "🌐 测试前端页面"
echo "--------------------------------------"

# 测试排行榜页面
echo -n "测试排行榜页面 ... "
page_response=$(curl -s "http://localhost:3000/leaderboard")

if echo "$page_response" | grep -q "玩法排行榜" && echo "$page_response" | grep -q "热度榜"; then
    echo -e "${GREEN}✅ 通过${NC}"
    ((PASSED++))
    echo "   └─ 页面标题和 Tab 正常显示"
else
    echo -e "${RED}❌ 失败${NC}"
    ((FAILED++))
fi

echo ""
echo "📊 测试数据完整性"
echo "--------------------------------------"

# 测试精选策略配置
echo -n "测试精选策略配置 ... "
editor_response=$(curl -s "http://localhost:3000/api/leaderboard?type=editor&limit=10")
editor_count=$(echo "$editor_response" | grep -o '"total":[0-9]*' | grep -o '[0-9]*')

if [ "$editor_count" -ge 5 ]; then
    echo -e "${GREEN}✅ 通过${NC}"
    ((PASSED++))
    echo "   └─ 精选策略数: $editor_count (建议: 5-15个)"
else
    echo -e "${YELLOW}⚠️  警告${NC}"
    echo "   └─ 精选策略数: $editor_count (建议至少5个)"
fi

# 测试风险筛选
echo -n "测试风险等级筛选 ... "
low_risk=$(curl -s "http://localhost:3000/api/leaderboard?type=top_apy&risk=low&limit=5")

if echo "$low_risk" | grep -q '"riskLevel":"low"'; then
    echo -e "${GREEN}✅ 通过${NC}"
    ((PASSED++))
    echo "   └─ 低风险策略筛选正常"
else
    echo -e "${RED}❌ 失败${NC}"
    ((FAILED++))
fi

echo ""
echo "======================================"
echo "📋 验证结果总结"
echo "======================================"
echo -e "通过: ${GREEN}$PASSED${NC}"
echo -e "失败: ${RED}$FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 所有测试通过！排行榜系统运行正常。${NC}"
    echo ""
    echo "访问链接: http://localhost:3000/leaderboard"
    exit 0
else
    echo -e "${RED}⚠️  发现 $FAILED 个问题，请检查系统状态。${NC}"
    exit 1
fi
