const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.cujpgrzjmmttysphjknu:bi3d8FpBFTUWuwOb@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres',
  ssl: {
    rejectUnauthorized: false
  }
});

// Mapping from old category_l2 to new category slug
const CATEGORY_MAPPING = {
  // Airdrop categories
  '空投任务': 'airdrop-tasks',
  '积分赛季': 'points-season',
  '积分系统攻略': 'points-season',
  '测试网任务': 'testnet',
  '测试网&早鸟': 'testnet',
  '主网交互挖矿': 'airdrop-tasks',
  '新公链&L2': 'new-chains',
  '新池&新协议': 'new-protocols',
  '发射台与代币配售': 'launchpad',
  '社交任务': 'airdrop-tasks',
  '白名单/预售': 'whitelist',
  '生态任务': 'ecosystem-tasks',
  '链上活跃度': 'onchain-activity',

  // Yield categories
  '稳定币收益': 'stablecoin-yield',
  'Stablecoin': 'stablecoin-yield',
  '稳定币理财': 'stablecoin-yield',
  'DeFi 借贷': 'lending',
  '借贷挖息': 'lending',
  'Lending': 'lending',
  'LST 质押': 'lst-staking',
  'Staking': 'lst-staking',
  '再质押/LRT': 'restaking',
  'RWA / 链上国债': 'rwa',
  'AMM 做市': 'amm',
  '订单簿做市': 'orderbook',
  '订单簿 MM': 'orderbook',
  '聚合器与金库': 'vault',
  '流动性引导': 'liquidity-mining',
  'DeFi收益农场': 'vault',
  '结构化产品': 'vault',

  // Arbitrage categories
  '资金费率套利': 'funding-arbitrage',
  '期现基差': 'basis-trading',
  '跨交易所套利': 'cex-arbitrage',
  '跨交易所搬砖': 'cex-arbitrage',
  '跨所搬砖': 'cex-arbitrage',
  '稳定币脱锚': 'depeg-arbitrage',
  '三角 / 跨链套利': 'triangle-arbitrage',
  '跨链套利': 'triangle-arbitrage',

  // Derivatives categories
  '期权卖方': 'options-selling',
  '期权策略': 'options-selling',
  '波动率交易': 'volatility',
  '网格趋势': 'grid-trading',
  '事件驱动': 'event-driven',
  '永续合约策略': 'grid-trading',

  // Liquidity categories
  '集中流动性': 'amm',
  'DEX': 'amm',
  'DEX LP 提供': 'amm',
  '稳定币对做市': 'amm',

  // NFT categories
  'NFT 铸造': 'nft-minting',
  'NFT 借贷': 'nft-fi',
  '地板价扫货': 'nft-minting',
  'Mint 抢购': 'nft-minting',

  // Radar categories
  '新公链监控': 'new-chains',
  '早期项目发现': 'new-protocols',
  '新 DEX/池子追踪': 'new-protocols',

  // Tools categories
  '交易工具': 'trading-bots',
  '多签/资产管理': 'cross-chain',
  '链上分析工具': 'data-tracking',
};

async function remapCategories() {
  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    // Get all strategies
    const strategiesQuery = `
      SELECT id, title, slug, category_l1, category_l2
      FROM strategies
      WHERE status = 'published'
      ORDER BY title;
    `;
    const strategies = await client.query(strategiesQuery);
    console.log(`📊 Found ${strategies.rows.length} published strategies\n`);

    let updated = 0;
    let unmapped = [];

    console.log('🔄 Remapping strategies to new categories...\n');

    for (const strategy of strategies.rows) {
      let newCategorySlug = null;

      // Try to map by category_l2 first
      if (strategy.category_l2) {
        newCategorySlug = CATEGORY_MAPPING[strategy.category_l2];
      }

      // If not found, try some title-based heuristics
      if (!newCategorySlug) {
        const title = strategy.title.toLowerCase();

        if (title.includes('空投') || title.includes('airdrop')) {
          newCategorySlug = 'airdrop-tasks';
        } else if (title.includes('测试网') || title.includes('testnet')) {
          newCategorySlug = 'testnet';
        } else if (title.includes('稳定币') || title.includes('stablecoin')) {
          newCategorySlug = 'stablecoin-yield';
        } else if (title.includes('借贷') || title.includes('lending')) {
          newCategorySlug = 'lending';
        } else if (title.includes('套利') || title.includes('arbitrage')) {
          newCategorySlug = 'cex-arbitrage';
        } else if (title.includes('nft')) {
          newCategorySlug = 'nft-minting';
        } else if (title.includes('永续') || title.includes('perpetual')) {
          newCategorySlug = 'grid-trading';
        } else if (title.includes('流动性') || title.includes('liquidity')) {
          newCategorySlug = 'liquidity-mining';
        }
      }

      if (newCategorySlug) {
        // Get the category ID from playnew_categories
        const catQuery = await client.query(
          'SELECT id FROM playnew_categories WHERE slug = $1',
          [newCategorySlug]
        );

        if (catQuery.rows.length > 0) {
          const categoryId = catQuery.rows[0].id;

          // Update strategy
          await client.query(
            'UPDATE strategies SET category = $1 WHERE id = $2',
            [categoryId, strategy.id]
          );

          console.log(`✅ ${strategy.title} → ${newCategorySlug}`);
          updated++;
        } else {
          console.log(`⚠️  Category not found: ${newCategorySlug} for ${strategy.title}`);
          unmapped.push({ strategy: strategy.title, category_l2: strategy.category_l2 });
        }
      } else {
        console.log(`❌ No mapping for: ${strategy.title} (${strategy.category_l2})`);
        unmapped.push({ strategy: strategy.title, category_l2: strategy.category_l2 });
      }
    }

    console.log(`\n\n📊 Summary:`);
    console.log(`  ✅ Successfully remapped: ${updated} strategies`);
    console.log(`  ❌ Unmapped: ${unmapped.length} strategies\n`);

    if (unmapped.length > 0) {
      console.log('Unmapped strategies:');
      unmapped.forEach(u => {
        console.log(`  - ${u.strategy} (${u.category_l2})`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    await client.end();
  }
}

remapCategories();
