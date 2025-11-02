#!/usr/bin/env node

/**
 * Configure Directus Collection Metadata
 * Adds Chinese labels, icons, display templates, and archive settings
 */

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_EMAIL = 'the_uk1@outlook.com';
const DIRECTUS_PASSWORD = 'Mygcdjmyxzg2026!';

const collectionMetadata = {
  strategies: {
    icon: 'lightbulb',
    note: '玩法库 - 各种加密货币玩法策略',
    display_template: '{{title}}',
    archive_field: 'status',
    archive_value: 'archived',
    unarchive_value: 'published',
    sort_field: 'published_at',
    translations: [
      { language: 'zh-CN', translation: '玩法库', singular: '玩法', plural: '玩法' }
    ]
  },
  news: {
    icon: 'article',
    note: '资讯 - 加密货币相关新闻资讯',
    display_template: '{{title}}',
    archive_field: 'status',
    archive_value: 'archived',
    unarchive_value: 'published',
    sort_field: 'published_at',
    translations: [
      { language: 'zh-CN', translation: '资讯', singular: '资讯', plural: '资讯' }
    ]
  },
  service_providers: {
    icon: 'business',
    note: '服务商 - 交易所、钱包等服务提供商',
    display_template: '{{name}}',
    archive_field: 'status',
    archive_value: 'inactive',
    unarchive_value: 'active',
    sort_field: 'name',
    translations: [
      { language: 'zh-CN', translation: '服务商', singular: '服务商', plural: '服务商' }
    ]
  },
  categories: {
    icon: 'folder',
    note: '分类 - 内容分类标签',
    display_template: '{{name}}',
    sort_field: 'order_index',
    translations: [
      { language: 'zh-CN', translation: '分类', singular: '分类', plural: '分类' }
    ]
  },
  tags: {
    icon: 'label',
    note: '标签 - 内容标签',
    display_template: '{{name}}',
    sort_field: 'name',
    translations: [
      { language: 'zh-CN', translation: '标签', singular: '标签', plural: '标签' }
    ]
  },
  users: {
    icon: 'person',
    note: '用户 - 平台用户',
    display_template: '{{username}}',
    sort_field: 'created_at',
    translations: [
      { language: 'zh-CN', translation: '用户', singular: '用户', plural: '用户' }
    ]
  },
  user_interactions: {
    icon: 'thumb_up',
    note: '用户交互 - 点赞、收藏等',
    display_template: '{{user_id}} - {{action}}',
    sort_field: 'created_at',
    translations: [
      { language: 'zh-CN', translation: '用户交互', singular: '交互', plural: '交互' }
    ]
  },
  comments: {
    icon: 'comment',
    note: '评论 - 用户评论',
    display_template: '{{text}}',
    archive_field: 'status',
    archive_value: 'hidden',
    unarchive_value: 'published',
    sort_field: 'created_at',
    translations: [
      { language: 'zh-CN', translation: '评论', singular: '评论', plural: '评论' }
    ]
  },
  chains: {
    icon: 'link',
    note: '区块链 - 支持的区块链网络',
    display_template: '{{name}}',
    sort_field: 'name',
    translations: [
      { language: 'zh-CN', translation: '区块链', singular: '链', plural: '链' }
    ]
  },
  protocols: {
    icon: 'hub',
    note: '协议 - DeFi协议',
    display_template: '{{name}}',
    archive_field: 'is_active',
    archive_value: false,
    unarchive_value: true,
    sort_field: 'name',
    translations: [
      { language: 'zh-CN', translation: '协议', singular: '协议', plural: '协议' }
    ]
  }
};

async function login() {
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
    throw new Error('Login failed');
  }

  const data = await response.json();
  return data.data.access_token;
}

async function updateCollectionMeta(token, collection, meta) {
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
    console.error(`  ❌ Failed: ${error.substring(0, 100)}`);
    return false;
  }

  return true;
}

async function main() {
  try {
    console.log('');
    console.log('================================================');
    console.log('  Configure Collection Metadata');
    console.log('================================================');
    console.log('');

    console.log('🔐 Logging in...\n');
    const token = await login();

    let updated = 0;
    let failed = 0;

    for (const [collection, meta] of Object.entries(collectionMetadata)) {
      console.log(`📝 Configuring: ${collection}`);
      const success = await updateCollectionMeta(token, collection, meta);

      if (success) {
        console.log(`  ✅ Updated`);
        updated++;
      } else {
        failed++;
      }
    }

    console.log('');
    console.log('================================================');
    console.log('📊 Summary:');
    console.log(`  ✅ Updated: ${updated} collections`);
    console.log(`  ❌ Failed: ${failed} collections`);
    console.log('================================================');
    console.log('');
    console.log('🎉 Configuration complete!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Visit http://localhost:8055/admin/content');
    console.log('2. You should see all collections with Chinese labels');
    console.log('3. Click on each collection to view and manage data');
    console.log('');

  } catch (error) {
    console.error('');
    console.error('❌ Error:', error.message);
    console.error('');
    process.exit(1);
  }
}

main();
