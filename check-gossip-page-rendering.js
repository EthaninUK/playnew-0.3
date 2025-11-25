const axios = require('axios');

async function checkGossipPageRendering() {
  try {
    const response = await axios.get('http://localhost:3000/gossip');
    const html = response.data;

    // Extract total count
    const totalMatch = html.match(/共\s*(\d+)\s*条八卦/);
    const totalCount = totalMatch ? totalMatch[1] : 'Not found';

    console.log(`📊 页面显示总数: ${totalCount} 条八卦\n`);

    // Extract topic counts from the sidebar
    const topics = [
      { name: '全部话题', emoji: '全部' },
      { name: '项目传闻', emoji: '💼' },
      { name: 'KOL动态', emoji: '🎭' },
      { name: '交易所', emoji: '🏦' },
      { name: '团队内幕', emoji: '🕵️' },
      { name: '融资消息', emoji: '💰' },
      { name: '技术争议', emoji: '⚔️' }
    ];

    console.log('📝 侧边栏分类统计:');

    // For 全部话题
    const allTopicsMatch = html.match(/全部话题.*?<span[^>]*>(\d+)<\/span>/s);
    if (allTopicsMatch) {
      console.log(`   全部话题: ${allTopicsMatch[1]} 条`);
    }

    // For other topics
    topics.slice(1).forEach(topic => {
      const regex = new RegExp(`${topic.emoji}.*?${topic.name}.*?<span[^>]*>(?:(\\d+))?<\/span>`, 's');
      const match = html.match(regex);
      if (match) {
        console.log(`   ${topic.name}: ${match[1] || '0'} 条`);
      } else {
        console.log(`   ${topic.name}: 未找到计数`);
      }
    });

    // Get actual database counts for comparison
    console.log('\n\n🔍 数据库实际统计 (用于对比):');
    const dbResponse = await axios.get('http://localhost:8055/items/news', {
      params: {
        'filter[news_type][_eq]': 'gossip',
        'fields': 'id,gossip_tags',
        'limit': -1
      }
    });

    const allGossips = dbResponse.data.data;
    const tagCounts = {};
    allGossips.forEach(g => {
      if (g.gossip_tags && Array.isArray(g.gossip_tags)) {
        g.gossip_tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });

    console.log(`   全部话题: ${allGossips.length} 条 (实际是前50条)`);
    const frontendTopics = ['项目传闻', 'KOL动态', '交易所', '团队内幕', '融资消息', '技术争议'];
    frontendTopics.forEach(topic => {
      const count = tagCounts[topic] || 0;
      console.log(`   ${topic}: ${count} 条`);
    });

  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkGossipPageRendering();
