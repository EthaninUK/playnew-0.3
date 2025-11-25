const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_EMAIL = 'the_uk1@outlook.com';
const DIRECTUS_PASSWORD = 'Mygcdjmyxzg2026!';

async function addField() {
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

  // 添加 credits_awarded_at 字段
  console.log('📝 添加 credits_awarded_at 字段...');

  try {
    const response = await fetch(`${DIRECTUS_URL}/fields/user_submitted_plays`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        field: 'credits_awarded_at',
        type: 'timestamp',
        meta: {
          interface: 'datetime',
          display: 'datetime',
          display_options: {
            relative: true,
          },
          readonly: true,
          width: 'half',
          hidden: false,
          translations: [
            { language: 'zh-CN', translation: '💵 积分发放时间' },
          ],
          note: '积分发放到账户的时间（系统自动记录）',
        },
        schema: {
          is_nullable: true,
        },
      }),
    });

    const result = await response.json();

    if (result.errors) {
      console.error('❌ 添加字段失败:', result.errors[0].message);
    } else {
      console.log('✅ 字段添加成功\n');
    }

    // 更新字段配置
    console.log('📝 配置字段显示...');

    await fetch(`${DIRECTUS_URL}/fields/user_submitted_plays/credits_awarded_at`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        meta: {
          interface: 'datetime',
          display: 'datetime',
          display_options: {
            relative: true,
          },
          readonly: true,
          width: 'half',
          hidden: false,
          translations: [
            { language: 'zh-CN', translation: '💵 积分发放时间' },
          ],
          note: '积分发放到账户的时间（系统自动记录）',
        },
      }),
    });

    console.log('✅ 字段配置完成\n');

    console.log('🎉 设置完成！\n');
    console.log('📍 现在运行自动发放脚本:');
    console.log('   node /Users/m1/PlayNew_0.3/auto-award-credits-daemon.js\n');

  } catch (error) {
    console.error('❌ 错误:', error.message);
  }
}

addField();
