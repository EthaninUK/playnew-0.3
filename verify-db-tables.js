#!/usr/bin/env node

/**
 * Connect directly to PostgreSQL and check table schemas
 */

const { Client } = require('pg');

const connectionString = 'postgresql://postgres.cujpgrzjmmttysphjknu:bi3d8FpBFTUWuwOb@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres';

async function main() {
  const client = new Client({ connectionString });

  try {
    console.log('🔌 Connecting to PostgreSQL...\n');
    await client.connect();
    console.log('✅ Connected!\n');

    // Check strategies table
    console.log('📋 STRATEGIES TABLE SCHEMA:');
    console.log('='.repeat(50));
    const strategiesResult = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'strategies'
      ORDER BY ordinal_position
    `);

    if (strategiesResult.rows.length === 0) {
      console.log('  ❌ Table "strategies" does not exist or has no columns\n');
    } else {
      strategiesResult.rows.forEach(row => {
        console.log(`  - ${row.column_name} (${row.data_type}) ${row.is_nullable === 'NO' ? '  [NOT NULL]' : ''}`);
      });
      console.log('');
    }

    // Check news table
    console.log('📋 NEWS TABLE SCHEMA:');
    console.log('='.repeat(50));
    const newsResult = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'news'
      ORDER BY ordinal_position
    `);

    if (newsResult.rows.length === 0) {
      console.log('  ❌ Table "news" does not exist or has no columns\n');
    } else {
      newsResult.rows.forEach(row => {
        console.log(`  - ${row.column_name} (${row.data_type}) ${row.is_nullable === 'NO' ? '[NOT NULL]' : ''}`);
      });
      console.log('');
    }

    // List all tables
    console.log('📋 ALL TABLES IN PUBLIC SCHEMA:');
    console.log('='.repeat(50));
    const tablesResult = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    tablesResult.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

main();
