const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

async function checkCategories() {
  try {
    // 登录获取token
    const authResponse = await axios.post(`${DIRECTUS_URL}/auth/login`, {
      email: 'the_uk1@outlook.com',
      password: 'Mygcdjmyxzg2026!',
    });
    const token = authResponse.data.data.access_token;

    // 获取所有strategies的分类信息
    const response = await axios.get(
      `${DIRECTUS_URL}/items/strategies?fields=id,title,category,category_l1,category_l2&limit=-1`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log('\n现有strategies的分类使用情况：\n');

    // 统计category_l1和category_l2的使用情况
    const l1Map = {};
    const l2Map = {};
    const categoryMap = {};

    response.data.data.forEach(s => {
      // 统计category_l1
      if (s.category_l1) {
        l1Map[s.category_l1] = (l1Map[s.category_l1] || 0) + 1;
      }

      // 统计category_l2
      if (s.category_l2) {
        l2Map[s.category_l2] = (l2Map[s.category_l2] || 0) + 1;
      }

      // 统计category
      if (s.category) {
        categoryMap[s.category] = (categoryMap[s.category] || 0) + 1;
      }
    });

    console.log('📊 category_l1 统计：');
    Object.entries(l1Map).forEach(([key, count]) => {
      console.log(`  ${key}: ${count}个策略`);
    });

    console.log('\n📊 category_l2 统计：');
    Object.entries(l2Map).forEach(([key, count]) => {
      console.log(`  ${key}: ${count}个策略`);
    });

    console.log('\n📊 category (UUID) 统计：');
    Object.entries(categoryMap).forEach(([key, count]) => {
      console.log(`  ${key}: ${count}个策略`);
    });

    // 查找NFT相关的策略
    console.log('\n\n🔍 NFT相关策略示例：\n');
    const nftStrategies = response.data.data.filter(s =>
      s.category_l1 === 'nft' ||
      s.category_l2?.includes('NFT') ||
      s.title?.includes('NFT')
    );

    nftStrategies.slice(0, 5).forEach(s => {
      console.log(`✓ ${s.title}`);
      console.log(`  category: ${s.category || 'N/A'}`);
      console.log(`  category_l1: ${s.category_l1 || 'N/A'}`);
      console.log(`  category_l2: ${s.category_l2 || 'N/A'}`);
      console.log('');
    });

    // 查找"NFT 金融"相关
    console.log('\n🎯 查找"NFT 金融"相关策略：\n');
    const financeStrategies = response.data.data.filter(s =>
      (s.category_l1 === 'nft' && s.category_l2?.includes('金融')) ||
      s.title?.includes('NFT 金融') ||
      s.title?.includes('NFTFi')
    );

    if (financeStrategies.length > 0) {
      financeStrategies.forEach(s => {
        console.log(`  ${s.title}`);
        console.log(`    category: ${s.category}`);
        console.log(`    category_l2: ${s.category_l2}`);
        console.log('');
      });
    } else {
      console.log('  未找到现有的NFT金融策略');
      console.log('  建议使用: category_l1="nft", category_l2="NFT 金融"');
    }

  } catch (error) {
    console.error('查询失败:', error.response?.data || error.message);
  }
}

checkCategories();
