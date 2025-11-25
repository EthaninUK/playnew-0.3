# 🤖 币圈八卦自动化采集系统

## 系统架构

```
┌─────────────────┐
│  数据来源        │
├─────────────────┤
│ • Twitter       │──┐
│ • Telegram      │  │
│ • 链上数据      │  │
│ • Reddit        │  │
└─────────────────┘  │
                     │
                     ▼
┌─────────────────────────────────┐
│  采集器 (Scrapers)               │
├─────────────────────────────────┤
│ 1. 关键词过滤                    │
│ 2. 热度过滤 (互动量>阈值)        │
│ 3. AI分析 (OpenAI GPT-4)        │
│    - 可信度评分 (0-100)          │
│    - 自动分类                    │
│    - 生成摘要                    │
│ 4. 去重检查                      │
└─────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────┐
│  Directus CMS                   │
├─────────────────────────────────┤
│ • 自动发布(高可信度)             │
│ • 草稿待审(低可信度)             │
│ • 人工审核入口                   │
└─────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────┐
│  PlayNew.ai 八卦页面             │
│  http://localhost:3000/gossip   │
└─────────────────────────────────┘
```

## 采集器列表

### 1. Twitter 采集器 (`gossip-scraper-twitter.js`)

**功能**:
- 监控 50+ KOL 账号
- 关键词过滤 (传闻、爆料、跑路等)
- 热度过滤 (互动量 > 100)
- AI 分析可信度

**数据源**:
- @VitalikButerin (V神)
- @cz_binance (CZ)
- @WuBlockchain (吴说)
- @zachxbt (链上侦探)
- ... 更多

**采集频率**: 每 15 分钟

**API 要求**: Twitter API v2 (需申请)

### 2. Telegram 采集器 (`gossip-scraper-telegram.js`)

**功能**:
- 监控指定群组/频道
- 实时接收消息
- 热度过滤 (回复数 > 10)
- AI 内容分析

**数据源**:
- 中文八卦群
- 英文 gossip 频道
- 项目官方群(监控泄露)

**采集频率**: 实时 (事件驱动)

**API 要求**: Telegram Bot Token

### 3. 链上数据采集器 (`gossip-scraper-onchain.js`)

**功能**:
- 监控知名地址交易
- 巨额转账预警 (>1000 ETH)
- 交易所资金异动
- 自动生成分析报告

**数据源**:
- Vitalik 地址
- CZ 地址
- 项目方地址
- 交易所热钱包

**采集频率**: 每 30 分钟

**API 要求**: Etherscan API Key

## 安装部署

### 1. 安装依赖

```bash
cd scrapers
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env`:

```bash
cp .env.example .env
```

编辑 `.env`,填入你的 API Keys:

```env
# Twitter (申请地址: https://developer.twitter.com/)
TWITTER_BEARER_TOKEN=AAAAAAAAAAAAAAAAAAAAAxxxxx

# Telegram (从 @BotFather 获取)
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz

# OpenAI (用于AI分析,可选)
OPENAI_API_KEY=sk-xxxxxxxxxxxx

# Etherscan (申请地址: https://etherscan.io/apis)
ETHERSCAN_API_KEY=ABCDEFGHIJKLMNOP
```

### 3. 运行采集器

#### 开发模式 (单独运行):

```bash
# Twitter 采集器
npm run twitter

# Telegram 采集器
npm run telegram

# 链上数据采集器
npm run onchain

# 同时运行所有采集器
npm run all
```

#### 生产模式 (使用 PM2):

```bash
# 启动所有采集器
npm run pm2:start

# 查看日志
npm run pm2:logs

# 停止
npm run pm2:stop

# 重启
npm run pm2:restart

# 查看状态
pm2 status
```

## API Keys 申请指南

### 1. Twitter API v2

**申请步骤**:
1. 访问 https://developer.twitter.com/
2. 注册开发者账号
3. 创建 App
4. 申请 "Elevated Access" (免费,但需要说明用途)
5. 获取 Bearer Token

**费用**: Free tier 可满足基本需求
- 每月 500K 推文读取
- 每月 10K 用户查询

### 2. Telegram Bot Token

**申请步骤**:
1. 在 Telegram 中搜索 @BotFather
2. 发送 `/newbot`
3. 按提示设置 bot 名称
4. 获得 Token
5. 将 bot 添加到要监控的群组

**费用**: 完全免费

### 3. Etherscan API Key

