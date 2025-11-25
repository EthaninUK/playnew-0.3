const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';
const EMAIL = 'the_uk1@outlook.com';
const PASSWORD = 'Mygcdjmyxzg2026!';

async function fixStrategiesListDisplay() {
  try {
    // 1. 登录
    console.log('正在登录 Directus...');
    const loginResponse = await axios.post(`${DIRECTUS_URL}/auth/login`, {
      email: EMAIL,
      password: PASSWORD
    });
    const token = loginResponse.data.data.access_token;
    console.log('✓ 登录成功\n');

    // 2. 获取 strategies 集合的配置
    console.log('正在获取 strategies 集合配置...');
    const collectionResponse = await axios.get(
      `${DIRECTUS_URL}/collections/strategies`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );

    // 3. 更新集合的显示模板，确保显示标题
    console.log('正在更新集合显示配置...');

    const collectionConfig = {
      collection: 'strategies',
      meta: {
        ...collectionResponse.data.data.meta,
        display_template: '{{title}}', // 设置显示模板为标题
        item_duplication_fields: null,
        sort: null,
        sort_field: 'published_at',
        archive_field: null,
        archive_value: null,
        unarchive_value: null,
        translations: [
          {
            language: 'zh-CN',
            translation: '策略',
            singular: '策略',
            plural: '策略'
          }
        ]
      }
    };

    await axios.patch(
      `${DIRECTUS_URL}/collections/strategies`,
      collectionConfig,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('✓ 集合配置更新成功\n');

    // 4. 确保标题字段在列表中可见
    console.log('正在配置字段显示...');

    const titleFieldConfig = {
      collection: 'strategies',
      field: 'title',
      meta: {
        interface: 'input',
        options: null,
        display: 'raw',
        display_options: null,
        readonly: false,
        hidden: false,
        sort: 1,
        width: 'full',
        translations: [
          {
            language: 'zh-CN',
            translation: '标题'
          }
        ],
        note: '策略标题'
      }
    };

    await axios.patch(
      `${DIRECTUS_URL}/fields/strategies/title`,
      titleFieldConfig,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('✓ 标题字段配置成功\n');

    // 5. 配置 is_featured 字段在列表中的显示
    const featuredFieldConfig = {
      collection: 'strategies',
      field: 'is_featured',
      meta: {
        interface: 'boolean',
        display: 'boolean',
        display_options: {
          label: '精选',
          color: '#00C897',
        },
        special: ['cast-boolean'],
        options: {
          label: '精选推荐'
        },
        width: 'half',
        hidden: false,
        readonly: false,
        sort: 15,
        translations: [
          {
            language: 'zh-CN',
            translation: '精选推荐'
          }
        ],
        note: '勾选后该策略将显示在首页精选区域'
      }
    };

    await axios.patch(
      `${DIRECTUS_URL}/fields/strategies/is_featured`,
      featuredFieldConfig,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('✓ 精选字段配置成功\n');

    console.log('✅ 全部完成！\n');
    console.log('请执行以下操作：');
    console.log('1. 刷新 Directus 页面（Ctrl+R 或 Cmd+R）');
    console.log('2. 现在应该可以同时看到"标题"和"精选推荐"列');
    console.log('3. 点击任意策略进入编辑页面');
    console.log('4. 在编辑页面中可以勾选"精选推荐"字段\n');

  } catch (error) {
    console.error('❌ 错误:', error.response?.data || error.message);
    process.exit(1);
  }
}

fixStrategiesListDisplay();
