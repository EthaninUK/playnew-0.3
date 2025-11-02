const axios = require('axios');
const crypto = require('crypto');

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_EMAIL = 'the_uk1@outlook.com';
const DIRECTUS_PASSWORD = 'Mygcdjmyxzg2026!';

function generateUUID() {
  return crypto.randomUUID();
}

// 20条新鲜八卦快讯
const gossipNews = [
  {
    title: 'V神深夜发推：下一代以太坊将实现"完全量子抗性"',
    summary: '以太坊创始人 Vitalik Buterin 在凌晨发推特暗示，正在研究的密码学方案可能让以太坊成为首个完全抵御量子计算攻击的主流区块链。社区讨论热烈。',
    source: 'Twitter',
    important: true,
    priority: 9
  },
  {
    title: '币安赵长鹏出狱后首次公开露面，透露将投资AI+Web3项目',
    summary: 'CZ在迪拜会议上表示，未来将专注于人工智能与区块链结合的创新项目，预计投资规模达10亿美元。此消息引发市场强烈反响。',
    source: 'CoinDesk',
    important: true,
    priority: 10
  },
  {
    title: 'OpenAI CEO Sam Altman被曝持有价值2亿美元比特币',
    summary: '据链上数据分析师披露，Sam Altman的钱包地址与多笔大额比特币转账有关。OpenAI官方暂未回应此事。',
    source: 'Arkham Intelligence',
    important: true,
    priority: 8
  },
  {
    title: 'Coinbase内部人士：公司正秘密开发自己的Layer2网络',
    summary: '匿名消息源称，Coinbase正在基于OP Stack构建专属L2，代号"Apollo"，预计Q2上线。官方回应"不予置评"。',
    source: 'The Block',
    important: true,
    priority: 8
  },
  {
    title: '某巨鲸地址24小时内买入3000枚BTC，疑似机构建仓',
    summary: '链上监测显示，一个与贝莱德相关的地址在过去24小时内累计买入价值超2亿美元的比特币，市场猜测这是ETF资金在暗中布局。',
    source: 'Whale Alert',
    important: true,
    priority: 9
  },
  {
    title: 'Justin Sun在推特上与马斯克打赌：BTC年底能否破10万',
    summary: '孙宇晨公开向马斯克发起100万美元赌约，赌BTC在今年12月31日前能否突破10万美元。马斯克回复"有趣"。',
    source: 'Twitter',
    important: false,
    priority: 6
  },
  {
    title: 'Paradigm合伙人：90%的加密VC都会在下轮熊市中消失',
    summary: 'Paradigm高管在播客中直言，当前市场上的加密风投机构过于泛滥，真正有价值的不超过20家。言论引发圈内激烈争论。',
    source: 'Bankless',
    important: false,
    priority: 7
  },
  {
    title: 'BAYC创始人被曝正在开发链游，将空投给NFT持有者',
    summary: '知情人士透露，Yuga Labs正在秘密开发一款3A级链游，所有BAYC、MAYC持有者将获得游戏内资产空投。团队尚未公开确认。',
    source: 'NFT Evening',
    important: false,
    priority: 7
  },
  {
    title: 'Do Kwon在狱中写信：Terra崩盘是"完美风暴"的意外',
    summary: 'Terra创始人在给支持者的信中首次详细描述UST脱锚经过，称是多重因素叠加导致，并非蓄意诈骗。但法律专家对此说法存疑。',
    source: 'Bloomberg',
    important: true,
    priority: 8
  },
  {
    title: 'a16z投资的某DeFi项目代码被发现后门，团队紧急澄清',
    summary: '安全公司在审计某知名DeFi协议时发现可疑代码，疑似预留了管理员提款权限。项目方解释是"测试遗留代码"，已紧急修复。',
    source: 'PeckShield',
    important: true,
    priority: 9
  },
  {
    title: 'Solana联创：如果重来一次，不会选择Rust语言开发',
    summary: 'Anatoly Yakovenko在访谈中坦言，Rust的学习曲线太陡峭，限制了Solana生态开发者数量。此言论引发开发者社区讨论。',
    source: 'Unchained Podcast',
    important: false,
    priority: 5
  },
  {
    title: '神秘买家花500ETH买下CryptoPunk地板，疑似名人入场',
    summary: '某新注册钱包一次性扫货10个Punk地板，链上分析显示资金来自Coinbase，市场猜测可能是明星或运动员匿名购入。',
    source: 'OpenSea',
    important: false,
    priority: 6
  },
  {
    title: 'Circle CEO暗示：USDC可能会推出收益版本与Tether竞争',
    summary: 'Jeremy Allaire在财报电话会上透露，正在评估推出生息型稳定币的可行性，直接对标USDT在新兴市场的优势。',
    source: 'The Block',
    important: true,
    priority: 8
  },
  {
    title: '前Facebook高管加入Uniswap Labs，担任首席产品官',
    summary: 'Meta前产品VP宣布加入Uniswap团队，将主导V4及移动端产品开发。这是传统科技巨头人才流入Web3的又一案例。',
    source: 'Uniswap Blog',
    important: false,
    priority: 6
  },
  {
    title: '某L2项目被曝团队内讧，CTO已离职但官方未公布',
    summary: 'LinkedIn信息显示某知名Layer2项目的技术负责人已更新状态为"寻找新机会"，但项目官方Twitter仍显示其在职。团队内部矛盾曝光。',
    source: 'Crypto Twitter',
    important: false,
    priority: 5
  },
  {
    title: 'Gary Gensler被拍到与Coinbase律师共进晚餐，引发联想',
    summary: 'SEC主席与Coinbase首席法务官在华盛顿某高档餐厅用餐的照片流出，市场猜测双方可能在就诉讼案进行私下和解谈判。',
    source: 'CoinTelegraph',
    important: true,
    priority: 9
  },
  {
    title: '某DeFi协议金库被发现存放大量"垃圾币"，疑似内部人控盘',
    summary: '社区成员检查财库后发现，多个流动性极差的代币占据了30%资产，质疑是团队内部操纵。DAO治理论坛讨论激烈。',
    source: 'Discord',
    important: false,
    priority: 6
  },
  {
    title: 'Arthur Hayes新文章：预测美联储6月降息，BTC将冲击12万',
    summary: 'BitMEX创始人发布最新宏观分析文章，认为流动性拐点即将到来，建议配置BTC、ETH和Solana生态资产。',
    source: 'Medium',
    important: true,
    priority: 8
  },
  {
    title: 'Vitalik钱包被发现持有某Meme币，社区疯狂抢购致涨10倍',
    summary: '链上数据显示V神钱包地址持有少量某冷门Meme代币，消息传出后该币种24小时涨幅超1000%。V神随后澄清是空投代币。',
    source: 'Etherscan',
    important: false,
    priority: 7
  },
  {
    title: 'Blur创始人Pacman真实身份疑似被扒出，本人急删社交账号',
    summary: '某匿名侦探在Twitter发布线索，称找到了Blur创始人的真实身份和LinkedIn档案。Pacman的多个社交账号随后设为私密。',
    source: 'Crypto Twitter',
    important: false,
    priority: 6
  }
];

