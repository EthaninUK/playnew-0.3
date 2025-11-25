const axios = require('axios');
const { execSync } = require('child_process');

async function check() {
  const tokenOutput = execSync('./get-new-directus-token.sh').toString();
  const tokenMatch = tokenOutput.match(/DIRECTUS_ADMIN_TOKEN=(.+)/);
  const TOKEN = tokenMatch[1].trim();
  
  const headers = { Authorization: `Bearer ${TOKEN}` };
  
  // 获取 strategies 字段信息
  const res = await axios.get('http://localhost:8055/fields/strategies/category_l1', { headers });
  
  console.log('category_l1 字段信息:');
  console.log(JSON.stringify(res.data.data, null, 2));
}

check().catch(err => console.error('Error:', err.response?.data || err.message));
