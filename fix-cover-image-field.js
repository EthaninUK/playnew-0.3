const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

async function getAuthToken() {
  const response = await axios.post(`${DIRECTUS_URL}/auth/login`, {
    email: 'the_uk1@outlook.com',
    password: 'Mygcdjmyxzg2026!'
  });
  return response.data.data.access_token;
}

async function fixCoverImageField() {
  try {
    const token = await getAuthToken();

    console.log('\n🔧 开始修复 cover_image 字段配置...\n');

    // 更新 cover_image 字段，将其改为 file 类型
    const response = await axios.patch(
      `${DIRECTUS_URL}/fields/strategies/cover_image`,
      {
        type: 'uuid',
        schema: {
          is_nullable: true
        },
        meta: {
          interface: 'file-image',
          display: 'image',
          readonly: false,
          hidden: false,
          width: 'full',
          options: {
            folder: null
          },
          display_options: {
            circle: false
          },
          special: ['file']
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ cover_image 字段已成功更新为文件类型！\n');
    console.log('现在你可以：');
    console.log('1. 刷新 Directus 后台页面');
    console.log('2. 编辑任意 Strategy');
    console.log('3. 在 Cover Image 字段中点击即可上传图片\n');

  } catch (error) {
    console.error('\n❌ 修复失败:', error.response?.data || error.message);
    console.log('\n建议手动修复：');
    console.log('1. 进入 Directus: http://localhost:8055');
    console.log('2. 点击左上角设置图标（齿轮）');
    console.log('3. 选择 "Data Model"');
    console.log('4. 点击 "strategies" 表');
    console.log('5. 找到 "cover_image" 字段并点击');
    console.log('6. 在 "Type" 中选择 "Image"');
    console.log('7. 保存');
  }
}

fixCoverImageField();
