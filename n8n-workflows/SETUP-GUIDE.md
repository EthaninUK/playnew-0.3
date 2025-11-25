# n8n Twitter 八卦采集器 - 本地调试指南

## 📋 前置要求

### 1. 必需的 API Keys

在开始之前，请确保你已经申请了以下 API Keys：

- ✅ **Twitter API v2** - Bearer Token 或 OAuth2 凭证
- ✅ **OpenAI API Key** - 用于 AI 分析（可选）
- ✅ **Directus Admin Token** - 用于发布内容

### 2. 系统要求

- Node.js 18+ 或 Docker
- 至少 2GB 可用内存
- 网络可访问 Twitter API 和 OpenAI API

---

## 🚀 快速开始（使用 Docker）

### 步骤 1: 启动 n8n

在项目根目录创建 n8n 服务配置：

```bash
cd /Users/m1/PlayNew_0.3
```

创建 n8n 专用的 docker-compose 文件：

```yaml
# docker-compose.n8n.yml
version: '3.8'

services:
  n8n:
    image: n8nio/n8n:latest
    container_name: playnew-n8n
    restart: always
    ports:
      - "5678:5678"
    environment:
      - N8N_HOST=localhost
      - N8N_PORT=5678
      - N8N_PROTOCOL=http
      - NODE_ENV=production
      - WEBHOOK_URL=http://localhost:5678/
      - GENERIC_TIMEZONE=Asia/Shanghai

      # Directus 配置（通过环境变量传递）
      - DIRECTUS_URL=http://host.docker.internal:8055
      - DIRECTUS_TOKEN=${DIRECTUS_ADMIN_TOKEN}

      # Twitter API
      - TWITTER_BEARER_TOKEN=${TWITTER_BEARER_TOKEN}

      # OpenAI API
      - OPENAI_API_KEY=${OPENAI_API_KEY}

    volumes:
      - ./n8n-data:/home/node/.n8n
      - ./n8n-workflows:/workflows
    extra_hosts:
      - "host.docker.internal:host-gateway"
```

启动 n8n：

```bash
docker-compose -f docker-compose.n8n.yml up -d
```

访问 n8n 界面：`http://localhost:5678`

### 步骤 2: 配置环境变量

创建 `.env` 文件（如果还没有）：

```bash
# 添加到你的 .env 文件
echo "DIRECTUS_ADMIN_TOKEN=your_directus_token_here" >> .env
echo "TWITTER_BEARER_TOKEN=your_twitter_token_here" >> .env
echo "OPENAI_API_KEY=sk-your-openai-key-here" >> .env
```

**获取 Directus Admin Token 的方法：**

```bash
# 方法1: 通过 API 登录获取
curl -X POST http://localhost:8055/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"the_uk1@outlook.com","password":"Mygcdjmyxzg2026!"}' \
  | jq -r '.data.access_token'

# 方法2: 或者在 Directus 面板中创建 Static Token
# 访问: http://localhost:8055/admin/settings/access-tokens
```

### 步骤 3: 导入工作流

1. 打开 n8n 界面：`http://localhost:5678`
2. 首次访问需要创建账号（本地账号，随意设置）
3. 点击右上角 **"+"** 创建新工作流
4. 点击右上角 **"..." → "Import from File"**
5. 选择文件：`/Users/m1/PlayNew_0.3/n8n-workflows/twitter-gossip-collector.json`
6. 导入成功后，你会看到完整的工作流

---

## 🔑 配置凭证（Credentials）

### 1. Twitter OAuth2 凭证

在 n8n 中配置 Twitter 凭证：

**方法 A: 使用 Bearer Token（推荐，更简单）**

1. 在工作流中点击 **"Twitter"** 节点
2. 在 "Credential" 下拉框中选择 **"Create New Credential"**
3. 选择 **"Twitter OAuth2 API"**
4. 填写：
   - **Name**: `Twitter Gossip Collector`
   - **Authentication**: 选择 `Bearer Token`
   - **Access Token**: 粘贴你的 `TWITTER_BEARER_TOKEN`
5. 点击 **"Save"**

**方法 B: 使用 OAuth2 App（功能更全）**

如果你有 Twitter App 的完整凭证：

1. 填写：
   - **API Key**: 你的 Twitter API Key
   - **API Secret**: 你的 Twitter API Secret
   - **Access Token**: 你的 Access Token
   - **Access Secret**: 你的 Access Token Secret
2. 点击 **"Connect my account"** 授权
3. 完成 OAuth 流程

### 2. OpenAI 凭证

1. 点击 **"OpenAI"** 节点
2. **"Create New Credential"** → **"OpenAI API"**
3. 填写：
   - **Name**: `OpenAI Gossip Analyzer`
   - **API Key**: 粘贴你的 `OPENAI_API_KEY`（以 `sk-` 开头）
4. 点击 **"Save"**

