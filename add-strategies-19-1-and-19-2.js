const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_EMAIL = 'the_uk1@outlook.com';
const DIRECTUS_PASSWORD = 'Mygcdjmyxzg2026!';

const STRATEGY_19_1 = {
  title: 'CEX 内三角套利 - 高频交易捕捉微小价差',
  slug: 'triangle-arbitrage-19-1-cex-internal-triangle',
  summary: '在单个中心化交易所内执行 BTC→ETH→USDT→BTC 三角循环套利，利用交易对之间的价格不平衡赚取价差。适合熟悉高频交易和 API 开发的技术型投资者。',

  category: 'triangle-arbitrage',
  category_l1: 'arbitrage',
  category_l2: '三角/跨链套利',

  difficulty_level: 'advanced',
  risk_level: 2,

  apy_min: 15,
  apy_max: 80,
  min_investment: 10000,
  time_commitment: 'active',

  required_tools: [
    'Binance API',
    'OKX API',
    'Python/Node.js',
    'ccxt 库',
    'WebSocket 实时数据',
    'VPS 服务器（低延迟）',
    'Redis（数据缓存）',
    '监控告警系统'
  ],

  content: `# CEX 内三角套利 - 高频交易捕捉微小价差

> **预计阅读时间：** 22 分钟
> **难度等级：** 高级
> **风险等级：** ⚠️⚠️ 中低（2/5）

---

## 📖 小王的三角套利之路

2024 年 2 月，程序员小王（5 年 Python 经验）发现了 CEX 三角套利的机会：

**发现套利机会：**
- 在 Binance 上观察到：
  - BTC/USDT = 50,000
  - ETH/USDT = 2,500
  - ETH/BTC = 0.0505（隐含 BTC 价格 = 49,505）
  - **价差：** 50,000 - 49,505 = 495 USDT（0.99%）

**第一次手动套利：**
1. 用 10,000 USDT 买入 0.2 BTC（BTC/USDT）
2. 用 0.2 BTC 买入 3.96 ETH（ETH/BTC，按 0.0505 价格）
3. 卖出 3.96 ETH 换回 9,900 USDT（ETH/USDT，按 2,500 价格）
4. **等等，亏损了 100 USDT？**

**问题出在哪里？**
- 交易手续费：0.1% × 3 = 0.3%（30 USDT）
- 滑点损失：每次约 0.05%（15 USDT）
- 价格变动：手动操作太慢，3 分钟内价格已变化（55 USDT）
- **总损失：** 100 USDT

**开发自动化套利程序：**

小王花了 2 周时间开发了 Python 套利机器人：
- 使用 WebSocket 实时监控价格
- 毫秒级计算套利机会（考虑手续费和滑点）
- 自动执行三角套利订单
- 设置止损和风险控制

**一个月后：**
- 执行套利次数：127 次
- 成功率：89%（113 次盈利）
- 平均单次利润：0.15%（15 USDT）
- 总投入：10,000 USDT
- 总利润：1,695 USDT（月收益率 16.95%）

> 💡 **关键启示：** CEX 内三角套利需要自动化程序支持，手动操作几乎不可能盈利。成功关键在于低延迟、高频率、精确计算。

---

## 🎯 策略核心逻辑

### 什么是 CEX 内三角套利？

**三角套利原理：**

在一个交易所内，存在三个交易对：
- A/B（例如 BTC/USDT）
- B/C（例如 ETH/USDT）
- A/C（例如 ETH/BTC）

当这三个交易对的价格出现不一致时，就产生了套利机会。

**理论套利循环：**

\`\`\`
方向 1（正向循环）：
USDT → BTC → ETH → USDT

步骤：
1. 用 USDT 买入 BTC（BTC/USDT）
2. 用 BTC 买入 ETH（ETH/BTC）
3. 卖出 ETH 换回 USDT（ETH/USDT）

方向 2（反向循环）：
USDT → ETH → BTC → USDT

步骤：
1. 用 USDT 买入 ETH（ETH/USDT）
2. 用 ETH 买入 BTC（ETH/BTC）
3. 卖出 BTC 换回 USDT（BTC/USDT）
\`\`\`

### 套利机会识别

**价格关系公式：**

\`\`\`
理想状态：
Price(BTC/USDT) = Price(ETH/USDT) / Price(ETH/BTC)

实际情况（价格失衡）：
50,000 USDT/BTC ≠ 2,500 USDT/ETH / 0.0505 ETH/BTC
50,000 ≠ 49,505

套利空间 = (50,000 - 49,505) / 50,000 = 0.99%
\`\`\`

**扣除成本后的净利润：**

| 成本项 | 费率/影响 | 典型值 |
|--------|----------|--------|
| 交易手续费（3 次） | 0.1% × 3 | 0.3% |
| 滑点损失 | 每次 0.02-0.1% | 0.15% |
| 网络延迟风险 | 价格变动 | 0.05% |
| **总成本** | | **0.5%** |

**盈利条件：**
\`\`\`
套利空间 > 总成本
0.99% > 0.5% ✅ 可以套利
\`\`\`

---

## 📊 主流交易所三角套利对比

### 交易所选择

| 交易所 | 手续费 | API 延迟 | 交易对数量 | 套利难度 | 推荐指数 |
|--------|--------|---------|-----------|---------|---------|
| **Binance** | 0.1% | 10-50ms | 1,500+ | 中 | ⭐⭐⭐⭐⭐ |
| **OKX** | 0.08% | 15-60ms | 500+ | 低 | ⭐⭐⭐⭐ |
| **Bybit** | 0.1% | 20-80ms | 400+ | 中 | ⭐⭐⭐⭐ |
| **Gate.io** | 0.15% | 30-100ms | 2,000+ | 高 | ⭐⭐⭐ |
| **Kraken** | 0.26% | 50-200ms | 200+ | 很高 | ⭐⭐ |

### 常见三角套利组合

| 套利三角 | 套利频率 | 平均利润 | 竞争程度 | 推荐指数 |
|---------|---------|---------|---------|---------|
| BTC→ETH→USDT | 高（每分钟 3-5 次） | 0.1-0.3% | 高 | ⭐⭐⭐⭐ |
| BTC→BNB→USDT | 中（每分钟 1-2 次） | 0.15-0.4% | 中 | ⭐⭐⭐⭐⭐ |
| ETH→SOL→USDT | 高（每分钟 4-6 次） | 0.12-0.35% | 高 | ⭐⭐⭐⭐ |
| USDT→USDC→DAI | 低（每小时 2-3 次） | 0.05-0.15% | 低 | ⭐⭐⭐ |
| BTC→DOGE→USDT | 中（每分钟 2-3 次） | 0.2-0.5% | 中 | ⭐⭐⭐⭐ |

---

## 🚀 完整套利流程

### 阶段一：环境搭建与 API 配置（1-2 天）

#### 1. 安装 ccxt 库

\`\`\`bash
# 安装 Python ccxt 库（支持 100+ 交易所）
pip install ccxt websocket-client

# 安装 Node.js 版本
npm install ccxt ws
\`\`\`

#### 2. 配置交易所 API

**在 Binance 创建 API Key：**

1. 登录 Binance → 个人中心 → API 管理
2. 创建新的 API Key
3. 权限设置：
   - ✅ 启用现货交易
   - ✅ 启用读取权限
   - ❌ 禁用提现权限（安全）
4. IP 白名单：添加你的 VPS IP

**API 密钥存储（.env 文件）：**

\`\`\`bash
BINANCE_API_KEY=your_api_key_here
BINANCE_SECRET_KEY=your_secret_key_here
\`\`\`

---

### 阶段二：开发三角套利监控程序（3-5 天）

#### 1. 实时价格监控

**使用 WebSocket 获取实时价格：**

\`\`\`python
import ccxt
import asyncio
import websockets
import json

class TriangleArbitrageMonitor:
    def __init__(self):
        self.exchange = ccxt.binance({
            'apiKey': 'YOUR_API_KEY',
            'secret': 'YOUR_SECRET',
            'enableRateLimit': True
        })

        # 定义三角套利路径
        self.triangles = [
            {
                'name': 'BTC-ETH-USDT',
                'pairs': ['BTC/USDT', 'ETH/BTC', 'ETH/USDT'],
                'direction': 'forward'  # USDT → BTC → ETH → USDT
            },
            {
                'name': 'BTC-BNB-USDT',
                'pairs': ['BTC/USDT', 'BNB/BTC', 'BNB/USDT'],
                'direction': 'forward'
            }
        ]

        self.prices = {}

    async def connect_websocket(self):
        """连接 Binance WebSocket 获取实时价格"""
        streams = [
            'btcusdt@ticker',
            'ethbtc@ticker',
            'ethusdt@ticker',
            'bnbbtc@ticker',
            'bnbusdt@ticker'
        ]

        uri = f"wss://stream.binance.com:9443/stream?streams={'/'.join(streams)}"

        async with websockets.connect(uri) as ws:
            while True:
                msg = await ws.recv()
                data = json.loads(msg)

                if 'data' in data:
                    symbol = data['data']['s']  # 例如 BTCUSDT
                    price = float(data['data']['c'])  # 当前价格

                    # 格式化为 ccxt 标准格式
                    formatted_symbol = self.format_symbol(symbol)
                    self.prices[formatted_symbol] = price

                    # 每次价格更新后检查套利机会
                    await self.check_arbitrage()

    def format_symbol(self, binance_symbol):
        """将 Binance 格式（BTCUSDT）转换为 ccxt 格式（BTC/USDT）"""
        # 简化处理，实际需要更复杂的逻辑
        if 'USDT' in binance_symbol:
            base = binance_symbol.replace('USDT', '')
            return f"{base}/USDT"
        elif 'BTC' in binance_symbol:
            base = binance_symbol.replace('BTC', '')
            return f"{base}/BTC"
        return binance_symbol

    async def check_arbitrage(self):
        """检查所有三角套利机会"""
        for triangle in self.triangles:
            profit = self.calculate_triangle_profit(triangle)

            # 如果利润 > 0.5%（扣除手续费后仍有利润）
            if profit > 0.5:
                print(f"\\n🚨 发现套利机会！")
                print(f"三角: {triangle['name']}")
                print(f"预期利润: {profit:.2f}%")
                print(f"交易对价格: {[self.prices.get(p, 'N/A') for p in triangle['pairs']]}")

                # 执行套利（下一步实现）
                # await self.execute_arbitrage(triangle, profit)

    def calculate_triangle_profit(self, triangle):
        """计算三角套利利润"""
        pairs = triangle['pairs']

        # 检查所有价格是否都已获取
        if not all(p in self.prices for p in pairs):
            return 0

        # 假设从 10,000 USDT 开始
        amount = 10000

        # 正向循环：USDT → BTC → ETH → USDT
        if triangle['direction'] == 'forward':
            # Step 1: USDT → BTC
            btc_amount = amount / self.prices['BTC/USDT']

            # Step 2: BTC → ETH
            eth_amount = btc_amount / self.prices['ETH/BTC']

            # Step 3: ETH → USDT
            final_usdt = eth_amount * self.prices['ETH/USDT']

        # 扣除手续费（0.1% × 3 = 0.3%）
        final_usdt = final_usdt * (1 - 0.001) ** 3

        # 计算利润百分比
        profit = ((final_usdt - amount) / amount) * 100

        return profit

# 运行监控
monitor = TriangleArbitrageMonitor()
asyncio.run(monitor.connect_websocket())
\`\`\`

#### 2. 套利机会计算优化

**考虑滑点和市场深度：**

\`\`\`python
def calculate_profit_with_slippage(self, triangle, amount):
    """计算考虑滑点的实际利润"""

    # 获取订单簿深度
    orderbook_btc_usdt = self.exchange.fetch_order_book('BTC/USDT', limit=20)
    orderbook_eth_btc = self.exchange.fetch_order_book('ETH/BTC', limit=20)
    orderbook_eth_usdt = self.exchange.fetch_order_book('ETH/USDT', limit=20)

    # Step 1: 计算买入 BTC 的平均价格（考虑订单簿深度）
    btc_amount = 0
    usdt_spent = 0

    for ask in orderbook_btc_usdt['asks']:
        price, volume = ask[0], ask[1]

        if usdt_spent + (price * volume) <= amount:
            btc_amount += volume
            usdt_spent += price * volume
        else:
            remaining_usdt = amount - usdt_spent
            btc_amount += remaining_usdt / price
            usdt_spent = amount
            break

    avg_btc_price = usdt_spent / btc_amount if btc_amount > 0 else 0

    # Step 2-3: 类似计算 ETH/BTC 和 ETH/USDT
    # （省略详细代码，逻辑相同）

    # 返回考虑滑点后的实际利润
    return profit_percentage
\`\`\`

---

### 阶段三：自动执行套利交易（关键步骤）

#### 1. 下单执行逻辑

**并行执行三笔订单：**

\`\`\`python
import asyncio

async def execute_arbitrage(self, triangle, initial_amount):
    """执行三角套利交易"""

    try:
        print(f"\\n开始执行套利: {triangle['name']}")
        print(f"初始金额: {initial_amount} USDT")

        # Step 1: 买入 BTC
        print("Step 1: 买入 BTC...")
        order1 = self.exchange.create_market_buy_order(
            'BTC/USDT',
            initial_amount / self.prices['BTC/USDT']
        )

        btc_amount = order1['filled']
        print(f"✅ 买入 {btc_amount} BTC")

        # 等待订单完全成交
        await asyncio.sleep(0.5)

        # Step 2: 用 BTC 买入 ETH
        print("Step 2: 买入 ETH...")
        order2 = self.exchange.create_market_buy_order(
            'ETH/BTC',
            btc_amount
        )

        eth_amount = order2['filled']
        print(f"✅ 买入 {eth_amount} ETH")

        await asyncio.sleep(0.5)

        # Step 3: 卖出 ETH 换回 USDT
        print("Step 3: 卖出 ETH...")
        order3 = self.exchange.create_market_sell_order(
            'ETH/USDT',
            eth_amount
        )

        final_usdt = order3['cost']
        print(f"✅ 卖出 ETH，获得 {final_usdt} USDT")

        # 计算实际利润
        profit = final_usdt - initial_amount
        profit_pct = (profit / initial_amount) * 100

        print(f"\\n💰 套利完成！")
        print(f"初始: {initial_amount} USDT")
        print(f"最终: {final_usdt} USDT")
        print(f"利润: {profit:.2f} USDT ({profit_pct:.2f}%)")

        return profit

    except Exception as e:
        print(f"❌ 套利执行失败: {str(e)}")
        # 紧急平仓逻辑
        await self.emergency_close_positions()
        return 0
\`\`\`

#### 2. 风险控制与止损

**设置最大损失限制：**

\`\`\`python
class RiskManager:
    def __init__(self, max_loss_per_trade=50, max_daily_loss=500):
        self.max_loss_per_trade = max_loss_per_trade  # 单笔最大损失 50 USDT
        self.max_daily_loss = max_daily_loss  # 日最大损失 500 USDT
        self.daily_loss = 0
        self.consecutive_losses = 0

    def can_trade(self, estimated_profit):
        """检查是否可以继续交易"""

        # 如果预期利润太小，不值得冒险
        if estimated_profit < 0.3:
            print("❌ 预期利润太小，跳过")
            return False

        # 如果今日损失超过限制，停止交易
        if self.daily_loss >= self.max_daily_loss:
            print("❌ 今日损失已达上限，停止交易")
            return False

        # 如果连续亏损 5 次，暂停交易 1 小时
        if self.consecutive_losses >= 5:
            print("❌ 连续亏损过多，暂停交易")
            return False

        return True

    def record_trade(self, profit):
        """记录交易结果"""
        if profit < 0:
            self.daily_loss += abs(profit)
            self.consecutive_losses += 1
        else:
            self.consecutive_losses = 0  # 重置连续亏损计数
\`\`\`

---

### 阶段四：部署到 VPS 运行（1 天）

#### 1. 选择低延迟 VPS

**推荐服务器位置：**

| 交易所 | 服务器位置 | VPS 推荐 | 延迟 |
|--------|-----------|---------|------|
| Binance | 东京/新加坡 | AWS Tokyo, Vultr Singapore | 5-15ms |
| OKX | 香港/新加坡 | AWS Hong Kong, DigitalOcean SG | 8-20ms |
| Bybit | 新加坡 | Vultr Singapore | 5-10ms |

**VPS 配置建议：**
\`\`\`
CPU: 2 核心
内存: 4GB
存储: 20GB SSD
网络: 1Gbps
成本: $10-20/月
\`\`\`

#### 2. 使用 PM2 守护进程

**安装和配置 PM2：**

\`\`\`bash
# 安装 PM2
npm install -g pm2

# 启动套利程序
pm2 start triangle_arbitrage.py --name "binance-triangle-arb" --interpreter python3

# 设置开机自启动
pm2 startup
pm2 save

# 查看日志
pm2 logs binance-triangle-arb

# 监控资源使用
pm2 monit
\`\`\`

---

## ⚠️ 风险提示

### 主要风险

| 风险类型 | 严重程度 | 发生概率 | 应对措施 |
|---------|---------|---------|---------|
| **网络延迟** | 🔴 高 | 中 | 使用 VPS，WebSocket 连接 |
| **滑点损失** | 🟡 中 | 高 | 仅在高流动性时段交易 |
| **价格突变** | 🔴 高 | 低 | 设置止损，限制单笔金额 |
| **API 限流** | 🟡 中 | 中 | 控制请求频率，使用多账户 |
| **交易所风险** | 🟡 中 | 低 | 分散资金，不存放大额 |

### 常见陷阱

#### 陷阱 1：忽略提现手续费

**问题：**
\`\`\`
你在 Binance 赚了 100 USDT，但提现到钱包需要 20 USDT 手续费
实际利润：80 USDT
\`\`\`

**解决方案：**
- 在单个交易所内循环套利，不频繁提现
- 累积利润达到一定金额（如 1,000 USDT）再提现

#### 陷阱 2：过度优化导致错过机会

**问题：**
\`\`\`
等待利润 > 1% 的"完美"机会
结果：一天只有 2-3 次机会，实际收益低
\`\`\`

**解决方案：**
- 降低利润阈值到 0.3-0.5%
- 增加交易频率，积少成多

---

## 💡 实战技巧

### 技巧 1：使用 VIP 费率降低成本

**Binance VIP 费率等级：**

| VIP 等级 | 30 日交易量 | Maker 费率 | Taker 费率 |
|---------|------------|-----------|-----------|
| VIP 0 | < $1M | 0.1000% | 0.1000% |
| VIP 1 | ≥ $1M | 0.0900% | 0.1000% |
| VIP 2 | ≥ $5M | 0.0800% | 0.1000% |
| VIP 3 | ≥ $10M | 0.0550% | 0.0800% |

**降低成本策略：**
- 使用 BNB 抵扣手续费（额外 25% 折扣）
- 达到 VIP 1 等级（月交易量 $1M）
- 总手续费：0.075% × 3 = 0.225%（节省 25%）

### 技巧 2：多三角组合并行监控

**同时监控 10+ 个三角套利路径：**

\`\`\`python
triangles = [
    ['BTC/USDT', 'ETH/BTC', 'ETH/USDT'],
    ['BTC/USDT', 'BNB/BTC', 'BNB/USDT'],
    ['BTC/USDT', 'SOL/BTC', 'SOL/USDT'],
    ['ETH/USDT', 'SOL/ETH', 'SOL/USDT'],
    ['BTC/USDT', 'XRP/BTC', 'XRP/USDT'],
    # ... 更多组合
]

# 并行检查所有三角套利机会
for triangle in triangles:
    asyncio.create_task(check_triangle(triangle))
\`\`\`

### 技巧 3：基于历史数据回测

**使用历史数据测试策略：**

\`\`\`python
import pandas as pd

# 下载历史 Tick 数据
historical_data = exchange.fetch_ohlcv('BTC/USDT', '1m', limit=1000)

# 回测三角套利策略
for i in range(len(historical_data) - 3):
    # 模拟三次交易
    profit = simulate_triangle_arbitrage(historical_data[i:i+3])

    if profit > 0.5:
        print(f"Time: {historical_data[i][0]}, Profit: {profit}%")

# 计算总收益
total_profit = sum(all_profits)
print(f"回测总收益: {total_profit}%")
\`\`\`

---

## ❓ 常见问题

### Q1: 三角套利需要多少初始资金？

**推荐配置：**

\`\`\`
最低启动资金：1,000 USDT
- 单次套利金额：500-800 USDT
- 预留缓冲：200-500 USDT

理想资金：10,000 USDT
- 单次套利金额：3,000-5,000 USDT
- 降低滑点影响
- 提高 VIP 等级

专业级：50,000+ USDT
- 可分散到多个三角套利路径
- 更高的资金利用率
\`\`\`

### Q2: 程序运行需要一直盯盘吗？

**不需要，但需要监控：**

- 设置 Telegram 告警机器人
- 每日检查交易日志（5-10 分钟）
- 每周查看盈亏报表
- 出现异常时人工介入

### Q3: 如何处理交易所 API 限流？

**应对策略：**

\`\`\`python
# 1. 使用 ccxt 内置限流
exchange = ccxt.binance({
    'enableRateLimit': True,  # 自动限流
    'rateLimit': 50  # 每 50ms 一个请求
})

# 2. 使用多个 API Key 轮询
api_keys = [
    {'apiKey': 'key1', 'secret': 'secret1'},
    {'apiKey': 'key2', 'secret': 'secret2'}
]

current_key = 0

def get_exchange():
    global current_key
    exchange = ccxt.binance(api_keys[current_key])
    current_key = (current_key + 1) % len(api_keys)
    return exchange

# 3. 使用 WebSocket 代替 REST API（推荐）
# WebSocket 没有严格的请求限制
\`\`\`

### Q4: 三角套利的最佳时间段是什么？

**高波动时段（套利机会多）：**

- **北京时间 21:00-23:00**（欧洲开盘）
- **北京时间 22:00-02:00**（美国开盘）
- **重大新闻发布时**（如 FOMC 会议、非农数据）

**低波动时段（避免交易）：**
- 周末凌晨（流动性极低）
- 节假日（交易量萎缩）

---

## 📚 补充资源

### 推荐工具

1. **开发框架：**
   - ccxt（Python/JavaScript 交易所统一 API）
   - freqtrade（开源量化交易框架）
   - Hummingbot（做市和套利机器人）

2. **数据监控：**
   - TradingView（实时价格图表）
   - CoinGecko API（价格数据）
   - Binance WebSocket（毫秒级数据流）

3. **VPS 服务商：**
   - Vultr（全球数据中心，$5/月起）
   - AWS Lightsail（稳定可靠，$10/月起）
   - DigitalOcean（开发者友好，$6/月起）

### 相关阅读

- [Binance API 官方文档](https://binance-docs.github.io/apidocs/)
- [ccxt 库完整教程](https://github.com/ccxt/ccxt)
- [三角套利数学原理](https://www.investopedia.com/terms/t/triangulararbitrage.asp)

---

## 📋 总结

### 策略优势

✅ **自动化程度高，无需人工盯盘**
✅ **风险可控，不受市场方向影响**
✅ **资金利用率高（分钟级循环）**
✅ **收益稳定（月化 15-80%）**

### 策略劣势

❌ **需要编程能力（Python/Node.js）**
❌ **需要 VPS 服务器（额外成本）**
❌ **竞争激烈（机器人之间博弈）**
❌ **手续费侵蚀利润（需 VIP 等级）**

### 适合人群

- ✅ 熟悉编程的技术型投资者
- ✅ 有量化交易经验的专业玩家
- ✅ 愿意学习 API 开发的新手（学习成本高）
- ✅ 拥有 10,000+ USDT 初始资金

---

**🎯 立即行动：** 开通 Binance API，部署三角套利监控程序，捕捉微小价差，积少成多！

> ⚠️ **免责声明：** 三角套利需要编程和量化交易知识，存在技术风险和市场风险。建议先用小额资金测试，确认策略有效后再加大投入。`,

  steps: [
    {
      step_number: 1,
      title: '开通交易所 API',
      description: '在 Binance/OKX 创建 API Key，设置现货交易权限，绑定 IP 白名单，确保 API 安全。',
      estimated_time: '30 分钟'
    },
    {
      step_number: 2,
      title: '搭建开发环境',
      description: '安装 Python/Node.js、ccxt 库、WebSocket 客户端，配置 .env 文件存储 API 密钥。',
      estimated_time: '1-2 小时'
    },
    {
      step_number: 3,
      title: '开发价格监控程序',
      description: '使用 WebSocket 连接交易所实时价格流，监控 BTC/ETH/USDT 等三角套利路径的价格变化。',
      estimated_time: '1-2 天'
    },
    {
      step_number: 4,
      title: '编写套利计算逻辑',
      description: '实现三角套利利润计算函数，考虑手续费（0.3%）、滑点（0.15%）、网络延迟等成本因素。',
      estimated_time: '1 天'
    },
    {
      step_number: 5,
      title: '实现自动下单功能',
      description: '开发自动执行三笔市价订单的逻辑，设置并发执行、异常处理、紧急止损机制。',
      estimated_time: '2-3 天'
    },
    {
      step_number: 6,
      title: '回测与优化',
      description: '使用历史 Tick 数据回测策略，调整利润阈值（0.3-0.5%）、优化交易频率和风险参数。',
      estimated_time: '1-2 天'
    },
    {
      step_number: 7,
      title: '部署到 VPS 运行',
      description: '租用东京/新加坡 VPS（低延迟），使用 PM2 守护进程运行套利程序，设置 Telegram 告警。',
      estimated_time: '半天'
    },
    {
      step_number: 8,
      title: '监控与维护',
      description: '每日检查交易日志、盈亏情况，每周优化三角套利路径，根据市场变化调整参数。',
      estimated_time: '持续进行'
    }
  ],

  status: 'published',
  featured: false
};

