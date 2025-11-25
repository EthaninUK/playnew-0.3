const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

const GUIDE_CONFIG = {
  title: 'RWA 稳定收益池',
  slug: 'rwa-stable-yield',
  summary:
    'RWA（真实世界资产）稳定收益池实战：Ondo Finance/Maple Finance/Centrifuge协议对比（6-12% APY）、美债代币化收益（OUSG/USDY）、链上信贷池、机构级风控、KYC合规要求、稳定币抵押借贷、违约风险分析、传统金融+DeFi融合、监管友好型投资、$50K本金年赚$4,500案例。',

  category: 'stablecoin-yield',
  category_l1: 'yield',
  category_l2: '稳定币理财',

  difficulty_level: 2,
  risk_level: 3,
  apy_min: 6,
  apy_max: 12,

  threshold_capital: '10,000–500,000 USD（部分协议有最低额度）',
  threshold_capital_min: 10000,
  time_commitment: '初始KYC认证2-5天，投资设置2小时，每月检查信贷池状态30分钟',
  time_commitment_minutes: 30,
  threshold_tech_level: 'intermediate',

  content: `> **适用人群**：持有大额稳定币、追求传统金融级别收益、可接受KYC、希望投资真实世界资产、风险偏好中等的成熟投资者

> **阅读时间**：≈ 25–30 分钟

> **关键词**：RWA / Real World Assets / Tokenized Bonds / On-chain Credit / Ondo Finance / Maple Finance / US Treasury / Institutional DeFi / Compliance / Credit Risk

---

## 🧭 TL;DR

**核心策略**：投资链上代币化的真实世界资产（如美国国债、企业信贷），赚取稳定收益。

**什么是RWA**：
- Real World Assets（真实世界资产）
- 传统金融资产代币化上链
- 例如：美债、房地产贷款、企业债券

**收益对比**：
- **传统美债**：4-5% APY（需要券商账户）
- **RWA美债代币**：6-8% APY（链上直接投资）
- **企业信贷池**：8-12% APY（承担违约风险）
- **房地产贷款池**：7-10% APY

**收益模型**（$50K本金）：
- **6% APY**（低风险美债）：$50K × 6% = **$3,000/年**（$250/月）
- **9% APY**（中等风险信贷）：$50K × 9% = **$4,500/年**（$375/月）
- **12% APY**（高风险信贷）：$50K × 12% = **$6,000/年**（$500/月）

**优势**：
- ✅ 收益稳定可预测（固定收益产品）
- ✅ 有真实资产支持（非纯链上抵押）
- ✅ 监管合规（适合机构投资者）
- ✅ 风险分散（不同资产类别）

**劣势**：
- ❌ 需要KYC认证（2-5天审核）
- ❌ 最低投资额度（部分协议$10K起）
- ❌ 流动性较低（锁定期30-90天）
- ❌ 违约风险（企业破产可能损失本金）

---

## 🗂 目录
1. [RWA概念解析](#rwa概念解析)
2. [主流RWA协议对比](#主流rwa协议对比)
3. [Ondo Finance美债投资](#ondo-finance美债投资)
4. [Maple Finance信贷池](#maple-finance信贷池)
5. [Centrifuge资产池](#centrifuge资产池)
6. [KYC合规流程](#kyc合规流程)
7. [风险评估与管理](#风险评估与管理)
8. [流动性与退出](#流动性与退出)
9. [真实收益案例](#真实收益案例)
10. [常见问题FAQ](#常见问题faq)

---

## 🏛️ RWA概念解析

### 什么是RWA

**定义**：将传统金融资产代币化，在区块链上发行和交易。

**传统投资流程**：
投资美债 → 开券商账户 → 通过经纪商购买 → 等待结算（T+2）

**RWA投资流程**：
购买USDC → 连接钱包 → 兑换成美债代币（OUSG） → 即时到账

---

### RWA的优势

#### 1. 降低门槛
**传统**：最低$100K（机构级美债）
**RWA**：最低$10K（Ondo Finance）

#### 2. 提升效率
**传统**：结算T+2，赎回需要5个工作日
**RWA**：即时转账，赎回1-7天

#### 3. 透明度
**传统**：资产托管在券商，难以验证
**RWA**：链上透明，实时查看储备资产

#### 4. 组合性
**传统**：美债和DeFi分离
**RWA**：美债代币可用于DeFi（如抵押借贷）

---

### RWA资产类别

| 资产类型 | 代表协议 | APY | 风险等级 |
|----------|----------|-----|----------|
| **美国国债** | Ondo Finance | 4-6% | 极低 |
| **企业信贷** | Maple Finance | 8-12% | 中等 |
| **房地产贷款** | Centrifuge | 7-10% | 中等 |
| **发票融资** | Credix | 10-15% | 高 |
| **碳信用额度** | Toucan | 5-8% | 中等 |

---

## 📊 主流RWA协议对比

### 协议概览

| 协议 | TVL | 主要资产 | APY范围 | KYC要求 | 最低投资 |
|------|-----|----------|---------|---------|----------|
| **Ondo Finance** | $500M | 美债/货币基金 | 4-6% | 是 | $10K |
| **Maple Finance** | $300M | 企业信贷 | 8-12% | 是 | $100K |
| **Centrifuge** | $250M | 房地产/发票 | 7-10% | 部分需要 | $5K |
| **Goldfinch** | $100M | 新兴市场信贷 | 10-15% | 否 | $1K |
| **TrueFi** | $150M | 无抵押借贷 | 8-12% | 否 | $1K |

---

### 选择策略

#### 保守型（追求安全）
→ **Ondo Finance**（美债支持，风险最低）

#### 平衡型（收益与风险平衡）
→ **Centrifuge**（多元化资产池，中等风险）

#### 激进型（追求高收益）
→ **Maple Finance**（企业信贷，高收益高风险）

---

## 🏦 Ondo Finance美债投资

### 产品介绍

**OUSG（Ondo US Government Securities）**：
- 投资标的：美国短期国债（1-3个月期）
- 当前APY：4.5%（跟随美联储利率）
- 最低投资：$100K
- KYC：必需（美国居民优先）

**USDY（Ondo US Dollar Yield）**：
- 投资标的：美国国债 + 银行存款
- 当前APY：5.2%
- 最低投资：$10K
- KYC：必需（全球投资者）

---

### 投资流程

#### Step 1：KYC认证
1. 访问 https://ondo.finance/
2. 点击"Get Started"
3. 填写个人信息（姓名/地址/身份证）
4. 上传身份证明文件
5. 等待审核（2-5个工作日）

**审核标准**：
- 18岁以上
- 非美国制裁国家居民
- 提供有效身份证明

---

#### Step 2：存入USDC
1. 审核通过后，连接钱包（MetaMask）
2. 选择USDY产品
3. 输入投资金额（最低$10K）
4. 确认USDC → USDY兑换
5. Gas费：$5-$15（以太坊主网）

---

#### Step 3：赚取收益
**收益方式**：USDY代币价值每日增长

**示例**：
- 投资：10,000 USDC → 10,000 USDY
- 30天后：10,000 USDY价值 = 10,043 USDC
- 收益：$43（5.2% APY）

**特点**：
- 收益自动复投（无需手动收割）
- USDY价格持续增长

---

#### Step 4：赎回
1. 在Ondo App点击"Redeem"
2. 输入赎回数量
3. 提交赎回请求
4. 等待处理（1-3个工作日）
5. USDC到账

**注意**：不是即时赎回（需要卖出底层美债）

---

### 风险分析

**信用风险**：极低
- 底层资产：美国国债（AAA评级）
- 托管方：Coinbase Custody + Bank of New York Mellon

**流动性风险**：低
- 赎回周期：1-3天
- 紧急情况可在二级市场卖出USDY（可能有折价）

**监管风险**：中等
- SEC可能将USDY归类为证券
- 可能面临更严格监管

---

## 💼 Maple Finance信贷池

### 产品介绍

**定义**：去中心化企业信贷平台，连接借款企业和DeFi投资者。

**工作机制**：
1. 企业申请贷款（如加密基金、做市商）
2. Pool Delegate审核企业信用
3. 通过后创建借贷池
4. LP投资者存入USDC赚取利息
5. 企业按期还款+利息

---

### 主要信贷池

#### 1. Cash Management Pool
**借款方**：美国企业（需KYC）
**APY**：8-10%
**期限**：90天滚动
**最低投资**：$100K
**风险**：中等（企业信用风险）

#### 2. Orthogonal Trading Pool
**借款方**：Orthogonal Trading（做市商）
**APY**：9.5%
**期限**：180天
**最低投资**：$100K
**风险**：中等（单一借款方风险）

---

### 投资流程

#### Step 1：完成KYC
- Maple要求投资者KYC（Synaps验证）
- 审核时间：1-3天
- 要求：护照/驾照 + 地址证明

#### Step 2：选择信贷池
1. 访问 https://app.maple.finance/
2. 浏览"Pools"列表
3. 查看每个池的详细信息：
   - 借款方介绍
   - 贷款期限
   - 当前APY
   - 历史违约率

#### Step 3：存入资金
1. 选择池子点击"Deposit"
2. 输入USDC数量（最低$100K）
3. 确认存入交易
4. 收到LP代币（凭证）

#### Step 4：收益管理
**收益发放**：每30天一次
**收益形式**：USDC直接到账（自动复投可选）

**查看收益**：
- Dashboard显示已赚取利息
- 可随时提取利息
- 本金需等待贷款到期或赎回窗口

---

### 风险管理

#### 1. Pool Delegate审核
**Maple特色**：引入Pool Delegate（池子代表）
- 专业信贷经理
- 负责审核借款方
- 承担部分损失（First Loss Capital）

**示例**：
- Orthogonal Pool由Maven 11管理
- Maven 11存入$2M作为First Loss Capital
- 如果贷款违约，先赔付Maven 11的$2M
- LP损失降低

#### 2. 历史违约率
**Maple历史表现**（2021-2024）：
- 总贷款额：$2.5B
- 违约金额：$50M（2022年Three Arrows Capital倒闭）
- 违约率：2%
- LP平均损失：1.5%（有First Loss保护）

#### 3. 分散投资
**策略**：
- 投资多个池子（降低单一借款方风险）
- 混合不同资产类型（信贷+美债）

---

## 🏗️ Centrifuge资产池

### 产品介绍

**定义**：专注于房地产和发票融资的RWA平台。

**主要资产池**：

#### 1. New Silver - 房地产贷款
**资产**：美国住宅翻新贷款（Fix-and-Flip）
**APY**：8-10%
**期限**：6-12个月
**最低投资**：$5K
**风险**：中等（房地产市场波动）

#### 2. ConsolFreight - 货运发票
**资产**：货运公司应收账款
**APY**：9%
**期限**：30-90天
**最低投资**：$5K
**风险**：低-中等（短期应收账款）

---

### 投资流程

1. 访问 https://app.centrifuge.io/
2. 选择资产池（如New Silver）
3. 连接钱包
4. 投资USDC（部分池需KYC）
5. 收到Tranche代币（Senior/Junior）

**Tranche机制**：
- **Senior Tranche**：优先受偿，低收益（7% APY）
- **Junior Tranche**：高风险高收益（12% APY）

---

## 📋 KYC合规流程

### 为什么需要KYC

**监管要求**：
- RWA涉及真实世界资产 → 受传统金融监管
- 反洗钱（AML）合规
- 投资者适格性验证（Accredited Investor）

---

### KYC流程

#### 通用步骤（Ondo/Maple/Centrifuge）
1. **个人信息**：姓名、生日、国籍、地址
2. **身份验证**：上传护照/驾照照片
3. **地址证明**：水电费账单/银行对账单
4. **人脸识别**：自拍照+活体检测
5. **投资者资格**（部分协议）：
   - 年收入$200K+ 或
   - 净资产$1M+ 或
   - 金融专业资格

**审核时间**：
- 自动审核：1-24小时
- 人工审核：2-5工作日

---

### 隐私考虑

**数据安全**：
- KYC数据加密存储
- 第三方服务商（Synaps/Persona）
- 符合GDPR欧盟隐私法

**匿名性丧失**：
- RWA投资需要实名
- 无法像纯DeFi那样匿名
- 适合合规意识强的投资者

---

## ⚠️ 风险评估与管理

### 主要风险类型

#### 1. 违约风险（Credit Risk）
**定义**：借款方无法偿还本金和利息

**历史案例**：
- 2022年Maple Finance - Orthogonal Pool
- 借款方：加密对冲基金
- 结果：$36M未能按时还款（后续部分追回）

**防范**：
- 查看Pool Delegate背景
- 分散投资多个池子
- 避免单一借款方占比>30%

---

#### 2. 流动性风险
**问题**：RWA产品流动性低于DeFi

**对比**：
- Aave：随时提现（利用率<90%时）
- Ondo USDY：赎回1-3天
- Maple信贷池：锁定至贷款到期（90-180天）

**策略**：
- 保留30%资金在高流动性产品（Aave/CEX）
- 仅用长期闲置资金投资RWA

---

#### 3. 监管风险
**风险**：SEC/CFTC可能将RWA代币归类为证券

**影响**：
- 协议可能被迫关闭美国用户
- 代币可能被下架（流动性枯竭）

**案例**：
- 2023年Paxos被SEC要求停止发行BUSD
- RWA协议面临类似风险

**防范**：
- 关注监管动态
- 投资合规程度高的协议（Ondo/Maple）

---

## 💧 流动性与退出

### 赎回机制

#### Ondo Finance
**流程**：
1. 提交赎回请求
2. 协议卖出底层美债
3. 1-3个工作日到账

**限制**：
- 无最低赎回金额
- 但频繁赎回影响池子APY

---

#### Maple Finance
**流程**：
1. 等待贷款到期
2. 或在赎回窗口期（每季度）
3. 提交赎回 → 5-10个工作日

**限制**：
- 锁定期内无法赎回
- 赎回窗口期有名额限制

---

### 二级市场

**Uniswap/Curve**：
- 部分RWA代币有流动性池
- 可立即卖出（可能折价3-5%）

**OTC交易**：
- 在Telegram/Discord找买家
- 协商价格（通常折价）

---

## 💰 真实收益案例

### 案例1：保守型（$50K，Ondo USDY）

**配置**：
- 产品：Ondo USDY
- 本金：$50K
- APY：5.2%

**操作成本**：
- KYC：免费
- 购买USDY：$10 Gas
- 赎回：$10 Gas
- 总成本：$20

**年度收益**：
- 利息：$50K × 5.2% = $2,600
- Gas成本：$20
- 净收益：**$2,580**

**风险**：极低（美债支持）

---

### 案例2：平衡型（$100K，50% Ondo + 50% Centrifuge）

**配置**：
- Ondo USDY：$50K × 5.2% = $2,600
- Centrifuge New Silver：$50K × 9% = $4,500
- 总收益：$7,100
- 综合APY：7.1%

**风险**：低-中等（分散风险）

---

### 案例3：激进型（$200K，Maple信贷池）

**配置**：
- Maple Cash Management Pool：$200K
- APY：9.5%

**年度收益**：
- 利息：$200K × 9.5% = $19,000
- Gas成本：$50
- 净收益：**$18,950**

**风险事件模拟**（违约率5%）：
- 损失：$200K × 5% = $10,000
- 净收益：$19,000 - $10,000 = $9,000
- 实际APY：4.5%

**结论**：即使有违约，仍优于美债收益

---

## ❓ 常见问题FAQ

**Q1：RWA和DeFi借贷有什么区别？**
> **DeFi借贷**（Aave）：链上抵押（ETH/BTC），超额抵押，无KYC。**RWA**：真实资产支持（美债/企业信贷），部分抵押或无抵押，需KYC。RWA收益更高但流动性更低。

**Q2：Ondo USDY安全吗？**
> **较安全**。底层100%投资美国国债（AAA评级），托管在Coinbase Custody。风险：①监管风险（SEC可能认定为证券）②赎回延迟（1-3天）③智能合约风险（低）。

**Q3：Maple信贷池会不会血本无归？**
> **可能但概率低**。历史违约率2%，有Pool Delegate First Loss保护。最坏情况：借款方破产+Pool Delegate破产 → LP损失10-30%本金。建议：分散投资+只用闲置资金。

**Q4：RWA代币可以用于DeFi吗？**
> **部分可以**。USDY可在Uniswap交易，作为抵押品在Aave V3借款（LTV 75%）。但流动性远低于USDC/USDT，大额操作滑点高。

**Q5：非美国居民可以投资吗？**
> **看协议**。Ondo USDY：全球开放（中国/朝鲜等制裁国除外）。Maple：部分池子仅限美国合格投资者。Centrifuge：大部分开放。需仔细查看各协议的地域限制。

---

## ✅ 执行清单

### 准备阶段（第1周）
- [ ] 研究RWA概念（阅读Ondo/Maple白皮书）
- [ ] 对比各协议APY和风险（DeFi Llama RWA页面）
- [ ] 准备KYC材料（护照扫描件+地址证明）
- [ ] 评估风险承受能力（保守→Ondo，激进→Maple）

### 投资部署（第2周）
- [ ] 完成Ondo Finance KYC（等待审核）
- [ ] 小额测试$10K投资USDY
- [ ] 观察7天收益累积
- [ ] 测试赎回流程（了解等待时间）

### 规模化配置（第3-4周）
- [ ] 增加至$50K-$200K本金
- [ ] 分散至2-3个协议（降低单点风险）
- [ ] 设置每月收益检查提醒
- [ ] 关注Pool Delegate报告（贷款状态）

### 长期管理（持续）
- [ ] 每月审查借款方信用（Maple/Centrifuge）
- [ ] 关注监管动态（SEC对RWA态度）
- [ ] 年度税务申报（利息收入需报税）
- [ ] 再平衡：根据APY变化调整配置

---

## 🔚 结语

RWA稳定收益池是**传统金融与DeFi的桥梁**：
- ✅ **优势**：收益稳定（6-12% APY）、真实资产支持、监管合规
- ⚠️ **挑战**：需要KYC、流动性低、违约风险

**三个核心原则**：
1. **风险分层**：保守用Ondo美债，平衡用Centrifuge，激进用Maple信贷
2. **流动性管理**：RWA仅占总资产30-50%，保留CEX/Aave作为应急资金
3. **分散投资**：单一协议<40%资金，单一借款方<20%

RWA是**机构级DeFi收益的未来方向**！🏛️💰
`,

  steps: [
    { step_number: 1, title: 'RWA概念学习与协议研究', description: '理解RWA（真实世界资产）定义和运作机制，阅读Ondo Finance/Maple Finance白皮书，对比各协议APY、风险等级、最低投资额度，访问DeFi Llama RWA板块查看TVL排名，选择适合自己风险偏好的协议（保守→Ondo，激进→Maple）。', estimated_time: '3–5 小时' },
    { step_number: 2, title: 'KYC认证与账户准备', description: '准备KYC材料（护照/驾照扫描件+地址证明文件），访问Ondo Finance官网提交KYC申请，上传身份证明和地址证明，完成人脸识别验证，等待审核通过（通常2-5个工作日），准备$10K USDC用于测试投资。', estimated_time: '2–5 天' },
    { step_number: 3, title: '小额测试投资', description: '审核通过后连接MetaMask到Ondo App，选择USDY产品（最低$10K），确认USDC→USDY兑换交易（Gas $10），观察7天收益累积（USDY价值增长），测试赎回流程了解等待时间（1-3天），验证收益计算是否符合预期APY。', estimated_time: '1 周' },
    { step_number: 4, title: '规模化与多协议配置', description: '确认策略可行后增加至$50K-$200K本金，分散投资至2-3个协议（例如Ondo 50% + Centrifuge 30% + Maple 20%），对比不同资产池的APY和风险（美债vs企业信贷vs房地产），设置每月收益检查提醒，关注Pool Delegate发布的借款方状态报告。', estimated_time: '2–3 小时' },
    { step_number: 5, title: '长期监控与风险管理', description: '每月审查投资组合表现（实际APY vs 预期APY），关注借款方信用变化（Maple/Centrifuge违约风险），监控监管动态（SEC对RWA代币的态度），年度税务申报准备（利息收入需报税），根据APY变化再平衡配置（如美债利率上升时增加Ondo配比）。', estimated_time: '每月30分钟' },
  ],
};

async function getAuthToken() {
  const response = await axios.post(`${DIRECTUS_URL}/auth/login`, {
    email: 'the_uk1@outlook.com',
    password: 'Mygcdjmyxzg2026!',
  });
  return response.data.data.access_token;
}

async function addGuide() {
  try {
    const token = await getAuthToken();

    const strategy = {
      ...GUIDE_CONFIG,
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
      },
    );

    console.log('\n✅ RWA 稳定收益池创建成功!');
    console.log(`   ID: ${response.data.data.id}`);
    console.log(`   Slug: ${response.data.data.slug}`);
    console.log(`   访问: http://localhost:3000/strategies/${response.data.data.slug}\n`);
  } catch (error) {
    console.error('\n❌ 创建失败:', error.response?.data || error.message);
  }
}

addGuide();