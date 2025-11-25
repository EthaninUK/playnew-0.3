const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';
const EMAIL = 'the_uk1@outlook.com';
const PASSWORD = 'Mygcdjmyxzg2026!';

async function linkPublicRoleToPolicy() {
  try {
    console.log('🔗 关联 Public Role 到 Policy...\n');

    // 1. 登录
    const loginResponse = await axios.post(`${DIRECTUS_URL}/auth/login`, {
      email: EMAIL,
      password: PASSWORD
    });
    const token = loginResponse.data.data.access_token;
    console.log('✓ 登录成功\n');

    // 2. 获取 Public role
    const rolesResponse = await axios.get(`${DIRECTUS_URL}/roles`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const publicRole = rolesResponse.data.data.find(r => r.name === 'Public');

    if (!publicRole) {
      console.error('❌ 未找到 Public role');
      process.exit(1);
    }
    console.log(`✓ 找到 Public role: ${publicRole.id}`);
    console.log(`  当前 policies: ${JSON.stringify(publicRole.policies || [])}\n`);

    // 3. 获取 public access policy
    const policiesResponse = await axios.get(`${DIRECTUS_URL}/policies`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const publicPolicy = policiesResponse.data.data.find(p => p.name === 'Public Access' || p.id === 'abf8a154-5b1c-4a46-ac9c-7300570f4f17');

    if (!publicPolicy) {
      console.error('❌ 未找到 Public Access policy');
      process.exit(1);
    }
    console.log(`✓ 找到 Policy: ${publicPolicy.id}\n`);

    // 4. 更新 Public role，添加 policy
    console.log('更新 Public role 关联...');
    const currentPolicies = publicRole.policies || [];

    // 检查是否已经关联
    const alreadyLinked = Array.isArray(currentPolicies)
      ? currentPolicies.some(p => typeof p === 'string' ? p === publicPolicy.id : p.id === publicPolicy.id)
      : false;

    if (alreadyLinked) {
      console.log('✓ Role 已经关联到 Policy\n');
    } else {
      const updatedPolicies = [...currentPolicies, publicPolicy.id];

      await axios.patch(
        `${DIRECTUS_URL}/roles/${publicRole.id}`,
        {
          policies: updatedPolicies
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('✓ Role 已成功关联到 Policy\n');
    }

    console.log('═'.repeat(60));
    console.log('✅ 设置完成！\n');
    console.log('🌐 现在可以测试访问：');
    console.log('   curl http://localhost:8055/items/static_pages');
    console.log('   curl http://localhost:3000/page/guide\n');

  } catch (error) {
    console.error('❌ 错误:', error.response?.data || error.message);
    if (error.response?.data) {
      console.error('详细错误:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

linkPublicRoleToPolicy();
