/**
 * 直接通过数据库授予 Web3 表的公开访问权限
 */

const { Client } = require('pg');

const client = new Client({
  host: 'aws-1-ap-northeast-1.pooler.supabase.com',
  port: 5432,
  database: 'postgres',
  user: 'postgres.cujpgrzjmmttysphjknu',
  password: 'bi3d8FpBFTUWuwOb',
  ssl: { rejectUnauthorized: false }
});

async function grantPermissions() {
  console.log('🔧 配置 Web3 表公开访问权限...\n');

  try {
    await client.connect();
    console.log('✅ 数据库连接成功\n');

    // 1. 获取 public 角色 ID
    console.log('1️⃣ 获取 Public 角色 ID...');
    const roleRes = await client.query(`
      SELECT id, name FROM directus_roles WHERE name = 'Public' LIMIT 1
    `);

    if (roleRes.rows.length === 0) {
      console.log('❌ 未找到 Public 角色');
      return;
    }

    const publicRoleId = roleRes.rows[0].id;
    console.log(`✅ Public 角色 ID: ${publicRoleId}\n`);

    // 2. 获取 admin 策略 ID (如果存在)
    const policyRes = await client.query(`
      SELECT id, name FROM directus_policies WHERE admin_access = true LIMIT 1
    `);

    let policyId = null;
    if (policyRes.rows.length > 0) {
      policyId = policyRes.rows[0].id;
      console.log(`2️⃣ 找到 Admin 策略 ID: ${policyId}\n`);
    } else {
      console.log('2️⃣ 未找到 Admin 策略,将创建新策略...\n');

      // 创建一个公开读取策略
      const createPolicyRes = await client.query(`
        INSERT INTO directus_policies (name, admin_access, app_access, icon, description)
        VALUES ('Web3 Public Read', false, false, 'public', 'Web3 配置公开读取权限')
        RETURNING id
      `);

      policyId = createPolicyRes.rows[0].id;
      console.log(`✅ 创建新策略 ID: ${policyId}\n`);
    }

    // 3. 链接角色和策略
    console.log('3️⃣ 链接 Public 角色和策略...');
    await client.query(`
      INSERT INTO directus_access (id, role, policy, sort)
      VALUES (gen_random_uuid(), $1, $2, 1)
      ON CONFLICT DO NOTHING
    `, [publicRoleId, policyId]);
    console.log('✅ 角色策略已链接\n');

    // 4. 为 3 个 Web3 表添加读取权限
    const collections = ['web3_system_config', 'web3_pricing_config', 'web3_supported_tokens'];

    console.log('4️⃣ 添加表读取权限...\n');

    for (const collection of collections) {
      try {
        // 检查权限是否已存在
        const existingRes = await client.query(`
          SELECT id FROM directus_permissions
          WHERE policy = $1 AND collection = $2 AND action = 'read'
        `, [policyId, collection]);

        if (existingRes.rows.length > 0) {
          console.log(`  ⏭️  ${collection}: 权限已存在,跳过`);
          continue;
        }

        // 添加权限
        await client.query(`
          INSERT INTO directus_permissions (policy, collection, action, permissions, fields)
          VALUES ($1, $2, 'read', '{"is_active":{"_eq":true}}', '*')
        `, [policyId, collection]);

        console.log(`  ✅ ${collection}: 读取权限已添加`);
      } catch (error) {
        console.log(`  ⚠️  ${collection}: ${error.message}`);
      }
    }

    console.log('\n✅ 权限配置完成!\n');

    // 5. 验证配置
    console.log('5️⃣ 验证权限配置...\n');
    const verifyRes = await client.query(`
      SELECT
        dp.collection,
        dp.action,
        dp.fields
      FROM directus_permissions dp
      WHERE dp.policy = $1
        AND dp.collection IN ('web3_system_config', 'web3_pricing_config', 'web3_supported_tokens')
      ORDER BY dp.collection
    `, [policyId]);

    console.log(`  找到 ${verifyRes.rowCount} 条权限记录:\n`);
    verifyRes.rows.forEach(row => {
      console.log(`  - ${row.collection}: ${row.action} (字段: ${row.fields})`);
    });

    console.log('\n✅ 配置完成! 现在可以公开访问 Web3 配置表\n');

  } catch (error) {
    console.error('❌ 错误:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await client.end();
  }
}

if (require.main === module) {
  grantPermissions();
}

module.exports = { grantPermissions };
