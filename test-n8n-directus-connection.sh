#!/bin/bash

echo "🔍 测试 n8n 到 Directus 的连接..."
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "测试 1: 健康检查 (从 n8n 容器访问 Directus)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

docker exec playnew_03-n8n-1 wget -qO- http://directus:8055/server/health

echo ""
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "测试 2: 登录测试 (使用 curl)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 创建临时文件存储 JSON
cat > /tmp/login-payload.json << 'PAYLOAD'
{"email":"the_uk1@outlook.com","password":"Mygcdjmyxzg2026!"}
PAYLOAD

# 复制到容器并执行
docker cp /tmp/login-payload.json playnew_03-n8n-1:/tmp/login.json

docker exec playnew_03-n8n-1 sh -c "
  if command -v curl > /dev/null 2>&1; then
    curl -s -X POST http://directus:8055/auth/login \
      -H 'Content-Type: application/json' \
      -d @/tmp/login.json | grep -o '\"access_token\":\"[^\"]*' || echo '登录失败'
  else
    echo 'curl 不可用，使用 wget...'
    cat /tmp/login.json | \
    wget -qO- --post-file=/tmp/login.json \
      --header='Content-Type: application/json' \
      http://directus:8055/auth/login | \
    grep -o '\"access_token\":\"[^\"]*' || echo '登录失败'
  fi
"

rm /tmp/login-payload.json

echo ""
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "测试 3: 网络连接状态"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "检查 Docker 网络配置..."
docker network inspect playnew_03_default | grep -A 5 "playnew_03-n8n-1\|playnew_03-directus-1" | grep -E "Name|IPv4Address"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 结论:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "如果测试 1 显示 {\"status\":\"ok\"}, 说明网络连接正常"
echo "如果测试 2 显示 access_token, 说明登录成功"
echo ""
echo "在 n8n 中使用以下配置:"
echo "  URL: http://directus:8055/auth/login"
echo "  Method: POST"
echo "  Body: JSON 格式的登录信息"
echo ""
