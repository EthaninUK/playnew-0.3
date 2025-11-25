// 策略 35.1 & 35.2 & 35.3: 事件驱动 (event-driven-strategies)

const axios = require('axios');

/**
 * 35.1 代币解锁前做空
 * 在大额代币解锁前（如 VC 解锁）提前做空，赚取解锁抛压导致的下跌。
 */
const STRATEGY_35_1 = {
  title: '代币解锁前做空 - 利用“筹码解禁抛压”做事件驱动空头',
  slug: 'pre-token-unlock-shorting',
  summary:
    '围绕代币解锁事件（VC/团队/早期私募轮等），融合“筹码结构 + 解锁节奏 + 市场流动性”三大维度，在大型解锁前后寻找做空或对冲机会。核心不是盲目看空，而是在发现：1）短期供应大幅增加；2）当前价格已包含过度乐观预期；3）流动性不足以承接抛压时，才通过合约做空、买入看跌期权、做解锁前后价差。重点是信息前置、仓位控制与流动性风险评估。',
  category: 'event-driven',
  category_l1: 'derivatives',
  category_l2: 'event-driven',
  risk_level: 4,
  apy_min: 20,
  apy_max: 200,
  min_investment: 2000,
  time_commitment: '每周 4-10 小时（跟踪解锁日历、研究项目、盯盘执行）',
  status: 'published',
  content: `# 代币解锁前做空 - 利用“筹码解禁抛压”做事件驱动空头

## 💰 策略概览

| 参数 | 数值 |
|------|------|
| **适用标的** | 有明确解锁日程的代币：VC/团队/私募轮有锁仓的项目 |
| **起始资金** | $2,000 - $50,000（合约保证金或现货+对冲仓位） |
| **时间投入** | 每周 4-10 小时：解锁日历跟踪、阅读公告、执行与复盘 |
| **预期收益** | 单次事件 10-50% 区间，极端行情可达数倍收益，但不可当常态 |
| **风险等级** | ⚠️⚠️⚠️⚠️ 较高 (4/5) |
| **难度等级** | 中高级（需要理解代币经济学、合约和流动性） |
| **适合人群** | 愿意做功课、能承受波动、对项目研究不排斥的主动型玩家 |

---

## 📖 开场故事：一条“全是 VC 解锁”的时间线

Jade 在牛市中经常遇到一种情况：

- 某个新公链/热点板块项目，  
  - 上线初期流通盘很小，价格被情绪推得很高；  
  - 代币线性/分期解锁计划里写明：3 个月后开始大额解锁 VC/团队筹码；  
- 解锁日期临近时，社区开始担心：  
  - “解锁是不是要砸盘？”  
  - “VC 会不会趁机出货？”

她做了一件大部分人懒得做的事情：

1. 把几个热门项目的 **解锁日历** 做成一个表；  
2. 研究每个项目的：
   - 总供应、当前流通、解锁比例、持仓结构；  
3. 对比当前价格与上一次解锁前后的走势。

她发现一个有意思的模式：

- 对于一部分“早已被市场充分讨论的解锁”，  
  - 价格在解锁前几周就开始下跌或横盘，  
  - 解锁当天反而“利空出尽”不再跌太多。  

- 但对于另一部分“大家只看热度、不看筹码”的项目：  
  - 解锁前价格疯狂拉高，  
  - 流动性并没有明显提升，  
  - 解锁当天或之后几天，价格出现 **短时间内的陡峭回调**。  

于是她开始系统性地：

> 只做那些 “解锁规模巨大 + 流通盘本身就紧 + 情绪明显过热” 的项目空头，  
> 用合约或期权在 **解锁前后几天** 建立空仓或保护性看跌仓位。

一段时间后，她发现：

- 不是每一次都成功，有时项目基本面极强，资金提前抵消了抛压；  
- 但在遵守严格仓位与风控前提下，  
  - 她的这条“解锁事件线”成为账户中一个高 Sharpe 的 alpha 源。  

---

## 🧠 核心逻辑：从“解锁规模”到“下跌概率”

### 1. 解锁带来的变化是什么？

**解锁 = 供应侧冲击**，但它是否转化为价格下跌，取决于：

1. **解锁规模占流通盘的比例**  
   - 若当前流通 1 亿枚，这次解锁 3,000 万枚（+30% 供应）；  
   - 若解锁主要是 VC/团队筹码，理论上套现意愿较高。

2. **解锁筹码的持有人类型**  
   - 早期私募机构：  
     - 有投资回报压力，尤其是多轮项目；  
   - 团队/顾问：  
     - 部分会长期持有，但也不排除部分套现；  
   - 社区/空投：  
     - 行为更分散，难度更高。

3. **解锁前的价格与情绪**  
   - 若价格已在过去 1-3 个月上涨数倍，  
   - 且社群情绪 FOMO、不怎么讨论解锁风险，  
   - 解锁抛压更容易在“毫无准备”的流动性中引发大幅波动。  

---

### 2. 一个简易“解锁风险评分”模型

你可以给每一个解锁事件打分，形成一个量化的直觉：

\`\`\`text
总分 = A(规模评分) + B(持仓结构评分) + C(情绪评分) + D(流动性评分)
\`\`\`

示例评分方式（仅做示意）：

- **规模评分 A（0-4 分）**
  - 解锁规模 < 流通盘 10%：0 分  
  - 10-20%：1 分  
  - 20-40%：2 分  
  - 40-80%：3 分  
  - >80%：4 分  

- **持仓结构评分 B（0-3 分）**
  - 解锁以团队/顾问为主，且长期锁定机制清晰：1 分  
  - 解锁以 VC/私募为主，历史有减持记录：2 分  
  - 解锁方集中度高（几家大机构集中持有）：+1 分  

- **情绪评分 C（0-3 分）**
  - 解锁前一个月价格平稳或下跌：0 分  
  - 解锁前一个月上涨 50-100%：1 分  
  - 上涨 100-300%：2 分  
  - 上涨 300%+ 且社群高度 FOMO：3 分  

- **流动性评分 D（0-3 分）**
  - 日均成交额/解锁市值 > 1：0 分（流动性比较充足）  
  - 在 0.3-1 之间：1 分  
  - 在 0.1-0.3 之间：2 分  
  - < 0.1：3 分（真空流动性，极易踩踏）

> 当总分 ≥ 7-8 分时，你可以考虑把它列入“重点做空/对冲候选名单”，  
> 但前提依然是 **控制仓位 + 明确止损**。

---

## 🧩 子策略拆分：三种解锁做空打法

### 模式 A：合约直接做空（短期冲击交易）

> 利用永续合约/季度合约，在解锁前后 3-7 天做事件空头。

- 适用条件：
  - 标的在主流交易所有足够合约流动性；  
  - 你对项目有基本了解，能接受短期剧烈波动；  
  - 能严格执行止损与仓位控制。  

- 操作步骤示意：

1. 提前 2-4 周开始关注该项目：  
   - 收集代币经济学文件、官网/白皮书、token unlock 出具的解锁日历等；  
   - 记录主要解锁日期与解锁规模。  

2. 在解锁前 3-7 天，若价格仍处于过热区间：
   - 分批建立小仓位空单（例如总计划仓位的 30-50%）；  
   - 解锁前一天视情况加仓或减仓。  

3. 解锁当天和次日：
   - 根据价格走势决定是否继续持有或部分平仓；  
   - 若价格提前大幅下跌，考虑部分获利了结。  

4. 无论结果如何：
   - 解锁后最多再持有 3-5 天，  
   - 防止市场情绪逆转导致急拉空头踩踏。

---

### 模式 B：买入看跌期权（有限风险博弈）

> 用看跌期权或看跌价差，在“下跌概率与幅度都提升”的时点，  
> 以有限成本博弈潜在的较大跌幅。

- 优点：
  - 最大亏损=权利金，风险天然有限；  
  - 解锁期间若出现暴跌，杠杆效应显著。  

- 缺点：
  - 需要有成熟的期权市场与足够流动性；  
  - 在隐含波动率高企时，权利金可能非常贵。  

- 操作示例（简化）：

  1. 解锁前 5-10 天，观察期权市场的隐含波动率；  
  2. 若 IV 尚未过度飙升，可以考虑：
     - 买入平值或略虚值看跌期权；  
     - 或构建看跌价差（Put Spread）控制成本；  
  3. 解锁后若价格如期下跌：
     - 分批卖出期权获利；  
  4. 若解锁后未出现显著下跌：
     - 不追加无谓仓位，权利金作为“事件保险费”认亏。

---

### 模式 C：持有现货 + 解锁前后的保护性空头

> 对已经持有某项目现货的玩家，通过解锁事件建立保护性对冲。

- 操作思路：

  - 在解锁前几天：
    - 用合约做一定比例空头对冲（如 30-70% 的 delta）；  
    - 或买入少量看跌期权作为保险。  

  - 若解锁后价格大跌：
    - 空头或期权盈利部分抵消现货浮亏；  

  - 若解锁后价格坚挺甚至上涨：
    - 对冲部分亏损当作防守成本，继续持有现货。

---

## 🛠️ 解锁事件扫描脚本框架示例

\`\`\`javascript
class TokenUnlockScanner {
  constructor(config = {}) {
    this.minScore = config.minScore || 7; // 事件评分达到多少才进入候选
  }

  /**
   * 从你维护的解锁日历中读取数据
   * 每条数据结构示例：
   * {
   *   symbol: 'XYZ',
   *   date: '2025-12-01',
   *   unlockAmount: 30000000,
   *   circulatingSupply: 100000000,
   *   type: 'VC/Team',
   *   price30dAgo: 1.2,
   *   currentPrice: 3.6,
   *   avgDailyVolume: 5000000
   * }
   */
  async fetchUnlockSchedule() {
    // TODO: 替换为真实数据源（数据库/API）
    return [];
  }

  calcScore(event) {
    const {
      unlockAmount,
      circulatingSupply,
      type,
      price30dAgo,
      currentPrice,
      avgDailyVolume
    } = event;

    const ratio = unlockAmount / (circulatingSupply || 1);
    const priceChange =
      (currentPrice - price30dAgo) / (price30dAgo || 1);

    // 规模评分 A
    let A = 0;
    if (ratio >= 0.1 && ratio < 0.2) A = 1;
    else if (ratio >= 0.2 && ratio < 0.4) A = 2;
    else if (ratio >= 0.4 && ratio < 0.8) A = 3;
    else if (ratio >= 0.8) A = 4;

    // 持仓结构评分 B
    let B = 0;
    if (/VC|Private/i.test(type)) B += 2;
    if (/Team|Advisor/i.test(type)) B += 1;

    // 情绪评分 C（基于 30 天涨幅）
    let C = 0;
    if (priceChange >= 0.5 && priceChange < 1.0) C = 1;
    else if (priceChange >= 1.0 && priceChange < 3.0) C = 2;
    else if (priceChange >= 3.0) C = 3;

    // 流动性评分 D
    const unlockValue = unlockAmount * currentPrice;
    const liqRatio =
      avgDailyVolume / (unlockValue || 1);
    let D = 0;
    if (liqRatio < 0.1) D = 3;
    else if (liqRatio >= 0.1 && liqRatio < 0.3) D = 2;
    else if (liqRatio >= 0.3 && liqRatio < 1.0) D = 1;

    const totalScore = A + B + C + D;
    return { A, B, C, D, totalScore };
  }

  async findCandidates() {
    const list = await this.fetchUnlockSchedule();
    const today = new Date();

    const candidates = list
      .map((ev) => {
        const score = this.calcScore(ev);
        const daysToUnlock =
          (new Date(ev.date).getTime() - today.getTime()) /
          (24 * 3600 * 1000);
        return {
          ...ev,
          ...score,
          daysToUnlock
        };
      })
      .filter(
        (ev) =>
          ev.totalScore >= this.minScore &&
          ev.daysToUnlock >= -1 &&
          ev.daysToUnlock <= 14 // 关注 [-1, +14] 天区间的事件
      )
      .sort((a, b) => a.daysToUnlock - b.daysToUnlock);

    console.log('📊 代币解锁做空候选列表：');
    candidates.forEach((c) => {
      console.log(
        \`- \${c.symbol} | 解锁日: \${c.date} | 距今天数: \${c.daysToUnlock.toFixed(
          1
        )} | 解锁/流通: \${(c.unlockAmount / c.circulatingSupply * 100).toFixed(
          2
        )}% | 总分: \${c.totalScore}\`
      );
    });

    return candidates;
  }
}
\`\`\`

---

## 📊 风控与仓位管理建议

\`\`\`javascript
const TOKEN_UNLOCK_SHORT_RISK = {
  MAX_EVENT_EXPOSURE_RATIO: 0.05,   // 单个解锁事件的最大风险敞口不超过净资产 5%
  MAX_TOTAL_UNLOCK_BOOK: 0.2,       // 所有解锁做空事件合计不超过净资产 20%
  MAX_LEVERAGE: 3,                  // 永续合约整体杠杆不超过 3 倍
  HARD_STOP_LOSS: 0.15,             // 单笔解锁做空最大亏损 15% 必须强制止损
  TAKE_PROFIT_ZONES: [0.1, 0.2, 0.3] // 分别在 10%、20%、30% 浮盈处分批止盈
};
\`\`\`

---

## 🎯 实战 Checklist

- [ ] 建立个人“解锁日历”数据库，并每周更新  
- [ ] 为每一个潜在事件打“解锁风险评分”  
- [ ] 只对总分 ≥ 7-8 分的事件考虑把它列入候选  
- [ ] 严格控制单事件与总仓位，不做 All-in 式事件赌徒  
- [ ] 解锁后 3-5 天无论盈亏，都明确是否退出，不无限拖延  

---

## ✅ 小结

**代币解锁前做空，不是对抗项目方本身，而是对抗“短期供需错配”。**

- 当大规模筹码要涌入一个本就脆弱的流动性池时，  
  - 价格往往会通过快速杀跌来“重新找到平衡”；  
- 只要你把握好：
  - 信息前置  
  - 仓位节奏  
  - 止盈/止损规则  
- 解锁事件就可以成为你事件驱动策略库中的一条重要战线。`
};

