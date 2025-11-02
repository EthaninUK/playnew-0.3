const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

async function getAuthToken() {
  const response = await axios.post(`${DIRECTUS_URL}/auth/login`, {
    email: 'the_uk1@outlook.com',
    password: 'Mygcdjmyxzg2026!'
  });
  return response.data.data.access_token;
}

async function checkFilePermissions() {
  try {
    const token = await getAuthToken();

    console.log('\n🔍 检查文件上传配置和权限...\n');

    // 1. 检查当前用户信息
    const userRes = await axios.get(
      `${DIRECTUS_URL}/users/me`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );

    console.log('📋 当前用户信息:');
    console.log(`   Email: ${userRes.data.data.email}`);
    console.log(`   Role: ${userRes.data.data.role}`);
    console.log(`   ID: ${userRes.data.data.id}`);

    // 2. 尝试获取文件列表
    console.log('\n📁 测试文件库访问...');
    const filesRes = await axios.get(
      `${DIRECTUS_URL}/files?limit=5`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );

    console.log(`   ✅ 可以读取文件库，当前有 ${filesRes.data.data.length} 个文件`);

    if (filesRes.data.data.length > 0) {
      console.log('\n最近上传的文件:');
      filesRes.data.data.slice(0, 3).forEach(file => {
        console.log(`   - ${file.filename_download} (${file.type})`);
      });
    }

    // 3. 检查文件上传的环境变量
    console.log('\n⚙️  建议检查 docker-compose.yml 中的文件配置:');
    console.log('   - STORAGE_LOCATIONS (存储位置)');
    console.log('   - FILES_MAX_SIZE (最大文件大小)');
    console.log('   - FILES_MIME_TYPE_ALLOW_LIST (允许的文件类型)');

    // 4. 测试上传权限（不实际上传，只检查端点）
    console.log('\n🔐 文件上传端点:');
    console.log(`   POST ${DIRECTUS_URL}/files`);
    console.log('   需要认证: 是');
    console.log('   内容类型: multipart/form-data');

    console.log('\n💡 如果上传失败，请检查:');
    console.log('   1. 浏览器控制台是否有错误信息');
    console.log('   2. Directus 日志: docker-compose logs directus --tail=100');
    console.log('   3. 文件大小是否超过限制（默认 100MB）');
    console.log('   4. 文件类型是否被允许');
    console.log('   5. uploads 文件夹权限是否正确');

    // 5. 检查 strategies 表的 cover_image 字段关联
    console.log('\n🔗 检查 cover_image 字段关联...');
    const fieldRes = await axios.get(
      `${DIRECTUS_URL}/fields/strategies/cover_image`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );

    const field = fieldRes.data.data;
    console.log(`   类型: ${field.type}`);
    console.log(`   界面: ${field.meta?.interface}`);
    console.log(`   特殊标记: ${JSON.stringify(field.meta?.special)}`);

    if (field.type !== 'uuid' || !field.meta?.special?.includes('file')) {
      console.log('   ⚠️  字段配置可能有问题！');
    } else {
      console.log('   ✅ 字段配置正确');
    }

  } catch (error) {
    console.error('\n❌ 检查失败:');
    if (error.response) {
      console.error(`   状态码: ${error.response.status}`);
      console.error(`   错误: ${JSON.stringify(error.response.data, null, 2)}`);
    } else {
      console.error(`   ${error.message}`);
    }
  }
}

checkFilePermissions();
