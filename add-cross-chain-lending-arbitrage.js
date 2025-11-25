const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQ0MTkzNWNkLTEwNGEtNDcwMy04ZDQ4LTNmYWE3NGNlZWIxNiIsInJvbGUiOiI3MTVlYjVkZS04NGM5LTRmNmQtYjU3MC1kMzIxYjM0Mjg1ODUiLCJhcHBfYWNjZXNzIjp0cnVlLCJhZG1pbl9hY2Nlc3MiOnRydWUsImlhdCI6MTc2MjUxNzY4NiwiZXhwIjoxNzYyNTE4NTg2LCJpc3MiOiJkaXJlY3R1cyJ9.SW47u3_ev9TRFCTo_PS7FMZjI9d9l-yGr5EVB7loXNM';

const GUIDE_CONFIG = {
  title: '跨链借贷套利',
  slug: 'cross-chain-lending-arbitrage',
  summary: '利用不同区块链之间的借贷利率差异进行套利，通过跨链桥实现资产转移，捕捉多链借贷市场的利率波动机会，年化收益可达15-60%。',
  content: `# 跨链借贷套利

## 策略概述

跨链借贷套利是利用不同区块链网络（如Ethereum、Arbitrum、Optimism、Polygon、BNB Chain）上借贷协议之间的利率差异来获取无风险或低风险收益的策略。通过跨链桥快速转移资产，在利率高的链上存款，在利率低的链上借款，赚取利差收益。

### 核心优势

- 💰 **利率差异明显**：不同链的资金供需不同，利率差可达10-30%
- ⚡ **跨链桥成熟**：LayerZero、Stargate、Axelar等跨链基础设施完善
- 🔄 **套利机会多**：支持同协议跨链套利和跨协议套利
- 📊 **市场效率低**：相比CEX，DeFi跨链套利市场效率仍有提升空间

### 适用场景

1. **稳定币利率套利**：USDC/USDT在不同链的借贷利率差
2. **主流资产套利**：ETH、BTC等跨链利率差
3. **原生代币套利**：如MATIC在Polygon、BNB在BSC的利率优势
4. **流动性挖矿套利**：结合代币激励的跨链策略

## 策略原理

### 基本套利流程

\`\`\`
1. 监控利率差
   ├─ Ethereum Aave: USDC 存款 3% APY
   ├─ Arbitrum Aave: USDC 存款 8% APY
   └─ 发现 5% 利率差

2. 资产跨链转移
   ├─ 使用 Stargate Bridge
   ├─ 从 Ethereum 转 10,000 USDC 到 Arbitrum
   └─ 跨链费用: ~$5-20

3. 执行套利
   ├─ 在 Arbitrum Aave 存入 10,000 USDC
   ├─ 获得 8% APY (800 USDC/年)
   └─ 相比 Ethereum 多赚 500 USDC/年

4. 动态调整
   ├─ 利率差缩小时退出
   └─ 寻找新的套利机会
\`\`\`

### 高级策略：循环套利

\`\`\`javascript
// 跨链循环借贷套利示例
const crossChainLoopingStrategy = {
  chain1: {
    name: 'Ethereum',
    protocol: 'Aave V3',
    action: 'supply',
    asset: 'USDC',
    amount: 10000,
    apy: 3.5
  },
  chain2: {
    name: 'Arbitrum',
    protocol: 'Aave V3',
    action: 'borrow',
    asset: 'USDC',
    amount: 7000, // 70% LTV
    apy: 2.8,
    collateral: 'ETH'
  },
  profitCalculation: {
    supplyIncome: 10000 * 0.035,      // 350 USDC
    borrowCost: 7000 * 0.028,          // -196 USDC
    netProfit: 154,                     // 154 USDC/年
    roi: (154 / 3000) * 100            // 5.13% (基于自有资金3000)
  }
}
\`\`\`

## 操作步骤

### 第一步：选择跨链桥

#### 主流跨链桥对比

| 跨链桥 | 支持链 | 费用 | 速度 | 安全性 |
|--------|--------|------|------|--------|
| **Stargate** | 7+ | 中 | 快(5-10分钟) | 高 (LayerZero) |
| **Axelar** | 15+ | 中高 | 中(10-20分钟) | 高 |
| **Connext** | 10+ | 低 | 快(2-5分钟) | 中高 |
| **Hop Protocol** | 6+ | 低 | 快(5-10分钟) | 高 |
| **Synapse** | 18+ | 中 | 中(10-15分钟) | 中高 |

#### Stargate 跨链操作示例

\`\`\`solidity
// 使用 Stargate 跨链转移 USDC
interface IStargateRouter {
    function swap(
        uint16 _dstChainId,      // 目标链ID
        uint256 _srcPoolId,       // 源链资金池ID
        uint256 _dstPoolId,       // 目标链资金池ID
        address payable _refundAddress,
        uint256 _amountLD,        // 转移金额
        uint256 _minAmountLD,     // 最小接收金额
        lzTxObj memory _lzTxParams,
        bytes calldata _to,       // 目标地址
        bytes calldata _payload
    ) external payable;
}

// 实际调用
stargateRouter.swap{value: msg.value}(
    110,                    // Arbitrum chainId
    1,                      // USDC pool ID (源链)
    1,                      // USDC pool ID (目标链)
    payable(msg.sender),    // 退款地址
    10000 * 1e6,           // 10,000 USDC
    9950 * 1e6,            // 最少接收 9,950 USDC (0.5% 滑点)
    lzTxObj(200000, 0, "0x"),
    abi.encodePacked(receiverAddress),
    "0x"
);
\`\`\`

### 第二步：监控多链利率

#### 利率监控工具

1. **DeFiLlama**：https://defillama.com/yields
   - 聚合所有链的借贷利率
   - 支持按链、协议、资产筛选
   - 提供历史利率数据

2. **Aave Rate Dashboard**
   - 实时监控 Aave 在各链的利率
   - Ethereum, Arbitrum, Optimism, Polygon, Avalanche

3. **自建监控脚本**

\`\`\`javascript
const ethers = require('ethers');

// 监控多链 Aave 利率
async function monitorCrossChainRates() {
  const chains = [
    { name: 'Ethereum', rpc: 'https://eth.llamarpc.com', poolAddress: '0x...' },
    { name: 'Arbitrum', rpc: 'https://arb1.arbitrum.io/rpc', poolAddress: '0x...' },
    { name: 'Optimism', rpc: 'https://mainnet.optimism.io', poolAddress: '0x...' },
  ];

  const rates = {};

  for (const chain of chains) {
    const provider = new ethers.JsonRpcProvider(chain.rpc);
    const pool = new ethers.Contract(chain.poolAddress, POOL_ABI, provider);

    // 获取 USDC 存款利率
    const reserveData = await pool.getReserveData(USDC_ADDRESS);
    const supplyRate = Number(reserveData.currentLiquidityRate) / 1e27 * 100;

    rates[chain.name] = supplyRate;
  }

  // 计算最大利差
  const maxRate = Math.max(...Object.values(rates));
  const minRate = Math.min(...Object.values(rates));
  const spread = maxRate - minRate;

  console.log('当前利率:', rates);
  console.log('最大利差:', spread.toFixed(2) + '%');

  // 如果利差 > 3%，发送套利信号
  if (spread > 3) {
    console.log('🚨 套利机会！利差超过 3%');
    return { shouldArbitrage: true, rates };
  }

  return { shouldArbitrage: false, rates };
}

// 每小时检查一次
setInterval(monitorCrossChainRates, 3600000);
\`\`\`

### 第三步：执行套利操作

#### 完整套利流程

1. **资金准备**
   - 准备原生代币支付 Gas（ETH、MATIC、BNB等）
   - 准备跨链桥费用（通常为源链原生代币）

2. **跨链转移**
   \`\`\`
   Ethereum (低利率) -> Stargate Bridge -> Arbitrum (高利率)
   \`\`\`

3. **目标链存款**
   - 在 Arbitrum Aave 存入 USDC
   - 获得 aToken 作为凭证

4. **持续监控**
   - 每日检查利率变化
   - 利差收窄时及时退出

#### 自动化套利合约示例

\`\`\`solidity
// 跨链借贷套利合约
contract CrossChainArbitrage {
    IStargateRouter public stargateRouter;
    IPool public aavePool;

    struct ArbitrageParams {
        uint16 dstChainId;
        address asset;
        uint256 amount;
        address dstProtocol;
    }

    // 执行跨链套利
    function executeArbitrage(ArbitrageParams memory params) external payable {
        // 1. 从用户转入资产
        IERC20(params.asset).transferFrom(msg.sender, address(this), params.amount);

        // 2. 通过 Stargate 跨链
        IERC20(params.asset).approve(address(stargateRouter), params.amount);

        stargateRouter.swap{value: msg.value}(
            params.dstChainId,
            getPoolId(params.asset),
            getPoolId(params.asset),
            payable(msg.sender),
            params.amount,
            params.amount * 99 / 100, // 1% 滑点保护
            lzTxObj(200000, 0, "0x"),
            abi.encodePacked(params.dstProtocol),
            abi.encode(msg.sender, params.asset, params.amount) // 目标链执行参数
        );

        emit ArbitrageExecuted(msg.sender, params.asset, params.amount, params.dstChainId);
    }

    // LayerZero 接收函数（目标链执行）
    function lzReceive(
        uint16 _srcChainId,
        bytes memory _srcAddress,
        uint64 _nonce,
        bytes memory _payload
    ) external {
        require(msg.sender == address(stargateRouter), "Unauthorized");

        (address user, address asset, uint256 amount) = abi.decode(_payload, (address, address, uint256));

        // 在目标链 Aave 存入资产
        IERC20(asset).approve(address(aavePool), amount);
        aavePool.supply(asset, amount, user, 0);

        emit DepositedOnDestChain(user, asset, amount);
    }
}
\`\`\`

### 第四步：收益提取与再平衡

#### 收益管理策略

1. **定期提取收益**
   - 每周或每月提取利息收入
   - 扣除跨链成本后的净收益

2. **动态再平衡**
\`\`\`javascript
// 自动再平衡逻辑
async function rebalanceStrategy() {
  const currentRates = await monitorCrossChainRates();

  // 如果利差 < 2%，不值得套利（考虑Gas和跨链费用）
  if (currentRates.spread < 2) {
    console.log('利差过小，退出套利');
    // 将资金转回原链或寻找新机会
    await withdrawAndBridge();
    return;
  }

  // 如果新的链有更高利率，转移资金
  const bestChain = Object.keys(currentRates.rates).reduce((a, b) =>
    currentRates.rates[a] > currentRates.rates[b] ? a : b
  );

  if (bestChain !== currentChain) {
    console.log(\`发现更好的机会：\${bestChain}\`);
    await bridgeToNewChain(bestChain);
  }
}
\`\`\`

### 第五步：风险监控与止损

#### 关键风险指标

1. **跨链桥风险监控**
\`\`\`javascript
// 监控跨链桥 TVL 和健康度
async function monitorBridgeHealth(bridgeName) {
  const response = await fetch(\`https://api.llama.fi/protocol/\${bridgeName}\`);
  const data = await response.json();

  // TVL 大幅下降可能表示安全问题
  const tvlChange = (data.tvl[0].totalLiquidityUSD - data.tvl[7].totalLiquidityUSD) / data.tvl[7].totalLiquidityUSD;

  if (tvlChange < -0.2) {
    console.warn('⚠️ 跨链桥 TVL 下降超过 20%，建议暂停使用');
    return false;
  }

  return true;
}
\`\`\`

2. **借贷协议健康度**
   - 监控协议总借款率（Utilization Rate）
   - 高于 90% 时可能面临流动性不足
   - 设置自动提醒和止损

3. **Gas 费用监控**
   - Ethereum L1 Gas 过高时暂停操作
   - 优先使用 L2 和侧链降低成本

#### 止损策略

\`\`\`javascript
// 自动止损逻辑
const stopLossRules = {
  minSpread: 2,              // 最小利差 2%
  maxGasCost: 50,            // 单次操作 Gas 不超过 $50
  maxBridgeFee: 0.5,         // 跨链费用不超过 0.5%
  bridgeTVLDropThreshold: -0.2  // 跨链桥 TVL 下降阈值
};

async function checkStopLoss() {
  const rates = await monitorCrossChainRates();
  const gasCost = await estimateGasCost();
  const bridgeHealth = await monitorBridgeHealth('stargate');

  if (rates.spread < stopLossRules.minSpread) {
    await emergencyWithdraw('利差过小');
    return;
  }

  if (gasCost > stopLossRules.maxGasCost) {
    console.warn('Gas 费用过高，暂停操作');
    return;
  }

  if (!bridgeHealth) {
    await emergencyWithdraw('跨链桥异常');
    return;
  }
}
\`\`\`

## 收益示例

### 场景一：USDC 跨链套利（小额资金）

- **本金**：10,000 USDC
- **源链**：Ethereum Aave (3% APY)
- **目标链**：Arbitrum Aave (8% APY)
- **利差**：5%
- **跨链成本**：$15 (往返 $30)
- **年化净收益**：
  - 利息收入：10,000 × 8% = 800 USDC
  - 跨链成本：30 USDC (往返一次)
  - 净收益：770 USDC
  - **净 APY：7.7%**

### 场景二：ETH 多链轮动套利（中等资金）

- **本金**：10 ETH (~$20,000)
- **策略**：根据利率动态切换链
  - Q1: Optimism Aave (5% APY)
  - Q2: Arbitrum Aave (7% APY)
  - Q3: Polygon Aave (12% APY)
  - Q4: Arbitrum Aave (6% APY)
- **平均 APY**：7.5%
- **跨链成本**：$120 (3次跨链，每次$40)
- **年化收益**：
  - 利息收入：20,000 × 7.5% = 1,500 USD
  - 跨链成本：120 USD
  - 净收益：1,380 USD
  - **净 APY：6.9%**

### 场景三：高级循环套利（大额资金）

- **本金**：100,000 USDC
- **策略**：跨链 + 循环借贷
  1. 在 Arbitrum 存入 100,000 USDC (8% APY)
  2. 以 ETH 作为抵押在 Ethereum 借出 70,000 USDC (3% APR)
  3. 将借出的 USDC 跨链到 Arbitrum 继续存款
  4. 循环 2 次
- **收益计算**：
  - 第一轮存款：100,000 × 8% = 8,000 USDC
  - 第二轮存款：70,000 × 8% = 5,600 USDC
  - 借款成本：70,000 × 3% = -2,100 USDC
  - 跨链成本：-150 USDC
  - 净收益：11,350 USDC
  - **净 APY：11.35%**（基于本金 100,000）
  - **ROI：~38%**（基于实际投入的自有资金 30,000）

## 进阶技巧

### 1. MEV 套利保护

使用 Flashbots 或私有 RPC 避免被抢跑：

\`\`\`javascript
const { FlashbotsBundleProvider } = require('@flashbots/ethers-provider-bundle');

async function executeProtectedArbitrage() {
  const flashbotsProvider = await FlashbotsBundleProvider.create(
    provider,
    authSigner,
    'https://relay.flashbots.net'
  );

  // 构建交易 bundle
  const signedTransactions = await flashbotsProvider.signBundle([
    {
      signer: wallet,
      transaction: crossChainTx
    }
  ]);

  // 发送到 Flashbots，避免 mempool 暴露
  const bundleSubmission = await flashbotsProvider.sendRawBundle(
    signedTransactions,
    targetBlockNumber
  );
}
\`\`\`

### 2. 利用流动性激励

结合代币激励的跨链套利：

\`\`\`
Polygon Aave:
- USDC 存款 APY: 8%
- MATIC 激励: +4%
- 总 APY: 12%

相比 Ethereum Aave (3%)，多赚 9%
\`\`\`

### 3. 自动化执行框架

使用 Gelato Network 或 Chainlink Automation 自动执行：

\`\`\`solidity
// Chainlink Automation 自动再平衡
contract AutomatedCrossChainArbitrage is AutomationCompatibleInterface {

    function checkUpkeep(bytes calldata) external view override returns (bool upkeepNeeded, bytes memory performData) {
        // 检查是否有套利机会
        (bool hasOpportunity, ArbitrageParams memory params) = checkArbitrageOpportunity();

        upkeepNeeded = hasOpportunity;
        performData = abi.encode(params);
    }

    function performUpkeep(bytes calldata performData) external override {
        ArbitrageParams memory params = abi.decode(performData, (ArbitrageParams));

        // 执行跨链套利
        executeArbitrage(params);
    }
}
\`\`\`

## 风险提示

⚠️ **跨链桥风险**
- 跨链桥可能存在智能合约漏洞
- 历史上多起跨链桥被盗事件（Ronin、Wormhole等）
- 建议分散使用多个跨链桥，单次转移金额不超过总资产的30%

⚠️ **利率波动风险**
- 利率差可能在跨链过程中消失
- 设置最小利差阈值（建议 > 3%）
- 监控目标链的资金流入情况

⚠️ **流动性风险**
- 目标链协议可能流动性不足，无法提现
- 检查协议的可用流动性（Available Liquidity）
- 避免将大额资金存入小型协议

⚠️ **成本风险**
- Gas 费用和跨链费用可能侵蚀收益
- 小额资金（< $5,000）套利成本占比高
- 计算盈亏平衡点：\`利差 × 本金 × 时间 > 跨链成本\`

⚠️ **智能合约风险**
- 自动化套利合约可能存在漏洞
- 建议先进行小额测试
- 使用经过审计的合约模板

## 总结

跨链借贷套利是利用多链生态利率差的有效策略，适合中大额资金和有一定技术能力的用户。关键是：
1. 实时监控多链利率，捕捉 > 3% 的利差机会
2. 选择安全可靠的跨链桥（Stargate、Axelar等）
3. 严格控制成本，计算净收益
4. 设置止损规则，动态调整策略
5. 考虑自动化执行降低操作成本

通过合理配置和风险管理，跨链借贷套利可实现 8-20% 的稳定年化收益。
`,

  // 基本分类
  status: 'published',
  category: 'lending',
  category_l1: 'yield',
  category_l2: '借贷挖息',

  // 难度和风险
  difficulty_level: 4,
  risk_level: 4,

  // 收益
  apy_min: 15,
  apy_max: 60,

  // 适合人群
  threshold_investment_min: 5000,
  threshold_investment_max: null,
  threshold_tech_level: 'advanced',

  // 关键特征
  time_commitment: 'medium',
  liquidity: 'high',
  complexity_score: 85,

  // 标签
  tags: null,

  // 协议
  protocol_names: ['Stargate Finance', 'Aave V3', 'LayerZero', 'Axelar', 'Hop Protocol'],

  // 区块链
  chains: null,

  // 相关策略
  related_strategies: [],

  // 步骤
  steps: [
    {
      step_number: 1,
      title: '选择跨链桥',
      description: '选择安全可靠的跨链桥（Stargate、Axelar、Hop等），对比费用和速度，准备源链和目标链的原生代币支付Gas费用。',
      estimated_time: '30分钟',
      image_url: null,
      code_example: null
    },
    {
      step_number: 2,
      title: '监控多链利率',
      description: '使用DeFiLlama等工具监控不同区块链上的借贷利率，寻找利差 > 3% 的套利机会，可以自建监控脚本实现自动化。',
      estimated_time: '持续监控',
      image_url: null,
      code_example: null
    },
    {
      step_number: 3,
      title: '执行跨链转移',
      description: '通过跨链桥将资产从低利率链转移到高利率链，注意控制滑点和跨链费用，确认交易成功后在目标链存入借贷协议。',
      estimated_time: '10-30分钟',
      image_url: null,
      code_example: null
    },
    {
      step_number: 4,
      title: '收益提取与再平衡',
      description: '定期提取利息收益，监控利率变化，当利差收窄或发现更好机会时，动态调整资金分配，实现收益最大化。',
      estimated_time: '每周检查',
      image_url: null,
      code_example: null
    },
    {
      step_number: 5,
      title: '风险监控与止损',
      description: '持续监控跨链桥健康度、协议流动性、Gas费用等风险指标，设置止损规则，在利差 < 2% 或出现异常时及时退出。',
      estimated_time: '持续监控',
      image_url: null,
      code_example: null
    }
  ]
};

async function createStrategy() {
  try {
    console.log('开始创建跨链借贷套利策略...\n');

    const response = await axios.post(
      `${DIRECTUS_URL}/items/strategies`,
      GUIDE_CONFIG,
      {
        headers: {
          'Authorization': `Bearer ${DIRECTUS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ 跨链借贷套利创建成功!');
    console.log(`   ID: ${response.data.data.id}`);
    console.log(`   Slug: ${response.data.data.slug}`);
    console.log(`   访问: http://localhost:3000/strategies/${response.data.data.slug}`);

  } catch (error) {
    console.error('❌ 创建失败:', error.response?.data || error.message);
    if (error.response?.data?.errors) {
      error.response.data.errors.forEach(err => {
        console.error(`   - ${err.message}`);
      });
    }
  }
}

createStrategy();
