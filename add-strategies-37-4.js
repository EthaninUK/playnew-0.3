// 策略 37.4 & 37.5 & 37.6: 新收益市场 & 新稳定币引导池 & 新 L2 原生 DEX (new-pools-and-protocols)

const axios = require('axios');

/**
 * 37.4 Pendle 新收益市场
 * 在 Pendle 上线新的收益资产（如新 LST）时，抢先交易 PT/YT 获取价差。
 */
const STRATEGY_37_4 = {
  title:
    'Pendle 新收益市场 - 把“新 LST / 新收益资产”拆成年化曲线与折价筹码',
  slug: 'pendle-new-yield-markets-pt-yt-arbitrage',
  summary:
    '围绕 Pendle 等收益代币化协议，在新收益市场（例如新 LST、新 RWA 收益资产）刚上线时，通过交易 PT（Principal Token，本金）与 YT（Yield Token，收益）获取折价、溢价与年化收益机会。核心玩法：1）用“隐含收益率”而不是单纯价格看待 PT/YT；2）在新池初期流动性尚浅时，用小仓发现“市场定价错误”；3）结合到期时间与真实收益源，设计“锁定收益 + 价差博弈”的多层玩法。',
  category: 'new-protocols',
  category_l1: 'yield',
  category_l2: 'pendle-new-yield-markets',
  risk_level: 4,
  apy_min: 15,
  apy_max: 400,
  min_investment: 500,
  time_commitment:
    '新池上线首周需要较高关注度（每天 1-2 小时），之后按到期周期巡检',
  status: 'published',
  content: `# Pendle 新收益市场 - 把“新 LST / 新收益资产”拆成年化曲线与折价筹码

## 💰 策略概览

| 项目 | 内容 |
|------|------|
| **适用场景** | Pendle 等协议上新上线的收益资产市场（新 LST、新 RWA、新票据类资产） |
| **操作对象** | PT（本金代币）、YT（收益代币）、LP 头寸 |
| **起始资金** | 建议 \$500 - \$5,000 小中仓起步 |
| **潜在收益** | 锁定隐含年化收益 + 折价套利 + 流动性激励 + 新资产叙事溢价 |
| **风险等级** | ⚠️⚠️⚠️⚠️ 较高 (4/5) —— 协议风险 + 新标的风险 + 流动性风险 |
| **难度等级** | 中高级（需要理解收益曲线与 PT/YT 定价逻辑） |

---

## 📖 开场故事：同样是“新 LST 上线 Pendle”，有人只看到 APY，有人看到“隐含收益率曲线”

当一个新 LST 或新收益资产在 Pendle 上线时，常见画面：

- Twitter 上有人高喊：  
  > “新池 APY 300%+，快来上车！”  

- 实际池子里：  
  - 流动性还比较浅  
  - PT 与现货之间的折价/溢价还在“寻找平衡”  
  - YT 的隐含年化收益率可能出现明显偏离

结果常见三类玩家：

1. **只看 APY 型**  
   - 看到 “LP APY 300%” 就直接往池子里扔钱；  
   - 不理解 APY 波动、激励减半、价格波动对最终实际收益的影响；  
   - 到头来实际年化远低于预期，甚至亏本。  

2. **方向赌徒型**  
   - 把 YT 当成“短线代币”，只看涨跌，不看到期时间与隐含收益率；  
   - 在市场错价时没抓住机会，在市场修正时却被套。  

3. **收益曲线型玩家**  
   - 用“收益到期时间 / 年化收益率 / 折价幅度”来分析 PT/YT；  
   - 在新市场定价尚未成熟时，用小仓捕捉明显错价；  
   - 把一部分仓位做 “锁定收益”，另一部分当价差期权。

本策略，就是帮你向第 3 类靠拢。

---

## 🧠 核心逻辑：PT / YT = 本金 & 收益的拆分

简单化理解：

- 你原本持有某个收益资产（比如 LST），其未来现金流 =  
  - 本金（到期或赎回时的价值）  
  - 期间收益（质押收益、利息等）  

Pendle 做的事就是把这条现金流拆成两部分：

1. **PT（Principal Token）本金代币**  
   - 到期时，PT ≈ 1 份原资产（加上小调整）；  
   - 当前价格映射出市场对“无风险收益率”的定价。  

2. **YT（Yield Token）收益代币**  
   - 代表未来一段时间内的收益权；  
   - 价格受到：  
     - 预期收益率  
     - 市场波动  
     - 风险偏好  
     - 激励活动  
     等多因素影响。

你在做的，就是：

> 在新市场上线初期，  
> 用更理性的“收益视角”去审视 PT/YT 的价格，  
> 在市场还没完全定价正确前，  
> 找到 **折价买入 + 到期收敛** 或 **价差交易** 的机会。

---

## 🔍 典型玩法拆解

### 玩法 A：折价买 PT，锁定隐含收益率

**场景：**

- 新 LST / 收益资产刚上线 Pendle；  
- PT 价格由于流动性不足或市场情绪，  
  出现相对现货明显折价。

**例子（示意）：**

- 某 LST 现货价格：1.00  
- 对应 PT（半年后到期）的市场价格：0.94  
- 隐含年化收益率（粗略）：  
  - 半年 6% → 年化 ≈ 12%

如果你判断：

- 该 LST 的真实风险可控；  
- Pendle 本身协议风险在可接受范围内；  
- 到期时资产八成以上能 “回到面值附近”；  

那么你可以：

1. 用部分资金直接买 PT（相当于折价买入未来的 1 份 LST）；  
2. 持有至到期，享受隐含年化；  
3. 把这部分仓位视作“中短期固收 + 协议风险敞口”。

---

### 玩法 B：交易 YT，博弈“收益预期的修正”

**场景：**

- 新收益资产的 YT 在上线初期：  
  - 由于激励/情绪，隐含收益率被严重高估或低估；  
  - 或者市场对未来利率/收益变化的预期有较大分歧。  

你可以：

1. 在隐含收益率异常高的时候买入 YT：  
   - 赚取“收益率回归正常区间”的价差；  
2. 或在隐含收益率过低时做对冲/减仓。  

这部分更偏研究：

- 需要理解收益资产本身的利率逻辑（比如 LST 的 staking APR）；  
- 对宏观利率变化有一定判断。

---

### 玩法 C：LP + 激励 + 套利组合

在新市场上线初期：

- Pendle 通常会为 LP 提供额外激励（协议代币、合作方代币）；  
- 同时，PT/YT 与现货之间的价差可能相对活跃。  

策略示意：

1. 把原始资产存入 Pendle，拆分出 PT + YT；  
2. 分别为 PT/YT 或 PT/稳定币、YT/稳定币提供 LP；  
3. 同时领激励 + 做价差调整；  
4. 用脚本监控 APY/TVL/价差，不断微调。

---

## 🛠️ Pendle 新市场 PT/YT 分析脚本（伪代码）

\`\`\`javascript
class PendleMarketAnalyzer {
  constructor(market) {
    this.market = market; // {name, symbol, expiry, baseApyEst}
  }

  /**
   * 简化版：根据现货价、PT 价、到期时间，估算隐含年化收益率
   * @param {number} spotPrice 现货价格
   * @param {number} ptPrice PT 当前价格
   * @param {number} daysToExpiry 距离到期的天数
   */
  impliedYield(spotPrice, ptPrice, daysToExpiry) {
    if (ptPrice <= 0 || spotPrice <= 0 || daysToExpiry <= 0) return 0;
    const grossReturn = spotPrice / ptPrice - 1;
    const annualFactor = 365 / daysToExpiry;
    return grossReturn * annualFactor; // 近似年化
  }

  /**
   * 给出一组参数，输出“是否值得研究”的信号
   */
  evaluate(spotPrice, ptPrice, daysToExpiry, baseRiskFreeApy = 0.05) {
    const implied = this.impliedYield(
      spotPrice,
      ptPrice,
      daysToExpiry
    );
    const spread = implied - baseRiskFreeApy;
    const verdict =
      spread > 0.03
        ? '值得深入研究，隐含收益明显高于基准利率'
        : '利差有限或不足以覆盖风险';

    return {
      market: this.market.name,
      spotPrice,
      ptPrice,
      daysToExpiry,
      impliedApy: implied,
      spread,
      verdict
    };
  }
}
\`\`\`

---

## 📊 风控与仓位管理建议

\`\`\`javascript
const PENDLE_NEW_MARKET_RISK = {
  MAX_PENDLE_RATIO: 0.15,          // Pendle 相关策略不超过净资产 15%
  MAX_SINGLE_MARKET_RATIO: 0.05,   // 单个新收益市场不超过净资产 5%
  MAX_YT_RATIO: 0.02,              // 纯 YT 投机不超过净资产 2%
  MIN_PT_HOLD_DAYS: 7,             // 计划持有 PT 至少 7 天以上（避免过度频繁交易）
  REVIEW_INTERVAL_DAYS: 3          // 每 3 天复盘一次 PT/YT 表现与风险
};
\`\`\`

---

## 🎯 实战 Checklist

- [ ] 确认 Pendle 协议本身风险在可接受范围（审计、历史、TVL）  
- [ ] 研究新收益资产（LST/RWA/票据等）的真实收益来源与风险  
- [ ] 用“隐含年化收益率”视角评估 PT 是否出现明显折价  
- [ ] 用小仓尝试新市场，不在早期流动性极浅时重仓冲入  
- [ ] 如参与 LP，考虑无常损失、激励发放周期和解锁规则  
- [ ] 使用简单脚本或表格记录每个新市场的 PT/YT 价格、到期天数、隐含收益  

---

## ✅ 小结

Pendle 新收益市场玩法，不是“看见高 APY 就梭哈”，  
而是把新 LST / 新收益资产拆解成 **收益曲线与折价筹码**：

- 一部分仓位：用 PT 锁定隐含收益；  
- 一部分仓位：用 YT 或 LP 参与价差与激励；  
- 前提是：你对 **协议 + 标的 + 流动性** 的风险，心里有数。

当你不断迭代这套玩法，  
你的地址就会逐渐成为链上眼中的 **“收益曲线玩家”**，  
而不仅仅是“APY 冲浪者”。`
};

