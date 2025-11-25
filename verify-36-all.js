const axios = require('axios');
const { execSync } = require('child_process');

async function verify() {
  const tokenOutput = execSync('./get-new-directus-token.sh').toString();
  const tokenMatch = tokenOutput.match(/DIRECTUS_ADMIN_TOKEN=(.+)/);
  const TOKEN = tokenMatch[1].trim();
  
  const headers = { Authorization: `Bearer ${TOKEN}` };
  
  const res = await axios.get('http://localhost:8055/items/strategies?filter[category][_eq]=new-chains&fields=id,title,slug&sort=slug', { headers });
  
  console.log('所有 new-chains 类别的策略:');
  console.log('总数:', res.data.data.length);
  console.log();
  
  res.data.data.forEach((s, idx) => {
    const num = idx + 1;
    console.log(num + '. ' + s.title);
    console.log('   Slug: ' + s.slug);
    console.log();
  });
}

verify().catch(err => console.error('Error:', err.message));
