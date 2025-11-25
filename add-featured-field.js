const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';
const EMAIL = 'the_uk1@outlook.com';
const PASSWORD = 'Mygcdjmyxzg2026!';

async function addFeaturedField() {
  try {
    // 1. 登录获取 token
    console.log('正在登录 Directus...');
    const loginResponse = await axios.post(`${DIRECTUS_URL}/auth/login`, {
      email: EMAIL,
      password: PASSWORD
    });
    const token = loginResponse.data.data.access_token;
    console.log('✓ 登录成功\n');

    // 2. 添加 is_featured 字段
    console.log('正在添加 is_featured 字段到 strategies 表...');

    const fieldConfig = {
      collection: 'strategies',
      field: 'is_featured',
      type: 'boolean',
      schema: {
        default_value: false,
        is_nullable: false,
      },
      meta: {
        interface: 'boolean',
        display: 'boolean',
        display_options: {
          label: '是',
          color: '#00C897',
        },
        special: ['cast-boolean'],
        options: {
          label: '精选推荐'
        },
        translations: [
          {
            language: 'zh-CN',
            translation: '精选推荐'
          }
        ],
        width: 'half',
        note: '勾选后该策略将显示在首页精选区域',
      }
    };

    await axios.post(
      `${DIRECTUS_URL}/fields/strategies`,
      fieldConfig,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✓ is_featured 字段添加成功！\n');

    // 3. 将前 6 个策略设为精选（作为示例）
    console.log('正在设置示例精选策略...');

    const strategiesResponse = await axios.get(
      `${DIRECTUS_URL}/items/strategies?limit=6&sort=-published_at&filter[status][_eq]=published`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    const strategies = strategiesResponse.data.data;

    for (const strategy of strategies) {
      await axios.patch(
        `${DIRECTUS_URL}/items/strategies/${strategy.id}`,
        { is_featured: true },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log(`  ✓ 已将 "${strategy.title}" 设为精选`);
    }

    console.log('\n✅ 全部完成！');
    console.log('\n现在你可以在 Directus 后台编辑任何策略，勾选"精选推荐"来设置首页显示。');

  } catch (error) {
    console.error('❌ 错误:', error.response?.data || error.message);
    process.exit(1);
  }
}

addFeaturedField();
