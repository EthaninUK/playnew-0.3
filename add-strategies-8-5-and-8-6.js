const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

// ===== 8.5 Binance WBETH 灵活质押 =====
const STRATEGY_8_5 = {
  title: 'Binance WBETH 灵活质押 - 全球最大交易所方案',
  slug: 'binance-wbeth-flexible-staking',
  summary: '在 Binance 质押 ETH 获得 WBETH，可随时交易或赎回，享受灵活性和收益兼得，APR 3-5%，零 Gas 费。',

  category: 'lst-staking',
  category_l1: 'yield',
  category_l2: 'LST 质押',

  difficulty_level: 1,
  risk_level: 2,

  apy_min: 3,
  apy_max: 5,
  threshold_capital: '0.01 ETH 起',
  threshold_capital_min: 20,
  time_commitment: '10 分钟设置',
  time_commitment_minutes: 10,
  threshold_tech_level: 'beginner',

  content: `> **适合人群**：Binance 用户、追求简单灵活、零 Gas 费的用户
> **阅读时间**：约 8 分钟
> **关键词**：Binance / WBETH / 灵活 / 零 Gas / 简单

---

## 🎯 什么是 Binance WBETH？

### 用大白话解释

- **WBETH** = Wrapped Beacon ETH（包装的信标 ETH）
- Binance 的 ETH 质押代币
- 类似 Lido stETH，但在 Binance 生态内

### WBETH 特点

1. **零 Gas 费**：Binance 内部操作
2. **随时赎回**：可即时交易或兑换回 ETH
3. **链上链下双通**：可提取到链上使用
4. **自动复利**：WBETH 价格每天增长

### 收益来源

- **ETH 2.0 质押奖励**：3-5% APR
- **Binance 协议费**：约 10-15%（从收益中扣除）

---

## 📋 准备工作

### 你需要

1. **Binance 账户**（需完成 KYC）
2. **ETH**（0.01 ETH 起）
3. **无需 Gas 费**（Binance 内部操作）

### WBETH vs stETH

| 特性 | Binance WBETH | Lido stETH |
|------|--------------|-----------|
| 类型 | 中心化 | 去中心化 |
| Gas 费 | 零 | 10-20 美元 |
| APR | 3-5% | 3.5-5.5% |
| 最低金额 | 0.01 ETH | 0.01 ETH |
| 灵活性 | 极高 | 高 |

---

## 🚀 操作步骤

### 步骤 1：登录 Binance

1. 访问 https://www.binance.com
2. 登录账户

### 步骤 2：ETH 质押

1. 进入"理财" → "ETH 2.0 质押"
2. 输入质押数量
3. 点击"质押"
4. 自动获得 WBETH

### 步骤 3：使用 WBETH

**选项 1：持有赚收益**
- 什么都不做，WBETH 自动增值

**选项 2：Binance 内交易**
- 可在 Binance 交易 WBETH/ETH

**选项 3：提取到链上**
- 提取 WBETH 到 MetaMask
- 在 DeFi 中使用（Curve、Uniswap 等）

---

## 💰 成本与收益

### 示例计算

**1 ETH 质押，4% APR，持有 1 年**
- 初始：1 ETH → 0.99 WBETH（汇率 1.01）
- 1年后：0.99 WBETH 价值约 1.04 ETH
- **净收益**：0.04 ETH（零 Gas）

**对比**：
- Lido：4.2% APR - 20 美元 Gas = 实际 3.2%（1 ETH）
- Binance：4% APR - 0 Gas = 实际 4%
- **小额资金 Binance 更划算**

---

## 🔥 进阶技巧

### 技巧 1：提取到链上使用

1. 在 Binance 提现 WBETH
2. 选择 ETH 网络
3. 发送到 MetaMask
4. 在 Curve WBETH/WETH 池做市

### 技巧 2：WBETH 套利

- 监控 Binance WBETH 价格 vs 链上价格
- 有价差时套利（需考虑提现费用）

### 技巧 3：组合 Binance 理财

- 50% WBETH（ETH 质押）
- 50% USDT 理财（稳定币收益）
- 平衡风险和收益

---

## ❓ 常见问题

**Q: WBETH 安全吗？**
> Binance 是全球最大交易所，但仍是中心化平台。建议分散风险。

**Q: 可以随时赎回吗？**
> 可以在 Binance 即时交易，或提取到链上。

**Q: WBETH 和 stETH 哪个好？**
> 小额（< 1 ETH）→ WBETH（零 Gas）
> 大额 → stETH（更去中心化）

**Q: WBETH 数量会变吗？**
> 不会，WBETH 价格增长（类似 rETH、cbETH）。

---

## ✅ 行动清单

- [ ] 登录 Binance，完成 KYC
- [ ] 进入 ETH 2.0 质押页面
- [ ] 质押 ETH，获得 WBETH
- [ ] 定期查看 WBETH 汇率
- [ ] （可选）提取到链上使用

---

## 🎓 总结

**Binance WBETH 核心优势**：
- ✅ 零 Gas 费
- ✅ 操作最简单
- ✅ 随时可赎回
- ✅ 链上链下双通

**适合人群**：
- Binance 用户
- 小额资金（< 1 ETH）
- 追求零成本和灵活性
- 新手用户

让 ETH 质押零成本！🚀
`,

  steps: [
    { step_number: 1, title: '登录 Binance', description: '确保完成 KYC 认证', estimated_time: '5 分钟' },
    { step_number: 2, title: '质押获得 WBETH', description: 'ETH 2.0 质押页面操作', estimated_time: '3 分钟' },
    { step_number: 3, title: '观察收益', description: '查看 WBETH 汇率增长', estimated_time: '2 分钟' },
  ],
};

