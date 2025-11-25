const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

// Strategy 9.5: Ether.fi eETH Strategy
const STRATEGY_9_5 = {
  title: 'Ether.fi eETH 策略 - 去中心化原生质押 + 流动性再质押一体化方案',
  slug: 'etherfi-eeth-strategy',
  summary: '通过 Ether.fi 进行以太坊原生质押同时参与 EigenLayer 再质押，使用去中心化节点网络保障安全性，获得 eETH 流动性代币，享受 ETH 质押、EigenLayer AVS 和 Ether.fi 生态的三重收益。',
  category: 'restaking',
  category_l1: 'yield',
  category_l2: '再质押/LRT',
  difficulty_level: 2,
  risk_level: 2,
  apy_min: 7,
  apy_max: 22,
  threshold_capital: '0.01 ETH 起',
  threshold_capital_min: 30,
  time_commitment: '初次设置 30 分钟，每月维护 15 分钟',
  time_commitment_minutes: 30,
  threshold_tech_level: 'beginner',
  content: `
## 什么是 Ether.fi 和 eETH

Ether.fi 是一个去中心化的以太坊原生质押协议，同时也是 EigenLayer 的流动性再质押协议。它的核心创新在于将原生质押（Native Staking）和再质押（Restaking）无缝结合，提供一站式解决方案。

### 核心特点

**1. 原生质押 + 再质押一体化**

Ether.fi 的独特架构：
- 用户存入 ETH → Ether.fi 运行验证节点 → 同时参与 EigenLayer
- 不需要先获得 LST 再进行再质押（简化流程）
- 一步到位，获得双重收益

**2. 去中心化节点网络**

与 Lido 等中心化质押服务不同：
- 节点运营者分布式（任何人可以申请成为节点运营者）
- 用户保留提款密钥（Non-custodial）
- 降低单点故障风险
- 更符合以太坊去中心化精神

**3. eETH 流动性代币**

- 1:1 锚定 ETH（会随着奖励累积而增值）
- 可以在 DeFi 中自由使用
- 比 stETH 更多功能：同时包含 ETH 质押 + EigenLayer 收益

**4. 创新的 NFT 机制**

Ether.fi 使用 NFT 代表用户的质押份额：
- **T-NFT（Validator Ticket NFT）**：代表质押的所有权
- **B-NFT（Bond NFT）**：节点运营者的保证金
- 用户可以随时出售 T-NFT 退出（不需要等待提款队列）

**5. 双重代币激励**

- **ETHFI 代币**：治理代币，质押可以获得协议收入分成
- **Loyalty Points**：积分系统，可能未来有更多空投

### 与其他 LRT 对比

| 指标 | Ether.fi | Renzo | Puffer | Kelp DAO |
|-----|----------|-------|--------|----------|
| 代币 | eETH | ezETH | pufETH | rsETH |
| **质押方式** | 原生质押 | LST 再质押 | 原生质押 | LST 再质押 |
| **去中心化** | 高（分布式节点） | 低（中心化 Operator） | 高（任何人可运行节点） | 中（DAO 治理） |
| **协议费用** | 5% | 10% | 5% | 0%（暂时） |
| **TVL** | $800M | $1.2B | $150M | $200M |
| **DeFi 整合** | 高 | 最高 | 低 | 中 |
| **代币发行** | ✅ 已发行 | ❌ 未发行 | ❌ 未发行 | ❌ 未发行 |
| **推荐度** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

Ether.fi 的独特优势：
- ✅ 真正的原生质押（不依赖 LST）
- ✅ 去中心化程度高（节点运营者分布式）
- ✅ 用户保留提款密钥（Non-custodial）
- ✅ 已发行 ETHFI 代币（可以质押获得收益分成）
- ✅ 创新的 NFT 机制（T-NFT、B-NFT）
- ✅ 优秀的 DeFi 整合（仅次于 Renzo）

### 收益来源

**1. ETH 原生质押收益（3.5-4.5% APR）**
- 来自以太坊信标链的验证奖励
- 区块提案奖励
- MEV 收益（通过 MEV Boost）

**2. EigenLayer 再质押奖励（4-12% APR）**
- Ether.fi 验证节点自动参与 EigenLayer
- 参与的 AVS 包括：EigenDA、AltLayer、Omni 等
- Ether.fi 团队专业管理 AVS 组合

**3. EigenLayer 积分**
- 所有 eETH 持有者累积 EigenLayer Points
- 积分权重：1.0x（与原生质押相同）
- 未来可能兑换为 $EIGEN 代币

**4. Ether.fi Loyalty Points**
- 每持有 1 eETH 每天累积 Loyalty Points
- 积分可用于：
  - 治理投票权重加成
  - 未来可能的空投
  - 协议新功能优先体验

**5. ETHFI 代币质押收益（可选）**
- 如果你持有 ETHFI 代币并质押
- 获得协议收入分成（来自 5% 协议费）
- 当前质押 APR：10-25%（取决于质押率）

**6. DeFi 额外收益（5-15% APR）**
- 在 Curve、Pendle 等使用 eETH
- 借贷协议中作为抵押品
- 流动性挖矿

**总收益潜力**
- 仅持有 eETH：7-16% APR
- eETH + DeFi 策略：12-22% APR
- eETH + ETHFI 质押：15-30% APR（包含 ETHFI 收益）

## 实操步骤

### Step 1: 准备钱包和资产

**需要准备**
- MetaMask 或其他 Web3 钱包
- 至少 0.1 ETH（建议首次 0.5-1 ETH 测试）
- 额外 0.02 ETH 用于 Gas 费用

**支持的存款资产**
- ETH（原生以太坊）
- 未来可能支持 LST

**安全检查**
- [ ] 钱包助记词已安全备份
- [ ] 了解 Ether.fi 的基本原理
- [ ] 确认钱包地址正确且有足够余额

### Step 2: 在 Ether.fi 存入 ETH 获得 eETH

**访问 Ether.fi App**

1. 打开 https://app.ether.fi
2. 连接钱包（MetaMask、WalletConnect 等）
3. 确认网络为 Ethereum Mainnet

**选择质押方式**

Ether.fi 提供两种方式：

**方式 A：Liquid Staking（推荐大多数用户）**

特点：
- 即时获得 eETH
- 无需等待验证节点激活
- 流动性最好

步骤：
1. 点击 "Stake" 标签
2. 选择 "Liquid"
3. 输入要质押的 ETH 数量（如 1 ETH）
4. 查看将收到的 eETH 数量
   - 通常 1 ETH = 0.98-1.00 eETH
   - eETH/ETH 汇率会随着奖励累积而增长
5. 查看预期 APR：
   - ETH Staking：3.8%
   - EigenLayer：8.2%
   - Total APR：12.0%
6. 点击 "Stake"
7. 确认交易（Gas 费约 $10-25）
8. 等待交易确认（30-90 秒）
9. eETH 会出现在你的钱包中

**方式 B：Operation Solo Staking（高级用户）**

特点：
- 你拥有完整的验证节点
- 获得更高的收益（节省节点运营费）
- 需要至少 32 ETH

步骤：
1. 点击 "Operation Solo Staking"
2. 质押 32 ETH
3. Ether.fi 会帮你生成验证器密钥
4. 你保留提款密钥（确保资金安全）
5. 等待验证器激活（约 12-24 小时）
6. 激活后自动参与 ETH 质押 + EigenLayer

**确认成功**

1. 在钱包中查看 eETH 余额
   - eETH 合约地址：0x35fA164735182de50811E8e2E824cFb9B6118ac2
   - 如未自动显示，手动添加代币

2. 访问 Ether.fi Dashboard（https://app.ether.fi/portfolio）
   - 查看你的 eETH 余额
   - 查看累积的 Loyalty Points
   - 查看累积的 EigenLayer Points
   - 查看历史 APR

### Step 3: 监控收益和积分

**Ether.fi Dashboard**

访问 https://app.ether.fi/portfolio，查看：

**1. 余额概览**
- Total eETH：你的总持仓
- Current Value：当前价值（ETH 和 USD）
- Total Rewards：累积的奖励

**2. 收益明细**
- ETH Staking Rewards：信标链质押奖励
- EigenLayer Rewards：AVS 奖励
- 24h/7d/30d 收益变化

**3. 积分追踪**
- Loyalty Points：Ether.fi 积分
  - 计算：1 eETH × 1 天 = X 点（基础）
  - 早期用户加成：1.2-1.5x
- EigenLayer Points：每小时累积
- 积分排名：查看你在所有用户中的位置

**4. APR 历史**
- 图表显示过去 30/90 天的 APR 变化
- 平均 APR
- 收益来源拆解

**5. T-NFT 管理**（如果你有）
- 如果你进行了 Operation Solo Staking
- 会收到 T-NFT（代表验证节点所有权）
- 可以在 OpenSea 上交易 T-NFT 快速退出

**每周监控清单**
- [ ] eETH 价值是否正常增长（每周约 +0.15-0.25%）
- [ ] Loyalty Points 正常累积
- [ ] EigenLayer Points 正常累积
- [ ] eETH/ETH 汇率正常（0.98-1.02）
- [ ] 查看 Ether.fi 官方公告（Twitter、Discord）

**每月监控清单**
- [ ] 计算实际 APR 并与预期对比
- [ ] 查看 Ether.fi 的 AVS 组合是否变化
- [ ] 评估是否需要调整策略（增加投入、参与 DeFi）
- [ ] 查看 ETHFI 代币价格和质押机会
- [ ] 更新风险评估

### Step 4: 质押 ETHFI 代币获得额外收益（可选）

**ETHFI 代币介绍**

- 代币符号：ETHFI
- 用途：治理 + 质押获得协议收入分成
- 总供应量：10 亿
- 当前流通：约 1.5 亿（15%）
- 价格：$2-5/ETHFI（波动）

**质押 ETHFI 的收益**

1. **协议收入分成**
   - Ether.fi 收取 5% 的协议费
   - 50% 分配给 ETHFI 质押者
   - 当前质押 APR：15-25%（取决于质押率和协议收入）

2. **治理权重**
   - 质押的 ETHFI 有投票权
   - 参与协议决策（AVS 选择、费用调整等）

3. **额外 Loyalty Points**
   - 质押 ETHFI 额外获得 Loyalty Points
   - 加成：1.2-1.5x

**如何质押 ETHFI**

1. **购买 ETHFI 代币**
   - 交易所：Binance、OKX、Gate.io
   - DEX：Uniswap、Curve
   - 当前价格：约 $3/ETHFI

2. **质押操作**
   - 访问 https://app.ether.fi/stake-ethfi
   - 连接钱包
   - 点击 "Stake ETHFI"
   - 输入数量（最低通常 100 ETHFI）
   - 授权并确认交易

3. **锁定期**
   - 质押后有 7 天冷却期才能提款
   - 提款后 7 天后才能 Claim

4. **收益 Claim**
   - 每周或每月 Claim 一次
   - 奖励以 ETH 或 eETH 的形式发放
   - 可以复投（Compound）或提取

**是否应该质押 ETHFI？**

优势：
- ✅ 15-25% APR（高于纯 eETH）
- ✅ 获得协议真实收入（不是通胀奖励）
- ✅ 参与治理

劣势：
- ❌ ETHFI 价格波动风险（可能跌 30-50%）
- ❌ 7 天冷却期（流动性差）
- ❌ 需要额外资金购买 ETHFI

建议：
- 如果看好 Ether.fi 长期发展：配置 20-30% 资金购买并质押 ETHFI
- 如果只想稳定收益：只持有 eETH，不买 ETHFI

### Step 5: 使用 eETH 在 DeFi 中获取额外收益

**策略 1：Curve 流动性挖矿**

**Curve eETH/ETH 池**

- TVL：约 $100M（流动性很好）
- APR 组成：
  - 交易手续费：0.5-2%
  - CRV 奖励：2-6%
  - Ether.fi 激励：3-8%（额外 Loyalty Points）
  - 总计：5.5-16% APR

操作：
1. 准备 50% eETH + 50% ETH
2. 访问 Curve，搜索 "eETH"
3. 添加流动性到 eETH/ETH 池
4. 质押 LP 代币（Curve 或 Convex）

风险：
- 无常损失（如果 eETH/ETH 比例变化）
- 池子流动性好，大额也可以操作

**策略 2：Pendle 收益交易**

**Pendle eETH 市场**

- 市场规模：约 $50M
- 到期日：滚动 3-6 个月

**玩法 A：买入 PT-eETH 锁定固定收益**

- 固定 APY：9-14%
- 适合保守型投资者
- 锁定确定性收益

步骤：
1. 访问 https://app.pendle.finance
2. 搜索 "eETH"
3. 选择到期日
4. 点击 "Buy PT"
5. 查看固定 APY（如 12%）
6. 购买并持有到期

收益：
- 假设固定 APY 12%，投入 10 ETH
- 到期收到：10 × 1.12 = 11.2 eETH
- 确定性收益：1.2 eETH（12% APR）

**玩法 B：买入 YT-eETH 放大收益**

- YT APY：20-35%（高风险高收益）
- 适合激进型投资者
- 收益随市场波动

步骤：
1. 在 Pendle 选择 eETH 市场
2. 点击 "Buy YT"
3. 查看隐含 APY（如 Underlying 14%，YT 28%）
4. 购买 YT-eETH
5. 持有到期或在二级市场交易

风险：
- 如果 eETH 实际 APY 低于预期，YT 价值下跌
- YT 是衰减资产（越接近到期，价值越低）

**策略 3：Aave 借贷**

**在 Aave V3 中使用 eETH**

- eETH 已被 Aave V3 支持为抵押品
- LTV：75%
- 借款成本：2-6% APR（取决于市场）

**循环借贷策略**

步骤：
1. 存入 10 eETH 到 Aave（价值 $30,000）
2. 借出 75% LTV 的 ETH = 7.5 ETH
3. 将借出的 ETH 再次质押为 eETH
4. 重复 1-2 次（不要过度杠杆）

收益计算：
- 初始：10 eETH
- 第 1 轮：借出 7.5 ETH → 质押为 7.5 eETH
- 第 2 轮：借出 5.6 ETH → 质押为 5.6 eETH
- 总持仓：23.1 eETH（杠杆率 2.31x）

- eETH 收益：23.1 × 12% = 2.77 ETH
- 借款成本：(7.5 + 5.6) × 4% = 0.52 ETH
- 净收益：2.77 - 0.52 = 2.25 ETH（22.5% APR）

风险：
- 如果 ETH 价格下跌 >25%，可能被清算
- 借款利率波动
- 需要监控健康因子（Health Factor）

**策略 4：Eigenpie（EigenLayer 再质押聚合器）**

**Eigenpie 是什么**

- EigenLayer 的再质押聚合器
- 接受 eETH，自动优化 AVS 分配
- 提供额外的 EGP 代币奖励

**操作**

1. 访问 https://app.eigenpie.com
2. 存入 eETH
3. 获得 eETH 在 EigenLayer 中的最优配置
4. 额外获得 EGP 代币奖励

收益：
- eETH 基础收益：12% APR
- Eigenpie 优化加成：1-3% APR
- EGP 代币奖励：5-10% APR
- 总计：18-25% APR

风险：
- 增加一层协议风险（Eigenpie 合约）
- EGP 代币价格波动

### Step 6: 赎回 eETH（如果需要退出）

**方式 1：官网赎回（无滑点，需等待）**

**标准赎回流程**

1. 访问 Ether.fi App，点击 "Unstake"
2. 选择要赎回的 eETH 数量
3. 选择接收 ETH 或 eETH（保留 eETH 便于后续操作）
4. 提交赎回请求（Gas 约 $5-15）
5. 等待解锁期：
   - 正常情况：7 天
   - 繁忙时期：7-14 天
   - 极端情况（大量赎回）：最长 28 天
6. 解锁后，点击 "Claim"
7. 确认交易（Gas 约 $3-10）
8. ETH 到达你的钱包

**快速赎回（NFT 机制）**

如果你有 T-NFT（Operation Solo Staking 用户）：
1. 在 OpenSea 上出售 T-NFT
2. 买家支付 ETH 购买你的 T-NFT
3. 你立即获得 ETH，无需等待解锁期

优势：
- 即时退出（<1 小时）
- 无需等待 7 天

劣势：
- 可能需要折价出售（5-10% 折价）
- 买家需求取决于市场

**方式 2：在 DEX 上卖出 eETH（即时，可能有滑点）**

**主要交易对**

1. **Curve eETH/ETH 池**（推荐，流动性最好）
   - TVL：$100M
   - 滑点（<10 eETH）：0.05-0.2%
   - 滑点（10-50 eETH）：0.2-1%
   - 滑点（50-200 eETH）：1-3%

2. **Uniswap V3 eETH/ETH 池**
   - 流动性较 Curve 少
   - 滑点可能略高：0.3-1.5%

操作：
1. 选择 Curve（流动性最好）
2. 连接钱包
3. From: eETH，To: ETH
4. 查看滑点和最终收到的 ETH 数量
5. 如果滑点可接受（<0.5%），执行交易
6. 即时到账

**方式 3：使用聚合器**

**推荐聚合器**

- **1inch**：自动寻找最优路径
- **CoW Swap**：MEV 保护，可能获得更好价格
- **Matcha**：0x 协议聚合器

步骤：
1. 访问聚合器（如 1inch）
2. 输入 eETH → ETH
3. 比较聚合器报价和 Curve 报价
4. 选择最优价格
5. 执行交易

**退出方式对比**

假设要卖出 10 eETH（价值 10.2 ETH）：

| 方式 | 收到 ETH | 时间 | Gas 费用 | 总成本 |
|-----|---------|------|---------|--------|
| 官网赎回 | 10.20 | 7-14 天 | $15 | $15 (0.15%) |
| Curve 卖出 | 10.15 | 即时 | $20 | $65 (0.64%) |
| 1inch | 10.17 | 即时 | $25 | $55 (0.54%) |
| CoW Swap | 10.18 | 5-10 分钟 | $15 | $35 (0.34%) |
| T-NFT 出售 | 9.70 | <1 小时 | $10 | $510 (5%) |

建议：
- 不着急：使用官网赎回（成本最低）
- 需要快速退出：使用 CoW Swap 或 1inch
- 有 T-NFT 且极度紧急：出售 T-NFT（成本最高）

## 收益计算实例

### 案例 1：仅持有 eETH（10 ETH）

**初始投入**
- 10 ETH（约 $30,000）
- 策略：只持有 eETH，不参与 DeFi

**年化收益**

1. **ETH 原生质押收益**
   - APR：3.8%
   - 年收益：10 × 3.8% = 0.38 ETH（$1,140）

2. **EigenLayer AVS 奖励**
   - Ether.fi 参与的 AVS 平均 APR：8%
   - 年收益：10 × 8% = 0.8 ETH（$2,400）

3. **协议费用**
   - Ether.fi 收取 5%
   - 扣除：(0.38 + 0.8) × 5% = 0.059 ETH（$177）

4. **净收益**
   - 0.38 + 0.8 - 0.059 = 1.121 ETH（$3,363）
   - **APR：11.2%**

5. **积分价值（假设）**
   - Loyalty Points：每天 10 点 × 365 = 3,650 点
   - 假设未来空投价值：3,650 点 × $0.50 = $1,825
   - EigenLayer Points：87,600 点 × $0.10 = $8,760
   - 潜在空投：$10,585

**总收益**
- 确定收益：$3,363（11.2% APR）
- 潜在空投：$10,585（35.3%）
- **总计：$13,948（46.5%）**

**成本**
- Gas（存入）：$20
- Gas（监控）：$30/年
- 年总成本：$50

**净收益**
- 保守（不含空投）：$3,363 - $50 = $3,313（11.0% APR）
- 乐观（含空投）：$13,948 - $50 = $13,898（46.3%）

### 案例 2：eETH + Curve LP（10 ETH）

**初始投入**
- 10 ETH → 5 eETH + 5 ETH（Curve LP）

**年化收益**

1. **eETH 基础收益（5 ETH 部分）**
   - 11.2% APR × 5 ETH = 0.56 ETH（$1,680）

2. **Curve LP 收益（5 eETH + 5 ETH）**
   - 交易手续费：1.5% = 0.15 ETH（$450）
   - CRV 奖励：4% = 0.4 ETH（$1,200）
   - Ether.fi 激励：5% = 0.5 ETH（$1,500）
   - 小计：1.05 ETH（$3,150）

3. **总收益**
   - 0.56 + 1.05 = 1.61 ETH（$4,830）
   - **APR：16.1%**

**风险调整**
- 无常损失（假设）：-0.1 ETH（-$300）
- 净收益：1.51 ETH（$4,530）
- **净 APR：15.1%**

**成本**
- Gas（存入 + LP）：$50
- Gas（管理）：$50/年
- 年总成本：$100

**净收益**
- 保守：$4,530 - $100 = $4,430（14.8% APR）
- 含空投：$4,430 + $10,585 = $15,015（50%）

### 案例 3：eETH + ETHFI 质押 + Pendle（20 ETH + $6000）

**初始投入**
- 10 ETH：持有 eETH
- 5 ETH：Pendle PT-eETH（锁定固定收益）
- 5 ETH：Curve LP
- $6,000：购买 2,000 ETHFI 并质押

**年化收益**

1. **eETH 持有（10 ETH）**
   - 11.2% APR = 1.12 ETH（$3,360）

2. **Pendle PT-eETH（5 ETH）**
   - 固定 12% APY = 0.6 ETH（$1,800）

3. **Curve LP（5 ETH）**
   - 10.5% APR = 0.525 ETH（$1,575）

4. **ETHFI 质押（2,000 ETHFI）**
   - 20% APR = 400 ETHFI（$1,200）
   - 或 ETHFI 价格上涨：$3 → $5 = $4,000 额外收益

**总收益**
- eETH 相关：1.12 + 0.6 + 0.525 = 2.245 ETH（$6,735）
- ETHFI：$1,200（质押收益）+ $4,000（价格上涨，假设）= $5,200
- **总计：$11,935**

**总投入**
- 20 ETH = $60,000
- 2,000 ETHFI = $6,000
- 合计：$66,000

**投资回报率**
- 确定收益（不含 ETHFI 价格上涨）：($6,735 + $1,200) / $66,000 = 12.0% APR
- 含 ETHFI 价格上涨：$11,935 / $66,000 = 18.1% APR
- 含空投（假设）：($11,935 + $10,585) / $66,000 = 34.1%

**成本**
- Gas（多次操作）：$150
- 年总成本：$150

**净收益**
- 保守：$7,935 - $150 = $7,785（11.8% APR）
- 乐观：$22,520 - $150 = $22,370（33.9%）

## 风险管理

### Ether.fi 特有风险

**1. 节点运营者风险（严重性：中低）**

风险描述：
- Ether.fi 的验证节点由分布式的节点运营者运行
- 如果某个节点运营者表现不佳或作恶，可能影响收益

历史：
- Ether.fi 有严格的节点运营者筛选机制
- 节点运营者需要质押 B-NFT（保证金）
- 截至 2024 年 Q2，无重大节点故障

缓解措施：
- ✅ Ether.fi 会自动监控和替换表现不佳的节点
- ✅ 用户资金受到 B-NFT 保证金保护
- ✅ 分布式节点降低单点故障风险
- ✅ 用户保留提款密钥（Non-custodial）

**2. ETHFI 代币价格波动风险（严重性：中高）**

风险描述：
- 如果你购买并质押 ETHFI，代币价格波动会影响总收益
- ETHFI 价格可能下跌 30-50%（特别是在熊市）

历史价格：
- 2024 年 3 月 TGE：$5
- 2024 年 4 月高点：$7
- 2024 年 5 月低点：$2.5
- 当前（2024 Q2）：$3-4

缓解措施：
- ✅ 只用 20-30% 资金购买 ETHFI
- ✅ 长期持有（质押锁定）避免情绪化交易
- ✅ 定期 Claim 质押收益，对冲价格风险
- ✅ 设置止损（如果 ETHFI 跌破 $2，考虑退出）

**3. eETH 脱锚风险（严重性：低）**

风险描述：
- eETH 在二级市场的价格可能低于其内在价值
- 极端情况下可能折价 2-5%

历史：
- eETH 锚定情况良好（通常折价 <1%）
- 即使在市场波动期，折价也很少超过 2%
- Curve 的 eETH/ETH 池流动性充足，套利机制高效

缓解措施：
- ✅ 不要在折价时恐慌性卖出
- ✅ 可以在折价 >1% 时买入（套利机会）
- ✅ 如果需要退出，使用官网赎回（7 天，无折价）
- ✅ 监控 eETH/ETH 汇率，设置警报

**4. DeFi 策略风险（严重性：中）**

风险描述：
- 如果使用 eETH 在 DeFi 中（Curve LP、Pendle、Aave）
- 会增加额外的智能合约风险、无常损失、清算风险

具体风险：
- **Curve LP**：无常损失（通常 <2%）
- **Pendle**：YT 价值衰减、市场波动
- **Aave 循环借贷**：清算风险（如果 ETH 跌 >25%）

缓解措施：
- ✅ 只用 30-50% 的 eETH 参与 DeFi
- ✅ 选择经过审计的协议（Curve、Pendle、Aave 都已审计多次）
- ✅ 监控健康因子（Aave）、无常损失（Curve）
- ✅ 设置自动止损或警报

### 监控清单

**每日检查（3 分钟）**
- [ ] eETH/ETH 汇率正常（0.98-1.02）
- [ ] Ether.fi Dashboard 无异常警告
- [ ] 如果质押 ETHFI，查看质押状态

**每周检查（15 分钟）**
- [ ] eETH 价值增长正常（每周约 +0.2-0.3%）
- [ ] Loyalty Points 和 EigenLayer Points 正常累积
- [ ] APR 是否符合预期
- [ ] 查看 Ether.fi 官方公告（Twitter、Discord）
- [ ] 如果参与 DeFi，检查 LP 表现、健康因子

**每月检查（30 分钟）**
- [ ] 计算实际收益并对比预期
- [ ] 评估 ETHFI 代币价格和质押机会
- [ ] 查看 Ether.fi 的 AVS 组合是否变化
- [ ] 考虑是否调整策略（增加投入、参与新 DeFi 机会）
- [ ] 更新风险评估

### 紧急退出

**场景 1：eETH 大幅脱锚（>3%）且持续**
1. 不要立即在 DEX 上卖出（会锁定损失）
2. 在 Ether.fi 官网发起赎回（需等待 7 天）
3. 关注 Ether.fi 官方声明
4. 如果确认是协议问题，尽快退出

**场景 2：Ether.fi 协议出现安全问题**
1. 立即停止新的投入
2. 如果资金未被冻结，尽快赎回
3. 将赎回的 ETH 转移到冷钱包
4. 关注官方的事故报告和补偿方案

**场景 3：ETHFI 代币暴跌（>50%）**
1. 评估：是短期波动还是长期趋势
2. 如果是市场整体下跌，考虑继续持有
3. 如果是 Ether.fi 特有问题（如黑客攻击），考虑退出
4. 质押的 ETHFI 有 7 天冷却期，提前规划

**场景 4：需要紧急流动性**
1. 优先在 Curve 卖出 eETH（即时，滑点 <1%）
2. 或在 Aave 抵押 eETH 借出稳定币
3. 如果有 T-NFT，可以在 OpenSea 出售
4. 避免使用官网赎回（需等待 7 天）

## 常见问题

**Q1：Ether.fi 和 Lido 有什么区别？**
A：
- **Lido（stETH）**：
  - 中心化节点（白名单节点运营者）
  - 无 EigenLayer 集成
  - 10% 协议费
  - TVL 最大（$32B），流动性最好
- **Ether.fi（eETH）**：
  - 去中心化节点（任何人可申请）
  - 原生集成 EigenLayer
  - 5% 协议费
  - 用户保留提款密钥（Non-custodial）
- 选择：如果追求流动性和稳定性，选 Lido；如果追求去中心化和更高收益，选 Ether.fi。

**Q2：eETH 和 ezETH（Renzo）哪个更好？**
A：
- **eETH**：原生质押，去中心化程度高，5% 费用，已发行 ETHFI 代币
- **ezETH**：LST 再质押，操作更简单，10% 费用，TVL 更大
- 建议：两者都配置，分散风险。40% eETH + 40% ezETH + 20% 其他。

**Q3：Operation Solo Staking 和 Liquid Staking 哪个更好？**
A：
- **Liquid Staking**：适合大多数用户，即时获得 eETH，流动性好，门槛低（0.01 ETH 起）
- **Operation Solo Staking**：适合拥有 32 ETH 的用户，收益略高（节省节点运营费），拥有 T-NFT 可快速退出
- 建议：如果资金 <32 ETH，选 Liquid Staking。

**Q4：我应该购买并质押 ETHFI 吗？**
A：
- **优势**：15-25% APR，获得协议真实收入分成，参与治理
- **劣势**：ETHFI 价格波动风险，7 天冷却期
- 建议：如果看好 Ether.fi 长期发展，用 20-30% 资金购买并质押 ETHFI。

**Q5：eETH 可以在哪些 DeFi 协议中使用？**
A：主流协议：
- **DEX**：Curve、Uniswap V3、Balancer
- **借贷**：Aave V3、Morpho、Spark
- **收益**：Pendle、Eigenpie、Convex
- **衍生品**：Ethena（计划中）

**Q6：Loyalty Points 什么时候能兑换？**
A：Ether.fi 官方尚未公布 Loyalty Points 的具体用途和兑换时间。可能用于未来的空投、治理权重加成或协议新功能优先体验。

**Q7：T-NFT 有什么用？**
A：
- T-NFT 代表验证节点的所有权
- 仅 Operation Solo Staking 用户拥有
- 可以在 OpenSea 上交易 T-NFT 实现快速退出
- 买家支付 ETH 购买 T-NFT，你立即获得流动性

**Q8：eETH 的赎回需要多久？**
A：
- 标准赎回：7-14 天
- 繁忙时期：最长 28 天
- T-NFT 出售：<1 小时（但可能需要折价）
- DEX 卖出：即时（可能有 0.3-1% 滑点）

**Q9：Ether.fi 的节点运营者可靠吗？**
A：
- Ether.fi 有严格的节点运营者筛选和监控机制
- 节点运营者需要质押 B-NFT（保证金）
- 表现不佳的节点会被自动替换
- 历史上无重大节点故障或作恶事件

**Q10：如果我在 Ether.fi 质押后，以太坊升级怎么办？**
A：
- Ether.fi 团队会自动处理以太坊协议升级
- 用户无需任何操作
- eETH 会继续正常累积收益
- 查看 Ether.fi 官方公告了解升级影响

## 进阶技巧

**技巧 1：利用 T-NFT 快速退出**

如果你是 Operation Solo Staking 用户，拥有 T-NFT：
1. 当需要快速退出时（<24 小时）
2. 在 OpenSea 上挂单出售 T-NFT
3. 价格设置为略低于地板价（如 31.5 ETH，地板价 32 ETH）
4. 通常几小时内成交
5. 避免等待 7 天赎回期

适合：
- 紧急需要流动性
- 市场极度恐慌时快速退出
- 有更好的投资机会

**技巧 2：ETHFI 代币定投策略**

不要一次性买入大量 ETHFI，使用定投：
1. 每周买入 $100-500 的 ETHFI
2. 持续 3-6 个月
3. 平滑价格波动，降低风险
4. 买入后立即质押

好处：
- 避免买在高点
- 降低心理压力
- 长期平均成本更低

**技巧 3：跨协议收益优化**

同时使用 eETH 在多个协议中：
1. 50% 持有 eETH（基础收益）
2. 30% Curve LP（流动性挖矿）
3. 20% Pendle PT（锁定固定收益）

根据市场调整：
- 如果 Curve APR 下降，转移到 Pendle
- 如果 Pendle 固定 APY 很高（>12%），增加配置
- 每月 rebalance 一次

**技巧 4：税务优化（针对美国和部分国家用户）**

注意：这不是税务建议，请咨询专业税务顾问。

关键点：
- 质押 ETH 获得 eETH 可能不是应税事件
- Claim 的奖励（eETH 增值部分）可能是应税收入
- 卖出 eETH 是资本利得（长期持有 >1 年享受税收优惠）
- ETHFI 质押收益是应税收入

记录保留：
- 保存所有交易记录
- 使用加密税务软件（CoinTracker、Koinly）
- 记录每次 Claim 的日期和金额
- 记录 Gas 费用（可能可以抵扣）

## 总结

**Ether.fi 的核心优势**
- ✅ 原生质押 + EigenLayer 再质押一体化
- ✅ 去中心化节点网络（真正的去中心化）
- ✅ Non-custodial（用户保留提款密钥）
- ✅ 创新的 NFT 机制（T-NFT、B-NFT）
- ✅ 已发行 ETHFI 代币（质押获得协议收入分成）
- ✅ 优秀的 DeFi 整合（Curve、Pendle、Aave）
- ✅ 较低的协议费用（5% vs Lido 的 10%）

**适合人群**
- 持有 ETH 并追求高收益
- 看好 EigenLayer 再质押赛道
- 支持去中心化和以太坊精神
- 愿意在 DeFi 中使用 eETH
- 长期持有者（享受 ETHFI 质押和积分）

**推荐策略**
1. **保守型**：只持有 eETH（7-16% APR）
2. **平衡型**：eETH + Curve LP（12-20% APR）
3. **激进型**：eETH + ETHFI 质押 + Pendle + Aave（15-30% APR）

**最后建议**
- 从小额开始测试（0.5-1 ETH）
- 先熟悉 eETH 基础功能，再参与 DeFi
- 如果看好 Ether.fi，考虑购买并质押 ETHFI
- 监控 eETH/ETH 锚定和 APR 变化
- 定期 rebalance 在不同 DeFi 协议的配置
- 长期持有，享受复利和生态成长
- 关注 Ether.fi 的新功能和合作（如新的 AVS、新的 DeFi 整合）
  `,
  steps: [
    {
      order_index: 1,
      title: '准备钱包和资产（15 分钟）',
      description: `
1. 准备支持以太坊的钱包（MetaMask 或硬件钱包）
2. 确保有至少 0.1 ETH（建议首次 0.5-1 ETH 测试）
3. 准备额外 0.02 ETH 用于 Gas 费用
4. 访问 Ether.fi 官网（https://www.ether.fi）了解基本信息
5. 阅读文档和审计报告，了解风险

**检查清单**：
- [ ] 钱包已备份且安全
- [ ] 有足够的 ETH
- [ ] 了解 Ether.fi 的原理（原生质押 + EigenLayer）
- [ ] 了解 Non-custodial 的含义（你保留提款密钥）
      `
    },
    {
      order_index: 2,
      title: '质押 ETH 获得 eETH（30 分钟）',
      description: `
1. 访问 https://app.ether.fi
2. 连接钱包，确认网络为 Ethereum Mainnet
3. 选择 "Liquid Staking"（推荐大多数用户）
4. 输入要质押的 ETH 数量（如 1 ETH）
5. 查看将收到的 eETH 数量和预期 APR
   - ETH Staking：约 3.8%
   - EigenLayer：约 8%
   - Total APR：约 11-12%
6. 点击 "Stake"，确认交易（Gas 约 $10-25）
7. 等待交易确认（30-90 秒）
8. 在钱包中确认收到 eETH
   - eETH 合约：0x35fA164735182de50811E8e2E824cFb9B6118ac2
   - 如未显示，手动添加代币

**高级用户**（如果有 32 ETH）：
- 可以选择 "Operation Solo Staking"
- 拥有完整的验证节点
- 获得 T-NFT（可以在 OpenSea 交易快速退出）

**确认成功**：
- [ ] 钱包中有 eETH 余额
- [ ] Ether.fi Dashboard 显示正确的质押金额
- [ ] 开始累积 Loyalty Points 和 EigenLayer Points
      `
    },
    {
      order_index: 3,
      title: '监控收益和积分（持续）',
      description: `
**每日快速检查（3 分钟）**：
1. 访问 Ether.fi Dashboard（https://app.ether.fi/portfolio）
2. 查看：
   - eETH 余额和价值变化
   - Loyalty Points 累积
   - EigenLayer Points 累积
   - eETH/ETH 汇率（应在 0.98-1.02）

**每周详细检查（15 分钟）**：
1. 计算实际 APR：
   - eETH 价值增长 ÷ 时间
   - 对比预期 APR（11-12%）
2. 查看 Ether.fi 社区更新：
   - Twitter：@ether_fi
   - Discord：官方公告频道
3. 检查 DeFi 机会：
   - Curve eETH/ETH 池 APR
   - Pendle 固定收益率
   - Aave 借款利率

**每月全面评估（30 分钟）**：
1. 总收益计算和对比
2. 查看 ETHFI 代币价格和质押机会
3. 评估策略调整：
   - 是否增加投入？
   - 是否参与 DeFi 策略（Curve、Pendle）？
   - 是否购买并质押 ETHFI？
4. 更新风险评估
      `
    },
    {
      order_index: 4,
      title: 'DeFi 策略和 ETHFI 质押（可选）',
      description: `
**策略 1：Curve 流动性挖矿**
- 准备 50% eETH + 50% ETH
- 在 Curve 添加流动性到 eETH/ETH 池
- 质押 LP 代币（Curve 或 Convex）
- 额外收益：5-16% APR

**策略 2：Pendle 收益交易**
- 将 eETH 分拆为 PT 和 YT
- 买入 PT 锁定固定收益（9-14% APY）
- 或买入 YT 放大收益敞口（20-35% APY，高风险）

**策略 3：Aave 循环借贷**
- 存入 eETH 到 Aave V3
- 借出 75% LTV 的 ETH
- 将借出的 ETH 再质押为 eETH
- 重复 1-2 次，实现杠杆收益（15-25% APR）
- 风险：需要监控清算风险

**策略 4：购买并质押 ETHFI 代币**
1. 在交易所（Binance、OKX）或 DEX（Uniswap）购买 ETHFI
2. 访问 https://app.ether.fi/stake-ethfi
3. 质押 ETHFI（最低 100 ETHFI）
4. 获得协议收入分成（15-25% APR）
5. 额外获得 Loyalty Points 加成

**建议配置**（如果有 $40,000）：
- 50% 持有 eETH（$20,000）
- 25% Curve LP（$10,000）
- 15% Pendle PT（$6,000）
- 10% ETHFI 质押（$4,000）
      `
    },
    {
      order_index: 5,
      title: '赎回和退出（如需要）',
      description: `
**方式 1：官网标准赎回**（7-14 天）
1. Ether.fi App → Unstake
2. 输入要赎回的 eETH 数量
3. 提交赎回请求（Gas 约 $5-15）
4. 等待 7-14 天解锁期
5. Claim ETH（Gas 约 $3-10）
- 优点：无滑点
- 缺点：需要等待

**方式 2：DEX 快速卖出**（即时）
1. 在 Curve eETH/ETH 池卖出
2. 滑点通常 <0.5%（10 eETH 以内）
3. 即时到账
- 优点：快速
- 缺点：可能有小幅滑点

**方式 3：使用聚合器**（即时）
1. 访问 1inch 或 CoW Swap
2. eETH → ETH
3. 自动找到最优价格
- 优点：最优价格
- 缺点：Gas 费略高

**方式 4：T-NFT 出售**（仅 Solo Staking 用户）
1. 在 OpenSea 出售你的 T-NFT
2. 买家支付 ETH 购买
3. <1 小时完成
- 优点：极速退出
- 缺点：可能需要 5-10% 折价

**建议**：
- 不着急：使用官网赎回
- 需要快速退出：Curve 或 CoW Swap
- 极度紧急：T-NFT 出售（如果有）
      `
    }
  ],
  status: 'published'
};

