const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

/**
 * 策略 1.2: zkSync Era 生态交互
 * 分类: 空投任务 (airdrop-tasks)
 */

const STRATEGY_CONFIG = {
  // ===== 基本信息 =====
  title: 'zkSync Era 生态交互 - L2 链上体验赚空投',
  slug: 'zksync-era-ecosystem-airdrop',
  summary: '在 zkSync Era 二层网络上体验 DeFi、NFT、游戏等应用，完成链上交互积累活跃度，争取 zkSync 第二轮代币空投。手续费低，操作简单。',

  // 分类 ID
  category: 'airdrop-tasks',
  category_l1: 'airdrop',
  category_l2: '空投任务',

  // ===== 元数据 =====
  difficulty_level: 1,
  risk_level: 2,
  apy_min: 0,
  apy_max: 0,

  threshold_capital: '30-150 美元',
  threshold_capital_min: 30,
  time_commitment: '每周 1-2 小时',
  time_commitment_minutes: 90,
  threshold_tech_level: 'beginner',

  // ===== 详细内容 =====
  content: `> **适合人群**：想要低成本参与 Layer 2 空投的新手玩家
> **阅读时间**：约 8-10 分钟
> **关键词**：zkSync Era / Layer 2 / 低手续费 / DApp 交互 / 空投

---

## 🎯 这是什么？一句话说清楚

**zkSync Era 生态交互**就是：在 zkSync Era 这条"便宜的高速公路"（二层网络）上，体验各种应用（钱包、交易所、NFT、游戏），积累使用记录，等待项目方发放第二轮代币奖励。

**打个比方**：zkSync 已经发过一次空投了（第一轮），但是很多人错过了。现在他们继续开发新功能，很可能会有第二轮、第三轮空投。你现在去使用，就像"提前预订下一轮的门票"。

---

## 💡 为什么要做这个？

### 1. **zkSync 第一轮空投很慷慨**
2023年3月，zkSync 第一轮空投：
- 平均每个地址：1,000-5,000 美元
- 活跃用户更高：5,000-20,000 美元
- 有人甚至拿到 10 万美元以上

**很多人后悔错过了！**

### 2. **第二轮空投概率高**
- zkSync 官方表示会持续奖励生态贡献者
- 第一轮只分配了 17.5% 的代币，还有大量储备
- zkSync Era 是新版本，需要用户来体验测试
- 行业惯例：成功的 L2 项目都会多次空投（如 Arbitrum、Optimism）

### 3. **手续费超便宜**
- 以太坊转账：10-50 美元
- zkSync Era 转账：**0.1-0.5 美元**
- 省下来的钱可以做更多交互！

### 4. **操作简单，风险低**
- 不需要复杂的策略
- 只需要"正常使用"各种 DApp
- 成本主要是时间，资金风险很小

---

## 🛠️ 需要准备什么？

### 第一步：准备钱包
安装 **MetaMask** 或 **Rabby Wallet**（参考 LayerZero 教程）。

### 第二步：添加 zkSync Era 网络

在 MetaMask 中添加 zkSync Era：
1. 点击网络下拉菜单
2. 点击"添加网络"
3. 输入以下信息：

\`\`\`
网络名称：zkSync Era Mainnet
RPC URL：https://mainnet.era.zksync.io
链 ID：324
符号：ETH
区块浏览器：https://explorer.zksync.io
\`\`\`

或者直接访问：https://chainlist.org，搜索 "zkSync Era"，一键添加。

### 第三步：跨链转入资金

**方法一：使用官方桥**
1. 访问 https://bridge.zksync.io
2. 连接钱包
3. 从以太坊主网转入 30-100 美元的 ETH
4. 手续费约 5-15 美元，5-10 分钟到账

**方法二：使用 Orbiter Finance（更快更便宜）**
1. 访问 https://orbiter.finance
2. 选择从 Arbitrum 或 Optimism 转到 zkSync Era
3. 手续费仅 1-3 美元，3 分钟到账

---

## 📋 具体怎么操作？核心玩法

### 第 1 步：体验 DeFi 应用

#### 1.1 在 SyncSwap 交易（DEX）
**网址**：https://syncswap.xyz

**操作**：
1. 连接钱包
2. 将 ETH 换成 USDC（金额 10-20 美元）
3. 再把 USDC 换回 ETH
4. **重复 3-5 次**，分散到不同时间

**为什么？** 交易量和频次是空投的重要指标。

---

#### 1.2 在 Mute.io 添加流动性（LP）
**网址**：https://mute.io

**操作**：
1. 选择 ETH/USDC 交易对
2. 添加流动性（各投入 10-20 美元）
3. 持有 1-2 周
4. 移除流动性

**收益**：赚取交易手续费（年化约 5-15%）+ 空投权重

---

#### 1.3 在 zkSync 借贷平台存款
**推荐平台**：
- **ReactorFusion**：https://reactorfusion.xyz
- **Eralend**：https://eralend.com

**操作**：
1. 存入 ETH 或 USDC
2. 赚取存款利息（年化 1-5%）
3. 可以借出一点钱再存回去（循环操作，增加交互次数）
4. 至少保持 1 周

---

### 第 2 步：体验 NFT 应用

#### 2.1 在 Mintsquare 铸造 NFT
**网址**：https://mintsquare.io

**操作**：
1. 浏览免费铸造（Free Mint）的 NFT 项目
2. 铸造 2-3 个 NFT（手续费仅 0.1-0.3 美元）
3. 尝试在市场上挂单出售（即使卖不掉也算交互）

---

#### 2.2 创建自己的 NFT（可选）
**平台**：Mintsquare、zkMarkets

**操作**：
1. 上传一张图片（可以是手机拍的照片）
2. 铸造成 NFT（费用约 0.5 美元）
3. 挂单出售（价格随便设，主要是完成"创作者"行为）

**为什么？** 创作者可能获得额外权重。

---

### 第 3 步：体验链上身份和社交

#### 3.1 注册 zkSync Era 域名
**平台**：zkNS（https://zkns.domains）

**操作**：
1. 注册一个 .zk 域名（如 yourname.zk）
2. 费用约 5-10 美元/年
3. 设置为钱包地址的昵称

**好处**：
- 域名持有者可能有额外空投
- 方便别人转账给你（用域名代替地址）

---

### 第 4 步：使用 zkSync 原生钱包

#### 4.1 下载 Argent 钱包
**网址**：https://argent.xyz

**操作**：
1. 下载 Argent X 浏览器插件或手机 App
2. 创建 zkSync Era 账户
3. 从 MetaMask 转入少量 ETH（10-20 美元）
4. 用 Argent 完成 2-3 笔交易

**为什么？** Argent 是 zkSync 生态的官方合作钱包，使用者可能有额外奖励。

---

### 第 5 步：参与 zkSync 生态活动

#### 5.1 关注官方任务平台
**平台**：
- **zkSync 官方推特**：https://twitter.com/zksync
- **Galxe 任务**：https://galxe.com/zkSync
- **Layer3**：https://layer3.xyz

**操作**：
1. 定期检查是否有新任务
2. 完成社交任务（关注、转发、点赞）
3. 领取 NFT 凭证

---

## 💰 成本计算

| 项目 | 金额 | 说明 |
|------|------|------|
| **跨链桥接** | 5-15 美元 | 从以太坊转到 zkSync Era |
| **DeFi 交互** | 3-8 美元 | Swap、LP、借贷的 Gas 费 |
| **NFT 铸造** | 1-3 美元 | 铸造 2-3 个 NFT |
| **域名注册** | 5-10 美元（可选） | .zk 域名 |
| **预留资金** | 30-50 美元 | 用于交易、LP 等（可取回） |
| **总成本** | **约 50-100 美元** | 其中大部分资金可取回 |

**潜在收益**：
- 参考第一轮空投：1,000-5,000 美元
- 保守估计第二轮：500-2,000 美元
- 回报率：**5-20 倍**

---

## 🎯 如何提高空投资格？

### 1. **多类型应用体验**
不要只用一个 DApp，至少体验：
- ✅ 1 个 DEX（如 SyncSwap）
- ✅ 1 个借贷平台
- ✅ 1 个 NFT 市场
- ✅ 1 个跨链桥
- ✅ 1 个钱包

### 2. **高频次低金额**
每次交易金额不用大，但次数要多：
- 建议总交互次数：**15-30 次**
- 分散到 4-8 周，每周 2-4 次
- 不同时间段操作（早中晚）

### 3. **长期持有和活跃**
- 在 LP 池至少保持 2 周
- 借贷平台至少存款 1 周
- 每 1-2 周回来操作一次，保持活跃

### 4. **真实使用行为**
- 不要一次性完成所有任务
- 偶尔转账给朋友（真实的社交行为）
- 参与 DAO 治理投票（如果有）
- 在 Discord/Twitter 保持适度活跃

---

## ⚠️ 注意事项和风险

### 风险 1：第二轮空投不确定
zkSync 官方**没有明确承诺**第二轮空投。

**应对**：
- 不要投入过多资金
- 把这当成"学习 L2 技术"的机会
- 即使没空投，也省了以太坊高昂的 Gas 费

### 风险 2：智能合约风险
DeFi 协议可能存在漏洞。

**应对**：
- 优先使用审计过的大平台（SyncSwap、Mute.io）
- 不要把所有资金放在一个协议
- LP 和借贷金额控制在 50-100 美元以内

### 风险 3：操作失误
选错网络会导致资金丢失。

**防范**：
- **始终检查**当前网络是否为 zkSync Era
- 转账前先小额测试
- 保存常用地址到地址簿

### 风险 4：跨链桥延迟
官方桥有时会拥堵。

**应对**：
- 使用 Orbiter Finance 等第三方桥（更快）
- 选择凌晨或周末操作（拥堵少）
- 不要急用钱时才跨链

---

## 📊 8 周执行计划

| 周数 | 主要任务 | 预计时间 | 费用 |
|------|---------|---------|------|
| 第 1 周 | 跨链转入资金 + SyncSwap 交易 3 次 | 1 小时 | 8-20 美元 |
| 第 2 周 | 添加 LP + 铸造 2 个 NFT | 1.5 小时 | 2-5 美元 |
| 第 3 周 | 借贷平台存款 + Swap 2 次 | 1 小时 | 1-3 美元 |
| 第 4 周 | 注册域名（可选） + NFT 交易 | 1 小时 | 5-12 美元 |
| 第 5 周 | 下载 Argent 钱包 + 完成 3 笔交易 | 1 小时 | 1-2 美元 |
| 第 6 周 | 移除 LP + 提取借贷 + Swap 3 次 | 1.5 小时 | 2-4 美元 |
| 第 7 周 | 参与 Galxe 任务 + 社交互动 | 1 小时 | 0.5-1 美元 |
| 第 8 周 | 跨链桥测试 + 最后 Swap 3 次 | 1 小时 | 2-3 美元 |

**总时间**：约 8-10 小时
**总费用**：约 22-50 美元（不含预留资金）

---

## 📱 推荐工具

### zkSync 生态导航
- **官方生态页面**：https://ecosystem.zksync.io
- **DeFi Llama**：查看 zkSync TVL 排名
- **L2BEAT**：对比各 L2 数据和安全性

### Gas 费查询
- **zkSync Era 浏览器**：https://explorer.zksync.io
- 查看实时 Gas 费和网络拥堵情况

### 安全工具
- **Revoke.cash**：定期检查并撤销授权
- **zkSync 官方 Discord**：获取最新公告和帮助

---

## ❓ 常见问题

### Q1：zkSync 第一轮我错过了，还有希望吗？
**A**：有！zkSync 官方表示会持续奖励生态贡献者，未分配的代币还有 80%+。第二轮、第三轮都有可能。

### Q2：zkSync Era 和 zkSync Lite 有什么区别？
**A**：
- **zkSync Lite**：旧版本，功能简单，只能转账
- **zkSync Era**：新版本，支持智能合约、DApp，**现在应该用这个**

### Q3：我需要在 zkSync Lite 上也操作吗？
**A**：不需要。zkSync Era 是主力，Lite 已经过时了。

### Q4：手续费为什么有时候会突然变高？
**A**：
- 网络拥堵时 Gas 费会涨
- 选择凌晨或周末操作更便宜
- 可以在钱包中手动降低 Gas 费（交易会慢一点）

### Q5：我可以同时做 zkSync 和 LayerZero 吗？
**A**：当然可以！而且**应该这样做**，分散风险，提高中奖率。zkSync Era 本身也支持 LayerZero 跨链，可以两个任务一起完成。

---

## ✅ 一页检查清单

### 准备阶段
- [ ] 安装 MetaMask 钱包
- [ ] 添加 zkSync Era 网络
- [ ] 跨链转入 30-100 美元 ETH
- [ ] 确认资金到账

### DeFi 体验
- [ ] 在 SyncSwap 完成 5 次以上 Swap
- [ ] 在 Mute.io 添加流动性（持有 1-2 周）
- [ ] 在借贷平台存款（至少 1 周）
- [ ] 尝试循环借贷（进阶玩法）

### NFT 体验
- [ ] 铸造 2-3 个免费 NFT
- [ ] 在 NFT 市场挂单（买入或卖出）
- [ ] 创建自己的 NFT（可选）

### 进阶操作
- [ ] 注册 .zk 域名（可选）
- [ ] 下载 Argent 钱包并完成交易
- [ ] 参与 Galxe 任务领取 NFT
- [ ] 使用跨链桥测试（zkSync → Arbitrum）

### 安全检查
- [ ] 每次操作前确认网络是 zkSync Era
- [ ] 定期用 Revoke.cash 清理授权
- [ ] 加入 zkSync 官方 Discord 获取更新
- [ ] 记录交易历史（备用）

---

## 🎓 总结

**zkSync Era 空投任务是**：
- ✅ 手续费超低（仅以太坊的 1/50）
- ✅ 操作简单，适合新手
- ✅ 生态丰富，应用多样
- ✅ 第二轮空投概率高
- ⚠️ 需要耐心和时间（6-8 周）

**建议心态**：
- 把 zkSync Era 当成"日常钱包"使用
- 真实体验各种 DApp，而不是为了空投而空投
- 享受低手续费带来的便利
- 空投是额外奖励，不是唯一目的

**下一步**：
现在就跨链到 zkSync Era，开始第一笔 Swap 吧！记住：**小额测试 → 确认成功 → 逐步增加**，祝你空投丰收！🚀
`,

  steps: [
    {
      step_number: 1,
      title: '准备钱包和网络',
      description: '安装 MetaMask，添加 zkSync Era 网络，从以太坊或其他 L2 跨链转入 30-100 美元 ETH。',
      estimated_time: '30 分钟',
    },
    {
      step_number: 2,
      title: '体验 DeFi 应用',
      description: '在 SyncSwap 交易 5 次以上，在 Mute.io 添加流动性，在借贷平台存款，至少覆盖 3 个不同协议。',
      estimated_time: '每周 1 小时，持续 4 周',
    },
    {
      step_number: 3,
      title: '体验 NFT 生态',
      description: '在 Mintsquare 铸造 2-3 个免费 NFT，尝试在市场交易，可选创建自己的 NFT。',
      estimated_time: '1 小时',
    },
    {
      step_number: 4,
      title: '进阶操作和身份',
      description: '注册 .zk 域名（可选），下载 Argent 钱包完成交易，参与 Galxe 任务，使用跨链桥。',
      estimated_time: '每周 30 分钟，持续 2-3 周',
    },
    {
      step_number: 5,
      title: '保持活跃和追踪',
      description: '每 1-2 周回来操作一次，关注 zkSync 官方 Twitter 和 Discord，等待空投公告。',
      estimated_time: '每月 1-2 小时',
    },
  ],
};

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

    const strategy = {
      ...STRATEGY_CONFIG,
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

    console.log('\n✅ zkSync Era 生态交互空投策略创建成功!');
    console.log(`   ID: ${response.data.data.id}`);
    console.log(`   Slug: ${response.data.data.slug}`);
    console.log(`   访问: http://localhost:3000/strategies/${response.data.data.slug}\n`);
  } catch (error) {
    console.error('\n❌ 创建失败:', error.response?.data || error.message);
  }
}

addStrategy();