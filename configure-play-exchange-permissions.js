const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_EMAIL = 'the_uk1@outlook.com';
const DIRECTUS_PASSWORD = 'Mygcdjmyxzg2026!';

let ACCESS_TOKEN = '';

// 登录获取 token
async function login() {
  console.log('🔐 正在登录 Directus...\n');

  try {
    const response = await axios.post(`${DIRECTUS_URL}/auth/login`, {
      email: DIRECTUS_EMAIL,
      password: DIRECTUS_PASSWORD
    });

    ACCESS_TOKEN = response.data.data.access_token;
    console.log('✅ 登录成功！\n');
    return true;
  } catch (error) {
    console.error('❌ 登录失败:', error.response?.data || error.message);
    return false;
  }
}

// 获取 Public policy ID（使用现有权限使用的 policy）
async function getPublicPolicyId() {
  try {
    // 先查看现有权限使用的 policy
    const permsResponse = await axios.get(`${DIRECTUS_URL}/permissions`, {
      headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
      params: { limit: 10 }
    });

    // 找到第一个非 null 的 policy ID
    const existingPolicyId = permsResponse.data.data.find(p => p.policy)?.policy;

    if (!existingPolicyId) {
      console.error('❌ 未找到可用的 policy');
      return null;
    }

    // 验证这个 policy 是否存在
    const policiesResponse = await axios.get(`${DIRECTUS_URL}/policies`, {
      headers: { Authorization: `Bearer ${ACCESS_TOKEN}` }
    });

    const policy = policiesResponse.data.data.find(p => p.id === existingPolicyId);
    if (!policy) {
      console.error('❌ Policy 不存在');
      return null;
    }

    console.log(`✅ 找到可用的 Policy: ${policy.name} (${policy.id})\n`);
    return existingPolicyId;
  } catch (error) {
    console.error('❌ 获取 policy 失败:', error.response?.data || error.message);
    return null;
  }
}

