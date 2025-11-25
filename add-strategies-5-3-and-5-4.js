const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

// ===== 5.3 Premint 平台批量注册 =====
const STRATEGY_5_3 = {
  title: 'Premint 平台批量注册 - 白名单抽奖自动化',
  slug: 'premint-batch-registration',
  summary: '在 Premint.xyz 平台批量注册参与多个 NFT 项目的白名单抽签,通过自动化工具提高中签概率,每天 10 分钟参与数十个项目。',

  category: 'whitelist',
  category_l1: 'airdrop',
  category_l2: '白名单/预售',

  difficulty_level: 1,
  risk_level: 2,

  apy_min: 0,
  apy_max: 0,
  threshold_capital: '0 美元（零成本注册）',
  threshold_capital_min: 0,
  time_commitment: '每天 10-15 分钟',
  time_commitment_minutes: 90,
  threshold_tech_level: 'beginner',

  content: `Premint.xyz 是最大的 NFT 白名单聚合平台,每天 10 分钟批量注册多个项目,提高白名单中签概率。平均中签率 5-10%,月度可获得 5-15 个白名单。`,

  steps: [
    { step_number: 1, title: '设置账号', description: '连接钱包和社交账号。', estimated_time: '15 分钟' },
    { step_number: 2, title: '每日注册', description: '每天注册 5-10 个项目。', estimated_time: '10 分钟/天' },
    { step_number: 3, title: '追踪优化', description: '记录中签,分析优化。', estimated_time: '30 分钟/周' },
  ],
};

// ===== 5.4 Collab.Land 验证任务 =====
const STRATEGY_5_4 = {
  title: 'Collab.Land 验证任务 - 代币门槛白名单',
  slug: 'collabland-verification-tasks',
  summary: '使用 Collab.Land 完成钱包验证、代币持有验证,获取项目 Discord 白名单角色,通过持有特定 NFT 或代币解锁社区特权和空投资格。',

  category: 'whitelist',
  category_l1: 'airdrop',
  category_l2: '白名单/预售',

  difficulty_level: 2,
  risk_level: 2,

  apy_min: 0,
  apy_max: 0,
  threshold_capital: '100-1000 美元（代币/NFT持有）',
  threshold_capital_min: 100,
  time_commitment: '每个项目 10-20 分钟',
  time_commitment_minutes: 90,
  threshold_tech_level: 'beginner',

  content: `通过持有蓝筹 NFT 或治理代币,使用 Collab.Land 验证解锁多个项目的白名单和专属频道。持有 1 个蓝筹 NFT 可解锁 5-10 个白名单,总价值 $500-$5,000。`,

  steps: [
    { step_number: 1, title: '研究持有策略', description: '分析哪些资产能解锁最多白名单。', estimated_time: '1 小时' },
    { step_number: 2, title: '购买资产', description: '买入 NFT 或代币。', estimated_time: '30 分钟' },
    { step_number: 3, title: '连接验证', description: '使用 Collab.Land 验证获得角色。', estimated_time: '10 分钟/项目' },
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
    const strategies = [STRATEGY_5_3, STRATEGY_5_4];

    console.log('\n开始创建 5.3 和 5.4 策略...\n');

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
    console.log('访问: http://localhost:3000/strategies?category=whitelist\n');
  } catch (error) {
    console.error('\n❌ 创建失败:', error.response?.data || error.message);
  }
}

addStrategies();