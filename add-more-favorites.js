const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cujpgrzjmmttysphjknu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1anBncnpqbW10dHlzcGhqa251Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTk5NDg5MywiZXhwIjoyMDc1NTcwODkzfQ.GB8A230FSm68ckj3_eUj9dUzqRtGc70k8Ebjp9dYsdY';

const supabase = createClient(supabaseUrl, supabaseKey);

// User ID (the_uk1@outlook.com)
const userId = '24da5b63-cda3-424d-b98e-dfa32cb61278';

async function addMoreFavorites() {
  console.log('🎯 添加更多收藏（服务商和新闻）...\n');

  const directusUrl = 'http://localhost:8055';
  const favoritesToAdd = [];

  try {
    // 获取服务商 (直接使用已知的或查询一些)
    console.log('📦 获取服务商...');
    const providersRes = await fetch(`${directusUrl}/items/service_providers?filter[status][_eq]=published&limit=5&fields=id,name`);
    const providers = await providersRes.json();

    if (providers.data && providers.data.length > 0) {
      console.log(`  找到 ${providers.data.length} 个服务商`);
      // 取前3个
      providers.data.slice(0, 3).forEach(provider => {
        console.log(`    - ${provider.name}`);
        favoritesToAdd.push({
          user_id: userId,
          item_type: 'provider',
          item_id: provider.id,
        });
      });
    } else {
      console.log('  ⚠️ 没有找到服务商');
    }

    // 获取新闻
    console.log('\n📰 获取新闻...');
    const newsRes = await fetch(`${directusUrl}/items/news?filter[status][_eq]=published&limit=5&fields=id,title`);
    const news = await newsRes.json();

    if (news.data && news.data.length > 0) {
      console.log(`  找到 ${news.data.length} 条新闻`);
      // 取前3个
      news.data.slice(0, 3).forEach(newsItem => {
        console.log(`    - ${newsItem.title?.substring(0, 40)}...`);
        favoritesToAdd.push({
          user_id: userId,
          item_type: 'news',
          item_id: newsItem.id,
        });
      });
    } else {
      console.log('  ⚠️ 没有找到新闻');
    }

    if (favoritesToAdd.length === 0) {
      console.log('\n⚠️ 没有新的内容可以添加');
      return;
    }

    console.log(`\n📝 准备添加 ${favoritesToAdd.length} 条新收藏...\n`);

    // 批量插入
    const { data: inserted, error } = await supabase
      .from('user_favorites')
      .insert(favoritesToAdd)
      .select();

    if (error) {
      console.error('❌ 插入失败:', error.message);
      return;
    }

    console.log(`✅ 成功添加 ${inserted.length} 条收藏!\n`);

    // 验证总数
    const { data: allFavorites } = await supabase
      .from('user_favorites')
      .select('*')
      .eq('user_id', userId);

    console.log('📊 总收藏统计:');
    const stats = {
      strategy: allFavorites?.filter(f => f.item_type === 'strategy').length || 0,
      provider: allFavorites?.filter(f => f.item_type === 'provider').length || 0,
      news: allFavorites?.filter(f => f.item_type === 'news').length || 0,
    };

    console.log(`  - 策略: ${stats.strategy}`);
    console.log(`  - 服务商: ${stats.provider}`);
    console.log(`  - 新闻: ${stats.news}`);
    console.log(`  - 总计: ${stats.strategy + stats.provider + stats.news}\n`);

    console.log('✨ 完成！');

  } catch (error) {
    console.error('❌ 错误:', error.message);
  }
}

addMoreFavorites();