### 3. Directus HTTP 凭证

**注意：** 工作流中的 "Publish to Directus" 节点使用 HTTP Request，需要配置 Header Authentication。

1. 点击 **"Publish to Directus"** 节点
2. 在 **"Authentication"** 选择 **"Generic Credential Type"** → **"Header Auth"**
3. **"Create New Credential"** 填写：
   - **Name**: `Directus Admin`
   - **Name**: `Authorization`
   - **Value**: `Bearer YOUR_DIRECTUS_TOKEN`（替换为实际 token）
4. 点击 **"Save"**

**或者使用环境变量（推荐）：**

在 "Publish to Directus" 节点中，Headers 已配置为：
```json
{
  "Authorization": "Bearer {{$env.DIRECTUS_TOKEN}}"
}
```

确保在 docker-compose 中设置了 `DIRECTUS_TOKEN` 环境变量。

---

## 🧪 本地调试步骤

### 第 1 步：检查工作流结构

导入后，你应该看到以下 10 个节点：

```
1. [Schedule Trigger] ──→ 2. [Generate KOL Queries]
                               ↓
                          3. [Twitter Search]
                               ↓
                          4. [Filter & Score]
                               ↓
                          5. [Needs AI Analysis?]
                          ↙            ↘
              6. [OpenAI Analysis]   [高可信度直接发布]
                          ↓
              7. [Merge AI Results]
                          ↓
              8. [Merge Branches]
                          ↓
              9. [Publish to Directus]
                          ↓
              10. [Summary Stats]
```

### 第 2 步：禁用自动调度（首次测试）

1. 点击 **"Schedule Trigger"** 节点
2. 点击右上角 **"Inactive"** 切换开关，确保是灰色（Inactive）
3. 这样可以防止自动执行，方便手动测试

### 第 3 步：修改测试参数（可选）

为了快速测试，建议先降低数据量：

**修改 "Generate KOL Queries" 节点：**

```javascript
// 原代码监控 20+ KOL，测试时可以只保留 2-3 个
const kols = [
  { username: 'VitalikButerin', name: 'Vitalik Buterin', weight: 100 },
  { username: 'WuBlockchain', name: '吴说', weight: 95 },
  // 先注释掉其他 KOL，测试通过后再启用
];
```

**修改 "Filter & Score" 节点：**

```javascript
// 降低互动量阈值，方便测试
if (engagement < 10) continue; // 原本是 50，测试时改为 10
```

### 第 4 步：手动执行测试

1. 点击工作流右上角的 **"Execute Workflow"** 按钮
2. 观察每个节点的执行情况：
   - ✅ 绿色勾：执行成功
   - ❌ 红色叉：执行失败（点击查看错误）
   - ⚠️ 黄色感叹号：警告
3. 点击每个节点可以查看输入/输出数据

### 第 5 步：调试常见问题

#### 问题 1: Twitter API 429 错误（Rate Limit）

**症状：** Twitter Search 节点报错 `429 Too Many Requests`

**解决方法：**
- Twitter Free tier 限制：每月 500K 推文读取
- 每 15 分钟请求一次，每次查询 2-3 个 KOL
- 如果频繁测试，等待 15 分钟后重试

#### 问题 2: OpenAI API 错误

**症状：** OpenAI 节点报错 `Invalid API Key` 或 `Insufficient quota`

**解决方法：**
- 验证 API Key 是否正确：`sk-...`
- 检查 OpenAI 账户余额：https://platform.openai.com/usage
- 如果余额不足，暂时禁用 AI 分析（跳过节点 6-7）

#### 问题 3: Directus 发布失败

**症状：** Publish to Directus 节点报错 `401 Unauthorized` 或 `403 Forbidden`

**解决方法：**

```bash
# 测试 Directus Token 是否有效
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8055/items/news?limit=1

# 如果报错，重新获取 token
curl -X POST http://localhost:8055/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"the_uk1@outlook.com","password":"Mygcdjmyxzg2026!"}' \
  | jq -r '.data.access_token'
```

#### 问题 4: Docker 网络问题（n8n 无法访问 Directus）

**症状：** `ECONNREFUSED` 或 `getaddrinfo ENOTFOUND`

**解决方法：**

确保 n8n 可以访问宿主机的服务：

```yaml
# docker-compose.n8n.yml 中添加
extra_hosts:
  - "host.docker.internal:host-gateway"
```

然后在工作流中使用：
```
http://host.docker.internal:8055
```

### 第 6 步：验证发布结果

测试执行成功后，验证数据是否已发布：

```bash
# 查看最新发布的八卦
curl -s 'http://localhost:8055/items/news?filter[news_type][_eq]=gossip&sort=-published_at&limit=5&fields=id,title,credibility_score,verification_status' | jq

# 或访问前端页面
open http://localhost:3000/gossip
```

---

