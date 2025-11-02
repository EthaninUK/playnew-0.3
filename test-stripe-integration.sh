#!/bin/bash

# Stripe 支付集成测试脚本

echo "🧪 Stripe 支付集成测试"
echo "===================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 测试计数
PASSED=0
FAILED=0

# 测试函数
test_endpoint() {
    local name=$1
    local url=$2
    local expected_status=$3

    echo -n "测试 $name... "

    status=$(curl -s -o /dev/null -w "%{http_code}" "$url")

    if [ "$status" -eq "$expected_status" ]; then
        echo -e "${GREEN}✓ PASS${NC} (HTTP $status)"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗ FAIL${NC} (HTTP $status, 期望 $expected_status)"
        ((FAILED++))
        return 1
    fi
}

test_api_response() {
    local name=$1
    local url=$2
    local expected_field=$3

    echo -n "测试 $name... "

    response=$(curl -s "$url")

    if echo "$response" | grep -q "$expected_field"; then
        echo -e "${GREEN}✓ PASS${NC}"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗ FAIL${NC} (未找到字段: $expected_field)"
        echo "响应: $response" | head -c 200
        echo ""
        ((FAILED++))
        return 1
    fi
}

echo "📡 测试前端页面"
echo "----------------"
test_endpoint "首页" "http://localhost:3000/" 200
test_endpoint "定价页面" "http://localhost:3000/pricing" 200
test_endpoint "会员中心" "http://localhost:3000/membership" 200
test_endpoint "合伙人仪表板" "http://localhost:3000/dashboard/partner" 200

echo ""
echo "🔌 测试 API 端点"
echo "----------------"
test_api_response "会员信息 API" "http://localhost:3000/api/memberships" "memberships"

# 测试会员数量
echo -n "测试会员等级数量... "
membership_count=$(curl -s "http://localhost:3000/api/memberships" | grep -o '"id"' | wc -l)
if [ "$membership_count" -eq 4 ]; then
    echo -e "${GREEN}✓ PASS${NC} (找到 4 个会员等级)"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} (找到 $membership_count 个会员等级，期望 4 个)"
    ((FAILED++))
fi

# 测试会员名称
echo -n "测试会员名称... "
response=$(curl -s "http://localhost:3000/api/memberships")
if echo "$response" | grep -q "Free" && \
   echo "$response" | grep -q "Pro" && \
   echo "$response" | grep -q "Max" && \
   echo "$response" | grep -q "Partner"; then
    echo -e "${GREEN}✓ PASS${NC} (所有会员等级名称正确)"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} (会员名称不完整)"
    ((FAILED++))
fi

# 测试价格
echo -n "测试价格配置... "
if echo "$response" | grep -q "39.00" && \
   echo "$response" | grep -q "99.00" && \
   echo "$response" | grep -q "200.00"; then
    echo -e "${GREEN}✓ PASS${NC} (价格配置正确)"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} (价格配置有误)"
    ((FAILED++))
fi

echo ""
echo "⚙️  测试环境变量"
echo "----------------"

# 检查 .env.local
if [ -f "/Users/m1/PlayNew_0.3/frontend/.env.local" ]; then
    echo -n "测试 Stripe Publishable Key... "
    if grep -q "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_" "/Users/m1/PlayNew_0.3/frontend/.env.local"; then
        echo -e "${GREEN}✓ PASS${NC}"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAIL${NC}"
        ((FAILED++))
    fi

    echo -n "测试 Stripe Secret Key... "
    if grep -q "STRIPE_SECRET_KEY=sk_test_" "/Users/m1/PlayNew_0.3/frontend/.env.local"; then
        echo -e "${GREEN}✓ PASS${NC}"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAIL${NC}"
        ((FAILED++))
    fi

    echo -n "测试 Stripe Webhook Secret... "
    if grep -q "STRIPE_WEBHOOK_SECRET=whsec_" "/Users/m1/PlayNew_0.3/frontend/.env.local"; then
        echo -e "${GREEN}✓ PASS${NC}"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAIL${NC}"
        ((FAILED++))
    fi

    echo -n "测试 Directus Admin Token... "
    if grep -q "DIRECTUS_ADMIN_TOKEN=" "/Users/m1/PlayNew_0.3/frontend/.env.local" && \
       ! grep -q "DIRECTUS_ADMIN_TOKEN=your-admin-token-here" "/Users/m1/PlayNew_0.3/frontend/.env.local"; then
        echo -e "${GREEN}✓ PASS${NC}"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAIL${NC}"
        ((FAILED++))
    fi
else
    echo -e "${RED}✗ 找不到 .env.local 文件${NC}"
    ((FAILED+=4))
fi

echo ""
echo "🗄️  测试 Directus 数据库"
echo "----------------"

# 测试 Directus 连接
echo -n "测试 Directus 连接... "
directus_status=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:8055/server/health")
if [ "$directus_status" -eq 200 ]; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} (HTTP $directus_status)"
    ((FAILED++))
fi

# 测试 memberships 表
echo -n "测试 memberships 表... "
memberships_count=$(curl -s "http://localhost:8055/items/memberships" | grep -o '"id"' | wc -l)
if [ "$memberships_count" -ge 4 ]; then
    echo -e "${GREEN}✓ PASS${NC} (找到 $memberships_count 条记录)"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} (只找到 $memberships_count 条记录)"
    ((FAILED++))
fi

echo ""
echo "📊 测试结果"
echo "=========="
echo -e "通过: ${GREEN}$PASSED${NC}"
echo -e "失败: ${RED}$FAILED${NC}"
echo -e "总计: $((PASSED + FAILED))"

if [ $FAILED -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✓ 所有测试通过！${NC}"
    echo ""
    echo "🎉 可以开始测试支付流程了！"
    echo ""
    echo "下一步:"
    echo "1. 在新终端运行: stripe listen --forward-to localhost:3000/api/webhooks/stripe"
    echo "2. 访问: http://localhost:3000/pricing"
    echo "3. 选择会员等级并测试支付"
    echo ""
    echo "测试卡号: 4242 4242 4242 4242"
    echo "详细指南: cat PAYMENT_TEST_GUIDE.md"
    exit 0
else
    echo ""
    echo -e "${RED}✗ 有 $FAILED 个测试失败${NC}"
    echo ""
    echo "请检查:"
    echo "1. Next.js 开发服务器是否运行 (http://localhost:3000)"
    echo "2. Directus 是否运行 (http://localhost:8055)"
    echo "3. .env.local 配置是否正确"
    echo "4. 数据库表是否创建"
    exit 1
fi
