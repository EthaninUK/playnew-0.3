const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

// ===== 8.7 StakeWise osETH 优化质押 =====
const STRATEGY_8_7 = {
  title: 'StakeWise osETH 优化质押 - 超额抵押安全方案',
  slug: 'stakewise-oseth-optimized-staking',
  summary: '使用 StakeWise V3 质押 ETH 获得 osETH，通过超额抵押机制提高安全性，APR 3.5-5%，适合追求安全的用户。',

  category: 'lst-staking',
  category_l1: 'yield',
  category_l2: 'LST 质押',

  difficulty_level: 3,
  risk_level: 2,

  apy_min: 3.5,
  apy_max: 5,
  threshold_capital: '0.1 ETH 起',
  threshold_capital_min: 200,
  time_commitment: '45 分钟设置 + 每月 15 分钟监控',
  time_commitment_minutes: 60,
  threshold_tech_level: 'advanced',

  content: `> **适合人群**：了解 DeFi、追求安全性、愿意学习复杂机制的用户
> **阅读时间**：约 10 分钟
> **关键词**：StakeWise / osETH / 超额抵押 / 安全 / V3

---

## 🎯 什么是 StakeWise osETH？

### 用大白话解释

- **StakeWise**：老牌质押协议（2021年上线）
- **osETH**：Over-collateralized stETH（超额抵押 ETH）
- **核心创新**：每个节点需超额抵押，提高安全性

### osETH 独特机制

**传统 LST**：
- 验证节点质押 32 ETH
- 用户获得 1:1 的 LST

**StakeWise osETH**：
- 节点运营商需超额抵押（如质押 40 ETH 运行 32 ETH 节点）
- 超额部分作为"安全缓冲"
- 如果被罚没，先罚超额部分

### 安全优势

1. **罚没保护**：超额抵押吸收罚没损失
2. **节点激励**：节点运营商自有资金在内，更谨慎
3. **透明度**：每个金库独立，可查看节点表现

---

## 📋 准备工作

### 你需要

1. **ETH**（0.1+ ETH）
2. **Gas 费**（0.01-0.02 ETH）
3. **MetaMask 钱包**

### 理解 Vault 机制

**StakeWise V3 特点**：
- 每个节点运营商创建 Vault（金库）
- 用户选择 Vault 质押
- 不同 Vault 收益和风险不同

**如何选择 Vault？**
- **TVL**：越大越安全
- **超额抵押率**：越高越安全（推荐 > 120%）
- **历史表现**：查看 Uptime 和罚没记录

---

## 🚀 操作步骤

### 步骤 1：访问 StakeWise

1. 访问 https://app.stakewise.io
2. 连接 MetaMask
3. 选择 "Stake"

### 步骤 2：选择 Vault

1. 查看 Vault 列表
2. 筛选条件：
   - TVL > 100 ETH
   - 超额抵押率 > 120%
   - APR 3.5%+
3. 点击进入选定的 Vault

### 步骤 3：质押 ETH

1. 输入质押数量
2. 点击"Stake"
3. 确认交易（Gas 约 15-20 美元）
4. 获得 osETH

### 步骤 4：监控 Vault

- 定期检查 Vault 健康度
- 查看超额抵押率是否维持
- 必要时切换到其他 Vault

---

## 💰 成本与收益

### 示例计算

**1 ETH 质押，4% APR，持有 1 年**
- 收益：0.04 ETH
- Gas 成本：0.02 ETH
- **净收益**：0.02 ETH（2%）

**10 ETH 质押，4% APR，持有 1 年**
- 收益：0.4 ETH
- **净收益率**：3.8%

---

## 🔥 进阶技巧

### 技巧 1：多 Vault 分散

- 不要把所有 ETH 放在一个 Vault
- 分散到 3-5 个 Vault
- 降低单点风险

### 技巧 2：自建 Vault（高级）

如果你有技术能力：
- 运行自己的验证节点
- 创建 Vault 吸引用户质押
- 赚取节点运营商佣金

### 技巧 3：监控超额抵押率

- 超额抵押率 < 110% 时警惕
- 可能面临清算或罚没风险
- 及时切换 Vault

---

## ⚠️ 风险提示

### 主要风险

1. **Vault 风险**
   - 节点运营商表现不佳
   - 超额抵押率下降
   - 应对：选择大 Vault，定期监控

2. **流动性风险**
   - osETH TVL 较小
   - 大额交易可能有滑点

3. **复杂度风险**
   - V3 机制较复杂
   - 新手容易误操作

---

## ❓ 常见问题

**Q: osETH 比 stETH 更安全吗？**
> 理论上是，因为有超额抵押保护。但 TVL 更小，流动性略差。

**Q: 如何选择最好的 Vault？**
> 看 TVL、超额抵押率、历史表现。推荐大 Vault（TVL > 100 ETH）。

**Q: 可以切换 Vault 吗？**
> 可以，先赎回 osETH，再质押到新 Vault（需两次 Gas）。

**Q: osETH 数量会变吗？**
> 不会，osETH 价格增长（类似 rETH）。

---

## ✅ 行动清单

- [ ] 准备 ETH 和 Gas 费
- [ ] 研究 Vault 列表
- [ ] 选择优质 Vault
- [ ] 质押 ETH，获得 osETH
- [ ] 定期监控 Vault 健康度
- [ ] 每月检查超额抵押率

---

## 🎓 总结

**StakeWise osETH 核心优势**：
- ✅ 超额抵押保护
- ✅ 独立 Vault 透明度
- ✅ 节点激励机制好
- ✅ 罚没风险更低

**适合人群**：
- 追求安全性
- 了解复杂 DeFi 机制
- 愿意主动监控
- 中大额资金（> 1 ETH）

让 ETH 质押更安全！🛡️
`,

  steps: [
    { step_number: 1, title: '研究 Vault', description: '筛选优质 Vault', estimated_time: '20 分钟' },
    { step_number: 2, title: '质押 osETH', description: '选择 Vault 质押 ETH', estimated_time: '15 分钟' },
    { step_number: 3, title: '监控维护', description: '每月检查 Vault 健康度', estimated_time: '15 分钟/月' },
  ],
};

