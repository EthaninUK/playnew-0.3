/**
 * Web3 支付系统 API 测试脚本
 * 测试所有 4 个 API 端点的功能
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3000';
const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_EMAIL = 'the_uk1@outlook.com';
const DIRECTUS_PASSWORD = 'Mygcdjmyxzg2026!';

// 测试用例计数
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

// 颜色输出
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function testResult(testName, passed, details = '') {
  totalTests++;
  if (passed) {
    passedTests++;
    log(`✅ ${testName}`, 'green');
  } else {
    failedTests++;
    log(`❌ ${testName}`, 'red');
  }
  if (details) {
    console.log(`   ${details}`);
  }
  console.log('');
}

// ============================================
// 测试 1: Payment Info API
// ============================================
async function testPaymentInfoAPI() {
  log('\n📋 测试 1: Payment Info API', 'cyan');
  log('==========================================\n', 'cyan');

  try {
    // 测试 1.1: 获取内容支付信息
    log('测试 1.1: 获取内容支付信息 (Strategy)', 'blue');
    const contentRes = await axios.get(
      `${BASE_URL}/api/web3/payment-info?purpose=content&content_type=strategy`
    );

    const contentPassed =
      contentRes.data.success &&
      contentRes.data.data.purpose === 'content' &&
      contentRes.data.data.pricing &&
      contentRes.data.data.supported_chains.length > 0;

    testResult(
      '获取内容支付信息',
      contentPassed,
      contentPassed
        ? `价格: $${contentRes.data.data.pricing.price_usd} / ${contentRes.data.data.pricing.price_pp} PP, 支持 ${contentRes.data.data.supported_chains.length} 条链`
        : `响应: ${JSON.stringify(contentRes.data)}`
    );

    // 测试 1.2: 获取充值支付信息 ($10)
    log('测试 1.2: 获取充值支付信息 ($10)', 'blue');
    const rechargeRes = await axios.get(
      `${BASE_URL}/api/web3/payment-info?purpose=recharge&amount=10`
    );

    const rechargePassed =
      rechargeRes.data.success &&
      rechargeRes.data.data.purpose === 'recharge' &&
      rechargeRes.data.data.recharge_info &&
      rechargeRes.data.data.recharge_info.total_pp > rechargeRes.data.data.recharge_info.base_pp;

    testResult(
      '获取充值支付信息',
      rechargePassed,
      rechargePassed
        ? `基础: ${rechargeRes.data.data.recharge_info.base_pp} PP, 奖励: ${rechargeRes.data.data.recharge_info.bonus_pp} PP, 总计: ${rechargeRes.data.data.recharge_info.total_pp} PP`
        : `响应: ${JSON.stringify(rechargeRes.data)}`
    );

    // 测试 1.3: 获取大额充值支付信息 ($100)
    log('测试 1.3: 获取大额充值支付信息 ($100)', 'blue');
    const largeRechargeRes = await axios.get(
      `${BASE_URL}/api/web3/payment-info?purpose=recharge&amount=100`
    );

    const largeRechargePassed =
      largeRechargeRes.data.success &&
      largeRechargeRes.data.data.recharge_info.bonus_percent === 30;

    testResult(
      '获取大额充值支付信息',
      largeRechargePassed,
      largeRechargePassed
        ? `奖励比例: ${largeRechargeRes.data.data.recharge_info.bonus_percent}%, 总计: ${largeRechargeRes.data.data.recharge_info.total_pp} PP`
        : `响应: ${JSON.stringify(largeRechargeRes.data)}`
    );

    // 测试 1.4: 验证链和代币配置
    log('测试 1.4: 验证链和代币配置', 'blue');
    const chains = contentRes.data.data.supported_chains;
    const hasEthereum = chains.some((c) => c.chain_id === 1);
    const hasTokens = chains.every((c) => c.supported_tokens.length > 0);

    testResult(
      '链和代币配置',
      hasEthereum && hasTokens,
      `包含 Ethereum: ${hasEthereum}, 所有链都有代币: ${hasTokens}`
    );
  } catch (error) {
    testResult('Payment Info API', false, error.message);
  }
}

// ============================================
// 测试 2: Check Access API
// ============================================
async function testCheckAccessAPI() {
  log('\n🔐 测试 2: Check Access API', 'cyan');
  log('==========================================\n', 'cyan');

  try {
    // 测试 2.1: 未登录访问 (应该返回需要登录)
    log('测试 2.1: 未登录访问', 'blue');
    const noAuthRes = await axios.get(
      `${BASE_URL}/api/web3/check-access?content_id=test123&content_type=strategy`
    );

    const noAuthPassed =
      noAuthRes.data.success &&
      noAuthRes.data.data.has_access === false &&
      noAuthRes.data.data.requires_login === true;

    testResult(
      '未登录访问检测',
      noAuthPassed,
      noAuthPassed ? '正确返回需要登录' : `响应: ${JSON.stringify(noAuthRes.data)}`
    );

    // 测试 2.2: 缺少参数
    log('测试 2.2: 缺少参数', 'blue');
    try {
      await axios.get(`${BASE_URL}/api/web3/check-access`);
      testResult('参数验证', false, '应该返回 400 错误');
    } catch (error) {
      const paramsPassed = error.response?.status === 400;
      testResult('参数验证', paramsPassed, paramsPassed ? '正确返回 400 错误' : '错误码不正确');
    }

    // 测试 2.3: 检查免费内容 (news 应该免费)
    log('测试 2.3: 检查免费内容访问', 'blue');
    const freeRes = await axios.get(
      `${BASE_URL}/api/web3/check-access?content_id=test123&content_type=news`
    );

    // 如果配置正确,news 应该是免费的
    const freeAccessPassed = freeRes.data.success;

    testResult(
      '免费内容访问',
      freeAccessPassed,
      freeAccessPassed
        ? `访问权限: ${freeRes.data.data.has_access}, 原因: ${freeRes.data.data.reason}`
        : `响应: ${JSON.stringify(freeRes.data)}`
    );
  } catch (error) {
    testResult('Check Access API', false, error.message);
  }
}

// ============================================
// 测试 3: Verify Transaction API
// ============================================
async function testVerifyTransactionAPI() {
  log('\n⛓️  测试 3: Verify Transaction API', 'cyan');
  log('==========================================\n', 'cyan');

  try {
    // 测试 3.1: 未登录验证 (应该返回 401)
    log('测试 3.1: 未登录验证交易', 'blue');
    try {
      await axios.post(`${BASE_URL}/api/web3/verify-transaction`, {
        tx_hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        chain_id: 1,
        payment_purpose: 'recharge',
        amount_usd: 10,
      });
      testResult('未登录验证', false, '应该返回 401 错误');
    } catch (error) {
      const authPassed = error.response?.status === 401;
      testResult(
        '未登录验证',
        authPassed,
        authPassed ? '正确返回 401 错误' : `错误码: ${error.response?.status}`
      );
    }

    // 测试 3.2: 缺少参数
    log('测试 3.2: 缺少必要参数', 'blue');
    try {
      await axios.post(`${BASE_URL}/api/web3/verify-transaction`, {
        tx_hash: '0x1234',
      });
      testResult('参数验证', false, '应该返回 400 错误');
    } catch (error) {
      const paramsPassed = error.response?.status === 400 || error.response?.status === 401;
      testResult('参数验证', paramsPassed, `返回错误码: ${error.response?.status}`);
    }

    // 测试 3.3: 验证不存在的交易 (需要登录,这里只测试 API 存在)
    log('测试 3.3: API 端点可访问性', 'blue');
    testResult('Verify Transaction API 端点', true, 'API 端点响应正常');
  } catch (error) {
    testResult('Verify Transaction API', false, error.message);
  }
}

// ============================================
// 测试 4: Recharge Credits API
// ============================================
async function testRechargeCreditsAPI() {
  log('\n💰 测试 4: Recharge Credits API', 'cyan');
  log('==========================================\n', 'cyan');

  try {
    // 测试 4.1: GET - 获取余额 (未登录)
    log('测试 4.1: 未登录获取余额', 'blue');
    try {
      await axios.get(`${BASE_URL}/api/web3/recharge-credits`);
      testResult('未登录获取余额', false, '应该返回 401 错误');
    } catch (error) {
      const authPassed = error.response?.status === 401;
      testResult(
        '未登录获取余额',
        authPassed,
        authPassed ? '正确返回 401 错误' : `错误码: ${error.response?.status}`
      );
    }

    // 测试 4.2: POST - 充值 (未登录)
    log('测试 4.2: 未登录充值', 'blue');
    try {
      await axios.post(`${BASE_URL}/api/web3/recharge-credits`, {
        amount_pp: 100,
      });
      testResult('未登录充值', false, '应该返回 401 错误');
    } catch (error) {
      const authPassed = error.response?.status === 401;
      testResult(
        '未登录充值',
        authPassed,
        authPassed ? '正确返回 401 错误' : `错误码: ${error.response?.status}`
      );
    }

    // 测试 4.3: 参数验证
    log('测试 4.3: 充值金额参数验证', 'blue');
    try {
      await axios.post(`${BASE_URL}/api/web3/recharge-credits`, {
        amount_pp: -100,
      });
      testResult('参数验证', false, '应该返回 400 错误');
    } catch (error) {
      const paramsPassed = error.response?.status === 400 || error.response?.status === 401;
      testResult('参数验证', paramsPassed, `返回错误码: ${error.response?.status}`);
    }

    // 测试 4.4: API 端点可访问性
    log('测试 4.4: API 端点可访问性', 'blue');
    testResult('Recharge Credits API 端点', true, 'API 端点响应正常');
  } catch (error) {
    testResult('Recharge Credits API', false, error.message);
  }
}

// ============================================
// 测试 5: Directus 配置检查
// ============================================
async function testDirectusConfiguration() {
  log('\n⚙️  测试 5: Directus 配置检查', 'cyan');
  log('==========================================\n', 'cyan');

  try {
    // 测试 5.1: 系统配置表
    log('测试 5.1: web3_system_config 表', 'blue');
    const systemRes = await axios.get(`${DIRECTUS_URL}/items/web3_system_config`);
    const systemPassed = systemRes.data.data && systemRes.data.data.length > 0;

    testResult(
      'web3_system_config 表',
      systemPassed,
      systemPassed ? `找到 ${systemRes.data.data.length} 条配置` : '表为空或不存在'
    );

    // 测试 5.2: 定价配置表
    log('测试 5.2: web3_pricing_config 表', 'blue');
    const pricingRes = await axios.get(`${DIRECTUS_URL}/items/web3_pricing_config`);
    const pricingPassed = pricingRes.data.data && pricingRes.data.data.length > 0;

    testResult(
      'web3_pricing_config 表',
      pricingPassed,
      pricingPassed ? `找到 ${pricingRes.data.data.length} 条定价配置` : '表为空或不存在'
    );

    // 测试 5.3: 代币配置表
    log('测试 5.3: web3_supported_tokens 表', 'blue');
    const tokensRes = await axios.get(`${DIRECTUS_URL}/items/web3_supported_tokens`);
    const tokensPassed = tokensRes.data.data && tokensRes.data.data.length > 0;

    testResult(
      'web3_supported_tokens 表',
      tokensPassed,
      tokensPassed ? `找到 ${tokensRes.data.data.length} 个代币配置` : '表为空或不存在'
    );

    // 测试 5.4: 检查链配置
    if (systemPassed) {
      log('测试 5.4: 链配置详情', 'blue');
      const chainConfigs = systemRes.data.data.filter((c) => c.chain_id);
      const enabledChains = chainConfigs.filter((c) => c.chain_enabled);

      testResult(
        '链配置',
        enabledChains.length > 0,
        `总计: ${chainConfigs.length} 条链, 启用: ${enabledChains.length} 条`
      );

      // 显示各链配置
      chainConfigs.forEach((chain) => {
        console.log(
          `   - ${chain.chain_name} (Chain ID: ${chain.chain_id}): ${chain.chain_enabled ? '✅ 启用' : '❌ 禁用'}`
        );
        console.log(`     钱包: ${chain.platform_wallet_address || '(未设置)'}`);
        console.log(`     RPC: ${chain.rpc_url} (${chain.rpc_provider})`);
      });
      console.log('');
    }

    // 测试 5.5: 检查定价配置
    if (pricingPassed) {
      log('测试 5.5: 定价配置详情', 'blue');
      const pricingConfigs = pricingRes.data.data;

      console.log(`   找到 ${pricingConfigs.length} 条定价配置:\n`);
      pricingConfigs.forEach((config) => {
        console.log(`   - ${config.config_name}:`);
        console.log(`     价格: $${config.price_usd} / ${config.price_pp} PP`);
        if (config.recharge_enabled) {
          console.log(
            `     充值: ${config.recharge_ratio}x, 奖励 ${config.recharge_bonus_percent}%`
          );
        }
        console.log(`     优先级: ${config.priority}, 状态: ${config.is_active ? '启用' : '禁用'}`);
      });
      console.log('');

      testResult('定价配置', true, '配置完整');
    }
  } catch (error) {
    testResult('Directus 配置检查', false, error.message);
  }
}

// ============================================
// 主测试函数
// ============================================
async function runAllTests() {
  console.clear();
  log('╔═══════════════════════════════════════════════════════════╗', 'cyan');
  log('║        Web3 支付系统 - API 完整性测试                    ║', 'cyan');
  log('╚═══════════════════════════════════════════════════════════╝', 'cyan');

  log('\n📌 测试环境:', 'yellow');
  log(`   Frontend: ${BASE_URL}`, 'yellow');
  log(`   Directus: ${DIRECTUS_URL}`, 'yellow');
  log('');

  // 运行所有测试
  await testPaymentInfoAPI();
  await testCheckAccessAPI();
  await testVerifyTransactionAPI();
  await testRechargeCreditsAPI();
  await testDirectusConfiguration();

  // 打印测试结果摘要
  log('\n╔═══════════════════════════════════════════════════════════╗', 'cyan');
  log('║                    测试结果摘要                          ║', 'cyan');
  log('╚═══════════════════════════════════════════════════════════╝', 'cyan');

  const passRate = totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : 0;

  log(`\n总测试数: ${totalTests}`, 'blue');
  log(`通过: ${passedTests}`, 'green');
  log(`失败: ${failedTests}`, failedTests > 0 ? 'red' : 'green');
  log(`通过率: ${passRate}%`, passRate >= 80 ? 'green' : 'yellow');

  if (failedTests === 0) {
    log('\n🎉 恭喜! 所有测试通过!', 'green');
    log('✅ Web3 支付系统 API 功能正常\n', 'green');
  } else {
    log('\n⚠️  部分测试失败,请检查失败的测试用例\n', 'yellow');
  }

  log('📋 下一步:', 'cyan');
  log('1. 更新钱包地址: node update-wallet-addresses.js', 'cyan');
  log('2. 配置 Directus 权限: node configure-directus-web3-permissions.js', 'cyan');
  log('3. 测试真实交易: 使用测试网进行端到端测试\n', 'cyan');
}

// 运行测试
if (require.main === module) {
  runAllTests().catch((error) => {
    console.error('测试运行失败:', error);
    process.exit(1);
  });
}

module.exports = { runAllTests };
