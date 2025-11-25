const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

// ===== 13.3 Convex Finance CRV 托管 =====
const STRATEGY_13_3 = {
  title: 'Convex Finance CRV 托管 - Curve 收益增强器',
  slug: 'vault-13-3-convex-finance-crv-boost',
  summary: '将 Curve LP Token 存入 Convex Finance，自动质押 CRV 奖励并获得额外 CVX 代币，相比直接在 Curve 挖矿收益提升 15-30%，无需锁仓 veCRV。',

  category: 'vault',
  category_l1: 'yield',
  category_l2: '聚合器/金库',

  difficulty_level: 2,
  risk_level: 3,

  apy_min: 8,
  apy_max: 35,
  threshold_capital: '500 美元起',
  threshold_capital_min: 500,
  time_commitment: '初始设置 20 分钟，每月查看',
  time_commitment_minutes: 20,
  threshold_tech_level: 'intermediate',

  content: `> **适合人群**: 已在 Curve 挖矿的用户，希望提升收益但不想锁仓 veCRV 的投资者
> **阅读时间**: 约 15 分钟
> **关键词**: Convex Finance / Curve 增强 / CRV Boost / CVX 奖励 / 无需锁仓

---

## 🎯 什么是 Convex Finance？一个真实的痛点

### 小李的困境

**背景**：小李在 Curve 上提供流动性挖矿，每月赚 300 美元 CRV 奖励。

**他发现的问题**：
- Curve 官网说：**锁仓 veCRV 可以让收益翻倍**（Boost 提升到 2.5x）
- 但锁仓要求太苛刻：
  - 需要锁 4 年才能达到最大 Boost
  - 锁定期间 CRV 完全不能动
  - 小李只有 1000 美元本金，买不起足够的 CRV 锁仓
- 结果：**眼看着别人拿 2.5x 收益，自己只能拿 1x**

### Convex Finance 的解决方案

Convex 就是为了解决这个痛点而生：

**传统 Curve 挖矿**：
- 存 1000 美元 LP → 年化 10% CRV 奖励
- 要提升收益需要锁仓 CRV 4 年 → 大多数人做不到
- 最终收益：**100 美元/年**

**通过 Convex 挖矿**：
- 同样存 1000 美元 LP 到 Convex
- Convex 用它巨量的 veCRV 帮你 Boost
- 你的收益自动提升到 2.5x：**250 美元/年**
- 额外奖励：还获得 CVX 代币（价值约 50 美元）
- 最终收益：**300 美元/年**（提升 200%！）

**核心逻辑**：
- Convex 锁了**几十亿美元的 veCRV**（全网最多）
- 它把这些 Boost 能力**免费分享给所有用户**
- 作为回报，用户把 CRV 奖励给 Convex（Convex 会给你 CVX 作为补偿）

**简单说**：Convex = **Curve 挖矿的"会员增强版"**，帮普通人也能享受巨鲸才有的 Boost 权益。

---

## 📊 为什么选择 Convex？数据说话

### 1. 收益对比：Convex vs 直接 Curve

以 **3CRV 池**（USDC/USDT/DAI）为例（2024 年数据）：

| 对比项 | 直接在 Curve | 通过 Convex | 收益提升 |
|--------|-------------|-------------|----------|
| 基础 CRV APR | 5% | 12.5%（2.5x Boost）| +150% |
| CVX 奖励 | 0% | 3% | +3% |
| 总 APY | 5% | 15.5% | **+210%** |
| 锁仓要求 | 需锁 4 年 veCRV | 无需锁仓 | ✅ 灵活 |
| Gas 费成本 | 每次复投 $15-30 | 自动复投免费 | ✅ 省钱 |

**关键优势**：
- ✅ **收益提升 2-3 倍**：普通人也能享受巨鲸 Boost
- ✅ **无需锁仓**：随时可以撤出，不影响流动性
- ✅ **双币奖励**：既拿 CRV 也拿 CVX
- ✅ **自动复投**：Gas 费由所有用户分摊

### 2. Convex 的市场地位

- **TVL**：30-50 亿美元（DeFi 前 10）
- **Curve 市场份额**：控制了 **50%+ 的 Curve LP**
- **veCRV 持有量**：全网第一，拥有最强 Boost 能力
- **成立时间**：2021 年，经历多轮市场考验

**安全性**：
- 多次安全审计（Certik、PeckShield）
- 2 年无重大安全事故
- 与 Curve 官方深度合作

---

## 📋 Convex Finance 使用指南（详细版）

### 第一步：理解基础概念（5 分钟）

在开始之前，先搞懂这几个关键词：

**Curve LP Token**：
- 你在 Curve 上提供流动性后，会得到一个凭证（比如 3CRV、steCRV）
- 这个凭证就是 LP Token，代表你在池子里的份额

**cvxCRV**：
- 当你把 CRV 存入 Convex，会得到 cvxCRV
- cvxCRV = "Convex 版本的 CRV"
- 可以 1:1 兑换回 CRV（单向，不可逆）

**CVX 代币**：
- Convex 平台的治理代币
- 质押 CVX 可以分享平台收入
- 持有 CVX 有投票权（决定 CRV 奖励分配）

### 第二步：准备工作（10 分钟）

**你需要准备**：

1. **钱包**：MetaMask（已安装并备份助记词）

2. **资金**：至少 500 美元等值的稳定币或 ETH
   - **新手推荐**：从稳定币池开始（3CRV 池）
   - **进阶玩家**：可选 ETH 相关池（steCRV、frxETH 等）

3. **Gas 费**：准备 50-100 美元的 ETH
   - 需要操作：Curve 存款 + Convex 存款（共 2 笔交易）
   - 建议在 **Gas 低峰时段操作**（周末、凌晨）

4. **学习成本**：花 10 分钟看这个流程，理解每一步在做什么

### 第三步：在 Curve 上提供流动性（如果还没有 LP Token）

**如果你已经有 Curve LP Token，跳过此步骤直接看第四步**

1. **访问 Curve 官网**：
   - 打开 https://curve.fi
   - 点击右上角 **Connect Wallet** 连接钱包

2. **选择合适的池子**：

   **新手推荐 - 3CRV 池**（最安全）：
   - 在首页找到 **3pool**（USDC/USDT/DAI）
   - 点击进入池子详情页
   - 优点：全是稳定币，无无常损失风险

   **进阶选择 - stETH 池**（收益更高）：
   - 搜索 **stETH**（ETH/stETH）
   - 适合长期看好 ETH 的用户
   - 缺点：有轻微无常损失风险

3. **存入流动性**：
   - 点击 **Deposit** 标签
   - 输入你想存入的金额（比如 1000 USDC）
   - **提示**：可以只存一种币，Curve 会自动平衡
   - 点击 **Deposit & stake in gauge**（勾选 stake 很重要！）
   - 确认交易，支付 Gas 费
   - 等待交易完成，你会获得 LP Token（比如 3CRV）

**检查是否成功**：
- 在 Curve 网站顶部点击 **Dashboard**
- 应该看到你的 LP 余额和正在赚取的 CRV 奖励

### 第四步：迁移到 Convex（核心步骤）

**现在我们要把 Curve LP Token 转移到 Convex，享受增强收益**

1. **访问 Convex 官网**：
   - 打开 https://www.convexfinance.com
   - 点击 **Connect** 连接钱包

2. **找到你的池子**：
   - 在首页的 **Curve LP Pools** 列表中
   - 搜索你的池子名称（比如 "3pool"）
   - 找到后点击 **Deposit**

3. **从 Curve 提取 LP Token**（重要！）：

   **如果你刚才在 Curve 勾选了 "stake in gauge"，需要先取回**：
   - 回到 Curve 网站
   - 进入你的池子详情页
   - 点击 **Withdraw & Claim** 标签
   - 但是**不要**点 "Withdraw"（那会完全退出）
   - 而是点击 **Claim** 旁边的 **Unstake**
   - 这会把 LP Token 从 Gauge 取回到你钱包
   - 确认交易

4. **在 Convex 存入 LP Token**：
   - 回到 Convex 网站的池子页面
   - 点击 **Deposit** 按钮
   - 输入你要存入的 LP Token 数量
   - **勾选**：☑️ **Stake on Convex**（一定要勾选！）
   - 点击 **Deposit**，确认交易
   - 等待交易完成

5. **验证是否成功**：
   - 在 Convex 首页点击 **Dashboard**
   - 应该看到：
     - 你的 LP Token 余额
     - 实时增长的 CRV 奖励
     - 实时增长的 CVX 奖励
   - 如果看到这些数据，恭喜你成功了！

### 第五步：领取奖励和复投（每月 1 次）

**Convex 的奖励系统**：
- **CRV 奖励**：每秒实时增长
- **CVX 奖励**：每秒实时增长
- **3CRV 手续费**：自动复投到你的 LP 中

**领取流程**：

1. **查看待领取奖励**：
   - 访问 Convex Dashboard
   - 看到 **Claimable Rewards** 部分

2. **两种领取方式**：

   **方式 A：一键领取所有池子**（推荐）：
   - 在 Dashboard 顶部点击 **Claim All**
   - 会一次性领取所有池子的 CRV + CVX
   - Gas 费较高（$20-40）

   **方式 B：单独领取某个池子**：
   - 进入具体池子页面
   - 点击 **Claim** 按钮
   - 只领取该池子的奖励
   - Gas 费较低（$10-20）

3. **奖励处理建议**：

   **CRV 怎么办**？
   - **选项 1（推荐）**：转换成 cvxCRV 并质押
     - 在 Convex 网站点击 **cvxCRV**
     - 将 CRV 转换成 cvxCRV（不可逆！）
     - 质押 cvxCRV，年化 8-12%
   - **选项 2**：直接卖掉换成稳定币
     - 去 Curve 或 Uniswap 卖出 CRV
     - 用收益买入更多 LP Token

   **CVX 怎么办**？
   - **选项 1（长期主义）**：质押 CVX
     - 在 Convex 点击 **Stake CVX**
     - 年化 5-10%，且获得投票权
   - **选项 2（短期套现）**：卖掉 CVX
     - 去 Curve CVX/ETH 池卖出
     - 补充本金继续投资

**多久操作一次**？
- **建议频率**：每月 1 次
- **原因**：Gas 费较高，太频繁不划算
- **自动化**：可以使用 Convex 的自动复投功能（高级用户）

---

## ⚠️ 风险提示和注意事项

### 主要风险

**1. 智能合约风险（中等）**
- Convex 依赖 Curve，如果 Curve 出问题会受影响
- 已运营 2 年，经历多轮审计，风险较低

**2. 无常损失风险（取决于池子）**
- **稳定币池**（3CRV）：几乎无无常损失 ✅
- **ETH 池**（stETH）：有轻微无常损失 ⚠️
- **混合池**：风险较高 ❌

**3. CRV/CVX 价格波动风险**
- 奖励是 CRV 和 CVX 代币
- 如果代币价格下跌，收益会缩水
- **建议**：定期领取并卖出，锁定利润

**4. Gas 费成本**
- 以太坊主网操作，Gas 费较高
- 小额资金可能不划算（建议 500 美元起）
- **省钱技巧**：在 Gas 低峰操作，批量领取

### 安全建议

1. **从小额开始**：第一次投 500-1000 美元体验流程
2. **选择稳定币池**：新手优先 3CRV，风险最低
3. **定期领取**：每月领取奖励，避免长期积累风险
4. **分散投资**：不要把所有钱放一个池子
5. **了解退出成本**：提前计算 Gas 费，确保能够随时退出

---

## 🎓 进阶玩法：最大化 Convex 收益

### 玩法 1：质押 cvxCRV 赚额外收益

**原理**：
- 把 CRV 转换成 cvxCRV（不可逆）
- 质押 cvxCRV，获得：
  - 8-12% 的 cvxCRV APY
  - 3CRV 手续费分成
  - CVX 奖励

**适合谁**：
- 长期看好 Curve 生态的用户
- 不需要短期卖出 CRV 的投资者

**操作步骤**：
1. 在 Convex 首页点击 **cvxCRV**
2. 输入要转换的 CRV 数量
3. 点击 **Convert & Stake**
4. 享受额外的质押收益

### 玩法 2：质押 CVX 获得投票权和分红

**原理**：
- 质押 CVX（锁定 16 周）
- 获得 vlCVX（vote-locked CVX）
- 权益：
  - 5-10% 的 CVX 质押收益
  - cvxCRV 空投分红
  - 投票权（决定 CRV 奖励分配）

**适合谁**：
- 大资金用户（至少 5000 美元）
- 愿意锁仓 16 周的长期投资者

**贿赂收入**（高级玩法）：
- 其他协议会"贿赂" vlCVX 持有者
- 让你投票把 CRV 奖励分给他们的池子
- 你可以赚取额外的贿赂收入（年化 5-15%）
- 网站：votium.app

### 玩法 3：Curve Wars 参与（仅供了解）

Convex 是 **Curve Wars** 的核心玩家：
- Curve Wars = 各大协议争夺 CRV 奖励分配权
- Convex 控制了 50%+ 的 veCRV
- 持有 CVX = 间接控制 Curve 治理

**投资机会**：
- CVX 价格与 Curve 生态繁荣度挂钩
- 长期持有 CVX 可能受益于生态增长
- 但需要承担代币价格波动风险

---

## ❓ 常见问题 FAQ

**Q1：Convex 会跑路吗？**
A：风险较低。Convex 已运营 2 年，TVL 50 亿美元，多次审计，且与 Curve 官方深度合作。但 DeFi 永远有风险，不要投入超过承受能力的资金。

**Q2：我的 CRV 奖励去哪了？**
A：Convex 会自动把你的 CRV 奖励质押到 Curve DAO，帮你获得 Boost。作为补偿，你会获得 cvxCRV（可以 1:1 兑换回 CRV）和 CVX 奖励。

**Q3：cvxCRV 和 CRV 有什么区别？**
A：cvxCRV 是"永久锁定版"的 CRV。可以 1:1 单向兑换（CRV→cvxCRV），但不能反向。好处是质押 cvxCRV 有额外收益。

**Q4：什么时候应该领取奖励？**
A：建议每月领取一次。太频繁 Gas 费高，太久不领有风险。如果你的奖励价值超过 100 美元，可以考虑提前领取。

**Q5：小资金（500 美元以下）适合用 Convex 吗？**
A：不太建议。以太坊 Gas 费高昂，小资金的操作成本占比太大。建议至少 500 美元起，或者考虑在 Layer 2 上的替代方案（如 Beefy Finance）。

**Q6：Convex 和 Yearn 有什么区别？**
A：
- Yearn = 全自动策略（适合懒人）
- Convex = Curve 专用增强器（适合已在 Curve 挖矿的用户）
- 如果你不知道选哪个，先用 Yearn

**Q7：无常损失怎么办？**
A：选择稳定币池（3CRV）几乎无无常损失。如果选 ETH 池，确保你长期看好 ETH，且能承受短期价格波动。

**Q8：可以随时提取吗？**
A：可以。Convex 没有锁定期，随时可以提取 LP Token 并退出到 Curve。但注意 Gas 费成本。

---

## 💡 最后的建议

### 什么人适合用 Convex？

✅ **适合**：
- 已经在 Curve 挖矿，想提升收益
- 有 500 美元以上本金
- 能承受 Gas 费成本
- 愿意花时间理解 Curve 和 Convex 的机制

❌ **不适合**：
- DeFi 新手（建议先用 Yearn）
- 小额资金（500 美元以下）
- 需要频繁进出的短期交易者
- 完全不了解 Curve 的用户

### 实操建议

1. **第一步**：在 Curve 3pool 存入 500-1000 美元，体验一周
2. **第二步**：计算收益，看是否值得迁移到 Convex
3. **第三步**：在 Gas 低峰时迁移到 Convex
4. **第四步**：每月领取一次奖励，复投或锁定利润
5. **长期策略**：持续投入，积累 cvxCRV 和 CVX，享受复利效应

Convex Finance 是 **Curve 生态的收益放大器**，适合进阶 DeFi 用户。虽然操作比 Yearn 复杂，但收益提升显著。

**记住**：DeFi 有风险，永远不要投入超过你能承受损失的资金！从小额开始，慢慢积累经验。`,

  steps: [
    { step_number: 1, title: '理解 Convex 机制', description: '学习 Curve LP、cvxCRV、CVX 等核心概念。', estimated_time: '10 分钟' },
    { step_number: 2, title: '在 Curve 提供流动性', description: '选择合适的池子（推荐 3pool），存入流动性获得 LP Token。', estimated_time: '15 分钟' },
    { step_number: 3, title: '迁移到 Convex', description: '从 Curve Gauge 取回 LP，存入 Convex 并质押。', estimated_time: '10 分钟' },
    { step_number: 4, title: '每月领取奖励', description: '领取 CRV 和 CVX 奖励，选择质押或卖出。', estimated_time: '每月 10 分钟' },
    { step_number: 5, title: '优化收益策略', description: '根据市场情况调整质押 cvxCRV 或 CVX。', estimated_time: '每月 15 分钟' },
  ],
};