/**
 * 37.5 新稳定币引导池
 * 参与新稳定币的流动性引导池（如 Curve Factory Pool），赚取高额奖励。
 */
const STRATEGY_37_5 = {
  title:
    '新稳定币引导池 - 在 Curve 等平台上吃“早期补贴 + 稳定币风险溢价”',
  slug: 'new-stablecoin-liquidity-bootstrapping-pools',
  summary:
    '围绕新稳定币在 Curve / Balancer / Maverick 等平台上启动的流动性引导池（Liquidity Bootstrapping），通过提供稳定币对的 LP 获取高额代币奖励与手续费。但核心并不是盲冲 APR，而是：1）先评估新稳定币的机制、安全性与脱锚风险；2）用“稳定币篮子 + 头寸分层”控制潜在损失；3）利用激励周期内的时间窗口，做“快进快出 + 回本后剩余仓位当票据”的系统化操作。',
  category: 'new-protocols',
  category_l1: 'yield',
  category_l2: 'new-stablecoin-bootstrapping-pools',
  risk_level: 4,
  apy_min: 20,
  apy_max: 600,
  min_investment: 500,
  time_commitment:
    '引导期前几周需高关注度（每天 1-2 小时），之后可减仓转为低频维护',
  status: 'published',
  content: `# 新稳定币引导池 - 在 Curve 等平台上吃“早期补贴 + 稳定币风险溢价”

## 💰 策略概览

| 项目 | 内容 |
|------|------|
| **适用场景** | 新稳定币在 Curve Factory Pool / Balancer / Maverick 等平台的流动性引导池 |
| **操作对象** | 稳定币对 LP（如 newUSD / USDC, newUSD / FRAX 等） |
| **起始资金** | 建议 \$500 - \$10,000，小中仓起步更安全 |
| **潜在收益** | 手续费 + 新稳定币激励 + 协议代币激励 + 生态积分 |
| **风险等级** | ⚠️⚠️⚠️⚠️ 较高 (4/5) —— 新稳定币脱锚风险为主 |
| **难度等级** | 中级（要看得懂稳定币设计与池子参数） |

---

## 📖 开场故事：同样是“新稳定币引导池”，有人吃补贴，有人成“最后接盘人”

新稳定币上线时典型故事线：

1. 项目方宣布：  
   - “我们要在 Curve / Balancer 上开新池，引导流动性！”  
   - “早期 LP 有高 APR + 代币空投 + 生态激励！”  

2. APR 一度飙到三位数甚至四位数；  

3. 但后续发展路径往往分叉：

   - **路径 A：稳健型**  
     - 稳定币机制靠谱，有足够超额抵押或安全资产支撑；  
     - 引导期过后，稳定币逐步被市场接受，池子规模扩大；  
     - 早期 LP 既享受了高 APR，也没有遭遇严重脱锚损失。  

   - **路径 B：脱锚型**  
     - 稳定币设计有缺陷，或资产支撑不透明；  
     - 宏观环境/项目运营出现问题，引发大规模抛售；  
     - 池子中“更健康的稳定币”被抽走，新稳定币堆积，  
       早期 LP 最终成为“托底人”。  

真正有在玩“新稳定币引导池”的老玩家，  
早就总结出一条准则：

> 先看稳定币机制，再看激励，  
> APY 永远排在安全性之后。

---

## 🧠 核心逻辑：新稳定币 = “债券 + 机制风险 + 抵押质量”的综合体

简化来看，一个新稳定币的大致风险来源有：

1. **抵押资产质量**  
   - 是否超额抵押？抵押资产是 BTC/ETH/蓝筹还是长尾？  
   - 是否有链下资产（RWA）？审计与托管是否透明？  

2. **稳定机制设计**  
   - 纯抵押制？算法稳定？部分算法 + 部分抵押？  
   - 是否依赖治理代币回购？  
   - 极端情况下，是否有“死亡螺旋”风险？  

3. **流动性与使用场景**  
   - 是否有真实用例（交易对、借贷抵押、支付场景）？  
   - 流动性是否过于集中在某一池？  

4. **治理与风险准备金**  
   - 是否设有风险基金/保险池？  
   - 是否有应对脱锚的预案（buyback、赎回、利率调整等）？

你在做新稳定币引导池 LP 时，其实是在：

> 用自己的资金，为一个新稳定币的**信用**“背书”，  
> 换取一段时间的高补贴和未来潜在增值。

---

## 🧩 子策略拆分：新稳定币引导池四步走

### 步骤 1：稳定币机制体检（不过关直接 PASS）

体检 Checklist：

- [ ] 白皮书/文档清晰解释：  
  - 抵押资产来源与类型  
  - 铸造/销毁机制  
  - 目标锚定（1 USD / 其他）  
- [ ] 是否有公开审计/托管报告（尤其是 RWA 类资产）  
- [ ] 是否有在主流论坛上被专业人士分析/质疑（正负面都要看）  
- [ ] 是否有应对脱锚的公开方案（赎回机制、回购、罚息等）

对你来说，最简单的决策方式：

> 若你不愿意 **纯持有这个新稳定币**，  
> 也就不适合去当它的 LP。

---

### 步骤 2：池子参数与激励周期分析

关键关注点：

1. **池子结构**  
   - 经典 Curve 稳定池（低滑点）还是更复杂的结构？  
   - 另一侧资产是什么（USDC / DAI / FRAX / LUSD / 其他新稳定币）？  

2. **激励配置**  
   - 激励代币类型：  
     - 项目方代币？Curve / Balancer 治理代币？  
   - 发放周期与节奏：  
     - 是否有减半/结束时间表？  
     - 是否锁仓或需 vesting？  

3. **TVL 与占比**  
   - 当前池子 TVL 在整个稳定币生态中的占比；  
   - 是否一池独大，一旦出事就全挂。

---

### 步骤 3：仓位设计 - 篮子 + 分层

建议把“新稳定币引导池策略”嵌入你的 **稳定币篮子** 里，而不是独立 All-in：

1. **稳定币篮子结构（示意）**  

   - 40-60%：主流稳定币（USDC / USDT / DAI 等）  
   - 20-30%：较成熟的去中心化稳定币（LUSD / FRAX 等）  
   - 10-20%：新稳定币策略（含引导池）  

2. **新稳定币内部再分层**  

   - 科研仓：  
     - 小仓试水，验证机制与池子实际运转；  
   - 挖矿仓：  
     - 在科研仓运行正常后增加仓位，抓引导期主收益；  
   - 长期仓（可选）：  
     - 只有当你充分信任该稳定币后，  
       才考虑持有一部分作为长期多样化。

---

### 步骤 4：退出规则与“脱锚预案”

你需要提前写好“脱锚预案”：

- 若新稳定币价格跌破 0.99、0.97、0.95 时，你的操作是什么？  
- 是分段减仓？直接全撤？  
- 是否有官方赎回/紧急机制可以使用？

建议设定简单明确的规则，例如：

- 价格 < 0.99 且持续超过 24 小时：减仓 25%  
- 价格 < 0.97：再减 50%  
- 价格 < 0.95 且无明确修复措施：考虑清仓  

不要在脱锚发生后才去“现场编剧本”。

---

## 🛠️ 新稳定币池子监控脚本示例（伪代码）

\`\`\`javascript
class StablecoinBootstrappingPoolWatcher {
  constructor(poolName, stableSymbol) {
    this.poolName = poolName;
    this.stableSymbol = stableSymbol;
    this.snapshots = [];
  }

  /**
   * snapshot 示例：
   * {
   *   time: '2025-03-01T12:00:00Z',
   *   price: 0.993,         // 新稳定币相对 1 USD 的价格
   *   tvlUsd: 5000000,
   *   apr: 3.5,             // 即 350% APR
   *   gaugeRewardUsd: 10000 // 单日激励总价值估算
   * }
   */
  addSnapshot(s) {
    this.snapshots.push(s);
  }

  latest() {
    return this.snapshots[this.snapshots.length - 1] || null;
  }

  isDepegged(threshold = 0.99) {
    const last = this.latest();
    if (!last) return false;
    return last.price < threshold;
  }

  avgApr(lastN = 7) {
    const h = this.snapshots.slice(-lastN);
    if (!h.length) return 0;
    const sum = h.reduce((acc, x) => acc + (x.apr || 0), 0);
    return sum / h.length;
  }

  printStatus() {
    const last = this.latest();
    if (!last) {
      console.log('暂无池子数据');
      return;
    }
    console.log('📊 稳定币引导池状态: ', this.poolName);
    console.log(
      \`- 价格: \${last.price.toFixed(4)} | TVL: \$\${last.tvlUsd.toFixed(
        0
      )} | APR: \${(last.apr * 100).toFixed(1)}%\`
    );
    const avg7d = this.avgApr(7);
    console.log(
      \`- 近 7 次采样平均 APR: \${(avg7d * 100).toFixed(1)}%\`
    );
    if (this.isDepegged(0.99)) {
      console.log('⚠️ 警告：新稳定币已低于 0.99，需关注脱锚风险');
    }
  }
}
\`\`\`

---

## 📊 风控与资金上限建议

\`\`\`javascript
const NEW_STABLE_BOOTSTRAP_RISK = {
  MAX_NEW_STABLE_RATIO: 0.2,       // 所有新稳定币相关策略不超过稳定币总仓位 20%
  MAX_SINGLE_STABLE_RATIO: 0.07,   // 单个新稳定币不超过总稳定币 7%
  MAX_BOOTSTRAP_POOL_RATIO: 0.05,  // 单个引导池不超过总稳定币 5%
  DEPEG_ALERT_LEVEL_1: 0.99,
  DEPEG_ALERT_LEVEL_2: 0.97,
  DEPEG_ALERT_LEVEL_3: 0.95,
  BOOTSTRAP_MAX_DAYS: 30           // 单次引导期策略不超过 30 天
};
\`\`\`

---

## 🎯 实战 Checklist

- [ ] 认真阅读新稳定币的机制设计和抵押资产构成  
- [ ] 确认你“愿意单独持有一些该稳定币”，再考虑当 LP  
- [ ] 设计稳定币篮子，将新稳定币仓位控制在合理范围内  
- [ ] 为引导池设定“最大参与天数”和“回本目标”  
- [ ] 使用脚本或面板监控：价格、TVL、APR 与激励变化  
- [ ] 提前写好“脱锚预案”，真正脱锚时直接执行，而不是临时犹豫  

---

## ✅ 小结

新稳定币引导池，是很多项目“撒糖 + 建信用”的主战场：

- 激励确实丰厚；  
- 但你扮演的角色不只是“薅羊毛的人”，  
  更是“早期托底人”。

只要你：

- 把 **稳定币机制体检** 放在第一位；  
- 用 **篮子 + 分层** 思路控制风险；  
- 认真执行事先写好的“脱锚剧本”；  

你就有机会在 **高补贴周期** 里吃到一口肉，  
而不是在 **脱锚现场** 被当成最后的接盘者。`
};

