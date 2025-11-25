const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_EMAIL = 'the_uk1@outlook.com';
const DIRECTUS_PASSWORD = 'Mygcdjmyxzg2026!';

async function login() {
  const response = await axios.post(`${DIRECTUS_URL}/auth/login`, {
    email: DIRECTUS_EMAIL,
    password: DIRECTUS_PASSWORD,
  });
  return response.data.data.access_token;
}

async function setupPermissions(token) {
  try {
    // Step 1: Get Public role
    const rolesRes = await axios.get(`${DIRECTUS_URL}/roles?filter[name][_eq]=Public`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (rolesRes.data.data.length === 0) {
      console.log('❌ Public role not found');
      return false;
    }

    const publicRoleId = rolesRes.data.data[0].id;
    console.log('✅ Found Public role:', publicRoleId);

    // Step 2: Get or create Public Access policy
    let publicPolicyId;
    try {
      const policiesRes = await axios.get(`${DIRECTUS_URL}/policies?filter[name][_eq]=Public Access`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (policiesRes.data.data.length > 0) {
        publicPolicyId = policiesRes.data.data[0].id;
        console.log('✅ Found Public Access policy:', publicPolicyId);
      } else {
        // Create policy
        const newPolicyRes = await axios.post(
          `${DIRECTUS_URL}/policies`,
          {
            name: 'Public Access',
            icon: 'public',
            description: 'Public access policy',
            admin_access: false,
            app_access: false,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        publicPolicyId = newPolicyRes.data.data.id;
        console.log('✅ Created Public Access policy:', publicPolicyId);

        // Link role to policy
        await axios.post(
          `${DIRECTUS_URL}/access`,
          {
            role: publicRoleId,
            policy: publicPolicyId,
            sort: 1,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('✅ Linked role to policy');
      }
    } catch (error) {
      console.error('Error with policies:', error.response?.data || error.message);
      return false;
    }

    // Step 3: Create permission
    try {
      const permission = {
        policy: publicPolicyId,
        collection: 'arbitrage_types',
        action: 'read',
        permissions: {
          status: {
            _eq: 'published',
          },
        },
        validation: {},
        fields: '*',
      };

      await axios.post(`${DIRECTUS_URL}/permissions`, permission, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('✅ Created public read permission for arbitrage_types');
      return true;
    } catch (error) {
      if (error.response?.data?.errors?.[0]?.extensions?.code === 'RECORD_NOT_UNIQUE') {
        console.log('ℹ️  Permission already exists');
        return true;
      }
      console.error('❌ Error creating permission:', error.response?.data || error.message);
      return false;
    }
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    return false;
  }
}

async function testAccess() {
  try {
    // Test without authentication (public access)
    const response = await axios.get(`${DIRECTUS_URL}/items/arbitrage_types`, {
      params: {
        filter: { status: { _eq: 'published' } },
        limit: 1,
      },
    });

    console.log('\n✅ Public access test successful!');
    console.log(`   Found ${response.data.data.length} published arbitrage type(s)`);
    if (response.data.data.length > 0) {
      console.log(`   Example: ${response.data.data[0].title}`);
    }
    return true;
  } catch (error) {
    console.error('\n❌ Public access test failed:', error.response?.status, error.response?.statusText);
    return false;
  }
}

async function main() {
  console.log('🔧 Setting up arbitrage_types public permissions...\n');

  const token = await login();
  console.log('✅ Logged in\n');

  const success = await setupPermissions(token);

  if (success) {
    console.log('\n🧪 Testing public access...');
    const accessWorks = await testAccess();

    if (accessWorks) {
      console.log('\n🎉 All done! Please refresh your browser.');
      console.log('   Visit: http://localhost:3000/arbitrage/types');
    } else {
      console.log('\n⚠️  Permissions set but public access test failed.');
      console.log('   Please check Directus admin UI manually.');
    }
  } else {
    console.log('\n❌ Failed to set up permissions.');
    console.log('📌 Please set permissions manually in Directus Admin UI:');
    console.log('   http://localhost:8055/admin/settings/roles');
  }
}

main();
