#!/bin/bash

# 获取 Directus Access Token

echo ""
echo "🔑 正在获取 Directus Access Token..."
echo ""

TOKEN_RESPONSE=$(curl -s 'http://localhost:8055/auth/login' \
  -H 'Content-Type: application/json' \
  -d "{\"email\":\"the_uk1@outlook.com\",\"password\":\"Mygcdjmyxzg2026!\"}")

# 提取 token
ACCESS_TOKEN=$(echo $TOKEN_RESPONSE | grep -o '"access_token":"[^"]*' | sed 's/"access_token":"//')

if [ -n "$ACCESS_TOKEN" ]; then
    echo "✅ Directus Access Token 获取成功!"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "📋 在 n8n 中使用以下配置:"
    echo ""
    echo "Credential Type: Header Auth"
    echo "Name: Directus Admin Token"
    echo "Header Name: Authorization"
    echo "Header Value: Bearer $ACCESS_TOKEN"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "💡 提示: 这个 token 会在一段时间后过期"
    echo "   建议保存此 token 以便在 n8n 中使用"
    echo ""

    # 保存到文件
    echo $ACCESS_TOKEN > .directus-token
    echo "✅ Token 已保存到 .directus-token 文件"
    echo ""
else
    echo "❌ 获取 Token 失败"
    echo ""
    echo "响应信息:"
    echo $TOKEN_RESPONSE
    echo ""
    echo "请检查:"
    echo "1. Directus 是否正在运行: docker-compose ps directus"
    echo "2. 用户名密码是否正确"
    echo ""
fi
