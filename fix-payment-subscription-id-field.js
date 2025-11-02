// 修复 payments 表中的 subscription_id 字段类型

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_ADMIN_TOKEN = 'yOca6E-ANGzkfn9nst59vbR6GwuochDB';

async function fixSubscriptionIdField() {
  console.log('🔧 Fixing subscription_id field type in payments table...');
  console.log('');

  try {
    // 删除现有的 subscription_id 字段
    console.log('1. Deleting old subscription_id field...');
    const deleteResponse = await fetch(
      `${DIRECTUS_URL}/fields/payments/subscription_id`,
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
    console.log('2. Creating new subscription_id field as integer...');

    // 创建新的 subscription_id 字段,类型为 integer
    const createResponse = await fetch(
      `${DIRECTUS_URL}/fields/payments`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${DIRECTUS_ADMIN_TOKEN}`,
        },
        body: JSON.stringify({
          field: 'subscription_id',
          type: 'integer',
          schema: {
            is_nullable: false,
          },
          meta: {
            interface: 'select-dropdown-m2o',
            display: 'related-values',
            display_options: {
              template: '{{user_id}} - {{membership_id}}',
            },
            options: {
              template: '{{user_id}} - {{membership_id}}',
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

    console.log('✅ New subscription_id field created as integer!');
    console.log('');
    console.log('═══════════════════════════════════════');
    console.log('🎉 Field type fixed!');
    console.log('═══════════════════════════════════════');
    console.log('');
    console.log('Now you can create payment records with integer subscription IDs');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

fixSubscriptionIdField();
