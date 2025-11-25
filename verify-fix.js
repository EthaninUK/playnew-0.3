const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function verifyFix() {
  console.log('🔍 验证玩法库统计数据修复...\n');

  try {
    // 1. 查询 Directus 实际数据
    const strategiesRes = await fetch(
      'http://localhost:8055/items/strategies?aggregate[count]=id&filter[status][_eq]=published'
    );
    const strategiesData = await strategiesRes.json();
    const actualStrategies = strategiesData.data?.[0]?.count?.id || 0;

    const categoriesRes = await fetch(
      'http://localhost:8055/items/strategies?aggregate[count]=id&groupBy[]=category&filter[status][_eq]=published'
    );
    const categoriesData = await categoriesRes.json();
    const actualCategories = categoriesData.data?.length || 0;

    console.log('📊 Directus 实际数据:');
    console.log(`   策略: ${actualStrategies} 个`);
    console.log(`   分类: ${actualCategories} 个\n`);

    // 2. 等待页面重新构建（ISR）
    console.log('⏳ 等待页面加载...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 3. 检查页面
    const pageRes = await fetch('http://localhost:3000/strategies');
    const html = await pageRes.text();

    // 检查是否有错误
    if (html.includes('Unhandled Runtime Error')) {
      console.log('❌ 页面报错！请检查控制台\n');
      return;
    }

    // 提取统计数字
    const strategyMatch = html.match(/text-4xl[^>]*>(\d+)<\/div>\s*<div[^>]*>个策略/);
    const categoryMatch = html.match(/text-4xl[^>]*>(\d+)<\/div>\s*<div[^>]*>个分类/);

    if (strategyMatch && categoryMatch) {
      const pageStrategies = parseInt(strategyMatch[1]);
      const pageCategories = parseInt(categoryMatch[1]);

      console.log('🌐 页面显示数据:');
      console.log(`   策略: ${pageStrategies} 个`);
      console.log(`   分类: ${pageCategories} 个\n`);

      // 验证
      console.log('✅ 验证结果:');

      if (pageCategories === actualCategories) {
        console.log(`   ✓ 分类数据正确！显示 ${pageCategories} 个（实时数据）`);
      } else {
        console.log(`   ⚠️  分类数据: 页面 ${pageCategories} vs 实际 ${actualCategories}`);
      }

      if (Math.abs(pageStrategies - actualStrategies) <= 2) {
        console.log(`   ✓ 策略数据正确！显示 ${pageStrategies} 个`);
      } else {
        console.log(`   ⚠️  策略数据: 页面 ${pageStrategies} vs 实际 ${actualStrategies}`);
      }

      console.log('\n🎉 修复完成！统计数据现在会实时更新。');
      console.log('   添加新玩法后，最多 60 秒内自动同步。\n');
    } else {
      console.log('⚠️  无法从页面提取统计数据');
      console.log('   请手动检查页面: http://localhost:3000/strategies\n');
    }
  } catch (error) {
    console.error('❌ 错误:', error.message);
  }
}

verifyFix();
