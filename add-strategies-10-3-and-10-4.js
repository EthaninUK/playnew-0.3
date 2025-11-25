const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

// ===== 10.3 Franklin OnChain 政府基金 =====
const STRATEGY_10_3 = {
  title: 'Franklin OnChain 政府基金 - 传统金融巨头的链上产品',
  slug: 'franklin-onchain-government-fund',
  summary: '投资富兰克林邓普顿推出的链上政府货币基金 BENJI，享受传统金融机构背书和 SEC 监管保护，年化 5%，最低 $1 起投，传统金融与 DeFi 的完美结合。',

  category: 'rwa',
  category_l1: 'yield',
  category_l2: 'RWA/链上国债',

  difficulty_level: 1,
  risk_level: 1,

  apy_min: 4.8,
  apy_max: 5.5,
  threshold_capital: '1 美元起',
  threshold_capital_min: 1,
  time_commitment: '初始设置 1 小时(KYC)，后续自动',
  time_commitment_minutes: 60,
  threshold_tech_level: 'beginner',

  content: `## 什么是 Franklin OnChain 政府基金

Franklin Templeton（富兰克林邓普顿）是全球最大的资产管理公司之一，管理超过 **1.5 万亿美元**资产。2021 年，他们推出了 **BENJI**——首个在公链上运行的 SEC 注册货币市场基金。

### 核心特点

**1. 传统金融巨头背书**
- Franklin Templeton 成立于 1947 年，历史悠久
- 全球 30+ 个国家有业务，1500 万+ 客户
- 管理资产 $1.5 万亿，机构级信誉
- 不是 DeFi 团队，是真正的华尔街巨头

**2. SEC 完全监管**
- 美国 SEC 注册的投资公司
- 遵守《1940 年投资公司法》
- 定期审计和监管报告
- 投资者保护和透明度最高

**3. 100% 政府债券**
- 投资标的：美国国债和政府回购协议
- 无信用风险（美国政府背书）
- 流动性极高
- 几乎零违约风险

**4. 链上透明**
- 在 Polygon 和 Stellar 链上运行
- 每日 NAV（净值）链上更新
- 持仓完全透明可查
- 结合了传统金融的安全和区块链的透明

### 收益来源

**你的收益来自**：
- 美国短期国债利息（当前约 5%）
- 政府回购协议利息
- 每日结算，自动复利

**当前收益**（2024 年数据）：
- 7 日年化收益率：5.0-5.5%
- 净费用后收益：4.8-5.2%
- 管理费：0.2-0.3%

### 与其他 RWA 产品对比

| 产品 | 发行方 | 监管 | 收益 | 门槛 | 链 | 推荐度 |
|-----|--------|------|------|------|-----|--------|
| BENJI (Franklin) | 华尔街巨头 | SEC | 5% | $1 | Polygon/Stellar | ⭐⭐⭐⭐⭐ |
| sDAI (MakerDAO) | DeFi | 无 | 5% | 无 | Ethereum | ⭐⭐⭐⭐ |
| ONDO USDY | 加密公司 | 部分 | 5% | $500 | Ethereum | ⭐⭐⭐⭐ |
| Backed bIB01 | 瑞士公司 | FINMA | 4.5% | $100 | Ethereum | ⭐⭐⭐⭐ |

**BENJI 的独特优势**：
- 唯一由华尔街巨头发行的链上基金
- 最严格的 SEC 监管
- 最低门槛（$1）
- 最高信誉度

## 实操步骤

### Step 1: 访问官网并注册

1. 访问 Franklin Templeton OnChain 官网
   - 网址：https://www.franklintempleton.com/investments/options/money-market-funds/products/702/SINGLCLASS/franklin-on-chain-u-s-government-money-fund

2. 点击 "Open Account" 或 "Get Started"

3. 选择账户类型
   - Individual（个人）
   - Joint（联名）
   - Trust（信托）
   - Entity（公司）

### Step 2: 完成 KYC 认证

**所需材料**：
- 有效护照或身份证
- 地址证明（水电费单、银行对账单）
- SSN（美国居民）或税号（非美国居民）
- 银行账户信息

**KYC 流程**：
1. 填写个人信息
2. 上传身份证件
3. 人脸识别验证
4. 等待审核（1-3 个工作日）

**注意**：
- 中国大陆居民可能无法直接开户
- 建议使用美国或其他支持国家的身份
- 需要满足反洗钱（AML）要求

### Step 3: 连接钱包

BENJI 支持两种方式持有：

**方式 A：托管钱包（推荐新手）**
- 由 Franklin Templeton 托管
- 无需管理私钥
- 类似传统券商账户

**方式 B：自托管钱包**
1. 创建 MetaMask 钱包
2. 切换到 Polygon 网络
3. 在 Franklin OnChain 平台连接钱包
4. 完成钱包验证

### Step 4: 购买 BENJI

**购买流程**：
1. 登录 Franklin OnChain 账户
2. 选择 "Buy" 或 "Invest"
3. 输入投资金额（最低 $1）
4. 选择支付方式：
   - 银行转账（ACH）
   - 电汇
   - USDC（链上）
5. 确认交易
6. 等待结算（T+0 到 T+1）

**费用**：
- 申购费：0%
- 赎回费：0%
- 管理费：0.2-0.3%/年（已从 NAV 扣除）

### Step 5: 持有和监控

**收益结算**：
- 每日计算收益
- 自动复利（无需操作）
- NAV 每日更新

**查看持仓**：
- 在 Franklin OnChain 仪表板查看
- 或在 Polygon 区块浏览器查看代币余额
- 收益自动累积到 BENJI 余额

### Step 6: 赎回

**赎回流程**：
1. 登录账户
2. 点击 "Redeem" 或 "Sell"
3. 输入赎回金额
4. 选择接收方式：
   - 银行转账
   - USDC（链上）
5. 确认赎回

**到账时间**：
- T+0 或 T+1（根据金额）
- 大额可能需要 T+2

## 收益计算示例

**案例 1：小额投资（$1,000）**

- 投资金额：$1,000
- 年化收益：5.0%
- 持有时间：1 年
- 预期收益：$50
- 净收益（扣费后）：约 $47

**案例 2：中额投资（$10,000）**

- 投资金额：$10,000
- 年化收益：5.0%
- 持有时间：1 年
- 预期收益：$500
- 净收益（扣费后）：约 $470

**案例 3：大额投资（$100,000）**

- 投资金额：$100,000
- 年化收益：5.0%
- 持有时间：1 年
- 预期收益：$5,000
- 净收益（扣费后）：约 $4,700

**对比银行储蓄**：
- 美国银行活期：0.5%
- BENJI：5.0%
- 收益差：10 倍

## 风险分析

### 主要风险

**1. 利率风险（低）**
- 美联储降息会导致收益率下降
- 当前 5%，可能降至 3-4%
- 但仍远高于银行储蓄

**2. 监管风险（极低）**
- SEC 注册，监管明确
- Franklin Templeton 合规历史良好
- 风险极低

**3. 平台风险（极低）**
- Franklin Templeton 1947 年成立
- 管理 $1.5 万亿
- 不是 DeFi 协议，不会 "Rug Pull"

**4. 链上风险（低）**
- Polygon 链相对成熟
- 但仍有智能合约风险
- 建议选择托管方式（完全避免链上风险）

**5. 准入风险（中）**
- 需要 KYC
- 部分国家/地区可能无法访问
- 中国大陆居民可能受限

### 风险等级

**总体风险：极低（1/5）**
- 这是 RWA 领域最安全的产品之一
- 传统金融监管 + 政府债券 = 双重保障
- 适合极度保守的投资者

## 进阶技巧

### 技巧 1：作为稳定币替代品

**策略**：
- 将闲置 USDC/USDT 换成 BENJI
- 赚取 5% 收益（vs 稳定币 0%）
- 需要用钱时 T+0 赎回

**适合**：
- 持有大量稳定币的用户
- 不想参与 DeFi 风险的用户

### 技巧 2：阶梯式投资

**策略**：
- 不要一次性全部投入
- 分 3-6 个月逐步投入
- 平均化利率波动风险

### 技巧 3：结合 DeFi 使用

**可能的 DeFi 整合**（未来）：
- 作为抵押品借贷
- 提供流动性
- 收益聚合

**注意**：目前 BENJI 的 DeFi 整合有限，主要作为持有型资产。

### 技巧 4：税务优化

**美国投资者**：
- 政府债券利息可能免州税
- 咨询税务顾问了解具体优惠

## 常见问题

**Q1：BENJI 和普通货币基金有什么区别？**

A：投资标的相同（政府债券），但 BENJI 在区块链上运行，提供更高透明度和 24/7 可访问性。收益率基本相同。

**Q2：我的资金安全吗？**

A：非常安全。资金投资于美国政府债券，由 Franklin Templeton 托管，SEC 监管。这是传统金融级别的安全性。

**Q3：中国居民可以投资吗？**

A：目前可能受限。建议使用海外身份或等待未来可能的开放。

**Q4：收益会变化吗？**

A：会。收益率跟随美国短期国债利率变化。美联储降息会导致收益下降。

**Q5：有锁定期吗？**

A：没有。可以随时赎回，T+0 或 T+1 到账。

**Q6：最低投资金额是多少？**

A：$1 起投，非常低的门槛。

**Q7：费用高吗？**

A：管理费 0.2-0.3%/年，已从 NAV 中扣除，没有申购/赎回费。费用很低。

**Q8：和 sDAI 比哪个好？**

A：
- BENJI：SEC 监管，传统金融背书，需要 KYC
- sDAI：无需 KYC，DeFi 原生，但无监管
- 保守选 BENJI，追求便利选 sDAI

## 总结

### 核心价值

Franklin OnChain BENJI 是**传统金融与区块链的完美结合**：
- ✅ 华尔街巨头背书
- ✅ SEC 完全监管
- ✅ 100% 政府债券
- ✅ 5% 年化收益
- ✅ $1 最低投资
- ✅ T+0 赎回

### 适合人群

- 极度保守的投资者
- 持有大量稳定币想赚取收益
- 信任传统金融多于 DeFi
- 需要监管保护和透明度
- 愿意完成 KYC

### 不适合人群

- 追求高收益（>10%）
- 无法完成 KYC
- 需要 DeFi 可组合性
- 居住在受限国家/地区

### 推荐配置

- 保守型：50-80% 资产配置 BENJI
- 平衡型：20-40% 资产配置 BENJI
- 激进型：10-20% 资产配置 BENJI（作为稳定收益底仓）

### 最后建议

如果你追求**绝对安全**和**稳定收益**，Franklin OnChain BENJI 是 RWA 领域的最佳选择。虽然 5% 收益不高，但：
- 风险极低（政府债券 + SEC 监管）
- 流动性极高（T+0 赎回）
- 门槛极低（$1 起）

这是将传统金融安全性带入区块链的里程碑产品。`,

  steps: [
    { step_number: 1, title: 'KYC 认证', description: '访问 Franklin Templeton OnChain 官网，注册账户并完成 KYC 认证（需要护照、地址证明等）。', estimated_time: '30-60 分钟' },
    { step_number: 2, title: '连接或创建钱包', description: '选择托管钱包（简单）或连接 MetaMask 到 Polygon 网络（自托管）。', estimated_time: '10 分钟' },
    { step_number: 3, title: '购买 BENJI', description: '通过银行转账或 USDC 购买 BENJI 代币，最低 $1 起投。', estimated_time: '15 分钟' },
    { step_number: 4, title: '持有赚息', description: 'NAV 每日更新，收益自动复利累积。在仪表板查看持仓和收益。', estimated_time: '持续' },
    { step_number: 5, title: '赎回', description: '需要资金时随时赎回，T+0 或 T+1 到账银行或钱包。', estimated_time: '即时' },
  ],
  status: 'published',
};

