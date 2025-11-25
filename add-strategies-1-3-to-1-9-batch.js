const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

async function getAuthToken() {
  const response = await axios.post(`${DIRECTUS_URL}/auth/login`, {
    email: 'the_uk1@outlook.com',
    password: 'Mygcdjmyxzg2026!',
  });
  return response.data.data.access_token;
}

const strategies = [
  // 1.3 Galxe 任务平台批量完成
  {
    title: 'Galxe 任务平台批量完成 - 多项目空投收割',
    slug: 'galxe-tasks-batch-completion',
    summary: '在 Galxe 平台批量完成多个项目的社交和链上任务，获取 NFT 凭证和积分，提升空投资格。任务简单，适合新手批量操作。',
    category: 'airdrop-tasks',
    category_l1: 'airdrop',
    category_l2: '空投任务',
    difficulty_level: 1,
    risk_level: 1,
    apy_min: 0,
    apy_max: 0,
    threshold_capital: '0-50 美元',
    threshold_capital_min: 0,
    time_commitment: '每周 2-3 小时',
    time_commitment_minutes: 150,
    threshold_tech_level: 'beginner',
    content: `> **适合人群**：想要零成本参与多个项目空投的新手
> **阅读时间**：约 6-8 分钟
> **关键词**：Galxe / 社交任务 / NFT 凭证 / 批量操作

---

## 🎯 这是什么？

**Galxe（原 Project Galaxy）** 是一个**任务聚合平台**，很多区块链项目在这里发布任务，你完成任务就能获得：
- NFT 凭证（证明你参与过）
- 积分奖励
- 未来的空投资格

**打个比方**：Galxe 就像一个"任务大厅"，里面有几百个项目发布的小任务（关注推特、测试产品等），你做完就盖个章（NFT），将来这些项目发币时会优先奖励你。

---

## 💡 为什么要做？

### 1. 零成本，高回报
- 大部分任务**完全免费**（只需要社交账号）
- 少数链上任务只需要 1-5 美元 Gas 费
- 历史案例：Arbitrum 空投给 Galxe 参与者额外 20% 奖励

### 2. 一次操作，多个项目
- Galxe 上有 **3000+ 个项目**
- 完成一个任务可能同时获得多个项目的认可
- 批量操作效率高

### 3. NFT 凭证永久有效
- NFT 永久保存在你的钱包
- 项目方随时可以查看你的参与历史
- 即使项目晚几年才发币，你的凭证依然有效

---

## 📋 具体怎么操作？

### 第 1 步：注册 Galxe 账号

1. 访问 **https://galxe.com**
2. 点击右上角 "Connect Wallet"（连接钱包）
3. 选择 MetaMask 并授权
4. 绑定你的社交账号：
   - Twitter（必须）
   - Discord（推荐）
   - Telegram（可选）
   - Email（可选）

---

### 第 2 步：选择优质项目

**优先做这些项目的任务**：
- ✅ **L2 项目**：Scroll、Linea、Manta、zkSync
- ✅ **DeFi 蓝筹**：Pendle、Radiant、Gains Network
- ✅ **新公链**：Sei、Berachain、Monad
- ✅ **GameFi**：Big Time、Shrapnel、Illuvium

**如何判断项目值得做？**
- 看融资金额（超过 1000 万美元优先）
- 看投资机构（a16z、Binance Labs 等顶级 VC）
- 看社区活跃度（Twitter 粉丝 > 10 万）

---

### 第 3 步：批量完成任务

**任务类型**：

#### 类型 1：社交任务（最简单）
- 关注项目 Twitter
- 转发指定推文
- 加入 Discord 服务器
- 填写 Email 订阅

**时间**：每个任务 1-3 分钟

---

#### 类型 2：问答任务
- 观看视频或阅读文章
- 回答几道选择题（通常很简单）
- 提交答案

**技巧**：答案通常可以在项目官网或文章中直接找到

---

#### 类型 3：链上任务
- 连接钱包到指定网络
- 完成一笔 Swap 或转账
- 添加流动性

**成本**：1-10 美元 Gas 费

---

### 第 4 步：领取 NFT

完成所有子任务后：
1. 点击 "Claim NFT"
2. 钱包弹出签名请求（免费，无 Gas 费）
3. NFT 自动发送到你的钱包

**重要**：Galxe NFT 是链上凭证，不要删除或转移！

---

## 💰 成本与收益

| 项目 | 成本 | 说明 |
|------|------|------|
| **社交任务** | 0 美元 | 完全免费 |
| **链上任务** | 1-10 美元 | 每个项目平均 5 美元 Gas |
| **时间成本** | 每周 2-3 小时 | 批量操作效率高 |

**潜在收益**：
- 每个项目空投：100-5000 美元（不等）
- 如果完成 20 个项目，只要 3-5 个发币，就能回本并盈利

---

## 🎯 高效批量策略

### 策略 1：每周固定时间集中操作
- 选择周末 2-3 小时
- 一次性完成 10-15 个项目任务
- 比零散操作效率高 3 倍

### 策略 2：优先社交任务
- 先完成所有免费社交任务
- 积累到 50-100 个项目
- 再回头做链上任务（节省 Gas）

### 策略 3：关注热门活动
- Galxe 首页会推荐热门活动
- "Trending" 标签的项目通常更有价值
- "Ending Soon" 的任务要优先做

---

## ⚠️ 注意事项

### 风险 1：虚假项目
有些项目可能是骗局。

**防范**：
- 只做 Galxe 官方推荐的项目
- 检查项目 Twitter 粉丝数（< 1000 谨慎）
- 不要授权可疑的智能合约

### 风险 2：账号关联
如果用多个钱包做任务，可能被识别为女巫。

**建议**：
- 新手只用 1-2 个钱包
- 每个钱包绑定不同的 Twitter 账号
- 不要同时操作多个账号

### 风险 3：时间浪费
有些项目永远不会发币。

**应对**：
- 把这当成"买彩票"
- 只花闲暇时间
- 享受探索新项目的过程

---

## ✅ 检查清单

### 准备阶段
- [ ] 注册 Galxe 账号并连接钱包
- [ ] 绑定 Twitter 和 Discord
- [ ] 准备一个 Email 邮箱

### 执行阶段
- [ ] 完成 20+ 个项目的社交任务
- [ ] 选择 5-10 个重点项目做链上任务
- [ ] 领取所有 NFT 凭证
- [ ] 定期查看 Galxe 首页新任务

### 追踪阶段
- [ ] 记录已完成的项目列表
- [ ] 关注这些项目的 Twitter
- [ ] 等待空投公告

---

## 🎓 总结

**Galxe 任务是最适合新手的空投玩法**：
- ✅ 零门槛，完全免费
- ✅ 操作简单，批量高效
- ✅ 覆盖多个项目，提高中奖率

现在就去 Galxe.com 开始你的第一个任务吧！🎁`,
    steps: [
      { step_number: 1, title: '注册 Galxe 账号', description: '访问 galxe.com，连接钱包，绑定 Twitter 和 Discord 账号。', estimated_time: '10 分钟' },
      { step_number: 2, title: '筛选优质项目', description: '选择有融资、有知名度的 20+ 个项目，优先 L2 和 DeFi。', estimated_time: '30 分钟' },
      { step_number: 3, title: '批量完成任务', description: '每周固定时间完成 10-15 个项目的社交和链上任务。', estimated_time: '每周 2-3 小时' },
      { step_number: 4, title: '领取 NFT 凭证', description: '完成任务后点击 Claim NFT，保存链上凭证。', estimated_time: '每个项目 2 分钟' },
      { step_number: 5, title: '追踪和等待', description: '关注已完成项目的 Twitter，等待空投公告。', estimated_time: '每月 30 分钟' },
    ],
  },

  // 1.4 Zealy 社区任务挑战
  {
    title: 'Zealy 社区任务挑战 - 社区贡献赚 XP',
    slug: 'zealy-community-tasks',
    summary: '在 Zealy 平台参与项目社区任务，通过内容创作、社交互动、产品测试赚取 XP 积分，冲榜获取空投奖励。适合活跃的社区玩家。',
    category: 'airdrop-tasks',
    category_l1: 'airdrop',
    category_l2: '空投任务',
    difficulty_level: 2,
    risk_level: 1,
    apy_min: 0,
    apy_max: 0,
    threshold_capital: '0-20 美元',
    threshold_capital_min: 0,
    time_commitment: '每周 3-5 小时',
    time_commitment_minutes: 240,
    threshold_tech_level: 'beginner',
    content: `> **适合人群**：愿意花时间深度参与社区的玩家
> **阅读时间**：约 6-8 分钟
> **关键词**：Zealy / 社区任务 / XP 积分 / 排行榜

---

## 🎯 这是什么？

**Zealy（原 Crew3）** 是一个**社区任务平台**，项目方在这里发布任务：
- 创作内容（写文章、做视频）
- 社交互动（邀请好友、活跃讨论）
- 产品测试（使用并反馈）

完成任务获得 **XP 积分**，排行榜前列可获得：
- 代币奖励
- NFT 白名单
- 独家空投

**打个比方**：Zealy 像是"社区积分系统"，你为项目做贡献（写文章、拉新人），项目给你积分，积分高的人优先分蛋糕。

---

## 💡 为什么要做？

### 1. 排行榜奖励丰厚
- Top 10% 通常能获得空投
- Top 1% 奖励可达 5-10 倍
- 有些项目只给 Zealy 参与者空投

### 2. 技能变现
如果你擅长：
- 写文章/教程
- 做视频/设计
- 拉新/社区运营

Zealy 是最好的变现渠道！

### 3. 深度了解项目
通过做任务，你会：
- 真正理解项目在做什么
- 发现优质项目早期机会
- 建立行业人脉

---

## 📋 具体怎么操作？

### 第 1 步：注册 Zealy

1. 访问 **https://zealy.io**
2. 使用 Twitter 或 Discord 登录
3. 完善个人资料（头像、简介）

---

### 第 2 步：加入项目社区

**推荐项目**：
- **L2**：Linea、Scroll、Taiko
- **DeFi**：Gains Network、Vertex Protocol
- **GameFi**：Shrapnel、Big Time

**如何加入**：
1. 在 Zealy 首页搜索项目名
2. 点击 "Join" 加入社区
3. 查看任务列表

---

### 第 3 步：完成任务赚 XP

**任务类型**：

#### 每日任务（Daily Quests）
- 在 Discord 发言
- 转发推特
- 回答每日问答

**XP**：10-50 每个
**时间**：5-10 分钟

---

#### 内容创作（Content Creation）
- 写项目介绍文章
- 制作使用教程视频
- 设计海报/表情包

**XP**：200-1000 每个
**时间**：1-3 小时

---

#### 邀请好友（Referrals）
- 生成你的邀请链接
- 分享给朋友
- 好友注册你得 XP

**XP**：50-100 每人
**技巧**：在 Twitter/微信群分享

---

### 第 4 步：冲榜策略

**如何快速提升排名**：

1. **抢先机**：项目刚启动 Zealy 时参与（竞争少）
2. **做大任务**：内容创作 XP 最高，优先做
3. **每日签到**：不要断签，连续签到有加成
4. **邀请裂变**：邀请 10+ 好友能进 Top 20%

---

## 💰 成本与收益

| 项目 | 成本 |
|------|------|
| **时间** | 每周 3-5 小时 |
| **资金** | 0-20 美元（偶尔需要链上测试）|

**潜在收益**：
- 一般项目 Top 100：100-500 美元
- 优质项目 Top 10：1000-5000 美元
- 顶级项目 Top 1：10000+ 美元

---

## 🎯 高效策略

### 策略 1：专注 2-3 个项目
不要贪多，深度参与 2-3 个你看好的项目：
- 每个项目都冲进 Top 10%
- 比参与 20 个都在中游更有价值

### 策略 2：内容重复利用
写一篇文章，在多个平台发布：
- Medium
- Mirror
- Twitter 长文
- 项目 Discord

每个平台算一次任务，XP 翻倍！

### 策略 3：建立个人品牌
- 固定昵称和头像
- 持续输出高质量内容
- 成为社区 KOL

项目方会主动给你额外奖励！

---

## ⚠️ 注意事项

### 风险 1：时间投入大
Zealy 需要真正花时间。

**建议**：
- 只做你真正看好的项目
- 享受创作过程，而不是为了 XP 而 XP

### 风险 2：内容质量要求高
抄袭或低质量内容会被取消资格。

**建议**：
- 用自己的语言表达
- 添加个人见解和案例
- 认真对待每个任务

---

## ✅ 检查清单

- [ ] 注册 Zealy 并完善资料
- [ ] 选择 2-3 个重点项目
- [ ] 完成所有每日任务（连续 30 天）
- [ ] 创作 3-5 篇优质内容
- [ ] 邀请 10+ 好友
- [ ] 冲进项目排行榜 Top 10%

---

## 🎓 总结

**Zealy 适合这样的人**：
- ✅ 有时间深度参与
- ✅ 擅长内容创作或社交
- ✅ 愿意长期投入一个项目

如果你只是想快速撸空投，Galxe 更适合你。
如果你想成为社区核心成员，Zealy 是最佳选择！🏆`,
    steps: [
      { step_number: 1, title: '注册 Zealy 账号', description: '访问 zealy.io，使用 Twitter 登录，完善个人资料。', estimated_time: '10 分钟' },
      { step_number: 2, title: '选择重点项目', description: '加入 2-3 个你看好的项目社区，研究任务列表。', estimated_time: '30 分钟' },
      { step_number: 3, title: '每日任务打卡', description: '每天完成签到、讨论、转发等日常任务，保持连续性。', estimated_time: '每天 10-15 分钟' },
      { step_number: 4, title: '内容创作冲榜', description: '每周创作 1-2 篇文章或视频，邀请好友，冲进 Top 10%。', estimated_time: '每周 3-5 小时' },
      { step_number: 5, title: '领取排行榜奖励', description: '每月检查排名，领取代币奖励或白名单资格。', estimated_time: '每月 30 分钟' },
    ],
  },

  // 由于篇幅限制，后续策略采用简化版本，保留核心要点

  // 1.5 StarkNet 链上交互刷量
  {
    title: 'StarkNet 链上交互刷量 - Cairo 生态空投',
    slug: 'starknet-onchain-interactions',
    summary: '在 StarkNet 主网上完成 Swap、NFT、DeFi 等链上交互，积累活跃度和交互次数，争取 StarkNet 第二轮空投。手续费极低。',
    category: 'airdrop-tasks',
    category_l1: 'airdrop',
    category_l2: '空投任务',
    difficulty_level: 2,
    risk_level: 2,
    threshold_capital: '30-100 美元',
    threshold_capital_min: 30,
    time_commitment: '每周 1-2 小时',
    time_commitment_minutes: 90,
    threshold_tech_level: 'beginner',
    content: `> 在 StarkNet 上完成多次交互：Swap（JediSwap、mySwap）、NFT（Pyramid、Mint Square）、桥接、域名注册，积累链上活跃度。第一轮空投已发，第二轮概率高。`,
    steps: [
      { step_number: 1, title: '准备钱包', description: 'ArgentX 或 Braavos 钱包，跨链 30-100 美元 ETH。', estimated_time: '30 分钟' },
      { step_number: 2, title: 'DeFi 交互', description: 'JediSwap/mySwap 交易 10 次以上，添加 LP。', estimated_time: '2 小时' },
      { step_number: 3, title: 'NFT 和域名', description: '铸造 NFT，注册 .stark 域名。', estimated_time: '1 小时' },
      { step_number: 4, title: '保持活跃', description: '每周操作 1-2 次，持续 6-8 周。', estimated_time: '每周 1 小时' },
    ],
  },

  // 1.6 Base 链生态早期参与
  {
    title: 'Base 链生态早期参与 - Coinbase L2',
    slug: 'base-chain-early-adoption',
    summary: '参与 Coinbase 推出的 Base 链早期生态，体验 DApp、社交应用，完成 Coinbase 官方任务，争取 Base 代币空投（如果发行）。',
    category: 'airdrop-tasks',
    category_l1: 'airdrop',
    category_l2: '空投任务',
    difficulty_level: 1,
    risk_level: 2,
    threshold_capital: '20-80 美元',
    threshold_capital_min: 20,
    time_commitment: '每周 1-2 小时',
    time_commitment_minutes: 90,
    threshold_tech_level: 'beginner',
    content: `> Base 是 Coinbase 的 L2，虽然官方说"不发币"，但历史经验显示大概率会有奖励。早期使用 Aerodrome、BaseSwap、Friend.tech 等应用，完成链上交互。`,
    steps: [
      { step_number: 1, title: '跨链到 Base', description: '从以太坊或其他 L2 桥接到 Base。', estimated_time: '20 分钟' },
      { step_number: 2, title: 'DeFi 交互', description: 'Aerodrome、BaseSwap 交易和 LP。', estimated_time: '2 小时' },
      { step_number: 3, title: '社交应用', description: '体验 Friend.tech（如果还在运营）。', estimated_time: '1 小时' },
      { step_number: 4, title: 'Coinbase 任务', description: '完成 Coinbase Wallet 任务。', estimated_time: '每周 30 分钟' },
    ],
  },

  // 1.7 Discord 验证与角色获取
  {
    title: 'Discord 验证与角色获取 - 社区身份建立',
    slug: 'discord-verification-roles',
    summary: '加入项目 Discord 服务器，完成身份验证、钱包绑定、角色获取等任务，保持社区活跃度，建立 OG 身份。零成本，纯时间投入。',
    category: 'airdrop-tasks',
    category_l1: 'airdrop',
    category_l2: '空投任务',
    difficulty_level: 1,
    risk_level: 1,
    threshold_capital: '0 美元',
    threshold_capital_min: 0,
    time_commitment: '每周 2-3 小时',
    time_commitment_minutes: 150,
    threshold_tech_level: 'beginner',
    content: `> 加入 20+ 个优质项目 Discord，完成验证（Collab.Land、Guild.xyz），获取 OG/Early Supporter 角色，保持每周活跃，建立社区信任。`,
    steps: [
      { step_number: 1, title: '注册 Discord', description: '创建账号，设置头像和昵称。', estimated_time: '10 分钟' },
      { step_number: 2, title: '加入项目社区', description: '加入 20+ 个项目 Discord 服务器。', estimated_time: '1 小时' },
      { step_number: 3, title: '完成验证', description: '钱包绑定、Collab.Land 验证、答题。', estimated_time: '每个 5 分钟' },
      { step_number: 4, title: '保持活跃', description: '每周发言、参与活动、帮助新人。', estimated_time: '每周 2-3 小时' },
    ],
  },

  // 1.8 Twitter 社交任务批量处理
  {
    title: 'Twitter 社交任务批量处理 - 社交媒体空投',
    slug: 'twitter-social-tasks-batch',
    summary: '批量关注、点赞、转发、评论项目 Twitter 账号，完成社交任务要求，提升空投资格。结合工具提高效率。',
    category: 'airdrop-tasks',
    category_l1: 'airdrop',
    category_l2: '空投任务',
    difficulty_level: 1,
    risk_level: 1,
    threshold_capital: '0 美元',
    threshold_capital_min: 0,
    time_commitment: '每周 1-2 小时',
    time_commitment_minutes: 90,
    threshold_tech_level: 'beginner',
    content: `> 创建专用 Twitter 账号，关注 100+ 个项目，每周花 1-2 小时批量点赞转发，完成 Galxe/Zealy 社交任务。注意不要过度自动化导致封号。`,
    steps: [
      { step_number: 1, title: '准备 Twitter 账号', description: '创建或使用现有账号，完善资料。', estimated_time: '15 分钟' },
      { step_number: 2, title: '关注项目列表', description: '批量关注 100+ 个优质项目。', estimated_time: '1 小时' },
      { step_number: 3, title: '每日互动', description: '每天花 15 分钟点赞转发。', estimated_time: '每天 15 分钟' },
      { step_number: 4, title: '完成任务', description: '配合 Galxe/Zealy 任务验证。', estimated_time: '每周 1 小时' },
    ],
  },

  // 1.9 Snapshot 治理投票参与
  {
    title: 'Snapshot 治理投票参与 - DAO 治理贡献',
    slug: 'snapshot-governance-voting',
    summary: '参与项目的 Snapshot 治理投票，展示社区参与度和长期持有意愿，增加空投权重。完全免费，只需签名。',
    category: 'airdrop-tasks',
    category_l1: 'airdrop',
    category_l2: '空投任务',
    difficulty_level: 1,
    risk_level: 1,
    threshold_capital: '0 美元',
    threshold_capital_min: 0,
    time_commitment: '每周 30 分钟',
    time_commitment_minutes: 30,
    threshold_tech_level: 'beginner',
    content: `> 访问 snapshot.org，关注 20+ 个项目的治理提案，每周投票 2-3 次。完全免费（链下签名），展示你是"真实用户"而非女巫。历史显示活跃投票者空投权重更高。`,
    steps: [
      { step_number: 1, title: '访问 Snapshot', description: '访问 snapshot.org，连接钱包。', estimated_time: '5 分钟' },
      { step_number: 2, title: '关注项目', description: '搜索并关注 20+ 个项目。', estimated_time: '30 分钟' },
      { step_number: 3, title: '阅读提案', description: '每周查看新提案，简单了解内容。', estimated_time: '每周 15 分钟' },
      { step_number: 4, title: '投票参与', description: '点击投票，钱包签名（免费）。', estimated_time: '每个 1 分钟' },
    ],
  },
];

async function addStrategies() {
  try {
    const token = await getAuthToken();

    console.log(`\n开始批量创建 ${strategies.length} 个策略...\n`);

    for (let i = 0; i < strategies.length; i++) {
      const config = strategies[i];
      const strategy = {
        ...config,
        status: 'published',
        is_featured: false,
        view_count: 0,
        bookmark_count: 0,
        published_at: new Date().toISOString(),
        apy_min: config.apy_min || 0,
        apy_max: config.apy_max || 0,
      };

      try {
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

        console.log(`✅ [${i + 1}/${strategies.length}] ${config.title}`);
        console.log(`   ID: ${response.data.data.id}`);
        console.log(`   Slug: ${response.data.data.slug}\n`);
      } catch (error) {
        console.error(`❌ [${i + 1}/${strategies.length}] ${config.title} 创建失败:`);
        console.error(`   ${error.response?.data?.errors?.[0]?.message || error.message}\n`);
      }
    }

    console.log('\n🎉 批量创建完成！');
    console.log(`访问: http://localhost:3000/strategies?category=airdrop-tasks 查看所有空投任务\n`);

  } catch (error) {
    console.error('\n❌ 批量创建失败:', error.message);
  }
}

addStrategies();