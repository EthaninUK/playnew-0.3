const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

const STRATEGY_SLUGS = [
  'starknet-onchain-interactions',
  'base-chain-early-adoption',
  'discord-verification-roles',
  'twitter-social-tasks-batch',
  'snapshot-governance-voting'
];

async function getAuthToken() {
  const response = await axios.post(`${DIRECTUS_URL}/auth/login`, {
    email: 'the_uk1@outlook.com',
    password: 'Mygcdjmyxzg2026!',
  });
  return response.data.data.access_token;
}

async function deleteStrategies() {
  try {
    const token = await getAuthToken();

    console.log('\n开始删除 1.5-1.9 策略...\n');

    for (const slug of STRATEGY_SLUGS) {
      try {
        // 先查找 ID
        const findResponse = await axios.get(
          `${DIRECTUS_URL}/items/strategies?filter[slug][_eq]=${slug}&limit=1`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (findResponse.data.data.length > 0) {
          const id = findResponse.data.data[0].id;

          // 删除
          await axios.delete(
            `${DIRECTUS_URL}/items/strategies/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          console.log(`✅ 已删除: ${slug}`);
        } else {
          console.log(`⚠️  未找到: ${slug}`);
        }
      } catch (error) {
        console.error(`❌ 删除失败 ${slug}:`, error.response?.data || error.message);
      }
    }

    console.log('\n✅ 删除完成！\n');
  } catch (error) {
    console.error('\n❌ 操作失败:', error.response?.data || error.message);
  }
}

deleteStrategies();