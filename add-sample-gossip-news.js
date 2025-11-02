const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.cujpgrzjmmttysphjknu:bi3d8FpBFTUWuwOb@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

const gossipNews = [
  {
    title: 'SBF狱中曝料：FTX崩盘内幕竟是因为...',
    content: '据知情人士透露，SBF在狱中向同伴透露了FTX崩盘的真实原因。他声称当时的决策是为了保护用户资产，但事实却大相径庭。',
    category: 'exchanges',
    source: 'CryptoGossip',
    source_type: 'rss',
    news_type: 'gossip',
    priority: 6
  },
  {
    title: 'V神被曝光持有大量PEPE代币？社区炸锅',
    content: '链上分析师发现一个与Vitalik相关的钱包地址持有价值数百万美元的PEPE代币。社区对此议论纷纷，V神本人尚未回应。',
    category: 'personalities',
    source: 'OnChainWhisper',
    source_type: 'rss',
    news_type: 'gossip',
    priority: 7
  },
  {
    title: '某知名项目方疑似内部分歧，创始人深夜发推后秒删',
    content: '某Layer2项目的联合创始人凌晨3点发布了一条批评团队决策的推特，随后迅速删除。社区成员截图传播，引发猜测。',
    category: 'projects',
    source: 'TwitterWatch',
    source_type: 'rss',
    news_type: 'gossip',
    priority: 5
  },
  {
    title: '传闻：某交易所即将宣布破产？用户疯狂提币',
    content: '匿名消息源称某中型交易所面临流动性危机。虽然官方否认，但链上数据显示大量用户正在提币，24小时提币量激增300%。',
    category: 'exchanges',
    source: 'CryptoRumors',
    source_type: 'rss',
    news_type: 'gossip',
    priority: 8
  },
  {
    title: '币安赵长鹏出狱后首次公开露面，穿着引发热议',
    content: 'CZ出狱后首次参加Web3活动，身穿印有"Still Building"字样的T恤。社区对其穿着和发言进行了各种解读。',
    category: 'personalities',
    source: 'CryptoFashion',
    source_type: 'rss',
    news_type: 'gossip',
    priority: 6
  }
];

async function addGossipNews() {
  try {
    await client.connect();
    console.log('✅ 已连接到数据库');

    for (const item of gossipNews) {
      const url = `https://example.com/gossip/${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      await client.query(`
        INSERT INTO news (
          url, title, content, category, source, source_type,
          news_type, priority, status, content_published_at, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'published', NOW(), NOW(), NOW())
      `, [
        url,
        item.title,
        item.content,
        item.category,
        item.source,
        item.source_type,
        item.news_type,
        item.priority
      ]);

      console.log(`✅ 已添加: ${item.title}`);
    }

    // Update some existing news to be gossip
    const updateResult = await client.query(`
      UPDATE news
      SET news_type = 'gossip'
      WHERE id IN (
        SELECT id FROM news
        WHERE news_type = 'realtime'
        ORDER BY RANDOM()
        LIMIT 3
      )
      RETURNING title;
    `);

    console.log(`\n🔄 已将 ${updateResult.rowCount} 条现有新闻改为八卦类型:`);
    updateResult.rows.forEach(row => {
      console.log(`  - ${row.title}`);
    });

    // Show statistics
    const stats = await client.query(`
      SELECT
        news_type,
        COUNT(*) as count
      FROM news
      WHERE status = 'published'
      GROUP BY news_type
      ORDER BY news_type;
    `);

    console.log('\n📊 新闻类型统计:');
    stats.rows.forEach(row => {
      const typeName = row.news_type === 'realtime' ? '实时资讯' : '新鲜八卦';
      console.log(`  ${typeName}: ${row.count} 条`);
    });

    console.log('\n🎉 八卦新闻添加完成！');

  } catch (error) {
    console.error('❌ 错误:', error.message);
  } finally {
    await client.end();
  }
}

addGossipNews();
