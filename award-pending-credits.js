const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cujpgrzjmmttysphjknu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1anBncnpqbW10dHlzcGhqa251Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTk5NDg5MywiZXhwIjoyMDc1NTcwODkzfQ.GB8A230FSm68ckj3_eUj9dUzqRtGc70k8Ebjp9dYsdY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function awardCredits() {
  console.log('💰 补发已审核通过的积分...\n');

  const userId = '24da5b63-cda3-424d-b98e-dfa32cb61278';

  try {
    // 1. 获取当前积分
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('credits')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('❌ 查询用户失败:', profileError.message);
      return;
    }

    const currentCredits = profile?.credits || 0;
    console.log('📊 当前积分:', currentCredits);

    // 2. 获取所有已通过的提交记录
    const { data: approvedSubmissions, error: submissionsError } = await supabase
      .from('user_submitted_plays')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'approved');

    if (submissionsError) {
      console.error('❌ 查询提交记录失败:', submissionsError.message);
      return;
    }

    console.log(`\n✅ 已通过的提交: ${approvedSubmissions.length} 条\n`);

    // 3. 计算应得总积分
    let totalAwarded = 0;
    approvedSubmissions.forEach((submission, i) => {
      const credits = submission.credits_awarded || 0;
      totalAwarded += credits;
      console.log(`   ${i + 1}. ${submission.title}`);
      console.log(`      奖励: +${credits} 积分`);
      console.log(`      审核时间: ${new Date(submission.reviewed_at).toLocaleString('zh-CN')}\n`);
    });

    console.log(`💵 应得总积分: ${totalAwarded}`);
    console.log(`📈 更新后积分: ${currentCredits} → ${currentCredits + totalAwarded}\n`);

    // 4. 更新用户积分（累加方式）
    const newCredits = currentCredits + totalAwarded;

    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({ credits: newCredits })
      .eq('id', userId);

    if (updateError) {
      console.error('❌ 更新积分失败:', updateError.message);
      return;
    }

    console.log('✅ 积分已发放到账户！\n');

    // 5. 验证更新结果
    const { data: updatedProfile } = await supabase
      .from('user_profiles')
      .select('credits')
      .eq('id', userId)
      .single();

    console.log('🎉 最新积分:', updatedProfile?.credits);
    console.log('\n📍 现在可以在会员中心查看更新后的积分！\n');

  } catch (error) {
    console.error('❌ 错误:', error.message);
  }
}

awardCredits();
