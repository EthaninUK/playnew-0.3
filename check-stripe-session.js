const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_51SNGacDX3Rjo9YUqs5kKOvF8jl2pQFqbWN9W7eCWvCfjiPlZqWzNnslfTcP05fqxIiFQOrjxDglGGQTWu8XPXFbK00OVvYPuho', {
  apiVersion: '2024-12-18.acacia',
});

async function checkSession() {
  const sessionId = process.argv[2] || 'cs_test_a1IIJYNhpock4puQ2ESYl6Ldtn3pKyRsCvrYAYrjRfABrHUR37QqKWpw8r';

  console.log('🔍 Checking Stripe session:', sessionId);
  console.log('');

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    console.log('Session details:');
    console.log('- ID:', session.id);
    console.log('- Status:', session.status);
    console.log('- Payment status:', session.payment_status);
    console.log('- Customer:', session.customer);
    console.log('- Subscription:', session.subscription);
    console.log('- Metadata:', session.metadata);
    console.log('');

    if (session.subscription) {
      const subscription = await stripe.subscriptions.retrieve(session.subscription);
      console.log('Subscription details:');
      console.log('- ID:', subscription.id);
      console.log('- Status:', subscription.status);
      console.log('- Start:', new Date(subscription.current_period_start * 1000));
      console.log('- End:', new Date(subscription.current_period_end * 1000));
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkSession();
