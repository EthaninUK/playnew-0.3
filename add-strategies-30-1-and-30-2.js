// 策略 30.1 和 30.2: 上线与下架节奏套利 + 解锁对冲套利

const axios = require('axios');

/**
 * 30.1 上线与下架节奏套利
 */
const STRATEGY_30_1 = {
  title: '上线与下架节奏套利 - 利用交易所节奏做时间差生意',
  slug: 'listing-delisting-schedule-arbitrage',
  summary:
    '围绕中心化交易所的新币上线/下架公告做结构性与情绪套利：上线前在 DEX 或小交易所低位布局，上线后流动性与情绪爆发阶段分批卖出；下架公告后利用恐慌抛售在非下架场景低吸，等待价格修复。适合能看公告、懂一点交易节奏的中级玩家。',
  category: 'structural-event-arbitrage',
  category_l1: 'arbitrage',
  category_l2: 'structural-event-arbitrage',
  risk_level: 3,
  apy_min: 20,
  apy_max: 80,
  min_investment: 3000,
  time_commitment: '每周 3-6 小时',
  status: 'published',
  content: `# 上线与下架节奏套利 - 利用交易所节奏做时间差生意

## 💰 策略概览

| 参数 | 数值 |
|------|------|
| **起投资金** | $3,000 - $30,000 |
| **时间投入** | 每周 3-6 小时（重大事件周会更多） |
| **预期年化收益** | 20-80%（视频率与执行力而定） |
| **风险等级** | ⚠️⚠️⚠️ 中等 (3/5) |
| **难度等级** | 中级 |
| **适合人群** | 经常刷公告、会用 CEX/DEX 的玩家；愿意做一点研究而不是纯梭哈 |

---

## 📖 开场故事：提前 4 天埋伏新币，上线当天 3 小时赚 52%

2024 年某个月，交易者 Leo 盯着几个主流交易所的**上币公告栏**。某天，他注意到一条信息：

> 某模块化公链代币 **$MODX** 将于 5 月 18 日 12:00 (UTC) 上线 Binance 现货，开通 MODX/USDT 交易对。

Leo 第一反应不是“上线那天冲进去梭哈”，而是：

> 这玩意儿现在已经在哪些地方交易？能不能提前埋伏一波？

他做了几件小事：

1. **查流通与估值**  
   - 总量：1,000,000,000  
   - 当前流通：80,000,000  
   - 现价：0.75 USDT（仅在链上 DEX + 两家中型交易所交易）  
   - FDV：\$750M，略贵但不夸张  
   - 生态在跑，TVL 也不算小 → **属于那种“还可以炒一炒”的币**

2. **看筹码结构**  
   - 早期轮锁仓还很多，但这次没有马上要解锁  
   - CEX 上币主要是情绪和流动性利好

3. **观察社区**  
   - TG/Discord 都在吹 “要上币安了，一定能飞”  
   - 典型的上线前 FOMO 氛围

Leo 的计划很简单：

> “别人等上线那一刻追高，我在上线前把筹码慢慢收好，上线当天只负责分批卖。”

---

### 实际操作记录

**T-4 天（5 月 14 日）**

- Leo 在 DEX 与小交易所分三笔买入 MODX：
  - 0.73, 0.75, 0.77 USDT 三个区间
  - 总共买了 80,000 枚  
- 综合成本约：0.752 USDT  
- 总成本：**\$60,160**

**T-1 天（5 月 17 日）**

- 上线预期发酵，DEX 上价格已经抬到 0.88-0.92 区间  
- Leo 没有卖，继续观望上线日流动性情况

**T 日 12:00 - 上线开盘**

- Binance 开盘价：0.95 USDT  
- 前 5 分钟迅速冲到 1.12 USDT，成交量放大  
- 市场 FOMO 情绪爆棚，社群各种“要 3 美金起步”的言论

Leo 选择冷静挂单：

- 第一档：1.05 USDT 卖出 30,000 枚  
- 第二档：1.12 USDT 卖出 30,000 枚  
- 第三档：1.18 USDT 卖出 20,000 枚

**T 日 + 3 小时**

- 三档全部成交，成交记录大致如下：

\`\`\`
卖出总额 ≈
  30,000 * 1.05 +
  30,000 * 1.12 +
  20,000 * 1.18
≈ $85,200

买入成本：$60,160
手续费（现货 + 链上）：约 $600

净利润：$24,440
单次收益率 ≈ 40.6%
持有时间：4 天
折算年化（事件型）：> 300%
\`\`\`

这就是典型的**上线节奏套利**：利用别人等“上线那一刻”兴奋冲进去的时间差，把筹码安静卖给他们。

---

## 🧠 策略逻辑：为什么上线 / 下架会产生结构性机会？

### 1. 信息传播与流动性迁移

- 新币往往是：**先上线 DEX / 小交易所** → 再上头部 CEX  
- 大部分散户只看 Binance/OKX/Bybit 的上币公告，不会提前去翻 DEX 交易情况  
- 结果：

  - 上线前：  
    - DEX/小所价格容易低估，盘子小、流动性弱  
  - 上线当天：  
    - 流动性成倍提升  
    - 做市商挂深度  
    - 搭配交易赛、充值返现等营销 → 情绪推动价格冲高

> 你做的不是预测“它值不值这个价”，而是吃信息传导和流动性迁移的**结构性收益**。

### 2. 不同交易所的用户结构差异

- 小交易所 / DEX 玩家：偏专业、偏早期、资金体量不一  
- 大交易所玩家：更多是只看“头条”、看热榜入场的普通用户  
- 当新币从“小圈子”进入“大流量入口”时，往往会经历一轮“重新定价 + 情绪抬升”。

### 3. 下架事件中的“被迫交易”

当交易所发布 “即将下架某币” 的公告时：

- 持币者被迫选择：
  - 在该交易所**卖出**  
  - 或者**转出到链上/其他交易所**
- 大多数人更偏向“省事”，直接在公告后几天选择市价卖出：
  - 造成短期内 **抛压集中爆发**  
  - 价格被砸到明显低于链上/其他平台的水平

如果项目还没有死（有 GitHub 更新、有社区、合规风险不大），下架只是“换个地方交易”，那么：

> 你可以在恐慌时低吸，在链上或其他平台慢慢卖出，赚一个情绪修复价差。

---

## 🔍 场景拆分：两种典型子策略

### 模式 A：新币上线前埋伏（Pre-Listing）

**核心句子：**  
> 在 DEX / 小所提前布局，等大交易所上线那一刻，把筹码分批卖给追高的人。

**适用前提：**

- 该币已经在链上或小交易所交易至少 7-14 天  
- 有明确的大交易所上币公告（时间、交易对写得清楚）  
- 项目基本面不算垃圾：有产品、TVL、用户/社区  
- 没有重大负面解锁在同一时间撞车

**筛选 Checklist：**

- [ ] 上线交易所为 Binance / OKX / Bybit / Coinbase 等一线  
- [ ] DEX/小所 24h 成交额 ≥ \$2M  
- [ ] 市值相对赛道不算离谱（可对比同类项目）  
- [ ] 上线前一周社媒热度在升温（推特、TG、Discord 活跃）

---

### 模式 B：下架恐慌抄底（Delisting Panic Bid）

**核心句子：**  
> 大所下架 = 被迫卖盘 + 情绪恐慌，若项目没死，可以在恐慌尾部低吸，再去链上/其他平台等待价格修复。

**适用前提：**

- 下架原因不是**致命利空**：
  - 不是因为诈骗、监管严重违规、项目跑路  
  - 更多是流动性不足、业务调整等  
- 项目方 Github / 推特仍在持续更新  
- 链上仍有一定 TVL 或真实使用场景

**典型路线：**

1. 大所公告 “T+7 日将下架某币”  
2. 持币者恐慌：  
   - 公告当天与次日大量市价抛售  
   - 价格在短期内急跌 30-60%  
3. 你在 **其他未下架交易所 / 链上池子** 观察折价幅度  
4. 在恐慌后段分批买入，预计持有 1-6 个月，等待新叙事/市场恢复。

---

## 🛠️ 监控上/下架事件的自动化脚本（示意）

下面是一个**简化版 Node.js 监控器**，帮助你搭一个“事件候选池”：

- 定期抓取多家交易所公告页或 RSS
- 从标题里识别“上线 / 下架”事件
- 初步筛选出有潜力的标的写入日志或数据库

\`\`\`javascript
class ListingDelistingWatcher {
  constructor() {
    this.exchanges = [
      {
        name: 'Binance',
        announcementsRSS: 'https://www.binance.com/zh-CN/support/announcement/c-48'
      },
      {
        name: 'OKX',
        announcementsRSS: 'https://www.okx.com/support/hc/zh-cn/sections/360000030652'
      },
      {
        name: 'Bybit',
        announcementsRSS: 'https://announcements.bybit.com/zh-TW/?category=listing'
      }
      // 你可以继续扩展其他交易所
    ];
  }

  /**
   * 伪代码：抓取 RSS / HTML 并解析
   */
  async fetchAnnouncements(rssUrl) {
    const res = await axios.get(rssUrl);
    const html = res.data;

    // TODO: 使用 cheerio / rss-parser 等库进行真实解析
    // 这里只演示返回结构
    return [
      {
        title: 'Binance 将上线 MODX',
        url: 'https://www.binance.com/zh-CN/support/announcement/xxx',
        publishedAt: Date.now() - 3600 * 1000
      }
      // ...
    ];
  }

  /**
   * 从标题中粗略识别 上线 / 下架 关键词
   */
  classifyAnnouncement(title) {
    const listingKeywords = ['上线', '上架', '开启交易', 'Launches Trading', 'Listing'];
    const delistingKeywords = ['下架', '摘牌', '终止交易', 'Delist', 'Delisting'];

    const isListing = listingKeywords.some((k) => title.includes(k));
    const isDelisting = delistingKeywords.some((k) => title.includes(k));

    if (isListing && !isDelisting) return 'LISTING';
    if (isDelisting && !isListing) return 'DELISTING';
    return 'OTHER';
  }

  /**
   * 主流程：扫描各大交易所公告
   */
  async scan() {
    const now = Date.now();
    const threeDaysAgo = now - 3 * 24 * 3600 * 1000;
    const events = [];

    for (const ex of this.exchanges) {
      try {
        const items = await this.fetchAnnouncements(ex.announcementsRSS);

        for (const item of items) {
          if (item.publishedAt < threeDaysAgo) continue;

          const type = this.classifyAnnouncement(item.title);
          if (type === 'OTHER') continue;

          events.push({
            exchange: ex.name,
            type,
            title: item.title,
            url: item.url,
            publishedAt: item.publishedAt
          });
        }
      } catch (err) {
        console.error(\`❌ 获取 \${ex.name} 公告失败:\`, err.message);
      }
    }

    return events;
  }

  async run() {
    const events = await this.scan();

    console.log('📬 近 3 天内检测到的上/下架事件：');
    for (const e of events) {
      console.log(
        \`- [\${e.exchange}] (\${e.type}) \${e.title} | 发布于: \${new Date(
          e.publishedAt
        ).toISOString()}\`
      );
    }

    // 真实使用中，你可以把 events 存入数据库，交给后续策略模块打分
  }
}

// 使用示意：
// const watcher = new ListingDelistingWatcher();
// watcher.run().catch(console.error);
\`\`\`

---

## 📊 策略参数与风险管理

### 关键风控参数（示意）

\`\`\`javascript
const LISTING_DELISTING_RISK = {
  MAX_POSITION_PER_EVENT: 0.15,   // 单事件最大占用总资金 15%
  MAX_TOTAL_EVENT_EXPOSURE: 0.5,  // 所有事件合计不超过总资金 50%
  MAX_HOLDING_DAYS_LISTING: 5,    // 上线套利持仓最长 5 天
  MAX_HOLDING_DAYS_DELISTING: 180,// 下架抄底最长 180 天
  MIN_24H_VOLUME: 2_000_000,      // 24h 综合成交额 ≥ $2M
  MIN_EXCHANGE_TIER: 1,           // 只做一二线 CEX 的上线/下架
  TAKE_PROFIT_LEVELS: [0.3, 0.5], // 30%、50% 分批止盈
  STOP_LOSS_LISTING: -0.15,       // 上线策略最多回撤 15%
  STOP_LOSS_DELISTING: -0.25      // 下架抄底最多回撤 25%
};
\`\`\`

### 典型风险与应对

| 风险类型 | 描述 | 应对策略 |
|---------|------|----------|
| **项目质量风险** | 垃圾项目上线也可能拉不动 | 只选有产品/TVL/机构背书的项目，上线交易所必须是主流 |
| **流动性风险** | DEX/小所进得去出不来 | 控制单笔仓位，优先选择深度好、有做市商的盘子 |
| **公告误读风险** | 把技术性下架当利空，或反之 | 仔细阅读全文，看清是否因违规/诈骗等致命问题 |
| **行情共振风险** | 上线当天遇到全市场暴跌 | 提前设好止损/保护单，避免无脑死扛 |
| **执行力风险** | 没有分批卖出计划，临盘情绪化 | 事先写好价格&仓位计划，挂好限价单，尽量机制化 |

---

## 🎯 实战执行流程

### 1️⃣ 准备阶段（1-2 周）

- [ ] 搭建“公告雷达”：  
  - 订阅 Binance / OKX / Bybit / Gate / KuCoin 等公告 RSS/推特  
  - 选一个地方集中记录（Notion、表格、自己的系统）

- [ ] 制作 “事件表” 字段设计：  
  - 币种 / 合约地址 / 上线或下架交易所  
  - 公告时间 / 生效时间  
  - 当前价 / 流通市值 / FDV / 24h 成交额  
  - 你给出的 “质量评分、情绪评分”

- [ ] 选好自己的 CEX 与链上钱包：  
  - 至少 2 家主流 CEX（方便在不同所之间搬运）  
  - 1-2 条主力链上钱包（ETH、Sol 等）

### 2️⃣ 上线套利执行 Checklist

- [ ] 上线公告出来后：  
  - 确认是否有预热活动（交易赛、空投、充值返现）  
  - 观察链上 / 小所的价格区间与深度  
  - 初步评估一个你认为 “合理但不保守” 的估值区间

- [ ] 上线前 3-7 天：  
  - 用阶梯限价方式分 2-4 次建仓  
  - 控制总仓位不超过单事件资金上限  
  - 严格避免追高买入，只在合理区间下单

- [ ] 上线当天：  
  - 提前设定 2-3 个止盈档位（例如 +30%、+50%、+80%）  
  - 实际挂单价略低于心里价，保证容易成交  
  - 若行情极度超预期，可保留 10-20% 仓位试图吃“余波”

### 3️⃣ 下架抄底执行 Checklist

- [ ] 下架公告出来后：  
  - 通读公告文本，判断下架原因  
  - 若明显是欺诈/跑路/监管致命打击 → 直接 PASS  
  - 若是流动性/业务方向调整 → 可进入候选池

- [ ] 公告后 24-72 小时：  
  - 观察不同市场的价格反应  
  - 重点看：链上 DEX 与其他未下架 CEX 的价格  
  - 若存在大幅超跌（例如短期跌幅 > 50%，但项目客观上未死亡）  
    - 可以分 3-4 次挂单低吸  
    - 目标是中长期价差，而非短线拉升

- [ ] 持仓与退出：  
  - 设定最长持仓时间（如 6 个月）与目标收益率（如 +80%）  
  - 若项目后续有新的利空或开发停滞 → 考虑提前止损或减仓  
  - 期间可以通过 DeFi 或 CEX 的收益机会（质押、做市）提高资金利用率

---

## 🧩 典型配套玩法（给你做“组合策略”用）

- 与 **解锁对冲套利（30.2）** 搭配：  
  - 先用 30.1 做上线短期情绪与流动性  
  - 再用 30.2 做后面几个月的解锁对冲，吃更长周期的一段趋势
- 与 **稳定币理财/赚币策略** 搭配：  
  - 非事件时间，将闲置资金放在低风险 DeFi 或 CEX Earn 里  
  - 把“上线/下架”当成不那么频繁的“加菜机会”

---

## ✅ 小结

**上线与下架节奏套利** 的关键词只有三个：  
> 公告、节奏、纪律。

- 公告给你的是**时间点**，告诉你什么时候会发生什么事；  
- 节奏决定你是提前布局、按计划卖出，还是跟着别人情绪起舞；  
- 纪律确保你不会因为一两次超预期就忘掉止损与仓位控制。

当你把这套流程规范成自己的 SOP，并用一点点自动化工具（公告监控、候选打分表、挂单模板）做起来之后，它会变成你整个玩法系统里**相对稳定、可复制的一块“事件砖”**。
`
};

