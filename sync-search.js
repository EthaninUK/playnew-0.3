/**
 * 简化版 Meilisearch 同步脚本
 */

const { MeiliSearch } = require('meilisearch');

const DIRECTUS_URL = 'http://localhost:8055';
const MEILISEARCH_HOST = 'http://localhost:7700';
const MEILISEARCH_KEY = process.env.MEILISEARCH_MASTER_KEY || '3JxRTswA7fhGinzFd9BL5DBXdUhOktwPqzapMDL5GDc=';

const client = new MeiliSearch({
  host: MEILISEARCH_HOST,
  apiKey: MEILISEARCH_KEY,
});

async function syncStrategies() {
  console.log('🔄 同步策略数据...');

  try {
    const response = await fetch(`${DIRECTUS_URL}/items/strategies?filter[status][_eq]=published&limit=-1&fields=id,title,slug,summary,category,risk_level,view_count,bookmark_count,tags,chains,protocols`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const strategies = data.data || [];

    console.log(`📊 找到 ${strategies.length} 个策略`);

    if (strategies.length === 0) {
      console.log('⚠️  没有策略需要同步');
      return;
    }

    const index = client.index('strategies');

    // 配置索引
    await index.updateSearchableAttributes(['title', 'tags', 'category', 'summary']);
    await index.updateFilterableAttributes(['category', 'risk_level', 'status']);
    await index.updateSortableAttributes(['view_count', 'bookmark_count']);

    // 添加文档
    const task = await index.addDocuments(strategies, { primaryKey: 'id' });
    console.log(`⏳ 索引任务 ${task.taskUid} 已加入队列...`);

    // 等待索引完成
    await new Promise(resolve => setTimeout(resolve, 3000));

    const stats = await index.getStats();
    console.log(`✅ 成功同步 ${stats.numberOfDocuments} 个策略`);

  } catch (error) {
    console.error('❌ 同步策略失败:', error.message);
    throw error;
  }
}

async function syncProviders() {
  console.log('🔄 同步服务商数据...');

  try {
    const response = await fetch(`${DIRECTUS_URL}/items/service_providers?filter[status][_eq]=published&limit=-1&fields=id,name,slug,category,description,rating`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const providers = data.data || [];

    console.log(`📊 找到 ${providers.length} 个服务商`);

    if (providers.length === 0) {
      console.log('⚠️  没有服务商需要同步');
      return;
    }

    const index = client.index('providers');

    // 配置索引
    await index.updateSearchableAttributes(['name', 'category', 'description']);
    await index.updateFilterableAttributes(['category', 'rating']);
    await index.updateSortableAttributes(['rating']);

    // 添加文档
    const task = await index.addDocuments(providers, { primaryKey: 'id' });
    console.log(`⏳ 索引任务 ${task.taskUid} 已加入队列...`);

    // 等待索引完成
    await new Promise(resolve => setTimeout(resolve, 2000));

    const stats = await index.getStats();
    console.log(`✅ 成功同步 ${stats.numberOfDocuments} 个服务商`);

  } catch (error) {
    console.error('❌ 同步服务商失败:', error.message);
    throw error;
  }
}

async function syncNews() {
  console.log('🔄 同步新闻数据...');

  try {
    const response = await fetch(`${DIRECTUS_URL}/items/news?filter[status][_eq]=published&limit=-1&fields=id,title,slug,summary,category,published_at`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const news = data.data || [];

    console.log(`📊 找到 ${news.length} 个新闻`);

    if (news.length === 0) {
      console.log('⚠️  没有新闻需要同步');
      return;
    }

    const index = client.index('news');

    // 配置索引
    await index.updateSearchableAttributes(['title', 'summary', 'category']);
    await index.updateFilterableAttributes(['category', 'published_at']);
    await index.updateSortableAttributes(['published_at']);

    // 添加文档
    const task = await index.addDocuments(news, { primaryKey: 'id' });
    console.log(`⏳ 索引任务 ${task.taskUid} 已加入队列...`);

    // 等待索引完成
    await new Promise(resolve => setTimeout(resolve, 2000));

    const stats = await index.getStats();
    console.log(`✅ 成功同步 ${stats.numberOfDocuments} 个新闻`);

  } catch (error) {
    console.error('❌ 同步新闻失败:', error.message);
    throw error;
  }
}

async function main() {
  console.log('🚀 开始同步 Meilisearch...\n');

  try {
    await syncStrategies();
    console.log('');

    await syncProviders();
    console.log('');

    await syncNews();
    console.log('');

    console.log('🎉 所有数据同步完成!');
  } catch (error) {
    console.error('💥 同步失败:', error);
    process.exit(1);
  }
}

main();
