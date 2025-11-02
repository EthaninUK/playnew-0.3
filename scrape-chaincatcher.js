/**
 * ChainCatcher News Flash Scraper
 *
 * 抓取链捕手快讯并保存到 Directus
 */

const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_EMAIL = 'the_uk1@outlook.com';
const DIRECTUS_PASSWORD = 'Mygcdjmyxzg2026!';

async function getDirectusToken() {
  try {
    const response = await axios.post(`${DIRECTUS_URL}/auth/login`, {
      email: DIRECTUS_EMAIL,
      password: DIRECTUS_PASSWORD
    });
    return response.data.data.access_token;
  } catch (error) {
    console.error('❌ Failed to login to Directus:', error.message);
    throw error;
  }
}

async function scrapeChainCatcher() {
  console.log('🚀 Starting ChainCatcher scraper...\n');

  try {
    // Step 1: Fetch the page
    console.log('📡 Fetching ChainCatcher news page...');
    const response = await axios.get('https://www.chaincatcher.com/news', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    });

    const html = response.data;
    console.log('✅ Page fetched successfully\n');

    // Step 2: Extract window.__NUXT__ data
    console.log('🔍 Extracting news flash data...');

    // Find the function parameters (these are the actual values)
    const paramsMatch = html.match(/\)\((.*?)\);?\s*<\/script>/);
    if (!paramsMatch) {
      throw new Error('Could not find function parameters');
    }

    // Parse the parameters
    const paramsString = paramsMatch[1];
    const params = [];
    let currentParam = '';
    let inString = false;
    let depth = 0;

    for (let i = 0; i < paramsString.length; i++) {
      const char = paramsString[i];

      if (char === '"' && paramsString[i-1] !== '\\') {
        inString = !inString;
        currentParam += char;
      } else if (!inString && (char === '[' || char === '{')) {
        depth++;
        currentParam += char;
      } else if (!inString && (char === ']' || char === '}')) {
        depth--;
        currentParam += char;
      } else if (!inString && char === ',' && depth === 0) {
        params.push(currentParam.trim());
        currentParam = '';
      } else {
        currentParam += char;
      }
    }
    if (currentParam) params.push(currentParam.trim());

    // Create a mapping of variables to values
    const varMap = {};
    const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    for (let i = 0; i < Math.min(letters.length, params.length); i++) {
      let value = params[i];
      // Remove quotes from strings
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      // Convert numbers
      if (!isNaN(value) && value !== '') {
        value = Number(value);
      }
      // Convert booleans
      if (value === 'true') value = true;
      if (value === 'false') value = false;
      if (value === 'void 0' || value === 'undefined') value = undefined;
      if (value === 'null') value = null;

      varMap[letters[i]] = value;
    }

    console.log('📊 Variable mapping created:', Object.keys(varMap).length, 'variables');

    // Extract newsFlashList structure
    const newsFlashMatch = html.match(/newsFlashList:\[(\{[^\]]+\}(?:,\{[^\]]+\})*)\]/);
    if (!newsFlashMatch) {
      throw new Error('Could not find newsFlashList');
    }

    // Parse the news flash items manually
    const newsFlashString = newsFlashMatch[1];
    const items = [];

    // Split by },{
    const itemStrings = newsFlashString.split(/\},\{/);

    for (let i = 0; i < Math.min(10, itemStrings.length); i++) {
      let itemStr = itemStrings[i];
      if (!itemStr.startsWith('{')) itemStr = '{' + itemStr;
      if (!itemStr.endsWith('}')) itemStr = itemStr + '}';

      // Extract fields using regex
      const titleMatch = itemStr.match(/title:"([^"]+)"/);
      const descMatch = itemStr.match(/description:"([^"]+)"/);
      const idMatch = itemStr.match(/id:(\d+)/);
      const timeMatch = itemStr.match(/releaseTime:([a-zA-Z])/);
      const keywordsMatch = itemStr.match(/keywords:"([^"]+)"/);

      if (!titleMatch || !descMatch) continue;

      const title = titleMatch[1];
      const description = descMatch[1];
      const articleId = idMatch ? idMatch[1] : `temp-${Date.now()}-${i}`;
      const timeVar = timeMatch ? timeMatch[1] : null;
      const releaseTime = timeVar && varMap[timeVar] ? varMap[timeVar] : new Date().toISOString();
      const keywords = keywordsMatch ? keywordsMatch[1] : '';

      // Extract source from description
      let source = 'ChainCatcher';
      const sourceMatch = description.match(/据\s*([A-Za-z0-9\s]+)\s*(?:数据|报道|消息)/);
      if (sourceMatch) {
        source = sourceMatch[1].trim();
      }

      items.push({
        id: articleId,
        title: title,
        content: description,
        summary: description.length > 200 ? description.substring(0, 197) + '...' : description,
        slug: `chaincatcher-${articleId}`,
        url: `https://www.chaincatcher.com/article/${articleId}`,
        published_at: releaseTime,
        source: source,
        category: 'news',
        status: 'published',
        view_count: 0,
        is_featured: false,
        keywords: keywords
      });
    }

    console.log(`✅ Extracted ${items.length} news flash items\n`);

    // Step 3: Login to Directus
    console.log('🔐 Logging in to Directus...');
    const token = await getDirectusToken();
    console.log('✅ Logged in successfully\n');

    // Step 4: Save to Directus
    console.log('💾 Saving items to Directus...\n');
    let successCount = 0;
    let errorCount = 0;

    for (const item of items) {
      try {
        // Check if item already exists
        const checkResponse = await axios.get(
          `${DIRECTUS_URL}/items/news?filter[slug][_eq]=${item.slug}`,
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );

        if (checkResponse.data.data.length > 0) {
          console.log(`⏭️  Skipping: ${item.title.substring(0, 50)}... (already exists)`);
          continue;
        }

        // Create new item
        await axios.post(
          `${DIRECTUS_URL}/items/news`,
          item,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        console.log(`✅ Saved: ${item.title}`);
        successCount++;
      } catch (error) {
        console.error(`❌ Error saving: ${item.title}`);
        console.error(`   Details: ${error.response?.data?.errors?.[0]?.message || error.message}`);
        errorCount++;
      }
    }

    console.log('\n' + '='.repeat(80));
    console.log(`✅ Scraping complete!`);
    console.log(`   Total items: ${items.length}`);
    console.log(`   Saved: ${successCount}`);
    console.log(`   Errors: ${errorCount}`);
    console.log('='.repeat(80));

  } catch (error) {
    console.error('❌ Scraping failed:', error.message);
    if (error.response) {
      console.error('   Response:', error.response.data);
    }
    throw error;
  }
}

// Run the scraper
if (require.main === module) {
  scrapeChainCatcher().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { scrapeChainCatcher };
