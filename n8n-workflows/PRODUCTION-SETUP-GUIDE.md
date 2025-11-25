# 🚀 生产环境部署指南 - Telegram 八卦采集器

## 🎯 你的环境

- **n8n 地址**: https://n8n.playnew.ai
- **Webhook URL**: https://n8n.playnew.ai/webhook-test/telegram-gossip-webhook-optimized/webhook
- **优势**: ✅ 已有 HTTPS，可以直接使用 Telegram Webhook

---

## 📋 部署步骤

### 第 1 步：在线上 n8n 导入工作流

1. 访问：https://n8n.playnew.ai
2. 登录你的账号
3. 点击右上角 **"+" → "Import from File"**
4. 选择文件：`telegram-gossip-collector-optimized.json`
5. 导入成功！

### 第 2 步：配置 Telegram Bot 凭证

#### 2.1 创建/获取 Bot Token

如果还没有 Bot，在 Telegram 中：
1. 搜索 **@BotFather**
2. 发送 `/newbot`
3. 创建 bot，获得 Token：
   ```
   7891234567:AAFdGhJkLmNoPqRsTuVwXyZ1234567890ab
   ```

#### 2.2 在线上 n8n 中配置凭证

1. 点击 **"Telegram消息监听"** 节点
2. 在 "Credential to connect with" 下拉框中选择 **"Create New Credential"**
3. 选择 **"Telegram API"**
4. 填写：
   - **Name**: `Telegram Bot - 币圈八卦`
   - **Access Token**: 粘贴你的 Bot Token
5. 点击 **"Save"**

### 第 3 步：配置 Directus 环境变量

在你的线上 n8n 环境中设置环境变量：

```bash
# 如果是 Docker 部署
# 编辑 docker-compose.yml 或环境配置

# Directus URL（根据你的部署调整）
DIRECTUS_URL=https://directus.playnew.ai
# 或
DIRECTUS_URL=http://directus:8055  # 如果在同一网络

# Directus Admin Token
DIRECTUS_TOKEN=你的生产环境token
```

**获取生产环境 Token：**

```bash
# 如果 Directus 也在线上
curl -X POST https://directus.playnew.ai/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"the_uk1@outlook.com","password":"Mygcdjmyxzg2026!"}' \
  | jq -r '.data.access_token'

# 或者在 Directus 面板中创建 Static Token
# 访问: https://directus.playnew.ai/admin/settings/access-tokens
```

### 第 4 步：检查 Webhook URL

在工作流中，Telegram Trigger 节点应该显示：

```
POST https://n8n.playnew.ai/webhook-test/telegram-gossip-webhook-optimized/webhook
```

**重要**：确保这个 URL：
- ✅ 使用 HTTPS
- ✅ 可以从外网访问
- ✅ 与 webhookId 匹配

### 第 5 步：修改 Directus 发布节点

由于你的 Directus 可能也在生产环境，需要调整 URL：

1. 点击 **"发布到Directus"** 节点
2. 修改 URL：
   ```javascript
   // 如果 Directus 在线上
   https://directus.playnew.ai/items/news

   // 如果在同一 Docker 网络
   http://directus:8055/items/news
   ```

3. 修改 Authorization header：
   ```javascript
   // 使用环境变量
   Bearer {{ $env.DIRECTUS_TOKEN }}
   ```

### 第 6 步：添加 Bot 到频道/群组

#### 6.1 添加到公开频道

1. 打开目标频道
2. 频道设置 → 管理员 → 添加管理员
3. 搜索你的 bot 用户名
4. 添加为管理员，给予"发布消息"权限

#### 6.2 添加到私有群组

1. 打开群组
2. 添加成员 → 搜索 bot 用户名
3. 添加到群组

#### 6.3 推荐监控的频道

中文频道：
- 吴说区块链相关频道
- 币圈日报
- 链捕手
- 深潮 TechFlow

英文频道：
- Crypto News
- DeFi News
- NFT Alerts

