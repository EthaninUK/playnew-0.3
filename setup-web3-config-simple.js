/**
 * 创建 Web3 配置表并插入初始数据 (简化版,适用于 Supabase)
 */

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres.cujpgrzjmmttysphjknu:bi3d8FpBFTUWuwOb@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres',
  ssl: {
    rejectUnauthorized: false
  }
});

async function main() {
  const client = await pool.connect();

  try {
    console.log('✅ 连接到 Supabase PostgreSQL 成功\n');

    // ============================================
    // 1. 创建 web3_system_config 表
    // ============================================
    console.log('📋 创建 web3_system_config 表...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS web3_system_config (
        id SERIAL PRIMARY KEY,
        config_key VARCHAR(100) UNIQUE NOT NULL,
        config_name VARCHAR(200) NOT NULL,
        description TEXT,
        platform_wallet_address VARCHAR(42),
        rpc_url TEXT,
        rpc_provider VARCHAR(50),
        rpc_api_key TEXT,
        chain_id INT,
        chain_name VARCHAR(50),
        chain_enabled BOOLEAN DEFAULT TRUE,
        gas_limit_multiplier DECIMAL(3,2) DEFAULT 1.2,
        max_priority_fee_gwei DECIMAL(10,2),
        required_confirmations INT DEFAULT 3,
        price_update_interval_minutes INT DEFAULT 10,
        price_api_url TEXT,
        payment_timeout_minutes INT DEFAULT 30,
        is_active BOOLEAN DEFAULT TRUE,
        sort_order INT DEFAULT 0,
        status VARCHAR(20) DEFAULT 'published',
        date_created TIMESTAMP DEFAULT NOW(),
        date_updated TIMESTAMP DEFAULT NOW(),
        CONSTRAINT valid_chain_id CHECK (chain_id IN (1, 137, 8453) OR chain_id IS NULL)
      );

      CREATE INDEX IF NOT EXISTS idx_web3_config_key ON web3_system_config(config_key);
      CREATE INDEX IF NOT EXISTS idx_web3_config_chain ON web3_system_config(chain_id);
      CREATE INDEX IF NOT EXISTS idx_web3_config_active ON web3_system_config(is_active);
    `);
    console.log('✅ web3_system_config 表创建完成\n');

    // ============================================
    // 2. 创建 web3_pricing_config 表
    // ============================================
    console.log('📋 创建 web3_pricing_config 表...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS web3_pricing_config (
        id SERIAL PRIMARY KEY,
        config_key VARCHAR(100) UNIQUE NOT NULL,
        config_name VARCHAR(200) NOT NULL,
        description TEXT,
        content_type VARCHAR(50) NOT NULL,
        content_category VARCHAR(100),
        apply_conditions JSONB DEFAULT '{}',
        price_type VARCHAR(20) DEFAULT 'fixed',
        price_usd DECIMAL(10,2) DEFAULT 0,
        price_pp INT DEFAULT 0,
        recharge_enabled BOOLEAN DEFAULT TRUE,
        recharge_ratio INT DEFAULT 100,
        recharge_bonus_percent INT DEFAULT 0,
        membership_discounts JSONB DEFAULT '{"0": 1.0, "1": 0.9, "2": 0.7, "3": 0.5, "4": 0.0}',
        access_type VARCHAR(20) DEFAULT 'permanent',
        access_duration_days INT,
        free_preview_enabled BOOLEAN DEFAULT TRUE,
        free_preview_length INT DEFAULT 500,
        priority INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        status VARCHAR(20) DEFAULT 'published',
        date_created TIMESTAMP DEFAULT NOW(),
        date_updated TIMESTAMP DEFAULT NOW(),
        CONSTRAINT valid_content_type CHECK (content_type IN ('strategy', 'arbitrage', 'news', 'gossip', 'global')),
        CONSTRAINT valid_price_type CHECK (price_type IN ('fixed', 'dynamic', 'free')),
        CONSTRAINT valid_access_type CHECK (access_type IN ('permanent', 'temporary')),
        CONSTRAINT positive_price CHECK (price_usd >= 0 AND price_pp >= 0)
      );

      CREATE INDEX IF NOT EXISTS idx_web3_pricing_type ON web3_pricing_config(content_type);
      CREATE INDEX IF NOT EXISTS idx_web3_pricing_active ON web3_pricing_config(is_active);
      CREATE INDEX IF NOT EXISTS idx_web3_pricing_priority ON web3_pricing_config(priority DESC);
    `);
    console.log('✅ web3_pricing_config 表创建完成\n');

    // ============================================
    // 3. 创建 web3_supported_tokens 表
    // ============================================
    console.log('📋 创建 web3_supported_tokens 表...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS web3_supported_tokens (
        id SERIAL PRIMARY KEY,
        token_symbol VARCHAR(20) NOT NULL,
        token_name VARCHAR(100) NOT NULL,
        token_address VARCHAR(42),
        decimals INT NOT NULL DEFAULT 18,
        chain_id INT NOT NULL,
        chain_name VARCHAR(50) NOT NULL,
        icon_url TEXT,
        color_hex VARCHAR(7),
        price_source VARCHAR(50) DEFAULT 'coingecko',
        coingecko_id VARCHAR(100),
        display_name VARCHAR(100),
        sort_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        is_preferred BOOLEAN DEFAULT FALSE,
        status VARCHAR(20) DEFAULT 'published',
        date_created TIMESTAMP DEFAULT NOW(),
        date_updated TIMESTAMP DEFAULT NOW(),
        CONSTRAINT unique_token_chain UNIQUE(token_symbol, chain_id),
        CONSTRAINT valid_chain_id_tokens CHECK (chain_id IN (1, 137, 8453))
      );

      CREATE INDEX IF NOT EXISTS idx_web3_tokens_chain ON web3_supported_tokens(chain_id);
      CREATE INDEX IF NOT EXISTS idx_web3_tokens_active ON web3_supported_tokens(is_active);
      CREATE INDEX IF NOT EXISTS idx_web3_tokens_preferred ON web3_supported_tokens(is_preferred);
    `);
    console.log('✅ web3_supported_tokens 表创建完成\n');

    // ============================================
    // 4. 插入初始配置数据
    // ============================================
    console.log('📊 插入初始配置数据...\n');

    // 4.1 链配置
    const chains = [
      {
        key: 'ethereum_config',
        name: 'Ethereum 主网配置',
        wallet: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', // 示例地址
        rpc: 'https://eth.public-rpc.com',
        chain_id: 1,
        chain_name: 'ethereum',
        confirmations: 3
      },
      {
        key: 'polygon_config',
        name: 'Polygon 主网配置',
        wallet: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', // 示例地址
        rpc: 'https://polygon-rpc.com',
        chain_id: 137,
        chain_name: 'polygon',
        confirmations: 10
      },
      {
        key: 'base_config',
        name: 'Base 主网配置',
        wallet: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', // 示例地址
        rpc: 'https://mainnet.base.org',
        chain_id: 8453,
        chain_name: 'base',
        confirmations: 3
      }
    ];

    for (const chain of chains) {
      await client.query(`
        INSERT INTO web3_system_config (
          config_key, config_name, description, platform_wallet_address,
          rpc_url, rpc_provider, chain_id, chain_name, chain_enabled,
          required_confirmations, is_active
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (config_key) DO NOTHING
      `, [
        chain.key,
        chain.name,
        `${chain.chain_name} 链的配置`,
        chain.wallet,
        chain.rpc,
        'public',
        chain.chain_id,
        chain.chain_name,
        true,
        chain.confirmations,
        true
      ]);
      console.log(`  ✓ ${chain.name}`);
    }

    // 4.2 代币配置
    const tokens = [
      // Ethereum
      { symbol: 'ETH', name: 'Ethereum', address: null, decimals: 18, chain_id: 1, chain: 'ethereum', coingecko: 'ethereum', preferred: true },
      { symbol: 'USDC', name: 'USD Coin', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', decimals: 6, chain_id: 1, chain: 'ethereum', coingecko: 'usd-coin', preferred: true },
      { symbol: 'USDT', name: 'Tether USD', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', decimals: 6, chain_id: 1, chain: 'ethereum', coingecko: 'tether', preferred: false },

      // Polygon
      { symbol: 'MATIC', name: 'Polygon', address: null, decimals: 18, chain_id: 137, chain: 'polygon', coingecko: 'matic-network', preferred: true },
      { symbol: 'USDC', name: 'USD Coin', address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', decimals: 6, chain_id: 137, chain: 'polygon', coingecko: 'usd-coin', preferred: true },
      { symbol: 'USDT', name: 'Tether USD', address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', decimals: 6, chain_id: 137, chain: 'polygon', coingecko: 'tether', preferred: false },

      // Base
      { symbol: 'ETH', name: 'Ethereum', address: null, decimals: 18, chain_id: 8453, chain: 'base', coingecko: 'ethereum', preferred: true },
      { symbol: 'USDC', name: 'USD Coin', address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', decimals: 6, chain_id: 8453, chain: 'base', coingecko: 'usd-coin', preferred: true },
    ];

    for (const token of tokens) {
      await client.query(`
        INSERT INTO web3_supported_tokens (
          token_symbol, token_name, token_address, decimals,
          chain_id, chain_name, coingecko_id, display_name,
          is_active, is_preferred, sort_order
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (token_symbol, chain_id) DO NOTHING
      `, [
        token.symbol,
        token.name,
        token.address,
        token.decimals,
        token.chain_id,
        token.chain,
        token.coingecko,
        `${token.name} (${token.symbol})`,
        true,
        token.preferred,
        token.preferred ? 0 : 1
      ]);
      console.log(`  ✓ ${token.symbol} on ${token.chain}`);
    }

    // 4.3 定价配置
    const pricingConfigs = [
      {
        key: 'recharge_standard',
        name: '标准充值配置',
        type: 'global',
        price_usd: 0,
        price_pp: 0,
        recharge_enabled: true,
        ratio: 100,
        bonus: 10
      }
    ];

    for (const config of pricingConfigs) {
      await client.query(`
        INSERT INTO web3_pricing_config (
          config_key, config_name, description, content_type,
          price_usd, price_pp, recharge_enabled, recharge_ratio,
          recharge_bonus_percent, is_active, priority
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (config_key) DO NOTHING
      `, [
        config.key,
        config.name,
        '通用充值配置',
        config.type,
        config.price_usd,
        config.price_pp,
        config.recharge_enabled,
        config.ratio,
        config.bonus,
        true,
        100
      ]);
      console.log(`  ✓ ${config.name}`);
    }

    console.log('\n✅ 所有数据插入完成!\n');

    // ============================================
    // 5. 验证
    // ============================================
    console.log('🔍 验证结果:\n');

    const counts = await client.query(`
      SELECT
        (SELECT COUNT(*) FROM web3_system_config) as chains,
        (SELECT COUNT(*) FROM web3_supported_tokens) as tokens,
        (SELECT COUNT(*) FROM web3_pricing_config) as pricing
    `);

    console.log(`  📊 链配置: ${counts.rows[0].chains} 条`);
    console.log(`  📊 代币配置: ${counts.rows[0].tokens} 条`);
    console.log(`  📊 定价配置: ${counts.rows[0].pricing} 条`);

    console.log('\n✅ Web3 配置完成!\n');
    console.log('⚠️  重要提示:');
    console.log('   1. 收款钱包地址已设置为示例地址,请在 Directus 后台修改');
    console.log('   2. 使用 http://localhost:8055 访问 Directus 后台');
    console.log('   3. 在 Settings -> Data Model 中可以看到 web3_* 表');

  } catch (error) {
    console.error('\n❌ 执行失败:', error.message);
    if (error.code === '23505') {
      console.log('\n ℹ️  表已存在,数据未重复插入');
    } else {
      console.error('详细错误:', error);
      process.exit(1);
    }
  } finally {
    client.release();
    await pool.end();
  }
}

main();
