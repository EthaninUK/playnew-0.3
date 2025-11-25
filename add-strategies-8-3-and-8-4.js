const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

// ===== 8.3 Frax sfrxETH 双重收益 =====
const STRATEGY_8_3 = {
  title: 'Frax sfrxETH 双重收益 - ETH 质押 + FXS 激励',
  slug: 'frax-sfrxeth-dual-yield',
  summary: '质押 ETH 到 Frax Finance 获得 frxETH，再质押到 sfrxETH 金库，赚取 ETH 质押收益 + FXS 代币奖励，总 APR 4-6%。',

  category: 'lst-staking',
  category_l1: 'yield',
  category_l2: 'LST 质押',

  difficulty_level: 3,
  risk_level: 3,

  apy_min: 4,
  apy_max: 8,
  threshold_capital: '0.1 ETH 起',
  threshold_capital_min: 200,
  time_commitment: '1 小时设置 + 每月 15 分钟监控',
  time_commitment_minutes: 75,
  threshold_tech_level: 'intermediate',

  content: `> **适合人群**：了解 DeFi、追求更高收益、看好 Frax 生态的用户
> **阅读时间**：约 10 分钟
> **关键词**：Frax / frxETH / sfrxETH / 双重收益 / FXS

---

## 🎯 什么是 Frax sfrxETH？

### 用大白话解释

Frax 的 ETH 质押有两步：
1. **ETH → frxETH**：1:1 兑换，frxETH 本身不产生收益
2. **frxETH → sfrxETH**：质押 frxETH 到金库，赚取收益

### 为什么要两层？

- **frxETH**：可在 DeFi 自由使用（Curve 做市等）
- **sfrxETH**：锁定在金库，获得所有质押奖励

### 双重收益来源

1. **ETH 质押奖励**：4-5% APR
2. **FXS 代币激励**：1-3% APR
3. **总 APR**：5-8%（高于 Lido/Rocket Pool）

---

## 📋 准备工作

### 你需要准备

1. **ETH**（0.1+ ETH，推荐 1+ ETH）
2. **Gas 费**（0.01-0.02 ETH，需要两次交易）
3. **MetaMask 钱包**

### 理解 Frax 机制

**frxETH vs sfrxETH**：
- **frxETH**：流动性代币，无收益，可自由使用
- **sfrxETH**：质押凭证，有收益，价格增长

**为什么收益更高？**
- 只有质押 sfrxETH 的人获得奖励
- 未质押的 frxETH 持有者不分奖励
- 所以质押者获得"超额收益"

---

## 🚀 操作步骤

### 步骤 1：ETH → frxETH

1. 访问 https://app.frax.finance/frxeth/mint
2. 连接钱包
3. 输入 ETH 数量
4. 点击"Mint frxETH"（1:1 兑换）
5. 确认交易（Gas 约 10-15 美元）

### 步骤 2：frxETH → sfrxETH

1. 访问 https://app.frax.finance/frxeth/stake
2. 输入 frxETH 数量
3. 点击"Stake"
4. 确认交易（Gas 约 10-15 美元）
5. 获得 sfrxETH

### 步骤 3：观察收益

- sfrxETH 价格每天增长
- 查看当前汇率：1 sfrxETH = ? frxETH
- 定期领取 FXS 奖励（如有）

---

## 💰 成本与收益

### 示例计算

**1 ETH 质押，6% APR，持有 1 年**
- ETH 质押收益：4.5%
- FXS 激励：1.5%
- 总收益：0.06 ETH
- Gas 成本：0.02 ETH
- **净收益**：0.04 ETH（4%）

**10 ETH 质押，6% APR，持有 1 年**
- 总收益：0.6 ETH（约 1200 美元）
- **净收益率**：5.8%

---

## 🔥 进阶技巧

### 技巧 1：Curve frxETH/ETH 流动性

不质押成 sfrxETH，而是：
- 在 Curve frxETH/ETH 池做市
- 赚取交易手续费 + CRV 奖励
- 总 APY 可达 8-15%（但有无常损失风险）

### 技巧 2：质押 FXS 提升收益

- 质押 FXS 代币获得 veFXS
- veFXS 可提升 sfrxETH 收益（Boost）
- 适合长期看好 Frax 的用户

### 技巧 3：监控 frxETH 锚定

- frxETH 应该 ≈ 1 ETH
- 如果折价（如 0.98 ETH），可以买入套利
- Curve 是主要交易场所

---

## ❓ 常见问题

**Q: 为什么 frxETH 和 sfrxETH 分开？**
> 给用户选择：要流动性（frxETH）还是要收益（sfrxETH）。

**Q: frxETH 有收益吗？**
> 没有，只有质押成 sfrxETH 才有收益。

**Q: 可以随时赎回吗？**
> 可以。sfrxETH → frxETH → ETH，需要两步交易。

**Q: Frax 安全吗？**
> 经过审计，但运营时间比 Lido/Rocket Pool 短。建议分散风险。

---

## ✅ 行动清单

- [ ] 准备 ETH 和 Gas 费
- [ ] 访问 Frax 应用
- [ ] Mint frxETH（ETH → frxETH）
- [ ] Stake sfrxETH（frxETH → sfrxETH）
- [ ] 添加 sfrxETH 到钱包
- [ ] 每月检查汇率和 FXS 奖励
- [ ] （可选）Curve 流动性挖矿

---

## 🎓 总结

**Frax sfrxETH 核心优势**：
- ✅ 收益更高（5-8% vs Lido 4-5%）
- ✅ 双重收益（ETH 质押 + FXS）
- ✅ 灵活选择（frxETH 流动 vs sfrxETH 收益）

**适合人群**：
- 追求更高 APR
- 了解 DeFi 复杂机制
- 看好 Frax 生态

让 ETH 质押收益更高！🚀
`,

  steps: [
    { step_number: 1, title: 'Mint frxETH', description: 'ETH 兑换成 frxETH', estimated_time: '10 分钟' },
    { step_number: 2, title: 'Stake sfrxETH', description: 'frxETH 质押成 sfrxETH', estimated_time: '10 分钟' },
    { step_number: 3, title: '观察收益', description: '检查 sfrxETH 汇率和 FXS 奖励', estimated_time: '5 分钟/月' },
  ],
};

