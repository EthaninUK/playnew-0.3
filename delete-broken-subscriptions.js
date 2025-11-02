// 删除所有 user_subscriptions 记录,然后重建字段和数据

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_ADMIN_TOKEN = 'yOca6E-ANGzkfn9nst59vbR6GwuochDB';

async function deleteAllAndRebuild() {
  console.log('🧹 Cleaning up user_subscriptions table...');
  console.log('');

  try {
    // 1. 获取所有订阅记录
    console.log('1. Fetching all subscription records...');
    const fetchResponse = await fetch(
      `${DIRECTUS_URL}/items/user_subscriptions?fields=id`,
      {
        headers: {
          Authorization: `Bearer ${DIRECTUS_ADMIN_TOKEN}`,
        },
      }
    );

    const fetchData = await fetchResponse.json();
    const ids = fetchData.data?.map(r => r.id) || [];

    console.log(`   Found ${ids.length} records`);
    console.log('');

    // 2. 删除所有记录
    if (ids.length > 0) {
      console.log('2. Deleting all records...');
      for (const id of ids) {
        await fetch(`${DIRECTUS_URL}/items/user_subscriptions/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${DIRECTUS_ADMIN_TOKEN}`,
          },
        });
        console.log(`   ✅ Deleted ID: ${id}`);
      }
    }

    console.log('');
    console.log('3. Creating membership_id field...');

    // 3. 创建 membership_id 字段(现在表是空的，应该不会报错)
    const createFieldResponse = await fetch(
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

    const fieldResult = await createFieldResponse.json();

    if (!createFieldResponse.ok) {
      console.error('   ❌ Failed to create field:');
      console.error(JSON.stringify(fieldResult, null, 2));
      return;
    }

    console.log('   ✅ Field created!');
    console.log('');

    // 4. 创建关系
    console.log('4. Creating M2O relation...');

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
          },
          schema: {
            on_delete: 'NO ACTION',
          },
        }),
      }
    );

    const relationResult = await relationResponse.json();

    if (!relationResponse.ok && relationResult.errors?.[0]?.extensions?.code !== 'RECORD_NOT_UNIQUE') {
      console.error('   ❌ Failed to create relation:');
      console.error(JSON.stringify(relationResult, null, 2));
    } else {
      console.log('   ✅ Relation created!');
    }

    console.log('');
    console.log('═══════════════════════════════════════');
    console.log('🎉 Table cleaned and field recreated!');
    console.log('═══════════════════════════════════════');
    console.log('');
    console.log('Next step: Run create-pro-subscription.js to create test data');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

deleteAllAndRebuild();
