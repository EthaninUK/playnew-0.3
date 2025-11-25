# 🤖 n8n 币圈八卦自动采集系统

## ⚠️ 重要更新：Twitter API 现已收费

Twitter API 搜索功能现在需要**至少 $100/月**，因此我们提供了**完全免费**的替代方案：

### 🆓 免费方案（推荐）

1. **RSS 聚合采集器** - 监控 10+ 主流币圈媒体（完全免费）
2. **Telegram 频道监控** - 实时监听 TG 频道消息（完全免费）
3. **组合使用** - 两者同时运行，覆盖最全面（完全免费）

### 💰 付费方案（可选）

- Twitter API 采集器 - $100/月起（如果你有预算）

---

## 🏆 推荐工作流

### ⚡ 优化版（推荐，遵循 n8n 最佳实践）

| 工作流 | 成本 | 配置难度 | 日产出 | 稳定性 | 推荐度 |
|--------|------|----------|--------|--------|--------|
| **RSS 聚合采集器 - 优化版** ⭐ | **$0** | ⭐ 简单 | 20-50条 | 🟢 极高 | ⭐⭐⭐⭐⭐ |
| **Telegram 监控 - 优化版** ⭐ | **$0** | ⭐⭐ 中等 | 10-30条 | 🟢 极高 | ⭐⭐⭐⭐⭐ |
| **组合使用（优化版）** ⭐ | **$0** | ⭐⭐ 中等 | 30-80条 | 🟢 极高 | ⭐⭐⭐⭐⭐ |

### 基础版

| 工作流 | 成本 | 配置难度 | 日产出 | 稳定性 | 推荐度 |
|--------|------|----------|--------|--------|--------|
| RSS 聚合采集器 | $0 | ⭐ 简单 | 20-50条 | 🟡 中等 | ⭐⭐⭐ |
| Telegram 监控 | $0 | ⭐⭐ 中等 | 10-30条 | 🟡 中等 | ⭐⭐⭐ |
| Twitter 采集器 | $100+/月 | ⭐⭐⭐ 复杂 | 30-80条 | 🟡 中等 | ⭐⭐ |

**⚡ 新用户强烈推荐使用优化版！** 基于 n8n 最佳实践，更稳定、更智能、更易维护。

---

## 📂 文件说明

```
n8n-workflows/
├── README.md                                  # 👈 你在这里
│
├── ⚡ 优化版工作流（推荐）
│   ├── rss-gossip-collector-optimized.json          # 📰 RSS采集器 - 优化版 ⭐
│   ├── telegram-gossip-collector-optimized.json     # 💬 Telegram监控 - 优化版 ⭐
│   └── OPTIMIZED-VERSION-GUIDE.md                   # 📖 优化版使用指南
│
├── 📚 文档
│   ├── FREE-SETUP-GUIDE.md                # 🆓 免费方案设置指南
│   ├── FREE-ALTERNATIVES.md               # 💡 免费方案对比分析
│   ├── TROUBLESHOOTING.md                 # 🔧 故障排查指南
│
├── 基础版工作流
│   ├── rss-gossip-collector.json          # 📰 RSS采集器 - 基础版
│   ├── telegram-gossip-collector.json     # 💬 Telegram监控 - 基础版
│   └── twitter-gossip-collector-fixed.json # 🐦 Twitter采集器 (需要$100/月)
│
├── 已过时文档
│   ├── QUICKSTART.md                      # Twitter版快速上手
│   └── SETUP-GUIDE.md                     # Twitter版完整文档
│
└── 工具
    ├── .env.n8n.example                  # 🔐 环境变量示例
    └── test-api-connections.sh            # 🔍 API 连接测试脚本
```

---

## 🚀 快速开始（推荐：优化版）

### ⚡ 方案 1: RSS 聚合采集器 - 优化版（最简单，5分钟）

```bash
# 1. 配置环境变量（编辑 .env）
DIRECTUS_URL=http://host.docker.internal:8055
DIRECTUS_TOKEN=你的_directus_token

# 2. 启动 n8n
./start-n8n.sh

# 3. 导入优化版工作流 ⭐
# 访问 http://localhost:5678
# 导入文件: rss-gossip-collector-optimized.json

# 4. 测试运行
# 点击 "Execute Workflow" 按钮
# 查看详细的统计报告

# 5. 启用自动运行
# 开启 "定时触发器" 节点
```

**为什么选择优化版？**
- ✅ SplitInBatches 逐个处理，避免并发问题
- ✅ 4层级关键词系统，更精准
- ✅ 10+维度智能评分
- ✅ 详细的统计报告
- ✅ 完善的错误处理
- ✅ 遵循 n8n 最佳实践

