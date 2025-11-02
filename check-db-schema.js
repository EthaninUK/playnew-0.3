const pg = require('pg');

async function checkSchema() {
  const client = new pg.Client({
    connectionString: 'postgresql://postgres.cujpgrzjmmttysphjknu:bi3d8FpBFTUWuwOb@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres',
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✓ Connected to Supabase database');

    // List all tables
    console.log('\n=== All tables in public schema ===');
    const tablesResult = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    console.log('Tables found:', tablesResult.rows.length);
    tablesResult.rows.forEach(row => console.log('  -', row.table_name));

    // Check for membership-related tables
    console.log('\n=== Searching for membership-related tables ===');
    const membershipTablesResult = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name LIKE '%member%'
      ORDER BY table_name
    `);
    console.log('Membership tables found:', membershipTablesResult.rows.length);
    membershipTablesResult.rows.forEach(row => console.log('  -', row.table_name));

    // Check for user-related tables
    console.log('\n=== Searching for user-related tables ===');
    const userTablesResult = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name LIKE '%user%'
      ORDER BY table_name
    `);
    console.log('User tables found:', userTablesResult.rows.length);
    userTablesResult.rows.forEach(row => console.log('  -', row.table_name));

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

checkSchema();
