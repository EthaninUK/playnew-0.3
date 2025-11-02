const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_EMAIL = 'the_uk1@outlook.com';
const DIRECTUS_PASSWORD = 'Mygcdjmyxzg2026!';

async function login() {
  const response = await fetch(`${DIRECTUS_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: DIRECTUS_EMAIL,
      password: DIRECTUS_PASSWORD,
    }),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  const data = await response.json();
  return data.data.access_token;
}

async function getRoles(token) {
  const response = await fetch(`${DIRECTUS_URL}/roles?fields=*,policies.policies_id.*`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get roles');
  }

  const data = await response.json();
  return data.data;
}

async function getPolicies(token) {
  const response = await fetch(`${DIRECTUS_URL}/policies`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get policies');
  }

  const data = await response.json();
  return data.data;
}

async function linkRoleToPolicy(token, roleId, policyId) {
  // Create a link in the access_policies junction table
  const response = await fetch(`${DIRECTUS_URL}/access_policies`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      role: roleId,
      policy: policyId,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    return { success: false, error };
  }

  return { success: true };
}

async function main() {
  try {
    console.log('');
    console.log('================================================');
    console.log('  Fix Role-Policy Link');
    console.log('================================================');
    console.log('');

    const token = await login();
    console.log('✅ Logged in\n');

    // Get roles and policies
    const roles = await getRoles(token);
    const policies = await getPolicies(token);

    console.log('📋 Current Roles:');
    roles.forEach(role => {
      console.log(`  - ${role.name} (ID: ${role.id})`);
      if (role.policies && role.policies.length > 0) {
        console.log(`    Linked policies: ${role.policies.length}`);
        role.policies.forEach(p => {
          if (p.policies_id) {
            console.log(`      - ${p.policies_id.name || p.policies_id}`);
          }
        });
      } else {
        console.log(`    Linked policies: None ⚠️`);
      }
    });
    console.log('');

    console.log('🔒 Available Policies:');
    policies.forEach(policy => {
      console.log(`  - ${policy.name} (ID: ${policy.id})`);
      console.log(`    Admin: ${policy.admin_access ? 'Yes' : 'No'}`);
    });
    console.log('');

    // Find Administrator role and policy
    const adminRole = roles.find(r => r.name === 'Administrator');
    const adminPolicy = policies.find(p => p.admin_access === true);

    if (!adminRole) {
      console.log('❌ Administrator role not found');
      return;
    }

    if (!adminPolicy) {
      console.log('❌ Administrator policy not found');
      return;
    }

    console.log(`✅ Found Administrator role: ${adminRole.id}`);
    console.log(`✅ Found Administrator policy: ${adminPolicy.id}`);
    console.log('');

    // Check if already linked
    const alreadyLinked = adminRole.policies && adminRole.policies.some(p =>
      p.policies_id && (p.policies_id.id === adminPolicy.id || p.policies_id === adminPolicy.id)
    );

    if (alreadyLinked) {
      console.log('✅ Role is already linked to policy');
      console.log('');
      console.log('🤔 The permissions should work. Let me check if the issue is something else...');
      console.log('');

      // Try to update the role to have admin_access = true
      console.log('🔧 Trying to set admin_access on the role...');
      const updateResponse = await fetch(`${DIRECTUS_URL}/roles/${adminRole.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          admin_access: true,
          app_access: true,
        }),
      });

      if (updateResponse.ok) {
        console.log('✅ Successfully updated role to have admin access');
      } else {
        const error = await updateResponse.text();
        console.log('❌ Failed to update role:', error.substring(0, 200));
      }
    } else {
      console.log('⚠️  Role is NOT linked to policy. Linking now...');
      const result = await linkRoleToPolicy(token, adminRole.id, adminPolicy.id);

      if (result.success) {
        console.log('✅ Successfully linked role to policy');
      } else {
        console.log('❌ Failed to link:', result.error.substring(0, 200));
      }
    }

    console.log('');
    console.log('================================================');
    console.log('🎉 Done! Please re-run your data scripts now.');
    console.log('================================================');
    console.log('');

  } catch (error) {
    console.error('');
    console.error('❌ Error:', error.message);
    console.error('');
    process.exit(1);
  }
}

main();
