#!/usr/bin/env node

/**
 * Add sample data to Directus collections
 * Adds initial categories, tags, chains, and protocols
 */

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_EMAIL = 'the_uk1@outlook.com';
const DIRECTUS_PASSWORD = 'Mygcdjmyxzg2026!';

// Simple UUID v4 generator
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const sampleData = {
  categories: [
    { name: 'DeFi', slug: 'defi', type: 'play', order_index: 1, is_active: true, description: '去中心化金融相关玩法' },
    { name: '空投', slug: 'airdrop', type: 'play', order_index: 2, is_active: true, description: '各类空投活动' },
    { name: 'NFT', slug: 'nft', type: 'play', order_index: 3, is_active: true, description: 'NFT相关玩法' },
    { name: '流动性挖矿', slug: 'yield-farming', type: 'play', order_index: 4, is_active: true, description: '流动性挖矿策略' },
    { name: 'Staking', slug: 'staking', type: 'play', order_index: 5, is_active: true, description: '质押收益' },
    { name: '市场分析', slug: 'market-analysis', type: 'news', order_index: 10, is_active: true, description: '市场趋势分析' },
    { name: '项目动态', slug: 'project-news', type: 'news', order_index: 11, is_active: true, description: '项目最新动态' },
    { name: '监管政策', slug: 'regulations', type: 'news', order_index: 12, is_active: true, description: '监管政策更新' }
  ],
  tags: [
    { name: '低风险', slug: 'low-risk', color: '#10B981', description: '风险较低的策略' },
    { name: '中等风险', slug: 'medium-risk', color: '#F59E0B', description: '中等风险的策略' },
    { name: '高风险', slug: 'high-risk', color: '#EF4444', description: '高风险高收益' },
    { name: '新手友好', slug: 'beginner-friendly', color: '#3B82F6', description: '适合新手' },
    { name: '高级', slug: 'advanced', color: '#8B5CF6', description: '需要一定经验' },
    { name: '热门', slug: 'trending', color: '#EC4899', description: '当前热门' }
  ],
  chains: [
    { name: 'Ethereum', slug: 'ethereum', chain_id: '1', is_active: true, description: '以太坊主网' },
    { name: 'BNB Chain', slug: 'bnb-chain', chain_id: '56', is_active: true, description: 'BNB智能链' },
    { name: 'Polygon', slug: 'polygon', chain_id: '137', is_active: true, description: 'Polygon网络' },
    { name: 'Arbitrum', slug: 'arbitrum', chain_id: '42161', is_active: true, description: 'Arbitrum Layer 2' },
    { name: 'Optimism', slug: 'optimism', chain_id: '10', is_active: true, description: 'Optimism Layer 2' },
    { name: 'Base', slug: 'base', chain_id: '8453', is_active: true, description: 'Base Layer 2' }
  ],
  protocols: [
    { name: 'Uniswap', slug: 'uniswap', protocol_type: 'dex', is_active: true, description: '去中心化交易所' },
    { name: 'Aave', slug: 'aave', protocol_type: 'lending', is_active: true, description: '借贷协议' },
    { name: 'Compound', slug: 'compound', protocol_type: 'lending', is_active: true, description: '借贷协议' },
    { name: 'Curve', slug: 'curve', protocol_type: 'dex', is_active: true, description: '稳定币交易' },
    { name: 'Lido', slug: 'lido', protocol_type: 'staking', is_active: true, description: '流动性质押' }
  ]
};

async function login() {
  const response = await fetch(`${DIRECTUS_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: DIRECTUS_EMAIL,
      password: DIRECTUS_PASSWORD,
    }),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  const data = await response.json();
  return data.data.access_token;
}

async function createItem(token, collection, item) {
  const response = await fetch(`${DIRECTUS_URL}/items/${collection}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(item),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`    ❌ Failed: ${error.substring(0, 100)}`);
    return false;
  }

  return true;
}

async function getItems(token, collection) {
  const response = await fetch(`${DIRECTUS_URL}/items/${collection}?limit=1`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  return data.data || [];
}

async function main() {
  try {
    console.log('');
    console.log('================================================');
    console.log('  Add Sample Data to Directus');
    console.log('================================================');
    console.log('');

    console.log('🔐 Logging in...\n');
    const token = await login();

    let totalCreated = 0;

    for (const [collection, items] of Object.entries(sampleData)) {
      console.log(`\n📦 Adding data to: ${collection}`);
      console.log('─'.repeat(50));

      // Check if collection already has data
      const existing = await getItems(token, collection);
      if (existing.length > 0) {
        console.log(`  ℹ️  Collection already has data, skipping...`);
        continue;
      }

      let created = 0;
      for (const item of items) {
        // Add UUID for id field
        const itemWithId = {
          id: generateUUID(),
          ...item
        };

        const success = await createItem(token, collection, itemWithId);
        if (success) {
          console.log(`  ✅ Created: ${item.name || item.slug}`);
          created++;
          totalCreated++;
        }
        // Small delay to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      console.log(`  📊 Total: ${created}/${items.length}`);
    }

    console.log('');
    console.log('================================================');
    console.log('📊 Summary:');
    console.log(`  ✅ Total items created: ${totalCreated}`);
    console.log('================================================');
    console.log('');
    console.log('🎉 Sample data added!');
    console.log('');
    console.log('View the data:');
    console.log('  http://localhost:8055/admin/content/categories');
    console.log('  http://localhost:8055/admin/content/tags');
    console.log('  http://localhost:8055/admin/content/chains');
    console.log('  http://localhost:8055/admin/content/protocols');
    console.log('');

  } catch (error) {
    console.error('');
    console.error('❌ Error:', error.message);
    console.error('');
    process.exit(1);
  }
}

main();
