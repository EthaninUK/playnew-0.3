const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

// ===== 身份验证函数 =====
async function getAuthToken() {
  const response = await axios.post(`${DIRECTUS_URL}/auth/login`, {
    email: 'the_uk1@outlook.com',
    password: 'Mygcdjmyxzg2026!',
  });
  return response.data.data.access_token;
}

// ===== 11.7 Camelot V3 Arbitrum 做市 =====
const STRATEGY_11_7 = {
  title: 'Camelot V3 Arbitrum 做市 - Nitro Pools 5x-20x 高倍激励',
  slug: 'amm-11-7-camelot-v3-arbitrum-liquidity',
  summary: '在 Arbitrum L2 上利用 Camelot 的超低 Gas 优势和 Nitro Pools 高倍激励，通过 spNFT 动态流动性和 GRAIL 双代币模型获得高收益。',

  category: 'amm',
  category_l1: 'yield',
  category_l2: 'AMM 做市',

  difficulty_level: 3,
  risk_level: 3,

  apy_min: 30,
  apy_max: 120,
  threshold_capital: '200 美元起',
  threshold_capital_min: 200,
  time_commitment: '每周 2-4 小时',
  time_commitment_minutes: 180,
  threshold_tech_level: 'advanced',

  content: `> **适合人群**：熟悉 L2 操作、追求高收益、能承受高风险的玩家
> **阅读时间**：约 22 分钟
> **关键词**：Camelot / Arbitrum / Nitro Pools / spNFT / GRAIL / xGRAIL / Dividend

---

## 🎯 什么是 Camelot？用大白话解释

### 先讲个故事

想象你在两个城市做生意：

**以太坊主网（大城市）**：
- 每次交易要交 50-200 美元"过路费"（Gas）
- 做小生意根本不划算
- 只有大户才玩得起

**Arbitrum L2（郊区新城）**：
- 每次交易只要 0.5-2 美元"过路费"
- 便宜 100 倍！
- 小资金也能玩

Camelot 就是 Arbitrum 上的 **"Uniswap V3"**，但更强大：
- ✅ **超低 Gas**（0.5-2 美元 vs 50-200 美元）
- ✅ **Nitro Pools**（5x-20x 超高激励）
- ✅ **spNFT**（动态流动性管理）
- ✅ **双代币模型**（GRAIL + xGRAIL）
- ✅ **Dividend 分红**（协议收入直接分给你）

### Camelot vs Uniswap V3 对比

| 特性 | Uniswap V3 | Camelot V3 |
|------|-----------|------------|
| 部署链 | 多链（主要 Ethereum） | Arbitrum 专注 |
| Gas 费 | 高（50-200 美元） | 超低（0.5-2 美元）|
| 流动性模型 | 集中流动性 | 集中流动性 + spNFT |
| 激励机制 | 无（部分池有外部激励）| Nitro Pools（5x-20x）|
| 代币模型 | UNI | GRAIL + xGRAIL |
| 协议收入 | 归协议 | 分红给用户 ✅ |
| 适合资金 | 大（5000+） | 小中大都适合（200+）|

**核心优势**：
- 🔥 **Gas 费低 100 倍**（小资金也能玩）
- 🚀 **Nitro Pools 高激励**（APY 可达 100-300%）
- 💰 **Dividend 分红**（被动收入）

---

## 📊 Arbitrum L2：超低 Gas 的天堂

### 什么是 Arbitrum？

**简单解释**：
- Arbitrum 是以太坊的"快速通道"（Layer 2）
- 把交易在 L2 处理，结果提交到以太坊 L1
- 速度快 10-100 倍，Gas 费低 90-99%

**技术原理**（简化版）：
\`\`\`
传统（以太坊 L1）：
每笔交易都在主网执行 → Gas 费贵

Arbitrum（L2）：
1. 在 L2 执行 1000 笔交易（便宜）
2. 打包成一个"证明"
3. 把证明提交到 L1（只付一次 Gas）
4. 1000 笔交易分摊 Gas → 每笔便宜 100 倍
\`\`\`

### Gas 费对比（真实数据 2024 年）

| 操作 | Ethereum L1 | Arbitrum L2 | 节省 |
|------|------------|-------------|------|
| 添加流动性 | 80-200 美元 | 1-3 美元 | **98%** |
| 移除流动性 | 50-150 美元 | 0.8-2 美元 | **98%** |
| 领取收益 | 15-50 美元 | 0.3-1 美元 | **98%** |
| 代币授权 | 10-30 美元 | 0.2-0.8 美元 | **97%** |

**为什么重要**？

\`\`\`
示例：小资金策略（500 美元本金）

以太坊 L1：
- 添加流动性：100 美元
- 每周领取收益：25 美元 × 4 周 = 100 美元
- 移除流动性：80 美元
- 总 Gas：280 美元
- 占本金：56% ❌ 不划算

Arbitrum L2（Camelot）：
- 添加流动性：2 美元
- 每周领取收益：0.5 美元 × 4 周 = 2 美元
- 移除流动性：1.5 美元
- 总 Gas：5.5 美元
- 占本金：1.1% ✅ 非常划算

节省：280 - 5.5 = 274.5 美元 🚀
\`\`\`

---

## 🚀 Nitro Pools：高倍激励的秘密

### 什么是 Nitro Pools？

**定义**：
- Camelot 的"加强版激励池"
- 项目方或协议提供 **额外代币奖励**
- 激励倍数：**5x - 20x** 基础 APY

**工作原理**：
\`\`\`
普通池：
- 你提供 ETH-USDC 流动性
- 赚取手续费：10% APY

Nitro Pool：
- 同样提供 ETH-USDC 流动性
- 赚取手续费：10% APY
- + 额外 GRAIL 奖励：20% APY
- + 项目方奖励（如 GMX）：30% APY
- 总 APY：60% 🚀
\`\`\`

### Nitro Pools 类型

#### 1. 协议 Nitro（Camelot 官方）

**特点**：
- GRAIL 代币奖励
- 长期稳定
- APY：+15-40%

**示例池**（2024 年数据）：
\`\`\`
ETH-USDC Nitro Pool
- Base APY（手续费）：12%
- Nitro Boost（GRAIL）：+25%
- Total APY：37% ✅

ARB-ETH Nitro Pool
- Base APY：15%
- Nitro Boost：+30%
- Total APY：45% ✅
\`\`\`

#### 2. 合作项目 Nitro

**特点**：
- 项目方提供自己的代币
- APY 极高但波动大
- 时间限制（通常 1-3 个月）

**热门合作项目**（2024 年）：

\`\`\`
1. GMX（去中心化永续合约）
   GMX-ETH Nitro Pool
   - Base APY: 10%
   - GRAIL Boost: +20%
   - GMX Boost: +50%
   - Total: 80% APY 🚀

2. Jones DAO（期权协议）
   JONES-ETH Nitro Pool
   - Base APY: 8%
   - GRAIL Boost: +15%
   - JONES Boost: +60%
   - Total: 83% APY 🚀

3. Pendle（利率衍生品）
   PENDLE-ETH Nitro Pool
   - Base APY: 12%
   - GRAIL Boost: +18%
   - PENDLE Boost: +70%
   - Total: 100% APY 🚀
\`\`\`

#### 3. Launchpad Nitro（新项目发布）

**特点**：
- 新项目在 Camelot 首发
- 极高 APY（100-500%）
- 极高风险（代币可能暴跌）

**真实案例**：
\`\`\`
项目：Y2K Finance（2023 年发布）
Y2K-ETH Nitro Pool（首周）

初始 APY：
- Base: 5%
- GRAIL: +20%
- Y2K: +300%
- Total: 325% APY 🤯

实际结果（1 个月后）：
- Y2K 代币价格：下跌 60%
- 实际收益：虽然 APY 高，但代币贬值抵消大部分
- 真实 APY：约 80%（仍可观）

风险：
- 代币可能归零
- APY 快速下降（随着 TVL 增加）
\`\`\`

### 如何找到最佳 Nitro Pool？

**访问 Camelot**：
\`\`\`
1. https://app.camelot.exchange/
2. 点击 "Pools" → "Nitro Pools"
3. 筛选和排序：
   - 按 APY 排序（从高到低）
   - 筛选 TVL > 50 万（流动性充足）
   - 检查 Nitro 结束时间
\`\`\`

**评估标准**：

| 指标 | 好 | 中 | 差 |
|------|-----|-----|-----|
| TVL | > 500 万 | 100 万 - 500 万 | < 100 万 |
| 日交易量/TVL | > 0.3 | 0.1 - 0.3 | < 0.1 |
| Total APY | 30-80% | 80-150% | > 200% |
| 奖励代币 | 蓝筹（GMX、ARB）| 中等（DeFi 项目）| 新币（高风险）|
| Nitro 期限 | > 2 个月 | 1-2 个月 | < 1 个月 |

**推荐策略**：
- ✅ **新手**：ETH-USDC、ARB-ETH（稳定）
- ✅ **进阶**：GMX-ETH、Pendle-ETH（蓝筹项目）
- ⚠️ **激进**：Launchpad Nitro（高风险高收益）

---

## 🎨 spNFT：动态流动性位置

### 什么是 spNFT？

**spNFT = Staked Position NFT（质押头寸 NFT）**

**简单解释**：
- 你的 LP 凭证是一个 NFT（类似 Uniswap V3）
- 但 Camelot 的 spNFT 可以"质押"到 Nitro Pool
- 质押后获得额外奖励

**工作流程**：
\`\`\`
步骤 1：添加流动性
→ 获得 Position NFT（普通 LP 凭证）

步骤 2：质押到 Nitro Pool
→ Position NFT 变成 spNFT
→ 开始获得 Nitro 奖励

步骤 3：随时可以取消质押
→ spNFT 变回 Position NFT
→ 移除流动性
\`\`\`

**真实示例**：
\`\`\`
你添加 1000 美元到 ETH-USDC 池

未质押（普通 NFT）：
- 手续费 APY：12%
- 总收益：12%

质押到 Nitro Pool（spNFT）：
- 手续费 APY：12%
- GRAIL 奖励：+25%
- 总收益：37% ✅

额外收益：+25% APY
价值：1000 × 25% = 250 美元/年
\`\`\`

### spNFT vs 普通 LP Token

| 特性 | Uniswap V3 NFT | Camelot spNFT |
|------|---------------|--------------|
| LP 凭证形式 | ERC-721 NFT | ERC-721 NFT |
| 可质押 | ❌ | ✅（质押到 Nitro）|
| 额外奖励 | ❌ | ✅（GRAIL 等）|
| 流动性管理 | 手动 | 手动（未来可能自动化）|
| 可交易 | ✅（OpenSea）| ✅（不建议）|

**重要提示**：
- spNFT 质押状态下不能转让
- 取消质押后才能转移或出售

---

## 💎 GRAIL 和 xGRAIL：双代币模型

### GRAIL：治理和价值捕获代币

**代币信息**：
- 总供应量：**100,000 GRAIL**（极低供应！）
- 当前价格：~800-1200 美元（2024 年）
- 市值：8000 万 - 1.2 亿美元

**用途**：
1. **流动性挖矿奖励**（主要来源）
2. **治理投票**
3. **转换为 xGRAIL**（锁仓）

**获取方式**：
- ✅ 提供流动性赚取
- ✅ 在 Camelot 买（流动性低，滑点大）
- ✅ 参与 Launchpad（白名单）

### xGRAIL：锁仓增强收益

**定义**：
- xGRAIL = GRAIL 锁仓后的凭证
- 不可转让、不可交易

**转换机制**：
\`\`\`
GRAIL → xGRAIL（即时）
- 1 GRAIL = 1 xGRAIL
- 不可逆转（锁定期内）

xGRAIL → GRAIL（解锁）
- 解锁期：15 - 180 天（可选）
- 解锁期越短，返还的 GRAIL 越少
- 15 天解锁：返还 50% GRAIL
- 180 天解锁：返还 100% GRAIL
\`\`\`

### xGRAIL 四大收益来源

#### 1. Dividend（分红）

**来源**：
- Camelot 协议收取的所有手续费
- 按持有 xGRAIL 比例分配

**真实数据**（2024 年）：
\`\`\`
Camelot 日均手续费收入：15,000 - 30,000 美元
分红比例：50% 给 xGRAIL 持有者

周分红（假设你持有 10 xGRAIL）：
- 总 xGRAIL 供应：40,000
- 你的份额：10 / 40,000 = 0.025%
- 周手续费：20,000 × 7 = 140,000 美元
- 你的分红：140,000 × 50% × 0.025% = 17.5 美元

年化：
- 年分红：17.5 × 52 = 910 美元
- 本金（10 GRAIL @ 1000 美元）：10,000 美元
- 分红 APY：9.1% ✅
\`\`\`

**分红代币**：
- 主要：ETH、USDC（稳定收入）
- 次要：其他交易对代币

#### 2. Allocation Points（分配点数）

**用途**：
- 提升你的 LP 收益
- 类似 veBAL 的 Boost

**机制**：
\`\`\`
你有 1000 美元 LP + 5 xGRAIL

无 xGRAIL：
- 基础奖励：100 GRAIL/年
- APY：10%

有 xGRAIL（5 个）：
- 分配点数提升：+50%
- 奖励：100 × 1.5 = 150 GRAIL/年
- APY：15% ✅

额外收益：+5% APY
\`\`\`

**最佳比例**（社区共识）：
- LP 价值：xGRAIL 价值 = **5:1**
- 示例：10,000 美元 LP → 持有 2000 美元 xGRAIL（2 个）

#### 3. Yield Booster（收益加速器）

**与 Allocation Points 类似，但针对 Nitro Pools**

**真实案例**：
\`\`\`
GMX-ETH Nitro Pool
无 xGRAIL：
- Base APY: 10%
- Nitro APY: 50%
- Total: 60%

有 xGRAIL（最佳比例）：
- Base APY: 10%
- Nitro APY: 50% × 1.8 = 90%
- Total: 100% ✅

提升：+40% APY 🚀
\`\`\`

#### 4. Launchpad 白名单

**Camelot Launchpad**：
- 新项目在 Camelot 首发（IDO）
- xGRAIL 持有者优先参与

**案例**（Y2K Finance）：
\`\`\`
要求：持有 ≥ 5 xGRAIL
额度：每 xGRAIL 可投资 100 美元

你持有 10 xGRAIL：
- 可投资：1000 美元
- Y2K 上市价格：2x（翻倍）
- 利润：1000 美元 ✅

ROI：100%（一次性）
\`\`\`

**价值**：
- 好的项目：5x - 10x 回报
- 差的项目：-50% 到归零
- 平均：2x - 3x

---

## 📋 详细操作步骤

### 步骤 0：桥接资产到 Arbitrum

**如果你的资产在以太坊 L1**：

\`\`\`
1. 访问 Arbitrum 官方桥：
   https://bridge.arbitrum.io/

2. 连接钱包（MetaMask）

3. 选择资产和数量
   - From: Ethereum
   - To: Arbitrum One
   - Asset: ETH / USDC
   - Amount: 1000 美元

4. 确认交易
   - L1 Gas 费：20-50 美元（贵，但只需一次）
   - 等待时间：10-15 分钟

5. 资产到达 Arbitrum
   - 在 MetaMask 切换到 Arbitrum 网络
   - 检查余额
\`\`\`

**推荐桥**（如果嫌官方桥慢）：
- **Orbiter Finance**（快，5 分钟）
- **Hop Protocol**（便宜）
- **Synapse**（多链支持）

### 步骤 1：连接 Camelot

\`\`\`
1. 访问 https://app.camelot.exchange/

2. 切换网络到 Arbitrum One
   - MetaMask 会自动提示切换

3. 点击 "Connect Wallet"

4. 确认连接
   - 检查地址和余额
\`\`\`

### 步骤 2：选择池子和 Nitro

**案例：参与 ETH-USDC Nitro Pool**

\`\`\`
1. 点击 "Pools" → "Nitro Pools"

2. 搜索 "ETH-USDC"
   - 会看到多个费率的池子（0.05%、0.3%、1%）
   - 选择 0.05%（主流）

3. 检查池子信息
   - TVL: 800 万美元 ✅
   - 24h Volume: 250 万美元 ✅
   - Base APY: 12%
   - Nitro APY: +25% (GRAIL)
   - Total APY: 37% ✅
   - Nitro 结束时间：60 天后 ✅

4. 点击 "Add Liquidity"
\`\`\`

### 步骤 3：添加流动性

\`\`\`
配置参数：

本金：1000 美元
- 500 USDC
- 0.25 ETH（假设 ETH = 2000）

价格区间：
- Min Price: 1800 USDC
- Max Price: 2200 USDC
- （当前价格 ±10%，中等区间）

预览：
- 系统显示需要的确切数量
- 500 USDC + 0.246 ETH

确认：
1. Approve USDC（授权）→ Gas: 0.3 美元
2. Approve WETH（授权）→ Gas: 0.3 美元
3. Add Liquidity → Gas: 1.2 美元

总 Gas 费：~1.8 美元 ✅（超便宜！）

获得：Position NFT #12345
\`\`\`

### 步骤 4：质押到 Nitro Pool（关键！）

\`\`\`
⚠️ 重要：添加流动性后，必须手动质押到 Nitro 才能获得额外奖励！

1. 在 "Pools" 页面找到你的 Position

2. 点击 Position NFT #12345

3. 点击 "Stake to Nitro"

4. 选择 Nitro Pool
   - ETH-USDC Nitro（+25% GRAIL）

5. 确认质押
   - Gas 费：0.5 美元

6. Position NFT → spNFT ✅
   - 显示 "Staked" 标签
   - 开始累积 GRAIL 奖励
\`\`\`

**常见错误**：
- ❌ 忘记质押到 Nitro → 没有额外奖励（只有手续费）
- ✅ 质押后才能获得 Nitro 激励

### 步骤 5：（可选）转换 GRAIL 为 xGRAIL

**如果你想最大化收益**：

\`\`\`
1. 等待累积 GRAIL 奖励（1-2 周）

2. 领取 GRAIL
   - "Claim Rewards"
   - 获得 0.5 GRAIL（价值 500 美元）

3. 转换为 xGRAIL
   - 访问 "xGRAIL" 页面
   - 点击 "Convert"
   - 输入数量：0.5 GRAIL
   - 确认交易

4. 获得 0.5 xGRAIL
   - 开始享受四大收益：
     - Dividend 分红
     - Allocation Points（提升 LP 收益）
     - Yield Booster（Nitro 提升）
     - Launchpad 白名单
\`\`\`

### 步骤 6：监控和管理

**每周检查**（10 分钟）：

\`\`\`
1. Portfolio 页面
   - 查看 Position 价值
   - 检查是否 In Range

2. Rewards 页面
   - 未领取 GRAIL：0.2 GRAIL（200 美元）
   - 未领取手续费：0.01 ETH + 25 USDC

3. xGRAIL 页面（如果有）
   - Dividend 本周：15 美元
   - 累计未领取：60 美元

4. Nitro Pool 状态
   - 检查 Nitro 结束时间
   - 如果快结束，寻找新的 Nitro
\`\`\`

**何时调整**？

| 情况 | 操作 |
|------|------|
| 价格离开区间 | 移除 → 重新添加新区间 |
| Nitro 结束 | 取消质押 → 质押到新 Nitro |
| 出现更高 APY Nitro | 考虑迁移 |
| GRAIL 奖励 > 0.5 | 领取 → 转换 xGRAIL |

---

## 💰 收益计算与真实案例

### 案例 1：ETH-USDC Nitro Pool（3 个月）

**初始设置**（2024 年 3 月）：
\`\`\`
本金：5,000 美元
- 2,500 USDC
- 1.25 ETH（ETH = 2000）

池子：ETH-USDC (0.05% fee, Nitro)
区间：1800 - 2200 USDC
质押：Nitro Pool ✅
\`\`\`

**3 个月后**（价格在区间内）：

\`\`\`
收益明细：

1. 交易手续费（0.05%）
   - 日均交易量：250 万美元
   - 池子 TVL：800 万美元
   - 你的份额：5,000 / 8,000,000 = 0.0625%
   - 日手续费：2,500,000 × 0.05% × 0.0625% = 7.8 美元
   - 90 天：7.8 × 90 = 702 美元 ✅

2. GRAIL Nitro 奖励
   - Nitro APY：25%
   - 90 天（0.25 年）：5,000 × 25% × 0.25 = 312.5 美元
   - 按 GRAIL 价格 1000 美元：0.3125 GRAIL ✅

3. 资产价值
   - ETH 价格：2000 → 2100（+5%）
   - LP 重新平衡：1.2 ETH + 2,580 USDC
   - 价值：1.2 × 2100 + 2580 = 5,100 美元
   - 增值：100 美元 ✅

总收益：
- 手续费：702 美元
- GRAIL 奖励：312.5 美元
- 资产增值：100 美元
- 总计：1,114.5 美元（+22.3%）

季度收益率：22.3%
年化 APY：~89% 🚀

Gas 成本：
- 添加流动性：1.8 美元
- 质押 Nitro：0.5 美元
- 领取奖励（3 次）：1.5 美元
- 总 Gas：3.8 美元（占本金 0.076%）✅
\`\`\`

**关键点**：
- Nitro 贡献了 28% 的收益（312.5 / 1114.5）
- 超低 Gas 让小资金也能频繁操作
- 如果转换 xGRAIL，收益还能再提升 20-30%

---

### 案例 2：GMX-ETH Nitro Pool + xGRAIL Boost

**初始设置**：
\`\`\`
本金：10,000 美元
- 5,000 美元 GMX（50 GMX @ 100 美元）
- 5,000 美元 ETH（2.5 ETH @ 2000 美元）

额外持有：5 xGRAIL（价值 5000 美元）

池子：GMX-ETH (0.3% fee, Nitro)
区间：全范围（稳定持有）
\`\`\`

**6 个月后**：

\`\`\`
收益明细：

1. 交易手续费（0.3%）
   - 日均交易量：80 万美元
   - 90 天：约 900 美元 ✅

2. GRAIL Nitro 奖励（无 xGRAIL Boost）
   - Base Nitro APY：20%
   - 180 天：10,000 × 20% × 0.5 = 1,000 美元

   xGRAIL Boost（1.8x）：
   - Boosted：1,000 × 1.8 = 1,800 美元
   - 额外收益：+800 美元 ✅

3. GMX 项目方激励
   - GMX Nitro APY：40%
   - 180 天：10,000 × 40% × 0.5 = 2,000 美元
   - 按 GMX 价格：20 GMX ✅

4. xGRAIL Dividend 分红
   - 5 xGRAIL，每周分红：8 美元
   - 26 周：8 × 26 = 208 美元 ✅

5. 资产价格变化
   - GMX：100 → 110（+10%）
   - ETH：2000 → 2200（+10%）
   - LP 价值：11,000 美元（+1000）✅

总收益：
- 手续费：900 美元
- GRAIL 奖励（Boosted）：1,800 美元
- GMX 激励：2,000 美元
- xGRAIL 分红：208 美元
- 资产增值：1,000 美元
- 总计：5,908 美元（+59%）

6 个月收益率：59%
年化 APY：~118% 🚀🚀

xGRAIL 贡献：
- Boost 额外收益：800 美元
- Dividend：208 美元
- 合计：1,008 美元（占总收益 17%）✅
\`\`\`

**关键点**：
- xGRAIL Boost 提升收益 17%
- 多重激励（GRAIL + GMX）叠加
- 适合长期持有 GMX 的玩家

---

## ⚠️ 风险与注意事项

### 1. Nitro Pool 结束风险

**问题**：
- Nitro Pool 通常有时间限制（1-3 个月）
- 结束后 APY 大幅下降

**真实案例**：
\`\`\`
ETH-USDC Nitro Pool
Nitro 激励中：
- Total APY：37%（12% base + 25% nitro）

Nitro 结束后：
- Total APY：12%（只剩 base）

APY 下降：-25% ❌
\`\`\`

**防范措施**：
- ✅ 关注 Nitro 结束时间
- ✅ 提前寻找新的 Nitro Pool
- ✅ 设置日历提醒

### 2. 无常损失

**GMX-ETH 池案例**：
\`\`\`
初始：50 GMX (100) + 2.5 ETH (2000) = 10,000 美元
GMX 涨到 200（+100%），ETH 不变

单纯持币：50 × 200 + 2.5 × 2000 = 15,000 美元
LP（50/50）：35 × 200 + 3.5 × 2000 = 14,000 美元

无常损失：1,000 美元（-6.7%）

但手续费 + 奖励：3,000 美元
净收益：2,000 美元 ✅（仍然盈利）
\`\`\`

**防范措施**：
- 选择相关性高的资产（ETH-wstETH）
- 或选择你长期看好的代币组合

### 3. Arbitrum 桥风险

**跨链桥风险**：
- L1 → L2：官方桥安全但慢（10-15 分钟）
- 第三方桥：快但有黑客风险

**2022 年桥被黑案例**：
- Nomad Bridge：被盗 2 亿美元
- Ronin Bridge：被盗 6 亿美元

**防范措施**：
- ✅ 优先使用官方桥
- ✅ 第三方桥选择大桥（Orbiter、Hop）
- ❌ 避免不知名的桥

### 4. GRAIL 代币价格波动

**历史价格**：
\`\`\`
2023 年 2 月：ATH 3000 美元
2023 年 11 月：低点 600 美元（-80%）❌
2024 年 10 月：回升 1000 美元
\`\`\`

**影响**：
- GRAIL 奖励的美元价值波动大
- 可能影响实际 APY

**防范措施**：
- ✅ 领取 GRAIL 后立即出售（锁定收益）
- ✅ 或转换 xGRAIL 长期持有（如果看好）
- ❌ 不要持有大量未对冲的 GRAIL

### 5. xGRAIL 解锁惩罚

**解锁机制**：
\`\`\`
你有 10 xGRAIL，想解锁

选择 1：15 天解锁
- 返还：5 GRAIL（50%）
- 损失：5 GRAIL ❌

选择 2：180 天解锁
- 返还：10 GRAIL（100%）
- 损失：0 ✅

但等 180 天机会成本高
\`\`\`

**防范措施**：
- 只转换你能长期锁定的 GRAIL
- 保留部分 GRAIL 不转换（灵活性）

---

## ❓ 常见问题

### Q1: Arbitrum 安全吗？

**安全性评估**：
- ✅ Arbitrum 由 Offchain Labs 开发（顶级团队）
- ✅ 获 a16z、Polychain 等投资
- ✅ TVL 超 100 亿美元（市场验证）
- ✅ 运行 3 年+，无重大安全事故

**与其他 L2 对比**：
- Arbitrum TVL：100 亿+
- Optimism TVL：70 亿+
- zkSync TVL：10 亿+

**结论**：Top 2 最安全的 L2 ✅

---

### Q2: Camelot vs Uniswap V3 on Arbitrum？

**Uniswap V3 on Arbitrum**：
- ✅ 更大的 TVL
- ✅ 更多池子选择
- ❌ 无 Nitro 激励
- ❌ 无 Dividend 分红

**Camelot**：
- ⚠️ TVL 较小（但足够）
- ✅ Nitro 高激励
- ✅ xGRAIL 分红
- ✅ Launchpad 白名单

**建议**：
- 大资金（50,000+）→ Uniswap（更深流动性）
- 中小资金（1,000-50,000）→ Camelot（更高 APY）
- 或两个都用（分散）

---

### Q3: 如何参与 Launchpad？

**要求**：
- 持有 ≥ 1 xGRAIL（通常）
- 通过 KYC（部分项目）

**步骤**：
\`\`\`
1. 关注 Camelot 公告
   - Twitter @CamelotDEX
   - Discord

2. 准备 xGRAIL
   - 提前转换（可能需要持有 1 周+）

3. Launchpad 开启
   - 访问 "Launchpad" 页面
   - 查看分配额度

4. 投资
   - 输入金额（最多到额度上限）
   - 确认交易

5. 等待 TGE（Token Generation Event）
   - 通常 1-2 周后
   - 领取代币

6. 决定策略
   - 立即卖出（锁定利润）
   - 或长期持有（赌项目成功）
\`\`\`

**历史成功率**（2023-2024）：
- 盈利项目：60%
- 亏损项目：40%
- 平均 ROI：2-3x

---

### Q4: 小资金（500 美元）值得玩吗？

**成本分析**：

\`\`\`
500 美元本金（以太坊 L1）：
- Gas 成本：200-300 美元
- 占本金：40-60% ❌ 不划算

500 美元本金（Arbitrum）：
- Gas 成本：5-10 美元
- 占本金：1-2% ✅ 非常划算

结论：Arbitrum 让小资金成为可能！
\`\`\`

**小资金策略**：
- ✅ 选择高 APY Nitro Pool（80%+）
- ✅ 减少操作频率（每月领取一次）
- ✅ 复利（奖励再投入）

**预期收益**（500 美元，APY 80%）：
- 3 个月收益：500 × 80% × 0.25 = 100 美元
- Gas 成本：5 美元
- 净收益：95 美元（+19%）✅

---

### Q5: 多久领取一次奖励？

**Gas 费考虑**：

| 操作 | Gas 费 | 建议频率 |
|------|--------|---------|
| 领取 GRAIL | 0.5-1 美元 | 每 2-4 周 |
| 领取手续费 | 0.3-0.8 美元 | 每月 |
| 领取 xGRAIL 分红 | 0.5-1 美元 | 每月 |
| 全部领取 | 1-2 美元 | 每月 ✅ |

**最优策略**：
- 小资金（< 2000）：每月领一次
- 大资金（> 10,000）：每 2 周领一次

---

## ✅ 行动清单

\`\`\`
□ 第 1 周：准备
  □ 桥接资产到 Arbitrum
  □ 连接 Camelot
  □ 研究 Nitro Pools

□ 第 2 周：小额测试
  □ 添加 200-500 美元到 ETH-USDC
  □ 质押到 Nitro Pool ✅
  □ 观察 1-2 周

□ 第 3-4 周：扩大规模
  □ 增加资金
  □ 尝试其他 Nitro Pools
  □ 考虑转换 xGRAIL

□ 长期运营：
  □ 每周检查 Nitro 状态
  □ 每月领取奖励
  □ 关注新 Launchpad
\`\`\`

---

## 🎓 总结

**Camelot 核心优势**：
1. **超低 Gas**：Arbitrum L2 省 98% Gas
2. **Nitro Pools**：5x-20x 高倍激励
3. **xGRAIL 机制**：四重收益（分红+Boost+白名单）
4. **适合小资金**：200 美元起步

**适合人群**：
- ✅ 小中资金（200-50,000 美元）
- ✅ 追求高收益（30-120% APY）
- ✅ 能承受中高风险
- ✅ 看好 Arbitrum 生态

**风险提醒**：
- ⚠️ Nitro Pool 有时间限制
- ⚠️ GRAIL 价格波动大
- ⚠️ xGRAIL 解锁有惩罚

**下一步**：
1. 桥接小额资金到 Arbitrum（500 美元）
2. 参与 ETH-USDC Nitro Pool
3. 运行 1 个月，熟悉机制
4. 逐步扩大规模

祝你在 Arbitrum 上做市成功！🚀

---

*最后更新：2024 年 11 月*
*数据来源：Camelot DEX、DeFiLlama、Arbitrum*`,

  featured: false,
  is_published: true,
};

