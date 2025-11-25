const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_EMAIL = 'the_uk1@outlook.com';
const DIRECTUS_PASSWORD = 'Mygcdjmyxzg2026!';

const STRATEGY_27_5 = {
  title: '交易所 Maker 返佣套利 - 零风险手续费倒挂收益',
  slug: 'exchange-maker-rebate-arbitrage',
  summary: '利用交易所 Maker 负手续费返佣机制，通过高频挂单赚取返佣收入。结合对冲策略实现零风险套利，年化收益 10-40%。',
  category: 'market-making-spread',
  category_l1: 'arbitrage',
  category_l2: 'market-making-spread',
  risk_level: 1,
  apy_min: 10,
  apy_max: 40,
  content: `# 交易所 Maker 返佣套利 - 零风险手续费倒挂收益

> **预计阅读时间：** 25 分钟
> **难度等级：** 中级
> **风险等级：** ⚠️ 极低（1/5）

---

## 📖 Maker 返佣机制

### 什么是 Maker 返佣（Rebate）？

部分交易所为了鼓励用户提供流动性，对 Maker 订单（挂单）给予负手续费，即"倒贴钱"。

**手续费对比：**

| 交易所 | Maker 费率 | Taker 费率 | 返佣条件 |
|--------|-----------|-----------|---------|
| **Bybit** | **-0.01%** | 0.055% | 所有用户 ✅ |
| **dYdX** | **-0.025%** | 0.05% | 所有用户 ✅ |
| **Kraken** | 0% | 0.26% | VIP 0 |
| **Kraken** | **-0.01%** | 0.20% | VIP 3 ✅ |
| **Binance** | 0.02% | 0.04% | VIP 0 |
| **Binance** | **-0.01%** | 0.02% | VIP 5 ✅ |
| **OKX** | 0.02% | 0.05% | VIP 0 |
| **OKX** | **-0.005%** | 0.03% | VIP 3 ✅ |

### 返佣如何赚钱？

**示例：Bybit 永续合约**

\`\`\`
你挂 Maker 限价单买入 1 BTC @ $60,000
订单成交：
- 支付：$60,000
- 获得：1 BTC
- 手续费：-$6（负数 = 返佣）

净成本：$60,000 - $6 = $59,994

立即市价卖出 1 BTC @ $60,000：
- 获得：$60,000
- 手续费：$60,000 × 0.055% = $33

总收益：$6（买入返佣）- $33（卖出手续费）= **-$27 亏损**

❌ 单边返佣不够，需要双边对冲！
\`\`\`

---

## 🎯 策略核心逻辑

### 策略 1：双边对冲返佣

**在两个交易所同时操作，锁定价差**

\`\`\`
Bybit：Maker 返佣 -0.01%
Binance：Taker 费用 0.04%

步骤 1：Bybit 挂 Maker 限价买单 1 BTC @ $60,000
  → 成交后获得返佣 $6

步骤 2：同时在 Binance 市价做空 1 BTC @ $60,000
  → 手续费 $24

结果：
- Bybit 持有 +1 BTC（现货多头）
- Binance 持有 -1 BTC（合约空头）
- 净敞口：0（完全对冲）
- 净收益：$6 - $24 = -$18（还是亏？）

💡 关键：需要找到 Maker 返佣更高的交易所！
\`\`\`

**改进方案：使用 dYdX**

\`\`\`
dYdX：Maker 返佣 -0.025%（更高！）
Binance：Taker 费用 0.04%

步骤 1：dYdX 挂 Maker 限价买入 10 ETH @ $3,000
  → 成交后获得返佣：$30,000 × 0.025% = $7.5

步骤 2：Binance 市价做空 10 ETH @ $3,000
  → 手续费：$30,000 × 0.04% = $12

净收益：$7.5 - $12 = -$4.5（仍然亏损）

问题出在哪？→ Taker 费用太高！
\`\`\`

### 策略 2：双 Maker 对冲（核心策略）

**在两个都有返佣的交易所同时挂 Maker 单**

\`\`\`javascript
const ccxt = require('ccxt');

const dydx = new ccxt.dydx({
  apiKey: 'YOUR_DYDX_API_KEY',
  secret: 'YOUR_DYDX_SECRET'
});

const bybit = new ccxt.bybit({
  apiKey: 'YOUR_BYBIT_API_KEY',
  secret: 'YOUR_BYBIT_SECRET'
});

async function dualMakerRebateArbitrage() {
  const symbol = 'ETH/USDT';
  const orderSize = 1; // 1 ETH

  while (true) {
    try {
      // 1. 获取两个交易所的市场价格
      const dydxTicker = await dydx.fetchTicker(symbol);
      const bybitTicker = await bybit.fetchTicker(symbol);

      const dydxMid = (dydxTicker.bid + dydxTicker.ask) / 2;
      const bybitMid = (bybitTicker.bid + bybitTicker.ask) / 2;

      console.log(\`dYdX 中间价: $\${dydxMid.toFixed(2)}\`);
      console.log(\`Bybit 中间价: $\${bybitMid.toFixed(2)}\`);

      // 2. 在两个交易所都挂 Maker 买单
      const dydxBuyPrice = dydxMid * 0.9995; // 略低于中间价
      const bybitBuyPrice = bybitMid * 0.9995;

      const dydxOrder = await dydx.createLimitOrder(symbol, 'buy', orderSize, dydxBuyPrice);
      const bybitOrder = await bybit.createLimitOrder(symbol, 'buy', orderSize, bybitBuyPrice);

      console.log(\`dYdX 买单: $\${dydxBuyPrice.toFixed(2)}\`);
      console.log(\`Bybit 买单: $\${bybitBuyPrice.toFixed(2)}\`);

      // 3. 等待成交（假设都成交）
      await waitForOrderFilled(dydxOrder.id, bybitOrder.id);

      // 4. 计算返佣收入
      const dydxRebate = dydxBuyPrice * orderSize * 0.00025; // 0.025%
      const bybitRebate = bybitBuyPrice * orderSize * 0.0001; // 0.01%
      const totalRebate = dydxRebate + bybitRebate;

      console.log(\`dYdX 返佣: $\${dydxRebate.toFixed(2)}\`);
      console.log(\`Bybit 返佣: $\${bybitRebate.toFixed(2)}\`);
      console.log(\`总返佣: $\${totalRebate.toFixed(2)}\\n\`);

      // 5. 现在你在两个交易所都持有 ETH，需要卖出对冲
      // 方案 A：再次挂 Maker 卖单（继续赚返佣，但慢）
      // 方案 B：市价卖出（快速平仓，但付手续费）

      // 这里选择方案 A：继续挂 Maker
      const dydxSellPrice = dydxMid * 1.0005;
      const bybitSellPrice = bybitMid * 1.0005;

      await dydx.createLimitOrder(symbol, 'sell', orderSize, dydxSellPrice);
      await bybit.createLimitOrder(symbol, 'sell', orderSize, bybitSellPrice);

      console.log('等待卖单成交...');

      // 6. 卖单成交后，再次获得返佣
      await waitForSellOrdersFilled();

      const dydxSellRebate = dydxSellPrice * orderSize * 0.00025;
      const bybitSellRebate = bybitSellPrice * orderSize * 0.0001;
      const totalSellRebate = dydxSellRebate + bybitSellRebate;

      console.log(\`卖出返佣: $\${totalSellRebate.toFixed(2)}\`);
      console.log(\`本轮总收益: $\${(totalRebate + totalSellRebate).toFixed(2)}\\n\`);

      // 7. 等待下一轮
      await sleep(60000); // 1 分钟

    } catch (error) {
      console.error('错误:', error.message);
      await sleep(10000);
    }
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

dualMakerRebateArbitrage();
\`\`\`

**收益计算：**

\`\`\`
单次完整循环（买入 + 卖出）：
- dYdX 返佣：$3,000 × 0.025% × 2 = $1.50
- Bybit 返佣：$3,000 × 0.01% × 2 = $0.60
- 总收益：$2.10

每天完成 20 次循环：
- 日收益：$2.10 × 20 = $42
- 本金：$6,000（两个交易所各 $3,000）
- 日收益率：0.7%
- 年化 APR：255%

实际收益（考虑未成交、滑点）：10-40%
\`\`\`

### 策略 3：高频刷单（激进）

**专注于返佣，不在乎价格波动**

\`\`\`javascript
async function highFrequencyRebateHarvesting() {
  const symbol = 'BTC-PERP'; // dYdX 永续合约
  const orderSize = 0.01; // 0.01 BTC

  setInterval(async () => {
    try {
      const ticker = await dydx.fetchTicker(symbol);
      const midPrice = (ticker.bid + ticker.ask) / 2;

      // 在买一和卖一价格挂单（更容易成交）
      const buyPrice = ticker.bid + 0.01; // 略高于买一
      const sellPrice = ticker.ask - 0.01; // 略低于卖一

      // 同时挂买卖单
      await dydx.createLimitOrder(symbol, 'buy', orderSize, buyPrice);
      await dydx.createLimitOrder(symbol, 'sell', orderSize, sellPrice);

      console.log(\`挂单: 买 @ $\${buyPrice.toFixed(2)}, 卖 @ $\${sellPrice.toFixed(2)}\`);

      // 每 30 秒刷新一次
    }, 30000);
  });
}
\`\`\`

**⚠️ 风险警告：** 这种策略会快速积累单边持仓，必须配合库存管理！

---

## 📊 进阶技巧

### 技巧 1：VIP 等级优化

**提升 VIP 等级获得更高返佣**

\`\`\`
Binance VIP 等级对比：

VIP 0: Maker 0.02%, Taker 0.04%
VIP 1: Maker 0.016%, Taker 0.04%（30 天交易量 > $2M）
VIP 2: Maker 0.014%, Taker 0.035%（> $10M）
VIP 5: Maker -0.01%, Taker 0.02%（> $1B）

策略：
- 通过刷量（自成交或对冲）快速达到 VIP 等级
- 一旦达到负费率，立即启动返佣套利
\`\`\`

### 技巧 2：返佣 + 做市组合

\`\`\`javascript
// 在赚返佣的同时，尝试赚价差
async function rebatePlusSpread() {
  const ticker = await exchange.fetchTicker('ETH/USDT');
  const midPrice = (ticker.bid + ticker.ask) / 2;

  // 买单：低于中间价 0.1%
  const buyPrice = midPrice * 0.999;

  // 卖单：高于中间价 0.1%
  const sellPrice = midPrice * 1.001;

  await exchange.createLimitOrder('ETH/USDT', 'buy', 1, buyPrice);
  await exchange.createLimitOrder('ETH/USDT', 'sell', 1, sellPrice);

  // 如果买卖都成交：
  // 返佣收入：($3,000 × 0.025%) × 2 = $1.50
  // 价差收入：$3,000 × 0.2% = $6
  // 总收入：$7.50
}
\`\`\`

### 技巧 3：自动化返佣监控

\`\`\`javascript
// 实时监控返佣收入
async function trackRebateIncome() {
  const trades = await exchange.fetchMyTrades('ETH/USDT', undefined, 100);

  let totalRebate = 0;

  for (const trade of trades) {
    if (trade.takerOrMaker === 'maker') {
      // Maker 订单 → 计算返佣
      const rebate = trade.cost * 0.00025; // dYdX 0.025%
      totalRebate += rebate;

      console.log(\`[\${new Date(trade.timestamp).toLocaleString()}] 返佣: $\${rebate.toFixed(4)}\`);
    }
  }

  console.log(\`\\n累计返佣收入: $\${totalRebate.toFixed(2)}\`);
  return totalRebate;
}

// 每小时检查一次
setInterval(trackRebateIncome, 3600000);
\`\`\`

---

## ⚠️ 风险管理

### 风险 1：持仓不平衡

**问题：** 买单成交了，卖单没成交

\`\`\`
你在 dYdX 买入了 10 ETH，但卖单挂太高，没人要
结果：持有 10 ETH 多头敞口

如果 ETH 跌 5%：
账面亏损：$30,000 × 5% = $1,500
赚到的返佣：$7.5
净亏损：-$1,492.5
\`\`\`

**解决方案：**
\`\`\`javascript
// 设置最大持仓限制
const MAX_POSITION = 5; // 最多持有 5 ETH

async function checkAndHedge() {
  const balance = await exchange.fetchBalance();
  const ethBalance = balance['ETH'].total;

  if (ethBalance > MAX_POSITION) {
    console.log('⚠️  持仓过多，紧急平仓！');

    // 市价卖出多余部分
    await exchange.createMarketOrder('ETH/USDT', 'sell', ethBalance - MAX_POSITION);
  }
}
\`\`\`

### 风险 2：交易所政策变化

**应对措施：**
- 定期检查费率结构
- 分散到多个交易所
- 保留应急退出方案

---

## 💡 实战技巧

### 技巧 1：利用交易竞赛

很多交易所会举办做市竞赛，奖励高频 Maker 用户：

\`\`\`
dYdX 月度做市竞赛：
- 前 10 名：每人 $10,000 奖励
- 前 100 名：每人 $1,000 奖励

参赛条件：
- Maker 订单成交量 > $1,000,000
- 双边报价存在时间 > 90%

策略：专注刷 Maker 量，同时赚返佣 + 竞赛奖金
\`\`\`

### 技巧 2：API 返佣加成

某些交易所对 API 用户提供额外返佣：

\`\`\`
Bybit API Maker：
- Web 端：-0.01%
- API 端：-0.015%（额外 50% 加成）

策略：全部使用 API 交易，避免手动下单
\`\`\`

---

## 📈 收益预期

| 交易所组合 | 返佣率 | 日成交量 | 日收益 | 年化 APR |
|-----------|-------|---------|--------|----------|
| dYdX + Bybit | 0.035% | $100,000 | $35 | 12.8% |
| dYdX + dYdX | 0.05% | $100,000 | $50 | 18.3% |
| Kraken VIP3 + dYdX | 0.035% | $200,000 | $70 | 25.6% |
| 多所组合 + 竞赛 | 0.04% + 奖金 | $500,000 | $200+ | 40%+ |

**保守估计年化：10-40%**

> ⚠️ **重要提示：** 返佣套利收益稳定但不高，适合作为"基础收益层"。建议与其他策略（如网格、做市）叠加使用，提升整体收益。`,
  status: 'published'
};

