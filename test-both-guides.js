const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

async function testBothGuides() {
  try {
    console.log('='.repeat(60));
    console.log('测试稳定币理财指南');
    console.log('='.repeat(60));

    // Get stablecoin category
    const stablecoinCat = await axios.get(`${DIRECTUS_URL}/items/categories/c1540c56-581f-44e0-8885-a48106d7377c?fields=id,slug,name`);
    console.log('\n分类信息:', stablecoinCat.data.data);

    // Get strategies in this category
    const stablecoinStrategies = await axios.get(`${DIRECTUS_URL}/items/strategies`, {
      params: {
        'filter[category][_eq]': 'c1540c56-581f-44e0-8885-a48106d7377c',
        'filter[status][_eq]': 'published',
        'fields': 'id,title,slug',
        'limit': 10
      }
    });

    console.log(`\n找到 ${stablecoinStrategies.data.data.length} 个策略:`);
    stablecoinStrategies.data.data.forEach((s, i) => {
      console.log(`  ${i + 1}. ${s.title} (${s.slug})`);
    });

    console.log('\n' + '='.repeat(60));
    console.log('测试借贷挖息指南');
    console.log('='.repeat(60));

    // Get lending category
    const lendingCat = await axios.get(`${DIRECTUS_URL}/items/categories/7096a247-b8aa-4f36-9499-c88fdbbf5545?fields=id,slug,name`);
    console.log('\n分类信息:', lendingCat.data.data);

    // Get strategies in this category
    const lendingStrategies = await axios.get(`${DIRECTUS_URL}/items/strategies`, {
      params: {
        'filter[category][_eq]': '7096a247-b8aa-4f36-9499-c88fdbbf5545',
        'filter[status][_eq]': 'published',
        'fields': 'id,title,slug',
        'limit': 10
      }
    });

    console.log(`\n找到 ${lendingStrategies.data.data.length} 个策略:`);
    lendingStrategies.data.data.forEach((s, i) => {
      console.log(`  ${i + 1}. ${s.title} (${s.slug})`);
    });

    console.log('\n' + '='.repeat(60));
    console.log('前端自动置顶配置');
    console.log('='.repeat(60));
    console.log('\n已配置的映射关系:');
    console.log(`  - stablecoin-yield -> stablecoin-yield-guide`);
    console.log(`  - lending -> lending-yield-complete-guide`);

  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testBothGuides();
