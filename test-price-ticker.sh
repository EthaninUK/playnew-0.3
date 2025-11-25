#!/bin/bash

echo "======================================"
echo "Price Ticker功能测试"
echo "======================================"
echo ""

echo "1. 测试 API 端点..."
echo "URL: http://localhost:3001/api/market/prices"
echo ""
response=$(curl -s http://localhost:3001/api/market/prices)
echo "API 响应 (前3个币种):"
echo "$response" | python3 -c "import sys, json; data=json.load(sys.stdin); [print(f\"{i+1}. {c['symbol']}: \${c['price']:.2f} ({c['change24h']:+.2f}%)\") for i, c in enumerate(data[:3])]" 2>/dev/null || echo "API 返回fallback数据（价格为0）"
echo ""

echo "2. 检查页面渲染..."
page_html=$(curl -s http://localhost:3001/)
if echo "$page_html" | grep -q "bg-gray-900 border-b border-gray-800"; then
    echo "✅ PriceTicker 组件已渲染"
else
    echo "❌ PriceTicker 组件未找到"
fi
echo ""

echo "3. 检查 CSS 动画..."
if grep -q "animate-scroll" /Users/m1/PlayNew_0.3/frontend/app/globals.css; then
    echo "✅ 滚动动画 CSS 已添加"
else
    echo "❌ 滚动动画 CSS 未找到"
fi
echo ""

echo "4. 访问测试..."
echo "请在浏览器打开: http://localhost:3001"
echo ""

echo "======================================"
echo "测试完成！"
echo "======================================"
echo ""
echo "预期效果:"
echo "- 页面顶部（Header下方）显示深色横幅"
echo "- 横幅中显示加密货币价格信息"
echo "- 价格自动向左滚动"
echo "- 鼠标悬停时滚动暂停"
echo "- 每60秒自动更新价格"
