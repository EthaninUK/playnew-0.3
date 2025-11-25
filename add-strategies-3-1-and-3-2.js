const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

// ===== 3.1 Berachain 测试网交互 =====
const STRATEGY_3_1 = {
  title: 'Berachain 测试网交互 - Proof of Liquidity 早期参与',
  slug: 'berachain-testnet-interaction',
  summary: '在 Berachain Artio 测试网上体验 DEX、借贷、流动性挖矿等功能，领取测试币并完成交互，争取主网空投和 BGT 代币奖励。',

  category: 'testnet',
  category_l1: 'airdrop',
  category_l2: '测试网&早鸟',

  difficulty_level: 2,
  risk_level: 1,

  apy_min: 0,
  apy_max: 0,
  threshold_capital: '0 美元（测试网）',
  threshold_capital_min: 0,
  time_commitment: '每周 2-3 小时',
  time_commitment_minutes: 150,
  threshold_tech_level: 'intermediate',

  content: `> **适合人群**：愿意参与测试网、了解 DeFi 基础操作的玩家
> **阅读时间**：约 12 分钟
> **关键词**：Berachain / Proof of Liquidity / 测试网 / BGT / 流动性挖矿

---

## 🎯 什么是 Berachain？

### 项目背景

**Berachain** 是一条创新的 EVM 兼容 Layer 1 公链，最大特点是：
- **Proof of Liquidity（PoL）**：流动性证明机制，替代传统 PoS
- **三代币模型**：BERA（Gas）、BGT（治理）、HONEY（稳定币）
- **超强融资背景**：估值 15 亿美元，Polychain Capital 等顶级 VC 支持

### 为什么要参与测试网？

1. **空投预期强**：顶级 VC 支持，主网上线必有空投
2. **早期优势**：测试网参与者通常获得额外奖励
3. **零成本**：只需测试币，不需要真实资金
4. **学习 PoL 机制**：提前了解创新的流动性挖矿模式

**类似案例**：
- Arbitrum 测试网早期用户：空投价值 3000-10000 美元
- Optimism 测试网参与者：平均获得 1500 美元空投
- Aptos 测试网用户：获得 150-300 APT（价值 1500-3000 美元）

---

## 📋 准备工作（30 分钟）

### 第一步：安装钱包

**推荐钱包**：
1. **MetaMask**（最通用）
2. **Rabby Wallet**（更好的多链体验）

**操作步骤**：
1. 安装浏览器插件
2. 创建新钱包（或导入现有钱包）
3. **重要**：备份助记词！（即使是测试网也要养成好习惯）

### 第二步：添加 Berachain Artio 测试网

**网络信息**：
- **网络名称**：Berachain Artio
- **RPC URL**：https://artio.rpc.berachain.com/
- **Chain ID**：80085
- **货币符号**：BERA
- **区块浏览器**：https://artio.beratrail.io/

**快速添加**：
访问 https://chainlist.org/，搜索"Berachain Artio"，一键添加到钱包。

### 第三步：领取测试币

**方法 1：官方水龙头**
1. 访问 https://artio.faucet.berachain.com/
2. 连接钱包
3. 完成验证（可能需要 Twitter 关注或 Discord 验证）
4. 每 24 小时可领取 1 次

**方法 2：社区水龙头**
- 加入 Berachain Discord：https://discord.gg/berachain
- 在 #faucet 频道输入：\`!faucet <你的钱包地址>\`

**方法 3：第三方水龙头**
- https://www.alchemy.com/faucets/berachain-artio（需要 Alchemy 账号）

### 第四步：了解三代币机制

**BERA**（Gas 代币）：
- 用于支付交易手续费
- 可以通过水龙头获得

**BGT**（治理代币）：
- 通过提供流动性获得
- 不可转让，只能通过"燃烧"换成 BERA
- 可用于治理投票和提升挖矿收益

**HONEY**（稳定币）：
- Berachain 原生稳定币，锚定 1 美元
- 可以通过抵押资产铸造

---

## 🚀 4 周测试网交互计划

### 第 1 周：基础交互（熟悉环境）

**任务 1：使用 BEX（Berachain DEX）**

BEX 是 Berachain 的原生 DEX：

1. 访问 https://artio.bex.berachain.com/
2. 连接钱包
3. **Swap 操作**：
   - 将 BERA 换成 HONEY
   - 再将 HONEY 换回 BERA
   - 重复 5-10 次交易（模拟真实用户行为）

**为什么要多次交易**？
- 增加链上活跃度
- 项目方可能根据交易次数分配空投权重

**任务 2：添加流动性**

1. 在 BEX 选择"Pool"（流动性池）
2. 选择 BERA-HONEY 池
3. 添加流动性（建议投入 50% 的测试 BERA）
4. 获得 LP Token

**注意**：
- 添加流动性后**不要立即撤出**，至少保持 1-2 周
- 这是获得 BGT 代币的主要方式

**任务 3：质押 LP Token 赚取 BGT**

1. 在 BEX 的"Gauges"页面
2. 质押你的 LP Token
3. 开始赚取 BGT 奖励

**BGT 的价值**：
- 未来可能按比例分配主网代币
- 测试网积累的 BGT 可能影响空投份额

### 第 2 周：DeFi 协议体验

**任务 4：使用 Bend（借贷协议）**

Bend 是 Berachain 上的借贷协议：

1. 访问 https://artio.bend.berachain.com/
2. **存款操作**：
   - 存入 BERA 或 HONEY
   - 获得存款利息
3. **借款操作**：
   - 以存入的资产作为抵押
   - 借出其他资产（如 HONEY）
4. **还款操作**：
   - 偿还部分或全部借款

**建议交互次数**：
- 存款：3-5 次
- 借款：2-3 次
- 还款：2-3 次

**任务 5：铸造 HONEY 稳定币**

1. 访问 Berachain 的 HONEY 铸造页面
2. 存入 BERA 作为抵押
3. 铸造 HONEY
4. 体验"还款+赎回抵押品"流程

**注意**：
- 保持健康的抵押率（建议 >200%）
- 避免被清算（即使是测试网也要学习风险管理）

**任务 6：参与 Berps（永续合约）**

Berps 是 Berachain 的永续合约平台：

1. 访问 https://artio.berps.berachain.com/
2. 开一个小额多单或空单
3. 体验止盈、止损功能
4. 关闭仓位

**目的**：
- 体验平台功能
- 增加产品交互多样性

### 第 3 周：NFT 和跨链

**任务 7：铸造和交易 Berachain NFT**

1. 访问 Berachain NFT 市场（如果有）
2. 铸造测试 NFT
3. 尝试挂单出售或购买他人 NFT

**备选任务**（如果没有 NFT 市场）：
- 参与社区举办的 NFT 活动
- 铸造 Galxe 上的 Berachain OAT（链上成就 NFT）

**任务 8：使用跨链桥（如果可用）**

如果 Berachain 测试网支持跨链桥：
1. 从其他测试网（如 Goerli）跨链资产到 Berachain
2. 再跨回去
3. 体验跨链流动性

### 第 4 周：高级任务和社区参与

**任务 9：参与治理投票**

1. 使用你积累的 BGT
2. 参与 Gauge 投票（决定哪些流动性池获得更多奖励）
3. 参与社区提案投票（如果有）

**任务 10：完成 Galxe / Zealy 任务**

Berachain 通常会在任务平台发布活动：
1. 访问 Galxe.com，搜索"Berachain"
2. 完成所有任务（社交+链上）
3. 铸造 OAT NFT 作为凭证

**任务 11：保持长期活跃**

- 每周至少交互 2-3 次
- 不要一口气做完所有任务就走
- 保持流动性池的资金，持续赚取 BGT

---

## 💰 成本与收益

### 成本

| 项目 | 金额 |
|------|------|
| 资金成本 | 0 美元（测试网）|
| 时间成本 | 8-12 小时（4 周） |

### 潜在收益

**空投预测**（基于类似项目）：
- 保守估计：500-2000 美元
- 乐观估计：3000-10000 美元（如果是 OG 参与者）

**影响因素**：
- 参与时间早晚（越早越好）
- 交互次数和多样性
- 积累的 BGT 数量
- 流动性提供时长

---

## ⚠️ 风险与注意事项

### 主要风险

1. **不确定性**
   - 测试网不保证一定有空投
   - 但基于项目体量和融资背景，概率极高

2. **时间成本**
   - 需要持续参与 1-3 个月
   - 不要期待"一次性完成"

3. **技术风险**
   - 测试网可能重置（数据清零）
   - 偶尔会有 Bug 或停机

### 安全提示

- ✅ 使用独立钱包（不要用存有真实资产的钱包）
- ✅ 永远不要在测试网输入真实资金
- ✅ 注意官方公告，避免参与假冒项目
- ✅ 加入官方 Discord 获取最新消息

---

## 📊 进度追踪清单

### 第 1 周
- [ ] 添加 Berachain 测试网
- [ ] 领取测试币
- [ ] BEX 完成 5-10 次 Swap
- [ ] 添加流动性并质押 LP

### 第 2 周
- [ ] Bend 完成存款、借款、还款
- [ ] 铸造 HONEY 稳定币
- [ ] 体验 Berps 永续合约

### 第 3 周
- [ ] 参与 NFT 相关活动
- [ ] 尝试跨链操作
- [ ] 完成 Galxe 任务

### 第 4 周
- [ ] 参与治理投票
- [ ] 保持每周活跃
- [ ] 检查 BGT 余额

---

## ❓ 常见问题

**Q1：测试币不够用怎么办？**
> 可以多尝试几个水龙头，或在 Discord 请求社区帮助。有些社区成员会分享测试币。

**Q2：测试网会重置吗？**
> 可能会，但通常项目方会快照保存用户数据。即使重置，早期参与记录也会保留。

**Q3：需要完成所有任务吗？**
> 不需要，但多样性很重要。建议至少体验：DEX、借贷、流动性提供这三大类。

**Q4：BGT 代币能换成真钱吗？**
> 测试网的 BGT 不能直接换钱，但会影响主网空投份额。

**Q5：每天需要花多少时间？**
> 前期设置需要 1-2 小时，之后每周 30-60 分钟保持活跃即可。

---

## 🎓 总结

**Berachain 测试网的价值**：
1. **零成本参与**：只需时间，无需资金
2. **空投预期高**：顶级 VC 支持，15 亿美元估值
3. **学习 PoL 机制**：了解创新的流动性证明
4. **早期优势**：越早参与，权重越高

**成功关键**：
- **早参与**：测试网刚开放时就加入
- **持续活跃**：不是一次性完成，而是长期保持
- **多样化交互**：DEX、借贷、NFT、治理都要尝试
- **积累 BGT**：通过提供流动性持续赚取

Berachain 是 2024-2025 年最值得关注的测试网项目之一，祝你抢占先机！🐻
`,

  steps: [
    { step_number: 1, title: '准备工作', description: '安装钱包、添加测试网、领取测试币。', estimated_time: '30 分钟' },
    { step_number: 2, title: 'DEX 交互（第 1 周）', description: 'BEX 上进行 Swap、添加流动性、质押 LP Token。', estimated_time: '2 小时' },
    { step_number: 3, title: 'DeFi 协议（第 2 周）', description: '体验借贷、铸造稳定币、永续合约。', estimated_time: '2 小时' },
    { step_number: 4, title: 'NFT 和跨链（第 3 周）', description: '参与 NFT 活动、完成任务平台、尝试跨链。', estimated_time: '1.5 小时' },
    { step_number: 5, title: '治理和长期活跃（第 4 周）', description: '参与投票、保持活跃、持续赚取 BGT。', estimated_time: '每周 1 小时' },
  ],
};

