const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

async function fixCategory() {
  try {
    // 登录
    const authResponse = await axios.post(`${DIRECTUS_URL}/auth/login`, {
      email: 'the_uk1@outlook.com',
      password: 'Mygcdjmyxzg2026!',
    });
    const token = authResponse.data.data.access_token;

    // 查找NFT金融策略
    const searchResponse = await axios.get(
      `${DIRECTUS_URL}/items/strategies?filter[slug][_eq]=nft-finance-complete-guide`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (searchResponse.data.data.length === 0) {
      console.log('❌ 未找到NFT金融策略');
      return;
    }

    const strategy = searchResponse.data.data[0];
    console.log('\n📋 找到的策略：');
    console.log(`   ID: ${strategy.id}`);
    console.log(`   Title: ${strategy.title}`);
    console.log(`   当前 category: ${strategy.category}`);
    console.log(`   当前 category_l2: ${strategy.category_l2}`);

    // 更新category字段为正确的slug
    const updateResponse = await axios.patch(
      `${DIRECTUS_URL}/items/strategies/${strategy.id}`,
      {
        category: 'nft-fi',
        category_l1: 'nft',
        category_l2: 'NFT 金融',
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('\n✅ 更新成功！');
    console.log(`   新的 category: ${updateResponse.data.data.category}`);
    console.log(`   新的 category_l1: ${updateResponse.data.data.category_l1}`);
    console.log(`   新的 category_l2: ${updateResponse.data.data.category_l2}`);
    console.log('\n💡 现在该策略应该会出现在"NFT 金融"分类下');
    console.log(`   访问: http://localhost:3000/strategies?category=nft-fi`);

  } catch (error) {
    console.error('\n❌ 更新失败:', error.response?.data || error.message);
  }
}

fixCategory();
