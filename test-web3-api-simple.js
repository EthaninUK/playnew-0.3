/**
 * 简单测试 Web3 配置是否可以被访问
 */

const DIRECTUS_URL = 'http://localhost:8055';

async function test() {
  console.log('🧪 测试 Web3 配置表访问\n');

  // 1. 测试链配置
  console.log('1️⃣  测试链配置...');
  try {
    const response = await fetch(
      `${DIRECTUS_URL}/items/web3_system_config?filter[chain_enabled][_eq]=true&filter[chain_id][_nnull]=true`
    );
    const data = await response.json();

    if (data.data) {
      console.log(`   ✅ 链配置可访问: ${data.data.length} 条记录`);
      data.data.forEach(chain => {
        console.log(`      - ${chain.chain_name} (ID: ${chain.chain_id})`);
      });
    } else {
      console.log('   ❌ 链配置访问失败:', data.errors?.[0]?.message);
    }
  } catch (error) {
    console.log('   ❌ 请求失败:', error.message);
  }

  // 2. 测试代币配置
  console.log('\n2️⃣  测试代币配置...');
  try {
    const response = await fetch(
      `${DIRECTUS_URL}/items/web3_supported_tokens?filter[chain_id][_eq]=1&filter[is_active][_eq]=true`
    );
    const data = await response.json();

    if (data.data) {
      console.log(`   ✅ 代币配置可访问: ${data.data.length} 条记录`);
      data.data.forEach(token => {
        console.log(`      - ${token.token_symbol} (${token.token_name})`);
      });
    } else {
      console.log('   ❌ 代币配置访问失败:', data.errors?.[0]?.message);
    }
  } catch (error) {
    console.log('   ❌ 请求失败:', error.message);
  }

  // 3. 测试充值配置
  console.log('\n3️⃣  测试充值配置...');
  try {
    const response = await fetch(
      `${DIRECTUS_URL}/items/web3_pricing_config?filter[content_type][_eq]=global&filter[recharge_enabled][_eq]=true`
    );
    const data = await response.json();

    if (data.data) {
      console.log(`   ✅ 充值配置可访问: ${data.data.length} 条记录`);
      data.data.forEach(config => {
        console.log(`      - ${config.config_name}: 1 USD = ${config.recharge_ratio} PP (+${config.recharge_bonus_percent}%)`);
      });
    } else {
      console.log('   ❌ 充值配置访问失败:', data.errors?.[0]?.message);
    }
  } catch (error) {
    console.log('   ❌ 请求失败:', error.message);
  }

  console.log('\n✅ 测试完成!');
  console.log('\n📝 下一步:');
  console.log('   刷新浏览器中的充值对话框,现在应该可以正常加载了');
}

test();
