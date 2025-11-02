# OpenRouter API 配置指南

## 什么是 OpenRouter？

OpenRouter 是一个统一的 AI API 网关，提供对多个 AI 模型的访问，包括：
- OpenAI GPT-4, GPT-3.5
- Anthropic Claude 3.5 Sonnet, Claude 3 Opus
- Google PaLM, Gemini
- Meta Llama
- 其他开源模型

**优势**：
- ✅ **单一 API Key** - 访问所有模型
- ✅ **灵活计费** - 按使用付费，无订阅费
- ✅ **价格透明** - 查看每个模型的实时价格
- ✅ **高可用性** - 自动路由到可用的模型
- ✅ **性价比高** - 通常比直接调用便宜

---

## 快速开始

### 1. 获取 OpenRouter API Key

1. 访问 [OpenRouter](https://openrouter.ai/)
2. 注册账号
3. 前往 [API Keys 页面](https://openrouter.ai/keys)
4. 点击 "Create Key" 创建新的 API Key
5. 复制 API Key（格式：`sk-or-v1-...`）

### 2. 充值账户

1. 前往 [Credits 页面](https://openrouter.ai/credits)
2. 选择充值金额（建议先充值 $5-10 测试）
3. 使用信用卡或其他支付方式完成充值

### 3. 配置环境变量

在 `frontend/.env.local` 中添加：

```bash
# 设置 AI Provider 为 openrouter
AI_PROVIDER=openrouter

# OpenRouter API Key
OPENROUTER_API_KEY=sk-or-v1-your-actual-key-here

# 选择模型（可选，默认 anthropic/claude-3.5-sonnet）
OPENROUTER_MODEL=anthropic/claude-3.5-sonnet
```

### 4. 重启 Next.js 服务

```bash
cd frontend
npm run dev
```

---

## 可用模型

### 推荐模型（性价比高）

| 模型 | 价格/1M tokens | 适用场景 |
|------|---------------|---------|
| `anthropic/claude-3.5-sonnet` | $3 / $15 | 综合任务，推荐 ⭐ |
| `anthropic/claude-3-haiku` | $0.25 / $1.25 | 快速、简单任务 |
| `openai/gpt-4-turbo` | $10 / $30 | 复杂分析 |
| `openai/gpt-3.5-turbo` | $0.50 / $1.50 | 基础翻译 |
| `google/gemini-pro` | $0.125 / $0.375 | 低成本选择 |
| `meta-llama/llama-3.1-70b-instruct` | $0.52 / $0.75 | 开源模型 |

查看完整模型列表：https://openrouter.ai/docs#models

### 切换模型

在 `.env.local` 中修改 `OPENROUTER_MODEL`：

```bash
# 使用 Claude 3.5 Sonnet（推荐）
OPENROUTER_MODEL=anthropic/claude-3.5-sonnet

# 使用 GPT-4 Turbo
OPENROUTER_MODEL=openai/gpt-4-turbo

# 使用更便宜的 Haiku
OPENROUTER_MODEL=anthropic/claude-3-haiku

# 使用 Gemini Pro
OPENROUTER_MODEL=google/gemini-pro
```

---

## 使用场景

### n8n 工作流

OpenRouter 已完全集成到所有 4 个 AI API 端点：

1. **翻译和摘要** - `/api/ai/translate-and-summarize`
   - 英译中新闻翻译
   - 自动生成摘要
   - 提取关键词

2. **内容分类** - `/api/ai/categorize`
   - 自动分类到 DeFi、NFT、Layer2 等
   - 提取标签
   - 置信度评分

3. **策略提取** - `/api/ai/extract-strategy`
   - 从文章中提取结构化策略信息
   - 步骤分解
   - 风险评估

4. **质量评分** - `/api/ai/quality-score`
   - 评估内容质量
   - 提供改进建议

### n8n 节点配置

在 n8n 工作流中的 "AI Translate & Summarize" 节点：

```
URL: http://host.docker.internal:3000/api/ai/translate-and-summarize
Method: POST
Body (JSON):
{
  "text": {{ $json.content }},
  "title": {{ $json.title }},
  "source_language": "en",
  "target_language": "zh"
}
```

无需修改 n8n 配置，只需在 `.env.local` 中切换 AI Provider！

---

## 价格估算

### 新闻翻译工作流成本

假设每篇新闻平均 1000 字：

| 操作 | 输入 tokens | 输出 tokens | 成本（Claude 3.5 Sonnet） |
|------|------------|------------|------------------------|
| 翻译 | 1500 | 2000 | ~$0.04 |
| 分类 | 500 | 100 | ~$0.003 |
| **每篇总计** | - | - | **~$0.043** |

**每天处理 100 篇新闻 = $4.3**
**每月 3000 篇 = $129**

### 使用 Claude 3 Haiku（更便宜）

| 操作 | 成本 |
|------|-----|
| 翻译 | ~$0.004 |
| 分类 | ~$0.0003 |
| **每篇总计** | **~$0.0043** |

**每月 3000 篇 = $12.9**（便宜 10 倍！）

---

## 监控使用情况

### 查看消费

1. 访问 [OpenRouter Activity](https://openrouter.ai/activity)
2. 查看实时 API 调用
3. 按模型、时间筛选
4. 下载消费报告

### 设置预算限制

1. 前往 [Settings](https://openrouter.ai/settings)
2. 设置 "Spending Limit"
3. 设置警报阈值

---

## 调试和故障排除

### 检查 API 是否工作

```bash
# 测试翻译端点
curl -X POST http://localhost:3000/api/ai/translate-and-summarize \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Bitcoin price surged to new highs today.",
    "title": "Bitcoin Rally",
    "source_language": "en",
    "target_language": "zh"
  }'
```

### 常见错误

#### 错误 1: "OPENROUTER_API_KEY not configured"

**原因**: 环境变量未设置

**解决**:
1. 检查 `.env.local` 中是否有 `OPENROUTER_API_KEY`
2. 重启 Next.js 服务
3. 确认没有拼写错误

#### 错误 2: "Insufficient credits"

**原因**: OpenRouter 账户余额不足

**解决**:
1. 访问 https://openrouter.ai/credits
2. 充值账户
3. 等待 1-2 分钟生效

#### 错误 3: "Model not found"

**原因**: 模型名称错误或不可用

**解决**:
1. 检查 `OPENROUTER_MODEL` 格式
2. 查看可用模型：https://openrouter.ai/docs#models
3. 使用默认值：`anthropic/claude-3.5-sonnet`

#### 错误 4: 返回 429 Rate Limit

**原因**: API 调用频率过高

**解决**:
1. 在 n8n 中降低批处理速度
2. 增加节点之间的延迟
3. 升级 OpenRouter 账户限额

---

## 最佳实践

### 1. 成本优化

- ✅ 使用 **Claude 3 Haiku** 进行简单翻译
- ✅ 使用 **Claude 3.5 Sonnet** 进行复杂分析
- ✅ 批量处理减少 API 调用次数
- ❌ 避免重复翻译相同内容

### 2. 质量优化

- 使用 Claude 3.5 Sonnet 获得最佳翻译质量
- 对于策略提取使用更强大的模型
- 简单分类可以使用便宜的模型

### 3. 性能优化

- 在 n8n 中使用 "Split In Batches" 节点
- 设置合理的超时时间（60s）
- 添加错误重试机制

### 4. 安全性

- ⚠️ 不要将 API Key 提交到 Git
- ⚠️ 使用环境变量存储敏感信息
- ⚠️ 定期轮换 API Key

---

## 示例配置

### 完整的 .env.local 配置

```bash
# AI Provider 配置
AI_PROVIDER=openrouter

# OpenRouter 配置
OPENROUTER_API_KEY=sk-or-v1-abc123xyz...
OPENROUTER_MODEL=anthropic/claude-3.5-sonnet

# 应用 URL（用于 OpenRouter referer）
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### n8n 工作流示例

完整的工作流配置见：
- `n8n/workflows/crypto-news-scraper-v3-fixed.json`
- 已配置使用 OpenRouter API

---

## 对比其他 AI Providers

| 特性 | OpenRouter | OpenAI | Anthropic | DeepSeek |
|------|-----------|--------|-----------|----------|
| 模型选择 | ⭐⭐⭐⭐⭐ 所有主流模型 | ⭐⭐⭐ GPT 系列 | ⭐⭐⭐ Claude 系列 | ⭐⭐ DeepSeek |
| 价格 | ⭐⭐⭐⭐⭐ 灵活 | ⭐⭐⭐ 订阅制 | ⭐⭐⭐⭐ 按量付费 | ⭐⭐⭐⭐⭐ 最便宜 |
| 可用性 | ⭐⭐⭐⭐⭐ 高 | ⭐⭐⭐⭐ 中 | ⭐⭐⭐⭐ 中 | ⭐⭐⭐ 低 |
| 中文支持 | ⭐⭐⭐⭐⭐ 优秀 | ⭐⭐⭐⭐ 良好 | ⭐⭐⭐⭐⭐ 优秀 | ⭐⭐⭐⭐⭐ 优秀 |

**推荐使用 OpenRouter** 作为主要 AI Provider！

---

## 技术细节

### API 端点

```
https://openrouter.ai/api/v1/chat/completions
```

### 兼容性

OpenRouter API 与 OpenAI API 完全兼容，使用相同的：
- 请求格式
- 响应格式
- SDK 接口

### Headers

```javascript
{
  'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
  'Content-Type': 'application/json',
  'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL,
  'X-Title': 'CryptoPlay News Scraper'
}
```

- `HTTP-Referer`: 用于追踪 API 使用来源
- `X-Title`: 应用名称，显示在 OpenRouter dashboard

---

## 更新日志

### 2025-10-27
- ✅ 添加 OpenRouter 支持到所有 4 个 AI 端点
- ✅ 创建配置文档
- ✅ 更新 .env.local 模板
- ✅ 支持动态模型切换

---

## 相关资源

- [OpenRouter 官网](https://openrouter.ai/)
- [API 文档](https://openrouter.ai/docs)
- [模型列表](https://openrouter.ai/docs#models)
- [价格对比](https://openrouter.ai/docs#models)
- [使用示例](https://github.com/OpenRouterTeam/openrouter-examples)

---

## 获取帮助

如有问题：
1. 查看 [OpenRouter Discord](https://discord.gg/openrouter)
2. 检查 [Status Page](https://status.openrouter.ai/)
3. 阅读 [FAQ](https://openrouter.ai/docs#faq)

---

**祝您使用愉快！🚀**
