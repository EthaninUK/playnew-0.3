const axios = require('axios');
const DIRECTUS_URL = 'http://localhost:8055';

// 9.7: Lido wstETH + EigenLayer 组合策略
const STRATEGY_9_7 = {
  title: 'Lido wstETH + EigenLayer 组合 - 最大流动性质押 + 再质押双重收益',
  slug: 'lido-wsteth-eigenlayer-combo',
  summary: '结合 Lido 的 wstETH（最大流动性质押代币）和 EigenLayer 再质押，享受以太坊质押收益、EigenLayer AVS 奖励和最优 DeFi 整合，适合追求流动性和收益平衡的用户。',
  category: 'restaking',
  category_l1: 'yield',
  category_l2: '再质押/LRT',
  difficulty_level: 2,
  risk_level: 2,
  apy_min: 6,
  apy_max: 18,
  threshold_capital: '0.1 ETH 起',
  threshold_capital_min: 300,
  time_commitment: '初次设置 40 分钟，每月维护 20 分钟',
  time_commitment_minutes: 40,
  threshold_tech_level: 'intermediate',
  content: `
## 什么是 wstETH + EigenLayer 组合策略

这个策略结合了两个最成熟的以太坊收益协议：
- **Lido wstETH**：最大的流动性质押代币（TVL $32B）
- **EigenLayer**：最大的再质押协议

通过将 wstETH 存入 EigenLayer，可以获得双重收益，同时保持极高的流动性。

### 核心优势

**1. 最高的流动性**
- wstETH 是市场上流动性最好的 LST
- 在所有主流 DEX 都有深度充足的交易对
- 可以随时以接近 1:1 的比例兑换回 ETH

**2. 最广泛的 DeFi 整合**
- Aave、Compound、Maker 等所有主流借贷协议都支持 wstETH
- Curve、Uniswap、Balancer 上有大量 wstETH 池
- 可以作为抵押品、LP、收益代币使用

**3. 双重收益叠加**
- Lido 质押收益：3.5-4% APR
- EigenLayer AVS 奖励：3-10% APR
- 总收益：6-14% APR

**4. 成熟和安全**
- Lido 运营 4+ 年，TVL $32B，经过时间验证
- EigenLayer 经过多次审计，TVL $15B+
- 两者都是行业标杆

### 与其他方案对比

| 方案 | 流动性 | DeFi整合 | 收益 | 复杂度 | 推荐度 |
|-----|--------|---------|------|--------|--------|
| wstETH + EigenLayer | 最高 | 最好 | 6-14% | 中 | ⭐⭐⭐⭐⭐ |
| ezETH (Renzo) | 高 | 好 | 8-16% | 低 | ⭐⭐⭐⭐⭐ |
| eETH (Ether.fi) | 高 | 好 | 7-16% | 低 | ⭐⭐⭐⭐ |
| pufETH (Puffer) | 中 | 低 | 6-13% | 低 | ⭐⭐⭐⭐ |

## 实操步骤

### Step 1: 获得 wstETH

**方式 A：直接在 Lido 质押（推荐）**

1. 访问 https://lido.fi
2. 连接钱包
3. 输入要质押的 ETH 数量
4. 点击 "Stake"，获得 stETH（1:1）
5. 点击 "Wrap"，将 stETH 转换为 wstETH
   - wstETH 是 stETH 的包装版本，更适合 DeFi
   - 汇率约 1 stETH = 0.9 wstETH

**方式 B：在 DEX 购买**
- 如果市场上 wstETH 有折价，直接购买更划算
- Curve wstETH/ETH 池流动性最好

### Step 2: 将 wstETH 存入 EigenLayer

1. 访问 https://app.eigenlayer.xyz
2. 连接钱包
3. 选择 "Restake"
4. 选择 wstETH 作为存款资产
5. 输入金额
6. 授权并确认交易
7. 选择委托的 Operator
8. 选择参与的 AVS（推荐：EigenDA、Omni、Lagrange）

### Step 3: 监控收益

**收益来源**
1. stETH 基础收益：自动复利到 wstETH 价值中
2. EigenLayer AVS 奖励：需要定期 Claim
3. EigenLayer Points：自动累积
4. Operator 可能的额外奖励

**监控工具**
- EigenLayer Dashboard
- DeBank / Zapper（资产聚合）
- Lido Dashboard（查看 stETH/wstETH 余额）

### Step 4: DeFi 策略优化（可选）

**策略 1：Aave 循环借贷**
- 存入 wstETH 作为抵押品
- 借出 ETH（75% LTV）
- 将借出的 ETH 再质押为 wstETH
- 重复 1-2 次，实现 2-2.5x 杠杆
- 收益：15-25% APR
- 风险：需要监控清算风险

**策略 2：Curve LP**
- 提供 wstETH/ETH 流动性
- 赚取交易手续费 + CRV 奖励
- 额外收益：5-12% APR

**策略 3：Pendle 收益交易**
- 将 wstETH 分拆为 PT 和 YT
- 买入 PT 锁定固定收益（8-12% APY）
- 或买入 YT 放大收益（20-35% APY）

## 收益计算示例

**案例：10 ETH 投入**

1. 在 Lido 质押获得 10 stETH → 包装为 9 wstETH
2. 将 9 wstETH 存入 EigenLayer

**年化收益**
- stETH 基础收益：10 × 3.8% = 0.38 ETH
- EigenLayer AVS：9 × 8% = 0.72 ETH
- EigenLayer Points：可能价值 0.5-1 ETH（未来）
- 总计：1.1 ETH（11% APR）确定收益

**配合 Aave 循环借贷**
- 总杠杆：2.3x
- 杠杆后收益：1.1 × 2.3 = 2.53 ETH
- 借款成本：0.6 ETH
- 净收益：1.93 ETH（19.3% APR）

## 风险管理

**主要风险**
1. Lido 智能合约风险（低，已运营 4+ 年）
2. EigenLayer 智能合约风险（中低，多次审计）
3. wstETH 脱锚风险（极低，流动性充足）
4. Operator 风险（中，选择可靠 Operator）
5. DeFi 策略风险（中高，取决于杠杆程度）

**缓解措施**
- 分散到 2-3 个 Operator
- 不要过度杠杆（建议 <2.5x）
- 监控健康因子（Aave）
- 设置价格警报

## 总结

**适合人群**
- 追求流动性和收益平衡
- 希望使用成熟、经过验证的协议
- 想要广泛的 DeFi 整合选项
- 资金量较大（>10 ETH）

**推荐策略**
- 保守：纯 wstETH + EigenLayer（6-14% APR）
- 平衡：+ Curve LP（10-18% APR）
- 激进：+ Aave 循环借贷（15-25% APR）

**核心优势**
- 最高流动性
- 最广泛 DeFi 整合
- 最成熟安全
- 双重收益叠加
  `,
  steps: [
    { order_index: 1, title: '获得 wstETH', description: '访问 Lido，质押 ETH 获得 stETH，然后包装为 wstETH。或在 Curve 直接购买 wstETH。' },
    { order_index: 2, title: '存入 EigenLayer', description: '将 wstETH 存入 EigenLayer，选择 Operator 和 AVS，开始赚取再质押奖励。' },
    { order_index: 3, title: '监控收益', description: '定期查看 stETH 收益、EigenLayer 奖励和积分累积。每月 Claim 一次奖励。' },
    { order_index: 4, title: 'DeFi 优化（可选）', description: '使用 wstETH 在 Aave、Curve、Pendle 等协议中获取额外收益。' },
  ],
  status: 'published'
};