/**
 * 35.2 交易所上币事件
 * 在新币上线 Binance/Coinbase 前买入，利用上线后的拉盘效应获利。
 */
const STRATEGY_35_2 = {
  title: '交易所上币事件 - 抢在“重大上所公告”前后吃一口流动性溢价',
  slug: 'exchange-listing-event-trade',
  summary:
    '围绕“主流交易所上币事件”（Binance/Coinbase/OKX 等），在项目从二线平台/DEX 向一线 CEX 迁移时，利用：1）新增用户与资金流入；2）做市商上岗前后流动性改善；3）市场情绪 FOMO 的阶段性放大，进行短周期波段交易。关键是区分：已被预期许久的“迟到 listing”与真正改变游戏规则的“惊喜 listing”，以及严格控制消息真假与流动性风险。',
  category: 'event-driven',
  category_l1: 'derivatives',
  category_l2: 'event-driven',
  risk_level: 4,
  apy_min: 15,
  apy_max: 150,
  min_investment: 1000,
  time_commitment: '每周 3-8 小时（追踪公告、盘口与情绪）',
  status: 'published',
  content: `# 交易所上币事件 - 抢在“重大上所公告”前后吃一口流动性溢价

## 💰 策略概览

| 参数 | 数值 |
|------|------|
| **适用标的** | 有潜力登陆主流 CEX 且已有一定用户基础的项目 |
| **起始资金** | $1,000 - $30,000（现货为主，短线合约为辅） |
| **时间投入** | 每周 3-8 小时：跟踪新闻、公告、盘口与社区情绪 |
| **预期收益** | 单次事件 10-60% 波段，极端行情可更高，但高波动也带来高回撤风险 |
| **风险等级** | ⚠️⚠️⚠️⚠️ 较高 (4/5) |
| **难度等级** | 中级（信息跟踪 + 节奏执行） |

---

## 📖 开场故事：“Binance 上线公告”的三种不同结局

Ken 做上币事件交易经历过三种典型情况：

1. **真正的惊喜 Listing**  
   - 项目一直只在少数 DEX 和二线所交易，  
   - 社区对“会不会上 Binance”有所期待，但没有确凿信号；  
   - 某天突然官宣：Binance 将上线并开启 Launchpool/Launchpad 等；  
   - 公告后，价格在短时间内拉升 50-200%。  

2. **早已被预期的迟到 Listing**  
   - 项目已经上线大部分主流 CEX，  
   - 只差 Binance/Coinbase 这一家；  
   - 大家早就当成“必然事件”，链上/场外早已 price in；  
   - 真正公告当天，价格仅短暂冲高随即回落，  
   - 甚至出现“利好兑现下跌”。  

3. **假消息/过度解读导致的踩踏**  
   - 某小号或假账号发出“疑似上币”传闻；  
   - 社区 FOMO 抢筹，价格瞬间冲高；  
   - 最终平台否认或长时间没有后续，  
   - 价格在几天内跌回起点甚至更低。

经历这三种情况后，Ken 意识到：

> “交易所上币事件”  
> 不是简单的“看见公告就梭哈”，  
> 而是 **信息、情绪和流动性** 的三重博弈。

---

## 🧠 核心逻辑：上币事件带来什么？

1. **新增流动性与深度**  
   - 大所通常有更强的做市资源和更广泛的用户基础；  
   - 上币后买卖深度提升，滑点变小，更多资金愿意进场。  

2. **新增用户与关注度**  
   - 尤其是首次登陆大型 CEX 时，  
   - 会有大量“原本没有链上操作能力或者不玩小所”的用户进入。  

3. **叙事升级**  
   - 从“小众链上项目”升级为“主流所认可资产”；  
   - 对部分机构或保守资金来说，只有登陆大所后才在其投资清单中。  

4. **短期价格波动加剧**  
   - 上线首日可能出现剧烈波动：  
     - 开盘瞬间冲高 → 快速回调；  
     - 或者先杀一波早期卖压，再拉升。  

---

## 🧩 子策略拆分：三种上币交易打法

### 模式 A：公告一刻前后的“反应速度”交易

> 适合已经盯紧项目、信息源够快的玩家。  
> 一旦官宣上所，用极快速度在原有交易场所建仓或加仓。

- 适用条件：
  - 你可以第一时间看到 **官方** 账号的公告（而不是转述）；  
  - 项目此前并未广泛被认为“必然上所”；  
  - 该大所的影响力足够大。  

- 操作步骤简化：

  1. 提前建“关注列表”：  
     - 列出一批有希望上大所的项目；  
     - 关注其官推/Discord/Telegram/官网公告。  

  2. 一旦看到上币公告：  
     - 立即在原来挂单较深的市场（大多在 DEX 或已有的 CEX）买入；  
     - 控制仓位，以防消息理解错误。  

  3. 一般持有时间：
     - 从公告发布到目标 CEX 上线后 1-3 天；  
     - 根据拉升幅度分批止盈。  

---

### 模式 B：传闻期的“预期布局 + 公告兑现减仓”

> 在上币传闻逐步升温阶段提前布局，  
> 真正公告或上线当天 **卖给后来的情绪资金**。

- 适用条件：
  - 你有足够的耐心，在传闻期逐步小仓位布局；  
  - 能接受“预期落空”的风险（项目长期看至少不算完全垃圾）。  

- 操作思路：

  1. 观察一段时间：  
     - 项目方与大所之间是否有合作迹象（活动、联名、技术集成等）；  
     - 社区是否频繁出现“什么时候上 X 所”的讨论。  

  2. 若你认为上币概率较高：  
     - 分批在相对平稳阶段买入项目现货；  
     - 仓位总规模控制在净资产的 5-10% 内。  

  3. 当真正官宣上币：  
     - 利用公告后的拉升，分批减仓甚至清仓；  
     - 不恋战，不猜测“还能再涨多少”。  

---

### 模式 C：上线当天盘口结构 + 短线博弈

> 在目标 CEX 上线当天，根据盘口、成交量和趋势  
> 做短线多空博弈（更偏日内/高频玩法）。

- 典型场景：

  - 上线开盘价明显高于场外/链上价格：  
    - 可能出现套利空间（CEX 上卖出、DEX/旧所买回）。  

  - 上线后几分钟内冲高过快：  
    - 可能形成“过度抢筹” → 回调机会。  

  - 上线后一段时间出现标准洗盘结构：  
    - 先快速杀一波，洗出浮筹后才开始真正上涨。  

- 风险提示：

  - 上线当天通常波动极大，  
  - 若没有足够的盘口经验和风控能力，  
  - 更建议把该日视为**观察日而非重仓日**。

---

## 🛠️ 上币事件跟踪与筛选脚本框架

\`\`\`javascript
class ListingEventTracker {
  constructor(config = {}) {
    this.minImpactScore = config.minImpactScore || 6;
  }

  /**
   * 获取候选项目清单
   * 示例结构：
   * {
   *   symbol: 'ABC',
   *   currentExchanges: ['DEX', 'CEX_B'],
   *   rumoredListing: ['BINANCE'],
   *   mcap: 200000000,
   *   fdv: 800000000,
   *   onchainHolders: 45000,
   *   dailyVolume: 15000000,
   *   sentimentScore: 0.7, // 0-1
   *   hasOfficialHint: true
   * }
   */
  async fetchCandidateProjects() {
    // TODO: 接入你自己的数据源（爬虫、手工维护表等）
    return [];
  }

  calcImpactScore(project) {
    let score = 0;

    // 1. 目标交易所影响力
    if (
      project.rumoredListing &&
      project.rumoredListing.some((ex) =>
        /BINANCE|COINBASE|OKX|BYBIT/i.test(ex)
      )
    ) {
      score += 3;
    }

    // 2. 当前上所情况（从小所/DEX 迁移到大所更有空间）
    if (
      project.currentExchanges &&
      project.currentExchanges.length <= 2
    ) {
      score += 2;
    } else if (project.currentExchanges.length <= 4) {
      score += 1;
    }

    // 3. 市值 & 活跃度（太小则流动性不足，太大则弹性有限）
    if (project.mcap > 50000000 && project.mcap < 1000000000) {
      score += 2;
    }

    // 4. 情绪/社群热度
    if (project.sentimentScore > 0.7) score += 1;
    if (project.sentimentScore > 0.85) score += 2;

    // 5. 项目方是否有“官方暗示”
    if (project.hasOfficialHint) score += 1;

    return score;
  }

  async filterHighImpactEvents() {
    const list = await this.fetchCandidateProjects();
    const result = [];

    for (const p of list) {
      const impactScore = this.calcImpactScore(p);
      if (impactScore >= this.minImpactScore) {
        result.push({ ...p, impactScore });
      }
    }

    result.sort((a, b) => b.impactScore - a.impactScore);

    console.log('📊 潜在高影响上币事件候选：');
    result.forEach((p) => {
      console.log(
        \`- \${p.symbol} | 目标所: \${p.rumoredListing.join(
          '/'
        )} | 当前所数: \${p.currentExchanges.length} | 市值: \${(
          p.mcap / 1e6
        ).toFixed(1)}M | 影响分: \${p.impactScore}\`
      );
    });

    return result;
  }
}
\`\`\`

---

## 📊 风控与仓位建议

\`\`\`javascript
const LISTING_EVENT_RISK = {
  MAX_SINGLE_EVENT_RATIO: 0.05,    // 单个上币事件最大投入不超过净资产 5%
  MAX_TOTAL_EVENT_BOOK: 0.15,      // 所有上币事件合计不超过净资产 15%
  PRE_ANNOUNCE_POSITION_RATIO: 0.6, // 预期布局阶段最多使用计划仓位的 60%
  POST_ANNOUNCE_ADD_RATIO: 0.4,     // 官宣后最多再加 40%，避免追高
  HARD_STOP_LOSS: 0.15,            // 单次事件最大亏损 15% 止损
  TAKE_PROFIT_AT: [0.2, 0.4, 0.6]  // 20/40/60% 分批止盈
};
\`\`\`

---

## 🎯 实战 Checklist

- [ ] 建立一份“潜在上币项目列表”，包含当前上所情况与市值信息  
- [ ] 订阅主流 CEX 的上币公告频道与项目方官方社媒  
- [ ] 预先定义“惊喜 listing vs 预期 listing”的判断标准  
- [ ] 只在真正有信息优势/理解优势时参与，不追随纯情绪 FOMO  
- [ ] 上线当天，更多以观察和复盘为主，谨慎做高杠杆短线  

---

## ✅ 小结

**上币事件的可交易性，来自于：  
“新的资金与关注涌入” 与 “老玩家的预期差” 的交汇。**

- 若你只是跟着别人喊“要上所了”而冲进场，  
  - 多半成为别人出货的流动性；  
- 若你有系统性的项目池、信息源与执行纪律，  
  - 上币事件可以成为你的事件驱动策略中，  
  - 一条既有想象力又可控风险的玩法线。`
};

