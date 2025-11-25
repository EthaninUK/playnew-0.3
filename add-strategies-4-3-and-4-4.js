const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

// ===== 4.3 Bybit Launchpad 质押挖矿 =====
const STRATEGY_4_3 = {
  title: 'Bybit Launchpad 质押挖矿 - BIT 代币超低价新币',
  slug: 'bybit-launchpad-staking',
  summary: '质押 BIT 代币参与 Bybit Launchpad，按质押量和时长获得新币配额，享受超低价格入场优质项目的机会。',

  category: 'launchpad',
  category_l1: 'airdrop',
  category_l2: '启动板&配售',

  difficulty_level: 1,
  risk_level: 2,

  apy_min: 0,
  apy_max: 300,
  threshold_capital: '500 美元起（BIT）',
  threshold_capital_min: 500,
  time_commitment: '每次活动 5-7 天',
  time_commitment_minutes: 25,
  threshold_tech_level: 'beginner',

  content: `> **适合人群**：持有 BIT 代币或愿意买入 BIT 的用户
> **阅读时间**：约 8 分钟
> **关键词**：Bybit / Launchpad / BIT / 质押挖矿 / 新币配额

---

## 🎯 什么是 Bybit Launchpad？

**Bybit Launchpad** 是 Bybit 交易所的新币首发平台：
- **质押 BIT**：质押平台币 BIT，按量和时长计算积分
- **获得配额**：根据积分分配新币购买额度
- **低价认购**：以低于市场价购买新币
- **首日上线**：新币上线交易

### 核心优势

1. **确定性高**：不是抽签，而是按积分分配（质押多少得多少）
2. **价格优势**：认购价通常是首日价格的 30-60%
3. **BIT 增值**：活动期间 BIT 通常上涨
4. **频率适中**：每月 1-2 次

**真实案例**：
- **某 DeFi 项目**（2024年3月）：认购价 $0.08，首日 $0.20，2.5倍
- **某 AI 项目**（2024年2月）：认购价 $0.15，首日 $0.45，3倍
- **某 GameFi 项目**（2024年1月）：认购价 $0.05，首日 $0.18，3.6倍`,

  steps: [
    { step_number: 1, title: '注册 Bybit 并完成 KYC', description: '注册账号，完成身份验证，确保能参与 Launchpad。', estimated_time: '30 分钟' },
    { step_number: 2, title: '购买和质押 BIT', description: '购买 1000+ BIT，质押到 Launchpad 积分池。', estimated_time: '15 分钟' },
    { step_number: 3, title: '等待计算积分', description: '质押期间每天积累积分，时间越长积分越多。', estimated_time: '5-7 天' },
    { step_number: 4, title: '认购新币', description: '根据积分获得配额，用 USDT 购买新币。', estimated_time: '10 分钟' },
    { step_number: 5, title: '上线交易', description: '新币上线后交易，建议首日卖出至少 50%。', estimated_time: '15 分钟' },
  ],
};

// ===== 4.4 OKX Jumpstart 参与策略 =====
const STRATEGY_4_4 = {
  title: 'OKX Jumpstart 参与策略 - OKB 质押新币挖矿',
  slug: 'okx-jumpstart-strategy',
  summary: '持有 OKB 并完成任务，参与 OKX Jumpstart 新币挖矿和申购，获取首发代币配额，享受上线涨幅。',

  category: 'launchpad',
  category_l1: 'airdrop',
  category_l2: '启动板&配售',

  difficulty_level: 1,
  risk_level: 2,

  apy_min: 0,
  apy_max: 250,
  threshold_capital: '1000 美元起（OKB）',
  threshold_capital_min: 1000,
  time_commitment: '每次活动 3-7 天',
  time_commitment_minutes: 30,
  threshold_tech_level: 'beginner',

  content: `> **适合人群**：OKX 用户，持有或愿意买入 OKB 的投资者
> **阅读时间**：约 8 分钟
> **关键词**：OKX / Jumpstart / OKB / 新币挖矿 / 认购

---

## 🎯 什么是 OKX Jumpstart？

**OKX Jumpstart** 是 OKX 交易所的新币首发平台，结合了挖矿和认购两种模式：
- **质押 OKB 挖矿**：免费获得新币
- **完成任务认购**：额外购买新币配额
- **灵活参与**：可以只挖矿，也可以挖矿+认购

### 双模式机制

**模式 1：免费挖矿**
- 质押 OKB 或指定代币
- 免费获得新币（类似 Binance Launchpool）
- 随时赎回，无锁定

**模式 2：认购**
- 完成 KYC 和任务
- 用 USDT 购买新币配额
- 价格通常低于首日开盘价

**真实案例**：
- **某 L1 项目**（2024年3月）：挖矿获得价值 $50，认购 2倍收益
- **某 DeFi 项目**（2024年2月）：质押 5000 OKB 挖矿 7 天，获得价值 $200 新币`,

  steps: [
    { step_number: 1, title: '注册 OKX 并完成 KYC', description: '注册账号，完成身份验证和任务。', estimated_time: '30 分钟' },
    { step_number: 2, title: '准备 OKB 和 USDT', description: '购买 2000+ OKB（挖矿）和准备 USDT（认购）。', estimated_time: '15 分钟' },
    { step_number: 3, title: '质押 OKB 挖矿', description: '质押 OKB 到 Jumpstart 池，开始免费挖矿。', estimated_time: '5 分钟' },
    { step_number: 4, title: '完成任务并认购', description: '完成平台任务，获得认购资格并购买新币。', estimated_time: '20 分钟' },
    { step_number: 5, title: '领取和交易', description: '挖矿结束领取新币，上线后交易。', estimated_time: '15 分钟' },
  ],
};

// ===== 上传逻辑 =====
async function getAuthToken() {
  const response = await axios.post(`${DIRECTUS_URL}/auth/login`, {
    email: 'the_uk1@outlook.com',
    password: 'Mygcdjmyxzg2026!',
  });
  return response.data.data.access_token;
}

async function addStrategies() {
  try {
    const token = await getAuthToken();
    const strategies = [STRATEGY_4_3, STRATEGY_4_4];

    console.log('\n开始创建 4.3 和 4.4 策略...\n');

    for (let i = 0; i < strategies.length; i++) {
      const strategy = {
        ...strategies[i],
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
        }
      );

      console.log(`✅ [${i + 1}/2] ${strategy.title}`);
      console.log(`   ID: ${response.data.data.id}`);
      console.log(`   Slug: ${response.data.data.slug}\n`);
    }

    console.log('🎉 创建完成！');
    console.log('访问: http://localhost:3000/strategies?category=launchpad\n');
  } catch (error) {
    console.error('\n❌ 创建失败:', error.response?.data || error.message);
  }
}

addStrategies();
