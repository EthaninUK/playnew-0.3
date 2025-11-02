// 获取 Directus Access Token
const fetch = require('node:fetch');

async function getDirectusToken() {
  try {
    const response = await fetch('http://localhost:8055/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'the_uk1@outlook.com',
        password: 'Mygcdjmyxzg2026!'
      })
    });

    const data = await response.json();

    if (data.data && data.data.access_token) {
      console.log('\n✅ Directus Access Token 获取成功!\n');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('\n📋 在 n8n 中使用以下配置:\n');
      console.log('Credential Type: Header Auth');
      console.log('Name: Directus Admin Token');
      console.log('Header Name: Authorization');
      console.log(`Header Value: Bearer ${data.data.access_token}`);
      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('\n💡 提示: 这个 token 会在一段时间后过期');
      console.log('   如需长期使用,建议在 Directus 中创建静态 token\n');

      // 保存到文件
      const fs = require('fs');
      fs.writeFileSync('.directus-token', data.data.access_token);
      console.log('✅ Token 已保存到 .directus-token 文件\n');

      return data.data.access_token;
    } else {
      console.error('❌ 登录失败:', data);
    }
  } catch (error) {
    console.error('❌ 错误:', error.message);
  }
}

getDirectusToken();
