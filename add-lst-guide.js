const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

/**
 * 建议：把账号密码改为环境变量读取，避免泄漏
 * const DIRECTUS_EMAIL = process.env.DIRECTUS_EMAIL
 * const DIRECTUS_PASSWORD = process.env.DIRECTUS_PASSWORD
 */

const GUIDE_CONFIG = {
  // ===== 基本信息 =====
  title: 'LST 质押（Liquid Staking）完全指南',
  slug: 'lst-staking-complete-guide',
  summary: '系统掌握 LST（stETH/rETH/eETH/sfrxETH 等）的获取、收益来源、二次利用（借贷/LP/再质押）与完整风控清单。',

  // 在 Directus 中替换为真实分类 ID
  category: 'fab597a5-2d87-479a-8682-be30d95e925a',

  // 一级分类（与站内一致）
  category_l1: 'yield',
  // 二级分类
  category_l2: 'LST 质押',

  // ===== 元数据 =====
  difficulty_level: 2,  // 1-5（2=易上手）
  risk_level: 2,        // 1-5（2=较低-中）
  apy_min: 3,
  apy_max: 12,

  // 资金/时间/技术门槛
  threshold_capital: '100-10000 USD',
  threshold_capital_min: 100,
  time_commitment: '每周 30-60 分钟',
  time_commitment_minutes: 45,
  threshold_tech_level: 'beginner', // beginner / intermediate / advanced

  // ===== 可读性强的 Markdown 正文 =====
  content: `> **适用人群**：想用 ETH 获得链上被动收益，并希望资产保持流动性的用户  
> **阅读时间**：≈ 7–10 分钟  
> **关键词**：LST（Liquid Staking Token）/ stETH / rETH / eETH / sfrxETH / 复利 / 兑换队列 / 折价风险 / 再质押

---

## 🧭 TL;DR
- **核心做法**：存入 ETH 获得 LST（如 stETH、rETH、eETH、sfrxETH），享受 **验证者出块收益 + 手续费 + MEV** 等（已体现在 LST 的份额或价格中）。  
- **二次利用**：用 LST 去 **做借贷（抵押借入）/ 做市（LST-ETH 稳定池）/ 再质押（LRT/EigenLayer）** 叠加收益。  
- **主要风险**：LST 与 ETH 的 **脱锚折价**、合约与运营风险、退出排队期（提现/赎回等待）、策略叠加后的杠杆风险。  
- **简易路径**：新手直接持有主流 LST 并长期持有；进阶再接入借贷与 LP；高手再考虑再质押与杠杆。

---

## 🗂 目录
1. [什么是 LST](#什么是-lst)
2. [收益来源与计息方式](#收益来源与计息方式)
3. [典型平台与差异](#典型平台与差异)
4. [三种常见玩法](#三种常见玩法)
5. [三步极速上手](#三步极速上手)
6. [进阶：LST 的二次利用](#进阶lst-的二次利用)
7. [风险矩阵与规避清单](#风险矩阵与规避清单)
8. [工具与平台导航](#工具与平台导航)
9. [FAQ](#faq)
10. [一页执行清单](#一页执行清单)

---

## 📘 什么是 LST
**LST（Liquid Staking Token）** 是把 ETH 委托给质押服务后得到的可流通代币（如 **stETH / rETH / eETH / sfrxETH**）。  
与传统质押不同，LST **可自由转移与交易**，并可参与 DeFi 获取额外收益。

**优势**
- 资产 **保持流动性**，不必锁定 32 ETH；  
- 收益 **自动复利** 或 **价格增益** 体现；  
- 可叠加 DeFi 策略（借贷/LP/再质押）。

---

## 📈 收益来源与计息方式
- **共识层奖励**：出块奖励、手续费与 MEV 分成按比例分配；  
- **计息模式**：  
  - **rebase 型（如 stETH）**：每日增加余额；  
  - **价格增益型（如 sfrxETH）**：代币余额不变，价格上涨体现收益。  
- **年化范围**：受链上质押比、MEV 市况影响，通常 **3–6%**，特殊时期可能更高或更低。

---

## 🧭 典型平台与差异
| 协议 | 代币 | 计息方式 | 优点 | 可能权衡 |
|---|---|---|---|---|
| Lido | stETH | rebase | 体量最大、流动性深 | DAO治理与运营风险、极端时折价 |
| Rocket Pool | rETH | 价格增益 | 更去中心化、节点可参与 | 兑换深度较分散 |
| Ether.fi | eETH | rebase | 与再质押生态联动强 | 新协议发展期风险 |
| Frax Ether | sfrxETH | 价格增益 | 清晰复利逻辑 | 生态相对集中 |

> 💡 **选择原则**：看 **流动性深度**、**退出队列**、**安全审计** 与 **生态可用性**（能否借贷/做市/再质押）。

---

## 🧱 三种常见玩法
| 玩法 | 步骤 | 典型年化 | 适合人群 | 备注 |
|---|---|---:|---|---|
| **单持有** | ETH → 铸造 LST → 长期持有 | 3–6% | 新手 | 简单稳健、注意折价时段 |
| **LST→借贷** | LST 抵押 → 借入稳定币/ETH → 低杠杆复投 | 5–10%+ | 进阶 | 借贷利率变化与清算风险 |
| **LST-ETH LP** | LST 与 ETH 做市赚手续费+激励 | 6–12%+ | 高阶 | 需管理脱锚与无常损失 |

---

## 🚀 三步极速上手
### 第 1 步：准备
- 钱包（Metamask/Rabby）、ETH 资金、少量 Gas；  
- 选择目标 LST（如 stETH/rETH/eETH/sfrxETH）。

### 第 2 步：铸造或兑换
- 官方前端或聚合器（例如主流 DEX 路由）将 ETH → LST；  
- 记录：协议/代币/份额/时间/预估 APY/退出方式。

### 第 3 步：持有与复利
- 按月复盘收益，逢 **折价与低滑点时** 进行小幅增持；  
- 计划接入借贷或 LP 时，先进行小额试仓验证流动性与成本。

---

## ♻️ 进阶：LST 的二次利用
1. **LST 抵押借贷**：在 Aave/Morpho/Spark 抵押 stETH/rETH 等，借入稳定币或 ETH 再投入，**杠杆倍数务必保守（HF≥1.5）**；  
2. **LST-ETH 做市**：在 Curve/Uniswap v3 等池子做市，赚手续费与激励，注意 **LST 折价** 与 **无常损失**；  
3. **再质押（Restaking/LRT）**：将 LST 兑换为 LRT（如 eETH→weETH 等）参与 EigenLayer 相关激励，**收益更高但叠加了额外协议/对手方风险**。

---

## 🛡️ 风险矩阵与规避清单
**风险矩阵**
| 风险 | 可能性 | 影响 | 说明 |
|---|---|---|---|
| 脱锚折价 | 中 | 中-高 | 极端行情时 LST 价格 \\< ETH，退出期可能拉长 |
| 合约/托管风险 | 低-中 | 高 | 智能合约漏洞、运营与密钥管理 |
| 退出队列与流动性 | 低-中 | 中 | 大量赎回时等待时间增加、滑点扩大 |
| 叠加策略风险 | 低-中 | 中-高 | 借贷/LP/再质押带来杠杆与清算链式风险 |

**规避清单**
- 优先 **主流 LST**，看 **深度/审计/退出机制**；  
- **分散协议** 与 **分散持仓时间**；  
- 借贷/LP/再质押按 **小仓→验证→放大** 的节奏；  
- 设置 **价差/健康因子/池子深度** 监控与提醒；  
- 定期 **Revoke 授权**，记录所有操作与成本。

---

## 🧰 工具与平台导航
- **LST 协议**：Lido（stETH）/ RocketPool（rETH）/ Ether.fi（eETH）/ Frax（sfrxETH）  
- **借贷**：Aave / Morpho / Spark  
- **做市**：Curve / Uniswap v3 / Balancer  
- **聚合&监控**：DeFiLlama（收益对比）/ DeBank & Zerion（资产看板）/ Revoke.cash（授权管理）

---

## ❓FAQ
**Q1：LST 与 ETH 为什么会有价差？**  
> 受 **流动性/退出队列/市场情绪** 影响，短期可能折价或溢价，长期通常回归。  

**Q2：rebase 与价格增益哪种更好？**  
> rebase 型余额增长更直观；价格增益型更易做财务记账。按你的场景与生态兼容性选择。  

**Q3：是否需要再质押（LRT）？**  
> 再质押可能提升收益，但叠加额外协议与对手方风险。**新手不建议**；进阶也应小仓试错。

---

## ✅ 一页执行清单
- [ ] 选择 LST：stETH / rETH / eETH / sfrxETH  
- [ ] 记录：协议/份额/APY/退出方式/主要风险  
- [ ] 设提醒：折价扩大、池子深度下降、再质押合约更新  
- [ ] 按月复盘：是否需要接入借贷或 LP、是否继续增持  
- [ ] 安全：授权最小化、定期 Revoke、分散协议
`,

  // ===== 与前端适配的步骤结构 =====
  steps: [
    { step_number: 1, title: '准备与选型', description: '准备 ETH 与 Gas；在 stETH/rETH/eETH/sfrxETH 中选一个主力标的。', estimated_time: '10 分钟' },
    { step_number: 2, title: '铸造或兑换', description: '通过官方或聚合器将 ETH → LST，并记录份额与退出方式。', estimated_time: '10 分钟' },
    { step_number: 3, title: '持有与复盘', description: '每月复盘一次收益与价差；折价时小幅增持以摊薄成本。', estimated_time: '持续进行' },
    { step_number: 4, title: '二次利用（可选）', description: '小仓试入借贷/LP/再质押；确保健康因子或价差监控到位。', estimated_time: '30–60 分钟' },
    { step_number: 5, title: '风险控制与退出', description: '遇到大幅折价/退出排队过长/负面舆情时，降低仓位或切换标的。', estimated_time: '5 分钟/次' },
  ],
};

// ===== 自动执行：与模板保持一致 =====
async function getAuthToken() {
  const response = await axios.post(`${DIRECTUS_URL}/auth/login`, {
    email: 'the_uk1@outlook.com',
    password: 'Mygcdjmyxzg2026!',
  });
  return response.data.data.access_token;
}

async function addGuide() {
  try {
    const token = await getAuthToken();

    const strategy = {
      ...GUIDE_CONFIG,
      status: 'published',
      is_featured: true,
      view_count: 0,
      bookmark_count: 0,
      published_at: new Date().toISOString(),
    };

    const response = await axios.post(
      `${DIRECTUS_URL}/items/strategies`,
      strategy,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    console.log('\n✅ LST 质押指南创建成功!');
    console.log(`   ID: ${response.data.data.id}`);
    console.log(`   Slug: ${response.data.data.slug}`);
    console.log(`   访问: http://localhost:3000/strategies/${response.data.data.slug}\n`);
  } catch (error) {
    console.error('\n❌ 创建失败:', error.response?.data || error.message);
  }
}

addGuide();
