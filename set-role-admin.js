const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_EMAIL = 'the_uk1@outlook.com';
const DIRECTUS_PASSWORD = 'Mygcdjmyxzg2026!';

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
    console.log('');
    console.log('================================================');
    console.log('  Set Role as Admin');
    console.log('================================================');
    console.log('');

    const token = await login();
    console.log('✅ Logged in\n');

    const roleId = '58a14a28-c0af-436c-88ec-5214352eac5e'; // Administrator role ID

    console.log('🔧 Setting admin_access = true on Administrator role...\n');

    const updateResponse = await fetch(`${DIRECTUS_URL}/roles/${roleId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        admin_access: true,
        app_access: true,
      }),
    });

    if (updateResponse.ok) {
      const data = await updateResponse.json();
      console.log('✅ Successfully updated role');
      console.log(`   Admin Access: ${data.data.admin_access}`);
      console.log(`   App Access: ${data.data.app_access}`);
      console.log('');
      console.log('================================================');
      console.log('🎉 Done! Try the data scripts again now.');
      console.log('================================================');
    } else {
      const error = await updateResponse.text();
      console.log('❌ Failed to update role:');
      console.log(error);
    }

    console.log('');

  } catch (error) {
    console.error('');
    console.error('❌ Error:', error.message);
    console.error('');
    process.exit(1);
  }
}

main();
