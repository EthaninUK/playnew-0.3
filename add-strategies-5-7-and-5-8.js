const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

// ===== 5.7 Allowlist 智能合约检测 =====
const STRATEGY_5_7 = {
  title: 'Allowlist 智能合约检测 - 链上白名单查询',
  slug: 'allowlist-contract-detection',
  summary: '使用 Etherscan 等工具检测自己的钱包地址是否在项目方的 Allowlist 智能合约中,确认白名单资格,提前准备铸造策略。',

  category: 'whitelist',
  category_l1: 'airdrop',
  category_l2: '白名单/预售',

  difficulty_level: 3,
  risk_level: 1,

  apy_min: 0,
  apy_max: 0,
  threshold_capital: '0 美元（工具使用）',
  threshold_capital_min: 0,
  time_commitment: '每个项目 15-30 分钟',
  time_commitment_minutes: 30,
  threshold_tech_level: 'intermediate',

  content: `学习读取智能合约的 Allowlist 数组,使用 Etherscan 的 Read Contract 功能查询白名单状态。掌握 Merkle Tree 验证方法,提前确认铸造资格。`,

  steps: [
    { step_number: 1, title: '获取合约地址', description: '从项目官网获得 NFT 合约地址。', estimated_time: '5 分钟' },
    { step_number: 2, title: '访问 Etherscan', description: '在 Etherscan 打开合约页面。', estimated_time: '2 分钟' },
    { step_number: 3, title: '读取白名单', description: '使用 Read Contract 查询白名单函数。', estimated_time: '10 分钟' },
    { step_number: 4, title: '验证资格', description: '确认钱包地址是否在白名单中。', estimated_time: '5 分钟' },
  ],
};

// ===== 5.8 Discord Raid 互助白名单 =====
const STRATEGY_5_8 = {
  title: 'Discord Raid 互助白名单 - 社群协作获取 WL',
  slug: 'discord-raid-mutual-whitelist',
  summary: '加入白名单互助社群,通过互相邀请、任务帮助、Discord Raid 等方式,批量获得多个项目白名单,提高整体中签效率。',

  category: 'whitelist',
  category_l1: 'airdrop',
  category_l2: '白名单/预售',

  difficulty_level: 2,
  risk_level: 2,

  apy_min: 0,
  apy_max: 0,
  threshold_capital: '0 美元（纯协作）',
  threshold_capital_min: 0,
  time_commitment: '每周 3-5 小时',
  time_commitment_minutes: 240,
  threshold_tech_level: 'beginner',

  content: `加入 Telegram/Discord 白名单互助群,与其他玩家互相完成邀请任务、Discord Raid、社交任务等,通过团队协作批量获取白名单,单月可获 10-30 个 WL。`,

  steps: [
    { step_number: 1, title: '加入互助群', description: '找到并加入 NFT 白名单互助社群。', estimated_time: '30 分钟' },
    { step_number: 2, title: '发布互助需求', description: '发布需要帮助的项目任务。', estimated_time: '10 分钟' },
    { step_number: 3, title: '帮助他人', description: '完成其他成员的邀请/点赞任务。', estimated_time: '每天 20 分钟' },
    { step_number: 4, title: '组织 Raid', description: '组织或参与 Discord Raid 活动。', estimated_time: '每周 1 小时' },
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
    const strategies = [STRATEGY_5_7, STRATEGY_5_8];

    console.log('\n开始创建 5.7 和 5.8 策略...\n');

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