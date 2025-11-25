const axios = require('axios');

async function checkGossipTagsDistribution() {
  try {
    const response = await axios.get('http://localhost:8055/items/news', {
      params: {
        'filter[news_type][_eq]': 'gossip',
        'fields': 'id,title,category,gossip_tags',
        'limit': -1
      }
    });

    const gossips = response.data.data;
    console.log(`总共找到 ${gossips.length} 条八卦数据\n`);

    // Count tags
    const tagCounts = {};
    gossips.forEach(gossip => {
      if (gossip.gossip_tags && Array.isArray(gossip.gossip_tags)) {
        gossip.gossip_tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });

    console.log('📊 标签统计 (gossip_tags):');
    Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([tag, count]) => {
        console.log(`   ${tag}: ${count} 次`);
      });

    // Check what categories we have
    console.log('\n\n📂 分类统计 (category):');
    const categoryCounts = {};
    gossips.forEach(gossip => {
      const cat = gossip.category || '未分类';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([cat, count]) => {
        console.log(`   ${cat}: ${count} 条`);
      });

    // Show sample to understand the relationship
    console.log('\n\n🔍 样本数据 (前5条):');
    gossips.slice(0, 5).forEach((gossip, i) => {
      console.log(`\n${i + 1}. ${gossip.title}`);
      console.log(`   category: ${gossip.category}`);
      console.log(`   gossip_tags: ${JSON.stringify(gossip.gossip_tags)}`);
    });

    // Check which categories are in our new data
    console.log('\n\n✅ 我们新添加的分类数据:');
    const targetCategories = ['全部话题', '项目传闻', 'KOL动态', '交易所', '团队内幕', '融资消息', '技术争议'];
    targetCategories.forEach(cat => {
      const count = categoryCounts[cat] || 0;
      console.log(`   ${cat}: ${count} 条`);
    });

    // Front-end expects these topic IDs
    console.log('\n\n🎯 前端期望的话题ID (来自gossip_tags):');
    const frontendTopics = ['项目传闻', 'KOL动态', '交易所八卦', '团队内幕', '融资消息', '技术争议'];
    frontendTopics.forEach(topic => {
      const count = tagCounts[topic] || 0;
      console.log(`   ${topic}: ${count} 次`);
    });

  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

checkGossipTagsDistribution();
