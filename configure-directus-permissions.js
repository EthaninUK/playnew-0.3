#!/usr/bin/env node

/**
 * Configure Directus Permissions
 * Sets up Public role to allow read-only access to content
 */

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_EMAIL = 'the_uk1@outlook.com';
const DIRECTUS_PASSWORD = 'Mygcdjmyxzg2026!';

// Collections that should be publicly readable
const publicReadCollections = [
  'strategies',
  'news',
  'service_providers',
  'categories',
  'tags',
  'chains',
  'protocols'
];

// Collections that require authentication
const authenticatedCollections = [
  'users',
  'comments',
  'user_interactions'
];

async function login() {
  console.log('🔐 Logging in to Directus...\n');
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
  console.log('✅ Logged in\n');
  return data.data.access_token;
}

async function getRoles(token) {
  const response = await fetch(`${DIRECTUS_URL}/roles`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get roles');
  }

  const data = await response.json();
  return data.data;
}

async function getPermissions(token, roleId) {
  const response = await fetch(`${DIRECTUS_URL}/permissions?filter[role][_eq]=${roleId}`, {
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

async function getPolicies(token) {
  const response = await fetch(`${DIRECTUS_URL}/policies`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    console.warn('⚠️  Could not fetch policies, status:', response.status);
    return [];
  }

  const data = await response.json();
  return data.data;
}

async function createPermission(token, permission) {
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
    if (!error.includes('already exists')) {
      console.error(`    ⚠️  Warning: ${error.substring(0, 100)}`);
    }
    return false;
  }

  return true;
}

async function deletePermission(token, permissionId) {
  const response = await fetch(`${DIRECTUS_URL}/permissions/${permissionId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  return response.ok;
}

async function main() {
  try {
    console.log('');
    console.log('================================================');
    console.log('  Configure Directus Permissions');
    console.log('================================================');
    console.log('');

    const token = await login();

    // Get all roles
    console.log('📋 Fetching roles...\n');
    const roles = await getRoles(token);

    // Find Public role (null role_id means public)
    const publicRole = roles.find(r => r.name === 'Public' || r.id === null);

    if (!publicRole) {
      console.log('⚠️  Public role not found. Directus should have a default Public role.');
      console.log('Creating permissions for NULL role (public access)...\n');
    } else {
      console.log(`✅ Found Public role: ${publicRole.name} (ID: ${publicRole.id})\n`);
    }

    // Use null for public role
    const publicRoleId = null;

    // Get existing permissions for public role
    console.log('📋 Checking existing permissions...\n');
    const existingPermissions = await getPermissions(token, publicRoleId);
    console.log(`Found ${existingPermissions.length} existing public permissions\n`);

    // Fetch policies to attach to permissions if required
    const policies = await getPolicies(token);
    const publicPolicy = policies.find(p => (p.name || '').toLowerCase().includes('public'))
      || policies.find(p => p.system);

    if (publicPolicy) {
      console.log(`🛡️  Using policy: ${publicPolicy.name || publicPolicy.id}\n`);
    } else {
      console.log('ℹ️  No specific policy found; permissions will rely on Directus default.\n');
    }

    let created = 0;
    let skipped = 0;

    // Create read permissions for public collections
    console.log('🔓 Setting up public read access...\n');
    for (const collection of publicReadCollections) {
      console.log(`  📖 ${collection}`);

      // Check if permission already exists
      const existing = existingPermissions.find(
        p => p.collection === collection && p.action === 'read'
      );

      if (existing) {
        console.log(`    ℹ️  Read permission already exists`);
        skipped++;
        continue;
      }

      // Create read permission
      const permission = {
        role: publicRoleId,
        collection,
        action: 'read',
        permissions: {}, // No filters - allow reading all items
        validation: {}, // No validation rules
        presets: null,
        fields: ['*'], // All fields
      };

      if (publicPolicy?.id) {
        permission.policy = publicPolicy.id;
      }

      const success = await createPermission(token, permission);
      if (success) {
        console.log(`    ✅ Read access granted`);
        created++;
      } else {
        skipped++;
      }
    }

    console.log('');
    console.log('🔒 Authenticated collections (no public access):');
    authenticatedCollections.forEach(col => {
      console.log(`  🔐 ${col} - Requires authentication`);
    });

    console.log('');
    console.log('================================================');
    console.log('📊 Summary:');
    console.log(`  ✅ Created: ${created} permissions`);
    console.log(`  ⏭️  Skipped: ${skipped} (already exist)`);
    console.log('================================================');
    console.log('');
    console.log('🎉 Permissions configured!');
    console.log('');
    console.log('Test public API access:');
    console.log('  curl http://localhost:8055/items/strategies?limit=5');
    console.log('  curl http://localhost:8055/items/news?limit=5');
    console.log('  curl http://localhost:8055/items/categories');
    console.log('');
    console.log('These endpoints should now work WITHOUT authentication!');
    console.log('');

  } catch (error) {
    console.error('');
    console.error('❌ Error:', error.message);
    console.error('');
    process.exit(1);
  }
}

main();
