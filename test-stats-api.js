const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testStatsAPI() {
  console.log('🧪 测试统计数据 API...\n');

  try {
    const response = await fetch('http://localhost:3000/api/stats');
    const result = await response.json();

    if (result.success) {
      console.log('✅ API 调用成功\n');
      console.log('📊 当前统计数据:');
      console.log(`   策略: ${result.data.strategies} 个`);
      console.log(`   分类: ${result.data.categories} 个`);
      console.log(`   服务商: ${result.data.providers} 个`);
      console.log(`   快讯: ${result.data.news} 条`);
      console.log(`   更新时间: ${new Date(result.data.updated_at).toLocaleString('zh-CN')}`);
      console.log('\n✅ 数据统计功能正常工作！');
      console.log('\n📍 会员中心现在会显示实时更新的统计数据。');
    } else {
      console.error('❌ API 返回错误:', result.error);
    }
  } catch (error) {
    console.error('❌ 请求失败:', error.message);
  }
}

testStatsAPI();
