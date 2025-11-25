const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

// ===== 2.3 Friend.tech Points 社交挖矿 =====
const STRATEGY_2_3 = {
  title: 'Friend.tech Points 社交挖矿 - 买卖 Keys 赚积分',
  slug: 'friendtech-points-social-mining',
  summary: '在 Friend.tech 上通过购买 KOL 的 Keys（访问权）参与社交互动，赚取积分奖励，等待空投。适合有社交属性、愿意尝试 SocialFi 的玩家。',

  category: 'points-season',
  category_l1: 'airdrop',
  category_l2: '积分赛季',

  difficulty_level: 2,
  risk_level: 3,

  apy_min: 0,
  apy_max: 100,
  threshold_capital: '50-1000 美元',
  threshold_capital_min: 50,
  time_commitment: '初始设置 1 小时，后续每周 3-5 小时社交互动',
  time_commitment_minutes: 60,
  threshold_tech_level: 'intermediate',

  content: `> **适合人群**：喜欢社交、愿意与 KOL 互动、追求创新玩法的玩家
> **阅读时间**：约 12 分钟
> **关键词**：Friend.tech / SocialFi / Keys / 社交代币 / Base / 积分空投

---

## 🎯 什么是 Friend.tech？

### 用大白话解释

想象一下：
- **传统粉丝群**：你免费关注明星、网红，他们发推特你可以看
- **Friend.tech**：你需要"买票"才能进入某人的私人群聊
- **这张票**：就是 "Key"（钥匙），价格随着粉丝数量波动

**核心玩法**：
1. **买 Key**：购买某个 KOL 的 Key，获得私聊权限
2. **群聊互动**：在私密群里和 KOL、其他持有者聊天
3. **赚积分**：每次交易、聊天都赚取 Friend.tech Points
4. **卖 Key**：如果 Key 价格涨了，可以卖出获利

**真实案例**：
- NBA 球星 Grayson Allen 的 Key 最高涨到 12 ETH（约 2.4 万美元）
- 早期买入者转手赚了 10 倍
- 同时累积了大量积分，等待空投

---

## 📋 Friend.tech 的独特机制

### 1. Key 价格公式（Bonding Curve）

Key 价格随着持有人数自动调整：
- 第 1 个 Key：约 0.001 ETH（2 美元）
- 第 10 个 Key：约 0.01 ETH（20 美元）
- 第 100 个 Key：约 0.5 ETH（1000 美元）

**公式**：价格 = 供应量² / 16000

**意思**：越多人买，价格越贵（类似早期比特币）

### 2. 手续费分配

每次交易收取 10% 手续费：
- 5% 给 Key 的主人（KOL）
- 5% 给 Friend.tech 平台

**示例**：
- 你花 1 ETH 买某人的 Key
- 实际到手价值：0.9 ETH
- 0.05 ETH 给 KOL，0.05 ETH 给平台

### 3. 积分系统

**如何赚积分**？
1. **交易积分**：买卖 Key 时按金额计算
   - 买 1 ETH 的 Key = 获得 100 Points（示例比例）
2. **持有积分**：持有 Key 每天自动累积
   - 持有价值 0.1 ETH 的 Key = 每天 10 Points
3. **互动积分**：在群聊中发言、回复
   - 每条消息 1-5 Points（取决于活跃度）

**积分用途**（未明确，但预期）：
- 未来空投 Friend.tech 代币的依据
- 可能兑换会员特权

---

## 🚀 操作流程（详细步骤）

### 步骤 1：准备工作（20 分钟）

**需要的工具**：
1. **iOS 或 Android 手机**（Friend.tech 是手机 App）
2. **0.1-1 ETH**（约 200-2000 美元）在 Base 链上
3. **Twitter 账号**（必须，用于注册）

**如何获得 Base 链上的 ETH**？

方式 1：直接桥接
1. 访问 https://bridge.base.org
2. 连接 MetaMask
3. 从以太坊主网桥接 ETH 到 Base
4. 等待 5-10 分钟

方式 2：从交易所提现
1. 在 Coinbase 购买 ETH
2. 选择提现到 Base 网络
3. 费用更低（约 1-2 美元）

### 步骤 2：下载并注册 Friend.tech（15 分钟）

1. **下载 App**
   - iOS：App Store 搜索 "Friend.tech"
   - Android：官网下载 APK（https://friend.tech）

2. **注册账号**
   - 打开 App
   - 点击 "Sign up with Twitter"
   - 授权 Twitter 登录
   - App 会自动生成你的专属钱包

3. **入金到 App**
   - 点击 "Add Funds"
   - 扫描二维码或复制地址
   - 从 MetaMask 转入 ETH（Base 链）
   - 等待 1-2 分钟到账

**安全提示**：
- 备份钱包私钥（设置 → Export Private Key）
- 不要在 App 里存放大量资金

### 步骤 3：选择并购买 Keys（30 分钟）

**如何选择买谁的 Key**？

策略 1：买头部 KOL（相对安全）
- Twitter 粉丝 > 10 万
- Key 价格 0.5-2 ETH
- 示例：知名 Crypto KOL、NBA 球员
- 优点：群聊质量高、价格相对稳定
- 缺点：买入成本高

策略 2：买潜力新人（高风险高回报）
- Twitter 粉丝 1-5 万
- Key 价格 0.01-0.1 ETH
- 示例：新晋 KOL、Meme 账号
- 优点：买入便宜，涨幅空间大
- 缺点：可能无人问津，归零风险

策略 3：批量买低价 Key（积分策略）
- 买 10-20 个人的第 1-2 个 Key
- 每个只需 0.001-0.005 ETH（2-10 美元）
- 目的：不是投机，而是积累交易积分
- 优点：成本可控，积分快速累积

**推荐组合**：
- 60% 资金买 1-2 个头部 KOL（求稳）
- 30% 资金买 3-5 个潜力新人（博涨幅）
- 10% 资金批量买低价 Key（刷积分）

**如何购买**？
1. 在 App 首页搜索用户名或 Twitter handle
2. 点击进入该用户主页
3. 查看 Key 价格和持有人数
4. 点击 "Buy Keys"
5. 输入购买数量（通常买 1 个即可）
6. 确认交易（支付 ETH + 10% 手续费）

### 步骤 4：参与群聊互动（每天 15-30 分钟）

购买 Key 后，你会自动加入该用户的私密群聊。

**互动建议**：
1. **真诚交流**
   - 不要发垃圾信息
   - 提出有价值的问题
   - 分享有用的信息

2. **每天签到**
   - 至少发 1-2 条消息
   - 保持活跃度
   - 积累互动积分

3. **关注 Alpha 信息**
   - KOL 可能在群里分享独家消息
   - 新项目信息、空投机会
   - 记录并跟进

### 步骤 5：监控 Key 价格，适时卖出（持续）

**什么时候卖 Key**？

卖出信号 1：价格暴涨
- 你买入时 0.1 ETH，现在涨到 0.5 ETH
- 卖出获利 4 倍（扣除 10% 手续费 = 实际 3.6 倍）

卖出信号 2：群聊变质
- KOL 停止互动
- 群里都是广告
- 持有人数开始下降

卖出信号 3：达到积分目标
- 如果你只是为了刷积分
- 持有 30-60 天后可以考虑卖出

**保留策略**：
- 对于真正有价值的 KOL 群聊，长期持有
- 这些 Key 可能成为你的"社交资产"

---

## 💰 收益计算与示例

### 示例 1：投机策略（买潜力新人）

**投入**：0.5 ETH（约 1000 美元）

**操作**：
- 买入某新晋 KOL 的 Key（价格 0.05 ETH）
- 买入 10 个 Key，总成本 0.5 ETH + 0.05 ETH 手续费 = 0.55 ETH

**假设结果**：
- 2 周后该 KOL 爆红，Key 涨到 0.2 ETH
- 卖出 10 个 Key：10 × 0.2 = 2 ETH
- 扣除 10% 手续费：2 × 0.9 = 1.8 ETH
- 净利润：1.8 - 0.55 = 1.25 ETH（约 2500 美元）
- **回报率：250%**

**风险**：
- 如果 KOL 不火，Key 价格归零，损失 100%

### 示例 2：积分策略（批量买低价）

**投入**：0.2 ETH（约 400 美元）

**操作**：
- 买入 20 个不同用户的第 1-2 个 Key
- 每个成本 0.01 ETH × 20 = 0.2 ETH

**收益**：
- 交易积分：20 次交易 × 10 Points = 200 Points
- 持有积分：每天 20 个 Key × 1 Point = 20 Points/天
- 30 天 = 600 Points
- 互动积分：每天 5 条消息 × 30 天 = 150 Points
- **总积分：950 Points**

**潜在空投价值**（假设）：
- 如果 1 Point = 0.5 美元
- 950 Points = 475 美元
- **回报率：119%**

**风险**：
- 积分价值不确定
- 可能低于预期

### 示例 3：组合策略

**投入**：1 ETH（约 2000 美元）

**分配**：
- 0.6 ETH 买头部 KOL Key（相对稳定）
- 0.3 ETH 买潜力新人（博涨幅）
- 0.1 ETH 批量买低价 Key（刷积分）

**预期收益**：
- 头部 Key：保值或小涨 10-20%
- 潜力新人：平均涨 2-3 倍（部分归零）
- 低价 Key：累积积分，等待空投

**总体回报**：30-80%（综合平衡）

---

## ⚠️ 风险与注意事项

### 主要风险

1. **Key 价格归零风险**
   - 很多 Key 买完就无人问津
   - KOL 可能停止互动，群聊变死群
   - 应对：分散投资，不要 All in 单一 Key

2. **高手续费侵蚀收益**
   - 买卖各收 10%，来回就是 20%
   - 短期交易很难盈利
   - 应对：长期持有，减少交易次数

3. **积分价值不确定**
   - Friend.tech 还没发币
   - 积分能换多少代币未知
   - 应对：不要高估积分价值

4. **App 钱包风险**
   - App 内置钱包可能有安全隐患
   - 应对：不要存放过多资金，定期提现

5. **监管风险**
   - SocialFi 涉及代币化社交关系
   - 可能面临法律监管
   - 应对：了解当地法规

### 安全清单

- ✅ 备份 App 钱包私钥
- ✅ 不要在 App 里存放超过 1 ETH
- ✅ 只买你真正感兴趣的 KOL 的 Key
- ✅ 不要被 FOMO 情绪影响，盲目追高价 Key
- ✅ 定期查看持有 Key 的价格和群聊活跃度

---

## 🔥 进阶策略

### 策略 1：成为 Key 发行者

你也可以发行自己的 Key：
1. 在 App 里激活你的账号
2. 设置你的第一个 Key 价格（通常免费或 0.001 ETH）
3. 推广你的 Key（Twitter、Discord）
4. 建立你的私密社群

**收益**：
- 每次有人买卖你的 Key，你获得 5% 手续费
- 如果你有 1000 粉丝，可能赚几百美元

### 策略 2：狙击新注册 KOL

使用第三方工具（如 friend.tech tracker）：
- 监控新注册的 Twitter 大V
- 在他们 Key 价格还低时快速买入
- 等价格涨起来后卖出

**风险**：需要快速反应，竞争激烈

### 策略 3：关注 Friend.tech 生态

Friend.tech 可能推出更多功能：
- 代币化内容（付费文章、视频）
- NFT 集成
- 跨平台互通

**建议**：持续关注官方公告，早期参与新功能

---

## ❓ 常见问题

**Q1：Friend.tech 安全吗？**
> 平台本身经过审计，但 App 钱包是托管性质，有一定风险。建议不要存放大额资金。

**Q2：买 Key 后必须聊天吗？**
> 不强制，但不聊天就赚不到互动积分。而且不互动的话，买 Key 意义不大。

**Q3：Key 价格会一直涨吗？**
> 不会。很多 Key 买完就跌，甚至归零。只有真正有价值的 KOL 才能长期保持价格。

**Q4：可以卖空 Key 吗？**
> 不可以。Friend.tech 只支持先买入再卖出，不支持做空。

**Q5：积分什么时候空投？**
> 官方未公布。根据惯例，可能在积分系统运行 6-12 个月后发币。

**Q6：如何提现？**
> 在 App 里点击 "Withdraw"，输入你的 MetaMask 地址（Base 链），ETH 会转到你的钱包。

---

## ✅ 操作清单

- [ ] 准备 0.1-1 ETH 在 Base 链上
- [ ] 下载 Friend.tech App，用 Twitter 注册
- [ ] 入金到 App 钱包
- [ ] 备份私钥
- [ ] 研究并购买 1-3 个 KOL 的 Keys
- [ ] 每天在群聊中互动 15-30 分钟
- [ ] 监控 Key 价格，适时买卖调整
- [ ] 关注积分累积情况
- [ ] 关注官方公告，等待空投

---

## 🎓 总结

**Friend.tech 的核心价值**：
1. **创新玩法**：首个将社交关系代币化的平台
2. **双重收益**：Key 价格上涨 + 积分空投
3. **KOL 资源**：直接接触高质量 KOL 和 Alpha 信息
4. **Base 生态**：Coinbase 支持，增长潜力大

**适合人群**：
- 喜欢社交、愿意与人互动的玩家
- 追求创新玩法的 DeFi 爱好者
- 有一定风险承受能力的玩家

**不适合**：
- 完全不懂社交媒体的玩家
- 无法承受 Key 价格波动的玩家
- 只想被动收益的玩家

**核心建议**：
- 小额测试，先买几个低价 Key 体验
- 真诚互动，不要只想投机
- 分散投资，不要 All in 单一 Key
- 长期持有头部 KOL Key，短期交易潜力新人
- 把积分当作额外奖励，不要高估价值

Friend.tech 是 SocialFi 的大胆尝试，早期参与者有机会获得超额收益！🎯
`,

  steps: [
    { step_number: 1, title: '准备 Base 链 ETH', description: '桥接或购买 0.1-1 ETH 到 Base 链。', estimated_time: '20 分钟' },
    { step_number: 2, title: '下载并注册 App', description: '下载 Friend.tech App，用 Twitter 注册并入金。', estimated_time: '15 分钟' },
    { step_number: 3, title: '购买 Keys', description: '选择 KOL，购买他们的 Keys，加入私密群聊。', estimated_time: '30 分钟' },
    { step_number: 4, title: '每天互动', description: '在群聊中发言、交流，赚取互动积分。', estimated_time: '每天 15-30 分钟' },
    { step_number: 5, title: '监控并调整', description: '监控 Key 价格和积分，适时买卖调整持仓。', estimated_time: '持续' },
  ],
};

