# RSS Feed 字段映射结果 ✅

## 测试结果总结

已测试 Cointelegraph 和 The Block 的 RSS feeds，确认可用字段：

### ✅ 可用字段

| 字段名 | Cointelegraph | The Block | 说明 |
|-------|--------------|-----------|------|
| `title` | ✅ | ✅ | 标题 |
| `content` | ✅ (451 chars) | ✅ (154 chars) | HTML 格式内容 |
| `contentSnippet` | ✅ (151 chars) | ✅ (124 chars) | 纯文本内容 |
| `link` | ✅ | ✅ | 链接 |
| `pubDate` | ✅ | ✅ | 发布日期 |
| `isoDate` | ✅ | ✅ | ISO 格式日期 |
| `creator` | ✅ | ✅ | 作者 |
| `guid` | ✅ | ✅ | 唯一标识 |

---

## 🎯 n8n HTTP Request 正确配置

### 推荐配置 1：使用 `content` （HTML 格式，内容更完整）

```json
{
  "text": "{{$json.content}}",
  "title": "{{$json.title}}",
  "source_language": "en",
  "target_language": "zh"
}
```

### 推荐配置 2：使用 `contentSnippet` （纯文本，更简洁）

```json
{
  "text": "{{$json.contentSnippet}}",
  "title": "{{$json.title}}",
  "source_language": "en",
  "target_language": "zh"
}
```

**注意**：你当前的配置已经是正确的！`{{$json.contentSnippet}}` 是存在的字段。

---

## 🚨 真正的问题

根据服务器日志，n8n 发送的请求体是**完全空的**：

```
[DEBUG] Raw request body (first 300 chars):     <-- 空白！
```

这说明：

### 可能原因 1：Quality Check 节点没有输出数据

**检查方法**：
1. 点击 "Quality Check" 节点
2. 点击 "Execute Node"
3. 查看 OUTPUT 标签页
4. **如果 OUTPUT 显示 0 items，说明所有数据都被过滤掉了**

**解决方案**：
- 降低 Quality Check 的过滤条件
- 或者临时禁用 Quality Check，直接从 "Clean RSS Data" 连接到 "AI Translate"

### 可能原因 2：n8n HTTP Request 节点配置错误

**检查方法**：
1. 打开 "AI Translate & Summarize" 节点
2. 确认以下设置：
   - **Send Body**: ✅ ON
   - **Body Content Type**: JSON
   - **Specify Body** 字段模式：确保是 **"Expression"** 而不是 "Fixed"

**解决方案**：
如果 "Specify Body" 字段显示为固定模式，点击字段右侧的齿轮图标，切换到 **"Expression"** 模式。

### 可能原因 3：n8n 节点执行顺序问题

**检查方法**：
- 确认 "Quality Check" → "AI Translate & Summarize" 有连线
- 不是从其他节点直接跳到 "AI Translate"

**解决方案**：
重新连接节点：
1. 删除 "AI Translate & Summarize" 的输入连线
2. 从 "Quality Check" 的输出重新拖线到 "AI Translate & Summarize"

---

## 🛠️ 快速诊断步骤

### 步骤 1：执行 Quality Check 节点

```
1. 点击 "Quality Check" 节点
2. 点击 "Execute Node" 按钮
3. 查看 OUTPUT 标签页
```

**预期结果**：
- 应该显示 N items（N > 0）
- 每个 item 应该包含 `title`, `content`, `contentSnippet` 等字段

**如果显示 0 items**：
- 说明 Quality Check 过滤条件太严格
- 临时禁用 Quality Check，直接测试 "Clean RSS Data" → "AI Translate"

### 步骤 2：添加 Debug 节点

在 "Quality Check" 和 "AI Translate" 之间添加一个 "Code" 节点：

```javascript
// Debug: Print what data we have
for (const item of $input.all()) {
  console.log('Item keys:', Object.keys(item.json));
  console.log('Has content?', !!item.json.content);
  console.log('Has contentSnippet?', !!item.json.contentSnippet);
  console.log('Has title?', !!item.json.title);
}

return $input.all();
```

执行这个节点，查看 n8n 日志（右上角 "Logs" 按钮）。

### 步骤 3：测试固定数据

临时修改 "AI Translate & Summarize" 的 Body 为固定值：

```json
{
  "text": "Bitcoin price surged to new highs today.",
  "title": "Bitcoin Rally",
  "source_language": "en",
  "target_language": "zh"
}
```

- ✅ 如果这个能工作 → 说明 API 没问题，问题在 n8n 表达式
- ❌ 如果这个也失败 → 说明连接或配置有问题

### 步骤 4：检查 n8n URL 配置

确认 "AI Translate & Summarize" HTTP Request 节点的 URL 是：

```
http://host.docker.internal:3000/api/ai/translate-and-summarize
```

**不是**：
- ❌ `http://localhost:3000/...`
- ❌ `http://127.0.0.1:3000/...`

因为 n8n 运行在 Docker 容器中，需要使用 `host.docker.internal` 访问宿主机的服务。

---

## 💡 最可能的解决方案

根据经验，最常见的问题是：

### 解决方案 A：Quality Check 过滤太严格

**直接绕过 Quality Check**：
1. 删除 "Quality Check" → "AI Translate" 的连线
2. 从 "Clean RSS Data" 直接连线到 "AI Translate & Summarize"
3. 执行工作流

### 解决方案 B：表达式模式错误

**切换到 Expression 模式**：
1. 打开 "AI Translate & Summarize" 节点
2. 在 "Specify Body" 字段右侧，点击齿轮图标
3. 选择 "Expression" 模式
4. 重新输入：
```json
{
  "text": "{{$json.content}}",
  "title": "{{$json.title}}",
  "source_language": "en",
  "target_language": "zh"
}
```

### 解决方案 C：使用 `content` 替代 `contentSnippet`

虽然两个字段都存在，但 `content` 更可靠（更长、更完整）：

```json
{
  "text": "{{$json.content}}",
  "title": "{{$json.title}}",
  "source_language": "en",
  "target_language": "zh"
}
```

---

## ✅ 验证成功

当修复成功后，Next.js 服务器日志应该显示：

```
[DEBUG] Raw request body (first 300 chars): {"text":"DeFi trading volumes...","title":"The next era of crypto...",...}
[DEBUG] Parsed successfully. Keys: text, title, source_language, target_language
[DEBUG] Processing with provider: openrouter
[OpenRouter] Raw response content: {
  "translated_title": "加密货币的下一个时代属于去中心化市场",
  ...
}
POST /api/ai/translate-and-summarize 200 in 3099ms
```

---

## 📞 如果还是不行

请提供以下信息：

1. **Quality Check 节点的 OUTPUT** 截图（完整 JSON）
2. **AI Translate & Summarize 节点的配置** 截图
3. **n8n 工作流的节点连接图** 截图
4. **Next.js 服务器的最新日志**（最后 20 行）

---

**提示**: 最有可能的问题是 Quality Check 节点把所有数据都过滤掉了！先尝试绕过 Quality Check 直接连接。
