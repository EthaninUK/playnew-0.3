# n8n 工作流故障排查指南

## 🔴 你遇到的问题

从截图中看到：
- **错误**: "Problem executing workflow - The workflow has issues and cannot be executed for that reason. Please fix them first."
- **节点**: "Generate KOL Queries" 节点有错误标记

---

## ✅ 解决方案

### 方案 1: 使用修复版工作流（推荐）

我已经创建了一个简化的修复版本：

**文件**: `twitter-gossip-collector-fixed.json`

**修复内容**:
1. ✅ 移除了 OpenAI 节点（可选功能，避免配置复杂度）
2. ✅ 简化了 Twitter 节点配置
3. ✅ 修复了 HTTP Request 节点的 JSON 格式
4. ✅ 减少了 KOL 数量（从 20+ 降到 5 个，测试用）
5. ✅ 降低了互动量阈值（从 50 降到 10，方便测试）

**导入步骤**:

1. 在 n8n 中删除当前有问题的工作流
2. 点击右上角 **"+" → "Import from File"**
3. 选择 **`twitter-gossip-collector-fixed.json`**
4. 配置 Twitter 凭证

---

### 方案 2: 手动修复当前工作流

如果你想保留当前工作流，按以下步骤修复：

#### 步骤 1: 修复 "Generate KOL Queries" 节点

**问题**: 可能是 JavaScript 代码格式问题

**解决方法**:

1. 点击 "Generate KOL Queries" 节点
2. 删除所有代码
3. 粘贴以下简化版代码：

```javascript
// 简化版 - 仅5个KOL用于测试
const kols = [
  { username: 'VitalikButerin', name: 'Vitalik', weight: 100 },
  { username: 'WuBlockchain', name: '吴说', weight: 95 },
  { username: 'zachxbt', name: 'ZachXBT', weight: 95 },
  { username: 'lookonchain', name: 'Lookonchain', weight: 90 },
  { username: 'whale_alert', name: 'Whale Alert', weight: 85 }
];

const keywords = ['rumor', 'scam', 'hack', '传闻', '跑路'];

const results = kols.map(kol => ({
  json: {
    kolUsername: kol.username,
    kolName: kol.name,
    kolWeight: kol.weight,
    searchQuery: `from:${kol.username} (${keywords.join(' OR ')})`
  }
}));

return results;
```

4. 点击 "Execute Node" 测试
5. 应该看到 5 个输出项

#### 步骤 2: 修复 "Twitter Search" 节点

**问题**: Twitter 节点配置可能不兼容

**解决方法**:

1. 点击 "Twitter Search" 节点
2. 确保配置如下：
   - **Resource**: Tweet
   - **Operation**: Search
   - **Search Text**: `={{ $json.searchQuery }}`
   - **Return All**: OFF
   - **Limit**: 10
3. 配置 Twitter 凭证（见下文）

#### 步骤 3: 删除 OpenAI 相关节点（可选）

如果不需要 AI 分析，可以简化工作流：

1. 删除以下节点：
   - "Needs AI Analysis?"
   - "OpenAI Analysis"
   - "Merge AI Results"
   - "Merge Branches"

2. 直接连接：
   ```
   Filter & Score → Publish to Directus → Summary Stats
   ```

#### 步骤 4: 修复 "Publish to Directus" 节点

**问题**: JSON Body 格式可能有问题

**解决方法**:

1. 点击 "Publish to Directus" 节点
2. 选择 **"Specify Body"** → **"Using JSON"**
3. 粘贴简化版 JSON：

```json
{
  "title": "={{ $json.text.substring(0, 100) }}",
  "summary": "={{ $json.text.substring(0, 200) }}",
  "content": "=# Twitter爆料\n\n**来源**: @{{ $json.author }}\n**热度**: {{ $json.engagement }}\n\n{{ $json.text }}",
  "source": "=Twitter @{{ $json.author }}",
  "source_type": "twitter",
  "url": "={{ $json.url }}",
  "slug": "=twitter-{{ $json.tweetId }}",
  "news_type": "gossip",
  "credibility_score": "={{ $json.credibilityScore }}",
  "verification_status": "unverified",
  "gossip_tags": ["Twitter八卦"],
  "status": "={{ $json.credibilityScore >= 60 ? 'published' : 'draft' }}",
  "category": "crypto-general",
  "published_at": "={{ $now.toISO() }}"
}
```

---

## 🔑 配置 Twitter 凭证

### 如果你有 Twitter Bearer Token

1. 点击 Twitter Search 节点
2. 在 "Credential to connect with" 下拉框中选择 **"Create New Credential"**
3. 选择 **"Twitter OAuth2 API"**
4. 在弹出的窗口中：
   - **Name**: `Twitter Gossip Collector`
   - **Authentication Type**: 选择 **"Bearer Token"**
   - **Access Token**: 粘贴你的 Bearer Token

5. 点击 **"Save"**

### 如果你没有 Twitter API

**临时解决方案**: 先跳过 Twitter 节点测试

