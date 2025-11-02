const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.cujpgrzjmmttysphjknu:bi3d8FpBFTUWuwOb@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres',
  ssl: {
    rejectUnauthorized: false
  }
});

async function checkDirectusFields() {
  try {
    await client.connect();
    console.log('Connected to database\n');

    // Check what fields Directus expects for categories
    console.log('Directus Categories Fields:');
    console.log('===========================');
    const fieldsQuery = `
      SELECT field, type, schema
      FROM directus_fields
      WHERE collection = 'categories'
      ORDER BY sort;
    `;
    const fields = await client.query(fieldsQuery);
    fields.rows.forEach(row => {
      const schema = row.schema ? JSON.parse(row.schema) : {};
      console.log(`  ${row.field} (${row.type})${schema.is_nullable === false ? ' NOT NULL' : ''}`);
    });

    // Check actual categories table structure
    console.log('\n\nActual Categories Table Columns:');
    console.log('================================');
    const actualQuery = `
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'categories'
      ORDER BY ordinal_position;
    `;
    const actual = await client.query(actualQuery);
    actual.rows.forEach(col => {
      console.log(`  ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });

  } catch (error) {
    console.error('Error:', error.message);
    console.error(error.stack);
  } finally {
    await client.end();
  }
}

checkDirectusFields()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