## ✅ 测试通过后启用自动执行

### 步骤 1: 恢复完整 KOL 列表

取消注释所有 KOL 账号，恢复完整的 20+ 账号监控。

### 步骤 2: 恢复正常过滤阈值

```javascript
// Filter & Score 节点
if (engagement < 50) continue; // 恢复为 50
```

### 步骤 3: 启用调度器

1. 点击 **"Schedule Trigger"** 节点
2. 确认 **"Trigger Interval"** 设置为 `Every 15 minutes`
3. 点击右上角的 **"Inactive"** 按钮，切换为 **"Active"**（绿色）
4. 保存工作流（Ctrl+S 或右上角 Save 按钮）

### 步骤 4: 监控运行状态

查看工作流执行历史：

1. 在 n8n 主界面，点击左侧 **"Executions"**
2. 你会看到所有自动执行的记录
3. 点击任意记录可以查看详细的执行日志

---

## 📊 性能优化建议

### 1. 调整采集频率

根据你的 API 配额调整：

```javascript
// Schedule Trigger 节点
// 选项：
- Every 15 minutes  // 默认，适合 Free tier
- Every 30 minutes  // 更保守
- Every hour        // 预算有限时
```

### 2. KOL 优先级分级

可以创建多个工作流，不同频率监控不同级别 KOL：

- **高优先级**（VitalikButerin, cz_binance）：每 15 分钟
- **中优先级**（媒体账号）：每 30 分钟
- **低优先级**（普通 KOL）：每小时

### 3. 减少 OpenAI 调用

```javascript
// Needs AI Analysis? 节点
// 只对极低可信度内容做 AI 分析
credibility < 50  // 原本 70，改为 50 可节省 60% AI 费用
```

### 4. 批量处理优化

如果发现 Directus 写入慢，可以修改为批量写入：

```javascript
// 在 Publish to Directus 之前添加一个 Aggregate 节点
// 将多个八卦聚合后批量发布
```

---

## 🔐 安全注意事项

### 1. 保护敏感信息

```bash
# 永远不要将 API Keys 提交到 Git
echo ".env" >> .gitignore
echo "n8n-data/" >> .gitignore
```

### 2. 使用环境变量

在 n8n 中使用环境变量而非硬编码：

```javascript
// ✅ 推荐
const directusUrl = $env.DIRECTUS_URL;

// ❌ 不推荐
const directusUrl = 'http://localhost:8055';
```

### 3. 定期轮换 Token

每 30-90 天更换一次：
- Directus Admin Token
- Twitter Bearer Token
- OpenAI API Key

---

## 📈 成本估算

### Twitter API（Free Tier）
- **限额**: 500K 推文/月
- **使用量**: 20 KOL × 96次/天 × 10推文 = 19.2K/天 = 576K/月
- **结论**: 需要申请 Basic tier（$100/月）或减少 KOL 数量

**优化方案**（保持免费）：
- 监控 10 个核心 KOL
- 每 30 分钟执行一次
- 预估: 10 × 48 × 10 = 4.8K/天 = 144K/月 ✅ 免费范围内

### OpenAI API
- **模型**: gpt-4o-mini
- **价格**: $0.150/1M input tokens, $0.600/1M output tokens
- **每条分析**: ~500 input + 200 output = $0.00019
- **预估**: 如果 30% 需要 AI 分析 = 每天 10 条 = $0.002/天 = $0.06/月

### 总成本
- **最小配置**: $0.06/月（仅 OpenAI）
- **推荐配置**: $100/月（Twitter Basic + OpenAI）

---

## 🆘 故障排查

### 查看 n8n 日志

```bash
# Docker 日志
docker logs playnew-n8n -f

# 查看最近 100 行
docker logs playnew-n8n --tail 100
```

### 重启 n8n

```bash
docker-compose -f docker-compose.n8n.yml restart
```

### 清理并重新开始

```bash
# 停止并删除容器
docker-compose -f docker-compose.n8n.yml down

# 删除数据目录（会丢失工作流！）
rm -rf n8n-data/

# 重新启动
docker-compose -f docker-compose.n8n.yml up -d
```

---

## 🎯 下一步优化

1. **添加更多数据源**
   - 复制工作流，修改为 Telegram 采集器
   - 创建链上数据监控工作流

2. **构建知识图谱**
   - 分析 KOL 之间的关联
   - 识别八卦传播路径

3. **用户反馈循环**
   - 记录用户点赞/评论最多的八卦类型
   - 调整 KOL 权重和关键词

4. **异常检测**
   - 监控异常高频八卦（可能是 spam）
   - 自动标记可疑内容

---

## 📞 技术支持

如遇到问题：

1. 查看 n8n 社区文档：https://docs.n8n.io/
2. 查看本项目的 GitHub Issues
3. 检查本地日志文件

---

**祝你顺利完成本地调试！** 🎉
