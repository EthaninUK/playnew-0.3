# n8n 自动化工作流设置指南

## 📋 前提条件

✅ 所有服务已启动:
- Directus: http://localhost:8055
- Meilisearch: http://localhost:7700
- n8n: http://localhost:5678
- Next.js Frontend: http://localhost:3000

## 🚀 快速开始

### 步骤 1: 访问 n8n

```bash
# 打开浏览器访问
open http://localhost:5678
```

**登录信息:**
- 用户名: `admin`
- 密码: `Mygcdjmyxzg2026!`

### 步骤 2: 配置凭证 (Credentials)

#### 2.1 Directus Admin Token

**注意**: 新版 Directus 可能没有 "Access Tokens" 菜单，请使用以下方法:

**方法 1: 快速获取临时 Token (推荐用于测试)**

1. 运行获取 token 脚本:
   ```bash
   ./get-directus-token.sh
   ```

2. 复制输出的 Bearer token (包含 "Bearer " 前缀)

3. 在 n8n 中配置:
   - 点击右上角头像 → "Settings" → "Credentials"
   - 点击 "New"
   - 选择 "Header Auth"
   - 名称: `Directus Admin Token`
   - Header Name: `Authorization`
   - Header Value: `Bearer eyJhbGci...` (粘贴完整 token)
   - 保存

**注意**: 这个 token 会在 15 分钟后过期。如果工作流执行失败，重新运行脚本获取新 token。

**方法 2: 在工作流中自动登录 (推荐用于生产)**

在工作流开始处添加一个 "HTTP Request" 节点:
- URL: `http://directus:8055/auth/login`
- Method: `POST`
- Body: `{"email":"the_uk1@outlook.com","password":"Mygcdjmyxzg2026!"}`

然后在后续节点中使用: `{{ $node["Login"].json["data"]["access_token"] }}`

详细说明请查看: [DIRECTUS_TOKEN_GUIDE.md](./DIRECTUS_TOKEN_GUIDE.md)

#### 2.2 AI API Keys (选择一个配置)

**选项 A: OpenAI**
```bash
# 在 frontend/.env.local 中添加
OPENAI_API_KEY=sk-...
AI_PROVIDER=openai
```

**选项 B: Anthropic Claude**
```bash
# 在 frontend/.env.local 中添加
ANTHROPIC_API_KEY=sk-ant-...
AI_PROVIDER=anthropic
```

**选项 C: DeepSeek (中国大陆推荐)**
```bash
# 在 frontend/.env.local 中添加
DEEPSEEK_API_KEY=sk-...
AI_PROVIDER=deepseek
```

### 步骤 3: 导入工作流

#### 3.1 导入 "Crypto News Scraper" 工作流

1. 在 n8n 主界面，点击左上角 "+" → "Import from File"
2. 选择文件: `n8n/workflows/crypto-news-scraper.json`
3. 点击 "Import"

#### 3.2 导入 "Strategy Discovery" 工作流

1. 重复上述步骤
2. 选择文件: `n8n/workflows/strategy-discovery.json`

### 步骤 4: 配置工作流

#### 配置 "Crypto News Scraper"

1. 打开工作流
2. 找到 "Save to Directus" 节点
3. 在 "Credentials" 部分，选择之前创建的 "Directus Admin Token"
4. 点击右上角 "Save" 保存工作流

#### 配置 "Strategy Discovery"

1. 打开工作流
2. 找到 "Save Strategy to Directus" 节点
3. 选择 "Directus Admin Token" 凭证
4. 保存工作流

### 步骤 5: 测试工作流

#### 测试方式 1: 手动触发

1. 打开 "Crypto News Scraper" 工作流
2. 点击右上角 "Execute Workflow" 按钮
3. 等待执行完成 (可能需要 1-2 分钟)
4. 查看执行结果

#### 测试方式 2: 检查 Directus

```bash
# 查看抓取的新闻
curl -s 'http://localhost:8055/items/news?limit=5&sort=-date_created'
```

#### 测试方式 3: 查看前端

