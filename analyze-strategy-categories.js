const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.cujpgrzjmmttysphjknu:bi3d8FpBFTUWuwOb@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres',
  ssl: {
    rejectUnauthorized: false
  }
});

async function analyzeStrategies() {
  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    // Get all published strategies
    const strategiesQuery = `
      SELECT id, title, slug, category, category_l1, category_l2
      FROM strategies
      WHERE status = 'published'
      ORDER BY title;
    `;
    const strategies = await client.query(strategiesQuery);

    console.log(`📊 Total published strategies: ${strategies.rows.length}\n`);

    // Group by current category field (if exists)
    const byCategory = {};
    strategies.rows.forEach(s => {
      const cat = s.category || 'uncategorized';
      if (!byCategory[cat]) byCategory[cat] = [];
      byCategory[cat].push(s);
    });

    console.log('Current category field distribution:');
    Object.keys(byCategory).sort().forEach(cat => {
      console.log(`  ${cat}: ${byCategory[cat].length} strategies`);
    });

    console.log('\n\nSample strategies with their categories:');
    console.log('=========================================');
    strategies.rows.slice(0, 20).forEach(s => {
      console.log(`\nTitle: ${s.title}`);
      console.log(`  slug: ${s.slug}`);
      console.log(`  category: ${s.category || 'NULL'}`);
      console.log(`  category_l1: ${s.category_l1 || 'NULL'}`);
      console.log(`  category_l2: ${s.category_l2 || 'NULL'}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

analyzeStrategies();