**详细对比请查看：** [OPTIMIZED-VERSION-GUIDE.md](OPTIMIZED-VERSION-GUIDE.md)

### 方案 2: Telegram 频道监控（实时性强）

```bash
# 1. 创建 Telegram Bot
# 在 Telegram 搜索 @BotFather
# 发送 /newbot 创建 bot
# 获得 Bot Token

# 2. 导入工作流
# 访问 http://localhost:5678
# 导入文件: telegram-gossip-collector.json

# 3. 配置 Bot Token
# 在 "Telegram Trigger" 节点中设置凭证

# 4. 添加 Bot 到频道
# 将 bot 添加为频道管理员

# 5. 激活工作流
# 点击 "Inactive" 切换为 "Active"
```

**详细步骤请查看：** [FREE-SETUP-GUIDE.md](FREE-SETUP-GUIDE.md)

---

## 📊 工作流架构

```
┌──────────────────────────────────────────────────────────────┐
│  Schedule Trigger (每 15 分钟)                                │
└────────────────────┬─────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────────┐
│  Generate KOL Queries                                         │
│  • 20+ KOL 账号                                               │
│  • 生成搜索查询                                               │
└────────────────────┬─────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────────┐
│  Twitter Search API                                           │
│  • 获取推文                                                   │
│  • 包含互动数据                                               │
└────────────────────┬─────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────────┐
│  Filter & Score                                               │
│  • 关键词过滤（传闻、爆料、跑路等）                           │
│  • 互动量过滤（≥50）                                          │
│  • 计算可信度评分（0-100）                                    │
└────────────────────┬─────────────────────────────────────────┘
                     │
                     ▼
              ┌──────────────┐
              │ 可信度 < 70？ │
              └──┬────────┬──┘
                 │ Yes    │ No
                 ▼        ▼
    ┌────────────────┐  ┌─────────────┐
    │ OpenAI 分析    │  │ 直接发布    │
    └────────┬───────┘  └──────┬──────┘
             │                  │
             └──────────┬───────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────────────┐
│  Publish to Directus                                          │
│  • 创建 news 记录                                             │
│  • 自动设置 gossip 类型                                       │
│  • 包含可信度评分                                             │
└────────────────────┬─────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────────┐
│  Summary Stats                                                │
│  • 统计本次采集数量                                           │
│  • 平均可信度                                                 │
└──────────────────────────────────────────────────────────────┘
```

---

## 🎯 监控的 KOL 账号

### 顶级 KOL
- **@VitalikButerin** - V神
- **@cz_binance** - CZ
- **@elonmusk** - 马斯克
- **@APompliano** - Pomp

### 中文 KOL
- **@WuBlockchain** - 吴说
- **@cnLedger** - Colin Wu
- **@mhballs** - 超级比特币
- **@bitquant** - BitQuant

### 链上侦探
- **@zachxbt** - ZachXBT
- **@lookonchain** - Lookonchain
- **@whale_alert** - Whale Alert
- **@ArkhamIntel** - Arkham
- **@peckshield** - PeckShield

### 媒体
- **@Cointelegraph** - Cointelegraph
- **@CoinDesk** - CoinDesk
- **@TheBlock__** - The Block
- **@8btc_official** - 8BTC

### 其他重要账号
- **@haydenzadams** - Uniswap 创始人
- **@stani** - Aave 创始人
- **@MessariCrypto** - Messari
- **@thedefiedge** - The DeFi Edge
- **@cobie** - Cobie
- **@HsakaTrades** - Hsaka

**共 20+ 账号，可随时在工作流中添加更多。**

---

## 🔑 八卦关键词库

### 中文关键词
- 传闻、爆料、据悉、消息称
- 跑路、卷款、崩盘、暴雷
- 内幕、泄露、曝光

### 英文关键词
- rumor, allegedly, reportedly
- scam, rug pull, exit scam
- dump, crash, collapse
- leak, exposed, insider

**工作流会自动匹配这些关键词，只采集相关内容。**

---

## 🧮 可信度评分算法

工作流使用以下规则计算可信度（0-100）：

```javascript
基础分: 50

加分项:
+ KOL 权重加成 (Vitalik = +4, CZ = +4, 媒体 = 0)
+ 高互动量 (>500) = +10
+ 包含证据链接 = +10
+ 验证来源 = +5

减分项:
- 低互动量 (<100) = -10
- 纯文本无证据 = -5

最终分数限制在 0-100 之间
```

**如果可信度 < 70，会调用 OpenAI 进行二次分析。**

---

## 💰 成本估算

### Twitter API

