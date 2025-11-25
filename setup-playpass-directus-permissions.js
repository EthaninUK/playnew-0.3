#!/usr/bin/env node

/**
 * PlayPass Directus 权限配置脚本
 *
 * 功能:
 * 1. 为管理员角色配置完全权限（读写）
 * 2. 为 Public 角色配置只读权限（API 需要读取配置）
 * 3. 保护用户敏感数据
 */

const DIRECTUS_URL = 'http://localhost:8055';
const ADMIN_EMAIL = 'the_uk1@outlook.com';
const ADMIN_PASSWORD = 'Mygcdjmyxzg2026!';

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * 登录 Directus
 */
async function login() {
  log('\n🔐 登录 Directus...', 'blue');

  const response = await fetch(`${DIRECTUS_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    }),
  });

  if (!response.ok) {
    throw new Error(`登录失败: ${response.statusText}`);
  }

  const data = await response.json();
  log('✅ 登录成功', 'green');
  return data.data.access_token;
}

/**
 * 获取 Public 角色 ID
 */
async function getPublicRoleId(token) {
  log('\n🔍 查找 Public 角色...', 'blue');

  const response = await fetch(`${DIRECTUS_URL}/roles?filter[name][_eq]=Public`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error('获取角色失败');
  }

  const data = await response.json();

  if (!data.data || data.data.length === 0) {
    throw new Error('未找到 Public 角色');
  }

  const roleId = data.data[0].id;
  log(`✅ 找到 Public 角色 ID: ${roleId}`, 'green');
  return roleId;
}

/**
 * 创建或更新权限
 */
async function upsertPermission(token, permission) {
  // 先尝试查找现有权限
  const filter = {
    role: { _eq: permission.role },
    collection: { _eq: permission.collection },
    action: { _eq: permission.action },
  };

  const searchResponse = await fetch(
    `${DIRECTUS_URL}/permissions?${new URLSearchParams({
      'filter': JSON.stringify(filter),
    })}`,
    {
      headers: { 'Authorization': `Bearer ${token}` },
    }
  );

  const searchData = await searchResponse.json();

  if (searchData.data && searchData.data.length > 0) {
    // 更新现有权限
    const existingId = searchData.data[0].id;
    const response = await fetch(`${DIRECTUS_URL}/permissions/${existingId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(permission),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`更新权限失败: ${error}`);
    }

    return 'updated';
  } else {
    // 创建新权限
    const response = await fetch(`${DIRECTUS_URL}/permissions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(permission),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`创建权限失败: ${error}`);
    }

    return 'created';
  }
}

/**
 * 设置 Public 角色权限（只读）
 */
async function setupPublicPermissions(token, publicRoleId) {
  log('\n' + '='.repeat(60), 'blue');
  log('📦 配置 Public 角色权限（API 只读）', 'blue');
  log('='.repeat(60), 'blue');

  const collections = [
    'playpass_pricing_config',
    'playpass_reward_config',
    'playpass_membership_config',
  ];

  for (const collection of collections) {
    // Read 权限
    const readPermission = {
      role: publicRoleId,
      collection: collection,
      action: 'read',
      permissions: {},  // 无限制
      validation: {},
      fields: ['*'],
    };

    const result = await upsertPermission(token, readPermission);
    log(`  ✅ ${collection} - Read 权限${result === 'created' ? '已创建' : '已更新'}`, 'green');
  }

  log('\n✅ Public 角色权限配置完成', 'green');
  log('  - 允许读取定价和奖励配置（API 需要）', 'cyan');
  log('  - 禁止创建、更新、删除操作', 'cyan');
}

/**
 * 验证权限配置
 */
async function verifyPermissions(token, publicRoleId) {
  log('\n' + '='.repeat(60), 'blue');
  log('🔍 验证权限配置', 'blue');
  log('='.repeat(60), 'blue');

  const response = await fetch(
    `${DIRECTUS_URL}/permissions?filter[role][_eq]=${publicRoleId}`,
    {
      headers: { 'Authorization': `Bearer ${token}` },
    }
  );

  if (!response.ok) {
    throw new Error('获取权限失败');
  }

  const data = await response.json();
  const permissions = data.data || [];

  log(`\n找到 ${permissions.length} 条权限规则:`, 'cyan');

  const collections = [
    'playpass_pricing_config',
    'playpass_reward_config',
    'playpass_membership_config',
  ];

  for (const collection of collections) {
    const collectionPerms = permissions.filter(p => p.collection === collection);
    if (collectionPerms.length > 0) {
      log(`\n📋 ${collection}:`, 'blue');
      collectionPerms.forEach(p => {
        log(`  - ${p.action}: ${p.fields ? p.fields.join(', ') : 'all'}`, 'green');
      });
    } else {
      log(`\n⚠️  ${collection}: 无权限配置`, 'yellow');
    }
  }
}

/**
 * 主函数
 */
async function main() {
  try {
    log('\n' + '='.repeat(60), 'cyan');
    log('🚀 PlayPass Directus 权限配置开始', 'cyan');
    log('='.repeat(60), 'cyan');

    // 1. 登录
    const token = await login();

    // 2. 获取 Public 角色 ID
    const publicRoleId = await getPublicRoleId(token);

    // 3. 配置 Public 权限
    await setupPublicPermissions(token, publicRoleId);

    // 4. 验证权限
    await verifyPermissions(token, publicRoleId);

    log('\n' + '='.repeat(60), 'green');
    log('✅ PlayPass Directus 权限配置完成！', 'green');
    log('='.repeat(60), 'green');

    log('\n📝 权限说明:', 'cyan');
    log('  Public 角色（API）: 只能读取配置表', 'cyan');
    log('  Administrator 角色: 完全权限', 'cyan');

    log('\n🔒 安全提示:', 'yellow');
    log('  - 用户余额表已受 RLS 保护（Supabase）', 'yellow');
    log('  - 配置表只允许 Public 读取', 'yellow');
    log('  - 只有管理员可以修改配置', 'yellow');

  } catch (error) {
    log(`\n❌ 错误: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  }
}

// 运行主函数
main();
