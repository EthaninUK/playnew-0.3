// 策略 36.4 & 36.5 & 36.6: 新公链 & L2 生态任务 (ecosystem-strategies)

const axios = require('axios');

/**
 * 36.4 zkSync Era 生态空投
 * 在 zkSync Era 主网上体验原生 DApp，为 zkSync 代币空投积累资格。
 */
const STRATEGY_36_4 = {
  title:
    'zkSync Era 生态空投 - 用"原生交互 + 长期活跃"撬动 zk Rollup 红利',
  slug: 'zksync-era-native-ecosystem-tasks',
  summary:
    '围绕 zkSync Era 主网及其原生生态，通过桥接、DeFi、NFT、支付、工具等多维交互，积累潜在空投资格与生态积分。核心不是单次暴力刷量，而是：1）构建“原生 zkSync 用户”的行为画像；2）用持续、多样但成本可控的交互让地址显得真实可靠；3）把 zkSync 纳入你整体“新公链 & L2 任 务矩阵”中，成为一条重要长期期权。',
  category: 'new-chains',
  category_l1: 'airdrop',
  category_l2: 'new-chains',
  risk_level: 3,
  apy_min: 15,
  apy_max: 200,
  min_investment: 300,
  time_commitment:
    '首轮打底 1 天左右，之后每月 1-3 小时持续补充交互与任务',
  status: 'published',
  content: `# zkSync Era 生态空投 - 用“原生交互 + 长期活跃”撬动 zk Rollup 红利

## 💰 策略概览

| 项目 | 内容 |
|------|------|
| **适用标的** | zkSync Era 生态 DApp（桥接、DEX、借贷、NFT、支付、工具等） |
| **起始资金** | 约 \$300 - \$3,000（ETH / 稳定币为主） |
| **时间投入** | 打底交互约 1 天，之后每月 1-3 小时滚动维护 |
| **潜在收益** | zkSync 原生空投、生态项目空投、NFT 徽章、白名单、积分等 |
| **风险等级** | ⚠️⚠️⚠️ 中等 (3/5) |
| **难度等级** | 中级（需要对 zk Rollup / L2 有基本认识和多 DApp 操作能力） |

---

## 📖 开场故事：同样“蹲 zkSync 空投”，为什么最后拿到的差这么多？

早期围绕 zkSync Era 的空投预期，玩家的典型行为大致分为三类：

1. **一次性游客型**  
   - 某天看到“快来交互 zkSync，未来可能有空投”；  
   - 桥接一次、Swap 一次，然后再也没来过；  
   - 若将来空投算法更看重“长期活跃度”，这类地址权重会很低。  

2. **脚本刷量型**  
   - 用批量脚本在同一个 DEX 上刷了几百笔小额 Swap；  
   - 交互极度模式化、资产规模固定、行为单一；  
   - 很容易被风控模型识别为“farm 地址”，权重被打低甚至剔除。  

3. **原生生态用户型**  
   - 在 zkSync Era 上搭建了一个“日常钱包”：  
     - 桥接主网资金多次往返；  
     - 使用多个 DEX / 借贷 / NFT / 支付 DApp；  
     - 偶尔在 zkSync 上做小型实用支付、游戏或社交操作；  
   - 行为维度丰富、时间跨度长，更像“真实用户”。

当某天官方/项目方真的开始按链上行为打分时：

- 第一类：记录稀薄，权重有限；  
- 第二类：噪音行为太强，被算法打上“疑似薅羊毛”标签；  
- 第三类：指标均衡，多维度参与，很可能是重点照顾对象。

我们要做的，就是系统性地把自己变成第三类。

---

## 🧠 策略核心：zkSync Era 上，什么样的行为最“像 OG”？

可以从四个维度理解“高质量 zkSync 画像”：

1. **时间维度：长期在线**  
   - 行为覆盖数月而非集中在几天内；  
   - 定期回链做少量真实交互，而不是“一夜刷爆”。  

2. **协议维度：多应用参与**  
   - DEX + 借贷 + NFT + 支付 + 工具类协议都有参与；  
   - 不只局限在一个热门 DApp 上狂刷。  

3. **动作维度：多类型行为**  
   - Swap、LP、存款、借款、NFT Mint / 交易、支付、桥接等。  

4. **金额维度：合理资金规模**  
   - 不是“几十个小号，每个几刀”；  
   - 至少有一个“主号”使用中等体量资金做正常操作。

---

## 🧩 子策略拆分：zkSync Era 生态空投四步走

### 步骤 1：桥接 & 基础转账（打底）

**目标：**  
- 让地址在官方桥、第三方桥以及基础转账中都有记录。

动作示例：

1. **主网 → zkSync Era 官方桥**  
   - 多次桥接 ETH / USDC / USDT 等，尽量分散时间；  
   - 金额不必太大，但也不要过于极端小额。  

2. **第三方桥 & CEX → zkSync 提币**  
   - 使用至少一个第三方桥接器从其他 L2 / 公链桥入；  
   - 使用 CEX 提币直接到 zkSync 地址（若支持）。  

3. **在 zkSync 上的普通转账**  
   - 给朋友或自己小号地址转账几笔；  
   - 尽量模拟真实日常使用场景。

---

### 步骤 2：DeFi 生态基础交互（主线）

**目标：**  
- 让你的地址看起来像一个在 zkSync 上使用 DeFi 的真实用户。

典型组合：

1. **DEX 操作**  
   - 至少 2-3 个 DEX：  
     - 每个 DEX 上做 3-5 笔 Swap；  
     - 1-2 次小额 LP，并至少持有数天以上。  

2. **借贷协议**  
   - 选择 1-2 个稳健借贷协议：  
     - 存入少量 ETH / 稳定币，作为存款人；  
     - 若风险承受能力允许，可少量借出资产，体验完整“存→借→还→退”。

3. **收益或聚合器协议**  
   - 若存在蓝筹收益池，可小仓参与一次，  
   - 完整走完“存入 → 领取收益 → 退出”的全流程。

---

### 步骤 3：NFT / 支付 / 消费场景（生态特色）

zkSync 被定位为“支持大规模支付和应用”的 zk Rollup，  
NFT 和支付类产品会是重要板块。

可选动作：

1. **NFT Mint 与交易**  
   - 铸造 2-3 个 zkSync 生态代表 NFT：  
     - 官方合作 NFT  
     - 早期 OG 系列  
     - 品质较高的创作者作品  
   - 在 NFT 市场上进行 1-2 笔买卖。  

2. **支付/消费类 DApp**  
   - 支付类、订阅类、游戏/娱乐类应用；  
   - 尝试使用小额资金完成几次支付或充值。

3. **身份类/任务平台**  
   - 如果有 zkSync 原生的任务平台/积分系统：  
     - 认真跑基础任务；  
     - 为后续积分→空投预留空间。

---

### 步骤 4：长期维护 & 行为玻璃化

**目标：**  
- 把 zkSync Era 当成你“多链生活”的一部分，而不是一次性任务。

建议节奏：

1. 每月设置一个“zkSync 巡逻日”：  
   - 回链查看持仓；  
   - 做 1-3 笔小额 Swap 或 DeFi 操作；  
   - 使用 1 个生态 DApp（DeFi / NFT / 工具皆可）。  

2. 不定期参与新项目试用：  
   - 关注官方生态/合作推荐列表；  
   - 对高质量新项目进行小仓体验。  

3. 用表格/脚本记录交互：  
   - 形成“可复盘”的 zkSync 行为日志。

---

## 🛠️ zkSync Era 交互任务规划脚本（伪代码）

\`\`\`javascript
class ZkSyncTaskPlanner {
  constructor() {
    this.tasks = [
      {
        id: 'zksync-bridge-mainnet',
        title: '主网 → zkSync 官方桥接 ETH / 稳定币',
        type: 'bridge',
        repeat: 3,
        priority: 5
      },
      {
        id: 'zksync-dex-swap',
        title: '在 2-3 个 DEX 上完成 Swap',
        type: 'dex',
        repeat: 10,
        priority: 4
      },
      {
        id: 'zksync-lp-basic',
        title: '在主流 DEX 提供 1-2 次 LP（持有数日）',
        type: 'lp',
        repeat: 2,
        priority: 4
      },
      {
        id: 'zksync-nft-mint',
        title: '铸造 2-3 个 zkSync 生态代表 NFT',
        type: 'nft',
        repeat: 3,
        priority: 4
      },
      {
        id: 'zksync-monthly-check',
        title: '每月回链 1 次，执行小额真实交互',
        type: 'maintenance',
        repeat: 12,
        priority: 3
      }
    ];
  }

  listTasks() {
    console.log('📋 zkSync Era 生态交互任务清单：');
    this.tasks.forEach((t) => {
      console.log(
        \`- [优先级 \${t.priority}] \${t.title} | 类型: \${t.type} | 建议次数: \${t.repeat}\`
      );
    });
  }

  getHighPriorityTasks(minPriority = 4) {
    return this.tasks.filter((t) => t.priority >= minPriority);
  }

  addCustomTask(task) {
    this.tasks.push(task);
  }
}
\`\`\`

---

## 📊 成本与风控建议

\`\`\`javascript
const ZKSYNC_ECOSYSTEM_RISK = {
  MAX_TOTAL_BUDGET_USD: 3000,         // zkSync 相关活动总预算
  MIN_START_BUDGET_USD: 300,          // 起步预算
  MAX_SINGLE_PROTOCOL_RATIO: 0.25,    // 单协议投入不超过 zkSync 预算 25%
  GAS_BUFFER_USD: 80,                 // 预留 Gas 与试错成本
  VISIT_INTERVAL_DAYS: 30,            // 每 30 天至少回链一次
  AVOID_TAGS: ['high-apy-degen', 'unknown-team-high-slippage']
};
\`\`\`

---

## 🎯 实战 Checklist

- [ ] 使用官方桥从主网多次桥接 ETH / 稳定币到 zkSync Era  
- [ ] 至少使用 1 个第三方桥/1 条 CEX → zkSync 提币路径  
- [ ] 在 zkSync 上完成若干普通转账，而不是只与合约互动  
- [ ] 在 2-3 个 DEX 上进行 10+ 笔 Swap，LP 1-2 次并持有数日  
- [ ] 在 1-2 个借贷协议中做“存 → 借 → 还 → 退”完整流程  
- [ ] 铸造 2-3 个代表性 NFT，并在 NFT 市场上交易至少 1 笔  
- [ ] 参与 1-2 个任务平台/积分活动，记录 L2 ID 和积分累计  
- [ ] 每月至少一次“zkSync 巡逻”，更新交互日志和仓位情况  

---

## ✅ 小结

zkSync Era 生态空投玩法，不是凭运气的一次性彩票，  
而是通过“长期、多维、真实”的交互，  
构建一个 **高质量 zk Rollup 用户画像**。

当某一天官方或项目方开始清算这段历史时，  
你就可以用这份画像，  
换取属于自己的那一份 **zkSync 红利**。`
};

