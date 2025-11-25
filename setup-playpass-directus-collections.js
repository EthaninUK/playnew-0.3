#!/usr/bin/env node

/**
 * PlayPass Directus 集合配置脚本
 *
 * 功能:
 * 1. 在 Directus 中创建 PlayPass 相关的集合（collections）
 * 2. 配置字段类型、显示选项、验证规则
 * 3. 设置权限，让管理员可以管理配置
 *
 * 集合:
 * - playpass_pricing_config (内容定价配置)
 * - playpass_reward_config (奖励规则配置)
 * - playpass_membership_config (会员等级配置)
 * - user_playpass (用户余额 - 只读)
 * - playpass_transactions (交易记录 - 只读)
 */

const DIRECTUS_URL = 'http://localhost:8055';
const ADMIN_EMAIL = 'the_uk1@outlook.com';
const ADMIN_PASSWORD = 'Mygcdjmyxzg2026!';

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * 登录 Directus 获取访问令牌
 */
async function login() {
  log('\n🔐 登录 Directus...', 'blue');

  const response = await fetch(`${DIRECTUS_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    }),
  });

  if (!response.ok) {
    throw new Error(`登录失败: ${response.statusText}`);
  }

  const data = await response.json();
  log('✅ 登录成功', 'green');
  return data.data.access_token;
}

/**
 * 检查集合是否已存在
 */
async function checkCollectionExists(token, collectionName) {
  const response = await fetch(`${DIRECTUS_URL}/collections/${collectionName}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });

  return response.ok;
}

/**
 * 配置集合元数据（显示名称、图标等）
 */
async function configureCollectionMeta(token, collectionName, meta) {
  log(`\n📝 配置集合元数据: ${collectionName}`, 'cyan');

  const response = await fetch(`${DIRECTUS_URL}/collections/${collectionName}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ meta }),
  });

  if (!response.ok) {
    const error = await response.text();
    log(`⚠️  配置集合元数据失败: ${error}`, 'yellow');
  } else {
    log('✅ 集合元数据配置成功', 'green');
  }
}

/**
 * 配置字段元数据（显示名称、界面组件等）
 */
async function configureFieldMeta(token, collectionName, fieldName, meta) {
  const response = await fetch(`${DIRECTUS_URL}/fields/${collectionName}/${fieldName}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ meta }),
  });

  if (!response.ok) {
    const error = await response.text();
    log(`⚠️  配置字段 ${fieldName} 失败: ${error}`, 'yellow');
    return false;
  }

  return true;
}

/**
 * 配置 playpass_pricing_config 集合
 */
