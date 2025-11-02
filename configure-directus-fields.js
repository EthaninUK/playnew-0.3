#!/usr/bin/env node

/**
 * Configure Directus Fields - Display names and interfaces
 * Makes the admin panel more user-friendly with Chinese labels
 */

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_EMAIL = 'the_uk1@outlook.com';
const DIRECTUS_PASSWORD = 'Mygcdjmyxzg2026!';

// Field configurations for each collection
const fieldConfigs = {
  strategies: [
    { field: 'id', meta: { hidden: true, readonly: true } },
    { field: 'title', meta: { interface: 'input', required: true, note: '玩法标题', translations: [{ language: 'zh-CN', translation: '标题' }] } },
    { field: 'slug', meta: { interface: 'input', required: true, note: 'URL友好的唯一标识', translations: [{ language: 'zh-CN', translation: 'URL标识' }] } },
    { field: 'content', meta: { interface: 'input-rich-text-html', note: '玩法详细内容', translations: [{ language: 'zh-CN', translation: '内容' }] } },
    { field: 'summary', meta: { interface: 'input-multiline', note: '玩法简介', translations: [{ language: 'zh-CN', translation: '简介' }] } },
    { field: 'difficulty', meta: { interface: 'select-dropdown', options: { choices: [{ text: '简单', value: 'easy' }, { text: '中等', value: 'medium' }, { text: '困难', value: 'hard' }] }, translations: [{ language: 'zh-CN', translation: '难度' }] } },
    { field: 'risk_level', meta: { interface: 'select-dropdown', options: { choices: [{ text: '低风险', value: 'low' }, { text: '中风险', value: 'medium' }, { text: '高风险', value: 'high' }] }, translations: [{ language: 'zh-CN', translation: '风险等级' }] } },
    { field: 'estimated_return', meta: { interface: 'input', note: '预期收益率', translations: [{ language: 'zh-CN', translation: '预期收益' }] } },
    { field: 'time_commitment', meta: { interface: 'input', note: '所需时间投入', translations: [{ language: 'zh-CN', translation: '时间投入' }] } },
    { field: 'initial_investment', meta: { interface: 'input', note: '初始投资金额', translations: [{ language: 'zh-CN', translation: '初始投资' }] } },
    { field: 'status', meta: { interface: 'select-dropdown', options: { choices: [{ text: '草稿', value: 'draft' }, { text: '已发布', value: 'published' }, { text: '已归档', value: 'archived' }] }, default_value: 'draft', translations: [{ language: 'zh-CN', translation: '状态' }] } },
    { field: 'featured', meta: { interface: 'boolean', default_value: false, translations: [{ language: 'zh-CN', translation: '推荐' }] } },
    { field: 'view_count', meta: { interface: 'input', readonly: true, default_value: 0, translations: [{ language: 'zh-CN', translation: '浏览量' }] } },
    { field: 'like_count', meta: { interface: 'input', readonly: true, default_value: 0, translations: [{ language: 'zh-CN', translation: '点赞数' }] } },
    { field: 'favorite_count', meta: { interface: 'input', readonly: true, default_value: 0, translations: [{ language: 'zh-CN', translation: '收藏数' }] } },
    { field: 'created_at', meta: { interface: 'datetime', readonly: true, special: ['date-created'], translations: [{ language: 'zh-CN', translation: '创建时间' }] } },
    { field: 'updated_at', meta: { interface: 'datetime', readonly: true, special: ['date-updated'], translations: [{ language: 'zh-CN', translation: '更新时间' }] } },
    { field: 'published_at', meta: { interface: 'datetime', translations: [{ language: 'zh-CN', translation: '发布时间' }] } }
  ],
  news: [
    { field: 'id', meta: { hidden: true, readonly: true } },
    { field: 'title', meta: { interface: 'input', required: true, translations: [{ language: 'zh-CN', translation: '标题' }] } },
    { field: 'slug', meta: { interface: 'input', required: true, translations: [{ language: 'zh-CN', translation: 'URL标识' }] } },
    { field: 'content', meta: { interface: 'input-rich-text-html', translations: [{ language: 'zh-CN', translation: '内容' }] } },
    { field: 'summary', meta: { interface: 'input-multiline', translations: [{ language: 'zh-CN', translation: '摘要' }] } },
    { field: 'source_url', meta: { interface: 'input', note: '原文链接', translations: [{ language: 'zh-CN', translation: '来源URL' }] } },
    { field: 'source_name', meta: { interface: 'input', note: '来源名称', translations: [{ language: 'zh-CN', translation: '来源' }] } },
    { field: 'author', meta: { interface: 'input', translations: [{ language: 'zh-CN', translation: '作者' }] } },
    { field: 'status', meta: { interface: 'select-dropdown', options: { choices: [{ text: '草稿', value: 'draft' }, { text: '已发布', value: 'published' }, { text: '已归档', value: 'archived' }] }, default_value: 'draft', translations: [{ language: 'zh-CN', translation: '状态' }] } },
    { field: 'importance', meta: { interface: 'select-dropdown', options: { choices: [{ text: '普通', value: 'normal' }, { text: '重要', value: 'important' }, { text: '紧急', value: 'urgent' }] }, default_value: 'normal', translations: [{ language: 'zh-CN', translation: '重要程度' }] } },
    { field: 'view_count', meta: { interface: 'input', readonly: true, default_value: 0, translations: [{ language: 'zh-CN', translation: '浏览量' }] } },
    { field: 'created_at', meta: { interface: 'datetime', readonly: true, special: ['date-created'], translations: [{ language: 'zh-CN', translation: '创建时间' }] } },
    { field: 'updated_at', meta: { interface: 'datetime', readonly: true, special: ['date-updated'], translations: [{ language: 'zh-CN', translation: '更新时间' }] } },
    { field: 'published_at', meta: { interface: 'datetime', translations: [{ language: 'zh-CN', translation: '发布时间' }] } }
  ],
  service_providers: [
    { field: 'id', meta: { hidden: true, readonly: true } },
    { field: 'name', meta: { interface: 'input', required: true, translations: [{ language: 'zh-CN', translation: '名称' }] } },
    { field: 'slug', meta: { interface: 'input', required: true, translations: [{ language: 'zh-CN', translation: 'URL标识' }] } },
    { field: 'type', meta: { interface: 'select-dropdown', options: { choices: [{ text: '交易所', value: 'exchange' }, { text: '钱包', value: 'wallet' }, { text: 'DeFi', value: 'defi' }, { text: '工具', value: 'tool' }, { text: '其他', value: 'other' }] }, required: true, translations: [{ language: 'zh-CN', translation: '类型' }] } },
    { field: 'description', meta: { interface: 'input-rich-text-html', translations: [{ language: 'zh-CN', translation: '描述' }] } },
    { field: 'website_url', meta: { interface: 'input', note: '官网链接', translations: [{ language: 'zh-CN', translation: '官网' }] } },
    { field: 'logo_url', meta: { interface: 'input', note: 'Logo图片URL', translations: [{ language: 'zh-CN', translation: 'Logo' }] } },
    { field: 'referral_url', meta: { interface: 'input', note: '推荐链接', translations: [{ language: 'zh-CN', translation: '推荐链接' }] } },
    { field: 'referral_code', meta: { interface: 'input', note: '推荐码', translations: [{ language: 'zh-CN', translation: '推荐码' }] } },
    { field: 'features', meta: { interface: 'list', note: '特色功能列表', translations: [{ language: 'zh-CN', translation: '特色功能' }] } },
    { field: 'supported_chains', meta: { interface: 'tags', note: '支持的区块链', translations: [{ language: 'zh-CN', translation: '支持链' }] } },
    { field: 'rating', meta: { interface: 'input', note: '评分 (0-5)', translations: [{ language: 'zh-CN', translation: '评分' }] } },
    { field: 'status', meta: { interface: 'select-dropdown', options: { choices: [{ text: '活跃', value: 'active' }, { text: '非活跃', value: 'inactive' }] }, default_value: 'active', translations: [{ language: 'zh-CN', translation: '状态' }] } },
    { field: 'created_at', meta: { interface: 'datetime', readonly: true, special: ['date-created'], translations: [{ language: 'zh-CN', translation: '创建时间' }] } },
    { field: 'updated_at', meta: { interface: 'datetime', readonly: true, special: ['date-updated'], translations: [{ language: 'zh-CN', translation: '更新时间' }] } }
  ],
  categories: [
    { field: 'id', meta: { hidden: true, readonly: true } },
    { field: 'name', meta: { interface: 'input', required: true, translations: [{ language: 'zh-CN', translation: '名称' }] } },
    { field: 'slug', meta: { interface: 'input', required: true, translations: [{ language: 'zh-CN', translation: 'URL标识' }] } },
    { field: 'type', meta: { interface: 'select-dropdown', options: { choices: [{ text: '玩法', value: 'play' }, { text: '资讯', value: 'news' }] }, required: true, translations: [{ language: 'zh-CN', translation: '分类类型' }] } },
    { field: 'description', meta: { interface: 'input-multiline', translations: [{ language: 'zh-CN', translation: '描述' }] } },
    { field: 'parent_id', meta: { interface: 'select-dropdown-m2o', note: '父分类', translations: [{ language: 'zh-CN', translation: '父分类' }] } },
    { field: 'order_index', meta: { interface: 'input', default_value: 0, translations: [{ language: 'zh-CN', translation: '排序' }] } },
    { field: 'created_at', meta: { interface: 'datetime', readonly: true, special: ['date-created'], translations: [{ language: 'zh-CN', translation: '创建时间' }] } },
    { field: 'updated_at', meta: { interface: 'datetime', readonly: true, special: ['date-updated'], translations: [{ language: 'zh-CN', translation: '更新时间' }] } }
  ],
  tags: [
    { field: 'id', meta: { hidden: true, readonly: true } },
    { field: 'name', meta: { interface: 'input', required: true, translations: [{ language: 'zh-CN', translation: '名称' }] } },
    { field: 'slug', meta: { interface: 'input', required: true, translations: [{ language: 'zh-CN', translation: 'URL标识' }] } },
    { field: 'type', meta: { interface: 'select-dropdown', options: { choices: [{ text: '通用', value: 'general' }, { text: '技术', value: 'technical' }, { text: '风险', value: 'risk' }] }, default_value: 'general', translations: [{ language: 'zh-CN', translation: '标签类型' }] } },
    { field: 'color', meta: { interface: 'select-color', note: '标签颜色', translations: [{ language: 'zh-CN', translation: '颜色' }] } },
    { field: 'description', meta: { interface: 'input-multiline', translations: [{ language: 'zh-CN', translation: '描述' }] } },
    { field: 'usage_count', meta: { interface: 'input', readonly: true, default_value: 0, translations: [{ language: 'zh-CN', translation: '使用次数' }] } },
    { field: 'created_at', meta: { interface: 'datetime', readonly: true, special: ['date-created'], translations: [{ language: 'zh-CN', translation: '创建时间' }] } },
    { field: 'updated_at', meta: { interface: 'datetime', readonly: true, special: ['date-updated'], translations: [{ language: 'zh-CN', translation: '更新时间' }] } }
  ],
  users: [
    { field: 'id', meta: { hidden: true, readonly: true } },
    { field: 'username', meta: { interface: 'input', required: true, translations: [{ language: 'zh-CN', translation: '用户名' }] } },
    { field: 'email', meta: { interface: 'input', required: true, translations: [{ language: 'zh-CN', translation: '邮箱' }] } },
    { field: 'display_name', meta: { interface: 'input', translations: [{ language: 'zh-CN', translation: '显示名称' }] } },
    { field: 'avatar_url', meta: { interface: 'input', note: '头像URL', translations: [{ language: 'zh-CN', translation: '头像' }] } },
    { field: 'bio', meta: { interface: 'input-multiline', note: '个人简介', translations: [{ language: 'zh-CN', translation: '简介' }] } },
    { field: 'role', meta: { interface: 'select-dropdown', options: { choices: [{ text: '用户', value: 'user' }, { text: '编辑', value: 'editor' }, { text: '管理员', value: 'admin' }] }, default_value: 'user', translations: [{ language: 'zh-CN', translation: '角色' }] } },
    { field: 'status', meta: { interface: 'select-dropdown', options: { choices: [{ text: '活跃', value: 'active' }, { text: '暂停', value: 'suspended' }, { text: '禁用', value: 'banned' }] }, default_value: 'active', translations: [{ language: 'zh-CN', translation: '状态' }] } },
    { field: 'created_at', meta: { interface: 'datetime', readonly: true, special: ['date-created'], translations: [{ language: 'zh-CN', translation: '注册时间' }] } },
    { field: 'updated_at', meta: { interface: 'datetime', readonly: true, special: ['date-updated'], translations: [{ language: 'zh-CN', translation: '更新时间' }] } },
    { field: 'last_login_at', meta: { interface: 'datetime', readonly: true, translations: [{ language: 'zh-CN', translation: '最后登录' }] } }
  ],
  user_interactions: [
    { field: 'id', meta: { hidden: true, readonly: true } },
    { field: 'user_id', meta: { interface: 'select-dropdown-m2o', required: true, translations: [{ language: 'zh-CN', translation: '用户' }] } },
    { field: 'target_type', meta: { interface: 'select-dropdown', options: { choices: [{ text: '玩法', value: 'strategy' }, { text: '资讯', value: 'news' }, { text: '评论', value: 'comment' }] }, required: true, translations: [{ language: 'zh-CN', translation: '目标类型' }] } },
    { field: 'target_id', meta: { interface: 'input', required: true, translations: [{ language: 'zh-CN', translation: '目标ID' }] } },
    { field: 'interaction_type', meta: { interface: 'select-dropdown', options: { choices: [{ text: '点赞', value: 'like' }, { text: '收藏', value: 'favorite' }, { text: '分享', value: 'share' }, { text: '举报', value: 'report' }] }, required: true, translations: [{ language: 'zh-CN', translation: '交互类型' }] } },
    { field: 'created_at', meta: { interface: 'datetime', readonly: true, special: ['date-created'], translations: [{ language: 'zh-CN', translation: '创建时间' }] } }
  ],
  comments: [
    { field: 'id', meta: { hidden: true, readonly: true } },
    { field: 'user_id', meta: { interface: 'select-dropdown-m2o', required: true, translations: [{ language: 'zh-CN', translation: '用户' }] } },
    { field: 'target_type', meta: { interface: 'select-dropdown', options: { choices: [{ text: '玩法', value: 'strategy' }, { text: '资讯', value: 'news' }] }, required: true, translations: [{ language: 'zh-CN', translation: '评论对象' }] } },
    { field: 'target_id', meta: { interface: 'input', required: true, translations: [{ language: 'zh-CN', translation: '对象ID' }] } },
    { field: 'parent_id', meta: { interface: 'select-dropdown-m2o', note: '回复的评论ID', translations: [{ language: 'zh-CN', translation: '父评论' }] } },
    { field: 'content', meta: { interface: 'input-multiline', required: true, translations: [{ language: 'zh-CN', translation: '内容' }] } },
    { field: 'status', meta: { interface: 'select-dropdown', options: { choices: [{ text: '已发布', value: 'published' }, { text: '隐藏', value: 'hidden' }, { text: '删除', value: 'deleted' }] }, default_value: 'published', translations: [{ language: 'zh-CN', translation: '状态' }] } },
    { field: 'like_count', meta: { interface: 'input', readonly: true, default_value: 0, translations: [{ language: 'zh-CN', translation: '点赞数' }] } },
    { field: 'created_at', meta: { interface: 'datetime', readonly: true, special: ['date-created'], translations: [{ language: 'zh-CN', translation: '创建时间' }] } },
    { field: 'updated_at', meta: { interface: 'datetime', readonly: true, special: ['date-updated'], translations: [{ language: 'zh-CN', translation: '更新时间' }] } }
  ],
  chains: [
    { field: 'id', meta: { hidden: true, readonly: true } },
    { field: 'name', meta: { interface: 'input', required: true, translations: [{ language: 'zh-CN', translation: '名称' }] } },
    { field: 'symbol', meta: { interface: 'input', required: true, translations: [{ language: 'zh-CN', translation: '代号' }] } },
    { field: 'chain_id', meta: { interface: 'input', note: '链ID', translations: [{ language: 'zh-CN', translation: '链ID' }] } },
    { field: 'logo_url', meta: { interface: 'input', translations: [{ language: 'zh-CN', translation: 'Logo' }] } },
    { field: 'website_url', meta: { interface: 'input', translations: [{ language: 'zh-CN', translation: '官网' }] } },
    { field: 'explorer_url', meta: { interface: 'input', note: '区块浏览器URL', translations: [{ language: 'zh-CN', translation: '浏览器' }] } },
    { field: 'is_testnet', meta: { interface: 'boolean', default_value: false, translations: [{ language: 'zh-CN', translation: '测试网' }] } },
    { field: 'created_at', meta: { interface: 'datetime', readonly: true, special: ['date-created'], translations: [{ language: 'zh-CN', translation: '创建时间' }] } },
    { field: 'updated_at', meta: { interface: 'datetime', readonly: true, special: ['date-updated'], translations: [{ language: 'zh-CN', translation: '更新时间' }] } }
  ],
  protocols: [
    { field: 'id', meta: { hidden: true, readonly: true } },
    { field: 'name', meta: { interface: 'input', required: true, translations: [{ language: 'zh-CN', translation: '名称' }] } },
    { field: 'slug', meta: { interface: 'input', required: true, translations: [{ language: 'zh-CN', translation: 'URL标识' }] } },
    { field: 'type', meta: { interface: 'select-dropdown', options: { choices: [{ text: 'DEX', value: 'dex' }, { text: '借贷', value: 'lending' }, { text: '流动性挖矿', value: 'yield' }, { text: 'NFT', value: 'nft' }, { text: '其他', value: 'other' }] }, translations: [{ language: 'zh-CN', translation: '类型' }] } },
    { field: 'description', meta: { interface: 'input-rich-text-html', translations: [{ language: 'zh-CN', translation: '描述' }] } },
    { field: 'website_url', meta: { interface: 'input', translations: [{ language: 'zh-CN', translation: '官网' }] } },
    { field: 'logo_url', meta: { interface: 'input', translations: [{ language: 'zh-CN', translation: 'Logo' }] } },
    { field: 'tvl', meta: { interface: 'input', note: '总锁仓量', translations: [{ language: 'zh-CN', translation: 'TVL' }] } },
    { field: 'status', meta: { interface: 'select-dropdown', options: { choices: [{ text: '活跃', value: 'active' }, { text: '非活跃', value: 'inactive' }] }, default_value: 'active', translations: [{ language: 'zh-CN', translation: '状态' }] } },
    { field: 'created_at', meta: { interface: 'datetime', readonly: true, special: ['date-created'], translations: [{ language: 'zh-CN', translation: '创建时间' }] } },
    { field: 'updated_at', meta: { interface: 'datetime', readonly: true, special: ['date-updated'], translations: [{ language: 'zh-CN', translation: '更新时间' }] } }
  ]
};

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

