/**
 * 启用 Web3 链配置
 */

const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_EMAIL = 'the_uk1@outlook.com';
const DIRECTUS_PASSWORD = 'Mygcdjmyxzg2026!';

async function enableChains() {
  console.log('🔧 启用 Web3 链配置...\n');

  try {
    // 1. 登录
    console.log('1️⃣ 登录 Directus...');
    const loginRes = await axios.post(`${DIRECTUS_URL}/auth/login`, {
      email: DIRECTUS_EMAIL,
      password: DIRECTUS_PASSWORD
    });
    const token = loginRes.data.data.access_token;
    console.log('✅ 登录成功\n');

    // 2. 获取所有链配置
    console.log('2️⃣ 获取链配置...');
    const configRes = await axios.get(`${DIRECTUS_URL}/items/web3_system_config`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const configs = configRes.data.data;
    console.log(`✅ 找到 ${configs.length} 条配置\n`);

    // 3. 启用所有链
    console.log('3️⃣ 启用所有链配置...\n');

    for (const config of configs) {
      if (config.chain_id) {
        // 更新为启用状态
        await axios.patch(
          `${DIRECTUS_URL}/items/web3_system_config/${config.id}`,
          {
            chain_enabled: true,
            is_active: true
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log(`✅ ${config.chain_name} (Chain ID: ${config.chain_id}) 已启用`);
      }
    }

    console.log('\n✅ 所有链配置已启用!\n');

    // 4. 显示最终配置
    const updatedRes = await axios.get(`${DIRECTUS_URL}/items/web3_system_config`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('📋 当前配置:\n');
    updatedRes.data.data.forEach(config => {
      if (config.chain_id) {
        console.log(`${config.chain_name}:`);
        console.log(`  Chain ID: ${config.chain_id}`);
        console.log(`  状态: ${config.chain_enabled ? '✅ 启用' : '❌ 禁用'}`);
        console.log(`  钱包: ${config.platform_wallet_address || '(未设置)'}`);
        console.log(`  RPC: ${config.rpc_url}`);
        console.log('');
      }
    });

  } catch (error) {
    console.error('❌ 错误:', error.response?.data || error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  enableChains();
}

module.exports = { enableChains };
