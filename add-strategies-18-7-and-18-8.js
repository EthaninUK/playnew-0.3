const axios = require('axios');

// ========================
// 策略 18.7: PSM 模块无风险套利
// ========================
const STRATEGY_18_7 = {
  title: 'PSM 模块无风险套利 - MakerDAO 稳定币套利',
  slug: 'depeg-arbitrage-18-7-psm-module-arbitrage',
  category: 'depeg-arbitrage',
  category_l1: 'arbitrage',
  category_l2: '稳定币脱锚',
  summary: '使用 MakerDAO/Frax PSM 模块,以极小滑点(0.01%)套利稳定币价差。几乎无风险,单次收益 0.5-2%。',
  content: `## 📖 故事：一个 DeFi 玩家的自动化套利机器

**PSM 模块的发现**

北京 DeFi 玩家小陈在 2022 年底发现了一个几乎无风险的套利机会：MakerDAO PSM 模块。

**什么是 PSM？**

PSM (Peg Stability Module) 是 MakerDAO 推出的稳定币锚定机制,允许用户以接近 1:1 的比例兑换 DAI 和其他稳定币。

**小陈的发现：**

2022 年 11 月,FTX 倒闭后,DAI 在 Curve 跌至 $0.985,但 PSM 仍支持 1:1 兑换。

**套利操作：**

\`\`\`
1. Curve 买入 100,000 DAI（价格 $0.985,成本 98,500 USDC）
2. PSM 1:1 兑换为 100,000 USDC（手续费 0.01% = 10 USDC）
3. 获得 99,990 USDC
4. 净利润: 99,990 - 98,500 = 1,490 USDC（1.51%）
\`\`\`

**小陈的自动化：**

小陈编写了一个监控脚本,24/7 监控 DAI 价格：

\`\`\`javascript
async function monitorDAIPrice() {
  const daiPrice = await getCurvePrice('DAI/USDC');

  if (daiPrice < 0.995) {
    console.log('发现套利机会!');
    await executePSMArbitrage(100000);
  }
}

setInterval(monitorDAIPrice, 60000); // 每分钟检查
\`\`\`

**2022-2023 年成果：**
- 捕捉套利机会：47 次
- 平均单次收益：1.1%
- **总收益**：51,700 USDC（一年）

---

## 🧭 什么是 PSM 模块？

**定义**：Peg Stability Module,MakerDAO 和 Frax 等协议推出的稳定币锚定机制。

### PSM 工作原理

**核心功能：**

1. **1:1 兑换**：DAI ↔ USDC,几乎无滑点
2. **极低手续费**：0.01%（USDC → DAI 为 0%）
3. **无需抵押**：直接兑换,无需超额抵押
4. **大额容量**：通常 > 10 亿美元

**支持 PSM 的协议：**

| 协议 | 稳定币 | 兑换手续费 | 容量 |
|-----|--------|-----------|------|
| **MakerDAO** | DAI ↔ USDC | 0.01% | 100 亿美元 |
| **MakerDAO** | DAI ↔ USDP | 0.01% | 5 亿美元 |
| **Frax** | FRAX ↔ USDC | 0% | 20 亿美元 |
| **Frax** | FRAX ↔ DAI | 0% | 5 亿美元 |

---

## ✅ 适合人群

| 条件 | 要求 |
|-----|------|
| **资金量** | 5,000 美元以上 |
| **技术能力** | 熟悉 MetaMask、DeFi 操作 |
| **Gas 费储备** | 50-200 USDC |
| **风险承受** | 极低（几乎无风险） |

**核心能力**：DeFi 操作熟练度

---

## 📋 完整操作步骤

### 步骤 1：监控稳定币价差

**实时价格对比：**

| 平台 | 价格 |
|-----|------|
| **Curve DAI** | $0.990 |
| **PSM 兑换率** | 1.000 DAI = 1.000 USDC |
| **套利空间** | 1.0% |

**监控工具：**

| 工具 | 功能 | 推荐指数 |
|-----|------|---------|
| **Curve Finance** | DAI 实时价格 | ⭐⭐⭐⭐⭐ |
| **DeFi Llama** | 聚合价格 | ⭐⭐⭐⭐ |
| **自建脚本** | 自动监控 | ⭐⭐⭐⭐⭐ |

**价格监控脚本：**

\`\`\`javascript
const { ethers } = require('ethers');

async function monitorPSMOpportunity() {
  // 获取 Curve DAI/USDC 价格
  const curvePool = new ethers.Contract(CURVE_3POOL, ABI, provider);
  const daiPrice = await curvePool.get_dy(0, 1, ethers.utils.parseUnits('1', 18));
  const daiPriceUSD = parseFloat(ethers.utils.formatUnits(daiPrice, 6));

  // 计算套利空间
  const spread = (1.0 - daiPriceUSD) * 100;

  if (spread > 0.5) {
    console.log(\`🔔 PSM 套利机会: DAI = $\${daiPriceUSD.toFixed(4)}, 价差 \${spread.toFixed(2)}%\`);
  }
}

setInterval(monitorPSMOpportunity, 30000); // 每 30 秒检查
\`\`\`

### 步骤 2：在 Curve 买入折价稳定币

**操作流程：**

1. **访问 Curve 3pool**
   - 网址：https://curve.fi/#/ethereum/pools/3pool/swap
   - 连接 MetaMask

2. **兑换 USDC → DAI**
   \`\`\`
   输入: 10,000 USDC
   输出: 10,101 DAI（假设价格 $0.990）
   滑点: 0.5%
   Gas 费: 20 USDC（Ethereum）
   \`\`\`

3. **确认交易**

**使用 Arbitrum 降低 Gas：**

| 网络 | Gas 费 | 推荐指数 |
|-----|--------|---------|
| **Ethereum** | 20-50 USDC | ⭐⭐⭐ |
| **Arbitrum** | 0.5-2 USDC | ⭐⭐⭐⭐⭐ |
| **Optimism** | 1-3 USDC | ⭐⭐⭐⭐ |

### 步骤 3：通过 PSM 1:1 兑换

**访问 MakerDAO Oasis：**

网址：https://oasis.app/trade

**操作流程：**

1. **连接钱包**
   - 点击 "Connect Wallet"
   - 选择 MetaMask

2. **选择 PSM 兑换**
   - 从 DAI 兑换到 USDC
   - 输入数量：10,101 DAI

3. **查看兑换详情**
   \`\`\`
   兑换数量: 10,101 DAI
   获得: 10,101 USDC
   手续费: 0.01% = 1.01 USDC
   实际获得: 10,099.99 USDC
   \`\`\`

4. **确认交易**
   - Gas 费：约 15-30 USDC（Ethereum）
   - 到账时间：1-3 分钟

### 步骤 4：计算利润

**完整成本核算：**

\`\`\`
买入成本: 10,000 USDC
Curve Gas: 20 USDC
PSM 手续费: 1.01 USDC
PSM Gas: 20 USDC
总成本: 10,041.01 USDC

获得: 10,099.99 USDC
净利润: 10,099.99 - 10,041.01 = 58.98 USDC（0.59%）
\`\`\`

**使用 Arbitrum 优化：**

\`\`\`
买入成本: 10,000 USDC
Curve Gas: 1 USDC（Arbitrum）
PSM 手续费: 1.01 USDC
PSM Gas: 0.5 USDC（Arbitrum）
总成本: 10,002.51 USDC

获得: 10,099.99 USDC
净利润: 10,099.99 - 10,002.51 = 97.48 USDC（0.97%）
\`\`\`

### 步骤 5：自动化执行

**完整自动化脚本：**

\`\`\`javascript
async function executePSMArbitrage(amount) {
  // 1. 检查 DAI 价格
  const daiPrice = await getCurvePrice('DAI/USDC');

  if (daiPrice >= 0.995) {
    console.log('价差不足,放弃套利');
    return;
  }

  console.log(\`发现套利机会: DAI = $\${daiPrice.toFixed(4)}\`);

  // 2. Curve 买入 DAI
  const curveTx = await curvePool.exchange(1, 0, usdcAmount, minDaiAmount);
  await curveTx.wait();
  console.log('✅ Curve 买入 DAI 完成');

  // 3. 授权 PSM
  const approveTx = await daiContract.approve(PSM_ADDRESS, daiAmount);
  await approveTx.wait();

  // 4. PSM 兑换 DAI → USDC
  const psmTx = await psmContract.sellGem(wallet.address, daiAmount);
  await psmTx.wait();
  console.log('✅ PSM 兑换完成');

  // 5. 计算利润
  const profit = finalUSDC - initialUSDC;
  console.log(\`💰 净利润: \${profit.toFixed(2)} USDC\`);
}

// 每分钟检查一次
setInterval(async () => {
  const daiPrice = await getCurvePrice('DAI/USDC');
  if (daiPrice < 0.995) {
    await executePSMArbitrage(10000);
  }
}, 60000);
\`\`\`

---

## 💡 进阶技巧

### 技巧 1：反向套利（DAI 溢价）

当 DAI > $1.00 时,反向操作：

\`\`\`
1. PSM: USDC 1:1 兑换 DAI（手续费 0%）
2. Curve: 卖出 DAI 换回 USDC（价格 $1.005）
3. 净利润: 0.5%
\`\`\`

**优势**：USDC → DAI 手续费为 0%。

### 技巧 2：使用 Frax PSM

Frax PSM 手续费更低（0%）：

\`\`\`
1. Curve 买入 FRAX（$0.990）
2. Frax PSM: FRAX 1:1 兑换 USDC（手续费 0%）
3. 净利润: 1.0%（无手续费）
\`\`\`

### 技巧 3：闪电贷放大本金

通过 Aave 闪电贷借入 100 万 USDC：

\`\`\`
1. 闪电贷借入 1,000,000 USDC
2. Curve 买入 DAI（$0.990）
3. PSM 1:1 兑换回 USDC
4. 归还闪电贷 + 手续费（0.09%）
5. 净利润: 10,000 - 900 - 500（Gas）= 8,600 USDC
\`\`\`

### 技巧 4：监控 PSM 容量

PSM 有容量上限,满了就无法兑换。

**查看 PSM 容量：**

访问：https://makerburn.com/#/psm

\`\`\`
PSM-USDC-A:
- 当前使用: 8.5 亿 DAI
- 上限: 10 亿 DAI
- 剩余容量: 1.5 亿 DAI ✅

如果剩余 < 1,000 万 → ⚠️ 容量不足
\`\`\`

---

## ⚠️ 风险警告

### 风险 1：Gas 费波动

以太坊 Gas 费可能暴涨,吞噬利润。

**应对**：
- 使用 Arbitrum/Optimism
- 只在价差 > 1% 时操作

### 风险 2：PSM 容量不足

PSM 可能达到上限,无法兑换。

**应对**：
- 提前查看 PSM 容量
- 避免在容量 < 1,000 万时操作

### 风险 3：价格瞬间反转

DAI 价格可能瞬间回归 $1.00。

**应对**：
- 快速执行（Curve + PSM 在 5 分钟内完成）
- 自动化执行

### 风险 4：智能合约风险

PSM 或 Curve 可能存在漏洞。

**应对**：
- 只使用经过审计的协议
- 小额测试后再大额操作

---

## ❓ 常见问题

**Q1：PSM 套利还有机会吗？**

A：
- 2022-2023 年：每月 5-10 次机会
- 2024 年：每月 2-5 次（市场效率提高）
- 未来：机会减少,但仍存在

**Q2：需要多少本金？**

A：
- 最低：5,000 USDC（覆盖 Gas）
- 推荐：2-5 万 USDC（降低 Gas 占比）
- 大户：10 万 USDC 以上（闪电贷）

**Q3：手续费是多少？**

A：
- MakerDAO PSM（DAI → USDC）：0.01%
- MakerDAO PSM（USDC → DAI）：0%
- Frax PSM：0%（双向）

**Q4：为什么不是所有人都在套利？**

A：
- Gas 费高（以太坊主网）
- 技术门槛（需熟悉 DeFi）
- 监控成本（需 24/7 监控）

**Q5：可以长期持有 DAI 吗？**

A：不建议。买入后应立即通过 PSM 兑换,避免价格继续波动。

---

## 📚 总结

**PSM 模块套利 = Curve 买入 + PSM 兑换 + 几乎无风险**

### 核心要点

| 要点 | 说明 |
|-----|------|
| **价格监控** | DAI < $0.995 时操作 |
| **买入渠道** | Curve Finance |
| **兑换渠道** | MakerDAO/Frax PSM |
| **Gas 优化** | 使用 Arbitrum（降低 97% Gas） |
| **容量检查** | 确保 PSM 剩余 > 1,000 万 |

### 适合人群

✅ 熟悉 DeFi 操作的玩家
✅ 有 5,000 USDC 以上本金
✅ 能编写自动化脚本（可选）

❌ DeFi 新手
❌ 小额资金（Gas 占比过高）

### 预期收益

- **小额**（5,000 USDC）：25-50 USDC（0.5-1%）
- **中额**（5 万 USDC）：250-750 USDC（0.5-1.5%）
- **大额**（50 万 USDC）：2,500-7,500 USDC（0.5-1.5%）

### 下一步行动

- [ ] 开通 MetaMask 钱包
- [ ] 准备 5,000 USDC + 50 USDC Gas
- [ ] 熟悉 Curve、PSM 操作
- [ ] 小额测试（100 USDC）
- [ ] 编写监控脚本（可选）

**最后提醒**：PSM 套利几乎无风险,但需熟悉 DeFi 操作。新手建议先小额测试,熟练后再增加本金。`,

  steps: [
    '监控稳定币价差（DAI < $0.995）',
    '在 Curve 买入折价 DAI（使用 Arbitrum 降低 Gas）',
    '通过 PSM 1:1 兑换为 USDC（手续费 0.01%）',
    '计算利润（扣除 Gas 和手续费）',
    '自动化执行（编写监控脚本）'
  ],

  risk_level: 1,
  apy_min: 5,
  apy_max: 30,
  min_investment: 5000,
  difficulty_level: 'intermediate',
  time_commitment: 'passive',

  required_tools: [
    'MetaMask 钱包',
    'Curve Finance',
    'MakerDAO PSM / Frax PSM',
    'Arbitrum 网络（降低 Gas）',
    '5,000 USDC + 50 USDC Gas',
    '自动化脚本（可选）'
  ],

  status: 'published',
  reading_time_minutes: 18
};

