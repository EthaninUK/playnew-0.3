const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';
const ADMIN_EMAIL = 'the_uk1@outlook.com';
const ADMIN_PASSWORD = 'Mygcdjmyxzg2026!';

async function fixPermissions() {
  try {
    // Login
    console.log('Logging in to Directus...');
    const loginResponse = await axios.post(`${DIRECTUS_URL}/auth/login`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    });

    const token = loginResponse.data.data.access_token;
    console.log('✓ Logged in successfully');

    const headers = { Authorization: `Bearer ${token}` };

    // Get current user's role
    const userResponse = await axios.get(`${DIRECTUS_URL}/users/me`, { headers });
    const roleId = userResponse.data.data.role;
    console.log('User role ID:', roleId);

    // Get current permissions for user_subscriptions
    console.log('\n=== Current permissions for user_subscriptions ===');
    const permissionsResponse = await axios.get(
      `${DIRECTUS_URL}/permissions?filter[collection][_eq]=user_subscriptions&filter[role][_eq]=${roleId}`,
      { headers }
    );
    console.log('Existing permissions:', permissionsResponse.data.data.length);
    permissionsResponse.data.data.forEach(perm => {
      console.log(`  - Action: ${perm.action}, Fields: ${perm.fields || 'all'}`);
    });

    // Check if public role can read
    console.log('\n=== Checking public role permissions ===');
    const publicPermsResponse = await axios.get(
      `${DIRECTUS_URL}/permissions?filter[collection][_eq]=user_subscriptions&filter[role][_null]=true`,
      { headers }
    );
    console.log('Public permissions:', publicPermsResponse.data.data.length);

    // Get all roles
    console.log('\n=== All roles ===');
    const rolesResponse = await axios.get(`${DIRECTUS_URL}/roles`, { headers });
    rolesResponse.data.data.forEach(role => {
      console.log(`  - ${role.name} (ID: ${role.id})`);
    });

    // Create/Update permissions for the user's role
    console.log('\n=== Creating/Updating permissions ===');

    const permissionActions = ['create', 'read', 'update', 'delete'];

    for (const action of permissionActions) {
      try {
        // Check if permission exists
        const existingPerm = permissionsResponse.data.data.find(p => p.action === action);

        if (existingPerm) {
          console.log(`Updating ${action} permission...`);
          await axios.patch(
            `${DIRECTUS_URL}/permissions/${existingPerm.id}`,
            {
              permissions: {}, // No restrictions
              fields: '*',
              validation: null,
              presets: null,
            },
            { headers }
          );
          console.log(`✓ Updated ${action} permission`);
        } else {
          console.log(`Creating ${action} permission...`);
          await axios.post(
            `${DIRECTUS_URL}/permissions`,
            {
              collection: 'user_subscriptions',
              action: action,
              role: roleId,
              permissions: {},
              fields: '*',
              validation: null,
              presets: null,
            },
            { headers }
          );
          console.log(`✓ Created ${action} permission`);
        }
      } catch (error) {
        console.error(`Error handling ${action} permission:`, error.response?.data || error.message);
      }
    }

    // Also ensure memberships can be read (for the join)
    console.log('\n=== Ensuring memberships read permission ===');
    const membershipPerms = await axios.get(
      `${DIRECTUS_URL}/permissions?filter[collection][_eq]=memberships&filter[role][_eq]=${roleId}&filter[action][_eq]=read`,
      { headers }
    );

    if (membershipPerms.data.data.length === 0) {
      console.log('Creating memberships read permission...');
      await axios.post(
        `${DIRECTUS_URL}/permissions`,
        {
          collection: 'memberships',
          action: 'read',
          role: roleId,
          permissions: {},
          fields: '*',
        },
        { headers }
      );
      console.log('✓ Created memberships read permission');
    } else {
      console.log('✓ Memberships read permission already exists');
    }

    console.log('\n✅ All permissions fixed!');

    // Test the query again
    console.log('\n=== Testing query with filters ===');
    const userId = userResponse.data.data.id;
    const testResponse = await axios.get(
      `${DIRECTUS_URL}/items/user_subscriptions?filter[user_id][_eq]=${userId}&fields=*,membership_id.*`,
      { headers }
    );
    console.log('Test query result:', JSON.stringify(testResponse.data, null, 2));

  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

fixPermissions();
