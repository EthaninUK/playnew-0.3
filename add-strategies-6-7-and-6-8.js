const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

// ===== 6.7 Convex Finance CRV 加速 =====
const STRATEGY_6_7 = {
  title: 'Convex Finance CRV 加速 - Curve 收益增强器',
  slug: 'convex-finance-crv-boost',
  summary: '在 Convex Finance 质押 Curve LP Token，获得额外的 CVX 奖励和 veCRV 加成，免去锁仓 CRV 的繁琐，最大化 Curve 收益。',

  category: 'stablecoin-yield',
  category_l1: 'yield',
  category_l2: '稳定币理财',

  difficulty_level: 3,
  risk_level: 3,

  apy_min: 5,
  apy_max: 20,
  threshold_capital: '1000 美元起',
  threshold_capital_min: 1000,
  time_commitment: '2 小时设置 + 每月 20 分钟监控',
  time_commitment_minutes: 140,
  threshold_tech_level: 'advanced',

  content: `> **适合人群**：已经使用 Curve 3pool、追求最大化收益、了解 DeFi 复杂机制的用户
> **阅读时间**：约 18 分钟
> **关键词**：Convex / CRV / veCRV / Boost / Curve / CVX / 收益增强

---

## 🎯 什么是 Convex Finance？

### 用大白话解释

想象一下：
- **直接用 Curve**：你提供流动性赚 CRV，但要锁仓 CRV 4年才能获得 2.5倍 Boost
- **使用 Convex**：你不需要锁仓，Convex 帮你锁定，你直接享受 Boost，还额外获得 CVX 代币
- **类比**：Convex 像"Curve 的 VIP 会员服务"，帮你最大化收益

### Convex 核心概念

**1. Curve 的 veCRV 机制（背景知识）**

在 Curve 上提供流动性，你会获得：
- 交易手续费
- CRV 代币奖励

但要最大化 CRV 奖励，你需要：
- 锁定 CRV（最长 4年）→ 获得 veCRV
- veCRV 提供 Boost（最高 2.5倍 CRV 奖励）

**问题**：
- 锁定 4年太长
- CRV 锁定期间无法交易（流动性风险）
- 手动操作复杂

**2. Convex 的解决方案**

Convex 将 Curve LP Token 聚合起来：
1. 用户将 Curve LP（如 3CRV）存入 Convex
2. Convex 锁定了大量 CRV（永久锁定为 veCRV）
3. Convex 用这些 veCRV 给所有用户提供 Boost
4. 用户额外获得 CVX 代币奖励

**你的收益**：
- Curve 交易手续费（基础收益）
- CRV 奖励（Boost 后，约 2-2.5倍）
- CVX 代币奖励（额外收益）

**真实案例**：
- 直接在 Curve 3pool：APY 3-6%
- 通过 Convex 质押 3CRV：APY 7-15%（多了 CRV Boost + CVX 奖励）

---

## 📋 准备工作（45 分钟）

### 第一步：理解 Convex 机制

**Convex 的运作流程**：

1. **你在 Curve 提供流动性**
   - 例如：在 Curve 3pool 存入 USDT/USDC/DAI
   - 获得 3CRV（Curve LP Token）

2. **将 3CRV 存入 Convex**
   - 在 Convex 质押 3CRV
   - 获得 cvx3CRV（Convex 包装的 LP Token）

3. **自动获得多重收益**
   - Curve 交易手续费（通过 3CRV 累积）
   - CRV 奖励（Boost 后）
   - CVX 代币奖励

4. **（可选）进一步优化**
   - 将 CRV 和 CVX 锁定为 cvxCRV 和 vlCVX
   - 获得额外收益和治理权

### 第二步：准备资金

**你需要**：
1. **稳定币**（USDT/USDC/DAI，至少 1000 美元）
   - 低于 1000 美元，Gas 费占比过高
2. **ETH**（0.05-0.1 ETH，约 100-200 美元）
   - Curve + Convex 的 Gas 费较高

**或者**：
- 如果你已经有 Curve LP Token（如 3CRV），可以直接使用

### 第三步：选择 Pool

Convex 支持大部分 Curve Pool：

| Pool | Convex APY | 风险 | 推荐度 |
|------|-----------|------|--------|
| 3pool (USDT/USDC/DAI) | 7-15% | 极低 | ⭐⭐⭐⭐⭐ |
| Frax (FRAX/USDC) | 8-18% | 低 | ⭐⭐⭐⭐ |
| MIM (MIM/3CRV) | 10-25% | 中（算法稳定币） | ⭐⭐⭐ |
| crvUSD (crvUSD/USDC) | 6-12% | 低 | ⭐⭐⭐⭐ |

**新手推荐**：3pool（最稳健、流动性最好）

---

## 🚀 操作步骤

### 步骤 1：在 Curve 获得 LP Token

**如果你还没有 3CRV**：

1. 访问 https://curve.fi
2. 找到 3pool
3. 存入 USDT/USDC/DAI
4. 获得 3CRV

**详细步骤参考**：本玩法库中的"Curve 3pool 低滑点收益"

### 步骤 2：访问 Convex 应用

1. 访问 Convex 官网：https://www.convexfinance.com
2. 点击右上角"Connect Wallet"
3. 选择 MetaMask
4. 确认连接

**安全提示**：
- ✅ 确保网址是 convexfinance.com
- ✅ Convex 有仿盘，务必通过官方链接访问

### 步骤 3：找到 3pool 并质押

1. 在 Convex 主页找到"Pools"
2. 搜索"3pool"或在列表中找到
3. 查看当前 APY

**界面示例**：

3pool (USDT/USDC/DAI)
┌────────────────────────────────┐
│ TVL: $800,000,000              │
│ Base APY: 2.5% (Curve fees)    │
│ Rewards APY:                   │
│   - CRV: 4.2%                  │
│   - CVX: 2.8%                  │
│ Total APY: 9.5%                │
└────────────────────────────────┘


4. 点击"Deposit"
5. 输入你要质押的 3CRV 数量
6. 点击"Stake"

### 步骤 4：授权和确认

**需要两步**：

1. **Approve 3CRV**
   - MetaMask 弹出授权请求
   - 确认（支付 Gas 约 10-20 美元）

2. **Stake（质押）**
   - 授权完成后，再次点击"Stake"
   - 确认交易（支付 Gas 约 15-30 美元）

3. 等待交易确认

### 步骤 5：确认并领取奖励

**确认成功**：
1. 刷新页面
2. 在"My Stakes"（我的质押）中看到 3pool
3. 开始累积 CRV 和 CVX 奖励

**领取奖励**：
- 奖励需要手动领取（Claim）
- 建议累积到 50-100 美元再领取（避免频繁 Gas 费）
- 在 Pool 页面点击"Claim"

**奖励处理**：
1. **卖出换成稳定币**
   - 在 Uniswap/Curve 卖出 CRV 和 CVX
   - 换成 USDC 后复投

2. **锁定为 cvxCRV 和 vlCVX**（高级策略）
   - 锁定 CRV 为 cvxCRV（永久，但可交易）
   - 锁定 CVX 为 vlCVX（16周）
   - 获得额外收益和治理权

---

## 💰 成本与收益

### 成本分析

| 成本项 | 金额（以太坊主网） |
|--------|-------------------|
| Curve Deposit Gas | 15-30 美元 |
| Convex Approve Gas | 10-20 美元 |
| Convex Stake Gas | 15-30 美元 |
| Claim Rewards Gas | 10-20 美元/次 |
| Withdraw Gas | 15-30 美元 |
| **总成本（首次）** | **65-130 美元** |

### 收益计算

**示例 1：1000 美元 3CRV，持有 1 年，9.5% APY**
- Base APY（Curve 手续费）：2.5%
- CRV APY（Boost 后）：4.2%
- CVX APY：2.8%
- 总收益：1000 × 9.5% = 95 美元
- 减去 Gas（包含 Curve）：95 - 80 = 15 美元
- **净收益率**：1.5%

**示例 2：10000 美元，持有 1 年，9.5% APY**
- 总收益：950 美元
- 减去 Gas：950 - 80 = 870 美元
- **净收益率**：8.7%

**示例 3：10000 美元，持有 2 年，10% 平均 APY**
- 第一年：净收益 870 美元
- 第二年：无需重新 Gas，收益 (10000+870) × 10% = 1087 美元
- 两年总收益：1957 美元
- **平均年化**：9.8%

**对比直接使用 Curve**：
- Curve 3pool 直接：3-6% APY
- Convex 增强：7-15% APY
- **提升**：4-9% APY

---

## ⚠️ 风险与注意事项

### 主要风险

1. **智能合约风险**
   - Convex 依赖 Curve，两个协议都可能有漏洞
   - **历史**：Curve 2023年7月被攻击（vyper 编译器漏洞），Convex 也受影响
   - **应对**：不要投入全部资金

2. **CVX 代币价格风险**
   - 收益的一部分是 CVX 代币
   - 如果 CVX 价格下跌，实际 APY 会降低
   - **应对**：定期卖出 CVX，锁定收益

3. **CRV 价格波动**
   - CRV 奖励价值取决于 CRV 价格
   - **应对**：定期卖出 CRV

4. **稳定币脱锚**
   - 如果 USDT/USDC/DAI 脱锚，LP 价值会下降
   - **应对**：选择流动性好的 Pool（如 3pool）

5. **Gas 费高**
   - 以太坊主网 Gas 费非常高
   - 每次操作（质押、领奖、提取）都需要 Gas
   - **应对**：大额使用，或等待 Gas 低谷期

6. **提现流动性**
   - 极端情况下，Curve Pool 可能不平衡，提现有滑点
   - **应对**：选择 TVL 大的 Pool

### 安全清单

- ✅ 仅在官方网站（convexfinance.com）操作
- ✅ 定期检查授权合约（使用 Revoke.cash）
- ✅ 不要投入全部资金
- ✅ 定期领取并卖出 CRV/CVX（锁定收益）
- ✅ 关注 Curve 和 Convex 的安全公告

---

## 🔥 进阶技巧

### 技巧 1：锁定 CRV 为 cvxCRV

**什么是 cvxCRV？**
- 将 CRV 在 Convex 锁定（永久），获得 cvxCRV
- cvxCRV 可以交易（虽然永久锁定，但代币可流通）
- 质押 cvxCRV 可以获得额外收益

**操作流程**：
1. 领取 CRV 奖励
2. 在 Convex 页面点击"Convert CRV → cvxCRV"
3. 质押 cvxCRV
4. 获得额外收益（3CRV + CVX + 平台手续费分成）

**收益对比**：
- 直接卖出 CRV：获得一次性现金流
- 锁定为 cvxCRV：长期收益更高（约 5-10% APY）

### 技巧 2：锁定 CVX 为 vlCVX

**什么是 vlCVX？**
- 锁定 CVX（16周）获得 vlCVX
- vlCVX 有治理权，可以投票决定 CRV 分配
- 获得"贿赂"收入（其他协议付费让你投票给他们的 Pool）

**操作流程**：
1. 领取 CVX 奖励
2. 在 Convex 点击"Lock CVX"
3. 选择锁定期（16周）
4. 获得 vlCVX

**收益**：
- vlCVX 奖励：约 5-15% APY
- 贿赂收入：额外 5-20% APY（取决于投票策略）

**风险**：
- 锁定 16周，期间无法提取
- CVX 价格可能下跌

### 技巧 3：使用 Votium 获取贿赂

**Votium 是什么？**
- Votium 是 Convex 贿赂聚合平台
- 其他协议在 Votium 上竞价，让 vlCVX 持有者投票给他们

**操作**：
1. 锁定 CVX 为 vlCVX
2. 访问 https://votium.app
3. 参与投票（每两周一次）
4. 领取贿赂奖励

**收益**：
- 贿赂 APY：5-30%（取决于竞争激烈程度）
- 2021年牛市，Votium 贿赂 APY 高达 50%+

### 技巧 4：使用 Concentrator 自动复利

**Concentrator 是什么？**
- Concentrator 是 Convex 的自动复利金库
- 自动领取 CRV/CVX 并复投

**操作**：
1. 访问 https://concentrator.aladdin.club
2. 将 cvx3CRV 存入 Concentrator
3. 自动复利，APY 提升 1-2%

### 技巧 5：跨链到 Arbitrum/Optimism

**省 Gas 策略**：
1. 使用官方桥将稳定币转移到 Arbitrum
2. 在 Arbitrum 上使用 Curve + Convex
3. Gas 费仅需 1-3 美元（vs 主网 60-130 美元）

**注意**：
- Arbitrum 上的 Curve Pool 较少
- 流动性略低于主网

---

## 📊 Convex vs 直接用 Curve

| 指标 | 直接用 Curve | 使用 Convex |
|------|-------------|------------|
| 3pool APY | 3-6% | 7-15% |
| 是否需要锁定 CRV | 是（4年） | 否 |
| CRV Boost | 需手动操作 | 自动 |
| 额外奖励 | 无 | CVX 代币 |
| 操作复杂度 | 低 | 中 |
| Gas 费 | 中 | 高（多一次质押） |

**什么时候用 Convex？**
- 你不想锁定 CRV 4年
- 你追求最大化收益
- 你有大额资金（2000 美元+）

**什么时候直接用 Curve？**
- 你是小额资金（低于 1000 美元，Gas 费太高）
- 你不想增加智能合约风险
- 你只需要基础收益

---

## ❓ 常见问题

**Q1：Convex 安全吗？**
> Convex 是 DeFi 蓝筹协议，TVL 超 30 亿美元。经过多次审计，但 2023年曾因 Curve 被攻击而受影响。建议分散资金。

**Q2：cvx3CRV 和 3CRV 有什么区别？**
> cvx3CRV 是 Convex 包装的 3CRV。功能几乎相同，但在 Convex 质押才能获得 CVX 奖励。

**Q3：为什么 Convex 能提供 Boost？**
> Convex 锁定了大量 CRV（超 1.5 亿个），拥有 Curve 最多的 veCRV。所有 Convex 用户共享这些 veCRV 的 Boost。

**Q4：CRV 和 CVX 领取后应该卖还是留？**
> 取决于你对代币的看法：
> - 看涨 CRV/CVX → 持有或锁定（cvxCRV/vlCVX）
> - 追求稳定 → 卖出换成稳定币复投
> - 推荐：卖出 50%，锁定 50%

**Q5：Convex 的费用是多少？**
> Convex 从 CRV 奖励中抽取 17%（分配给 CVX 质押者和协议）。但你额外获得 CVX，总收益仍高于直接用 Curve。

**Q6：可以随时提取吗？**
> 可以。cvx3CRV 可以随时提取为 3CRV，再从 Curve 提取稳定币。但锁定的 cvxCRV/vlCVX 有时间限制。

---

## ✅ 行动清单

- [ ] 准备稳定币和 ETH（Gas 费）
- [ ] 在 Curve 3pool 存入流动性，获得 3CRV
- [ ] 访问 convexfinance.com，连接钱包
- [ ] 找到 3pool，查看 APY
- [ ] Approve + Stake 3CRV 到 Convex
- [ ] 确认开始累积 CRV 和 CVX 奖励
- [ ] 设置提醒：每两周检查一次奖励
- [ ] 累积到 50-100 美元后领取奖励
- [ ] 决定卖出或锁定 CRV/CVX
- [ ] （可选）研究 cvxCRV/vlCVX/Votium 高级策略

---

## 🎓 总结

**Convex Finance 的核心价值**：
1. **免锁仓 Boost**：不需要锁定 CRV 4年，自动享受 2-2.5倍 Boost
2. **额外 CVX 奖励**：在 Curve 收益基础上额外获得 CVX 代币
3. **最大化收益**：总 APY 比直接用 Curve 高 4-9%
4. **DeFi 乐高**：可以进一步组合 cvxCRV/vlCVX/Votium 等策略

**适合人群**：
- 已经在用 Curve 3pool 的用户
- 追求最大化收益，愿意增加一层智能合约风险
- 大额资金（2000 美元+）
- 了解 DeFi 复杂机制

**不适合人群**：
- DeFi 新手（建议先从 Curve 或 Aave 学起）
- 小额资金（低于 1000 美元，Gas 费太高）
- 无法接受多层智能合约风险
- 希望完全被动收益（Convex 需要定期领取奖励）

**一句话总结**：
> Convex 是 Curve 用户的"VIP 增值服务"，用一次质押操作换取 4-9% 的额外收益。

**下一步学习**：
- 研究 cvxCRV 和 vlCVX 的高级玩法
- 了解 Votium 贿赂机制
- 学习 Concentrator 自动复利
- 探索其他 Curve Pool（如 Frax、crvUSD）

让 Convex 成为你的 Curve 收益增强器！🚀
`,

  steps: [
    { step_number: 1, title: '在 Curve 获得 LP', description: '在 Curve 3pool 存入稳定币，获得 3CRV。', estimated_time: '30 分钟' },
    { step_number: 2, title: '质押到 Convex', description: '访问 convexfinance.com，质押 3CRV。', estimated_time: '20 分钟' },
    { step_number: 3, title: '领取奖励', description: '每 2-4 周领取一次 CRV 和 CVX 奖励。', estimated_time: '10 分钟/次' },
    { step_number: 4, title: '处理奖励', description: '卖出或锁定 CRV/CVX，优化收益。', estimated_time: '15 分钟' },
    { step_number: 5, title: '（可选）高级策略', description: '研究 cvxCRV/vlCVX/Votium，进一步提升收益。', estimated_time: '1-2 小时' },
  ],
};