```bash
# 访问前端查看新闻
open http://localhost:3000/news
```

### 步骤 6: 启用自动执行

1. 在工作流界面，点击右上角 "Inactive" 开关
2. 状态变为 "Active" 后，工作流将按计划自动运行
3. Crypto News Scraper: 每小时运行一次
4. Strategy Discovery: 每 12 小时运行一次

---

## 🔧 自定义配置

### 修改抓取频率

#### 修改 News Scraper 频率

1. 打开 "Crypto News Scraper" 工作流
2. 双击 "Schedule Trigger" 节点
3. 修改 "Interval" 设置 (例如: 每 2 小时 → `hoursInterval: 2`)
4. 保存

#### 修改 Strategy Discovery 频率

同样方法修改 "Strategy Discovery" 工作流的触发器

### 添加更多数据源

#### 添加 Cointelegraph RSS

1. 在 "Crypto News Scraper" 工作流中
2. 复制 "Fetch CoinDesk RSS" 节点
3. 修改 URL 为: `https://cointelegraph.com/rss`
4. 修改 Function 节点中的 `source` 为 `'Cointelegraph'`
5. 连接节点到主流程

#### 添加 The Block RSS

重复上述步骤，使用 URL: `https://www.theblock.co/rss.xml`

### 配置内容过滤

在 "Clean RSS Data" Function 节点中修改过滤条件:

```javascript
// 修改最小字数
const minWords = 100; // 改为你想要的数值

// 修改时间范围
const hoursAgo = 48; // 抓取 48 小时内的内容
const cutoffDate = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);

// 添加关键词过滤
const requiredKeywords = ['defi', 'crypto', 'blockchain'];
const hasKeywords = requiredKeywords.some(kw =>
  entry.content.toLowerCase().includes(kw)
);
```

---

## 🐛 故障排除

### 问题 1: "Cannot connect to Directus"

**解决方案:**
```bash
# 检查 Directus 是否运行
docker-compose ps directus

# 如果未运行，启动它
docker-compose up -d directus

# 检查健康状态
docker-compose logs directus --tail=50
```

### 问题 2: "AI API request failed"

**检查清单:**
- ✅ 确认 AI API Key 已在 `frontend/.env.local` 中配置
- ✅ 确认 Next.js 前端正在运行 (`npm run dev`)
- ✅ 确认 API Key 有效且有余额

**测试 AI API:**
```bash
# 测试翻译 API
curl -X POST http://localhost:3000/api/ai/translate-and-summarize \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Bitcoin reaches new all-time high",
    "title": "BTC ATH",
    "source_language": "en",
    "target_language": "zh"
  }'
```

### 问题 3: "Workflow execution timeout"

**解决方案:**
1. 在 HTTP Request 节点中增加 timeout:
   - Options → Timeout: `60000` (60秒)

2. 如果 AI 处理太慢，考虑:
   - 减少批处理大小 (Split In Batches: 5 → 3)
   - 使用更快的 AI 模型 (gpt-4-turbo → gpt-3.5-turbo)

### 问题 4: "Rate limiting"

如果遇到 API 限流:

```javascript
// 在 Function 节点中添加延迟
await new Promise(resolve => setTimeout(resolve, 2000)); // 等待 2 秒
```

或者在 n8n 中添加 "Wait" 节点:
- 拖入 "Wait" 节点
- 设置: 2 seconds
- 插入到 HTTP Request 之间

### 问题 5: "Duplicate content"

如果发现重复内容:

```javascript
// 在 Clean RSS Data 中添加去重逻辑
const seenTitles = new Set();

for (const item of items) {
  const titleHash = item.title.toLowerCase().trim();

  if (seenTitles.has(titleHash)) {
    continue; // 跳过重复
  }

  seenTitles.add(titleHash);
  cleanedData.push(item);
}
```

---

## 📊 监控和日志

### 查看执行历史

1. 在 n8n 主界面，点击左侧 "Executions"
2. 查看所有工作流的执行记录
3. 点击任意执行记录查看详细信息

