const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

const GUIDE_CONFIG = {
  title: 'Venus 稳定币借贷循环',
  slug: 'venus-stable-loop-strategy',
  summary:
    'Venus Protocol稳定币循环借贷策略：BNB Chain原生借贷协议、VAI稳定币铸造套利、XVS挖矿奖励最大化、稳定币循环放大收益（最高15x杠杆）、动态利率优化、清算保护、跨池套利、Prime会员加速、历史APY 10-40%、BSC低Gas成本$0.1-1。',

  category: 'lending',
  category_l1: 'yield',
  category_l2: '借贷挖息',

  difficulty_level: 3,
  risk_level: 3,
  apy_min: 10,
  apy_max: 40,

  threshold_capital: '500–50,000 USD（BSC低门槛，$1K起步最佳）',
  threshold_capital_min: 500,
  time_commitment: '初始设置2–3小时，每周检查循环健康度1次，调仓每月1次',
  time_commitment_minutes: 30,
  threshold_tech_level: 'intermediate',

  content: `> **适用人群**：BSC生态用户、熟悉循环借贷、追求高收益、能承受清算风险的DeFi玩家
> **阅读时间**：≈ 40–50 分钟
> **关键词**：Venus Protocol / VAI / XVS / BNB Chain / Looping / Collateral Factor / Prime / Liquidation / BSC / Yield Farming

---

## 📊 TL;DR（60秒速览）

**核心思路**：在Venus存入稳定币，循环借出再存入，放大收益至10-15倍

| 策略 | 年化收益 | 杠杆倍数 | 风险等级 |
|------|---------|---------|---------|
| **单纯存款** | 5–10% | 1x | ⭐ 低 |
| **3次循环** | 15–25% | 3x | ⭐⭐ 中 |
| **10次循环** | 25–40% | 10x | ⭐⭐⭐ 中高 |
| **VAI铸造套利** | 8–20%（机会性） | 可变 | ⭐⭐⭐ 中高 |

**收益来源**：
1. **存款利息**：存入USDT/BUSD获得vToken（自动计息）
2. **XVS奖励**：存款和借款都获得XVS代币激励
3. **循环放大**：借稳定币→存入→再借→再存（重复10次）
4. **VAI套利**：铸造VAI稳定币，在Pancake卖出获利

**Venus vs Aave/Compound**：

| 特性 | Venus (BSC) | Aave (ETH) | Compound (ETH) |
|------|------------|-----------|---------------|
| **Gas成本** | $0.1–1 ⭐⭐⭐⭐⭐ | $50–200 ⭐ | $30–150 ⭐⭐ |
| **抵押率** | 80% | 80–97% | 70–82.5% |
| **代币奖励** | XVS | 链代币 | COMP |
| **TVL** | $500M | $10B | $3B |
| **独特功能** | VAI稳定币 | E-Mode | 跳跃利率 |

---

## 🏗️ Venus Protocol核心机制

### 什么是Venus？

**Venus**是BNB Chain最大的借贷协议，特点：
- **原生BSC**：Gas极低（$0.1–1）
- **VAI稳定币**：协议原生稳定币（超额抵押）
- **Prime会员**：质押XVS获得额外奖励（APY +20–50%）

---

### vToken复利机制

\`\`\`
存入1000 USDT → 获得 50,000 vUSDT
（汇率：1 vUSDT = 0.02 USDT）

利息累积方式：
• 每个区块汇率上升
• 1年后：1 vUSDT = 0.022 USDT
• 赎回：50,000 × 0.022 = 1,100 USDT

无需手动复投，自动复利
\`\`\`

---

## 🎯 策略1：稳定币循环借贷

### 循环原理

\`\`\`
步骤1：存入 $10,000 USDT
       ↓
步骤2：借出 $8,000 USDT（80% LTV）
       ↓
步骤3：将 $8,000 再存入
       ↓
步骤4：借出 $6,400 USDT（$8,000 × 80%）
       ↓
步骤5：重复10次...

最终结果：
• 总存款：$50,000（5倍杠杆）
• 总借款：$40,000
• 净资产：$10,000（不变）

收益放大：
• 存款APY：8%
• 借款APY：6%
• 净APY：8% × 5 - 6% × 4 = 16%
• XVS奖励：+10%
• 总APY：26%
\`\`\`

---

### 自动化循环代码

\`\`\`javascript
// venus_loop.js
const { ethers } = require('ethers');

const VENUS_COMPTROLLER = '0xfD36E2c2a6789Db23113685031d7F16329158384';
const VUSDT = '0xfD5840Cd36d94D7229439859C0112a4185BC0255';
const USDT_ADDRESS = '0x55d398326f99059fF775485246999027B3197955';

const COMPTROLLER_ABI = [
  'function enterMarkets(address[] calldata vTokens) returns (uint[])',
  'function getAccountLiquidity(address account) view returns (uint, uint, uint)'
];

const VTOKEN_ABI = [
  'function mint(uint mintAmount) returns (uint)',
  'function borrow(uint borrowAmount) returns (uint)',
  'function repayBorrow(uint repayAmount) returns (uint)',
  'function balanceOfUnderlying(address owner) returns (uint)'
];

async function venusLoop(initialAmount, loops = 10) {
  const provider = new ethers.JsonRpcProvider(process.env.BSC_RPC);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const comptroller = new ethers.Contract(VENUS_COMPTROLLER, COMPTROLLER_ABI, wallet);
  const vUSDT = new ethers.Contract(VUSDT, VTOKEN_ABI, wallet);
  const usdt = new ethers.Contract(USDT_ADDRESS, ERC20_ABI, wallet);

  // 1. 开启USDT市场（允许用vUSDT作为抵押品）
  console.log('步骤1：开启市场...');
  const tx1 = await comptroller.enterMarkets([VUSDT]);
  await tx1.wait();

  // 2. 首次存入
  console.log('\\n步骤2：首次存入 ' + initialAmount + ' USDT...');
  await usdt.approve(VUSDT, ethers.parseUnits(initialAmount.toString(), 18));
  await vUSDT.mint(ethers.parseUnits(initialAmount.toString(), 18));

  let currentAmount = initialAmount;

  // 3. 循环借贷
  for (let i = 0; i < loops; i++) {
    console.log('\\n--- 循环 ' + (i + 1) + ' ---');

    // 获取可借额度
    const liquidity = await comptroller.getAccountLiquidity(wallet.address);
    const availableToBorrow = Number(liquidity[1]) / 1e18;

    if (availableToBorrow < 100) {
      console.log('可借额度不足，停止循环');
      break;
    }

    // 借出80%（保守）
    const borrowAmount = availableToBorrow * 0.8;
    console.log('借出: ' + borrowAmount.toFixed(2) + ' USDT');

    await vUSDT.borrow(ethers.parseUnits(borrowAmount.toFixed(2), 18));

    // 再次存入
    console.log('存入: ' + borrowAmount.toFixed(2) + ' USDT');
    await usdt.approve(VUSDT, ethers.parseUnits(borrowAmount.toFixed(2), 18));
    await vUSDT.mint(ethers.parseUnits(borrowAmount.toFixed(2), 18));

    currentAmount += borrowAmount;
  }

  // 4. 最终统计
  const totalSupply = await vUSDT.balanceOfUnderlying(wallet.address);
  const totalBorrow = await vUSDT.borrowBalanceStored(wallet.address);

  console.log('\\n--- 循环完成 ---');
  console.log('总存款: $' + (Number(totalSupply) / 1e18).toFixed(2));
  console.log('总借款: $' + (Number(totalBorrow) / 1e18).toFixed(2));
  console.log('杠杆倍数: ' + (Number(totalSupply) / initialAmount).toFixed(2) + 'x');
}

// 执行：$10,000初始资金，循环10次
venusLoop(10000, 10);
\`\`\`

---

## 🎯 策略2：VAI稳定币套利

### VAI机制

**VAI**是Venus原生稳定币：
- **超额抵押**：存入BNB/USDT等，铸造VAI
- **铸造利率**：2–5%（浮动）
- **挂钩$1**：通过套利机制维持

---

### 套利场景

\`\`\`
场景1：VAI溢价（$1.02）

操作：
1. 存入 $10,000 BNB 到 Venus
2. 铸造 8,000 VAI（免费）
3. 在Pancake卖出 VAI → BUSD
4. 获得 8,160 BUSD（$8,000 × 1.02）
5. 买回 8,000 VAI 归还（当价格回落至$1）
6. 净收益：$160（2%）

场景2：VAI折价（$0.98）

操作：
1. 在Pancake买入 10,000 VAI（花费$9,800）
2. 归还Venus借款
3. 提取抵押品
4. 节省$200铸造成本
\`\`\`

---

### VAI套利代码

\`\`\`javascript
// vai_arbitrage.js
const VAI_CONTROLLER = '0x004065D34C6b18cE4370ced1CeBDE94865DbFAFE';
const VAI_ADDRESS = '0x4BD17003473389A42DAF6a0a729f6Fdb328BbBd7';

async function vaiArbitrage() {
  // 1. 获取VAI价格（从Pancake）
  const vaiPrice = await getVAIPrice();

  console.log('当前VAI价格: $' + vaiPrice.toFixed(4));

  if (vaiPrice > 1.015) {
    console.log('🚨 VAI溢价，铸造并卖出');

    // 铸造VAI
    const vaiController = new ethers.Contract(VAI_CONTROLLER, VAI_CONTROLLER_ABI, wallet);
    const mintAmount = ethers.parseUnits('10000', 18);

    await vaiController.mintVAI(mintAmount);
    console.log('✅ 已铸造 10,000 VAI');

    // 在Pancake卖出VAI换BUSD
    await swapOnPancake(VAI_ADDRESS, BUSD_ADDRESS, mintAmount);
    console.log('✅ 已卖出VAI，获得溢价');

  } else if (vaiPrice < 0.985) {
    console.log('🚨 VAI折价，买入并归还');

    // 在Pancake买入VAI
    const buyAmount = ethers.parseUnits('10000', 18);
    await swapOnPancake(BUSD_ADDRESS, VAI_ADDRESS, buyAmount);

    // 归还VAI借款
    const vaiController = new ethers.Contract(VAI_CONTROLLER, VAI_CONTROLLER_ABI, wallet);
    await vaiController.repayVAI(buyAmount);

    console.log('✅ 已归还VAI，节省成本');
  } else {
    console.log('❌ 无套利机会，价格接近$1');
  }
}

async function getVAIPrice() {
  // 从Pancake Swap获取VAI/BUSD价格
  const PANCAKE_ROUTER = '0x10ED43C718714eb63d5aA57B78B54704E256024E';
  const router = new ethers.Contract(PANCAKE_ROUTER, ROUTER_ABI, provider);

  const amounts = await router.getAmountsOut(
    ethers.parseUnits('1', 18), // 1 VAI
    [VAI_ADDRESS, BUSD_ADDRESS]
  );

  return Number(amounts[1]) / 1e18;
}

setInterval(vaiArbitrage, 300000); // 每5分钟检查
\`\`\`

---

## 🎯 策略3：XVS挖矿最大化

### XVS分配机制

\`\`\`
XVS总供应：3000万枚
每日释放：~2,054 XVS（约$15K）

分配比例：
• 存款用户：40%
• 借款用户：40%
• VAI铸造：20%

权重：按市场大小分配
\`\`\`

---

### Prime会员加速

**Prime会员**：质押至少1,000 XVS（90天锁定）

\`\`\`
普通用户：
• 存款APY：8%
• XVS奖励：6%
• 总APY：14%

Prime会员：
• 存款APY：8%
• XVS奖励：6%
• Prime加速：+4%
• 总APY：18%（提升28%）
\`\`\`

**激活Prime代码**：

\`\`\`javascript
// activate_prime.js
const PRIME_CONTRACT = '0xBbCD063efE506c3D42a0Fa2dB5C08430288C71FC';

async function activatePrime() {
  const xvsToken = new ethers.Contract(XVS_ADDRESS, ERC20_ABI, wallet);
  const prime = new ethers.Contract(PRIME_CONTRACT, PRIME_ABI, wallet);

  // 1. 检查XVS余额
  const xvsBalance = await xvsToken.balanceOf(wallet.address);
  const xvsAmount = Number(ethers.formatEther(xvsBalance));

  if (xvsAmount < 1000) {
    console.log('❌ 需要至少1000 XVS才能激活Prime');
    return;
  }

  // 2. 质押XVS
  console.log('质押 1000 XVS...');
  await xvsToken.approve(PRIME_CONTRACT, ethers.parseEther('1000'));
  await prime.stake(ethers.parseEther('1000'));

  console.log('✅ Prime已激活，90天后可解锁');
  console.log('预计APY提升: +3–5%');
}
\`\`\`

---

## 🎯 策略4：跨池套利

### Venus多池策略

Venus有**隔离池**功能（Isolated Pools）：

\`\`\`
主池（Core Pool）：
• USDT/BUSD/BNB
• 高流动性，低收益（5–10%）

隔离池（Isolated Pools）：
• GameFi代币（RACA/FLOKI）
• DeFi代币（ALPACA/BSW）
• 低流动性，高收益（20–50%）
\`\`\`

**跨池套利策略**：

\`\`\`
1. 在主池借USDT（6% APY）
2. 转移到隔离池存USDT（25% APY）
3. 净收益：25% - 6% = 19%

风险：隔离池Supply Cap较小，可能满池
\`\`\`

---

### 跨池监控脚本

\`\`\`javascript
// cross_pool_monitor.js
async function monitorPools() {
  const pools = [
    { name: 'Core Pool', comptroller: '0xfD36E2c2a6789Db23113685031d7F16329158384' },
    { name: 'GameFi Pool', comptroller: '0x1b43ea8622e76627B81665B1eCeBB4867566B963' },
    { name: 'DeFi Pool', comptroller: '0x3344417c9360b963ca93A4e8305361AEde340Ab9' }
  ];

  for (const pool of pools) {
    const comptroller = new ethers.Contract(pool.comptroller, COMPTROLLER_ABI, provider);

    // 获取USDT市场数据
    const vUSDT = await comptroller.markets(VUSDT);
    const supplyRate = vUSDT.supplyRatePerBlock;
    const borrowRate = vUSDT.borrowRatePerBlock;

    const supplyAPY = (Number(supplyRate) / 1e18 * 20 * 60 * 24 * 365 * 100);
    const borrowAPY = (Number(borrowRate) / 1e18 * 20 * 60 * 24 * 365 * 100);

    console.log('\\n' + pool.name + ':');
    console.log('  存款APY: ' + supplyAPY.toFixed(2) + '%');
    console.log('  借款APY: ' + borrowAPY.toFixed(2) + '%');
    console.log('  净利差: ' + (supplyAPY - borrowAPY).toFixed(2) + '%');
  }
}

setInterval(monitorPools, 3600000); // 每小时检查
\`\`\`

---

## ⚠️ 风险管理

### 1. **循环清算风险**

**问题**：高杠杆循环，价格波动易清算

\`\`\`
示例：
存入 $50,000 USDT（10次循环）
借出 $40,000 USDT
清算阈值：80%

风险场景：
• USDT临时脱锚至 $0.98
• 抵押品价值：$50,000 × 0.98 = $49,000
• 借款价值：$40,000（不变）
• 抵押率：49,000 / 40,000 = 122.5%

如果清算阈值是125%，接近清算！
\`\`\`

**防护措施**：

\`\`\`javascript
// loop_health_monitor.js
async function monitorLoopHealth() {
  const liquidity = await comptroller.getAccountLiquidity(wallet.address);

  const collateral = Number(liquidity[1]) / 1e18; // 剩余可借额度
  const shortfall = Number(liquidity[2]) / 1e18; // 负债缺口

  if (shortfall > 0) {
    console.log('🚨 已进入清算区域！');
    await emergencyUnwind();
  } else {
    const buffer = collateral / (collateral + 100) * 100; // 安全缓冲
    console.log('安全缓冲: ' + buffer.toFixed(2) + '%');

    if (buffer < 10) {
      console.log('⚠️ 缓冲不足，部分解除循环');
      await partialUnwind(0.3); // 解除30%循环
    }
  }
}

async function emergencyUnwind() {
  // 紧急平仓：提取存款→归还借款
  const borrowBalance = await vUSDT.borrowBalanceStored(wallet.address);

  // 提取vUSDT赎回USDT
  await vUSDT.redeemUnderlying(borrowBalance);

  // 归还借款
  await vUSDT.repayBorrow(borrowBalance);

  console.log('✅ 紧急平仓完成');
}
\`\`\`

---

### 2. **BSC网络风险**

**问题**：BSC中心化程度高，曾发生停机

**应对**：
- 不要投入全部资金（最多30-50%）
- 分散到其他链（以太坊/Polygon）
- 监控BSC验证者状态

---

## 💰 收益计算实例

### 场景1：保守循环（$5K，3次循环）

\`\`\`
本金：$5,000 USDT

循环3次后：
• 总存款：$15,000（3x杠杆）
• 总借款：$10,000
• 净资产：$5,000

年收益：
• 存款收益：$15,000 × 8% = $1,200
• 借款成本：$10,000 × 6% = -$600
• XVS奖励：$15,000 × 6% = $900
• 净收益：$1,500（30% APY）

Gas成本：~$5（BSC便宜）
风险：低（仅3x杠杆）
\`\`\`

---

### 场景2：激进循环（$10K，10次循环）

\`\`\`
本金：$10,000 USDT

循环10次后：
• 总存款：$50,000（5x杠杆）
• 总借款：$40,000
• 净资产：$10,000

年收益：
• 存款收益：$50,000 × 8% = $4,000
• 借款成本：$40,000 × 6% = -$2,400
• XVS奖励：$50,000 × 6% = $3,000
• Prime加速：$50,000 × 4% = $2,000
• 净收益：$6,600（66% APY）

⚠️ 风险：高（清算缓冲仅5-10%）
\`\`\`

---

## 📋 执行检查清单

### 阶段1：准备（1天）

- [ ] 准备BSC钱包（MetaMask/Trust Wallet）
- [ ] 获取BNB作为Gas（$5–10）
- [ ] 理解Venus循环机制
- [ ] 在测试网模拟操作

### 阶段2：首次循环（1-2天）

- [ ] 存入初始资金（$500–5K）
- [ ] 执行3-5次循环
- [ ] 监控安全缓冲（>15%）
- [ ] Claim XVS奖励

### 阶段3：优化（1-2周）

- [ ] 测试VAI套利机会
- [ ] 对比不同池利率
- [ ] 考虑激活Prime（需1000 XVS）
- [ ] 开发自动监控脚本

### 阶段4：规模化（长期）

- [ ] 增加循环次数（5-10次）
- [ ] 跨池分散（主池+隔离池）
- [ ] 定期Claim并复投XVS
- [ ] 参与Venus治理

---

## 🎯 总结

**Venus稳定币循环**的核心是**BSC低成本高杠杆**：

| 优势 | 说明 |
|------|------|
| ✅ **Gas超低** | $0.1–1，适合小资金 |
| ✅ **高杠杆** | 可达10-15x |
| ✅ **XVS奖励** | 额外6–10% APY |
| ✅ **Prime加速** | 质押XVS再+3–5% |
| ⚠️ **清算风险** | 高杠杆易清算 |
| ⚠️ **BSC风险** | 网络中心化 |

**推荐路径**：
1. 新手：3次循环（15–25% APY）
2. 进阶：5-7次循环（25–35% APY）
3. 专家：10次循环+Prime（35–50% APY）

**风险提醒**：循环次数越多，清算风险越高，务必监控安全缓冲！ 🛡️
`,

  steps: [
    {
      step_number: 1,
      title: '准备与测试',
      description:
        '准备BSC钱包并获取BNB作为Gas费（$5-10），在Venus官网学习vToken机制和循环借贷原理，在BSC测试网模拟3次循环操作，准备至少$500-1K初始资金。',
      time_minutes: 120
    },
    {
      step_number: 2,
      title: '首次循环部署',
      description:
        '存入USDT/BUSD到Venus主池，执行3-5次循环借贷（借款→存入→再借），保持安全缓冲>15%，设置每日监控脚本检查健康度，首次Claim XVS奖励。',
      time_minutes: 90
    },
    {
      step_number: 3,
      title: 'VAI套利测试',
      description:
        '监控VAI价格偏离$1的幅度，当VAI>$1.015时铸造并在Pancake卖出，当VAI<$0.985时买入归还节省成本，计算实际套利收益（扣除Gas和滑点）。',
      time_minutes: 120
    },
    {
      step_number: 4,
      title: 'XVS挖矿优化',
      description:
        '累积XVS奖励至1000枚以上，激活Prime会员获得APY加速（+3-5%），对比主池和隔离池利率差异，选择高收益池进行跨池套利。',
      time_minutes: 150
    },
    {
      step_number: 5,
      title: '高级循环与自动化',
      description:
        '增加循环次数至7-10次提升杠杆至5x，部署自动监控脚本（安全缓冲<10%时自动平仓），定期Claim并复投XVS，分散到多个池降低风险。',
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

    console.log('✅ Venus 稳定币借贷循环创建成功!');
    console.log('   ID: ' + response.data.data.id);
    console.log('   Slug: ' + response.data.data.slug);
    console.log('   访问: http://localhost:3000/strategies/' + response.data.data.slug);
  } catch (error) {
    console.error('❌ 创建失败:', error.response?.data || error.message);
  }
}

main();