// ===== 3.2 Monad 测试网早期参与 =====
const STRATEGY_3_2 = {
  title: 'Monad 测试网早期参与 - 超高 TPS 公链 OG 身份',
  slug: 'monad-testnet-early-participation',
  summary: '申请 Monad 测试网访问权限，体验超高 TPS 的 EVM 链，完成早期测试任务，获取 OG 身份和主网空投资格。',

  category: 'testnet',
  category_l1: 'airdrop',
  category_l2: '测试网&早鸟',

  difficulty_level: 2,
  risk_level: 1,

  apy_min: 0,
  apy_max: 0,
  threshold_capital: '0 美元（测试网）',
  threshold_capital_min: 0,
  time_commitment: '每周 1-2 小时',
  time_commitment_minutes: 90,
  threshold_tech_level: 'intermediate',

  content: `> **适合人群**：技术爱好者、愿意深度参与测试的玩家
> **阅读时间**：约 10 分钟
> **关键词**：Monad / 10000 TPS / EVM 兼容 / 测试网 / OG 身份

---

## 🎯 什么是 Monad？

### 项目背景

**Monad** 是一条革命性的 EVM 兼容 Layer 1 区块链，核心亮点：

- **10,000 TPS**：每秒处理 1 万笔交易（以太坊仅 15 TPS）
- **1 秒出块**：几乎即时确认
- **100% EVM 兼容**：现有以太坊 DApp 可直接迁移
- **并行执行**：创新的交易并行处理技术

**融资背景**：
- 2023 年种子轮：1900 万美元（Dragonfly Capital 领投）
- 2024 年 A 轮：2.25 亿美元，估值 30 亿美元（Paradigm 领投）
- 总融资：2.44 亿美元，顶级 VC 阵容

### 为什么要参与 Monad 测试网？

1. **超高空投预期**：30 亿美元估值，2.44 亿美元融资
2. **OG 身份稀缺**：测试网采用白名单制，早期参与者少
3. **技术创新**：体验下一代高性能区块链
4. **社区氛围好**：Monad 社区文化活跃，"Monad Mania"

**类似案例**：
- Aptos（融资 4 亿美元）：测试网用户获得 150-300 APT
- Sui（融资 3.36 亿美元）：早期测试者获得丰厚空投
- Celestia（融资 1.55 亿美元）：测试网参与者平均获得价值 5000 美元空投

---

## 📋 准备工作（1 小时）

### 第一步：了解 Monad 社区文化

Monad 有独特的社区文化：
- **紫色主题**：Monad 的代表色是紫色🟣
- **Monad Mania**：社区狂热的参与度
- **Nads（昵称）**：Monad 社区成员互称"Nads"

**为什么重要**？
- Monad 重视社区文化，真实参与者更容易获得白名单

### 第二步：申请测试网白名单

**注意**：Monad 测试网不是公开的，需要申请访问权限。

**申请渠道**：

1. **官方 Discord**
   - 加入 Monad Discord：https://discord.gg/monad
   - 完成身份验证
   - 关注 #announcements 频道的白名单申请通知

2. **社交媒体活跃**
   - 关注 Monad Twitter：@monad_xyz
   - 转发、评论官方推文
   - 使用标签 #MonadMania #Monad

3. **完成官方任务**
   - Monad 经常在 Galxe、Zealy 发布任务
   - 完成任务可能获得白名单优先权

4. **社区贡献**
   - 在 Discord 保持活跃
   - 参与技术讨论
   - 帮助新人解答问题

**白名单发放形式**：
- 批次发放（通常是"Waves"）
- 发放到注册的邮箱或 Discord DM
- 包含测试网访问链接和私钥

### 第三步：设置测试环境

**获得白名单后**：

1. **添加 Monad 测试网到钱包**
   - 网络名称：Monad Testnet
   - RPC URL：（白名单邮件中提供）
   - Chain ID：（通常是测试网 ID）
   - 货币符号：MON（或 MONAD）

2. **领取测试币**
   - 访问官方水龙头（白名单邮件中有链接）
   - 或在 Discord #faucet 频道请求

3. **准备多个钱包（可选）**
   - 如果有多个白名单资格，可以用多个钱包
   - 但不要滥用，可能被取消资格

---

## 🚀 测试网交互策略

### 第 1 阶段：基础交互（前 2 周）

**任务 1：高频交易测试**

利用 Monad 的高 TPS 特性：

1. **批量转账**
   - 给自己的另一个地址转账
   - 尝试快速发送 50-100 笔交易
   - 测试 Monad 的 1 秒出块能力

2. **压力测试**
   - 同时发送多笔交易
   - 观察交易确认速度
   - 反馈任何遇到的 Bug 或问题

**为什么做这些**？
- 这是测试网的真正目的：测试性能
- 项目方会重视真正测试功能的用户

**任务 2：体验 DApp**

Monad 测试网会有一些示例 DApp：

1. **DEX 交易**
   - 如果有测试 DEX，进行 Swap 操作
   - 尝试高频交易（利用低 Gas 和高 TPS）

2. **NFT 铸造**
   - 铸造测试 NFT
   - 尝试快速铸造多个（测试并行处理）

3. **智能合约交互**
   - 部署简单的智能合约（如果你会编程）
   - 或与示例合约交互

**任务 3：提交反馈**

这是测试网的核心价值：

1. **记录遇到的问题**
   - 交易失败
   - 网络延迟
   - 任何异常行为

2. **在 Discord 反馈**
   - 在 #testnet-feedback 频道提交
   - 描述清楚：问题、重现步骤、截图

3. **参与技术讨论**
   - 在 #testnet-discussion 讨论体验
   - 提出改进建议

**为什么重要**？
- Monad 团队会记录活跃的测试者
- 有价值的反馈可能获得"Contributor"角色
- 这直接影响未来空投份额

### 第 2 阶段：深度参与（第 3-4 周）

**任务 4：性能基准测试**

如果你有技术能力：

1. **编写测试脚本**
   - 自动化发送交易
   - 测量 TPS、延迟、成功率

2. **对比测试**
   - 对比 Monad 和其他链的性能
   - 在社区分享你的发现

**任务 5：开发者贡献（可选）**

如果你是开发者：

1. **迁移 DApp**
   - 将以太坊 DApp 迁移到 Monad
   - 测试兼容性

2. **开发工具**
   - 创建测试工具
   - 编写文档或教程

3. **申请开发者资助**
   - Monad 可能有开发者激励计划

**任务 6：社区领袖**

成为社区的活跃分子：

1. **帮助新人**
   - 在 Discord 回答问题
   - 创建教程或指南

2. **组织活动**
   - 发起社区测试活动
   - 创建 Monad 相关内容（推文、文章、视频）

3. **争取"Ambassador"角色**
   - Monad 可能有大使计划
   - 大使通常获得更多空投

### 第 3 阶段：持续活跃（长期）

**任务 7：保持定期交互**

不要一口气做完就走：

1. **每周至少交互 2-3 次**
2. **关注测试网更新**
   - 新功能发布时第一时间测试
3. **参与新一轮测试**
   - Monad 可能有多轮测试（Devnet → Testnet → Mainnet）

**任务 8：积累链上数据**

项目方通常会看这些指标：
- 交易总数
- 参与天数
- 合约交互次数
- 持有测试 NFT 数量
- 反馈提交次数

**策略**：
- 分散在多周进行，不要集中一天
- 保持多样化（不要只做一种操作）

---

## 💰 成本与收益

### 成本

| 项目 | 金额 |
|------|------|
| 资金成本 | 0 美元（测试网） |
| 时间成本 | 6-12 小时（分散在 1-3 个月） |

### 潜在收益

**空投预测**（基于融资规模和类似项目）：

- **保守估计**：2000-5000 美元
- **中等估计**：5000-15000 美元（活跃测试者）
- **乐观估计**：15000-50000 美元（OG 贡献者、开发者）

**对比**：
- Aptos（融资 4 亿）：平均空投 2000 美元，OG 用户最高 5 万美元
- Monad（融资 2.44 亿）：预期类似或更高

---

## ⚠️ 风险与注意事项

### 主要风险

1. **白名单竞争激烈**
   - 不是所有人都能获得测试网访问权
   - 需要积极参与社区

2. **时间投入**
   - 需要长期跟踪项目进度
   - 测试网可能持续数月

3. **不确定性**
   - 测试网参与不保证空投
   - 但基于 Monad 的融资和团队，概率很高

### 成功关键

- ✅ **早申请**：尽早获得白名单
- ✅ **真实测试**：不要只刷交易，要真正测试功能
- ✅ **提交反馈**：让团队知道你在认真参与
- ✅ **社区活跃**：在 Discord 建立存在感

---

## 📊 进度追踪清单

### 准备阶段
- [ ] 加入 Monad Discord 和 Twitter
- [ ] 完成 Galxe/Zealy 任务
- [ ] 申请测试网白名单

### 获得白名单后
- [ ] 设置钱包和测试网
- [ ] 领取测试币
- [ ] 完成首次交易

### 第 1-2 周
- [ ] 进行 50+ 笔测试交易
- [ ] 体验所有可用 DApp
- [ ] 提交至少 1 次反馈

### 第 3-4 周
- [ ] 深度测试特定功能
- [ ] 在社区分享体验
- [ ] 帮助新人（如果有新批次）

### 长期
- [ ] 每周保持 2-3 次交互
- [ ] 关注新功能发布
- [ ] 持续社区参与

---

## ❓ 常见问题

**Q1：没有白名单怎么办？**
> 持续在社区活跃，关注下一轮白名单发放。Monad 通常会分多批次发放。

**Q2：需要编程能力吗？**
> 不需要，但如果有开发能力会有额外优势。普通用户专注于交互和反馈即可。

**Q3：如何提高获得白名单的概率？**
> 1) 早期关注并活跃在社区 2) 完成所有官方任务 3) 真诚参与讨论（不要灌水）

**Q4：测试网大概什么时候上线？**
> 根据公开信息，Monad Devnet 已在运行，公开测试网预计 2024-2025 年。持续关注官方公告。

**Q5：Monad 和其他高性能链有什么区别？**
> Monad 最大优势是 100% EVM 兼容 + 超高 TPS，既有性能又有生态兼容性。

---

## 🎓 总结

**Monad 测试网的价值**：
1. **顶级融资背景**：30 亿美元估值，Paradigm 等领投
2. **OG 身份稀缺**：白名单制，早期参与者少
3. **技术创新**：体验 10000 TPS 的未来区块链
4. **高空投预期**：基于融资规模，预期单人 5000-50000 美元

**成功路径**：
1. **抢先获得白名单**（积极社区参与）
2. **真实深度测试**（不是刷任务，是真测试）
3. **提供有价值反馈**（让团队记住你）
4. **长期保持活跃**（数月持续参与）

Monad 是 2024-2025 年最值得关注的高性能公链之一，测试网是普通人参与早期的最佳机会！🟣
`,

  steps: [
    { step_number: 1, title: '了解 Monad 和社区', description: '学习项目背景、加入 Discord 和 Twitter。', estimated_time: '30 分钟' },
    { step_number: 2, title: '申请白名单', description: '完成任务、社区活跃、申请测试网访问权限。', estimated_time: '持续 1-4 周' },
    { step_number: 3, title: '基础交互（获得白名单后）', description: '高频交易测试、体验 DApp、提交反馈。', estimated_time: '2-3 小时' },
    { step_number: 4, title: '深度参与', description: '性能测试、开发贡献（可选）、成为社区活跃分子。', estimated_time: '3-5 小时' },
    { step_number: 5, title: '长期活跃', description: '每周定期交互、关注更新、积累链上数据。', estimated_time: '每周 30 分钟' },
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
    const strategies = [STRATEGY_3_1, STRATEGY_3_2];

    console.log('\n开始创建 3.1 和 3.2 策略...\n');

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
    console.log('访问: http://localhost:3000/strategies?category=testnet\n');
  } catch (error) {
    console.error('\n❌ 创建失败:', error.response?.data || error.message);
  }
}

addStrategies();
