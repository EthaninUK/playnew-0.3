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

    // 获取所有分类（只查询基本字段）
    const response = await axios.get(`${DIRECTUS_URL}/items/categories?limit=-1`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('\n所有分类：\n');
    response.data.data.forEach(cat => {
      console.log(`${cat.name || cat.title || 'Unnamed'}`);
      console.log(`  ID: ${cat.id}`);
      console.log(`  Slug: ${cat.slug || 'N/A'}`);
      console.log(`  字段: ${Object.keys(cat).join(', ')}`);
      console.log('');
    });

    // 查找包含"NFT"和"金融"的分类
    console.log('\n🔍 搜索"NFT 金融"相关分类...\n');
    const nftFinance = response.data.data.filter(c => {
      const searchText = JSON.stringify(c).toLowerCase();
      return searchText.includes('nft') && searchText.includes('金融');
    });

    if (nftFinance.length > 0) {
      console.log('✅ 找到匹配的分类：');
      nftFinance.forEach(c => {
        console.log(`\n  名称: ${c.name || c.title}`);
        console.log(`  ID: ${c.id}`);
        console.log(`  完整数据: ${JSON.stringify(c, null, 2)}`);
      });
    } else {
      console.log('⚠️  未找到"NFT 金融"分类');

      // 显示所有包含NFT的分类
      const nftCats = response.data.data.filter(c =>
        JSON.stringify(c).toLowerCase().includes('nft')
      );

      if (nftCats.length > 0) {
        console.log('\n包含"NFT"的分类：');
        nftCats.forEach(c => {
          console.log(`  - ${c.name || c.title} (ID: ${c.id})`);
        });
      }
    }

  } catch (error) {
    console.error('查询失败:', error.response?.data || error.message);
  }
}

findCategory();
