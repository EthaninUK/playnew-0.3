const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

const GUIDE_CONFIG = {
  title: '去中心化稳定币脱锚防御',
  slug: 'decentralized-stablecoin-defense',
  summary:
    '去中心化稳定币（DAI/FRAX/LUSD）脱锚防御策略：PSM机制套利、抵押率监控、清算瀑布预警、Stability Pool挖矿、Curve元池平衡、链上治理投票、储备金透明度分析、算法稳定币风险规避、多抵押品分散、历史危机复盘（UST/IRON），成本$500-$5K。',

  category: 'depeg-arbitrage',
  category_l1: 'arbitrage',
  category_l2: '稳定币脱锚',

  difficulty_level: 4,
  risk_level: 4,
  apy_min: 5,
  apy_max: 80,

  threshold_capital: '500–5,000 USD（多池流动性+Gas储备）',
  threshold_capital_min: 500,
  time_commitment: '初始学习40–60小时，日常监控每天2–4小时，治理投票每周1小时',
  time_commitment_minutes: 180,
  threshold_tech_level: 'intermediate',

  content: `> **适用人群**：DeFi中级玩家、理解超额抵押机制、关注去中心化稳定币治理、希望在协议层面参与脱锚防御的稳健投资者
> **阅读时间**：≈ 45–60 分钟
> **关键词**：DAI / FRAX / LUSD / PSM / Collateral Ratio / Stability Pool / Algorithmic Stablecoin / MakerDAO / Liquity / Peg Stability Module / Multi-Collateral / Governance

---

## 📊 TL;DR（60秒速览）

**核心思路**：去中心化稳定币脱锚时，通过协议原生机制（PSM套利、清算、稳定池）进行防御和套利

| 稳定币 | 挂钩机制 | 脱锚防御工具 | 历史最大脱锚 |
|--------|---------|------------|-------------|
| **DAI** | 超额抵押+PSM | PSM套利、DSR存款 | $1.03（2020-03） |
| **FRAX** | 部分算法+AMO | Curve AMO、回购销毁 | $0.97（2022-05） |
| **LUSD** | 150%超额抵押 | Stability Pool、赎回套利 | $1.15（2021-05） |
| **sUSD** | Synthetix抵押 | Debt Pool对冲 | $0.90（2022-06） |
| **UST** | 算法铸币 | ❌ 已归零 | $0.00（2022-05） |

**收益来源**：
1. **PSM套利**：DAI脱锚时，$1 USDC兑换$1.01 DAI（1%收益）
2. **赎回套利**：LUSD $1.10时，用$1价值ETH赎回$1.10 LUSD（10%收益）
3. **清算收益**：抵押率<150%时清算Vault，获得抵押品折扣
4. **Stability Pool**：Liquity稳定池提供LUSD，获得LQTY奖励

---

## 🏗️ 去中心化稳定币分类

### 1️⃣ **超额抵押型（最安全）**

#### **DAI（MakerDAO）**

\`\`\`
DAI生成机制：
1. 用户存入ETH/WBTC/USDC等抵押品
2. 按抵押率铸造DAI（如150%抵押率 = 存$150 ETH铸100 DAI）
3. 还DAI赎回抵押品

脱锚防御：
• PSM（Peg Stability Module）：允许1:1兑换USDC↔DAI
• DSR（DAI Savings Rate）：提高存款利率吸引买入
• 清算机制：抵押率不足时拍卖抵押品
\`\`\`

**DAI抵押品构成（2024年数据）**：
- USDC：~40%（通过PSM）
- ETH：~25%
- WBTC：~10%
- 其他：~25%（stETH/WSTETH/RWA等）

#### **LUSD（Liquity）**

\`\`\`
LUSD特点：
• 仅支持ETH作为抵押品
• 最低抵押率110%（极限杠杆）
• 无利息（仅一次性0.5%铸币费）
• 不可变合约（无治理风险）

脱锚防御：
• Redemption（赎回）：任何人可用$1 LUSD赎回$1价值ETH
• Stability Pool：用户存入LUSD，吸收清算债务
• Recovery Mode：抵押率<150%时触发，提高清算优先级
\`\`\`

---

### 2️⃣ **部分算法型（平衡风险）**

#### **FRAX（Frax Finance）**

\`\`\`
FRAX混合机制：
• 部分抵押（CR = Collateral Ratio，如90%）
• 部分算法（FXS销毁支撑）

CR动态调整：
- FRAX > $1.01 → 降低CR（增加算法部分）
- FRAX < $0.99 → 提高CR（增加抵押部分）

脱锚防御：
• Curve AMO：自动做市商操作，平衡Curve池
• 回购销毁：用协议收入回购FXS，增强信任
• Fraxlend：借贷利率调节供需
\`\`\`

---

### 3️⃣ **算法型（高风险）⚠️**

**失败案例**：
- **UST（Terra）**：2022-05崩盘，依赖LUNA无限增发
- **IRON（Iron Finance）**：2021-06银行挤兑，1天归零
- **Neutrino USD（USDN）**：2022持续脱锚，恢复失败

**关键教训**：纯算法稳定币在极端情况下易触发死亡螺旋

---

## 🎯 去中心化稳定币脱锚防御策略

### 策略1：DAI PSM套利

**原理**：PSM允许1:1兑换USDC↔DAI，手续费仅0.1%

\`\`\`solidity
// MakerDAO PSM合约交互
// 地址：0x89B78CfA322F6C5dE0aBcEecab66Aee45393cC5A

const { ethers } = require('ethers');

async function daiPsmArbitrage() {
  const provider = new ethers.JsonRpcProvider('https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY');
  const wallet = new ethers.Wallet('YOUR_PRIVATE_KEY', provider);

  const PSM_ADDRESS = '0x89B78CfA322F6C5dE0aBcEecab66Aee45393cC5A';
  const DAI_ADDRESS = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
  const USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';

  // PSM ABI（简化）
  const psmAbi = [
    'function sellGem(address usr, uint256 gemAmt)',
    'function buyGem(address usr, uint256 gemAmt)'
  ];

  const psmContract = new ethers.Contract(PSM_ADDRESS, psmAbi, wallet);
  const daiContract = new ethers.Contract(DAI_ADDRESS, ERC20_ABI, wallet);

  // 1. 检查DAI价格
  const daiPrice = await getDaiPrice(); // 例如从Curve获取

  if (daiPrice > 1.005) {
    console.log('🚨 DAI溢价，执行套利：USDC → DAI → USDC');

    // 2. 用1000 USDC买DAI（通过PSM）
    const usdcAmount = ethers.parseUnits('1000', 6); // USDC 6位小数

    // 授权PSM使用USDC
    const usdcContract = new ethers.Contract(USDC_ADDRESS, ERC20_ABI, wallet);
    await usdcContract.approve(PSM_ADDRESS, usdcAmount);

    // 3. PSM买入DAI（sellGem = 卖USDC换DAI）
    const tx1 = await psmContract.sellGem(wallet.address, usdcAmount);
    await tx1.wait();

    console.log('✅ 获得 ~1000 DAI');

    // 4. 在Curve卖出DAI换USDC（价格$1.005）
    const daiAmount = ethers.parseUnits('1000', 18);
    await sellDaiOnCurve(daiAmount); // 假设获得1005 USDC

    console.log('💰 套利收益：$5（0.5%）');
  } else if (daiPrice < 0.995) {
    console.log('🚨 DAI折价，反向套利：DAI → USDC → DAI');

    // 用1000 DAI通过PSM换USDC
    const daiAmount = ethers.parseUnits('1000', 18);
    await daiContract.approve(PSM_ADDRESS, daiAmount);

    // buyGem = 买USDC（用DAI）
    const tx = await psmContract.buyGem(wallet.address, ethers.parseUnits('1000', 6));
    await tx.wait();

    console.log('✅ 获得 ~1000 USDC');

    // 在Curve买入DAI（价格$0.995）
    await buyDaiOnCurve(ethers.parseUnits('1000', 6)); // 获得1005 DAI

    console.log('💰 套利收益：$5（0.5%）');
  }
}

// 辅助函数：从Curve获取DAI价格
async function getDaiPrice() {
  const CURVE_3POOL = '0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7';
  const curveContract = new ethers.Contract(
    CURVE_3POOL,
    ['function get_dy(int128 i, int128 j, uint256 dx) view returns (uint256)'],
    provider
  );

  // DAI (index 0) → USDC (index 1)
  const daiAmount = ethers.parseUnits('1', 18);
  const usdcOut = await curveContract.get_dy(0, 1, daiAmount);

  // USDC是6位小数
  const price = Number(usdcOut) / 1e6;
  return price;
}

// 定期检查
setInterval(daiPsmArbitrage, 60000); // 每分钟检查
\`\`\`

**收益分析**：
- DAI溢价1%时，套利收益≈0.9%（扣除0.1% PSM费用）
- Gas成本：~$10–30（取决于网络拥堵）
- 盈亏平衡点：$1,000以上交易量

---

### 策略2：LUSD赎回套利

**原理**：LUSD价格>$1时，用$1价值ETH赎回$1 LUSD，获利

\`\`\`javascript
// Liquity赎回机制
const LIQUITY_TROVE_MANAGER = '0xA39739EF8b0231DbFA0DcdA07d7e29faAbCf4bb2';

async function lusdRedemptionArbitrage() {
  const lusdPrice = await getLusdPrice(); // 例如从Curve获取

  if (lusdPrice > 1.05) {
    console.log('🚨 LUSD溢价5%，执行赎回套利');

    // 1. 在市场上买入1000 LUSD（假设花费$1050）
    await buyLusdOnCurve(1000);

    // 2. 通过Liquity协议赎回
    const troveManager = new ethers.Contract(
      LIQUITY_TROVE_MANAGER,
      ['function redeemCollateral(uint256 _LUSDAmount, address _firstRedemptionHint, address _upperPartialRedemptionHint, address _lowerPartialRedemptionHint, uint256 _partialRedemptionHintNICR, uint256 _maxIterations, uint256 _maxFeePercentage)'],
      wallet
    );

    const lusdAmount = ethers.parseUnits('1000', 18);

    // 赎回费用：0.5% + 衰减费率（通常<1%）
    const maxFee = ethers.parseUnits('0.02', 18); // 2%最大费率

    // 执行赎回（需要提供hint，通过Liquity SDK获取）
    const tx = await troveManager.redeemCollateral(
      lusdAmount,
      FIRST_HINT,  // 通过SDK计算
      UPPER_HINT,
      LOWER_HINT,
      NICR_HINT,
      10,  // 最多迭代10次
      maxFee
    );
    await tx.wait();

    console.log('✅ 获得价值$1000的ETH');

    // 3. 卖出ETH
    await sellEthForUsdc(ethAmount);

    console.log('💰 套利收益：~$50（5% - 1%赎回费 - 0.3%交易费）');
  }
}
\`\`\`

**风险警告**：
- 赎回费率会随着赎回量增加而上升（防止攻击）
- 赎回会关闭抵押率最低的Trove（影响其他用户）
- ETH价格波动风险

---

### 策略3：抵押率监控与清算

**目标**：监控DAI/LUSD Vault，在抵押率不足时触发清算获利

\`\`\`javascript
// 监控MakerDAO Vaults
const CDP_MANAGER = '0x5ef30b9986345249bc32d8928B7ee64DE9435E39';

async function monitorVaults() {
  const cdpManager = new ethers.Contract(CDP_MANAGER, CDP_MANAGER_ABI, provider);

  // 获取所有Vault（简化，实际需通过事件日志）
  const vaults = await getAllVaults();

  for (const vault of vaults) {
    const { collateral, debt, collateralType } = await getVaultInfo(vault.id);

    // 获取抵押品价格
    const ethPrice = await getEthPrice();

    // 计算抵押率
    const collateralValue = collateral * ethPrice;
    const collateralRatio = (collateralValue / debt) * 100;

    // 清算阈值（例如ETH是150%）
    const liquidationRatio = getLiquidationRatio(collateralType);

    if (collateralRatio < liquidationRatio) {
      console.log('🚨 Vault ' + vault.id + ' 可清算！');
      console.log('   抵押率：' + collateralRatio.toFixed(2) + '%');
      console.log('   阈值：' + liquidationRatio + '%');

      // 触发清算
      await liquidateVault(vault.id);
    }
  }
}

async function liquidateVault(vaultId) {
  // MakerDAO清算通过拍卖进行
  const CLIPPER = getClipperAddress(vaultId); // 获取对应Clipper合约

  const clipper = new ethers.Contract(CLIPPER, CLIPPER_ABI, wallet);

  // 开启拍卖
  const tx = await clipper.kick({
    tab: debt,       // 债务金额
    lot: collateral, // 抵押品数量
    usr: vaultOwner,
    kpr: wallet.address
  });

  await tx.wait();
  console.log('✅ 拍卖已开启，等待竞价...');

  // 后续参与拍卖竞价（Dutch Auction）
  // ...
}

// 每5分钟检查一次
setInterval(monitorVaults, 300000);
\`\`\`

**清算收益**：
- MakerDAO：清算罚金13%（清算者获得部分）
- Liquity：清算折扣5–10%（根据抵押率）

---

### 策略4：Liquity Stability Pool

**原理**：存入LUSD到稳定池，吸收清算债务并获得折扣ETH

\`\`\`javascript
// Liquity Stability Pool
const STABILITY_POOL = '0x66017D22b0f8556afDd19FC67041899Eb65a21bb';

async function joinStabilityPool() {
  const stabilityPool = new ethers.Contract(
    STABILITY_POOL,
    [
      'function provideToSP(uint256 _amount)',
      'function withdrawFromSP(uint256 _amount)',
      'function getDepositorETHGain(address _depositor) view returns (uint256)',
      'function getDepositorLQTYGain(address _depositor) view returns (uint256)'
    ],
    wallet
  );

  // 1. 存入10,000 LUSD
  const lusdAmount = ethers.parseUnits('10000', 18);
  const lusdContract = new ethers.Contract(LUSD_ADDRESS, ERC20_ABI, wallet);

  await lusdContract.approve(STABILITY_POOL, lusdAmount);
  const tx1 = await stabilityPool.provideToSP(lusdAmount);
  await tx1.wait();

  console.log('✅ 已存入10,000 LUSD到稳定池');

  // 2. 定期检查收益
  setInterval(async () => {
    const ethGain = await stabilityPool.getDepositorETHGain(wallet.address);
    const lqtyGain = await stabilityPool.getDepositorLQTYGain(wallet.address);

    console.log('ETH收益：' + ethers.formatEther(ethGain) + ' ETH');
    console.log('LQTY奖励：' + ethers.formatEther(lqtyGain) + ' LQTY');

    // 收益>阈值时提取
    if (Number(ethers.formatEther(ethGain)) > 0.1) {
      await stabilityPool.withdrawFromSP(0); // 提取收益但不取出本金
      console.log('💰 已提取清算收益');
    }
  }, 3600000); // 每小时检查
}

joinStabilityPool();
\`\`\`

**收益构成**：
- **ETH清算折扣**：当Trove被清算时，稳定池获得折扣ETH（通常5–10%折扣）
- **LQTY奖励**：协议代币奖励（APR波动，历史5–20%）
- **风险**：LUSD短期脱锚风险（清算时会用LUSD抵消债务）

**历史收益（2023年数据）**：
- ETH清算收益：年化3–8%
- LQTY奖励：年化10–15%
- 综合APR：13–23%

---

### 策略5：FRAX Curve AMO监控

**原理**：监控FRAX在Curve池的平衡，利用AMO操作套利

\`\`\`javascript
// Curve FRAX3CRV池
const FRAX_POOL = '0xd632f22692FaC7611d2AA1C0D552930D43CAEd3B';

async function monitorFraxPool() {
  const pool = new ethers.Contract(
    FRAX_POOL,
    [
      'function balances(uint256 i) view returns (uint256)',
      'function get_virtual_price() view returns (uint256)'
    ],
    provider
  );

  // 获取池内余额
  const fraxBalance = await pool.balances(0);
  const crvBalance = await pool.balances(1);

  const fraxRatio = Number(fraxBalance) / (Number(fraxBalance) + Number(crvBalance));

  console.log('FRAX占比：' + (fraxRatio * 100).toFixed(2) + '%');

  // 不平衡时（偏离50%超过5%）
  if (fraxRatio > 0.55) {
    console.log('🚨 FRAX过多，可能折价');
    // 策略：在Curve买入FRAX（低价），等待恢复
  } else if (fraxRatio < 0.45) {
    console.log('🚨 FRAX过少，可能溢价');
    // 策略：铸造FRAX，在Curve卖出（高价）
  }
}

setInterval(monitorFraxPool, 60000);
\`\`\`

---

## ⚠️ 去中心化稳定币风险

### 1. **抵押品风险**

| 稳定币 | 抵押品 | 风险 |
|--------|--------|------|
| DAI | ETH/WBTC/**USDC** | ⚠️ USDC占比过高（中心化风险） |
| LUSD | 仅ETH | ⚠️ 单一抵押品，ETH暴跌时压力大 |
| FRAX | USDC+算法 | ⚠️ 算法部分在极端情况下脆弱 |

### 2. **治理风险**

- **MakerDAO**：治理可修改参数（抵押率、DSR等），存在治理攻击风险
- **FRAX**：FXS持有者可调整CR，激进调整可能失衡
- **Liquity**：✅ 不可变合约，无治理风险

### 3. **智能合约风险**

- 所有协议都经过审计，但仍有漏洞风险
- 建议分散资金，不要all-in单一协议

### 4. **历史教训：算法稳定币崩盘**

#### **UST死亡螺旋（2022-05）**

\`\`\`
5月7日：UST开始脱锚至$0.98
       ↓
5月8日：大量赎回UST→LUNA
       ↓ (LUNA增发稀释)
5月9日：LUNA价格崩盘，UST跌至$0.60
       ↓ (恐慌加剧)
5月10日：UST $0.30，LUNA接近归零
       ↓
5月13日：UST $0.08，生态彻底崩溃
\`\`\`

**关键问题**：
1. 无真实抵押品支撑
2. LUNA市值<UST市值（不可持续）
3. Anchor 20% APY吸引大量资金（庞氏结构）

**防御策略**：
- ❌ 避免纯算法稳定币
- ✅ 选择超额抵押型（DAI/LUSD）
- ✅ 检查抵押品透明度

---

## 📋 执行检查清单

### 阶段1：学习与准备（1-2周）

- [ ] 理解DAI/LUSD/FRAX机制差异
- [ ] 阅读协议文档（MakerDAO/Liquity/Frax）
- [ ] 在测试网模拟PSM套利、赎回套利
- [ ] 设置Etherscan API监控Vault

### 阶段2：小额实战（2-4周）

- [ ] 存入$500到Liquity Stability Pool
- [ ] 监控DAI PSM机会（设置Telegram预警）
- [ ] 参与1次LUSD赎回套利（价格>$1.05时）
- [ ] 分析清算机会（监控抵押率<160%的Vault）

### 阶段3：规模化（长期）

- [ ] 扩大稳定池投入至$5K–10K
- [ ] 开发自动化Bot（监控+执行）
- [ ] 参与协议治理投票（影响参数调整）
- [ ] 多稳定币分散（DAI 40% + LUSD 40% + FRAX 20%）

---

## 💰 收益与成本

| 策略 | 预期APR | 资金需求 | 时间投入 |
|------|---------|---------|---------|
| **PSM套利** | 10–30%（机会性） | $1K+ | 每天1小时监控 |
| **LUSD赎回** | 5–50%（机会性） | $2K+ | 每周检查 |
| **Stability Pool** | 13–23% | $5K+ | 被动收益 |
| **清算Bot** | 20–80%（高风险） | $10K+ | 每天4小时+ |

**总成本**：
- Gas费：$50–500/月（取决于操作频率）
- API费用：$0–50/月（Etherscan/Alchemy）
- 学习成本：40–60小时

---

## 🎓 进阶优化

### 1. **多协议对冲**

\`\`\`
组合策略：
• 50% DAI Stability Pool
• 30% LUSD Stability Pool
• 20% FRAX Curve LP

逻辑：
- DAI最稳定（USDC支撑）
- LUSD清算收益高
- FRAX Curve LP提供额外CRV奖励
\`\`\`

### 2. **治理参与**

参与MakerDAO投票：
- 提高DSR → 吸引买入DAI → 稳定挂钩
- 降低抵押率 → 增加DAI供应 → 降低溢价

### 3. **链上数据分析**

\`\`\`python
# 监控DAI大额铸造（可能导致供应增加→价格下跌）
import requests

def monitor_dai_mints():
    url = 'https://api.etherscan.io/api'
    params = {
        'module': 'logs',
        'action': 'getLogs',
        'address': '0x6B175474E89094C44Da98b954EedeAC495271d0F',  # DAI
        'topic0': '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',  # Transfer
        'apikey': 'YOUR_KEY'
    }

    response = requests.get(url, params=params)
    logs = response.json()['result']

    for log in logs:
        if log['topics'][1] == '0x0000000000000000000000000000000000000000000000000000000000000000':
            # From地址为0 = 铸造
            amount = int(log['data'], 16) / 1e18
            if amount > 1000000:  # 大于100万DAI
                print(f'🚨 检测到大额铸造：{amount:,.0f} DAI')
\`\`\`

---

## 🎯 总结

**去中心化稳定币脱锚防御**的核心是**理解协议机制**：

| 优势 | 说明 |
|------|------|
| ✅ **透明度高** | 链上可验证抵押品 |
| ✅ **套利机会** | PSM/赎回提供确定性收益 |
| ✅ **被动收益** | Stability Pool无需主动操作 |
| ⚠️ **复杂度** | 需深入理解各协议机制 |
| ⚠️ **Gas成本** | 以太坊主网操作成本高 |

**推荐路径**：
1. 新手：从Liquity Stability Pool开始（被动收益）
2. 进阶：监控DAI PSM机会（主动套利）
3. 专家：开发清算Bot（高频交易）

**风险提醒**：避免算法稳定币，优先选择超额抵押型（DAI/LUSD） 🛡️
`,

  steps: [
    {
      step_number: 1,
      title: '学习协议机制',
      description:
        '深入研究MakerDAO PSM、Liquity赎回、FRAX AMO机制，在Goerli测试网模拟操作，理解抵押率、清算阈值、赎回费率等关键参数。',
      time_minutes: 600
    },
    {
      step_number: 2,
      title: '部署监控系统',
      description:
        '用Ethers.js搭建价格监控脚本，实时抓取Curve/Uniswap价格，监控DAI/LUSD/FRAX偏离$1的幅度，设置Telegram报警（偏离>0.5%时通知）。',
      time_minutes: 300
    },
    {
      step_number: 3,
      title: '小额套利实战',
      description:
        '存入$500到Liquity Stability Pool获取被动收益，当DAI溢价>1%时执行PSM套利（USDC→DAI→Curve卖出），当LUSD溢价>5%时执行赎回套利。',
      time_minutes: 120
    },
    {
      step_number: 4,
      title: '清算机会监控',
      description:
        '通过Etherscan API监控MakerDAO Vaults抵押率，当抵押率<155%时预警，学习参与荷兰式拍卖清算（需至少$5K资金参与竞价）。',
      time_minutes: 400
    },
    {
      step_number: 5,
      title: '规模化与治理',
      description:
        '扩大稳定池投入至$5K-$10K，参与MakerDAO/Frax治理投票（持有MKR/FXS），多协议分散风险（DAI 40% + LUSD 40% + FRAX 20%）。',
      time_minutes: 180
    }
  ],

  status: 'published'
};

async function main() {
  try {
    // 1. 登录获取token
    const authResponse = await axios.post(`${DIRECTUS_URL}/auth/login`, {
      email: 'the_uk1@outlook.com',
      password: 'Mygcdjmyxzg2026!'
    });

    const token = authResponse.data.data.access_token;

    // 2. 创建策略
    const response = await axios.post(
      `${DIRECTUS_URL}/items/strategies`,
      {
        ...GUIDE_CONFIG,
        steps: GUIDE_CONFIG.steps
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ 去中心化稳定币脱锚防御创建成功!');
    console.log(`   ID: ${response.data.data.id}`);
    console.log(`   Slug: ${response.data.data.slug}`);
    console.log(
      `   访问: http://localhost:3000/strategies/${response.data.data.slug}`
    );
  } catch (error) {
    console.error('❌ 创建失败:', error.response?.data || error.message);
  }
}

main();
