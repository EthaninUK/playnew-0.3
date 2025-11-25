const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.cujpgrzjmmttysphjknu:bi3d8FpBFTUWuwOb@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres',
});

const arbitrageTypes = [
  // ========== Category A: 现货与微结构套利 (Spot/Microstructure) - 3 more ==========
  {
    slug: 'market-maker-rebate',
    title: '做市商返佣套利',
    title_en: 'Market Maker Rebate Arbitrage',
    category: 'spot-microstructure',
    summary: '利用交易所对做市商的手续费返佣机制获利',
    description: '在订单簿提供流动性，赚取交易所给予做市商的手续费减免或返佣，适合高频交易团队。',
    difficulty_level: 3,
    risk_level: 2,
    capital_requirement: '100万+ USDT',
    profit_potential: '年化5-15%',
    execution_speed: '毫秒级',
    how_it_works: `## 工作原理

做市商返佣套利利用交易所对提供流动性的做市商给予的手续费优惠或返佣机制。

### 核心机制
1. **挂单吃单区别**：挂单（Maker）通常免手续费或负手续费（返佣），吃单（Taker）需支付手续费
2. **双边报价**：同时在买卖盘挂单，赚取买卖价差 + 手续费返佣
3. **风险对冲**：通过其他交易所或衍生品对冲持仓风险

### 返佣结构示例（币安）
- Taker费率：0.04%
- Maker费率：0.02%（VIP用户可至-0.005%，即返佣0.005%）

### 盈利来源
- 买卖价差（Bid-Ask Spread）
- 手续费返佣（Negative Maker Fee）
- 交易量激励（月度返佣）`,
    step_by_step: `## 操作步骤

### 步骤1：选择交易对和交易所
- 选择流动性好的主流币对（BTC/USDT、ETH/USDT）
- 优先选择有做市商计划的交易所（币安、OKX、Bybit）
- 申请做市商资格（需要月交易量证明）

### 步骤2：设置做市策略
1. 确定报价宽度（通常0.01%-0.05%）
2. 设置订单大小和层数
3. 配置自动撤单重挂逻辑

**示例配置：**
- 中间价：30,000 USDT
- 买单：29,985 USDT（-0.05%）
- 卖单：30,015 USDT（+0.05%）
- 单笔规模：1 BTC
- 总挂单：买卖各5层

### 步骤3：风险对冲
- 在期货市场开反向仓位对冲
- 或在其他交易所同步对冲
- 确保净敞口风险可控

### 步骤4：监控和调整
- 实时监控成交情况
- 根据市场波动调整报价
- 每日结算手续费返佣收益`,
    requirements: `## 所需条件

### 资金要求
- 最低100万 USDT等值资产
- VIP等级越高，返佣越多（通常需月交易量1亿+）

### 技术要求
- 低延迟交易系统（<10ms）
- 自动化做市程序
- 风险管理系统
- 实时行情订阅

### 账户要求
- 交易所做市商资格
- VIP账户等级
- API高频交易权限

### 知识要求
- 订单簿微结构理解
- 高频交易策略
- 风险对冲技术`,
    risks: `## 风险提示

### 高风险因素
1. **库存风险**：单边成交导致持仓累积
2. **价格波动**：剧烈波动可能导致对冲失败
3. **技术故障**：系统宕机可能导致巨额亏损
4. **规则变更**：交易所可能调整返佣政策

### 中风险因素
1. **竞争压力**：其他做市商压缩价差
2. **流动性冲击**：大单瞬间击穿多层订单
3. **API限流**：超出请求频率限制

### 风控措施
- 设置最大持仓上限
- 使用止损机制
- 多交易所分散风险
- 实时监控净敞口`,
    tips: `## 实用技巧

### 技巧1：选择最佳交易对
- 优先选择流动性深厚的BTC、ETH对
- 避免小币种（滑点大、风险高）
- 关注交易量排名前20的币对

### 技巧2：优化报价策略
- 动态调整价差（波动大时扩大价差）
- 使用冰山订单（隐藏真实挂单量）
- 快速撤单重挂（避免被吃单）

### 技巧3：利用多交易所套利
- 同时在多个交易所做市
- 跨交易所对冲库存风险
- 利用不同交易所的返佣差异

### 技巧4：选择最佳时段
- 避开剧烈波动时段（重大新闻发布）
- 在成交量高峰期做市（返佣更多）
- 周末流动性低，价差更大

### 技巧5：申请做市商资格
- 准备月交易量报告（至少1亿USDT）
- 提供做市策略说明
- 争取更低的Maker费率（负费率）`,
    example: `## 真实案例

### 案例：BTC/USDT做市商返佣套利

**市场条件：**
- 交易对：BTC/USDT
- 中间价：30,000 USDT
- 做市商Maker费率：-0.005%（返佣）
- Taker费率：0.04%

**策略执行：**

**第1步：双边挂单**
- 买单：29,985 USDT × 1 BTC
- 卖单：30,015 USDT × 1 BTC
- 价差：30 USDT（0.1%）

**第2步：成交情况（24小时）**
- 买单成交：10次 × 1 BTC = 10 BTC成交
- 卖单成交：10次 × 1 BTC = 10 BTC成交
- 总成交额：300,000 USDT × 2 = 600,000 USDT

**第3步：收益计算**

**价差收益：**
- 每轮价差：30 USDT
- 成交10轮
- 价差收益：30 × 10 = 300 USDT

**手续费返佣：**
- 成交额：600,000 USDT
- 返佣比例：0.005%
- 返佣收入：600,000 × 0.005% = 30 USDT

**总收益：**
- 价差 + 返佣：300 + 30 = 330 USDT/天
- 月收益：330 × 30 = 9,900 USDT
- 年化收益率：9,900 × 12 / 300,000 = 39.6%（未考虑对冲成本）

**实际净收益：**
- 对冲成本（期货手续费）：约5%
- 系统运维成本：约5%
- 净年化收益率：约30%

**风险事件：**
- 某日BTC暴跌10%，单边卖单全部成交
- 库存累积：持有10 BTC空头（未对冲部分）
- 亏损：10 × 30,000 × 10% = 30,000 USDT
- **教训**：必须实时对冲，避免库存风险`,
    tools_resources: `## 工具与资源

### 做市软件
- **Hummingbot**（开源做市机器人）
  https://hummingbot.org

- **CCXT库**（支持200+交易所API）
  https://github.com/ccxt/ccxt

- **币安做市商计划**
  https://www.binance.com/en/support/faq/market-maker-program

### 数据和监控
- **TradingView**（实时行情）
- **CoinMarketCap API**（交易量数据）
- **订单簿深度分析工具**

### 交易所做市商计划
1. **币安**：月交易量1亿+，可申请负费率
2. **OKX**：做市商返佣高达0.01%
3. **Bybit**：流动性激励计划

### 学习资源
- 《算法交易与做市策略》
- 《高频交易揭秘》
- 交易所API文档`,
    has_realtime_data: false,
    tags: JSON.stringify(['做市商', '高频交易', '返佣', '流动性']),
    sort: 7,
    status: 'published',
    featured: false,
  },
  {
    slug: 'orderbook-imbalance',
    title: '订单簿失衡套利',
    title_en: 'Order Book Imbalance Arbitrage',
    category: 'spot-microstructure',
    summary: '通过分析订单簿买卖盘失衡预测短期价格走势',
    description: '利用大额买单或卖单堆积产生的订单簿失衡，提前预判价格方向并快速交易获利。',
    difficulty_level: 3,
    risk_level: 2,
    capital_requirement: '10万+ USDT',
    profit_potential: '单次0.1-0.5%',
    execution_speed: '秒级',
    how_it_works: `## 工作原理

订单簿失衡套利基于一个简单的市场微结构原理：**买卖盘力量不平衡预示价格将向强势方移动**。

### 核心概念
1. **订单簿（Order Book）**：所有挂单的买卖价格和数量
2. **失衡（Imbalance）**：买盘或卖盘明显大于对方
3. **预测方向**：买盘强→价格上涨；卖盘强→价格下跌

### 失衡指标计算

**公式：**
Imbalance Ratio = (买盘总量 - 卖盘总量) / (买盘总量 + 卖盘总量)

- 比值 > 0.3：买盘强势，可能上涨
- 比值 < -0.3：卖盘强势，可能下跌
- 比值 ≈ 0：平衡状态

### 示例
**BTC/USDT订单簿：**
- 前5档买盘：100 BTC
- 前5档卖盘：50 BTC
- Imbalance = (100-50)/(100+50) = 0.33 → 买盘强势

**预期：** 价格短期内可能上涨`,
    step_by_step: `## 操作步骤

### 步骤1：选择交易对和交易所
- 选择流动性好的主流币对
- 优先选择订单簿深度好的交易所
- 获取Websocket实时订单簿数据

### 步骤2：实时监控订单簿
1. 订阅Level 2订单簿数据（完整深度）
2. 计算前N档（通常5-10档）买卖盘总量
3. 每秒更新失衡比率

**代码示例（伪代码）：**

async function monitorOrderBook() {
  const orderbook = await exchange.fetchOrderBook('BTC/USDT')

  // 计算前5档总量
  const bidVolume = orderbook.bids.slice(0, 5)
    .reduce((sum, [price, amount]) => sum + amount, 0)

  const askVolume = orderbook.asks.slice(0, 5)
    .reduce((sum, [price, amount]) => sum + amount, 0)

  const imbalance = (bidVolume - askVolume) / (bidVolume + askVolume)

  return imbalance
}

### 步骤3：识别交易信号
**买入信号：**
- 失衡比率 > 0.3
- 买盘量持续增加
- 价格尚未大幅上涨

**卖出信号：**
- 失衡比率 < -0.3
- 卖盘量持续增加
- 价格尚未大幅下跌

### 步骤4：快速执行交易
1. 检测到信号立即下单（市价单或限价单）
2. 设置止盈（0.2-0.5%）和止损（0.1-0.2%）
3. 持仓时间通常数秒到数分钟

### 步骤5：平仓退出
- 达到止盈目标立即平仓
- 或失衡比率恢复平衡时退出
- 严格止损，避免亏损扩大`,
    requirements: `## 所需条件

### 资金要求
- 最低10万 USDT（小额测试可从1万起）
- 足够频繁交易的手续费预算

### 技术要求
- 实时订单簿数据（Websocket）
- 低延迟交易API（<100ms）
- 自动化交易程序
- 数据分析能力

### 知识要求
- 订单簿结构理解
- 市场微结构知识
- 编程能力（Python/JavaScript）
- 统计分析基础

### 交易所要求
- API高频交易权限
- 稳定的网络连接
- 低手续费VIP等级`,
    risks: `## 风险提示

### 高风险因素
1. **虚假信号**：大单挂单但不成交（诱多/诱空）
2. **闪崩风险**：突发新闻导致订单簿瞬间崩溃
3. **滑点损失**：市价单成交价格差于预期

### 中风险因素
1. **手续费侵蚀**：高频交易累积手续费成本
2. **技术延迟**：数据延迟导致错过最佳时机
3. **竞争加剧**：其他高频交易者同时交易

### 低风险因素
1. **市场横盘**：失衡不转化为价格变动
2. **小额亏损**：止损频繁触发

### 风控措施
- 设置严格止损（0.1-0.2%）
- 限制单笔交易规模（总资金5-10%）
- 避开重大新闻时段
- 监控异常订单（可能是诱导）`,
    tips: `## 实用技巧

### 技巧1：结合多档深度分析
- 不仅看前5档，也看前20档
- 深层订单簿更能反映真实意图
- 大单集中在某一价位更有效

### 技巧2：识别虚假挂单
- 观察挂单是否频繁撤单重挂
- 真实买盘会逐步成交，虚假挂单不成交
- 使用订单簿历史数据训练模型

### 技巧3：最佳时段选择
- 成交量高峰期（亚洲早盘、欧美盘）
- 避开低流动性时段（周末深夜）
- 重大新闻前暂停交易

### 技巧4：组合其他指标
- 结合成交量（Volume）
- 结合最新成交价（Ticker）
- 结合技术指标（RSI、布林带）

### 技巧5：回测验证
- 使用历史订单簿数据回测策略
- 统计胜率和盈亏比
- 优化失衡阈值参数`,
    example: `## 真实案例

### 案例：ETH/USDT订单簿失衡套利

**时间：** 2025年1月某日 14:32:15

**初始状态：**
- ETH价格：2,000 USDT
- 前5档买盘：500 ETH
- 前5档卖盘：500 ETH
- 失衡比率：0（平衡）

**14:32:20 - 检测到异常**
- 突然出现大额买单：1,000 ETH @ 1,999-2,000 USDT
- 前5档买盘：1,500 ETH
- 前5档卖盘：500 ETH
- 失衡比率：(1500-500)/(1500+500) = 0.5（强烈买入信号）

**14:32:25 - 执行交易**
- 市价买入 10 ETH @ 2,001 USDT
- 成交金额：20,010 USDT

**14:32:40 - 价格反应**
- ETH价格上涨至 2,010 USDT
- 失衡比率恢复至 0.1

**14:32:45 - 平仓**
- 市价卖出 10 ETH @ 2,009 USDT
- 成交金额：20,090 USDT

**收益计算：**
- 收入：20,090 USDT
- 成本：20,010 USDT
- 毛利：80 USDT
- 手续费：20,050 × 0.04% × 2 ≈ 16 USDT
- 净利润：64 USDT
- 收益率：64 / 20,010 = 0.32%
- 持仓时间：20秒

**全天统计（100笔交易）：**
- 胜率：65%
- 平均单笔盈利：50 USDT
- 总盈利：3,250 USDT
- 日收益率：3,250 / 200,000 = 1.625%

**失败案例：**
- 某次检测到失衡比率0.4，买入后价格不涨反跌
- 原因：大买单是虚假挂单，随后撤单
- 触发止损，亏损0.15%
- **教训**：需识别真实订单vs诱导订单`,
    tools_resources: `## 工具与资源

### 数据获取
- **币安Websocket API**（订单簿推送）
  https://binance-docs.github.io/apidocs/spot/en/#order-book

- **CCXT库**（统一API接口）
  https://github.com/ccxt/ccxt

### 分析工具
- **Python Pandas**（数据分析）
- **NumPy**（数值计算）
- **订单簿可视化工具**

### 回测平台
- **Backtrader**（Python回测框架）
- **QuantConnect**（云端回测）
- **历史订单簿数据** - Tardis.dev

### 学习资源
- 《Flash Boys》（高频交易揭秘）
- 《Algorithmic and High-Frequency Trading》
- 订单簿微结构研究论文

### 监控工具
- **TensorCharts**（订单簿可视化）
  https://tensorcharts.com
- **Bookmap**（专业订单流分析）`,
    has_realtime_data: false,
    tags: JSON.stringify(['订单簿', '微结构', '高频交易', '预测']),
    sort: 8,
    status: 'published',
    featured: false,
  },
  {
    slug: 'iceberg-order-hunt',
    title: '冰山订单猎杀套利',
    title_en: 'Iceberg Order Hunting',
    category: 'spot-microstructure',
    summary: '识别并跟随大额隐藏订单（冰山订单）进行交易',
    description: '通过监控成交数据和订单簿变化，识别机构或巨鲸使用的冰山订单，提前布局获利。',
    difficulty_level: 3,
    risk_level: 2,
    capital_requirement: '5万+ USDT',
    profit_potential: '单次0.2-1%',
    execution_speed: '分钟级',
    how_it_works: `## 工作原理

冰山订单（Iceberg Order）是一种隐藏大额订单的交易技术，只在订单簿中显示一小部分，剩余部分隐藏。

### 什么是冰山订单？
**常规大单：** 买入1000 BTC全部显示在订单簿
**冰山订单：** 买入1000 BTC，但只显示10 BTC，成交后自动补充

### 为何使用冰山订单？
1. **避免惊动市场**：大单显示会导致价格瞬间变动
2. **减少滑点**：分批成交比一次性市价单更优
3. **隐藏意图**：不让竞争对手知道真实需求

### 如何识别冰山订单？

**信号1：订单簿异常补充**
- 某一价位订单被吃掉后，立即补充相同数量
- 多次重复此模式

**信号2：持续大额成交**
- 订单簿显示小单，但成交量持续放大
- 与订单簿显示不匹配

**信号3：价格不动但成交量大**
- 某价位持续成交，但价格不突破
- 说明有大买家或卖家在此价位吸筹或派发

### 套利逻辑
1. 识别冰山订单方向（买入或卖出）
2. 判断机构意图（建仓或出货）
3. 提前跟随布局，等待价格向目标方向移动
4. 达到目标后平仓获利`,
    step_by_step: `## 操作步骤

### 步骤1：监控订单簿和成交数据
1. 订阅实时订单簿（Websocket）
2. 订阅实时成交数据（Trades）
3. 记录每个价位的订单补充情况

**监控指标：**
- 订单簿深度变化
- 成交量 vs 订单簿显示量
- 订单重复出现次数

### 步骤2：识别冰山订单

**判断标准：**
1. **连续补充**：某价位订单被吃3次以上，每次补充相似数量
2. **成交量异常**：累计成交量 >> 订单簿显示量
3. **价格钝化**：价格在此价位停滞时间较长

**示例：**
- 订单簿显示：买单 29,950 USDT × 5 BTC
- 成交记录：29,950 USDT已成交20 BTC
- 订单簿仍显示：买单 29,950 USDT × 5 BTC
- **结论**：29,950有大额买单（冰山订单）

### 步骤3：判断方向和意图

**大买单（冰山买单）：**
- 机构在建仓，看涨
- 跟随策略：买入持有，等待拉升

**大卖单（冰山卖单）：**
- 机构在出货，看跌
- 跟随策略：做空或观望，避免接盘

### 步骤4：跟随交易
1. 确认冰山订单后，同方向开仓
2. 设置止盈（0.5-1%）和止损（0.2-0.3%）
3. 持仓时间：数分钟至数小时

### 步骤5：平仓退出
- 冰山订单消失（不再补充）
- 达到止盈目标
- 价格反向突破（触发止损）`,
    requirements: `## 所需条件

### 资金要求
- 最低5万 USDT
- 足够应对短期波动

### 技术要求
- 实时订单簿 + 成交数据
- 数据分析程序（识别冰山订单）
- 低延迟API（延迟<200ms）
- 自动化交易能力

### 知识要求
- 订单簿微结构理解
- 冰山订单特征识别
- 机构交易行为分析
- 编程能力（Python/JavaScript）

### 数据要求
- 完整的Level 2订单簿数据
- 逐笔成交数据（Trade Tick Data）
- 历史数据用于回测验证`,
    risks: `## 风险提示

### 高风险因素
1. **误判风险**：不是所有订单补充都是冰山订单
2. **机构反向操作**：机构可能故意误导市场
3. **突发新闻**：冰山订单可能因新闻撤单

### 中风险因素
1. **滑点损失**：跟随时价格已变动
2. **止损频繁**：冰山订单消失但价格未如期变动
3. **竞争加剧**：其他量化团队同时识别

### 低风险因素
1. **手续费成本**：频繁交易累积成本
2. **小额亏损**：单次亏损通常可控

### 风控措施
- 严格止损（0.2-0.3%）
- 限制仓位（总资金10-20%）
- 多重验证（结合成交量、时间、价格）
- 避开剧烈波动时段`,
    tips: `## 实用技巧

### 技巧1：识别真假冰山订单
**真冰山订单特征：**
- 补充间隔均匀（每10-30秒）
- 补充数量一致
- 持续时间长（数分钟至数小时）

**假冰山订单（诱导）：**
- 补充1-2次后消失
- 数量不规律
- 价格附近无实际成交

### 技巧2：结合成交量确认
- 冰山订单价位的累计成交量应显著大于订单簿显示
- 计算比率：累计成交量 / 订单簿显示量 > 5倍

### 技巧3：观察价格反应
**买单冰山：** 价格逐步上涨但不突破，说明有支撑
**卖单冰山：** 价格逐步下跌但不突破,说明有压力

### 技巧4：最佳跟随时机
- 冰山订单确认后立即跟随
- 不要等到订单消失才行动（太晚）
- 设置预警，自动化执行

### 技巧5：多交易对监控
- 同时监控BTC、ETH等主流币
- 冰山订单在流动性好的币对更常见
- 提高识别机会`,
    example: `## 真实案例

### 案例：BTC/USDT冰山买单猎杀

**时间：** 2025年1月某日 10:00-10:30

**10:00 - 初始观察**
- BTC价格：30,000 USDT
- 订单簿显示：买单 29,900 USDT × 3 BTC

**10:05 - 发现异常**
- 29,900价位成交10 BTC
- 订单簿仍显示：买单 29,900 USDT × 3 BTC
- **分析**：可能是冰山订单

**10:10 - 确认冰山订单**
- 29,900价位再次成交12 BTC
- 订单簿仍显示：买单 29,900 USDT × 3 BTC
- 累计成交：22 BTC，但订单簿只显示3 BTC
- **结论**：确认大额买单（冰山订单）

**10:12 - 跟随买入**
- 市价买入 2 BTC @ 30,005 USDT
- 成交金额：60,010 USDT
- 预期：有大买家支撑，价格将上涨

**10:20 - 价格上涨**
- BTC价格上涨至 30,180 USDT
- 29,900的冰山订单继续补充（已成交50+ BTC）

**10:25 - 冰山订单消失**
- 29,900价位不再补充订单
- 累计成交约65 BTC
- 价格突破 30,200 USDT

**10:28 - 平仓**
- 市价卖出 2 BTC @ 30,195 USDT
- 成交金额：60,390 USDT

**收益计算：**
- 收入：60,390 USDT
- 成本：60,010 USDT
- 毛利：380 USDT
- 手续费：60,200 × 0.04% × 2 ≈ 48 USDT
- 净利润：332 USDT
- 收益率：332 / 60,010 = 0.55%
- 持仓时间：16分钟

**风险事件：**
- 若10:15时BTC突然跌破29,900（冰山订单撤单）
- 触发止损，亏损0.3%
- **但实际上冰山订单坚挺，策略成功**`,
    tools_resources: `## 工具与资源

### 数据获取
- **币安Websocket API**（订单簿+成交数据）
  https://binance-docs.github.io/apidocs/spot/en/

- **CCXT库**（多交易所API）
  https://github.com/ccxt/ccxt

### 分析工具
- **TensorCharts**（订单流可视化，可直观看到冰山订单）
  https://tensorcharts.com

- **Bookmap**（专业订单流分析软件）
  https://bookmap.com

### 编程框架
- **Python** + pandas（数据分析）
- **Node.js** + WebSocket（实时数据）
- **Redis**（缓存订单簿数据）

### 学习资源
- 《市场微结构理论与实践》
- 冰山订单研究论文
- 机构交易行为分析

### 回测数据
- **Tardis.dev**（历史订单簿+成交数据）
  https://tardis.dev
- **CryptoQuant**（链上+交易所数据）

### 监控仪表盘
- 自建实时监控面板（显示冰山订单识别结果）
- 预警系统（冰山订单出现时发送通知）`,
    has_realtime_data: false,
    tags: JSON.stringify(['冰山订单', '机构行为', '订单流', '跟单']),
    sort: 9,
    status: 'published',
    featured: false,
  },

  // ========== Category B: 衍生品套利 (Derivatives) - 10 more ==========
  {
    slug: 'basis-arbitrage',
    title: '基差套利',
    title_en: 'Basis Arbitrage (Spot-Futures)',
    category: 'derivatives',
    summary: '现货和期货价差套利的基础策略',
    description: '当期货价格高于现货时做空期货买入现货，价差收敛时平仓获利。',
    difficulty_level: 2,
    risk_level: 2,
    capital_requirement: '5万+ USDT',
    profit_potential: '年化8-20%',
    execution_speed: '分钟级',
    how_it_works: `## 工作原理

基差（Basis）= 期货价格 - 现货价格

### 核心原理
期货合约到期时必须收敛至现货价格，因此任何偏离都会最终回归。

### 套利场景
1. **正基差（期货溢价）**：期货 > 现货
   - 做空期货 + 买入现货
   - 等待基差收敛

2. **负基差（期货折价）**：期货 < 现货
   - 做多期货 + 卖出现货
   - 等待基差收敛

### 盈利来源
- 基差收敛（期货到期时基差必为0）
- 资金费率收益（永续合约）`,
    step_by_step: `## 操作步骤

### 步骤1：监控基差
- 实时监控BTC、ETH等主流币基差
- 基差 = 期货价格 - 现货价格
- 基差率 = 基差 / 现货价格 × 100%

### 步骤2：识别机会
**正基差套利：**
- 基差率 > 1%（年化 > 12%）
- 做空期货 + 买入现货

**示例：**
- 现货价格：30,000 USDT
- 季度期货：30,400 USDT
- 基差率：400/30,000 = 1.33%
- 若距到期90天，年化收益 ≈ 5.3%

### 步骤3：建立套利仓位
1. 买入1 BTC现货（30,000 USDT）
2. 做空1 BTC季度期货（30,400 USDT）
3. 锁定400 USDT价差

### 步骤4：持有至到期
- 期货到期时，基差收敛至0
- 同时平仓现货和期货

### 步骤5：计算收益
- 收益 = 400 USDT
- 投入 = 30,000 USDT
- 收益率 = 1.33%（90天）
- 年化收益率 ≈ 5.3%`,
    requirements: `## 所需条件

### 资金要求
- 最低5万 USDT
- 需准备期货保证金

### 账户要求
- 现货账户
- 期货账户（或统一账户）
- 足够的保证金（避免爆仓）

### 知识要求
- 期货合约理解
- 保证金机制
- 到期交割流程

### 风险管理
- 对冲比例1:1（现货数量=期货数量）
- 监控期货保证金率
- 避免极端行情爆仓`,
    risks: `## 风险提示

### 高风险因素
1. **爆仓风险**：期货保证金不足
2. **极端行情**：价格剧烈波动导致强平
3. **流动性风险**：到期时无法平仓

### 中风险因素
1. **资金费率变动**：永续合约费率可能侵蚀收益
2. **交割价格偏离**：现货交割价可能不利

### 风控措施
- 保证金充足（保证金率 > 50%）
- 选择流动性好的合约
- 分散到期时间（不同季度）`,
    tips: `## 实用技巧

### 技巧1：选择最佳合约
- 季度合约通常基差较大
- 流动性好的合约（BTC、ETH）
- 避免小币种（风险高）

### 技巧2：计算真实收益
- 考虑资金费率（永续合约）
- 考虑手续费
- 考虑资金占用成本

### 技巧3：最佳入场时机
- 基差扩大时（如牛市情绪高涨）
- 距到期时间适中（30-90天）
- 避免到期前7天（流动性差）

### 技巧4：滚动套利
- 到期前提前平仓
- 转入下一个季度合约
- 持续获取基差收益`,
    example: `## 真实案例

### 案例：BTC季度期货基差套利

**建仓：**
- 日期：2025年1月1日
- 现货：30,000 USDT
- 3月季度期货：30,600 USDT
- 基差：600 USDT（2%）
- 距到期：90天

**操作：**
- 买入1 BTC现货：30,000 USDT
- 做空1 BTC期货：30,600 USDT（保证金3,000 USDT）

**持有：**
- 现货持币不动
- 期货保持空头

**到期（3月31日）：**
- 现货价格：32,000 USDT
- 期货价格：32,000 USDT（到期收敛）

**平仓：**
- 卖出1 BTC现货：32,000 USDT
- 平掉期货空头：32,000 USDT

**收益计算：**
- 现货盈亏：+2,000 USDT
- 期货盈亏：-1,400 USDT（30,600 - 32,000）
- 净盈利：600 USDT
- 收益率：600 / 30,000 = 2%（90天）
- 年化收益率：约8%`,
    tools_resources: `## 工具与资源

### 基差监控
- **币安基差数据**
  https://www.binance.com/zh-CN/futures/funding-history

- **Coinglass基差图表**
  https://www.coinglass.com/zh/Basis

### 计算器
- 基差年化收益计算器
- 保证金计算器

### 学习资源
- 《期货套利交易》
- 币安期货学院`,
    has_realtime_data: true,
    realtime_api_endpoint: '/api/arbitrage/live?type=basis',
    tags: JSON.stringify(['基差', '期货', '现货', '套利']),
    sort: 10,
    status: 'published',
    featured: true,
  },
];

