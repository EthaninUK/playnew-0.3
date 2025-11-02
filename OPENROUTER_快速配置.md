# OpenRouter 快速配置卡片

## 🚀 3 分钟快速上手

### 步骤 1: 获取 API Key
1. 访问 https://openrouter.ai/
2. 注册并登录
3. 前往 https://openrouter.ai/keys
4. 创建 API Key（格式：`sk-or-v1-...`）
5. 充值至少 $5（推荐 $10-20 用于测试）

### 步骤 2: 配置环境变量
编辑 `frontend/.env.local`：
```bash
AI_PROVIDER=openrouter
OPENROUTER_API_KEY=sk-or-v1-你的实际密钥
OPENROUTER_MODEL=anthropic/claude-3.5-sonnet
```

### 步骤 3: 重启服务
```bash
cd frontend
npm run dev
```

### 步骤 4: 测试
```bash
curl -X POST http://localhost:3000/api/ai/translate-and-summarize \
  -H "Content-Type: application/json" \
  -d '{"text":"Bitcoin surged today","title":"BTC News","source_language":"en","target_language":"zh"}'
```

**完成！** 现在你的 n8n 工作流会使用 OpenRouter API 🎉

---

## 💰 推荐模型配置

### 高性价比（推荐）
```bash
OPENROUTER_MODEL=anthropic/claude-3.5-sonnet
```
- 价格: $3/$15 per 1M tokens
- 质量: ⭐⭐⭐⭐⭐
- 速度: ⭐⭐⭐⭐
- 每篇新闻成本: ~$0.043

### 经济型（最便宜）
```bash
OPENROUTER_MODEL=anthropic/claude-3-haiku
```
- 价格: $0.25/$1.25 per 1M tokens
- 质量: ⭐⭐⭐⭐
- 速度: ⭐⭐⭐⭐⭐
- 每篇新闻成本: ~$0.0043（便宜 10 倍）

### 高端型（最强）
```bash
OPENROUTER_MODEL=openai/gpt-4-turbo
```
- 价格: $10/$30 per 1M tokens
- 质量: ⭐⭐⭐⭐⭐
- 速度: ⭐⭐⭐
- 每篇新闻成本: ~$0.15

---

## 📊 月度成本估算

### 每天处理 100 篇新闻

| 模型 | 每篇成本 | 每天成本 | 每月成本 |
|------|---------|---------|---------|
| Claude 3 Haiku | $0.004 | $0.40 | **$12** |
| Claude 3.5 Sonnet | $0.043 | $4.30 | **$129** |
| GPT-4 Turbo | $0.15 | $15.00 | **$450** |

**建议**: 先用 Haiku 测试，稳定后升级到 Sonnet

---

## 🔍 监控使用

查看实时消费：https://openrouter.ai/activity

设置预算限制：https://openrouter.ai/settings

---

## ⚠️ 常见问题

### Q: 提示 "API Key not configured"
**A:** 确认 `.env.local` 中设置了 `OPENROUTER_API_KEY`，并重启了 `npm run dev`

### Q: 提示 "Insufficient credits"
**A:** 前往 https://openrouter.ai/credits 充值

### Q: n8n 工作流不工作
**A:**
1. 检查 Frontend 服务是否运行（http://localhost:3000）
2. 检查 AI_PROVIDER 是否设置为 `openrouter`
3. 查看 n8n 节点日志

### Q: 如何查看使用了多少钱？
**A:** https://openrouter.ai/activity 实时显示每次 API 调用的成本

---

## 📝 完整配置模板

```bash
# ============================================
# AI Provider 配置
# ============================================
# 可选值: openai | anthropic | deepseek | openrouter
AI_PROVIDER=openrouter

# ============================================
# OpenRouter 配置
# ============================================
# 获取 API Key: https://openrouter.ai/keys
OPENROUTER_API_KEY=sk-or-v1-abc123xyz...

# 推荐模型:
# - anthropic/claude-3-haiku (最便宜)
# - anthropic/claude-3.5-sonnet (推荐，性价比高)
# - openai/gpt-4-turbo (最强)
# 完整列表: https://openrouter.ai/docs#models
OPENROUTER_MODEL=anthropic/claude-3.5-sonnet

# ============================================
# 应用配置
# ============================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🎯 优化建议

### 降低成本
1. ✅ 使用 Claude 3 Haiku 处理简单任务
2. ✅ 在 n8n 中添加去重逻辑，避免重复翻译
3. ✅ 限制每次批处理数量（3-5 篇）
4. ✅ 只翻译最近 24 小时的新闻

### 提高质量
1. ✅ 使用 Claude 3.5 Sonnet 获得最佳翻译
2. ✅ 添加 Quality Check 节点过滤低质量内容
3. ✅ 增加 AI 温度参数的稳定性（temperature: 0.3）

### 提高稳定性
1. ✅ 在 n8n 中添加错误重试节点
2. ✅ 设置合理的超时时间（60 秒）
3. ✅ 使用 "Split In Batches" 节点分批处理

---

## 📚 相关文档

- 完整文档: [OPENROUTER_SETUP.md](./OPENROUTER_SETUP.md)
- n8n 配置: [N8N_SETUP_GUIDE.md](./N8N_SETUP_GUIDE.md)
- API 文档: https://openrouter.ai/docs

---

**提示**: 首次使用建议充值 $10-20 用于测试，确认工作流稳定后再增加预算 💡
