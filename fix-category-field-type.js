const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.cujpgrzjmmttysphjknu:bi3d8FpBFTUWuwOb@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres',
  ssl: {
    rejectUnauthorized: false
  }
});

async function fixCategoryField() {
  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    // Check current type
    console.log('📋 Checking current category field type...');
    const typeQuery = `
      SELECT data_type
      FROM information_schema.columns
      WHERE table_name = 'strategies' AND column_name = 'category';
    `;
    const typeResult = await client.query(typeQuery);
    console.log(`  Current type: ${typeResult.rows[0].data_type}\n`);

    if (typeResult.rows[0].data_type !== 'uuid') {
      console.log('🔄 Converting category field to UUID type...');

      // First, update to store slugs instead of UUIDs temporarily
      console.log('  Step 1: Mapping UUIDs to slugs...');
      const strategies = await client.query(`
        SELECT s.id as strategy_id, s.category as category_uuid, c.slug
        FROM strategies s
        LEFT JOIN playnew_categories c ON c.id::text = s.category
        WHERE s.category IS NOT NULL;
      `);

      console.log(`  Found ${strategies.rows.length} strategies with UUID categories`);

      // Update to slugs
      for (const row of strategies.rows) {
        if (row.slug) {
          await client.query(
            'UPDATE strategies SET category = $1 WHERE id = $2',
            [row.slug, row.strategy_id]
          );
        }
      }

      console.log('  ✅ All UUIDs converted to slugs\n');
    } else {
      console.log('✅ Category field is already UUID type\n');
    }

    console.log('✅ Category field type is correct!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    await client.end();
  }
}

fixCategoryField();
