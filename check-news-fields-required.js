const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_EMAIL = 'the_uk1@outlook.com';
const DIRECTUS_PASSWORD = 'Mygcdjmyxzg2026!';

async function main() {
  try {
    // 登录
    const authResponse = await axios.post(`${DIRECTUS_URL}/auth/login`, {
      email: DIRECTUS_EMAIL,
      password: DIRECTUS_PASSWORD,
    });

    const accessToken = authResponse.data.data.access_token;

    // 获取字段信息
    const fieldsResponse = await axios.get(`${DIRECTUS_URL}/fields/news`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log('News 表字段信息:\n');
    const fields = fieldsResponse.data.data;

    console.log('必填字段:');
    fields.filter(f => f.meta?.required).forEach(f => {
      console.log(`  - ${f.field} (${f.type})`);
    });

    console.log('\n所有字段:');
    fields.forEach(f => {
      const required = f.meta?.required ? '必填' : '选填';
      console.log(`  - ${f.field} (${f.type}) [${required}]`);
    });

  } catch (error) {
    console.error('错误:', error.response?.data || error.message);
  }
}

main();