/**
 * 35.3 美联储议息会议交易
 * 在美联储 FOMC 会议前建仓，根据利率决议快速平仓获利（高波动）。
 */
const STRATEGY_35_3 = {
  title: '美联储议息会议交易 - 在“宏观节点”上做一次高波动博弈',
  slug: 'fomc-meeting-volatility-trade',
  summary:
    '围绕美联储 FOMC 议息会议（加息/降息/按兵不动），在决议与新闻发布会前后构建短周期交易：包括股指/债券/美元指数/黄金/比特币等多资产的波动率放大效应。核心不在于精准预测结果，而在于：1）识别“市场共识”与“实际结果”的偏差；2）利用预期与现实的错位，采用方向性或波动率策略（如跨式、日内反应交易）。风险极高，需要严格仓位与时间控制。',
  category: 'event-driven',
  category_l1: 'derivatives',
  category_l2: 'event-driven',
  risk_level: 5,
  apy_min: 20,
  apy_max: 300,
  min_investment: 2000,
  time_commitment: '每月 3-6 小时（会前准备 + 会后执行与复盘）',
  status: 'published',
  content: `# 美联储议息会议交易 - 在“宏观节点”上做一次高波动博弈

## 💰 策略概览

| 参数 | 数值 |
|------|------|
| **适用标的** | 美股指数（标普/纳指）、国债收益率期货、美元指数、黄金、比特币等 |
| **起始资金** | $2,000 - $50,000（杠杆需严控） |
| **时间投入** | 每次会议前后共 3-6 小时：阅读预期、布仓和复盘 |
| **预期收益** | 单次事件可实现 5-30% 的帐户波动，极端情况下收益或亏损更高 |
| **风险等级** | ⚠️⚠️⚠️⚠️⚠️ 极高 (5/5) |
| **难度等级** | 中高级（需要基础宏观常识与盘面经验） |

---

## 📖 开场故事：同一场 FOMC，有人爆仓，有人只是“吃了一段波动”

每次 FOMC 议息会议，  
市场都会上演同一个戏码：

- 决议公布前 1 小时：  
  - 波动收窄，大家观望；  
- 决议公布那一刻：  
  - K 线在 1 分钟里可以走出一天的振幅；  
- 新闻发布会 30-60 分钟：  
  - 主席的每一个词都可能引发多次“二次波动”。

Leo 和 Max 都喜欢在 FOMC 做交易，但方式完全不同：

- **Max 的玩法：预测帝**  
  - 会前憋一个观点：一定会加息/降息/转向；  
  - 在会前一天就大仓位 All-in 一个方向；  
  - 一旦结果不符合他预期，或者解读偏差，  
    - 不是爆仓就是巨大回撤。  

- **Leo 的玩法：预期差交易者**  
  - 先研究市场共识（利率期货隐含概率、主流投行观点）；  
  - 会前一两小时，避免大赌方向；  
  - 决议公布前后短时间内，  
    - 看的是“市场第一反应 vs 他心中的合理反应”；  
  - 通过小仓位、短周期的多空操作和波动率策略，  
    - 只想“吃一段波动”，而不是赌整个宏观周期。

长期下来：

- Max 的账户曲线极其陡峭：要么大赚要么大亏；  
- Leo 虽然每次只赚市场波动的一部分，  
  - 但在风险可控的前提下，  
  - FOMC 事件成为他高夏普率的波段来源之一。

---

## 🧠 核心逻辑：从“结果本身”到“预期 vs 结果”

FOMC 会议可交易的不是“加息/降息本身”，  
而是 **“市场预期” 与 “实际结果 + 表态” 的差异**。

### 三层结构

1. **市场共识**  
   - 利率期货隐含的加息/降息概率；  
   - 主流投行/机构给出的预期区间；  
   - 利率点阵图的前一版指引。  

2. **决议本身**  
   - 实际是否加息/降息/按兵不动；  
   - 点阵图更新（未来路径有无明显变 hawkish/dovish）。  

3. **新闻发布会措辞**  
   - 对通胀、就业、经济增长、金融稳定的描述；  
   - 对未来加息/降息节奏的暗示；  
   - 与市场此前 narrative 的契合/冲突程度。

> FOMC 交易的核心问题是：  
> “结果 + 口径 是否 **比预期更鹰派/更鸽派**？”

---

## 🧩 子策略拆分：三种常见 FOMC 交易思路

### 模式 A：会前不押方向，只做“会后波动率”

> 适合不想猜方向，只想吃“会议带来的大波动”的玩家。

- 工具：  
  - 股指/外汇/黄金/比特币的期权；  
  - 大会前买入短期期权跨式/宽跨；  
  - 或通过合成结构实现波动率多头。  

- 操作思路：

  1. 会前 1-3 天，观察相关标的的隐含波动率：  
     - 若本次 FOMC 被市场认为“极度关键”，IV 通常抬升；  
     - 若 IV 已经极高，需谨慎权利金成本。  

  2. 若隐含波动率合理：
     - 可以买入短期跨式（Straddle）：  
       - 同一到期日买入 Call + Put；  
     - 或略微 OTM 的宽跨（Strangle）来压缩成本。  

  3. 会后若实际波动超出权利金体现的预期：
     - 在波动放大阶段分批卖出期权获利；  
  4. 若会后走势“比预期平静”：
     - IV 快速回落，跨式可能亏损，  
     - 这就是“赌波动”的代价。

---

### 模式 B：会前轻仓押方向，会后顺势加仓/反手

> 适合对宏观和市场情绪有一定理解，希望“方向+波动”双向获利。

- 步骤示例：

  1. 会前一周：
     - 形成自己对本次 FOMC 的看法：  
       - 是否大概率符合市场共识，  
       - 或是否存在“意外转向”的可能性。  

  2. 会前 1-2 天：
     - 建立小仓位方向性仓（如股指期货/比特币多空）；  
     - 仓位控制在计划上限的 30-50%。  

  3. 决议公布后：
     - 观察市场第一反应：  
       - 若与预期一致且走势清晰，  
         - 可顺势加仓至计划上限；  
       - 若与预期严重不符，  
         - 先快速减仓甚至平仓，等待反馈后再决策。  

  4. 新闻发布会期间：
     - 不做频繁交易，避免被“语言噪音”干扰；  
     - 只在出现明显的趋势确认与量能配合时，  
       - 做小幅加减仓。

---

### 模式 C：多资产联动的“相对强弱”交易

> 在美股、美元、黄金、比特币之间，  
> 观察谁对 FOMC 反应最强烈、最偏离基本预期，  
> 做相对强弱对冲。

- 示例逻辑（仅作为思路）：  

  - 若结果偏鸽派（比预期更宽松）：  
    - 股指 & 黄金 & 比特币可能同时走强，  
    - 美元指数走弱；  

  - 若结果偏鹰派（比预期更紧）：  
    - 股指 & 比特币承压，  
    - 美元和短端收益率上升。  

- 你可以尝试的小型结构：  

  - 做多“受益资产”，做空“受伤资产”，  
  - 比如：多黄金、空美元指数；  
  - 或多比特币、空部分股票指数（视实际关联度与自身偏好）。  

---

## 🛠️ FOMC 会议日历与预期差脚本框架

\`\`\`javascript
class FomcEventEngine {
  constructor(config = {}) {
    this.events = config.events || [];
  }

  /**
   * 示例 FOMC 事件结构：
   * {
   *   date: '2025-03-19',
   *   marketConsensus: 'pause', // 'hike' | 'cut' | 'pause'
   *   hikeProb: 0.2,            // 利率期货隐含概率
   *   cutProb: 0.1,
   *   pauseProb: 0.7,
   *   narrative: 'higher-for-longer'
   * }
   */

  addEvent(ev) {
    this.events.push(ev);
  }

  listUpcoming(days = 30) {
    const today = new Date();
    return this.events.filter((ev) => {
      const d = new Date(ev.date);
      const diff =
        (d.getTime() - today.getTime()) / (24 * 3600 * 1000);
      return diff >= 0 && diff <= days;
    });
  }

  /**
   * 根据市场概率，给出一个“预期集中度”评价
   * - 若某一方向概率极高（>80%），则市场共识非常统一
   * - 若概率分散，则预期不确定，容易带来大波动
   */
  calcConsensusFocus(ev) {
    const probs = [ev.hikeProb, ev.cutProb, ev.pauseProb];
    const maxProb = Math.max(...probs);
    if (maxProb > 0.8) return 'high_consensus';
    if (maxProb > 0.6) return 'medium_consensus';
    return 'low_consensus';
  }

  /**
   * 给交易者的简单提示
   */
  getTradeHints(ev) {
    const focus = this.calcConsensusFocus(ev);
    const hints = [];

    if (focus === 'high_consensus') {
      hints.push(
        '市场对本次决议预期高度一致，一旦结果与共识不符，资产会出现较大“意外波动”。'
      );
      hints.push(
        '方向性大赌风险极高，可以考虑小仓位押“反共识”或者专注会后波动率交易。'
      );
    } else if (focus === 'medium_consensus') {
      hints.push(
        '市场有一定共识，但仍存在分歧。适合轻仓方向布局 + 会后顺势交易。'
      );
    } else {
      hints.push(
        '市场预期分散，本次 FOMC 不确定性较高，更适合买波动而不是赌方向。'
      );
    }

    // 根据 narrative 给出补充提示
    if (ev.narrative === 'higher-for-longer') {
      hints.push(
        '若主席在发布会坚持“高利率维持更久”的措辞，可能对风险资产构成压力。'
      );
    } else if (ev.narrative === 'pivot-expected') {
      hints.push(
        '市场期待政策转向，一旦转向不及预期（节奏更慢或幅度更小），风险资产可能先跌后再重新定价。'
      );
    }

    return hints;
  }

  printUpcomingSummary(days = 60) {
    const upcoming = this.listUpcoming(days);
    console.log('📅 未来 FOMC 会议预览:');
    upcoming.forEach((ev) => {
      const focus = this.calcConsensusFocus(ev);
      console.log(
        \`- 日期: \${ev.date} | 市场共识: \${ev.marketConsensus} | 概率(hike/cut/pause): \${(
          ev.hikeProb * 100
        ).toFixed(1)}% / \${(ev.cutProb * 100).toFixed(
          1
        )}% / \${(ev.pauseProb * 100).toFixed(
          1
        )}% | 共识集中度: \${focus}\`
      );
      const hints = this.getTradeHints(ev);
      hints.forEach((h) => console.log('  · ' + h));
    });
  }
}
\`\`\`

---

## 📊 风控与仓位控制建议

\`\`\`javascript
const FOMC_TRADE_RISK = {
  MAX_EVENT_RISK_RATIO: 0.05,     // 单次 FOMC 事件的最大风险敞口不超过净资产 5%
  MAX_LEVERAGE: 2,                // 在FOMC前后整体杠杆不超过 2 倍
  REDUCE_BEFORE_EVENT_MINUTES: 5, // 决议公布前 5 分钟切换到“战斗仓位”
  MAX_INTRADAY_LOSS: 0.05,        // 当天最大亏损 5% 必须停手
  LOCK_PROFIT_AT: [0.1, 0.2, 0.3] // 当日浮盈 10%、20%、30% 时考虑分段锁仓
};
\`\`\`

关键原则：

1. **不要把 FOMC 当成“翻倍一夜”的工具**  
   - 更安全的心态是：“用一次事件创造一点高质量波动率 alpha”；  

2. **在重大宏观事件前，降低整体风险暴露**  
   - 尤其是高杠杆的合约与期权仓位，  
   - 以免被瞬时波动扫损。  

3. **会后不恋战**  
   - 无论盈亏如何，  
   - 当晚或次日务必总结：  
     - 自己预期哪里对/哪里错；  
     - 仓位和节奏是否符合事前计划。  

---

## 🎯 实战 Checklist

- [ ] 为一年内所有 FOMC 会议建立日历，并记录市场共识路径  
- [ ] 每次会议前 3-5 天，阅读几篇主流机构的观点概览  
- [ ] 明确本次的“共识集中度”：是“大家都这么想”还是“莫衷一是”  
- [ ] 选择适合自己的子策略（买波动 vs 轻仓押方向 vs 相对强弱）  
- [ ] 严格执行“当天最大亏损上限”和“浮盈锁定规则”  

---

## ✅ 小结

**美联储议息会议，是整个全球资产的“节奏打点器”。**

- 对于长期投资者，它是调整仓位的宏观参考；  
- 对于事件交易者，它是少数可以“预定时间、预定高波动”的节点。  

只要你把握好：

- 不在会前 All-in 赌方向；  
- 尊重市场共识与偏差，而非自我意淫；  
- 对仓位和风险有清晰且刚性的约束；  

FOMC 会议就能从“爆仓高危日”，  
变成你事件驱动策略库里 **一条可控的高波动玩法**。`
};

/**
 * 上传 35.1 / 35.2 / 35.3 策略到 Directus
 */
async function uploadStrategies() {
  const DIRECTUS_URL = 'http://localhost:8055';

  console.log('开始上传策略 35.1 / 35.2 / 35.3...\n');

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

    // 上传策略 35.1
    console.log('上传策略 35.1: 代币解锁前做空...');
    await axios.post(`${DIRECTUS_URL}/items/strategies`, STRATEGY_35_1, {
      headers
    });
    console.log('✅ 策略 35.1 上传成功\n');

    // 上传策略 35.2
    console.log('上传策略 35.2: 交易所上币事件...');
    await axios.post(`${DIRECTUS_URL}/items/strategies`, STRATEGY_35_2, {
      headers
    });
    console.log('✅ 策略 35.2 上传成功\n');

    // 上传策略 35.3
    console.log('上传策略 35.3: 美联储议息会议交易...');
    await axios.post(`${DIRECTUS_URL}/items/strategies`, STRATEGY_35_3, {
      headers
    });
    console.log('✅ 策略 35.3 上传成功\n');

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

// 若需要直接在 Node 中运行本文件写入策略，可以解除下面一行注释：
uploadStrategies();
