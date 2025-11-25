const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cujpgrzjmmttysphjknu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1anBncnpqbW10dHlzcGhqa251Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTk5NDg5MywiZXhwIjoyMDc1NTcwODkzfQ.GB8A230FSm68ckj3_eUj9dUzqRtGc70k8Ebjp9dYsdY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debug() {
  const userId = '24da5b63-cda3-424d-b98e-dfa32cb61278';

  console.log('🔍 调试积分显示问题...\n');

  // 1. 检查 user_profiles 表中的积分
  console.log('1️⃣ 检查 user_profiles.credits:\n');

  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (profileError) {
    console.error('❌ 查询失败:', profileError.message);
  } else {
    console.log('✅ 找到用户档案:');
    console.log('   ID:', profile.id);
    console.log('   用户名:', profile.username);
    console.log('   当前 credits:', profile.credits);
    console.log('');
  }

  // 2. 检查前端使用的字段名
  console.log('2️⃣ 检查前端代码使用的积分字段...\n');
  console.log('   可能的字段名: credits, points, pp, balance');
  console.log('   当前 user_profiles 表的所有字段:');
  console.log('   ', Object.keys(profile || {}).join(', '));
  console.log('');

  // 3. 检查已发放的提交记录
  console.log('3️⃣ 检查提交记录:\n');

  const { data: submissions } = await supabase
    .from('user_submitted_plays')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'approved');

  console.log(`   已通过的提交: ${submissions?.length || 0} 条`);

  let totalAwarded = 0;
  let totalPending = 0;

  if (submissions) {
    submissions.forEach((s, i) => {
      const isAwarded = s.credits_awarded_at ? '✓' : '✗';
      console.log(`   ${i + 1}. ${s.title}`);
      console.log(`      奖励: ${s.credits_awarded} PP`);
      console.log(`      已发放: ${isAwarded} ${s.credits_awarded_at ? new Date(s.credits_awarded_at).toLocaleString('zh-CN') : ''}`);

      if (s.credits_awarded_at) {
        totalAwarded += s.credits_awarded || 0;
      } else {
        totalPending += s.credits_awarded || 0;
      }
    });
  }

  console.log('');
  console.log(`   已发放积分总计: ${totalAwarded} PP`);
  console.log(`   待发放积分: ${totalPending} PP`);
  console.log('');

  // 4. 如果有待发放的，立即发放
  if (totalPending > 0) {
    console.log('⚠️  发现待发放积分！立即处理...\n');

    const { processApprovedSubmissions } = require('./auto-award-credits-daemon.js');
    await processApprovedSubmissions();
  }

  // 5. 再次检查积分
  console.log('4️⃣ 最终检查:\n');

  const { data: finalProfile } = await supabase
    .from('user_profiles')
    .select('credits')
    .eq('id', userId)
    .single();

  console.log('   最终积分:', finalProfile?.credits, 'PP');
  console.log('');

  // 6. 检查前端如何获取积分
  console.log('5️⃣ 前端集成检查:\n');
  console.log('   前端应该从以下位置获取积分:');
  console.log('   - user_profiles.credits (数据库字段)');
  console.log('   - 如果前端显示的是 210 PP，可能是:');
  console.log('     a) 缓存问题（需要清除浏览器缓存）');
  console.log('     b) 前端代码读取的字段不对');
  console.log('     c) 使用了不同的用户 ID');
  console.log('');

  console.log('📍 建议操作:');
  console.log('   1. 刷新浏览器页面（Ctrl+Shift+R）');
  console.log('   2. 清除浏览器缓存和 Cookie');
  console.log('   3. 重新登录');
  console.log('   4. 检查前端代码是否使用了正确的字段名\n');
}

debug();
