// 策略 37.1 & 37.2 & 37.3: 新池新协议流动性 (new-pools-and-protocols)

const axios = require('axios');

/**
 * 37.1 新 DEX 首池流动性
 * 在新 DEX 上线时提供首批流动性，享受超高 APY 和项目方代币奖励。
 */
const STRATEGY_37_1 = {
  title:
    '新 DEX 首池流动性 - 把“首批 LP”玩成高赔率但受控的风险仓',
  slug: 'new-dex-first-liquidity-pools',
  summary:
    '围绕新 DEX 刚上线时常见的“首池超高 APR + 代币奖励”机会，设计一套有章法的首批 LP 策略。核心不是盲目冲高 APR，而是：1）用白名单 & 团队背景 & 合约审计做第一轮筛选；2）用“小仓打样 + 快速回本 + 剩余吃长尾”的节奏管理风险；3）用工具脚本监控 TVL、价格、APR 和池子健康度，做到“可进可退”。',
  category: 'new-protocols',
  category_l1: 'airdrop',
  category_l2: 'new-protocols',
  risk_level: 4,
  apy_min: 30,
  apy_max: 600,
  min_investment: 500,
  time_commitment:
    '首周需要较高关注度（每天 1-3 小时），后续可视情况减仓或转持',
  status: 'published',
  content: `# 新 DEX 首池流动性 - 把“首批 LP”玩成高赔率但受控的风险仓

## 💰 策略概览

| 项目 | 内容 |
|------|------|
| **适用场景** | 新 DEX 上线初期的首批流动性池（常常伴随高 APR 和代币激励） |
| **起始资金** | 约 $500 - $5,000（越新越 degen，越应该小仓） |
| **潜在收益** | 超高 APR、平台/项目方代币空投、OG 身份、NFT 等 |
| **风险等级** | ⚠️⚠️⚠️⚠️ 较高 (4/5) —— 合约风险、项目风险、流动性风险叠加 |
| **难度等级** | 中级偏上（需要基本 LP 知识和风险识别能力） |

---

## 📖 开场故事：同样是“首批 LP”，有人回本后白嫖长尾，有人被套在地板

新 DEX 上线的典型画面：

- 官方打出 “1,000% APR / 双挖 / OG 空投 / NFT 白名单” 的口号；  
- 早期 TVL 很小，收益率一度夸张；  
- Twitter / TG 各种 FOMO 情绪拉满。

结果常见三种结局：

1. **FOMO 冲顶型**  
   - 在 APR 面板看到 3,000% 就上头梭哈；  
   - 不看合约、不看团队、不管 TVL；  
   - 若项目中途 rug / UI 出问题 / 价格暴跌，很难及时撤退。  

2. **错失恐惧型**  
   - 觉得风险太大，从不碰新 DEX；  
   - 几次看着别人拿到不错收益，自己只敢站在岸上。  

3. **有 SOP 的“首池猎人”**  
   - 先从项目基本面、合约风险、资金体量做筛选；  
   - 用“小仓 + 快速回本 + 剩余滚收益”的节奏参与；  
   - 每天看的是 APR/TVL/价格曲线，而不是 Discord 喊单。  

本策略，就是帮你从 1/2 类，变成第 3 类。

---

## 🧠 核心逻辑：新 DEX 首池，赌的是“早期高补贴 + 没出事”

你在做的事情，本质上是：

> 用有限资金，  
> 去买一段 “高补贴但不持久” 的时间窗口，  
> 希望在窗口关闭之前，  
> 尽量回本甚至锁定一部分超额收益。

关键有三点：

1. **生存优先**  
   - 合约不能出大问题；  
   - 项目方不要直接 rug 或恶意修改参数。  

2. **回本优于暴富**  
   - 先把本金+一部分利润拿回来；  
   - 剩余仓位当“长尾彩票”。  

3. **信息与监控**  
   - 不做“盲人 LP”；  
   - 需要看价格、TVL、激励变化和社群动态。

---

## 🧩 子策略拆分：新 DEX 首池 LP 四步走

### 步骤 1：项目与池子筛选（避免送人头）

**基本过滤问题：**

1. 项目/团队背景：  
   - 是否有公开团队、投资机构、以往项目经历？  
   - 是否至少通过了一家还算靠谱的审计？  

2. 合约与权限：  
   - 流动性池合约是否可升级？  
   - 项目方是否有 “紧急暂停 / 管理员” 权限？  
   - 能否看到代码中的关键参数（费率、奖励分配）？  

3. 池子维度：  
   - 是主流币对（例如 ETH/USDC、WETH/WBTC），还是屎币对？  
   - 初始 TVL 是否太小（1-2 万刀级容易被大户一脚掀翻）；  
   - 奖励 Token 是新币还是较成熟资产？

**入场建议：**

- 优先：主流资产对 + 合约开源 + 有基础审计的池子；  
- 谨慎：新币对 / 较复杂机制（如高度定制 AMM 曲线）；  
- 回避：团队完全匿名 + 无审计 + TVL 极小 + 代码不可见。

---

### 步骤 2：仓位规划与“回本路线”

给自己一个简单算式：

\`\`\`
预期持仓天数 × 当前 APR ≈ 大致收益区间
\`\`\`

举例（只做粗算）：

- 池子界面显示 APR = 800%（注意很多是“瞬时年化”）  
- 你判断这个高 APR 也就能挺 3-7 天；  
- 你计划持仓 3 天就开始减仓，7 天内完成回本。  

你可以：

1. 只投入你愿意“全损也不心疼”的金额，例如 $1,000；  
2. 设定回本规则：  
   - 当累计收益 ≈ 投入本金 50-100% 时，  
   - 自动把一半仓位撤出回到主链/稳定币；  
3. 剩余 LP 视为“免费筹码”，  
   - 可以随池子收益和项目发展继续持有或分批退出。

---

### 步骤 3：监控 TVL / 价格 / APR

三个核心指标：

1. **TVL**  
   - 总 TVL 上升 → 其他人也在进场，APR 通常会下降；  
   - TVL 突然快速下降 → 可能有人大额撤退/项目有利空。  

2. **价格**  
   - 对 LP 来说，无常损失是关键；  
   - 若新币价格单边暴跌，你拿到的“奖励 + 手续费”，  
     未必能覆盖价格跌幅。  

3. **APR / 激励政策**  
   - 项目方可能随时调整奖励力度（减产、迁移、结束活动）；  
   - 需要关注公告和前端显示的最新数据。

---

### 步骤 4：退出与迁移策略

你需要提前想好三种退出场景：

1. **顺利回本后**  
   - 主动减仓，把本金+部分利润提走；  
   - 剩余 LP 票当长尾，不再盯盘太狠。  

2. **APR 不断下降**  
   - 当 APR 低于你认为“值得承担风险”的水平（例如 50-80%）；  
   - 将 LP 撤出，换成主流资产或转去其他池子。  

3. **TVL/价格异常波动或负面消息**  
   - TVL 暴跌、价格闪崩、项目负面舆情；  
   - 优先考虑“先撤一半再说”，再根据情况决定是否全退。

---

## 🛠️ 新 DEX 首池监控脚本示例（伪代码）

\`\`\`javascript
class NewDexPoolWatcher {
  constructor(poolId) {
    this.poolId = poolId;
    this.history = [];
  }

  /**
   * tick 示例：
   * {
   *   time: '2025-03-01T12:00:00Z',
   *   tvlUsd: 120000,
   *   apr: 4.5,          // 4.5 = 450%
   *   priceToken0: 1.02,
   *   priceToken1: 0.99
   * }
   */
  addSnapshot(tick) {
    this.history.push(tick);
  }

  latest() {
    return this.history[this.history.length - 1] || null;
  }

  tvlTrend(lastN = 5) {
    const h = this.history.slice(-lastN);
    if (h.length < 2) return null;
    const start = h[0].tvlUsd;
    const end = h[h.length - 1].tvlUsd;
    const change = end - start;
    const pct = start > 0 ? change / start : 0;
    return { start, end, change, pct };
  }

  aprTrend(lastN = 5) {
    const h = this.history.slice(-lastN);
    if (h.length < 2) return null;
    const start = h[0].apr;
    const end = h[h.length - 1].apr;
    const change = end - start;
    const pct = start > 0 ? change / start : 0;
    return { start, end, change, pct };
  }

  printStatus() {
    const latest = this.latest();
    if (!latest) {
      console.log('暂无数据');
      return;
    }
    console.log('📊 当前池子状态:');
    console.log(
      '- TVL: $' + latest.tvlUsd.toFixed(0),
      '| APR: ' + (latest.apr * 100).toFixed(1) + '%',
      '| 价格 Token0: ' + latest.priceToken0.toFixed(4),
      '| 价格 Token1: ' + latest.priceToken1.toFixed(4)
    );

    const tTvL = this.tvlTrend();
    const tApr = this.aprTrend();
    if (tTvL) {
      console.log(
        'TVL 近几次变动: ',
        (tTvL.pct * 100).toFixed(2) + '%'
      );
    }
    if (tApr) {
      console.log(
        'APR 近几次变动: ',
        (tApr.pct * 100).toFixed(2) + '%'
      );
    }
  }
}
\`\`\`

---

## 📊 风控与资金管理建议

\`\`\`javascript
const NEW_DEX_FIRST_LP_RISK = {
  MAX_TOTAL_BUDGET_USD: 5000,      // 新 DEX 首池总预算上限
  MAX_PER_POOL_RATIO: 0.3,         // 单个池子不超过首池预算 30%
  MAX_DEGEN_RATIO: 0.5,            // 新 DEX / 极早期协议不超过总净资产 5-10%（按人自定）
  TARGET_PAYBACK_DAYS: 3,          // 尽量在 3-7 天内完成本金回收
  ALERT_TVL_DROP_PCT: 0.3,         // TVL 近 24 小时下跌 >30% 视作强警报
  ALERT_PRICE_MOVE_PCT: 0.25       // 任一资产单日波动 >25% 需重新评估仓位
};
\`\`\`

---

## 🎯 实战 Checklist

- [ ] 只对“有代码、有审计、有团队、有生态愿景”的新 DEX 做首池 LP  
- [ ] 严格控制单池预算，不在任何一池里 All-in  
- [ ] 进入前就设定“回本天数 + 减仓规则”，并写在 Notion/表格里  
- [ ] 至少每天看一次 TVL / APR / 价格，并记录极端变化  
- [ ] 遇到 TVL 急速下跌或负面消息，优先考虑撤出再评估  
- [ ] 把“已经回本的 LP 仓位”标记出来，心态上视作免费筹码  
- [ ] 定期复盘：哪些项目是“值得长期跟”、哪些只是“一次性挤牙膏”  

---

## ✅ 小结

新 DEX 首池 LP 是一条 **高赔率 + 高风险** 的线：

- 不适合当作你的主力仓位；  
- 也不能完全无视——因为那是很多项目早期向社区“撒糖”的方式。

只要你：

- 守住“小仓 + 快速回本”的底线；  
- 用数据而不是情绪来决定进退；  

首池 LP 就能从“赌命游戏”  
变成你多策略组合中 **一条高弹性、可控的小支线**。`
};

