const axios = require('axios');

// ========================
// 策略 18.1: USDC 脱锚抄底
// ========================
const STRATEGY_18_1 = {
  title: 'USDC 脱锚抄底 - 银行危机中的套利机会',
  slug: 'depeg-arbitrage-18-1-usdc-depeg-bottom-fishing',
  category: 'depeg-arbitrage',
  category_l1: 'arbitrage',
  category_l2: '稳定币脱锚',
  summary: '当 USDC 因银行风险脱锚至 $0.90 时抄底，等待回锚至 $1.00 获利。2023年3月 SVB 事件中单日收益可达 10%+。',
  content: `## 📖 故事：2023年3月 SVB 银行倒闭事件

**48 小时内从 $0.87 到 $1.00 的惊心动魄**

2023 年 3 月 10 日，美国硅谷银行（SVB）突然倒闭，震惊全球金融市场。

更可怕的是：USDC 发行商 Circle 公司在 SVB 存有 **33 亿美元储备金**（占总储备的 8%）！

消息传出后，加密市场陷入恐慌：

**2023年3月11日凌晨：**
- USDC 价格暴跌至 **$0.87**（跌幅 13%）
- 24 小时交易量暴增至 100 亿美元
- 大量用户恐慌性抛售 USDC

深圳玩家老王在凌晨 3 点被手机预警吵醒，看到 USDC 价格时，他做了一个大胆的决定：

**老王的判断：**
1. Circle 是合规公司，美国政府不会让其倒闭
2. 即使 SVB 倒闭，Circle 还有 92% 储备金在其他银行
3. USDC 大概率会在 48-72 小时内回锚至 $1.00

**老王的操作：**
- **3月11日 03:15**：在 Binance 以 $0.88 买入 50,000 USDC（成本 $44,000）
- **3月11日 08:30**：追加以 $0.91 买入 30,000 USDC（成本 $27,300）
- **3月12日 14:00**：美联储宣布保护所有 SVB 存款人
- **3月13日 10:00**：USDC 回锚至 $0.998
- **3月13日 11:00**：老王以 $0.998 卖出全部 80,000 USDC（获得 $79,840）

**净利润**：$79,840 - $44,000 - $27,300 = **$8,540**（48小时，+12%）

---

## 🧭 什么是稳定币脱锚？

**定义**：稳定币的市场价格偏离其锚定价格（通常是 $1.00）的现象。

### 脱锚原因

| 原因 | 说明 | 脱锚幅度 |
|-----|------|---------|
| **储备金风险** | 发行商银行倒闭、储备金不足 | 10-30% |
| **监管风险** | 政府打击、合规问题 | 5-15% |
| **流动性枯竭** | 大额赎回、挤兑 | 3-10% |
| **市场恐慌** | FUD（恐惧、不确定、怀疑） | 2-5% |
| **技术问题** | 智能合约漏洞、黑客攻击 | 5-20% |

### 历史脱锚事件

| 时间 | 稳定币 | 最低价 | 回锚时间 | 原因 |
|-----|--------|--------|---------|------|
| **2023.03** | USDC | $0.87 | 48 小时 | SVB 银行倒闭 |
| **2022.05** | UST | $0.60 → $0.01 | 永久脱锚 | 算法崩盘（死亡螺旋） |
| **2022.11** | USDT | $0.95 | 12 小时 | FTX 倒闭恐慌 |
| **2021.05** | USDT | $0.96 | 24 小时 | 中国打击加密货币 |
| **2024.02** | BUSD | $0.97 | 3 个月 | 币安宣布停止发行 |

---

## ✅ 适合人群

| 条件 | 要求 |
|-----|------|
| **资金量** | 1 万美元以上 |
| **风险承受** | 极高（可能永久脱锚） |
| **反应速度** | 能在 1 小时内完成买入 |
| **判断能力** | 能区分"暂时脱锚"和"永久死亡螺旋" |

**核心能力**：风险判断 + 快速决策 + 心理承受

---

## 📋 完整操作步骤

### 步骤 1：监控稳定币价格

**监控工具：**

| 工具 | 功能 | 推荐指数 |
|-----|------|---------|
| **CoinGecko** | 实时价格、历史图表 | ⭐⭐⭐⭐⭐ |
| **Binance** | 交易深度、买卖盘 | ⭐⭐⭐⭐⭐ |
| **Curve Finance** | DEX 价格、流动性池 | ⭐⭐⭐⭐ |
| **Telegram Bot** | 价格预警（< $0.98 时推送） | ⭐⭐⭐⭐⭐ |

**设置价格预警：**

在 CoinGecko 设置预警：
\`\`\`
USDC < $0.98 → 立即通知
USDC < $0.95 → 紧急通知
USDC < $0.90 → 重大机会
\`\`\`

### 步骤 2：分析脱锚原因

**关键问题：**

1. **是技术性脱锚还是基本面崩溃？**
   - 技术性：市场恐慌、流动性不足（可以抄底）
   - 基本面：储备金真的没了、算法崩溃（不要抄底）

2. **发行商是否还在运营？**
   - Circle（USDC）：合规公司，有政府背书 ✅
   - Terraform Labs（UST）：算法稳定币，无储备金 ❌

3. **储备金是否充足？**
   - USDC：100% 储备金（银行存款 + 美债） ✅
   - USDT：85% 储备金（商业票据 + 其他） ⚠️
   - UST：0% 储备金（算法维持） ❌

4. **监管态度如何？**
   - 美国政府宣布保护 SVB 存款人 ✅
   - 美国 SEC 起诉 Binance ❌

**决策树：**

\`\`\`
脱锚幅度 > 10%？
├─ 是 → 储备金是否充足？
│   ├─ 是 → 发行商是否运营中？
│   │   ├─ 是 → ✅ 可以抄底
│   │   └─ 否 → ❌ 不要抄底
│   └─ 否 → ❌ 不要抄底
└─ 否 → 观望（等待更大折扣）
\`\`\`

### 步骤 3：分批抄底

**千万不要一次性 All In！**

**分批策略：**

| 价格区间 | 仓位比例 | 备注 |
|---------|---------|------|
| **$0.95-0.97** | 20% | 试探性买入 |
| **$0.90-0.95** | 30% | 中等仓位 |
| **$0.85-0.90** | 30% | 重仓买入 |
| **< $0.85** | 20% | 保留弹药 |

**示例：10 万美元本金**

\`\`\`
$0.96 买入: 20,000 USDT → 20,833 USDC
$0.92 买入: 30,000 USDT → 32,609 USDC
$0.88 买入: 30,000 USDT → 34,091 USDC
$0.84 买入: 20,000 USDT → 23,810 USDC

总计: 100,000 USDT → 111,343 USDC
平均成本: $0.898
\`\`\`

### 步骤 4：选择买入渠道

**CEX vs DEX：**

| 渠道 | 优势 | 劣势 |
|-----|------|------|
| **CEX（Binance）** | 流动性高、交易快 | 可能暂停提现 |
| **DEX（Curve）** | 无法冻结、去中心化 | Gas 费高、滑点大 |

**推荐策略：**
- 小额（< 1 万）：CEX（Binance、OKX）
- 大额（> 5 万）：DEX（Curve 3pool）

**Curve Finance 买入示例：**

访问：https://curve.fi/#/ethereum/pools/3pool

1. 连接 MetaMask 钱包
2. 选择 "Exchange"
3. 从 USDT 兑换到 USDC（滑点设为 1%）
4. 确认交易（Gas 费约 10-30 USDT）

### 步骤 5：等待回锚并卖出

**回锚标志：**

1. **官方公告**：Circle 发布储备金证明
2. **媒体报道**：主流媒体报道危机解除
3. **价格稳定**：USDC 在 $0.99-1.01 区间稳定 24 小时

**卖出策略：**

| 价格 | 仓位比例 | 备注 |
|-----|---------|------|
| **$0.97** | 0% | 继续持有 |
| **$0.98** | 20% | 部分止盈 |
| **$0.99** | 30% | 继续止盈 |
| **$1.00** | 50% | 全部清仓 |

**注意**：不要贪心等待 $1.01！

---

## 💡 进阶技巧

### 技巧 1：使用期权对冲

担心 USDC 永久脱锚？买入看跌期权对冲：

**示例：**
\`\`\`
买入 USDC: 100,000 个（成本 $90,000，价格 $0.90）
买入看跌期权: 行权价 $0.85，保费 $2,000

最坏情况: USDC 跌至 $0.70
- 现货亏损: $90,000 - $70,000 = -$20,000
- 期权收益: ($0.85 - $0.70) × 100,000 = +$15,000
- 净亏损: -$20,000 + $15,000 - $2,000 = -$7,000

无对冲亏损: -$20,000
有对冲亏损: -$7,000（降低 65%）
\`\`\`

### 技巧 2：利用 PSM 模块套利

当 USDC 在 Curve 跌至 $0.95，但 MakerDAO PSM 仍支持 1:1 兑换：

\`\`\`
1. Curve 以 $0.95 买入 100,000 USDC（成本 $95,000 USDT）
2. MakerDAO PSM 1:1 兑换为 100,000 DAI
3. DEX 卖出 DAI 换回 100,000 USDT
4. 净利润: $100,000 - $95,000 = $5,000（5.26%）
\`\`\`

**风险**：PSM 可能在恐慌时关闭。

### 技巧 3：跨交易所套利

如果 Binance USDC = $0.88，Coinbase USDC = $0.95：

\`\`\`
1. Binance 买入 USDC（$0.88）
2. 提币到 Coinbase
3. Coinbase 卖出 USDC（$0.95）
4. 净利润: 7.95%（扣除手续费）
\`\`\`

**风险**：提币可能被暂停。

### 技巧 4：提前布局

在风险事件发生前提前买入看跌期权：

**2023年3月 SVB 事件时间线：**
- **3月8日**：SVB 宣布财务困难（可提前买入看跌期权）
- **3月10日**：SVB 倒闭（USDC 开始脱锚）
- **3月11日**：USDC 跌至 $0.87（看跌期权暴涨 1000%）

---

## ⚠️ 风险警告

### 风险 1：永久脱锚（死亡螺旋）

**案例：UST 崩盘**

2022 年 5 月，UST 从 $1.00 跌至 $0.01，永久脱锚。

**原因**：算法稳定币，无真实储备金。

**教训**：只抄底有真实储备金的稳定币（USDC、USDT、DAI）。

### 风险 2：储备金真的没了

如果 Circle 真的倒闭，USDC 可能永久跌至 $0.50-0.70。

**应对**：
- 分散投资（不要 All In）
- 设置止损（跌破 $0.80 立即止损）

### 风险 3：监管打击

政府可能直接禁止稳定币，导致价格暴跌。

**应对**：
- 关注监管新闻
- 避免在监管风险高的国家操作

### 风险 4：流动性枯竭

恐慌时可能无法卖出 USDC。

**应对**：
- 使用流动性高的平台（Binance、Curve）
- 避免在小交易所买入

---

## ❓ 常见问题

**Q1：如何区分"暂时脱锚"和"永久死亡螺旋"？**

A：
- **暂时脱锚**：有真实储备金、发行商运营中、政府支持
- **永久死亡螺旋**：无储备金（算法稳定币）、发行商跑路、监管打击

**Q2：需要多少本金？**

A：
- 最低：1,000 USDT（小额测试）
- 推荐：1-5 万 USDT（分批抄底）
- 大户：10 万 USDT 以上（需要对冲）

**Q3：回锚需要多长时间？**

A：
- USDC（SVB 事件）：48 小时
- USDT（FTX 事件）：12 小时
- BUSD（退市）：3 个月
- UST（算法崩盘）：永久脱锚

**Q4：在哪里买入最安全？**

A：
- 小额：Binance、OKX（流动性高）
- 大额：Curve Finance（去中心化，无法冻结）

**Q5：需要设置止损吗？**

A：必须！建议止损线：
- USDC/USDT：$0.75-0.80
- DAI：$0.85-0.90
- 算法稳定币：不要抄底

---

## 📚 总结

**USDC 脱锚抄底 = 风险判断 + 分批买入 + 耐心等待**

### 核心要点

| 要点 | 说明 |
|-----|------|
| **监控价格** | CoinGecko、Telegram 预警 |
| **分析原因** | 技术性脱锚 vs 基本面崩溃 |
| **分批抄底** | $0.95/$0.90/$0.85 分批买入 |
| **选择渠道** | CEX（小额）vs DEX（大额） |
| **止损保护** | 跌破 $0.80 立即止损 |

### 适合人群

✅ 能承受 50%+ 亏损风险的投资者
✅ 有快速决策能力的玩家
✅ 能区分暂时脱锚和永久崩盘的老手

❌ 风险厌恶者（可能血本无归）
❌ 新手（判断错误代价极高）

### 预期收益

- **暂时脱锚**（USDC/USDT）：5-15% 收益
- **监管风险**（BUSD）：3-5% 收益
- **永久脱锚**（UST）：-90% 以上亏损

### 下一步行动

- [ ] 设置 CoinGecko 价格预警（< $0.98）
- [ ] 准备 1-5 万 USDT 本金
- [ ] 开通 Curve Finance 账户
- [ ] 制定分批买入计划
- [ ] 设置止损策略（< $0.80）

**最后提醒**：稳定币脱锚抄底风险极高，只适合有经验的投资者。永远不要 All In，永远设置止损！`,

  steps: [
    '监控稳定币价格（CoinGecko、Telegram 预警）',
    '分析脱锚原因（技术性 vs 基本面崩溃）',
    '分批抄底（$0.95/$0.90/$0.85 分批买入）',
    '选择买入渠道（CEX 小额 vs DEX 大额）',
    '等待回锚并卖出（$0.98/$0.99/$1.00 分批卖出）'
  ],

  risk_level: 5,
  apy_min: 50,
  apy_max: 150,
  min_investment: 10000,
  difficulty_level: 'expert',
  time_commitment: 'active',

  required_tools: [
    'CoinGecko 价格监控',
    'Binance、OKX 账户',
    'Curve Finance（大额）',
    'Telegram 预警机器人',
    '1-5 万 USDT 本金',
    '止损策略'
  ],

  status: 'published',
  reading_time_minutes: 20
};