// Strategy 9.6: Swell swETH Strategy  
const STRATEGY_9_6 = {
  title: 'Swell swETH 策略 - 创新的流动性质押 + 再质押 + Voyage 积分三重奖励',
  slug: 'swell-sweth-strategy',
  summary: '通过 Swell 进行以太坊流动性质押并参与 EigenLayer 再质押，获得 swETH 流动性代币，参与 Voyage 积分活动赚取额外奖励，享受 ETH 质押、EigenLayer AVS 和 Swell 生态的三重收益。',
  category: 'restaking',
  category_l1: 'yield',
  category_l2: '再质押/LRT',
  difficulty_level: 1,
  risk_level: 2,
  apy_min: 8,
  apy_max: 25,
  threshold_capital: '0.01 ETH 起',
  threshold_capital_min: 30,
  time_commitment: '初次设置 20 分钟，每周维护 10 分钟',
  time_commitment_minutes: 20,
  threshold_tech_level: 'beginner',
  content: `
## 什么是 Swell 和 swETH

Swell 是一个创新的流动性质押和再质押协议，以其独特的 Voyage 积分激励体系闻名。它提供 swETH（流动性质押代币）和 rswETH（再质押代币），让用户可以灵活选择参与程度。

### 核心特点

**1. 双代币系统**

Swell 提供两种代币选择：

**swETH（Swell ETH）**
- 标准的流动性质押代币
- 仅包含 ETH 质押收益
- 不参与 EigenLayer（如果你不想要再质押风险）
- 流动性最好

**rswETH（Restaked swETH）**
- 流动性再质押代币
- 包含 ETH 质押 + EigenLayer 收益
- 获得更多 Voyage 积分
- 收益更高，但风险略高

用户可以随时在 swETH 和 rswETH 之间切换。

**2. Voyage 积分系统**

Swell 的核心创新，游戏化的积分激励：

- **Pearls（珍珠）**：基础积分，持有 swETH/rswETH 自动累积
- **Bonus Pearls**：通过完成任务获得额外积分
- **Multipliers（倍数加成）**：通过参与 DeFi 获得积分倍数（最高 3x）
- **Voyage Seasons**：季度性活动，每季结束发放奖励

Pearls 可以兑换：
- SWELL 代币空投（未来）
- 协议治理权
- 专属 NFT 和福利

**3. 支持多种 LST**

与 Kelp DAO 类似，Swell 支持存入多种 LST：
- stETH（Lido）
- rETH（Rocket Pool）
- wstETH
- 原生 ETH

优势：
- 用户可以使用已有的 LST
- 避免额外的兑换成本

**4. 与主流 DeFi 深度整合**

Swell 在多个 DeFi 协议中有深度整合和激励：
- **Curve**：swETH/ETH 池有额外 Pearl 奖励
- **Pendle**：PT/YT-swETH 市场活跃
- **Balancer**：swETH 稳定池
- **Aave**：swETH 作为抵押品（计划中）

**5. 跨链部署**

Swell 在多条链上部署：
- Ethereum（主网）
- Arbitrum
- Optimism（计划中）
- Base（计划中）

### 与其他 LRT 对比

| 指标 | Swell | Ether.fi | Renzo | Kelp DAO |
|-----|-------|----------|-------|----------|
| 代币 | swETH/rswETH | eETH | ezETH | rsETH |
| **积分系统** | Voyage Pearls（最创新） | Loyalty Points | 积分 | Kelp Miles |
| **双代币** | ✅（swETH、rswETH） | ❌ | ❌ | ❌ |
| **协议费用** | 5-8%（浮动） | 5% | 10% | 0%（暂时） |
| **TVL** | $600M | $800M | $1.2B | $200M |
| **DeFi 整合** | 高 | 高 | 最高 | 中 |
| **用户体验** | 最友好（游戏化） | 中等 | 简单 | 中等 |
| **推荐度** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

Swell 的独特优势：
- ✅ 最创新的积分系统（游戏化、多样化）
- ✅ 双代币选择（swETH、rswETH）
- ✅ 用户体验最好（界面友好、教程详细）
- ✅ DeFi 整合激励多（Curve、Pendle 额外 Pearls）
- ✅ 社区氛围活跃（Discord、Twitter 互动多）
- ❌ TVL 中等（流动性不如 Renzo、Ether.fi）
- ❌ 协议费用略高（5-8% 浮动）

### 收益来源

**1. ETH 质押收益（3.5-4.5% APR）**
- 来自以太坊信标链的验证奖励
- 区块提案奖励
- MEV 收益

**2. EigenLayer 再质押奖励（仅 rswETH，4-12% APR）**
- Swell 参与的 AVS：EigenDA、Omni、Lagrange 等
- 如果持有 swETH，无此收益
- 如果持有 rswETH，自动获得

**3. Voyage Pearls（Swell 积分）**
- 基础 Pearls：每持有 1 swETH/rswETH 每天累积
- Bonus Pearls：完成任务（社交、DeFi 等）
- Multipliers：在 Curve、Pendle 等使用 swETH 获得 2-3x 倍数
- 未来可能兑换为 SWELL 代币

**4. EigenLayer Points（仅 rswETH）**
- 持有 rswETH 累积 EigenLayer Points
- 积分权重：1.0x
- 未来可能兑换为 $EIGEN 代币

**5. DeFi 额外收益（5-20% APR）**
- Curve swETH/ETH LP：5-15% APR + 2x Pearls
- Pendle PT-swETH：8-12% 固定 APY
- Balancer swETH 池：6-14% APR

**总收益潜力**
- 仅持有 swETH：3.5-5% APR（保守，无再质押风险）
- 仅持有 rswETH：7-16% APR（中等）
- rswETH + DeFi 策略：12-25% APR（激进）
- 所有方式都累积 Pearls（潜在空投价值）

## 实操步骤

### Step 1: 准备钱包和资产

**需要准备**
- MetaMask 或其他 Web3 钱包
- 至少 0.1 ETH（建议首次 0.5-1 ETH 测试）
- 或已有 LST（stETH、rETH、wstETH）
- 额外 0.02 ETH 用于 Gas 费用

**支持的存款资产**
- ETH（原生以太坊）
- stETH（Lido）
- rETH（Rocket Pool）
- wstETH（Wrapped stETH）

### Step 2: 在 Swell 存入资产并选择代币

**访问 Swell App**

1. 打开 https://app.swellnetwork.io
2. 连接钱包
3. 确认网络为 Ethereum Mainnet

**选择存款方式**

**方式 A：获得 swETH（仅质押，无再质押）**

适合：
- 保守型投资者
- 不想承担 EigenLayer 风险
- 追求最高流动性

步骤：
1. 点击 "Stake" 标签
2. 选择 "swETH"
3. 选择存款资产（ETH 或 LST）
4. 输入金额（如 1 ETH）
5. 查看将收到的 swETH 数量（通常 1:0.98-1.00）
6. 查看预期 APR：
   - ETH Staking：3.8%
   - Protocol Fee：-0.3%
   - Net APR：3.5%
7. 点击 "Stake"
8. 如果存入 LST，先授权，然后确认交易
9. 等待确认（30-90 秒）
10. swETH 出现在钱包中

**方式 B：获得 rswETH（质押 + 再质押）**

适合：
- 追求更高收益
- 愿意承担 EigenLayer 风险
- 想要最大化 Pearls 累积

步骤：
1. 先按照方式 A 获得 swETH
2. 点击 "Restake" 标签
3. 输入要转换为 rswETH 的 swETH 数量
4. 查看预期 APR：
   - ETH Staking：3.8%
   - EigenLayer：8.5%
   - Protocol Fee：-0.8%
   - Net APR：11.5%
5. 点击 "Restake"
6. 授权并确认交易
7. rswETH 出现在钱包中

**方式 C：直接存入 ETH 获得 rswETH（一步到位）**

步骤：
1. 点击 "Stake & Restake"
2. 选择存款资产（ETH 或 LST）
3. 输入金额
4. 自动获得 rswETH（跳过中间的 swETH 步骤）
5. 确认交易

**swETH vs rswETH 对比**

| 特性 | swETH | rswETH |
|-----|-------|--------|
| **收益** | 3.5-5% APR | 7-16% APR |
| **风险** | 低（只有 ETH 质押风险） | 中（ETH 质押 + EigenLayer 风险） |
| **流动性** | 最好 | 好 |
| **Pearls 倍数** | 1.0x | 1.5x |
| **EigenLayer Points** | ❌ 无 | ✅ 有 |
| **适合人群** | 保守型 | 平衡型/激进型 |

建议：
- 风险厌恶：100% swETH
- 平衡配置：50% swETH + 50% rswETH
- 追求高收益：100% rswETH

**确认成功**

1. 在钱包中查看代币余额
   - swETH 合约：0xf951E335afb289353dc249e82926178EaC7DEd78
   - rswETH 合约：0xFAe103DC9cf190eD75350761e95403b7b8aFa6c0
   - 如未显示，手动添加代币

2. 访问 Swell Dashboard（https://app.swellnetwork.io/voyage）
   - 查看 swETH/rswETH 余额
   - 查看累积的 Pearls
   - 查看 Voyage 排名

### Step 3: 参与 Voyage 积分活动

**Voyage 是什么**

Swell 的季度性积分激励活动：
- 每 3 个月为一个 Season
- 通过持有代币、完成任务、参与 DeFi 赚取 Pearls
- 每个 Season 结束时，根据 Pearls 排名发放奖励

**如何最大化 Pearls**

**1. 基础 Pearls（持有即可）**

自动累积规则：
- 持有 1 swETH：每天 10 Pearls（基础）
- 持有 1 rswETH：每天 15 Pearls（1.5x 加成）

**2. Bonus Pearls（完成任务）**

常见任务：
- **社交任务**：
  - 关注 Swell Twitter：+100 Pearls
  - 转发指定推文：+50 Pearls
  - 加入 Discord：+100 Pearls
  - 邀请好友：每人 +200 Pearls

- **DeFi 任务**：
  - 在 Curve 提供 swETH/ETH LP：+500 Pearls（一次性）
  - 在 Pendle 购买 PT-swETH：+300 Pearls
  - 在 Balancer 提供流动性：+400 Pearls

- **教育任务**：
  - 完成 Swell Academy 课程：+150 Pearls
  - 参加 AMA/社区活动：+200 Pearls

**3. Multipliers（倍数加成）**

在特定 DeFi 协议中使用 swETH/rswETH，获得倍数加成：

| DeFi 协议 | Multiplier | 条件 |
|----------|------------|------|
| Curve LP | 2x | 提供 swETH/ETH 流动性 |
| Pendle PT | 1.5x | 持有 PT-swETH |
| Pendle LP | 2.5x | 提供 Pendle LP |
| Balancer | 2x | 提供 swETH 流动性 |
| Aave（未来） | 1.3x | 存入 swETH 作为抵押品 |

计算示例：
- 持有 10 rswETH：每天 150 Pearls（基础）
- 其中 5 rswETH 在 Curve LP：5 × 15 × 2 = 150 Pearls（2x）
- 总计：75（未使用部分）+ 150（Curve 部分）= 225 Pearls/天
- 相比纯持有（150 Pearls/天）增加 50%

**4. 早期参与加成**

Swell 通常给早期用户额外加成：
- Voyage Season 1 参与者：永久 1.2x 加成
- 前 1000 名用户：额外 10,000 Pearls
- 推荐奖励：每邀请一人，你和被邀请人都得 1.1x 加成

**Pearls 最大化策略**

假设你有 10 ETH 投入：

**保守策略**（最小化风险）：
- 10 ETH → 10 swETH
- 全部放在 Curve swETH/ETH LP（2x 倍数）
- 每天 Pearls：10 × 10 × 2 = 200 Pearls

**平衡策略**：
- 10 ETH → 10 rswETH
- 5 rswETH 在 Curve LP（2x）
- 3 rswETH 在 Pendle PT（1.5x）
- 2 rswETH 纯持有（1x）
- 每天 Pearls：(5 × 15 × 2) + (3 × 15 × 1.5) + (2 × 15 × 1) = 150 + 67.5 + 30 = 247.5 Pearls

**激进策略**（最大化 Pearls）：
- 10 ETH → 10 rswETH
- 全部在 Pendle LP（2.5x，最高倍数）
- 每天 Pearls：10 × 15 × 2.5 = 375 Pearls
- 风险：Pendle LP 有无常损失

**完成所有任务**：
- 一次性 Bonus Pearls：约 2,000-3,000 Pearls
- 相当于持有 10 rswETH 约 20 天的累积

### Step 4: 监控收益和 Pearls

**Swell Voyage Dashboard**

访问 https://app.swellnetwork.io/voyage，查看：

**1. 我的资产**
- swETH Balance：你的 swETH 持仓
- rswETH Balance：你的 rswETH 持仓
- Total Value：总价值（ETH 和 USD）

**2. Pearls 追踪**
- Total Pearls：累积的总 Pearls
- Pearls Breakdown：来源拆解
  - Base Pearls（持有）
  - Bonus Pearls（任务）
  - Multiplier Pearls（DeFi 加成）
- Daily Pearls Rate：每日累积速度
- Voyage Rank：你在所有用户中的排名

**3. Current Multipliers**
- 显示你当前的所有倍数加成
- 例如：
  - Curve LP: 2.0x (5.5 rswETH)
  - Pendle PT: 1.5x (2.3 rswETH)
  - Base: 1.0x (2.2 rswETH)

**4. Voyage Season 信息**
- Current Season：当前是第几季
- Season Progress：进度（如 45 days / 90 days）
- Season Rewards：本季奖励池（如 500,000 SWELL 代币）
- Top 100 Leaderboard：排行榜前 100 名

**每周监控清单**
- [ ] swETH/rswETH 价值正常增长
- [ ] Pearls 每天正常累积（检查 Daily Rate）
- [ ] Multipliers 是否正常应用
- [ ] 检查新的 Voyage 任务（每周可能有新任务）
- [ ] 查看 Swell 官方公告（Twitter、Discord）

**每月监控清单**
- [ ] 计算实际 APR 并与预期对比
- [ ] 评估 Pearls 排名（是否有机会进入 Top 100）
- [ ] 查看 DeFi 中的 swETH 机会（新的倍数加成）
- [ ] 考虑是否调整策略（增加投入、切换 DeFi 协议）
- [ ] 查看 Voyage Season 进度和奖励预估

### Step 5: 使用 swETH/rswETH 在 DeFi 中获取额外收益

**策略 1：Curve 流动性挖矿（最受欢迎）**

**Curve swETH/ETH 池**

- TVL：约 $50M
- APR 组成：
  - 交易手续费：0.5-2%
  - CRV 奖励：2-6%
  - Swell 激励：4-10%（额外 Pearls）
  - Pearls 倍数：2x
  - 总计：6.5-18% APR + 2x Pearls

操作：
1. 准备 50% swETH（或 rswETH）+ 50% ETH
2. 访问 Curve，搜索 "swETH"
3. 添加流动性
4. 质押 LP 代币（Curve 或 Convex）
5. 在 Swell Dashboard 确认 2x Multiplier 已应用

优势：
- 获得最高的 Pearls 倍数（2x）
- 流动性好，无常损失小
- Swell 官方推荐和激励

**策略 2：Pendle 收益交易**

**Pendle swETH 市场**

- 市场规模：约 $20M
- 到期日：滚动 3-6 个月

**玩法 A：购买 PT-swETH 锁定固定收益**

- 固定 APY：8-12%
- Pearls 倍数：1.5x
- 适合保守型

步骤：
1. 访问 https://app.pendle.finance
2. 搜索 "swETH"
3. 选择到期日
4. 购买 PT-swETH
5. 持有到期或在二级市场交易

**玩法 B：提供 Pendle LP**

- APR：15-30%（高波动）
- Pearls 倍数：2.5x（最高！）
- 适合激进型

步骤：
1. 在 Pendle 提供 swETH 流动性
2. 获得 LP 代币
3. 质押 LP 代币
4. 享受最高 Pearls 倍数（2.5x）

风险：
- 无常损失（IL）可能较大
- 需要理解 Pendle 机制

**策略 3：Balancer swETH 池**

- TVL：约 $15M
- APR：6-14%
- Pearls 倍数：2x

操作：
1. 访问 Balancer（https://app.balancer.fi）
2. 找到 swETH 池
3. 添加流动性（支持单边）
4. 质押 LP 代币

优势：
- 支持单边流动性（只需 swETH，不需要 ETH）
- 2x Pearls 倍数
- Gas 费较低

**策略 4：跨链到 Arbitrum**

Swell 在 Arbitrum 上也有部署：

优势：
- Gas 费极低（<$1）
- Arbitrum 上的 DeFi 更便宜
- 可能有额外的 ARB 激励

操作：
1. 将 swETH 桥接到 Arbitrum（使用官方桥）
2. 在 Arbitrum 上的 Curve、Balancer 提供流动性
3. Gas 成本降低 95%

### Step 6: Claim 奖励和赎回（如需要）

**Claim Swell 奖励**

Swell 的奖励分为两类：

**1. DeFi 协议奖励**（每周/每月 Claim）
- Curve：CRV 奖励
- Pendle：PENDLE 奖励
- Balancer：BAL 奖励

操作：
- 访问各个协议的 Claim 页面
- 点击 "Claim Rewards"
- 确认交易

**2. Voyage Season 奖励**（每季度结束后）
- Season 结束时，Swell 会分配 SWELL 代币（或其他奖励）
- 根据你的 Pearls 排名和总量
- Top 100：额外奖励
- 所有参与者：基础空投

**赎回 swETH/rswETH**

**方式 1：官网赎回（无滑点，需等待）**

步骤：
1. 访问 Swell App，点击 "Unstake"
2. 选择要赎回的代币（swETH 或 rswETH）
3. 输入数量
4. 提交赎回请求（Gas 约 $5-15）
5. 等待解锁期：
   - swETH：7 天
   - rswETH：7-14 天（因为包含 EigenLayer）
6. Claim ETH

**方式 2：DEX 卖出（即时）**

主要交易对：
- **Curve swETH/ETH**（流动性最好）
  - 滑点（<10 swETH）：0.1-0.5%
- **Uniswap V3 swETH/ETH**
  - 滑点略高：0.3-1%

操作：
1. 选择 Curve
2. From: swETH/rswETH，To: ETH
3. 确认交易
4. 即时到账

**方式 3：使用聚合器**

- 1inch、CoW Swap 等
- 自动找到最优价格

**退出对比**

假设要卖出 10 swETH（价值 10.2 ETH）：

| 方式 | 收到 ETH | 时间 | Gas | 总成本 |
|-----|---------|------|-----|--------|
| 官网赎回 | 10.20 | 7 天 | $15 | $15 (0.15%) |
| Curve | 10.15 | 即时 | $20 | $65 (0.64%) |
| 1inch | 10.17 | 即时 | $25 | $55 (0.54%) |

## 收益计算实例

### 案例 1：保守策略（10 swETH）

**初始投入**
- 10 ETH → 10 swETH
- 策略：纯持有，不参与 DeFi

**年化收益**

1. **ETH 质押收益**
   - APR：3.5%
   - 年收益：10 × 3.5% = 0.35 ETH（$1,050）

2. **Pearls 累积**
   - 每天：10 × 10 = 100 Pearls
   - 年累积：36,500 Pearls
   - 假设未来 1 Pearl = $0.30（SWELL 代币）：$10,950

**总收益**
- 确定收益：$1,050（3.5% APR）
- 潜在空投：$10,950（36.5%）
- **总计：$12,000（40%）**

**成本**
- Gas：$20
- 净收益：$11,980（39.9%）

### 案例 2：平衡策略（10 rswETH + Curve LP）

**初始投入**
- 10 ETH → 10 rswETH
- 策略：5 rswETH 持有，5 rswETH 在 Curve LP

**年化收益**

1. **持有部分（5 rswETH）**
   - ETH 质押：5 × 3.5% = 0.175 ETH
   - EigenLayer：5 × 8% = 0.4 ETH
   - 小计：0.575 ETH（$1,725）

2. **Curve LP 部分（5 rswETH + 5 ETH）**
   - rswETH 基础收益：5 × 11.5% = 0.575 ETH
   - Curve LP 收益：10 × 10% = 1.0 ETH
   - 小计：1.575 ETH（$4,725）

3. **总收益**
   - 0.575 + 1.575 = 2.15 ETH（$6,450）
   - **APR：21.5%**

4. **Pearls 累积**
   - 持有部分：5 × 15 × 1 = 75 Pearls/天
   - Curve LP：5 × 15 × 2 = 150 Pearls/天
   - 总计：225 Pearls/天 = 82,125 Pearls/年
   - 假设 1 Pearl = $0.30：$24,637

**总收益**
- 确定收益：$6,450（21.5% APR）
- 潜在空投：$24,637（82%）
- **总计：$31,087（103.6%）**

**成本**
- Gas（多次操作）：$100
- 净收益：$30,987（103.3%）

### 案例 3：激进策略（10 rswETH + Pendle LP）

**初始投入**
- 10 ETH → 10 rswETH
- 策略：全部在 Pendle LP（2.5x Pearls）

**年化收益**

1. **rswETH 基础收益**
   - 11.5% APR = 1.15 ETH（$3,450）

2. **Pendle LP 收益**
   - 20% APR（高波动）= 2.0 ETH（$6,000）

3. **总收益**
   - 1.15 + 2.0 = 3.15 ETH（$9,450）
   - **APR：31.5%**

4. **Pearls 累积（2.5x 倍数）**
   - 10 × 15 × 2.5 = 375 Pearls/天
   - 年累积：136,875 Pearls
   - 假设 1 Pearl = $0.30：$41,062

**总收益**
- 确定收益：$9,450（31.5% APR）
- 潜在空投：$41,062（137%）
- **总计：$50,512（168.4%）**

**风险调整**
- 无常损失（假设）：-0.5 ETH（-$1,500）
- 净收益：$49,012（163.4%）

**成本**
- Gas：$150
- 最终净收益：$48,862（162.9%）

## 风险管理

### Swell 特有风险

**1. Pearls 价值不确定性（严重性：中）**

风险描述：
- Pearls 的未来价值完全取决于 SWELL 代币价格
- SWELL 代币尚未发行，价格未知
- 可能低于预期（如 1 Pearl = $0.05 而非 $0.30）

缓解措施：
- ✅ 不要只为了 Pearls 而参与（基础收益也要可观）
- ✅ 分散到多个 LRT 协议
- ✅ 设定合理预期（Pearls 是额外奖励，不是主要收益）

**2. swETH/rswETH 脱锚风险（严重性：低）**

风险描述：
- swETH 或 rswETH 在 DEX 上的价格可能低于内在价值
- 特别是 rswETH（包含 EigenLayer 风险）

历史：
- swETH 锚定良好（通常折价 <0.5%）
- rswETH 折价可能略高（0.5-2%）

缓解措施：
- ✅ 监控价格，设置警报
- ✅ 不要在折价时恐慌性卖出
- ✅ 使用官网赎回（无折价，但需等待）

**3. DeFi 策略风险（严重性：中）**

如果使用 swETH/rswETH 在 DeFi：
- Curve LP：无常损失（通常 <2%）
- Pendle LP：无常损失可能更大（5-10%）
- 智能合约风险

缓解措施：
- ✅ 只用 30-50% 参与高风险 DeFi
- ✅ 选择经过审计的协议
- ✅ 监控无常损失

**4. 协议费用调整风险（严重性：低）**

风险描述：
- Swell 的协议费用是浮动的（5-8%）
- 未来可能上调

缓解措施：
- ✅ 关注 Swell 治理提案
- ✅ 如果费用上涨显著，考虑退出

### 监控清单

**每日**（3 分钟）
- [ ] swETH/rswETH 价值正常增长
- [ ] Pearls 每天正常累积
- [ ] 价格锚定正常（折价 <1%）

**每周**（10 分钟）
- [ ] 计算实际 APR
- [ ] 查看新的 Voyage 任务
- [ ] 检查 Multipliers 是否正常
- [ ] 查看 Swell 公告

**每月**（30 分钟）
- [ ] 全面收益评估
- [ ] 查看 Voyage Leaderboard 排名
- [ ] 考虑策略调整
- [ ] 更新风险评估

## 常见问题

**Q1：swETH 和 rswETH 有什么区别？**
A：
- **swETH**：只有 ETH 质押收益（3.5-5% APR），风险低，流动性最好
- **rswETH**：ETH 质押 + EigenLayer（7-16% APR），风险中等，Pearls 倍数更高（1.5x）
- 可以随时在两者之间切换

**Q2：Pearls 什么时候能兑换成代币？**
A：Swell 官方尚未公布 SWELL 代币的发行时间。根据社区推测，可能在 2024 Q3-Q4。

**Q3：如何最大化 Pearls？**
A：
1. 持有 rswETH（1.5x 基础倍数）
2. 在 Pendle LP 使用 rswETH（2.5x 倍数，最高）
3. 完成所有 Voyage 任务（一次性 2000-3000 Pearls）
4. 邀请好友（每人 +200 Pearls）

**Q4：Swell 和 Renzo 哪个更好？**
A：
- **Renzo（ezETH）**：TVL 更大（$1.2B），流动性最好，DeFi 整合最广
- **Swell（swETH/rswETH）**：积分系统更创新，用户体验更好，双代币选择
- 建议：两者都配置，各 40-50%

**Q5：rswETH 的 EigenLayer 风险大吗？**
A：中等。Swell 参与的 AVS 都经过审计，且 Swell 团队专业管理。历史上无 Slashing 事件。

**Q6：我应该参与 Pendle LP 吗（2.5x Pearls）？**
A：
- 如果追求最高 Pearls：参与（但注意无常损失）
- 如果追求稳定收益：选择 Curve LP（2x，更安全）
- 建议：分散（50% Curve + 50% Pendle）

**Q7：Voyage Season 结束后，Pearls 会清零吗？**
A：不会。Pearls 会累积到下一个 Season，并且有持续价值（未来兑换 SWELL 代币）。

**Q8：我可以在 Arbitrum 上使用 Swell 吗？**
A：可以！Swell 在 Arbitrum 上也有部署，Gas 费用更低（<$1）。可以桥接 swETH 到 Arbitrum 使用。

**Q9：如果我只想要 ETH 质押收益，不想要 EigenLayer 风险，应该选什么？**
A：选择 swETH（不是 rswETH）。swETH 只有 ETH 质押收益，无 EigenLayer 风险。

**Q10：Swell 的协议费用是多少？**
A：浮动费用，5-8%（取决于市场和协议收入）。当前约 5%。相比 Lido 的 10%、Renzo 的 10%，Swell 更低。

## 总结

**Swell 的核心优势**
- ✅ 最创新的积分系统（Voyage Pearls）
- ✅ 双代币选择（swETH、rswETH）
- ✅ 用户体验最好（游戏化、友好界面）
- ✅ DeFi 整合深度（Curve、Pendle 额外激励）
- ✅ 多重倍数加成（最高 2.5x）
- ✅ 社区活跃度高

**适合人群**
- 喜欢游戏化体验
- 追求多重收益（ETH 质押 + EigenLayer + Pearls）
- 愿意参与 DeFi（Curve、Pendle）
- 早期参与者（Voyage Season 积分）
- 看好 Swell 生态长期发展

**推荐策略**
1. **保守型**：持有 swETH（3.5-5% APR + Pearls）
2. **平衡型**：rswETH + Curve LP（12-18% APR + 2x Pearls）
3. **激进型**：rswETH + Pendle LP（15-25% APR + 2.5x Pearls）

**最后建议**
- 从小额开始（0.5-1 ETH）
- 完成所有 Voyage 任务（额外 2000-3000 Pearls）
- 定期检查 Pearls 排名和倍数
- 关注 Swell 社区（Discord、Twitter）
- 长期持有，享受 Pearls 累积和未来空投
- 分散到多个 DeFi 协议，平衡风险和收益
  `,
  steps: [
    {
      order_index: 1,
      title: '准备钱包和资产（15 分钟）',
      description: `
1. 准备支持以太坊的钱包（MetaMask 推荐）
2. 确保有至少 0.1 ETH（建议首次 0.5-1 ETH 测试）
3. 或准备 LST（stETH、rETH、wstETH）
4. 准备额外 0.02 ETH 用于 Gas 费用
5. 访问 Swell 官网（https://www.swellnetwork.io）了解基本信息

**决策点**：
- [ ] 我要选择 swETH（保守，无再质押）还是 rswETH（高收益，有再质押）？
- [ ] 我了解 Voyage Pearls 的作用和价值吗？
- [ ] 我准备参与哪些 DeFi 协议（Curve、Pendle、Balancer）？
      `
    },
    {
      order_index: 2,
      title: '质押并选择代币（20 分钟）',
      description: `
1. 访问 https://app.swellnetwork.io
2. 连接钱包，确认网络为 Ethereum Mainnet

**方式 A：获得 swETH（保守）**
- 点击 "Stake" → "swETH"
- 输入金额，确认交易
- APR：约 3.5-5%
- Pearls 倍数：1.0x

**方式 B：获得 rswETH（激进）**
- 点击 "Stake & Restake"
- 输入金额，一步到位获得 rswETH
- APR：约 7-16%
- Pearls 倍数：1.5x

**或者分批配置**：
- 50% 存入获得 swETH
- 50% 存入获得 rswETH
- 平衡风险和收益

**确认成功**：
- [ ] 钱包中有 swETH/rswETH 余额
- [ ] Swell Dashboard 显示正确金额
- [ ] 开始累积 Pearls
      `
    },
    {
      order_index: 3,
      title: '参与 Voyage 积分活动（30 分钟）',
      description: `
1. 访问 https://app.swellnetwork.io/voyage
2. 查看当前 Voyage Season 和你的 Pearls

**完成基础任务**（一次性）：
- [ ] 关注 Swell Twitter（+100 Pearls）
- [ ] 加入 Discord（+100 Pearls）
- [ ] 转发指定推文（+50 Pearls）
- [ ] 完成 Swell Academy 课程（+150 Pearls）

**DeFi 任务**（可选，获得倍数）：
- [ ] 在 Curve 提供 swETH/ETH LP（+500 Pearls + 2x 倍数）
- [ ] 在 Pendle 购买 PT-swETH（+300 Pearls + 1.5x 倍数）
- [ ] 在 Balancer 提供流动性（+400 Pearls + 2x 倍数）

**邀请好友**：
- 每邀请一人：你和被邀请人都得 +200 Pearls
- 两人都获得 1.1x 永久加成

**查看倍数加成**：
- 在 Dashboard 查看 "Current Multipliers"
- 确认 DeFi 活动已被识别并应用倍数
      `
    },
    {
      order_index: 4,
      title: 'DeFi 策略优化（可选）',
      description: `
**策略 1：Curve LP（推荐，2x Pearls）**
1. 准备 50% swETH/rswETH + 50% ETH
2. 访问 Curve，搜索 "swETH"
3. 添加流动性
4. 质押 LP 代币
5. 额外收益：6-18% APR + 2x Pearls

**策略 2：Pendle PT（稳健，1.5x Pearls）**
1. 访问 Pendle，搜索 "swETH"
2. 购买 PT-swETH 锁定固定收益
3. 固定 APY：8-12%
4. Pearls 倍数：1.5x

**策略 3：Pendle LP（激进，2.5x Pearls）**
1. 在 Pendle 提供 swETH 流动性
2. 质押 LP 代币
3. 额外收益：15-30% APR（高波动）
4. Pearls 倍数：2.5x（最高！）
5. 风险：无常损失

**策略 4：Balancer（平衡，2x Pearls）**
1. 访问 Balancer
2. 单边添加 swETH 流动性
3. 额外收益：6-14% APR
4. Pearls 倍数：2x

**跨链到 Arbitrum**（低 Gas）：
- 桥接 swETH 到 Arbitrum
- Gas 费降低 95%
- 在 Arbitrum 上的 Curve、Balancer 操作
      `
    },
    {
      order_index: 5,
      title: '监控和优化（持续）',
      description: `
**每日检查（3 分钟）**：
1. 访问 Swell Voyage Dashboard
2. 查看：
   - Pearls 每日累积速度
   - swETH/rswETH 价值变化
   - Multipliers 是否正常

**每周检查（10 分钟）**：
1. 计算实际 APR 并对比预期
2. 查看新的 Voyage 任务
3. 检查 Voyage Leaderboard 排名
4. 查看 Swell 官方公告（Twitter、Discord）

**每月检查（30 分钟）**：
1. 全面收益评估（ETH 收益 + Pearls）
2. 查看 DeFi 策略表现
3. 评估是否调整策略：
   - 增加投入？
   - 切换 DeFi 协议？
   - 改变 swETH/rswETH 比例？
4. 准备 Voyage Season 结束（Claim 奖励）

**赎回流程**（如需退出）：
1. **官网赎回**（7-14 天）：
   - Swell App → Unstake
   - 提交赎回请求
   - 等待解锁期
   - Claim ETH

2. **DEX 卖出**（即时）：
   - Curve swETH/ETH 池
   - 滑点 <0.5%（小额）
   - 即时到账

**Voyage Season 结束**：
- 每季度结束时，查看奖励分配
- Claim SWELL 代币（或其他奖励）
- Pearls 会累积到下一个 Season
      `
    }
  ],
  status: 'published'
};

