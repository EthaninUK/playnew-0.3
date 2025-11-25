const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

const GUIDE_CONFIG = {
  title: '主流PoS公链质押收益对比：Solana/Cosmos/Polkadot全解析',
  slug: 'pos-staking-yield-comparison-guide',
  summary:
    '10+主流PoS公链质押对比：Ethereum(3-5%)、Solana(6-8%)、Cosmos(10-15%)、Polkadot(10-14%)、Avalanche(8-10%)、Cardano(4-6%)，详细对比APR、最低质押、解锁期、Slashing风险、质押方式(独立/池质押/CEX)，附收益计算器和风险评估，找到最适合你的质押方案。',

  category: 'lst-staking',
  category_l1: 'yield',
  category_l2: 'LST 质押',

  difficulty_level: 2,
  risk_level: 2,
  apy_min: 3,
  apy_max: 15,

  threshold_capital: '10-50,000 USD（视公链而定）',
  threshold_capital_min: 10,
  time_commitment: '初始研究3-5小时，质押操作10-30分钟，日常监控每周1小时',
  time_commitment_minutes: 60,
  threshold_tech_level: 'beginner',

  content: `> **适用人群**：持有或计划投资主流PoS公链代币，希望通过质押获得**被动收益**，需要**对比选择**最优质押方案的投资者
> **阅读时间**：≈ 18-22 分钟
> **关键词**：PoS Staking / Yield Comparison / Ethereum / Solana / Cosmos / Polkadot / APR / Validator / Liquid Staking / Delegation

---

## 🧭 快速对比表

| 公链 | 年化收益(APR) | 最低质押 | 解锁期 | Slashing | 质押方式 | 推荐度 |
|------|-------------|---------|--------|----------|---------|--------|
| **Ethereum** | 3-5% | 0.01 ETH(Lido) / 32 ETH(独立) | 排队(数天) | 中(双签) | Lido/Rocket Pool | ★★★★★ |
| **Solana** | 6-8% | 无最低 | 立即 | 低 | Phantom钱包/Marinade | ★★★★☆ |
| **Cosmos Hub** | 10-15% | 无最低 | 21天 | 中(双签5%) | Keplr钱包委托 | ★★★★★ |
| **Polkadot** | 10-14% | 10 DOT(池质押) / 120 DOT(提名) | 28天 | 高 | Polkadot.js/Fearless | ★★★★☆ |
| **Avalanche** | 8-10% | 25 AVAX | 2周 | 低 | Core钱包 | ★★★★☆ |
| **Cardano** | 4-6% | 10 ADA | 立即 | 无Slashing | Daedalus/Yoroi | ★★★★☆ |
| **BNB Chain** | 4-7% | 0.01 BNB | 7天 | 低 | Binance/Trust Wallet | ★★★☆☆ |
| **Near Protocol** | 10-12% | 1 NEAR | 立即 | 中 | Near Wallet | ★★★☆☆ |

**快速选择**：
- **追求安全+主流**：Ethereum（Lido流动性质押）
- **高收益+知名度**：Cosmos Hub（10-15% APR）
- **中等收益+活跃生态**：Solana（6-8% APR）
- **零Slashing风险**：Cardano（最友好新手）

---

## 🗂 目录
1. [PoS质押基础概念](#pos质押基础概念)
2. [Ethereum质押（ETH）](#ethereum质押eth)
3. [Solana质押（SOL）](#solana质押sol)
4. [Cosmos Hub质押（ATOM）](#cosmos-hub质押atom)
5. [Polkadot质押（DOT）](#polkadot质押dot)
6. [Avalanche质押（AVAX）](#avalanche质押avax)
7. [Cardano质押（ADA）](#cardano质押ada)
8. [其他主流PoS公链](#其他主流pos公链)
9. [多链质押策略](#多链质押策略)
10. [风险对比与防范](#风险对比与防范)
11. [常见问题FAQ](#常见问题faq)

---

## 💎 PoS质押基础概念

### 什么是PoS质押

**Proof of Stake（权益证明）**：持币者通过质押代币参与网络共识，获得区块奖励。

**核心机制**：
- 质押代币→成为验证者或委托给验证者
- 验证区块→获得新增代币奖励+交易手续费
- 违反规则→代币被罚没（Slashing）

---

### 质押收益来源

**1. 代币增发奖励**（主要）：
- 网络按固定比例增发新代币奖励验证者
- 如Cosmos年增发7-20%（根据质押率动态调整）

**2. 交易手续费**：
- 用户支付的Gas费分配给验证者
- Ethereum手续费占比约10-20%总收益

**3. MEV收益**（部分链）：
- 通过交易排序捕获套利机会
- Ethereum MEV可额外+0.5-2% APR

---

### 三种质押方式

#### 独立验证者（Solo Validator）
- 自己运行节点，完全掌控
- 需要技术能力+硬件成本
- 收益最高（无佣金）

#### 委托质押（Delegation）
- 将代币委托给验证者，验证者代运行节点
- 无需技术，收取5-20%佣金
- **最常见方式**（Cosmos/Polkadot等）

#### 流动性质押（Liquid Staking）
- 质押后获得衍生代币（stETH/stSOL/stATOM）
- 衍生代币可交易或用于DeFi
- 收取10-15%佣金，但提供流动性

---

## 🔷 Ethereum质押（ETH）

### 基本信息

- **年化收益**：3-5% APR
  - 基础质押：3.0-3.5%
  - 执行层奖励：+0.3-0.5%
  - MEV收益：+0.5-2%
- **最低质押**：
  - Lido流动性质押：0.01 ETH（约$16）
  - Rocket Pool：16 ETH（约$25,600）
  - 独立验证者：32 ETH（约$51,200）
- **解锁期**：排队提款（数天-数周）
- **Slashing风险**：中等（离线小额，双签严重）

---

### 质押方式推荐

#### 方案1：Lido（最简单）
- **最低金额**：0.01 ETH
- **收益**：约3.5% APR
- **优势**：获得stETH可用于DeFi，一键质押
- **劣势**：中心化（控制30%+质押），佣金10%
- **操作**：访问lido.fi → 连接MetaMask → 输入金额 → 确认

#### 方案2：Rocket Pool（去中心化）
- **最低金额**：0.1 ETH（普通质押）或 16 ETH（节点运营）
- **收益**：约3.5% APR（普通质押）/ 4-6%（节点运营+RPL奖励）
- **优势**：去中心化、获得rETH、节点运营额外RPL奖励
- **劣势**：节点运营需技术+16 ETH+质押RPL
- **操作**：访问rocketpool.net → Stake（普通质押）或 Run a Node（节点）

#### 方案3：Coinbase/Kraken（CEX）
- **最低金额**：0.01 ETH
- **收益**：约2.5-3% APR（扣除15-25%佣金）
- **优势**：最简单，界面友好，随时赎回
- **劣势**：佣金高，中心化，账户风险
- **操作**：CEX账户 → 赚币/Staking → 选择ETH → 确认

---

### 收益计算示例

**场景**：质押10 ETH通过Lido

**年收益**：
- 10 ETH × 3.5% = 0.35 ETH ≈ $560/年
- 月收入：约$47
- 日收入：约$1.5

**3年累计**：
- 本金：10 ETH
- 收益：1.05 ETH（复利）
- 总计：11.05 ETH

---

## 🟣 Solana质押（SOL）

### 基本信息

- **年化收益**：6-8% APR
- **最低质押**：无最低限制（实际建议>1 SOL避免费用占比过高）
- **解锁期**：立即解绑，下一个epoch生效（约2-3天）
- **Slashing风险**：极低（主要是离线无奖励，无罚没）

---

### 质押方式

#### 方案1：原生钱包质押（Phantom/Solflare）

**操作步骤**：
1. 下载Phantom钱包（https://phantom.app）
2. 转入SOL到钱包
3. 点击SOL → "Start earning SOL"
4. 选择验证者（建议选佣金5%以下、APY高的）
5. 输入质押数量 → 确认

**验证者选择标准**：
- 佣金：5-10%（避免0%，可能不稳定）
- APY：查看实际历史收益
- 在线率：>99%
- 跳过率：<5%

**推荐验证者**：
- Laine（佣金5%，稳定）
- Everstake（佣金7%，大型机构）
- P2P.org（佣金8%，企业级）

---

#### 方案2：流动性质押（Marinade/Lido）

**Marinade Finance**：
- 访问https://marinade.finance
- 连接Phantom钱包
- Stake SOL → 获得mSOL（流动性代币）
- mSOL可在Raydium/Orca交易或用于借贷
- 收益：约6% APR（扣除佣金后）

**优势**：
- 流动性：mSOL可随时卖出
- 自动选择最优验证者
- 参与DeFi赚取额外收益

**劣势**：
- 佣金约2%
- 智能合约风险

---

### Solana质押优缺点

**优势**：
✅ 收益较高（6-8% vs Ethereum 3-5%）
✅ 解锁快（2-3天 vs Ethereum排队）
✅ 无Slashing罚没（仅离线无奖励）
✅ 门槛低（任意金额）

**劣势**：
❌ 网络曾多次宕机（2022年数次）
❌ 验证者中心化程度高
❌ SOL币价波动大

**适用人群**：
- 看好Solana生态（NFT/DeFi活跃）
- 追求中等收益+快速解锁
- 能承受网络稳定性风险

---

## ⚛️ Cosmos Hub质押（ATOM）

### 基本信息

- **年化收益**：10-15% APR（动态调整）
- **最低质押**：无最低限制
- **解锁期**：21天（Unbonding Period）
- **Slashing风险**：
  - 离线：0.01%
  - 双签：5%

---

### 质押方式（Keplr钱包）

**步骤**：
1. 安装Keplr钱包（浏览器插件或移动App）
   - 访问https://www.keplr.app
2. 创建钱包或导入助记词
3. 转入ATOM到Keplr
4. 点击"Stake" → Cosmos Hub
5. 选择验证者：
   - 查看佣金（5-10%合理）
   - 查看投票参与率（>90%）
   - 避免头部验证者（去中心化）
6. 输入质押数量 → 确认
7. 收益自动复利（需手动Claim+Restake获得最大化）

---

### 验证者选择技巧

**关键指标**：
- **佣金**：5-10%（过低可能不可持续）
- **投票参与率**：100%最佳（参与治理）
- **在线时间**：100%（避免Slashing）
- **质押量**：避免前10名（防止中心化）

**推荐验证者**（仅供参考）**：
- Cosmostation（7%佣金，稳定运营）
- SG-1（5%佣金，社区知名）
- Chorus One（8%佣金，机构级）

**查询工具**：
- Mintscan：https://www.mintscan.io/cosmos（查看验证者详情）

---

### Cosmos生态空投福利

**历史空投**：
- **Osmosis（2021）**：Cosmos质押者获数千OSMO（价值$5,000-$50,000）
- **Juno（2021）**：类似大额空投
- **Evmos/Stargaze等**：后续多个项目

**策略**：
- 长期质押Cosmos Hub（快照不定期）
- 参与链上治理投票（提高空投资格）
- 使用Keplr钱包（支持IBC生态）

**注意**：空投不保证，但Cosmos生态历史上对ATOM质押者极为慷慨

---

### Cosmos质押优缺点

**优势**：
✅ 收益高（10-15% APR）
✅ 空投潜力大（IBC生态项目频繁空投）
✅ 无最低限制
✅ Keplr钱包操作简单

**劣势**：
❌ 21天解锁期（流动性差）
❌ ATOM币价波动大
❌ 质押期间无法卖出（错过行情）

**适用人群**：
- 长期看好Cosmos生态
- 追求高收益+空投机会
- 不需要短期流动性

---

## 🔴 Polkadot质押（DOT）

### 基本信息

- **年化收益**：10-14% APR
- **最低质押**：
  - Nomination Pool（提名池）：10 DOT（约$70）
  - 直接提名：120 DOT（约$840，动态变化）
- **解锁期**：28天
- **Slashing风险**：高（复杂规则，验证者错误可能导致提名人损失）

---

### 质押方式

#### 方案1：Nomination Pool（推荐新手）

**操作**：
1. 安装Polkadot.js扩展或使用Fearless Wallet（移动端）
2. 创建钱包并转入DOT
3. 访问https://polkadot.js.org/apps
4. Network → Polkadot → Staking → Pools
5. 选择Pool（查看成员数量、佣金、APR）
6. 输入质押金额（最低10 DOT）→ Join Pool

**Pool选择**：
- 佣金：0-5%
- 成员数：多=稳定
- 状态：Open（开放加入）

---

#### 方案2：直接提名（需120 DOT+）

**操作**：
1. Polkadot.js → Staking → Accounts → Nominator
2. 绑定DOT（Bond）
3. 选择验证者（最多16个）
   - 分散选择（不同运营商）
   - 查看ERA Points（越高=越活跃）
   - 避免Over-subscribed（提名人数超限）
4. 确认提名

**注意**：
- 如果提名的验证者被Slashing，你也会损失
- 需要定期检查验证者状态（每周）

---

### Polkadot质押优缺点

**优势**：
✅ 高收益（10-14% APR）
✅ 平行链生态活跃（参与Crowdloan可锁定DOT获得新项目代币）
✅ Nomination Pool降低门槛（10 DOT）

**劣势**：
❌ 复杂度高（验证者选择、Slashing规则复杂）
❌ 28天解锁期
❌ Slashing风险（验证者错误影响提名人）

**适用人群**：
- 持有120+ DOT的中大户
- 愿意学习复杂质押机制
- 看好Polkadot平行链生态

---

## 🔺 Avalanche质押（AVAX）

### 基本信息

- **年化收益**：8-10% APR
- **最低质押**：25 AVAX（约$900）
- **质押期限**：固定（2周-1年可选，越长收益越高）
- **解锁期**：质押期满立即解锁
- **Slashing风险**：低

---

### 质押方式（Core钱包）

**步骤**：
1. 下载Core钱包（https://core.app）
2. 创建钱包并转入AVAX
3. 切换到"Stake"标签
4. 选择质押方式：
   - **Validate**：运行验证者（需2,000 AVAX+硬件）
   - **Delegate**：委托质押（仅需25 AVAX）
5. 选择验证者（查看Uptime、Fee、质押期限）
6. 选择质押时长：
   - 2周：约8% APR
   - 3个月：约9% APR
   - 1年：约10% APR
7. 输入金额 → 确认

---

### Avalanche质押特点

**独特机制**：
- **固定期限**：必须锁定2周-1年（到期自动解锁）
- **灵活策略**：
  - 短期持有→选2周（灵活，收益略低）
  - 长期持有→选1年（收益最高）
  - 分批质押：分散到期时间（如每月质押3个月锁定）

**优势**：
✅ 收益中上（8-10%）
✅ Slashing风险低
✅ 子网生态（GameFi/DeFi活跃）

**劣势**：
❌ 锁定期内完全无法赎回
❌ 最低25 AVAX门槛

**适用人群**：
- 能承受锁定期的长期持有者
- 看好Avalanche子网生态
- 追求中等收益+低风险

---

## 🔵 Cardano质押（ADA）

### 基本信息

- **年化收益**：4-6% APR
- **最低质押**：10 ADA（约$5）
- **解锁期**：立即（3个epoch后生效，约15天）
- **Slashing风险**：无（最友好）

---

### 质押方式

#### 使用Daedalus/Yoroi钱包

**步骤**：
1. 下载钱包：
   - Daedalus（全节点，需同步区块链，安全性高）
   - Yoroi（轻钱包，快速，移动端友好）
2. 创建钱包并转入ADA
3. 进入"Delegation"（委托）
4. 选择质押池：
   - 查看ROA（实际收益率）
   - 查看Saturation（饱和度，<100%最佳）
   - 查看Pool Margin（佣金，1-5%）
5. 输入质押金额 → 确认
6. 等待3个epoch（约15天）开始获得奖励

---

### Cardano质押优势

**最友好新手**：
✅ **无Slashing**：永远不会被罚没
✅ **流动性**：质押期间可随时花费ADA（仅需保留质押金额）
✅ **低门槛**：10 ADA起
✅ **自动复利**：奖励自动添加到质押

**劣势**：
❌ 收益较低（4-6% vs Cosmos 10-15%）
❌ DeFi生态较小

**适用人群**：
- 完全新手（零Slashing风险）
- 长期ADA持有者
- 不想操心技术细节

---

## 🌐 其他主流PoS公链

### BNB Chain（BNB）

- **APR**：4-7%
- **质押方式**：
  - Binance交易所（最简单，0.1 BNB起）
  - Trust Wallet委托
- **解锁期**：7天
- **特点**：中心化程度高，但生态活跃

---

### Near Protocol（NEAR）

- **APR**：10-12%
- **质押方式**：Near Wallet委托
- **解锁期**：立即解绑，36-48小时到账
- **特点**：用户友好，收益高

---

### Tezos（XTZ）

- **APR**：5-7%
- **质押方式**：称为"Baking"，委托给Baker
- **解锁期**：立即
- **特点**：链上治理活跃

---

### Algorand（ALGO）

- **APR**：4-5%
- **质押方式**：持有即自动质押（无需操作）
- **解锁期**：无
- **特点**：最简单，但收益最低

---

## 🎯 多链质押策略

### 分散投资组合

**保守型**（风险厌恶）：
- 70% Ethereum（Lido）：最安全主流
- 20% Cardano：无Slashing
- 10% Avalanche（2周锁定）：灵活

**平衡型**：
- 40% Ethereum（Lido）
- 30% Cosmos Hub：高收益+空投
- 20% Solana：中等收益+活跃生态
- 10% Polkadot（Pool）：高收益

**激进型**（追求高收益）：
- 30% Cosmos Hub：10-15% APR
- 25% Polkadot（直接提名）：10-14% APR
- 25% Near Protocol：10-12% APR
- 20% Avalanche（1年锁定）：10% APR

---

### 收益优化技巧

#### 1. 复利最大化
- Cosmos：每周手动Claim+Restake（Keplr钱包操作简单）
- Ethereum：Lido自动复利（stETH余额自动增长）

#### 2. 空投捕获
- 质押Cosmos Hub（IBC生态空投最丰富）
- 参与链上治理投票（提高空投资格）
- 使用原生钱包（如Keplr支持多链）

#### 3. 流动性管理
- 50%质押（被动收益）
- 30%流动性质押代币（stETH/mSOL用于DeFi）
- 20%现金（应对机会/突发）

---

## ⚠️ 风险对比与防范

### Slashing风险排序

**高风险**：
- Polkadot：复杂规则，验证者错误影响提名人
- Ethereum：双签可损失1+ ETH

**中风险**：
- Cosmos：双签5%，离线0.01%
- Solana：理论存在但极少实施

**低风险**：
- Avalanche：主要是验证者故障无奖励
- Cardano：**无Slashing**

---

### 风险防范清单

**技术风险**：
- [ ] 选择高信誉验证者（查看历史Slashing记录）
- [ ] 分散委托（不要All-in单个验证者）
- [ ] 定期检查验证者状态（每月）

**流动性风险**：
- [ ] 了解解锁期（Polkadot 28天，Cosmos 21天）
- [ ] 不要质押100%资产（保留20%应急）
- [ ] 考虑流动性质押（stETH/mSOL可随时卖）

**智能合约风险**（流动性质押）：
- [ ] 选择审计过的协议（Lido/Marinade/Rocket Pool）
- [ ] 分散使用（不要All-in单个协议）
- [ ] 关注协议Twitter（异常时第一时间知道）

---

## ❓ 常见问题FAQ

**Q1：哪个公链质押收益最高？**
> Cosmos Hub（10-15% APR）和Polkadot（10-14%）收益最高，但需考虑：
> - Cosmos空投潜力大，21天解锁期
> - Polkadot机制复杂，28天解锁期，Slashing风险高
> - 高收益往往伴随高风险或低流动性

**Q2：可以同时质押多条链吗？**
> 可以且推荐！分散投资降低单链风险。策略：
> - 主仓位：Ethereum（安全性）
> - 高收益仓位：Cosmos/Polkadot（15-30%资金）
> - 灵活仓位：Solana/Cardano（快速解锁）

**Q3：流动性质押（Lido/Marinade）安全吗？**
> 相对安全，但有风险：
> - ✅ 顶级审计（Lido经Consensys/Trail of Bits审计）
> - ✅ TVL高（Lido $20B+，Marinade $300M+）
> - ❌ 智能合约风险（非零，虽然极低）
> - ❌ 脱锚风险（stETH曾在2022年脱锚至0.93 ETH）
> 建议：大额分散（50% Lido + 50%其他方式）

**Q4：CEX质押（Coinbase/Binance）vs 链上质押？**
> 对比：
> - CEX：最简单，但佣金高（15-25%）、中心化、账户风险
> - 链上：佣金低（5-10%）、去中心化、需学习钱包
> 建议：小额(<$1,000)用CEX体验，大额学习链上质押

**Q5：质押期间币价跌了怎么办？**
> 质押≠锁定看跌风险！策略：
> - **对冲**：质押同时在CEX开空单对冲币价（高级）
> - **止损**：设定心理价位，跌破立即解除质押卖出（需承受解锁期）
> - **长期思维**：只质押长期看好的链（币价波动不影响）
> 核心：质押收益3-15%/年，币价可能±30%/月，关键在选币

---

## ✅ 执行清单

### 研究阶段
- [ ] 根据持仓选择1-3条链进行质押
- [ ] 阅读各链质押文档（官网Staking页面）
- [ ] 对比收益/解锁期/风险（参考本指南表格）
- [ ] 确定质押方式（独立/委托/流动性/CEX）

### 准备阶段
- [ ] 安装对应钱包（Keplr/Phantom/Polkadot.js等）
- [ ] 转入代币到钱包（小额测试）
- [ ] 研究验证者选择标准（佣金/在线率/投票率）
- [ ] 计算预期收益（本金×APR×时间）

### 质押阶段
- [ ] 选择2-3个验证者分散风险
- [ ] 执行质押操作（保留截图）
- [ ] 记录质押信息（验证者地址/金额/日期）
- [ ] 设置日历提醒（检查收益/解锁日期）

### 维护阶段
- [ ] 每周检查收益到账情况
- [ ] 每月审查验证者表现（更换表现差的）
- [ ] 定期Claim+Restake（Cosmos等需手动）
- [ ] 关注链升级公告（可能影响质押）
- [ ] 记录税务信息（Staking收益需报税）

### 优化阶段
- [ ] 尝试流动性质押（如stETH用于Curve池）
- [ ] 参与链上治理投票（提高空投资格）
- [ ] 对比不同验证者实际收益（切换更优）
- [ ] 定期再平衡（高收益链增仓、低收益链减仓）

---

## 🎓 延伸资源

- **Staking Rewards**（https://www.stakingrewards.com）：实时查询各链APR
- **Mintscan**（https://www.mintscan.io）：Cosmos生态浏览器
- **Subscan**（https://www.subscan.io）：Polkadot/Kusama浏览器
- **各链官方质押指南**：
  - Ethereum：https://ethereum.org/en/staking/
  - Cosmos：https://hub.cosmos.network/validators
  - Polkadot：https://wiki.polkadot.network/docs/learn-staking

---

## 🔚 结语

PoS质押是加密货币**最稳健的被动收益方式**：
- ✅ 无需盯盘交易（躺赚）
- ✅ 支持网络去中心化（做贡献）
- ✅ 3-15% APR年化收益（远超传统理财）

**选择建议**：
1. **新手**：从Cardano（无Slashing）或Ethereum Lido（主流）开始
2. **进阶**：增加Cosmos（高收益+空投）、Solana（中等收益）
3. **高阶**：Polkadot直接提名（高收益，需研究）

**记住**：
- 质押≠锁定看涨（币价可能跌）
- 高收益=高风险/低流动性（Cosmos 10-15%但锁21天）
- 分散投资永远是王道（不要All-in单链）

愿你的质押之旅收益稳定，复利滚雪球！💰🚀
`,

  steps: [
    { step_number: 1, title: '选择质押公链', description: '根据持仓和风险偏好选择1-3条链：新手选Cardano/Ethereum Lido，追求收益选Cosmos/Polkadot，活跃生态选Solana。对比APR、解锁期、Slashing风险。', estimated_time: '2-3 小时' },
    { step_number: 2, title: '安装钱包与转账', description: '安装对应钱包（Keplr for Cosmos, Phantom for Solana, Polkadot.js等），创建钱包备份助记词，从CEX转入小额测试（如10-100 USD），验证转账成功。', estimated_time: '1-2 小时' },
    { step_number: 3, title: '选择验证者并质押', description: '研究验证者（查看佣金5-10%、在线率>99%、投票参与率），分散选择2-3个验证者，执行质押操作，记录质押信息（验证者地址、金额、日期），设置日历提醒。', estimated_time: '1-2 小时' },
    { step_number: 4, title: '监控与收益管理', description: '每周检查收益到账（Keplr/钱包Dashboard），Cosmos等链需手动Claim+Restake实现复利，每月审查验证者表现（更换表现差的），记录收益用于税务申报。', estimated_time: '每周30分钟' },
    { step_number: 5, title: '优化与再平衡', description: '尝试流动性质押（stETH/mSOL用于DeFi赚取额外收益），参与链上治理投票（提高空投资格），每季度对比实际收益率，再平衡仓位（增加高收益链、减少低收益链）。', estimated_time: '每季度2-3小时' },
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

    console.log('\n✅ 主流PoS公链质押收益对比指南创建成功!');
    console.log(`   ID: ${response.data.data.id}`);
    console.log(`   Slug: ${response.data.data.slug}`);
    console.log(`   访问: http://localhost:3000/strategies/${response.data.data.slug}\n`);
  } catch (error) {
    console.error('\n❌ 创建失败:', error.response?.data || error.message);
  }
}

addGuide();
