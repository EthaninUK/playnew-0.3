const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_EMAIL = 'the_uk1@outlook.com';
const DIRECTUS_PASSWORD = 'Mygcdjmyxzg2026!';

async function login() {
  const response = await axios.post(`${DIRECTUS_URL}/auth/login`, {
    email: DIRECTUS_EMAIL,
    password: DIRECTUS_PASSWORD,
  });
  return response.data.data.access_token;
}

async function createCollection(token) {
  try {
    // Create arbitrage_types collection
    await axios.post(
      `${DIRECTUS_URL}/collections`,
      {
        collection: 'arbitrage_types',
        meta: {
          collection: 'arbitrage_types',
          icon: 'currency_exchange',
          note: '套利类型数据',
          display_template: null,
          hidden: false,
          singleton: false,
          translations: null,
          archive_field: 'status',
          archive_app_filter: true,
          archive_value: 'archived',
          unarchive_value: 'draft',
          sort_field: 'sort',
        },
        schema: {
          name: 'arbitrage_types',
        },
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log('✅ Created arbitrage_types collection');
  } catch (error) {
    if (error.response?.data?.errors?.[0]?.extensions?.code === 'RECORD_NOT_UNIQUE') {
      console.log('ℹ️  Collection already exists');
    } else {
      throw error;
    }
  }
}

async function createFields(token) {
  const fields = [
    // Primary key
    {
      collection: 'arbitrage_types',
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
    // Basic info fields
    {
      collection: 'arbitrage_types',
      field: 'slug',
      type: 'string',
      meta: {
        interface: 'input',
        required: true,
        options: {
          placeholder: '例如: spot-arbitrage',
        },
        note: 'URL友好的标识符',
      },
      schema: {
        is_unique: true,
      },
    },
    {
      collection: 'arbitrage_types',
      field: 'title',
      type: 'string',
      meta: {
        interface: 'input',
        required: true,
        options: {
          placeholder: '例如: 跨所价差套利',
        },
      },
      schema: {},
    },
    {
      collection: 'arbitrage_types',
      field: 'title_en',
      type: 'string',
      meta: {
        interface: 'input',
        options: {
          placeholder: 'e.g., Spot Arbitrage',
        },
        note: '英文标题（可选）',
      },
      schema: {},
    },
    {
      collection: 'arbitrage_types',
      field: 'category',
      type: 'string',
      meta: {
        interface: 'select-dropdown',
        required: true,
        options: {
          choices: [
            { text: '现货/交易所微观结构', value: 'spot-microstructure' },
            { text: '衍生品/合约', value: 'derivatives' },
            { text: '稳定币/法币', value: 'stablecoin-fiat' },
            { text: '链与链之间', value: 'cross-chain' },
            { text: 'DeFi内部', value: 'defi-internal' },
            { text: '周期/时间相关', value: 'temporal' },
            { text: '治理/机制', value: 'governance' },
            { text: '信息/事件驱动', value: 'information-driven' },
            { text: 'MEV/交易策略', value: 'mev-trading' },
            { text: '监管/合规', value: 'regulatory' },
          ],
        },
      },
      schema: {},
    },
    {
      collection: 'arbitrage_types',
      field: 'summary',
      type: 'text',
      meta: {
        interface: 'input-multiline',
        required: true,
        options: {
          placeholder: '一句话简介（50-100字）',
        },
      },
      schema: {},
    },
    {
      collection: 'arbitrage_types',
      field: 'description',
      type: 'text',
      meta: {
        interface: 'input-rich-text-md',
        required: true,
        options: {
          placeholder: '详细描述（支持Markdown）',
        },
        note: '详细的套利类型说明，包括原理、操作方法等',
      },
      schema: {},
    },
    // Characteristics
    {
      collection: 'arbitrage_types',
      field: 'difficulty_level',
      type: 'integer',
      meta: {
        interface: 'select-dropdown',
        required: true,
        options: {
          choices: [
            { text: '初级 - 适合新手', value: 1 },
            { text: '中级 - 需要一定经验', value: 2 },
            { text: '高级 - 需要专业知识', value: 3 },
          ],
        },
      },
      schema: {
        default_value: 1,
      },
    },
    {
      collection: 'arbitrage_types',
      field: 'risk_level',
      type: 'integer',
      meta: {
        interface: 'select-dropdown',
        required: true,
        options: {
          choices: [
            { text: '低风险', value: 1 },
            { text: '中等风险', value: 2 },
            { text: '高风险', value: 3 },
          ],
        },
      },
      schema: {
        default_value: 1,
      },
    },
    {
      collection: 'arbitrage_types',
      field: 'capital_requirement',
      type: 'string',
      meta: {
        interface: 'select-dropdown',
        options: {
          choices: [
            { text: '小额 (<$1,000)', value: 'small' },
            { text: '中等 ($1,000-$10,000)', value: 'medium' },
            { text: '大额 ($10,000-$100,000)', value: 'large' },
            { text: '超大 (>$100,000)', value: 'very-large' },
          ],
        },
      },
      schema: {},
    },
    {
      collection: 'arbitrage_types',
      field: 'profit_potential',
      type: 'string',
      meta: {
        interface: 'input',
        options: {
          placeholder: '例如: 0.1%-0.5% 每次',
        },
        note: '预期收益范围',
      },
      schema: {},
    },
    {
      collection: 'arbitrage_types',
      field: 'execution_speed',
      type: 'string',
      meta: {
        interface: 'select-dropdown',
        options: {
          choices: [
            { text: '秒级 - 需要快速执行', value: 'seconds' },
            { text: '分钟级 - 几分钟内完成', value: 'minutes' },
            { text: '小时级 - 数小时内完成', value: 'hours' },
            { text: '天级 - 可能需要数天', value: 'days' },
          ],
        },
      },
      schema: {},
    },
    // Content sections (Markdown)
    {
      collection: 'arbitrage_types',
      field: 'how_it_works',
      type: 'text',
      meta: {
        interface: 'input-rich-text-md',
        options: {
          placeholder: '## 工作原理\n\n详细说明这种套利是如何运作的...',
        },
      },
      schema: {},
    },
    {
      collection: 'arbitrage_types',
      field: 'step_by_step',
      type: 'text',
      meta: {
        interface: 'input-rich-text-md',
        options: {
          placeholder: '## 操作步骤\n\n1. 第一步...\n2. 第二步...',
        },
      },
      schema: {},
    },
    {
      collection: 'arbitrage_types',
      field: 'requirements',
      type: 'text',
      meta: {
        interface: 'input-rich-text-md',
        options: {
          placeholder: '## 所需条件\n\n- 交易所账户\n- 资金要求\n- 技术工具',
        },
      },
      schema: {},
    },
    {
      collection: 'arbitrage_types',
      field: 'risks',
      type: 'text',
      meta: {
        interface: 'input-rich-text-md',
        options: {
          placeholder: '## 风险提示\n\n1. 主要风险\n2. 如何规避',
        },
      },
      schema: {},
    },
    {
      collection: 'arbitrage_types',
      field: 'tips',
      type: 'text',
      meta: {
        interface: 'input-rich-text-md',
        options: {
          placeholder: '## 实用技巧\n\n- 技巧1\n- 技巧2',
        },
      },
      schema: {},
    },
    {
      collection: 'arbitrage_types',
      field: 'example',
      type: 'text',
      meta: {
        interface: 'input-rich-text-md',
        options: {
          placeholder: '## 实例分析\n\n具体的套利案例...',
        },
      },
      schema: {},
    },
    {
      collection: 'arbitrage_types',
      field: 'tools_resources',
      type: 'text',
      meta: {
        interface: 'input-rich-text-md',
        options: {
          placeholder: '## 工具与资源\n\n推荐的工具、平台、API等',
        },
      },
      schema: {},
    },
    // Real-time monitoring flag
    {
      collection: 'arbitrage_types',
      field: 'has_realtime_data',
      type: 'boolean',
      meta: {
        interface: 'boolean',
        note: '是否提供实时数据监控',
      },
      schema: {
        default_value: false,
      },
    },
    {
      collection: 'arbitrage_types',
      field: 'realtime_api_endpoint',
      type: 'string',
      meta: {
        interface: 'input',
        options: {
          placeholder: '/api/arbitrage/spot-arbitrage',
        },
        note: 'API端点（如果提供实时数据）',
      },
      schema: {},
    },
    // Tags
    {
      collection: 'arbitrage_types',
      field: 'tags',
      type: 'json',
      meta: {
        interface: 'tags',
        options: {
          placeholder: '添加标签（如: CEX, DEX, 低风险, 高频等）',
        },
      },
      schema: {},
    },
    // Metadata
    {
      collection: 'arbitrage_types',
      field: 'sort',
      type: 'integer',
      meta: {
        interface: 'input',
        note: '排序权重（数字越小越靠前）',
      },
      schema: {},
    },
    {
      collection: 'arbitrage_types',
      field: 'status',
      type: 'string',
      meta: {
        interface: 'select-dropdown',
        options: {
          choices: [
            { text: '草稿', value: 'draft' },
            { text: '已发布', value: 'published' },
            { text: '已归档', value: 'archived' },
          ],
        },
      },
      schema: {
        default_value: 'draft',
      },
    },
    {
      collection: 'arbitrage_types',
      field: 'featured',
      type: 'boolean',
      meta: {
        interface: 'boolean',
        note: '是否在首页推荐展示',
      },
      schema: {
        default_value: false,
      },
    },
    {
      collection: 'arbitrage_types',
      field: 'view_count',
      type: 'integer',
      meta: {
        interface: 'input',
        readonly: true,
      },
      schema: {
        default_value: 0,
      },
    },
    {
      collection: 'arbitrage_types',
      field: 'created_at',
      type: 'timestamp',
      meta: {
        interface: 'datetime',
        readonly: true,
        special: ['date-created'],
      },
      schema: {},
    },
    {
      collection: 'arbitrage_types',
      field: 'updated_at',
      type: 'timestamp',
      meta: {
        interface: 'datetime',
        readonly: true,
        special: ['date-updated'],
      },
      schema: {},
    },
  ];

  for (const field of fields) {
    try {
      await axios.post(`${DIRECTUS_URL}/fields/${field.collection}`, field, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(`✅ Created field: ${field.field}`);
    } catch (error) {
      if (error.response?.data?.errors?.[0]?.message?.includes('already exists')) {
        console.log(`ℹ️  Field already exists: ${field.field}`);
      } else {
        console.error(`❌ Error creating field ${field.field}:`, error.response?.data || error.message);
      }
    }
  }
}

async function setupPublicPermissions(token) {
  try {
    // Get Public role
    const rolesResponse = await axios.get(`${DIRECTUS_URL}/roles?filter[name][_eq]=Public`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (rolesResponse.data.data.length === 0) {
      console.log('❌ Public role not found');
      return;
    }

    const publicRoleId = rolesResponse.data.data[0].id;

    // Create read permission for Public role
    await axios.post(
      `${DIRECTUS_URL}/permissions`,
      {
        role: publicRoleId,
        collection: 'arbitrage_types',
        action: 'read',
        permissions: {
          status: {
            _eq: 'published',
          },
        },
        fields: ['*'],
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log('✅ Created public read permission');
  } catch (error) {
    if (error.response?.data?.errors?.[0]?.extensions?.code === 'RECORD_NOT_UNIQUE') {
      console.log('ℹ️  Public permission already exists');
    } else {
      console.error('❌ Error setting up permissions:', error.response?.data || error.message);
    }
  }
}

async function main() {
  try {
    console.log('🔐 Logging in...');
    const token = await login();
    console.log('✅ Logged in successfully\n');

    console.log('📦 Creating collection...');
    await createCollection(token);
    console.log('');

    console.log('📝 Creating fields...');
    await createFields(token);
    console.log('');

    console.log('🔓 Setting up public permissions...');
    await setupPublicPermissions(token);
    console.log('');

    console.log('✨ Done! Collection setup complete.');
    console.log('\n📌 Next steps:');
    console.log('1. Run: node add-arbitrage-sample-data.js');
    console.log('2. Visit http://localhost:8055/admin/content/arbitrage_types');
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    process.exit(1);
  }
}

main();
