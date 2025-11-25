const axios = require('axios');

// ========================
// 策略 18.5: 稳定币跨所溢价套利
// ========================
const STRATEGY_18_5 = {
  title: '稳定币跨所溢价套利 - DEX vs CEX 价差套利',
  slug: 'depeg-arbitrage-18-5-cross-platform-stablecoin-arbitrage',
  category: 'depeg-arbitrage',
  category_l1: 'arbitrage',
  category_l2: '稳定币脱锚',
  summary: '在 DEX 购买折价稳定币,转移到 CEX 以 1:1 价格卖出或提现。低风险,单次收益 0.5-2%。',
  content: `## 📖 故事：2023年3月 USDC 脱锚时的跨平台套利

**DEX vs CEX 的价格差异**

2023 年 3 月 11 日,USDC 因 SVB 银行倒闭脱锚至 $0.88。

深圳玩家小刘发现了一个有趣的现象：

**价格对比：**
- **Curve USDC 价格**：$0.88（恐慌性抛售）
- **Binance USDC 价格**：$0.92（相对稳定）
- **OTC 提现价格**：$0.95（1:1 提现到银行卡）
- **价差**：最高 7.95%！

小刘立即行动：

**套利路径 1：Curve → Binance**

\`\`\`
1. Curve 买入 50,000 USDC（成本 44,000 USDT）
2. 提币到 Binance（Gas 费 30 USDT）
3. Binance 卖出 USDC（价格 $0.92,获得 46,000 USDT）
4. 净利润: 46,000 - 44,000 - 30 = 1,970 USDT（4.5%）
\`\`\`

**套利路径 2：Curve → OTC 提现**

\`\`\`
1. Curve 买入 50,000 USDC（成本 44,000 USDT）
2. 通过 OTC 提现到银行卡（1:1,手续费 2%）
3. 获得 49,000 USD
4. 净利润: 49,000 - 44,000 = 5,000 USD（11.4%）
\`\`\`

**48小时成果：**
- 总套利次数：8 次
- 总投入：35 万 USDT
- **总收益**：1.6 万 USDT（4.6%）

---

## 🧭 什么是跨平台稳定币套利？

**定义**：利用 DEX 和 CEX 之间的稳定币价格差异,在低价平台买入,高价平台卖出。

### 为什么会有价差？

| 原因 | 说明 |
|-----|------|
| **流动性差异** | DEX 流动性低,恐慌时价格波动大 |
| **用户群体不同** | DEX 用户更恐慌,CEX 用户相对理性 |
| **提现渠道** | CEX 支持法币提现,价格更接近 $1.00 |
| **套利延迟** | 跨链需要时间,价差持续 10-60 分钟 |

### 常见价差场景

| 场景 | DEX 价格 | CEX 价格 | 价差 | 持续时间 |
|-----|---------|---------|------|---------|
| **恐慌抛售** | $0.88-0.95 | $0.92-0.98 | 2-5% | 2-24 小时 |
| **流动性枯竭** | $0.95-0.98 | $0.99-1.00 | 1-2% | 持续存在 |
| **跨链延迟** | $0.98-0.99 | $1.00 | 1-2% | 10-60 分钟 |

---

## ✅ 适合人群

| 条件 | 要求 |
|-----|------|
| **资金量** | 5,000 美元以上 |
| **技术能力** | 熟悉 MetaMask、DEX 操作 |
| **Gas 费储备** | 100-300 USDT |
| **风险承受** | 低（几乎无风险） |

**核心能力**：DeFi 操作 + 快速执行

---

## 📋 完整操作步骤

### 步骤 1：监控价差

**实时价格对比：**

| 平台 | 查询地址 | 价格示例 |
|-----|---------|---------|
| **Curve 3pool** | https://curve.fi/#/ethereum/pools/3pool | USDC = $0.985 |
| **Binance** | https://www.binance.com/en/trade/USDC_USDT | USDC = $0.995 |
| **价差** | - | +1.02% |

**监控工具：**

| 工具 | 功能 | 推荐指数 |
|-----|------|---------|
| **CoinGecko** | 聚合价格 | ⭐⭐⭐⭐ |
| **DeFi Llama** | DEX 价格监控 | ⭐⭐⭐⭐⭐ |
| **自建脚本** | 实时对比价格 | ⭐⭐⭐⭐⭐ |

**价格监控脚本：**

\`\`\`javascript
const { ethers } = require('ethers');
const axios = require('axios');

async function monitorPriceSpread() {
  // 获取 Curve 价格
  const curvePrice = await getCurvePrice('USDC');

  // 获取 Binance 价格
  const binancePrice = await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=USDCUSDT');
  const binanceUSDC = parseFloat(binancePrice.data.price);

  // 计算价差
  const spread = (binanceUSDC - curvePrice) / curvePrice * 100;

  if (spread > 0.5) {
    console.log(\`🔔 套利机会: Curve $\${curvePrice} → Binance $\${binanceUSDC} (+\${spread.toFixed(2)}%)\`);
  }
}

setInterval(monitorPriceSpread, 30000); // 每 30 秒检查
\`\`\`

### 步骤 2：在 DEX 买入折价稳定币

**操作流程（Curve）：**

1. **访问 Curve 3pool**
   - 网址：https://curve.fi/#/ethereum/pools/3pool/swap
   - 连接 MetaMask

2. **兑换 USDT → USDC**
   \`\`\`
   输入: 10,000 USDT
   输出: 10,152 USDC（假设价格 $0.985）
   滑点: 0.5%
   Gas 费: 25 USDT
   \`\`\`

3. **确认交易**
   - 等待 1-3 分钟确认

**使用 Arbitrum 降低 Gas 费：**

| 网络 | Gas 费 | 推荐指数 |
|-----|--------|---------|
| **Ethereum** | 25-50 USDT | ⭐⭐⭐ |
| **Arbitrum** | 0.5-2 USDT | ⭐⭐⭐⭐⭐ |
| **Optimism** | 1-3 USDT | ⭐⭐⭐⭐ |

### 步骤 3：转移到 CEX 卖出

**方法 1：提币到 CEX 卖出**

\`\`\`
1. 在 MetaMask 发起提币
2. 选择网络: Arbitrum（降低 Gas 费）
3. 提币到 Binance 地址
4. 等待到账（5-15 分钟）
5. Binance 卖出 USDC 换 USDT
\`\`\`

**成本核算：**

\`\`\`
买入成本: 10,000 USDT
Curve Gas: 2 USDT（Arbitrum）
提币 Gas: 1 USDT
Binance 手续费: 10 USDT
总成本: 10,013 USDT

获得: 10,152 × 0.995 = 10,101 USDT
净利润: 10,101 - 10,013 = 88 USDT（0.88%）
\`\`\`

**方法 2：OTC 提现（更高收益）**

\`\`\`
1. Curve 买入 USDC（$0.985）
2. 联系 OTC 商家
3. 1:1 提现到银行卡（手续费 1-2%）
4. 净利润: 1.5% - 2% = -0.5% 到 +0.5%
\`\`\`

**注意**：OTC 提现需要大额（> 1 万 USDC）。

### 步骤 4：批量操作提升收益

**单次 vs 批量：**

| 策略 | 单次收益 | Gas 费 | 净收益 |
|-----|---------|--------|--------|
| **单次 5,000 USDC** | 50 USDT | 30 USDT | 20 USDT（0.4%） |
| **批量 50,000 USDC** | 500 USDT | 30 USDT | 470 USDT（0.94%） |

**结论**：大额套利可降低 Gas 费占比。

### 步骤 5：自动化执行

**完整自动化脚本：**

\`\`\`javascript
async function executeArbitrage() {
  const curvePrice = await getCurvePrice('USDC');
  const binancePrice = await getBinancePrice('USDC');
  const spread = (binancePrice - curvePrice) / curvePrice;

  if (spread > 0.005) { // 价差 > 0.5%
    console.log('发现套利机会,开始执行...');

    // 1. Curve 买入 USDC
    await curveSwap(10000, 'USDT', 'USDC');

    // 2. 提币到 Binance
    await withdrawToBinance('USDC', 10152);

    // 3. 等待到账
    await sleep(600000); // 10 分钟

    // 4. Binance 卖出
    await binanceSell('USDC', 10152);

    console.log('套利完成!');
  }
}

setInterval(executeArbitrage, 300000); // 每 5 分钟检查
\`\`\`

---

## 💡 进阶技巧

### 技巧 1：反向套利

当 CEX 价格低于 DEX：

\`\`\`
1. Binance 买入 USDC（$0.985）
2. 提币到链上
3. Curve 卖出 USDC（$0.995）
4. 净利润: 1%
\`\`\`

**适用场景**：Binance 恐慌性抛售时。

### 技巧 2：三角套利

利用多个稳定币价差：

\`\`\`
USDT → USDC（Curve,折价） → DAI（1:1） → USDT（Curve,溢价）
\`\`\`

**示例：**

\`\`\`
1. 10,000 USDT → 10,152 USDC（Curve,$0.985）
2. 10,152 USDC → 10,152 DAI（PSM,1:1）
3. 10,152 DAI → 10,203 USDT（Curve,$1.005）
4. 净利润: 203 USDT（2.03%）
\`\`\`

### 技巧 3：利用提现渠道套利

当 USDC 在 Curve = $0.95,但可通过 Coinbase 1:1 提现：

\`\`\`
1. Curve 买入 100,000 USDC（成本 $95,000）
2. 提币到 Coinbase
3. Coinbase 1:1 提现到银行卡（手续费 1%）
4. 获得 $99,000
5. 净利润: $4,000（4.2%）
\`\`\`

### 技巧 4：监控流动性池失衡

Curve 3pool 的稳定币比例失衡时,价格会偏离：

\`\`\`
正常比例: USDT 33% | USDC 33% | DAI 34%
失衡比例: USDT 20% | USDC 50% | DAI 30%

→ USDC 供应过多,价格折价
→ USDT 供应不足,价格溢价

套利机会: 用 USDT 买入 USDC（折价）
\`\`\`

**查看池子比例：**

访问：https://curve.fi/#/ethereum/pools/3pool

---

## ⚠️ 风险警告

### 风险 1：Gas 费波动

以太坊 Gas 费可能突然暴涨,吞噬利润。

**应对**：
- 使用 Arbitrum/Optimism
- 只在价差 > 1% 时操作

### 风险 2：价差瞬间消失

大额套利可能推平价差。

**应对**：
- 快速执行（5 分钟内完成）
- 分批操作

### 风险 3：提币延迟

CEX 提币可能延迟 30-60 分钟。

**应对**：
- 提前在两端都准备资金
- 使用快速提币通道

### 风险 4：稳定币真的脱锚

如果 USDC 永久脱锚,可能亏损。

**应对**：
- 只在恐慌折价时操作
- 设置止损（< $0.90）

---

## ❓ 常见问题

**Q1：还有多少套利空间？**

A：
- 正常时期：价差 0.1-0.5%（覆盖 Gas 费困难）
- 恐慌时期：价差 1-5%（有套利空间）
- 黑天鹅：价差 5-10%+（重大机会）

**Q2：需要多少本金？**

A：
- 最低：5,000 USDC（仅 Arbitrum）
- 推荐：2-5 万 USDC（降低 Gas 费占比）
- 大户：10 万 USDC 以上（OTC 提现）

**Q3：哪个网络最便宜？**

A：
- Arbitrum：Gas 费 0.5-2 USDT（推荐）
- Optimism：Gas 费 1-3 USDT
- Ethereum：Gas 费 25-50 USDT（太贵）

**Q4：可以长期持有 USDC 吗？**

A：不建议。买入后应立即：
- 转到 CEX 卖出,或
- OTC 提现

避免价格继续下跌。

**Q5：自动化安全吗？**

A：
- 小额测试（100-500 USDC）
- 设置止损
- 监控程序运行状态

---

## 📚 总结

**跨平台稳定币套利 = DEX 买入 + CEX 卖出 + 快速执行**

### 核心要点

| 要点 | 说明 |
|-----|------|
| **价差监控** | Curve vs Binance,价差 > 0.5% |
| **网络选择** | 优先 Arbitrum（降低 Gas 费） |
| **执行速度** | 5 分钟内完成买入 + 提币 + 卖出 |
| **批量操作** | 大额降低 Gas 费占比 |
| **风险控制** | 快速执行,避免价差消失 |

### 适合人群

✅ 熟悉 DeFi 操作的玩家
✅ 有 5,000 USDC 以上本金
✅ 能快速执行的投资者

❌ DeFi 新手
❌ 小额资金（Gas 费占比过高）

### 预期收益

- **正常时期**：0.1-0.5%（几乎无利润）
- **恐慌时期**：1-3%（有套利空间）
- **黑天鹅**：3-10%+（重大机会）

### 下一步行动

- [ ] 开通 MetaMask + Binance 账户
- [ ] 准备 5,000 USDC 本金 + 100 USDT Gas 费
- [ ] 熟悉 Curve、Arbitrum 操作
- [ ] 编写价格监控脚本
- [ ] 小额测试（500 USDC）

**最后提醒**：跨平台稳定币套利几乎无风险,但需要熟悉 DeFi 操作。新手建议先小额测试,熟练后再增加本金。`,

  steps: [
    '监控价差（Curve vs Binance,价差 > 0.5%）',
    '在 DEX 买入折价稳定币（Curve,使用 Arbitrum）',
    '转移到 CEX 卖出（提币到 Binance,卖出换 USDT）',
    '批量操作提升收益（大额降低 Gas 费占比）',
    '自动化执行（编写监控脚本,24/7 运行）'
  ],

  risk_level: 2,
  apy_min: 5,
  apy_max: 50,
  min_investment: 5000,
  difficulty_level: 'intermediate',
  time_commitment: 'active',

  required_tools: [
    'MetaMask 钱包',
    'Binance 账户',
    'Curve Finance',
    'Arbitrum 网络',
    '5,000 USDC 本金 + 100 USDT Gas 费',
    '价格监控脚本'
  ],

  status: 'published',
  reading_time_minutes: 18
};

