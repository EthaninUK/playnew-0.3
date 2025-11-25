#!/usr/bin/env node

/**
 * 应用排行榜数据库迁移到 Supabase
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = 'https://cujpgrzjmmttysphjknu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1anBncnpqbW10dHlzcGhqa251Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTk5NDg5MywiZXhwIjoyMDc1NTcwODkzfQ.GB8A230FSm68ckj3_eUj9dUzqRtGc70k8Ebjp9dYsdY';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false
  }
});

async function applyMigration() {
  console.log('🚀 开始应用排行榜数据库迁移...\n');

  try {
    // 读取SQL文件
    const sql = fs.readFileSync('./sql/supabase-add-leaderboard-fields.sql', 'utf8');

    console.log('📝 执行SQL迁移脚本...');

    // 使用 Supabase 的 RPC 执行原始SQL
    // 注意: 这需要在 Supabase Dashboard 中手动执行,或者使用 Supabase CLI
    console.log('\n⚠️  请手动在 Supabase Dashboard 中执行以下操作:\n');
    console.log('1. 打开 Supabase Dashboard: https://app.supabase.com');
    console.log('2. 选择您的项目');
    console.log('3. 进入 SQL Editor');
    console.log('4. 粘贴并执行文件: sql/supabase-add-leaderboard-fields.sql\n');

    console.log('💡 或者使用 Supabase CLI:\n');
    console.log('   supabase db push\n');

    // 验证迁移 - 检查字段是否存在
    console.log('🔍 验证迁移结果...');

    const { data, error } = await supabase
      .from('strategies')
      .select('id, title, hotness_score, share_count, comment_count, featured_order')
      .eq('status', 'published')
      .limit(1);

    if (error) {
      if (error.message.includes('column') && error.message.includes('does not exist')) {
        console.log('❌ 迁移尚未执行,请先在 Supabase Dashboard 中执行 SQL 脚本');
        console.log('   文件路径: sql/supabase-add-leaderboard-fields.sql');
      } else {
        console.log('❌ 验证失败:', error.message);
      }
    } else {
      console.log('✅ 迁移成功!新字段已添加\n');

      // 显示热度分 Top 10
      console.log('🔥 热度分 Top 10:');
      const { data: topStrategies } = await supabase
        .from('strategies')
        .select('title, hotness_score, view_count, bookmark_count')
        .eq('status', 'published')
        .order('hotness_score', { ascending: false })
        .limit(10);

      if (topStrategies) {
        topStrategies.forEach((s, i) => {
          console.log(`${i + 1}. ${s.title}`);
          console.log(`   热度分: ${s.hotness_score || 0} | 浏览: ${s.view_count || 0} | 收藏: ${s.bookmark_count || 0}`);
        });
      }

      console.log('\n✨ 数据库迁移完成!');
    }

  } catch (error) {
    console.error('❌ 错误:', error.message);
    process.exit(1);
  }
}

applyMigration();
