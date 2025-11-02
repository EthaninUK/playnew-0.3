const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './frontend/.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkTables() {
  console.log('🔍 检查 Supabase 数据库表...\n');

  const tables = [
    'user_profiles',
    'user_favorites',
    'user_history'
  ];

  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);

      if (error) {
        if (error.code === '42P01') {
          console.log(`❌ 表 "${table}" 不存在`);
        } else {
          console.log(`⚠️  表 "${table}" 查询出错:`, error.message);
        }
      } else {
        console.log(`✅ 表 "${table}" 存在 (记录数: ${data.length})`);
      }
    } catch (err) {
      console.log(`❌ 表 "${table}" 检查失败:`, err.message);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📋 下一步操作:');
  console.log('='.repeat(60));
  console.log('');
  console.log('如果看到 ❌ 标记,说明表不存在,请按以下步骤操作:');
  console.log('');
  console.log('1. 打开 Supabase Dashboard:');
  console.log('   https://supabase.com/dashboard/project/cujpgrzjmmttysphjknu/sql');
  console.log('');
  console.log('2. 点击 "New query"');
  console.log('');
  console.log('3. 打开文件: /Users/m1/PlayNew_0.3/supabase-schema.sql');
  console.log('');
  console.log('4. 复制全部内容,粘贴到 SQL Editor');
  console.log('');
  console.log('5. 点击 "Run" (或按 Cmd/Ctrl + Enter)');
  console.log('');
  console.log('6. 等待执行完成,然后重新运行此脚本验证');
  console.log('');
}

checkTables().catch(console.error);
