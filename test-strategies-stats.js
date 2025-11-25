const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testStrategiesStats() {
  console.log('🧪 测试玩法库统计数据...\n');

  try {
    // 1. 测试策略总数 API
    const strategiesRes = await fetch(
      'http://localhost:8055/items/strategies?aggregate[count]=id&filter[status][_eq]=published'
    );
    const strategiesData = await strategiesRes.json();
    const strategiesCount = strategiesData.data?.[0]?.count?.id || 0;

    console.log('📊 Directus 实际数据:');
    console.log(`   策略总数: ${strategiesCount} 个`);

    // 2. 测试分类总数 API
    const categoriesRes = await fetch(
      'http://localhost:8055/items/strategies?aggregate[count]=id&groupBy[]=category&filter[status][_eq]=published'
    );
    const categoriesData = await categoriesRes.json();
    const categoriesCount = categoriesData.data?.length || 0;

    console.log(`   分类总数: ${categoriesCount} 个\n`);

    // 3. 检查前端页面显示
    console.log('🌐 检查前端页面显示...');
    const pageRes = await fetch('http://localhost:3000/strategies');
    const pageHtml = await pageRes.text();

    // 提取页面中的统计数字
    const strategyMatch = pageHtml.match(/(\d+)<\/div>.*?个策略/);
    const categoryMatch = pageHtml.match(/(\d+)<\/div>.*?个分类/);

    if (strategyMatch && categoryMatch) {
      const pageStrategies = parseInt(strategyMatch[1]);
      const pageCategories = parseInt(categoryMatch[1]);

      console.log(`   页面显示策略: ${pageStrategies} 个`);
      console.log(`   页面显示分类: ${pageCategories} 个\n`);

      // 验证结果
      console.log('✅ 验证结果:');

      if (pageCategories === categoriesCount) {
        console.log(`   ✓ 分类数据正确: ${pageCategories} 个（实时更新）`);
      } else {
        console.log(`   ⚠️  分类数据不匹配: 页面显示 ${pageCategories}，实际为 ${categoriesCount}`);
      }

      if (Math.abs(pageStrategies - strategiesCount) <= 2) {
        console.log(`   ✓ 策略数据正确: ${pageStrategies} 个（可能有 ISR 缓存）`);
      } else {
        console.log(`   ⚠️  策略数据不匹配: 页面显示 ${pageStrategies}，实际为 ${strategiesCount}`);
      }

      console.log('\n📝 说明:');
      console.log('   - 策略数据使用 60 秒 ISR 缓存，可能有延迟');
      console.log('   - 分类数据已实时更新');
      console.log('   - 添加新玩法后，最多 60 秒后会自动更新\n');
    } else {
      console.log('   ❌ 无法从页面提取统计数据\n');
    }
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  }
}

testStrategiesStats();
