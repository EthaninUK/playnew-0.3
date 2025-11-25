const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cujpgrzjmmttysphjknu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1anBncnpqbW10dHlzcGhqa251Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTk5NDg5MywiZXhwIjoyMDc1NTcwODkzfQ.GB8A230FSm68ckj3_eUj9dUzqRtGc70k8Ebjp9dYsdY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const userId = '24da5b63-cda3-424d-b98e-dfa32cb61278';

  console.log('🔍 查询用户当前状态...\n');

  // 获取用户积分
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('credits, username, display_name')
    .eq('id', userId)
    .single();

  console.log('👤 用户信息:');
  console.log(`   用户名: ${profile.username || profile.display_name || 'the_uk1@outlook.com'}`);
  console.log(`   当前积分: ${profile.credits} PP\n`);

  // 获取提交记录统计
  const { data: submissions } = await supabase
    .from('user_submitted_plays')
    .select('*')
    .eq('user_id', userId);

  const stats = {
    total: submissions.length,
    pending: submissions.filter(s => s.status === 'pending').length,
    approved: submissions.filter(s => s.status === 'approved').length,
    rejected: submissions.filter(s => s.status === 'rejected').length,
    totalEarned: submissions
      .filter(s => s.status === 'approved' && s.credits_awarded_at)
      .reduce((sum, s) => sum + (s.credits_awarded || 0), 0),
  };

  console.log('📊 提交记录统计:');
  console.log(`   总提交: ${stats.total} 条`);
  console.log(`   待审核: ${stats.pending} 条`);
  console.log(`   已通过: ${stats.approved} 条`);
  console.log(`   已拒绝: ${stats.rejected} 条`);
  console.log(`   累计获得积分: ${stats.totalEarned} PP\n`);

  // 列出已通过的记录
  const approved = submissions.filter(s => s.status === 'approved');
  if (approved.length > 0) {
    console.log('✅ 已通过的提交:');
    approved.forEach((s, i) => {
      const awarded = s.credits_awarded_at ? '✓ 已发放' : '⏳ 待发放';
      console.log(`   ${i + 1}. ${s.title}`);
      console.log(`      +${s.credits_awarded} 积分 ${awarded}`);
      if (s.review_notes) {
        console.log(`      审核意见: ${s.review_notes}`);
      }
      console.log('');
    });
  }

  console.log('📍 访问链接:');
  console.log('   会员中心: http://localhost:3000/member-center');
  console.log('   提交玩法: http://localhost:3000/member-center?tab=submit');
  console.log('   Directus: http://localhost:8055/admin/content/user_submitted_plays\n');
}

check();
