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
    console.log('\n' + '='.repeat(60));
    console.log('  FIX ADMINISTRATOR ROLE');
    console.log('='.repeat(60) + '\n');

    const token = await login();
    console.log('✅ Logged in\n');

    const roleId = '58a14a28-c0af-436c-88ec-5214352eac5e';

    // First, get current role state
    console.log('📋 Current Role State:');
    console.log('-'.repeat(60));

    const getRoleResponse = await fetch(`${DIRECTUS_URL}/roles/${roleId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (getRoleResponse.ok) {
      const roleData = await getRoleResponse.json();
      const role = roleData.data;
      console.log(`Name: ${role.name}`);
      console.log(`ID: ${role.id}`);
      console.log(`Admin Access: ${role.admin_access} ${role.admin_access === null || role.admin_access === undefined ? '⚠️' : ''}`);
      console.log(`App Access: ${role.app_access} ${role.app_access === null || role.app_access === undefined ? '⚠️' : ''}`);
      console.log(`Description: ${role.description || 'N/A'}`);
      console.log('');
    }

    // Try Method 1: Direct PATCH
    console.log('🔧 Method 1: Direct PATCH on role');
    console.log('-'.repeat(60));

    const patchResponse = await fetch(`${DIRECTUS_URL}/roles/${roleId}`, {
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

    if (patchResponse.ok) {
      const result = await patchResponse.json();
      console.log(`✅ PATCH successful`);
      console.log(`   Admin Access: ${result.data.admin_access}`);
      console.log(`   App Access: ${result.data.app_access}`);
    } else {
      const error = await patchResponse.text();
      console.log(`❌ PATCH failed: ${error.substring(0, 200)}`);
    }
    console.log('');

    // Verify the change
    console.log('🔍 Verifying Changes:');
    console.log('-'.repeat(60));

    const verifyResponse = await fetch(`${DIRECTUS_URL}/roles/${roleId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (verifyResponse.ok) {
      const roleData = await verifyResponse.json();
      const role = roleData.data;
      console.log(`Admin Access: ${role.admin_access} ${role.admin_access ? '✅' : '❌'}`);
      console.log(`App Access: ${role.app_access} ${role.app_access ? '✅' : '❌'}`);

      if (role.admin_access && role.app_access) {
        console.log('\n✅ SUCCESS! Role now has admin access!');
      } else {
        console.log('\n⚠️  Role still doesn\'t have admin access. Trying alternative method...');

        // Method 2: Try with explicit icon and description
        const altPatchResponse = await fetch(`${DIRECTUS_URL}/roles/${roleId}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: 'Administrator',
            description: 'Administrator role with full access',
            icon: 'supervised_user_circle',
            admin_access: true,
            app_access: true,
          }),
        });

        if (altPatchResponse.ok) {
          console.log('✅ Alternative method worked!');
          const result = await altPatchResponse.json();
          console.log(`   Admin Access: ${result.data.admin_access}`);
        } else {
          const error = await altPatchResponse.text();
          console.log(`❌ Alternative method also failed: ${error.substring(0, 200)}`);
        }
      }
    }

    console.log('');
    console.log('='.repeat(60));
    console.log('  NOW TEST WITH DATA SCRIPTS');
    console.log('='.repeat(60));
    console.log('\nNext steps:');
    console.log('  1. Re-login to refresh token');
    console.log('  2. Run: node add-sample-providers.js');
    console.log('');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
