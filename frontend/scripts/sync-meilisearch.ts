/**
 * 同步Directus数据到Meilisearch
 *
 * 使用方法:
 * npx tsx scripts/sync-meilisearch.ts
 */

import { MeiliSearch } from 'meilisearch';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
const MEILISEARCH_HOST = process.env.NEXT_PUBLIC_MEILISEARCH_HOST || 'http://localhost:7700';
const MEILISEARCH_KEY = process.env.MEILISEARCH_MASTER_KEY;

const client = new MeiliSearch({
  host: MEILISEARCH_HOST,
  ...(MEILISEARCH_KEY && { apiKey: MEILISEARCH_KEY }),
});

async function setupStrategiesIndex() {
  console.log('📦 Setting up strategies index...');

  try {
    // 创建或获取索引
    const index = client.index('strategies');

    // 配置可搜索字段（按优先级排序：标题 > 标签/分类 > 摘要 > 正文）
    await index.updateSearchableAttributes([
      'title',
      'tags',
      'category',
      'summary',
      'content',
      'chains',
      'protocols',
    ]);

    // 配置可过滤字段
    await index.updateFilterableAttributes([
      'category',
      'risk_level',
      'status',
      'created_at',
      'tags',
      'chains',
      'protocols',
    ]);

    // 配置可排序字段
    await index.updateSortableAttributes([
      'view_count',
      'bookmark_count',
      'created_at',
      'updated_at',
      'risk_level',
    ]);

    // 配置显示字段
    await index.updateDisplayedAttributes([
      'id',
      'title',
      'slug',
      'summary',
      'category',
      'risk_level',
      'view_count',
      'bookmark_count',
      'tags',
      'chains',
      'protocols',
    ]);

    // 配置排名规则
    await index.updateRankingRules([
      'words',
      'typo',
      'proximity',
      'attribute',
      'sort',
      'exactness',
    ]);

    // 配置 Typo Tolerance（提高容错性）
    await index.updateTypoTolerance({
      enabled: true,
      minWordSizeForTypos: {
        oneTypo: 4,
        twoTypos: 8,
      },
      disableOnWords: [],
      disableOnAttributes: [],
    });

    // 配置 Faceting（分面搜索）
    await index.updateFaceting({
      maxValuesPerFacet: 100,
    });

    // 配置 Pagination
    await index.updatePagination({
      maxTotalHits: 1000,
    });

    // 配置停用词（中文常见停用词）
    await index.updateStopWords([
      '的', '了', '是', '在', '和', '与', '也', '有', '这',
      '那', '但', '等', '及', '或', '为', '从', '以', '而',
    ]);

    // 配置同义词（扩展搜索覆盖范围）
    await index.updateSynonyms({
      'airdrop': ['空投', '撸毛', '羊毛'],
      '空投': ['airdrop', '撸毛', '羊毛'],
      'defi': ['去中心化金融', 'DeFi', 'decentralized finance'],
      '挖矿': ['mining', 'staking', 'yield'],
      '流动性': ['liquidity', 'LP', 'pool'],
      'nft': ['NFT', '非同质化代币', 'non-fungible'],
      'dao': ['DAO', '去中心化组织'],
      'dex': ['DEX', '去中心化交易所', 'decentralized exchange'],
      'amm': ['AMM', '自动做市商', 'automated market maker'],
      '稳定币': ['stablecoin', 'stable coin', 'USDT', 'USDC', 'DAI'],
      '跨链': ['bridge', 'cross-chain', 'multichain'],
      '测试网': ['testnet', 'test network'],
      '质押': ['staking', 'stake', '抵押'],
      '收益': ['yield', 'farming', 'APY', 'APR'],
    });

    console.log('✅ Strategies index configured');
  } catch (error) {
    console.error('❌ Error setting up index:', error);
    throw error;
  }
}

async function syncStrategies() {
  console.log('🔄 Syncing strategies from Directus...');

  try {
    // 从Directus获取所有已发布的策略
    const params = new URLSearchParams({
      'filter[status][_eq]': 'published',
      'limit': '-1',
      'fields': 'id,title,slug,summary,content,category,risk_level,view_count,bookmark_count,created_at,updated_at,status,tags,chains,protocols',
    });

    const response = await fetch(`${DIRECTUS_URL}/items/strategies?${params}`);
    const data = await response.json();
    const strategies = data.data;
    console.log(`Found ${strategies.length} strategies to sync`);

    if (strategies.length === 0) {
      console.log('⚠️  No strategies to sync');
      return;
    }

    // 上传到Meilisearch
    const index = client.index('strategies');
    const task = await index.addDocuments(strategies, {
      primaryKey: 'id',
    });

    console.log(`⏳ Indexing task ${task.taskUid} enqueued...`);

    // 稍等让索引完成
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log(`✅ Synced ${strategies.length} strategies successfully`);

    // 显示索引统计
    const stats = await index.getStats();
    console.log(`📊 Index stats:`, {
      numberOfDocuments: stats.numberOfDocuments,
      isIndexing: stats.isIndexing,
    });
  } catch (error) {
    console.error('❌ Error syncing strategies:', error);
    throw error;
  }
}

