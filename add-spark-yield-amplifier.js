const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

const GUIDE_CONFIG = {
  title: 'Spark 借贷收益放大',
  slug: 'spark-yield-amplifier',
  summary:
    'Spark Protocol（MakerDAO子协议）借贷收益策略：DAI Savings Rate (DSR)套利、sDAI高息存款、E-Mode超高抵押率（98%）、SparkLend循环借贷、Aave V3底层技术、无代币奖励纯利息收益、DAI稳定币生态整合、多链部署（以太坊/Gnosis）、历史APY 5-15%、成本$1K起。',

  category: 'lending',
  category_l1: 'yield',
  category_l2: '借贷挖息',

  difficulty_level: 3,
  risk_level: 2,
  apy_min: 5,
  apy_max: 15,

  threshold_capital: '1,000–100,000 USD（推荐$5K+获取最佳效率）',
  threshold_capital_min: 1000,
  time_commitment: '初始设置2–3小时，每月检查DSR利率1次，无需频繁操作',
  time_commitment_minutes: 15,
  threshold_tech_level: 'intermediate',

  content: `> **适用人群**：DAI稳定币持有者、MakerDAO生态用户、追求稳定收益、理解DSR机制的DeFi投资者
> **阅读时间**：≈ 35–50 分钟
> **关键词**：Spark Protocol / SparkLend / DAI Savings Rate / sDAI / E-Mode / MakerDAO / Aave V3 / Yield Amplification / Stablecoin Lending

---

## 📊 TL;DR（60秒速览）

**核心思路**：利用Spark的E-Mode高抵押率，循环借贷放大DAI Savings Rate收益

| 策略 | 年化收益 | 杠杆倍数 | 风险等级 |
|------|---------|---------|---------|
| **单纯sDAI存款** | 5–8% | 1x | ⭐ 极低 |
| **SparkLend循环（3次）** | 8–12% | 3x | ⭐⭐ 低 |
| **E-Mode最大化（10次）** | 12–15% | 10x | ⭐⭐⭐ 中 |

**Spark vs Aave/Compound对比**：

| 特性 | Spark | Aave V3 | Compound V3 |
|------|-------|---------|-------------|
| **E-Mode LTV** | 98%（最高） | 97% | 无 |
| **代币奖励** | ❌ 无 | ✅ 有 | ✅ 有 |
| **核心资产** | DAI生态 | 多资产 | 多资产 |
| **DSR集成** | ✅ 原生 | ❌ | ❌ |
| **清算罚金** | 1%（最低） | 5–10% | 8% |

**Spark独特优势**：
1. **DSR直接集成**：存DAI自动获取DSR利率（目前5–8%）
2. **98% E-Mode**：DAI↔USDC/USDT可达98%抵押率（行业最高）
3. **低清算罚金**：仅1%（Aave/Compound为5–10%）
4. **MakerDAO背书**：协议安全性高

---

## 🏗️ Spark Protocol核心机制

### 什么是Spark？

**Spark Protocol**是MakerDAO推出的借贷协议：
- **底层技术**：基于Aave V3代码（经审计）
- **定位**：服务DAI生态，提供最优DAI收益
- **治理**：MakerDAO治理控制

**关键组件**：
\`\`\`
SparkLend：借贷协议（类似Aave）
sDAI：DAI Savings（自动累积DSR利息）
E-Mode：超高效模式（98% LTV）
\`\`\`

---

### DAI Savings Rate (DSR)

**DSR**是MakerDAO协议的核心机制：

\`\`\`
DSR运作：
1. MakerDAO收取借款利息（如3%）
2. 通过治理投票分配给DSR（如5%）
3. 所有存入DSR的DAI自动获得5%利率

DSR历史利率：
├─ 2019-11：8.75%（历史最高）
├─ 2020-03：0%（疫情期间）
├─ 2023-08：5%（加息周期）
└─ 2024-01：5–8%（当前）

Spark优势：
• 自动将存款DAI接入DSR
• 无需手动操作
• 无锁定期
\`\`\`

---

### sDAI代币机制

**sDAI**是DSR的代币化版本：

\`\`\`
存入1000 DAI → 获得 ~950 sDAI
（汇率：1 sDAI = 1.05 DAI）

1年后（假设DSR = 5%）：
• sDAI数量不变：950
• 汇率上升：1 sDAI = 1.1025 DAI
• 赎回：950 × 1.1025 = 1,047 DAI
• 收益：$47（4.7%）

sDAI特点：
• 自动复利（无需手动再投）
• 可组合（可在DeFi其他协议中使用）
• Gnosis Chain原生支持
\`\`\`

---

## 🎯 策略1：sDAI基础存款

### 最简单策略

\`\`\`javascript
// sdai_deposit.js
const { ethers } = require('ethers');

const SDAI_ADDRESS = '0x83F20F44975D03b1b09e64809B757c47f942BEeA';
const DAI_ADDRESS = '0x6B175474E89094C44Da98b954EedeAC495271d0F';

const SDAI_ABI = [
  'function deposit(uint256 assets, address receiver) returns (uint256 shares)',
  'function withdraw(uint256 assets, address receiver, address owner) returns (uint256 shares)',
  'function convertToAssets(uint256 shares) view returns (uint256)',
  'function balanceOf(address account) view returns (uint256)'
];

async function depositToSDAI() {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const sDAI = new ethers.Contract(SDAI_ADDRESS, SDAI_ABI, wallet);
  const dai = new ethers.Contract(DAI_ADDRESS, ERC20_ABI, wallet);

  // 1. 存入10,000 DAI
  const amount = ethers.parseUnits('10000', 18);

  console.log('步骤1：授权sDAI合约...');
  await dai.approve(SDAI_ADDRESS, amount);

  console.log('步骤2：存入DAI获取sDAI...');
  const tx = await sDAI.deposit(amount, wallet.address);
  await tx.wait();

  console.log('✅ 已存入 10,000 DAI');

  // 2. 查询sDAI份额
  const shares = await sDAI.balanceOf(wallet.address);
  console.log('获得sDAI: ' + ethers.formatUnits(shares, 18));

  // 3. 查询当前价值
  const assets = await sDAI.convertToAssets(shares);
  console.log('当前价值: ' + ethers.formatUnits(assets, 18) + ' DAI');

  // 4. 查询DSR利率
  const dsr = await getCurrentDSR();
  console.log('\\n当前DSR: ' + dsr.toFixed(2) + '%');
  console.log('预计年收益: $' + (10000 * dsr / 100).toFixed(2));
}

async function getCurrentDSR() {
  // 从MakerDAO获取DSR
  const POT_ADDRESS = '0x197E90f9FAD81970bA7976f33CbD77088E5D7cf7';
  const pot = new ethers.Contract(
    POT_ADDRESS,
    ['function dsr() view returns (uint256)'],
    provider
  );

  const dsr = await pot.dsr();
  // DSR以每秒复利表示，转换为年化
  const dsrPerSecond = Number(dsr) / 1e27;
  const annualDSR = (Math.pow(dsrPerSecond, 365 * 24 * 60 * 60) - 1) * 100;

  return annualDSR;
}

depositToSDAI();
\`\`\`

**收益特点**：
- ✅ 零清算风险（仅存款，不借贷）
- ✅ 自动复利
- ✅ 随时提取（无锁定）
- ✅ Gas成本低（$10–30）

---

## 🎯 策略2：SparkLend E-Mode循环

### 98%抵押率循环

**E-Mode**（高效模式）允许相关资产达到98% LTV：

\`\`\`
启用E-Mode（稳定币类别）：
• DAI ↔ USDC: 98% LTV
• DAI ↔ USDT: 98% LTV
• USDC ↔ USDT: 98% LTV

循环策略：
步骤1：存入 $10,000 DAI
步骤2：借出 $9,800 DAI（98% LTV）
步骤3：再存入 $9,800 DAI
步骤4：借出 $9,604 DAI
...重复10次

最终：
• 总存款：~$500,000（50倍杠杆）
• 总借款：~$490,000
• 净资产：$10,000（不变）

收益计算（DSR = 5%）：
• 存款收益：$500,000 × 5% = $25,000
• 借款成本：$490,000 × 4% = $19,600
• 净收益：$5,400（54% APY）

⚠️ 风险：健康因子仅1.02（极易清算）
\`\`\`

---

### 安全循环代码（3-5次）

\`\`\`javascript
// spark_loop.js
const SPARK_POOL = '0xC13e21B648A5Ee794902342038FF3aDAB66BE987';

const POOL_ABI = [
  'function supply(address asset, uint256 amount, address onBehalfOf, uint16 referralCode)',
  'function borrow(address asset, uint256 amount, uint256 interestRateMode, uint16 referralCode, address onBehalfOf)',
  'function setUserEMode(uint8 categoryId)',
  'function getUserAccountData(address user) view returns (uint256, uint256, uint256, uint256, uint256, uint256)'
];

async function sparkLoop(initialAmount, loops = 5) {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const pool = new ethers.Contract(SPARK_POOL, POOL_ABI, wallet);
  const dai = new ethers.Contract(DAI_ADDRESS, ERC20_ABI, wallet);

  // 1. 开启E-Mode（稳定币类别ID = 1）
  console.log('步骤1：开启E-Mode...');
  const tx1 = await pool.setUserEMode(1);
  await tx1.wait();
  console.log('✅ E-Mode已开启（98% LTV）');

  // 2. 首次存入
  console.log('\\n步骤2：首次存入 ' + initialAmount + ' DAI...');
  await dai.approve(SPARK_POOL, ethers.parseUnits(initialAmount.toString(), 18));
  await pool.supply(
    DAI_ADDRESS,
    ethers.parseUnits(initialAmount.toString(), 18),
    wallet.address,
    0
  );

  // 3. 循环借贷（保守使用95% LTV）
  for (let i = 0; i < loops; i++) {
    console.log('\\n--- 循环 ' + (i + 1) + ' ---');

    // 获取账户数据
    const userData = await pool.getUserAccountData(wallet.address);
    const availableToBorrow = Number(userData[2]) / 1e18;

    if (availableToBorrow < 100) {
      console.log('可借额度不足，停止循环');
      break;
    }

    // 借出95%（留5%安全缓冲）
    const borrowAmount = availableToBorrow * 0.95;
    console.log('借出: ' + borrowAmount.toFixed(2) + ' DAI');

    await pool.borrow(
      DAI_ADDRESS,
      ethers.parseUnits(borrowAmount.toFixed(2), 18),
      2, // 浮动利率
      0,
      wallet.address
    );

    // 再次存入
    console.log('存入: ' + borrowAmount.toFixed(2) + ' DAI');
    await dai.approve(SPARK_POOL, ethers.parseUnits(borrowAmount.toFixed(2), 18));
    await pool.supply(
      DAI_ADDRESS,
      ethers.parseUnits(borrowAmount.toFixed(2), 18),
      wallet.address,
      0
    );

    // 检查健康因子
    const finalData = await pool.getUserAccountData(wallet.address);
    const healthFactor = Number(ethers.formatUnits(finalData[5], 18));

    console.log('健康因子: ' + healthFactor.toFixed(2));

    if (healthFactor < 1.1) {
      console.log('⚠️ 健康因子过低，停止循环');
      break;
    }
  }

  // 4. 最终统计
  const finalData = await pool.getUserAccountData(wallet.address);
  const totalCollateral = Number(ethers.formatUnits(finalData[0], 8));
  const totalDebt = Number(ethers.formatUnits(finalData[1], 8));

  console.log('\\n--- 循环完成 ---');
  console.log('总存款: $' + totalCollateral.toFixed(2));
  console.log('总借款: $' + totalDebt.toFixed(2));
  console.log('杠杆倍数: ' + (totalCollateral / initialAmount).toFixed(2) + 'x');
}

// 执行：$10,000初始，5次循环（安全）
sparkLoop(10000, 5);
\`\`\`

---

## 🎯 策略3：DAI稳定币套利

### DSR vs 市场利率套利

当DSR高于市场利率时，存在套利机会：

\`\`\`
场景：
• DSR利率：8%
• Aave USDC借款利率：5%

套利策略：
1. 在Aave借10,000 USDC（5%成本）
2. 兑换USDC → DAI
3. 存入sDAI（8%收益）
4. 净收益：8% - 5% = 3%

年收益：$10,000 × 3% = $300
\`\`\`

---

### 自动监控DSR套利

\`\`\`javascript
// dsr_arbitrage_monitor.js
async function monitorDSRArbitrage() {
  // 1. 获取DSR利率
  const dsr = await getCurrentDSR();

  // 2. 获取Aave USDC借款利率
  const aaveUSDCBorrow = await getAaveUSDCBorrowRate();

  // 3. 获取Compound DAI借款利率
  const compoundDAIBorrow = await getCompoundDAIBorrowRate();

  console.log('\\nDSR套利监控：');
  console.log('----------------------------');
  console.log('DSR利率: ' + dsr.toFixed(2) + '%');
  console.log('Aave USDC借款: ' + aaveUSDCBorrow.toFixed(2) + '%');
  console.log('Compound DAI借款: ' + compoundDAIBorrow.toFixed(2) + '%');

  // 4. 检查套利机会
  const aaveSpread = dsr - aaveUSDCBorrow;
  const compoundSpread = dsr - compoundDAIBorrow;

  if (aaveSpread > 2) {
    console.log('\\n🚨 Aave套利机会！');
    console.log('策略：借USDC(' + aaveUSDCBorrow.toFixed(2) + '%) → 存sDAI(' + dsr.toFixed(2) + '%)');
    console.log('净收益: ' + aaveSpread.toFixed(2) + '%');
  }

  if (compoundSpread > 2) {
    console.log('\\n🚨 Compound套利机会！');
    console.log('策略：借DAI(' + compoundDAIBorrow.toFixed(2) + '%) → 存sDAI(' + dsr.toFixed(2) + '%)');
    console.log('净收益: ' + compoundSpread.toFixed(2) + '%');
  }

  if (aaveSpread < 2 && compoundSpread < 2) {
    console.log('\\n❌ 无明显套利机会');
  }
}

setInterval(monitorDSRArbitrage, 86400000); // 每天检查
\`\`\`

---

## 🎯 策略4：Gnosis Chain低成本部署

### 为什么选择Gnosis？

**Gnosis Chain优势**：
- **Gas超低**：$0.001–0.01（以太坊的1/1000）
- **sDAI原生支持**：Gnosis原生集成sDAI
- **相同收益**：DSR利率与主网相同

**适合场景**：小资金（$500–5K）

---

### Gnosis部署代码

\`\`\`javascript
// gnosis_sdai.js
const GNOSIS_RPC = 'https://rpc.gnosischain.com';
const GNOSIS_SDAI = '0xaf204776c7245bF4147c2612BF6e5972Ee483701';

async function deployOnGnosis() {
  const provider = new ethers.JsonRpcProvider(GNOSIS_RPC);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const sDAI = new ethers.Contract(GNOSIS_SDAI, SDAI_ABI, wallet);

  // 存入DAI
  const amount = ethers.parseUnits('1000', 18);
  const tx = await sDAI.deposit(amount, wallet.address);
  await tx.wait();

  console.log('✅ Gnosis部署完成');
  console.log('Gas成本: <$0.01（极低！）');
}
\`\`\`

**收益对比**：
\`\`\`
以太坊主网（$5K本金）：
• 年收益：$5,000 × 8% = $400
• Gas成本：~$50
• 净收益：$350（7% APY）

Gnosis Chain（$5K本金）：
• 年收益：$5,000 × 8% = $400
• Gas成本：~$0.1
• 净收益：$399.9（8% APY）

小资金推荐Gnosis！
\`\`\`

---

## ⚠️ 风险管理

### 1. **DSR利率波动**

**问题**：DSR由MakerDAO治理控制，可能快速变化

\`\`\`
历史波动：
• 2023-08：DSR从0% → 5%（治理投票）
• 2023-11：DSR从5% → 8%（1天内）
• 2024-01：DSR可能下调

风险：循环借贷时，DSR下降可能导致亏损
\`\`\`

**应对措施**：

\`\`\`javascript
// dsr_alert.js
async function monitorDSRChanges() {
  const currentDSR = await getCurrentDSR();
  const previousDSR = loadPreviousDSR(); // 从缓存读取

  if (Math.abs(currentDSR - previousDSR) > 1) {
    console.log('🚨 DSR变化超过1%！');
    console.log('之前: ' + previousDSR.toFixed(2) + '%');
    console.log('现在: ' + currentDSR.toFixed(2) + '%');

    await sendTelegramAlert('DSR变化: ' + previousDSR.toFixed(2) + '% → ' + currentDSR.toFixed(2) + '%');
  }

  saveDSR(currentDSR);
}

setInterval(monitorDSRChanges, 3600000); // 每小时检查
\`\`\`

---

### 2. **E-Mode清算风险**

**98% LTV风险极高**：

\`\`\`
健康因子计算：
HF = (抵押品 × 0.98) / 债务

示例：
• 存款：$500,000 DAI
• 借款：$490,000 DAI
• HF = (500,000 × 0.98) / 490,000 = 1.0

任何小波动（如DAI临时脱锚）都会清算！
\`\`\`

**安全建议**：
- 保守循环（5次，HF ~1.5）
- 激进循环（10次，HF ~1.05）需24/7监控
- 设置自动止损

---

## 💰 收益计算实例

### 场景1：保守sDAI（$10K）

\`\`\`
本金：$10,000 DAI

策略：
• 存入sDAI
• 无借贷，零清算风险

年收益：
• DSR：8%
• 年收益：$800

Gas成本：
• 存入：$15
• 提取：$15
• 总成本：$30
• 净收益：$770（7.7% APY）

风险：极低 ⭐
\`\`\`

---

### 场景2：E-Mode循环（$10K，5次）

\`\`\`
本金：$10,000 DAI

循环5次后：
• 总存款：$50,000（5倍杠杆）
• 总借款：$40,000
• 健康因子：1.5（安全）

年收益：
• 存款收益（DSR 8%）：$50,000 × 8% = $4,000
• 借款成本（4%）：$40,000 × 4% = -$1,600
• 净收益：$2,400（24% APY）

Gas成本：~$100（5次循环）
净收益：$2,300（23% APY）

风险：中等 ⭐⭐⭐
\`\`\`

---

## 📋 执行检查清单

### 阶段1：基础准备（1天）

- [ ] 理解DSR机制
- [ ] 查询当前DSR利率
- [ ] 准备DAI或USDC（$1K+）
- [ ] 选择部署链（以太坊/Gnosis）

### 阶段2：sDAI存款（1天）

- [ ] 存入sDAI获取DSR
- [ ] 监控汇率变化
- [ ] 设置DSR报警（变化>1%）
- [ ] 计算实际APY

### 阶段3：循环借贷（1-2周）

- [ ] 开启SparkLend E-Mode
- [ ] 执行3-5次循环
- [ ] 监控健康因子（>1.5）
- [ ] 对比循环vs单纯存款收益

### 阶段4：优化与监控（长期）

- [ ] 开发DSR套利监控脚本
- [ ] Gnosis小额部署测试
- [ ] 参与MakerDAO治理（影响DSR）
- [ ] 定期检查利差机会

---

## 🎯 总结

**Spark借贷收益放大**的核心是**DSR集成+E-Mode高杠杆**：

| 优势 | 说明 |
|------|------|
| ✅ **DSR稳定收益** | 5–8% APY，MakerDAO背书 |
| ✅ **98% E-Mode** | 行业最高抵押率 |
| ✅ **低清算罚金** | 仅1%（行业最低） |
| ✅ **自动复利** | sDAI无需手动操作 |
| ⚠️ **无代币奖励** | 纯利息收益 |
| ⚠️ **DSR波动** | 治理控制，可能快速变化 |

**推荐路径**：
1. 新手：单纯sDAI存款（5–8% APY）
2. 进阶：3-5次E-Mode循环（12–18% APY）
3. 专家：DSR套利+10次循环（20–30% APY）

**最佳实践**：小资金用Gnosis（Gas几乎为0），大资金用以太坊（安全性最高）！ 🚀
`,

  steps: [
    {
      step_number: 1,
      title: '理解DSR与sDAI',
      description:
        '学习MakerDAO的DAI Savings Rate机制，理解sDAI代币化存款原理，查询当前DSR利率（5-8%），准备DAI或USDC资金（建议$1K以上）。',
      time_minutes: 90
    },
    {
      step_number: 2,
      title: 'sDAI基础存款',
      description:
        '选择部署链（以太坊主网或Gnosis Chain），将DAI存入sDAI合约获取DSR收益，设置每日监控DSR利率变化（>1%报警），计算扣除Gas后的实际APY。',
      time_minutes: 60
    },
    {
      step_number: 3,
      title: 'SparkLend E-Mode开启',
      description:
        '在SparkLend开启E-Mode稳定币类别（98% LTV），执行3-5次循环借贷（借DAI→存DAI→再借），保持健康因子>1.5避免清算，对比循环vs单纯存款收益提升。',
      time_minutes: 120
    },
    {
      step_number: 4,
      title: 'DSR套利监控',
      description:
        '开发脚本监控DSR vs Aave/Compound借款利率差异，当利差>2%时执行套利（低息借款→存sDAI），测试Gnosis Chain低Gas部署（适合小资金）。',
      time_minutes: 150
    },
    {
      step_number: 5,
      title: '风险管理与优化',
      description:
        '设置DSR快速变化报警（治理投票可能1天内调整利率），监控健康因子避免清算（E-Mode风险高），参与MakerDAO治理了解DSR调整提案，定期检查套利机会。',
      time_minutes: 120
    }
  ],

  status: 'published'
};

async function main() {
  try {
    // 1. 登录获取token
    const authResponse = await axios.post(DIRECTUS_URL + '/auth/login', {
      email: 'the_uk1@outlook.com',
      password: 'Mygcdjmyxzg2026!'
    });

    const token = authResponse.data.data.access_token;

    // 2. 创建策略
    const response = await axios.post(
      DIRECTUS_URL + '/items/strategies',
      {
        ...GUIDE_CONFIG,
        steps: GUIDE_CONFIG.steps
      },
      {
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Spark 借贷收益放大创建成功!');
    console.log('   ID: ' + response.data.data.id);
    console.log('   Slug: ' + response.data.data.slug);
    console.log('   访问: http://localhost:3000/strategies/' + response.data.data.slug);
  } catch (error) {
    console.error('❌ 创建失败:', error.response?.data || error.message);
  }
}

main();
