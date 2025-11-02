const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

/**
 * 建议：生产环境改为用环境变量读取账号密码
 * const DIRECTUS_EMAIL = process.env.DIRECTUS_EMAIL
 * const DIRECTUS_PASSWORD = process.env.DIRECTUS_PASSWORD
 */

const GUIDE_CONFIG = {
  // ===== 基本信息 =====
  title: '再质押 / LRT（Liquid Restaking）完全指南',
  slug: 'lrt-liquid-restaking-complete-guide',
  summary: '系统掌握再质押（EigenLayer 生态）的原理、主流 LRT（weETH/rsETH/ezETH/pufETH 等）、收益路径与风控清单，含上手与进阶策略。',

  // 在 Directus 中替换为真实分类 ID
  category: 'fab597a5-2d87-479a-8682-be30d95e925a',

  // 站内一级/二级分类（与你站点保持一致）
  category_l1: 'yield',
  category_l2: '再质押/LRT',

  // ===== 元数据 =====
  difficulty_level: 3,          // 1-5
  risk_level: 3,                // 1-5（叠加协议/对手方风险）
  apy_min: 5,
  apy_max: 25,

  // 资金/时间/技术门槛（用于前端展示或检索）
  threshold_capital: '100-10000 USD',
  threshold_capital_min: 100,
  time_commitment: '每周 60-120 分钟',
  time_commitment_minutes: 90,
  threshold_tech_level: 'intermediate',

  // ===== 可读性强的 Markdown 正文 =====
  content: `> **适用人群**：已了解 ETH 质押/LST 的用户，想通过再质押（Restaking）叠加收益  
> **阅读时间**：≈ 10–12 分钟  
> **关键词**：EigenLayer / AVS / LRT（weETH、rsETH、ezETH、pufETH…）/ 再质押点数 / 双层风险

---

## 🧭 TL;DR
- **核心**：把 ETH 或 LST（如 stETH）再质押到 EigenLayer 生态，通过 **LRT（流动性再质押代币）** 获得额外收益/激励。  
- **路径**：ETH → LST（可选）→ LRT → 借贷/LP/做市/任务 → 复利。  
- **收益**：来自 **基础质押收益 + AVS 激励/积分 + 平台激励** 等，总体 5–25% 不等。  
- **风险**：叠加协议/对手方/清算/折价风险，**务必小仓试错、分散平台**。

---

## 🗂 目录
1. [什么是再质押 / LRT](#什么是再质押--lrt)
2. [收益来源与计息逻辑](#收益来源与计息逻辑)
3. [主流 LRT 对比](#主流-lrt-对比)
4. [三类典型玩法](#三类典型玩法)
5. [三步极速上手](#三步极速上手)
6. [进阶：杠杆与组合策略](#进阶杠杆与组合策略)
7. [风险矩阵与规避清单](#风险矩阵与规避清单)
8. [工具与平台导航](#工具与平台导航)
9. [FAQ](#faq)
10. [一页执行清单](#一页执行清单)

---

## 📘 什么是再质押 / LRT
**再质押（Restaking）**：将已质押的 ETH（或 LST）再委托给 **EigenLayer** 等再质押框架，为不同的 **AVS（Actively Validated Services）** 提供安全，从而获取额外回报。  
**LRT（Liquid Restaking Token）** 是再质押后获得的 **可转移/可组合** 的流动性代币，如 **weETH / rsETH / ezETH / pufETH** 等，可进一步参与 DeFi。

**优势**
- **叠加收益**：在 LST 收益之上再获取 AVS/积分/平台激励  
- **保持流动性**：LRT 可交易、可抵押  
- **生态丰富**：可与借贷、LP、做市等组合

**权衡**
- **双层风险**：在 LST 风险基础上再叠加再质押协议/AVS 风险  
- **折价/退出**：极端时 LRT 可能折价、赎回等待

---

## 📈 收益来源与计息逻辑
- **基础收益**：ETH 共识层质押收益（若来源为 LST）  
- **AVS 激励/积分**：与接入的 AVS 数量/权重相关  
- **平台代币激励**：LRT 协议的奖励/积分  
- **二次利用**：LRT 用于借贷/LP/做市的额外收益  
> 注：不同 LRT 的计息方式不同（rebase 或价格增益），并可能叠加“积分/点数”体系。

---

## 🧭 主流 LRT 对比
| 协议 | 代币示例 | 上游资产 | 计息方式 | 优点 | 可能权衡 |
|---|---|---|---|---|---|
| Ether.fi | weETH / eETH | ETH / LST | 多为 rebase/份额型 | 生态活跃、整合度高 | 新模块/集成期需关注风险 |
| KelpDAO | rsETH | LST | 价格增益/积分强 | 再质押激励路径清晰 | 兑换深度因链/池不同而异 |
| Renzo | ezETH | ETH / LST | rebase/积分强 | 流动性与任务较多 | 高峰期折价与排队需关注 |
| Puffer | pufETH | ETH | rebase | 去中心化运营叙事 | 新增功能期需留意变更 |

> **选择原则**：看 **资产来源（ETH/LST）**、**流动性深度**、**激励可兑付性**、**退出渠道** 与 **安全审计/运行历史**。

---

## 🧱 三类典型玩法
| 玩法 | 步骤 | 典型年化 | 适合人群 | 备注 |
|---|---|---:|---|---|
| **基础持有** | ETH→LRT；长期持有，领积分/空投 | 5–10%+ | 新手/保守 | 简单稳健，关注折价与公告 |
| **LRT→借贷** | 抵押 LRT 借入稳定币/ETH，再复投 | 8–18%+ | 进阶 | 留足 HF，注意利率与清算 |
| **LRT-ETH LP** | LRT 与 ETH 做市赚手续费/激励 | 10–25%+ | 高阶 | 管理折价与无常损失 |

---

## 🚀 三步极速上手
### 第 1 步：准备
- 钱包（Metamask/Rabby）、ETH、少量 Gas；  
- 选定目标 LRT（如 weETH/rsETH/ezETH/pufETH）。

### 第 2 步：铸造或兑换
- 通过官方前端或聚合器将 ETH/LST → LRT；  
- 记录：协议/代币/数量/时间/APY/退出方式（赎回/二级市场）。

### 第 3 步：持有与复盘
- 每周查看积分/激励/折价、月度复盘实际净收益；  
- 计划参与借贷/LP 时，先小额试仓，观察流动性与成本。

---

## ♻️ 进阶：杠杆与组合策略
1. **抵押借贷复投**：LRT 抵押 → 借入稳定币或 ETH → 再换回上游资产或继续 LRT，收益叠加但**清算风险同步放大**；  
2. **LRT-ETH 做市**：选择深度好的稳定池，赚手续费+激励，需关注 **LRT 折价** 与 **波动区间**；  
3. **任务/积分博弈**：关注 AVS/协议任务窗口，结合 **成本→积分→预期收益** 做性价比评估。

**纪律规则（建议）**
- 单协议不超过 **30–40%** 总本金；  
- **HF ≥ 1.5**，极端行情前进一步抬高；  
- 出现 **折价扩大/赎回排队/负面舆情** → 及时降仓；  
- 所有授权定期 **Revoke**。

---

## 🛡️ 风险矩阵与规避清单
**风险矩阵**
| 风险 | 可能性 | 影响 | 说明 |
|---|---|---|---|
| 折价/赎回排队 | 中 | 中-高 | 市场波动或集中退出导致 LRT 折价与排队 |
| 叠加协议风险 | 低-中 | 高 | 在 LST 风险上再叠加 LRT/AVS/桥接等 |
| 清算风险（杠杆） | 中 | 高 | 借贷利率或价格突变导致 HF 触线 |
| 智能合约/运营 | 低-中 | 高 | 新模块/权限变更期需额外关注 |
| 流动性不足 | 低-中 | 中 | 细分链/池子可能深度不足、滑点大 |

**规避清单**
- 主流协议优先、**多平台分散**、小仓试错；  
- 设置 **价差/HF/利率/池深** 监控与通知；  
- 统一表格记录投入/收益/阈值/事件；  
- 杠杆严格限额，任务型策略控制操作频率以降低成本；  
- 定期复盘 **真实净收益（扣除 Gas/滑点/机会成本）**。

---

## 🧰 工具与平台导航
- **LRT 协议**：Ether.fi（weETH）/ KelpDAO（rsETH）/ Renzo（ezETH）/ Puffer（pufETH）  
- **借贷**：Aave / Morpho / Spark（关注是否支持对应 LRT 抵押）  
- **做市**：Curve / Uniswap v3 / Balancer（选深度好、费率合适的池）  
- **聚合与监控**：DeFiLlama（收益/TVL）/ DeBank、Zerion（资产看板）/ Revoke.cash（授权管理）

---

## ❓FAQ
**Q1：LRT 与 LST 有何不同？**  
> LST 表示“质押后的流动性代币”，而 LRT 是“再质押后的流动性代币”，后者叠加了再质押收益与风险。  

**Q2：是否一定要先有 LST 才能做 LRT？**  
> 视协议而定，有的支持 ETH 直接铸造 LRT；有的从 LST 路径进入更顺滑。  

**Q3：积分/空投有保证吗？**  
> 不保证。视协议与 AVS 实际发放规则，务必评估投入产出比、避免为积分过度冒险。

---

## ✅ 一页执行清单
- [ ] 选择 LRT：weETH / rsETH / ezETH / pufETH …  
- [ ] 记录：平台/数量/APY/退出/主要风险点  
- [ ] 设提醒：折价扩大、HF<1.3、利率飙升、池子深度下降  
- [ ] 小仓试错：借贷/LP/任务先低额验证  
- [ ] 月度复盘：净收益与风险是否匹配，必要时降仓或切换
`,

  // ===== 与前端适配的步骤结构（5步） =====
  steps: [
    { step_number: 1, title: '准备与选型', description: '准备 ETH 与 Gas；从主流 LRT 中选定标的，确认上游资产与退出方式。', estimated_time: '15 分钟' },
    { step_number: 2, title: '铸造或兑换 LRT', description: '通过官方或聚合器完成 ETH/LST → LRT；记录份额与成本。', estimated_time: '10–20 分钟' },
    { step_number: 3, title: '监控与复盘', description: '每周查看积分/激励/折价与公告，按月复盘真实净收益。', estimated_time: '持续进行' },
    { step_number: 4, title: '二次利用（可选）', description: '小仓接入借贷或 LP 做市；严格风控（HF≥1.5、分散平台）。', estimated_time: '30–60 分钟' },
    { step_number: 5, title: '风控与退出', description: '折价/排队/负面舆情出现时，降仓或切换标的；定期 Revoke 授权。', estimated_time: '5 分钟/次' },
  ],
};

// ===== 自动执行（与既有模板一致）=====
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

    console.log('\n✅ 再质押/LRT 指南创建成功!');
    console.log(`   ID: ${response.data.data.id}`);
    console.log(`   Slug: ${response.data.data.slug}`);
    console.log(`   访问: http://localhost:3000/strategies/${response.data.data.slug}\n`);
  } catch (error) {
    console.error('\n❌ 创建失败:', error.response?.data || error.message);
  }
}

addGuide();
