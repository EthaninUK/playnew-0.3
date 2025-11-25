const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase 配置
const supabaseUrl = 'https://cujpgrzjmmttysphjknu.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1anBncnpqbW10dHlzcGhqa251Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTk5NDg5MywiZXhwIjoyMDc1NTcwODkzfQ.GB8A230FSm68ckj3_eUj9dUzqRtGc70k8Ebjp9dYsdY';

// 创建 Supabase 客户端 (使用 service_role key)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function executeMigration() {
  console.log('🚀 开始执行 Web3 支付系统数据库迁移...\n');

  try {
    // 读取 SQL 文件
    const sqlFile = path.join(__dirname, 'sql', '000_web3_payment_system_complete.sql');
    console.log(`📄 读取 SQL 文件: ${sqlFile}`);

    if (!fs.existsSync(sqlFile)) {
      throw new Error(`SQL 文件不存在: ${sqlFile}`);
    }

    const sql = fs.readFileSync(sqlFile, 'utf8');
    console.log(`✅ SQL 文件读取成功 (${sql.length} 字符)\n`);

    // 执行 SQL
    console.log('⏳ 正在执行 SQL 脚本...\n');

    // 使用 Supabase RPC 执行 SQL (需要先创建一个执行函数)
    // 或者直接使用 postgres client

    // 方式1: 使用 pg 库直接连接
    const { Client } = require('pg');

    const client = new Client({
      host: 'aws-1-ap-northeast-1.pooler.supabase.com',
      port: 5432,
      database: 'postgres',
      user: 'postgres.cujpgrzjmmttysphjknu',
      password: 'bi3d8FpBFTUWuwOb',
      ssl: {
        rejectUnauthorized: false
      }
    });

    await client.connect();
    console.log('✅ 数据库连接成功\n');

    // 执行 SQL
    const result = await client.query(sql);

    console.log('\n✅ SQL 执行成功!\n');

    // 显示通知消息
    if (result && result.length > 0) {
      result.forEach(r => {
        if (r.notices) {
          r.notices.forEach(notice => {
            console.log(notice.message);
          });
        }
      });
    }

    // 验证表是否创建成功
    console.log('\n📊 验证数据库表...\n');

    const tables = [
      'web3_system_config',
      'web3_pricing_config',
      'web3_supported_tokens',
      'web3_payments',
      'user_content_access',
      'credit_transactions'
    ];

    for (const table of tables) {
      const { data, error } = await supabase.from(table).select('*').limit(0);

      if (error) {
        console.log(`❌ ${table}: 验证失败 - ${error.message}`);
      } else {
        console.log(`✅ ${table}: 表已创建`);
      }
    }

    // 检查默认数据
    console.log('\n📋 检查默认配置数据...\n');

    const { data: configs, error: configError } = await supabase
      .from('web3_system_config')
      .select('config_key, config_name, chain_name')
      .limit(10);

    if (!configError && configs) {
      console.log(`✅ 系统配置记录: ${configs.length} 条`);
      configs.forEach(c => {
        console.log(`   - ${c.config_name} (${c.config_key})${c.chain_name ? ` [${c.chain_name}]` : ''}`);
      });
    }

    const { data: pricing, error: pricingError } = await supabase
      .from('web3_pricing_config')
      .select('config_key, config_name, content_type, price_usd, price_pp')
      .limit(10);

    if (!pricingError && pricing) {
      console.log(`\n✅ 定价配置记录: ${pricing.length} 条`);
      pricing.forEach(p => {
        console.log(`   - ${p.config_name}: $${p.price_usd} / ${p.price_pp} PP (${p.content_type})`);
      });
    }

    const { data: tokens, error: tokensError } = await supabase
      .from('web3_supported_tokens')
      .select('token_symbol, chain_name, display_name')
      .limit(10);

    if (!tokensError && tokens) {
      console.log(`\n✅ 代币配置记录: ${tokens.length} 条`);
      tokens.forEach(t => {
        console.log(`   - ${t.display_name} [${t.chain_name}]`);
      });
    }

    await client.end();

    console.log('\n\n🎉 数据库迁移执行成功!\n');
    console.log('📋 下一步操作:');
    console.log('1. 访问 Directus 后台: http://localhost:8055/admin');
    console.log('2. 登录账号: the_uk1@outlook.com');
    console.log('3. 进入 Content > Web3 System Config');
    console.log('4. 更新各链的钱包地址 (platform_wallet_address)');
    console.log('\n5. 或者使用以下命令测试:');
    console.log("   curl -s 'http://localhost:8055/items/web3_system_config' | jq");
    console.log('');

  } catch (error) {
    console.error('\n❌ 执行失败:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// 检查是否安装了 pg 库
try {
  require.resolve('pg');
} catch (e) {
  console.log('⚠️  未找到 pg 库,正在安装...\n');
  const { execSync } = require('child_process');
  execSync('npm install pg', { stdio: 'inherit', cwd: __dirname });
  console.log('');
}

executeMigration();
