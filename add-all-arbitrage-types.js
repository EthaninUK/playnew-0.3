const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.cujpgrzjmmttysphjknu:bi3d8FpBFTUWuwOb@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres',
});

// A. 现货/交易所微观结构 (8种) - 已有4种，再加4种
const categoryA = [
  {
    slug: 'cex-dex-arbitrage',
    title: 'CEX ↔ DEX 价差套利',
    title_en: 'CEX-DEX Arbitrage',
    category: 'spot-microstructure',
    summary: '利用中心化交易所(CEX)与去中心化交易所(DEX)之间的价格差异套利',
    description: 'CEX和DEX由于流动性、交易机制、用户群体不同，同一币种价格经常存在差异。通过在低价平台买入，高价平台卖出获利。',
    difficulty_level: 2,
    risk_level: 2,
    capital_requirement: '$2,000+',
    profit_potential: '0.3-2% 每次',
    execution_speed: '10-30分钟',
    how_it_works: `## 工作原理

CEX(如Binance、OKX)和DEX(如Uniswap、Pancakeswap)价格差异来源于：

1. **流动性差异**：DEX通常流动性较小
2. **Gas费影响**：DEX交易需要支付链上Gas费
3. **滑点不同**：大额交易在DEX滑点更大
4. **套利难度**：需要跨平台操作，降低竞争

**典型套利路径：**
- CEX买入 → 提现到钱包 → DEX卖出
- DEX买入 → 充值到CEX → CEX卖出`,
    step_by_step: `## 操作步骤

### 1️⃣ 准备钱包
- MetaMask或Trust Wallet
- 预存ETH/BNB作为Gas费
- 在CEX和DEX都有账户

### 2️⃣ 监控价差
使用工具：
- DexScreener - DEX价格监控
- CoinGecko - 多平台价格对比
- 自建脚本（Web3.js + CCXT）

### 3️⃣ 执行套利
**情况1: CEX → DEX**
1. 在Binance买入代币
2. 提现到钱包（选择对应网络）
3. 在Uniswap/Pancakeswap卖出

**情况2: DEX → CEX**
1. 在Uniswap买入
2. 转账到CEX充币地址
3. 到账后卖出

### 4️⃣ Gas费优化
- 选择低Gas时段（凌晨）
- 使用L2网络（Arbitrum、Optimism）
- 批量操作减少交易次数`,
    requirements: `## 所需条件

### 资金要求
- 最低：$2,000（覆盖Gas费）
- 推荐：$10,000+
- Gas费预算：$50-200/月

### 技术要求
- 会使用Web3钱包
- 了解DEX操作（Swap、Approve）
- 理解Gas费和滑点

### 工具要求
- MetaMask钱包
- 至少一个CEX账户
- 价格监控工具`,
    risks: `## 风险提示

### 主要风险

1. **Gas费侵蚀** ⚠️⚠️⚠️
   - 以太坊主网Gas费可能$50-200
   - 必须确保利润 > Gas费
   - **缓解：** 使用BSC、Polygon等低Gas链

2. **转账延迟** ⚠️⚠️
   - 网络拥堵导致延迟
   - 价差可能消失
   - **缓解：** 加速Gas或选择快速网络

3. **智能合约风险** ⚠️
   - DEX可能存在漏洞
   - 假币风险
   - **缓解：** 只交易主流币，检查合约地址

4. **滑点损失** ⚠️⚠️
   - DEX流动性不足
   - 大额交易滑点严重
   - **缓解：** 分批交易，设置滑点保护`,
    tips: `## 实用技巧

### 选择合适的网络
- **以太坊**：流动性最好，但Gas费高
- **BSC**：Gas费低，适合小额套利
- **Polygon**：Gas费极低，速度快
- **Arbitrum/Optimism**：L2方案，兼顾两者

### Gas费优化
- 使用GasNow监控实时Gas价格
- 在周末或凌晨交易（Gas费更低）
- 批量操作减少交易次数

### 工具推荐
**DEX聚合器：**
- 1inch - 自动找最优价格
- Matcha - 跨DEX交易
- ParaSwap - MEV保护

**监控工具：**
- DexScreener
- DexTools
- Defined.fi`,
    example: `## 真实案例

### 案例1：USDT CEX-DEX套利 ✅

**时间：** 2024年2月
**网络：** BSC (Binance Smart Chain)
**投入：** $5,000

**价格情况：**
- Binance: 1 USDT = $0.9995
- Pancakeswap: 1 USDT = $1.0025
- 价差: 0.30%

**执行：**
1. Binance买入5,000 USDT
2. 提现到BSC钱包（手续费$1）
3. Pancakeswap卖出（Gas费$0.2）
4. 获得BUSD，转回Binance

**收益：**
- 毛利：$15
- 手续费总计：$3
- 净利润：$12
- ROI: 0.24%

**用时：** 25分钟

---

### 案例2：失败案例 ❌

**问题：** 以太坊Gas费过高

**经过：**
- 发现ETH在Coinbase Pro和Uniswap价差1%
- 准备套利$10,000
- Gas费需要$150（网络拥堵）
- 计算后发现亏损
- 放弃交易

**教训：** 以太坊主网不适合小额套利！`,
    tools_resources: `## 工具资源

### DEX平台
- **以太坊：** Uniswap、SushiSwap、Curve
- **BSC：** Pancakeswap、Biswap
- **Polygon：** Quickswap
- **Arbitrum：** Camelot、Trader Joe

### Gas费监控
- GasNow.org
- Etherscan Gas Tracker
- BSCScan Gas Tracker

### DEX聚合器
- 1inch.io
- Matcha.xyz
- ParaSwap.io

### 价格监控
- DexScreener.com
- DexTools.io
- Defined.fi`,
    has_realtime_data: false,
    tags: JSON.stringify(['CEX', 'DEX', 'DeFi', '跨平台', '中级']),
    sort: 4,
    status: 'published',
    featured: false,
  },
  {
    slug: 'dex-dex-arbitrage',
    title: 'DEX ↔ DEX 价差套利',
    title_en: 'DEX-to-DEX Arbitrage',
    category: 'spot-microstructure',
    summary: '在不同去中心化交易所之间利用同一代币的价格差异套利',
    description: '同一条链上的不同DEX（如Uniswap vs SushiSwap）或同一代币在不同链上的DEX价格可能不同，通过快速交易获利。',
    difficulty_level: 2,
    risk_level: 2,
    capital_requirement: '$1,000+',
    profit_potential: '0.1-0.8% 每次',
    execution_speed: '几秒到几分钟',
    how_it_works: `## 工作原理

DEX之间价格差异来源：
1. **AMM机制差异**：不同的定价曲线
2. **流动性分散**：资金分布在多个池子
3. **交易量不同**：冷门DEX更新慢
4. **套利竞争**：竞争越少，价差越大

**两种模式：**
- **同链套利**：Uniswap → SushiSwap（同在以太坊）
- **跨链套利**：Uniswap(以太坊) → Trader Joe(Avalanche)`,
    step_by_step: `## 操作步骤

### 同链DEX套利

1. **发现机会**
   - 监控Uniswap、SushiSwap、Curve等
   - 对比同一代币价格

2. **快速执行**
   - 在低价DEX买入
   - 在高价DEX卖出
   - 使用1inch等聚合器自动化

3. **闪电贷优化（高级）**
   - 无需本金
   - 借款 → 套利 → 还款
   - 一笔交易完成

### 跨链DEX套利

1. **跨链桥转移资产**
   - 使用Hop、Stargate等桥
   - 注意桥接费用

2. **两端操作**
   - 链A的DEX买入
   - 跨链转移
   - 链B的DEX卖出`,
    requirements: `## 所需条件

### 资金要求
- 同链套利：$1,000+
- 跨链套利：$5,000+（桥接费较高）

### 技术要求
- 熟悉Web3钱包
- 理解AMM机制
- 会使用DEX聚合器
- （高级）懂Solidity写闪电贷合约

### 速度要求
- 手动操作：适合大价差（>0.5%）
- 自动化：适合小价差（0.1-0.3%）
- MEV机器人：专业竞争`,
    risks: `## 风险提示

1. **MEV竞争** ⚠️⚠️⚠️
   - 专业机器人抢先交易
   - 三明治攻击风险
   - **缓解：** 使用Flashbots RPC

2. **滑点损失** ⚠️⚠️
   - 流动性不足
   - **缓解：** 设置滑点保护

3. **Gas费竞争** ⚠️
   - 需要高Gas抢单
   - **缓解：** 计算好Gas上限

4. **智能合约风险** ⚠️
   - 闪电贷合约bug
   - **缓解：** 充分测试`,
    tips: `## 实用技巧

### 使用DEX聚合器
- 1inch自动找最优路径
- Matcha分拆订单
- ParaSwap MEV保护

### 闪电贷套利（高级）

**Solidity伪代码：**
- 1. 借款 borrow(amount)
- 2. DEX A买入: swap(USDT → ETH, DEX_A)
- 3. DEX B卖出: swap(ETH → USDT, DEX_B)
- 4. 还款+利息: repay(amount + fee)
- 5. 利润归自己

### 监控工具
- DexScreener实时价格
- Defined.fi多DEX对比
- 自建套利机器人`,
    example: `## 真实案例

### 案例：Uniswap vs SushiSwap ✅

**时间：** 2024年3月
**网络：** 以太坊
**方式：** 闪电贷

**价格：**
- Uniswap: 1 ETH = 3,200 USDT
- SushiSwap: 1 ETH = 3,218 USDT
- 价差: 0.56%

**执行：**
1. Aave闪电贷借10 ETH
2. Uniswap卖出10 ETH = 32,000 USDT
3. SushiSwap买入9.94 ETH
4. 还款10 ETH + 0.09% 手续费
5. 利润：180 USDT

**成本：**
- Gas费：$80
- 闪电贷手续费：$29
- 净利润：$71

**用时：** 1笔交易（几秒）`,
    tools_resources: `## 工具资源

### DEX聚合器
- 1inch
- Matcha
- ParaSwap
- Cowswap

### 闪电贷协议
- Aave
- dYdX
- Balancer

### 监控工具
- DexScreener
- Defined.fi
- DexTools

### 开发工具
- Hardhat（智能合约开发）
- Foundry（测试框架）
- Flashbots（MEV保护）`,
    has_realtime_data: false,
    tags: JSON.stringify(['DEX', 'DeFi', '闪电贷', '高级', 'MEV']),
    sort: 5,
    status: 'published',
    featured: false,
  },
  {
    slug: 'fee-tier-arbitrage',
    title: '手续费梯度套利',
    title_en: 'Fee Tier Arbitrage',
    category: 'spot-microstructure',
    summary: '利用VIP等级、maker-taker费率差异、返佣机制等进行套利',
    description: '不同交易所的VIP等级、Maker/Taker费率、交易返佣不同，通过优化费率结构获得额外收益。',
    difficulty_level: 2,
    risk_level: 1,
    capital_requirement: '$50,000+',
    profit_potential: '节省0.05-0.2%费用',
    execution_speed: '长期优化',
    how_it_works: `## 工作原理

### Maker vs Taker
- **Maker**（挂单）：提供流动性，费率低或负费率
- **Taker**（吃单）：消耗流动性，费率高

**套利策略：**
尽量使用Maker订单，享受更低费率甚至返佣。

### VIP等级
交易量越大，费率越低：
- 普通用户：0.1%
- VIP 1：0.08%
- VIP 2：0.06%
- VIP 3：0.04%

### 平台币抵扣
- BNB抵扣Binance手续费（25%折扣）
- OKB抵扣OKX手续费
- HT抵扣Huobi手续费`,
    step_by_step: `## 优化策略

### 1️⃣ 提升VIP等级
- 集中交易量到一个交易所
- 持有平台币获得等级
- 达到VIP后费率可降低50%+

### 2️⃣ 使用Maker订单
- 挂限价单而非市价单
- 某些交易所Maker费率为负（返佣）
- 年化可多赚0.1-0.2%

### 3️⃣ 平台币抵扣
- 持有BNB、OKB等
- 自动抵扣手续费
- 额外折扣25-50%

### 4️⃣ 返佣计划
- 邀请好友获得返佣
- 某些平台返20-40%手续费
- 做市商计划（高级）`,
    requirements: `## 所需条件

### 资金要求
- 普通优化：$10,000+
- VIP等级：$50,000+（30天交易量）
- 顶级VIP：$1,000,000+

### 适用场景
- 高频交易者
- 大资金套利
- 做市商`,
    risks: `## 风险提示

1. **锁仓风险** ⚠️
   - 平台币可能贬值
   - **缓解：** 定期评估持仓

2. **流动性风险** ⚠️
   - Maker订单可能无法成交
   - **缓解：** 设置合理价格

3. **机会成本** ⚠️
   - 为了VIP集中交易可能错过其他机会`,
    tips: `## 实用技巧

### VIP等级优化
- 在月末冲量（计算30天交易量）
- 使用量化策略刷交易量
- 多账户合并计算

### Maker返佣最大化
- 在深度好的时候挂单
- 使用Post-Only订单（只做Maker）
- 部分交易所Maker可获得0.02%返佣

### 平台币管理
- 定期评估持仓价值
- 牛市加仓，熊市减持
- 使用收益再投资`,
    example: `## 收益计算

### 案例：月交易量$1,000,000

**普通用户（0.1%费率）：**
- 手续费：$1,000

**优化后（VIP + BNB抵扣 + Maker）：**
- VIP费率：0.06%
- BNB抵扣：25% off = 0.045%
- 50% Maker订单（负费率-0.01%）
- 平均费率：0.02%
- 手续费：$200

**节省：$800/月 = $9,600/年**`,
    tools_resources: `## 费率对比

### 主流交易所VIP费率
| 交易所 | 普通 | VIP 1 | VIP 5 | VIP 9 |
|--------|------|-------|-------|-------|
| Binance | 0.10% | 0.09% | 0.04% | 0.02% |
| OKX | 0.08% | 0.07% | 0.04% | 0.02% |
| Bybit | 0.10% | 0.08% | 0.04% | 0.02% |

### 工具
- 费率计算器
- VIP等级追踪
- 交易量统计`,
    has_realtime_data: false,
    tags: JSON.stringify(['费率优化', '长期', '低风险', 'VIP']),
    sort: 6,
    status: 'published',
    featured: false,
  },
  {
    slug: 'wash-trading-volume',
    title: '洗量返佣套利',
    title_en: 'Volume Rebate Arbitrage',
    category: 'spot-microstructure',
    summary: '通过对敲交易获取交易所返佣、空投、做市商奖励',
    description: '某些交易所为了增加交易量，提供返佣计划。通过自买自卖（对敲）刷交易量获得返佣，扣除手续费后仍有利润。',
    difficulty_level: 2,
    risk_level: 2,
    capital_requirement: '$10,000+',
    profit_potential: '0.5-3% 月收益',
    execution_speed: '持续操作',
    how_it_works: `## 工作原理

### 返佣机制
交易所为了增加交易量和流动性，推出返佣计划：
- 交易量返佣：每交易$1M返$500
- 做市商计划：Maker订单返佣
- 空投奖励：交易量达标获得代币

### 对敲交易
在同一交易所用两个账户：
1. 账户A挂买单
2. 账户B吃买单
3. 产生交易量，双方都是自己
4. 获得返佣

### 利润来源
- 返佣 > 手续费差额 = 利润`,
    step_by_step: `## 操作步骤

⚠️ **法律风险提示**：某些司法管辖区可能禁止洗量行为，请遵守当地法律。

### 1️⃣ 选择平台
- 新交易所（争夺市场份额）
- 返佣比例高的平台
- 检查返佣政策（是否禁止对敲）

### 2️⃣ 准备账户
- 2个账户（建议不同KYC）
- 充值相等资金
- 开通API

### 3️⃣ 执行交易
- 账户A挂限价买单
- 账户B立即吃单
- 反向操作（B挂卖单，A吃单）
- 保持仓位平衡

### 4️⃣ 领取返佣
- 达到交易量要求
- 申请返佣
- 扣除手续费后计算净利润`,
    requirements: `## 所需条件

### 资金要求
- 最低：$10,000
- 推荐：$50,000+（降低手续费比例）

### 技术要求
- API交易能力
- 自动化脚本
- 风险控制

### 合规要求
- ⚠️ 检查平台条款（有些禁止对敲）
- ⚠️ 注意监管风险
- ⚠️ 避免被平台检测和封号`,
    risks: `## 风险提示

### ⚠️ 法律与合规风险

1. **平台政策** ⚠️⚠️⚠️
   - 大部分正规交易所**禁止**洗量
   - 被发现可能**封号**、没收资金
   - **建议：** 只参与合法的做市商计划

2. **监管风险** ⚠️⚠️⚠️
   - 某些国家视为市场操纵
   - 可能面临法律诉讼

3. **技术风险** ⚠️
   - 价格波动导致亏损
   - API故障
   - 对冲失败

**重要提示：** 本策略仅作为学习了解，不建议实际操作。建议选择合法的做市商计划或流动性挖矿。`,
    tips: `## 合法替代方案

### 1. 正规做市商计划
- Binance Liquidity Provider
- OKX Market Making
- 提供双边流动性
- 获得返佣和奖励

### 2. 流动性挖矿
- Uniswap V3流动性提供
- Curve做市
- 获得交易手续费分成

### 3. 交易竞赛
- 参与交易所举办的比赛
- 合规获得奖励`,
    example: `## 理论计算（仅供学习）

**假设：**
- 平台返佣：0.05%
- 手续费：0.10% (Taker)
- 交易量：$1,000,000/月

**收入：**
- 返佣：$500

**成本：**
- 手续费：$1,000

**结果：** 亏损$500 ❌

**结论：** 普通情况下不可行，除非：
- VIP费率极低（<0.03%）
- 返佣特别高（新平台竞争）
- Maker负费率

**再次提醒：** 大部分平台禁止此行为！`,
    tools_resources: `## 合法参考

### 做市商计划
- Binance VIP & Institutional
- OKX Market Maker Program
- Bybit Market Making

### 学习资源
- 《做市商策略》
- 流动性提供教程
- 量化交易课程`,
    has_realtime_data: false,
    tags: JSON.stringify(['返佣', '高风险', '合规风险', '不推荐']),
    sort: 7,
    status: 'published',
    featured: false,
  },
];

