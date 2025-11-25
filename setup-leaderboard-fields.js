#!/usr/bin/env node

/**
 * 排行榜系统 - 数据库字段设置脚本
 * 为 strategies 表添加排行榜所需的新字段
 */

const fs = require('fs');
const { Client } = require('pg');

// 数据库配置
const DB_CONFIG = {
  host: 'localhost',
  port: 5432,
  database: 'directus_play',
  user: 'directus',
  password: 'Mygcdjmyxzg2026!',
};

async function setupLeaderboardFields() {
  console.log('🚀 开始设置排行榜数据库字段...\n');

  const client = new Client(DB_CONFIG);

  try {
    await client.connect();
    console.log('✅ 数据库连接成功');

    // 读取并执行SQL迁移脚本
    const sql = fs.readFileSync('./sql/001-add-leaderboard-fields.sql', 'utf8');

    console.log('\n📝 执行数据库迁移...');
    await client.query(sql);

    console.log('✅ 数据库迁移成功!\n');

    // 检查新增字段
    console.log('📊 检查新增字段...');
    const fieldsResult = await client.query(`
      SELECT
        column_name,
        data_type,
        column_default
      FROM information_schema.columns
      WHERE table_name = 'strategies'
      AND column_name IN ('hotness_score', 'share_count', 'comment_count', 'featured_order', 'last_hotness_update')
      ORDER BY column_name;
    `);

    console.table(fieldsResult.rows);

    // 显示热度分 Top 10
    console.log('\n🔥 热度分 Top 10:');
    const topResult = await client.query(`
      SELECT
        title,
        hotness_score,
        view_count,
        bookmark_count
      FROM strategies
      WHERE status = 'published'
      ORDER BY hotness_score DESC
      LIMIT 10;
    `);

    topResult.rows.forEach((row, index) => {
      console.log(`${index + 1}. ${row.title}`);
      console.log(`   热度分: ${row.hotness_score} | 浏览: ${row.view_count} | 收藏: ${row.bookmark_count}`);
    });

    // 统计信息
    console.log('\n📈 统计信息:');
    const statsResult = await client.query(`
      SELECT
        COUNT(*) FILTER (WHERE hotness_score > 0) as strategies_with_hotness,
        COUNT(*) FILTER (WHERE is_featured = true) as featured_strategies,
        ROUND(MAX(hotness_score)::numeric, 2) as max_hotness_score,
        COUNT(*) as total_published
      FROM strategies
      WHERE status = 'published';
    `);

    console.table(statsResult.rows);

    console.log('\n✨ 排行榜数据库设置完成!');

  } catch (error) {
    console.error('❌ 错误:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// 运行脚本
setupLeaderboardFields().catch(console.error);