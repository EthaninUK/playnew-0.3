const axios = require('axios');

async function verifyGossipData() {
  try {
    // Get public gossip data
    const response = await axios.get('http://localhost:8055/items/news', {
      params: {
        'filter[news_type][_eq]': 'gossip',
        'fields': 'id,title,category,gossip_tags,verification_status,hotness_score,credibility_score',
        'limit': 10,
        'sort': '-created_at'
      }
    });

    console.log(`Found ${response.data.data.length} gossip items\n`);

    response.data.data.forEach((item, index) => {
      console.log(`${index + 1}. ${item.title}`);
      console.log(`   分类: ${item.category}`);
      console.log(`   标签: ${JSON.stringify(item.gossip_tags)}`);
      console.log(`   验证状态: ${item.verification_status}`);
      console.log(`   热度分数: ${item.hotness_score}`);
      console.log(`   可信度分数: ${item.credibility_score}`);
      console.log('');
    });

    // Count by category
    const categories = ['全部话题', '项目传闻', 'KOL动态', '交易所', '团队内幕', '融资消息', '技术争议'];

    console.log('\n📊 各分类统计:');
    for (const category of categories) {
      const countResponse = await axios.get('http://localhost:8055/items/news', {
        params: {
          'filter[news_type][_eq]': 'gossip',
          'filter[category][_eq]': category,
          'aggregate[count]': 'id'
        }
      });
      const count = countResponse.data.data[0]?.count?.id || 0;
      console.log(`   ${category}: ${count} 条`);
    }

  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

verifyGossipData();
