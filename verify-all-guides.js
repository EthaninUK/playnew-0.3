const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

async function verifyAllGuides() {
  try {
    console.log('╔═══════════════════════════════════════════════════════════╗');
    console.log('║          验证所有已创建的指南                              ║');
    console.log('╚═══════════════════════════════════════════════════════════╝\n');

    // Get all published guides
    const response = await axios.get(`${DIRECTUS_URL}/items/strategies`, {
      params: {
        'filter[status][_eq]': 'published',
        'filter[slug][_contains]': 'guide',
        'fields': 'id,title,slug,category,category_l1,category_l2,risk_level',
        'sort': 'created_at',
        'limit': 20
      }
    });

    const guides = response.data.data;

    console.log(`找到 ${guides.length} 个指南：\n`);

    // Get all categories (both parent and child)
    const categoriesResponse = await axios.get(`${DIRECTUS_URL}/items/categories`, {
      params: {
        'fields': 'id,slug,name,type',
        'limit': -1
      }
    });
    const categories = categoriesResponse.data.data;

    // Group by category_l1
    const groupedGuides = {
      airdrop: [],
      yield: [],
      liquidity: [],
      tools: [],
      nft: []
    };

    guides.forEach(guide => {
      if (groupedGuides[guide.category_l1]) {
        groupedGuides[guide.category_l1].push(guide);
      }
    });

    // Display each group
    const categoryNames = {
      airdrop: '空投与早期参与',
      yield: '链上收益策略',
      liquidity: '流动性策略',
      tools: '工具与基础设施',
      nft: 'NFT与链上资产'
    };

    for (const [key, name] of Object.entries(categoryNames)) {
      const guidesList = groupedGuides[key];
      if (guidesList.length > 0) {
        console.log(`\n${'─'.repeat(60)}`);
        console.log(`📁 ${name} (${key})`);
        console.log(`${'─'.repeat(60)}`);

        guidesList.forEach((guide, index) => {
          const cat = categories.find(c => c.id === guide.category);
          const catSlug = cat ? cat.slug : 'unknown';
          const catName = cat ? cat.name : '未知分类';

          console.log(`\n${index + 1}. ${guide.title}`);
          console.log(`   Slug: ${guide.slug}`);
          console.log(`   分类: ${catName} (${catSlug})`);
          console.log(`   风险: ${guide.risk_level}/5`);
          console.log(`   URL: http://localhost:3000/strategies/${guide.slug}`);
          console.log(`   分类页: http://localhost:3000/strategies?category=${catSlug}`);
        });
      }
    }

    // Check auto-pinning configuration
    console.log(`\n\n${'═'.repeat(60)}`);
    console.log('📌 前端自动置顶配置');
    console.log(`${'═'.repeat(60)}\n`);

    const pinnedGuides = [
      { category: 'airdrop-tasks', guide: 'airdrop-tasks-guide' },
      { category: 'points-season', guide: 'points-season-guide' },
      { category: 'testnet', guide: 'testnet-guide' },
      { category: 'launchpad', guide: 'launchpad-guide' },
      { category: 'whitelist', guide: 'whitelist-guide' },
      { category: 'stablecoin-yield', guide: 'stablecoin-yield-guide' },
      { category: 'lending', guide: 'lending-yield-complete-guide' },
    ];

    for (const pin of pinnedGuides) {
      const guide = guides.find(g => g.slug === pin.guide);
      const cat = categories.find(c => c.slug === pin.category);

      const status = guide && cat ? '✅' : '❌';
      const guideName = guide ? guide.title : '未找到';
      const catName = cat ? cat.name : '未找到';

      console.log(`${status} ${pin.category} → ${pin.guide}`);
      console.log(`   分类: ${catName}`);
      console.log(`   指南: ${guideName}`);
      console.log();
    }

    console.log(`${'═'.repeat(60)}`);
    console.log('✨ 验证完成！');
    console.log(`${'═'.repeat(60)}\n`);

    // Summary
    const totalGuides = guides.length;
    const totalPinned = pinnedGuides.length;
    const airdropCount = groupedGuides.airdrop.length;
    const yieldCount = groupedGuides.yield.length;

    console.log('📊 统计摘要：');
    console.log(`   - 总指南数: ${totalGuides}`);
    console.log(`   - 空投类: ${airdropCount}`);
    console.log(`   - 收益类: ${yieldCount}`);
    console.log(`   - 流动性类: ${groupedGuides.liquidity.length}`);
    console.log(`   - 工具类: ${groupedGuides.tools.length}`);
    console.log(`   - NFT类: ${groupedGuides.nft.length}`);
    console.log(`   - 已配置置顶: ${totalPinned}`);

  } catch (error) {
    console.error('❌ 验证失败:', error.response?.data || error.message);
  }
}

verifyAllGuides();
