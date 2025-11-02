# n8n 数据抓取工作流设计方案

## 项目概述
为币圈玩法收集录平台设计自动化数据抓取和处理工作流，使用 n8n + AI 实现内容的自动采集、翻译、优化和发布。

## n8n 访问信息
- URL: http://localhost:5678
- 用户名: admin
- 密码: Mygcdjmyxzg2026!

---

## 核心工作流架构

### 工作流 1: 币圈资讯自动抓取 (Crypto News Scraper)

**触发器**: Schedule Trigger (每小时执行一次)

**数据源** (选择 3-5 个优质源):
1. CoinDesk (https://www.coindesk.com/)
2. Cointelegraph (https://cointelegraph.com/)
3. The Block (https://www.theblock.co/)
4. Decrypt (https://decrypt.co/)
5. Twitter/X 币圈 KOL 账号
6. Mirror.xyz 优质作者

**工作流步骤**:

```
1. Schedule Trigger (每小时)
   ↓
2. HTTP Request - 抓取多个数据源
   - CoinDesk RSS Feed
   - Cointelegraph API/RSS
   - The Block Articles
   ↓
3. Split In Batches (批量处理，每批 5 条)
   ↓
4. Function Node - 数据清洗和标准化
   - 提取标题、内容、来源、发布时间
   - 去除广告和无关内容
   - 检测重复内容 (基于标题相似度)
   ↓
5. IF Node - 判断内容质量
   - 检查字数 (> 100字)
   - 检查是否包含关键词
   - 检查发布时间 (24小时内)
   ↓
6. HTTP Request - 调用 AI 处理 API
   - 翻译成中文 (如果是英文)
   - 生成摘要
   - 提取关键词和标签
   - 判断分类 (DeFi, NFT, Layer2, etc.)
   ↓
7. Set Node - 构建 Directus 数据格式
   {
     "title": "translated_title",
     "content": "translated_content",
     "summary": "ai_generated_summary",
     "source": "source_name",
     "category": "auto_detected_category",
     "tags": ["tag1", "tag2"],
     "published_at": "original_publish_time",
     "status": "draft", // 需要人工审核
     "is_important": false,
     "view_count": 0
   }
   ↓
8. HTTP Request - POST to Directus
   - Endpoint: http://directus:8055/items/news
   - Method: POST
   - Headers: Authorization: Bearer {admin_token}
   ↓
9. Error Handling
   - 记录失败的抓取
   - 发送错误通知 (可选)
```

---

### 工作流 2: 币圈玩法自动发现 (Strategy Discovery)

**触发器**: Schedule Trigger (每天 2 次)

**数据源**:
1. Medium - DeFi/Crypto 标签文章
2. Substack 币圈 Newsletter
3. GitHub - 热门 DeFi 项目
4. Discord/Telegram 群组公告 (可选)

**工作流步骤**:

```
1. Schedule Trigger (每 12 小时)
   ↓
2. HTTP Request - 抓取策略相关内容
   - Medium API (tag: defi, crypto-strategy)
   - GitHub Trending (topic: defi)
   ↓
3. Function Node - 策略内容识别
   - 识别是否包含教程/策略描述
   - 提取步骤信息
   - 识别风险等级关键词
   ↓
4. IF Node - 过滤策略内容
   - 必须包含明确的操作步骤
   - 必须提到具体的协议/项目
   ↓
5. HTTP Request - AI 深度处理
   - 生成结构化的策略描述
   - 提取关键信息:
     * 所需资金
     * 预期收益 (APY range)
     * 风险等级 (1-5)
     * 操作步骤
     * 相关协议
   - 生成中文标题和描述
   ↓
6. Set Node - 构建 Directus 策略数据
   {
     "title": "strategy_title",
     "slug": "auto_generated_slug",
     "summary": "brief_summary",
     "content": "detailed_markdown_content",
     "category": "category_id",
     "risk_level": "1-5",
     "apy_min": 0,
     "apy_max": 100,
     "required_capital": "minimum_capital",
     "difficulty": "beginner/intermediate/advanced",
     "tags": ["tag1", "tag2"],
     "protocols": ["protocol_id_1"],
     "chains": ["chain_id_1"],
     "status": "draft"
   }
   ↓
7. HTTP Request - POST to Directus
   - Endpoint: http://directus:8055/items/strategies
```

---

### 工作流 3: 智能内容推荐和更新 (Content Updater)

**触发器**: Schedule Trigger (每天 1 次)

**功能**:
1. 更新已发布内容的相关性评分
2. 标记过时的策略
3. 推荐相关内容关联

**工作流步骤**:

```
1. Schedule Trigger (每天 08:00)
   ↓
2. HTTP Request - 获取所有已发布策略
   - GET /items/strategies?filter[status][_eq]=published
   ↓
3. Function Node - 计算内容时效性
   - 检查发布日期
   - 检查外部链接有效性
   - 检查提到的协议是否仍在运行
   ↓
4. IF Node - 判断是否需要更新
   - 超过 30 天未更新
   - 外部链接失效
   - 协议已关闭
   ↓
5. Set Node - 标记需要更新
   {
     "needs_update": true,
     "update_reason": "reason"
   }
   ↓
6. HTTP Request - PATCH Directus
   - 更新策略状态或添加标记
```

---

## AI 处理 API 端点设计

### 1. 内容翻译和摘要 API
**路径**: `/api/ai/translate-and-summarize`

```typescript
// frontend/app/api/ai/translate-and-summarize/route.ts
POST /api/ai/translate-and-summarize
{
  "text": "English content...",
  "source_language": "en",
  "target_language": "zh"
}

Response:
{
  "translated_text": "翻译后的内容...",
  "summary": "AI 生成的摘要",
  "keywords": ["关键词1", "关键词2"]
}
```

### 2. 内容分类 API
**路径**: `/api/ai/categorize`

```typescript
POST /api/ai/categorize
{
  "title": "Article title",
  "content": "Article content..."
}

Response:
{
  "category": "defi",
  "subcategory": "lending",
  "confidence": 0.95,
  "tags": ["Aave", "Compound", "Lending"]
}
```

### 3. 策略结构化提取 API
**路径**: `/api/ai/extract-strategy`

```typescript
POST /api/ai/extract-strategy
{
  "content": "Strategy description..."
}

Response:
{
  "title": "策略标题",
  "summary": "简要概述",
  "steps": [
    "步骤 1: ...",
    "步骤 2: ..."
  ],
  "risk_level": 3,
  "apy_range": { "min": 5, "max": 15 },
  "protocols": ["Uniswap", "Aave"],
  "chains": ["Ethereum", "Arbitrum"],
  "required_capital": "$1000+"
}
```

### 4. 内容质量评分 API
**路径**: `/api/ai/quality-score`

```typescript
POST /api/ai/quality-score
{
  "content": "Content to evaluate..."
}

Response:
{
  "score": 85,
  "factors": {
    "readability": 90,
    "informativeness": 85,
    "accuracy": 80,
    "structure": 90
  },
  "suggestions": [
    "添加更多数据支持",
    "优化段落结构"
  ]
}
```

---

## n8n 节点配置示例

### HTTP Request 节点 - 抓取 CoinDesk

```json
{
  "method": "GET",
  "url": "https://www.coindesk.com/arc/outboundfeeds/rss/",
  "options": {
    "timeout": 10000
  },
  "headerParameters": {
    "parameters": [
      {
        "name": "User-Agent",
        "value": "Mozilla/5.0 (compatible; CryptoPlayBot/1.0)"
      }
    ]
  }
}
```

### Function 节点 - 数据清洗

```javascript
// 清洗和标准化 RSS 数据
const items = $input.all();
const cleanedData = [];

for (const item of items) {
  const data = item.json;

  // 提取 RSS 数据
  const entry = {
    title: data.title || '',
    content: data.contentSnippet || data.content || '',
    link: data.link || '',
    source: 'CoinDesk',
    published_at: data.pubDate || new Date().toISOString(),
    raw_data: data
  };

  // 过滤条件
  const wordCount = entry.content.split(' ').length;
  const isRecent = new Date(entry.published_at) > new Date(Date.now() - 24 * 60 * 60 * 1000);

  if (wordCount > 50 && isRecent) {
    cleanedData.push({ json: entry });
  }
}

return cleanedData;
```

### HTTP Request 节点 - 调用 AI API

```json
{
  "method": "POST",
  "url": "http://host.docker.internal:3000/api/ai/translate-and-summarize",
  "bodyParameters": {
    "parameters": [
      {
        "name": "text",
        "value": "={{ $json.content }}"
      },
      {
        "name": "source_language",
        "value": "en"
      },
      {
        "name": "target_language",
        "value": "zh"
      }
    ]
  },
  "headerParameters": {
    "parameters": [
      {
        "name": "Content-Type",
        "value": "application/json"
      }
    ]
  }
}
```

### HTTP Request 节点 - POST to Directus

```json
{
  "method": "POST",
  "url": "http://directus:8055/items/news",
  "bodyParameters": {
    "parameters": [
      {
        "name": "title",
        "value": "={{ $json.translated_text }}"
      },
      {
        "name": "content",
        "value": "={{ $json.translated_content }}"
      },
      {
        "name": "summary",
        "value": "={{ $json.summary }}"
      },
      {
        "name": "source",
        "value": "={{ $json.source }}"
      },
      {
        "name": "category",
        "value": "={{ $json.category }}"
      },
      {
        "name": "status",
        "value": "draft"
      }
    ]
  },
  "headerParameters": {
    "parameters": [
      {
        "name": "Authorization",
        "value": "Bearer YOUR_DIRECTUS_ADMIN_TOKEN"
      },
      {
        "name": "Content-Type",
        "value": "application/json"
      }
    ]
  }
}
```

---

## 数据源配置

### RSS Feeds

```yaml
CoinDesk:
  url: "https://www.coindesk.com/arc/outboundfeeds/rss/"
  category: "综合资讯"

Cointelegraph:
  url: "https://cointelegraph.com/rss"
  category: "综合资讯"

The Block:
  url: "https://www.theblock.co/rss.xml"
  category: "行业分析"

Decrypt:
  url: "https://decrypt.co/feed"
  category: "NFT & Web3"
```

### API 数据源

```yaml
CryptoCompare News:
  url: "https://min-api.cryptocompare.com/data/v2/news/"
  api_key: "required"
  rate_limit: "50 calls/hour"

GitHub Trending:
  url: "https://api.github.com/search/repositories"
  query: "topic:defi+topic:ethereum"
  auth: "GitHub Token"
```

---

## 错误处理和监控

### 错误处理策略

1. **网络错误**: 重试 3 次，间隔 5 秒
2. **API 限流**: 等待并重试
3. **内容重复**: 跳过并记录
4. **AI 处理失败**: 保存原始数据，标记需要人工处理

### 监控指标

```
- 每小时抓取数量
- AI 处理成功率
- Directus 写入成功率
- 平均处理时间
- 错误日志
```

### Webhook 通知 (可选)

```
错误通知 → Telegram/Discord
每日摘要 → Email
```

---

## 部署和运行

### 1. 访问 n8n

```bash
# 访问 n8n Web 界面
open http://localhost:5678

# 登录信息
用户名: admin
密码: Mygcdjmyxzg2026!
```

### 2. 导入工作流

1. 点击左侧菜单 "Workflows"
2. 点击 "Import from File" 或 "Import from URL"
3. 选择工作流 JSON 文件

### 3. 配置凭证

在 n8n 中配置以下凭证:

1. **Directus Admin Token**
   - 获取方式: Directus Admin Panel → Settings → Access Tokens
   - 权限: Full Access

2. **AI API Keys** (选择一个或多个)
   - OpenAI API Key
   - Anthropic API Key
   - DeepSeek API Key

3. **其他 API Keys**
   - CryptoCompare API Key (可选)
   - GitHub Token (可选)

### 4. 启动工作流

1. 打开工作流
2. 点击右上角 "Active" 开关
3. 查看执行历史确认运行正常

---

## MCP Server 集成建议

可以使用以下 MCP servers 来增强 n8n 工作流:

### 1. MCP Server for Web Scraping
```bash
# 使用 Puppeteer MCP Server 进行更复杂的网页抓取
npm install @modelcontextprotocol/server-puppeteer
```

**用途**:
- 抓取需要 JavaScript 渲染的页面
- 截图保存网页内容
- 模拟用户交互

### 2. MCP Server for Database Operations
```bash
# 直接操作 PostgreSQL/Supabase
npm install @modelcontextprotocol/server-postgres
```

**用途**:
- 直接查询数据库避免重复
- 批量更新数据
- 执行复杂的数据分析

### 3. MCP Server for File Operations
```bash
# 文件处理和存储
npm install @modelcontextprotocol/server-filesystem
```

**用途**:
- 保存抓取的原始数据
- 管理工作流日志
- 处理图片和附件

### 4. MCP Server for AI Services
```bash
# AI 服务集成
npm install @modelcontextprotocol/server-anthropic
```

**用途**:
- 统一的 AI 调用接口
- 自动选择最优 AI 模型
- 处理 AI 响应和错误

---

## 下一步行动

### 立即执行:
1. ✅ 访问 n8n (http://localhost:5678)
2. 创建第一个工作流: "Crypto News Scraper"
3. 创建 AI 处理 API 端点
4. 测试端到端流程

### 本周完成:
1. 完善所有 3 个核心工作流
2. 添加错误处理和通知
3. 优化 AI prompt 提高内容质量
4. 设置监控和日志

### 持续优化:
1. 添加更多数据源
2. 改进内容去重算法
3. 增加更多自动化审核规则
4. 实现 A/B 测试不同的 AI 模型

---

## 参考资源

- [n8n 官方文档](https://docs.n8n.io/)
- [Directus API 文档](https://docs.directus.io/reference/introduction.html)
- [OpenAI API 文档](https://platform.openai.com/docs/api-reference)
- [RSS Feed 标准](https://www.rssboard.org/rss-specification)
