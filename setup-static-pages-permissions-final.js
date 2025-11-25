const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';
const EMAIL = 'the_uk1@outlook.com';
const PASSWORD = 'Mygcdjmyxzg2026!';

async function setupStaticPagesPermissions() {
  try {
    console.log('🔧 设置静态页面权限...\n');

    // 1. 登录
    const loginResponse = await axios.post(`${DIRECTUS_URL}/auth/login`, {
      email: EMAIL,
      password: PASSWORD
    });
    const token = loginResponse.data.data.access_token;
    console.log('✓ 登录成功\n');

    // 2. 获取或创建 Public Access Policy
    console.log('正在查找 Public Access Policy...');
    const policiesResponse = await axios.get(`${DIRECTUS_URL}/policies`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    let publicPolicy = policiesResponse.data.data.find(p => p.name === 'Public' || p.admin_access === false);

    if (!publicPolicy) {
      console.log('创建新的 Public Policy...');
      const newPolicyResponse = await axios.post(
        `${DIRECTUS_URL}/policies`,
        {
          name: 'Public Access',
          icon: 'public',
          description: 'Public access policy for published content',
          admin_access: false,
          app_access: false
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      publicPolicy = newPolicyResponse.data.data;
      console.log(`✓ 创建成功，Policy ID: ${publicPolicy.id}\n`);
    } else {
      console.log(`✓ 找到现有 Policy: ${publicPolicy.id}\n`);
    }

    // 3. 创建权限
    console.log('创建 static_pages 读取权限...');
    try {
      const permission = {
        policy: publicPolicy.id,
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
        permission,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('✓ 权限创建成功\n');
    } catch (error) {
      if (error.response?.data?.errors?.[0]?.extensions?.code === 'RECORD_NOT_UNIQUE') {
        console.log('✓ 权限已存在\n');
      } else {
        throw error;
      }
    }

    // 4. 确保 Public role 连接到这个 policy
    console.log('检查 Public role 设置...');
    const rolesResponse = await axios.get(`${DIRECTUS_URL}/roles`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    let publicRole = rolesResponse.data.data.find(r => r.name === 'Public');

    if (publicRole) {
      console.log(`✓ 找到 Public role: ${publicRole.id}`);

      // 尝试关联 role 和 policy (可能需要手动在后台操作)
      console.log('  注意：可能需要在 Directus 后台手动关联 Public role 和 policy\n');
    }

    console.log('═'.repeat(60));
    console.log('✅ 权限设置完成！\n');
    console.log('📝 后续步骤:');
    console.log('1. 访问 Directus 后台 (http://localhost:8055/admin)');
    console.log('2. 进入 Settings → Roles & Permissions');
    console.log('3. 找到 "Public" role');
    console.log('4. 确保它关联到了 "Public Access" policy');
    console.log('5. 确认 static_pages 集合有 READ 权限\n');
    console.log('🌐 测试页面:');
    console.log('   - http://localhost:3000/page/guide');
    console.log('   - http://localhost:3000/page/faq\n');

  } catch (error) {
    console.error('❌ 错误:', error.response?.data || error.message);
    if (error.response?.data) {
      console.error('详细错误:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

setupStaticPagesPermissions();
