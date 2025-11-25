const axios = require('axios');

async function fixGossipTagsWithCategory() {
  try {
    // Login
    console.log('🔐 正在登录 Directus...');
    const loginResponse = await axios.post('http://localhost:8055/auth/login', {
      email: 'the_uk1@outlook.com',
      password: 'Mygcdjmyxzg2026!',
    });

    const token = loginResponse.data.data.access_token;
    console.log('✅ 登录成功\n');

    // Get all gossip news with our target categories
    const targetCategories = ['全部话题', '项目传闻', 'KOL动态', '交易所', '团队内幕', '融资消息', '技术争议'];

    console.log('📝 正在获取需要修复的八卦数据...');
    const response = await axios.get('http://localhost:8055/items/news', {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        'filter[news_type][_eq]': 'gossip',
        'filter[category][_in]': targetCategories.join(','),
        'fields': 'id,title,category,gossip_tags',
        'limit': -1
      }
    });

    const gossips = response.data.data;
    console.log(`找到 ${gossips.length} 条需要修复的八卦数据\n`);

    // Category name mapping (for "交易所" -> "交易所八卦")
    const categoryMapping = {
      '项目传闻': '项目传闻',
      'KOL动态': 'KOL动态',
      '交易所': '交易所',  // Keep as is, we'll add it to tags
      '团队内幕': '团队内幕',
      '融资消息': '融资消息',
      '技术争议': '技术争议',
    };

    let updated = 0;
    let skipped = 0;

    for (const gossip of gossips) {
      // Skip "全部话题" category as it's not a specific topic
      if (gossip.category === '全部话题') {
        skipped++;
        continue;
      }

      const categoryTag = categoryMapping[gossip.category];
      if (!categoryTag) {
        console.log(`⚠️  跳过未知分类: ${gossip.category}`);
        skipped++;
        continue;
      }

      // Check if category tag already exists in gossip_tags
      const existingTags = gossip.gossip_tags || [];
      if (existingTags.includes(categoryTag)) {
        skipped++;
        continue; // Already has the category tag
      }

      // Add category tag to gossip_tags
      const newTags = [...new Set([categoryTag, ...existingTags])]; // Remove duplicates
      const newTagsString = `{${newTags.join(',')}}`;

      try {
        await axios.patch(
          `http://localhost:8055/items/news/${gossip.id}`,
          { gossip_tags: newTagsString },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        updated++;
        if (updated % 10 === 0) {
          process.stdout.write(`\r   已更新: ${updated}/${gossips.length - skipped}`);
        }
      } catch (error) {
        console.error(`\n❌ 更新失败 (${gossip.id}):`, error.response?.data || error.message);
      }
    }

    console.log(`\n\n✅ 修复完成！`);
    console.log(`   - 已更新: ${updated} 条`);
    console.log(`   - 已跳过: ${skipped} 条`);

    // Verify the result
    console.log('\n📊 验证修复结果...');
    const verifyResponse = await axios.get('http://localhost:8055/items/news', {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        'filter[news_type][_eq]': 'gossip',
        'fields': 'id,gossip_tags',
        'limit': -1
      }
    });

    const allGossips = verifyResponse.data.data;
    const tagCounts = {};
    allGossips.forEach(g => {
      if (g.gossip_tags && Array.isArray(g.gossip_tags)) {
        g.gossip_tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });

    console.log('\n前端期望的话题标签统计:');
    const frontendTopics = ['项目传闻', 'KOL动态', '交易所', '团队内幕', '融资消息', '技术争议'];
    frontendTopics.forEach(topic => {
      const count = tagCounts[topic] || 0;
      console.log(`   ${topic}: ${count} 次`);
    });

  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

fixGossipTagsWithCategory();