// 9.8: Pendle PT-ezETH 固定收益策略
const STRATEGY_9_8 = {
  title: 'Pendle PT-ezETH 固定收益策略 - 锁定再质押确定性收益',
  slug: 'pendle-pt-ezeth-fixed-yield',
  summary: '通过 Pendle 购买 PT-ezETH（Principal Token），锁定 ezETH 的未来收益，获得类似债券的固定年化回报，适合追求确定性收益和风险对冲的用户。',
  category: 'restaking',
  category_l1: 'yield',
  category_l2: '再质押/LRT',
  difficulty_level: 2,
  risk_level: 1,
  apy_min: 8,
  apy_max: 15,
  threshold_capital: '0.1 ETH 起',
  threshold_capital_min: 300,
  time_commitment: '初次设置 30 分钟，到期后 10 分钟 Claim',
  time_commitment_minutes: 30,
  threshold_tech_level: 'intermediate',
  content: `
## 什么是 Pendle PT-ezETH 固定收益策略

Pendle 是一个收益交易协议，可以将收益代币（如 ezETH）分拆为：
- **PT（Principal Token）**：本金代币，到期 1:1 兑换回 ezETH
- **YT（Yield Token）**：收益代币，获得期间的所有收益

通过购买 PT-ezETH，你可以：
1. 以折价购买未来的 ezETH
2. 锁定确定的固定年化收益
3. 避免市场波动风险
4. 到期后 1:1 赎回 ezETH

### 核心优势

**1. 确定性收益**
- 购买时就知道到期收益（如固定 12% APY）
- 不受市场波动影响
- 类似于传统金融的债券

**2. 低风险**
- 只要持有到期，必然获得固定收益
- ezETH 本身的风险（Renzo + EigenLayer）
- 无需担心 AVS 收益波动

**3. 适合对冲**
- 如果你看跌未来收益率，PT 是最佳选择
- 或用于平衡高风险策略（如 YT、杠杆）

**4. 简单易懂**
- 买入 PT，持有到期，赎回
- 无需监控、无需 Claim、无需操作

### 工作原理

**示例**

假设当前：
- ezETH 价格：1 ETH
- Pendle PT-ezETH（2024-12-31 到期）价格：0.89 ETH
- 隐含固定 APY：12%

你用 10 ETH 购买 PT-ezETH：
- 购买数量：10 / 0.89 = 11.24 PT-ezETH
- 到期（2024-12-31）时，11.24 PT-ezETH → 11.24 ezETH
- 收益：11.24 - 10 = 1.24 ETH（12.4%）
- 持有期：假设 12 个月，年化 12.4%

## 实操步骤

### Step 1: 准备 ETH 或稳定币

PT-ezETH 可以用多种资产购买：
- ETH（推荐，最简单）
- ezETH（如果你已经有）
- USDC / USDT（稳定币）

### Step 2: 在 Pendle 购买 PT-ezETH

1. 访问 https://app.pendle.finance
2. 连接钱包
3. 搜索 "ezETH"
4. 选择一个到期日的市场
   - 通常有 3 个月、6 个月、12 个月的选项
   - 到期日越远，固定 APY 可能越高
5. 点击 "PT" 标签
6. 输入要购买的数量（如 10 ETH）
7. 查看：
   - 将收到的 PT-ezETH 数量
   - 固定 APY（如 12.5%）
   - 到期日期
8. 点击 "Buy PT"
9. 授权并确认交易

### Step 3: 持有到期

**期间无需任何操作**
- PT-ezETH 会自动累积价值
- 你可以在钱包中看到 PT-ezETH 余额
- 也可以在 Pendle Dashboard 查看

**如果需要提前退出**
- 可以在 Pendle 二级市场卖出 PT-ezETH
- 价格取决于市场供需和剩余时间
- 可能有 1-3% 的价差

### Step 4: 到期后赎回

1. 到期日当天或之后，访问 Pendle App
2. 进入 "Portfolio" 页面
3. 找到到期的 PT-ezETH
4. 点击 "Redeem"
5. 1:1 兑换为 ezETH
6. ezETH 出现在钱包中

**赎回后的 ezETH 可以**
- 继续持有（赚取 ezETH 收益）
- 在 Renzo 赎回为 ETH
- 在 DEX 上卖出为 ETH
- 购买下一期的 PT-ezETH（复利）

## 收益计算示例

**案例 1：单次投资（10 ETH）**

- 购买时间：2024-06-01
- 到期时间：2024-12-31（7 个月）
- PT-ezETH 价格：0.93 ETH
- 固定 APY：12%

计算：
- 投入：10 ETH
- 购买：10 / 0.93 = 10.75 PT-ezETH
- 到期：10.75 PT-ezETH → 10.75 ezETH
- 收益：0.75 ezETH
- 年化：0.75 / 10 × (12/7) = 12.9% APR

**案例 2：滚动复利（10 ETH，2 年）**

策略：每 6 个月到期后，立即购买下一期 PT

- 第 1 期（6 个月）：10 ETH → 10.6 ezETH（12% APY）
- 第 2 期（6 个月）：10.6 ETH → 11.24 ezETH（12% APY）
- 第 3 期（6 个月）：11.24 ETH → 11.91 ezETH（12% APY）
- 第 4 期（6 个月）：11.91 ETH → 12.62 ezETH（12% APY）

2 年后：
- 最终：12.62 ezETH
- 总收益：2.62 ETH（26.2% 总回报）
- 年化（复利）：12.4% APR

对比：
- 如果直接持有 ezETH：10 × 1.12^2 = 12.54 ezETH
- PT 策略略高（因为锁定了高 APY）

## 与其他策略对比

| 策略 | APR | 风险 | 确定性 | 流动性 | 复杂度 |
|-----|-----|------|--------|--------|--------|
| PT-ezETH | 8-15% | 低 | 高（固定） | 中（二级市场） | 低 |
| 持有 ezETH | 8-16% | 中 | 中（波动） | 高 | 低 |
| YT-ezETH | 15-40% | 高 | 低（高波动） | 低 | 中 |
| ezETH + Aave 借贷 | 15-30% | 高 | 低 | 中 | 高 |

**何时选择 PT**
- ✅ 看跌未来收益率（认为 ezETH APR 会下降）
- ✅ 追求确定性（不想承担波动）
- ✅ 对冲其他高风险策略
- ✅ 长期持有（持有到期最优）

**何时不选择 PT**
- ❌ 看涨未来收益率（认为 ezETH APR 会上升，直接持有更好）
- ❌ 需要高流动性（PT 二级市场流动性一般）
- ❌ 追求最高收益（YT 或杠杆策略更高）

## 风险管理

**主要风险**

1. **ezETH 本身风险**
   - Renzo 智能合约风险
   - EigenLayer 风险
   - AVS Slashing 风险
   - ezETH 脱锚风险
   - 这些风险 PT 无法消除（只是固定了收益率）

2. **Pendle 智能合约风险**
   - Pendle 已经多次审计
   - TVL $3B+，经过市场验证
   - 风险较低

3. **机会成本风险**
   - 如果持有期间 ezETH APR 大幅上升（如从 12% 涨到 20%）
   - 你锁定的 12% APY 会低于市场
   - 损失潜在收益

4. **提前退出风险**
   - 如果需要在到期前卖出 PT
   - 可能以低于购买价的价格卖出
   - 损失 1-3%

**缓解措施**
- ✅ 只投入可以锁定到到期的资金
- ✅ 选择较短的到期日（3-6 个月）以保持灵活性
- ✅ 分散到多个到期日（如 30% 3个月、40% 6个月、30% 12个月）
- ✅ 监控 ezETH 健康状况
- ✅ 设置到期日历提醒

## 进阶技巧

**技巧 1：阶梯式购买**

不要一次性买入 12 个月的 PT，而是分散到多个到期日：
- 30% → 3 个月后到期
- 40% → 6 个月后到期
- 30% → 12 个月后到期

好处：
- 每 3 个月就有资金到期，可以根据市场重新配置
- 降低机会成本风险
- 保持一定灵活性

**技巧 2：收益率曲线套利**

有时候不同到期日的 PT 固定 APY 会有差异：
- 3 个月 PT：10% APY
- 6 个月 PT：12% APY
- 12 个月 PT：11% APY

这时选择 6 个月 PT（最高 APY），到期后再评估。

**技巧 3：PT + YT 组合**

如果你不确定未来收益率走向：
- 50% 买入 PT（锁定固定收益，保底）
- 50% 买入 YT（如果收益率上升，YT 大涨）
- 无论收益率涨跌，都有一部分获益

**技巧 4：定期滚动**

到期后不要赎回为 ETH，而是：
1. 赎回为 ezETH
2. 立即用 ezETH 购买下一期 PT
3. 实现复利效应
4. 滚动 2-3 年，收益显著

## 常见问题

**Q1：PT-ezETH 的固定 APY 是如何确定的？**
A：由市场供需决定。如果很多人买入 PT（追求固定收益），PT 价格上涨，固定 APY 下降。反之亦然。

**Q2：如果 ezETH 本身出问题（如被黑客攻击），PT 会怎样？**
A：PT 不能对冲 ezETH 本身的风险。如果 ezETH 归零，PT-ezETH 也归零。PT 只是固定了收益率，不是保险。

**Q3：我可以提前赎回 PT 吗？**
A：可以在 Pendle 二级市场卖出，但价格由市场决定，可能低于购买价。建议持有到期。

**Q4：PT-ezETH 到期后不赎回会怎样？**
A：PT 不会自动赎回。到期后，PT 会一直保留在你的钱包中，你需要手动在 Pendle 上赎回为 ezETH。

**Q5：PT-ezETH 的固定 APY 和 ezETH 实际 APR 有什么关系？**
A：
- 如果实际 APR > 固定 APY：持有 ezETH 更好
- 如果实际 APR < 固定 APY：持有 PT 更好
- PT 相当于"押注"未来收益率会低于固定 APY

**Q6：如何选择到期日？**
A：
- 短期（3 个月）：灵活性高，但 APY 可能较低
- 中期（6 个月）：平衡选择，推荐
- 长期（12 个月）：APY 可能较高，但锁定时间长

**Q7：Gas 费用高吗？**
A：
- 购买 PT：$15-30
- 到期赎回：$10-20
- 总成本：约 $30-50
- 对于大额（>10 ETH），Gas 占比很小

**Q8：PT 有积分奖励吗？**
A：
- Pendle Points：持有 PT 会累积 Pendle 积分
- ezETH 积分：通常会继续累积（取决于 Renzo 政策）
- EigenLayer Points：通常继续累积

## 总结

**PT-ezETH 固定收益策略的核心价值**
- ✅ 确定性收益（购买时就知道回报）
- ✅ 低风险（相比 YT、杠杆等策略）
- ✅ 简单易懂（买入、持有、到期赎回）
- ✅ 适合对冲（平衡高风险策略）

**适合人群**
- 保守型投资者
- 追求确定性的用户
- 看跌未来收益率的用户
- 希望锁定当前高收益率的用户

**推荐配置**
- 30-50% 资产用于 PT（固定收益）
- 30-50% 资产持有 ezETH（市场收益）
- 0-20% 资产用于 YT 或杠杆（高风险高收益）

**最后建议**
- 从小额开始（1-2 ETH）
- 选择 3-6 个月的到期日
- 到期后滚动复利
- 分散到多个到期日
- 定期评估固定 APY 是否有吸引力
  `,
  steps: [
    { order_index: 1, title: '准备资产', description: '准备 ETH、ezETH 或稳定币用于购买 PT-ezETH。' },
    { order_index: 2, title: '购买 PT-ezETH', description: '在 Pendle 选择到期日，购买 PT-ezETH，锁定固定 APY。' },
    { order_index: 3, title: '持有到期', description: '无需任何操作，等待到期日到来。可以在 Pendle Dashboard 查看。' },
    { order_index: 4, title: '到期赎回', description: '到期后在 Pendle 上 1:1 赎回为 ezETH，然后决定下一步操作。' },
  ],
  status: 'published'
};

async function uploadStrategies() {
  try {
    console.log('开始上传策略 9.7-9.8...\n');
    const loginResponse = await axios.post(`${DIRECTUS_URL}/auth/login`, {
      email: 'the_uk1@outlook.com',
      password: 'Mygcdjmyxzg2026!'
    });
    const token = loginResponse.data.data.access_token;
    console.log('✓ 登录成功\n');

    const strategies = [STRATEGY_9_7, STRATEGY_9_8];
    for (let i = 0; i < strategies.length; i++) {
      const strategy = strategies[i];
      console.log(`上传: ${strategy.title}...`);
      const response = await axios.post(`${DIRECTUS_URL}/items/strategies`, strategy, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      console.log(`✓ 成功 - ID: ${response.data.data.id}\n`);
    }
    console.log('✓ 9.7-9.8 上传完成！');
  } catch (error) {
    console.error('❌ 错误:', error.response?.data || error.message);
    process.exit(1);
  }
}

uploadStrategies();