function randomDate(daysAgo) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60), Math.floor(Math.random() * 60));
  return date.toISOString();
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

    console.log('\n📝 准备添加20条新鲜八卦快讯...');

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < gossipNews.length; i++) {
      const item = gossipNews[i];

      const newsItem = {
        id: generateUUID(),
        url: `https://example.com/gossip/${Date.now()}-${i}`,
        title: item.title,
        content: `# ${item.title}\n\n${item.summary}\n\n## 背景信息\n\n这一消息在加密社区引发了广泛讨论，多位KOL纷纷转发评论。业内人士认为，此类事件反映出当前加密行业的动态变化和市场情绪。\n\n## 社区反应\n\n推特上相关话题讨论热度持续上升，不少投资者表示正在密切关注事态发展。一些分析师认为这可能对相关资产价格产生短期影响。\n\n## 后续关注\n\n我们将持续跟踪报道此事件的最新进展，为读者带来第一手资讯。\n\n---\n\n*免责声明：以上内容仅供参考，不构成投资建议。*`,
        source: item.source,
        source_type: 'rss',
        category: 'news',
        news_type: 'gossip', // 八卦类型
        ai_summary: item.summary,
        status: 'published',
        content_published_at: randomDate(Math.floor(Math.random() * 3)), // 最近3天内
        published_at: randomDate(Math.floor(Math.random() * 3)),
        priority: item.priority,
      };

      try {
        await axios.post(`${DIRECTUS_URL}/items/news`, newsItem, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        successCount++;
        console.log(`✅ [${successCount}/${gossipNews.length}] ${item.title.substring(0, 40)}...`);
      } catch (error) {
        failCount++;
        console.error(`❌ [失败] ${item.title.substring(0, 40)}...`);
        if (failCount === 1) {
          console.error('   错误详情:', error.response?.data || error.message);
        }
      }
    }

    console.log('\n✨ 导入完成！');
    console.log(`📊 统计信息:`);
    console.log(`   - 总计: ${gossipNews.length} 条`);
    console.log(`   - 成功: ${successCount} 条`);
    console.log(`   - 失败: ${failCount} 条`);
    console.log(`   - 重要快讯: ${gossipNews.filter(n => n.important).length} 条`);

    console.log('\n🔥 已添加的八卦快讯包括：');
    console.log('   - V神量子抗性以太坊言论');
    console.log('   - CZ出狱后投资计划');
    console.log('   - Sam Altman持币传闻');
    console.log('   - Coinbase秘密开发L2');
    console.log('   - 巨鲸买入BTC');
    console.log('   - 以及更多行业内幕和八卦...');

  } catch (error) {
    console.error('\n❌ 错误:', error.response?.data || error.message);
    process.exit(1);
  }
}

main();
