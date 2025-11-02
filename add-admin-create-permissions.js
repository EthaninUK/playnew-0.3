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

async function getPolicies(token) {
  const response = await fetch(`${DIRECTUS_URL}/policies`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get policies');
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

async function createPermission(token, policyId, collection, action) {
  const permission = {
    policy: policyId,
    collection,
    action,
    permissions: {},
    validation: {},
    presets: null,
    fields: ['*']
  };

  const response = await fetch(`${DIRECTUS_URL}/permissions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(permission),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`      Error: ${error.substring(0, 150)}`);
    return false;
  }

  return true;
}

async function main() {
  try {
    console.log('');
    console.log('================================================');
    console.log('  Add Create Permissions for Admin User');
    console.log('================================================');
    console.log('');

    const token = await login();
    console.log('✅ Logged in\n');

    // Get admin policy
    const policies = await getPolicies(token);
    const adminPolicy = policies.find(p => p.admin_access === true || p.name.toLowerCase().includes('admin'));

    if (!adminPolicy) {
      console.log('⚠️  No admin policy found!');
      return;
    }

    console.log(`✅ Found admin policy: ${adminPolicy.name} (${adminPolicy.id})\n`);

    // Get existing permissions
    const permissions = await getPermissions(token, adminPolicy.id);
    const permissionsByCollection = {};
    permissions.forEach(perm => {
      if (!permissionsByCollection[perm.collection]) {
        permissionsByCollection[perm.collection] = [];
      }
      permissionsByCollection[perm.collection].push(perm.action);
    });

    // Collections that need create permission
    const collections = ['service_providers', 'news'];

    console.log('📊 Checking permissions...\n');

    for (const collection of collections) {
      const hasCreate = permissionsByCollection[collection]?.includes('create');
      const hasUpdate = permissionsByCollection[collection]?.includes('update');
      const hasDelete = permissionsByCollection[collection]?.includes('delete');

      console.log(`  ${collection}:`);
      console.log(`    Read: ✅`);
      console.log(`    Create: ${hasCreate ? '✅' : '❌'}`);
      console.log(`    Update: ${hasUpdate ? '✅' : '❌'}`);
      console.log(`    Delete: ${hasDelete ? '✅' : '❌'}`);

      // Add missing permissions
      const actionsToAdd = [];
      if (!hasCreate) actionsToAdd.push('create');
      if (!hasUpdate) actionsToAdd.push('update');
      if (!hasDelete) actionsToAdd.push('delete');

      if (actionsToAdd.length > 0) {
        console.log(`\n  🔧 Adding missing permissions for ${collection}...`);
        for (const action of actionsToAdd) {
          const success = await createPermission(token, adminPolicy.id, collection, action);
          if (success) {
            console.log(`    ✅ Added ${action} permission`);
          } else {
            console.log(`    ❌ Failed to add ${action} permission`);
          }
        }
      }
      console.log('');
    }

    console.log('================================================');
    console.log('🎉 Done!');
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
