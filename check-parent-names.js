const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.cujpgrzjmmttysphjknu:bi3d8FpBFTUWuwOb@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

async function check() {
  await client.connect();
  const result = await client.query("SELECT name, slug FROM categories WHERE type = 'parent' ORDER BY order_index");
  console.log('Parent categories:');
  result.rows.forEach((row, i) => {
    console.log(`${i+1}. ${row.name} (${row.slug})`);
  });
  await client.end();
}

check();
