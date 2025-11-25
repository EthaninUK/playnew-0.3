// 策略 33.7 & 33.8: 波动率交易与 VIX 组合 (volatility-strategies)

const axios = require('axios');

/**
 * 33.7 历史波动率 vs 隐含波动率
 * 当 IV（隐含波动率）远高于 HV（历史波动率）时卖出期权，反之买入。
 */
const STRATEGY_33_7 = {
  title: '历史波动率 vs 隐含波动率 - 用“波动率错价”做期权买卖的节奏器',
  slug: 'historical-vs-implied-volatility-arbitrage',
  summary:
    '把“历史波动率（HV）”和“隐含波动率（IV）”当成两条温度曲线：HV 记录的是市场过去实际走了多抖，而 IV 代表市场现在愿意为“未来不确定性”付多少钱。当 IV 显著高于 HV 时，说明“保险费太贵”——倾向做卖方（卖出期权、铁鹰、宽跨等）；当 IV 显著低于 HV 时，说明“保险费偏便宜”——倾向做买方（买入跨式、宽跨、日历价差等）。核心不是预测涨跌，而是“只在波动率错价明显时出手”。',
  category: 'volatility-trading',
  category_l1: 'derivatives',
  category_l2: 'options-volatility',
  risk_level: 4,
  apy_min: 15,
  apy_max: 80,
  min_investment: 2000,
  time_commitment: '每周 3-8 小时（监控波动率、调整仓位、复盘）',
  status: 'published',
  content: `# 历史波动率 vs 隐含波动率 - 用“波动率错价”做期权买卖的节奏器

## 💰 策略概览

| 参数 | 数值 |
|------|------|
| **适用标的** | BTC、ETH 及主流股指/大盘 ETF（有成熟期权市场的资产） |
| **起始资金** | $2,000 - $50,000（更适合中等以上资金） |
| **时间投入** | 每周 3-8 小时：数据更新 + 盘后复盘 + 调整仓位 |
| **预期收益** | 15-80% 年化（高度依赖执行纪律与风控） |
| **风险等级** | ⚠️⚠️⚠️⚠️ 较高 (4/5)，尤其是做卖方时有尾部风险 |
| **难度等级** | 中高级（需要理解期权、波动率、价差组合） |
| **核心能力** | 看懂 IV/HV 结构，按“波动率错价”决定买还是卖，而不是凭感觉 |

---

## 📖 开场故事：同样是做 BTC 期权，有人盯盘，有人盯“波动率温度计”

Leo 和 Ken 都在做 BTC 期权。

- **Ken 的玩法**：  
  - 主要看 K 线和“感觉”，涨多了就卖看涨，跌多了就卖看跌；  
  - 有时赚得很爽，有时遇到单边行情被爆锤；  
  - 最大问题：**没有统一的开仓/减仓标准**，更像情绪化交易。

- **Leo 的玩法：波动率驱动**  
  - 每天只看几件事：  
    1. 这几天 BTC 实际波动了多少？（历史波动率 HV）  
    2. 期权市场现在给出的隐含波动率 IV 是多少？  
    3. IV 和 HV 的差异，处于他预先定义的“高估/低估区间”的哪里？  
  - 当 IV 远高于 HV（比如高 10-20 个波动率点）：  
    - 不急着抄底或追高，而是**卖出有限风险的期权组合**（铁鹰/价差）；  
  - 当 IV 显著低于 HV：  
    - 不去卖保险，而是**买入方向中性或轻方向的期权组合**（跨式、宽跨、日历等）。

一年下来，两人总结：

- Ken 的交易 PnL 像过山车：某几个月暴赚，某几个月回撤巨大。  
- Leo 的权益曲线更像“有波动但整体向上的斜坡”：  
  - 大部分时候只是**按自己的波动率模型在“卖高买低”**；  
  - 真正大行情来时，会用“买波动”的仓位去对冲“卖波动”的暴露。

**他们最大的差别不在于谁更聪明，而在于：  
一个靠感觉做期权，另一个靠“波动率温度计”做节奏。**

---

## 🧠 核心概念：什么是 HV & IV？

### 1. 历史波动率（HV, Historical Volatility）

- 只看“已经发生的价格路径”，  
- 常见的计算方式：用过去 N 天收盘价计算对数收益率的标准差，年化后得到一个百分比。  
- 表达的是：**过去一段时间，这个标的平均每天抖多厉害**。

例如：  
- BTC 过去 30 天的 HV = 40%（年化）  
- 意味着：  
  - 年化层面，价格波动大致在“每年 ±40% 的波动区间”这个量级（只是统计上的刻画，不是保证）。

### 2. 隐含波动率（IV, Implied Volatility）

- 由**期权价格倒推出来的“未来波动预期”**；  
- 如果大家愿意为期权支付很高的价格，说明市场预期未来很不稳定 → IV 高；  
- 如果期权价格便宜，说明市场预期未来相对平稳 → IV 低。

**简单理解：**

- HV：\`过去事实\` → 实际价格抖动纪录；  
- IV：\`现在的价格\` → 所隐含的未来不确定性报价。

---

## 📊 策略核心：只在“错价明显”时做决定

### 波动率错价的直观版本

- 当 **IV ≫ HV + 安全阈值** 时：  
  - 市场为了某种不确定性，付出了非常高的“保险费”；  
  - 若你认为这份不确定性被“夸大了”（或你有对冲手段），  
  - 则适合做 **卖方**：

    - 卖出宽跨式（Short Strangle），但要控制仓位与止损；  
    - 卖出铁鹰（Iron Condor），用价差锁定最大亏损；  
    - 卖出看涨/看跌价差（Call/Put Credit Spread）等。

- 当 **IV ≪ HV - 安全阈值** 时：  
  - 期权很便宜，市场对未来波动“过于乐观或麻木”；  
  - 若你认为真实波动不会这么小，  
  - 则适合做 **买方**：

    - 买入跨式（Long Straddle）；  
    - 买入宽跨（Long Strangle）；  
    - 买入日历价差（Calendar Spread）等。

### 典型的判断框架

你可以定义一套简单而机械的规则，例如：

- 计算 30 天 HV（HV30）和主力近月期权的 IV（IV30）；  
- 计算 \`IV30 - HV30\` 的差值和比值：

\`\`\`
差值 = IV30 - HV30
比值 = IV30 / HV30
\`\`\`

- 若：

\`\`\`
差值 ≥ 10 个波动率点 且 比值 ≥ 1.3
=> 判定为“高 IV 区”，优先考虑卖方策略；

差值 ≤ -8 个波动率点 且 比值 ≤ 0.8
=> 判定为“低 IV 区”，优先考虑买方策略。
\`\`\`

你甚至可以给自己画一个“波动率打分表”：

| 区间 | 条件 | 推荐方向 |
|------|------|----------|
| 极低 IV | IV30 / HV30 < 0.7 | 强烈偏向买方（适度加大买波动仓位） |
| 低 IV | 0.7 ≤ IV30 / HV30 < 0.9 | 偏向买方（轻仓参与或买保护） |
| 中性 | 0.9 ≤ IV30 / HV30 ≤ 1.2 | 不做纯波动策略，更多参考其他信号 |
| 高 IV | 1.2 < IV30 / HV30 ≤ 1.5 | 偏向卖方，但建议用有限风险结构（铁鹰/价差） |
| 极高 IV | IV30 / HV30 > 1.5 | 明显卖方区，但必须搭配保护腿和严格仓位限制 |

---

## 🔍 子策略拆分：三类常用组合

### 模式 A：IV 高估时的“有限风险卖方”

> 每次只吃部分“高保费”，但用价差结构锁住最大亏损。

- 工具：  
  - 信用价差（Call/Put Credit Spread）  
  - 铁鹰（Iron Condor）  
  - 远 OTM 宽跨卖方（但要配保护腿）

- 操作例子（简化）：  

  1. BTC 当前价格：\$60,000  
  2. HV30 ≈ 40%，IV30 ≈ 70%（IV 远高于 HV）  
  3. 你选择卖出：  
     - 卖出 1 张 \$68k 看涨期权  
     - 买入 1 张 \$72k 看涨期权（保护腿）  
     - 这就是一个 Call Credit Spread，上行最大亏损有限。  
  4. 同时，在下方用同样方式构建 Put Credit Spread，  
     - 组合成一个**铁鹰**，整体收取权利金。

- 核心思想：  
  - 不奢望吃掉所有时间价值，  
  - 只要市场波动不达到极端值，就能把部分高估的“保险费”收入囊中；  
  - **在极端行情来临时，最大亏损是可控的。**

---

### 模式 B：IV 低估时的“方向中性买波动”

> 不预测涨跌，只赌“之后的实际波动会高于市场当前预期”。

- 工具：  
  - 跨式（Long Straddle）  
  - 宽跨（Long Strangle）  
  - 日历价差（Calendar Spread）

- 操作例子：

  1. BTC 当前价格：\$60,000  
  2. HV30 ≈ 60%，IV30 ≈ 35%（IV 远低于历史波动）  
  3. 你可以：  
     - 买入同一到期日的看涨 + 看跌期权（平值附近）；  
     - 或者买入略微 OTM 的宽跨，降低权利金成本。  
  4. 如果后续 BTC 真正的波动延续了过去的“高抖动”风格：  
     - 无论向上爆拉还是向下暴跌，只要幅度足够大，  
     - 就有机会通过对冲（如滚动平仓一边、保留另一边）实现盈利。

- 核心思想：  
  - 当市场给期权定了一个“很温和的未来”，  
  - 而真实世界却仍然在剧烈摇晃时，  
  - 买方是有显著的“期望优势”的。

---

### 模式 C：波动率均值回归 + 分批建仓

> 把 IV 当成一个会围绕“均值”上下摆动的指标，用分批方式进行做多/做空。

- 建一个你自己的“IV 均值回归模型”：  
  - 例如：过去 250 个交易日的 IV30 均值与标准差；  
  - 当 IV 超过均值 + 1.5 倍标准差 → 认为高估；  
  - 当 IV 低于均值 - 1.5 倍标准差 → 认为低估。

- 操作方式：  
  - **不要一口气全仓**，而是采用分批建仓：  

\`\`\`
例：IV 逐步升高的场景（做卖方）

IV30 刚刚进入“高估”区：卖 1 份铁鹰；
IV30 再抬高 5 个点：再卖 1 份，或加一个信用价差；
IV30 到极端值：不再加仓，只考虑防守与滚动。
\`\`\`

  - 当 IV 开始回落到中性区附近时，逐步减仓和止盈。

---

## 🛠️ 波动率扫描脚本示意（伪代码）

> 注意：这里只是一个框架，实际使用时需要接入真实交易所/期权数据源。

\`\`\`javascript
class IvHvScanner {
  constructor(options = {}) {
    this.asset = options.asset || 'BTC';
    this.hvWindow = options.hvWindow || 30; // HV 计算窗口（30 天）
    this.ivTenorDays = options.ivTenorDays || 30; // 关注的 IV 对应到期天数
    this.highIvThreshold = options.highIvThreshold || 0.1; // IV - HV 高估绝对阈值
    this.lowIvThreshold = options.lowIvThreshold || -0.08; // IV - HV 低估绝对阈值
    this.highIvRatio = options.highIvRatio || 1.3;
    this.lowIvRatio = options.lowIvRatio || 0.8;
  }

  /**
   * 获取历史价格数据（收盘价）
   * 真实环境中可以对接 CEX K 线 API 或链上预言机
   */
  async fetchHistoricalPrices() {
    // TODO: 替换为真实的数据源
    // 这里只是示意：返回最近 hvWindow + 5 天的收盘价
    return [ /* prices array */ ];
  }

  /**
   * 获取当前期权市场的 IV 数据
   * 可以选取“近月平值期权”的 IV 作为代表
   */
  async fetchCurrentIv() {
    // TODO: 替换为真实 API
    // 示例返回：0.6 => 60% 年化
    return 0.6;
  }

  /**
   * 根据历史价格计算 HV
   */
  calcHv(prices) {
    if (!prices || prices.length < this.hvWindow + 1) {
      throw new Error('价格数据不足以计算 HV');
    }

    // 取最近 hvWindow + 1 个数据计算对数收益率
    const slice = prices.slice(-1 * (this.hvWindow + 1));
    const returns = [];

    for (let i = 1; i < slice.length; i++) {
      const r = Math.log(slice[i] / slice[i - 1]);
      returns.push(r);
    }

    // 计算标准差
    const mean =
      returns.reduce((acc, x) => acc + x, 0) / (returns.length || 1);
    const variance =
      returns.reduce((acc, x) => acc + Math.pow(x - mean, 2), 0) /
      (returns.length || 1);
    const dailyVol = Math.sqrt(variance);

    // 年化（假设一年 252 交易日）
    const annualVol = dailyVol * Math.sqrt(252);
    return annualVol;
  }

  /**
   * 综合扫描：给出当前资产的 HV、IV 与建议方向
   */
  async scan() {
    const prices = await this.fetchHistoricalPrices();
    const hv = this.calcHv(prices); // 例如 0.4 => 40%
    const iv = await this.fetchCurrentIv(); // 例如 0.7 => 70%

    const diff = iv - hv;
    const ratio = hv > 0 ? iv / hv : null;

    let zone = 'neutral';
    let suggestion = '保持中性，不基于波动率单独采取大仓位动作。';

    if (ratio !== null) {
      if (diff >= this.highIvThreshold && ratio >= this.highIvRatio) {
        zone = 'high_iv';
        suggestion =
          'IV 显著高于 HV，优先考虑有限风险卖方策略（如铁鹰、信用价差），严格控制仓位与极端行情风险。';
      } else if (diff <= this.lowIvThreshold && ratio <= this.lowIvRatio) {
        zone = 'low_iv';
        suggestion =
          'IV 明显低于 HV，期权偏便宜，可考虑买入跨式/宽跨/日历价差等方向中性买方策略。';
      }
    }

    return {
      asset: this.asset,
      hv,
      iv,
      diff,
      ratio,
      zone,
      suggestion
    };
  }

  printResult(result) {
    console.log('📊 波动率扫描结果:');
    console.log(\`标的: \${result.asset}\`);
    console.log(\`HV(年化): \${(result.hv * 100).toFixed(2)}%\`);
    console.log(\`IV(年化): \${(result.iv * 100).toFixed(2)}%\`);
    console.log(
      \`差值(IV - HV): \${((result.diff || 0) * 100).toFixed(2)}%\`
    );
    if (result.ratio != null) {
      console.log(
        \`比值(IV / HV): \${result.ratio.toFixed(2)}\`
      );
    }
    console.log(\`建议: \${result.suggestion}\`);
  }
}

// 使用示例：
// const scanner = new IvHvScanner();
// scanner.scan().then((res) => scanner.printResult(res)).catch(console.error);
\`\`\`

---

## 📊 风控与仓位管理：避免“卖波动卖到破产”

做 IV/HV 策略时，尤其要关注 **尾部风险** 与 **杠杆积累**。

\`\`\`javascript
const IV_HV_RISK = {
  MAX_SHORT_VOL_RATIO: 0.3,       // 与总净资产相比，卖方（短 Vega）组合权益占比不超过 30%
  MAX_SINGLE_UNDERLYING_RATIO: 0.15, // 单一标的的波动率策略不超过总净资产 15%
  MAX_LEVERAGE: 2,                // 综合杠杆控制在 2x 以内
  LONG_VOL_HEDGE_RATIO: 0.3,      // 在高 IV 卖方组合下，至少保留 30% 规模的长 Vega 仓位或其他对冲
  MAX_HOLDING_DAYS_SHORT: 30,     // 高 IV 卖方策略单次持仓不超过 30 天
  MAX_HOLDING_DAYS_LONG: 45,      // 低 IV 买方策略单次持仓不超过 45 天
  STOP_LOSS_VOL_SPIKE: 0.25       // 若 IV 在短时间内暴涨超过 25 波动率点，触发缩减卖方仓位检查
};
\`\`\`

核心原则：

1. **永远不要只剩卖方，没有任何长 Vega 或对冲**；  
2. 在极端行情来临时，要允许自己“认亏平仓”一部分卖方组合；  
3. 所有“无限风险策略”（裸卖、无保护腿）都要极度克制甚至禁止。

---

## 🎯 实战 Checklist

### 1️⃣ 搭建你的“波动率仪表盘”

- [ ] 选定 1-3 个主要交易标的（如 BTC/ETH/某大盘指数）；  
- [ ] 定义 HV 计算窗口（如 20/30/60 天）；  
- [ ] 为每个标的设定“高 IV 区 / 低 IV 区”的阈值；  
- [ ] 找到至少一个可以稳定获取 IV/HV 数据的来源（API 或手动表格）。

### 2️⃣ 写下机械化规则

- [ ] 明确什么时候可以考虑卖方、什么时候可以考虑买方；  
- [ ] 定义每一类策略的：  
  - 最大仓位、最大持仓天数、止盈/止损条件；  
- [ ] 把这些写入简单的 SOP 文档，而不是留在脑子里。

### 3️⃣ 先小资金、轻仓试运行

- [ ] 先用很小的仓位（例如计划规模的 20-30%）跑 1-3 个月；  
- [ ] 严格记录每一笔交易的：  
  - 开仓时的 HV/IV，  
  - 使用的具体组合，  
  - 实际盈亏与回撤；  
- [ ] 只在确认模型能帮你“显著减少情绪化交易”后，再逐步加仓。

### 4️⃣ 定期复盘与迭代

- [ ] 每月至少复盘一次：  
  - 哪些交易是“明明知道 IV 很高/很低仍然逆势而为”；  
  - 哪些时候是“信号有效但没敢下手”；  
- [ ] 不断优化阈值和仓位规则，但**不要频繁改模型**，给模型足够样本期。

---

## ✅ 小结

**“HV vs IV 策略”不是让你成为波动率学家，而是让你有一个“理性节奏器”。**

- 当市场为未来恐慌支付非常高的价格时，  
  - 你可以用有限风险的卖方组合，扮演“卖保险公司”；  
- 当市场对未来过于乐观或麻木时，  
  - 你可以适度买入“被低估的保险”。

这套方法的真正价值在于：

> 让你**有标准、可复现**地决定何时卖波动、何时买波动，  
> 而不是在巨震与无聊之间，被情绪来回推动。

---
`
};

