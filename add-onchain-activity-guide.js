const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

/**
 * 建议生产环境使用环境变量：
 * const DIRECTUS_EMAIL = process.env.DIRECTUS_EMAIL
 * const DIRECTUS_PASSWORD = process.env.DIRECTUS_PASSWORD
 */

const GUIDE_CONFIG = {
  // ===== 基本信息 =====
  title: '链上活跃度（On-Chain Activity）完全指南',
  slug: 'onchain-activity-complete-guide',
  summary:
    '围绕“被看见、可验证、可量化”的三要素，系统梳理链上活跃度的评分维度、低成本提升路径、跨链与多协议覆盖策略、证据留存与自动化看板。',

  // 在 Directus 中替换为真实分类 ID
  category: '86f66a84-f8c7-4c7f-bd71-b97ad9cbc446',

  // 站内一级/二级分类
  category_l1: 'airdrop',
  category_l2: '链上活跃度',

  // ===== 元数据 =====
  difficulty_level: 2,                 // 1-5
  risk_level: 2,                       // 费用/授权/钓鱼
  apy_min: 0,
  apy_max: 0,

  // 资金/时间/技术门槛（用于前端筛选/展示）
  threshold_capital: '20–2,000 USD（小额多次、分散到期）',
  threshold_capital_min: 20,
  time_commitment: '每周 1–2 小时（批量交互+巡检+留痕）',
  time_commitment_minutes: 90,
  threshold_tech_level: 'beginner',

  // ===== 可读性强的 Markdown 正文 =====
  content: `> **适用人群**：想以最低成本提升地址“可信活跃度”，提高 **积分/空投/白名单** 命中率的个人或小团队  
> **阅读时间**：≈ 12–16 分钟  
> **关键词**：Active Days / Tx Count / Unique Protocols / Unique Chains / Gas / LP Days / Governance / Bridge / On-Chain Proof / Automation

---

## 🧭 TL;DR
- **活跃度三要素**：**频率（Active Days）**、**广度（Chains/Protocols 多样性）**、**质量（真实交互/留存/资金利用）**。  
- **低成本策略**：**小额多次**、**所内换币优先**、选择 **低费链/低费时段**、把 **交互打包**（同批次完成多个动作）。  
- **证据链**：每次操作都要 **保存 Tx/截图/时间**，统一落库，便于后续 **申诉/补发** 与团队复盘。

---

## 🗂 目录
1. [活跃度的常见评分维度](#活跃度的常见评分维度)
2. [低成本提升路径（动作清单）](#低成本提升路径动作清单)
3. [覆盖广度：多链多协议布局](#覆盖广度多链多协议布局)
4. [留存与质量：把活跃做“厚”](#留存与质量把活跃做厚)
5. [成本控制与安全SOP](#成本控制与安全sop)
6. [自动化与看板字段](#自动化与看板字段)
7. [FAQ](#faq)
8. [一页执行清单](#一页执行清单)

---

## 📊 活跃度的常见评分维度
- **频率**：活跃天数（7/14/30/90D）、周活/月活、**连续签到天数**；  
- **数量**：Tx 次数、成功率、失败率；  
- **广度**：**独立链数**、**独立协议数/合约数**、交互类型多样性（Swap/Bridge/Stake/LP/借贷/治理等）；  
- **质量**：**LP 持续天数**、借贷天数、治理投票次数、合约部署/调用复杂度、**真实 Gas 消耗（去噪）**；  
- **风险与合规**：授权管理、白名单协议比例、桥接在途时长、异常事件响应。

---

## 🧰 低成本提升路径（动作清单）
> 原则：小额多次、同批打包、低费链优先、保留证据链  
- [ ] **Swap**：每周 1–2 次小额兑换（DEX 聚合器/头部 DEX），设置合理最小滑点；  
- [ ] **Bridge**：月度 1–2 次官方桥 **小额分批**（在低费时段）；  
- [ ] **Stake/Unstake**：小额质押/解押主流资产或稳定币金库（白名单策略）；  
- [ ] **LP**：选择深度池 **短期持有**（7–14 天），记录 LP Days；  
- [ ] **Lend/Borrow**：小额存借，设置清算告警；  
- [ ] **NFT/社交**：铸造 OAT、绑定 X/Discord、关注/发帖；  
- [ ] **治理**：Snapshot/Tally 投票 1–2 次/月（有票即用）；  
- [ ] **任务平台**：Galxe/Layer3/QuestN 等完成基础任务；  
- [ ] **多时间段覆盖**：把同类动作分布在不同日/周，打造留存曲线。

---

## 🗺️ 覆盖广度：多链多协议布局
- **多链**：在 **L2（OP/ZK）与主流 L1** 之间均衡活跃；优先 **Gas 低、生态活跃** 的链；  
- **多协议**：至少覆盖 **DEX、借贷、金库/聚合、稳定币/桥、社交/治理** 五大类头部协议；  
- **路线图**：每月新增 **1 链 + 2 协议** 的轻量覆盖，滚动 3 个月完成基础面。

---

## 🧱 留存与质量：把活跃做“厚”
- **Active Days 曲线**：避免“一天暴击”，要 **跨周/跨月** 可见；  
- **LP/借贷天数**：累计持有/存借天数＞纯刷 Tx；  
- **多样化交互**：同一周内包含 **Swap+Stake+治理** 等 2–3 类动作；  
- **金额轨迹**：金额 **合理波动**，避免“完全重复金额/同秒多笔”的刷子特征；  
- **地址画像**：绑定基本身份（ENS/昵称/社交），保持“人类化”。

---

## 🛡️ 成本控制与安全 SOP
- **成本**：低费链与低费时段；所内换币优先，减少跨链；一次批量完成多动作；  
- **授权**：**最小授权**、按月 **Revoke**；  
- **桥接**：仅走 **官方或头部桥**，在途金额设 **时间阈值告警**；  
- **黑名单**：可疑合约/钓鱼站点直接拉黑；  
- **停机阈值**：当 **Unit ROI 连续<阈值** 或 **失败率/Gas/风险信号>阈值** → 暂停。

---

## ⚙️ 自动化与看板字段
**自动化（n8n/脚本建议）**  
- 抓取 **地址→Tx**、Gas、合约分类、协议标签 → 生成 **周任务表**；  
- 阈值告警：失败率>阈值、在途>时限、授权>阈值、Gas>阈值；  
- 定期快照 **Active Days/LP Days/治理次数/独立链与协议数**。

**看板字段（建议）**  
- address / chain / protocol / action / tx_hash / block_time  
- gas_spent / fee_token / status / proof_url / screenshot_url  
- active_day_flag / lp_days / borrow_days / votes_count  
- uniq_chains / uniq_protocols / week_active_days / month_active_days  
- unit_cost / unit_roi / alerts / notes

---

## ❓FAQ
**Q1：到底是“多次小额”好还是“单次大额”好？**  
> 对活跃度而言 **小额多次** 更有效；但也要有 **合理金额轨迹**，避免刷子特征。  
**Q2：必须跨很多链吗？**  
> 不必“全收集”。优先 **活跃生态+低费** 的 3–5 条链，滚动扩展。  
**Q3：LP 一定要长期吗？**  
> 不。**7–14 天** 的可验证持有即可形成质量信号，同时降低 IL 风险。

---

## ✅ 一页执行清单
- [ ] 建立 **周任务表**：Swap/Bridge/Stake/LP/借贷/治理/社交  
- [ ] 选 **3–5 条低费链** 与 **5 大类头部协议** 做轻量覆盖  
- [ ] 执行 **小额多次**，跨周跨月分布，保存 Tx/截图/时间  
- [ ] 成本与安全：所内换币、最小授权、官方桥、在途告警  
- [ ] 看板与告警上线：Active Days/uniq_chains/uniq_protocols/LP Days/失败率/Unit ROI
`,

  // ===== 与前端适配的步骤结构（5步） =====
  steps: [
    { step_number: 1, title: '盘点与目标', description: '选择 3–5 条低费链与 5 大类头部协议；设周任务与月目标。', estimated_time: '30–60 分钟' },
    { step_number: 2, title: '小额多次执行', description: '按周批量完成 Swap/Stake/LP/借贷/治理等动作，跨不同日/时段。', estimated_time: '60–120 分钟/周' },
    { step_number: 3, title: '证据链与留存', description: '保存 Tx/截图/时间到库；维持 LP/借贷 7–14 天留存。', estimated_time: '30–60 分钟/周' },
    { step_number: 4, title: '成本与安全', description: '所内换币优先、低费时段；最小授权+定期 Revoke；桥接在途告警。', estimated_time: '15–30 分钟/周' },
    { step_number: 5, title: '看板与告警', description: '落地看板与阈值告警；按周复盘 Active Days/uniq 指标与 Unit ROI。', estimated_time: '30–60 分钟/周' },
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

    console.log('\n✅ 链上活跃度 指南创建成功!');
    console.log(`   ID: ${response.data.data.id}`);
    console.log(`   Slug: ${response.data.data.slug}`);
    console.log(`   访问: http://localhost:3000/strategies/${response.data.data.slug}\n`);
  } catch (error) {
    console.error('\n❌ 创建失败:', error.response?.data || error.message);
  }
}

addGuide();
