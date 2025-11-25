const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cujpgrzjmmttysphjknu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1anBncnpqbW10dHlzcGhqa251Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTk5NDg5MywiZXhwIjoyMDc1NTcwODkzfQ.GB8A230FSm68ckj3_eUj9dUzqRtGc70k8Ebjp9dYsdY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function viewExistingGossip() {
  console.log('📊 查看现有八卦数据...\n');

  const { data, error } = await supabase
    .from('news')
    .select('id, title, source, category, created_at, status')
    .eq('news_type', 'gossip')
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('❌ 查询失败:', error.message);
    return;
  }

  console.log(`找到 ${data.length} 条最新八卦:\n`);
  console.log('='.repeat(80));

  data.forEach((item, index) => {
    console.log(`\n${index + 1}. ${item.title}`);
    console.log(`   来源: ${item.source || '未知'} | 分类: ${item.category || '未分类'} | 状态: ${item.status}`);
    console.log(`   创建时间: ${new Date(item.created_at).toLocaleString('zh-CN')}`);
    console.log(`   ID: ${item.id}`);
  });

  console.log('\n' + '='.repeat(80));
  console.log('\n💡 这些八卦数据在执行迁移后会自动初始化:');
  console.log('   - credibility_score: 50-90 (随机可信度)');
  console.log('   - hotness_score: 0-80 (随机热度)');
  console.log('   - verification_status: unverified (未求证)');
  console.log('   - likes_count: 0-50 (随机点赞)');
  console.log('   - comments_count: 0-30 (随机评论)');
  console.log('   - gossip_tags: ["未分类"]\n');
}

viewExistingGossip();
