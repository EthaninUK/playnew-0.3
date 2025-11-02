const axios = require('axios');
const crypto = require('crypto');

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_EMAIL = 'the_uk1@outlook.com';
const DIRECTUS_PASSWORD = 'Mygcdjmyxzg2026!';

function generateUUID() {
  return crypto.randomUUID();
}

// 新闻模板数据
const newsTemplates = [
  // 市场动态 (15条)
  { category: 'market', template: 'BTC突破${price}美元，创${period}新高', source: 'CoinDesk', important: true },
  { category: 'market', template: 'ETH价格突破${price}美元，DeFi总锁仓量达${tvl}亿', source: 'The Block', important: true },
  { category: 'market', template: '${exchange}交易所24小时交易量突破${volume}亿美元', source: 'CryptoQuant', important: false },
  { category: 'market', template: '${token}代币今日涨幅超${percent}%，市值排名升至第${rank}位', source: 'CoinMarketCap', important: false },
  { category: 'market', template: '加密货币总市值突破${cap}万亿美元，创历史新高', source: 'CoinGecko', important: true },
  { category: 'market', template: 'BNB突破${price}美元，币安生态TVL超${tvl}亿', source: 'DeFiLlama', important: false },
  { category: 'market', template: 'SOL价格涨至${price}美元，Solana生态NFT交易量激增', source: 'SolanaFloor', important: false },
  { category: 'market', template: 'ARB代币上涨${percent}%，Arbitrum网络日活突破${users}万', source: 'Arbiscan', important: false },
  { category: 'market', template: 'OP突破${price}美元，Optimism生态项目总数超${count}个', source: 'Optimism Analytics', important: false },
  { category: 'market', template: 'MATIC涨幅达${percent}%，Polygon zkEVM锁仓量创新高', source: 'Polygon Scan', important: false },
  { category: 'market', template: 'LINK突破${price}美元，Chainlink预言机集成数达${count}个', source: 'Chainlink Blog', important: false },
  { category: 'market', template: 'UNI涨至${price}美元，Uniswap V4白皮书引发关注', source: 'Uniswap Labs', important: true },
  { category: 'market', template: 'AVAX突破${price}美元，Avalanche子网数量突破${count}个', source: 'Avalanche Official', important: false },
  { category: 'market', template: 'ATOM上涨${percent}%，Cosmos生态IBC转账量创历史新高', source: 'Mintscan', important: false },
  { category: 'market', template: 'DOT涨至${price}美元，Polkadot平行链拍卖第${round}轮启动', source: 'Polkadot Network', important: false },

  // DeFi (12条)
  { category: 'defi', template: 'Aave V${version}正式上线，新增${count}个借贷市场', source: 'Aave Blog', important: true },
  { category: 'defi', template: 'Uniswap推出V${version}版本，引入${feature}新功能', source: 'Uniswap', important: true },
  { category: 'defi', template: 'Curve Finance总锁仓量突破${tvl}亿美元，veCRV持有者获${apy}%年化收益', source: 'Curve', important: false },
  { category: 'defi', template: 'Compound推出${feature}功能，用户可获得额外${percent}%收益', source: 'Compound', important: false },
  { category: 'defi', template: 'MakerDAO通过新提案，DAI稳定费率调整至${rate}%', source: 'MakerDAO Forum', important: false },
  { category: 'defi', template: 'Lido质押ETH总量突破${amount}万枚，占以太坊质押总量${percent}%', source: 'Lido Finance', important: true },
  { category: 'defi', template: 'PancakeSwap推出${feature}，BSC生态TVL增长${percent}%', source: 'PancakeSwap', important: false },
  { category: 'defi', template: 'GMX V${version}上线，永续合约交易量突破${volume}亿美元', source: 'GMX', important: false },
  { category: 'defi', template: 'Yearn Finance推出新策略，${token}资金池APY达${apy}%', source: 'Yearn', important: false },
  { category: 'defi', template: 'Convex Finance锁仓CRV突破${amount}亿枚，cvxCRV溢价达${percent}%', source: 'Convex', important: false },
  { category: 'defi', template: 'Frax Finance推出${product}，算法稳定币市值突破${cap}亿', source: 'Frax', important: false },
  { category: 'defi', template: 'Balancer V${version}上线，支持${feature}新型资金池', source: 'Balancer', important: false },

  // NFT (8条)
  { category: 'nft', template: 'Bored Ape #${id}以${price}ETH成交，创该系列${period}新高', source: 'OpenSea', important: true },
  { category: 'nft', template: 'Azuki推出${collection}系列，${hours}小时内售罄', source: 'Azuki Official', important: true },
  { category: 'nft', template: 'Pudgy Penguins地板价突破${price}ETH，24小时交易量增${percent}%', source: 'Blur', important: false },
  { category: 'nft', template: 'DeGods宣布迁移至${chain}，社区反响${sentiment}', source: 'DeGods', important: false },
  { category: 'nft', template: 'CryptoPunks #${id}以${price}ETH售出，买家为${buyer}', source: 'LooksRare', important: true },
  { category: 'nft', template: 'Moonbirds推出${feature}功能，持有者可获${benefit}权益', source: 'PROOF Collective', important: false },
  { category: 'nft', template: 'Doodles宣布与${brand}合作，推出${product}系列', source: 'Doodles', important: false },
  { category: 'nft', template: 'Otherside元宇宙地块交易量突破${volume}ETH，活跃用户达${users}万', source: 'Yuga Labs', important: false },

  // 技术创新 (10条)
  { category: 'tech', template: '以太坊${upgrade}升级成功激活，Gas费降低${percent}%', source: '以太坊基金会', important: true },
  { category: 'tech', template: 'zkSync Era主网上线，首日交易量突破${count}万笔', source: 'zkSync', important: true },
  { category: 'tech', template: 'Arbitrum推出${feature}技术，交易速度提升${times}倍', source: 'Offchain Labs', important: true },
  { category: 'tech', template: 'Optimism发布${version}版本，支持${feature}新功能', source: 'Optimism Foundation', important: false },
  { category: 'tech', template: 'Polygon推出zkEVM ${version}，兼容性达${percent}%', source: 'Polygon Labs', important: true },
  { category: 'tech', template: 'Starknet Alpha ${version}上线，TPS达${tps}笔/秒', source: 'Starkware', important: false },
  { category: 'tech', template: 'Celestia模块化区块链主网启动，支持${feature}数据可用性', source: 'Celestia Labs', important: true },
  { category: 'tech', template: 'Eigenlayer推出${feature}重质押协议，锁仓ETH突破${amount}万枚', source: 'Eigenlayer', important: false },
  { category: 'tech', template: 'Cosmos推出IBC ${version}，跨链转账成功率达${percent}%', source: 'Interchain Foundation', important: false },
  { category: 'tech', template: 'Sui Network主网上线，采用${consensus}共识机制', source: 'Mysten Labs', important: true },

  // 监管政策 (5条)
  { category: 'regulation', template: '美国SEC批准${count}只比特币现货ETF，总资金流入${amount}亿美元', source: 'SEC Official', important: true },
  { category: 'regulation', template: '香港证监会发布虚拟资产新规，${date}起生效', source: 'SFC', important: true },
  { category: 'regulation', template: '欧盟MiCA法案正式实施，加密企业需在${months}个月内合规', source: 'European Commission', important: true },
  { category: 'regulation', template: '日本金融厅批准${exchange}加密货币交易所牌照', source: 'FSA Japan', important: false },
  { category: 'regulation', template: '新加坡MAS更新数字支付代币指引，新增${count}项要求', source: 'MAS', important: false },
];

