/**
 * 配置 Web3 表的 Directus 权限
 * 允许前端 API 读取配置数据
 */

const DIRECTUS_URL = 'http://localhost:8055';
const ADMIN_EMAIL = 'the_uk1@outlook.com';
const ADMIN_PASSWORD = 'Mygcdjmyxzg2026!';

async function login() {
  const response = await fetch(`${DIRECTUS_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    }),
  });

  const data = await response.json();
  if (!data.data?.access_token) {
    throw new Error('登录失败');
  }

  return data.data.access_token;
}

async function configurePermissions(token) {
  const collections = [
    'web3_system_config',
    'web3_pricing_config',
    'web3_supported_tokens'
  ];

  console.log('📋 配置 Web3 表的公开读取权限...\n');

  for (const collection of collections) {
    try {
      // 为 Public 角色添加读取权限
      const response = await fetch(`${DIRECTUS_URL}/permissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          collection: collection,
          action: 'read',
          role: null, // null = Public role
          permissions: {},
          fields: ['*']
        })
      });

      if (response.ok) {
        console.log(`  ✅ ${collection} - 公开读取权限已设置`);
      } else {
        const error = await response.json();
        if (error.errors?.[0]?.extensions?.code === 'RECORD_NOT_UNIQUE') {
          console.log(`  ℹ️  ${collection} - 权限已存在`);
        } else {
          console.log(`  ⚠️  ${collection} -`, error.errors?.[0]?.message || '设置失败');
        }
      }
    } catch (error) {
      console.log(`  ❌ ${collection} - ${error.message}`);
    }
  }

  console.log('\n✅ 权限配置完成!');
}

async function verifyTables(token) {
  console.log('\n🔍 验证表是否可访问:\n');

  const collections = [
    'web3_system_config',
    'web3_pricing_config',
    'web3_supported_tokens'
  ];

  for (const collection of collections) {
    try {
      // 不带 token 访问 (模拟前端)
      const response = await fetch(`${DIRECTUS_URL}/items/${collection}?limit=1`);
      const data = await response.json();

      if (data.data) {
        console.log(`  ✅ ${collection} - 可公开访问 (${data.data.length} 条记录)`);
      } else if (data.errors) {
        console.log(`  ❌ ${collection} - ${data.errors[0].message}`);
      }
    } catch (error) {
      console.log(`  ❌ ${collection} - ${error.message}`);
    }
  }
}

async function main() {
  try {
    console.log('🔐 登录 Directus...');
    const token = await login();
    console.log('✅ 登录成功\n');

    await configurePermissions(token);
    await verifyTables(token);

    console.log('\n✨ 所有配置完成!');
    console.log('\n📝 下一步:');
    console.log('   1. 刷新浏览器中的充值对话框');
    console.log('   2. 选择充值金额 ($200)');
    console.log('   3. 点击"使用加密货币支付"');
    console.log('   4. 应该能看到链和代币选择界面');

  } catch (error) {
    console.error('\n❌ 配置失败:', error.message);
    process.exit(1);
  }
}

main();