async function setupProvidersIndex() {
  console.log('📦 Setting up providers index...');

  try {
    const index = client.index('providers');

    await index.updateSearchableAttributes([
      'name',
      'type',
      'category',
      'description',
      'features',
    ]);

    await index.updateFilterableAttributes([
      'type',
      'category',
      'verified',
      'status',
      'chains',
    ]);

    await index.updateSortableAttributes([
      'rating',
      'view_count',
      'review_count',
    ]);

    await index.updateDisplayedAttributes([
      'id',
      'name',
      'slug',
      'description',
      'logo_url',
      'type',
      'category',
      'rating',
      'verified',
      'view_count',
      'chains',
    ]);

    await index.updateRankingRules([
      'words',
      'typo',
      'proximity',
      'attribute',
      'sort',
      'exactness',
    ]);

    // 配置 Typo Tolerance
    await index.updateTypoTolerance({
      enabled: true,
      minWordSizeForTypos: {
        oneTypo: 4,
        twoTypos: 8,
      },
      disableOnWords: [],
      disableOnAttributes: [],
    });

    // 配置同义词
    await index.updateSynonyms({
      'exchange': ['交易所', 'DEX', 'CEX'],
      '交易所': ['exchange', 'DEX', 'CEX'],
      'wallet': ['钱包', 'metamask', 'trust wallet'],
      '钱包': ['wallet', '钱包'],
      'lending': ['借贷', 'aave', 'compound'],
      '借贷': ['lending', '借贷平台'],
    });

    console.log('✅ Providers index configured');
  } catch (error) {
    console.error('❌ Error setting up providers index:', error);
    throw error;
  }
}

async function syncProviders() {
  console.log('🔄 Syncing service providers from Directus...');

  try {
    const params = new URLSearchParams({
      'filter[status][_eq]': 'published',
      'limit': '-1',
      'fields': 'id,name,slug,description,logo_url,type,category,rating,verified,view_count,review_count,website_url,status',
    });

    const response = await fetch(`${DIRECTUS_URL}/items/service_providers?${params}`);
    const data = await response.json();

    if (data.errors) {
      console.error('❌ API Error:', data.errors);
      throw new Error(data.errors[0]?.message || 'Unknown API error');
    }

    const providers = data.data || [];
    console.log(`Found ${providers.length} providers to sync`);

    if (providers.length === 0) {
      console.log('⚠️  No providers to sync');
      return;
    }

    const index = client.index('providers');
    const task = await index.addDocuments(providers, {
      primaryKey: 'id',
    });

    console.log(`⏳ Indexing task ${task.taskUid} enqueued...`);
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log(`✅ Synced ${providers.length} providers successfully`);

    const stats = await index.getStats();
    console.log(`📊 Index stats:`, {
      numberOfDocuments: stats.numberOfDocuments,
      isIndexing: stats.isIndexing,
    });
  } catch (error) {
    console.error('❌ Error syncing providers:', error);
    throw error;
  }
}

async function setupNewsIndex() {
  console.log('📦 Setting up news index...');

  try {
    const index = client.index('news');

    await index.updateSearchableAttributes([
      'title',
      'ai_summary',
      'category',
      'source',
      'content',
    ]);

    await index.updateFilterableAttributes([
      'category',
      'status',
      'published_at',
      'news_type',
      'source',
    ]);

    await index.updateSortableAttributes([
      'published_at',
      'created_at',
    ]);

    await index.updateDisplayedAttributes([
      'id',
      'title',
      'ai_summary',
      'category',
      'source',
      'published_at',
      'news_type',
    ]);

    await index.updateRankingRules([
      'words',
      'typo',
      'proximity',
      'attribute',
      'sort',
      'exactness',
    ]);

    // 配置 Typo Tolerance
    await index.updateTypoTolerance({
      enabled: true,
      minWordSizeForTypos: {
        oneTypo: 4,
        twoTypos: 8,
      },
      disableOnWords: [],
      disableOnAttributes: [],
    });

    // 配置同义词
    await index.updateSynonyms({
      'bitcoin': ['BTC', '比特币', 'btc'],
      'ethereum': ['ETH', '以太坊', 'eth', 'Ether'],
      'binance': ['币安', 'BNB'],
      '空投': ['airdrop', '撸毛', '羊毛'],
      'defi': ['DeFi', '去中心化金融'],
      'nft': ['NFT', '非同质化代币'],
      'web3': ['Web3', 'web 3.0', 'web三点零'],
    });

    console.log('✅ News index configured');
  } catch (error) {
    console.error('❌ Error setting up news index:', error);
    throw error;
  }
}

async function syncNews() {
  console.log('🔄 Syncing news from Directus...');

  try {
    const params = new URLSearchParams({
      'filter[status][_eq]': 'published',
      'limit': '-1',
      'fields': 'id,title,ai_summary,content,category,source,published_at,created_at,status,news_type',
    });

    const response = await fetch(`${DIRECTUS_URL}/items/news?${params}`);
    const data = await response.json();

    if (data.errors) {
      console.error('❌ API Error:', data.errors);
      throw new Error(data.errors[0]?.message || 'Unknown API error');
    }

    const news = data.data || [];
    console.log(`Found ${news.length} news items to sync`);

    if (news.length === 0) {
      console.log('⚠️  No news to sync');
      return;
    }

    const index = client.index('news');
    const task = await index.addDocuments(news, {
      primaryKey: 'id',
    });

    console.log(`⏳ Indexing task ${task.taskUid} enqueued...`);
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log(`✅ Synced ${news.length} news items successfully`);

    const stats = await index.getStats();
    console.log(`📊 Index stats:`, {
      numberOfDocuments: stats.numberOfDocuments,
      isIndexing: stats.isIndexing,
    });
  } catch (error) {
    console.error('❌ Error syncing news:', error);
    throw error;
  }
}

async function main() {
  console.log('🚀 Starting Meilisearch sync...\n');

  try {
    // 设置索引
    await setupStrategiesIndex();
    console.log('');
    await setupProvidersIndex();
    console.log('');
    await setupNewsIndex();
    console.log('');

    // 同步数据
    await syncStrategies();
    console.log('');
    await syncProviders();
    console.log('');
    await syncNews();
    console.log('');

    console.log('✨ Sync completed successfully!');
  } catch (error) {
    console.error('\n💥 Sync failed:', error);
    process.exit(1);
  }
}

main();
