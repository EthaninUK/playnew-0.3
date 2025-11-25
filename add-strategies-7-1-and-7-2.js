const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

// ===== 7.1 Aave 循环借贷挖矿 =====
const STRATEGY_7_1 = {
  title: 'Aave 循环借贷挖矿 - 杠杆收益放大策略',
  slug: 'aave-recursive-lending',
  summary: '在 Aave 存入 ETH 作为抵押,借出稳定币再存入,重复操作放大杠杆倍数,通过循环借贷最大化挖矿收益,实现年化 8-15% 的稳定收益。',

  category: 'lending',
  category_l1: 'yield',
  category_l2: '借贷挖息',

  difficulty_level: 3,
  risk_level: 3,

  apy_min: 8,
  apy_max: 15,
  threshold_capital: '1000 美元起',
  threshold_capital_min: 1000,
  time_commitment: '初始设置 2 小时,每周维护 30 分钟',
  time_commitment_minutes: 150,
  threshold_tech_level: 'intermediate',

  content: `> **适合人群**: 持有 ETH 的用户,希望提高资金利用率
> **阅读时间**: 约 15 分钟
> **关键词**: Aave / 循环借贷 / 杠杆挖矿 / DeFi 蓝筹 / 收益放大

---

## 🎯 什么是 Aave 循环借贷?

### 用大白话解释

想象一下传统金融中的"信用卡套现":
- **传统借贷**: 存 10,000 美元,只能赚存款利息
- **循环借贷**: 存 10,000 美元 ETH → 借 7,000 USDC → 再存入 → 再借 → 重复
- **结果**: 用同样的 10,000 美元本金,获得多倍的挖矿奖励

### Aave 循环借贷的原理

**Aave 的双重收益**:
1. **存款收益**: 存入资产赚取利息 + 挖矿奖励
2. **借款奖励**: 借出资产也有挖矿奖励

**循环放大**:
- 第 1 次: 存 10,000 美元 ETH (LTV 75%)
- 借出 7,500 USDC
- 第 2 次: 存 7,500 USDC
- 借出 5,625 USDC
- 第 3 次: 存 5,625 USDC
- ...重复

**最终效果**: 相当于放大了 3-4 倍的资金量,获得 3-4 倍的挖矿奖励。

---

## 📋 Aave 循环借贷完整教程

### 准备工作

**需要准备**:
1. MetaMask 钱包
2. 至少 1,000 美元的 ETH(建议 5,000+ 美元,Gas 费占比更低)
3. 额外准备 200-300 美元 ETH 用于 Gas 费

**风险理解**:
- 杠杆倍数越高,清算风险越大
- 建议保守策略: 2-3 倍杠杆

### 第一步: 访问 Aave 协议

1. 访问 https://app.aave.com
2. 点击右上角 "Connect Wallet"
3. 选择 MetaMask 并授权
4. 选择网络:
   - **Ethereum 主网**: 收益高但 Gas 贵
   - **Polygon**: Gas 便宜,适合小资金
   - **Arbitrum/Optimism**: 平衡选择

### 第二步: 第一次存款

**操作流程**:

1. **选择资产**: 在 "Supply" 区域找到 ETH
2. **点击 "Supply"**
3. **输入金额**: 例如 5 ETH (约 $10,000)
4. **确认两笔交易**:
   - 第一笔: 授权 Aave 使用你的 ETH
   - 第二笔: 实际存款
5. **等待确认**: 存款成功后,你会收到 aETH (Aave ETH)

**存款后看到的信息**:
- Your supplies: 5 ETH ($10,000)
- APY: 2.5% (存款利息)
- Borrowing power: $7,500 (75% LTV)

### 第三步: 第一次借款

**选择借款资产**:

**推荐**: USDC 或 DAI (稳定币)
- 借款利率较低 (3-5%)
- 价格稳定,不用担心价格波动

**操作流程**:

1. **点击 "Borrow"** 在 USDC 行
2. **计算安全借款量**:
   - 最大可借: $7,500
   - 安全借款: $5,000 (67% 利用率)
   - **重要**: 不要借满!留安全边际
3. **选择利率模式**:
   - **Stable**: 固定利率,更安全
   - **Variable**: 浮动利率,通常更低
   - 推荐新手选 Variable
4. **确认交易**
5. **收到 USDC**: 5,000 USDC 到你的钱包

**借款后状态**:
- Health Factor: 1.5 (安全值 > 1.2)
- Borrowed: 5,000 USDC
- Borrow APY: 4.2%

### 第四步: 第二次存款(开始循环)

**将借来的 USDC 再存入**:

1. **点击 USDC 的 "Supply"**
2. **存入 5,000 USDC**
3. **确认交易**

**现在的状态**:
- Supplied: 5 ETH + 5,000 USDC
- Borrowed: 5,000 USDC
- New Borrowing Power: 增加了约 $3,750

### 第五步: 第二次借款

**继续循环**:

1. **再次借 USDC**: 约 3,000 USDC (保守)
2. **再次存入 USDC**: 3,000 USDC
3. **再次借款**: 约 2,000 USDC
4. **再次存入**: 2,000 USDC

**循环 3-4 次后停止**,不要过度杠杆。

### 最终状态示例

**初始本金**: 5 ETH ($10,000)

**循环后**:
- Supplied: 5 ETH + 10,000 USDC (等值约 $20,000)
- Borrowed: 10,000 USDC
- Health Factor: 1.35
- 实际杠杆: 2 倍

---

## 💰 收益计算

### 收益来源

**1. 存款利息**:
- ETH 存款: 5 ETH × 2.5% APY = 0.125 ETH/年
- USDC 存款: 10,000 USDC × 3% APY = 300 USDC/年

**2. 借款成本**:
- USDC 借款: 10,000 USDC × 4.2% APY = -420 USDC/年

**3. 挖矿奖励**(关键):
- Aave 会发放平台币奖励(如果有)
- 存款和借款都有奖励

**净收益计算**:
- 存款收益: $250 + $300 = $550
- 借款成本: -$420
- 挖矿奖励: +$800 (估算)
- **年净收益**: $930
- **APY**: $930 / $10,000 = **9.3%**

### 真实 APY 范围

- **保守策略**(2 倍杠杆): 8-12% APY
- **激进策略**(3-4 倍杠杆): 12-18% APY,但风险高

---

## ⚠️ 风险管理 - 最重要!

### 主要风险: 清算

**什么是清算**?
- 当 Health Factor < 1.0 时,你的抵押品会被强制卖出
- 损失约 5-10% 的抵押品

**导致清算的原因**:
1. **ETH 价格下跌**: 抵押品价值降低
2. **借款利率上升**: 债务增加
3. **过度杠杆**: Health Factor 太低

### 安全指标

**Health Factor 安全线**:
- **> 2.0**: 非常安全
- **1.5 - 2.0**: 安全
- **1.2 - 1.5**: 需要关注
- **< 1.2**: 危险,立即行动
- **< 1.0**: 被清算

**建议**:
- 保持 Health Factor > 1.5
- 如果 < 1.3,立即还款或补充抵押

### 防止清算的操作

**方法 1: 还款**
1. 点击 "Repay"
2. 还部分 USDC
3. Health Factor 上升

**方法 2: 增加抵押**
1. 再存入 ETH 或稳定币
2. 抵押品增加,Health Factor 上升

**方法 3: 设置预警**
- 使用 DeFi Saver 等工具设置自动预警
- Health Factor < 1.4 时收到通知

---

## 🔥 高级优化技巧

### 技巧 1: 使用 DeFi Saver 自动化

**DeFi Saver 是什么**?
- Aave 仓位管理工具
- 可以一键完成循环借贷
- 自动监控并防止清算

**使用步骤**:
1. 访问 https://app.defisaver.com
2. 连接钱包
3. 创建 Aave 仓位
4. 点击 "Boost"(增加杠杆)
5. 设置目标杠杆倍数(如 2x)
6. 确认,自动完成循环

### 技巧 2: 选择最优资产组合

**最优抵押品**:
- **ETH**: 流动性最好,LTV 高(82.5%)
- **stETH**: 本身有质押收益,LTV 高
- **WBTC**: 稳定,LTV 75%

**最优借款资产**:
- **USDC/USDT**: 借款利率低
- **DAI**: 去中心化,更安全

**组合建议**:
- 抵押 stETH(赚质押收益 4%)
- 借 USDC(利率 4%)
- 循环后净收益更高

### 技巧 3: 跨链套利

**不同链的收益差异**:
- **Ethereum**: APY 高,Gas 贵
- **Polygon**: Gas 便宜,适合小资金
- **Arbitrum**: 平衡选择

**策略**: 小资金用 Polygon,大资金用 Ethereum

### 技巧 4: 季节性调整

**牛市**:
- ETH 上涨,可以适当提高杠杆
- 但要警惕回调

**熊市**:
- 降低杠杆或退出
- 或切换到稳定币对稳定币(无清算风险)

---

## 📊 实战案例

### 案例 1: 保守策略

**初始**: 10 ETH ($20,000)
**操作**:
1. 存 10 ETH
2. 借 10,000 USDC (50% LTV)
3. 存 10,000 USDC
4. 借 6,000 USDC
5. 存 6,000 USDC

**结果**:
- 总抵押: $36,000 等值
- 总借款: $16,000
- Health Factor: 1.8
- 年收益: $1,800 (9% APY)

### 案例 2: 激进策略

**初始**: 10 ETH ($20,000)
**操作**: 循环 5 次,达到 3 倍杠杆

**结果**:
- 总抵押: $60,000 等值
- 总借款: $40,000
- Health Factor: 1.25
- 年收益: $3,000 (15% APY)

**风险**: ETH 跌 20% 会被清算

---

## ❓ 常见问题

**Q1: 循环借贷安全吗?**
> 只要保持 Health Factor > 1.5,非常安全。关键是不要贪心,不要过度杠杆。

**Q2: Gas 费很贵怎么办?**
> 使用 L2(Polygon/Arbitrum)或等 Gas 低时操作(周末/凌晨)。

**Q3: 如果 ETH 暴跌怎么办?**
> 立即还款或增加抵押。可以设置 DeFi Saver 自动保护。

**Q4: 可以一直放着不管吗?**
> 不行!至少每周检查一次 Health Factor。

**Q5: 收益是自动复利吗?**
> 是的,Aave 的 aToken 会自动增值,但要手动提取挖矿奖励。

---

## ✅ 新手检查清单

**开始前**:
- [ ] 理解清算风险
- [ ] 准备足够 Gas 费
- [ ] 只用闲钱,不要 All in

**操作中**:
- [ ] 保持 Health Factor > 1.5
- [ ] 不要一次性借满
- [ ] 循环不超过 3-4 次

**操作后**:
- [ ] 每周检查 Health Factor
- [ ] 设置价格预警
- [ ] 准备好应急还款资金

---

## 🎓 总结

Aave 循环借贷是 DeFi 中成熟的收益放大策略,通过杠杆可以将 3-5% 的基础收益提升到 10-15%。

**成功关键**:
1. **保守杠杆**: 不要超过 3 倍
2. **定期监控**: 每周检查 Health Factor
3. **快速反应**: ETH 大跌时立即行动
4. **长期视角**: 不要因为短期波动慌张

**风险提示**: 循环借贷不适合新手,建议先用小额资金(1,000 美元)练手,熟悉流程后再加大投入。

祝你在 Aave 上获得稳定收益!💰
`,

  steps: [
    { step_number: 1, title: '连接 Aave', description: '访问 app.aave.com 连接钱包,选择网络。', estimated_time: '10 分钟' },
    { step_number: 2, title: '第一次存款', description: '存入 ETH 作为抵押品。', estimated_time: '15 分钟' },
    { step_number: 3, title: '第一次借款', description: '借出 USDC,保持安全 Health Factor。', estimated_time: '10 分钟' },
    { step_number: 4, title: '循环操作', description: '将借来的 USDC 存入,再借,循环 3-4 次。', estimated_time: '1 小时' },
    { step_number: 5, title: '监控维护', description: '每周检查 Health Factor,必要时调整。', estimated_time: '每周 30 分钟' },
  ],
};

