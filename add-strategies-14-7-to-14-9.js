const axios = require('axios');

const STRATEGY_14_7 = {
  title: 'Camelot Nitro Pools 高倍激励 - Arbitrum 流动性加速器',
  slug: 'liquidity-mining-14-7-camelot-nitro-pools',
  summary: '参与 Camelot DEX 的 Nitro Pools，享受项目方提供的 2-10 倍额外激励。短期高收益机会，适合灵活资金追逐热点项目。',
  category: 'liquidity-mining',
  category_l1: 'yield',
  category_l2: '流动性引导',
  difficulty_level: 'intermediate',
  risk_level: 4,
  apy_min: 30,
  apy_max: 200,
  threshold_capital: '低',
  threshold_capital_min: 500,
  time_commitment: '中',
  time_commitment_minutes: 20,
  threshold_tech_level: 'intermediate',
  status: 'published',
  content: `# Camelot Nitro Pools 高倍激励 - Arbitrum 流动性加速器

## 📖 小吴的挖矿困境

小吴是个 DeFi 挖矿老手，经常追逐高 APY 的机会。但他发现：
- 常规 LP 挖矿 APY 只有 10-30%，不够刺激
- 高 APY 项目往往是骗局，本金容易归零
- 新项目启动初期 APY 很高，但很难及时发现
- 在多个 DEX 之间切换挖矿，Gas 费和时间成本很高

后来他发现了 Camelot 的 Nitro Pools——项目方为了冷启动流动性，会在 Camelot 上开设限时高倍激励池。这些池子通常持续 2 周到 3 个月，APY 高达 100-300%。

**传统流动性挖矿的问题：**
- APY 低且持续下降
- 挖提卖砸，代币价格螺旋下跌
- 无常损失侵蚀本金
- 找不到高质量的新项目

**Camelot Nitro Pools 的优势：**
- 项目方提供额外 2-10 倍激励
- 限时活动，避免长期稀释
- Arbitrum 生态新项目优先选择 Camelot
- Gas 费极低（< $0.5）
- 灵活进出，适合短期策略

---

## 🎯 策略核心原理

### Camelot 是什么？

Camelot 是 Arbitrum 上的原生 DEX，核心特点：

**1. 为项目方设计的 DEX**
- 提供 Launchpad 功能
- 灵活的流动性激励工具
- NFT 增强机制（持有 Camelot NFT 可提升收益）

**2. Nitro Pools 机制**

Nitro Pools 是 Camelot 的杀手锏功能：
- 项目方在常规 LP 池基础上，叠加一个"Nitro Pool"
- 在 Nitro Pool 中质押 LP Token，获得额外奖励
- 奖励通常是项目方的原生代币
- 限时活动（1 周 - 3 个月）
- 可设置要求（如最低锁定时间、NFT 持有要求等）

**3. 多层收益结构**

参与 Nitro Pool 可以获得 3 层收益：

| 收益层级 | 说明 | 占比 | 稳定性 |
|---------|------|------|--------|
| **Layer 1: 交易手续费** | 作为 LP 赚取的交易手续费 | 10-20% | ⭐⭐⭐⭐⭐ |
| **Layer 2: GRAIL 激励** | Camelot 原生代币奖励 | 20-30% | ⭐⭐⭐⭐ |
| **Layer 3: Nitro 激励** | 项目方额外提供的代币奖励 | 50-70% | ⭐⭐⭐ |

**关键：** Nitro 激励是主要收益来源，但持续时间有限。

### Nitro Pools 生命周期

一个典型的 Nitro Pool 经历：

**第 1 周：启动期**
- APY 最高（200-500%）
- 早鸟获得最多代币
- TVL 快速增长

**第 2-4 周：稳定期**
- APY 降至 100-200%
- TVL 达到峰值
- 收益较为稳定

**第 5-8 周：衰退期**
- APY 降至 50-100%
- 早期参与者开始退出
- 新资金流入减少

**结束后：**
- Nitro Pool 关闭
- 只剩常规 LP 收益（5-30%）
- 大部分 LP 撤出

**策略：** 在启动期和稳定期参与，在衰退期退出。

---

## 📊 收益对比表

| 参与时机 | 预计 APY | 持续时间 | 风险 | 适合人群 |
|---------|---------|---------|------|---------|
| **启动期（第 1 周）** | 200-500% | 1 周 | ⭐⭐⭐⭐⭐ | 激进投资者 |
| **稳定期（第 2-4 周）** | 100-200% | 3 周 | ⭐⭐⭐⭐ | 平衡型投资者 |
| **衰退期（第 5-8 周）** | 50-100% | 4 周 | ⭐⭐⭐ | 保守投资者 |
| **结束后（常规 LP）** | 10-30% | 长期 | ⭐⭐ | 长期持有者 |

---

## 💰 收益计算示例

### 案例 1：激进策略（启动期参与）

小吴在新 Nitro Pool 上线第一天参与：

**项目：** 某 GameFi 项目（代币 GAME）启动 GAME-ETH Nitro Pool

**投入：** 5,000 USDT（2,500 USDT 购买 GAME + 2,500 USDT 购买 ETH）

**初始 APY：** 400%（Nitro 激励 300% + GRAIL 奖励 80% + 手续费 20%）

**第 1 周收益：**
- Nitro 奖励（GAME 代币）：$5,000 × 300% ÷ 52 = $288
- GRAIL 奖励：$5,000 × 80% ÷ 52 = $77
- 交易手续费：$5,000 × 20% ÷ 52 = $19
- 总收益：$288 + $77 + $19 = $384

**周收益率：** $384 ÷ $5,000 = 7.68%

**策略：**
- 第 1 周末：将 50% 的 GAME 代币奖励卖出兑现
- 继续参与第 2-3 周
- 第 4 周初退出

**3 周总收益：**
- 第 1 周：$384
- 第 2 周：$300（APY 降至 300%）
- 第 3 周：$250（APY 降至 250%）
- 总收益：$934
- 总收益率：$934 ÷ $5,000 = 18.7%

**但需考虑无常损失和 GAME 代币价格变化**

---

### 案例 2：保守策略（稳定期参与 + 稳定币池）

小李更保守，选择稳定币池：

**项目：** 某稳定币项目（如 LUSD、FRAX）的 USDC-LUSD Nitro Pool

**投入：** 10,000 USDT（5,000 USDC + 5,000 LUSD）

**APY：** 80%（稳定币池 APY 较低，但无常损失极小）

**月收益：**
- Nitro 奖励（LUSD 代币）：$10,000 × 50% ÷ 12 = $417
- GRAIL 奖励：$10,000 × 20% ÷ 12 = $167
- 交易手续费：$10,000 × 10% ÷ 12 = $83
- 总收益：$667

**月收益率：** $667 ÷ $10,000 = 6.67%

**优势：**
- 无常损失极低（稳定币价格波动小）
- 收益稳定可预测
- 风险远低于波动币池
- 适合风险厌恶型投资者

---

### 案例 3：专业玩家策略（多池轮动）

资深玩家老王采用动态轮动策略：

**资金：** 20,000 USDT

**策略：** 每周筛选 APY 最高的 2-3 个 Nitro Pools，快速进出

**第 1 周：**
- 参与新上线的 ARB-ETH Nitro Pool（APY 300%）
- 投入 10,000 USDT
- 收益：$577（含 GAME 代币奖励）

**第 2 周：**
- 退出 ARB-ETH（APY 降至 150%）
- 进入新上线的 GMX-ETH Nitro Pool（APY 400%）
- 投入 20,000 USDT（追加 10,000）
- 收益：$1,538

**第 3 周：**
- 部分退出 GMX-ETH（保留 10,000）
- 进入稳定币 Nitro Pool（10,000）
- 总收益：$700

**第 4 周：**
- 全部退出高风险池
- 休息或寻找新机会
- 兑现之前赚取的代币

**月总收益：** $577 + $1,538 + $700 = $2,815
**月收益率：** $2,815 ÷ $20,000 = 14%
**年化收益：** 约 168%

**但需要：**
- 密切关注新 Nitro Pool 上线
- 快速决策和执行
- 承担更高的无常损失和代币价格风险
- 频繁交易的 Gas 费

---

## 🔧 操作步骤详解

### 准备阶段（首次设置：15 分钟）

**步骤 1：准备 Arbitrum 钱包**
1. 安装 MetaMask
2. 添加 Arbitrum One 网络
3. 从以太坊主网或 CEX 跨链资金到 Arbitrum
4. 准备少量 ETH 作为 Gas 费（0.005 ETH 足够）

**步骤 2：了解 Camelot 生态**
1. 访问 camelot.exchange
2. 连接钱包
3. 熟悉界面：
   - **Swap**：代币兑换
   - **Liquidity**：提供流动性
   - **Nitro Pools**：高倍激励池
   - **Farms**：常规 LP 挖矿

---

### 寻找高 APY Nitro Pools（每周 10 分钟）

**步骤 3：筛选 Nitro Pools**

1. 访问 camelot.exchange/nitro
2. 查看所有活跃的 Nitro Pools
3. 关键指标：
   - **APR**：年化收益率（越高越好）
   - **Liquidity**：池子 TVL
   - **Ends in**：剩余时间
   - **Requirements**：参与要求（如最低锁定时间）

**筛选标准：**
- ✅ APR > 80%（至少）
- ✅ 剩余时间 > 2 周（避免即将结束的池）
- ✅ TVL > $500K（避免流动性太差的池）
- ✅ 项目方信誉良好（避免 Rug Pull）
- ❌ 要求锁定 > 1 个月（降低灵活性）

**步骤 4：研究项目背景**

在参与前，快速研究项目：
1. 访问项目官网和 Twitter
2. 查看代币经济模型（总供应量、释放计划）
3. 检查审计报告（在 Camelot 页面通常有链接）
4. 查看社区活跃度（Discord/Telegram）
5. 评估 Rug Pull 风险：
   - ⚠️ 匿名团队 + 无审计 = 高风险
   - ✅ 知名团队 + 多次审计 = 相对安全

---

### 参与 Nitro Pool（20 分钟）

**步骤 5：提供流动性**

假设参与 GAME-ETH Nitro Pool：

1. 在 Camelot 点击 "Liquidity"
2. 选择 GAME-ETH 池
3. 点击 "Add Liquidity"
4. 输入金额：
   - GAME：2,500 USDT 等值
   - ETH：2,500 USDT 等值
5. 点击 "Supply"
6. 确认交易（Gas 费 $0.3-0.8）
7. 获得 GAME-ETH LP Token

**步骤 6：质押到 Nitro Pool**

1. 返回 "Nitro Pools" 页面
2. 找到 GAME-ETH Nitro Pool
3. 点击 "Deposit"
4. 输入 LP Token 数量（可以全部或部分）
5. 如果有锁定要求，选择锁定时长
6. 确认交易（Gas 费 $0.3-0.5）
7. 开始赚取 3 层收益

**步骤 7：查看收益**

1. 在 Nitro Pool 页面点击 "My Positions"
2. 查看：
   - **Staked LP**：质押的 LP Token 数量
   - **Pending Rewards**：待领取奖励（GRAIL + 项目代币）
   - **Current APR**：实时 APR
   - **Time Remaining**：Nitro Pool 剩余时间

---

### 收益管理（每周 10 分钟）

**步骤 8：定期 Harvest**

Nitro Pool 的奖励需要手动领取：

1. 点击 "Harvest" 按钮
2. 选择要领取的代币：
   - GRAIL（Camelot 原生代币）
   - 项目方代币（如 GAME）
3. 确认交易（Gas 费 $0.3-0.5）

**Harvest 时机建议：**
- 每周 Harvest 一次（避免频繁交易浪费 Gas）
- 如果奖励 > $200，可以每 3-5 天 Harvest 一次
- 紧急情况下随时可以 Harvest

**步骤 9：处理奖励代币**

收到奖励后，有 3 种选择：

**选项 1：立即卖出（降低风险）**
1. 在 Camelot Swap 页面卖出项目代币
2. 换成 USDC 或 ETH
3. 保留 GRAIL（长期价值）或也卖出

**选项 2：复投（最大化收益）**
1. 将项目代币和 ETH 重新提供流动性
2. 继续质押到 Nitro Pool
3. 复利效应，收益滚雪球

**选项 3：部分卖出 + 部分复投（平衡策略）**
1. 卖出 50% 项目代币兑现收益
2. 50% 复投到 Nitro Pool
3. 平衡风险和收益

---

### 退出策略（5 分钟）

**步骤 10：何时退出？**

退出信号：
- ✅ APR 降至 < 50%
- ✅ Nitro Pool 剩余时间 < 1 周
- ✅ 项目代币价格暴涨（兑现收益）
- ✅ 项目出现负面新闻（避险）
- ✅ 发现更好的机会

**步骤 11：提取流动性**

1. 在 Nitro Pool 页面点击 "Withdraw"
2. 输入要提取的 LP Token 数量
3. 确认交易（Gas 费 $0.3-0.5）
4. LP Token 返回钱包

5. 前往 "Liquidity" 页面
6. 点击 "Remove Liquidity"
7. 选择提取比例（可以部分提取）
8. 确认交易
9. 收回原始代币（GAME + ETH）

10. 将代币兑换为 USDC/USDT（如需要）

---

## ⚠️ 风险提示

### 主要风险

**1. 项目代币价格暴跌风险 ⭐⭐⭐⭐⭐**
- **风险说明：** Nitro Pool 的主要收益来自项目方代币，如果代币价格暴跌，实际收益会大幅缩水
- **历史案例：** 某 GameFi 项目代币从 $5 跌至 $0.5，APY 虽然显示 300%，但实际收益为负
- **应对措施：**
  - 定期 Harvest 并卖出项目代币
  - 不要长期持有不熟悉的代币
  - 只参与有审计和知名团队的项目

**2. Rug Pull 风险 ⭐⭐⭐⭐⭐**
- **风险说明：** 项目方可能卷款跑路
- **识别信号：**
  - ⚠️ 匿名团队
  - ⚠️ 无审计报告
  - ⚠️ 代币合约有后门（mint 权限等）
  - ⚠️ 社区很小或全是机器人
- **应对措施：**
  - 只参与经 Camelot 审核的项目
  - 检查代币合约（用 RugCheck.xyz）
  - 不要投入超过 20% 的资金到单个 Nitro Pool

**3. 无常损失风险 ⭐⭐⭐⭐**
- **风险说明：** 如果项目代币价格剧烈波动，会产生无常损失
- **影响：** 即使赚取了高 APY，无常损失可能抵消收益
- **应对措施：**
  - 优先参与稳定币 Nitro Pools（无常损失极低）
  - 如果参与波动币池，及时止盈
  - 计算无常损失：使用 dailydefi.org/tools/impermanent-loss-calculator

**4. 高 Gas 费风险（频繁操作）⭐⭐**
- **风险说明：** 频繁 Harvest 和轮动池子会产生 Gas 费
- **应对措施：**
  - 虽然 Arbitrum Gas 费低，但频繁操作仍会累积
  - 建议：每周操作不超过 2-3 次
  - 累积奖励 > $100 再 Harvest

**5. 流动性风险 ⭐⭐⭐**
- **风险说明：** 小市值代币可能无法及时卖出
- **应对措施：**
  - 检查池子深度（TVL > $500K）
  - 卖出时分批进行
  - 避免在 Gas 费高峰时卖出

**6. 智能合约风险 ⭐⭐⭐**
- **风险说明：** Camelot 或项目方合约可能有漏洞
- **应对措施：**
  - Camelot 已通过审计，相对安全
  - 但项目方合约可能未审计
  - 分散投资，不要 All in

---

## ❓ 常见问题 FAQ

**Q1：Nitro Pools 和普通 LP 挖矿有什么区别？**
A1：
- 普通 LP：只赚取交易手续费 + 平台代币（GRAIL）
- Nitro Pools：在普通 LP 基础上，叠加项目方的额外激励
- Nitro Pools APY 通常是普通 LP 的 3-10 倍
- 但 Nitro Pools 有时间限制

**Q2：如何找到新上线的 Nitro Pools？**
A2：
1. 关注 Camelot 官方 Twitter：@CamelotDEX
2. 加入 Camelot Discord 服务器
3. 订阅 DeFi Llama 的 Arbitrum 板块
4. 使用 DefiLlama.com 筛选 Camelot 的高 APY 池

**Q3：需要持有 Camelot NFT 吗？**
A3：
- 不是必须的
- 但持有 Camelot NFT 可以提升收益（Boost 1.1-2x）
- NFT 价格较高（通常 > $1,000）
- 只有大资金（> $50,000）才值得购买 NFT

**Q4：可以提前退出锁定的 Nitro Pool 吗？**
A4：
- 如果 Nitro Pool 有锁定要求（如锁 30 天）
- 提前退出会损失部分或全部未领取奖励
- 但本金（LP Token）不会损失
- 建议：只参与无锁定或锁定时间短的池

**Q5：GRAIL 代币值得持有吗？**
A5：
- GRAIL 是 Camelot 的治理代币
- 可以质押获得 xGRAIL，享受分红
- 长期来看，Camelot 是 Arbitrum 的核心 DEX
- 可以持有一部分 GRAIL 作为长期投资

**Q6：如何评估一个 Nitro Pool 是否值得参与？**
A6：评估清单：
- ✅ APR > 80%
- ✅ TVL > $500K
- ✅ 剩余时间 > 2 周
- ✅ 项目有审计报告
- ✅ 团队公开透明
- ✅ 代币合约无后门
- ✅ 社区活跃

**Q7：Nitro Pool 结束后会怎样？**
A7：
- Nitro Pool 关闭，无法再质押
- 已质押的 LP Token 自动转为普通 LP
- 继续赚取交易手续费 + GRAIL 奖励（APY 大幅下降）
- 建议在结束前退出

**Q8：可以同时参与多个 Nitro Pools 吗？**
A8：
- 可以！这是推荐的策略
- 分散到 2-3 个 Nitro Pools
- 降低单一项目的风险
- 但管理复杂度会增加

**Q9：Gas 费大概多少？**
A9：Arbitrum 的 Gas 费极低：
- 提供流动性：$0.3-0.8
- 质押到 Nitro Pool：$0.3-0.5
- Harvest 奖励：$0.3-0.5
- 提取流动性：$0.3-0.8
- 总计一次完整操作：约 $1.5-2.5

**Q10：需要多少资金才值得参与？**
A10：
- 最低：$500（但收益较小）
- 建议：$2,000-5,000（收益可观，Gas 费占比低）
- 理想：$10,000+（可以分散到多个池）

**Q11：如果项目代币暴跌，应该立即退出吗？**
A11：
- 评估情况：
  - 如果是整体市场下跌，可以继续持有
  - 如果是项目方跑路信号，立即退出
- 计算实际收益：手续费 + GRAIL 奖励可能仍为正
- 如果代币跌幅 > 50% 且无止跌信号，建议退出

**Q12：Camelot 安全吗？**
A12：
- Camelot 已通过多家审计机构审计
- 是 Arbitrum 生态的核心 DEX
- TVL 超过 1 亿美元
- 运行超过 1 年无重大安全事故
- 相对安全，但仍需谨慎

---

## 📚 总结

Camelot Nitro Pools 是 Arbitrum 上最具吸引力的短期高收益策略。通过参与项目方提供的限时高倍激励，可以在 2-8 周内获得 50-200% 的年化收益。这是一个"快进快出"的策略，适合灵活资金和愿意承担一定风险的投资者。

**关键要点：**
1. **限时高收益**：APY 通常 100-300%，但只持续 2-8 周
2. **三层收益**：交易手续费 + GRAIL 奖励 + 项目方激励
3. **早鸟优势**：越早参与，收益越高
4. **灵活进出**：无锁定或短期锁定，适合短期策略
5. **风险较高**：项目代币价格波动和 Rug Pull 风险

**收益预期：**
- 启动期（第 1 周）：周收益 5-10%
- 稳定期（第 2-4 周）：周收益 2-5%
- 衰退期（第 5-8 周）：周收益 1-2%
- 平均月收益：10-15%

**适合人群：**
- DeFi 中高级用户
- 灵活资金（可以快速进出）
- 愿意承担高风险追求高收益
- 有时间密切关注市场动态
- 小额资金（$500+）也可参与

**不适合人群：**
- DeFi 新手（风险太高）
- 长期投资者（Nitro Pools 是短期策略）
- 风险厌恶型（代币价格波动大）
- 没时间管理的人（需要频繁监控）

**风险管理建议：**
1. 只参与有审计的项目
2. 定期 Harvest 并卖出项目代币（不要长期持有）
3. 分散到 2-3 个 Nitro Pools
4. 设置止损：如果代币跌幅 > 30%，考虑退出
5. 不要投入超过总资产 30% 的资金

**与其他策略对比：**
- vs 普通 LP：收益高 3-10 倍，但风险也更高
- vs Curve/Balancer：收益更高，但持续时间短
- vs GMX LP：风险类型不同（Nitro 是代币价格风险，GMX 是 PnL 风险）

记住：Nitro Pools 是"短平快"的策略，不要抱有长期持有的幻想。在 APY 最高的时候参与，在合适的时机退出，才能最大化收益。同时务必做好风险管理，避免被 Rug Pull 或代币暴跌！`,
  steps: [
    '准备 Arbitrum 钱包并跨链资金',
    '访问 Camelot 官网筛选高 APY Nitro Pools',
    '研究项目背景和安全性（审计、团队）',
    '为选定的池子提供流动性获得 LP Token',
    '将 LP Token 质押到 Nitro Pool',
    '每周 Harvest 奖励（GRAIL + 项目代币）',
    '定期卖出项目代币兑现收益',
    '监控 APY 变化和剩余时间',
    '在合适时机退出（APY < 50% 或时间快结束）',
    '提取 LP Token 并 Remove Liquidity'
  ]
};

