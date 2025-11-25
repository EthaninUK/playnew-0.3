const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_EMAIL = 'the_uk1@outlook.com';
const DIRECTUS_PASSWORD = 'Mygcdjmyxzg2026!';

const STRATEGY_28_1 = {
  title: '预言机价格滞后套利 - 捕获时间差收益',
  slug: 'oracle-price-lag-arbitrage',
  summary: '利用链上预言机价格更新延迟，在 CEX 价格变动与链上预言机更新之间的时间窗口进行套利。适合技术型交易者，年化收益 40-150%。',
  category: 'oracle-liquidation',
  category_l1: 'arbitrage',
  category_l2: 'oracle-liquidation',
  risk_level: 3,
  apy_min: 40,
  apy_max: 150,
  content: `# 预言机价格滞后套利 - 捕获时间差收益

> **预计阅读时间：** 30 分钟
> **难度等级：** 高级
> **风险等级：** ⚠️⚠️⚠️ 中高（3/5）

---

## 📖 开场故事

2022 年 5 月的一个深夜，加密交易员 Alex 正盯着多个屏幕。突然，BTC 在 Binance 暴跌 5%，从 $30,000 跌至 $28,500。他立即查看 Aave 的 BTC 价格——仍然显示 $29,800。

"预言机还没更新！"Alex 意识到机会来了。

他迅速在 Aave 以 $29,800 的抵押物价格借出最大额度的 USDT，然后在 Binance 用 $28,500 买入 BTC。3 分钟后，Chainlink 预言机更新，Aave 价格同步到 $28,500。但 Alex 已经完成套利：

- 借出时 BTC 价值：$29,800（协议认为）
- 实际买入价：$28,500
- 利润：$1,300/BTC（4.6%）

这就是预言机滞后套利的魔力——在"时间差"中赚钱。

---

## 📖 预言机滞后原理

### 什么是预言机（Oracle）？

预言机是将链下数据（如价格）传输到区块链的桥梁。由于区块链无法直接访问外部数据，DeFi 协议依赖预言机提供价格信息。

**常见预言机：**

| 预言机 | 更新机制 | 延迟 | 使用协议 |
|--------|---------|------|---------|
| **Chainlink** | 价格偏差 0.5% 或 1 小时 | 1-5 分钟 | Aave, Compound, MakerDAO |
| **Band Protocol** | 价格偏差 1% 或 15 分钟 | 30 秒-3 分钟 | Venus, Injective |
| **Pyth Network** | 每秒更新 | <1 秒 | Mango, Drift |
| **Uniswap TWAP** | 任何人可调用 | 实时（但有延迟风险）| 自定义协议 |

### 滞后如何产生？

**Chainlink 更新触发条件（以 BTC/USD 为例）：**

\`\`\`
条件 1：价格偏差 ≥ 0.5%
条件 2：距上次更新 ≥ 1 小时

只要满足任一条件，预言机节点就会提交新价格
\`\`\`

**滞后窗口：**

\`\`\`
T0: CEX 价格从 $30,000 跌至 $28,500（-5%）
T1: 预言机节点检测到价格偏差（30秒后）
T2: 节点签名并提交交易到链上（1-2分钟）
T3: 交易被打包确认（15秒-1分钟）
T4: DeFi 协议读取新价格

总延迟：1.5-4 分钟
\`\`\`

在这 1.5-4 分钟内，链上协议仍使用旧价格 $30,000，而 CEX 已经是 $28,500——套利窗口！

---

## 🎯 策略核心逻辑

### 策略 1：借贷协议套利

**利用 Aave/Compound 的价格滞后**

\`\`\`javascript
const ethers = require('ethers');
const ccxt = require('ccxt');

// 监控 CEX vs 链上预言机价格差
async function monitorPriceLag() {
  const binance = new ccxt.binance();
  const provider = new ethers.providers.JsonRpcProvider('https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY');

  // Chainlink BTC/USD 价格合约
  const chainlinkAggregator = new ethers.Contract(
    '0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c', // BTC/USD
    ['function latestRoundData() view returns (uint80, int256, uint256, uint256, uint80)'],
    provider
  );

  setInterval(async () => {
    try {
      // 1. 获取 CEX 现货价格
      const ticker = await binance.fetchTicker('BTC/USDT');
      const cexPrice = ticker.last;

      // 2. 获取链上预言机价格
      const roundData = await chainlinkAggregator.latestRoundData();
      const chainlinkPrice = Number(roundData[1]) / 1e8; // 8 位小数

      // 3. 计算价差
      const priceDiff = cexPrice - chainlinkPrice;
      const diffPercent = (priceDiff / chainlinkPrice) * 100;

      console.log(\`
╔═══════════════════════════════════════╗
║   预言机滞后监控 - BTC/USD             ║
╚═══════════════════════════════════════╝

CEX 价格:        $\${cexPrice.toLocaleString()}
Chainlink 价格:  $\${chainlinkPrice.toLocaleString()}
价差:            $\${priceDiff.toFixed(2)} (\${diffPercent.toFixed(3)}%)
更新时间:        \${new Date(roundData[3] * 1000).toLocaleString()}
      \`);

      // 4. 检测套利机会（价差 > 1%）
      if (Math.abs(diffPercent) > 1) {
        console.log('🚨 发现预言机滞后套利机会！');

        if (diffPercent > 0) {
          // CEX 价格 > 链上价格 → 链上低价抵押借款，CEX 卖出
          await executeArbitrage('DOWN', diffPercent);
        } else {
          // CEX 价格 < 链上价格 → CEX 买入，链上高价抵押
          await executeArbitrage('UP', diffPercent);
        }
      }

    } catch (error) {
      console.error('监控错误:', error.message);
    }
  }, 10000); // 每 10 秒检查
}

async function executeArbitrage(direction, diffPercent) {
  console.log(\`执行 \${direction} 方向套利（价差 \${Math.abs(diffPercent).toFixed(2)}%）\`);

  if (direction === 'DOWN') {
    // 场景：CEX 暴跌，链上价格未更新
    console.log(\`
策略：
1. 在 Aave 使用其他资产（如 USDC）作为抵押，借出 WBTC
2. 立即在 Uniswap 卖出 WBTC 换成 USDC
3. 等待预言机更新后，在 CEX 低价买回 BTC
4. 归还 Aave 借款
    \`);

    // 实际执行代码...
    // await aaveContract.borrow(WBTC_ADDRESS, amount, ...);
    // await uniswapRouter.swapExactTokensForTokens(...);

  } else {
    // 场景：CEX 暴涨，链上价格未更新
    console.log(\`
策略：
1. 在 CEX 低价买入 BTC
2. 存入 Aave 作为抵押品（仍按低价计算）
3. 借出最大额度 USDC
4. 等待预言机更新后，抵押品价值上升，健康系数改善
    \`);
  }
}

monitorPriceLag();
\`\`\`

### 策略 2：DEX 闪电套利

**利用 Uniswap TWAP 预言机延迟**

\`\`\`javascript
// Uniswap V2 TWAP 操纵和套利
async function uniswapTWAPArbitrage() {
  const uniswapPair = new ethers.Contract(
    '0xBb2b8038a1640196FbE3e38816F3e67Cba72D940', // WBTC/USDC
    ['function getReserves() view returns (uint112, uint112, uint32)'],
    provider
  );

  // 1. 获取 Uniswap 现货价格
  const reserves = await uniswapPair.getReserves();
  const uniswapPrice = (reserves[1] / 1e6) / (reserves[0] / 1e8); // USDC / WBTC

  // 2. 获取外部 CEX 价格
  const cexPrice = await getCEXPrice('BTC/USDT');

  // 3. 如果价差 > 2%（TWAP 滞后严重）
  if (Math.abs(uniswapPrice - cexPrice) / cexPrice > 0.02) {
    console.log('TWAP 预言机严重滞后，执行套利！');

    // 在 Uniswap 低价买入，CEX 高价卖出（或反向）
    await executeSwap();
  }
}
\`\`\`

### 策略 3：跨链预言机套利

**利用不同链上预言机更新速度差异**

\`\`\`javascript
// 监控以太坊 vs BSC 上的 Chainlink 价格差
async function crossChainOracleArbitrage() {
  const ethProvider = new ethers.providers.JsonRpcProvider('ETH_RPC_URL');
  const bscProvider = new ethers.providers.JsonRpcProvider('BSC_RPC_URL');

  const ethChainlink = new ethers.Contract(ETH_CHAINLINK_ADDRESS, ABI, ethProvider);
  const bscChainlink = new ethers.Contract(BSC_CHAINLINK_ADDRESS, ABI, bscProvider);

  setInterval(async () => {
    const ethPrice = await ethChainlink.latestRoundData();
    const bscPrice = await bscChainlink.latestRoundData();

    const ethValue = Number(ethPrice[1]) / 1e8;
    const bscValue = Number(bscPrice[1]) / 1e8;

    const diff = Math.abs(ethValue - bscValue) / ethValue * 100;

    console.log(\`ETH: $\${ethValue}, BSC: $\${bscValue}, 差异: \${diff.toFixed(3)}%\`);

    if (diff > 0.5) {
      console.log('跨链预言机价差机会！');
      // 在价格低的链上借款，在价格高的链上抵押
    }
  }, 15000);
}
\`\`\`

---

## 📊 风险管理

### 风险 1：预言机快速更新

**问题：** Chainlink 可能在几秒内完成更新

\`\`\`
你刚执行借款，预言机立即更新
结果：健康系数骤降，面临清算
\`\`\`

**应对方案：**

\`\`\`javascript
// 检查预言机上次更新时间
const roundData = await chainlinkAggregator.latestRoundData();
const lastUpdate = roundData[3]; // timestamp
const timeSinceUpdate = Date.now() / 1000 - lastUpdate;

if (timeSinceUpdate < 300) {
  console.log('预言机刚更新不到 5 分钟，风险太高！');
  return;
}

// 仅在预言机"陈旧"时执行
if (timeSinceUpdate > 600) {
  console.log('预言机已 10 分钟未更新，可能即将更新，执行套利！');
  await executeArbitrage();
}
\`\`\`

### 风险 2：Gas 费飙升

**闪电套利需要快速执行，但 Gas 费可能吞噬利润**

\`\`\`javascript
// 动态 Gas 价格检查
const gasPrice = await provider.getGasPrice();
const maxGasPrice = ethers.utils.parseUnits('50', 'gwei'); // 最高接受 50 gwei

if (gasPrice.gt(maxGasPrice)) {
  console.log(\`Gas 价格过高: \${ethers.utils.formatUnits(gasPrice, 'gwei')} gwei\`);
  return;
}

// 计算利润是否覆盖 Gas
const estimatedGas = await contract.estimateGas.borrow(...);
const gasCost = estimatedGas.mul(gasPrice);
const gasCostUSD = Number(ethers.utils.formatEther(gasCost)) * ethPrice;

if (gasCostUSD > expectedProfit * 0.3) {
  console.log('Gas 费用过高（超过利润 30%），放弃');
  return;
}
\`\`\`

### 风险 3：被清算

**如果预言机更新速度超出预期，你的健康系数可能瞬间跌破 1**

\`\`\`javascript
// 实时监控健康系数
async function monitorHealthFactor() {
  const aave = new ethers.Contract(AAVE_POOL_ADDRESS, AAVE_ABI, signer);

  setInterval(async () => {
    const userData = await aave.getUserAccountData(YOUR_ADDRESS);
    const healthFactor = Number(userData.healthFactor) / 1e18;

    console.log(\`健康系数: \${healthFactor.toFixed(3)}\`);

    if (healthFactor < 1.3) {
      console.log('⚠️  健康系数过低，紧急还款！');
      await emergencyRepay();
    }
  }, 5000);
}
\`\`\`

---

## 💡 高级技巧

### 技巧 1：监控内存池（Mempool）

\`\`\`javascript
// 监控预言机更新交易
const { Alchemy } = require('alchemy-sdk');
const alchemy = new Alchemy({ apiKey: 'YOUR_KEY' });

alchemy.ws.on(
  {
    method: 'alchemy_pendingTransactions',
    toAddress: CHAINLINK_AGGREGATOR_ADDRESS
  },
  (tx) => {
    console.log('🚨 检测到预言机更新交易！');
    console.log(\`Hash: \${tx.hash}\`);
    console.log(\`Gas Price: \${tx.gasPrice}\`);

    // 立即取消套利或加速还款
    cancelArbitrageOrders();
  }
);
\`\`\`

### 技巧 2：使用闪电贷

\`\`\`javascript
// Aave 闪电贷放大套利
async function flashloanArbitrage() {
  const flashloanAmount = ethers.utils.parseUnits('100', 18); // 100 WBTC

  const params = ethers.utils.defaultAbiCoder.encode(
    ['uint256', 'address'],
    [targetAmount, targetToken]
  );

  await aavePool.flashLoan(
    YOUR_CONTRACT_ADDRESS,
    [WBTC_ADDRESS],
    [flashloanAmount],
    [0], // mode 0 = 无债务
    YOUR_ADDRESS,
    params,
    0
  );

  // 在 flashloan 回调中执行套利
  // executeOperation() 函数会自动调用
}
\`\`\`

### 技巧 3：多预言机交叉验证

\`\`\`javascript
// 同时监控多个预言机，寻找最大差异
async function multiOracleArbitrage() {
  const chainlinkPrice = await getChainlinkPrice('BTC/USD');
  const bandPrice = await getBandPrice('BTC/USD');
  const pythPrice = await getPythPrice('BTC/USD');
  const cexPrice = await getCEXPrice('BTC/USDT');

  const prices = [
    { source: 'Chainlink', price: chainlinkPrice },
    { source: 'Band', price: bandPrice },
    { source: 'Pyth', price: pythPrice },
    { source: 'CEX', price: cexPrice }
  ];

  // 找出最大和最小价格
  const maxPrice = Math.max(...prices.map(p => p.price));
  const minPrice = Math.min(...prices.map(p => p.price));
  const spread = (maxPrice - minPrice) / minPrice * 100;

  console.log(\`最大价差: \${spread.toFixed(3)}%\`);

  if (spread > 1) {
    const maxSource = prices.find(p => p.price === maxPrice).source;
    const minSource = prices.find(p => p.price === minPrice).source;
    console.log(\`套利路径: \${minSource}（买入）→ \${maxSource}（卖出）\`);
  }
}
\`\`\`

---

## 📈 收益预期

| 市场状态 | 日套利次数 | 单次收益 | Gas成本 | 净收益/天 | 年化 APR |
|---------|-----------|---------|--------|----------|----------|
| 高波动（暴涨暴跌）| 5-10 | 1-3% | $50-100 | $400-$1,200 | 140-440% |
| 正常波动 | 2-5 | 0.5-1.5% | $30-60 | $100-$350 | 36-128% |
| 低波动 | 0-2 | 0.3-0.8% | $20-40 | $0-$100 | 0-36% |

**保守估计年化（$10,000 本金）：40-150%**

> ⚠️ **重要提示：** 预言机套利需要极快的反应速度和深厚的技术能力。建议使用自动化脚本 24/7 监控，并准备充足的 Gas 费用。新手建议从小额测试开始（$1,000-$3,000），熟悉后再加大资金。`,
  status: 'published'
};

