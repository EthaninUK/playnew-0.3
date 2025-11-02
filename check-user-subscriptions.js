const pg = require('pg');

async function checkUserSubscriptions() {
  const client = new pg.Client({
    connectionString: 'postgresql://postgres.cujpgrzjmmttysphjknu:bi3d8FpBFTUWuwOb@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres',
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✓ Connected to Supabase database');

    const email = 'the_uk1@outlook.com';

    // Get user ID
    const userResult = await client.query(
      `SELECT id FROM auth.users WHERE email = $1`,
      [email]
    );
    const userId = userResult.rows[0].id;
    console.log('User ID:', userId);

    // Check user_subscriptions for this user
    console.log('\n=== User subscriptions ===');
    const subscriptionsResult = await client.query(
      `SELECT * FROM user_subscriptions WHERE user_id = $1 ORDER BY start_date DESC`,
      [userId]
    );
    console.log('Subscriptions found:', subscriptionsResult.rows.length);

    if (subscriptionsResult.rows.length > 0) {
      console.log('\nSubscription data:');
      console.log(JSON.stringify(subscriptionsResult.rows, null, 2));

      const subscription = subscriptionsResult.rows[0];
      const now = new Date();
      const endDate = subscription.end_date ? new Date(subscription.end_date) : null;

      console.log('\n=== Subscription Status ===');
      console.log('ID:', subscription.id);
      console.log('Membership ID:', subscription.membership_id);
      console.log('Status:', subscription.status);
      console.log('Billing cycle:', subscription.billing_cycle);
      console.log('Amount paid:', subscription.amount_paid);
      console.log('Start date:', subscription.start_date);
      console.log('End date:', subscription.end_date);
      console.log('Auto renew:', subscription.auto_renew);
      console.log('Cancelled at:', subscription.cancelled_at);
      if (endDate) {
        console.log('\nCurrent time:', now.toISOString());
        console.log('Is expired:', endDate < now);
        const daysUntilExpiry = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
        console.log('Days until expiry:', daysUntilExpiry);
      }
      console.log('Stripe subscription ID:', subscription.stripe_subscription_id);

      // Get membership details
      if (subscription.membership_id) {
        console.log('\n=== Membership Plan Details ===');
        const membershipResult = await client.query(
          `SELECT * FROM memberships WHERE id = $1`,
          [subscription.membership_id]
        );
        if (membershipResult.rows.length > 0) {
          console.log('Name:', membershipResult.rows[0].name);
          console.log('Level:', membershipResult.rows[0].level);
          console.log('Content access level:', membershipResult.rows[0].content_access_level);
          console.log('Features:', membershipResult.rows[0].features);
        }
      }
    } else {
      console.log('\n⚠️  No subscriptions found for this user!');

      // Check all subscriptions
      console.log('\n=== All subscriptions in table ===');
      const allSubsResult = await client.query(
        `SELECT id, user_id, status, membership_id, start_date, end_date FROM user_subscriptions ORDER BY start_date DESC LIMIT 5`
      );
      console.log('Total subscriptions:', allSubsResult.rows.length);
      if (allSubsResult.rows.length > 0) {
        console.log(JSON.stringify(allSubsResult.rows, null, 2));
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await client.end();
  }
}

checkUserSubscriptions();
