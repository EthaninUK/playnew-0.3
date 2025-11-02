#!/usr/bin/env node

/**
 * Sync Directus Collections with existing PostgreSQL tables
 * This tells Directus to read the actual table schema from the database
 */

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_EMAIL = 'the_uk1@outlook.com';
const DIRECTUS_PASSWORD = 'Mygcdjmyxzg2026!';

const collections = [
  'strategies',
  'news',
  'service_providers',
  'categories',
  'tags',
  'users',
  'user_interactions',
  'comments',
  'chains',
  'protocols',
  'strategy_tags',
  'news_tags'
];

async function login() {
  console.log('🔐 Logging in to Directus...');
  const response = await fetch(`${DIRECTUS_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: DIRECTUS_EMAIL,
      password: DIRECTUS_PASSWORD,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Login failed: ${error}`);
  }

  const data = await response.json();
  console.log('✅ Login successful');
  return data.data.access_token;
}

async function deleteCollection(token, collection) {
  console.log(`  🗑️  Deleting Directus collection: ${collection}...`);

  const response = await fetch(`${DIRECTUS_URL}/collections/${collection}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok && response.status !== 404) {
    const error = await response.text();
    console.error(`  ⚠️  Failed to delete ${collection}:`, error);
    return false;
  }

  return true;
}

async function importCollection(token, collection) {
  console.log(`  📥 Importing database table: ${collection}...`);

  // When we create a collection with the same name as a database table,
  // Directus will automatically import the schema from the database
  const response = await fetch(`${DIRECTUS_URL}/collections`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      collection: collection,
      meta: {
        hidden: false
      },
      schema: {}  // Empty schema tells Directus to read from database
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`  ❌ Failed to import ${collection}:`, error);
    return false;
  }

  console.log(`  ✅ Imported ${collection}`);
  return true;
}

async function updateCollectionMeta(token, collection, meta) {
  console.log(`  📝 Updating metadata for: ${collection}...`);

  const response = await fetch(`${DIRECTUS_URL}/collections/${collection}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ meta }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`  ⚠️  Failed to update metadata for ${collection}:`, error);
    return false;
  }

  return true;
}

const collectionMeta = {
  strategies: {
    icon: 'lightbulb',
    note: '玩法库 - 各种加密货币玩法策略',
    display_template: '{{title}}',
    archive_field: 'status',
    archive_value: 'archived',
    unarchive_value: 'published',
    sort_field: 'sort'
  },
  news: {
    icon: 'article',
    note: '资讯 - 加密货币相关新闻资讯',
    display_template: '{{title}}',
    archive_field: 'status',
    archive_value: 'archived',
    unarchive_value: 'published',
    sort_field: 'published_at'
  },
  service_providers: {
    icon: 'business',
    note: '服务商 - 交易所、钱包等服务提供商',
    display_template: '{{name}}',
    archive_field: 'status',
    archive_value: 'inactive',
    unarchive_value: 'active',
    sort_field: 'name'
  },
  categories: {
    icon: 'folder',
    note: '分类 - 内容分类标签',
    display_template: '{{name}}',
    sort_field: 'order_index'
  },
  tags: {
    icon: 'label',
    note: '标签 - 内容标签',
    display_template: '{{name}}',
    sort_field: 'name'
  },
  users: {
    icon: 'person',
    note: '用户 - 平台用户',
    display_template: '{{username}} ({{email}})',
    archive_field: 'status',
    archive_value: 'suspended',
    unarchive_value: 'active',
    sort_field: 'created_at'
  },
  user_interactions: {
    icon: 'thumb_up',
    note: '用户交互 - 点赞、收藏等',
    display_template: '{{user_id}} - {{interaction_type}} - {{target_type}}',
    sort_field: 'created_at'
  },
  comments: {
    icon: 'comment',
    note: '评论 - 用户评论',
    display_template: '{{content}}',
    archive_field: 'status',
    archive_value: 'hidden',
    unarchive_value: 'published',
    sort_field: 'created_at'
  },
  chains: {
    icon: 'link',
    note: '区块链 - 支持的区块链网络',
    display_template: '{{name}} ({{symbol}})',
    sort_field: 'name'
  },
  protocols: {
    icon: 'hub',
    note: '协议 - DeFi协议',
    display_template: '{{name}}',
    archive_field: 'status',
    archive_value: 'inactive',
    unarchive_value: 'active',
    sort_field: 'name'
  },
  strategy_tags: {
    icon: 'join_inner',
    note: '玩法标签关联',
    hidden: true
  },
  news_tags: {
    icon: 'join_inner',
    note: '资讯标签关联',
    hidden: true
  }
};

async function main() {
  try {
    console.log('');
    console.log('================================================');
    console.log('  Sync Directus with PostgreSQL Database');
    console.log('================================================');
    console.log('');

    const token = await login();
    console.log('');

    let synced = 0;
    let failed = 0;

    for (const collection of collections) {
      console.log(`🔄 Syncing: ${collection}`);

      // Delete existing Directus collection (if it exists)
      await deleteCollection(token, collection);

      // Import the table from database
      const importSuccess = await importCollection(token, collection);

      if (importSuccess) {
        // Update metadata if available
        const meta = collectionMeta[collection];
        if (meta) {
          await updateCollectionMeta(token, collection, meta);
        }
        synced++;
      } else {
        failed++;
      }

      console.log('');
    }

    console.log('================================================');
    console.log('📊 Summary:');
    console.log(`  ✅ Synced: ${synced} collections`);
    console.log(`  ❌ Failed: ${failed} collections`);
    console.log('================================================');
    console.log('');
    console.log('🎉 Database sync complete!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Visit http://localhost:8055/admin/settings/data-model');
    console.log('2. All collections should now show their actual database fields');
    console.log('3. Configure field display settings as needed');
    console.log('4. Set up permissions in Settings → Access Control');
    console.log('');

  } catch (error) {
    console.error('');
    console.error('❌ Error:', error.message);
    console.error('');
    process.exit(1);
  }
}

main();
