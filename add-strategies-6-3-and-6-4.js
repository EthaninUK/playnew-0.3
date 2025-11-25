const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

// ===== 6.3 Curve 3pool 低滑点收益 =====
const STRATEGY_6_3 = {
  title: 'Curve 3pool 低滑点收益 - 稳定币流动性之王',
  slug: 'curve-3pool-low-slippage-yield',
  summary: '在 Curve 3pool (USDT/USDC/DAI) 提供流动性，赚取交易手续费和 CRV 奖励，享受极低无常损失和稳定收益。',

  category: 'stablecoin-yield',
  category_l1: 'yield',
  category_l2: 'stablecoin',

  difficulty_level: 3,
  risk_level: 2,

  apy_min: 2,
  apy_max: 10,
  threshold_capital: '500 美元起',
  threshold_capital_min: 500,
  time_commitment: '2 小时设置 + 每周 15 分钟监控',
  time_commitment_minutes: 135,
  threshold_tech_level: 'intermediate',

  content: `> **适合人群**：持有多种稳定币、追求低风险高收益、愿意学习 AMM 机制的用户
> **阅读时间**：约 15 分钟
> **关键词**：Curve / 3pool / 流动性 / 低滑点 / CRV / 无常损失

---

## 🎯 什么是 Curve 3pool？

### 用大白话解释

想象一下：
- **传统兑换**：你去银行把美元换成欧元，银行收 1-3% 手续费
- **Curve 3pool**：三种稳定币（USDT/USDC/DAI）在一个"资金池"里自动兑换
- **你的角色**：往池子里放钱，每次有人兑换就给你分手续费

### Curve Finance 是什么？

Curve 是**稳定币交易的首选 DEX**：
- **TVL**：30-50 亿美元（2024年数据）
- **核心优势**：极低滑点（0.01-0.04%），专为稳定币优化
- **地位**：稳定币兑换量占 DeFi 总量的 50%+

### 什么是 3pool？

**3pool 是 Curve 最大的流动性池**：
- **组成**：USDT + USDC + DAI（三种主流稳定币）
- **比例**：大约 1:1:1（自动平衡）
- **规模**：10-20 亿美元 TVL（Curve 最大的池）

### 为什么选择 3pool？

1. **无常损失极低**
   - 三种币都是稳定币（锚定 $1）
   - 价格波动极小（0.98-1.02 美元）
   - 几乎没有无常损失（IL < 0.1%）

2. **交易量大**
   - 每天数亿美元的交易量
   - 手续费收入稳定

3. **流动性好**
   - 随时可以退出
   - 滑点极低

4. **多重收益**
   - 交易手续费（0.04%）
   - CRV 代币奖励
   - 额外激励（如 Convex 的 CVX）

**真实案例**：
- 2023年平均 APY：3-6%（基础手续费 + CRV）
- 2021年牛市：APY 高达 15-30%（交易量暴增）
- 2024年初：APY 约 4-8%（相对稳定）

---

## 📋 准备工作（30 分钟）

### 第一步：准备资金

**你需要准备**：
1. **三种稳定币之一**（或混合）
   - USDT：最常见，流动性最好
   - USDC：透明度高，合规性强
   - DAI：去中心化稳定币

   **建议**：如果只有一种，存入时会自动换成三种（但有小额滑点）

2. **ETH 作为 Gas 费**
   - 主网：0.02-0.05 ETH（约 40-100 美元，取决于 Gas 价格）
   - 或使用 Polygon/Arbitrum（Gas 仅 0.1-1 美元）

**推荐金额**：
- 最低：500 美元（低于此 Gas 费占比过高）
- 推荐：2000-10000 美元（收益更可观）

### 第二步：了解收益构成

**你的收益来自三部分**：

1. **交易手续费**（基础收益）
   - Curve 3pool 的交易手续费：0.04%
   - 分配给流动性提供者：100%
   - 预估 APY：1-3%（取决于交易量）

2. **CRV 代币奖励**
   - Curve 会奖励流动性提供者 CRV 代币
   - 预估 APY：1-4%（取决于 CRV 价格）

3. **额外激励**（可选）
   - 通过 Convex Finance 可以获得额外 CVX 奖励
   - 预估额外 APY：1-3%

**总收益**：3-10% APY（正常市场）

### 第三步：选择网络

Curve 3pool 支持多链：

| 网络 | Gas 费 | 流动性 | 推荐度 |
|------|--------|--------|--------|
| 以太坊主网 | 高（20-50 美元） | 极高 | ⭐⭐⭐⭐⭐（大额） |
| Polygon | 极低（0.1 美元） | 中 | ⭐⭐⭐⭐（小额） |
| Arbitrum | 低（1-3 美元） | 中 | ⭐⭐⭐⭐ |

**新手推荐**：Polygon（Gas 低，适合学习）

---

## 🚀 操作步骤（以太坊主网为例）

### 步骤 1：访问 Curve 应用

1. 访问 Curve 官网：https://curve.fi
2. 点击右上角"Connect Wallet"
3. 选择 MetaMask
4. 确认连接

**安全提示**：

- ✅ Curve 有很多仿盘网站，务必从官方渠道访问

### 步骤 2：找到 3pool

1. 在主页搜索框输入"3pool"
2. 或在"Pools"列表中找到"3Pool"（USDT/USDC/DAI）
3. 点击进入

**界面示例**：

3Pool (USDT/USDC/DAI)
┌────────────────────────────────┐
│ TVL: $1,500,000,000            │
│ Volume (24h): $150,000,000     │
│ Base APY: 2.15%                │
│ Rewards APY: 3.25% (CRV)       │
│ Total APY: 5.40%               │
└────────────────────────────────┘


### 步骤 3：存入流动性

**方式 1：均衡存入（推荐）**

1. 点击"Deposit"选项卡
2. 如果你有三种稳定币，分别输入数量
   - 例如：333 USDT + 333 USDC + 334 DAI = 1000 美元
3. Curve 会显示"Balanced"（平衡）
4. 这种方式滑点最低（几乎为 0）

**方式 2：单币存入**

1. 只输入一种稳定币（如 1000 USDC）
2. Curve 会自动将其分配为三种币
3. 会有小额滑点（通常 < 0.1%）

**步骤**：
1. 输入金额
2. 查看"You will receive"（你将收到的 LP Token）
3. 点击"Deposit"

### 步骤 4：授权和确认

**首次操作需要多次授权**（每种稳定币都要授权）：

1. **Approve USDT**
   - MetaMask 弹出授权请求
   - 确认（支付 Gas 约 5-10 美元）

2. **Approve USDC**（如果存入）
   - 重复上述步骤

3. **Approve DAI**（如果存入）
   - 重复上述步骤

4. **Deposit（存款）**
   - 所有代币授权完成后
   - 点击"Deposit"
   - 确认交易（支付 Gas 约 10-20 美元）

### 步骤 5：获得 LP Token

1. 交易确认后（1-3 分钟）
2. 你的钱包会收到 **3CRV** 代币
3. 3CRV 是你的流动性提供凭证
4. 3CRV 的数量会缓慢增长（交易手续费累积）

---

## 💰 成本与收益

### 成本分析（以太坊主网）

| 成本项 | 金额 |
|--------|------|
| Approve USDT Gas | 5-10 美元 |
| Approve USDC Gas | 5-10 美元 |
| Approve DAI Gas | 5-10 美元 |
| Deposit Gas | 10-20 美元 |
| Withdraw Gas | 10-20 美元 |
| **总成本（首次）** | **35-70 美元** |

**省 Gas 技巧**：
- 如果只存一种稳定币，只需授权一次（节省 10-20 美元）
- 使用 Polygon，总成本仅 0.5-1 美元

### 收益计算

**示例 1：1000 美元，持有 1 年，5.4% APY**
- 手续费收入：1000 × 2.15% = 21.5 美元
- CRV 奖励：1000 × 3.25% = 32.5 美元
- 总收益：54 美元
- 减去 Gas（主网）：54 - 50 = 4 美元
- **净收益率**：0.4%（第一年，Gas 太高）

**示例 2：10000 美元，持有 1 年，5.4% APY**
- 总收益：540 美元
- 减去 Gas：540 - 50 = 490 美元
- **净收益率**：4.9%

**示例 3：1000 美元，Polygon，6% APY**
- 总收益：60 美元
- 减去 Gas：60 - 1 = 59 美元
- **净收益率**：5.9%

**结论**：
- 主网适合大额（5000 美元+）
- Polygon 适合小额（500-5000 美元）
- 建议持有 1 年以上，分摊 Gas

---

## ⚠️ 风险与注意事项

### 主要风险

1. **无常损失（IL）**
   - 虽然三种都是稳定币，但仍可能有微小 IL
   - 例如：DAI 短期脱锚至 $0.98，你的 LP 价值会略微下降
   - **风险程度**：极低（< 0.5%）

2. **稳定币脱锚风险**
   - 如果 USDT/USDC/DAI 其中一个严重脱锚（如跌至 $0.80）
   - 你的 LP 会包含更多脱锚的币（被"套牢"）
   - **历史案例**：2023年 USDC 短期脱锚至 $0.90（SVB 事件）
   - **应对**：分散资金，不要全仓 3pool

3. **智能合约风险**
   - Curve 虽然久经考验，但仍可能有漏洞
   - **历史**：2023年7月 Curve 曾遭受攻击（但 3pool 未受影响）
   - **应对**：不要投入全部资金

4. **CRV 价格波动**
   - CRV 奖励的价值取决于 CRV 币价
   - 如果 CRV 价格下跌 50%，实际收益会减少
   - **应对**：定期卖出 CRV，锁定收益

5. **提款时滑点**
   - 如果 3pool 不平衡（如 USDT 占比 60%），提款时可能有滑点
   - **应对**：选择"Withdraw balanced"（平衡提款）

### 安全清单

- ✅ 仅在官方网站（curve.fi）操作
- ✅ 定期检查授权合约（使用 Revoke.cash）
- ✅ 不要一次性投入全部资金
- ✅ 定期领取并卖出 CRV（锁定收益）
- ✅ 关注稳定币新闻（如 USDC 监管、USDT 审计）

---

## 🔥 进阶技巧

### 技巧 1：使用 Convex Finance 增强收益

**Convex 是什么？**
- Convex 是 Curve 的"收益聚合器"
- 将 3CRV 存入 Convex，可以获得额外 CVX 奖励

**操作流程**：
1. 在 Curve 获得 3CRV
2. 访问 https://www.convexfinance.com
3. 找到"3pool"
4. 点击"Deposit"
5. 存入 3CRV
6. 获得额外 1-3% APY（CVX 奖励）

**总收益**：5.4% (Curve) + 2% (Convex) = **7.4% APY**

### 技巧 2：锁定 CRV 获得 veCRV 加成

**什么是 veCRV？**
- 将 CRV 锁定（最长 4 年）可以获得 veCRV
- veCRV 可以提升你的 CRV 奖励（最高 2.5 倍）

**是否值得？**
- 适合长期看好 Curve 的用户
- 新手不建议（锁定期太长）

### 技巧 3：监控池子平衡，优化进出

**原理**：
- 当 3pool 不平衡时（如 USDT 占比过高），存入稀缺的币可以获得"奖励"
- 提款时选择过剩的币，可以减少滑点

**工具**：
- Curve 界面会显示当前池子比例
- 绿色表示稀缺，存入有奖励
- 红色表示过剩，存入有惩罚

### 技巧 4：组合稳定币套利

**策略**：
1. 在 USDC 脱锚至 $0.98 时买入
2. 存入 Curve 3pool（全部用 USDC）
3. 等待 USDC 回锚至 $1.00
4. 提取流动性，换成 USDT 或 DAI
5. 既赚手续费，又赚套利差价

**风险**：需要精准判断脱锚是暂时的（而非永久的）

---

## 📊 对比其他稳定币收益方案

| 方案 | APY | 无常损失 | 流动性 | Gas 成本 | 难度 |
|------|-----|---------|--------|---------|------|
| Curve 3pool | 3-10% | 极低 | 即时 | 高（主网）| 中 |
| Aave USDC | 2-5% | 无 | 即时 | 中 | 低 |
| Uniswap V3 USDC/USDT | 5-15% | 低 | 即时 | 高 | 高 |
| Binance 理财 | 5-10% | 无 | T+1 | 无 | 低 |

**Curve 3pool 的优势**：
- 无常损失极低（稳定币之间）
- 交易量大，手续费稳定
- 多重收益（手续费 + CRV + CVX）

**Curve 3pool 的劣势**：
- 主网 Gas 费高（需要大额或使用 L2）
- 操作复杂度高于单纯存款（Aave）
- CRV 价格波动影响实际收益

---

## ❓ 常见问题

**Q1：3pool 有无常损失吗？**
> 理论上有，但极低。因为三种都是稳定币，价格波动极小（0.98-1.02 美元）。实际 IL 通常 < 0.1%。

**Q2：为什么我的 3CRV 数量不变？**
> 交易手续费是累积在 3CRV 的"汇率"上，而非数量。你退出时会发现能换回更多稳定币。

**Q3：CRV 奖励怎么领取？**
> 在 Curve 界面点击"Claim"，或等待退出流动性时一并领取。

**Q4：可以只存入一种稳定币吗？**
> 可以，但会有小额滑点（< 0.1%）。如果你有三种，建议均衡存入。

**Q5：Polygon 的 3pool 安全吗？**
> Polygon 3pool 也是 Curve 官方部署，但 TVL 较小（流动性略差）。安全性与主网相同。

**Q6：如果 USDT 崩盘怎么办？**
> 这是最大风险。如果 USDT 归零，你的 LP 会包含大量 USDT。建议分散资金，不要全仓 3pool。

---

## ✅ 行动清单

- [ ] 准备稳定币（USDT/USDC/DAI 之一或混合）
- [ ] 准备 ETH 作为 Gas 费（或选择 Polygon）
- [ ] 访问 curve.fi 并连接钱包
- [ ] 找到 3pool，查看当前 APY
- [ ] 授权稳定币 + 存入流动性
- [ ] 确认收到 3CRV
- [ ] （可选）将 3CRV 存入 Convex 增强收益
- [ ] 设置提醒：每月检查一次池子平衡和 APY
- [ ] 定期领取并卖出 CRV（锁定收益）

---

## 🎓 总结

**Curve 3pool 的核心价值**：
1. **无常损失极低**：三种稳定币价格锚定 $1
2. **多重收益**：手续费 + CRV + 额外激励（Convex）
3. **流动性极好**：Curve 最大的池，随时进出
4. **久经考验**：运营多年，TVL 稳定在 10-20 亿美元

**适合人群**：
- 持有多种稳定币，想要集中管理
- 追求比单纯存款更高的收益
- 能接受一定的智能合约风险
- 资金量中等以上（2000 美元+，或使用 L2）

**不适合人群**：
- 小额资金在主网（Gas 费太高）
- 完全无法接受无常损失（即使极低）
- 不愿意学习 AMM 机制

**下一步学习**：
- 学习 Convex Finance（增强 Curve 收益）
- 了解 veCRV 锁仓机制
- 研究其他 Curve 池（如 crvUSD、Tricrypto）

祝你在 Curve 获得稳定收益！🌊
`,

  steps: [
    { step_number: 1, title: '准备稳定币和 Gas', description: '准备 USDT/USDC/DAI 和 ETH（或选择 Polygon 降低成本）。', estimated_time: '20 分钟' },
    { step_number: 2, title: '连接 Curve 应用', description: '访问 curve.fi，连接钱包，找到 3pool。', estimated_time: '10 分钟' },
    { step_number: 3, title: '存入流动性', description: '授权稳定币，存入流动性，获得 3CRV。', estimated_time: '20 分钟' },
    { step_number: 4, title: '（可选）增强收益', description: '将 3CRV 存入 Convex Finance 获得额外 CVX 奖励。', estimated_time: '15 分钟' },
    { step_number: 5, title: '监控和管理', description: '每月检查 APY、池子平衡，定期领取 CRV。', estimated_time: '15 分钟/月' },
  ],
};

