const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_EMAIL = 'the_uk1@outlook.com';
const DIRECTUS_PASSWORD = 'Mygcdjmyxzg2026!';

const STRATEGY_27_7 = {
  title: '买卖价差捕获策略 - 高频 Bid-Ask Spread 套利',
  slug: 'bid-ask-spread-capture',
  summary: '实时捕获订单簿买一卖一价差，通过快速成交赚取微小但频繁的利润。适合低延迟环境，年化收益 25-80%。',
  category: 'market-making-spread',
  category_l1: 'arbitrage',
  category_l2: 'market-making-spread',
  risk_level: 2,
  apy_min: 25,
  apy_max: 80,
  content: `# 买卖价差捕获策略 - 高频 Bid-Ask Spread 套利

> **预计阅读时间：** 22 分钟
> **难度等级：** 高级
> **风险等级：** ⚠️⚠️ 中低（2/5）

---

## 📖 Bid-Ask Spread 原理

### 什么是买卖价差（Spread）？

买卖价差是订单簿中最高买价（Bid）和最低卖价（Ask）之间的差价，代表市场流动性成本。

**订单簿示例：**

\`\`\`
BTC/USDT 订单簿（Binance）

卖单（Ask）               数量
$60,052.50  ──────────  0.5 BTC
$60,051.00  ──────────  1.2 BTC  ← 最优卖价（Ask）
──────────────────────────────────
        价差：$3（0.005%）
──────────────────────────────────
$60,048.00  ──────────  2.0 BTC  ← 最优买价（Bid）
$60,047.00  ──────────  1.8 BTC
$60,046.00  ──────────  0.8 BTC
买单（Bid）
\`\`\`

**价差的含义：**
- 如果你立即买入：支付 $60,051
- 如果你立即卖出：获得 $60,048
- 差价：$3（被做市商赚走）

### 如何赚取价差？

**核心策略：** 成为"做市商"，在买一和卖一之间挂单

\`\`\`
步骤 1：在 $60,048.50 挂买单（比买一价高 $0.50）
步骤 2：在 $60,050.50 挂卖单（比卖一价低 $0.50）

如果都成交：
买入价：$60,048.50
卖出价：$60,050.50
利润：$2.00/BTC（0.0033%）
\`\`\`

---

## 🎯 策略核心逻辑

### 策略 1：微小加价抢占

**在买一和卖一之间"插队"**

\`\`\`javascript
const ccxt = require('ccxt');

const exchange = new ccxt.binance({
  apiKey: 'YOUR_API_KEY',
  secret: 'YOUR_SECRET',
  enableRateLimit: true,
  options: {
    defaultType: 'spot',
    recvWindow: 60000
  }
});

async function spreadCapture() {
  const symbol = 'BTC/USDT';
  const orderSize = 0.01; // 0.01 BTC

  while (true) {
    try {
      // 1. 获取实时订单簿
      const orderbook = await exchange.fetchOrderBook(symbol, 5);

      const bestBid = orderbook.bids[0][0]; // 最高买价
      const bestAsk = orderbook.asks[0][0]; // 最低卖价
      const spread = bestAsk - bestBid;
      const spreadPercent = (spread / bestBid) * 100;

      console.log(\`
╔════════════════════════════════════╗
║   Bid-Ask Spread Monitor           ║
╚════════════════════════════════════╝

最高买价: $\${bestBid.toFixed(2)}
最低卖价: $\${bestAsk.toFixed(2)}
价差: $\${spread.toFixed(2)} (\${spreadPercent.toFixed(4)}%)
      \`);

      // 2. 仅在价差足够大时交易（> 手续费成本）
      const minSpread = bestBid * 0.0002; // 最小 0.02%

      if (spread > minSpread) {
        // 取消旧订单
        const openOrders = await exchange.fetchOpenOrders(symbol);
        for (const order of openOrders) {
          await exchange.cancelOrder(order.id, symbol);
        }

        // 计算新的挂单价格（在价差中间）
        const ourBuyPrice = bestBid + (spread * 0.3); // 买一价 + 30% 价差
        const ourSellPrice = bestAsk - (spread * 0.3); // 卖一价 - 30% 价差

        // 挂买卖单
        const buyOrder = await exchange.createLimitOrder(
          symbol,
          'buy',
          orderSize,
          ourBuyPrice
        );

        const sellOrder = await exchange.createLimitOrder(
          symbol,
          'sell',
          orderSize,
          ourSellPrice
        );

        console.log(\`✅ 买单: $\${ourBuyPrice.toFixed(2)}\`);
        console.log(\`✅ 卖单: $\${ourSellPrice.toFixed(2)}\`);
        console.log(\`预期利润: $\${((ourSellPrice - ourBuyPrice) * orderSize).toFixed(2)}\\n\`);

      } else {
        console.log('⏸️  价差过小，等待机会...\\n');
      }

      // 3. 快速刷新（高频）
      await sleep(2000); // 2 秒

    } catch (error) {
      console.error('错误:', error.message);
      await sleep(5000);
    }
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

spreadCapture();
\`\`\`

### 策略 2：动态价差追踪

**根据市场波动性调整挂单位置**

\`\`\`javascript
async function dynamicSpreadTracking() {
  const symbol = 'ETH/USDT';

  // 获取历史价差数据
  const spreadHistory = [];

  setInterval(async () => {
    const orderbook = await exchange.fetchOrderBook(symbol);
    const spread = orderbook.asks[0][0] - orderbook.bids[0][0];
    spreadHistory.push(spread);

    // 保留最近 100 个数据点
    if (spreadHistory.length > 100) spreadHistory.shift();

    // 计算平均价差
    const avgSpread = spreadHistory.reduce((a, b) => a + b) / spreadHistory.length;

    console.log(\`当前价差: $\${spread.toFixed(2)}\`);
    console.log(\`平均价差: $\${avgSpread.toFixed(2)}\`);

    // 仅在价差高于平均值时交易（更高利润）
    if (spread > avgSpread * 1.2) {
      console.log('🎯 价差扩大，执行套利！');
      await placeSpreadOrders(orderbook);
    }

  }, 5000);
}
\`\`\`

### 策略 3：多层挂单

**同时在多个价格层级挂单**

\`\`\`javascript
async function multilayerSpreadCapture() {
  const symbol = 'BTC/USDT';
  const layers = 5; // 5 层挂单
  const baseSize = 0.01;

  const orderbook = await exchange.fetchOrderBook(symbol, 20);

  const bestBid = orderbook.bids[0][0];
  const bestAsk = orderbook.asks[0][0];
  const spread = bestAsk - bestBid;

  // 在价差内均匀分布挂单
  for (let i = 1; i <= layers; i++) {
    const buyPrice = bestBid + (spread / (layers + 1)) * i;
    const sellPrice = bestAsk - (spread / (layers + 1)) * i;

    await exchange.createLimitOrder(symbol, 'buy', baseSize / layers, buyPrice);
    await exchange.createLimitOrder(symbol, 'sell', baseSize / layers, sellPrice);

    console.log(\`第 \${i} 层: 买 @ $\${buyPrice.toFixed(2)}, 卖 @ $\${sellPrice.toFixed(2)}\`);
  }

  console.log('多层挂单完成！');
}
\`\`\`

---

## 📊 收益计算

### 单次交易收益

\`\`\`
示例：BTC/USDT
买入价：$60,048.50
卖出价：$60,050.50
订单大小：0.01 BTC

毛利润：($60,050.50 - $60,048.50) × 0.01 = $0.02

手续费（Maker -0.01% × 2）：
买入返佣：$60,048.50 × 0.01 × 0.0001 = $0.06
卖出返佣：$60,050.50 × 0.01 × 0.0001 = $0.06

净利润：$0.02 + $0.06 + $0.06 = $0.14
\`\`\`

### 年化收益估算

\`\`\`
假设参数：
- 每次利润：$0.10
- 每天成交次数：100 次（高频）
- 日收益：$10
- 本金：$600（0.01 BTC × $60,000）
- 日收益率：1.67%
- 年化 APR：609%

实际收益（考虑未全部成交）：25-80%
\`\`\`

---

## ⚠️ 风险管理

### 风险 1：单边成交

**问题：** 买单成交了，卖单没成交

\`\`\`
你在 $60,048.50 买入 0.01 BTC
价格突然上涨到 $60,200
你的卖单在 $60,050.50 一直没成交

方案 A：等待价格回调（被动）
方案 B：市价卖出止盈（主动）
方案 C：在新价格挂卖单（跟随市场）
\`\`\`

**自动化处理：**

\`\`\`javascript
async function handlePartialFill() {
  const position = await getPosition(); // 当前持仓

  if (position.btc > 0.005) {
    // 持有超过 0.005 BTC（半仓）
    const currentPrice = await getCurrentPrice('BTC/USDT');

    // 如果价格上涨 > 0.5%，止盈
    if (currentPrice > position.avgCost * 1.005) {
      await exchange.createMarketOrder('BTC/USDT', 'sell', position.btc);
      console.log('止盈卖出！');
    }

    // 如果价格下跌 > 0.3%，止损
    if (currentPrice < position.avgCost * 0.997) {
      await exchange.createMarketOrder('BTC/USDT', 'sell', position.btc);
      console.log('止损卖出！');
    }
  }
}

setInterval(handlePartialFill, 10000); // 每 10 秒检查
\`\`\`

### 风险 2：延迟劣势

**高频交易者（HFT）会抢在你前面**

\`\`\`
你看到的订单簿：
买一：$60,048
卖一：$60,051

你挂单 $60,049（买）和 $60,050（卖）

但 HFT 机器人延迟仅 1ms，已经在 $60,048.01 挂单
结果：你的订单被排在后面，成交率低
\`\`\`

**应对策略：**
- 使用 VPS（接近交易所服务器）
- 使用 WebSocket 实时更新（比 REST API 快）
- 放弃超小价差，专注中等价差

---

## 💡 高级技巧

### 技巧 1：波动性筛选

\`\`\`javascript
// 仅在高波动时段交易（价差更大）
async function volatilityFilter() {
  const ohlcv = await exchange.fetchOHLCV('BTC/USDT', '1m', undefined, 60);

  // 计算最近 1 小时的波动率
  const prices = ohlcv.map(candle => candle[4]); // 收盘价
  const returns = [];

  for (let i = 1; i < prices.length; i++) {
    returns.push((prices[i] - prices[i-1]) / prices[i-1]);
  }

  const volatility = Math.sqrt(
    returns.reduce((sum, r) => sum + r * r, 0) / returns.length
  );

  console.log(\`当前波动率: \${(volatility * 100).toFixed(3)}%\`);

  if (volatility > 0.001) {
    console.log('高波动环境，启动价差捕获！');
    return true;
  } else {
    console.log('低波动环境，暂停交易');
    return false;
  }
}
\`\`\`

### 技巧 2：智能订单大小

\`\`\`javascript
// 根据价差大小动态调整订单量
function calculateOptimalSize(spread, balance) {
  const minSize = 0.001; // 最小 0.001 BTC
  const maxSize = 0.1;   // 最大 0.1 BTC

  // 价差越大，订单越大
  const spreadPercent = spread / getCurrentPrice();
  const size = minSize + (maxSize - minSize) * (spreadPercent / 0.001);

  return Math.min(Math.max(size, minSize), maxSize);
}
\`\`\`

---

## 📈 收益预期

| 市场状态 | 价差范围 | 日成交次数 | 单次利润 | 日收益率 | 年化 APR |
|---------|---------|-----------|---------|---------|----------|
| 高波动 | 0.03-0.1% | 80-150 | $0.15 | 2-3% | 730-1095% |
| 正常 | 0.01-0.03% | 40-80 | $0.08 | 0.5-1.5% | 180-550% |
| 低波动 | 0.005-0.01% | 10-30 | $0.03 | 0.1-0.3% | 36-110% |

**保守估计年化：25-80%**

> ⚠️ **重要提示：** 价差捕获策略需要低延迟和高频交易能力。建议使用 VPS 部署在交易所附近（如 AWS Tokyo for Binance），并使用 WebSocket API。`,
  status: 'published'
};

