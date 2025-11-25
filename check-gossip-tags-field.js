const axios = require('axios');

async function checkGossipTagsField() {
  try {
    // Login to Directus
    const loginResponse = await axios.post('http://localhost:8055/auth/login', {
      email: 'the_uk1@outlook.com',
      password: 'Mygcdjmyxzg2026!',
    });

    const token = loginResponse.data.data.access_token;

    // Get field configuration
    const fieldResponse = await axios.get('http://localhost:8055/fields/news/gossip_tags', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Field Configuration:');
    console.log(JSON.stringify(fieldResponse.data.data, null, 2));

    // Check if it's a JSON or CSV field
    const field = fieldResponse.data.data;
    console.log('\n\nField Type:', field.type);
    console.log('Field Schema Type:', field.schema?.data_type);
    console.log('Field Interface:', field.meta?.interface);
    console.log('Field Options:', JSON.stringify(field.meta?.options, null, 2));

  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

checkGossipTagsField();
