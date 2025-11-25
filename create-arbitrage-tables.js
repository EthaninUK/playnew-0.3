const { Client } = require('pg');
const fs = require('fs');

const client = new Client({
  connectionString: 'postgresql://postgres.cujpgrzjmmttysphjknu:bi3d8FpBFTUWuwOb@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres',
});

(async () => {
  try {
    await client.connect();
    console.log('✅ Connected to database');

    const sql = fs.readFileSync('/Users/m1/PlayNew_0.3/sql/create-arbitrage-tables.sql', 'utf-8');
    await client.query(sql);

    console.log('✅ Arbitrage tables created successfully');

    // Verify tables
    const result = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name IN ('arbitrage_types', 'live_opportunities')
      ORDER BY table_name;
    `);

    console.log('\n📋 Created tables:');
    result.rows.forEach(row => console.log(`   - ${row.table_name}`));

  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
})();