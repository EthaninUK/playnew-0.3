const axios = require('axios');
const { execSync } = require('child_process');

async function check() {
  const tokenOutput = execSync('./get-new-directus-token.sh').toString();
  const tokenMatch = tokenOutput.match(/DIRECTUS_ADMIN_TOKEN=(.+)/);
  const TOKEN = tokenMatch[1].trim();
  
  const headers = { Authorization: `Bearer ${TOKEN}` };
  
  // 查询策略 37.4, 37.5, 37.6
  const slugs = [
    'pendle-new-yield-markets',
    'new-stablecoin-bootstrap-pools',
    'new-l2-native-dex-early-lp'
  ];
  
  for (const slug of slugs) {
    const res = await axios.get(`http://localhost:8055/items/strategies?filter[slug][_eq]=${slug}&fields=id,title,category,category_l1,category_l2`, { headers });
    if (res.data.data?.length > 0) {
      const s = res.data.data[0];
      console.log('标题:', s.title);
      console.log('分类:', s.category_l1, '→', s.category, '→', s.category_l2);
      console.log('ID:', s.id);
      console.log();
    }
  }
}

check().catch(err => console.error('Error:', err.message));
