const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cujpgrzjmmttysphjknu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1anBncnpqbW10dHlzcGhqa251Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTk5NDg5MywiZXhwIjoyMDc1NTcwODkzfQ.GB8A230FSm68ckj3_eUj9dUzqRtGc70k8Ebjp9dYsdY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  console.log('🔍 正在检查 Supabase 数据库结构...\n');

  // 1. 检查所有表
  const { data: tables, error: tablesError } = await supabase.rpc('exec_sql', {
    sql: `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `
  });

  if (tablesError) {
    console.log('⚠️ 无法通过 RPC 查询，尝试直接查询...\n');

    // 尝试查询已知的表
    const knownTables = [
      'strategies', 'news', 'service_providers', 'categories',
      'tags', 'chains', 'protocols', 'static_pages', 'gossip',
      'user_profiles', 'daily_featured_plays', 'user_play_exchanges',
      'user_submitted_plays', 'credit_transactions', 'referrals'
    ];

    console.log('📋 检查已知表是否存在:\n');

    for (const table of knownTables) {
      const { data, error } = await supabase.from(table).select('*').limit(0);
      if (error) {
        console.log(`❌ ${table}: 不存在 (${error.message})`);
      } else {
        console.log(`✅ ${table}: 存在`);
      }
    }
  } else {
    console.log('📋 数据库中的表:\n');
    tables?.forEach(t => console.log(`  - ${t.table_name}`));
  }

  console.log('\n---\n');

  // 2. 检查 auth.users 表结构（通过查询用户数）
  const { count: userCount, error: userError } = await supabase
    .from('auth.users')
    .select('*', { count: 'exact', head: true });

  if (!userError) {
    console.log(`👤 auth.users 表: ✅ 存在 (${userCount} 用户)`);
  } else {
    console.log('👤 auth.users 表: 无法直接访问（正常，需要通过 auth API）');
  }

  // 3. 检查玩法交换相关表
  console.log('\n🎮 检查玩法交换相关表:\n');

  const playExchangeTables = [
    'user_profiles',
    'daily_featured_plays',
    'user_play_exchanges',
    'user_submitted_plays',
    'credit_transactions',
    'referrals'
  ];

  for (const table of playExchangeTables) {
    const { data, error } = await supabase.from(table).select('*').limit(1);

    if (error) {
      console.log(`❌ ${table}: 不存在`);
      console.log(`   错误: ${error.message}`);
    } else {
      console.log(`✅ ${table}: 已存在`);
      if (data && data.length > 0) {
        console.log(`   数据示例:`, Object.keys(data[0]).join(', '));
      }
    }
  }

  // 4. 检查 strategies 表结构
  console.log('\n📊 检查 strategies 表结构:\n');
  const { data: strategies, error: stratError } = await supabase
    .from('strategies')
    .select('*')
    .limit(1);

  if (!stratError && strategies && strategies.length > 0) {
    console.log('✅ strategies 表字段:');
    Object.keys(strategies[0]).forEach(key => {
      console.log(`   - ${key}: ${typeof strategies[0][key]}`);
    });
  } else {
    console.log('❌ 无法读取 strategies 表');
  }

  // 5. 检查现有的触发器和函数
  console.log('\n⚙️ 关键信息:\n');
  console.log('根据截图，你的数据库已有以下函数/触发器:');
  console.log('  - update_updated_at_column() 函数 (被多个表使用)');
  console.log('  - 多个表的 updated_at 触发器');
  console.log('\n⚠️ 新的 SQL 脚本需要注意:');
  console.log('  1. 不能删除现有的 update_updated_at_column() 函数');
  console.log('  2. 需要检查表是否已存在');
  console.log('  3. 需要使用 CASCADE 删除依赖的触发器');
}

checkSchema().catch(console.error);
