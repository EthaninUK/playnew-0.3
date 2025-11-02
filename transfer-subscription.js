const pg = require('pg');

async function transferSubscription() {
  const client = new pg.Client({
    connectionString: 'postgresql://postgres.cujpgrzjmmttysphjknu:bi3d8FpBFTUWuwOb@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres',
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✓ Connected to database\n');

    const fromEmail = 'the_uk1@outlook.com';
    const toEmail = 'the_uk2@outlook.com';

    // Get user IDs
    const fromUserResult = await client.query(
      `SELECT id FROM auth.users WHERE email = $1`,
      [fromEmail]
    );
    const toUserResult = await client.query(
      `SELECT id FROM auth.users WHERE email = $1`,
      [toEmail]
    );

    if (fromUserResult.rows.length === 0 || toUserResult.rows.length === 0) {
      console.error('❌ One or both users not found');
      return;
    }

    const fromUserId = fromUserResult.rows[0].id;
    const toUserId = toUserResult.rows[0].id;

    console.log(`From: ${fromEmail} (${fromUserId})`);
    console.log(`To: ${toEmail} (${toUserId})\n`);

    // Transfer subscription
    console.log('Transferring subscription...');
    const updateResult = await client.query(
      `UPDATE user_subscriptions
       SET user_id = $1
       WHERE user_id = $2
       RETURNING *`,
      [toUserId, fromUserId]
    );

    if (updateResult.rows.length > 0) {
      console.log(`✓ Transferred ${updateResult.rows.length} subscription(s)`);
      console.log('\nNew subscription data:');
      updateResult.rows.forEach(sub => {
        console.log(`  - Subscription ID: ${sub.id}`);
        console.log(`    User ID: ${sub.user_id}`);
        console.log(`    Status: ${sub.status}`);
        console.log(`    Membership ID: ${sub.membership_id}`);
      });
    } else {
      console.log('⚠️  No subscriptions found to transfer');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

console.log('=== Transfer Subscription ===\n');
console.log('This will transfer the subscription from the_uk1@outlook.com to the_uk2@outlook.com');
console.log('');

transferSubscription();
