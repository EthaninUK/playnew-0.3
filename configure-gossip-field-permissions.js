const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_ADMIN_EMAIL = 'the_uk1@outlook.com';
const DIRECTUS_ADMIN_PASSWORD = 'Mygcdjmyxzg2026!';

async function main() {
  try {
    console.log('🔑 Logging in to Directus...');

    // Login to get admin token
    const loginResponse = await axios.post(`${DIRECTUS_URL}/auth/login`, {
      email: DIRECTUS_ADMIN_EMAIL,
      password: DIRECTUS_ADMIN_PASSWORD,
    });

    const token = loginResponse.data.data.access_token;
    console.log('✅ Login successful');

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    // Get the Public role ID
    console.log('\n🔍 Finding Public role...');
    const rolesResponse = await axios.get(`${DIRECTUS_URL}/roles`, { headers });
    const publicRole = rolesResponse.data.data.find(role => role.name === 'Public');

    if (!publicRole) {
      console.error('❌ Public role not found');
      return;
    }

    console.log(`✅ Found Public role: ${publicRole.id}`);

    // Get existing permissions for news collection
    console.log('\n🔍 Checking existing permissions for news collection...');
    const permissionsResponse = await axios.get(
      `${DIRECTUS_URL}/permissions?filter[collection][_eq]=news&filter[role][_eq]=${publicRole.id}`,
      { headers }
    );

    const readPermission = permissionsResponse.data.data.find(p => p.action === 'read');

    if (!readPermission) {
      console.log('⚠️  No read permission found for news collection');
      console.log('Creating new read permission with gossip fields...');

      // Create new read permission
      await axios.post(
        `${DIRECTUS_URL}/permissions`,
        {
          collection: 'news',
          action: 'read',
          role: publicRole.id,
          fields: '*', // Allow all fields
          permissions: {
            status: { _eq: 'published' }
          }
        },
        { headers }
      );

      console.log('✅ Created new read permission with all fields');
    } else {
      console.log(`✅ Found existing read permission: ${readPermission.id}`);
      console.log(`   Current fields: ${readPermission.fields || 'None specified'}`);

      // Update permission to include gossip fields
      console.log('\n📝 Updating permission to include gossip fields...');

      const gossipFields = [
        'credibility_score',
        'hotness_score',
        'verification_status',
        'gossip_tags',
        'likes_count',
        'comments_count'
      ];

      // If fields is already '*', no need to update
      if (readPermission.fields === '*') {
        console.log('✅ Permission already allows all fields (*)');
      } else {
        // Update to allow all fields
        await axios.patch(
          `${DIRECTUS_URL}/permissions/${readPermission.id}`,
          {
            fields: '*' // Set to all fields
          },
          { headers }
        );

        console.log('✅ Updated permission to allow all fields');
      }
    }

    // Verify the new fields are accessible
    console.log('\n🔍 Verifying gossip fields are accessible...');
    try {
      const testResponse = await axios.get(
        `${DIRECTUS_URL}/items/news?filter[news_type][_eq]=gossip&limit=1&fields=id,hotness_score,credibility_score,verification_status,gossip_tags,likes_count,comments_count`
      );

      if (testResponse.data.data.length > 0) {
        console.log('✅ Gossip fields are now accessible!');
        console.log('Sample data:', JSON.stringify(testResponse.data.data[0], null, 2));
      } else {
        console.log('⚠️  No gossip data found to test with');
      }
    } catch (error) {
      console.error('❌ Field verification failed:', error.response?.data || error.message);
    }

    console.log('\n✨ Configuration complete!');

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

main();