// ===== 13.4 Harvest Finance 收益聚合 =====
const STRATEGY_13_4 = {
  title: 'Harvest Finance 收益聚合 - 自动化 DeFi 赚钱机器',
  slug: 'vault-13-4-harvest-finance-auto-yield',
  summary: '使用 Harvest Finance 自动聚合多个 DeFi 协议（Compound、Aave、Curve）的最优收益，自动复投并转换为 FARM 代币，年化 10-45% APY，适合多链操作。',

  category: 'vault',
  category_l1: 'yield',
  category_l2: '聚合器/金库',

  difficulty_level: 1,
  risk_level: 2,

  apy_min: 10,
  apy_max: 45,
  threshold_capital: '200 美元起',
  threshold_capital_min: 200,
  time_commitment: '初始存入 15 分钟，此后自动运行',
  time_commitment_minutes: 15,
  threshold_tech_level: 'beginner',

  content: `> **适合人群**: DeFi 新手到中级用户，希望自动优化收益但不想频繁操作的投资者
> **阅读时间**: 约 13 分钟
> **关键词**: Harvest Finance / 收益聚合 / 自动复投 / FARM 代币 / 多链部署

---

## 🎯 什么是 Harvest Finance？用故事讲明白

### 小王的烦恼

**小王的 DeFi 投资现状**：
- 在 Compound 存了 1000 USDC，年化 3%
- 在 Curve 挖矿，年化 8%
- 在 Aave 借贷，年化 5%

**他的困扰**：
1. **收益太分散**：要登录 3 个网站查看收益
2. **需要手动复投**：每周要花 1 小时操作
3. **Gas 费吃掉利润**：每次复投花 15-30 美元 Gas 费
4. **不知道哪个收益最高**：市场变化快，Compound 今天 3%，明天可能变 1%
5. **操作太复杂**：新协议不敢试（怕被黑客攻击）

**小王的心声**：
"我就想躺赚，有没有一个平台能**自动帮我找最赚钱的地方**，自动复投，自动优化？"

### Harvest Finance 的解决方案

Harvest Finance 就像你的 **DeFi 私人理财顾问 + 自动化机器人**：

**传统做法（累）**：
- 你自己研究：Compound、Aave、Curve、Convex...
- 每周手动查看哪个收益最高
- 手动转移资金（每次花 Gas 费）
- 手动领取奖励、手动复投

**Harvest 做法（躺平）**：
- 把钱存入 Harvest Vault
- **自动化一切**：
  - 系统每天自动扫描 20+ DeFi 协议
  - 找到当前收益最高的策略
  - 自动转移资金到最优池子
  - 自动领取奖励、自动复投
  - 自动转换为 FARM 代币（附加收益）
- 你只需要：**啥都不用做，躺着收钱**

**核心优势**：
1. **收益聚合**：同时赚取多个协议的收益
2. **自动优化**：策略师 24/7 监控市场，自动调整
3. **Gas 费分摊**：所有用户共同分担，个人成本极低
4. **多链部署**：支持以太坊、BSC、Polygon，选 Gas 费最低的链

---

## 📊 为什么选择 Harvest Finance？

### 1. 收益对比：Harvest vs 手动操作

以 **1000 USDC 稳定币投资** 为例（1 年周期）：

| 对比项 | 手动操作 | Harvest Finance | 差异 |
|--------|----------|-----------------|------|
| **年化收益率** | 5-8% | 12-20% | +120% |
| **操作时间** | 每周 1 小时 | 0 小时（全自动） | 节省 52 小时/年 |
| **Gas 费成本** | $500-800/年 | $50-100/年（分摊） | 省 $500+ |
| **策略优化** | 需自己研究 | 专业团队 24/7 监控 | ✅ 专业 |
| **风险分散** | 单一协议风险 | 多协议分散 | ✅ 更安全 |
| **收益复投** | 手动（容易忘记） | 自动（每天） | ✅ 复利最大化 |
| **最终收益** | $60-80 | $150-220 | **+150%** |

**真实案例（2024 年数据）**：
- Harvest USDC Vault：年化 15.2%
- 同期 Compound USDC：年化 3.8%
- **收益提升 4 倍！**

### 2. Harvest 的市场地位

- **TVL（总锁仓量）**：2-5 亿美元
- **成立时间**：2020 年 9 月（老牌项目）
- **支持链**：以太坊、BSC、Polygon
- **支持资产**：30+ 主流币种和 LP Token

**安全性**：
- 经历过 2020 年黑客攻击，但已**全额赔偿**用户损失
- 此后升级安全系统，引入时间锁和多签机制
- 3 年无重大安全事故

**独特优势**：
- **FARM 代币激励**：除了基础收益，还获得 FARM 奖励
- **利润分享模式**：30% 收益分给 FARM 质押者
- **社区治理**：FARM 持有者投票决定新策略

---

## 📋 Harvest Finance 使用指南（小白版）

### 第一步：选择合适的链（5 分钟）

Harvest 支持 3 条链，**新手建议从这里开始**：

**链对比**：

| 链 | Gas 费 | 适合人群 | 推荐指数 |
|----|--------|----------|----------|
| **以太坊主网** | $15-50/笔 | 大资金（2000 美元+） | ⭐⭐⭐ |
| **BSC** | $0.5-2/笔 | 小资金（200 美元+） | ⭐⭐⭐⭐⭐ |
| **Polygon** | $0.1-0.5/笔 | 超小资金（100 美元+） | ⭐⭐⭐⭐ |

**新手推荐**：
- 资金 < 500 美元 → **BSC 或 Polygon**
- 资金 > 2000 美元 → **以太坊主网**（收益率更高）

### 第二步：准备工作（10 分钟）

**你需要准备**：

1. **钱包**：MetaMask
   - 下载安装：metamask.io
   - 备份助记词（12 个单词）

2. **添加网络**（如果选 BSC 或 Polygon）：

   **BSC 网络配置**：
   - 打开 MetaMask → 网络 → 添加网络
   - 网络名称：BSC Mainnet
   - RPC URL：https://bsc-dataseed.binance.org/
   - 链 ID：56
   - 货币符号：BNB

   **Polygon 网络配置**：
   - 网络名称：Polygon Mainnet
   - RPC URL：https://polygon-rpc.com/
   - 链 ID：137
   - 货币符号：MATIC

3. **准备资金**：
   - **稳定币**：USDC、USDT、DAI（新手首选）
   - **主流币**：ETH、BTC、BNB
   - 从交易所提币到对应链的钱包地址

4. **Gas 费代币**：
   - 以太坊 → 需要 ETH（50 美元）
   - BSC → 需要 BNB（5 美元）
   - Polygon → 需要 MATIC（2 美元）

### 第三步：选择合适的 Vault（核心步骤）

1. **访问 Harvest 官网**：
   - 打开 https://harvest.finance
   - 点击右上角 **Connect Wallet**
   - 选择 MetaMask 并连接

2. **切换到目标链**：
   - 在网站顶部选择网络（Ethereum / BSC / Polygon）
   - MetaMask 会弹窗确认切换

3. **浏览 Vault 列表**：

   在首页可以看到所有可用的 Vault，显示：
   - **APY**：年化收益率
   - **TVL**：总锁仓量（越大越安全）
   - **资产类型**：稳定币、ETH、LP Token 等

4. **新手推荐 Vault**：

   **最安全 - 稳定币 Vault**：
   - **USDC Vault**（推荐度 ⭐⭐⭐⭐⭐）
     - 年化：10-15%
     - 风险：极低（无无常损失）
     - 策略：自动在 Compound、Aave、Curve 之间轮换

   - **USDT Vault**（推荐度 ⭐⭐⭐⭐）
     - 年化：10-18%
     - 风险：低
     - 适合 BSC 用户（Gas 费低）

   **进阶选择 - ETH Vault**：
   - **ETH Vault**（推荐度 ⭐⭐⭐）
     - 年化：8-12%
     - 风险：中等
     - 适合长期持有 ETH 的用户

   **高收益 - LP Token Vault**：
   - **Curve 3CRV Vault**（推荐度 ⭐⭐⭐⭐）
     - 年化：15-25%
     - 风险：低
     - 需要先在 Curve 获得 LP Token

### 第四步：存入资金（5 分钟）

1. **点击选中的 Vault**：
   - 比如点击 **USDC Vault**
   - 进入 Vault 详情页

2. **查看策略说明**：
   - 页面会显示当前策略（比如 "Compound + Convex 组合"）
   - 了解资金会被投入到哪里

3. **输入存款金额**：
   - 在 **Deposit** 栏输入金额（比如 1000 USDC）
   - 系统会显示你将获得的 **fUSDC**（Harvest 凭证代币）

4. **授权并存入**：
   - 第一次使用需要先 **Approve**（授权合约）
     - 点击 **Approve USDC**
     - 确认 MetaMask 交易（Gas 费）
   - 授权完成后，点击 **Deposit**
     - 确认存款交易（Gas 费）
   - 等待交易确认

5. **验证是否成功**：
   - 在 Harvest 首页点击 **Dashboard**
   - 看到你的 **fUSDC 余额** 和 **实时收益增长**
   - 成功！

**什么是 fToken**？
- fUSDC、fETH 是 Harvest 的凭证代币
- 代表你在 Vault 中的份额
- 1 fUSDC = 你的本金 + 累计收益
- 提取时用 fToken 换回本金+收益

### 第五步：收益管理（每月 1 次）

**Harvest 的收益如何发放**？

Harvest 有两种收益：

1. **基础收益**（自动复投）：
   - 从 Compound、Curve 等协议赚取的收益
   - **自动复投**到 Vault 中
   - 你的 fToken 价值每天自动增长
   - **无需手动操作**

2. **FARM 代币奖励**（需要领取）：
   - 额外的平台激励代币
   - 需要手动领取

**如何领取 FARM 奖励**：

1. **查看待领取奖励**：
   - 访问 Harvest Dashboard
   - 看到 **Claimable FARM** 数量

2. **领取 FARM**：
   - 点击 **Claim**
   - 确认交易（支付 Gas 费）
   - FARM 代币会发送到你的钱包

3. **FARM 代币处理方式**：

   **方式 A：质押 FARM 赚收益**（推荐）：
   - 在 Harvest 网站找到 **Profit Sharing Pool**
   - 质押 FARM，分享平台 30% 的利润
   - 年化 8-15%

   **方式 B：卖掉 FARM 锁定利润**：
   - 去 Uniswap 或 PancakeSwap 卖出
   - 换成稳定币或再投入 Vault

**多久操作一次**？
- **查看收益**：每周看一次，了解表现
- **领取 FARM**：每月 1 次（累积到 50 美元以上再领取，省 Gas 费）
- **调整策略**：每季度 1 次（根据市场变化换 Vault）

### 第六步：提取资金（随时可退）

**Harvest 没有锁定期，随时可以提取**

1. **进入 Vault 页面**：
   - 找到你存款的 Vault
   - 点击进入详情页

2. **提取操作**：
   - 切换到 **Withdraw** 标签
   - 输入要提取的 fToken 数量
   - 或点击 **Max** 全部提取
   - 点击 **Withdraw**
   - 确认交易（支付 Gas 费）

3. **收到资金**：
   - 你会收到本金 + 累计收益
   - 比如存入 1000 USDC，3 个月后提取可能变成 1045 USDC
   - 资金直接回到钱包

**提取费用**：
- Harvest 收取 **0.5% 提取费**（非常低）
- Gas 费另计

---

## ⚠️ 风险提示和注意事项

### 主要风险

**1. 智能合约风险（低-中等）**
- Harvest 曾在 2020 年被黑客攻击损失 3300 万美元
- 但已全额赔偿用户，并升级安全系统
- 现在有时间锁（24 小时延迟）和多签机制
- **风险级别**：中等（比新项目安全，但不如 Yearn）

**2. FARM 代币价格风险**
- 部分收益以 FARM 代币发放
- FARM 价格波动大（-50% 到 +100% 都有可能）
- **建议**：定期卖出 FARM 锁定利润

**3. 底层协议风险**
- Harvest 依赖 Compound、Aave、Curve 等协议
- 如果底层协议出问题，Harvest 也受影响
- **缓解措施**：Harvest 只选择经过审计的顶级协议

**4. 无常损失风险（仅 LP Vault）**
- 如果你选择 LP Token Vault（如 Curve LP）
- 可能面临无常损失
- **解决方案**：新手只选稳定币 Vault

### 安全建议

1. **从小额开始**：第一次投 200-500 美元测试
2. **选稳定币 Vault**：USDC/USDT Vault 风险最低
3. **定期领取 FARM**：每月卖出，避免价格暴跌
4. **分散投资**：不要把所有钱放 Harvest，分散到 Yearn、Beefy 等
5. **了解底层策略**：点击 Vault 页面的 "Strategy" 查看资金去向

---

## 🎓 进阶玩法和技巧

### 技巧 1：多链套利（高级）

如果你有时间和精力，可以在 3 条链上同时操作：

**套利逻辑**：
- 以太坊 USDC Vault APY：15%
- BSC USDT Vault APY：22%
- Polygon USDC Vault APY：18%

**操作方法**：
- 把 70% 资金放 BSC（收益最高）
- 30% 放以太坊（安全性最高）
- 每月比较收益，动态调整

**注意**：跨链转账有成本，小资金不划算。

### 技巧 2：质押 FARM 最大化收益

**Profit Sharing Pool**：
- 质押 FARM，分享平台 30% 利润
- 年化 8-15%
- 收益用 FARM 和其他代币支付

**适合谁**：
- 长期看好 Harvest 的用户
- 有闲置 FARM 代币的投资者

**操作步骤**：
1. 在 Harvest 首页找到 **Profit Sharing**
2. 点击 **Stake FARM**
3. 输入数量，确认交易
4. 每周自动获得分红

### 技巧 3：利用 Zapper 一键进入

如果你没有 Curve LP Token，但想投资 Curve LP Vault：

**使用 Zapper.fi**：
- 访问 zapper.fi
- 连接钱包
- 搜索 "Harvest Finance"
- 选择目标 Vault
- 用任意代币（ETH、USDC等）一键 Zap in
- 系统自动帮你：
  1. 兑换成所需代币
  2. 在 Curve 添加流动性
  3. 将 LP Token 存入 Harvest
- **省去 5 步操作，只需 1 笔交易**

---

## ❓ 常见问题 FAQ

**Q1：Harvest 安全吗？会不会跑路？**
A：Harvest 在 2020 年被黑客攻击过，但全额赔偿了用户。此后升级安全系统，3 年无事故。风险比新项目低，但不如 Yearn 稳健。建议分散投资。

**Q2：FARM 代币值得买吗？**
A：FARM 是平台治理代币，质押可以分享利润。但价格波动大，不建议大量囤积。领取后及时卖出较稳妥。

**Q3：Harvest 和 Yearn 有什么区别？**
A：
- **Yearn**：收益稳定（5-15%），安全性最高，适合大资金
- **Harvest**：收益更高（10-25%），多链支持，适合中小资金
- **建议**：大资金选 Yearn，小资金选 Harvest

**Q4：为什么收益率一直在变？**
A：Harvest 会根据市场实时调整策略。比如 Compound 利率降低，它会自动转移到 Aave。收益率波动是正常的。

**Q5：提取需要多久？**
A：即时提取，确认交易后资金马上到账。没有锁定期或等待期。

**Q6：小资金（200 美元）值得用 Harvest 吗？**
A：值得！选择 BSC 或 Polygon 链，Gas 费极低（每笔 1-2 美元）。200 美元年化 15%，一年赚 30 美元，扣除 Gas 费还有 20+ 美元利润。

**Q7：可以用手机操作吗？**
A：可以。在手机上用 MetaMask 浏览器打开 harvest.finance，体验和电脑一样。

**Q8：Harvest 会倒闭吗？**
A：作为 DeFi 项目，理论上不存在"倒闭"。即使团队解散，你的资金仍锁在智能合约中，可以通过区块链浏览器提取。但最好在项目活跃时使用。

---

## 💡 最后的建议

### 什么人适合用 Harvest Finance？

✅ **适合**：
- DeFi 新手到中级用户
- 希望自动化收益优化
- 有 200 美元以上本金
- 接受中等风险，追求高收益
- 在 BSC 或 Polygon 操作的小资金用户

❌ **不适合**：
- 完全零基础的用户（建议先用 Yearn）
- 追求绝对安全的保守投资者
- 大资金用户（2 万美元以上，建议用 Yearn）
- 需要频繁进出的短期交易者

### 实操建议

**第一阶段（第 1 个月）**：
- 在 BSC 存入 200-500 USDT 到 USDT Vault
- 每周查看一次收益
- 体验 Harvest 的自动复投机制

**第二阶段（第 2-3 个月）**：
- 如果体验良好，增加投入到 1000-2000 美元
- 尝试多链操作（以太坊 + BSC）
- 开始领取和质押 FARM 代币

**第三阶段（长期）**：
- 建立多样化 DeFi 投资组合：
  - 30% Yearn（最安全）
  - 40% Harvest（平衡收益）
  - 30% 其他高收益策略（Convex、Beefy 等）
- 每月复盘，动态调整

Harvest Finance 是 **自动化 DeFi 收益优化的优秀选择**，特别适合中小资金的懒人投资者。虽然有一定风险，但收益提升显著，值得尝试。

**记住**：DeFi 有风险，永远不要投入超过你能承受损失的资金！从小额开始，慢慢积累经验。`,

  steps: [
    { step_number: 1, title: '选择链和准备钱包', description: '根据资金量选择以太坊/BSC/Polygon，配置 MetaMask。', estimated_time: '10 分钟' },
    { step_number: 2, title: '选择合适的 Vault', description: '新手选 USDC/USDT Vault，进阶选 LP Vault。', estimated_time: '5 分钟' },
    { step_number: 3, title: '存入资金', description: '授权并存入资金，获得 fToken 凭证。', estimated_time: '5 分钟' },
    { step_number: 4, title: '每月领取 FARM 奖励', description: '领取 FARM 代币，选择质押或卖出。', estimated_time: '每月 10 分钟' },
    { step_number: 5, title: '定期查看和调整', description: '每季度查看收益表现，必要时调整 Vault。', estimated_time: '每季度 15 分钟' },
  ],
};

