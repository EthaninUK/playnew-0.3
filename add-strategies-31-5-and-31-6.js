// 策略 31.5 & 31.6: 成本与流程套利 (cost-process-arbitrage)

const axios = require('axios');

/**
 * 31.5 Gas 费优化套利
 */
const STRATEGY_31_5 = {
  title: 'Gas 费优化套利 - 把链上手续费变成你的优势',
  slug: 'gas-fee-optimization-arbitrage',
  summary:
    '围绕不同链（L1/L2/侧链）的 Gas 费用周期、拥堵模式与清算窗口，设计一套“Gas 费优化 + 批量执行 + L2/侧链迁移”的执行体系：在 Gas 低谷时段打包执行一批交易，利用 L2/侧链承载高频操作，在不改变策略本身风险收益结构的前提下，将长期的手续费成本压缩 30-80%，等效于给所有链上策略增加一层稳定的无风险年化。',
  category: 'cost-process-arbitrage',
  category_l1: 'arbitrage',
  category_l2: 'cost-process-arbitrage',
  risk_level: 3,
  apy_min: 5,
  apy_max: 25,
  min_investment: 500,
  time_commitment: '前期 1-2 周搭框架，之后每周 2-5 小时维护与执行',
  status: 'published',
  content: `# 31.5 Gas 费优化套利 - 把链上手续费变成你的优势

## 💰 策略概览

| 参数 | 数值 |
|------|------|
| **适用场景** | 高频/中频 DeFi 操作、批量交互、做市、空投任务、节点相关操作 |
| **起步规模** | 几百美元起有意义，规模越大越明显 |
| **收益形式** | 成本降低（少付 Gas）、套利净利提高（同毛收益下净利更高） |
| **预期增厚效果** | 对重度链上玩家，长期可增加 5-25% 的“手续费后年化” |
| **风险等级** | ⚠️⚠️⚠️ 中等 (3/5)（主要是执行延迟与合约风险） |
| **难度等级** | 中级（偏执行系统优化） |
| **适合人群** | 高频 DeFi 玩家、机器人开发者、空投/任务脚本玩家、做市 & MEV 相关角色 |

---

## 📖 开场故事：一年给网络“捐”出去的那几千刀

Luna 是典型的“链上重度玩家”：

- 每天做的事包含：
  - DeFi 借贷再平衡
  - LP 仓位调整
  - 套利/做市机器人日常维护
  - 空投任务批量执行
- 一年下来：
  - 在主网 + L2 的交易次数轻松破 **三四千笔**

刚开始几年，她完全不关心 Gas，只要 MetaMask 一弹窗：

> “确认？OK，签！  
> 不就是几刀 Gas 嘛。”

直到有一天，她在一个区块浏览器里导出了自己的交易记录：

- 过去 12 个月累积 Gas 支出（折算成稳定币）是：
  - **约 5,800 USD**

这些钱本质上都是：

- 为了“把交易广播到链上”支付的基础设施成本  
- 和策略本身的盈亏 **没有直接关系**

她开始问自己一个问题：

> “如果我能在不改变策略风险的前提下，  
>  把 Gas 成本打个 5 折，  
>  那是不是等于白多出来了好几千刀？”

于是她做了几件事：

1. **分析过去一年的 Gas 曲线**：  
   - 哪些时间段 Gas 明显更低（例如某些工作日凌晨）  
   - 哪些是经常拥堵的“高峰时段”（比如美股开盘前后）

2. **给自己的操作做分类**：
   - 必须“立刻执行”的：清算保护、套利窗口、抢跑  
   - 可以“延迟执行 1-3 小时”的：再平衡、存取款、空投任务  
   - 完全可以“批量定时”的：批量签到、批量交互、定期操作

3. **给不同操作设定执行策略**：
   - 高频、对时间敏感的：迁移到 L2/侧链或专门为其准备 Gas 预算  
   - 可延迟的：在 Gas 低谷时段用批处理工具一次性完成  
   - 大额操作：宁可在 Gas 稍贵的时刻执行，也要确保安全和确认速度

一年后，她重新统计：

- 总 Gas 支出 ≈ 2,300 USD  
- 比原来少了约 3,500 USD+  

而这 3,500 USD：

- 并不是来源于多承担风险，而是来自：
  - 更聪明的时间选择  
  - 更合理的链与网络选择  
  - 把“无脑签名”变成“有策略的执行系统”。

Luna 总结说：

> “Gas 并不是‘天降费用’，  
>  很多时候只是你懒得优化的那一块套利空间。”

---

## 🧠 核心逻辑：Gas 费优化套利在做什么？

一句话：

> 把所有链上操作拆成三类：
> - 时间敏感到必须立刻执行的；
> - 可容忍一定延迟的；
> - 完全可以批量/定时的；
> 然后根据 Gas 周期和 L1/L2/侧链环境，
> 为每一类设计各自的 **最优执行路径**。

你要的不是：

- “在最危险的时刻硬省 Gas”  
- 而是在不改变风控前提下，把 **原本无脑浪费的手续费** 统统抠回来。

---

## 🔍 几个关键问题

1. **Gas 周期是什么样的？**

   - 不同链不同，但通常会存在：
     - 某些时区“闲时”（例如美东夜深 + 亚洲深夜）
     - 某些事件驱动高峰（大项目上新、抢空投、市场暴跌）

2. **你的操作中，真正需要“立刻上链”的有多少？**

   - 清算保护  
   - 跨链桥窗口  
   - 刻意抢跑的套利交易  
   - 少数必须跟区块同步的操作

   大部分普通玩家每天所有的链上交互中，  
   真正“必须现在就做”的往往 < 30%。

3. **哪些可以迁移到 L2/侧链？**

   - 高频交互  
   - 签到/任务脚本  
   - 非系统性清算风险的操作  

   L2/侧链的 Gas 往往是 L1 的 1%-10%。

---

## 🧩 子策略拆分：三大模块

### 模块 A：时间维度 - Gas 低谷批量执行

> 对所有“可延迟”的交易进行 **时间重排**，  
> 让它们尽可能发生在 Gas 低谷。

**步骤：**

1. 先做一张“Gas 热力图”：
   - 按小时统计过去 N 周/N 月的平均 Gas（可接第三方 API 或历史数据）  
   - 标出“典型低谷区间”（例如：UTC 某些小时）

2. 对自己的操作做标记：
   - 每一类操作标一个“可接受延迟”的时长：
     - 即时（0-5 分钟以内）  
     - 可延迟（1-3 小时）  
     - 可定时（24 小时内任意时间）

3. 对“可延迟/可定时”的操作：
   - 编排在 Gas 低谷期集中执行  
   - 尤其是批量空投交互、批量存取款、洗牌钱包等

**优点：**

- 不改变策略结构，只改执行时间  
- 对多数人来说，是成本最低、最容易落地的一步

---

### 模块 B：空间维度 - L2/侧链承载高频操作

> 把大量高频操作从昂贵 L1 转移到 L2/侧链。

**适合迁移的场景：**

- 高频 LP 调整（若 L2 有足够深度的相似池）  
- 高频借贷调整（例如 Aave L2 部署 vs L1 部署）  
- 高频任务（空投、签到、小游戏、GameFi）  
- 某些重复的大宗转账路径（L2 ↔ CEX 通道已很成熟时）

**设计要点：**

1. 不要盲目迁移所有操作，先问：
   - L2 的深度/流动性/清算机制是否满足你的策略？  
   - 跨 L1-L2 的桥接风险/成本是否可接受？

2. 可采用“L1 做仓位，L2 做细节”的结构：
   - 大额价值存放在较安全/主流的 L1，  
   - 高频计算/再平衡/任务在 L2 上以较小规模跑，  
   - 定期把 L2 结果汇总回 L1。

---

### 模块 C：执行维度 - 批量化与脚本化

> 把原本“一笔一签”的操作变成 **一批一签/极少数签**。

**方式：**

- 使用多调用合约（Multicall / Batch Call）  
- 使用自动化执行框架（Gelato / Chainlink Automation / 自建 Bot）  
- 使用脚本一次性生成多笔交易（例如一键处理多钱包）

**好处：**

- 降低“每次 MetaMask 弹窗都要签一次”的疲劳  
- 降低每笔操作的人为失误  
- 在某些链上/工具中，可以把多笔操作打包成单笔链上交易，节省 Gas

---

## 🛠️ Gas 低谷执行计划脚本示例

> 下面是一个抽象的“Gas 计划器”示意，用于说明如何把“行动列表 + Gas 曲线”结合起来。

\`\`\`javascript
class GasAwareTaskScheduler {
  constructor() {
    // 预设一个非常粗糙的“按小时平均 Gas 指标”（示例）
    // 实际使用中可以用 API 获取历史数据并动态计算
    this.hourlyGasProfile = {
      0: 40,
      1: 35,
      2: 30,
      3: 28,
      4: 27,
      5: 25, // 示例：5 点是一天中最低之一
      6: 27,
      7: 30,
      8: 35,
      9: 45,
      10: 50,
      11: 55,
      12: 60,
      13: 55,
      14: 50,
      15: 48,
      16: 45,
      17: 40,
      18: 42,
      19: 48,
      20: 52,
      21: 50,
      22: 45,
      23: 42
    };

    /**
     * 任务结构示例：
     * {
     *   id: 'rebalance-aave',
     *   type: 'rebalance',
     *   urgency: 'low' | 'medium' | 'high',
     *   maxDelayHours: 24 // 可容忍延迟
     * }
     */
    this.tasks = [];
  }

  addTask(task) {
    this.tasks.push(task);
  }

  /**
   * 按“在可接受延迟范围内，找到 Gas 最低的时段”来安排任务执行时间
   * @param {Date} now 当前时间
   */
  scheduleTasks(now = new Date()) {
    return this.tasks.map((task) => {
      if (task.urgency === 'high') {
        // 高优先级：直接现在执行
        return { ...task, scheduledAt: now, reason: 'high-urgency-immediate' };
      }

      const maxDelay = task.maxDelayHours || 24;
      const candidates = [];

      for (let h = 0; h <= maxDelay; h++) {
        const candidate = new Date(now.getTime() + h * 3600 * 1000);
        const hour = candidate.getUTCHours(); // 假设用 UTC 统一处理
        const gasScore = this.hourlyGasProfile[hour] ?? 50; // 默认值 50

        candidates.push({ candidate, gasScore });
      }

      // 找到 Gas 指标最小的候选
      candidates.sort((a, b) => a.gasScore - b.gasScore);
      const best = candidates[0];

      return {
        ...task,
        scheduledAt: best.candidate,
        reason: 'gas-optimized',
        estimatedGasScore: best.gasScore
      };
    });
  }

  demo() {
    const now = new Date();
    this.addTask({
      id: 'daily-defi-rebalance',
      type: 'rebalance',
      urgency: 'medium',
      maxDelayHours: 8
    });
    this.addTask({
      id: 'airdrop-batch-call',
      type: 'airdrop',
      urgency: 'low',
      maxDelayHours: 24
    });
    this.addTask({
      id: 'liquidation-protection',
      type: 'risk-critical',
      urgency: 'high',
      maxDelayHours: 0
    });

    const plan = this.scheduleTasks(now);
    console.log('📊 Gas 费优化后的执行计划:');
    plan.forEach((p) => {
      console.log(
        \`- 任务 \${p.id} | 原始紧急度=\${p.urgency} | 计划执行时间=\${p.scheduledAt.toISOString()} | 原因=\${p.reason} | 预计 Gas 指数=\${p.estimatedGasScore}\`
      );
    });
  }
}

// 使用示例：
// const scheduler = new GasAwareTaskScheduler();
// scheduler.demo();
\`\`\`

---

## 📊 风险与边界

\`\`\`javascript
const GAS_OPT_ARB_RISK = {
  MAX_DELAY_HOURS_FOR_NON_CRITICAL: 24, // 非关键任务最大延迟 24 小时
  MAX_DELAY_HOURS_FOR_REBALANCE: 4,     // 涉及仓位风险的再平衡最多延迟 4 小时
  CRITICAL_TASK_IMMEDIATE: true,        // 清算保护/安全相关操作永远立即执行
  L2_SHARE_OF_TRANSACTIONS_TARGET: 0.6, // 目标是至少 60% 高频操作迁移到 L2/侧链
  GAS_BUDGET_MONTHLY: 500               // 预设每月 Gas 预算（超出则要复盘策略）
};
\`\`\`

---

## 🎯 实战 Checklist（31.5）

### 1️⃣ 行为盘点

- [ ] 导出过去 3-12 个月的链上交易记录（按地址/钱包）  
- [ ] 统计 Gas 总支出（按链、按协议、按操作类型）  
- [ ] 根据用途把交易粗分为：
  - 风控类（清算保护、止损、紧急操作）  
  - 策略执行类（套利、做市、再平衡）  
  - 维护 & 任务类（空投、签到、配置调整）

### 2️⃣ Gas 周期认知

- [ ] 查看主链（如 Ethereum）最近 N 周的 Gas 曲线  
- [ ] 找出每天的“便宜时段”和“贵时段”  
- [ ] 找出“事件驱动高峰”（如大热门项目上新日）

### 3️⃣ 规则与工具

- [ ] 为不同类型操作设定“最大可接受延迟”  
- [ ] 为可以延迟的操作建立批量执行脚本/模板  
- [ ] 选择 1-2 条 L2/侧链作为高频操作主战场（如 Arbitrum/Optimism/Polygon 等）

### 4️⃣ 复盘与迭代

- [ ] 每月统计一次：  
  - 上月总 Gas vs 优化前的假设 Gas  
  - 实际节省金额 & 对策略年化的影响  
- [ ] 检查是否存在因延迟执行而增加的仓位风险或错失机会，  
  如有，调整 delay 上限与执行规则。

---

## ✅ 小结

**Gas 费优化套利** 不是“抠门”，而是 **专业玩家的基本素养**：

- 把“必然要付”的基础设施成本，压缩到合理范围；  
- 把“下意识乱签”的操作，变成有组织、有规则的执行系统；  
- 长期来看，相当于给所有策略叠加一个 **无风险增厚因子**。

当你能“看懂自己的 Gas 支出结构”，  
你就已经开始站在另一些玩家看不到的维度上做套利了。  

---

`
};

