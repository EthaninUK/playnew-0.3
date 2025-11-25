const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

// ===== 6.1 Aave USDC 存款挖息 =====
const STRATEGY_6_1 = {
  title: 'Aave USDC 存款挖息 - DeFi 蓝筹稳定收益',
  slug: 'aave-usdc-deposit-yield',
  summary: '在 Aave 协议存入 USDC 稳定币，赚取存款利息和 AAVE 代币奖励，享受 DeFi 蓝筹协议的安全性和稳定收益。',

  category: 'stablecoin-yield',
  category_l1: 'yield',
  category_l2: 'stablecoin',

  difficulty_level: 2,
  risk_level: 2,

  apy_min: 2,
  apy_max: 8,
  threshold_capital: '100 美元起',
  threshold_capital_min: 100,
  time_commitment: '1 小时设置 + 每周 10 分钟监控',
  time_commitment_minutes: 100,
  threshold_tech_level: 'intermediate',

  content: `**适合人群**: 持有稳定币、追求稳健收益、认可 DeFi 蓝筹协议的用户

**阅读时间**: 约 12 分钟

**关键词**: Aave / USDC / 存款 / DeFi / 蓝筹 / 稳定收益

---

## 什么是 Aave USDC 存款挖息？

### 用大白话解释

Aave 是 DeFi（去中心化金融）领域的龙头借贷协议，TVL 超 100 亿美元。你把 USDC 存入 Aave 智能合约，可以获得 2-8% 年化收益，远高于传统银行的 0.5%。

### 收益来源

1. **基础利息**: 借款人支付的利息（2-6% APY）
2. **奖励代币**: AAVE 代币奖励（0.1-2% APY）
3. **总收益**: 基础利息 + 奖励代币 = 2-8% 年化

### 风险等级

- **智能合约风险**: 低（经过多轮审计）
- **清算风险**: 无（纯存款无需抵押）
- **稳定币风险**: 低（USDC 是中心化稳定币，有 Circle 公司背书）
- **综合风险**: 2/5 星

---

## 操作步骤

### 步骤 1: 准备工作

**需要准备**:
- MetaMask 钱包
- USDC 稳定币（建议至少 100 美元）
- 少量 ETH 作为 Gas 费（约 5-10 美元）

**支持的网络**:
- 以太坊主网（Gas 费高）
- Polygon（推荐，Gas 费低）
- Arbitrum（L2，Gas 费极低）

### 步骤 2: 访问 Aave

1. 打开 https://app.aave.com
2. 点击右上角 "Connect Wallet"
3. 选择 MetaMask
4. 选择网络（推荐 Polygon）

### 步骤 3: 存入 USDC

1. 在 "Supply" 区域找到 USDC
2. 点击 "Supply"
3. 输入存款金额
4. 查看预估 APY
5. 首次需要 Approve（授权）
6. 确认交易

### 步骤 4: 查看收益

存款后，你会收到 aUSDC（代表你的存款凭证）。收益每秒自动累积到你的 aUSDC 余额中。

### 步骤 5: 提取

随时可以提取，无锁定期：
1. 进入 "Your supplies"
2. 点击 USDC 旁的 "Withdraw"
3. 输入提取金额
4. 确认交易

---

## 收益优化策略

### 策略1: 选择低 Gas 费网络

| 网络 | Gas 费 | 推荐指数 |
|------|--------|----------|
| 以太坊主网 | 10-50 美元 | ★★☆☆☆ |
| Polygon | 0.01-0.1 美元 | ★★★★★ |
| Arbitrum | 0.1-0.5 美元 | ★★★★☆ |

### 策略2: 比较不同稳定币收益

USDC / USDT / DAI 三种稳定币的利率经常波动，选择当前收益最高的。

### 策略3: 关注激励活动

Aave 定期会有额外的 AAVE 代币激励，可以将收益提升 1-3%。

---

## 风险提示

1. **智能合约风险**: 虽然 Aave 已运营4年+，但仍存在被黑客攻击的可能
2. **稳定币脱锚风险**: USDC 虽然稳定，但极端情况下可能脱锚
3. **利率波动**: 存款利率会随市场供需变化，可能降至 1% 以下
4. **Gas 费**: 以太坊主网 Gas 费可能吃掉小额存款的收益

---

## 常见问题

**Q: 最少需要存多少钱？**
A: 理论上没有最低限制，但考虑 Gas 费，建议至少 100 美元起（Polygon 网络可以更低）。

**Q: 收益什么时候到账？**
A: 每秒自动复利，实时到账，无需手动领取。

**Q: 可以随时提取吗？**
A: 是的，无锁定期，随时可提。但需支付 Gas 费。

**Q: 安全吗？**
A: Aave 是 DeFi 龙头协议，安全性较高，但仍建议：
   - 不要投入超过自己承受能力的资金
   - 分散存放在多个协议
   - 定期关注协议安全动态

---

## 总结

**适合人群**:
- 持有稳定币，希望获得稳定收益
- 认可 DeFi 蓝筹协议
- 能承受一定智能合约风险

**预期收益**: 年化 2-8%

**时间投入**: 设置 1 小时 + 每周监控 10 分钟

**风险等级**: 2/5 星（中低风险）`,

  status: 'published',
};