// ========================
// 策略 18.2: DAI 折价套利
// ========================
const STRATEGY_18_2 = {
  title: 'DAI 折价套利 - PSM 模块无风险套利',
  slug: 'depeg-arbitrage-18-2-dai-discount-arbitrage',
  category: 'depeg-arbitrage',
  category_l1: 'arbitrage',
  category_l2: '稳定币脱锚',
  summary: '在 DAI 短期折价时（如 $0.98）买入，通过 MakerDAO PSM 模块 1:1 兑换 USDC 套利。几乎无风险，单次收益 1-3%。',
  content: `## 📖 故事：2022年11月 FTX 倒闭后的套利机会

**一个程序员的自动化套利机器**

2022 年 11 月 8 日，FTX 交易所突然倒闭，加密市场陷入恐慌。

大量用户抛售稳定币换回法币，导致 DAI 短期折价至 $0.985。

北京程序员小陈发现了一个几乎无风险的套利机会：

**市场状况：**
- **Curve DAI 价格**：$0.985
- **MakerDAO PSM 兑换率**：1 DAI = 1 USDC（无滑点）
- **套利空间**：1.5%

**小陈的操作：**

1. **在 Curve 买入 100,000 DAI**
   \`\`\`
   成本: 98,500 USDC
   Gas 费: 30 USDC
   \`\`\`

2. **通过 MakerDAO PSM 模块 1:1 兑换**
   \`\`\`
   100,000 DAI → 100,000 USDC
   手续费: 0.01% = 10 USDC
   Gas 费: 20 USDC
   \`\`\`

3. **计算净利润**
   \`\`\`
   获得: 100,000 USDC
   成本: 98,500 + 30 + 10 + 20 = 98,560 USDC
   净利润: 100,000 - 98,560 = 1,440 USDC（1.46%）
   \`\`\`

但小陈没有停在这里。他写了一个自动化脚本，24/7 监控 DAI 价格：

\`\`\`javascript
// 自动化套利脚本
async function monitorDAIArbitrage() {
  const daiPrice = await getCurvePrice('DAI/USDC');

  if (daiPrice < 0.995) {
    console.log(\`发现套利机会: DAI = \${daiPrice}\`);
    await executePSMArbitrage(100000); // 10万 DAI
  }
}

setInterval(monitorDAIArbitrage, 60000); // 每分钟检查
\`\`\`

**2022年11月-12月成果：**
- 捕捉套利机会：23 次
- 平均单次收益：1.2%
- **总收益**：27,600 USDC（两个月）

---

## 🧭 什么是 DAI 折价套利？

**定义**：当 DAI 在 DEX 上折价（< $1.00）时买入，通过 MakerDAO PSM（Peg Stability Module）模块 1:1 兑换为 USDC，赚取差价。

### PSM 模块原理

**PSM（Peg Stability Module）**：MakerDAO 推出的稳定币锚定机制。

**核心功能：**
1. **1:1 兑换**：DAI ↔ USDC，几乎无滑点
2. **极低手续费**：0.01%（USDC → DAI 为 0%）
3. **无需抵押**：直接兑换，无需超额抵押
4. **无限额度**：根据 PSM 池子容量（通常 > 10 亿美元）

**工作原理：**

\`\`\`
情况 1: DAI < $1.00（折价）
→ 用户在 Curve 买入便宜 DAI
→ 通过 PSM 1:1 兑换成 USDC
→ 赚取差价

情况 2: DAI > $1.00（溢价）
→ 用户通过 PSM 用 USDC 1:1 兑换 DAI
→ 在 Curve 卖出溢价 DAI
→ 赚取差价
\`\`\`

---

## ✅ 适合人群

| 条件 | 要求 |
|-----|------|
| **资金量** | 5,000 美元以上 |
| **技术能力** | 熟悉 MetaMask、DeFi 操作 |
| **Gas 费储备** | 50-200 USDC（以太坊主网） |
| **风险承受** | 极低（几乎无风险） |

**核心能力**：DeFi 操作熟练度 + 耐心监控

---

## 📋 完整操作步骤

### 步骤 1：监控 DAI 价格

**监控工具：**

| 工具 | 价格来源 | 推荐指数 |
|-----|---------|---------|
| **Curve Finance** | Curve 3pool DAI 价格 | ⭐⭐⭐⭐⭐ |
| **CoinGecko** | 聚合价格 | ⭐⭐⭐⭐ |
| **DeFi Llama** | 跨 DEX 价格对比 | ⭐⭐⭐⭐ |
| **自建脚本** | 链上实时价格 | ⭐⭐⭐⭐⭐ |

**实时价格查询：**

访问：https://curve.fi/#/ethereum/pools/3pool

查看 DAI/USDC 兑换率：
\`\`\`
1 DAI = 0.997 USDC → 折价 0.3%
1 DAI = 0.990 USDC → 折价 1.0%（套利机会）
1 DAI = 0.985 USDC → 折价 1.5%（重大机会）
\`\`\`

### 步骤 2：在 Curve 买入折价 DAI

**操作流程：**

1. **访问 Curve 3pool**
   - 网址：https://curve.fi/#/ethereum/pools/3pool/swap
   - 连接 MetaMask

2. **兑换 USDC → DAI**
   \`\`\`
   输入: 10,000 USDC
   输出: 10,152 DAI（假设价格 $0.985）
   滑点设置: 0.5%
   \`\`\`

3. **确认交易**
   - Gas 费：约 20-50 USDC（以太坊主网）
   - 到账时间：1-3 分钟

**注意**：使用 Layer 2 可降低 Gas 费！

| 网络 | Gas 费 | 推荐指数 |
|-----|--------|---------|
| **Ethereum** | 20-50 USDC | ⭐⭐⭐ |
| **Arbitrum** | 0.5-2 USDC | ⭐⭐⭐⭐⭐ |
| **Optimism** | 1-3 USDC | ⭐⭐⭐⭐ |

### 步骤 3：通过 PSM 模块 1:1 兑换

**访问 MakerDAO Oasis：**

网址：https://oasis.app/trade

**操作流程：**

1. **连接钱包**
   - 点击 "Connect Wallet"
   - 选择 MetaMask

2. **选择 PSM 兑换**
   - 从 DAI 兑换到 USDC
   - 输入数量：10,152 DAI

3. **查看兑换详情**
   \`\`\`
   兑换数量: 10,152 DAI
   获得: 10,152 USDC
   手续费: 0.01% = 1.02 USDC
   实际获得: 10,150.98 USDC
   \`\`\`

4. **确认交易**
   - Gas 费：约 15-30 USDC
   - 到账时间：1-3 分钟

### 步骤 4：计算利润

**完整成本核算：**

\`\`\`
买入成本: 10,000 USDC
Curve Gas 费: 30 USDC
PSM 手续费: 1.02 USDC
PSM Gas 费: 20 USDC
总成本: 10,051.02 USDC

获得: 10,150.98 USDC
净利润: 10,150.98 - 10,051.02 = 99.96 USDC（0.99%）
\`\`\`

**结论**：扣除所有费用后，仍有约 1% 收益。

### 步骤 5：优化和自动化

**使用 Arbitrum 降低 Gas 费：**

| 步骤 | Ethereum Gas | Arbitrum Gas | 节省 |
|-----|-------------|-------------|------|
| Curve 买入 | 30 USDC | 1 USDC | -97% |
| PSM 兑换 | 20 USDC | 0.5 USDC | -98% |
| **总计** | **50 USDC** | **1.5 USDC** | **-97%** |

**自动化脚本（Ethers.js）：**

\`\`\`javascript
const { ethers } = require('ethers');

async function executePSMArbitrage() {
  // 1. 查询 Curve DAI 价格
  const daiPrice = await curvePool.get_dy(1, 0, ethers.utils.parseUnits('1', 18));

  if (daiPrice < ethers.utils.parseUnits('0.995', 6)) {
    console.log('发现套利机会!');

    // 2. Curve 买入 DAI
    await curvePool.exchange(1, 0, usdcAmount, minDaiAmount);

    // 3. PSM 兑换 DAI → USDC
    await psmContract.sellGem(wallet.address, daiAmount);

    console.log('套利完成!');
  }
}

setInterval(executePSMArbitrage, 60000); // 每分钟检查
\`\`\`

---

## 💡 进阶技巧

### 技巧 1：反向套利（DAI 溢价）

当 DAI > $1.00 时，反向操作：

\`\`\`
1. PSM 用 USDC 1:1 兑换 DAI（手续费 0%）
2. Curve 卖出 DAI 换回 USDC
3. 赚取溢价差
\`\`\`

**示例：**
\`\`\`
DAI 价格: $1.015（溢价 1.5%）
1. PSM: 10,000 USDC → 10,000 DAI（手续费 0%）
2. Curve: 10,000 DAI → 10,150 USDC
3. 净利润: 10,150 - 10,000 - 50（Gas）= 100 USDC（1%）
\`\`\`

### 技巧 2：使用闪电贷放大本金

通过 Aave 闪电贷借入 100 万 USDC：

\`\`\`
1. 闪电贷借入 1,000,000 USDC
2. Curve 买入 DAI（价格 $0.99）
3. PSM 1:1 兑换回 USDC
4. 归还闪电贷 + 手续费（0.09%）
5. 净利润: 10,000 - 900 - 500（Gas）= 8,600 USDC
\`\`\`

**风险**：Gas 费更高，需要技术能力。

### 技巧 3：跨 DEX 套利

如果 Uniswap DAI = $0.990，Curve DAI = $0.995：

\`\`\`
1. Uniswap 买入 DAI（$0.990）
2. Curve 卖出 DAI（$0.995）
3. 净利润: 0.5%（无需 PSM）
\`\`\`

### 技巧 4：监控 PSM 容量

PSM 有容量上限（Debt Ceiling），满了就无法兑换。

**查看 PSM 容量：**

访问：https://makerburn.com/#/psm

查看 "PSM-USDC-A Debt Ceiling"：
\`\`\`
当前使用: 8.5 亿 DAI
上限: 10 亿 DAI
剩余容量: 1.5 亿 DAI ✅

如果剩余 < 1,000 万 DAI → ⚠️ 容量不足，套利可能失败
\`\`\`

---

## ⚠️ 风险警告

### 风险 1：Gas 费吞噬利润

以太坊主网 Gas 费可能高达 50-100 USDC，吞噬利润。

**应对**：
- 使用 Arbitrum/Optimism（Gas 费 < 2 USDC）
- 大额套利（> 5 万 USDC）才能覆盖 Gas 费

### 风险 2：PSM 容量不足

PSM 可能达到上限，无法兑换。

**应对**：
- 提前查看 PSM 容量（MakerBurn）
- 避免在容量 < 1,000 万时操作

### 风险 3：价格瞬间反转

DAI 价格可能在你买入后立即回归 $1.00。

**应对**：
- 只在折价 > 0.5% 时操作
- 快速执行（Curve + PSM 在 5 分钟内完成）

### 风险 4：智能合约风险

PSM 或 Curve 可能存在漏洞。

**应对**：
- 只使用经过审计的协议（MakerDAO、Curve）
- 小额测试后再大额操作

---

## ❓ 常见问题

**Q1：DAI 折价套利还有机会吗？**

A：
- 2022-2023 年：每月 5-10 次机会
- 2024 年：每月 2-5 次机会（市场效率提高）
- 未来：机会减少，但仍存在

**Q2：需要多少本金？**

A：
- 最低：5,000 USDC（覆盖 Gas 费）
- 推荐：2-5 万 USDC（降低 Gas 费占比）
- 大户：10 万 USDC 以上（使用闪电贷）

**Q3：为什么不是所有人都在套利？**

A：
- Gas 费太高（以太坊主网）
- 技术门槛（需要熟悉 DeFi）
- 监控成本（需要 24/7 监控价格）

**Q4：PSM 手续费是多少？**

A：
- DAI → USDC：0.01%
- USDC → DAI：0%（鼓励铸造 DAI）

**Q5：可以用其他稳定币吗？**

A：可以！PSM 支持：
- USDC（最常用）
- USDP（Pax Dollar）
- GUSD（Gemini Dollar）

---

## 📚 总结

**DAI 折价套利 = Curve 买入 + PSM 兑换 + 几乎无风险**

### 核心要点

| 要点 | 说明 |
|-----|------|
| **价格监控** | Curve 3pool，折价 > 0.5% 时操作 |
| **买入渠道** | Curve Finance（流动性最高） |
| **兑换渠道** | MakerDAO PSM（1:1 无滑点） |
| **Gas 优化** | 使用 Arbitrum/Optimism（降低 97% Gas 费） |
| **容量检查** | MakerBurn 查看 PSM 剩余容量 |

### 适合人群

✅ 熟悉 DeFi 操作的玩家
✅ 有 5,000 USDC 以上本金的投资者
✅ 能编写自动化脚本的程序员（可选）

❌ DeFi 新手（操作复杂）
❌ 小额资金（Gas 费占比过高）

### 预期收益

- **小额**（5,000 USDC）：单次 25-50 USDC（0.5-1%）
- **中额**（5 万 USDC）：单次 250-750 USDC（0.5-1.5%）
- **大额**（50 万 USDC）：单次 2,500-7,500 USDC（0.5-1.5%）

### 下一步行动

- [ ] 开通 MetaMask 钱包
- [ ] 准备 5,000 USDC 本金 + 50-200 USDC Gas 费
- [ ] 熟悉 Curve Finance 操作
- [ ] 熟悉 MakerDAO PSM 操作
- [ ] 小额测试（100 USDC）
- [ ] 编写自动化监控脚本（可选）

**最后提醒**：DAI 折价套利几乎无风险，但需要熟悉 DeFi 操作。新手建议先用小额测试，熟练后再增加本金。`,

  steps: [
    '监控 DAI 价格（Curve Finance，折价 > 0.5%）',
    '在 Curve 买入折价 DAI（使用 Arbitrum 降低 Gas）',
    '通过 PSM 模块 1:1 兑换为 USDC（手续费 0.01%）',
    '计算利润（扣除 Gas 费和手续费）',
    '优化和自动化（编写监控脚本，24/7 运行）'
  ],

  risk_level: 2,
  apy_min: 10,
  apy_max: 50,
  min_investment: 5000,
  difficulty_level: 'intermediate',
  time_commitment: 'passive',

  required_tools: [
    'MetaMask 钱包',
    'Curve Finance',
    'MakerDAO PSM',
    'Arbitrum/Optimism（降低 Gas）',
    '5,000 USDC 本金 + 50-200 USDC Gas 费',
    '自动化脚本（可选）'
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

  const strategies = [STRATEGY_18_1, STRATEGY_18_2];

  for (const strategy of strategies) {
    try {
      console.log(`正在创建策略 ${strategy.slug.includes('18-1') ? '18.1' : '18.2'}: ${strategy.title}...`);

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

      console.log(`✅ 策略 ${strategy.slug.includes('18-1') ? '18.1' : '18.2'} 创建成功! ID: ${response.data.data.id}`);
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
    console.log('🎉 策略 18.1 和 18.2 创建完成！');
    console.log(`📊 当前数据库中共有 ${totalCount} 个策略`);
    console.log('========================================');

  } catch (error) {
    console.error('获取策略总数失败:', error.message);
  }
}

// 执行
createStrategies().catch(console.error);
