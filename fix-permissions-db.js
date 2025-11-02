const pg = require('pg');

async function fixPermissions() {
  const client = new pg.Client({
    connectionString: 'postgresql://postgres.cujpgrzjmmttysphjknu:bi3d8FpBFTUWuwOb@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres',
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✓ Connected to database');

    const email = 'the_uk1@outlook.com';

    // Get user and role
    console.log('\n=== Getting user info ===');
    const userResult = await client.query(
      `SELECT id, role FROM directus_users WHERE email = $1`,
      [email]
    );
    const user = userResult.rows[0];
    console.log('User ID:', user.id);
    console.log('Role ID:', user.role);

    // Get role name
    const roleResult = await client.query(
      `SELECT id, name FROM directus_roles WHERE id = $1`,
      [user.role]
    );
    console.log('Role:', roleResult.rows[0]);

    // Get role-policy mapping
    console.log('\n=== Getting role-policy mapping ===');
    const rolePolicyResult = await client.query(
      `SELECT * FROM directus_access WHERE role = $1`,
      [user.role]
    );
    console.log('Access records:', rolePolicyResult.rows.length);
    rolePolicyResult.rows.forEach(a => {
      console.log(`  - Role ${a.role} -> Policy ${a.policy}`);
    });

    if (rolePolicyResult.rows.length === 0) {
      console.error('❌ No policy found for role');
      return;
    }

    const policyId = rolePolicyResult.rows[0].policy;

    // Check if policy has admin access
    const policyInfo = await client.query(
      `SELECT admin_access FROM directus_policies WHERE id = $1`,
      [policyId]
    );
    console.log('Policy admin_access:', policyInfo.rows[0].admin_access);

    if (policyInfo.rows[0].admin_access) {
      console.log('\n✅ User has admin access - checking why Directus API filter fails...');

      // Test the actual endpoint
      console.log('\n=== Testing Directus API with different approaches ===');
      const axios = require('axios');

      // Get token
      const loginResp = await axios.post(`http://localhost:8055/auth/login`, {
        email: email,
        password: 'Mygcdjmyxzg2026!'
      });
      const token = loginResp.data.data.access_token;

      // Test 1: Get all
      console.log('\n1. Get all user_subscriptions:');
      try {
        const resp1 = await axios.get(
          `http://localhost:8055/items/user_subscriptions`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('   Success, got', resp1.data.data.length, 'records');
      } catch (e) {
        console.log('   Failed:', e.response?.data || e.message);
      }

      // Test 2: Get with simple filter
      console.log('\n2. Get with filter (user_id):');
      try {
        const resp2 = await axios.get(
          `http://localhost:8055/items/user_subscriptions?filter[status][_eq]=active`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('   Success, got', resp2.data.data.length, 'records');
        console.log('   Data:', JSON.stringify(resp2.data.data, null, 2));
      } catch (e) {
        console.log('   Failed:', e.response?.data || e.message);
      }

      // Test 3: Get with user_id filter using auth.users ID
      const authUserId = '24da5b63-cda3-424d-b98e-dfa32cb61278';
      console.log(`\n3. Get with user_id filter (${authUserId}):`);
      try {
        const resp3 = await axios.get(
          `http://localhost:8055/items/user_subscriptions?filter[user_id][_eq]=${authUserId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('   Success, got', resp3.data.data.length, 'records');
        console.log('   Data:', JSON.stringify(resp3.data.data, null, 2));
      } catch (e) {
        console.log('   Failed:', e.response?.data || e.message);
      }

      // Test 4: With fields expansion
      console.log(`\n4. Get with fields expansion:`);
      try {
        const resp4 = await axios.get(
          `http://localhost:8055/items/user_subscriptions?filter[user_id][_eq]=${authUserId}&fields=*,membership_id.*`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('   Success!');
        console.log('   Data:', JSON.stringify(resp4.data.data, null, 2));
      } catch (e) {
        console.log('   Failed:', e.response?.data || e.message);
      }

      return;
    }

    // If not admin, create permissions
    console.log('\n=== Creating permissions ===');
    const actions = ['create', 'read', 'update', 'delete'];

    // Get existing permissions
    const permsResult = await client.query(
      `SELECT * FROM directus_permissions
       WHERE collection = 'user_subscriptions' AND policy = $1`,
      [policyId]
    );

    for (const action of actions) {
      const existingPerm = permsResult.rows.find(p => p.action === action);

      if (!existingPerm) {
        console.log(`Creating ${action} permission...`);
        await client.query(
          `INSERT INTO directus_permissions (policy, collection, action, permissions, fields)
           VALUES ($1, $2, $3, $4, $5)`,
          [policyId, 'user_subscriptions', action, '{}', '*']
        );
        console.log(`✓ Created ${action} permission`);
      } else {
        console.log(`✓ ${action} permission exists`);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

fixPermissions();