// ========================
// 策略 18.6: Curve 3pool 不平衡套利
// ========================
const STRATEGY_18_6 = {
  title: 'Curve 3pool 不平衡套利 - 流动性池套利指南',
  slug: 'depeg-arbitrage-18-6-curve-3pool-imbalance-arbitrage',
  category: 'depeg-arbitrage',
  category_l1: 'arbitrage',
  category_l2: '稳定币脱锚',
  summary: '监控 Curve 3pool 的资产比例不平衡,通过添加/移除流动性套利。低风险,持续性收益 0.5-2%。',
  content: `## 📖 故事：一个 LP 提供者的被动收入

**流动性池不平衡中的套利机会**

上海 DeFi 玩家小张在 2023 年 3 月发现了一个稳定的套利方式：

**正常情况下 Curve 3pool 比例：**
- USDT：33.33%
- USDC：33.33%
- DAI：33.34%

**SVB 事件后（2023.03.11）：**
- USDT：45%（供应不足,溢价）
- USDC：25%（恐慌抛售,折价）
- DAI：30%

小张立即行动：

**套利操作：**

\`\`\`
1. 单边添加流动性（只存 USDC）
   - 存入: 100,000 USDC（价格 $0.88）
   - 获得 LP Token: 价值 $110,000（获得奖励）

2. 等待池子平衡（24-48 小时）
   - USDC 比例回升至 33%
   - USDC 价格回升至 $0.99

3. 移除流动性
   - 赎回: 50,000 USDT + 50,000 USDC
   - 价值: $50,000 + $49,500 = $99,500

4. 卖出 USDC 换 USDT
   - 50,000 USDC → 49,500 USDT
   - 总计: 99,500 USDT

5. 加上交易费收益
   - 24h 交易费: 0.3% APY × 2 天 = 16 USDT
   - 总收益: -500 + 16 = -484 USDT
\`\`\`

**等等,亏了？！**

小张发现单纯靠这个策略亏损,但他进一步优化：

**优化后策略：**

\`\`\`
1. 只在严重失衡时添加流动性（USDC < 25%）
2. 不移除流动性,而是单边提取溢价币种
3. 持续赚取交易费（0.04% 每笔交易）
4. 利用 Curve 投票奖励（veCRV）
\`\`\`

**优化后收益：**
- 交易费收益：年化 5-15%
- 不平衡奖励：额外 2-5%
- **总收益**：年化 7-20%

---

## 🧭 什么是 Curve 不平衡套利？

**定义**：利用 Curve 稳定币池（如 3pool）的资产比例失衡,通过单边添加/移除流动性获利。

### Curve 3pool 原理

**3pool 组成：**
- USDT：33.33%
- USDC：33.33%
- DAI：33.34%

**不平衡奖励机制：**

\`\`\`
正常比例: 每种币 33.33%
失衡比例: USDT 45% | USDC 25% | DAI 30%

添加流动性奖励:
- 添加 USDC（稀缺）: 获得 1.1x LP Token（奖励 10%）
- 添加 USDT（过剩）: 获得 0.95x LP Token（惩罚 5%）

移除流动性:
- 移除 USDC（稀缺）: 需要燃烧 1.1x LP Token（惩罚 10%）
- 移除 USDT（过剩）: 需要燃烧 0.95x LP Token（奖励 5%）
\`\`\`

---

## ✅ 适合人群

| 条件 | 要求 |
|-----|------|
| **资金量** | 1 万美元以上 |
| **技术能力** | 熟悉 Curve、LP 操作 |
| **风险承受** | 低（无常损失风险） |
| **时间承诺** | 被动（长期持有 LP） |

**核心能力**：DeFi 操作 + 耐心持有

---

## 📋 完整操作步骤

### 步骤 1：监控池子平衡度

**查看 Curve 3pool 比例：**

访问：https://curve.fi/#/ethereum/pools/3pool/deposit

\`\`\`
当前比例:
- USDT: 45.2%（过剩）
- USDC: 24.8%（稀缺）
- DAI: 30.0%

结论: USDC 严重稀缺,添加 USDC 可获奖励
\`\`\`

**判断标准：**

| 偏离度 | 操作建议 |
|-------|---------|
| **< 5%**（31-35%） | 正常,无套利空间 |
| **5-10%**（25-30% 或 35-40%） | 小幅失衡,可小仓位 |
| **> 10%**（< 25% 或 > 40%） | 严重失衡,重仓机会 |

### 步骤 2：单边添加流动性

**操作流程：**

1. **访问 Curve 3pool**
   - 网址：https://curve.fi/#/ethereum/pools/3pool/deposit
   - 连接 MetaMask

2. **选择单币种存入**
   \`\`\`
   币种选择: USDC（稀缺币种）
   数量: 50,000 USDC
   预期获得 LP: 55,000 LP Token（奖励 10%）
   \`\`\`

3. **确认交易**
   - Gas 费：15-30 USDT
   - 等待 1-3 分钟

**重要**：只添加稀缺币种,避免添加过剩币种！

### 步骤 3：持有 LP 赚取交易费

**交易费收益：**

\`\`\`
Curve 3pool 交易费: 0.04% 每笔交易
24h 交易量: 5 亿美元
年化交易量: 1,825 亿美元

年化交易费: 1,825 亿 × 0.04% = 7.3 亿美元
池子 TVL: 40 亿美元
年化收益率: 7.3 亿 ÷ 40 亿 = 18.25%

实际收益率: 5-15%（考虑竞争）
\`\`\`

**收益来源：**

| 来源 | 年化收益 |
|-----|---------|
| **交易费** | 5-15% |
| **CRV 奖励** | 2-8%（需锁仓 veCRV） |
| **不平衡奖励** | 一次性 5-10% |
| **总收益** | **12-33%** |

### 步骤 4：单边移除流动性

**时机选择：**

1. **池子重新平衡**（稀缺币种回到 33%）
2. **稀缺币种变为过剩**（> 40%）

**操作流程：**

\`\`\`
1. 访问 Curve 3pool 移除流动性
2. 选择: 单币种移除（选择过剩币种）
3. 移除: 55,000 LP Token
4. 获得: 60,000 USDT（奖励 9%）
\`\`\`

**收益核算：**

\`\`\`
初始投入: 50,000 USDC（价格 $0.88）= $44,000
获得 LP: 55,000（奖励 10%）

移除获得: 60,000 USDT
价值: $60,000

净利润:
- 不平衡奖励: $6,000（添加 + 移除）
- 交易费: $1,200（持有 30 天）
- 总收益: $7,200（16.4%）

扣除成本:
- Gas 费: $50
- USDC 脱锚损失: $6,000（如果 USDC 永久脱锚）
- 净收益: $1,150（如果 USDC 回锚）
\`\`\`

### 步骤 5：自动化监控

**监控脚本：**

\`\`\`javascript
async function monitor3poolBalance() {
  const poolBalance = await get3poolBalance();

  const usdtRatio = poolBalance.usdt / poolBalance.total;
  const usdcRatio = poolBalance.usdc / poolBalance.total;
  const daiRatio = poolBalance.dai / poolBalance.total;

  if (usdcRatio < 0.25) {
    console.log(\`🔔 USDC 严重稀缺 (\${(usdcRatio*100).toFixed(1)}%),建议添加 USDC 流动性\`);
  }

  if (usdtRatio > 0.40) {
    console.log(\`🔔 USDT 严重过剩 (\${(usdtRatio*100).toFixed(1)}%),建议移除 USDT\`);
  }
}

setInterval(monitor3poolBalance, 3600000); // 每小时检查
\`\`\`

---

## 💡 进阶技巧

### 技巧 1：利用 veCRV 提升收益

锁仓 CRV 获得 veCRV,提升 LP 收益：

\`\`\`
无 veCRV: 5% APY
锁仓 1 年: 12% APY（2.5x boost）
锁仓 4 年: 18% APY（最大 boost）
\`\`\`

**操作：**
1. 购买 CRV
2. 锁仓至 https://dao.curve.fi/locker
3. 享受收益提升

### 技巧 2：监控大额交易

大额交易会导致池子失衡：

\`\`\`
正常比例: USDT 33% | USDC 33% | DAI 34%

有人用 1 亿 USDC 换 USDT:
→ USDC 过剩（40%）
→ USDT 稀缺（26%）

套利机会: 添加 USDT 流动性
\`\`\`

**监控工具**：Etherscan、Curve Analytics

### 技巧 3：跨池套利

监控多个 Curve 池的失衡：

| 池子 | 失衡币种 | 奖励 |
|-----|---------|------|
| **3pool** | USDC 稀缺 | +10% |
| **FRAX pool** | FRAX 过剩 | +5% |
| **sUSD pool** | sUSD 稀缺 | +8% |

**策略**：同时在多个池添加流动性,分散风险。

### 技巧 4：利用 Convex 复投

将 Curve LP Token 质押到 Convex,自动复投收益：

\`\`\`
Curve 直接质押: 12% APY
通过 Convex: 15% APY（额外 CVX 奖励）
\`\`\`

---

## ⚠️ 风险警告

### 风险 1：无常损失

虽然是稳定币池,但仍有小幅无常损失。

**示例：**

\`\`\`
添加: 50,000 USDC（$0.88）
移除: 25,000 USDT + 25,000 USDC

如果 USDC 回锚至 $1.00:
- 应得: 50,000 USDC = $50,000
- 实得: 25,000 + 24,750 = $49,750
- 无常损失: $250（0.5%）
\`\`\`

### 风险 2：稳定币永久脱锚

如果 USDC 永久脱锚,可能亏损。

**应对**：
- 只在恐慌折价时添加流动性
- 设置止损（USDC < $0.85 移除流动性）

### 风险 3：Gas 费高

以太坊主网 Gas 费可能 > 50 USDT。

**应对**：
- 大额操作（> 5 万美元）
- 使用 Arbitrum/Optimism 的 Curve 池

### 风险 4：池子长期失衡

池子可能长期失衡,无法移除流动性。

**应对**：
- 持续赚取交易费（被动收益）
- 不急于移除,等待平衡

---

## ❓ 常见问题

**Q1：Curve 不平衡套利还有机会吗？**

A：
- 正常时期：偶尔失衡（每月 1-2 次）
- 黑天鹅：严重失衡（如 USDC 脱锚）
- 长期收益：持续赚取交易费

**Q2：需要多少本金？**

A：
- 最低：5,000 美元（仅 Arbitrum）
- 推荐：2-5 万美元（覆盖 Gas 费）
- 大户：10 万美元以上（最大化收益）

**Q3：需要锁仓 veCRV 吗？**

A：
- 可选,但推荐（提升收益 2-3 倍）
- 锁仓 1-4 年
- 需要购买 CRV（成本 500-2,000 美元）

**Q4：无常损失有多大？**

A：
- 稳定币池：通常 < 1%
- 恐慌时期：可能 2-5%
- 长期持有：交易费可覆盖无常损失

**Q5：可以长期持有吗？**

A：可以！适合作为被动收入：
- 交易费：年化 5-15%
- CRV 奖励：年化 2-8%
- 总收益：年化 7-23%

---

## 📚 总结

**Curve 不平衡套利 = 单边添加 + 持有 LP + 单边移除**

### 核心要点

| 要点 | 说明 |
|-----|------|
| **失衡监控** | 币种比例 < 25% 或 > 40% |
| **单边添加** | 只添加稀缺币种（获奖励） |
| **持有 LP** | 赚取交易费（年化 5-15%） |
| **单边移除** | 只移除过剩币种（获奖励） |
| **veCRV 提升** | 锁仓 CRV,收益 2-3 倍 |

### 适合人群

✅ 熟悉 Curve、LP 操作的玩家
✅ 有 1-5 万美元本金
✅ 能长期持有的投资者

❌ DeFi 新手
❌ 短期投机者

### 预期收益

- **一次性奖励**：5-10%（添加 + 移除）
- **交易费**：年化 5-15%
- **CRV 奖励**：年化 2-8%
- **总收益**：年化 12-33%

### 下一步行动

- [ ] 开通 MetaMask 钱包
- [ ] 准备 1-5 万美元本金
- [ ] 熟悉 Curve 3pool 操作
- [ ] 购买 CRV 并锁仓（可选）
- [ ] 编写失衡监控脚本

**最后提醒**：Curve 不平衡套利适合长期持有,赚取被动收益。短期套利收益有限,但长期持有可稳定赚取 12-33% 年化收益。`,

  steps: [
    '监控池子平衡度（币种比例 < 25% 或 > 40%）',
    '单边添加流动性（只添加稀缺币种）',
    '持有 LP 赚取交易费（年化 5-15%）',
    '单边移除流动性（只移除过剩币种）',
    '自动化监控（编写脚本,每小时检查）'
  ],

  risk_level: 2,
  apy_min: 12,
  apy_max: 33,
  min_investment: 10000,
  difficulty_level: 'intermediate',
  time_commitment: 'passive',

  required_tools: [
    'MetaMask 钱包',
    'Curve Finance',
    'veCRV（可选,提升收益）',
    '1-5 万美元本金',
    '失衡监控脚本'
  ],

  status: 'published',
  reading_time_minutes: 20
};

