/**
 * Test n8n RSS Feed Field Names
 *
 * This script helps identify what field names your RSS feed is actually using.
 * Run this to see the actual field structure from your RSS source.
 */

const Parser = require('rss-parser');
const parser = new Parser();

const RSS_FEEDS = [
  'https://www.coindesk.com/arc/outboundfeeds/rss/',
  'https://cointelegraph.com/rss',
  'https://www.theblock.co/rss.xml'
];

async function testRSSFields() {
  console.log('🔍 Testing RSS Feed Field Names\n');
  console.log('=' .repeat(80));

  for (const feedUrl of RSS_FEEDS) {
    try {
      console.log(`\n📡 Testing: ${feedUrl}`);
      console.log('-'.repeat(80));

      const feed = await parser.parseURL(feedUrl);

      if (feed.items && feed.items.length > 0) {
        const firstItem = feed.items[0];

        console.log(`\n✅ Found ${feed.items.length} items`);
        console.log(`\n📋 Available fields in first item:`);
        console.log('-'.repeat(40));

        Object.keys(firstItem).forEach(key => {
          const value = firstItem[key];
          const preview = typeof value === 'string'
            ? value.substring(0, 60) + (value.length > 60 ? '...' : '')
            : JSON.stringify(value).substring(0, 60);

          console.log(`  ${key.padEnd(20)} : ${preview}`);
        });

        // Check which content fields exist
        console.log(`\n🎯 Content field analysis:`);
        console.log('-'.repeat(40));

        const contentFields = ['content', 'contentSnippet', 'description', 'summary', 'content:encoded'];
        contentFields.forEach(field => {
          if (firstItem[field]) {
            const length = firstItem[field].length || 0;
            console.log(`  ✅ ${field.padEnd(20)} : ${length} characters`);
          } else {
            console.log(`  ❌ ${field.padEnd(20)} : NOT FOUND`);
          }
        });

        // Recommended mapping
        console.log(`\n💡 Recommended n8n expression:`);
        console.log('-'.repeat(40));

        let recommendedField = 'content';
        if (firstItem.content) recommendedField = 'content';
        else if (firstItem.contentSnippet) recommendedField = 'contentSnippet';
        else if (firstItem.description) recommendedField = 'description';
        else if (firstItem.summary) recommendedField = 'summary';
        else if (firstItem['content:encoded']) recommendedField = 'content:encoded';

        console.log(`  "text": "{{$json.${recommendedField}}}"`);
        console.log(`  "title": "{{$json.title}}"`);

      } else {
        console.log('  ⚠️  No items found in feed');
      }

    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`);
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('\n✅ Test complete!\n');
  console.log('📝 Use the recommended expressions in your n8n HTTP Request node.\n');
}

// Run the test
testRSSFields().catch(console.error);
