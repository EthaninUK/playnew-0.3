// 策略 30.5 和 30.6: 期权到期日 Gamma 挤压 + 调费与规则切换套利

const axios = require('axios');

/**
 * 30.5 期权到期日 Gamma 挤压
 */
const STRATEGY_30_5 = {
  title: '期权到期日 Gamma 挤压 - 利用未平仓合约与做市对冲的价格挤压',
  slug: 'options-expiry-gamma-squeeze-arbitrage',
  summary:
    '围绕期权到期日前后的 Gamma 挤压效应，在关键执行价附近提前布局现货或合约头寸，配合做市商被迫对冲行为，捕捉短期价格被“吸附”或“被迫拉抬/打压”的结构性机会。适合熟悉期权 Greeks、会看 OI 分布与成交数据的中高级玩家。',
  category: 'structural-event-arbitrage',
  category_l1: 'arbitrage',
  category_l2: 'structural-event-arbitrage',
  risk_level: 4,
  apy_min: 20,
  apy_max: 120,
  min_investment: 5000,
  time_commitment: '每周 4-10 小时（大多集中在月度/季度到期周）',
  status: 'published',
  content: `# 期权到期日 Gamma 挤压 - 利用未平仓合约与做市对冲的价格挤压

## 💰 策略概览

| 参数 | 数值 |
|------|------|
| **起投资金** | $5,000 - $100,000（更高资金更容易分散风险） |
| **时间投入** | 每周 4-10 小时，主要集中在月度/季度到期周 |
| **预期年化收益** | 20-120%（高度依赖事件频率与执行纪律） |
| **风险等级** | ⚠️⚠️⚠️⚠️ 中高 (4/5) |
| **难度等级** | 高级（需理解 Greeks 和对冲逻辑） |
| **适合人群** | 会用期权、懂一点 Delta / Gamma / Vega，并习惯看 OI 分布图表的玩家 |

---

## 📖 开场故事：一次“小资金 Gamma 挤压”带来的 3 天 35% 收益

交易者 Iris 专门研究比特币期权。她有一个固定仪式：

- 每周看一遍 BTC 全曲线的期权未平仓合约（Open Interest，简称 OI）  
- 尤其关注**月度到期日**和**季度到期日**前的 OI 分布  
- 她常说：  
  > “我不预测宏观，只做‘别人有被逼着动手的时候’。”

某次 BTC 月度期权到期前 5 天，她发现：

- 当月到期的期权，在 **40,000 美金附近**的执行价上，存在一个异常大的 **Call OI 高峰**  
- 进一步拆解 OI 结构，她判断这些 Call 大概率是：
  - 很多卖方集中在 40k 附近卖出看涨期权收权利金  
  - 做市商为了对冲风险，需要在价格靠近 40k 时大量买入现货/合约

在到期前的 3 天，BTC 现货价格一直在 **38,800 – 39,500** 区间反复震荡。  
Iris 的想法是：

> “如果市场在到期前被某些力量推近 40k，就有可能触发一轮 Gamma 挤压：做市商被迫加速买入，反而把价格进一步推向 40k 上方。”

她的操作逻辑：

1. 在 BTC 39,000 左右时，Iris 用一部分资金买入现货 + 一些短期多头合约（低杠杆）
2. 同时，她用少量资金买入一个价外短期期权，作为尾部保护
3. 到期前一天，BTC 开始逐步爬升：39,000 → 39,800
4. 当价格逼近 40,000 时，她明显看到：
   - 盘口挂单被快速吃掉  
   - 成交量抬升，价格出现一段明显加速上攻的走势

最终，在到期前几个小时内，BTC 一度被推到 **40,600**，之后迅速回落。

Iris 的执行：

- 在 40,200 – 40,500 区间分批卖出之前建的现货与多头仓位  
- 做到“只吃挤压段，不赌后续走势”

这次她的账面记录大致是：

\`\`\`
初始建仓价格： 约 $39,000
平仓平均价格： 约 $40,400
涨幅：           约 3.6%

由于使用了适度杠杆 + 多次滚动加减仓，
这 3 天在固定风险控制下实现了约 35% 的资金收益率。
\`\`\`

她没有预测“BTC 会涨到多少”，只是**利用了期权到期结构下，做市商被迫对冲造成的价格挤压**。

---

## 🧠 核心概念：Gamma 挤压本质是什么？

### 1. Gamma 与 Delta 对冲

简单理解几个关键点：

- **Delta**：期权价格对标的价格变动的敏感度（类似“对冲比例”）  
- **Gamma**：Delta 对标的价格变动的敏感度（“Delta 的加速度”）

做市商通常会：

- 卖出大量期权（作为流动性提供者）  
- 并通过持有现货/期货/永续来**对冲 Delta**，尽量使整体组合 Delta 接近 0

当标的价格接近大量 OI 集中的执行价时，Gamma 会很高：

- 小幅价格变动 → Delta 变化非常快  
- 做市商为了维持 Delta 中性，需要 **频繁且大规模地买卖现货/合约**

这就埋下了“挤压”的种子：

- 如果市场已经往某个方向动起来  
- 做市商的对冲要顺着这个方向不断追  
- 他们的操作本身会进一步推动价格 → 形成一种自我强化的短期价格加速

### 2. 到期日的 OI 结构与 Magnet 效应（吸铁石）

在到期日前后：

- 很多期权头寸必须结算或被迫平仓  
- 大量“卖方 + 做市商”的组合会产生特定价格区域的**吸附效应**：

> 价格容易被吸向 OI 最大的某几个执行价附近

这就是所谓的“期权价格磁铁效应”：  
> 在某些执行价附近，标的价格被“磁化”，更容易往那一带靠。

### 3. Gamma 挤压与“逼仓”的区别

- **逼仓（Short Squeeze）**：
  - 更多是针对大量空头被迫平仓  
  - 涉及借券、融券、清算线等  
- **Gamma 挤压（Gamma Squeeze）**：
  - 核心是做市商为了对冲其卖出的期权头寸  
  - 在 Gamma 高的区域，被迫顺势买卖现货/合约

两者可以同时发生，但你要知道：

> Gamma 挤压不完全取决于“多少人做空”，而是取决于“期权 OI 与做市商对冲结构”。

---

## 🔍 子策略拆分：两种典型操作模式

### 模式 A：到期前“挤压段”多头套利

> 在到期前识别潜在 Gamma 挤压区域，提前布局多头仓位，吃短期挤压段。

**核心步骤：**

1. **扫描期权到期日与 OI 集中区**
   - 关注：
     - 本周到期（Weekly）
     - 本月到期（Monthly）
     - 季度到期（Quarterly）
   - 观察各执行价上的 Call + Put OI 分布，找到 “最大未平仓量” 区域

2. **确认价格区间与潜在“磁铁价”**
   - 当前现货价格是否已经接近某个 OI 巨量执行价  
   - 或者有明显的“价格向该执行价靠拢”的趋势

3. **判断做市结构**
   - 通过盘口 + 成交数据 + 历史模式，粗略判断：
     - 当前这段是否可能触发做市商强对冲  
   - 切记：这一步没有绝对，需要结合经验和统计

4. **仓位设计**
   - 以现货 + 低杠杆多头合约为主  
   - 可搭配少量短期期权做保护（例如买入便宜的 OTM Put）

5. **执行与止盈**
   - 严格设定：
     - 入场区间  
     - 理想挤压目标区间（例如靠近最大 OI 执行价 ±1%-2%）  
     - 止损点位（防止“挤压失败”）

---

### 模式 B：到期前“压制段”空头套利（或对冲）

> 当价格远离高 Gamma 区，且做市商对冲方向明显相反时，可以利用反向挤压做空或对冲。

比如：

- 当大量 Put OI 集中在某个低位执行价  
- 标的价格在到期前迅速逼近甚至跌破该价位  
- 做市商为了对冲，可能需要不断卖出标的  
- 若叠加整体市场疲弱，就会形成一段向下的 Gamma 挤压

此时你可以：

- 通过期货/永续建立空头仓位  
- 或用看跌期权买入形式参与  
- 但风险更高，需要更严格的仓位控制与止盈/止损方案

---

## 🛠️ OI 分布 & Gamma 热点扫描脚本示意

下面是一个简化版脚本，用来：

- 调用某个期权数据源 API（示意）  
- 拉取某标的在近期到期日的 OI 分布  
- 计算简单的 “OI 集中度” 指标，帮助找出潜在 Gamma 挤压区

\`\`\`javascript
class OptionsGammaScanner {
  constructor() {
    this.apiBase = 'https://api.options-data.example.com'; // 示例地址
  }

  /**
   * 获取某个标的、某个到期日、全执行价的 OI 数据
   */
  async fetchOptionChain(underlying, expiry) {
    const res = await axios.get(
      \`\${this.apiBase}/chain?underlying=\${underlying}&expiry=\${expiry}\`
    );
    return res.data.options || [];
  }

  /**
   * 简单评估某个执行价的“Gamma 热点分数”
   * 这里只是示意：真实情况需要根据 Delta/Gamma 模型计算。
   */
  computeStrikeScore(strike, callOi, putOi, underlyingPrice) {
    const distance = Math.abs(strike - underlyingPrice) / underlyingPrice;
    const totalOi = callOi + putOi;

    // OI 越大、距当前价越近，评分越高
    let score = 0;
    if (totalOi > 0) {
      score += Math.log10(totalOi + 1) * 2;
    }

    if (distance < 0.05) score += 3;
    if (distance < 0.02) score += 4;

    return {
      strike,
      callOi,
      putOi,
      totalOi,
      distance,
      score
    };
  }

  /**
   * 对某个到期日扫描潜在 Gamma 热点
   */
  async scanExpiry(underlying, expiry, underlyingPrice) {
    const chain = await this.fetchOptionChain(underlying, expiry);

    // 假设 chain 结构: [{ type: 'CALL'|'PUT', strike, openInterest }, ...]
    const strikesMap = new Map();

    for (const opt of chain) {
      const key = opt.strike;
      if (!strikesMap.has(key)) {
        strikesMap.set(key, { callOi: 0, putOi: 0 });
      }
      const item = strikesMap.get(key);
      if (opt.type === 'CALL') item.callOi += opt.openInterest || 0;
      if (opt.type === 'PUT') item.putOi += opt.openInterest || 0;
    }

    const result = [];
    for (const [strike, { callOi, putOi }] of strikesMap.entries()) {
      const info = this.computeStrikeScore(
        Number(strike),
        callOi,
        putOi,
        underlyingPrice
      );
      result.push(info);
    }

    // 按 score 从高到低排序
    result.sort((a, b) => b.score - a.score);

    return result;
  }

  async runExample() {
    const underlying = 'BTC-USD';
    const expiry = '2025-12-27'; // 示例到期日
    const underlyingPrice = 40000; // 示例当前价

    const hotspots = await this.scanExpiry(
      underlying,
      expiry,
      underlyingPrice
    );

    console.log('📊 期权到期日潜在 Gamma 热点（Top 10）：');
    hotspots.slice(0, 10).forEach((h) => {
      console.log(
        \`- 执行价 \${h.strike} | Call OI=\${h.callOi} | Put OI=\${h.putOi} | 距离现价=\${(
          h.distance * 100
        ).toFixed(2)}% | 评分=\${h.score.toFixed(2)}\`
      );
    });

    return hotspots;
  }
}

// 使用示例：
// const scanner = new OptionsGammaScanner();
// scanner.runExample().catch(console.error);
\`\`\`

---

## 📊 风险参数与风控框架

\`\`\`javascript
const OPTIONS_GAMMA_RISK = {
  MAX_CAPITAL_RATIO: 0.3,        // 所有 Gamma 挤压相关仓位不超过净值 30%
  MAX_SINGLE_EVENT_RATIO: 0.1,   // 单个到期日/标的不超过净值 10%
  MAX_LEVERAGE: 3,               // 不建议超过 3x 杠杆
  STOP_LOSS_PERCENT: -0.1,       // 每次事件最大亏损 10%
  TAKE_PROFIT_STEP1: 0.03,       // 价格相对入场涨 3% 可减仓
  TAKE_PROFIT_STEP2: 0.06,       // 涨 6% 进一步减仓
  MAX_HOLDING_DAYS: 5,           // 单个事件最多持仓 5 天
  MAX_CONCURRENT_EVENTS: 3       // 同时参与的到期事件不超过 3 个
};
\`\`\`

### 典型风险与对应处理

| 风险类型 | 描述 | 对策 |
|---------|------|------|
| **挤压失败风险** | 价格未能靠近 OI 巨量执行价，Gamma 结构没发挥作用 | 严格设置入场距离与预设止损，宁可错过也不强行参与 |
| **剧烈反向波动** | 挤压启动后突然被反向砸盘（大户平仓或插针） | 使用分批止盈 + 动态止损；避免用大杠杆梭哈 |
| **数据偏差风险** | OI 数据滞后、期权链不全导致判断错误 | 尽量使用多源数据交叉验证，避免只看单一交易所 |
| **流动性风险** | 在小币种或冷门执行价附近挤压时，出场困难 | 仅在主流币、主流执行价区域做 Gamma 玩法 |
| **执行纪律风险** | 情绪化加仓或迟迟不肯止损 | 将规则写成机械化 SOP，甚至用脚本辅助决策提醒 |

---

## 🎯 实战 Checklist

### 1️⃣ 研究与准备阶段

- [ ] 选择 1-2 个标的（如 BTC、ETH），先不要多  
- [ ] 熟悉这些标的在主流平台上的期权市场结构（Deribit、币安等）  
- [ ] 搭建 OI & 价格数据看板：  
  - 不同到期日的 OI 分布  
  - 各执行价的聚集情况  
  - 历史上 Gamma 事件发生时的价格路径

### 2️⃣ 事件选择阶段

- [ ] 每周检查未来 1-4 周的到期日  
- [ ] 对每个到期日做：  
  - 找出 OI 最大执行价  
  - 关注“当前价格是否正在向该区域靠近”  
- [ ] 为每个候选事件写一句话结论：  
  - “这个到期日，谁在被逼着做什么？”

### 3️⃣ 建仓与持仓阶段

- [ ] 在价格接近 Gamma 热点前一定距离入场（例如 1-2% 以内）  
- [ ] 以现货 + 低杠杆合约为主，避免极端短期期权豪赌  
- [ ] 预设：  
  - 目标挤压区间  
  - 保护性止损点位  
  - 每一个价位对应的减仓比例

### 4️⃣ 平仓与复盘阶段

- [ ] 在挤压阶段务必“只吃中间一段”：  
  - 不贪图绝对顶部  
  - 完成既定收益目标后坚决撤退  
- [ ] 记录：  
  - 价格路径、实际收益、最大回撤  
  - 自己的执行是否和事先计划一致  
- [ ] 迭代：  
  - 哪些结构容易成功（Call 集中？Put 集中？）  
  - 哪种宏观环境下 Gamma 事件更有效（震荡市/趋势市）

---

## ✅ 小结

**期权到期日 Gamma 挤压套利** 的精髓并不在于“预测 BTC 要涨到哪”，而是：

- 知道**什么时候**做市商会被迫大量对冲；  
- 明白那些对冲行为会在什么价格区间集中发生；  
- 在那之前，悄悄站到受益一侧，吃一小段结构性的加速行情。

只要你愿意花点精力把 OI 分布和历史经验整理成自己的一套“Gamma 雷达”，  
这会成为你组合中**高度可复制、但又不那么拥挤**的高级玩法之一。

`
};