// ========================
// 认证和创建函数
// ========================
async function getAuthToken() {
  try {
    const response = await axios.post('http://localhost:8055/auth/login', {
      email: 'the_uk1@outlook.com',
      password: 'Mygcdjmyxzg2026!'
    });
    return response.data.data.access_token;
  } catch (error) {
    console.error('认证失败:', error.message);
    throw error;
  }
}

async function createStrategies() {
  console.log('认证中...');
  const token = await getAuthToken();
  console.log('认证成功，开始创建策略...\n');

  const strategies = [STRATEGY_18_5, STRATEGY_18_6];

  for (const strategy of strategies) {
    try {
      console.log(`正在创建策略 ${strategy.slug.includes('18-5') ? '18.5' : '18.6'}: ${strategy.title}...`);

      const response = await axios.post(
        'http://localhost:8055/items/strategies',
        strategy,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log(`✅ 策略 ${strategy.slug.includes('18-5') ? '18.5' : '18.6'} 创建成功! ID: ${response.data.data.id}`);
      console.log(`   标题: ${strategy.title}`);
      console.log(`   Slug: ${strategy.slug}\n`);

    } catch (error) {
      console.error(`❌ 创建策略失败:`, error.response?.data || error.message);
      throw error;
    }
  }

  // 获取总数
  try {
    const countResponse = await axios.get(
      'http://localhost:8055/items/strategies?fields=id&limit=-1',
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );

    const totalCount = countResponse.data.data.length;

    console.log('========================================');
    console.log('🎉 策略 18.5 和 18.6 创建完成！');
    console.log(`📊 当前数据库中共有 ${totalCount} 个策略`);
    console.log('========================================');

  } catch (error) {
    console.error('获取策略总数失败:', error.message);
  }
}

// 执行
createStrategies().catch(console.error);
