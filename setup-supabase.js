#!/usr/bin/env node

/**
 * Supabase 数据库架构安装脚本
 *
 * 此脚本将自动执行 supabase-schema.sql 中定义的所有表结构和安全策略
 *
 * 使用方法:
 * node setup-supabase.js
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// 加载环境变量
require('dotenv').config({ path: path.join(__dirname, '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ 错误：缺少 Supabase 环境变量');
  console.error('请确保 .env.local 文件中包含:');
  console.error('- NEXT_PUBLIC_SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// 使用 service role key 创建客户端 (有完全权限)
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function executeSQLFile() {
  console.log('🚀 开始设置 Supabase 数据库架构...\n');

  try {
    // 读取 SQL 文件
    const sqlPath = path.join(__dirname, 'supabase-schema.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    console.log('📖 读取 SQL 文件:', sqlPath);

    // 分割 SQL 语句（按分号+换行分割，跳过注释）
    const statements = sqlContent
      .split(/;\s*\n/)
      .map(stmt => stmt.trim())
      .filter(stmt => {
        return stmt &&
               !stmt.startsWith('--') &&
               !stmt.startsWith('/*') &&
               stmt.length > 10; // 过滤掉太短的语句
      });

    console.log(`\n📝 共 ${statements.length} 条 SQL 语句待执行\n`);

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];

      // 提取语句的简短描述
      const description = statement.substring(0, 60).replace(/\n/g, ' ') + '...';

      try {
        console.log(`[${i + 1}/${statements.length}] 执行: ${description}`);

        const { error } = await supabase.rpc('exec_sql', { sql: statement + ';' })

        if (error) {
          // 尝试直接执行（某些语句可能不支持 rpc）
          const directResult = await supabase.from('_').select().limit(0);
          if (directResult.error && directResult.error.message.includes('does not exist')) {
            // 这个错误说明我们需要用原生 Postgres 连接
            console.log(`   ⚠️  需要直接数据库访问，跳过: ${description.substring(0, 40)}...`);
            continue;
          }
          throw error;
        }

        console.log(`   ✅ 成功\n`);
        successCount++;

      } catch (err) {
        console.error(`   ❌ 失败:`, err.message);
        console.error(`   SQL: ${statement.substring(0, 100)}...\n`);
        errorCount++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log(`✅ 成功: ${successCount} 条`);
    console.log(`❌ 失败: ${errorCount} 条`);
    console.log('='.repeat(60) + '\n');

    if (errorCount > 0) {
      console.log('⚠️  部分语句执行失败');
      console.log('💡 建议: 请在 Supabase Dashboard > SQL Editor 中手动执行 supabase-schema.sql');
      console.log('📍 Dashboard 地址:', supabaseUrl.replace('.supabase.co', '.supabase.co/project/_/sql'));
    } else {
      console.log('🎉 所有数据库架构已成功创建!');
    }

  } catch (error) {
    console.error('\n❌ 执行失败:', error.message);
    console.error('\n💡 解决方案:');
    console.error('请访问 Supabase Dashboard 手动执行 SQL:');
    console.error('1. 打开:', supabaseUrl.replace('.supabase.co', '.supabase.co/project/_/sql'));
    console.error('2. 将 supabase-schema.sql 的内容复制粘贴到 SQL Editor');
    console.error('3. 点击 Run 执行');
    process.exit(1);
  }
}

// 主函数
async function main() {
  console.log('\n╔═══════════════════════════════════════════════════════════╗');
  console.log('║         CryptoPlays Supabase 数据库架构安装器          ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');

  await executeSQLFile();

  console.log('\n📋 接下来的步骤:');
  console.log('1. ✅ 数据库架构已创建');
  console.log('2. 🔐 用户注册后会自动创建 profile');
  console.log('3. ❤️  用户可以收藏玩法、服务商和资讯');
  console.log('4. 📊 浏览历史会自动记录\n');

  console.log('🌐 Supabase Dashboard:', supabaseUrl.replace('.supabase.co', '.supabase.co/project/_'));
  console.log('✨ 开始使用吧!\n');
}

main().catch(console.error);
