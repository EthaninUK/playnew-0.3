# n8n ChainCatcher 工作流修复说明

## 🚨 错误原因

从你的截图看到的错误：

```
TypeError: Cannot read properties of undefined (reading 'match') [line 5]
```

### 问题 1: 数据访问路径错误

你的代码：
```javascript
const html = $input.item.json.body;  // ❌ body 不存在
```

正确的访问路径（从截图的 INPUT 看）：
```javascript
const html = $input.item.json.data;  // ✅ 数据在 data 字段中
```

### 问题 2: n8n Code 节点不支持 vm 模块

n8n 的 Code 节点运行在受限的沙箱环境中，**不支持 `require('vm')`**。

---

## ✅ 解决方案

### 方案 A：使用 Function Item 节点（推荐）

Function Item 节点有更多权限，可以使用 `require()`。

但即使这样，**最简单的方法还是直接使用 Node.js 脚本**，通过 n8n 的 Execute Command 节点调用。

### 方案 B：直接用 Node.js 脚本（最简单）

我已经为你创建了完美工作的脚本：`scrape-chaincatcher-simple.js`

在 n8n 中创建一个简单的工作流：

```
[Cron 节点]
   → [Execute Command 节点]
      → 命令: node /Users/m1/PlayNew_0.3/scrape-chaincatcher-simple.js
```

---

## 🎯 n8n 工作流配置（推荐方式）

### 节点 1: Cron (定时触发)

- **Trigger Interval**: Every 30 minutes
- **Cron Expression**: `*/30 * * * *`

### 节点 2: Execute Command

**配置**：
- **Command**: `node`
- **Arguments**:
  ```
  /Users/m1/PlayNew_0.3/scrape-chaincatcher-simple.js
  ```
- **Working Directory**: `/Users/m1/PlayNew_0.3`

### 节点 3: 发送通知（可选）

- **IF** 节点检查执行结果
- **Slack/Email** 节点发送成功/失败通知

---

## 📋 完整的 n8n 工作流 JSON

我会为你创建一个简化版的 n8n 工作流，使用 Execute Command 节点：

### 导入步骤

1. 复制下面的 JSON
2. 在 n8n 中点击 **Import from File**
3. 粘贴 JSON 内容
4. 激活工作流

### 工作流 JSON

```json
{
  "name": "ChainCatcher Scraper (Execute Command)",
  "nodes": [
    {
      "parameters": {
        "rule": {
          "interval": [
            {
              "field": "minutes",
              "minutesInterval": 30
            }
          ]
        }
      },
      "id": "cron-trigger",
      "name": "Every 30 Minutes",
      "type": "n8n-nodes-base.scheduleTrigger",
      "typeVersion": 1.2,
      "position": [250, 300]
    },
    {
      "parameters": {
        "command": "node /Users/m1/PlayNew_0.3/scrape-chaincatcher-simple.js",
        "options": {}
      },
      "id": "execute-scraper",
      "name": "Run ChainCatcher Scraper",
      "type": "n8n-nodes-base.executeCommand",
      "typeVersion": 1,
      "position": [450, 300]
    }
  ],
  "connections": {
    "Every 30 Minutes": {
      "main": [
        [
          {
            "node": "Run ChainCatcher Scraper",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "settings": {
    "executionOrder": "v1"
  }
}
```

---

## 🔧 如果你坚持要在 n8n Code 节点中实现

### 修复后的代码（不使用 vm 模块）

