const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_EMAIL = 'the_uk1@outlook.com';
const DIRECTUS_PASSWORD = 'Mygcdjmyxzg2026!';

const STRATEGY_20_2 = {
  title: '隐含波动率差跨所套利 - 捕捉 IV 定价差异',
  slug: 'iv-cross-exchange-arbitrage',
  summary: '比较同一标的在 Deribit、OKX、Binance 等不同交易所的隐含波动率(IV)差异，在低 IV 交易所买入期权，高 IV 交易所卖出，赚取波动率定价差。适合对期权定价有深入理解的交易者，年化收益 25-60%。',

  category: 'options-volatility-arbitrage',
  category_l1: 'arbitrage',
  category_l2: 'options-volatility-arbitrage',

  difficulty_level: 'advanced',
  risk_level: 3,

  apy_min: 25,
  apy_max: 60,
  min_investment: 20000,
  time_commitment: 'active',

  content: `# 隐含波动率差跨所套利 - 捕捉 IV 定价差异

> **预计阅读时间：** 25 分钟
> **难度等级：** 高级
> **风险等级：** ⚠️⚠️⚠️ 中（3/5）

---

## 📖 老陈的 IV 套利发现之旅

2024 年 3 月，期权交易员老陈（10 年衍生品经验）发现了跨所 IV 套利的机会：

**观察到的异常：**
- BTC 现价：$65,000
- 1 周后到期 $66,000 Call 期权 IV：
  - Deribit：52%
  - OKX：58%
  - Binance：55%
  - **IV 差：** 6%（Deribit vs OKX）

**这意味着什么？**
\`\`\`
期权定价（简化 Black-Scholes）：
- 同行权价、同到期日的期权
- 唯一变量是隐含波动率(IV)
- IV 高 → 期权价格高
- IV 低 → 期权价格低

IV 52% 期权价格：约 $1,580
IV 58% 期权价格：约 $1,820
价差：$240（15.2%）
\`\`\`

**第一次套利操作：**

1. 在 Deribit 买入 1 张 $66,000 Call（IV 52%，价格 $1,580）
2. 在 OKX 卖出 1 张相同 Call（IV 58%，价格 $1,820）
3. 理论利润：$240 - 手续费 $20 = $220

**实际结果：**
- 2 天后 IV 收敛：Deribit 55%，OKX 56%
- 平仓利润：$185
- 投入保证金：$8,000
- 收益率：2.3%（2 天）

**一个月持续操作：**
- 执行 11 次 IV 套利
- 平均持仓 3 天
- 总利润：$3,200
- 月收益率：16%

> 💡 **关键启示：** IV 差异是市场定价无效率的体现，不同交易所有不同的用户群体和流动性特征，导致 IV 差异持续存在。

---

## 🎯 策略核心逻辑

### 什么是隐含波动率(IV)？

**IV 的本质：**

隐含波动率是市场对未来价格波动的预期，从期权价格反推出来：

\`\`\`
期权价格 = f(标的价格, 行权价, 到期时间, 无风险利率, IV)

已知：期权市场价格
求解：IV（唯一未知数）

IV 代表：
- 市场对未来波动的预期
- 期权的"昂贵程度"
- 供需关系的体现
\`\`\`

### 为什么不同交易所 IV 不同？

**1. 用户群体差异**
\`\`\`
Deribit：
- 专业机构为主
- 做市商活跃
- 定价相对"合理"

OKX/Binance：
- 散户比例高
- 投机需求强
- 容易出现 IV 溢价
\`\`\`

**2. 流动性差异**
\`\`\`
流动性好 → 买卖价差小 → IV 定价准确
流动性差 → 买卖价差大 → IV 可能偏离
\`\`\`

**3. 结算机制差异**
\`\`\`
Deribit：BTC 结算
OKX：USDT 结算
Binance：USDC 结算

不同结算币种会影响对冲成本和定价
\`\`\`

### 套利原理图解

\`\`\`
                    ┌─────────────┐
                    │  BTC 现价   │
                    │   $65,000   │
                    └──────┬──────┘
                           │
           ┌───────────────┼───────────────┐
           │               │               │
    ┌──────▼──────┐ ┌──────▼──────┐ ┌──────▼──────┐
    │  Deribit    │ │    OKX      │ │  Binance    │
    │  IV: 52%    │ │  IV: 58%    │ │  IV: 55%    │
    │ Price:$1580 │ │ Price:$1820 │ │ Price:$1700 │
    └──────┬──────┘ └──────┬──────┘ └─────────────┘
           │               │
           │   套利策略    │
           ▼               ▼
    ┌──────────────────────────────┐
    │  Deribit 买入  ←→  OKX 卖出  │
    │     锁定 $240 IV 价差利润    │
    └──────────────────────────────┘
\`\`\`

---

## 📊 实战操作流程

### 第一步：搭建监控系统

**多交易所 IV 监控代码：**

\`\`\`python
import asyncio
import aiohttp
from datetime import datetime
import numpy as np
from scipy.stats import norm

class IVMonitor:
    def __init__(self):
        self.exchanges = {
            'deribit': 'https://www.deribit.com/api/v2',
            'okx': 'https://www.okx.com/api/v5',
            'binance': 'https://eapi.binance.com/eapi/v1'
        }
        self.iv_data = {}

    async def fetch_deribit_iv(self, session, instrument):
        """获取 Deribit IV"""
        url = f"{self.exchanges['deribit']}/public/ticker"
        params = {'instrument_name': instrument}

        async with session.get(url, params=params) as resp:
            data = await resp.json()
            if data.get('result'):
                return {
                    'iv': data['result']['mark_iv'],
                    'price': data['result']['mark_price'],
                    'bid': data['result']['best_bid_price'],
                    'ask': data['result']['best_ask_price']
                }
        return None

    async def fetch_okx_iv(self, session, inst_id):
        """获取 OKX IV"""
        url = f"{self.exchanges['okx']}/public/opt-summary"
        params = {'instFamily': 'BTC-USD'}

        async with session.get(url, params=params) as resp:
            data = await resp.json()
            for item in data.get('data', []):
                if item['instId'] == inst_id:
                    return {
                        'iv': float(item['markVol']),
                        'price': float(item['markPx']),
                        'bid': float(item['bidPx']),
                        'ask': float(item['askPx'])
                    }
        return None

    async def monitor_iv_spread(self):
        """监控 IV 价差"""
        async with aiohttp.ClientSession() as session:
            while True:
                # 获取各交易所同一期权的 IV
                deribit_data = await self.fetch_deribit_iv(
                    session, 'BTC-28JUN24-70000-C'
                )
                okx_data = await self.fetch_okx_iv(
                    session, 'BTC-USD-240628-70000-C'
                )

                if deribit_data and okx_data:
                    iv_spread = abs(deribit_data['iv'] - okx_data['iv'])

                    print(f"""
                    ╔═══════════════════════════════════════╗
                    ║      IV 跨所套利监控                  ║
                    ╚═══════════════════════════════════════╝

                    Deribit IV: {deribit_data['iv']*100:.1f}%
                    OKX IV:     {okx_data['iv']*100:.1f}%

                    IV 差: {iv_spread*100:.2f}%

                    Deribit 期权价格: \${deribit_data['price']:.2f}
                    OKX 期权价格:     \${okx_data['price']:.2f}
                    价差: \${okx_data['price'] - deribit_data['price']:.2f}
                    """)

                    # IV 差 > 5% 时发出警报
                    if iv_spread > 0.05:
                        print("🚨 发现 IV 套利机会！")
                        if deribit_data['iv'] < okx_data['iv']:
                            print("方向: Deribit 买入 → OKX 卖出")
                        else:
                            print("方向: OKX 买入 → Deribit 卖出")

                await asyncio.sleep(10)  # 10秒刷新

# 运行监控
monitor = IVMonitor()
asyncio.run(monitor.monitor_iv_spread())
\`\`\`

### 第二步：计算套利收益和成本

**成本结构分析：**

| 成本项 | Deribit | OKX | 说明 |
|--------|---------|-----|------|
| 交易手续费 | 0.03% | 0.02% | 按期权价值计算 |
| 提现手续费 | $2 | $5 | BTC/USDT 提现 |
| 资金利息 | 0.01%/天 | 0.01%/天 | 保证金占用 |
| 滑点 | 0.5-1% | 0.5-1.5% | 取决于流动性 |

**套利利润计算器：**

\`\`\`python
def calculate_iv_arbitrage_profit(
    deribit_iv, okx_iv,
    spot_price, strike, days_to_expiry,
    position_size=1
):
    """
    计算 IV 套利利润
    """
    # 使用 Black-Scholes 计算期权理论价格
    def bs_call_price(S, K, T, r, sigma):
        d1 = (np.log(S/K) + (r + sigma**2/2)*T) / (sigma*np.sqrt(T))
        d2 = d1 - sigma*np.sqrt(T)
        return S*norm.cdf(d1) - K*np.exp(-r*T)*norm.cdf(d2)

    T = days_to_expiry / 365
    r = 0.05  # 无风险利率

    # 计算两个 IV 对应的期权价格
    price_low_iv = bs_call_price(spot_price, strike, T, r, deribit_iv)
    price_high_iv = bs_call_price(spot_price, strike, T, r, okx_iv)

    # 毛利润
    gross_profit = (price_high_iv - price_low_iv) * position_size

    # 成本
    trading_fee = (price_low_iv * 0.0003 + price_high_iv * 0.0002) * position_size
    slippage = (price_low_iv + price_high_iv) * 0.005 * position_size
    funding_cost = (price_low_iv + price_high_iv) * 0.0001 * days_to_expiry * position_size

    # 净利润
    net_profit = gross_profit - trading_fee - slippage - funding_cost

    return {
        'gross_profit': gross_profit,
        'trading_fee': trading_fee,
        'slippage': slippage,
        'funding_cost': funding_cost,
        'net_profit': net_profit,
        'roi': net_profit / (price_low_iv * position_size) * 100
    }

# 示例计算
result = calculate_iv_arbitrage_profit(
    deribit_iv=0.52,
    okx_iv=0.58,
    spot_price=65000,
    strike=66000,
    days_to_expiry=7,
    position_size=1
)

print(f"""
套利利润分析：
毛利润: \${result['gross_profit']:.2f}
交易费: \${result['trading_fee']:.2f}
滑点:   \${result['slippage']:.2f}
资金成本: \${result['funding_cost']:.2f}
净利润: \${result['net_profit']:.2f}
ROI: {result['roi']:.2f}%
""")
\`\`\`

### 第三步：执行套利交易

**自动化执行脚本：**

\`\`\`python
import ccxt
import asyncio

class IVArbitrageExecutor:
    def __init__(self, config):
        self.deribit = ccxt.deribit({
            'apiKey': config['deribit_key'],
            'secret': config['deribit_secret'],
            'enableRateLimit': True
        })

        self.okx = ccxt.okx({
            'apiKey': config['okx_key'],
            'secret': config['okx_secret'],
            'password': config['okx_password'],
            'enableRateLimit': True
        })

    async def execute_iv_arbitrage(
        self,
        deribit_instrument,
        okx_instrument,
        size,
        direction='buy_deribit_sell_okx'
    ):
        """
        执行 IV 套利
        direction: 'buy_deribit_sell_okx' 或 'buy_okx_sell_deribit'
        """
        try:
            if direction == 'buy_deribit_sell_okx':
                # 在 Deribit 买入（低 IV）
                deribit_order = self.deribit.create_order(
                    symbol=deribit_instrument,
                    type='market',
                    side='buy',
                    amount=size
                )

                # 在 OKX 卖出（高 IV）
                okx_order = self.okx.create_order(
                    symbol=okx_instrument,
                    type='market',
                    side='sell',
                    amount=size
                )

            else:
                # 反向操作
                deribit_order = self.deribit.create_order(
                    symbol=deribit_instrument,
                    type='market',
                    side='sell',
                    amount=size
                )

                okx_order = self.okx.create_order(
                    symbol=okx_instrument,
                    type='market',
                    side='buy',
                    amount=size
                )

            print(f"Deribit 订单: {deribit_order['id']}")
            print(f"OKX 订单: {okx_order['id']}")

            return {
                'deribit': deribit_order,
                'okx': okx_order,
                'status': 'success'
            }

        except Exception as e:
            print(f"执行失败: {e}")
            return {'status': 'failed', 'error': str(e)}

    async def close_positions(self):
        """平仓所有头寸"""
        # 获取 Deribit 持仓
        deribit_positions = self.deribit.fetch_positions()
        for pos in deribit_positions:
            if pos['contracts'] != 0:
                side = 'sell' if pos['side'] == 'long' else 'buy'
                self.deribit.create_order(
                    symbol=pos['symbol'],
                    type='market',
                    side=side,
                    amount=abs(pos['contracts'])
                )

        # 获取 OKX 持仓
        okx_positions = self.okx.fetch_positions()
        for pos in okx_positions:
            if pos['contracts'] != 0:
                side = 'sell' if pos['side'] == 'long' else 'buy'
                self.okx.create_order(
                    symbol=pos['symbol'],
                    type='market',
                    side=side,
                    amount=abs(pos['contracts'])
                )

        print("所有头寸已平仓")
\`\`\`

---

## ⚠️ 风险与应对

### 主要风险

| 风险类型 | 严重程度 | 发生概率 | 应对策略 |
|----------|----------|----------|----------|
| **IV 持续发散** | 🔴 高 | 低 | 设置止损，限制持仓时间 |
| **流动性风险** | 🟡 中 | 中 | 选择高流动性期权 |
| **执行风险** | 🟡 中 | 中 | 使用限价单，分批执行 |
| **交易所风险** | 🟡 中 | 低 | 分散资金，限制单一敞口 |

### 风险管理策略

**1. 止损设置**
\`\`\`
当 IV 差从 6% 扩大到 8% 时（亏损 2%）：
- 亏损 = 期权价值 × 2% × Vega
- 约等于初始利润的 50%
- 建议止损位：IV 差扩大 30%
\`\`\`

**2. 持仓时间限制**
\`\`\`
最大持仓时间：7 天
原因：
- 时间价值衰减（Theta）会侵蚀利润
- 临近到期 Gamma 风险增大
- 资金成本累积
\`\`\`

---

## 💡 实战技巧

### 技巧 1：选择最佳套利时机

**高 IV 差异常见于：**
- 重大新闻发布前后（FOMC、ETF 决议）
- 周末前（流动性下降）
- 交易所活动期间（手续费减免）

### 技巧 2：选择最优行权价

**推荐：**
- ATM 或轻度 OTM 期权（Delta 0.3-0.5）
- 流动性最好，买卖价差最小
- IV 变化对价格影响最大

### 技巧 3：对冲 Delta 风险

\`\`\`
虽然两边期权 Delta 理论相同，但实际可能有差异：
- 使用永续合约对冲净 Delta
- 每天检查组合 Delta
- 保持 Delta 中性
\`\`\`

---

## ❓ 常见问题

### Q1: 最低资金要求是多少？

**推荐：**
- 最低：$20,000（单一期权 + 保证金）
- 推荐：$50,000（多笔套利 + 备用金）

### Q2: IV 差多少才值得套利？

\`\`\`
成本结构分析：
- 交易费：0.05%
- 滑点：1%
- 资金成本：0.1%（3天）
- 总成本：约 1.15%

IV 差 > 3%（期权价格差 > 3%）时有利润空间
建议阈值：IV 差 > 5%
\`\`\`

### Q3: 如何处理期权到期？

**推荐：**
- 到期前 2 天平仓
- 避免行权/交割的复杂性
- 锁定利润或止损

---

## 📈 收益预期

| 市场状态 | 月收益 | 操作频率 | 说明 |
|----------|--------|----------|------|
| 高波动 | 15-25% | 8-12次/月 | IV 差异大，机会多 |
| 中波动 | 8-15% | 4-8次/月 | 正常市场 |
| 低波动 | 3-8% | 2-4次/月 | 机会少，需要耐心 |

> ⚠️ **重要提示：** IV 套利需要对期权定价有深入理解，建议先在测试环境模拟操作。资金管理和风险控制是成功的关键。`,

  status: 'published'
};