// ===== 8.8 Ankr ankrETH 多链质押 =====
const STRATEGY_8_8 = {
  title: 'Ankr ankrETH 多链质押 - 跨链流动性方案',
  slug: 'ankr-ankreth-multichain-staking',
  summary: '通过 Ankr 质押 ETH 获得 ankrETH，可在多条链上使用（以太坊、BSC、Polygon），提高资金利用率，APR 3-4.5%。',

  category: 'lst-staking',
  category_l1: 'yield',
  category_l2: 'LST 质押',

  difficulty_level: 2,
  risk_level: 3,

  apy_min: 3,
  apy_max: 4.5,
  threshold_capital: '0.1 ETH 起',
  threshold_capital_min: 200,
  time_commitment: '30 分钟设置 + 每月 10 分钟监控',
  time_commitment_minutes: 40,
  threshold_tech_level: 'intermediate',

  content: `> **适合人群**：多链 DeFi 用户、追求跨链灵活性、使用 BSC/Polygon 的用户
> **阅读时间**：约 8 分钟
> **关键词**：Ankr / ankrETH / 多链 / 跨链 / 流动性

---

## 🎯 什么是 Ankr ankrETH？

### 用大白话解释

- **Ankr**：Web3 基础设施提供商
- **ankrETH**：Ankr 的流动性质押代币
- **核心优势**：支持多链部署，提高灵活性

### ankrETH 跨链特性

**支持的链**：
- 以太坊主网
- BNB Chain（BSC）
- Polygon
- Arbitrum
- Optimism

**用途**：
- 在 BSC 上使用 ankrETH 做 DeFi
- 在 Polygon 低成本交易
- 在 Arbitrum 享受 L2 优势

---

## 📋 准备工作

### 你需要

1. **ETH**（0.1+ ETH）
2. **Gas 费**（0.005-0.01 ETH）
3. **MetaMask**（支持多链）

### ankrETH vs 其他 LST

| 特性 | Ankr ankrETH | Lido stETH |
|------|-------------|-----------|
| 多链支持 | ✅ 5+ 条链 | ❌ 主要以太坊 |
| APR | 3-4.5% | 3.5-5.5% |
| TVL | 1-2 亿美元 | 200+ 亿美元 |
| DeFi 集成 | 中 | 极高 |

---

## 🚀 操作步骤

### 步骤 1：质押 ETH

1. 访问 https://www.ankr.com/staking/stake/ethereum
2. 连接 MetaMask
3. 输入 ETH 数量
4. 点击"Stake"
5. 确认交易

### 步骤 2：跨链到其他链（可选）

**方法 1：Ankr 官方桥**
1. 访问 Ankr Bridge
2. 选择目标链（如 BSC）
3. 桥接 ankrETH

**方法 2：第三方桥**
- Stargate
- LayerZero
- Multichain

### 步骤 3：在目标链使用

**BSC 示例**：
- PancakeSwap 提供流动性
- Venus Protocol 抵押借贷
- 享受低 Gas 费用

---

## 💰 成本与收益

### 示例计算

**1 ETH 质押，3.5% APR，持有 1 年**
- 收益：0.035 ETH
- Gas（以太坊）：0.01 ETH
- **净收益**：0.025 ETH

**BSC 使用**：
- 跨链 Gas：约 5-10 美元
- BSC Gas：< 1 美元/次
- 适合高频操作

---

## 🔥 进阶技巧

### 技巧 1：BSC DeFi 套利

1. 桥接 ankrETH 到 BSC
2. 在 PancakeSwap 提供流动性
3. 赚取 CAKE 奖励
4. 总 APY 可达 8-12%

### 技巧 2：Polygon 低成本操作

- 桥接到 Polygon
- Gas 费仅 0.01 美元
- 适合小额频繁交易

### 技巧 3：多链收益优化

- 监控各链 DeFi 收益率
- 动态调整 ankrETH 分布
- 最大化总收益

---

## ❓ 常见问题

**Q: ankrETH 在所有链上都一样吗？**
> 是的，只是部署在不同链上，价值相同。

**Q: 跨链安全吗？**
> 使用官方桥相对安全，但仍有跨链桥风险。

**Q: 为什么 APR 比 Lido 低？**
> Ankr 多链部署成本更高，且 TVL 较小。

**Q: 可以随时桥回以太坊吗？**
> 可以，需支付跨链手续费（约 5-15 美元）。

---

## ✅ 行动清单

- [ ] 准备 ETH
- [ ] 质押获得 ankrETH
- [ ] （可选）桥接到 BSC/Polygon
- [ ] 在目标链使用 DeFi
- [ ] 定期检查各链收益率

---

## 🎓 总结

**Ankr ankrETH 核心优势**：
- ✅ 多链支持（5+ 条链）
- ✅ 跨链灵活性高
- ✅ BSC/Polygon 低 Gas
- ✅ 提高资金利用率

**适合人群**：
- 多链 DeFi 用户
- 使用 BSC/Polygon
- 追求跨链灵活性
- 高频交易者

让 ETH 质押跨链使用！🌉
`,

  steps: [
    { step_number: 1, title: '质押 ankrETH', description: '在以太坊质押 ETH', estimated_time: '10 分钟' },
    { step_number: 2, title: '（可选）跨链', description: '桥接到 BSC/Polygon', estimated_time: '15 分钟' },
    { step_number: 3, title: '多链 DeFi', description: '在目标链使用', estimated_time: '持续' },
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
    const strategies = [STRATEGY_8_7, STRATEGY_8_8];

    console.log('\n开始创建 8.7 和 8.8 策略...\n');

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