const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

async function getAuthToken() {
  const response = await axios.post(`${DIRECTUS_URL}/auth/login`, {
    email: 'the_uk1@outlook.com',
    password: 'Mygcdjmyxzg2026!',
  });
  return response.data.data.access_token;
}

async function findCategory() {
  try {
    const token = await getAuthToken();

    const response = await axios.get(
      `${DIRECTUS_URL}/items/categories?fields=id,name,slug&limit=-1`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const testnetCategory = response.data.data.find(c => c.slug === 'testnet');

    if (testnetCategory) {
      console.log('\n找到测试网分类:');
      console.log(`ID: ${testnetCategory.id}`);
      console.log(`名称: ${testnetCategory.name}`);
      console.log(`Slug: ${testnetCategory.slug}\n`);
    } else {
      console.log('\n未找到 testnet 分类，显示所有分类:\n');
      response.data.data.forEach(c => {
        console.log(`${c.id} | ${c.name} | ${c.slug}`);
      });
    }
  } catch (error) {
    console.error('查询失败:', error.response?.data || error.message);
  }
}

findCategory();
