const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';
const EMAIL = 'the_uk1@outlook.com';
const PASSWORD = 'Mygcdjmyxzg2026!';

async function createStaticPagesCollection() {
  try {
    console.log('🔧 创建静态页面集合...\n');

    // 1. 登录
    const loginResponse = await axios.post(`${DIRECTUS_URL}/auth/login`, {
      email: EMAIL,
      password: PASSWORD
    });
    const token = loginResponse.data.data.access_token;
    console.log('✓ 登录成功\n');

    // 2. 创建 static_pages 集合
    console.log('正在创建 static_pages 集合...');

    try {
      await axios.post(
        `${DIRECTUS_URL}/collections`,
        {
          collection: 'static_pages',
          meta: {
            collection: 'static_pages',
            icon: 'description',
            note: '静态页面内容管理（使用指南、常见问题、服务条款等）',
            display_template: '{{title}}',
            hidden: false,
            singleton: false,
            translations: [
              {
                language: 'zh-CN',
                translation: '静态页面',
                singular: '静态页面',
                plural: '静态页面'
              }
            ],
            archive_field: 'status',
            archive_app_filter: true,
            archive_value: 'archived',
            unarchive_value: 'draft',
            sort_field: 'sort',
            accountability: 'all',
            item_duplication_fields: null,
            sort: null,
            group: null,
            collapse: 'open'
          },
          schema: {
            name: 'static_pages'
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('✓ 集合创建成功\n');
    } catch (error) {
      if (error.response?.data?.errors?.[0]?.extensions?.code === 'RECORD_NOT_UNIQUE') {
        console.log('✓ 集合已存在，跳过创建\n');
      } else {
        throw error;
      }
    }

    // 3. 创建字段
    console.log('正在创建字段...\n');

    const fields = [
      // ID字段（自动创建，我们只需要配置）
      {
        collection: 'static_pages',
        field: 'id',
        type: 'uuid',
        schema: {
          is_primary_key: true,
          has_auto_increment: false,
        },
        meta: {
          interface: 'input',
          readonly: true,
          hidden: true,
          special: ['uuid'],
        }
      },
      // 状态字段
      {
        collection: 'static_pages',
        field: 'status',
        type: 'string',
        schema: {
          default_value: 'draft',
          is_nullable: false,
        },
        meta: {
          interface: 'select-dropdown',
          options: {
            choices: [
              { text: '草稿', value: 'draft' },
              { text: '已发布', value: 'published' },
              { text: '已归档', value: 'archived' }
            ]
          },
          display: 'labels',
          display_options: {
            showAsDot: true,
            choices: [
              { text: '草稿', value: 'draft', foreground: '#FFF', background: '#6B7280' },
              { text: '已发布', value: 'published', foreground: '#FFF', background: '#10B981' },
              { text: '已归档', value: 'archived', foreground: '#FFF', background: '#EF4444' }
            ]
          },
          width: 'half',
          sort: 1,
        }
      },
      // 排序字段
      {
        collection: 'static_pages',
        field: 'sort',
        type: 'integer',
        schema: {
          default_value: null,
          is_nullable: true,
        },
        meta: {
          interface: 'input',
          hidden: true,
        }
      },
      // slug（页面标识符）
      {
        collection: 'static_pages',
        field: 'slug',
        type: 'string',
        schema: {
          is_nullable: false,
          is_unique: true,
        },
        meta: {
          interface: 'input',
          options: {
            slug: true,
            placeholder: '页面唯一标识（如：guide, faq, terms）'
          },
          required: true,
          width: 'half',
          sort: 2,
          note: '页面URL标识符，必须唯一（如：guide, faq, terms, privacy, disclaimer, risk）'
        }
      },
      // 标题
      {
        collection: 'static_pages',
        field: 'title',
        type: 'string',
        schema: {
          is_nullable: false,
        },
        meta: {
          interface: 'input',
          required: true,
          width: 'full',
          sort: 3,
          note: '页面标题'
        }
      },
      // 描述
      {
        collection: 'static_pages',
        field: 'description',
        type: 'text',
        schema: {
          is_nullable: true,
        },
        meta: {
          interface: 'input-multiline',
          width: 'full',
          sort: 4,
          note: '页面简短描述（SEO用）'
        }
      },
      // Markdown 内容
      {
        collection: 'static_pages',
        field: 'content',
        type: 'text',
        schema: {
          is_nullable: false,
        },
        meta: {
          interface: 'input-rich-text-md',
          required: true,
          width: 'full',
          sort: 5,
          note: '页面内容（支持 Markdown 格式）'
        }
      },
      // 创建时间
      {
        collection: 'static_pages',
        field: 'created_at',
        type: 'timestamp',
        schema: {
          is_nullable: true,
        },
        meta: {
          interface: 'datetime',
          readonly: true,
          hidden: false,
          special: ['date-created'],
          width: 'half',
          sort: 6,
        }
      },
      // 更新时间
      {
        collection: 'static_pages',
        field: 'updated_at',
        type: 'timestamp',
        schema: {
          is_nullable: true,
        },
        meta: {
          interface: 'datetime',
          readonly: true,
          hidden: false,
          special: ['date-updated'],
          width: 'half',
          sort: 7,
        }
      },
    ];

    for (const field of fields) {
      try {
        await axios.post(
          `${DIRECTUS_URL}/fields/${field.collection}`,
          field,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        console.log(`  ✓ 创建字段: ${field.field}`);
      } catch (error) {
        if (error.response?.data?.errors?.[0]?.extensions?.code === 'RECORD_NOT_UNIQUE') {
          console.log(`  ✓ 字段已存在: ${field.field}`);
        } else {
          console.error(`  ✗ 创建字段失败: ${field.field}`, error.response?.data);
        }
      }
    }

    console.log('\n═'.repeat(60));
    console.log('✅ static_pages 集合创建完成！\n');
    console.log('📝 字段说明：');
    console.log('   - slug: 页面标识符（如：guide, faq, terms, privacy, disclaimer, risk）');
    console.log('   - title: 页面标题');
    console.log('   - description: 页面描述（SEO用）');
    console.log('   - content: Markdown 格式的页面内容');
    console.log('   - status: 发布状态（draft/published/archived）\n');

  } catch (error) {
    console.error('❌ 错误:', error.response?.data || error.message);
    process.exit(1);
  }
}

createStaticPagesCollection();
