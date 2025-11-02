const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

async function testCategoryQuery() {
  try {
    // First, get the lending category details
    const lendingCat = await axios.get(`${DIRECTUS_URL}/items/categories`, {
      params: {
        'filter[slug][_eq]': 'lending',
        'fields': 'id,slug,name',
        'limit': 1
      }
    });

    console.log('借贷挖息分类:');
    console.log(lendingCat.data.data[0]);
    const categoryId = lendingCat.data.data[0].id;

    // Query strategies by this category
    const strategies = await axios.get(`${DIRECTUS_URL}/items/strategies`, {
      params: {
        'filter[category][_eq]': categoryId,
        'filter[status][_eq]': 'published',
        'fields': 'id,title,slug,category',
        'sort': '-published_at',
        'limit': 10
      }
    });

    console.log(`\n找到 ${strategies.data.data.length} 个策略:\n`);
    strategies.data.data.forEach((s, i) => {
      console.log(`${i + 1}. ${s.title}`);
      console.log(`   slug: ${s.slug}`);
    });

  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testCategoryQuery();
