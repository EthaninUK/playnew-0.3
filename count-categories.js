const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const DIRECTUS_URL = 'http://localhost:8055';

async function countCategories() {
  console.log('🔍 统计分类数量...\n');

  try {
    // 查询所有已发布的策略，按分类分组
    const response = await fetch(
      `${DIRECTUS_URL}/items/strategies?aggregate[count]=id&groupBy[]=category&filter[status][_eq]=published`
    );

    const data = await response.json();

    if (data.data) {
      const uniqueCategories = data.data.length;
      console.log(`✅ 实际使用的分类总数: ${uniqueCategories} 个\n`);

      console.log('📋 分类列表:');
      data.data.forEach((item, i) => {
        console.log(`   ${i + 1}. ${item.category} (${item.count?.id || 0} 个策略)`);
      });

      console.log(`\n📊 总结:`);
      console.log(`   实际分类数: ${uniqueCategories} 个`);
      console.log(`   页面显示应为: ${uniqueCategories} 个分类\n`);
    }
  } catch (error) {
    console.error('❌ 错误:', error.message);
  }
}

countCategories();
