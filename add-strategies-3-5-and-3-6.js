const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

// ===== 3.5 Sui 测试网 DApp 体验 =====
const STRATEGY_3_5 = {
  title: 'Sui 测试网 DApp 体验 - Move 语言新公链早期参与',
  slug: 'sui-testnet-dapp-experience',
  summary: '在 Sui 测试网上体验钱包、DEX、NFT 市场等应用，完成官方任务，为主网空投做准备，抢占 Move 语言生态早期机会。',

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

  content: `> **适合人群**：技术爱好者、愿意学习新公链的玩家、Move 语言开发者
> **阅读时间**：约 11 分钟
> **关键词**：Sui / Move 语言 / 测试网 / Mysten Labs / 对象模型

---

## 🎯 什么是 Sui？

### 项目背景

**Sui** 是一条由 Mysten Labs 开发的革命性 Layer 1 区块链，核心特点：

- **Move 语言**：基于 Facebook Diem 项目的 Move 智能合约语言
- **对象中心模型**：创新的对象存储模型，提升并行处理能力
- **超高 TPS**：理论上可达 100,000+ TPS
- **即时确认**：简单交易可实现亚秒级确认
- **低 Gas 费用**：交易费用极低，适合高频应用

**融资背景**：
- 2022 年 9 月 B 轮：3.36 亿美元（FTX、a16z、Jump Crypto 等）
- 总融资：超过 3.36 亿美元
- 主网于 2023 年 5 月上线，已完成第一轮空投

### 为什么要参与 Sui 测试网？

1. **持续空投预期**：Sui 主网已上线，但测试网参与者仍有机会获得后续激励
2. **Move 生态先机**：Move 语言是区块链领域的新方向，早期学习优势明显
3. **技术创新**：了解对象模型、并行执行等下一代区块链技术
4. **开发者红利**：Sui 对开发者友好，技术贡献者可获得额外奖励

**类似案例**：
- Aptos（同为 Move 语言）：测试网用户获得 150-300 APT（价值 1500-3000 美元）
- Sui 第一轮空投：早期测试者获得可观 SUI 代币
- Move 语言开发者：在两个生态都获得优先待遇

---

## 📋 准备工作（40 分钟）

### 第一步：了解 Move 语言优势

**Move 语言特性**：
- **资源安全**：数字资产是"一等公民"，不能被复制或丢失
- **形式验证**：代码可数学证明其正确性
- **灵活性**：比 Solidity 更适合复杂资产管理

**为什么重要**？
- Move 是 Sui 和 Aptos 的共同语言
- 学会使用 Move DApp，可在两个生态套利
- 未来更多 Move 链可能出现（如 Linera、0L Network）

### 第二步：安装 Sui 钱包

**推荐钱包**：

1. **Sui Wallet（官方）**
   - Chrome 扩展：https://chrome.google.com/webstore（搜索 "Sui Wallet"）
   - 最稳定，官方支持
   - 直接集成水龙头功能

2. **Suiet Wallet**
   - 社区开发的钱包
   - UI 更友好
   - 支持多账户管理

3. **Ethos Wallet**
   - 邮箱登录，无需助记词（可选）
   - 适合新手
   - 安全性依赖 Ethos 团队

**操作步骤**：
1. 安装钱包扩展
2. 创建新钱包或导入现有钱包
3. **务必备份助记词**（即使是测试网）
4. 记录钱包地址（以 0x 开头）

### 第三步：切换到测试网

**网络配置**：
- 在钱包设置中找到"Network"或"网络"
- 选择 **Testnet**（测试网）或 **Devnet**（开发网）
- 推荐先使用 Testnet，更稳定

**验证连接**：
- 钱包右上角应显示"Testnet"
- 余额为 0 SUI（尚未领取测试币）

### 第四步：领取测试币

**方法 1：钱包内置水龙头**
1. 打开 Sui Wallet
2. 点击"Request Testnet SUI Tokens"
3. 每天可领取 1 次（通常 1-5 SUI）

**方法 2：官方 Discord**
1. 加入 Sui Discord：https://discord.gg/sui
2. 完成身份验证
3. 在 #testnet-faucet 频道输入：
   \`\`\`
   !faucet <你的钱包地址>
   \`\`\`
4. 每 24 小时可请求 1 次

**方法 3：开发者水龙头（高级）**
1. 安装 Sui CLI：https://docs.sui.io/build/install
2. 运行命令：
   \`\`\`bash
   sui client faucet
   \`\`\`
3. 适合开发者使用

**方法 4：第三方水龙头**
- https://suifaucet.com/
- https://faucet.triangleplatform.com/sui/testnet

---

## 🚀 4 周测试网体验计划

### 第 1 周：钱包和基础交互

**任务 1：钱包基础操作**

熟悉 Sui 钱包功能：

1. **查看余额**
   - 查看 SUI 代币余额
   - 了解 Gas 机制

2. **转账操作**
   - 给自己的另一个地址转账
   - 或与朋友互相转账
   - 重复 10-15 次（建立链上活跃度）

3. **探索对象（Objects）**
   - Sui 使用对象模型而非账户模型
   - 在 Sui Explorer 查看自己的对象：https://suiexplorer.com/
   - 理解"Objects"和"Coins"的区别

**任务 2：体验 Sui Explorer**

Sui Explorer 是查看链上数据的工具：

1. 访问 https://suiexplorer.com/（选择 Testnet）
2. 搜索自己的钱包地址
3. 查看：
   - 交易历史（Transactions）
   - 持有的对象（Objects）
   - 拥有的 NFT（Collectibles）

**任务 3：水龙头定期领取**

- 设置日历提醒，每天领取测试币
- 积累足够的 SUI 用于后续交互
- 建议积累 10+ SUI

### 第 2 周：DeFi 协议体验

**任务 4：使用 Sui DEX**

Sui 测试网上的 DEX 包括：

1. **Cetus Protocol**（推荐）
   - 访问 https://www.cetus.zone/（切换到 Testnet）
   - **Swap 操作**：
     - 将 SUI 换成其他测试代币（如 USDC）
     - 再换回 SUI
     - 重复 5-10 次
   - **添加流动性**：
     - 选择一个交易对（如 SUI/USDC）
     - 添加流动性获得 LP Token
     - 保持至少 1-2 周

2. **Turbos Finance**
   - 访问 https://app.turbos.finance/（选择 Testnet）
   - 类似 Uniswap V3 的集中流动性 DEX
   - 尝试设置价格区间添加流动性

**任务 5：借贷协议（如果可用）**

Sui 测试网的借贷协议：

1. **Scallop Protocol**
   - 访问 https://scallop.io/（切换 Testnet）
   - **存款操作**：存入 SUI，赚取利息
   - **借款操作**：抵押 SUI，借出稳定币
   - **还款操作**：偿还借款，赎回抵押品

2. 重复操作建议：
   - 存款 3-5 次
   - 借款 2-3 次
   - 还款 2-3 次

**任务 6：跨链桥体验**

体验 Sui 的跨链功能：

1. **Wormhole Portal**
   - 从其他测试网（如 Goerli）桥接资产到 Sui
   - 或从 Sui 桥接到其他链

2. **注意**：
   - 跨链需要两条链都有测试币（用于 Gas）
   - 记录交易哈希，证明你完成了跨链

### 第 3 周：NFT 和应用

**任务 7：铸造和交易 NFT**

Sui NFT 市场：

1. **BlueMove（推荐）**
   - 访问 https://bluemove.net/（切换 Testnet）
   - **铸造 NFT**：参与免费 Mint 活动
   - **交易 NFT**：购买或出售测试 NFT
   - **创建收藏**（可选）：上传自己的 NFT 项目

2. **Clutchy**
   - Sui 原生 NFT 市场
   - 体验 NFT 挂单、出价、交易

3. 建议操作：
   - 铸造 3-5 个 NFT
   - 至少完成 2 笔 NFT 交易

**任务 8：体验 Sui 应用生态**

探索 Sui 测试网的其他应用：

1. **Suia（Sui 上的 Name Service）**
   - 注册 .sui 域名（测试网版本）
   - 类似 ENS，但基于 Sui

2. **Sui Games（如果可用）**
   - 体验链上游戏
   - 如 SuiFrens（Sui 官方 NFT 游戏）

3. **社交应用**
   - 尝试 Sui 上的社交 DApp（如有）

**任务 9：完成官方任务**

Sui 官方任务平台：

1. **Galxe**
   - 访问 https://galxe.com/，搜索"Sui"
   - 完成所有 Sui 测试网任务
   - 铸造 OAT NFT 作为凭证

2. **Zealy**
   - 搜索 Sui 社区任务
   - 完成社交+链上任务
   - 赚取 XP 和排行榜排名

### 第 4 周：开发者贡献和长期活跃

**任务 10：开发者路径（可选）**

如果你有编程基础：

1. **学习 Move 语言**
   - 官方教程：https://docs.sui.io/learn
   - Move Book：https://move-book.com/
   - 完成示例合约部署

2. **部署测试合约**
   - 使用 Sui CLI 部署简单合约
   - 如"Hello World"或"Counter"

3. **申请开发者资助**
   - Sui 基金会有开发者激励计划
   - 贡献代码、工具、文档可获得奖励

**任务 11：社区参与**

成为活跃社区成员：

1. **加入 Sui Discord**
   - 在 #general 频道保持活跃
   - 帮助新人解答问题
   - 分享测试体验

2. **Twitter 互动**
   - 关注 @SuiNetwork
   - 转发、评论官方推文
   - 使用标签 #SuiNetwork #MoveDev

3. **创作内容（可选）**
   - 写测试网体验文章
   - 制作教程视频
   - 翻译官方文档

**任务 12：保持长期活跃**

- 每周至少交互 2-3 次
- 关注 Sui 公告，参与新功能测试
- 保持 DeFi 流动性，持续赚取测试奖励

---

## 💰 成本与收益

### 成本

| 项目 | 金额 |
|------|------|
| 资金成本 | 0 美元（测试网） |
| 时间成本 | 8-12 小时（4 周） |
| 学习成本 | 中等（需了解 Move 概念） |

### 潜在收益

**空投预测**（基于 Sui 第一轮和类似项目）：

- **保守估计**：500-1500 美元（后续激励）
- **中等估计**：1500-5000 美元（活跃测试者）
- **乐观估计**：5000-10000 美元（开发者贡献者）

**对比参考**：
- Sui 第一轮空投：早期测试者获得数千美元
- Aptos 测试网：平均 2000 美元，开发者更高
- Move 语言加成：两个生态都参与，收益翻倍

---

## ⚠️ 风险与注意事项

### 主要风险

1. **不确定性**
   - Sui 主网已上线，后续空投规模可能减小
   - 但测试网参与仍有价值（开发者激励、新功能测试）

2. **技术门槛**
   - Move 语言相对陌生
   - 对象模型需要时间理解
   - 但普通用户只需会用 DApp 即可

3. **测试网重置**
   - 测试网可能清零
   - 但官方会保留用户交互记录

### 成功关键

- ✅ **多样化交互**：不只是转账，要体验各类 DApp
- ✅ **持续活跃**：定期交互，不要一次性完成
- ✅ **学习 Move**：了解 Move 语言基础，提高竞争力
- ✅ **开发者贡献**：如果可能，参与代码或文档贡献

---

## 📊 进度追踪清单

### 第 1 周
- [ ] 安装 Sui 钱包并切换到测试网
- [ ] 领取测试币（至少 10 SUI）
- [ ] 完成 10+ 次转账操作
- [ ] 探索 Sui Explorer

### 第 2 周
- [ ] 在 Cetus/Turbos 完成 5+ 次 Swap
- [ ] 添加流动性并保持 1-2 周
- [ ] 体验借贷协议（存款、借款、还款）
- [ ] 尝试跨链桥操作

### 第 3 周
- [ ] 铸造 3-5 个测试 NFT
- [ ] 完成 2+ 笔 NFT 交易
- [ ] 注册 .sui 域名（可选）
- [ ] 完成 Galxe/Zealy 任务

### 第 4 周
- [ ] 学习 Move 语言基础（可选）
- [ ] 加入 Discord 和 Twitter 保持活跃
- [ ] 部署测试合约（开发者）
- [ ] 每周保持 2-3 次交互

---

## ❓ 常见问题

**Q1：Sui 和 Aptos 都是 Move 语言，应该选哪个？**
> 两个都参与！Move 语言是通用的，在一个链上的经验可以直接迁移到另一个。建议同时参与 Sui 和 Aptos 测试网，最大化收益。

**Q2：不懂编程可以参与吗？**
> 完全可以。普通用户只需会使用钱包和 DApp（像使用以太坊一样），不需要懂 Move 编程。但如果学习编程，会有额外优势。

**Q3：测试币不够用怎么办？**
> 多使用几个水龙头，或在 Discord 礼貌请求社区帮助。也可以创建多个钱包地址，每个地址都领取测试币。

**Q4：Sui 对象模型和以太坊账户模型有什么区别？**
> 简化理解：以太坊像银行账户（余额），Sui 像实物钱包（每个币是独立对象）。对象模型支持更高效的并行处理。

**Q5：还会有空投吗？**
> Sui 主网已上线并完成首轮空投，但：1) 测试网仍在运行，可能有新功能激励 2) 开发者激励计划持续进行 3) 早期参与总有优势。

---

## 🎓 总结

**Sui 测试网的价值**：
1. **Move 语言先机**：学习下一代智能合约语言
2. **技术创新**：了解对象模型、并行执行等前沿技术
3. **双生态优势**：Move 经验可用于 Sui 和 Aptos
4. **开发者红利**：技术贡献者获得长期激励

**成功路径**：
1. **基础参与**：完成钱包、DEX、NFT 等常规交互
2. **深度学习**：了解 Move 语言和 Sui 架构
3. **开发者贡献**：如果可能，贡献代码或文档
4. **长期活跃**：持续关注新功能，保持社区参与

Sui 是 Move 语言生态的重要一环，测试网参与不仅是为了空投，更是为了掌握未来区块链技术！`,

  steps: [
    { step_number: 1, title: '准备工作', description: '安装钱包、切换测试网、领取测试币、了解 Move 语言。', estimated_time: '40 分钟' },
    { step_number: 2, title: '钱包和基础交互（第 1 周）', description: '转账、探索 Sui Explorer、定期领取测试币。', estimated_time: '2 小时' },
    { step_number: 3, title: 'DeFi 协议体验（第 2 周）', description: '使用 DEX、借贷、跨链桥等 DeFi 应用。', estimated_time: '3 小时' },
    { step_number: 4, title: 'NFT 和应用（第 3 周）', description: '铸造交易 NFT、体验 Sui 应用、完成官方任务。', estimated_time: '2.5 小时' },
    { step_number: 5, title: '开发者贡献和长期活跃（第 4 周）', description: '学习 Move、社区参与、保持活跃、开发者贡献（可选）。', estimated_time: '每周 1 小时' },
  ],
};