// ===== 8.4 Coinbase cbETH 合规质押 =====
const STRATEGY_8_4 = {
  title: 'Coinbase cbETH 合规质押 - 合规交易所背书',
  slug: 'coinbase-cbeth-compliant-staking',
  summary: '通过 Coinbase 质押 ETH 获得 cbETH，享受合规交易所背书和高流动性，APR 3-4.5%，适合追求安全合规的用户。',

  category: 'lst-staking',
  category_l1: 'yield',
  category_l2: 'LST 质押',

  difficulty_level: 1,
  risk_level: 2,

  apy_min: 3,
  apy_max: 4.5,
  threshold_capital: '任意金额',
  threshold_capital_min: 10,
  time_commitment: '15 分钟设置',
  time_commitment_minutes: 15,
  threshold_tech_level: 'beginner',

  content: `> **适合人群**：追求合规、信任中心化交易所、新手用户
> **阅读时间**：约 8 分钟
> **关键词**：Coinbase / cbETH / 合规 / 中心化 / 简单

---

## 🎯 什么是 Coinbase cbETH？

### 用大白话解释

- **Coinbase**：美国最大合规加密货币交易所（纳斯达克上市）
- **cbETH**：Coinbase 的流动性质押代币
- **核心优势**：合规、简单、流动性好

### cbETH vs 去中心化 LST

| 特性 | Coinbase cbETH | Lido stETH | Rocket Pool rETH |
|------|---------------|-----------|-----------------|
| 类型 | 中心化 | 去中心化 | 去中心化 |
| APR | 3-4.5% | 3.5-5.5% | 3-5% |
| 合规性 | 极高 | 中 | 中 |
| 简单度 | 极简 | 简单 | 简单 |
| 协议费 | 25% | 10% | 15% |

### 收益来源

- **ETH 质押奖励**：扣除 25% 协议费后
- **净 APR**：3-4.5%

---

## 📋 准备工作

### 方式 1：Coinbase 账户质押

1. **注册 Coinbase**（如未注册）
2. **完成 KYC**（身份验证）
3. **充值 ETH**
4. **一键质押**（最简单）

### 方式 2：链上购买 cbETH

1. **准备 MetaMask**
2. **在 Uniswap/Curve 买 cbETH**
3. **持有即可获得收益**（cbETH 价格增长）

---

## 🚀 操作步骤（Coinbase 账户）

### 步骤 1：登录 Coinbase

1. 访问 https://www.coinbase.com
2. 登录账户

### 步骤 2：质押 ETH

1. 进入"赚币"页面
2. 选择"ETH 质押"
3. 输入质押数量
4. 点击"质押"
5. 自动获得 cbETH

### 步骤 3：查看收益

- cbETH 价格每天增长
- 在 Coinbase 账户查看余额
- 随时可以交易或提现

---

## 💰 成本与收益

### 示例计算

**1 ETH 质押，3.5% APR，持有 1 年**
- 收益：0.035 ETH
- 成本：0（Coinbase 内部操作无 Gas）
- **净收益**：0.035 ETH

**对比**：
- Lido：4.2% APR（但需 20 美元 Gas）
- Coinbase：3.5% APR（零 Gas）
- 小额资金 Coinbase 更划算

---

## 🔥 优势与劣势

### 优势

1. **极简操作**：几分钟完成
2. **零 Gas 费**：Coinbase 内部操作
3. **合规背书**：美国上市公司
4. **流动性好**：Coinbase 支持 cbETH 交易
5. **新手友好**：无需学习 DeFi

### 劣势

1. **中心化风险**：资金托管在 Coinbase
2. **协议费高**：25%（vs Lido 10%）
3. **APR 较低**：3-4.5%（vs Lido 4-5.5%）
4. **监管风险**：依赖 Coinbase 运营

---

## ❓ 常见问题

**Q: cbETH 安全吗？**
> Coinbase 是上市公司，受美国监管。但仍是中心化平台，有托管风险。

**Q: 为什么 APR 比 Lido 低？**
> Coinbase 协议费 25%，且作为中心化平台成本更高。

**Q: 可以随时赎回吗？**
> 可以在 Coinbase 即时交易 cbETH，或提取到链上使用。

**Q: cbETH 数量会变吗？**
> 不会，cbETH 价格增长（类似 rETH）。

---

## ✅ 行动清单

- [ ] 注册/登录 Coinbase
- [ ] 完成 KYC 认证
- [ ] 充值 ETH
- [ ] 一键质押获得 cbETH
- [ ] 定期查看收益

---

## 🎓 总结

**Coinbase cbETH 核心优势**：
- ✅ 最简单（新手首选）
- ✅ 零 Gas 费
- ✅ 合规背书
- ✅ 流动性好

**适合人群**：
- 加密货币新手
- 追求合规和简单
- 小额资金（Gas 占比高）
- 信任中心化交易所

让 ETH 质押零门槛！🚀
`,

  steps: [
    { step_number: 1, title: '登录 Coinbase', description: '注册并完成 KYC', estimated_time: '10 分钟' },
    { step_number: 2, title: '质押 ETH', description: '一键质押获得 cbETH', estimated_time: '3 分钟' },
    { step_number: 3, title: '查看收益', description: '观察 cbETH 价格增长', estimated_time: '2 分钟' },
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
    const strategies = [STRATEGY_8_3, STRATEGY_8_4];

    console.log('\n开始创建 8.3 和 8.4 策略...\n');

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