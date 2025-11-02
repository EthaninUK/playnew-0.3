# Quality Check 节点配置指南

## 问题

Quality Check (IF 节点) 没有输出数据到后续节点。

## 原因

IF 节点的条件配置不正确，导致所有数据都被过滤掉了。

---

## ✅ 正确配置

### 配置 Quality Check 节点

1. **双击** "Quality Check" 节点打开配置

2. **删除当前的条件**，点击每个条件右侧的 ❌ 删除

3. **添加新的条件**:

#### 条件 1: 检查标题不为空

点击 "Add Condition" → 选择 "String"

```
字段类型: String
value1: {{ $json.title }}
操作符: is not empty
```

#### 条件 2: 检查内容不为空

点击 "Add String Condition"

```
字段类型: String
value1: {{ $json.contentSnippet }}
操作符: is not empty
```

#### 条件 3: 检查内容长度（可选）

点击 "Add Condition" → 选择 "Number"

```
字段类型: Number
value1: {{ $json.contentSnippet.length }}
操作符: larger
value2: 50
```

4. **设置组合逻辑**

在 "Combine Conditions" 下拉菜单中选择：
```
AND (所有条件都满足)
```

如果希望只要满足一个条件就通过，选择：
```
OR (满足任一条件)
```

---

## 📸 完整配置示例

### 简单配置（推荐新手）

只检查标题是否存在：

```
Conditions:
├─ String Condition 1:
│  value1: {{ $json.title }}
│  operator: is not empty
│
└─ Combine: (单个条件不需要设置)
```

### 标准配置（推荐）

检查标题和内容：

```
Conditions:
├─ String Condition 1:
│  value1: {{ $json.title }}
│  operator: is not empty
│
├─ String Condition 2:
│  value1: {{ $json.contentSnippet }}
│  operator: is not empty
│
└─ Combine: AND
```

### 完整配置（严格过滤）

检查标题、内容和内容长度：

```
Conditions:
├─ String Condition 1:
│  value1: {{ $json.title }}
│  operator: is not empty
│
├─ String Condition 2:
│  value1: {{ $json.contentSnippet }}
│  operator: is not empty
│
├─ Number Condition 1:
│  value1: {{ $json.contentSnippet.length }}
│  operator: larger
│  value2: 50
│
└─ Combine: AND
```

---

## 🎯 RSS Feed Read 返回的数据结构

RSS Read 节点返回的数据格式：

```json
{
  "title": "Bitcoin price starts $112K breakout...",
  "link": "https://cointelegraph.com/news/...",
  "description": "Full HTML description...",
  "contentSnippet": "Plain text summary of the article...",
  "content": "Full HTML content...",
  "pubDate": "Sun, 26 Oct 2025 09:38:39 +0000",
  "isoDate": "2025-10-26T09:38:39.000Z",
  "creator": "Author name"
}
```

**可用字段**:
- `title` - 文章标题
- `contentSnippet` - 纯文本摘要（推荐用于内容检查）
- `description` - HTML 描述
- `link` - 文章链接
- `pubDate` - 发布日期

---

## ⚡ 快速修复步骤

1. 双击 "Quality Check" 节点
2. 删除所有现有条件
3. 点击 "Add Condition" → "String"
4. 配置:
   - value1: `{{ $json.title }}`
   - operator: `is not empty`
5. 点击 "Save"
6. 点击 "Execute Node" 测试

应该看到数据通过到 "true" 输出！

---

## 🐛 常见错误

### 错误 1: 使用了错误的字段名

❌ 错误:
```
value1: {{ $json.content }}  // RSS Read 可能没有这个字段
```

✅ 正确:
```
value1: {{ $json.contentSnippet }}  // 使用实际存在的字段
```

### 错误 2: 条件太严格

如果所有数据都被过滤掉，尝试：
1. 减少条件数量
2. 降低阈值（如长度从 100 改为 20）
3. 使用 OR 而不是 AND

### 错误 3: 表达式语法错误

❌ 错误:
```
value1: $json.title  // 缺少花括号
```

✅ 正确:
```
value1: {{ $json.title }}  // 完整的表达式语法
```

---

## 🧪 测试技巧

### 查看 RSS Read 的实际输出

1. 双击 "RSS Read" 节点
2. 点击 "Execute Node"
3. 查看输出的第一条数据
4. 记下可用的字段名

### 临时禁用过滤（调试用）

如果想暂时让所有数据通过：

1. 双击 Quality Check 节点
2. 删除所有条件
3. 添加一个始终为真的条件：
   ```
   Number Condition:
   value1: 1
   operator: equals
   value2: 1
   ```

这样所有数据都会通过 "true" 分支。

---

## 📊 分支说明

IF 节点有两个输出：

```
Quality Check
├─ true (绿色) → 通过条件的数据 → AI Translate & Summarize
└─ false (红色) → 未通过条件的数据 → Log Error (可选)
```

确保将后续节点连接到 **true (绿色)** 输出！

---

## 💡 推荐配置

对于 RSS 新闻抓取，推荐使用**标准配置**：

```
检查条件:
✅ 标题不为空
✅ 内容摘要不为空
✅ 组合方式: AND

这样可以过滤掉无效数据，同时保留大部分有效新闻。
```

---

## 📝 完整的节点配置 JSON

如果需要直接导入配置：

```json
{
  "parameters": {
    "conditions": {
      "string": [
        {
          "value1": "={{ $json.title }}",
          "operation": "isNotEmpty"
        },
        {
          "value1": "={{ $json.contentSnippet }}",
          "operation": "isNotEmpty"
        }
      ]
    },
    "combineOperation": "all"
  },
  "name": "Quality Check",
  "type": "n8n-nodes-base.if",
  "typeVersion": 2
}
```

---

## 🚀 下一步

配置完 Quality Check 后：

1. 点击 "Execute Node" 测试
2. 应该看到数据从 "true" 输出
3. 连接到 "Split In Batches" 或直接到 "AI Translate"
4. 继续测试工作流

---

需要帮助？查看 RSS Read 节点的输出，确认字段名称！
