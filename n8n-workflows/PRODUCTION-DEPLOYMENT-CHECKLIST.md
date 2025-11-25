# ✅ 生产环境部署检查清单

## 🎯 你的生产环境信息

- **n8n 地址**: https://n8n.playnew.ai
- **Webhook URL**: https://n8n.playnew.ai/webhook-test/telegram-gossip-webhook-optimized/webhook
- **Directus 地址**: https://directus.playnew.ai（推测）或 http://directus:8055（内网）
- **前端地址**: https://playnew.ai

---

## 📋 部署前准备

### 1. 创建 Telegram Bot（如果还没有）

```bash
# 在 Telegram 中操作：
1. 搜索 @BotFather
2. 发送 /newbot
3. 按提示设置 bot 名称和用户名
4. 保存 Bot Token：7891234567:AAFdGhJkLmNoPqRsTuVwXyZ1234567890ab
```

**保存 Token**: ________________

### 2. 获取生产环境 Directus Token

```bash
# 方式 A: 通过 API 登录获取
curl -X POST https://directus.playnew.ai/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"the_uk1@outlook.com","password":"Mygcdjmyxzg2026!"}' \
  | jq -r '.data.access_token'

# 方式 B: 在 Directus 管理面板创建 Static Token
# 访问: https://directus.playnew.ai/admin/settings/access-tokens
# 创建新 token，勾选所有权限
```

**保存 Token**: ________________

### 3. 确认频道/群组信息

**要监控的频道/群组列表**:
- [ ] ________________ (频道名称/用户名)
- [ ] ________________
- [ ] ________________

---

## 🚀 部署步骤

### 第 1 步：导入工作流 ✅

```bash
1. 访问 https://n8n.playnew.ai
2. 登录账号
3. 点击右上角 "+" → "Import from File"
4. 选择文件：telegram-gossip-collector-optimized.json
5. 点击 "Import"
```

- [ ] 工作流已成功导入

### 第 2 步：配置 Telegram Bot 凭证 ✅

```bash
1. 在工作流中点击 "Telegram消息监听" 节点
2. 在 "Credential to connect with" 下拉框中选择 "Create New Credential"
3. 选择 "Telegram API"
4. 填写：
   - Name: Telegram Bot - 币圈八卦
   - Access Token: [粘贴你的 Bot Token]
5. 点击 "Save"
6. 确保节点显示 ✅ 已连接
```

- [ ] Telegram 凭证已配置
- [ ] 凭证测试成功（节点无错误）

### 第 3 步：配置 Directus 环境变量 ✅

在生产 n8n 的环境变量中设置（通常在 docker-compose.yml 或服务器配置）：

```bash
# 方式 A: 如果 Directus 在公网
DIRECTUS_URL=https://directus.playnew.ai
DIRECTUS_TOKEN=你的生产token

# 方式 B: 如果 Directus 在同一 Docker 网络
DIRECTUS_URL=http://directus:8055
DIRECTUS_TOKEN=你的生产token
```

**如何设置环境变量**:
1. 如果是 Docker 部署，编辑 `docker-compose.yml`
2. 在 n8n 服务的 `environment` 部分添加变量
3. 重启 n8n 容器：`docker-compose restart n8n`

- [ ] DIRECTUS_URL 已设置
- [ ] DIRECTUS_TOKEN 已设置
- [ ] n8n 已重启（如需要）

### 第 4 步：验证 Webhook URL ✅

在工作流中检查 "Telegram消息监听" 节点：

**应该显示**:
```
POST https://n8n.playnew.ai/webhook-test/telegram-gossip-webhook-optimized/webhook
```

**确认**:
- [ ] URL 使用 HTTPS（不是 HTTP）
- [ ] URL 可以从外网访问
- [ ] webhookId 是 `telegram-gossip-webhook-optimized`

### 第 5 步：更新 Directus 发布节点 ✅

点击 "发布到Directus" 节点，检查配置：

**URL**:
```javascript
{{ $env.DIRECTUS_URL }}/items/news
```

**Headers**:
```javascript
Authorization: Bearer {{ $env.DIRECTUS_TOKEN }}
Content-Type: application/json
```

如果节点中硬编码了 URL，改为使用环境变量：
- [ ] Directus URL 已更新
- [ ] Authorization header 使用环境变量

### 第 6 步：添加 Bot 到频道/群组 ✅

**公开频道**:
```bash
1. 打开频道
2. 频道设置 → 管理员 → 添加管理员
3. 搜索你的 bot 用户名
4. 添加为管理员，给予 "发布消息" 权限
```

