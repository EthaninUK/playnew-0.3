const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

// ===== 8.1 Lido stETH 流动性质押 =====
const STRATEGY_8_1 = {
  title: 'Lido stETH 流动性质押 - ETH 质押龙头协议',
  slug: 'lido-steth-liquid-staking',
  summary: '通过 Lido 质押 ETH 获得 stETH，保持流动性的同时赚取 ETH 2.0 质押收益（约4-5% APR），无需运行节点，无最低质押要求。',

  category: 'lst-staking',
  category_l1: 'yield',
  category_l2: 'LST 质押',

  difficulty_level: 2,
  risk_level: 3,

  apy_min: 3.5,
  apy_max: 5.5,
  threshold_capital: '0.01 ETH 起',
  threshold_capital_min: 20,
  time_commitment: '30 分钟设置 + 每月 10 分钟监控',
  time_commitment_minutes: 40,
  threshold_tech_level: 'intermediate',

  content: `> **适合人群**：持有 ETH、想要质押收益但保持流动性、不想运行验证节点的用户
> **阅读时间**：约 12 分钟
> **关键词**：Lido / stETH / 流动性质押 / ETH 2.0 / 验证者 / PoS

---

## 🎯 什么是 Lido stETH？

### 用大白话解释

想象一下：
- **传统银行定期存款**：钱锁定1年，中途不能取，到期才有利息
- **Lido 质押**：把 ETH 存入，立即获得 stETH（1:1），随时可以卖出，每天自动增长利息
- **核心优势**：既赚利息，又保持流动性

### 收益来源

你的收益来自 ETH 2.0 质押奖励：
- **验证者奖励**：3.5-4.5% APR
- **MEV 收益**：0.5-1% APR
- **扣除协议费（10%）后**：3.5-5.5% APR

---

## 📋 准备工作

### 你需要准备

1. **ETH**（0.01 ETH 起，推荐 0.1+ ETH）
2. **Gas 费**（0.005-0.01 ETH，约 10-20 美元）
3. **MetaMask 钱包**

### 主要风险

- **智能合约风险**：Lido 虽经审计，但仍可能有漏洞
- **stETH 脱锚风险**：市场恐慌时可能短暂跌破 1 ETH（2022年曾跌至 0.93）
- **罚没风险**：验证节点作恶会被罚（概率 < 0.01%）

---

## 🚀 操作步骤

### 步骤 1：访问 Lido

1. 访问 https://lido.fi
2. 点击"Connect Wallet"
3. 选择 MetaMask

### 步骤 2：质押 ETH

1. 输入质押数量（如 1 ETH）
2. 查看将收到的 stETH（1:1）
3. 点击"Submit"
4. 确认交易（Gas 约 10-20 美元）

### 步骤 3：获得 stETH

1. 等待交易确认（1-3 分钟）
2. 在 MetaMask 添加 stETH 代币
   - 合约：0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84
3. 每天 UTC 12:00，stETH 余额自动增长

---

## 💰 成本与收益

### 示例计算

**1 ETH 质押，4.2% APR，持有 1 年**
- 收益：0.042 ETH（约 84 美元）
- Gas 成本：20 美元
- **净收益**：64 美元

**10 ETH 质押，4.2% APR，持有 1 年**
- 收益：0.42 ETH（约 840 美元）
- **净收益率**：4.1%

---

## 🔥 进阶技巧

### 技巧 1：使用 wstETH

- wstETH = 包装的 stETH（不 rebase）
- 更适合在 DeFi 中使用（Aave、Maker）
- 在 https://stake.lido.fi/wrap 转换

### 技巧 2：Curve 流动性挖矿

- 在 Curve stETH/ETH 池提供流动性
- 额外赚取 CRV 奖励
- 总 APY 可达 6-9%

### 技巧 3：脱锚套利

- 当 stETH 跌至 0.95-0.98 ETH 时买入
- 等待回锚至 1 ETH
- 赚取 2-5% 套利收益

---

## ❓ 常见问题

**Q: stETH 和 ETH 是 1:1 吗？**
> 理论上是，但市场可能有 0.98-1.02 的偏差。

**Q: 可以随时提取吗？**
> 可以在 Curve/Uniswap 即时兑换，或通过 Lido 提款（需排队 1-5 天）。

**Q: stETH 余额为什么每天变化？**
> Rebase 机制，质押奖励直接体现在余额增长上。

---

## ✅ 行动清单

- [ ] 准备 0.01+ ETH 和 Gas 费
- [ ] 访问 lido.fi，连接钱包
- [ ] 质押 ETH，获得 stETH
- [ ] 添加 stETH 代币到 MetaMask
- [ ] 每月检查收益和 APR
- [ ] （可选）转换 wstETH 用于 DeFi
- [ ] （可选）Curve 流动性挖矿

---

## 🎓 总结

**Lido stETH 核心优势**：
- ✅ 零门槛（0.01 ETH 起）
- ✅ 保持流动性（随时可交易）
- ✅ 无需运行节点
- ✅ DeFi 集成度最高（TVL 200 亿+）

**适合人群**：
- 持有 ETH 想要质押收益
- 不想锁定流动性
- 不会运行验证节点

让你的 ETH 开始赚钱！🚀
`,

  steps: [
    { step_number: 1, title: '准备 ETH', description: '准备至少 0.01 ETH 和 Gas 费', estimated_time: '5 分钟' },
    { step_number: 2, title: '质押获得 stETH', description: '访问 lido.fi 质押 ETH', estimated_time: '10 分钟' },
    { step_number: 3, title: '观察收益', description: '每天检查 stETH 余额增长', estimated_time: '2 分钟/天' },
  ],
};

