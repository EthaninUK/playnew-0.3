const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_EMAIL = 'the_uk1@outlook.com';
const DIRECTUS_PASSWORD = 'Mygcdjmyxzg2026!';

async function fixStatusDisplay() {
  console.log('🔐 登录 Directus...\n');

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

  try {
    // 1. 首先检查当前字段配置
    console.log('🔍 检查 status 字段配置...\n');

    const fieldRes = await fetch(`${DIRECTUS_URL}/fields/user_submitted_plays/status`, {
      headers: { 'Authorization': `Bearer ${TOKEN}` },
    });

    const fieldData = await fieldRes.json();
    console.log('当前 status 字段配置:', JSON.stringify(fieldData.data?.meta, null, 2));
    console.log('');

    // 2. 更新 status 字段，确保在列表中可见
    console.log('📝 更新 status 字段配置...\n');

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
                text: '待审核',
                value: 'pending',
                foreground: '#000000',
                background: '#FFC107'
              },
              {
                text: '已通过',
                value: 'approved',
                foreground: '#FFFFFF',
                background: '#4CAF50'
              },
              {
                text: '已拒绝',
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
          hidden: false, // 确保不隐藏
          readonly: false,
          translations: [
            { language: 'zh-CN', translation: '审核状态' },
          ],
        },
      }),
    });

    console.log('✅ status 字段更新完成\n');

    // 3. 获取当前用户的预设配置
    console.log('🔍 检查预设配置...\n');

    const presetsRes = await fetch(`${DIRECTUS_URL}/presets?filter[collection][_eq]=user_submitted_plays`, {
      headers: { 'Authorization': `Bearer ${TOKEN}` },
    });

    const presetsData = await presetsRes.json();
    console.log(`找到 ${presetsData.data?.length || 0} 个预设配置\n`);

    // 4. 创建或更新默认预设，确保 status 字段显示在列表中
    console.log('📋 配置列表布局（包含 status 列）...\n');

    // 删除旧预设
    if (presetsData.data && presetsData.data.length > 0) {
      for (const preset of presetsData.data) {
        await fetch(`${DIRECTUS_URL}/presets/${preset.id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${TOKEN}` },
        });
      }
      console.log('✅ 已删除旧预设\n');
    }

    // 创建新预设，明确包含 status 字段
    const newPreset = {
      collection: 'user_submitted_plays',
      layout: 'tabular',
      layout_query: {
        tabular: {
          fields: [
            'status',           // 审核状态（第一列）
            'title',            // 玩法标题
            'category',         // 分类
            'credits_awarded',  // 奖励积分
            'created_at',       // 提交时间
            'credits_awarded_at', // 积分发放时间
          ],
          sort: ['-created_at'],
          page: 1,
        },
      },
      layout_options: {
        tabular: {
          widths: {
            status: 120,
            title: 250,
            category: 150,
            credits_awarded: 100,
            created_at: 180,
            credits_awarded_at: 180,
          },
        },
      },
    };

    const createPresetRes = await fetch(`${DIRECTUS_URL}/presets`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPreset),
    });

    const createResult = await createPresetRes.json();

    if (createResult.data) {
      console.log('✅ 新预设创建成功\n');
    } else {
      console.log('⚠️  预设创建响应:', JSON.stringify(createResult, null, 2));
    }

    console.log('🎉 配置完成！\n');
    console.log('📍 重要步骤:');
    console.log('   1. 刷新 Directus 页面（Ctrl+Shift+R 或 Cmd+Shift+R）');
    console.log('   2. 清除浏览器缓存');
    console.log('   3. 访问: http://localhost:8055/admin/content/user_submitted_plays\n');
    console.log('💡 如果还是看不到，请手动调整列:');
    console.log('   1. 点击表格右上角的 "..." 按钮');
    console.log('   2. 选择 "列设置" 或 "Customize Columns"');
    console.log('   3. 勾选 "status" (审核状态) 字段');
    console.log('   4. 拖动到第一列位置\n');

  } catch (error) {
    console.error('❌ 错误:', error.message);
    console.error(error);
  }
}

fixStatusDisplay();
