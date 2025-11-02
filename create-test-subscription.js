// 手动创建测试订阅记录

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_ADMIN_TOKEN = 'yOca6E-ANGzkfn9nst59vbR6GwuochDB';

async function createTestSubscription() {
  console.log('🔨 Creating test subscription...');
  console.log('');

  // 首先获取当前用户 ID
  console.log('📧 请输入你的用户邮箱:');
  const email = 'the_uk1@outlook.com'; // 使用你注册时的邮箱

  // 从 Supabase 的 auth.users 表获取用户
  // 这里我们需要从你的 Supabase 获取实际的 user ID
  // 暂时使用一个临时的 UUID
  const userId = '00000000-0000-0000-0000-000000000001'; // 需要替换为实际的用户 ID

  const subscriptionData = {
    user_id: userId,
    membership_id: 2, // Pro membership
    status: 'active',
    billing_cycle: 'monthly',
    payment_method: 'stripe',
    stripe_subscription_id: 'sub_test_manual',
    stripe_customer_id: 'cus_test_manual',
    start_date: new Date().toISOString(),
    end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    auto_renew: true,
  };

  console.log('Creating subscription with data:');
  console.log(JSON.stringify(subscriptionData, null, 2));
  console.log('');

  try {
    const response = await fetch(`${DIRECTUS_URL}/items/user_subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${DIRECTUS_ADMIN_TOKEN}`,
      },
      body: JSON.stringify(subscriptionData),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('❌ Failed to create subscription:');
      console.error(JSON.stringify(result, null, 2));
      return;
    }

    console.log('✅ Subscription created successfully!');
    console.log('Subscription ID:', result.data.id);
    console.log('');
    console.log('Now creating payment record...');

    // 创建支付记录
    const paymentData = {
      user_id: userId,
      subscription_id: result.data.id,
      amount_usd: 39.00,
      payment_method: 'stripe',
      stripe_payment_id: 'pi_test_manual',
      status: 'completed',
      payment_date: new Date().toISOString(),
    };

    const paymentResponse = await fetch(`${DIRECTUS_URL}/items/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${DIRECTUS_ADMIN_TOKEN}`,
      },
      body: JSON.stringify(paymentData),
    });

    const paymentResult = await paymentResponse.json();

    if (!paymentResponse.ok) {
      console.error('❌ Failed to create payment:');
      console.error(JSON.stringify(paymentResult, null, 2));
      return;
    }

    console.log('✅ Payment record created!');
    console.log('Payment ID:', paymentResult.data.id);
    console.log('');
    console.log('🎉 All done! Visit http://localhost:3000/membership to see your subscription');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createTestSubscription();