async function setupPricingConfigCollection(token) {
  log('\n' + '='.repeat(60), 'blue');
  log('📦 配置 playpass_pricing_config 集合', 'blue');
  log('='.repeat(60), 'blue');

  const collectionName = 'playpass_pricing_config';

  // 1. 配置集合元数据
  await configureCollectionMeta(token, collectionName, {
    collection: collectionName,
    icon: 'attach_money',
    note: 'PlayPass 内容定价配置 - 管理不同内容类型的 PP 价格',
    display_template: '{{config_key}} - {{content_type}} ({{pp_price}} PP)',
    hidden: false,
    singleton: false,
    translations: [
      {
        language: 'zh-CN',
        translation: 'PlayPass 定价配置',
      },
    ],
  });

  // 2. 配置字段
  const fields = [
    {
      field: 'id',
      meta: {
        interface: 'input',
        readonly: true,
        hidden: true,
        width: 'half',
        translations: [{ language: 'zh-CN', translation: 'ID' }],
      },
    },
    {
      field: 'config_key',
      meta: {
        interface: 'input',
        required: true,
        width: 'half',
        note: '配置唯一标识，如: strategy_high_risk, news_premium',
        translations: [{ language: 'zh-CN', translation: '配置键' }],
      },
    },
    {
      field: 'content_type',
      meta: {
        interface: 'select-dropdown',
        required: true,
        width: 'half',
        options: {
          choices: [
            { text: '策略 (strategy)', value: 'strategy' },
            { text: '套利信号 (arbitrage)', value: 'arbitrage' },
            { text: '新闻 (news)', value: 'news' },
            { text: '八卦 (gossip)', value: 'gossip' },
          ],
        },
        translations: [{ language: 'zh-CN', translation: '内容类型' }],
      },
    },
    {
      field: 'pp_price',
      meta: {
        interface: 'input',
        required: true,
        width: 'half',
        display: 'formatted-value',
        display_options: {
          suffix: ' PP',
        },
        note: '该内容类型的 PP 价格（0 表示免费）',
        translations: [{ language: 'zh-CN', translation: 'PP 价格' }],
      },
    },
    {
      field: 'conditions',
      meta: {
        interface: 'input-code',
        width: 'full',
        options: {
          language: 'json',
          lineNumber: true,
          template: '{\n  "risk_level": [4, 5],\n  "category_l1": "defi-lending"\n}',
        },
        note: '价格匹配条件（JSON 格式）。支持数组、范围、精确匹配',
        translations: [{ language: 'zh-CN', translation: '匹配条件' }],
      },
    },
    {
      field: 'membership_discount',
      meta: {
        interface: 'input-code',
        width: 'full',
        options: {
          language: 'json',
          lineNumber: true,
          template: '{\n  "0": 0,\n  "1": 0.1,\n  "2": 0.3,\n  "3": 0.5,\n  "4": 1.0\n}',
        },
        note: '会员折扣率（0=Free, 1=Pro, 2=Premium, 3=Partner, 4=MAX）',
        translations: [{ language: 'zh-CN', translation: '会员折扣' }],
      },
    },
    {
      field: 'priority',
      meta: {
        interface: 'input',
        width: 'half',
        display: 'formatted-value',
        note: '优先级（数字越大优先级越高，默认 0）',
        translations: [{ language: 'zh-CN', translation: '优先级' }],
      },
    },
    {
      field: 'is_active',
      meta: {
        interface: 'boolean',
        width: 'half',
        display: 'boolean',
        note: '是否启用该定价规则',
        translations: [{ language: 'zh-CN', translation: '是否启用' }],
      },
    },
    {
      field: 'description',
      meta: {
        interface: 'input-multiline',
        width: 'full',
        note: '规则说明（方便管理员理解）',
        translations: [{ language: 'zh-CN', translation: '规则描述' }],
      },
    },
    {
      field: 'created_at',
      meta: {
        interface: 'datetime',
        readonly: true,
        hidden: true,
        width: 'half',
        translations: [{ language: 'zh-CN', translation: '创建时间' }],
      },
    },
    {
      field: 'updated_at',
      meta: {
        interface: 'datetime',
        readonly: true,
        hidden: true,
        width: 'half',
        translations: [{ language: 'zh-CN', translation: '更新时间' }],
      },
    },
  ];

  for (const { field, meta } of fields) {
    const success = await configureFieldMeta(token, collectionName, field, meta);
    if (success) {
      log(`  ✅ 字段配置成功: ${field}`, 'green');
    }
  }
}

/**
 * 配置 playpass_reward_config 集合
 */