// ===== 7.2 Compound 自动循环策略 =====
const STRATEGY_7_2 = {
  title: 'Compound 自动循环策略 - DeFi Saver 一键杠杆',
  slug: 'compound-auto-recursive',
  summary: '使用 DeFi Saver 等自动化工具在 Compound 上自动执行循环借贷,一键设置目标杠杆倍数,并自动维护安全的健康度,实现 10-20% 年化收益。',

  category: 'lending',
  category_l1: 'yield',
  category_l2: '借贷挖息',

  difficulty_level: 3,
  risk_level: 3,

  apy_min: 10,
  apy_max: 20,
  threshold_capital: '2000 美元起',
  threshold_capital_min: 2000,
  time_commitment: '初始设置 1 小时,自动维护',
  time_commitment_minutes: 60,
  threshold_tech_level: 'intermediate',

  content: `> **适合人群**: 希望自动化管理借贷仓位的 DeFi 玩家
> **阅读时间**: 约 12 分钟
> **关键词**: Compound / DeFi Saver / 自动化 / 一键杠杆 / 自动再平衡

---

## 🎯 什么是 Compound 自动循环?

### Compound vs Aave

**Compound 的特点**:
- DeFi 借贷鼻祖,安全性极高
- 发放 COMP 代币奖励
- 用户界面简单

**自动化的价值**:
- **手动循环**: 需要 10+ 笔交易,Gas 费贵
- **自动循环**: DeFi Saver 一键完成,节省 70% Gas

---

## 📋 DeFi Saver 完整使用教程

### 第一步: 连接 DeFi Saver

1. **访问**: https://app.defisaver.com
2. **连接钱包**: MetaMask
3. **选择协议**: Compound V3
4. **授权**: 签名授权(免费)

### 第二步: 创建仓位

**创建新仓位**:
1. 点击 "Create Position"
2. 选择抵押品: ETH
3. 选择借款资产: USDC
4. 输入初始金额: 例如 5 ETH

### 第三步: 设置 Boost(杠杆)

**Boost 是什么**?
- 自动循环借贷的功能
- 一键达到目标杠杆倍数

**操作步骤**:

1. **点击 "Boost"** 按钮
2. **设置目标杠杆**:
   - 滑动条选择: 1.5x, 2x, 2.5x, 3x
   - 或自定义
3. **查看模拟结果**:
   - 最终抵押品金额
   - 最终借款金额
   - Health Factor
   - 预估 APY
4. **确认交易**

**一笔交易完成**:
- DeFi Saver 通过闪电贷自动完成循环
- 只需 1 笔交易,节省 Gas

### 第四步: 设置自动保护

**Automation 功能**:

**1. 自动 Repay(还款保护)**:
- 当 Health Factor < 设定值(如 1.6)
- 自动还款,提高 Health Factor 到 2.0
- 防止清算

**2. 自动 Boost(再杠杆)**:
- 当 Health Factor > 设定值(如 2.5)
- 自动增加杠杆,保持收益最大化

**设置步骤**:
1. 点击 "Automation"
2. 开启 "Auto Repay"
   - 触发值: 1.6
   - 目标值: 2.0
3. 开启 "Auto Boost"(可选)
   - 触发值: 2.5
   - 目标值: 2.0
4. 确认并支付少量 ETH 作为执行费

---

## 💰 收益分析

### 收益来源

**1. COMP 代币奖励**:
- 存款奖励: 每个市场不同
- 借款奖励: 也有 COMP 奖励

**2. 利息差**:
- 存款利息 - 借款利息

### 实际案例

**初始**: 10 ETH ($20,000)
**目标杠杆**: 2.5x

**Boost 后**:
- 总抵押: $50,000 等值
- 总借款: $30,000
- Health Factor: 1.65

**年收益**:
- COMP 奖励: $2,400 (存款 + 借款)
- 利息差: -$600 (借款利息高于存款)
- **净收益**: $1,800
- **APY**: 9%

**加上 ETH 价格上涨**:
- 如果 ETH 涨 20%,本金增值 $4,000
- **总收益**: $5,800 (29% 回报)

---

## 🔥 高级策略

### 策略 1: 稳定币对稳定币(零清算风险)

**操作**:
1. 抵押: USDC
2. 借款: DAI
3. 杠杆: 10x (无清算风险)

**收益**:
- 主要来自 COMP 奖励
- 无价格波动风险
- APY: 5-8%

### 策略 2: stETH 循环

**操作**:
1. 抵押: stETH (本身有 4% 质押收益)
2. 借款: ETH
3. 杠杆: 3x

**收益**:
- stETH 质押: 4%
- COMP 奖励: 8%
- 利息差: -2%
- **总 APY**: 10%

### 策略 3: 波动率套利

**牛市**:
- 提高杠杆到 3-4x
- 赚取 ETH 上涨 + 利息

**熊市**:
- 降低杠杆到 1.5x
- 或切换到稳定币策略

---

## ⚠️ 风险管理

### DeFi Saver 自动保护机制

**工作原理**:
1. DeFi Saver 的机器人 24/7 监控
2. Health Factor 触发阈值时自动执行
3. 使用你预存的 ETH 支付 Gas

**成本**:
- 每次自动执行: 约 0.01-0.03 ETH Gas 费
- 值得!比清算损失小得多

### 极端情况应对

**闪崩(Flash Crash)**:
- ETH 短时间暴跌 30%+
- 自动保护可能来不及执行
- **应对**: 保持 Health Factor > 1.8

**Gas 费暴涨**:
- 自动执行成本变高
- 可能导致执行失败
- **应对**: 预存足够 ETH(0.5 ETH+)

---

## 📊 与手动循环对比

| 对比项 | 手动循环 | DeFi Saver 自动 |
|--------|---------|----------------|
| 设置时间 | 2-3 小时 | 10 分钟 |
| 交易次数 | 10+ 笔 | 1 笔 |
| Gas 费 | $200-$500 | $50-$100 |
| 维护 | 需要每天检查 | 自动维护 |
| 清算风险 | 手动防御 | 自动防御 |
| 推荐度 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

---

## ✅ 操作检查清单

**设置前**:
- [ ] 准备 2,000+ 美元本金
- [ ] 准备 0.5 ETH Gas 费
- [ ] 理解清算机制

**设置中**:
- [ ] 杠杆不超过 3x(新手 2x)
- [ ] 开启 Auto Repay
- [ ] 设置合理触发值

**运行后**:
- [ ] 每周检查一次仓位
- [ ] 确保预存 ETH 充足
- [ ] 定期提取 COMP 奖励

---

## 🎓 总结

DeFi Saver + Compound 是自动化借贷挖矿的最佳组合,通过一键 Boost 和自动保护,大大降低了操作难度和清算风险。

**适合人群**:
- 有一定 DeFi 经验
- 不想每天盯盘
- 愿意支付自动化成本

推荐作为 DeFi 稳定收益的核心策略!
`,

  steps: [
    { step_number: 1, title: '连接 DeFi Saver', description: '访问 defisaver.com,连接钱包。', estimated_time: '5 分钟' },
    { step_number: 2, title: '创建 Compound 仓位', description: '选择抵押品和借款资产,输入金额。', estimated_time: '10 分钟' },
    { step_number: 3, title: '一键 Boost', description: '设置目标杠杆,一笔交易完成循环。', estimated_time: '15 分钟' },
    { step_number: 4, title: '设置自动保护', description: '开启 Auto Repay 和 Auto Boost。', estimated_time: '10 分钟' },
    { step_number: 5, title: '定期检查', description: '每周查看仓位健康度和收益。', estimated_time: '每周 10 分钟' },
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
    const strategies = [STRATEGY_7_1, STRATEGY_7_2];

    console.log('\n开始创建 7.1 和 7.2 策略...\n');

    for (let i = 0; i < strategies.length; i++) {
      const strategy = {
        ...strategies[i],
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
        }
      );

      console.log(`✅ [${i + 1}/2] ${strategy.title}`);
      console.log(`   ID: ${response.data.data.id}`);
      console.log(`   Slug: ${response.data.data.slug}\n`);
    }

    console.log('🎉 创建完成！');
    console.log('访问: http://localhost:3000/strategies?category=lending\n');
  } catch (error) {
    console.error('\n❌ 创建失败:', error.response?.data || error.message);
  }
}

addStrategies();