const STRATEGY_27_8 = {
  title: '订单簿深度不对称套利 - 失衡捕获策略',
  slug: 'orderbook-depth-imbalance-arbitrage',
  summary: '检测订单簿买卖深度失衡，预测短期价格方向，提前挂单获利。利用大单冲击和深度差异套利，年化收益 30-120%。',
  category: 'market-making-spread',
  category_l1: 'arbitrage',
  category_l2: 'market-making-spread',
  risk_level: 3,
  apy_min: 30,
  apy_max: 120,
  content: `# 订单簿深度不对称套利 - 失衡捕获策略

> **预计阅读时间：** 28 分钟
> **难度等级：** 高级
> **风险等级：** ⚠️⚠️⚠️ 中高（3/5）

---

## 📖 深度不对称原理

### 什么是订单簿深度？

订单簿深度是指在不同价格层级上挂单的总量，反映市场承接能力。

**正常平衡的订单簿：**

\`\`\`
买单深度（Bid）                卖单深度（Ask）
100 BTC  ────┐            ┌──── 100 BTC
 80 BTC  ────┤            ├──── 85 BTC
 60 BTC  ────┤            ├──── 70 BTC
 40 BTC  ────┤            ├──── 50 BTC
 20 BTC  ────┴────────────┴──── 30 BTC
         ←平衡→

买卖深度比：约 1:1（平衡）
\`\`\`

**失衡的订单簿：**

\`\`\`
买单深度                     卖单深度
200 BTC  ────┐          ┌──── 30 BTC
150 BTC  ────┤          ├──── 20 BTC
120 BTC  ────┤          ├──── 15 BTC
 90 BTC  ────┤          ├──── 10 BTC
 50 BTC  ────┴──────────┴──── 5 BTC
      ←买盘强势→

买卖深度比：6:1（极度失衡）
预期：价格即将上涨！
\`\`\`

### 为什么深度失衡能预测价格？

\`\`\`
原理：供需不平衡

买盘深度 >> 卖盘深度：
- 市场需求强劲
- 卖单容易被吃掉
- 价格向上突破概率高

卖盘深度 >> 买盘深度：
- 市场抛压沉重
- 买单容易被打穿
- 价格向下突破概率高
\`\`\`

---

## 🎯 策略核心逻辑

### 策略 1：深度比率监控

\`\`\`javascript
const ccxt = require('ccxt');

const exchange = new ccxt.binance({
  apiKey: 'YOUR_API_KEY',
  secret: 'YOUR_SECRET'
});

async function depthImbalanceDetector() {
  const symbol = 'BTC/USDT';
  const depthLevels = 20; // 监控前 20 档

  while (true) {
    try {
      // 1. 获取订单簿深度
      const orderbook = await exchange.fetchOrderBook(symbol, depthLevels);

      // 2. 计算买卖深度总量
      let bidDepth = 0;
      let askDepth = 0;

      for (let i = 0; i < Math.min(depthLevels, orderbook.bids.length); i++) {
        bidDepth += orderbook.bids[i][1]; // 累加买单数量
      }

      for (let i = 0; i < Math.min(depthLevels, orderbook.asks.length); i++) {
        askDepth += orderbook.asks[i][1]; // 累加卖单数量
      }

      // 3. 计算深度比率
      const depthRatio = bidDepth / askDepth;
      const imbalance = ((bidDepth - askDepth) / (bidDepth + askDepth)) * 100;

      console.log(\`
╔═══════════════════════════════════════╗
║   订单簿深度监控                       ║
╚═══════════════════════════════════════╝

买单深度: \${bidDepth.toFixed(2)} BTC
卖单深度: \${askDepth.toFixed(2)} BTC
深度比率: \${depthRatio.toFixed(2)}
失衡度: \${imbalance.toFixed(2)}%
      \`);

      // 4. 交易信号
      if (depthRatio > 1.5) {
        console.log('🟢 买盘强势！预期上涨');
        await executeLongSignal(symbol);

      } else if (depthRatio < 0.67) {
        console.log('🔴 卖盘强势！预期下跌');
        await executeShortSignal(symbol);

      } else {
        console.log('⚪ 深度平衡，观望\\n');
      }

      await sleep(5000);

    } catch (error) {
      console.error('错误:', error.message);
      await sleep(10000);
    }
  }
}

async function executeLongSignal(symbol) {
  const ticker = await exchange.fetchTicker(symbol);
  const currentPrice = ticker.last;

  // 提前在略高价格挂卖单（预期上涨后成交）
  const sellPrice = currentPrice * 1.002; // +0.2%

  await exchange.createLimitOrder(symbol, 'sell', 0.01, sellPrice);
  console.log(\`✅ 挂卖单 @ $\${sellPrice.toFixed(2)}（等待上涨）\\n\`);
}

async function executeShortSignal(symbol) {
  const ticker = await exchange.fetchTicker(symbol);
  const currentPrice = ticker.last;

  // 提前在略低价格挂买单（预期下跌后成交）
  const buyPrice = currentPrice * 0.998; // -0.2%

  await exchange.createLimitOrder(symbol, 'buy', 0.01, buyPrice);
  console.log(\`✅ 挂买单 @ $\${buyPrice.toFixed(2)}（等待下跌）\\n\`);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

depthImbalanceDetector();
\`\`\`

### 策略 2：大单冲击检测

\`\`\`javascript
// 检测突然出现的大额挂单
async function largeOrderDetector() {
  const symbol = 'ETH/USDT';
  let previousOrderbook = null;

  setInterval(async () => {
    const currentOrderbook = await exchange.fetchOrderBook(symbol, 10);

    if (previousOrderbook) {
      // 检测买一卖一的大幅变化
      const bidChange = currentOrderbook.bids[0][1] - previousOrderbook.bids[0][1];
      const askChange = currentOrderbook.asks[0][1] - previousOrderbook.asks[0][1];

      console.log(\`买一变化: \${bidChange > 0 ? '+' : ''}\${bidChange.toFixed(2)} ETH\`);
      console.log(\`卖一变化: \${askChange > 0 ? '+' : ''}\${askChange.toFixed(2)} ETH\`);

      // 如果买一突然增加 > 10 ETH（大单支撑）
      if (bidChange > 10) {
        console.log('🐋 检测到大额买单支撑！');
        await executeLongSignal(symbol);
      }

      // 如果卖一突然增加 > 10 ETH（大单压制）
      if (askChange > 10) {
        console.log('🐋 检测到大额卖单压力！');
        await executeShortSignal(symbol);
      }
    }

    previousOrderbook = currentOrderbook;

  }, 3000); // 每 3 秒检测
}
\`\`\`

### 策略 3：累计深度曲线分析

\`\`\`javascript
async function cumulativeDepthAnalysis() {
  const symbol = 'BTC/USDT';

  const orderbook = await exchange.fetchOrderBook(symbol, 50);
  const currentPrice = (orderbook.bids[0][0] + orderbook.asks[0][0]) / 2;

  // 计算 ±1% 范围内的深度
  const range = 0.01; // 1%
  const lowerBound = currentPrice * (1 - range);
  const upperBound = currentPrice * (1 + range);

  let bidDepthInRange = 0;
  let askDepthInRange = 0;

  for (const [price, volume] of orderbook.bids) {
    if (price >= lowerBound) {
      bidDepthInRange += volume;
    }
  }

  for (const [price, volume] of orderbook.asks) {
    if (price <= upperBound) {
      askDepthInRange += volume;
    }
  }

  console.log(\`±1% 范围内深度:\`);
  console.log(\`买单: \${bidDepthInRange.toFixed(2)} BTC\`);
  console.log(\`卖单: \${askDepthInRange.toFixed(2)} BTC\`);

  const ratio = bidDepthInRange / askDepthInRange;

  if (ratio > 2) {
    console.log('强势支撑，做多！');
  } else if (ratio < 0.5) {
    console.log('强势压力，做空！');
  }
}
\`\`\`

---

## 📊 高级信号组合

### 多重确认系统

\`\`\`javascript
async function multiSignalConfirmation() {
  const symbol = 'BTC/USDT';

  // 信号 1：深度比率
  const depthRatio = await calculateDepthRatio(symbol);

  // 信号 2：成交量激增
  const volumeSpike = await detectVolumeSpike(symbol);

  // 信号 3：价格突破
  const priceBreakout = await checkPriceBreakout(symbol);

  // 综合评分
  let score = 0;

  if (depthRatio > 1.5) score += 2;
  if (volumeSpike) score += 1;
  if (priceBreakout === 'up') score += 2;

  console.log(\`综合信号评分: \${score}/5\`);

  if (score >= 4) {
    console.log('强烈买入信号！');
    await executeLongSignal(symbol);
  } else if (score <= 1) {
    console.log('强烈卖出信号！');
    await executeShortSignal(symbol);
  } else {
    console.log('信号不明确，观望');
  }
}
\`\`\`

---

## ⚠️ 风险管理

### 风险 1：虚假信号（假突破）

\`\`\`
问题：
大单挂单 → 你跟进 → 大单撤单 → 价格反向

应对：
1. 等待大单持续 30 秒以上
2. 结合成交量确认
3. 设置止损（0.3-0.5%）
\`\`\`

### 风险 2：闪崩/闪拉

\`\`\`javascript
// 极端价格保护
async function extremePriceProtection() {
  const currentPrice = await getCurrentPrice('BTC/USDT');
  const avgPrice24h = await get24hAvgPrice('BTC/USDT');

  const deviation = Math.abs(currentPrice - avgPrice24h) / avgPrice24h;

  if (deviation > 0.05) {
    console.log('⚠️  价格偏离 24h 均价超过 5%，暂停交易！');
    return false;
  }

  return true;
}
\`\`\`

---

## 💡 实战技巧

### 技巧 1：多交易对监控

\`\`\`javascript
const symbols = ['BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'SOL/USDT'];

async function multiSymbolMonitor() {
  const opportunities = [];

  for (const symbol of symbols) {
    const ratio = await calculateDepthRatio(symbol);

    if (ratio > 1.8 || ratio < 0.55) {
      opportunities.push({
        symbol: symbol,
        ratio: ratio,
        direction: ratio > 1 ? 'LONG' : 'SHORT'
      });
    }
  }

  opportunities.sort((a, b) => Math.abs(b.ratio - 1) - Math.abs(a.ratio - 1));

  console.log('失衡机会排行：');
  opportunities.forEach((opp, i) => {
    console.log(\`\${i+1}. \${opp.symbol}: \${opp.direction} (比率 \${opp.ratio.toFixed(2)})\`);
  });

  // 交易最失衡的前 2 个
  for (let i = 0; i < Math.min(2, opportunities.length); i++) {
    await executeSignal(opportunities[i]);
  }
}
\`\`\`

---

## 📈 收益预期

| 信号强度 | 日交易次数 | 胜率 | 单次利润 | 日收益率 | 年化 APR |
|---------|-----------|------|---------|---------|----------|
| 强信号（比率 > 2） | 5-10 | 75% | 0.3-0.6% | 1-4% | 365-1460% |
| 中信号（比率 1.5-2） | 10-20 | 65% | 0.2-0.4% | 1-5% | 365-1825% |
| 弱信号（比率 1.3-1.5） | 20-40 | 55% | 0.1-0.2% | 1-4% | 365-1460% |

**保守估计年化：30-120%**

> ⚠️ **重要提示：** 深度分析需要实时数据和快速执行。建议使用 WebSocket 监控订单簿变化，并设置严格止损（0.3-0.5%）。`,
  status: 'published'
};

