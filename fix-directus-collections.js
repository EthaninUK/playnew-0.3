#!/usr/bin/env node

/**
 * Fix Directus collections by deleting them completely and letting Directus
 * discover the existing PostgreSQL tables through the UI or Schema Snapshot
 */

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_EMAIL = 'the_uk1@outlook.com';
const DIRECTUS_PASSWORD = 'Mygcdjmyxzg2026!';

async function login() {
  console.log('🔐 Logging in to Directus...');
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
  console.log('✅ Login successful\n');
  return data.data.access_token;
}

async function deleteDirectusCollection(token, collection) {
  console.log(`  🗑️  Deleting Directus collection: ${collection}...`);

  // This will delete only the Directus metadata, not the PostgreSQL table
  const response = await fetch(`${DIRECTUS_URL}/collections/${collection}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok && response.status !== 404) {
    const error = await response.text();
    console.error(`  ⚠️  Warning: ${error}`);
    return false;
  }

  console.log(`  ✅ Deleted`);
  return true;
}

async function refreshSchema(token) {
  console.log('🔄 Triggering schema refresh...');

  const response = await fetch(`${DIRECTUS_URL}/schema/snapshot`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    console.error('⚠️  Schema refresh might have failed');
    return false;
  }

  console.log('✅ Schema refreshed\n');
  return true;
}

async function applyDiff(token) {
  console.log('🔄 Applying schema diff (importing existing tables)...');

  // First get the current snapshot
  const snapshotResponse = await fetch(`${DIRECTUS_URL}/schema/snapshot`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!snapshotResponse.ok) {
    console.error('❌ Failed to get schema snapshot');
    return false;
  }

  const snapshot = await snapshotResponse.json();

  // Get the diff between current state and database
  const diffResponse = await fetch(`${DIRECTUS_URL}/schema/diff`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(snapshot),
  });

  if (!diffResponse.ok) {
    console.error('❌ Failed to get schema diff');
    return false;
  }

  const diff = await diffResponse.json();

  console.log(`Found ${diff.data?.diff?.collections?.length || 0} collections to import`);

  // Apply the diff to import existing tables
  const applyResponse = await fetch(`${DIRECTUS_URL}/schema/apply`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(diff.data),
  });

  if (!applyResponse.ok) {
    const error = await applyResponse.text();
    console.error('❌ Failed to apply schema:', error);
    return false;
  }

  console.log('✅ Schema applied successfully\n');
  return true;
}

async function main() {
  try {
    console.log('');
    console.log('================================================');
    console.log('  Fix Directus Collections');
    console.log('================================================');
    console.log('');

    const token = await login();

    const collections = [
      'strategies',
      'news',
      'service_providers',
      'categories',
      'tags',
      'users',
      'user_interactions',
      'comments',
      'chains',
      'protocols',
      'strategy_tags',
      'news_tags'
    ];

    console.log('Step 1: Delete Directus collection metadata');
    console.log('='.repeat(50));
    for (const collection of collections) {
      await deleteDirectusCollection(token, collection);
    }
    console.log('');

    console.log('Step 2: Refresh schema and import existing tables');
    console.log('='.repeat(50));
    await refreshSchema(token);
    await applyDiff(token);

    console.log('================================================');
    console.log('🎉 Done!');
    console.log('================================================');
    console.log('');
    console.log('Next steps:');
    console.log('1. Visit http://localhost:8055/admin/settings/data-model');
    console.log('2. Click the "Refresh" button or reload the page');
    console.log('3. You should see all tables with their fields');
    console.log('');

  } catch (error) {
    console.error('');
    console.error('❌ Error:', error.message);
    console.error('');
    process.exit(1);
  }
}

main();
