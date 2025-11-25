const axios = require('axios');

async function checkSourceTypeConstraint() {
  try {
    // Login to Directus
    const loginResponse = await axios.post('http://localhost:8055/auth/login', {
      email: 'the_uk1@outlook.com',
      password: 'Mygcdjmyxzg2026!',
    });

    const token = loginResponse.data.data.access_token;

    // Get field configuration
    const fieldResponse = await axios.get('http://localhost:8055/fields/news/source_type', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Source Type Field Configuration:');
    console.log(JSON.stringify(fieldResponse.data.data, null, 2));

  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

checkSourceTypeConstraint();
