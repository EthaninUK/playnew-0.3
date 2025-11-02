/**
 * Airdrops.io RSS Feed Scraper
 *
 * 抓取 Airdrops.io 的 RSS Feed 并保存到 Directus strategies 表
 * 自动分类到"空投与早期参与"的子分类
 */

const axios = require('axios');
const Parser = require('rss-parser');
const parser = new Parser();
const { Client } = require('pg');
const { randomUUID } = require('crypto');

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_EMAIL = 'the_uk1@outlook.com';
const DIRECTUS_PASSWORD = 'Mygcdjmyxzg2026!';

// Airdrops.io RSS Feed
const AIRDROPS_RSS_URL = 'https://airdrops.io/rss';

// PostgreSQL 配置 (Supabase)
const DB_CONNECTION_STRING = 'postgresql://postgres.cujpgrzjmmttysphjknu:bi3d8FpBFTUWuwOb@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres';
const DB_CONFIG = {
  connectionString: DB_CONNECTION_STRING,
  ssl: {
    rejectUnauthorized: false  // 禁用 SSL 证书验证（与 Directus 配置一致）
  }
};

let categoryCache = null;

// ==================== Directus 函数 ====================

async function getDirectusToken() {
  try {
    const response = await axios.post(`${DIRECTUS_URL}/auth/login`, {
      email: DIRECTUS_EMAIL,
      password: DIRECTUS_PASSWORD
    });
    return response.data.data.access_token;
  } catch (error) {
    console.error('❌ Directus login failed:', error.message);
    throw error;
  }
}

async function getCategories(token) {
  if (categoryCache) return categoryCache;

  const response = await axios.get(
    `${DIRECTUS_URL}/items/categories?fields=id,name,slug,parent_id`,
    { headers: { 'Authorization': `Bearer ${token}` } }
  );

  categoryCache = response.data.data;
  return categoryCache;
}

async function getCategoryId(slug, token) {
  const categories = await getCategories(token);
  const category = categories.find(c => c.slug === slug);
  return category?.id || null;
}

async function getCategoryName(slug, token) {
  const categories = await getCategories(token);
  const category = categories.find(c => c.slug === slug);
  return category?.name || null;
}

// ==================== 数据转换函数 ====================

function mapAirdropTypeToCategory(title, description) {
  const combined = (title + ' ' + description).toLowerCase();

  // 关键词匹配
  if (combined.includes('testnet') || combined.includes('test net') || combined.includes('早鸟')) {
    return 'testnet';
  } else if (combined.includes('points') || combined.includes('season') || combined.includes('积分')) {
    return 'points-season';
  } else if (combined.includes('launchpad') || combined.includes('ido') || combined.includes('ieo') || combined.includes('配售')) {
    return 'launchpad';
  } else if (combined.includes('whitelist') || combined.includes('presale') || combined.includes('白名单') || combined.includes('预售')) {
    return 'whitelist';
  }

  // 默认归到空投任务
  return 'airdrop-tasks';
}

function extractChains(text) {
  const chains = [];
  const chainKeywords = {
    'ethereum': 'Ethereum',
    'arbitrum': 'Arbitrum',
    'optimism': 'Optimism',
    'polygon': 'Polygon',
    'zksync': 'zkSync',
    'base': 'Base',
    'bnb': 'BNB Chain',
    'avalanche': 'Avalanche',
    'solana': 'Solana'
  };

  const lowerText = text.toLowerCase();
  for (const [keyword, chain] of Object.entries(chainKeywords)) {
    if (lowerText.includes(keyword)) {
      chains.push(chain);
    }
  }

  return chains.length > 0 ? chains.slice(0, 3) : ['Ethereum']; // 默认以太坊
}

function calculateRiskLevel(description) {
  const lowerDesc = description.toLowerCase();

  // 高风险标记
  if (lowerDesc.includes('high risk') || lowerDesc.includes('unverified') || lowerDesc.includes('scam')) {
    return 5;
  }

  // 低风险标记
  if (lowerDesc.includes('verified') || lowerDesc.includes('funded') || lowerDesc.includes('official')) {
    return 2;
  }

  // 默认中风险
  return 3;
}

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100);
}

