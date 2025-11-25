const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.cujpgrzjmmttysphjknu:bi3d8FpBFTUWuwOb@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres',
});

(async () => {
  try {
    await client.connect();

    // Check if tables exist
    const tables = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name IN ('arbitrage_types', 'live_opportunities')
      ORDER BY table_name;
    `);

    console.log('📋 Existing tables:');
    tables.rows.forEach(row => console.log(`   - ${row.table_name}`));

    // Check columns
    for (const table of tables.rows) {
      const columns = await client.query(`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = $1
        ORDER BY ordinal_position;
      `, [table.table_name]);

      console.log(`\n📊 ${table.table_name} columns:`);
      columns.rows.forEach(col => console.log(`   - ${col.column_name}: ${col.data_type}`));
    }

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await client.end();
  }
})();