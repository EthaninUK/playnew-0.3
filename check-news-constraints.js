const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.cujpgrzjmmttysphjknu:bi3d8FpBFTUWuwOb@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

async function checkConstraints() {
  try {
    await client.connect();

    // Check constraints on the news table
    const constraints = await client.query(`
      SELECT
        con.conname AS constraint_name,
        con.consrc AS constraint_definition
      FROM pg_constraint con
      INNER JOIN pg_class rel ON rel.oid = con.conrelid
      WHERE rel.relname = 'news'
        AND con.contype = 'c';
    `);

    console.log('News table constraints:');
    constraints.rows.forEach(row => {
      console.log(`\n${row.constraint_name}:`);
      console.log(`  ${row.constraint_definition}`);
    });

    // Check what source_type values exist
    const existingTypes = await client.query(`
      SELECT DISTINCT source_type
      FROM news
      WHERE source_type IS NOT NULL;
    `);

    console.log('\n\nExisting source_type values:');
    existingTypes.rows.forEach(row => {
      console.log(`  - ${row.source_type}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

checkConstraints();
