#!/usr/bin/env node

/**
 * Check what fields actually exist in Directus collections
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

async function getFields(token, collection) {
  const response = await fetch(`${DIRECTUS_URL}/fields/${collection}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data.data;
}

async function main() {
  const token = await login();

  const collections = [
    'strategies',
    'news',
    'categories',
    'tags',
    'users'
  ];

  for (const collection of collections) {
    console.log(`\n📦 Collection: ${collection}`);
    console.log('='.repeat(50));

    const fields = await getFields(token, collection);

    if (!fields) {
      console.log('❌ Failed to get fields');
      continue;
    }

    fields.forEach(field => {
      console.log(`  - ${field.field} (${field.type})`);
    });
  }
}

main();
