// 直接测试 /api/subscription 端点

const FRONTEND_URL = 'http://localhost:3000';

async function testAPI() {
  console.log('🧪 Testing /api/subscription endpoint...');
  console.log('');

  try {
    const response = await fetch(`${FRONTEND_URL}/api/subscription`, {
      headers: {
        'Cookie': '', // 没有 session cookie 的情况
      },
    });

    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', JSON.stringify(data, null, 2));

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testAPI();