/**
 * 37.6 新 L2 原生 DEX
 * 在新 L2 上线时体验原生 DEX（如 Aerodrome on Base），享受早期高收益。
 */
const STRATEGY_37_6 = {
  title:
    '新 L2 原生 DEX - 把“链原生 DEX”当作整条 L2 的早期杠杆',
  slug: 'new-l2-native-dex-early-liquidity',
  summary:
    '当一条新 L2 上线（如 Base、Blast、Mode 等），往往会同时诞生一批“链原生 DEX”（如 Aerodrome on Base）。围绕这些 DEX，在早期高补贴阶段提供流动性、参与治理、获得空投与积分，本质上是一种“用 DEX 玩整条 L2 早期增长”的策略。核心：1）先判断 L2 本身的叙事与成长潜力；2）筛选真正“链原生、长线运营”的 DEX；3）用“主仓 + 任务仓”的方式参与 LP 与投票，不做纯 FOMO。',
  category: 'new-protocols',
  category_l1: 'yield',
  category_l2: 'new-l2-native-dex',
  risk_level: 4,
  apy_min: 15,
  apy_max: 350,
  min_investment: 500,
  time_commitment:
    '新 L2 上线初期需 1-2 周集中研究，之后按周/月节奏维护仓位',
  status: 'published',
  content: `# 新 L2 原生 DEX - 把“链原生 DEX”当作整条 L2 的早期杠杆

## 💰 策略概览

| 项目 | 内容 |
|------|------|
| **适用场景** | 新 L2（如 Base、Blast、Mode 等）上的原生 DEX（如 Aerodrome）早期阶段 |
| **操作对象** | 原生 DEX 的流动性池（L2 Gas Token / 稳定币 / 生态项目代币）、治理/投票等 |
| **起始资金** | 建议 \$500 - \$5,000，小中仓参与为主 |
| **潜在收益** | 手续费 + DEX 治理代币 + L2 生态激励 + 任务积分 + 潜在空投 |
| **风险等级** | ⚠️⚠️⚠️⚠️ 较高 (4/5) —— DEX 合约风险 + 新 L2 系统性风险 |
| **难度等级** | 中级偏上（需要同时理解 L2 与 DEX 生态） |

---

## 📖 开场故事：同样在新 L2 上做 LP，有人只赚了几次手续费，有人吃到一整轮生态红利

一条新 L2 上线时的典型剧情：

- 官方喊出叙事（扩容、模块化、游戏链、RWA 链、AI 链等等）；  
- 很快出现一批原生 DEX（往往与官方/生态有密切关系）；  
- 各种“早鸟计划 / Points / 治理投票奖励 / 空投预期”集中在这批 DEX 上。

结果出现三类玩家：

1. **只追单一池 APY 型**  
   - 看到某个池子 APY 高，就盲目冲进去；  
   - 不关心 DEX 的可持续性、不关心 L2 整体路线；  
   - 几周后激励减半、流动性迁移、项目方节奏变化，收益急剧缩水。  

2. **只玩短期 MEME 型**  
   - 把新 L2 原生 DEX 当成“MEME 链”，  
   - 不参与治理、不记录 Points、不做长期布局，  
   - 只在 meme 币/高波动池里短线冲杀。  

3. **当成“L2 杠杆”的生态型玩家**  
   - 先判断 L2 本身是否值得长期关注；  
   - 再在该 L2 上挑出 1-2 个“真正链原生 + 深度绑定生态”的 DEX；  
   - 把 LP/治理/任务/空投当成完整组合来运营。

本策略，就是第 3 种：  
**用一个 DEX 做整条 L2 叙事的“操作界面”。**

---

## 🧠 核心逻辑：L2 原生 DEX = “流动性枢纽 + 治理中心 + 激励分发器”

你可以从三个维度理解“链原生 DEX”的价值：

1. **流动性枢纽**  
   - 大部分 L2 上的代币首次流动性会来到原生 DEX；  
   - L2 Gas Token / 生态蓝筹 / 稳定币等关键对都在这里起步。  

2. **治理中心**  
   - DEX 的治理代币（ve 机制、投票经济）往往绑定整条 L2 的激励分配；  
   - 拿到治理票，相当于拿到了“给谁发糖”的遥控器。  

3. **激励分发器**  
   - 官方与生态项目经常通过原生 DEX 池子，  
     向 LP、投票者、任务参与者分发代币与积分。  

> 所以，玩新 L2 原生 DEX，本质上是：  
> 用“流动性参与 + 治理参与”  
> 去 **放大你对整条 L2 的看多/陪跑程度**。

---

## 🧩 子策略拆分：新 L2 原生 DEX 三层参与路线

### 路线 A：基础 LP 与手续费收益（主线）

**目标：**  
- 在相对安全的池子中提供流动性，赚手续费与基础激励。

优先池子：

- L2 Gas Token / ETH / 稳定币 等主流对；  
- 协议有清晰长期规划，非纯 meme；  
- 池子参数（费率、权重）合理，不是纯“吸血池”。

操作建议：

1. 选择 1-3 个“主干池”（如 L2 Gas / USDC、ETH / L2 Gas 等）；  
2. 控制单池资金比例（不超过 L2 总仓位 30-40%）；  
3. 视激励强度与风险，决定持有周期（如 1-4 周一个周期）。

---

### 路线 B：治理代币 / ve 模型参与（上层）

很多原生 DEX 会采用类似 ve(3,3) 的治理与激励模型：

- 质押/锁仓治理代币，获得投票权和额外奖励；  
- 对某些池子投票，可将更多激励导向该池。

玩法示意：

1. 在早期激励期，挖或买入一定量治理代币；  
2. 通过锁仓/投票等方式：  
   - 将激励朝“你参与的池子”倾斜；  
   - 形成一个“自我增强”的小型飞轮。  

但要注意：

- 不要忽略治理代币自身价格波动和锁仓风险；  
- 对 ve 模型的参数（锁仓周期、解锁机制、投票频率）要有清晰认知。

---

### 路线 C：任务 / 积分 / 空投叠加（外层）

新 L2 + 原生 DEX 往往会组合出一系列“增长活动”：

- 交易积分（Volume Points）；  
- LP 积分（Liquidity Points）；  
- 治理/任务积分；  
- 与其它协议联动的联合空投活动。

你的做法：

1. 建一张“L2 原生 DEX 激励总表”：  
   - 记录每个活动的类型、周期、奖励形式、成本估计。  

2. 为不同活动设定参与优先级：  
   - 优先那些与 **长期 LP / 治理参与** 同方向的活动；  
   - 减少那种“必须大量做无意义交易”的刷量任务。  

3. 把“积分/空投预期”纳入整体收益评估，  
   而不是只看当前手续费/APY。

---

## 🛠️ 新 L2 原生 DEX 参与管理脚本（伪代码）

\`\`\`javascript
class L2NativeDexManager {
  constructor(l2Name, dexName) {
    this.l2Name = l2Name;
    this.dexName = dexName;
    this.pools = [];
    this.campaigns = [];
  }

  /**
   * pool 示例：
   * {
   *   id: 'l2-gas-usdc',
   *   pair: 'L2GAS/USDC',
   *   riskLevel: 3,
   *   role: 'core' | 'side' | 'degen',
   *   targetApr: 1.5,    // 150% APR
   *   notes: '主干流动性池'
   * }
   */
  addPool(p) {
    this.pools.push(p);
  }

  listPoolsByRole(role) {
    return this.pools.filter((p) => p.role === role);
  }

  /**
   * campaign 示例：
   * {
   *   id: 'points-season-1',
   *   name: 'L2 原生 DEX Points 季度 1',
   *   startDate: '2025-03-01',
   *   endDate: '2025-04-30',
   *   type: 'points+airdrop',
   *   focus: ['lp', 'trading', 'governance']
   * }
   */
  addCampaign(c) {
    this.campaigns.push(c);
  }

  getOngoingCampaigns(now = new Date()) {
    return this.campaigns.filter((c) => {
      const s = new Date(c.startDate);
      const e = new Date(c.endDate);
      return now >= s && now <= e;
    });
  }

  printOverview() {
    console.log(
      \`📌 \${this.l2Name} - 原生 DEX: \${this.dexName} 参与概览\`
    );
    console.log('池子列表:');
    this.pools.forEach((p) => {
      console.log(
        \`- [\${p.role}] \${p.pair} | 风险: \${p.riskLevel}/5 | 目标 APR: \${(
          (p.targetApr || 0) * 100
        ).toFixed(1)}%\`
      );
    });

    console.log('\\n激励活动:');
    this.campaigns.forEach((c) => {
      console.log(
        \`- \${c.name} (\${c.startDate} ~ \${c.endDate}) | 类型: \${c.type} | 重点: \${c.focus.join(
          ', '
        )}\`
      );
    });
  }
}
\`\`\`

---

## 📊 L2 原生 DEX 仓位与风险参数建议

\`\`\`javascript
const L2_NATIVE_DEX_RISK = {
  MAX_L2_TOTAL_RATIO: 0.25,           // 单条新 L2 相关仓位不超过净资产 25%
  MAX_DEX_ON_L2_RATIO: 0.6,           // 其中用于原生 DEX 的不超过该 L2 仓位 60%
  MAX_SINGLE_POOL_RATIO: 0.25,        // 单池不超过 L2 上 DEX 仓位 25%
  GOVERNANCE_TOKEN_MAX_RATIO: 0.5,    // 治理代币价值不超过该 L2 DEX 仓位 50%
  REVIEW_INTERVAL_DAYS: 7             // 每 7 天复盘一次 L2 & DEX 整体表现
};
\`\`\`

---

## 🎯 实战 Checklist

- [ ] 先评估 L2 本身的叙事与成长空间，不看好的 L2 就不做其原生 DEX 的长线局  
- [ ] 在该 L2 上选择 1-2 个“真链原生 + 跟生态深度绑定”的 DEX，而非泛滥复制盘  
- [ ] 为这些 DEX 设计“主干池 + 辅助池 + degen 池”的仓位结构  
- [ ] 决定是否参与治理代币锁仓/投票，算清楚锁仓风险与预期收益  
- [ ] 建立“L2 原生 DEX 激励看板”，记录 Points / 空投 / 任务的时间轴  
- [ ] 定期（如每周）检查：  
  - DEX TVL、Volume、代币价格、激励变动  
  - 以及 L2 整体新增地址数、Gas 使用情况等指标  

---

## ✅ 小结

新 L2 原生 DEX，是你接入整条 L2 叙事的 **“流动性杠杆”**：

- 通过 LP，你为这条 L2 的早期生态提供了血液；  
- 通过治理，你在某种程度上参与了激励方向的决策；  
- 通过任务与积分，你为未来“整条 L2 的红利清算日”打下筹码。

只要你：

- 不把它当成孤立的“高 APY 池子”，  
- 而是当成 **“L2 资产线的一部分”** 来整体规划；  

你就可以在新 L2 成长的同时，  
用一座原生 DEX，把自己的收益曲线也拉出一条更陡峭的斜率。`
};

