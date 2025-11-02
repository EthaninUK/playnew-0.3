const http = require('http');

// Test a few categories
const testCategories = [
  { slug: 'testnet', expected: 2 },
  { slug: 'airdrop-tasks', expected: 5 },
  { slug: 'lending', expected: 4 },
  { slug: 'amm', expected: 6 }
];

async function testCategory(slug) {
  return new Promise((resolve) => {
    http.get(`http://localhost:8055/items/strategies?filter[category][_eq]=${slug}&filter[status][_eq]=published&fields=id,title`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ slug, count: json.data.length });
        } catch (e) {
          resolve({ slug, count: 0, error: e.message });
        }
      });
    }).on('error', (err) => {
      resolve({ slug, count: 0, error: err.message });
    });
  });
}

async function runTests() {
  console.log('🧪 Testing category filtering...\n');

  for (const test of testCategories) {
    const result = await testCategory(test.slug);

    if (result.error) {
      console.log(`❌ ${test.slug}: Error - ${result.error}`);
    } else if (result.count === test.expected) {
      console.log(`✅ ${test.slug}: ${result.count} strategies (expected ${test.expected})`);
    } else {
      console.log(`⚠️  ${test.slug}: ${result.count} strategies (expected ${test.expected})`);
    }
  }

  console.log('\n✅ Category filtering test completed!');
}

runTests();
