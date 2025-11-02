const axios = require('axios');
const pg = require('pg');

const DIRECTUS_URL = 'http://localhost:8055';

async function fixMissingSubscriptions() {
  // Connect to database
  const client = new pg.Client({
    connectionString: 'postgresql://postgres.cujpgrzjmmttysphjknu:bi3d8FpBFTUWuwOb@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres',
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✓ Connected to database\n');

    // Get Directus token
    const loginResp = await axios.post(`${DIRECTUS_URL}/auth/login`, {
      email: 'the_uk1@outlook.com',
      password: 'Mygcdjmyxzg2026!'
    });
    const token = loginResp.data.data.access_token;
    console.log('✓ Got Directus token\n');

    // Get user ID for the_uk2@outlook.com
    const userResult = await client.query(
      `SELECT id FROM auth.users WHERE email = $1`,
      ['the_uk2@outlook.com']
    );
    const userId = userResult.rows[0].id;
    console.log('User ID for the_uk2@outlook.com:', userId);

    // Check existing subscriptions
    const existingSubsResult = await client.query(
      `SELECT * FROM user_subscriptions WHERE user_id = $1`,
      [userId]
    );
    console.log('Existing subscriptions:', existingSubsResult.rows.length);

    if (existingSubsResult.rows.length > 0) {
      console.log('\n⚠️  User already has subscriptions:');
      existingSubsResult.rows.forEach(sub => {
        console.log(`   - ID ${sub.id}: ${sub.status}, Membership ${sub.membership_id}`);
      });
      console.log('\nWould you like to continue? This will create additional subscriptions.');
      console.log('Please review the Stripe dashboard to determine which payments need subscriptions.');
      return;
    }

    // Based on Stripe data:
    // 1. $39 payment at 19:09 for the_uk2@outlook.com
    // 2. $200 payment at 19:10 for the_uk2@outlook.com

    console.log('\n=== Creating subscription for $39 payment (Pro Monthly) ===');

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    const proSubData = {
      user_id: userId,
      membership_id: 2, // Pro
      status: 'active',
      billing_cycle: 'monthly',
      payment_method: 'stripe',
      stripe_customer_id: 'cus_TJw8FauzKRaPxa', // From Stripe
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      auto_renew: true,
      amount_paid: 39
    };

    const createProSubResp = await axios.post(
      `${DIRECTUS_URL}/items/user_subscriptions`,
      proSubData,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (createProSubResp.data.data) {
      console.log('✓ Created Pro subscription, ID:', createProSubResp.data.data.id);
    }

    // Note: The $200 payment seems unusual for Max ($99)
    // Let's check what membership that should be
    console.log('\n=== Checking $200 payment ===');
    console.log('Standard prices:');
    console.log('  - Free: $0');
    console.log('  - Pro: $39/month or $390/year');
    console.log('  - Max: $99/month or $990/year');
    console.log('\n⚠️  $200 does not match any standard plan.');
    console.log('Please check Stripe dashboard for session details.');

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  } finally {
    await client.end();
  }
}

console.log('=== Fix Missing Subscriptions ===\n');
fixMissingSubscriptions();