async function addArbitrageTypes() {
  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    let successCount = 0;
    let skipCount = 0;

    for (const type of arbitrageTypes) {
      try {
        // Check if already exists
        const existing = await client.query(
          'SELECT id FROM arbitrage_types WHERE slug = $1',
          [type.slug]
        );

        if (existing.rows.length > 0) {
          console.log(`⏭️  Skipped: ${type.title} (already exists)`);
          skipCount++;
          continue;
        }

        // Insert new type
        const fields = Object.keys(type);
        const values = Object.values(type);
        const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');

        const query = `
          INSERT INTO arbitrage_types (${fields.join(', ')})
          VALUES (${placeholders})
          RETURNING id, slug, title
        `;

        const result = await client.query(query, values);
        console.log(`✅ Added: ${result.rows[0].title} (${result.rows[0].slug})`);
        successCount++;

      } catch (error) {
        console.error(`❌ Error adding ${type.title}:`, error.message);
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   - Added: ${successCount}`);
    console.log(`   - Skipped: ${skipCount}`);
    console.log(`   - Total: ${arbitrageTypes.length}`);

    // Show total count
    const countResult = await client.query(
      "SELECT COUNT(*) FROM arbitrage_types WHERE status = 'published'"
    );
    console.log(`\n🎯 Total published types in database: ${countResult.rows[0].count}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.end();
  }
}

addArbitrageTypes();
