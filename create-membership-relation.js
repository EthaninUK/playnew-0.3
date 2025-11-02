// 创建 user_subscriptions.membership_id -> memberships.id 的关系

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_ADMIN_TOKEN = 'yOca6E-ANGzkfn9nst59vbR6GwuochDB';

async function createRelation() {
  console.log('🔗 Creating membership_id relation...');
  console.log('');

  try {
    const relationData = {
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
    };

    console.log('Creating relation configuration...');
    const response = await fetch(`${DIRECTUS_URL}/relations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${DIRECTUS_ADMIN_TOKEN}`,
      },
      body: JSON.stringify(relationData),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('❌ Failed to create relation:');
      console.error(JSON.stringify(result, null, 2));
      return;
    }

    console.log('✅ Relation created!');
    console.log('');
    console.log('═══════════════════════════════════════');
    console.log('🎉 Success!');
    console.log('═══════════════════════════════════════');
    console.log('');
    console.log('Testing the relation...');

    // 测试关系
    const testResponse = await fetch(
      `${DIRECTUS_URL}/items/user_subscriptions/4?fields=*,membership_id.*`,
      {
        headers: {
          Authorization: `Bearer ${DIRECTUS_ADMIN_TOKEN}`,
        },
      }
    );

    const testData = await testResponse.json();

    if (testData.data?.membership_id?.name) {
      console.log('✅ Relation works perfectly!');
      console.log('   Subscription ID:', testData.data.id);
      console.log('   Membership:', testData.data.membership_id.name);
      console.log('   Level:', testData.data.membership_id.level);
      console.log('   Price:', '$' + testData.data.membership_id.price_monthly_usd);
    } else {
      console.log('⚠️  Relation created but data not loading');
      console.log('   Response:', JSON.stringify(testData, null, 2));
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createRelation();