// ===== 8.2 Rocket Pool rETH 去中心化质押 =====
const STRATEGY_8_2 = {
  title: 'Rocket Pool rETH 去中心化质押 - 真正的去中心化方案',
  slug: 'rocket-pool-reth-decentralized-staking',
  summary: '使用 Rocket Pool 质押 ETH 获得 rETH，支持去中心化节点运营商，赚取质押收益（3-5% APR），推动以太坊去中心化。',

  category: 'lst-staking',
  category_l1: 'yield',
  category_l2: 'LST 质押',

  difficulty_level: 2,
  risk_level: 3,

  apy_min: 3,
  apy_max: 5,
  threshold_capital: '0.01 ETH 起',
  threshold_capital_min: 20,
  time_commitment: '30 分钟设置 + 每月 10 分钟监控',
  time_commitment_minutes: 40,
  threshold_tech_level: 'intermediate',

  content: `> **适合人群**：认可去中心化理念、持有 ETH、支持社区节点运营商的用户
> **阅读时间**：约 12 分钟
> **关键词**：Rocket Pool / rETH / 去中心化 / 节点运营商 / RPL

---

## 🎯 什么是 Rocket Pool rETH？

### 用大白话解释

想象一下：
- **Lido**：30个精选的专业节点（有点像大公司）
- **Rocket Pool**：数千个社区节点（任何人都可以运行，像个体户）
- **核心理念**：更去中心化，支持"草根"验证者

### Rocket Pool vs Lido

| 特性 | Rocket Pool | Lido |
|------|-------------|------|
| 去中心化 | 极高（无需许可） | 中（30+精选节点） |
| APR | 3-5% | 3.5-5.5% |
| TVL | 25 亿美元 | 200+ 亿美元 |
| 协议费 | 15% | 10% |
| LST 代币 | rETH（价格增长） | stETH（余额增长） |

### 收益来源

- **验证者奖励**：3.5-4% APR
- **MEV 收益**：0.5-1% APR
- **扣除 15% 协议费后**：3-5% APR

---

## 📋 准备工作

### 你需要准备

1. **ETH**（0.01 ETH 起，推荐 0.5+ ETH）
2. **Gas 费**（0.005-0.01 ETH）
3. **MetaMask 钱包**

### 理解 rETH 机制

**与 stETH 的区别**：
- stETH：余额每天增长（1 stETH → 1.001 stETH）
- rETH：价格每天增长（1 rETH = 1.05 ETH → 1.051 ETH）

**示例**：
- 质押 1 ETH → 获得约 0.952 rETH（因为 1 rETH = 1.05 ETH）
- 1年后：0.952 rETH 价值约 1.038 ETH（3.8% 收益）

---

## 🚀 操作步骤

### 步骤 1：访问 Rocket Pool

1. 访问 https://stake.rocketpool.net
2. 连接 MetaMask

### 步骤 2：质押 ETH

1. 输入质押数量（如 1 ETH）
2. 查看将收到的 rETH（约 0.952 rETH）
3. 查看当前汇率（1 rETH = ? ETH）
4. 点击"Stake"

### 步骤 3：获得 rETH

1. 确认交易（Gas 约 10-20 美元）
2. 在 MetaMask 添加 rETH
   - 合约：0xae78736Cd615f374D3085123A210448E74Fc6393
3. 定期检查 rETH 汇率增长

---

## 💰 成本与收益

### 示例计算

**1 ETH 质押，3.8% APR，持有 1 年**
- 初始：1 ETH → 0.952 rETH
- 1年后：0.952 rETH 价值约 1.038 ETH
- **净收益**：0.038 ETH

**10 ETH 质押，3.8% APR，持有 1 年**
- 净收益：0.38 ETH（约 760 美元）

---

## 🔥 进阶技巧

### 技巧 1：Curve rETH/wstETH 流动性

- 在 Curve rETH/wstETH 池提供流动性
- 同时赚取两种 LST 的质押收益
- 总 APY：7-12%

### 技巧 2：运行节点（高级）

如果你有 16 ETH + RPL：
- 成为 Rocket Pool 节点运营商
- 自己质押 8 ETH，匹配 24 ETH
- 赚取额外佣金（6-15% APR）

### 技巧 3：rETH 折价套利

- 监控 Curve rETH 价格
- 折价 > 1% 时买入
- 等待回锚获利

---

## ❓ 常见问题

**Q: 为什么 rETH APR 比 stETH 低？**
> 协议费 15% vs 10%，且节点更分散。但换来更高去中心化。

**Q: rETH 数量会变吗？**
> 不会，rETH 数量固定，价格增长。

**Q: 如何卖出 rETH？**
> Curve/Uniswap 即时兑换，或 Rocket Pool 官方提款（排队 1-7 天）。

---

## ✅ 行动清单

- [ ] 准备 ETH 和 Gas 费
- [ ] 访问 stake.rocketpool.net
- [ ] 质押 ETH，获得 rETH
- [ ] 添加 rETH 到 MetaMask
- [ ] 每月检查汇率增长
- [ ] （可选）Curve 流动性挖矿
- [ ] （可选）研究运行节点

---

## 🎓 总结

**Rocket Pool 核心价值**：
- ✅ 最去中心化（任何人可运行节点）
- ✅ 支持社区验证者
- ✅ 长期主义理念
- ✅ 抗审查能力强

**适合人群**：
- 认可去中心化价值
- 可接受略低 APR（换取去中心化）
- 长期持有 ETH

让 ETH 质押更去中心化！🚀
`,

  steps: [
    { step_number: 1, title: '准备 ETH', description: '准备至少 0.01 ETH', estimated_time: '5 分钟' },
    { step_number: 2, title: '质押获得 rETH', description: '访问 Rocket Pool 质押', estimated_time: '10 分钟' },
    { step_number: 3, title: '观察汇率', description: '检查 rETH 价格增长', estimated_time: '5 分钟/月' },
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
    const strategies = [STRATEGY_8_1, STRATEGY_8_2];

    console.log('\n开始创建 8.1 和 8.2 策略...\n');

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
    console.log('访问: http://localhost:3000/strategies?category=lst-staking\n');
  } catch (error) {
    console.error('\n❌ 创建失败:', error.response?.data || error.message);
  }
}

addStrategies();