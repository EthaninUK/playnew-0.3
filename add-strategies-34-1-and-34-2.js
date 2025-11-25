// 策略 34.1 & 34.2: 衍生品策略 (Derivatives Strategies) - 网格交易 (Grid Trading)

const axios = require('axios');

/**
 * 34.1 BTC 现货网格交易
 *
 * 一级分类: 衍生品策略 (Derivatives Strategies)
 * category_l1: derivatives
 * category: grid-trading
 * category_l2: grid-trading
 *
 * 虽然本质是“现货类网格”，但在你的玩法体系中归入衍生品策略下的 grid-trading 分支。
 */
const STRATEGY_34_1 = {
  title: 'BTC 现货网格交易 - 在震荡区间里做“自动低买高卖”的机械收割机',
  slug: 'btc-spot-grid-trading',
  summary:
    '在 BTC 预期震荡的价格区间内（例如 25,000-35,000 USDT），预先划分若干网格档位，并在每一档设置买入价和卖出价：当价格向下触发买单时累计仓位，向上触发卖单时实现差价收益。通过“机械化低买高卖”，让情绪波动变成固定规则下的系统性利润。适合相信 BTC 中长期向上、但短期经常剧烈震荡的玩家，前提是对回撤、仓位和黑天鹅有清晰预期。',
  category: 'grid-trading',
  category_l1: 'derivatives',
  category_l2: 'grid-trading',
  risk_level: 3,
  apy_min: 8,
  apy_max: 40,
  min_investment: 1000,
  time_commitment:
    '前期 1-3 天设计网格与测试参数，之后主要是定期检查与调整区间（低频维护）',
  status: 'published',
  content: `# 34.1 BTC 现货网格交易 - 在震荡区间里做“自动低买高卖”的机械收割机

> ⚠️ 重要风险提示  
> - 网格并不是“稳赚不赔算法”，本质还是趋势与波动假设上的一种博弈；  
> - 只适合在“长期看涨/看好，但短期震荡”的逻辑下使用；  
> - 强趋势下跌时，网格会不断买入摊低成本，可能变成“深套现货”；  
> - 强趋势上升时，网格会不断卖出锁定利润，但可能踏空后续涨幅。  

---

## 💰 策略概览

| 维度              | 内容说明 |
|-------------------|----------|
| **底层标的**      | BTC 现货（也可扩展到其他流动性好、波动较大的主流币） |
| **核心逻辑**      | 在预设价格区间内自动执行“低买高卖”的网格挂单 |
| **主要收益来源**  | 价格在区间内来回震荡产生的差价收益（Grid Profit） |
| **关键前提**      | BTC 在设定区间内反复波动、且长期不出现极端单边穿透并长期停留 |
| **适用人群**      | 理解“网格=震荡吃肉、单边挨打”的玩家，接受一定回撤，且有长期持币心态 |

---

## 📖 场景故事：用网格把“焦虑的盘整期”变成“机械收租期”

假设你对 BTC 的中长期判断是：

- 未来 1-2 年仍然看多 BTC；  
- 短期来看，30,000~40,000 USDT 是一个主要震荡区间；  
- 你既不想天天盯盘，又不想完全空仓错过波动。

你的想法是：

> “既然 BTC 经常上下乱晃，  
>  不如我干脆设定一套规则：  
>  — 每跌一点就买一点，  
>  — 每涨一点就卖一点，  
>  用机械化的方法把情绪波动收割成差价。”

于是你选择 **BTC 现货网格交易**：

- 手动或用机器人，在某个区间内设好买卖档位；  
- 价格跌到某档时，系统自动买入；  
- 价格涨回上方某档时，系统自动卖出；  
- 每一轮波动，就是一次“低买高卖”的网格利润。

---

## 🧠 网格交易的核心逻辑

### 1️⃣ 区间假设：你画了一条“活动走廊”

你首先对 BTC 未来一段时间做一个**区间假设**：

- 例如：  
  - 下边界：25,000 USDT  
  - 上边界：35,000 USDT  

这条走廊是你“允许网格尽情玩耍”的范围。

如果 BTC 长期在这个区间内上下震荡：

- 你可以通过“多次低买高卖”累积大量差价；  
- 同时因为是现货网格，整体爆仓风险较低（但会深套）。

### 2️⃣ 网格划分：把区间切成 N 段

接着，你把 \`25,000~35,000\` 这个区间切成若干网格：

- 比如划分为 20 条网格线（21 个价格节点）；  
- 两格之间的价格差 = (35,000 - 25,000) / 20 = 500 USDT；  

于是你得到价格序列：

\`\`\`text
25,000 / 25,500 / 26,000 / ... / 34,500 / 35,000
\`\`\`

通常：

- 下半部分网格主要用于买入（价格向下跌，越跌越买）；  
- 上半部分网格主要用于卖出（价格向上冲，越涨越卖）。

### 3️⃣ 资金/仓位分配：每一格分配多少 BTC/USDT？

你需要决定：

- 初始投入金额：例如 10,000 USDT；  
- 其中多少用于：  
  - 持有 BTC（作为初始仓位）；  
  - 保留 USDT（作为下方买入的弹药）。

典型思路：

- 50% 价值 BTC + 50% 价值 USDT；  
- 或者更保守：30% BTC + 70% USDT（担心进一步下跌时有更多子弹）。

每一格的下单规模，可以是：

- 固定数量（例如每格 0.01 BTC）；  
- 或随价格调整（接近下边界的格子下单更大）。  

---

## 🧩 现货网格收益来源拆解

网格收益可以大致拆为三部分：

1. **网格差价收益（Grid Profit）**  
   - 每一次“低买高卖”的价差 * 数量；  
   - 若 BTC 在区间内频繁上下波动，这部分是主要利润来源。

2. **持仓浮动盈亏（Position PnL）**  
   - 你的整体 BTC 持仓随着价格变化产生的浮盈/浮亏；  
   - 若 BTC 最终从 30,000 涨到 50,000，即使网格已停止触发，你仍有持仓收益。

3. **手续费成本（Fees）**  
   - 每一次网格交易都会产生手续费；  
   - 网格频率越高，越要控制手续费和滑点，否则会吃掉大量利润。

> 网格策略的“神奇手感”，往往来自：  
> - 在情绪上，人们讨厌“震荡行情，来回被耍”；  
> - 但网格却能把这种震荡，变成一格一格的“机械收租”。  

---

## 🛠️ 简易 BTC 现货网格模拟器（示意）

> 下面是一个教学级别的网格构建与收益估算模型，  
> 可以帮你快速测试不同区间、格子数与单格投入对收益的影响。

\`\`\`javascript
class SpotGridConfig {
  /**
   * @param {number} lower      网格下边界价格
   * @param {number} upper      网格上边界价格
   * @param {number} levels     网格层数（格子数量 = levels - 1）
   * @param {number} capital    总资金（USD 计）
   * @param {number} spotPrice  当前现价
   */
  constructor({ lower, upper, levels, capital, spotPrice }) {
    this.lower = lower;
    this.upper = upper;
    this.levels = levels;
    this.capital = capital;
    this.spotPrice = spotPrice;
  }

  /**
   * 生成每条网格线价格
   */
  buildGridLevels() {
    const { lower, upper, levels } = this;
    const step = (upper - lower) / (levels - 1);
    const prices = [];
    for (let i = 0; i < levels; i++) {
      prices.push(lower + step * i);
    }
    return prices;
  }

  /**
   * 粗略估算每格下单数量（假设上半部分卖出、下半部分买入）
   */
  estimateGridOrderSize() {
    const prices = this.buildGridLevels();
    const midIndex = Math.floor(prices.length / 2);
    // 预留一半资金作为 BTC 仓位，另一半作为 USDT 仓位
    const capitalForBTC = this.capital * 0.5;
    const capitalForUSDT = this.capital * 0.5;

    // 估算初始 BTC = capitalForBTC / spotPrice
    const initialBTC = capitalForBTC / this.spotPrice;

    // 将 BTC 份额平均分配到上半部分网格（卖出用）
    const sellGrids = prices.length - midIndex;
    const buyGrids = midIndex + 1;

    const btcPerSellGrid = initialBTC / sellGrids;

    // 将 USDT 平均分配到下半部分网格（买入用）
    const usdtPerBuyGrid = capitalForUSDT / buyGrids;

    return {
      prices,
      midIndex,
      initialBTC,
      btcPerSellGrid,
      usdtPerBuyGrid
    };
  }
}

// 使用示例（仅示意）：
// const cfg = new SpotGridConfig({
//   lower: 25000,
//   upper: 35000,
//   levels: 21,
//   capital: 10000,
//   spotPrice: 30000
// });
// console.log(cfg.estimateGridOrderSize());
\`\`\`

---

## 📊 风控与参数配置示例（BTC 现货网格）

\`\`\`javascript
const BTC_SPOT_GRID_RISK_CONFIG = {
  MAX_CAPITAL_RATIO: 0.4,      // 现货网格占总资产不超过 40%
  RESERVE_STABLE_RATIO: 0.3,   // 至少 30% 总资产保留为稳定币，防止黑天鹅时补仓失血
  MAX_GRID_LEVERAGE: 1.0,      // 现货网格一般不建议加杠杆
  GRID_LEVEL_MIN: 10,          // 最少 10 格
  GRID_LEVEL_MAX: 200,         // 最多 200 格（太多会被手续费吃掉）
  DAILY_CHECK_REQUIRED: true,  // 建议每天至少检查一次价格与区间
  ADJUST_ON_TREND_BREAK: true  // 若 BTC 明显脱离区间，应考虑重置网格或止盈止损
};
\`\`\`

---

## 🎯 实战 Checklist（34.1）

### 1️⃣ 确认你的逻辑前提

- [ ] 你认为 BTC 中长期看涨；  
- [ ] 你认为近期一段时间内主要在一个大致区间内震荡；  
- [ ] 你能接受：  
  - 下跌趋势中网格越买越多，账面浮亏加大；  
  - 上涨趋势中网格不断卖出，可能踏空后续涨幅。

### 2️⃣ 设定网格参数

- [ ] 下边界价格（Lower）：例如 25,000；  
- [ ] 上边界价格（Upper）：例如 35,000；  
- [ ] 网格层数（Levels）：例如 20-50；  
- [ ] 单格下单规模：根据总资金和风险偏好确定。

### 3️⃣ 资金与仓位配置

- [ ] 决定 BTC 初始持仓比例（例如 30-50%）；  
- [ ] 决定 USDT 预留比例（例如 50-70%）；  
- [ ] 不把所有资金都压在一个网格策略上，留出缓冲。

### 4️⃣ 执行与维护

- [ ] 使用交易所/机器人设置好网格参数，确认：  
  - 价格区间  
  - 格子数  
  - 单格规模  
  - 手续费等级；  
- [ ] 定期检查：  
  - 是否出现明显趋势突破  
  - 是否网格已经偏离市场实际波动区间  
  - 是否需要上移/下移网格区间进行再平衡。

### 5️⃣ 退出与重构

- [ ] 当 BTC 明显脱离原区间且不再回归时：  
  - 考虑整体平掉网格（锁定盈亏）；  
  - 重新根据新价格区间设计下一套网格；  
- [ ] 不要死扛一个已经完全“失效”的老网格结构。  

---

## ✅ 小结

BTC 现货网格交易是一种典型的“**用规则对抗情绪**”的策略：

- 它假设：  
  - BTC 会在某个区间内来回波动；  
- 它做的事：  
  - 把“乱晃”拆解为一格一格的固定差价；  
- 它要求：  
  - 你对长期趋势与短期震荡有大致判断；  
  - 你能接受回撤和踏空。

在你的「衍生品策略 (Derivatives Strategies) / grid-trading」模块中，  
它可以作为：  
> “最基础的网格起点策略”，  
为后续的“合约网格、跨品种网格、动态网格”等玩法奠定认知基础。  

---

`
};