### 第 7 步：激活工作流

1. 保存工作流（Ctrl+S）
2. 点击右上角的 **"Inactive"** 切换为 **"Active"**（绿色）
3. 确认工作流处于激活状态

### 第 8 步：设置 Telegram Webhook

工作流激活后，n8n 会自动调用 Telegram API 设置 webhook。

**验证 webhook 是否设置成功：**

```bash
# 使用你的 Bot Token
curl -s "https://api.telegram.org/bot你的TOKEN/getWebhookInfo" | jq

# 应该看到类似输出：
{
  "ok": true,
  "result": {
    "url": "https://n8n.playnew.ai/webhook-test/telegram-gossip-webhook-optimized/webhook",
    "has_custom_certificate": false,
    "pending_update_count": 0,
    "max_connections": 40
  }
}
```

### 第 9 步：测试

在你添加了 bot 的频道/群组中发送测试消息：

```
测试：据悉某交易所传闻跑路，用户无法提现
```

然后：
1. 在线上 n8n 中点击左侧 **"Executions"**
2. 应该看到新的执行记录
3. 点击查看详情，检查是否成功发布到 Directus

### 第 10 步：验证结果

```bash
# 查看采集统计
curl -s 'https://directus.playnew.ai/items/news?filter[source_type][_eq]=telegram&aggregate[count]=id' | jq

# 访问前端
open https://playnew.ai/gossip
```

---

## ⚙️ 生产环境配置优化

### 1. 修改可信度阈值

生产环境建议提高发布标准：

编辑 **"发布到Directus"** 节点：

```javascript
// 70分以上才发布（原本60分）
"status": {{ $json.credibilityScore >= 70 ? '"published"' : '"draft"' }}
```

### 2. 配置告警通知

在 n8n 中添加错误通知：

1. 在工作流末尾添加一个 **"IF"** 节点
2. 检查发布是否失败
3. 失败时发送通知（Email/Telegram/Slack）

### 3. 设置日志保留策略

在线上 n8n 设置中：
- 执行历史保留：30 天
- 错误日志优先保留

### 4. 添加速率限制

如果频道消息量很大，可以添加：

1. 在 **"解析和过滤消息"** 节点后添加 **"Limit"** 节点
2. 设置：每分钟最多处理 10 条消息

---

## 🔒 安全配置

### 1. 保护环境变量

确保敏感信息不暴露：
- ✅ 使用环境变量存储 Token
- ✅ 不要在节点中硬编码密码
- ✅ 定期轮换 Token

### 2. 限制 Webhook 访问

如果可能，在服务器配置中：
- 只允许 Telegram IP 访问 webhook
- Telegram IP 范围：149.154.160.0/20, 91.108.4.0/22

### 3. 启用 HTTPS 证书验证

确保你的 n8n 使用有效的 SSL 证书（Let's Encrypt）。

### 4. Bot Token 安全

- 不要分享 Bot Token
- 如果泄露，立即在 @BotFather 中重置：`/revoke`

---

## 📊 监控与维护

### 1. 查看执行统计

在线上 n8n：
- Executions → 查看执行历史
- 查看成功率
- 监控错误日志

### 2. 设置定期检查

创建另一个工作流：
1. 每小时检查 Telegram webhook 状态
2. 检查 Directus 连接
3. 如果异常，发送告警

### 3. 日志分析

定期查看 **"记录结果"** 节点的输出：
- 成功发布数量
- 重复跳过数量
- 失败数量

### 4. 数据库清理

定期清理重复或低质量的八卦：

```sql
-- 删除可信度太低的草稿（可选）
DELETE FROM news
WHERE news_type = 'gossip'
  AND status = 'draft'
  AND credibility_score < 40
  AND published_at < NOW() - INTERVAL '7 days';
```

---

## 🐛 生产环境故障排查

### 问题 1: Webhook 无法接收消息