/**
 * 30.6 调费与规则切换套利
 */
const STRATEGY_30_6 = {
  title: '调费与规则切换套利 - 在费率/规则变化瞬间寻找错价',
  slug: 'fee-structure-and-rule-switch-arbitrage',
  summary:
    '围绕交易所或协议对于手续费、Maker/Taker 返佣、撮合/清算规则等进行调整的时间窗口，在老规则与新规则切换时，捕捉暂时性的价格错位、流动性迁移、做市策略失衡所带来的套利机会。适合关注公告、理解撮合机制、会做简单做市或搬砖策略的玩家。',
  category: 'structural-event-arbitrage',
  category_l1: 'arbitrage',
  category_l2: 'structural-event-arbitrage',
  risk_level: 3,
  apy_min: 15,
  apy_max: 70,
  min_investment: 3000,
  time_commitment: '每周 3-8 小时（视公告频率而定）',
  status: 'published',
  content: `# 调费与规则切换套利 - 在费率/规则变化瞬间寻找错价

## 💰 策略概览

| 参数 | 数值 |
|------|------|
| **起投资金** | $3,000 - $50,000 |
| **时间投入** | 每周 3-8 小时（集中在规则变更期） |
| **预期年化收益** | 15-70%（事件型，视执行力而定） |
| **风险等级** | ⚠️⚠️⚠️ 中等 (3/5) |
| **难度等级** | 中级偏高级 |
| **适合人群** | 会做 CEX/DEX 间搬砖、懂一点做市逻辑、习惯看公告和费率表的玩家 |

---

## 📖 开场故事：一次 Maker 费率调整带来的无风险点差套利

某主流交易所宣布：

> 自下周一 00:00 UTC 起，  
> 将对现货交易的 Maker/Taker 手续费结构进行调整：  
> 具体包括某些交易对的 Maker 手续费从 -0.01% 返佣，  
> 调整为 0% 或 +0.01%。

这看起来像是一个“很无聊”的公告，但对做市商来说意味着：

- 以前在这些交易对挂限价单是有**额外补贴**的（负手续费 = 返佣）  
- 调整后这部分补贴消失，甚至变成额外成本  
- 很多自动化做市策略需要**重新计算盈亏与参数**

交易者 Neo 在公告发出后做了几步功课：

1. 他列出所有即将被调费的交易对，将它们的：
   - 当前点差  
   - 深度  
   - Maker 和 Taker 实际成本
   逐一计算了一遍。

2. 他发现其中的某个交易对（例如：某稳定币对 USDT）有如下情况：

   - 当前盘口点差 ≈ 0.03%  
   - 以前 Maker 手续费为 -0.01%（返佣）  
   - 实际上，“做一手买 + 做一手卖” 的综合成本 ≈ -0.01%（反而赚钱）  
   - 但在新规则下：
     - Maker 手续费变成 0.01%  
     - 原来的做市策略如果不调，会从“每轮小赚”变成“每轮小亏”

3. Neo 观察到：

   - 很多机器人/量化账户短时间不会立刻调整参数  
   - 切换时刻附近依然维持原先的挂单深度与点差结构  
   - 换句话说，有一段“老逻辑还在跑，新规则已生效”的过渡期

他做了一件非常简单的事：

- 在新费率刚生效的前半小时内，  
- 利用另一家交易所的现货价格 + 该交易所尚未反应过来的做市机器人，  
- 通过 **对敲 + 搬砖** 的方式，吃下了一段几乎无风险的点差。

这一轮，他并没有赚到非常夸张的绝对金额——  
但在极低风险和短时间内，做出了一个“确定性极高”的稳健小利润。

他总结说：

> “大部分人只看产品上线/下架、要不要发币，  
> 很少认真看‘收费规则变一下’，  
> 但对做市、搬砖这种靠细水长流吃差价的策略来说，  
> 手续费结构就是整个商业模式的心脏。”

---

## 🧠 策略逻辑：为什么调费与规则切换是套利窗口？

### 1. 做市/量化策略对费率高度敏感

- 做市商/量化的核心利润来源往往是：
  - 点差收益  
  - 手续费返佣  
  - 返佣 + Rebate + 其它激励（如交易挖矿）

当交易所突然调整：

- Maker/Taker 费率  
- 手续费折扣门槛  
- VIP 等级计算规则  
- 或者推出/取消某种返佣计划

时，很多原本“盈利”的策略会瞬间变成“亏损”：

- 但机器人的参数不会在公告发布的那一刻自动重写  
- 他们需要时间：研发 → 测试 → 上线  
- 在这个时间差中，你有机会**利用老策略的惯性与新费率的不匹配**。

### 2. 流动性迁移带来的暂时性价格失衡

当某个交易所对某些交易对的大幅涨价（提高手续费）或降价时：

- 做市商可能会迁移流动性：
  - 从 A 所撤出，转向 B/C 所  
  - 或从 CEX 转移到 DEX（反之亦然）
- 在迁移过程中，不同平台的：
  - 点差  
  - 深度  
  - 价格反应速度
  会出现短暂失衡——非常适合搬砖与市场中性套利策略切入。

### 3. 清算/规则调整影响强平路径与资金费率

有些规则变化不体现在费用上，而体现在：

- 杠杆倍数调整  
- 维持保证金率变化  
- 强平机制重构  
- 资金费率计算方式变化

这些调整会在短期内导致：

- 某些合约出现异常的 Basis（基差）或资金费率  
- 某些交易对短时间被大量强平  
- 某些策略被迫平仓，从而制造价差

你要做的，就是在这些**清晰可预见的规则切换窗口**里，站在对的一边。

---

## 🔍 子策略拆解：三种常见玩法

### 模式 A：手续费结构微调 + 做市策略失衡套利

> 在 Maker/Taker 费率被调整的时间窗口，利用老机器人尚未更新参数的短期失衡进行点差套利。

**典型操作流程：**

1. 收集公告：
   - 交易所挂网公告：“将于某日调整以下交易对的手续费结构”
   - 重点关注：
     - Maker 手续费由负变正，或由低变高  
     - Taker 手续费大幅降低（鼓励吃单）  

2. 建立“费率模拟器”：
   - 对每个相关交易对，计算：
     - 挂买 & 挂卖的综合成本  
     - 吃单与挂单组合的盈亏  
   - 找出在新规则下，**某些原先盈利的策略将变亏损**的场景

3. 观察盘口与深度：
   - 新规生效后，看看盘口是否仍维持原样：
     - 点差是否依旧很小  
     - 深度是否仍然很厚  
   - 若是，则说明部分机器人还在用**旧逻辑**做市

4. 执行套利：
   - 利用其它交易所/市场的价格作为锚  
   - 在该交易所选择：
     - 以 Taker 身份吃掉不合理挂单  
     - 或通过跨所对冲的方式锁定价差  
   - 直到对手的机器人更新，或点差恢复到合理水准

---

### 模式 B：VIP 阶梯/返佣制度调整 +“刷量套利”

> 当交易所调整 VIP 等级/返佣规则时，通过短期集中刷量，使综合手续费变负，从而在搬砖/做市中获得额外无风险收益。

例如：

- 某交易所宣布：
  - VIP3 以上 Maker 手续费从 0 变成 -0.01%（返佣）  
  - VIP 等级按最近 30 日成交量重新计算  
- 这对一部分“差一点就够 VIP 的用户”来说，是巨大机会：

> 只要通过低风险的对敲/搬砖，把成交量冲上去，  
> 接下来 30 天在该平台做任何交易，都可以享受更高返佣，  
> 从而让自己的套利策略整体变得更赚钱。

**玩法细节：**

1. 模拟 VIP 门槛：
   - 计算你当前 30 日成交量  
   - 计算距离下一档 VIP 等级需要的剩余成交量  
   - 估算：
     - 刷够这部分成交量会花多少手续费  
     - 升级后 30 日中你预期真实交易量与返佣收益

2. 优化刷量策略：
   - 在点差小且流动性极好的对上做“对敲式刷量”  
   - 尽量用 Maker + Maker 的方式控制成本  
   - 利用返佣与费率折扣，把刷量成本压到最低

3. 切换后执行：
   - 在 VIP 等级生效后，集中执行你的稳定套利/搬砖策略  
   - 将这 30 天视为“高返佣窗口期”，尽量提高资金周转

> 虽然这更像是“结构优化 + 量化运营”，但本质也是调费与规则变化带来的套利机会。

---

### 模式 C：清算/资金费率规则切换 + 基差套利

> 当交易所调整资金费率公式、保证金率或某些特殊杠杆产品的规则时，会在短期内造成异常 Basis 或资金费率，适合做方向中性套利。

例子：

- 某永续合约品种的资金费率计价方式从按标的价格改成按指数价格  
- 或开放了新的资产作为保证金，引发资金流向变化  
- 或新推出“零资金费率”期间的推广活动

你可以：

- 在资金费率极度偏离、公平价出现“过度飘离”的时段，  
- 建立现货 + 期货/永续的基差交易：  
  - 多现货空合约（或反之）  
  - 吃资金费 + Basis 回归

---

## 🛠️ 调费与规则监控脚本示意

下面是一个简化版脚本，用来：

- 定期拉取多个交易所的公告/费率表  
- 识别包含“fee”、“手续费”、“费率”、“maker/taker”等关键词的公告  
- 生成一个“规则/调费事件列表”供你进一步人工评估

\`\`\`javascript
class FeeRuleChangeMonitor {
  constructor() {
    this.sources = [
      {
        name: 'ExchangeA',
        announcementsApi:
          'https://api.exchangeA.com/v1/announcements?category=fee'
      },
      {
        name: 'ExchangeB',
        announcementsApi:
          'https://api.exchangeB.com/v2/announcements?type=rule'
      }
      // 你可以继续加更多交易所的公告源
    ];

    this.keywords = [
      'fee',
      'fees',
      '手续费',
      'maker',
      'taker',
      'rebate',
      '返佣',
      '费率',
      '清算',
      '保证金',
      'margin',
      'funding rate',
      '资金费率'
    ];
  }

  async fetchAnnouncements(api) {
    const res = await axios.get(api);
    return res.data.items || [];
  }

  matchKeywords(text) {
    const lower = (text || '').toLowerCase();
    return this.keywords.some((k) => lower.includes(k.toLowerCase()));
  }

  async scan() {
    const events = [];
    const now = Date.now();

    for (const src of this.sources) {
      try {
        const items = await this.fetchAnnouncements(src.announcementsApi);
        for (const item of items) {
          const title = item.title || '';
          const body = item.body || item.summary || '';
          const text = \`\${title} \${body}\`;

          if (!this.matchKeywords(text)) continue;

          const ts = item.timestamp || item.publishedAt || now;

          events.push({
            exchange: src.name,
            title,
            body,
            url: item.url || '',
            timestamp: ts
          });
        }
      } catch (e) {
        console.error(\`❌ 获取 \${src.name} 公告失败:\`, e.message);
      }
    }

    return events;
  }

  async run() {
    const events = await this.scan();
    console.log('📢 近期调费/规则变更相关公告：');
    events.forEach((e) => {
      console.log(
        \`- [\${e.exchange}] \${e.title} | 时间: \${new Date(
          e.timestamp
        ).toISOString()} | 链接: \${e.url}\`
      );
    });

    return events;
  }
}

// 使用示例：
// const monitor = new FeeRuleChangeMonitor();
// monitor.run().catch(console.error);
\`\`\`

---

## 📊 费率与盈亏模拟器示意

下面示范一个简单的“撮合费用模拟器”，用来帮助你评估：

- 在不同 Maker/Taker 费率下，  
- 做市/搬砖策略在不同点差与成交量下的综合盈亏。

\`\`\`javascript
class FeeSimulator {
  constructor({ makerFee, takerFee }) {
    this.makerFee = makerFee; // 例如 -0.0001 表示 -0.01%
    this.takerFee = takerFee; // 例如 0.0004 表示 0.04%
  }

  /**
   * 模拟一次“买入 + 卖出”的循环交易
   * @param {number} priceBuy 买入价
   * @param {number} priceSell 卖出价
   * @param {number} qty 数量
   * @param {string} buyRole 'maker' 或 'taker'
   * @param {string} sellRole 'maker' 或 'taker'
   */
  simulateRound(priceBuy, priceSell, qty, buyRole, sellRole) {
    const notionalBuy = priceBuy * qty;
    const notionalSell = priceSell * qty;

    const buyFeeRate = buyRole === 'maker' ? this.makerFee : this.takerFee;
    const sellFeeRate = sellRole === 'maker' ? this.makerFee : this.takerFee;

    const feeBuy = notionalBuy * buyFeeRate;
    const feeSell = notionalSell * sellFeeRate;

    const pnl = notionalSell - notionalBuy - feeBuy - feeSell;

    return {
      notionalBuy,
      notionalSell,
      feeBuy,
      feeSell,
      pnl
    };
  }

  demo() {
    const priceBuy = 1.0000;
    const priceSell = 1.0003; // 点差 0.03%
    const qty = 1_000_000; // 100 万单位，比如 100 万 USDC

    const result = this.simulateRound(
      priceBuy,
      priceSell,
      qty,
      'maker',
      'maker'
    );

    console.log('💹 模拟一轮做市结果:');
    console.log(result);
  }
}

// 使用示例：
// const sim = new FeeSimulator({ makerFee: -0.0001, takerFee: 0.0004 });
// sim.demo();
\`\`\`

---

## 📊 风险参数与风控框架

\`\`\`javascript
const FEE_RULE_ARB_RISK = {
  MAX_CAPITAL_RATIO: 0.3,          // 所有调费/规则套利策略总资金占比不超过 30%
  MAX_SINGLE_EVENT_RATIO: 0.1,     // 单一事件不超过 10%
  MAX_LEVERAGE: 2,                 // 通常不超过 2x 杠杆
  MAX_CYCLE_MINUTES: 60,           // 单个“错误定价窗口”策略最长执行 60 分钟
  TARGET_MIN_EDGE_BP: 1,           // 最少 1 bp（0.01%）净边界才考虑执行
  MAX_CONCURRENT_MARKETS: 5,       // 同时参与的市场不超过 5 个
  RISK_FREE_FOCUS: true            // 优先选择方向中性/市场中性的结构
};
\`\`\`

### 典型风险与解决方案

| 风险类型 | 描述 | 对策 |
|---------|------|------|
| **公告误读** | 把某个促销或规则理解错，导致错误预期 | 必须阅读英文/原文公告，必要时查 FAQ 或客服确认 |
| **变更生效时间偏差** | 以为某时生效，实际提前/延后 | 永远假设对自己不利的那一端：提前准备/晚一点确认实际生效 |
| **机器人更新速度被低估** | 你以为有 30 分钟窗口，结果 5 分钟就没了 | 把“窗口期”预期设得更短，优先做自动化而非手动点击 |
| **对手平台风险** | 对冲所或交易链路出问题，导致风险暴露 | 分散对冲平台，严格控制跨平台敞口 |
| **手续费隐藏成本** | 存取款、链上转账、桥接成本吃掉套利空间 | 把所有隐性成本纳入盈亏模拟，谨慎评估纯“手续费型套利”的边际收益 |

---

## 🎯 实战 Checklist

### 1️⃣ 信息收集与整理

- [ ] 订阅各大交易所公告（邮件、RSS、TG Bot、Twitter）  
- [ ] 建一个“规则/调费事件数据库”：  
  - 交易所 / 交易对 / 生效时间 / 变更内容  
  - 旧费率 vs 新费率  
  - 预估受影响的做市/搬砖策略类型

### 2️⃣ 建立工具箱

- [ ] 手续费模拟器（如上示例）  
- [ ] 基础点差监控脚本（实时抓盘口、计算点差、深度）  
- [ ] 简单的跨所搬砖执行脚本（至少半自动）  
- [ ] 风险与资金使用 dashboard（控制每个事件的仓位）

### 3️⃣ 事件执行流程

- [ ] 公告发布时：  
  - 快速评估这是“营销噪音”还是“结构性变化”  
  - 若是后者，记入事件表并标记优先级  
- [ ] 生效前 24 小时：  
  - 完成所有相关交易对的模拟测算  
  - 准备好可执行的脚本与账户资金  
- [ ] 生效时刻 ±60 分钟内：  
  - 集中监控点差、深度与实际手续费表现  
  - 一旦发现“旧逻辑还在跑”的对手方，立刻执行预设的套利脚本  
  - 始终注意：只做你真正理解的价差，不要临时起意乱冲

### 4️⃣ 复盘与策略迭代

- [ ] 对每一次规则变更事件记录：  
  - 你是否发现了机会？  
  - 是否有可执行空间（深度、时间窗）？  
  - 实际收益与风险情况  
- [ ] 从数据中总结：  
  - 哪些交易所/交易对的规则变更更常带来套利空间？  
  - 哪些只是“噪音公告”？  
- [ ] 根据经验调整：  
  - 哪类事件值得你全神贯注  
  - 哪类事件可以自动归类为“不做”

---

## ✅ 小结

**调费与规则切换套利** 看起来“很运营”“很细”，  
但正因为大多数人嫌麻烦、不愿看公告，  
它反而是一个**相对冷门但非常稳定的结构性机会来源**。

你要做的并不是：

- 每条公告都 FOMO 地冲进去；  

而是：

- 像运营一家小型量化基金那样认真：  
  - 维护自己的“规则数据库”  
  - 搭好费率模拟器和自动化执行工具  
  - 在真正的结构性变化发生时，果断出手

配合你已经在做的各类套利玩法（跨所、基差、解锁、Gamma 挤压等），  
这会成为你整个 **“结构性与事件套利模块”** 里非常关键的一块补丁：  
- 不一定总是给你最亮眼的 ROI，  
- 但往往能在别人忽视的角落里，  
  **稳定为你的组合多抹几笔边际收益。**

`
};

/**
 * 上传 30.5 和 30.6 策略到 Directus
 */
async function uploadStrategies() {
  const DIRECTUS_URL = 'http://localhost:8055';

  console.log('开始上传策略 30.5 和 30.6...\n');

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

    // 上传策略 30.5
    console.log('上传策略 30.5: 期权到期日 Gamma 挤压...');
    await axios.post(`${DIRECTUS_URL}/items/strategies`, STRATEGY_30_5, {
      headers
    });
    console.log('✅ 策略 30.5 上传成功\n');

    // 上传策略 30.6
    console.log('上传策略 30.6: 调费与规则切换套利...');
    await axios.post(`${DIRECTUS_URL}/items/strategies`, STRATEGY_30_6, {
      headers
    });
    console.log('✅ 策略 30.6 上传成功\n');

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

// 若需要在 Node 中直接运行本文件，可以解除下一行注释：
uploadStrategies();

