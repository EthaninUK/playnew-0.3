const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

// ===== 10.1 MakerDAO RWA 金库 =====
const STRATEGY_10_1 = {
  title: 'MakerDAO RWA 金库 - 链上投资真实资产',
  slug: 'makerdao-rwa-vault',
  summary: '通过 MakerDAO 投资 RWA(真实世界资产)支持的 DAI 金库,赚取稳定的国债收益,年化 4-6%,资产由美国国债、房地产贷款等支持,DeFi 蓝筹安全保障。',

  category: 'rwa',
  category_l1: 'yield',
  category_l2: 'RWA/链上国债',

  difficulty_level: 2,
  risk_level: 2,

  apy_min: 4,
  apy_max: 6,
  threshold_capital: '1000 美元起',
  threshold_capital_min: 1000,
  time_commitment: '初始设置 30 分钟,长期持有',
  time_commitment_minutes: 30,
  threshold_tech_level: 'beginner',

  content: `> **适合人群**: 追求稳定收益,希望投资真实资产的保守型玩家
> **阅读时间**: 约 15 分钟
> **关键词**: MakerDAO / RWA / 真实资产 / 国债 / 稳定收益 / DeFi 蓝筹

---

## 🎯 什么是 MakerDAO RWA?

### RWA 的定义

**RWA = Real World Assets**(真实世界资产)
- 传统金融资产代币化
- 美国国债、房地产贷款、公司债券等
- 上链后可在 DeFi 中使用

### MakerDAO 的 RWA 策略

**背景**: MakerDAO 是 DeFi 最大的稳定币协议(DAI 发行方)

**RWA 金库的作用**:
1. MakerDAO 将部分资金投资真实资产
2. 赚取稳定的现实世界收益
3. 用收益支撑 DAI 的稳定性
4. DAI 持有者间接受益

**投资标的**(MakerDAO 实际持有):
- 美国国债(最安全)
- 房地产抵押贷款
- 企业应收账款
- 农业贷款

**总规模**: 超 20 亿美元 RWA 资产

---

## 📋 如何投资 MakerDAO RWA?

### 方法 1: 持有 DAI 并存入 DSR

**DSR = DAI Savings Rate**(DAI 储蓄利率)

**原理**:
- MakerDAO 将 RWA 收益的一部分分配给 DAI 持有者
- 存入 DSR,自动赚取利息

**操作步骤**:

1. **获取 DAI**:
   - 从交易所购买
   - 或在 Uniswap 兑换
   - 或在 MakerDAO 铸造(抵押 ETH)

2. **访问 DSR**:
   - 访问 https://app.spark.fi 或 https://summer.fi
   - 连接 MetaMask
   - 找到 "DAI Savings Rate" 或 "Earn"

3. **存入 DAI**:
   - 输入金额(如 10,000 DAI)
   - 确认交易(Gas 费 $5-$20)
   - 开始赚取利息

4. **收益自动累积**:
   - 利息自动复利
   - DAI 余额自动增长
   - 随时可以提取

**当前 DSR 利率**: 约 5% APY(会根据 MakerDAO 治理调整)

### 方法 2: 投资 MakerDAO RWA 相关代币

**间接参与 RWA**:

1. **持有 MKR 代币**:
   - MakerDAO 的治理代币
   - RWA 收益的一部分用于回购 MKR
   - 长期看涨

2. **参与 MakerDAO 治理**:
   - 质押 MKR 参与投票
   - 决定 RWA 投资方向
   - 获得治理奖励

---

## 💰 收益分析

### DSR 收益计算

**投入**: 10,000 DAI

**年收益**:
- DSR APY: 5%
- 年利息: $500
- 复利后: $512(自动复投)

**对比**:
- 银行储蓄: 0.5% ($50/年)
- MakerDAO DSR: 5% ($500/年)
- **提升 10 倍**

### 安全性分析

**为什么 DSR 安全?**

1. **MakerDAO 是 DeFi 蓝筹**:
   - 运行 8 年+
   - TVL 超 50 亿美元
   - 经历多轮牛熊考验

2. **真实资产支撑**:
   - 20 亿美元美国国债
   - 不是空气币奖励
   - 来自现实世界的收益

3. **透明度高**:
   - 所有 RWA 资产公开可查
   - 定期审计报告
   - 链上数据可验证

4. **随时退出**:
   - 无锁定期
   - 随时提取 DAI
   - 流动性极好

---

## 🔥 高级策略

### 策略 1: DSR + 稳定币套利

**组合收益**:

1. **借入低成本稳定币**:
   - 在 Spark Protocol 借 DAI(利率 1.5%)
   - 或在 Aave 借 USDC 换成 DAI

2. **存入 DSR**:
   - DSR 收益: 5%
   - 借款成本: 1.5%
   - **净收益**: 3.5%

3. **杠杆放大**:
   - 如果用 10 ETH 抵押借 $15,000 DAI
   - 存入 DSR 赚 $750/年
   - 借款成本 $225/年
   - **净赚**: $525/年

### 策略 2: DAI + RWA 代币组合

**多元化 RWA 投资**:

1. **50% 存入 DSR**:
   - 稳定收益 5%
   - 零风险

2. **30% 投资 ONDO/OUSG**:
   - 直接投资国债代币
   - 收益 5-6%

3. **20% 持有 MKR**:
   - 治理代币
   - 长期增值潜力

**预期年化**: 6-8%

### 策略 3: 长期 DCA 策略

**定投策略**:
1. 每月买入 $1,000 DAI
2. 全部存入 DSR
3. 复利增长
4. 长期持有(3-5 年)

**10 年后**(假设 DSR 保持 5%):
- 总投入: $120,000
- 复利收益: $32,000
- **最终**: $152,000

---

## 📊 MakerDAO RWA 资产详情

### 当前 RWA 持仓(2024 年数据)

| 资产类型 | 规模 | 收益率 | 风险评级 |
|---------|------|--------|---------|
| 美国国债 | $12 亿 | 4.5% | AAA |
| 房地产贷款 | $5 亿 | 6.5% | A |
| 企业应收账款 | $2 亿 | 7% | BBB |
| 农业贷款 | $1 亿 | 6% | A |

**平均收益率**: 5.5%
**分配给 DSR**: 约 5%(略低于平均,留部分给协议储备)

### RWA 合作伙伴

**Monetalis**:
- 管理 MakerDAO 的国债投资
- 与传统金融机构合作
- 透明度高,定期报告

**Huntingdon Valley Bank**:
- 美国银行合作伙伴
- 提供合规通道
- FDIC 保险

**BlockTower Credit**:
- 机构级信贷服务
- 管理企业贷款
- 风控严格

---

## ⚠️ 风险与注意事项

### 主要风险

**1. 智能合约风险**:
- MakerDAO 合约复杂
- 虽然经过多次审计,但仍有风险
- **缓解**: MakerDAO 运行 8 年无重大事故

**2. DAI 脱锚风险**:
- DAI 短期可能偏离 $1
- 通常在 $0.98-$1.02 范围
- **缓解**: MakerDAO PSM 机制快速稳定

**3. 监管风险**:
- RWA 涉及现实世界监管
- 政策变化可能影响
- **缓解**: MakerDAO 与合规机构合作

**4. DSR 利率变化**:
- DSR 由治理投票调整
- 可能降低或提高
- **缓解**: 历史上保持稳定,跟随美联储利率

### 与传统国债对比

| 对比项 | 传统国债 | MakerDAO DSR |
|--------|---------|--------------|
| 收益率 | 4-5% | 5% |
| 购买门槛 | $1,000+ | $1+ |
| 流动性 | 需到期或二级市场 | 随时提取 |
| 手续费 | 交易佣金 | Gas 费($5-$20) |
| 透明度 | 政府公开 | 链上完全透明 |
| 监管保护 | 政府背书 | 代码保障 |

**优势**: 流动性好,门槛低
**劣势**: 无政府信用背书

---

## 📱 实用工具

### DSR 计算器

**在线工具**:
- https://dsr.tools
- 输入 DAI 金额和时间
- 计算预期收益

### MakerDAO RWA Dashboard

**查看 RWA 资产详情**:
- https://makerburn.com
- 实时 RWA 持仓
- 收益分配情况

### DAI 持仓追踪

**Portfolio Tracker**:
- Zapper.fi
- DeBank
- 自动追踪 DSR 收益

---

## ❓ 常见问题

**Q1: DSR 收益从哪来?**
> 来自 MakerDAO 投资的真实资产(国债、贷款等)收益,不是印钱或代币奖励。

**Q2: DAI 会跌破 $1 吗?**
> 短期可能偏离,但 MakerDAO 有 PSM 机制确保长期锚定。8 年历史证明很稳定。

**Q3: DSR 有锁定期吗?**
> 没有!随时存入,随时提取,完全灵活。

**Q4: 收益要交税吗?**
> 取决于你所在国家。美国需要报税,中国政策不明确。建议咨询税务顾问。

**Q5: MakerDAO 会跑路吗?**
> 去中心化协议,无人控制,代码公开。8 年历史,DeFi 最稳定的协议之一。

**Q6: DSR 和银行存款哪个好?**
> DSR 收益高 10 倍,但无 FDIC 保险。建议分散投资,两者都配置。

---

## ✅ 操作检查清单

**开始前**:
- [ ] 了解 MakerDAO 和 DAI 基本知识
- [ ] 准备 MetaMask 钱包
- [ ] 准备至少 $1,000 资金

**操作中**:
- [ ] 购买或兑换 DAI
- [ ] 访问 DSR 入口(Spark/Summer)
- [ ] 存入 DAI,确认交易

**操作后**:
- [ ] 定期检查 DSR 利率变化
- [ ] 监控 DAI 锚定情况
- [ ] 考虑长期持有复利增长

---

## 🎓 总结

MakerDAO RWA 通过 DSR 为 DeFi 带来真实世界的稳定收益:

**核心优势**:
1. **稳定收益**: 5% APY,来自真实资产
2. **DeFi 蓝筹**: 8 年历史,50 亿 TVL
3. **完全灵活**: 无锁定,随时进出
4. **透明度高**: 链上可验证,定期审计

**适合人群**:
- 保守型投资者
- 追求稳定现金流
- 相信 DeFi 长期价值
- 不想冒太大风险

**不适合**:
- 追求超高收益(20%+)
- 完全不懂 DeFi
- 只想短期投机

**推荐配置**: 将 20-40% 稳定币资产配置在 MakerDAO DSR,作为 DeFi 投资组合的"现金"部分。

MakerDAO RWA 是 DeFi 与传统金融融合的典范,也是稳定收益的最佳选择之一!💎
`,

  steps: [
    { step_number: 1, title: '获取 DAI', description: '从交易所购买或 DEX 兑换 DAI。', estimated_time: '15 分钟' },
    { step_number: 2, title: '访问 DSR 入口', description: '访问 Spark.fi 或 Summer.fi。', estimated_time: '5 分钟' },
    { step_number: 3, title: '存入 DAI', description: '将 DAI 存入 DSR,开始赚取利息。', estimated_time: '10 分钟' },
    { step_number: 4, title: '监控收益', description: '定期查看 DSR 利率和累积收益。', estimated_time: '每月 10 分钟' },
    { step_number: 5, title: '长期持有', description: '享受复利增长,随时可提取。', estimated_time: '持续' },
  ],
};

