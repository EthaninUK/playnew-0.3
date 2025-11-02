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

async function getCurrentUser(token) {
  const response = await fetch(`${DIRECTUS_URL}/users/me`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get user info');
  }

  const data = await response.json();
  return data.data;
}

async function getRoles(token) {
  const response = await fetch(`${DIRECTUS_URL}/roles`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  return data.data;
}

async function getPolicies(token) {
  const response = await fetch(`${DIRECTUS_URL}/policies`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  return data.data;
}

async function getPermissions(token, policyId) {
  const response = await fetch(`${DIRECTUS_URL}/permissions?filter[policy][_eq]=${policyId}&limit=-1`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  return data.data;
}

async function main() {
  try {
    console.log('');
    console.log('================================================');
    console.log('  Directus User Permissions Diagnosis');
    console.log('================================================');
    console.log('');

    const token = await login();
    console.log('✅ Logged in successfully\n');

    // Get current user info
    console.log('👤 Current User Info:');
    console.log('------------------------------------------------');
    const user = await getCurrentUser(token);
    console.log(`  ID: ${user.id}`);
    console.log(`  Email: ${user.email}`);
    console.log(`  First Name: ${user.first_name || 'N/A'}`);
    console.log(`  Last Name: ${user.last_name || 'N/A'}`);
    console.log(`  Role: ${user.role || 'N/A'}`);
    console.log(`  Status: ${user.status}`);
    console.log('');

    // Get all roles
    console.log('📋 Available Roles:');
    console.log('------------------------------------------------');
    const roles = await getRoles(token);
    roles.forEach(role => {
      console.log(`  - ${role.name} (ID: ${role.id})`);
      console.log(`    Admin Access: ${role.admin_access ? '✅ Yes' : '❌ No'}`);
      console.log(`    App Access: ${role.app_access ? '✅ Yes' : '❌ No'}`);
    });
    console.log('');

    // Get policies
    console.log('🔒 Policies:');
    console.log('------------------------------------------------');
    const policies = await getPolicies(token);

    for (const policy of policies) {
      console.log(`\n  Policy: ${policy.name} (ID: ${policy.id})`);
      console.log(`    Admin Access: ${policy.admin_access ? '✅ Yes' : '❌ No'}`);
      console.log(`    App Access: ${policy.app_access ? '✅ Yes' : '❌ No'}`);

      // Get permissions for this policy
      const permissions = await getPermissions(token, policy.id);

      // Group by collection
      const byCollection = {};
      permissions.forEach(perm => {
        if (!byCollection[perm.collection]) {
          byCollection[perm.collection] = [];
        }
        byCollection[perm.collection].push(perm.action);
      });

      console.log(`    Collections (${Object.keys(byCollection).length}):`);

      // Show service_providers and news specifically
      ['service_providers', 'news', 'strategies'].forEach(col => {
        if (byCollection[col]) {
          console.log(`      - ${col}: ${byCollection[col].join(', ')}`);
        }
      });
    }

    console.log('');
    console.log('================================================');
    console.log('');

    // Try to create a test item
    console.log('🧪 Testing Create Permission:');
    console.log('------------------------------------------------');

    const testProvider = {
      id: 'test-provider',
      name: 'Test Provider',
      slug: 'test-provider',
      description: 'This is a test',
      category: 'dex',
      provider_type: 'dex',
      website_url: 'https://test.com',
      chains: ['Ethereum'],
      tags: ['test'],
      security_score: 5,
      rating: 5,
      review_count: 0,
      status: 'draft',
      view_count: 0,
      bookmark_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: new Date().toISOString(),
    };

    const testResponse = await fetch(`${DIRECTUS_URL}/items/service_providers`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testProvider),
    });

    if (testResponse.ok) {
      console.log('  ✅ Successfully created test item');
      const created = await testResponse.json();
      console.log(`     ID: ${created.data.id}`);

      // Delete the test item
      const deleteResponse = await fetch(`${DIRECTUS_URL}/items/service_providers/${created.data.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (deleteResponse.ok) {
        console.log('  ✅ Test item cleaned up');
      }
    } else {
      const error = await testResponse.text();
      console.log('  ❌ Failed to create test item');
      console.log(`     Error: ${error}`);
    }

    console.log('');
    console.log('================================================');
    console.log('');

  } catch (error) {
    console.error('');
    console.error('❌ Error:', error.message);
    console.error('');
    process.exit(1);
  }
}

main();