**私有群组**:
```bash
1. 打开群组
2. 添加成员 → 搜索 bot 用户名
3. 添加到群组
```

**添加的频道/群组**:
- [ ] ________________ (已添加)
- [ ] ________________ (已添加)
- [ ] ________________ (已添加)

### 第 7 步：激活工作流 ✅

```bash
1. 保存工作流（Ctrl+S 或 Cmd+S）
2. 点击右上角的开关，从 "Inactive" 切换为 "Active"（绿色）
3. 确认状态显示 "Active"
```

- [ ] 工作流已保存
- [ ] 工作流已激活（显示绿色 Active）

### 第 8 步：验证 Webhook 设置 ✅

在服务器或本地终端运行：

```bash
# 替换为你的 Bot Token
curl -s "https://api.telegram.org/bot你的TOKEN/getWebhookInfo" | jq

# 预期输出：
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

**检查**:
- [ ] `ok` 为 `true`
- [ ] `url` 正确指向你的 n8n webhook
- [ ] `pending_update_count` 为 0（没有堆积）

### 第 9 步：发送测试消息 ✅

在你添加了 bot 的频道/群组中发送：

```
测试：据悉某交易所传闻跑路，用户无法提现
```

**检查 n8n 执行日志**:
```bash
1. 在 n8n 界面左侧点击 "Executions"
2. 应该看到新的执行记录（绿色 = 成功）
3. 点击查看详情
4. 检查每个节点的输出
```

- [ ] n8n 中出现新的执行记录
- [ ] 执行状态为成功（绿色）
- [ ] "解析和过滤消息" 节点显示检测到八卦
- [ ] "发布到Directus" 节点返回成功

### 第 10 步：验证结果 ✅

**检查 Directus**:
```bash
# 查看是否有新记录
curl -s 'https://directus.playnew.ai/items/news?filter[source_type][_eq]=telegram&sort=-published_at&limit=1&fields=id,title,credibility_score,source' | jq
```

预期输出：
```json
{
  "data": [
    {
      "id": "xxx",
      "title": "测试：据悉某交易所传闻跑路，用户无法提现",
      "credibility_score": 75,
      "source": "Telegram 你的频道名"
    }
  ]
}
```

**检查前端**:
```bash
# 访问前端页面
open https://playnew.ai/gossip
```

- [ ] Directus 中看到新记录
- [ ] 前端页面显示新八卦
- [ ] 可信度评分正确
- [ ] 分类和标签正确

---

## 🎛️ 生产环境优化配置

### 调整可信度阈值（推荐）

生产环境建议提高发布标准：

1. 在工作流中找到 "发布到Directus" 节点
2. 找到 `status` 字段的表达式
3. 当前是：
   ```javascript
   {{ $json.credibilityScore >= 60 ? '"published"' : '"draft"' }}
   ```
4. 改为 70 分以上才发布：
   ```javascript
   {{ $json.credibilityScore >= 70 ? '"published"' : '"draft"' }}
   ```

- [ ] 已调整可信度阈值（可选）

### 添加监控频道

推荐监控的币圈频道：

**中文**:
- @wublockchain - 吴说区块链
- @BlockBeats - 律动 BlockBeats
- @techflowpost - 深潮 TechFlow
- @coinness_zh - 币牛牛

**英文**:
- @CryptoPanicCom - CryptoPanic
- @cointelegraph - Cointelegraph
- @TheCryptoDog - Crypto 行情

- [ ] 已添加推荐频道（可选）

---

## 📊 监控和维护

### 查看执行统计

**n8n 界面**:
```bash
1. 访问 https://n8n.playnew.ai
2. 左侧菜单 → Executions
3. 查看成功率、执行时间
4. 点击任意执行查看详情
```

**查看日志输出**:
- 每个节点的 Console 输出
- "记录结果" 节点显示详细统计

### 定期检查

**每天**:
- [ ] 检查执行成功率（应该 > 95%）
- [ ] 查看采集数量（10-30 条/天预期）

**每周**:
- [ ] 检查 Telegram webhook 状态
- [ ] 查看 Directus 中八卦质量
- [ ] 根据数据调整关键词

**每月**:
- [ ] 轮换 Directus Token（安全最佳实践）
- [ ] 清理低质量草稿

### Webhook 健康检查

```bash
# 添加到 crontab，每小时检查一次
0 * * * * curl -s "https://api.telegram.org/bot你的TOKEN/getWebhookInfo" | jq '.result.url' | grep -q "n8n.playnew.ai" || echo "Webhook 异常！" | mail -s "Telegram Webhook Alert" your@email.com
```

---

## 🐛 常见问题排查

### 问题 1: Webhook 接收不到消息

**症状**: 发送消息后 n8n 没有执行记录

**排查步骤**:
```bash
# 1. 检查 webhook 状态
curl -s "https://api.telegram.org/bot你的TOKEN/getWebhookInfo" | jq

