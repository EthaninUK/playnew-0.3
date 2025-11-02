const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_EMAIL = 'the_uk1@outlook.com';
const DIRECTUS_PASSWORD = 'Mygcdjmyxzg2026!';

let accessToken = '';

// 登录获取 token
async function login() {
  try {
    const response = await axios.post(`${DIRECTUS_URL}/auth/login`, {
      email: DIRECTUS_EMAIL,
      password: DIRECTUS_PASSWORD,
    });
    accessToken = response.data.data.access_token;
    console.log('✅ 登录成功');
    return accessToken;
  } catch (error) {
    console.error('❌ 登录失败:', error.response?.data || error.message);
    throw error;
  }
}

// 创建 memberships 表
async function createMembershipsTable() {
  try {
    console.log('\n📋 创建 memberships 表...');

    // 创建集合
    await axios.post(
      `${DIRECTUS_URL}/collections`,
      {
        collection: 'memberships',
        meta: {
          icon: 'workspace_premium',
          note: '会员等级定义表',
          display_template: '{{name}} - ${{price_monthly_usd}}/月',
          singleton: false,
          translations: [
            {
              language: 'zh-CN',
              translation: '会员等级',
            },
          ],
        },
        schema: {
          name: 'memberships',
        },
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    // 创建字段
    const fields = [
      {
        field: 'id',
        type: 'uuid',
        meta: {
          hidden: true,
          readonly: true,
          interface: 'input',
          special: ['uuid'],
        },
        schema: {
          is_primary_key: true,
          has_auto_increment: false,
        },
      },
      {
        field: 'name',
        type: 'string',
        meta: {
          interface: 'input',
          required: true,
          translations: [{ language: 'zh-CN', translation: '会员名称' }],
          options: {
            placeholder: 'Free, Pro, Max, Partner',
          },
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
          translations: [{ language: 'zh-CN', translation: '会员等级' }],
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
          translations: [{ language: 'zh-CN', translation: '月付价格(USD)' }],
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
          translations: [{ language: 'zh-CN', translation: '年付价格(USD)' }],
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
          translations: [{ language: 'zh-CN', translation: '内容访问等级' }],
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
          translations: [{ language: 'zh-CN', translation: '功能列表' }],
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
          translations: [{ language: 'zh-CN', translation: '描述' }],
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
          translations: [{ language: 'zh-CN', translation: '是否激活' }],
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
          translations: [{ language: 'zh-CN', translation: '排序' }],
          width: 'half',
        },
        schema: {
          is_nullable: true,
        },
      },
      {
        field: 'created_at',
        type: 'timestamp',
        meta: {
          interface: 'datetime',
          readonly: true,
          special: ['date-created'],
          translations: [{ language: 'zh-CN', translation: '创建时间' }],
        },
        schema: {
          is_nullable: true,
        },
      },
      {
        field: 'updated_at',
        type: 'timestamp',
        meta: {
          interface: 'datetime',
          readonly: true,
          special: ['date-updated'],
          translations: [{ language: 'zh-CN', translation: '更新时间' }],
        },
        schema: {
          is_nullable: true,
        },
      },
    ];

    for (const field of fields) {
      await axios.post(
        `${DIRECTUS_URL}/fields/memberships`,
        field,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
    }

    console.log('✅ memberships 表创建成功');
  } catch (error) {
    console.error('❌ 创建 memberships 表失败:', error.response?.data || error.message);
  }
}

// 创建 user_subscriptions 表
async function createUserSubscriptionsTable() {
  try {
    console.log('\n📋 创建 user_subscriptions 表...');

    // 创建集合
    await axios.post(
      `${DIRECTUS_URL}/collections`,
      {
        collection: 'user_subscriptions',
        meta: {
          icon: 'card_membership',
          note: '用户订阅记录表',
          display_template: '{{user_id}} - {{membership_id}}',
          singleton: false,
          translations: [
            {
              language: 'zh-CN',
              translation: '用户订阅',
            },
          ],
        },
        schema: {
          name: 'user_subscriptions',
        },
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    // 创建字段
    const fields = [
      {
        field: 'id',
        type: 'uuid',
        meta: {
          hidden: true,
          readonly: true,
          interface: 'input',
          special: ['uuid'],
        },
        schema: {
          is_primary_key: true,
          has_auto_increment: false,
        },
      },
      {
        field: 'user_id',
        type: 'uuid',
        meta: {
          interface: 'input',
          required: true,
          translations: [{ language: 'zh-CN', translation: '用户ID' }],
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
          translations: [{ language: 'zh-CN', translation: '会员等级' }],
          options: {
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
          translations: [{ language: 'zh-CN', translation: '订阅状态' }],
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
          translations: [{ language: 'zh-CN', translation: '付费周期' }],
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
          translations: [{ language: 'zh-CN', translation: '支付方式' }],
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
          translations: [{ language: 'zh-CN', translation: '支付金额(USD)' }],
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
          translations: [{ language: 'zh-CN', translation: 'Stripe订阅ID' }],
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
          translations: [{ language: 'zh-CN', translation: '加密货币支付ID' }],
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
          translations: [{ language: 'zh-CN', translation: '开始日期' }],
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
          translations: [{ language: 'zh-CN', translation: '结束日期' }],
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
          translations: [{ language: 'zh-CN', translation: '自动续费' }],
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
          translations: [{ language: 'zh-CN', translation: '取消日期' }],
          width: 'half',
        },
        schema: {
          is_nullable: true,
        },
      },
      {
        field: 'created_at',
        type: 'timestamp',
        meta: {
          interface: 'datetime',
          readonly: true,
          special: ['date-created'],
          translations: [{ language: 'zh-CN', translation: '创建时间' }],
        },
        schema: {
          is_nullable: true,
        },
      },
      {
        field: 'updated_at',
        type: 'timestamp',
        meta: {
          interface: 'datetime',
          readonly: true,
          special: ['date-updated'],
          translations: [{ language: 'zh-CN', translation: '更新时间' }],
        },
        schema: {
          is_nullable: true,
        },
      },
    ];

    for (const field of fields) {
      await axios.post(
        `${DIRECTUS_URL}/fields/user_subscriptions`,
        field,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
    }

    console.log('✅ user_subscriptions 表创建成功');
  } catch (error) {
    console.error('❌ 创建 user_subscriptions 表失败:', error.response?.data || error.message);
  }
}

// 创建 payments 表
async function createPaymentsTable() {
  try {
    console.log('\n📋 创建 payments 表...');

    // 创建集合
    await axios.post(
      `${DIRECTUS_URL}/collections`,
      {
        collection: 'payments',
        meta: {
          icon: 'payments',
          note: '支付记录表',
          display_template: '{{user_id}} - ${{amount}} - {{status}}',
          singleton: false,
          translations: [
            {
              language: 'zh-CN',
              translation: '支付记录',
            },
          ],
        },
        schema: {
          name: 'payments',
        },
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    // 创建字段
    const fields = [
      {
        field: 'id',
        type: 'uuid',
        meta: {
          hidden: true,
          readonly: true,
          interface: 'input',
          special: ['uuid'],
        },
        schema: {
          is_primary_key: true,
          has_auto_increment: false,
        },
      },
      {
        field: 'user_id',
        type: 'uuid',
        meta: {
          interface: 'input',
          required: true,
          translations: [{ language: 'zh-CN', translation: '用户ID' }],
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
          translations: [{ language: 'zh-CN', translation: '订阅ID' }],
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
          translations: [{ language: 'zh-CN', translation: '支付方式' }],
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
          translations: [{ language: 'zh-CN', translation: '支付金额' }],
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
          translations: [{ language: 'zh-CN', translation: '货币' }],
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
          translations: [{ language: 'zh-CN', translation: '支付状态' }],
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
          translations: [{ language: 'zh-CN', translation: 'Stripe支付意向ID' }],
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
          translations: [{ language: 'zh-CN', translation: '加密货币交易哈希' }],
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
          translations: [{ language: 'zh-CN', translation: '元数据' }],
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
          translations: [{ language: 'zh-CN', translation: '支付时间' }],
          width: 'half',
        },
        schema: {
          is_nullable: true,
        },
      },
      {
        field: 'created_at',
        type: 'timestamp',
        meta: {
          interface: 'datetime',
          readonly: true,
          special: ['date-created'],
          translations: [{ language: 'zh-CN', translation: '创建时间' }],
        },
        schema: {
          is_nullable: true,
        },
      },
      {
        field: 'updated_at',
        type: 'timestamp',
        meta: {
          interface: 'datetime',
          readonly: true,
          special: ['date-updated'],
          translations: [{ language: 'zh-CN', translation: '更新时间' }],
        },
        schema: {
          is_nullable: true,
        },
      },
    ];

    for (const field of fields) {
      await axios.post(
        `${DIRECTUS_URL}/fields/payments`,
        field,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
    }

    console.log('✅ payments 表创建成功');
  } catch (error) {
    console.error('❌ 创建 payments 表失败:', error.response?.data || error.message);
  }
}

// 创建 partner_earnings 表
async function createPartnerEarningsTable() {
  try {
    console.log('\n📋 创建 partner_earnings 表...');

    // 创建集合
    await axios.post(
      `${DIRECTUS_URL}/collections`,
      {
        collection: 'partner_earnings',
        meta: {
          icon: 'monetization_on',
          note: '合伙人收益记录表',
          display_template: '{{user_id}} - ${{amount}} - {{type}}',
          singleton: false,
          translations: [
            {
              language: 'zh-CN',
              translation: '合伙人收益',
            },
          ],
        },
        schema: {
          name: 'partner_earnings',
        },
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    // 创建字段
    const fields = [
      {
        field: 'id',
        type: 'uuid',
        meta: {
          hidden: true,
          readonly: true,
          interface: 'input',
          special: ['uuid'],
        },
        schema: {
          is_primary_key: true,
          has_auto_increment: false,
        },
      },
      {
        field: 'partner_user_id',
        type: 'uuid',
        meta: {
          interface: 'input',
          required: true,
          translations: [{ language: 'zh-CN', translation: '合伙人用户ID' }],
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
          translations: [{ language: 'zh-CN', translation: '收益类型' }],
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
          translations: [{ language: 'zh-CN', translation: '收益金额(USD)' }],
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
          translations: [{ language: 'zh-CN', translation: '来源用户ID' }],
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
          translations: [{ language: 'zh-CN', translation: '来源内容ID' }],
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
          translations: [{ language: 'zh-CN', translation: '关联支付ID' }],
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
          translations: [{ language: 'zh-CN', translation: '状态' }],
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
          translations: [{ language: 'zh-CN', translation: '结算时间' }],
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
          translations: [{ language: 'zh-CN', translation: '支付时间' }],
          width: 'half',
        },
        schema: {
          is_nullable: true,
        },
      },
      {
        field: 'created_at',
        type: 'timestamp',
        meta: {
          interface: 'datetime',
          readonly: true,
          special: ['date-created'],
          translations: [{ language: 'zh-CN', translation: '创建时间' }],
        },
        schema: {
          is_nullable: true,
        },
      },
      {
        field: 'updated_at',
        type: 'timestamp',
        meta: {
          interface: 'datetime',
          readonly: true,
          special: ['date-updated'],
          translations: [{ language: 'zh-CN', translation: '更新时间' }],
        },
        schema: {
          is_nullable: true,
        },
      },
    ];

    for (const field of fields) {
      await axios.post(
        `${DIRECTUS_URL}/fields/partner_earnings`,
        field,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
    }

    console.log('✅ partner_earnings 表创建成功');
  } catch (error) {
    console.error('❌ 创建 partner_earnings 表失败:', error.response?.data || error.message);
  }
}

// 创建 referral_links 表
async function createReferralLinksTable() {
  try {
    console.log('\n📋 创建 referral_links 表...');

    // 创建集合
    await axios.post(
      `${DIRECTUS_URL}/collections`,
      {
        collection: 'referral_links',
        meta: {
          icon: 'link',
          note: '推荐链接表',
          display_template: '{{code}} - {{partner_user_id}}',
          singleton: false,
          translations: [
            {
              language: 'zh-CN',
              translation: '推荐链接',
            },
          ],
        },
        schema: {
          name: 'referral_links',
        },
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    // 创建字段
    const fields = [
      {
        field: 'id',
        type: 'uuid',
        meta: {
          hidden: true,
          readonly: true,
          interface: 'input',
          special: ['uuid'],
        },
        schema: {
          is_primary_key: true,
          has_auto_increment: false,
        },
      },
      {
        field: 'partner_user_id',
        type: 'uuid',
        meta: {
          interface: 'input',
          required: true,
          translations: [{ language: 'zh-CN', translation: '合伙人用户ID' }],
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
          translations: [{ language: 'zh-CN', translation: '推荐码' }],
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
          translations: [{ language: 'zh-CN', translation: '点击次数' }],
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
          translations: [{ language: 'zh-CN', translation: '转化次数' }],
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
          translations: [{ language: 'zh-CN', translation: '总收益(USD)' }],
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
          translations: [{ language: 'zh-CN', translation: '是否激活' }],
          width: 'half',
        },
        schema: {
          is_nullable: false,
          default_value: true,
        },
      },
      {
        field: 'created_at',
        type: 'timestamp',
        meta: {
          interface: 'datetime',
          readonly: true,
          special: ['date-created'],
          translations: [{ language: 'zh-CN', translation: '创建时间' }],
        },
        schema: {
          is_nullable: true,
        },
      },
      {
        field: 'updated_at',
        type: 'timestamp',
        meta: {
          interface: 'datetime',
          readonly: true,
          special: ['date-updated'],
          translations: [{ language: 'zh-CN', translation: '更新时间' }],
        },
        schema: {
          is_nullable: true,
        },
      },
    ];

    for (const field of fields) {
      await axios.post(
        `${DIRECTUS_URL}/fields/referral_links`,
        field,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
    }

    console.log('✅ referral_links 表创建成功');
  } catch (error) {
    console.error('❌ 创建 referral_links 表失败:', error.response?.data || error.message);
  }
}

// 初始化会员等级数据
async function initializeMembershipData() {
  try {
    console.log('\n📋 初始化会员等级数据...');

    const memberships = [
      {
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
      await axios.post(
        `${DIRECTUS_URL}/items/memberships`,
        membership,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
    }

    console.log('✅ 会员等级数据初始化成功');
  } catch (error) {
    console.error('❌ 初始化会员等级数据失败:', error.response?.data || error.message);
  }
}

// 主函数
async function main() {
  try {
    console.log('🚀 开始配置会员系统数据库...\n');

    await login();

    await createMembershipsTable();
    await createUserSubscriptionsTable();
    await createPaymentsTable();
    await createPartnerEarningsTable();
    await createReferralLinksTable();

    await initializeMembershipData();

    console.log('\n✅ 所有数据库表创建完成！');
    console.log('\n📊 创建的表：');
    console.log('   - memberships (会员等级定义)');
    console.log('   - user_subscriptions (用户订阅记录)');
    console.log('   - payments (支付记录)');
    console.log('   - partner_earnings (合伙人收益)');
    console.log('   - referral_links (推荐链接)');
    console.log('\n🎉 会员系统数据库配置成功！');
    console.log('\n🔗 访问 Directus: http://localhost:8055');

  } catch (error) {
    console.error('\n❌ 配置失败:', error.message);
    process.exit(1);
  }
}

main();
