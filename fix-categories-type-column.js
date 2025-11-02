const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.cujpgrzjmmttysphjknu:bi3d8FpBFTUWuwOb@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres',
  ssl: {
    rejectUnauthorized: false
  }
});

async function fixCategoriesTable() {
  try {
    await client.connect();
    console.log('Connected to database');

    // Check if type column exists
    const checkColumnQuery = `
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'categories' AND column_name = 'type';
    `;
    const checkResult = await client.query(checkColumnQuery);

    if (checkResult.rows.length > 0) {
      console.log('✓ Column "type" already exists in categories table');
    } else {
      console.log('✗ Column "type" does not exist. Adding it now...');

      // Add the type column
      const alterQuery = `
        ALTER TABLE categories
        ADD COLUMN type VARCHAR(50) DEFAULT 'child';
      `;
      await client.query(alterQuery);
      console.log('✓ Added "type" column to categories table');

      // Update existing records - set 'parent' for categories without parent_id
      const updateParentsQuery = `
        UPDATE categories
        SET type = 'parent'
        WHERE parent_id IS NULL;
      `;
      await client.query(updateParentsQuery);
      console.log('✓ Updated parent categories to type="parent"');

      // Update existing records - set 'child' for categories with parent_id
      const updateChildrenQuery = `
        UPDATE categories
        SET type = 'child'
        WHERE parent_id IS NOT NULL;
      `;
      await client.query(updateChildrenQuery);
      console.log('✓ Updated child categories to type="child"');
    }

    // Verify the fix
    const verifyQuery = `
      SELECT id, name, type, parent_id
      FROM categories
      ORDER BY order_index
      LIMIT 10;
    `;
    const verifyResult = await client.query(verifyQuery);
    console.log('\nVerification - First 10 categories:');
    verifyResult.rows.forEach(row => {
      console.log(`  ${row.name}: type="${row.type}", parent_id=${row.parent_id || 'NULL'}`);
    });

    console.log('\n✓ Categories table fixed successfully!');
  } catch (error) {
    console.error('Error fixing categories table:', error);
    throw error;
  } finally {
    await client.end();
  }
}

fixCategoriesTable()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
