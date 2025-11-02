const pg = require('pg');

async function checkAllSubscriptions() {
  const client = new pg.Client({
    connectionString: 'postgresql://postgres.cujpgrzjmmttysphjknu:bi3d8FpBFTUWuwOb@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres',
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✓ Connected to database\n');

    // Get all users from auth.users
    console.log('=== All users in auth.users ===');
    const usersResult = await client.query(
      `SELECT id, email, created_at
       FROM auth.users
       ORDER BY created_at DESC
       LIMIT 10`
    );
    console.log('Users found:', usersResult.rows.length);
    usersResult.rows.forEach((user, i) => {
      console.log(`${i + 1}. ${user.email}`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Created: ${user.created_at}`);
    });

    // Get all subscriptions
    console.log('\n=== All subscriptions in user_subscriptions ===');
    const subsResult = await client.query(
      `SELECT us.*, u.email
       FROM user_subscriptions us
       LEFT JOIN auth.users u ON us.user_id = u.id
       ORDER BY us.start_date DESC
       LIMIT 10`
    );
    console.log('Subscriptions found:', subsResult.rows.length);
    subsResult.rows.forEach((sub, i) => {
      console.log(`\n${i + 1}. Subscription ID: ${sub.id}`);
      console.log(`   Email: ${sub.email || 'N/A'}`);
      console.log(`   User ID: ${sub.user_id}`);
      console.log(`   Status: ${sub.status}`);
      console.log(`   Membership ID: ${sub.membership_id}`);
      console.log(`   Start: ${sub.start_date}`);
      console.log(`   End: ${sub.end_date}`);
      console.log(`   Stripe Sub ID: ${sub.stripe_subscription_id}`);
    });

    // Check for mismatches
    console.log('\n=== Checking for user ID mismatches ===');
    const targetEmail = 'the_uk1@outlook.com';
    const authUser = usersResult.rows.find(u => u.email === targetEmail);
    if (authUser) {
      console.log(`✓ Found ${targetEmail} in auth.users:`);
      console.log(`  ID: ${authUser.id}`);

      const userSubs = subsResult.rows.filter(s => s.user_id === authUser.id);
      console.log(`  Subscriptions: ${userSubs.length}`);

      if (userSubs.length === 0) {
        console.log(`\n⚠️  WARNING: No subscriptions found for this user ID!`);

        // Check if there are subscriptions with the email
        const emailSubs = subsResult.rows.filter(s => s.email === targetEmail);
        if (emailSubs.length > 0) {
          console.log(`\n❌ PROBLEM FOUND: Found ${emailSubs.length} subscription(s) with email ${targetEmail} but different user_id!`);
          emailSubs.forEach(sub => {
            console.log(`   - Subscription ${sub.id} has user_id: ${sub.user_id}`);
            console.log(`   - But auth.users has ID: ${authUser.id}`);
          });
        }
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

checkAllSubscriptions();
