const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_EMAIL = 'the_uk1@outlook.com';
const DIRECTUS_PASSWORD = 'Mygcdjmyxzg2026!';

async function configurePermissions() {
  console.log('🔧 配置 Directus Web3 配置表权限...\n');

  try {
    // 1. 登录
    console.log('1️⃣ 登录 Directus...');
    const loginRes = await axios.post(`${DIRECTUS_URL}/auth/login`, {
      email: DIRECTUS_EMAIL,
      password: DIRECTUS_PASSWORD
    });
    const token = loginRes.data.data.access_token;
    console.log('✅ 登录成功\n');

    // 2. 获取 Public 角色 ID
    console.log('2️⃣ 获取 Public 角色...');
    const rolesRes = await axios.get(`${DIRECTUS_URL}/roles`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    let publicRoleId = null;
    for (const role of rolesRes.data.data) {
      if (role.name === 'Public' || role.id === 'public') {
        publicRoleId = role.id;
        break;
      }
    }

    if (!publicRoleId) {
      console.log('❌ 未找到 Public 角色');
      return;
    }

    console.log(`✅ Public 角色 ID: ${publicRoleId}\n`);

    // 3. 为 Public 角色添加 Web3 配置表的读取权限
    const collections = [
      'web3_system_config',
      'web3_pricing_config',
      'web3_supported_tokens'
    ];

    console.log('3️⃣ 为 Public 角色添加读取权限...');

    for (const collection of collections) {
      try {
        // 创建权限规则
        const permissionData = {
          role: publicRoleId,
          collection: collection,
          action: 'read',
          permissions: {
            is_active: {
              _eq: true
            }
          },
          fields: ['*']
        };

        await axios.post(`${DIRECTUS_URL}/permissions`, permissionData, {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log(`✅ ${collection}: 权限已添加`);
      } catch (error) {
        if (error.response?.data?.errors?.[0]?.message?.includes('already exists')) {
          console.log(`⚠️  ${collection}: 权限已存在,跳过`);
        } else {
          console.error(`❌ ${collection}: 添加权限失败 - ${error.response?.data?.errors?.[0]?.message || error.message}`);
        }
      }
    }

    console.log('\n✅ 权限配置完成!\n');

    // 4. 测试 API 访问
    console.log('4️⃣ 测试 API 访问...\n');

    const testRes = await axios.get(`${DIRECTUS_URL}/items/web3_system_config`);
    console.log(`✅ web3_system_config API 访问成功`);
    console.log(`   记录数: ${testRes.data.data.length}`);

    const pricingRes = await axios.get(`${DIRECTUS_URL}/items/web3_pricing_config`);
    console.log(`✅ web3_pricing_config API 访问成功`);
    console.log(`   记录数: ${pricingRes.data.data.length}`);

    const tokensRes = await axios.get(`${DIRECTUS_URL}/items/web3_supported_tokens`);
    console.log(`✅ web3_supported_tokens API 访问成功`);
    console.log(`   记录数: ${tokensRes.data.data.length}`);

    console.log('\n🎉 配置和测试完成!\n');

  } catch (error) {
    console.error('❌ 错误:', error.response?.data || error.message);
    process.exit(1);
  }
}

configurePermissions();
