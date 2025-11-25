const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

async function checkDuplicates() {
  try {
    const authResponse = await axios.post(`${DIRECTUS_URL}/auth/login`, {
      email: 'the_uk1@outlook.com',
      password: 'Mygcdjmyxzg2026!',
    });
    const token = authResponse.data.data.access_token;

    // 查找所有包含"NFT 金融"的策略
    const response = await axios.get(
      `${DIRECTUS_URL}/items/strategies?fields=id,title,slug,category,category_l1,category_l2,status,published_at&limit=-1`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const nftFinanceStrategies = response.data.data.filter(s =>
      s.title?.includes('NFT 金融') ||
      s.title?.includes('NFTFi') ||
      s.slug?.includes('nft-finance')
    );

    console.log('\n📋 找到的NFT金融相关策略：\n');
    nftFinanceStrategies.forEach((s, index) => {
      console.log(`${index + 1}. ${s.title}`);
      console.log(`   ID: ${s.id}`);
      console.log(`   Slug: ${s.slug}`);
      console.log(`   Status: ${s.status}`);
      console.log(`   Category: ${s.category}`);
      console.log(`   Category L1: ${s.category_l1}`);
      console.log(`   Category L2: ${s.category_l2}`);
      console.log(`   Published: ${s.published_at}`);
      console.log('');
    });

    if (nftFinanceStrategies.length > 1) {
      console.log('⚠️  发现重复策略！建议删除旧的或重复的记录。\n');
    } else if (nftFinanceStrategies.length === 1) {
      console.log('✅ 只有一个NFT金融策略，没有重复。\n');
      console.log('💡 检查前端是否正确使用category字段进行筛选。');
      console.log(`   当前使用的category值: ${nftFinanceStrategies[0].category}`);
      console.log(`   当前使用的category_l2值: ${nftFinanceStrategies[0].category_l2}`);
    } else {
      console.log('ℹ️  未找到NFT金融策略，可以安全创建。\n');
    }

  } catch (error) {
    console.error('查询失败:', error.response?.data || error.message);
  }
}

checkDuplicates();