/**
 * 37.2 Uniswap V4 Hooks 早期池
 * 在 Uniswap V4 上线后抢先体验 Hooks 功能池，获取早期采用者奖励。
 */
const STRATEGY_37_2 = {
  title:
    'Uniswap V4 Hooks 早期池 - 利用“可编程 LP”刷一份未来 DEX OG 简历',
  slug: 'uniswap-v4-hooks-early-pools',
  summary:
    '围绕 Uniswap V4 的 Hooks 机制（可编程池逻辑），在协议上线初期抢先参与各种新型 LP 池与策略 Hooks。核心玩法：1）优先参与官方/头部团队提供的安全 Hooks；2）谨慎探索实验性池子，记录策略效果与风险；3）把参与历史变成“Uniswap V4 早期可编程 LP 用户”画像，为未来生态空投、治理激励和项目合作留下筹码。',
  category: 'new-protocols',
  category_l1: 'airdrop',
  category_l2: 'new-protocols',
  risk_level: 4,
  apy_min: 15,
  apy_max: 400,
  min_investment: 500,
  time_commitment:
    '前期需要较密集研究和试错（1-2 周），之后以“策略巡检”方式维护',
  status: 'published',
  content: `# Uniswap V4 Hooks 早期池 - 利用“可编程 LP”刷一份未来 DEX OG 简历

## 💰 策略概览

| 项目 | 内容 |
|------|------|
| **适用场景** | Uniswap V4 上带有 Hooks 的早期流动性池、策略池、实验池 |
| **起始资金** | 约 $500 - $5,000 |
| **潜在收益** | 手续费收益 + Hooks 策略带来的增强收益 + 早期用户/生态空投/治理激励 |
| **风险等级** | ⚠️⚠️⚠️⚠️ 较高 (4/5) —— 合约/策略复杂度显著高于 V2/V3 |
| **难度等级** | 中高级（需要理解 LP 与 Hooks 基本机制） |

---

## 📖 开场故事：同样是“用过 UniV4 的人”，你想站在哪一档？

未来某天，当别人问你：

> “你当年在 Uniswap V4 Hooks 刚出来那会，做过什么？”

可能出现三种回答：

1. “啊？我当时只是在 V3 上做过一点 LP，V4 的 Hooks 太复杂了，就没碰。”  
2. “我当时跟着几个帖子随便进了几个池子，后来被波动、策略 Bug 搞得很惨，就不玩了。”  
3. “我当时玩过最早几批官方/生态的 Hooks 池子，还记录了策略效果和踩坑经验。”  

当后续：

- V4 Hooks 成为主流 DEX 的基建；  
- 各种项目在 V4 Hooks 之上搭建复杂策略产品；  
- Uniswap/生态可能对“早期 V4 可编程 LP 用户”做额外激励；

第 3 类人的地址画像，  
会显得尤其有“重量”。

本策略，就是帮你有序地成为第 3 类人。

---

## 🧠 核心逻辑：V4 Hooks = “可编程 AMM”，机会与坑并存

相较于 V3 的集中流动性，V4 Hooks 多了一个维度：

> 池子逻辑可以被代码增强或改变。  

常见 Hook 能力可能包括（视最终实现细节而定）：

- 动态费率（随波动或 TVL 调节）；  
- TWAP/预言机增强；  
- 特定价位触发额外逻辑（如自动再平衡、止盈止损）；  
- 内置的激励分配、动态费用 rebate；  
- 更多“DeFi 乐高式”组合。

你的机会在于：

- 早期参与相对安全、逻辑清晰的 Hooks 池，  
- 同时谨慎探索实验性策略，  
- 建立一份“可编程 LP 实战记录”。

---

## 🧩 子策略拆分：V4 Hooks 早期池三层参与路线

### 路线 A：官方 & 核心生态 Hooks（安全优先）

**目标：**  
- 在“风险相对可控”的前提下，获得 V4 早期使用记录。

实践建议：

1. 优先关注：  
   - 官方推出的示范 Hooks 池；  
   - 由 Uniswap Labs / 核心开发团队 / 顶级审计方背书的策略。  

2. 操作步骤：  
   - 选择主流资产对（ETH/USDC、ETH/USDT、WBTC/ETH 等）；  
   - 以小中仓位为主，感受 Hooks 如何影响收益与仓位表现；  
   - 记录：手续费收益、价格波动下的表现，与 V3 相比有哪些体验差异。  

3. 这部分仓位的目标不是“暴利”，而是：  
   - 建立一个安全的 V4 LP 基本盘；  
   - 让地址在官方视角中成为“早期 V4 正常用户”。

---

### 路线 B：策略型 Hooks 池（收益与风险兼具）

**目标：**  
- 在可接受的风险内，尝试具备一定策略逻辑的 Hooks 池。

例子（示意）：

- 自动再平衡策略 Hooks；  
- 动态费率 + 波动捕捉策略；  
- 特定价位触发 Maker-like 仓位管理。

参与方式：

1. 精读文档与参数：  
   - 策略如何工作？  
   - 关键参数通过什么方式配置？  
   - 是否有 backtest / 仿真数据？  

2. 以“小仓试验仓”参与：  
   - 例如总资产的 0.5-2%，  
   - 观察 1-2 周：  
     - 实际收益 vs 预期；  
     - 波动行情下是否性能崩坏。  

3. 若策略表现良好：  
   - 可以小幅放大仓位；  
   - 或者将经验记录整理成“自己的一套 Hooks 策略标签库”。

---

### 路线 C：高风险/实验性 Hooks 池（研究向）

**目标：**  
- 更多是技术研究 & 经验积累，而不是盈利主线。  

包括：

- 完全新颖的 AMM 曲线 Hook；  
- 杠杆、期权、衍生品类 Hooks；  
- 与 GameFi/实验项目结合的 Hooks 池。

操作建议：

1. 一律小仓甚至“科研仓”：  
   - 将仓位视作“学习成本”；  
   - 不指望其贡献主收益。  

2. 重视安全性：  
   - 是否多重审计？  
   - 是否有 bug bounty？  
   - 是否有逻辑上显而易见的单点风险？  

3. 重点在“记录与反思”：  
   - 哪类 Hook 易出问题？  
   - 哪类机制对 LP 更友好？  
   - 未来如果你自己想做 Hook 或策略产品，有哪些经验可以复用？

---

## 🛠️ Hooks 池参与记录脚本（伪代码）

\`\`\`javascript
class UniV4HookPoolLogger {
  constructor(address) {
    this.address = address;
    this.positions = [];
  }

  /**
   * position 示例：
   * {
   *   poolId: '0xabc...',
   *   hookAddress: '0xhook...',
   *   pair: 'ETH/USDC',
   *   type: 'official' | 'strategy' | 'experimental',
   *   initValueUsd: 1000,
   *   openDate: '2025-03-01',
   *   closeDate: null,
   *   notes: '官方示例池，动态费率 Hook'
   * }
   */
  addPosition(p) {
    this.positions.push(p);
  }

  closePosition(poolId, closeDate) {
    const pos = this.positions.find((p) => p.poolId === poolId);
    if (pos) pos.closeDate = closeDate;
  }

  listByType(type) {
    return this.positions.filter((p) => p.type === type);
  }

  printSummary() {
    console.log('📊 Uniswap V4 Hooks 参与摘要:');
    const byType = { official: 0, strategy: 0, experimental: 0 };
    this.positions.forEach((p) => {
      byType[p.type] = (byType[p.type] || 0) + 1;
    });
    Object.entries(byType).forEach(([t, c]) => {
      console.log('- 类型 ' + t + ': ' + c + ' 个池子');
    });
  }
}
\`\`\`

---

## 📊 风控参数与资金结构建议

\`\`\`javascript
const UNIV4_HOOKS_RISK = {
  MAX_TOTAL_V4_BUDGET_RATIO: 0.2,     // 所有 V4 LP 资金不超过净资产 20%
  MAX_EXPERIMENTAL_RATIO: 0.05,       // 实验性 Hooks 池不超过净资产 5%
  MAX_SINGLE_HOOK_POOL_RATIO: 0.05,   // 单池不超过净资产 5%
  MIN_OFFICIAL_POOLS_COUNT: 2,        // 至少参与 2 个官方/核心生态 Hooks 池
  REVIEW_INTERVAL_DAYS: 7             // 每 7 天复盘一次 V4 LP 表现与风险
};
\`\`\`

---

## 🎯 实战 Checklist

- [ ] 阅读 Uniswap V4 Hooks 的基本设计文档，对 “Hooks 能力边界” 有直观认识  
- [ ] 至少参与 2 个官方或核心生态 Hooks 池，作为安全基础盘  
- [ ] 挑选 1-3 个策略型 Hooks 池，以“小试仓位”观察策略表现  
- [ ] 对任何实验性 Hooks 池，都视作“科研仓位”，仓位极小、重在学习  
- [ ] 用脚本或表格记录每个池子的 Hook 类型、参数、收益和踩坑点  
- [ ] 定期复盘：哪些 Hook 模式对 LP 更友好？哪些风险大于收益？  

---

## ✅ 小结

Uniswap V4 Hooks 很可能是未来一大批“可编程 DEX 产品”的底层基建：

- 早期就参与其中、理解其机制、积累实战数据；  
- 对你之后无论是做 LP、做策略产品、做研究，都极有价值。  

你不必成为“写 Hook 的人”，  
但可以成为那批 **最早认真使用 Hooks 的 LP 用户**。`
};

