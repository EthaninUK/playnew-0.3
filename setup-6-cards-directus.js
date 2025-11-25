const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_EMAIL = 'the_uk1@outlook.com';
const DIRECTUS_PASSWORD = 'Mygcdjmyxzg2026!';

async function setup6Cards() {
  console.log('🔄 开始配置6张卡片支持...\n');

  try {
    // 1. 登录获取 token
    console.log('1️⃣ 登录 Directus...');
    const loginRes = await axios.post(`${DIRECTUS_URL}/auth/login`, {
      email: DIRECTUS_EMAIL,
      password: DIRECTUS_PASSWORD
    });
    const token = loginRes.data.data.access_token;
    console.log('✅ 登录成功\n');

    // 2. 获取一些策略
    console.log('2️⃣ 获取策略...');
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

    if (strategies.length < 6) {
      console.log('❌ 策略数量不足6个，无法配置');
      return;
    }

    // 3. 检查 daily_featured_plays 表是否存在 play_4_id 等字段
    console.log('3️⃣ 检查表字段...');
    try {
      const fieldsRes = await axios.get(`${DIRECTUS_URL}/fields/daily_featured_plays`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const fields = fieldsRes.data.data;
      const fieldNames = fields.map(f => f.field);

      const hasPlay4 = fieldNames.includes('play_4_id');
      const hasPlay5 = fieldNames.includes('play_5_id');
      const hasPlay6 = fieldNames.includes('play_6_id');

      console.log(`   play_4_id: ${hasPlay4 ? '✅' : '❌'}`);
      console.log(`   play_5_id: ${hasPlay5 ? '✅' : '❌'}`);
      console.log(`   play_6_id: ${hasPlay6 ? '✅' : '❌'}`);

      if (!hasPlay4 || !hasPlay5 || !hasPlay6) {
        console.log('\n⚠️  缺少字段，需要创建...');

        // 创建缺失的字段
        const fieldsToCreate = [];
        if (!hasPlay4) fieldsToCreate.push('play_4_id');
        if (!hasPlay5) fieldsToCreate.push('play_5_id');
        if (!hasPlay6) fieldsToCreate.push('play_6_id');

        for (const fieldName of fieldsToCreate) {
          console.log(`   创建字段: ${fieldName}...`);
          await axios.post(`${DIRECTUS_URL}/fields/daily_featured_plays`, {
            field: fieldName,
            type: 'uuid',
            meta: {
              interface: 'select-dropdown-m2o',
              options: {
                template: '{{title}}'
              },
              display: 'related-values',
              display_options: {
                template: '{{title}}'
              },
              special: ['m2o']
            },
            schema: {
              is_nullable: true
            }
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          console.log(`   ✅ ${fieldName} 创建成功`);
        }
      }
    } catch (error) {
      console.error('❌ 检查/创建字段失败:', error.response?.data || error.message);
    }

    // 4. 获取今天的日期
    const today = new Date().toISOString().split('T')[0];
    console.log(`\n4️⃣ 配置 ${today} 的精选玩法...`);

    // 5. 检查是否已有今日配置
    const existingRes = await axios.get(`${DIRECTUS_URL}/items/daily_featured_plays`, {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        filter: { feature_date: { _eq: today } }
      }
    });

    const updateData = {
      play_1_id: strategies[0].id,
      play_2_id: strategies[1].id,
      play_3_id: strategies[2].id,
      play_4_id: strategies[3].id,
      play_5_id: strategies[4].id,
      play_6_id: strategies[5].id,
      theme_label: '今日精选',
      is_active: true
    };

    if (existingRes.data.data && existingRes.data.data.length > 0) {
      // 更新现有配置
      const configId = existingRes.data.data[0].id;
      console.log('   更新现有配置...');
      await axios.patch(`${DIRECTUS_URL}/items/daily_featured_plays/${configId}`, updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('   ✅ 更新成功');
    } else {
      // 创建新配置
      console.log('   创建新配置...');
      await axios.post(`${DIRECTUS_URL}/items/daily_featured_plays`, {
        ...updateData,
        feature_date: today
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('   ✅ 创建成功');
    }

    // 6. 显示配置的策略
    console.log('\n📋 已配置的6个策略:');
    strategies.slice(0, 6).forEach((s, i) => {
      console.log(`   ${i + 1}. ${s.title} (${s.category})`);
    });

    console.log('\n✅ 完成！6张卡片已配置成功');

  } catch (error) {
    console.error('❌ 错误:', error.response?.data || error.message);
  }
}

setup6Cards();