**申请步骤**:
1. 访问 https://etherscan.io/apis
2. 注册账号
3. My API Keys > Add New API Key
4. 立即获得 API Key

**费用**: 免费版足够
- 每秒 5 次请求
- 每天 100K 请求

### 4. OpenAI API Key

**申请步骤**:
1. 访问 https://platform.openai.com/
2. 注册账号
3. API Keys > Create new secret key
4. 充值至少 $5

**费用估算** (使用 gpt-4o-mini):
- 每条八卦分析: ~$0.001
- 每天 100 条: ~$0.10
- 每月约 $3-5

**省钱技巧**: 如果预算有限,可以不配置 OpenAI,采集器会使用简单规则

## 采集效果预估

### 每日产出量

| 来源 | 原始数据量 | 过滤后 | 发布数 | 备注 |
|------|-----------|--------|--------|------|
| Twitter | 500-1000推文 | 50-100 | 10-20 | 高质量KOL |
| Telegram | 100-300消息 | 20-40 | 5-10 | 活跃群组 |
| 链上数据 | 10-50交易 | 5-10 | 3-5 | 巨额转账 |
| **合计** | - | - | **18-35/天** | - |

### 可信度分布

- **80%+** (高可信度): 30% → 自动发布
- **60-80%** (中等可信度): 50% → 自动发布
- **30-60%** (低可信度): 15% → 草稿待审
- **<30%** (谣言): 5% → 自动过滤

## 监控与维护

### 查看日志

```bash
# PM2 实时日志
pm2 logs gossip-twitter --lines 100

# 查看文件日志
tail -f logs/twitter-out.log
tail -f logs/twitter-error.log
```

### 常见问题

#### Q1: Twitter API 429 错误
**A**: Rate limit 达到上限,采集器会自动等待后重试。可降低采集频率。

#### Q2: Telegram bot 无法接收群组消息
**A**:
1. 确保 bot 已加入群组
2. 设置为管理员(或关闭隐私模式)
3. 重启采集器

#### Q3: AI 分析成本太高
**A**:
1. 使用 `gpt-4o-mini` 而非 `gpt-4` (便宜 30 倍)
2. 仅对高热度内容做 AI 分析
3. 或完全关闭 AI,使用规则引擎

#### Q4: 如何添加更多 KOL?
**A**: 编辑 `gossip-scraper-twitter.js`,在 `CONFIG.kols` 数组中添加:

```javascript
{ username: 'new_kol_username', weight: 85 },
```

## 进阶优化

### 1. 添加更多数据源

可以继续扩展:
- Reddit 采集器
- Discord 采集器
- 币安/OKX 公告监控
- SEC 文件监控

### 2. 提升分析质量

- 训练自定义 AI 模型
- 构建专属知识库
- 集成 Fact-checking API

### 3. 反垃圾策略

- IP 黑名单
- 内容指纹去重
- 异常行为检测

### 4. 性能优化

- 使用消息队列 (RabbitMQ/Redis)
- 分布式部署
- 缓存热数据

## 法律与道德

⚠️ **重要提示**:

1. **尊重隐私**: 不采集私密群组/个人隐私数据
2. **遵守TOS**: 遵守各平台服务条款
3. **内容审核**: 人工复审敏感内容
4. **版权**: 注明原始来源,不抄袭
5. **免责声明**: 八卦内容标注"未经验证"

## 成本估算

### 月度运营成本

| 项目 | 费用 | 备注 |
|------|------|------|
| Twitter API | $0 | Free tier |
| Telegram Bot | $0 | 免费 |
| Etherscan API | $0 | 免费 |
| OpenAI | $3-10 | gpt-4o-mini |
| 服务器 | $5-20 | VPS (1核2G) |
| **合计** | **$8-30/月** | |

### ROI 分析

- **内容产出**: 18-35 条/天 = 540-1050 条/月
- **人工成本**: 如人工写,至少 2-3 小时/天 = $600-900/月
- **节省**: 95%+ 的人力成本

## 下一步计划

- [ ] 添加中文 NLP 优化
- [ ] 集成更多数据源
- [ ] 构建八卦知识图谱
- [ ] 用户反馈学习系统
- [ ] 移动端推送通知

## 技术支持

如有问题,请查看:
1. 日志文件 (`logs/` 目录)
2. GitHub Issues
3. 项目文档

---

**祝你成功运营币圈最热门的八卦平台!** 🎉
