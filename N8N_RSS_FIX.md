# n8n RSS 解析修复指南

## 问题症状

在 n8n 工作流中，"Clean RSS Data" 节点显示:
```
No fields - node executed, but no items were sent on this branch
```

这意味着虽然节点执行了，但没有输出任何数据。

---

## 问题原因

1. **RSS 返回的是 XML 字符串**，需要手动解析
2. **原有的解析逻辑**假设数据已经被 n8n 自动解析成对象
3. **n8n 的 HTTP Request 节点**默认不会自动解析 RSS/XML

---

## ✅ 解决方案

### 方法 1: 使用 RSS Feed Trigger/Read 节点 (推荐)

n8n 有专门的 RSS 节点可以自动解析 RSS。

#### 步骤:

1. **删除或替换** "Fetch CoinDesk RSS" HTTP Request 节点
2. **添加 RSS Feed Read 节点**:
   - 节点类型: `RSS Feed Read`
   - URL: `https://cointelegraph.com/rss`

3. **无需** Clean RSS Data 节点，RSS Feed Read 会自动解析

**工作流结构**:
```
Schedule Trigger
    ↓
Login to Directus
    ↓
RSS Feed Read  ← 自动解析 RSS
    ↓
Split In Batches
    ↓
Quality Check
    ↓
AI Process...
```

---

### 方法 2: 修复 Function 节点代码

如果继续使用 HTTP Request，需要修复 "Clean RSS Data" 节点的代码。

#### 完整的正确代码:

将 "Clean RSS Data" 节点的代码替换为:

```javascript
// 解析 RSS XML 并提取新闻数据
const items = $input.all();
const cleanedData = [];

for (const item of items) {
  // 获取 RSS 响应文本
  let rssText = item.json;

  // 如果是对象，转换为字符串
  if (typeof rssText === 'object') {
    rssText = JSON.stringify(rssText);
  }

  // 使用正则表达式提取 <item> 标签
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  const matches = [...rssText.matchAll(itemRegex)];

  console.log(`Found ${matches.length} RSS items`);

  for (const match of matches) {
    const itemXml = match[1];

    // 提取字段 (处理 CDATA)
    const title = (itemXml.match(/<title>(.*?)<\/title>/) || [])[1] || '';
    const link = (itemXml.match(/<link>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/link>/) || [])[1] || '';
    const description = (itemXml.match(/<description>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/description>/) || [])[1] || '';
    const pubDate = (itemXml.match(/<pubDate>(.*?)<\/pubDate>/) || [])[1] || '';

    // 清理 HTML 标签
    const cleanText = description.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

    // 构建数据
    const entry = {
      title: title.trim(),
      content: cleanText,
      link: link.trim(),
      source: 'Cointelegraph',
      published_at: pubDate || new Date().toISOString()
    };

    // 过滤条件
    const wordCount = entry.content.split(' ').length;
    const publishedDate = new Date(entry.published_at);
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const isRecent = publishedDate > oneDayAgo;

    if (wordCount > 10 && entry.title && isRecent) {
      cleanedData.push({ json: entry });
    }
  }
}

console.log(`✅ Extracted ${cleanedData.length} articles`);
return cleanedData;
```

**代码文件**: `n8n-clean-rss-function.js`

---

### 方法 3: 使用 XML 节点

n8n 也提供了 XML 解析节点。

#### 步骤:

1. 在 "Fetch RSS" 和 "Clean RSS Data" 之间添加 **XML 节点**
2. XML 节点配置:
   - Mode: `XML to JSON`
   - 这会将 RSS XML 转换为 JSON 对象

**工作流结构**:
```
Fetch RSS
    ↓
XML (XML to JSON)  ← 新增
    ↓
Clean RSS Data (简化版)
    ↓
继续...
```

---

## 🎯 推荐方案对比

| 方案 | 难度 | 稳定性 | 推荐指数 |
|------|------|--------|----------|
| RSS Feed Read 节点 | ⭐ 简单 | ⭐⭐⭐⭐⭐ 最稳定 | ⭐⭐⭐⭐⭐ 强烈推荐 |
| 修复 Function 代码 | ⭐⭐ 中等 | ⭐⭐⭐ 较稳定 | ⭐⭐⭐ 可用 |
| XML 节点 + Function | ⭐⭐⭐ 复杂 | ⭐⭐⭐⭐ 稳定 | ⭐⭐ 备选 |

**结论**: 使用 **RSS Feed Read 节点**最简单可靠！

