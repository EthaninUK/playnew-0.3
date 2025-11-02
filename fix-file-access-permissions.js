const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

async function getAuthToken() {
  const response = await axios.post(`${DIRECTUS_URL}/auth/login`, {
    email: 'the_uk1@outlook.com',
    password: 'Mygcdjmyxzg2026!'
  });
  return response.data.data.access_token;
}

async function fixFileAccessPermissions() {
  try {
    const token = await getAuthToken();

    console.log('\n🔧 修复文件访问权限...\n');

    // 获取当前用户的角色信息
    const userRes = await axios.get(
      `${DIRECTUS_URL}/users/me`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );

    const roleId = userRes.data.data.role;
    console.log(`用户角色 ID: ${roleId}`);

    // 获取该角色的权限
    console.log('\n📋 检查 directus_files 权限...');

    const permissionsRes = await axios.get(
      `${DIRECTUS_URL}/permissions?filter[role][_eq]=${roleId}&filter[collection][_eq]=directus_files`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );

    console.log(`   找到 ${permissionsRes.data.data.length} 条权限规则`);

    if (permissionsRes.data.data.length === 0) {
      console.log('\n⚠️  没有找到文件权限规则，正在创建...');

      // 创建完整的文件权限
      const actions = ['create', 'read', 'update', 'delete'];

      for (const action of actions) {
        try {
          await axios.post(
            `${DIRECTUS_URL}/permissions`,
            {
              role: roleId,
              collection: 'directus_files',
              action: action,
              permissions: {},
              fields: ['*']
            },
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );
          console.log(`   ✅ 创建 ${action} 权限成功`);
        } catch (err) {
          console.log(`   ⚠️  创建 ${action} 权限失败: ${err.response?.data?.errors?.[0]?.message || err.message}`);
        }
      }
    } else {
      console.log('   权限规则已存在:');
      permissionsRes.data.data.forEach(perm => {
        console.log(`   - ${perm.action}: ${JSON.stringify(perm.permissions)}`);
      });
    }

    // 检查公共访问权限（role=null）
    console.log('\n🌐 检查公共文件访问权限...');

    const publicPermRes = await axios.get(
      `${DIRECTUS_URL}/permissions?filter[role][_null]=true&filter[collection][_eq]=directus_files`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );

    if (publicPermRes.data.data.length === 0) {
      console.log('   ⚠️  没有公共访问权限，正在创建...');

      try {
        await axios.post(
          `${DIRECTUS_URL}/permissions`,
          {
            role: null,
            collection: 'directus_files',
            action: 'read',
            permissions: {},
            fields: ['*']
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        console.log('   ✅ 创建公共读取权限成功');
      } catch (err) {
        console.log(`   ⚠️  创建失败: ${err.response?.data?.errors?.[0]?.message || err.message}`);
      }
    } else {
      console.log('   ✅ 公共访问权限已存在');
    }

    console.log('\n🎉 权限配置完成！\n');

    console.log('📋 现在你可以:');
    console.log('1. 在 Directus 后台上传文件');
    console.log('2. 文件可以被公开访问');
    console.log('3. 在策略中设置封面图片');
    console.log('4. 前端可以正常显示图片\n');

  } catch (error) {
    console.error('\n❌ 修复失败:');
    if (error.response) {
      console.error(`   状态码: ${error.response.status}`);
      console.error(`   错误: ${JSON.stringify(error.response.data, null, 2)}`);
    } else {
      console.error(`   ${error.message}`);
    }
  }
}

fixFileAccessPermissions();