// ===== 2.4 Blur 第三季积分策略 =====
const STRATEGY_2_4 = {
  title: 'Blur 第三季积分策略 - NFT 挂单赚积分',
  slug: 'blur-season-3-points',
  summary: '在 Blur NFT 平台上通过挂买单、卖单、借贷等操作赚取积分，参与第三季空投。适合持有 NFT 或愿意提供流动性的玩家。',

  category: 'points-season',
  category_l1: 'airdrop',
  category_l2: '积分赛季',

  difficulty_level: 2,
  risk_level: 3,

  apy_min: 5,
  apy_max: 50,
  threshold_capital: '500-10000 美元',
  threshold_capital_min: 500,
  time_commitment: '初始设置 1 小时，后续每天调整挂单 15-30 分钟',
  time_commitment_minutes: 60,
  threshold_tech_level: 'intermediate',

  content: `> **适合人群**：持有蓝筹 NFT、愿意提供 NFT 流动性的玩家
> **阅读时间**：约 13 分钟
> **关键词**：Blur / NFT / 积分 / 挂单 / 借贷 / 空投

---

## 🎯 什么是 Blur 第三季积分？

### 用大白话解释

**Blur** 是一个 NFT 交易平台（像 NFT 版的币安）：
- **OpenSea**：老牌 NFT 市场，手续费高（2.5%）
- **Blur**：新平台，0 手续费，还给用户发空投

**第三季积分**：就像积分商城，你在 Blur 上交易、挂单、借贷，都能赚积分，最后按积分比例分配 BLUR 代币空投。

**打个比方**：
- 你在淘宝买东西不送积分
- 但在 Blur 买 NFT，平台倒贴钱（发代币）鼓励你用

**历史战绩**：
- 第一季空投：平均每人获得 2000-10000 个 BLUR（价值 1-5 万美元）
- 第二季空投：平均 500-2000 个 BLUR（价值 2500-10000 美元）
- 第三季：预计总量与前两季相当

---

## 📋 Blur 积分如何运作？

### 核心机制：Bid & List（挂买单和卖单）

**挂买单（Bid）**：
- 你在 Blur 上设置价格，愿意买某个 NFT 系列
- 例如：你出价 5 ETH 买 Azuki NFT
- 即使没成交，只要挂单在那，就每小时赚积分

**挂卖单（List）**：
- 你持有 NFT，挂出售价格
- 例如：你的 CryptoPunk 挂 50 ETH 出售
- 即使没人买，挂单也赚积分

**借贷（Lending）**：
- 你把 ETH 借给想买 NFT 的人（收利息）
- 或者把 NFT 抵押借 ETH（付利息）
- 借贷也赚积分，倍数更高

### 积分计算规则

**Blur 积分公式**（简化版）：

积分 = 挂单金额 × 时间 × 倍数

**倍数因素**：
1. **Loyalty（忠诚度）**
   - 只在 Blur 挂单：3x 倍数
   - 同时在 OpenSea 挂单：1x 倍数
   - 多平台挂单：0.5x 倍数

2. **Bidding Range（买单价格范围）**
   - 买单价格接近地板价：倍数高
   - 买单价格远低于地板价：倍数低
   - 示例：地板价 10 ETH，你出 9.5 ETH = 高倍数，出 5 ETH = 低倍数

3. **Collection Tier（NFT 系列等级）**
   - 蓝筹 NFT（Azuki、BAYC）：高倍数
   - 小众 NFT：低倍数

**示例计算**：
- 你挂 10 ETH 买单（Azuki 地板价 9.8 ETH）
- 只在 Blur 挂单（3x 忠诚度）
- 蓝筹系列（2x 等级）
- 挂 24 小时
- 积分 = 10 × 24 × 3 × 2 = 1440 Points

---

## 🚀 操作流程（详细步骤）

### 步骤 1：准备工作（30 分钟）

**需要的工具**：
1. **MetaMask 钱包**
2. **至少 5 ETH**（约 1 万美元）或持有蓝筹 NFT
3. **Blur 账号**（通过 Twitter 或钱包注册）

**资金建议**：
- 小额测试：5-10 ETH
- 中等投入：10-30 ETH
- 大额参与：50+ ETH

**为什么需要这么多资金**？
- 蓝筹 NFT 地板价通常 5-50 ETH
- 挂单需要真金白银（虽然可能不会真的成交）
- 资金量越大，积分越多

### 步骤 2：注册 Blur 并激活账号（15 分钟）

1. **访问 https://blur.io**
2. **连接 MetaMask 钱包**
3. **验证身份**：
   - 关联 Twitter 账号（推荐，可能有额外奖励）
   - 完成新手教程

4. **查看当前赛季信息**：
   - 点击顶部 "Airdrop" 或 "Points"
   - 查看第三季规则、结束时间、你的当前积分

### 步骤 3：选择目标 NFT 系列（20 分钟）

**优先选择这些蓝筹 NFT**：

1. **Azuki**
   - 地板价：约 5-10 ETH
   - 积分倍数：高
   - 流动性：好

2. **Pudgy Penguins**
   - 地板价：约 8-15 ETH
   - 积分倍数：高
   - 流动性：好

3. **Milady**
   - 地板价：约 2-4 ETH
   - 积分倍数：中
   - 适合小资金

4. **Doodles**
   - 地板价：约 1-3 ETH
   - 积分倍数：中
   - 适合小资金

**如何判断**？
- 在 Blur 上查看 "Points Multiplier"（积分倍数）
- 选择倍数高、地板价适中的系列

### 步骤 4：挂买单赚积分（核心策略）

**策略 A：安全挂单（不想真买 NFT）**

1. 查看 NFT 系列地板价（例如 Azuki 地板价 10 ETH）
2. 挂买单价格比地板价低 15-25%
   - 例如：出价 7.5-8.5 ETH
3. 这样大概率不会成交，但仍然赚积分（只是倍数较低）

**步骤**：
- 在 Blur 搜索 "Azuki"
- 点击 "Bid"（出价）
- 选择 "Collection Offer"（对整个系列出价）
- 输入价格：8 ETH
- 选择数量：1 个
- 选择有效期：7 天（最长）
- 确认并签名

**资金锁定**：你的 8 ETH 会被锁定，但可以随时取消挂单释放资金。

**策略 B：激进挂单（愿意接受 NFT）**

1. 挂单价格接近地板价（例如地板价 10 ETH，你出 9.5 ETH）
2. 积分倍数更高
3. 但可能真的买到 NFT

**风险**：
- NFT 价格可能暴跌，你接盘亏损
- 需要对 NFT 市场有判断

**策略 C：批量挂单（分散风险）**

不要把所有资金挂在一个系列：
- 30% 资金挂 Azuki
- 30% 资金挂 Pudgy Penguins
- 40% 资金挂 Milady

这样分散风险，也能在多个系列赚积分。

### 步骤 5：挂卖单赚积分（如果你持有 NFT）

**如果你已经持有蓝筹 NFT**：

1. 在 Blur 上架你的 NFT
2. 价格设置比地板价高 10-20%
   - 例如：地板价 10 ETH，你挂 11-12 ETH
3. 挂单期间持续赚积分

**重点**：
- 只在 Blur 挂单（不要同时在 OpenSea 挂），保持 3x 忠诚度倍数
- 定期调整价格，保持在合理区间

### 步骤 6：参与 Blend 借贷赚额外积分（进阶）

**Blend** 是 Blur 推出的 NFT 借贷协议。

**两种参与方式**：

方式 1：借出 ETH（做贷方）
- 你把 ETH 借给想买 NFT 的人
- 收取利息（APR 约 5-20%）
- 赚取借贷积分（倍数高于挂单）

操作：
1. 在 Blur 点击 "Blend"
2. 选择 "Lend"
3. 选择 NFT 系列（如 Azuki）
4. 设置最大贷款金额（如 5 ETH）
5. 设置利率（如 10% APR）
6. 确认

方式 2：抵押 NFT 借 ETH（做借方）
- 你把 NFT 抵押给协议
- 借出 ETH 使用
- 支付利息

**风险**：
- 借方可能违约，你需要接收 NFT（如果是贷方）
- 利率波动

**积分收益**：
- 借贷积分倍数通常是挂单的 1.5-2 倍
- 但风险更高

### 步骤 7：每天调整优化（15-30 分钟）

**每日任务**：
1. 检查挂单是否还在（有时会被成交或过期）
2. 调整买单价格，保持在合理区间
3. 查看积分累积情况
4. 关注 Blur 官方公告（可能有规则变化）

**优化技巧**：
- 选择交易量大的系列（流动性好）
- 不要挂价格过离谱的单（积分倍数太低）
- 保持忠诚度（只用 Blur，不用 OpenSea）

---

## 💰 收益计算与示例

### 示例 1：保守挂单策略（20 ETH）

**投入**：20 ETH（约 4 万美元）

**操作**：
- 10 ETH 挂买单（Azuki，价格比地板价低 20%）
- 10 ETH 挂买单（Pudgy Penguins，价格比地板价低 20%）
- 挂 90 天（一个赛季）

**假设积分**：
- 每天积分：20 ETH × 24 小时 × 1.5x（中等倍数）= 720 Points/天
- 90 天总积分：720 × 90 = 64,800 Points

**假设空投价值**（参考历史）：
- 如果你的积分占总积分池的 0.01%
- 第三季总空投 3 亿个 BLUR
- 你获得：3 亿 × 0.01% = 30 万个 BLUR
- 如果 BLUR 价格 0.5 美元：30 万 × 0.5 = 15 万美元
- **回报率：375%**（15 万 / 4 万）

**风险**：
- BLUR 代币价格可能跌，空投价值降低
- 挂单可能真的成交，买到不想要的 NFT

### 示例 2：激进挂单 + 借贷策略（50 ETH）

**投入**：50 ETH（约 10 万美元）

**操作**：
- 30 ETH 挂买单（价格接近地板价，高倍数）
- 20 ETH 参与 Blend 借贷
- 挂 90 天

**假设积分**：
- 挂单积分：30 ETH × 24 × 2.5x = 1800 Points/天
- 借贷积分：20 ETH × 24 × 4x = 1920 Points/天
- 每天总计：3720 Points/天
- 90 天总积分：334,800 Points

**假设空投价值**：
- 占总积分池 0.05%
- 获得 150 万个 BLUR
- 价值 75 万美元（BLUR = 0.5 美元）
- **回报率：750%**

**风险**：
- 挂单成交概率高，可能买到 NFT
- NFT 价格下跌导致亏损
- 借贷违约风险

---

## ⚠️ 风险与注意事项

### 主要风险

1. **挂单成交风险**
   - 你挂的买单可能真的成交
   - 如果 NFT 价格暴跌，你会亏损
   - 应对：挂单价格比地板价低 15-25%，降低成交概率

2. **NFT 市场整体下跌**
   - 熊市中 NFT 地板价可能腰斩
   - 即使不成交,空投价值也可能不足以覆盖 ETH 贬值
   - 应对：使用闲置 ETH,不要借贷参与

3. **BLUR 代币价格下跌**
   - 空投的 BLUR 价格可能远低于预期
   - 第一季 BLUR 最高 5 美元,现在约 0.3-0.5 美元
   - 应对：空投到账后及时卖出,不要贪心

4. **忠诚度惩罚**
   - 如果你同时在 OpenSea 挂单,积分倍数大幅降低
   - 应对：只用 Blur,取消其他平台挂单

5. **Gas 费成本**
   - 频繁调整挂单需要支付 Gas 费
   - 每次 5-20 美元
   - 应对：减少调整频率,选择 Gas 低时操作

### 安全清单

- ✅ 只在 Blur 官网操作（blur.io）
- ✅ 检查 MetaMask 签名内容
- ✅ 不要把全部 ETH 挂单,保留流动性
- ✅ 定期检查挂单状态
- ✅ 关注 Blur 官方 Twitter,了解规则变化

---

## 🔥 进阶策略

### 策略 1：动态调价

NFT 地板价每天都在变：
- 早上查看地板价
- 调整买单价格,保持在地板价 85-95% 区间
- 这样既保持高积分倍数,又降低成交风险

### 策略 2：多钱包操作

如果你有多个钱包：
- 钱包 A：激进挂单（高风险高收益）
- 钱包 B：保守挂单（低风险稳定积分）
- 钱包 C：借贷（超高倍数）

分散风险,对冲策略。

### 策略 3：关注新增系列

Blur 会定期增加新的 NFT 系列到积分计划：
- 新系列刚加入时竞争少
- 积分倍数可能更高
- 关注官方公告,第一时间参与

### 策略 4：空投到账即卖

历史数据显示：
- Blur 空投到账后,BLUR 价格通常下跌
- 第一季空投后 BLUR 从 5 美元跌到 1 美元
- 建议空投到账后立即卖出 50-80%,锁定利润

---

## ❓ 常见问题

**Q1：我没有 NFT,可以参与吗？**
> 可以！只挂买单就行,不需要持有 NFT。但需要准备 5-50 ETH 资金。

**Q2：挂单会真的买到 NFT 吗？**
> 有可能。如果你挂的价格接近地板价,成交概率高。建议挂比地板价低 15-25% 的价格。

**Q3：多久能拿到空投？**
> 第三季结束后 1-2 周内发放。关注 Blur 官方公告。

**Q4：可以随时取消挂单吗？**
> 可以。在 Blur 上点击你的挂单,选择 "Cancel",资金会立即解锁。

**Q5：Blend 借贷安全吗？**
> 相对安全,但有违约风险。如果你是贷方,借方违约你会收到 NFT（可能贬值）。

**Q6：积分会过期吗？**
> 不会。每个赛季结束后,积分会转换成空投代币。

---

## ✅ 操作清单

- [ ] 准备 5-50 ETH 在 MetaMask
- [ ] 注册 Blur 账号,连接 Twitter
- [ ] 研究蓝筹 NFT 系列,查看积分倍数
- [ ] 挂买单（价格比地板价低 15-25%）
- [ ] 确保只在 Blur 挂单（不要同时用 OpenSea）
- [ ] （可选）参与 Blend 借贷赚额外积分
- [ ] 每天检查挂单状态,调整价格
- [ ] 查看积分累积情况
- [ ] 关注赛季结束时间
- [ ] 空投到账后及时卖出 BLUR

---

## 🎓 总结

**Blur 第三季积分的核心优势**：
1. **确定性收益**：挂单就赚积分,最终换代币空投
2. **零手续费**：Blur 不收交易手续费
3. **高倍数机制**：借贷和高价挂单倍数高
4. **历史证明**：前两季空投价值可观

**适合人群**：
- 持有闲置 ETH 的玩家（5-50 ETH）
- 持有蓝筹 NFT 的玩家
- 了解 NFT 市场的玩家
- 能够承受 NFT 价格波动风险的玩家

**不适合**：
- 完全不懂 NFT 的新手
- 没有 5 ETH 以上资金的玩家
- 无法承受资金被锁定的玩家

**核心建议**：
- 保守挂单,价格比地板价低 20%
- 分散挂单,不要 All in 单一系列
- 保持忠诚度,只用 Blur
- 定期调整价格,优化积分倍数
- 空投到账后及时卖出,锁定利润

Blur 是 NFT 领域最成熟的积分空投项目,值得参与！🖼️
`,

  steps: [
    { step_number: 1, title: '准备资金和账号', description: '准备 5-50 ETH，注册 Blur 账号。', estimated_time: '30 分钟' },
    { step_number: 2, title: '研究 NFT 系列', description: '选择蓝筹 NFT，查看积分倍数和地板价。', estimated_time: '20 分钟' },
    { step_number: 3, title: '挂买单', description: '挂买单（价格比地板价低 15-25%），锁定资金。', estimated_time: '15 分钟' },
    { step_number: 4, title: '参与借贷（可选）', description: '在 Blend 上借出 ETH 或抵押 NFT，赚取更高倍数积分。', estimated_time: '20 分钟' },
    { step_number: 5, title: '每天调整优化', description: '检查挂单状态，调整价格，查看积分累积。', estimated_time: '每天 15-30 分钟' },
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
    const strategies = [STRATEGY_2_3, STRATEGY_2_4];

    console.log('\n开始创建 2.3 和 2.4 策略...\n');

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

    console.log('🎉 2.3-2.4 创建完成！');
    console.log('访问: http://localhost:3000/strategies?category=points-season\n');
  } catch (error) {
    console.error('\n❌ 创建失败:', error.response?.data || error.message);
  }
}

addStrategies();