```javascript
// Step 1: Get HTML content
const html = $input.item.json.data || $input.item.json.body;

if (!html) {
  throw new Error('No HTML content found');
}

// Step 2: Extract window.__NUXT__ assignment
const scriptMatch = html.match(/window\.__NUXT__=\(function.*?\{return (\{[\s\S]*?\})\}\)\((.*?)\);/);

if (!scriptMatch) {
  throw new Error('Could not find window.__NUXT__ pattern');
}

// This is very complex because window.__NUXT__ uses a function pattern
// The data is obfuscated with variable references (a,b,c,d,e,f,g...)
// We need to manually parse or use eval (dangerous!)

// SAFER ALTERNATIVE: Use regex to extract newsFlashList directly
const newsFlashMatch = html.match(/newsFlashList:\[(\{[^\]]+\}(?:,\{[^\]]+\})*)\]/);

if (!newsFlashMatch) {
  throw new Error('Could not find newsFlashList');
}

// Extract individual items using string manipulation
const newsFlashString = newsFlashMatch[1];
const itemStrings = newsFlashString.split(/\},\{/);

const items = [];

for (let i = 0; i < Math.min(10, itemStrings.length); i++) {
  let itemStr = itemStrings[i];
  if (!itemStr.startsWith('{')) itemStr = '{' + itemStr;
  if (!itemStr.endsWith('}')) itemStr = itemStr + '}';

  // Extract fields using regex
  const titleMatch = itemStr.match(/title:"([^"]+)"/);
  const descMatch = itemStr.match(/description:"([^"]+)"/);
  const idMatch = itemStr.match(/id:(\d+)/);

  if (!titleMatch || !descMatch) continue;

  items.push({
    json: {
      title: titleMatch[1],
      content: descMatch[1],
      summary: descMatch[1].substring(0, 197) + '...',
      url: \`https://www.chaincatcher.com/article/\${idMatch ? idMatch[1] : 'unknown'}\`,
      published_at: new Date().toISOString(),
      source: 'ChainCatcher',
      source_type: 'rss',
      category: 'news',
      status: 'published',
      view_count: 0,
      is_featured: false
    }
  });
}

return items;
```

**注意**：这个方法使用正则表达式，但：
- ⚠️ 不够健壮（特殊字符会导致失败）
- ⚠️ 无法解析变量引用（时间戳等）
- ⚠️ 维护困难

---

## 💡 最佳实践建议

### 推荐：使用 Execute Command 调用 Node.js 脚本

**优点**：
- ✅ 完整的 Node.js 环境
- ✅ 可以使用所有 npm 包（axios, vm, etc.）
- ✅ 易于调试和维护
- ✅ 日志输出清晰
- ✅ 可以单独测试

**n8n 工作流结构**：
```
[Cron: 每30分钟]
  → [Execute Command: node scrape-chaincatcher-simple.js]
    → [IF: 检查成功]
      → [Slack/Email: 发送通知]
```

### 不推荐：在 Code 节点中重写

**缺点**：
- ❌ 功能受限（无 vm, 无完整 require）
- ❌ 难以调试
- ❌ 代码复杂
- ❌ 容易出错

---

## 🚀 快速开始

### 1. 在 n8n 中创建新工作流

1. 打开 n8n: http://localhost:5678
2. 点击 **+ New Workflow**
3. 添加 **Schedule Trigger** 节点（设置每 30 分钟）
4. 添加 **Execute Command** 节点
5. 配置命令：
   ```bash
   node /Users/m1/PlayNew_0.3/scrape-chaincatcher-simple.js
   ```
6. 保存并激活

### 2. 手动测试

在 n8n 中点击 **Execute Workflow** 按钮。

你应该会看到：
```
✅ Successfully executed
Output:
  ✅ ChainCatcher scraping complete!
     Total items: 10
     Saved: X
     Skipped: Y
     Errors: 0
```

### 3. 查看结果

访问 http://localhost:3000/news 查看抓取的快讯！

---

## 📝 总结

**你的 n8n 错误的根本原因**：

1. ❌ 访问路径错误：`$input.item.json.body` 应该是 `$input.item.json.data`
2. ❌ 使用了 n8n 不支持的 `require('vm')`
3. ❌ window.__NUXT__ 的数据结构太复杂，无法用简单的 regex 解析

**解决方案**：

✅ **使用 Execute Command 节点调用已有的 Node.js 脚本**

这是最简单、最可靠的方法！

---

需要我帮你创建完整的 n8n 工作流 JSON 吗？