const STRATEGY_14_8 = {
  title: 'Radiant V2 动态流动性挖矿 - 全链借贷协议',
  slug: 'liquidity-mining-14-8-radiant-v2-dynamic-liquidity',
  summary: '在 Radiant V2 提供流动性，通过动态流动性挖矿（dLP）获得高额 RDNT 代币奖励。跨链资产互通，收益随链上 TVL 动态调整。',
  category: 'liquidity-mining',
  category_l1: 'yield',
  category_l2: '流动性引导',
  difficulty_level: 'advanced',
  risk_level: 4,
  apy_min: 20,
  apy_max: 80,
  threshold_capital: '中等',
  threshold_capital_min: 3000,
  time_commitment: '中',
  time_commitment_minutes: 30,
  threshold_tech_level: 'advanced',
  status: 'published',
  content: `# Radiant V2 动态流动性挖矿 - 全链借贷协议

## 📖 小徐的跨链困境

小徐在多条链上都有资产：Arbitrum 上有 ETH，BNB Chain 上有 USDT，Polygon 上有 USDC。他想把这些资产统一管理，在一个平台上借贷和赚取收益，但：
- 传统借贷协议（Aave、Compound）是单链的
- 跨链桥操作复杂且有风险
- 每条链上单独管理，效率低下
- 想借款时，抵押品在其他链上无法使用

后来他发现了 Radiant Capital——第一个真正意义上的全链借贷协议，可以在 Arbitrum 上存款，在 BNB Chain 上借款。更重要的是，通过 Radiant 的动态流动性挖矿（dLP），他可以获得远高于普通借贷的收益。

**传统借贷协议的局限：**
- 单链孤岛，资产无法跨链互通
- 收益主要来自借贷利差，APY 通常只有 2-10%
- 流动性挖矿奖励逐年递减
- 无法灵活调配资金

**Radiant V2 的创新：**
- 全链互通，在 A 链存款，B 链借款
- 动态流动性挖矿（dLP），APY 可达 50-100%
- 奖励与锁定 5% 的 dLP 绑定，防止挖提卖
- 多链部署（Arbitrum、BNB Chain、Ethereum、Base）
- LayerZero 技术支持，安全性高

---

## 🎯 策略核心原理

### Radiant Capital 是什么？

Radiant 是基于 LayerZero 的全链借贷协议，核心特点：

**1. 全链资产互通**
- 在 Arbitrum 存入 ETH 作为抵押
- 可以在 BNB Chain 上借出 USDT
- 资产通过 LayerZero 跨链消息传递
- 无需手动跨链桥

**2. 动态流动性（dLP）机制**

这是 Radiant V2 的核心创新：

| 传统 LP | Radiant dLP |
|---------|-------------|
| 提供双币流动性 | 提供单币流动性（可以只用 RDNT + ETH） |
| 赚取交易手续费 | 赚取借贷协议的手续费分成 |
| 无常损失风险 | 同样有无常损失 |
| 收益固定 | 收益根据链上 TVL 动态调整 |

**dLP 要求：**
- 必须锁定价值 5% 的 dLP（相对于你的借贷规模）
- 例如：存入 $10,000 并借出 $5,000，需要锁定 $5,000 × 5% = $250 的 dLP
- dLP 是 RDNT-ETH（或 RDNT-BNB）的 LP Token

**3. 收益来源**

| 收益类型 | 说明 | 占比 | 稳定性 |
|---------|------|------|--------|
| **存款利息** | 存入资产赚取的借贷利息 | 15% | ⭐⭐⭐⭐⭐ |
| **RDNT 激励** | 存款和借款都能获得 RDNT 奖励 | 50% | ⭐⭐⭐⭐ |
| **dLP 奖励** | 锁定 dLP 获得额外 RDNT 奖励 | 30% | ⭐⭐⭐ |
| **平台手续费分成** | dLP 持有者分享协议收入 | 5% | ⭐⭐⭐ |

**关键：** 只有锁定 dLP，才能获得 RDNT 奖励。

### 动态调整机制

Radiant 的奖励会根据链上 TVL 动态变化：

- **TVL 增长 → 奖励增加**：新资金流入，协议提高激励吸引更多 LP
- **TVL 下降 → 奖励减少**：资金外流，奖励自动调低
- **跨链平衡**：如果某条链 TVL 过低，该链的奖励会提高

**这种设计的优势：**
- 自动平衡多链流动性
- 防止单链过度拥挤
- 早期参与者收益更高

---

## 📊 收益对比表

| 策略 | 资金要求 | 预计 APY | 复杂度 | 风险 | 适合人群 |
|------|---------|---------|--------|------|---------|
| **纯存款（无 dLP）** | 任意 | 2-8% | 低 | ⭐⭐ | 保守型 |
| **存款 + dLP** | 需锁 5% dLP | 25-50% | 中 | ⭐⭐⭐ | 中等风险 |
| **借款 + dLP** | 需锁 5% dLP | 30-60% | 中 | ⭐⭐⭐⭐ | 激进型 |
| **循环借贷 + dLP** | 需锁 5% dLP | 40-80% | 高 | ⭐⭐⭐⭐⭐ | 专业玩家 |

---

## 💰 收益计算示例

### 案例 1：基础策略（存款 + dLP）

小徐投入 10,000 USDT：

**操作步骤：**
1. 在 Radiant 存入 10,000 USDC
2. 购买价值 $500 的 dLP（5%）
   - $250 购买 RDNT
   - $250 保留 ETH
   - 在 Balancer 提供 RDNT-ETH 流动性
   - 锁定 LP Token 到 Radiant
3. 开始赚取收益

**收益计算（月）：**

**来源 1：存款利息**
- USDC 存款 APR：5%
- 月利息：$10,000 × 5% ÷ 12 = $42

**来源 2：RDNT 激励（存款奖励）**
- 存款 RDNT 激励 APR：30%
- 月奖励：$10,000 × 30% ÷ 12 = $250

**来源 3：dLP 奖励**
- dLP 锁定 APR：40%
- 月奖励：$500 × 40% ÷ 12 = $17

**来源 4：平台手续费分成**
- dLP 持有者分享平台收入
- 月收入：约 $10

**月总收益：** $42 + $250 + $17 + $10 = $319

**月收益率：** $319 ÷ $10,500 = 3.04%
**年化收益：** 约 36%

**但需考虑 RDNT 代币价格波动和 dLP 的无常损失**

---

### 案例 2：进阶策略（借款 + dLP）

小李采用借款策略提升收益：

**操作步骤：**
1. 存入 $10,000 ETH 作为抵押
2. 借出 $5,000 USDC（50% LTV）
3. 锁定 $5,000 × 5% = $250 的 dLP
4. 将借出的 USDC 再次存入或用于其他 DeFi 策略

**收益计算（月）：**

**收入：**
- 存款 ETH 利息：0%（抵押品不产生利息）
- 存款 RDNT 激励：$10,000 × 25% ÷ 12 = $208
- 借款 RDNT 激励：$5,000 × 15% ÷ 12 = $63（是的，借款也有奖励！）
- dLP 奖励：$250 × 40% ÷ 12 = $8
- 将借出的 USDC 存入其他协议：$5,000 × 8% ÷ 12 = $33

**支出：**
- 借款利息：$5,000 × 6% ÷ 12 = $25

**月净收益：** $208 + $63 + $8 + $33 - $25 = $287

**投入本金：** $10,000（ETH）+ $250（dLP）= $10,250
**月收益率：** $287 ÷ $10,250 = 2.8%
**年化收益：** 约 34%

**优势：**
- 提高资金利用率
- 借款也能获得 RDNT 奖励
- 可以将借出的资金用于其他策略

---

### 案例 3：高级策略（循环借贷）

资深玩家老王采用循环借贷最大化收益：

**操作流程：**
1. 存入 $10,000 ETH
2. 借出 $5,000 USDC（50% LTV）
3. 将 $5,000 USDC 再次存入 Radiant
4. 借出 $2,500 USDC（50% LTV）
5. 重复 2-3 轮

**总杠杆：** 约 2x

**收益计算（简化）：**
- 存款激励（放大 2 倍）：$10,000 × 2 × 25% ÷ 12 = $416
- 借款激励（放大 2 倍）：$10,000 × 15% ÷ 12 = $125
- dLP 奖励：$500 × 40% ÷ 12 = $17
- 存款利息：$10,000 × 5% ÷ 12 = $42
- 借款利息（支出）：-$10,000 × 6% ÷ 12 = -$50

**月净收益：** $416 + $125 + $17 + $42 - $50 = $550

**投入本金：** $10,000 + $500 = $10,500
**月收益率：** $550 ÷ $10,500 = 5.24%
**年化收益：** 约 63%

**风险：**
- 杠杆放大了收益，也放大了风险
- ETH 价格下跌可能导致清算
- 需要密切监控健康因子

---

## 🔧 操作步骤详解

### 准备阶段（首次设置：20 分钟）

**步骤 1：选择网络**

Radiant 支持多链：
- **Arbitrum**（推荐）：TVL 最高，流动性最好
- **BNB Chain**：TVL 第二，Gas 费更低
- **Base**：新兴链，奖励可能更高
- **Ethereum**：Gas 费高，不推荐小资金

**步骤 2：准备资金**
1. 准备要存入的资产（ETH、USDC、WBTC 等）
2. 准备 RDNT 和 ETH 用于制作 dLP（约 5%）
3. 准备 Gas 费

---

### 基础参与（存款 + dLP）（30 分钟）

**步骤 3：存入资产**

1. 访问 radiant.capital
2. 连接钱包（选择对应网络）
3. 在 "Dashboard" 页面点击 "Supply"
4. 选择要存入的资产（如 USDC）
5. 输入金额
6. 确认交易
7. 资产开始赚取利息

**步骤 4：制作 dLP**

这是 Radiant 的关键步骤：

**4.1 购买 RDNT 代币**
1. 在 Radiant 或 Balancer/Uniswap 购买 RDNT
2. 金额：你存款或借款金额的 2.5%
   - 例如存 $10,000，需要 $250 RDNT

**4.2 提供 RDNT-ETH 流动性**
1. 访问 Balancer（Radiant 推荐）
2. 搜索 RDNT-WETH 池
3. 点击 "Add Liquidity"
4. 提供 RDNT 和等值的 ETH
5. 获得 RDNT-WETH BPT（LP Token）

**4.3 锁定 dLP 到 Radiant**
1. 返回 Radiant 页面
2. 点击 "dLP" 标签
3. 点击 "Stake"
4. 输入 BPT 数量
5. 选择锁定时长（可选）：
   - 无锁定：随时退出
   - 锁定 30-90 天：获得额外奖励 Boost
6. 确认交易

**步骤 5：激活 dLP 资格**
1. 在 "Dashboard" 查看 "dLP Health"
2. 确保 dLP 价值 ≥ 5% × 你的借款金额
3. 如果 dLP 不足，会显示警告
4. dLP 达标后，开始获得 RDNT 奖励

---

### 进阶策略（借款 + dLP）（35 分钟）

**步骤 6：借款**

1. 在 "Dashboard" 点击 "Borrow"
2. 选择要借的资产（如 USDC）
3. 输入金额（建议 LTV < 60%，保留安全边际）
4. 查看：
   - Borrow APY：借款利率
   - Health Factor：健康因子（必须 > 1.0）
   - Liquidation Threshold：清算线
5. 确认交易

**健康因子管理：**
- Health Factor > 1.5：安全
- Health Factor 1.2-1.5：需注意
- Health Factor < 1.2：危险，可能被清算

**步骤 7：追加 dLP（如果借款）**

如果你借款了，dLP 要求会增加：
- dLP 要求 = 借款金额 × 5%
- 例如借 $5,000，需要 $250 dLP
- 追加制作 dLP 并锁定到 Radiant

**步骤 8：领取奖励**

Radiant 的奖励不会自动累积，需要定期 Claim：

1. 在 "Dashboard" 点击 "Claim"
2. 查看可领取的 RDNT 数量
3. 点击 "Claim RDNT"
4. 确认交易

**Claim 策略：**
- 每周 Claim 一次
- 或累积 > $100 再 Claim（节省 Gas）
- Claim 后可以：
  - 卖出 RDNT 兑现收益
  - 将 RDNT 复投到 dLP
  - 持有 RDNT 等待升值

---

### 高级策略（循环借贷）（45 分钟）

**步骤 9：循环借贷**

1. 存入 ETH（第 1 轮）
2. 借出 USDC
3. 将 USDC 换成 ETH
4. 再次存入 ETH（第 2 轮）
5. 再次借出 USDC
6. 重复 2-3 轮

**注意事项：**
- 每轮借款后，Health Factor 会下降
- 建议总 LTV < 60%
- 监控 ETH 价格，避免清算

**步骤 10：监控和调整**

定期检查（每周）：
1. Health Factor：保持 > 1.5
2. dLP Health：确保 dLP 价值 ≥ 5% × 借款
3. RDNT 奖励：及时 Claim
4. 如果 ETH 价格下跌，及时还款或追加抵押

---

## ⚠️ 风险提示

### 主要风险

**1. 清算风险 ⭐⭐⭐⭐⭐**
- **风险说明：** 抵押品价值下跌，Health Factor < 1.0 会被清算
- **影响：** 损失 10-15% 的抵押品作为清算罚金
- **应对措施：**
  - 保持 Health Factor > 1.5
  - 设置价格警报
  - 预留资金用于紧急还款
  - 避免过度杠杆

**2. RDNT 代币价格波动风险 ⭐⭐⭐⭐**
- **风险说明：** RDNT 是奖励代币，价格波动大
- **影响：** 即使 APY 高，RDNT 下跌会侵蚀收益
- **应对措施：**
  - 定期卖出 RDNT 兑现收益
  - 不要长期持有大量 RDNT
  - 只用 5% 资金制作 dLP

**3. dLP 无常损失风险 ⭐⭐⭐⭐**
- **风险说明：** RDNT-ETH LP 会产生无常损失
- **影响：** RDNT 价格剧烈波动时，LP 价值可能低于持有单币
- **应对措施：**
  - 只制作必要的 5% dLP
  - 定期 rebalance LP
  - 如果 RDNT 暴跌，及时退出 LP

**4. 智能合约风险 ⭐⭐⭐**
- **风险说明：** Radiant 依赖 LayerZero 跨链
- **应对措施：**
  - Radiant 已通过审计
  - LayerZero 是知名跨链协议
  - 但仍不要投入全部资产

**5. 跨链桥风险 ⭐⭐⭐**
- **风险说明：** 跨链借贷依赖 LayerZero 消息传递
- **应对措施：**
  - LayerZero 安全性较高
  - 避免在网络拥堵时跨链操作
  - 关注 LayerZero 官方公告

**6. dLP 要求风险 ⭐⭐⭐**
- **风险说明：** 如果 dLP 价值低于 5%，会失去奖励资格
- **影响：** 无法获得 RDNT 激励
- **应对措施：**
  - 定期检查 dLP Health
  - 如果 RDNT 下跌，追加 dLP
  - 或减少借款金额

---

## ❓ 常见问题 FAQ

**Q1：什么是 dLP？为什么必须锁定？**
A1：
- dLP = 动态流动性（Dynamic Liquidity Provision）
- 是 RDNT-ETH（或 RDNT-BNB）的 LP Token
- Radiant 要求锁定 5% dLP，防止挖提卖
- 只有锁定 dLP，才能获得 RDNT 奖励
- 这确保参与者与协议利益一致

**Q2：5% 是按存款还是借款计算？**
A2：
- 按**借款金额**计算
- 如果只存款不借款，也需要 5%（但按存款金额）
- 例如：
  - 存 $10,000，不借款：需要 $500 dLP
  - 存 $10,000，借 $5,000：需要 $250 dLP

**Q3：Radiant 的跨链借贷如何工作？**
A3：
1. 在 Arbitrum 存入 ETH
2. 选择在 BNB Chain 借款
3. Radiant 通过 LayerZero 发送跨链消息
4. BNB Chain 上的 Radiant 合约验证后放款
5. 全程无需手动跨链桥

**Q4：循环借贷的风险有多大？**
A4：
- 主要风险：清算风险
- 杠杆越高，清算线越近
- 建议：
  - 最多 2-3 轮循环
  - 保持总 LTV < 60%
  - 使用稳定币循环（如 USDC-USDT）降低清算风险

**Q5：如果 RDNT 价格暴跌，dLP 会怎样？**
A5：
- dLP 价值会大幅缩水
- 可能无法满足 5% 要求
- 需要追加 RDNT 或减少借款
- 最坏情况：失去奖励资格但不会被清算

**Q6：可以只参与存款，不制作 dLP 吗？**
A6：
- 可以，但无法获得 RDNT 激励
- 只能赚取基础的存款利息（2-8%）
- 大幅降低收益

**Q7：dLP 可以随时提取吗？**
A7：
- 如果无锁定：随时提取
- 如果锁定 30-90 天：到期后才能提取
- 提取后失去奖励资格

**Q8：Radiant 的 APY 为什么这么高？**
A8：
- 协议处于增长期，高激励吸引用户
- dLP 机制防止挖提卖，减少卖压
- 跨链功能有护城河，竞争少
- 但随着 TVL 增长，APY 会逐渐下降

**Q9：哪条链的收益最高？**
A9：
- 通常 TVL 较低的链收益更高
- 目前：Base > BNB Chain > Arbitrum > Ethereum
- 但 Base 流动性较差，可能难以卖出 RDNT
- 建议：在 Arbitrum 参与（平衡收益和流动性）

**Q10：需要多少资金参与？**
A10：
- 最低：$1,000（但 dLP 制作成本相对高）
- 建议：$5,000+（dLP 制作成本分摊合理）
- 理想：$20,000+（充分利用策略）

**Q11：如何监控 Health Factor？**
A11：
- Radiant Dashboard 实时显示
- 设置价格警报（如 CoinGecko、DeFiLlama）
- 使用 Debank 等工具跟踪
- 当 Health Factor < 1.3 时收到通知

**Q12：Radiant 安全吗？**
A12：
- 已通过多家审计机构审计
- TVL 超过 3 亿美元
- LayerZero 技术较为成熟
- 但仍有智能合约风险，分散投资

---

## 📚 总结

Radiant V2 动态流动性挖矿是 DeFi 借贷赛道的创新策略。通过全链互通和 dLP 机制，Radiant 在提供高收益的同时，也建立了可持续的代币经济模型。5% dLP 要求虽然增加了参与门槛，但有效防止了挖提卖，保护了长期参与者的利益。

**关键要点：**
1. **全链借贷**：在 A 链存款，B 链借款
2. **dLP 机制**：必须锁定 5% 的 RDNT-ETH LP
3. **多重收益**：存款利息 + RDNT 激励 + dLP 奖励
4. **动态调整**：奖励根据 TVL 变化自动调节
5. **高收益高风险**：APY 可达 50-80%，但清算和代币价格风险较高

**收益预期：**
- 纯存款（无 dLP）：年化 2-8%
- 存款 + dLP：年化 25-50%
- 借款 + dLP：年化 30-60%
- 循环借贷 + dLP：年化 40-80%

**适合人群：**
- DeFi 高级用户
- 持有多链资产，需要跨链借贷
- 愿意承担清算风险和代币价格波动
- 有能力制作和管理 dLP
- 中大资金量（$5,000+）

**不适合人群：**
- DeFi 新手（dLP 机制复杂）
- 风险厌恶型（清算和无常损失风险）
- 小资金（< $1,000，dLP 制作成本高）
- 需要完全流动性（dLP 有锁定期）

**风险管理建议：**
1. 保持 Health Factor > 1.5
2. 只制作必要的 5% dLP
3. 定期 Claim 并卖出 RDNT
4. 设置价格警报，监控清算风险
5. 不要过度杠杆（总 LTV < 60%）

**与其他策略对比：**
- vs Aave/Compound：收益高 3-5 倍，但复杂度和风险更高
- vs Curve/Balancer：Radiant 是借贷+LP，收益结构不同
- vs GMX LP：Radiant 的清算风险类似 GMX 的 PnL 风险

记住：Radiant 的高收益来自 RDNT 代币激励，长期可持续性取决于协议增长和代币价格稳定。参与前务必理解 dLP 机制和清算风险，做好资金管理！`,
  steps: [
    '选择网络（推荐 Arbitrum）并准备资金',
    '在 Radiant 存入资产（ETH、USDC 等）',
    '购买 RDNT 和 ETH 制作 dLP（5% 要求）',
    '在 Balancer 提供 RDNT-ETH 流动性',
    '将 LP Token 锁定到 Radiant 激活 dLP 资格',
    '（可选）借款提升收益',
    '监控 Health Factor 和 dLP Health',
    '每周 Claim RDNT 奖励',
    '定期卖出 RDNT 或复投',
    '管理清算风险，必要时还款或追加抵押'
  ]
};

