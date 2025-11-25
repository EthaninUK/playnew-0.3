const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cujpgrzjmmttysphjknu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1anBncnpqbW10dHlzcGhqa251Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTk5NDg5MywiZXhwIjoyMDc1NTcwODkzfQ.GB8A230FSm68ckj3_eUj9dUzqRtGc70k8Ebjp9dYsdY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function syncTransactions() {
  const userId = '24da5b63-cda3-424d-b98e-dfa32cb61278';

  console.log('🔄 同步玩法提交的交易记录...\n');

  // 1. 获取所有已发放积分的提交记录
  const { data: submissions } = await supabase
    .from('user_submitted_plays')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'approved')
    .not('credits_awarded_at', 'is', null)
    .order('credits_awarded_at', { ascending: true });

  if (!submissions || submissions.length === 0) {
    console.log('✅ 没有需要同步的记录\n');
    return;
  }

  console.log(`📝 找到 ${submissions.length} 条已发放积分的提交记录\n`);

  // 2. 获取现有的交易记录
  const { data: existingTransactions } = await supabase
    .from('playpass_transactions')
    .select('source_id')
    .eq('user_id', userId)
    .eq('source_type', 'submission_reward');

  const existingSourceIds = new Set(
    existingTransactions?.map(tx => tx.source_id) || []
  );

  // 3. 获取当前用户积分（用于计算 balance_before/after）
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('credits')
    .eq('id', userId)
    .single();

  let currentBalance = profile?.credits || 0;

  // 4. 找出缺失的交易记录（按时间倒序，从最新的开始回溯）
  const missingSubmissions = submissions
    .filter(s => !existingSourceIds.has(s.id) && s.credits_awarded > 0)
    .reverse(); // 倒序，从最新的开始

  if (missingSubmissions.length === 0) {
    console.log('✅ 所有交易记录已同步\n');
    return;
  }

  console.log(`💰 准备添加 ${missingSubmissions.length} 条交易记录:\n`);

  const missingTransactions = [];

  for (const s of missingSubmissions) {
    const balanceAfter = currentBalance;
    const balanceBefore = currentBalance - s.credits_awarded;

    console.log(`   ${missingTransactions.length + 1}. 玩法审核通过奖励：${s.title}`);
    console.log(`      金额: +${s.credits_awarded} PP`);
    console.log(`      余额变化: ${balanceBefore} → ${balanceAfter} PP`);
    console.log(`      时间: ${new Date(s.credits_awarded_at).toLocaleString('zh-CN')}`);

    missingTransactions.unshift({
      user_id: userId,
      transaction_type: 'earn',
      amount: s.credits_awarded,
      balance_before: balanceBefore,
      balance_after: balanceAfter,
      source_type: 'submission_reward',
      source_id: s.id,
      source_metadata: {
        submission_title: s.title,
        category: s.category,
      },
      description: `玩法审核通过奖励：${s.title}`,
      display_title: '玩法审核奖励',
      status: 'completed',
      created_at: s.credits_awarded_at,
    });

    currentBalance = balanceBefore;
  }

  console.log('');

  // 5. 批量插入交易记录
  const { data: inserted, error } = await supabase
    .from('playpass_transactions')
    .insert(missingTransactions)
    .select();

  if (error) {
    console.error('❌ 插入失败:', error.message);
    console.error('错误详情:', error);
    return;
  }

  console.log(`✅ 成功添加 ${inserted.length} 条交易记录\n`);

  // 6. 验证结果
  const { data: allTransactions } = await supabase
    .from('playpass_transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  console.log('📊 当前所有交易记录:\n');

  let totalEarned = 0;
  let totalSpent = 0;

  allTransactions?.forEach((tx, i) => {
    const sign = tx.amount > 0 ? '+' : '';
    console.log(`   ${i + 1}. ${tx.display_title || tx.transaction_type} | ${sign}${tx.amount} PP`);
    console.log(`      ${tx.description}`);
    console.log(`      时间: ${new Date(tx.created_at).toLocaleString('zh-CN')}`);

    if (tx.amount > 0) {
      totalEarned += tx.amount;
    } else {
      totalSpent += Math.abs(tx.amount);
    }
  });

  console.log('');
  console.log(`💵 统计:`);
  console.log(`   总收入: +${totalEarned} PP`);
  console.log(`   总支出: -${totalSpent} PP`);
  console.log(`   净收益: ${totalEarned - totalSpent} PP\n`);

  console.log(`   用户实际积分: ${profile?.credits || 0} PP`);
  console.log('');

  console.log('🎉 同步完成！现在刷新会员中心的"交易记录"页面即可看到完整记录。\n');
}

syncTransactions();
