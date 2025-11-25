const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.cujpgrzjmmttysphjknu:bi3d8FpBFTUWuwOb@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres',
});

async function checkArbitrageTypes() {
  try {
    await client.connect();

    const result = await client.query(`
      SELECT slug, title, category, sort
      FROM arbitrage_types
      WHERE status = 'published'
      ORDER BY category, sort
    `);

    console.log(`\n📊 Total arbitrage types: ${result.rows.length}\n`);

    // Group by category
    const byCategory = {};
    result.rows.forEach(row => {
      if (!byCategory[row.category]) {
        byCategory[row.category] = [];
      }
      byCategory[row.category].push(row);
    });

    // Display by category
    Object.keys(byCategory).sort().forEach(category => {
      console.log(`\n${category} (${byCategory[category].length}):`);
      byCategory[category].forEach(item => {
        console.log(`  - ${item.title} (${item.slug})`);
      });
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.end();
  }
}

checkArbitrageTypes();
