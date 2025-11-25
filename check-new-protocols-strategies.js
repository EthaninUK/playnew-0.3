const axios = require('axios');
const { execSync } = require('child_process');

async function check() {
  const tokenOutput = execSync('./get-new-directus-token.sh').toString();
  const tokenMatch = tokenOutput.match(/DIRECTUS_ADMIN_TOKEN=(.+)/);
  const TOKEN = tokenMatch[1].trim();
  
  const headers = { Authorization: `Bearer ${TOKEN}` };
  
  const res = await axios.get('http://localhost:8055/items/strategies?filter[category][_eq]=new-protocols&fields=id,title,slug,category,category_l1,category_l2&limit=20', { headers });
  
  console.log('category=new-protocols 的策略:');
  console.log('总数:', res.data.data.length);
  console.log();
  
  res.data.data.forEach((s, i) => {
    const num = i + 1;
    console.log(num + '. ' + s.title);
    console.log('   category: ' + s.category);
    console.log('   category_l1: ' + s.category_l1);
    console.log('   category_l2: ' + s.category_l2);
    console.log();
  });
}

check().catch(err => console.error('Error:', err.message));
