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
  return data.data;
}

async function fetchWithAuth(token, endpoint) {
  const response = await fetch(`${DIRECTUS_URL}${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return { error: true, status: response.status, text: await response.text() };
  }

  return await response.json();
}

async function main() {
  try {
    console.log('\n' + '='.repeat(60));
    console.log('  DEEP DIRECTUS PERMISSION DIAGNOSIS');
    console.log('='.repeat(60) + '\n');

    // Step 1: Login
    console.log('📝 STEP 1: Authentication');
    console.log('-'.repeat(60));
    const authData = await login();
    const token = authData.access_token;
    console.log('✅ Login successful');
    console.log(`   Token: ${token.substring(0, 20)}...${token.substring(token.length - 10)}`);
    console.log('');

    // Step 2: Get current user with full details
    console.log('📝 STEP 2: Current User Details');
    console.log('-'.repeat(60));
    const userData = await fetchWithAuth(token, '/users/me?fields=*,role.*,role.policies.*,role.policies.policies_id.*');

    if (userData.error) {
      console.log('❌ Failed to fetch user:', userData.text);
    } else {
      const user = userData.data;
      console.log(`User ID: ${user.id}`);
      console.log(`Email: ${user.email}`);
      console.log(`Status: ${user.status}`);
      console.log(`Role ID: ${user.role}`);

      if (typeof user.role === 'object') {
        console.log(`\nRole Details:`);
        console.log(`  Name: ${user.role.name}`);
        console.log(`  ID: ${user.role.id}`);
        console.log(`  Admin Access: ${user.role.admin_access}`);
        console.log(`  App Access: ${user.role.app_access}`);

        if (user.role.policies && user.role.policies.length > 0) {
          console.log(`  Linked Policies: ${user.role.policies.length}`);
          user.role.policies.forEach((policyLink, idx) => {
            console.log(`\n  Policy Link ${idx + 1}:`);
            console.log(`    Link ID: ${policyLink.id || 'N/A'}`);
            if (policyLink.policies_id) {
              const policy = policyLink.policies_id;
              console.log(`    Policy Name: ${policy.name || 'N/A'}`);
              console.log(`    Policy ID: ${policy.id || 'N/A'}`);
              console.log(`    Admin Access: ${policy.admin_access || false}`);
            }
          });
        } else {
          console.log(`  ⚠️  NO POLICIES LINKED TO ROLE!`);
        }
      }
    }
    console.log('');

    // Step 3: Get all roles with policies
    console.log('📝 STEP 3: All Roles & Their Policies');
    console.log('-'.repeat(60));
    const rolesData = await fetchWithAuth(token, '/roles?fields=*,policies.policies_id.*');

    if (!rolesData.error) {
      rolesData.data.forEach(role => {
        console.log(`\nRole: ${role.name} (${role.id})`);
        console.log(`  Admin: ${role.admin_access}, App: ${role.app_access}`);
        if (role.policies && role.policies.length > 0) {
          console.log(`  Policies (${role.policies.length}):`);
          role.policies.forEach(p => {
            if (p.policies_id) {
              console.log(`    - ${p.policies_id.name || p.policies_id} (Admin: ${p.policies_id.admin_access})`);
            }
          });
        } else {
          console.log(`  ⚠️  No policies`);
        }
      });
    }
    console.log('');

    // Step 4: Get all policies with permissions
    console.log('📝 STEP 4: All Policies & Their Permissions');
    console.log('-'.repeat(60));
    const policiesData = await fetchWithAuth(token, '/policies');

    if (!policiesData.error) {
      for (const policy of policiesData.data) {
        console.log(`\nPolicy: ${policy.name} (${policy.id})`);
        console.log(`  Admin: ${policy.admin_access}, App: ${policy.app_access}`);

        // Get permissions for this policy
        const permsData = await fetchWithAuth(token, `/permissions?filter[policy][_eq]=${policy.id}&limit=-1`);

        if (!permsData.error && permsData.data) {
          const byCollection = {};
          permsData.data.forEach(perm => {
            if (!byCollection[perm.collection]) {
              byCollection[perm.collection] = [];
            }
            byCollection[perm.collection].push(perm.action);
          });

          console.log(`  Permissions for ${Object.keys(byCollection).length} collections:`);

          // Show our target collections
          ['service_providers', 'news', 'strategies'].forEach(col => {
            if (byCollection[col]) {
              console.log(`    ${col}: ${byCollection[col].join(', ')}`);
            } else {
              console.log(`    ${col}: ❌ NO PERMISSIONS`);
            }
          });
        }
      }
    }
    console.log('');

    // Step 5: Check the access_policies junction table
    console.log('📝 STEP 5: Access Policies Junction Table');
    console.log('-'.repeat(60));
    const junctionData = await fetchWithAuth(token, '/access_policies?fields=*,role.*,policy.*&limit=-1');

    if (junctionData.error) {
      console.log(`❌ Failed to fetch junction: ${junctionData.text}`);
      console.log(`   This might mean the table is named differently`);

      // Try alternative names
      const alternatives = ['roles_policies', 'directus_roles_policies', 'policies_roles'];
      for (const alt of alternatives) {
        console.log(`\n   Trying: /${alt}`);
        const altData = await fetchWithAuth(token, `/${alt}?limit=5`);
        if (!altData.error) {
          console.log(`   ✅ Found! Table exists: ${alt}`);
          console.log(`   Data:`, JSON.stringify(altData.data, null, 2));
        }
      }
    } else {
      console.log(`Found ${junctionData.data.length} role-policy links:`);
      junctionData.data.forEach(link => {
        console.log(`\n  Link:`);
        console.log(`    Role: ${link.role?.name || link.role}`);
        console.log(`    Policy: ${link.policy?.name || link.policy}`);
      });
    }
    console.log('');

    // Step 6: Test permission check endpoint
    console.log('📝 STEP 6: Permission Check Test');
    console.log('-'.repeat(60));

    const permCheckData = await fetchWithAuth(token, '/permissions/me?fields=*');
    if (!permCheckData.error && permCheckData.data) {
      if (Array.isArray(permCheckData.data)) {
        console.log(`Total permissions: ${permCheckData.data.length}`);

        const targetCollections = permCheckData.data.filter(p =>
          ['service_providers', 'news'].includes(p.collection)
        );

        console.log(`\nPermissions for target collections: ${targetCollections.length}`);
        targetCollections.forEach(p => {
          console.log(`  ${p.collection} - ${p.action}: ${p.permissions ? 'with filters' : 'unrestricted'}`);
        });
      } else {
        console.log(`Permission data is not an array:`, permCheckData.data);
      }
    } else {
      console.log(`❌ Cannot check /permissions/me`);
    }
    console.log('');

    // Step 7: Final test - try to create
    console.log('📝 STEP 7: Final Creation Test');
    console.log('-'.repeat(60));

    const testData = {
      name: 'Permission Test',
      slug: 'permission-test-' + Date.now(),
      description: 'Testing permissions',
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
    };

    const createResponse = await fetch(`${DIRECTUS_URL}/items/service_providers`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    if (createResponse.ok) {
      const created = await createResponse.json();
      console.log(`✅ SUCCESS! Created item: ${created.data.id}`);

      // Clean up
      await fetch(`${DIRECTUS_URL}/items/service_providers/${created.data.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      console.log(`   Cleaned up test item`);
    } else {
      const errorText = await createResponse.text();
      console.log(`❌ FAILED to create`);
      console.log(`   Status: ${createResponse.status}`);
      console.log(`   Error: ${errorText}`);
    }

    console.log('\n' + '='.repeat(60));
    console.log('  DIAGNOSIS COMPLETE');
    console.log('='.repeat(60) + '\n');

  } catch (error) {
    console.error('\n❌ Fatal Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
