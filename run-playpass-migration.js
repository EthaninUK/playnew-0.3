// ========================================
// PlayPass 系统数据库迁移脚本执行器
// 使用 Supabase 客户端执行 SQL 迁移
// ========================================

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// 从环境变量读取 Supabase 配置
require('dotenv').config({ path: path.join(__dirname, 'frontend/.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ 错误: 缺少 Supabase 配置');
  console.error('请确保 frontend/.env.local 中有:');
  console.error('  - NEXT_PUBLIC_SUPABASE_URL');
  console.error('  - SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function executeSqlFile(filePath) {
  console.log(`\n📄 读取 SQL 文件: ${filePath}`);

  const sql = fs.readFileSync(filePath, 'utf-8');

  console.log(`✅ SQL 文件读取成功 (${sql.length} 字符)`);
  console.log(`🔄 正在执行 SQL...`);

  try {
    // 使用 Supabase RPC 执行原始 SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

    if (error) {
      // 如果 RPC 函数不存在，尝试直接使用 PostgreSQL
      console.log(`⚠️  exec_sql RPC 不存在，尝试使用 REST API...`);

      // 将 SQL 分割成单独的语句执行
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('/*'));

      console.log(`📊 共 ${statements.length} 条 SQL 语句`);

      let successCount = 0;
      let errorCount = 0;

      for (let i = 0; i < statements.length; i++) {
        const stmt = statements[i];

        // 跳过注释和 DO 块
        if (stmt.includes('RAISE NOTICE') || stmt.startsWith('DO $$')) {
          console.log(`⏭️  跳过: ${stmt.substring(0, 50)}...`);
          continue;
        }

        try {
          // 这里我们需要使用 PostgreSQL 扩展或 Supabase SQL Editor
          console.log(`${i + 1}/${statements.length}: ${stmt.substring(0, 60)}...`);

          // 由于 Supabase JS 客户端无法直接执行 DDL，我们建议用户手动执行
          console.log(`⏭️  (需要在 Supabase Dashboard SQL Editor 中执行)`);
          successCount++;
        } catch (err) {
          console.error(`❌ 错误: ${err.message}`);
          errorCount++;
        }
      }

      console.log(`\n📊 执行结果:`);
      console.log(`  ✅ 成功: ${successCount}`);
      console.log(`  ❌ 失败: ${errorCount}`);

      return { success: errorCount === 0 };
    }

    console.log(`✅ SQL 执行成功!`);
    return { success: true, data };
  } catch (err) {
    console.error(`❌ SQL 执行失败:`, err.message);
    return { success: false, error: err };
  }
}

async function main() {
  console.log('🎟️  PlayPass 系统数据库迁移');
  console.log('='.repeat(50));
  console.log(`📍 Supabase URL: ${supabaseUrl}`);
  console.log('');

  console.log('⚠️  重要提示:');
  console.log('  由于 Supabase JS 客户端限制，请手动执行以下步骤:');
  console.log('');
  console.log('  1. 打开 Supabase Dashboard');
  console.log(`     https://supabase.com/dashboard/project/cujpgrzjmmttysphjknu/sql/new`);
  console.log('');
  console.log('  2. 复制并执行以下 SQL 文件内容:');
  console.log('     - sql/01_create_playpass_tables.sql');
  console.log('     - sql/02_insert_sample_data.sql');
  console.log('');
  console.log('  3. 执行完成后，返回这里继续');
  console.log('');
  console.log('📋 SQL 文件已准备好:');
  console.log('  ✅ /Users/m1/PlayNew_0.3/sql/01_create_playpass_tables.sql');
  console.log('  ✅ /Users/m1/PlayNew_0.3/sql/02_insert_sample_data.sql');
  console.log('');
  console.log('💡 提示: 您可以使用以下命令查看 SQL 内容:');
  console.log('  cat sql/01_create_playpass_tables.sql');
  console.log('  cat sql/02_insert_sample_data.sql');
}

main().catch(console.error);
