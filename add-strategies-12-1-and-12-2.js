const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

// ===== 12.1 dYdX 永续合约做市 =====
const STRATEGY_12_1 = {
  title: 'dYdX 永续合约做市 - 去中心化衍生品做市',
  slug: 'dydx-perpetual-market-making',
  summary: '在 dYdX 去中心化永续合约平台做市,通过提供买卖订单赚取 Maker 返佣和交易挖矿奖励,年化收益 15-40%,适合有做市经验的高级玩家。',

  category: 'orderbook',
  category_l1: 'yield',
  category_l2: '订单簿做市',

  difficulty_level: 4,
  risk_level: 4,

  apy_min: 15,
  apy_max: 40,
  threshold_capital: '10000 美元起',
  threshold_capital_min: 10000,
  time_commitment: '初始设置 3 小时,持续监控',
  time_commitment_minutes: 200,
  threshold_tech_level: 'advanced',

  content: `> **适合人群**: 有量化交易或做市经验的高级玩家
> **阅读时间**: 约 15 分钟
> **关键词**: dYdX / 永续合约 / 做市 / Maker 返佣 / 交易挖矿 / 去中心化衍生品

---

## 🎯 什么是 dYdX 做市?

### dYdX 平台介绍

**dYdX 是什么**:
- 去中心化永续合约交易所
- 订单簿模式(非 AMM)
- 支持 50+ 币种永续合约
- 100 倍杠杆

**V4 架构**:
- 基于 Cosmos SDK 的独立链
- 完全去中心化
- 极低交易费用($0.001/笔)
- 亚秒级确认

### 做市的原理

**订单簿做市**:
1. 在买一和卖一之间挂单
2. 同时提供买单和卖单
3. 赚取买卖价差(Spread)
4. 获得 Maker 返佣

**示例**:
- BTC-PERP 当前价格: $50,000
- 你挂买单: $49,990(做 Maker)
- 你挂卖单: $50,010(做 Maker)
- 价差: $20
- 两边都成交赚 $20

---

## 📋 dYdX 做市完整指南

### 准备工作

**需要准备**:
1. **资金**: 至少 $10,000 USDC(建议 $50,000+)
2. **技术**: 编程能力(Python/JavaScript)
3. **经验**: 理解订单簿和做市原理
4. **工具**: API 密钥和做市机器人

### 方法 1: 手动做市(新手入门)

**第一步: 注册 dYdX**

1. 访问 https://trade.dydx.exchange
2. 连接钱包(MetaMask/WalletConnect)
3. 存入 USDC(跨链桥或直接存入)

**第二步: 了解手续费结构**

**dYdX 手续费**:
- **Taker 费用**: 0.05%(吃单)
- **Maker 返佣**: -0.02%(挂单)
- **VIP 等级**: 交易量越大返佣越高

**返佣计算**:
- 你挂单 $100,000 成交
- 返佣: $100,000 × 0.02% = $20

**第三步: 选择交易对**

**适合做市的交易对**:
- **高流动性**: BTC-USD, ETH-USD
- **中等波动**: SOL-USD, AVAX-USD
- **避免**: 超低流动性币种(容易被套)

**第四步: 手动挂单练习**

**策略**: 简单网格做市

1. **确定价格区间**:
   - 当前 BTC 价格: $50,000
   - 做市区间: $49,500 - $50,500

2. **设置买单**:
   - $49,900: 买 0.1 BTC
   - $49,800: 买 0.1 BTC
   - $49,700: 买 0.1 BTC

3. **设置卖单**:
   - $50,100: 卖 0.1 BTC
   - $50,200: 卖 0.1 BTC
   - $50,300: 卖 0.1 BTC

4. **等待成交**:
   - 价格波动触发订单
   - 赚取价差和返佣

**每日收益预估**:
- 成交 10 次(买 5 次,卖 5 次)
- 每次价差 $100 × 0.1 BTC = $10
- 返佣 $50,000 × 0.02% × 10 = $10
- **日收益**: $110
- **月收益**: $3,300(假设每天成交)

### 方法 2: API 自动化做市(进阶)

**使用 dYdX API 构建做市机器人**

**第一步: 获取 API 密钥**

1. 登录 dYdX
2. 前往 "API Keys"
3. 创建 API 密钥
4. 保存 Secret(只显示一次)

**第二步: 安装 SDK**

**Python 示例**:
\`\`\`python
pip install dydx-v3-python

from dydx3 import Client
from dydx3.constants import *

client = Client(
    host='https://api.dydx.exchange',
    api_key_credentials={
        'key': 'YOUR_API_KEY',
        'secret': 'YOUR_SECRET',
        'passphrase': 'YOUR_PASSPHRASE'
    }
)
\`\`\`

**第三步: 简单做市脚本**

**策略**: 对称做市

\`\`\`python
# 获取当前价格
market = 'BTC-USD'
orderbook = client.public.get_orderbook(market=market)
mid_price = (float(orderbook.data['bids'][0]['price']) +
             float(orderbook.data['asks'][0]['price'])) / 2

# 设置参数
spread = 0.002  # 0.2% 价差
size = 0.1  # 每单 0.1 BTC

# 下买单
buy_price = mid_price * (1 - spread)
client.private.create_order(
    position_id=position_id,
    market=market,
    side=ORDER_SIDE_BUY,
    order_type=ORDER_TYPE_LIMIT,
    post_only=True,
    size=str(size),
    price=str(buy_price),
    limit_fee='0.02',
    expiration_epoch_seconds=time.time() + 3600
)

# 下卖单
sell_price = mid_price * (1 + spread)
client.private.create_order(
    position_id=position_id,
    market=market,
    side=ORDER_SIDE_SELL,
    order_type=ORDER_TYPE_LIMIT,
    post_only=True,
    size=str(size),
    price=str(sell_price),
    limit_fee='0.02',
    expiration_epoch_seconds=time.time() + 3600
)
\`\`\`

**第四步: 风险管理**

**库存管理**(Inventory Management):
- 设置最大持仓: ±0.5 BTC
- 超过限制时调整价格
- 例如: 持仓 +0.5 BTC,降低卖价加速卖出

**对冲策略**:
- 在其他交易所对冲
- 避免单边风险
- 锁定做市利润

---

## 💰 收益分析

### 收益来源

**1. 买卖价差**:
- 设置 0.2% Spread
- 每次成交赚 $100(0.1 BTC)

**2. Maker 返佣**:
- 0.02% 返佣
- $50,000 成交量 = $10

**3. 交易挖矿**(历史):
- dYdX 曾发放 DYDX 代币奖励
- V4 可能有新激励计划

### 实际案例

**资金**: $50,000 USDC

**策略**: BTC-USD 对称做市
- 价差: 0.2%
- 每单: 0.1 BTC($5,000)
- 每日成交: 20 次

**日收益**:
- 价差收益: $100 × 10 = $1,000
- 返佣: $100,000 × 0.02% = $20
- **总计**: $1,020/天

**月收益**: $30,600(假设持续成交)
**年化**: 73%

**实际**: 扣除滑点、未成交、库存风险,实际年化约 **20-30%**

---

## 🔥 高级策略

### 策略 1: 动态价差调整

**根据波动率调整**:
- 低波动: Spread 0.1%(赚更多但风险低成交)
- 高波动: Spread 0.3%(成交快但赚得少)

**代码示例**:
\`\`\`python
# 计算波动率
volatility = calculate_volatility(prices, window=24)

# 动态价差
if volatility < 0.01:
    spread = 0.001  # 1bp
elif volatility < 0.03:
    spread = 0.002  # 2bp
else:
    spread = 0.005  # 5bp
\`\`\`

### 策略 2: 多层订单

**在不同价位挂多层订单**:
- 买单: $49,950, $49,900, $49,850
- 卖单: $50,050, $50,100, $50,150
- 越远离中间价,数量越大

**好处**: 捕捉大幅波动

### 策略 3: 跨交易所套利做市

**同时在 dYdX 和 Binance 做市**:
1. dYdX 挂买单
2. Binance 对冲卖出
3. 锁定无风险利润

**需要**: 快速执行,低延迟

---

## ⚠️ 风险管理

### 主要风险

**1. 库存风险**:
- 单边成交导致持仓偏移
- BTC 暴跌,持有大量 BTC
- **应对**: 严格库存管理,及时对冲

**2. 价格跳空**:
- 极端行情跳过你的挂单
- 未成交但价格已变
- **应对**: 设置止损,快速取消订单

**3. Gas 费**(V3):
- 以太坊 L2 仍有 Gas 成本
- V4 已解决(独立链)

**4. 技术风险**:
- API 故障
- 机器人 Bug
- **应对**: 充分测试,手动监控

### 安全措施

**资金管理**:
- 不要 All in 一个交易对
- 分散到 3-5 个市场
- 保留 30% 现金应急

**止损策略**:
- 单日亏损 > 2%,停止做市
- 库存偏离 > 20%,强制对冲
- 极端行情全部取消订单

---

## 📊 dYdX vs CEX 做市对比

| 对比项 | dYdX | Binance |
|--------|------|---------|
| Maker 返佣 | -0.02% | 0%-0.02% |
| 交易费用 | 极低 | 低-中 |
| 杠杆 | 最高 100x | 最高 125x |
| 流动性 | 中等 | 极高 |
| 监管风险 | 低(去中心化) | 高 |
| 技术难度 | 高 | 中 |

**dYdX 优势**: 去中心化,抗审查,返佣稳定

---

## 🔧 必备工具

### 做市机器人框架

**1. Hummingbot**:
- 开源做市机器人
- 支持 dYdX
- GUI 界面,易上手

**2. 自建脚本**:
- 使用 dYdX Python SDK
- 完全自定义
- 更灵活

### 监控工具

**1. dYdX Dashboard**:
- 官方仪表盘
- 查看持仓、订单、PnL

**2. TradingView**:
- 实时图表
- 技术分析
- 价格提醒

### 风险管理工具

**1. Python 库**:
- \`ccxt\`: 多交易所统一 API
- \`pandas\`: 数据分析
- \`numpy\`: 数学计算

**2. 日志和报警**:
- Telegram Bot 发送报警
- 记录所有交易日志

---

## ❓ 常见问题

**Q1: dYdX 做市赚钱吗?**
> 有经验的做市商可以稳定盈利。新手需要学习和测试,初期可能亏损。

**Q2: 需要多少资金?**
> 最低 $10,000,建议 $50,000+。资金越大,做市效率越高。

**Q3: 可以 24/7 运行吗?**
> 可以!机器人可以全天候运行。但需要监控和维护。

**Q4: dYdX 会跑路吗?**
> V4 完全去中心化,无法跑路。资产在链上,自己掌控。

**Q5: 做市和套利有什么区别?**
> 做市是提供流动性赚价差,套利是利用价差。做市风险更可控。

**Q6: 新手能做吗?**
> 不推荐。建议先学习订单簿交易,有 3-6 个月经验后再尝试。

---

## ✅ 新手检查清单

**开始前必须**:
- [ ] 理解订单簿和做市原理
- [ ] 有编程基础(Python/JS)
- [ ] 准备至少 $10,000 资金
- [ ] 接受可能的初期亏损

**测试阶段**:
- [ ] 用 $1,000 小额测试
- [ ] 运行 1-2 周
- [ ] 记录所有交易
- [ ] 分析盈亏原因

**正式运行**:
- [ ] 设置严格风险控制
- [ ] 每日监控持仓
- [ ] 定期优化参数
- [ ] 保持学习

---

## 🎓 总结

dYdX 做市是高风险高收益的策略:

**核心优势**:
1. **去中心化**: 抗审查,资产安全
2. **Maker 返佣**: 稳定收入来源
3. **高杠杆**: 资金利用率高
4. **低费用**: V4 交易成本极低

**适合人群**:
- 有量化交易经验
- 懂编程
- 能承受波动
- 全职或半全职投入

**不适合**:
- 完全新手
- 不懂编程
- 资金少于 $10,000
- 无法持续监控

**推荐路径**:
1. 学习 3 个月(订单簿、做市原理)
2. 用 Hummingbot 测试 1 个月
3. 自建脚本优化 1 个月
4. 小资金实盘 3 个月
5. 逐步加大资金

dYdX 做市不是"躺赚",而是一门技术活,需要持续学习和优化!📈
`,

  steps: [
    { step_number: 1, title: '学习做市原理', description: '理解订单簿、价差、库存管理等概念。', estimated_time: '2 周' },
    { step_number: 2, title: '注册并测试', description: '在 dYdX 注册,用小额资金手动测试。', estimated_time: '1 周' },
    { step_number: 3, title: '搭建机器人', description: '使用 Hummingbot 或自建脚本。', estimated_time: '2 周' },
    { step_number: 4, title: '回测和优化', description: '历史数据回测,优化参数。', estimated_time: '1 周' },
    { step_number: 5, title: '实盘运行', description: '小额实盘,持续监控和改进。', estimated_time: '持续' },
  ],
};

