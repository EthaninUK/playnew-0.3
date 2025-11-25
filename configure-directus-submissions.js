const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_EMAIL = 'the_uk1@outlook.com';
const DIRECTUS_PASSWORD = 'Mygcdjmyxzg2026!';

async function setupSubmissions() {
  console.log('🔐 登录 Directus...\n');

  // 登录获取 token
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

  // 1. 配置集合元数据
  console.log('📦 配置 user_submitted_plays 集合...');

  try {
    await fetch(`${DIRECTUS_URL}/collections/user_submitted_plays`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        meta: {
          icon: 'rate_review',
          note: '用户提交的玩法 - 待审核',
          display_template: '{{title}} ({{status}})',
          hidden: false,
          singleton: false,
          translations: [
            {
              language: 'zh-CN',
              translation: '玩法提交审核',
            },
          ],
          sort_field: 'created_at',
        },
      }),
    });

    console.log('✅ 集合元数据配置完成\n');
  } catch (error) {
    console.log('⚠️  集合可能不存在，尝试创建...\n');
  }

  // 2. 配置字段显示
  console.log('📝 配置字段显示...\n');

  const fields = [
    {
      field: 'status',
      meta: {
        interface: 'select-dropdown',
        display: 'labels',
        display_options: {
          choices: [
            { text: '⏳ 待审核', value: 'pending', foreground: '#000', background: '#FFF3CD' },
            { text: '✅ 已通过', value: 'approved', foreground: '#FFF', background: '#28A745' },
            { text: '❌ 已拒绝', value: 'rejected', foreground: '#FFF', background: '#DC3545' },
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
        translations: [{ language: 'zh-CN', translation: '审核状态' }],
      },
    },
    {
      field: 'title',
      meta: {
        interface: 'input',
        display: 'formatted-value',
        required: true,
        width: 'full',
        translations: [{ language: 'zh-CN', translation: '玩法标题' }],
      },
    },
    {
      field: 'category',
      meta: {
        interface: 'input',
        width: 'half',
        translations: [{ language: 'zh-CN', translation: '分类' }],
      },
    },
    {
      field: 'content',
      meta: {
        interface: 'input-rich-text-md',
        width: 'full',
        translations: [{ language: 'zh-CN', translation: '玩法内容' }],
      },
    },
    {
      field: 'credits_awarded',
      meta: {
        interface: 'input',
        display: 'formatted-value',
        width: 'half',
        note: '通过审核后奖励的积分 (1-100)',
        translations: [{ language: 'zh-CN', translation: '🎁 奖励积分' }],
      },
    },
    {
      field: 'review_notes',
      meta: {
        interface: 'input-rich-text-md',
        width: 'full',
        note: '审核意见或拒绝原因',
        translations: [{ language: 'zh-CN', translation: '📝 审核意见' }],
      },
    },
    {
      field: 'user_id',
      meta: {
        interface: 'input',
        readonly: true,
        width: 'half',
        translations: [{ language: 'zh-CN', translation: '提交用户 ID' }],
      },
    },
    {
      field: 'created_at',
      meta: {
        interface: 'datetime',
        display: 'datetime',
        display_options: { relative: true },
        readonly: true,
        width: 'half',
        translations: [{ language: 'zh-CN', translation: '⏰ 提交时间' }],
      },
    },
    {
      field: 'reviewed_at',
      meta: {
        interface: 'datetime',
        display: 'datetime',
        display_options: { relative: true },
        readonly: true,
        width: 'half',
        translations: [{ language: 'zh-CN', translation: '✅ 审核时间' }],
      },
    },
  ];

  for (const fieldConfig of fields) {
    try {
      await fetch(`${DIRECTUS_URL}/fields/user_submitted_plays/${fieldConfig.field}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fieldConfig),
      });

      console.log(`  ✅ ${fieldConfig.field} 配置完成`);
    } catch (error) {
      console.log(`  ⚠️  ${fieldConfig.field} 配置失败:`, error.message);
    }
  }

  console.log('\n🎉 配置完成！\n');
  console.log('📍 访问地址:');
  console.log('   http://localhost:8055/admin/content/user_submitted_plays\n');
  console.log('💡 审核流程:');
  console.log('   1. 在 Directus 后台打开 "玩法提交审核" 集合');
  console.log('   2. 筛选 status = "pending" 查看待审核项');
  console.log('   3. 编辑记录:');
  console.log('      - 修改 status 为 "approved" (通过) 或 "rejected" (拒绝)');
  console.log('      - 设置 credits_awarded (1-100 积分)');
  console.log('      - 填写 review_notes (审核意见/拒绝原因)');
  console.log('      - reviewed_at 会自动更新');
  console.log('   4. 保存后，用户在会员中心即可看到审核结果\n');
}

setupSubmissions().catch(console.error);
