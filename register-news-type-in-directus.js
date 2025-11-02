const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_EMAIL = 'the_uk1@outlook.com';
const DIRECTUS_PASSWORD = 'Mygcdjmyxzg2026!';

async function registerNewsTypeField() {
  try {
    // Login to Directus
    console.log('🔐 登录 Directus...');
    const loginResponse = await axios.post(`${DIRECTUS_URL}/auth/login`, {
      email: DIRECTUS_EMAIL,
      password: DIRECTUS_PASSWORD,
    });

    const token = loginResponse.data.data.access_token;
    console.log('✅ 登录成功');

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    // Check if field already exists in Directus
    console.log('🔍 检查 news_type 字段是否已在 Directus 中注册...');
    try {
      await axios.get(`${DIRECTUS_URL}/fields/news/news_type`, { headers });
      console.log('⚠️  news_type 字段已在 Directus 中注册');
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('➕ 在 Directus 中注册 news_type 字段...');

        // Register the field in Directus
        await axios.post(`${DIRECTUS_URL}/fields/news`, {
          field: 'news_type',
          type: 'string',
          meta: {
            interface: 'select-dropdown',
            options: {
              choices: [
                { text: '实时资讯', value: 'realtime' },
                { text: '新鲜八卦', value: 'gossip' }
              ]
            },
            display: 'labels',
            display_options: {
              choices: [
                { text: '实时资讯', value: 'realtime', foreground: '#FFFFFF', background: '#2196F3' },
                { text: '新鲜八卦', value: 'gossip', foreground: '#FFFFFF', background: '#FF5722' }
              ]
            },
            width: 'half',
            sort: 5,
            note: '新闻类型：实时资讯或新鲜八卦'
          },
          schema: {
            default_value: 'realtime',
            is_nullable: true
          }
        }, { headers });

        console.log('✅ news_type 字段已在 Directus 中注册');
      } else {
        throw error;
      }
    }

    console.log('\n🎉 Directus 字段配置完成！');
    console.log('现在可以在 Directus 管理界面中编辑新闻类型了');

  } catch (error) {
    console.error('❌ 错误:', error.response?.data || error.message);
  }
}

registerNewsTypeField();