// ===== 12.2 Vertex Protocol 综合做市 =====
const STRATEGY_12_2 = {
  title: 'Vertex Protocol 综合做市 - 现货与永续合约统一做市',
  slug: 'vertex-protocol-integrated-mm',
  summary: '在 Vertex Protocol 同时为现货和永续合约市场做市,赚取多重手续费返佣,统一保证金系统提高资金效率,年化收益 20-50%,Arbitrum 低 Gas 优势。',

  category: 'orderbook',
  category_l1: 'yield',
  category_l2: '订单簿做市',

  difficulty_level: 4,
  risk_level: 4,

  apy_min: 20,
  apy_max: 50,
  threshold_capital: '10000 美元起',
  threshold_capital_min: 10000,
  time_commitment: '初始设置 2 小时,持续监控',
  time_commitment_minutes: 150,
  threshold_tech_level: 'advanced',

  content: `> **适合人群**: 有做市经验,追求高资金效率的高级玩家
> **阅读时间**: 约 12 分钟
> **关键词**: Vertex / 现货做市 / 永续合约 / 统一保证金 / Arbitrum / 交叉保证金

---

## 🎯 什么是 Vertex Protocol?

### Vertex 的创新

**统一交易平台**:
- 现货交易(Spot)
- 永续合约(Perp)
- 共享流动性和保证金

**核心优势**:
1. **交叉保证金**: 一笔资金同时做现货和合约做市
2. **Arbitrum 部署**: Gas 费极低($0.01/笔)
3. **订单簿 + AMM**: 混合流动性
4. **高返佣**: Maker -0.02%

---

## 📋 Vertex 做市指南

### 准备工作

**需要**:
1. 资金: $10,000+ USDC
2. Arbitrum 网络配置
3. 做市经验

### 统一保证金优势

**传统模式**(如 dYdX):
- 现货做市: $20,000
- 合约做市: $20,000
- **总需要**: $40,000

**Vertex 模式**:
- 统一保证金: $20,000
- 同时做现货和合约
- **资金效率提升 100%**

### 基础做市策略

**跨市场套利做市**:

1. **现货挂买单**: BTC 现货 $50,000
2. **永续挂卖单**: BTC-PERP $50,050
3. **捕捉资金费率**: 同时赚价差和资金费

**示例**:
- 现货买入 1 BTC @ $50,000
- 永续做空 1 BTC @ $50,050
- 价差: $50
- 资金费率: 每 8 小时 0.01% = 额外 $5
- **日收益**: $65

---

## 💰 收益分析

### 收益来源

**1. 现货做市**:
- Maker 返佣: -0.02%
- 价差: 0.1-0.3%

**2. 永续做市**:
- Maker 返佣: -0.02%
- 价差: 0.1-0.3%
- 资金费率: ±0.01-0.1%

**3. 交叉收益**:
- 现货 + 永续对冲
- 无方向性风险
- 纯赚价差和费率

### 实际案例

**资金**: $20,000

**策略**: BTC 现货 + 永续做市
- 现货成交: 10 次/天
- 永续成交: 20 次/天
- 平均价差: 0.2%

**日收益**:
- 现货: $50,000 × 0.2% × 10 = $100
- 永续: $100,000 × 0.2% × 20 = $400
- 返佣: $150,000 × 0.02% = $30
- **总计**: $530/天

**月收益**: $15,900
**年化**: 95%

**实际**: 扣除风险约 **30-40% APY**

---

## 🔥 高级策略

### 策略 1: Delta 中性做市

**操作**:
1. 现货做多 BTC
2. 永续做空等量 BTC
3. Delta = 0,无价格风险
4. 纯赚价差 + 资金费率

### 策略 2: 波动率套利

**高波动时**:
- 扩大价差到 0.5%
- 减少挂单量
- 避免大额成交风险

**低波动时**:
- 缩小价差到 0.05%
- 增加挂单量
- 提高成交频率

### 策略 3: 流动性激励计划

**Vertex 奖励**:
- VRTX 代币奖励做市商
- 根据成交量和报价质量
- 额外 5-10% APY

---

## ⚠️ 风险管理

### 主要风险

**1. 资金费率风险**:
- 永续合约资金费率波动
- 可能侵蚀利润
- **应对**: 监控费率,及时调整

**2. 交叉保证金清算**:
- 一个市场亏损影响全部
- **应对**: 保守杠杆,分散市场

**3. 流动性风险**:
- Vertex 流动性弱于 dYdX
- **应对**: 选择主流币种

---

## 📊 Vertex vs dYdX

| 对比项 | Vertex | dYdX |
|--------|--------|------|
| 产品 | 现货+永续 | 仅永续 |
| 保证金 | 统一 | 独立 |
| 资金效率 | 高 | 中 |
| 流动性 | 中 | 高 |
| Gas 费 | $0.01 | $0.001 |

**Vertex 优势**: 资金效率高,产品丰富

---

## 🎓 总结

Vertex Protocol 通过统一保证金大幅提升做市资金效率,适合有经验的做市商多市场操作,年化 30-50% 可期。风险在于流动性和交叉保证金清算,需谨慎管理。
`,

  steps: [
    { step_number: 1, title: '配置 Arbitrum', description: '添加 Arbitrum 网络到 MetaMask。', estimated_time: '10 分钟' },
    { step_number: 2, title: '连接 Vertex', description: '访问 app.vertexprotocol.com,存入资金。', estimated_time: '20 分钟' },
    { step_number: 3, title: '设置做市策略', description: '同时在现货和永续市场挂单。', estimated_time: '1 小时' },
    { step_number: 4, title: '监控保证金', description: '关注统一保证金使用率,避免清算。', estimated_time: '每天 30 分钟' },
    { step_number: 5, title: '优化和调整', description: '根据市场调整价差和持仓。', estimated_time: '持续' },
  ],
};