const STRATEGY_19_2 = {
  title: 'Uniswap 链上三角套利 - 闪电贷单笔获利',
  slug: 'triangle-arbitrage-19-2-uniswap-flash-loan',
  summary: '使用 Aave 闪电贷在 Uniswap 执行 WETH→DAI→USDC→WETH 三角套利，无需本金，单笔交易完成套利。适合熟悉智能合约开发的 DeFi 高级玩家。',

  category: 'triangle-arbitrage',
  category_l1: 'arbitrage',
  category_l2: '三角/跨链套利',

  difficulty_level: 'expert',
  risk_level: 3,

  apy_min: 20,
  apy_max: 150,
  min_investment: 0,
  time_commitment: 'medium',

  required_tools: [
    'Aave V3（闪电贷）',
    'Uniswap V2/V3',
    'Solidity（智能合约）',
    'Hardhat/Foundry',
    'Etherscan',
    'Alchemy/Infura RPC',
    'Tenderly（模拟交易）',
    'Flashbots（MEV 保护）'
  ],

  content: `# Uniswap 链上三角套利 - 闪电贷单笔获利

> **预计阅读时间：** 20 分钟
> **难度等级：** 专家级
> **风险等级：** ⚠️⚠️⚠️ 中等（3/5）

---

## 📖 小张的闪电贷套利首秀

2024 年 3 月，智能合约开发者小张（2 年 Solidity 经验）发现了链上三角套利机会：

**链上数据观察：**
- Uniswap V2 WETH/DAI 池：1 WETH = 2,500 DAI
- Uniswap V3 DAI/USDC 池：1 DAI = 1.002 USDC
- Uniswap V2 USDC/WETH 池：2,480 USDC = 1 WETH
- **理论套利空间：** (2,500 × 1.002 - 2,480) / 2,480 = 1.02%

**问题：没有本金！**

小张的钱包里只有 0.1 ETH（约 $250），根本不够执行大额套利。

**解决方案：Aave 闪电贷！**

闪电贷允许你在**同一笔交易内**借入巨额资金（无需抵押），只要在交易结束前归还即可。

**第一次闪电贷套利：**

1. 从 Aave 借入 100 WETH（无抵押）
2. 在 Uniswap V2 用 100 WETH 买入 250,000 DAI
3. 在 Uniswap V3 用 250,000 DAI 买入 250,500 USDC
4. 在 Uniswap V2 用 250,500 USDC 买入 101.01 WETH
5. 归还 Aave 100.09 WETH（本金 + 0.09% 手续费）
6. **净利润：** 0.92 WETH（约 $2,300，扣除 Gas 费约 $50 后，净赚 $2,250）

**交易状态：**
- ✅ 成功！单笔交易获利 0.92 WETH
- Gas 费用：0.02 ETH（约 $50，Gwei = 30）
- 实际利润：0.90 WETH（$2,250）

**一个月后：**
- 执行套利次数：23 次
- 成功率：78%（18 次盈利，5 次失败被抢跑）
- 平均单次利润：0.6 WETH（$1,500）
- 总利润：10.8 WETH（$27,000）
- Gas 费总计：0.5 ETH（$1,250）
- **净利润：** 10.3 WETH（$25,750）

> 💡 **关键启示：** 闪电贷三角套利无需本金，但需要智能合约开发能力和 MEV 保护策略。成功的关键是速度和 Gas 费优化。

---

## 🎯 策略核心逻辑

### 什么是闪电贷三角套利？

**闪电贷（Flash Loan）原理：**

\`\`\`
传统借贷：
1. 你抵押 $10,000 BTC
2. 借出 $7,000 USDT（70% LTV）
3. 14 天后归还 + 利息

闪电贷：
1. 在一笔交易开始时借入 $1,000,000 USDT（无抵押）
2. 在同一笔交易内执行套利操作
3. 在同一笔交易结束前归还本金 + 手续费（0.09%）
4. 如果无法归还，整笔交易回滚（Revert），就像从未发生

关键：必须在同一个区块内完成所有操作！
\`\`\`

**链上三角套利流程：**

\`\`\`
Step 1: 调用 Aave flashLoan()
借入 100 WETH（闪电贷）

Step 2: Uniswap V2 交换
100 WETH → 250,000 DAI

Step 3: Uniswap V3 交换
250,000 DAI → 250,500 USDC

Step 4: Uniswap V2 交换
250,500 USDC → 101.01 WETH

Step 5: 归还闪电贷
归还 100.09 WETH 给 Aave（本金 + 0.09% 手续费）

Step 6: 利润提取
剩余 0.92 WETH 转入你的钱包

如果 Step 5 失败（资金不足归还），整笔交易回滚，你只损失 Gas 费
\`\`\`

---

## 📊 闪电贷平台对比

### 主流闪电贷平台

| 平台 | 手续费 | 最大借款额 | 支持代币 | Gas 费 | 推荐指数 |
|------|--------|-----------|---------|--------|---------|
| **Aave V3** | 0.09% | $500M+ | 30+ | 中 | ⭐⭐⭐⭐⭐ |
| **dYdX** | 0% | $100M+ | ETH, USDC, DAI | 低 | ⭐⭐⭐⭐ |
| **Balancer** | 0.00% | $50M+ | 100+ | 高 | ⭐⭐⭐ |
| **Uniswap V3** | 0.05% | Pool 流动性 | 任意 ERC20 | 中 | ⭐⭐⭐⭐ |

### 链上三角套利路径示例

| 套利路径 | 套利频率 | 平均利润 | Gas 费 | 难度 |
|---------|---------|---------|--------|------|
| WETH→DAI→USDC→WETH | 高（每小时 5-10 次） | 0.3-1.5% | 0.015 ETH | 中 |
| WETH→USDT→DAI→WETH | 中（每小时 3-5 次） | 0.5-2% | 0.02 ETH | 中 |
| WBTC→WETH→USDC→WBTC | 低（每天 2-3 次） | 1-3% | 0.025 ETH | 高 |
| WETH→UNI→USDC→WETH | 中（每小时 4-6 次） | 0.4-1.8% | 0.018 ETH | 中 |

---

## 🚀 完整套利流程

### 阶段一：环境搭建（1-2 天）

#### 1. 安装 Hardhat 开发框架

\`\`\`bash
# 创建项目目录
mkdir flash-loan-arbitrage
cd flash-loan-arbitrage

# 初始化 npm 项目
npm init -y

# 安装 Hardhat
npm install --save-dev hardhat @nomiclabs/hardhat-waffle ethereum-waffle chai @nomiclabs/hardhat-ethers ethers

# 初始化 Hardhat 项目
npx hardhat

# 安装 OpenZeppelin 合约库
npm install @openzeppelin/contracts

# 安装 Aave V3 合约
npm install @aave/core-v3
\`\`\`

#### 2. 配置 Hardhat

**hardhat.config.js：**

\`\`\`javascript
require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
      forking: {
        url: process.env.ALCHEMY_MAINNET_URL,  // 使用主网分叉测试
        blockNumber: 18500000  // 指定区块高度
      }
    },
    mainnet: {
      url: process.env.ALCHEMY_MAINNET_URL,
      accounts: [process.env.PRIVATE_KEY],
      gasPrice: 30000000000  // 30 Gwei
    }
  }
};
\`\`\`

---

### 阶段二：编写智能合约（2-3 天）

#### 1. 闪电贷套利合约

**contracts/FlashLoanArbitrage.sol：**

\`\`\`solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@aave/core-v3/contracts/flashloan/base/FlashLoanSimpleReceiverBase.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";

contract FlashLoanArbitrage is FlashLoanSimpleReceiverBase {
    address private owner;

    // Uniswap V2 Router
    IUniswapV2Router02 public immutable uniswapV2Router;

    // 代币地址
    address public constant WETH = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    address public constant DAI = 0x6B175474E89094C44Da98b954EedeAC495271d0F;
    address public constant USDC = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;

    event ArbitrageExecuted(
        address indexed token,
        uint256 amount,
        uint256 profit
    );

    constructor(address _addressProvider, address _uniswapRouter)
        FlashLoanSimpleReceiverBase(IPoolAddressesProvider(_addressProvider))
    {
        owner = msg.sender;
        uniswapV2Router = IUniswapV2Router02(_uniswapRouter);
    }

    /**
     * @dev 执行闪电贷套利
     * @param asset 借入的代币地址（WETH）
     * @param amount 借入金额
     */
    function executeArbitrage(address asset, uint256 amount) external {
        require(msg.sender == owner, "Only owner");

        address receiverAddress = address(this);
        bytes memory params = "";
        uint16 referralCode = 0;

        POOL.flashLoanSimple(
            receiverAddress,
            asset,
            amount,
            params,
            referralCode
        );
    }

    /**
     * @dev Aave 闪电贷回调函数
     * 这个函数会在借入资金后自动调用
     */
    function executeOperation(
        address asset,
        uint256 amount,
        uint256 premium,
        address initiator,
        bytes calldata params
    ) external override returns (bool) {
        require(msg.sender == address(POOL), "Caller must be POOL");

        // 此时，我们已经收到了 100 WETH
        uint256 amountOwed = amount + premium;  // 需要归还的总额

        // 执行三角套利
        uint256 profit = _executeTriangleArbitrage(amount);

        // 确保有足够的资金归还闪电贷
        require(
            IERC20(asset).balanceOf(address(this)) >= amountOwed,
            "Not enough funds to repay"
        );

        // 授权 Aave 扣款
        IERC20(asset).approve(address(POOL), amountOwed);

        emit ArbitrageExecuted(asset, amount, profit);

        return true;
    }

    /**
     * @dev 执行三角套利逻辑
     * WETH → DAI → USDC → WETH
     */
    function _executeTriangleArbitrage(uint256 wethAmount) private returns (uint256) {
        uint256 deadline = block.timestamp + 300;  // 5 分钟有效期

        // Step 1: WETH → DAI (Uniswap V2)
        IERC20(WETH).approve(address(uniswapV2Router), wethAmount);

        address[] memory path1 = new address[](2);
        path1[0] = WETH;
        path1[1] = DAI;

        uint[] memory amounts1 = uniswapV2Router.swapExactTokensForTokens(
            wethAmount,
            0,  // 接受任何数量的 DAI（生产环境需设置最小值）
            path1,
            address(this),
            deadline
        );

        uint256 daiAmount = amounts1[1];

        // Step 2: DAI → USDC (Uniswap V3 或 V2)
        IERC20(DAI).approve(address(uniswapV2Router), daiAmount);

        address[] memory path2 = new address[](2);
        path2[0] = DAI;
        path2[1] = USDC;

        uint[] memory amounts2 = uniswapV2Router.swapExactTokensForTokens(
            daiAmount,
            0,
            path2,
            address(this),
            deadline
        );

        uint256 usdcAmount = amounts2[1];

        // Step 3: USDC → WETH (Uniswap V2)
        IERC20(USDC).approve(address(uniswapV2Router), usdcAmount);

        address[] memory path3 = new address[](2);
        path3[0] = USDC;
        path3[1] = WETH;

        uint[] memory amounts3 = uniswapV2Router.swapExactTokensForTokens(
            usdcAmount,
            wethAmount,  // 至少要换回借入的 WETH 数量
            path3,
            address(this),
            deadline
        );

        uint256 finalWethAmount = amounts3[1];

        // 计算利润
        uint256 profit = finalWethAmount > wethAmount ? finalWethAmount - wethAmount : 0;

        return profit;
    }

    /**
     * @dev 提取利润
     */
    function withdrawProfit(address token) external {
        require(msg.sender == owner, "Only owner");
        uint256 balance = IERC20(token).balanceOf(address(this));
        IERC20(token).transfer(owner, balance);
    }

    receive() external payable {}
}
\`\`\`

---

### 阶段三：测试与部署（1-2 天）

#### 1. 使用 Hardhat 本地测试

**test/flashloan-arbitrage.test.js：**

\`\`\`javascript
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FlashLoan Arbitrage", function () {
  let flashLoanArbitrage;
  let owner;

  const AAVE_POOL_ADDRESS_PROVIDER = "0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e";
  const UNISWAP_V2_ROUTER = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
  const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

  beforeEach(async function () {
    [owner] = await ethers.getSigners();

    const FlashLoanArbitrage = await ethers.getContractFactory("FlashLoanArbitrage");
    flashLoanArbitrage = await FlashLoanArbitrage.deploy(
      AAVE_POOL_ADDRESS_PROVIDER,
      UNISWAP_V2_ROUTER
    );

    await flashLoanArbitrage.deployed();
  });

  it("Should execute flash loan arbitrage successfully", async function () {
    const borrowAmount = ethers.utils.parseEther("100");  // 借入 100 WETH

    // 执行闪电贷套利
    const tx = await flashLoanArbitrage.executeArbitrage(
      WETH_ADDRESS,
      borrowAmount
    );

    const receipt = await tx.wait();

    // 检查事件
    const event = receipt.events?.find(e => e.event === "ArbitrageExecuted");
    expect(event).to.not.be.undefined;

    console.log(\\\`Profit: \${ethers.utils.formatEther(event.args.profit)} WETH\\\`);
  });
});
\`\`\`

**运行测试：**

\`\`\`bash
# 使用主网分叉进行测试
npx hardhat test --network hardhat

# 预期输出
# ✓ Should execute flash loan arbitrage successfully (5000ms)
# Profit: 0.92 WETH
\`\`\`

#### 2. 使用 Tenderly 模拟交易

**在部署到主网前，先用 Tenderly 模拟：**

\`\`\`bash
# 安装 Tenderly CLI
npm install -g @tenderly/cli

# 登录 Tenderly
tenderly login

# 模拟交易
tenderly simulate \\
  --network-id 1 \\
  --from 0xYourAddress \\
  --to 0xFlashLoanContractAddress \\
  --input 0x... \\
  --gas 500000
\`\`\`

#### 3. 部署到主网

**部署脚本 scripts/deploy.js：**

\`\`\`javascript
const hre = require("hardhat");

async function main() {
  const AAVE_POOL_ADDRESS_PROVIDER = "0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e";
  const UNISWAP_V2_ROUTER = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

  const FlashLoanArbitrage = await hre.ethers.getContractFactory("FlashLoanArbitrage");
  const flashLoanArbitrage = await FlashLoanArbitrage.deploy(
    AAVE_POOL_ADDRESS_PROVIDER,
    UNISWAP_V2_ROUTER
  );

  await flashLoanArbitrage.deployed();

  console.log("FlashLoanArbitrage deployed to:", flashLoanArbitrage.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
\`\`\`

**部署命令：**

\`\`\`bash
npx hardhat run scripts/deploy.js --network mainnet

# 输出
# FlashLoanArbitrage deployed to: 0x123abc...
\`\`\`

---

### 阶段四：监控与执行（持续进行）

#### 1. 监控链上套利机会

**使用 ethers.js 监控价格：**

\`\`\`javascript
const { ethers } = require("ethers");

const provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_URL);

// Uniswap V2 Pair 合约 ABI（简化版）
const PAIR_ABI = [
  "function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)"
];

// WETH/DAI Pair
const wethDaiPair = new ethers.Contract("0xA478c2975Ab1Ea89e8196811F51A7B7Ade33eB11", PAIR_ABI, provider);

// DAI/USDC Pair
const daiUsdcPair = new ethers.Contract("0xAE461cA67B15dc8dc81CE7615e0320dA1A9aB8D5", PAIR_ABI, provider);

// USDC/WETH Pair
const usdcWethPair = new ethers.Contract("0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc", PAIR_ABI, provider);

async function monitorArbitrage() {
  // 获取所有池子的储备量
  const [wethDaiReserves, daiUsdcReserves, usdcWethReserves] = await Promise.all([
    wethDaiPair.getReserves(),
    daiUsdcPair.getReserves(),
    usdcWethPair.getReserves()
  ]);

  // 计算价格
  const wethDaiPrice = wethDaiReserves.reserve1 / wethDaiReserves.reserve0;  // DAI per WETH
  const daiUsdcPrice = daiUsdcReserves.reserve1 / daiUsdcReserves.reserve0;  // USDC per DAI
  const usdcWethPrice = usdcWethReserves.reserve0 / usdcWethReserves.reserve1;  // USDC per WETH

  // 计算套利空间
  const impliedUsdcPerWeth = wethDaiPrice * daiUsdcPrice;
  const arbitrageOpportunity = ((impliedUsdcPerWeth - usdcWethPrice) / usdcWethPrice) * 100;

  console.log(\\\`
  ╔═══════════════════════════════════════╗
  ║   Uniswap 三角套利监控                 ║
  ╚═══════════════════════════════════════╝

  WETH/DAI: \${wethDaiPrice.toFixed(2)} DAI/WETH
  DAI/USDC: \${daiUsdcPrice.toFixed(4)} USDC/DAI
  USDC/WETH: \${usdcWethPrice.toFixed(2)} USDC/WETH

  隐含 USDC/WETH 价格: \${impliedUsdcPerWeth.toFixed(2)}
  套利空间: \${arbitrageOpportunity.toFixed(2)}%
  \\\`);

  // 如果套利空间 > 0.5%（扣除成本后仍有利润）
  if (arbitrageOpportunity > 0.5) {
    console.log("🚨 发现套利机会！准备执行闪电贷...");
    await executeFlashLoan();
  }
}

// 每 12 秒（一个区块）检查一次
setInterval(monitorArbitrage, 12000);
\`\`\`

#### 2. 使用 Flashbots 防止被抢跑

**安装 Flashbots SDK：**

\`\`\`bash
npm install @flashbots/ethers-provider-bundle
\`\`\`

**发送私密交易：**

\`\`\`javascript
const { FlashbotsBundleProvider } = require("@flashbots/ethers-provider-bundle");
const { ethers } = require("ethers");

async function executeFlashLoan() {
  const provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  // 连接到 Flashbots
  const flashbotsProvider = await FlashbotsBundleProvider.create(
    provider,
    wallet,
    "https://relay.flashbots.net"
  );

  // 准备交易
  const contract = new ethers.Contract(FLASH_LOAN_CONTRACT, ABI, wallet);
  const tx = await contract.populateTransaction.executeArbitrage(
    WETH_ADDRESS,
    ethers.utils.parseEther("100")
  );

  // 发送到 Flashbots（不会被公开到 mempool）
  const signedBundle = await flashbotsProvider.signBundle([
    {
      signer: wallet,
      transaction: tx
    }
  ]);

  const targetBlock = (await provider.getBlockNumber()) + 1;
  const simulation = await flashbotsProvider.simulate(signedBundle, targetBlock);

  if (simulation.firstRevert) {
    console.log("❌ 模拟失败:", simulation.firstRevert);
    return;
  }

  // 提交到 Flashbots
  const bundleSubmission = await flashbotsProvider.sendRawBundle(
    signedBundle,
    targetBlock
  );

  console.log("✅ Bundle 已提交到 Flashbots");

  // 等待上链
  const receipt = await bundleSubmission.wait();

  if (receipt === 0) {
    console.log("✅ 交易成功上链！");
  } else {
    console.log("❌ 交易未被打包");
  }
}
\`\`\`

---

## ⚠️ 风险提示

### 主要风险

| 风险类型 | 严重程度 | 发生概率 | 应对措施 |
|---------|---------|---------|---------|
| **MEV 抢跑** | 🔴 高 | 高 | 使用 Flashbots 私密交易 |
| **Gas 费暴涨** | 🟡 中 | 中 | 设置 Gas 上限，放弃低利润交易 |
| **智能合约漏洞** | 🔴 高 | 低 | 审计合约，使用 Tenderly 模拟 |
| **价格突变** | 🟡 中 | 中 | 设置最小利润阈值，快速执行 |
| **闪电贷失败** | 🟡 中 | 低 | 充分测试，确保逻辑正确 |

---

## 💡 实战技巧

### 技巧 1：使用 dYdX 零手续费闪电贷

dYdX 提供**完全免费**的闪电贷（0% 手续费），但仅支持 WETH、USDC、DAI。

**对比：**
- Aave：0.09% 手续费（100 WETH 需支付 0.09 WETH = $225）
- dYdX：0% 手续费（节省 $225）

### 技巧 2：批量检查多个三角路径

**同时监控 20+ 个三角套利组合：**

\`\`\`javascript
const triangles = [
  ['WETH', 'DAI', 'USDC'],
  ['WETH', 'USDT', 'DAI'],
  ['WETH', 'UNI', 'USDC'],
  ['WBTC', 'WETH', 'USDC'],
  // ... 更多组合
];

for (const triangle of triangles) {
  const opportunity = await checkArbitrage(triangle);
  if (opportunity > 0.5) {
    console.log(\\\`发现机会: \${triangle.join(' → ')}\\\`);
  }
}
\`\`\`

### 技巧 3：Gas 费优化

**减少 Gas 消耗：**
- 使用 \`calldata\` 代替 \`memory\`
- 避免不必要的 \`SSTORE\` 操作
- 合并多个 \`approve\` 调用
- 使用 Solidity 0.8.20+ 优化器

---

## ❓ 常见问题

### Q1: 闪电贷套利需要本金吗？

**不需要本金用于套利，但需要 Gas 费：**

- 单次交易 Gas 费：0.015-0.03 ETH（$37-$75）
- 建议准备 0.5 ETH 作为 Gas 费储备
- 失败交易也会消耗 Gas（约 50% 的成功交易 Gas）

### Q2: 如何防止被 MEV 机器人抢跑？

**使用 Flashbots 或 Eden Network：**

1. **Flashbots：** 私密交易池，不公开到 mempool
2. **Eden Network：** 质押 EDEN 代币，优先打包
3. **私有 RPC：** 使用 Alchemy/Infura 私有节点

### Q3: 智能合约审计贵吗？

**审计成本：**
- 专业审计（CertiK/PeckShield）：$5,000-$20,000
- 社区审计（Code4rena）：$1,000-$5,000
- 自助工具（Slither/Mythril）：免费

**建议：**
- 个人使用：自助工具 + Tenderly 模拟
- 团队/商业使用：专业审计

---

## 📚 补充资源

### 推荐工具

1. **开发框架：**
   - Hardhat（最流行的智能合约开发框架）
   - Foundry（Rust 实现，速度更快）
   - Remix（在线 IDE，适合快速测试）

2. **测试模拟：**
   - Tenderly（可视化调试和模拟）
   - Hardhat Network Forking（本地主网分叉）
   - Ganache（本地区块链）

3. **MEV 保护：**
   - Flashbots（私密交易池）
   - Eden Network（优先打包）
   - Blocker（反 MEV 工具）

### 相关阅读

- [Aave V3 闪电贷文档](https://docs.aave.com/developers/guides/flash-loans)
- [Uniswap V2 智能合约](https://docs.uniswap.org/contracts/v2/overview)
- [Flashbots 完整指南](https://docs.flashbots.net/)

---

## 📋 总结

### 策略优势

✅ **无需本金（仅需 Gas 费）**
✅ **单笔交易完成，风险极低**
✅ **可扩展到多条套利路径**
✅ **利润空间大（0.5-3%）**

### 策略劣势

❌ **需要智能合约开发能力**
❌ **MEV 竞争激烈（易被抢跑）**
❌ **Gas 费高昂（失败也消耗）**
❌ **需要持续监控和优化**

### 适合人群

- ✅ Solidity 智能合约开发者
- ✅ DeFi 协议深度理解者
- ✅ 有 MEV 防护经验的高级玩家
- ✅ 愿意投入时间学习和优化

---

**🎯 立即行动：** 学习 Solidity，开发闪电贷套利合约，使用 Flashbots 保护交易，捕捉链上套利机会！

> ⚠️ **免责声明：** 闪电贷套利需要智能合约开发能力，存在技术风险和 MEV 风险。建议先在测试网充分测试，再部署到主网。`,

  steps: [
    {
      step_number: 1,
      title: '学习 Solidity 基础',
      description: '掌握 Solidity 智能合约开发、ERC20 代币交互、Uniswap 和 Aave 协议集成。',
      estimated_time: '1-2 周（如已有基础可跳过）'
    },
    {
      step_number: 2,
      title: '搭建 Hardhat 开发环境',
      description: '安装 Node.js、Hardhat、ethers.js，配置 Alchemy RPC 节点，设置主网分叉测试环境。',
      estimated_time: '半天'
    },
    {
      step_number: 3,
      title: '编写闪电贷套利合约',
      description: '开发 FlashLoanArbitrage 合约，集成 Aave V3 闪电贷和 Uniswap V2/V3 交换逻辑。',
      estimated_time: '2-3 天'
    },
    {
      step_number: 4,
      title: '本地测试与模拟',
      description: '使用 Hardhat Network Forking 在本地主网分叉测试，用 Tenderly 模拟真实交易。',
      estimated_time: '1-2 天'
    },
    {
      step_number: 5,
      title: '部署到主网',
      description: '使用 Hardhat 部署合约到以太坊主网，在 Etherscan 验证合约代码。',
      estimated_time: '半天'
    },
    {
      step_number: 6,
      title: '开发监控程序',
      description: '使用 ethers.js 实时监控 Uniswap 池子价格，计算三角套利机会（利润 > 0.5%）。',
      estimated_time: '1-2 天'
    },
    {
      step_number: 7,
      title: '集成 Flashbots',
      description: '安装 Flashbots SDK，将套利交易发送到私密交易池，防止被 MEV 机器人抢跑。',
      estimated_time: '1 天'
    },
    {
      step_number: 8,
      title: '执行与优化',
      description: '运行监控程序，自动执行套利交易，持续优化 Gas 费和套利路径。',
      estimated_time: '持续进行'
    }
  ],

  status: 'published',
  featured: false
};

