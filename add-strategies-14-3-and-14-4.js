const axios = require('axios');

const STRATEGY_14_3 = {
  title: 'Velodrome veVELO 投票 - Optimism 流动性中心',
  slug: 'liquidity-mining-14-3-velodrome-vevelo-voting',
  summary: '在 Optimism 上锁定 VELO 代币获得 veVELO，通过投票分配流动性激励，赚取交易手续费和贿选收益。Optimism 生态的核心 DeFi 协议。',
  category: 'liquidity-mining',
  category_l1: 'yield',
  category_l2: '流动性引导',
  difficulty_level: 'intermediate',
  risk_level: 3,
  apy_min: 25,
  apy_max: 90,
  threshold_capital: '中等',
  threshold_capital_min: 2000,
  time_commitment: '低',
  time_commitment_minutes: 20,
  threshold_tech_level: 'intermediate',
  status: 'published',
  content: `# Velodrome veVELO 投票 - Optimism 流动性中心

## 📖 小王的 Layer2 探索之旅

小王在以太坊主网上交易时，每次 Gas 费都要几十美元，让他苦不堪言。后来他发现了 Optimism 这个 Layer2 网络——交易速度快，Gas 费只需几美分。他想在 Optimism 上参与 DeFi，听说 Velodrome 是生态中最大的 DEX，可以通过投票赚取被动收入。

**以太坊主网 DeFi 的痛点：**
- Gas 费高昂（单笔交易 $20-100）
- 交易确认慢（12-15 秒一个区块）
- 小额资金参与不划算
- 复杂操作需要多次交易，成本累加

**Velodrome on Optimism 的优势：**
- Gas 费低至 $0.1-0.5（降低 99%）
- 交易确认快（约 2 秒）
- 通过 veVELO 投票赚取高收益
- Optimism 生态快速增长，潜力巨大
- 与以太坊主网无缝互通

---

## 🎯 策略核心原理

### Velodrome 是什么？

Velodrome 是 Optimism 上最大的 DEX（去中心化交易所），采用 ve(3,3) 模型。它不仅是一个交易平台，更是整个 Optimism 生态的流动性基础设施。许多新项目上线都选择在 Velodrome 建立流动性池。

### veVELO 投票机制

Velodrome 的核心创新在于用投票来引导流动性：

**1. 锁定 VELO 获得 veVELO**
- 将 VELO 代币锁定 1 周到 4 年
- 锁定时间越长，veVELO 权重越高
- veVELO 是 NFT 形式，可以转让
- 权重公式：veVELO = VELO 数量 × 时间系数（最高 1:1）

**2. 投票权力**
每周用 veVELO 投票给不同的流动性池：
- 你投票的池子会获得更多 VELO 代币激励
- 该池的 LP 提供者 APR 会上升
- 项目方为了吸引流动性，会向投票者支付贿赂

**3. 收益来源**

| 收益类型 | 说明 | 稳定性 | 占比 |
|---------|------|--------|------|
| **交易手续费** | 你投票的池子产生的交易费用，按投票比例分配 | ⭐⭐⭐⭐⭐ | 30-40% |
| **Bribes（贿选）** | 项目方支付代币吸引你的投票 | ⭐⭐⭐ | 40-50% |
| **VELO 释放** | 协议每周释放 VELO 给 veVELO 持有者 | ⭐⭐⭐⭐ | 10-20% |
| **Rebase 奖励** | 补偿锁定者的通胀稀释 | ⭐⭐⭐⭐ | 5-10% |

**4. 飞轮效应**

\`\`\`
更多投票 → 更高 APR → 吸引更多 LP
   ↑                           ↓
更高投票价值 ← 更多手续费 ← 更多交易量
\`\`\`

这个正循环让 Velodrome 成为 Optimism 的流动性黑洞。

---

## 📊 收益对比表

| 锁定策略 | veVELO 权重 | 预计年化收益 | 流动性 | Gas 成本 | 适合人群 |
|---------|-----------|------------|--------|---------|---------|
| **1 周** | 0.5% | 20-30% | ⭐⭐⭐⭐⭐ | $0.5 | 短期试水 |
| **1 个月** | 2% | 25-35% | ⭐⭐⭐⭐ | $0.5 | 灵活策略 |
| **3 个月** | 6% | 30-50% | ⭐⭐⭐ | $0.5 | 中期持有 |
| **6 个月** | 12% | 40-65% | ⭐⭐ | $0.5 | 看好生态 |
| **1 年** | 25% | 50-80% | ⭐ | $0.5 | 长期投资者 |
| **4 年（最大）** | 100% | 60-90%+ | ⭐ | $0.5 | 协议深度参与 |

**注：** Optimism 的低 Gas 费让频繁调整策略成为可能，这是相比以太坊主网的巨大优势。

---

## 💰 收益计算示例

### 案例 1：激进型策略（1 年锁定）

小王投入 5,000 USDT 购买 VELO：

**初始设置：**
- 购买 VELO：5,000 USDT ÷ $0.05/VELO = 100,000 VELO
- 锁定时长：1 年
- veVELO 权重：100,000 × 25% = 25,000 veVELO

**投票策略：追逐高 Bribes**

小王研究后发现，Velodrome 上每周有不同项目提供高额 Bribes 吸引投票。他制定了动态投票策略：

**第 1 周投票分配：**
- 30% → OP-USDC 池（稳定高交易量，手续费收入稳定）
- 25% → 新项目 A-USDC（提供 $50,000 Bribes）
- 25% → 新项目 B-ETH（提供 $40,000 Bribes）
- 20% → VELO-USDC（支持协议代币）

**第 1 周收益计算：**

**来源 1：交易手续费**
- OP-USDC 周交易量：5,000 万 USDT
- 手续费率：0.01%（稳定币对低费率）
- 周手续费：50,000 USDT
- 小王投票占该池总票数 0.2%
- 手续费分成：50,000 × 0.2% × 30% = 30 USDT

**来源 2：Bribes**
- 新项目 A 总 Bribes：50,000 USDT
- 小王投票占比：0.3%
- A 池 Bribes 收益：50,000 × 0.3% × 25% = 37.5 USDT
- 新项目 B 总 Bribes：40,000 USDT
- B 池 Bribes 收益：40,000 × 0.3% × 25% = 30 USDT
- Bribes 小计：67.5 USDT

**来源 3：VELO 代币释放**
- 本周释放总量：100 万 VELO
- 小王占总 veVELO 的 0.1%
- VELO 奖励：100 万 × 0.1% = 1,000 VELO（价值 50 USDT）

**来源 4：Rebase**
- Rebase 比例：约 5%（补偿通胀）
- Rebase 奖励：100,000 × 5% ÷ 52 = 96 VELO（价值 4.8 USDT）

**第 1 周总收益：**
30 + 67.5 + 50 + 4.8 = 152.3 USDT

**周收益率：** 152.3 ÷ 5,000 = 3.05%
**预估年化收益：** 3.05% × 52 = 158%

**实际预期 APY：** 50-80%（考虑 Bribes 波动和 VELO 价格变化）

---

### 案例 2：稳健型策略（6 个月锁定）

小王的朋友小张更保守，他投入 3,000 USDT：

**初始设置：**
- 购买 VELO：60,000 VELO
- 锁定时长：6 个月
- veVELO 权重：60,000 × 12% = 7,200 veVELO

**投票策略：专注稳定币对**

小张只投票给高交易量、低波动的稳定币池：
- 40% → USDC-USDT（超级稳定）
- 30% → USDC-DAI
- 30% → OP-USDC

**月收益计算：**
- 交易手续费：200 USDT/月（稳定币对交易量大）
- Bribes：150 USDT/月（稳定币对 Bribes 较少但稳定）
- VELO 奖励：100 USDT/月
- Rebase：20 USDT/月
- 总月收益：470 USDT

**月收益率：** 470 ÷ 3,000 = 15.7%
**年化收益：** 约 40-50%

**优势：**
- 收益稳定可预测
- VELO 价格波动影响较小（因为收益主要来自稳定币）
- 适合保守型投资者

---

### 案例 3：专业玩家策略（多 NFT 组合）

资深玩家老李投入 20,000 USDT，采用分层策略：

**veNFT 组合：**
1. **NFT #1**：10,000 VELO 锁 4 年（权重 100%）
   - 用于投票高 Bribes 的新项目池
   - 追求最高收益

2. **NFT #2**：5,000 VELO 锁 1 年（权重 25%）
   - 用于投票蓝筹稳定币池
   - 追求稳定现金流

3. **NFT #3**：5,000 VELO 锁 1 个月（权重 2%）
   - 灵活调整，测试新策略
   - 快速响应市场变化

**月收益：**
- NFT #1 高风险高收益：800 USDT/月
- NFT #2 稳定收益：400 USDT/月
- NFT #3 灵活收益：150 USDT/月
- 总月收益：1,350 USDT

**月收益率：** 1,350 ÷ 20,000 = 6.75%
**年化收益：** 约 60-70%

**优势：**
- 风险分散
- 收益结构多样化
- 灵活性和高收益兼顾

---

## 🔧 操作步骤详解

### 准备阶段（首次设置：20 分钟）

**步骤 1：跨链到 Optimism**

如果你的资金在以太坊主网或其他链上，需要先跨链：

1. **官方桥（推荐新手）**
   - 访问 app.optimism.io/bridge
   - 连接钱包（MetaMask）
   - 选择要跨链的资产（ETH、USDC 等）
   - 确认交易（需要支付以太坊 Gas 费）
   - 等待约 10-20 分钟到账

2. **第三方桥（更快）**
   - Hop Protocol：hop.exchange
   - Synapse：synapseprotocol.com
   - Across：across.to
   - 通常 5-10 分钟到账，手续费稍高

3. **CEX 提现（最便宜）**
   - 如果你的资金在交易所（如 Binance、OKX）
   - 直接选择 Optimism 网络提现
   - 手续费最低，速度快

**步骤 2：添加 Optimism 网络**

在 MetaMask 中添加 Optimism：
1. 打开 MetaMask
2. 点击网络下拉菜单
3. 选择 "添加网络"
4. 输入以下信息：
   - 网络名称：Optimism
   - RPC URL：https://mainnet.optimism.io
   - Chain ID：10
   - 货币符号：ETH
   - 区块浏览器：https://optimistic.etherscan.io

或者访问 chainlist.org 一键添加。

**步骤 3：准备资金**
- 准备足够的 ETH 用于 Gas 费（0.01 ETH 够用很久）
- 准备用于购买 VELO 的资金（USDC、USDT 或 ETH）

---

### 购买和锁定 VELO（15 分钟）

**步骤 4：在 Velodrome 购买 VELO**

1. 访问 velodrome.finance
2. 连接钱包（确保切换到 Optimism 网络）
3. 点击 "Swap" 标签
4. 选择支付代币（USDC/USDT）和接收 VELO
5. 输入金额，确认交易
6. Gas 费只需 $0.1-0.3，非常便宜！

**VELO 代币信息：**
- 合约地址：0x3c8B650257cFb5f272f799F5e2b4e65093a11a05
- 可在 CoinGecko 查看实时价格
- 通常价格在 $0.03-0.15 之间

**步骤 5：锁定 VELO 创建 veNFT**

1. 点击 "Vote" 标签
2. 点击 "Lock VELO"
3. 设置锁定参数：
   - **Amount**：要锁定的 VELO 数量
   - **Lock Duration**：1 周 - 4 年
   - 实时查看获得的 veVELO 权重
4. 确认交易（Gas 费约 $0.3）

**锁定时长建议：**
- 新手试水：1-3 个月
- 中期策略：6 个月 - 1 年
- 长期持有：2-4 年（最大化权重）

---

### 投票赚取收益（每周操作：10 分钟）

**步骤 6：研究投票机会**

Velodrome 的 "Pools" 页面显示所有交易对信息：

**重点关注指标：**
1. **Total Votes**：该池获得的总投票数
2. **APR**：LP 提供者的年化收益率
3. **Bribes**：本周该池提供的贿选金额
4. **$/veVELO**：每个 veVELO 的预期收益（最重要！）
5. **7d Volume**：7 天交易量
6. **7d Fees**：7 天产生的手续费

**高收益池特征：**
- 高 Bribes（新项目通常提供高激励）
- 高交易量（产生更多手续费）
- 适中的投票数（避免过于拥挤的池子）
- $/veVELO 指标高（综合性价比）

**步骤 7：执行投票**

1. 进入 "Vote" 页面
2. 选择你的 veNFT（如果有多个）
3. 为不同池子分配投票权重：
   - 可以投 1 个池，也可以分散投多个
   - 拖动滑块或输入百分比
   - 确保总计 100%
4. 点击 "Cast Votes"
5. 确认交易（Gas 费约 $0.2）

**投票示例策略：**

**保守型（稳定收益）：**
- 50% → USDC-USDT
- 30% → OP-USDC
- 20% → WETH-USDC

**平衡型（收益+Bribes）：**
- 30% → USDC-USDT（稳定）
- 30% → 高 Bribes 项目 A
- 20% → 高 Bribes 项目 B
- 20% → VELO-USDC（支持协议）

**激进型（追逐 Bribes）：**
- 100% 投给单个高 Bribes 新项目
- 风险：项目可能跑路，代币归零
- 收益：可能获得数倍于本金的 Bribes

**步骤 8：每周四调整投票**

Velodrome 的投票周期：
- 每周四 00:00 UTC 开始新的 Epoch
- 可以在每个 Epoch 重新投票
- 建议每周四查看 Bribes 变化，调整策略
- Optimism 低 Gas 费让频繁调整成为可能

---

### 领取收益（每周操作：5 分钟）

**步骤 9：Claim 奖励**

1. 进入 "Rewards" 页面
2. 查看待领取奖励：
   - **Trading Fees**：手续费分成（多种代币）
   - **Bribes**：贿选奖励（多种代币）
   - **Emissions**：VELO 代币释放
   - **Rebase**：通胀补偿
3. 点击 "Claim All" 一键领取
4. Gas 费约 $0.5-1（取决于代币种类数量）

**优化 Claim 策略：**
- 如果奖励金额小（< $50），可以累积几周再 Claim
- 如果奖励中有不想持有的代币，Claim 后立即兑换
- 建议每周至少 Claim 一次，避免错过下一轮投票

**步骤 10：处理收益**

收到的代币可能包括：
- VELO（协议代币）
- USDC、USDT（稳定币）
- 各种项目代币（来自 Bribes）

**处理方案：**
1. **复投策略**
   - 将 VELO 再次锁定（增加权重）
   - 将稳定币购买更多 VELO
   - 滚雪球效应

2. **套现策略**
   - 将所有代币兑换为 USDC/USDT
   - 实现稳定现金流

3. **再平衡策略**
   - 保留 50% VELO 继续复投
   - 50% 兑换为稳定币
   - 平衡风险和收益

---

### 高级策略（可选）

**步骤 11：购买折价 veNFT**

Velodrome 的 veNFT 可以在 OpenSea 等 NFT 市场交易：

1. 访问 OpenSea（Optimism 网络）
2. 搜索 "Velodrome veNFT"
3. 筛选条件：
   - 剩余锁定时间
   - veVELO 权重
   - 价格
4. 评估性价比：
   - 计算折扣率
   - 预估收益期
5. 购买折价 veNFT

**示例：**
- 某 veNFT 包含 10,000 veVELO
- 原成本：10,000 VELO（价值 500 USDT）
- 剩余锁定期：6 个月
- 卖家售价：400 USDT（打 8 折）
- 你购买后立即享受投票收益，成本降低 20%

**步骤 12：Merge 和 Split veNFT**

Velodrome 允许合并或拆分 veNFT：

**Merge（合并）：**
- 将多个 veNFT 合并为一个
- 减少管理成本
- 节省 Gas 费

**Split（拆分）：**
- 将一个大 veNFT 拆分为多个小的
- 实现不同策略
- 部分提前退出（卖出部分 veNFT）

---

## ⚠️ 风险提示

### 主要风险

**1. VELO 代币价格波动风险 ⭐⭐⭐⭐**
- **风险说明：** VELO 价格受市场情绪和 Optimism 生态发展影响
- **历史波动：** VELO 曾在几个月内从 $0.15 跌至 $0.03
- **应对措施：**
  - 分批建仓，降低成本
  - 不要用全部资金购买 VELO
  - 定期兑现收益为稳定币
  - 长期看好 Optimism 生态再参与

**2. 锁定期流动性风险 ⭐⭐⭐⭐**
- **风险说明：** 锁定期间无法直接提取 VELO
- **影响：** 市场暴跌时无法止损
- **应对措施：**
  - 根据风险承受能力选择锁定时长
  - 可通过 NFT 市场出售 veNFT 提前退出（可能折价）
  - 保留部分流动资金在其他策略中

**3. Bribes 不确定性风险 ⭐⭐⭐**
- **风险说明：** 项目方提供的 Bribes 可能突然减少或停止
- **影响：** 预期收益大幅下降
- **应对措施：**
  - 不要把收益全部押注在高 Bribes 池
  - 分散投票给多个池子
  - 优先选择交易量大的池（手续费收入稳定）

**4. 项目代币归零风险 ⭐⭐⭐⭐**
- **风险说明：** Bribes 中收到的项目代币可能归零
- **应对措施：**
  - 及时将不熟悉的代币兑换为稳定币
  - 不要长期持有高风险项目代币
  - 专注于知名项目的池子

**5. 智能合约风险 ⭐⭐**
- **风险说明：** Velodrome 合约可能存在漏洞
- **应对措施：**
  - Velodrome 已通过审计，协议运行超过 1 年
  - 已管理超过 2 亿美元 TVL，相对成熟
  - 仍建议不要投入全部资产

**6. Optimism 网络风险 ⭐⭐**
- **风险说明：** Optimism 作为 Layer2，依赖以太坊主网安全
- **潜在问题：** Sequencer 停机、跨链桥问题
- **应对措施：**
  - Optimism 由以太坊基金会支持，安全性高
  - 分散资产到多个 Layer2 和链

**7. 投票策略错误风险 ⭐⭐⭐**
- **风险说明：** 投票给错误的池子导致收益不佳
- **应对措施：**
  - 使用 Velodrome Dashboard 的数据分析
  - 参考社区推荐（Discord、Twitter）
  - 关注 $/veVELO 指标
  - 分散投票，测试不同策略

---

## ❓ 常见问题 FAQ

**Q1：Velodrome 和 Thena 有什么区别？**
A1：
- Velodrome 在 Optimism，Thena 在 BNB Chain
- Velodrome 是 Optimism 生态最大的 DEX，地位更稳固
- Velodrome 的 TVL 和交易量通常更高
- Optimism 的 Gas 费比 BNB Chain 稍高，但仍很便宜（$0.1-0.5）
- 两者机制相似，都采用 ve(3,3) 模型

**Q2：为什么 Velodrome 的收益比 Curve 高？**
A2：
- Velodrome 是 Optimism 生态的核心流动性枢纽，集中度更高
- 项目方为了在 Optimism 上启动，愿意支付高额 Bribes
- Velodrome 的通胀率较高（但有 Rebase 补偿）
- Optimism 生态处于快速增长期，投机需求旺盛

**Q3：Gas 费真的只要几美分吗？**
A3：是的！Optimism 交易成本极低：
- 锁定 VELO：$0.2-0.5
- 投票：$0.1-0.3
- Claim 奖励：$0.3-1（取决于代币种类）
- Swap：$0.1-0.3
这让小资金用户和频繁操作成为可能。

**Q4：什么时候投票最好？**
A4：
- Velodrome 的投票周期每周四 00:00 UTC 开始
- 建议在周三查看下一轮的 Bribes 信息
- 在周四早晨（新周期开始后）尽快投票
- 早投票可以享受完整一周的收益

**Q5：如何查看哪些池子 Bribes 最高？**
A5：
1. 访问 Velodrome 官网 "Incentives" 页面
2. 按 "$/veVELO" 排序（显示每个投票的预期收益）
3. 关注 Velodrome Discord 的 #bribes-info 频道
4. 使用第三方工具：vefunder.com

**Q6：可以提前解锁 veNFT 吗？**
A6：
- 不能直接提前解锁
- 但可以在 OpenSea 等 NFT 市场出售 veNFT
- 通常需要折价 10-30% 才能快速卖出
- 或等待锁定期结束后解锁

**Q7：收到的代币太多太杂怎么办？**
A7：
- 使用 Velodrome 的 "Zap" 功能一键兑换为 VELO 或 USDC
- 或在 1inch、Paraswap 等聚合器上批量兑换
- 对于小额代币（< $10），可能不值得兑换（Gas 费更高）

**Q8：如何知道我的投票是否有效？**
A8：
- 投票交易确认后即生效
- 在 "My Votes" 页面查看当前投票分配
- 下一个 Epoch 开始后会产生收益
- 通常 1 周后可以在 "Rewards" 页面看到奖励

**Q9：Optimism 跨链桥安全吗？**
A9：
- 官方桥非常安全，由 Optimism 团队维护
- 已处理数十亿美元跨链，无重大事故
- 跨链时间：存款 10-20 分钟，提款 7 天（安全期）
- 如果急需提款，可使用第三方快速桥（手续费更高）

**Q10：VELO 代币的总供应量会一直增长吗？**
A10：
- VELO 采用周释放模型，通胀率逐渐降低
- Rebase 机制部分抵消了稀释效应
- 协议的增长（更多交易、更高 TVL）可以对冲通胀
- 长期持有者通过锁定和 Rebase 可以维持份额

**Q11：新手应该锁定多久？**
A11：建议分阶段：
1. 第一次：锁 1 个月（熟悉机制，测试收益）
2. 第二次：如果满意，锁 3-6 个月（获得更高权重）
3. 第三次：如果长期看好，锁 1-2 年（最大化收益）
不要一开始就锁最长时间，留出调整空间。

**Q12：有没有自动化工具帮助优化投票？**
A12：
- 目前 Velodrome 没有官方自动化工具
- 社区有一些投票策略分享：
  - Velodrome Discord
  - Twitter 上的 DeFi 分析账号
  - vefunder.com（收益计算器）
- 专业玩家开发了自动化脚本（需要编程知识）

---

## 📚 总结

Velodrome veVELO 投票是 Optimism 生态中最具吸引力的被动收入策略之一。凭借 Layer2 的低成本优势和 ve(3,3) 模型的创新机制，veVELO 持有者可以通过简单的投票操作获得多重收益。

**关键要点：**
1. **极低 Gas 费**：Optimism 让小资金参与和频繁调整成为可能
2. **多重收益**：手续费、Bribes、VELO 释放、Rebase
3. **灵活策略**：从 1 周到 4 年，适应不同风险偏好
4. **NFT 流动性**：veNFT 可交易，提供提前退出途径
5. **动态优化**：每周调整投票，追逐最高收益

**收益结构：**
- 保守策略（稳定币池）：年化 30-50%
- 平衡策略（混合池）：年化 50-70%
- 激进策略（高 Bribes）：年化 70-90%+

**适合人群：**
- 看好 Optimism 生态发展
- 希望获得被动收入且愿意定期调整策略
- 有一定 DeFi 经验，了解流动性池运作
- 能够承受 VELO 代币价格波动

**与其他链对比：**
- vs 以太坊 Curve：Gas 费降低 99%，收益更高
- vs BNB Chain Thena：生态更去中心化，长期更稳健
- vs Arbitrum：Velodrome 是 Optimism 独家优势

**风险管理建议：**
1. 不要投入超过总资产 30% 的资金
2. 分批建仓，降低 VELO 购买成本
3. 定期将 Bribes 收益兑换为稳定币
4. 选择与风险承受能力匹配的锁定时长
5. 分散投票，不要全部押注单一池子

记住：Velodrome 提供了极佳的收益机会，但 VELO 代币价格波动和锁定期流动性风险需要认真对待。合理配置资金，动态调整策略，才能最大化长期收益！`,
  steps: [
    '准备 Optimism 钱包并跨链资金',
    '在 Velodrome 购买 VELO 代币',
    '锁定 VELO 创建 veNFT 并选择锁定时长',
    '研究各池子的交易量、Bribes 和 $/veVELO',
    '制定投票策略并执行投票',
    '每周四检查新 Epoch 的 Bribes 并调整投票',
    '每周 Claim 奖励（手续费、Bribes、VELO）',
    '处理收益：复投或兑换为稳定币',
    '（可选）在 NFT 市场交易 veNFT',
    '锁定到期后选择重新锁定或解锁退出'
  ]
};

