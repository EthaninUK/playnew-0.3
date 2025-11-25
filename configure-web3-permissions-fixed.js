/**
 * 配置 Web3 表的 Directus 权限 (使用正确的 policy)
 */

const DIRECTUS_URL = 'http://localhost:8055';
const ADMIN_EMAIL = 'the_uk1@outlook.com';
const ADMIN_PASSWORD = 'Mygcdjmyxzg2026!';
const PUBLIC_POLICY_ID = 'abf8a154-5b1c-4a46-ac9c-7300570f4f17'; // $t:public_label

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
      // 为 Public policy 添加读取权限
      const response = await fetch(`${DIRECTUS_URL}/permissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          collection: collection,
          action: 'read',
          policy: PUBLIC_POLICY_ID,
          permissions: {},
          fields: ['*']
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`  ✅ ${collection} - 公开读取权限已设置 (ID: ${result.data.id})`);
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

async function verifyTables() {
  console.log('\n🔍 验证表是否可公开访问:\n');

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

async function testPaymentInfoAPI() {
  console.log('\n🧪 测试支付信息 API:\n');

  try {
    const response = await fetch('http://localhost:3000/api/web3/payment-info?purpose=recharge&amount=200');
    const data = await response.json();

    if (data.success) {
      console.log('  ✅ API 响应成功!');
      console.log(`  📊 支持 ${data.data.supported_chains.length} 条链`);
      data.data.supported_chains.forEach(chain => {
        console.log(`     🔗 ${chain.chain_name}: ${chain.supported_tokens.length} 个代币`);
      });
    } else {
      console.log('  ❌ API 返回错误:', data.error);
      if (data.details) console.log('     详情:', data.details);
    }
  } catch (error) {
    console.log('  ❌ API 调用失败:', error.message);
  }
}

async function main() {
  try {
    console.log('🔐 登录 Directus...');
    const token = await login();
    console.log('✅ 登录成功\n');

    await configurePermissions(token);
    await verifyTables();
    await testPaymentInfoAPI();

    console.log('\n✨ 所有配置完成!');
    console.log('\n📝 下一步:');
    console.log('   1. 刷新浏览器中的充值对话框');
    console.log('   2. 选择充值金额 ($200)');
    console.log('   3. 点击"使用加密货币支付"');
    console.log('   4. 现在应该能正常加载支付选项了!');

  } catch (error) {
    console.error('\n❌ 配置失败:', error.message);
    process.exit(1);
  }
}

main();
