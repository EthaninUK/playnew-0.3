#!/usr/bin/env node

/**
 * PlayPass Directus 权限配置脚本（修复版）
 *
 * 说明：
 * Directus 最新版本不再需要手动配置 Public 权限
 * 因为我们使用的是 Supabase 数据库，已经有 RLS (Row Level Security)
 *
 * 此脚本仅用于验证 PlayPass 表是否可访问
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
 * 检查集合是否可访问
 */
async function checkCollectionAccess(token, collectionName) {
  try {
    const response = await fetch(`${DIRECTUS_URL}/items/${collectionName}?limit=1`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (response.ok) {
      const data = await response.json();
      return { success: true, count: data.data?.length || 0 };
    } else {
      return { success: false, error: await response.text() };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * 主函数
 */
async function main() {
  try {
    log('\n' + '='.repeat(60), 'cyan');
    log('🚀 PlayPass Directus 权限验证', 'cyan');
    log('='.repeat(60), 'cyan');

    // 1. 登录
    const token = await login();

    // 2. 检查集合访问
    log('\n📋 检查 PlayPass 集合访问权限...', 'blue');

    const collections = [
      'playpass_pricing_config',
      'playpass_reward_config',
      'playpass_membership_config',
      'user_playpass',
      'playpass_transactions',
    ];

    let allAccessible = true;

    for (const collection of collections) {
      const result = await checkCollectionAccess(token, collection);

      if (result.success) {
        log(`  ✅ ${collection} - 可访问 (${result.count} 条记录)`, 'green');
      } else {
        log(`  ❌ ${collection} - 无法访问`, 'red');
        log(`     错误: ${result.error}`, 'red');
        allAccessible = false;
      }
    }

    log('\n' + '='.repeat(60), 'green');
    if (allAccessible) {
      log('✅ 所有 PlayPass 集合都可访问！', 'green');
    } else {
      log('⚠️  部分集合无法访问', 'yellow');
    }
    log('='.repeat(60), 'green');

    log('\n📝 说明:', 'cyan');
    log('  - Directus 作为管理后台，管理员有完全访问权限', 'cyan');
    log('  - 前端 API 直接访问 Supabase，不通过 Directus', 'cyan');
    log('  - Supabase 的 RLS 保护用户数据安全', 'cyan');

    log('\n💡 提示:', 'yellow');
    log('  - 管理员可以在 Directus 中查看和修改配置', 'yellow');
    log('  - 前端 API 使用 Supabase Service Role Key', 'yellow');
    log('  - 无需在 Directus 中配置 Public 角色权限', 'yellow');

  } catch (error) {
    log(`\n❌ 错误: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  }
}

// 运行主函数
main();