// ===== 获取认证 Token =====
async function getAuthToken() {
  const response = await axios.post(`${DIRECTUS_URL}/auth/login`, {
    email: 'the_uk1@outlook.com',
    password: 'Mygcdjmyxzg2026!',
  });
  return response.data.data.access_token;
}

// ===== 主函数：创建策略 =====
async function createStrategies() {
  try {
    console.log('\\n开始创建 13.3 和 13.4 策略...\\n');

    const token = await getAuthToken();

    const strategies = [STRATEGY_13_3, STRATEGY_13_4];

    for (let i = 0; i < strategies.length; i++) {
      const strategy = {
        ...strategies[i],
        status: 'published',
        published_at: new Date().toISOString(),
        view_count: 0,
        bookmark_count: 0,
        is_featured: false,
      };

      const response = await axios.post(
        `${DIRECTUS_URL}/items/strategies`,
        strategy,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(`✅ [${i + 1}/2] ${strategy.title}`);
      console.log(`   ID: ${response.data.data.id}`);
      console.log(`   Slug: ${response.data.data.slug}\\n`);
    }

    console.log('🎉 创建完成！');
    console.log('访问: http://localhost:3000/strategies?category=vault\\n');
  } catch (error) {
    console.error('\\n❌ 创建失败:', error.response?.data || error.message);
  }
}

// 执行
createStrategies();
