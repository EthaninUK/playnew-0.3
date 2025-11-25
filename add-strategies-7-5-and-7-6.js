const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

// ===== 7.5 Benqi Avalanche 借贷 =====
const STRATEGY_7_5 = {
  title: 'Benqi Avalanche 借贷 - 雪崩链双币挖矿',
  slug: 'benqi-avalanche-lending',
  summary: '在 Avalanche 链上的 Benqi 协议进行借贷挖矿,赚取 QI 和 AVAX 双重奖励,利用 Avalanche 的高速低费特性,实现 15-30% 年化收益。',

  category: 'lending',
  category_l1: 'yield',
  category_l2: '借贷挖息',

  difficulty_level: 2,
  risk_level: 3,

  apy_min: 15,
  apy_max: 30,
  threshold_capital: '500 美元起',
  threshold_capital_min: 500,
  time_commitment: '初始设置 1 小时,每周维护 20 分钟',
  time_commitment_minutes: 80,
  threshold_tech_level: 'beginner',

  content: `在 Avalanche 链上的 Benqi 协议进行借贷挖矿,赚取 QI 和 AVAX 双币奖励。利用 Avalanche 极速确认(< 2秒)和低 Gas 费(< $0.5)优势,适合频繁操作。存入 AVAX 可获 15% 总 APY,循环借贷后可达 25-30%。`,

  steps: [
    { step_number: 1, title: 'MetaMask 添加 Avalanche', description: '配置 Avalanche C-Chain 网络。', estimated_time: '5 分钟' },
    { step_number: 2, title: '获取 AVAX', description: '从交易所提现或跨链桥。', estimated_time: '20 分钟' },
    { step_number: 3, title: '连接 Benqi', description: '访问 app.benqi.fi 连接钱包。', estimated_time: '5 分钟' },
    { step_number: 4, title: '存款借款', description: '存入 AVAX,借出 USDC,循环操作。', estimated_time: '30 分钟' },
    { step_number: 5, title: '定期维护', description: '检查健康度,提取奖励。', estimated_time: '每周 20 分钟' },
  ],
};

// ===== 7.6 JustLend TRON 挖矿 =====
const STRATEGY_7_6 = {
  title: 'JustLend TRON 挖矿 - 波场链高收益借贷',
  slug: 'justlend-tron-mining',
  summary: '在 TRON 链上的 JustLend 平台存入 TRX/USDT,赚取 JST 代币奖励和高收益,利用 TRON 零 Gas 费优势,实现 10-20% 稳定年化。',

  category: 'lending',
  category_l1: 'yield',
  category_l2: '借贷挖息',

  difficulty_level: 2,
  risk_level: 2,

  apy_min: 10,
  apy_max: 20,
  threshold_capital: '200 美元起',
  threshold_capital_min: 200,
  time_commitment: '初始设置 30 分钟,每月维护 10 分钟',
  time_commitment_minutes: 40,
  threshold_tech_level: 'beginner',

  content: `在 TRON 链上的 JustLend 平台存入资产,享受零 Gas 费优势。存入 USDT(TRC20) 可获 15% APY,包括 5% 利息和 10% JST 奖励。TRON 特色:大部分操作完全免费,只消耗"能量"(通过冻结 TRX 获得)。小资金友好,200 美元起即可参与。`,

  steps: [
    { step_number: 1, title: '安装 TronLink', description: '下载并创建 TRON 钱包。', estimated_time: '10 分钟' },
    { step_number: 2, title: '获取 TRX 和冻结', description: '提现 TRX,冻结获取能量。', estimated_time: '15 分钟' },
    { step_number: 3, title: '连接 JustLend', description: '访问 justlend.org 连接钱包。', estimated_time: '5 分钟' },
    { step_number: 4, title: '存款挖矿', description: '存入 TRX 或 USDT,开始赚取 JST。', estimated_time: '10 分钟' },
    { step_number: 5, title: '定期提取', description: '每月提取 JST 并换成稳定币。', estimated_time: '每月 10 分钟' },
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
    const strategies = [STRATEGY_7_5, STRATEGY_7_6];

    console.log('\n开始创建 7.5 和 7.6 策略...\n');

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