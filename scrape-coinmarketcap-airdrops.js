/**
 * CoinMarketCap Airdrops Scraper
 *
 * 抓取 CoinMarketCap 空投数据并保存到 Directus strategies 表
 * 自动分类到"空投与早期参与"的子分类
 */

const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_EMAIL = 'the_uk1@outlook.com';
const DIRECTUS_PASSWORD = 'Mygcdjmyxzg2026!';

// CoinMarketCap API (使用公开数据API，不需要API key)
const CMC_AIRDROP_URL = 'https://api.coinmarketcap.com/data-api/v3/airdrop/list';

// 分类映射
const AIRDROP_TYPE_TO_CATEGORY = {
  'task': 'airdrop-tasks',        // 任务式 → 空投任务
  'points': 'points-season',      // 积分 → 积分赛季
  'testnet': 'testnet',           // 测试网 → 测试网&早鸟
  'launchpad': 'launchpad',       // 启动板 → 启动板&配售
  'whitelist': 'whitelist',       // 白名单 → 白名单/预售
  'default': 'airdrop-tasks'      // 默认 → 空投任务
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

// ==================== 数据转换函数 ====================

function mapAirdropTypeToCategory(airdropType) {
  if (!airdropType) return AIRDROP_TYPE_TO_CATEGORY.default;

  const type = airdropType.toLowerCase();

  if (type.includes('task') || type.includes('quest')) {
    return 'airdrop-tasks';
  } else if (type.includes('point') || type.includes('season')) {
    return 'points-season';
  } else if (type.includes('test')) {
    return 'testnet';
  } else if (type.includes('launch') || type.includes('ido')) {
    return 'launchpad';
  } else if (type.includes('whitelist') || type.includes('presale')) {
    return 'whitelist';
  }

  return AIRDROP_TYPE_TO_CATEGORY.default;
}

function calculateRiskLevel(score) {
  // CMC 质量分数 → 风险等级
  if (score >= 80) return '1-2';  // 低风险
  if (score >= 60) return '3-4';  // 中风险
  return '5';                      // 高风险
}

function parseTimeToMinutes(timeStr) {
  if (!timeStr) return 60; // 默认 1 小时

  const match = timeStr.match(/(\d+)\s*([分小时天周])/);
  if (!match) return 60;

  const value = parseInt(match[1]);
  const unit = match[2];

  const multiplier = {
    '分': 1,
    '小': 60,
    '时': 60,
    '天': 1440,
    '周': 10080
  };

  return value * (multiplier[unit] || 60);
}

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100);
}

function generateAirdropMarkdown(airdrop) {
  let md = `# ${airdrop.name}\n\n`;

  // 空投概览
  md += `## 🎯 空投概览\n\n`;
  md += `- **项目**: ${airdrop.projectName}\n`;
  md += `- **类型**: ${airdrop.type || '空投'}\n`;
  if (airdrop.totalValue) {
    md += `- **总价值**: ${airdrop.totalValue}\n`;
  }
  if (airdrop.tokenSymbol) {
    md += `- **代币**: ${airdrop.tokenSymbol}\n`;
  }
  if (airdrop.blockchain && airdrop.blockchain.length > 0) {
    md += `- **支持链**: ${airdrop.blockchain.join(', ')}\n`;
  }
  if (airdrop.endDate) {
    md += `- **结束时间**: ${new Date(airdrop.endDate).toLocaleDateString('zh-CN')}\n`;
  }
  md += `\n`;

  // 项目介绍
  if (airdrop.description) {
    md += `## 📖 项目介绍\n\n`;
    md += `${airdrop.description}\n\n`;
  }

  // 参与方式
  md += `## 📋 参与方式\n\n`;
  if (airdrop.steps && airdrop.steps.length > 0) {
    airdrop.steps.forEach((step, i) => {
      md += `### ${i + 1}. ${step.title}\n\n`;
      md += `${step.description}\n\n`;
    });
  } else {
    md += `请访问项目官网或 CoinMarketCap 查看详细参与步骤。\n\n`;
  }

  // 相关链接
  md += `## 🔗 相关链接\n\n`;
  if (airdrop.projectUrl) {
    md += `- [项目官网](${airdrop.projectUrl})\n`;
  }
  if (airdrop.cmcUrl) {
    md += `- [CoinMarketCap 详情](${airdrop.cmcUrl})\n`;
  }
  md += `\n`;

  // 风险提示
  md += `## ⚠️ 风险提示\n\n`;
  md += `- 请确保访问官方网站，避免钓鱼链接\n`;
  md += `- 不要分享私钥或助记词\n`;
  md += `- 注意空投的真实性，谨防诈骗\n`;
  md += `- 本信息仅供参考，不构成投资建议\n\n`;

  // 数据来源
  md += `## 📊 数据来源\n\n`;
  md += `本信息来自 CoinMarketCap，最后更新于 ${new Date().toLocaleDateString('zh-CN')}\n`;

  return md;
}