// 删除已存在的权限（避免重复）
async function deleteExistingPermissions(policyId, collection) {
  try {
    const response = await axios.get(`${DIRECTUS_URL}/permissions`, {
      headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
      params: {
        filter: {
          policy: { _eq: policyId },
          collection: { _eq: collection }
        }
      }
    });

    const permissions = response.data.data;
    for (const perm of permissions) {
      await axios.delete(`${DIRECTUS_URL}/permissions/${perm.id}`, {
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` }
      });
      console.log(`  🗑️  删除旧权限: ${collection} - ${perm.action}`);
    }
  } catch (error) {
    // 忽略错误，可能权限不存在
  }
}

// 创建权限
async function createPermission(policyId, collection, action, fields = null, permissions = null) {
  try {
    const permissionData = {
      policy: policyId,
      collection: collection,
      action: action,
      fields: fields || ['*'],
      permissions: permissions || {},
      validation: {}
    };

    await axios.post(`${DIRECTUS_URL}/permissions`, permissionData, {
      headers: { Authorization: `Bearer ${ACCESS_TOKEN}` }
    });

    console.log(`  ✅ ${collection}: ${action} 权限已创建`);
    return true;
  } catch (error) {
    console.error(`  ❌ ${collection}: ${action} 权限创建失败:`, error.response?.data?.errors?.[0]?.message || error.message);
    return false;
  }
}

// 配置所有权限
async function configurePermissions() {
  console.log('🔧 开始配置玩法交换系统权限...\n');

  const policyId = await getPublicPolicyId();
  if (!policyId) return;

  // 1. user_profiles 权限
  console.log('📋 配置 user_profiles 权限:');
  await deleteExistingPermissions(policyId, 'user_profiles');

  // Create - 允许创建（注册时）
  await createPermission(policyId, 'user_profiles', 'create', ['*'], {});

  // Read - 只能读取自己的 profile
  await createPermission(policyId, 'user_profiles', 'read', ['*'], {
    _and: [
      { id: { _eq: '$CURRENT_USER' } }
    ]
  });

  // Update - 只能更新自己的 profile（指定字段）
  await createPermission(policyId, 'user_profiles', 'update', [
    'credits',
    'first_draw_used',
    'referral_code'
  ], {
    _and: [
      { id: { _eq: '$CURRENT_USER' } }
    ]
  });

  console.log('');

  // 2. daily_featured_plays 权限
  console.log('📋 配置 daily_featured_plays 权限:');
  await deleteExistingPermissions(policyId, 'daily_featured_plays');

  // Read - 只读生效的精选玩法
  await createPermission(policyId, 'daily_featured_plays', 'read', ['*'], {
    _and: [
      { is_active: { _eq: true } }
    ]
  });

  console.log('');

  // 3. user_play_exchanges 权限
  console.log('📋 配置 user_play_exchanges 权限:');
  await deleteExistingPermissions(policyId, 'user_play_exchanges');

  // Create - 创建自己的交换记录
  await createPermission(policyId, 'user_play_exchanges', 'create', ['*'], {
    _and: [
      { user_id: { _eq: '$CURRENT_USER' } }
    ]
  });

  // Read - 读取自己的交换记录
  await createPermission(policyId, 'user_play_exchanges', 'read', ['*'], {
    _and: [
      { user_id: { _eq: '$CURRENT_USER' } }
    ]
  });

  console.log('');

  // 4. user_submitted_plays 权限
  console.log('📋 配置 user_submitted_plays 权限:');
  await deleteExistingPermissions(policyId, 'user_submitted_plays');

  // Create - 创建自己的提交
  await createPermission(policyId, 'user_submitted_plays', 'create', [
    'title',
    'category',
    'content',
    'user_id'
  ], {
    _and: [
      { user_id: { _eq: '$CURRENT_USER' } }
    ]
  });

  // Read - 读取自己的提交
  await createPermission(policyId, 'user_submitted_plays', 'read', ['*'], {
    _and: [
      { user_id: { _eq: '$CURRENT_USER' } }
    ]
  });

  console.log('');

  // 5. credit_transactions 权限
  console.log('📋 配置 credit_transactions 权限:');
  await deleteExistingPermissions(policyId, 'credit_transactions');

  // Read - 读取自己的交易记录
  await createPermission(policyId, 'credit_transactions', 'read', ['*'], {
    _and: [
      { user_id: { _eq: '$CURRENT_USER' } }
    ]
  });

  console.log('');

  // 6. referrals 权限
  console.log('📋 配置 referrals 权限:');
  await deleteExistingPermissions(policyId, 'referrals');

  // Create - 创建邀请记录
  await createPermission(policyId, 'referrals', 'create', [
    'referrer_id',
    'referred_id',
    'referral_code'
  ], {});

  // Read - 读取自己作为邀请人的记录
  await createPermission(policyId, 'referrals', 'read', ['*'], {
    _and: [
      { referrer_id: { _eq: '$CURRENT_USER' } }
    ]
  });

  console.log('');
  console.log('========================================');
  console.log('✅ 玩法交换系统权限配置完成！');
  console.log('========================================');
  console.log('');
  console.log('📝 已配置的表和权限:');
  console.log('  1. ✅ user_profiles - Create, Read, Update');
  console.log('  2. ✅ daily_featured_plays - Read (is_active=true)');
  console.log('  3. ✅ user_play_exchanges - Create, Read');
  console.log('  4. ✅ user_submitted_plays - Create, Read');
  console.log('  5. ✅ credit_transactions - Read');
  console.log('  6. ✅ referrals - Create, Read');
  console.log('');
  console.log('🎯 下一步:');
  console.log('  1. 实现后端 API 接口');
  console.log('  2. 前端与后端集成');
  console.log('  3. 完整流程测试');
  console.log('');
}

// 主函数
async function main() {
  const loginSuccess = await login();
  if (!loginSuccess) {
    console.log('\n⚠️  请检查 Directus 是否运行在 http://localhost:8055');
    console.log('⚠️  请检查邮箱和密码是否正确');
    return;
  }

  await configurePermissions();
}

main().catch(console.error);
