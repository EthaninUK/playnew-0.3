// 修复 user_subscriptions 和 memberships 之间的关系

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_ADMIN_TOKEN = 'yOca6E-ANGzkfn9nst59vbR6GwuochDB';

async function fixMembershipRelation() {
  console.log('🔧 Fixing membership_id relation...');
  console.log('');

  try {
    // 1. 删除现有的 membership_id 字段
    console.log('1. Deleting old membership_id field...');
    const deleteResponse = await fetch(
      `${DIRECTUS_URL}/fields/user_subscriptions/membership_id`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${DIRECTUS_ADMIN_TOKEN}`,
        },
      }
    );

    if (deleteResponse.ok) {
      console.log('✅ Old field deleted');
    }
    console.log('');

    // 2. 创建新的 membership_id 字段，配置正确的 M2O 关系
    console.log('2. Creating membership_id field with M2O relation...');

    const createResponse = await fetch(
      `${DIRECTUS_URL}/fields/user_subscriptions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${DIRECTUS_ADMIN_TOKEN}`,
        },
        body: JSON.stringify({
          field: 'membership_id',
          type: 'integer',
          schema: {
            is_nullable: false,
            foreign_key_table: 'memberships',
            foreign_key_column: 'id',
          },
          meta: {
            interface: 'select-dropdown-m2o',
            display: 'related-values',
            display_options: {
              template: '{{name}}',
            },
            options: {
              template: '{{name}}',
            },
            special: ['m2o'],
            required: true,
          },
        }),
      }
    );

    const createResult = await createResponse.json();

    if (!createResponse.ok) {
      console.error('❌ Failed to create field:');
      console.error(JSON.stringify(createResult, null, 2));
      return;
    }

    console.log('✅ Field created with M2O relation!');
    console.log('');

    // 3. 创建关系配置
    console.log('3. Creating relation configuration...');

    const relationResponse = await fetch(
      `${DIRECTUS_URL}/relations`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${DIRECTUS_ADMIN_TOKEN}`,
        },
        body: JSON.stringify({
          collection: 'user_subscriptions',
          field: 'membership_id',
          related_collection: 'memberships',
          meta: {
            many_collection: 'user_subscriptions',
            many_field: 'membership_id',
            one_collection: 'memberships',
            one_field: null,
            one_allowed_collections: null,
            junction_field: null,
            sort_field: null,
          },
          schema: {
            on_delete: 'NO ACTION',
          },
        }),
      }
    );

    const relationResult = await relationResponse.json();

    if (!relationResponse.ok) {
      // 关系可能已存在,不是错误
      console.log('ℹ️  Relation configuration:', relationResult);
    } else {
      console.log('✅ Relation configured!');
    }

    console.log('');
    console.log('═══════════════════════════════════════');
    console.log('🎉 Relation fixed!');
    console.log('═══════════════════════════════════════');
    console.log('');
    console.log('Now testing the relation...');

    // 4. 测试关系是否正常工作
    const testResponse = await fetch(
      `${DIRECTUS_URL}/items/user_subscriptions/3?fields=*,membership_id.*`,
      {
        headers: {
          Authorization: `Bearer ${DIRECTUS_ADMIN_TOKEN}`,
        },
      }
    );

    const testData = await testResponse.json();

    if (testData.data?.membership_id?.name) {
      console.log('✅ Relation works!');
      console.log('   Membership:', testData.data.membership_id.name);
    } else {
      console.log('⚠️  Relation might need manual configuration in Directus UI');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

fixMembershipRelation();
