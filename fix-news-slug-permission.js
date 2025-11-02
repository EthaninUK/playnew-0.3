const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_EMAIL = 'the_uk1@outlook.com';
const DIRECTUS_PASSWORD = 'Mygcdjmyxzg2026!';

async function fixSlugPermission() {
  console.log('🔧 Fixing news slug field permission...\n');

  try {
    // Login
    console.log('🔐 Logging in...');
    const loginResponse = await axios.post(`${DIRECTUS_URL}/auth/login`, {
      email: DIRECTUS_EMAIL,
      password: DIRECTUS_PASSWORD
    });
    const token = loginResponse.data.data.access_token;
    console.log('✅ Logged in\n');

    // Get user role
    const meResponse = await axios.get(`${DIRECTUS_URL}/users/me?fields=role.id,role.name`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const roleId = meResponse.data.data.role.id;
    const roleName = meResponse.data.data.role.name;
    console.log(`👤 User role: ${roleName} (${roleId})\n`);

    // Check current permissions for news collection
    console.log('📋 Checking current permissions for news collection...');
    const permissionsResponse = await axios.get(
      `${DIRECTUS_URL}/permissions?filter[role][_eq]=${roleId}&filter[collection][_eq]=news`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );

    const permissions = permissionsResponse.data.data;
    console.log(`   Found ${permissions.length} permissions`);

    // Find CREATE permission
    const createPermission = permissions.find(p => p.action === 'create');

    if (createPermission) {
      console.log(`\n✅ CREATE permission exists (ID: ${createPermission.id})`);
      console.log(`   Fields: ${createPermission.fields?.join(', ') || 'ALL (*)'}` );
      console.log(`   Presets: ${JSON.stringify(createPermission.presets || {})}`);

      // Check if slug is in fields or if fields is null/['*']
      if (createPermission.fields === null || createPermission.fields?.includes('*')) {
        console.log(`\n✅ Permission allows all fields (including slug)`);
      } else if (createPermission.fields?.includes('slug')) {
        console.log(`\n✅ Permission explicitly includes slug`);
      } else {
        console.log(`\n⚠️  Permission does NOT include slug field`);
        console.log(`   Updating permission to include slug...`);

        await axios.patch(
          `${DIRECTUS_URL}/permissions/${createPermission.id}`,
          {
            fields: [...(createPermission.fields || []), 'slug']
          },
          { headers: { 'Authorization': `Bearer ${token}` } }
        );

        console.log(`✅ Added slug to CREATE permission`);
      }
    } else {
      console.log(`\n⚠️  No CREATE permission found`);
    }

    // Also check READ permission for slug (needed for checking if exists)
    const readPermission = permissions.find(p => p.action === 'read');

    if (readPermission) {
      console.log(`\n✅ READ permission exists (ID: ${readPermission.id})`);
      console.log(`   Fields: ${readPermission.fields?.join(', ') || 'ALL (*)'}`);

      if (readPermission.fields && !readPermission.fields.includes('*') && !readPermission.fields.includes('slug')) {
        console.log(`   Updating READ permission to include slug...`);

        await axios.patch(
          `${DIRECTUS_URL}/permissions/${readPermission.id}`,
          {
            fields: [...(readPermission.fields || []), 'slug']
          },
          { headers: { 'Authorization': `Bearer ${token}` } }
        );

        console.log(`✅ Added slug to READ permission`);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ Permission check complete!');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.response) {
      console.error('   Response:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

fixSlugPermission();
