/**
 * 直接通过数据库启用 Web3 链配置
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

async function enableChains() {
  console.log('🔧 直接启用 Web3 链配置...\n');

  try {
    await client.connect();
    console.log('✅ 数据库连接成功\n');

    // 1. 查看当前配置
    console.log('📋 当前链配置:\n');
    const currentRes = await client.query(`
      SELECT id, chain_name, chain_id, chain_enabled, platform_wallet_address, rpc_url
      FROM web3_system_config
      WHERE chain_id IS NOT NULL
      ORDER BY chain_id
    `);

    currentRes.rows.forEach(row => {
      console.log(`${row.chain_name} (Chain ID: ${row.chain_id}):`);
      console.log(`  状态: ${row.chain_enabled ? '✅ 启用' : '❌ 禁用'}`);
      console.log(`  钱包: ${row.platform_wallet_address || '(未设置)'}`);
      console.log(`  RPC: ${row.rpc_url}`);
      console.log('');
    });

    // 2. 启用所有链
    console.log('⚙️  启用所有链...\n');
    const updateRes = await client.query(`
      UPDATE web3_system_config
      SET chain_enabled = true,
          is_active = true
      WHERE chain_id IS NOT NULL
      RETURNING chain_name, chain_id
    `);

    console.log(`✅ 已启用 ${updateRes.rowCount} 条链配置:\n`);
    updateRes.rows.forEach(row => {
      console.log(`  ✅ ${row.chain_name} (Chain ID: ${row.chain_id})`);
    });

    // 3. 启用所有代币
    console.log('\n⚙️  启用所有代币...\n');
    const tokenRes = await client.query(`
      UPDATE web3_supported_tokens
      SET is_active = true
      RETURNING token_symbol, chain_id
    `);

    console.log(`✅ 已启用 ${tokenRes.rowCount} 个代币:\n`);
    tokenRes.rows.forEach(row => {
      console.log(`  ✅ ${row.token_symbol} on Chain ${row.chain_id}`);
    });

    // 4. 启用所有定价配置
    console.log('\n⚙️  启用所有定价配置...\n');
    const pricingRes = await client.query(`
      UPDATE web3_pricing_config
      SET is_active = true
      RETURNING config_name
    `);

    console.log(`✅ 已启用 ${pricingRes.rowCount} 条定价配置\n`);

    // 5. 显示最终状态
    console.log('\n📊 最终配置统计:\n');
    const statsRes = await client.query(`
      SELECT
        (SELECT COUNT(*) FROM web3_system_config WHERE chain_enabled = true) as enabled_chains,
        (SELECT COUNT(*) FROM web3_supported_tokens WHERE is_active = true) as active_tokens,
        (SELECT COUNT(*) FROM web3_pricing_config WHERE is_active = true) as active_pricing
    `);

    const stats = statsRes.rows[0];
    console.log(`  启用的链: ${stats.enabled_chains}`);
    console.log(`  启用的代币: ${stats.active_tokens}`);
    console.log(`  启用的定价: ${stats.active_pricing}`);

    console.log('\n✅ 配置完成!\n');

  } catch (error) {
    console.error('❌ 错误:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

if (require.main === module) {
  enableChains();
}

module.exports = { enableChains };
