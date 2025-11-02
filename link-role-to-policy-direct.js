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
    console.log('  LINK ROLE TO POLICY DIRECTLY');
    console.log('='.repeat(60) + '\n');

    const token = await login();

    const roleId = '58a14a28-c0af-436c-88ec-5214352eac5e';
    const policyId = '79547eb7-e735-4c78-a8f9-7768b02b1bd5';

    // Method: Update role with policies array
    console.log('🔧 Updating Role with Policies:');
    console.log('-'.repeat(60));

    const updateResponse = await fetch(`${DIRECTUS_URL}/roles/${roleId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        policies: [
          {
            policies_id: policyId,
          }
        ]
      }),
    });

    if (updateResponse.ok) {
      const result = await updateResponse.json();
      console.log('✅ Update successful!');
      console.log(JSON.stringify(result.data, null, 2));
    } else {
      const error = await updateResponse.text();
      console.log('❌ Update failed:', error);

      // Try alternative format
      console.log('\n🔧 Trying alternative format...');

      const alt1Response = await fetch(`${DIRECTUS_URL}/roles/${roleId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          policies: [policyId]
        }),
      });

      if (alt1Response.ok) {
        console.log('✅ Alternative format worked!');
      } else {
        const alt1Error = await alt1Response.text();
        console.log('❌ Alternative also failed:', alt1Error);
      }
    }

    // Verify
    console.log('\n🔍 Verifying:');
    console.log('-'.repeat(60));

    const getRoleResponse = await fetch(`${DIRECTUS_URL}/roles/${roleId}?fields=*,policies.*,policies.policies_id.*`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (getRoleResponse.ok) {
      const roleData = await getRoleResponse.json();
      console.log('Role policies:', JSON.stringify(roleData.data.policies, null, 2));
    }

    console.log('\n' + '='.repeat(60));
    console.log('  NOW TRY: node add-sample-providers.js');
    console.log('='.repeat(60) + '\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
