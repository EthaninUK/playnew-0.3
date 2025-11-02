const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cujpgrzjmmttysphjknu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1anBncnpqbW10dHlzcGhqa251Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTk5NDg5MywiZXhwIjoyMDc1NTcwODkzfQ.GB8A230FSm68ckj3_eUj9dUzqRtGc70k8Ebjp9dYsdY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkInteractions() {
  console.log('🔍 检查 user_interactions 表...\n');

  // 获取所有交互记录
  const { data, error } = await supabase
    .from('user_interactions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('❌ 查询失败:', error);
    return;
  }

  const count = data ? data.length : 0;
  console.log(`✅ 找到 ${count} 条记录\n`);

  if (data && data.length > 0) {
    console.log('📊 表结构字段:');
    console.log(Object.keys(data[0]).join(', '));
    console.log('\n📝 最近的交互记录:');

    data.forEach((record, index) => {
      console.log(`\n${index + 1}. ID: ${record.id}`);
      console.log(`   用户: ${record.user_id}`);
      console.log(`   内容类型: ${record.content_type}`);
      console.log(`   内容ID: ${record.content_id}`);
      console.log(`   操作: ${record.action || record.interaction_type || '未知'}`);
      console.log(`   时间: ${record.created_at}`);
    });
  } else {
    console.log('⚠️  表中没有数据');
  }

  // 检查当前用户
  console.log('\n\n🔍 检查所有用户...');
  const { data: userData, error: usersError } = await supabase.auth.admin.listUsers();

  if (usersError) {
    console.error('❌ 查询用户失败:', usersError);
  } else {
    const userCount = userData && userData.users ? userData.users.length : 0;
    console.log(`✅ 找到 ${userCount} 个用户`);
    if (userData && userData.users) {
      userData.users.forEach((user, index) => {
        console.log(`\n${index + 1}. ${user.email}`);
        console.log(`   ID: ${user.id}`);
      });
    }
  }
}

checkInteractions().catch(console.error);
