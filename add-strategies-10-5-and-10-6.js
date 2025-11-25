const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

// ===== 10.5 Maple Finance 信贷池 =====
const STRATEGY_10_5 = {
  title: 'Maple Finance 信贷池 - 机构借贷收益',
  slug: 'maple-finance-credit-pools',
  summary: '在 Maple Finance 参与机构信贷池，为加密原生公司提供贷款，赚取固定收益 8-12% APY，经过尽调的借款人，Pool Delegate 专业管理，适合追求高于国债收益的投资者。',

  category: 'rwa',
  category_l1: 'yield',
  category_l2: 'RWA/链上国债',

  difficulty_level: 3,
  risk_level: 3,

  apy_min: 8,
  apy_max: 12,
  threshold_capital: '1000 美元起',
  threshold_capital_min: 1000,
  time_commitment: '初始设置 1 小时，季度审查',
  time_commitment_minutes: 90,
  threshold_tech_level: 'intermediate',

  content: `## 什么是 Maple Finance

Maple Finance 是**机构级链上信贷协议**，连接机构借款人（做市商、矿企、交易公司）和 DeFi 流动性提供者。它填补了传统银行和纯 DeFi 借贷之间的空白，提供 8-12% 的稳定收益。

### 核心特点

**1. 机构级借款人**
- 借款人：做市商（Wintermute、Alameda）、矿企、交易公司
- 经过专业尽调和信用评估
- 有真实业务收入和还款能力
- 非散户投机借款

**2. Pool Delegate 专业管理**
- 每个信贷池由专业机构（Pool Delegate）管理
- 知名 Delegate：Maven 11、Orthogonal Trading、M11 Credit
- 负责：借款人筛选、条款谈判、风险监控、违约处理
- 你只需选择信任的 Delegate，无需自己做尽调

**3. 固定收益**
- 年化 8-12%（远高于国债 5%）
- 利息按月或按季度分配
- 收益相对稳定，不随市场波动

**4. 超额抵押或信用贷款**
- 部分贷款有超额抵押（如 BTC）
- 部分为信用贷款（依赖企业信用）
- Delegate 负责评估风险

### 与其他借贷协议对比

| 协议 | 借款人 | 收益 | 风险 | 抵押 | 推荐度 |
|-----|--------|------|------|------|--------|
| Maple Finance | 机构 | 8-12% | 中 | 混合 | ⭐⭐⭐⭐ |
| Aave | 任何人 | 3-6% | 低 | 超额抵押 | ⭐⭐⭐⭐⭐ |
| Goldfinch | 新兴市场企业 | 10-18% | 高 | 无抵押 | ⭐⭐⭐ |
| TrueFi | 机构 | 8-15% | 中高 | 无抵押 | ⭐⭐⭐⭐ |

**Maple 的独特优势**：
- 比 Aave 收益高（8-12% vs 3-6%）
- 比 Goldfinch 风险低（有抵押/专业 Delegate）
- 机构借款人质量高

### 历史表现和风险事件

**正面历史**：
- 2021-2022 年：累计放贷 $2B+
- 大部分贷款正常还款
- 平均收益 8-12%

**风险事件**：
- **2022年11月 FTX 暴雷**：部分借款人（如 Alameda）违约
- Orthogonal Trading 池损失约 $36M
- Maven 11 池受影响较小
- **教训**：分散投资到多个池，关注 Delegate 质量

**当前状态（2024年）**：
- 协议重建，更严格的尽调
- 新池主要面向企业信贷
- TVL 约 $300-500M

## 实操步骤

### Step 1: 研究信贷池

**在投资前，你需要了解**：

1. **Pool Delegate 是谁**
   - 查看其历史业绩
   - 是否有违约记录
   - 管理资产规模

2. **借款人类型**
   - 做市商、矿企、还是交易公司
   - 业务模式是否可持续
   - 是否有公开财务信息

3. **贷款条款**
   - 利率和期限
   - 是否有抵押
   - 违约处理机制

**推荐的 Pool Delegate**：
- **Maven 11**：历史业绩好，专注加密原生公司
- **M11 Credit**：多样化借款人，风险分散
- **Icebreaker Finance**：面向传统企业

### Step 2: 连接 Maple Finance

1. 访问 https://app.maple.finance
2. 点击 "Connect Wallet"
3. 选择 MetaMask 或其他钱包
4. 切换到以太坊主网或 Solana（Maple 支持多链）

### Step 3: 选择信贷池

**查看池信息**：

1. 在 "Lend" 页面浏览可用池
2. 点击池查看详情：
   - 当前 APY
   - 池规模和利用率
   - 借款人列表
   - 历史还款记录
   - 锁定期

**示例池信息**：

Maven 11 USDC 池
- APY: 10.5%
- 池规模: $50M
- 利用率: 85%
- 锁定期: 90天
- 借款人: 做市商、矿企


### Step 4: 存入 USDC

1. 选择要投资的池
2. 点击 "Lend" 或 "Deposit"
3. 输入 USDC 数量（最低通常 $1000）
4. 授权 USDC 支出
5. 确认交易
6. 获得 LP 代币（如 mplUSDC）

**注意锁定期**：
- 大多数池有锁定期（30-90天）
- 锁定期内无法赎回
- 到期后进入"提款窗口"

### Step 5: 赚取利息

**利息分配**：
- 按月或按季度分配
- 自动到账钱包
- 或累积到池中复利

**查看收益**：
- 在 Maple 仪表板查看
- 显示累积利息、APY、到期时间

### Step 6: 监控和赎回

**定期监控**：
- 每月查看还款情况
- 关注借款人新闻（如做市商出问题）
- 查看 Delegate 公告

**赎回流程**：
1. 锁定期结束后，进入"提款窗口"
2. 点击 "Withdraw"
3. 输入赎回数量
4. 确认交易
5. USDC 到账钱包

**提款窗口**：
- 通常 2-7 天
- 错过窗口需要等下一个周期
- 建议设置日历提醒

## 收益计算示例

**案例 1：单池投资（$10,000）**

- 投资金额：$10,000 USDC
- 选择池：Maven 11（10% APY）
- 锁定期：90 天
- 预期收益：$10,000 × 10% × (90/365) = $246.58

**案例 2：多池分散（$30,000）**

- 投资金额：$30,000 USDC
- 分配：
  - Maven 11：$10,000（10% APY）
  - M11 Credit：$10,000（9% APY）
  - Icebreaker：$10,000（8.5% APY）
- 年化收益：
  - Maven 11：$1,000
  - M11 Credit：$900
  - Icebreaker：$850
  - 总计：$2,750（9.17% 平均 APY）

**案例 3：复利策略（$10,000，2年）**

- 每季度将利息再投入
- 第 1 年末：$10,000 × 1.10 = $11,000
- 第 2 年末：$11,000 × 1.10 = $12,100
- 总收益：$2,100（21% 总回报，10.25% 年化复利）

**对比国债**：
- 美国国债：5%
- Maple：10%
- 额外收益：5%（但风险更高）

## 风险分析

### 主要风险

**1. 借款人违约风险（最大风险）**
- 借款人可能无法还款
- 2022年 FTX 暴雷导致部分池违约
- **缓解**：选择有抵押的池，分散投资

**2. Pool Delegate 风险**
- Delegate 尽调不充分
- 可能存在利益冲突
- **缓解**：选择有良好历史记录的 Delegate

**3. 智能合约风险**
- Maple 协议可能有漏洞
- **缓解**：Maple 经过多次审计，风险较低

**4. 流动性风险**
- 锁定期内无法提前赎回
- **缓解**：只投入可以锁定的资金

**5. 市场风险**
- 加密市场下跌时，借款人业务受影响
- **缓解**：选择有稳定业务的借款人

### 风险等级

**总体风险：中等（3/5）**
- 高于国债、Aave
- 低于 Goldfinch、高收益 DeFi
- 需要理解机构信贷风险

### 历史违约案例

**Orthogonal Trading 池（2022年11月）**：
- 暴露于 FTX/Alameda
- 违约约 $36M
- 投资者损失本金
- **教训**：不要只看 APY，要研究借款人

## 进阶技巧

### 技巧 1：分散到多个 Delegate

**策略**：
- 不要将所有资金放在一个池
- 分散到 3-5 个不同的 Delegate
- 即使一个违约，损失可控

**示例**：
- 30% Maven 11
- 30% M11 Credit
- 20% Icebreaker
- 20% 其他新池

### 技巧 2：关注锁定期和提款窗口

**策略**：
- 选择不同锁定期的池
- 确保始终有资金到期
- 保持流动性

**示例**：
- 30 天池：30%
- 60 天池：40%
- 90 天池：30%

### 技巧 3：利用 MPL 代币

**Maple 代币（MPL）**：
- 质押 MPL 可以获得额外奖励
- 治理投票权
- 风险：MPL 价格波动

### 技巧 4：结合其他 RWA

**组合配置**：
- 50% Maple（8-12%，中风险）
- 30% BENJI/STBT（5%，低风险）
- 20% Goldfinch（15%，高风险）

**好处**：平衡风险和收益

## 常见问题

**Q1：Maple 和 Aave 有什么区别？**

A：
- Aave：超额抵押，任何人可借，收益低（3-6%）
- Maple：机构信贷，专业尽调，收益高（8-12%）
- Maple 风险稍高但收益更好

**Q2：如果借款人违约怎么办？**

A：
- Pool Delegate 会尝试追回
- 有抵押的池会清算抵押品
- 无抵押的池可能损失本金
- 历史上部分池有完全违约

**Q3：锁定期内可以提前赎回吗？**

A：不可以。锁定期是硬性的，必须等到期。建议只投入确定不需要的资金。

**Q4：利息什么时候到账？**

A：按池设置，通常每月或每季度分配。自动到账钱包或累积复利。

**Q5：最低投资多少？**

A：通常 $1,000 起，部分池更高。

**Q6：需要 KYC 吗？**

A：目前大多数池不需要 KYC，但未来可能变化。

**Q7：支持哪些稳定币？**

A：主要是 USDC，部分池支持 USDT。

**Q8：Maple 在哪些链上？**

A：以太坊主网和 Solana。

## 总结

### 核心价值

Maple Finance 提供**机构级信贷收益**：
- ✅ 8-12% 固定收益（高于国债）
- ✅ 专业 Pool Delegate 管理
- ✅ 机构借款人（做市商、矿企）
- ✅ 部分池有抵押保护

### 适合人群

- 追求高于国债的收益（8-12% vs 5%）
- 能接受中等风险
- 愿意锁定资金（30-90天）
- 能够研究和监控投资

### 不适合人群

- 极度保守（应选国债）
- 需要高流动性
- 无法承受本金损失风险
- 不愿意研究借款人和 Delegate

### 推荐配置

- 保守型：10-20% 资产配置 Maple
- 平衡型：20-30% 资产配置 Maple
- 激进型：30-50% 资产配置 Maple

### 最后建议

Maple Finance 是**传统信贷与 DeFi 的结合**：
- 想要稳定 8-12% 收益 → Maple
- 不想承担任何风险 → 选国债
- 想要更高收益 → 选 Goldfinch（但风险更高）

**关键点**：
- 分散到多个 Delegate
- 研究借款人质量
- 关注锁定期和提款窗口
- 不要投入无法承受损失的资金`,

  steps: [
    { step_number: 1, title: '研究信贷池', description: '查看 Pool Delegate 历史业绩、借款人类型、贷款条款。推荐 Maven 11、M11 Credit 等有良好记录的 Delegate。', estimated_time: '30-60 分钟' },
    { step_number: 2, title: '连接 Maple', description: '访问 app.maple.finance，连接 MetaMask 钱包，切换到以太坊主网。', estimated_time: '5 分钟' },
    { step_number: 3, title: '存入 USDC', description: '选择信贷池，存入 USDC（最低 $1000），获得 LP 代币。注意锁定期（30-90天）。', estimated_time: '15 分钟' },
    { step_number: 4, title: '赚取利息', description: '利息按月或季度分配，自动到账钱包。在仪表板查看累积收益和 APY。', estimated_time: '持续' },
    { step_number: 5, title: '监控与赎回', description: '定期关注借款人还款情况，锁定期后在提款窗口赎回本金和利息。', estimated_time: '每季度 30 分钟' },
  ],
  status: 'published',
};

