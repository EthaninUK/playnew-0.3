const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_EMAIL = 'the_uk1@outlook.com';
const DIRECTUS_PASSWORD = 'Mygcdjmyxzg2026!';

async function main() {
  try {
    // 登录
    const loginResponse = await axios.post(`${DIRECTUS_URL}/auth/login`, {
      email: DIRECTUS_EMAIL,
      password: DIRECTUS_PASSWORD,
    });
    const token = loginResponse.data.data.access_token;

    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    // 获取 memberships 表的字段信息
    console.log('📋 memberships 表字段信息:\n');
    const fieldsResponse = await axios.get(
      `${DIRECTUS_URL}/fields/memberships`,
      config
    );

    const fields = fieldsResponse.data.data.map((f) => f.field);
    console.log('可用字段:', fields.join(', '));

    // 获取实际数据
    console.log('\n📊 会员等级数据:\n');
    const dataResponse = await axios.get(
      `${DIRECTUS_URL}/items/memberships?fields=*`,
      config
    );

    console.log(JSON.stringify(dataResponse.data.data, null, 2));
  } catch (error) {
    console.error('❌ 错误:', error.response?.data || error.message);
  }
}

main();
