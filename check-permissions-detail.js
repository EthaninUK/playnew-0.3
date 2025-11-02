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
    console.log('  DETAILED PERMISSIONS CHECK');
    console.log('='.repeat(60) + '\n');

    const token = await login();

    const policyId = '79547eb7-e735-4c78-a8f9-7768b02b1bd5';

    // Get FULL permission details
    console.log('📋 Administrator Policy Permissions (FULL DETAIL):');
    console.log('-'.repeat(60));

    const permsResponse = await fetch(
      `${DIRECTUS_URL}/permissions?filter[policy][_eq]=${policyId}&filter[collection][_in]=service_providers,news&fields=*&limit=-1`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (permsResponse.ok) {
      const perms = await permsResponse.json();
      console.log(`Found ${perms.data.length} permissions:\n`);

      perms.data.forEach((perm, idx) => {
        console.log(`Permission ${idx + 1}:`);
        console.log(`  ID: ${perm.id}`);
        console.log(`  Collection: ${perm.collection}`);
        console.log(`  Action: ${perm.action}`);
        console.log(`  Fields: ${JSON.stringify(perm.fields)}`);
        console.log(`  Permissions: ${JSON.stringify(perm.permissions)}`);
        console.log(`  Validation: ${JSON.stringify(perm.validation)}`);
        console.log(`  Presets: ${JSON.stringify(perm.presets)}`);
        console.log('');
      });

      // Check if there are ANY restrictions
      const hasRestrictions = perms.data.some(p =>
        (p.permissions && Object.keys(p.permissions).length > 0) ||
        (p.validation && Object.keys(p.validation).length > 0)
      );

      if (hasRestrictions) {
        console.log('⚠️  Some permissions have restrictions/filters!');
      } else {
        console.log('✅ Permissions appear unrestricted');
      }
    }

    // Check if the logged-in user actually gets these permissions
    console.log('\n📋 Effective Permissions for Current User:');
    console.log('-'.repeat(60));

    const myPermsResponse = await fetch(
      `${DIRECTUS_URL}/permissions/me`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (myPermsResponse.ok) {
      const myPermsText = await myPermsResponse.text();
      console.log('Raw response:', myPermsText.substring(0, 500));

      try {
        const myPerms = JSON.parse(myPermsText);

        if (typeof myPerms.data === 'object' && !Array.isArray(myPerms.data)) {
          console.log('\nPermissions are in object format. Checking for our collections...\n');

          // Check service_providers
          if (myPerms.data.service_providers) {
            console.log('✅ service_providers permissions found:');
            console.log(JSON.stringify(myPerms.data.service_providers, null, 2));

            if (myPerms.data.service_providers.create) {
              console.log('\n✅ User CAN create service_providers!');
              console.log('   Access:', myPerms.data.service_providers.create.access);
              console.log('   Fields:', myPerms.data.service_providers.create.fields);
            } else {
              console.log('\n❌ User CANNOT create service_providers!');
            }
          } else {
            console.log('❌ service_providers NOT in effective permissions!');
            console.log('\n🔴 PROBLEM FOUND: collection missing from user permissions');
          }

          console.log('');

          // Check news
          if (myPerms.data.news) {
            console.log('✅ news permissions found:');
            console.log(JSON.stringify(myPerms.data.news, null, 2));
          } else {
            console.log('❌ news NOT in effective permissions!');
          }

        } else if (Array.isArray(myPerms.data)) {
          console.log('\nPermissions in array format (old style)');
        }
      } catch (e) {
        console.log('Error parsing:', e.message);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
