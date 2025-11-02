const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

// 使用管理员凭据
const ADMIN_EMAIL = 'the_uk1@outlook.com';
const ADMIN_PASSWORD = 'Mygcdjmyxzg2026!';

async function addPublicFilePermission() {
  try {
    console.log('\n🔐 获取管理员 token...');

    const loginRes = await axios.post(`${DIRECTUS_URL}/auth/login`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    });

    const token = loginRes.data.data.access_token;
    console.log('✅ 登录成功\n');

    // 直接通过 API 添加公共权限
    console.log('📋 添加公共文件读取权限...');

    try {
      const addPermRes = await axios.post(
        `${DIRECTUS_URL}/permissions`,
        {
          role: null,  // null = public role
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

      console.log('✅ 公共文件读取权限已添加！');
      console.log(`   权限 ID: ${addPermRes.data.data.id}`);
    } catch (error) {
      if (error.response?.status === 403) {
        console.log('\n⚠️  当前账号没有足够权限添加公共权限');
        console.log('需要手动在 Directus 后台操作:\n');
        console.log('1. 访问 http://localhost:8055');
        console.log('2. 点击左上角设置图标（齿轮）');
        console.log('3. 选择 "Access Control"');
        console.log('4. 找到 "Public" 角色');
        console.log('5. 为 "Directus Files" 添加 "Read" 权限');
        console.log('6. 确保允许访问所有字段\n');
        return;
      }
      throw error;
    }

    // 测试文件访问
    console.log('\n🧪 测试文件访问...');

    // 获取一个文件 ID
    const filesRes = await axios.get(
      `${DIRECTUS_URL}/files?limit=1`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );

    if (filesRes.data.data.length > 0) {
      const fileId = filesRes.data.data[0].id;
      const fileUrl = `${DIRECTUS_URL}/assets/${fileId}`;

      // 测试无需认证访问
      const testRes = await axios.get(fileUrl, {
        validateStatus: () => true
      });

      if (testRes.status === 200) {
        console.log('✅ 文件可以公开访问（无需认证）');
        console.log(`   测试 URL: ${fileUrl}`);
      } else if (testRes.status === 403) {
        console.log('❌ 文件仍然返回 403');
        console.log('   可能需要重启 Directus 服务');
        console.log('   运行: docker-compose restart directus');
      } else {
        console.log(`⚠️  文件访问返回状态码: ${testRes.status}`);
      }
    } else {
      console.log('⚠️  文件库中没有文件，跳过测试');
    }

    console.log('\n🎉 配置完成！\n');

  } catch (error) {
    console.error('\n❌ 操作失败:');
    if (error.response) {
      console.error(`   状态码: ${error.response.status}`);
      console.error(`   错误: ${JSON.stringify(error.response.data, null, 2)}`);
    } else {
      console.error(`   ${error.message}`);
    }

    console.log('\n💡 替代方案:');
    console.log('使用 Directus 后台手动添加权限');
    console.log('参考文档: 修复图片上传问题指南.md');
  }
}

addPublicFilePermission();
