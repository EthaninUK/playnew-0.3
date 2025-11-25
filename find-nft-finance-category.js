const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

async function findCategory() {
  try {
    // 登录获取token
    const authResponse = await axios.post(`${DIRECTUS_URL}/auth/login`, {
      email: 'the_uk1@outlook.com',
      password: 'Mygcdjmyxzg2026!',
    });
    const token = authResponse.data.data.access_token;

    // 获取所有分类
    const response = await axios.get(`${DIRECTUS_URL}/items/categories?fields=id,name,slug,category_l1,category_l2&limit=-1`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('\n所有NFT相关分类：\n');
    const nftCategories = response.data.data.filter(c =>
      c.name?.includes('NFT') ||
      c.name?.includes('nft') ||
      c.category_l1 === 'nft' ||
      c.slug?.includes('nft')
    );

    nftCategories.forEach(cat => {
      console.log(`✓ ${cat.name}`);
      console.log(`  ID: ${cat.id}`);
      console.log(`  Slug: ${cat.slug}`);
      console.log(`  L1: ${cat.category_l1}, L2: ${cat.category_l2}`);
      console.log('');
    });

    // 特别查找"NFT 金融"
    const financeCategory = response.data.data.find(c =>
      c.name?.includes('金融') ||
      c.category_l2?.includes('金融') ||
      c.slug?.includes('finance')
    );

    if (financeCategory) {
      console.log('\n🎯 找到金融相关分类：');
      console.log(`  名称: ${financeCategory.name}`);
      console.log(`  ID: ${financeCategory.id}`);
      console.log(`  Slug: ${financeCategory.slug}`);
    } else {
      console.log('\n⚠️  未找到"NFT 金融"分类，可能需要创建');
    }

  } catch (error) {
    console.error('查询失败:', error.response?.data || error.message);
  }
}

findCategory();
