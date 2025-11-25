const axios = require('axios');
const { execSync } = require('child_process');

async function check() {
  const tokenOutput = execSync('./get-new-directus-token.sh').toString();
  const tokenMatch = tokenOutput.match(/DIRECTUS_ADMIN_TOKEN=(.+)/);
  const TOKEN = tokenMatch[1].trim();
  
  const headers = { Authorization: `Bearer ${TOKEN}` };
  
  // 检查 33.3
  const res1 = await axios.get('http://localhost:8055/items/strategies?filter[slug][_eq]=calendar-spread-volatility-term-structure&fields=id,title,slug,category,category_l1,category_l2', { headers });
  console.log('策略 33.3 (Calendar Spread):');
  if (res1.data.data?.length > 0) {
    console.log('✅ 已找到:', res1.data.data[0]);
  } else {
    console.log('❌ 未找到');
  }
  
  // 检查 33.4
  const res2 = await axios.get('http://localhost:8055/items/strategies?filter[slug][_eq]=butterfly-spread-low-volatility-structure&fields=id,title,slug,category,category_l1,category_l2', { headers });
  console.log('\n策略 33.4 (Butterfly Spread):');
  if (res2.data.data?.length > 0) {
    console.log('✅ 已找到:', res2.data.data[0]);
  } else {
    console.log('❌ 未找到');
  }
}

check().catch(err => console.error('Error:', err.message));
