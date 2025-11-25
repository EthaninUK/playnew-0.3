const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

// ===== 8.9 Marinade mSOL Solana 质押 =====
const STRATEGY_8_9 = {
  title: 'Marinade mSOL Solana 质押 - Solana 生态流动性质押',
  slug: 'marinade-msol-solana-staking',
  summary: '在 Solana 链上通过 Marinade Finance 质押 SOL 获得 mSOL，享受 Solana 原生质押收益（6-8% APR），支持 DeFi 组合，手续费极低。',

  category: 'lst-staking',
  category_l1: 'onchain-yield',
  category_l2: 'LST 质押',

  difficulty_level: 2,
  risk_level: 3,

  apy_min: 6,
  apy_max: 8,
  threshold_capital: '0.1 SOL 起',
  threshold_capital_min: 10,
  time_commitment: '30 分钟设置 + 每月 10 分钟监控',
  time_commitment_minutes: 40,
  threshold_tech_level: 'intermediate',

  content: `> **适合人群**：持有 SOL、看好 Solana 生态、追求高收益低手续费的用户
> **阅读时间**：约 10 分钟
> **关键词**：Marinade / mSOL / Solana / 流动性质押 / 低手续费

---

## 🎯 什么是 Marinade mSOL？

### 用大白话解释

- **Marinade Finance**：Solana 上最大的流动性质押协议
- **mSOL**：Marinade 的流动性质押代币（类似以太坊的 stETH）
- **核心优势**：Solana 质押收益 + 极低手续费 + 快速交易

### 为什么选择 Solana 质押？

**Solana vs 以太坊质押对比**：

| 特性 | Solana mSOL | 以太坊 stETH |
|------|-------------|-------------|
| APR | 6-8% | 3.5-5.5% |
| 手续费 | < 0.01 美元 | 10-20 美元 |
| 交易速度 | 1-3 秒 | 12 秒 |
| 解锁时间 | 1-3 天 | 1-5 天 |

### 收益来源

1. **Solana 质押奖励**：7-8% APR
2. **扣除协议费（3%）后**：6.8-7.8% APR
3. **额外 DeFi 收益**：使用 mSOL 做市等

---

## 📋 准备工作

### 你需要准备

1. **SOL**（0.1+ SOL，推荐 1+ SOL）
2. **Solana 钱包**（Phantom 或 Solflare）
3. **手续费**（< 0.01 SOL，非常便宜）

### 安装 Phantom 钱包

1. 访问 https://phantom.app
2. 下载浏览器插件或手机 App
3. 创建钱包，保存助记词
4. 充值 SOL

### 理解 mSOL 机制

**mSOL 运作方式**：
- 质押 1 SOL → 获得约 0.95 mSOL（汇率增长型）
- mSOL 价格每天增长（类似 rETH）
- 可随时在 DeFi 使用或卖出

---

## 🚀 操作步骤

### 步骤 1：访问 Marinade

1. 访问 https://marinade.finance
2. 点击"Launch App"
3. 连接 Phantom 钱包

### 步骤 2：质押 SOL

1. 选择"Stake"标签
2. 输入质押数量（如 10 SOL）
3. 查看将收到的 mSOL（约 9.5 mSOL）
4. 查看当前汇率（1 mSOL = ? SOL）
5. 点击"Stake"

### 步骤 3：确认交易

1. Phantom 弹窗确认
2. 手续费 < 0.001 SOL（< 0.1 美元）
3. 3 秒内完成
4. mSOL 自动到账

---

## 💰 成本与收益

### 示例计算

**10 SOL 质押，7% APR，持有 1 年**
- 初始：10 SOL → 约 9.5 mSOL
- 1 年后：9.5 mSOL 价值约 10.7 SOL
- **净收益**：0.7 SOL（约 140 美元）
- 手续费：< 0.1 美元

**对比以太坊质押**：
- 以太坊：4.5% APR，Gas 20 美元
- Solana：7% APR，Gas < 0.1 美元
- **Solana 收益更高，成本更低**

---

## 🔥 进阶技巧

### 技巧 1：Orca mSOL-SOL 流动性

1. 在 Orca.so 提供 mSOL-SOL 流动性
2. 赚取交易手续费
3. 总 APY 可达 10-15%
4. 无常损失风险低（mSOL 锚定 SOL）

### 技巧 2：Solend 借贷

1. 将 mSOL 存入 Solend（Solana 版 Aave）
2. 抵押借出 USDC
3. 继续购买 SOL 质押（循环借贷）
4. 总收益可达 12-18%（需承担清算风险）

### 技巧 3：脱锚套利

- 监控 Raydium mSOL/SOL 池
- 当 mSOL 折价 > 1% 时买入
- 等待回锚获利
- Solana 流动性好，套利机会多

---

## ⚠️ 风险提示

### 主要风险

1. **智能合约风险**
   - Marinade 虽经审计，但仍可能有漏洞
   - 应对：分散资金，不要全仓

2. **Solana 网络风险**
   - Solana 曾多次宕机（2022-2023）
   - 近期稳定性改善
   - 应对：关注网络状态

3. **mSOL 脱锚风险**
   - 市场恐慌时可能短暂脱锚
   - 流动性比以太坊 LST 小
   - 应对：不要 FOMO 抢购，等待回锚

4. **验证者风险**
   - Marinade 委托给多个验证者
   - 验证者表现差会被罚没（概率 < 0.1%）

---

## ❓ 常见问题

**Q: mSOL 汇率怎么算？**
> 随质押奖励增长。示例：今天 1 mSOL = 1.05 SOL，1 年后约 1.127 SOL（7% 增长）。

**Q: 如何赎回 SOL？**
> 两种方式：
> 1. **即时兑换**：在 Raydium/Orca 卖出（有 0.5-1% 滑点）
> 2. **Delayed Unstake**：Marinade 官方解锁（1-3 天，无滑点）

**Q: Solana 质押有锁定期吗？**
> mSOL 无锁定，随时可卖。但官方解锁需 1-3 天（每个 epoch 结束）。

**Q: Marinade 安全吗？**
> 经 Kudelski、Neodyme 审计，TVL 8 亿美元，运营 3+ 年。但仍是智能合约，建议分散。

**Q: 为什么 Solana APR 比以太坊高？**
> Solana 通胀率更高（约 5-6%），且网络成本低，验证者收益更高。

---

## ✅ 行动清单

- [ ] 安装 Phantom 钱包
- [ ] 购买 SOL（0.1+ SOL）
- [ ] 访问 marinade.finance
- [ ] 质押 SOL，获得 mSOL
- [ ] 添加 mSOL 到钱包
- [ ] 每月检查汇率增长
- [ ] （可选）Orca 流动性挖矿
- [ ] （可选）Solend 借贷策略

---

## 🎓 总结

**Marinade mSOL 核心优势**：
- ✅ APR 更高（6-8% vs 以太坊 4-5%）
- ✅ 手续费极低（< 0.01 美元）
- ✅ 交易速度快（1-3 秒）
- ✅ Solana DeFi 生态发展快
- ✅ Marinade TVL 最大，最稳定

**适合人群**：
- 看好 Solana 生态
- 追求高收益低成本
- 能接受网络偶尔不稳定
- 想尝试以太坊外的 LST

让 SOL 在 Solana 上生息！🚀
`,

  steps: [
    { step_number: 1, title: '准备钱包', description: '安装 Phantom 钱包，充值 SOL', estimated_time: '10 分钟' },
    { step_number: 2, title: '质押获得 mSOL', description: '访问 Marinade 质押 SOL', estimated_time: '10 分钟' },
    { step_number: 3, title: '观察汇率', description: '检查 mSOL 价格增长', estimated_time: '5 分钟/月' },
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

async function addStrategy() {
  try {
    const token = await getAuthToken();

    console.log('\n开始创建 8.9 策略...\n');

    const strategy = {
      ...STRATEGY_8_9,
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

    console.log(`✅ ${strategy.title}`);
    console.log(`   ID: ${response.data.data.id}`);
    console.log(`   Slug: ${response.data.data.slug}\n`);

    console.log('🎉 创建完成！');
    console.log('访问: http://localhost:3000/strategies?category=lst-staking\n');
  } catch (error) {
    console.error('\n❌ 创建失败:', error.response?.data || error.message);
  }
}

addStrategy();