const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

async function getAdminToken() {
  const response = await axios.post(`${DIRECTUS_URL}/auth/login`, {
    email: 'the_uk1@outlook.com',
    password: 'Mygcdjmyxzg2026!'
  });
  return response.data.data.access_token;
}

async function fixData() {
  try {
    const token = await getAdminToken();
    const headers = { Authorization: `Bearer ${token}` };

    console.log('🔧 开始修复数据...\n');

    const categoriesRes = await axios.get(`${DIRECTUS_URL}/items/categories`, { headers });
    const categories = categoriesRes.data.data;
    console.log(`✅ 找到 ${categories.length} 个分类`);

    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.slug] = cat.id;
    });

    console.log('\n📰 修复快讯数据...');
    const newsRes = await axios.get(`${DIRECTUS_URL}/items/news?limit=-1`, { headers });
    const newsItems = newsRes.data.data;
    
    console.log(`找到 ${newsItems.length} 条快讯`);
    
    const newsCategoryRules = [
      { keywords: ['ETH', 'Ethereum', 'Bitcoin', 'BTC'], category: 'market' },
      { keywords: ['Exchange', 'Binance', 'Coinbase'], category: 'exchange' },
      { keywords: ['SEC', 'CFTC', 'Regulation'], category: 'regulation' },
      { keywords: ['DeFi', 'Protocol'], category: 'defi' },
      { keywords: ['NFT', 'OpenSea'], category: 'nft' },
      { keywords: ['Airdrop'], category: 'airdrop' },
    ];

    let newsUpdated = 0;
    for (const news of newsItems) {
      let assignedCategory = null;
      
      for (const rule of newsCategoryRules) {
        if (rule.keywords.some(kw => news.title.includes(kw))) {
          assignedCategory = categoryMap[rule.category];
          break;
        }
      }
      
      if (!assignedCategory) {
        const commonCategories = ['market', 'project', 'defi'];
        const randomSlug = commonCategories[Math.floor(Math.random() * commonCategories.length)];
        assignedCategory = categoryMap[randomSlug];
      }

      await axios.patch(
        `${DIRECTUS_URL}/items/news/${news.id}`,
        {
          category: assignedCategory,
          status: 'published'
        },
        { headers }
      );
      
      newsUpdated++;
      if (newsUpdated % 10 === 0) {
        console.log(`  已更新 ${newsUpdated}/${newsItems.length} 条快讯`);
      }
    }
    console.log(`✅ 完成！更新了 ${newsUpdated} 条快讯\n`);

    console.log('📚 修复策略数据...');
    const strategiesRes = await axios.get(`${DIRECTUS_URL}/items/strategies?limit=-1`, { headers });
    const strategies = strategiesRes.data.data;
    
    console.log(`找到 ${strategies.length} 个策略`);

    const strategyCategoryRules = [
      { keywords: ['Lido', 'Staking'], category: 'defi' },
      { keywords: ['Uniswap', 'Curve', 'Swap'], category: 'defi' },
      { keywords: ['Aave', 'Compound'], category: 'defi' },
      { keywords: ['NFT', 'BendDAO'], category: 'nft' },
      { keywords: ['Airdrop'], category: 'airdrop' },
      { keywords: ['Mining'], category: 'mining' },
      { keywords: ['Safe', 'Gnosis', 'Wallet'], category: 'wallet' },
      { keywords: ['GMX', 'Trading'], category: 'trading' },
    ];

    let strategiesUpdated = 0;
    for (const strategy of strategies) {
      let assignedCategory = null;
      
      for (const rule of strategyCategoryRules) {
        if (rule.keywords.some(kw => strategy.title.includes(kw))) {
          assignedCategory = categoryMap[rule.category];
          break;
        }
      }
      
      if (!assignedCategory) {
        assignedCategory = categoryMap['defi'];
      }

      await axios.patch(
        `${DIRECTUS_URL}/items/strategies/${strategy.id}`,
        { category: assignedCategory },
        { headers }
      );
      
      strategiesUpdated++;
    }
    console.log(`✅ 完成！更新了 ${strategiesUpdated} 个策略\n`);

    console.log('🔍 验证修复结果...');
    
    const verifyNews = await axios.get(
      `${DIRECTUS_URL}/items/news?filter[status][_eq]=published&limit=3&fields=id,title,category,status`,
      { headers }
    );
    console.log('\n已发布的快讯示例：');
    verifyNews.data.data.forEach(n => {
      const preview = n.title.substring(0, 50);
      console.log(`  - ${preview}... [${n.category ? '✅ 有分类' : '❌ 无分类'}]`);
    });

    const verifyStrategies = await axios.get(
      `${DIRECTUS_URL}/items/strategies?limit=3&fields=id,title,category`,
      { headers }
    );
    console.log('\n策略示例：');
    verifyStrategies.data.data.forEach(s => {
      console.log(`  - ${s.title} [${s.category ? '✅ 有分类' : '❌ 无分类'}]`);
    });

    console.log('\n✅ 数据修复完成！');

  } catch (error) {
    console.error('❌ 错误:', error.response?.data || error.message);
  }
}

fixData();
