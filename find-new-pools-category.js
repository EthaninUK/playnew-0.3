const axios = require('axios');
const { execSync } = require('child_process');

async function find() {
  const tokenOutput = execSync('./get-new-directus-token.sh').toString();
  const tokenMatch = tokenOutput.match(/DIRECTUS_ADMIN_TOKEN=(.+)/);
  const TOKEN = tokenMatch[1].trim();
  
  const headers = { Authorization: `Bearer ${TOKEN}` };
  
  // 查询所有不同的 category 值
  const res = await axios.get('http://localhost:8055/items/strategies?fields=category&limit=-1', { headers });
  const categories = [...new Set(res.data.data.map(s => s.category))].filter(c => c).sort();
  
  console.log('所有 category 值:');
  categories.forEach(c => console.log('  -', c));
  
  // 查找包含 "new" 或 "protocol" 的
  console.log('\n包含 new/protocol 的:');
  categories.filter(c => c.includes('new') || c.includes('protocol')).forEach(c => console.log('  -', c));
}

find().catch(err => console.error('Error:', err.message));
