const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

const GUIDE_CONFIG = {
  title: 'Gearbox 杠杆化收益挖矿',
  slug: 'gearbox-leveraged-yield',
  summary:
    'Gearbox Protocol杠杆化DeFi策略：Credit Account信用账户、最高10倍杠杆、组合式DeFi乐高（Curve/Convex/Yearn）、单笔交易多协议路由、无清算瀑布、GEAR代币激励、策略金库自动化、风险隔离设计、历史APY 15-60%、以太坊/Arbitrum部署、成本$3K起。',

  category: 'lending',
  category_l1: 'yield',
  category_l2: '借贷挖息',

  difficulty_level: 4,
  risk_level: 4,
  apy_min: 15,
  apy_max: 60,

  threshold_capital: '3,000–50,000 USD（杠杆放大，建议$5K+）',
  threshold_capital_min: 3000,
  time_commitment: '初始设置4–6小时，策略运行自动化，每周检查风险1次',
  time_commitment_minutes: 60,
  threshold_tech_level: 'advanced',

  content: `> **适用人群**：DeFi高级用户、理解杠杆机制、熟悉Curve/Convex等协议、追求高收益并能承受高风险的专业玩家
> **阅读时间**：≈ 50–65 分钟
> **关键词**：Gearbox / Credit Account / Leverage / Composable DeFi / Curve / Convex / Yearn / GEAR Token / Risk Isolation / Automated Strategies

---

## 📊 TL;DR（60秒速览）

**核心思路**：在Gearbox开设信用账户，获得10倍杠杆，一键部署到Curve/Convex等高收益协议

| 策略 | 基础APY | 杠杆倍数 | 杠杆后APY | 风险等级 |
|------|---------|---------|----------|---------|
| **Curve 3pool LP** | 5% | 5x | 25% | ⭐⭐ 中 |
| **Convex stETH** | 8% | 8x | 64% | ⭐⭐⭐ 中高 |
| **Yearn USDC Vault** | 6% | 10x | 60% | ⭐⭐⭐⭐ 高 |

**Gearbox vs 传统杠杆对比**：

| 特性 | Gearbox | Aave循环借贷 | 中心化交易所 |
|------|---------|-------------|-------------|
| **最大杠杆** | 10x | 3-5x | 20x+ |
| **清算机制** | 部分清算 | 全部清算 | 强平 |
| **协议组合** | ✅ 支持 | ❌ 需手动 | ❌ 仅限合约 |
| **资金隔离** | ✅ Credit Account | ❌ | ❌ |
| **Gas成本** | 中等 | 高（多次交易） | 低 |

**核心创新**：
1. **Credit Account（信用账户）**：资金隔离，爆仓不影响其他仓位
2. **组合式操作**：一笔交易可跨多个DeFi协议
3. **部分清算**：清算时仅平仓部分头寸，而非全部
4. **白名单协议**：仅支持经审计的DeFi协议（降低风险）

---

## 🏗️ Gearbox Protocol核心机制

### 什么是Gearbox？

**Gearbox**是杠杆化DeFi协议：
- **定位**：为DeFi协议提供杠杆层
- **模式**：Credit Account + 白名单协议
- **创新**：组合式DeFi乐高（Composable Leverage）

---

### Credit Account（信用账户）

\`\`\`
传统借贷：
用户钱包 ← 借款 ← 协议
（借款直接到钱包，用户自由支配）

Gearbox模式：
用户钱包 → 抵押品 → Credit Account（信用账户）
                         ↓
                      借款 × 杠杆
                         ↓
                   仅能用于白名单DeFi协议

优势：
• 资金隔离（爆仓不影响主钱包）
• 协议安全（仅白名单协议可用）
• 组合操作（多协议一键部署）
\`\`\`

**示例**：
\`\`\`
步骤1：存入 $10,000 USDC 到 Credit Account
步骤2：选择5倍杠杆（借 $40,000）
步骤3：总资金 $50,000 自动部署到 Curve 3pool
步骤4：获得 Curve LP → 质押到 Convex → 获得 CRV+CVX 奖励

全程仅1笔交易完成！
\`\`\`

---

### 支持的DeFi协议（白名单）

| 协议类型 | 支持协议 | 策略APY |
|---------|---------|---------|
| **DEX** | Uniswap V3, Curve | 2–10% |
| **收益聚合器** | Yearn, Convex | 5–30% |
| **流动性质押** | Lido (stETH) | 3–8% |
| **稳定币** | Curve 3pool, Frax | 3–12% |

**最优策略**：Convex（Curve LP质押，APY最高）

---

## 🎯 策略1：Curve + Convex杠杆挖矿

### 策略流程

\`\`\`
目标：用$10K本金，10倍杠杆挖Curve+Convex

步骤：
1. 存入 $10,000 USDC 到 Gearbox
2. 开设 Credit Account（10倍杠杆）
3. 借款 $90,000 → 总计 $100,000
4. 一键部署：
   ├─ 添加流动性到 Curve 3pool
   ├─ 获得 Curve LP代币
   ├─ 质押LP到 Convex
   └─ 开始赚取 CRV + CVX + GEAR 奖励

收益计算：
• Curve基础APY：5%
• Convex增强APY：+3%（CRV/CVX奖励）
• GEAR激励：+2%
• 总APY：10%
• 杠杆后：10% × 10 = 100%（扣除借款成本）
• 借款成本：8%（浮动）
• 净APY：100% - 8% × 9 = 28%
\`\`\`

---

### 部署代码

\`\`\`javascript
// gearbox_convex.js
const { ethers } = require('ethers');

const GEARBOX_ROUTER = '0xA5aFC5e41b64b00E1FC1230C47FDd54183e00c00';
const USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';

const ROUTER_ABI = [
  'function openCreditAccount(uint256 amount, address onBehalfOf, uint16 leverageFactor, uint16 referralCode)',
  'function executeMulticall(address creditAccount, bytes[] calldata calls)',
  'function closeCreditAccount(address to, bytes[] calldata calls)'
];

async function deployGearboxConvex() {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const router = new ethers.Contract(GEARBOX_ROUTER, ROUTER_ABI, wallet);
  const usdc = new ethers.Contract(USDC_ADDRESS, ERC20_ABI, wallet);

  // 1. 开设Credit Account（10倍杠杆）
  console.log('步骤1：开设Credit Account...');

  const depositAmount = ethers.parseUnits('10000', 6); // $10K
  const leverageFactor = 1000; // 10倍杠杆（100 = 1x, 1000 = 10x）

  await usdc.approve(GEARBOX_ROUTER, depositAmount);

  const tx1 = await router.openCreditAccount(
    depositAmount,
    wallet.address,
    leverageFactor,
    0 // referral code
  );

  const receipt1 = await tx1.wait();
  const creditAccount = extractCreditAccountAddress(receipt1); // 从事件中提取

  console.log('✅ Credit Account已开设: ' + creditAccount);
  console.log('总资金: $100,000（$10K本金 + $90K借款）');

  // 2. 组合操作：Curve添加流动性 → Convex质押
  console.log('\\n步骤2：部署到Curve+Convex...');

  const calls = [
    // Call 1: 添加流动性到Curve 3pool
    encodeCurveAddLiquidity(ethers.parseUnits('100000', 6)),

    // Call 2: 获得的Curve LP质押到Convex
    encodeConvexStake()
  ];

  const tx2 = await router.executeMulticall(creditAccount, calls);
  await tx2.wait();

  console.log('✅ 已部署到Curve+Convex');
  console.log('开始赚取: CRV + CVX + GEAR 奖励');

  // 3. 查询预期收益
  const baseAPY = 10; // Curve+Convex基础APY
  const gearAPY = 2; // GEAR激励
  const totalAPY = baseAPY + gearAPY;
  const leveragedAPY = totalAPY * 10;
  const borrowCost = 8 * 9; // 借款成本
  const netAPY = leveragedAPY - borrowCost;

  console.log('\\n预期收益：');
  console.log('基础APY: ' + totalAPY + '%');
  console.log('杠杆后APY: ' + leveragedAPY + '%');
  console.log('借款成本: ' + borrowCost + '%');
  console.log('净APY: ' + netAPY + '%');
  console.log('年收益: $' + (10000 * netAPY / 100).toFixed(2));
}

function encodeCurveAddLiquidity(amount) {
  // Curve 3pool添加流动性编码
  const CURVE_3POOL = '0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7';
  const iface = new ethers.Interface([
    'function add_liquidity(uint256[3] amounts, uint256 min_mint_amount)'
  ]);

  return iface.encodeFunctionData('add_liquidity', [
    [amount, 0, 0], // 仅添加USDC（index 1）
    0 // min_mint_amount
  ]);
}

function encodeConvexStake() {
  // Convex质押编码
  const CONVEX_BOOSTER = '0xF403C135812408BFbE8713b5A23a04b3D48AAE31';
  const iface = new ethers.Interface([
    'function deposit(uint256 pid, uint256 amount, bool stake)'
  ]);

  return iface.encodeFunctionData('deposit', [
    9, // 3pool的pid
    ethers.MaxUint256, // 全部质押
    true
  ]);
}

deployGearboxConvex();
\`\`\`

---

## 🎯 策略2：stETH杠杆质押

### 策略原理

\`\`\`
ETH质押APY：3–5%
杠杆倍数：8x
杠杆后APY：24–40%
借款成本：~15%（ETH借款较贵）
净APY：9–25%
\`\`\`

**优势**：
- stETH流动性好（Curve池深）
- 风险相对低（ETH相关性强）
- 无无常损失（单一资产）

---

### stETH策略代码

\`\`\`javascript
// gearbox_steth.js
async function deployStETHStrategy() {
  const depositAmount = ethers.parseEther('5'); // 5 ETH
  const leverageFactor = 800; // 8倍杠杆

  // 1. 开设Credit Account
  const creditAccount = await openCreditAccount(depositAmount, leverageFactor);

  // 2. 组合操作：ETH → stETH → Curve LP
  const calls = [
    // Call 1: 兑换ETH为stETH（通过Lido）
    encodeLidoStake(ethers.parseEther('40')), // 5 ETH × 8 = 40 ETH

    // Call 2: 添加到Curve stETH池
    encodeCurveStETHPool(),

    // Call 3: 质押到Convex
    encodeConvexStake(25) // stETH池的pid
  ];

  await router.executeMulticall(creditAccount, calls);

  console.log('✅ stETH杠杆策略已部署');
  console.log('预期APY: 15–25%（扣除借款成本）');
}
\`\`\`

---

## 🎯 策略3：Yearn Vault杠杆

### Yearn自动化策略

**Yearn Vault优势**：
- 专业团队管理
- 自动复投
- 多策略优化

\`\`\`
Yearn USDC Vault基础APY：6%
杠杆倍数：10x
杠杆后：60%
借款成本：8% × 9 = 72%
净APY：-12%（亏损！）

⚠️ 关键：仅当Yearn APY >借款成本时才盈利
\`\`\`

**监控脚本**：

\`\`\`javascript
// yearn_monitor.js
async function monitorYearnAPY() {
  const YEARN_USDC_VAULT = '0xa354F35829Ae975e850e23e9615b11Da1B3dC4DE';

  // 获取Yearn Vault APY
  const response = await fetch('https://api.yearn.finance/v1/chains/1/vaults/all');
  const vaults = await response.json();

  const usdcVault = vaults.find(v => v.address.toLowerCase() === YEARN_USDC_VAULT.toLowerCase());
  const yearnAPY = usdcVault.apy.net_apy * 100;

  // 获取Gearbox借款利率
  const borrowAPY = await getGearboxBorrowAPY();

  console.log('\\nYearn杠杆监控：');
  console.log('Yearn USDC APY: ' + yearnAPY.toFixed(2) + '%');
  console.log('Gearbox借款APY: ' + borrowAPY.toFixed(2) + '%');

  const leverageFactor = 10;
  const leveragedAPY = yearnAPY * leverageFactor;
  const borrowCost = borrowAPY * (leverageFactor - 1);
  const netAPY = leveragedAPY - borrowCost;

  console.log('杠杆后APY: ' + leveragedAPY.toFixed(2) + '%');
  console.log('借款成本: ' + borrowCost.toFixed(2) + '%');
  console.log('净APY: ' + netAPY.toFixed(2) + '%');

  if (netAPY > 10) {
    console.log('\\n🚨 高收益机会！建议部署');
  } else if (netAPY > 0) {
    console.log('\\n⚠️ 微利，谨慎部署');
  } else {
    console.log('\\n❌ 亏损，不建议部署');
  }
}

setInterval(monitorYearnAPY, 86400000); // 每天检查
\`\`\`

---

## 🎯 策略4：GEAR代币挖矿

### GEAR激励机制

\`\`\`
GEAR总供应：100亿枚
流通比例：~20%

奖励分配：
• Credit Account用户：60%
• 流动性提供者：30%
• 国库：10%

激励强度：
• Convex策略：+2–3% APY
• Yearn策略：+1–2% APY
• stETH策略：+2–4% APY
\`\`\`

---

### Claim GEAR奖励

\`\`\`javascript
// claim_gear.js
const GEAR_DISTRIBUTOR = '0x...'; // GEAR分配合约

async function claimGEAR() {
  const distributor = new ethers.Contract(GEAR_DISTRIBUTOR, DISTRIBUTOR_ABI, wallet);

  // 1. 查询可领取GEAR
  const claimable = await distributor.claimable(wallet.address);

  console.log('可领取GEAR: ' + ethers.formatEther(claimable));

  if (Number(claimable) > 0) {
    // 2. 领取
    const tx = await distributor.claim();
    await tx.wait();

    console.log('✅ 已领取GEAR奖励');

    // 3. 处理GEAR（卖出或质押）
    const gearPrice = await getGEARPrice();
    const value = Number(ethers.formatEther(claimable)) * gearPrice;

    console.log('奖励价值: $' + value.toFixed(2));

    if (value > 50) {
      console.log('💡 建议：卖出换稳定币');
      await swapGEARToUSDC(claimable);
    } else {
      console.log('💡 建议：累积到$50再卖出');
    }
  }
}

setInterval(claimGEAR, 604800000); // 每周检查
\`\`\`

---

## ⚠️ 风险管理

### 1. **清算机制**

**Gearbox清算**：

\`\`\`
清算触发条件：
健康因子 = 总资产价值 / 总债务 < 1

清算过程：
1. 清算者触发清算
2. 部分平仓（先平最低效资产）
3. 归还债务
4. 剩余资产返还用户

清算罚金：
• 清算折扣：2–5%
• 清算者奖励：1%
• 协议费用：1%

优势：部分清算，非全部
\`\`\`

**示例**：
\`\`\`
Credit Account：
• 总资产：$100,000（Curve LP）
• 总债务：$90,000
• 健康因子：1.11

市场波动：
• Curve LP价值跌至 $95,000
• 健康因子：0.95（<1，触发清算）

清算：
• 平仓 $50,000 Curve LP
• 获得 $48,500（3%折扣）
• 归还债务 $48,500
• 剩余资产：$45,000 LP + $41,500 债务

用户损失：~$3,000（清算罚金+滑点）
\`\`\`

---

### 2. **健康因子监控**

\`\`\`javascript
// health_monitor.js
async function monitorHealth() {
  const CREDIT_MANAGER = '0x...';
  const creditManager = new ethers.Contract(CREDIT_MANAGER, CM_ABI, provider);

  setInterval(async () => {
    // 获取所有Credit Accounts
    const accounts = await getUserCreditAccounts(wallet.address);

    for (const account of accounts) {
      const healthFactor = await creditManager.calcCreditAccountHealthFactor(account);
      const hf = Number(healthFactor) / 10000; // Gearbox以basis point表示

      console.log('\\nCredit Account: ' + account);
      console.log('健康因子: ' + hf.toFixed(2));

      if (hf < 1.2) {
        console.log('🚨 健康因子过低！');
        await sendTelegramAlert('Gearbox HF: ' + hf.toFixed(2));

        if (hf < 1.05) {
          console.log('紧急平仓部分头寸');
          await partialUnwind(account, 0.3); // 平仓30%
        }
      }
    }
  }, 300000); // 每5分钟检查
}

async function partialUnwind(creditAccount, percentage) {
  // 部分平仓
  const calls = [
    // 提取部分LP
    encodeConvexWithdraw(percentage),

    // 移除Curve流动性
    encodeCurveRemoveLiquidity(),

    // 归还部分债务
    encodeRepayDebt()
  ];

  await router.executeMulticall(creditAccount, calls);
  console.log('✅ 已平仓 ' + (percentage * 100) + '%');
}
\`\`\`

---

### 3. **协议风险**

**白名单协议风险**：
- Curve池被攻击
- Convex智能合约漏洞
- Yearn策略失败

**风险缓解**：
- 分散到多个策略
- 定期检查审计报告
- 关注协议TVL变化

---

## 💰 收益计算实例

### 场景1：保守Curve策略（$10K，5x杠杆）

\`\`\`
本金：$10,000 USDC

策略：
• Curve 3pool + Convex
• 杠杆：5倍
• 总资金：$50,000

年收益：
• Curve+Convex APY：10%
• GEAR奖励：2%
• 总APY：12%
• 杠杆后：12% × 5 = 60%
• 借款成本：8% × 4 = 32%
• 净APY：28%

年收益：$10,000 × 28% = $2,800

Gas成本：~$150（开仓+平仓）
净收益：$2,650（26.5% APY）

风险：中等 ⭐⭐⭐
\`\`\`

---

### 场景2：激进stETH策略（$20K，8x杠杆）

\`\`\`
本金：$20,000（换算为ETH）

策略：
• stETH质押 + Curve
• 杠杆：8倍
• 总资金：$160,000

年收益：
• stETH APY：5%
• Curve增强：+3%
• GEAR奖励：+3%
• 总APY：11%
• 杠杆后：11% × 8 = 88%
• 借款成本：15% × 7 = 105%
• 净APY：-17%（亏损！）

⚠️ stETH借款成本太高，不推荐高杠杆
建议：降低杠杆至3-4倍
\`\`\`

---

## 📋 执行检查清单

### 阶段1：理解机制（2-3天）

- [ ] 学习Credit Account原理
- [ ] 理解组合式DeFi乐高
- [ ] 研究白名单协议（Curve/Convex/Yearn）
- [ ] 计算不同杠杆的盈亏平衡点

### 阶段2：小额测试（1周）

- [ ] 开设首个Credit Account（$1K–3K）
- [ ] 部署3-5倍杠杆Curve策略
- [ ] 监控健康因子（>1.5）
- [ ] Claim GEAR奖励

### 阶段3：策略优化（2-4周）

- [ ] 对比Curve/stETH/Yearn收益
- [ ] 测试不同杠杆倍数
- [ ] 开发健康因子监控脚本
- [ ] 参与GEAR治理

### 阶段4：规模化（长期）

- [ ] 增加杠杆至8-10倍（谨慎）
- [ ] 多策略分散（3个Credit Account）
- [ ] 自动化Claim并复投
- [ ] 定期检查白名单协议更新

---

## 🎯 总结

**Gearbox杠杆化挖矿**的核心是**组合式DeFi+高杠杆**：

| 优势 | 说明 |
|------|------|
| ✅ **最高10倍杠杆** | DeFi协议中杠杆最高 |
| ✅ **组合式操作** | 一笔交易跨多协议 |
| ✅ **资金隔离** | Credit Account保护主钱包 |
| ✅ **部分清算** | 非全部爆仓 |
| ⚠️ **高风险** | 杠杆放大波动 |
| ⚠️ **借款成本高** | 8–15% APY |

**推荐路径**：
1. 新手：3-5倍Curve策略（15–25% APY）
2. 进阶：5-8倍Convex策略（25–40% APY）
3. 专家：10倍多策略组合（40–60% APY）

**风险提醒**：杠杆越高，清算风险越大，务必监控健康因子！ 🛡️
`,

  steps: [
    {
      step_number: 1,
      title: '理解Credit Account机制',
      description:
        '学习Gearbox信用账户原理、资金隔离设计、白名单协议列表，理解组合式DeFi乐高（一笔交易跨多协议），计算不同杠杆倍数的盈亏平衡点，准备$3K以上资金。',
      time_minutes: 240
    },
    {
      step_number: 2,
      title: '首次Credit Account开设',
      description:
        '开设首个Credit Account并存入$1K-3K，选择3-5倍杠杆部署Curve 3pool+Convex策略，监控健康因子保持>1.5，理解部分清算机制。',
      time_minutes: 120
    },
    {
      step_number: 3,
      title: '策略对比与优化',
      description:
        '对比Curve/stETH/Yearn不同策略的基础APY，测试不同杠杆倍数（3x/5x/8x）的实际收益，监控借款利率变化（影响盈利性），每周Claim GEAR奖励。',
      time_minutes: 180
    },
    {
      step_number: 4,
      title: '健康因子自动监控',
      description:
        '部署脚本每5分钟检查健康因子，设置Telegram报警（HF<1.2时通知），开发自动平仓逻辑（HF<1.05时平仓30%），测试紧急平仓流程。',
      time_minutes: 150
    },
    {
      step_number: 5,
      title: '规模化与风险分散',
      description:
        '增加杠杆至8-10倍（需谨慎），开设2-3个Credit Account分散到不同策略，定期检查白名单协议更新（新策略机会），参与GEAR治理提案投票。',
      time_minutes: 240
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

    console.log('✅ Gearbox 杠杆化收益挖矿创建成功!');
    console.log('   ID: ' + response.data.data.id);
    console.log('   Slug: ' + response.data.data.slug);
    console.log('   访问: http://localhost:3000/strategies/' + response.data.data.slug);
  } catch (error) {
    console.error('❌ 创建失败:', error.response?.data || error.message);
  }
}

main();
