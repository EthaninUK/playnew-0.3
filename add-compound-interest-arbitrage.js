const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

const GUIDE_CONFIG = {
  title: 'Compound 利差套利',
  slug: 'compound-interest-arbitrage',
  summary:
    'Compound V3借贷利差套利策略：cToken复利机制、Supply Cap动态利率套利、COMP代币挖矿奖励、跨市场利差捕捉（以太坊/Polygon/Arbitrum）、清算收益、Governor治理挖矿、利率预言机套利、历史APY 6-30%、自动化复投脚本、成本$1K起。',

  category: 'lending',
  category_l1: 'yield',
  category_l2: '借贷挖息',

  difficulty_level: 3,
  risk_level: 3,
  apy_min: 6,
  apy_max: 30,

  threshold_capital: '1,000–100,000 USD（建议$10K+捕捉最佳利差）',
  threshold_capital_min: 1000,
  time_commitment: '初始设置3–5小时，每日检查利率1次，调仓每周1-2次',
  time_commitment_minutes: 20,
  threshold_tech_level: 'intermediate',

  content: `> **适用人群**：DeFi中级用户、熟悉利率套利、追求稳定收益、能捕捉市场利差机会的投资者
> **阅读时间**：≈ 40–55 分钟
> **关键词**：Compound V3 / cToken / Interest Rate / COMP Mining / Supply Cap / Liquidation / Governor / Utilization Rate / Cross-market Arbitrage

---

## 📊 TL;DR（60秒速览）

**核心思路**：利用Compound不同市场的利率差异，在低息市场借款，高息市场存款，赚取利差

| 策略 | 年化收益 | 风险等级 | 资金要求 |
|------|---------|---------|---------|
| **单纯存款挖COMP** | 3–8% | ⭐ 低 | $1K+ |
| **跨市场利差套利** | 8–15% | ⭐⭐ 中 | $5K+ |
| **Supply Cap套利** | 15–30% | ⭐⭐⭐ 中高 | $10K+ |
| **清算收益** | 10–50%（机会性） | ⭐⭐⭐⭐ 高 | $20K+ |

**收益来源**：
1. **存款利息**：存入资产赚取浮动利率（自动复利）
2. **COMP奖励**：存款/借款都获得COMP代币奖励
3. **利差套利**：借低息资产（如USDC 2%），存高息资产（如USDT 8%）
4. **Supply Cap套利**：资金池接近上限时，利率飙升（最高50%+）

**Compound vs Aave对比**：

| 特性 | Compound V3 | Aave V3 |
|------|------------|---------|
| **利率模型** | 动态跳跃（波动大） | 平滑曲线（稳定） |
| **代币奖励** | COMP（每日发放） | 链代币（ARB/OP） |
| **清算罚金** | 8% | 5–10% |
| **Gas优化** | 中等 | 优秀 |
| **TVL** | $3B | $10B |

---

## 🏗️ Compound V3核心机制

### cToken复利原理

**传统存款**：存入100 USDC，1年后本息101 USDC

**Compound cToken**：
\`\`\`
存入100 USDC → 获得 4,878 cUSDC
（汇率：1 cUSDC = 0.0205 USDC）

1年后：
• cUSDC余额不变：4,878
• 汇率上升：1 cUSDC = 0.0207 USDC
• 赎回：4,878 × 0.0207 = 101 USDC

核心：利息累积在汇率上，不是余额上
\`\`\`

---

### 利率跳跃模型（Jump Rate Model）

\`\`\`
利用率 = 借款总额 / 存款总额

利率公式：
• 0–80%：线性增长（2% → 10%）
• 80–100%：跳跃增长（10% → 150%）

示例（USDC市场）：
├─ 利用率 50%：存款APY 4%，借款APY 6%
├─ 利用率 85%：存款APY 12%，借款APY 18%
└─ 利用率 95%：存款APY 80%，借款APY 120%
\`\`\`

**套利机会**：当利用率>90%时，抢先存入获得超高利率！

---

## 🎯 策略1：跨市场利差套利

### 原理

不同链的Compound市场利率差异大，跨市场套利：

\`\`\`
以太坊市场：
• USDC存款APY：3%
• DAI借款APY：5%

Polygon市场：
• USDC存款APY：8%
• DAI借款APY：4%

套利路径：
1. 在以太坊借DAI（5%成本）
2. 跨链到Polygon
3. 兑换DAI→USDC
4. 在Polygon存USDC（8%收益）
5. 净收益：8% - 5% = 3%
\`\`\`

---

### 实战代码

\`\`\`javascript
// compound_arbitrage.js
const { ethers } = require('ethers');

const COMPOUND_USDC_ETH = '0xc3d688B66703497DAA19211EEdff47f25384cdc3'; // 以太坊
const COMPOUND_USDC_POLYGON = '0xF25212E676D1F7F89Cd72fFEe66158f541246445'; // Polygon

const COMET_ABI = [
  'function supply(address asset, uint amount)',
  'function withdraw(address asset, uint amount)',
  'function borrow(address asset, uint amount)',
  'function getSupplyRate(uint utilization) view returns (uint64)',
  'function getBorrowRate(uint utilization) view returns (uint64)',
  'function getUtilization() view returns (uint)'
];

async function crossMarketArbitrage() {
  // 1. 检查两个市场的利率
  const ethProvider = new ethers.JsonRpcProvider(process.env.ETH_RPC);
  const polyProvider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC);

  const ethComet = new ethers.Contract(COMPOUND_USDC_ETH, COMET_ABI, ethProvider);
  const polyComet = new ethers.Contract(COMPOUND_USDC_POLYGON, COMET_ABI, polyProvider);

  const ethSupplyRate = await ethComet.getSupplyRate(
    await ethComet.getUtilization()
  );
  const polySupplyRate = await polyComet.getSupplyRate(
    await polyComet.getUtilization()
  );

  const ethAPY = Number(ethSupplyRate) / 1e18 * 365 * 24 * 3600 * 100;
  const polyAPY = Number(polySupplyRate) / 1e18 * 365 * 24 * 3600 * 100;

  console.log('以太坊 USDC APY: ' + ethAPY.toFixed(2) + '%');
  console.log('Polygon USDC APY: ' + polyAPY.toFixed(2) + '%');

  // 2. 如果Polygon利率更高，套利
  if (polyAPY > ethAPY + 3) { // 利差>3%才值得（扣除跨链成本）
    console.log('\\n🚨 发现套利机会！利差: ' + (polyAPY - ethAPY).toFixed(2) + '%');

    // 从以太坊提取资金
    const ethWallet = new ethers.Wallet(process.env.PRIVATE_KEY, ethProvider);
    const ethCometWithSigner = ethComet.connect(ethWallet);

    const withdrawAmount = ethers.parseUnits('10000', 6);
    await ethCometWithSigner.withdraw(USDC_ADDRESS, withdrawAmount);
    console.log('✅ 已从以太坊提取 10,000 USDC');

    // 跨链到Polygon（通过官方桥或Stargate）
    await bridgeToPolygon(USDC_ADDRESS, withdrawAmount);

    // 在Polygon存入
    const polyWallet = new ethers.Wallet(process.env.PRIVATE_KEY, polyProvider);
    const polyCometWithSigner = polyComet.connect(polyWallet);

    await polyCometWithSigner.supply(USDC_ADDRESS, withdrawAmount);
    console.log('✅ 已在Polygon存入 10,000 USDC');

    console.log('\\n💰 预计年收益: $' + (10000 * (polyAPY - ethAPY) / 100).toFixed(2));
  } else {
    console.log('❌ 无套利机会，利差不足');
  }
}

setInterval(crossMarketArbitrage, 3600000); // 每小时检查
\`\`\`

---

## 🎯 策略2：Supply Cap套利

### 原理

Compound V3对每个资产设置**Supply Cap（存款上限）**：

\`\`\`
USDC Supply Cap：500M
当前存款：490M（98%满）

此时：
• 利用率极高（>95%）
• 存款APY飙升至 50–150%
• 但仅剩10M空间

套利策略：
实时监控Supply Cap使用率，接近100%时抢先存入
\`\`\`

---

### 监控与抢跑代码

\`\`\`javascript
// supply_cap_monitor.js
async function monitorSupplyCap() {
  const comet = new ethers.Contract(COMPOUND_USDC_ETH, COMET_ABI, provider);

  const SUPPLY_CAP = ethers.parseUnits('500000000', 6); // 500M USDC

  setInterval(async () => {
    // 获取当前总存款
    const totalSupply = await comet.totalSupply();
    const utilization = Number(totalSupply) / Number(SUPPLY_CAP) * 100;

    console.log('Supply Cap使用率: ' + utilization.toFixed(2) + '%');

    if (utilization > 95 && utilization < 99) {
      console.log('🚨 Supply Cap接近上限！');

      // 获取当前APY
      const supplyRate = await comet.getSupplyRate(await comet.getUtilization());
      const apy = Number(supplyRate) / 1e18 * 365 * 24 * 3600 * 100;

      console.log('当前存款APY: ' + apy.toFixed(2) + '%');

      if (apy > 30) {
        console.log('💰 APY超高，立即存入！');

        // 计算可存入额度
        const available = SUPPLY_CAP - totalSupply;
        const depositAmount = available > ethers.parseUnits('10000', 6)
          ? ethers.parseUnits('10000', 6)
          : available;

        // 使用高Gas抢跑
        const tx = await comet.supply(USDC_ADDRESS, depositAmount, {
          gasLimit: 500000,
          maxFeePerGas: ethers.parseUnits('200', 'gwei'), // 高Gas
          maxPriorityFeePerGas: ethers.parseUnits('50', 'gwei')
        });

        await tx.wait();
        console.log('✅ 抢跑成功，已存入');
      }
    }
  }, 60000); // 每分钟检查
}

monitorSupplyCap();
\`\`\`

---

## 🎯 策略3：COMP挖矿最大化

### COMP分配机制

\`\`\`
COMP总量：1000万枚
每日释放：~2,880 COMP（约$150K）

分配规则：
• 50%给存款用户
• 50%给借款用户

权重：按美元价值占比分配
\`\`\`

### 最优挖矿策略

\`\`\`javascript
// comp_mining_optimizer.js
async function optimizeCOMPMining() {
  // 1. 获取所有市场的COMP分配速度
  const markets = [
    { asset: 'USDC', supplyAPY: 3, borrowAPY: 5, compSupplyAPY: 2, compBorrowAPY: 3 },
    { asset: 'ETH', supplyAPY: 2, borrowAPY: 4, compSupplyAPY: 1.5, compBorrowAPY: 2.5 },
    { asset: 'WBTC', supplyAPY: 1, borrowAPY: 3, compSupplyAPY: 1, compBorrowAPY: 2 }
  ];

  // 2. 计算净APY（存款利息 + COMP奖励 - 借款成本）
  const strategies = [];

  for (const market of markets) {
    // 策略A：仅存款
    const strategyA = {
      name: '仅存' + market.asset,
      apy: market.supplyAPY + market.compSupplyAPY
    };

    // 策略B：存+借（循环）
    const netBorrowCost = market.borrowAPY - market.compBorrowAPY;
    const netSupplyGain = market.supplyAPY + market.compSupplyAPY;

    // 假设借出50%再存入
    const strategyB = {
      name: market.asset + '循环借贷',
      apy: netSupplyGain * 1.5 - netBorrowCost * 0.5
    };

    strategies.push(strategyA, strategyB);
  }

  // 3. 排序找最优策略
  strategies.sort((a, b) => b.apy - a.apy);

  console.log('\\n📊 COMP挖矿最优策略排名：');
  strategies.forEach((s, i) => {
    console.log((i + 1) + '. ' + s.name + ': ' + s.apy.toFixed(2) + '% APY');
  });

  return strategies[0];
}

optimizeCOMPMining();
\`\`\`

**典型结果**：
\`\`\`
1. USDC循环借贷: 12.5% APY
2. 仅存USDC: 5% APY
3. ETH循环借贷: 8.5% APY
\`\`\`

---

## 🎯 策略4：清算套利

### Compound清算机制

\`\`\`
清算条件：
借款价值 > 抵押品价值 × 清算因子

清算奖励：8%（固定）

示例：
抵押品：10 ETH（$20,000）
借款：$16,000 USDC
清算因子：80%

触发清算：ETH价格跌至 $2,000
（$16,000 > $20,000 × 80%）

清算者收益：
• 归还 $8,000 USDC（最多清算50%）
• 获得 4.32 ETH（价值$8,640，含8%奖励）
• 净收益：$640（8%）
\`\`\`

---

### 清算Bot代码

\`\`\`javascript
// liquidation_bot.js
async function scanLiquidations() {
  const comet = new ethers.Contract(COMPOUND_USDC_ETH, COMET_ABI, provider);

  // 获取所有借款账户（通过事件日志）
  const borrowers = await getAllBorrowers();

  for (const borrower of borrowers) {
    // 检查是否可清算
    const isLiquidatable = await comet.isLiquidatable(borrower);

    if (isLiquidatable) {
      console.log('🚨 发现可清算账户: ' + borrower);

      // 获取账户信息
      const collateral = await comet.collateralBalanceOf(borrower, WETH_ADDRESS);
      const borrowed = await comet.borrowBalanceOf(borrower);

      console.log('抵押品: ' + ethers.formatEther(collateral) + ' ETH');
      console.log('借款: ' + ethers.formatUnits(borrowed, 6) + ' USDC');

      // 计算清算收益
      const maxRepay = borrowed / 2n; // 最多清算50%
      const collateralSeized = maxRepay * 108n / 100n; // 含8%奖励

      const profit = Number(collateralSeized - maxRepay) / 1e6;

      if (profit > 100) { // 收益>$100才清算（扣除Gas）
        console.log('💰 预计收益: $' + profit.toFixed(2));

        // 执行清算
        await liquidate(borrower, maxRepay);
      }
    }
  }
}

async function liquidate(borrower, repayAmount) {
  const comet = new ethers.Contract(COMPOUND_USDC_ETH, COMET_ABI, wallet);

  // 授权USDC
  const usdc = new ethers.Contract(USDC_ADDRESS, ERC20_ABI, wallet);
  await usdc.approve(COMPOUND_USDC_ETH, repayAmount);

  // 清算
  const tx = await comet.absorb(borrower, [WETH_ADDRESS]);
  await tx.wait();

  console.log('✅ 清算成功');
}

setInterval(scanLiquidations, 60000); // 每分钟扫描
\`\`\`

---

## 🎯 策略5：治理挖矿（Governor Alpha）

### Compound治理机制

\`\`\`
治理权重：1 COMP = 1票

提案流程：
1. 提交提案（需100K COMP委托）
2. 投票期（3天）
3. 执行Timelock（2天）

治理奖励：
• 提案者：无奖励
• 投票者：获得"参与徽章"NFT
• 委托者：无直接奖励，但可影响协议参数
\`\`\`

**套利机会**：提案通过后，利率/奖励参数变化，提前布局

\`\`\`javascript
// governance_monitor.js
async function monitorGovernance() {
  const GOVERNOR_BRAVO = '0xc0Da02939E1441F497fd74F78cE7Decb17B66529';

  // 监听新提案
  const governor = new ethers.Contract(GOVERNOR_BRAVO, GOVERNOR_ABI, provider);

  governor.on('ProposalCreated', async (proposalId, proposer, description) => {
    console.log('\\n📜 新提案: ' + proposalId);
    console.log('描述: ' + description);

    // 分析提案影响
    if (description.includes('increase supply cap')) {
      console.log('🚨 Supply Cap将增加，利率可能下降');
      console.log('建议：提前存入锁定高利率');
    } else if (description.includes('COMP distribution')) {
      console.log('💰 COMP分配调整');
      console.log('建议：关注新激励市场');
    }
  });
}
\`\`\`

---

## ⚠️ 风险管理

### 1. **利率突变风险**

**问题**：跳跃利率模型导致借款成本暴涨

\`\`\`
场景：
存入 $10,000 USDC，借出 $8,000 USDC
初始借款APY：6%

突然大额提款 → 利用率从60% → 95%
借款APY飙升至：80%

年成本：$8,000 × 80% = $6,400（亏损）
\`\`\`

**应对**：
- 监控利用率，>85%时减少借款
- 设置利率上限报警（>20%立即还款）

---

### 2. **清算风险**

**Compound清算阈值较低**：
- USDC/DAI：80%
- ETH：82.5%
- WBTC：70%

**防护措施**：
\`\`\`javascript
async function checkLiquidationRisk() {
  const account = await comet.getAccountLiquidity(wallet.address);

  const collateralValue = Number(account.collateral) / 1e18;
  const borrowValue = Number(account.borrow) / 1e18;
  const liquidationThreshold = collateralValue * 0.8;

  const buffer = (liquidationThreshold - borrowValue) / borrowValue * 100;

  console.log('清算缓冲: ' + buffer.toFixed(2) + '%');

  if (buffer < 20) {
    console.log('⚠️ 接近清算，紧急还款');
    await emergencyRepay();
  }
}
\`\`\`

---

## 💰 收益计算实例

### 场景1：跨市场利差套利（$20K）

\`\`\`
本金：$20,000 USDC

操作：
• 以太坊借USDC（5% APY）
• 跨链到Polygon存USDC（10% APY）

年收益：
• 存款收益：$20,000 × 10% = $2,000
• 借款成本：$20,000 × 5% = -$1,000
• 跨链成本：$50（一次性）
• COMP奖励：$20,000 × 2% = $400
• 净收益：$1,350（6.75% APY）

风险：中等（跨链风险+清算风险）
\`\`\`

---

### 场景2：Supply Cap抢跑（$10K）

\`\`\`
本金：$10,000 USDC

场景：
• Supply Cap 98%满
• 利用率95%
• 存款APY飙升至80%

操作：
• 高Gas抢先存入（Gas $100）
• 持有7天后利用率恢复，APY降至5%
• 立即提取

收益：
• 7天高息：$10,000 × 80% × 7/365 = $153
• Gas成本：-$100
• 净收益：$53（7天5.3%）

年化收益：约276%（但机会稀少）
\`\`\`

---

## 📋 执行检查清单

### 阶段1：基础准备（1-2天）

- [ ] 理解Compound cToken机制
- [ ] 学习跳跃利率模型
- [ ] 在Goerli测试网模拟存借
- [ ] 准备至少$1K资金

### 阶段2：单市场挖矿（1周）

- [ ] 选择主链（以太坊/Polygon）
- [ ] 存入稳定币获取COMP
- [ ] 监控利用率变化
- [ ] 每日Claim COMP奖励

### 阶段3：利差套利（2-4周）

- [ ] 部署跨市场监控脚本
- [ ] 测试跨链桥（官方桥/Stargate）
- [ ] 执行首次利差套利
- [ ] 计算实际APY（扣除Gas）

### 阶段4：进阶策略（长期）

- [ ] 开发Supply Cap监控Bot
- [ ] 参与治理投票（持有COMP）
- [ ] 测试清算Bot（小额）
- [ ] 多市场分散部署

---

## 🎯 总结

**Compound利差套利**的核心是**捕捉利率波动**：

| 优势 | 说明 |
|------|------|
| ✅ **老牌协议** | 运行6年，安全性高 |
| ✅ **利率波动大** | 跳跃模型创造套利机会 |
| ✅ **COMP奖励** | 额外收益来源 |
| ✅ **跨链部署** | 多市场利差机会 |
| ⚠️ **利率突变** | 借款成本可能暴涨 |
| ⚠️ **清算阈值低** | 需谨慎控制杠杆 |

**推荐路径**：
1. 新手：单纯存款挖COMP（3–8% APY）
2. 进阶：跨市场利差套利（8–15% APY）
3. 专家：Supply Cap抢跑（15–30% APY）

**风险提醒**：跳跃利率模型波动大，务必监控利用率，设置自动还款！ 🛡️
`,

  steps: [
    {
      step_number: 1,
      title: '理解机制与测试',
      description:
        '学习Compound cToken复利原理、跳跃利率模型、Supply Cap机制，在测试网模拟存款和借款操作，理解清算阈值和健康因子计算，准备至少$1K资金。',
      time_minutes: 180
    },
    {
      step_number: 2,
      title: '单市场COMP挖矿',
      description:
        '选择主链（推荐Polygon降低Gas），存入USDC/ETH获取存款利息和COMP奖励，每日Claim COMP代币并复投或出售，监控利用率变化（警惕>85%）。',
      time_minutes: 90
    },
    {
      step_number: 3,
      title: '跨市场利差监控',
      description:
        '部署脚本监控以太坊/Polygon/Arbitrum三个市场的存借款利率，当利差>3%时执行套利（低息借款→跨链→高息存款），测试跨链桥速度和成本。',
      time_minutes: 240
    },
    {
      step_number: 4,
      title: 'Supply Cap抢跑',
      description:
        '实时监控各资产Supply Cap使用率，当接近95%时准备抢跑（高Gas优先），利用率飙升时存入获取超高APY（30-150%），利率恢复后及时提取。',
      time_minutes: 120
    },
    {
      step_number: 5,
      title: '治理与清算',
      description:
        '持有COMP参与治理投票，监控提案影响利率调整提前布局，开发清算Bot扫描可清算账户（可选，需$20K+资金），多市场分散风险。',
      time_minutes: 300
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

    console.log('✅ Compound 利差套利创建成功!');
    console.log('   ID: ' + response.data.data.id);
    console.log('   Slug: ' + response.data.data.slug);
    console.log('   访问: http://localhost:3000/strategies/' + response.data.data.slug);
  } catch (error) {
    console.error('❌ 创建失败:', error.response?.data || error.message);
  }
}

main();
