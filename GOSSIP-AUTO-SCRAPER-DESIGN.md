# 🤖 币圈八卦自动化采集系统设计方案

## 一、数据来源策略

### 1.1 主要信息源

#### A. Twitter/X (最重要)
**目标账号类型**:
- 🐦 **KOL账号** (50个)
  - CZ, SBF相关账号, Vitalik, Arthur Hayes, Su Zhu
  - 中文KOL: 吴说、Colin Wu、潘志彪等

- 🔍 **链上侦探**
  - @zachxbt, @lookonchain, @whale_alert
  - @arkham, @peckshield

- 📰 **媒体账号**
  - @Cointelegraph, @CoinDesk, @TheBlock__
  - @WuBlockchain, @8btc_official

**采集内容**:
- 转发量>100 或 点赞量>500 的推文
- 包含关键词:"传闻"、"据悉"、"消息人士"、"独家"、"爆料"
- #hashtags: #cryptogossip, #cryptodrama

#### B. Telegram群组 (次重要)
**目标群组**:
- 各大项目官方群(监控内部消息泄露)
- 中文八卦群、吃瓜群
- 英文gossip频道

**采集内容**:
- 高热度消息(回复数>20)
- 管理员/官方人员的异常发言
- 爆料型内容

#### C. Reddit (r/CryptoCurrency, r/Bitcoin)
**采集内容**:
- Hot posts with "Drama" or "Gossip" flair
- 高赞评论中的爆料内容

#### D. Discord
**目标服务器**:
- 大型项目Discord的"general"频道
- 监控异常活跃或冲突

#### E. 链上数据 (客观八卦)
**工具**:
- Arkham Intelligence API
- Etherscan API
- Whale Alert

**采集内容**:
- 巨额转账(>$1M)
- 知名地址异常活动
- 项目方代币抛售

### 1.2 关键词库

#### 高优先级关键词(触发即采集):
```
传闻, 爆料, 据悉, 消息人士, 内幕, 独家
跑路, 卷款, Rug Pull, Exit Scam, 崩盘
离职, 内讧, 解散, 倒闭
被捕, 调查, 诉讼, SEC, 监管
清仓, 抛售, 砸盘, 做市商
造假, 刷量, 机器人, Sybil