/**
 * 30.2 解锁对冲套利
 */
const STRATEGY_30_2 = {
  title: '解锁对冲套利 - 利用大额解锁做方向中性收益',
  slug: 'token-unlock-hedging-arbitrage',
  summary:
    '围绕代币的大额解锁/归属事件，通过合约做空或构建“现货+空合约”的对冲组合，捕捉解锁抛压带来的下跌收益，或者保护自己手上的筹码不被解锁砸穿。适合熟悉永续/期货、愿意做数据筛选和严格风控的玩家。',
  category: 'structural-event-arbitrage',
  category_l1: 'arbitrage',
  category_l2: 'structural-event-arbitrage',
  risk_level: 4,
  apy_min: 25,
  apy_max: 120,
  min_investment: 5000,
  time_commitment: '每周 4-8 小时',
  status: 'published',
  content: `# 解锁对冲套利 - 利用大额解锁做方向中性收益

## 💰 策略概览

| 参数 | 数值 |
|------|------|
| **起投资金** | $5,000 - $100,000 |
| **时间投入** | 每周 4-8 小时（研究 + 执行） |
| **预期年化收益** | 25-120%（事件多时更高） |
| **风险等级** | ⚠️⚠️⚠️⚠️ 中高 (4/5) |
| **难度等级** | 高级 |
| **适合人群** | 会用合约、不排斥做空、愿意看一点数据和白皮书的中高级玩家 |

---

## 📖 开场故事：一次“解锁做空”，13 天赚了 22,500 美金

2023 年熊市中后段，交易者 Lin 感受到市场整体已经没那么好做：

- Beta 机会少了  
- 大趋势多是震荡下跌  
- 单纯做多经常被各种“解锁砸盘”打脸

于是 Lin 决定反过来：  
> “既然解锁总是砸我，那我就提前到解锁那一头去站着。”

他开始系统性研究 **Token Unlock 日历**，特别关注：

- 解锁规模 / 当前流通市值 的比例  
- 解锁筹码对应的角色：私募、团队、顾问、生态基金  
- 之前几次解锁后价格的行为

某天，他盯上了 DeFi 项目 **$FLOWX** 的一次大解锁：

- 总量：1,000,000,000 枚  
- 当前流通：120,000,000 枚  
- 当前价格：0.95 USDT  
- 当前流通市值：\$114M  
- 即将解锁：200,000,000 枚（按照当前价，相当于 \$190M）  
- 解锁对象：私募 + 生态基金，早期成本极低

> 解锁后流通市值几乎会从 \$114M 拉到 \$300M，筹码直接翻了两倍多，压力极大。

Lin 的操作如下：

1. **解锁前 12 天**  
   - 价格在 0.93-0.98 区间震荡  
   - Lin 决定做“纯空事件”：  
     - 在主要合约交易所开出 **空单 150,000 枚 FLOWX**  
     - 不加杠杆，名义仓位约：\$142,500  
   - 同时在另一个交易所挂了少量多单，防止极端 squeezes

2. **解锁前 5 天**  
   - 市场开始消化“要解锁”的消息，价格小幅回落至 0.88  
   - Lin 没有提前平仓，只是把止损稍微下移（保护已有浮盈）

3. **解锁当天**  
   - 大量筹码到账，部分长期持有者开始分批抛售  
   - 叠加整体市场情绪偏弱，FLOWX 价格从 0.86 跌到 0.70

4. **解锁后第 2 天**  
   - Lin 选择在 0.75 附近分批平掉 80% 空单  
   - 又观察了两天，发现卖压逐渐减弱，在 0.73 继续平掉剩余空单

**这轮操作的结果：**

\`\`\`
平均开仓价：   0.95 USDT
平均平仓价：   0.75 USDT
价差：         0.20 USDT
名义仓位：     150,000 枚
毛利润：       $30,000
资金费率成本： ~ $1,500
滑点及手续费： ~ $6,000
净利润：       ~ $22,500

持仓时间：     约 13 天
单次收益率：   ~ 15.8%（以投入保证金 ~ $142,500 计）
\`\`\`

在整体市场不赚钱的环境里，Lin 通过**可预期的“抛压事件”**，在两周内拿到了一笔非常干净的事件收益。

---

## 🧠 为什么解锁可以做套利？

### 1. 解锁 = 潜在卖盘集中“解封”

代币发行通常会设计：

- 私募轮 / 战略投资人：锁仓 + 线性解锁  
- 团队 / 顾问：长锁 + Cliff 解锁  
- 生态基金：分批解锁

当某个时间点有 **大比例筹码同时解锁** 时：

- 这些持有人成本极低，有很强的变现冲动  
- 市场对“解锁=抛压”的预期往往会提前交易  
- 结果：**解锁前中段 & 解锁后短期内，价格下跌概率显著上升**

### 2. FDV 与流通结构失衡

很多 2021-2022 年上线的项目存在问题：

- FDV 被拉到极高（\$5B、\$10B）  
- 但真实流通市值只有几百上千万  
- 当解锁批次不断放出时，市场必须重新思考：

> “这东西真值这么多钱吗？”

当“解锁/流通”比例过高时，往往需要一个**价格向下修正**的过程来匹配新的筹码供给。

### 3. 信息高度透明，可提前布局、可对冲

- 解锁时间、数量、对象都能在各种 Unlock 日历站点查到  
- 你可以：
  - 纯做空合约，押注价格下跌  
  - 或者构建“现货 + 空合约”的 Delta 中性组合，只赚**波动 + 资金费率 + 对冲收益**  
- 相比那种完全不可预期的黑天鹅，这类事件**更适合被系统化、流程化地利用**。

---

## 🔍 两大核心子策略

### 模式 A：方向性解锁做空（Directional Short）

> 认为解锁后价格大概率明显下跌，直接做空合约，赚下跌收益。

**筛选条件（示意）：**

- 本次解锁市值 / 当前流通市值 ≥ 30%-50%  
- 当前 FDV 明显高于同赛道平均水平  
- 项目热度下行：  
  - 链上活跃下降  
  - TVL 下滑  
  - 社交媒体讨论度降低  
- 合约市场深度足够，支持较大名义仓位

**执行节奏：**

1. 解锁前 7-14 天：  
   - 观察价格结构，确认没有突然的大利好  
   - 分 2-3 次慢慢建立空单，避免一次性顶点开仓

2. 解锁前 1-3 天：  
   - 若价格已经提前跌很多，适当下调仓位/抬高止损  
   - 若价格还在高位横盘，可适度加一点仓

3. 解锁日 & 之后 3-5 天：  
   - 重点盯盘口：若出现明显连环大卖单 → 把浮盈锁定一部分  
   - 根据预设目标价（例如 -20%、-30%）分批平仓  
   - 不幻想绝对最低点

---

### 模式 B：Delta 中性解锁对冲（现货 + 空合约）

> 你本来就长期持有某个币，但又害怕解锁砸盘，于是用空单来对冲解锁期的价格风险。

**组合示例：**

- 你本来持有 40,000 枚 $TOKEN（计划长期拿）  
- 解锁前 10 天，你在合约平台做空 40,000 枚 $TOKEN  
- 解锁期间若价格从 1.2 跌到 0.9：

\`\`\`
现货浮亏：  40,000 * (0.9 - 1.2) = -$12,000
空单收益：  40,000 * (1.2 - 0.9) =  $12,000
合计：      基本对冲掉价格风险
\`\`\`

你可以：

- 在解锁后，分批平掉空单，保留现货  
- 或者直接在低位额外买入，把总持仓成本降低

> 这更像是“保险产品”：  
> 让你可以安心长期投资，而不用每次解锁都心惊胆战。

---

## 🛠️ 解锁事件扫描与打分脚本（示意）

下面是一个**简化的解锁扫描器**，用于：

- 抓取未来若干天的解锁列表  
- 根据“解锁/流通”和“流通/FDV”给一个粗评分  
- 生成候选事件清单，供你人工复核

\`\`\`javascript
class TokenUnlockScanner {
  constructor() {
    this.api = 'https://api.token.unlocks.example.com'; // 示例地址
  }

  /**
   * 拉取未来 N 天要解锁的事件
   */
  async fetchUpcomingUnlocks(days = 21) {
    const res = await axios.get(\`\${this.api}/upcoming?days=\${days}\`);
    return res.data.unlocks || [];
  }

  /**
   * 对单个解锁事件做“危害程度”打分
   */
  score(event) {
    const {
      symbol,
      unlock_usd,
      circulating_usd,
      fdv_usd,
      unlock_time,
      category
    } = event;

    const unlockToCirc = unlock_usd / (circulating_usd || 1);
    const circToFDV = circulating_usd / (fdv_usd || 1);

    let score = 0;

    // 解锁规模越大分越高
    if (unlockToCirc >= 0.3) score += 2;
    if (unlockToCirc >= 0.5) score += 2;
    if (unlockToCirc >= 1.0) score += 2;

    // 流通占 FDV 越低，说明更“虚高”
    if (circToFDV <= 0.2) score += 2;
    if (circToFDV <= 0.1) score += 1;

    // 不同类别（GameFi、L2、DeFi）可加权
    if (category === 'GameFi') score += 1; // GameFi 对解锁更敏感
    if (category === 'Memecoin') score += 1;

    return {
      symbol,
      unlockTime: unlock_time,
      unlockToCirc,
      circToFDV,
      score,
      category
    };
  }

  /**
   * 主流程
   */
  async run() {
    const raw = await this.fetchUpcomingUnlocks(30);

    const scored = raw
      .map((e) => this.score(e))
      .sort((a, b) => b.score - a.score);

    console.log('📅 未来 30 天高危解锁事件（按评分排序 Top 20）：');
    scored.slice(0, 20).forEach((ev) => {
      console.log(
        \`- \${ev.symbol} (\${ev.category}) | 解锁/流通: \${(
          ev.unlockToCirc * 100
        ).toFixed(1)}% | 流通/FDV: \${(ev.circToFDV * 100).toFixed(
          1
        )}% | 评分: \${ev.score} | 时间: \${new Date(ev.unlockTime).toISOString()}\`
      );
    });

    // 实际使用中，可以把 scored 写入数据库或发 Telegram Bot
    return scored;
  }
}

// 使用示意：
// const scanner = new TokenUnlockScanner();
// scanner.run().catch(console.error);
\`\`\`

---

## 📊 解锁对冲的风控参数

\`\`\`javascript
const UNLOCK_HEDGE_RISK = {
  MAX_GROSS_SHORT_RATIO: 0.6,     // 所有解锁事件的总空头名义仓位 ≤ 账户净值 60%
  MAX_SINGLE_EVENT_RATIO: 0.15,   // 单事件名义仓位 ≤ 账户净值 15%
  MIN_UNLOCK_TO_CIRC: 0.3,        // 解锁/流通比例 ≥ 30% 才考虑
  MIN_SCORE: 3,                   // 上面打分模型至少 3 分
  MAX_HOLDING_DAYS: 21,           // 单次事件最长持仓 21 天
  STOP_LOSS_RATIO: -0.15,         // 单事件最大亏损 -15%
  TAKE_PROFIT_LEVELS: [0.1, 0.2], // +10%、+20% 分批止盈
  MAX_LEVERAGE: 2,                // 不建议超过 2x 杠杆
  MAX_CONCURRENT_EVENTS: 5        // 同时参与的事件数量不超过 5 个
};
\`\`\`

### 风险类型 & 对策

| 风险 | 说明 | 缓解方式 |
|------|------|----------|
| **趋势反转** | 解锁被提前消化，反而利空出尽大涨 | 设置硬止损；不要在历史低位或超级空头情绪末端开空 |
| **资金费率** | 长时间持有空单需支付正资金费 | 控制持仓周期；优先选资金费率中性甚至偏负的平台 |
| **流动性** | 冷门币合约深度差，开平仓滑点很大 | 只做主流平台主流对；拆单执行，避免一笔砸深度 |
| **数据错误** | 解锁数据源错误/延迟，导致判断失误 | 多站点交叉验证；给自己留安全边际 |
| **平台风险** | 单一平台出问题（宕机、强制平仓、清退） | 分散在 2-3 家交易所；不用极限杠杆 |

---

## 🎯 实战执行流程

### 1️⃣ 准备阶段（1-3 周）

- [ ] 选好至少 2 家合约交易所（例如 Binance + OKX）  
- [ ] 开好账户、完成 KYC、熟悉保证金与资金费率规则  
- [ ] 订阅 1-2 个 Unlock 日历站点，并测试 API/导出功能  
- [ ] 在你的研究表中加上以下字段：  
  - 项目名 / Symbol  
  - 解锁时间 / 比例 / 对象  
  - 当前价 / 流通 / FDV  
  - 历史解锁次数 & 价格表现  
  - 你的主观“质量评分”

### 2️⃣ 事件筛选阶段

- [ ] 每周扫一遍未来 30-60 天的解锁列表  
- [ ] 按以下条件筛出候选：
  - 解锁/流通 ≥ 30%  
  - 流通/FDV ≤ 25%  
  - 项目已过最疯狂叙事期，热度走弱  
- [ ] 对每个候选写一句话结论：  
  - “这是一个我愿意空的币吗？为什么？”

### 3️⃣ 建仓与持仓

- [ ] 解锁前 7-14 天开始分批建仓：  
  - 第 1 批：总计划仓位的 30%  
  - 第 2 批：价格反弹或横盘时再加 30%  
  - 第 3 批：若解锁前仍维持在高位，可加到满仓（不超过风控上限）

- [ ] 持仓期间重点观察：
  - 整体市场方向：若全市场启动大级别牛市，要谨慎大规模做空  
  - 项目突然利好：合作、集成、大客户等 → 可减仓或退出  
  - 资金费率：若正资金费高企，要缩短持仓周期或减仓

### 4️⃣ 平仓与复盘

- [ ] 设置两个明确目标：
  - “最理想收益价位”（例如 -25%）  
  - “底线收益价位”（例如 -10%）

- [ ] 实际执行：
  - 价格到达底线收益价位，先平一半仓位  
  - 若后续继续按预期下跌，剩余仓位在理想价附近分批平掉  
  - 若价格反向突破止损价，坚定退出，不恋战

- [ ] 事后复盘：
  - 解锁前后 7-14 天的价格走势  
  - 你的进出点和理想进出点的偏差  
  - 解锁的真实卖压 vs 市场预期差异  
  - 根据数据调整之后的筛选模型与仓位模型

---

## 🧩 与其他策略的组合思路

- 与 **上线节奏套利（30.1）** 结合：  
  - 上线初期利用情绪波动做短线  
  - 上线后几个月用解锁策略持续“收割”结构性下跌
- 与 **稳定收益策略** 结合：  
  - 不做事件时，把资金放在稳定币理财/赚币策略上  
  - 把解锁对冲当成阶段性的“强化收益模块”

---

## ✅ 小结

**解锁对冲套利** 不是什么神秘的“机构玩法”，而是：

- 把公开透明的解锁时间表，当作一个个**预告好的“可能暴雷”的时间节点**；  
- 用合约工具把“可能砸你的锤子”，变成“替你赚钱的锤子”；  
- 通过筛选、对冲和严格风控，把情绪事件变成一种可复制的“机器化交易”。

它对普通玩家最友好的地方在于：

- 信息透明，真正愿意做的人并不多；  
- 可以根据自己的风险偏好，在“纯空”与“对冲”之间自由调节；  
- 只要你肯花一点时间把流程跑熟，它就是你组合里**中高阶但非常有存在感的一块砖**。

`
};

