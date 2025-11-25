const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cujpgrzjmmttysphjknu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1anBncnpqbW10dHlzcGhqa251Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTk5NDg5MywiZXhwIjoyMDc1NTcwODkzfQ.GB8A230FSm68ckj3_eUj9dUzqRtGc70k8Ebjp9dYsdY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  console.log('🔍 检查用户积分系统...\n');

  const userId = '24da5b63-cda3-424d-b98e-dfa32cb61278'; // the_uk1@outlook.com

  try {
    // 检查 user_profiles 表
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (profileError) {
      console.error('❌ user_profiles 查询错误:', profileError.message);
    } else {
      console.log('✅ 当前用户档案:');
      console.log('   用户ID:', profile.user_id);
      console.log('   当前积分 (points):', profile.points);
      console.log('   会员等级:', profile.membership_tier);
      console.log('\n');
    }

    // 检查已通过的提交记录
    const { data: submissions, error: submissionsError } = await supabase
      .from('user_submitted_plays')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'approved')
      .order('reviewed_at', { ascending: false });

    if (submissionsError) {
      console.error('❌ 提交记录查询错误:', submissionsError.message);
    } else {
      console.log(`✅ 已通过的提交记录 (${submissions.length} 条):`);
      let totalAwarded = 0;
      submissions.forEach((s, i) => {
        console.log(`   ${i + 1}. ${s.title}`);
        console.log(`      奖励积分: ${s.credits_awarded}`);
        console.log(`      审核时间: ${new Date(s.reviewed_at).toLocaleString('zh-CN')}`);
        totalAwarded += s.credits_awarded || 0;
      });
      console.log(`\n   应获得总积分: ${totalAwarded}\n`);
    }

    console.log('💡 需要实现的功能:');
    console.log('   1. 在 Directus 中审核通过时，自动触发积分增加');
    console.log('   2. 创建 Directus Flow/Hook 或数据库触发器');
    console.log('   3. 更新 user_profiles.points 字段\n');

  } catch (error) {
    console.error('❌ 错误:', error.message);
  }
}

check();
