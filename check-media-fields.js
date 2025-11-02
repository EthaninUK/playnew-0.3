const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

async function getAuthToken() {
  const response = await axios.post(`${DIRECTUS_URL}/auth/login`, {
    email: 'the_uk1@outlook.com',
    password: 'Mygcdjmyxzg2026!'
  });
  return response.data.data.access_token;
}

async function checkMediaFields() {
  try {
    const token = await getAuthToken();

    // 检查 strategies 表的字段配置
    const response = await axios.get(
      `${DIRECTUS_URL}/fields/strategies`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    console.log('\n📋 Strategies 表中与媒体相关的字段：\n');

    const mediaRelatedFields = response.data.data.filter(field => {
      const fieldName = field.field.toLowerCase();
      return fieldName.includes('image') ||
             fieldName.includes('video') ||
             fieldName.includes('cover') ||
             fieldName.includes('thumbnail') ||
             fieldName.includes('media') ||
             field.type === 'file' ||
             field.type === 'uuid' && field.meta?.interface === 'file-image';
    });

    if (mediaRelatedFields.length === 0) {
      console.log('❌ 没有找到媒体相关字段\n');
      console.log('需要在 Directus 中手动创建字段：');
      console.log('1. 进入 Settings → Data Model → Strategies');
      console.log('2. 点击 "Create Field"');
      console.log('3. 选择 "Image" 类型');
      console.log('4. 字段名称设为 "cover_image"');
    } else {
      mediaRelatedFields.forEach(field => {
        console.log(`字段名: ${field.field}`);
        console.log(`类型: ${field.type}`);
        console.log(`界面: ${field.meta?.interface || '未设置'}`);
        console.log(`显示名: ${field.meta?.display || '未设置'}`);
        console.log(`是否必填: ${field.meta?.required ? '是' : '否'}`);
        console.log(`特殊配置: ${JSON.stringify(field.meta?.special || [])}`);
        console.log('---');
      });
    }

    // 检查是否存在 directus_files 表（文件库）
    console.log('\n📁 检查文件库配置...\n');

    const filesResponse = await axios.get(
      `${DIRECTUS_URL}/files?limit=1`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    console.log(`✅ 文件库正常工作，当前有 ${filesResponse.data.data.length > 0 ? '文件' : '0 个文件'}`);
    console.log(`\n上传文件的方法：`);
    console.log(`1. 访问 Directus 后台：http://localhost:8055`);
    console.log(`2. 点击左侧的"文件"图标（File Library）`);
    console.log(`3. 点击右上角"+ Upload Files"上传图片或视频`);

  } catch (error) {
    console.error('\n❌ 检查失败:', error.response?.data || error.message);
  }
}

checkMediaFields();