function generateAirdropMarkdown(airdrop) {
  let md = `# ${airdrop.title}\n\n`;

  // 空投概览
  md += `## 🎯 空投概览\n\n`;
  md += `- **项目**: ${airdrop.projectName}\n`;
  md += `- **来源**: Airdrops.io\n`;
  if (airdrop.chains && airdrop.chains.length > 0) {
    md += `- **支持链**: ${airdrop.chains.join(', ')}\n`;
  }
  if (airdrop.pubDate) {
    md += `- **发布时间**: ${new Date(airdrop.pubDate).toLocaleDateString('zh-CN')}\n`;
  }
  md += `\n`;

  // 项目描述
  if (airdrop.description) {
    md += `## 📖 项目介绍\n\n`;
    md += `${airdrop.description}\n\n`;
  }

  // 参与方式
  md += `## 📋 如何参与\n\n`;
  md += `请访问 [Airdrops.io 详情页](${airdrop.link}) 查看完整的参与步骤和要求。\n\n`;

  // 相关链接
  md += `## 🔗 相关链接\n\n`;
  md += `- [Airdrops.io 详情](${airdrop.link})\n`;
  if (airdrop.guid) {
    md += `- [直接链接](${airdrop.guid})\n`;
  }
  md += `\n`;

  // 风险提示
  md += `## ⚠️ 风险提示\n\n`;
  md += `- 请确保访问官方网站，避免钓鱼链接\n`;
  md += `- 不要分享私钥或助记词\n`;
  md += `- 注意空投的真实性，谨防诈骗\n`;
  md += `- 本信息仅供参考，不构成投资建议\n`;
  md += `- DYOR (Do Your Own Research)\n\n`;

  // 数据来源
  md += `## 📊 数据来源\n\n`;
  md += `本信息来自 Airdrops.io RSS Feed，最后更新于 ${new Date().toLocaleDateString('zh-CN')}\n`;

  return md;
}

async function convertAirdropToStrategy(airdrop, categoryId, categoryName) {
  const chains = airdrop.chains || ['ethereum'];
  const projectName = airdrop.projectName || airdrop.title.split(' ')[0];

  const tags = [
    '空投',
    ...chains.slice(0, 2),
    airdrop.type || 'airdrop'
  ].slice(0, 5);

  return {
    title: airdrop.title,
    slug: generateSlug(airdrop.title),
    summary: (airdrop.description || airdrop.title).substring(0, 200),
    content: generateAirdropMarkdown(airdrop),

    // 分类
    category_l1: 'airdrop',  // 简短标签，不是 slug
    category_l2: categoryName,
    category: categoryId,

    // 难度和风险
    risk_level: calculateRiskLevel(airdrop.description || ''),
    threshold_tech_level: 'beginner',
    time_commitment_minutes: 60, // 默认 1 小时

    // 链和协议
    chains: chains,
    protocols: [projectName],
    tags: tags,

    // 数据来源
    source_name: 'Airdrops.io',
    source_url: airdrop.link,
    source_credibility: 75, // Airdrops.io 可信度中等偏上

    // 状态
    status: 'published',
    published_at: airdrop.pubDate || new Date().toISOString(),

    // 统计
    view_count: 0,
    bookmark_count: 0
  };
}

// ==================== 主函数 ====================

