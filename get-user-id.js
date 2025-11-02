// 获取 Supabase 用户 ID

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cujpgrzjmmttysphjknu.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1anBncnpqbW10dHlzcGhqa251Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTk5NDg5MywiZXhwIjoyMDc1NTcwODkzfQ.GB8A230FSm68ckj3_eUj9dUzqRtGc70k8Ebjp9dYsdY';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function getUserId() {
  console.log('🔍 Fetching users from Supabase...');
  console.log('');

  try {
    const { data: users, error } = await supabase.auth.admin.listUsers();

    if (error) {
      console.error('Error:', error);
      return;
    }

    console.log(`Found ${users.users.length} users:`);
    console.log('');

    users.users.forEach((user, index) => {
      console.log(`${index + 1}. Email: ${user.email}`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Created: ${new Date(user.created_at).toLocaleString()}`);
      console.log('');
    });

    // 返回第一个用户的 ID
    if (users.users.length > 0) {
      console.log('✅ Will use first user for test subscription');
      console.log('User ID:', users.users[0].id);
      console.log('Email:', users.users[0].email);
      return users.users[0].id;
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

getUserId().then(userId => {
  if (userId) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});
