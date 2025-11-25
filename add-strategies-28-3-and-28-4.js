const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_EMAIL = 'the_uk1@outlook.com';
const DIRECTUS_PASSWORD = 'Mygcdjmyxzg2026!';

const STRATEGY_28_3 = {
  title: '清算折价捕获策略 - DeFi 清算拍卖获利',
  slug: 'liquidation-discount-capture',
  summary: '参与 DeFi 协议的清算拍卖，以折扣价格购买被清算的抵押资产。通过快速清算获得 5-15% 清算奖励，年化收益 50-200%。',
  category: 'oracle-liquidation',
  category_l1: 'arbitrage',
  category_l2: 'oracle-liquidation',
  risk_level: 3,
  apy_min: 50,
  apy_max: 200,
  content: `# 清算折价捕获策略 - DeFi 清算拍卖获利

> **预计阅读时间：** 32 分钟
> **难度等级：** 高级
> **风险等级：** ⚠️⚠️⚠️ 中高（3/5）

---

## 📖 开场故事

2020 年 3 月 12 日，"黑色星期四"。

加密市场暴跌 50%，ETH 从 $200 跌至 $100。DeFi 协议 MakerDAO 上数千万美元的 CDP（抵押债务头寸）触发清算。

清算机器人运营者 Mike 的告警系统疯狂响起。他的程序检测到 847 个待清算头寸，总价值超过 $8,000 万。

Mike 的清算机器人迅速行动：

- 在 Uniswap 用闪电贷借入 10,000 ETH
- 调用 MakerDAO 清算函数，支付债务
- 获得 13% 清算奖励的抵押品
- 立即在市场卖出抵押品
- 归还闪电贷 + 手续费
- **净利润：$120,000**（仅用时 13 秒）

这一天，Mike 的清算机器人共执行 247 次清算，总利润超过 **$2,100,000**。

这就是清算套利的威力——在市场混乱中捕获确定性收益。

---

## 📖 DeFi 清算机制

### 什么是清算（Liquidation）？

当用户在借贷协议（如 Aave、Compound）的抵押率下降到最低要求以下时，协议允许任何人"清算"该头寸，支付部分债务并获得抵押品折扣奖励。

**清算触发条件：**

\`\`\`
健康系数（Health Factor）< 1

健康系数 = (抵押品价值 × 清算阈值) / 借款价值

示例（Aave ETH 抵押）：
抵押品：10 ETH @ $2,000 = $20,000
清算阈值：82.5%
借款：$15,000 USDC

健康系数 = ($20,000 × 0.825) / $15,000 = 1.1（安全）

如果 ETH 跌到 $1,800：
健康系数 = ($18,000 × 0.825) / $15,000 = 0.99（可清算！）
\`\`\`

### 清算奖励机制

不同协议的清算奖励差异：

| 协议 | 清算奖励 | 清算罚金 | 最大清算比例 |
|------|---------|---------|------------|
| **Aave V3** | 5% | 0% | 50% |
| **Compound** | 8% | 0% | 50% |
| **MakerDAO** | 13% | 0% | 100% |
| **Venus** | 10% | 0% | 50% |
| **Benqi** | 10% | 0% | 50% |

**清算奖励计算：**

\`\`\`
Aave 清算示例：

待清算头寸：
抵押品：10 ETH @ $1,800 = $18,000
借款：$15,000 USDC
健康系数：0.99

清算执行：
清算 50% 债务 = $7,500
获得抵押品价值 = $7,500 × 1.05 = $7,875
实际获得 ETH = $7,875 / $1,800 = 4.375 ETH

清算利润：
成本：$7,500 USDC
获得：4.375 ETH（市价 $7,875）
毛利润：$375（5%）

如果立即卖出 ETH：
净利润 = $375 - Gas 费 - 滑点
\`\`\`

---

## 🎯 策略核心逻辑

### 策略 1：实时监控待清算头寸

\`\`\`javascript
const ethers = require('ethers');

// Aave V3 清算监控
class LiquidationMonitor {
  constructor() {
    this.provider = new ethers.providers.JsonRpcProvider('YOUR_RPC_URL');
    this.aavePool = new ethers.Contract(
      '0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2', // Aave V3 Pool
      AAVE_POOL_ABI,
      this.provider
    );
  }

  async scanLiquidatablePositions() {
    console.log('扫描可清算头寸...');

    // 获取所有借款用户（需要 TheGraph 或事件监听）
    const users = await this.getAllBorrowers();

    const liquidatable = [];

    for (const user of users) {
      try {
        // 获取用户账户数据
        const userData = await this.aavePool.getUserAccountData(user.address);

        const healthFactor = Number(userData.healthFactor) / 1e18;
        const totalCollateral = Number(userData.totalCollateralBase) / 1e8;
        const totalDebt = Number(userData.totalDebtBase) / 1e8;

        console.log(\`用户: \${user.address.slice(0, 8)}...\`);
        console.log(\`健康系数: \${healthFactor.toFixed(3)}\`);
        console.log(\`抵押品: $\${totalCollateral.toLocaleString()}\`);
        console.log(\`债务: $\${totalDebt.toLocaleString()}\\n\`);

        // 健康系数 < 1 可清算
        if (healthFactor < 1) {
          liquidatable.push({
            address: user.address,
            healthFactor: healthFactor,
            collateral: totalCollateral,
            debt: totalDebt,
            profit: this.estimateProfit(totalDebt)
          });

          console.log(\`🎯 发现可清算头寸！\`);
          console.log(\`预期利润: $\${this.estimateProfit(totalDebt).toFixed(2)}\\n\`);
        }

      } catch (error) {
        console.error(\`检查用户 \${user.address} 失败:\`, error.message);
      }
    }

    // 按利润排序
    liquidatable.sort((a, b) => b.profit - a.profit);

    console.log(\`找到 \${liquidatable.length} 个可清算头寸\\n\`);

    return liquidatable;
  }

  estimateProfit(debtAmount) {
    const liquidationBonus = 0.05; // 5% Aave 清算奖励
    const maxClosePercent = 0.5; // 最多清算 50%

    const liquidatableDebt = debtAmount * maxClosePercent;
    const collateralValue = liquidatableDebt * (1 + liquidationBonus);
    const grossProfit = collateralValue - liquidatableDebt;

    // 扣除 Gas 费和滑点
    const gasCost = 50; // 估计 $50 Gas
    const slippage = grossProfit * 0.003; // 0.3% 滑点

    return grossProfit - gasCost - slippage;
  }

  async getAllBorrowers() {
    // 使用 TheGraph 查询所有借款用户
    const query = \`
      query {
        users(first: 1000, where: { totalBorrowsUSD_gt: "0" }) {
          id
          totalBorrowsUSD
          totalCollateralUSD
        }
      }
    \`;

    const response = await fetch('https://api.thegraph.com/subgraphs/name/aave/protocol-v3', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });

    const data = await response.json();
    return data.data.users.map(u => ({ address: u.id }));
  }
}

// 运行监控
const monitor = new LiquidationMonitor();
setInterval(() => {
  monitor.scanLiquidatablePositions();
}, 30000); // 每 30 秒扫描
\`\`\`

### 策略 2：自动化清算执行

\`\`\`javascript
class LiquidationExecutor {
  constructor(privateKey) {
    this.wallet = new ethers.Wallet(privateKey, provider);
    this.aavePool = new ethers.Contract(
      AAVE_POOL_ADDRESS,
      AAVE_POOL_ABI,
      this.wallet
    );
  }

  async executeLiquidation(target) {
    console.log(\`执行清算: \${target.address}\`);

    try {
      // 获取用户的抵押品和债务详情
      const userReserves = await this.aavePool.getUserReserveData(
        WETH_ADDRESS,
        target.address
      );

      const debtToCover = userReserves.currentStableDebt
        .add(userReserves.currentVariableDebt)
        .div(2); // 清算 50%

      console.log(\`债务金额: \${ethers.utils.formatUnits(debtToCover, 6)} USDC\`);

      // 检查我们是否有足够 USDC
      const usdcBalance = await this.getUSDCBalance();

      if (usdcBalance.lt(debtToCover)) {
        console.log('USDC 不足，使用闪电贷...');
        return await this.liquidateWithFlashloan(target, debtToCover);
      }

      // 直接清算
      const tx = await this.aavePool.liquidationCall(
        WETH_ADDRESS,       // 抵押品地址（ETH）
        USDC_ADDRESS,       // 债务地址（USDC）
        target.address,     // 被清算用户
        debtToCover,        // 清算债务金额
        false               // 不接收 aToken
      );

      console.log(\`交易已提交: \${tx.hash}\`);
      const receipt = await tx.wait();

      console.log(\`✅ 清算成功！Gas 费: \${ethers.utils.formatEther(receipt.gasUsed.mul(receipt.effectiveGasPrice))} ETH\`);

      // 立即卖出获得的 ETH
      await this.sellCollateral();

      return receipt;

    } catch (error) {
      console.error('清算失败:', error.message);

      // 检查是否被抢先清算
      if (error.message.includes('HEALTH_FACTOR_NOT_BELOW_THRESHOLD')) {
        console.log('该头寸已被其他清算者清算');
      }
    }
  }

  async sellCollateral() {
    // 在 Uniswap 或 1inch 卖出获得的 ETH
    const wethBalance = await this.getWETHBalance();

    console.log(\`卖出 \${ethers.utils.formatEther(wethBalance)} WETH\`);

    // 使用 Uniswap Router
    const uniswapRouter = new ethers.Contract(
      UNISWAP_ROUTER_ADDRESS,
      UNISWAP_ROUTER_ABI,
      this.wallet
    );

    const tx = await uniswapRouter.swapExactTokensForTokens(
      wethBalance,
      0, // 最小输出（生产环境应设置滑点保护）
      [WETH_ADDRESS, USDC_ADDRESS],
      this.wallet.address,
      Math.floor(Date.now() / 1000) + 300 // 5 分钟过期
    );

    await tx.wait();
    console.log('✅ 抵押品已卖出');
  }
}
\`\`\`

### 策略 3：Gas 价格竞争策略

\`\`\`javascript
// 清算竞争中的 Gas 策略
async function competitiveGasBidding(target) {
  // 1. 获取当前内存池中针对同一目标的清算交易
  const pendingLiquidations = await getPendingLiquidationsFor(target.address);

  if (pendingLiquidations.length > 0) {
    console.log(\`⚠️  检测到 \${pendingLiquidations.length} 个竞争清算交易\`);

    // 找出最高 Gas 价格
    const maxGasPrice = Math.max(...pendingLiquidations.map(tx => tx.gasPrice));

    console.log(\`当前最高 Gas: \${ethers.utils.formatUnits(maxGasPrice, 'gwei')} gwei\`);

    // 计算盈利阈值
    const expectedProfit = target.profit;
    const maxAcceptableGas = (expectedProfit * 0.3) / ethPrice; // 最多花 30% 利润在 Gas 上

    const ourGasPrice = ethers.utils.parseUnits(
      (Number(ethers.utils.formatUnits(maxGasPrice, 'gwei')) * 1.1).toString(), // 高出 10%
      'gwei'
    );

    const gasCost = ourGasPrice.mul(300000); // 估计 30 万 Gas

    if (gasCost.gt(ethers.utils.parseEther(maxAcceptableGas.toString()))) {
      console.log('Gas 价格过高，放弃该清算');
      return null;
    }

    console.log(\`使用 Gas 价格: \${ethers.utils.formatUnits(ourGasPrice, 'gwei')} gwei\`);
    return ourGasPrice;

  } else {
    // 无竞争，使用正常 Gas 价格
    return await provider.getGasPrice();
  }
}
\`\`\`

---

## 📊 不同协议清算对比

### Aave V3 vs Compound vs MakerDAO

\`\`\`
Aave V3：
优势：
  ✅ 5% 清算奖励稳定
  ✅ 部分清算（50%），风险低
  ✅ 高流动性，易于卖出抵押品
劣势：
  ❌ 奖励较低
  ❌ 竞争激烈

Compound：
优势：
  ✅ 8% 清算奖励
  ✅ 简单易懂的清算机制
劣势：
  ❌ 流动性不如 Aave
  ❌ 最大 50% 清算限制

MakerDAO：
优势：
  ✅ 13% 清算奖励（最高）
  ✅ 可 100% 清算
  ✅ 大额头寸多
劣势：
  ❌ 清算拍卖机制复杂（荷兰式拍卖）
  ❌ 需要长时间等待拍卖结束
  ❌ 资金占用时间长
\`\`\`

---

## 💡 高级技巧

### 技巧 1：MEV 保护

\`\`\`javascript
// 使用 Flashbots 避免被抢跑
const { FlashbotsBundleProvider } = require('@flashbots/ethers-provider-bundle');

async function sendLiquidationViaFlashbots(liquidationTx) {
  const flashbotsProvider = await FlashbotsBundleProvider.create(
    provider,
    authSigner,
    'https://relay.flashbots.net'
  );

  const signedBundle = await flashbotsProvider.signBundle([
    {
      signer: wallet,
      transaction: liquidationTx
    }
  ]);

  const targetBlock = await provider.getBlockNumber() + 1;

  const simulation = await flashbotsProvider.simulate(signedBundle, targetBlock);

  if (simulation.firstRevert) {
    console.log('模拟失败:', simulation.firstRevert);
    return;
  }

  const bundleSubmission = await flashbotsProvider.sendRawBundle(
    signedBundle,
    targetBlock
  );

  console.log('Bundle 已提交到 Flashbots');

  const waitResponse = await bundleSubmission.wait();

  if (waitResponse === 0) {
    console.log('✅ Bundle 已被矿工打包');
  } else {
    console.log('Bundle 未被打包，可能被其他清算者抢先');
  }
}
\`\`\`

### 技巧 2：多协议并行监控

\`\`\`javascript
// 同时监控多个协议
const protocols = [
  { name: 'Aave', address: AAVE_POOL_ADDRESS, bonus: 0.05 },
  { name: 'Compound', address: COMPOUND_COMPTROLLER, bonus: 0.08 },
  { name: 'Venus', address: VENUS_COMPTROLLER, bonus: 0.10 }
];

async function scanAllProtocols() {
  const allOpportunities = [];

  for (const protocol of protocols) {
    const positions = await scanProtocol(protocol);
    allOpportunities.push(...positions);
  }

  // 按利润排序
  allOpportunities.sort((a, b) => b.expectedProfit - a.expectedProfit);

  console.log(\`找到 \${allOpportunities.length} 个清算机会：\`);
  allOpportunities.slice(0, 5).forEach((opp, i) => {
    console.log(\`\${i+1}. \${opp.protocol}: $\${opp.expectedProfit.toFixed(2)}\`);
  });

  // 执行最优机会
  if (allOpportunities.length > 0) {
    await executeLiquidation(allOpportunities[0]);
  }
}
\`\`\`

---

## 📈 收益预期

| 市场状态 | 日清算次数 | 单次利润 | Gas 成本 | 日净收益 | 年化 APR |
|---------|-----------|---------|--------|----------|----------|
| 极端波动（最佳）| 10-30 | $200-$1,000 | $50-$200 | $1,500-$24,000 | 500-8000% |
| 高波动 | 3-10 | $100-$500 | $30-$100 | $200-$4,000 | 70-1400% |
| 正常波动 | 1-3 | $50-$200 | $20-$50 | $30-$450 | 10-160% |
| 低波动 | 0-1 | $20-$100 | $10-$30 | $0-$70 | 0-25% |

**保守估计年化（$10,000 本金）：50-200%**

> ⚠️ **重要提示：** 清算套利需要 24/7 运行的自动化系统、充足的资金储备和快速的执行能力。建议使用专用服务器和低延迟 RPC 节点。新手建议从测试网开始练习，熟悉清算流程后再投入真金。`,
  status: 'published'
};

