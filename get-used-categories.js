const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.cujpgrzjmmttysphjknu:bi3d8FpBFTUWuwOb@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres',
  ssl: {
    rejectUnauthorized: false
  }
});

async function getUsedCategories() {
  try {
    await client.connect();
    console.log('Connected to database\n');

    // Get distinct category_l1 values
    const l1Query = `
      SELECT DISTINCT category_l1
      FROM strategies
      WHERE status = 'published' AND category_l1 IS NOT NULL
      ORDER BY category_l1;
    `;
    const l1Result = await client.query(l1Query);
    console.log('Level 1 Categories (category_l1):');
    console.log('==================================');
    l1Result.rows.forEach(row => {
      console.log(`  - ${row.category_l1}`);
    });

    // Get distinct category_l2 values grouped by category_l1
    const l2Query = `
      SELECT DISTINCT category_l1, category_l2
      FROM strategies
      WHERE status = 'published' AND category_l2 IS NOT NULL
      ORDER BY category_l1, category_l2;
    `;
    const l2Result = await client.query(l2Query);
    console.log('\nLevel 2 Categories (category_l2) by L1:');
    console.log('========================================');
    let currentL1 = null;
    l2Result.rows.forEach(row => {
      if (row.category_l1 !== currentL1) {
        currentL1 = row.category_l1;
        console.log(`\n${currentL1}:`);
      }
      console.log(`  - ${row.category_l2}`);
    });

    // Get count of strategies per category
    const countQuery = `
      SELECT category_l1, category_l2, COUNT(*) as count
      FROM strategies
      WHERE status = 'published'
      GROUP BY category_l1, category_l2
      ORDER BY category_l1, count DESC;
    `;
    const countResult = await client.query(countQuery);
    console.log('\n\nStrategy Count by Category:');
    console.log('===========================');
    currentL1 = null;
    countResult.rows.forEach(row => {
      if (row.category_l1 !== currentL1) {
        currentL1 = row.category_l1;
        console.log(`\n${currentL1 || 'NULL'}:`);
      }
      console.log(`  - ${row.category_l2 || 'NULL'}: ${row.count} strategies`);
    });

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

getUsedCategories()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
