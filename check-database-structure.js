#!/usr/bin/env node

/**
 * 检查 Supabase 数据库结构
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cujpgrzjmmttysphjknu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1anBncnpqbW10dHlzcGhqa251Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTk5NDg5MywiZXhwIjoyMDc1NTcwODkzfQ.GB8A230FSm68ckj3_eUj9dUzqRtGc70k8Ebjp9dYsdY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabaseStructure() {
  console.log('🔍 正在检查 Supabase 数据库结构...\n');

  try {
    // 1. 检查 strategies 表是否存在
    console.log('📊 检查 strategies 表结构:');
    const { data: strategies, error: strategiesError } = await supabase
      .from('strategies')
      .select('*')
      .limit(1);

    if (strategiesError) {
      console.log('❌ strategies 表查询失败:', strategiesError.message);
    } else if (strategies && strategies.length > 0) {
      console.log('✅ strategies 表存在');
      console.log('\n当前字段:');
      console.log(Object.keys(strategies[0]).join(', '));

      // 检查是否已有排行榜字段
      const sample = strategies[0];
      const hasHotness = 'hotness_score' in sample;
      const hasShareCount = 'share_count' in sample;
      const hasCommentCount = 'comment_count' in sample;
      const hasFeaturedOrder = 'featured_order' in sample;

      console.log('\n排行榜字段检查:');
      console.log(`  hotness_score: ${hasHotness ? '✅ 已存在' : '❌ 需要添加'}`);
      console.log(`  share_count: ${hasShareCount ? '✅ 已存在' : '❌ 需要添加'}`);
      console.log(`  comment_count: ${hasCommentCount ? '✅ 已存在' : '❌ 需要添加'}`);
      console.log(`  featured_order: ${hasFeaturedOrder ? '✅ 已存在' : '❌ 需要添加'}`);
    }

    // 2. 统计策略数量
    console.log('\n📈 策略统计:');
    const { count: totalCount } = await supabase
      .from('strategies')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published');

    console.log(`  已发布策略数: ${totalCount || 0}`);

    // 3. 检查现有互动数据
    const { data: sampleStrategies } = await supabase
      .from('strategies')
      .select('id, title, view_count, bookmark_count')
      .eq('status', 'published')
      .order('view_count', { ascending: false })
      .limit(5);

    if (sampleStrategies && sampleStrategies.length > 0) {
      console.log('\n🔥 浏览量 Top 5:');
      sampleStrategies.forEach((s, i) => {
        console.log(`  ${i + 1}. ${s.title}`);
        console.log(`     浏览: ${s.view_count || 0} | 收藏: ${s.bookmark_count || 0}`);
      });
    }

    console.log('\n✅ 数据库结构检查完成!');

  } catch (error) {
    console.error('❌ 错误:', error.message);
  }
}

checkDatabaseStructure();
