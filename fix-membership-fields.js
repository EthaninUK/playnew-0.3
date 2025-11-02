const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_EMAIL = 'the_uk1@outlook.com';
const DIRECTUS_PASSWORD = 'Mygcdjmyxzg2026!';

let accessToken = '';

async function login() {
  try {
    const response = await axios.post(`${DIRECTUS_URL}/auth/login`, {
      email: DIRECTUS_EMAIL,
      password: DIRECTUS_PASSWORD,
    });
    accessToken = response.data.data.access_token;
    console.log('✅ 登录成功\n');
    return accessToken;
  } catch (error) {
    console.error('❌ 登录失败:', error.response?.data || error.message);
    throw error;
  }
}

// 添加 memberships 表字段
async function addMembershipsFields() {
  console.log('📋 添加 memberships 表字段...\n');

  const fields = [
    {
      field: 'name',
      type: 'string',
      meta: {
        interface: 'input',
        required: true,
        width: 'half',
      },
      schema: {
        is_nullable: false,
      },
    },
    {
      field: 'level',
      type: 'integer',
      meta: {
        interface: 'input',
        required: true,
        note: '0-Free, 1-Pro, 2-Max, 3-Partner',
        width: 'half',
      },
      schema: {
        is_nullable: false,
      },
    },
    {
      field: 'price_monthly_usd',
      type: 'decimal',
      meta: {
        interface: 'input',
        required: true,
        width: 'half',
      },
      schema: {
        is_nullable: false,
        numeric_precision: 10,
        numeric_scale: 2,
      },
    },
    {
      field: 'price_yearly_usd',
      type: 'decimal',
      meta: {
        interface: 'input',
        required: true,
        note: '年付=10个月价格',
        width: 'half',
      },
      schema: {
        is_nullable: false,
        numeric_precision: 10,
        numeric_scale: 2,
      },
    },
    {
      field: 'content_access_level',
      type: 'integer',
      meta: {
        interface: 'select-dropdown',
        required: true,
        options: {
          choices: [
            { text: '等级0 - 基础内容', value: 0 },
            { text: '等级1 - 中级内容', value: 1 },
            { text: '等级2 - 高级内容', value: 2 },
            { text: '等级3 - 全部内容', value: 3 },
          ],
        },
        width: 'half',
      },
      schema: {
        is_nullable: false,
        default_value: 0,
      },
    },
    {
      field: 'features',
      type: 'json',
      meta: {
        interface: 'input-code',
        options: {
          language: 'json',
        },
        width: 'full',
      },
      schema: {
        is_nullable: true,
      },
    },
    {
      field: 'description',
      type: 'text',
      meta: {
        interface: 'input-rich-text-html',
        width: 'full',
      },
      schema: {
        is_nullable: true,
      },
    },
    {
      field: 'is_active',
      type: 'boolean',
      meta: {
        interface: 'boolean',
        width: 'half',
      },
      schema: {
        is_nullable: false,
        default_value: true,
      },
    },
    {
      field: 'sort_order',
      type: 'integer',
      meta: {
        interface: 'input',
        width: 'half',
      },
      schema: {
        is_nullable: true,
      },
    },
  ];

  for (const field of fields) {
    try {
      await axios.post(
        `${DIRECTUS_URL}/fields/memberships`,
        field,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      console.log(`  ✅ 添加字段: ${field.field}`);
    } catch (error) {
      if (error.response?.data?.errors?.[0]?.message?.includes('already exists')) {
        console.log(`  ⏭️  字段已存在: ${field.field}`);
      } else {
        console.error(`  ❌ 添加字段失败 ${field.field}:`, error.response?.data?.errors?.[0]?.message || error.message);
      }
    }
  }
}

// 添加 user_subscriptions 表字段
async function addUserSubscriptionsFields() {
  console.log('\n📋 添加 user_subscriptions 表字段...\n');

  const fields = [
    {
      field: 'user_id',
      type: 'uuid',
      meta: {
        interface: 'input',
        required: true,
        note: 'Supabase Auth User ID',
        width: 'half',
      },
      schema: {
        is_nullable: false,
      },
    },
    {
      field: 'membership_id',
      type: 'uuid',
      meta: {
        interface: 'select-dropdown-m2o',
        required: true,
        display: 'related-values',
        display_options: {
          template: '{{name}}',
        },
        width: 'half',
      },
      schema: {
        is_nullable: false,
        foreign_key_table: 'memberships',
        foreign_key_column: 'id',
      },
    },
    {
      field: 'status',
      type: 'string',
      meta: {
        interface: 'select-dropdown',
        required: true,
        options: {
          choices: [
            { text: '待支付', value: 'pending' },
            { text: '激活中', value: 'active' },
            { text: '已取消', value: 'cancelled' },
            { text: '已过期', value: 'expired' },
            { text: '暂停中', value: 'paused' },
          ],
        },
        width: 'half',
      },
      schema: {
        is_nullable: false,
        default_value: 'pending',
      },
    },
    {
      field: 'billing_cycle',
      type: 'string',
      meta: {
        interface: 'select-dropdown',
        required: true,
        options: {
          choices: [
            { text: '按月付费', value: 'monthly' },
            { text: '按年付费', value: 'yearly' },
          ],
        },
        width: 'half',
      },
      schema: {
        is_nullable: false,
      },
    },
    {
      field: 'payment_method',
      type: 'string',
      meta: {
        interface: 'select-dropdown',
        required: true,
        options: {
          choices: [
            { text: 'Stripe (信用卡)', value: 'stripe' },
            { text: '加密货币', value: 'crypto' },
          ],
        },
        width: 'half',
      },
      schema: {
        is_nullable: false,
      },
    },
    {
      field: 'amount_paid',
      type: 'decimal',
      meta: {
        interface: 'input',
        width: 'half',
      },
      schema: {
        is_nullable: true,
        numeric_precision: 10,
        numeric_scale: 2,
      },
    },
    {
      field: 'stripe_subscription_id',
      type: 'string',
      meta: {
        interface: 'input',
        width: 'half',
      },
      schema: {
        is_nullable: true,
      },
    },
    {
      field: 'crypto_payment_id',
      type: 'string',
      meta: {
        interface: 'input',
        width: 'half',
      },
      schema: {
        is_nullable: true,
      },
    },
    {
      field: 'start_date',
      type: 'timestamp',
      meta: {
        interface: 'datetime',
        width: 'half',
      },
      schema: {
        is_nullable: true,
      },
    },
    {
      field: 'end_date',
      type: 'timestamp',
      meta: {
        interface: 'datetime',
        width: 'half',
      },
      schema: {
        is_nullable: true,
      },
    },
    {
      field: 'auto_renew',
      type: 'boolean',
      meta: {
        interface: 'boolean',
        width: 'half',
      },
      schema: {
        is_nullable: false,
        default_value: true,
      },
    },
    {
      field: 'cancelled_at',
      type: 'timestamp',
      meta: {
        interface: 'datetime',
        width: 'half',
      },
      schema: {
        is_nullable: true,
      },
    },
  ];

  for (const field of fields) {
    try {
      await axios.post(
        `${DIRECTUS_URL}/fields/user_subscriptions`,
        field,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      console.log(`  ✅ 添加字段: ${field.field}`);
    } catch (error) {
      if (error.response?.data?.errors?.[0]?.message?.includes('already exists')) {
        console.log(`  ⏭️  字段已存在: ${field.field}`);
      } else {
        console.error(`  ❌ 添加字段失败 ${field.field}:`, error.response?.data?.errors?.[0]?.message || error.message);
      }
    }
  }
}

// 添加 payments 表字段
async function addPaymentsFields() {
  console.log('\n📋 添加 payments 表字段...\n');

  const fields = [
    {
      field: 'user_id',
      type: 'uuid',
      meta: {
        interface: 'input',
        required: true,
        width: 'half',
      },
      schema: {
        is_nullable: false,
      },
    },
    {
      field: 'subscription_id',
      type: 'uuid',
      meta: {
        interface: 'select-dropdown-m2o',
        required: true,
        width: 'half',
      },
      schema: {
        is_nullable: false,
        foreign_key_table: 'user_subscriptions',
        foreign_key_column: 'id',
      },
    },
    {
      field: 'payment_method',
      type: 'string',
      meta: {
        interface: 'select-dropdown',
        required: true,
        options: {
          choices: [
            { text: 'Stripe', value: 'stripe' },
            { text: 'Crypto', value: 'crypto' },
          ],
        },
        width: 'half',
      },
      schema: {
        is_nullable: false,
      },
    },
    {
      field: 'amount',
      type: 'decimal',
      meta: {
        interface: 'input',
        required: true,
        width: 'half',
      },
      schema: {
        is_nullable: false,
        numeric_precision: 10,
        numeric_scale: 2,
      },
    },
    {
      field: 'currency',
      type: 'string',
      meta: {
        interface: 'input',
        width: 'half',
      },
      schema: {
        is_nullable: false,
        default_value: 'USD',
      },
    },
    {
      field: 'status',
      type: 'string',
      meta: {
        interface: 'select-dropdown',
        required: true,
        options: {
          choices: [
            { text: '待支付', value: 'pending' },
            { text: '处理中', value: 'processing' },
            { text: '已完成', value: 'completed' },
            { text: '已失败', value: 'failed' },
            { text: '已退款', value: 'refunded' },
          ],
        },
        width: 'half',
      },
      schema: {
        is_nullable: false,
        default_value: 'pending',
      },
    },
    {
      field: 'stripe_payment_intent_id',
      type: 'string',
      meta: {
        interface: 'input',
        width: 'half',
      },
      schema: {
        is_nullable: true,
      },
    },
    {
      field: 'crypto_transaction_hash',
      type: 'string',
      meta: {
        interface: 'input',
        width: 'half',
      },
      schema: {
        is_nullable: true,
      },
    },
    {
      field: 'metadata',
      type: 'json',
      meta: {
        interface: 'input-code',
        options: {
          language: 'json',
        },
        width: 'full',
      },
      schema: {
        is_nullable: true,
      },
    },
    {
      field: 'paid_at',
      type: 'timestamp',
      meta: {
        interface: 'datetime',
        width: 'half',
      },
      schema: {
        is_nullable: true,
      },
    },
  ];

  for (const field of fields) {
    try {
      await axios.post(
        `${DIRECTUS_URL}/fields/payments`,
        field,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      console.log(`  ✅ 添加字段: ${field.field}`);
    } catch (error) {
      if (error.response?.data?.errors?.[0]?.message?.includes('already exists')) {
        console.log(`  ⏭️  字段已存在: ${field.field}`);
      } else {
        console.error(`  ❌ 添加字段失败 ${field.field}:`, error.response?.data?.errors?.[0]?.message || error.message);
      }
    }
  }
}

// 添加 partner_earnings 表字段
async function addPartnerEarningsFields() {
  console.log('\n📋 添加 partner_earnings 表字段...\n');

  const fields = [
    {
      field: 'partner_user_id',
      type: 'uuid',
      meta: {
        interface: 'input',
        required: true,
        width: 'half',
      },
      schema: {
        is_nullable: false,
      },
    },
    {
      field: 'earning_type',
      type: 'string',
      meta: {
        interface: 'select-dropdown',
        required: true,
        options: {
          choices: [
            { text: '推荐佣金 (20%)', value: 'referral' },
            { text: '内容分成 (70%)', value: 'content' },
          ],
        },
        width: 'half',
      },
      schema: {
        is_nullable: false,
      },
    },
    {
      field: 'amount',
      type: 'decimal',
      meta: {
        interface: 'input',
        required: true,
        width: 'half',
      },
      schema: {
        is_nullable: false,
        numeric_precision: 10,
        numeric_scale: 2,
      },
    },
    {
      field: 'source_user_id',
      type: 'uuid',
      meta: {
        interface: 'input',
        note: '推荐用户或内容消费者',
        width: 'half',
      },
      schema: {
        is_nullable: true,
      },
    },
    {
      field: 'source_content_id',
      type: 'uuid',
      meta: {
        interface: 'input',
        note: '产生收益的内容ID',
        width: 'half',
      },
      schema: {
        is_nullable: true,
      },
    },
    {
      field: 'related_payment_id',
      type: 'uuid',
      meta: {
        interface: 'select-dropdown-m2o',
        width: 'half',
      },
      schema: {
        is_nullable: true,
        foreign_key_table: 'payments',
        foreign_key_column: 'id',
      },
    },
    {
      field: 'status',
      type: 'string',
      meta: {
        interface: 'select-dropdown',
        required: true,
        options: {
          choices: [
            { text: '待结算', value: 'pending' },
            { text: '已结算', value: 'settled' },
            { text: '已支付', value: 'paid' },
          ],
        },
        width: 'half',
      },
      schema: {
        is_nullable: false,
        default_value: 'pending',
      },
    },
    {
      field: 'settled_at',
      type: 'timestamp',
      meta: {
        interface: 'datetime',
        width: 'half',
      },
      schema: {
        is_nullable: true,
      },
    },
    {
      field: 'paid_at',
      type: 'timestamp',
      meta: {
        interface: 'datetime',
        width: 'half',
      },
      schema: {
        is_nullable: true,
      },
    },
  ];

  for (const field of fields) {
    try {
      await axios.post(
        `${DIRECTUS_URL}/fields/partner_earnings`,
        field,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      console.log(`  ✅ 添加字段: ${field.field}`);
    } catch (error) {
      if (error.response?.data?.errors?.[0]?.message?.includes('already exists')) {
        console.log(`  ⏭️  字段已存在: ${field.field}`);
      } else {
        console.error(`  ❌ 添加字段失败 ${field.field}:`, error.response?.data?.errors?.[0]?.message || error.message);
      }
    }
  }
}

// 添加 referral_links 表字段
async function addReferralLinksFields() {
  console.log('\n📋 添加 referral_links 表字段...\n');

  const fields = [
    {
      field: 'partner_user_id',
      type: 'uuid',
      meta: {
        interface: 'input',
        required: true,
        width: 'half',
      },
      schema: {
        is_nullable: false,
      },
    },
    {
      field: 'code',
      type: 'string',
      meta: {
        interface: 'input',
        required: true,
        note: '唯一推荐码',
        width: 'half',
      },
      schema: {
        is_nullable: false,
        is_unique: true,
      },
    },
    {
      field: 'clicks',
      type: 'integer',
      meta: {
        interface: 'input',
        width: 'half',
      },
      schema: {
        is_nullable: false,
        default_value: 0,
      },
    },
    {
      field: 'conversions',
      type: 'integer',
      meta: {
        interface: 'input',
        note: '成功付费的用户数',
        width: 'half',
      },
      schema: {
        is_nullable: false,
        default_value: 0,
      },
    },
    {
      field: 'total_earnings',
      type: 'decimal',
      meta: {
        interface: 'input',
        width: 'half',
      },
      schema: {
        is_nullable: false,
        default_value: 0,
        numeric_precision: 10,
        numeric_scale: 2,
      },
    },
    {
      field: 'is_active',
      type: 'boolean',
      meta: {
        interface: 'boolean',
        width: 'half',
      },
      schema: {
        is_nullable: false,
        default_value: true,
      },
    },
  ];

  for (const field of fields) {
    try {
      await axios.post(
        `${DIRECTUS_URL}/fields/referral_links`,
        field,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      console.log(`  ✅ 添加字段: ${field.field}`);
    } catch (error) {
      if (error.response?.data?.errors?.[0]?.message?.includes('already exists')) {
        console.log(`  ⏭️  字段已存在: ${field.field}`);
      } else {
        console.error(`  ❌ 添加字段失败 ${field.field}:`, error.response?.data?.errors?.[0]?.message || error.message);
      }
    }
  }
}

// 更新现有记录的数据
async function updateMembershipData() {
  console.log('\n📋 更新会员等级数据...\n');

  const memberships = [
    {
      id: 1,
      name: 'Free',
      level: 0,
      price_monthly_usd: 0,
      price_yearly_usd: 0,
      content_access_level: 0,
      description: '<p>免费用户，可以访问基础内容</p>',
      features: {
        content_access: '20%基础内容',
        bookmarks: '5个收藏',
        news_access: '每日5条快讯',
        search: '基础搜索',
        ads: '显示广告',
      },
      is_active: true,
      sort_order: 1,
    },
    {
      id: 2,
      name: 'Pro',
      level: 1,
      price_monthly_usd: 39,
      price_yearly_usd: 390,
      content_access_level: 1,
      description: '<p>专业版，适合进阶用户</p>',
      features: {
        content_access: '60%中级内容',
        bookmarks: '无限收藏',
        news_access: '无限快讯',
        search: '高级搜索',
        ads: '无广告',
        export: '数据导出',
        priority_support: '优先支持',
      },
      is_active: true,
      sort_order: 2,
    },
    {
      id: 3,
      name: 'Max',
      level: 2,
      price_monthly_usd: 99,
      price_yearly_usd: 990,
      content_access_level: 2,
      description: '<p>最高级别，解锁全部内容</p>',
      features: {
        content_access: '100%全部内容',
        bookmarks: '无限收藏',
        news_access: '无限快讯',
        search: '高级搜索',
        ads: '无广告',
        export: '数据导出',
        ai_assistant: 'AI助手',
        exclusive_reports: '独家报告',
        priority_support: '优先支持',
        early_access: '新功能抢先体验',
      },
      is_active: true,
      sort_order: 3,
    },
    {
      id: 4,
      name: 'Partner',
      level: 3,
      price_monthly_usd: 200,
      price_yearly_usd: 2000,
      content_access_level: 3,
      description: '<p>玩法合伙人，享受收益分成</p>',
      features: {
        content_access: '100%全部内容',
        bookmarks: '无限收藏',
        news_access: '无限快讯',
        search: '高级搜索',
        ads: '无广告',
        export: '数据导出',
        ai_assistant: 'AI助手',
        exclusive_reports: '独家报告',
        priority_support: '优先支持',
        early_access: '新功能抢先体验',
        revenue_share: '推荐20%佣金 + 内容70%分成',
        publish_content: '发布自己的玩法',
        analytics: '数据分析面板',
      },
      is_active: true,
      sort_order: 4,
    },
  ];

  for (const membership of memberships) {
    try {
      await axios.patch(
        `${DIRECTUS_URL}/items/memberships/${membership.id}`,
        membership,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      console.log(`  ✅ 更新: ${membership.name}`);
    } catch (error) {
      console.error(`  ❌ 更新失败 ${membership.name}:`, error.response?.data?.errors?.[0]?.message || error.message);
    }
  }
}

async function main() {
  try {
    console.log('🚀 开始修复会员系统数据库字段...\n');

    await login();

    await addMembershipsFields();
    await addUserSubscriptionsFields();
    await addPaymentsFields();
    await addPartnerEarningsFields();
    await addReferralLinksFields();

    await updateMembershipData();

    console.log('\n✅ 所有字段添加完成！');
    console.log('\n🔗 访问 Directus: http://localhost:8055');

  } catch (error) {
    console.error('\n❌ 修复失败:', error.message);
    process.exit(1);
  }
}

main();
