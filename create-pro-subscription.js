// 为用户创建 Pro 会员订阅

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_ADMIN_TOKEN = 'yOca6E-ANGzkfn9nst59vbR6GwuochDB';
const USER_ID = '24da5b63-cda3-424d-b98e-dfa32cb61278'; // the_uk1@outlook.com

async function createProSubscription() {
  console.log('🎁 Creating Pro membership subscription...');
  console.log('User: the_uk1@outlook.com');
  console.log('');

  const subscriptionData = {
    user_id: USER_ID,
    membership_id: 2, // Pro membership
    status: 'active',
    billing_cycle: 'monthly',
    payment_method: 'stripe',
    stripe_subscription_id: 'sub_1SNH4WDX3Rjo9YUq4evF25sG', // 来自实际的 Stripe 订阅
    stripe_customer_id: 'cus_test_manual',
    start_date: new Date().toISOString(),
    end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 天后
    auto_renew: true,
  };

  console.log('Creating subscription...');

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

    // 创建支付记录
    console.log('Creating payment record...');

    const paymentData = {
      user_id: USER_ID,
      subscription_id: result.data.id,
      amount: 39.00,
      payment_method: 'stripe',
      stripe_payment_id: 'pi_1SNH4WDX3Rjo9YUqvdSmw9Sy', // 来自实际的 Stripe 支付
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
    console.log('Amount: $39.00');
    console.log('');
    console.log('═══════════════════════════════════════');
    console.log('🎉 All done!');
    console.log('═══════════════════════════════════════');
    console.log('');
    console.log('Your Pro membership is now active!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Visit: http://localhost:3000/membership');
    console.log('2. You should see "Pro 会员" instead of "Free 会员"');
    console.log('3. Check subscription details and benefits');
    console.log('');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createProSubscription();
