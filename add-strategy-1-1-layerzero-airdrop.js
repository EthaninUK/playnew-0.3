const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

/**
 * 策略 1.1: LayerZero 跨链交互空投
 * 分类: 空投任务 (airdrop-tasks)
 */

const STRATEGY_CONFIG = {
  // ===== 基本信息 =====
  title: 'LayerZero 跨链交互空投 - 多链桥接赚空投',
  slug: 'layerzero-cross-chain-airdrop',
  summary: '通过 LayerZero 协议在不同区块链之间转账资产，完成跨链桥接任务，积累链上交互记录，争取 LayerZero 代币空投。简单、低成本、适合新手。',

  // 分类 ID - 空投任务分类
  category: 'airdrop-tasks',

  // 站内一级/二级分类
  category_l1: 'airdrop',
  category_l2: '空投任务',

  // ===== 元数据 =====
  difficulty_level: 1,      // 难度：1-5（1=最简单，适合新手）
  risk_level: 2,            // 风险：1-5（2=较低风险，主要是 Gas 费用）

  // 收益预期
  apy_min: 0,               // 空投不能用年化收益衡量
  apy_max: 0,

  // 资金和时间要求
  threshold_capital: '50-200 美元',
  threshold_capital_min: 50,
  time_commitment: '每周 1-2 小时',
  time_commitment_minutes: 90,
  threshold_tech_level: 'beginner',  // 技术要求：新手

  // ===== 详细内容（使用简单语言）=====
  content: `> **适合人群**：想要通过简单操作获取免费代币空投的新手玩家
> **阅读时间**：约 8-10 分钟
> **关键词**：跨链桥接 / 多链转账 / LayerZero / 空投任务 / 低成本

---

## 🎯 这是什么？一句话说清楚

**LayerZero 跨链空投**就是：你在不同的区块链之间转移资产（比如从以太坊转到 Arbitrum），使用 LayerZero 这个"桥梁"技术，完成足够多的转账次数后，未来可能免费获得 LayerZero 项目的代币奖励。

**打个比方**：就像你在不同城市的连锁超市都购物过，超市总部为了感谢你，给你发会员积分和奖品。LayerZero 就是那个"连锁超市"，不同的区块链就是"不同城市的分店"。

---

## 💡 为什么要做这个？

### 1. **潜在空投价值高**
历史上类似的跨链项目空投价值都很可观：
- Arbitrum 空投：每个地址平均 1,000-10,000 美元
- Optimism 空投：每个地址平均 500-3,000 美元
- Aptos 空投：每个地址平均 1,500 美元

LayerZero 获得了 **1.35 亿美元**的投资，投资方包括红杉、a16z 等顶级机构，空投潜力巨大。

### 2. **操作简单，新手友好**
- 不需要编程知识
- 不需要理解复杂的金融概念
- 只需要会"转账"这一个基本操作
- 全程 10-30 分钟就能完成

### 3. **成本可控**
- 每次转账只需要 5-20 美元的手续费（Gas 费）
- 转账金额可以很小（50-100 美元足够）
- 总成本：100-300 美元可以完成所有任务

---

## 🛠️ 需要准备什么？

### 第一步：准备钱包
你需要一个**加密货币钱包**，推荐使用：
- **MetaMask**（最流行，浏览器插件）
- **Rabby Wallet**（更安全，有风险提示）

**安装步骤**：
1. 在 Google Chrome 浏览器搜索 "MetaMask 插件"
2. 安装后创建钱包，**一定要抄写并保管好助记词**（12 个英文单词）
3. 助记词丢失 = 钱包里的钱全部丢失，务必手抄在纸上保存

### 第二步：准备资金
在钱包里存入一些钱，用于：
- **转账本金**：50-100 美元（推荐使用 USDC 或 USDT 稳定币）
- **Gas 费**：50-100 美元（用于支付转账手续费，需要 ETH）

**如何买币？**
1. 在币安（Binance）、欧易（OKX）等交易所注册账号
2. 用银行卡或支付宝买入 USDC 和 ETH
3. 提现到你的 MetaMask 钱包地址

---

## 📋 具体怎么操作？5 步完成

### 第 1 步：选择跨链桥平台

使用支持 LayerZero 协议的跨链桥，推荐：
- **Stargate Finance**（官方推荐，最安全）：https://stargate.finance
- **Aptos Bridge**（支持 Aptos 链）
- **Core DAO Bridge**（支持 Core 链）

**为什么选 Stargate？**
- LayerZero 官方推出的桥
- 手续费较低（0.06%）
- 支持的区块链最多

---

### 第 2 步：连接钱包

1. 打开 Stargate 网站
2. 点击右上角 **"Connect Wallet"（连接钱包）**
3. 选择 MetaMask，授权连接
4. **安全检查**：确认网址是 stargate.finance（不是仿冒网站）

---

### 第 3 步：选择跨链路线

在 Stargate 界面上：
- **From（从哪里转出）**：选择以太坊（Ethereum）
- **To（转到哪里）**：选择 Arbitrum
- **币种**：选择 USDC
- **金额**：输入 50 USDC

**为什么这样选？**
- 以太坊是主链，大部分人都有余额
- Arbitrum 是便宜的二层网络，手续费低
- USDC 是稳定币，价格不会波动

---

### 第 4 步：确认并执行转账

1. 点击 **"Transfer（转账）"** 按钮
2. MetaMask 会弹出窗口，显示需要支付的 Gas 费（大约 10-30 美元）
3. 点击 **"确认"**
4. 等待 3-10 分钟，转账完成

**如何确认到账？**
- 在 MetaMask 切换到 Arbitrum 网络
- 查看 USDC 余额，应该已经到账了

---

### 第 5 步：重复多次、多链、多币种

为了提高空投资格，建议：
- **多条链**：在 5-10 条不同的链之间转账（Ethereum、Arbitrum、Optimism、Polygon、Avalanche、BSC、Fantom 等）
- **多次数**：每条链至少转账 3-5 次
- **多币种**：尝试转 USDC、USDT、ETH 等不同币种
- **分散时间**：不要一天全部完成，分散到 4-8 周，每周操作 1-2 次

**推荐跨链路线清单**：
1. Ethereum → Arbitrum（USDC）
2. Arbitrum → Optimism（USDC）
3. Optimism → Polygon（USDT）
4. Polygon → Avalanche（USDC）
5. Avalanche → BSC（USDT）
6. BSC → Fantom（USDC）
7. Fantom → Ethereum（完成循环）

每条路线转账 2-3 次，总共 15-20 次转账。

---

## 💰 成本计算

| 项目 | 金额 | 说明 |
|------|------|------|
| **转账本金** | 100 美元 | 用 USDC/USDT，转来转去不会损失（稳定币） |
| **Gas 费** | 10-20 次 × 10 美元 = 100-200 美元 | 主要成本，无法避免 |
| **桥接手续费** | 100 美元 × 0.06% × 20 次 = 1.2 美元 | Stargate 收取，很少 |
| **总成本** | **约 100-200 美元** | 主要是 Gas 费 |

**潜在收益**：
- 如果 LayerZero 空投价值 2,000 美元（参考历史类似项目）
- 收益 = 2,000 - 200 = **1,800 美元**
- 回报率 = 1,800 / 200 = **9 倍**

---

## ⚠️ 注意事项和风险

### 风险 1：可能没有空投
LayerZero 官方**没有明确承诺**会空投，这只是根据过往经验的推测。

**应对**：
- 不要投入超过承受范围的钱
- 把这当成"买彩票"，有收益是惊喜，没有也不影响生活

### 风险 2：Gas 费波动
以太坊网络拥堵时，Gas 费可能暴涨到 50-100 美元一次。

**应对**：
- 选择凌晨或周末操作（Gas 费较低）
- 使用 Gas 费追踪工具（如 Etherscan Gas Tracker）
- 优先使用便宜的链（Arbitrum、Polygon）

### 风险 3：假网站钓鱼
诈骗分子会做假的 Stargate 网站，骗你授权后盗走你的钱。

**防范**：
- 一定要检查网址是否正确（stargate.finance）
- 使用浏览器书签保存官方网址
- 不要点击来源不明的链接
- 使用 Rabby Wallet 会自动提示风险网站

### 风险 4：操作失误
如果选错链或地址，钱可能永久丢失。

**防范**：
- 第一次先转小金额测试（10 美元）
- 确认到账后再转大金额
- 仔细核对"从哪里"和"到哪里"的网络选择

---

## 🎯 如何提高空投资格？

根据历史经验，以下行为会提高空投权重：

### 1. **多链交互**
在 7 条以上的不同区块链之间转账，展示你是"深度用户"。

### 2. **高频次**
每条链至少 3 次转账，总次数建议 15-30 次。

### 3. **大金额**
虽然转 10 美元和 1000 美元都算一次，但大金额可能有加权（未证实，建议每次 50-200 美元）。

### 4. **长时间跨度**
不要一天内完成所有操作，分散到 2-3 个月，每周 1-2 次，模拟真实用户行为。

### 5. **使用多个功能**
- 除了 Stargate，也尝试其他 LayerZero 生态应用
- 如 Aptos Bridge、Core Bridge、Rage Trade 等

### 6. **持有 NFT**
部分项目会给 Stargate NFT 持有者额外权重（可选，成本较高）。

---

## 📊 执行计划示例

**时间**：8 周（2 个月）
**频率**：每周 2 次
**总次数**：16 次

| 周数 | 操作 | 链路线 | 金额 |
|------|------|--------|------|
| 第 1 周 | 转账 2 次 | ETH → Arbitrum, Arbitrum → Optimism | 50 USDC × 2 |
| 第 2 周 | 转账 2 次 | Optimism → Polygon, Polygon → Avalanche | 50 USDC × 2 |
| 第 3 周 | 转账 2 次 | Avalanche → BSC, BSC → Fantom | 50 USDT × 2 |
| 第 4 周 | 转账 2 次 | Fantom → Arbitrum, Arbitrum → Polygon | 50 USDC × 2 |
| 第 5 周 | 转账 2 次 | Polygon → Optimism, Optimism → ETH | 50 USDT × 2 |
| 第 6 周 | 转账 2 次 | ETH → Avalanche, Avalanche → Arbitrum | 50 USDC × 2 |
| 第 7 周 | 转账 2 次 | Arbitrum → BSC, BSC → Polygon | 50 USDT × 2 |
| 第 8 周 | 转账 2 次 | Polygon → ETH, ETH → Arbitrum | 50 USDC × 2 |

**成本估算**：16 次 × 12 美元 Gas 费 = **约 200 美元**

---

## 📱 推荐工具

### 信息追踪
- **Layer3**（https://layer3.xyz）：任务聚合平台，追踪 LayerZero 任务
- **DefiLlama**：查看 Stargate TVL（总锁仓量）和数据
- **DeBank**：查看你的多链资产和交互历史

### Gas 费优化
- **Etherscan Gas Tracker**：查看实时 Gas 费，选择便宜时段
- **DeFi Saver**：设置 Gas 费提醒

### 安全工具
- **Revoke.cash**：检查并撤销钱包授权（定期清理）
- **Rabby Wallet**：比 MetaMask 更安全的钱包，会提示风险

---

## ❓ 常见问题

### Q1：我需要多少钱才能开始？
**A**：最低 100 美元（50 美元本金 + 50 美元 Gas 费），推荐 200-300 美元更充裕。

### Q2：一定会有空投吗？
**A**：不一定。LayerZero 官方没有承诺，这是根据行业惯例的推测。建议不要投入超过承受范围的资金。

### Q3：什么时候会发空投？
**A**：无法确定。可能是 2024 年底或 2025 年初，也可能更晚。需要保持关注官方 Twitter 和 Discord。

### Q4：我可以用多个钱包地址吗？
**A**：可以，但需要注意：
- 每个地址的资金来源不要相同（避免被识别为"女巫攻击"）
- 每个地址的操作时间、金额、路线要有差异
- 不要同时操作多个地址

### Q5：如果我操作错了，钱会丢吗？
**A**：常见错误：
- 选错网络：钱会卡住，需要手动切换网络找回（不会丢）
- 输错地址：可能永久丢失（所以第一次小额测试很重要）
- Gas 费不足：交易失败，钱还在钱包（不会丢）

---

## ✅ 一页检查清单

### 准备阶段
- [ ] 安装 MetaMask 或 Rabby 钱包
- [ ] 备份助记词（手抄在纸上，多份保存）
- [ ] 在交易所购买 ETH 和 USDC
- [ ] 提现到钱包地址（小额测试先）

### 执行阶段
- [ ] 访问 Stargate 官网（检查网址正确）
- [ ] 连接钱包，授权登录
- [ ] 第一次转账：ETH → Arbitrum，金额 10 美元（测试）
- [ ] 确认到账后，开始正式操作
- [ ] 完成 15-30 次跨链转账
- [ ] 覆盖 5-10 条不同区块链
- [ ] 分散到 6-12 周内完成

### 安全检查
- [ ] 每次转账前检查网址和网络
- [ ] 每周用 Revoke.cash 检查授权
- [ ] 定期用 DeBank 查看资产
- [ ] 不点击陌生链接
- [ ] 不在公共 WiFi 下操作

### 追踪阶段
- [ ] 关注 LayerZero 官方 Twitter
- [ ] 加入 LayerZero Discord 社区
- [ ] 定期查看 Layer3 任务更新
- [ ] 记录每次转账的时间和链路（备用）

---

## 🎓 总结

**LayerZero 跨链空投是**：
- ✅ 操作简单，适合新手
- ✅ 成本可控（200-300 美元）
- ✅ 潜在收益高（可能数千美元）
- ⚠️ 不保证一定有空投
- ⚠️ 需要耐心和时间（2-3 个月）

**建议心态**：
- 不要 All-in（全部身家投入）
- 当作学习 Web3 的实践机会
- 即使没有空投，也学会了跨链操作
- 有空投是惊喜，没有也不后悔

**下一步**：
现在就安装钱包，买入少量 ETH 和 USDC，开始第一次跨链转账吧！记住：**小额测试 → 确认成功 → 逐步加大**，祝你空投丰收！🎁
`,

  // ===== 操作步骤（5 步简化版）=====
  steps: [
    {
      step_number: 1,
      title: '准备钱包和资金',
      description: '安装 MetaMask 钱包，备份助记词，在交易所购买 100-200 美元的 ETH 和 USDC，提现到钱包。',
      estimated_time: '30 分钟',
    },
    {
      step_number: 2,
      title: '访问 Stargate 跨链桥',
      description: '打开 stargate.finance 官网（仔细检查网址），连接你的 MetaMask 钱包。',
      estimated_time: '5 分钟',
    },
    {
      step_number: 3,
      title: '第一次测试转账',
      description: '选择 Ethereum → Arbitrum，币种 USDC，金额 10 美元，完成第一次跨链转账并确认到账。',
      estimated_time: '15 分钟',
    },
    {
      step_number: 4,
      title: '执行完整计划',
      description: '按照计划在 5-10 条不同区块链之间转账 15-30 次，分散到 6-12 周完成，每周 1-2 次。',
      estimated_time: '每周 1-2 小时，持续 6-12 周',
    },
    {
      step_number: 5,
      title: '追踪和等待空投',
      description: '关注 LayerZero 官方 Twitter 和 Discord，定期检查钱包授权安全，耐心等待空投公告。',
      estimated_time: '每月 30 分钟检查',
    },
  ],
};

// ===== 执行函数 =====
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

    console.log('\n✅ LayerZero 跨链交互空投策略创建成功!');
    console.log(`   ID: ${response.data.data.id}`);
    console.log(`   Slug: ${response.data.data.slug}`);
    console.log(`   访问: http://localhost:3000/strategies/${response.data.data.slug}\n`);
  } catch (error) {
    console.error('\n❌ 创建失败:', error.response?.data || error.message);
  }
}

addStrategy();