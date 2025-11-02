const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.cujpgrzjmmttysphjknu:bi3d8FpBFTUWuwOb@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres',
  ssl: {
    rejectUnauthorized: false
  }
});

async function checkRelatedCategories() {
  try {
    await client.connect();
    console.log('Connected to database\n');

    // 检查 related_categories 表结构
    console.log('Related Categories Table Structure:');
    console.log('====================================');
    const structureQuery = `
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'related_categories'
      ORDER BY ordinal_position;
    `;
    const structure = await client.query(structureQuery);
    structure.rows.forEach(col => {
      console.log(`  ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });

    // 检查数据
    console.log('\n\nRelated Categories Data:');
    console.log('========================');
    const dataQuery = `SELECT * FROM related_categories LIMIT 20;`;
    const data = await client.query(dataQuery);
    console.log(`Found ${data.rows.length} records`);
    if (data.rows.length > 0) {
      console.log('\nSample data:');
      console.log(JSON.stringify(data.rows, null, 2));
    }

    // 也许你的categories数据从来没有被删除，只是Directus的元数据被删了
    // 让我们检查一下是否真的存在一个独立的策略分类表
    console.log('\n\nSearching for tables with strategy/play category data...');
    const allTablesQuery = `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
        AND (
          table_name LIKE 'strategy_%'
          OR table_name LIKE 'play_%'
          OR table_name LIKE '%category%'
          OR table_name LIKE '%classification%'
        )
      ORDER BY table_name;
    `;
    const allTables = await client.query(allTablesQuery);
    console.log('\nRelevant tables:');
    allTables.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });

    // 检查 categories 表是否真的是空的，还是有Directus的categories数据
    console.log('\n\nChecking categories table again (all columns):');
    console.log('===============================================');
    const catStructureQuery = `
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'categories'
      ORDER BY ordinal_position;
    `;
    const catStructure = await client.query(catStructureQuery);
    console.log('Columns:');
    catStructure.rows.forEach(col => {
      console.log(`  ${col.column_name}: ${col.data_type}`);
    });

    const catCountQuery = `SELECT COUNT(*) as count FROM categories;`;
    const catCount = await client.query(catCountQuery);
    console.log(`\nTotal records: ${catCount.rows[0].count}`);

    if (catCount.rows[0].count > 0) {
      const catSampleQuery = `SELECT * FROM categories LIMIT 5;`;
      const catSample = await client.query(catSampleQuery);
      console.log('\nSample records:');
      console.log(JSON.stringify(catSample.rows, null, 2));
    }

  } catch (error) {
    console.error('Error:', error.message);
    console.error(error.stack);
  } finally {
    await client.end();
  }
}

checkRelatedCategories()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