async function getCollectionFields(token, collection) {
  const response = await fetch(`${DIRECTUS_URL}/fields/${collection}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  return data.data.map(f => f.field);
}

async function updateField(token, collection, fieldName, meta) {
  console.log(`  📝 Updating field: ${collection}.${fieldName}...`);

  const response = await fetch(`${DIRECTUS_URL}/fields/${collection}/${fieldName}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ meta }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`  ❌ Failed to update ${collection}.${fieldName}:`, error);
    return false;
  }

  return true;
}

async function main() {
  try {
    console.log('');
    console.log('================================================');
    console.log('  Directus Fields Configuration');
    console.log('================================================');
    console.log('');

    const token = await login();
    console.log('');

    let totalUpdated = 0;
    let totalSkipped = 0;

    for (const [collection, fields] of Object.entries(fieldConfigs)) {
      console.log(`📦 Configuring collection: ${collection}`);

      // Get existing fields
      const existingFields = await getCollectionFields(token, collection);

      for (const { field, meta } of fields) {
        if (!existingFields.includes(field)) {
          console.log(`  ⏭️  Field ${field} does not exist, skipping...`);
          totalSkipped++;
          continue;
        }

        const success = await updateField(token, collection, field, meta);
        if (success) {
          totalUpdated++;
        } else {
          totalSkipped++;
        }
      }

      console.log('');
    }

    console.log('================================================');
    console.log('📊 Summary:');
    console.log(`  ✅ Updated: ${totalUpdated} fields`);
    console.log(`  ⏭️  Skipped: ${totalSkipped} fields`);
    console.log('================================================');
    console.log('');
    console.log('🎉 Field configuration complete!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Visit http://localhost:8055/admin/content');
    console.log('2. Review the collections with Chinese labels');
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
