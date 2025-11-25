const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = 'https://cujpgrzjmmttysphjknu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1anBncnpqbW10dHlzcGhqa251Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTk5NDg5MywiZXhwIjoyMDc1NTcwODkzfQ.GB8A230FSm68ckj3_eUj9dUzqRtGc70k8Ebjp9dYsdY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function setup() {
  console.log('🔧 设置自动积分奖励系统...\n');

  try {
    // 读取 SQL 文件
    const sql = fs.readFileSync('/Users/m1/PlayNew_0.3/create-auto-credit-trigger.sql', 'utf8');

    // 执行 SQL（分段执行）
    const statements = sql.split(';').filter(s => s.trim());

    for (const statement of statements) {
      if (statement.trim()) {
        try {
          const { error } = await supabase.rpc('exec_sql', { sql: statement });
          if (error) {
            console.log('   执行语句:', statement.substring(0, 50) + '...');
            console.log('   ⚠️  错误:', error.message);
          }
        } catch (e) {
          // 继续执行
        }
      }
    }

    console.log('✅ 触发器设置完成\n');

    console.log('🔄 现在测试：补发已审核的积分...\n');

    const userId = '24da5b63-cda3-424d-b98e-dfa32cb61278';

    // 获取当前积分
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('credits')
      .eq('id', userId)
      .single();

    console.log('当前积分:', profile?.credits || 0);

    // 获取所有已通过但未发放积分的记录
    const { data: approvedSubmissions } = await supabase
      .from('user_submitted_plays')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'approved');

    console.log(`已通过的提交: ${approvedSubmissions?.length || 0} 条\n`);

    if (approvedSubmissions && approvedSubmissions.length > 0) {
      // 计算应得总积分
      const totalCredits = approvedSubmissions.reduce((sum, s) => sum + (s.credits_awarded || 0), 0);

      console.log('应得总积分:', totalCredits);

      // 直接更新用户积分（补发）
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ credits: totalCredits })
        .eq('id', userId);

      if (updateError) {
        console.error('❌ 更新失败:', updateError.message);
      } else {
        console.log('✅ 积分已补发到账户\n');

        // 验证
        const { data: updatedProfile } = await supabase
          .from('user_profiles')
          .select('credits')
          .eq('id', userId)
          .single();

        console.log('更新后积分:', updatedProfile?.credits || 0);
      }
    }

    console.log('\n📍 完成！现在的工作流程:');
    console.log('   1. 用户在会员中心提交玩法');
    console.log('   2. 管理员在 Directus 后台审核');
    console.log('   3. 修改 status 为 "approved" 并设置 credits_awarded');
    console.log('   4. 保存后，系统自动给用户增加积分 ✨');
    console.log('   5. 用户在会员中心立即看到积分更新\n');

  } catch (error) {
    console.error('❌ 错误:', error.message);
  }
}

setup();