const STRATEGY_14_9 = {
  title: 'Ramses Exchange 流动性管理 - Arbitrum ve(3,3) 新星',
  slug: 'liquidity-mining-14-9-ramses-exchange',
  summary: '在 Ramses Exchange 锁定 RAM 代币获得 veRAM，通过投票分配流动性激励，赚取交易手续费和贿选收益。Arbitrum 上的 Solidly 分叉，收益潜力大。',
  category: 'liquidity-mining',
  category_l1: 'yield',
  category_l2: '流动性引导',
  difficulty_level: 'intermediate',
  risk_level: 4,
  apy_min: 25,
  apy_max: 100,
  threshold_capital: '低',
  threshold_capital_min: 1000,
  time_commitment: '低',
  time_commitment_minutes: 20,
  threshold_tech_level: 'intermediate',
  status: 'published',
  content: `# Ramses Exchange 流动性管理 - Arbitrum ve(3,3) 新星

## 📖 小杨的 Arbitrum 淘金梦

小杨是 Arbitrum 生态的忠实粉丝，手里有 5,000 USDT 想要参与 DeFi 挖矿。他研究了 Arbitrum 上的主要 DEX：
- Uniswap V3：需要主动管理流动性区间，太复杂
- Camelot：Nitro Pools 好但持续时间短
- Sushiswap：收益太低，没有创新

后来他发现了 Ramses Exchange——Arbitrum 上新兴的 ve(3,3) 模型 DEX，采用与 Velodrome 类似的机制，但因为是新协议，APY 更高，早期参与者机会更大。

**传统 DEX 的问题：**
- Uniswap V3：LP 管理复杂，收益不稳定
- Curve/Balancer：更适合以太坊主网
- 老牌 DEX：APY 低，竞争激烈

**Ramses Exchange 的优势：**
- 采用 ve(3,3) 模型，经过 Velodrome 验证
- Arbitrum 原生 DEX，Gas 费极低
- 早期阶段，APY 高（100-300%）
- 支持 NFT（veRAM 是 NFT 形式）
- 贿选生态活跃

---

## 🎯 策略核心原理

### Ramses Exchange 是什么？

Ramses 是 Arbitrum 上的去中心化交易所，基于 Solidly 的 ve(3,3) 模型：

**1. ve(3,3) 机制**

这是由 Andre Cronje 提出的代币经济模型：
- 第一个"3"：投票者、LP 提供者、协议
- 第二个"3"：这三方利益一致，形成正向循环

**2. veRAM 投票权**

锁定 RAM 代币获得 veRAM：
- 锁定时间：1 周 - 4 年
- veRAM 权重：锁定时间越长，权重越高
- veRAM 是 NFT 形式，可以转让交易
- 投票决定哪些池子获得 RAM 代币激励

**3. 收益来源**

| 收益类型 | 说明 | 占比 | 稳定性 |
|---------|------|------|--------|
| **交易手续费** | 你投票的池子产生的手续费 | 40% | ⭐⭐⭐⭐⭐ |
| **Bribes（贿选）** | 项目方支付给投票者的奖励 | 45% | ⭐⭐⭐ |
| **RAM 释放** | 协议释放给 veRAM 持有者的 RAM | 10% | ⭐⭐⭐⭐ |
| **Rebase 奖励** | 补偿代币通胀的额外 RAM | 5% | ⭐⭐⭐ |

**4. 与 Velodrome 的对比**

| 维度 | Ramses | Velodrome |
|------|--------|----------|
| **网络** | Arbitrum | Optimism |
| **TVL** | 较小（$20-50M） | 大（$200-500M） |
| **APY** | 极高（50-150%） | 高（30-80%） |
| **竞争** | 少 | 激烈 |
| **风险** | 较高（新协议） | 较低（成熟） |
| **机会** | 早期红利 | 稳定收益 |

**关键：** Ramses 是早期阶段，APY 更高但风险也更大。

---

## 📊 收益对比表

| 锁定策略 | veRAM 权重 | 预计 APY | 风险 | 适合人群 |
|---------|-----------|---------|------|---------|
| **1 个月** | 2% | 30-50% | ⭐⭐⭐ | 试水用户 |
| **6 个月** | 12% | 50-80% | ⭐⭐⭐⭐ | 中期投资者 |
| **1 年** | 25% | 70-100% | ⭐⭐⭐⭐ | 看好 Ramses 发展 |
| **2 年** | 50% | 80-120% | ⭐⭐⭐⭐ | 长期持有者 |
| **4 年（最大）** | 100% | 100-150%+ | ⭐⭐⭐⭐⭐ | 深度参与者 |

---

## 💰 收益计算示例

### 案例 1：保守策略（6 个月锁定）

小杨投入 5,000 USDT：

**初始设置：**
- 购买 RAM：5,000 USDT（假设 RAM = $0.50）= 10,000 RAM
- 锁定时长：6 个月
- veRAM 权重：10,000 × 12% = 1,200 veRAM

**投票策略：混合池**
1. **ARB-ETH**（30%）- 高交易量
2. **USDC-USDT**（30%）- 稳定币低风险
3. **新项目 A-ETH**（20%）- 高 Bribes
4. **RAM-ETH**（20%）- 支持协议

**周收益计算：**

**来源 1：交易手续费**
- ARB-ETH 周交易量：$10M
- 手续费：$10M × 0.3% = $30K
- 小杨占比：0.2%
- 手续费收入：$30K × 0.2% × 30% = $18

**来源 2：Bribes**
- 新项目 A 周 Bribes：$20,000
- 小杨收益：$20,000 × 0.2% × 20% = $8

**来源 3：RAM 释放**
- 周释放：100,000 RAM
- 小杨占比：0.2%
- RAM 奖励：100,000 × 0.2% = 200 RAM（$100）

**来源 4：Rebase**
- Rebase 补偿：5%
- 补偿金额：10,000 × 5% ÷ 52 = 9.6 RAM（$4.8）

**周总收益：** $18 + $8 + $100 + $4.8 = $130.8

**周收益率：** $130.8 ÷ $5,000 = 2.62%
**年化收益：** 2.62% × 52 = 136%

**实际预期 APY：** 60-90%（考虑 RAM 价格波动和 Bribes 变化）

---

### 案例 2：激进策略（4 年锁定 + 高 Bribes）

老张看好 Ramses 长期发展，全力投入：

**初始设置：**
- 投入 $20,000 购买 40,000 RAM
- 锁定 4 年
- veRAM：40,000 × 100% = 40,000 veRAM（满权重）

**投票策略：专注高 Bribes 新项目**
- 100% 投给当周 Bribes 最高的池子
- 每周动态调整

**周收益：**
- 手续费：$80
- Bribes：$300（新项目激励慷慨）
- RAM 释放：$800
- Rebase：$77

**周总收益：** $1,257
**周收益率：** 6.3%
**年化收益：** 约 327%

**但需考虑：**
- RAM 价格可能暴跌
- 锁定 4 年流动性极差
- 新项目 Bribes 可能突然停止

**实际预期 APY：** 80-150%（高风险高收益）

---

### 案例 3：平衡策略（购买折价 veRAM NFT）

聪明的小李不直接锁定，而是在 NFT 市场购买：

**操作：**
- 在 OpenSea 搜索 Ramses veRAM NFT
- 找到一个包含 10,000 veRAM 的 NFT
- 原成本：10,000 RAM（$5,000）
- 剩余锁定期：1 年
- 卖家售价：$4,000（打 8 折）

**优势：**
- 节省 $1,000（20% 折扣）
- 立即享受高权重投票收益
- 缩短等待期（已锁定一段时间）

**收益：**
- 与案例 1 类似，但成本更低
- 实际 APY 因折价购买而提升 25%

---

## 🔧 操作步骤详解

### 准备阶段（首次设置：15 分钟）

**步骤 1：准备 Arbitrum 钱包**
1. 安装 MetaMask
2. 切换到 Arbitrum One 网络
3. 跨链资金到 Arbitrum（从以太坊主网或 CEX）
4. 准备少量 ETH 作为 Gas 费（0.005 ETH 足够）

**步骤 2：购买 RAM 代币**
1. 访问 ramses.exchange
2. 连接钱包
3. 点击 "Trade"
4. 用 USDC/ETH 兑换 RAM
5. 确认交易（Gas 费 < $0.5）

**RAM 代币信息：**
- 查看 CoinGecko 或 DexScreener 实时价格
- 价格波动较大，建议分批购买

---

### 锁定 RAM 创建 veRAM（10 分钟）

**步骤 3：锁定 RAM**

1. 访问 ramses.exchange/vote
2. 点击 "Lock RAM"
3. 输入要锁定的 RAM 数量
4. 选择锁定时长（1 周 - 4 年）
5. 查看将获得的 veRAM 数量
6. 确认交易（Gas 费 < $0.5）
7. 获得 veRAM NFT（显示在钱包的 NFT 收藏中）

**锁定时长建议：**
- 试水：1-3 个月
- 中期：6 个月 - 1 年
- 长期：2-4 年（最大化收益）

---

### 投票赚取收益（每周 10 分钟）

**步骤 4：研究池子和 Bribes**

1. 访问 ramses.exchange/vote
2. 查看所有池子的 Gauge 信息：
   - Total Votes：当前投票数
   - APR：LP 收益率
   - Bribes：贿选金额
   - TVL：池子锁仓

**寻找高 Bribes 池子：**
- 关注 Ramses Discord 的 #bribes 频道
- 查看第三方平台（如 Bribe Scanner）
- 按 $/veRAM 排序找最优池

**步骤 5：执行投票**

1. 选择你的 veRAM NFT
2. 为不同池子分配投票权重
3. 可以投 1 个池，也可以分散投多个
4. 确保总计 100%
5. 点击 "Cast Votes"
6. 确认交易（Gas 费 < $0.5）

**投票策略示例：**

**保守型（稳定收益）：**
- 50% → USDC-USDT
- 30% → ARB-ETH
- 20% → RAM-ETH

**激进型（追逐 Bribes）：**
- 100% 投给单个高 Bribes 新项目池

**步骤 6：每周调整投票**

- Ramses 的投票周期：每周四开始
- 可以在每个周期重新投票
- 根据 Bribes 变化调整策略

---

### 领取收益（每周 5 分钟）

**步骤 7：Claim 奖励**

1. 访问 ramses.exchange/rewards
2. 查看可领取的奖励：
   - Trading Fees（多种代币）
   - Bribes（项目方代币）
   - RAM Emissions（RAM 代币）
   - Rebase 奖励
3. 点击 "Claim All"
4. 确认交易（Gas 费 < $1）

**收益处理策略：**
- **现金流策略**：全部卖出兑换为 USDC
- **复投策略**：50% 卖出，50% 重新锁定为 veRAM
- **持有策略**：持有 RAM，等待价格升值

---

### 高级策略（可选）

**步骤 8：转让 veRAM NFT**

veRAM 是 NFT 形式，可以交易：

1. 在 OpenSea 或 TofuNFT 搜索 "Ramses veRAM"
2. 列出你的 veRAM NFT 出售
3. 设置价格（通常比原成本折价 10-30%）
4. 买家购买后立即获得流动性

**何时转让：**
- 需要紧急流动性
- 不再看好 Ramses
- 发现更好的机会

**步骤 9：延长锁定期**

1. 访问 ramses.exchange/vote
2. 选择你的 veRAM NFT
3. 点击 "Extend Lock"
4. 选择新的锁定结束时间
5. 确认交易

**步骤 10：合并多个 veRAM NFT**

如果你有多个 veRAM NFT，可以合并：
1. 点击 "Merge"
2. 选择要合并的 NFT
3. 合并后变成一个更大的 NFT
4. 简化管理，节省 Gas 费

---

## ⚠️ 风险提示

### 主要风险

**1. RAM 代币价格暴跌风险 ⭐⭐⭐⭐⭐**
- **风险说明：** Ramses 是新协议，RAM 价格波动极大
- **影响：** 即使 APY 极高，RAM 价格腰斩会导致实际亏损
- **应对措施：**
  - 分批建仓，降低成本
  - 定期卖出奖励兑现收益
  - 不要投入超过 20% 的总资产
  - 设置止损：如果 RAM 跌幅 > 50%，考虑退出

**2. 协议失败风险 ⭐⭐⭐⭐⭐**
- **风险说明：** Ramses 是新协议，可能无法吸引足够流动性
- **影响：** TVL 流失，RAM 归零
- **应对措施：**
  - 密切关注 TVL 变化
  - 如果 TVL 连续 3 个月下降，考虑退出
  - 分散投资，不要 All in

**3. 锁定期流动性风险 ⭐⭐⭐⭐**
- **风险说明：** 锁定后无法直接退出
- **应对措施：**
  - 虽然 veRAM 可以转让，但可能需要折价 20-30%
  - 只锁定能承受完全损失的资金
  - 保留一部分流动资金

**4. Bribes 不确定性风险 ⭐⭐⭐**
- **风险说明：** 项目方 Bribes 可能突然停止
- **应对措施：**
  - 不要全部依赖 Bribes
  - 交易手续费是更稳定的收益来源
  - 分散投票给多个池子

**5. 智能合约风险 ⭐⭐⭐**
- **风险说明：** Ramses 是 Solidly 分叉，可能有漏洞
- **应对措施：**
  - 虽然 Solidly 代码经过验证，但分叉可能引入新问题
  - 检查审计报告
  - 不要投入全部资产

**6. 竞争风险 ⭐⭐⭐**
- **风险说明：** Arbitrum 上有多个 DEX 竞争（Camelot、Chronos 等）
- **影响：** 如果 Ramses 无法胜出，流动性和收益会下降
- **应对措施：**
  - 关注 Ramses 的 TVL 排名
  - 对比其他 DEX 的 APY
  - 灵活切换到更好的机会

---

## ❓ 常见问题 FAQ

**Q1：Ramses 和 Velodrome 有什么区别？**
A1：
- Ramses 在 Arbitrum，Velodrome 在 Optimism
- Ramses 更早期，APY 更高但风险也更大
- Ramses 的 veRAM 可以转让（NFT 形式），Velodrome 也可以
- Ramses TVL 较小，流动性不如 Velodrome

**Q2：为什么 Ramses 的 APY 这么高？**
A2：
- 协议处于早期阶段，高激励吸引用户
- TVL 较小，分母小导致 APY 高
- 随着 TVL 增长，APY 会逐渐下降
- 早期参与者享受最高收益

**Q3：可以提前退出锁定吗？**
A3：
- 不能直接提前解锁
- 但可以在 NFT 市场出售 veRAM
- 通常需要折价 10-30% 才能快速卖出
- 或等待锁定期结束

**Q4：如何在 OpenSea 找到 Ramses veRAM NFT？**
A4：
1. 访问 OpenSea
2. 切换到 Arbitrum 网络
3. 搜索 "Ramses veRAM" 或输入合约地址
4. 查看各个 NFT 的：
   - veRAM 数量
   - 剩余锁定时间
   - 价格
5. 评估性价比后购买

**Q5：Ramses 的 Bribes 在哪里查看？**
A5：
1. Ramses 官网：ramses.exchange/vote
2. Ramses Discord #bribes 频道
3. 第三方工具：Bribe Scanner、DeFiLlama

**Q6：需要持有 Ramses NFT 吗？**
A6：
- veRAM 本身就是 NFT
- 不需要额外的 Ramses NFT
- 但某些池子可能要求持有特定 NFT（罕见）

**Q7：Gas 费大概多少？**
A7：Arbitrum 的 Gas 费极低：
- 锁定 RAM：$0.3-0.5
- 投票：$0.2-0.4
- Claim 奖励：$0.5-1
- 转让 veRAM：$0.5-1
- 总计：每周操作成本 < $2

**Q8：Ramses 会不会跑路？**
A8：
- Ramses 是去中心化协议，无法跑路
- 但如果 TVL 流失严重，协议可能死亡
- 关注 TVL 和社区活跃度
- 设置止损点

**Q9：如何评估 Ramses 是否值得参与？**
A9：评估清单：
- ✅ TVL > $20M（流动性基本保障）
- ✅ 日交易量 > $5M（用户活跃）
- ✅ 社区活跃（Discord 有真人讨论，不是机器人）
- ✅ APY > 50%（值得冒险）
- ⚠️ TVL 持续增长（健康信号）
- ❌ TVL 连续下降（警告信号）

**Q10：需要多少资金参与？**
A10：
- 最低：$500（试水）
- 建议：$2,000-5,000（收益可观）
- 理想：$10,000+（充分利用策略）
- 但不要超过总资产的 20%（高风险）

**Q11：如果 RAM 价格暴跌，应该立即退出吗？**
A11：评估情况：
- 如果只是市场整体下跌，可以继续持有
- 如果是 Ramses 特有的问题（TVL 流失、团队问题），立即退出
- 如果 RAM 跌幅 > 50% 且无止跌信号，考虑止损
- 计算实际收益：手续费 + Bribes 可能仍为正

**Q12：Ramses 的长期前景如何？**
A12：
- 优势：Arbitrum 生态快速增长，ve(3,3) 模型验证有效
- 劣势：竞争激烈（Camelot、Chronos），TVL 较小
- 关键：能否吸引优质项目方提供 Bribes
- 建议：短中期参与（6 个月 - 1 年），长期不确定性大

---

## 📚 总结

Ramses Exchange 是 Arbitrum 上新兴的 ve(3,3) 模型 DEX，为早期参与者提供了极高的收益机会。作为 Solidly/Velodrome 的改进版本，Ramses 结合了 NFT 可转让性和 Arbitrum 的低 Gas 费优势，是当前 DeFi 中风险调整后收益最具吸引力的策略之一。

**关键要点：**
1. **早期红利**：APY 可达 100-150%，但随 TVL 增长会下降
2. **ve(3,3) 模型**：经过 Velodrome 验证的有效机制
3. **NFT 可转让**：veRAM 是 NFT，提供提前退出途径
4. **极低 Gas 费**：Arbitrum 优势，适合小资金和频繁操作
5. **高风险高收益**：新协议风险大，但机会也大

**收益预期：**
- 短期锁定（1-3 个月）：年化 30-60%
- 中期锁定（6 个月 - 1 年）：年化 50-100%
- 长期锁定（2-4 年）：年化 80-150%

**适合人群：**
- DeFi 中级用户
- Arbitrum 生态参与者
- 愿意承担高风险追求高收益
- 有能力评估新协议风险
- 灵活资金（可以通过 NFT 市场退出）

**不适合人群：**
- DeFi 新手（风险太高）
- 风险厌恶型（RAM 价格波动极大）
- 需要保证本金安全
- 无法承受协议失败风险

**风险管理建议：**
1. 不要投入超过总资产 20%
2. 分批建仓，降低 RAM 购买成本
3. 定期卖出奖励兑现收益
4. 设置止损：RAM 跌幅 > 50% 考虑退出
5. 密切关注 TVL 变化

**与其他策略对比：**
- vs Velodrome：Ramses APY 更高，但风险也更大
- vs Camelot：Ramses 是长期策略，Camelot Nitro 是短期
- vs Curve/Balancer：Ramses 更适合 Arbitrum，收益更高

**最终建议：**
Ramses 是典型的"高风险高收益"策略。如果你相信 Arbitrum 生态的长期增长，并且能够承担 RAM 价格大幅波动，Ramses 提供了极具吸引力的早期参与机会。但务必做好风险管理，不要 All in！

记住：新协议的高 APY 往往不可持续，早期参与者吃肉，后来者可能接盘。在 TVL 和 APY 达到一定规模后（如 TVL > $100M，APY < 50%），Ramses 会更加稳定，但收益也会大幅下降。把握时机最重要！`,
  steps: [
    '准备 Arbitrum 钱包并跨链资金',
    '在 Ramses 或 Uniswap 购买 RAM 代币',
    '锁定 RAM 创建 veRAM NFT（选择锁定时长）',
    '研究各池子的交易量、Bribes 和 APR',
    '制定投票策略并执行投票（每周）',
    '每周四调整投票追逐最高 Bribes',
    '每周 Claim 奖励（手续费、Bribes、RAM）',
    '处理收益：卖出或复投',
    '（可选）在 NFT 市场交易 veRAM 提前退出',
    '锁定到期后选择重新锁定或解锁退出'
  ]
};

