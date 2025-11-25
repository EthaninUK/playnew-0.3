const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

const GUIDE_CONFIG = {
  title: '跨链收益聚合器策略',
  slug: 'cross-chain-yield-aggregator',
  summary:
    '跨链收益聚合器策略实战：Beefy Finance/Yearn/Reaper多链部署（8-20% APY）、自动复利机制、Gas费分摊优化、收益策略自动切换、Polygon/Arbitrum/Optimism低成本方案、跨链桥接安全、IL保护策略、多池分散投资、Vault代币质押、APY监控工具、$20K本金年赚$2,800案例。',

  category: 'stablecoin-yield',
  category_l1: 'yield',
  category_l2: '稳定币理财',

  difficulty_level: 2,
  risk_level: 3,
  apy_min: 8,
  apy_max: 20,

  threshold_capital: '3,000–100,000 USD（小资金优选L2低Gas方案）',
  threshold_capital_min: 3000,
  time_commitment: '初始学习5小时，部署设置2小时，每周监控APY变化30分钟',
  time_commitment_minutes: 30,
  threshold_tech_level: 'intermediate',

  content: `> **适用人群**：持有稳定币、希望自动化收益管理、能接受多链操作、追求高于单一协议收益（8-20% APY）的中级玩家

> **阅读时间**：≈ 20–25 分钟

> **关键词**：Yield Aggregator / Auto-compound / Beefy Finance / Yearn / Multi-chain / Gas Optimization / Vault Strategy / IL Protection

---

## 🧭 TL;DR

**核心策略**：使用收益聚合器（如Beefy Finance）自动优化收益，实现自动复利和策略切换。

**什么是收益聚合器**：
- 自动监控多个DeFi协议APY
- 自动切换到最高收益策略
- 自动复利（收割奖励再投资）
- 批量操作降低Gas成本

**收益对比**：
- **直接Aave**：5% APY（手动复利）
- **直接Curve**：8% APY + 手动收割CRV
- **Beefy Aave Vault**：6.5% APY（自动复利）
- **Beefy Curve Vault**：12% APY（自动收割+复利）

**收益模型**（$20K本金）：
- **Beefy稳定币策略**：8-12% APY = **$1,600-$2,400/年**
- **Yearn稳定币Vault**：10-15% APY = **$2,000-$3,000/年**
- **Reaper高收益池**：15-20% APY = **$3,000-$4,000/年**（高风险）

**优势**：
- ✅ 全自动（无需手动操作）
- ✅ Gas费优化（批量操作分摊成本）
- ✅ 策略优化（自动切换最高APY）
- ✅ 复利威力（每日自动复投）

**劣势**：
- ❌ 绩效费（通常4-5%收益抽成）
- ❌ 多层风险（聚合器+底层协议）
- ❌ 提现延迟（部分策略需要时间）
- ❌ 学习曲线（需理解Vault机制）

---

## 🗂 目录
1. [收益聚合器原理](#收益聚合器原理)
2. [主流聚合器对比](#主流聚合器对比)
3. [Beefy Finance实战](#beefy-finance实战)
4. [多链部署策略](#多链部署策略)
5. [自动复利机制](#自动复利机制)
6. [Gas费优化](#gas费优化)
7. [风险管理](#风险管理)
8. [APY监控工具](#apy监控工具)
9. [真实收益案例](#真实收益案例)
10. [常见问题FAQ](#常见问题faq)

---

## 🤖 收益聚合器原理

### 工作机制

**传统手动方式**：
1. 存入Curve 3Pool赚取交易手续费
2. 每天产生CRV奖励
3. 每周手动收割CRV（Gas费$15）
4. 卖出CRV换成USDC
5. 重新存入Curve
6. 月Gas费：$15 × 4 = $60

**收益聚合器方式**：
1. 存入Beefy Curve Vault
2. Beefy自动每天收割CRV
3. 自动卖出CRV并复投
4. 批量操作分摊Gas（你分担$0.5）
5. 月Gas费：$0.5 × 4 = $2

**节省**：$60 - $2 = $58/月

---

### 收益提升原理

#### 1. 自动复利

**手动（月复利）**：
- 本金$10K，APY 8%
- 每月收割：$10K × 8% ÷ 12 = $66.67
- 1年后：$10,830

**自动（日复利）**：
- 本金$10K，APY 8%
- 每日自动复投
- 1年后：$10,833

**多赚**：$3（0.03%提升）

---

#### 2. 策略优化

**Yearn示例**：
- 监控Aave/Compound/Morpho三个协议
- Aave当前APY 5%
- Compound当前APY 7%
- 自动迁移资金到Compound
- 用户获得7%而非5%（+40%收益）

---

## 📊 主流聚合器对比

### 平台概览

| 聚合器 | TVL | 支持网络 | 绩效费 | 自动复利 | 安全评分 |
|--------|-----|----------|--------|----------|----------|
| **Beefy Finance** | $400M | 20+链 | 4.5% | 是 | ⭐⭐⭐⭐ |
| **Yearn Finance** | $300M | 以太坊/L2 | 20% | 是 | ⭐⭐⭐⭐⭐ |
| **Reaper Farm** | $50M | Optimism/Fantom | 4.5% | 是 | ⭐⭐⭐ |
| **Convex** | $2B | 以太坊 | 17% | 是 | ⭐⭐⭐⭐⭐ |

---

### 选择策略

#### 小资金（<$10K）→ Beefy on Polygon
- Gas费极低（$0.1/笔）
- 最低$50起
- APY 8-15%

#### 中等资金（$10K-$50K）→ Yearn on Arbitrum
- 安全性最高
- 策略最优化
- APY 10-15%

#### 大资金（>$50K）→ Convex on Ethereum
- TVL最高（流动性最好）
- 专注Curve优化
- APY 8-12%

---

## 🐝 Beefy Finance实战

### 什么是Beefy

**定义**：多链收益聚合器，自动复利和优化策略

**特点**：
- 支持20+区块链（Polygon/Arbitrum/BSC等）
- 400+ Vault策略
- 4.5%绩效费（业内最低）
- 自动每日复利

---

### 热门稳定币Vault

#### Polygon网络

| Vault名称 | 底层协议 | APY | 风险 |
|-----------|----------|-----|------|
| **Aave USDC** | Aave V3 | 8% | 低 |
| **Curve am3CRV** | Curve 3Pool | 12% | 低 |
| **Balancer 4Pool** | Balancer | 10% | 中 |

#### Arbitrum网络

| Vault名称 | 底层协议 | APY | 风险 |
|-----------|----------|-----|------|
| **Aave USDC** | Aave V3 | 7% | 低 |
| **Curve 2CRV** | Curve | 10% | 低 |
| **Radiant USDT** | Radiant | 15% | 中 |

---

### 操作流程

#### Step 1：准备资金

**选项A：直接从CEX提现**
- Binance提现USDC到Polygon
- 手续费$1
- 到账时间5-10分钟

**选项B：跨链桥接**
- 使用Stargate桥接USDC
- 从以太坊 → Polygon
- 手续费$10-$20

---

#### Step 2：连接Beefy

1. 访问 https://app.beefy.finance/
2. 切换到Polygon网络
3. 连接MetaMask钱包
4. 浏览"Stablecoins"分类

---

#### Step 3：存入Vault

1. 选择"Curve am3CRV Vault"
2. 点击"Deposit"
3. 输入金额（如$5,000 USDC）
4. 点击"Approve"授权（Gas $0.2）
5. 点击"Deposit"确认（Gas $0.3）
6. 收到Vault代币（如mooAm3CRV）

---

#### Step 4：查看收益

**Beefy仪表盘**：
- Deposited：$5,000
- Current APY：12%
- Daily Earnings：$1.64
- Vault Balance：每日自动增长

**收益累积方式**：
- Vault代币价值每日上涨
- 例如：mooAm3CRV从$1.00涨至$1.0003
- 提现时按当前Vault代币价格赎回

---

#### Step 5：提现

1. 在Vault页面点击"Withdraw"
2. 输入金额或点击Max
3. 确认交易（Gas $0.3）
4. Vault代币销毁
5. 收到底层资产（USDC）

---

## 🌐 多链部署策略

### 为什么要多链

**原因**：
1. **Gas费差异**：Polygon $0.5 vs 以太坊$50
2. **APY差异**：同一策略不同链APY不同
3. **风险分散**：避免单链风险

---

### 多链配置方案

#### 方案A：成本优先（小资金）

总资金$10K：
- **Polygon**：$6K（60%）- Beefy Curve Vault（12% APY）
- **Arbitrum**：$4K（40%）- Beefy Aave Vault（7% APY）

**收益**：
- Polygon：$6K × 12% = $720
- Arbitrum：$4K × 7% = $280
- 总收益：$1,000/年（10% APY）

**Gas成本**：
- Polygon：$1
- Arbitrum：$3
- 总成本：$4

---

#### 方案B：收益优先（中资金）

总资金$30K：
- **以太坊**：$15K - Yearn USDC Vault（10% APY）
- **Arbitrum**：$10K - Radiant USDT（15% APY）
- **Polygon**：$5K - Beefy Curve（12% APY）

**收益**：
- 以太坊：$15K × 10% = $1,500
- Arbitrum：$10K × 15% = $1,500
- Polygon：$5K × 12% = $600
- 总收益：$3,600/年（12% APY）

**Gas成本**：
- 以太坊：$60
- Arbitrum：$5
- Polygon：$1
- 总成本：$66

---

### 跨链桥接选择

| 桥接工具 | 安全性 | 手续费 | 速度 | 推荐度 |
|----------|--------|--------|------|--------|
| **Stargate** | ⭐⭐⭐⭐⭐ | 0.05% | 5分钟 | 最推荐 |
| **Hop Protocol** | ⭐⭐⭐⭐ | 0.1% | 10分钟 | 推荐 |
| **Multichain** | ⭐⭐⭐ | 0.1% | 15分钟 | 一般 |
| **CEX中转** | ⭐⭐⭐⭐ | $1固定 | 30分钟 | 安全 |

**最佳实践**：大额用Stargate，小额用CEX中转（Binance提现到目标链）

---

## 🔄 自动复利机制

### Beefy复利流程

**每日自动执行**：
1. 收割底层协议奖励（CRV/AAVE/COMP等）
2. 卖出奖励代币换成本金资产
3. 重新存入底层协议
4. Vault代币价值上涨

**用户视角**：
- 无需任何操作
- Vault代币数量不变
- Vault代币价值每日上涨

---

### 复利频率对比

| 聚合器 | 复利频率 | 复利触发 | Gas分摊 |
|--------|----------|----------|---------|
| **Beefy** | 每日1-3次 | Bot自动 | 所有用户 |
| **Yearn** | 每周1次 | Keeper | 所有用户 |
| **手动** | 月复利 | 你手动 | 你独自承担 |

**收益差异**（$10K本金，10% APY，1年）：
- 手动月复利：$10,471
- Yearn周复利：$10,506
- Beefy日复利：$10,516

**差异**：$45（+0.4%）

---

## ⛽ Gas费优化

### Gas成本对比

**手动Curve挖矿**（以太坊）：
- 存入Curve：$30
- 质押LP：$25
- 每周收割CRV：$15 × 4 = $60/月
- 每月复投：$30
- 提现：$30
- **月成本**：$90

**Beefy Curve Vault**（以太坊）：
- 存入Vault：$35
- 自动复利：$0（分摊）
- 提现：$30
- **月成本**：$0（仅首次$35）

**节省**：$90/月

---

### L2 Gas优势

**以太坊 vs Polygon**：
- 以太坊Vault存取：$65
- Polygon Vault存取：$0.5

**差距**：130倍！

**小资金必选L2**：
- $3K资金在以太坊：Gas占2%（$65/$3K）
- $3K资金在Polygon：Gas占0.02%（$0.5/$3K）

---

## ⚠️ 风险管理

### 主要风险

#### 1. 智能合约风险

**多层风险**：
- Beefy合约风险
- 底层协议风险（Aave/Curve）
- 策略合约风险

**防范**：
- 优先选择审计完善的聚合器（Yearn/Beefy）
- 单个Vault<30%资金
- 避免新上线的实验性策略

---

#### 2. 无常损失（LP Vault）

**风险池**：
- Curve 3Pool：无常损失极低（稳定币）
- Balancer USDC/USDT/DAI：无常损失低
- Uniswap USDC/ETH：无常损失高（避免！）

**策略**：仅选择稳定币池，避免波动资产

---

#### 3. 提现延迟

**部分策略**：
- 资金部署在定期协议（如RWA）
- 提现需要1-7天
- Beefy会标注"Withdrawal Notice"

**防范**：
- 查看Vault详情
- 优先选择"Instant Withdrawal"
- 预留20%活期资金应急

---

#### 4. 绩效费

**费用结构**：
- Beefy：4.5%绩效费（从收益中扣除）
- Yearn：20%绩效费
- Convex：17%绩效费

**计算**：
- 显示APY 12%已扣除绩效费
- 实际底层APY约12.6%
- Beefy抽取0.6%

---

## 📊 APY监控工具

### DeFi Llama

**功能**：
- 对比所有聚合器APY
- 历史APY曲线
- TVL变化

**使用**：
1. 访问 https://defillama.com/yields
2. 筛选"Stablecoins"
3. 筛选"Polygon"网络
4. 按APY排序

---

### Beefy Dashboard

**功能**：
- 实时APY监控
- 个人收益追踪
- Gas费记录

**查看**：
- 连接钱包后自动显示
- Portfolio页面查看总资产
- Vault详情页查看APY历史

---

### Zapper / DeBank

**功能**：
- 多链资产聚合查看
- 自动计算总收益
- 支持Beefy/Yearn等

**推荐**：DeBank（https://debank.com）
- 输入地址查看所有DeFi持仓
- 自动识别Beefy Vault
- 显示总APY和收益

---

## 💰 真实收益案例

### 案例1：小资金（$5K，Polygon）

**配置**：
- Beefy Curve am3CRV Vault（Polygon）
- 本金：$5,000
- APY：12%

**年度收益**：
- 利息：$5K × 12% = $600
- Beefy绩效费：已包含在12% APY中
- Gas成本：存入$0.3 + 提现$0.3 = $0.6
- **净收益**：$600 - $0.6 = $599.4

**对比手动Curve**：
- 手动APY：8%（无复利）
- 手动收益：$5K × 8% = $400
- 多赚：$599 - $400 = **$199（+50%）**

---

### 案例2：中资金（$30K，多链）

**配置**：
- Polygon Beefy Curve：$15K × 12% = $1,800
- Arbitrum Beefy Aave：$10K × 7% = $700
- Optimism Reaper USDC：$5K × 15% = $750

**年度收益**：
- 总收益：$3,250
- 综合APY：10.83%
- Gas成本：$10
- **净收益**：$3,240

---

### 案例3：大资金（$100K，Yearn）

**配置**：
- Yearn USDC Vault（以太坊）
- 本金：$100K
- APY：10%（扣除20%绩效费后）

**年度收益**：
- 利息：$100K × 10% = $10,000
- Gas成本：存入$50 + 提现$50 = $100
- **净收益**：$9,900

**对比直接Aave**（6% APY）：
- Aave收益：$6,000
- 多赚：$9,900 - $6,000 = **$3,900（+65%）**

---

## ❓ 常见问题FAQ

**Q1：聚合器比直接存Aave好吗？**
> **通常是的**。聚合器自动复利+策略优化，APY高2-5%。但需承担额外智能合约风险和绩效费。建议：大资金（>$20K）用聚合器，小资金看Gas成本。

**Q2：Beefy和Yearn哪个更好？**
> **看链和资金量**。Yearn：安全性最高，APY优化最好，但仅以太坊+L2，绩效费20%。Beefy：支持20+链，绩效费4.5%，适合小资金。建议：>$50K用Yearn，<$20K用Beefy。

**Q3：Vault代币可以提前卖出吗？**
> **可以但不推荐**。Vault代币（如mooAm3CRV）可在DEX卖出，但流动性低，滑点5-10%。建议：持有至提现需要时，在Beefy官方赎回。

**Q4：APY为什么会变化？**
> **底层协议APY变化**。例如Curve 3Pool APY从8%降至5%，Beefy Vault APY也会从10%降至7%。建议：每周检查APY，<5%时考虑切换策略。

**Q5：多链部署麻烦吗？**
> **初次麻烦，后续简单**。需要：①准备各链Gas代币（MATIC/ETH）②跨链桥接资金③各链分别操作。建议：新手先单链（Polygon），熟悉后再多链。

---

## ✅ 执行清单

### 新手入门（第1周）
- [ ] 学习聚合器概念（观看Beefy教程视频）
- [ ] 准备$1K USDC到Polygon测试
- [ ] 连接Beefy选择Curve Vault
- [ ] 小额存入观察自动复利
- [ ] 7天后提现验证收益

### 规模化部署（第2-3周）
- [ ] 增加至$5K-$20K本金
- [ ] 对比Beefy/Yearn/Reaper APY
- [ ] 选择2-3个Vault分散风险
- [ ] 设置APY监控（DeFi Llama）
- [ ] 记录初始Vault代币价格

### 多链扩展（持续）
- [ ] 学习跨链桥接（Stargate）
- [ ] 部署到Arbitrum/Optimism
- [ ] 每周检查APY变化
- [ ] APY下降>3%时切换Vault
- [ ] 每月审查组合表现

---

## 🔚 结语

跨链收益聚合器是**自动化收益优化的最佳工具**：
- ✅ 优势：全自动复利、策略优化、Gas节省、多链部署
- ⚠️ 风险：多层智能合约、绩效费、提现延迟

**三个核心原则**：
1. **链选择**：小资金（<$10K）Polygon，大资金（>$50K）以太坊/Yearn
2. **Vault选择**：优先稳定币池（避免无常损失），单Vault<30%资金
3. **持续监控**：每周检查APY，<5%及时切换

跨链聚合器是**懒人收益优化神器**！🤖💰
`,

  steps: [
    { step_number: 1, title: '聚合器概念学习', description: '理解收益聚合器工作原理（自动复利+策略优化），对比Beefy/Yearn/Convex特点和绩效费（4.5% vs 20%），学习Vault代币机制（价值增长而非数量增长），观看Beefy官方教程视频（YouTube 15分钟），理解多层风险（聚合器+底层协议）。', estimated_time: '3–5 小时' },
    { step_number: 2, title: '多链准备与资金桥接', description: '准备目标链Gas代币（Polygon需MATIC，Arbitrum需ETH），从Binance提现USDC到Polygon（手续费$1，最简单），或使用Stargate跨链桥接（从以太坊到Polygon，手续费0.05%），添加MetaMask网络（Polygon/Arbitrum/Optimism），测试小额转账验证到账。', estimated_time: '1–2 小时' },
    { step_number: 3, title: '首次Vault存入', description: '访问Beefy Finance选择Polygon网络，浏览Stablecoins分类选择Curve am3CRV Vault（APY 12%左右），小额测试$500-$1K存入（Approve $0.2 + Deposit $0.3），收到Vault代币（如mooAm3CRV），观察7天Vault代币价值增长（每日约+0.03%），理解自动复利机制。', estimated_time: '1 小时' },
    { step_number: 4, title: '规模化与多Vault配置', description: '确认策略可行后增加至$5K-$30K本金，分散至2-3个Vault（Curve 50% + Aave 30% + Balancer 20%），对比各Vault的APY/风险/流动性，使用DeBank监控总资产和收益（https://debank.com），设置DeFi Llama APY监控（APY下降>3%时告警）。', estimated_time: '2–3 小时' },
    { step_number: 5, title: '长期优化与再平衡', description: '每周检查各Vault APY变化（DeFi Llama Yields页面），APY持续<5%时考虑切换到其他Vault，每月提现10-20%收益到冷钱包（降低累积风险），尝试多链部署（Arbitrum/Optimism收益更高），关注聚合器治理提案（可能影响绩效费）。', estimated_time: '每周30分钟' },
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

    console.log('\n✅ 跨链收益聚合器策略创建成功!');
    console.log(`   ID: ${response.data.data.id}`);
    console.log(`   Slug: ${response.data.data.slug}`);
    console.log(`   访问: http://localhost:3000/strategies/${response.data.data.slug}\n`);
  } catch (error) {
    console.error('\n❌ 创建失败:', error.response?.data || error.message);
  }
}

addGuide();