const axios = require('axios');

async function testGossipPagination() {
  try {
    console.log('📊 测试八卦页面分页功能\n');

    // Test page load
    const response = await axios.get('http://localhost:3000/gossip');
    const html = response.data;

    // Check if pagination elements exist
    const hasPrevButton = html.includes('上一页');
    const hasNextButton = html.includes('下一页');
    const hasPageNumbers = /\d+/.test(html);

    console.log('✅ 页面加载成功');
    console.log(`   - 上一页按钮: ${hasPrevButton ? '✓' : '✗'}`);
    console.log(`   - 下一页按钮: ${hasNextButton ? '✓' : '✗'}`);
    console.log(`   - 页码显示: ${hasPageNumbers ? '✓' : '✗'}`);

    // Extract gossip count from filter bar
    const countMatch = html.match(/共\s*(\d+)\s*条八卦/);
    if (countMatch) {
      const totalCount = parseInt(countMatch[1]);
      const expectedPages = Math.ceil(totalCount / 20);
      console.log(`\n📈 统计信息:`);
      console.log(`   - 总八卦数: ${totalCount} 条`);
      console.log(`   - 每页显示: 20 条`);
      console.log(`   - 预计页数: ${expectedPages} 页`);
    }

    // Check database
    const dbResponse = await axios.get('http://localhost:8055/items/news', {
      params: {
        'filter[news_type][_eq]': 'gossip',
        'filter[status][_eq]': 'published',
        'fields': 'id',
        'limit': -1
      }
    });

    const totalGossip = dbResponse.data.data.length;
    console.log(`\n🗄️  数据库统计:`);
    console.log(`   - 总八卦数: ${totalGossip} 条`);
    console.log(`   - 预计页数: ${Math.ceil(totalGossip / 20)} 页`);

    console.log('\n✅ 分页功能测试完成！');

  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  }
}

testGossipPagination();
