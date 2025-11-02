// 检查订阅数据是否存在

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_ADMIN_TOKEN = 'yOca6E-ANGzkfn9nst59vbR6GwuochDB';
const USER_ID = '24da5b63-cda3-424d-b98e-dfa32cb61278';

async function checkData() {
  console.log('🔍 Checking subscription data...');
  console.log('');

  try {
    // 1. 检查用户订阅
    console.log('1️⃣ Checking user_subscriptions table:');
    const subUrl = `${DIRECTUS_URL}/items/user_subscriptions?filter[user_id][_eq]=${USER_ID}`;
    console.log('URL:', subUrl);

    const subResponse = await fetch(subUrl, {
      headers: {
        'Authorization': `Bearer ${DIRECTUS_ADMIN_TOKEN}`,
      },
    });

    console.log('Status:', subResponse.status);
    const subData = await subResponse.json();

    if (subData.data && subData.data.length > 0) {
      console.log(`✅ Found ${subData.data.length} subscription(s)`);
      subData.data.forEach(sub => {
        console.log(`   - ID: ${sub.id}, membership_id: ${sub.membership_id}, status: ${sub.status}`);
      });
    } else {
      console.log('❌ No subscriptions found');
      console.log('Response:', JSON.stringify(subData, null, 2));
    }

    console.log('');

    // 2. 测试带关系的查询
    console.log('2️⃣ Testing query with relationship:');
    const fullUrl = `${DIRECTUS_URL}/items/user_subscriptions?filter[user_id][_eq]=${USER_ID}&filter[status][_eq]=active&fields=*,membership_id.*`;
    console.log('URL:', fullUrl);

    const fullResponse = await fetch(fullUrl, {
      headers: {
        'Authorization': `Bearer ${DIRECTUS_ADMIN_TOKEN}`,
      },
    });

    console.log('Status:', fullResponse.status);
    const fullData = await fullResponse.json();

    if (fullData.data && fullData.data.length > 0) {
      console.log(`✅ Found ${fullData.data.length} active subscription(s)`);
      console.log('Data:', JSON.stringify(fullData.data[0], null, 2));
    } else {
      console.log('❌ No active subscriptions found');
      console.log('Response:', JSON.stringify(fullData, null, 2));
    }

    console.log('');

    // 3. 检查会员数据
    console.log('3️⃣ Checking memberships table:');
    const memResponse = await fetch(`${DIRECTUS_URL}/items/memberships`, {
      headers: {
        'Authorization': `Bearer ${DIRECTUS_ADMIN_TOKEN}`,
      },
    });

    const memData = await memResponse.json();
    console.log(`Found ${memData.data?.length || 0} memberships:`);
    memData.data?.forEach(mem => {
      console.log(`   - ID: ${mem.id}, name: ${mem.name}, level: ${mem.level}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkData();
