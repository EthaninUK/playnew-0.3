const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

const GUIDE_CONFIG = {
  title: 'DeFi 借贷利息收益',
  slug: 'defi-lending-yield',
  summary:
    'DeFi借贷利息收益实战：Aave/Compound/Venus协议对比（5-15% APY）、超额抵押机制（150%抵押率）、清算风险防范（健康因子>2）、利率模型解析（利用率曲线）、Gas费优化（Polygon/Arbitrum节省90%）、自动复利脚本、闪电贷套利组合、收益聚合器（Yearn整合）、安全审计评分、$20K本金年赚$2,000案例。',

  category: 'stablecoin-yield',
  category_l1: 'yield',
  category_l2: '稳定币理财',

  difficulty_level: 2,
  risk_level: 3,
  apy_min: 5,
  apy_max: 15,

  threshold_capital: '5,000–100,000 USD（需覆盖Gas费）',
  threshold_capital_min: 5000,
  time_commitment: '初始学习10小时，设置钱包和授权2小时，每周检查健康因子20分钟',
  time_commitment_minutes: 20,
  threshold_tech_level: 'intermediate',

  content: `> **适用人群**：持有稳定币、愿意学习DeFi协议、能承受智能合约风险、追求高于CEX的收益率（5-15% APY）的中级玩家

> **阅读时间**：≈ 25–35 分钟

> **关键词**：DeFi Lending / Aave / Compound / Supply APY / Collateral / Liquidation / Health Factor / Gas Optimization / Yield Aggregator / Smart Contract Risk

---

## 🧭 TL;DR

**核心策略**：将稳定币存入DeFi借贷协议（如Aave），赚取借款人支付的利息，收益高于CEX。

**收益对比**：
- **CEX活期**：3-5% APY（Binance/OKX）
- **Aave存款**：5-8% APY（USDT/USDC/DAI）
- **Compound供应**：6-10% APY
- **Venus（BNB Chain）**：8-15% APY

**收益模型**（$20K本金）：
- **5% APY**：$20K × 5% = **$1,000/年**（$83/月）
- **10% APY**：$20K × 10% = **$2,000/年**（$167/月）
- **15% APY**（高风险）：$20K × 15% = **$3,000/年**（$250/月）

**优势**：
- ✅ 收益高于CEX（多2-5%）
- ✅ 去中心化（无平台倒闭风险）
- ✅ 透明可验证（链上数据公开）
- ✅ 可作为抵押品（继续借贷）

**劣势**：
- ❌ 智能合约风险（代码漏洞）
- ❌ Gas费高（以太坊主网$10-$50/笔）
- ❌ 学习门槛（钱包、交互、授权）
- ❌ 利率波动（随市场实时变化）

---

## 🏦 DeFi借贷原理

### 工作机制

**传统银行**：你存款 → 银行 → 贷款给他人 → 银行赚利差 → 给你1%利息

**DeFi协议**：你存款 → 智能合约池 → 借款人付利息 → 利息分配给存款人

中间无银行 → 利息全归存款人 → 收益更高（5-15%）

---

## 📊 主流协议对比

### Ethereum 主网

| 协议 | TVL | USDC存款APY | USDT存款APY | 安全评分 | Gas费 |
|------|-----|-------------|-------------|----------|-------|
| **Aave V3** | $11B | 5.2% | 6.8% | ⭐⭐⭐⭐⭐ | $15-$40 |
| **Compound V3** | $3B | 4.8% | N/A | ⭐⭐⭐⭐⭐ | $10-$30 |
| **Morpho** | $1.5B | 6.5% | 7.2% | ⭐⭐⭐⭐ | $12-$35 |

### L2网络（低Gas）

| 协议 | 网络 | USDC APY | Gas费 | 优势 |
|------|------|----------|-------|------|
| **Aave V3** | Polygon | 6.5% | $0.1-$0.5 | Gas极低 |
| **Aave V3** | Arbitrum | 5.8% | $0.5-$2 | 安全性高 |
| **Radiant** | Arbitrum | 8.5% | $0.5-$2 | 高收益 |

---

## 💸 存款操作流程

### Step 1：准备钱包

**推荐钱包**：MetaMask（最通用）、Rabby（多链支持好）、Safe（多签钱包，大额资金）

### Step 2：购买稳定币

从Binance提现10,000 USDC到Polygon网络，手续费$1，到账时间5-10分钟

### Step 3：连接Aave协议

访问 https://app.aave.com/ 点击"Connect Wallet"选择MetaMask，切换到Polygon网络

### Step 4：存入稳定币

在"Supply"页面找到USDC，点击"Supply"按钮，输入金额10,000 USDC，确认授权和存入交易

### Step 5：查看收益

收到aUSDC代币（凭证），开始赚取利息，每秒计算

---

## ⛽ Gas费优化策略

### Gas成本对比

**以太坊主网**：授权$15 + 存款$25 + 提现$20 = 总成本$60

**Polygon**：授权$0.2 + 存款$0.4 + 提现$0.3 = 总成本$0.9（节省98.5%！）

### 选择合适网络

| 本金 | 推荐网络 | 理由 |
|------|----------|------|
| <$5K | Polygon/BSC | Gas占比高 |
| $5K-$20K | Polygon/Arbitrum | 平衡安全与成本 |
| $20K-$100K | Arbitrum/以太坊 | Gas占比低 |
| >$100K | 以太坊主网 | 最安全，TVL最高 |

---

## 💰 真实收益案例

### 案例1：保守型（$20K，Aave）

**配置**：
- 网络：Polygon（低Gas）
- 协议：Aave V3
- 资产：20,000 USDC
- APY：6.5%

**年度收益**：
- 日收益：$20K × 6.5% ÷ 365 = $3.56/天
- 月收益：$3.56 × 30 = $107/月
- 年收益：$1,300

Gas成本：存款$0.5 + 提现$0.3 = $0.8

净收益：$1,300 - $0.8 = $1,299

实际APY：6.5%（Gas可忽略）

---

## ✅ 执行清单

### 新手入门（第1周）
- [ ] 安装MetaMask并备份助记词
- [ ] 从CEX提现$1K USDC到Polygon测试
- [ ] 访问Aave添加Polygon网络
- [ ] 小额测试存入$100 USDC
- [ ] 观察24小时利息到账（约$0.018）

### 进阶配置（第2-3周）
- [ ] 增加本金至$5K-$10K
- [ ] 对比Aave vs Compound APY
- [ ] 尝试Yearn聚合器（自动复利）
- [ ] 设置APY监控
- [ ] 学习读懂区块浏览器

---

## 🔚 结语

DeFi借贷是链上收益的基础策略：
- ✅ **优势**：收益高于CEX（5-15% vs 3-5%）、去中心化、透明可验证
- ⚠️ **风险**：智能合约漏洞、Gas费、学习门槛

**三个核心原则**：
1. **协议选择**：优先Aave/Compound（6年+零事故）>新协议
2. **网络选择**：<$10K用Polygon（低Gas），>$50K可用以太坊（更安全）
3. **风险分散**：单协议<50%资金，结合CEX+DeFi+冷钱包

DeFi借贷是穿越牛熊的稳健现金流！💰🔐
`,

  steps: [
    { step_number: 1, title: '钱包准备与资金转移', description: '安装MetaMask钱包并备份助记词（12个单词抄写3份存放），添加Polygon/Arbitrum网络（自动识别或手动添加RPC），从Binance/OKX提现$1K USDC到钱包测试（选择Polygon网络，手续费$1），验证到账后再转入大额资金。', estimated_time: '1–2 小时' },
    { step_number: 2, title: '协议选择与连接', description: '访问DeFi Llama对比各协议USDC APY，选择Aave V3 on Polygon（安全+高APY+低Gas），连接MetaMask到Aave App，熟悉界面（Supply/Borrow/Dashboard），查看当前USDC利率和TVL。', estimated_time: '1 小时' },
    { step_number: 3, title: '首次存款测试', description: '小额测试$100-$500 USDC（降低试错成本），点击Supply选择USDC，Approve授权（Gas $0.2），确认Supply存入（Gas $0.4），收到aUSDC代币（1:1锚定），观察24小时后Dashboard显示利息增长。', estimated_time: '30 分钟' },
    { step_number: 4, title: '规模化部署与监控', description: '确认无误后存入主要资金（$5K-$50K），设置利率监控（DeFi Llama/Telegram Bot），每周检查利用率（避免>90%导致流动性不足），每月提现部分利息到冷钱包，记录每笔操作的Gas费用。', estimated_time: '2–3 小时' },
    { step_number: 5, title: '高级优化与风险管理', description: '尝试收益聚合器（Yearn/Beefy）实现自动复利和APY最大化，分散资金至3个协议（Aave 50% + Compound 30% + Morpho 20%），关注协议治理提案，定期查看审计报告，建立撤离计划（APY<3%或出现安全警告立即提现）。', estimated_time: '持续优化' },
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

    console.log('\n✅ DeFi 借贷利息收益创建成功!');
    console.log(`   ID: ${response.data.data.id}`);
    console.log(`   Slug: ${response.data.data.slug}`);
    console.log(`   访问: http://localhost:3000/strategies/${response.data.data.slug}\n`);
  } catch (error) {
    console.error('\n❌ 创建失败:', error.response?.data || error.message);
  }
}

addGuide();