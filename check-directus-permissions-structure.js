const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_EMAIL = 'the_uk1@outlook.com';
const DIRECTUS_PASSWORD = 'Mygcdjmyxzg2026!';

async function checkStructure() {
  // 登录
  const loginRes = await axios.post(`${DIRECTUS_URL}/auth/login`, {
    email: DIRECTUS_EMAIL,
    password: DIRECTUS_PASSWORD
  });

  const token = loginRes.data.data.access_token;

  // 查看现有的权限结构
  console.log('🔍 检查现有权限结构:\n');

  const permsRes = await axios.get(`${DIRECTUS_URL}/permissions`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { limit: 5 }
  });

  console.log('现有权限示例:');
  console.log(JSON.stringify(permsRes.data.data[0], null, 2));

  // 查看 policies
  console.log('\n\n🔍 检查 policies:\n');
  const policiesRes = await axios.get(`${DIRECTUS_URL}/policies`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  console.log('现有 policies:');
  policiesRes.data.data.forEach(policy => {
    console.log(`  - ${policy.name} (ID: ${policy.id}) - admin_access: ${policy.admin_access}`);
  });

  // 查看 Public 角色关联的 policy
  console.log('\n\n🔍 检查 Public 角色:\n');
  const rolesRes = await axios.get(`${DIRECTUS_URL}/roles`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const publicRole = rolesRes.data.data.find(r => r.name === 'Public');
  console.log('Public 角色信息:');
  console.log(JSON.stringify(publicRole, null, 2));
}

checkStructure().catch(console.error);
