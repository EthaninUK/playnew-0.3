const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';
const EMAIL = 'the_uk1@outlook.com';
const PASSWORD = 'Mygcdjmyxzg2026!';

async function fixStrategiesTableView() {
  try {
    console.log('🔧 修复策略表格视图配置...\n');

    // 1. 登录
    const loginResponse = await axios.post(`${DIRECTUS_URL}/auth/login`, {
      email: EMAIL,
      password: PASSWORD
    });
    const token = loginResponse.data.data.access_token;
    console.log('✓ 登录成功\n');

    // 2. 获取用户信息
    const meResponse = await axios.get(`${DIRECTUS_URL}/users/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const userId = meResponse.data.data.id;
    console.log('✓ 用户 ID:', userId, '\n');

    // 3. 更新集合配置，设置默认的列布局
    console.log('正在更新集合配置...');

    const collectionConfig = {
      meta: {
        collection: 'strategies',
        icon: 'rocket_launch',
        note: null,
        display_template: '{{title}}',
        hidden: false,
        singleton: false,
        translations: [
          {
            language: 'zh-CN',
            translation: '策略',
            singular: '策略',
            plural: '策略'
          }
        ],
        archive_field: 'status',
        archive_app_filter: true,
        archive_value: 'archived',
        unarchive_value: 'draft',
        sort_field: 'published_at',
        accountability: 'all',
        item_duplication_fields: null,
        sort: null,
        group: null,
        collapse: 'open'
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

    // 4. 获取并删除用户的个人视图偏好设置（如果存在）
    console.log('正在检查用户偏好设置...');
    try {
      const presetsResponse = await axios.get(
        `${DIRECTUS_URL}/presets?filter[collection][_eq]=strategies&filter[user][_eq]=${userId}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (presetsResponse.data.data && presetsResponse.data.data.length > 0) {
        console.log(`找到 ${presetsResponse.data.data.length} 个用户偏好设置，正在删除...`);

        for (const preset of presetsResponse.data.data) {
          await axios.delete(
            `${DIRECTUS_URL}/presets/${preset.id}`,
            {
              headers: { 'Authorization': `Bearer ${token}` }
            }
          );
          console.log(`  ✓ 已删除偏好设置 ${preset.id}`);
        }
      } else {
        console.log('  未找到需要删除的偏好设置');
      }
    } catch (error) {
      console.log('  未找到用户偏好设置（正常情况）');
    }
    console.log('');

    // 5. 创建新的默认视图偏好
    console.log('正在创建新的默认视图...');

    const newPreset = {
      collection: 'strategies',
      user: userId,
      role: null,
      layout: 'tabular',
      layout_query: {
        tabular: {
          fields: ['title', 'is_featured', 'category', 'status', 'published_at'],
          sort: ['-published_at'],
          limit: 50
        }
      },
      layout_options: {
        tabular: {
          widths: {
            title: 300,
            is_featured: 120,
            category: 150,
            status: 100,
            published_at: 180
          }
        }
      },
      search: null,
      filter: null
    };

    await axios.post(
      `${DIRECTUS_URL}/presets`,
      newPreset,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('✓ 新的默认视图创建成功\n');

    // 6. 确保 title 字段的配置正确
    console.log('正在确认 title 字段配置...');

    const titleFieldUpdate = {
      meta: {
        interface: 'input',
        special: null,
        options: {
          placeholder: '输入策略标题',
          trim: true
        },
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
        required: true,
        group: null,
        note: '策略的标题，会显示在列表和详情页'
      }
    };

    await axios.patch(
      `${DIRECTUS_URL}/fields/strategies/title`,
      titleFieldUpdate,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('✓ title 字段配置确认完成\n');

    console.log('═'.repeat(60));
    console.log('✅ 修复完成！\n');
    console.log('📝 下一步操作：');
    console.log('1. 完全刷新 Directus 页面（Ctrl+Shift+R 或 Cmd+Shift+R）');
    console.log('2. 或者退出登录后重新登录');
    console.log('3. 进入"内容" -> "策略"页面');
    console.log('4. 现在应该能看到以下列：');
    console.log('   - 标题（Title）');
    console.log('   - 精选推荐（is_featured）');
    console.log('   - 分类（Category）');
    console.log('   - 状态（Status）');
    console.log('   - 发布时间（Published At）');
    console.log('\n💡 提示：如果还是看不到，请尝试：');
    console.log('   - 点击右上角的列设置按钮（三个点或齿轮图标）');
    console.log('   - 确保勾选了"标题"列');
    console.log('   - 保存设置\n');

  } catch (error) {
    console.error('❌ 错误:', error.response?.data || error.message);
    if (error.response?.data) {
      console.error('详细错误:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

fixStrategiesTableView();
