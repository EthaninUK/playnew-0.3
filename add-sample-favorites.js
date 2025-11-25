const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cujpgrzjmmttysphjknu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1anBncnpqbW10dHlzcGhqa251Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTk5NDg5MywiZXhwIjoyMDc1NTcwODkzfQ.GB8A230FSm68ckj3_eUj9dUzqRtGc70k8Ebjp9dYsdY';

const supabase = createClient(supabaseUrl, supabaseKey);

// User ID from auth.users (the_uk1@outlook.com)
const userId = '24da5b63-cda3-424d-b98e-dfa32cb61278';

async function addSampleFavorites() {
  console.log('🎯 为用户添加示例收藏数据...\n');
  console.log(`用户 ID: ${userId}\n`);

  // 首先，从 Directus 获取一些真实的内容 ID
  const directusUrl = 'http://localhost:8055';

  try {
    // 获取一些策略
    const strategiesRes = await fetch(`${directusUrl}/items/strategies?filter[status][_eq]=published&limit=3&fields=id,title,slug`);
    const strategies = await strategiesRes.json();

    // 获取一些服务商
    const providersRes = await fetch(`${directusUrl}/items/service_providers?filter[status][_eq]=published&limit=2&fields=id,name,slug`);
    const providers = await providersRes.json();

    // 获取一些新闻
    const newsRes = await fetch(`${directusUrl}/items/news?filter[status][_eq]=published&limit=2&fields=id,title,slug`);
    const news = await newsRes.json();

    console.log('📚 获取到的内容:');
    console.log(`  - 策略: ${strategies.data?.length || 0} 个`);
    console.log(`  - 服务商: ${providers.data?.length || 0} 个`);
    console.log(`  - 新闻: ${news.data?.length || 0} 个\n`);

    const favoritesToAdd = [];

    // 添加策略收藏
    if (strategies.data && strategies.data.length > 0) {
      strategies.data.forEach((strategy, idx) => {
        console.log(`  ${idx + 1}. 策略: ${strategy.title} (${strategy.slug})`);
        favoritesToAdd.push({
          user_id: userId,
          item_type: 'strategy',
          item_id: strategy.id,
        });
      });
    }

    // 添加服务商收藏
    if (providers.data && providers.data.length > 0) {
      providers.data.forEach((provider, idx) => {
        console.log(`  ${idx + 1}. 服务商: ${provider.name} (${provider.slug})`);
        favoritesToAdd.push({
          user_id: userId,
          item_type: 'provider',
          item_id: provider.id,
        });
      });
    }

    // 添加新闻收藏
    if (news.data && news.data.length > 0) {
      news.data.forEach((newsItem, idx) => {
        console.log(`  ${idx + 1}. 新闻: ${newsItem.title?.substring(0, 50)}...`);
        favoritesToAdd.push({
          user_id: userId,
          item_type: 'news',
          item_id: newsItem.id,
        });
      });
    }

    console.log(`\n📝 准备添加 ${favoritesToAdd.length} 条收藏记录...\n`);

    // 批量插入收藏
    const { data: inserted, error } = await supabase
      .from('user_favorites')
      .insert(favoritesToAdd)
      .select();

    if (error) {
      console.error('❌ 插入失败:', error.message);
      throw error;
    }

    console.log(`✅ 成功添加 ${inserted.length} 条收藏记录!\n`);

    // 验证数据
    const { data: allFavorites } = await supabase
      .from('user_favorites')
      .select('*')
      .eq('user_id', userId);

    console.log('📊 当前收藏统计:');
    const stats = {
      strategy: allFavorites?.filter(f => f.item_type === 'strategy').length || 0,
      provider: allFavorites?.filter(f => f.item_type === 'provider').length || 0,
      news: allFavorites?.filter(f => f.item_type === 'news').length || 0,
    };

    console.log(`  - 策略: ${stats.strategy}`);
    console.log(`  - 服务商: ${stats.provider}`);
    console.log(`  - 新闻: ${stats.news}`);
    console.log(`  - 总计: ${stats.strategy + stats.provider + stats.news}\n`);

    console.log('✨ 完成！现在刷新个人中心页面，应该能看到收藏数据了。');

  } catch (error) {
    console.error('❌ 错误:', error.message);
  }
}

addSampleFavorites();
