# n8n ChainCatcher 抓取器 - 快速设置指南 ⚡

## 🎯 解决方案：使用 HTTP API

你遇到的错误是因为 n8n 在 Docker 容器中无法直接访问宿主机的文件系统。

**解决方案**：我创建了一个 HTTP API 端点，n8n 通过 HTTP 请求触发抓取。

---

## ✅ 已完成的工作

### 1. 创建了 API 端点

**文件**: `/Users/m1/PlayNew_0.3/frontend/app/api/scrape/chaincatcher/route.ts`

**功能**:
- POST 请求触发抓取
- 自动执行 `scrape-chaincatcher-simple.js` 脚本
- 返回抓取统计（saved, skipped, errors）

**测试结果**:
```json
{
  "success": true,
  "stats": {
    "saved": 1,
    "skipped": 9,
    "errors": 0
  }
}
```

### 2. 创建了新的 n8n 工作流

**文件**: `n8n-chaincatcher-http-api.json`

**工作流结构**:
```
[Schedule Trigger: 每30分钟]
  → [HTTP Request: POST /api/scrape/chaincatcher]
    → [IF: 检查成功]
      → [成功] → 格式化成功消息
      → [失败] → 格式化错误消息
```

---

## 🚀 在 n8n 中设置

### 步骤 1: 导入工作流

1. 打开 n8n: http://localhost:5678
2. 点击右上角 **Import from File**
3. 选择文件: `n8n-chaincatcher-http-api.json`
4. 点击 **Import**

### 步骤 2: 配置 HTTP Request 节点

工作流已经预配置好了，但请确认：

**节点名称**: "Trigger ChainCatcher Scraper"

**配置**:
- **Method**: POST
- **URL**: `http://host.docker.internal:3000/api/scrape/chaincatcher`
- **Timeout**: 90000 (90秒)

> 💡 `host.docker.internal` 是 Docker 中访问宿主机的特殊域名

### 步骤 3: 激活工作流

1. 点击右上角的开关按钮（变成绿色）
2. 工作流会每 30 分钟自动运行

### 步骤 4: 手动测试

1. 点击 **Execute Workflow** 按钮
2. 等待几秒钟
3. 查看输出结果

**预期输出**:
```json
{
  "status": "✅ Success",
  "timestamp": "2025-10-27T00:38:50.904Z",
  "message": "ChainCatcher scraping completed successfully",
  "details": {
    "saved": 1,
    "skipped": 9,
    "errors": 0,
    "total": 10
  },
  "summary": "Saved 1 new items, skipped 9 duplicates, 0 errors"
}
```

---

## 📊 工作流节点说明

### 节点 1: Every 30 Minutes (Schedule Trigger)

定时触发器，每 30 分钟执行一次。

**配置**:
- Trigger Interval: Minutes
- Minutes Interval: 30

### 节点 2: Trigger ChainCatcher Scraper (HTTP Request)

调用 Next.js API 触发抓取。

**配置**:
- Method: POST
- URL: `http://host.docker.internal:3000/api/scrape/chaincatcher`
- Timeout: 90000ms (90秒)

### 节点 3: Check If Successful (IF)

检查 API 返回的 `success` 字段。

**条件**:
- `{{ $json.success }}` = `true`

### 节点 4: Format Success (Code)

格式化成功消息，提取统计信息。

### 节点 5: Format Error (Code)

格式化错误消息。

---

## 🧪 测试 API 端点

### 使用 curl 测试

```bash
curl -X POST http://localhost:3000/api/scrape/chaincatcher
```

**成功响应**:
```json
{
  "success": true,
  "timestamp": "2025-10-27T00:38:50.904Z",
  "stats": {
    "saved": 1,
    "skipped": 9,
    "errors": 0
  },
  "output": "✅ ChainCatcher scraping complete!...",
  "stderr": null
}
```

### 使用浏览器测试

访问: http://localhost:3000/api/scrape/chaincatcher

会看到错误（因为浏览器默认发送 GET 请求），这是正常的。

---

## 📈 监控和日志

### 查看 n8n 执行历史

1. 在 n8n 中，点击左侧菜单 **Executions**
2. 查看每次运行的结果
3. 点击每个执行记录查看详细日志

### 查看 Next.js 日志

在终端中运行 Next.js 的窗口会显示：

```
POST /api/scrape/chaincatcher 200 in 2987ms
```

### 查看 Directus 数据

访问: http://localhost:8055/admin/content/news

查看新抓取的快讯。

---

## 🔧 常见问题

### Q1: n8n 报错 "ECONNREFUSED"

**原因**: n8n 无法连接到 Next.js

**解决**:
1. 确保 Next.js 在运行: `npm run dev`
2. 确认 URL 使用 `host.docker.internal` 而不是 `localhost`

### Q2: API 返回 500 错误

**原因**: 脚本执行失败

**解决**:
1. 检查脚本路径是否正确
2. 查看 Next.js 日志中的错误信息
3. 手动运行脚本测试: `node scrape-chaincatcher-simple.js`

### Q3: 所有数据都被跳过（skipped）

**原因**: 数据已存在于数据库中

**这是正常的！** 说明去重功能正常工作。

**验证**:
- 等待几小时后再运行，ChainCatcher 会更新快讯
- 或者手动删除一些旧快讯，然后重新抓取

### Q4: Timeout 错误

**原因**: 90 秒超时了

**解决**:
1. 增加 HTTP Request 节点的 timeout 到 120000 (2分钟)
2. 或者减少抓取数量（修改脚本中的 `maxItems`）

---

## 📝 下一步优化

### 1. 添加通知

在 "Format Success" 节点后添加：
- **Slack 节点**: 发送成功通知到 Slack
- **Email 节点**: 发送邮件通知

### 2. 错误重试

在 HTTP Request 节点的 Settings 中：
- Enable "Retry On Fail"
- Max Tries: 3
- Wait Between Tries: 60000ms (1分钟)

### 3. 数据验证

添加一个 Code 节点验证抓取的数据质量：
- 检查是否有新数据
- 验证数据格式
- 过滤低质量内容

---

## 🎉 总结

✅ **问题已解决！**

- ❌ 旧方法: Execute Command（n8n 容器无法访问文件）
- ✅ 新方法: HTTP API（n8n 通过 HTTP 调用）

**优点**:
- 不依赖文件系统挂载
- 更容易调试
- 可以从任何地方调用（n8n, cron, 手动等）
- 有清晰的成功/失败响应

**现在你可以**:
1. 在 n8n 中导入 `n8n-chaincatcher-http-api.json`
2. 激活工作流
3. 每 30 分钟自动抓取 ChainCatcher 快讯
4. 查看 http://localhost:3000/news 查看最新快讯

---

## 📚 相关文件

- **API 端点**: `frontend/app/api/scrape/chaincatcher/route.ts`
- **n8n 工作流**: `n8n-chaincatcher-http-api.json`
- **抓取脚本**: `scrape-chaincatcher-simple.js`
- **详细文档**: `CHAINCATCHER_SCRAPER_README.md`

---

**需要帮助？** 查看完整文档或直接测试 API：

```bash
curl -X POST http://localhost:3000/api/scrape/chaincatcher
```
