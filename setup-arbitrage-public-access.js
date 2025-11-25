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

async function setupPublicAccess(token) {
  try {
    // Get Public role ID
    const rolesResponse = await axios.get(`${DIRECTUS_URL}/roles?filter[name][_eq]=Public`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (rolesResponse.data.data.length === 0) {
      console.log('❌ Public role not found');
      return;
    }

    const publicRoleId = rolesResponse.data.data[0].id;
    console.log('✅ Found Public role:', publicRoleId);

    // Check if permission already exists
    let existingPermissions;
    try {
      const permsResponse = await axios.get(`${DIRECTUS_URL}/permissions`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          'filter[role][_eq]': publicRoleId,
          'filter[collection][_eq]': 'arbitrage_types'
        }
      });
      existingPermissions = permsResponse.data.data;
    } catch (error) {
      console.log('Cannot check existing permissions (permission denied), continuing...');
      existingPermissions = [];
    }

    if (existingPermissions && existingPermissions.length > 0) {
      console.log('ℹ️  Permission already exists, updating...');
      // Delete existing permission
      for (const perm of existingPermissions) {
        try {
          await axios.delete(`${DIRECTUS_URL}/permissions/${perm.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log(`✅ Deleted old permission: ${perm.id}`);
        } catch (error) {
          console.log(`⚠️  Could not delete permission ${perm.id}`);
        }
      }
    }

    // Create read permission
    const permission = {
      role: publicRoleId,
      collection: 'arbitrage_types',
      action: 'read',
      permissions: {
        status: {
          _eq: 'published',
        },
      },
      fields: ['*'],
    };

    try {
      await axios.post(`${DIRECTUS_URL}/permissions`, permission, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('✅ Created public read permission for arbitrage_types');
    } catch (error) {
      console.error('❌ Error creating permission:', error.response?.data || error.message);
      console.log('\n📌 Please manually set up permissions in Directus Admin:');
      console.log('1. Go to http://localhost:8055/admin/settings/roles/3ed2965e-10a4-4fe4-b84d-905cc22bccd9');
      console.log('2. Scroll to "Permissions" section');
      console.log('3. Find "arbitrage_types" collection');
      console.log('4. Enable "Read" permission');
      console.log('5. Set filter: status = published');
      console.log('6. Select all fields (*)');
      console.log('7. Save');
    }
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

async function main() {
  console.log('🔐 Setting up public access for arbitrage_types...\n');

  const token = await login();
  console.log('✅ Logged in\n');

  await setupPublicAccess(token);

  console.log('\n✨ Done! Please refresh your browser to see the changes.');
}

main();
