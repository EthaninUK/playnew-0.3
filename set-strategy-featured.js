const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';
const EMAIL = 'the_uk1@outlook.com';
const PASSWORD = 'Mygcdjmyxzg2026!';

async function setStrategyFeatured() {
  try {
    // 登录
    const loginResponse = await axios.post(`${DIRECTUS_URL}/auth/login`, {
      email: EMAIL,
      password: PASSWORD
    });
    const token = loginResponse.data.data.access_token;

    // 获取最新的策略
    const strategiesResponse = await axios.get(
      `${DIRECTUS_URL}/items/strategies?limit=10&sort=-published_at&filter[status][_eq]=published&fields=id,title,is_featured`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );

    console.log('\n📋 当前策略列表（前10个）：\n');
    console.log('序号 | 精选 | 标题');
    console.log('-----|------|------');

    strategiesResponse.data.data.forEach((s, index) => {
      const featured = s.is_featured ? '⭐' : '  ';
      console.log(`${index + 1}.   | ${featured}   | ${s.title}`);
    });

    console.log('\n使用方法：');
    console.log('1. 在上面的列表中选择一个策略编号');
    console.log('2. 修改脚本中的 strategyIndex 变量');
    console.log('3. 重新运行脚本来设置精选\n');

    // 示例：将第一个策略设为精选
    const strategyToFeature = strategiesResponse.data.data[0];

    if (strategyToFeature && !strategyToFeature.is_featured) {
      await axios.patch(
        `${DIRECTUS_URL}/items/strategies/${strategyToFeature.id}`,
        { is_featured: true },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log(`✅ 已将 "${strategyToFeature.title}" 设为精选\n`);
    }

  } catch (error) {
    console.error('❌ 错误:', error.response?.data || error.message);
  }
}

setStrategyFeatured();