/**
 * 上传 37.4 / 37.5 / 37.6 策略到 Directus
 */
async function uploadStrategies() {
  const DIRECTUS_URL = 'http://localhost:8055';

  console.log('开始上传策略 37.4 / 37.5 / 37.6...\n');

  try {
    // 获取新的管理员令牌
    const { execSync } = require('child_process');
    const tokenOutput =
      execSync('./get-new-directus-token.sh').toString();
    const tokenMatch = tokenOutput.match(/DIRECTUS_ADMIN_TOKEN=(.+)/);

    if (!tokenMatch) {
      throw new Error('Failed to get admin token');
    }

    const ADMIN_TOKEN = tokenMatch[1].trim();

    const headers = {
      Authorization: `Bearer ${ADMIN_TOKEN}`,
      'Content-Type': 'application/json'
    };

    // 上传策略 37.4
    console.log('上传策略 37.4: Pendle 新收益市场...');
    await axios.post(`${DIRECTUS_URL}/items/strategies`, STRATEGY_37_4, {
      headers
    });
    console.log('✅ 策略 37.4 上传成功\\n');

    // 上传策略 37.5
    console.log('上传策略 37.5: 新稳定币引导池...');
    await axios.post(`${DIRECTUS_URL}/items/strategies`, STRATEGY_37_5, {
      headers
    });
    console.log('✅ 策略 37.5 上传成功\\n');

    // 上传策略 37.6
    console.log('上传策略 37.6: 新 L2 原生 DEX...');
    await axios.post(`${DIRECTUS_URL}/items/strategies`, STRATEGY_37_6, {
      headers
    });
    console.log('✅ 策略 37.6 上传成功\\n');

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

// 若需要在 Node 中直接运行本文件写入策略，可以解除下面一行注释：
uploadStrategies();