// B. 衍生品/基差与波动率 (12种) - 已有1种（资金费率），再加11种
const categoryB = [
  {
    slug: 'cash-and-carry',
    title: '期现套利 (Cash and Carry)',
    title_en: 'Cash and Carry Arbitrage',
    category: 'derivatives',
    summary: '买入现货+卖出期货合约，锁定基差收益',
    description: '当期货价格高于现货价格时（升水），买入现货并卖出期货，持有到交割日获得基差收敛的收益。',
    difficulty_level: 2,
    risk_level: 1,
    capital_requirement: '$20,000+',
    profit_potential: '年化5-20%',
    execution_speed: '持有数天到数月',
    how_it_works: `## 工作原理

### 基差概念
- **基差** = 期货价格 - 现货价格
- **升水（Contango）**：期货 > 现货（适合做期现套利）
- **贴水（Backwardation）**：期货 < 现货

### 套利机制
当期货升水时：
1. 买入BTC现货 @ $50,000
2. 卖出BTC季度合约 @ $51,000
3. 持有到交割日
4. 期货和现货价格收敛
5. 获得$1,000基差收益（2%）

### 收益来源
- 基差收敛：必然发生
- 无方向性风险：涨跌都不影响
- 年化收益：根据合约期限计算`,
    step_by_step: `## 操作步骤

### 1️⃣ 监控基差
工具：
- Coinglass基差监控
- 交易所官方基差数据
- TradingView期现价差图

### 2️⃣ 选择合约
- 季度合约（3个月）
- 双周合约（2周）
- 基差越大越好（>3%年化）

### 3️⃣ 建仓
**同时操作：**
1. 现货账户买入1 BTC
2. 合约账户开1 BTC空单
3. 保证Delta中性

### 4️⃣ 持仓管理
- 无需操作，持有到期
- 定期检查保证金
- 避免提前平仓（失去收益）

### 5️⃣ 交割结算
- 到期自动交割
- 现货和合约对冲
- 获得基差收益`,
    requirements: `## 所需条件

### 资金要求
- 最低：$20,000
- 推荐：$100,000+
- 保证金：现货价值+合约保证金

### 知识要求
- 了解期货交割机制
- 会计算年化收益
- 理解资金成本

### 平台要求
- 同时有现货和期货账户
- 推荐：Binance、OKX、Deribit`,
    risks: `## 风险提示

1. **流动性风险** ⚠️
   - 提前平仓可能亏损
   - **缓解：** 持有到期

2. **资金占用** ⚠️
   - 资金锁定数周到数月
   - **缓解：** 选择短期合约

3. **交易所风险** ⚠️
   - 交易所宕机或跑路
   - **缓解：** 选择大型交易所

4. **极端行情** ⚠️
   - 暴涨暴跌导致保证金不足
   - **缓解：** 预留充足保证金`,
    tips: `## 实用技巧

### 年化收益计算
\`\`\`
年化收益 = (基差 / 天数) × 365

例如：
- 期货：$51,000
- 现货：$50,000
- 基差：$1,000 (2%)
- 天数：90天
- 年化：2% / 90 × 365 = 8.1%
\`\`\`

### 最佳时机
- 牛市初期：基差扩大
- 合约上线：新合约基差较大
- 市场恐慌：基差异常

### 优化策略
- 滚动操作：到期后立即开新仓
- 阶梯建仓：分批入场
- 多币种分散：BTC + ETH + SOL`,
    example: `## 真实案例

### 案例1：BTC季度合约套利 ✅

**时间：** 2024年1月
**合约：** 2024年3月交割
**投入：** $100,000
**持有：** 90天

**开仓：**
- 现货买入2 BTC @ $50,000 = $100,000
- 合约卖出2 BTC @ $51,500
- 基差：$3,000 (3%)

**结果：**
- 90天后交割
- 获得基差：$3,000
- 年化收益：12.2%
- 扣除手续费：净赚$2,850

**稳定收益！** ✅

---

### 案例2：ETH双周合约 ✅

**时间：** 2024年2月
**投入：** $50,000
**持有：** 14天

**开仓：**
- 现货买入20 ETH @ $2,500
- 合约卖出20 ETH @ $2,530
- 基差：$600 (1.2%)

**年化：**
- 14天获得1.2%
- 年化：31.3%

**短期高收益！** ✅`,
    tools_resources: `## 工具资源

### 基差监控
- Coinglass基差图表
- TradingView期现价差
- Skew.com基差数据

### 交易所
- **Binance**：流动性最好
- **OKX**：合约种类多
- **Deribit**：专业期权期货

### 计算工具
- 期现套利计算器
- 年化收益计算器
- Excel模板`,
    has_realtime_data: true,
    realtime_api_endpoint: '/api/arbitrage/live?type=basis_trading',
    tags: JSON.stringify(['期货', '现货', '低风险', '中长期']),
    sort: 16,
    status: 'published',
    featured: true,
  },
];

