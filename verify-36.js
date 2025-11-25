const axios = require('axios');
const { execSync } = require('child_process');

async function verify() {
  const tokenOutput = execSync('./get-new-directus-token.sh').toString();
  const tokenMatch = tokenOutput.match(/DIRECTUS_ADMIN_TOKEN=(.+)/);
  const TOKEN = tokenMatch[1].trim();
  
  const headers = { Authorization: `Bearer ${TOKEN}` };
  
  const slugs = [
    'base-early-ecosystem-interactions',
    'linea-mainnet-lxp-missions',
    'scroll-onchain-activity-marks'
  ];
  
  for (const slug of slugs) {
    const res = await axios.get(`http://localhost:8055/items/strategies?filter[slug][_eq]=${slug}&fields=id,title,slug,category,category_l1,category_l2`, { headers });
    if (res.data.data?.length > 0) {
      console.log('✅', res.data.data[0].title);
      console.log('   Slug:', res.data.data[0].slug);
      console.log('   分类:', res.data.data[0].category_l1, '→', res.data.data[0].category, '→', res.data.data[0].category_l2);
      console.log();
    }
  }
}

verify().catch(err => console.error('Error:', err.message));
