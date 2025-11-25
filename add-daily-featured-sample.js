const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cujpgrzjmmttysphjknu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1anBncnpqbW10dHlzcGhqa251Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTk5NDg5MywiZXhwIjoyMDc1NTcwODkzfQ.GB8A230FSm68ckj3_eUj9dUzqRtGc70k8Ebjp9dYsdY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function addDailyFeatured() {
  console.log('🎮 正在添加今日精选玩法配置...\n');

  // 1. 获取3个已发布的策略
  const { data: strategies, error: stratError } = await supabase
    .from('strategies')
    .select('id, title, slug')
    .eq('status', 'published')
    .limit(3);

  if (stratError || !strategies || strategies.length < 3) {
    console.error('❌ 获取策略失败或策略不足3个:', stratError);
    return;
  }

  console.log('✅ 找到可用策略:');
  strategies.forEach((s, i) => {
    console.log(`  ${i + 1}. ${s.title} (${s.id})`);
  });
  console.log('');

  // 2. 获取今天的日期
  const today = new Date().toISOString().split('T')[0];

  // 3. 检查今天是否已有配置
  const { data: existing } = await supabase
    .from('daily_featured_plays')
    .select('id')
    .eq('feature_date', today)
    .single();

  if (existing) {
    console.log('⚠️  今天已有精选配置，正在更新...\n');

    const { error: updateError } = await supabase
      .from('daily_featured_plays')
      .update({
        play_1_id: strategies[0].id,
        play_2_id: strategies[1].id,
        play_3_id: strategies[2].id,
        theme_label: 'DeFi 挖矿专场',
        is_active: true
      })
      .eq('id', existing.id);

    if (updateError) {
      console.error('❌ 更新失败:', updateError);
      return;
    }

    console.log('✅ 今日精选配置已更新！');
  } else {
    // 4. 插入新配置
    const { error: insertError } = await supabase
      .from('daily_featured_plays')
      .insert({
        feature_date: today,
        play_1_id: strategies[0].id,
        play_2_id: strategies[1].id,
        play_3_id: strategies[2].id,
        theme_label: 'DeFi 挖矿专场',
        is_active: true
      });

    if (insertError) {
      console.error('❌ 插入失败:', insertError);
      return;
    }

    console.log('✅ 今日精选配置已创建！');
  }

  console.log('\n========================================');
  console.log('📅 今日精选玩法配置完成');
  console.log('========================================');
  console.log(`日期: ${today}`);
  console.log('主题: DeFi 挖矿专场');
  console.log('玩法:');
  console.log(`  卡片 1: ${strategies[0].title}`);
  console.log(`  卡片 2: ${strategies[1].title}`);
  console.log(`  卡片 3: ${strategies[2].title}`);
  console.log('');
  console.log('🎯 下一步:');
  console.log('  1. 测试 API: GET /api/play-exchange/daily-featured');
  console.log('  2. 前端页面集成');
  console.log('');
}

addDailyFeatured().catch(console.error);
