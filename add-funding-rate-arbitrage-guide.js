const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

/**
 * 建议：生产环境用环境变量保存账号与密码
 * const DIRECTUS_EMAIL = process.env.DIRECTUS_EMAIL
 * const DIRECTUS_PASSWORD = process.env.DIRECTUS_PASSWORD
 */

const GUIDE_CONFIG = {
  // ===== 基本信息 =====
  title: '资金费率套利（Funding Rate Arbitrage）完全指南',
  slug: 'funding-rate-arbitrage-complete-guide',
  summary:
    '系统梳理永续合约资金费率与期现基差原理，给出三种主流套利打法（Delta-Neutral 资金费率、期现套保、跨所资金截取），并配风控与指标看板。',

  // 在 Directus 中替换为真实分类 ID
  category: '778fadcb-b257-4e11-9aac-7c924845e024',

  // 站内一级/二级分类（按你的要求）
  category_l1: 'arbitrage',
  category_l2: '资金费率套利',

  // ===== 元数据 =====
  difficulty_level: 4,     // 1-5
  risk_level: 3,           // 价格/执行/费率/平台风险
  apy_min: 5,              // 视市场而变动（示例区间）
  apy_max: 40,

  // 资金/时间/技术门槛（用于前端展示或检索）
  threshold_capital: '1,000-100,000 USD（保证金与对冲仓位总计）',
  threshold_capital_min: 1000,
  time_commitment: '每日 15–45 分钟（巡检/调仓/对冲）',
  time_commitment_minutes: 30,
  threshold_tech_level: 'intermediate',

  // ===== 可读性强的 Markdown 正文 =====
  content: `> **适用人群**：希望用“方向中性（Delta-Neutral）”方式赚取 **资金费率/基差** 的用户  
> **阅读时间**：≈ 12–15 分钟  
> **关键词**：Funding Rate / Basis / Cash & Carry / Delta-Neutral / 资金费 / 手续费 / 杠杆与保证金

---

## 🧭 TL;DR
- **资金费率套利** 核心：同时建立 **现货（或等价多头）+ 永续空头**（或反向组合），使方向风险≈0，赚 **资金费率/基差**。  
- **三类主打法**：  
  1) **永续资金费率截取（Delta-Neutral）**：多现货、空永续，收正向资金费；  
  2) **期现（基差）套保（Cash & Carry）**：多现货、空季度/当季合约，收年化基差；  
  3) **跨所资金截取**：不同交易所间资金费率差/补贴差。  
- **关键KPI**：**净年化 = 资金费/基差 − 手续费 − 资金费（反向） − 借贷/资金成本 − 滑点**；**保证金利用率**、**强平价与安全垫** 必须可视化。

---

## 🗂 目录
1. [原理速览：资金费率与基差](#原理速览资金费率与基差)
2. [三种主流策略](#三种主流策略)
3. [费用与收益拆解](#费用与收益拆解)
4. [三步极速上手](#三步极速上手)
5. [进阶：多资产/跨所/自动化](#进阶多资产跨所自动化)
6. [风险矩阵与规避清单](#风险矩阵与规避清单)
7. [指标面板与记录模板](#指标面板与记录模板)
8. [FAQ](#faq)
9. [一页执行清单](#一页执行清单)

---

## 📘 原理速览：资金费率与基差
- **资金费率（Funding Rate）**：永续合约与现货价格锚定机制。**多头付空头**（正资金费）或 **空头付多头**（负资金费），通常按 **8h/1h** 结算。  
- **期现基差（Basis）**：远期/季度合约价格与现货的差额；正基差常见于多头拥挤或利率溢价环境。  
- **方向中性**：多/空对冲 **Delta**，主要暴露在 **费率/基差变化、执行与平台** 等风险上。

---

## 🧱 三种主流策略
| 策略 | 组合 | 收益来源 | 适合人群 | 要点 |
|---|---|---|---|---|
| **资金费率截取** | 多现货（或多U本位合约）+ 空永续 | 正资金费 | 新手-进阶 | 保证金安全垫、注意爆仓线 |
| **期现（基差）套保** | 多现货 + 空季度/当季合约 | 年化基差 | 进阶 | 展期（滚仓）成本与时点 |
| **跨所资金截取** | 同向多现货空永续，但分布在两家所 | 资金费差/补贴 | 进阶/高手 | 充值/提币时延与费用、API 执行一致性 |

> 💡 **现货等价物**：若用 **LST/LRT/ETF/现货指数合约** 替代“买现货”，需确认 **折价/流动性/质押收益与抵押权重**。

---

## 💸 费用与收益拆解
**净收益（示例）**  
\`Net APR = Funding/Basis 收益 − 交易手续费 − 借贷/资金成本 − 展期/跨所成本 − 滑点与资金费反向项\`

**必要成本项**  
- 交易费（现货+合约开平）  
- 保证金占用与资金/借贷成本  
- 资金费 **反向支付**（当费率转负）  
- 展期成本（季度合约移仓）  
- 跨所：充值/提币费、链上提现与到账时延

---

## 🚀 三步极速上手
### 第 1 步：搭建组合与预演
- 选 1–2 个 **深度好、费率低** 的交易所；  
- 以小仓 **同步** 建立：\\*多现货\\* + \\*空永续/季度\\*；  
- 预演 **强平价** 与 **安全垫**（例如：安全垫≥3–5 倍单次资金费波动）。

### 第 2 步：运行与巡检
- 每日/每 8h 记录：资金费率、基差、费/成本、保证金比率、资金曲线；  
- 触发阈值动作：  
  - 资金费率 **长时间趋近 0 或转负** → 降仓或换标的；  
  - 合约价格 **偏离/基差收敛** → 展期/平仓。

### 第 3 步：扩大与分散
- 策略验证后，分散 **交易所/标的**（BTC/ETH/主流币优先）；  
- 自动化：用 **n8n/脚本** 监控费率、保证金、资金曲线与阈值告警。

---

## ♻️ 进阶：多资产/跨所/自动化
- **多资产篮子**：以 **相关性低** 的标的均衡敞口变化；  
- **跨所**：以 **低费率+高返佣** 的所为主场，次场用于对冲或切换；  
- **自动化**：定时拉取费率/基差 → 计算 **净APR** → 低于阈值触发降仓/切换；  
- **资金调度**：预留 **USDT/USDC 缓冲** 用于补保证金，避免被动减仓。

---

## 🛡️ 风险矩阵与规避清单
**风险矩阵**
| 风险 | 可能性 | 影响 | 说明 |
|---|---|---|---|
| 费率反转/基差收敛 | 中 | 中 | 收益转负或显著下滑 |
| 爆仓/穿仓 | 低-中 | 高 | 突发行情+保证金不足 |
| 执行与滑点 | 中 | 中 | 开/平不同步、价格冲击 |
| 资金/借贷成本上升 | 中 | 中 | APR 被侵蚀 |
| 平台/合规/提现 | 低-中 | 高 | 宕机、风控、提现延迟 |

**规避清单**
- **安全垫**：保证金≥策略所需的 **1.5–2×**，强平价与补仓机制明确；  
- **分散平台** 与 **标的**；  
- 建立 **净APR阈值** 与 **自动告警**；  
- 记录全部成本，按周复盘 **真实净收益**；  
- **不用过度杠杆**，避免尾部风险放大。

---

## 📊 指标面板与记录模板
- **资金费/基差曲线**（按 8h/1h/日）  
- **净APR 与成本分解**：资金费、手续费、资金/借贷、展期、跨所  
- **保证金利用率与强平距离**  
- **分散度**：所×标的×方向占比  
- **阈值**：净APR<阈值、保证金<阈值、费率反转 → 通知/降仓/平仓

---

## ❓FAQ
**Q1：负资金费时还能做吗？**  
> 可反向组合（空现货/多永续）理论可赚负资金费，但**借贷/卖空约束与成本**通常更高，需重算净APR。  
**Q2：需要高杠杆吗？**  
> 非必须。多数情况下 **低杠杆+高安全垫** 的 **稳态净APR** 更优。  
**Q3：期现和永续套利哪个更好？**  
> 看 **年化/成本/执行可行性**。期现受 **展期点** 影响，永续受 **费率波动** 影响。

---

## ✅ 一页执行清单
- [ ] 选深度好/费率低的交易所与标的（BTC/ETH 优先）  
- [ ] 小仓同步建：多现货 + 空永续/季度；预演强平与安全垫  
- [ ] 看板记录：资金费/基差、净APR、保证金、成本分解  
- [ ] 设阈值：净APR/保证金/费率反转触发降仓或切换  
- [ ] 周度复盘：真实净收益、平台/标的替换、分散化
`,

  // ===== 与前端适配的步骤结构（5步） =====
  steps: [
    { step_number: 1, title: '搭建组合与预演', description: '选深度好/费率低的平台，小仓同步建仓并预演强平价与安全垫。', estimated_time: '30–60 分钟' },
    { step_number: 2, title: '运行与巡检', description: '按 8h/日记录资金费/基差与净APR，监控保证金与阈值。', estimated_time: '每日 15–45 分钟' },
    { step_number: 3, title: '扩大与分散', description: '验证后分散所与标的，预留稳定币缓冲，用于补保证金。', estimated_time: '30 分钟' },
    { step_number: 4, title: '展期/切换', description: '季度合约接近到期滚仓；永续净APR降至阈值则切换标的或降仓。', estimated_time: '10–30 分钟/次' },
    { step_number: 5, title: '复盘与自动化', description: '周度复盘真实净收益；用 n8n/脚本做费率与保证金阈值告警。', estimated_time: '30–60 分钟/周' },
  ],
};

// ===== 自动执行：与既有模板一致 =====
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

    console.log('\n✅ 资金费率套利 指南创建成功!');
    console.log(`   ID: ${response.data.data.id}`);
    console.log(`   Slug: ${response.data.data.slug}`);
    console.log(`   访问: http://localhost:3000/strategies/${response.data.data.slug}\n`);
  } catch (error) {
    console.error('\n❌ 创建失败:', error.response?.data || error.message);
  }
}

addGuide();
