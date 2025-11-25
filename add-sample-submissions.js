const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cujpgrzjmmttysphjknu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1anBncnpqbW10dHlzcGhqa251Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTk5NDg5MywiZXhwIjoyMDc1NTcwODkzfQ.GB8A230FSm68ckj3_eUj9dUzqRtGc70k8Ebjp9dYsdY';

const supabase = createClient(supabaseUrl, supabaseKey);

// User ID (the_uk1@outlook.com)
const userId = '24da5b63-cda3-424d-b98e-dfa32cb61278';

async function addSampleSubmissions() {
  console.log('🎯 添加示例提交记录...\n');

  const submissions = [
    {
      user_id: userId,
      title: 'Blast 积分空投完整教程',
      category: 'airdrop-tasks',
      content: '详细介绍如何参与 Blast 积分活动，包括桥接资产、获取积分和邀请好友的完整流程...',
      status: 'approved',
      credits_awarded: 50,
      review_notes: '内容详细，审核通过',
      reviewed_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2天前
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5天前
    },
    {
      user_id: userId,
      title: 'Starknet 测试网任务攻略',
      category: 'testnet',
      content: 'Starknet 测试网的所有任务步骤，包括领取测试币、部署合约、交互等...',
      status: 'approved',
      credits_awarded: 35,
      review_notes: '优质内容',
      reviewed_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7天前
      created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10天前
    },
    {
      user_id: userId,
      title: 'Uniswap V3 流动性挖矿策略',
      category: 'yield-farming',
      content: '分享我的 Uniswap V3 LP 策略，包括价格区间选择、手续费收益等...',
      status: 'pending',
      credits_awarded: 0,
      review_notes: '',
      reviewed_at: null,
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1天前
    },
    {
      user_id: userId,
      title: 'zkSync 空投刷分教程',
      category: 'airdrop-tasks',
      content: '如何在 zkSync 上刷交互获取空投积分...',
      status: 'rejected',
      credits_awarded: 0,
      review_notes: '内容过于简单，缺少详细步骤',
      reviewed_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3天前
      created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4天前
    },
  ];

  try {
    const { data, error } = await supabase
      .from('user_submitted_plays')
      .insert(submissions)
      .select();

    if (error) {
      console.error('❌ 插入失败:', error.message);
      return;
    }

    console.log(`✅ 成功添加 ${data.length} 条提交记录!\n`);

    // 统计
    const stats = {
      pending: data.filter(s => s.status === 'pending').length,
      approved: data.filter(s => s.status === 'approved').length,
      rejected: data.filter(s => s.status === 'rejected').length,
      totalCredits: data.filter(s => s.status === 'approved').reduce((sum, s) => sum + s.credits_awarded, 0),
    };

    console.log('📊 统计:');
    console.log(`  - 待审核: ${stats.pending}`);
    console.log(`  - 已通过: ${stats.approved}`);
    console.log(`  - 已拒绝: ${stats.rejected}`);
    console.log(`  - 总积分: ${stats.totalCredits}\n`);

    console.log('✨ 完成！现在访问会员中心的"提交玩法"标签即可看到提交记录。');
  } catch (error) {
    console.error('❌ 错误:', error.message);
  }
}

addSampleSubmissions();
