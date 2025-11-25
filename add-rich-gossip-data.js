const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_ADMIN_EMAIL = 'the_uk1@outlook.com';
const DIRECTUS_ADMIN_PASSWORD = 'Mygcdjmyxzg2026!';

// 丰富的八卦数据模板
const gossipTemplates = [
  // 项目传闻
  {
    title: '独家:某知名L2项目团队内讧,CTO疑似已离职',
    summary: '据多位内部人士透露,该项目CTO已经两周未在办公室露面,团队Slack显示"离开"状态。项目方否认相关传闻。',
    ai_summary: '多个信息源指向同一方向,但缺乏官方确认。建议关注项目GitHub提交记录和即将到来的技术更新。',
    content: '# 独家爆料\n\n昨日有匿名开发者在社区爆料,称某知名L2扩容方案的CTO已经悄然离职...\n\n## 证据链\n1. GitHub最近3周无提交\n2. 技术社区AMA缺席\n3. 内部Discord管理员权限被移除',
    source: '匿名爆料',
    gossip_tags: ['项目传闻', 'Layer2', '团队变动'],
    verification_status: 'verifying',
    credibility_score: 65,
    likes_count: Math.floor(Math.random() * 200) + 50,
    comments_count: Math.floor(Math.random() * 50) + 10,
    news_type: 'gossip',
    status: 'published',
    category: 'crypto-general'
  },
  {
    title: '🔥 V神疑似清仓某DeFi协议代币,巨鲸地址转出$5M',
    summary: '链上数据显示,一个被标记为"Vitalik关联地址"的钱包今日凌晨将价值500万美元的某DeFi代币转入交易所。',
    ai_summary: '链上数据确凿,但地址归属存疑。该地址历史上确实与V神有过交互,但无法100%确认当前控制人。',
    content: '# 链上追踪\n\n## 交易详情\n- 转出地址: 0x1234...5678\n- 接收地址: Binance热钱包\n- 金额: 500万枚代币($5M)\n- 时间: 2025-11-06 03:22 UTC\n\n该地址在2021年收到过V神的转账...',
    source: 'Etherscan',
    gossip_tags: ['KOL动态', 'DeFi', '巨鲸异动'],
    verification_status: 'confirmed',
    credibility_score: 85,
    likes_count: Math.floor(Math.random() * 500) + 200,
    comments_count: Math.floor(Math.random() * 100) + 30,
    news_type: 'gossip',
    status: 'published',
    category: 'crypto-general'
  },
  {
    title: '某交易所被传技术故障导致用户资产"清零",官方回应系统维护',
    summary: '今日上午多位用户反馈该交易所APP显示账户余额为0,引发恐慌。官方称是系统维护导致显示异常,资产安全无虞。',
    ai_summary: '类似事件在行业内时有发生,多为显示Bug。但考虑到近期行业风险事件,建议持有该交易所资产的用户保持警惕。',
    content: '# 事件时间线\n\n**10:30** 首位用户在Twitter爆料余额清零\n**10:45** 大量用户涌入Telegram群组确认\n**11:00** 官方发布公告:系统维护中\n**11:30** 部分用户余额恢复显示\n\n## 社区反应\n- 提币通道暂未开放\n- 客服系统崩溃\n- 股价盘前跌4%',
    source: 'Twitter用户爆料',
    gossip_tags: ['交易所八卦', '技术故障', '用户资产'],
    verification_status: 'confirmed',
    credibility_score: 75,
    likes_count: Math.floor(Math.random() * 300) + 100,
    comments_count: Math.floor(Math.random() * 80) + 20,
    news_type: 'gossip',
    status: 'published',
    category: 'crypto-general'
  },
  {
    title: '传闻:某顶级VC正在秘密清仓AI板块代币',
    summary: 'CT上多位KOL爆料,某顶级VC机构正在通过OTC渠道大量抛售AI主题代币,疑似对板块前景不看好。',
    ai_summary: '纯属传闻,无实质证据。该VC官方否认相关说法,称仍持有所有已投资项目代币。建议观望。',
    content: '# 传闻来源\n\n某匿名交易员在私密Telegram群组爆料...\n\n## 疑似清仓项目\n- 项目A: 已减持60%?\n- 项目B: 完全退出?\n- 项目C: 寻找接盘方\n\n**VC官方回应**: "纯属造谣,我们对AI赛道长期看好"',
    source: '匿名交易员',
    gossip_tags: ['融资消息', 'VC动态', 'AI板块'],
    verification_status: 'debunked',
    credibility_score: 35,
    likes_count: Math.floor(Math.random() * 150) + 30,
    comments_count: Math.floor(Math.random() * 40) + 5,
    news_type: 'gossip',
    status: 'published',
    category: 'crypto-general'
  },
  {
    title: '独家:某公链基金会内部会议录音泄露,揭露代币经济模型重大缺陷',
    summary: '一份疑似某公链基金会内部会议录音在暗网流传,内容涉及代币通胀模型存在设计缺陷,可能导致长期抛压。',
    ai_summary: '录音真实性存疑,音频专家指出有剪辑痕迹。但讨论内容与该公链实际情况部分吻合,不排除是真实会议片段。',
    content: '# 录音关键内容\n\n> "我们的Staking收益率太高了,每年新增供应量达12%,这在牛市没问题,但熊市会成为死亡螺旋..."\n\n> "团队解锁节奏也有问题,明年Q2会有一波大抛压..."\n\n## 技术分析\n- 音频时长: 47分钟\n- 参会人数: 约8人\n- 会议时间: 疑似2025年10月\n\n**项目方回应**: 尚未回应',
    source: '暗网匿名用户',
    gossip_tags: ['团队内幕', '经济模型', '公链'],
    verification_status: 'verifying',
    credibility_score: 55,
    likes_count: Math.floor(Math.random() * 250) + 80,
    comments_count: Math.floor(Math.random() * 60) + 15,
    news_type: 'gossip',
    status: 'published',
    category: 'crypto-general'
  },
  {
    title: '某DeFi协议创始人被传卷款跑路,社区一片哗然',
    summary: '该协议创始人已3天未在社交媒体露面,官方Telegram群组被解散,网站无法访问,TVL骤降90%。',
    ai_summary: '多项证据指向Rug Pull,但尚未完全确认。建议持有该协议代币的用户立即检查资产安全。',
    content: '# 异常事件汇总\n\n## 时间线\n- **11月3日**: 创始人最后一条推特\n- **11月4日**: 官方Telegram群解散\n- **11月5日**: 网站返回404\n- **11月6日**: TVL从$50M跌至$5M\n\n## 链上证据\n- 多签钱包中3/5签名者已转移资产\n- 流动性池被大量提取\n- 项目代币暴跌95%',
    source: '社区用户举报',
    gossip_tags: ['项目传闻', 'DeFi', 'Rug Pull'],
    verification_status: 'verifying',
    credibility_score: 80,
    likes_count: Math.floor(Math.random() * 400) + 150,
    comments_count: Math.floor(Math.random() * 120) + 40,
    news_type: 'gossip',
    status: 'published',
    category: 'crypto-general'
  },
  {
    title: '爆料:某交易所与做市商存在利益输送,操纵币价',
    summary: '匿名员工爆料称,该交易所与某做市商签订秘密协议,通过虚假交易量和价格操纵手段获利。',
    ai_summary: '爆料者未提供实质证据,且匿名身份无法核实。该交易所否认指控,称交易数据公开透明。',
    content: '# 爆料内容\n\n## 指控要点\n1. 虚增交易量达80%\n2. 配合做市商拉高出货\n3. 内幕交易获利超$10M\n\n## 涉及币种\n- 币A: 疑似操纵\n- 币B: 有异常交易记录\n- 币C: 价格波动异常\n\n**交易所声明**: "完全不实,保留追究法律责任的权利"',
    source: '匿名前员工',
    gossip_tags: ['交易所八卦', '市场操纵', '内幕交易'],
    verification_status: 'unverified',
    credibility_score: 45,
    likes_count: Math.floor(Math.random() * 180) + 40,
    comments_count: Math.floor(Math.random() * 50) + 8,
    news_type: 'gossip',
    status: 'published',
    category: 'crypto-general'
  },
  {
    title: '独家:某NFT项目方团队疑似自己买自己,虚增地板价',
    summary: '链上侦探发现,该NFT项目80%的交易来自5个关联地址,疑似团队自导自演制造"热度"。',
    ai_summary: '链上数据支持这一推论,地址之间的资金流向高度重合。但项目方声称这是"大户建仓行为"。',
    content: '# 链上分析\n\n## 可疑地址\n- 地址1: 0xABCD...1234 (购买47次)\n- 地址2: 0xEFGH...5678 (购买52次)\n- 地址3: 0xIJKL...9012 (购买38次)\n\n## 资金流向\n- 三个地址均从同一CEX提币\n- 交易时间高度集中(凌晨2-4点)\n- 购买后立即提高挂单价\n\n**项目方回应**: "这是巧合,我们欢迎社区监督"',
    source: 'NFT链上侦探',
    gossip_tags: ['项目传闻', 'NFT', '数据造假'],
    verification_status: 'verifying',
    credibility_score: 70,
    likes_count: Math.floor(Math.random() * 220) + 60,
    comments_count: Math.floor(Math.random() * 70) + 18,
    news_type: 'gossip',
    status: 'published',
    category: 'crypto-general'
  },
  {
    title: '🚨 某热门Meme币创始人身份曝光:曾因诈骗入狱',
    summary: '社区调查发现,该Meme币匿名创始人真实身份为2018年ICO骗局主谋,曾在美国被判刑2年。',
    ai_summary: '身份信息基本确认,法庭记录可查。这对项目信誉构成重大打击,但Meme币市场往往不理性。',
    content: '# 身份调查报告\n\n## 证据链\n1. **LinkedIn档案匹配**: 工作经历时间点吻合\n2. **法庭文件**: 2019年诈骗案判决书\n3. **照片对比**: 人脸识别相似度92%\n\n## 前科记录\n- 2018年: 主导ICO骗局,卷走$8M\n- 2019年: 认罪,判刑2年\n- 2021年: 出狱\n- 2024年: 以新身份推出Meme币\n\n**社区反应**: 分裂(有人喊"退出",有人说"无所谓")',
    source: '社区调查组',
    gossip_tags: ['项目传闻', 'Meme币', '创始人背景'],
    verification_status: 'confirmed',
    credibility_score: 90,
    likes_count: Math.floor(Math.random() * 600) + 250,
    comments_count: Math.floor(Math.random() * 150) + 50,
    news_type: 'gossip',
    status: 'published',
    category: 'crypto-general'
  },
  {
    title: '传闻:某公链即将宣布与主流支付公司合作',
    summary: 'CT上流传该公链将在下周发布重磅合作消息,合作方疑似Visa或Mastercard。项目方回应"敬请期待"。',
    ai_summary: '纯属市场猜测,无任何官方信息支持。类似"合作预告"经常被用于炒作币价,建议理性对待。',
    content: '# 传闻来源\n\n某知名KOL昨日发推特暗示:\n> "下周某公链会有Big News,涉及传统支付巨头,你猜是谁?😏"\n\n## 社区猜测\n- 70%认为是Visa\n- 20%认为是Mastercard\n- 10%认为是PayPal\n\n## 项目方态度\n官方推特转发该推文,配文"👀"\n\n**分析师看法**: "典型炒作手法,即使合作也可能只是试点"',
    source: 'Twitter KOL',
    gossip_tags: ['项目传闻', '公链', '合作消息'],
    verification_status: 'unverified',
    credibility_score: 40,
    likes_count: Math.floor(Math.random() * 160) + 35,
    comments_count: Math.floor(Math.random() * 45) + 6,
    news_type: 'gossip',
    status: 'published',
    category: 'crypto-general'
  },
  {
    title: '独家:某交易所将上线"杠杆挖矿"功能,或引发清算潮',
    summary: '内部消息称,该交易所正在测试新功能,允许用户借入资金参与流动性挖矿,杠杆最高10倍。',
    ai_summary: '功能本身存在风险,但消息真实性存疑。该交易所产品团队未确认相关计划。',
    content: '# 功能详情(传闻)\n\n## 产品逻辑\n1. 用户抵押BTC/ETH\n2. 借入稳定币(最高10倍杠杆)\n3. 参与流动性挖矿\n4. 收益自动还款,剩余归用户\n\n## 风险点\n- 币价暴跌 → 抵押品清算\n- 挖矿收益不足以覆盖利息\n- 智能合约漏洞\n\n**行业评论**: "这是在玩火,2020年的教训还不够吗?"',
    source: '匿名内部人士',
    gossip_tags: ['交易所八卦', 'DeFi', '产品创新'],
    verification_status: 'unverified',
    credibility_score: 50,
    likes_count: Math.floor(Math.random() * 190) + 45,
    comments_count: Math.floor(Math.random() * 55) + 12,
    news_type: 'gossip',
    status: 'published',
    category: 'crypto-general'
  },
  {
    title: '爆料:某Layer2项目空投规则存在"后门",团队可自由修改',
    summary: '安全研究员发现,该项目空投合约包含管理员权限,可在快照后修改规则,引发公平性质疑。',
    ai_summary: '技术细节已被多个安全团队验证,确实存在该后门。但项目方解释称这是为了"防止女巫攻击"。',
    content: '# 技术分析\n\n## 合约代码审查\n```solidity\nfunction setAirdropRules(address[] memory _whitelist) public onlyOwner {\n  // 管理员可随时修改白名单\n  whitelist = _whitelist;\n}\n```\n\n## 风险说明\n- 快照后规则可改 → 承诺的空投可能落空\n- 无TimeLeft机制 → 无法提前预知变动\n- 多签控制 → 仅3/5即可执行\n\n**项目方回应**: "这是安全需要,我们承诺不滥用权限"',
    source: '安全研究员',
    gossip_tags: ['技术争议', 'Layer2', '空投规则'],
    verification_status: 'confirmed',
    credibility_score: 85,
    likes_count: Math.floor(Math.random() * 350) + 120,
    comments_count: Math.floor(Math.random() * 90) + 25,
    news_type: 'gossip',
    status: 'published',
    category: 'crypto-general'
  },
  {
    title: '某顶级KOL被指控收黑钱喊单,涉及金额超$500K',
    summary: '社区举报该KOL在未披露的情况下,接受项目方付费推广,涉嫌误导散户接盘。',
    ai_summary: '链上转账记录显示该KOL确实收到过项目方代币,但无法证明是"付费推广"还是"正常投资"。',
    content: '# 举报证据\n\n## 链上记录\n- 2025年10月15日: 收到项目方转账500K代币\n- 2025年10月16日: 发推特"强烈看好该项目"\n- 2025年10月20日: 代币解锁后转入交易所\n\n## KOL回应\n"这是我自己的投资决策,与任何付费推广无关"\n\n## 社区质疑\n- 为何不披露持仓?\n- 为何推广后立即卖出?\n- 散户亏损谁负责?\n\n**监管动态**: 某国证监会已介入调查',
    source: '社区举报',
    gossip_tags: ['KOL动态', '喊单争议', '利益输送'],
    verification_status: 'verifying',
    credibility_score: 75,
    likes_count: Math.floor(Math.random() * 280) + 90,
    comments_count: Math.floor(Math.random() * 75) + 20,
    news_type: 'gossip',
    status: 'published',
    category: 'crypto-general'
  },
  {
    title: '独家:某稳定币发行方储备金不足,面临挤兑风险',
    summary: '审计报告显示,该稳定币实际储备仅覆盖70%流通量,远低于承诺的1:1美元储备。',
    ai_summary: '审计报告真实性尚待核实,但该稳定币近期脱锚现象频繁,值得警惕。',
    content: '# 审计报告关键数据\n\n## 储备构成\n- 现金及现金等价物: 40%\n- 商业票据: 30%\n- 其他资产: 30% (含部分高风险债券)\n\n## 问题分析\n1. 商业票据流动性差\n2. "其他资产"估值存疑\n3. 极端情况下无法保证1:1兑付\n\n**发行方声明**: "我们的储备完全透明,欢迎独立审计"',
    source: '第三方审计机构',
    gossip_tags: ['项目传闻', '稳定币', '储备金'],
    verification_status: 'verifying',
    credibility_score: 65,
    likes_count: Math.floor(Math.random() * 320) + 110,
    comments_count: Math.floor(Math.random() * 85) + 22,
    news_type: 'gossip',
    status: 'published',
    category: 'crypto-general'
  },
  {
    title: '传闻:某GameFi项目即将"跑路式升级",玩家资产恐清零',
    summary: '社区发现项目方正在推动"V2升级",但新版本不兼容旧资产,且未提供合理迁移方案。',
    ai_summary: '项目方称这是"技术必要性",但迁移细节含糊不清。历史上类似情况多为变相跑路。',
    content: '# V2升级细节\n\n## 官方说法\n- "优化游戏经济模型"\n- "提升用户体验"\n- "旧资产可通过特殊方式迁移"(未说明具体方式)\n\n## 社区担忧\n1. 旧NFT价值归零?\n2. 游戏币无法1:1兑换?\n3. 之前充值的钱打水漂?\n\n## 可疑迹象\n- 团队成员陆续删除社交媒体\n- 官方Discord禁言普通用户\n- TVL在过去7天下降60%\n\n**玩家呼吁**: "给出明确迁移方案,否则集体维权"',
    source: '玩家社区',
    gossip_tags: ['项目传闻', 'GameFi', '资产安全'],
    verification_status: 'verifying',
    credibility_score: 70,
    likes_count: Math.floor(Math.random() * 240) + 75,
    comments_count: Math.floor(Math.random() * 65) + 16,
    news_type: 'gossip',
    status: 'published',
    category: 'crypto-general'
  },
  {
    title: '🔥 独家爆料:某顶级VC内部LP会议纪要泄露,透露投资策略调整',
    summary: '一份疑似某顶级加密VC的内部LP季度会议纪要在Telegram流传,披露其将大幅削减DeFi投资,转向AI和RWA赛道。',
    ai_summary: '文件格式和内容与该VC的风格高度吻合,但官方尚未确认真伪。如果属实,可能引发DeFi板块抛售潮。',
    content: '# 会议纪要关键内容\n\n## 投资策略调整\n- **DeFi**: 从40%降至15% ("创新枯竭,监管风险上升")\n- **AI**: 从10%提升至35% ("叙事强劲,长期看好")\n- **RWA**: 从5%提升至20% ("合规赛道,机构资金涌入")\n- **其他**: 保持30%\n\n## 已投项目处理\n- 3个DeFi项目将"战略减持"\n- 2个GameFi项目"寻求退出"\n- 5个AI项目"追加投资"\n\n**市场影响**: 相关DeFi代币今日普跌5-8%',
    source: 'Telegram匿名渠道',
    gossip_tags: ['融资消息', 'VC动态', '赛道轮动'],
    verification_status: 'unverified',
    credibility_score: 60,
    likes_count: Math.floor(Math.random() * 420) + 150,
    comments_count: Math.floor(Math.random() * 110) + 35,
    news_type: 'gossip',
    status: 'published',
    category: 'crypto-general'
  }
];

