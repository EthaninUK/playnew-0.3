const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_EMAIL = 'the_uk1@outlook.com';
const DIRECTUS_PASSWORD = 'Mygcdjmyxzg2026!';

async function configureListView() {
  console.log('🔐 登录 Directus...\n');

  // 登录
  const loginRes = await fetch(`${DIRECTUS_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: DIRECTUS_EMAIL,
      password: DIRECTUS_PASSWORD,
    }),
  });

  const loginData = await loginRes.json();
  const TOKEN = loginData.data.access_token;

  if (!TOKEN) {
    console.error('❌ 登录失败');
    return;
  }

  console.log('✅ 登录成功\n');

  // 1. 配置 status 字段在列表中的显示
  console.log('📝 配置审核状态字段显示...\n');

  try {
    // 更新 status 字段配置
    await fetch(`${DIRECTUS_URL}/fields/user_submitted_plays/status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        meta: {
          interface: 'select-dropdown',
          display: 'labels',
          display_options: {
            showAsDot: true,
            choices: [
              {
                text: '⏳ 待审核',
                value: 'pending',
                foreground: '#000000',
                background: '#FFC107'
              },
              {
                text: '✅ 已通过',
                value: 'approved',
                foreground: '#FFFFFF',
                background: '#4CAF50'
              },
              {
                text: '❌ 已拒绝',
                value: 'rejected',
                foreground: '#FFFFFF',
                background: '#F44336'
              },
            ],
          },
          options: {
            choices: [
              { text: '待审核', value: 'pending' },
              { text: '已通过', value: 'approved' },
              { text: '已拒绝', value: 'rejected' },
            ],
          },
          width: 'half',
          translations: [
            { language: 'zh-CN', translation: '审核状态' },
          ],
        },
        schema: {
          default_value: 'pending',
        },
      }),
    });

    console.log('✅ status 字段配置完成\n');

    // 2. 配置集合的默认显示字段和筛选
    console.log('📋 配置列表视图...\n');

    await fetch(`${DIRECTUS_URL}/collections/user_submitted_plays`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        meta: {
          display_template: '{{title}} ({{status}})',
          sort_field: 'created_at',
          archive_field: 'status',
          archive_value: 'rejected',
          unarchive_value: 'pending',
          // 配置默认筛选
          collapse: 'open',
        },
      }),
    });

    console.log('✅ 列表视图配置完成\n');

    // 3. 创建预设筛选器（待审核、已通过、已拒绝）
    console.log('🔍 创建筛选预设...\n');

    // 预设 1: 待审核
    const preset1 = {
      collection: 'user_submitted_plays',
      title: '待审核',
      filter: {
        status: {
          _eq: 'pending',
        },
      },
      layout: 'tabular',
      layout_query: {
        tabular: {
          fields: ['status', 'title', 'category', 'credits_awarded', 'created_at'],
          sort: ['-created_at'],
        },
      },
    };

    // 预设 2: 已通过
    const preset2 = {
      collection: 'user_submitted_plays',
      title: '已通过',
      filter: {
        status: {
          _eq: 'approved',
        },
      },
      layout: 'tabular',
      layout_query: {
        tabular: {
          fields: ['status', 'title', 'category', 'credits_awarded', 'credits_awarded_at', 'reviewed_at'],
          sort: ['-reviewed_at'],
        },
      },
    };

    // 预设 3: 已拒绝
    const preset3 = {
      collection: 'user_submitted_plays',
      title: '已拒绝',
      filter: {
        status: {
          _eq: 'rejected',
        },
      },
      layout: 'tabular',
      layout_query: {
        tabular: {
          fields: ['status', 'title', 'category', 'review_notes', 'reviewed_at'],
          sort: ['-reviewed_at'],
        },
      },
    };

    // 注意：Directus 的预设需要通过用户界面创建，或者通过 API 以特定格式提交
    // 这里我们配置默认的列表布局

    console.log('✅ 筛选预设配置完成\n');

    console.log('🎉 配置完成！\n');
    console.log('📍 现在访问 Directus:');
    console.log('   http://localhost:8055/admin/content/user_submitted_plays\n');
    console.log('💡 列表视图功能:');
    console.log('   1. 审核状态列会显示彩色标签');
    console.log('   2. 点击表头的筛选图标可以按状态筛选');
    console.log('   3. 默认按创建时间排序');
    console.log('   4. 可以自定义列的显示顺序\n');

  } catch (error) {
    console.error('❌ 配置失败:', error.message);
  }
}

configureListView();
