# 🚀 Telegram 八卦采集器 - 快速上手

## ❌ 为什么不用 n8n 的 Telegram 工作流？

n8n 的 Telegram Trigger 节点需要 **HTTPS webhook**，但本地开发环境通常是 HTTP。

**问题**：
- Telegram API 要求 webhook 必须是 HTTPS
- 本地 `http://localhost:5678` 不符合要求
- 需要 ngrok 或服务器部署

**解决方案**：
使用 Node.js 版本的 Telegram 采集器，它使用 **长轮询模式**，不需要 HTTPS！

---

## ✅ Node.js 版本优势

- ✅ **不需要 HTTPS** - 可以在本地运行
- ✅ **长轮询模式** - 更稳定，不依赖 webhook
- ✅ **功能完整** - 关键词过滤、AI 分析、自动发布
- ✅ **易于部署** - 使用 PM2 后台运行

---

## 🚀 5分钟快速开始

### 第 1 步：创建 Telegram Bot

1. 在 Telegram 中搜索 **@BotFather**
2. 发送 `/newbot`
3. 按提示设置：
   - Bot 名称：`币圈八卦采集器`
   - Bot 用户名：`crypto_gossip_bot`（必须以 `_bot` 结尾）
4. 获得 **Bot Token**，例如：
   ```
   7891234567:AAFdGhJkLmNoPqRsTuVwXyZ1234567890ab
   ```
5. **保存这个 Token**

### 第 2 步：配置环境变量

编辑 `/Users/m1/PlayNew_0.3/scrapers/.env` 文件：

```bash
# Telegram Bot Token（必需）
TELEGRAM_BOT_TOKEN=7891234567:AAFdGhJkLmNoPqRsTuVwXyZ1234567890ab

# Directus（必需）
DIRECTUS_URL=http://localhost:8055
DIRECTUS_ADMIN_EMAIL=the_uk1@outlook.com
DIRECTUS_ADMIN_PASSWORD=Mygcdjmyxzg2026!

# OpenAI（可选，用于 AI 分析）
OPENAI_API_KEY=sk-your-openai-key-here
```

### 第 3 步：安装依赖

```bash
cd /Users/m1/PlayNew_0.3/scrapers

# 安装 Node.js 依赖
npm install
```

### 第 4 步：添加 Bot 到频道/群组

**方式 A：监控公开频道**
1. 打开目标频道
2. 频道设置 → 管理员 → 添加管理员
3. 搜索你的 bot 用户名（例如 `@crypto_gossip_bot`）
4. 添加为管理员

**方式 B：监控私有群组**
1. 打开群组
2. 添加成员 → 搜索 bot 用户名
3. 添加到群组

### 第 5 步：配置监控的频道/群组

编辑 `gossip-scraper-telegram.js`，修改 `CONFIG.telegram.channels`：

```javascript
channels: [
  '@your_channel_username',  // 公开频道用户名
  '@another_channel',
  // 或使用群组 ID（需要先运行一次获取）
],
```

**如何获取频道/群组 ID：**
- 运行采集器后，在任意监控的群组发送消息
- 查看日志，会显示 `chatId`

### 第 6 步：运行采集器

#### 开发模式（前台运行，查看日志）

```bash
npm run telegram
```

你会看到：
```
✅ Telegram采集器已启动
   Bot Username: @crypto_gossip_bot
   监控频道: 2 个
   等待消息...
```

#### 生产模式（后台运行，使用 PM2）

```bash
# 启动
npm run pm2:start

# 查看日志
npm run pm2:logs

# 查看状态
pm2 status

# 停止
npm run pm2:stop

# 重启
npm run pm2:restart
```

### 第 7 步：测试

在你添加了 bot 的频道/群组中发送测试消息：

```
测试：据悉某交易所传闻跑路
```

查看日志，应该看到：
```
✅ 检测到八卦消息
   来源: @your_channel
   内容: 测试：据悉某交易所传闻跑路
   可信度: 75分

✅ 发布成功
```

### 第 8 步：查看结果

```bash
# 查看采集统计
curl -s 'http://localhost:8055/items/news?filter[source_type][_eq]=telegram&aggregate[count]=id' | jq

# 访问前端
open http://localhost:3000/gossip
```

---

## ⚙️ 配置选项

### 调整关键词库

编辑 `gossip-scraper-telegram.js`：

```javascript
keywords: [
  // 中文关键词
  '传闻', '爆料', '据悉', '跑路', '卷款',

  // 英文关键词
  'rumor', 'scam', 'rug', 'exit', 'dump',

  // 添加你的关键词
  '你的关键词',
],
```

### 调整互动量阈值

```javascript
minEngagement: 10, // 最少10次互动（转发+回复）
```

### 启用/禁用 AI 分析

```javascript
// 如果配置了 OPENAI_API_KEY，会自动启用 AI 分析
// 如果不配置，使用规则引擎（免费）

// 在 .env 中：
OPENAI_API_KEY=sk-your-key  # 启用 AI
# OPENAI_API_KEY=           # 禁用 AI（注释掉）
```

---

## 📊 功能说明

### 自动过滤

采集器会自动：
1. ✅ 检测关键词（传闻、爆料、跑路等）
2. ✅ 过滤低互动消息（< 10 互动）
3. ✅ 计算可信度评分（0-100）
4. ✅ 自动分类（项目传闻、安全事件等）