// ===== 10.2 Ondo Finance OUSG 国债代币 =====
const STRATEGY_10_2 = {
  title: 'Ondo Finance OUSG 国债代币 - 代币化美国国债',
  slug: 'ondo-finance-ousg-treasury',
  summary: '购买 Ondo Finance 的 OUSG 代币,100% 由美国短期国债支持,享受链上国债收益(约5% APY),合规透明,传统金融机构级安全,最低 $5 起投。',

  category: 'rwa',
  category_l1: 'yield',
  category_l2: 'RWA/链上国债',

  difficulty_level: 2,
  risk_level: 2,

  apy_min: 4.5,
  apy_max: 5.5,
  threshold_capital: '5 美元起',
  threshold_capital_min: 5,
  time_commitment: '初始设置 1 小时(KYC),后续自动',
  time_commitment_minutes: 60,
  threshold_tech_level: 'beginner',

  content: `> **适合人群**: 追求稳定收益,接受 KYC 认证的投资者
> **阅读时间**: 约 12 分钟
> **关键词**: Ondo / OUSG / 美国国债 / 代币化 / 合规 RWA / 稳定收益

---

## 🎯 什么是 Ondo Finance OUSG?

### OUSG 的定义

**OUSG = Ondo U.S. Government Securities**
- 代币化的美国短期国债
- 1 OUSG = $1 价值的国债
- 100% 由真实国债支持

### Ondo Finance 是谁?

**公司背景**:
- 成立于 2021 年
- 总部美国
- 获 Pantera、Founders Fund 等顶级 VC 投资
- 专注于机构级 RWA 产品

**使命**: 将传统金融资产代币化,让散户也能低门槛投资

---

## 📋 OUSG 完整投资指南

### 准备工作

**需要准备**:
1. **KYC 认证**: 护照或身份证
2. **钱包**: MetaMask
3. **资金**: 最低 $5(实际建议 $500+)

**KYC 要求**:
- 非美国居民
- 年满 18 岁
- 提供身份证明
- 提供地址证明(银行账单等)

### 第一步: KYC 认证

1. **访问**: https://ondo.finance
2. **点击 "Get Started"**
3. **选择产品**: OUSG
4. **填写个人信息**:
   - 姓名
   - 国籍
   - 地址
5. **上传文件**:
   - 护照照片
   - 地址证明
6. **等待审核**: 通常 1-3 个工作日

### 第二步: 连接钱包并购买

**KYC 通过后**:

1. **连接钱包**: MetaMask
2. **选择购买金额**: 例如 $5,000
3. **选择支付方式**:
   - **USDC**: 链上支付(推荐)
   - **银行转账**: 传统方式
4. **确认购买**:
   - 如用 USDC,发送到指定地址
   - 如用银行,按指示转账
5. **接收 OUSG**:
   - 通常 1-2 个工作日
   - OUSG 代币到钱包

### 第三步: 持有并赚取收益

**OUSG 如何产生收益?**

**方式 1: 代币增值**(Rebase)
- OUSG 数量每天自动增加
- 类似 stETH 的 rebase 机制
- 例如: 持有 1000 OUSG
  - 第 1 天: 1000 OUSG
  - 第 30 天: 1004.1 OUSG
  - 年化 5%

**方式 2: 每月分红**(可选)
- 部分产品每月发放利息
- 以 USDC 形式

**收益来源**: 美国短期国债利息

### 第四步: 赎回

**随时可以赎回**:

1. **发起赎回请求**: 在 Ondo 网站
2. **等待处理**: T+1 或 T+2 个工作日
3. **接收 USDC**: 自动到钱包

**赎回费用**: 通常无费用或极低(<0.1%)

---

## 💰 收益分析

### OUSG 收益计算

**投入**: $10,000 USDC

**年收益**:
- APY: 5.2%(跟随美联储利率)
- 年利息: $520
- 复利后: $533(每日 rebase)

**月收益**: 约 $43

### 费用结构

| 费用项 | 金额 |
|--------|------|
| 购买费 | 0% |
| 管理费 | 0.15% 年费 |
| 赎回费 | 0% |
| Gas 费 | $5-$20(仅购买时) |

**净 APY**: 5.2% - 0.15% = **5.05%**

### 与其他产品对比

| 产品 | APY | 门槛 | KYC | 流动性 |
|------|-----|------|-----|--------|
| **OUSG** | **5.2%** | **$5** | **需要** | **T+2** |
| 银行定期存款 | 0.5% | $1,000 | 需要 | 到期 |
| 传统国债 | 5% | $1,000 | 需要 | 次级市场 |
| MakerDAO DSR | 5% | $1 | 不需要 | 即时 |

**OUSG 优势**: 门槛最低,收益高,合规透明

---

## 🔥 高级策略

### 策略 1: OUSG 作为 DeFi 抵押品

**部分 DeFi 协议支持 OUSG 作为抵押**:

1. 持有 OUSG 赚 5.2%
2. 抵押 OUSG 借稳定币(利率 3%)
3. 用借来的稳定币投资其他项目
4. **净成本**: 仅 -2.2%

**杠杆收益放大**(谨慎操作)

### 策略 2: OUSG + 稳定币组合

**保守投资组合**:
- 50% OUSG(5.2% APY)
- 30% MakerDAO DSR(5% APY)
- 20% Aave USDC(3% APY)

**综合 APY**: 4.86%
**风险**: 极低(全部稳定币策略)

### 策略 3: 对冲策略

**在不确定市场中**:
1. 卖出波动性资产(BTC/ETH)
2. 买入 OUSG
3. 等待市场稳定
4. 再买回加密资产

**好处**: 避免熊市损失,同时赚取收益

---

## 🔍 OUSG 资产详情

### 底层资产构成

**OUSG 持有的国债**:
- 美国 3-6 个月短期国债
- AAA 评级
- 流动性极好
- 美国政府信用背书

**托管方**:
- **Bank of New York Mellon**(纽约梅隆银行)
- 全球最大托管银行
- 资产隔离,破产保护

### 透明度与审计

**月度报告**:
- Ondo 每月发布资产报告
- 列出持有的具体国债
- 可在官网下载

**第三方审计**:
- 年度审计报告
- 审计机构: 国际知名会计师事务所
- 确保资产 1:1 支持

**链上验证**:
- OUSG 总供应量公开
- 与资产报告对比
- 完全透明

---

## ⚠️ 风险与合规

### 主要风险

**1. 监管风险**:
- RWA 涉及证券法
- 政策可能变化
- **缓解**: Ondo 积极合规,与监管机构沟通

**2. 流动性风险**:
- 赎回需要 T+2
- 不是即时提现
- **缓解**: 提前规划资金需求

**3. 利率变化**:
- APY 跟随美联储利率
- 加息周期高,降息周期低
- **缓解**: 长期看,国债是最稳定的

**4. KYC 隐私**:
- 需要提供个人信息
- **缓解**: Ondo 合规处理,数据加密

### 合规性

**Ondo 的合规措施**:
- 在美国 SEC 注册
- KYC/AML 流程完善
- 符合证券法要求
- 定期监管审查

**投资者保护**:
- 资产托管在传统银行
- 破产隔离
- 定期审计

---

## 📱 实用工具

### OUSG Dashboard

**官方仪表盘**:
- https://ondo.finance/dashboard
- 查看持仓
- 查看累积收益
- 发起赎回

### 收益计算器

**在线工具**:
- Ondo 官网提供
- 输入投资金额和时间
- 计算预期收益

### 移动端

**Ondo App**(计划中):
- iOS/Android
- 随时查看收益
- 快速赎回

---

## ❓ 常见问题

**Q1: OUSG 安全吗?**
> 非常安全。100% 由美国国债支持,托管在纽约梅隆银行,第三方审计。

**Q2: 为什么要 KYC?**
> 因为 OUSG 是证券型代币,需要符合美国证券法。KYC 是合规要求。

**Q3: 中国人可以买吗?**
> 可以!Ondo 接受非美国居民。但需要 KYC 认证。

**Q4: 收益会变化吗?**
> 会!跟随美联储利率。加息时提高,降息时降低。

**Q5: OUSG 和传统国债有什么区别?**
> OUSG 门槛低($5 vs $1,000),流动性好,可以在链上使用。本质都是美国国债。

**Q6: 赎回需要多久?**
> T+2 个工作日。比传统国债快,但不如纯 DeFi 即时。

**Q7: 有没有锁定期?**
> 没有!随时可以发起赎回,T+2 到账。

---

## ✅ 操作检查清单

**购买前**:
- [ ] 准备 KYC 文件(护照、地址证明)
- [ ] 准备 USDC 或银行账户
- [ ] 理解 T+2 赎回机制

**购买中**:
- [ ] 完成 KYC 认证
- [ ] 连接钱包并购买
- [ ] 确认收到 OUSG

**持有中**:
- [ ] 每月查看收益
- [ ] 关注 APY 变化
- [ ] 阅读月度资产报告

---

## 🎓 总结

Ondo Finance OUSG 是链上投资美国国债的最佳方式:

**核心优势**:
1. **真实资产**: 100% 国债支持,不是空气
2. **机构级安全**: 顶级银行托管,定期审计
3. **超低门槛**: $5 起投,人人可参与
4. **稳定收益**: 5%+ APY,跟随美联储利率

**适合人群**:
- 保守型投资者
- 接受 KYC 的用户
- 追求稳定现金流
- 相信美国国债的安全性

**不适合**:
- 不愿 KYC 的用户
- 需要即时流动性(T+2 赎回)
- 追求超高收益(10%+)

**推荐配置**: 将 30-50% 稳定币资产配置在 OUSG,作为"链上国债"储备。

OUSG 是 DeFi 中最接近传统金融的产品,也是最安全的收益来源之一!🏛️
`,

  steps: [
    { step_number: 1, title: 'KYC 认证', description: '访问 ondo.finance,提交身份证明文件。', estimated_time: '30 分钟' },
    { step_number: 2, title: '等待审核', description: 'KYC 审核通常 1-3 个工作日。', estimated_time: '1-3 天' },
    { step_number: 3, title: '购买 OUSG', description: '用 USDC 或银行转账购买 OUSG。', estimated_time: '20 分钟' },
    { step_number: 4, title: '持有赚息', description: 'OUSG 自动 rebase,每天增值。', estimated_time: '持续' },
    { step_number: 5, title: '赎回提现', description: '需要时发起赎回,T+2 到账。', estimated_time: '2 个工作日' },
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
    const strategies = [STRATEGY_10_1, STRATEGY_10_2];

    console.log('\n开始创建 10.1 和 10.2 策略...\n');

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
    console.log('访问: http://localhost:3000/strategies?category=rwa\n');
  } catch (error) {
    console.error('\n❌ 创建失败:', error.response?.data || error.message);
  }
}

addStrategies();