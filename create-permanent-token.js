#!/usr/bin/env node

/**
 * 创建永久Directus Static Token
 */

const DIRECTUS_URL = 'http://localhost:8055';
const EMAIL = 'the_uk1@outlook.com';
const PASSWORD = 'Mygcdjmyxzg2026!';

async function createPermanentToken() {
  console.log('\n=== 创建永久 Directus Token ===\n');

  // 1. 先登录获取临时token
  console.log('1️⃣  登录 Directus...');
  const loginResponse = await fetch(`${DIRECTUS_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });

  if (!loginResponse.ok) {
    console.error('❌ 登录失败');
    process.exit(1);
  }

  const loginData = await loginResponse.json();
  const tempToken = loginData.data.access_token;
  const userId = loginData.data.user?.id;

  console.log('✓ 登录成功');
  console.log(`  User ID: ${userId}\n`);

  // 2. 获取用户的role
  console.log('2️⃣  获取用户角色...');
  const userResponse = await fetch(`${DIRECTUS_URL}/users/${userId}`, {
    headers: { 'Authorization': `Bearer ${tempToken}` },
  });

  if (!userResponse.ok) {
    console.error('❌ 获取用户信息失败');
    process.exit(1);
  }

  const userData = await userResponse.json();
  const roleId = userData.data.role;

  console.log('✓ 用户角色:', roleId);
  console.log('');

  // 3. 创建永久static token
  console.log('3️⃣  创建永久 Static Token...');

  // 生成随机token (64字符)
  const crypto = require('crypto');
  const staticToken = crypto.randomBytes(32).toString('hex');

  try {
    const tokenResponse = await fetch(`${DIRECTUS_URL}/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tempToken}`,
      },
      body: JSON.stringify({
        token: staticToken,
      }),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.json();
      console.error('❌ 创建 token 失败:', error);
      process.exit(1);
    }

    console.log('✅ 成功创建永久 Static Token!\n');
    console.log('==========================================');
    console.log('请将以下 token 保存到 .env.local 文件中:');
    console.log('==========================================\n');
    console.log(`DIRECTUS_ADMIN_TOKEN=${staticToken}\n`);
    console.log('==========================================\n');

    console.log('📝 下一步:');
    console.log('1. 复制上面的 token');
    console.log('2. 编辑文件: /Users/m1/PlayNew_0.3/frontend/.env.local');
    console.log('3. 替换 DIRECTUS_ADMIN_TOKEN 的值');
    console.log('4. 重启前端服务: npm run dev\n');

    // 验证token是否有效
    console.log('4️⃣  验证新 token...');
    const testResponse = await fetch(`${DIRECTUS_URL}/items/user_subscriptions?limit=1`, {
      headers: { 'Authorization': `Bearer ${staticToken}` },
    });

    if (testResponse.ok) {
      console.log('✅ Token 验证成功! 可以正常访问 API\n');
    } else {
      console.log('⚠️  Token 可能需要一些时间才能生效\n');
    }

  } catch (error) {
    console.error('❌ 创建 token 时出错:', error.message);
    process.exit(1);
  }
}

createPermanentToken().catch(console.error);