// ===== 10.4 Backed Finance 代币化债券 =====
const STRATEGY_10_4 = {
  title: 'Backed Finance 代币化债券 - 欧洲合规 RWA',
  slug: 'backed-finance-tokenized-bonds',
  summary: '购买 Backed Finance 发行的代币化国债（如 bIB01 = 瑞士国债），欧洲合规，瑞士金融监管，投资真实的瑞士或美国国债，年化 4-5%，ERC-20 代币可在 DeFi 使用。',

  category: 'rwa',
  category_l1: 'yield',
  category_l2: 'RWA/链上国债',

  difficulty_level: 2,
  risk_level: 2,

  apy_min: 4,
  apy_max: 5,
  threshold_capital: '100 美元起',
  threshold_capital_min: 100,
  time_commitment: '初始设置 1 小时(KYC)，后续自动',
  time_commitment_minutes: 60,
  threshold_tech_level: 'intermediate',

  content: `## 什么是 Backed Finance

Backed Finance 是一家**瑞士合规的 RWA 平台**，专门将传统金融资产代币化。他们发行的代币 1:1 对应真实的底层资产（国债、ETF 等），并受瑞士金融市场监督管理局（FINMA）监管。

### 核心特点

**1. 瑞士金融监管**
- 受 FINMA 监管
- 瑞士以金融合规著称
- 资产托管在传统银行（如 Sygnum Bank）
- 法律结构清晰透明

**2. 多样化产品线**
- **bIB01**：瑞士 0-1 年期国债（最热门）
- **bC3M**：美国 0-3 个月国债
- **bCSPX**：标普 500 指数 ETF
- **bNIU**：科技股 ETF
- **bGLDC**：黄金 ETC

**3. ERC-20 标准**
- 所有代币都是 ERC-20 格式
- 可以在以太坊生态自由转移
- 支持 DeFi 整合（Uniswap、Aave 等）
- 24/7 可交易

**4. 1:1 资产支持**
- 每个代币对应真实的底层资产
- 资产托管在传统银行
- 定期审计和披露
- 可以随时赎回真实资产

### 主要产品介绍

**bIB01 - 瑞士短期国债（推荐）**
- 底层资产：iShares Swiss Domestic Government Bond 0-1 ETF
- 收益率：约 1.5-2%（瑞士利率较低）
- 特点：最稳定、最安全
- 适合：极度保守投资者

**bC3M - 美国短期国债**
- 底层资产：iShares 0-3 Month Treasury Bond ETF
- 收益率：约 5%
- 特点：美元计价，收益较高
- 适合：追求美元收益的投资者

**bCSPX - 标普 500 指数**
- 底层资产：iShares Core S&P 500 ETF
- 收益率：股息约 1.5% + 资本增值
- 特点：美股敞口
- 适合：想要股票敞口的投资者

### 与其他 RWA 对比

| 产品 | 监管 | 产品类型 | DeFi 整合 | 最低门槛 | 推荐度 |
|-----|------|---------|----------|---------|--------|
| Backed bIB01 | FINMA | 多样 | 好 | $100 | ⭐⭐⭐⭐⭐ |
| BENJI | SEC | 货币基金 | 有限 | $1 | ⭐⭐⭐⭐⭐ |
| ONDO USDY | 部分 | 国债 | 好 | $500 | ⭐⭐⭐⭐ |
| Matrixdock STBT | 部分 | 国债 | 好 | $100 | ⭐⭐⭐⭐ |

**Backed 的独特优势**：
- 产品线最丰富（国债、股票、黄金）
- DeFi 整合最好（可抵押、可交易）
- 欧洲合规（FINMA）

## 实操步骤

### Step 1: 访问官网

1. 访问 Backed Finance 官网：https://backed.fi
2. 点击 "Get Started" 或 "Buy Tokens"
3. 查看可用产品列表

### Step 2: 完成 KYC

**Backed 提供两种购买渠道**：

**渠道 A：官方一级市场（需要 KYC）**
- 直接从 Backed 购买
- 需要完成 KYC
- 最低 $100,000（机构级）
- 适合大额投资者

**渠道 B：二级市场（无需 KYC）**
- 在 DEX（如 Uniswap）购买
- 无需 KYC
- 最低约 $100
- 适合散户投资者

**KYC 流程（一级市场）**：
1. 填写申请表
2. 提交身份证明
3. 提供地址证明
4. 说明资金来源
5. 等待审核（3-5 个工作日）

### Step 3: 选择购买渠道

**方式 A：一级市场（大额）**

1. 完成 KYC 后
2. 联系 Backed 销售团队
3. 通过银行转账购买
4. 代币直接发送到你的钱包

**方式 B：二级市场 Uniswap（推荐散户）**

1. 准备 ETH 钱包（MetaMask）
2. 确保有足够的 ETH（Gas 费）和 USDC/ETH（购买）
3. 访问 Uniswap：https://app.uniswap.org
4. 搜索代币合约地址：
   - bIB01：0x...（官网查询）
   - bC3M：0x...
5. 输入购买金额
6. 确认交易

### Step 4: 购买代币

**以 Uniswap 购买 bC3M 为例**：

1. 连接 MetaMask 到 Uniswap
2. 选择交易对：USDC → bC3M
3. 输入 USDC 数量（如 1000 USDC）
4. 检查：
   - 兑换数量
   - 滑点（建议 < 1%）
   - Gas 费
5. 点击 "Swap"
6. 在 MetaMask 确认交易
7. 等待交易确认（1-5 分钟）
8. bC3M 出现在钱包中

### Step 5: 持有和管理

**查看持仓**：
- 在钱包中查看代币余额
- 代币价格会随底层资产波动
- 国债类代币缓慢增值（利息累积）

**收益方式**：
- **bC3M/bIB01**：NAV 缓慢增长（利息累积到价格中）
- **bCSPX**：价格增长 + 偶尔分红

**注意**：Backed 代币是**累积型**，利息不会单独发放，而是累积到代币价格中。

### Step 6: 卖出或赎回

**方式 A：二级市场卖出（推荐）**
1. 访问 Uniswap
2. 选择 bC3M → USDC
3. 输入卖出数量
4. 确认交易
5. USDC 到账钱包

**方式 B：官方赎回（大额）**
1. 联系 Backed 团队
2. 申请赎回
3. 代币销毁
4. 底层资产卖出
5. 美元/欧元到账银行
6. 周期：T+2 到 T+5

## DeFi 整合策略

Backed 代币的一大优势是可以在 DeFi 中使用：

### 策略 1：Aave 抵押借贷

**操作**：
1. 将 bC3M 存入 Aave（如果支持）
2. 作为抵押品借出 USDC
3. 用借出的 USDC 购买更多 bC3M
4. 实现杠杆收益

**收益计算**：
- bC3M 收益：5%
- 借款成本：3%
- 杠杆：2x
- 杠杆收益：5% × 2 - 3% = 7%

**风险**：清算风险（bC3M 价格下跌时）

### 策略 2：Uniswap LP

**操作**：
1. 提供 bC3M/USDC 流动性
2. 赚取交易手续费
3. 额外收益：1-3%

**风险**：无常损失（但 bC3M 价格稳定，IL 很低）

### 策略 3：收益聚合

**操作**：
1. 将 bC3M 存入 Yearn 等聚合器
2. 自动优化收益策略
3. 无需手动管理

## 收益计算示例

**案例 1：bC3M 美国国债（$10,000）**

- 投资金额：$10,000 USDC
- 购买：约 10,000 bC3M（假设 1:1）
- 年化收益：5%
- 1 年后价值：$10,500
- 卖出滑点：0.3%
- 净收益：$468

**案例 2：bIB01 瑞士国债（$10,000）**

- 投资金额：$10,000 USDC
- 购买：约 9,500 bIB01（含汇率）
- 年化收益：1.8%
- 1 年后价值：约 $10,180
- 卖出滑点：0.5%
- 净收益：约 $130

**案例 3：bCSPX 标普 500（$10,000）**

- 投资金额：$10,000 USDC
- 年化收益：历史平均 10%（含股息和增值）
- 1 年后价值：$11,000
- 风险：股市波动，可能亏损
- 净收益：$1,000（预期）

**结论**：
- 追求稳定：选 bC3M（5%）或 bIB01（2%）
- 追求增长：选 bCSPX（10%+，但有波动）

## 风险分析

### 主要风险

**1. 智能合约风险（低）**
- Backed 代币经过审计
- 但任何智能合约都有风险
- 建议不要全仓

**2. 托管风险（低）**
- 资产托管在 Sygnum Bank
- 瑞士银行，信誉良好
- 但仍有银行风险

**3. 流动性风险（中）**
- 二级市场流动性有限
- 大额交易可能有滑点
- 建议分批买卖

**4. 监管风险（低）**
- FINMA 监管明确
- 但各国对代币化证券政策不同
- 可能面临跨境限制

**5. 价格风险（因产品而异）**
- bC3M/bIB01：极低（国债）
- bCSPX：高（股市波动）
- 选择适合自己风险偏好的产品

### 风险等级

- **bC3M/bIB01**：低风险（2/5）
- **bCSPX**：中风险（3/5）
- **bGLDC**：中风险（3/5）

## 进阶技巧

### 技巧 1：跨产品配置

**策略**：
- 50% bC3M（稳定收益）
- 30% bCSPX（股票增长）
- 20% bGLDC（黄金对冲）

**好处**：分散风险，平衡收益和稳定性

### 技巧 2：定投策略

**操作**：
- 每月固定购买 $500 bCSPX
- 平均成本，降低波动影响
- 长期持有

### 技巧 3：利用 DEX 套利

**机会**：
- 如果 Uniswap 上 bC3M 价格低于 NAV
- 在 DEX 买入
- 等待价格回归
- 或向 Backed 申请赎回（需要 KYC）

### 技巧 4：结合其他 RWA

**组合配置**：
- Backed bC3M（美国国债）
- ONDO USDY（美国国债）
- sDAI（DeFi 原生）

**好处**：分散平台风险

## 常见问题

**Q1：bC3M 和直接买美国国债有什么区别？**

A：
- bC3M：ERC-20 代币，可 DeFi 使用，24/7 交易
- 直接国债：传统券商，交易时间受限，无法 DeFi 使用
- 收益率基本相同

**Q2：需要 KYC 吗？**

A：
- 一级市场（直接从 Backed 买）：需要
- 二级市场（Uniswap）：不需要

**Q3：最低投资多少？**

A：
- 一级市场：$100,000
- 二级市场：约 $100（+ Gas 费）

**Q4：收益怎么发放？**

A：不单独发放。利息累积到 NAV 中，代币价格会缓慢上涨。卖出时一次性获得全部收益。

**Q5：可以抵押借贷吗？**

A：部分支持。一些 DeFi 协议开始接受 Backed 代币作为抵押品，如 Morpho、Aave（部分）。

**Q6：和 BENJI 比哪个好？**

A：
- BENJI：SEC 监管，$1 起投，DeFi 整合有限
- Backed：FINMA 监管，$100 起投，DeFi 整合好
- 追求监管：选 BENJI
- 追求 DeFi 可组合性：选 Backed

**Q7：中国居民可以购买吗？**

A：
- 一级市场：可能受限（KYC）
- 二级市场：可以（无需 KYC）

**Q8：代币会脱锚吗？**

A：可能有小幅波动（±1%），因为二级市场供需不完全平衡。但长期会回归 NAV。

## 总结

### 核心价值

Backed Finance 提供了**最丰富的代币化传统资产**：
- ✅ 瑞士 FINMA 监管
- ✅ 多样产品线（国债、股票、黄金）
- ✅ ERC-20 标准，DeFi 可组合
- ✅ 二级市场无需 KYC
- ✅ 1:1 资产支持

### 适合人群

- 想要传统资产敞口但使用 DeFi
- 追求合规和透明
- 需要 DeFi 可组合性（抵押、LP 等）
- 希望多样化配置（国债+股票+黄金）

### 不适合人群

- 追求高收益（>10%）
- 无法接受二级市场滑点
- 需要大额流动性

### 推荐产品

- **保守型**：bC3M（美国国债，5%）
- **平衡型**：bC3M + bCSPX（国债 + 股票）
- **进阶型**：利用 DeFi 整合增强收益

### 最后建议

Backed Finance 是**欧洲合规 RWA 的领导者**：
- 想要美国国债收益 → bC3M（5%）
- 想要股票敞口 → bCSPX
- 想要黄金对冲 → bGLDC

如果你追求**合规 + DeFi 可组合性**，Backed 是最佳选择。`,

  steps: [
    { step_number: 1, title: 'KYC 或选择二级市场', description: '大额投资者完成 Backed KYC；散户可直接在 Uniswap 二级市场购买，无需 KYC。', estimated_time: '30 分钟' },
    { step_number: 2, title: '选择产品', description: '选择适合的产品：bC3M（美国国债）、bIB01（瑞士国债）、bCSPX（标普 500）等。', estimated_time: '15 分钟' },
    { step_number: 3, title: '购买代币', description: '通过 Uniswap 用 USDC 购买代币，或通过一级市场银行转账购买。', estimated_time: '15 分钟' },
    { step_number: 4, title: 'DeFi 使用（可选）', description: '将代币存入 Aave 抵押借贷，或在 Uniswap 提供流动性，增强收益。', estimated_time: '可选' },
    { step_number: 5, title: '卖出或赎回', description: '二级市场 Uniswap 即时卖出，或通过官方赎回（T+2 到 T+5）。', estimated_time: 'T+0 到 T+5' },
  ],
  status: 'published',
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
    const strategies = [STRATEGY_10_3, STRATEGY_10_4];

    console.log('\n开始创建 10.3 和 10.4 策略...\n');

    for (let i = 0; i < strategies.length; i++) {
      const strategy = {
        ...strategies[i],
        is_featured: false,
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
    console.log('访问: http://localhost:3000/strategies?category=rwa\n');
  } catch (error) {
    console.error('\n❌ 创建失败:', error.response?.data || error.message);
  }
}

addStrategies();
