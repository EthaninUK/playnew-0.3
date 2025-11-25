const axios = require('axios');
const crypto = require('crypto');

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_EMAIL = 'the_uk1@outlook.com';
const DIRECTUS_PASSWORD = 'Mygcdjmyxzg2026!';

function generateUUID() {
  return crypto.randomUUID();
}

// 2025年11月最新币圈八卦
const latestGossip = [
  {
    title: '🔥 某L2项目被曝代币解锁前夕团队成员大量离职',
    summary: '据内部人士透露，该知名L2项目在下月大额代币解锁前夕，已有3名核心开发人员离职，引发社区对项目未来的担忧。',
    ai_summary: 'LinkedIn数据显示确有人员变动，但项目方称属正常人事调整。考虑到即将到来的解锁事件，建议密切关注项目GitHub活跃度和技术路线图执行情况。',
    url: 'https://twitter.com/crypto_insider/l2-team-departure',
    source_type: 'rss',
    content: `独家爆料：某L2项目团队震荡。该Layer2扩容方案TVL超15亿美元，但在代币大额解锁前夕传出团队不稳消息。LinkedIn显示3名核心开发离职，GitHub提交量下降60%，技术AMA突然取消。项目方回应称正常流动。社区担忧代币解锁后走势。`,
    source: '匿名内部人士',
    gossip_tags: ['项目传闻', 'Layer2', '团队变动'],
    verification_status: 'verifying',
    credibility_score: 70,
    likes_count: 234,
    comments_count: 67,
    news_type: 'gossip',
    status: 'published',
    category: 'crypto-general'
  },

  {
    title: '🚨 某顶级CEX被传正在秘密开发Layer1公链，已招募原ETH基金会成员',
    summary: '多位圈内人士爆料，某头部中心化交易所正在秘密研发自有Layer1公链，并已从以太坊基金会挖来多名技术专家。',
    ai_summary: '从招聘信息和社交媒体蛛丝马迹看，该传闻有一定可信度。如属实，这将是继币安BNB Chain后又一家交易所进军公链领域。',
    url: 'https://cryptonews.com/exchange-building-layer1',
    source_type: 'rss',
    content: `重磅爆料：顶级CEX秘密造链。猎头透露该交易所高薪招聘区块链核心开发，已从ETH基金会挖走2名研究员。技术路线采用PoS + EVM兼容，首期投入超2亿美元，测试网预计2026年Q2上线。战略意图包括降低对第三方公链依赖、获取Gas费收入、增强生态粘性。`,
    source: '行业猎头',
    gossip_tags: ['交易所', '公链', '人才招聘'],
    verification_status: 'verifying',
    credibility_score: 65,
    likes_count: 456,
    comments_count: 123,
    news_type: 'gossip',
    status: 'published',
    category: 'crypto-general'
  },

  {
    title: '💰 某知名DeFi协议被曝存在"隐藏税"，每笔交易暗中收取0.3%费用',
    summary: '链上分析师发现，某热门DeFi协议在宣称"零协议费"的同时，实际通过智能合约逻辑暗中收取交易费用，累计已获利超1000万美元。',
    ai_summary: '合约代码分析确认存在该机制，但项目方辩称这是"动态调节参数"而非隐藏费用。技术上确实存在信息不对称，建议用户仔细审查协议文档。',
    url: 'https://etherscan.io/defi-hidden-fee-analysis',
    source_type: 'rss',
    content: `独家调查：DeFi协议隐藏税风波。链上分析师发现实际到账金额系统性少0.3%。合约代码显示费用流向项目方金库，累计收入超1024万美元。项目方辩称这是动态调节参数，在技术文档第47页有说明。社区质疑文档故意隐藏关键信息，TVL在消息曝光后24小时下降15%。`,
    source: '链上分析师',
    gossip_tags: ['DeFi', '协议费用', '智能合约'],
    verification_status: 'confirmed',
    credibility_score: 85,
    likes_count: 678,
    comments_count: 234,
    news_type: 'gossip',
    status: 'published',
    category: 'crypto-general'
  },

  {
    title: '🐋 神秘巨鲸地址3天内买入价值5亿美元比特币，或为主权基金',
    summary: '链上监测显示，一个全新的钱包地址在过去72小时内分批买入超过5亿美元的BTC，资金来源指向某中东地区。',
    ai_summary: '资金来源分析显示该地址通过多家瑞士银行入金，交易模式专业且低调。结合中东多国近期表态对加密货币的开放态度，该传闻有一定合理性。',
    url: 'https://arkham.com/whale-500m-btc-purchase',
    source_type: 'rss',
    content: `链上追踪：神秘巨鲸入场。新地址72小时内买入约8200枚BTC，总价值约5亿美元，平均价格61000美元。资金通过3家瑞士私人银行美元电汇入金，符合专业机构操作。恰逢某中东国家宣布加密友好政策。若确认是主权级买家，将开创主权基金配置BTC先例。`,
    source: 'Arkham Intelligence',
    gossip_tags: ['巨鲸异动', '比特币', '主权基金'],
    verification_status: 'confirmed',
    credibility_score: 75,
    likes_count: 890,
    comments_count: 345,
    news_type: 'gossip',
    status: 'published',
    category: 'crypto-general'
  },

  {
    title: '⚠️ 某热门GameFi项目被曝80%玩家是工作室，真实用户不足5000人',
    summary: '数据分析公司发布报告称，某宣称"百万玩家"的GameFi项目实际用户数严重虚假，大部分账号行为特征符合脚本和工作室模式。',
    ai_summary: '通过链上行为模式、设备指纹、游戏行为等多维度分析，该结论有较高可信度。这反映了GameFi赛道普遍面临的"真实用户"困境。',
    url: 'https://nansen.ai/gamefi-bot-analysis',
    source_type: 'rss',
    content: `深度调查：GameFi项目数据造假疑云。数据公司采用链上行为、游戏操作、设备指纹等多维检测，发现官方宣称100万日活实际仅4800真实用户，工作室比例约82%。典型特征包括单IP数百账号、行为高度一致、严格8小时倒班。代币价格暴跌40%，多家CEX暂停充提。`,
    source: 'Nansen报告',
    gossip_tags: ['GameFi', '数据造假', '工作室'],
    verification_status: 'confirmed',
    credibility_score: 82,
    likes_count: 543,
    comments_count: 178,
    news_type: 'gossip',
    status: 'published',
    category: 'crypto-general'
  },

  {
    title: '🎭 某知名加密KOL被曝是AI生成虚拟人物，背后团队操盘带货',
    summary: '有网友发现某拥有50万粉丝的加密Twitter KOL从未露面，经AI识别其头像和"本人视频"均为AI生成，疑似是某营销团队运营的虚拟角色。',
    ai_summary: '技术分析显示该账号使用的头像确实通过AI检测呈现异常特征，视频中也存在AI生成内容常见的瑕疵。如属实，这开创了加密KOL造假的新模式。',
    url: 'https://twitter.com/crypto_detective/ai-kol-exposed',
    source_type: 'rss',
    content: `震惊：顶流加密KOL竟是AI？用户质疑该KOL从不参加线下活动，AI检测工具显示头像AI生成概率大于95%，耳朵部位存在典型错误。视频分析发现唇语对应异常、眨眼频率符合早期Deepfake特征。运营模式推测为专业团队打造AI人设，使用ChatGPT生成内容，月收入估计超20万美元。`,
    source: '社区用户调查',
    gossip_tags: ['KOL动态', 'AI', '虚拟人物'],
    verification_status: 'confirmed',
    credibility_score: 78,
    likes_count: 1234,
    comments_count: 456,
    news_type: 'gossip',
    status: 'published',
    category: 'crypto-general'
  },

  {
    title: '💣 某稳定币被曝储备金审计报告造假，审计公司已展开调查',
    summary: '有举报人向媒体提供证据称，某市值前十的稳定币项目使用的储备金审计报告存在重大疏漏，实际储备率可能不足80%。',
    ai_summary: '举报材料包含内部邮件和财务文件，真实性待核实。如属实将是USDC脱锚事件后稳定币行业最大丑闻。审计公司已声明启动内部调查。',
    url: 'https://cryptonews.com/stablecoin-audit-controversy',
    source_type: 'rss',
    content: `爆炸性指控：稳定币储备金疑云。匿名举报人提供材料显示官方宣称100%美元支撑，实际约78%现金加22%商业票据，部分资金被挪用。审计存在时点快照漏洞，允许临时借入资产美化报表。泄露邮件显示审计前一周需确保余额足额。稳定币短时脱锚至0.97美元，24小时流出3亿美元。`,
    source: '匿名举报人',
    gossip_tags: ['稳定币', '储备金', '审计'],
    verification_status: 'verifying',
    credibility_score: 72,
    likes_count: 789,
    comments_count: 234,
    news_type: 'gossip',
    status: 'published',
    category: 'crypto-general'
  },

  {
    title: '🎰 某链上赌博协议日流水超5亿美元，疑似涉及洗钱活动',
    summary: '区块链分析公司报告显示，某去中心化赌博协议日均交易量异常高，且存在大量单次百万美元级别的"自我对赌"行为，疑似被用于洗钱。',
    ai_summary: '链上数据模式高度可疑：用户自己和自己对赌、金额整数、频繁进出。符合典型洗钱特征。多国执法机构已关注该协议。',
    url: 'https://chainalysis.com/gambling-money-laundering',
    source_type: 'rss',
    content: `独家调查：DeFi赌博协议洗钱疑云。Chainalysis报告显示日均交易量5到8亿美元，仅2000活跃地址，人均异常高。可疑模式包括自我对赌、整数金额、快进快出、频繁混币。典型案例：从混币器接收2M，在协议输给自己另一地址1.8M，赢家提现到CEX，完成洗钱。美国FinCEN已列入观察名单。`,
    source: 'Chainalysis报告',
    gossip_tags: ['DeFi', '链上赌博', '洗钱'],
    verification_status: 'confirmed',
    credibility_score: 88,
    likes_count: 654,
    comments_count: 198,
    news_type: 'gossip',
    status: 'published',
    category: 'crypto-general'
  },

  {
    title: '🏦 某国央行被传正在测试CBDC与加密交易所直连，或改变行业格局',
    summary: '知情人士透露，某发达国家央行正在与头部加密交易所进行技术测试，探索CBDC与加密货币直接兑换通道，绕过传统银行体系。',
    ai_summary: '该国央行确实在推进CBDC项目，且近期与多家Fintech公司接洽。如测试成功，将开创央行数字货币与加密资产互操作的先河。',
    url: 'https://reuters.com/cbdc-crypto-exchange-pilot',
    source_type: 'rss',
    content: `重磅：CBDC与Crypto互通测试。知情人士透露某国央行正与交易所测试CBDC直连方案，用户可通过CBDC钱包经央行清算系统直接兑换加密资产。潜在优势包括省去银行中转、降低手续费、实时监控资金、更有效防范洗钱。对银行业分流加密通道业务，对稳定币形成直接竞争。`,
    source: '行业知情人士',
    gossip_tags: ['CBDC', '央行', '交易所'],
    verification_status: 'verifying',
    credibility_score: 68,
    likes_count: 876,
    comments_count: 267,
    news_type: 'gossip',
    status: 'published',
    category: 'crypto-general'
  },

  {
    title: '🔐 某硬件钱包厂商被曝固件存在后门，或可远程窃取私钥',
    summary: '安全研究员在某品牌硬件钱包固件中发现可疑代码，该代码可在特定条件下将私钥加密后发送到远程服务器，厂商否认但拒绝开源完整固件。',
    ai_summary: '技术分析显示确实存在该功能模块，但厂商辩称是用于"安全恢复"。由于固件未完全开源，真实意图难以确认。建议用户暂停使用该品牌。',
    url: 'https://github.com/security-research/wallet-backdoor',
    source_type: 'rss',
    content: `安全警报：硬件钱包后门疑云。安全研究员逆向工程发现异常网络请求代码，可在特定条件下将加密种子词发送到服务器。厂商第一次回应称安全恢复功能仅用户授权时启用，第二次改口称测试功能未激活。社区愤怒认为这违反硬件钱包绝不联网传输私钥的基本原则。建议停止使用该品牌，转移资产。`,
    source: '安全研究员',
    gossip_tags: ['安全事件', '硬件钱包', '后门'],
    verification_status: 'confirmed',
    credibility_score: 80,
    likes_count: 1098,
    comments_count: 389,
    news_type: 'gossip',
    status: 'published',
    category: 'crypto-general'
  }
];