/**
 * 36.5 Manta Pacific 早鸟参与
 * 在 Manta Pacific（模块化 L2）上完成早期交互任务，获取 OG 身份和积分。
 */
const STRATEGY_36_5 = {
  title:
    'Manta Pacific 早鸟参与 - 借“模块化 L2 + 隐私叙事”刷 OG 身份',
  slug: 'manta-pacific-early-bird-participation',
  summary:
    '围绕 Manta Pacific 这类以模块化、隐私和高性能为卖点的 L2，通过早期桥接、DeFi、NFT、任务平台等交互，争取 OG 身份、积分和后续空投/白名单机会。关键是：1）在项目相对早期阶段即建立行为记录；2）用适度资金完成多类型 DApp 的交互；3）配合官方活动与生态激励，形成一条“模块化 L2 任务线”。',
  category: 'new-chains',
  category_l1: 'airdrop',
  category_l2: 'new-chains',
  risk_level: 4,
  apy_min: 15,
  apy_max: 220,
  min_investment: 300,
  time_commitment:
    '早期 1-2 天密集交互，之后跟随活动节奏每周/每月继续参与',
  status: 'published',
  content: `# Manta Pacific 早鸟参与 - 借“模块化 L2 + 隐私叙事”刷 OG 身份

## 💰 策略概览

| 项目 | 内容 |
|------|------|
| **适用标的** | Manta Pacific 生态：桥接、DeFi、NFT、隐私相关应用、任务平台等 |
| **起始资金** | 约 \$300 - \$3,000（ETH / 稳定币为主，视风险承受能力增加尝鲜仓位） |
| **时间投入** | 起步 1-2 天集中交互，之后根据活动节奏每周/每月追加 |
| **潜在收益** | OG 峰值身份、积分、白名单、空投、NFT 徽章等综合权益 |
| **风险等级** | ⚠️⚠️⚠️⚠️ 较高 (4/5) |
| **难度等级** | 中级偏上（协议较多、活动节奏较快，需要一定信息追踪能力） |

---

## 📖 开场故事：模块化 L2 早期，谁在做“认真的长线玩家”？

在新 L2 启动的早期，常见画面是：

- 官方推各种“OG 活动 / 早鸟计划 / 双倍积分周”；  
- 大量地址涌入，疯狂跑任务、刷数据；  
- 若干个月后，真正留下的用户只剩少数。

在 Manta Pacific 这类项目中：

1. 有人只为单次活动而来：  
   - 活动结束就 AFK；  
   - 链上行为高度集中在短期。  

2. 有人专注于短期高 APR：  
   - 梭哈流动性挖矿、做高杠杆行为；  
   - 若项目或池子出现风险，容易深套。  

3. 也有人把它当成 “模块化 L2 长线配置” 的一环：  
   - 在启动阶段就开始做基础交互；  
   - 随着生态扩展，逐步增加使用的协议与场景；  
   - 把 OG 身份和积分当作长期陪跑的“附加权益”。

本策略，就偏向第三类——  
不是急着榨干每一次活动，  
而是安静地把自己打造成 **Manta 早期的长期玩家**。

---

## 🧠 策略核心：为何要重视 Manta 这种“模块化 + 隐私”L2？

你可以简单地从三个维度理解：

1. **叙事维度**  
   - 模块化（计算与数据可分离、与外部 DA 层组合）  
   - 隐私（zk 技术栈、隐私资产、隐私应用）  
   - 高性能（为 DeFi / 游戏 / 社交提供更好体验）  

2. **生态维度**  
   - 公链本身 + DeFi + NFT + 隐私工具 + 跨链桥 + 应用层；  
   - 提供丰富可交互对象。  

3. **激励维度**  
   - 早期活动倾向资源倾斜 OG 用户、深度参与者；  
   - 多项目叠加空投/积分/白名单效应。

> 你不一定要 All-in 某一条 L2，  
>  但可以把 Manta 当成“新公链矩阵”中的一条重点线路，  
>  用系统方法运营你的早期参与记录。

---

## 🧩 子策略拆分：Manta Pacific 早鸟参与的四大模块

### 模块 A：基础桥接与入口建设

**目标：**  
- 让你在官方桥和第三方桥都有几次记录；  
- 确认资金进出路径清晰、风险可控。

动作示例：

1. **主网/其他 L2 → Manta 官方桥**  
   - 进行多次小额桥接，覆盖 ETH 和稳定币；  
   - 在不同日期完成，而不是同一天刷完。  

2. **第三方桥接 + CEX 出入金**  
   - 使用至少一个第三方桥接器（如果生态推荐）；  
   - 通过 CEX 提币到 Manta，或从 Manta 回提到 CEX。  

3. **进出链路径测试**  
   - 至少用小额完成一次 “主网 → Manta → 主网” 全流程。

---

### 模块 B：DeFi 早期参与与流动性贡献

**目标：**  
- 在 Manta 的 DeFi 核心协议中留下参与记录；  
- 尽量兼顾“稳健 + 适度冒险”。

操作建议：

1. **DEX & 基础流动性**  
   - 在 1-2 个头部 DEX 中：  
     - 完成多次 Swap（主流对和部分长尾对）；  
     - 提供 1-2 次主流池 LP（短期持有）；  
     - 根据活动，决定是否参与激励池。  

2. **借贷/收益协议**  
   - 存入少量稳定币或 ETH，体验存款端；  
   - 若协议足够成熟再考虑小额借款；  
   - 关注“流动性挖矿 / Points / OG 任务”的附加激励。  

3. **高风险板块**  
   - 如有 MEME/高波动池，  
     - 建议只用“娱乐资金”参与，  
     - 不要将整个 Manta 预算押在高风险池中。

---

### 模块 C：隐私/NFT/应用层体验（生态特色）

Manta 在隐私和模块化叙事上有优势，可以适度体验：

1. **隐私相关应用**  
   - 如存在隐私转账、隐私资产、隐私 DeFi：  
     - 完成 1-2 次小额使用；  
     - 感受体验并留下链上记录。  

2. **NFT & 身份**  
   - 铸造 Manta 生态代表性的 NFT 或 OG 徽章；  
   - 在 NFT 市场完成至少一笔买/卖。  

3. **应用层 DApp**  
   - 游戏、社交、工具类 DApp：  
     - 完成注册/绑定/基础交互；  
     - 尤其关注与官方活动绑定的应用。

---

### 模块 D：OG 活动 & 积分任务管理

**目标：**  
- 将所有官方任务/积分系统收拢到一张表中，  
- 形成你的“Manta OG 路线图”。

操作建议：

1. 建立一个“OG 活动清单”表格：  
   - 活动名称、时间范围、主要任务、积分/奖励形式、成本估算。  

2. 活动选择原则：  
   - 优先：  
     - 官方直接组织或重磅合作方联动；  
     - 成本相对可控、长期价值较高的任务。  
   - 谨慎：  
     - 高度 DeFi degen / 杠杆 / 高 APR 危险池。  

3. 对每期活动进行复盘：  
   - 自己的完成度与成本；  
   - 占整个 Manta 预算的比例是否合理；  
   - 以后遇到类似活动，要重复还是避开。

---

## 🛠️ Manta 早鸟任务管理脚本（伪代码）

\`\`\`javascript
class MantaEarlyBirdTracker {
  constructor() {
    this.campaigns = [];
  }

  /**
   * campaign 示例：
   * {
   *   id: 'og-wave-1',
   *   name: 'Manta OG Wave 1',
   *   startDate: '2024-01-15',
   *   endDate: '2024-02-28',
   *   estRewardType: 'points', // 'points' | 'airdrop' | 'nft' ...
   *   tasks: [
   *     { id: 'bridge', title: '官方桥接任务', estCostUsd: 20, estScore: 100 },
   *     { id: 'dex', title: 'DEX 流动性任务', estCostUsd: 30, estScore: 120 }
   *   ]
   * }
   */
  addCampaign(c) {
    this.campaigns.push(c);
  }

  listOngoing(now = new Date()) {
    return this.campaigns.filter((c) => {
      const s = new Date(c.startDate);
      const e = new Date(c.endDate);
      return now >= s && now <= e;
    });
  }

  calcCampaignEfficiency(id) {
    const c = this.campaigns.find((x) => x.id === id);
    if (!c) return null;
    let totalScore = 0;
    let totalCost = 0;
    (c.tasks || []).forEach((t) => {
      totalScore += t.estScore || 0;
      totalCost += t.estCostUsd || 0;
    });
    const eff = totalCost > 0 ? totalScore / totalCost : 0;
    return { id, totalScore, totalCost, efficiency: eff };
  }

  printSummary() {
    console.log('📊 Manta 早鸟活动总览：');
    this.campaigns.forEach((c) => {
      const eff = this.calcCampaignEfficiency(c.id);
      console.log(
        \`- \${c.name} (\${c.startDate} ~ \${c.endDate}) | 预估得分: \${eff.totalScore} | 成本: \$\${eff.totalCost} | 效率: \${eff.efficiency.toFixed(
          2
        )} 分/美元\`
      );
    });
  }
}
\`\`\`

---

## 📊 风控与预算建议

\`\`\`javascript
const MANTA_PACIFIC_RISK = {
  MAX_TOTAL_BUDGET_USD: 3000,        // Manta 相关总预算
  START_BUDGET_USD: 300,             // 起步预算
  MAX_CAMPAIGN_RATIO: 0.35,          // 单期活动预算不超过总预算 35%
  MAX_DEGEN_RATIO: 0.2,              // 高风险 DeFi 不超过 Manta 预算 20%
  MIN_CORE_TASK_RATIO: 0.5,          // 桥接/基础 DeFi 这类“核心任务”至少占 50%
  REVIEW_INTERVAL_DAYS: 30           // 每 30 天复盘一次 Manta 参与情况
};
\`\`\`

---

## 🎯 实战 Checklist

- [ ] 使用主网和至少一个其他 L2 → Manta 的桥接路径各 1-2 次  
- [ ] 测试“主网 → Manta → 主网”完整资金进出流程，金额合理  
- [ ] 在 1-2 个头部 DEX 上做多次 Swap，并尝试 1-2 次 LP  
- [ ] 在 1-2 个借贷/收益协议中进行存款和（可选）借款操作  
- [ ] 至少铸造 1-2 个 Manta 生态代表性 NFT，并做 1 次 NFT 交易  
- [ ] 尝试 1-2 个隐私相关应用，保留 Tx 链接作为记录  
- [ ] 建立“OG 活动清单”，为每期记录成本、时间和预期奖励  
- [ ] 控制总预算和风险敞口，不在单一活动或高风险池中过度投入  

---

## ✅ 小结

Manta Pacific 早鸟玩法，本质是：

- 在项目还处于“早期高弹性阶段”时，  
- 通过一系列并不极端的交互，  
- 把自己牢牢刻进这条 L2 的“初代用户记忆”里。

当未来某一天，  
项目开始为 OG、早期积分、长期参与者做结算时，  
你拿到的就不只是一点点短期收益，  
而是整个 **模块化 L2 成长历程的长期股权票据**。`
};

