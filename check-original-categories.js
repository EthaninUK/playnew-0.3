const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.cujpgrzjmmttysphjknu:bi3d8FpBFTUWuwOb@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres',
  ssl: {
    rejectUnauthorized: false
  }
});

async function checkOriginalCategories() {
  try {
    await client.connect();
    console.log('Connected to database\n');

    // 查找所有可能存储categories数据的表
    console.log('Searching for tables that might contain category data...\n');

    // 检查是否有其他名称的categories表
    const tablesQuery = `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
        AND (
          table_name ILIKE '%categor%'
          OR table_name ILIKE '%classification%'
          OR table_name ILIKE '%taxonomy%'
        )
      ORDER BY table_name;
    `;
    const tablesResult = await client.query(tablesQuery);
    console.log('Tables containing "category" in name:');
    tablesResult.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });

    // 检查Chatwoot的categories表（可能不是我们需要的）
    console.log('\n\nChatwoot Categories table (NOT our data):');
    console.log('==========================================');
    const chatwootCatQuery = `
      SELECT id, name, slug, created_at
      FROM categories
      ORDER BY id
      LIMIT 10;
    `;
    const chatwootResult = await client.query(chatwootCatQuery);
    console.log(`Found ${chatwootResult.rows.length} records:`);
    chatwootResult.rows.forEach(row => {
      console.log(`  ID: ${row.id}, Name: ${row.name}, Slug: ${row.slug}`);
    });

    // 检查是否有备份表
    console.log('\n\nLooking for backup tables...');
    const backupQuery = `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
        AND (
          table_name LIKE '%backup%'
          OR table_name LIKE '%old%'
          OR table_name LIKE '%bak%'
        )
      ORDER BY table_name;
    `;
    const backupResult = await client.query(backupQuery);
    if (backupResult.rows.length > 0) {
      console.log('Backup tables found:');
      backupResult.rows.forEach(row => {
        console.log(`  - ${row.table_name}`);
      });
    } else {
      console.log('No backup tables found.');
    }

    // 检查directus_revisions表，看是否有categories的历史数据
    console.log('\n\nChecking Directus revisions for categories data...');
    const revisionsQuery = `
      SELECT id, collection, item, data, delta, created_on
      FROM directus_revisions
      WHERE collection = 'categories'
      ORDER BY created_on DESC
      LIMIT 5;
    `;
    try {
      const revisionsResult = await client.query(revisionsQuery);
      console.log(`Found ${revisionsResult.rows.length} revisions:`);
      if (revisionsResult.rows.length > 0) {
        console.log('\nLatest category revision data:');
        console.log(JSON.stringify(revisionsResult.rows[0], null, 2));
      }
    } catch (err) {
      console.log('No revisions found or error:', err.message);
    }

    // 检查是否有JSON或配置表存储了categories
    console.log('\n\nChecking directus_settings for category configuration...');
    const settingsQuery = `
      SELECT key, value
      FROM directus_settings
      WHERE key ILIKE '%categor%';
    `;
    try {
      const settingsResult = await client.query(settingsQuery);
      if (settingsResult.rows.length > 0) {
        console.log('Settings with category data:');
        settingsResult.rows.forEach(row => {
          console.log(`  ${row.key}:`, row.value);
        });
      } else {
        console.log('No category settings found.');
      }
    } catch (err) {
      console.log('Error checking settings:', err.message);
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

checkOriginalCategories()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
