#!/usr/bin/env node

/**
 * Check and fix Directus permissions
 * Diagnose why public access is not working
 */

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

async function getPermissions(token, policyId = null) {
  let url = `${DIRECTUS_URL}/permissions?limit=-1`;
  if (policyId) {
    url += `&filter[policy][_eq]=${policyId}`;
  }

  const response = await fetch(url, {
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

async function createPermission(token, policyId, collection, action = 'read') {
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
    console.log('  Diagnose Directus Permissions');
    console.log('================================================');
    console.log('');

    const token = await login();
    console.log('✅ Logged in\n');

    // Get all policies
    console.log('📋 Checking policies...\n');
    const policies = await getPolicies(token);

    console.log('Found policies:');
    policies.forEach(policy => {
      console.log(`  - ${policy.name} (ID: ${policy.id})`);
      console.log(`    Public: ${policy.public_registration ? 'Yes' : 'No'}`);
      console.log(`    Admin: ${policy.admin_access ? 'Yes' : 'No'}`);
    });

    // Find public policy
    const publicPolicy = policies.find(p =>
      p.name.toLowerCase().includes('public') ||
      p.public_registration === true ||
      p.id === 'abf8a154-5b1c-4a46-ac9c-7300570f4f17'
    );

    if (!publicPolicy) {
      console.log('\n⚠️  No public policy found!');
      console.log('This might be the issue. You may need to create a public policy first.');
      return;
    }

    console.log(`\n✅ Using policy: ${publicPolicy.name} (${publicPolicy.id})\n`);

    // Get existing permissions for this policy
    console.log('📋 Checking permissions for this policy...\n');
    const permissions = await getPermissions(token, publicPolicy.id);

    console.log(`Found ${permissions.length} permissions:`);

    const permissionsByCollection = {};
    permissions.forEach(perm => {
      if (!permissionsByCollection[perm.collection]) {
        permissionsByCollection[perm.collection] = [];
      }
      permissionsByCollection[perm.collection].push(perm.action);
    });

    Object.entries(permissionsByCollection).forEach(([collection, actions]) => {
      console.log(`  - ${collection}: ${actions.join(', ')}`);
    });

    // Check which collections are missing
    const requiredCollections = [
      'categories', 'tags', 'chains', 'protocols',
      'strategies', 'news', 'service_providers'
    ];

    console.log('\n📊 Status:\n');
    const missing = [];
    requiredCollections.forEach(collection => {
      const hasRead = permissionsByCollection[collection]?.includes('read');
      if (hasRead) {
        console.log(`  ✅ ${collection}: Has read permission`);
      } else {
        console.log(`  ❌ ${collection}: Missing read permission`);
        missing.push(collection);
      }
    });

    if (missing.length > 0) {
      console.log('\n🔧 Attempting to create missing permissions...\n');

      for (const collection of missing) {
        console.log(`  Creating read permission for ${collection}...`);
        const success = await createPermission(token, publicPolicy.id, collection);
        if (success) {
          console.log(`    ✅ Created`);
        } else {
          console.log(`    ❌ Failed`);
        }
      }
    }

    console.log('\n================================================');
    console.log('🎉 Done!');
    console.log('================================================');
    console.log('');
    console.log('Test public access:');
    console.log('  curl http://localhost:8055/items/categories');
    console.log('');

  } catch (error) {
    console.error('');
    console.error('❌ Error:', error.message);
    console.error('');
    process.exit(1);
  }
}

main();