// ===== 10.6 Centrifuge 真实资产池 =====
const STRATEGY_10_6 = {
  title: 'Centrifuge 真实资产池 - 多元化 RWA 投资',
  slug: 'centrifuge-real-asset-pools',
  summary: '投资 Centrifuge 上的真实资产池（如发票、房地产、汽车贷款），享受链上资产证券化收益 6-15% APY，资产由 Tinlake 协议管理，MakerDAO 提供部分流动性支持。',

  category: 'rwa',
  category_l1: 'yield',
  category_l2: 'RWA/链上国债',

  difficulty_level: 4,
  risk_level: 4,

  apy_min: 6,
  apy_max: 15,
  threshold_capital: '500 美元起',
  threshold_capital_min: 500,
  time_commitment: '初始设置 2 小时，月度审查',
  time_commitment_minutes: 150,
  threshold_tech_level: 'advanced',

  content: `## 什么是 Centrifuge

Centrifuge 是**去中心化资产融资协议**，将真实世界资产（发票、房地产抵押、设备租赁、应收账款等）证券化上链。它是 RWA 领域最早期和最重要的项目之一，得到了 MakerDAO 的支持。

### 核心特点

**1. 真实资产证券化**
- 发票融资（Invoice Financing）
- 房地产抵押（Real Estate）
- 设备租赁（Equipment Leasing）
- 贸易融资（Trade Finance）
- 消费贷款（Consumer Loans）

**2. 分级投资结构**
- **DROP（优先级）**：固定收益，优先偿还，低风险
- **TIN（次级）**：高收益，承担首损，高风险
- 类似传统 ABS（资产支持证券）的分级结构

**3. 链上透明**
- 所有资产在链上可查
- 借款人、还款记录、抵押品状态透明
- 实时 NAV 更新

**4. MakerDAO 支持**
- MakerDAO 为 Centrifuge 池提供流动性
- 部分池可以铸造 DAI
- 增加了协议的可信度

### 分级结构详解

**DROP Token（优先级）**

- 固定收益：6-8% APY
- 优先获得还款
- 本金保护较好
- 适合保守投资者

**TIN Token（次级）**

- 浮动收益：12-20%+ APY
- 承担首损（First Loss）
- 如果有违约，TIN 先亏损
- 适合激进投资者

**示例**：
- 池规模：$10M
- DROP：$8M（80%，6% APY）
- TIN：$2M（20%，15% APY）
- 如果违约 $1M，TIN 承担全部损失
- DROP 不受影响

### 与其他 RWA 对比

| 协议 | 资产类型 | 收益 | 风险 | 分级 | 推荐度 |
|-----|---------|------|------|------|--------|
| Centrifuge | 多样 | 6-15% | 中高 | 是 | ⭐⭐⭐⭐ |
| Maple | 机构信贷 | 8-12% | 中 | 否 | ⭐⭐⭐⭐ |
| Goldfinch | 新兴市场 | 10-18% | 高 | 是 | ⭐⭐⭐ |
| BENJI | 国债 | 5% | 极低 | 否 | ⭐⭐⭐⭐⭐ |

**Centrifuge 的独特优势**：
- 资产类型最丰富
- 分级结构灵活
- MakerDAO 背书

## 主要资产池介绍

### 1. New Silver（房地产过桥贷款）

**资产类型**：美国房地产过桥贷款
**收益**：
- DROP：5-7% APY
- TIN：12-15% APY

**特点**：
- 房产作为抵押
- 贷款期限短（6-12个月）
- 违约时可清算房产

### 2. ConsolFreight（货运发票）

**资产类型**：货运公司应收发票
**收益**：
- DROP：6-8% APY
- TIN：15-20% APY

**特点**：
- 发票到期后回款
- 周期短（30-90天）
- 依赖货运行业健康

### 3. Harbor Trade（贸易融资）

**资产类型**：国际贸易应收款
**收益**：
- DROP：7-9% APY
- TIN：15-18% APY

**特点**：
- 跨境贸易融资
- 有信用保险
- 风险较分散

### 4. BlockTower（多策略）

**资产类型**：混合资产（信贷、房地产等）
**收益**：
- DROP：6-8% APY
- TIN：12-15% APY

**特点**：
- 专业管理团队
- 资产多样化
- 机构级运营

## 实操步骤

### Step 1: 学习 Centrifuge 机制

**在投资前，你需要理解**：

1. **资产证券化**
   - 真实资产如何变成链上代币
   - 现金流如何分配
   - 违约如何处理

2. **分级结构**
   - DROP vs TIN 的区别
   - 首损机制
   - 收益分配顺序

3. **资产评估**
   - 如何评估发票、房产质量
   - 借款人信用
   - 抵押品价值

**学习资源**：
- Centrifuge 官方文档
- 各池的 Executive Summary
- MakerDAO 对 Centrifuge 的尽调报告

### Step 2: 选择资产池

**浏览可用池**：

1. 访问 https://app.centrifuge.io
2. 点击 "Pools" 查看所有池
3. 筛选：
   - 资产类型
   - 收益率
   - 池规模
   - 历史表现

**评估池质量**：

- **资产质量**：借款人是谁？抵押品是什么？
- **历史表现**：过去有无违约？
- **池规模**：太小流动性差，太大可能稀释收益
- **发起人信誉**：谁在运营这个池？

### Step 3: 选择 DROP 或 TIN

**保守投资者：选 DROP**
- 收益：6-8% APY
- 风险：低（TIN 先承担损失）
- 流动性：通常更好

**激进投资者：选 TIN**
- 收益：12-20% APY
- 风险：高（首损）
- 适合：能承受本金损失

**平衡策略**：
- 70% DROP + 30% TIN
- 平均收益约 9-11% APY

### Step 4: 投资

**投资流程**：

1. 连接钱包（MetaMask）
2. 选择池和代币类型（DROP/TIN）
3. 输入投资金额（DAI 或其他稳定币）
4. 授权支出
5. 确认投资
6. 获得 DROP 或 TIN 代币

**注意**：
- 部分池可能需要 KYC
- 可能有最低投资额
- 新池可能有投资上限

### Step 5: 赚取收益

**收益来源**：
- 借款人还款利息
- 按照资产现金流分配

**收益分配顺序**：
1. DROP 优先获得固定收益
2. 剩余部分归 TIN
3. 如果收益不足，TIN 可能亏损

**查看收益**：
- 在 Centrifuge App 查看持仓
- 显示 NAV、累积收益、到期时间

### Step 6: 赎回

**赎回机制**：
- 取决于池的流动性
- 资产到期后才能赎回
- 可能需要等待几周到几个月

**赎回流程**：
1. 点击 "Redeem"
2. 输入赎回数量
3. 等待流动性（资产到期还款）
4. DAI 到账钱包

**注意**：
- 不像 Aave 可以即时赎回
- 需要等待资产周期
- 大额赎回可能需要更长时间

## 收益计算示例

**案例 1：保守策略 DROP（$10,000）**

- 投资金额：$10,000 DAI
- 选择：New Silver DROP（6.5% APY）
- 持有时间：1 年
- 预期收益：$650
- 风险：低（有房产抵押 + TIN 缓冲）

**案例 2：激进策略 TIN（$10,000）**

- 投资金额：$10,000 DAI
- 选择：ConsolFreight TIN（18% APY）
- 持有时间：1 年
- 预期收益：$1,800
- 风险：高（如果违约，可能亏损本金）

**案例 3：平衡策略（$10,000）**

- DROP（70%）：$7,000 × 7% = $490
- TIN（30%）：$3,000 × 15% = $450
- 总收益：$940（9.4% APY）
- 风险：中等

**案例 4：多池分散（$30,000）**

- New Silver DROP：$10,000（6.5%）→ $650
- Harbor Trade DROP：$10,000（8%）→ $800
- BlockTower TIN：$10,000（14%）→ $1,400
- 总收益：$2,850（9.5% 平均 APY）

## 风险分析

### 主要风险

**1. 资产违约风险（最大风险）**
- 借款人可能无法还款
- 抵押品可能贬值
- **缓解**：选择有优质抵押的池，投资 DROP

**2. 流动性风险**
- 资产到期前无法赎回
- 大额赎回需要等待
- **缓解**：只投入长期资金，分散到期时间

**3. 智能合约风险**
- Centrifuge 协议可能有漏洞
- **缓解**：协议经过多次审计

**4. 资产评估风险**
- 资产价值可能被高估
- 尽调可能不充分
- **缓解**：研究发起人信誉，查看第三方评估

**5. 宏观经济风险**
- 经济衰退导致违约增加
- 房地产市场下跌
- **缓解**：分散资产类型

### 风险等级

- **DROP**：中风险（3/5）
- **TIN**：高风险（4/5）
- **整体**：中高风险（3.5/5）

## 进阶技巧

### 技巧 1：分散资产类型

**策略**：
- 不要只投一种资产类型
- 分散到房地产、发票、贸易等
- 降低单一行业风险

**示例**：
- 房地产池：40%
- 发票池：30%
- 贸易池：30%

### 技巧 2：DROP + TIN 组合

**策略**：
- 同一池中组合 DROP 和 TIN
- DROP 提供稳定收益
- TIN 提供高收益潜力

**示例**：
- 同一池 70% DROP + 30% TIN

### 技巧 3：关注到期时间

**策略**：
- 选择不同到期时间的资产
- 确保定期有流动性
- 避免全部资金长期锁定

### 技巧 4：利用 MakerDAO 整合

**策略**：
- 部分池可以铸造 DAI
- 增加资金利用率
- 但需要理解 Maker 清算风险

## 常见问题

**Q1：Centrifuge 和传统 ABS 有什么区别？**

A：
- 两者都是资产证券化
- Centrifuge 在链上，透明度更高
- 门槛更低（$500 vs 传统 $100,000+）
- 24/7 可交易

**Q2：DROP 是否保本？**

A：不完全保本。虽然 TIN 先承担损失，但如果损失超过 TIN 规模，DROP 也会亏损。风险低但不是零。

**Q3：可以随时赎回吗？**

A：不能。需要等待资产到期或有足够流动性。可能需要数周到数月。

**Q4：收益什么时候到账？**

A：取决于资产现金流。发票池可能每月，房地产池可能每季度。

**Q5：需要 KYC 吗？**

A：部分池需要，部分不需要。大额投资通常需要。

**Q6：最低投资多少？**

A：通常 $500-$1000 起。

**Q7：支持哪些稳定币？**

A：主要是 DAI，部分池支持其他稳定币。

**Q8：和 Goldfinch 比哪个好？**

A：
- Centrifuge：有抵押，资产多样，收益 6-15%
- Goldfinch：无抵押，新兴市场，收益 10-18%
- Centrifuge 风险稍低，Goldfinch 收益稍高

## 总结

### 核心价值

Centrifuge 提供**多元化真实资产投资**：
- ✅ 资产类型丰富（房地产、发票、贸易）
- ✅ 分级结构（DROP/TIN）
- ✅ 链上透明
- ✅ MakerDAO 支持

### 适合人群

- 想要真实资产敞口
- 能理解资产证券化
- 能接受流动性限制
- 愿意深入研究各池质量

### 不适合人群

- 需要即时流动性
- 无法理解分级结构
- 不愿意研究资产质量
- 极度保守（应选国债）

### 推荐配置

- 保守型：主要投资 DROP（6-8%）
- 平衡型：DROP + TIN 组合（9-12%）
- 激进型：主要投资 TIN（12-20%）

### 最后建议

Centrifuge 是**真实资产证券化的先驱**：
- 想要稳定收益 → DROP（6-8%）
- 想要高收益 → TIN（12-20%）
- 想要分散 → 多池组合

**关键点**：
- 深入研究每个池的资产质量
- 理解 DROP/TIN 分级机制
- 注意流动性限制
- 分散投资到多个池和资产类型`,

  steps: [
    { step_number: 1, title: '学习 Centrifuge', description: '理解资产证券化机制、DROP/TIN 分级结构、首损机制。阅读官方文档和 MakerDAO 尽调报告。', estimated_time: '1 小时' },
    { step_number: 2, title: '选择资产池', description: '浏览 app.centrifuge.io，研究池的资产类型、借款人、抵押品、历史表现。', estimated_time: '1 小时' },
    { step_number: 3, title: '投资 DROP/TIN', description: '选择 DROP（稳定 6-8%）或 TIN（高风险 12-20%），用 DAI 投资。', estimated_time: '30 分钟' },
    { step_number: 4, title: '赚取收益', description: '收益按资产现金流分配，在仪表板查看 NAV 和累积收益。', estimated_time: '持续' },
    { step_number: 5, title: '到期赎回', description: '等待资产到期后赎回，可能需要数周到数月。设置日历提醒。', estimated_time: '到期时' },
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
    const strategies = [STRATEGY_10_5, STRATEGY_10_6];

    console.log('\n开始创建 10.5 和 10.6 策略...\n');

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
