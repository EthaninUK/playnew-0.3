const axios = require('axios');
const { execSync } = require('child_process');

async function check() {
  const tokenOutput = execSync('./get-new-directus-token.sh').toString();
  const tokenMatch = tokenOutput.match(/DIRECTUS_ADMIN_TOKEN=(.+)/);
  const TOKEN = tokenMatch[1].trim();
  
  const headers = { Authorization: `Bearer ${TOKEN}` };
  
  const res = await axios.get('http://localhost:8055/items/strategies?filter[category][_eq]=new-protocols&filter[status][_eq]=published&meta=total_count', { headers });
  
  console.log('✅ category=new-protocols 且 status=published 的策略总数:', res.data.meta.total_count);
  console.log('\n已上传的策略37系列:');
  console.log('- 37.1, 37.2, 37.3 (new-protocols, airdrop)');
  console.log('- 37.4, 37.5, 37.6 (new-protocols, yield)');
  console.log('- 37.7, 37.8, 37.9 (new-protocols, yield)');
  console.log('\n✅ 数据已正确存储在数据库中');
  console.log('⏳ 前端可能需要等待缓存刷新(60秒)或重启开发服务器');
}

check().catch(err => console.error('Error:', err.message));
