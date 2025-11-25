const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

async function getAuthToken() {
  const response = await axios.post(`${DIRECTUS_URL}/auth/login`, {
    email: 'the_uk1@outlook.com',
    password: 'Mygcdjmyxzg2026!',
  });
  return response.data.data.access_token;
}

async function verifyStrategies() {
  try {
    const token = await getAuthToken();

    const slugs = [
      'uniswap-v3-concentrated-liquidity',
      'curve-stable-pool-market-making',
      'pancakeswap-v3-bsc-market-making',
      'trader-joe-liquidity-book',
      'maverick-protocol-dynamic-liquidity',
      'balancer-multi-asset-pool',
      'camelot-v3-arbitrum-market-making',
      'aerodrome-base-liquidity',
      'kyberswap-dynamic-fee-market-making'
    ];

    const strategyTitles = [
      'Uniswap V3 集中流动性做市',
      'Curve 稳定币池低风险做市',
      'PancakeSwap V3 BSC 做市',
      'Trader Joe Liquidity Book',
      'Maverick Protocol 动态流动性做市',
      'Balancer 多资产池做市',
      'Camelot V3 Arbitrum 做市',
      'Aerodrome Base 链流动性',
      'KyberSwap 动态手续费做市'
    ];

    console.log('\n📋 验证 11.1-11.9 AMM 做市策略上传状态:\n');
    console.log('='.repeat(80));

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < slugs.length; i++) {
      const response = await axios.get(
        `${DIRECTUS_URL}/items/strategies?filter[slug][_eq]=${slugs[i]}&fields=id,title,slug,category,apy_min,apy_max,difficulty_level,risk_level`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.data.length > 0) {
        const strategy = response.data.data[0];
        console.log(`✅ 11.${i + 1} ${strategyTitles[i]}`);
        console.log(`   Slug: ${strategy.slug}`);
        console.log(`   Category: ${strategy.category}`);
        console.log(`   APY: ${strategy.apy_min}% - ${strategy.apy_max}%`);
        console.log(`   难度: ${strategy.difficulty_level} | 风险: ${strategy.risk_level}`);
        console.log(`   ID: ${strategy.id}`);
        console.log('');
        successCount++;
      } else {
        console.log(`❌ 11.${i + 1} 未找到: ${slugs[i]}\n`);
        failCount++;
      }
    }

    console.log('='.repeat(80));
    console.log(`\n📊 统计结果:`);
    console.log(`✅ 成功上传: ${successCount}/9`);
    console.log(`❌ 上传失败: ${failCount}/9`);

    if (successCount === 9) {
      console.log('\n🎉 所有 AMM 做市策略验证完成！');
      console.log('\n访问链接:');
      console.log('- 前端: http://localhost:3000/strategies?category=amm');
      console.log('- Directus: http://localhost:8055/admin/content/strategies');
    } else {
      console.log('\n⚠️  部分策略上传失败，请检查！');
    }

  } catch (error) {
    console.error('\n❌ 验证失败:', error.response?.data || error.message);
  }
}

verifyStrategies();
