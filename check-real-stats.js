const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const DIRECTUS_URL = 'http://localhost:8055';

async function checkStats() {
  console.log('📊 检查实际数据统计...\n');

  try {
    // 1. 查询策略总数
    const strategiesRes = await fetch(`${DIRECTUS_URL}/items/strategies?aggregate[count]=id&filter[status][_eq]=published`);
    const strategiesData = await strategiesRes.json();
    const strategiesCount = strategiesData.data?.[0]?.count?.id || 0;

    console.log(`✅ 策略总数: ${strategiesCount} 个`);

    // 2. 查询分类总数
    const categoriesRes = await fetch(`${DIRECTUS_URL}/items/categories?aggregate[count]=id`);
    const categoriesData = await categoriesRes.json();
    const categoriesCount = categoriesData.data?.[0]?.count?.id || 0;

    console.log(`✅ 分类总数: ${categoriesCount} 个\n`);

    // 3. 按分类统计策略数量
    const catStatsRes = await fetch(`${DIRECTUS_URL}/items/strategies?aggregate[count]=id&groupBy[]=category&filter[status][_eq]=published`);
    const catStatsData = await catStatsRes.json();

    console.log('📋 各分类策略数量:');
    if (catStatsData.data) {
      catStatsData.data.forEach((item, i) => {
        console.log(`   ${i + 1}. ${item.category}: ${item.count?.id || 0} 个策略`);
      });
    }

    console.log('');

    // 4. 查询最近添加的策略
    const recentRes = await fetch(`${DIRECTUS_URL}/items/strategies?filter[status][_eq]=published&sort=-date_created&limit=5&fields=title,category,date_created`);
    const recentData = await recentRes.json();

    console.log('🆕 最近添加的 5 个策略:');
    if (recentData.data) {
      recentData.data.forEach((s, i) => {
        console.log(`   ${i + 1}. ${s.title} (${s.category})`);
        console.log(`      添加时间: ${new Date(s.date_created).toLocaleString('zh-CN')}`);
      });
    }

    console.log('\n📍 如果会员中心显示的数据与此不符，需要刷新缓存或检查前端代码。\n');

  } catch (error) {
    console.error('❌ 错误:', error.message);
  }
}

checkStats();
