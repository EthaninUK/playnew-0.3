#!/bin/bash

# PlayPass API 测试脚本
# 用于测试所有 PlayPass API 端点是否正常工作

echo "🎟️ PlayPass API 测试脚本"
echo "=========================="
echo ""

# 配置
API_BASE_URL="http://localhost:3000"
TEST_USER_ID="test-user-$(date +%s)"
CONTENT_ID="test-content-123"

echo "📝 测试配置:"
echo "  API URL: $API_BASE_URL"
echo "  测试用户: $TEST_USER_ID"
echo ""

# 颜色输出
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 测试计数
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# 测试函数
test_api() {
    local test_name=$1
    local method=$2
    local endpoint=$3
    local data=$4

    TOTAL_TESTS=$((TOTAL_TESTS + 1))

    echo -e "${YELLOW}测试 $TOTAL_TESTS: $test_name${NC}"

    if [ "$method" = "GET" ]; then
        response=$(curl -s "$API_BASE_URL$endpoint")
    else
        response=$(curl -s -X POST "$API_BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data")
    fi

    # 检查是否包含 "success": true
    if echo "$response" | grep -q '"success":true'; then
        echo -e "${GREEN}✅ 通过${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        echo "响应: $response" | head -c 200
        echo "..."
    else
        echo -e "${RED}❌ 失败${NC}"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        echo "响应: $response"
    fi

    echo ""
}

echo "🚀 开始测试 PlayPass API..."
echo ""

# ========================================
# 测试 1: 获取用户余额 (新用户)
# ========================================
test_api \
    "获取用户余额 (新用户)" \
    "GET" \
    "/api/playpass/balance?user_id=$TEST_USER_ID"

# ========================================
# 测试 2: 每日签到
# ========================================
test_api \
    "每日签到" \
    "POST" \
    "/api/playpass/daily-signin" \
    "{\"user_id\": \"$TEST_USER_ID\"}"

# ========================================
# 测试 3: 再次获取余额 (应该增加了签到奖励)
# ========================================
test_api \
    "获取余额 (签到后)" \
    "GET" \
    "/api/playpass/balance?user_id=$TEST_USER_ID"

# ========================================
# 测试 4: 赚取 PP (阅读策略)
# ========================================
test_api \
    "赚取 PP (阅读策略)" \
    "POST" \
    "/api/playpass/earn" \
    "{
        \"user_id\": \"$TEST_USER_ID\",
        \"action_type\": \"read_strategy\",
        \"source_id\": \"strategy-123\",
        \"description\": \"阅读策略\"
    }"

# ========================================
# 测试 5: 获取内容价格
# ========================================
test_api \
    "获取内容价格" \
    "POST" \
    "/api/playpass/get-price" \
    "{
        \"content_id\": \"$CONTENT_ID\",
        \"content_type\": \"strategy\",
        \"user_membership_level\": 0
    }"

# ========================================
# 测试 6: 获取奖励金额预览
# ========================================
test_api \
    "获取奖励金额预览" \
    "POST" \
    "/api/playpass/get-reward" \
    "{
        \"action_type\": \"read_strategy\",
        \"user_membership_level\": 0
    }"

# ========================================
# 测试 7: 检查内容访问权限
# ========================================
test_api \
    "检查内容访问权限" \
    "POST" \
    "/api/playpass/check-access" \
    "{
        \"user_id\": \"$TEST_USER_ID\",
        \"content_id\": \"$CONTENT_ID\",
        \"content_type\": \"strategy\"
    }"

# ========================================
# 测试 8: 消耗 PP 解锁内容
# ========================================
test_api \
    "消耗 PP 解锁内容" \
    "POST" \
    "/api/playpass/spend" \
    "{
        \"user_id\": \"$TEST_USER_ID\",
        \"amount\": 50,
        \"content_id\": \"$CONTENT_ID\",
        \"content_type\": \"strategy\",
        \"content_title\": \"测试策略\",
        \"description\": \"解锁测试策略\"
    }"

# ========================================
# 测试 9: 再次检查访问权限 (应该已解锁)
# ========================================
test_api \
    "检查访问权限 (解锁后)" \
    "POST" \
    "/api/playpass/check-access" \
    "{
        \"user_id\": \"$TEST_USER_ID\",
        \"content_id\": \"$CONTENT_ID\",
        \"content_type\": \"strategy\"
    }"

# ========================================
# 测试 10: 最终余额查询
# ========================================
test_api \
    "最终余额查询" \
    "GET" \
    "/api/playpass/balance?user_id=$TEST_USER_ID"

# ========================================
# 测试结果汇总
# ========================================
echo ""
echo "=============================="
echo "📊 测试结果汇总"
echo "=============================="
echo "总测试数: $TOTAL_TESTS"
echo -e "通过: ${GREEN}$PASSED_TESTS${NC}"
echo -e "失败: ${RED}$FAILED_TESTS${NC}"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}🎉 所有测试通过!${NC}"
    exit 0
else
    echo -e "${RED}❌ 有 $FAILED_TESTS 个测试失败${NC}"
    exit 1
fi
