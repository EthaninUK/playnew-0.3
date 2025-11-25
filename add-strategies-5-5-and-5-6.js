const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

// ===== 5.5 IDO 白名单 KYC =====
const STRATEGY_5_5 = {
  title: 'IDO 白名单 KYC - 代币预售资格认证',
  slug: 'ido-whitelist-kyc',
  summary: '完成项目方要求的 KYC 认证和代币持有量证明,获得 IDO(Initial DEX Offering)预售白名单资格,以种子轮价格提前买入新代币。',

  category: 'whitelist',
  category_l1: 'airdrop',
  category_l2: '白名单/预售',

  difficulty_level: 2,
  risk_level: 3,

  apy_min: 0,
  apy_max: 500,
  threshold_capital: '500-5000 美元',
  threshold_capital_min: 500,
  time_commitment: '每个项目 1-2 小时',
  time_commitment_minutes: 90,
  threshold_tech_level: 'intermediate',

  content: `通过完成 KYC 身份认证和平台代币质押,获得 IDO 白名单资格,以低于市场价 50-90% 的价格买入新代币。成功案例可实现 5-50 倍收益。`,

  steps: [
    { step_number: 1, title: '选择 IDO 平台', description: '注册 DAO Maker/Polkastarter 等平台。', estimated_time: '30 分钟' },
    { step_number: 2, title: '完成 KYC', description: '提交身份证明文件完成认证。', estimated_time: '30 分钟' },
    { step_number: 3, title: '质押平台币', description: '质押 DAO/POLS 等代币获得等级。', estimated_time: '15 分钟' },
    { step_number: 4, title: '参与 IDO', description: '在开放时间内申购新代币。', estimated_time: '30 分钟' },
  ],
};

// ===== 5.6 Private Sale 私募额度 =====
const STRATEGY_5_6 = {
  title: 'Private Sale 私募额度 - 种子轮投资机会',
  slug: 'private-sale-allocation',
  summary: '通过 OTC 渠道或 VC 关系,获取项目私募轮投资额度,以种子轮价格买入代币,享受最低价格和最长锁定期后的高倍数收益。',

  category: 'whitelist',
  category_l1: 'airdrop',
  category_l2: '白名单/预售',

  difficulty_level: 4,
  risk_level: 4,

  apy_min: 0,
  apy_max: 1000,
  threshold_capital: '10000-50000 美元',
  threshold_capital_min: 10000,
  time_commitment: '每个项目 3-5 小时',
  time_commitment_minutes: 240,
  threshold_tech_level: 'advanced',

  content: `通过建立 VC 网络或加入投资 DAO,获得项目种子轮/私募轮投资额度。私募价格通常是上市价的 10-50%,但需承受长期锁定(6-24 个月)和项目失败风险。`,

  steps: [
    { step_number: 1, title: '建立 VC 网络', description: '加入投资 DAO 或建立 VC 联系。', estimated_time: '持续' },
    { step_number: 2, title: '项目尽调', description: '深度研究项目白皮书、团队、代币经济学。', estimated_time: '3-5 小时' },
    { step_number: 3, title: '签署协议', description: '签署 SAFT 协议,转账 USDT/USDC。', estimated_time: '1 小时' },
    { step_number: 4, title: '等待解锁', description: '等待 TGE 和 vesting 解锁期。', estimated_time: '6-24 个月' },
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
    const strategies = [STRATEGY_5_5, STRATEGY_5_6];

    console.log('\n开始创建 5.5 和 5.6 策略...\n');

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