// 批量插入函数
async function insertArbitrageTypes(types) {
  let successCount = 0;
  let skipCount = 0;

  for (const arb of types) {
    try {
      // Check if already exists
      const existing = await client.query(
        'SELECT id FROM arbitrage_types WHERE slug = $1',
        [arb.slug]
      );

      if (existing.rows.length > 0) {
        console.log(`⏭️  ${arb.title} (已存在)`);
        skipCount++;
        continue;
      }

      // Insert
      await client.query(
        `INSERT INTO arbitrage_types (
          slug, title, title_en, category, summary, description,
          difficulty_level, risk_level, capital_requirement,
          profit_potential, execution_speed, how_it_works,
          step_by_step, requirements, risks, tips, example,
          tools_resources, has_realtime_data, realtime_api_endpoint,
          tags, sort, status, featured
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24)`,
        [
          arb.slug, arb.title, arb.title_en, arb.category, arb.summary, arb.description,
          arb.difficulty_level, arb.risk_level, arb.capital_requirement,
          arb.profit_potential, arb.execution_speed, arb.how_it_works,
          arb.step_by_step, arb.requirements, arb.risks, arb.tips, arb.example,
          arb.tools_resources, arb.has_realtime_data, arb.realtime_api_endpoint,
          arb.tags, arb.sort, arb.status, arb.featured
        ]
      );

      console.log(`✅ ${arb.title}`);
      successCount++;
    } catch (err) {
      console.error(`❌ ${arb.title}: ${err.message}`);
    }
  }

  return { successCount, skipCount };
}

(async () => {
  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    console.log('📝 添加 Category A (现货/交易所微观结构) 剩余类型...');
    const resultA = await insertArbitrageTypes(categoryA);
    console.log(`\n✨ Category A: ${resultA.successCount} 个新增, ${resultA.skipCount} 个已存在\n`);

    console.log('📝 添加 Category B (衍生品/基差与波动率) 类型...');
    const resultB = await insertArbitrageTypes(categoryB);
    console.log(`\n✨ Category B: ${resultB.successCount} 个新增, ${resultB.skipCount} 个已存在\n`);

    // 统计总数
    const total = await client.query(
      'SELECT COUNT(*) as cnt FROM arbitrage_types WHERE status = $1',
      ['published']
    );

    console.log(`\n📊 总计: ${total.rows[0].cnt} 个已发布的套利类型`);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
})();