async function scrapeAirdrops() {
  console.log('🚀 Starting Airdrops.io RSS Scraper...\n');

  try {
    // Step 1: 获取 RSS Feed
    console.log('📡 Fetching RSS feed from Airdrops.io...');
    const feed = await parser.parseURL(AIRDROPS_RSS_URL);
    console.log(`✅ Found ${feed.items.length} items in RSS feed\n`);

    if (feed.items.length === 0) {
      console.log('⚠️  No items in RSS feed');
      return;
    }

    // Step 2: 登录 Directus
    console.log('🔐 Logging in to Directus...');
    const token = await getDirectusToken();
    console.log('✅ Logged in\n');

    // Step 3: 获取分类
    console.log('📂 Loading categories...');
    await getCategories(token);
    console.log('✅ Categories loaded\n');

    // Step 4: 连接数据库（复用一个连接）
    const dbClient = new Client(DB_CONFIG);
    await dbClient.connect();
    console.log('✅ Connected to database\n');

    // Step 5: 处理每个空投（前10个）
    console.log('💾 Processing airdrops...\n');

    let successCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (let i = 0; i < Math.min(10, feed.items.length); i++) {
      const item = feed.items[i];

      try {
        // 解析数据
        const title = item.title || 'Unnamed Airdrop';
        const description = item.contentSnippet || item.description || item.content || '';
        const link = item.link || item.guid;

        // 提取项目名称（通常在标题开头）
        const projectName = title.split(/[-–:]/)[0].trim();

        // 提取链信息
        const chains = extractChains(title + ' ' + description);

        // 确定分类
        const categorySlug = mapAirdropTypeToCategory(title, description);
        const categoryId = await getCategoryId(categorySlug, token);
        const categoryName = await getCategoryName(categorySlug, token);

        if (!categoryId || !categoryName) {
          console.log(`⚠️  Category not found: ${categorySlug}, skipping: ${title}`);
          skippedCount++;
          continue;
        }

        // 准备数据
        const airdropData = {
          title,
          description,
          link,
          guid: item.guid,
          pubDate: item.pubDate || item.isoDate,
          projectName,
          chains,
          type: categorySlug
        };

        // 转换为 strategy 格式
        const strategy = await convertAirdropToStrategy(airdropData, categoryId, categoryName);

        // 检查是否已存在
        const existingCheck = await axios.get(
          `${DIRECTUS_URL}/items/strategies?filter[title][_eq]=${encodeURIComponent(strategy.title)}`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );

        if (existingCheck.data.data.length > 0) {
          console.log(`⏭️  Skipped: ${strategy.title.substring(0, 60)}... (exists)`);
          skippedCount++;
          continue;
        }

        // 保存到数据库（直接使用 PostgreSQL，绕过 Directus API）
        const strategyId = randomUUID();
        const now = new Date().toISOString();

        await dbClient.query(`
          INSERT INTO strategies (
            id, title, slug, summary, content,
            category_l1, category_l2, category,
            risk_level, threshold_tech_level, time_commitment_minutes,
            chains, protocols, tags,
            source_name, source_url, source_credibility,
            status, published_at, created_at, updated_at,
            view_count, bookmark_count
          ) VALUES (
            $1, $2, $3, $4, $5,
            $6, $7, $8,
            $9, $10, $11,
            $12, $13, $14,
            $15, $16, $17,
            $18, $19, $20, $21,
            $22, $23
          )
        `, [
          strategyId,
          strategy.title,
          strategy.slug,
          strategy.summary,
          strategy.content,
          strategy.category_l1,
          strategy.category_l2,
          strategy.category,
          strategy.risk_level,
          strategy.threshold_tech_level,
          strategy.time_commitment_minutes,
          strategy.chains,  // PostgreSQL 会正确处理数组
          strategy.protocols,
          strategy.tags,
          strategy.source_name,
          strategy.source_url,
          strategy.source_credibility,
          strategy.status,
          strategy.published_at,
          now,
          now,
          strategy.view_count,
          strategy.bookmark_count
        ]);

        console.log(`✅ Saved: ${strategy.title.substring(0, 60)}... → ${categorySlug}`);
        successCount++;

      } catch (error) {
        console.error(`❌ Error: ${item.title?.substring(0, 50) || 'Unknown'}...`);
        console.error(`   ${error.response?.data?.errors?.[0]?.message || error.message}`);
        errorCount++;
      }
    }

    // 关闭数据库连接
    await dbClient.end();
    console.log('✅ Database connection closed\n');

    console.log('\n' + '='.repeat(80));
    console.log('✅ Airdrops.io scraping complete!');
    console.log(`   Total processed: ${Math.min(10, feed.items.length)}`);
    console.log(`   Saved: ${successCount}`);
    console.log(`   Skipped: ${skippedCount}`);
    console.log(`   Errors: ${errorCount}`);
    console.log('='.repeat(80) + '\n');

    // 显示分类统计
    if (successCount > 0) {
      console.log('📊 Category Distribution:');
      const categoryStats = {};
      // 这里可以添加统计逻辑
      console.log('   Check your strategies page to see the new airdrops!\n');
    }

  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    if (error.response) {
      console.error('   Response:', JSON.stringify(error.response.data).substring(0, 300));
    }
    throw error;
  }
}

// Run the scraper
if (require.main === module) {
  scrapeAirdrops().catch(error => {
    console.error('\n💥 Script failed:', error.message);
    process.exit(1);
  });
}

module.exports = { scrapeAirdrops };