/**
 * 上传 30.1 和 30.2 策略到 Directus
 */
async function uploadStrategies() {
  const DIRECTUS_URL = 'http://localhost:8055';

  console.log('开始上传策略 30.1 和 30.2...\\n');

  try {
    // 获取新的管理员令牌
    const { execSync } = require('child_process');
    const tokenOutput = execSync('./get-new-directus-token.sh').toString();
    const tokenMatch = tokenOutput.match(/DIRECTUS_ADMIN_TOKEN=(.+)/);

    if (!tokenMatch) {
      throw new Error('Failed to get admin token');
    }

    const ADMIN_TOKEN = tokenMatch[1].trim();

    const headers = {
      Authorization: `Bearer ${ADMIN_TOKEN}`,
      'Content-Type': 'application/json'
    };

    // 上传策略 30.1
    console.log('上传策略 30.1: 上线与下架节奏套利...');
    await axios.post(`${DIRECTUS_URL}/items/strategies`, STRATEGY_30_1, {
      headers
    });
    console.log('✅ 策略 30.1 上传成功\\n');

    // 上传策略 30.2
    console.log('上传策略 30.2: 解锁对冲套利...');
    await axios.post(`${DIRECTUS_URL}/items/strategies`, STRATEGY_30_2, {
      headers
    });
    console.log('✅ 策略 30.2 上传成功\\n');

    // 验证总数
    const response = await axios.get(
      `${DIRECTUS_URL}/items/strategies?limit=1&meta=total_count`,
      { headers }
    );
    console.log(
      `✅ 数据库中现有策略总数: ${response.data.meta.total_count}`
    );
  } catch (error) {
    console.error('❌ 上传失败:', error.response?.data || error.message);
    process.exit(1);
  }
}

uploadStrategies();