### AI 分析（可选）

如果配置了 OpenAI：
- 自动分析消息内容
- 智能评分
- 生成摘要
- 提取标签

如果没有配置：
- 使用规则引擎
- 基于关键词和互动量评分
- 仍然功能完整

### 自动发布

- 可信度 ≥ 60 分：自动发布
- 可信度 < 60 分：保存为草稿

---

## 🔍 监控和日志

### 查看实时日志

```bash
# 前台运行时，直接在终端查看

# PM2 后台运行时
npm run pm2:logs

# 或
pm2 logs gossip-telegram
```

### 查看采集统计

```bash
# 查看今天采集的数量
curl -s 'http://localhost:8055/items/news?filter[source_type][_eq]=telegram&filter[published_at][_gte]='$(date -u +%Y-%m-%dT00:00:00Z)'&aggregate[count]=id' | jq

# 查看最新 5 条
curl -s 'http://localhost:8055/items/news?filter[source_type][_eq]=telegram&sort=-published_at&limit=5&fields=id,title,credibility_score,source' | jq
```

---

## 🐛 故障排查

### 问题 1: Bot 收不到消息

**检查：**
```bash
# 测试 Bot Token 是否有效
curl -s "https://api.telegram.org/bot你的TOKEN/getMe" | jq
```

**应该返回：**
```json
{
  "ok": true,
  "result": {
    "id": 7891234567,
    "is_bot": true,
    "first_name": "币圈八卦采集器",
    "username": "crypto_gossip_bot"
  }
}
```

**解决方法：**
1. 确保 Bot Token 正确
2. 确保 bot 已添加到频道/群组
3. 确保 bot 有权限读取消息

### 问题 2: 消息被过滤掉

**原因：** 消息不包含关键词或互动量太低

**查看日志：**
```
⚠️  跳过消息：不包含关键词
⚠️  跳过消息：互动量不足 (5 < 10)
```

**解决方法：**
1. 调整关键词库
2. 降低 `minEngagement` 阈值

### 问题 3: Directus 发布失败

**错误：** `401 Unauthorized`

**解决方法：**
```bash
# 检查 Directus 是否运行
curl -s http://localhost:8055/server/health | jq

# 重新获取 token
curl -X POST http://localhost:8055/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"the_uk1@outlook.com","password":"Mygcdjmyxzg2026!"}' \
  | jq -r '.data.access_token'

# 更新 .env 中的 password
```

### 问题 4: 采集器崩溃

**查看日志：**
```bash
pm2 logs gossip-telegram --lines 100
```

**常见原因：**
- 网络连接问题
- Telegram API Rate Limit
- Directus 连接失败

**解决方法：**
- PM2 会自动重启
- 检查网络连接
- 查看错误日志

---

## 🎯 推荐配置

### 最小配置（免费）

```env
TELEGRAM_BOT_TOKEN=你的token
DIRECTUS_URL=http://localhost:8055
DIRECTUS_ADMIN_EMAIL=your_email
DIRECTUS_ADMIN_PASSWORD=your_password
# 不配置 OPENAI_API_KEY
```

**效果：**
- 基于规则引擎评分
- 完全免费
- 功能完整

### 完整配置（带 AI）

```env
TELEGRAM_BOT_TOKEN=你的token
DIRECTUS_URL=http://localhost:8055
DIRECTUS_ADMIN_EMAIL=your_email
DIRECTUS_ADMIN_PASSWORD=your_password
OPENAI_API_KEY=sk-your-key
```

**效果：**
- AI 智能分析
- 更准确的评分
- 自动生成摘要
- 成本：~$3-5/月

---

## 📈 与 RSS 配合使用

推荐同时运行 RSS 和 Telegram 采集器：

```bash
# 启动所有采集器
npm run pm2:start

# 查看状态
pm2 status
```

**效果：**
- RSS：覆盖主流媒体（20-50条/天）
- Telegram：实时社交媒体（10-30条/天）
- **总计：30-80条/天**

---

## 💡 进阶技巧

### 监控多个频道

```javascript
channels: [
  '@wublockchain',      // 吴说区块链
  '@cryptonews',        // 币圈新闻
  '@defi_gossip',       // DeFi 八卦
  '@nft_drama',         // NFT 圈
  // 添加更多...
],
```

### 自定义评分规则

编辑 `calculateCredibility()` 函数，调整评分逻辑。

### 添加黑名单

```javascript
// 过滤垃圾消息发送者
const blacklist = ['spam_user', 'bot_user'];
if (blacklist.includes(msg.from.username)) return;
```

---

## 🎉 总结

相比 n8n Telegram 工作流：

| 特性 | n8n 工作流 | Node.js 版本 |
|------|------------|--------------|
| **HTTPS 要求** | ✅ 必需 | ❌ 不需要 |
| **本地运行** | ❌ 需要 ngrok | ✅ 直接运行 |
| **稳定性** | 🟡 依赖 webhook | 🟢 长轮询 |
| **功能完整性** | ✅ 完整 | ✅ 完整 |
| **配置难度** | 🟡 中等 | 🟢 简单 |

**推荐使用 Node.js 版本进行本地开发和测试！** ✅

---

有问题随时查看日志或文档！