**Free Tier（推荐配置）:**
- 限额: 500K 推文/月
- 本工作流优化配置: 监控 10 个 KOL，每 30 分钟
- 预计消耗: ~150K/月
- **费用: $0/月 ✅**

**Basic Tier（完整功能）:**
- 限额: 10M 推文/月
- 可监控全部 20+ KOL，每 15 分钟
- **费用: $100/月**

### OpenAI API

- 模型: gpt-4o-mini
- 价格: $0.150/1M input tokens
- 预计: 每天 10 条 AI 分析
- **费用: ~$3-5/月**

### 总成本

- **最小配置**: $3-5/月（Free Twitter + OpenAI）
- **推荐配置**: $103-105/月（Basic Twitter + OpenAI）

---

## 📈 预期产出

基于测试数据估算：

| 指标 | 数值 |
|------|------|
| 每次采集推文数 | 50-100 条 |
| 过滤后符合关键词 | 5-15 条 |
| 通过互动量阈值 | 3-8 条 |
| 最终发布到 CMS | 2-5 条 |
| **每日产出** | **30-80 条八卦** |

---

## 🔧 配置与维护

### 必需配置

1. **Twitter API 凭证** - 必需，否则无法采集
2. **Directus Token** - 必需，否则无法发布
3. **OpenAI API Key** - 可选，不配置会使用规则引擎

### 推荐优化

1. **调整 KOL 列表** - 根据你的受众调整监控账号
2. **优化关键词** - 添加行业特定的八卦词汇
3. **调整互动量阈值** - 根据数据质量调整
4. **设置发布策略** - 低可信度保存为草稿

### 日常维护

```bash
# 查看运行状态
docker logs playnew-n8n --tail 50

# 查看执行历史
# 访问 http://localhost:5678 → Executions

# 重启服务
docker-compose -f docker-compose.n8n.yml restart
```

---

## 🐛 故障排查

### 问题 1: Twitter API 429 错误

**原因:** Rate limit 超限
**解决:**
- 等待 15 分钟
- 或降低采集频率（改为 30 分钟）
- 或减少 KOL 数量

### 问题 2: Directus 403 错误

**原因:** Token 无效或权限不足
**解决:**
```bash
# 重新获取 token
curl -X POST http://localhost:8055/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"the_uk1@outlook.com","password":"Mygcdjmyxzg2026!"}' \
  | jq -r '.data.access_token'

# 更新 .env 文件
# 重启 n8n
docker-compose -f docker-compose.n8n.yml restart
```

### 问题 3: OpenAI insufficient_quota

**原因:** 账户余额不足
**解决:**
- 充值 OpenAI 账户
- 或暂时禁用 AI 分析节点（不影响基础采集）

### 问题 4: n8n 无法访问 Directus

**原因:** Docker 网络配置问题
**解决:**

确保 `docker-compose.n8n.yml` 中有：
```yaml
extra_hosts:
  - "host.docker.internal:host-gateway"
```

工作流中使用 `http://host.docker.internal:8055`

---

## 📚 文档索引

| 文档 | 用途 | 适合人群 |
|------|------|----------|
| [QUICKSTART.md](QUICKSTART.md) | 5分钟快速上手 | 想快速开始的用户 |
| [SETUP-GUIDE.md](SETUP-GUIDE.md) | 完整安装配置指南 | 需要详细步骤的用户 |
| [../scrapers/README.md](../scrapers/README.md) | Node.js 版采集器 | 偏好编程的用户 |

---

## 🔗 相关资源

### API 文档
- [Twitter API v2](https://developer.twitter.com/en/docs/twitter-api)
- [Directus API](https://docs.directus.io/reference/introduction.html)
- [OpenAI API](https://platform.openai.com/docs/api-reference)
- [n8n Documentation](https://docs.n8n.io/)

### 申请地址
- [Twitter Developer Portal](https://developer.twitter.com/)
- [OpenAI Platform](https://platform.openai.com/)
- [Etherscan API](https://etherscan.io/apis)

---

## 🤝 贡献与反馈

如有问题或建议：

1. 检查 [SETUP-GUIDE.md](SETUP-GUIDE.md) 的故障排查部分
2. 查看 n8n 执行日志
3. 提交 GitHub Issue（如适用）

---

## 📜 许可与免责

⚠️ **重要提示:**

1. **遵守服务条款** - 确保遵守 Twitter、OpenAI 等平台的 TOS
2. **尊重隐私** - 仅采集公开信息
3. **内容审核** - 八卦内容应人工复审敏感信息
4. **版权** - 注明原始来源
5. **免责声明** - 八卦内容应标注"未经验证"

---

**祝你成功运营币圈最热门的八卦平台！** 🎉

有问题随时查看文档或日志。
