const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

// ===== 6.5 Bybit 余币宝活期 =====
const STRATEGY_6_5 = {
  title: 'Bybit 余币宝活期 - 一键开启闲置资金收益',
  slug: 'bybit-savings-flexible',
  summary: '使用 Bybit 余币宝功能，将闲置 USDT 转入活期理财，享受每日计息随存随取，操作极简的稳定币收益方案。',

  category: 'stablecoin-yield',
  category_l1: 'yield',
  category_l2: '稳定币理财',

  difficulty_level: 1,
  risk_level: 3,

  apy_min: 4,
  apy_max: 10,
  threshold_capital: '1 美元起',
  threshold_capital_min: 1,
  time_commitment: '10 分钟设置 + 自动运行',
  time_commitment_minutes: 10,
  threshold_tech_level: 'beginner',

  content: `> **适合人群**：Bybit 用户、追求极简操作、有闲置稳定币的所有人
> **阅读时间**：约 8 分钟
> **关键词**：Bybit / 余币宝 / 活期 / USDT / 随存随取 / 自动收益

---

## 🎯 什么是 Bybit 余币宝？

### 用大白话解释

想象一下：
- **普通钱包**：钱包里的 USDT 放着不动，没有任何收益
- **余币宝**：钱包余额自动转入"余币宝"，每天自动赚利息
- **类比**：就像支付宝的"余额宝"，但收益率更高（4-10% vs 1-2%）

### Bybit 余币宝特点

**1. 一键开启，全自动**
- 开启后，账户余额自动转入余币宝
- 每日自动计息
- 随时可用（交易、提现时自动转出）

**2. 零门槛**
- 最低 1 USDT 起
- 无需手动申购
- 无锁定期

**3. 高收益**
- USDT 活期：4-8% APY
- 其他币种：5-15% APY（BTC、ETH、BNB 等）

### 与 Binance 理财的区别

| 特性 | Bybit 余币宝 | Binance 活期理财 |
|------|-------------|-----------------|
| 操作方式 | 全自动（一键开启） | 手动申购 |
| 最低金额 | 1 USDT | 10 USDT |
| 灵活性 | 极高（交易时自动转出） | 高（需手动赎回） |
| USDT APY | 4-8% | 3-6% |
| 用户体验 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

**Bybit 余币宝的核心优势**：
- **无感操作**：开启后完全不用管，自动赚收益
- **交易无影响**：需要交易时自动转出，无需手动赎回
- **真正的"活期"**：比 Binance 活期更灵活

---

## 📋 准备工作（10 分钟）

### 第一步：注册 Bybit 账户

**如果你已有 Bybit 账户**（可跳过）：
- 直接登录即可

**如果你还没有 Bybit 账户**：
1. 访问 https://www.bybit.com
2. 点击"注册"
3. 输入邮箱/手机号
4. 设置密码
5. 完成邮箱/手机验证

**安全设置**：
1. 开启 2FA（Google Authenticator）
2. 完成 KYC 认证（身份验证）
   - 初级认证：提高提现额度
   - 高级认证：解锁更多功能

### 第二步：充值 USDT

**方式 1：法币购买**
1. 在 Bybit 点击"买币"
2. 选择 C2C 交易
3. 购买 USDT（选择信誉好的商家）
4. 完成支付

**方式 2：从其他交易所转入**
1. 在 Bybit 复制 USDT 充值地址
2. **注意**：选择正确的网络（推荐 TRC20，手续费低）
3. 从其他交易所提现到该地址
4. 等待到账（TRC20 约 1-3 分钟）

**推荐金额**：
- 最低：1 USDT（真的只要 1 美元即可开始）
- 推荐：100-10000 USDT

### 第三步：了解余币宝机制

**余币宝如何运作？**

1. **自动转入**
   - 开启余币宝后，统一账户中的闲置 USDT 自动转入
   - 每日 00:00 UTC 结算利息

2. **自动转出**
   - 当你需要交易、提现时，系统自动从余币宝转出
   - 无需手动操作

3. **利息计算**
   - 每日计息，次日到账
   - 复利（利息自动加入本金继续生息）

**示例**：
- 你有 1000 USDT 在账户中
- 开启余币宝（6% APY）
- 第 1 天：赚取 1000 × 6% / 365 = 0.164 USDT
- 第 2 天：赚取 1000.164 × 6% / 365 = 0.164 USDT
- ...
- 一年后：约 1061.8 USDT（复利效果）

---

## 🚀 操作步骤（仅需 3 分钟）

### 步骤 1：登录 Bybit

1. 访问 https://www.bybit.com
2. 登录账户
3. 完成 2FA 验证

### 步骤 2：开启余币宝

**方法 1：从资产页面开启**

1. 点击右上角"资产"
2. 选择"统一账户"
3. 找到"余币宝"板块
4. 点击"立即开启"或"管理"

**方法 2：从理财页面开启**

1. 点击顶部菜单"理财"
2. 选择"余币宝"
3. 点击"一键开启"

### 步骤 3：选择币种

**界面示例**：

余币宝设置
┌──────────────────────────────┐
│ 币种      | 当前 APY | 状态   │
├──────────────────────────────┤
│ USDT      | 6.5%    | [开启] │
│ USDC      | 5.8%    | [ ]    │
│ BTC       | 3.2%    | [ ]    │
│ ETH       | 4.1%    | [ ]    │
│ BNB       | 8.5%    | [ ]    │
└──────────────────────────────┘


1. 勾选 USDT（或其他你持有的币种）
2. 点击"确认"
3. 完成！

**注意**：
- 你可以同时开启多个币种的余币宝
- 每个币种的 APY 不同且实时变化

### 步骤 4：验证收益

**第二天检查**：
1. 进入"资产" → "理财账户"
2. 查看"余币宝收益"
3. 应该能看到昨日收益（如 0.164 USDT）

**界面示例**：

余币宝收益记录
┌──────────┬──────────┬─────────┐
│ 日期     │ 币种     │ 收益    │
├──────────┼──────────┼─────────┤
│ 2024-01-15 │ USDT   │ 0.164   │
│ 2024-01-14 │ USDT   │ 0.163   │
│ 2024-01-13 │ USDT   │ 0.162   │
└──────────┴──────────┴─────────┘


---

## 💰 成本与收益

### 成本分析

| 成本项 | 金额 |
|--------|------|
| 注册费用 | 0 元 |
| 充值手续费 | 0-1 USDT（取决于网络） |
| 余币宝费用 | 0 元 |
| 提现手续费 | 0.8 USDT（TRC20） |
| **总成本** | **< 2 USDT** |

### 收益计算

**示例 1：1000 USDT，6% APY，持有 1 年**
- 日收益：1000 × 6% / 365 = 0.164 USDT
- 月收益：约 5 USDT
- 年收益：约 61.8 USDT（含复利）
- **净收益率**：6.18%

**示例 2：100 USDT，6% APY，持有 1 个月**
- 月收益：100 × 6% / 12 = 0.5 USDT
- **净收益率**：0.5%

**示例 3：10000 USDT，8% APY，持有 1 年**
- 年收益：约 832 USDT
- **净收益率**：8.32%

**对比传统理财**：
- 银行活期：0.01-0.3% APY
- 银行定期：1-3% APY
- Bybit 余币宝：4-10% APY（是传统银行的 5-30 倍）

---

## ⚠️ 风险与注意事项

### 主要风险

1. **平台风险**
   - 资金托管在 Bybit（中心化交易所）
   - 如果 Bybit 倒闭、被黑客攻击，资金可能损失
   - **应对**：不要把全部资金放在 Bybit，分散到多个平台

2. **利率波动**
   - 余币宝 APY 不固定，每日调整
   - 熊市时可能从 8% 降至 4%
   - **应对**：接受浮动利率，或在利率高时转为定期

3. **提现限制**
   - 大额提现可能需要额外审核
   - 部分国家/地区可能限制提现
   - **应对**：了解当地政策，分批提现

4. **稳定币风险**
   - USDT 本身可能脱锚
   - **应对**：分散到 USDC、DAI 等其他稳定币

5. **监管风险**
   - 加密货币交易所面临各国监管
   - **应对**：关注政策动态

### 安全清单

- ✅ 开启 2FA 双重验证
- ✅ 定期更换密码
- ✅ 不要在公共 WiFi 下登录
- ✅ 警惕钓鱼网站（确保是 bybit.com）
- ✅ 不要相信"客服"私信
- ✅ 大额资金考虑使用硬件钱包

---

## 🔥 进阶技巧

### 技巧 1：组合余币宝 + 定期

**策略**：
- 50% 资金放余币宝（灵活）
- 50% 资金锁定期（更高 APY）

**示例**：
- 10000 USDT：
  - 5000 USDT 余币宝（6% APY）
  - 5000 USDT 锁定 90天（10% APY）
- 平均 APY：8%
- 同时保持一定流动性

### 技巧 2：多币种余币宝

**策略**：
- 不仅开启 USDT 余币宝
- 也开启 BTC、ETH、BNB 等其他币种
- 让所有闲置资产都产生收益

**注意**：
- 非稳定币余币宝有价格波动风险
- 适合长期持有者

### 技巧 3：利用"闪兑"优化收益

**策略**：
1. 监控不同稳定币的余币宝 APY
2. 当 USDC APY 高于 USDT 时，使用"闪兑"将 USDT 换成 USDC
3. 享受更高收益

**示例**：
- USDT 余币宝：6% APY
- USDC 余币宝：7.5% APY
- 操作：USDT → 闪兑 → USDC（滑点约 0.1%）
- 额外收益：1.5% - 0.1% = 1.4%

### 技巧 4：结合合约交易资金管理

**如果你玩合约**：
- 开启余币宝后，保证金闲置时也能赚利息
- 需要开仓时，系统自动从余币宝转出
- 平仓后，资金又自动转回余币宝

**优势**：
- 资金利用率 100%
- 无需手动管理

---

## 📊 Bybit vs 其他平台

| 平台 | 活期方式 | USDT APY | 操作难度 | 灵活性 |
|------|---------|---------|---------|--------|
| Bybit 余币宝 | 全自动 | 4-8% | 极简 ⭐⭐⭐⭐⭐ | 极高 |
| Binance 活期 | 手动申购 | 3-6% | 简单 ⭐⭐⭐⭐ | 高 |
| OKX 余币宝 | 全自动 | 3-7% | 极简 ⭐⭐⭐⭐⭐ | 极高 |
| Aave（DeFi） | 链上存款 | 2-5% | 复杂 ⭐⭐ | 极高 |

**Bybit 余币宝的独特优势**：
1. **真正的"一键开启"**：比 Binance 更简单
2. **交易无感**：合约交易者的福音
3. **APY 相对较高**：4-8% vs Binance 3-6%

---

## ❓ 常见问题

**Q1：开启余币宝后，我的 USDT 还能用来交易吗？**
> 能！需要交易时，系统自动从余币宝转出。你完全感觉不到差异。

**Q2：利息什么时候到账？**
> 每天 00:00 UTC 结算昨日利息，次日到账。

**Q3：可以关闭余币宝吗？**
> 可以随时关闭。关闭后，余币宝中的资金会转回统一账户。

**Q4：余币宝有风险吗？**
> 有。主要是平台风险（Bybit 倒闭或被黑客攻击）。但相比 DeFi，智能合约风险更低。

**Q5：为什么 APY 每天都在变？**
> 余币宝 APY 是浮动的，取决于 Bybit 的资金借贷需求。牛市时需求高，APY 高；熊市时相反。

**Q6：最低需要多少 USDT？**
> 理论上 1 USDT 即可，但建议至少 10 USDT 以上才有明显收益。

**Q7：余币宝和定期理财哪个好？**
> 取决于你的需求：
> - 需要灵活性 → 余币宝
> - 确定短期不用 → 定期（APY 更高）
> - 推荐组合使用

---

## ✅ 行动清单

- [ ] 注册 Bybit 账户（如果还没有）
- [ ] 完成 KYC 认证
- [ ] 开启 2FA 双重验证
- [ ] 充值 USDT 到 Bybit
- [ ] 进入"理财" → "余币宝"
- [ ] 一键开启 USDT 余币宝
- [ ] 第二天检查收益
- [ ] （可选）开启其他币种余币宝
- [ ] （可选）结合定期理财提高整体收益

---

## 🎓 总结

**Bybit 余币宝的核心价值**：
1. **极简操作**：一键开启，全自动运行
2. **零门槛**：1 USDT 起，人人可参与
3. **高灵活性**：随存随取，交易时自动转出
4. **稳定收益**：4-10% APY，远超传统银行

**适合人群**：
- 所有 Bybit 用户（强烈推荐开启）
- 追求极简操作的懒人
- 合约交易者（保证金闲置也能生息）
- 有闲置稳定币的任何人

**不适合人群**：
- 极度重视去中心化的用户
- 所在地区限制使用 Bybit
- 无法接受中心化平台风险

**一句话总结**：
> Bybit 余币宝是"最无脑"的稳定币理财方案，开启即赚，适合所有人。

**下一步学习**：
- 尝试 Bybit 定期理财（锁定更高 APY）
- 了解 Bybit Launchpad（质押挖新币）
- 对比 OKX 余币宝（另一个优秀方案）

让你的 USDT 不再"闲置"，每天自动赚利息！💰
`,

  steps: [
    { step_number: 1, title: '注册并充值', description: '注册 Bybit 账户，完成 KYC，充值 USDT。', estimated_time: '15 分钟' },
    { step_number: 2, title: '一键开启余币宝', description: '进入理财页面，点击"一键开启"USDT 余币宝。', estimated_time: '1 分钟' },
    { step_number: 3, title: '验证收益', description: '第二天检查余币宝收益记录。', estimated_time: '2 分钟' },
    { step_number: 4, title: '（可选）优化配置', description: '开启其他币种余币宝，或结合定期理财。', estimated_time: '10 分钟' },
  ],
};

