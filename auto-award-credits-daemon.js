const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cujpgrzjmmttysphjknu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1anBncnpqbW10dHlzcGhqa251Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTk5NDg5MywiZXhwIjoyMDc1NTcwODkzfQ.GB8A230FSm68ckj3_eUj9dUzqRtGc70k8Ebjp9dYsdY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function processApprovedSubmissions() {
  try {
    console.log('🔍 检查待发放积分的审核记录...');

    // 查找所有 approved 但还没有 credits_awarded_at 的记录
    const { data: pendingCredits, error } = await supabase
      .from('user_submitted_plays')
      .select('*')
      .eq('status', 'approved')
      .is('credits_awarded_at', null)
      .gt('credits_awarded', 0);

    if (error) {
      console.error('❌ 查询失败:', error.message);
      return;
    }

    if (!pendingCredits || pendingCredits.length === 0) {
      console.log('✅ 没有待发放的积分');
      return;
    }

    console.log(`💰 发现 ${pendingCredits.length} 条待发放积分的记录\n`);

    for (const submission of pendingCredits) {
      try {
        // 获取用户当前积分
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('credits')
          .eq('id', submission.user_id)
          .single();

        const currentCredits = profile?.credits || 0;
        const newCredits = currentCredits + submission.credits_awarded;

        console.log(`  📝 ${submission.title}`);
        console.log(`     用户: ${submission.user_id.substring(0, 8)}...`);
        console.log(`     奖励: +${submission.credits_awarded} 积分`);
        console.log(`     ${currentCredits} → ${newCredits}`);

        // 更新用户积分
        const { error: updateError } = await supabase
          .from('user_profiles')
          .update({ credits: newCredits })
          .eq('id', submission.user_id);

        if (updateError) {
          console.log(`     ❌ 更新失败: ${updateError.message}`);
          continue;
        }

        // 创建交易记录
        const transactionData = {
          user_id: submission.user_id,
          transaction_type: 'earn',
          amount: submission.credits_awarded,
          balance_before: currentCredits,
          balance_after: newCredits,
          source_type: 'submission_reward',
          source_id: submission.id,
          source_metadata: {
            submission_title: submission.title,
            category: submission.category,
          },
          description: `玩法审核通过奖励：${submission.title}`,
          display_title: '玩法审核奖励',
          status: 'completed',
        };

        const { error: txError } = await supabase
          .from('playpass_transactions')
          .insert(transactionData);

        if (txError) {
          console.log(`     ⚠️  交易记录创建失败: ${txError.message}`);
        }

        // 标记积分已发放
        await supabase
          .from('user_submitted_plays')
          .update({ credits_awarded_at: new Date().toISOString() })
          .eq('id', submission.id);

        console.log(`     ✅ 积分已发放 + 交易记录已创建\n`);

      } catch (err) {
        console.error(`     ❌ 处理失败:`, err.message);
      }
    }

    console.log('🎉 积分发放完成！\n');

  } catch (error) {
    console.error('❌ 错误:', error.message);
  }
}

// 如果直接运行，执行一次
if (require.main === module) {
  processApprovedSubmissions().then(() => {
    console.log('📍 提示: 可以将此脚本添加到 cron 或使用 pm2 定时运行');
    console.log('   例如: */5 * * * * node /Users/m1/PlayNew_0.3/auto-award-credits-daemon.js\n');
    process.exit(0);
  });
}

module.exports = { processApprovedSubmissions };
