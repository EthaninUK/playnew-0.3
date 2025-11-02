const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.cujpgrzjmmttysphjknu:bi3d8FpBFTUWuwOb@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres',
  ssl: {
    rejectUnauthorized: false
  }
});

async function checkDirectusCollections() {
  try {
    await client.connect();
    console.log('Connected to database\n');

    // Check directus_collections
    console.log('Directus Collections:');
    console.log('====================');
    const collectionsQuery = `SELECT collection FROM directus_collections ORDER BY collection;`;
    const collections = await client.query(collectionsQuery);
    collections.rows.forEach(row => {
      console.log(`  - ${row.collection}`);
    });

    // Check strategies table structure
    console.log('\n\nStrategies table columns:');
    console.log('========================');
    const strategiesColumnsQuery = `
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'strategies'
      ORDER BY ordinal_position;
    `;
    const strategiesCols = await client.query(strategiesColumnsQuery);
    strategiesCols.rows.forEach(col => {
      console.log(`  ${col.column_name}: ${col.data_type}`);
    });

    // Check if there's a separate categories-like table for Directus
    console.log('\n\nLooking for category-related tables:');
    console.log('====================================');
    const catTablesQuery = `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
        AND (table_name LIKE '%categor%' OR table_name LIKE '%tag%')
      ORDER BY table_name;
    `;
    const catTables = await client.query(catTablesQuery);
    catTables.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

checkDirectusCollections()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
