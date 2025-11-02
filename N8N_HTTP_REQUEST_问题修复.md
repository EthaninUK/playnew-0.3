# n8n HTTP Request 节点配置问题修复指南

## 🚨 当前问题

n8n 的 "AI Translate & Summarize" 节点正在发送**空的请求体**到 Next.js API。

### 服务器日志显示：
```
[DEBUG] Raw request body (first 300 chars):    <-- 完全空白！
```

### 你的 n8n 配置显示：
```json
{
  "text": "{{$json.contentSnippet}}",
  "title": "{{$json.title}}",
  "source_language": "en",
  "target_language": "zh"
}
```

**问题原因**: 表达式 `{{$json.contentSnippet}}` 和 `{{$json.title}}` 没有解析为实际数据，很可能是因为：
1. 字段名称不匹配
2. 数据结构不正确
3. 上游节点没有输出数据

---

## ✅ 解决步骤

### 第 1 步：检查上游节点的输出数据

1. **点击 "Quality Check" 节点**（AI Translate 节点的上游）
2. **点击 "Execute Node"** 执行这个节点
3. **查看 OUTPUT 标签页**
4. **截图并查看数据结构**

你应该会看到类似这样的数据：
```json
{
  "title": "Bitcoin Surges...",
  "link": "https://...",
  "pubDate": "...",
  "content": "...",           // 或者
  "contentSnippet": "...",  // 或者
  "description": "...",     // 或者
  "summary": "..."          // 看看实际的字段名是什么
}
```

### 第 2 步：修正字段名

根据 RSS Feed 的实际输出，常见的字段名有：

| RSS 字段 | 可能的实际名称 |
|---------|--------------|
| 标题 | `title` ✅ |
| 内容 | `content` 或 `contentSnippet` 或 `description` 或 `summary` |
| 链接 | `link` 或 `url` |
| 日期 | `pubDate` 或 `isoDate` 或 `published` |

### 第 3 步：更新 HTTP Request 节点的配置

**场景 A：如果字段名是 `content`**

在 "AI Translate & Summarize" HTTP Request 节点中，修改 Body 为：
```json
{
  "text": "{{$json.content}}",
  "title": "{{$json.title}}",
  "source_language": "en",
  "target_language": "zh"
}
```

**场景 B：如果字段名是 `description`**

```json
{
  "text": "{{$json.description}}",
  "title": "{{$json.title}}",
  "source_language": "en",
  "target_language": "zh"
}
```

**场景 C：如果字段名是 `summary`**

```json
{
  "text": "{{$json.summary}}",
  "title": "{{$json.title}}",
  "source_language": "en",
  "target_language": "zh"
}
```

### 第 4 步：使用 n8n 表达式编辑器测试

1. 在 "Specify Body" 字段，点击字段右侧的 **齿轮图标**
2. 选择 **"Expression"** 模式
3. 使用表达式编辑器查看可用字段：
   - 输入 `{{$json.` 会自动显示所有可用字段
4. 选择正确的字段名

### 第 5 步：简化测试

为了快速验证，先简化 Body 配置，只发送 title：

```json
{
  "text": "Test content",
  "title": "{{$json.title}}",
  "source_language": "en",
  "target_language": "zh"
}
```

如果这个能工作，再添加其他字段。

---

## 🔍 常见 RSS Feed 字段映射

不同的 RSS 源有不同的字段结构：

### CoinDesk RSS
```json
{
  "title": "...",
  "link": "...",
  "pubDate": "...",
  "content": "...",          // 主要内容在这里
  "contentSnippet": "...", // 纯文本版本
  "guid": "..."
}
```

### Cointelegraph RSS
```json
{
  "title": "...",
  "link": "...",
  "pubDate": "...",
  "description": "...",    // 主要内容在这里
  "guid": "..."
}
```

### The Block RSS
```json
{
  "title": "...",
  "link": "...",
  "isoDate": "...",
  "summary": "...",        // 主要内容在这里
  "content": "..."
}
```

---

## 🛠️ 调试技巧

### 技巧 1：添加 Debug 节点

在 "Quality Check" 和 "AI Translate & Summarize" 节点之间添加一个 **"Set"** 节点：

1. 添加 "Set" 节点
2. 配置：
   - **Keep Only Set**: OFF
   - 添加字段：`debug_title` = `{{$json.title}}`
   - 添加字段：`debug_content` = `{{$json.content}}`（或其他字段名）
3. 执行节点查看输出

### 技巧 2：使用固定值测试

临时修改 HTTP Request Body 为固定值：
```json
{
  "text": "Bitcoin price surged today",
  "title": "Test Title",
  "source_language": "en",
  "target_language": "zh"
}
```

如果这个能工作，说明 API 端点没问题，问题确实是 n8n 表达式。

### 技巧 3：检查 Quality Check 节点输出

确认 "Quality Check" 节点确实有输出：
- INPUT: 30 items ✅
- OUTPUT: 应该也是 30 items

如果 OUTPUT 为空或为 0，说明 Quality Check 节点的过滤条件太严格。

---

## 📋 完整的检查清单

- [ ] 1. 执行 "Quality Check" 节点并查看 OUTPUT
- [ ] 2. 确认 OUTPUT 中有数据（不是空的）
- [ ] 3. 记下实际的字段名（`content`、`contentSnippet`、`description`？）
- [ ] 4. 更新 "AI Translate & Summarize" 节点的 Body 配置
- [ ] 5. 使用正确的字段名：`{{$json.实际字段名}}`
- [ ] 6. 保存并执行 "AI Translate & Summarize" 节点
- [ ] 7. 检查 Next.js 服务器日志，应该看到：
  ```
  [DEBUG] Raw request body (first 300 chars): {"text":"...", "title":"..."}
  [DEBUG] Parsed successfully. Keys: text, title, source_language, target_language
  ```

---

## 🎯 快速解决方案

**最可能的修复**：将 `contentSnippet` 改为 `content` 或 `description`

```json
{
  "text": "{{$json.content}}",
  "title": "{{$json.title}}",
  "source_language": "en",
  "target_language": "zh"
}
```

或者：

```json
{
  "text": "{{$json.description}}",
  "title": "{{$json.title}}",
  "source_language": "en",
  "target_language": "zh"
}
```

---

## 💡 验证成功

当配置正确后，你应该在 Next.js 服务器日志中看到：

```
[DEBUG] Raw request body (first 300 chars): {"text":"Bitcoin price surged...","title":"Bitcoin Breaks New High",...}
[DEBUG] Parsed successfully. Keys: text, title, source_language, target_language
[DEBUG] Processing with provider: openrouter
[OpenRouter] Raw response content: {
  "translated_title": "比特币突破新高",
  "translated_text": "比特币价格飙升...",
  ...
}
POST /api/ai/translate-and-summarize 200 in 3099ms
```

不再是空的 `[DEBUG] Raw request body (first 300 chars):`！

---

## 📞 还是不行？

如果按照以上步骤还是失败：

1. **截图 "Quality Check" 节点的 OUTPUT 标签页**（完整的 JSON 数据）
2. **截图 "AI Translate & Summarize" 节点的配置**
3. **复制 Next.js 服务器的最新日志**（最后 20 行）

我可以帮你进一步诊断！

---

**提示**: RSS Feed 读取节点的输出字段名因 RSS 源而异，一定要先查看实际输出再配置表达式！
