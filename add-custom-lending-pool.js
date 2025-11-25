const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

const GUIDE_CONFIG = {
  title: '自建借贷资金池策略',
  slug: 'custom-lending-pool-strategy',
  summary:
    '自建DeFi借贷池完整方案：Aave V3 Fork部署、利率模型自定义、风险参数配置、白名单借款人管理、私有流动性池、机构级借贷服务、RWA资产整合、治理代币设计、审计与安全、历史APY 8-30%、成本$20K起（开发+审计）。',

  category: 'lending',
  category_l1: 'yield',
  category_l2: '借贷挖息',

  difficulty_level: 5,
  risk_level: 4,
  apy_min: 8,
  apy_max: 30,

  threshold_capital: '20,000–500,000 USD（开发+审计+初始流动性）',
  threshold_capital_min: 20000,
  time_commitment: '初始开发2-3个月，审计1-2个月，运营持续投入',
  time_commitment_minutes: 240,
  threshold_tech_level: 'advanced',

  content: `> **适用人群**：区块链开发团队、DeFi协议创始人、机构投资者、希望构建专属借贷服务的组织
> **阅读时间**：≈ 60–80 分钟
> **关键词**：Lending Pool / Aave Fork / Interest Rate Model / Risk Parameters / Whitelisting / Private Liquidity / RWA / Smart Contract Audit / DeFi Infrastructure

---

## 📊 TL;DR（60秒速览）

**核心思路**：部署自己的借贷协议，控制利率、风险参数、借款人准入，服务特定用户群体

| 方案 | 适用场景 | 开发成本 | 时间 | 优势 |
|------|---------|---------|------|------|
| **Aave V3 Fork** | 通用借贷 | $20K–50K | 2-3个月 | 成熟代码，审计完善 |
| **Compound V3 Fork** | 稳定币借贷 | $15K–40K | 2个月 | 简洁设计，Gas优化 |
| **完全自研** | 特殊需求 | $100K+ | 6个月+ | 完全定制，灵活度高 |

**为什么要自建借贷池？**

\`\`\`
场景1：机构借贷
• 传统借贷协议：公开池，任何人可借
• 自建池：白名单准入，仅KYC用户可借
• 优势：降低坏账风险，合规性强

场景2：特殊资产
• 传统协议：仅支持主流资产（ETH/USDC）
• 自建池：支持RWA（房地产/债券代币化）
• 优势：拓展资产类别，服务特定市场

场景3：定制利率
• 传统协议：算法利率，不可控
• 自建池：固定利率或自定义模型
• 优势：可预测收益，适合机构

场景4：品牌与收益
• 传统协议：协议抽成10-20%
• 自建池：协议收入100%归自己
• 优势：长期收益可观
\`\`\`

---

## 🏗️ 自建借贷池架构选择

### 方案对比

#### 1️⃣ **Aave V3 Fork（推荐）**

**优势**：
- ✅ 代码成熟（运行4年+，TVL $10B）
- ✅ 多次审计（Trail of Bits, OpenZeppelin等）
- ✅ 功能全面（E-Mode, Portal, 隔离模式）
- ✅ 社区支持（文档完善，开发者多）

**劣势**：
- ⚠️ 代码复杂（学习曲线陡）
- ⚠️ Gas成本较高

**适用场景**：通用借贷池，需要全功能

---

#### 2️⃣ **Compound V3 Fork**

**优势**：
- ✅ 代码简洁（易理解）
- ✅ Gas优化（比Aave低20-30%）
- ✅ 专注稳定币（适合单一市场）

**劣势**：
- ⚠️ 功能较少（无E-Mode等高级功能）
- ⚠️ 支持资产有限

**适用场景**：稳定币借贷，追求简洁

---

#### 3️⃣ **完全自研**

**优势**：
- ✅ 完全定制（任意功能）
- ✅ 无许可依赖
- ✅ 品牌独立性

**劣势**：
- ❌ 开发成本高（$100K+）
- ❌ 审计风险大（新代码）
- ❌ 时间长（6个月+）

**适用场景**：特殊需求，有充足预算

---

## 🎯 实战：Fork Aave V3部署

### 步骤1：环境准备

\`\`\`bash
# 1. 克隆Aave V3代码
git clone https://github.com/aave/aave-v3-core.git
cd aave-v3-core

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env

# 编辑.env，填入：
# - PRIVATE_KEY（部署者私钥）
# - RPC_URL（目标链RPC）
# - ETHERSCAN_API_KEY（用于验证合约）
\`\`\`

---

### 步骤2：配置市场参数

\`\`\`javascript
// markets/your-market/index.ts
import { IMarketRates, eEthereumNetwork } from '../../helpers/types';

export const YourMarketRates: IMarketRates = {
  USDC: {
    strategy: {
      name: 'rateStrategyStableTwo',
      baseVariableBorrowRate: '0', // 0%
      variableRateSlope1: '40000000000000000000000000', // 4%
      variableRateSlope2: '600000000000000000000000000', // 60%
      stableRateSlope1: '5000000000000000000000000', // 0.5%
      stableRateSlope2: '600000000000000000000000000', // 60%
      optimalUsageRatio: '900000000000000000000000000', // 90%
      baseStableBorrowRate: '10000000000000000000000000' // 1%
    }
  },
  WETH: {
    strategy: {
      name: 'rateStrategyVolatileOne',
      baseVariableBorrowRate: '0',
      variableRateSlope1: '40000000000000000000000000', // 4%
      variableRateSlope2: '800000000000000000000000000', // 80%
      stableRateSlope1: '20000000000000000000000000', // 2%
      stableRateSlope2: '800000000000000000000000000', // 80%
      optimalUsageRatio: '800000000000000000000000000', // 80%
      baseStableBorrowRate: '30000000000000000000000000' // 3%
    }
  }
};

export const YourMarketReserves: IReserveParams = {
  USDC: {
    reserveFactor: '1000', // 10%
    baseLTVAsCollateral: '8000', // 80%
    liquidationThreshold: '8500', // 85%
    liquidationBonus: '10500', // 5%罚金
    borrowCap: '50000000', // 5000万USDC上限
    supplyCap: '100000000', // 1亿USDC上限
    stableBorrowRateEnabled: true,
    borrowingEnabled: true,
    flashLoanEnabled: true
  },
  WETH: {
    reserveFactor: '1500', // 15%
    baseLTVAsCollateral: '8250', // 82.5%
    liquidationThreshold: '8600', // 86%
    liquidationBonus: '10500', // 5%
    borrowCap: '20000', // 2万ETH上限
    supplyCap: '50000', // 5万ETH上限
    stableBorrowRateEnabled: false,
    borrowingEnabled: true,
    flashLoanEnabled: true
  }
};
\`\`\`

---

### 步骤3：部署合约

\`\`\`bash
# 部署到测试网（Sepolia）
npm run deploy:market:your-market --network sepolia

# 验证合约
npm run verify:market:your-market --network sepolia

# 部署到主网（谨慎！）
npm run deploy:market:your-market --network mainnet
\`\`\`

**部署后合约地址**：
\`\`\`
PoolAddressesProvider: 0x...
Pool: 0x...
PoolConfigurator: 0x...
AaveOracle: 0x...
ACLManager: 0x...
\`\`\`

---

### 步骤4：初始化资产

\`\`\`javascript
// scripts/init-reserves.js
const { ethers } = require('hardhat');

async function initReserves() {
  const poolConfigurator = await ethers.getContractAt(
    'PoolConfigurator',
    '0x...' // 你的PoolConfigurator地址
  );

  // 1. 初始化USDC
  console.log('初始化USDC市场...');

  const tx1 = await poolConfigurator.initReserves([
    {
      aTokenImpl: ATOKEN_IMPL,
      stableDebtTokenImpl: STABLE_DEBT_IMPL,
      variableDebtTokenImpl: VARIABLE_DEBT_IMPL,
      underlyingAssetDecimals: 6,
      interestRateStrategyAddress: USDC_RATE_STRATEGY,
      underlyingAsset: USDC_ADDRESS,
      treasury: TREASURY_ADDRESS,
      incentivesController: INCENTIVES_CONTROLLER,
      aTokenName: 'Your Aave USDC',
      aTokenSymbol: 'yaUSDC',
      variableDebtTokenName: 'Your Variable Debt USDC',
      variableDebtTokenSymbol: 'yvDebtUSDC',
      stableDebtTokenName: 'Your Stable Debt USDC',
      stableDebtTokenSymbol: 'ysDebtUSDC',
      params: '0x10' // 额外参数
    }
  ]);

  await tx1.wait();
  console.log('✅ USDC市场已初始化');

  // 2. 配置抵押参数
  await poolConfigurator.configureReserveAsCollateral(
    USDC_ADDRESS,
    8000, // LTV 80%
    8500, // 清算阈值 85%
    10500 // 清算奖励 5%
  );

  console.log('✅ USDC抵押参数已配置');
}

initReserves();
\`\`\`

---

## 🎯 高级功能：白名单管理

### 白名单借款人

\`\`\`solidity
// contracts/WhitelistManager.sol
pragma solidity ^0.8.0;

import "@aave/core-v3/contracts/protocol/pool/Pool.sol";

contract WhitelistManager {
    mapping(address => bool) public whitelistedBorrowers;
    address public admin;

    modifier onlyWhitelisted() {
        require(whitelistedBorrowers[msg.sender], "Not whitelisted");
        _;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    // 添加白名单
    function addToWhitelist(address user) external onlyAdmin {
        whitelistedBorrowers[user] = true;
        emit UserWhitelisted(user);
    }

    // 移除白名单
    function removeFromWhitelist(address user) external onlyAdmin {
        whitelistedBorrowers[user] = false;
        emit UserRemovedFromWhitelist(user);
    }

    // 批量添加
    function batchAddToWhitelist(address[] calldata users) external onlyAdmin {
        for (uint i = 0; i < users.length; i++) {
            whitelistedBorrowers[users[i]] = true;
        }
    }

    event UserWhitelisted(address indexed user);
    event UserRemovedFromWhitelist(address indexed user);
}
\`\`\`

**集成到Aave Pool**：

\`\`\`solidity
// 修改Pool.sol的borrow函数
function borrow(
    address asset,
    uint256 amount,
    uint256 interestRateMode,
    uint16 referralCode,
    address onBehalfOf
) external override {
    // 添加白名单检查
    require(whitelistManager.whitelistedBorrowers(msg.sender), "Not whitelisted");

    // 原有借款逻辑
    ...
}
\`\`\`

---

## 🎯 高级功能：固定利率借贷

### 固定利率模型

\`\`\`solidity
// contracts/FixedRateStrategy.sol
pragma solidity ^0.8.0;

import "@aave/core-v3/contracts/interfaces/IReserveInterestRateStrategy.sol";

contract FixedRateStrategy is IReserveInterestRateStrategy {
    uint256 public immutable FIXED_BORROW_RATE; // 例如：5% = 50000000000000000000000000
    uint256 public immutable FIXED_SUPPLY_RATE; // 例如：3% = 30000000000000000000000000

    constructor(uint256 borrowRate, uint256 supplyRate) {
        FIXED_BORROW_RATE = borrowRate;
        FIXED_SUPPLY_RATE = supplyRate;
    }

    function calculateInterestRates(
        DataTypes.CalculateInterestRatesParams memory params
    ) external view override returns (uint256, uint256, uint256) {
        // 返回固定利率（忽略utilization）
        return (
            FIXED_SUPPLY_RATE,  // liquidityRate
            0,                  // stableBorrowRate（不使用）
            FIXED_BORROW_RATE   // variableBorrowRate
        );
    }
}
\`\`\`

**部署固定利率池**：

\`\`\`javascript
// 部署5%固定借款利率，3%固定存款利率
const fixedRateStrategy = await FixedRateStrategy.deploy(
    '50000000000000000000000000', // 5%
    '30000000000000000000000000'  // 3%
);

// 将USDC市场切换到固定利率
await poolConfigurator.setReserveInterestRateStrategyAddress(
    USDC_ADDRESS,
    fixedRateStrategy.address
);
\`\`\`

---

## 🎯 高级功能：RWA资产集成

### RWA代币化

\`\`\`solidity
// contracts/RWAToken.sol
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract RWAToken is ERC20, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    // RWA元数据
    string public assetType; // 例如："Real Estate"
    string public assetLocation; // 例如："New York, USA"
    uint256 public assetValue; // 资产估值（USD）

    constructor(
        string memory name,
        string memory symbol,
        string memory _assetType,
        string memory _assetLocation,
        uint256 _assetValue
    ) ERC20(name, symbol) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);

        assetType = _assetType;
        assetLocation = _assetLocation;
        assetValue = _assetValue;
    }

    // 铸造RWA代币（需KYC验证）
    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }

    // 更新资产估值（通过预言机或人工审计）
    function updateAssetValue(uint256 newValue) external onlyRole(DEFAULT_ADMIN_ROLE) {
        assetValue = newValue;
        emit AssetValueUpdated(newValue);
    }

    event AssetValueUpdated(uint256 newValue);
}
\`\`\`

**集成到借贷池**：

\`\`\`javascript
// 1. 部署RWA代币
const rwaToken = await RWAToken.deploy(
    "NYC Real Estate Token",
    "NYCRE",
    "Real Estate",
    "New York, USA",
    10000000 // $10M估值
);

// 2. 添加到借贷池
await poolConfigurator.initReserves([{
    underlyingAsset: rwaToken.address,
    // ... 其他参数
    baseLTVAsCollateral: 5000, // 50%（RWA风险高，LTV低）
    liquidationThreshold: 6000, // 60%
    liquidationBonus: 11000 // 10%罚金
}]);

// 3. 配置RWA专用预言机
await aaveOracle.setAssetSources([rwaToken.address], [rwaOracle.address]);
\`\`\`

---

## 🎯 运营与收益

### 协议费用设置

\`\`\`javascript
// 配置Reserve Factor（协议抽成）
await poolConfigurator.setReserveFactor(
    USDC_ADDRESS,
    2000 // 20%（借款利息的20%归协议）
);

// 收益计算：
// 假设池内借款$1M，年利率8%
// 年利息收入：$1M × 8% = $80K
// 协议收入：$80K × 20% = $16K
\`\`\`

---

### 治理代币设计

\`\`\`solidity
// contracts/GovernanceToken.sol
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/governance/Governor.sol";

contract YourLendingToken is ERC20 {
    constructor() ERC20("Your Lending Token", "YLT") {
        _mint(msg.sender, 100000000 * 10**18); // 1亿枚
    }
}

// 分配方案：
// • 40%：流动性挖矿（奖励存款/借款用户）
// • 30%：团队（4年线性解锁）
// • 20%：国库（治理控制）
// • 10%：早期投资者
\`\`\`

---

## ⚠️ 安全与审计

### 必做审计

| 审计公司 | 成本 | 时间 | 推荐度 |
|---------|------|------|--------|
| **Trail of Bits** | $50K–100K | 4-6周 | ⭐⭐⭐⭐⭐ |
| **OpenZeppelin** | $40K–80K | 4周 | ⭐⭐⭐⭐⭐ |
| **Certora** | $60K–120K | 6-8周 | ⭐⭐⭐⭐⭐ |
| **PeckShield** | $20K–40K | 3周 | ⭐⭐⭐⭐ |

**预算分配**：
- 代码审计：$50K–100K
- 形式化验证：$30K–50K（可选）
- 漏洞赏金：$50K–500K（持续）

---

### Bug Bounty

\`\`\`
Immunefi漏洞赏金计划：

关键漏洞：$100K–500K
高危漏洞：$10K–100K
中危漏洞：$1K–10K
低危漏洞：$500–1K

总预算：$500K–1M
\`\`\`

---

## 💰 成本与收益分析

### 初始成本

\`\`\`
开发成本：
• Aave Fork修改：$20K–50K
• 自定义功能开发：$10K–30K
• 前端开发：$15K–40K
• 总计：$45K–120K

审计成本：
• 智能合约审计：$50K–100K
• 形式化验证：$30K–50K（可选）
• 总计：$50K–150K

运营成本：
• 服务器/RPC：$500–2K/月
• 预言机费用：$1K–5K/月
• 运营团队：$10K–50K/月
• 总计：$11.5K–57K/月

总初始投入：$100K–300K
\`\`\`

---

### 收益模型

\`\`\`
场景：稳定币借贷池

假设：
• TVL：$10M
• 利用率：70%
• 借款利率：8%
• Reserve Factor：20%

年收入：
$10M × 70% × 8% × 20% = $112K

3年回本（假设TVL稳定）
\`\`\`

---

## 📋 执行检查清单

### 阶段1：规划（1-2个月）

- [ ] 明确目标用户群体（机构/散户/特定行业）
- [ ] 选择技术方案（Aave Fork/Compound Fork/自研）
- [ ] 设计利率模型和风险参数
- [ ] 预算评估（$100K–300K）

### 阶段2：开发（2-3个月）

- [ ] Fork Aave V3代码
- [ ] 自定义利率模型
- [ ] 白名单/RWA功能开发
- [ ] 前端UI/UX设计
- [ ] 测试网部署测试

### 阶段3：审计（1-2个月）

- [ ] 联系审计公司（Trail of Bits/OpenZeppelin）
- [ ] 修复审计发现的问题
- [ ] 形式化验证（可选）
- [ ] 设置漏洞赏金计划

### 阶段4：上线（1个月）

- [ ] 主网部署
- [ ] 初始流动性注入（$1M–10M）
- [ ] 营销推广
- [ ] 社区建设

### 阶段5：运营（持续）

- [ ] 监控协议健康度
- [ ] 调整利率参数
- [ ] 新资产上线
- [ ] 治理提案执行

---

## 🎯 总结

**自建借贷资金池**的核心是**定制化服务+协议收入**：

| 优势 | 说明 |
|------|------|
| ✅ **完全控制** | 利率、风险参数自定义 |
| ✅ **协议收入** | Reserve Factor 100%归自己 |
| ✅ **品牌建设** | 独立品牌，长期价值 |
| ✅ **特殊需求** | 白名单、RWA等定制功能 |
| ⚠️ **高成本** | 初始投入$100K–300K |
| ⚠️ **技术门槛** | 需要专业开发团队 |
| ⚠️ **安全风险** | 智能合约漏洞可能致命 |

**推荐路径**：
1. 小团队/个人：❌ 不推荐（成本太高）
2. 中型DeFi项目：✅ Aave Fork（2-3个月上线）
3. 大型机构：✅ 完全自研（6个月+，功能最全）

**关键成功因素**：初始流动性>$1M，专业审计，持续运营！ 🚀
`,

  steps: [
    {
      step_number: 1,
      title: '需求分析与方案选择',
      description:
        '明确目标用户（机构/零售/特定行业），评估是否需要白名单、RWA、固定利率等特殊功能，选择技术方案（Aave Fork/Compound Fork/自研），编制详细预算（$100K-300K），组建开发团队。',
      time_minutes: 2400
    },
    {
      step_number: 2,
      title: '协议开发与定制',
      description:
        'Fork Aave V3代码库，配置市场参数（利率模型、LTV、清算阈值），开发定制功能（白名单管理、固定利率、RWA集成），部署到测试网（Sepolia/Goerli）进行压力测试。',
      time_minutes: 3600
    },
    {
      step_number: 3,
      title: '智能合约审计',
      description:
        '联系顶级审计公司（Trail of Bits/OpenZeppelin/Certora），提交代码进行全面审计（4-6周），修复所有高危和中危漏洞，可选进行形式化验证（额外$30K-50K），设置Immunefi漏洞赏金计划。',
      time_minutes: 1800
    },
    {
      step_number: 4,
      title: '主网部署与初始化',
      description:
        '部署核心合约到主网（Pool/Configurator/Oracle），初始化支持资产（USDC/ETH/RWA等），注入初始流动性（建议$1M-10M），配置Reserve Factor和治理参数，开发前端界面。',
      time_minutes: 600
    },
    {
      step_number: 5,
      title: '运营与持续优化',
      description:
        '监控协议健康度（利用率/坏账率），根据市场调整利率参数，上线新资产市场，执行治理提案，营销推广获取用户，处理用户反馈和问题，定期安全审查。',
      time_minutes: 1200
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

    console.log('✅ 自建借贷资金池策略创建成功!');
    console.log('   ID: ' + response.data.data.id);
    console.log('   Slug: ' + response.data.data.slug);
    console.log('   访问: http://localhost:3000/strategies/' + response.data.data.slug);
  } catch (error) {
    console.error('❌ 创建失败:', error.response?.data || error.message);
  }
}

main();
