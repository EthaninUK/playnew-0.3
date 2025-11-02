const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_EMAIL = 'the_uk1@outlook.com';
const DIRECTUS_PASSWORD = 'Mygcdjmyxzg2026!';

// Simple UUID v4 generator
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

async function login() {
  const response = await fetch(`${DIRECTUS_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: DIRECTUS_EMAIL,
      password: DIRECTUS_PASSWORD,
    }),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  const data = await response.json();
  return data.data.access_token;
}

async function main() {
  try {
    const token = await login();
    console.log('✅ Logged in\n');

    // Simple test data with ONLY fields that exist in the database
    const testProvider = {
      id: generateUUID(),
      name: 'Test Uniswap',
      slug: 'test-uniswap',
      category: 'dex',
      description: 'Uniswap is the largest decentralized exchange on Ethereum.',
      tagline: 'The leading DEX protocol',
      website_url: 'https://uniswap.org',
      rating: 4.8,
      review_count: 1250,
      status: 'published',
      view_count: 0,
      inquiry_count: 0,
      verified: true,
      featured: true,
      is_featured: true,
      type: 'dex',
    };

    console.log('🧪 Testing creation with minimal valid data...\n');

    const response = await fetch(`${DIRECTUS_URL}/items/service_providers`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testProvider),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ SUCCESS! Created provider:');
      console.log(JSON.stringify(result.data, null, 2));
    } else {
      const error = await response.text();
      console.log('❌ FAILED:');
      console.log(error);
    }

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
