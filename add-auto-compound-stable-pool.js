const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

const GUIDE_CONFIG = {
  title: '自动复利稳定池',
  slug: 'auto-compound-stable-pool',
  summary:
    '自动复利稳定池实战：Convex/Stake DAO/Concentrator自动复利Curve收益（10-18% APY）、CRV/CVX代币自动收割、锁仓Boost最大化、复利频率优化（日复利vs周复利）、Gas费共摊机制、Curve Wars收益分配、稳定币池无常损失保护、流动性激励叠加、$30K本金年赚$4,200案例。',

  category: 'stablecoin-yield',
  category_l1: 'yield',
  category_l2: '稳定币理财',

  difficulty_level: 2,
  risk_level: 2,
  apy_min: 10,
  apy_max: 18,

  threshold_capital: '5,000–100,000 USD（以太坊Gas费较高）',
  threshold_capital_min: 5000,
  time_commitment: '初始学习6小时，部署设置2小时，每月检查收益30分钟，全自动运行',
  time_commitment_minutes: 30,
  threshold_tech_level: 'intermediate',

  content: `> **适用人群**：持有稳定币、希望自动化Curve挖矿、追求高于手动收益（10-18% APY）、能承受以太坊Gas费的中级玩家

> **阅读时间**：≈ 20–25 分钟

> **关键词**：Auto-compound / Convex Finance / Curve Boost / CRV Rewards / CVX / veCRV / Gas Optimization / Stable Pool

---

## 🧭 TL;DR

**核心策略**：使用Convex/Stake DAO等协议自动复利Curve收益，无需手动收割和锁仓。

**什么是自动复利稳定池**：
- 基于Curve稳定币池（3Pool/FRAX等）
- 自动收割CRV奖励
- 自动复投增加本金
- 自动获得最大Boost（2.5倍）

**收益对比**：
- **手动Curve**：8% APY（手续费）+ 2% CRV（无Boost）= 10% APY
- **Curve + 锁veCRV**：8% + 5% CRV（2.5倍Boost）= 13% APY
- **Convex自动复利**：8% + 5% CRV + 3% CVX = **16% APY**

**收益模型**（$30K本金）：
- **手动Curve**：$30K × 10% = **$3,000/年**
- **Convex自动**：$30K × 14% = **$4,200/年**
- **多赚**：$1,200/年（+40%）

**优势**：
- ✅ 自动最大Boost（无需锁CRV）
- ✅ 自动复利（每日收割）
- ✅ Gas费共摊（降低成本）
- ✅ 额外CVX奖励

**劣势**：
- ❌ 以太坊Gas费高（$50-$100操作成本）
- ❌ 提现可能延迟（1-3天）
- ❌ 多层智能合约风险
- ❌ 学习曲线中等

---

## 🗂 目录
1. [Curve复利原理](#curve复利原理)
2. [Convex Finance详解](#convex-finance详解)
3. [操作流程实战](#操作流程实战)
4. [Boost机制解析](#boost机制解析)
5. [收益来源拆解](#收益来源拆解)
6. [Gas费优化](#gas费优化)
7. [风险管理](#风险管理)
8. [替代方案对比](#替代方案对比)
9. [真实收益案例](#真实收益案例)
10. [常见问题FAQ](#常见问题faq)

---

## 🔄 Curve复利原理

### 手动Curve挖矿流程

**传统方式**（全手动）：
1. 存入Curve 3Pool（USDT/USDC/DAI）
2. 质押LP代币到Gauge
3. 每天产生CRV奖励
4. 每周手动收割CRV（Gas $15）
5. 卖出CRV换USDC（Gas $10）
6. 重新存入Curve（Gas $30）
7. **月成本**：$15×4 + $10×4 + $30×4 = $220

**痛点**：
- ❌ 频繁手动操作
- ❌ Gas费高昂
- ❌ 无法获得最大Boost（需锁定CRV）

---

### 自动复利优势

**Convex方式**（全自动）：
1. 存入Convex（一键）
2. Convex自动质押到Curve
3. Convex每日自动收割CRV
4. 自动卖出CRV并复投
5. 自动获得2.5倍Boost
6. 额外获得CVX代币奖励
7. **月成本**：$0（仅首次存入$50）

**优势**：
- ✅ 零手动操作
- ✅ Gas费共摊（所有用户分担）
- ✅ 自动最大Boost
- ✅ 额外CVX收益

---

## 🔺 Convex Finance详解

### 什么是Convex

**定义**：Curve收益优化器，自动复利和Boost最大化

**核心功能**：
1. **代理Boost**：Convex锁定大量CRV，所有用户共享2.5倍Boost
2. **自动复利**：每日收割CRV并复投
3. **CVX奖励**：额外分发CVX代币（约3% APY）
4. **Gas共摊**：批量操作降低人均Gas

---

### Convex vs 直接Curve

| 对比项 | 直接Curve | Curve+锁veCRV | Convex |
|--------|-----------|---------------|--------|
| **需要锁CRV** | 否 | 是（4年） | 否 |
| **Boost倍数** | 1倍 | 2.5倍 | 2.5倍 |
| **手动收割** | 是 | 是 | 否 |
| **额外奖励** | 无 | 无 | CVX代币 |
| **Gas成本** | 高 | 高 | 低（共摊） |
| **APY** | 10% | 13% | 16% |

**结论**：Convex = Curve最大Boost + 自动复利 + CVX奖励

---

### Convex收益来源

**三重收益**：
1. **Curve手续费**：2-3% APY（交易手续费分成）
2. **CRV奖励**（Boost 2.5倍）：5-8% APY
3. **CVX奖励**：3-5% APY

**总APY**：10-16%

---

## 💸 操作流程实战

### Step 1：准备资金

**以太坊主网**：
- 准备USDC/USDT/DAI任一稳定币
- 准备ETH作为Gas（约$100）
- 最低$5K建议（覆盖Gas成本）

---

### Step 2：连接Convex

1. 访问 https://www.convexfinance.com/
2. 点击"Connect Wallet"
3. 选择MetaMask
4. 确认连接

---

### Step 3：选择池子

**热门稳定币池**：

| 池子名称 | 底层Curve池 | CVX APY | 总APY | TVL |
|----------|-------------|---------|-------|-----|
| **3pool** | DAI/USDC/USDT | 4% | 14% | $1.2B |
| **FRAXUSDC** | FRAX/USDC | 5% | 16% | $400M |
| **TUSD3CRV** | TUSD/3CRV | 6% | 18% | $200M |

**推荐**：3pool（最稳定，流动性最好）

---

### Step 4：存入Convex

**方式A：直接存入稳定币**
1. 在Convex找到"3pool"
2. 点击"Deposit"
3. 选择USDC（或USDT/DAI）
4. 输入金额（如$10,000）
5. 点击"Approve"（Gas $20）
6. 点击"Deposit and Stake"（Gas $35）

**完成后**：
- 收到cvx3Crv代币（凭证）
- 自动质押到Convex
- 开始赚取CRV+CVX奖励

---

**方式B：已有Curve LP**
如果已在Curve有LP代币：
1. 在Convex点击"Deposit"
2. 选择"Deposit Curve LP Token"
3. 确认交易（Gas $30）

---

### Step 5：查看收益

**Convex仪表盘**：
- Staked：$10,000
- Current APY：14%
- Claimable CRV：每日增长
- Claimable CVX：每日增长

**收益累积**：
- CRV/CVX每日产生
- 可选择"Claim"领取（Gas $20）
- 或"Claim and Restake"复投（Gas $30）

---

### Step 6：提现

1. 在Convex Dashboard点击"Withdraw"
2. 输入金额或点击Max
3. 选择"Withdraw and Unwrap"（直接拿USDC）
4. 确认交易（Gas $40）
5. 收到稳定币本金+收益

---

## 🚀 Boost机制解析

### 什么是Boost

**定义**：Curve的CRV奖励加速机制

**Boost倍数**：
- 无锁仓：1倍（基础CRV奖励）
- 锁仓CRV：最高2.5倍

**示例**：
- 基础CRV APY：2%
- 无Boost：2% × 1 = 2%
- 最大Boost：2% × 2.5 = **5%**

**提升**：+150%收益

---

### Convex如何实现Boost

**机制**：
1. Convex锁定大量CRV（数亿美元）
2. 获得巨大veCRV余额
3. 所有Convex用户共享这个Boost
4. 每个用户自动获得2.5倍Boost

**用户视角**：
- 无需自己锁CRV
- 无需4年锁定期
- 自动享受最大Boost

---

### Boost计算公式

**Curve官方公式**（复杂）：
用户Boost = min(用户LP, 用户LP × 0.4 + 总LP × 用户veCRV/总veCRV × 0.6)

**简化理解**：
- 持有veCRV越多，Boost越高
- Convex持有大量veCRV，分享给所有用户

---

## 💰 收益来源拆解

### 收益构成（3pool示例）

**总APY：14%**

#### 1. Curve手续费（2.5% APY）
- 用户swap USDT↔USDC时支付0.04%手续费
- 分配给LP提供者
- 自动复投到LP

#### 2. CRV奖励（7% APY）
- Curve协议每日释放CRV
- 3pool获得高权重分配
- Convex自动收割+复投

#### 3. CVX奖励（4.5% APY）
- Convex协议额外奖励
- 每收割1 CRV，获得约0.1 CVX
- CVX当前价格$3

---

### 收益发放方式

**自动复利部分**：
- Curve手续费：自动复投（体现在LP价值增长）

**待领取部分**：
- CRV奖励：每日累积，可选择"Claim"
- CVX奖励：每日累积，可选择"Claim"

**策略选择**：
- **定期领取**：每月领取卖出（锁定收益）
- **长期持有**：持有CVX等待增值
- **复投**：Claim and Restake（Gas $30）

---

## ⛽ Gas费优化

### Gas成本分析

**手动Curve挖矿**（月成本）：
- 收割CRV：$15 × 4周 = $60
- 卖出CRV：$10 × 4周 = $40
- 复投：$30 × 4周 = $120
- **总计**：$220/月

**Convex自动复利**（月成本）：
- 自动收割：$0（Convex Bot操作，所有用户分摊）
- 人均分摊：约$2/月
- 领取奖励（可选）：$20/月

**节省**：$220 - $2 = **$218/月**

---

### 小资金是否值得

**$5K本金（以太坊）**：
- 初始存入Gas：$55
- 年收益：$5K × 14% = $700
- Gas占比：$55/$700 = 7.8%
- **勉强值得**

**$10K本金**：
- 初始存入Gas：$55
- 年收益：$10K × 14% = $1,400
- Gas占比：$55/$1,400 = 3.9%
- **值得**

**$20K+本金**：
- Gas占比<2%
- **非常值得**

**建议**：
- <$5K → 用Polygon的Beefy（Gas低）
- $5K-$20K → 可以用Convex
- >$20K → 强烈推荐Convex

---

## ⚠️ 风险管理

### 主要风险

#### 1. 智能合约风险

**多层风险**：
- Convex合约
- Curve合约
- 稳定币合约（USDT/USDC/DAI）

**历史记录**：
- Convex：运营3年无重大事故
- Curve：运营5年，2023年7月Vyper漏洞（3pool未受影响）

**安全评分**：
- Convex：8.5/10
- Curve：9/10

---

#### 2. 稳定币脱锚风险

**风险**：
- USDC短暂脱锚至$0.88（2023年3月SVB危机）
- 3pool自动再平衡（买入便宜USDC）

**结果**：
- USDC恢复后LP反而获利
- 无常损失：-1%（负数=盈利）

**结论**：稳定币池脱锚风险极低，且可能带来套利机会

---

#### 3. CVX价格波动

**风险**：
- CVX价格从$60（2021峰值）降至$3（2025）
- 持有CVX面临贬值风险

**策略**：
- **定期卖出**：每月领取并卖出CVX（锁定收益）
- **持有博反弹**：看好Curve生态长期发展
- **混合**：50%卖出，50%持有

---

## 🔄 替代方案对比

### Stake DAO

**特点**：
- 与Convex类似机制
- 提供sdCRV代币（锁仓CRV凭证）
- APY略高于Convex（+1-2%）

**劣势**：
- TVL较小（$200M vs Convex $2B）
- 流动性较差

---

### Concentrator

**特点**：
- 专注于自动复利CRV
- 策略更激进（杠杆）
- APY可达20%+

**劣势**：
- 风险更高（使用杠杆）
- 不适合保守型

---

### Yearn on Curve

**特点**：
- Yearn的Curve策略Vault
- 自动复利+策略优化
- APY 10-14%

**对比Convex**：
- Yearn绩效费20% vs Convex 17%
- Yearn更通用，Convex专注Curve

---

## 💰 真实收益案例

### 案例1：中资金（$20K，Convex 3pool）

**配置**：
- Convex 3pool
- 本金：$20,000
- APY：14%

**年度收益**：
- Curve手续费：$20K × 2.5% = $500
- CRV奖励：$20K × 7% = $1,400
- CVX奖励：$20K × 4.5% = $900
- **总收益**：$2,800

**成本**：
- 存入Gas：$55
- 提现Gas：$40
- 每月领取CVX（可选）：$20 × 12 = $240
- 总成本：$335

**净收益**：$2,800 - $335 = **$2,465**

---

### 案例2：大资金（$100K，Convex FRAX）

**配置**：
- Convex FRAX/USDC池
- 本金：$100,000
- APY：16%

**年度收益**：
- 总收益：$100K × 16% = $16,000
- Gas成本：$100
- **净收益**：$15,900

**对比手动Curve**（10% APY）：
- 手动收益：$10,000
- 多赚：$15,900 - $10,000 = **$5,900（+59%）**

---

### 案例3：对比CEX定期

**$30K本金，1年期**：

| 策略 | APY | 年收益 | 流动性 | 风险 |
|------|-----|--------|--------|------|
| **Binance定期90天** | 10% | $3,000 | 锁定90天 | 平台风险 |
| **Convex 3pool** | 14% | $4,200 | 随时提现 | 合约风险 |

**结论**：Convex收益高40%且流动性更好

---

## ❓ 常见问题FAQ

**Q1：Convex比直接Curve好多少？**
> **APY高40%+**。直接Curve约10% APY（无Boost+手动），Convex约14% APY（最大Boost+自动复利+CVX奖励）。且Convex零手动操作，节省大量时间和Gas。

**Q2：CVX代币要卖还是持有？**
> **看风险偏好**。保守：每月领取并卖出（锁定14% APY）。激进：持有CVX博反弹（CVX从$60跌至$3，可能反弹）。平衡：50%卖出50%持有。

**Q3：提现需要多久？**
> **立即到账**（取决于网络确认时间10分钟）。Convex无锁定期，随时可提现。但建议持有>3个月分摊Gas成本。

**Q4：小资金（<$5K）值得吗？**
> **Gas占比高，不太值**。$5K本金Gas占8%。建议：<$5K用Polygon的Beefy，>$10K用Convex。

**Q5：Convex安全吗？**
> **较安全**。运营3年无重大事故，TVL $2B+，审计完善。风险：智能合约漏洞、Curve底层风险。建议：单协议<40%资金。

---

## ✅ 执行清单

### 新手入门（第1周）
- [ ] 学习Curve+Convex机制（阅读官方文档）
- [ ] 准备$1K测试资金+$100 ETH Gas
- [ ] 小额存入Convex 3pool
- [ ] 观察7天收益累积
- [ ] 测试领取CRV/CVX

### 规模化部署（第2周）
- [ ] 增加至$10K-$50K本金
- [ ] 对比3pool/FRAX/TUSD池APY
- [ ] 决定CVX处理策略（卖出vs持有）
- [ ] 设置月度领取提醒
- [ ] 记录初始APY和cvx3Crv余额

### 长期管理（持续）
- [ ] 每月领取CRV/CVX（或每季度）
- [ ] 监控APY变化（<10%考虑退出）
- [ ] 关注Curve Wars动态（影响APY）
- [ ] 每季度审查：Convex vs 其他聚合器
- [ ] 牛市到来时考虑提现部分投资其他机会

---

## 🔚 结语

自动复利稳定池是**Curve挖矿的最优解**：
- ✅ 优势：自动最大Boost、全自动复利、Gas共摊、额外CVX收益
- ⚠️ 挑战：以太坊Gas费高、多层合约风险、CVX价格波动

**三个核心原则**：
1. **资金门槛**：>$10K用Convex（Gas占比合理），<$5K用L2方案
2. **池子选择**：3pool最稳（TVL $1.2B），FRAX更高收益（APY +2%）
3. **CVX管理**：保守每月卖出，激进长期持有，平衡各半

自动复利稳定池是**DeFi稳定收益的王者**！🔺💰
`,

  steps: [
    { step_number: 1, title: 'Curve和Convex机制学习', description: '理解Curve Gauge质押和CRV奖励机制，学习veCRV锁仓和Boost原理（1倍vs2.5倍），理解Convex如何代理Boost（所有用户共享最大Boost），观看Convex官方教程视频（YouTube 20分钟），计算手动vs自动复利收益差异（14% vs 10% APY）。', estimated_time: '4–6 小时' },
    { step_number: 2, title: 'Gas费评估与资金准备', description: '评估初始Gas成本（存入$55 + 提现$40 = $95），计算Gas占比（$5K本金占8%，$20K占0.5%），准备以太坊主网ETH作为Gas（约$100），从CEX或L2桥接USDC到以太坊主网，小额测试$1K验证流程（体验存入和查看收益）。', estimated_time: '1–2 小时' },
    { step_number: 3, title: 'Convex存入与质押', description: '访问Convex Finance连接MetaMask，选择3pool（最稳定TVL $1.2B）或FRAX池（更高APY），存入$10K-$50K USDC（Approve $20 + Deposit $35），收到cvx3Crv代币（凭证），确认自动质押状态，查看Claimable CRV/CVX每日增长。', estimated_time: '30 分钟' },
    { step_number: 4, title: 'CVX代币管理策略', description: '决定CVX处理方式（每月卖出 vs 长期持有 vs 50/50混合），设置每月领取提醒（Claim CRV+CVX，Gas $20），测试卖出CVX流程（Curve/Uniswap），计算卖出vs持有的收益差异，记录CVX价格和持有量（税务申报用）。', estimated_time: '1–2 小时' },
    { step_number: 5, title: '长期监控与优化', description: '每月检查Convex APY变化（APY<10%考虑退出），对比其他聚合器（Stake DAO/Yearn），关注Curve Wars和veCRV投票（影响池子权重），每季度提现10-20%收益到冷钱包（降低累积风险），牛市时考虑部分资金转向高风险高收益策略。', estimated_time: '每月30分钟' },
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

    console.log('\n✅ 自动复利稳定池创建成功!');
    console.log(`   ID: ${response.data.data.id}`);
    console.log(`   Slug: ${response.data.data.slug}`);
    console.log(`   访问: http://localhost:3000/strategies/${response.data.data.slug}\n`);
  } catch (error) {
    console.error('\n❌ 创建失败:', error.response?.data || error.message);
  }
}

addGuide();