// ===== 上传逻辑 =====
async function getAuthToken() {
  const response = await axios.post(`${DIRECTUS_URL}/auth/login`, {
    email: 'the_uk1@outlook.com',
    password: 'Mygcdjmyxzg2026!',
  });
  return response.data.data.access_token;
}

async function addStrategies() {
  try {
    const token = await getAuthToken();
    const strategies = [STRATEGY_12_1, STRATEGY_12_2];

    console.log('\n开始创建 12.1 和 12.2 策略...\n');

    for (let i = 0; i < strategies.length; i++) {
      const strategy = {
        ...strategies[i],
        status: 'published',
        is_featured: true,
        view_count: 0,
        bookmark_count: 0,
        published_at: new Date().toISOString(),
      };

      const response = await axios.post(
        `${DIRECTUS_URL}/items/strategies`,
        strategy,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log(`✅ [${i + 1}/2] ${strategy.title}`);
      console.log(`   ID: ${response.data.data.id}`);
      console.log(`   Slug: ${response.data.data.slug}\n`);
    }

    console.log('🎉 创建完成！');
    console.log('访问: http://localhost:3000/strategies?category=orderbook\n');
  } catch (error) {
    console.error('\n❌ 创建失败:', error.response?.data || error.message);
  }
}

addStrategies();