/**
 * 34.2 币安网格机器人
 *
 * 一级分类: 衍生品策略 (Derivatives Strategies)
 * category_l1: derivatives
 * category: grid-trading
 * category_l2: grid-trading
 *
 * 重点强调：使用交易所内置的网格机器人，降低执行复杂度。
 */
const STRATEGY_34_2 = {
  title: '币安网格机器人 - 一键托管的 CEX 网格执行引擎',
  slug: 'binance-grid-bot',
  summary:
    '利用币安内置的网格交易机器人，用户只需选择交易对（如 BTC/USDT）、区间上下限、网格数量和资金分配，即可由系统自动在订单簿上挂出成排买卖单，实现“低买高卖”的网格逻辑。相较于手工网格，机器人方案简化了执行环节，但依然需要用户自己负责参数选择、风险管理和策略节奏控制。',
  category: 'grid-trading',
  category_l1: 'derivatives',
  category_l2: 'grid-trading',
  risk_level: 3,
  apy_min: 6,
  apy_max: 35,
  min_investment: 500,
  time_commitment:
    '前期需要花时间理解参数含义并回测，运行中只需定期检查（周度/月度）',
  status: 'published',
  content: `# 34.2 币安网格机器人 - 一键托管的 CEX 网格执行引擎

> ⚠️ 使用说明  
> - 币安网格机器人只是“执行工具”，不是“稳赚算法”；  
> - 真正决定收益和风险的是：区间选择、格子设计、资金分配与退出规则；  
> - 对于不理解网格原理的用户，盲目使用机器人仍然可能“高位接盘、低位踏空”。  

---

## 💰 策略概览

| 维度              | 内容说明 |
|-------------------|----------|
| **平台**          | 币安（Binance）现货/合约网格交易机器人 |
| **支持标的**      | BTC/USDT、ETH/USDT 等主流币及部分山寨币 |
| **策略逻辑**      | 利用交易所内置网格机器人自动执行买卖，实现网格策略的自动化 |
| **优势**          | 无需自己写程序下单，操作界面可视化，支持回测与参数推荐（部分模式） |
| **劣势**          | 依赖单一平台、策略透明度较低、参数选择不当仍可大亏 |
| **适用人群**      | 已理解网格原理，但不想自己写机器人/脚本的玩家 |

---

## 📖 场景故事：从“手动挂单网格”到“一键开启机器人”

你已经理解了 34.1 的 BTC 现货网格交易原理，也清楚：

- 区间如何设；  
- 网格如何划分；  
- 低买高卖逻辑如何运转。

但你遇到几个现实问题：

1. 手工挂单太多：  
   - 一次要下几十个买单和卖单，极其枯燥；  
2. 手工维护困难：  
   - 价格波动后需要重新调整区间，要重新一笔笔撤单再下单；  
3. 容易出错：  
   - 手动输入价格/数量，一不小心就填错或方向弄反。  

于是当你看到币安有“网格机器人”入口时，  
心态是：

> “网格逻辑我懂了，  
>  能不能交给系统来执行，  
>  我只负责决定：  
>   - 做哪个币  
>   - 用多大区间  
>   - 花多少钱  
>   - 什么时候停。”

币安网格机器人的核心价值就在于：  

- 帮你完成“重复、枯燥、容易输错”的执行层工作；  
- 你负责策略方向与参数；  
- 它负责自动在订单簿上挂单与滚动成交。

---

## 🧠 币安网格机器人的关键参数

以 BTC/USDT 现货网格为例，主要参数包括：

1. **交易对（Symbol）**  
   - 如 BTC/USDT、ETH/USDT 等；  
   - 决定你参与哪一个市场的波动。

2. **网格模式**  
   - 现货网格（Spot Grid）；  
   - 合约网格（Futures Grid，带杠杆，更高风险）；  
   - 这里建议：先从现货网格开始，熟悉逻辑后再考虑合约。

3. **价格区间（Lower Price / Upper Price）**  
   - 类似 34.1 的区间设定；  
   - 可以选择手动，也可以使用币安提供的“AI 区间建议”（需谨慎对待）。

4. **网格数量（Number of Grids）**  
   - 决定一共划分多少档；  
   - 网格越多：  
     - 单格利润更小，但触发更频繁；  
     - 交易成本更高，手续费消耗更大。  

5. **投资金额 / 仓位**  
   - 你愿意在本次网格中投入多少 USDT / BTC；  
   - 一般建议使用组合资金的一部分，而不是 All-in。

6. **利润模式/止盈止损**  
   - 是否设置整体止盈价位；  
   - 是否设置整体止损价位；  
   - 是否在网格停止后自动平掉所有剩余持仓。  

---

## 🧩 参数设计思路：一个完整的示例

假设你做 BTC/USDT 现货网格：

- 当前 BTC 价格：30,000 USDT；  
- 你认为未来一段时间的合理震荡区间：26,000~36,000；  
- 你计划投入资金：5,000 USDT。  

一个样例配置：

- 交易对：BTC/USDT  
- 区间：Lower = 26,000；Upper = 36,000；  
- 网格数量：30 格；  
- 投入资金：5,000 USDT；  
- 模式：  
  - 现货网格；  
  - 开启“仅使用 USDT 起步”的模式（由机器人根据价格逐步建仓）。  

机器人会自动：

- 在 26,000~36,000 之间生成 30 条价格档；  
- 为每一档配置买入/卖出委托；  
- 当价格上下穿越这些档时，自动撮合成交，生成差价收益。

---

## 🛠️ 币安网格参数配置对象（伪代码）

> 以下是一个“参数对象模板”，你可以在前端/后端中直接使用这种结构，  
> 把它映射到币安的网格创建接口或内部策略配置表中。

\`\`\`javascript
const BINANCE_GRID_BOT_CONFIG_TEMPLATE = {
  symbol: 'BTCUSDT',                  // 交易对
  mode: 'spot',                       // 'spot' or 'futures'
  lowerPrice: 26000,                  // 网格下边界
  upperPrice: 36000,                  // 网格上边界
  gridCount: 30,                      // 网格数量
  totalInvestment: 5000,              // 总投入额 (USDT)
  leverage: 1,                        // 杠杆倍数（现货网格为 1）
  direction: 'neutral',               // 'neutral', 'long', 'short' (部分平台支持趋势网格)
  takeProfitPrice: null,              // 可选：整体止盈价
  stopLossPrice: null,                // 可选：整体止损价
  triggerPrice: null,                 // 可选：触发价（价格到达某点才启动网格）
  autoStopOnBreakout: true,          // 可选：价格严重突破区间时自动停止网格
  rebalanceOnRangeShift: false       // 可选：区间改变时是否自动重构网格（视平台而定）
};
\`\`\`

---

## 📊 风险与注意事项：机器人≠无风险黑盒

\`\`\`javascript
const BINANCE_GRID_BOT_RISK_CONFIG = {
  MAX_CAPITAL_RATIO: 0.3,           // 单一平台网格策略不超过总资产 30%
  AVOID_ILLQUID_PAIRS: true,        // 避免在流动性差的小币种上使用网格
  PREFER_SPOT_FOR_BEGINNERS: true,  // 新手优先使用现货网格，暂避合约网格
  CHECK_FEE_LEVEL: true,            // 务必确认自己的手续费等级，手续费过高会吃掉网格利润
  DISABLE_DURING_EXTREME_EVENTS: true, // 极端行情/重大事件前后建议暂停或减仓
  USE_STOP_LOSS_FOR_FUTURES: true   // 合约网格务必设置总止损
};
\`\`\`

几个关键提醒：

1. **参数推荐 ≠ 风险评估**  
   - 币安可能提供“AI 参数建议”或“热门模板”；  
   - 这些更多是基于历史波动和当前市场的经验值，  
     不等于对你资金状况和风险承受能力的精准匹配。

2. **现货网格仍会深套**  
   - 若你在高位区间开启网格，  
   - BTC 一路向下跌出区间，  
   - 机器人只会“不断买入”，最终可能让你被深套。

3. **合约网格有爆仓风险**  
   - 使用杠杆做网格，本质上就是“在多次买卖中叠加杠杆风险”；  
   - 若价格单边极端走向某一侧，很容易被强平；  
   - 这不是网格逻辑的问题，而是杠杆本身的风险。

---

## 🎯 实战 Checklist（34.2）

### 1️⃣ 启动前准备

- [ ] 已理解网格原理，并对 34.1 策略有直观认知；  
- [ ] 已明确这次网格的目的：  
  - 是长期盘整收波动，还是短期博一段震荡行情；  
- [ ] 已确认：本次投入金额是你能接受波动与深套的风险预算。

### 2️⃣ 参数设定

- [ ] 仔细选择价格区间：  
  - 避免把网格区间完全设在近期高位；  
  - 适当留下下行安全空间；  
- [ ] 确定合适的网格数量和资金分配：  
  - 不必追求“极多格子”，先考虑手续费；  
- [ ] 若是合约网格：  
  - 杠杆尽量控制在 1-3 倍内（尤其是新手），  
  - 必须设置总止损线。

### 3️⃣ 启动与监控

- [ ] 启动网格后，先观察一段时间（1-3 天）表现；  
- [ ] 确认：  
  - 实际成交频率是否符合预期；  
  - 手续费是否占用过多利润；  
  - 是否需要调整区间或格子数。  

### 4️⃣ 退出与再设计

- [ ] 当价格明显离开你设定的逻辑区间时：  
  - 考虑停止网格并整体平仓或部分平仓；  
- [ ] 当网格累计带来可观收益时：  
  - 可以分阶段止盈与重新构造新网格；  
- [ ] 不要“永远不开关”的盲目挂机，  
  把机器人当作“永动机理财”。

---

## ✅ 小结

**币安网格机器人**的定位是：

- 帮你减少“重复下单、频繁挂撤单”的机械工作；  
- 把网格逻辑以图形化和模版化的方式呈现出来；  

但它不能替你做的事有：

- 判断 BTC 的中期区间和趋势；  
- 决定何时该停、何时该换区间；  
- 为你的亏损负责。  

在你的「衍生品策略 (Derivatives Strategies) / grid-trading」模块中：

- 34.1 更偏“思想与原理层”的 BTC 现货网格；  
- 34.2 则是“实战工具层”的币安网格机器人，用于快速落地执行。  

两者配合，你可以：

1. 先在纸面或本地脚本中试验和理解网格参数；  
2. 再在币安上用机器人做小额、分阶段的实盘；  
3. 随着策略库和经验增长，再逐步引入：  
   - 合约网格  
   - 跨平台网格  
   - 动态网格（根据波动/趋势自动调整区间和格子）。  

---

`
};

/**
 * 上传 34.1 & 34.2 策略到 Directus
 */
async function uploadStrategies() {
  const DIRECTUS_URL = 'http://localhost:8055';

  console.log(
    '开始上传策略 34.1 (BTC 现货网格交易) 和 34.2 (币安网格机器人)...\n'
  );

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

    console.log('上传策略 34.1: BTC 现货网格交易...');
    await axios.post(`${DIRECTUS_URL}/items/strategies`, STRATEGY_34_1, {
      headers
    });
    console.log('✅ 策略 34.1 上传成功\\n');

    console.log('上传策略 34.2: 币安网格机器人...');
    await axios.post(`${DIRECTUS_URL}/items/strategies`, STRATEGY_34_2, {
      headers
    });
    console.log('✅ 策略 34.2 上传成功\\n');

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

// 若要在 Node 中直接执行本文件写入策略，请取消下面一行注释：
uploadStrategies();
