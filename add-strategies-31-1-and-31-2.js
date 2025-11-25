// 策略 31.1 & 31.2: 成本与流程套利 (cost-process-arbitrage)

const axios = require('axios');

/**
 * 31.1 资金成本利差套利
 */
const STRATEGY_31_1 = {
  title: '资金成本利差套利 - 用低息资金喂高息资产的“利差工厂”',
  slug: 'funding-cost-spread-arbitrage',
  summary:
    '在不同平台、不同资产形态之间，系统性对比资金成本：哪里可以低息/零息借入（信用账户、券商融资、稳定币借贷、抵押贷款等），哪里可以安全地高息出借或投资（稳定币理财、优质借贷池、国债/票据、稳健策略），通过“低息借入 → 高息放出”的方式构建利差工厂。核心是控制对手风险与杠杆，不把自己变成最后一个接盘的人。',
  category: 'cost-process-arbitrage',
  category_l1: 'arbitrage',
  category_l2: 'cost-process-arbitrage',
  risk_level: 3,
  apy_min: 8,
  apy_max: 40,
  min_investment: 2000,
  time_commitment: '每周 3-6 小时（搭好后主要是定期巡检）',
  status: 'published',
  content: `# 资金成本利差套利 - 用低息资金喂高息资产的“利差工厂”

## 💰 策略概览

| 参数 | 数值 |
|------|------|
| **起投资金** | $2,000 - $200,000 |
| **时间投入** | 前期 1-2 周搭框架，之后每周 3-6 小时巡检 |
| **预期年化** | 8-40%（取决于杠杆倍数与标的风险） |
| **风险等级** | ⚠️⚠️⚠️ 中等 (3/5) |
| **难度等级** | 中级偏上（偏财务工程/资金运营） |
| **适合人群** | 有多平台账户、愿意做记录和表格、能看懂利率与费用结构的玩家 |

---

## 📖 开场故事：一次“稳定币利差工厂”的 18% 年化

Ray 有几个不同的平台账户：

- A 交易所有：  
  - 抵押 BTC/ETH 后，稳定币年化借款利率约 4-5%  
- B CeFi 平台有：  
  - USD 稳定币理财产品，年化 9-10%，短期可随时赎回  
- 链上某 DeFi 协议：  
  - 高质量借贷池，对 USDC 提供 7-8% 年化借出利率  

他做的不是 “ALL IN 杠杆梭哈”，而是搭了一个**可反复滚动的小型利差工厂**：

1. 在 A 所用自己持有的 BTC/ETH 抵押，借出一部分 USDT/USDC：  
   - 抵押率控制在安全区间（例如 35-40%）  
   - 借款利率约 4.5% 年化  

2. 把这部分借出的 USDT/USDC：

   - 一部分放到 B 平台的稳健理财，年化 9%  
   - 一部分放到链上的蓝筹借贷池，年化 7.5%  

3. 同时，他保留了足够的流动性：
   - 若市况波动，随时可以用现金或其它资产还掉一部分借款  
   - 避免因为抵押资产价格下跌被清算

粗略算下来，他的利差结构是这样的（简化版）：

\`\`\`
借入成本： 4.5% 年化
资产收益： 8.5% 加权平均（部分 9%，部分 7.5%）
净利差：   ≈ 4.0% 年化

在不动本金、不再叠加二级杠杆情况下，
仅凭这条“抵押借出稳定币 → 稳定币理财”的链条，
就能额外多出约 4% 年化。

若他把本来的现货持仓视为“长期不卖”的底仓，
那么这 4% 年化几乎就是在锁住长期仓的同时，
为自己增加了一条“稳健现金流”。
\`\`\`

Ray 后续又做了几件提升效率的事：

- 比较不同平台的借款利率和稳定币理财利率，  
  发现 A 借 + B 放只是其中之一条最优路径；
- 用一个自己的表格，统一记录所有平台的：  
  - 借款年化 / 存款年化 / 手续费 / 提币成本  
- 给自己设置一个简单规则：  
  - “只做**净利差 ≥ 3% 且对手风险可控**的组合，  
    低于 3% 的就当没看到。”

一年下来，他的“利差工厂”在低波动、风险可控的前提下，  
为整体账户多贡献了约 12-18% 的总收益。

---

## 🧠 核心逻辑：什么是资金成本利差套利？

一句话总结：

> 在 **资金成本异质** 的世界里：
> - 不同平台 = 不同利率  
> - 不同产品 = 不同收益  
> - 不同风险评级 = 不同溢价  
> 你要做的就是：系统性发现 **“低成本资金” → “高收益资产”** 的组合，  
> 中间的利差就是你的套利空间。

这与传统意义上的“价差交易”类似，只不过：

- 标的从“BTC/ETH”换成了“利率、费率、资金成本”；  
- 核心能力从“盯盘”变成了“记账 + 资金配置 + 风控”。

---

## 🔍 典型资金来源与使用场景

### 1. 低成本资金来源（Funding Legs）

**可能的低成本资金来源包括：**

- CEX 杠杆/保证金账户的稳定币融资  
- 抵押主流币/蓝筹资产后的稳定币借款  
- CeFi 平台的低息借贷额度  
- 银行/券商融资（保证金贷款、信用贷款）  
- 同一生态内的“零息/低息推广额度”（如新用户免息期）  

这里的关键有两个：

1. **成本明确可计算**：年化利率、手续费、隐性成本都可量化  
2. **可控的撤出机制**：什么时候、以什么方式还款/归还，路径要清晰

---

### 2. 高收益资金用途（Investment Legs）

**潜在的高收益方向：**

- 稳定币理财（CEX/CeFi/DeFi）  
- Blue-chip DeFi 借贷池利率 + 抵押品分红  
- RWA（链上国债、短债基金）收益  
- 较低波动的做市/基差套利策略（当作利率产品使用）  
- 部分 CeFi 平台的结构化存款产品（如保底+浮动收益）  

同样，关键有两个：

1. **收益相对稳定**：不赌高波动资产的方向性行情  
2. **流动性可控**：赎回周期、锁定期、提前赎回罚金可预期

---

## 🧩 子策略拆解：三种常见利差模式

### 模式 A：稳定币借贷利差（CeFi ↔ DeFi）

> 在 CEX/CeFi 平台低息借出稳定币，在 DeFi 借贷池或其它 CeFi 平台高息出借。

**示例链条：**

1. 在 CEX 平台，以 BTC/ETH 作为抵押，年化 4% 借出 USDT  
2. 把 USDT 转到链上，存入蓝筹借贷协议中，借出年化 8% 利率  
3. 净利差 ≈ 4% 年化（未计手续费和链上 Gas）

风险要点：

- 抵押资产的价格波动（清算风险）  
- CEX 的对手风险（平台风险）  
- DeFi 协议风险（智能合约、清算、黑客）  

---

### 模式 B：法币融资 → 稳定币利率产品

> 使用传统金融渠道的低息法币融资，换成稳定币后进入链上/链下的固定收益产品。

**示例链条：**

1. 银行或券商融资（例如 3-5% 年化）  
2. 入金交易所 → 买入 USDC/USDT  
3. 投入高等级、风险可控的稳定币固定收益产品（比如链上国债类 RWA）  
   - 收益 8-10%  
4. 净利差：约 4-6%

适合人群：

- 有较好的银行授信或券商保证金额度  
- 对合规/税务有基本了解，能合理安排货币和资产路径

---

### 模式 C：平台内资金成本错配

> 在同一平台内，利用 **不同产品之间的利率错配** 做低风险利差。

例如：

- 某平台：
  - 抵押借款：USDT 年化 5%  
  - 同平台的 USDT 理财：年化 7-8%  
  - 甚至有“自动存币生息”但借贷/融券系统未完全联动

你可以：

- 抵押 BTC/ETH 借出 USDT（5%）  
- 立即在同平台把 USDT 卖给“自动生息账户”（7%）  
- 实际上是吃平台内部系统之间的协调差  
- 这种情况通常生命周期较短，但在尚未被修复前，是高性价比机会

---

## 🛠️ 利差扫描与评估脚本示意

下面是一个简化版 “资金成本利差扫描器”，用于：

- 收集不同平台的借款利率与存款/理财利率  
- 计算潜在利差  
- 输出“值得研究”的利差组合列表。

\`\`\`javascript
class FundingCostSpreadScanner {
  constructor() {
    this.sources = [
      {
        name: 'CEX_A',
        apiBorrow: 'https://api.cex-a.example.com/borrow-rates',
        apiLend: 'https://api.cex-a.example.com/lend-rates'
      },
      {
        name: 'CeFi_B',
        apiBorrow: 'https://api.cefi-b.example.com/funding/borrow',
        apiLend: 'https://api.cefi-b.example.com/funding/lend'
      }
      // 真实使用中，你可以继续加：链上协议、RWA 平台等
    ];

    this.minSpread = 0.03; // 至少 3% 年化利差才进入候选列表
  }

  async fetchRates(api) {
    const res = await axios.get(api);
    return res.data.rates || [];
  }

  /**
   * 统一结构：{ asset, rate, type: 'borrow' | 'lend', term: 'flexible'|'30d'... }
   */
  normalizeRates(rawRates, type, sourceName) {
    return rawRates.map((r) => ({
      source: sourceName,
      asset: r.asset,
      rate: r.apy || r.rate,
      type,
      term: r.term || 'flexible'
    }));
  }

  async scan() {
    const allBorrow = [];
    const allLend = [];

    for (const s of this.sources) {
      try {
        const [borrowRaw, lendRaw] = await Promise.all([
          this.fetchRates(s.apiBorrow),
          this.fetchRates(s.apiLend)
        ]);

        allBorrow.push(
          ...this.normalizeRates(borrowRaw, 'borrow', s.name)
        );
        allLend.push(...this.normalizeRates(lendRaw, 'lend', s.name));
      } catch (e) {
        console.error(\`❌ 获取 \${s.name} 利率失败:\`, e.message);
      }
    }

    // 以资产为维度，将“借”和“存”拼接起来
    const opportunities = [];

    for (const b of allBorrow) {
      for (const l of allLend) {
        if (b.asset !== l.asset) continue;

        const spread = (l.rate || 0) - (b.rate || 0);
        if (spread < this.minSpread) continue;

        opportunities.push({
          asset: b.asset,
          borrowFrom: b.source,
          borrowRate: b.rate,
          lendOn: l.source,
          lendRate: l.rate,
          termBorrow: b.term,
          termLend: l.term,
          spread
        });
      }
    }

    // 按利差从大到小排序
    opportunities.sort((a, b) => b.spread - a.spread);

    console.log('📊 资金成本利差候选组合（按年化利差降序）：');
    opportunities.forEach((op) => {
      console.log(
        \`- 资产: \${op.asset} | 从 \${op.borrowFrom} 以 \${(
          op.borrowRate * 100
        ).toFixed(2)}% 借入 → 在 \${op.lendOn} 以 \${(
          op.lendRate * 100
        ).toFixed(2)}% 出借 | 净利差 ≈ \${(
          op.spread * 100
        ).toFixed(2)}%\`
      );
    });

    return opportunities;
  }
}

// 使用示例：
// const scanner = new FundingCostSpreadScanner();
// scanner.scan().catch(console.error);
\`\`\`

---

## 📊 风控参数与资金管理建议

\`\`\`javascript
const FUNDING_SPREAD_RISK = {
  MAX_CAPITAL_RATIO: 0.3,         // 所有资金利差策略总规模不超过净资产 30%
  MAX_SINGLE_PATH_RATIO: 0.1,     // 单条“借出→投资”路径不超过净资产 10%
  MIN_SPREAD_APY: 0.03,           // 净利差年化至少 3% 才值得做
  MAX_LEVERAGE: 2,                // 综合杠杆不超过 2x
  TARGET_COLLATERAL_RATIO: 0.4,   // 抵押率控制在约 40% 以下
  STRESS_TEST_PRICE_DROP: 0.5,    // 抵押资产至少能抗 50% 下跌不断供
  MAX_LOCKUP_DAYS: 90             // 投资侧锁定期尽量不超过 90 天
};
\`\`\`

---

## 🎯 实战 Checklist

### 1️⃣ 准备与盘点

- [ ] 列出你当前所有平台账户：CEX、CeFi、DeFi、银行、券商等  
- [ ] 为每个平台做一张“利率快照”：  
  - 借款年化 / 存款年化 / 手续费 / 充值/提现成本  
- [ ] 标注每个平台的风险等级（自评）：  
  - 头部、次头部、长尾、小平台等  

### 2️⃣ 设计利差路径

- [ ] 用表格列出所有可以借入的资金来源（含上限与成本）  
- [ ] 用表格列出所有可以投资/出借的安全标的（含流动性与锁定期）  
- [ ] 为每一对“资金来源 → 投资标的”计算：  
  - 净利差年化  
  - 对手风险组合（平台风险叠加）  

### 3️⃣ 执行与跟踪

- [ ] 只挑选 **净利差 ≥ 3-4% 且对手风险可接受** 的组合落地  
- [ ] 为每一条路径记录：  
  - 借款起始时间、利率、到期日  
  - 投资起始时间、预期收益、赎回规则  
- [ ] 每周/每月巡检一次：  
  - 若利率或风险环境发生变化，及时收缩或调整

### 4️⃣ 退出与复盘

- [ ] 在市场极端波动或监管环境急剧变化时，优先考虑：  
  - 先收缩“跨平台 + 高杠杆”的路径  
  - 保留“单平台 + 低杠杆”的保守路径  
- [ ] 每季度复盘：  
  - 实际净收益 vs 理论净利差  
  - 被忽略的隐形成本有哪些（Gas、提现手续费、税费等）  
- [ ] 逐步形成自己的“安全利差白名单”：  
  - 哪几条路径是“可以长期反复滚”的  
  - 哪几种组合只适合短期尝试  

---

## ✅ 小结

**资金成本利差套利** 更像是一场“资金运营游戏”而不是“交易游戏”：

- 不要求你天天盯盘、频繁下单；  
- 关键在于：  
  - 把各个平台的利率和费率体系搞清楚；  
  - 用表格和脚本把信息结构化；  
  - 只做 **高净利差 + 低对手风险 + 可控杠杆** 的组合。

当你把这套东西打磨成自己的“利差工厂 SOP”之后，  
它会成为你资产组合中的 **稳定现金流模块**，  
不一定最刺激，但非常耐用。  

`
};

