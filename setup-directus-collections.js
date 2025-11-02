#!/usr/bin/env node

/**
 * Batch configure Directus Collections
 * Maps existing Supabase tables to Directus Collections with proper configuration
 */

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_EMAIL = 'the_uk1@outlook.com';
const DIRECTUS_PASSWORD = 'Mygcdjmyxzg2026!';

// Collection configurations
const collections = [
  {
    collection: 'strategies',
    meta: {
      collection: 'strategies',
      icon: 'lightbulb',
      note: '玩法库 - 各种加密货币玩法策略',
      display_template: '{{title}}',
      hidden: false,
      singleton: false,
      translations: null,
      archive_field: 'status',
      archive_value: 'archived',
      unarchive_value: 'published',
      sort_field: 'sort'
    },
    schema: {
      name: 'strategies'
    }
  },
  {
    collection: 'news',
    meta: {
      collection: 'news',
      icon: 'article',
      note: '资讯 - 加密货币相关新闻资讯',
      display_template: '{{title}}',
      hidden: false,
      singleton: false,
      translations: null,
      archive_field: 'status',
      archive_value: 'archived',
      unarchive_value: 'published',
      sort_field: 'published_at'
    },
    schema: {
      name: 'news'
    }
  },
  {
    collection: 'service_providers',
    meta: {
      collection: 'service_providers',
      icon: 'business',
      note: '服务商 - 交易所、钱包等服务提供商',
      display_template: '{{name}}',
      hidden: false,
      singleton: false,
      translations: null,
      archive_field: 'status',
      archive_value: 'inactive',
      unarchive_value: 'active',
      sort_field: 'name'
    },
    schema: {
      name: 'service_providers'
    }
  },
  {
    collection: 'categories',
    meta: {
      collection: 'categories',
      icon: 'folder',
      note: '分类 - 内容分类标签',
      display_template: '{{name}}',
      hidden: false,
      singleton: false,
      translations: null,
      sort_field: 'order_index'
    },
    schema: {
      name: 'categories'
    }
  },
  {
    collection: 'tags',
    meta: {
      collection: 'tags',
      icon: 'label',
      note: '标签 - 内容标签',
      display_template: '{{name}}',
      hidden: false,
      singleton: false,
      translations: null,
      sort_field: 'name'
    },
    schema: {
      name: 'tags'
    }
  },
  {
    collection: 'users',
    meta: {
      collection: 'users',
      icon: 'person',
      note: '用户 - 平台用户',
      display_template: '{{username}} ({{email}})',
      hidden: false,
      singleton: false,
      translations: null,
      archive_field: 'status',
      archive_value: 'suspended',
      unarchive_value: 'active',
      sort_field: 'created_at'
    },
    schema: {
      name: 'users'
    }
  },
  {
    collection: 'user_interactions',
    meta: {
      collection: 'user_interactions',
      icon: 'thumb_up',
      note: '用户交互 - 点赞、收藏等',
      display_template: '{{user_id}} - {{interaction_type}} - {{target_type}}',
      hidden: false,
      singleton: false,
      translations: null,
      sort_field: 'created_at'
    },
    schema: {
      name: 'user_interactions'
    }
  },
  {
    collection: 'comments',
    meta: {
      collection: 'comments',
      icon: 'comment',
      note: '评论 - 用户评论',
      display_template: '{{content}}',
      hidden: false,
      singleton: false,
      translations: null,
      archive_field: 'status',
      archive_value: 'hidden',
      unarchive_value: 'published',
      sort_field: 'created_at'
    },
    schema: {
      name: 'comments'
    }
  },
  {
    collection: 'chains',
    meta: {
      collection: 'chains',
      icon: 'link',
      note: '区块链 - 支持的区块链网络',
      display_template: '{{name}} ({{symbol}})',
      hidden: false,
      singleton: false,
      translations: null,
      sort_field: 'name'
    },
    schema: {
      name: 'chains'
    }
  },
  {
    collection: 'protocols',
    meta: {
      collection: 'protocols',
      icon: 'hub',
      note: '协议 - DeFi协议',
      display_template: '{{name}}',
      hidden: false,
      singleton: false,
      translations: null,
      archive_field: 'status',
      archive_value: 'inactive',
      unarchive_value: 'active',
      sort_field: 'name'
    },
    schema: {
      name: 'protocols'
    }
  },
  {
    collection: 'strategy_tags',
    meta: {
      collection: 'strategy_tags',
      icon: 'join_inner',
      note: '玩法标签关联',
      hidden: true,
      singleton: false
    },
    schema: {
      name: 'strategy_tags'
    }
  },
  {
    collection: 'news_tags',
    meta: {
      collection: 'news_tags',
      icon: 'join_inner',
      note: '资讯标签关联',
      hidden: true,
      singleton: false
    },
    schema: {
      name: 'news_tags'
    }
  }
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

async function getExistingCollections(token) {
  console.log('📋 Fetching existing collections...');
  const response = await fetch(`${DIRECTUS_URL}/collections`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch collections');
  }

  const data = await response.json();
  return data.data.map(c => c.collection);
}

async function createCollection(token, config) {
  const { collection, meta, schema } = config;

  console.log(`📦 Creating collection: ${collection}...`);

  const response = await fetch(`${DIRECTUS_URL}/collections`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      collection,
      meta,
      schema
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`❌ Failed to create collection ${collection}:`, error);
    return false;
  }

  console.log(`✅ Created collection: ${collection}`);
  return true;
}

async function updateCollectionMeta(token, collection, meta) {
  console.log(`📝 Updating metadata for: ${collection}...`);

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
    console.error(`⚠️  Failed to update metadata for ${collection}:`, error);
    return false;
  }

  console.log(`✅ Updated metadata for: ${collection}`);
  return true;
}

async function main() {
  try {
    console.log('');
    console.log('================================================');
    console.log('  Directus Collections Batch Configuration');
    console.log('================================================');
    console.log('');

    // Login
    const token = await login();
    console.log('');

    // Get existing collections
    const existingCollections = await getExistingCollections(token);
    console.log(`Found ${existingCollections.length} existing collections`);
    console.log('');

    let created = 0;
    let updated = 0;
    let skipped = 0;

    for (const config of collections) {
      const { collection, meta } = config;

      if (existingCollections.includes(collection)) {
        console.log(`ℹ️  Collection "${collection}" already exists, updating metadata...`);
        const success = await updateCollectionMeta(token, collection, meta);
        if (success) {
          updated++;
        } else {
          skipped++;
        }
      } else {
        const success = await createCollection(token, config);
        if (success) {
          created++;
        } else {
          skipped++;
        }
      }
      console.log('');
    }

    console.log('================================================');
    console.log('📊 Summary:');
    console.log(`  ✅ Created: ${created}`);
    console.log(`  📝 Updated: ${updated}`);
    console.log(`  ⏭️  Skipped: ${skipped}`);
    console.log('================================================');
    console.log('');
    console.log('🎉 Batch configuration complete!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Visit http://localhost:8055/admin/settings/data-model');
    console.log('2. Review and configure individual fields');
    console.log('3. Set up permissions in Settings → Access Control');
    console.log('');

  } catch (error) {
    console.error('');
    console.error('❌ Error:', error.message);
    console.error('');
    process.exit(1);
  }
}

main();