// ===== 6.4 Binance 理财锁仓 =====
const STRATEGY_6_4 = {
  title: 'Binance 理财锁仓 - 中心化交易所稳健收益',
  slug: 'binance-savings-locked',
  summary: '将稳定币存入 Binance 理财产品（定期/活期），享受 5-10% 年化收益，保本保息，适合追求稳健收益的用户。',

  category: 'stablecoin-yield',
  category_l1: 'yield',
  category_l2: 'stablecoin',

  difficulty_level: 1,
  risk_level: 3,

  apy_min: 5,
  apy_max: 12,
  threshold_capital: '10 美元起',
  threshold_capital_min: 10,
  time_commitment: '30 分钟设置 + 每周 5 分钟监控',
  time_commitment_minutes: 35,
  threshold_tech_level: 'beginner',

  content: `> **适合人群**：加密货币新手、追求简单操作、不愿意学习 DeFi 的用户
> **阅读时间**：约 10 分钟
> **关键词**：Binance / 理财 / 稳定币 / 定期 / 活期 / 保本

---

## 🎯 什么是 Binance 理财锁仓？

### 用大白话解释

想象一下：
- **传统银行**：你存定期存款，银行给你 2-3% 年利息，到期后才能取
- **Binance 理财**：你存稳定币（USDT/USDC/BUSD），Binance 给你 5-10% 年利息
- **核心区别**：利率更高，操作更简单，但资金托管在交易所（中心化）

### Binance 理财产品类型

**1. 活期理财（Flexible Savings）**
- **特点**：随存随取，无锁定期
- **利率**：3-6% APY
- **适合**：不确定何时需要资金的用户

**2. 定期理财（Locked Savings）**
- **特点**：锁定一段时间（7天/30天/90天）
- **利率**：5-12% APY（锁定期越长，利率越高）
- **适合**：确定短期内不需要资金的用户

**3. Launchpool**
- **特点**：质押 BNB/BUSD 挖新币
- **利率**：变动（新币上线时可能暴涨）
- **适合**：想参与新币首发的用户

**本玩法聚焦**：定期理财（锁仓）+ 活期理财

### 收益来源

你的收益来自：
1. **借贷利息**：Binance 将你的稳定币借给其他用户（合约交易、杠杆交易），收取利息后分给你
2. **资金运作**：Binance 可能将资金用于 DeFi、做市等，赚取收益后分成

**真实案例**：
- 2024年初 USDT 定期理财（90天）：8-10% APY
- 2023年 BUSD 活期：4-6% APY（BUSD 退市前）
- 2021年牛市：USDT 定期可达 12-15% APY（借贷需求旺盛）

---

## 📋 准备工作（30 分钟）

### 第一步：注册 Binance 账户

**如果你还没有 Binance 账户**：

1. 访问 https://www.binance.com
2. 点击"注册"
3. 输入邮箱/手机号
4. 设置密码（建议使用强密码）
5. 完成邮箱/手机验证

**安全设置**（必做）：
1. 开启双重验证（2FA）
   - 下载 Google Authenticator App
   - 在 Binance 绑定 2FA
2. 设置防钓鱼码
3. 完成 KYC 认证（身份验证）
   - 初级认证：上传身份证/护照
   - 高级认证：人脸识别

**为什么要 KYC？**
- 提高提现额度（未认证每日限额很低）
- 使用理财等高级功能

### 第二步：充值稳定币

**方式 1：法币购买**
1. 在 Binance 点击"买币"
2. 选择"C2C 交易"或"银行卡购买"
3. 购买 USDT（选择商家时看评分和成交量）
4. 完成支付（银行转账/支付宝/微信）
5. USDT 自动到账 Binance 钱包

**方式 2：从其他交易所转入**
1. 在其他交易所提现 USDT
2. 复制 Binance 的 USDT 充值地址
3. **注意选择正确的网络**（TRC20 手续费最低，ERC20 手续费高）
4. 确认转账
5. 等待到账（TRC20 约 1-3 分钟）

**推荐金额**：
- 最低：10 USDT（Binance 理财门槛很低）
- 推荐：100-10000 USDT（平衡收益和风险）

### 第三步：了解风险

**Binance 理财的风险**：
1. **平台风险**
   - Binance 是中心化交易所，你的资金托管在 Binance
   - 如果 Binance 被黑客攻击或倒闭，资金可能损失
   - **历史**：Binance 2019年曾被盗 7000 BTC，但使用"SAFU 基金"全额赔付用户

2. **监管风险**
   - 各国监管政策变化可能影响 Binance 运营
   - 例如：美国用户被限制使用 Binance.com（需使用 Binance.US）

3. **利率波动**
   - 理财利率不固定，可能下调
   - 例如：2023年熊市，USDT 理财 APY 从 10% 降至 5%

**应对策略**：
- 不要把全部资金放在一个交易所
- 分散到 Binance、OKX、Bybit 等多个平台
- 大额资金（10万美元+）考虑硬件钱包自行保管

---

## 🚀 操作步骤

### 步骤 1：进入理财页面

1. 登录 Binance
2. 点击顶部菜单"理财"（Earn）
3. 选择"简单赚币"或"锁仓赚币"

**界面导航**：

Binance 首页
  └─ 理财 (Earn)
      ├─ 活期 (Flexible)
      ├─ 定期 (Locked)
      ├─ Launchpool
      └─ DeFi 挖矿


### 步骤 2：选择产品

**活期理财**：
1. 点击"活期"选项卡
2. 找到 USDT（或其他稳定币）
3. 查看当前 APY（例如：5.2%）
4. 点击"申购"

**定期理财**：
1. 点击"定期"选项卡
2. 选择锁定期限：
   - 7天：APY 约 6-8%
   - 30天：APY 约 7-10%
   - 90天：APY 约 8-12%
3. 查看额度剩余（定期产品有限额，先到先得）
4. 点击"立即申购"

### 步骤 3：申购理财产品

**活期理财**：
1. 输入申购金额（如 1000 USDT）
2. 勾选"我已阅读并同意协议"
3. 点击"确认申购"
4. 完成！资金立即开始计息

**定期理财**：
1. 选择锁定期限（如 30天）
2. 输入申购金额（如 5000 USDT）
3. 查看预估收益：

   申购金额：5000 USDT
   锁定期限：30天
   年化利率：9% APY
   预估收益：36.99 USDT
   到期日期：2024-02-15


4. 点击"确认申购"
5. 完成！等待到期自动返还本金+利息

### 步骤 4：查看收益

**活期理财**：
1. 在"理财账户"中查看余额
2. 利息每日结算（每天到账）
3. 随时可以赎回到现货账户

**定期理财**：
1. 在"我的定期"中查看持仓
2. 利息到期后一次性到账
3. 提前赎回会损失利息（部分产品支持提前赎回）

---

## 💰 成本与收益

### 成本分析

| 成本项 | 金额 |
|--------|------|
| 注册费用 | 0 元 |
| 充值手续费 | 0 元（法币购买有价差约 0.5-1%） |
| 理财手续费 | 0 元 |
| 提现手续费 | 0.8 USDT（TRC20）/ 25 USDT（ERC20） |
| **总成本** | **基本为 0** |

### 收益计算

**示例 1：1000 USDT 活期，5% APY，持有 1 年**
- 利息收入：1000 × 5% = 50 USDT
- 成本：0 USDT
- **净收益**：50 USDT（5% 年化）

**示例 2：5000 USDT 定期 30天，9% APY**
- 利息收入：5000 × 9% × (30/365) = 36.99 USDT
- 成本：0 USDT
- **净收益**：36.99 USDT（月化 0.74%）

**示例 3：10000 USDT 定期 90天，10% APY**
- 利息收入：10000 × 10% × (90/365) = 246.58 USDT
- 成本：0 USDT
- **净收益**：246.58 USDT（季化 2.47%）

**对比 DeFi**：
- Binance 理财：0 Gas 费，操作简单，但中心化风险
- DeFi（如 Aave）：需要 Gas 费（20-50 美元），去中心化，但技术门槛高

---

## ⚠️ 风险与注意事项

### 主要风险

1. **平台风险（最大风险）**
   - 资金托管在 Binance，不是"Not your keys, not your coins"
   - 如果 Binance 被黑客攻击、倒闭、冻结账户，资金可能损失
   - **应对**：分散资金，不要全部放在 Binance

2. **监管风险**
   - 中国大陆用户可能面临政策风险
   - 美国、欧洲等地监管趋严
   - **应对**：关注政策变化，必要时转移资金

3. **利率下调风险**
   - 理财利率不保证，Binance 可能随时调整
   - 熊市时利率可能从 10% 降至 3%
   - **应对**：接受浮动利率，或在利率高时锁定长期

4. **提现限制**
   - 定期产品锁定期间无法提前赎回（部分产品支持，但损失利息）
   - 大额提现可能需要额外审核
   - **应对**：不要锁定全部资金，保留一部分活期

5. **稳定币风险**
   - USDT 本身可能脱锚或崩盘
   - **应对**：分散到 USDC、BUSD（已退市）、DAI 等多种稳定币

### 安全清单

- ✅ 开启 2FA 双重验证
- ✅ 设置防钓鱼码
- ✅ 定期更换密码
- ✅ 不要在公共 WiFi 下登录
- ✅ 警惕钓鱼网站（确保网址是 binance.com）
- ✅ 不要相信"客服"私信（Binance 客服不会主动联系你）

---

## 🔥 进阶技巧

### 技巧 1：阶梯式定期策略

**策略**：
- 不要一次性锁定全部资金 90天
- 分成 3 份，分别锁定 30天、60天、90天
- 这样每个月都有资金到期，灵活性更高

**示例**：
- 10000 USDT 分成：
  - 3000 USDT 锁定 30天
  - 3000 USDT 锁定 60天
  - 4000 USDT 锁定 90天

### 技巧 2：组合活期+定期

**策略**：
- 70% 资金锁定期（赚高利率）
- 30% 资金活期（保持流动性）

**示例**：
- 10000 USDT：
  - 7000 USDT 定期 90天（10% APY）
  - 3000 USDT 活期（5% APY）
- 平均 APY：8.5%

### 技巧 3：利用 Launchpool 挖新币

**策略**：
- 当 Binance 上线新币时，参与 Launchpool
- 质押 USDT/BNB 挖新币
- 新币上线后可能暴涨（高风险高回报）

**操作**：
1. 关注 Binance 公告
2. 在 Launchpool 页面质押 USDT
3. 每日领取新币奖励
4. 新币上线后卖出或持有

### 技巧 4：自动续期

**设置自动续期**：
- 在定期理财中勾选"自动续期"
- 到期后自动重新申购（省去手动操作）
- 适合长期持有者

---

## 📊 对比其他交易所理财

| 交易所 | USDT 活期 APY | USDT 定期 APY | 优势 | 劣势 |
|--------|--------------|--------------|------|------|
| Binance | 3-6% | 5-12% | 全球最大、产品丰富 | 监管风险较高 |
| OKX | 3-5% | 5-10% | 界面友好、中文支持好 | 规模略小于 Binance |
| Bybit | 4-7% | 6-12% | 余币宝体验好 | 以合约交易为主 |
| Gate.io | 3-6% | 5-11% | 支持小币种多 | 用户体验一般 |

**Binance 的优势**：
- 全球最大交易所，流动性最好
- 产品种类丰富（活期、定期、Launchpool、DeFi 挖矿）
- SAFU 基金保护（10% 交易手续费存入保险基金）

**Binance 的劣势**：
- 监管压力大（多国限制）
- 用户量大，客服响应可能慢

---

## ❓ 常见问题

**Q1：Binance 理财安全吗？**
> Binance 是全球最大交易所，有 SAFU 保险基金。但仍是中心化平台，存在平台风险。建议分散资金。

**Q2：定期理财可以提前赎回吗？**
> 部分产品支持提前赎回，但会损失全部利息。建议锁定前确认不需要资金。

**Q3：利息什么时候到账？**
> 活期：每日结算，次日到账。定期：到期后一次性到账。

**Q4：最低申购金额是多少？**
> 活期通常 10 USDT 起，定期 100 USDT 起（不同产品不同）。

**Q5：可以用其他币种理财吗？**
> 可以。Binance 支持 BTC、ETH、BNB、BUSD 等多种币理财，但本玩法聚焦稳定币。

**Q6：Binance 理财和 DeFi 哪个更好？**
> 各有优劣。Binance 理财简单、无 Gas 费，但中心化风险高。DeFi 去中心化、透明，但技术门槛高、有 Gas 费。

---

## ✅ 行动清单

- [ ] 注册 Binance 账户并完成 KYC
- [ ] 开启 2FA 双重验证
- [ ] 充值 USDT 到 Binance
- [ ] 进入"理财"页面，选择产品
- [ ] 申购活期或定期理财
- [ ] 设置自动续期（可选）
- [ ] 每周检查一次收益和利率变化
- [ ] 到期后决定续期或提现

---

## 🎓 总结

**Binance 理财的核心价值**：
1. **操作简单**：几分钟完成设置，适合新手
2. **门槛低**：10 USDT 起，人人可参与
3. **收益稳定**：5-12% APY，远超传统银行
4. **无 Gas 费**：不需要学习 DeFi，不需要支付链上手续费

**适合人群**：
- 加密货币新手
- 不愿意学习 DeFi 的用户
- 小额资金（100-10000 USDT）
- 追求简单操作、稳定收益

**不适合人群**：
- 极度重视去中心化（"Not your keys, not your coins"）
- 无法接受中心化平台风险
- 所在国家/地区限制使用 Binance

**下一步学习**：
- 尝试 OKX、Bybit 等其他交易所理财（分散风险）
- 学习 DeFi 借贷（Aave、Compound）对比收益
- 研究 Launchpool 挖新币（高风险高回报）

祝你在 Binance 理财中获得稳健收益！💰
`,

  steps: [
    { step_number: 1, title: '注册并认证账户', description: '注册 Binance，完成 KYC，开启 2FA。', estimated_time: '20 分钟' },
    { step_number: 2, title: '充值稳定币', description: '通过 C2C 或转账充值 USDT 到 Binance。', estimated_time: '10 分钟' },
    { step_number: 3, title: '申购理财产品', description: '选择活期或定期理财，申购 USDT 理财。', estimated_time: '5 分钟' },
    { step_number: 4, title: '监控收益', description: '每周检查一次收益和利率变化。', estimated_time: '5 分钟/周' },
    { step_number: 5, title: '到期处理', description: '定期到期后决定续期或提现。', estimated_time: '5 分钟' },
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
    const strategies = [STRATEGY_6_3, STRATEGY_6_4];

    console.log('\n开始创建 6.3 和 6.4 策略...\n');

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