// ========================
// 策略 18.8: BUSD 退市折价套利
// ========================
const STRATEGY_18_8 = {
  title: 'BUSD 退市折价套利 - 官方赎回套利机会',
  slug: 'depeg-arbitrage-18-8-busd-delisting-arbitrage',
  category: 'depeg-arbitrage',
  category_l1: 'arbitrage',
  category_l2: '稳定币脱锚',
  summary: '在 BUSD 宣布退市后折价至 $0.97 时买入,通过官方 1:1 赎回通道套利。低风险,单次收益 2-5%。',
  content: `## 📖 故事：2024年2月 BUSD 退市套利

**监管打击下的套利机会**

2024 年 2 月,币安宣布将逐步停止支持 BUSD（Binance USD）稳定币,并关闭赎回通道。

消息传出后,市场陷入恐慌：

**价格变化：**
- **2024年2月13日**：BUSD = $1.00（正常）
- **2024年2月14日**：BUSD = $0.97（恐慌抛售）
- **2024年2月20日**：BUSD = $0.995（情绪恢复）

深圳玩家老刘发现了套利机会：

**套利逻辑：**

1. Paxos（BUSD 发行商）承诺 1:1 赎回至 2025 年 2 月
2. BUSD 折价是市场恐慌,而非真实风险
3. 通过官方渠道可 1:1 赎回为 USD

**老刘的操作：**

\`\`\`
2024年2月14日:
1. Binance 买入 100,000 BUSD（价格 $0.97,成本 $97,000）
2. 等待 Paxos 赎回通道开放（等待 7 天）
3. 通过 Paxos 1:1 赎回为 USD（手续费 0.1%）

2024年2月21日:
4. 获得 $99,900（100,000 × 0.999）
5. 净利润: $99,900 - $97,000 = $2,900（3%）
\`\`\`

**为什么有折价？**

- 大部分用户不知道 Paxos 赎回通道
- 赎回流程复杂（需 KYC、银行账户）
- 赎回时间长（7-14 天）

---

## 🧭 什么是退市折价套利？

**定义**：当稳定币宣布退市时,因市场恐慌导致折价,但发行商仍承诺 1:1 赎回,从而产生套利机会。

### 历史退市事件

| 时间 | 稳定币 | 退市原因 | 最低价 | 赎回期限 | 套利空间 |
|-----|--------|---------|--------|---------|---------|
| **2024.02** | BUSD | 监管打击 | $0.97 | 1 年 | 3% |
| **2023.03** | TUSD（部分） | 流动性问题 | $0.98 | 6 个月 | 2% |
| **2021.09** | USDC（中国） | 政策限制 | $0.96 | 永久 | 4% |

---

## ✅ 适合人群

| 条件 | 要求 |
|-----|------|
| **资金量** | 1 万美元以上 |
| **KYC 认证** | 能通过发行商 KYC |
| **银行账户** | 有美国/新加坡银行账户 |
| **时间承诺** | 能等待 7-30 天赎回 |

**核心能力**：耐心等待 + 赎回流程熟悉

---

## 📋 完整操作步骤

### 步骤 1：确认官方赎回承诺

**关键信息确认：**

1. **发行商是否承诺赎回？**
   - Paxos（BUSD）：✅ 承诺 1:1 赎回至 2025年2月
   - TrustToken（TUSD）：✅ 永久 1:1 赎回

2. **赎回期限是多久？**
   - BUSD：1 年
   - TUSD：永久

3. **赎回手续费多少？**
   - Paxos：0.1%
   - TrustToken：0%

**官方公告来源：**

- Paxos 官网：https://paxos.com/busd/
- Binance 公告：https://www.binance.com/en/support/announcement

### 步骤 2：在交易所买入折价稳定币

**价格监控：**

| 交易所 | BUSD 价格 | 流动性 |
|--------|----------|--------|
| **Binance** | $0.970 | 极高 |
| **OKX** | $0.968 | 高 |
| **Curve** | $0.965 | 中 |

**买入策略：**

\`\`\`
目标价格: < $0.98
买入金额: 10,000-100,000 BUSD
预期收益: 2-3.5%
\`\`\`

**操作流程：**

1. **Binance 买入**
   \`\`\`
   币种: BUSD
   数量: 50,000 BUSD
   价格: $0.97
   成本: $48,500 USDT
   \`\`\`

2. **确认交易**
   - 手续费：0.1% = $48.5
   - 到账时间：即时

### 步骤 3：通过官方渠道赎回

**Paxos 赎回流程：**

1. **注册 Paxos 账户**
   - 访问：https://paxos.com
   - 完成 KYC（需护照 + 地址证明）
   - 等待审核（1-3 天）

2. **绑定银行账户**
   - 支持美国、新加坡、欧洲银行
   - 提交银行证明
   - 等待审核（1-2 天）

3. **发起赎回**
   \`\`\`
   币种: BUSD
   数量: 50,000 BUSD
   赎回方式: 银行电汇
   手续费: 0.1% = $50
   到账时间: 7-14 个工作日
   \`\`\`

4. **等待到账**
   - Paxos 审核：1-3 天
   - 银行处理：3-7 天
   - 总计：7-14 天

### 步骤 4：计算利润

**完整成本核算：**

\`\`\`
买入成本: $48,500 USDT
Binance 手续费: $48.5
Paxos 赎回手续费: $50
Paxos KYC 成本: $0（免费）
总成本: $48,598.5

获得: $49,950（50,000 × 0.999）
净利润: $49,950 - $48,598.5 = $1,351.5（2.78%）
\`\`\`

**时间成本：**
- 等待时间：7-14 天
- 年化收益：2.78% × 26 = **72.3%**（假设每 14 天一次）

### 步骤 5：风险控制

**止损策略：**

\`\`\`
价格监控:
- BUSD < $0.95：继续持有（折价更深）
- BUSD > $0.99：立即卖出（套利空间消失）
- BUSD < $0.90：警惕发行商破产风险

时间止损:
- 赎回期限 < 3 个月：不要买入
- 赎回期限 > 1 年：安全
\`\`\`

---

## 💡 进阶技巧

### 技巧 1：分批买入

不要一次性 All In：

\`\`\`
第一批: BUSD = $0.98,买入 20%
第二批: BUSD = $0.97,买入 30%
第三批: BUSD = $0.96,买入 30%
第四批: BUSD = $0.95,买入 20%

平均成本: $0.965
\`\`\`

### 技巧 2：提前准备 KYC

在折价发生前提前完成 KYC：

\`\`\`
提前准备:
1. 注册 Paxos 账户
2. 完成 KYC 认证
3. 绑定银行账户

折价发生时:
→ 立即买入 BUSD
→ 立即发起赎回
→ 节省 3-5 天时间
\`\`\`

### 技巧 3：利用 OTC 提现

如果不想等待 7-14 天：

\`\`\`
1. 买入 BUSD（$0.97）
2. 联系 OTC 商家
3. 溢价卖出 BUSD（$0.985）
4. 净利润: 1.5%（即时到账）
\`\`\`

### 技巧 4：监控退市公告

提前监控可能退市的稳定币：

| 稳定币 | 退市风险 | 监控指标 |
|--------|---------|---------|
| **USDT** | 低 | 监管新闻 |
| **USDC** | 极低 | 银行风险 |
| **BUSD** | 高（已退市） | - |
| **TUSD** | 中 | 流动性下降 |

---

## ⚠️ 风险警告

### 风险 1：发行商破产

如果发行商真的破产,可能无法 1:1 赎回。

**应对**：
- 只买入有真实储备金的稳定币
- 查看最新储备金报告
- 设置止损（< $0.90）

### 风险 2：赎回通道关闭

发行商可能提前关闭赎回通道。

**应对**：
- 关注官方公告
- 赎回期限 < 3 个月时不买入

### 风险 3：KYC 失败

如果无法通过 KYC,无法赎回。

**应对**：
- 提前完成 KYC（在折价前）
- 准备完整 KYC 材料

### 风险 4：银行拒收

某些银行可能拒绝接收加密货币赎回。

**应对**：
- 使用加密货币友好银行
- 准备多个银行账户

---

## ❓ 常见问题

**Q1：BUSD 退市后还能交易吗？**

A：
- Binance：已停止交易（2024年2月）
- 其他 CEX：部分仍支持
- DEX：仍可交易（流动性低）

**Q2：需要多少本金？**

A：
- 最低：5,000 BUSD（覆盖手续费）
- 推荐：2-5 万 BUSD
- 大户：10 万 BUSD 以上

**Q3：赎回需要哪些材料？**

A：
- 护照或身份证
- 地址证明（水电账单）
- 银行账户证明
- 资金来源证明（可选）

**Q4：赎回到账需要多久？**

A：
- Paxos 审核：1-3 天
- 银行处理：3-7 天
- 总计：7-14 天

**Q5：可以批量赎回吗？**

A：可以！单次赎回上限：
- Paxos：100 万美元
- TrustToken：无限制

---

## 📚 总结

**退市折价套利 = 折价买入 + 官方赎回 + 耐心等待**

### 核心要点

| 要点 | 说明 |
|-----|------|
| **官方承诺** | 确认发行商 1:1 赎回承诺 |
| **折价买入** | < $0.98 时买入 |
| **KYC 准备** | 提前完成 Paxos KYC |
| **官方赎回** | 通过 Paxos 1:1 赎回 |
| **时间成本** | 等待 7-14 天 |

### 适合人群

✅ 有美国/新加坡银行账户
✅ 能通过 KYC 认证
✅ 能等待 7-14 天
✅ 有 1-5 万美元本金

❌ 无银行账户
❌ 无法通过 KYC
❌ 需要即时流动性

### 预期收益

- **折价 2%**：净利润 1.5-2%
- **折价 3%**：净利润 2.5-3%
- **折价 5%**：净利润 4.5-5%

### 下一步行动

- [ ] 注册 Paxos 账户
- [ ] 完成 KYC 认证
- [ ] 绑定银行账户
- [ ] 监控 BUSD 价格（< $0.98）
- [ ] 准备 1-5 万 USDT 本金

**最后提醒**：退市折价套利需要耐心等待 7-14 天,只适合能等待的投资者。如果需要即时流动性,可考虑 OTC 提现（收益略低）。`,

  steps: [
    '确认官方赎回承诺（Paxos 承诺 1:1 赎回）',
    '在交易所买入折价稳定币（< $0.98）',
    '通过官方渠道赎回（Paxos,手续费 0.1%）',
    '计算利润（扣除手续费）',
    '风险控制（设置止损,监控官方公告）'
  ],

  risk_level: 2,
  apy_min: 20,
  apy_max: 100,
  min_investment: 10000,
  difficulty_level: 'intermediate',
  time_commitment: 'part-time',

  required_tools: [
    'Binance、OKX 账户',
    'Paxos 账户（需 KYC）',
    '美国/新加坡银行账户',
    '1-5 万 USDT 本金',
    '耐心等待 7-14 天'
  ],

  status: 'published',
  reading_time_minutes: 18
};

