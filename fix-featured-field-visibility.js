const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';
const EMAIL = 'the_uk1@outlook.com';
const PASSWORD = 'Mygcdjmyxzg2026!';

async function fixFeaturedFieldVisibility() {
  try {
    // 1. 登录
    console.log('正在登录 Directus...');
    const loginResponse = await axios.post(`${DIRECTUS_URL}/auth/login`, {
      email: EMAIL,
      password: PASSWORD
    });
    const token = loginResponse.data.data.access_token;
    console.log('✓ 登录成功\n');

    // 2. 检查字段是否存在
    console.log('正在检查 is_featured 字段...');
    try {
      const fieldResponse = await axios.get(
        `${DIRECTUS_URL}/fields/strategies/is_featured`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      console.log('✓ 字段已存在\n');
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('! 字段不存在，正在创建...\n');
        // 创建字段
        await axios.post(
          `${DIRECTUS_URL}/fields/strategies`,
          {
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
              special: ['cast-boolean'],
              options: {
                label: '精选推荐'
              },
              width: 'half',
              note: '勾选后该策略将显示在首页精选区域',
            }
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        console.log('✓ 字段创建成功\n');
      }
    }

    // 3. 更新字段元数据，确保可见且在正确位置
    console.log('正在更新字段配置...');
    const fieldUpdateConfig = {
      collection: 'strategies',
      field: 'is_featured',
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
        width: 'half',
        note: '勾选后该策略将显示在首页精选区域',
        hidden: false,  // 确保不隐藏
        readonly: false, // 确保可编辑
        required: false,
        sort: 10, // 设置排序位置，显示在较前面
        group: null, // 不放在任何分组中
      }
    };

    await axios.patch(
      `${DIRECTUS_URL}/fields/strategies/is_featured`,
      fieldUpdateConfig,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('✓ 字段配置更新成功\n');

    // 4. 获取当前所有字段，显示 is_featured 的位置
    const allFieldsResponse = await axios.get(
      `${DIRECTUS_URL}/fields/strategies`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );

    const fields = allFieldsResponse.data.data;
    const featuredField = fields.find(f => f.field === 'is_featured');

    if (featuredField) {
      console.log('✅ is_featured 字段配置信息：');
      console.log('   - 字段名: is_featured');
      console.log('   - 显示名称:', featuredField.meta?.options?.label || '精选推荐');
      console.log('   - 是否隐藏:', featuredField.meta?.hidden || false);
      console.log('   - 是否只读:', featuredField.meta?.readonly || false);
      console.log('   - 排序位置:', featuredField.meta?.sort || 'default');
      console.log('\n提示：');
      console.log('1. 刷新 Directus 页面（Ctrl+R 或 Cmd+R）');
      console.log('2. 字段应该显示在策略编辑表单的顶部区域');
      console.log('3. 如果还是看不到，尝试退出登录后重新登录');
    }

  } catch (error) {
    console.error('❌ 错误:', error.response?.data || error.message);
    process.exit(1);
  }
}

fixFeaturedFieldVisibility();
