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

    // 2. 获取 public role ID
    const rolesResponse = await axios.get(`${DIRECTUS_URL}/roles`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const publicRole = rolesResponse.data.data.find(role => role.name === 'Public');

    if (!publicRole) {
      console.error('❌ 未找到 Public 角色');
      process.exit(1);
    }

    console.log(`✓ 找到 Public 角色: ${publicRole.id}\n`);

    // 3. 检查是否已存在权限
    console.log('检查现有权限...');
    const existingPermissions = await axios.get(
      `${DIRECTUS_URL}/permissions?filter[collection][_eq]=static_pages&filter[role][_eq]=${publicRole.id}`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );

    if (existingPermissions.data.data && existingPermissions.data.data.length > 0) {
      console.log('✓ 权限已存在，删除旧权限...');
      for (const perm of existingPermissions.data.data) {
        await axios.delete(`${DIRECTUS_URL}/permissions/${perm.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log(`  ✓ 已删除权限 ${perm.id}`);
      }
      console.log('');
    }

    // 4. 创建新的读取权限 (允许公开访问已发布的静态页面)
    console.log('创建新的读取权限...');
    const newPermission = {
      role: publicRole.id,
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

    console.log('═'.repeat(60));
    console.log('✅ 静态页面权限配置完成！\n');
    console.log('现在可以公开访问以下页面：');
    console.log('   - /page/guide (使用指南)');
    console.log('   - /page/faq (常见问题)');
    console.log('   - /page/risk (风险提示)');
    console.log('   - /page/terms (服务条款)');
    console.log('   - /page/privacy (隐私政策)');
    console.log('   - /page/disclaimer (免责声明)\n');

  } catch (error) {
    console.error('❌ 错误:', error.response?.data || error.message);
    if (error.response?.data) {
      console.error('详细错误:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

configureStaticPagesPermissions();
