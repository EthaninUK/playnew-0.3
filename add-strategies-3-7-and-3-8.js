const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

// ===== 3.7 Faucet 测试币批量获取 =====
const STRATEGY_3_7 = {
  title: 'Faucet 测试币批量获取 - 多链测试网资产积累策略',
  slug: 'faucet-testnet-token-batch-claiming',
  summary: '使用多个钱包地址在测试网水龙头（Faucet）领取测试币，为批量交互做准备，最大化测试网收益。',

  category: 'testnet',
  category_l1: 'airdrop',
  category_l2: '测试网&早鸟',

  difficulty_level: 1,
  risk_level: 1,

  apy_min: 0,
  apy_max: 0,
  threshold_capital: '0 美元（测试网）',
  threshold_capital_min: 0,
  time_commitment: '每天 30-60 分钟',
  time_commitment_minutes: 45,
  threshold_tech_level: 'beginner',

  content: `> **适合人群**：测试网参与者、空投猎人、想批量操作的玩家
> **阅读时间**：约 10 分钟
> **关键词**：Faucet / 测试币 / 多钱包 / 批量领取 / 测试网

---

## 🎯 什么是测试网 Faucet？

### 基础概念

**Faucet（水龙头）** 是区块链测试网提供的免费测试币发放服务：

- **目的**：让开发者和用户免费获得测试币，用于测试网交互
- **机制**：每个地址定期可以领取一定数量的测试币
- **限制**：通常有时间间隔（如 24 小时）和单次领取上限
- **验证**：部分 Faucet 需要社交账号验证（防止滥用）

### 为什么要批量获取测试币？

1. **多地址策略**
   - 测试网空投通常按地址发放，不是按人
   - 多个钱包可以获得多份空投
   - 提高中奖概率和收益上限

2. **备用资金池**
   - 测试网交互需要大量 Gas
   - 一个地址测试币用完，可从其他地址转入
   - 避免等待 Faucet 冷却时间

3. **分散风险**
   - 测试网可能清零或重置
   - 多地址可分散风险
   - 部分地址可能被标记为女巫，其他地址不受影响

4. **批量交互**
   - 执行批量交互任务时需要多个地址
   - 提高效率和活跃度

**警告**：
- 女巫攻击（Sybil Attack）被项目方严厉打击
- 但合理的多钱包策略（如 2-5 个）通常是安全的
- 关键是让每个地址看起来像"真人"使用

---

## 📋 准备工作（1 小时）

### 第一步：创建多个钱包地址

**推荐数量**：3-5 个地址

**为什么不建议太多**？
- 超过 10 个地址容易被识别为女巫
- 管理成本高（记不住私钥）
- 交互质量下降（每个地址交互次数少）

**创建方法**：

**方法 1：使用一个助记词的多个地址**

大多数钱包支持 HD（分层确定性）钱包：
- 一个助记词可生成无数个地址
- MetaMask：创建钱包后，点击"创建账户"
- Rabby Wallet：更方便管理多地址

优点：
- 只需备份一个助记词
- 管理方便

缺点：
- 所有地址在链上可能被关联（因为来自同一助记词）
- 部分项目方会识别 HD 钱包的关联地址

**方法 2：创建多个独立助记词**

每个钱包都是独立的：
- 每个地址有独立的助记词
- 在链上完全独立，无法关联

优点：
- 完全独立，女巫检测难度大

缺点：
- 需要备份多个助记词
- 管理复杂

**推荐策略**：
- 创建 3-5 个独立助记词钱包
- 每个助记词下可以再派生 1-2 个地址
- 总共 3-10 个地址，平衡效率和安全

### 第二步：选择目标测试网

**高价值测试网**（优先级排序）：

1. **Berachain Artio**
   - 估值：15 亿美元
   - 融资：顶级 VC 支持
   - 空投预期：极高

2. **Monad Testnet**
   - 估值：30 亿美元
   - 融资：2.44 亿美元
   - 需要白名单，但非常值得

3. **Linea Testnet**
   - ConsenSys（MetaMask 母公司）出品
   - 有积分系统（LXP）
   - 空投概率高

4. **Scroll Testnet**
   - zkEVM 技术
   - 有 Scroll Marks 积分
   - 主网已上线，但测试网仍有价值

5. **Base Testnet**
   - Coinbase 推出的 L2
   - 生态快速增长
   - 虽已主网，但测试网仍用于新功能

6. **Fuel Testnet**
   - 模块化执行层
   - 融资：8000 万美元
   - 早期测试网，潜力大

7. **Starknet Testnet**
   - 主网已上线，但测试网用于新功能
   - Cairo 语言生态

8. **zkSync Era Testnet**
   - 已主网，但测试网仍活跃
   - ZK Rollup 龙头

**其他测试网**（可选）：
- Polygon zkEVM Testnet
- Arbitrum Sepolia
- Optimism Goerli
- Avalanche Fuji
- Fantom Testnet
- BNB Chain Testnet

### 第三步：准备自动化工具（可选）

**手动 vs 自动化**：

- **手动操作**：适合 3-5 个地址，每天花 30 分钟
- **半自动化**：使用脚本辅助，提高效率
- **全自动化**：风险高，容易被识别为机器人

**工具推荐**：

1. **多钱包管理器**
   - **Rabby Wallet**：最好的多地址管理
   - **Frame**：桌面多钱包管理器

2. **密码管理器**
   - **1Password / Bitwarden**：安全存储助记词和密码
   - 不要用明文文件存储！

3. **浏览器配置文件**
   - Chrome / Firefox 多配置文件
   - 每个配置文件一个钱包
   - 避免浏览器指纹关联

---

## 🚀 批量领取策略（每日 30-60 分钟）

### 核心原则

**让每个地址看起来像"真人"**：

1. **不同时间领取**
   - 不要在同一分钟内多个地址领取
   - 间隔 10-30 分钟

2. **不同行为模式**
   - 有的地址每天领取，有的隔天
   - 有的地址领取后立即交互，有的等待几小时

3. **不同 IP 地址（可选）**
   - 使用不同网络（家里 WiFi、手机热点、咖啡馆）
   - 或使用 VPN（但注意合规性）

4. **真实交互**
   - 不要只领取不交互
   - 每个地址都要有真实的 DApp 使用记录

### 第 1 周：建立领取节奏

**每日流程**：

**早上（8-10 点）**：
1. 打开第一个钱包
2. 领取 Berachain 测试币
3. 领取 Linea 测试币
4. 简单交互（1-2 笔交易）

**中午（12-14 点）**：
1. 切换第二个钱包
2. 领取 Scroll 测试币
3. 领取 Base 测试币
4. 简单交互

**晚上（19-21 点）**：
1. 切换第三个钱包
2. 领取剩余测试网代币
3. 完成今日交互任务

**周末**：
- 可以跳过 1-2 个地址（模拟真人行为）
- 或只领取不交互

### 第 2 周：扩大测试网覆盖

**增加测试网数量**：

将每个钱包扩展到 5-8 个测试网：
1. Berachain
2. Linea
3. Scroll
4. Base
5. Fuel
6. Starknet
7. zkSync Era
8. Polygon zkEVM

**时间分配**：
- 每个测试网 3-5 分钟（领取+简单交互）
- 每个钱包 30-40 分钟
- 3 个钱包轮流，分散在全天

### 第 3 周：优化和自动化

**批量领取脚本（谨慎使用）**

如果你懂编程，可以写简单脚本：

\`\`\`javascript
// 示例：批量领取 Berachain 测试币（仅供参考）
// 注意：使用脚本有风险，建议手动操作

const axios = require('axios');

const FAUCET_URL = 'https://artio.faucet.berachain.com/api/claim';
const addresses = [
  '0x你的地址1',
  '0x你的地址2',
  '0x你的地址3',
];

async function claimFaucet(address) {
  try {
    await axios.post(FAUCET_URL, { address });
    console.log(\`✅ \${address} 领取成功\`);
  } catch (error) {
    console.log(\`❌ \${address} 领取失败\`);
  }
}

async function main() {
  for (const address of addresses) {
    await claimFaucet(address);
    // 间隔 10-30 分钟
    await new Promise(r => setTimeout(r, 600000 + Math.random() * 1200000));
  }
}

main();
\`\`\`

**注意**：
- 仅用于学习，实际使用风险自负
- 大部分 Faucet 有验证机制（如 Captcha、社交账号）
- 脚本可能被识别为机器人

**更安全的方法**：
- 使用浏览器书签快速切换 Faucet 页面
- 使用密码管理器自动填充地址
- 手动点击领取（最安全）

### 第 4 周：维护和调整

**记录和追踪**：

创建简单的 Excel 表格：

| 钱包地址 | Berachain | Linea | Scroll | Base | 最后领取时间 | 备注 |
|---------|----------|-------|--------|------|------------|------|
| 0x123... | 15 BERA | 2 ETH | 3 ETH | 1 ETH | 2024-01-15 | 主力钱包 |
| 0x456... | 10 BERA | 1 ETH | 2 ETH | 0.5 ETH | 2024-01-14 | 备用 |

**调整策略**：
- 观察哪些测试网用得快，哪些用得慢
- 部分地址可以暂停领取（模拟真人）
- 专注于高价值测试网

---

## 💰 成本与收益

### 成本

| 项目 | 金额 |
|------|------|
| 资金成本 | 0 美元（测试网） |
| 时间成本 | 每天 30-60 分钟 |
| 工具成本 | 0 美元（可选 VPN：5-10 美元/月） |

### 潜在收益

**按地址数量预估**：

| 地址数量 | 保守估计（每地址） | 乐观估计（每地址） | 总收益 |
|---------|------------------|------------------|--------|
| 3 个 | 500 美元 | 2000 美元 | 1500-6000 美元 |
| 5 个 | 500 美元 | 2000 美元 | 2500-10000 美元 |
| 10 个 | 300 美元 | 1000 美元 | 3000-10000 美元 |

**说明**：
- 地址越多，单地址权重可能降低（女巫检测）
- 3-5 个地址是最佳平衡点
- 收益取决于测试网项目的空投规模

---

## ⚠️ 风险与注意事项

### 女巫检测风险

**项目方如何识别女巫**：

1. **地址关联**
   - 同一助记词派生的地址
   - 资金往来频繁的地址

2. **行为模式**
   - 所有地址在同一时间操作
   - 交易金额、Gas 价格完全相同
   - 操作顺序一模一样

3. **链上指纹**
   - 使用相同的 DApp
   - 交互时间间隔规律
   - 交易哈希连续

4. **浏览器指纹**
   - 同一 IP 地址
   - 同一浏览器 User-Agent
   - Cookie 和缓存

**如何避免被识别**：

- ✅ 每个地址行为差异化
- ✅ 不同时间操作
- ✅ 金额和 Gas 随机化
- ✅ 使用不同网络（家、公司、手机热点）
- ✅ 真实交互，不只是刷量

### 合理使用原则

**安全边界**：
- 3-5 个地址：安全
- 5-10 个地址：中等风险（需要高质量交互）
- 10+ 个地址：高风险（容易被识别）

**测试网规则**：
- 遵守 Faucet 使用规则
- 不要暴力刷取（如每分钟请求）
- 不要分享你的多地址策略

---

## 📊 进度追踪清单

### 准备阶段
- [ ] 创建 3-5 个独立钱包
- [ ] 安装多钱包管理工具（如 Rabby）
- [ ] 创建密码管理器，安全存储助记词

### 第 1 周
- [ ] 每个地址领取 Berachain 测试币
- [ ] 每个地址领取 Linea 测试币
- [ ] 建立每日领取节奏

### 第 2 周
- [ ] 扩展到 5-8 个测试网
- [ ] 每个地址在各测试网完成简单交互
- [ ] 记录每个地址的测试币余额

### 第 3-4 周
- [ ] 优化领取流程（书签、密码管理器）
- [ ] 调整策略（专注高价值测试网）
- [ ] 确保每个地址有真实交互记录

---

## ❓ 常见问题

**Q1：多个地址会被识别为女巫吗？**
> 3-5 个地址 + 真实交互 + 行为差异化 = 安全。关键是让每个地址看起来像真人使用。

**Q2：需要使用 VPN 吗？**
> 不是必须，但有帮助。可以在不同网络下操作（家里、公司、手机热点）来分散 IP。

**Q3：可以用脚本自动化吗？**
> 不建议。大部分 Faucet 有验证机制（Captcha、社交账号），脚本容易被识别。手动最安全。

**Q4：测试币可以卖吗？**
> 不能。测试币没有价值，只能用于测试网。主网上线后才有机会获得真实代币空投。

**Q5：需要每天都领取吗？**
> 不需要。可以 2-3 天领取一次，模拟真人行为。但不要让测试币用完（无法交互）。

---

## 🎓 总结

**Faucet 批量获取的价值**：
1. **多地址策略**：提高空投收益上限
2. **备用资金池**：保证持续交互能力
3. **分散风险**：避免单点失败
4. **效率提升**：批量操作节省时间

**成功关键**：
1. **合理数量**：3-5 个地址最佳
2. **差异化行为**：每个地址像真人
3. **真实交互**：不只是领取，要使用
4. **长期坚持**：测试网通常持续数月

Faucet 批量获取是测试网策略的基础，但记住：**质量 > 数量**，真实交互比刷量更重要！`,

  steps: [
    { step_number: 1, title: '准备工作', description: '创建 3-5 个独立钱包，选择高价值测试网，安装管理工具。', estimated_time: '1 小时' },
    { step_number: 2, title: '建立领取节奏（第 1 周）', description: '每日在不同时间为各地址领取测试币，建立习惯。', estimated_time: '每天 30 分钟' },
    { step_number: 3, title: '扩大测试网覆盖（第 2 周）', description: '将每个钱包扩展到 5-8 个测试网，保持真实交互。', estimated_time: '每天 45 分钟' },
    { step_number: 4, title: '优化流程（第 3 周）', description: '使用工具提高效率，调整策略，专注高价值测试网。', estimated_time: '每天 30 分钟' },
    { step_number: 5, title: '维护和调整（第 4 周+）', description: '记录追踪各地址状态，长期保持活跃，确保真实交互。', estimated_time: '每天 30 分钟' },
  ],
};