const STRATEGY_27_9 = {
  title: '三角套利做市组合 - 多货币对联动收益',
  slug: 'triangular-arbitrage-market-making',
  summary: '在三个相关货币对之间构建循环交易路径，捕获汇率不一致机会。结合做市策略降低风险，年化收益 20-70%。',
  category: 'market-making-spread',
  category_l1: 'arbitrage',
  category_l2: 'market-making-spread',
  risk_level: 2,
  apy_min: 20,
  apy_max: 70,
  content: `# 三角套利做市组合 - 多货币对联动收益

> **预计阅读时间：** 30 分钟
> **难度等级：** 高级
> **风险等级：** ⚠️⚠️ 中低（2/5）

---

## 📖 三角套利原理

### 什么是三角套利（Triangular Arbitrage）？

三角套利是利用三个货币对之间的汇率不一致，通过循环交易获利的策略。

**经典示例：**

\`\`\`
货币对价格：
BTC/USDT = $60,000
ETH/USDT = $3,000
BTC/ETH = 19.8（理论应为 20）

套利路径：
起始：1,000 USDT

1. USDT → ETH：
   1,000 USDT ÷ 3,000 = 0.3333 ETH

2. ETH → BTC：
   0.3333 ETH ÷ 19.8 = 0.01683 BTC

3. BTC → USDT：
   0.01683 BTC × 60,000 = 1,009.8 USDT

利润：1,009.8 - 1,000 = $9.8（0.98%）
\`\`\`

### 三角套利公式

\`\`\`
理论汇率：
BTC/ETH = (BTC/USDT) ÷ (ETH/USDT)
        = 60,000 ÷ 3,000
        = 20

实际汇率：19.8

价差：20 - 19.8 = 0.2（1%）

套利方向：
如果实际 < 理论 → ETH → BTC → USDT → ETH
如果实际 > 理论 → BTC → ETH → USDT → BTC
\`\`\`

---

## 🎯 策略核心逻辑

### 策略 1：经典三角套利

\`\`\`javascript
const ccxt = require('ccxt');

const exchange = new ccxt.binance({
  apiKey: 'YOUR_API_KEY',
  secret: 'YOUR_SECRET',
  enableRateLimit: true
});

async function triangularArbitrage() {
  // 定义三角路径
  const pair1 = 'ETH/USDT';
  const pair2 = 'BTC/ETH';
  const pair3 = 'BTC/USDT';

  while (true) {
    try {
      // 1. 获取实时价格
      const ticker1 = await exchange.fetchTicker(pair1);
      const ticker2 = await exchange.fetchTicker(pair2);
      const ticker3 = await exchange.fetchTicker(pair3);

      const ethUsdt = ticker1.ask; // ETH/USDT
      const btcEth = ticker2.ask;  // BTC/ETH
      const btcUsdt = ticker3.bid; // BTC/USDT

      // 2. 计算理论汇率
      const theoreticalBtcEth = btcUsdt / ethUsdt;

      // 3. 计算价差
      const deviation = ((btcEth - theoreticalBtcEth) / theoreticalBtcEth) * 100;

      console.log(\`
╔═══════════════════════════════════════╗
║   三角套利监控                         ║
╚═══════════════════════════════════════╝

ETH/USDT: $\${ethUsdt.toFixed(2)}
BTC/ETH:  \${btcEth.toFixed(4)}
BTC/USDT: $\${btcUsdt.toFixed(2)}

理论 BTC/ETH: \${theoreticalBtcEth.toFixed(4)}
实际 BTC/ETH: \${btcEth.toFixed(4)}
价差: \${deviation.toFixed(3)}%
      \`);

      // 4. 检查套利机会（扣除手续费后仍有利润）
      const minDeviation = 0.15; // 最小 0.15%（手续费约 0.1%）

      if (Math.abs(deviation) > minDeviation) {
        console.log('🎯 发现三角套利机会！');

        if (deviation > 0) {
          // BTC/ETH 高估 → 路径：USDT → ETH → BTC → USDT
          await executeTriangularTrade('forward');
        } else {
          // BTC/ETH 低估 → 路径：USDT → BTC → ETH → USDT
          await executeTriangularTrade('reverse');
        }
      } else {
        console.log('价差不足，等待机会...\\n');
      }

      await sleep(3000);

    } catch (error) {
      console.error('错误:', error.message);
      await sleep(10000);
    }
  }
}

async function executeTriangularTrade(direction) {
  const startAmount = 1000; // 起始 1000 USDT

  if (direction === 'forward') {
    console.log('执行正向套利: USDT → ETH → BTC → USDT\\n');

    // Step 1: USDT → ETH
    const order1 = await exchange.createMarketOrder('ETH/USDT', 'buy', startAmount / 3000);
    console.log(\`✅ 买入 ETH: \${order1.filled} ETH\`);

    await sleep(500);

    // Step 2: ETH → BTC
    const order2 = await exchange.createMarketOrder('BTC/ETH', 'buy', order1.filled);
    console.log(\`✅ 买入 BTC: \${order2.filled} BTC\`);

    await sleep(500);

    // Step 3: BTC → USDT
    const order3 = await exchange.createMarketOrder('BTC/USDT', 'sell', order2.filled);
    console.log(\`✅ 卖出 BTC，获得: $\${order3.cost.toFixed(2)}\\n\`);

    const profit = order3.cost - startAmount;
    console.log(\`利润: $\${profit.toFixed(2)} (\${((profit/startAmount)*100).toFixed(3)}%)\\n\`);

  } else {
    console.log('执行反向套利: USDT → BTC → ETH → USDT\\n');

    // Step 1: USDT → BTC
    const order1 = await exchange.createMarketOrder('BTC/USDT', 'buy', startAmount / 60000);
    console.log(\`✅ 买入 BTC: \${order1.filled} BTC\`);

    await sleep(500);

    // Step 2: BTC → ETH
    const order2 = await exchange.createMarketOrder('BTC/ETH', 'sell', order1.filled);
    console.log(\`✅ 卖出 BTC，获得: \${order2.filled} ETH\`);

    await sleep(500);

    // Step 3: ETH → USDT
    const order3 = await exchange.createMarketOrder('ETH/USDT', 'sell', order2.filled);
    console.log(\`✅ 卖出 ETH，获得: $\${order3.cost.toFixed(2)}\\n\`);

    const profit = order3.cost - startAmount;
    console.log(\`利润: $\${profit.toFixed(2)} (\${((profit/startAmount)*100).toFixed(3)}%)\\n\`);
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

triangularArbitrage();
\`\`\`

### 策略 2：三角做市组合

**同时在三个货币对上做市，捕获套利 + 价差**

\`\`\`javascript
async function triangularMarketMaking() {
  const pairs = ['ETH/USDT', 'BTC/ETH', 'BTC/USDT'];

  // 在三个货币对上同时挂买卖单
  for (const pair of pairs) {
    const ticker = await exchange.fetchTicker(pair);
    const mid = (ticker.bid + ticker.ask) / 2;

    // 买单：低于中间价 0.05%
    await exchange.createLimitOrder(pair, 'buy', 0.01, mid * 0.9995);

    // 卖单：高于中间价 0.05%
    await exchange.createLimitOrder(pair, 'sell', 0.01, mid * 1.0005);

    console.log(\`✅ \${pair} 做市订单已挂\`);
  }

  // 每分钟检查是否有三角套利机会
  setInterval(async () => {
    await checkTriangularOpportunity();
  }, 60000);
}
\`\`\`

### 策略 3：多路径扫描

\`\`\`javascript
// 自动扫描所有可能的三角路径
async function scanAllTriangularPaths() {
  const markets = await exchange.loadMarkets();

  // 找出所有 USDT 交易对
  const usdtPairs = Object.keys(markets).filter(s => s.endsWith('/USDT'));

  const opportunities = [];

  // 遍历所有可能的三角组合
  for (let i = 0; i < usdtPairs.length; i++) {
    for (let j = i + 1; j < usdtPairs.length; j++) {
      const pair1 = usdtPairs[i]; // 如 ETH/USDT
      const pair2 = usdtPairs[j]; // 如 BTC/USDT

      const base1 = pair1.split('/')[0]; // ETH
      const base2 = pair2.split('/')[0]; // BTC

      const crossPair = \`\${base2}/\${base1}\`; // BTC/ETH

      if (markets[crossPair]) {
        // 找到了完整的三角路径
        const deviation = await calculateTriangularDeviation(pair1, pair2, crossPair);

        if (Math.abs(deviation) > 0.15) {
          opportunities.push({
            path: [pair1, crossPair, pair2],
            deviation: deviation
          });
        }
      }
    }
  }

  // 按价差排序
  opportunities.sort((a, b) => Math.abs(b.deviation) - Math.abs(a.deviation));

  console.log(\`发现 \${opportunities.length} 个三角套利机会：\`);
  opportunities.slice(0, 5).forEach((opp, i) => {
    console.log(\`\${i+1}. \${opp.path.join(' → ')}: \${opp.deviation.toFixed(3)}%\`);
  });

  return opportunities;
}
\`\`\`

---

## 📊 收益计算

### 单次套利收益

\`\`\`
起始金额：1,000 USDT
价差：0.2%
手续费：0.04% × 3 = 0.12%

毛利润：1,000 × 0.2% = $2
手续费：1,000 × 0.12% = $1.2
净利润：$2 - $1.2 = $0.80

净收益率：0.08%
\`\`\`

### 年化收益估算

\`\`\`
假设参数：
- 每天发现 15 次机会
- 平均每次利润：$1.5
- 日收益：$22.5
- 本金：$10,000
- 日收益率：0.225%
- 年化 APR：82%

实际收益（考虑执行失败）：20-70%
\`\`\`

---

## ⚠️ 风险管理

### 风险 1：执行延迟

\`\`\`
问题：三步交易需要时间，价格可能变化

应对：
1. 使用限价单替代市价单（控制成交价）
2. 设置价格保护（如果偏离超过 0.1% 则取消）
3. 使用 WebSocket 实时监控
\`\`\`

### 风险 2：部分成交

\`\`\`javascript
// 检查订单是否完全成交
async function ensureFullFill(orderId, symbol) {
  const order = await exchange.fetchOrder(orderId, symbol);

  if (order.status !== 'closed') {
    console.log('⚠️  订单未完全成交，取消剩余部分');
    await exchange.cancelOrder(orderId, symbol);
  }

  return order.filled;
}
\`\`\`

---

## 💡 高级技巧

### 技巧 1：稳定币三角

\`\`\`
路径：USDT → USDC → DAI → USDT

优势：
- 价格波动极小
- 风险极低
- 价差虽小但稳定

适合大资金（$100,000+）
\`\`\`

### 技巧 2：闪电贷加杠杆

\`\`\`javascript
// 使用 Aave 闪电贷放大三角套利
async function flashLoanTriangular() {
  const loanAmount = 100000; // 借 10 万 USDT

  // 1. 发起闪电贷
  const flashloan = await aave.flashLoan(loanAmount);

  // 2. 执行三角套利（使用 10 万）
  const profit = await executeTriangularTrade('forward', loanAmount);

  // 3. 归还贷款 + 手续费（0.09%）
  const fee = loanAmount * 0.0009;
  await aave.repay(loanAmount + fee);

  // 4. 净利润
  console.log(\`闪电贷套利利润: $\${(profit - fee).toFixed(2)}\`);
}
\`\`\`

---

## 📈 收益预期

| 路径类型 | 日机会次数 | 单次利润 | 成功率 | 日收益 | 年化 APR |
|---------|-----------|---------|--------|--------|----------|
| 主流币（BTC/ETH） | 10-20 | 0.1-0.3% | 80% | $15-45 | 55-165% |
| 山寨币 | 30-50 | 0.3-0.8% | 60% | $30-120 | 110-440% |
| 稳定币 | 5-10 | 0.03-0.1% | 95% | $5-20 | 18-73% |

**保守估计年化：20-70%**

> ⚠️ **重要提示：** 三角套利需要快速执行和低延迟。建议使用自动化脚本 24/7 监控，并在多个交易所同时扫描机会。对于新手，建议从稳定币三角开始练习。`,
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

    const strategies = [STRATEGY_27_7, STRATEGY_27_8, STRATEGY_27_9];

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