// ===== 6.6 Yearn Finance 稳定币策略 =====
const STRATEGY_6_6 = {
  title: 'Yearn Finance 稳定币策略 - DeFi 自动化收益聚合器',
  slug: 'yearn-finance-stablecoin-vault',
  summary: '将稳定币存入 Yearn Finance Vault，自动优化收益策略，赚取最优 APY，免去手动复利和策略切换的繁琐操作。',

  category: 'stablecoin-yield',
  category_l1: 'yield',
  category_l2: '稳定币理财',

  difficulty_level: 3,
  risk_level: 3,

  apy_min: 3,
  apy_max: 15,
  threshold_capital: '500 美元起',
  threshold_capital_min: 500,
  time_commitment: '2 小时设置 + 每月 15 分钟监控',
  time_commitment_minutes: 135,
  threshold_tech_level: 'intermediate',

  content: `> **适合人群**：了解 DeFi、追求最优收益、愿意承担一定智能合约风险的用户
> **阅读时间**：约 15 分钟
> **关键词**：Yearn Finance / Vault / 自动化 / 收益聚合 / 稳定币 / 复利

---

## 🎯 什么是 Yearn Finance？

### 用大白话解释

想象一下：
- **手动 DeFi**：你要自己在 Aave、Curve、Compound 之间切换，哪个利率高就去哪个
- **Yearn Finance**：你把钱存入 Yearn，它自动帮你找最高收益的地方，自动切换、自动复利
- **类比**：Yearn 就像"DeFi 基金经理"，帮你管理资金获取最优收益

### Yearn Finance 核心概念

**1. Vault（金库）**
- Vault 是 Yearn 的核心产品
- 每个 Vault 对应一种资产（如 USDC Vault、DAI Vault）
- 你存入资产，Vault 自动执行收益策略

**2. 自动化策略**
Yearn 的策略包括：
- 在 Aave/Compound 之间切换（选择利率高的）
- 自动领取奖励代币（如 CRV、COMP）
- 自动卖出奖励换成本金
- 自动复投（复利最大化）

**3. yToken**
- 存入 Vault 后，你会收到 yToken（如 yvUSDC）
- yToken 代表你在 Vault 中的份额
- yToken 的价值会随时间增长（收益体现在价格上）

### Yearn 的优势

1. **自动优化**
   - 无需手动切换协议
   - 专业策略师团队管理

2. **Gas 费节省**
   - 多人资金聚合，Gas 分摊
   - 你只需支付存入/提取时的 Gas

3. **复利效果**
   - 每天自动复投
   - 长期收益显著高于手动

4. **透明度**
   - 所有策略开源
   - 链上可查，资金流向透明

**真实案例**：
- 2024年初 USDC Vault APY：4-8%
- 2021年牛市：部分 Vault APY 高达 30-50%（DeFi 流动性挖矿热潮）
- 2023年熊市：APY 降至 3-6%（但仍高于单纯存款）

---

## 📋 准备工作（30 分钟）

### 第一步：理解 Yearn 的风险

**使用 Yearn 前，必须了解的风险**：

1. **智能合约风险**
   - Yearn 使用多个智能合约
   - 虽然经过审计，但仍可能有漏洞
   - **历史**：2021年 Yearn 某个 Vault 曾被攻击，损失 1100万美元

2. **策略风险**
   - Yearn 的策略可能失败
   - 例如：策略依赖的协议出问题，导致亏损

3. **无常损失**（部分 Vault）
   - 部分 Vault 涉及 LP Token，有无常损失
   - 稳定币 Vault 通常无常损失极低

4. **Gas 费高**
   - 以太坊主网 Gas 费高（存取可能各需 20-50 美元）
   - 建议大额使用或等待 Gas 低谷

**应对**：
- 不要投入全部资金
- 选择 TVL 大、运营时间长的 Vault
- 使用 Arbitrum/Optimism 等 L2（Gas 低）

### 第二步：准备钱包和稳定币

**1. 准备 MetaMask**
- 确保钱包中有稳定币（USDC/DAI/USDT）
- 准备 ETH 作为 Gas 费（0.03-0.05 ETH）

**2. 选择稳定币 Vault**

Yearn 主流稳定币 Vault：

| Vault | 策略类型 | 预期 APY | 风险 |
|-------|---------|---------|------|
| yvUSDC | Aave/Compound 切换 + Curve | 3-8% | 低 |
| yvDAI | MakerDAO DSR + Curve | 3-7% | 低 |
| yvUSDT | 借贷优化 | 3-6% | 低 |
| yvcrvUSDC（Curve LP） | Curve 3pool + Convex | 5-12% | 中（有小额 IL） |

**新手推荐**：yvUSDC（最稳健）

**3. 选择网络**

Yearn 支持的网络：

| 网络 | Gas 费 | Vault 数量 | 推荐度 |
|------|--------|-----------|--------|
| 以太坊主网 | 高（20-50 美元） | 最多 | ⭐⭐⭐⭐（大额） |
| Arbitrum | 低（1-3 美元） | 中 | ⭐⭐⭐⭐⭐（小额） |
| Optimism | 低（1-3 美元） | 中 | ⭐⭐⭐⭐ |
| Polygon | 极低（0.1 美元） | 少 | ⭐⭐⭐ |

**新手推荐**：Arbitrum（Gas 低，Vault 选择多）

---

## 🚀 操作步骤（以太坊主网为例）

### 步骤 1：访问 Yearn 应用

1. 访问 Yearn 官网：https://yearn.fi
2. 点击右上角"Connect Wallet"
3. 选择 MetaMask
4. 确认连接

**安全提示**：
- ✅ 确保网址是 yearn.fi 或 yearn.finance
- ✅ Yearn 有很多仿盘，务必通过官方链接访问

### 步骤 2：选择 Vault

1. 在主页点击"Vaults"
2. 找到"Stablecoins"（稳定币）板块
3. 选择 yvUSDC（或其他稳定币 Vault）

**界面示例**：

yvUSDC Vault
┌────────────────────────────────┐
│ TVL: $350,000,000              │
│ Net APY: 5.42%                 │
│ Historical APY: 4.8% (30d avg) │
│                                │
│ Strategy: Aave + Curve + Convex│
│ Risk Score: 2/5 (Low)          │
└────────────────────────────────┘


**重点关注**：
- **Net APY**：扣除 Gas 和费用后的净收益率
- **TVL**：总锁仓量（越大越安全）
- **Strategy**：当前使用的策略
- **Risk Score**：风险评分（1-5，1 最安全）

### 步骤 3：存入资金

1. 点击"Deposit"
2. 输入你要存入的 USDC 数量（或点击"Max"）
3. 查看你将收到的 yvUSDC 数量

**界面示例**：

Deposit USDC
┌────────────────────────────────┐
│ Amount: [1000.00] USDC   [Max] │
│                                │
│ You will receive:              │
│ ~972.34 yvUSDC                 │
│ (1 yvUSDC = 1.0284 USDC)       │
│                                │
│ Gas估算: 0.012 ETH (~$24)      │
└────────────────────────────────┘


**注意**：
- yvUSDC 和 USDC 的兑换比率不是 1:1
- 兑换比率会随时间增长（收益体现在此）

4. 点击"Deposit"

### 步骤 4：授权和确认

**首次存入需要两步**：

1. **Approve（授权）**
   - MetaMask 弹出授权请求
   - 授权 Yearn 合约使用你的 USDC
   - 确认（支付 Gas 约 10-20 美元）

2. **Deposit（存款）**
   - 授权完成后，再次点击"Deposit"
   - MetaMask 弹出交易确认
   - 确认（支付 Gas 约 15-30 美元）

3. 等待交易确认（1-3 分钟）

### 步骤 5：确认并监控

**确认成功**：
1. 刷新页面
2. 在"Your Deposits"（你的存款）板块看到 yvUSDC
3. 你的钱包中也会有 yvUSDC 代币

**监控收益**：
- Yearn 界面会显示你的当前价值（实时更新）
- 收益体现在 yvUSDC 对 USDC 的汇率增长上

**示例**：
- 存入时：1000 USDC → 972.34 yvUSDC（汇率 1.0284）
- 30天后：972.34 yvUSDC = 1004.5 USDC（汇率 1.0331）
- 收益：4.5 USDC（月化 0.45%）

---

## 💰 成本与收益

### 成本分析（以太坊主网）

| 成本项 | 金额 |
|--------|------|
| Approve Gas | 10-20 美元 |
| Deposit Gas | 15-30 美元 |
| Withdraw Gas | 15-30 美元 |
| Vault 管理费 | 2%（从收益中扣除，非固定费用） |
| Vault 性能费 | 20%（收益的 20% 作为协议费用） |
| **总成本（首次）** | **40-80 美元 + 费用** |

**费用说明**：
- **管理费 2%**：从 Vault 总资产中扣除（年化）
- **性能费 20%**：从 Vault 产生的收益中扣除
- 例如：Vault 赚取 10% 毛收益 → 扣 2% 管理费 → 剩 8% → 扣 20% 性能费（1.6%）→ 你实际获得 6.4% APY

### 收益计算

**示例 1：1000 USDC，持有 1 年，5.4% Net APY**
- 毛收益：Vault 策略赚取约 9%
- 扣费后：5.4%（Net APY 已扣除所有费用）
- 你的收益：1000 × 5.4% = 54 USDC
- 减去 Gas：54 - 50 = 4 USDC
- **净收益率**：0.4%（第一年，Gas 太高）

**示例 2：10000 USDC，持有 1 年，5.4% Net APY**
- 收益：540 USDC
- 减去 Gas：540 - 50 = 490 USDC
- **净收益率**：4.9%

**示例 3：10000 USDC，Arbitrum，6.5% Net APY**
- 收益：650 USDC
- 减去 Gas（Arbitrum）：650 - 3 = 647 USDC
- **净收益率**：6.47%

**结论**：
- 主网适合大额（5000 美元+）
- L2 适合小额（500-5000 美元）
- Yearn 的优势在于长期持有（复利效果）

---

## ⚠️ 风险与注意事项

### 主要风险

1. **智能合约风险**
   - Yearn 涉及多个智能合约（Vault + 策略合约）
   - **历史攻击**：2021年 DAI Vault 被攻击，损失 1100万美元（后来通过保险赔付）
   - **应对**：选择 TVL 大、审计多的 Vault

2. **策略失败风险**
   - 策略依赖的协议可能出问题
   - 例如：策略使用了 Curve，如果 Curve 被攻击，Yearn 也受影响
   - **应对**：分散资金，不要全仓 Yearn

3. **Gas 费风险**
   - 主网 Gas 暴涨时，提取成本很高
   - **应对**：使用 L2，或在 Gas 低谷期提取

4. **费用侵蚀收益**
   - 2% 管理费 + 20% 性能费会显著降低收益
   - 熊市时，扣费后 APY 可能只有 2-3%
   - **应对**：只在牛市或高 APY 时使用 Yearn

5. **提取延迟**
   - 部分 Vault 提取时可能有延迟（策略需要赎回资产）
   - **应对**：不要投入急需使用的资金

### 安全清单

- ✅ 仅在官方网站（yearn.fi）操作
- ✅ 阅读 Vault 的策略说明和风险评分
- ✅ 不要投入全部资金
- ✅ 定期检查 Vault 的 TVL 和 APY 变化
- ✅ 使用 Zapper/DeBank 追踪 Vault 表现

---

## 🔥 进阶技巧

### 技巧 1：选择高 APY 的 Vault

**策略**：
- Yearn 有几十个 Vault，APY 差异很大
- 定期（每月）检查不同 Vault 的 APY
- 切换到 APY 更高的 Vault（但要考虑 Gas 费）

**工具**：
- https://yearn.watch（Yearn 数据面板）
- DefiLlama（对比 Yearn 和其他协议）

### 技巧 2：使用 Zapper 简化操作

**Zapper.fi 是什么？**
- Zapper 是 DeFi 聚合入口
- 可以一键存入 Yearn Vault
- 支持用任意代币存入（自动兑换）

**操作**：
1. 访问 https://zapper.fi
2. 连接钱包
3. 搜索"Yearn yvUSDC"
4. 点击"Invest"
5. 选择你要用的代币（如 ETH）
6. Zapper 自动兑换成 USDC 并存入 Vault

### 技巧 3：在 L2 使用 Yearn

**Arbitrum Yearn**：
1. 访问 https://yearn.fi
2. 切换网络到 Arbitrum
3. 找到 Arbitrum 上的 Vault
4. Gas 仅需 1-3 美元（vs 主网 40-80 美元）

**注意**：
- Arbitrum 上的 Vault 选择较少
- 但 Gas 节省足以弥补

### 技巧 4：使用 yvToken 作为抵押

**高级策略**：
- yvUSDC 可以在部分协议作为抵押品
- 例如：在 Abracadabra 用 yvUSDC 抵押借出 MIM
- 这样你既赚 Yearn 收益，又能借出资金再投资

**风险**：
- 增加了杠杆风险
- 仅适合高级玩家

---

## 📊 Yearn vs 其他方案

| 方案 | APY | 自动化 | Gas 费 | 风险 | 难度 |
|------|-----|--------|--------|------|------|
| Yearn Vault | 3-15% | 全自动 | 高（主网） | 中 | 中 |
| Aave 存款 | 2-5% | 手动 | 中 | 低 | 低 |
| Curve 3pool | 3-10% | 手动复利 | 高 | 低 | 中 |
| Binance 理财 | 5-10% | 自动 | 无 | 中（中心化） | 低 |

**Yearn 的优势**：
- 完全自动化（不需要手动复利、切换协议）
- 专业策略师管理
- 长期复利效果显著

**Yearn 的劣势**：
- 主网 Gas 费高
- 费用高（2% + 20%）
- 智能合约风险

---

## ❓ 常见问题

**Q1：Yearn 安全吗？**
> Yearn 经过多次审计，是 DeFi 蓝筹协议。但曾发生过攻击事件（2021年 DAI Vault）。建议分散资金，不要全仓。

**Q2：为什么 yvUSDC 的数量比 USDC 少？**
> yvUSDC 的价格 > 1 USDC。收益体现在 yvUSDC 对 USDC 的汇率增长上，而非数量增长。

**Q3：我可以随时提取吗？**
> 大部分 Vault 可以随时提取，但部分策略可能有延迟（需要从底层协议赎回）。

**Q4：Yearn 的费用太高了，值得吗？**
> 取决于你的情况：
> - 大额 + 长期持有 → 值得（自动化省时间）
> - 小额 + 短期 → 不值得（费用侵蚀收益）

**Q5：Yearn 和 Convex 什么关系？**
> Convex 是专门优化 Curve 收益的协议。很多 Yearn Vault 会使用 Convex 作为策略之一。

**Q6：历史 APY 和实际 APY 为什么不一样？**
> APY 是浮动的。历史 APY 是过去 30天平均值，实际 APY 每天都在变化。

---

## ✅ 行动清单

- [ ] 准备 MetaMask 钱包和稳定币
- [ ] 准备 ETH 作为 Gas 费（或选择 Arbitrum）
- [ ] 访问 yearn.fi 并连接钱包
- [ ] 研究不同 Vault 的 APY 和风险评分
- [ ] 选择 yvUSDC（新手推荐）
- [ ] Approve + Deposit 存入资金
- [ ] 确认收到 yvUSDC
- [ ] 设置提醒：每月检查一次 Vault 表现
- [ ] （可选）使用 Zapper 简化操作
- [ ] （可选）迁移到 Arbitrum 降低 Gas

---

## 🎓 总结

**Yearn Finance 的核心价值**：
1. **完全自动化**：无需手动复利、切换协议
2. **专业管理**：策略师团队优化收益
3. **长期复利**：时间越长，复利效果越显著
4. **透明开源**：所有策略链上可查

**适合人群**：
- 了解 DeFi，愿意承担智能合约风险
- 追求最优收益，不想手动操作
- 大额资金（5000 美元+）或使用 L2
- 长期持有者（1 年+）

**不适合人群**：
- DeFi 新手（建议先从 Aave 学起）
- 小额资金在主网（Gas 费太高）
- 短期持有（费用会侵蚀收益）
- 无法接受智能合约风险

**一句话总结**：
> Yearn Finance 是"DeFi 懒人神器"，适合追求最优收益且愿意承担一定风险的长期持有者。

**下一步学习**：
- 研究 Yearn 的具体策略（如 Curve + Convex）
- 学习 Convex Finance（Curve 收益优化器）
- 了解其他聚合器（Beefy、Harvest）

让 Yearn 成为你的"DeFi 基金经理"！🏦
`,

  steps: [
    { step_number: 1, title: '准备钱包和稳定币', description: '准备 MetaMask、USDC 和 ETH（Gas 费）。', estimated_time: '20 分钟' },
    { step_number: 2, title: '研究 Vault', description: '在 yearn.fi 研究不同 Vault 的 APY、策略和风险。', estimated_time: '30 分钟' },
    { step_number: 3, title: '存入资金', description: 'Approve + Deposit，确认收到 yvToken。', estimated_time: '20 分钟' },
    { step_number: 4, title: '监控表现', description: '每月检查 Vault APY 和收益，必要时切换。', estimated_time: '15 分钟/月' },
    { step_number: 5, title: '（可选）优化', description: '迁移到 L2、使用 Zapper、或组合其他策略。', estimated_time: '30 分钟' },
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
    const strategies = [STRATEGY_6_5, STRATEGY_6_6];

    console.log('\n开始创建 6.5 和 6.6 策略...\n');

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