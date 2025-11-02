#!/usr/bin/env node

/**
 * Import existing PostgreSQL tables into Directus
 * Uses the schema/apply endpoint to force Directus to recognize existing tables
 */

const { Client } = require('pg');

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_EMAIL = 'the_uk1@outlook.com';
const DIRECTUS_PASSWORD = 'Mygcdjmyxzg2026!';
const DB_CONNECTION_STRING = 'postgresql://postgres.cujpgrzjmmttysphjknu:bi3d8FpBFTUWuwOb@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres';

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

async function getTableInfo(tableName) {
  const client = new Client({ connectionString: DB_CONNECTION_STRING });
  await client.connect();

  try {
    // Get table columns
    const result = await client.query(`
      SELECT
        column_name,
        data_type,
        is_nullable,
        column_default,
        character_maximum_length,
        numeric_precision,
        numeric_scale,
        udt_name
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = $1
      ORDER BY ordinal_position
    `, [tableName]);

    // Get primary key
    const pkResult = await client.query(`
      SELECT kcu.column_name
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      WHERE tc.constraint_type = 'PRIMARY KEY'
        AND tc.table_schema = 'public'
        AND tc.table_name = $1
    `, [tableName]);

    const primaryKey = pkResult.rows[0]?.column_name || 'id';

    return {
      columns: result.rows,
      primaryKey
    };
  } finally {
    await client.end();
  }
}

function mapDataType(column) {
  const typeMap = {
    'uuid': 'uuid',
    'text': 'text',
    'integer': 'integer',
    'bigint': 'bigInteger',
    'boolean': 'boolean',
    'timestamp with time zone': 'timestamp',
    'timestamp without time zone': 'datetime',
    'date': 'date',
    'time': 'time',
    'numeric': 'decimal',
    'real': 'float',
    'double precision': 'float',
    'jsonb': 'json',
    'json': 'json',
    'ARRAY': 'json'
  };

  let baseType = column.data_type;

  // Handle arrays
  if (column.udt_name && column.udt_name.startsWith('_')) {
    baseType = 'ARRAY';
  }

  return typeMap[baseType] || 'string';
}

async function createFieldInDirectus(token, collection, column, isPrimaryKey) {
  const field = column.column_name;
  const type = mapDataType(column);

  const fieldConfig = {
    field,
    type,
    schema: {
      is_nullable: column.is_nullable === 'YES',
      is_primary_key: isPrimaryKey,
      has_auto_increment: column.column_default?.includes('nextval') || false,
      default_value: column.column_default
    },
    meta: {
      hidden: isPrimaryKey,
      readonly: isPrimaryKey || field.endsWith('_at'),
      interface: isPrimaryKey ? null : 'input',
      required: column.is_nullable === 'NO' && !isPrimaryKey
    }
  };

  console.log(`    Creating field: ${field} (${type})`);

  const response = await fetch(`${DIRECTUS_URL}/fields/${collection}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(fieldConfig),
  });

  if (!response.ok) {
    const error = await response.text();
    // Ignore "already exists" errors
    if (!error.includes('already exists')) {
      console.error(`      ⚠️  Warning: ${error.substring(0, 100)}`);
    }
  }
}

async function createCollectionInDirectus(token, tableName, tableInfo) {
  console.log(`\n📦 Creating collection: ${tableName}`);

  // Create the collection first
  const collectionConfig = {
    collection: tableName,
    meta: {
      collection: tableName,
      hidden: false,
      singleton: false
    },
    schema: {
      name: tableName
    },
    fields: [
      {
        field: tableInfo.primaryKey,
        type: 'uuid',
        schema: {
          is_primary_key: true,
          is_nullable: false
        },
        meta: {
          hidden: true,
          readonly: true
        }
      }
    ]
  };

  const collectionResponse = await fetch(`${DIRECTUS_URL}/collections`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(collectionConfig),
  });

  if (!collectionResponse.ok) {
    const error = await collectionResponse.text();
    if (error.includes('already exists')) {
      console.log(`  ℹ️  Collection already exists, updating fields...`);
    } else {
      console.error(`  ❌ Failed: ${error.substring(0, 100)}`);
      return false;
    }
  } else {
    console.log(`  ✅ Collection created`);
  }

  // Add all other fields
  console.log(`  📋 Adding fields...`);
  for (const column of tableInfo.columns) {
    if (column.column_name !== tableInfo.primaryKey) {
      await createFieldInDirectus(
        token,
        tableName,
        column,
        false
      );
    }
  }

  console.log(`  ✅ Done`);
  return true;
}

async function main() {
  try {
    console.log('');
    console.log('================================================');
    console.log('  Import Existing Tables into Directus');
    console.log('================================================');
    console.log('');

    const token = await login();

    const tables = [
      'categories',
      'tags',
      'chains',
      'protocols',
      'users',
      'strategies',
      'news',
      'service_providers',
      'comments',
      'user_interactions'
    ];

    let success = 0;
    let failed = 0;

    for (const table of tables) {
      try {
        console.log(`\n🔍 Analyzing table: ${table}...`);
        const tableInfo = await getTableInfo(table);
        console.log(`  Found ${tableInfo.columns.length} columns, primary key: ${tableInfo.primaryKey}`);

        const result = await createCollectionInDirectus(token, table, tableInfo);
        if (result !== false) {
          success++;
        } else {
          failed++;
        }

        // Small delay to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`  ❌ Error with ${table}:`, error.message);
        failed++;
      }
    }

    console.log('');
    console.log('================================================');
    console.log('📊 Summary:');
    console.log(`  ✅ Success: ${success} collections`);
    console.log(`  ❌ Failed: ${failed} collections`);
    console.log('================================================');
    console.log('');
    console.log('🎉 Import complete!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Visit http://localhost:8055/admin/settings/data-model');
    console.log('2. Check that all collections show their fields');
    console.log('3. Configure display templates and field interfaces');
    console.log('');

  } catch (error) {
    console.error('');
    console.error('❌ Fatal error:', error.message);
    console.error('');
    process.exit(1);
  }
}

main();