const STRATEGY_20_3 = {
  title: '偏度(Skew)套利 - 捕捉 Put/Call IV 不对称',
  slug: 'skew-arbitrage-strategy',
  summary: '利用看涨期权与看跌期权隐含波动率的不对称定价（偏度），构建 Risk Reversal 或 Butterfly 组合，等待偏度回归均值获利。适合理解期权波动率曲面的高级交易者，年化收益 20-45%。',

  category: 'options-volatility-arbitrage',
  category_l1: 'arbitrage',
  category_l2: 'options-volatility-arbitrage',

  difficulty_level: 'advanced',
  risk_level: 3,

  apy_min: 20,
  apy_max: 45,
  min_investment: 15000,
  time_commitment: 'active',

  content: `# 偏度(Skew)套利 - 捕捉 Put/Call IV 不对称

> **预计阅读时间：** 22 分钟
> **难度等级：** 高级
> **风险等级：** ⚠️⚠️⚠️ 中（3/5）

---

## 📖 什么是波动率偏度(Skew)？

### 基本概念

**偏度定义：**
波动率偏度指同一到期日、不同行权价的期权，其隐含波动率(IV)存在差异。

\`\`\`
典型的波动率曲面（Volatility Smile/Skew）：

IV
 │
60%│        *
55%│      *   *
50%│    *       *
45%│  *           *
40%│*               *
   └─────────────────── 行权价
      OTM Put  ATM  OTM Call
      (低)          (高)
\`\`\`

**为什么存在偏度？**

1. **下行保护需求：** 投资者更愿意为下跌保护付出溢价（买 Put）
2. **历史经验：** 市场崩盘比暴涨更常见、更剧烈
3. **做市商对冲成本：** 对冲下行风险成本更高

### 偏度的量化

**25-Delta Skew：**
\`\`\`
Skew = IV(25-Delta Put) - IV(25-Delta Call)

正值：Put IV 高于 Call（正常市场，看跌保护贵）
负值：Call IV 高于 Put（极端牛市，看涨需求高）
\`\`\`

**BTC 典型偏度范围：**
- 正常：+3% 到 +8%
- 恐慌：+10% 到 +20%
- 极端牛市：-5% 到 0%

---

## 🎯 策略核心逻辑

### 偏度均值回归原理

偏度会围绕均值波动，极端偏度往往会回归：

\`\`\`
偏度过高（Put 太贵）：
- 市场过度恐慌
- 卖出 Put，买入 Call
- 等待偏度回落

偏度过低（Call 太贵）：
- 市场过度乐观
- 卖出 Call，买入 Put
- 等待偏度回升
\`\`\`

### 常用套利组合

**1. Risk Reversal（风险逆转）**
\`\`\`
组合结构：
- 卖出 OTM Put（收权利金）
- 买入 OTM Call（付权利金）

适用场景：
- 偏度过高时（Put 贵，Call 便宜）
- 净收入或净支出取决于偏度

盈利来源：
- 偏度回归时，Put IV 下降，Call IV 上升
- 组合价值增加
\`\`\`

**2. Butterfly Spread（蝶式价差）**
\`\`\`
组合结构：
- 买入 1 张低行权价期权
- 卖出 2 张中间行权价期权
- 买入 1 张高行权价期权

适用场景：
- 偏度曲线形状异常
- 预期波动率曲面回归正常形状
\`\`\`

---

## 📊 实战案例

### 案例 1：偏度过高时的 Risk Reversal

**市场条件（2024年3月）：**
- BTC 现价：$60,000
- 7 天后到期
- 25-Delta Skew：+15%（历史均值 +5%）

**期权参数：**
| 期权 | 行权价 | Delta | IV | 价格 |
|------|--------|-------|-----|------|
| Put | $55,000 | -0.25 | 65% | $850 |
| Call | $65,000 | +0.25 | 50% | $420 |

**构建 Risk Reversal：**
\`\`\`
卖出 $55,000 Put：+$850
买入 $65,000 Call：-$420
净收入：$430

保证金要求：约 $5,000（卖 Put 保证金）
\`\`\`

**偏度回归后（3天后）：**
- 25-Delta Skew：+7%
- Put IV：58%（↓7%）
- Call IV：51%（↑1%）

**新期权价格：**
| 期权 | 新 IV | 新价格 | 变化 |
|------|-------|--------|------|
| Put | 58% | $580 | -$270 |
| Call | 51% | $450 | +$30 |

**平仓收益：**
\`\`\`
买回 Put：-$580（之前卖 $850，赚 $270）
卖出 Call：+$450（之前买 $420，赚 $30）
总利润：$300

ROI：$300 / $5,000 = 6%（3天）
年化：约 730%
\`\`\`

### 案例 2：Butterfly 套利

**发现机会：**
波动率曲面异常——中间行权价 IV 过高

| 行权价 | IV | 理论 IV | 偏离 |
|--------|-----|---------|------|
| $58,000 | 52% | 53% | -1% |
| $60,000 | 58% | 54% | +4% |
| $62,000 | 51% | 53% | -2% |

**构建 Butterfly：**
\`\`\`
买入 $58,000 Call：-$1,200
卖出 2x $60,000 Call：+$2,800
买入 $62,000 Call：-$900
净收入：$700

最大收益：到期时 BTC = $60,000
最大亏损：期权费损失（但已经净收入）
\`\`\`

---

## 🔧 实操指南

### 第一步：偏度监控系统

**Python 偏度监控代码：**

\`\`\`python
import numpy as np
from scipy.stats import norm
from scipy.optimize import brentq

class SkewMonitor:
    def __init__(self):
        self.historical_skew = []

    def calculate_iv(self, option_price, spot, strike, T, r, option_type='call'):
        """从期权价格反推 IV"""
        def objective(sigma):
            d1 = (np.log(spot/strike) + (r + sigma**2/2)*T) / (sigma*np.sqrt(T))
            d2 = d1 - sigma*np.sqrt(T)

            if option_type == 'call':
                theoretical = spot*norm.cdf(d1) - strike*np.exp(-r*T)*norm.cdf(d2)
            else:
                theoretical = strike*np.exp(-r*T)*norm.cdf(-d2) - spot*norm.cdf(-d1)

            return theoretical - option_price

        try:
            iv = brentq(objective, 0.01, 5.0)
            return iv
        except:
            return None

    def calculate_skew(self, spot, put_strike, call_strike, put_price, call_price, T, r=0.05):
        """计算 25-Delta Skew"""
        put_iv = self.calculate_iv(put_price, spot, put_strike, T, r, 'put')
        call_iv = self.calculate_iv(call_price, spot, call_strike, T, r, 'call')

        if put_iv and call_iv:
            skew = put_iv - call_iv
            return {
                'put_iv': put_iv,
                'call_iv': call_iv,
                'skew': skew,
                'skew_pct': skew * 100
            }
        return None

    def analyze_skew_opportunity(self, current_skew, historical_mean=0.05, historical_std=0.03):
        """分析偏度套利机会"""
        z_score = (current_skew - historical_mean) / historical_std

        if z_score > 2:
            return {
                'signal': 'SELL_PUT_BUY_CALL',
                'strength': 'strong',
                'z_score': z_score,
                'reason': '偏度过高，Put 过贵'
            }
        elif z_score > 1:
            return {
                'signal': 'SELL_PUT_BUY_CALL',
                'strength': 'moderate',
                'z_score': z_score,
                'reason': '偏度偏高'
            }
        elif z_score < -2:
            return {
                'signal': 'BUY_PUT_SELL_CALL',
                'strength': 'strong',
                'z_score': z_score,
                'reason': '偏度过低，Call 过贵'
            }
        elif z_score < -1:
            return {
                'signal': 'BUY_PUT_SELL_CALL',
                'strength': 'moderate',
                'z_score': z_score,
                'reason': '偏度偏低'
            }
        else:
            return {
                'signal': 'NEUTRAL',
                'strength': 'none',
                'z_score': z_score,
                'reason': '偏度在正常范围'
            }

# 使用示例
monitor = SkewMonitor()

# 计算当前偏度
result = monitor.calculate_skew(
    spot=60000,
    put_strike=55000,
    call_strike=65000,
    put_price=850,
    call_price=420,
    T=7/365
)

print(f"Put IV: {result['put_iv']*100:.1f}%")
print(f"Call IV: {result['call_iv']*100:.1f}%")
print(f"Skew: {result['skew_pct']:.1f}%")

# 分析机会
opportunity = monitor.analyze_skew_opportunity(result['skew'])
print(f"信号: {opportunity['signal']}")
print(f"强度: {opportunity['strength']}")
print(f"原因: {opportunity['reason']}")
\`\`\`

### 第二步：构建套利组合

**Risk Reversal 执行脚本：**

\`\`\`python
import ccxt

class SkewArbitrageExecutor:
    def __init__(self, exchange_config):
        self.exchange = ccxt.deribit({
            'apiKey': exchange_config['api_key'],
            'secret': exchange_config['secret'],
            'enableRateLimit': True
        })

    def execute_risk_reversal(
        self,
        put_instrument,
        call_instrument,
        size,
        direction='sell_put_buy_call'
    ):
        """
        执行 Risk Reversal
        """
        orders = []

        if direction == 'sell_put_buy_call':
            # 卖出 Put
            put_order = self.exchange.create_order(
                symbol=put_instrument,
                type='limit',
                side='sell',
                amount=size,
                price=None  # 使用市价
            )
            orders.append(('PUT', 'SELL', put_order))

            # 买入 Call
            call_order = self.exchange.create_order(
                symbol=call_instrument,
                type='limit',
                side='buy',
                amount=size,
                price=None
            )
            orders.append(('CALL', 'BUY', call_order))

        else:  # buy_put_sell_call
            # 买入 Put
            put_order = self.exchange.create_order(
                symbol=put_instrument,
                type='limit',
                side='buy',
                amount=size,
                price=None
            )
            orders.append(('PUT', 'BUY', put_order))

            # 卖出 Call
            call_order = self.exchange.create_order(
                symbol=call_instrument,
                type='limit',
                side='sell',
                amount=size,
                price=None
            )
            orders.append(('CALL', 'SELL', call_order))

        return orders

    def close_risk_reversal(self, put_instrument, call_instrument, size, original_direction):
        """
        平仓 Risk Reversal
        """
        if original_direction == 'sell_put_buy_call':
            # 买回 Put
            self.exchange.create_order(
                symbol=put_instrument,
                type='market',
                side='buy',
                amount=size
            )
            # 卖出 Call
            self.exchange.create_order(
                symbol=call_instrument,
                type='market',
                side='sell',
                amount=size
            )
        else:
            # 卖出 Put
            self.exchange.create_order(
                symbol=put_instrument,
                type='market',
                side='sell',
                amount=size
            )
            # 买回 Call
            self.exchange.create_order(
                symbol=call_instrument,
                type='market',
                side='buy',
                amount=size
            )

        print("Risk Reversal 已平仓")
\`\`\`

---

## ⚠️ 风险与应对

### 主要风险

| 风险类型 | 严重程度 | 发生概率 | 应对策略 |
|----------|----------|----------|----------|
| **偏度持续扩大** | 🔴 高 | 中 | 设置止损，限制持仓 |
| **方向性风险** | 🟡 中 | 中 | Delta 对冲 |
| **流动性风险** | 🟡 中 | 中 | 选择流动性好的期权 |
| **Gamma 风险** | 🟡 中 | 中 | 避免临近到期 |

### Delta 对冲

**Risk Reversal 的 Delta：**
\`\`\`
组合 Delta = Call Delta - Put Delta
         = 0.25 - (-0.25)
         = 0.50（多头方向）

对冲：
- 做空 0.5 BTC 永续合约
- 或做空 0.5 BTC 现货
\`\`\`

---

## 💡 实战技巧

### 技巧 1：寻找极端偏度

**偏度异常的信号：**
- 重大新闻前（恐慌买 Put）
- 市场急跌后（Put IV 飙升）
- 极端牛市（Call 需求爆发）

### 技巧 2：选择合适的 Delta

**推荐 25-Delta：**
- 流动性最好
- 对偏度变化最敏感
- 行业标准

### 技巧 3：时间选择

**最佳入场时机：**
- 波动事件刚结束后
- 偏度达到历史极值
- 有明确的回归催化剂

---

## 📈 收益预期

| 偏度状态 | 预期收益 | 持仓周期 | 成功率 |
|----------|----------|----------|--------|
| 极端偏度 | 5-10% | 3-7天 | 75% |
| 中等偏度 | 2-5% | 5-14天 | 65% |
| 轻微偏度 | 1-3% | 7-21天 | 55% |

**年化预期：**
- 保守：20-30%
- 中等：30-45%
- 激进：45-60%

> ⚠️ **重要提示：** 偏度套利需要深入理解波动率曲面和期权希腊字母。建议先学习期权基础知识，并在模拟环境充分练习后再实盘操作。`,

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

    const strategies = [STRATEGY_20_2, STRATEGY_20_3];

    for (const strategy of strategies) {
      // 检查是否已存在
      const existingResponse = await axios.get(
        `${DIRECTUS_URL}/items/strategies?filter[slug][_eq]=${strategy.slug}`,
        config
      );

      if (existingResponse.data.data && existingResponse.data.data.length > 0) {
        console.log(`⏭️  策略 "${strategy.title}" 已存在，跳过`);
        continue;
      }

      // 创建策略
      await axios.post(
        `${DIRECTUS_URL}/items/strategies`,
        strategy,
        config
      );

      console.log(`✅ 策略创建成功: ${strategy.title}`);
      console.log(`   Slug: ${strategy.slug}`);
      console.log(`   APY: ${strategy.apy_min}-${strategy.apy_max}%\n`);
    }

    // 获取当前策略总数
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
