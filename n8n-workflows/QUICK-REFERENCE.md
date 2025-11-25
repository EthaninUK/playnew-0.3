# 🚀 快速参考卡 - 生产环境部署

## 📍 你的环境信息

```bash
# n8n
URL: https://n8n.playnew.ai
Webhook: https://n8n.playnew.ai/webhook-test/telegram-gossip-webhook-optimized/webhook

# Directus（推测）
URL: https://directus.playnew.ai
或: http://directus:8055

# 前端
URL: https://playnew.ai
八卦页面: https://playnew.ai/gossip
```

---

## ⚡ 5 分钟快速部署

### 1️⃣ 创建 Telegram Bot（30秒）

```
1. Telegram 搜索: @BotFather
2. 发送: /newbot
3. 保存 Token: 7891234567:AAFdGhJkLmNoPqRsTuVwXyZ1234567890ab
```

### 2️⃣ 获取 Directus Token（30秒）

```bash
curl -X POST http://localhost:8055/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"the_uk1@outlook.com","password":"Mygcdjmyxzg2026!"}' \
  | jq -r '.data.access_token'
```

### 3️⃣ 导入工作流（1分钟）

```
https://n8n.playnew.ai → "+" → Import from File
选择: telegram-gossip-collector-optimized.json
```

### 4️⃣ 配置凭证（1分钟）

```
点击 "Telegram消息监听" 节点
→ Create New Credential
→ 粘贴 Bot Token
→ Save
```

### 5️⃣ 设置环境变量（1分钟）

```bash
# 在服务器的 docker-compose.yml 或 .env 中添加：
DIRECTUS_URL=https://directus.playnew.ai
DIRECTUS_TOKEN=你的token

# 重启 n8n
docker-compose restart n8n
```

### 6️⃣ 添加 Bot 到频道（1分钟）

```
打开频道 → 设置 → 管理员 → 添加 Bot
```

### 7️⃣ 激活 & 测试（1分钟）

```
保存工作流 → 切换为 Active
在频道发送: "测试：据悉某交易所传闻跑路"
检查 n8n Executions
```

---

## 🔍 常用命令

### 检查 Webhook 状态

```bash
curl -s "https://api.telegram.org/bot你的TOKEN/getWebhookInfo" | jq
```

**预期输出**:
```json
{
  "ok": true,
  "result": {
    "url": "https://n8n.playnew.ai/webhook-test/telegram-gossip-webhook-optimized/webhook",
    "pending_update_count": 0
  }
}
```

### 测试 Directus 连接

```bash
curl -s "https://directus.playnew.ai/items/news?filter[source_type][_eq]=telegram&limit=1" \
  -H "Authorization: Bearer 你的TOKEN" | jq
```

### 查看最新采集的八卦

```bash
curl -s 'https://directus.playnew.ai/items/news?filter[source_type][_eq]=telegram&sort=-published_at&limit=5&fields=id,title,credibility_score,source' \
  -H "Authorization: Bearer 你的TOKEN" | jq
```

### 重置 Telegram Webhook（如果出错）

```bash
# 删除旧 webhook
curl "https://api.telegram.org/bot你的TOKEN/deleteWebhook"

# n8n 会在工作流激活时自动设置新 webhook
```

---

## 🐛 快速故障排查

### ❌ Webhook 没反应

```bash
1. curl "https://api.telegram.org/bot你的TOKEN/getWebhookInfo"
   → 检查 URL 是否正确

2. 确认工作流状态是 "Active"（绿色）

3. 检查 Bot 是否在频道中：
   → 频道设置 → 管理员 → 确认 Bot 存在
```

### ❌ 消息被过滤

```
n8n Executions → 查看 "解析和过滤消息" 节点
→ Console 会显示: "⚠️ 跳过：无八卦关键词"
→ 解决：发送包含关键词的消息（传闻、爆料、跑路等）
```

### ❌ Directus 发布失败

```bash
错误: 401 Unauthorized
→ Token 过期，重新获取

错误: 409 Conflict (Unique constraint)
→ 正常，重复内容自动跳过

错误: 500 Internal Server Error
→ 检查 Directus 服务状态
```

---

## 📊 监控指标

### 健康状态

```bash
# n8n
curl https://n8n.playnew.ai/healthz

# Directus
curl https://directus.playnew.ai/server/health
```

### 执行统计

```
n8n → Executions → 查看最近执行
✅ 绿色 = 成功
❌ 红色 = 失败
⚠️ 橙色 = 部分失败（启用了 continueOnFail）
```

### 采集统计

