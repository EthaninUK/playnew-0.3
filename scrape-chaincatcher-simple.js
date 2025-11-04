/**
 * ChainCatcher News Flash Scraper (Simplified)
 *
 * 直接从 window.__NUXT__ 中提取 newsFlashList 数据
 */

const axios = require('axios');
const vm = require('vm');

// Support both local and production environments
const DIRECTUS_URL = process.env.DIRECTUS_URL || 'http://localhost:8055';
const DIRECTUS_EMAIL = process.env.DIRECTUS_EMAIL || 'the_uk1@outlook.com';
const DIRECTUS_PASSWORD = process.env.DIRECTUS_PASSWORD || 'Mygcdjmyxzg2026!';

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

    // Step 2: Extract and execute window.__NUXT__
    console.log('🔍 Extracting news flash data...');

    // Find the window.__NUXT__ script
    const scriptMatch = html.match(/window\.__NUXT__=(.*?);?\s*<\/script>/s);
    if (!scriptMatch) {
      throw new Error('Could not find window.__NUXT__ script');
    }

    const scriptCode = scriptMatch[1];

    // Execute the script in a sandbox to get the data
    const sandbox = { window: {} };
    vm.createContext(sandbox);

    try {
      vm.runInContext(`window.__NUXT__ = ${scriptCode}`, sandbox);
    } catch (e) {
      console.error('❌ Error executing script:', e.message);
      throw new Error('Failed to execute window.__NUXT__ script');
    }

    const nuxtData = sandbox.window.__NUXT__;
    if (!nuxtData || !nuxtData.data || !nuxtData.data[0] || !nuxtData.data[0].newsFlashList) {
      throw new Error('Could not find newsFlashList in window.__NUXT__');
    }

    const newsFlashList = nuxtData.data[0].newsFlashList;
    console.log(`✅ Found ${newsFlashList.length} news flash items\n`);

    // Step 3: Process items (take first 10)
    const items = [];
    const maxItems = Math.min(10, newsFlashList.length);

    for (let i = 0; i < maxItems; i++) {
      const item = newsFlashList[i];

      // Extract source from description
      let source = 'ChainCatcher';
      if (item.description) {
        const sourceMatch = item.description.match(/据\s*([A-Za-z0-9\s\.]+)\s*(?:数据|报道|消息|官方)/);
        if (sourceMatch) {
          source = sourceMatch[1].trim();
        }
      }

      // Format published_at
      let publishedAt = item.releaseTime || item.createTime || new Date().toISOString();
      // Convert from "2025-10-27 00:17:04" to ISO format
      if (publishedAt && !publishedAt.includes('T')) {
        publishedAt = publishedAt.replace(' ', 'T') + '.000Z';
      }

      const processedItem = {
        // Don't send 'id' - let Directus auto-generate UUID
        title: item.title || 'Untitled',
        content: item.description || item.title || '',
        summary: (item.description || item.title || '').length > 200
          ? (item.description || item.title).substring(0, 197) + '...'
          : (item.description || item.title),
        // Don't send 'slug' if it has permission issues - let Directus auto-generate
        url: `https://www.chaincatcher.com/article/${item.id}`,
        published_at: publishedAt,
        source: source,
        source_type: 'rss',  // Required field - use 'rss' for compatibility
        category: 'news',
        status: 'published',
        view_count: 0,
        is_featured: item.isHot === 1
        // Don't send 'keywords' if field doesn't exist
      };

      items.push(processedItem);

      console.log(`📰 [${i + 1}] ${processedItem.title.substring(0, 60)}...`);
    }

    console.log('');

    // Step 4: Login to Directus
    console.log('🔐 Logging in to Directus...');
    const token = await getDirectusToken();
    console.log('✅ Logged in successfully\n');

    // Step 5: Save to Directus
    console.log('💾 Saving items to Directus...\n');
    let successCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const item of items) {
      try {
        // Check if item already exists by title (more reliable than slug)
        const checkResponse = await axios.get(
          `${DIRECTUS_URL}/items/news?filter[title][_eq]=${encodeURIComponent(item.title)}`,
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );

        if (checkResponse.data.data.length > 0) {
          console.log(`⏭️  Skipped: ${item.title.substring(0, 50)}... (exists)`);
          skippedCount++;
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

        console.log(`✅ Saved: ${item.title.substring(0, 60)}...`);
        successCount++;
      } catch (error) {
        console.error(`❌ Error: ${item.title.substring(0, 50)}...`);
        console.error(`   ${error.response?.data?.errors?.[0]?.message || error.message}`);
        errorCount++;
      }
    }

    console.log('\n' + '='.repeat(80));
    console.log(`✅ ChainCatcher scraping complete!`);
    console.log(`   Total items: ${items.length}`);
    console.log(`   Saved: ${successCount}`);
    console.log(`   Skipped: ${skippedCount}`);
    console.log(`   Errors: ${errorCount}`);
    console.log('='.repeat(80) + '\n');

    return {
      total: items.length,
      saved: successCount,
      skipped: skippedCount,
      errors: errorCount
    };

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
    console.error('\n💥 Fatal error:', error.message);
    process.exit(1);
  });
}

module.exports = { scrapeChainCatcher };