const STRATEGY_28_4 = {
  title: '闪电贷清算套利 - 零本金清算获利',
  slug: 'flashloan-liquidation-arbitrage',
  summary: '使用 Aave 闪电贷，在单笔交易内借款、清算、卖出抵押品、归还贷款，实现零本金清算套利。适合技术型交易者，单次收益 5-20%。',
  category: 'oracle-liquidation',
  category_l1: 'arbitrage',
  category_l2: 'oracle-liquidation',
  risk_level: 4,
  apy_min: 60,
  apy_max: 300,
  content: `# 闪电贷清算套利 - 零本金清算获利

> **预计阅读时间：** 35 分钟
> **难度等级：** 专家级
> **风险等级：** ⚠️⚠️⚠️⚠️ 高（4/5）

---

## 📖 开场故事

2021 年 5 月 19 日，"5·19 大崩盘"。

加密市场单日暴跌 40%，BTC 从 $43,000 跌至 $30,000。链上清算金额超过 **$100 亿**，创历史新高。

独立开发者 Leo 的清算机器人检测到一个价值 $500,000 的 Compound 待清算头寸：

- 抵押品：150 ETH @ $2,000 = $300,000
- 借款：$250,000 USDC
- 健康系数：0.96

但 Leo 只有 $10,000 本金，完全不够清算。

他灵机一动："用闪电贷！"

Leo 快速编写智能合约：

\`\`\`solidity
1. 从 Aave 闪电贷借入 $125,000 USDC
2. 调用 Compound 清算函数，支付 $125,000
3. 获得价值 $135,000 的 ETH（8% 清算奖励）
4. 在 Uniswap 卖出 ETH，获得 $133,000 USDC
5. 归还 Aave 闪电贷 $125,000 + $112 手续费
6. 净利润：$7,888
\`\`\`

整个过程在 **单笔交易** 内完成，耗时 13 秒。

Leo 当天共执行 23 次闪电贷清算，累计利润：**$142,000**。

从此，他再也不需要大额本金——闪电贷让任何人都能成为清算猎人。

---

## 📖 闪电贷原理

### 什么是闪电贷（Flashloan）？

闪电贷是一种无需抵押的贷款，但必须在 **同一笔交易内** 借入和归还。如果无法归还，整个交易回滚，就像从未发生过。

**特点：**
- ✅ 无需抵押
- ✅ 借款金额无上限（受流动性限制）
- ✅ 手续费极低（0.05-0.09%）
- ❌ 必须在同一交易内归还

**主流闪电贷平台：**

| 平台 | 手续费 | 最大借款量 | 链 |
|------|-------|-----------|-----|
| **Aave V3** | 0.05% | $500M+ | ETH, Polygon, Arbitrum, Optimism |
| **dYdX** | 0% | $200M+ | Ethereum |
| **Balancer** | 0.001% | $50M+ | Ethereum, Polygon |
| **Uniswap V3** | 0% (需返还等额) | $1B+ | Ethereum, Polygon |

---

## 🎯 策略核心逻辑

### 完整闪电贷清算流程

\`\`\`
步骤 1：检测到可清算头寸
  用户地址：0xABC...123
  抵押品：100 WBTC @ $40,000 = $4,000,000
  借款：$3,200,000 USDC
  健康系数：0.98
  清算奖励：8%（Compound）

步骤 2：计算所需资金
  清算 50% 债务 = $1,600,000
  获得抵押品价值 = $1,600,000 × 1.08 = $1,728,000
  预期利润 = $128,000（8%）

步骤 3：在单笔交易内执行
  ┌─────────────────────────────────────┐
  │ 1. flashloan $1,600,000 USDC (Aave) │
  ├─────────────────────────────────────┤
  │ 2. liquidate() on Compound          │
  │    → 支付 $1,600,000 USDC            │
  │    → 获得 43.2 WBTC                  │
  ├─────────────────────────────────────┤
  │ 3. swap WBTC → USDC on Uniswap      │
  │    → 卖出 43.2 WBTC                  │
  │    → 获得 $1,710,000 USDC           │
  ├─────────────────────────────────────┤
  │ 4. repay flashloan                  │
  │    → 归还 $1,600,800 (含 0.05% 费)  │
  ├─────────────────────────────────────┤
  │ 5. profit = $109,200 🎉             │
  └─────────────────────────────────────┘

全程自动化，无需人工干预
\`\`\`

### 智能合约实现

\`\`\`solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@aave/core-v3/contracts/flashloan/base/FlashLoanSimpleReceiverBase.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface ICompoundComptroller {
    function liquidateBorrow(
        address borrower,
        uint256 repayAmount,
        address cTokenCollateral
    ) external returns (uint256);
}

interface IUniswapV2Router {
    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);
}

contract FlashloanLiquidator is FlashLoanSimpleReceiverBase {
    address public owner;
    IUniswapV2Router public uniswapRouter;

    struct LiquidationParams {
        address borrower;
        address debtToken;
        address collateralToken;
        uint256 debtToCover;
    }

    constructor(address _addressProvider, address _uniswapRouter)
        FlashLoanSimpleReceiverBase(IPoolAddressesProvider(_addressProvider))
    {
        owner = msg.sender;
        uniswapRouter = IUniswapV2Router(_uniswapRouter);
    }

    function executeLiquidation(
        address borrower,
        address debtToken,
        address collateralToken,
        uint256 debtToCover
    ) external {
        require(msg.sender == owner, "Only owner");

        // 编码清算参数
        bytes memory params = abi.encode(
            LiquidationParams({
                borrower: borrower,
                debtToken: debtToken,
                collateralToken: collateralToken,
                debtToCover: debtToCover
            })
        );

        // 发起闪电贷
        POOL.flashLoanSimple(
            address(this),
            debtToken,
            debtToCover,
            params,
            0
        );
    }

    function executeOperation(
        address asset,
        uint256 amount,
        uint256 premium,
        address initiator,
        bytes calldata params
    ) external override returns (bool) {
        require(msg.sender == address(POOL), "Only pool");

        LiquidationParams memory liquidationData = abi.decode(
            params,
            (LiquidationParams)
        );

        // 步骤 1：授权 Compound 使用我们的 USDC
        IERC20(asset).approve(COMPOUND_USDC_ADDRESS, amount);

        // 步骤 2：执行清算
        ICompoundComptroller(COMPOUND_COMPTROLLER).liquidateBorrow(
            liquidationData.borrower,
            amount,
            liquidationData.collateralToken
        );

        // 步骤 3：获取抵押品余额
        uint256 collateralBalance = IERC20(liquidationData.collateralToken)
            .balanceOf(address(this));

        // 步骤 4：在 Uniswap 卖出抵押品换回 USDC
        IERC20(liquidationData.collateralToken).approve(
            address(uniswapRouter),
            collateralBalance
        );

        address[] memory path = new address[](2);
        path[0] = liquidationData.collateralToken;
        path[1] = asset;

        uniswapRouter.swapExactTokensForTokens(
            collateralBalance,
            amount + premium, // 最小输出 = 贷款本金 + 手续费
            path,
            address(this),
            block.timestamp + 300
        );

        // 步骤 5：归还闪电贷
        uint256 amountOwed = amount + premium;
        IERC20(asset).approve(address(POOL), amountOwed);

        // 步骤 6：利润留在合约中（可由 owner 提取）
        uint256 profit = IERC20(asset).balanceOf(address(this)) - amountOwed;
        emit LiquidationProfit(profit);

        return true;
    }

    function withdrawProfit(address token) external {
        require(msg.sender == owner, "Only owner");
        uint256 balance = IERC20(token).balanceOf(address(this));
        IERC20(token).transfer(owner, balance);
    }

    event LiquidationProfit(uint256 profit);
}
\`\`\`

### JavaScript 调用示例

\`\`\`javascript
const ethers = require('ethers');

async function executeFlashloanLiquidation(target) {
  const flashloanContract = new ethers.Contract(
    FLASHLOAN_LIQUIDATOR_ADDRESS,
    FLASHLOAN_LIQUIDATOR_ABI,
    wallet
  );

  console.log(\`执行闪电贷清算: \${target.address}\`);

  // 估算 Gas
  const gasEstimate = await flashloanContract.estimateGas.executeLiquidation(
    target.address,
    USDC_ADDRESS,
    WETH_ADDRESS,
    target.debtAmount
  );

  console.log(\`预计 Gas: \${gasEstimate.toString()}\`);

  // 发送交易
  const tx = await flashloanContract.executeLiquidation(
    target.address,
    USDC_ADDRESS,
    WETH_ADDRESS,
    target.debtAmount,
    {
      gasLimit: gasEstimate.mul(120).div(100), // +20% buffer
      gasPrice: ethers.utils.parseUnits('50', 'gwei')
    }
  );

  console.log(\`交易已发送: \${tx.hash}\`);

  const receipt = await tx.wait();

  if (receipt.status === 1) {
    // 解析利润事件
    const profitEvent = receipt.events.find(
      e => e.event === 'LiquidationProfit'
    );

    if (profitEvent) {
      const profit = ethers.utils.formatUnits(profitEvent.args.profit, 6);
      console.log(\`✅ 清算成功！利润: $\${profit}\`);
    }
  } else {
    console.log('❌ 清算失败');
  }

  return receipt;
}
\`\`\`

---

## 📊 风险管理

### 风险 1：交易回滚

**原因：**
- 滑点过大，卖出抵押品获得的资金不足以归还闪电贷
- 被抢先清算，目标头寸已恢复健康
- Gas 价格波动导致交易失败

**应对方案：**

\`\`\`solidity
// 在智能合约中加入滑点保护
uint256 minOutput = (amount + premium) * 101 / 100; // 至少多赚 1%

uniswapRouter.swapExactTokensForTokens(
    collateralBalance,
    minOutput, // 如果低于此值，交易自动回滚
    path,
    address(this),
    deadline
);
\`\`\`

### 风险 2：MEV 机器人抢跑

**问题：** 内存池中的清算交易被 MEV 机器人检测并抢先执行

\`\`\`javascript
// 使用 Flashbots 避免被抢跑
const { FlashbotsBundleProvider } = require('@flashbots/ethers-provider-bundle');

async function sendViaFlashbots(tx) {
  const flashbotsProvider = await FlashbotsBundleProvider.create(
    provider,
    authSigner
  );

  const signedBundle = await flashbotsProvider.signBundle([
    { signer: wallet, transaction: tx }
  ]);

  await flashbotsProvider.sendRawBundle(
    signedBundle,
    await provider.getBlockNumber() + 1
  );
}
\`\`\`

### 风险 3：Gas 费吞噬利润

\`\`\`javascript
// 动态利润计算
function shouldExecute(expectedProfit, gasPrice) {
  const gasLimit = 500000; // 估计
  const gasCost = gasLimit * gasPrice;
  const gasCostUSD = (gasCost / 1e18) * ethPrice;

  const netProfit = expectedProfit - gasCostUSD - flashloanFee;

  console.log(\`预期利润: $\${expectedProfit.toFixed(2)}\`);
  console.log(\`Gas 成本: $\${gasCostUSD.toFixed(2)}\`);
  console.log(\`净利润: $\${netProfit.toFixed(2)}\`);

  return netProfit > 50; // 最低 $50 利润
}
\`\`\`

---

## 💡 高级技巧

### 技巧 1：多协议闪电贷组合

\`\`\`javascript
// 在不同平台寻找最优闪电贷
async function findBestFlashloan(amount) {
  const options = [
    { name: 'Aave', fee: 0.0005, liquidity: await getAaveLiquidity() },
    { name: 'dYdX', fee: 0, liquidity: await getDydxLiquidity() },
    { name: 'Balancer', fee: 0.00001, liquidity: await getBalancerLiquidity() }
  ];

  // 过滤掉流动性不足的
  const viable = options.filter(o => o.liquidity >= amount);

  // 选择手续费最低的
  viable.sort((a, b) => a.fee - b.fee);

  console.log(\`最优闪电贷: \${viable[0].name}（手续费 \${viable[0].fee * 100}%）\`);

  return viable[0];
}
\`\`\`

### 技巧 2：批量清算

\`\`\`solidity
// 在单笔闪电贷中清算多个头寸
function executeOperation(...) external override returns (bool) {
    LiquidationParams[] memory targets = abi.decode(params, (LiquidationParams[]));

    for (uint i = 0; i < targets.length; i++) {
        liquidate(targets[i]);
        sellCollateral(targets[i].collateralToken);
    }

    // 归还总金额
    repayFlashloan();
}
\`\`\`

---

## 📈 收益预期

| 市场状态 | 日清算次数 | 单次利润 | 总成本 | 日净收益 | 年化 APR |
|---------|-----------|---------|--------|----------|----------|
| 极端波动 | 15-40 | $500-$5,000 | $100-$300 | $7,000-$188,700 | 无上限 |
| 高波动 | 5-15 | $200-$2,000 | $50-$150 | $750-$27,750 | 2700-10000%+ |
| 正常波动 | 2-5 | $100-$500 | $30-$80 | $140-$2,420 | 500-8800% |
| 低波动 | 0-2 | $50-$200 | $20-$50 | $0-$350 | 0-1200% |

**保守估计年化（零本金）：60-300%**

> ⚠️ **重要提示：** 闪电贷清算是技术门槛最高的 DeFi 策略之一。需要深厚的智能合约开发经验、Gas 优化能力和快速响应能力。建议先在测试网充分测试，并从小额清算开始练习。务必审计智能合约代码，避免安全漏洞导致资金损失。`,
  status: 'published'
};

