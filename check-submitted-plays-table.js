const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cujpgrzjmmttysphjknu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1anBncnpqbW10dHlzcGhqa251Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTk5NDg5MywiZXhwIjoyMDc1NTcwODkzfQ.GB8A230FSm68ckj3_eUj9dUzqRtGc70k8Ebjp9dYsdY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTable() {
  console.log('🔍 检查 user_submitted_plays 表...\n');

  // 尝试查询表
  const { data, error } = await supabase
    .from('user_submitted_plays')
    .select('*')
    .limit(5);

  if (error) {
    console.log('❌ 表不存在或无法访问');
    console.log('错误:', error.message);
    return;
  }

  console.log('✅ user_submitted_plays 表存在！');
  console.log(`\n记录数: ${data.length}`);

  if (data.length > 0) {
    console.log('\n示例数据:');
    console.log('字段:', Object.keys(data[0]).join(', '));
    data.forEach((item, idx) => {
      console.log(`\n${idx + 1}. ${item.title || '(无标题)'}`);
      console.log(`   状态: ${item.status}`);
      console.log(`   用户: ${item.user_id?.substring(0, 8)}...`);
      console.log(`   积分: ${item.credits_awarded || 0}`);
    });
  } else {
    console.log('\n⚠️ 表为空');
  }
}

checkTable().catch(console.error);