/**
 * 37.3 新借贷协议首批存款
 * 在新借贷协议上线时存入首批资产,享受高额借贷挖矿奖励（需评估安全性）。
 */
const STRATEGY_37_3 = {
  title:
    '新借贷协议首批存款 - 高额挖矿奖励背后的安全边界怎么画？',
  slug: 'new-lending-protocol-first-deposits',
  summary:
    '针对新上线借贷协议普遍会推出的“首批存款挖矿/高 APY 激励”，设计一套从安全审查、资金分层、挖矿周期管理到退出策略的完整 SOP。核心理念：1）安全性永远排在收益前；2）只用“小仓 + 分层 + 有限周期”玩首批挖矿；3）把优质新协议筛出来，逐步纳入长期借贷组合，而不是只当一次性矿场。',
  category: 'new-protocols',
  category_l1: 'airdrop',
  category_l2: 'new-protocols',
  risk_level: 4,
  apy_min: 20,
  apy_max: 500,
  min_investment: 500,
  time_commitment:
    '起步 1-2 天评估与部署，挖矿周期内每天/隔日关注一次指标',
  status: 'published',
  content: `# 新借贷协议首批存款 - 高额挖矿奖励背后的安全边界怎么画？

## 💰 策略概览

| 项目 | 内容 |
|------|------|
| **适用场景** | 新借贷协议上线初期，针对存款方推出的高 APR 挖矿/激励活动 |
| **起始资金** | 约 $500 - $5,000（强烈建议按“科研仓 + 小利润仓”对待） |
| **潜在收益** | 存款利息 + 平台代币挖矿奖励 + 积分/OG 身份/NFT 等 |
| **风险等级** | ⚠️⚠️⚠️⚠️ 较高 (4/5) —— 合约风险、清算机制风险、Oracle 风险叠加 |
| **难度等级** | 中高级（需要基本借贷协议与清算机制认知） |

---

## 📖 开场故事：首批存款挖矿，有人变成“长期白名单用户”，有人变成“第一批受害者”

当一个新借贷协议上线，常见营销话术是：

- “首批存款 APY 200%+”  
- “早期矿工额外空投加成”  
- “OG 存款人将获得特殊权益”  

但现实往往如下：

1. 有协议经过充分审计，机制合理，  
   早期参与者既拿到不错收益，也成为长期用户；  

2. 也有协议由于预言机问题、清算机制设计不佳或开发 Bug，  
   在某个极端行情中出现坏账或严重损失，  
   首批存款人在“最高收益期”同样也是“最高风险人群”。  

你要做的，不是：

> “看到 300% APY 就梭哈”，  

而是：

> 把“首批存款”当作一种 **高风险试验 + 选协议过程**，  
> 用一套 SOP 控制可损失金额，  
> 顺便筛出能进入你长期组合的优质借贷协议。

---

## 🧠 核心逻辑：新借贷协议要先过“三道关”

1. **合约与机制安全关**  
   - 审计情况如何？  
   - 是否 fork 自成熟协议？  
   - 清算、预言机、利率曲线设计是否有明显漏洞？  

2. **团队与资金背景关**  
   - 团队是否公开？  
   - 是否有知名机构/天使投资？  
   - 官方沟通是否专业，文档是否扎实？  

3. **激励与周期关**  
   - 高 APR 会持续多久？  
   - 是否存在项目方可以随时“抽梯子”的参数？  
   - 你的“预期挖矿周期 + 退出时点”在哪里？

只有过了前两关，才考虑第三关的收益。

---

## 🧩 子策略拆分：新借贷协议首批存款四步走

### 步骤 1：安全性粗筛（不合格直接 PASS）

快速 checklist：

- [ ] 合约是否开源？  
- [ ] 是否有至少一次审计报告？审计机构是否靠谱？  
- [ ] 是否 fork 自 Aave / Compound 等成熟协议？若是，自定义改动多不多？  
- [ ] 是否采用可信预言机（如 Chainlink）？  
- [ ] 是否有清晰的风险参数文档（LTV、清算罚金、利率模型）？  

如果绝大部分问题答案都是 “不确定 / 没有”：

- 就算 APY 写 1000% 也可以直接当没看到。

---

### 步骤 2：资金分层 - 科研仓 vs 挖矿仓

为自己设计三层资金结构：

1. **科研仓**（最小仓位）  
   - 只为体验协议、测试 UI 和流程存在；  
   - 金额小到“完全损失也不会影响心情”。  

2. **挖矿仓**（小中仓位）  
   - 在科研仓没出问题后，再增加一部分资金；  
   - 目标是“在有限周期内拿到较可观挖矿收益”；  
   - 这部分也要有**亏损上限**。  

3. **长期仓（可选）**  
   - 只有当协议经过时间验证，  
   - 且你认可其长期价值时，  
   - 才考虑增加更大、长期持有的存款。

---

### 步骤 3：挖矿周期设计

针对首批存款挖矿，你可以这样规划：

1. 明确活动周期：  
   - 起止时间、是否会延长、奖励如何计算（实时 vs 线性解锁）  

2. 粗算收益：  
   - 按当前 APY 和你的计划持仓天数，  
   - 估算能拿到多少协议代币/利息。  

3. 设定退出规则：  
   - 当累计收益达到本金 X% 时（例如 50-100%），  
   - 考虑提前收回一部分或全部本金；  
   - 以后若继续参与，视作“已回本的长期游戏”。

---

### 步骤 4：监控指标与退出触发器

关键需要关注：

1. **协议 TVL 与资产分布**  
   - TVL 是否健康增长？  
   - 是否某单一资产占比过高？  

2. **借贷利用率**  
   - 存款资产的借出比例是多少？  
   - 若利用率极低，激励是否可持续？  
   - 若利用率极高，是否存在清算风险集中问题？  

3. **预言机与清算事件**  
   - 是否发生过异常清算？  
   - 社区是否有关于“清算 Bug / 预言机错误”的反馈？  

4. **项目方治理/参数修改**  
   - 是否频繁、随意修改关键参数（利率、LTV、激励分配）？  
   - 是否有透明的治理流程？

当看到：

- TVL 急速流失；  
- 预言机/清算发生争议事件；  
- 激励大幅降低但风险不变；  

应优先考虑**减仓或撤出**。

---

## 🛠️ 新借贷协议参与记录与风险评估脚本（伪代码）

\`\`\`javascript
class NewLendingProtocolTracker {
  constructor(name) {
    this.name = name;
    this.deposits = [];
    this.events = [];
  }

  /**
   * deposit 示例：
   * {
   *   asset: 'USDC',
   *   amount: 1000,
   *   startDate: '2025-03-01',
   *   type: 'research' | 'mining' | 'long-term',
   *   apy: 2.5,        // 即 250%
   *   incentiveToken: 'NEW',
   *   notes: '首批存款挖矿'
   * }
   */
  addDeposit(d) {
    this.deposits.push(d);
  }

  /**
   * event 示例：
   * {
   *   date: '2025-03-05',
   *   type: 'risk',
   *   title: '预言机价格异常',
   *   details: '社区反馈 ORACLE 延迟更新'
   * }
   */
  addEvent(e) {
    this.events.push(e);
  }

  listDepositsByType(type) {
    return this.deposits.filter((d) => d.type === type);
  }

  riskSummary() {
    const riskEvents = this.events.filter((e) => e.type === 'risk');
    const governanceEvents = this.events.filter(
      (e) => e.type === 'governance'
    );
    return { riskEventsCount: riskEvents.length, governanceEventsCount: governanceEvents.length };
  }

  printOverview() {
    console.log('📌 新借贷协议参与概览: ' + this.name);
    console.log('存款记录数量: ' + this.deposits.length);
    const risk = this.riskSummary();
    console.log(
      '风险事件: ' +
        risk.riskEventsCount +
        ' | 治理/参数变更事件: ' +
        risk.governanceEventsCount
    );
  }
}
\`\`\`

---

## 📊 新借贷协议风控参数建议

\`\`\`javascript
const NEW_LENDING_PROTOCOL_RISK = {
  MAX_TOTAL_NEW_LENDING_RATIO: 0.15,  // 所有“新借贷协议”资金不超过净资产 15%
  MAX_PER_PROTOCOL_RATIO: 0.05,       // 单新协议不超过净资产 5%
  MAX_RESEARCH_VS_MINING_RATIO: 0.4,  // 科研仓不低于新协议资金的 40%
  MAX_MINING_PERIOD_DAYS: 30,         // 单次“首批挖矿”周期不超过 30 天
  EXIT_ON_RISK_EVENT: true            // 一旦出现高危事件（坏账/清算事故），优先减仓
};
\`\`\`

---

## 🎯 实战 Checklist

- [ ] 只参与 **代码开源 + 有审计 + 使用成熟预言机** 的借贷协议首批挖矿  
- [ ] 先用“小号 + 小资金”做科研仓，完整走完存款/取款流程  
- [ ] 再按比例增加挖矿仓，设定明确的挖矿周期与回本目标  
- [ ] 持续关注：TVL 变化、借贷利用率、清算事件与社区反馈  
- [ ] 若出现预言机异常、清算 Bug、坏账传闻，优先减仓或全撤出  
- [ ] 对表现稳定、治理透明的新协议，考虑纳入长期借贷组合  

---

## ✅ 小结

新借贷协议首批存款挖矿，是一条 **“高奖励 + 高复杂风险”** 的线路：

- 不适合作为你整个借贷仓位的主阵地；  
- 更应该被当作“新协议筛选 + 小仓挖矿”的综合玩法。  

只要你：

- 不被高 APY 冲昏头；  
- 严格遵守“小仓 + 分层 + 有限周期”原则；  
- 用数据与记录代替模糊印象；  

那么，就有机会：

- 在 **可承受的风险范围内** 挖到早期激励；  
- 顺便选出几家真正能成为你“长期借贷主力”的新协议。`
};

/**
 * 上传 37.1 / 37.2 / 37.3 策略到 Directus
 */
async function uploadStrategies() {
  const DIRECTUS_URL = 'http://localhost:8055';

  console.log('开始上传策略 37.1 / 37.2 / 37.3...\n');

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

    // 上传策略 37.1
    console.log('上传策略 37.1: 新 DEX 首池流动性...');
    await axios.post(`${DIRECTUS_URL}/items/strategies`, STRATEGY_37_1, {
      headers
    });
    console.log('✅ 策略 37.1 上传成功\\n');

    // 上传策略 37.2
    console.log('上传策略 37.2: Uniswap V4 Hooks 早期池...');
    await axios.post(`${DIRECTUS_URL}/items/strategies`, STRATEGY_37_2, {
      headers
    });
    console.log('✅ 策略 37.2 上传成功\\n');

    // 上传策略 37.3
    console.log('上传策略 37.3: 新借贷协议首批存款...');
    await axios.post(`${DIRECTUS_URL}/items/strategies`, STRATEGY_37_3, {
      headers
    });
    console.log('✅ 策略 37.3 上传成功\\n');

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
