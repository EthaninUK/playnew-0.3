// 测试订阅API是否能正确返回数据

const DIRECTUS_URL = 'http://localhost:8055';
const USER_ID = '24da5b63-cda3-424d-b98e-dfa32cb61278';

async function testAPI() {
  console.log('🧪 Testing subscription API...');
  console.log('User ID:', USER_ID);
  console.log('');

  try {
    // 模拟API的查询
    const url = `${DIRECTUS_URL}/items/user_subscriptions?filter[user_id][_eq]=${USER_ID}&filter[status][_eq]=active&sort=-start_date&limit=1&fields=*,membership_id.*`;

    console.log('Fetching:', url);
    console.log('');

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      console.log('❌ No subscription found');
      return;
    }

    const rawSubscription = data.data[0];

    console.log('✅ Subscription found!');
    console.log('');
    console.log('Raw data from Directus:');
    console.log(JSON.stringify(rawSubscription, null, 2));
    console.log('');

    // 转换为前端格式
    const subscription = {
      id: String(rawSubscription.id),
      membership: {
        id: String(rawSubscription.membership_id.id),
        name: rawSubscription.membership_id.name,
        level: rawSubscription.membership_id.level,
        price_monthly_usd: rawSubscription.membership_id.price_monthly_usd,
        price_yearly_usd: rawSubscription.membership_id.price_yearly_usd,
        features: rawSubscription.membership_id.features || {},
        description: rawSubscription.membership_id.description || '',
      },
      status: rawSubscription.status,
      billing_cycle: rawSubscription.billing_cycle,
      payment_method: rawSubscription.payment_method,
      amount_paid: rawSubscription.billing_cycle === 'monthly'
        ? rawSubscription.membership_id.price_monthly_usd
        : rawSubscription.membership_id.price_yearly_usd,
      start_date: rawSubscription.start_date,
      end_date: rawSubscription.end_date,
      auto_renew: rawSubscription.auto_renew,
      cancelled_at: rawSubscription.cancelled_at,
    };

    console.log('Transformed data for frontend:');
    console.log(JSON.stringify(subscription, null, 2));
    console.log('');
    console.log('═══════════════════════════════════════');
    console.log('🎉 API test successful!');
    console.log('═══════════════════════════════════════');
    console.log('');
    console.log('Membership:', subscription.membership.name);
    console.log('Status:', subscription.status);
    console.log('Amount:', '$' + subscription.amount_paid + '/' + subscription.billing_cycle);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testAPI();
