/**
 * 简单的表检查脚本
 * 运行: npx tsx scripts/check-tables.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as fs from 'fs'

// 加载环境变量
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 错误: 请先配置 .env.local 文件')
  console.log('\n复制 .env.local.example 到 .env.local 并填入你的 Supabase 信息\n')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkTables() {
  console.log('🔍 连接到 Supabase...')
  console.log(`📍 项目: ${supabaseUrl}\n`)

  // 测试连接
  try {
    const { data, error } = await supabase
      .from('_prisma_migrations')
      .select('*')
      .limit(1)

    if (error && error.code !== 'PGRST116') {
      console.log('⚠️  提示: 使用自动发现模式\n')
    }
  } catch (err) {
    console.log('连接正常\n')
  }

  console.log('📋 正在扫描所有表...\n')
  console.log('=' .repeat(80))

  const tables: Array<{
    name: string
    rowCount: number
    exists: boolean
    sampleData?: any
  }> = []

  // 尝试一些常见的表名
  const tablesToCheck = [
    // 用户相关
    'users', 'user_profiles', 'profiles', 'accounts',

    // 核心内容
    'plays', 'news', 'articles', 'posts', 'content',

    // 分类和标签
    'categories', 'tags', 'labels',

    // 服务商
    'service_providers', 'providers', 'vendors', 'services',

    // 交互
    'user_interactions', 'interactions', 'likes', 'favorites',
    'comments', 'reviews', 'ratings',

    // 通知
    'notifications', 'alerts',

    // 其他
    'settings', 'configs', 'analytics'
  ]

  for (const tableName of tablesToCheck) {
    try {
      const { data, error, count } = await supabase
        .from(tableName)
        .select('*', { count: 'exact' })
        .limit(1)

      if (!error) {
        console.log(`✅ ${tableName.padEnd(30)} | ${count || 0} 条记录`)

        tables.push({
          name: tableName,
          rowCount: count || 0,
          exists: true,
          sampleData: data?.[0]
        })
      }
    } catch (err) {
      // 表不存在，静默跳过
    }
  }

  console.log('=' .repeat(80))
  console.log(`\n📊 找到 ${tables.length} 张表\n`)

  // 显示每个表的列信息
  if (tables.length > 0) {
    console.log('📝 表结构详情:\n')

    for (const table of tables) {
      if (table.sampleData) {
        console.log(`\n表: ${table.name}`)
        console.log('列:', Object.keys(table.sampleData).join(', '))
      }
    }
  }

  // 保存报告
  const report = {
    timestamp: new Date().toISOString(),
    totalTables: tables.length,
    tables: tables.map(t => ({
      name: t.name,
      rowCount: t.rowCount,
      columns: t.sampleData ? Object.keys(t.sampleData) : []
    }))
  }

  fs.writeFileSync('database-report.json', JSON.stringify(report, null, 2))
  console.log('\n\n💾 完整报告已保存到: database-report.json')

  // 提供下一步建议
  console.log('\n' + '='.repeat(80))
  console.log('📌 下一步操作:\n')
  console.log('1. 请在 Supabase Dashboard 的 SQL Editor 中运行以下查询:\n')
  console.log('```sql')
  console.log(`SELECT
  table_name,
  (SELECT COUNT(*)
   FROM information_schema.columns
   WHERE table_schema = 'public'
   AND table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;`)
  console.log('```\n')
  console.log('2. 将所有表名复制给我')
  console.log('3. 我会帮你分析哪些表需要保留，哪些可以删除\n')
  console.log('='.repeat(80))
}

checkTables()
  .then(() => {
    console.log('\n✅ 检查完成!\n')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ 错误:', error.message)
    process.exit(1)
  })