// ===== 3.6 Aptos 开发者激励计划 =====
const STRATEGY_3_6 = {
  title: 'Aptos 开发者激励计划 - Move 语言智能合约开发奖励',
  slug: 'aptos-developer-incentive-program',
  summary: '在 Aptos 测试网上开发或测试 Move 语言智能合约，申请开发者资助和代币奖励，成为 Move 生态的早期建设者。',

  category: 'testnet',
  category_l1: 'airdrop',
  category_l2: '测试网&早鸟',

  difficulty_level: 3,
  risk_level: 1,

  apy_min: 0,
  apy_max: 0,
  threshold_capital: '0 美元（测试网）',
  threshold_capital_min: 0,
  time_commitment: '每周 5-10 小时',
  time_commitment_minutes: 450,
  threshold_tech_level: 'advanced',

  content: `> **适合人群**：开发者、技术爱好者、愿意学习 Move 语言的程序员
> **阅读时间**：约 13 分钟
> **关键词**：Aptos / Move 语言 / 开发者激励 / 智能合约 / Grant

---

## 🎯 什么是 Aptos 开发者激励计划？

### 项目背景

**Aptos** 是由 Facebook（Meta）前 Diem 团队成员创建的 Layer 1 区块链：

- **Move 语言**：专为数字资产设计的安全智能合约语言
- **Block-STM 并行引擎**：支持并行交易执行，TPS 达 160,000+
- **强大融资背景**：超过 4 亿美元融资（a16z、FTX、Binance Labs 等）
- **主网已上线**：2022 年 10 月上线，生态快速发展

**开发者激励计划**：
Aptos 基金会提供多种激励，鼓励开发者在 Aptos 上构建应用：
- **Grant 资助**：资金支持优质项目
- **代币奖励**：APT 代币奖励开发者贡献
- **技术支持**：官方团队提供技术指导
- **生态曝光**：官方渠道推广优秀项目

### 为什么参与 Aptos 开发者计划？

1. **高额奖励**：优质项目可获得 5 万 - 50 万美元资助
2. **技术前沿**：学习 Move 语言，掌握下一代区块链技术
3. **生态红利**：Aptos 生态处于早期，竞争少、机会多
4. **长期价值**：成为 Move 生态核心开发者，获得持续收益

**成功案例**：
- **Pontem Network**：Aptos 早期 DeFi 项目，获得数百万美元融资
- **Thala Labs**：Aptos 稳定币协议，获得基金会资助和代币奖励
- **早期开发者**：许多开发者通过贡献获得 10,000+ APT（价值数万美元）

---

## 📋 准备工作（2-3 天）

### 第一步：学习 Move 语言基础

**为什么 Move 很重要**？
- Move 是专为区块链设计的语言，比 Solidity 更安全
- 资源类型（Resource）确保数字资产不能被复制或丢失
- 形式验证（Formal Verification）可证明代码正确性

**学习资源**：

1. **官方文档**（必读）
   - Aptos 开发者文档：https://aptos.dev/
   - Move Book：https://move-book.com/
   - Move 语言参考：https://github.com/move-language/move

2. **视频教程**
   - YouTube 搜索"Aptos Move Tutorial"
   - Aptos 官方 Workshop 录播

3. **交互式学习**
   - Move 在线编辑器：https://www.movebit.xyz/
   - Aptos 示例代码：https://github.com/aptos-labs/aptos-core/tree/main/aptos-move/move-examples

**学习路线图**（1-2 周）：
1. **第 1-3 天**：了解 Move 基础语法（变量、函数、结构体）
2. **第 4-7 天**：学习资源（Resource）和能力（Abilities）概念
3. **第 8-14 天**：编写简单合约（如 Counter、Token）

### 第二步：设置开发环境

**安装 Aptos CLI**

1. **MacOS/Linux**：
   \`\`\`bash
   curl -fsSL "https://aptos.dev/scripts/install_cli.py" | python3
   \`\`\`

2. **验证安装**：
   \`\`\`bash
   aptos --version
   \`\`\`

3. **初始化账号**：
   \`\`\`bash
   aptos init
   \`\`\`
   - 选择网络：\`testnet\`
   - 会生成私钥和公钥

**安装开发工具**

1. **VS Code**（推荐）
   - 安装 Move Analyzer 扩展
   - 语法高亮和代码补全

2. **Aptos Wallet**
   - 安装 Petra Wallet：https://petra.app/
   - 或 Martian Wallet：https://martianwallet.xyz/
   - 切换到 Testnet

**领取测试币**

1. 使用 CLI：
   \`\`\`bash
   aptos account fund-with-faucet --account <your-address>
   \`\`\`

2. 或访问官方水龙头：https://aptoslabs.com/testnet-faucet

### 第三步：了解激励计划类型

**Aptos 基金会提供的激励**：

1. **Aptos Grant Program**
   - 资助金额：1 万 - 100 万美元
   - 申请链接：https://aptosfoundation.org/grants
   - 适合：有完整项目计划的团队

2. **Builder Program**
   - 小额快速资助（5000 - 50000 美元）
   - 适合：早期项目和个人开发者

3. **Bug Bounty**
   - 发现安全漏洞可获得奖励
   - 最高 100 万美元（关键漏洞）

4. **Ecosystem Incentives**
   - 生态项目代币奖励
   - 通过贡献代码、工具、文档获得 APT

5. **Hackathon**
   - 定期举办黑客松活动
   - 获奖项目获得资金和曝光

---

## 🚀 4 周开发者成长路径

### 第 1 周：Hello World 和基础合约

**任务 1：部署第一个 Move 合约**

创建 Hello World 合约：

1. **创建项目**：
   \`\`\`bash
   aptos move init --name hello_world
   cd hello_world
   \`\`\`

2. **编写合约**（在 \`sources/hello.move\`）：
   \`\`\`move
   module hello_world::message {
       use std::string;
       use std::signer;
       use aptos_framework::account;

       struct MessageHolder has key {
           message: string::String,
       }

       public entry fun set_message(account: &signer, message: string::String) acquires MessageHolder {
           let addr = signer::address_of(account);
           if (!exists<MessageHolder>(addr)) {
               move_to(account, MessageHolder { message });
           } else {
               let old_message_holder = borrow_global_mut<MessageHolder>(addr);
               old_message_holder.message = message;
           }
       }

       #[view]
       public fun get_message(addr: address): string::String acquires MessageHolder {
           borrow_global<MessageHolder>(addr).message
       }
   }
   \`\`\`

3. **编译合约**：
   \`\`\`bash
   aptos move compile
   \`\`\`

4. **部署到测试网**：
   \`\`\`bash
   aptos move publish
   \`\`\`

5. **调用合约**：
   \`\`\`bash
   aptos move run --function-id <your-address>::message::set_message --args string:"Hello Aptos!"
   \`\`\`

**任务 2：实现 Counter 合约**

创建一个计数器：

1. 功能：增加、减少、重置计数
2. 学习：如何存储和修改状态
3. 部署并测试

**任务 3：创建简单 Token**

使用 Aptos Token Standard：

1. 学习 Aptos Token 框架
2. 创建 Fungible Asset（可替代代币）
3. 实现 Mint、Transfer 功能

### 第 2 周：中级项目开发

**任务 4：构建 NFT 合约**

创建 NFT 集合：

1. **使用 Aptos Token Objects**
2. **功能实现**：
   - 铸造 NFT
   - 转移 NFT
   - 设置 Royalty（版税）
   - 元数据管理

3. **部署并铸造测试 NFT**

**任务 5：开发简单 DeFi 模块**

选择一个方向：

1. **Simple Swap**
   - 实现两个代币的兑换
   - 学习流动性池概念

2. **Staking 合约**
   - 质押代币赚取奖励
   - 计算 APY 和奖励分配

3. **Escrow 合约**
   - 第三方托管服务
   - 学习安全模式

**任务 6：编写测试用例**

为合约编写测试：

1. 使用 Aptos Move 测试框架
2. 编写单元测试（Unit Tests）
3. 运行测试：
   \`\`\`bash
   aptos move test
   \`\`\`

### 第 3 周：完整项目和提交

**任务 7：开发完整 DApp**

选择项目类型：

1. **DeFi 应用**
   - 借贷平台
   - DEX 聚合器
   - 收益优化器

2. **NFT 应用**
   - NFT 市场
   - NFT Launchpad
   - 链上游戏

3. **工具/基础设施**
   - 钱包工具
   - 数据索引器
   - 开发者工具

4. **其他创新**
   - 社交应用
   - DID（去中心化身份）
   - DAO 工具

**项目要求**：
- 有明确的用户价值
- 代码质量高，有测试
- 文档完整
- 有前端界面（可选但加分）

**任务 8：前端集成**

如果项目需要前端：

1. **使用 Aptos SDK**
   - JavaScript/TypeScript SDK：https://github.com/aptos-labs/aptos-ts-sdk
   - React 集成示例

2. **连接钱包**
   - 集成 Petra / Martian Wallet
   - 实现交易签名

3. **部署前端**
   - 使用 Vercel/Netlify 部署
   - 提供测试链接

**任务 9：申请 Grant**

准备 Grant 申请材料：

1. **项目提案**（Proposal）
   - 项目概述和愿景
   - 技术架构
   - 市场分析
   - 团队介绍

2. **Roadmap**
   - 项目里程碑
   - 时间规划
   - 资金使用计划

3. **Demo**
   - 测试网部署链接
   - 视频演示（可选）

4. **提交申请**
   - 访问：https://aptosfoundation.org/grants
   - 填写申请表
   - 附上 GitHub 链接

### 第 4 周：社区参与和持续贡献

**任务 10：开源贡献**

贡献到 Aptos 生态：

1. **核心代码贡献**
   - Aptos Core 仓库：https://github.com/aptos-labs/aptos-core
   - 修复 Bug、添加功能

2. **文档贡献**
   - 改进官方文档
   - 翻译成其他语言（如中文）

3. **工具开发**
   - 开发者工具
   - SDK 改进
   - 示例代码

**任务 11：参与 Hackathon**

Aptos 定期举办黑客松：

1. **关注官方公告**
   - Twitter：@Aptos_Network
   - Discord：https://discord.gg/aptosnetwork

2. **组队参赛**
   - 寻找队友（开发、设计、运营）
   - 48-72 小时开发完整项目

3. **奖项丰厚**
   - 一等奖通常 5-10 万美元
   - 获奖项目通常获得后续资助

**任务 12：成为社区 Leader**

建立影响力：

1. **Discord 活跃**
   - 回答新人问题
   - 分享开发经验

2. **内容创作**
   - 写 Move 语言教程
   - 制作开发视频
   - 翻译官方文档

3. **申请 Ambassador**
   - Aptos Ambassador 计划
   - 获得官方认证和额外奖励

---

## 💰 成本与收益

### 成本

| 项目 | 金额 |
|------|------|
| 资金成本 | 0 美元（测试网） |
| 时间成本 | 80-200 小时（1-3 个月） |
| 学习成本 | 高（需学习 Move 语言） |

### 潜在收益

**开发者奖励**：

| 贡献类型 | 预期收益 |
|---------|---------|
| 开源贡献（Bug 修复、文档） | 500-5000 美元 |
| 工具/SDK 开发 | 5000-50000 美元 |
| 完整 DApp（Grant） | 50000-500000 美元 |
| Hackathon 获奖 | 10000-100000 美元 |
| Bug Bounty（严重漏洞） | 最高 1000000 美元 |

**长期价值**：
- 成为 Move 生态核心开发者
- 获得后续项目融资机会
- 建立个人品牌和影响力

---

## ⚠️ 风险与注意事项

### 主要挑战

1. **技术门槛高**
   - Move 语言学习曲线陡峭
   - 需要扎实的编程基础
   - 建议先学习 Rust（Move 借鉴了 Rust）

2. **时间投入大**
   - 学习 Move：2-4 周
   - 开发项目：1-3 个月
   - 不适合兼职参与（除非已有编程经验）

3. **竞争激烈**
   - 优质项目竞争 Grant
   - 需要有创新点和完整实现

### 成功关键

- ✅ **扎实学习 Move**：不要急于求成，打好基础
- ✅ **选对项目方向**：找到生态需求但竞争少的方向
- ✅ **代码质量**：注重测试、文档、安全性
- ✅ **社区参与**：多在 Discord 交流，获取反馈

---

## 📊 进度追踪清单

### 第 1 周
- [ ] 学习 Move 语言基础
- [ ] 安装 Aptos CLI 和开发工具
- [ ] 部署 Hello World 合约
- [ ] 完成 Counter 和 Token 合约

### 第 2 周
- [ ] 开发 NFT 合约
- [ ] 实现简单 DeFi 模块
- [ ] 编写测试用例
- [ ] 在测试网部署所有合约

### 第 3 周
- [ ] 确定完整项目方向
- [ ] 开发核心功能
- [ ] 前端集成（如需要）
- [ ] 准备 Grant 申请材料

### 第 4 周
- [ ] 提交 Grant 申请
- [ ] 参与开源贡献
- [ ] 关注 Hackathon 机会
- [ ] 在社区建立影响力

---

## ❓ 常见问题

**Q1：我没有编程基础，能参与吗？**
> 不建议。Aptos 开发者计划适合有编程经验的人。如果你是编程新手，建议先学习基础编程（Python/JavaScript），再学习 Move。

**Q2：Move 难学吗？和 Solidity 比呢？**
> Move 的概念更先进但学习曲线陡峭。如果你熟悉 Rust，学 Move 会容易很多。相比 Solidity，Move 更安全但初期更难上手。

**Q3：一定要申请 Grant 吗？**
> 不一定。你可以通过开源贡献、Bug Bounty、Hackathon 等方式获得奖励。Grant 适合有完整项目计划的团队。

**Q4：需要组队吗？**
> 看项目规模。简单工具可以独立完成，复杂 DApp 建议组队（前端+后端+合约开发）。

**Q5：Aptos 和 Sui 都是 Move，该选哪个？**
> 两个都学！Move 是通用的，你的代码可以轻松迁移。建议先深入一个链，再横向扩展到另一个。

---

## 🎓 总结

**Aptos 开发者计划的价值**：
1. **高额奖励**：Grant 和 Hackathon 奖金丰厚
2. **技术前沿**：学习 Move 语言，掌握未来技术
3. **生态红利**：早期开发者获得长期收益
4. **职业发展**：成为稀缺的 Move 开发者

**成功路径**：
1. **扎实学习**（2-4 周）：Move 语言基础
2. **动手实践**（2-4 周）：从简单到复杂项目
3. **申请资助**（1-2 周）：准备 Grant 申请
4. **持续贡献**（长期）：开源、社区、新项目

Aptos 开发者计划是普通程序员进入 Web3 核心领域的最佳机会之一！`,

  steps: [
    { step_number: 1, title: '学习 Move 语言基础', description: '学习 Move 语法、资源类型、能力系统，完成示例代码。', estimated_time: '1-2 周' },
    { step_number: 2, title: '设置开发环境', description: '安装 Aptos CLI、开发工具、钱包，领取测试币。', estimated_time: '2-3 天' },
    { step_number: 3, title: '开发基础合约（第 1 周）', description: '部署 Hello World、Counter、Token 等简单合约。', estimated_time: '1 周' },
    { step_number: 4, title: '中级项目开发（第 2 周）', description: '开发 NFT、DeFi 模块、编写测试用例。', estimated_time: '1 周' },
    { step_number: 5, title: '完整项目和申请（第 3-4 周）', description: '开发完整 DApp、准备 Grant 申请、社区参与、持续贡献。', estimated_time: '2 周+' },
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
    const strategies = [STRATEGY_3_5, STRATEGY_3_6];

    console.log('\n开始创建 3.5 和 3.6 策略...\n');

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
