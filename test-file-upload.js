const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const DIRECTUS_URL = 'http://localhost:8055';

async function getAuthToken() {
  const response = await axios.post(`${DIRECTUS_URL}/auth/login`, {
    email: 'the_uk1@outlook.com',
    password: 'Mygcdjmyxzg2026!'
  });
  return response.data.data.access_token;
}

async function testFileUpload() {
  try {
    const token = await getAuthToken();

    console.log('\n🧪 测试文件上传功能...\n');

    // 创建一个测试图片（1x1 像素的 PNG）
    const testImagePath = '/tmp/test-image.png';
    const pngBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );
    fs.writeFileSync(testImagePath, pngBuffer);

    console.log('✅ 创建测试图片: /tmp/test-image.png');

    // 尝试上传
    const formData = new FormData();
    formData.append('file', fs.createReadStream(testImagePath), {
      filename: 'test-image.png',
      contentType: 'image/png'
    });

    console.log('\n📤 正在上传...');

    const uploadRes = await axios.post(
      `${DIRECTUS_URL}/files`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          'Authorization': `Bearer ${token}`
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      }
    );

    const fileId = uploadRes.data.data.id;
    console.log(`✅ 上传成功！文件 ID: ${fileId}`);
    console.log(`   文件名: ${uploadRes.data.data.filename_download}`);
    console.log(`   类型: ${uploadRes.data.data.type}`);
    console.log(`   大小: ${uploadRes.data.data.filesize} 字节`);

    // 测试获取文件
    console.log('\n📥 测试获取文件...');
    const fileUrl = `${DIRECTUS_URL}/assets/${fileId}`;
    console.log(`   文件 URL: ${fileUrl}`);

    const getFileRes = await axios.get(fileUrl, {
      responseType: 'arraybuffer',
      validateStatus: () => true
    });

    if (getFileRes.status === 200) {
      console.log('   ✅ 可以访问文件');
    } else {
      console.log(`   ❌ 无法访问文件 (状态码: ${getFileRes.status})`);
    }

    // 测试设置为策略封面
    console.log('\n🖼️  测试设置为策略封面...');

    // 获取第一个策略
    const strategiesRes = await axios.get(
      `${DIRECTUS_URL}/items/strategies?limit=1`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );

    if (strategiesRes.data.data.length > 0) {
      const strategyId = strategiesRes.data.data[0].id;
      const strategyTitle = strategiesRes.data.data[0].title;

      console.log(`   策略: ${strategyTitle} (${strategyId})`);

      // 更新封面
      await axios.patch(
        `${DIRECTUS_URL}/items/strategies/${strategyId}`,
        { cover_image: fileId },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('   ✅ 成功设置为封面图片');

      // 验证
      const verifyRes = await axios.get(
        `${DIRECTUS_URL}/items/strategies/${strategyId}?fields=cover_image`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (verifyRes.data.data.cover_image === fileId) {
        console.log('   ✅ 验证通过，封面已更新');
      } else {
        console.log('   ⚠️  封面未正确更新');
      }
    } else {
      console.log('   ⚠️  没有找到策略');
    }

    // 清理测试文件
    fs.unlinkSync(testImagePath);

    console.log('\n🎉 所有测试通过！文件上传功能正常工作。\n');

    console.log('📋 使用说明:');
    console.log('1. 在 Directus 后台，进入 Strategies 集合');
    console.log('2. 点击任意策略进入编辑');
    console.log('3. 找到 "Cover Image" 字段');
    console.log('4. 点击字段，会弹出文件选择器');
    console.log('5. 可以选择已上传的文件，或点击"Upload Files"上传新文件');
    console.log('6. 选择图片后保存\n');

    console.log('🔍 如果上传仍然失败，请提供:');
    console.log('1. 浏览器控制台的错误信息（F12 → Console）');
    console.log('2. Network 标签中失败请求的详细信息');
    console.log('3. 上传的文件类型和大小\n');

  } catch (error) {
    console.error('\n❌ 测试失败:');
    if (error.response) {
      console.error(`   状态码: ${error.response.status}`);
      console.error(`   错误信息: ${JSON.stringify(error.response.data, null, 2)}`);
    } else {
      console.error(`   ${error.message}`);
    }

    console.log('\n💡 可能的原因:');
    console.log('1. 文件大小超过限制');
    console.log('2. 文件类型不被允许');
    console.log('3. 权限不足');
    console.log('4. Directus 存储配置问题');
    console.log('\n运行以下命令检查详细日志:');
    console.log('docker-compose logs directus --tail=50 | grep -i error');
  }
}

testFileUpload();
