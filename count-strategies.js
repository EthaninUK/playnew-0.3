async function countStrategies() {
  try {
    const response = await fetch('http://localhost:8055/items/strategies?filter[status][_eq]=published&fields=id&limit=1000');
    const data = await response.json();

    if (data.data) {
      console.log(`\n📊 策略统计:`);
      console.log(`   已发布策略总数: ${data.data.length}`);

      // 同时更新代码中的缓存值
      console.log(`\n💡 建议更新以下文件中的缓存值:`);
      console.log(`   - frontend/lib/directus.ts (getTotalStrategiesCount 和 getStrategies 函数)`);
      console.log(`   - frontend/lib/directus.ts (getPlatformStats 函数)`);

      return data.data.length;
    } else {
      console.error('错误:', data);
    }
  } catch (error) {
    console.error('查询失败:', error.message);
  }
}

countStrategies();
