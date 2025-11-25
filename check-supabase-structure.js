const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cujpgrzjmmttysphjknu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1anBncnpqbW10dHlzcGhqa251Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTk5NDg5MywiZXhwIjoyMDc1NTcwODkzfQ.GB8A230FSm68ckj3_eUj9dUzqRtGc70k8Ebjp9dYsdY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabaseStructure() {
  console.log('🔍 检查 Supabase 数据库结构...\n');

  try {
    // 1. 检查 news 表是否存在以及当前字段
    console.log('1. 检查 news 表结构:');
    console.log('====================');

    const { data: newsData, error: newsError } = await supabase
      .from('news')
      .select('*')
      .limit(1);

    if (newsError) {
      console.log('❌ news 表不存在或无权限访问');
      console.log('错误:', newsError.message);
    } else if (newsData && newsData.length > 0) {
      console.log('✅ news 表存在');
      console.log('当前字段:', Object.keys(newsData[0]).join(', '));
      console.log('\n示例数据:');
      console.log(JSON.stringify(newsData[0], null, 2));
    } else {
      console.log('⚠️  news 表存在但为空');
    }

    // 2. 检查是否有 news_type 字段
    console.log('\n2. 检查 news_type 字段:');
    console.log('====================');

    const { data: gossipData, error: gossipError } = await supabase
      .from('news')
      .select('id, title, news_type')
      .eq('news_type', 'gossip')
      .limit(1);

    if (gossipError) {
      console.log('❌ news_type 字段可能不存在');
      console.log('错误:', gossipError.message);
    } else {
      console.log('✅ news_type 字段存在');
      console.log('gossip 类型数据数量:', gossipData ? gossipData.length : 0);
    }

    // 3. 检查新字段是否已存在
    console.log('\n3. 检查新增字段是否已存在:');
    console.log('====================');

    const fieldsToCheck = [
      'credibility_score',
      'hotness_score',
      'verification_status',
      'gossip_tags',
      'likes_count',
      'comments_count'
    ];

    const { data: checkData } = await supabase
      .from('news')
      .select('*')
      .limit(1);

    if (checkData && checkData.length > 0) {
      const existingFields = Object.keys(checkData[0]);
      fieldsToCheck.forEach(field => {
        if (existingFields.includes(field)) {
          console.log(`✅ ${field} - 已存在`);
        } else {
          console.log(`❌ ${field} - 不存在`);
        }
      });
    }

    // 4. 检查 gossip_interactions 表
    console.log('\n4. 检查 gossip_interactions 表:');
    console.log('====================');

    const { data: interactionsData, error: interactionsError } = await supabase
      .from('gossip_interactions')
      .select('*')
      .limit(1);

    if (interactionsError) {
      console.log('❌ gossip_interactions 表不存在');
      console.log('(这是正常的,如果您还没执行迁移脚本)');
    } else {
      console.log('✅ gossip_interactions 表已存在');
      console.log('字段:', interactionsData && interactionsData.length > 0 ? Object.keys(interactionsData[0]).join(', ') : '空表');
    }

    // 5. 统计现有数据
    console.log('\n5. 数据统计:');
    console.log('====================');

    const { count: totalNews } = await supabase
      .from('news')
      .select('*', { count: 'exact', head: true });

    const { count: realtimeCount } = await supabase
      .from('news')
      .select('*', { count: 'exact', head: true })
      .eq('news_type', 'realtime');

    const { count: gossipCount } = await supabase
      .from('news')
      .select('*', { count: 'exact', head: true })
      .eq('news_type', 'gossip');

    console.log(`总新闻数: ${totalNews || 0}`);
    console.log(`实时资讯: ${realtimeCount || 0}`);
    console.log(`币圈八卦: ${gossipCount || 0}`);

    // 6. 建议
    console.log('\n6. 执行建议:');
    console.log('====================');

    const existingFields = checkData && checkData.length > 0 ? Object.keys(checkData[0]) : [];
    const missingFields = fieldsToCheck.filter(f => !existingFields.includes(f));

    if (missingFields.length === 0 && !interactionsError) {
      console.log('✅ 所有字段和表都已存在,无需执行迁移');
    } else if (missingFields.length > 0) {
      console.log('⚠️  需要执行数据库迁移脚本');
      console.log('缺失的字段:', missingFields.join(', '));
      console.log('\n执行步骤:');
      console.log('1. 打开 Supabase Dashboard');
      console.log('2. 进入 SQL Editor');
      console.log('3. 复制并执行 sql/add_gossip_fields.sql');
    }

    console.log('\n✅ 检查完成!\n');

  } catch (error) {
    console.error('❌ 检查过程出错:', error);
  }
}

checkDatabaseStructure();
