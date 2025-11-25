#!/bin/bash

echo "🔍 验证会员系统数据库配置"
echo "================================"
echo ""

# 检查环境变量
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo "⚠️  需要设置 SUPABASE_URL 和 SUPABASE_SERVICE_ROLE_KEY 环境变量"
  echo ""
  echo "请在 .env.local 中配置："
  echo "SUPABASE_URL=https://your-project.supabase.co"
  echo "SUPABASE_SERVICE_ROLE_KEY=your-service-role-key"
  exit 1
fi

echo "1️⃣ 检查 playpass_balances 表..."
curl -s "$SUPABASE_URL/rest/v1/playpass_balances?select=*&limit=1" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" | node -p "
  const data = JSON.parse(require('fs').readFileSync(0));
  if (data.error) {
    '❌ playpass_balances 表不存在或无权限: ' + JSON.stringify(data.error);
  } else {
    '✅ playpass_balances 表存在';
  }
"
echo ""

echo "2️⃣ 检查 user_subscriptions 表..."
curl -s "$SUPABASE_URL/rest/v1/user_subscriptions?select=*&limit=1" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" | node -p "
  const data = JSON.parse(require('fs').readFileSync(0));
  if (data.error) {
    '❌ user_subscriptions 表不存在或无权限: ' + JSON.stringify(data.error);
  } else {
    '✅ user_subscriptions 表存在';
  }
"
echo ""

echo "3️⃣ 检查 playpass_transactions 表..."
curl -s "$SUPABASE_URL/rest/v1/playpass_transactions?select=*&limit=1" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" | node -p "
  const data = JSON.parse(require('fs').readFileSync(0));
  if (data.error) {
    '❌ playpass_transactions 表不存在或无权限: ' + JSON.stringify(data.error);
  } else {
    '✅ playpass_transactions 表存在';
  }
"
echo ""

echo "4️⃣ 检查 deduct_playpass RPC 函数..."
echo "   (需要手动在 Supabase Dashboard 中验证函数是否存在)"
echo ""

echo "================================"
echo "✨ 检查完成！"
echo ""
echo "如果有错误，请参考 MEMBERSHIP-PLAYPASS-SETUP.md 文档创建缺失的表和函数"
