const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_EMAIL = 'the_uk1@outlook.com';
const DIRECTUS_PASSWORD = 'Mygcdjmyxzg2026!';

// Simple UUID v4 generator
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const sampleNews = [
  {
    id: generateUUID(),
    url: 'https://www.coindesk.com/markets/2025/01/bitcoin-breaks-new-high',
    source_type: 'article',
    title: 'Bitcoin突破新高：机构投资持续涌入',
    content: `# Bitcoin突破新高

Bitcoin价格在今日突破历史新高，达到$XX,XXX美元，创下新的里程碑。

## 机构持续买入

- **灰度比特币信托(GBTC)**: 持仓量持续增长
- **MicroStrategy**: 再次增持XXX枚BTC
- **特斯拉**: 持有价值超过XX亿美元的BTC

## 市场分析

分析师认为，本轮上涨主要由以下因素驱动：

1. 机构投资者大量买入
2. 通胀预期上升
3. 供应量减少（减半效应）
4. DeFi生态繁荣

## 未来展望

多位分析师预测，Bitcoin可能在未来几个月内继续上涨，目标价格在$XXX,XXX - $XXX,XXX之间。
`,
    ai_summary: 'Bitcoin价格突破历史新高，机构投资者持续买入，市场情绪乐观。灰度、MicroStrategy等机构持仓继续增加。',
    source: 'CoinDesk',
    category: 'market',
    status: 'published',
    review_status: 'approved',
    quality_score: 90,
    is_duplicate: false,
    ai_processed: true,
    ai_provider: 'openai',
    priority: 1,
    content_published_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2小时前
    published_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: generateUUID(),
    url: 'https://blog.uniswap.org/uniswap-v4-coming-soon',
    source_type: 'article',
    title: 'Uniswap V4即将上线：AMM革命性升级',
    content: `# Uniswap V4：下一代AMM

Uniswap Labs宣布V4版本即将在Q2上线，带来革命性的Hooks机制。

## 核心特性

### 1. Hooks机制

Hooks允许开发者在交易生命周期的关键节点注入自定义逻辑：

- \`beforeSwap\`: 交易前执行
- \`afterSwap\`: 交易后执行
- \`beforeAddLiquidity\`: 添加流动性前
- \`afterRemoveLiquidity\`: 移除流动性后

### 2. Singleton合约

所有流动性池共享同一个合约，大幅降低gas费用。

### 3. Flash Accounting

新的会计系统减少不必要的代币转账，进一步优化gas。

## 应用场景

Hooks机制将支持：

- **TWAMM**: 时间加权平均做市商
- **动态费率**: 根据波动率自动调整手续费
- **限价单**: 在AMM中实现订单簿功能
- **自动止损**: 保护LP免受无常损失

## 对DeFi的影响

V4的推出将：

1. 降低交易成本
2. 提升资本效率
3. 激发更多DeFi创新
4. 巩固Uniswap的领先地位
`,
    ai_summary: 'Uniswap宣布V4版本即将上线，引入Hooks机制，允许开发者自定义流动性池逻辑，为DeFi创新打开新的大门。',
    source: 'Uniswap Blog',
    category: 'defi',
    status: 'published',
    review_status: 'approved',
    quality_score: 95,
    is_duplicate: false,
    ai_processed: true,
    ai_provider: 'openai',
    priority: 1,
    content_published_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5小时前
    published_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: generateUUID(),
    url: 'https://ethereum.org/en/roadmap/dencun/',
    source_type: 'article',
    title: '以太坊坎昆升级成功：L2成本降低90%',
    content: `# 坎昆升级：以太坊扩容的里程碑

以太坊在区块高度XXX,XXX成功激活坎昆升级，标志着以太坊扩容路线图迈出关键一步。

## EIP-4844: Proto-Danksharding

核心提案EIP-4844引入了blob交易类型：

- **Blob大小**: 每个blob ~125KB
- **每区块blob数**: 最多6个
- **数据存储**: 仅存储18天
- **成本降低**: L2交易费用下降90%

## L2网络受益

### Arbitrum

- 交易费用从$X.XX降至$0.XX
- TPS提升XX%
- TVL增长XX%

### Optimism

- 成本降低XX%
- 新用户增长XX%
- 生态项目活跃度提升

### Base

- Coinbase的Base链受益最大
- 日交易量突破XXX万笔

## 对生态的影响

1. **用户体验改善**: 更低的费用吸引更多用户
2. **开发者友好**: 更容易构建消费级应用
3. **竞争力提升**: 相对其他L1更具优势
4. **扩容路线验证**: 为Danksharding铺平道路

## 下一步

以太坊核心开发者正在研究：

- Full Danksharding
- 进一步提升blob容量
- 更多L2互操作性方案
`,
    ai_summary: '以太坊坎昆升级顺利完成，EIP-4844正式激活，Rollup成本大幅降低。Arbitrum、Optimism等L2网络已开始享受成本红利。',
    source: 'Ethereum Foundation',
    category: 'tech',
    status: 'published',
    review_status: 'approved',
    quality_score: 98,
    is_duplicate: false,
    ai_processed: true,
    ai_provider: 'openai',
    priority: 1,
    content_published_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1天前
    published_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: generateUUID(),
    url: 'https://www.bloomberg.com/news/articles/sec-approves-ethereum-etf',
    source_type: 'article',
    title: 'SEC批准现货以太坊ETF：加密市场迎来新里程碑',
    content: `# 现货以太坊ETF获批

美国证券交易委员会(SEC)今日宣布批准8家机构的现货以太坊ETF申请。

## 获批机构

- BlackRock (iShares)
- Fidelity
- Grayscale
- VanEck
- 21Shares
- Invesco Galaxy
- Franklin Templeton
- Bitwise

## 产品详情

### 费率对比

| 机构 | 管理费率 |
|------|---------|
| BlackRock | 0.25% |
| Fidelity | 0.25% |
| Grayscale | 2.5% |
| Bitwise | 0.24% |

### 交易时间

- 开始交易: XX月XX日
- 交易时段: NYSE交易时间
- 最小申购: 1股

## 市场影响

### 即时反应

- ETH价格上涨XX%
- 交易量激增XXX%
- 期货溢价扩大

### 长期意义

1. **机构准入**: 传统投资者更容易配置ETH
2. **市场成熟**: 加密货币被主流接受
3. **价格发现**: 更有效的价格形成机制
4. **合规推进**: 监管框架进一步明确

## 分析师观点

多位分析师认为，ETH ETF的影响可能超过BTC ETF：

- ETH的应用场景更广泛
- DeFi和NFT生态更活跃
- 技术升级路线更清晰
- Staking收益提供额外吸引力

## 投资建议

投资者应注意：

⚠️ 管理费率差异较大
⚠️ 无法参与Staking获取收益
⚠️ 溢价/折价风险
✅ 提供合规投资渠道
✅ 降低保管风险
`,
    ai_summary: 'SEC正式批准多家机构的现货以太坊ETF申请，继比特币ETF后，加密货币再次获得传统金融市场认可。',
    source: 'Bloomberg',
    category: 'regulation',
    status: 'published',
    review_status: 'approved',
    quality_score: 92,
    is_duplicate: false,
    ai_processed: true,
    ai_provider: 'openai',
    priority: 2,
    content_published_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3天前
    published_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: generateUUID(),
    url: 'https://www.theblock.co/post/pudgy-penguins-retail-expansion',
    source_type: 'article',
    title: 'Pudgy Penguins登陆零售：NFT品牌走向主流',
    content: `# Pudgy Penguins的逆袭

曾经的蓝筹NFT项目Pudgy Penguins正在证明，NFT不仅仅是数字收藏品。

## 零售扩张

### 合作伙伴

- **Target**: 美国1800家门店
- **Walmart**: 加拿大市场
- **Amazon**: 全球线上销售

### 产品线

1. **毛绒玩具**: $9.99 - $24.99
2. **盲盒系列**: 每个$4.99
3. **收藏卡牌**: 即将推出

每个实体玩具附带NFT铸造码，连接数字和实体世界。

## 商业成绩

- Q4销售额: $XX百万
- 全球出货: XXX万件
- 用户触达: XXX万人

## IP运营策略

### 1. 多元化变现

不依赖二级交易，而是：
- 品牌授权
- 商品销售
- 内容制作
- 游戏开发

### 2. 社区赋能

- NFT持有者享受分红
- 社区参与产品设计
- 独家空投奖励

### 3. Web3整合

- Pudgy World 虚拟世界
- 社交平台整合
- 链上互动机制

## 对NFT行业的启示

Pudgy Penguins的成功说明：

1. **IP价值**: NFT可以构建真正的品牌
2. **实体结合**: 不能局限于数字世界
3. **用户拓展**: 走出加密圈才能做大
4. **商业模式**: 需要持续的价值创造

## 其他项目跟进

受Pudgy启发，多个NFT项目开始布局：

- Doodles: 与麦当劳合作
- Azuki: 推出潮牌服装
- Cool Cats: 开发动画片

## 未来规划

Pudgy Penguins路线图：

- Q2: 推出手游
- Q3: 动画系列上线
- Q4: 更多零售合作
- 2026: 主题乐园(?)
`,
    ai_summary: 'Pudgy Penguins宣布与全球2000家零售店合作，推出实体玩具产品。NFT IP开始在传统零售市场展现商业价值。',
    source: 'The Block',
    category: 'nft',
    status: 'published',
    review_status: 'approved',
    quality_score: 88,
    is_duplicate: false,
    ai_processed: true,
    ai_provider: 'openai',
    priority: 2,
    content_published_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2天前
    published_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

async function login() {
  const response = await fetch(`${DIRECTUS_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: DIRECTUS_EMAIL,
      password: DIRECTUS_PASSWORD,
    }),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  const data = await response.json();
  return data.data.access_token;
}

async function addNews() {
  try {
    console.log('\n📰 Adding sample news...\n');

    const token = await login();
    console.log('✅ Logged in\n');

    let successCount = 0;
    let errorCount = 0;

    for (const news of sampleNews) {
      try {
        const response = await fetch(`${DIRECTUS_URL}/items/news`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(news),
        });

        if (response.ok) {
          successCount++;
          console.log(`✅ Added: ${news.title}`);
        } else {
          errorCount++;
          const error = await response.text();
          console.error(`❌ Failed to add ${news.title}:`);
          console.error(`   ${error.substring(0, 150)}`);
        }
      } catch (error) {
        errorCount++;
        console.error(`❌ Error adding ${news.title}:`, error.message);
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log(`✨ Summary:`);
    console.log(`   Success: ${successCount}`);
    console.log(`   Failed: ${errorCount}`);
    console.log(`   Total: ${sampleNews.length}`);
    console.log('='.repeat(50) + '\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('');
    process.exit(1);
  }
}

addNews();