async function main() {
  try {
    console.log('认证中...');

    const authResponse = await axios.post(`${DIRECTUS_URL}/auth/login`, {
      email: DIRECTUS_EMAIL,
      password: DIRECTUS_PASSWORD
    });

    const token = authResponse.data.data.access_token;
    console.log('认证成功！\n');

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    const strategies = [STRATEGY_28_3, STRATEGY_28_4];

    for (const strategy of strategies) {
      const existingResponse = await axios.get(
        `${DIRECTUS_URL}/items/strategies?filter[slug][_eq]=${strategy.slug}`,
        config
      );

      if (existingResponse.data.data && existingResponse.data.data.length > 0) {
        console.log(`⏭️  策略 "${strategy.title}" 已存在，跳过`);
        continue;
      }

      await axios.post(
        `${DIRECTUS_URL}/items/strategies`,
        strategy,
        config
      );

      console.log(`✅ 策略创建成功: ${strategy.title}`);
      console.log(`   Slug: ${strategy.slug}`);
      console.log(`   APY: ${strategy.apy_min}-${strategy.apy_max}%\n`);
    }

    const countResponse = await axios.get(
      `${DIRECTUS_URL}/items/strategies?limit=0&meta=total_count`,
      config
    );

    console.log('========================================');
    console.log(`📊 数据库中策略总数: ${countResponse.data.meta.total_count}`);
    console.log('========================================');

  } catch (error) {
    console.error('❌ 错误:', error.response?.data || error.message);
    process.exit(1);
  }
}

main();
