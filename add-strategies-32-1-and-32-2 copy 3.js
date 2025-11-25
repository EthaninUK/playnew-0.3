// 策略 32.1 & 32.2: 衍生品策略 (Derivatives Strategies) - 期权卖方 (Options Selling)

const axios = require('axios');

/**
 * 32.1 BTC Covered Call 备兑开仓
 *
 * 一级分类: 衍生品策略 (Derivatives Strategies)
 * category_l1: derivatives
 * category: options-selling
 * category_l2: options-selling
 */
const STRATEGY_32_1 = {
  title: 'BTC Covered Call 备兑开仓 - 用持仓 BTC 持续“出租权利”赚权利金',
  slug: 'btc-covered-call-income-strategy',
  summary:
    '在长期看好 BTC 的前提下，采用“备兑开仓”方式：一边持有 BTC 现货，一边定期卖出虚值看涨期权（Covered Call）。通过收取权利金，将原本只“静躺”的 BTC 仓位变成持续产生现金流的资产。在行情横盘或缓涨时，月度年化收益可达 3-8% 左右；但需要接受上涨被“封顶”的机会成本，以及极端行情下的执行风险。',
  category: 'options-selling',
  category_l1: 'derivatives',
  category_l2: 'options-selling',
  risk_level: 3,
  apy_min: 8,
  apy_max: 40,
  min_investment: 2000,
  time_commitment: '每月 2-4 小时策略滚动管理 + 日常轻度盯盘',
  status: 'published',
  content: `# 32.1 BTC Covered Call 备兑开仓 - 用持仓 BTC 持续“出租权利”赚权利金

> ⚠️ 风险提示  
> - 本策略属于**衍生品卖方策略**，并非无风险套利；  
> - 你依然承担 BTC 现货价格波动风险；  
> - 同时会放弃部分极端上行收益（收益被封顶）；  
> - 所有示例价格与收益仅为教学目的，不构成任何投资建议。  

---

## 💰 策略一览

| 参数            | 数值/说明 |
|-----------------|-----------|
| **基础资产**    | BTC 现货（通常保存在 CEX 或期权平台的现货账户） |
| **衍生工具**    | BTC 美式/欧式看涨期权（以 USDT 或 BTC 计价） |
| **策略形式**    | Covered Call（备兑看涨期权） |
| **适用观点**    | 长期看多 BTC，但短期对价格“不过分乐观”，接受收益封顶换权利金 |
| **预期月度收益**| 大致 3-8%（视隐含波动率 IV、到期时间、执行价、平台而定） |
| **主要风险**    | 大涨被“强行止盈”，极端行情下管理不当可能导致心态崩溃 |
| **难度等级**    | 中级（理解期权 Greeks 与结算细节会更好） |

---

## 📖 场景故事：不想追涨杀跌，只想稳稳拿 BTC + 权利金

假设你是一个典型的“BTC 长期主义者”：

- 你相信比特币长期会涨；
- 你已经在现货层面持有了一些 BTC，例如 1 BTC；
- 但你发现一个现实问题：  
  - 如果只“死拿”，在长时间横盘的时候，其实没有任何现金流；  
  - 你又暂时不想高频交易，也不擅长短线。

有一天你接触到“Covered Call（备兑开仓）”：

> “反正我本来就不打算短期卖 BTC，  
>  那能不能每个月把‘上涨一部分空间’出租出去，  
>  换取稳定的权利金收入？”

于是你做了如下设计：

- 当前 BTC 价格约 60,000 USDT；
- 你手上有 1 BTC 现货，锁定在交易所现货账户中；
- 你每个月卖出一张：  
  - 执行价 66,000 USDT（约 10% 虚值）  
  - 到期时间为 30 天后的看涨期权  
  - 收到权利金假设为 1,200 USDT（仅为示例）

三种到期场景：

1. **到期时 BTC < 66,000 USDT（期权未被行权）**  
   - 你的 1 BTC 仍在你账户中；  
   - 你已经拿到 1,200 USDT 权利金；  
   - 实际上相当于：  
     - 你持有 BTC 的同时，  
     - 获得了约 1,200 / 60,000 ≈ **2%** 的月度现金流。

2. **到期时 BTC 稍微涨过 66,000 USDT**  
   - 比如到 68,000 USDT；  
   - 期权买方行权，你被要求以 66,000 USDT/枚“卖出”你的 1 BTC；  
   - 你的综合收益：  
     - 现货从 60,000 → 66,000：赚 6,000 USDT  
     - 加上权利金 1,200 USDT  
     - 总计约 7,200 USDT 收益  
   - 但你错过了从 66,000 → 68,000 这 2,000 USDT 的额外上涨。

3. **到期时 BTC 暴涨到 80,000+ USDT**  
   - 你依然只能按 66,000 的执行价卖出 BTC；  
   - 综合来看还是赚钱的，但你会“非常心痛”：  
     - 你拿到的总收益远小于“直接持币不卖”的结果；
   - 这就是 Covered Call 的核心代价：  
     > 用“放弃极端上行的潜在机会”换每月稳定的权利金。

> 适合那些：  
> - 更看重“现金流 + 减少短期波动”，  
> - 而非“极致暴富机会”的持币玩家。

---

## 🧠 策略核心逻辑拆解

Covered Call 的逻辑可以拆成两层：

1. **现货层（Delta ~ 1）**  
   - 你仍然是 BTC 持有者，承受 BTC 价格上涨与下跌时的大部分波动；  
   - 这部分类似“长期现货多头”。

2. **期权层（Short Call，Delta ~ 0~1）**  
   - 你卖出一个看涨期权，收取权利金；  
   - 随着 BTC 上涨，这个看涨期权变得对买方更有利，你的“短 Call”浮亏；  
   - 但在整体组合层面，你的现货多头通常能抵消这一部分负面效果。

### 组合形态：  

> \`1 BTC 现货多头 + 1 张 BTC Call 空头 = 近似于“被封顶的多头”\`  

收益结构形象化：

- 向下：  
  - BTC 大跌，你依然承担绝大部分下跌损失；  
  - 但权利金可以稍微缓冲一点点跌幅；  

- 横盘、温和上涨：  
  - 你拿着 BTC，上涨赚价差；  
  - 同时每月拿稳定权利金，整体收益非常可观；  

- 暴涨：  
  - 你“被迫”在执行价附近卖出 BTC，  
  - 赚到的是：  
    - 执行价 - 成本价 + 权利金  
  - 但比起“裸持 BTC”会少赚很多。

---

## 🧩 实战设计维度：4 个关键参数

### 1️⃣ 选择到期时间（Tenor）

- 常见有：7 天 / 14 天 / 30 天 / 60 天 / 90 天 等；  
- 一般散户比较常用 **7-30 天** 周期，原因是：  
  - 足够频繁滚动；  
  - 权利金时间价值（Theta）比较集中；  
  - 风控与调整更灵活。

### 2️⃣ 选择执行价（Strike）

典型的“虚值程度”选择：

- 5-10% 虚值（OTM）：  
  - 风险：被执行时，你放弃的上涨空间有限；  
  - 权利金：中等偏上；  
- 10-20% 虚值：  
  - 被执行概率降低；  
  - 权利金变少，但“封顶”距离更远。

简单经验（仅教学示意）：

- 若你 **非常不想短期卖掉 BTC**：  
  - 选稍远一些的 OTM（如 10-15% 上方）；  
- 若你觉得当前价格已有一定泡沫，  
  甚至正好想在某个价位卖出：  
  - 可以把执行价设在你本来就想卖的那个位置附近，  
  - 等于是“挂限价单 + 附赠权利金”。

### 3️⃣ 卖出哪种类型的 Call（美式/欧式、现金结算/实物交割）

- 欧式、现金结算：  
  - 到期按差价结算，无需实物交割 BTC；  
  - 适合不想动本体仓位的玩家；  
- 美式、实物交割：  
  - 可能在到期前被提前行权；  
  - 需要确保持有足量 BTC 做交割。

不同平台规则不同，需要严格看清条款。

### 4️⃣ 仓位规模（多大比例的 BTC 用来卖 Call）

- 100% BTC 都做 Covered Call：  
  - 收入最大化，但暴涨时会“极度心痛”；  
- 50-70% BTC 做 Covered Call：  
  - 留一部分“自由多头”享受暴涨；  
- 也可以做 **分层结构**：  
  - 一部分较近执行价，权利金更高；  
  - 一部分较远执行价，增加暴涨参与度。

---

## 🛠️ 简易 Covered Call 收益模拟器（示意）

> 以下为简化版数学模型，仅用于帮助理解收益结构。  
> 未考虑手续费、资金费率、滑点等实际因素。

\`\`\`javascript
class CoveredCallSimulatorBTC {
  /**
   * @param {number} spotEntry    买入 BTC 成本价
   * @param {number} strike       看涨期权执行价
   * @param {number} premium      每 BTC 收到的权利金（以 USDT 计）
   * @param {number} positionSize 仓位 BTC 数量
   */
  constructor({ spotEntry, strike, premium, positionSize = 1 }) {
    this.spotEntry = spotEntry;
    this.strike = strike;
    this.premium = premium;
    this.positionSize = positionSize;
  }

  /**
   * 计算到期时，在不同价格下的总盈亏
   * @param {number} spotAtExpiry 到期时 BTC 价格
   */
  payoffAtExpiry(spotAtExpiry) {
    const { spotEntry, strike, premium, positionSize } = this;

    // 现货部分： (到期价 - 成本价) * 仓位
    const spotPnl = (spotAtExpiry - spotEntry) * positionSize;

    // 期权部分：卖出 Call，若到期价 > 执行价，损失为 (到期价 - 执行价)
    const callIntrinsic = Math.max(0, spotAtExpiry - strike);
    const optionPnl = (premium - callIntrinsic) * positionSize;

    const total = spotPnl + optionPnl;

    return {
      spotAtExpiry,
      spotPnl,
      optionPnl,
      total
    };
  }

  /**
   * 给定一系列价格，生成 payoff 曲线数据
   */
  generatePayoffCurve(priceList) {
    return priceList.map((p) => this.payoffAtExpiry(p));
  }

  demo() {
    const prices = [30000, 40000, 50000, 60000, 66000, 70000, 80000];
    const rows = this.generatePayoffCurve(prices);
    console.log('📊 BTC Covered Call payoff 示例:');
    rows.forEach((r) => {
      console.log(
        \`- 到期价=\${r.spotAtExpiry} | 现货PnL=\${r.spotPnl.toFixed(
          2
        )} | 期权PnL=\${r.optionPnl.toFixed(
          2
        )} | 总PnL=\${r.total.toFixed(2)}\`
      );
    });
  }
}

// 使用示例：
// const sim = new CoveredCallSimulatorBTC({
//   spotEntry: 60000,
//   strike: 66000,
//   premium: 1200,
//   positionSize: 1
// });
// sim.demo();
\`\`\`

---

## 📊 风控与配置参数示例

\`\`\`javascript
const BTC_COVERED_CALL_RISK_CONFIG = {
  MAX_COVER_RATIO: 0.7,           // 用持仓 BTC 的最大 70% 去卖 Call
  MIN_OTM_RATIO: 0.05,            // 执行价至少高于现价 5%
  MAX_TENOR_DAYS: 30,             // 到期时间不超过 30 天
  ROLLING_BEFORE_EXPIRY_DAYS: 2,  // 一般在到期前 1-2 天决定是否平仓或展期
  STOP_SELL_CALL_WHEN_IV_LOW: true, // 隐含波动率过低时减少卖出频率（权利金不划算）
  MAX_PLATFORM_EXPOSURE_RATIO: 0.5 // 在单一平台的 BTC+期权组合不超过总资产 50%
};
\`\`\`

---

## 🎯 实战 Checklist（32.1）

### 1️⃣ 策略适配确认

- [ ] 你本身是 BTC 长期看多、并愿意接受短期波动的人；  
- [ ] 你对“部分放弃极端上行”心理上可以接受；  
- [ ] 你愿意学习基本的期权概念（Call/Put、IV、Theta 等）。

### 2️⃣ 平台与产品选择

- [ ] 选择安全性相对可靠、有期权流动性的交易所或专门平台；  
- [ ] 搞清楚该平台的：  
  - 期权结算方式（现金/实物交割）  
  - 保证金要求  
  - 手续费结构  
- [ ] 避免在流动性极差的奇葩期权上卖方，以免被巨大点差收割。

### 3️⃣ 参数设置

- [ ] 选择合适的到期时间（如 7-30 天）；  
- [ ] 执行价一般设在当前价上方 5-15% 区间；  
- [ ] 控制覆盖比例：如只用 50-70% BTC 仓位做 Covered Call。

### 4️⃣ 执行与迭代

- [ ] 每期策略到期前 1-2 天，评估：  
  - 是否提前平仓/展期  
  - 是否调整执行价与到期日  
- [ ] 定期复盘：  
  - 和“单纯持币”相比，过去 N 期总体收益差距如何？  
  - 自己对暴涨被封顶的“情绪承受程度”是否足够？  

---

## ✅ 小结

**BTC Covered Call** 的本质：

- 仍然是一个多头策略，只是“带了天花板”；  
- 用固定的、可预期的权利金收入，  
  去换掉一部分“极端暴涨”的潜在收益；  
- 特别适合那些  
  > “已经有 BTC 仓位、不想天天盯盘，又希望有稳定现金流”  
  的持币人。

当你把 BTC 从“纯价格博弈资产”变成“带现金流的长期仓位”，  
你就把自己从“每天盯着价格波动的短线玩家”，  
变成了一个真正用结构化衍生品管理仓位的“策略操盘者”。  

---

`
};

