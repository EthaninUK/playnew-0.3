const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

const GUIDE_CONFIG = {
  title: 'Morpho 优化借贷收益',
  slug: 'morpho-optimized-lending',
  summary:
    'Morpho借贷优化协议攻略：P2P匹配提升收益率（存款+30-50%、借款成本-20-30%）、Aave/Compound资金池无缝切换、零清算风险继承、MORPHO代币激励、Rewards分配优化、Vault策略自动化、MetaMorpho策略金库、历史APY 8-35%、以太坊/Base部署、成本$2K起。',

  category: 'lending',
  category_l1: 'yield',
  category_l2: '借贷挖息',

  difficulty_level: 3,
  risk_level: 2,
  apy_min: 8,
  apy_max: 35,

  threshold_capital: '2,000–100,000 USD（以太坊Gas较高，建议$5K+）',
  threshold_capital_min: 2000,
  time_commitment: '初始设置2–4小时，自动运行无需日常维护，每月检查1次',
  time_commitment_minutes: 10,
  threshold_tech_level: 'intermediate',

  content: `> **适用人群**：DeFi进阶用户、追求最优利率、理解借贷协议运作、希望获得比Aave/Compound更高收益的投资者
> **阅读时间**：≈ 40–55 分钟
> **关键词**：Morpho / P2P Matching / Lending Optimizer / Aave / Compound / MetaMorpho / Vault / MORPHO Token / Yield Optimization

---

## 📊 TL;DR（60秒速览）

**核心思路**：Morpho在Aave/Compound之上构建P2P匹配层，提升存款收益、降低借款成本

| 对比 | Aave直接存款 | Morpho-Aave | 提升 |
|------|------------|------------|------|
| **USDC存款APY** | 3% | 4.5% | +50% ⬆️ |
| **ETH借款APY** | 4% | 3.2% | -20% ⬇️ |
| **清算风险** | 有 | 继承Aave（同等安全） | ✅ |
| **Gas成本** | 标准 | 稍高（+10-20%） | ⚠️ |

**Morpho工作原理**：

\`\`\`
传统Aave：
存款人 → Aave Pool → 借款人
（Pool模式，利率折中）

Morpho优化：
存款人A ←→ 借款人B（P2P匹配，利率最优）
    ↓
未匹配资金 → Aave Pool（保底）
\`\`\`

**收益来源**：
1. **P2P匹配溢价**：存款利率提升30-50%
2. **MORPHO代币奖励**：额外2-5% APY
3. **Vault策略**：专业团队管理，APY +5-10%
4. **安全性继承**：使用Aave/Compound底层，零额外清算风险

---

## 🏗️ Morpho核心机制

### 什么是Morpho？

**Morpho**是借贷优化层（Lending Optimizer），不是独立协议：
- **底层**：Aave V3 / Compound V3
- **优化**：P2P匹配 + Pool备用
- **安全**：继承底层协议安全性

**关键创新**：解决Pool模式的利率折中问题

\`\`\`
Aave Pool模式问题：
• 存款人获得平均利率（低于借款利率）
• 借款人支付平均利率（高于存款利率）
• 协议赚取利差

示例：
├─ 借款人支付：5% APY
├─ 存款人获得：3% APY
└─ Aave协议收入：2%（利差）

Morpho优化：
├─ P2P匹配：存款人和借款人直接匹配
├─ 匹配利率：4%（中间值）
├─ 存款人：3% → 4%（+33%）
└─ 借款人：5% → 4%（-20%）
\`\`\`

---

### Morpho-Aave vs Morpho-Compound

| 特性 | Morpho-Aave | Morpho-Compound |
|------|------------|----------------|
| **底层协议** | Aave V3 | Compound V3 |
| **支持资产** | 多样（20+） | 主流（10+） |
| **TVL** | $800M | $200M |
| **匹配率** | 60-80% | 50-70% |
| **Gas成本** | 较高 | 中等 |
| **推荐度** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

**推荐**：优先使用**Morpho-Aave**（流动性更好）

---

## 🎯 策略1：P2P存款优化

### 直接存款 vs Morpho存款

\`\`\`javascript
// morpho_supply.js
const { ethers } = require('ethers');

const MORPHO_AAVE = '0x33333aea097c193e66081E930c33020272b33333';
const USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';

const MORPHO_ABI = [
  'function supply(address underlying, uint256 amount, address onBehalf, uint256 maxIterations)',
  'function supplyBalance(address underlying, address user) view returns (uint256)',
  'function withdraw(address underlying, uint256 amount, address receiver) returns (uint256)'
];

async function supplyToMorpho() {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const morpho = new ethers.Contract(MORPHO_AAVE, MORPHO_ABI, wallet);
  const usdc = new ethers.Contract(USDC_ADDRESS, ERC20_ABI, wallet);

  // 1. 存入10,000 USDC
  const amount = ethers.parseUnits('10000', 6);

  console.log('步骤1：授权Morpho...');
  await usdc.approve(MORPHO_AAVE, amount);

  console.log('步骤2：存入USDC到Morpho-Aave...');
  const tx = await morpho.supply(
    USDC_ADDRESS,
    amount,
    wallet.address,
    4 // maxIterations：P2P匹配尝试次数（4次足够）
  );
  await tx.wait();

  console.log('✅ 已存入 10,000 USDC');

  // 2. 查询余额和收益
  const balance = await morpho.supplyBalance(USDC_ADDRESS, wallet.address);
  console.log('当前余额: ' + ethers.formatUnits(balance, 6) + ' USDC');

  // 3. 查询APY
  const apy = await getMorphoAPY(USDC_ADDRESS);
  console.log('当前APY: ' + apy.toFixed(2) + '%');
  console.log('（比Aave直接存款高约30-50%）');
}

async function getMorphoAPY(asset) {
  // 通过Morpho API获取实时APY
  const response = await fetch('https://api.morpho.org/markets');
  const markets = await response.json();

  const market = markets.find(m => m.underlying === asset);
  return market.supplyAPY * 100;
}

supplyToMorpho();
\`\`\`

---

### P2P匹配率监控

**匹配率**决定收益提升幅度：

\`\`\`
匹配率100%：
• 全部资金P2P匹配
• APY提升最大（+50%）

匹配率50%：
• 50%资金P2P匹配（高利率）
• 50%资金在Aave Pool（标准利率）
• APY提升中等（+25%）

匹配率0%：
• 无P2P匹配
• 等同于直接用Aave
• APY提升0%
\`\`\`

**查询匹配率代码**：

\`\`\`javascript
// check_matching_rate.js
async function checkMatchingRate() {
  const morpho = new ethers.Contract(MORPHO_AAVE, MORPHO_ABI, provider);

  // 获取市场数据
  const market = await morpho.market(USDC_ADDRESS);

  const totalSupplyP2P = Number(market.totalSupplyP2P);
  const totalSupplyPool = Number(market.totalSupplyPool);
  const totalSupply = totalSupplyP2P + totalSupplyPool;

  const matchingRate = (totalSupplyP2P / totalSupply) * 100;

  console.log('\\nUSDC市场匹配率: ' + matchingRate.toFixed(2) + '%');
  console.log('P2P供应: $' + (totalSupplyP2P / 1e6).toFixed(2) + 'M');
  console.log('Pool供应: $' + (totalSupplyPool / 1e6).toFixed(2) + 'M');

  if (matchingRate > 70) {
    console.log('✅ 高匹配率，收益优化显著');
  } else if (matchingRate > 40) {
    console.log('⚠️ 中等匹配率，收益优化一般');
  } else {
    console.log('❌ 低匹配率，考虑其他市场');
  }
}

checkMatchingRate();
\`\`\`

---

## 🎯 策略2：MetaMorpho策略金库

### 什么是MetaMorpho？

**MetaMorpho**是Morpho的**策略金库**（Vault）：
- **自动化**：专业团队管理资金分配
- **多市场**：跨多个Morpho市场优化
- **再平衡**：自动调整资产配置

**传统Morpho**：手动选择单一市场（如USDC）
**MetaMorpho**：一键存入，算法自动分配至多个最优市场

---

### MetaMorpho Vault示例

\`\`\`
Steakhouse USDC Vault：
• 管理团队：Steakhouse Financial
• 策略：跨5个USDC市场动态再平衡
• 历史APY：6–12%（比单一市场高2-4%）
• TVL：$150M
\`\`\`

**存入MetaMorpho代码**：

\`\`\`javascript
// metamorpho_vault.js
const METAMORPHO_USDC_VAULT = '0xBEEF01735c132Ada46AA9aA4c54623cAA92A64CB';

const VAULT_ABI = [
  'function deposit(uint256 assets, address receiver) returns (uint256 shares)',
  'function withdraw(uint256 assets, address receiver, address owner) returns (uint256 shares)',
  'function totalAssets() view returns (uint256)',
  'function convertToAssets(uint256 shares) view returns (uint256)'
];

async function depositToMetaMorpho() {
  const vault = new ethers.Contract(METAMORPHO_USDC_VAULT, VAULT_ABI, wallet);
  const usdc = new ethers.Contract(USDC_ADDRESS, ERC20_ABI, wallet);

  // 1. 存入10,000 USDC
  const amount = ethers.parseUnits('10000', 6);

  await usdc.approve(METAMORPHO_USDC_VAULT, amount);

  const tx = await vault.deposit(amount, wallet.address);
  await tx.wait();

  console.log('✅ 已存入MetaMorpho Vault');

  // 2. 获取份额
  const shares = await vault.balanceOf(wallet.address);
  const assets = await vault.convertToAssets(shares);

  console.log('持有份额: ' + ethers.formatUnits(shares, 6));
  console.log('对应资产: ' + ethers.formatUnits(assets, 6) + ' USDC');

  // 3. 查询Vault策略
  const totalAssets = await vault.totalAssets();
  console.log('\\nVault总资产: $' + (Number(totalAssets) / 1e6).toFixed(2) + 'M');
}

depositToMetaMorpho();
\`\`\`

---

### 热门MetaMorpho Vault对比

| Vault名称 | 资产 | APY | 风险 | TVL |
|----------|------|-----|------|-----|
| **Steakhouse USDC** | USDC | 6–12% | 低 | $150M |
| **Gauntlet USDC Core** | USDC | 5–10% | 极低 | $200M |
| **Re7 WETH** | WETH | 3–8% | 低 | $80M |
| **Moonwell Flagship** | 多资产 | 8–15% | 中 | $50M |

**推荐**：稳健选择**Steakhouse USDC**或**Gauntlet**

---

## 🎯 策略3：借款成本优化

### Morpho借款优势

\`\`\`
Aave直接借款：
• 借10,000 USDC
• 年利率：5%
• 年成本：$500

Morpho-Aave借款：
• 借10,000 USDC
• P2P匹配利率：4%（降低20%）
• 年成本：$400
• 节省：$100
\`\`\`

---

### 借款代码

\`\`\`javascript
// morpho_borrow.js
async function borrowFromMorpho() {
  const morpho = new ethers.Contract(MORPHO_AAVE, MORPHO_ABI, wallet);

  // 1. 先存入抵押品（ETH）
  const collateralAmount = ethers.parseEther('5'); // 5 ETH

  await morpho.supply(
    WETH_ADDRESS,
    collateralAmount,
    wallet.address,
    4,
    { value: collateralAmount }
  );

  console.log('✅ 已存入5 ETH作为抵押品');

  // 2. 借出USDC
  const borrowAmount = ethers.parseUnits('8000', 6); // 借$8000（保守）

  const tx = await morpho.borrow(
    USDC_ADDRESS,
    borrowAmount,
    wallet.address,
    wallet.address,
    4 // maxIterations
  );
  await tx.wait();

  console.log('✅ 已借出 8,000 USDC');

  // 3. 查询借款APY
  const borrowAPY = await getMorphoBorrowAPY(USDC_ADDRESS);
  console.log('借款APY: ' + borrowAPY.toFixed(2) + '%');
  console.log('（比Aave直接借款低约20-30%）');
}

async function getMorphoBorrowAPY(asset) {
  const response = await fetch('https://api.morpho.org/markets');
  const markets = await response.json();

  const market = markets.find(m => m.underlying === asset);
  return market.borrowAPY * 100;
}

borrowFromMorpho();
\`\`\`

---

## 🎯 策略4：MORPHO代币激励

### MORPHO分配机制

\`\`\`
MORPHO总供应：10亿枚
流通比例：~30%

奖励分配：
• 用户激励：40%（存款/借款奖励）
• 团队/投资人：30%
• 国库：20%
• 生态：10%

每季度释放：约1000万枚
\`\`\`

---

### Claim奖励

\`\`\`javascript
// claim_morpho_rewards.js
const REWARDS_DISTRIBUTOR = '0x3B14E5C73e0A56D607A8688098326fD4b4292135';

async function claimMorphoRewards() {
  const distributor = new ethers.Contract(
    REWARDS_DISTRIBUTOR,
    REWARDS_ABI,
    wallet
  );

  // 1. 查询可领取奖励
  const claimable = await distributor.getUserUnclaimedRewards(
    [USDC_ADDRESS],
    wallet.address
  );

  console.log('可领取MORPHO: ' + ethers.formatEther(claimable) + ' MORPHO');

  if (Number(claimable) > 0) {
    // 2. 领取奖励
    const tx = await distributor.claim(
      [USDC_ADDRESS],
      wallet.address
    );
    await tx.wait();

    console.log('✅ 已领取MORPHO奖励');

    // 3. 选择处理方式
    const morphoPrice = await getMorphoPrice();
    const value = Number(ethers.formatEther(claimable)) * morphoPrice;

    console.log('\\n奖励价值: $' + value.toFixed(2));

    if (value > 100) {
      console.log('💡 建议：卖出换稳定币');
    } else {
      console.log('💡 建议：累积到$100再卖出（节省Gas）');
    }
  }
}

setInterval(claimMorphoRewards, 86400000); // 每天检查
\`\`\`

---

## 🎯 策略5：跨市场套利

### 监控多市场利差

Morpho支持多个资产市场，利率差异创造套利机会：

\`\`\`javascript
// cross_market_monitor.js
async function monitorCrossMarkets() {
  const markets = [
    { asset: 'USDC', address: USDC_ADDRESS },
    { asset: 'USDT', address: USDT_ADDRESS },
    { asset: 'DAI', address: DAI_ADDRESS }
  ];

  console.log('\\n稳定币市场利率对比：');
  console.log('----------------------------');

  for (const market of markets) {
    const supplyAPY = await getMorphoAPY(market.address);
    const borrowAPY = await getMorphoBorrowAPY(market.address);
    const spread = supplyAPY - borrowAPY;

    console.log(market.asset + ':');
    console.log('  存款APY: ' + supplyAPY.toFixed(2) + '%');
    console.log('  借款APY: ' + borrowAPY.toFixed(2) + '%');
    console.log('  利差: ' + spread.toFixed(2) + '%');

    if (spread < -2) {
      console.log('  🚨 负利差套利机会！');
      console.log('  策略：借' + market.asset + '，存其他稳定币');
    }
  }
}

setInterval(monitorCrossMarkets, 3600000); // 每小时检查
\`\`\`

**套利示例**：
\`\`\`
发现：
• USDC存款APY：4.5%
• DAI借款APY：3.8%
• 负利差：-0.7%

操作：
1. 存入$10,000 USDC（赚4.5%）
2. 借出$8,000 DAI（成本3.8%）
3. 兑换DAI→USDC再存入
4. 净收益：(4.5% × $18,000) - (3.8% × $8,000) = $506
\`\`\`

---

## ⚠️ 风险管理

### 1. **智能合约风险**

**Morpho审计情况**：
- ✅ Spearbit审计（2022）
- ✅ Certora形式化验证
- ✅ Immunefi漏洞赏金（最高$1M）
- ✅ 运行2年无重大事故

**风险缓解**：
- 分散资金（不超过总资产30%）
- 优先使用TVL大的Vault
- 定期检查审计报告

---

### 2. **清算风险继承**

Morpho**继承底层协议清算机制**：

\`\`\`
在Morpho-Aave借款：
• 清算阈值：与Aave相同
• 清算罚金：与Aave相同
• 健康因子：与Aave相同

无额外清算风险 ✅
\`\`\`

**监控脚本**：

\`\`\`javascript
// health_factor_monitor.js
async function monitorHealthFactor() {
  // Morpho使用Aave的健康因子
  const aavePool = new ethers.Contract(AAVE_POOL, AAVE_ABI, provider);

  const userData = await aavePool.getUserAccountData(wallet.address);
  const healthFactor = Number(ethers.formatUnits(userData.healthFactor, 18));

  console.log('当前健康因子: ' + healthFactor.toFixed(2));

  if (healthFactor < 1.5) {
    console.log('⚠️ 健康因子过低，发送报警');
    await sendTelegramAlert('Morpho健康因子: ' + healthFactor.toFixed(2));
  }
}

setInterval(monitorHealthFactor, 300000); // 每5分钟检查
\`\`\`

---

## 💰 收益计算实例

### 场景1：USDC存款优化（$20K）

\`\`\`
本金：$20,000 USDC

Aave直接存款：
• APY：3%
• 年收益：$600

Morpho-Aave存款：
• P2P匹配APY：4.5%（+50%）
• MORPHO奖励：0.5%
• 总APY：5%
• 年收益：$1,000
• 额外收益：$400（+66%）

Gas成本：
• 存入：~$30
• 领取奖励：~$20/次
• 年Gas：~$50
• 净额外收益：$350
\`\`\`

---

### 场景2：MetaMorpho Vault（$50K）

\`\`\`
本金：$50,000 USDC

Steakhouse USDC Vault：
• 策略APY：8%（动态优化）
• MORPHO奖励：1%
• 总APY：9%
• 年收益：$4,500

对比Aave：
• Aave APY：3%
• Aave收益：$1,500
• 额外收益：$3,000（+200%）

风险：略高于直接Aave（策略风险）
\`\`\`

---

## 📋 执行检查清单

### 阶段1：理解与测试（1-2天）

- [ ] 理解Morpho P2P匹配机制
- [ ] 对比Morpho vs Aave/Compound利率
- [ ] 在测试网模拟存款
- [ ] 准备至少$2K资金（以太坊Gas较高）

### 阶段2：首次存款（1天）

- [ ] 选择资产（推荐USDC/USDT）
- [ ] 存入Morpho-Aave
- [ ] 查询P2P匹配率
- [ ] 设置MORPHO奖励提醒

### 阶段3：Vault优化（1-2周）

- [ ] 研究MetaMorpho Vault策略
- [ ] 对比Vault vs 直接存款APY
- [ ] 小额测试Vault（$1K）
- [ ] 规模化部署（$5K-50K）

### 阶段4：进阶策略（长期）

- [ ] 开发跨市场监控脚本
- [ ] 每月Claim MORPHO奖励
- [ ] 参与Morpho治理（持有MORPHO）
- [ ] 关注新Vault发布

---

## 🎯 总结

**Morpho优化借贷**的核心是**P2P匹配提效**：

| 优势 | 说明 |
|------|------|
| ✅ **收益提升** | 存款APY +30-50% |
| ✅ **借款优化** | 成本降低20-30% |
| ✅ **安全性** | 继承Aave/Compound |
| ✅ **自动化** | MetaMorpho Vault托管 |
| ⚠️ **Gas成本** | 以太坊主网较高 |
| ⚠️ **合约风险** | 额外智能合约层 |

**推荐路径**：
1. 新手：直接Morpho-Aave存款（APY +30-50%）
2. 进阶：MetaMorpho Vault（APY 6-12%）
3. 专家：跨市场套利+借款优化（APY 10-20%）

**最佳实践**：使用MetaMorpho Vault实现"一键最优"，无需手动管理！ 🚀
`,

  steps: [
    {
      step_number: 1,
      title: '理解机制与对比',
      description:
        '学习Morpho P2P匹配原理，对比Morpho-Aave vs 直接Aave的利率差异（存款APY提升30-50%），在官网模拟计算收益，准备至少$2K资金（以太坊Gas成本较高）。',
      time_minutes: 120
    },
    {
      step_number: 2,
      title: '首次存款测试',
      description:
        '选择主流资产（USDC/USDT），存入Morpho-Aave协议，查询P2P匹配率（>60%为佳），对比实际APY与Aave直接存款，设置MORPHO奖励Claim提醒。',
      time_minutes: 60
    },
    {
      step_number: 3,
      title: 'MetaMorpho Vault研究',
      description:
        '研究Steakhouse/Gauntlet等主流Vault策略，对比Vault APY vs 直接存款，小额测试Vault存款（$1K），理解Vault再平衡机制和风险。',
      time_minutes: 150
    },
    {
      step_number: 4,
      title: 'MORPHO代币管理',
      description:
        '每周检查MORPHO奖励累积，当价值>$100时Claim避免Gas浪费，选择复投或出售换稳定币，监控MORPHO代币价格和市场情绪。',
      time_minutes: 30
    },
    {
      step_number: 5,
      title: '规模化与优化',
      description:
        '增加存款至$5K-50K，分散到2-3个MetaMorpho Vault降低风险，开发跨市场利差监控脚本，测试借款成本优化（降低20-30%），参与Morpho治理。',
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

    console.log('✅ Morpho 优化借贷收益创建成功!');
    console.log('   ID: ' + response.data.data.id);
    console.log('   Slug: ' + response.data.data.slug);
    console.log('   访问: http://localhost:3000/strategies/' + response.data.data.slug);
  } catch (error) {
    console.error('❌ 创建失败:', error.response?.data || error.message);
  }
}

main();