async function main() {
  try {
    console.log('🔑 Logging in to Directus...');

    const loginResponse = await axios.post(`${DIRECTUS_URL}/auth/login`, {
      email: DIRECTUS_ADMIN_EMAIL,
      password: DIRECTUS_ADMIN_PASSWORD,
    });

    const token = loginResponse.data.data.access_token;
    console.log('✅ Login successful\n');

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    console.log('📝 Creating rich gossip data...\n');

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < gossipTemplates.length; i++) {
      const gossip = gossipTemplates[i];

      try {
        // 生成唯一的slug
        const slug = `gossip-${Date.now()}-${i}`;

        // 随机生成发布时间(最近7天内)
        const daysAgo = Math.floor(Math.random() * 7);
        const hoursAgo = Math.floor(Math.random() * 24);
        const publishDate = new Date();
        publishDate.setDate(publishDate.getDate() - daysAgo);
        publishDate.setHours(publishDate.getHours() - hoursAgo);

        const newsItem = {
          ...gossip,
          slug,
          url: `https://playnew.ai/news/${slug}`,
          source_type: 'manual', // 手动创建的八卦内容
          content_published_at: publishDate.toISOString(),
          view_count: Math.floor(Math.random() * 5000) + 500,
          published_at: publishDate.toISOString(), // 同步发布时间
        };

        const response = await axios.post(
          `${DIRECTUS_URL}/items/news`,
          newsItem,
          { headers }
        );

        successCount++;
        console.log(`✅ [${successCount}/${gossipTemplates.length}] Created: ${gossip.title.substring(0, 50)}...`);

        // 避免请求过快
        await new Promise(resolve => setTimeout(resolve, 200));

      } catch (error) {
        errorCount++;
        console.error(`❌ Failed to create gossip: ${gossip.title.substring(0, 30)}...`);
        console.error(`   Error: ${error.response?.data?.errors?.[0]?.message || error.message}`);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log(`✨ Summary:`);
    console.log(`   ✅ Successfully created: ${successCount}`);
    console.log(`   ❌ Failed: ${errorCount}`);
    console.log(`   📊 Total: ${gossipTemplates.length}`);
    console.log('='.repeat(60));

    // 统计现有八卦数据
    console.log('\n📊 Fetching gossip statistics...');
    const statsResponse = await axios.get(
      `${DIRECTUS_URL}/items/news?filter[news_type][_eq]=gossip&aggregate[count]=*`,
      { headers }
    );

    console.log(`\n🎉 Current total gossip count: ${statsResponse.data.data.length || 0}`);

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

main();
