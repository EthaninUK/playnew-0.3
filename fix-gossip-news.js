const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_EMAIL = 'the_uk1@outlook.com';
const DIRECTUS_PASSWORD = 'Mygcdjmyxzg2026!';

// 我们之前添加的八卦新闻的来源
const gossipSources = [
  'Twitter', 'CoinDesk', 'Arkham Intelligence', 'The Block', 'Whale Alert',
  'Bankless', 'NFT Evening', 'Bloomberg', 'PeckShield', 'Unchained Podcast',
  'OpenSea', 'PROOF Collective', 'Uniswap Blog', 'Crypto Twitter',
  'CoinTelegraph', 'Discord', 'Medium', 'Etherscan'
];

async function main() {
  try {
    console.log('🔐 登录 Directus...');
    const authResponse = await axios.post(`${DIRECTUS_URL}/auth/login`, {
      email: DIRECTUS_EMAIL,
      password: DIRECTUS_PASSWORD,
    });

    const accessToken = authResponse.data.data.access_token;
    console.log('✅ 登录成功！');

    // 获取所有需要更新的新闻（那些来源匹配但news_type不是gossip的）
    console.log('\n🔍 查找需要更新的八卦新闻...');

    const allNews = await axios.get(`${DIRECTUS_URL}/items/news?fields=id,title,source,news_type&limit=-1`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const toUpdate = allNews.data.data.filter(item =>
      gossipSources.includes(item.source) && item.news_type !== 'gossip'
    );

    console.log(`📝 找到 ${toUpdate.length} 条需要更新为 gossip 类型的新闻`);

    if (toUpdate.length === 0) {
      console.log('\n✨ 没有需要更新的新闻');
      return;
    }

    // 更新每条新闻的 news_type
    let successCount = 0;
    let failCount = 0;

    for (const item of toUpdate) {
      try {
        await axios.patch(
          `${DIRECTUS_URL}/items/news/${item.id}`,
          { news_type: 'gossip' },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            }
          }
        );
        successCount++;
        console.log(`✅ [${successCount}/${toUpdate.length}] ${item.title.substring(0, 40)}...`);
      } catch (error) {
        failCount++;
        console.error(`❌ 更新失败: ${item.title.substring(0, 40)}...`);
      }
    }

    console.log('\n✨ 更新完成！');
    console.log(`📊 统计:`);
    console.log(`   - 成功: ${successCount} 条`);
    console.log(`   - 失败: ${failCount} 条`);

    // 验证结果
    console.log('\n🔍 验证八卦新闻数量...');
    const gossipCount = await axios.get(
      `${DIRECTUS_URL}/items/news?filter[news_type][_eq]=gossip&aggregate[count]=id`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    const realtimeCount = await axios.get(
      `${DIRECTUS_URL}/items/news?filter[news_type][_eq]=realtime&aggregate[count]=id`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    console.log(`\n📊 最终统计:`);
    console.log(`   - 八卦新闻: ${gossipCount.data.data?.[0]?.count?.id || 0} 条`);
    console.log(`   - 实时资讯: ${realtimeCount.data.data?.[0]?.count?.id || 0} 条`);

  } catch (error) {
    console.error('\n❌ 错误:', error.response?.data || error.message);
    process.exit(1);
  }
}

main();
