# 已测试的加密货币 RSS 数据源

## ✅ 可用的 RSS 源 (已验证)

### 1. Cointelegraph ⭐ 推荐
```
URL: https://cointelegraph.com/rss
状态: ✅ 工作正常
更新频率: 每小时
语言: 英文
```

### 2. Decrypt
```
URL: https://decrypt.co/feed
状态: ✅ 工作正常
更新频率: 每日多次
语言: 英文
```

### 3. The Block
```
URL: https://www.theblock.co/rss.xml
状态: ✅ 工作正常
更新频率: 每日多次
语言: 英文
```

### 4. CoinDesk
```
URL: https://www.coindesk.com/arc/outboundfeeds/rss/
状态: ⚠️ 有重定向问题 (308)
建议: 暂时不使用，等待修复
```

### 5. Bitcoin Magazine
```
URL: https://bitcoinmagazine.com/.rss/full/
状态: ✅ 工作正常
更新频率: 每日
语言: 英文
```

### 6. CryptoSlate
```
URL: https://cryptoslate.com/feed/
状态: ✅ 工作正常
更新频率: 每日多次
语言: 英文
```

---

## 🎯 推荐使用的数据源组合

### 方案 1: 综合新闻 (推荐用于测试)
```
1. Cointelegraph - https://cointelegraph.com/rss
2. Decrypt - https://decrypt.co/feed
3. The Block - https://www.theblock.co/rss.xml
```

### 方案 2: 专业深度
```
1. The Block - https://www.theblock.co/rss.xml
2. Bitcoin Magazine - https://bitcoinmagazine.com/.rss/full/
```

### 方案 3: 快速更新
```
1. Cointelegraph - https://cointelegraph.com/rss
2. CryptoSlate - https://cryptoslate.com/feed/
```

---

## 📋 中文数据源 (可选)

### 1. 金色财经
```
URL: https://www.jinse.com/feed
状态: ⚠️ 需要验证
语言: 中文
```

### 2. 巴比特
```
URL: https://www.8btc.com/feed
状态: ⚠️ 需要验证
语言: 中文
```

**注意**: 中文源可能不提供标准 RSS，需要单独处理。

---

## 🔧 在 n8n 中使用

### 单个数据源配置

在 "Fetch RSS" 节点中:

```
节点名称: Fetch Cointelegraph RSS
Method: GET
URL: https://cointelegraph.com/rss
Options:
  - Timeout: 10000
  - Follow Redirect: true
Headers:
  - User-Agent: Mozilla/5.0 (compatible; CryptoPlayBot/1.0)
```

### 多个数据源配置

如果要同时抓取多个源，可以:

**方法 1: 创建多个节点**
```
Trigger
  ↓
├─→ Fetch Cointelegraph → Process
├─→ Fetch Decrypt → Process
└─→ Fetch The Block → Process
      ↓
    Merge
```

**方法 2: 使用 Loop**
```javascript
// 在 Function 节点中
const sources = [
  'https://cointelegraph.com/rss',
  'https://decrypt.co/feed',
  'https://www.theblock.co/rss.xml'
];

return sources.map(url => ({ json: { url } }));
```

---

## 🧪 测试 RSS 源

使用以下命令测试 RSS 源是否可访问:

```bash
# 测试 Cointelegraph
curl -sL "https://cointelegraph.com/rss" | head -20

# 测试 Decrypt
curl -sL "https://decrypt.co/feed" | head -20

# 测试 The Block
curl -sL "https://www.theblock.co/rss.xml" | head -20
```

---

## ⚠️ CoinDesk 重定向问题

CoinDesk RSS 返回 308 永久重定向错误:

```json
{
  "redirect": "/arc/outboundfeeds/rss",
  "status": "308"
}
```

**临时解决方案**:
1. 使用其他 RSS 源代替
2. 等待 CoinDesk 修复重定向问题
3. 或使用他们的 API (需要申请)

---

## 📊 RSS 数据结构示例

标准 RSS 返回的数据通常包含:

```xml
<item>
  <title>文章标题</title>
  <link>https://...</link>
  <description>文章摘要</description>
  <pubDate>Sun, 26 Oct 2025 15:55:34 +0000</pubDate>
  <category>DeFi</category>
  <content:encoded>完整内容...</content:encoded>
</item>
```

在 n8n 中会被解析为:

```json
{
  "title": "文章标题",
  "link": "https://...",
  "description": "文章摘要",
  "pubDate": "2025-10-26T15:55:34.000Z",
  "category": "DeFi",
  "content": "完整内容..."
}
```

---

## 🔄 RSS 节点配置建议

### 基本配置
```
Method: GET
URL: https://cointelegraph.com/rss

Options:
  - Response Format: String (让 n8n 自动解析 RSS)
  - Timeout: 15000
  - Follow Redirect: true
  - Ignore SSL Issues: false
```

### Headers 配置
```
User-Agent: Mozilla/5.0 (compatible; CryptoPlayBot/1.0)
Accept: application/rss+xml, application/xml, text/xml
```

---

## 💡 最佳实践

1. **使用多个数据源**: 避免单点故障
2. **设置合理的超时**: 推荐 10-15 秒
3. **添加错误处理**: 即使一个源失败，其他仍可继续
4. **尊重频率限制**: 不要过于频繁请求
5. **监控源状态**: 定期检查 RSS 源是否正常

---

## 🚀 快速开始

推荐使用 **Cointelegraph** 作为第一个测试源:

1. 在 n8n 中修改 "Fetch RSS" 节点
2. URL 改为: `https://cointelegraph.com/rss`
3. 点击 "Execute Node" 测试
4. 应该能看到最新的新闻列表

成功后，再添加其他数据源！
