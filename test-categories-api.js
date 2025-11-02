const http = require('http');

http.get('http://localhost:8055/items/playnew_categories?fields=name,slug,type&limit=50&sort=order_index', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const json = JSON.parse(data);
    console.log('✅ API Response Received\n');
    console.log(`📊 Total categories: ${json.data.length}`);

    const parents = json.data.filter(c => c.type === 'parent');
    const children = json.data.filter(c => c.type !== 'parent');

    console.log(`\n🗂️  Parent categories: ${parents.length}`);
    parents.forEach(p => console.log(`  - ${p.name} (${p.slug})`));

    console.log(`\n📑 Child categories: ${children.length}`);
    console.log('  (First 10 shown)');
    children.slice(0, 10).forEach(c => console.log(`  - ${c.name} (${c.slug})`));

    console.log(`\n✅ Categories successfully accessible via Directus API!`);
  });
}).on('error', (err) => {
  console.error('❌ Error:', err.message);
});