// ===== 8.6 Swell swETH 质押挖矿 =====
const STRATEGY_8_6 = {
  title: 'Swell swETH 质押挖矿 - 新兴协议空投机会',
  slug: 'swell-sweth-staking-airdrop',
  summary: '质押 ETH 到 Swell 获得 swETH，同时赚取 SWELL 代币空投和质押收益，总 APR 预期 6-12%，适合空投猎人。',

  category: 'lst-staking',
  category_l1: 'yield',
  category_l2: 'LST 质押',

  difficulty_level: 2,
  risk_level: 4,

  apy_min: 4,
  apy_max: 15,
  threshold_capital: '0.1 ETH 起',
  threshold_capital_min: 200,
  time_commitment: '30 分钟设置 + 每周 10 分钟监控',
  time_commitment_minutes: 70,
  threshold_tech_level: 'intermediate',

  content: `> **适合人群**：空投猎人、早期参与者、追求高收益、能承担风险的用户
> **阅读时间**：约 10 分钟
> **关键词**：Swell / swETH / 空投 / SWELL / 积分

---

## 🎯 什么是 Swell swETH？

### 用大白话解释

- **Swell**：新兴的流动性质押协议（2023年上线）
- **swETH**：Swell 的 LST 代币
- **核心吸引力**：SWELL 代币空投预期

### 为什么关注 Swell？

1. **空投预期**：尚未发币，早期参与者可能获得空投
2. **积分系统**：Pearls 积分，类似 Blast、Linea
3. **再质押整合**：与 EigenLayer 深度整合
4. **高收益**：ETH 质押 + SWELL 空投预期

### 收益来源

1. **ETH 质押奖励**：3.5-4.5% APR
2. **Pearls 积分**：换算 SWELL 空投（未知）
3. **预期总 APR**：10-20%（含空投预期）

---

## 📋 准备工作

### 你需要

1. **ETH**（0.1+ ETH，推荐 1+ ETH）
2. **Gas 费**（0.01 ETH）
3. **MetaMask 钱包**

### 理解 Swell 积分

**Pearls 积分系统**：
- 质押 ETH → 获得 swETH
- 持有 swETH → 每天累积 Pearls
- Pearls 越多 → 未来 SWELL 空投越多

**额外加成**：
- 邀请好友：+10% Pearls
- 长期持有：+20% Pearls
- 使用 swETH 在 DeFi：+30% Pearls

---

## 🚀 操作步骤

### 步骤 1：访问 Swell

1. 访问 https://app.swellnetwork.io
2. 连接 MetaMask
3. 查看 Pearls 积分规则

### 步骤 2：质押 ETH

1. 输入质押数量
2. 点击"Stake"
3. 确认交易（Gas 约 10-15 美元）
4. 获得 swETH

### 步骤 3：最大化 Pearls

**策略 1：长期持有**
- 不要频繁交易 swETH
- 持有时间越长，加成越多

**策略 2：邀请好友**
- 获取邀请链接
- 邀请好友质押（双方都有加成）

**策略 3：DeFi 使用**
- 在 Pendle 交易 swETH
- 在 Curve 提供流动性
- 额外获得 Pearls 加成

---

## 💰 成本与收益

### 示例计算（保守）

**1 ETH 质押，仅计 ETH 收益**
- ETH 质押 APR：4%
- 1年收益：0.04 ETH
- Gas 成本：0.01 ETH
- **净收益**：0.03 ETH

### 示例计算（含空投预期）

**1 ETH 质押，假设 SWELL 空投 = 10% ETH 价值**
- ETH 质押：4%
- 空投预期：10%（假设，不保证）
- **预期总收益**：14%

**10 ETH 质押**
- 预期总收益：1.4 ETH（约 2800 美元）

---

## 🔥 进阶技巧

### 技巧 1：Pendle swETH 收益交易

- 在 Pendle 将 swETH 分拆为 PT 和 YT
- 卖出 YT 锁定未来收益
- 或买入 YT 放大收益

### 技巧 2：Curve swETH/ETH 流动性

- 提供 swETH/ETH 流动性
- 赚取三重收益：
  1. ETH 质押收益
  2. Pearls 积分（DeFi 使用加成）
  3. CRV 奖励

### 技巧 3：邀请返佣

- 推广 Swell 给朋友
- 双方都获得 +10% Pearls
- 建立推荐网络

---

## ⚠️ 风险提示

### 主要风险

1. **新协议风险**
   - Swell 运营时间短（< 2年）
   - 智能合约可能有未知漏洞

2. **空投不确定性**
   - SWELL 代币未发行
   - 空投规则未公布
   - 可能没有空投或低于预期

3. **swETH 流动性风险**
   - TVL 较小（vs Lido）
   - 大额卖出可能有滑点

4. **积分贬值风险**
   - 如果后期参与人数暴增
   - 早期积分可能被稀释

---

## ❓ 常见问题

**Q: Swell 何时发币？**
> 官方未公布。预计 2024-2025年。

**Q: Pearls 如何兑换 SWELL？**
> 官方未公布兑换比例，需等待空投公告。

**Q: swETH 安全吗？**
> 经过审计，但协议较新，建议小额参与（< 10% 资金）。

**Q: 如果没有空投怎么办？**
> 仍有 3.5-4.5% 的 ETH 质押收益，只是没有额外惊喜。

---

## ✅ 行动清单

- [ ] 准备 ETH 和 Gas 费
- [ ] 访问 Swell 应用
- [ ] 质押 ETH，获得 swETH
- [ ] 记录 Pearls 积分
- [ ] 邀请好友（+10% Pearls）
- [ ] （可选）Pendle/Curve 进阶玩法
- [ ] 关注 Swell 官方公告

---

## 🎓 总结

**Swell swETH 核心价值**：
- ✅ 空投预期（早期参与优势）
- ✅ Pearls 积分系统
- ✅ 与 EigenLayer 整合
- ✅ 高风险高回报

**适合人群**：
- 空投猎人
- 早期参与者
- 能承担新协议风险
- 追求高收益

**不适合人群**：
- 保守型投资者
- 大额资金（建议 < 10% 仓位）
- 不能接受空投落空

让 ETH 质押获得空投机会！🎁
`,

  steps: [
    { step_number: 1, title: '质押 swETH', description: '访问 Swell 质押 ETH', estimated_time: '10 分钟' },
    { step_number: 2, title: '累积 Pearls', description: '长期持有，邀请好友', estimated_time: '每周 5 分钟' },
    { step_number: 3, title: '关注空投', description: '等待 SWELL 代币发行', estimated_time: '持续关注' },
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
    const strategies = [STRATEGY_8_5, STRATEGY_8_6];

    console.log('\n开始创建 8.5 和 8.6 策略...\n');

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