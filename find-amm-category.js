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

    console.log('\n所有分类:\n');
    response.data.data.forEach(c => {
      console.log(`${c.slug.padEnd(30)} | ${c.name}`);
    });

    const ammCategory = response.data.data.find(c => c.slug === 'amm');

    if (ammCategory) {
      console.log('\n\n找到 AMM 分类:');
      console.log(`ID: ${ammCategory.id}`);
      console.log(`名称: ${ammCategory.name}`);
      console.log(`Slug: ${ammCategory.slug}\n`);
    } else {
      console.log('\n\n未找到 amm 分类\n');
    }
  } catch (error) {
    console.error('查询失败:', error.response?.data || error.message);
  }
}

findCategory();
