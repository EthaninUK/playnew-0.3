const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';
const EMAIL = 'the_uk1@outlook.com';
const PASSWORD = 'Mygcdjmyxzg2026!';

async function configureStaticPagesPermissions() {
  try {
    console.log('🔧 配置静态页面公开访问权限...\n');

    // 1. 登录获取 token
    const loginResponse = await axios.post(`${DIRECTUS_URL}/auth/login`, {
      email: EMAIL,
      password: PASSWORD
    });
    const token = loginResponse.data.data.access_token;
    console.log('✓ 登录成功\n');

    // 2. 直接创建权限 (使用 public role 的固定 UUID)
    // Directus 的 public role 通常有一个固定的 ID
    console.log('创建静态页面读取权限...');

    try {
      const newPermission = {
        role: null, // null = public role in Directus
        collection: 'static_pages',
        action: 'read',
        permissions: {
          status: {
            _eq: 'published'
          }
        },
        fields: ['*']
      };

      await axios.post(
        `${DIRECTUS_URL}/permissions`,
        newPermission,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('✓ 读取权限创建成功\n');
    } catch (error) {
      if (error.response?.data?.errors?.[0]?.extensions?.code === 'RECORD_NOT_UNIQUE') {
        console.log('✓ 权限已存在\n');
      } else {
        throw error;
      }
    }

    console.log('═'.repeat(60));
    console.log('✅ 静态页面权限配置完成！\n');
    console.log('现在可以公开访问以下页面：');
    console.log('   - http://localhost:3000/page/guide');
    console.log('   - http://localhost:3000/page/faq');
    console.log('   - http://localhost:3000/page/risk');
    console.log('   - http://localhost:3000/page/terms');
    console.log('   - http://localhost:3000/page/privacy');
    console.log('   - http://localhost:3000/page/disclaimer\n');

  } catch (error) {
    console.error('❌ 错误:', error.response?.data || error.message);
    if (error.response?.data) {
      console.error('详细错误:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

configureStaticPagesPermissions();