async function getAuthToken() {
  try {
    const response = await axios.post('http://localhost:8055/auth/login', {
      email: 'the_uk1@outlook.com',
      password: 'Mygcdjmyxzg2026!'
    });
    return response.data.data.access_token;
  } catch (error) {
    console.error('认证失败:', error.response?.data || error.message);
    throw error;
  }
}

async function createStrategies() {
  try {
    const token = await getAuthToken();
    console.log('认证成功，开始创建策略...\n');

    const strategies = [STRATEGY_14_7, STRATEGY_14_8, STRATEGY_14_9];

    for (let i = 0; i < strategies.length; i++) {
      const strategyNum = 14.7 + (i * 0.1);
      console.log(`正在创建策略 ${strategyNum.toFixed(1)}: ${strategies[i].title}...`);

      const response = await axios.post(
        'http://localhost:8055/items/strategies',
        strategies[i],
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log(`✅ 策略 ${strategyNum.toFixed(1)} 创建成功! ID: ${response.data.data.id}`);
      console.log(`   标题: ${strategies[i].title}`);
      console.log(`   Slug: ${strategies[i].slug}\n`);
    }

    // 获取总策略数
    const countResponse = await axios.get(
      'http://localhost:8055/items/strategies?aggregate[count]=id',
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    const totalCount = countResponse.data.data[0].count.id;
    console.log('========================================');
    console.log('🎉 所有流动性挖矿策略创建完成！');
    console.log(`📊 当前数据库中共有 ${totalCount} 个策略`);
    console.log('========================================');
    console.log('\n✅ 14. 流动性引导 类别全部完成（14.1 - 14.9）');

  } catch (error) {
    console.error('❌ 创建策略时出错:', error.response?.data || error.message);
    throw error;
  }
}

createStrategies();