async function convertAirdropToStrategy(airdrop, categoryId) {
  const chains = airdrop.blockchain || [];
  const tags = [
    '空投',
    airdrop.type || 'airdrop',
    ...(airdrop.tags || []),
    ...(chains.length > 0 ? [chains[0]] : [])
  ].slice(0, 5); // 最多 5 个标签

  return {
    title: airdrop.name,
    slug: generateSlug(airdrop.name),
    summary: (airdrop.description || airdrop.name).substring(0, 200),
    content: generateAirdropMarkdown(airdrop),
    cover_image: airdrop.logo || null,

    // 分类
    category_l1: 'airdrops-early',
    category: categoryId,

    // 难度和风险
    risk_level: calculateRiskLevel(airdrop.qualityScore || 50),
    threshold_tech_level: airdrop.difficulty || 'beginner',
    time_commitment_minutes: parseTimeToMinutes(airdrop.estimatedTime),

    // 链和协议
    chains: chains.slice(0, 3), // 最多 3 条链
    protocols: [airdrop.projectName || airdrop.name],
    tags: tags,

    // 数据来源
    source_name: 'CoinMarketCap',
    source_url: airdrop.cmcUrl || `https://coinmarketcap.com/airdrop/${airdrop.id}`,
    source_credibility: airdrop.qualityScore || 70,

    // 状态
    status: 'published',
    published_at: airdrop.startDate || new Date().toISOString(),

    // 统计
    view_count: 0,
    bookmark_count: 0
  };
}

// ==================== 抓取函数 ====================

async function fetchCMCAirdrops() {
  console.log('📡 Fetching airdrops from CoinMarketCap...\n');

  try {
    // CMC 的公开 API
    const response = await axios.get(CMC_AIRDROP_URL, {
      params: {
        start: 1,
        limit: 20,
        status: 'ONGOING',  // 只获取进行中的
        sort: 'START_DATE',
        sortDir: 'desc'
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      },
      timeout: 30000
    });

    if (!response.data || !response.data.data) {
      console.log('⚠️  No data returned from CMC');
      return [];
    }

    const airdrops = response.data.data.airdropList || response.data.data || [];
    console.log(`✅ Found ${airdrops.length} airdrops\n`);

    return airdrops;
  } catch (error) {
    if (error.response) {
      console.error(`❌ CMC API error: ${error.response.status} - ${error.response.statusText}`);
      console.error('   Response:', JSON.stringify(error.response.data).substring(0, 200));
    } else {
      console.error(`❌ Request failed: ${error.message}`);
    }
    return [];
  }
}

// ==================== 主函数 ====================

async function scrapeAirdrops() {
  console.log('🚀 Starting CoinMarketCap Airdrops Scraper...\n');

  try {
    // Step 1: 获取空投数据
    const airdrops = await fetchCMCAirdrops();

    if (airdrops.length === 0) {
      console.log('⚠️  No airdrops to process');
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

    // Step 4: 处理每个空投
    console.log('💾 Processing airdrops...\n');

    let successCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (let i = 0; i < Math.min(10, airdrops.length); i++) {
      const airdrop = airdrops[i];

      try {
        // 解析数据
        const parsed = {
          id: airdrop.id,
          name: airdrop.name || airdrop.title || 'Unnamed Airdrop',
          projectName: airdrop.projectName || airdrop.name,
          description: airdrop.description || airdrop.desc || '',
          type: airdrop.type || 'task',
          logo: airdrop.logo || airdrop.image,
          blockchain: Array.isArray(airdrop.blockchain)
            ? airdrop.blockchain
            : (airdrop.blockchain ? [airdrop.blockchain] : []),
          totalValue: airdrop.totalReward || airdrop.value,
          tokenSymbol: airdrop.symbol,
          startDate: airdrop.startDate,
          endDate: airdrop.endDate,
          projectUrl: airdrop.projectUrl || airdrop.website,
          cmcUrl: airdrop.url || `https://coinmarketcap.com/airdrop/${airdrop.id}`,
          qualityScore: airdrop.score || 70,
          difficulty: airdrop.difficulty || 'beginner',
          estimatedTime: airdrop.timeRequired || '1小时',
          steps: airdrop.steps || [],
          tags: airdrop.tags || []
        };

        // 确定分类
        const categorySlug = mapAirdropTypeToCategory(parsed.type);
        const categoryId = await getCategoryId(categorySlug, token);

        if (!categoryId) {
          console.log(`⚠️  Category not found: ${categorySlug}, skipping: ${parsed.name}`);
          skippedCount++;
          continue;
        }

        // 转换为 strategy 格式
        const strategy = await convertAirdropToStrategy(parsed, categoryId);

        // 检查是否已存在
        const existingCheck = await axios.get(
          `${DIRECTUS_URL}/items/strategies?filter[title][_eq]=${encodeURIComponent(strategy.title)}`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );

        if (existingCheck.data.data.length > 0) {
          console.log(`⏭️  Skipped: ${strategy.title} (already exists)`);
          skippedCount++;
          continue;
        }

        // 保存到 Directus
        await axios.post(
          `${DIRECTUS_URL}/items/strategies`,
          strategy,
          { headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }}
        );

        console.log(`✅ Saved: ${strategy.title} → ${categorySlug}`);
        successCount++;

      } catch (error) {
        console.error(`❌ Error processing: ${airdrop.name || 'Unknown'}`);
        console.error(`   ${error.response?.data?.errors?.[0]?.message || error.message}`);
        errorCount++;
      }
    }

    console.log('\n' + '='.repeat(80));
    console.log('✅ CoinMarketCap Airdrops scraping complete!');
    console.log(`   Total processed: ${Math.min(10, airdrops.length)}`);
    console.log(`   Saved: ${successCount}`);
    console.log(`   Skipped: ${skippedCount}`);
    console.log(`   Errors: ${errorCount}`);
    console.log('='.repeat(80) + '\n');

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
