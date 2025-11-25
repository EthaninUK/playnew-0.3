const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cujpgrzjmmttysphjknu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1anBncnpqbW10dHlzcGhqa251Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTk5NDg5MywiZXhwIjoyMDc1NTcwODkzfQ.GB8A230FSm68ckj3_eUj9dUzqRtGc70k8Ebjp9dYsdY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPPSources() {
  const userId = '24da5b63-cda3-424d-b98e-dfa32cb61278';

  console.log('🔍 检查所有 PP 积分来源...\n');

  // 1. 检查交易记录表
  console.log('1️⃣ 检查 playpass_transactions 表:\n');

  const { data: transactions, error: txError } = await supabase
    .from('playpass_transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (txError) {
    console.error('❌ 查询失败:', txError.message);
  } else {
    console.log(`   找到 ${transactions?.length || 0} 条交易记录:`);
    transactions?.forEach((tx, i) => {
      console.log(`   ${i + 1}. ${tx.type} | ${tx.amount > 0 ? '+' : ''}${tx.amount} PP | ${tx.description}`);
      console.log(`      时间: ${new Date(tx.created_at).toLocaleString('zh-CN')}`);
    });
  }
  console.log('');

  // 2. 检查已通过的提交记录
  console.log('2️⃣ 检查已通过的玩法提交（应该生成交易记录）:\n');

  const { data: submissions } = await supabase
    .from('user_submitted_plays')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'approved')
    .order('reviewed_at', { ascending: false });

  console.log(`   已通过的提交: ${submissions?.length || 0} 条`);
  submissions?.forEach((s, i) => {
    const hasTransaction = transactions?.find(tx =>
      tx.reference_id === s.id ||
      tx.description?.includes(s.title)
    );
    console.log(`   ${i + 1}. ${s.title}`);
    console.log(`      奖励: +${s.credits_awarded} PP`);
    console.log(`      发放时间: ${s.credits_awarded_at ? new Date(s.credits_awarded_at).toLocaleString('zh-CN') : '未发放'}`);
    console.log(`      交易记录: ${hasTransaction ? '✓ 已创建' : '✗ 缺失'}`);
  });
  console.log('');

  // 3. 检查每日签到
  console.log('3️⃣ 检查每日签到记录:\n');

  const signInTransactions = transactions?.filter(tx => tx.type === 'daily_signin');
  console.log(`   签到交易记录: ${signInTransactions?.length || 0} 条`);
  console.log('');

  // 4. 统计应有的 PP 总数
  console.log('4️⃣ 积分来源统计:\n');

  const submissionCredits = submissions?.reduce((sum, s) => sum + (s.credits_awarded || 0), 0) || 0;
  const signInCredits = signInTransactions?.reduce((sum, tx) => sum + tx.amount, 0) || 0;
  const totalFromTransactions = transactions?.reduce((sum, tx) => sum + tx.amount, 0) || 0;

  console.log(`   玩法提交应得: ${submissionCredits} PP`);
  console.log(`   签到获得: ${signInCredits} PP`);
  console.log(`   交易记录总计: ${totalFromTransactions} PP`);
  console.log('');

  // 5. 检查实际积分
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('credits')
    .eq('id', userId)
    .single();

  console.log(`   用户实际积分: ${profile?.credits || 0} PP\n`);

  console.log('📊 需要补充的交易记录:\n');

  // 找出缺失的交易记录
  const missingTransactions = [];

  submissions?.forEach(s => {
    if (!s.credits_awarded_at) return; // 未发放的跳过

    const hasTransaction = transactions?.find(tx =>
      tx.reference_id === s.id
    );

    if (!hasTransaction && s.credits_awarded > 0) {
      missingTransactions.push({
        type: 'submission_reward',
        amount: s.credits_awarded,
        description: `玩法审核通过奖励：${s.title}`,
        reference_id: s.id,
        reference_type: 'user_submitted_plays',
        created_at: s.credits_awarded_at,
      });
    }
  });

  if (missingTransactions.length > 0) {
    console.log(`   发现 ${missingTransactions.length} 条缺失的交易记录\n`);

    console.log('💡 建议操作:');
    console.log('   运行补充脚本将这些记录添加到 playpass_transactions 表\n');

    return { missingTransactions, userId };
  } else {
    console.log('   ✅ 所有交易记录完整\n');
    return { missingTransactions: [], userId };
  }
}

checkPPSources().then(result => {
  if (result.missingTransactions.length > 0) {
    console.log('📝 执行以下命令补充交易记录:');
    console.log('   node /Users/m1/PlayNew_0.3/sync-submission-transactions.js\n');
  }
});
