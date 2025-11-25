const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qwcavrzazrjdsljtepkr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3Y2F2cnphenJqZHNsanRlcGtyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNjIzMzQwOCwiZXhwIjoyMDUxODA5NDA4fQ.t5tdX7MApB5u8kIh96wlzBuEF7cW5GsT7OMDX0pImO0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function addSixCardsSupport() {
  console.log('🔄 开始添加6张卡片支持...\n');

  try {
    // 1. 检查表结构
    console.log('1️⃣ 检查 daily_featured_plays 表...');
    const { data: existingConfig } = await supabase
      .from('daily_featured_plays')
      .select('*')
      .limit(1)
      .single();

    if (existingConfig) {
      console.log('✅ 表已存在');
      console.log('当前配置:', existingConfig);
    }

    // 2. 获取一些随机策略
    console.log('\n2️⃣ 获取策略用于填充6张卡片...');
    const { data: strategies, error: strategiesError } = await supabase
      .from('strategies')
      .select('id, title, slug, category')
      .eq('status', 'published')
      .limit(10);

    if (strategiesError) {
      console.error('❌ 获取策略失败:', strategiesError);
      return;
    }

    console.log(`✅ 找到 ${strategies.length} 个已发布的策略`);

    // 3. 更新今天的配置（添加6个策略）
    const today = new Date().toISOString().split('T')[0];

    if (strategies.length >= 6) {
      console.log('\n3️⃣ 更新今日精选配置（6张卡片）...');

      const { data: updated, error: updateError } = await supabase
        .from('daily_featured_plays')
        .update({
          play_4_id: strategies[3].id,
          play_5_id: strategies[4].id,
          play_6_id: strategies[5].id,
          theme_label: '今日精选'
        })
        .eq('feature_date', today)
        .select();

      if (updateError) {
        console.error('❌ 更新失败:', updateError);

        // 如果更新失败，可能是因为字段不存在，尝试创建新记录
        console.log('\n尝试创建新的今日精选配置...');
        const { data: inserted, error: insertError } = await supabase
          .from('daily_featured_plays')
          .insert({
            feature_date: today,
            play_1_id: strategies[0].id,
            play_2_id: strategies[1].id,
            play_3_id: strategies[2].id,
            play_4_id: strategies[3].id,
            play_5_id: strategies[4].id,
            play_6_id: strategies[5].id,
            theme_label: '今日精选',
            is_active: true
          })
          .select();

        if (insertError) {
          console.error('❌ 插入失败:', insertError);
          console.log('\n💡 需要手动在 Supabase 中添加以下列:');
          console.log('   - play_4_id (uuid, nullable)');
          console.log('   - play_5_id (uuid, nullable)');
          console.log('   - play_6_id (uuid, nullable)');
        } else {
          console.log('✅ 创建成功!');
          console.log('今日精选配置:', inserted[0]);
        }
      } else {
        console.log('✅ 更新成功!');
        if (updated && updated.length > 0) {
          console.log('今日精选配置:', updated[0]);
        }
      }

      // 4. 显示选中的策略
      console.log('\n📋 已配置的6个策略:');
      strategies.slice(0, 6).forEach((s, i) => {
        console.log(`   ${i + 1}. ${s.title} (${s.category})`);
      });

    } else {
      console.log('❌ 策略数量不足，至少需要6个已发布的策略');
    }

    console.log('\n✅ 完成！');

  } catch (error) {
    console.error('❌ 错误:', error);
  }
}

addSixCardsSupport();