/**
 * 31.2 法币入金通道费套利
 */
const STRATEGY_31_2 = {
  title: '法币入金通道费套利 - 在费用迷宫里找到最低成本入口',
  slug: 'fiat-onramp-fee-arbitrage',
  summary:
    '围绕不同法币入金通道（信用卡/银行转账/OTC/本地券商/第三方支付/现金兑换）的费率与汇率差异，系统性对比“全部链路成本”：支付手续费、点差、隐藏费、到账时间与限额，选择最优路径甚至多级路径，从而在同样的法币预算下获得更多可用加密资金，或为他人提供“入金优化服务”赚取中间差价。',
  category: 'cost-process-arbitrage',
  category_l1: 'arbitrage',
  category_l2: 'cost-process-arbitrage',
  risk_level: 3,
  apy_min: 5,
  apy_max: 30,
  min_investment: 1000,
  time_commitment: '每周 2-6 小时（搭好模板后主要是按需测算）',
  status: 'published',
  content: `# 法币入金通道费套利 - 在费用迷宫里找到最低成本入口

## 💰 策略概览

| 参数 | 数值 |
|------|------|
| **起始规模** | $1,000 - $50,000（也适合小额测试与迭代） |
| **时间投入** | 每周 2-6 小时（必要时集中测算） |
| **预期收益** | 5-30% 年化（更多是“降低成本 + 赚服务费”复合收益） |
| **风险等级** | ⚠️⚠️⚠️ 中等 (3/5) |
| **难度等级** | 中级（偏流程设计与计算） |
| **适合人群** | 经常跨平台/跨国入金、熟悉支付工具且愿意做表格的人 |

---

## 📖 开场故事：同样 10,000 美金，别人只到手 9,400，你到手 9,750

Lily 在不同国家/地区都有银行账户，经常需要把法币换成 USDT/USDC。  
她发现：

> “同样是 10,000 USD 预算，  
>  不同的入金路径，最后到手的稳定币差距可以高达 3-5%。”

某次，她做了一个**详细拆解**（数字仅为示意）：

### 路径 A：信用卡直充 CEX

1. 信用卡支付 10,000 USD  
2. 第三方支付通道收取：  
   - 手续费 2.5% ≈ \$250  
   - 汇率点差 ≈ 0.5% ≈ \$50  
3. CEX 到账约 \$9,700 等值稳定币  
4. 若需要再提到 On-chain，还要额外提币/链上费用

**最终可用资金约：\$9,650**

---

### 路径 B：本地银行美元 → 海外银行美元 → CEX 银行入金

1. 本地银行电汇到海外银行（SWIFT）：
   - 手续费 \$20-40（视银行而定）  
   - 中间行费用不确定，保守估计 \$20  
2. 海外银行以标准汇率转账到 CEX 的银入金账户：
   - CEX 入金 0 费或极低费率  
3. 整体损耗约 \$60  
4. 到 CEX 的资金约 \$9,940 等值稳定币

**最终可用资金约：\$9,940**

---

### 路径 C：本地 OTC 商 → CEX 站内划转

1. 找到评价较好、点差合理的本地 OTC 商  
2. 线下或线上法币转账，OTC 以 USDT/USDC 形式划转到同平台账户  
3. 点差约 1.0%（假设上游成本控制在较好水平）  
4. 无额外链上手续费（站内划转）

**最终可用资金约：\$9,900**

---

Lily 做了一个简单结论：

- 路径 A（信用卡直充） → 成本约 3.5%（最贵，但最快、最简单）  
- 路径 B（银行绕一圈） → 成本约 0.6%（最便宜，但最慢、手续多）  
- 路径 C（本地 OTC） → 成本约 1.0%（折中方案）

她为自己设定了一个策略：

- 日常不着急：  
  - 优先使用路径 B 或 B+C 的组合，把综合成本压低到 0.5-1.0%  
- 非常着急（比如要抢一个白名单或 IEO）：  
  - 可以接受路径 A 这类贵但快的方式，  
  - 但每年这种“贵通道”的预算总额严格控制。

后来，她又发现一个商业机会：

> 身边很多人懒得研究这些细节，  
> 她愿意帮别人 **规划入金路径 + 代为执行**，  
> 收取 0.5-1% 的服务费。  
> 只要她自己能把成本压在 1.0% 以下，  
> 对用户来说“比自己随便充值更划算”，  
> 对她来说就是一条 **稳定的“小额套利服务线”**。

---

## 🧠 核心逻辑：法币入金通道费套利在做什么？

一句话：

> 把所有入金路径拆成一个个“节点 + 边”，  
> 每条边都有明确的 **费用/点差/时间/限额**，  
> 你要做的就是为每一次入金需求，  
> 找到一条 **综合成本最低且风险可控** 的路径，  
> 或者为他人提供“路径规划 + 执行”来赚差价。

本质上是一个“多源多路径”的最短路径问题，只是权重不止一个（成本 + 时间 + 风险）。

---

## 🔍 典型入金通道与成本结构

### 1. 信用卡/借记卡直充

**优点：**

- 速度快（分钟级甚至秒级）  
- 操作简单，适合新手  

**成本：**

- 手续费（2-5% 不等）  
- 汇率点差（0.3-1%）  
- 可能有现金预借手续费或利息（视发卡行规则）  

**适用场景：**

- 小额、紧急、对时间敏感的入金需求  
- 不适合作为高频/长期主路径

---

### 2. 银行电汇（本地/跨境）

**优点：**

- 大额入金成本相对可控  
- 通常汇率比较接近“中间价”  

**成本：**

- 电汇手续费（固定 + 百分比）  
- 中间行费用（尤其是 SWIFT）  
- 到账时间（1-3 工作日甚至更长）  

**适用场景：**

- 中大额、对时间不特别敏感、重视合规记录的入金需求  

---

### 3. OTC 与第三方支付

**类型：**

- 平台官方 OTC（站内广告板）  
- 本地 OTC 商（个体或小公司）  
- 第三方支付平台（如支持币种买卖的支付公司）  

**成本结构：**

- 报价点差（买入价/卖出价与中间价的差）  
- 可能的服务费/平台手续费  
- 资金结算方式（银行转账、移动支付、现金）  

**适用场景：**

- 需要在本地法币 → 稳定币之间快速转换  
- 小中额可多次执行，大额则需评估合规与对手风险  

---

### 4. 本地券商/金融产品 → 出金到 CEX

有时你可以：

- 在本地券商购买某些“与美元挂钩”的产品（如美元货币基金）  
- 再通过某种合规路径将资金转出到 CEX 或上游银行  
- 若本地券商的费率和汇率优于普通银行渠道，就会形成利差空间

---

## 🧩 子策略拆分：三种常见玩法

### 模式 A：个人“入金优化器”

> 为自己设计一套固定的“最优入金流程模板”。

步骤：

1. 列出你可用的全部入金方式：
   - 信用卡 → 平台 X  
   - 本地银行 → 海外银行 → 平台 Y  
   - 本地支付工具 → OTC 商 → 平台 Z  
   - 等等

2. 为每一种方式测算：
   - 明确费用 + 点差 + 到账时间 + 单笔/单日限额  
   - 记录成表格，定期更新  

3. 为不同金额与时间敏感度，定义策略：

   - 小额 < \$1,000：  
     - 若不急：选择成本最低的一条  
     - 若很急：可选信用卡通道，但一年内总体金额有上限

   - 中额 \$1,000 - \$20,000：  
     - 尽量用银行/OTC 组合，把成本压至 0.5-1.5%  

   - 大额 > \$20,000：  
     - 以合规、稳定为优先，时间稍慢也接受  

---

### 模式 B：为他人做“入金代理 + 成本优化”

> 你帮别人执行“最优路径”，收取一定服务费。

基本思路：

1. 用户只告诉你：  
   - 想要多少 USDT/USDC  
   - 用哪种法币支付  

2. 你用自己的“路径选择器”算出：  
   - 对你自己来说，综合成本是多少  
   - 若你收取 0.5-1% 服务费，对用户来说是否依然比他自己随便充值更划算  

3. 对用户报价：

   - 告诉他一个最终 USDT 数量，  
   - 或者一个固定费率（例如：比平台信用卡直充便宜 1-1.5%）

这个模式的风险点：

- 你成了他人的“资金中介”，要合法、合规、透明  
- 需要注意不要触碰当地对支付、汇兑、理财的监管红线  
- 更适合作为熟人圈服务或在合规框架内的小型业务

---

### 模式 C：多平台之间的“出入金路由套利”

> 有些平台出金贵、入金便宜；  
> 有些平台出金便宜、入金贵。  
> 你可以利用这种差异，搭建“跨平台资金通道”。

举例（简化）：

- 平台 X：  
  - 入金 0 手续费，但出金到银行要收 1.5%  
- 平台 Y：  
  - 入金需 0.8%，但出金到银行仅收 0.3%  

对于想要：

- “法币 → 加密资产” 的路径：  
  - 适合使用平台 X 入金  
- “加密资产 → 法币” 的路径：  
  - 适合使用平台 Y 出金  

你可以：

- 自己根据不同方向，分别选对平台；  
- 也可以帮别人做 **“跨平台出入金优化”**，赚路径差与服务费。

---

## 🛠️ 入金路径成本模拟脚本示意

下面是一个简化版“法币入金路由器”：

- 预定义若干条入金路径及其费用结构  
- 给定目标金额与优先考虑的目标（最省钱/最快），  
- 计算综合成本并给出推荐路径。

\`\`\`javascript
class FiatOnRampRouter {
  constructor() {
    // 这里是示例数据，真实使用中可以从配置文件或数据库读取
    this.paths = [
      {
        name: '信用卡直充-CEX_A',
        speed: 'fast', // fast / normal / slow
        minAmount: 50,
        maxAmount: 5000,
        // 费用模型：固定 + 百分比 + 汇率点差
        feePercent: 0.025,
        fxSpreadPercent: 0.005,
        fixedFee: 0
      },
      {
        name: '本地银行 → 海外银行 → CEX_B',
        speed: 'slow',
        minAmount: 1000,
        maxAmount: 100000,
        feePercent: 0,
        fxSpreadPercent: 0.001,
        fixedFee: 60 // 电汇+中间行大致固定成本
      },
      {
        name: '本地 OTC 商 → CEX_C 站内划转',
        speed: 'normal',
        minAmount: 100,
        maxAmount: 50000,
        feePercent: 0.01,
        fxSpreadPercent: 0,
        fixedFee: 0
      }
    ];
  }

  /**
   * 计算某条路径在给定金额下的总成本
   */
  calcCost(path, amount) {
    const feePercent = path.feePercent || 0;
    const fxSpreadPercent = path.fxSpreadPercent || 0;
    const fixedFee = path.fixedFee || 0;

    const percentCost = amount * (feePercent + fxSpreadPercent);
    const totalCost = percentCost + fixedFee;
    const effectiveRate = totalCost / amount; // 有效费率

    return {
      pathName: path.name,
      amount,
      totalCost,
      effectiveRate
    };
  }

  /**
   * 根据需求筛选可用路径
   * @param {number} amount 入金金额
   * @param {'cheapest'|'fastest'} preference 侧重点：最省钱 or 最快
   */
  findBestPaths(amount, preference = 'cheapest') {
    const candidates = this.paths.filter(
      (p) => amount >= p.minAmount && amount <= p.maxAmount
    );

    const evaluated = candidates.map((p) => this.calcCost(p, amount));

    if (preference === 'cheapest') {
      evaluated.sort((a, b) => a.totalCost - b.totalCost);
    } else if (preference === 'fastest') {
      // 简单地将速度映射为排序权重（真实使用中可以更细致）
      const speedRank = { fast: 0, normal: 1, slow: 2 };
      evaluated.sort((a, b) => {
        const pa = this.paths.find((p) => p.name === a.pathName);
        const pb = this.paths.find((p) => p.name === b.pathName);
        return speedRank[pa.speed] - speedRank[pb.speed];
      });
    }

    return evaluated;
  }

  demo() {
    const amount = 10000;
    console.log('💸 模拟入金金额: ', amount);

    const cheapest = this.findBestPaths(amount, 'cheapest');
    console.log('📊 按“最省钱”排序的路径:');
    cheapest.forEach((r) => {
      console.log(
        \`- 路径: \${r.pathName} | 总成本=\${r.totalCost.toFixed(
          2
        )} | 有效费率=\${(r.effectiveRate * 100).toFixed(2)}%\`
      );
    });

    const fastest = this.findBestPaths(amount, 'fastest');
    console.log('\\n⚡ 按“最快”排序的路径:');
    fastest.forEach((r) => {
      console.log(
        \`- 路径: \${r.pathName} | 总成本=\${r.totalCost.toFixed(
          2
        )} | 有效费率=\${(r.effectiveRate * 100).toFixed(2)}%\`
      );
    });
  }
}

// 使用示例：
// const router = new FiatOnRampRouter();
// router.demo();
\`\`\`

---

## 📊 风控参数与运营边界

\`\`\`javascript
const FIAT_ONRAMP_RISK = {
  MAX_SINGLE_CLIENT_AMOUNT: 20000, // 若对他人提供路径服务，单客户单次不超过此值
  MAX_DAILY_VOLUME: 50000,        // 每日总处理规模上限（合规 & 风控考虑）
  MIN_SAVING_RATE: 0.01,          // 相比用户自己随便选路径，至少帮他省 1%
  SERVICE_FEE_RATE: 0.005,        // 为他人提供服务时的标准服务费，如 0.5%
  RECORD_RETENTION_DAYS: 365      // 入金路径与资金流向记录至少保留 1 年
};
\`\`\`

### 典型风险点

| 风险类型 | 描述 | 对策 |
|---------|------|------|
| **合规风险** | 在部分国家/地区，大规模、对公众提供资金中介服务可能需要牌照 | 将服务限定在熟人小圈或合规框架内，必要时咨询专业人士 |
| **对手风险** | OTC 商或第三方支付倒闭/卷款 | 选择长期信誉较好的对象，分散渠道，不在单一渠道压大额 |
| **操作风险** | 汇款信息错误、通道限额突变、到账延迟 | 做好每一步的确认，建立“资金路径单”，有备选方案 |
| **汇率风险** | 在双币种转换过程中，汇率瞬间波动 | 尽量减少无限制的敞口时间，快进快出，或锁定汇率 |
| **信息不对称** | 用户对你过度信任，把你当成“理财师” | 明确你的角色是“路径与成本优化”，而非收益承诺方 |

---

## 🎯 实战 Checklist

### 1️⃣ 路径盘点与建模

- [ ] 列出你能用到的所有入金方式 + 出金方式  
- [ ] 为每个路径节点记录：
  - 手续费规则  
  - 汇率来源与点差  
  - 最高/最低限额  
  - 到账速度与工作日要求  

### 2️⃣ 成本测算与模板化

- [ ] 建一个通用的“入金路径计算表” 或 用上面的 JS 类封装  
- [ ] 定期（如每月）更新：
  - 银行、电汇、中间行、OTC、平台的费率  
- [ ] 为典型金额（\$1k/\$5k/\$10k/\$50k）跑一遍模拟，找出：
  - 每一档金额下的 **成本最低路径**  
  - 以及 **成本略高但速度快很多的备选路径**

### 3️⃣ 执行与优化

- [ ] 自己的入金/出金操作，第一步永远是先走“路径计算器”  
- [ ] 若帮他人执行，提前给出清晰报价与说明：  
  - 对方从你这里得到多少稳定币  
  - 你收多少费  
  - 你承担什么责任、不承担什么责任  

### 4️⃣ 记录与复盘

- [ ] 对每一次入金操作记录：  
  - 实际成本 vs 理论成本  
  - 实际到账时间 vs 预期时间  
  - 中间是否遇到问题（风控、限额、冻结）  
- [ ] 定期分析：  
  - 哪些通道在过去 3 个月最稳定  
  - 哪些通道问题频发，逐步降权甚至淘汰  

---

## ✅ 小结

**法币入金通道费套利** 很“无聊”，但非常实用：

- 对你自己来说：  
  - 同样的钱，能多换 1-3% 的稳定币，  
  - 对长期玩家，这是很扎实的一块“无声收益”。

- 对你的小圈子/社群来说：  
  - 你可以扮演“入金路径规划师”的角色，  
  - 在合规框架内收一点合理服务费，  
  - 把“看不清的费用”变成“透明的方案”。

当你把这些路径、费率、隐形成本都 **结构化 + 模板化** 之后，  
“成本与流程套利”会成为你的整个玩法体系里，  
最稳、最可复制，也最容易被忽视的一块底层能力。

`
};

/**
 * 上传 31.1 和 31.2 策略到 Directus
 */
async function uploadStrategies() {
  const DIRECTUS_URL = 'http://localhost:8055';

  console.log('开始上传策略 31.1 和 31.2...\n');

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

    // 上传策略 31.1
    console.log('上传策略 31.1: 资金成本利差套利...');
    await axios.post(`${DIRECTUS_URL}/items/strategies`, STRATEGY_31_1, {
      headers
    });
    console.log('✅ 策略 31.1 上传成功\n');

    // 上传策略 31.2
    console.log('上传策略 31.2: 法币入金通道费套利...');
    await axios.post(`${DIRECTUS_URL}/items/strategies`, STRATEGY_31_2, {
      headers
    });
    console.log('✅ 策略 31.2 上传成功\n');

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