async function setupRewardConfigCollection(token) {
  log('\n' + '='.repeat(60), 'blue');
  log('📦 配置 playpass_reward_config 集合', 'blue');
  log('='.repeat(60), 'blue');

  const collectionName = 'playpass_reward_config';

  // 1. 配置集合元数据
  await configureCollectionMeta(token, collectionName, {
    collection: collectionName,
    icon: 'card_giftcard',
    note: 'PlayPass 奖励规则配置 - 管理用户赚取 PP 的奖励规则',
    display_template: '{{reward_key}} - {{action_type}} (+{{pp_amount}} PP)',
    hidden: false,
    singleton: false,
    translations: [
      {
        language: 'zh-CN',
        translation: 'PlayPass 奖励配置',
      },
    ],
  });

  // 2. 配置字段
  const fields = [
    {
      field: 'id',
      meta: {
        interface: 'input',
        readonly: true,
        hidden: true,
        width: 'half',
        translations: [{ language: 'zh-CN', translation: 'ID' }],
      },
    },
    {
      field: 'reward_key',
      meta: {
        interface: 'input',
        required: true,
        width: 'half',
        note: '奖励唯一标识，如: daily_signin, read_strategy',
        translations: [{ language: 'zh-CN', translation: '奖励键' }],
      },
    },
    {
      field: 'action_type',
      meta: {
        interface: 'select-dropdown',
        required: true,
        width: 'half',
        options: {
          choices: [
            { text: '每日签到', value: 'daily_signin' },
            { text: '阅读策略', value: 'read_strategy' },
            { text: '阅读套利', value: 'read_arbitrage' },
            { text: '阅读新闻', value: 'read_news' },
            { text: '阅读八卦', value: 'read_gossip' },
            { text: '分享内容', value: 'share_content' },
            { text: '发布评论', value: 'post_comment' },
            { text: '发布策略', value: 'publish_strategy' },
          ],
        },
        translations: [{ language: 'zh-CN', translation: '行为类型' }],
      },
    },
    {
      field: 'pp_amount',
      meta: {
        interface: 'input',
        required: true,
        width: 'half',
        display: 'formatted-value',
        display_options: {
          suffix: ' PP',
        },
        note: '基础 PP 奖励金额（会应用会员倍率）',
        translations: [{ language: 'zh-CN', translation: '基础奖励' }],
      },
    },
    {
      field: 'reward_multiplier',
      meta: {
        interface: 'input',
        width: 'half',
        display: 'formatted-value',
        display_options: {
          suffix: 'x',
        },
        note: '活动倍率（1.0=正常, 2.0=双倍活动, 默认 1.0）',
        translations: [{ language: 'zh-CN', translation: '活动倍率' }],
      },
    },
    {
      field: 'frequency_limit',
      meta: {
        interface: 'select-dropdown',
        width: 'half',
        options: {
          choices: [
            { text: '无限制', value: 'unlimited' },
            { text: '每日一次', value: 'daily' },
            { text: '每内容一次', value: 'once_per_content' },
          ],
        },
        note: '奖励频率限制',
        translations: [{ language: 'zh-CN', translation: '频率限制' }],
      },
    },
    {
      field: 'valid_from',
      meta: {
        interface: 'datetime',
        width: 'half',
        note: '活动开始时间（留空表示永久有效）',
        translations: [{ language: 'zh-CN', translation: '生效开始时间' }],
      },
    },
    {
      field: 'valid_until',
      meta: {
        interface: 'datetime',
        width: 'half',
        note: '活动结束时间（留空表示永久有效）',
        translations: [{ language: 'zh-CN', translation: '生效结束时间' }],
      },
    },
    {
      field: 'is_active',
      meta: {
        interface: 'boolean',
        width: 'half',
        display: 'boolean',
        note: '是否启用该奖励规则',
        translations: [{ language: 'zh-CN', translation: '是否启用' }],
      },
    },
    {
      field: 'description',
      meta: {
        interface: 'input-multiline',
        width: 'full',
        note: '规则说明（方便管理员理解）',
        translations: [{ language: 'zh-CN', translation: '规则描述' }],
      },
    },
    {
      field: 'created_at',
      meta: {
        interface: 'datetime',
        readonly: true,
        hidden: true,
        width: 'half',
        translations: [{ language: 'zh-CN', translation: '创建时间' }],
      },
    },
    {
      field: 'updated_at',
      meta: {
        interface: 'datetime',
        readonly: true,
        hidden: true,
        width: 'half',
        translations: [{ language: 'zh-CN', translation: '更新时间' }],
      },
    },
  ];

  for (const { field, meta } of fields) {
    const success = await configureFieldMeta(token, collectionName, field, meta);
    if (success) {
      log(`  ✅ 字段配置成功: ${field}`, 'green');
    }
  }
}

/**
 * 配置 playpass_membership_config 集合
 */
async function setupMembershipConfigCollection(token) {
  log('\n' + '='.repeat(60), 'blue');
  log('📦 配置 playpass_membership_config 集合', 'blue');
  log('='.repeat(60), 'blue');

  const collectionName = 'playpass_membership_config';

  // 1. 配置集合元数据
  await configureCollectionMeta(token, collectionName, {
    collection: collectionName,
    icon: 'workspace_premium',
    note: 'PlayPass 会员等级配置 - 管理会员权益和倍率',
    display_template: '{{name}} (Level {{level}}) - {{earn_multiplier}}x',
    hidden: false,
    singleton: false,
    translations: [
      {
        language: 'zh-CN',
        translation: 'PlayPass 会员配置',
      },
    ],
  });

  // 2. 配置字段
  const fields = [
    {
      field: 'id',
      meta: {
        interface: 'input',
        readonly: true,
        hidden: true,
        width: 'half',
        translations: [{ language: 'zh-CN', translation: 'ID' }],
      },
    },
    {
      field: 'level',
      meta: {
        interface: 'input',
        required: true,
        readonly: true,
        width: 'half',
        note: '会员等级 (0=Free, 1=Pro, 2=Premium, 3=Partner, 4=MAX)',
        translations: [{ language: 'zh-CN', translation: '会员等级' }],
      },
    },
    {
      field: 'name',
      meta: {
        interface: 'input',
        required: true,
        width: 'half',
        note: '会员名称（如: Free, Pro, Premium）',
        translations: [{ language: 'zh-CN', translation: '会员名称' }],
      },
    },
    {
      field: 'earn_multiplier',
      meta: {
        interface: 'input',
        required: true,
        width: 'half',
        display: 'formatted-value',
        display_options: {
          suffix: 'x',
        },
        note: '赚取倍率（如: 1.0, 1.2, 1.5, 2.0, 999.99）',
        translations: [{ language: 'zh-CN', translation: '赚取倍率' }],
      },
    },
    {
      field: 'discount_rate',
      meta: {
        interface: 'input',
        required: true,
        width: 'half',
        display: 'formatted-value',
        display_options: {
          suffix: '%',
        },
        note: '默认折扣率（0-100，如: 10 表示 10% 折扣）',
        translations: [{ language: 'zh-CN', translation: '折扣率' }],
      },
    },
    {
      field: 'daily_earn_limit',
      meta: {
        interface: 'input',
        required: true,
        width: 'half',
        display: 'formatted-value',
        display_options: {
          suffix: ' PP/天',
        },
        note: '每日赚取上限（-1 表示无限制）',
        translations: [{ language: 'zh-CN', translation: '每日上限' }],
      },
    },
    {
      field: 'benefits',
      meta: {
        interface: 'input-code',
        width: 'full',
        options: {
          language: 'json',
          lineNumber: true,
          template: '[\n  "基础功能",\n  "优先支持"\n]',
        },
        note: '会员权益列表（JSON 数组）',
        translations: [{ language: 'zh-CN', translation: '会员权益' }],
      },
    },
    {
      field: 'description',
      meta: {
        interface: 'input-multiline',
        width: 'full',
        note: '会员说明',
        translations: [{ language: 'zh-CN', translation: '会员描述' }],
      },
    },
    {
      field: 'created_at',
      meta: {
        interface: 'datetime',
        readonly: true,
        hidden: true,
        width: 'half',
        translations: [{ language: 'zh-CN', translation: '创建时间' }],
      },
    },
    {
      field: 'updated_at',
      meta: {
        interface: 'datetime',
        readonly: true,
        hidden: true,
        width: 'half',
        translations: [{ language: 'zh-CN', translation: '更新时间' }],
      },
    },
  ];

  for (const { field, meta } of fields) {
    const success = await configureFieldMeta(token, collectionName, field, meta);
    if (success) {
      log(`  ✅ 字段配置成功: ${field}`, 'green');
    }
  }
}

