const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cujpgrzjmmttysphjknu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1anBncnpqbW10dHlzcGhqa251Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTk5NDg5MywiZXhwIjoyMDc1NTcwODkzfQ.GB8A230FSm68ckj3_eUj9dUzqRtGc70k8Ebjp9dYsdY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkStructure() {
  console.log('🔍 检查 playpass_transactions 表结构...\n');

  const userId = '24da5b63-cda3-424d-b98e-dfa32cb61278';

  // 获取一条记录查看字段
  const { data, error } = await supabase
    .from('playpass_transactions')
    .select('*')
    .eq('user_id', userId)
    .limit(1);

  if (error) {
    console.error('❌ 查询失败:', error.message);
    return;
  }

  if (data && data.length > 0) {
    console.log('✅ 表结构（字段列表）:');
    console.log('   ', Object.keys(data[0]).join(', '));
    console.log('');
    console.log('📝 示例记录:');
    console.log(JSON.stringify(data[0], null, 2));
  } else {
    console.log('⚠️  表中没有数据，无法查看结构');
    console.log('尝试查看表的模式定义...');
  }
}

checkStructure();