// ===== 6.2 Compound USDC 存款挖息 =====
const STRATEGY_6_2 = {
  title: 'Compound USDC 存款挖息 - DeFi 元老级稳定收益',
  slug: 'compound-usdc-deposit-yield',
  summary: '在 Compound 协议存入 USDC 稳定币，赚取存款利息和 COMP 代币奖励，使用历史最悠久的 DeFi 借贷协议之一。',

  category: 'stablecoin-yield',
  category_l1: 'yield',
  category_l2: 'stablecoin',

  difficulty_level: 2,
  risk_level: 2,

  apy_min: 1.5,
  apy_max: 7,
  threshold_capital: '100 美元起',
  threshold_capital_min: 100,
  time_commitment: '1 小时设置 + 每周 10 分钟监控',
  time_commitment_minutes: 100,
  threshold_tech_level: 'intermediate',

  content: `**适合人群**: 持有稳定币、追求稳健收益、认可 DeFi 元老协议的用户

**阅读时间**: 约 12 分钟

**关键词**: Compound / USDC / 存款 / DeFi / 借贷 / 稳定收益

---

## 什么是 Compound USDC 存款挖息？

### 用大白话解释

Compound 是 DeFi 领域的元老级借贷协议（2018年成立），TVL 超 30 亿美元。存入 USDC 可以获得 1.5-7% 年化收益。

### 与 Aave 的区别

| 特性 | Compound | Aave |
|------|----------|------|
| 成立时间 | 2018年 | 2020年 |
| TVL | 30亿+ | 100亿+ |
| USDC 收益 | 1.5-7% | 2-8% |
| 界面 | 简洁 | 功能更丰富 |
| 安全性 | 老牌，稳定 | 新一代，创新 |

### 收益来源

1. **存款利息**: 1.5-5% APY
2. **COMP 奖励**: 0.1-2% APY
3. **总收益**: 1.5-7% 年化

---

## 操作步骤

### 步骤 1: 访问 Compound

1. 打开 https://app.compound.finance
2. 点击 "Connect Wallet"
3. 选择 MetaMask
4. 确认连接

### 步骤 2: 选择资产并供应

1. 在 "Supply Markets" 找到 USDC
2. 点击 "Supply"
3. 输入金额
4. 查看预估 APY
5. 首次需要 Enable（授权）
6. 确认 Supply

### 步骤 3: 查看收益

存款后会收到 cUSDC（代表你的存款凭证）。收益自动复利累积。

### 步骤 4: 提取

1. 进入 "Your Supplies"
2. 点击 USDC 的 "Withdraw"
3. 输入提取金额
4. 确认交易

---

## 收益优化

### 技巧1: COMP 代币领取

Compound 的 COMP 奖励需要手动领取。记得定期领取并卖出或复投。

### 技巧2: 监控利率变化

Compound 的利率波动较大，当利率低于 2% 时可以考虑切换到 Aave。

### 技巧3: Gas 费优化

- 选择 Gas 费低的时候操作（周末、凌晨）
- 批量操作（一次性存入较大金额）

---

## 风险提示

1. **智能合约风险**: Compound 运营6年+，相对安全，但不保证100%安全
2. **稳定币风险**: USDC 依赖 Circle 公司信用
3. **利率波动**: 市场需求变化可能导致利率大幅下降
4. **治理风险**: COMP 持有者可以投票修改协议参数

---

## 常见问题

**Q: Compound 和 Aave 选哪个？**
A: 建议两个都用，分散风险。通常 Aave 收益稍高，但 Compound 更稳定。

**Q: cUSDC 是什么？**
A: 存款凭证，1 cUSDC 可以兑换一定数量的 USDC + 利息。

**Q: COMP 奖励怎么领取？**
A: 在 Compound 界面点击 "Collect" 按钮手动领取。

---

## 总结

**优势**:
- 元老级协议，安全性高
- 界面简洁易用
- 收益稳定

**劣势**:
- 收益略低于 Aave
- 奖励需要手动领取
- 仅支持以太坊主网（Gas 费高）

**适合场景**: 追求稳健、信任元老协议、长期持有稳定币的用户

**预期收益**: 年化 1.5-7%

**风险等级**: 2/5 星（中低风险）`,

  status: 'published',
};

// ===== 执行脚本 =====
async function createStrategies() {
  try {
    console.log('开始创建 6.1 和 6.2 策略...\n');

    // 登录获取 token
    const authResponse = await axios.post(`${DIRECTUS_URL}/auth/login`, {
      email: 'the_uk1@outlook.com',
      password: 'Mygcdjmyxzg2026!',
    });

    const token = authResponse.data.data.access_token;

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    // 创建 6.1
    try {
      const response1 = await axios.post(
        `${DIRECTUS_URL}/items/strategies`,
        STRATEGY_6_1,
        config
      );
      console.log('✅ 创建成功: 6.1 Aave USDC 存款挖息');
      console.log(`   ID: ${response1.data.data.id}`);
    } catch (error) {
      console.log('❌ 创建失败:', error.response?.data || error.message);
    }

    // 创建 6.2
    try {
      const response2 = await axios.post(
        `${DIRECTUS_URL}/items/strategies`,
        STRATEGY_6_2,
        config
      );
      console.log('✅ 创建成功: 6.2 Compound USDC 存款挖息');
      console.log(`   ID: ${response2.data.data.id}`);
    } catch (error) {
      console.log('❌ 创建失败:', error.response?.data || error.message);
    }

    console.log('\n🎉 所有策略添加完成！');
  } catch (error) {
    console.error('❌ 执行失败:', error.message);
  }
}

createStrategies();