// 生成随机数据
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(daysAgo) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(randomInt(0, 23), randomInt(0, 59), randomInt(0, 59));
  return date.toISOString();
}

function generateNewsData() {
  const news = [];
  const usedTemplates = new Set();

  // 生成50条新闻
  for (let i = 0; i < 50; i++) {
    let template;
    let templateKey;

    // 确保不重复使用模板
    do {
      template = randomChoice(newsTemplates);
      templateKey = template.template + template.category;
    } while (usedTemplates.has(templateKey) && usedTemplates.size < newsTemplates.length);

    usedTemplates.add(templateKey);

    // 填充模板变量
    let title = template.template
      .replace('${price}', randomInt(1000, 99000))
      .replace('${period}', randomChoice(['年内', '月内', '周内', '季度']))
      .replace('${tvl}', randomInt(50, 500))
      .replace('${volume}', randomInt(10, 200))
      .replace('${token}', randomChoice(['ARB', 'OP', 'MATIC', 'AVAX', 'LINK', 'UNI']))
      .replace('${percent}', randomInt(5, 150))
      .replace('${rank}', randomInt(10, 50))
      .replace('${cap}', randomInt(1, 5))
      .replace('${users}', randomInt(10, 500))
      .replace('${count}', randomInt(50, 999))
      .replace('${exchange}', randomChoice(['Binance', 'Coinbase', 'OKX', 'Bybit']))
      .replace('${version}', randomChoice(['2', '3', '4']))
      .replace('${feature}', randomChoice(['动态手续费', '集中流动性', '闪电贷', '跨链桥', 'NFT市场']))
      .replace('${apy}', randomInt(5, 50))
      .replace('${rate}', randomInt(1, 10))
      .replace('${amount}', randomInt(100, 9999))
      .replace('${product}', randomChoice(['实体玩具', '服装系列', '游戏', '元宇宙地块']))
      .replace('${id}', randomInt(1, 9999))
      .replace('${hours}', randomInt(1, 24))
      .replace('${collection}', randomChoice(['Elemental', 'Beanz', 'Garden']))
      .replace('${chain}', randomChoice(['Ethereum', 'Polygon', 'Bitcoin']))
      .replace('${sentiment}', randomChoice(['热烈', '积极', '分化']))
      .replace('${buyer}', randomChoice(['知名收藏家', '匿名巨鲸', 'DAO组织']))
      .replace('${benefit}', randomChoice(['空投', '治理', '优先购买']))
      .replace('${brand}', randomChoice(['Adidas', 'Nike', 'Gucci']))
      .replace('${upgrade}', randomChoice(['Shapella', 'Dencun', 'Prague']))
      .replace('${times}', randomInt(2, 100))
      .replace('${tps}', randomInt(1000, 100000))
      .replace('${consensus}', randomChoice(['PoS', 'DPoS', 'BFT']))
      .replace('${date}', randomChoice(['6月1日', '7月1日', '2024年底']))
      .replace('${months}', randomInt(3, 12));

    // 生成摘要
    const summaries = [
      `根据最新数据显示，${title.substring(0, 30)}...这一变化引发市场广泛关注，分析师认为这可能预示着新一轮趋势的开始。`,
      `业内消息称，${title.substring(0, 30)}...此举将对整个生态系统产生深远影响，投资者需密切关注后续发展。`,
      `据官方公告，${title.substring(0, 30)}...这标志着该项目在技术创新和市场拓展方面取得重要进展。`,
      `市场数据表明，${title.substring(0, 30)}...多位行业专家对此表示乐观，认为长期发展前景看好。`,
      `最新统计显示，${title.substring(0, 30)}...这一趋势反映出市场参与者信心持续增强。`,
    ];

    const tags = {
      'market': ['行情分析', '价格预测', '市值排名', '交易量'],
      'defi': ['去中心化金融', '流动性挖矿', '收益优化', 'TVL'],
      'nft': ['数字藏品', '元宇宙', 'PFP', '地板价'],
      'tech': ['技术升级', 'Layer2', '扩容方案', '零知识证明'],
      'regulation': ['合规', '监管政策', 'ETF', '牌照'],
    };

    const newsItem = {
      id: generateUUID(),
      url: `https://example.com/news/${Date.now()}-${i}`,
      title,
      content: `# ${title}\n\n## 概述\n\n${randomChoice(summaries)}\n\n## 详细信息\n\n根据可靠消息来源，这一事件的发生将对整个加密货币市场产生重要影响。业内专家普遍认为，这标志着行业发展进入新阶段。\n\n## 市场影响\n\n- 短期影响：市场情绪积极，交易活跃度上升\n- 中期影响：可能带动相关项目发展\n- 长期影响：推动行业整体向前发展\n\n## 专家观点\n\n多位分析师表示看好后续发展，建议投资者保持关注。\n\n## 风险提示\n\n投资有风险，请谨慎决策，做好风险管理。`,
      source: template.source,
      source_type: 'news',
      category: template.category,
      ai_summary: randomChoice(summaries),
      status: 'published',
      content_published_at: randomDate(randomInt(0, 30)), // 最近30天内
      published_at: randomDate(randomInt(0, 30)),
      priority: template.important ? randomInt(8, 10) : randomInt(1, 7),
    };

    news.push(newsItem);
  }

  return news;
}

