const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cujpgrzjmmttysphjknu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1anBncnpqbW10dHlzcGhqa251Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTk5NDg5MywiZXhwIjoyMDc1NTcwODkzfQ.GB8A230FSm68ckj3_eUj9dUzqRtGc70k8Ebjp9dYsdY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function verify() {
  console.log('🔍 检查 Supabase 中的提交记录...\n');

  try {
    const { data, error } = await supabase
      .from('user_submitted_plays')
      .select('id, title, status, credits_awarded, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ 错误:', error.message);
      return;
    }

    console.log(`✅ 找到 ${data.length} 条提交记录:\n`);

    data.forEach((submission, i) => {
      const statusEmoji = submission.status === 'approved' ? '✅' :
                         submission.status === 'rejected' ? '❌' : '⏳';
      console.log(`${i + 1}. ${statusEmoji} ${submission.title}`);
      console.log(`   状态: ${submission.status} | 积分: ${submission.credits_awarded}`);
      console.log(`   时间: ${new Date(submission.created_at).toLocaleString('zh-CN')}\n`);
    });

    console.log('📍 现在可以在以下位置查看和审核:');
    console.log('   Directus 后台: http://localhost:8055/admin/content/user_submitted_plays');
    console.log('   会员中心: http://localhost:3000/member-center?tab=submit\n');

    console.log('💡 Directus 审核操作:');
    console.log('   1. 访问 Directus 后台');
    console.log('   2. 找到"提交玩法审核"集合（或 user_submitted_plays）');
    console.log('   3. 点击待审核记录进行编辑');
    console.log('   4. 修改 status、设置 credits_awarded、填写 review_notes');
    console.log('   5. 保存后用户端即时更新\n');

  } catch (error) {
    console.error('❌ 错误:', error.message);
  }
}

verify();
