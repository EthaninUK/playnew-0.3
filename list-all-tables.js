const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.cujpgrzjmmttysphjknu:bi3d8FpBFTUWuwOb@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres',
  ssl: {
    rejectUnauthorized: false
  }
});

async function listAllTables() {
  try {
    await client.connect();
    console.log('Connected to database\n');

    // Get all tables
    const tablesQuery = `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `;
    const tablesResult = await client.query(tablesQuery);

    console.log('All tables in database:');
    console.log('======================');
    tablesResult.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });
    console.log(`\nTotal: ${tablesResult.rows.length} tables`);

    // Check if strategies table exists
    const strategiesExists = tablesResult.rows.some(r => r.table_name === 'strategies');
    console.log(`\nStrategies table exists: ${strategiesExists}`);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

listAllTables()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
