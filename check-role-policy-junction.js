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
    console.log('  ROLE-POLICY JUNCTION TABLE CHECK');
    console.log('='.repeat(60) + '\n');

    const token = await login();

    const roleId = '58a14a28-c0af-436c-88ec-5214352eac5e';
    const policyId = '79547eb7-e735-4c78-a8f9-7768b02b1bd5';

    // Try to find the junction table name
    console.log('🔍 Finding Junction Table:');
    console.log('-'.repeat(60));

    const possibleNames = [
      'directus_access_policies',
      'directus_policies_roles',
      'directus_roles_policies',
      'access_policies',
      'policies_roles',
      'roles_policies',
    ];

    let junctionTableName = null;

    for (const tableName of possibleNames) {
      const response = await fetch(`${DIRECTUS_URL}/items/${tableName}?limit=1`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        console.log(`✅ Found: ${tableName}`);
        junctionTableName = tableName;
        break;
      }
    }

    if (!junctionTableName) {
      console.log('❌ Could not find junction table with common names');
      console.log('\nLet me check the collections list...\n');

      const collectionsResponse = await fetch(`${DIRECTUS_URL}/collections`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (collectionsResponse.ok) {
        const collections = await collectionsResponse.json();
        console.log('All collections:');
        collections.data.forEach(col => {
          if (col.collection.includes('polic') || col.collection.includes('role')) {
            console.log(`  - ${col.collection}`);
          }
        });
      }
      console.log('');
      return;
    }

    // Get all links
    console.log('\n📋 Current Role-Policy Links:');
    console.log('-'.repeat(60));

    const linksResponse = await fetch(`${DIRECTUS_URL}/items/${junctionTableName}?fields=*&limit=-1`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (linksResponse.ok) {
      const links = await linksResponse.json();
      console.log(`Found ${links.data.length} links:`);

      links.data.forEach((link, idx) => {
        console.log(`\nLink ${idx + 1}:`);
        console.log(`  ID: ${link.id}`);
        console.log(`  Role: ${link.role}`);
        console.log(`  Policy: ${link.policy}`);
        console.log(`  Is our target? ${link.role === roleId ? '✅' : '❌'}`);
      });

      const ourLink = links.data.find(l => l.role === roleId);

      if (!ourLink) {
        console.log('\n⚠️  Administrator role is NOT linked to any policy!');
        console.log('     Creating link now...\n');

        const createResponse = await fetch(`${DIRECTUS_URL}/items/${junctionTableName}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            role: roleId,
            policy: policyId,
          }),
        });

        if (createResponse.ok) {
          const created = await createResponse.json();
          console.log('✅ Link created successfully!');
          console.log(`   Link ID: ${created.data.id}`);
          console.log(`   Role: ${created.data.role}`);
          console.log(`   Policy: ${created.data.policy}`);
        } else {
          const error = await createResponse.text();
          console.log('❌ Failed to create link:');
          console.log(error);
        }
      } else if (ourLink.policy !== policyId) {
        console.log(`\n⚠️  Role is linked to policy ${ourLink.policy}, not the Admin policy ${policyId}`);
        console.log('     Updating link...\n');

        const updateResponse = await fetch(`${DIRECTUS_URL}/items/${junctionTableName}/${ourLink.id}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            policy: policyId,
          }),
        });

        if (updateResponse.ok) {
          console.log('✅ Link updated to Administrator policy!');
        } else {
          const error = await updateResponse.text();
          console.log('❌ Failed to update link:');
          console.log(error);
        }
      } else {
        console.log('\n✅ Role is correctly linked to Administrator policy!');
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('  TEST DATA CREATION NOW');
    console.log('='.repeat(60));
    console.log('\nRun: node add-sample-providers.js');
    console.log('');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
