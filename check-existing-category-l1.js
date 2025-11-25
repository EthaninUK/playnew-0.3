const axios = require('axios');
const { execSync } = require('child_process');

async function check() {
  const tokenOutput = execSync('./get-new-directus-token.sh').toString();
  const tokenMatch = tokenOutput.match(/DIRECTUS_ADMIN_TOKEN=(.+)/);
  const TOKEN = tokenMatch[1].trim();
  
  const headers = { Authorization: `Bearer ${TOKEN}` };
  
  // 获取所有策略的 category_l1 值，去重
  const res = await axios.get('http://localhost:8055/items/strategies?fields=category_l1&limit=-1', { headers });
  
  const uniqueValues = [...new Set(res.data.data.map(s => s.category_l1))].filter(v => v).sort();
  
  console.log('当前数据库中 category_l1 的所有可能值:');
  uniqueValues.forEach(v => console.log(`  - ${v}`));
  console.log(`\n总共 ${uniqueValues.length} 种不同的值`);
}

check().catch(err => console.error('Error:', err.message));
