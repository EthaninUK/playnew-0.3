#!/bin/bash

# 测试 n8n 工作流所需的 API 连接
# 使用方法: ./test-api-connections.sh

set -e

echo "🔍 测试 n8n 工作流 API 连接..."
echo ""

# 加载环境变量
if [ -f ../.env ]; then
  source ../.env
elif [ -f .env ]; then
  source .env
else
  echo "❌ 错误: 找不到 .env 文件"
  exit 1
fi

# 测试计数
PASSED=0
FAILED=0

# ==========================================
# 测试 1: Directus API
# ==========================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 测试 1: Directus API"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -z "$DIRECTUS_ADMIN_TOKEN" ]; then
  echo "❌ DIRECTUS_ADMIN_TOKEN 未设置"
  echo ""
  echo "获取 Token 的方法:"
  echo "  curl -X POST http://localhost:8055/auth/login \\"
  echo "    -H 'Content-Type: application/json' \\"
  echo "    -d '{\"email\":\"the_uk1@outlook.com\",\"password\":\"Mygcdjmyxzg2026!\"}' \\"
  echo "    | jq -r '.data.access_token'"
  echo ""
  ((FAILED++))
else
  echo "🔑 Token: ${DIRECTUS_ADMIN_TOKEN:0:20}..."

  # 测试连接
  RESPONSE=$(curl -s -w "\n%{http_code}" -H "Authorization: Bearer $DIRECTUS_ADMIN_TOKEN" \
    http://localhost:8055/items/news?limit=1 2>/dev/null || echo "000")

  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)

  if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Directus API 连接成功"

    # 检查八卦数据
    GOSSIP_COUNT=$(curl -s -H "Authorization: Bearer $DIRECTUS_ADMIN_TOKEN" \
      'http://localhost:8055/items/news?filter[news_type][_eq]=gossip&aggregate[count]=*' 2>/dev/null \
      | jq -r '.data[0].count.id' 2>/dev/null || echo "0")

    echo "   现有八卦数量: $GOSSIP_COUNT"
    ((PASSED++))
  else
    echo "❌ Directus API 连接失败 (HTTP $HTTP_CODE)"
    echo "$RESPONSE" | head -n-1
    ((FAILED++))
  fi
fi

echo ""

# ==========================================
# 测试 2: Twitter API
# ==========================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🐦 测试 2: Twitter API v2"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -z "$TWITTER_BEARER_TOKEN" ]; then
  echo "⚠️  TWITTER_BEARER_TOKEN 未设置"
  echo "   申请地址: https://developer.twitter.com/"
  echo ""
  ((FAILED++))
else
  echo "🔑 Token: ${TWITTER_BEARER_TOKEN:0:20}..."

  # 测试搜索 API
  RESPONSE=$(curl -s -w "\n%{http_code}" \
    -H "Authorization: Bearer $TWITTER_BEARER_TOKEN" \
    "https://api.twitter.com/2/tweets/search/recent?query=from:VitalikButerin&max_results=10" 2>/dev/null \
    || echo "000")

  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)

  if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Twitter API 连接成功"

    # 解析结果数量
    TWEET_COUNT=$(echo "$RESPONSE" | head -n-1 | jq -r '.meta.result_count' 2>/dev/null || echo "unknown")
    echo "   测试查询返回: $TWEET_COUNT 条推文"

    # 检查 Rate Limit
    RATE_LIMIT=$(curl -s -I \
      -H "Authorization: Bearer $TWITTER_BEARER_TOKEN" \
      "https://api.twitter.com/2/tweets/search/recent?query=test" 2>/dev/null \
      | grep -i "x-rate-limit-remaining" | awk '{print $2}' | tr -d '\r')

    if [ ! -z "$RATE_LIMIT" ]; then
      echo "   剩余请求次数: $RATE_LIMIT"
    fi

    ((PASSED++))
  elif [ "$HTTP_CODE" = "429" ]; then
    echo "⚠️  Twitter API Rate Limit 达到上限"
    echo "   请等待一段时间后重试"
    ((FAILED++))
  else
    echo "❌ Twitter API 连接失败 (HTTP $HTTP_CODE)"

    # 尝试解析错误信息
    ERROR_MSG=$(echo "$RESPONSE" | head -n-1 | jq -r '.title // .error // "Unknown error"' 2>/dev/null)
    if [ ! -z "$ERROR_MSG" ] && [ "$ERROR_MSG" != "null" ]; then
      echo "   错误: $ERROR_MSG"
    fi

    ((FAILED++))
  fi
fi

echo ""

# ==========================================
# 测试 3: OpenAI API (可选)
# ==========================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🤖 测试 3: OpenAI API (可选)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -z "$OPENAI_API_KEY" ]; then
  echo "⚠️  OPENAI_API_KEY 未设置"
  echo "   AI 分析功能将不可用（但不影响基础采集）"
  echo "   申请地址: https://platform.openai.com/"
  echo ""
else
  echo "🔑 Key: ${OPENAI_API_KEY:0:20}..."

  # 测试 API
  RESPONSE=$(curl -s -w "\n%{http_code}" \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{"model":"gpt-4o-mini","messages":[{"role":"user","content":"Say hello"}],"max_tokens":5}' \
    https://api.openai.com/v1/chat/completions 2>/dev/null \
    || echo "000")

  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)

  if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ OpenAI API 连接成功"

    # 解析响应
    REPLY=$(echo "$RESPONSE" | head -n-1 | jq -r '.choices[0].message.content' 2>/dev/null)
    if [ ! -z "$REPLY" ] && [ "$REPLY" != "null" ]; then
      echo "   测试响应: $REPLY"
    fi

    ((PASSED++))
  else
    echo "❌ OpenAI API 连接失败 (HTTP $HTTP_CODE)"

    # 尝试解析错误信息
    ERROR_MSG=$(echo "$RESPONSE" | head -n-1 | jq -r '.error.message // "Unknown error"' 2>/dev/null)
    if [ ! -z "$ERROR_MSG" ] && [ "$ERROR_MSG" != "null" ]; then
      echo "   错误: $ERROR_MSG"
    fi

    # 检查是否是余额不足
    if echo "$ERROR_MSG" | grep -iq "quota\|insufficient_quota"; then
      echo ""
      echo "   💡 提示: 请充值 OpenAI 账户"
      echo "   访问: https://platform.openai.com/usage"
    fi

    ((FAILED++))
  fi
fi

echo ""

# ==========================================
# 汇总结果
# ==========================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 测试结果汇总"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ 通过: $PASSED"
echo "❌ 失败: $FAILED"
echo ""

if [ $FAILED -eq 0 ]; then
  echo "🎉 所有测试通过！可以开始使用 n8n 工作流了"
  echo ""
  echo "下一步:"
  echo "  1. 启动 n8n: ./start-n8n.sh"
  echo "  2. 访问: http://localhost:5678"
  echo "  3. 导入工作流: twitter-gossip-collector.json"
  echo ""
  exit 0
else
  echo "⚠️  部分测试失败，请检查配置"
  echo ""
  echo "文档:"
  echo "  - SETUP-GUIDE.md"
  echo "  - .env.n8n.example"
  echo ""
  exit 1
fi
