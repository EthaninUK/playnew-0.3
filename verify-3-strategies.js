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
      'berachain-testnet-interaction',
      'monad-testnet-early-participation',
      'fuel-network-testnet-development',
      'celestia-testnet-node-operation',
      'sui-testnet-dapp-experience',
      'aptos-developer-incentive-program',
      'faucet-testnet-token-batch-claiming',
      'testnet-bug-bounty-program',
      'devnet-developer-community-building'
    ];

    console.log('\n📋 验证 3.1-3.9 策略上传状态:\n');

    for (let i = 0; i < slugs.length; i++) {
      const response = await axios.get(
        `${DIRECTUS_URL}/items/strategies?filter[slug][_eq]=${slugs[i]}&fields=id,title,slug,category`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.data.length > 0) {
        const strategy = response.data.data[0];
        console.log(`✅ 3.${i + 1} ${strategy.title}`);
        console.log(`   Slug: ${strategy.slug}`);
        console.log(`   Category: ${strategy.category}`);
        console.log(`   ID: ${strategy.id}\n`);
      } else {
        console.log(`❌ 3.${i + 1} 未找到: ${slugs[i]}\n`);
      }
    }

    console.log('🎉 所有策略验证完成！');
    console.log('\n访问: http://localhost:3000/strategies?category=testnet');
  } catch (error) {
    console.error('验证失败:', error.response?.data || error.message);
  }
}

verifyStrategies();