/**
 * 31.6 跨境汇率套利
 *
 * ⚠️ 重要提示：本策略高度涉及外汇管制、跨境资金流动与 KYC/AML 要求。
 * 实践中必须严格遵守所在国家/地区法律，必要时咨询持牌机构或专业人士。
 */
const STRATEGY_31_6 = {
  title: '跨境汇率套利 - 在法币与加密定价差中寻找“合规价差”',
  slug: 'cross-border-fx-arbitrage',
  summary:
    '利用不同地区法币汇率、P2P 报价、CEX 法币交易对与本地外汇市场之间的价差，在严格合规前提下，构建“法币 ↔ 稳定币 ↔ 法币”的跨境套利路径。通过对比官方汇率、市场汇率与加密平台内隐含汇率，寻找稳健、可重复的小额价差，适合作为专业玩家的补充策略，而非无上限的扩张游戏。',
  category: 'cost-process-arbitrage',
  category_l1: 'arbitrage',
  category_l2: 'cost-process-arbitrage',
  risk_level: 4,
  apy_min: 8,
  apy_max: 60,
  min_investment: 3000,
  time_commitment: '前期 2-4 周搭建路径与合规框架，之后每周 4-8 小时维护',
  status: 'published',
  content: `# 31.6 跨境汇率套利 - 在法币与加密定价差中寻找“合规价差”

> ⚠️ 严肃声明  
> 跨境汇率套利涉及：  
> - 外汇管制  
> - 反洗钱（AML）  
> - 了解你的客户（KYC）  
> - 税务申报与资金来源说明  
>  
> 任何实际行动前，请务必确认：  
> - 你所在国家/地区对外汇与加密资产的监管要求；  
> - 是否需要牌照或向监管机构报备；  
> - 你的行为是否会触及外汇违规或非法经营金融业务的红线。  
>  
> 本文仅提供 **结构性理解与风控框架**，不构成任何法律或合规建议。

---

## 💰 策略概览

| 参数 | 数值 |
|------|------|
| **适用对象** | 拥有多币种账户、跨境场景、且愿意严格合规的玩家或机构 |
| **起步规模** | 建议 ≥ \$3,000（更适合中大额多次反复操作） |
| **收益来源** | 法币汇率差 + P2P 报价差 + CEX 内隐含汇率差 |
| **预期收益区间** | 8-60% 年化（高度依赖监管环境与价差频率） |
| **风险等级** | ⚠️⚠️⚠️⚠️ 中高 (4/5)（政策/合规/对手风控风险） |
| **难度等级** | 高级（需要系统化认知与严谨记录） |
| **适合人群** | 有跨境生活/业务场景、本地/海外账户、并愿意长期合规运营的人 |

---

## 📖 开场故事：同一笔钱，在不同国家“值”的不一样

Max 同时在两个地区有真实生活与合规账户：

- 地区 A：日常工作与家庭所在地  
- 地区 B：长期持有居留权，并有本地银行账户  

他发现一个现象：

- 在地区 A，当地银行给出的 **官方汇率**（A 币 → USD）相对稳定；  
- 但在某些加密平台上的 **法币 P2P 市场**，  
  A 币对 USDT 的实际成交价，经常相对官方汇率 **略贵或略便宜**；  
- 同时，在地区 B，  
  - 本地货币 B 币对 USD 的汇率  
  - 以及 B 币在加密平台 P2P 市场的报价  
  - 和 A 币那边有明显不同。

Max 做了一件很“无聊”的事：

1. 每天用表格记录：

   - 银行 A、银行 B 的“官方报价”（A/USD、B/USD）  
   - CEX/P2P 市场中 A 币买入 USDT 的价格  
   - 同样平台中 B 币买入 USDT 的价格  
   - 以及 CEX 内部 A 币交易对 / B 币交易对的成交价

2. 把这些数据拆成三条“汇率链”：

   - \`A 法币 → USDT\` 的 **全链成本**（含手续费 & 点差）  
   - \`USDT → B 法币\` 的 **全链成本**  
   - 直接在银行/正规渠道中 \`A 法币 → B 法币\` 的成本  

3. 过了几周，他发现：

   - 在完全合规则（额度控制、申报合规）的前提下，  
   - 在部分时间段，通过：
     - 在 A 地区用 A 币买入 USDT  
     - 把 USDT 送到支持 B 币的交易所/P2P  
     - 卖出为 B 币  
   - 实际得到的 B 币数量，比“走传统 A→B 外汇兑换”略高 **1-2%**。

这 1-2%：

- 对于偶尔小额兑换来说没什么；  
- 但对于 **有持续跨境消费/资金安排需求的人** 来说，  
  等同于每年能在合法合规前提下，多拿到一部分“无风险折扣”。

Max 并没有把它当作一个“无限扩张套利生意”，而是：

- 把它当成自己个人/家庭资产跨境配置时的一项“汇率优化能力”；  
- 偶尔也为少数合规的小型企业提供路径咨询服务，  
  收取合理的服务费（在适用法律框架内操作）。

---

## 🧠 核心逻辑：跨境汇率套利在做什么？

一句话：

> 在 **不触犯外汇与金融监管红线** 的前提下，  
> 利用：
> - 银行官方汇率  
> - P2P 市场价格  
> - CEX 现货/期货内隐含汇率  
> 之间的差异，  
> 让同样一笔资金在跨境流动后，  
> 能落地更多目标法币或稳定币。

关键不是：

- 去“无限放大”，做成巨额资金黑箱；  
- 而是在 **有正当跨境需求** 的场景下，  
  通过结构化的路径选择，  
  争取“多 1-3% 的汇率效率”。

---

## 🔍 三类典型价差来源（合规模式下）

### 1. 官方汇率 vs CEX 法币交易对价格

- 银行与传统外汇市场的汇率（A/USD、B/USD）  
- CEX 上 A/USDT、B/USDT 对的实际成交价  
- 在高波动行情中，CEX 报价可能暂时偏离“中间价”

套利思路：

- 在汇率短期错位时，  
  将本来就要做的法币兑换，部分通过 CEX/加密路径完成，  
  获取略优的汇率。

---

### 2. CEX 法币交易对 vs P2P 报价

- 某些国家法币在 CEX 内只有有限深度  
- 大量交易集中在 P2P 市场（广告板）  
- P2P 广告价与官方/银行汇率长期存在一定“溢价/折价”

套利思路：

- 在自己是 **真实买方或卖方** 情况下：  
  - 若你本来要用 A 币买 USDT，  
    就可以比较：  
    - 银行 A→USD→CEX→USDT  
    - 直接 A 币 P2P 买 USDT  
  - 选择汇率更优、风险可控的那一条

---

### 3. 不同地区之间的“Crypto FX” 差

- 例如：  
  - 地区 A 对 USDT/USDC 的 P2P 需求旺盛，USDT 相对 A 币有溢价  
  - 地区 B 对 USDT 需求一般，USDT 对 B 币折价或接近中间价  
- 若你同时在 A、B 都有合规身份与账户，  
  且 **法律允许你进行此类跨境资金安排**，  
  就可能存在一个可行路径：

\`\`\`text
A 币 → A 区 P2P 买 USDT → CEX 内部转账 → B 区 P2P 卖出为 B 币
\`\`\`

同时与“银行直接 A→B 兑换”对比，  
若在所有成本/申报后的综合结果中，以上路径更优，  
那“多出来的那点差值”就是你的套利空间。

---

## 🧩 子策略拆解：三类玩法框架（全部要求合规前提）

### 模式 A：个人/家庭跨境资金优化

> 面向“本来就要跨境”的场景（生活费、学费、消费等）。

特点：

- 资金规模中等  
- 频率稳定（如每月/每季度）  
- 强调安全、可解释性、合规备案

玩法：

1. 为自己常用的两端国家/地区建立 **汇率矩阵**：
   - 银行/正规渠道 A→B 汇率与费用  
   - P2P A 币买 USDT 的有效汇率  
   - P2P USDT 卖 B 币的有效汇率  
   - CEX 内 A/USDT、B/USDT 的现货价格

2. 每次需要跨境时：
   - 比较“传统渠道 vs 加密渠道”的总成本  
   - 在不违反外汇规定的额度/用途限制情况下，  
     选择更优路径（甚至可以混用两种）

---

### 模式 B：合规中小企业跨境收付优化

> 用于有真实进出口/服务贸易背景的中小企业，  
> 必须在合规框架（发票、税务、审计）下操作。

玩法：

- 与专业机构沟通，在合规的支付/收款框架内：  
  - 部分应收款/应付款以稳定币结算  
  - 将跨境货款的汇兑部分通过“稳定币路径 + 本地兑换”完成  
- 对比：  
  - 银行 A→B 传统途径总成本  
  - 稳定币/加密路径总成本  
- 在合同架构允许的情况下，决定哪部分可以用更具效率的路径完成。

---

### 模式 C：小规模“路径规划服务 + 合规顾问协作”

> 仅在法律允许情况下，为少量客户做“路径优化顾问”，  
> 不做资金池，不碰客户资金托管，  
> 将自己定位为“信息 + 计算服务提供者”。

- 收费方式：
  - 按咨询时长计费  
  - 或按帮客户节省的汇兑成本提成一部分（在合规的前提下）  
- 要求：
  - 有合规背景/专业人士背书更佳  
  - 保留完备的合规记录（说明书、决策过程、风险提示）

---

## 🛠️ 跨境汇率差扫描脚本示例（抽象）

> 以下脚本只是一个“结构化思路示例”，  
> 实际使用时需替换为真实 API 与合规工具。

\`\`\`javascript
class CrossBorderFxArbScanner {
  constructor() {
    // 示例：两个地区 A 和 B 的法币
    this.currencies = {
      regionA: 'A_CCY',
      regionB: 'B_CCY'
    };

    // 假设有一些数据源（需要自行实现 API 获取）
    this.sources = {
      bankRates: 'https://api.example.com/bank-fx',
      cexRates: 'https://api.example.com/cex-fx',
      p2pQuotes: 'https://api.example.com/p2p-fx'
    };
  }

  async fetchBankRates() {
    // 真实使用中请替换为对应银行或外汇数据源
    // 数据结构示例：{ 'A_CCY/USD': 6.9, 'B_CCY/USD': 1.2 }
    return {
      'A_CCY/USD': 6.9,
      'B_CCY/USD': 1.2
    };
  }

  async fetchCexRates() {
    // 真实使用中替换为 CEX API
    // 数据结构示例：{ 'A_CCY/USDT': 6.95, 'B_CCY/USDT': 1.18 }
    return {
      'A_CCY/USDT': 6.95,
      'B_CCY/USDT': 1.18
    };
  }

  async fetchP2PQuotes() {
    // 真实使用中替换为 P2P 市场 API 或爬虫
    // 示例中只给出“有效汇率”（已综合广告价+手续费）
    return {
      'A_CCY/USDT': {
        buy: 7.05, // 用 A 币买 1 USDT 的成本
        sell: 6.85 // 卖 1 USDT 得到的 A 币
      },
      'B_CCY/USDT': {
        buy: 1.22,
        sell: 1.16
      }
    };
  }

  /**
   * 计算从 A 法币到 B 法币的两条路径：
   * 1) 传统银行 A->USD->B
   * 2) 加密路径 A->USDT->B
   */
  async comparePaths(amountA) {
    const bankRates = await this.fetchBankRates();
    const cexRates = await this.fetchCexRates();
    const p2pQuotes = await this.fetchP2PQuotes();

    const rateAtoUSD = bankRates['A_CCY/USD'];
    const rateBtoUSD = bankRates['B_CCY/USD'];

    // 传统路径：A -> USD -> B
    const usd = amountA / rateAtoUSD;
    const amountB_bank = usd * rateBtoUSD;

    // 加密路径（仅示意其中一种：A P2P 买 USDT -> B P2P 卖 USDT）
    const aP2P = p2pQuotes['A_CCY/USDT'];
    const bP2P = p2pQuotes['B_CCY/USDT'];

    const usdtViaA = amountA / aP2P.buy; // 用 A 币在 P2P 买 USDT
    const amountB_p2p = usdtViaA * bP2P.sell; // 在 B 区 P2P 卖出 USDT 换 B 币

    const diff = amountB_p2p - amountB_bank;
    const diffRate = amountB_bank > 0 ? diff / amountB_bank : 0;

    return {
      amountA,
      amountB_bank,
      amountB_p2p,
      diff,
      diffRate
    };
  }

  async demo() {
    const amountA = 10000; // 例如 1 万 A 币
    const result = await this.comparePaths(amountA);

    console.log('🌍 跨境汇率路径对比示例:');
    console.log(
      \`- 使用银行路径 (A->USD->B) 可得到 ≈ \${result.amountB_bank.toFixed(
        2
      )} B 币\`
    );
    console.log(
      \`- 使用加密 P2P 路径 (A->USDT->B) 可得到 ≈ \${result.amountB_p2p.toFixed(
        2
      )} B 币\`
    );
    console.log(
      \`- 差额 ≈ \${result.diff.toFixed(
        2
      )} B 币 | 相对提升 ≈ \${(result.diffRate * 100).toFixed(2)}%\`
    );
  }
}

// 使用示例：
// const scanner = new CrossBorderFxArbScanner();
// scanner.demo().catch(console.error);
\`\`\`

---

## 📊 风控参数与合规边界

\`\`\`javascript
const CROSS_BORDER_FX_ARB_RISK = {
  MAX_CAPITAL_RATIO_FOR_FX_ARB: 0.3,     // 用于跨境汇率套利的资金不超过总净资产 30%
  MAX_SINGLE_TX_SIZE: 20000,             // 单笔不超过某个额度（视当地规定与风险承受度）
  MAX_DAILY_VOLUME: 50000,               // 每日总规模上限，避免触发异常监控
  MIN_SPREAD_THRESHOLD: 0.01,            // 价差<1%时通常不值得折腾
  REQUIRE_PROFESSIONAL_OPINION: true,    // 默认要求在实操前咨询专业法律/税务意见
  RECORD_RETENTION_DAYS: 365 * 5         // 所有跨境路径与决策记录保留至少 5 年
};
\`\`\`

---

## 🎯 实战 Checklist（31.6）

### 1️⃣ 资格与约束确认

- [ ] 你是否是 A/B 两地的合法居民/持有合规账户？  
- [ ] 两地对外汇/加密资产的法律法规是什么？  
- [ ] 是否存在单笔/年度额度限制？  
- [ ] 是否需要向税务/监管机关单独申报这些跨境资金流？

### 2️⃣ 数据与工具搭建

- [ ] 搭建自己的“汇率面板”：  
  - 银行 A→USD、B→USD 报价  
  - CEX 上 A/USDT、B/USDT 报价  
  - P2P 市场 A/USDT、B/USDT 报价  
- [ ] 至少收集几周样本，观察：
  - 价差出现的频率与幅度  
  - 不同时间段与事件（如政策公告、宏观数据）的敏感度  

### 3️⃣ 风险与场景设计

- [ ] 仅针对“本来就要跨境”的资金做优化  
- [ ] 明确每一笔资金的 **来源 & 用途**，确保可解释  
- [ ] 为每一种路径写出简单的“说明文档”：  
  - 若银行或监管问起，你如何解释这笔资金路线？  

### 4️⃣ 小额试点与复盘

- [ ] 先用小额试运行完整闭环：A 币 → USDT → B 币 → 记账与申报  
- [ ] 检查：
  - 实际费用是否与预估匹配  
  - 是否遇到合规/风控/审查问题  
- [ ] 写下每次操作的“经验记录”：  
  - 哪个环节耗时最长  
  - 哪个环节最可能成为风控点  

### 5️⃣ 慢速放大（若一切合规且顺利）

- [ ] 即便有明显价差，也建议 **逐步放大规模**，  
  随时准备在政策/平台环境变化时收缩或停止  
- [ ] 每季度与专业人士 review 一次：  
  - 当前做法是否仍然合规  
  - 是否需要新增报告/备案义务  

---

## ✅ 小结

**跨境汇率套利** 是一项“合规难度远大于技术难度”的策略：

- 技术上：  
  - 写脚本抓价差 → 并不特别难  
- 难的是：  
  - 跨境监管、外汇规定、反洗钱要求、税务申报

对个人/家庭/中小企业来说：

- 正确姿势是：  
  - 把它当做 **“跨境资产配置时的汇率优化能力”**；  
  - 而不是一个脱离合规约束、无限扩张的“印钞机”。

只要你：

- 肯花时间做足功课，  
- 尊重每一条合规边界，  
- 严格记录每一条资金路径，  

那么在很多真实场景下，  
你确实可以在“本来就要发生的跨境资金流”之上，  
拿到那一小块 **稳健、可解释、合规的价差收益**。  

---

`
};

/**
 * 上传 31.5 和 31.6 策略到 Directus
 */
async function uploadStrategies() {
  const DIRECTUS_URL = 'http://localhost:8055';

  console.log('开始上传策略 31.5 和 31.6...\n');

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

    console.log('上传策略 31.5: Gas 费优化套利...');
    await axios.post(`${DIRECTUS_URL}/items/strategies`, STRATEGY_31_5, {
      headers
    });
    console.log('✅ 策略 31.5 上传成功\n');

    console.log('上传策略 31.6: 跨境汇率套利...');
    await axios.post(`${DIRECTUS_URL}/items/strategies`, STRATEGY_31_6, {
      headers
    });
    console.log('✅ 策略 31.6 上传成功\n');

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

// 若要直接用 Node 执行本文件写入策略，请取消下面一行注释：
uploadStrategies();
