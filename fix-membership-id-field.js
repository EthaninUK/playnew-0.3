// 修复 user_subscriptions 表中的 membership_id 字段类型

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_ADMIN_TOKEN = 'yOca6E-ANGzkfn9nst59vbR6GwuochDB';

async function fixMembershipIdField() {
  console.log('🔧 Fixing membership_id field type...');
  console.log('');

  try {
    // 删除现有的 membership_id 字段
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

    if (!deleteResponse.ok) {
      const error = await deleteResponse.json();
      console.error('Failed to delete field:', error);
      // 继续,可能字段不存在
    } else {
      console.log('✅ Old field deleted');
    }

    console.log('');
    console.log('2. Creating new membership_id field as integer...');

    // 创建新的 membership_id 字段,类型为 integer
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

    console.log('✅ New membership_id field created as integer!');
    console.log('');
    console.log('═══════════════════════════════════════');
    console.log('🎉 Field type fixed!');
    console.log('═══════════════════════════════════════');
    console.log('');
    console.log('Now you can create subscriptions with integer membership IDs');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

fixMembershipIdField();