/**
 * 33.8 VIX 期货期权组合
 * 使用波动率期货和期权组合，对冲黑天鹅风险或投机市场恐慌。
 */
const STRATEGY_33_8 = {
  title: 'VIX 期货期权组合 - 用“恐慌指数”做黑天鹅保险与情绪交易',
  slug: 'vix-futures-options-combo',
  summary:
    '围绕 VIX（或类似波动率指数）的期货与期权，构建“一桶黑天鹅保险”和“情绪交易组合”：在平静期用少量资金买入 VIX 远月/深 OTM 期权，对冲股指或风险资产的极端下跌；在极度恐慌期（VIX 飙升时），利用期货反套或卖出高溢价 VIX 期权，博弈市场情绪的均值回归。核心是：清楚自己在对冲什么、赌什么，以及在何种条件下退出。',
  category: 'volatility-trading',
  category_l1: 'derivatives',
  category_l2: 'vix-hedging',
  risk_level: 4,
  apy_min: 10,
  apy_max: 200,
  min_investment: 3000,
  time_commitment: '每周 2-6 小时（观察情绪、管理对冲和仓位）',
  status: 'published',
  content: `# VIX 期货期权组合 - 用“恐慌指数”做黑天鹅保险与情绪交易

> 注：这里以 VIX 为代表，实际在币圈可类比使用诸如“BVOL、ETHVOL、隐含波指数期货”等产品，只要标的本质是“波动率/恐慌指数”即可。

---

## 💰 策略概览

| 参数 | 数值 |
|------|------|
| **适用市场** | 有 VIX 或类 VIX 波动率指数期货/期权的市场（传统或加密） |
| **主要用途** | 1）为风险资产组合做黑天鹅保护；2）交易市场情绪的极端值与均值回归 |
| **起始资金** | $3,000 - $100,000（对专业资金也非常常见） |
| **时间投入** | 每周 2-6 小时（多是观察与复盘） |
| **预期收益** | 10-200% 年化（极端行情时“保险”可能爆发；平时小亏或小赚） |
| **风险等级** | ⚠️⚠️⚠️⚠️ 较高 (4/5)，需要严格仓位与“保险预算”概念 |
| **适合人群** | 已有股票/指数/加密大仓，且愿意用小比例资金做对冲或情绪交易的玩家 |

---

## 📖 开场故事：平静时期买保险，暴风雨里靠保险活下来

Ada 是一名偏长期的指数投资者，  
她的主要仓位是：

- 美股宽基指数 ETF（或大盘股组合）；  
- 币圈里也有一部分 BTC/ETH 长期持有。

2020 年和 2022 年的剧烈回撤，让她发现一个残酷事实：

> “牛市赚来的，很容易在一次极端下跌里吐回去。”

于是她开始研究 VIX 期货期权，希望能做到：

1. **牛市/平静期**：  
   - 不一定赚更多钱，但用少量成本买一些“黑天鹅保险”；  
2. **极端恐慌期**：  
   - 当 VIX 暴涨时，通过事先买好的保险获得一笔对冲收益，  
   - 这笔收益可以用来缓冲股指/BTC 仓位的浮亏。

后来她又发现：

- 在极度恐慌时（例如 VIX > 40-50），  
  - 市场常常已经非常悲观，  
  - 这时**适度卖出 VIX 期权或做 VIX 期货反套**，  
  - 往往是押注“恐慌回归正常”的高赔率交易。

这就是一个典型的 VIX 组合思路：

> 平静时买少量“黑天鹅彩票”；  
> 恐慌时卖高价“恐慌溢价”；  
> 把自己从单纯多头变成一个“会利用恐慌曲线”的玩家。

---

## 🧠 VIX 与类 VIX 指数的直觉理解

### 1. VIX 是什么？

- VIX 是美国标普 500 指数期权隐含波动率推导出的“30 天预期波动率指标”；  
- 可以粗略理解为：  
  > “未来 30 天，市场预期标普 500 每年的波动率大概是多少。”

例如：

- VIX = 20 → 市场认为未来波动“比较正常”；  
- VIX = 40 → 市场认为未来 30 天不太平，很可能出现较大波动；  
- VIX > 60 → 通常只有在极端恐慌时出现（金融危机、疫情初期等）。

### 2. 类 VIX 指数在加密市场中的类比

在币圈，你可能会遇到：

- 某些交易所推出的 **BTC 波动率指数（BVOL）**；  
- **ETH 波动率指数**；  
- 直接可以交易的“波动率期货/期权”。

本质类似：

- 标的不是价格本身，而是“隐含波动率/恐慌程度”；  
- 当大家非常害怕时，这些指数会飙升；  
- 当大家麻木或过于乐观时，这些指数会回落到低位。

---

## 🧩 子策略拆分：三大玩法

### 模式 A：长期持有组合的“黑天鹅保险桶”

> 用极少部分资金，定期买入远月 VIX 或类 VIX 看涨期权/价差，  
> 目标不是常赚，而是在极端事件中“爆发”来抵消其他仓位损失。

- 典型做法：

  1. 每个月用账户净值的 0.5-1% 资金，  
     - 购买 VIX 或类 VIX 的看涨期权（或看涨价差），  
     - 到期时间可以选择 1-3 个月的中远月。  

  2. 这部分仓位单独记账，称为“灾难保险桶”；  
  3. 大部分时间，这个桶可能小亏或归零；  
  4. 当遇到真正的黑天鹅/极端恐慌时：  
     - VIX 从 15-20 飙升到 40-70，  
     - 看涨期权或价差可能实现数倍甚至十倍收益，  
     - 这笔钱刚好可以补上股票/BTC 长期仓位的浮亏部分。

- 关键点：  
  - 把这部分成本视为**“保险费”**而不是投机成本；  
  - 不指望每个月都赚钱，而是指望在极端事件时提供保护。

---

### 模式 B：恐慌极值时的“情绪反向交易”

> 当恐慌已经极端（VIX>40-50、类 VIX 飙升）时，  
> 适度做空 VIX 或卖出高价 VIX 看涨期权，  
> 押注“恐慌慢慢冷却”。

- 典型方式：

  - 做空 VIX 期货远月合约；  
  - 卖出 VIX 看涨期权（最好用价差形式：Call Credit Spread）；  
  - 或者构建“反向 VIX ETF”的多头仓位。

- 逻辑基础：

  - VIX 是“均值回归”非常明显的一个指标：  
    - 长期平均在 15-20 区间附近；  
    - 极端恐慌时会蹿到 40、60、80；  
    - 但不可能长期维持在极端高位。  
  - 恐慌越极端，未来回归的概率越大，但短期爆发风险仍很高。

- 风控重点：

  - **不能全仓梭哈做空恐慌**，否则极端极端再极端时会承受巨大浮亏；  
  - 通常采用分批建仓 + 期权价差结构来限制最大风险；  
  - 在恐慌开始回落、VIX 回到某一阈值下方时，分批止盈离场。

---

### 模式 C：股指/BTC 仓位 + VIX 组合对冲结构

> 通过股指/风险资产仓位与 VIX 仓位的组合，  
> 尝试做到“在慢牛或震荡中赚股指的钱，在黑天鹅中靠 VIX 保险减少回撤”。

- 简化模型例子：

  1. 你持有 \$100,000 等值的股指/BTC 长期多头；  
  2. 每月用其中 1%（\$1,000）购买 VIX 看涨价差：  
     - 比如：买入 VIX 30 看涨，卖出 VIX 50 看涨（Call Spread）；  
  3. 平静时，这 \$1,000 可能归零或小亏；  
  4. 遇到极端下跌时，VIX 突破 40-50：  
     - 这个看涨价差可能价值 \$5,000-10,000，  
     - 相当于在整体账户大回撤时给了你一笔“现金缓冲”。

- 更精细玩法：

  - 可以根据回测，估算“股指跌 X% 时 VIX 大致会上涨多少”；  
  - 设计一个大致的对冲比例，例如：  
    - 每 \$50,000 股指多头，对应 \$500-700 的 VIX 期权保险预算；  
  - 长期下来，把这部分视为一种“系统性防御开销”。

---

## 🛠️ VIX 组合管理脚本示意（框架）

> 下面的代码更偏向“思路模板”：  
> 把 VIX 水平划分为不同区间，在区间内采取不同策略指令。

\`\`\`javascript
class VixStrategyEngine {
  constructor(config = {}) {
    this.lowThreshold = config.lowThreshold || 15;     // 平静区下限
    this.normalThreshold = config.normalThreshold || 25; // 正常偏高区
    this.highThreshold = config.highThreshold || 35;  // 高恐慌区
    this.extremeThreshold = config.extremeThreshold || 45; // 极端恐慌区

    this.maxInsuranceBudgetRatio =
      config.maxInsuranceBudgetRatio || 0.02; // 每月用于保险的资金占净资产比例
    this.maxShortVixRatio =
      config.maxShortVixRatio || 0.1; // 与净资产相比，做空 VIX/卖出 VIX 看涨的风险敞口上限
  }

  /**
   * 获取当前 VIX（或类 VIX 指数）数值
   */
  async fetchCurrentVix() {
    // TODO: 替换为真实数据源
    return 18; // 示例：18
  }

  /**
   * 根据账户净资产和当前 VIX 水平，给出策略指令概要
   */
  async decide(netAssetValue) {
    const vix = await this.fetchCurrentVix();

    const instructions = [];
    let mode = 'neutral';

    if (vix < this.lowThreshold) {
      mode = 'very_calm';
      instructions.push(
        '市场极度平静，可考虑用不超过净资产 0.5-1% 的资金购买远月 VIX 看涨期权/看涨价差，作为“黑天鹅保险”。'
      );
    } else if (vix >= this.lowThreshold && vix < this.normalThreshold) {
      mode = 'calm';
      instructions.push(
        '市场处于相对平静偏正常区间，可适度维持或小幅加仓“黑天鹅保险”，但不宜过度。'
      );
    } else if (vix >= this.normalThreshold && vix < this.highThreshold) {
      mode = 'elevated';
      instructions.push(
        '市场恐慌开始升温，可检查你的 VIX 保险仓位是否已经获利，视情况部分止盈，同时谨慎评估是否还有必要继续加保险。'
      );
    } else if (vix >= this.highThreshold && vix < this.extremeThreshold) {
      mode = 'high_fear';
      instructions.push(
        '市场恐慌较高，若之前已持有 VIX 看涨期权，可考虑分批止盈；若想反向交易，可用非常小仓位尝试做空 VIX 期货或卖出 VIX 看涨价差，但要预留更极端恐慌空间。'
      );
    } else {
      mode = 'extreme_fear';
      instructions.push(
        '市场处于极端恐慌区（黑天鹅或接近黑天鹅），严禁梭哈做空 VIX；如要反向操作，只能用极小仓位配合严格止损；同时加大对股指/风险资产仓位的风险评估。'
      );
    }

    const maxInsuranceBudget =
      netAssetValue * this.maxInsuranceBudgetRatio;
    const maxShortVixExposure =
      netAssetValue * this.maxShortVixRatio;

    return {
      vix,
      mode,
      maxInsuranceBudget,
      maxShortVixExposure,
      instructions
    };
  }

  printPlan(plan) {
    console.log('📈 当前 VIX/恐慌指数水平: ', plan.vix);
    console.log('模式: ', plan.mode);
    console.log(
      '建议本月用于“黑天鹅保险”的最大预算: $',
      plan.maxInsuranceBudget.toFixed(2)
    );
    console.log(
      '建议做空 VIX/卖出 VIX 看涨的最大风险敞口: $',
      plan.maxShortVixExposure.toFixed(2)
    );
    console.log('策略提示:');
    plan.instructions.forEach((line) => console.log('- ' + line));
  }
}

// 使用示例：
// const engine = new VixStrategyEngine({});
// engine.decide(50000).then((plan) => engine.printPlan(plan)).catch(console.error);
\`\`\`

---

## 📊 风控参数：把“保险费”和“赌命”区分开

\`\`\`javascript
const VIX_RISK_CONTROL = {
  MAX_INSURANCE_RATIO: 0.02,        // “黑天鹅保险”年度总成本不超过净资产的 2%
  MAX_SHORT_VIX_RATIO: 0.1,         // 做空 VIX 或卖出 VIX 期权的风险敞口不超过净资产 10%
  MAX_SINGLE_VIX_TENOR_RATIO: 0.05, // 单一到期月份的 VIX 仓位不超过净资产 5%
  VIX_EXTREME_LEVEL: 45,            // 超过此恐慌水平后，禁止再增加做空 VIX 的仓位
  ROLLING_CHECK_DAYS: 5             // 每 5 天至少检查一次 VIX 仓位与标的仓位的匹配关系
};
\`\`\`

关键心法：

1. **保险预算是刚性约束**：  
   - 不要把“买黑天鹅保险”当成无限叠加的乐透票；  
   - 一年花 2% 净值在保险上已经很多了。  

2. **做空 VIX 时只许“小赌怡情”**：  
   - 恐慌可能比你想象的更极端、更久；  
   - 做空恐慌往往是高赔率，但也有“极端爆仓”的风险。  

3. **记住你真正想要的是什么**：  
   - 大部分玩家是想“降低整体回撤”，而不是“靠 VIX 一夜暴富”；  
   - 当你把目标搞清楚后，仓位决策会保守很多。

---

## 🎯 实战 Checklist

### 1️⃣ 定义你的 VIX 使用目的

- [ ] 我是为了对冲股票/加密长期多头的尾部风险？  
- [ ] 还是主要为了交易恐慌情绪本身？  
- [ ] 或两者都有，但优先级是什么？

### 2️⃣ 写下保险与投机的预算

- [ ] 明确定义：  
  - 每月用于“黑天鹅保险”的预算 = 净资产 X%；  
  - 每月用于“恐慌情绪交易”的最大风险敞口 = 净资产 Y%；  
- [ ] 把这些数字写下来，坚决不突破。

### 3️⃣ 建立“VIX 日记”

- [ ] 每次重大加仓/减仓，都记录当时的：  
  - VIX 水平、股指/BTC 位置、你当时的理由；  
- [ ] 每季度回头看：  
  - 有多少决策是“恐慌跟风”而不是“系统决策”；  
  - 哪些操作是真正起到了对冲或盈利效果。

### 4️⃣ 知道什么时候“不要动”

- [ ] 当 VIX 在正常区间晃荡时（例如 18-25）：  
  - 不要频繁去交易 VIX，  
  - 把时间精力更多放在标的本身（基本面、结构、趋势）上；  
- [ ] 把 VIX 看成一个“极端情绪工具”，  
  - 平时只是观察，  
  - 真正出手的机会，一年也许就那么几次。

---

## ✅ 小结

**VIX 期货期权组合的价值在于：  
帮你把“情绪曲线”也纳入可交易、可对冲的范畴。**

- 平静时，你可以用小额成本买一些“末日保险”；  
- 恐慌极端时，你可以适度卖掉过高的恐慌溢价；  
- 长期下来，它会让你的整体资产曲线 **更有弹性、更抗极端事件**。

这不是一条“人人必做”的策略线，  
但对任何已经有大额风险资产持仓的人来说，  
理解并适度运用 VIX/类 VIX 工具，  
会显著提升你对“波动和恐慌”的掌控感。

---
`
};

/**
 * 上传 33.7 和 33.8 策略到 Directus
 */
async function uploadStrategies() {
  const DIRECTUS_URL = 'http://localhost:8055';

  console.log('开始上传策略 33.7 和 33.8...\n');

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

    // 上传策略 33.7
    console.log('上传策略 33.7: 历史波动率 vs 隐含波动率...');
    await axios.post(`${DIRECTUS_URL}/items/strategies`, STRATEGY_33_7, {
      headers
    });
    console.log('✅ 策略 33.7 上传成功\\n');

    // 上传策略 33.8
    console.log('上传策略 33.8: VIX 期货期权组合...');
    await axios.post(`${DIRECTUS_URL}/items/strategies`, STRATEGY_33_8, {
      headers
    });
    console.log('✅ 策略 33.8 上传成功\\n');

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
