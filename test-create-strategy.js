const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_EMAIL = 'the_uk1@outlook.com';
const DIRECTUS_PASSWORD = 'Mygcdjmyxzg2026!';

async function test() {
  // Login
  const loginResponse = await axios.post(`${DIRECTUS_URL}/auth/login`, {
    email: DIRECTUS_EMAIL,
    password: DIRECTUS_PASSWORD
  });
  const token = loginResponse.data.data.access_token;
  console.log('✅ Logged in');

  // Get a category
  const categoriesResponse = await axios.get(
    `${DIRECTUS_URL}/items/categories?filter[slug][_eq]=airdrop-tasks&fields=id,name,slug`,
    { headers: { 'Authorization': `Bearer ${token}` } }
  );
  const category = categoriesResponse.data.data[0];
  console.log('✅ Found category:', category);

  // Try to create a strategy
  const testStrategy = {
    title: 'Test Airdrop ' + Date.now(),
    slug: 'test-airdrop-' + Date.now(),
    summary: 'This is a test airdrop',
    content: '# Test\n\nThis is test content',
    category_l1: 'airdrops-early',
    category_l2: category.name,
    category: category.id,
    risk_level: '3-4',
    threshold_tech_level: 'beginner',
    time_commitment_minutes: 60,
    chains: ['Ethereum'],  // Array
    protocols: ['Test Project'],  // Array
    tags: ['test', 'airdrop'],  // Array
    source_name: 'Test',
    source_url: 'https://test.com',
    source_credibility: 50,
    status: 'published',
    published_at: new Date().toISOString(),
    view_count: 0,
    bookmark_count: 0
  };

  console.log('\n📝 Creating strategy with data:');
  console.log(JSON.stringify(testStrategy, null, 2));

  // Test with axios
  console.log('\n🧪 Testing with axios...');
  try {
    const response = await axios.post(
      `${DIRECTUS_URL}/items/strategies`,
      testStrategy,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('✅ AXIOS SUCCESS! Strategy created:', response.data.data.id);
  } catch (error) {
    console.log('❌ AXIOS FAILED:', error.response?.data?.errors?.[0]?.message || error.message);
  }

  // Test with fetch
  console.log('\n🧪 Testing with fetch...');
  try {
    const response = await fetch(`${DIRECTUS_URL}/items/strategies`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...testStrategy,
        title: testStrategy.title + '-fetch',
        slug: testStrategy.slug + '-fetch'
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.log('❌ FETCH FAILED:', error.substring(0, 200));
    } else {
      const data = await response.json();
      console.log('✅ FETCH SUCCESS! Strategy created:', data.data.id);
    }
  } catch (error) {
    console.log('❌ FETCH ERROR:', error.message);
  }
}

test().catch(console.error);
