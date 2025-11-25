const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

const GUIDE_CONFIG = {
  title: 'Aave 借贷双挖策略',
  slug: 'aave-dual-mining-strategy',
  summary:
    'Aave V3借贷双挖完整攻略：存款赚取aToken利息+stkAAVE质押奖励、借款获得借贷挖矿激励、E-Mode高效模式提升资金利用率、循环借贷放大收益、GHO稳定币铸造套利、跨链部署（以太坊/Polygon/Arbitrum/Optimism）、清算风险管理、历史APY 8-25%、成本$500起。',

  category: 'lending',
  category_l1: 'yield',
  category_l2: '借贷挖息',

  difficulty_level: 3,
  risk_level: 3,
  apy_min: 8,
  apy_max: 25,

  threshold_capital: '500–50,000 USD（建议$5K+获取最佳收益率）',
  threshold_capital_min: 500,
  time_commitment: '初始设置2–4小时，每周检查健康因子1次，调仓每月1-2次',
  time_commitment_minutes: 30,
  threshold_tech_level: 'intermediate',

  content: `> **适用人群**：DeFi中级用户、理解借贷机制、追求稳健收益、能承受清算风险的投资者
> **阅读时间**：≈ 45–60 分钟
> **关键词**：Aave V3 / aToken / Borrowing / Liquidation / E-Mode / Health Factor / GHO / stkAAVE / Cross-chain / DeFi Lending

---

## 📊 TL;DR（60秒速览）

**核心思路**：在Aave存入资产赚利息，同时借出稳定币再存入，形成循环放大收益

| 策略 | 年化收益 | 风险等级 | 资金要求 |
|------|---------|---------|---------|
| **单纯存款** | 3–6% | ⭐ 低 | $500+ |
| **借贷双挖** | 8–15% | ⭐⭐ 中 | $2K+ |
| **循环借贷** | 12–25% | ⭐⭐⭐ 中高 | $5K+ |
| **GHO套利** | 5–20%（机会性） | ⭐⭐⭐ 中高 | $10K+ |

**收益来源**：
1. **存款利息**：存入ETH/WBTC/稳定币获得aToken（自动计息）
2. **借贷挖矿**：在激励市场借款获得代币奖励（AAVE/OP/ARB等）
3. **stkAAVE质押**：质押AAVE代币获得协议收益分成
4. **循环放大**：借稳定币再存入，重复3-5次提升资金效率

**风险**：健康因子<1.0触发清算，损失抵押品的罚金（最高10%）

---

## 🏗️ Aave V3核心机制

### 什么是Aave？

**Aave**是DeFi最大的借贷协议（TVL $10B+），支持：
- **存款**：存入资产获得aToken（如aUSDC），自动赚取利息
- **借款**：抵押资产后借出其他资产，利率浮动
- **闪电贷**：无抵押借款（需在1个区块内归还）

---

### Aave V3新特性

| 功能 | V2 | V3 | 优势 |
|------|----|----|------|
| **E-Mode** | ❌ | ✅ | 相关资产抵押率提升至97% |
| **Portal** | ❌ | ✅ | 跨链流动性（L2→L1） |
| **隔离模式** | ❌ | ✅ | 新资产风险隔离 |
| **Gas优化** | - | 20–25%降低 | L1更便宜 |

**E-Mode示例**：
- 普通模式：存$10K ETH，最多借$8K稳定币（80% LTV）
- E-Mode（稳定币）：存$10K USDC，借$9.7K DAI（97% LTV）

---

## 🎯 策略1：基础借贷双挖

### 操作步骤

**场景**：用$10,000 USDC获取双重收益

\`\`\`
步骤1：存入抵押品
├─ 存入 10,000 USDC 到 Aave
├─ 获得 10,000 aUSDC（自动计息代币）
└─ 当前存款APY：4%

步骤2：借出资产
├─ 借出 6,000 USDC（60% LTV，安全）
├─ 借款APY：-6%
├─ 借款奖励（AAVE代币）：+8%
└─ 净借款收益：+2%

步骤3：再次存入
├─ 将借出的 6,000 USDC 再存入 Aave
├─ 获得额外 6,000 aUSDC
└─ 额外存款APY：4%

总收益计算：
• 存款收益：10,000 × 4% + 6,000 × 4% = $640
• 借款成本：6,000 × 6% = -$360
• 借款奖励：6,000 × 8% = +$480
• 净收益：$760（7.6% APY）
\`\`\`

---

### 合约交互代码

\`\`\`javascript
// aave_dual_mining.js
const { ethers } = require('ethers');

const AAVE_POOL_V3 = '0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2'; // 以太坊主网
const USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';

const POOL_ABI = [
  'function supply(address asset, uint256 amount, address onBehalfOf, uint16 referralCode)',
  'function borrow(address asset, uint256 amount, uint256 interestRateMode, uint16 referralCode, address onBehalfOf)',
  'function getUserAccountData(address user) view returns (uint256 totalCollateralBase, uint256 totalDebtBase, uint256 availableBorrowsBase, uint256 currentLiquidationThreshold, uint256 ltv, uint256 healthFactor)'
];

async function aaveDualMining() {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const pool = new ethers.Contract(AAVE_POOL_V3, POOL_ABI, wallet);
  const usdc = new ethers.Contract(USDC_ADDRESS, ERC20_ABI, wallet);

  // 1. 存入 10,000 USDC
  const depositAmount = ethers.parseUnits('10000', 6); // USDC 6位小数

  console.log('步骤1：存入抵押品...');
  await usdc.approve(AAVE_POOL_V3, depositAmount);

  const tx1 = await pool.supply(
    USDC_ADDRESS,
    depositAmount,
    wallet.address,
    0 // referral code
  );
  await tx1.wait();
  console.log('✅ 已存入 10,000 USDC');

  // 2. 检查账户状态
  const accountData = await pool.getUserAccountData(wallet.address);

  console.log('\\n账户状态：');
  console.log('总抵押品：$' + ethers.formatUnits(accountData.totalCollateralBase, 8));
  console.log('可借额度：$' + ethers.formatUnits(accountData.availableBorrowsBase, 8));
  console.log('健康因子：' + Number(ethers.formatUnits(accountData.healthFactor, 18)).toFixed(2));

  // 3. 借出 60% （安全比例）
  const borrowAmount = ethers.parseUnits('6000', 6);

  console.log('\\n步骤2：借出稳定币...');
  const tx2 = await pool.borrow(
    USDC_ADDRESS,
    borrowAmount,
    2, // 浮动利率（2 = variable rate）
    0,
    wallet.address
  );
  await tx2.wait();
  console.log('✅ 已借出 6,000 USDC');

  // 4. 将借出的USDC再次存入
  console.log('\\n步骤3：循环存入...');
  await usdc.approve(AAVE_POOL_V3, borrowAmount);

  const tx3 = await pool.supply(
    USDC_ADDRESS,
    borrowAmount,
    wallet.address,
    0
  );
  await tx3.wait();
  console.log('✅ 已再次存入 6,000 USDC');

  // 5. 最终状态
  const finalData = await pool.getUserAccountData(wallet.address);
  console.log('\\n最终账户状态：');
  console.log('总抵押品：$' + ethers.formatUnits(finalData.totalCollateralBase, 8));
  console.log('总债务：$' + ethers.formatUnits(finalData.totalDebtBase, 8));
  console.log('健康因子：' + Number(ethers.formatUnits(finalData.healthFactor, 18)).toFixed(2));
}

aaveDualMining();
\`\`\`

---

## 🎯 策略2：E-Mode循环借贷

**目标**：利用E-Mode的高LTV（97%）最大化资金效率

### 适用场景

**稳定币循环**：存USDC → 借DAI → 存DAI → 借USDC...

\`\`\`
资金：$10,000 USDC
E-Mode LTV：97%

循环1：存 $10,000 → 借 $9,700 DAI → 存 $9,700
循环2：存 $9,700 → 借 $9,409 USDC → 存 $9,409
循环3：存 $9,409 → 借 $9,127 DAI → 存 $9,127
...
（通常执行3-5次）

最终杠杆：~20x
总存款：$200,000
净资产：$10,000
收益放大：20倍（但风险也放大）
\`\`\`

---

### E-Mode开启代码

\`\`\`javascript
// 开启E-Mode（稳定币类别ID = 1）
async function enableEMode() {
  const pool = new ethers.Contract(AAVE_POOL_V3, POOL_ABI, wallet);

  const tx = await pool.setUserEMode(1); // 1 = Stablecoins category
  await tx.wait();

  console.log('✅ E-Mode已开启（稳定币类别）');
}

// 循环借贷（自动执行5次）
async function loopBorrowing(initialAmount, loops = 5) {
  let currentAmount = initialAmount;

  for (let i = 0; i < loops; i++) {
    console.log('\\n--- 循环 ' + (i + 1) + ' ---');

    // 存入
    await supply(USDC_ADDRESS, currentAmount);

    // 借出97%
    const borrowAmount = currentAmount * 0.97;
    await borrow(DAI_ADDRESS, borrowAmount);

    // 兑换DAI→USDC（通过1inch或直接用DAI）
    currentAmount = borrowAmount;

    // 检查健康因子
    const accountData = await pool.getUserAccountData(wallet.address);
    const healthFactor = Number(ethers.formatUnits(accountData.healthFactor, 18));

    console.log('健康因子：' + healthFactor.toFixed(2));

    if (healthFactor < 1.2) {
      console.log('⚠️ 健康因子过低，停止循环');
      break;
    }
  }

  console.log('\\n✅ 循环借贷完成');
}
\`\`\`

---

## 🎯 策略3：GHO稳定币套利

**GHO**是Aave原生稳定币，持有者可享受：
- 借款利率折扣（质押stkAAVE可降低30%）
- GHO/USDC价差套利（脱锚时）

### GHO铸造与套利

\`\`\`javascript
// 铸造GHO
async function mintGHO() {
  const GHO_ADDRESS = '0x40D16FC0246aD3160Ccc09B8D0D3A2cD28aE6C2f';

  // 1. 存入ETH作为抵押
  await pool.supply(WETH_ADDRESS, ethers.parseEther('5'), wallet.address, 0);

  // 2. 借出GHO（利率约3%）
  const ghoAmount = ethers.parseUnits('5000', 18);
  await pool.borrow(GHO_ADDRESS, ghoAmount, 2, 0, wallet.address);

  console.log('✅ 已铸造 5,000 GHO');

  // 3. 检查GHO价格
  const ghoPrice = await getGHOPrice(); // 从Curve获取

  if (ghoPrice < 0.99) {
    console.log('🚨 GHO折价，买入套利机会');
    // 在Curve买入GHO，归还借款
  } else if (ghoPrice > 1.01) {
    console.log('💰 GHO溢价，卖出套利');
    // 卖出GHO换USDC
  }
}
\`\`\`

---

## 🎯 策略4：跨链部署优化

**不同链的Aave收益率差异**：

| 链 | 存款APY（USDC） | 借款APY | Gas成本 | 推荐度 |
|---|----------------|---------|---------|--------|
| **以太坊** | 3–5% | 5–7% | $50–200 | ⭐⭐⭐ 大资金 |
| **Polygon** | 4–8% | 6–10% | $0.1–1 | ⭐⭐⭐⭐⭐ 最佳 |
| **Arbitrum** | 3–6% | 5–8% | $1–5 | ⭐⭐⭐⭐ 推荐 |
| **Optimism** | 3–6% | 5–8% | $1–5 | ⭐⭐⭐⭐ 推荐 |
| **Base** | 4–7% | 6–9% | $0.5–2 | ⭐⭐⭐⭐ 新链 |

**推荐策略**：
- **$500–5K**：部署在Polygon（Gas便宜）
- **$5K–50K**：分散到Arbitrum + Optimism
- **$50K+**：主力在以太坊（安全性最高）

---

### 跨链Portal功能

\`\`\`javascript
// 从Polygon转移流动性到Arbitrum
async function bridgeWithPortal() {
  const PORTAL_ADDRESS = '0x...'; // Portal合约地址

  // 1. 在Polygon提取aUSDC
  await pool.withdraw(USDC_ADDRESS, ethers.parseUnits('10000', 6), wallet.address);

  // 2. 通过Portal跨链
  const portal = new ethers.Contract(PORTAL_ADDRESS, PORTAL_ABI, wallet);

  await portal.bridge(
    USDC_ADDRESS,
    ethers.parseUnits('10000', 6),
    42161, // Arbitrum chain ID
    wallet.address
  );

  console.log('✅ 流动性已跨链到Arbitrum');
}
\`\`\`

---

## ⚠️ 风险管理

### 1. **健康因子监控**

**健康因子计算**：
\`\`\`
健康因子 = (抵押品价值 × 清算阈值) / 总债务

安全区间：
• > 2.0：非常安全
• 1.5–2.0：安全
• 1.2–1.5：需警惕
• 1.0–1.2：高风险
• < 1.0：立即清算
\`\`\`

**监控脚本**：

\`\`\`javascript
// health_monitor.js
async function monitorHealthFactor() {
  setInterval(async () => {
    const accountData = await pool.getUserAccountData(wallet.address);
    const healthFactor = Number(ethers.formatUnits(accountData.healthFactor, 18));

    console.log('当前健康因子：' + healthFactor.toFixed(2));

    if (healthFactor < 1.5) {
      console.log('⚠️ 健康因子过低，发送报警');
      await sendTelegramAlert('Aave健康因子：' + healthFactor.toFixed(2));

      if (healthFactor < 1.2) {
        console.log('🚨 紧急还款，避免清算');
        await emergencyRepay();
      }
    }
  }, 300000); // 每5分钟检查
}

async function emergencyRepay() {
  // 自动还款以提升健康因子
  const repayAmount = ethers.parseUnits('2000', 6); // 还2000 USDC

  await pool.repay(USDC_ADDRESS, repayAmount, 2, wallet.address);
  console.log('✅ 已紧急还款 2000 USDC');
}
\`\`\`

---

### 2. **清算机制**

当健康因子<1.0时，任何人可触发清算：

\`\`\`
清算罚金：
• 稳定币：5%
• ETH/WBTC：10%
• 其他资产：最高15%

清算示例：
抵押品：10 ETH（$20,000）
债务：$16,000 USDC
健康因子：0.95（触发清算）

清算过程：
1. 清算者归还 $8,000 USDC（最多清算50%债务）
2. 获得 4.4 ETH（价值$8,800，包含10%奖励）
3. 用户损失：$800（10%罚金）
\`\`\`

---

### 3. **利率波动风险**

**浮动利率模型**：

\`\`\`
当资金利用率 > 90% 时：
借款利率急剧上升（可能从5% → 50%）

应对策略：
• 监控Utilization Rate
• 利用率>85%时减少借款
• 使用稳定利率模式（利率稍高但固定）
\`\`\`

---

## 💰 收益计算实例

### 场景1：保守策略（$10K USDC）

\`\`\`
本金：$10,000 USDC

操作：
• 存入 $10,000 USDC（4% APY）
• 借出 $5,000 USDC（6% 借款成本，8% 奖励）
• 再存入 $5,000 USDC（4% APY）

年收益：
• 存款：$10,000 × 4% + $5,000 × 4% = $600
• 借款成本：$5,000 × 6% = -$300
• 奖励：$5,000 × 8% = $400
• 净收益：$700（7% APY）

风险：健康因子约2.0（安全）
\`\`\`

---

### 场景2：激进策略（$10K USDC，E-Mode）

\`\`\`
本金：$10,000 USDC

操作：
• 开启E-Mode
• 循环借贷5次（97% LTV）
• 最终杠杆：20x

年收益：
• 总存款：$200,000
• 存款收益：$200,000 × 4% = $8,000
• 借款成本：$190,000 × 6% = -$11,400
• 奖励：$190,000 × 8% = $15,200
• 净收益：$11,800（118% APY）

⚠️ 风险：健康因子约1.05（极高风险，市场波动可能清算）
\`\`\`

---

## 📋 执行检查清单

### 阶段1：入门准备（1-2天）

- [ ] 理解Aave借贷机制（存款/借款/清算）
- [ ] 计算不同资产的LTV和清算阈值
- [ ] 在测试网（Goerli）模拟操作
- [ ] 准备至少$500资金（建议$2K+）

### 阶段2：基础部署（1-3天）

- [ ] 选择部署链（推荐Polygon/Arbitrum）
- [ ] 存入初始抵押品（USDC/ETH）
- [ ] 执行第一次借贷双挖
- [ ] 设置健康因子监控脚本

### 阶段3：收益优化（1-2周）

- [ ] 测试E-Mode循环借贷（小额）
- [ ] 对比不同链的收益率
- [ ] 计算实际APY（扣除Gas）
- [ ] 参与AAVE质押（stkAAVE）

### 阶段4：进阶策略（长期）

- [ ] 开发自动化调仓脚本
- [ ] 参与GHO套利
- [ ] 跨链分散部署
- [ ] 监控协议治理提案（影响利率）

---

## 🎓 常见问题

**Q1：健康因子多少安全？**
A：建议保持>1.5。新手>2.0，有经验者1.3–1.5。

**Q2：循环借贷会被清算吗？**
A：会。市场波动导致抵押品价值下降或借款利率上升都可能触发清算。

**Q3：Gas费太高怎么办？**
A：部署到L2（Polygon/Arbitrum），Gas降低99%。

**Q4：借款奖励什么时候发放？**
A：实时累积，可随时Claim（领取）。

**Q5：可以自动复投吗？**
A：Aave本身自动复利（aToken余额增加），但借款奖励需手动Claim。

---

## 🎯 总结

**Aave借贷双挖**的核心是**资金效率最大化**：

| 优势 | 说明 |
|------|------|
| ✅ **成熟协议** | TVL $10B+，运行4年无重大漏洞 |
| ✅ **跨链支持** | 7条链，L2 Gas超低 |
| ✅ **灵活性高** | 随时存取，无锁仓 |
| ✅ **收益稳定** | 历史APY 8–25% |
| ⚠️ **清算风险** | 需监控健康因子 |
| ⚠️ **利率波动** | 浮动利率可能急升 |

**推荐路径**：
1. 新手：单纯存款（3–6% APY）
2. 进阶：借贷双挖（8–15% APY）
3. 专家：E-Mode循环（15–25% APY）

**风险提醒**：循环借贷放大收益的同时也放大风险，务必监控健康因子！ 🛡️
`,

  steps: [
    {
      step_number: 1,
      title: '准备与测试',
      description:
        '在Aave官网学习借贷机制，理解LTV、清算阈值、健康因子概念，在Goerli测试网模拟存款和借款操作，准备至少$500资金（建议$2K以上）。',
      time_minutes: 120
    },
    {
      step_number: 2,
      title: '首次存款借贷',
      description:
        '选择部署链（推荐Polygon/Arbitrum降低Gas），存入USDC/ETH作为抵押品，借出50-60%额度的稳定币（保持健康因子>2.0），将借出资金再次存入形成双挖。',
      time_minutes: 60
    },
    {
      step_number: 3,
      title: '健康因子监控',
      description:
        '部署监控脚本每5分钟检查健康因子，设置Telegram报警（健康因子<1.5时通知），准备紧急还款策略，测试手动还款流程。',
      time_minutes: 90
    },
    {
      step_number: 4,
      title: '收益优化',
      description:
        '开启E-Mode提升LTV至97%（仅限稳定币），小额测试循环借贷（3-5次循环），对比不同链收益率，Claim借款奖励代币并复投或出售。',
      time_minutes: 120
    },
    {
      step_number: 5,
      title: '进阶与规模化',
      description:
        '跨链分散部署（Polygon 40% + Arbitrum 30% + 以太坊30%），参与AAVE质押获得stkAAVE奖励，测试GHO稳定币套利，开发自动化调仓脚本。',
      time_minutes: 180
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

    console.log('✅ Aave 借贷双挖策略创建成功!');
    console.log('   ID: ' + response.data.data.id);
    console.log('   Slug: ' + response.data.data.slug);
    console.log('   访问: http://localhost:3000/strategies/' + response.data.data.slug);
  } catch (error) {
    console.error('❌ 创建失败:', error.response?.data || error.message);
  }
}

main();
