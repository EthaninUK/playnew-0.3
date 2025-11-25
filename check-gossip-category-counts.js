const axios = require('axios');

async function checkGossipCategoryCounts() {
  try {
    // Get all gossip items to see the distribution
    const response = await axios.get('http://localhost:8055/items/news', {
      params: {
        'filter[news_type][_eq]': 'gossip',
        'fields': 'id,title,category',
        'limit': -1
      }
    });

    const gossips = response.data.data;
    console.log(`总共找到 ${gossips.length} 条八卦数据\n`);

    // Count by category
    const categoryCounts = {};
    gossips.forEach(gossip => {
      const category = gossip.category || '未分类';
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });

    console.log('📊 分类统计:');
    Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} 条`);
    });

    // Show some sample titles per category
    console.log('\n📝 每个分类的示例标题:');
    const categories = ['全部话题', '项目传闻', 'KOL动态', '交易所', '团队内幕', '融资消息', '技术争议'];
    for (const category of categories) {
      const items = gossips.filter(g => g.category === category).slice(0, 3);
      if (items.length > 0) {
        console.log(`\n${category} (${categoryCounts[category] || 0}条):`);
        items.forEach((item, i) => {
          console.log(`   ${i + 1}. ${item.title}`);
        });
      }
    }

  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

checkGossipCategoryCounts();
