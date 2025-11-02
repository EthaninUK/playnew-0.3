const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_EMAIL = 'the_uk1@outlook.com';
const DIRECTUS_PASSWORD = 'Mygcdjmyxzg2026!';

async function test() {
  // Login
  const loginResponse = await axios.post(`${DIRECTUS_URL}/auth/login`, {
    email: DIRECTUS_EMAIL,
    password: DIRECTUS_PASSWORD
  });
  const token = loginResponse.data.data.access_token;
  console.log('✅ Logged in\n');

  // 尝试不同的数组格式
  const testCases = [
    { name: 'PostgreSQL array string', data: { chains: '{Ethereum,Base}' } },
    { name: 'Comma-separated string', data: { chains: 'Ethereum,Base' } },
    { name: 'Single value string', data: { chains: 'Ethereum' } },
  ];

  for (const testCase of testCases) {
    console.log(`Testing: ${testCase.name}`);
    console.log(`Data: ${JSON.stringify(testCase.data)}`);

    try {
      const response = await axios.patch(
        `${DIRECTUS_URL}/items/strategies/02017d27-4a10-4d2d-97fa-b3671778b4ef`,  // 更新现有记录
        testCase.data,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      console.log('✅ SUCCESS!\n');

      // 读取结果
      const check = await axios.get(
        `${DIRECTUS_URL}/items/strategies/02017d27-4a10-4d2d-97fa-b3671778b4ef?fields=chains`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      console.log('Result:', JSON.stringify(check.data.data.chains));
      break;  // 如果成功就停止
    } catch (error) {
      console.log('❌ FAILED:', error.response?.data?.errors?.[0]?.message || error.message);
    }
    console.log('');
  }
}

test().catch(console.error);