// ===== 3.8 测试网 Bug 赏金计划 =====
const STRATEGY_3_8 = {
  title: '测试网 Bug 赏金计划 - 漏洞发现获取高额奖励',
  slug: 'testnet-bug-bounty-program',
  summary: '参与项目方的测试网 Bug 赏金计划，提交有效的漏洞报告，赚取赏金和额外空投权重，成为安全贡献者。',

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

  content: `> **适合人群**：安全研究员、有技术基础的开发者、细心的测试者
> **阅读时间**：约 12 分钟
> **关键词**：Bug Bounty / 漏洞赏金 / 测试网 / 安全研究 / 白帽黑客

---

## 🎯 什么是测试网 Bug 赏金计划？

### 基础概念

**Bug Bounty（漏洞赏金）** 是项目方为发现和报告安全漏洞而提供的奖励机制：

- **目的**：在主网上线前发现和修复安全漏洞
- **奖励**：根据漏洞严重程度支付现金或代币
- **参与者**：安全研究员、开发者、白帽黑客
- **平台**：Immunefi、HackerOne、Bugcrowd 等

**测试网 Bug Bounty 的特点**：
- 奖励比主网低，但竞争也少
- 更容易发现问题（代码新、测试不充分）
- 除了赏金，还可能获得额外空投权重
- 是成为项目"OG 贡献者"的最佳途径

### 漏洞类型和严重程度

**常见漏洞分类**：

1. **关键漏洞（Critical）**
   - 智能合约可被盗空
   - 私钥泄露
   - 共识层攻击
   - 奖励：10,000 - 1,000,000 美元

2. **高危漏洞（High）**
   - 资金损失（但有限制条件）
   - 权限提升
   - DOS 攻击
   - 奖励：5,000 - 50,000 美元

3. **中危漏洞（Medium）**
   - 功能异常
   - 数据泄露（非敏感）
   - 前端漏洞
   - 奖励：1,000 - 10,000 美元

4. **低危漏洞（Low）**
   - UI/UX 问题
   - 文档错误
   - 性能问题
   - 奖励：100 - 1,000 美元

5. **信息性（Informational）**
   - 代码优化建议
   - 最佳实践建议
   - 奖励：0 - 500 美元（或感谢）

### 为什么参与测试网 Bug Bounty？

1. **高额奖励**
   - 关键漏洞可获得数万甚至数十万美元
   - 即使是低危漏洞也有数百美元

2. **空投加成**
   - 安全贡献者通常被标记为"高价值用户"
   - 主网空投时可能获得额外权重

3. **建立声誉**
   - 在安全社区建立个人品牌
   - 获得项目方认可和未来合作机会

4. **学习安全知识**
   - 深入了解区块链安全
   - 提升智能合约审计能力

5. **早期发现漏洞容易**
   - 测试网代码新，测试不充分
   - 竞争相对主网少

---

## 📋 准备工作（1-2 周）

### 第一步：学习区块链安全基础

**必备知识**：

1. **智能合约漏洞**
   - 重入攻击（Reentrancy）
   - 整数溢出/下溢（Integer Overflow/Underflow）
   - 权限控制不当（Access Control）
   - 前端运行（Front-Running）
   - 随机数可预测（Weak Randomness）

2. **共识层漏洞**
   - 双花攻击（Double Spending）
   - 51% 攻击
   - 时间戳依赖

3. **应用层漏洞**
   - SQL 注入
   - XSS 跨站脚本
   - CSRF 跨站请求伪造

**学习资源**：

1. **免费课程**
   - Ethernaut（智能合约安全挑战）：https://ethernaut.openzeppelin.com/
   - Damn Vulnerable DeFi：https://www.damnvulnerabledefi.xyz/
   - CryptoZombies：https://cryptozombies.io/

2. **书籍**
   - 《精通以太坊》（Mastering Ethereum）
   - 《区块链安全实战》

3. **文章和博客**
   - Consensys Smart Contract Best Practices
   - OpenZeppelin 安全指南
   - Trail of Bits 博客

### 第二步：熟悉测试工具

**必备工具**：

1. **静态分析工具**
   - **Slither**：Solidity 静态分析器
   - **Mythril**：符号执行和污点分析
   - **Securify**：自动化安全分析

2. **动态测试工具**
   - **Hardhat**：智能合约测试框架
   - **Foundry**：快速测试和模糊测试
   - **Echidna**：模糊测试工具

3. **区块链浏览器**
   - Etherscan、Blockscout（查看合约代码）

4. **调试工具**
   - Tenderly（交易模拟和调试）
   - Remix IDE（在线 Solidity IDE）

**工具安装示例**：

\`\`\`bash
# 安装 Slither
pip3 install slither-analyzer

# 安装 Mythril
pip3 install mythril

# 安装 Hardhat
npm install --save-dev hardhat

# 安装 Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup
\`\`\`

### 第三步：了解 Bug Bounty 平台

**主要平台**：

1. **Immunefi**（加密货币专用）
   - 网站：https://immunefi.com/
   - 覆盖：DeFi、L1/L2、钱包等
   - 赏金最高：数百万美元

2. **HackerOne**（通用平台）
   - 网站：https://hackerone.com/
   - 部分加密项目使用

3. **Bugcrowd**
   - 网站：https://bugcrowd.com/
   - 部分加密项目使用

4. **项目自建平台**
   - 许多项目在 GitHub 或官网发布 Bug Bounty 规则

**注册和准备**：
1. 在 Immunefi 注册账号
2. 完成 KYC（部分平台需要）
3. 阅读"Responsible Disclosure"（负责任披露）指南
4. 准备报告模板

---

## 🚀 Bug Bounty 实战策略

### 第 1 阶段：选择目标项目（1-3 天）

**优先级排序**：

1. **高融资 + 早期测试网**
   - Monad、Berachain、Fuel 等
   - 代码新，漏洞多
   - 奖励高

2. **新上线的 L2/L1**
   - Base、Linea、Scroll 等
   - 测试网活跃
   - 赏金计划明确

3. **DeFi 协议测试网**
   - 新 DEX、借贷协议
   - 合约逻辑复杂，容易有漏洞

4. **跨链桥测试网**
   - 跨链桥是高危目标
   - 历史上多次被攻击
   - 赏金极高

**查找 Bug Bounty 项目**：

1. Immunefi 首页浏览"Testnet"类别
2. Twitter 搜索"Bug Bounty Testnet"
3. Discord 加入项目测试网频道
4. GitHub 搜索"security.md"或"bug-bounty.md"

### 第 2 阶段：漏洞挖掘（每周 5-10 小时）

**方法 1：智能合约审计**

1. **获取合约代码**
   - 在区块浏览器找到合约地址
   - 下载已验证的合约源代码
   - 克隆项目 GitHub 仓库

2. **静态分析**
   \`\`\`bash
   # 使用 Slither 扫描
   slither . --detect all

   # 使用 Mythril 分析
   myth analyze <contract.sol>
   \`\`\`

3. **手动审计**
   - 检查权限控制（\`onlyOwner\` 是否正确）
   - 查找重入漏洞（外部调用后状态更新）
   - 检查整数溢出（Solidity 0.8.0 前）
   - 验证输入检查（是否有参数验证）

4. **编写 PoC（概念验证）**
   - 使用 Hardhat/Foundry 编写测试
   - 复现漏洞
   - 证明可利用性

**方法 2：应用层测试**

1. **前端漏洞**
   - XSS 测试（输入框注入脚本）
   - CSRF 测试（跨站请求）
   - 钱包连接漏洞

2. **API 漏洞**
   - 未授权访问
   - 参数篡改
   - SQL 注入（如有后端数据库）

3. **逻辑漏洞**
   - 业务流程绕过
   - 状态机异常
   - 竞态条件

**方法 3：模糊测试**

使用自动化工具发现边缘情况：

\`\`\`javascript
// Foundry 模糊测试示例
function testFuzz_deposit(uint256 amount) public {
    // 测试任意金额存款
    vm.assume(amount > 0 && amount < type(uint256).max);
    vault.deposit(amount);
    assertEq(vault.balanceOf(address(this)), amount);
}
\`\`\`

**方法 4：压力测试**

测试网性能和稳定性：

1. **高并发测试**
   - 大量交易同时发送
   - 观察网络是否崩溃

2. **大额交易测试**
   - 尝试极端金额（如 type(uint256).max）
   - 测试边界条件

3. **DOS 攻击测试**
   - 尝试使合约 Gas 耗尽
   - 测试是否能阻塞网络

### 第 3 阶段：撰写报告（2-4 小时）

**优秀报告结构**：

\`\`\`markdown
# 漏洞报告：[项目名] 重入攻击漏洞

## 摘要
在 [合约名称] 合约中发现重入攻击漏洞，攻击者可以耗尽合约资金。

## 严重程度
关键（Critical）

## 漏洞描述
[详细描述漏洞原理]

## 影响范围
- 所有用户资金可被盗
- 预估损失：[金额]

## 复现步骤
1. 部署攻击合约
2. 调用 [函数名]
3. 观察资金被转移

## 概念验证（PoC）
[附上代码或交易哈希]

## 建议修复方案
1. 使用 ReentrancyGuard
2. 状态更新前移
3. 使用 Checks-Effects-Interactions 模式

## 附件
- PoC 代码：[GitHub Gist 链接]
- 测试交易：[Etherscan 链接]
\`\`\`

**报告要点**：
- ✅ 清晰描述漏洞
- ✅ 提供复现步骤
- ✅ 附上 PoC 代码
- ✅ 建议修复方案
- ✅ 礼貌专业的语气

### 第 4 阶段：提交和跟进（1-4 周）

**提交渠道**：

1. **Immunefi 平台**
   - 点击项目页面的"Submit Bug"
   - 填写表格，上传报告

2. **项目官方渠道**
   - 发送到 security@[project].com
   - 或在 GitHub 私密提交（Security Advisory）

3. **Discord 私信**
   - 联系项目安全负责人
   - 不要公开漏洞！

**负责任披露原则**：
- ⚠️ 不要公开未修复的漏洞
- ⚠️ 不要利用漏洞获利（即使测试网）
- ⚠️ 给项目方合理修复时间（通常 90 天）
- ✅ 修复后可公开（获得声誉）

**跟进流程**：
1. **提交后 48 小时**：项目方确认收到
2. **1-2 周**：项目方评估严重性
3. **2-4 周**：修复并支付赏金
4. **修复后**：可公开披露（可选）

---

## 💰 成本与收益

### 成本

| 项目 | 金额 |
|------|------|
| 资金成本 | 0 美元（测试网） |
| 时间成本 | 每周 5-10 小时 |
| 学习成本 | 高（需学习安全知识） |

### 潜在收益

**按漏洞类型**：

| 漏洞严重程度 | 奖励范围 | 发现难度 |
|------------|---------|----------|
| 关键（Critical） | 10,000 - 1,000,000 美元 | 极难 |
| 高危（High） | 5,000 - 50,000 美元 | 难 |
| 中危（Medium） | 1,000 - 10,000 美元 | 中等 |
| 低危（Low） | 100 - 1,000 美元 | 容易 |

**测试网 Bug Bounty 特点**：
- 奖励比主网低 50-80%
- 但竞争也少，更容易发现漏洞
- 附加价值：空投加成、OG 身份

**案例参考**：
- 某测试网发现关键漏洞：5 万美元 + 主网空投 2 万美元
- 某项目累计提交 10 个中低危漏洞：1 万美元 + 特殊贡献者 NFT

---

## ⚠️ 风险与注意事项

### 主要挑战

1. **技术门槛高**
   - 需要扎实的安全知识
   - 不适合编程新手

2. **时间投入大**
   - 审计一个合约需要数小时到数天
   - 可能找不到漏洞（白忙）

3. **法律风险**
   - 必须负责任披露
   - 不能利用漏洞（即使测试网）
   - 违规可能面临法律责任

4. **报告被拒风险**
   - 已知漏洞（别人先提交）
   - 严重性评估分歧
   - 不符合 Bounty 范围

### 成功关键

- ✅ **扎实的安全基础**：不要急于求成
- ✅ **选对目标**：早期测试网、复杂合约
- ✅ **高质量报告**：清晰、专业、有 PoC
- ✅ **负责任披露**：遵守道德规范

---

## 📊 进度追踪清单

### 准备阶段（1-2 周）
- [ ] 学习智能合约安全基础
- [ ] 完成 Ethernaut / Damn Vulnerable DeFi
- [ ] 安装测试工具（Slither、Mythril 等）
- [ ] 在 Immunefi 注册账号

### 第 1 个月
- [ ] 选择 3-5 个目标项目
- [ ] 审计至少 5 个智能合约
- [ ] 提交至少 1 个有效报告
- [ ] 学习优秀报告案例

### 第 2-3 个月
- [ ] 提交 3-5 个漏洞报告
- [ ] 获得第一笔赏金
- [ ] 建立个人安全研究档案
- [ ] 在社区分享经验

### 长期
- [ ] 成为项目安全贡献者
- [ ] 建立安全研究声誉
- [ ] 参与主网 Bug Bounty
- [ ] 考虑安全审计职业

---

## ❓ 常见问题

**Q1：我不是安全专家，能参与吗？**
> 可以从低危漏洞开始。前端问题、文档错误、性能问题等不需要深厚安全背景。逐步学习提升。

**Q2：测试网漏洞奖励会很少吗？**
> 通常是主网的 20-50%，但竞争也少。而且有附加价值（空投加成）。对新人是很好的练习。

**Q3：如何避免提交重复漏洞？**
> 提交前搜索项目 GitHub Issues 和 Immunefi，看是否已有相同报告。尽早提交（先到先得）。

**Q4：报告被拒怎么办？**
> 礼貌询问原因，学习改进。可以在其他项目再试。积累经验比单次成功更重要。

**Q5：需要公开身份吗？**
> 不需要。许多安全研究员使用匿名身份。但完成 KYC 后才能领取赏金。

---

## 🎓 总结

**测试网 Bug Bounty 的价值**：
1. **高额奖励**：单个漏洞可获数千到数十万美元
2. **空投加成**：安全贡献者通常获得额外权重
3. **技能提升**：学习区块链安全，提升职业竞争力
4. **建立声誉**：成为安全社区的知名贡献者

**成功路径**：
1. **扎实学习**（1-2 个月）：安全基础和工具
2. **实战练习**（2-3 个月）：审计测试网合约
3. **提交报告**（持续）：积累成功案例
4. **建立声誉**（长期）：成为专业安全研究员

测试网 Bug Bounty 是普通开发者进入安全领域、获得高额奖励的最佳途径之一！`,

  steps: [
    { step_number: 1, title: '学习安全基础', description: '学习智能合约漏洞类型、完成安全挑战、熟悉测试工具。', estimated_time: '1-2 周' },
    { step_number: 2, title: '选择目标项目', description: '在 Immunefi 等平台找测试网 Bug Bounty，优先高融资早期项目。', estimated_time: '1-3 天' },
    { step_number: 3, title: '漏洞挖掘', description: '使用静态分析、手动审计、模糊测试等方法发现漏洞。', estimated_time: '每周 5-10 小时' },
    { step_number: 4, title: '撰写报告', description: '编写专业报告，包含漏洞描述、PoC、修复建议。', estimated_time: '2-4 小时' },
    { step_number: 5, title: '提交和跟进', description: '通过官方渠道提交，遵守负责任披露原则，跟进修复进度。', estimated_time: '1-4 周' },
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
    const strategies = [STRATEGY_3_7, STRATEGY_3_8];

    console.log('\n开始创建 3.7 和 3.8 策略...\n');

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