async function uploadStrategies() {
  try {
    console.log('开始上传策略到 Directus...\n');

    // Step 1: Login
    console.log('Step 1: 登录 Directus...');
    const loginResponse = await axios.post(`${DIRECTUS_URL}/auth/login`, {
      email: 'the_uk1@outlook.com',
      password: 'Mygcdjmyxzg2026!'
    });

    const token = loginResponse.data.data.access_token;
    console.log('✓ 登录成功\n');

    // Step 2: Upload strategies
    const strategies = [STRATEGY_9_5, STRATEGY_9_6];
    
    for (let i = 0; i < strategies.length; i++) {
      const strategy = strategies[i];
      console.log(`Step ${i + 2}: 上传策略 "${strategy.title}"...`);
      
      const response = await axios.post(
        `${DIRECTUS_URL}/items/strategies`,
        strategy,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log(`✓ 策略 "${strategy.title}" 上传成功`);
      console.log(`  - ID: ${response.data.data.id}`);
      console.log(`  - Slug: ${response.data.data.slug}\n`);
    }

    console.log('========================================');
    console.log('✓ 所有策略上传完成！');
    console.log('========================================');

  } catch (error) {
    console.error('❌ 错误:', error.response?.data || error.message);
    process.exit(1);
  }
}

uploadStrategies();