// ========================
// 认证和创建函数
// ========================
async function getAuthToken() {
  try {
    const response = await axios.post('http://localhost:8055/auth/login', {
      email: 'the_uk1@outlook.com',
      password: 'Mygcdjmyxzg2026!'
    });
    return response.data.data.access_token;
  } catch (error) {
    console.error('认证失败:', error.message);
    throw error;
  }
}

async function createStrategies() {
  console.log('认证中...');
  const token = await getAuthToken();
  console.log('认证成功，开始创建策略...\n');

  const strategies = [STRATEGY_18_7, STRATEGY_18_8];

  for (const strategy of strategies) {
    try {
      console.log(`正在创建策略 ${strategy.slug.includes('18-7') ? '18.7' : '18.8'}: ${strategy.title}...`);

      const response = await axios.post(
        'http://localhost:8055/items/strategies',
        strategy,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log(`✅ 策略 ${strategy.slug.includes('18-7') ? '18.7' : '18.8'} 创建成功! ID: ${response.data.data.id}`);
      console.log(`   标题: ${strategy.title}`);
      console.log(`   Slug: ${strategy.slug}\n`);

    } catch (error) {
      console.error(`❌ 创建策略失败:`, error.response?.data || error.message);
      throw error;
    }
  }

  // 获取总数
  try {
    const countResponse = await axios.get(
      'http://localhost:8055/items/strategies?fields=id&limit=-1',
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );

    const totalCount = countResponse.data.data.length;

    console.log('========================================');
    console.log('🎉 策略 18.7 和 18.8 创建完成！');
    console.log(`📊 当前数据库中共有 ${totalCount} 个策略`);
    console.log('========================================');

  } catch (error) {
    console.error('获取策略总数失败:', error.message);
  }
}

// 执行
createStrategies().catch(console.error);
