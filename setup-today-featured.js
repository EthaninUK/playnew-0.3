const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_EMAIL = 'the_uk1@outlook.com';
const DIRECTUS_PASSWORD = 'Mygcdjmyxzg2026!';

async function setupTodayFeatured() {
  console.log('🔄 配置今日精选玩法...\n');

  try {
    // 1. 登录
    console.log('1️⃣ 登录 Directus...');
    const loginRes = await axios.post(`${DIRECTUS_URL}/auth/login`, {
      email: DIRECTUS_EMAIL,
      password: DIRECTUS_PASSWORD
    });
    const token = loginRes.data.data.access_token;
    console.log('✅ 登录成功\n');

    // 2. 获取策略
    console.log('2️⃣ 获取已发布的策略...');
    const strategiesRes = await axios.get(`${DIRECTUS_URL}/items/strategies`, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        filter: { status: { _eq: 'published' } },
        limit: 10,
        fields: 'id,title,category'
      }
    });
    const strategies = strategiesRes.data.data;
    console.log(`✅ 找到 ${strategies.length} 个策略\n`);

    if (strategies.length < 3) {
      console.log('❌ 策略数量不足3个');
      return;
    }

    // 3. 获取今天的日期
    const today = new Date().toISOString().split('T')[0];
    console.log(`3️⃣ 配置日期: ${today}`);

    // 4. 检查是否已有配置
    const existingRes = await axios.get(`${DIRECTUS_URL}/items/daily_featured_plays`, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        filter: { feature_date: { _eq: today } }
      }
    });

    const configData = {
      feature_date: today,
      play_1_id: strategies[0].id,
      play_2_id: strategies[1].id,
      play_3_id: strategies[2].id,
      theme_label: '今日精选',
      is_active: true
    };

    if (existingRes.data.data && existingRes.data.data.length > 0) {
      // 更新
      const configId = existingRes.data.data[0].id;
      console.log('   更新现有配置...');
      await axios.patch(`${DIRECTUS_URL}/items/daily_featured_plays/${configId}`, configData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('   ✅ 更新成功');
    } else {
      // 创建
      console.log('   创建新配置...');
      await axios.post(`${DIRECTUS_URL}/items/daily_featured_plays`, configData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('   ✅ 创建成功');
    }

    // 5. 显示配置
    console.log('\n📋 今日精选玩法:');
    strategies.slice(0, 3).forEach((s, i) => {
      console.log(`   ${i + 1}. ${s.title} (${s.category})`);
    });

    console.log('\n✅ 完成！');

  } catch (error) {
    console.error('❌ 错误:', error.response?.data || error.message);
  }
}

setupTodayFeatured();