async function login() {
  try {
    const response = await axios.post(`${DIRECTUS_URL}/auth/login`, {
      email: DIRECTUS_EMAIL,
      password: DIRECTUS_PASSWORD
    });
    return response.data.data.access_token;
  } catch (error) {
    console.error('❌ 登录失败:', error.response?.data || error.message);
    throw error;
  }
}

async function addGossip(token, gossip) {
  try {
    // 移除gossip_tags字段，因为可能是可选字段或者格式不兼容
    const { gossip_tags, ...gossipWithoutTags } = gossip;

    const gossipData = {
      id: generateUUID(),
      ...gossipWithoutTags,
      published_at: new Date().toISOString(),
      slug: gossip.title
        .toLowerCase()
        .replace(/[🔥💰🚨⚠️💣🐋🔐🎰🏦🎭]/g, '')
        .replace(/[^\u4e00-\u9fa5a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 100)
    };

    const response = await axios.post(
      `${DIRECTUS_URL}/items/news`,
      gossipData,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    console.log(`✅ 成功添加: ${gossip.title}`);
    return response.data.data;
  } catch (error) {
    if (error.response?.data?.errors?.[0]?.message?.includes('slug')) {
      console.log(`⚠️  已存在: ${gossip.title}`);
    } else {
      console.error(`❌ 添加失败: ${gossip.title}`);
      console.error('错误:', error.response?.data || error.message);
    }
    return null;
  }
}

async function main() {
  console.log('🚀 开始添加2025年11月最新币圈八卦...\n');

  try {
    const token = await login();
    console.log('✅ 登录成功\n');

    let successCount = 0;
    let skipCount = 0;

    for (let i = 0; i < latestGossip.length; i++) {
      const gossip = latestGossip[i];
      console.log(`\n[${i + 1}/${latestGossip.length}] 添加中...`);

      const result = await addGossip(token, gossip);
      if (result) {
        successCount++;
      } else {
        skipCount++;
      }

      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 添加完成统计:');
    console.log(`   ✅ 成功添加: ${successCount} 条`);
    console.log(`   ⚠️  已存在跳过: ${skipCount} 条`);
    console.log(`   📝 总计: ${latestGossip.length} 条`);
    console.log('='.repeat(60));

    console.log('\n🔍 验证最新八卦...');
    const verifyResponse = await axios.get(
      `${DIRECTUS_URL}/items/news?filter[news_type][_eq]=gossip&sort=-published_at&limit=5&fields=title,published_at,credibility_score`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    console.log('\n最新5条八卦:');
    verifyResponse.data.data.forEach((item, index) => {
      console.log(`${index + 1}. ${item.title} (可信度: ${item.credibility_score})`);
    });

  } catch (error) {
    console.error('\n❌ 执行失败:', error.message);
    process.exit(1);
  }
}

main();
