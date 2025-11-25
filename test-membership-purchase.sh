#!/bin/bash

# PlayPass 会员购买测试脚本
# 需要先登录并获取测试用户的访问令牌

echo "🧪 PlayPass 会员购买测试"
echo "================================"
echo ""

# 配置
BASE_URL="http://localhost:3000"
MEMBERSHIP_ID="pro"  # 可改为 'max' 测试 Max 会员

echo "📝 测试配置:"
echo "   目标: $MEMBERSHIP_ID 会员"
echo "   价格: $([ "$MEMBERSHIP_ID" = "pro" ] && echo "69,900 PP" || echo "129,900 PP")"
echo ""

# 提示用户登录
echo "⚠️  请先在浏览器中登录 http://localhost:3000/auth/login"
echo "   然后在开发者工具中获取 Cookie"
echo ""
read -p "按 Enter 继续..."

echo ""
echo "1️⃣ 查询会员方案..."
curl -s "$BASE_URL/api/memberships" | node -p "
  const data = JSON.parse(require('fs').readFileSync(0));
  if (data.memberships) {
    console.log('可用会员方案:');
    data.memberships.forEach(m => {
      console.log(\`  - \${m.name} (Level \${m.level}): \${m.price_yearly_usd} USD/年\`);
    });
  } else {
    console.log('获取失败:', JSON.stringify(data));
  }
  '';
"

echo ""
echo "2️⃣ 查询当前余额..."
echo "   (需要登录状态，请手动测试)"

echo ""
echo "3️⃣ 购买会员 API 测试..."
echo "   POST $BASE_URL/api/membership/purchase"
echo "   Body: { membershipId: '$MEMBERSHIP_ID', membershipLevel: $([ "$MEMBERSHIP_ID" = "pro" ] && echo "1" || echo "2") }"
echo ""
echo "   请在浏览器中使用 Fetch 测试:"
echo ""
echo "   fetch('/api/membership/purchase', {"
echo "     method: 'POST',"
echo "     headers: { 'Content-Type': 'application/json' },"
echo "     body: JSON.stringify({"
echo "       membershipId: '$MEMBERSHIP_ID',"
echo "       membershipLevel: $([ "$MEMBERSHIP_ID" = "pro" ] && echo "1" || echo "2")"
echo "     })"
echo "   }).then(r => r.json()).then(console.log)"

echo ""
echo "================================"
echo "✨ 测试准备完成！"
echo ""
echo "建议测试流程:"
echo "1. 访问 /pricing 页面"
echo "2. 充值至少 70,000 PP"
echo "3. 点击 Pro 会员的'立即订阅'"
echo "4. 确认购买"
echo "5. 验证余额减少和会员状态更新"
