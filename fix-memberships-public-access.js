const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_EMAIL = 'the_uk1@outlook.com';
const DIRECTUS_PASSWORD = 'Mygcdjmyxzg2026!';

async function main() {
  try {
    // 登录
    console.log('🔐 登录 Directus...');
    const loginResponse = await axios.post(`${DIRECTUS_URL}/auth/login`, {
      email: DIRECTUS_EMAIL,
      password: DIRECTUS_PASSWORD,
    });
    const token = loginResponse.data.data.access_token;
    console.log('✅ 登录成功\n');

    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    // 获取public role的ID
    console.log('📋 获取公开角色...');
    const rolesResponse = await axios.get(
      `${DIRECTUS_URL}/roles?filter[name][_eq]=Public`,
      config
    );

    let publicRoleId;
    if (rolesResponse.data.data.length > 0) {
      publicRoleId = rolesResponse.data.data[0].id;
      console.log(`✅ 找到 Public 角色: ${publicRoleId}`);
    } else {
      console.log('⚠️  未找到 Public 角色,创建一个新的...');
      const createResponse = await axios.post(
        `${DIRECTUS_URL}/roles`,
        {
          name: 'Public',
          icon: 'public',
          description: '公开访问角色',
          admin_access: false,
          app_access: false,
        },
        config
      );
      publicRoleId = createResponse.data.data.id;
      console.log(`✅ 创建 Public 角色: ${publicRoleId}`);
    }

    // 为 memberships 表设置公开读取权限
    console.log('\n📋 设置 memberships 表的公开读取权限...');

    try {
      await axios.post(
        `${DIRECTUS_URL}/permissions`,
        {
          role: publicRoleId,
          collection: 'memberships',
          action: 'read',
          permissions: {},
          fields: ['*'],
        },
        config
      );
      console.log('✅ 设置成功');
    } catch (error) {
      if (error.response?.data?.errors?.[0]?.message?.includes('already exists')) {
        console.log('  ⏭️  权限已存在');
      } else {
        console.error('  ❌ 设置失败:', error.response?.data ||error.message);
      }
    }

    // 测试公开访问
    console.log('\n🧪 测试公开访问...');
    const testResponse = await axios.get(
      `${DIRECTUS_URL}/items/memberships?fields=name,price_monthly_usd`
    );
    console.log('✅ 公开访问成功!');
    console.log('会员数据:', testResponse.data.data.map(m => `${m.name}: $${m.price_monthly_usd}`).join(', '));

  } catch (error) {
    console.error('❌ 错误:', error.response?.data || error.message);
  }
}

main();