async function main() {
  try {
    console.log('🔐 登录 Directus...');
    const authResponse = await axios.post(`${DIRECTUS_URL}/auth/login`, {
      email: DIRECTUS_EMAIL,
      password: DIRECTUS_PASSWORD,
    });

    const accessToken = authResponse.data.data.access_token;
    console.log('✅ 登录成功！');

    console.log('\n📝 生成50条测试新闻...');
    const newsData = generateNewsData();

    console.log('\n📤 开始导入新闻到 Directus...');
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < newsData.length; i++) {
      const item = newsData[i];
      try {
        await axios.post(`${DIRECTUS_URL}/items/news`, item, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        successCount++;
        process.stdout.write(`\r进度: ${successCount + failCount}/${newsData.length} (成功: ${successCount}, 失败: ${failCount})`);
      } catch (error) {
        failCount++;
        if (failCount === 1) {
          console.error('\n❌ 首次失败错误详情:', error.response?.data || error.message);
        }
        process.stdout.write(`\r进度: ${successCount + failCount}/${newsData.length} (成功: ${successCount}, 失败: ${failCount})`);
      }
    }

    console.log('\n\n✨ 导入完成！');
    console.log(`📊 统计信息:`);
    console.log(`   - 总计: ${newsData.length} 条`);
    console.log(`   - 成功: ${successCount} 条`);
    console.log(`   - 失败: ${failCount} 条`);

    // 统计各分类数量
    const categoryCount = {};
    newsData.forEach(item => {
      categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;
    });

    console.log(`\n📑 分类统计:`);
    Object.entries(categoryCount).forEach(([category, count]) => {
      const categoryNames = {
        'market': '市场动态',
        'defi': 'DeFi',
        'nft': 'NFT',
        'tech': '技术创新',
        'regulation': '监管政策',
      };
      console.log(`   - ${categoryNames[category]}: ${count} 条`);
    });

    const importantCount = newsData.filter(item => item.is_important).length;
    console.log(`\n🔥 重要快讯: ${importantCount} 条`);

  } catch (error) {
    console.error('\n❌ 错误:', error.response?.data || error.message);
    process.exit(1);
  }
}

main();
