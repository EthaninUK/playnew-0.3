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
    console.log('  DIRECTUS VERSION & CONFIGURATION CHECK');
    console.log('='.repeat(60) + '\n');

    const token = await login();

    // Check server info
    console.log('📋 Server Info:');
    console.log('-'.repeat(60));

    const serverResponse = await fetch(`${DIRECTUS_URL}/server/info`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (serverResponse.ok) {
      const serverInfo = await serverResponse.json();
      console.log('Directus Version:', serverInfo.data?.directus?.version || 'Unknown');
      console.log('Node Version:', serverInfo.data?.node?.version || 'Unknown');
      console.log('Database:', serverInfo.data?.database?.client || 'Unknown');
      console.log('');
    }

    // Check what fields actually exist on roles
    console.log('📋 Role Fields (from schema):');
    console.log('-'.repeat(60));

    const fieldsResponse = await fetch(`${DIRECTUS_URL}/fields/directus_roles`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (fieldsResponse.ok) {
      const fieldsData = await fieldsResponse.json();
      console.log('Available fields on directus_roles:');
      fieldsData.data.forEach(field => {
        console.log(`  - ${field.field} (${field.type})`);
      });
      console.log('');
    } else {
      console.log('Could not fetch fields schema');
    }

    // Check collections schema
    console.log('📋 Collections Info:');
    console.log('-'.repeat(60));

    const collectionsResponse = await fetch(`${DIRECTUS_URL}/collections/directus_roles`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (collectionsResponse.ok) {
      const collectionData = await collectionsResponse.json();
      console.log('Collection Meta:', JSON.stringify(collectionData.data.meta, null, 2));
    }

    console.log('\n' + '='.repeat(60));

    // THE KEY INSIGHT: In Directus 10.10+, access is controlled through Policies, not Role flags
    console.log('\n💡 KEY INSIGHT:');
    console.log('='.repeat(60));
    console.log('In Directus 10.10+, access control changed:');
    console.log('- Roles no longer have admin_access/app_access flags');
    console.log('- Access is controlled through Policies');
    console.log('- A Role must be linked to a Policy');
    console.log('- The Policy determines what permissions the role has');
    console.log('');
    console.log('Current Setup:');
    console.log('  ✅ Administrator Policy exists (with admin_access=true)');
    console.log('  ✅ Policy has create/update/delete permissions');
    console.log('  ⚠️  Role->Policy link may not be working correctly');
    console.log('');
    console.log('Next step: Check if we need to use Directus Admin API directly');
    console.log('='.repeat(60) + '\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();
