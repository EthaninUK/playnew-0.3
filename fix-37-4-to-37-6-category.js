const axios = require('axios');
const { execSync } = require('child_process');

async function fixCategories() {
  console.log('开始修复策略 37.4-37.6 的分类...\n');

  try {
    const tokenOutput = execSync('./get-new-directus-token.sh').toString();
    const tokenMatch = tokenOutput.match(/DIRECTUS_ADMIN_TOKEN=(.+)/);

    if (!tokenMatch) {
      throw new Error('Failed to get admin token');
    }

    const ADMIN_TOKEN = tokenMatch[1].trim();
    const DIRECTUS_URL = 'http://localhost:8055';

    const headers = {
      Authorization: `Bearer ${ADMIN_TOKEN}`,
      'Content-Type': 'application/json'
    };

    const slugs = [
      'pendle-new-yield-markets-pt-yt-arbitrage',
      'new-stablecoin-liquidity-bootstrapping-pools',
      'new-l2-native-dex-early-liquidity'
    ];

    for (const slug of slugs) {
      // 先查询获取 ID
      const getRes = await axios.get(
        `${DIRECTUS_URL}/items/strategies?filter[slug][_eq]=${slug}&fields=id,title`,
        { headers }
      );

      if (getRes.data.data?.length > 0) {
        const strategy = getRes.data.data[0];
        console.log(`更新策略: ${strategy.title}`);

        // 更新 category
        await axios.patch(
          `${DIRECTUS_URL}/items/strategies/${strategy.id}`,
          {
            category: 'new-protocols',
            category_l2: 'new-protocols'
          },
          { headers }
        );

        console.log(`✅ 已更新为 new-protocols\n`);
      }
    }

    console.log('✅ 所有策略分类已修复！');
  } catch (error) {
    console.error('❌ 修复失败:', error.response?.data || error.message);
    process.exit(1);
  }
}

fixCategories();