```bash
# 今天采集数量
curl -s 'https://directus.playnew.ai/items/news?filter[source_type][_eq]=telegram&filter[published_at][_gte]='$(date -u +%Y-%m-%dT00:00:00Z)'&aggregate[count]=id' \
  -H "Authorization: Bearer 你的TOKEN" | jq

# 平均可信度
curl -s 'https://directus.playnew.ai/items/news?filter[source_type][_eq]=telegram&aggregate[avg]=credibility_score' \
  -H "Authorization: Bearer 你的TOKEN" | jq
```

---

## ⚙️ 常用配置调整

### 调整可信度阈值

**位置**: "发布到Directus" 节点

**当前**:
```javascript
{{ $json.credibilityScore >= 60 ? '"published"' : '"draft"' }}
```

**生产推荐（更严格）**:
```javascript
{{ $json.credibilityScore >= 70 ? '"published"' : '"draft"' }}
```

### 添加关键词

**位置**: "解析和过滤消息" 节点 → jsCode

**找到**:
```javascript
const keywords = {
  critical: {
    zh: ['跑路', '卷款', ...],
    en: ['rug pull', 'exit scam', ...],
    score: -15
  },
  // ...
};
```

**添加新关键词**:
```javascript
zh: ['跑路', '卷款', '你的新关键词'],
en: ['rug pull', 'exit scam', 'your new keyword'],
```

### 调整消息长度阈值

**位置**: "解析和过滤消息" 节点 → jsCode

**找到**:
```javascript
if (textLength > 1000) credibility += 10;
else if (textLength > 500) credibility += 8;
else if (textLength > 200) credibility += 5;
else if (textLength < 50) credibility -= 10; // 太短不可信
```

**调整**:
```javascript
else if (textLength < 100) credibility -= 10; // 改为 100
```

---

## 🎯 推荐监控频道

### 中文币圈

```
@wublockchain - 吴说区块链 ⭐⭐⭐
@BlockBeats - 律动 BlockBeats ⭐⭐⭐
@techflowpost - 深潮 TechFlow ⭐⭐
@coinness_zh - 币牛牛 ⭐⭐
@chaincatcher - 链捕手 ⭐⭐
```

### 英文币圈

```
@CryptoPanicCom - CryptoPanic ⭐⭐⭐
@cointelegraph - Cointelegraph ⭐⭐⭐
@TheCryptoDog - Crypto Dog ⭐⭐
@whale_alert - Whale Alert ⭐⭐
```

### 如何添加

```
1. 打开频道
2. 点击频道名称
3. 管理员 → 添加管理员
4. 搜索你的 bot 用户名
5. 添加并给予 "发布消息" 权限
```

---

## 📈 预期效果

```
📊 采集量: 10-30 条/天（单 Telegram）
         30-80 条/天（Telegram + RSS）

⏱️ 延迟: 秒级实时（Telegram）
        30分钟（RSS）

🎯 可信度: 55-85 分（Telegram）
          70-90 分（RSS）

💰 成本: $0/月（完全免费）
```

---

## 📚 文档导航

```
新手入门 → START-HERE.md
详细设置 → FREE-SETUP-GUIDE.md
生产部署 → PRODUCTION-SETUP-GUIDE.md
部署清单 → PRODUCTION-DEPLOYMENT-CHECKLIST.md ⭐
优化说明 → OPTIMIZED-VERSION-GUIDE.md
故障排查 → TROUBLESHOOTING.md
方案对比 → FREE-ALTERNATIVES.md
```

---

## 🆘 紧急联系

### 重启服务

```bash
# 重启 n8n
docker-compose restart n8n

# 重启 Directus
docker-compose restart directus

# 查看日志
docker-compose logs -f n8n
docker-compose logs -f directus
```

### 重置 Webhook

```bash
# 删除 webhook
curl "https://api.telegram.org/bot你的TOKEN/deleteWebhook"

# 在 n8n 中重新激活工作流
# n8n 会自动重新设置 webhook
```

### 清除问题数据

```bash
# 删除草稿（可信度低的）
curl -X DELETE 'https://directus.playnew.ai/items/news?filter[news_type][_eq]=gossip&filter[status][_eq]=draft&filter[credibility_score][_lt]=50' \
  -H "Authorization: Bearer 你的TOKEN"
```

---

## ✅ 成功标志

部署成功的标志：

```
✅ n8n Executions 中有绿色执行记录
✅ Directus 中出现 source_type=telegram 的记录
✅ 前端 /gossip 页面显示新内容
✅ Webhook status pending_update_count = 0
✅ 关键词消息触发采集
✅ 可信度评分合理（55-85分）
```

---

**记住**：
- 🔧 先在测试频道验证
- 📊 监控 24 小时后再大规模部署
- 🎯 根据实际数据调整参数
- 💾 定期备份 n8n 工作流

祝部署顺利！🎉
