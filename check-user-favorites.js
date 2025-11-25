const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cujpgrzjmmttysphjknu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1anBncnpqbW10dHlzcGhqa251Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTk5NDg5MywiZXhwIjoyMDc1NTcwODkzfQ.GB8A230FSm68ckj3_eUj9dUzqRtGc70k8Ebjp9dYsdY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUserFavorites() {
  console.log('🔍 检查 user_favorites 表...\n');

  // 1. 尝试查询 user_favorites 表
  const { data: favorites, error: favError } = await supabase
    .from('user_favorites')
    .select('*')
    .limit(5);

  if (favError) {
    console.log('❌ user_favorites 表不存在或无法访问');
    console.log('错误:', favError.message);
    console.log('\n这意味着收藏数据可能存储在 Directus 中，而不是 Supabase');
  } else {
    console.log('✅ user_favorites 表存在！');
    console.log(`\n总记录数: ${favorites.length}`);

    if (favorites.length > 0) {
      console.log('\n示例数据:');
      favorites.forEach((fav, idx) => {
        console.log(`\n${idx + 1}. ID: ${fav.id}`);
        console.log(`   User ID: ${fav.user_id}`);
        console.log(`   Item Type: ${fav.item_type}`);
        console.log(`   Item ID: ${fav.item_id}`);
        console.log(`   Created: ${fav.created_at}`);
      });

      // 统计每种类型的数量
      const stats = {
        strategy: favorites.filter(f => f.item_type === 'strategy').length,
        provider: favorites.filter(f => f.item_type === 'provider').length,
        news: favorites.filter(f => f.item_type === 'news').length,
        total: favorites.length
      };

      console.log('\n📊 统计:');
      console.log(`   策略: ${stats.strategy}`);
      console.log(`   服务商: ${stats.provider}`);
      console.log(`   新闻: ${stats.news}`);
      console.log(`   总计: ${stats.total}`);
    } else {
      console.log('\n⚠️ 表存在但没有数据');
    }
  }

  // 2. 检查 user_profiles 表
  console.log('\n\n🔍 检查 user_profiles 表...\n');

  const { data: profiles, error: profileError } = await supabase
    .from('user_profiles')
    .select('id, username, created_at')
    .limit(5);

  if (profileError) {
    console.log('❌ user_profiles 表不存在或无法访问');
    console.log('错误:', profileError.message);
  } else {
    console.log('✅ user_profiles 表存在！');
    console.log(`\n用户数: ${profiles.length}`);

    if (profiles.length > 0) {
      console.log('\n用户列表:');
      profiles.forEach((p, idx) => {
        console.log(`${idx + 1}. ID: ${p.id.substring(0, 8)}... | Username: ${p.username || '(未设置)'} | Created: ${p.created_at}`);
      });
    }
  }
}

checkUserFavorites().catch(console.error);
