/**
 * Supabase 数据库检查脚本
 * 用于查看所有表结构、列信息、索引等
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function inspectDatabase() {
  console.log('🔍 正在检查 Supabase 数据库...\n')

  try {
    // 获取所有公共表
    const { data: tables, error } = await supabase.rpc('get_all_tables')

    if (error) {
      // 如果没有自定义函数，使用备用方法
      console.log('使用备用方法查询表结构...\n')
      const { data, error: queryError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .neq('table_type', 'VIEW')

      if (queryError) {
        // 如果还是失败，使用原始 SQL
        return await inspectWithRawSQL()
      }
    }

    // 如果成功，继续处理...
  } catch (error) {
    console.error('❌ 连接失败:', error.message)
    console.log('\n请检查你的 .env.local 文件中的 Supabase 配置')
    process.exit(1)
  }
}

async function inspectWithRawSQL() {
  console.log('📊 获取所有表...\n')

  // 获取所有表
  const { data: tablesData, error: tablesError } = await supabase.rpc('exec_sql', {
    query: `
      SELECT
        table_name,
        (SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = 'public' AND table_name = t.table_name) as column_count
      FROM information_schema.tables t
      WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
        AND table_name NOT LIKE 'pg_%'
      ORDER BY table_name;
    `
  })

  if (tablesError) {
    console.error('无法使用 RPC 方法，尝试直接查询...')
    return await inspectDirect()
  }

  console.log(`找到 ${tablesData?.length || 0} 张表\n`)
  return tablesData
}

async function inspectDirect() {
  console.log('📋 使用 Supabase REST API 直接检查...\n')

  const report = {
    timestamp: new Date().toISOString(),
    tables: [],
    summary: {}
  }

  // 尝试常见的表名
  const commonTables = [
    'users', 'profiles', 'posts', 'comments', 'plays', 'news',
    'service_providers', 'categories', 'tags', 'interactions',
    'user_profiles', 'user_interactions', 'favorites', 'follows'
  ]

  console.log('🔍 检查常见表名...\n')

  for (const tableName of commonTables) {
    try {
      const { data, error, count } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true })
        .limit(0)

      if (!error) {
        console.log(`✅ ${tableName} - ${count || 0} 条记录`)
        report.tables.push({
          name: tableName,
          row_count: count || 0,
          exists: true
        })
      }
    } catch (err) {
      // 表不存在，跳过
    }
  }

  // 尝试列出 auth.users
  try {
    const { count } = await supabase.auth.admin.listUsers()
    console.log(`\n👥 Auth Users: ${count || 0} 个用户`)
  } catch (err) {
    console.log('\n⚠️  无法访问 auth.users (需要 service_role key)')
  }

  console.log('\n💡 提示: 为了获取完整的表结构，请执行以下步骤:')
  console.log('1. 登录 Supabase Dashboard')
  console.log('2. 进入 SQL Editor')
  console.log('3. 运行以下查询:\n')
  console.log(`SELECT
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns
     WHERE table_schema = 'public' AND table_name = t.table_name) as column_count,
    (SELECT pg_size_pretty(pg_total_relation_size(quote_ident(table_name)::regclass))
     FROM information_schema.tables
     WHERE table_schema = 'public' AND table_name = t.table_name) as table_size
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;`)

  console.log('\n然后将结果复制给我。\n')

  // 保存报告
  const reportPath = path.join(__dirname, '..', 'database-report.json')
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
  console.log(`📄 简单报告已保存到: database-report.json\n`)

  return report
}

// 如果作为脚本直接运行
if (require.main === module) {
  inspectDatabase()
    .then(() => {
      console.log('\n✅ 检查完成!\n')
      process.exit(0)
    })
    .catch((error) => {
      console.error('\n❌ 错误:', error)
      process.exit(1)
    })
}

module.exports = { inspectDatabase }