const STRATEGY_28_2 = {
  title: '跨 DEX 预言机价格差套利 - 多源数据不一致收益',
  slug: 'cross-dex-oracle-arbitrage',
  summary: '不同 DEX 和借贷协议使用不同预言机，价格存在差异。通过同时监控多个数据源，捕获价格不一致套利机会。年化收益 30-100%。',
  category: 'oracle-liquidation',
  category_l1: 'arbitrage',
  category_l2: 'oracle-liquidation',
  risk_level: 2,
  apy_min: 30,
  apy_max: 100,
  content: `# 跨 DEX 预言机价格差套利 - 多源数据不一致收益

> **预计阅读时间：** 28 分钟
> **难度等级：** 中高级
> **风险等级：** ⚠️⚠️ 中低（2/5）

---

## 📖 开场故事

2023 年 3 月，DeFi 研究员 Sarah 在分析不同协议的清算数据时，发现了一个有趣的现象：

同一时刻，ETH 的价格在不同协议上竟然相差 $50！

- Aave（使用 Chainlink）：$1,800
- Compound（使用 Open Price Feed）：$1,820
- Venus（BSC，使用 Band Protocol）：$1,850

她意识到，这不是 bug，而是不同预言机的数据源和更新机制导致的"合法价差"。

Sarah 迅速设计了一个策略：在 Aave 用低估的 ETH 抵押借出 USDC，然后在 Venus 用高估的 ETH 抵押借出更多 USDC，最后在 Uniswap 平衡仓位。

这个策略让她在一个月内稳定获得 8% 的收益，而风险极低。

---

## 📖 多预言机生态

### 主流 DeFi 协议使用的预言机

| 协议 | 预言机 | 更新频率 | 数据源 | 链 |
|------|-------|---------|--------|-----|
| **Aave V3** | Chainlink | 0.5% 偏差或 1h | CEX 聚合 | ETH, Polygon, Arbitrum |
| **Compound** | Chainlink + 自建 | 实时 | Coinbase, Uniswap | Ethereum |
| **MakerDAO** | OSM (自建) | 1 小时延迟 | 多源聚合 | Ethereum |
| **Venus** | Band Protocol | 1% 偏差或 15min | Binance, Coinbase | BSC |
| **Cream** | Chainlink | 0.5% | CEX | Multiple |
| **Benqi** | Chainlink | 0.5% | CEX | Avalanche |

### 为什么会有价差？

**原因 1：数据源不同**

\`\`\`
Chainlink ETH/USD：
数据源：Coinbase, Binance, Kraken, Huobi（加权平均）
当前价格：$1,805

Band Protocol ETH/USD：
数据源：Binance, OKX（简单平均）
当前价格：$1,815

价差：$10（0.55%）
\`\`\`

**原因 2：更新机制不同**

\`\`\`
Chainlink：价格偏差 ≥ 0.5% 触发更新
Band Protocol：价格偏差 ≥ 1% 触发更新

结果：Band 的价格可能"更陈旧"
\`\`\`

**原因 3：链上 Gas 费差异**

\`\`\`
以太坊 Chainlink：Gas 费高，更新谨慎
BSC Band Protocol：Gas 费低，更新更频繁（但数据源少）
\`\`\`

---

## 🎯 策略核心逻辑

### 策略 1：多协议抵押率套利

\`\`\`javascript
const ethers = require('ethers');

// 同时监控多个协议的 ETH 价格
async function multiProtocolPriceMonitor() {
  const providers = {
    ethereum: new ethers.providers.JsonRpcProvider('ETH_RPC'),
    bsc: new ethers.providers.JsonRpcProvider('BSC_RPC'),
    polygon: new ethers.providers.JsonRpcProvider('POLYGON_RPC')
  };

  const oracles = {
    aave_eth: {
      address: '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419',
      chain: 'ethereum',
      decimals: 8
    },
    band_bsc: {
      address: '0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE',
      chain: 'bsc',
      decimals: 18
    },
    chainlink_polygon: {
      address: '0xF9680D99D6C9589e2a93a78A04A279e509205945',
      chain: 'polygon',
      decimals: 8
    }
  };

  setInterval(async () => {
    const prices = {};

    // 获取所有预言机价格
    for (const [name, config] of Object.entries(oracles)) {
      const provider = providers[config.chain];
      const oracle = new ethers.Contract(
        config.address,
        ['function latestRoundData() view returns (uint80, int256, uint256, uint256, uint80)'],
        provider
      );

      const roundData = await oracle.latestRoundData();
      const price = Number(roundData[1]) / (10 ** config.decimals);
      prices[name] = price;

      console.log(\`\${name}: $\${price.toFixed(2)}\`);
    }

    // 计算最大价差
    const priceValues = Object.values(prices);
    const maxPrice = Math.max(...priceValues);
    const minPrice = Math.min(...priceValues);
    const spread = (maxPrice - minPrice) / minPrice * 100;

    console.log(\`\\n最大价差: \${spread.toFixed(3)}%\`);
    console.log(\`高价: $\${maxPrice.toFixed(2)}\`);
    console.log(\`低价: $\${minPrice.toFixed(2)}\\n\`);

    // 如果价差 > 0.8%，执行套利
    if (spread > 0.8) {
      const highPriceOracle = Object.keys(prices).find(k => prices[k] === maxPrice);
      const lowPriceOracle = Object.keys(prices).find(k => prices[k] === minPrice);

      console.log(\`🎯 套利机会！\`);
      console.log(\`低价源：\${lowPriceOracle} ($\${minPrice.toFixed(2)})\`);
      console.log(\`高价源：\${highPriceOracle} ($\${maxPrice.toFixed(2)})\`);

      await executeCrossProtocolArbitrage(lowPriceOracle, highPriceOracle);
    }

  }, 30000); // 每 30 秒检查
}

async function executeCrossProtocolArbitrage(lowSource, highSource) {
  console.log(\`\\n执行跨协议套利：\`);
  console.log(\`策略：\`);
  console.log(\`1. 在 \${lowSource} 协议（低估价格）最大化抵押借款\`);
  console.log(\`2. 在 \${highSource} 协议（高估价格）存入资产\`);
  console.log(\`3. 利用价差放大杠杆，赚取利息差\`);

  // 示例：Aave (低价) 借款，Venus (高价) 存款
  if (lowSource.includes('aave') && highSource.includes('band')) {
    // 在 Aave 用 10 ETH 抵押（按低价 $1,800 计算）
    // 借出 $9,000 USDC（50% LTV）

    // 跨链桥到 BSC
    // 在 Venus 用 5 ETH 抵押（按高价 $1,850 计算）
    // 借出 $4,625 USDC（50% LTV）

    // 总借款：$13,625
    // 总抵押物价值（实际）：15 ETH × $1,825（真实价格）= $27,375
    // 实际 LTV：49.7%（健康）

    console.log(\`\\n预期结果：\`);
    console.log(\`利用价差多借出约 2.7% 的资金\`);
  }
}

multiProtocolPriceMonitor();
\`\`\`

### 策略 2：TWAP vs Chainlink 套利

\`\`\`javascript
// 比较 Uniswap TWAP 和 Chainlink 价格
async function twapVsChainlink() {
  const uniswapV2Pair = new ethers.Contract(
    '0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc', // USDC/WETH
    ['function price0CumulativeLast() view returns (uint)',
     'function price1CumulativeLast() view returns (uint)',
     'function getReserves() view returns (uint112, uint112, uint32)'],
    provider
  );

  const chainlink = new ethers.Contract(
    '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419', // ETH/USD
    ['function latestRoundData() view returns (uint80, int256, uint256, uint256, uint80)'],
    provider
  );

  setInterval(async () => {
    // 1. 计算 Uniswap TWAP（过去 30 分钟平均价）
    const reserves = await uniswapV2Pair.getReserves();
    const uniswapSpotPrice = (reserves[0] / 1e6) / (reserves[1] / 1e18); // USDC per ETH

    // 2. 获取 Chainlink 价格
    const roundData = await chainlink.latestRoundData();
    const chainlinkPrice = Number(roundData[1]) / 1e8;

    // 3. 计算偏差
    const deviation = Math.abs(uniswapSpotPrice - chainlinkPrice) / chainlinkPrice * 100;

    console.log(\`Uniswap 现货: $\${uniswapSpotPrice.toFixed(2)}\`);
    console.log(\`Chainlink:    $\${chainlinkPrice.toFixed(2)}\`);
    console.log(\`偏差: \${deviation.toFixed(3)}%\\n\`);

    // 如果 Uniswap 价格显著低于 Chainlink（如闪电贷攻击后）
    if (deviation > 2) {
      console.log(\`⚠️  TWAP 预言机可能被操纵或严重滞后！\`);

      // 策略：在使用 TWAP 的协议（如自定义 DeFi）清算用户
      // 或：在 Uniswap 低价买入，等待价格回归
    }

  }, 60000); // 每分钟检查
}
\`\`\`

### 策略 3：跨链预言机时间差

\`\`\`javascript
// 利用不同链上预言机更新的时间差
async function crossChainTimingArbitrage() {
  const ethChainlink = new ethers.Contract(ETH_ORACLE_ADDRESS, ABI, ethProvider);
  const bscBand = new ethers.Contract(BSC_ORACLE_ADDRESS, ABI, bscProvider);
  const polygonChainlink = new ethers.Contract(POLYGON_ORACLE_ADDRESS, ABI, polygonProvider);

  let lastEthUpdate = 0;
  let lastBscUpdate = 0;
  let lastPolygonUpdate = 0;

  setInterval(async () => {
    const ethData = await ethChainlink.latestRoundData();
    const bscData = await bscBand.latestRoundData();
    const polygonData = await polygonChainlink.latestRoundData();

    const ethPrice = Number(ethData[1]) / 1e8;
    const bscPrice = Number(bscData[1]) / 1e18;
    const polygonPrice = Number(polygonData[1]) / 1e8;

    const ethUpdateTime = ethData[3];
    const bscUpdateTime = bscData[3];
    const polygonUpdateTime = polygonData[3];

    console.log(\`ETH: $\${ethPrice}, 更新于 \${new Date(ethUpdateTime*1000).toLocaleTimeString()}\`);
    console.log(\`BSC: $\${bscPrice}, 更新于 \${new Date(bscUpdateTime*1000).toLocaleTimeString()}\`);
    console.log(\`Polygon: $\${polygonPrice}, 更新于 \${new Date(polygonUpdateTime*1000).toLocaleTimeString()}\\n\`);

    // 如果某条链的预言机明显"陈旧"（> 10 分钟未更新）
    const now = Date.now() / 1000;
    const ethAge = now - ethUpdateTime;
    const bscAge = now - bscUpdateTime;
    const polygonAge = now - polygonUpdateTime;

    if (ethAge > 600 || bscAge > 600 || polygonAge > 600) {
      console.log(\`🚨 检测到陈旧预言机！\`);
      console.log(\`ETH 已 \${(ethAge/60).toFixed(1)} 分钟未更新\`);
      console.log(\`BSC 已 \${(bscAge/60).toFixed(1)} 分钟未更新\`);
      console.log(\`Polygon 已 \${(polygonAge/60).toFixed(1)} 分钟未更新\\n\`);

      // 在陈旧链上执行套利
    }

  }, 30000);
}
\`\`\`

---

## 📊 实战案例

### 案例：Aave vs Venus 抵押率套利

**市场条件：**
\`\`\`
时间：2023年5月15日 14:30 UTC
ETH 真实价格（CEX平均）：$1,825
\`\`\`

**预言机价格：**

| 协议 | 链 | 预言机 | 价格 | 偏差 |
|------|-----|--------|------|------|
| Aave | Ethereum | Chainlink | $1,810 | -0.82% |
| Venus | BSC | Band | $1,840 | +0.82% |

**套利执行：**

\`\`\`
步骤 1：在 Aave 存入 10 ETH
  - 协议认为价值：10 × $1,810 = $18,100
  - 实际价值：10 × $1,825 = $18,250
  - 可借出（80% LTV）：$14,480 USDC

步骤 2：跨链桥到 BSC
  - 使用 Celer cBridge，耗时 3-5 分钟
  - 手续费：约 $2

步骤 3：在 Venus 存入 7.87 ETH（价值 $14,480）
  - 协议认为价值：7.87 × $1,840 = $14,480
  - 实际价值：7.87 × $1,825 = $14,365
  - 可借出（80% LTV）：$11,584 USDC

步骤 4：总资金效率
  - 总借款：$14,480 + $11,584 = $26,064
  - 总抵押物：17.87 ETH × $1,825 = $32,613
  - 实际 LTV：79.9%（健康）

步骤 5：收益来源
  - 利用价差多借出：约 3.3%
  - 年化存款利息（Aave ETH）：3.5%
  - 年化借款利息（Aave USDC）：-5%
  - 年化存款利息（Venus ETH）：4%
  - 年化借款利息（Venus USDC）：-6%

净年化收益：约 -3.5%（但初始多借 3.3%）
\`\`\`

**优化策略：**

将借出的 USDC 投入高收益策略（如稳定币 LP），年化 8-12%，覆盖借款利息并盈利。

---

## 💡 高级技巧

### 技巧 1：实时套利机会扫描

\`\`\`javascript
// 自动扫描所有协议组合
const protocols = [
  { name: 'Aave_ETH', oracle: 'chainlink_eth', chain: 'ethereum' },
  { name: 'Venus_BSC', oracle: 'band_bsc', chain: 'bsc' },
  { name: 'Benqi_AVAX', oracle: 'chainlink_avax', chain: 'avalanche' },
  { name: 'Radiant_ARB', oracle: 'chainlink_arb', chain: 'arbitrum' }
];

async function scanAllOpportunities() {
  const opportunities = [];

  for (let i = 0; i < protocols.length; i++) {
    for (let j = i + 1; j < protocols.length; j++) {
      const priceA = await getOraclePrice(protocols[i].oracle);
      const priceB = await getOraclePrice(protocols[j].oracle);

      const spread = Math.abs(priceA - priceB) / Math.min(priceA, priceB) * 100;

      if (spread > 0.5) {
        opportunities.push({
          pair: \`\${protocols[i].name} ↔ \${protocols[j].name}\`,
          spread: spread.toFixed(3) + '%',
          lowPrice: Math.min(priceA, priceB),
          highPrice: Math.max(priceA, priceB)
        });
      }
    }
  }

  opportunities.sort((a, b) => parseFloat(b.spread) - parseFloat(a.spread));

  console.log('套利机会排行：');
  opportunities.forEach((opp, i) => {
    console.log(\`\${i+1}. \${opp.pair}: \${opp.spread}\`);
  });

  return opportunities;
}
\`\`\`

---

## 📈 收益预期

| 策略类型 | 价差范围 | 杠杆倍数 | 月收益 | 年化 APR |
|---------|---------|---------|--------|----------|
| 单协议滞后套利 | 0.5-2% | 1x | 2-8% | 24-96% |
| 跨协议价差套利 | 0.8-3% | 2x | 3-12% | 36-144% |
| 多链组合套利 | 1-5% | 3x | 6-20% | 72-240% |

**保守估计年化：30-100%**

> ⚠️ **重要提示：** 跨协议套利需要管理多个链上的资产和健康系数。建议使用自动化脚本实时监控，并设置预警阈值。新手建议从单链、低杠杆开始（1-2x），熟悉后再扩展到多链。`,
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

    const strategies = [STRATEGY_28_1, STRATEGY_28_2];

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
