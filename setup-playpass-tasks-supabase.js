/**
 * PlayPass 任务系统数据库配置脚本
 *
 * 通过 Supabase 创建任务相关表
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase 配置
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!SUPABASE_SERVICE_KEY || SUPABASE_SERVICE_KEY === '') {
  console.error('❌ 错误: 请设置 SUPABASE_SERVICE_ROLE_KEY 环境变量');
  console.log('\n💡 提示:');
  console.log('  1. 在 .env.local 中添加 SUPABASE_SERVICE_ROLE_KEY');
  console.log('  2. 或者通过命令行设置: export SUPABASE_SERVICE_ROLE_KEY=your-key');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

/**
 * 执行 SQL 语句
 */
async function executeSql(sql, description) {
  console.log(`\n🔄 ${description}...`);

  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

    if (error) {
      throw error;
    }

    console.log(`✅ ${description} 成功`);
    return true;
  } catch (error) {
    console.error(`❌ ${description} 失败:`, error.message);
    return false;
  }
}

/**
 * 直接通过 REST API 执行 SQL（如果 rpc 不可用）
 */
async function createTablesDirectly() {
  console.log('\n📋 开始创建 PlayPass 任务系统表...\n');

  // 由于 Supabase 客户端不直接支持执行 DDL，我们需要使用 Supabase SQL Editor
  // 或者创建一个管理端点来执行这些 SQL

  console.log('⚠️  注意: 请手动在 Supabase SQL Editor 中执行以下 SQL 文件:');
  console.log('   sql/03_create_playpass_tasks.sql');
  console.log('\n或者使用 Supabase CLI:');
  console.log('   supabase db reset --db-url "your-database-url"');

  console.log('\n📝 临时解决方案: 使用 Directus 数据库直接创建表');

  return false;
}

/**
 * 验证表是否存在
 */
async function verifyTables() {
  console.log('\n🔍 验证表创建...');

  const tables = [
    'playpass_task_templates',
    'playpass_user_tasks',
    'playpass_task_completions'
  ];

  for (const table of tables) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.log(`  ❌ ${table} 不存在或无法访问`);
      } else {
        console.log(`  ✅ ${table} 存在`);
      }
    } catch (error) {
      console.log(`  ❌ ${table} 检查失败:`, error.message);
    }
  }
}

/**
 * 查看任务模板数量
 */
async function showTaskCount() {
  console.log('\n📊 查看任务模板...');

  try {
    const { data, error } = await supabase
      .from('playpass_task_templates')
      .select('task_type');

    if (error) throw error;

    const daily = data.filter(t => t.task_type === 'daily').length;
    const weekly = data.filter(t => t.task_type === 'weekly').length;
    const achievement = data.filter(t => t.task_type === 'achievement').length;

    console.log(`  📅 每日任务: ${daily} 个`);
    console.log(`  📆 每周任务: ${weekly} 个`);
    console.log(`  🏆 成就任务: ${achievement} 个`);
  } catch (error) {
    console.log('  ⚠️  无法获取任务统计');
  }
}

/**
 * 主函数
 */
async function main() {
  console.log('============================================================');
  console.log('🚀 PlayPass 任务系统数据库配置');
  console.log('============================================================');

  // 提示用户
  console.log('\n⚠️  由于 Supabase 客户端限制，推荐以下方式之一:');
  console.log('\n选项 1: 使用 Supabase Dashboard SQL Editor');
  console.log('  1. 登录 Supabase Dashboard');
  console.log('  2. 打开 SQL Editor');
  console.log('  3. 复制粘贴 sql/03_create_playpass_tasks.sql 内容');
  console.log('  4. 点击 Run 执行');

  console.log('\n选项 2: 使用 Directus 数据库直接创建');
  console.log('  由于 Directus 使用的是同一个 Supabase 数据库');
  console.log('  我们可以创建一个脚本直接操作数据库');

  console.log('\n============================================================');

  // 尝试验证表
  await verifyTables();
  await showTaskCount();
}

// 运行
main().catch(console.error);