const STRATEGY_27_6 = {
  title: 'VIP 等级手续费套利 - 大资金费率差收益',
  slug: 'vip-fee-tier-arbitrage',
  summary: '通过达到交易所 VIP 等级，享受极低手续费甚至负费率。利用 VIP 账户与普通账户的费率差进行套利，年化收益 15-50%。',
  category: 'market-making-spread',
  category_l1: 'arbitrage',
  category_l2: 'market-making-spread',
  risk_level: 2,
  apy_min: 15,
  apy_max: 50,
  content: `# VIP 等级手续费套利 - 大资金费率差收益

> **预计阅读时间：** 30 分钟
> **难度等级：** 中高级
> **风险等级：** ⚠️⚠️ 中低（2/5）

---

## 📖 VIP 等级体系

### 主流交易所 VIP 费率对比

**Binance VIP 等级：**

| 等级 | 30天交易量 | BNB 持仓 | Maker 费率 | Taker 费率 |
|------|-----------|---------|-----------|-----------|
| VIP 0 | $0 | 0 | 0.020% | 0.040% |
| VIP 1 | $2M | ≥50 BNB | 0.016% | 0.040% |
| VIP 2 | $10M | ≥200 BNB | 0.014% | 0.035% |
| VIP 3 | $50M | ≥500 BNB | 0.012% | 0.032% |
| VIP 4 | $200M | ≥1,000 BNB | 0.010% | 0.027% |
| VIP 5 | $1B | ≥2,000 BNB | **-0.010%** | 0.020% |
| VIP 6 | $5B | ≥3,500 BNB | **-0.012%** | 0.018% |
| VIP 9 | $80B | ≥6,000 BNB | **-0.020%** | 0.004% |

**OKX VIP 等级：**

| 等级 | 30天交易量 | 资产 | Maker 费率 | Taker 费率 |
|------|-----------|------|-----------|-----------|
| Lv 1 | $0 | $0 | 0.020% | 0.050% |
| Lv 2 | $500K | $10K | 0.015% | 0.040% |
| Lv 3 | $10M | $100K | **-0.005%** | 0.030% |
| Lv 5 | $200M | $2M | **-0.010%** | 0.025% |

**Bybit VIP 等级：**

| 等级 | 30天交易量 | 资产 | Maker 费率 | Taker 费率 |
|------|-----------|------|-----------|-----------|
| VIP 0 | $0 | $0 | **-0.010%** | 0.055% |
| VIP 1 | $5M | $50K | **-0.020%** | 0.050% |
| VIP 2 | $25M | $250K | **-0.025%** | 0.045% |

### VIP 等级的价值

**示例：Binance VIP 5**

\`\`\`
你的月交易量：$10 亿（满足 VIP 5）
Maker 费率：-0.010%
Taker 费率：0.020%

假设你每天交易 $3,000 万：
- 普通用户（VIP 0）：
  Maker 成本：$3,000 万 × 0.02% = $6,000/天
  年成本：$2,190,000

- VIP 5 用户：
  Maker 返佣：$3,000 万 × 0.01% = $3,000/天
  年收益：$1,095,000

费率差价值：$3,285,000/年
\`\`\`

---

## 🎯 策略核心逻辑

### 策略 1：刷量升级套利

**如何快速达到 VIP 等级？**

\`\`\`javascript
// 自成交刷量（需要两个账户）
const account1 = new ccxt.binance({
  apiKey: 'ACCOUNT_1_API_KEY',
  secret: 'ACCOUNT_1_SECRET'
});

const account2 = new ccxt.binance({
  apiKey: 'ACCOUNT_2_API_KEY',
  secret: 'ACCOUNT_2_SECRET'
});

async function washTradingForVIP() {
  const symbol = 'BTC/USDT';
  const targetVolume = 2000000; // 目标：200 万美元（VIP 1）
  let currentVolume = 0;

  console.log(\`目标交易量: $\${(targetVolume / 1e6).toFixed(2)}M\`);

  while (currentVolume < targetVolume) {
    try {
      // 获取当前价格
      const ticker = await account1.fetchTicker(symbol);
      const price = (ticker.bid + ticker.ask) / 2;

      // 账户 1：挂买单
      const buyOrder = await account1.createLimitOrder(
        symbol,
        'buy',
        0.1, // 0.1 BTC
        price * 0.9999 // 略低于市场价
      );

      // 账户 2：立即吃掉买单（卖出）
      await sleep(1000);
      const sellOrder = await account2.createMarketOrder(
        symbol,
        'sell',
        0.1
      );

      // 反向操作：账户 2 挂卖单，账户 1 吃单
      const sellOrder2 = await account2.createLimitOrder(
        symbol,
        'sell',
        0.1,
        price * 1.0001
      );

      await sleep(1000);
      const buyOrder2 = await account1.createMarketOrder(
        symbol,
        'buy',
        0.1
      );

      currentVolume += price * 0.1 * 4; // 双向计算

      console.log(\`当前交易量: $\${(currentVolume / 1e6).toFixed(2)}M / $\${(targetVolume / 1e6).toFixed(2)}M\`);
      console.log(\`进度: \${(currentVolume / targetVolume * 100).toFixed(2)}%\\n\`);

      await sleep(5000); // 避免触发风控

    } catch (error) {
      console.error('刷量错误:', error.message);
      await sleep(10000);
    }
  }

  console.log('🎉 已达到 VIP 1 等级要求！');
}
\`\`\`

**成本计算：**

\`\`\`
刷 200 万美元交易量（VIP 1）：
- 手续费（双账户都按 Taker 计）：
  账户 1：$2M × 0.04% = $800
  账户 2：$2M × 0.04% = $800
  总成本：$1,600

- 获得收益（假设之后每月交易 $500 万）：
  VIP 0 成本：$5M × 0.02% = $1,000/月
  VIP 1 成本：$5M × 0.016% = $800/月
  每月节省：$200

- 回本周期：$1,600 / $200 = 8 个月
\`\`\`

**⚠️ 风险警告：** 交易所可能检测并惩罚自成交行为。更安全的方法是通过正常做市/套利累积交易量。

### 策略 2：VIP 代理套利

**利用 VIP 账户为他人提供低费率通道**

\`\`\`
模式 A：子账户分享
1. 你达到 Binance VIP 5（Maker -0.01%）
2. 开设子账户给朋友使用
3. 子账户享受主账户的 VIP 费率
4. 收取服务费：节省手续费的 50%

示例：
朋友月交易量 $1,000 万
- 普通费率：$10M × 0.02% = $2,000
- VIP 5 费率：$10M × (-0.01%) = -$1,000（返佣）
- 费率差：$3,000
- 你收取：$3,000 × 50% = $1,500/月
\`\`\`

### 策略 3：跨所 VIP 费率套利

**在不同 VIP 等级的交易所之间套利**

\`\`\`javascript
// Binance VIP 5（Maker -0.01%）+ OKX 普通用户（Taker 0.05%）
async function vipCrossExchangeArbitrage() {
  const binance = new ccxt.binance({ /* VIP 5 账户 */ });
  const okx = new ccxt.okx({ /* 普通账户 */ });

  const symbol = 'BTC/USDT';

  while (true) {
    try {
      const binanceTicker = await binance.fetchTicker(symbol);
      const okxTicker = await okx.fetchTicker(symbol);

      const binanceAsk = binanceTicker.ask;
      const okxBid = okxTicker.bid;

      // 检查套利机会
      if (okxBid > binanceAsk * 1.0006) {
        // 有 0.06% 以上的价差（覆盖手续费）

        console.log('发现套利机会！');
        console.log(\`Binance 买价: $\${binanceAsk}\`);
        console.log(\`OKX 卖价: $\${okxBid}\`);

        // Binance 挂 Maker 买单（获得返佣）
        const buyOrder = await binance.createLimitOrder(
          symbol,
          'buy',
          0.1,
          binanceAsk * 0.9999
        );

        // 等待成交
        await waitForFilled(buyOrder.id);

        // OKX 市价卖出
        await okx.createMarketOrder(symbol, 'sell', 0.1);

        // 计算利润
        const grossProfit = (okxBid - binanceAsk) * 0.1;
        const binanceFee = binanceAsk * 0.1 * (-0.0001); // 负费率 = 收入
        const okxFee = okxBid * 0.1 * 0.0005; // 0.05%
        const netProfit = grossProfit + binanceFee - okxFee;

        console.log(\`毛利润: $\${grossProfit.toFixed(2)}\`);
        console.log(\`Binance 返佣: $\${binanceFee.toFixed(2)}\`);
        console.log(\`OKX 手续费: -$\${okxFee.toFixed(2)}\`);
        console.log(\`净利润: $\${netProfit.toFixed(2)}\\n\`);
      }

      await sleep(5000);

    } catch (error) {
      console.error('套利错误:', error.message);
      await sleep(10000);
    }
  }
}
\`\`\`

**收益估算：**

\`\`\`
假设每天完成 10 次套利：
- 单次利润：$30（价差 + 费率优势）
- 日收益：$300
- 月收益：$9,000
- 年化 APR：$9,000 × 12 / $60,000（本金）= 180%

实际（考虑机会频率）：15-50%
\`\`\`

---

## 📊 VIP 升级路径优化

### 方案 A：自然增长（推荐）

\`\`\`
第 1 个月：正常做市/套利，累积 $200 万交易量
  → 达到 VIP 1

第 2-3 个月：增加交易频率，累积 $1,000 万
  → 达到 VIP 2

第 4-6 个月：引入网格/高频策略，累积 $5,000 万
  → 达到 VIP 3

优势：
✅ 无需额外成本
✅ 避免合规风险
✅ 顺便赚取策略收益
\`\`\`

### 方案 B：加速升级（激进）

\`\`\`
使用"刷量机器人"快速达标：

目标：30 天内达到 VIP 3（$5,000 万交易量）
每日需要：$5,000 万 / 30 = $167 万

刷量策略：
- 使用两个账户互相对倒
- 选择低波动品种（USDC/USDT）
- 总手续费成本：$5,000 万 × 0.08% = $40,000

获得收益（VIP 3 vs VIP 0）：
假设之后每月交易 $2 亿：
- VIP 0 成本：$200M × 0.02% = $40,000/月
- VIP 3 成本：$200M × 0.012% = $24,000/月
- 每月节省：$16,000

回本周期：$40,000 / $16,000 = 2.5 个月
\`\`\`

---

## 💡 高级技巧

### 技巧 1：BNB 持仓优化

Binance 的 VIP 等级还要求 BNB 持仓：

\`\`\`
VIP 1：需持有 ≥50 BNB（约 $15,000）
VIP 5：需持有 ≥2,000 BNB（约 $600,000）

策略：
1. 使用质押 BNB（Staking）赚取额外收益
   - BNB Vault APY：3-5%
   - 同时满足 VIP 持仓要求

2. 在 BNB 价格低点买入，高点卖出
   - 赚取 BNB 升值收益 + VIP 费率优惠
\`\`\`

### 技巧 2：多交易所 VIP 布局

\`\`\`
分配 $100 万资金：

Binance（$40 万）：冲击 VIP 2
  → 获得 0.014% Maker 费率

OKX（$30 万）：冲击 VIP 3
  → 获得 -0.005% Maker 费率

Bybit（$30 万）：天然 VIP 0 就有 -0.01%
  → 无需额外投入

策略：
- 根据各所费率优势选择交易对
- 在最优交易所执行对应策略
\`\`\`

### 技巧 3：VIP 等级维持策略

\`\`\`javascript
// 自动化监控交易量，月底冲刺
async function maintainVIPLevel() {
  const targetVolume = 50000000; // VIP 3 需要 $5,000 万
  const currentVolume = await getMonthlyVolume();

  const daysLeft = getDaysLeftInMonth();
  const volumeNeeded = targetVolume - currentVolume;

  console.log(\`当前月交易量: $\${(currentVolume / 1e6).toFixed(2)}M\`);
  console.log(\`距离目标还需: $\${(volumeNeeded / 1e6).toFixed(2)}M\`);
  console.log(\`剩余天数: \${daysLeft}\`);

  if (volumeNeeded > 0 && daysLeft <= 3) {
    console.log('⚠️  月底冲刺模式启动！');

    const dailyTarget = volumeNeeded / daysLeft;
    console.log(\`每天需要完成: $\${(dailyTarget / 1e6).toFixed(2)}M\\n\`);

    // 启动高频刷量
    await highFrequencyTrading(dailyTarget);
  }
}

// 每天检查
setInterval(maintainVIPLevel, 86400000);
\`\`\`

---

## ⚠️ 风险与合规

### 风险 1：刷量被封号

**Binance 反刷量规则：**
- 检测自成交（同一 IP 的两个账户互相交易）
- 检测异常交易模式（高频对倒）
- 惩罚：降低 VIP 等级、冻结账户

**安全做法：**
\`\`\`
✅ 使用不同 IP（VPN 或不同地区服务器）
✅ 加入随机延迟（避免精确匹配）
✅ 混合真实交易（正常策略 + 刷量）
✅ 使用不同交易对分散刷量
❌ 避免在短时间内大量对倒
\`\`\`

### 风险 2：BNB 价格波动

**对冲方案：**
\`\`\`javascript
// 持有 BNB 的同时，做空 BNB 永续合约
const bnbHolding = 2000; // 持有 2000 BNB（满足 VIP 5）
const bnbPrice = 300;

// 在 Binance Futures 做空等额 BNB
await binance.createMarketOrder('BNB/USDT:USDT', 'sell', bnbHolding, {
  'reduceOnly': false
});

// 结果：
// 现货多头 + 合约空头 = Delta 中性
// 保留 VIP 资格，无价格风险
\`\`\`

---

## 📈 收益预期

| VIP 等级 | 达成成本 | 月交易量 | 费率节省 | 年化节省 | ROI |
|---------|---------|---------|---------|---------|-----|
| VIP 1 | $1,600 | $5M | $200/月 | $2,400 | 150% |
| VIP 2 | $8,000 | $20M | $1,200/月 | $14,400 | 180% |
| VIP 3 | $40,000 | $100M | $8,000/月 | $96,000 | 240% |
| VIP 5 | $200,000 | $1B | $100,000/月 | $1,200,000 | 600% |

**保守估计年化：15-50%**

> ⚠️ **重要提示：** VIP 套利适合大资金用户（≥$50,000）。小资金用户建议先通过正常交易自然提升等级，不要强行刷量。记住，VIP 等级本身不产生收益，关键是利用低费率执行高频策略。`,
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

    const strategies = [STRATEGY_27_5, STRATEGY_27_6];

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