1. 禁用 "Schedule Trigger" 节点
2. 在 "Generate KOL Queries" 节点后添加一个 "Set" 节点
3. 手动设置测试数据：

```json
{
  "tweetId": "123456789",
  "author": "VitalikButerin",
  "authorName": "Vitalik Buterin",
  "text": "This is a test rumor about a crypto project",
  "url": "https://twitter.com/VitalikButerin/status/123456789",
  "createdAt": "2025-01-06T00:00:00.000Z",
  "engagement": 500,
  "likes": 300,
  "retweets": 150,
  "replies": 50,
  "credibilityScore": 75,
  "kolWeight": 100
}
```

4. 直接测试 "Publish to Directus" 节点

---

## 🧪 测试步骤

### 逐个节点测试

1. **测试 "Generate KOL Queries"**
   ```
   点击节点 → 点击 "Execute Node"

   ✅ 应该看到: 5个输出项，每个包含 kolUsername, searchQuery 等
   ```

2. **测试 "Twitter Search"** (需要配置凭证)
   ```
   点击 "Execute previous nodes"

   ✅ 应该看到: Twitter API 返回的推文数据
   ❌ 如果报错 401: 凭证配置错误
   ❌ 如果报错 429: Rate limit 达到上限，等待15分钟
   ```

3. **测试 "Filter & Score"**
   ```
   点击 "Execute previous nodes"

   ✅ 应该看到: 过滤后的推文，包含 credibilityScore
   ```

4. **测试 "Publish to Directus"**
   ```
   确保环境变量已配置:
   - DIRECTUS_URL
   - DIRECTUS_TOKEN

   点击 "Execute previous nodes"

   ✅ 应该看到: 返回的 Directus 记录 (包含 id)
   ❌ 如果报错 401: Token 无效
   ❌ 如果报错 400: JSON 格式错误
   ```

5. **测试整个工作流**
   ```
   点击右上角 "Execute Workflow"

   观察每个节点的状态:
   - 绿色勾 ✅ = 成功
   - 红色叉 ❌ = 失败
   ```

---

## 🔍 常见错误信息

### 错误 1: "Node has issues"

**原因**: 节点配置不完整或有语法错误

**解决方法**:
- 点击节点查看具体错误提示
- 检查所有必填字段是否填写
- 检查表达式语法（`={{ }}` 格式）

### 错误 2: "Credentials are not set"

**原因**: 未配置或配置错误

**解决方法**:
- 点击节点 → Credentials → Create New
- 填写正确的 API Key/Token
- 测试连接

### 错误 3: "Cannot read property of undefined"

**原因**: 上游节点数据结构不匹配

**解决方法**:
- 点击上游节点查看输出数据结构
- 调整当前节点的数据访问路径
- 使用 `$json.field || 'default'` 提供默认值

### 错误 4: "ECONNREFUSED"

**原因**: 无法连接到 Directus

**解决方法**:
- 检查 `DIRECTUS_URL` 环境变量
- 如果 n8n 在 Docker 中，使用 `http://host.docker.internal:8055`
- 确保 Directus 正在运行：`docker ps | grep directus`

---

## 📋 环境变量检查清单

在 n8n Docker 容器中设置环境变量：

```bash
# 检查环境变量是否设置
docker exec playnew-n8n env | grep DIRECTUS
docker exec playnew-n8n env | grep TWITTER
```

**应该看到**:
```
DIRECTUS_URL=http://host.docker.internal:8055
DIRECTUS_TOKEN=你的token
TWITTER_BEARER_TOKEN=你的token  # 可选
```

**如果没有，重新设置**:

编辑 `.env` 文件，然后重启：
```bash
docker-compose -f docker-compose.n8n.yml restart
```

---

## 🆘 终极解决方案

如果以上方法都无效：

### 选项 1: 完全重置

```bash
# 停止 n8n
docker-compose -f docker-compose.n8n.yml down

# 删除数据 (会丢失所有工作流!)
rm -rf n8n-data/

# 重新启动
./start-n8n.sh

# 导入修复版工作流
# 访问 http://localhost:5678
# Import: twitter-gossip-collector-fixed.json
```

### 选项 2: 使用 Node.js 采集器

如果 n8n 配置太复杂，可以使用更简单的 Node.js 版本：

```bash
cd scrapers
npm install
node gossip-scraper-twitter.js
```

参考文档：[scrapers/README.md](../scrapers/README.md)

---

## 📞 获取帮助

1. **查看 n8n 日志**:
   ```bash
   docker logs playnew-n8n -f
   ```

2. **查看工作流执行历史**:
   - n8n 界面 → 左侧 "Executions"
   - 点击失败的执行记录
   - 查看详细错误信息

3. **测试 API 连接**:
   ```bash
   cd n8n-workflows
   ./test-api-connections.sh
   ```

---

**祝你成功修复！** 🎉

如果还有问题，请提供：
1. n8n 日志输出
2. 具体的错误信息
3. 节点配置截图
