const pg = require('pg');

async function checkMemberships() {
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

    // Check memberships table structure
    console.log('\n=== Memberships table structure ===');
    const columnsResult = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'memberships'
      ORDER BY ordinal_position
    `);
    console.log('Columns:');
    columnsResult.rows.forEach(col => {
      console.log(`  - ${col.column_name} (${col.data_type}) ${col.is_nullable === 'YES' ? 'nullable' : 'not null'}`);
    });

    // Check memberships for this user
    console.log('\n=== Memberships for user ===');
    const membershipsResult = await client.query(
      `SELECT * FROM memberships WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );
    console.log('Memberships found:', membershipsResult.rows.length);

    if (membershipsResult.rows.length > 0) {
      console.log('\nMembership data:');
      console.log(JSON.stringify(membershipsResult.rows, null, 2));

      const membership = membershipsResult.rows[0];
      const now = new Date();
      const expiresAt = membership.expires_at ? new Date(membership.expires_at) : null;

      console.log('\n=== Membership Status ===');
      console.log('ID:', membership.id);
      console.log('Plan:', membership.plan);
      console.log('Status:', membership.status);
      console.log('Is active:', membership.is_active);
      console.log('Created at:', membership.created_at);
      console.log('Expires at:', membership.expires_at);
      if (expiresAt) {
        console.log('Is expired:', expiresAt < now);
      }
      console.log('Stripe subscription ID:', membership.stripe_subscription_id);
    } else {
      console.log('\n⚠️  No memberships found for this user!');

      // Check all memberships in table
      console.log('\n=== All memberships in table ===');
      const allMembershipsResult = await client.query(
        `SELECT id, user_id, plan, status, created_at FROM memberships ORDER BY created_at DESC LIMIT 5`
      );
      console.log('Total memberships:', allMembershipsResult.rows.length);
      if (allMembershipsResult.rows.length > 0) {
        console.log(JSON.stringify(allMembershipsResult.rows, null, 2));
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await client.end();
  }
}

checkMemberships();
