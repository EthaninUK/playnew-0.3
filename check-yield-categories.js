const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

async function checkCategories() {
  try {
    // Get all child categories
    const response = await axios.get(`${DIRECTUS_URL}/items/categories`, {
      params: {
        'filter[type][_eq]': 'child',
        'fields': 'id,name,slug,parent_id',
        'sort': 'order_index',
        'limit': -1
      }
    });

    const yieldCategories = response.data.data.filter(c =>
      c.name.includes('理财') ||
      c.name.includes('借贷') ||
      c.name.includes('质押') ||
      c.name.includes('流动性')
    );

    console.log('\n链上收益相关分类：\n');
    yieldCategories.forEach(cat => {
      console.log(`- ${cat.name} (slug: ${cat.slug}, id: ${cat.id})`);
    });

    // Check the two guides we created
    console.log('\n\n已创建的指南：\n');

    const stablecoin = await axios.get(`${DIRECTUS_URL}/items/strategies`, {
      params: {
        'filter[slug][_eq]': 'stablecoin-yield-guide',
        'fields': 'id,title,slug,category',
        'limit': 1
      }
    });

    if (stablecoin.data.data.length > 0) {
      const guide = stablecoin.data.data[0];
      const cat = yieldCategories.find(c => c.id === guide.category);
      console.log(`1. ${guide.title}`);
      console.log(`   slug: ${guide.slug}`);
      console.log(`   category: ${cat ? cat.slug : guide.category}`);
    }

    const lending = await axios.get(`${DIRECTUS_URL}/items/strategies`, {
      params: {
        'filter[slug][_eq]': 'lending-yield-complete-guide',
        'fields': 'id,title,slug,category',
        'limit': 1
      }
    });

    if (lending.data.data.length > 0) {
      const guide = lending.data.data[0];
      const cat = yieldCategories.find(c => c.id === guide.category);
      console.log(`\n2. ${guide.title}`);
      console.log(`   slug: ${guide.slug}`);
      console.log(`   category: ${cat ? cat.slug : guide.category}`);
    }

  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

checkCategories();
