const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.cujpgrzjmmttysphjknu:bi3d8FpBFTUWuwOb@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres',
  ssl: {
    rejectUnauthorized: false
  }
});

async function verifyCategories() {
  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    // Get category distribution using slugs
    const query = `
      SELECT
        c.name as category_name,
        c.slug as category_slug,
        c.icon as category_icon,
        COUNT(s.id) as strategy_count
      FROM playnew_categories c
      LEFT JOIN strategies s ON s.category = c.slug AND s.status = 'published'
      WHERE c.parent_id IS NOT NULL
      GROUP BY c.id, c.name, c.slug, c.icon, c.order_index
      ORDER BY c.order_index;
    `;

    const result = await client.query(query);

    console.log('📊 Strategy Distribution by Category:\n');
    console.log('=' .repeat(70));

    let total = 0;
    let categoriesWithStrategies = 0;

    result.rows.forEach(row => {
      if (row.strategy_count > 0) {
        const count = parseInt(row.strategy_count);
        console.log(`${row.category_icon}  ${row.category_name.padEnd(20)} : ${count.toString().padStart(2)} strategies`);
        total += count;
        categoriesWithStrategies++;
      }
    });

    console.log('=' .repeat(70));
    console.log(`\n📈 Summary:`);
    console.log(`   Total strategies: ${total}`);
    console.log(`   Categories used: ${categoriesWithStrategies} / ${result.rows.length}`);
    console.log(`   Empty categories: ${result.rows.length - categoriesWithStrategies}\n`);

    // Check for uncategorized strategies
    const uncategorizedQuery = `
      SELECT COUNT(*) as count
      FROM strategies
      WHERE status = 'published' AND (category IS NULL OR category = '');
    `;
    const uncategorized = await client.query(uncategorizedQuery);

    if (uncategorized.rows[0].count > 0) {
      console.log(`⚠️  Warning: ${uncategorized.rows[0].count} strategies are not categorized\n`);
    } else {
      console.log('✅ All published strategies are properly categorized!\n');
    }

    // Show empty categories
    const emptyCategories = result.rows.filter(r => r.strategy_count == 0);
    if (emptyCategories.length > 0) {
      console.log('\n📝 Categories with no strategies yet:');
      console.log('   (You can add strategies to these categories later)\n');
      emptyCategories.forEach(row => {
        console.log(`   ${row.category_icon}  ${row.category_name}`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

verifyCategories();