/**
 * 36.6 Blast L2 积分挖矿
 * 将资产存入 Blast L2，赚取原生收益和 Blast Points，等待代币空投。
 */
const STRATEGY_36_6 = {
  title:
    'Blast L2 积分挖矿 - 将“链上利息 + Points”打包成一条高弹性策略线',
  slug: 'blast-l2-points-farming',
  summary:
    '在 Blast 这类“原生收益 L2”上，通过存入 ETH / 稳定币获得链上被动收益，同时参与 Blast Points / Gold 等积分体系。在此基础上，结合生态 DApp、任务平台和联合活动，构建一条“利息 + 积分 + 空投”的多层收益曲线。重点是：1）控制在平台上的风险敞口；2）区分主仓与任务仓；3）制定积分挖矿周期和退出节奏。',
  category: 'new-chains',
  category_l1: 'airdrop',
  category_l2: 'new-chains',
  risk_level: 4,
  apy_min: 20,
  apy_max: 250,
  min_investment: 500,
  time_commitment:
    '起步部署 1 天，之后按照周/月周期维护仓位与任务进度',
  status: 'published',
  content: `# Blast L2 积分挖矿 - 将“链上利息 + Points”打包成一条高弹性策略线

## 💰 策略概览

| 项目 | 内容 |
|------|------|
| **适用标的** | Blast L2 上的 ETH / 稳定币存款、生态 DApp、任务平台、积分体系等 |
| **起始资金** | 约 \$500 - \$10,000（主仓资金可适度放大，但需接受平台风险） |
| **时间投入** | 起步部署 1 天，后续每周/每月管理一次仓位与任务即可 |
| **潜在收益** | 链上原生利息 + Blast Points / Gold 等积分 + 未来代币空投 + 生态活动奖励 |
| **风险等级** | ⚠️⚠️⚠️⚠️ 较高 (4/5) |
| **难度等级** | 中级（理解机制后操作并不复杂，但需要做好风险管理） |

---

## 📖 开场故事：同样是“存币等空投”，有人只拿到利息，有人拿到三层收益

在 Blast 类 L2 中，玩家的典型玩法是：

1. 把 ETH / 稳定币存进去，享受“原生收益”；  
2. 通过 Points / Gold 等积分系统，期待未来代币空投；  
3. 参与若干生态 DApp 和活动，拿额外激励。

但现实情况是：

- 有人只做“存款+躺平”，错过积分、任务、生态叠加收益；  
- 有人狂热梭哈，全部身家丢进单一协议或池子里，承受巨大系统性风险；  
- 也有人把 Blast 看作一条“高弹性但受控”的资产线：

  - 用一部分资金作为 **稳定收益主仓**；  
  - 另一小部分资金用于 **任务 + DeFi 玩法 + 高弹性挖矿**；  
  - 同时制定“周期检查 + 适时撤退”计划。

本策略就是第三种玩法：  
**把利息、积分和空投统一纳入一个风控过的计划里**，  
而不是凭感觉瞎冲。

---

## 🧠 策略核心：Blast 积分挖矿 = 利息 + 积分 + 时间维度

可以拆解为：

1. **利息层**  
   - 将 ETH / 稳定币存入 Blast，  
   - 获得链上或后台整合的收益（例如国债 / 钱市场工具）。  

2. **积分层**  
   - 存款规模 × 存放时间 → Points / Gold / Credits；  
   - 未来可能换算为 Blast 代币空投和增益权重。  

3. **生态层**  
   - 将资金进一步投入到 Blast 生态 DApp：  
     - DeFi（DEX、借贷、收益池）  
     - NFT、游戏、任务平台  
   - 获取多重项目空投/积分奖励。

> 你要做的，是为这三层分别设定 **目标与边界**，  
> 而不是一股脑地“为了积分什么都干”。

---

## 🧩 子策略拆分：Blast L2 积分挖矿的三条路线

### 路线 A：主仓 - “稳态存款 + 被动积分”

**目标：**  
- 用适量资产在 Blast 形成一个“低频管理的收益仓位”。  

操作建议：

1. 确定主仓规模：  
   - 按净资产某个比例（如 5-15%）设定 Blast 主仓上限；  
   - 这个仓位的核心职责是：  
     - 赚取利息  
     - 持续生成积分  
     - 不做高风险折腾。  

2. 将 ETH / 稳定币存入官方或核心合作入口：  
   - 确认存入后会获得利息与积分累积；  
   - 记录初始金额和时间点。  

3. 设置“周期检查”节奏：  
   - 每周或每月一次：  
     - 记录当前余额、预计年化收益、累计积分；  
     - 根据平台/市场风险情况，调整仓位大小。  

---

### 路线 B：任务仓 - “生态 DApp + 活动联动”

**目标：**  
- 用较小资金参与生态 DApp 和活动，获得额外 Points / 项目代币/ NFT 等。

操作建议：

1. 将 Blast 上总资金划分为主仓与任务仓：  
   - 例如：  
     - 70-80% 作为主仓稳定存款；  
     - 20-30% 用于任务和生态 DApp。  

2. 任务仓常见玩法：  

   - 在 Blast 上的 DEX 上进行 Swap + LP；  
   - 在借贷协议中存款/借款；  
   - 参与收益聚合/Points 叠加活动；  
   - 在 NFT/游戏/任务平台中完成“指定交互任务”。  

3. 建立“生态 DApp 清单”：  
   - 对每个 DApp 记录：  
     - 所在类别（DEX / 借贷 / NFT / 游戏 / 工具）  
     - 可能的奖励（积分 / 代币 / NFT）  
     - 预估风险等级和资金上限。  

---

### 路线 C：活动线 - “限时 Boost + 特殊任务”

**目标：**  
- 捕捉高价值的限时活动，让积分/收益在短时间内放大。

操作建议：

1. 关注官方与头部项目的公告渠道：  
   - “双倍 Points 周期”  
   - “生态联动活动”  
   - “联合任务赛季”。  

2. 对每个活动进行快速评估：  
   - 活动持续时间、需要多少操作、门槛资金大小；  
   - 是否需要将主仓部分迁移到某个特定池子；  
   - 预估收益是否值得迁移成本和增加的风险。  

3. 为每次活动设定**结束后回撤计划**：  
   - 活动结束/奖励结算后，将资金从高风险/高波动池回收到：  
     - 主仓稳定存款  
     - 或完全撤出 Blast。  

---

## 🛠️ Blast 积分挖矿仓位管理脚本（伪代码）

\`\`\`javascript
class BlastPointsManager {
  constructor(config = {}) {
    this.totalBudgetUsd = config.totalBudgetUsd || 5000;
    this.mainVaultRatio = config.mainVaultRatio || 0.7; // 主仓比例
    this.missionVaultRatio = 1 - this.mainVaultRatio;    // 任务仓比例
    this.positions = {
      main: 0,
      mission: 0
    };
  }

  initPositions() {
    this.positions.main = this.totalBudgetUsd * this.mainVaultRatio;
    this.positions.mission = this.totalBudgetUsd * this.missionVaultRatio;
  }

  /**
   * 快速估算积分收益（极简示意，真实需结合官方规则）
   * @param {number} amountUsd 存入金额
   * @param {number} days 存放天数
   * @param {number} factor 系数
   */
  estPoints(amountUsd, days, factor = 1) {
    return amountUsd * days * factor;
  }

  rebalance(newMainRatio) {
    this.mainVaultRatio = newMainRatio;
    this.missionVaultRatio = 1 - newMainRatio;
    const total = this.positions.main + this.positions.mission;
    this.positions.main = total * this.mainVaultRatio;
    this.positions.mission = total * this.missionVaultRatio;
  }

  printStatus() {
    console.log('📊 Blast 仓位分配概览：');
    console.log(
      \`- 主仓: \$\${this.positions.main.toFixed(
        2
      )} (~\${(this.mainVaultRatio * 100).toFixed(1)}%)\`
    );
    console.log(
      \`- 任务仓: \$\${this.positions.mission.toFixed(
        2
      )} (~\${(this.missionVaultRatio * 100).toFixed(1)}%)\`
    );
  }
}
\`\`\`

---

## 🛠️ Blast 活动与 DApp 清单脚本（伪代码）

\`\`\`javascript
class BlastEcosystemRegistry {
  constructor() {
    this.dapps = [];
    this.campaigns = [];
  }

  /**
   * dapp 示例：
   * {
   *   id: 'blast-dex-1',
   *   name: 'Blast DEX One',
   *   type: 'dex', // 'dex' | 'lending' | 'nft' | 'game' | 'tool'
   *   riskLevel: 3, // 1-5
   *   estApys: {
   *     base: 0.08,
   *     extraPointsFactor: 1.2
   *   }
   * }
   */
  addDapp(d) {
    this.dapps.push(d);
  }

  listDappsByType(type) {
    return this.dapps.filter((d) => d.type === type);
  }

  /**
   * 活动示例：
   * {
   *   id: 'double-points-week',
   *   name: 'Blast 双倍积分周',
   *   startDate: '2025-05-01',
   *   endDate: '2025-05-07',
   *   boostFactor: 2,
   *   relatedDapps: ['blast-dex-1', 'blast-lending-1']
   * }
   */
  addCampaign(c) {
    this.campaigns.push(c);
  }

  listOngoingCampaigns(date = new Date()) {
    return this.campaigns.filter((c) => {
      const s = new Date(c.startDate);
      const e = new Date(c.endDate);
      return date >= s && date <= e;
    });
  }

  printOverview() {
    console.log('📌 Blast 生态 DApp 与活动总览：');
    console.log('DApps:');
    this.dapps.forEach((d) => {
      console.log(
        \`- [\${d.type}] \${d.name} | 风险等级: \${d.riskLevel}/5 | 基础 APY: \${(
          (d.estApys.base || 0) * 100
        ).toFixed(1)}%\`
      );
    });
    console.log('\\n活动:');
    this.campaigns.forEach((c) => {
      console.log(
        \`- \${c.name} (\${c.startDate} ~ \${c.endDate}) | 积分加成: x\${c.boostFactor}\`
      );
    });
  }
}
\`\`\`

---

## 📊 风控与退出策略

\`\`\`javascript
const BLAST_L2_RISK = {
  MAX_TOTAL_EXPOSURE_RATIO: 0.2,   // Blast 总敞口不超过净资产 20%
  MAX_MAIN_VAULT_RATIO: 0.15,      // 主仓不超过净资产 15%
  MAX_MISSION_VAULT_RATIO: 0.05,   // 任务仓不超过净资产 5%
  MAX_SINGLE_DAPP_RATIO: 0.25,     // 单个 DApp 不超过 Blast 资金 25%
  REVIEW_INTERVAL_DAYS: 14,        // 每 14 天检查一次策略与仓位
  EMERGENCY_EXIT_RULE: '若平台或生态发生重大负面事件，先减半主仓，再评估完全撤出' // 紧急退出原则
};
\`\`\`

---

## 🎯 实战 Checklist

- [ ] 确定 Blast 总预算与主仓/任务仓比例，写入你的资产配置表  
- [ ] 完成主网 → Blast 的存款操作，记录初始金额和时间  
- [ ] 将 70-80% 资金放入“主仓”获取利息与基础积分  
- [ ] 将 20-30% 资金作为“任务仓”，参与若干 DeFi / NFT / 任务平台  
- [ ] 建立 “Blast 生态 DApp 清单”，标记风险等级与资金上限  
- [ ] 为每一次“积分 Boost 活动”设定单独预算与结束后回撤计划  
- [ ] 每两周检查一次：总仓位、积分累积、生态风险动态  
- [ ] 预先写好“紧急撤出剧本”：在出现黑天鹅时如何快速减仓和完全退出  

---

## ✅ 小结

Blast L2 积分挖矿，不是单纯的“把钱存进去坐等空投”，  
而是一个你可以精细设计的 **多层收益曲线**：

- 第一层：稳定的利息；  
- 第二层：随时间积累的 Points / Gold；  
- 第三层：生态 DApp 与活动带来的额外代币、NFT 和积分。

只要你：

- 在预算和风险上划定清晰边界；  
- 把主仓与任务仓分开管理；  
- 用脚本/表格记录并按周期调整；  

这条 Blast 线就可以从“模糊的赌空投”  
升级为你整个资产策略中 **高弹性且可控的一条模块化收益线**。`
};

/**
 * 上传 36.4 / 36.5 / 36.6 策略到 Directus
 */
async function uploadStrategies() {
  const DIRECTUS_URL = 'http://localhost:8055';

  console.log('开始上传策略 36.4 / 36.5 / 36.6...\n');

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

    // 上传策略 36.4
    console.log('上传策略 36.4: zkSync Era 生态空投...');
    await axios.post(`${DIRECTUS_URL}/items/strategies`, STRATEGY_36_4, {
      headers
    });
    console.log('✅ 策略 36.4 上传成功\n');

    // 上传策略 36.5
    console.log('上传策略 36.5: Manta Pacific 早鸟参与...');
    await axios.post(`${DIRECTUS_URL}/items/strategies`, STRATEGY_36_5, {
      headers
    });
    console.log('✅ 策略 36.5 上传成功\n');

    // 上传策略 36.6
    console.log('上传策略 36.6: Blast L2 积分挖矿...');
    await axios.post(`${DIRECTUS_URL}/items/strategies`, STRATEGY_36_6, {
      headers
    });
    console.log('✅ 策略 36.6 上传成功\n');

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
