/**
 * 创建 Web3 配置表并插入初始数据
 * 在 Directus 使用的 Supabase PostgreSQL 数据库中执行
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Supabase 数据库连接配置 (从 docker-compose.yml 获取)
const pool = new Pool({
  connectionString: 'postgresql://postgres.cujpgrzjmmttysphjknu:bi3d8FpBFTUWuwOb@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres',
  ssl: {
    rejectUnauthorized: false // Supabase 需要
  }
});

async function main() {
  const client = await pool.connect();

  try {
    console.log('✅ 连接到 Supabase PostgreSQL 成功');

    // 读取 SQL 文件
    const sqlPath = path.join(__dirname, 'sql', '001_create_web3_config_in_directus.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('📖 读取 SQL 文件:', sqlPath);
    console.log('📝 SQL 文件大小:', sql.length, '字节');

    // 执行 SQL
    console.log('\n🚀 开始执行 SQL...\n');
    await client.query(sql);

    console.log('\n✅ SQL 执行成功!\n');

    // 验证表是否创建成功
    console.log('🔍 验证表创建情况...\n');

    const tables = [
      'web3_system_config',
      'web3_pricing_config',
      'web3_supported_tokens'
    ];

    for (const table of tables) {
      const result = await client.query(
        `SELECT COUNT(*) FROM ${table}`
      );
      console.log(`  ✓ ${table}: ${result.rows[0].count} 条记录`);
    }

    // 显示配置详情
    console.log('\n📊 链配置详情:\n');
    const chains = await client.query(`
      SELECT config_key, chain_name, chain_id, chain_enabled, platform_wallet_address
      FROM web3_system_config
      WHERE chain_id IS NOT NULL
      ORDER BY chain_id
    `);

    chains.rows.forEach(chain => {
      console.log(`  🔗 ${chain.chain_name} (Chain ID: ${chain.chain_id})`);
      console.log(`     状态: ${chain.chain_enabled ? '✅ 已启用' : '❌ 未启用'}`);
      console.log(`     钱包: ${chain.platform_wallet_address}`);
      console.log('');
    });

    // 显示代币配置
    console.log('💰 代币配置详情:\n');
    const tokens = await client.query(`
      SELECT token_symbol, token_name, chain_name, decimals, is_preferred
      FROM web3_supported_tokens
      WHERE is_active = true
      ORDER BY chain_id, sort_order
    `);

    tokens.rows.forEach(token => {
      console.log(`  ${token.is_preferred ? '⭐' : '  '} ${token.token_symbol} (${token.token_name}) on ${token.chain_name}`);
    });

    // 显示定价配置
    console.log('\n💵 定价配置详情:\n');
    const pricing = await client.query(`
      SELECT config_key, content_type, price_usd, price_pp, recharge_ratio, recharge_bonus_percent
      FROM web3_pricing_config
      WHERE is_active = true
      ORDER BY priority DESC
    `);

    pricing.rows.forEach(config => {
      console.log(`  📋 ${config.config_key} (${config.content_type})`);
      console.log(`     价格: $${config.price_usd} / ${config.price_pp} PP`);
      if (config.recharge_ratio) {
        console.log(`     充值: 1 USD = ${config.recharge_ratio} PP (奖励 ${config.recharge_bonus_percent}%)`);
      }
      console.log('');
    });

    console.log('✅ Web3 配置表创建完成!');
    console.log('\n⚠️  重要提示:');
    console.log('   1. 请在 Directus 后台修改收款钱包地址 (当前为测试地址)');
    console.log('   2. 建议配置 RPC API Key 以获得更好的性能');
    console.log('   3. 可以在 Directus 后台调整定价配置');

  } catch (error) {
    console.error('❌ 执行失败:', error.message);
    console.error('详细错误:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
