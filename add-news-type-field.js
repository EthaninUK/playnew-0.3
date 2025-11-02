const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.cujpgrzjmmttysphjknu:bi3d8FpBFTUWuwOb@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

async function addNewsTypeField() {
  try {
    await client.connect();
    console.log('✅ 已连接到数据库');

    // Check if news_type column already exists
    const checkColumn = await client.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'news' AND column_name = 'news_type';
    `);

    if (checkColumn.rows.length > 0) {
      console.log('⚠️  news_type 字段已存在');
    } else {
      console.log('➕ 添加 news_type 字段...');

      // Add news_type column with default value 'realtime'
      await client.query(`
        ALTER TABLE news
        ADD COLUMN news_type TEXT DEFAULT 'realtime';
      `);

      console.log('✅ news_type 字段已添加');
    }

    // Update existing news items - set some to gossip based on keywords
    console.log('🔄 更新现有新闻类型...');

    // Set gossip for news containing gossip-related keywords
    const gossipKeywords = ['八卦', '传闻', '爆料', '内幕', 'FUD', '争议', '丑闻', '曝光'];
    const gossipPattern = gossipKeywords.join('|');

    const updateResult = await client.query(`
      UPDATE news
      SET news_type = 'gossip'
      WHERE (title ~* '${gossipPattern}' OR content ~* '${gossipPattern}')
        AND news_type = 'realtime';
    `);

    console.log(`✅ 已更新 ${updateResult.rowCount} 条新闻为八卦类型`);

    // Show statistics
    const stats = await client.query(`
      SELECT
        news_type,
        COUNT(*) as count
      FROM news
      GROUP BY news_type
      ORDER BY news_type;
    `);

    console.log('\n📊 新闻类型统计:');
    stats.rows.forEach(row => {
      const typeName = row.news_type === 'realtime' ? '实时资讯' : '新鲜八卦';
      console.log(`  ${typeName}: ${row.count} 条`);
    });

    console.log('\n🎉 news_type 字段配置完成！');

  } catch (error) {
    console.error('❌ 错误:', error.message);
  } finally {
    await client.end();
  }
}

addNewsTypeField();
