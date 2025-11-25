# 🚀 n8n Twitter 八卦采集器 - 5分钟快速上手

## 最小化配置快速开始

### 第 1 步：配置环境变量 (2分钟)

```bash
cd /Users/m1/PlayNew_0.3

# 如果 .env 文件不存在，创建它
touch .env
```

编辑 `.env` 文件，添加以下配置：

```env
# 必需 - Directus Token
DIRECTUS_ADMIN_TOKEN=你的_directus_token

# 必需 - Twitter Bearer Token
TWITTER_BEARER_TOKEN=你的_twitter_token

# 可选 - OpenAI (不配置也能运行)
OPENAI_API_KEY=sk-你的_openai_key
```

**获取 Directus Token:**

```bash
curl -X POST http://localhost:8055/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"the_uk1@outlook.com","password":"Mygcdjmyxzg2026!"}' \
  | jq -r '.data.access_token'
```

### 第 2 步：测试 API 连接 (1分钟)

```bash
cd n8n-workflows
./test-api-connections.sh
```

如果看到 `✅ 所有测试通过`，继续下一步。

### 第 3 步：启动 n8n (1分钟)

```bash
cd ..
./start-n8n.sh
```

等待看到：

```
✅ n8n 启动成功！
📍 访问 n8n 界面: http://localhost:5678
```

### 第 4 步：导入工作流 (1分钟)

1. 访问 http://localhost:5678
2. 首次访问创建账号（随意设置，仅本地使用）
3. 点击右上角 **"+"** → **"Import from File"**
4. 选择文件：`n8n-workflows/twitter-gossip-collector.json`
5. 导入成功！

### 第 5 步：测试运行 (立即)

在 n8n 工作流界面：

1. 点击右上角 **"Execute Workflow"** 按钮
2. 观察节点执行（绿色勾 = 成功）
3. 检查最后一个节点 "Summary Stats" 的输出

### 验证结果

```bash
# 查看采集到的八卦
curl -s 'http://localhost:8055/items/news?filter[news_type][_eq]=gossip&sort=-published_at&limit=3&fields=id,title,credibility_score' | jq

# 或访问前端
open http://localhost:3000/gossip
```

---

## 启用自动采集

如果测试成功，启用自动执行：

1. 在 n8n 工作流中，点击 **"Schedule Trigger"** 节点
2. 点击右上角开关，从 **"Inactive"** 切换为 **"Active"**（绿色）
3. 保存工作流（Ctrl+S）

工作流将每 15 分钟自动运行一次。

---

## 常见问题

### Q1: Twitter API 报错 429

**解决方法:** Rate limit 达到上限，等待 15 分钟或降低采集频率。

### Q2: n8n 无法连接 Directus

**解决方法:** 确保在 `docker-compose.n8n.yml` 中配置了：

```yaml
extra_hosts:
  - "host.docker.internal:host-gateway"
```

工作流中使用 `http://host.docker.internal:8055`。

### Q3: OpenAI API 报错 insufficient_quota

**解决方法:** 充值 OpenAI 账户或暂时禁用 AI 分析节点（工作流仍可运行）。

---

## 管理命令

```bash
# 查看 n8n 日志
docker logs playnew-n8n -f

# 停止 n8n
docker-compose -f docker-compose.n8n.yml down

# 重启 n8n
docker-compose -f docker-compose.n8n.yml restart

# 查看工作流执行历史
# 访问 n8n 界面 → 左侧 "Executions"
```

---

## 性能优化建议

### Twitter Free Tier 用户（推荐）

编辑工作流中的 **"Generate KOL Queries"** 节点：

```javascript
// 只监控 10 个核心 KOL（原本 20+）
const kols = [
  { username: 'VitalikButerin', name: 'Vitalik Buterin', weight: 100 },
  { username: 'cz_binance', name: 'CZ', weight: 100 },
  { username: 'WuBlockchain', name: '吴说', weight: 95 },
  { username: 'zachxbt', name: 'ZachXBT', weight: 95 },
  { username: 'lookonchain', name: 'Lookonchain', weight: 90 },
  { username: 'whale_alert', name: 'Whale Alert', weight: 90 },
  { username: 'ArkhamIntel', name: 'Arkham', weight: 85 },
  { username: 'peckshield', name: 'PeckShield', weight: 85 },
  { username: 'Cointelegraph', name: 'Cointelegraph', weight: 80 },
  { username: 'CoinDesk', name: 'CoinDesk', weight: 80 },
];
```

编辑 **"Schedule Trigger"** 节点：

```
改为: Every 30 minutes （原本 15 分钟）
```

这样可以保持在 Twitter Free tier 限额内（500K 推文/月）。

---

## 下一步

- 📖 查看完整文档：[SETUP-GUIDE.md](SETUP-GUIDE.md)
- 🔧 优化 KOL 列表和关键词
- 📊 监控采集效果
- 🚀 添加更多数据源（Telegram、链上数据）

---

**祝你成功运营币圈最热门的八卦平台！** 🎉
