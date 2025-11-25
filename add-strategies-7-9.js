const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

// ===== 7.9 Euler Finance 长尾资产借贷 =====
const STRATEGY_7_9 = {
  title: 'Euler Finance 长尾资产借贷 - 高风险高收益策略',
  slug: 'euler-longtail-lending',
  summary: '在 Euler Finance 借贷长尾资产(小币种),参与创新风险评级系统,赚取高风险高收益,适合风险偏好高的玩家,年化可达 20-50%。',

  category: 'lending',
  category_l1: 'yield',
  category_l2: '借贷挖息',

  difficulty_level: 4,
  risk_level: 4,

  apy_min: 20,
  apy_max: 50,
  threshold_capital: '1000 美元起',
  threshold_capital_min: 1000,
  time_commitment: '初始设置 1.5 小时,频繁监控',
  time_commitment_minutes: 120,
  threshold_tech_level: 'advanced',

  content: `Euler Finance 支持数百种长尾资产借贷,通过风险分层(Isolation/Cross/Collateral)提供 20-50% 高 APY。警告:2023年3月被黑客攻击损失 $197M(后已归还)。仅适合高风险偏好玩家,建议只投入 5-10% 资产。小币种流动性风险大,需每天监控,快速止损。高收益背后是高风险!`,

  steps: [
    { step_number: 1, title: '理解风险', description: '充分了解 Euler 的风险,包括黑客历史。', estimated_time: '30 分钟' },
    { step_number: 2, title: '选择资产', description: '研究并筛选合适的长尾资产。', estimated_time: '1 小时' },
    { step_number: 3, title: '小额测试', description: '先用 $500-$1,000 测试,熟悉流程。', estimated_time: '30 分钟' },
    { step_number: 4, title: '设置监控', description: '设置价格提醒和每日检查习惯。', estimated_time: '15 分钟' },
    { step_number: 5, title: '动态调整', description: '根据市场变化,快速调整仓位或撤出。', estimated_time: '每天 20 分钟' },
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
    const strategies = [STRATEGY_7_9];

    console.log('\n开始创建 7.9 策略...\n');

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

      console.log(`✅ [${i + 1}/1] ${strategy.title}`);
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