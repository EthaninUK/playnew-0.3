// add-monad-staking-launchpad.js

const axios = require('axios');

// 修改成你自己的 Directus 地址
const DIRECTUS_URL = 'http://localhost:8055';

const GUIDE_CONFIG = {
  title: 'Monad 质押参与：用本金换潜在配售与空投资格',
  slug: 'monad-staking-launchpad',

  summary:
    '在指定平台质押平台币或稳定币，锁仓一段时间，换取 Monad 相关配售额度、空投资格与平台长期权益。本玩法解析本金风险、锁仓规则、收益来源，并给出三步上手流程与防踩坑清单。',

  // 分类按你的体系来，如果有别的命名可以自行调整
  category: 'airdrop-early',
  category_l1: 'airdrop',
  category_l2: '启动板&配售',

  difficulty_level: 3,
  risk_level: 3,

  // 这类玩法 APY 不好写，先用 0–0，收益在正文里用文字说明
  apy_min: 0,
  apy_max: 0,

  threshold_capital: '2,000–20,000 USD（建议不超过总资产的 10–30%）',
  threshold_capital_min: 2000,

  time_commitment:
    '前期研究规则 30–60 分钟，操作质押/解锁每次 10–20 分钟，锁仓期按官方安排',
  time_commitment_minutes: 20,

  threshold_tech_level: 'intermediate',

  content: `
> **适用人群**：已经有一定币圈经验、手上有可承受波动的本金，希望更深度参与 Monad 叙事，而不仅仅做测试网任务的玩家。  
> **阅读时间**：约 15–20 分钟  
> **关键词**：Monad / Launchpad / 质押 / 锁仓 / 配售额度 / 平台币风险

---

## 1. 这是什么玩法？

这是一个典型的「质押 / 启动板」玩法：

- 在指定平台质押平台币、稳定币或主流币；
- 满足一定的锁仓金额和时间要求；
- 以此换取 Monad 相关的配售额度、空投或等级加成。

本质上，你是在用本金和锁仓时间，换未来「更便宜买入、更多额度、更多权益」的机会，而不是纯白拿空投。

---

## 2. 收益和风险从哪里来？

**可能的收益来源：**

- 质押利息或平台额外奖励（通常是平台币或积分）；
- Monad 相关项目上线后的涨幅收益；
- 额外空投、手续费折扣、平台等级提升等长期权益。

**主要风险：**

- 质押资产价格下跌，利息远不足以覆盖亏损；
- 活动有锁仓期，期间无法随时赎回，遇到黑天鹅只能被动挨打；
- 平台或合约安全问题、规则临时修改，导致实际收益和预期差距很大。

简单记一条：这类玩法的核心风险是「币价 + 锁仓 + 平台」，不是「操作失误」。

---

## 3. 上手前先自测三件事

1. **资金**：你是否有 2,000–20,000 U 等值的闲钱，并且愿意拿出其中 10–30% 放在单一平台？  
2. **心态**：能不能接受锁仓期间账面浮亏 30–50% 而不情绪崩溃？  
3. **时间**：愿不愿意花半小时认真读完规则，再花几分钟记下关键时间点（申购、上市、解锁）？

如果以上有两条答案是否定的，这类玩法就不适合你。

---

## 4. 三步上手流程（以 CEX Launchpad 为例）

**Step 1：准备资金和账号**

- 在目标交易所完成注册与 KYC，打开两步验证和提币白名单；
- 充值或买入需要质押的资产，例如平台币 + USDT；
- 确认资金处于「可用状态」，没有被其他理财或质押占用。

**Step 2：在 Launchpad 活动页完成质押 / 锁仓**

- 只从交易所首页的官方入口进入 Monad Launchpad 活动页；
- 仔细阅读：锁仓期限、最低参与金额、收益发放形式、配售规则（持仓快照、平均持仓还是锁仓份额）；
- 输入计划质押的金额（建议不要一次梭哈），确认质押成功，并在「我的质押」里看到记录和倒计时。

**Step 3：申购、上市与解锁**

- 按时间线依次完成：申购认购、查看中签额度、领取新币；
- 上市后根据市场情况决定：立即卖出、分批卖出或长期持有；
- 锁仓期结束后，记得手动解锁并赎回质押资产，检查资产是否全部回到账户。

---

## 5. 一眼看懂：收益 / 风险小表

- 收益偏向「中高波动」：利息较稳定，配售收益高度不确定；
- 盈亏结果对 Monad 本身热度和整体市场行情非常敏感；
- 单次活动的真实结果，可能从大赚几十个百分点，到小赚或持平，甚至亏损。

如果你更看重本金稳定，而不是博一把大幅收益，这类玩法就不一定适合。

---

## 6. 常见踩坑点

- 只看到宣传中的「最高年化」和个别成功案例，没有看到币价腰斩的情况；
- 完全忽略锁仓时间，临时要用钱时才发现资产被锁住；
- 没有设置最大投入额度，一上头就把大部分仓位买成平台币；
- 参与的是仿冒网站或假活动页，结果资金直接进了骗子口袋。

---

## 7. 适合谁 / 不适合谁

**更适合：**

- 本来就长期持有某平台币或主流币，对短期波动不太敏感；
- 已经玩过几次 Launchpad 或 Staking，对规则和流程有基本了解；
- 愿意用部分本金换取更深度参与 Monad 叙事的机会。

**不适合：**

- 手上资金都是生活必须支出（房贷、学费、看病钱）；
- 抗压能力很弱，一看到浮亏就想立刻砸盘离场；
- 不愿意花时间看规则，只想「听人喊单就梭哈」。

---

## 8. 总结：一句话给决策

如果你本来就想长期持有相关资产，又看好 Monad 这条高性能公链的中长期机会，那么适度参与这类质押 / 配售活动，可以当成「顺手多拿一张期权」。

如果你资金紧张、抗压性弱，或者完全不想承受锁仓风险，那就把 Monad 当成普通现货机会等上市再说，也没有任何问题。
`,

  steps: [
    {
      step_number: 1,
      title: '准备资金和账号',
      description:
        '在目标交易所注册并完成 KYC，开启两步验证与安全设置；根据活动要求买入或充值需要质押的资产（如平台币、USDT 等），确保资产在可用账户中，未被其他理财或质押占用。',
      estimated_time: '20–40 分钟',
    },
    {
      step_number: 2,
      title: '在 Launchpad 活动页完成质押 / 锁仓',
      description:
        '从交易所首页的官方入口进入 Monad Launchpad 活动页，阅读清楚锁仓期限、收益形式和配售规则后，输入计划质押金额并确认操作，在“我的质押”或“活动记录”里确认看到质押数量与倒计时。',
      estimated_time: '10–30 分钟',
    },
    {
      step_number: 3,
      title: '申购、上市与解锁',
      description:
        '按活动时间线完成申购和领取新币；新币上市后根据自己的策略选择卖出或持有；锁仓期结束后记得手动解锁并赎回质押资产，确认所有资产已经回到账户。',
      estimated_time: '10–30 分钟',
    },
  ],
};

async function getAuthToken() {
  // 这里换成你自己的 Directus 账号
  const response = await axios.post(`${DIRECTUS_URL}/auth/login`, {
    email: 'YOUR_DIRECTUS_EMAIL',
    password: 'YOUR_DIRECTUS_PASSWORD',
  });

  return response.data.data.access_token;
}

async function addGuide() {
  try {
    const token = await getAuthToken();

    const strategy = {
      ...GUIDE_CONFIG,
      status: 'published',
      is_featured: false,
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

    console.log('\n✅ Monad 质押参与策略创建成功!');
    console.log(`   ID: ${response.data.data.id}`);
    console.log(`   Slug: ${response.data.data.slug}`);
    console.log(
      `   访问: http://localhost:3000/strategies/${response.data.data.slug}\n`,
    );
  } catch (error) {
    console.error('\n❌ 创建失败:', error.response?.data || error.message);
  }
}

addGuide();