/**
 * 32.2 ETH Put Selling 低位接盘
 *
 * 一级分类: 衍生品策略 (Derivatives Strategies)
 * category_l1: derivatives
 * category: options-selling
 * category_l2: options-selling
 */
const STRATEGY_32_2 = {
  title: 'ETH Put Selling 低位接盘 - 用“挂限价买单”顺便收权利金',
  slug: 'eth-put-selling-buy-the-dip',
  summary:
    '在对 ETH 长期看多、并愿意在某个价格“接盘”的前提下，通过卖出看跌期权（Short Put），将“原本挂在深度买盘里的限价单”变成有权利金收入的限价承诺：如果到期时 ETH 未跌破执行价，你赚到全部权利金；如果跌破，你以执行价买入 ETH，相当于“带补贴的低位挂单”。适合作为“分批买入 ETH”的结构化工具，但需严格控制仓位、保证金和极端行情风险。',
  category: 'options-selling',
  category_l1: 'derivatives',
  category_l2: 'options-selling',
  risk_level: 4,
  apy_min: 10,
  apy_max: 60,
  min_investment: 2000,
  time_commitment: '每月 2-4 小时滚动卖 Put + 日常监控风险',
  status: 'published',
  content: `# 32.2 ETH Put Selling 低位接盘 - 用“挂限价买单”顺便收权利金

> ⚠️ 风险提示  
> - 卖出看跌期权（Short Put）是**有潜在巨大亏损风险**的策略：  
>   - 若 ETH 暴跌，你会被“强制”以执行价买入 ETH；  
>   - 若未准备好足够资金/保证金，可能触发强平/爆仓风险；  
> - 本策略适用于本来就想在某个价位买 ETH，  
>   且能够接受短期大幅波动的玩家。

---

## 💰 策略一览

| 参数              | 数值/说明 |
|-------------------|-----------|
| **基础资产**      | ETH 现货（目标是最终可能持有 ETH） |
| **衍生工具**      | ETH 看跌期权（Put Options） |
| **策略形式**      | Short Put（卖出看跌期权），以 USDT 或稳定币计价保证金 |
| **适用观点**      | 长期看多 ETH，短期愿意在某个支撑位“接盘”，并为此赚权利金 |
| **预期年化区间**  | 10-60%（与波动率、行权价深度、期限密切相关） |
| **主要风险**      | ETH 暴跌导致被大量指派买入，若超出可承受范围则极其危险 |
| **难度等级**      | 中高（期权理解+保证金管理+仓位规划） |

---

## 📖 场景故事：原本就想 2000 USDT 买 ETH，那能不能顺便拿点钱？

假设当前情景：

- ETH 市价：2,400 USDT  
- 你计划在 2,000 USDT 左右逐步买入一些 ETH，  
  但不想现在全仓冲进去；  
- 如果 ETH 不跌到 2,000，你也不强求一定买到；  
- 若跌到 2,000，  
  > “只要走势不是彻底崩塌，我是愿意接盘的。”

传统做法：

- 在现货订单簿挂一个 2,000 USDT 的限价买单；  
- 然后每天看一眼有没有成交；  
- 挂着挂着半年过去了，也没有任何现金流。

“卖 Put”视角下的新做法：

1. 你在期权市场上卖出：  
   - 到期时间 30 天  
   - 执行价 2,000 USDT 的 ETH 看跌期权  
   - 每份代表 1 ETH（或平台定义的数量）  
2. 你收取权利金，例如：  
   - 每份 Put 收 150 USDT（示意值）  
3. 到期时会出现两种情况：

### 情况 A：到期时 ETH > 2,000 USDT  

- 看跌期权到期变为毫无价值；  
- 你保留全部权利金 150 USDT；  
- 相当于一个月赚 150/2,000 ≈ 7.5% 的收益（未杠杆视角）；  
- 你的“低位接盘需求”没有被触发，资金可以继续滚下一期。

### 情况 B：到期时 ETH < 2,000 USDT  

- 看跌期权被行权，你需以 2,000 USDT/枚买入 1 ETH；  
- 但别忘了：你已经拿到 150 USDT 权利金；  
- 你的**实际成本价**变成：  
  - \`2,000 - 150 = 1,850 USDT/ETH\`（忽略手续费）

> 也就是说：  
> - 如果 ETH 稍微跌破 2,000，你用“带折扣”的价格买入；  
> - 如果 ETH 大幅跌破 2,000，比如到 1,500，  
>   你会浮亏，但成本价仍比“直接 2,000 现货接盘”更低；  
> - 核心风险是：  
>   - 你不能卖出超过自己愿意、且有能力买入的数量；  
>   - 否则极端暴跌时，你会被迫接到巨量 ETH，承担巨大风险。

---

## 🧠 核心逻辑：Short Put = 有补贴的“限价挂单”

从结构上，卖 Put 的收益形态非常像：

> **在某个价位挂限价买单，但你为此获得了一笔补贴（权利金）**。

数学上可以这么理解：

- 若你设定“愿意以 P0 价格买入 ETH”；  
- 同时卖出执行价为 P0 的看跌期权，收到权利金 C；  
- 结果：

1. 若最终没买到，你获得 +C 收入；  
2. 若最终被迫以 P0 买入，  
   你的实际成本为 \`P0 - C\`，比直接挂限价单更低。

> 所以卖 Put 只适合：  
> - 本来就真心想在这个价位买；  
> - 有真实现金/保证金支持；  
> - 理解极端下跌时，可能出现“买到很多”的结果。

---

## 🧩 策略参数拆解：3+1 关键维度

### 1️⃣ 执行价（Strike） = 你“愿意接盘”的价格

典型思路：

- 如果你本来就计划在 2,000 USDT 大致位置买 ETH：  
  - 就选 2,000 或略低一点（如 1,900-2,000）；  
- 若你非常保守，只想“便宜很多才买”：  
  - 可以选更深虚值，比如 1,800/1,700 等；  
  - 对应权利金会变少，但“买到”的概率下降。

### 2️⃣ 到期时间（Tenor）

- 短期（7-14 天）：  
  - 权利金相对集中，Theta 折旧较快；  
  - 但每次卖 Put 的管理频率更高；  

- 中短期（30 天左右）：  
  - 权利金充足，可获得较高年化；  
  - 你有更清晰的短期观点时更合适。

经验方向（示意）：

- 新手建议从 14-30 天结构开始，  
  方便有时间应对市场波动与调整。

### 3️⃣ 卖出数量（仓位与保证金管理）

**铁律**：

> 永远不要卖出比你“真心愿意且有能力接盘”的 ETH 数量更多的 Put。

例：

- 你有 20,000 USDT 稳定资金，  
  且愿意在 2,000 USDT 买入 5 ETH（总 10,000 USDT），  
  剩余资金做风控缓冲；  
- 则你可以考虑卖出 **不超过 5 张** 2,000 执行价的 Put；  
- 若超卖，例如卖了 10 张：  
  - 一旦到期 ETH 暴跌，你会被迫买入 10 ETH（20,000 USDT），  
  - 导致资金全压在一个点位，风险极高。

### 4️⃣ 保证金与爆仓风险（保证金期权场景）

有的平台是“现金担保 Put”，  
即要求你有足够的稳定币作为保证金；  
有的平台则是“保证金模式”，  
允许一定杠杆。

- 新手/保守玩家建议采用：  
  - “全额现金担保”或接近全额的保证金模式；  
- 绝对不要用高杠杆去卖 Put，  
  否则 ETH 暴跌时可能直接爆仓，而不是“平价买到便宜筹码”。

---

## 🛠️ 简易 ETH Put Selling 收益模拟器（示意）

> 简化模型，仅演示卖 Put 在到期时的盈亏曲线。

\`\`\`javascript
class EthPutSellingSimulator {
  /**
   * @param {number} strike          执行价
   * @param {number} premium         收取的权利金（每 ETH，以 USDT 计）
   * @param {number} contracts       卖出张数（假设每张代表 1 ETH）
   * @param {number} maxCapitalReady 你为可能接盘预留的最大资金（USDT）
   */
  constructor({ strike, premium, contracts = 1, maxCapitalReady }) {
    this.strike = strike;
    this.premium = premium;
    this.contracts = contracts;
    this.maxCapitalReady = maxCapitalReady;
  }

  /**
   * 计算到期在不同价格下的盈亏与资金占用
   * @param {number} spotAtExpiry 到期时 ETH 价格
   */
  payoffAtExpiry(spotAtExpiry) {
    const { strike, premium, contracts, maxCapitalReady } = this;

    // 若到期价 < 执行价，被行权：需要买入 ETH
    const willBeAssigned = spotAtExpiry < strike;
    const notionalToBuy = willBeAssigned ? strike * contracts : 0;

    // 收到的总权利金
    const totalPremium = premium * contracts;

    // 若被行权，账面上买入 ETH 的市值
    const ethMarketValue = willBeAssigned
      ? spotAtExpiry * contracts
      : 0;

    // 卖 Put 的盈亏：若被行权，损失为 (执行价 - 到期价)，再减去权利金
    const intrinsicLossPerEth = Math.max(0, strike - spotAtExpiry);
    const totalIntrinsicLoss = intrinsicLossPerEth * contracts;

    const optionPnl = totalPremium - totalIntrinsicLoss;

    // 只从现金视角看：  
    // - 若未被行权：赚 totalPremium  
    // - 若被行权：你用现金买入 ETH，持有 ETH 的市值为 ethMarketValue
    const capitalUsed = willBeAssigned ? notionalToBuy : 0;
    const capitalLeft = maxCapitalReady - capitalUsed;

    return {
      spotAtExpiry,
      willBeAssigned,
      totalPremium,
      optionPnl,
      notionalToBuy,
      ethMarketValue,
      capitalUsed,
      capitalLeft
    };
  }

  generatePayoffCurve(priceList) {
    return priceList.map((p) => this.payoffAtExpiry(p));
  }

  demo() {
    const prices = [800, 1200, 1600, 2000, 2200, 2500];
    const rows = this.generatePayoffCurve(prices);
    console.log('📊 ETH Put Selling payoff 示例:');
    rows.forEach((r) => {
      console.log(
        \`- 到期价=\${r.spotAtExpiry} | 是否被行权=\${r.willBeAssigned} | 权利金收入=\${r.totalPremium.toFixed(
          2
        )} | 期权PnL=\${r.optionPnl.toFixed(
          2
        )} | 实际买入名义=\${r.notionalToBuy.toFixed(
          2
        )} | 剩余现金=\${r.capitalLeft.toFixed(2)}\`
      );
    });
  }
}

// 使用示例：
// const sim = new EthPutSellingSimulator({
//   strike: 2000,
//   premium: 150,
//   contracts: 2,
//   maxCapitalReady: 6000
// });
// sim.demo();
\`\`\`

---

## 📊 风控参数示例：ETH Put 卖方

\`\`\`javascript
const ETH_PUT_SELLING_RISK_CONFIG = {
  MAX_PUT_NOTIONAL_RATIO: 0.3,        // 卖出 Put 对应的最大潜在买入金额不超过总净资产 30%
  MIN_CASH_COVER_RATIO: 0.8,          // 至少 80% 名义金额有现金覆盖（避免高杠杆裸卖）
  MIN_OTM_RATIO: 0.1,                 // 执行价至少低于当前价 10%（更保守）
  MAX_TENOR_DAYS: 30,                 // 单期到期不超过 30 天，方便频繁调整
  STOP_SELL_PUT_WHEN_EXTREME_VOL: true, // 极端波动/政策不确定时，暂停新开仓
  MAX_CONCURRENT_SERIES: 2            // 同时最多参与 2 个不同到期日/执行价的 Put 组合
};
\`\`\`

---

## 🎯 实战 Checklist（32.2）

### 1️⃣ 需求与心态确认

- [ ] 你本来就想在某一价格区间买入 ETH（而不是为了“卖 Put 而卖 Put”）；  
- [ ] 你能够接受被迫买入后短期持续下跌的浮亏情况；  
- [ ] 你有真实的现金/稳定币做保证金，而不是借来的杠杆。

### 2️⃣ 平台与产品选择

- [ ] 选择有足够流动性与风险控制机制的 ETH 期权市场；  
- [ ] 搞清楚：  
  - 期权合约规格（合约乘数、合约币种）  
  - 结算方式（现金 vs 实物交割）  
  - 追加保证金/强平规则  

### 3️⃣ 策略参数设计

- [ ] 确定每一档愿意买入 ETH 的价格（例如：1,800 / 2,000 / 2,200）；  
- [ ] 对应卖出不同执行价的 Put，分层布仓；  
- [ ] 严格限制总名义敞口：  
  - 总潜在买入 ETH 金额 < 总净资产某固定比例（如 30%）。

### 4️⃣ 执行与滚动

- [ ] 每期到期前几天，检查：  
  - ETH 是否接近执行价；  
  - 是否需要提前平仓、减仓或展期；  
- [ ] 若被行权买入 ETH：  
  - 把它视为“低位建仓”，纳入你的长期现货仓位管理；  
  - 此时可以搭配 32.1 的 Covered Call，再次通过卖 Call 提高收益。

### 5️⃣ 定期复盘与调整

- [ ] 统计过去数期：  
  - 权利金总收入  
  - 实际被行权的次数与买入成本  
  - 与“同时间点直接挂限价买入”相比，综合成本是否更优？  
- [ ] 若发现自己经常因过度卖 Put 被动接到过多筹码，  
  则削减 Put 卖出规模，回归更保守的现金管理。

---

## ✅ 总结：BTC 备兑 + ETH 卖 Put 的组合思路

- 32.1 BTC Covered Call：  
  - 适合已经持有 BTC，希望获得稳定现金流，  
  - 接受一些上涨封顶的玩家。

- 32.2 ETH Put Selling：  
  - 适合手握稳定币、希望分批低位买入 ETH 的玩家；  
  - 相当于用“带补贴的限价挂单”替代传统深度挂单。

两者都是 **衍生品卖方策略**，  
共有特征：

- 都是用“确定收益”（权利金）换取“不确定的机会成本/风险”；  
- 都非常依赖 **仓位控制** 与 **保证金管理**；  
- 都更适合有一定风险承受能力与衍生品基础的中级玩家。

当你把这两个策略组合进你的 **衍生品策略 (Derivatives Strategies)** 模块时，  
你就不再只是被动承受波动，  
而是通过 **结构化期权卖方**，  
把“时间 + 波动”也变成可管理、可定价的策略因子。  

---

`
};

/**
 * 上传 32.1 和 32.2 策略到 Directus
 */
async function uploadStrategies() {
  const DIRECTUS_URL = 'http://localhost:8055';

  console.log('开始上传策略 32.1 (BTC Covered Call) 和 32.2 (ETH Put Selling)...\n');

  try {
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

    console.log('上传策略 32.1: BTC Covered Call 备兑开仓...');
    await axios.post(`${DIRECTUS_URL}/items/strategies`, STRATEGY_32_1, {
      headers
    });
    console.log('✅ 策略 32.1 上传成功\n');

    console.log('上传策略 32.2: ETH Put Selling 低位接盘...');
    await axios.post(`${DIRECTUS_URL}/items/strategies`, STRATEGY_32_2, {
      headers
    });
    console.log('✅ 策略 32.2 上传成功\n');

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

// 若要在 Node 中直接执行此文件写入策略，请取消下面一行注释：
uploadStrategies();