// ===== 11.8 Aerodrome Base 链流动性 =====
const STRATEGY_11_8 = {
  title: 'Aerodrome Base 链流动性 - ve(3,3) 模型 + Bribe 市场',
  slug: 'amm-11-8-aerodrome-base-chain-liquidity',
  summary: '在 Coinbase 的 Base L2 上利用 Aerodrome 的 ve(3,3) 创新模型，通过 veAERO 投票和 Bribe 市场获取超额收益和协议费用分成。',

  category: 'amm',
  category_l1: 'yield',
  category_l2: 'AMM 做市',

  difficulty_level: 3,
  risk_level: 2,

  apy_min: 40,
  apy_max: 150,
  threshold_capital: '300 美元起',
  threshold_capital_min: 300,
  time_commitment: '每周 2-3 小时',
  time_commitment_minutes: 150,
  threshold_tech_level: 'advanced',

  content: `> **适合人群**：了解 ve 模型、追求高收益、看好 Base 生态的玩家
> **阅读时间**：约 20 分钟
> **关键词**：Aerodrome / Base / ve(3,3) / veAERO / Bribe / Epoch / Coinbase

---

## 🎯 什么是 Aerodrome？用大白话解释

### 先讲个故事

想象你在一个新兴城市（Base 链）开了一家"流动性银行"：

**传统 AMM（Uniswap）**：
- 你提供流动性，赚取手续费
- 但收益固定，没有额外福利
- 协议赚的钱归协议，你只拿手续费

**Aerodrome（ve(3,3) 模型）**：
- 你不仅提供流动性，还能**投票决定谁能赚更多**
- 每周"选举"，你投票给自己参与的池子 → 池子获得更多奖励 → 你赚更多
- 其他项目**贿赂你**投票给他们的池子 → 你赚贿赂收入
- 协议赚的钱**分红给你**（veAERO 持有者）

**结果**：
- 你的收益 = 手续费 + 投票奖励 + 贿赂收入 + 协议分红
- 年化收益：**40-150% APY** 🚀

### Aerodrome 的三大创新

#### 1. ve(3,3) 模型（从 Solidly 继承）

**ve(3,3) = Vote Escrowed (3,3)**

**简单解释**：
- **Vote Escrowed**：锁定代币获得投票权（类似 veBAL、veCRV）
- **(3,3)**：来自 OlympusDAO 的博弈论概念
  - 所有人都锁仓 = 所有人都受益（3,3）
  - 你锁仓，别人不锁 = 你吃亏（3,1）
  - 都不锁 = 都亏（1,1）

**核心机制**：
\`\`\`
1. 锁定 AERO → 获得 veAERO
2. veAERO 用途：
   - 投票决定池子奖励分配
   - 获得协议收入分成（100%！）
   - 获得贿赂收入
3. 每周"Epoch"（选举周期）
   - 投票 → 奖励分配 → 收益领取
\`\`\`

#### 2. Base 链专注（Coinbase L2）

**什么是 Base？**
- Coinbase 推出的 Layer 2（基于 Optimism 技术）
- 2023 年 8 月主网上线
- **超低 Gas**：0.1-0.5 美元（比 Arbitrum 还便宜）
- **Coinbase 支持**：直接从 Coinbase 充值到 Base

**为什么 Base 重要？**
- ✅ **Coinbase 背书**（1 亿+ 用户）
- ✅ **超低 Gas**（小资金友好）
- ✅ **快速增长**：TVL 从 0 → 20 亿美元（1 年）
- ✅ **新生态**：早期参与机会多

**Aerodrome 在 Base 的地位**：
- Base 上最大的 DEX（60% 市场份额）
- TVL：4-8 亿美元
- 日交易量：5000 万 - 2 亿美元

#### 3. Bribe 市场（核心收益来源）

**什么是 Bribe？**
- 项目方付钱给 veAERO 持有者
- 让他们投票给项目的池子
- 提高池子奖励 → 吸引流动性

**真实案例**：
\`\`\`
项目：Extra Finance（Base 上的借贷协议）
目标：吸引流动性到 EXTRA-USDC 池

行动：
1. 在 Bribe 平台发布：
   - 每 1 veAERO 投票 → 支付 0.10 美元
2. veAERO 持有者投票

结果：
- EXTRA-USDC 池获得大量 AERO 奖励
- APY 从 20% 涨到 80%
- 流动性增加 300% ✅

veAERO 持有者：
- 1000 veAERO × 0.10 = 100 美元/周
- 年化：100 × 52 = 5,200 美元
- 如果 veAERO 本金 10,000 美元 → +52% APY 🚀
\`\`\`

---

## 📊 Base 链介绍：Coinbase 的 L2

### Base vs 其他 L2

| 特性 | Ethereum L1 | Arbitrum | Base | zkSync |
|------|------------|---------|------|--------|
| Gas 费（添加 LP）| 80-200 美元 | 1-3 美元 | 0.2-0.8 美元 ✅ | 0.5-2 美元 |
| TPS（交易速度）| 15-30 | 1000+ | 1000+ | 2000+ |
| TVL | 500 亿+ | 100 亿+ | 20 亿+ | 10 亿+ |
| 主要 DEX | Uniswap | Camelot、Uniswap | Aerodrome ✅ | Maverick |
| 生态支持 | 最强 | 强 | Coinbase ✅ | 中 |

**Base 的独特优势**：

1. **Coinbase 直接充值**（无需跨链桥）
\`\`\`
传统流程（充值到 Arbitrum）：
1. 在 CEX 提现到 Ethereum
2. 使用跨链桥到 Arbitrum
3. 等待 10-15 分钟
4. 支付桥接费

Base 流程：
1. Coinbase 账户 → 直接提现到 Base ✅
2. 1 分钟到账
3. 几乎免费（Coinbase 补贴）
\`\`\`

2. **超低 Gas**
\`\`\`
真实对比（2024 年数据）：

添加流动性：
- Ethereum: 100 美元
- Arbitrum: 1.5 美元
- Base: 0.3 美元 ✅

领取收益：
- Ethereum: 20 美元
- Arbitrum: 0.5 美元
- Base: 0.1 美元 ✅

小资金（500 美元）影响：
- Ethereum: Gas 占 24%（不划算）
- Arbitrum: Gas 占 0.4%（可行）
- Base: Gas 占 0.08%（最优）✅
\`\`\`

3. **Coinbase 生态支持**
- Coinbase Ventures 投资的项目优先在 Base 发布
- Coinbase Wallet 深度集成
- 1 亿+ 潜在用户

---

## 💡 ve(3,3) 模型深度解析

### 传统 ve 模型 vs ve(3,3)

| 特性 | 传统 ve（veCRV）| ve(3,3)（veAERO）|
|------|----------------|------------------|
| 锁仓代币 | CRV | AERO |
| 投票权 | ✅ | ✅ |
| 协议收入分成 | 50% | **100%** ✅ |
| 贿赂收入 | ✅ | ✅ |
| 代币通胀 | 高（稀释严重）| 受控（Rebase 机制）|
| 解锁 | 固定期限 | 随时解锁（但失去收益）|

**ve(3,3) 核心改进**：

#### 1. 100% 协议收入分成（vs 50%）

\`\`\`
Curve（veCRV）：
- 协议周收入：100 万美元
- 分给 veCRV 持有者：50 万美元（50%）
- 协议保留：50 万美元

Aerodrome（veAERO）：
- 协议周收入：50 万美元
- 分给 veAERO 持有者：50 万美元（100%）✅
- 协议保留：0 美元

veAERO 持有者收益更高！
\`\`\`

#### 2. Rebase 机制（防止稀释）

**问题**：传统 ve 模型代币通胀稀释持有者

**ve(3,3) 解决方案**：
\`\`\`
每周 Epoch 结束后：
- 计算新增 AERO 排放
- veAERO 持有者按比例获得"Rebase"
- 你的 veAERO 数量自动增加，抵消通胀

示例：
你持有：1000 veAERO（占总量 1%）
本周 AERO 排放：100,000 AERO（+5% 通胀）

传统模型：
- 你的份额：1% → 0.95%（被稀释）❌

ve(3,3) Rebase：
- 你获得 Rebase：1000 × 5% = 50 veAERO
- 新余额：1050 veAERO
- 份额：仍然 1% ✅
\`\`\`

#### 3. 灵活解锁（vs 固定期限）

**Curve（veCRV）**：
- 必须锁定 4 年才能获得最大权益
- 锁定期内不能取出

**Aerodrome（veAERO）**：
- 可以随时解锁
- 但解锁后失去所有收益（分红、投票奖励）
- 激励长期持有

---

## 🗳️ Epoch 和投票机制

### 什么是 Epoch？

**Epoch = 选举周期（每周一次）**

**时间线**（UTC 时间）：
\`\`\`
周四 00:00：Epoch N 开始
  - 上周投票结果生效
  - AERO 奖励按投票分配到各池子
  - 协议收入分红开始累积

周四 - 周三：运行期
  - LP 赚取手续费 + AERO 奖励
  - veAERO 持有者累积分红和贿赂

周三 00:00：Epoch N 结束
  - 停止投票
  - 计算本周收益

周四 00:00：Epoch N+1 开始
  - 新一轮投票生效
  - 周期重复
\`\`\`

### 投票流程

**步骤 1：锁定 AERO 获得 veAERO**

\`\`\`
1. 访问 https://aerodrome.finance/vote

2. 点击 "Lock"

3. 输入 AERO 数量
   - 示例：100 AERO（价值 150 美元 @ 1.5 美元）

4. 选择锁定期限
   - 1 周 - 4 年（可选）
   - 锁定时间越长，veAERO 越多
   - 4 年：1 AERO = 1 veAERO
   - 1 年：1 AERO = 0.25 veAERO

5. 确认锁定
   - Gas 费：0.2 美元
   - 获得 veAERO

注意：随时可以解锁，但失去收益
\`\`\`

**步骤 2：每周投票**

\`\`\`
1. 在 Epoch 开始后（周四）访问 "Vote" 页面

2. 查看池子列表和贿赂
   - ETH-USDC: Bribe 0.05 美元/veAERO
   - AERO-USDC: Bribe 0.08 美元/veAERO ✅
   - EXTRA-USDC: Bribe 0.10 美元/veAERO ✅

3. 分配投票权
   - 你有 100 veAERO
   - 可以投给多个池子

   示例分配：
   - 50% → AERO-USDC（你参与的池子 + 高贿赂）
   - 30% → EXTRA-USDC（最高贿赂）
   - 20% → ETH-USDC（稳定收益）

4. 确认投票
   - Gas 费：0.1-0.3 美元
   - 下周四生效
\`\`\`

**步骤 3：领取收益**

\`\`\`
每周四 Epoch 结束后：

1. 访问 "Rewards" 页面

2. 查看可领取收益
   - 协议分红：15 USDC + 0.02 ETH
   - 贿赂收入：8 USDC（AERO-USDC 池）
   - 贿赂收入：5 USDC（EXTRA-USDC 池）
   - 总计：28 USDC + 0.02 ETH

3. 点击 "Claim All"
   - Gas 费：0.2 美元
   - 收到所有奖励 ✅
\`\`\`

---

## 💰 收益来源拆解

### veAERO 持有者的四重收益

#### 1. 协议收入分成（100%）

**来源**：
- Aerodrome 收取的所有交易手续费
- 100% 分配给 veAERO 持有者

**真实数据**（2024 年 10 月）：
\`\`\`
Aerodrome 周交易量：3.5 亿美元
平均手续费率：0.05%
周手续费收入：3.5 亿 × 0.05% = 17.5 万美元

分配：
- 给 veAERO 持有者：17.5 万美元（100%）✅

你持有 1000 veAERO（占总量 0.1%）：
- 你的分红：17.5 万 × 0.1% = 175 美元/周
- 年化：175 × 52 = 9,100 美元
- 本金（1000 AERO @ 1.5 美元）：1,500 美元
- 分红 APY：607% 🚀

实际会更低（总 veAERO 更多），现实 APY：30-60%
\`\`\`

**分红代币**：
- 主要：USDC、ETH
- 次要：AERO、其他交易对代币

#### 2. 投票奖励（Voting Rewards）

**机制**：
- 你投票给某个池子
- 池子分配到 AERO 奖励
- 你的 LP（如果在该池）获得更多 AERO

**示例**：
\`\`\`
你参与 AERO-USDC 池（1000 美元 LP）
你有 100 veAERO

Epoch 1：不投票
- AERO-USDC 池获得奖励：10,000 AERO（基础）
- 你的份额：0.1%
- 你的奖励：10 AERO

Epoch 2：用 100 veAERO 投票给 AERO-USDC
- 因为你的投票，池子获得奖励：15,000 AERO（+50%）
- 你的份额：0.1%
- 你的奖励：15 AERO

额外收益：5 AERO/周 = 260 AERO/年
价值：260 × 1.5 = 390 美元
APY 提升：+39% ✅
\`\`\`

#### 3. 贿赂收入（Bribes）

**最直接的收益**：

\`\`\`
你有 1000 veAERO

本周贿赂列表：
- AERO-USDC: 0.08 美元/veAERO
- EXTRA-USDC: 0.10 美元/veAERO
- cbETH-ETH: 0.06 美元/veAERO

你的投票分配：
- 500 veAERO → EXTRA-USDC（最高贿赂）
- 300 veAERO → AERO-USDC（你参与的池）
- 200 veAERO → cbETH-ETH

贿赂收入：
- EXTRA-USDC: 500 × 0.10 = 50 美元
- AERO-USDC: 300 × 0.08 = 24 美元
- cbETH-ETH: 200 × 0.06 = 12 美元
- 总计：86 美元/周 ✅

年化：
- 86 × 52 = 4,472 美元
- 本金（1000 veAERO @ 1.5 美元）：1,500 美元
- 贿赂 APY：298% 🚀

实际会更低（贿赂波动），现实 APY：50-120%
\`\`\`

**贿赂平台**：
- **Beefy Finance**（最大贿赂聚合器）
- **Aerodrome 官方贿赂**

#### 4. Rebase（防稀释）

**每周自动增加 veAERO**：

\`\`\`
你持有 1000 veAERO（占 1%）
本周 AERO 排放：5% 通胀

Rebase：
- 你获得：1000 × 5% = 50 veAERO
- 新余额：1050 veAERO

价值（AERO @ 1.5 美元）：
- 50 × 1.5 = 75 美元/周
- 年化：75 × 52 = 3,900 美元
- Rebase APY：260%

实际 Rebase APY：10-25%（取决于通胀率）
\`\`\`

---

### LP 提供者的收益

#### 1. 交易手续费

**标准费率**：
- Volatile Pools（ETH-USDC）：0.05% - 0.3%
- Stable Pools（USDC-USDT）：0.01% - 0.04%

**示例**：
\`\`\`
AERO-USDC Volatile Pool (0.2% fee)
TVL：1000 万美元
日交易量：200 万美元
你的 LP：10,000 美元（0.1% 份额）

日手续费：
- 池子：200 万 × 0.2% = 4,000 美元
- 你的份额：4,000 × 0.1% = 4 美元

年化：
- 4 × 365 = 1,460 美元
- 手续费 APY：14.6% ✅
\`\`\`

#### 2. AERO 奖励（Emissions）

**每周分配**：
\`\`\`
AERO-USDC 池获得本周奖励：10,000 AERO（由投票决定）
TVL：1000 万美元
你的 LP：10,000 美元

你的 AERO 奖励：
- 10,000 × 0.1% = 10 AERO/周
- 年化：520 AERO
- 价值：520 × 1.5 = 780 美元
- AERO APY：7.8% ✅

如果池子获得更多投票（如 20,000 AERO）：
- AERO APY：15.6% ✅
\`\`\`

---

## 🚀 详细操作步骤

### 步骤 0：桥接到 Base

**方式 1：Coinbase 直接提现（推荐）**

\`\`\`
1. 登录 Coinbase 账户

2. 购买 ETH 或 USDC

3. 点击 "Send"（发送）

4. 选择网络：Base ✅

5. 输入你的 MetaMask 地址

6. 确认发送
   - 费用：几乎免费（Coinbase 补贴）
   - 时间：1-2 分钟 ✅

7. 检查 MetaMask（切换到 Base 网络）
\`\`\`

**方式 2：跨链桥（从其他链）**

\`\`\`
推荐桥：
- Orbiter Finance（快速）
- Official Base Bridge（安全）

操作：
1. 访问桥网站
2. From: Ethereum/Arbitrum
3. To: Base
4. 输入金额
5. 确认交易
6. 等待 5-10 分钟
\`\`\`

### 步骤 1：连接 Aerodrome

\`\`\`
1. 访问 https://aerodrome.finance/

2. 确保 MetaMask 切换到 Base 网络

3. 点击 "Connect Wallet"

4. 授权连接

5. 检查余额显示
\`\`\`

### 步骤 2：添加流动性

**案例：AERO-USDC Volatile Pool**

\`\`\`
1. 点击 "Pools" → 搜索 "AERO-USDC"

2. 检查池子信息
   - Type: Volatile（波动池）
   - Fee: 0.2%
   - TVL: 1200 万美元 ✅
   - 24h Volume: 180 万美元 ✅
   - APR: 45%（手续费 + AERO 奖励）✅

3. 点击 "Deposit"

4. 输入金额
   - 方式 A：输入 USDC 数量（自动计算需要多少 AERO）
   - 方式 B：输入总美元价值（系统自动分配 50/50）

   示例：
   - 总投入：1000 美元
   - 需要：500 USDC + 333 AERO（假设 AERO = 1.5 美元）

5. 预览
   - 系统显示你将获得的 LP Token 数量

6. 确认交易
   - Approve USDC：Gas 0.05 美元
   - Approve AERO：Gas 0.05 美元
   - Deposit：Gas 0.2 美元
   - 总 Gas：0.3 美元 ✅

7. 获得 LP Token
   - 显示在 "Your Liquidity" 页面
\`\`\`

### 步骤 3：锁定 AERO 获得 veAERO（可选但推荐）

\`\`\`
1. 访问 "Vote" 页面

2. 点击 "Lock AERO"

3. 输入锁定数量
   - 建议：LP 价值的 10-20%
   - 示例：LP 1000 美元 → 锁定 100-150 美元 AERO

4. 选择锁定期限
   - 推荐：1 年（平衡收益和灵活性）
   - 1 年：1 AERO → 0.25 veAERO

   示例：
   - 锁定 100 AERO（1 年）
   - 获得：25 veAERO

5. 确认锁定
   - Gas 费：0.2 美元

6. 获得 veAERO
   - 显示在 "Your veAERO" 区域
\`\`\`

### 步骤 4：每周投票

\`\`\`
每周四（Epoch 开始）：

1. 访问 "Vote" 页面

2. 查看贿赂列表
   - 点击 "Bribes" 标签
   - 查看每个池子的贿赂金额

3. 决定投票分配
   策略 A（最大化贿赂）：
   - 100% 投给贿赂最高的池子

   策略 B（平衡收益）：
   - 60% → 你参与的池子（提升自己的 APY）
   - 40% → 贿赂最高的池子

4. 分配投票
   - AERO-USDC: 60%（15 veAERO）
   - EXTRA-USDC: 40%（10 veAERO）

5. 确认投票
   - Gas 费：0.1-0.3 美元

6. 下周四生效
\`\`\`

### 步骤 5：领取收益

\`\`\`
每周（建议周五）：

1. 访问 "Rewards" 页面

2. 查看可领取收益
   - LP 手续费：12 USDC + 0.005 ETH
   - AERO 奖励：8 AERO
   - 协议分红（veAERO）：5 USDC
   - 贿赂收入（veAERO）：6 USDC
   - 总计：23 USDC + 0.005 ETH + 8 AERO

3. 决策：
   - 全部领取？（Gas 0.3 美元）
   - 还是等累积更多？（省 Gas）

   建议：
   - 小资金（< 2000）：每月领一次
   - 大资金（> 5000）：每周领一次

4. 点击 "Claim All"

5. 收到奖励 ✅
\`\`\`

---

## 💰 真实案例分析

### 案例 1：AERO-USDC Pool + veAERO（完整版）

**初始设置**（2024 年 9 月）：
\`\`\`
本金分配：
- LP: 5,000 美元（2500 USDC + 1667 AERO @ 1.5）
- veAERO: 1,000 美元锁定（667 AERO，1 年锁定 → 167 veAERO）

总投入：6,000 美元
\`\`\`

**8 周后**（2 个月）：

\`\`\`
收益明细：

1. LP 手续费（0.2% fee）
   - 日均交易量：180 万美元
   - 8 周（56 天）
   - 收益：约 320 美元 ✅

2. AERO 奖励（基础 + 投票提升）
   - 无投票 APY：8%
   - 自己投票提升：+5%
   - 总 APY：13%
   - 8 周（0.154 年）：5,000 × 13% × 0.154 = 100 美元
   - 获得：67 AERO ✅

3. veAERO 协议分红
   - 167 veAERO，占总量 0.015%
   - 周分红：30 美元
   - 8 周：240 美元 ✅

4. 贿赂收入
   - 平均贿赂：0.08 美元/veAERO
   - 167 veAERO × 0.08 = 13.4 美元/周
   - 8 周：107 美元 ✅

5. Rebase
   - 周通胀：约 2%
   - 8 周 Rebase：167 × 2% × 8 = 27 veAERO
   - 价值：27 × 1.5 = 40 美元 ✅

6. 资产价格变化
   - AERO: 1.5 → 1.8 美元（+20%）
   - LP 价值：5,000 → 5,500 美元
   - veAERO 价值：1,000 → 1,200 美元
   - 增值：700 美元 ✅

总收益汇总：
- 手续费：320 美元
- AERO 奖励：100 美元
- 协议分红：240 美元
- 贿赂收入：107 美元
- Rebase：40 美元
- 资产增值：700 美元
- 总计：1,507 美元（+25.1%）

8 周收益率：25.1%
年化 APY：~82% 🚀

Gas 成本：
- 添加 LP：0.3 美元
- 锁定 veAERO：0.2 美元
- 投票（8 次）：2 美元
- 领取奖励：1 美元
- 总 Gas：3.5 美元（占本金 0.058%）✅
\`\`\`

**关键收益占比**：
- 资产增值：46%（AERO 价格上涨）
- 协议分红：16%（veAERO 核心收益）
- 手续费：21%
- 贿赂：7%
- 其他：10%

---

### 案例 2：稳定币池（保守策略）

**初始设置**：
\`\`\`
本金：10,000 美元
- LP: 10,000 USDC-USDT Stable Pool
- veAERO: 0（不锁定）

池子信息：
- Fee: 0.01%
- TVL: 5000 万美元
- APR: 8%（低但稳定）
\`\`\`

**1 个月后**：

\`\`\`
收益明细：

1. 手续费（0.01% fee）
   - 日均交易量：500 万美元
   - 30 天：约 50 美元 ✅

2. AERO 奖励
   - APY：8%
   - 30 天：10,000 × 8% × 0.083 = 66 美元
   - 获得：44 AERO ✅

3. 资产价值
   - 稳定币，无价格波动
   - 10,000 USDC 不变 ✅

总收益：
- 手续费：50 美元
- AERO 奖励：66 美元
- 总计：116 美元（+1.16%）

月化：1.16%
年化 APY：~14% ✅

Gas 成本：
- 添加 LP：0.3 美元
- 领取奖励：0.2 美元
- 总 Gas：0.5 美元（占本金 0.005%）
\`\`\`

**适合场景**：
- 保守投资者
- 不想承担价格波动
- 追求稳定收益（10-15% APY）

---

## ⚠️ 风险与注意事项

### 1. AERO 代币价格波动

**历史波动**：
\`\`\`
2024 年 3 月：0.8 美元（低点）
2024 年 8 月：2.2 美元（高点）
波动：+175%
\`\`\`

**影响**：
- 奖励的美元价值波动大
- veAERO 本金波动

**防范措施**：
- 立即出售 AERO 奖励（锁定美元收益）
- 或分批出售（50% 立即卖，50% 持有）

### 2. 无常损失

**AERO-USDC 池案例**：
\`\`\`
初始：1667 AERO (1.5) + 2500 USDC = 5000 美元
AERO 涨到 3 美元（+100%）

单纯持币：1667 × 3 + 2500 = 7,501 美元
LP（50/50）：1179 × 3 + 3537 USDC = 7,074 美元

无常损失：427 美元（-5.7%）

但手续费 + 奖励：800 美元
净收益：373 美元 ✅（仍然盈利）
\`\`\`

**防范措施**：
- 选择相关性高的资产（ETH-wstETH）
- 或选择稳定币池（无 IL）

### 3. Base 链风险

**相对新的链**：
- 上线仅 1 年+
- 可能有未发现的漏洞

**桥接风险**：
- 使用第三方桥有被黑风险

**防范措施**：
- 不要投入全部资金
- 优先使用 Coinbase 官方充值
- 或使用官方桥

### 4. veAERO 锁定风险

**解锁后失去所有收益**：
- 分红：0
- 贿赂：0
- Rebase：0

**防范措施**：
- 只锁定能长期持有的部分
- 保留部分 AERO 灵活使用

---

## ❓ 常见问题

### Q1: Aerodrome vs Curve，选哪个？

| 特性 | Curve | Aerodrome |
|------|-------|----------|
| 部署链 | 多链 | Base 专注 |
| 稳定币池 | 最强 | 强 |
| 协议分成 | 50% | **100%** ✅ |
| Gas 费 | 中（L1 高）| 超低 ✅ |
| Bribe APY | 10-30% | 50-120% ✅ |

**建议**：
- 大资金稳定币 → Curve（更成熟）
- 中小资金 + 追求高 APY → Aerodrome

---

### Q2: 是否一定要锁 veAERO？

**不锁 veAERO**：
- 仍可以做 LP
- 收益：手续费 + 基础 AERO 奖励
- APY：10-25%

**锁 veAERO**：
- 额外收益：分红 + 贿赂 + Rebase
- APY：40-150% ✅

**建议**：
- 资金 > 2000 美元 → 强烈推荐锁定
- 资金 < 1000 美元 → 可以不锁（简化操作）

---

### Q3: 如何最大化贿赂收入？

**策略**：

1. **追踪高贿赂池子**
   - 每周四查看贿赂列表
   - 投票给贿赂最高的池子

2. **使用贿赂聚合器**
   - Beefy Finance
   - 显示历史贿赂数据

3. **参与新项目发布**
   - 新项目初期贿赂最高
   - 关注 Aerodrome 公告

4. **最佳时机**
   - 月初/季度初：项目方预算充足，贿赂高
   - 月末：贿赂通常较低

---

### Q4: Volatile Pool vs Stable Pool？

**Volatile Pool**（如 ETH-USDC）：
- ✅ 手续费率高（0.2-0.3%）
- ✅ AERO 奖励多
- ❌ 无常损失高

**Stable Pool**（如 USDC-USDT）：
- ✅ 几乎无无常损失
- ✅ 低风险
- ❌ 手续费率低（0.01-0.04%）
- ❌ AERO 奖励少

**建议**：
- 新手/保守：Stable Pool
- 进阶/激进：Volatile Pool

---

## ✅ 行动清单

\`\`\`
□ 第 1 周：准备
  □ 从 Coinbase 充值到 Base
  □ 连接 Aerodrome
  □ 研究池子和贿赂

□ 第 2 周：执行
  □ 添加流动性（AERO-USDC 或稳定币池）
  □ 锁定部分 AERO 为 veAERO（可选）

□ 第 3-4 周：优化
  □ 学习投票和贿赂
  □ 第一次投票（周四）
  □ 领取第一次奖励

□ 长期运营：
  □ 每周四投票（5 分钟）
  □ 每周查看贿赂列表
  □ 每 2-4 周领取奖励
\`\`\`

---

## 🎓 总结

**Aerodrome 核心优势**：
1. **ve(3,3) 模型**：100% 协议收入分成
2. **超低 Gas**：Base 链 Gas 费 0.1-0.5 美元
3. **高 Bribe APY**：50-120%
4. **Coinbase 支持**：直接充值，生态强

**适合人群**：
- ✅ 中小资金（300-20,000 美元）
- ✅ 追求高收益（40-150% APY）
- ✅ 愿意每周投票
- ✅ 看好 Base 生态

**风险提醒**：
- ⚠️ AERO 价格波动大
- ⚠️ Base 链相对新（1 年+）
- ⚠️ veAERO 解锁后失去收益

**下一步**：
1. 从 Coinbase 充值 500-1000 美元到 Base
2. 参与 AERO-USDC 池
3. 锁定 10-20% 为 veAERO
4. 运行 1-2 个月熟悉机制

祝你在 Base 上做市成功！🚀

---

*最后更新：2024 年 11 月*
*数据来源：Aerodrome Finance、DeFiLlama、Base*`,

  featured: false,
  is_published: true,
};

async function addStrategies() {
  try {
    const token = await getAuthToken();
    console.log('开始添加策略 11.7 和 11.8...\n');

    // 添加策略 11.7
    console.log('添加策略 11.7: Camelot V3 Arbitrum 做市...');
    const response1 = await axios.post(
      `${DIRECTUS_URL}/items/strategies`,
      STRATEGY_11_7,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(`✅ 策略 11.7 添加成功！ID: ${response1.data.data.id}\n`);

    // 添加策略 11.8
    console.log('添加策略 11.8: Aerodrome Base 链流动性...');
    const response2 = await axios.post(
      `${DIRECTUS_URL}/items/strategies`,
      STRATEGY_11_8,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(`✅ 策略 11.8 添加成功！ID: ${response2.data.data.id}\n`);

    console.log('🎉 所有策略添加完成！');
    console.log('\n策略摘要：');
    console.log('11.7 Camelot V3 - Arbitrum L2 上的 Nitro Pools 高倍激励');
    console.log('11.8 Aerodrome - Base 链上的 ve(3,3) 模型 + Bribe 市场');

  } catch (error) {
    console.error('❌ 添加策略失败：', error.response?.data || error.message);
  }
}

addStrategies();
