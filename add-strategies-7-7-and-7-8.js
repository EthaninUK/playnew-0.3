const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

// ===== 7.7 Spark Protocol DAI 借贷 =====
const STRATEGY_7_7 = {
  title: 'Spark Protocol DAI 借贷 - MakerDAO 低息借贷',
  slug: 'spark-protocol-dai-lending',
  summary: '使用 MakerDAO 推出的 Spark Protocol,以极低利率(1-2%)借入 DAI,提高资金效率,适合需要稳定币流动性的长期持有者,成本远低于其他协议。',

  category: 'lending',
  category_l1: 'yield',
  category_l2: '借贷挖息',

  difficulty_level: 2,
  risk_level: 2,

  apy_min: 0,
  apy_max: 5,
  threshold_capital: '5000 美元起',
  threshold_capital_min: 5000,
  time_commitment: '初始设置 1 小时,长期持有',
  time_commitment_minutes: 60,
  threshold_tech_level: 'intermediate',

  content: `Spark Protocol 是 MakerDAO 推出的借贷协议,借款利率仅 1-2%,远低于市场平均 4%。适合 ETH 长期持有者低成本借入 DAI。可用于稳定币套利(借 DAI 1.5% → 存入 RWA 5% = 净赚 3.5%)或杠杆 ETH 多头。保守借款(LTV < 50%)可长期持有无忧。`,

  steps: [
    { step_number: 1, title: '连接 Spark', description: '访问 app.spark.fi,连接钱包。', estimated_time: '5 分钟' },
    { step_number: 2, title: '存入抵押品', description: '存入 ETH 或 stETH 作为抵押。', estimated_time: '10 分钟' },
    { step_number: 3, title: '借出 DAI', description: '以 1-2% 低利率借出 DAI。', estimated_time: '10 分钟' },
    { step_number: 4, title: '使用 DAI', description: '用于生活、投资或套利。', estimated_time: '不定' },
    { step_number: 5, title: '长期管理', description: '保持健康度 > 1.8,必要时还款。', estimated_time: '每月 10 分钟' },
  ],
};

// ===== 7.8 Morpho Optimizer 借贷优化 =====
const STRATEGY_7_8 = {
  title: 'Morpho Optimizer 借贷优化 - P2P 利率提升',
  slug: 'morpho-optimizer-lending',
  summary: '通过 Morpho 协议优化 Aave/Compound 的借贷利率,实现点对点匹配提升收益,存款利率提高 10-30%,借款利率降低 10-20%,无需改变习惯。',

  category: 'lending',
  category_l1: 'yield',
  category_l2: '借贷挖息',

  difficulty_level: 3,
  risk_level: 2,

  apy_min: 5,
  apy_max: 15,
  threshold_capital: '2000 美元起',
  threshold_capital_min: 2000,
  time_commitment: '初始设置 30 分钟,自动运行',
  time_commitment_minutes: 30,
  threshold_tech_level: 'intermediate',

  content: `Morpho 通过 P2P 匹配优化借贷利率。Aave 存款 3% → Morpho-Aave 存款 3.9%(提升 30%),操作完全相同。原理:直接匹配存款人和借款人,消除协议利差。已审计,TVL > $5 亿,运行 2 年无事故。适合已使用 Aave/Compound 的用户,立即切换提升收益。`,

  steps: [
    { step_number: 1, title: '访问 Morpho', description: '访问 app.morpho.org,连接钱包。', estimated_time: '5 分钟' },
    { step_number: 2, title: '选择底层协议', description: '选择 Morpho-Aave 或 Morpho-Compound。', estimated_time: '2 分钟' },
    { step_number: 3, title: '存款或借款', description: '操作与 Aave 完全相同,但收益更高。', estimated_time: '15 分钟' },
    { step_number: 4, title: '监控匹配率', description: '查看 Dashboard 了解 P2P 匹配情况。', estimated_time: '每周 5 分钟' },
    { step_number: 5, title: '享受额外收益', description: '自动运行,无需操作。', estimated_time: '持续' },
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
    const strategies = [STRATEGY_7_7, STRATEGY_7_8];

    console.log('\n开始创建 7.7 和 7.8 策略...\n');

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
    console.log('访问: http://localhost:3000/strategies?category=lending\n');
  } catch (error) {
    console.error('\n❌ 创建失败:', error.response?.data || error.message);
  }
}

addStrategies();