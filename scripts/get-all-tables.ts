/**
 * 获取所有表的完整列表
 * 使用原始 SQL 查询
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as fs from 'fs'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function getAllTables() {
  console.log('🔍 使用 SQL 查询获取所有表...\n')

  // 使用 RPC 或直接 SQL 查询
  const { data, error } = await supabase.rpc('exec_sql', {
    sql: `
      SELECT
        table_name,
        (SELECT COUNT(*)
         FROM information_schema.columns
         WHERE table_schema = 'public'
         AND table_name = t.table_name) as column_count
      FROM information_schema.tables t
      WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `
  })

  if (error) {
    console.log('RPC 方法不可用，尝试直接查询...\n')
    return await queryWithPostgREST()
  }

  console.log(`找到 ${data?.length || 0} 张表\n`)
  data?.forEach((table: any) => {
    console.log(`✅ ${table.table_name.padEnd(40)} | ${table.column_count} 列`)
  })

  return data
}

async function queryWithPostgREST() {
  console.log('📋 请在 Supabase Dashboard 执行以下 SQL:\n')
  console.log('=' .repeat(80))
  console.log(`
SELECT
  table_name,
  (SELECT COUNT(*)
   FROM information_schema.columns
   WHERE table_schema = 'public'
   AND table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;
  `.trim())
  console.log('=' .repeat(80))
  console.log('\n然后将结果复制给我，或者保存为 all-tables.json\n')
}

getAllTables()
  .then(() => {
    console.log('\n✅ 完成!\n')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ 错误:', error.message)
    process.exit(1)
  })