// ===== 6.8 Stargate USDC 跨链流动性 =====
const STRATEGY_6_8 = {
  title: 'Stargate USDC 跨链流动性 - 全链稳定币收益',
  slug: 'stargate-usdc-crosschain-liquidity',
  summary: '在 Stargate Finance 提供 USDC 跨链流动性，赚取跨链桥接手续费和 STG 代币奖励，享受低风险稳定收益。',

  category: 'stablecoin-yield',
  category_l1: 'yield',
  category_l2: '稳定币理财',

  difficulty_level: 3,
  risk_level: 3,

  apy_min: 4,
  apy_max: 15,
  threshold_capital: '500 美元起',
  threshold_capital_min: 500,
  time_commitment: '1.5 小时设置 + 每月 15 分钟监控',
  time_commitment_minutes: 105,
  threshold_tech_level: 'intermediate',

  content: `> **适合人群**：持有稳定币、看好跨链桥接需求、愿意承担一定智能合约风险的用户
> **阅读时间**：约 15 分钟
> **关键词**：Stargate / LayerZero / USDC / 跨链 / 流动性 / STG

---

## 🎯 什么是 Stargate Finance？

### 用大白话解释

想象一下：
- **传统跨链桥**：你要把 USDC 从以太坊转到 Arbitrum，需要等待很久，手续费高
- **Stargate**：提供即时跨链转账，手续费低（0.06%），速度快
- **你的角色**：往 Stargate 的 USDC 池子里放钱，每次有人跨链就给你分手续费

### Stargate 核心概念

**1. LayerZero 协议**
- Stargate 基于 LayerZero（全链互操作性协议）
- LayerZero 是跨链通信的"底层协议"
- Stargate 是 LayerZero 上的"稳定币桥接应用"

**2. 统一流动性**
- Stargate 在多条链上都有 USDC 池
- 当你从以太坊桥接到 Arbitrum：
  - 以太坊池子的 USDC 减少
  - Arbitrum 池子的 USDC 增加
  - 你支付 0.06% 手续费
  - 流动性提供者获得手续费分成

**3. Delta Algorithm**
- Stargate 的核心创新：Delta 算法
- 自动平衡各链的流动性
- 确保任何时候都有足够的 USDC 可供跨链

### 收益来源

你的收益来自三部分：
1. **跨链手续费**：0.06% × 跨链交易量
   - 预估 APY：2-6%（取决于跨链活跃度）
2. **STG 代币奖励**：Stargate 治理代币激励
   - 预估 APY：2-10%（取决于 STG 价格）
3. **协议收入分成**：部分协议费用分配给流动性提供者
   - 预估 APY：0.5-2%

**真实案例**：
- 2024年初 USDC 池 APY：6-12%
- 2023年 LayerZero 空投预期时 APY：15-25%（大量用户跨链）
- 2022年熊市：APY 降至 4-8%

---

## 📋 准备工作（30 分钟）

### 第一步：了解 Stargate 风险

**主要风险**：

1. **智能合约风险**
   - Stargate 和 LayerZero 都是新协议（2022年上线）
   - 虽然经过审计，但运营时间较短
   - **应对**：不要投入全部资金

2. **Delta 不平衡风险**
   - 如果某条链的 USDC 池耗尽，可能无法提现
   - Stargate 的 Delta 算法会调整手续费来平衡
   - **应对**：选择流动性深的链（以太坊、Arbitrum）

3. **STG 代币价格风险**
   - 收益的一部分是 STG 代币
   - STG 价格波动影响实际 APY
   - **应对**：定期卖出 STG，锁定收益

4. **跨链桥风险**
   - 跨链桥是黑客攻击的高发地
   - **历史**：2022年多个跨链桥被攻击（Wormhole、Ronin等）
   - **应对**：Stargate 使用 LayerZero，安全性相对较高

### 第二步：准备资金

**你需要**：
1. **USDC**（500 美元起，推荐 1000-10000 美元）
2. **ETH**（Gas 费，0.02-0.03 ETH）
   - 或使用 Arbitrum/Polygon（Gas 低至 0.5-2 美元）

### 第三步：选择链

Stargate 支持多链：

| 链 | USDC 池 TVL | Gas 费 | APY | 推荐度 |
|---|------------|--------|-----|--------|
| 以太坊主网 | 最高（100M+） | 高（20-40 美元） | 6-10% | ⭐⭐⭐⭐（大额） |
| Arbitrum | 高（50M+） | 低（1-2 美元） | 7-12% | ⭐⭐⭐⭐⭐（推荐） |
| Optimism | 中（30M+） | 低（1-2 美元） | 7-12% | ⭐⭐⭐⭐ |
| Polygon | 中（20M+） | 极低（0.1 美元） | 8-15% | ⭐⭐⭐⭐ |
| BNB Chain | 中（25M+） | 极低（0.2 美元） | 8-14% | ⭐⭐⭐⭐ |
| Avalanche | 低（10M+） | 低（0.5 美元） | 9-16% | ⭐⭐⭐ |

**新手推荐**：Arbitrum（Gas 低、TVL 高、APY 适中）

---

## 🚀 操作步骤（以 Arbitrum 为例）

### 步骤 1：跨链到 Arbitrum

**如果你的 USDC 在以太坊主网**：

**方法 1：使用 Stargate 跨链**
1. 访问 https://stargate.finance
2. 选择 "Transfer"
3. From: Ethereum → To: Arbitrum
4. 输入 USDC 数量
5. 确认交易（手续费 0.06% + Gas）

**方法 2：使用官方桥**
- 访问 https://bridge.arbitrum.io
- 跨链时间约 10-15 分钟

### 步骤 2：访问 Stargate 应用

1. 访问 https://stargate.finance
2. 点击右上角"Connect Wallet"
3. 选择 MetaMask
4. **切换网络到 Arbitrum**
5. 确认连接

**安全提示**：
- ✅ 确保网址是 stargate.finance
- ✅ 检查你在正确的网络（Arbitrum）

### 步骤 3：添加流动性

1. 点击顶部菜单"Pool"
2. 选择"USDC Pool"
3. 查看当前 APY 和 TVL

**界面示例**：

USDC Pool (Arbitrum)
┌────────────────────────────────┐
│ TVL: $55,000,000               │
│ APY Breakdown:                 │
│   - Trading Fees: 3.2%         │
│   - STG Rewards: 5.8%          │
│   - Total APY: 9.0%            │
│                                │
│ Your Liquidity: $0             │
└────────────────────────────────┘


4. 点击"Add Liquidity"
5. 输入你要存入的 USDC 数量

### 步骤 4：授权和确认

**首次需要两步**：

1. **Approve USDC**
   - MetaMask 弹出授权请求
   - 确认（Gas 约 1-2 美元，Arbitrum）

2. **Add Liquidity**
   - 授权完成后，点击"Add Liquidity"
   - 确认交易（Gas 约 1-2 美元）

3. 等待交易确认

### 步骤 5：获得 S*USDC

**成功后**：
1. 你会收到 **S*USDC**（Stargate LP Token）
2. S*USDC 代表你在 USDC 池中的份额
3. S*USDC 的价值会随时间增长（手续费累积）

**查看收益**：
- 在"Pool"页面查看你的 Liquidity
- 实时显示你的 S*USDC 价值和 STG 奖励

---

## 💰 成本与收益

### 成本分析

| 成本项 | 以太坊主网 | Arbitrum |
|--------|-----------|---------|
| 跨链到 Arbitrum | 10-20 美元 + 0.06% | - |
| Approve USDC | 10-20 美元 | 1-2 美元 |
| Add Liquidity | 15-30 美元 | 1-2 美元 |
| Claim STG | 10-20 美元/次 | 1 美元/次 |
| Remove Liquidity | 15-30 美元 | 1-2 美元 |
| **总成本** | **60-120 美元** | **5-10 美元** |

### 收益计算

**示例 1：1000 USDC，Arbitrum，9% APY，持有 1 年**
- 手续费收入：1000 × 3.2% = 32 USDC
- STG 奖励：1000 × 5.8% = 58 USDC（假设 STG 价格不变）
- 总收益：90 USDC
- 减去 Gas：90 - 8 = 82 USDC
- **净收益率**：8.2%

**示例 2：5000 USDC，Arbitrum，9% APY，持有 1 年**
- 总收益：450 USDC
- 减去 Gas：450 - 8 = 442 USDC
- **净收益率**：8.84%

**示例 3：10000 USDC，以太坊主网，8% APY，持有 1 年**
- 总收益：800 USDC
- 减去 Gas：800 - 80 = 720 USDC
- **净收益率**：7.2%

**对比其他方案**：
- Aave USDC：2-5% APY
- Curve 3pool：3-6% APY
- Stargate USDC：6-15% APY（跨链需求旺盛时）

---

## ⚠️ 风险与注意事项

### 主要风险

1. **Delta 不平衡**
   - 如果 Arbitrum USDC 池被大量提取，你可能暂时无法提现
   - Stargate 会通过调整手续费来吸引流动性回流
   - **应对**：选择 TVL 大的池（以太坊、Arbitrum）

2. **跨链桥攻击**
   - 跨链桥是高风险领域
   - **应对**：Stargate 使用 LayerZero，相对安全；但仍需谨慎

3. **STG 代币波动**
   - STG 价格下跌会降低实际 APY
   - **应对**：定期卖出 STG，锁定收益

4. **无常损失**
   - Stargate 的稳定币池几乎没有无常损失（单币池）
   - 但极端情况下（某条链 USDC 脱锚），可能有损失
   - **风险**：极低（< 0.5%）

5. **Gas 费**
   - 以太坊主网 Gas 费高
   - **应对**：使用 Arbitrum/Polygon

### 安全清单

- ✅ 仅在官方网站（stargate.finance）操作
- ✅ 选择 TVL 大的池（以太坊、Arbitrum）
- ✅ 不要投入全部资金
- ✅ 定期领取并卖出 STG
- ✅ 关注 Stargate 和 LayerZero 的安全公告

---

## 🔥 进阶技巧

### 技巧 1：多链分散

**策略**：
- 不要把所有 USDC 放在一条链
- 分散到 Arbitrum + Polygon + BNB Chain
- 降低 Delta 不平衡风险

**示例**：
- 10000 USDC：
  - 4000 USDC → Arbitrum
  - 3000 USDC → Polygon
  - 3000 USDC → BNB Chain

### 技巧 2：质押 STG 赚取额外收益

**veSTG 机制**：
1. 锁定 STG（最长 4年）获得 veSTG
2. veSTG 可以提升流动性奖励（最高 2.5倍）
3. veSTG 还能参与治理投票

**操作**：
1. 领取 STG 奖励
2. 在 Stargate 页面点击"Stake"
3. 锁定 STG 为 veSTG
4. 享受 Boost

**风险**：
- 锁定期长（最长 4年）
- STG 价格可能下跌

### 技巧 3：使用 Stargate 赚取空投积分

**LayerZero 空投预期**：
- LayerZero 是 Stargate 背后的协议
- 尚未发币，空投预期强
- 使用 Stargate 可能获得 LayerZero 空投资格

**策略**：
1. 在 Stargate 提供流动性
2. 定期使用 Stargate 跨链（建立链上记录）
3. 等待 LayerZero 空投（时间不确定）

### 技巧 4：监控 Delta，择机进出

**Delta 监控**：
- 在 Stargate 界面查看各链的 Delta 状态
- Delta 高：该链 USDC 充足，可以安全存入
- Delta 低：该链 USDC 稀缺，可能无法提现（但手续费收益更高）

**策略**：
- Delta 高时存入（安全）
- Delta 低时等待平衡或选择其他链

---

## 📊 Stargate vs 其他跨链桥

| 跨链桥 | 技术 | 手续费 | 速度 | 流动性挖矿 |
|--------|------|--------|------|----------|
| Stargate | LayerZero | 0.06% | 即时 | 是（STG） |
| Hop Protocol | Rollup | 0.04% | 快 | 是（HOP） |
| Synapse | AMM | 0.05-0.1% | 快 | 是（SYN） |
| Across | Optimistic | 0.02-0.05% | 秒级 | 是（ACX） |
| Multichain | SMPC | 0.1% | 中 | 否 |

**Stargate 的优势**：
- 基于 LayerZero（技术先进）
- 即时跨链（无需等待）
- TVL 高（流动性好）
- STG 奖励丰厚

**Stargate 的劣势**：
- 手续费不是最低（0.06% vs Across 0.02%）
- 新协议，风险相对较高

---

## ❓ 常见问题

**Q1：Stargate 安全吗？**
> Stargate 基于 LayerZero，经过多次审计。但运营时间较短（2022年上线），建议分散资金。

**Q2：S*USDC 可以交易吗？**
> 可以。S*USDC 是 ERC20 代币，可以在 DEX 交易。但通常不建议（会损失收益）。

**Q3：如果 Arbitrum 的 USDC 池耗尽怎么办？**
> Stargate 的 Delta 算法会自动调整手续费（提高该链的手续费），吸引流动性回流。你可能需要等待几小时到几天。

**Q4：STG 奖励怎么领取？**
> 在"Pool"页面点击"Claim"。建议累积到 50-100 美元再领取（节省 Gas）。

**Q5：可以随时提取吗？**
> 可以，前提是该链的 USDC 池有足够流动性。如果 Delta 不平衡，可能需要等待。

**Q6：Stargate 会有 LayerZero 空投吗？**
> 可能。LayerZero 尚未发币，Stargate 用户有空投预期。但没有官方确认。

---

## ✅ 行动清单

- [ ] 准备 USDC 和 ETH（或直接在 Arbitrum 准备）
- [ ] 访问 stargate.finance，连接钱包
- [ ] 切换到 Arbitrum 网络
- [ ] 查看 USDC Pool 的 APY 和 TVL
- [ ] Approve + Add Liquidity
- [ ] 确认收到 S*USDC
- [ ] 设置提醒：每两周检查一次 APY 和 STG 奖励
- [ ] 定期领取并卖出 STG（或锁定为 veSTG）
- [ ] （可选）使用 Stargate 跨链，积累 LayerZero 空投资格
- [ ] （可选）分散到多条链（Polygon、BNB Chain）

---

## 🎓 总结

**Stargate Finance 的核心价值**：
1. **跨链需求增长**：多链时代，跨链需求持续增长
2. **低风险收益**：单币池，几乎无无常损失
3. **多重收益**：手续费 + STG 奖励 + 空投预期
4. **即时流动性**：随时可以提取（Delta 平衡时）

**适合人群**：
- 看好多链生态和跨链需求
- 持有稳定币，追求中等收益
- 愿意承担一定智能合约风险
- 关注 LayerZero 空投机会

**不适合人群**：
- DeFi 新手（建议先从 Aave 学起）
- 小额资金在以太坊主网（Gas 费太高）
- 完全无法接受跨链桥风险
- 需要保本保息的保守投资者

**一句话总结**：
> Stargate 是跨链时代的"高速公路收费站"，为流动性提供者带来稳定的手续费收入。

**下一步学习**：
- 研究 veSTG 锁仓机制
- 了解 LayerZero 空投策略
- 对比 Hop、Synapse、Across 等其他跨链桥
- 学习跨链套利（利用不同链的价差）

让你的 USDC 成为全链流动性提供者！🌉
`,

  steps: [
    { step_number: 1, title: '准备资金', description: '准备 USDC 和少量 ETH（或直接在 Arbitrum 准备）。', estimated_time: '15 分钟' },
    { step_number: 2, title: '添加流动性', description: '访问 stargate.finance，在 USDC Pool 添加流动性。', estimated_time: '15 分钟' },
    { step_number: 3, title: '获得 S*USDC', description: '确认收到 S*USDC，开始赚取手续费和 STG 奖励。', estimated_time: '5 分钟' },
    { step_number: 4, title: '监控和领取', description: '每两周检查 APY，定期领取 STG 奖励。', estimated_time: '10 分钟/次' },
    { step_number: 5, title: '（可选）优化', description: '质押 STG 为 veSTG，或分散到多条链。', estimated_time: '30 分钟' },
  ],
};

// ===== 上传逻辑 =====
async function getAuthToken() {
  const response = await axios.post(`${DIRECTUS_URL}/auth/login`, {
    email: 'the_uk1@outlook.com',
    password: 'Mygcdjmyxzg2026!',
  });
  return response.data.data.access_token;
}

async function addStrategies() {
  try {
    const token = await getAuthToken();
    const strategies = [STRATEGY_6_7, STRATEGY_6_8];

    console.log('\n开始创建 6.7 和 6.8 策略...\n');

    for (let i = 0; i < strategies.length; i++) {
      const strategy = {
        ...strategies[i],
        status: 'published',
        is_featured: false,
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
        }
      );

      console.log(`✅ [${i + 1}/2] ${strategy.title}`);
      console.log(`   ID: ${response.data.data.id}`);
      console.log(`   Slug: ${response.data.data.slug}\n`);
    }

    console.log('🎉 创建完成！');
    console.log('访问: http://localhost:3000/strategies?category=stablecoin-yield\n');
  } catch (error) {
    console.error('\n❌ 创建失败:', error.response?.data || error.message);
  }
}

addStrategies();