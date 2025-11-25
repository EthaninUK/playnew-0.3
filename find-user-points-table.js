const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cujpgrzjmmttysphjknu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1anBncnpqbW10dHlzcGhqa251Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTk5NDg5MywiZXhwIjoyMDc1NTcwODkzfQ.GB8A230FSm68ckj3_eUj9dUzqRtGc70k8Ebjp9dYsdY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function find() {
  console.log('🔍 查找积分相关的表...\n');

  const userId = '24da5b63-cda3-424d-b98e-dfa32cb61278';

  // 尝试不同的表名
  const tables = [
    'user_profiles',
    'profiles',
    'users',
    'user_points',
    'member_profiles',
  ];

  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);

      if (!error && data) {
        console.log(`✅ 找到表: ${table}`);
        console.log('   字段:', Object.keys(data[0] || {}));

        // 如果包含 points 字段，查询当前用户的积分
        if (data[0] && 'points' in data[0]) {
          const { data: userRecord } = await supabase
            .from(table)
            .select('*')
            .eq('id', userId)
            .maybeSingle();

          if (userRecord) {
            console.log('   当前用户积分:', userRecord.points);
          }
        }
        console.log('');
      }
    } catch (e) {
      // 跳过不存在的表
    }
  }

  console.log('💡 接下来需要创建数据库触发器或 Directus Flow\n');
}

find();
