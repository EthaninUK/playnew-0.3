const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_ADMIN_EMAIL = 'the_uk1@outlook.com';
const DIRECTUS_ADMIN_PASSWORD = 'Mygcdjmyxzg2026!';

async function main() {
  try {
    const loginResponse = await axios.post(`${DIRECTUS_URL}/auth/login`, {
      email: DIRECTUS_ADMIN_EMAIL,
      password: DIRECTUS_ADMIN_PASSWORD,
    });

    const token = loginResponse.data.data.access_token;
    const headers = { Authorization: `Bearer ${token}` };

    console.log('Fetching news field configuration...\n');

    const fieldsResponse = await axios.get(`${DIRECTUS_URL}/fields/news`, { headers });
    const fields = fieldsResponse.data.data;

    const requiredFields = fields.filter(f => f.meta?.required);

    console.log('Required fields in news table:');
    console.log('='.repeat(60));
    requiredFields.forEach(f => {
      console.log(`- ${f.field} (${f.type})`);
    });

    console.log('\n' + '='.repeat(60));
    console.log(`Total required fields: ${requiredFields.length}`);

    // Also check an existing gossip record
    console.log('\n📊 Checking existing gossip record structure...\n');
    const gossipResponse = await axios.get(
      `${DIRECTUS_URL}/items/news?filter[news_type][_eq]=gossip&limit=1`,
      { headers }
    );

    if (gossipResponse.data.data.length > 0) {
      const sampleGossip = gossipResponse.data.data[0];
      console.log('Sample gossip fields:');
      console.log('='.repeat(60));
      Object.keys(sampleGossip).forEach(key => {
        const value = sampleGossip[key];
        const type = typeof value;
        const display = value === null ? 'null' :
                       Array.isArray(value) ? `array[${value.length}]` :
                       type === 'string' && value.length > 50 ? `"${value.substring(0,47)}..."` :
                       JSON.stringify(value);
        console.log(`- ${key}: ${display}`);
      });
    } else {
      console.log('No gossip records found');
    }

  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

main();