const STRATEGY_14_4 = {
  title: 'Curve Gauge 投票权 - DeFi 老牌流动性巨头',
  slug: 'liquidity-mining-14-4-curve-gauge-voting',
  summary: '锁定 CRV 代币获得 veCRV，通过 Gauge 投票决定各池子的 CRV 释放权重，赚取交易手续费和协议贿选收益。DeFi 中历史最悠久、最稳定的流动性挖矿策略。',
  category: 'liquidity-mining',
  category_l1: 'yield',
  category_l2: '流动性引导',
  difficulty_level: 'advanced',
  risk_level: 3,
  apy_min: 15,
  apy_max: 60,
  threshold_capital: '较高',
  threshold_capital_min: 5000,
  time_commitment: '低',
  time_commitment_minutes: 25,
  threshold_tech_level: 'advanced',
  status: 'published',
  content: `# Curve Gauge 投票权 - DeFi 老牌流动性巨头

## 📖 老陈的 DeFi 觉醒

老陈是 2020 年进入币圈的老韭菜，经历过多次牛熊。他发现无论市场如何波动，有一个协议始终屹立不倒——Curve Finance。作为 DeFi 中最大的稳定币交易所，Curve 的 TVL 常年保持在 50-100 亿美元。老陈想通过持有 veCRV 成为 Curve 的"股东"，分享协议增长红利。

**传统 DeFi 挖矿的问题：**
- 流动性挖矿收益不稳定，矿币暴跌
- 高 APY 往往难以持续
- 无常损失侵蚀本金
- 协议治理权缺失

**Curve veCRV 的优势：**
- DeFi 蓝筹协议，5 年历史无重大安全事故
- 稳定币交易需求刚性，收益稳定
- veCRV 投票权极具价值，引发"Curve War"
- 多链部署，生态庞大
- 与 Convex 等协议深度整合，形成生态护城河

---

## 🎯 策略核心原理

### Curve Finance 简介

Curve 是专注于稳定币和相似资产交易的 DEX，采用独特的 AMM 算法，交易滑点极低。它是 DeFi 的基础设施，几乎所有稳定币都会在 Curve 上建立流动性池。

### veCRV 投票经济学

**1. 锁定 CRV 获得 veCRV**
- 将 CRV 锁定 1 周到 4 年
- 锁定 4 年：1 CRV = 1 veCRV
- 锁定时间越短，veCRV 越少（线性衰减）
- 例如锁定 2 年 = 0.5 veCRV，锁定 1 年 = 0.25 veCRV

**2. Gauge 投票机制**

Curve 的核心创新是 Gauge（流动性计量器）系统：

- 每个流动性池都有一个 Gauge
- veCRV 持有者每周投票决定 CRV 释放权重
- 获得更多投票的池子，LP 会获得更高的 CRV 奖励
- 投票直接影响整个 DeFi 生态的资金流向

**3. Curve Wars（Curve 战争）**

veCRV 的投票权极具战略价值，引发了 DeFi 历史上著名的"Curve Wars"：

| 参与方 | 策略 | 目标 |
|-------|------|------|
| **Convex Finance** | 累积 veCRV，为用户提供增强收益 | 控制约 50% veCRV |
| **Yearn Finance** | 持有 veCRV 优化稳定币策略 | 为用户提供最优收益 |
| **Frax Finance** | 购买 veCRV 支持 FRAX 稳定币池 | 提升 FRAX 的流动性和采用率 |
| **各项目方** | 通过 Votium、Bribe.crv 贿选 | 吸引流动性到自己的池子 |

**这场战争让 veCRV 持有者成为最大赢家——项目方争相贿选，推高收益。**

**4. 收益来源**

| 收益类型 | 说明 | 占比 | 稳定性 |
|---------|------|------|--------|
| **交易手续费** | 你投票的池子产生的交易费的 50% | 30% | ⭐⭐⭐⭐⭐ |
| **Bribes（贿选）** | 项目方通过 Votium、Bribe.crv 支付 | 50% | ⭐⭐⭐⭐ |
| **CRV Boost** | 如果自己提供 LP，可获得 2.5 倍收益加成 | 20% | ⭐⭐⭐ |
| **CRV 释放** | 协议给 veCRV 持有者的 CRV 代币 | 小 | ⭐⭐⭐ |

---

## 📊 收益对比表

| 锁定时长 | veCRV 权重 | 预计年化收益 | 流动性 | Gas 成本（ETH） | 适合人群 |
|---------|-----------|------------|--------|---------------|---------|
| **1 年** | 25% | 12-20% | ⭐ | $20-50 | 中期持有者 |
| **2 年** | 50% | 18-35% | ⭐ | $20-50 | 看好 Curve 发展 |
| **3 年** | 75% | 25-50% | ⭐ | $20-50 | 长期投资者 |
| **4 年（最大）** | 100% | 30-60% | ⭐ | $20-50 | 深度参与者 |

**注：** Curve 在以太坊主网，Gas 费较高。建议资金量 > $5,000 再参与，否则 Gas 费占比过高。

---

## 💰 收益计算示例

### 案例 1：纯投票策略（4 年锁定）

老陈投入 50,000 USDT 购买 CRV：

**初始设置：**
- CRV 价格：$0.50
- 购买数量：50,000 ÷ 0.5 = 100,000 CRV
- 锁定时长：4 年
- veCRV 权重：100,000 × 100% = 100,000 veCRV

**投票策略：专注高 Bribes 池**

老陈研究后发现，Votium 是最大的 Curve 贿选平台，每两周进行一轮：

**第 1 轮投票（2 周）：**

选择投票给 4 个池子：
1. **FRAX-USDC**（Frax 提供高额 Bribes）- 30%
2. **MIM-3CRV**（Abracadabra 提供 Bribes）- 25%
3. **alUSD-3CRV**（Alchemix 提供 Bribes）- 25%
4. **cvxCRV-CRV**（Convex 提供 Bribes）- 20%

**收益计算（2 周）：**

**来源 1：Bribes（Votium）**
- FRAX 池总 Bribes：$500,000
- 老陈 veCRV 占该池总票数：0.15%
- FRAX 收益：$500,000 × 0.15% × 30% = $225

- MIM 池总 Bribes：$300,000
- MIM 收益：$300,000 × 0.15% × 25% = $112.5

- alUSD 池总 Bribes：$200,000
- alUSD 收益：$200,000 × 0.15% × 25% = $75

- cvxCRV 池总 Bribes：$400,000
- cvxCRV 收益：$400,000 × 0.15% × 20% = $120

**Bribes 小计：** 225 + 112.5 + 75 + 120 = $532.5

**来源 2：交易手续费分成**
- Curve 每两周手续费总额：约 $10,000,000
- 老陈投票的池子产生手续费：约 $2,000,000
- 老陈占这些池子投票的 0.15%
- 手续费分成：$2,000,000 × 0.15% × 50% = $1,500

**2 周总收益：** $532.5 + $1,500 = $2,032.5

**年化收益计算：**
- 2 周收益：$2,032.5
- 年化收益：$2,032.5 × 26 = $52,845
- 年化收益率：$52,845 ÷ $50,000 = 105.7%

**实际预期 APY：** 30-60%（考虑 CRV 价格波动和 Bribes 变化）

---

### 案例 2：投票 + LP 组合策略（Boost 最大化）

老陈的朋友老李采用组合策略：

**初始设置：**
- 总资金：$100,000
- 50% 购买 CRV 并锁定 4 年：50,000 CRV → 50,000 veCRV
- 50% 作为 LP 提供流动性：$50,000

**LP 配置：**
在 3pool（DAI-USDC-USDT）提供 $50,000 流动性

**收益计算：**

**来源 1：LP 基础收益（无 Boost）**
- 3pool APR：5%（交易手续费）
- 基础收益：$50,000 × 5% = $2,500/年

**来源 2：CRV Boost**
- 拥有 veCRV 可将 LP 收益提升最高 2.5 倍
- Boost 后 APR：5% × 2.5 = 12.5%
- Boost 收益：$50,000 × 12.5% = $6,250/年
- 额外收益：$6,250 - $2,500 = $3,750/年

**来源 3：veCRV 投票收益**
- 参考案例 1，50,000 veCRV 年收益约 $26,422

**总年收益：**
$6,250（LP + Boost）+ $26,422（投票）= $32,672

**年化收益率：** $32,672 ÷ $100,000 = 32.7%

**优势：**
- 稳定币 LP 无无常损失
- Boost 机制提升 LP 收益
- 投票收益作为额外加成
- 风险更分散

---

### 案例 3：通过 Convex 间接参与（无需锁定）

小白对锁定 4 年感到不安，他选择通过 Convex Finance 参与：

**操作：**
1. 在 Curve 提供 LP（如 3pool）
2. 将 LP Token 存入 Convex
3. Convex 代替你获得 Boost 和投票收益
4. 你获得增强版收益，且保持流动性

**收益对比：**

| 策略 | APR | 流动性 | 复杂度 |
|------|-----|--------|--------|
| **直接在 Curve 提供 LP** | 5% | ⭐⭐⭐⭐ | 低 |
| **自己持有 veCRV + LP** | 15-30% | ⭐ | 高 |
| **通过 Convex 参与** | 12-25% | ⭐⭐⭐ | 中 |

**Convex 优势：**
- 无需购买和锁定 CRV
- 自动复投，省 Gas 费
- 保持流动性，随时退出
- 收益略低于直接持有 veCRV，但更灵活

**小白的收益：**
- 投入 3pool：$50,000
- Convex 增强 APR：20%
- 年收益：$50,000 × 20% = $10,000
- 无需管理投票，完全被动

---

## 🔧 操作步骤详解

### 准备阶段（首次设置：30 分钟）

**步骤 1：准备以太坊主网钱包**
1. 安装 MetaMask 或 Ledger 硬件钱包（推荐）
2. 确保钱包在以太坊主网
3. 准备足够的 ETH 用于 Gas 费：
   - 购买 CRV：$10-20
   - 锁定 CRV：$20-30
   - 投票：$15-25（每次）
   - Claim 奖励：$30-50
   - **总计建议准备 0.05-0.1 ETH（约 $150-300）**

**Gas 优化建议：**
- 在 Gas 费低谷时段操作：
  - 周末
  - UTC 时间凌晨 2-6 点
  - 使用 gasnow.org 或 ethgasstation.info 监控
- 考虑在 L2（Arbitrum、Optimism）上参与 Curve
  - Gas 费降低 95%
  - 但流动性和收益可能略低

**步骤 2：购买 CRV 代币**
1. 访问 curve.fi
2. 连接钱包
3. 使用内置 Swap 功能用 USDC/USDT 兑换 CRV
4. 或在 Uniswap、1inch 购买

**CRV 代币信息：**
- 合约地址：0xD533a949740bb3306d119CC777fa900bA034cd52
- 在 CoinGecko 查看实时价格
- 历史价格区间：$0.30 - $6.00

---

### 锁定 CRV 创建 veCRV（20 分钟）

**步骤 3：锁定 CRV**

1. 访问 curve.fi/dao/locker
2. 连接钱包
3. 输入要锁定的 CRV 数量
4. 选择锁定时长（1 周 - 4 年）
5. 查看将获得的 veCRV 数量
6. 点击 "Create Lock"
7. 确认交易（Gas 费 $20-30）

**重要提示：**
- veCRV 不是 ERC-20 代币，无法转让
- 锁定后只能等到期才能解锁
- 没有提前退出机制（这是与 Velodrome/Thena 的主要区别）
- 务必确认锁定时长再提交

**步骤 4：查看 veCRV 余额**
- 在 curve.fi/dao/locker 查看
- 显示：
  - 锁定的 CRV 数量
  - 当前 veCRV 余额（会随时间衰减）
  - 解锁时间

**veCRV 衰减机制：**
- veCRV 余额会随时间线性衰减
- 例如锁定 4 年获得 100,000 veCRV
- 2 年后 veCRV 衰减至 50,000
- 可以随时延长锁定期以恢复权重

---

### Gauge 投票（每 2 周操作：15 分钟）

**步骤 5：研究 Gauge 权重**

1. 访问 curve.fi/dao/gauges
2. 查看所有池子的 Gauge 信息：
   - **Current Weight**：当前投票权重
   - **Next Weight**：下一周期权重
   - **APY**：LP 提供者的预期年化收益
   - **TVL**：池子总锁仓量

**步骤 6：查看 Bribes 信息**

Bribes 在第三方平台提供，需要单独查看：

**Votium（最大）：**
1. 访问 votium.app
2. 查看当前 Round 的 Bribes：
   - 每个池子的总 Bribes 金额
   - 按 $/veCRV 排序（性价比）
   - 提供 Bribes 的代币类型
3. 记录想投票的池子

**Bribe.crv（官方）：**
1. 访问 bribe.crv.finance
2. 查看实时 Bribes
3. 可以直接在此平台投票

**Llama Airforce（数据聚合）：**
1. 访问 llama.airforce
2. 查看历史 Bribes 数据
3. 分析哪些池子 Bribes 最稳定

**步骤 7：在 Curve 上投票**

1. 访问 curve.fi/dao/gauges
2. 找到要投票的池子
3. 输入投票权重（可以分配给多个池子）
4. 点击 "Vote for gauge weights"
5. 确认交易（Gas 费 $15-25）

**投票注意事项：**
- 每个地址每 10 天只能投票一次
- 投票会锁定你的 veCRV（不影响投票权，只是不能更改）
- 可以投给多个池子（如 30% A池，40% B池，30% C池）
- 投票在下周四生效

**步骤 8：在 Votium 上投票（推荐）**

如果想同时投票并领取 Bribes：

1. 访问 votium.app
2. 连接钱包
3. 查看当前 Round 的池子
4. 勾选要投票的池子并分配权重
5. 点击 "Submit Votes"
6. 确认交易

**Votium 优势：**
- 自动匹配 Curve 投票和 Bribes 领取
- 界面更友好
- 显示预期收益

---

### 领取收益（每 2-4 周：10 分钟）

**步骤 9：在 Curve 上 Claim 手续费**

1. 访问 curve.fi/dao/locker
2. 查看 "Claimable Tokens"
3. 显示可领取的 3CRV（代表手续费分成）
4. 点击 "Claim"
5. 确认交易（Gas 费 $30-50）

**3CRV 说明：**
- 3CRV 是 Curve 3pool 的 LP Token
- 代表 DAI、USDC、USDT 的组合
- 可以在 Curve 上 Remove Liquidity 换回稳定币
- 或持有 3CRV 继续赚取交易手续费

**步骤 10：在 Votium 上 Claim Bribes**

1. 访问 votium.app/claim
2. 查看可领取的 Bribes（多种代币）
3. 点击 "Claim All"
4. 确认交易（Gas 费 $30-50，取决于代币种类）

**Bribes 代币处理：**
- 通常包括 CVX、FXS、SPELL、ALCX 等项目代币
- 可以在 1inch、Cowswap 上兑换为 ETH 或稳定币
- 或持有这些代币（如果看好项目）

**步骤 11：Claim 优化策略**

由于 Gas 费高，需要优化 Claim 时机：

**策略 1：累积后 Claim**
- 等待收益累积至 > $500 再 Claim
- 使 Gas 费占比 < 10%

**策略 2：Gas 低谷 Claim**
- 周末或凌晨 Gas 费可能降低 50%
- 使用 gasnow.org 监控

**策略 3：批量 Claim**
- 使用 DeFiSaver、Zapper 等工具批量 Claim
- 一次交易完成多个协议的 Claim

---

### 高级策略（可选）

**步骤 12：延长锁定期**

如果锁定快到期，或想增加 veCRV 权重：

1. 访问 curve.fi/dao/locker
2. 点击 "Extend Lock"
3. 选择新的锁定结束时间
4. 确认交易（Gas 费 $20-30）

**步骤 13：增加锁定数量**

1. 点击 "Increase Lock Amount"
2. 输入追加的 CRV 数量
3. veCRV 会按剩余时间比例增加
4. 确认交易

**步骤 14：使用 Yearn 的 yCRV**

如果不想直接持有 veCRV：

1. 在 Yearn Finance 将 CRV 存入 yCRV Vault
2. Yearn 代替你锁定和投票
3. 获得自动复利的收益
4. 保持一定流动性（可赎回 yCRV，可能有折价）

---

## ⚠️ 风险提示

### 主要风险

**1. CRV 代币价格波动风险 ⭐⭐⭐⭐⭐**
- **风险说明：** CRV 价格历史波动巨大（$0.30 - $6.00）
- **影响：** 即使投票收益高，CRV 价格下跌仍会导致本金大幅缩水
- **历史案例：** 2021 年牛市顶峰 CRV 达到 $6，2022 年熊市跌至 $0.50，跌幅 92%
- **应对措施：**
  - 只用闲置资金参与
  - 分批建仓，降低成本
  - 定期将收益兑换为稳定币
  - 对冲策略：做空 CRV 或购买 PUT 期权

**2. 锁定期流动性风险（极高）⭐⭐⭐⭐⭐**
- **风险说明：** veCRV 完全不可转让，锁定后只能等到期
- **影响：** 市场暴跌时无法止损，错过其他机会
- **应对措施：**
  - 这是 Curve 最大的风险点
  - 只锁定能承受完全损失的资金
  - 保留至少 50% 资金在流动性高的资产中
  - 或通过 Convex、Yearn 等间接参与

**3. 以太坊 Gas 费风险 ⭐⭐⭐⭐**
- **风险说明：** 以太坊主网 Gas 费高昂，小资金不适合
- **影响：** 频繁操作的 Gas 费可能吃掉大部分收益
- **Gas 费示例：**
  - 锁定 CRV：$20-30
  - 投票：$15-25
  - Claim 奖励：$30-50
  - 总计：$65-105/次完整操作
- **应对措施：**
  - 建议资金 > $5,000 再参与
  - 在 Gas 低谷时段操作
  - 考虑 Curve 在 L2 的部署（Arbitrum、Optimism）
  - 或通过 Convex 等协议间接参与（Gas 效率更高）

**4. Bribes 不确定性风险 ⭐⭐⭐**
- **风险说明：** 项目方提供的 Bribes 金额每轮变化，不稳定
- **影响：** 预期收益可能突然下降
- **应对措施：**
  - 不要把收益全部押注在 Bribes 上
  - 手续费分成是更稳定的收益来源
  - 分散投票给多个池子

**5. 项目代币归零风险 ⭐⭐⭐**
- **风险说明：** Bribes 中收到的项目代币（如 SPELL、MIM）可能暴跌或归零
- **历史案例：** SPELL 从 $0.02 跌至 $0.0005，跌幅 97.5%
- **应对措施：**
  - 及时将 Bribes 代币兑换为 ETH 或稳定币
  - 只持有你了解和信任的项目代币
  - 使用 Cowswap（MEV 保护）兑换

**6. 智能合约风险 ⭐⭐**
- **风险说明：** Curve 合约可能存在漏洞
- **应对措施：**
  - Curve 运行 5 年，管理超过 100 亿美元，安全性极高
  - 但 2023 年 Vyper 编译器漏洞曾导致部分池子被攻击
  - 建议不要投入全部资产

**7. veCRV 权重衰减风险 ⭐⭐⭐**
- **风险说明：** veCRV 余额随时间线性衰减
- **影响：** 投票权和收益逐渐降低
- **应对措施：**
  - 定期延长锁定期以维持权重
  - 或在解锁前 1 年开始逐步退出

**8. 监管风险 ⭐⭐**
- **风险说明：** DeFi 面临日益严格的监管
- **应对措施：**
  - Curve 是去中心化协议，前端被封锁也可通过 IPFS 访问
  - 关注监管动态，做好应对准备

---

## ❓ 常见问题 FAQ

**Q1：Curve 和 Uniswap 有什么区别？**
A1：
- Curve 专注于稳定币和相似资产（如 ETH-stETH）
- Curve 的交易滑点远低于 Uniswap
- Curve 的 LP 无常损失极低（稳定币间价格波动小）
- Uniswap 支持任意 ERC-20 代币对
- Curve 的 veCRV 投票机制更复杂但收益更高

**Q2：为什么 veCRV 不能转让？**
A2：
- 这是 Curve 的设计选择，防止投票权被炒作
- 鼓励长期参与而非投机
- Convex 等协议通过包装 veCRV 实现了流动性
- 新一代协议（如 Velodrome）改进了这个设计

**Q3：Convex vs 直接持有 veCRV，哪个更好？**
A3：

| 维度 | 直接持有 veCRV | 通过 Convex |
|------|---------------|------------|
| **收益** | 最高（100%） | 较高（80-90%） |
| **流动性** | 无（锁定 4 年） | 中（可赎回 cvxCRV，可能折价） |
| **复杂度** | 高（需要投票、Claim） | 低（自动化） |
| **Gas 费** | 高 | 中（批量操作优化） |
| **适合人群** | 专业玩家，大资金 | 普通用户，中小资金 |

**结论：**
- 资金 > $50,000，且愿意主动管理：直接持有 veCRV
- 其他情况：通过 Convex 更省心

**Q4：Curve 在 L2 上的表现如何？**
A4：
- Curve 已部署在 Arbitrum、Optimism、Polygon 等 L2
- L2 优势：Gas 费降低 95%+，适合小资金
- L2 劣势：TVL 和交易量远低于主网，收益可能降低 30-50%
- 建议：小资金（< $5,000）在 L2 参与，大资金在主网

**Q5：如何计算我的 Boost 倍数？**
A5：
Boost 公式：\`min(1 + 1.5 × veCRV占比, 2.5)\`

例子：
- 你提供 $100,000 LP
- Curve 该池总 LP：$1,000,000,000
- 你的 LP 占比：0.01%
- 你需要的 veCRV：$1,000,000,000 × 0.01% × 40% = $40,000 等值 veCRV
- 如果你有 $40,000 veCRV，可获得最大 2.5 倍 Boost

**Q6：Votium 的 Bribes 什么时候发放？**
A6：
- Votium 每 2 周一个 Round
- 投票后约 1-2 周可以 Claim
- 在 votium.app/claim 查看可领取金额

**Q7：我的 veCRV 快到期了，应该怎么办？**
A7：
1. **延长锁定**：如果仍看好 Curve，延长至 4 年
2. **解锁退出**：等到期后解锁 CRV，卖出或转入其他策略
3. **转向 Convex**：解锁后将 CRV 换成 cvxCRV，保持流动性

**Q8：为什么我的 veCRV 余额在减少？**
A8：
- veCRV 会随时间线性衰减
- 这是正常现象，反映剩余锁定时间减少
- 投票权和收益也会相应降低
- 可以通过延长锁定期恢复权重

**Q9：Gas 费太贵，有没有省钱方法？**
A9：
1. **在 L2 参与**：Arbitrum、Optimism 的 Curve，Gas 费 < $1
2. **使用聚合器**：Zapper、DefiSaver 批量操作
3. **通过 Convex**：Convex 的批量操作更 Gas 高效
4. **累积后 Claim**：等奖励 > $500 再 Claim
5. **监控 Gas**：在低谷时段（周末凌晨）操作

**Q10：Curve 会不会被新协议取代？**
A10：
- Curve 有强大的网络效应和先发优势
- 几乎所有稳定币都在 Curve 上建池
- 与 Aave、Compound、Convex 等深度整合
- Curve V2 支持非稳定币资产，扩大应用场景
- 但需关注竞争对手（如 Uniswap V3、Maverick）

**Q11：什么是 Curve War？我作为小用户有什么好处？**
A11：
- Curve War 是大型协议和 DAO 争夺 veCRV 控制权
- 他们通过 Votium 等平台向 veCRV 持有者支付 Bribes
- 小用户受益：可以出租投票权获得高额 Bribes
- 本质上你成为了"流动性雇佣军"，谁给的钱多就投给谁

**Q12：需要多少资金才值得参与 Curve veCRV？**
A12：考虑 Gas 费成本：
- **最低门槛**：$5,000（Gas 费占比约 2%）
- **建议门槛**：$10,000+（Gas 费占比 < 1%）
- **理想金额**：$50,000+（可以忽略 Gas 费影响）
- 如果资金 < $5,000，建议通过 Convex 或在 L2 参与

---

## 📚 总结

Curve veCRV 投票是 DeFi 中最成熟、最稳定的流动性挖矿策略之一。作为 DeFi 的基础设施，Curve 拥有无可比拟的网络效应和护城河。持有 veCRV 相当于拥有整个稳定币交易市场的一部分权益。

**关键要点：**
1. **蓝筹地位**：Curve 是 DeFi TVL 排名前 3 的协议，5 年历史验证
2. **多重收益**：手续费分成 + Bribes + Boost + CRV 释放
3. **Curve Wars**：协议间竞争推高 veCRV 持有者收益
4. **稳定性高**：主要投稳定币池，收益波动小
5. **流动性差**：veCRV 不可转让，锁定 4 年（最大风险）

**收益预期：**
- 保守策略（稳定币池）：年化 15-30%
- 平衡策略（混合池 + Bribes）：年化 25-45%
- 激进策略（高 Bribes 池）：年化 40-60%

**适合人群：**
- DeFi 老手，熟悉以太坊主网操作
- 大资金用户（> $10,000），可以忽略 Gas 费
- 长期看好 DeFi 和稳定币市场
- 能接受 4 年锁定期，资金流动性要求低
- 愿意定期投票和 Claim 奖励

**不适合人群：**
- DeFi 新手（操作复杂，Gas 费高）
- 小资金用户（< $5,000，Gas 费占比太高）
- 需要灵活资金周转
- 无法接受 CRV 价格波动风险

**替代方案：**
- **Convex Finance**：间接参与 veCRV，保持流动性，收益略低
- **Yearn Finance**：自动化策略，省心但收益更低
- **Curve on L2**：Gas 费低，适合小资金，但收益也低

**与其他协议对比：**
- vs Uniswap V3：Curve 专注稳定币，无常损失更低
- vs Velodrome/Thena：Curve 更成熟，但 veNFT 不可转让是劣势
- vs Balancer：Curve 的稳定币交易效率更高

**最终建议：**
Curve veCRV 是"DeFi 国债"——收益稳健，风险相对较低（除了 4 年锁定），适合作为 DeFi 投资组合的核心持仓。但必须充分理解流动性风险，只用真正的闲置资金参与。如果无法接受长期锁定，通过 Convex 等协议间接参与是更好的选择。

记住：Curve 代表的是 DeFi 基础设施的价值，而非短期投机机会。长期持有 veCRV 相当于投资整个稳定币交易市场的增长！`,
  steps: [
    '准备以太坊主网钱包和足够的 ETH（Gas 费）',
    '购买 CRV 代币并决定锁定时长',
    '在 Curve DAO 页面锁定 CRV 获得 veCRV',
    '研究各 Gauge 的权重和收益情况',
    '在 Votium 查看当前 Round 的 Bribes',
    '制定投票策略（手续费 vs Bribes）',
    '在 Curve 或 Votium 执行投票（每 10 天）',
    '每 2-4 周 Claim 手续费和 Bribes',
    '处理收益：兑换为稳定币或复投',
    '定期延长锁定期以维持 veCRV 权重',
    '（可选）提供 LP 并使用 veCRV Boost',
    '锁定到期后解锁或重新锁定'
  ]
};

