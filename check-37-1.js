const axios = require('axios');
const { execSync } = require('child_process');

async function check() {
  const tokenOutput = execSync('./get-new-directus-token.sh').toString();
  const tokenMatch = tokenOutput.match(/DIRECTUS_ADMIN_TOKEN=(.+)/);
  const TOKEN = tokenMatch[1].trim();
  
  const headers = { Authorization: `Bearer ${TOKEN}` };
  
  // 查询策略 37.1
  const res = await axios.get('http://localhost:8055/items/strategies?filter[slug][_eq]=new-dex-first-pool-liquidity&fields=id,title,category,category_l1,category_l2', { headers });
  
  if (res.data.data?.length > 0) {
    const s = res.data.data[0];
    console.log('37.1 策略:');
    console.log('标题:', s.title);
    console.log('category:', s.category);
    console.log('category_l1:', s.category_l1);
    console.log('category_l2:', s.category_l2);
  }
}

check().catch(err => console.error('Error:', err.message));
