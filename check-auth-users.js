const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cujpgrzjmmttysphjknu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1anBncnpqbW10dHlzcGhqa251Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTk5NDg5MywiZXhwIjoyMDc1NTcwODkzfQ.GB8A230FSm68ckj3_eUj9dUzqRtGc70k8Ebjp9dYsdY';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function checkAuthUsers() {
  console.log('🔍 检查 Supabase Auth 用户...\n');

  // 使用 service role 访问 auth.users
  const { data, error } = await supabase.auth.admin.listUsers();

  if (error) {
    console.error('❌ 错误:', error.message);
    return;
  }

  console.log(`找到 ${data.users.length} 个认证用户:\n`);

  data.users.forEach((user, idx) => {
    console.log(`${idx + 1}. ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Created: ${new Date(user.created_at).toLocaleDateString()}`);
    console.log(`   Confirmed: ${user.email_confirmed_at ? '是' : '否'}\n`);
  });

  // 同时检查 user_profiles
  console.log('📋 检查 user_profiles 表...\n');

  const { data: profiles } = await supabase
    .from('user_profiles')
    .select('id, username')
    .limit(10);

  if (profiles && profiles.length > 0) {
    console.log(`找到 ${profiles.length} 个用户资料:\n`);
    profiles.forEach((profile, idx) => {
      const authUser = data.users.find(u => u.id === profile.id);
      console.log(`${idx + 1}. ${profile.username || '(未设置)'}`);
      console.log(`   ID: ${profile.id}`);
      console.log(`   Auth用户: ${authUser ? authUser.email : '❌ 不匹配'}\n`);
    });
  }
}

checkAuthUsers().catch(console.error);
