const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_EMAIL = 'the_uk1@outlook.com';
const DIRECTUS_PASSWORD = 'Mygcdjmyxzg2026!';

async function login() {
  const response = await axios.post(`${DIRECTUS_URL}/auth/login`, {
    email: DIRECTUS_EMAIL,
    password: DIRECTUS_PASSWORD
  });
  return response.data.data.access_token;
}

async function main() {
  try {
    console.log('正在登录...');
    const token = await login();
    console.log('✓ 登录成功\n');

    // 获取用户的role信息
    console.log('检查当前用户角色...');
    const meResponse = await axios.get(`${DIRECTUS_URL}/users/me`, {
      headers: { 'Authorization': `Bearer ${token}` },
      params: { fields: ['id', 'email', 'role', 'role.name', 'role.admin_access'] }
    });
    console.log('当前用户:', meResponse.data.data);

    const roleId = meResponse.data.data.role;
    console.log('\nRole ID:', roleId);

    // 检查role的admin_access
    const roleResponse = await axios.get(`${DIRECTUS_URL}/roles/${roleId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('Role详情:', roleResponse.data.data);

    // 如果是admin，直接使用admin权限访问
    if (roleResponse.data.data.admin_access) {
      console.log('\n✓ 用户具有管理员权限，可以直接访问所有数据');

      // 尝试直接获取gossip
      console.log('\n尝试获取gossip数据...');
      const gossipResponse = await axios.get(`${DIRECTUS_URL}/items/gossip`, {
        headers: { 'Authorization': `Bearer ${token}` },
        params: {
          filter: JSON.stringify({ news_type: { _eq: 'gossip' } }),
          fields: 'id,title,hotness_score,content_published_at',
          limit: 3
        }
      });

      console.log(`\n找到 ${gossipResponse.data.data.length} 条gossip记录:`);
      gossipResponse.data.data.forEach((item, i) => {
        console.log(`${i + 1}. ${item.title}`);
        console.log(`   hotness_score: ${item.hotness_score || '缺失'}`);
        console.log(`   content_published_at: ${item.content_published_at || '缺失'}`);
      });
    } else {
      console.log('\n⚠ 用户没有管理员权限，需要配置权限');
    }

  } catch (error) {
    console.error('\n错误:', error.response?.data || error.message);
    if (error.response?.data) {
      console.error('详细错误:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

main();