---

## 📝 实施步骤 (推荐方案)

### Step 1: 修改工作流使用 RSS Feed Read

1. 在 n8n 中打开你的工作流
2. 点击 "Fetch CoinDesk RSS" 节点并删除
3. 点击左侧 "+" 按钮，搜索 "RSS"
4. 选择 **"RSS Feed Read"** 节点
5. 配置:
   ```
   URL: https://cointelegraph.com/rss
   ```
6. 将此节点连接到 "Login to Directus" 之后

### Step 2: 简化或删除 Clean RSS Data 节点

RSS Feed Read 会自动解析，你可以:

**选项 A**: 删除 "Clean RSS Data" 节点，直接连接到 "Split In Batches"

**选项 B**: 简化 Clean RSS Data，只做过滤:

```javascript
// 简化的过滤逻辑
const items = $input.all();
const filtered = [];

for (const item of items) {
  const data = item.json;

  // RSS Feed Read 已经解析好了，直接使用
  const entry = {
    title: data.title || '',
    content: data.contentSnippet || data.description || '',
    link: data.link || '',
    source: 'Cointelegraph',
    published_at: data.pubDate || data.isoDate || new Date().toISOString()
  };

  // 简单过滤
  const wordCount = entry.content.split(' ').length;
  const isRecent = new Date(entry.published_at) > new Date(Date.now() - 24 * 60 * 60 * 1000);

  if (wordCount > 10 && entry.title && isRecent) {
    filtered.push({ json: entry });
  }
}

return filtered;
```

### Step 3: 测试

1. 点击 "Execute Workflow" 或单独测试 RSS Feed Read 节点
2. 应该看到解析好的新闻列表

---

## 🧪 测试 RSS Feed Read 节点

### 单独测试步骤:

1. 双击 "RSS Feed Read" 节点
2. 点击 "Execute Node"
3. 查看输出，应该看到类似:

```json
[
  {
    "title": "Bitcoin price starts $112K breakout...",
    "link": "https://cointelegraph.com/news/...",
    "description": "Bitcoin price action favored bulls...",
    "contentSnippet": "Bitcoin price action favored bulls...",
    "pubDate": "Sun, 26 Oct 2025 09:38:39 +0000",
    "isoDate": "2025-10-26T09:38:39.000Z"
  },
  ...
]
```

---

## ⚠️ 常见错误

### 错误 1: "No items found"

**原因**: RSS URL 不正确或无法访问

**解决**:
- 检查 URL: `https://cointelegraph.com/rss`
- 在浏览器中测试 URL 是否可访问
- 检查网络连接

### 错误 2: "Cannot read property 'title' of undefined"

**原因**: RSS 结构与预期不符

**解决**:
- 先查看 RSS Feed Read 的原始输出
- 根据实际字段调整代码

### 错误 3: Function 节点仍然返回空

**原因**: 过滤条件太严格

**解决**:
- 降低 wordCount 要求 (改为 5 或 10)
- 移除时间过滤 (暂时注释掉 isRecent 检查)
- 添加 console.log 调试

---

## 📊 完整的工作流对比

### 使用 HTTP Request (当前方式)
```
Login → HTTP Request (GET RSS) → Function (手动解析XML) → Split...
        ❌ 需要手动解析           ❌ 复杂且易出错
```

### 使用 RSS Feed Read (推荐)
```
Login → RSS Feed Read → (可选: 简单过滤) → Split...
        ✅ 自动解析      ✅ 简单可靠
```

---

## 🚀 立即修复

**最快的修复方法** (1 分钟):

1. 删除 "Fetch CoinDesk RSS" 节点
2. 添加 "RSS Feed Read" 节点，URL: `https://cointelegraph.com/rss`
3. 删除 "Clean RSS Data" 节点
4. 直接连接 "RSS Feed Read" → "Split In Batches"
5. 测试运行

**完成！**

---

## 📚 相关文档

- [n8n RSS Feed Read 文档](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.rssfeedread/)
- [n8n Function 节点文档](https://docs.n8n.io/code-examples/expressions/)
- [RSS 测试源列表](./RSS_FEEDS_TESTED.md)

---

## 💡 调试技巧

在 Function 节点开头添加:

```javascript
// 查看输入数据结构
console.log('Input type:', typeof $input.all()[0].json);
console.log('Input sample:', JSON.stringify($input.all()[0].json).substring(0, 500));
```

这样可以在 n8n 的执行日志中看到实际的数据格式。