async function getAuthToken() {
  try {
    const response = await axios.post('http://localhost:8055/auth/login', {
      email: 'the_uk1@outlook.com',
      password: 'Mygcdjmyxzg2026!'
    });
    return response.data.data.access_token;
  } catch (error) {
    console.error('认证失败:', error.response?.data || error.message);
    throw error;
  }
}

async function createStrategies() {
  try {
    const token = await getAuthToken();
    console.log('认证成功，开始创建策略...\n');

    // 创建策略 14.3
    console.log('正在创建策略 14.3: Velodrome veVELO 投票...');
    const response1 = await axios.post(
      'http://localhost:8055/items/strategies',
      STRATEGY_14_3,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('✅ 策略 14.3 创建成功! ID:', response1.data.data.id);
    console.log(`   标题: ${STRATEGY_14_3.title}`);
    console.log(`   Slug: ${STRATEGY_14_3.slug}\n`);

    // 创建策略 14.4
    console.log('正在创建策略 14.4: Curve Gauge 投票权...');
    const response2 = await axios.post(
      'http://localhost:8055/items/strategies',
      STRATEGY_14_4,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('✅ 策略 14.4 创建成功! ID:', response2.data.data.id);
    console.log(`   标题: ${STRATEGY_14_4.title}`);
    console.log(`   Slug: ${STRATEGY_14_4.slug}\n`);

    // 获取总策略数
    const countResponse = await axios.get(
      'http://localhost:8055/items/strategies?aggregate[count]=id',
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    const totalCount = countResponse.data.data[0].count.id;
    console.log('========================================');
    console.log('🎉 所有策略创建完成！');
    console.log(`📊 当前数据库中共有 ${totalCount} 个策略`);
    console.log('========================================');

  } catch (error) {
    console.error('❌ 创建策略时出错:', error.response?.data || error.message);
    throw error;
  }
}

createStrategies();
