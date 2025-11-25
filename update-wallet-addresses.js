const axios = require('axios');
const readline = require('readline');

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_EMAIL = 'the_uk1@outlook.com';
const DIRECTUS_PASSWORD = 'Mygcdjmyxzg2026!';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function updateWalletAddresses() {
  console.log('💼 更新 Web3 钱包地址配置\n');
  console.log('==========================================\n');

  try {
    // 1. 登录
    console.log('🔐 登录 Directus...');
    const loginRes = await axios.post(`${DIRECTUS_URL}/auth/login`, {
      email: DIRECTUS_EMAIL,
      password: DIRECTUS_PASSWORD
    });
    const token = loginRes.data.data.access_token;
    console.log('✅ 登录成功\n');

    // 2. 获取当前配置
    console.log('📋 获取当前配置...');
    const configRes = await axios.get(`${DIRECTUS_URL}/items/web3_system_config`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const configs = configRes.data.data;
    console.log(`✅ 找到 ${configs.length} 条配置\n`);

    // 显示当前配置
    console.log('当前钱包地址:\n');
    configs.forEach(config => {
      if (config.chain_name) {
        console.log(`${config.chain_name.toUpperCase()}:`);
        console.log(`  当前地址: ${config.platform_wallet_address || '(未设置)'}`);
        console.log(`  RPC: ${config.rpc_url}`);
        console.log('');
      }
    });

    // 3. 询问是否更新
    const shouldUpdate = await question('\n是否要更新钱包地址? (y/n): ');

    if (shouldUpdate.toLowerCase() !== 'y') {
      console.log('\n✅ 取消更新');
      rl.close();
      return;
    }

    console.log('\n📝 请输入新的钱包地址 (留空跳过):\n');

    // 4. 更新各链的钱包地址
    for (const config of configs) {
      if (config.chain_name) {
        const newAddress = await question(`${config.chain_name.toUpperCase()} 钱包地址: `);

        if (newAddress && newAddress.trim()) {
          // 验证地址格式
          if (!newAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
            console.log(`⚠️  警告: ${newAddress} 不是有效的以太坊地址格式 (应为 0x 开头的 42 位)`);
            const confirm = await question('是否仍要使用此地址? (y/n): ');
            if (confirm.toLowerCase() !== 'y') {
              console.log('跳过此链\n');
              continue;
            }
          }

          // 更新配置
          await axios.patch(
            `${DIRECTUS_URL}/items/web3_system_config/${config.id}`,
            { platform_wallet_address: newAddress.trim() },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          console.log(`✅ ${config.chain_name} 钱包地址已更新\n`);
        } else {
          console.log(`⏭️  跳过 ${config.chain_name}\n`);
        }
      }
    }

    // 5. 显示更新后的配置
    console.log('\n📋 更新后的配置:\n');

    const updatedConfigRes = await axios.get(`${DIRECTUS_URL}/items/web3_system_config`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    updatedConfigRes.data.data.forEach(config => {
      if (config.chain_name) {
        console.log(`${config.chain_name.toUpperCase()}:`);
        console.log(`  钱包地址: ${config.platform_wallet_address}`);
        console.log(`  RPC: ${config.rpc_url} (${config.rpc_provider})`);
        console.log('');
      }
    });

    console.log('✅ 配置更新完成!\n');
    console.log('📋 下一步:');
    console.log('1. 确认钱包地址正确');
    console.log('2. 确保钱包有足够的 Gas 费');
    console.log('3. 测试支付功能\n');

    rl.close();

  } catch (error) {
    console.error('\n❌ 错误:', error.response?.data || error.message);
    rl.close();
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  updateWalletAddresses();
}

module.exports = { updateWalletAddresses };
