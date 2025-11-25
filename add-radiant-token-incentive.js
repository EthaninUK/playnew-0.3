const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

const GUIDE_CONFIG = {
  title: 'Radiant 代币激励挖息',
  slug: 'radiant-token-incentive',
  summary:
    'Radiant Capital全链借贷挖矿策略：跨链资产抵押（Arbitrum/BSC/Base）、动态流动性（dLP）锁仓、RDNT代币高激励（APY 20-80%）、循环借贷放大收益、LayerZero跨链技术、治理权重提升、早期项目高回报、风险对冲、历史APY 25-100%、成本$2K起。',

  category: 'lending',
  category_l1: 'yield',
  category_l2: '借贷挖息',

  difficulty_level: 4,
  risk_level: 4,
  apy_min: 25,
  apy_max: 100,

  threshold_capital: '2,000–50,000 USD（代币激励期，建议$5K+）',
  threshold_capital_min: 2000,
  time_commitment: '初始设置3–5小时，每周锁仓dLP，每月调仓1次',
  time_commitment_minutes: 60,
  threshold_tech_level: 'advanced',

  content: `> **适用人群**：DeFi高级用户、追求高收益代币激励、理解早期项目风险、能承受RDNT价格波动的投资者
> **阅读时间**：≈ 45–60 分钟
> **关键词**：Radiant Capital / RDNT Token / Cross-chain Lending / dLP / Dynamic Liquidity / LayerZero / Arbitrum / BSC / Token Incentives / High APY

---

## 📊 TL;DR（60秒速览）

**核心思路**：在Radiant存借款赚取高额RDNT代币奖励，锁仓dLP提升收益倍数

| 策略 | 基础APY | RDNT激励 | dLP加成 | 总APY |
|------|---------|---------|---------|-------|
| **单纯存款** | 3–5% | 15–25% | 1x | 18–30% |
| **锁仓dLP（5%）** | 3–5% | 15–25% | 2x | 33–55% |
| **循环借贷+dLP** | 10–15% | 40–60% | 2x | 90–150% |

**Radiant vs 主流借贷协议**：

| 特性 | Radiant | Aave V3 | Compound |
|------|---------|---------|----------|
| **代币激励** | 🔥 极高（20-80%） | 中等（5-15%） | 中等（5-10%） |
| **跨链支持** | ✅ 原生（LayerZero） | 多链部署 | 有限 |
| **dLP机制** | ✅ 独特 | ❌ | ❌ |
| **TVL** | $300M | $10B | $3B |
| **风险** | 高（早期项目） | 低 | 低 |

**Radiant独特优势**：
1. **全链借贷**：同一抵押品跨链借款（LayerZero技术）
2. **dLP锁仓**：锁定5%流动性池份额，收益翻倍
3. **高代币激励**：RDNT释放量大，早期APY极高
4. **循环友好**：支持稳定币循环，放大RDNT收益

---

## 🏗️ Radiant Capital核心机制

### 什么是Radiant？

**Radiant Capital**是全链借贷协议（Omnichain Lending）：
- **底层技术**：基于Aave V2代码，集成LayerZero
- **定位**：跨链资产抵押与借贷
- **创新**：dLP（动态流动性）机制

**关键组件**：
\`\`\`
Lending Pool：借贷池（类似Aave）
RDNT Token：治理+激励代币
dLP：动态流动性提供者（解锁高收益）
LayerZero：跨链消息传递
\`\`\`

---

### dLP（Dynamic Liquidity Provider）机制

**dLP是Radiant最核心创新**：

\`\`\`
传统借贷协议问题：
• 用户存款 → 赚利息
• 用户借款 → 付利息 + 赚代币奖励
• 协议代币被借款人获取并抛售
• 导致代币价格下跌

Radiant解决方案（dLP）：
• 要获得RDNT奖励，必须锁定dLP
• dLP = Radiant流动性池LP代币（如RDNT-ETH LP）
• 锁定金额 = 存款金额的5%

示例：
存入 $10,000 USDC
要获得RDNT奖励，需锁定价值 $500 的 dLP（RDNT-ETH LP）
锁定期：90天

优势：
✅ 稳定RDNT价格（减少抛压）
✅ 提升用户收益（LP也有收益）
✅ 增强治理参与度
\`\`\`

---

### 跨链借贷（LayerZero）

\`\`\`
场景：
用户在 Arbitrum 存入 10 ETH
可在 BSC 借出 15,000 USDT

实现：
1. Arbitrum锁定10 ETH抵押品
2. LayerZero传递消息到BSC
3. BSC验证抵押品，允许借款
4. 用户在BSC获得USDT

优势：
• 资产不需要跨链（节省费用）
• 提升资金效率
• 多链部署分散风险
\`\`\`

---

## 🎯 策略1：dLP锁仓基础挖矿

### 操作流程

\`\`\`javascript
// radiant_dlp_mining.js
const { ethers } = require('ethers');

const RADIANT_LENDING_POOL = '0xF4B1486DD74D07706052A33d31d7c0AAFD0659E1'; // Arbitrum
const USDC_ADDRESS = '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8';
const RDNT_ADDRESS = '0x3082CC23568eA640225c2467653dB90e9250AaA0';

async function radiantDLPMining() {
  const provider = new ethers.JsonRpcProvider(process.env.ARBITRUM_RPC);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  // 步骤1：准备dLP
  console.log('步骤1：准备dLP...');

  const depositAmount = ethers.parseUnits('10000', 6); // $10K USDC
  const requiredDLP = depositAmount * 5n / 100n; // 5% = $500

  // 在Uniswap V3添加RDNT-ETH流动性
  await addLiquidityToRDNTETH(requiredDLP);
  console.log('✅ 已添加 $500 RDNT-ETH流动性');

  // 步骤2：锁定dLP（90天）
  const dLP_LOCKER = '0x76ba3eC5f5adBf1C58c91e86502232317EeA72dE';
  const locker = new ethers.Contract(dLP_LOCKER, LOCKER_ABI, wallet);

  const lpTokens = await getLPTokenBalance(wallet.address);
  await locker.lock(lpTokens, 90); // 锁定90天

  console.log('✅ dLP已锁定90天');

  // 步骤3：存入USDC到Radiant
  const pool = new ethers.Contract(RADIANT_LENDING_POOL, POOL_ABI, wallet);
  const usdc = new ethers.Contract(USDC_ADDRESS, ERC20_ABI, wallet);

  await usdc.approve(RADIANT_LENDING_POOL, depositAmount);
  await pool.deposit(USDC_ADDRESS, depositAmount, wallet.address, 0);

  console.log('✅ 已存入 10,000 USDC');

  // 步骤4：查询收益
  const supplyAPY = await getSupplyAPY('USDC');
  const rdntAPY = await getRDNTIncentiveAPY('USDC');
  const dlpBoost = 2; // dLP锁仓翻倍

  console.log('\\n收益明细：');
  console.log('基础存款APY: ' + supplyAPY.toFixed(2) + '%');
  console.log('RDNT激励APY: ' + rdntAPY.toFixed(2) + '%');
  console.log('dLP加成: ' + dlpBoost + 'x');
  console.log('总APY: ' + (supplyAPY + rdntAPY * dlpBoost).toFixed(2) + '%');
  console.log('预计年收益: $' + (10000 * (supplyAPY + rdntAPY * dlpBoost) / 100).toFixed(2));
}

async function addLiquidityToRDNTETH(usdValue) {
  // 在Uniswap V3添加RDNT-ETH流动性
  const UNISWAP_POSITION_MANAGER = '0xC36442b4a4522E871399CD717aBDD847Ab11FE88';

  // 计算需要的RDNT和ETH数量
  const rdntPrice = await getRDNTPrice();
  const ethPrice = await getETHPrice();

  const rdntAmount = (Number(usdValue) / 2) / rdntPrice;
  const ethAmount = (Number(usdValue) / 2) / ethPrice;

  // 添加流动性（简化，实际需处理tick范围）
  const positionManager = new ethers.Contract(
    UNISWAP_POSITION_MANAGER,
    POSITION_MANAGER_ABI,
    wallet
  );

  const tx = await positionManager.mint({
    token0: RDNT_ADDRESS,
    token1: WETH_ADDRESS,
    fee: 3000,
    tickLower: -887220,
    tickUpper: 887220,
    amount0Desired: ethers.parseEther(rdntAmount.toString()),
    amount1Desired: ethers.parseEther(ethAmount.toString()),
    amount0Min: 0,
    amount1Min: 0,
    recipient: wallet.address,
    deadline: Math.floor(Date.now() / 1000) + 3600
  });

  await tx.wait();
}

radiantDLPMining();
\`\`\`

---

## 🎯 策略2：循环借贷放大RDNT收益

### 循环策略

\`\`\`
目标：最大化RDNT代币收益

步骤：
1. 存入 $10,000 USDC
2. 借出 $8,000 USDC（80% LTV）
3. 再存入 $8,000 USDC
4. 再借出 $6,400 USDC
...重复5次

最终：
• 总存款：$50,000（5倍）
• 总借款：$40,000
• 净资产：$10,000（不变）

RDNT收益计算：
• 存款RDNT激励：25% APY
• 借款RDNT激励：30% APY（借款激励更高！）
• 总RDNT奖励：$50,000 × 25% + $40,000 × 30% = $24,500
• dLP 2x加成：$24,500 × 2 = $49,000
• 借款成本：$40,000 × 6% = -$2,400
• 净收益：$46,600（466% APY！）

⚠️ 注意：收益以RDNT代币计价，需考虑RDNT价格波动
\`\`\`

---

### 循环代码

\`\`\`javascript
// radiant_loop.js
async function radiantLoop(initialAmount, loops = 5) {
  const pool = new ethers.Contract(RADIANT_LENDING_POOL, POOL_ABI, wallet);

  // 1. 首次存入
  await pool.deposit(USDC_ADDRESS, ethers.parseUnits(initialAmount.toString(), 6), wallet.address, 0);

  // 2. 循环借贷
  for (let i = 0; i < loops; i++) {
    console.log('\\n--- 循环 ' + (i + 1) + ' ---');

    // 获取可借额度
    const userData = await pool.getUserAccountData(wallet.address);
    const availableToBorrow = Number(userData.availableBorrowsBase) / 1e8;

    if (availableToBorrow < 100) {
      console.log('可借额度不足，停止循环');
      break;
    }

    // 借出80%
    const borrowAmount = availableToBorrow * 0.8;
    console.log('借出: ' + borrowAmount.toFixed(2) + ' USDC');

    await pool.borrow(
      USDC_ADDRESS,
      ethers.parseUnits(borrowAmount.toFixed(2), 6),
      2, // 浮动利率
      0,
      wallet.address
    );

    // 再次存入
    console.log('存入: ' + borrowAmount.toFixed(2) + ' USDC');
    await pool.deposit(
      USDC_ADDRESS,
      ethers.parseUnits(borrowAmount.toFixed(2), 6),
      wallet.address,
      0
    );

    // 检查健康因子
    const finalData = await pool.getUserAccountData(wallet.address);
    const healthFactor = Number(finalData.healthFactor) / 1e18;

    console.log('健康因子: ' + healthFactor.toFixed(2));

    if (healthFactor < 1.3) {
      console.log('⚠️ 健康因子过低，停止循环');
      break;
    }
  }

  // 3. 统计RDNT收益
  const totalSupply = Number((await pool.getUserAccountData(wallet.address)).totalCollateralBase) / 1e8;
  const totalDebt = Number((await pool.getUserAccountData(wallet.address)).totalDebtBase) / 1e8;

  const supplyRDNT = totalSupply * 0.25; // 25% 存款激励
  const borrowRDNT = totalDebt * 0.30; // 30% 借款激励
  const totalRDNT = (supplyRDNT + borrowRDNT) * 2; // dLP 2x

  console.log('\\n--- RDNT收益预估 ---');
  console.log('年化RDNT奖励: $' + totalRDNT.toFixed(2));
  console.log('（假设RDNT价格稳定）');
}

radiantLoop(10000, 5);
\`\`\`

---

## 🎯 策略3：跨链套利

### 多链利率差异

不同链的Radiant市场利率不同：

\`\`\`javascript
// cross_chain_monitor.js
async function monitorCrossChainRates() {
  const chains = [
    { name: 'Arbitrum', rpc: process.env.ARBITRUM_RPC, pool: '0xF4B1486DD74D07706052A33d31d7c0AAFD0659E1' },
    { name: 'BSC', rpc: process.env.BSC_RPC, pool: '0xd50Cf00b6e600Dd036Ba8eF475677d816d6c4281' },
    { name: 'Base', rpc: process.env.BASE_RPC, pool: '0x...' }
  ];

  console.log('\\n跨链利率对比（USDC）：');
  console.log('----------------------------');

  for (const chain of chains) {
    const provider = new ethers.JsonRpcProvider(chain.rpc);
    const pool = new ethers.Contract(chain.pool, POOL_ABI, provider);

    const reserveData = await pool.getReserveData(USDC_ADDRESS);
    const supplyAPY = Number(reserveData.currentLiquidityRate) / 1e27 * 100;
    const borrowAPY = Number(reserveData.currentVariableBorrowRate) / 1e27 * 100;

    console.log(chain.name + ':');
    console.log('  存款APY: ' + supplyAPY.toFixed(2) + '%');
    console.log('  借款APY: ' + borrowAPY.toFixed(2) + '%');

    // 获取RDNT激励
    const rdntSupply = await getRDNTIncentive(chain.name, 'supply');
    const rdntBorrow = await getRDNTIncentive(chain.name, 'borrow');

    console.log('  RDNT存款激励: ' + rdntSupply.toFixed(2) + '%');
    console.log('  RDNT借款激励: ' + rdntBorrow.toFixed(2) + '%');
    console.log('');
  }
}

setInterval(monitorCrossChainRates, 3600000); // 每小时检查
\`\`\`

**套利策略**：
\`\`\`
发现：
• Arbitrum借款APY：6%，RDNT激励30%
• BSC存款APY：8%，RDNT激励25%

操作：
1. 在Arbitrum存ETH抵押
2. 在Arbitrum借USDC（享受30% RDNT）
3. 跨链USDC到BSC
4. 在BSC存USDC（享受8%利息+25% RDNT）

净收益：8% + 25% - 6% + 30% = 57%（扣除跨链成本）
\`\`\`

---

## 🎯 策略4：RDNT代币管理

### Claim与复投

\`\`\`javascript
// claim_rdnt.js
const MULTI_FEE_DISTRIBUTION = '0x76ba3eC5f5adBf1C58c91e86502232317EeA72dE';

async function claimRDNT() {
  const distributor = new ethers.Contract(
    MULTI_FEE_DISTRIBUTION,
    DISTRIBUTOR_ABI,
    wallet
  );

  // 1. 查询可领取RDNT
  const claimable = await distributor.earnedBalances(wallet.address);

  console.log('可领取RDNT: ' + ethers.formatEther(claimable.totalVesting));

  if (Number(claimable.totalVesting) > 0) {
    // 2. 领取（有锁定期）
    const tx = await distributor.getReward();
    await tx.wait();

    console.log('✅ 已领取RDNT（线性解锁90天）');

    // 3. 处理RDNT
    const rdntPrice = await getRDNTPrice();
    const value = Number(ethers.formatEther(claimable.totalVesting)) * rdntPrice;

    console.log('奖励价值: $' + value.toFixed(2));

    // 选择1：卖出换稳定币
    if (value > 100) {
      console.log('💡 建议：部分卖出锁定利润');
      await swapRDNTToUSDC(claimable.totalVesting / 2n); // 卖50%
    }

    // 选择2：复投为dLP
    console.log('💡 建议：50%复投为dLP，提升收益');
    await addToDLP(claimable.totalVesting / 2n);
  }
}

async function addToDLP(rdntAmount) {
  // 将RDNT添加到RDNT-ETH LP
  const ethValue = (Number(rdntAmount) * await getRDNTPrice()) / await getETHPrice();

  await addLiquidityToRDNTETH(rdntAmount, ethers.parseEther(ethValue.toString()));

  console.log('✅ 已添加到dLP，提升收益倍数');
}

setInterval(claimRDNT, 604800000); // 每周检查
\`\`\`

---

## ⚠️ 风险管理

### 1. **RDNT代币价格风险**

**问题**：高APY主要来自RDNT奖励，代币价格波动影响实际收益

\`\`\`
场景：
• 存款$10K，年化RDNT奖励$5K
• RDNT价格在领取前下跌50%
• 实际收益：$2.5K（不是$5K）

应对策略：
• 定期Claim并卖出（锁定利润）
• 对冲：做空RDNT（高级策略）
• 分散：不超过总资产30%投入Radiant
\`\`\`

---

### 2. **dLP锁定期风险**

\`\`\`
dLP锁定90天：
• 无法提前解锁
• RDNT价格暴跌时，LP价值缩水
• 无常损失风险（RDNT-ETH LP）

风险缓解：
• 仅锁定必要的5%（不要过度）
• 监控RDNT/ETH比价
• 提前规划unlock时间
\`\`\`

---

### 3. **智能合约风险**

**Radiant审计情况**：
- ✅ PeckShield审计（2023）
- ✅ BlockSec审计（2023）
- ⚠️ 2024-01发生闪电贷攻击（损失$4.5M，已补偿）

**风险提示**：
- 早期项目，合约风险高于Aave/Compound
- 建议分散投资，不要All-in

---

## 💰 收益计算实例

### 场景1：保守dLP挖矿（$10K）

\`\`\`
本金：$10,000 USDC

策略：
• 存入Radiant
• 锁定$500 dLP（5%）
• 无循环借贷

年收益：
• 存款利息：3%
• RDNT激励：25%
• dLP 2x加成：25% × 2 = 50%
• 总APY：53%

年收益：$10,000 × 53% = $5,300

dLP LP收益：$500 × 20%（RDNT-ETH LP费用）= $100

总收益：$5,400（54% APY）

⚠️ 风险：RDNT价格波动
\`\`\`

---

### 场景2：激进循环（$10K，5次循环）

\`\`\`
本金：$10,000 USDC

循环5次后：
• 总存款：$50,000
• 总借款：$40,000
• 锁定dLP：$2,500（5% of 50K）

年收益：
• 存款RDNT：$50,000 × 25% × 2（dLP）= $25,000
• 借款RDNT：$40,000 × 30% × 2（dLP）= $24,000
• 总RDNT奖励：$49,000
• 借款成本：$40,000 × 6% = -$2,400
• 净RDNT收益：$46,600

dLP LP收益：$2,500 × 20% = $500

总收益：$47,100（471% APY）

⚠️ 极高风险：
• RDNT价格下跌50% → 收益腰斩
• 健康因子低（~1.25），易清算
\`\`\`

---

## 📋 执行检查清单

### 阶段1：准备（2-3天）

- [ ] 理解dLP机制
- [ ] 准备dLP资金（本金的5%）
- [ ] 选择主链（Arbitrum推荐）
- [ ] 准备至少$2K资金

### 阶段2：dLP锁仓（1周）

- [ ] 添加RDNT-ETH流动性
- [ ] 锁定dLP（90天）
- [ ] 存入主资产（USDC/ETH）
- [ ] 验证收益倍数（2x）

### 阶段3：循环优化（2-4周）

- [ ] 小额测试循环借贷（3次）
- [ ] 监控健康因子（>1.5）
- [ ] 对比有无循环的收益差异
- [ ] 每周Claim RDNT

### 阶段4：风险对冲（长期）

- [ ] 定期卖出RDNT锁定利润
- [ ] 关注RDNT价格（设置止损）
- [ ] 监控项目TVL变化
- [ ] 参与治理（持有RDNT）

---

## 🎯 总结

**Radiant代币激励挖息**的核心是**高RDNT奖励+dLP加成**：

| 优势 | 说明 |
|------|------|
| ✅ **超高APY** | RDNT激励20-80% |
| ✅ **dLP翻倍** | 锁仓LP收益×2 |
| ✅ **跨链借贷** | LayerZero技术 |
| ✅ **循环友好** | 借款也有高激励 |
| ⚠️ **代币风险** | RDNT价格波动大 |
| ⚠️ **早期项目** | 智能合约风险高 |

**推荐路径**：
1. 新手：单纯存款+dLP（APY 30-50%）
2. 进阶：3次循环借贷（APY 60-100%）
3. 专家：5次循环+跨链套利（APY 100-200%）

**风险提醒**：收益主要来自RDNT代币，务必监控价格，定期锁定利润！ 🛡️
`,

  steps: [
    {
      step_number: 1,
      title: '理解dLP机制',
      description:
        '学习Radiant的dLP（动态流动性）机制，理解为何需锁定5%的RDNT-ETH LP代币，计算dLP成本和LP收益，准备至少$2K本金+5%的dLP资金。',
      time_minutes: 150
    },
    {
      step_number: 2,
      title: 'dLP准备与锁仓',
      description:
        '在Uniswap V3添加RDNT-ETH流动性（本金5%），将LP代币锁定90天激活dLP资格，验证收益倍数为2x，理解解锁时间规划。',
      time_minutes: 120
    },
    {
      step_number: 3,
      title: '首次存款挖矿',
      description:
        '选择主链（Arbitrum/BSC/Base），存入USDC/ETH到Radiant借贷池，验证RDNT激励APY（20-80%），对比有无dLP的收益差异，首次Claim RDNT。',
      time_minutes: 90
    },
    {
      step_number: 4,
      title: '循环借贷测试',
      description:
        '小额测试3次循环借贷（借款也有30% RDNT激励），监控健康因子保持>1.5，计算循环后总APY（可达100-200%），理解RDNT价格波动对收益的影响。',
      time_minutes: 180
    },
    {
      step_number: 5,
      title: 'RDNT代币管理',
      description:
        '每周Claim RDNT奖励（线性解锁90天），部分卖出锁定利润（50%），部分复投为dLP提升倍数，监控RDNT价格设置止损（下跌30%减仓），关注项目TVL和审计报告。',
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

    console.log('✅ Radiant 代币激励挖息创建成功!');
    console.log('   ID: ' + response.data.data.id);
    console.log('   Slug: ' + response.data.data.slug);
    console.log('   访问: http://localhost:3000/strategies/' + response.data.data.slug);
  } catch (error) {
    console.error('❌ 创建失败:', error.response?.data || error.message);
  }
}

main();