**检查：**
```bash
# 1. 验证 webhook 设置
curl -s "https://api.telegram.org/bot你的TOKEN/getWebhookInfo" | jq

# 2. 测试 webhook URL 是否可访问
curl -X POST https://n8n.playnew.ai/webhook-test/telegram-gossip-webhook-optimized/webhook \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'

# 应该返回 n8n 的响应
```

**解决方法：**
1. 确保 n8n 服务正常运行
2. 检查防火墙配置
3. 验证 SSL 证书有效

### 问题 2: 大量执行失败

**检查 n8n Executions 中的错误日志：**

常见原因：
- Directus Token 过期 → 重新获取
- Directus 连接超时 → 检查网络
- 内存不足 → 增加 n8n 资源限制

### 问题 3: Directus 发布失败

**测试 Directus 连接：**
```bash
curl -X POST https://directus.playnew.ai/items/news \
  -H "Authorization: Bearer 你的TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "测试",
    "summary": "测试",
    "content": "测试",
    "source": "Test",
    "source_type": "telegram",
    "url": "https://test.com",
    "slug": "test-'$(date +%s)'",
    "news_type": "gossip",
    "credibility_score": 70,
    "status": "draft",
    "category": "crypto-general"
  }'
```

### 问题 4: 消息被过滤掉

**查看节点日志：**
- 点击 **"解析和过滤消息"** 节点
- 查看 Console 输出
- 会显示跳过原因

**常见原因：**
- 消息不包含关键词
- 消息太短（< 50 字符）
- 非文本消息

---

## 🎯 性能优化

### 1. 调整并发数

在 Telegram Trigger 节点设置中：
- Max Connections: 40（默认）
- 高流量频道可以提高到 100

### 2. 启用缓存

为 Directus 请求启用缓存，避免重复查询。

### 3. 批量处理

如果消息量很大，可以修改工作流：
1. 先存储到队列（Redis）
2. 批量处理和发布

### 4. 监控资源使用

```bash
# 如果是 Docker 部署
docker stats n8n

# 监控 CPU 和内存使用
```

---

## 📈 扩展建议

### 1. 多语言支持

在 **"构建富文本内容"** 节点中，根据消息语言生成不同格式的内容。

### 2. 情感分析

集成 OpenAI，分析消息情感（正面/负面/中性）。

### 3. 自动标签提取

使用 AI 自动提取项目名称、人物、事件等标签。

### 4. 相似内容检测

在发布前，检查数据库中是否有相似内容，避免重复。

---

## 🔗 与 RSS 采集器配合

同时部署 RSS 和 Telegram 采集器：

1. 导入 `rss-gossip-collector-optimized.json`
2. 配置相同的 Directus 连接
3. 两个工作流同时运行

**效果：**
- RSS：20-50 条/天（媒体来源）
- Telegram：10-30 条/天（社交来源）
- **总计：30-80 条/天** ✅

---

## 📋 检查清单

部署完成后，确认以下项目：

- [ ] 工作流已导入到线上 n8n
- [ ] Telegram Bot Token 已配置
- [ ] Directus 环境变量已设置
- [ ] Webhook URL 使用 HTTPS
- [ ] Bot 已添加到目标频道/群组
- [ ] 工作流已激活（Active）
- [ ] Webhook 已成功设置（getWebhookInfo 验证）
- [ ] 测试消息已发送并成功处理
- [ ] Directus 中可以看到新记录
- [ ] 前端页面显示新八卦
- [ ] 错误日志正常
- [ ] 监控告警已配置

---

## 🎉 部署完成

恭喜！你的 Telegram 八卦采集器已在生产环境部署成功！

**下一步：**
1. 监控运行 24 小时
2. 根据数据调整关键词和阈值
3. 可选：部署 RSS 采集器
4. 可选：配置告警通知

**有问题？**
- 查看 n8n Executions 日志
- 检查 Telegram webhook 状态
- 验证 Directus 连接

---

**祝你成功运营！** 🎉
