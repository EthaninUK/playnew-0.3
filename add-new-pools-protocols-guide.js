const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

/**
 * 建议：生产环境用环境变量
 * const DIRECTUS_EMAIL = process.env.DIRECTUS_EMAIL
 * const DIRECTUS_PASSWORD = process.env.DIRECTUS_PASSWORD
 */

const GUIDE_CONFIG = {
  // ===== 基本信息 =====
  title: '新池 & 新协议（New Pools & New Protocols）完全指南',
  slug: 'new-pools-and-protocols-complete-guide',
  summary:
    '围绕“发现—评估—参与—退出”的闭环，系统梳理新池/新协议的机会类型（LP做市、激励挖矿、积分/空投、治理与Bribe）、尽调清单（安全/经济/运营）、风控SOP与指标看板。',

  // 在 Directus 中替换为真实分类 ID
  category: 'a6716f22-e45b-4222-989a-09f33fc2d4c5',

  // 站内一级/二级分类
  category_l1: 'airdrop',
  category_l2: '新池&新协议',

  // ===== 元数据 =====
  difficulty_level: 3,                 // 1-5
  risk_level: 4,                       // 合约/IL/经济模型/运营风险
  apy_min: 0,
  apy_max: 0,

  // 资金/时间/技术门槛
  threshold_capital: '100-50,000 USD（小仓试错—按周滚动）',
  threshold_capital_min: 100,
  time_commitment: '每周 1–3 小时（批量任务+巡检+复盘）',
  time_commitment_minutes: 120,
  threshold_tech_level: 'beginner',

  // ===== 可读性强的 Markdown 正文 =====
  content: `> **适用人群**：想系统参与“新上线流动性池/新协议启动期”的个人或团队  
> **阅读时间**：≈ 12–18 分钟  
> **关键词**：Liquidity Mining / Gauge / Bribe / Emissions / TVL / IL / Admin Key / Multisig / Timelock / Oracle / Points

---

## 🧭 TL;DR
- **机会类型**：新池/新协议常伴随 **LP做市奖励、双/三挖、积分→空投、Gauge投票与Bribe**。  
- **核心框架**：**发现 → 尽调 → 小仓参与 → 阈值化风控 → 退出与复盘**。  
- **硬性纪律**：只用 **白名单协议与官方合约**；**最小授权+定期Revoke**；**小仓分批**；**达阈值即动作（停机/降档/退出）**。

---

## 🗂 目录
1. [机会地图：新池/新协议常见玩法](#机会地图新池新协议常见玩法)
2. [尽调清单：安全/经济/运营三大块](#尽调清单安全经济运营三大块)
3. [收益与成本：真实APR的拆解](#收益与成本真实apr的拆解)
4. [三步极速上手](#三步极速上手)
5. [进阶：Gauge/Bribe与积分联动](#进阶gaugebribe与积分联动)
6. [风险矩阵与规避清单](#风险矩阵与规避清单)
7. [指标看板与记录模板](#指标看板与记录模板)
8. [FAQ](#faq)
9. [一页执行清单](#一页执行清单)

---

## 🗺️ 机会地图：新池/新协议常见玩法
| 类型 | 动作 | 收益来源 | 要点 |
|---|---|---|---|
| **LP做市** | 提供双/三资产LP | 交易手续费 + 激励Token | 关注 **深度/费档/IL** 与撤池路线 |
| **激励挖矿** | 质押LP或单币 | Emissions + 复投 | 真实APR需扣 **解锁/税/滑点** |
| **积分/空投** | 交互/LP/任务 | 积分→空投 | 记录证据（Tx、截图、时间） |
| **治理/Gauge/Bribe** | 投票/锁仓 | 票权激励/贿票 | 锁仓周期与年化折现 |
| **集成/金库** | 聚合器代做 | 手续费分成 | 选择白名单金库与停机阈值 |

---

## 🔍 尽调清单：安全/经济/运营三大块
**安全（Contract/Sec）**  
- 合约地址与 **官方域名/仓库/多签** 一致；  
- **审计/形式化验证/漏洞赏金**；是否有 **Timelock** 与 **多签门槛**；  
- **Oracle 依赖**（TWAP/预言机）与故障预案；  
- **权限**：Upgradable？Owner/Guardian 能做什么？

**经济（Token/Emissions）**  
- **代币分配**、解锁/释放曲线、**激励来源与持续期**；  
- **Gauge/Bribe** 比例、投票周期；  
- **真实APR**=手工/脚本扣除 **费率/滑点/锁仓折扣/再质押税** 后的净值。

**运营（Ops/Runbook）**  
- 团队背景、路线图、资金储备；  
- 沟通渠道与 **事故响应** 质量；  
- **撤池/退出路径**、跨链桥与官方支持度；  
- Metrics：**TVL/活跃地址/成交额/返利到账率**。

---

## 💸 收益与成本：真实APR的拆解
\`Net APR = Fees + Incentives + BribeRebate + Points(估算) − IL − Gas/Bridge − Stake/Unstake Cost − Tax/Unlock − Slippage\`  
- **IL**：相关性/波动越大，IL风险越高；  
- **费用链条**：进/出池、质押/解押、奖励领取与复投、跨链/桥接、授权与撤销；  
- **时间价值**：锁仓周期与线性解锁折现。

---

## 🚀 三步极速上手
### 第 1 步：候选与尽调
- 建 **候选清单**：协议/池子/链、激励类型、起止时间、官方链接；  
- 用上面的 **三块尽调** 打分，筛选 **白名单+高通过率** 的目标。

### 第 2 步：小仓参与与阈值
- **小仓分批** 入场；设置 **停机阈值**：净APR<阈值、失败率>阈值、Gas>阈值、深度<阈值、合约风险预警=真 → 降档或退出；  
- 记录 **证据链**（Tx/截图/领取记录）。

### 第 3 步：复投/退出与复盘
- 按周复投或提取；当 **激励衰减/TVL集中/风险提示** 出现时 **退出**；  
- 复盘 **真实净收益、IL、在途金额**，更新候选库。

---

## ♻️ 进阶：Gauge/Bribe与积分联动
- **Gauge投票**：锁仓换票权，提高目标池权重 → 更高 Emissions；  
- **Bribe**：用贿票市场提升周期性收益，注意 **成本与回收期**；  
- **积分联动**：部分协议/生态会将 **LP/治理行为** 计入积分 → 影响未来空投分配。

---

## 🛡️ 风险矩阵与规避清单
**风险矩阵**
| 风险 | 可能性 | 影响 | 说明 |
|---|---|---|---|
| 合约/权限漏洞 | 低-中 | 高 | Owner/Upgradable 风险、预言机操纵 |
| 经济模型失衡 | 中 | 中-高 | Emissions 砸盘、TVL撤离 |
| 流动性枯竭/撤池困难 | 低-中 | 中-高 | 退出滑点大、跨链不畅 |
| IL 与价格冲击 | 中 | 中 | 高波动对造成实亏 |
| 运营与合规 | 低-中 | 高 | 团队失联、地区限制 |

**规避清单**
- **白名单协议+官方合约**；**最小授权** 与 **定期 Revoke**；  
- **小仓分批** 与 **阈值停机**；  
- 关注 **TVL/深度/返利到账率**；  
- 预留 **撤池路线** 与 **所内对冲**。

---

## 📊 指标看板与记录模板
- **真实净APR**（分解：Fees、Emissions、BribeRebate、Points）  
- **TVL/深度/成交额** 与 **集中度**  
- **IL估算** 与 **撤池滑点**  
- **失败率/Gas/在途金额**  
- **安全信号**：合约权限、Timelock/多签、审计/赏金状态

---

## ❓FAQ
**Q1：APY 很高但是否可信？**  
> 看 **来源与可持续性**：如果全靠 Emissions 且释放速度快，要谨慎；计算 **真实净APR**。  
**Q2：IL 怎么控？**  
> 选 **稳定币池/相关性高的池**；或用 **窄区间/对冲** 降低波动。  
**Q3：什么时候退出？**  
> 当 **净APR 连续低于阈值**、**风险信号触发** 或 **激励衰减**，按预案分批撤出。

---

## ✅ 一页执行清单
- [ ] 候选清单+三块尽调（安全/经济/运营）  
- [ ] 小仓入场；设 **净APR/Gas/失败率/深度/风险** 阈值  
- [ ] 定期复投/提取；出现 **衰减/风险** 时分批撤池  
- [ ] 看板追踪：真实净APR、TVL/深度、IL、在途、权限/审计  
- [ ] 周度复盘：更新白名单与黑名单、优化 SOP
`,

  // ===== 与前端适配的步骤结构（5步） =====
  steps: [
    { step_number: 1, title: '候选与打分', description: '建立候选库并按安全/经济/运营三块尽调打分，选白名单目标。', estimated_time: '30–60 分钟' },
    { step_number: 2, title: '小仓分批', description: '小仓多次入场，记录Tx与领取记录；仅走官方合约与白名单金库。', estimated_time: '30–60 分钟' },
    { step_number: 3, title: '阈值化风控', description: '净APR/失败率/Gas/深度/风险信号触发即降档或退出。', estimated_time: '10–20 分钟/次' },
    { step_number: 4, title: '复投与退出', description: '按周复投或提取；激励衰减或风险提示时分批撤池。', estimated_time: '30–60 分钟/周' },
    { step_number: 5, title: '复盘与看板', description: '统计真实净APR、IL、在途与TVL；更新白名单/黑名单与SOP。', estimated_time: '30–60 分钟/周' },
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

    console.log('\n✅ 新池 & 新协议 指南创建成功!');
    console.log(`   ID: ${response.data.data.id}`);
    console.log(`   Slug: ${response.data.data.slug}`);
    console.log(`   访问: http://localhost:3000/strategies/${response.data.data.slug}\n`);
  } catch (error) {
    console.error('\n❌ 创建失败:', error.response?.data || error.message);
  }
}

addGuide();
