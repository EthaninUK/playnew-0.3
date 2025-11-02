#!/usr/bin/env node

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_EMAIL = 'the_uk1@outlook.com';
const DIRECTUS_PASSWORD = 'Mygcdjmyxzg2026!';

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// 新的分类系统
const newCategories = [
  {
    id: generateUUID(),
    name: '撸空投&积分',
    slug: 'airdrop-points',
    type: 'play',
    description: '通过完成任务、交互协议等方式获得空投和积分奖励',
    order_index: 1,
    is_active: true,
    icon: '🎁'
  },
  {
    id: generateUUID(),
    name: '稳健赚利息',
    slug: 'stable-yield',
    type: 'play',
    description: '低风险的稳定收益策略，如质押、存款等',
    order_index: 2,
    is_active: true,
    icon: '🏦'
  },
  {
    id: generateUUID(),
    name: '做市赚手续费',
    slug: 'market-making',
    type: 'play',
    description: '通过提供流动性赚取交易手续费',
    order_index: 3,
    is_active: true,
    icon: '💱'
  },
  {
    id: generateUUID(),
    name: '对冲/套利',
    slug: 'arbitrage-hedging',
    type: 'play',
    description: '通过价差套利或对冲策略获利',
    order_index: 4,
    is_active: true,
    icon: '⚖️'
  },
  {
    id: generateUUID(),
    name: '进阶衍生品',
    slug: 'advanced-derivatives',
    type: 'play',
    description: '期权、永续合约等高级衍生品策略',
    order_index: 5,
    is_active: true,
    icon: '📈'
  },
  {
    id: generateUUID(),
    name: 'NFT 玩法',
    slug: 'nft-strategies',
    type: 'play',
    description: 'NFT 相关的投资和盈利策略',
    order_index: 6,
    is_active: true,
    icon: '🖼️'
  },
  {
    id: generateUUID(),
    name: '新链/新池雷达',
    slug: 'new-chains-pools',
    type: 'play',
    description: '追踪新链、新协议的早期机会',
    order_index: 7,
    is_active: true,
    icon: '🔍'
  },
  {
    id: generateUUID(),
    name: '工具与服务',
    slug: 'tools-services',
    type: 'play',
    description: '有用的工具、服务商推荐',
    order_index: 8,
    is_active: true,
    icon: '🛠️'
  }
];

// 策略分类映射
const strategyMapping = {
  'uniswap-v3-concentrated-liquidity': 'market-making',
  'lido-eth-staking': 'stable-yield',
  'arbitrum-airdrop-farming': 'airdrop-points',
  'curve-stablecoin-farming': 'stable-yield',
  'zksync-era-testnet': 'airdrop-points',
  'aave-v3-recursive-lending': 'arbitrage-hedging',
  'galxe-quest-farming': 'airdrop-points',
  'gmx-liquidity-provision': 'advanced-derivatives',
  'base-chain-early-interaction': 'new-chains-pools',
  'pendle-fixed-yield-trading': 'advanced-derivatives'
};

async function login() {
  const response = await fetch(`${DIRECTUS_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: DIRECTUS_EMAIL, password: DIRECTUS_PASSWORD }),
  });
  const data = await response.json();
  return data.data.access_token;
}

async function deleteAllCategories(token) {
  console.log('🗑️  Deleting old categories...');
  const response = await fetch(`${DIRECTUS_URL}/items/categories`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const data = await response.json();
  
  for (const cat of data.data) {
    await fetch(`${DIRECTUS_URL}/items/categories/${cat.id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
  }
  console.log('✅ Old categories deleted\n');
}

async function createCategories(token) {
  console.log('📝 Creating new categories...\n');
  for (const category of newCategories) {
    const response = await fetch(`${DIRECTUS_URL}/items/categories`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(category),
    });
    
    if (response.ok) {
      console.log(`  ✅ ${category.name} (${category.slug})`);
    } else {
      console.log(`  ❌ Failed: ${category.name}`);
    }
  }
  console.log('');
}

async function updateStrategies(token) {
  console.log('🔄 Updating strategy categories...\n');
  
  for (const [slug, newCategory] of Object.entries(strategyMapping)) {
    // Get strategy
    const getResponse = await fetch(`${DIRECTUS_URL}/items/strategies?filter[slug][_eq]=${slug}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const getData = await getResponse.json();
    
    if (getData.data && getData.data.length > 0) {
      const strategy = getData.data[0];
      
      // Update category
      const updateResponse = await fetch(`${DIRECTUS_URL}/items/strategies/${strategy.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: newCategory,
          category_l1: newCategory
        }),
      });
      
      if (updateResponse.ok) {
        console.log(`  ✅ ${strategy.title} → ${newCategory}`);
      } else {
        console.log(`  ❌ Failed: ${strategy.title}`);
      }
    }
  }
  console.log('');
}

async function main() {
  try {
    console.log('');
    console.log('================================================');
    console.log('  Update Categories System');
    console.log('================================================');
    console.log('');

    const token = await login();
    console.log('✅ Logged in\n');

    await deleteAllCategories(token);
    await createCategories(token);
    await updateStrategies(token);

    console.log('================================================');
    console.log('🎉 Categories updated successfully!');
    console.log('================================================');
    console.log('');
    console.log('New categories:');
    console.log('  1. 撸空投&积分 (airdrop-points)');
    console.log('  2. 稳健赚利息 (stable-yield)');
    console.log('  3. 做市赚手续费 (market-making)');
    console.log('  4. 对冲/套利 (arbitrage-hedging)');
    console.log('  5. 进阶衍生品 (advanced-derivatives)');
    console.log('  6. NFT 玩法 (nft-strategies)');
    console.log('  7. 新链/新池雷达 (new-chains-pools)');
    console.log('  8. 工具与服务 (tools-services)');
    console.log('');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
