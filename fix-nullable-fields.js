const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_EMAIL = 'the_uk1@outlook.com';
const DIRECTUS_PASSWORD = 'Mygcdjmyxzg2026!';

let accessToken = '';

async function login() {
  const response = await axios.post(`${DIRECTUS_URL}/auth/login`, {
    email: DIRECTUS_EMAIL,
    password: DIRECTUS_PASSWORD,
  });
  accessToken = response.data.data.access_token;
  console.log('✅ 登录成功\n');
  return accessToken;
}

async function main() {
  try {
    console.log('🚀 修复 memberships 表的核心字段...\n');

    await login();

    const config = {
      headers: { Authorization: `Bearer ${accessToken}` },
    };

    // Step 1: 添加字段为可空
    console.log('📋 添加可空字段...\n');

    const nullableFields = [
      {
        field: 'name',
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
        field: 'level',
        type: 'integer',
        meta: {
          interface: 'input',
          note: '0-Free, 1-Pro, 2-Max, 3-Partner',
          width: 'half',
        },
        schema: {
          is_nullable: true,
        },
      },
      {
        field: 'price_monthly_usd',
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
        field: 'price_yearly_usd',
        type: 'decimal',
        meta: {
          interface: 'input',
          note: '年付=10个月价格',
          width: 'half',
        },
        schema: {
          is_nullable: true,
          numeric_precision: 10,
          numeric_scale: 2,
        },
      },
    ];

    for (const field of nullableFields) {
      try {
        await axios.post(
          `${DIRECTUS_URL}/fields/memberships`,
          field,
          config
        );
        console.log(`  ✅ 添加字段: ${field.field}`);
      } catch (error) {
        if (error.response?.data?.errors?.[0]?.message?.includes('already exists')) {
          console.log(`  ⏭️  字段已存在: ${field.field}`);
        } else {
          console.error(`  ❌ 添加失败 ${field.field}:`, error.response?.data?.errors?.[0]?.message || error.message);
        }
      }
    }

    // Step 2: 更新现有记录的数据
    console.log('\n📋 更新会员数据...\n');

    const memberships = [
      {
        id: 1,
        name: 'Free',
        level: 0,
        price_monthly_usd: 0,
        price_yearly_usd: 0,
      },
      {
        id: 2,
        name: 'Pro',
        level: 1,
        price_monthly_usd: 39,
        price_yearly_usd: 390,
      },
      {
        id: 3,
        name: 'Max',
        level: 2,
        price_monthly_usd: 99,
        price_yearly_usd: 990,
      },
      {
        id: 4,
        name: 'Partner',
        level: 3,
        price_monthly_usd: 200,
        price_yearly_usd: 2000,
      },
    ];

    for (const membership of memberships) {
      try {
        await axios.patch(
          `${DIRECTUS_URL}/items/memberships/${membership.id}`,
          membership,
          config
        );
        console.log(`  ✅ 更新: ${membership.name}`);
      } catch (error) {
        console.error(`  ❌ 更新失败 ${membership.name}:`, error.response?.data?.errors?.[0]?.message || error.message);
      }
    }

    // Step 3: 更新字段约束为 NOT NULL (optional - 可以在 Directus UI 中手动设置)
    console.log('\n✅ 字段修复完成！');
    console.log('\n💡 提示: 如需设置字段为 NOT NULL,请在 Directus 管理界面中手动更新字段约束。');
    console.log('\n🔗 访问 Directus: http://localhost:8055');

  } catch (error) {
    console.error('\n❌ 修复失败:', error.message);
    process.exit(1);
  }
}

main();