### 查看错误日志

```bash
# 查看 n8n 日志
docker-compose logs n8n --tail=100 -f

# 查看 Directus 日志
docker-compose logs directus --tail=100 -f

# 查看 Next.js 日志 (在 frontend 目录)
cd frontend && npm run dev
```

### 设置邮件通知 (可选)

1. 在工作流末尾添加 "Send Email" 节点
2. 配置 SMTP 设置
3. 在错误分支上连接该节点

---

## 🎯 性能优化

### 1. 批量处理优化

```javascript
// 在 Split In Batches 中
batchSize: 5  // 降低批次大小可以更快看到结果
```

### 2. 并行处理

如果有多个数据源，可以使用 "Merge" 节点并行处理:

```
Trigger
  ↓
  ├→ Source 1 → Process
  ├→ Source 2 → Process
  └→ Source 3 → Process
      ↓
    Merge
      ↓
   Continue
```

### 3. 缓存优化

在 Function 节点中添加内存缓存:

```javascript
// 使用全局缓存避免重复处理
if (!global.processedUrls) {
  global.processedUrls = new Set();
}

// 检查是否已处理
if (global.processedUrls.has(url)) {
  return []; // 跳过
}

global.processedUrls.add(url);
```

---

## 🔐 安全建议

1. **修改默认密码**
   ```bash
   # 在 docker-compose.yml 中修改
   N8N_BASIC_AUTH_PASSWORD: 'your-strong-password'
   ```

2. **使用环境变量管理敏感信息**
   ```bash
   # 不要在工作流中硬编码 API keys
   # 使用 n8n Credentials 管理
   ```

3. **限制访问**
   ```bash
   # 如果在生产环境，配置防火墙
   # 只允许特定 IP 访问 n8n
   ```

---

## 📈 下一步

### 阶段 1: 基础运行 (第 1 天)
- ✅ 导入并测试工作流
- ✅ 验证数据能正确保存到 Directus
- ✅ 查看前端显示效果

### 阶段 2: 优化调整 (第 2-3 天)
- 添加更多数据源
- 优化 AI prompts 提高翻译质量
- 调整内容过滤规则

### 阶段 3: 自动化上线 (第 4-7 天)
- 启用自动执行
- 监控执行日志
- 添加人工审核流程
- 配置错误通知

---

## 📚 相关资源

- [n8n 官方文档](https://docs.n8n.io/)
- [Directus API 文档](https://docs.directus.io/reference/introduction.html)
- [工作流设计方案](./N8N_WORKFLOW_PLAN.md)
- [项目快速启动](./QUICK_START.md)

---

## 💡 常见用例

### 用例 1: 只抓取特定主题的新闻

修改 Function 节点添加主题过滤:

```javascript
const targetTopics = ['defi', 'nft', 'layer2'];
const hasTargetTopic = targetTopics.some(topic =>
  entry.title.toLowerCase().includes(topic) ||
  entry.content.toLowerCase().includes(topic)
);

if (hasTargetTopic && wordCount > 50) {
  cleanedData.push({ json: entry });
}
```

### 用例 2: 自动标记重要新闻

在 Prepare Directus Data 节点中:

```javascript
// 判断是否为重要新闻
const importantKeywords = ['bitcoin', 'ethereum', 'sec', 'regulation'];
const isImportant = importantKeywords.some(kw =>
  title.toLowerCase().includes(kw)
);

// 设置 is_important 字段
values.boolean.push({
  name: 'is_important',
  value: isImportant
});
```

### 用例 3: 定时清理旧数据

创建新工作流 "Data Cleanup":

```javascript
// Schedule: 每天凌晨 2:00
// 删除 30 天前的草稿状态内容

const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

// HTTP Request to Directus
DELETE /items/news?filter[status][_eq]=draft&filter[date_created][_lt]=${thirtyDaysAgo.toISOString()}
```

---

**准备好了吗? 让我们开始吧! 🚀**

1. 访问 http://localhost:5678
2. 导入工作流
3. 配置凭证
4. 点击执行!
