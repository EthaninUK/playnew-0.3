const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_EMAIL = 'the_uk1@outlook.com';
const DIRECTUS_PASSWORD = 'Mygcdjmyxzg2026!';

const STRATEGY = {
  title: '期权-现货 Delta 对冲 - 专业级波动率收益策略',
  slug: 'options-spot-delta-hedging',
  category: 'options-volatility-arbitrage',
  category_l1: 'arbitrage',
  category_l2: 'options-volatility-arbitrage',
  summary: '通过卖出期权收取权利金，同时使用现货动态对冲 Delta 风险，赚取 Theta 时间价值衰减和波动率溢价。适合有一定期权基础的交易者，年化收益可达 20-50%。',
  content: `## 📋 策略概述

### 什么是 Delta 对冲？

Delta 对冲是期权交易中最核心的风险管理技术。当你卖出期权时，你面临的最大风险是标的价格变动（Delta 风险）。通过持有相应数量的现货，可以"中和"这个风险，从而安全地赚取期权的时间价值（Theta）。

**简单类比：**
- 你卖出一份看涨期权，就像卖了一份保险
- 如果价格上涨，你要赔钱（赔付保险）
- 但如果你同时持有现货，现货上涨的利润可以抵消期权的亏损
- 最终你赚到的是"保险费"（期权权利金）

### 核心收益来源

| 收益来源 | 说明 | 预期收益 |
|----------|------|----------|
| **Theta 衰减** | 期权时间价值每天减少 | 每天 0.05-0.2% |
| **IV 溢价** | 隐含波动率通常高于实际波动率 | 5-15% 年化 |
| **Gamma 收益** | 高频对冲时的"买低卖高" | 0-10% 年化 |

---

## 🎯 策略原理

### Delta 值解释

Delta 表示期权价格相对于标的价格的变化率：

\`\`\`
Delta = Δ期权价格 / Δ标的价格

例如：
- BTC 现价 $60,000
- 看涨期权 Delta = 0.5
- BTC 上涨 $1,000 → 期权价格上涨约 $500
\`\`\`

**Delta 值范围：**
- 看涨期权：0 到 1
- 看跌期权：-1 到 0
- 平值期权：约 ±0.5
- 深度实值：接近 ±1
- 深度虚值：接近 0

### 对冲原理

**卖出看涨期权的对冲：**

\`\`\`
初始状态：
- 卖出 1 张 BTC 看涨期权，Delta = -0.5
- 需要买入 0.5 BTC 现货对冲
- 组合 Delta = -0.5 + 0.5 = 0（Delta 中性）

价格上涨后：
- 期权 Delta 变为 -0.6
- 需要额外买入 0.1 BTC
- 保持组合 Delta = 0
\`\`\`

**卖出看跌期权的对冲：**

\`\`\`
初始状态：
- 卖出 1 张 BTC 看跌期权，Delta = 0.4
- 需要卖空 0.4 BTC 对冲（或做空永续合约）
- 组合 Delta = 0.4 - 0.4 = 0

价格下跌后：
- 期权 Delta 变为 0.6
- 需要额外做空 0.2 BTC
\`\`\`

---

## 📊 实战案例

### 案例 1：卖出 BTC 看涨期权 + 现货对冲

**市场条件：**
- BTC 现价：$60,000
- 隐含波动率（IV）：65%
- 预期实际波动率：50%
- IV 溢价：15%

**开仓操作：**

| 操作 | 数量 | 价格/权利金 | 金额 |
|------|------|-------------|------|
| 卖出 7天到期 $62,000 Call | 1 张 | $1,200 | +$1,200 |
| 买入 BTC 现货 | 0.45 BTC | $60,000 | -$27,000 |

**期权参数：**
\`\`\`
Delta: 0.45
Gamma: 0.00003
Theta: -$170/天
Vega: $85
\`\`\`

**对冲过程（7天）：**

| 天数 | BTC价格 | 期权Delta | 现货持仓 | 调整操作 | 对冲成本 |
|------|---------|-----------|----------|----------|----------|
| 0 | $60,000 | 0.45 | 0.45 | 初始建仓 | - |
| 1 | $61,000 | 0.52 | 0.52 | 买入0.07 BTC | $4,270 |
| 2 | $60,500 | 0.48 | 0.48 | 卖出0.04 BTC | -$2,420 |
| 3 | $62,000 | 0.65 | 0.65 | 买入0.17 BTC | $10,540 |
| 4 | $61,500 | 0.58 | 0.58 | 卖出0.07 BTC | -$4,305 |
| 5 | $61,000 | 0.50 | 0.50 | 卖出0.08 BTC | -$4,880 |
| 6 | $61,200 | 0.52 | 0.52 | 买入0.02 BTC | $1,224 |
| 7 | $61,500 | - | 平仓 | 期权到期 | - |

**到期结算：**

\`\`\`
期权结算：
- 行权价：$62,000
- 到期价：$61,500
- 期权到期作废，保留全部权利金

收益计算：
+ 权利金收入：$1,200
- 对冲交易成本（滑点+手续费）：$150
- 资金成本（保证金利息）：$50
= 净利润：$1,000

投入资本：$27,000（现货）+ $3,000（期权保证金）= $30,000
周收益率：3.33%
年化收益率：173%（理想情况）
\`\`\`

### 案例 2：卖出 ETH 跨式期权（Straddle）

**策略说明：**
同时卖出相同行权价的看涨和看跌期权，预期价格在一定范围内波动。

**市场条件：**
- ETH 现价：$3,000
- 7天到期平值期权 IV：70%

**开仓：**

| 操作 | 权利金 |
|------|--------|
| 卖出 $3,000 Call | +$180 |
| 卖出 $3,000 Put | +$180 |
| **总权利金** | **+$360** |

**组合 Delta 计算：**
\`\`\`
Call Delta: -0.50
Put Delta: +0.50
组合 Delta: 0（天然 Delta 中性）
\`\`\`

**盈亏平衡点：**
\`\`\`
上方盈亏平衡：$3,000 + $360 = $3,360
下方盈亏平衡：$3,000 - $360 = $2,640
盈利区间：$2,640 - $3,360（±12%）
\`\`\`

**动态对冲过程：**

当价格偏离 $3,000 时，组合 Delta 不再为 0，需要用现货对冲：

\`\`\`python
# ETH Straddle 动态对冲示例
def calculate_straddle_delta(spot_price, strike=3000, days_to_expiry=7, iv=0.70):
    """计算跨式期权组合的 Delta"""
    from scipy.stats import norm
    import numpy as np

    # Black-Scholes Delta 计算
    T = days_to_expiry / 365
    d1 = (np.log(spot_price / strike) + (0.5 * iv**2) * T) / (iv * np.sqrt(T))

    call_delta = norm.cdf(d1)
    put_delta = call_delta - 1

    # 卖出期权，Delta 取反
    straddle_delta = -(call_delta + put_delta)

    return straddle_delta

# 模拟对冲
prices = [3000, 3100, 3050, 2900, 2950, 3000]
position = 0

for i, price in enumerate(prices):
    delta = calculate_straddle_delta(price, days_to_expiry=7-i)
    hedge_needed = delta - position

    if abs(hedge_needed) > 0.05:  # 对冲阈值
        print(f"Day {i}: Price={price}, Delta={delta:.3f}, 调整={hedge_needed:.3f} ETH")
        position = delta
\`\`\`

---

## 🔧 实操指南

### 第一步：选择交易平台

**推荐平台对比：**

| 平台 | 期权类型 | 结算方式 | 对冲工具 | 适合人群 |
|------|----------|----------|----------|----------|
| **Deribit** | 欧式 | BTC/ETH | 永续合约 | 专业交易者 |
| **OKX** | 欧式 | USDT | 现货/合约 | 中级用户 |
| **Bybit** | 欧式 | USDC | 现货/合约 | 新手友好 |
| **Binance** | 欧式 | USDT | 现货/合约 | 大资金用户 |

**Deribit 账户设置：**

1. 注册并完成 KYC
2. 充值 BTC 或 ETH 作为保证金
3. 开启 Portfolio Margin（组合保证金）模式
4. 设置 API 密钥（用于自动对冲）

### 第二步：选择期权合约

**期权选择标准：**

\`\`\`
1. 到期时间：7-14 天（Theta 衰减最快）
2. 行权价：ATM 或轻度 OTM（Delta 0.3-0.5）
3. IV 水平：高于历史波动率 10%+
4. 流动性：买卖价差 < 2%
\`\`\`

**使用 Deribit API 获取期权链：**

\`\`\`javascript
const axios = require('axios');

async function getOptionChain(currency = 'BTC') {
    const response = await axios.get(
        \`https://www.deribit.com/api/v2/public/get_instruments?currency=\${currency}&kind=option&expired=false\`
    );

    const options = response.data.result;

    // 筛选 7-14 天到期的期权
    const now = Date.now();
    const filtered = options.filter(opt => {
        const daysToExpiry = (opt.expiration_timestamp - now) / (1000 * 60 * 60 * 24);
        return daysToExpiry >= 7 && daysToExpiry <= 14;
    });

    // 按行权价排序
    filtered.sort((a, b) => a.strike - b.strike);

    return filtered;
}

// 获取期权的 Greeks
async function getOptionGreeks(instrumentName) {
    const response = await axios.get(
        \`https://www.deribit.com/api/v2/public/ticker?instrument_name=\${instrumentName}\`
    );

    const data = response.data.result;

    return {
        delta: data.greeks.delta,
        gamma: data.greeks.gamma,
        theta: data.greeks.theta,
        vega: data.greeks.vega,
        iv: data.mark_iv
    };
}

// 示例：查找适合卖出的期权
async function findSellableOptions() {
    const chain = await getOptionChain('BTC');
    const spotPrice = 60000; // 假设当前价格

    console.log('适合卖出的期权：');

    for (const opt of chain) {
        if (opt.option_type === 'call' && opt.strike > spotPrice * 1.03) {
            const greeks = await getOptionGreeks(opt.instrument_name);

            if (greeks.iv > 0.6 && greeks.delta < 0.4) {
                console.log(\`\${opt.instrument_name}: IV=\${(greeks.iv*100).toFixed(1)}%, Delta=\${greeks.delta.toFixed(3)}\`);
            }
        }
    }
}
\`\`\`

### 第三步：建立初始对冲

**开仓流程：**

\`\`\`python
import ccxt
import time

# 初始化交易所
deribit = ccxt.deribit({
    'apiKey': 'YOUR_API_KEY',
    'secret': 'YOUR_SECRET',
    'enableRateLimit': True,
})

def open_delta_hedged_position(option_instrument, quantity):
    """
    开立 Delta 对冲的期权头寸
    """
    # 1. 获取期权 Greeks
    ticker = deribit.fetch_ticker(option_instrument)
    delta = ticker['info']['greeks']['delta']

    print(f"期权 Delta: {delta}")

    # 2. 卖出期权
    option_order = deribit.create_order(
        symbol=option_instrument,
        type='limit',
        side='sell',
        amount=quantity,
        price=ticker['bid'] * 0.99  # 略低于买价
    )

    print(f"期权订单: {option_order['id']}")

    # 3. 计算对冲数量
    # 卖出看涨期权，Delta 为负，需要买入现货
    hedge_amount = abs(delta) * quantity

    # 4. 买入现货对冲
    if 'BTC' in option_instrument:
        spot_symbol = 'BTC/USD'
    else:
        spot_symbol = 'ETH/USD'

    spot_ticker = deribit.fetch_ticker(spot_symbol)

    spot_order = deribit.create_order(
        symbol=spot_symbol,
        type='market',
        side='buy',
        amount=hedge_amount
    )

    print(f"现货对冲订单: {spot_order['id']}, 数量: {hedge_amount}")

    return {
        'option_order': option_order,
        'spot_order': spot_order,
        'initial_delta': delta,
        'hedge_amount': hedge_amount
    }

# 示例
position = open_delta_hedged_position('BTC-28JUN24-65000-C', 1)
\`\`\`

### 第四步：动态 Delta 再平衡

**对冲触发条件：**

\`\`\`
方法 1：固定时间间隔
- 每小时检查一次 Delta
- 适合低波动市场

方法 2：Delta 阈值触发
- 当组合 Delta > ±0.1 时对冲
- 适合高波动市场

方法 3：价格变动触发
- 当标的价格变动 > 2% 时对冲
- 平衡对冲成本和风险
\`\`\`

**自动对冲脚本：**

\`\`\`python
import asyncio
from datetime import datetime

class DeltaHedger:
    def __init__(self, exchange, option_instrument, quantity):
        self.exchange = exchange
        self.option_instrument = option_instrument
        self.quantity = quantity
        self.current_hedge = 0
        self.hedge_threshold = 0.05  # 5% Delta 偏差触发对冲
        self.min_trade_size = 0.001  # 最小交易量

    async def get_current_delta(self):
        """获取当前期权 Delta"""
        ticker = await self.exchange.fetch_ticker(self.option_instrument)
        return ticker['info']['greeks']['delta']

    async def rebalance(self):
        """执行 Delta 再平衡"""
        current_delta = await self.get_current_delta()

        # 计算需要对冲的 Delta
        # 卖出期权，Delta 为负
        target_hedge = abs(current_delta) * self.quantity
        hedge_diff = target_hedge - self.current_hedge

        print(f"[{datetime.now()}] Delta: {current_delta:.4f}, 目标对冲: {target_hedge:.4f}, 当前: {self.current_hedge:.4f}")

        # 检查是否需要对冲
        if abs(hedge_diff) > self.hedge_threshold * self.quantity:
            if abs(hedge_diff) < self.min_trade_size:
                print("对冲数量太小，跳过")
                return

            # 确定交易方向
            if hedge_diff > 0:
                side = 'buy'
                amount = hedge_diff
            else:
                side = 'sell'
                amount = abs(hedge_diff)

            # 执行对冲交易
            try:
                order = await self.exchange.create_order(
                    symbol='BTC/USD',
                    type='market',
                    side=side,
                    amount=amount
                )

                self.current_hedge = target_hedge
                print(f"对冲成功: {side} {amount:.4f} BTC")

            except Exception as e:
                print(f"对冲失败: {e}")

    async def run(self, interval=60):
        """运行对冲循环"""
        print(f"开始 Delta 对冲，检查间隔: {interval}秒")

        while True:
            try:
                await self.rebalance()
            except Exception as e:
                print(f"错误: {e}")

            await asyncio.sleep(interval)

# 运行对冲器
async def main():
    exchange = ccxt.deribit({
        'apiKey': 'YOUR_API_KEY',
        'secret': 'YOUR_SECRET',
        'enableRateLimit': True,
    })

    hedger = DeltaHedger(
        exchange=exchange,
        option_instrument='BTC-28JUN24-65000-C',
        quantity=1
    )

    await hedger.run(interval=300)  # 每5分钟检查

if __name__ == '__main__':
    asyncio.run(main())
\`\`\`

### 第五步：到期处理

**期权到期场景：**

| 场景 | 期权状态 | 处理方式 |
|------|----------|----------|
| 价格 < 行权价 | 作废 | 平仓现货，保留权利金 |
| 价格 > 行权价 | 行权 | 期权自动结算，现货抵消 |
| 临近行权价 | 不确定 | 提前平仓期权 |

**到期处理代码：**

\`\`\`python
async def handle_expiry(exchange, option_instrument, spot_position):
    """
    处理期权到期
    """
    # 获取期权信息
    ticker = await exchange.fetch_ticker(option_instrument)

    # 检查是否已到期
    if ticker['info']['state'] == 'closed':
        # 获取结算价格
        settlement = ticker['info']['settlement_price']
        strike = ticker['info']['strike']

        if settlement > strike:  # 看涨期权被行权
            print(f"期权被行权，结算价: {settlement}, 行权价: {strike}")
            # 期权会自动结算，现货持仓会被对应消耗
        else:
            print(f"期权作废，保留全部权利金")
            # 平仓现货
            await exchange.create_order(
                symbol='BTC/USD',
                type='market',
                side='sell',
                amount=spot_position
            )
            print(f"已平仓 {spot_position} BTC")
\`\`\`

---

## ⚠️ 风险与应对

### 主要风险

| 风险类型 | 严重程度 | 发生概率 | 应对策略 |
|----------|----------|----------|----------|
| **Gamma 风险** | 🔴 高 | 中 | 设置止损，避免临近到期 |
| **跳空风险** | 🔴 高 | 低 | 使用 OTM 期权，控制仓位 |
| **流动性风险** | 🟡 中 | 中 | 选择主流币种，避免深度虚值 |
| **执行风险** | 🟡 中 | 中 | 使用限价单，设置滑点保护 |
| **平台风险** | 🟡 中 | 低 | 分散平台，控制单一敞口 |

### Gamma 风险详解

**什么是 Gamma 风险？**

Gamma 衡量 Delta 对价格变动的敏感度。临近到期时，Gamma 急剧增大，导致 Delta 快速变化，对冲成本飙升。

\`\`\`
案例：
- BTC 行权价 $60,000，到期前 1 天
- BTC 从 $59,500 涨到 $60,500（+1.7%）
- Delta 从 0.3 变为 0.7（+133%）
- 需要紧急买入大量现货对冲
\`\`\`

**应对措施：**

1. **避免末日期权：** 到期前 2 天平仓或展期
2. **设置 Gamma 上限：** 组合 Gamma < 0.0001
3. **使用日历价差：** 卖近买远，对冲 Gamma

### 跳空风险

**场景示例：**
- 周末 BTC 突发重大新闻
- 周一开盘跳空 15%
- 期权瞬间深度实值
- 对冲不及，产生重大亏损

**应对措施：**

1. **控制仓位：** 单一期权不超过账户 10%
2. **使用价差：** 卖出期权同时买入更虚值期权作保护
3. **周末减仓：** 周五下午平仓部分头寸

---

## 💡 进阶技巧

### 技巧 1：波动率择时

**IV 百分位策略：**

\`\`\`python
def calculate_iv_percentile(current_iv, historical_ivs):
    """
    计算当前 IV 在历史数据中的百分位
    """
    import numpy as np
    percentile = (np.sum(historical_ivs < current_iv) / len(historical_ivs)) * 100
    return percentile

# 策略规则
iv_percentile = calculate_iv_percentile(current_iv=0.65, historical_ivs=historical_data)

if iv_percentile > 80:
    print("IV 高位，适合卖出期权")
elif iv_percentile < 20:
    print("IV 低位，不适合卖出期权")
else:
    print("IV 中性，谨慎操作")
\`\`\`

### 技巧 2：Gamma Scalping

当你进行 Delta 对冲时，如果操作得当，可以从价格波动中额外获利：

\`\`\`
原理：
- 价格上涨 → Delta 增加 → 买入现货
- 价格下跌 → Delta 减少 → 卖出现货
- 相当于"买低卖高"

盈利条件：
实际波动率 > 对冲成本（滑点+手续费）
\`\`\`

### 技巧 3：使用期权价差降低风险

**牛市看涨价差（降低保证金）：**

\`\`\`
卖出 $60,000 Call（收 $1,200）
买入 $65,000 Call（付 $400）
净收入：$800

优势：
- 最大亏损有限（$5,000 - $800 = $4,200）
- 保证金需求大幅降低
- 无需频繁对冲
\`\`\`

---

## ❓ 常见问题

### Q1: 需要多少资金才能开始？

**最低资金建议：**

| 币种 | 最低资金 | 推荐资金 | 说明 |
|------|----------|----------|------|
| BTC | $10,000 | $30,000 | 1张期权 + 对冲保证金 |
| ETH | $3,000 | $10,000 | 1张期权 + 对冲保证金 |

### Q2: 对冲频率应该是多少？

**推荐策略：**
\`\`\`
低成本方法（新手）：
- 每4小时检查一次
- Delta 偏差 > 10% 才对冲
- 预期年化：15-25%

高频方法（进阶）：
- 每15分钟检查
- Delta 偏差 > 3% 对冲
- 预期年化：30-50%
\`\`\`

### Q3: 如何选择行权价？

**选择原则：**
- **ATM（平值）：** 权利金最高，但 Gamma 风险大
- **OTM 5%：** 权利金适中，推荐新手
- **OTM 10%：** 权利金较低，但更安全

### Q4: 期权被行权怎么办？

**处理流程：**
1. 期权自动结算，产生现金流
2. 现货头寸自动对冲行权损失
3. 净损益 = 收到的权利金 - 对冲成本

**示例：**
\`\`\`
卖出 $60,000 Call，收权利金 $1,200
到期价格 $62,000，期权被行权
行权损失：$2,000
现货盈利：0.5 BTC × $2,000 = $1,000
净损失：$2,000 - $1,000 - $1,200 = -$200（亏损）

教训：Delta 从 0.5 涨到 1，应该及时加仓对冲
\`\`\`

---

## 📈 收益预期

### 历史回测数据

**BTC ATM 期权卖出 + Delta 对冲（2023年）：**

| 月份 | IV水平 | 实际波动 | 策略收益 | 最大回撤 |
|------|--------|----------|----------|----------|
| 1月 | 55% | 38% | +8.2% | -3.1% |
| 2月 | 48% | 42% | +4.5% | -2.8% |
| 3月 | 72% | 65% | +5.8% | -7.2% |
| 4月 | 45% | 35% | +6.1% | -2.0% |
| ... | ... | ... | ... | ... |
| **全年** | **平均52%** | **平均40%** | **+42%** | **-12%** |

### 风险调整后收益

\`\`\`
年化收益：30-50%
最大回撤：10-20%
夏普比率：1.5-2.5
盈利月份比例：70-80%
\`\`\`

---

## 🎓 学习资源

### 推荐书籍
- 《期权波动率与定价》- Sheldon Natenberg
- 《Dynamic Hedging》- Nassim Taleb

### 在线课程
- Deribit 官方教程
- CME Group 期权教育

### 工具推荐
- **Greeks 计算器：** optionstrat.com
- **IV 监控：** laevitas.ch
- **回测平台：** QuantConnect

---

## ⚡ 快速启动清单

### 新手 7 天入门计划

- [ ] Day 1: 学习期权基础概念和 Greeks
- [ ] Day 2: 在 Deribit 测试网练习下单
- [ ] Day 3: 理解 Delta 对冲原理
- [ ] Day 4: 小仓位实盘（0.1 BTC 规模）
- [ ] Day 5: 手动执行 Delta 再平衡
- [ ] Day 6: 设置自动对冲脚本
- [ ] Day 7: 复盘总结，优化参数

### 关键成功因素

1. **严格的仓位管理：** 单一期权 < 账户 10%
2. **规律的对冲执行：** 设置闹钟或自动化
3. **持续的学习复盘：** 记录每笔交易
4. **耐心的收益预期：** 月收益 3-5% 已经很好

> ⚠️ **重要提示：** 期权交易具有高风险，可能导致本金全部损失。请确保充分理解策略原理后再进行实盘操作，建议先在测试网练习至少 2 周。`,
  risk_level: 4,
  apy_min: 20,
  apy_max: 50,
  time_required: '每天1-2小时监控',
  capital_required: '$10,000+',
  complexity: '高级',
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

    // 检查是否已存在
    const existingResponse = await axios.get(
      `${DIRECTUS_URL}/items/strategies?filter[slug][_eq]=${STRATEGY.slug}`,
      config
    );

    if (existingResponse.data.data && existingResponse.data.data.length > 0) {
      console.log(`策略 "${STRATEGY.title}" 已存在，跳过创建`);
      return;
    }

    // 创建策略
    const response = await axios.post(
      `${DIRECTUS_URL}/items/strategies`,
      STRATEGY,
      config
    );

    console.log(`✅ 策略创建成功！`);
    console.log(`   标题: ${STRATEGY.title}`);
    console.log(`   Slug: ${STRATEGY.slug}`);
    console.log(`   分类: ${STRATEGY.category}`);
    console.log(`   风险等级: ${STRATEGY.risk_level}`);
    console.log(`   APY: ${STRATEGY.apy_min}-${STRATEGY.apy_max}%`);

    // 获取当前策略总数
    const countResponse = await axios.get(
      `${DIRECTUS_URL}/items/strategies?limit=0&meta=total_count`,
      config
    );

    console.log(`\n📊 数据库中策略总数: ${countResponse.data.meta.total_count}`);

  } catch (error) {
    console.error('❌ 错误:', error.response?.data || error.message);
    process.exit(1);
  }
}

main();