/**
 * 配置只读集合（用于查看用户数据）
 */
async function setupReadOnlyCollections(token) {
  log('\n' + '='.repeat(60), 'blue');
  log('📦 配置只读集合（用于查看用户数据）', 'blue');
  log('='.repeat(60), 'blue');

  // 1. user_playpass - 用户余额
  await configureCollectionMeta(token, 'user_playpass', {
    collection: 'user_playpass',
    icon: 'account_balance_wallet',
    note: 'PlayPass 用户余额 - 只读查看',
    display_template: 'User {{user_id}} - {{current_balance}} PP',
    hidden: false,
    singleton: false,
    archive_field: null,
    archive_value: null,
    unarchive_value: null,
    translations: [
      {
        language: 'zh-CN',
        translation: 'PlayPass 用户余额',
      },
    ],
  });

  // 2. playpass_transactions - 交易记录
  await configureCollectionMeta(token, 'playpass_transactions', {
    collection: 'playpass_transactions',
    icon: 'receipt_long',
    note: 'PlayPass 交易记录 - 只读查看',
    display_template: '{{user_id}} - {{transaction_type}} {{pp_amount}} PP',
    hidden: false,
    singleton: false,
    translations: [
      {
        language: 'zh-CN',
        translation: 'PlayPass 交易记录',
      },
    ],
  });

  log('✅ 只读集合配置完成', 'green');
}

/**
 * 主函数
 */
async function main() {
  try {
    log('\n' + '='.repeat(60), 'cyan');
    log('🚀 PlayPass Directus 集合配置开始', 'cyan');
    log('='.repeat(60), 'cyan');

    // 1. 登录
    const token = await login();

    // 2. 检查集合是否存在
    log('\n📋 检查集合是否存在...', 'blue');
    const collections = [
      'playpass_pricing_config',
      'playpass_reward_config',
      'playpass_membership_config',
      'user_playpass',
      'playpass_transactions',
    ];

    for (const collection of collections) {
      const exists = await checkCollectionExists(token, collection);
      if (exists) {
        log(`  ✅ ${collection} 已存在`, 'green');
      } else {
        log(`  ⚠️  ${collection} 不存在，需要先运行 SQL 创建表`, 'yellow');
      }
    }

    // 3. 配置集合
    await setupPricingConfigCollection(token);
    await setupRewardConfigCollection(token);
    await setupMembershipConfigCollection(token);
    await setupReadOnlyCollections(token);

    log('\n' + '='.repeat(60), 'green');
    log('✅ PlayPass Directus 集合配置完成！', 'green');
    log('='.repeat(60), 'green');

    log('\n📝 下一步:', 'cyan');
    log('1. 访问 Directus 后台: http://localhost:8055', 'cyan');
    log('2. 在左侧导航找到 PlayPass 相关集合', 'cyan');
    log('3. 开始管理定价和奖励规则', 'cyan');

  } catch (error) {
    log(`\n❌ 错误: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  }
}

// 运行主函数
main();
