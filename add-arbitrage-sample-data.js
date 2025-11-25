const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_EMAIL = 'the_uk1@outlook.com';
const DIRECTUS_PASSWORD = 'Mygcdjmyxzg2026!';

async function login() {
  const response = await axios.post(`${DIRECTUS_URL}/auth/login`, {
    email: DIRECTUS_EMAIL,
    password: DIRECTUS_PASSWORD,
  });
  return response.data.data.access_token;
}

const arbitrageData = [
  // A. 现货/交易所微观结构
  {
    slug: 'spot-arbitrage',
    title: '跨所价差套利',
    title_en: 'Cross-Exchange Spot Arbitrage',
    category: 'spot-microstructure',
    summary: '利用不同交易所之间同一币种的价格差异，低买高卖获取无风险收益。是最基础、最经典的套利方式。',
    description: '跨所价差套利是加密货币市场中最基础的套利策略。由于不同交易所的流动性、用户群体、交易深度不同，同一币种在不同平台上会出现价格差异。套利者通过在价格较低的交易所买入，然后在价格较高的交易所卖出，赚取价差。',
    difficulty_level: 1,
    risk_level: 2,
    capital_requirement: 'medium',
    profit_potential: '0.1% - 1% 每次',
    execution_speed: 'minutes',
    has_realtime_data: true,
    realtime_api_endpoint: '/api/arbitrage/spot',
    tags: ['CEX', '现货', '低风险', '新手友好'],
    sort: 1,
    status: 'published',
    featured: true,
    how_it_works: `## 工作原理

跨所价差套利的核心原理是**价格发现的时间差**。当某个交易所出现大额买单或卖单时，价格会瞬间波动，但这个波动传导到其他交易所需要时间，从而产生套利窗口。

**价差产生的原因：**
1. **流动性差异** - 大型交易所（如Binance）与小型交易所价格传导有延迟
2. **用户群体不同** - 不同地区交易所受当地需求影响
3. **充提限制** - 某些交易所充币/提币速度慢，导致价格偏离
4. **交易深度不同** - 小交易所深度浅，容易被拉盘
5. **手续费差异** - 不同平台手续费结构影响套利空间`,
    step_by_step: `## 操作步骤

### 1. 准备阶段
- 在至少2-3个主流交易所开户并完成KYC
- 在每个交易所预存USDT和主流币种（BTC、ETH等）
- 准备好API密钥以便快速执行交易

### 2. 监控价差
使用专业工具监控价差：
- 自建监控程序（调用多个交易所API）
- 使用第三方工具如 Coinglass、CoinArbitrage
- 设置价差预警（通常>0.3%才有利可图）

### 3. 执行套利
当发现价差机会时：
1. 在**低价交易所**买入目标币种
2. 同时在**高价交易所**卖出相同数量
3. 确保两笔交易几乎同时完成

### 4. 资金再平衡
- 将高价交易所的USDT提币到低价交易所
- 或将低价交易所的币提到高价交易所
- 为下次套利做准备

### 5. 计算实际收益
收益 = 价差% - 手续费% - 提币费 - 滑点损失`,
    requirements: `## 所需条件

### 资金要求
- **最低：** $1,000 - $5,000（能覆盖手续费和提币费）
- **推荐：** $10,000+（提高资金利用率）

### 交易所账户
- Binance（必备，流动性最好）
- OKX / Bybit / Gate.io（至少1-2个备选）
- 某些区域性交易所（如Upbit、Bithumb）价差更大

### 技术工具
- **监控工具：** API接口 + Python脚本 或 现成套利工具
- **快速交易：** API交易（手动太慢会错过机会）
- **资金管理：** 多交易所余额监控表格

### 知识储备
- 了解各交易所充提币时间和手续费
- 熟悉API下单流程
- 理解滑点、深度、盘口概念`,
    risks: `## 风险提示

### 1. 转账延迟风险 ⚠️
- **问题：** 提币过程中价格反转，套利变亏损
- **解决：** 使用快速到账的链（如TRC20-USDT）；保持双边资金池

### 2. 交易所风险 ⚠️⚠️
- **问题：** 小交易所可能跑路、冻结资金、突然关闭提币
- **解决：** 只用主流大所；不要在小所存大额资金

### 3. 滑点风险
- **问题：** 实际成交价与预期价差较大
- **解决：** 只做深度足够的币对；避免使用市价单

### 4. 监管风险
- **问题：** 某些国家对频繁跨所转账有反洗钱审查
- **解决：** 使用企业账户；保留交易记录；避免过于频繁

### 5. 资金效率风险
- **问题：** 资金分散在多个交易所，利用率低
- **解决：** 使用三角套利或内部划转功能提高效率`,
    tips: `## 实用技巧

### 💡 提高成功率
1. **关注新币上线** - 新币在不同交易所价差最大
2. **利用手续费返佣** - Binance邀请返佣可达20%，降低成本
3. **选择高波动时段** - 大行情时价差更明显
4. **使用稳定币套利** - USDT/USDC价差相对稳定且风险低

### 💡 降低成本
1. **使用平台币抵扣手续费** - BNB、OKB等可节省25%手续费
2. **达到VIP等级** - 交易量大的用户手续费更低
3. **选择提币费低的链** - TRC20-USDT几乎免费，ERC20很贵

### 💡 自动化建议
- 使用Python + CCXT库监控多个交易所
- 设置价差预警（Telegram Bot通知）
- 半自动执行（监控自动，下单手动确认）
- 全自动需要严格的风控和测试

### 💡 进阶策略
- **三角套利：** 在同一交易所利用BTC/USDT、ETH/USDT、ETH/BTC价差
- **统计套利：** 基于历史价差数据，在价差扩大时入场
- **跨链套利：** 利用Layer2与主网的价差`,
    example: `## 实例分析

### 案例1：BTC跨所套利（成功案例）

**背景：** 2024年某日，比特币突然上涨，Binance价格先涨，Bybit滞后

**套利过程：**
1. 发现价差：Binance BTC = $44,250，Bybit BTC = $44,100（差价$150，约0.34%）
2. 执行操作：
   - 在Bybit用$44,100买入1 BTC
   - 同时在Binance以$44,250卖出1 BTC
3. 手续费计算：
   - Bybit买入手续费：$44,100 × 0.1% = $44.1
   - Binance卖出手续费：$44,250 × 0.1% = $44.25
   - 总手续费：$88.35
4. 净利润：$150 - $88.35 = **$61.65（0.14%收益）**

**后续操作：**
- 将Binance的USDT提币到Bybit（使用TRC20，手续费$1）
- 实际净利润：$60.65

---

### 案例2：稳定币套利（日常案例）

**背景：** USDT在不同交易所有微小价差

**套利过程：**
1. 发现Gate.io的USDT/USD = 0.998，Binance = 1.002
2. 在Gate.io买入$10,000 USDT，成本$9,980
3. 在Binance卖出$10,000 USDT，获得$10,020
4. 价差收益：$40
5. 扣除手续费约$20，净利润**$20**

**特点：** 收益小但稳定，适合大资金量操作

---

### 案例3：失败案例（学习经验）

**问题：** 提币延迟导致价差消失

**过程：**
1. 发现小交易所Hotbit某币比Binance便宜5%
2. 在Hotbit买入，准备提币到Binance卖出
3. Hotbit提币审核需要2小时（未提前了解）
4. 2小时后价差消失，反而亏损2%

**教训：** 必须提前测试交易所提币速度！`,
    tools_resources: `## 工具与资源

### 价差监控工具
1. **Coinglass** - https://www.coinglass.com/
   - 免费查看主流币种跨所价差
   - 提供历史价差数据

2. **CoinArbitrage**
   - 实时监控多个交易所价差
   - 支持自定义预警

3. **自建监控（推荐）**
   - 使用CCXT库（Python）
   - 调用交易所API获取实时价格
   - 代码示例：GitHub搜索 "crypto arbitrage bot"

### API交易库
- **CCXT** - 统一的交易所API接口
- **ccxtpro** - 支持WebSocket的高频版本

### 交易所推荐
| 交易所 | 特点 | 提币速度 | 推荐度 |
|--------|------|----------|--------|
| Binance | 流动性最好，手续费低 | 快（5-30分钟） | ⭐⭐⭐⭐⭐ |
| OKX | 深度好，支持中文 | 中等 | ⭐⭐⭐⭐ |
| Bybit | 合约为主，现货也不错 | 快 | ⭐⭐⭐⭐ |
| Gate.io | 币种多，小币种价差大 | 较慢 | ⭐⭐⭐ |

### 学习资源
- **书籍：** 《加密货币套利实战指南》
- **课程：** YouTube搜索 "crypto arbitrage tutorial"
- **社区：** Reddit r/CryptoArbitrage`,
  },
  {
    slug: 'triangle-arbitrage',
    title: '三角套利',
    title_en: 'Triangle Arbitrage',
    category: 'spot-microstructure',
    summary: '在同一交易所内利用三个或更多交易对之间的价格不平衡，通过循环交易获利。无需跨所转账，速度快。',
    description: '三角套利是一种在单一交易所内完成的套利策略，通过利用三个或更多币种之间的汇率不平衡来获利。例如，用USDT买入BTC，用BTC买入ETH，再用ETH换回USDT，如果最终得到的USDT多于初始投入，即为套利成功。',
    difficulty_level: 2,
    risk_level: 2,
    capital_requirement: 'medium',
    profit_potential: '0.05% - 0.3% 每次',
    execution_speed: 'seconds',
    has_realtime_data: false,
    tags: ['单所', '高频', 'API', '算法'],
    sort: 2,
    status: 'published',
    featured: false,
    how_it_works: `## 工作原理

三角套利利用的是**汇率不一致性**。在理想情况下，三个交易对应该满足：
\`\`\`
BTC/USDT × ETH/BTC × USDT/ETH = 1
\`\`\`

但由于：
- 订单簿实时变化
- 交易深度不同
- 买卖价差（spread）

实际上这个等式经常不成立，从而产生套利机会。

### 举例说明
假设：
- BTC/USDT = 40,000
- ETH/BTC = 0.06
- ETH/USDT = 2,500

理论上：40,000 × 0.06 = 2,400，但实际ETH/USDT = 2,500

**套利路径：**
1. 用 40,000 USDT 买入 1 BTC
2. 用 1 BTC 买入 16.67 ETH (1 ÷ 0.06)
3. 卖出 16.67 ETH 得到 41,675 USDT

净利润：1,675 USDT（约4.2%，实际会更小）`,
    step_by_step: `## 操作步骤

### 1. 选择交易所
- Binance（推荐，交易对最多）
- OKX、Bybit

### 2. 编写监控程序
\`\`\`python
import ccxt

exchange = ccxt.binance()

# 监控三个交易对
btc_usdt = exchange.fetch_ticker('BTC/USDT')
eth_btc = exchange.fetch_ticker('ETH/BTC')
eth_usdt = exchange.fetch_ticker('ETH/USDT')

# 计算套利空间
rate = btc_usdt['bid'] * eth_btc['bid'] / eth_usdt['ask']

if rate > 1.001:  # 大于0.1%才值得
    print("套利机会！")
\`\`\`

### 3. 执行交易
必须使用API快速下单，手动操作会错过机会。

### 4. 计算实际收益
收益 = (最终金额 / 初始金额 - 1) - 手续费%`,
    requirements: `## 所需条件

- **API开发能力**（必须）
- **交易所API权限**
- **资金：** $5,000+（考虑滑点）
- **网络：** 低延迟服务器（建议使用云服务器）`,
    risks: `## 风险提示

1. **执行速度风险** - 价差稍纵即逝，必须毫秒级执行
2. **滑点风险** - 深度不足导致实际成交价偏离
3. **手续费侵蚀** - 三次交易手续费可能吃掉大部分利润
4. **技术风险** - API错误、网络延迟导致交易失败`,
    tips: `## 实用技巧

1. 选择交易量大的币对（BTC、ETH、BNB）
2. 使用VIP账户降低手续费
3. 部署在交易所同一地区的服务器
4. 设置严格的止损逻辑`,
    example: `## 实例分析

**成功案例：**
- 初始：10,000 USDT
- 路径：USDT → BTC → ETH → USDT
- 最终：10,025 USDT
- 手续费：10 USDT (0.1%)
- 净利润：15 USDT (0.15%)

虽然单次收益小，但可高频执行。`,
  },
  {
    slug: 'funding-rate-arbitrage',
    title: '资金费率套利',
    title_en: 'Funding Rate Arbitrage',
    category: 'derivatives',
    summary: '通过在永续合约市场做多或做空，同时在现货市场进行对冲，赚取资金费率。适合中性策略，风险较低。',
    description: '资金费率套利是加密货币衍生品市场中最流行的套利策略之一。永续合约通过资金费率机制保持价格锚定现货价格。当合约价格高于现货时，多头需要向空头支付资金费率；反之则空头支付给多头。套利者可以在合约和现货之间建立对冲头寸来赚取资金费率。',
    difficulty_level: 2,
    risk_level: 1,
    capital_requirement: 'large',
    profit_potential: '0.01% - 0.1% 每8小时（年化10-50%）',
    execution_speed: 'hours',
    has_realtime_data: true,
    realtime_api_endpoint: '/api/arbitrage/funding-rate',
    tags: ['合约', '低风险', '稳定收益', '对冲'],
    sort: 15,
    status: 'published',
    featured: true,
    how_it_works: `## 工作原理

永续合约没有到期日，为了让合约价格贴近现货价格，交易所引入了**资金费率机制**。

### 资金费率规则
- 每**8小时**结算一次（北京时间0:00、8:00、16:00）
- 费率为正时：多头 → 空头支付
- 费率为负时：空头 → 多头支付
- 费率大小取决于市场情绪

### 套利逻辑
**当资金费率为正（多头狂热）：**
1. 在合约市场做空
2. 在现货市场买入等量币种
3. 每8小时收取资金费率
4. 两个头寸互相对冲，价格波动不影响总资产

**收益来源：** 纯资金费率收入，不赌方向`,
    step_by_step: `## 操作步骤

### 1. 选择高资金费率币种
使用工具查看实时资金费率排行：
- Coinglass: https://www.coinglass.com/FundingRate
- 选择年化收益>20%的币种

### 2. 建立对冲头寸
假设BTC资金费率为 0.05% 每8小时：

**在Binance合约：**
- 开10倍杠杆空单，价值$10,000（实际保证金$1,000）

**在Binance现货：**
- 买入价值$10,000的BTC现货

### 3. 持有并收取费率
- 每8小时自动收取资金费率
- 不需要任何操作
- 保证金充足即可

### 4. 平仓退出
当资金费率降至低于手续费成本时：
- 平掉合约空单
- 卖出现货BTC
- 结算总收益

### 5. 风险管理
- 保持保证金充足（建议50%以上）
- 监控资金费率变化
- 避免极端行情（如暴涨暴跌）`,
    requirements: `## 所需条件

### 资金要求
- **最低：** $10,000（考虑保证金和现货购买）
- **推荐：** $50,000+（更安全，收益更可观）

### 交易所账户
- Binance / OKX / Bybit（支持合约和现货）
- 必须开通合约交易权限

### 知识储备
- 理解永续合约机制
- 熟悉保证金和爆仓风险
- 会计算资金费率年化收益

### 工具
- 资金费率监控工具
- 保证金计算器`,
    risks: `## 风险提示

### 1. 爆仓风险 ⚠️⚠️
- **问题：** 极端行情导致合约保证金不足
- **解决方案：** 使用低杠杆（5-10倍）；保持充足保证金

### 2. 资金费率反转风险
- **问题：** 资金费率突然由正转负
- **解决方案：** 实时监控；及时平仓

### 3. 滑点和手续费
- **问题：** 开平仓手续费可能吃掉部分利润
- **解决方案：** 只在费率足够高时操作（年化>15%）

### 4. 交易所风险
- **问题：** 交易所故障、插针
- **解决方案：** 分散到多个交易所；设置止损

### 5. 资金占用
- **问题：** 资金长期锁定，流动性差
- **解决方案：** 只用闲置资金操作`,
    tips: `## 实用技巧

### 💡 提高收益
1. **追高资金费率** - 选择费率>0.05%的币种（年化>50%）
2. **使用平台币抵扣手续费** - 节省20-25%
3. **多币种同时操作** - 分散风险，提高收益稳定性

### 💡 降低风险
1. **使用U本位合约** - 避免币本位合约的汇率风险
2. **保持50%以上保证金率** - 防止被爆仓
3. **设置价格预警** - 极端行情及时加保证金

### 💡 自动化建议
- 使用脚本监控资金费率变化
- 自动计算最优对冲比例
- 设置自动平仓条件

### 💡 税务规划
- 资金费率收入可能被视为资本利得
- 保留详细交易记录`,
    example: `## 实例分析

### 案例：BTC资金费率套利

**市场背景：**
2024年牛市，BTC持续上涨，市场情绪狂热，资金费率持续为正。

**套利设置：**
- 资金费率：0.06% 每8小时（年化约65%）
- 操作资金：$50,000

**操作过程：**

1. **开仓（2024-03-01）**
   - Binance现货：买入 1.25 BTC @ $40,000 = $50,000
   - Binance合约：开空单 1.25 BTC，10倍杠杆
     - 合约价值：$50,000
     - 保证金：$5,000

2. **持有30天**
   - 每8小时收取资金费率：$50,000 × 0.06% = $30
   - 每天收益：$30 × 3 = $90
   - 30天总收益：$90 × 30 = $2,700

3. **平仓（2024-03-31）**
   - BTC价格涨到 $45,000
   - 现货盈利：($45,000 - $40,000) × 1.25 = $6,250
   - 合约亏损：-$6,250（价格上涨，空单亏损）
   - 盈亏对冲，净值不变

4. **收益计算：**
   - 资金费率收入：$2,700
   - 手续费成本：开仓 + 平仓约 $100
   - **净利润：$2,600（月化5.2%，年化62%）**

**风险控制：**
- 保证金率始终保持在60%以上
- 没有遭遇极端行情
- 完美对冲，零市场风险

---

### 注意事项
这是理想案例，实际操作中：
- 资金费率会波动
- 可能出现负费率（需支付费用）
- 极端行情可能需要追加保证金`,
    tools_resources: `## 工具与资源

### 资金费率监控
1. **Coinglass** - https://www.coinglass.com/FundingRate
   - 实时资金费率排行
   - 历史费率数据
   - 多交易所对比

2. **币Coin** - 资金费率日历

3. **自建监控**
   - 调用交易所API获取实时费率
   - 示例：\`exchange.fetchFundingRate('BTC/USDT')\`

### 计算器
- **年化收益计算：**
  \`\`\`
  年化收益 = 资金费率 × 3 × 365
  例：0.05% × 3 × 365 = 54.75%
  \`\`\`

### 推荐交易所
| 交易所 | 特点 | 费率结算 |
|--------|------|----------|
| Binance | 流动性最好 | 每8小时 |
| OKX | 手续费低 | 每8小时 |
| Bybit | 新手友好 | 每8小时 |

### 学习资源
- YouTube: "Funding Rate Arbitrage Tutorial"
- 文章：《永续合约资金费率套利完全指南》`
  },
  {
    slug: 'stablecoin-depeg-arbitrage',
    title: '稳定币脱锚套利',
    title_en: 'Stablecoin Depeg Arbitrage',
    category: 'stablecoin-fiat',
    summary: '当稳定币价格偏离$1时，低价买入并等待回归锚定价格，或者在高价时卖出。历史上USDT、USDC多次出现脱锚机会。',
    description: '稳定币脱锚套利是一种利用稳定币价格短期偏离$1锚定价格的套利策略。当市场恐慌或流动性紧张时，稳定币可能跌破$1（如$0.95）；当需求激增时可能高于$1（如$1.02）。套利者在低于$1时买入，高于$1时卖出，或等待价格回归。',
    difficulty_level: 2,
    risk_level: 3,
    capital_requirement: 'large',
    profit_potential: '1% - 5% 每次',
    execution_speed: 'hours',
    has_realtime_data: true,
    realtime_api_endpoint: '/api/arbitrage/stablecoin-depeg',
    tags: ['稳定币', '事件驱动', '高收益', '中等风险'],
    sort: 18,
    status: 'published',
    featured: true,
    how_it_works: `## 工作原理

稳定币通过不同机制锚定$1：
- **法币储备型（USDT、USDC）：** 由美元1:1支撑
- **算法稳定币（DAI、FRAX）：** 通过抵押品和算法维持

当发生以下情况时，稳定币会脱锚：
1. **恐慌性抛售** - 市场暴跌时用户抛售稳定币买入法币
2. **流动性危机** - 发行方储备金问题（如USDC 2023年脱锚事件）
3. **监管消息** - 如BUSD被SEC调查
4. **银行风险** - 如SVB倒闭影响USDC

套利逻辑：
- 脱锚是暂时的，最终会回归$1
- 在$0.95买入，等待回到$1，获利5%`,
    step_by_step: `## 操作步骤

### 情景1：稳定币跌破$1（买入套利）

1. **监控脱锚信号**
   - USDT/USD < 0.98
   - 使用Coinglass等工具实时监控

2. **快速买入**
   - 在币安、OKX等交易所买入脱锚的稳定币
   - 例：用$9,500买入10,000 USDT

3. **等待回归**
   - 通常数小时至数天回归$1
   - 或直接在C2C市场以$1卖出

4. **获利了结**
   - 当USDT回到$0.995+时卖出
   - 或兑换成其他稳定币（USDC）

---

### 情景2：稳定币高于$1（卖出套利）

1. **发现溢价**
   - 如某交易所USDT/USD = 1.02

2. **卖出稳定币**
   - 卖出10,000 USDT，获得$10,200

3. **等待回落后回购**
   - 或保持美元，结束套利`,
    requirements: `## 所需条件

- **资金：** $50,000+（大额更有效率）
- **快速入金通道：** 法币出入金渠道
- **多交易所账户：** Binance、OKX、Kraken等
- **风险承受能力：** 可能需要持有数天至数周`,
    risks: `## 风险提示

### 1. 永久脱锚风险 ⚠️⚠️⚠️
- **最大风险：** 稳定币彻底崩盘（如UST归零）
- **案例：** LUNA/UST事件，UST从$1跌到$0.1
- **规避：** 只操作有真实储备的稳定币（USDT、USDC、BUSD）

### 2. 时间成本
- 回归锚定可能需要数周
- 资金被占用

### 3. 监管风险
- 发行方被制裁或关闭

### 4. 流动性风险
- 极端情况下无法卖出`,
    tips: `## 实用技巧

1. **只操作头部稳定币** - USDT、USDC、DAI
2. **分散购买** - 不要单一稳定币all in
3. **保留退出通道** - 确保能快速换成法币
4. **关注新闻** - 第一时间了解脱锚原因`,
    example: `## 历史案例

### 案例1：USDC 2023年脱锚事件

**背景：** 2023年3月，Silicon Valley Bank倒闭，Circle披露在SVB存有$3.3B储备金

**脱锚过程：**
- 3月10日：USDC跌至$0.87（史无前例）
- 市场恐慌，大量抛售

**套利机会：**
- 在$0.88买入100,000 USDC，成本$88,000
- 3月13日，Circle确认储备金安全，USDC回升至$0.99
- 卖出获得$99,000
- **净利润：$11,000（12.5%收益）**

**风险：** 当时很多人担心USDC彻底崩盘，需要极大勇气

---

### 案例2：USDT日常波动套利

**背景：** USDT经常在$0.99-$1.01之间波动

**操作：**
- 在$0.992买入，$1.005卖出
- 单次收益1.3%
- 多次操作积累收益`,
  },
];

async function addArbitrageTypes(token) {
  for (const data of arbitrageData) {
    try {
      await axios.post(
        `${DIRECTUS_URL}/items/arbitrage_types`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(`✅ Added: ${data.title} (${data.slug})`);
    } catch (error) {
      if (error.response?.data?.errors?.[0]?.extensions?.code === 'RECORD_NOT_UNIQUE') {
        console.log(`ℹ️  Already exists: ${data.title}`);
      } else {
        console.error(`❌ Error adding ${data.title}:`, error.response?.data?.errors?.[0]?.message || error.message);
      }
    }
  }
}

async function main() {
  try {
    console.log('🔐 Logging in...');
    const token = await login();
    console.log('✅ Logged in successfully\n');

    console.log('📝 Adding arbitrage types...\n');
    await addArbitrageTypes(token);

    console.log('\n✨ Done! Added sample arbitrage data.');
    console.log('\n📌 Next steps:');
    console.log('1. Visit http://localhost:8055/admin/content/arbitrage_types');
    console.log('2. Review and edit the content');
    console.log('3. Continue adding more types manually or via script');
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    process.exit(1);
  }
}

main();