# 2. 检查 n8n 是否在运行
curl -s https://n8n.playnew.ai/healthz

# 3. 检查防火墙/网络
# 确保 Telegram IP 可以访问你的服务器
# Telegram IP: 149.154.160.0/20, 91.108.4.0/22
```

**解决方法**:
- [ ] 确认工作流已激活
- [ ] 确认 webhook URL 正确
- [ ] 检查服务器防火墙配置
- [ ] 查看 n8n 服务日志

### 问题 2: 所有消息都被过滤

**症状**: n8n 有执行记录，但 "解析和过滤消息" 节点返回空

**原因**: 消息不包含八卦关键词

**排查**:
1. 查看 "解析和过滤消息" 节点的 Console 输出
2. 会显示：`⚠️ 跳过：无八卦关键词 - 频道名`

**解决方法**:
- [ ] 调整关键词库（编辑节点的 jsCode）
- [ ] 降低过滤标准
- [ ] 发送包含明确关键词的测试消息

### 问题 3: Directus 发布失败

**症状**: n8n 执行到 "发布到Directus" 节点时报错

**常见错误**:
- `401 Unauthorized` → Token 无效/过期
- `403 Forbidden` → 权限不足
- `409 Conflict` → Slug 重复（正常，会自动跳过）
- `500 Internal Server Error` → Directus 服务问题

**排查**:
```bash
# 测试 Directus 连接
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

**解决方法**:
- [ ] 重新获取 Directus Token
- [ ] 检查用户权限
- [ ] 验证 Directus 服务状态

### 问题 4: n8n 执行失败

**症状**: 执行记录显示红色（失败）

**排查**:
1. 点击执行记录查看详情
2. 找到失败的节点（红色标记）
3. 查看错误信息

**常见原因**:
- 网络超时
- Telegram API rate limit
- Directus 连接失败

**解决方法**:
- [ ] 检查网络连接
- [ ] 降低执行频率
- [ ] 查看详细错误日志

---

## 🔒 安全检查清单

### Token 安全

- [ ] Telegram Bot Token 未暴露在代码中
- [ ] Directus Token 存储在环境变量中
- [ ] 使用 HTTPS 传输所有敏感数据
- [ ] 定期轮换 Token（推荐每月）

### 访问控制

- [ ] n8n 使用强密码
- [ ] Directus 使用强密码
- [ ] Bot 仅添加到可信频道/群组
- [ ] 限制 webhook 访问（可选：IP 白名单）

### 监控告警

- [ ] 配置执行失败通知（可选）
- [ ] 配置每日统计报告（可选）
- [ ] 设置 webhook 健康检查（可选）

---

## ✅ 最终检查清单

在标记部署完成前，确认所有项目：

### 基础配置
- [ ] 工作流已导入到生产 n8n
- [ ] Telegram Bot Token 已配置
- [ ] Directus 环境变量已设置
- [ ] Webhook URL 使用 HTTPS
- [ ] Bot 已添加到目标频道/群组
- [ ] 工作流已激活（Active 状态）

### 功能验证
- [ ] Webhook 已成功设置（getWebhookInfo 验证）
- [ ] 测试消息已发送
- [ ] n8n 出现执行记录
- [ ] 执行状态为成功
- [ ] Directus 中可以看到新记录
- [ ] 前端页面显示新八卦

### 生产优化（可选）
- [ ] 可信度阈值已调整
- [ ] 已添加多个监控频道
- [ ] 已配置告警通知
- [ ] 已设置定期检查

---

## 🎉 部署成功！

恭喜！你的 Telegram 八卦采集器已在生产环境成功部署！

**预期效果**:
- 📊 每天采集：10-30 条八卦
- ⏱️ 响应时间：秒级实时
- 🎯 可信度：55-85 分
- 💰 运营成本：$0/月

**下一步**:
1. 监控运行 24 小时
2. 根据数据调整关键词和阈值
3. 可选：部署 RSS 采集器（额外 20-50 条/天）
4. 可选：配置告警通知

**有问题？**
- 查看 [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- 查看 [PRODUCTION-SETUP-GUIDE.md](PRODUCTION-SETUP-GUIDE.md)
- 检查 n8n Executions 日志

---

**部署时间**: ________________
**部署人**: ________________
**备注**: ________________
