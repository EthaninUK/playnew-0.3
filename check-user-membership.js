const pg = require('pg');

async function checkUserMembership() {
  const client = new pg.Client({
    connectionString: 'postgresql://postgres.cujpgrzjmmttysphjknu:bi3d8FpBFTUWuwOb@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres',
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✓ Connected to Supabase database');

    const email = 'the_uk1@outlook.com';

    // Check auth.users table
    console.log('\n=== Checking auth.users ===');
    const authUsersResult = await client.query(
      `SELECT id, email, created_at FROM auth.users WHERE email = $1`,
      [email]
    );
    console.log('Auth users found:', authUsersResult.rows.length);
    if (authUsersResult.rows.length > 0) {
      console.log(JSON.stringify(authUsersResult.rows, null, 2));
    }

    if (authUsersResult.rows.length > 0) {
      const userId = authUsersResult.rows[0].id;

      // Check user_memberships
      console.log('\n=== Checking user_memberships ===');
      const membershipsResult = await client.query(
        `SELECT id, user_id, plan, status, is_active, stripe_subscription_id,
                created_at, expires_at, updated_at
         FROM user_memberships
         WHERE user_id = $1
         ORDER BY created_at DESC`,
        [userId]
      );
      console.log('User memberships found:', membershipsResult.rows.length);

      if (membershipsResult.rows.length > 0) {
        console.log(JSON.stringify(membershipsResult.rows, null, 2));

        // Check if expired
        const membership = membershipsResult.rows[0];
        const now = new Date();
        const expiresAt = new Date(membership.expires_at);

        console.log('\n=== Membership Status Analysis ===');
        console.log('Current time (UTC):', now.toISOString());
        console.log('Expires at:', membership.expires_at);
        console.log('Is active (DB):', membership.is_active);
        console.log('Is expired:', expiresAt < now);
        console.log('Status:', membership.status);
        console.log('Plan:', membership.plan);
        console.log('Stripe Subscription ID:', membership.stripe_subscription_id);

        if (!membership.is_active || membership.status !== 'active') {
          console.log('\n⚠️  WARNING: Membership is NOT active in database!');
          console.log('is_active:', membership.is_active);
          console.log('status:', membership.status);
        }

        if (expiresAt < now) {
          console.log('\n⚠️  WARNING: Membership has expired!');
          console.log('Expired on:', membership.expires_at);
        }
      } else {
        console.log('\n⚠️  No membership found for this user!');
      }
    } else {
      console.log('\n⚠️  No user found with email:', email);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await client.end();
  }
}

checkUserMembership();
