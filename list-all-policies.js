const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_EMAIL = 'the_uk1@outlook.com';
const DIRECTUS_PASSWORD = 'Mygcdjmyxzg2026!';

async function listPolicies() {
  // 登录
  const loginRes = await axios.post(`${DIRECTUS_URL}/auth/login`, {
    email: DIRECTUS_EMAIL,
    password: DIRECTUS_PASSWORD
  });

  const token = loginRes.data.data.access_token;

  // 获取所有 policies
  const policiesRes = await axios.get(`${DIRECTUS_URL}/policies`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  console.log('\n📋 所有 Policies:\n');
  policiesRes.data.data.forEach(policy => {
    console.log(`名称: ${policy.name}`);
    console.log(`ID: ${policy.id}`);
    console.log(`Admin Access: ${policy.admin_access}`);
    console.log(`Icon: ${policy.icon || 'N/A'}`);
    console.log(`Description: ${policy.description || 'N/A'}`);
    console.log('---');
  });

  // 获取 Public 角色信息
  const rolesRes = await axios.get(`${DIRECTUS_URL}/roles`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const publicRole = rolesRes.data.data.find(r => r.name === 'Public');

  console.log('\n👤 Public 角色信息:\n');
  console.log(`角色 ID: ${publicRole.id}`);
  console.log(`角色名称: ${publicRole.name}`);
  console.log(`关联的 Policies: ${JSON.stringify(publicRole.policies)}`);

  // 检查 Public 角色的 policy 是否在 policies 列表中
  if (publicRole.policies && publicRole.policies.length > 0) {
    const policyId = publicRole.policies[0];
    const policyExists = policiesRes.data.data.find(p => p.id === policyId);

    console.log(`\n🔍 检查 Policy ${policyId}:`);
    if (policyExists) {
      console.log(`✅ Policy 存在: ${policyExists.name}`);
    } else {
      console.log(`❌ Policy 不存在（可能是权限问题）`);
    }
  }

  // 查看现有权限的 policy 引用
  console.log('\n📊 现有权限使用的 Policy:\n');
  const permsRes = await axios.get(`${DIRECTUS_URL}/permissions`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { limit: 5 }
  });

  const usedPolicies = new Set();
  permsRes.data.data.forEach(perm => {
    usedPolicies.add(perm.policy);
  });

  usedPolicies.forEach(policyId => {
    const policy = policiesRes.data.data.find(p => p.id === policyId);
    if (policy) {
      console.log(`✅ ${policyId} - ${policy.name}`);
    } else {
      console.log(`⚠️  ${policyId} - (无法找到对应的 policy)`);
    }
  });
}

listPolicies().catch(console.error);