async function main() {
  try {
    console.log('认证中...');

    const authResponse = await axios.post(`${DIRECTUS_URL}/auth/login`, {
      email: DIRECTUS_EMAIL,
      password: DIRECTUS_PASSWORD
    });

    const token = authResponse.data.data.access_token;
    console.log('认证成功，开始创建策略...\n');

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    // 创建策略 19.1
    console.log(`正在创建策略 19.1: ${STRATEGY_19_1.title}...`);
    const response1 = await axios.post(
      `${DIRECTUS_URL}/items/strategies`,
      STRATEGY_19_1,
      config
    );

    console.log(`✅ 策略 19.1 创建成功! ID: ${response1.data.data.id}`);
    console.log(`   标题: ${response1.data.data.title}`);
    console.log(`   Slug: ${response1.data.data.slug}\n`);

    // 创建策略 19.2
    console.log(`正在创建策略 19.2: ${STRATEGY_19_2.title}...`);
    const response2 = await axios.post(
      `${DIRECTUS_URL}/items/strategies`,
      STRATEGY_19_2,
      config
    );

    console.log(`✅ 策略 19.2 创建成功! ID: ${response2.data.data.id}`);
    console.log(`   标题: ${response2.data.data.title}`);
    console.log(`   Slug: ${response2.data.data.slug}`);

    // 获取总数
    const countResponse = await axios.get(
      `${DIRECTUS_URL}/items/strategies?aggregate[count]=id`,
      config
    );
    const totalCount = countResponse.data.data[0].count.id;

    console.log('\n========================================');
    console.log('🎉 策略 19.1 和 19.2 创建完成！');
    console.log(`📊 当前数据库中共有 ${totalCount} 个策略`);
    console.log('========================================');

  } catch (error) {
    console.error('❌ 错误:', error.response?.data || error.message);
    process.exit(1);
  }
}

main();
