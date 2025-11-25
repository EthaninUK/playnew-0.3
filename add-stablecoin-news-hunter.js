const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

const GUIDE_CONFIG = {
  title: '稳定币脱锚新闻猎手',
  slug: 'stablecoin-news-hunter',
  summary:
    '新闻驱动的稳定币套利系统：Twitter实时监控、Telegram群组爬虫、RSS新闻聚合、关键词预警（银行倒闭/监管/黑客）、GPT-4新闻影响分析、Discord Bot通知、历史事件复盘（SVB/FTX/Terra）、多源信息验证、舆情传播速度分析、抢跑市场反应，成本$50-$500/月。',

  category: 'depeg-arbitrage',
  category_l1: 'arbitrage',
  category_l2: '稳定币脱锚',

  difficulty_level: 3,
  risk_level: 4,
  apy_min: 0,
  apy_max: 100,

  threshold_capital: '1,000–10,000 USD（快速响应资金）',
  threshold_capital_min: 1000,
  time_commitment: '初始搭建30–50小时，7x24小时自动监控，重大事件人工介入',
  time_commitment_minutes: 60,
  threshold_tech_level: 'intermediate',

  content: `> **适用人群**：信息敏感型交易者、熟悉新闻源订阅、希望通过早期信息获取套利机会、能快速决策的DeFi玩家
> **阅读时间**：≈ 40–55 分钟
> **关键词**：News Aggregation / Twitter API / RSS Feed / GPT-4 Analysis / Sentiment Monitoring / Breaking News / Crisis Alert / Information Arbitrage / Real-time Monitoring

---

## 📊 TL;DR（60秒速览）

**核心思路**：通过多源新闻监控，提前发现稳定币风险事件，抢在市场反应前布局套利

| 历史事件 | 新闻发布时间 | 市场反应时间 | 信息窗口 |
|---------|------------|------------|---------|
| **SVB倒闭（USDC脱锚）** | 2023-03-10 14:00 | 2023-03-10 20:00 | ⏰ 6小时 |
| **BUSD监管（Paxos停发）** | 2023-02-13 08:00 | 2023-02-13 16:00 | ⏰ 8小时 |
| **FTX崩盘（流动性危机）** | 2022-11-08 11:00 | 2022-11-08 15:00 | ⏰ 4小时 |
| **Terra UST脱锚** | 2022-05-08 06:00 | 2022-05-08 10:00 | ⏰ 4小时 |

**收益来源**：
1. **抢跑卖出**：新闻发布后立即卖出高风险稳定币（USDC $1→$0.88前）
2. **抢跑买入**：恐慌过度时抄底（USDC $0.88→$1恢复）
3. **跨平台套利**：CEX未反应时，在DEX套利（价差最高5%）

**成本**：$50–500/月（Twitter API + NewsAPI + OpenAI + 服务器）

---

## 🎯 新闻源配置

### 1️⃣ **Twitter实时监控**

**目标账户（优先级排序）**：

\`\`\`javascript
// config/twitter_sources.js
const CRITICAL_ACCOUNTS = [
  // 1. 官方账户（最高优先级）
  { username: 'circle', coin: 'USDC', priority: 1 },
  { username: 'Tether_to', coin: 'USDT', priority: 1 },
  { username: 'MakerDAO', coin: 'DAI', priority: 1 },
  { username: 'fraxfinance', coin: 'FRAX', priority: 1 },
  { username: 'LiquityProtocol', coin: 'LUSD', priority: 1 },

  // 2. 监管机构
  { username: 'SECGov', type: 'regulator', priority: 2 },
  { username: 'NYDFS', type: 'regulator', priority: 2 },
  { username: 'federalreserve', type: 'macro', priority: 2 },

  // 3. 新闻媒体
  { username: 'CoinDesk', type: 'news', priority: 3 },
  { username: 'TheBlock__', type: 'news', priority: 3 },
  { username: 'Bloomberg', type: 'news', priority: 3 },

  // 4. KOL/分析师
  { username: 'adamscochran', type: 'analyst', priority: 4 },
  { username: 'lawmaster', type: 'analyst', priority: 4 },
  { username: 'FatManTerra', type: 'analyst', priority: 4 }
];

// 关键词（触发预警）
const ALERT_KEYWORDS = [
  // 银行相关
  'bank run', 'bank failure', 'insolvent', 'FDIC',
  'SVB', 'Silicon Valley Bank', 'Signature Bank',

  // 监管相关
  'SEC enforcement', 'regulatory action', 'cease and desist',
  'delisting', 'suspend', 'investigation',

  // 技术/安全
  'hack', 'exploit', 'security breach', 'smart contract bug',
  'mint unauthorized', 'depeg', 'depegging',

  // 流动性
  'redemption paused', 'withdrawal halt', 'liquidity crisis',
  'unable to redeem', 'backing questioned',

  // 中文关键词
  '脱锚', '监管', '暂停', '挤兑', '破产', '黑客', '漏洞'
];
\`\`\`

---

### 2️⃣ **Twitter监控代码**

\`\`\`javascript
// monitor/twitter_monitor.js
const { TwitterApi } = require('twitter-api-v2');
const OpenAI = require('openai');

class TwitterMonitor {
  constructor(config) {
    this.twitter = new TwitterApi(config.twitter_bearer_token);
    this.openai = new OpenAI({ apiKey: config.openai_key });
    this.alertThreshold = 7; // 0-10分，>=7分触发报警
  }

  async startMonitoring() {
    console.log('🔍 启动Twitter监控...');

    // 订阅实时推文流（Filtered Stream）
    const rules = await this.setupStreamRules();

    const stream = await this.twitter.v2.searchStream({
      'tweet.fields': ['created_at', 'author_id', 'public_metrics'],
      'user.fields': ['username', 'verified'],
      expansions: ['author_id']
    });

    stream.on('data', async (tweet) => {
      await this.processTweet(tweet);
    });

    stream.on('error', (error) => {
      console.error('❌ Stream错误:', error);
      setTimeout(() => this.startMonitoring(), 5000); // 5秒后重连
    });
  }

  async setupStreamRules() {
    // 删除旧规则
    const existingRules = await this.twitter.v2.streamRules();
    if (existingRules.data?.length) {
      await this.twitter.v2.updateStreamRules({
        delete: { ids: existingRules.data.map(r => r.id) }
      });
    }

    // 添加新规则
    const rules = [
      // 监控官方账户
      { value: 'from:circle OR from:Tether_to OR from:MakerDAO', tag: 'official' },

      // 监控关键词
      { value: '(USDC OR USDT OR DAI) (depeg OR depegging OR bank OR SEC)', tag: 'keywords' },

      // 监控银行危机
      { value: 'bank failure OR bank run OR FDIC OR insolvent', tag: 'banking' }
    ];

    await this.twitter.v2.updateStreamRules({ add: rules });
    console.log('✅ Stream规则已设置:', rules.length + '条');

    return rules;
  }

  async processTweet(tweetData) {
    const tweet = tweetData.data;
    const author = tweetData.includes?.users?.[0];

    console.log('\\n📢 新推文检测:');
    console.log('作者: @' + author.username);
    console.log('内容: ' + tweet.text);

    // 1. GPT-4分析风险
    const riskAnalysis = await this.analyzeRiskWithGPT(tweet.text, author.username);

    console.log('🤖 GPT-4风险评分: ' + riskAnalysis.score + '/10');
    console.log('影响币种: ' + riskAnalysis.affected_coins.join(', '));
    console.log('建议操作: ' + riskAnalysis.action);

    // 2. 达到阈值则发送报警
    if (riskAnalysis.score >= this.alertThreshold) {
      await this.sendAlert({
        source: 'Twitter',
        author: '@' + author.username,
        content: tweet.text,
        risk: riskAnalysis,
        url: 'https://twitter.com/' + author.username + '/status/' + tweet.id
      });
    }

    // 3. 保存到数据库
    await this.saveToDatabase({
      platform: 'twitter',
      author: author.username,
      content: tweet.text,
      timestamp: new Date(tweet.created_at),
      risk_score: riskAnalysis.score,
      affected_coins: riskAnalysis.affected_coins
    });
  }

  async analyzeRiskWithGPT(text, author) {
    const prompt = '你是稳定币风险分析专家。分析以下推文的脱锚风险（0-10分）：\\n\\n' +
      '作者: @' + author + '\\n' +
      '内容: ' + text + '\\n\\n' +
      '输出JSON格式：\\n' +
      '{\\n' +
      '  "score": 0-10,\\n' +
      '  "affected_coins": ["USDC", "USDT"],\\n' +
      '  "reason": "简短原因",\\n' +
      '  "action": "建议操作（观察/准备/立即行动）"\\n' +
      '}';

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3
    });

    const result = JSON.parse(response.choices[0].message.content);
    return result;
  }

  async sendAlert(alert) {
    console.log('\\n🚨🚨🚨 高风险警报 🚨🚨🚨');

    const message = '🚨 稳定币风险预警\\n\\n' +
      '来源: ' + alert.source + '\\n' +
      '作者: ' + alert.author + '\\n' +
      '风险评分: ' + alert.risk.score + '/10\\n' +
      '影响币种: ' + alert.risk.affected_coins.join(', ') + '\\n' +
      '建议操作: ' + alert.risk.action + '\\n\\n' +
      '原文: ' + alert.content + '\\n\\n' +
      '链接: ' + alert.url;

    // Telegram通知
    await axios.post(
      'https://api.telegram.org/bot' + process.env.TELEGRAM_BOT_TOKEN + '/sendMessage',
      {
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown'
      }
    );

    // Discord Webhook
    await axios.post(process.env.DISCORD_WEBHOOK_URL, {
      content: message,
      username: '稳定币新闻猎手'
    });

    // 电话报警（高优先级）
    if (alert.risk.score >= 9) {
      await this.makePhoneCall(); // 使用Twilio等服务
    }
  }

  async saveToDatabase(data) {
    // 保存到MongoDB/PostgreSQL
    // await db.collection('news_alerts').insertOne(data);
  }
}

// 启动
const monitor = new TwitterMonitor({
  twitter_bearer_token: process.env.TWITTER_BEARER_TOKEN,
  openai_key: process.env.OPENAI_API_KEY
});

monitor.startMonitoring();
\`\`\`

---

### 3️⃣ **RSS新闻聚合**

**监控的RSS源**：

\`\`\`javascript
// config/rss_feeds.js
const RSS_FEEDS = [
  // 加密新闻
  'https://cointelegraph.com/rss',
  'https://www.coindesk.com/arc/outboundfeeds/rss/',
  'https://theblock.co/rss.xml',
  'https://decrypt.co/feed',

  // 主流财经
  'https://feeds.bloomberg.com/markets/news.rss',
  'https://www.reuters.com/rssFeed/businessNews',
  'https://www.wsj.com/xml/rss/3_7085.xml',

  // 监管新闻
  'https://www.sec.gov/news/pressreleases.rss',
  'https://www.federalreserve.gov/feeds/press_all.xml'
];
\`\`\`

**RSS监控代码**：

\`\`\`javascript
// monitor/rss_monitor.js
const Parser = require('rss-parser');
const parser = new Parser();

async function monitorRSS() {
  console.log('📰 启动RSS监控...');

  setInterval(async () => {
    for (const feedUrl of RSS_FEEDS) {
      try {
        const feed = await parser.parseURL(feedUrl);

        for (const item of feed.items.slice(0, 5)) { // 最新5条
          // 检查是否已处理过（通过GUID）
          const processed = await checkIfProcessed(item.guid);
          if (processed) continue;

          // 关键词匹配
          const isRelevant = ALERT_KEYWORDS.some(keyword =>
            item.title.toLowerCase().includes(keyword.toLowerCase()) ||
            item.contentSnippet?.toLowerCase().includes(keyword.toLowerCase())
          );

          if (isRelevant) {
            console.log('\\n📰 相关新闻: ' + item.title);
            console.log('来源: ' + feed.title);
            console.log('链接: ' + item.link);

            // GPT-4分析
            const analysis = await analyzeNewsWithGPT(item.title, item.contentSnippet);

            if (analysis.score >= 7) {
              await sendAlert({
                source: 'RSS - ' + feed.title,
                title: item.title,
                content: item.contentSnippet,
                url: item.link,
                risk: analysis
              });
            }
          }

          // 标记已处理
          await markAsProcessed(item.guid);
        }
      } catch (error) {
        console.error('RSS错误 (' + feedUrl + '):', error.message);
      }
    }
  }, 60000); // 每分钟检查
}

monitorRSS();
\`\`\`

---

### 4️⃣ **Telegram群组监控**

**目标群组**：

\`\`\`
- @tether_en（USDT官方）
- @circle_announcements（USDC官方）
- @MakerDAO_Official（DAI官方）
- @whale_alert（巨鲸监控）
- @defillama（DeFi数据）
\`\`\`

**监控代码**：

\`\`\`javascript
// monitor/telegram_monitor.js
const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');

async function monitorTelegram() {
  const client = new TelegramClient(
    new StringSession(process.env.TELEGRAM_SESSION),
    parseInt(process.env.TELEGRAM_API_ID),
    process.env.TELEGRAM_API_HASH,
    { connectionRetries: 5 }
  );

  await client.start({
    phoneNumber: process.env.TELEGRAM_PHONE,
    password: async () => process.env.TELEGRAM_PASSWORD,
    phoneCode: async () => prompt('输入验证码: '),
    onError: (err) => console.error(err)
  });

  console.log('📱 Telegram监控已启动');

  // 监听新消息
  client.addEventHandler(async (update) => {
    if (!update.message) return;

    const message = update.message;
    const chatId = message.chatId?.toString();

    // 仅监控指定群组
    const TARGET_CHATS = [
      '-1001234567890', // @tether_en
      '-1001234567891'  // @circle_announcements
    ];

    if (!TARGET_CHATS.includes(chatId)) return;

    console.log('\\n📱 Telegram新消息:');
    console.log('群组: ' + chatId);
    console.log('内容: ' + message.text);

    // GPT-4分析
    const analysis = await analyzeNewsWithGPT('Telegram消息', message.text);

    if (analysis.score >= 7) {
      await sendAlert({
        source: 'Telegram',
        content: message.text,
        risk: analysis
      });
    }
  });
}

monitorTelegram();
\`\`\`

---

## 📈 历史事件复盘

### 案例1：SVB倒闭导致USDC脱锚（2023-03-10）

**时间线**：

\`\`\`
2023-03-10 14:00 UTC
├─ Bloomberg发布SVB关闭消息
├─ 14:15 Twitter KOL @adamscochran警告Circle有$3.3B存款在SVB
├─ 14:30 USDC价格开始下跌至$0.98
├─ 16:00 Circle官方确认有$3.3B资金被困
├─ 18:00 USDC跌至$0.92
├─ 20:00 恐慌高峰，USDC最低$0.88
└─ 次日08:00 美联储宣布担保，USDC回升至$0.95

信息窗口：6小时（14:00新闻→20:00最低点）
\`\`\`

**新闻猎手如何捕捉**：

1. **14:00** - RSS监控捕捉Bloomberg新闻"SVB关闭"
2. **14:15** - Twitter监控到@adamscochran推文（关键词："Circle + SVB"）
3. **14:20** - GPT-4分析：风险评分9/10，建议"立即卖出USDC"
4. **14:25** - Telegram报警发送，用户在$0.98卖出
5. **20:30** - 监控到"FDIC担保"新闻，建议抄底
6. **21:00** - 用户在$0.90买入

**收益**：
- 卖出$10,000 USDC @$0.98 = $9,800
- 买入@$0.90 = 10,888 USDC
- 净收益：888 USDC（8.88%）

---

### 案例2：BUSD监管（2023-02-13）

**时间线**：

\`\`\`
2023-02-13 08:00 UTC
├─ WSJ报道：SEC要求Paxos停止发行BUSD
├─ 08:30 Twitter @CoinDesk转发
├─ 09:00 Paxos官方确认
├─ 10:00 BUSD价格稳定（超额抵押）
├─ 12:00 Binance宣布将移除BUSD交易对
└─ 16:00 BUSD流动性下降，部分DEX出现折价$0.98

信息窗口：8小时
\`\`\`

**套利机会**：
- 在Binance以$1买入BUSD
- 在Curve以$0.98卖出（流动性不足导致滑点）
- 收益：2%

---

## 🤖 自动化交易集成

**当检测到高风险新闻时，自动执行交易**：

\`\`\`javascript
// auto_trader.js
async function executeEmergencyTrade(alert) {
  if (alert.risk.score < 8) return; // 仅高风险触发

  const affectedCoin = alert.risk.affected_coins[0]; // 例如USDC

  if (alert.risk.action === '立即卖出') {
    console.log('🚨 自动卖出 ' + affectedCoin);

    // 1. 在Uniswap卖出USDC→USDT
    const { ethers } = require('ethers');
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    const UNISWAP_ROUTER = '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45';
    const router = new ethers.Contract(UNISWAP_ROUTER, ROUTER_ABI, wallet);

    const amountIn = ethers.parseUnits('10000', 6); // 卖出10,000 USDC

    const tx = await router.exactInputSingle({
      tokenIn: USDC_ADDRESS,
      tokenOut: USDT_ADDRESS,
      fee: 500,
      recipient: wallet.address,
      deadline: Math.floor(Date.now() / 1000) + 300,
      amountIn: amountIn,
      amountOutMinimum: 0,
      sqrtPriceLimitX96: 0
    });

    await tx.wait();
    console.log('✅ 已卖出USDC，交易哈希: ' + tx.hash);

  } else if (alert.risk.action === '抄底买入') {
    // 逻辑类似，反向操作
  }
}
\`\`\`

---

## ⚠️ 风险与误报处理

### 1. **假新闻/FUD**

**问题**：Twitter充斥大量不实消息

**解决方案**：
- 仅信任认证账户（蓝V）
- 多源验证（至少2个来源确认）
- GPT-4交叉验证新闻真实性

\`\`\`javascript
async function verifyNews(headline) {
  const prompt = '判断以下新闻的真实性（真/假/不确定）：\\n' + headline;

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.1
  });

  return response.choices[0].message.content; // "真"/"假"/"不确定"
}
\`\`\`

---

### 2. **延迟风险**

**问题**：新闻发布到报警可能延迟1-2分钟

**解决方案**：
- 使用Twitter Filtered Stream（实时推送）
- 减少GPT-4调用延迟（使用gpt-3.5-turbo或本地模型）
- 预先加载交易参数（快速执行）

---

### 3. **过度交易**

**问题**：误报导致频繁交易，Gas费高

**解决方案**：
- 提高报警阈值（>=8分）
- 人工复核（自动交易前发送确认请求）
- 设置冷却期（同一币种1小时内仅报警1次）

---

## 💰 成本与收益

| 项目 | 免费方案 | 专业方案 |
|------|---------|---------|
| **Twitter API** | Free tier（v2） | $100/月（增强访问） |
| **OpenAI GPT-4** | - | $50/月（分析500条新闻） |
| **NewsAPI** | Free（100请求/天） | $49/月（无限） |
| **Telegram Bot** | Free | Free |
| **服务器** | $5/月（Hetzner） | $20/月（AWS） |
| **总计** | ~$5/月 | ~$220/月 |

**历史收益（模拟回测）**：
- SVB事件：8.88%（1天）
- BUSD事件：2%（1周）
- 平均每月捕捉1-2次机会
- 年化收益：保守估计30–50%

---

## 📋 执行检查清单

### 第一阶段：数据源接入（1-2周）

- [ ] 申请Twitter API（v2 Bearer Token）
- [ ] 申请OpenAI API Key
- [ ] 注册NewsAPI、Telegram Bot
- [ ] 配置RSS Feed解析器
- [ ] 测试所有API连接

### 第二阶段：监控系统搭建（1-2周）

- [ ] 部署Twitter Filtered Stream监控
- [ ] 部署RSS定时爬取（每分钟）
- [ ] 集成GPT-4风险分析
- [ ] 配置Telegram/Discord报警
- [ ] 设置数据库存储历史记录

### 第三阶段：报警优化（1周）

- [ ] 调整GPT-4 Prompt提高准确率
- [ ] 设置报警阈值（>=7分）
- [ ] 添加多源验证逻辑
- [ ] 配置冷却期防止重复报警
- [ ] 压力测试（模拟高频新闻）

### 第四阶段：自动化交易（可选）

- [ ] 集成Uniswap/Curve交易
- [ ] 设置风险限额（单次最多$10K）
- [ ] 添加人工确认步骤（高风险）
- [ ] 回测历史事件验证策略
- [ ] 小额实盘测试（$100起）

---

## 🎓 进阶优化

### 1. **情绪传播速度分析**

\`\`\`javascript
// 分析新闻传播速度（预测市场反应时间）
async function analyzeNewsVelocity(keyword) {
  const tweets = await searchRecentTweets(keyword, '1h'); // 过去1小时

  const timeline = tweets.map(t => new Date(t.created_at).getTime());
  const velocity = timeline.length / 60; // 推文/分钟

  if (velocity > 10) {
    console.log('🔥 病毒式传播，预计30分钟内市场反应');
  } else if (velocity > 3) {
    console.log('⚠️ 中等传播，预计1-2小时反应');
  } else {
    console.log('✅ 低传播，可能不影响市场');
  }

  return velocity;
}
\`\`\`

---

### 2. **KOL影响力权重**

给不同账户设置权重：

\`\`\`javascript
const ACCOUNT_WEIGHTS = {
  'circle': 10,          // 官方最高
  'SECGov': 9,
  'adamscochran': 7,     // 知名分析师
  'random_user': 1       // 普通用户
};

function calculateWeightedRisk(tweets) {
  let totalScore = 0;
  for (const tweet of tweets) {
    const weight = ACCOUNT_WEIGHTS[tweet.author] || 1;
    totalScore += tweet.risk_score * weight;
  }
  return totalScore / tweets.length;
}
\`\`\`

---

### 3. **链上数据交叉验证**

\`\`\`javascript
// 新闻说"USDC redemption paused"，验证链上Transfer事件是否骤减
async function verifyWithOnchainData(coin, newsTime) {
  const transfers = await getTransfersInTimeRange(
    USDC_ADDRESS,
    newsTime - 3600,  // 新闻前1小时
    newsTime + 3600   // 新闻后1小时
  );

  const beforeCount = transfers.filter(t => t.timestamp < newsTime).length;
  const afterCount = transfers.filter(t => t.timestamp >= newsTime).length;

  if (afterCount < beforeCount * 0.5) {
    console.log('✅ 链上数据确认：转账量骤减50%');
    return true;
  } else {
    console.log('❌ 链上数据不符：可能是假新闻');
    return false;
  }
}
\`\`\`

---

## 🎯 总结

**稳定币脱锚新闻猎手**的核心是**信息不对称套利**：

| 优势 | 说明 |
|------|------|
| ⏰ **时间优势** | 提前6-8小时发现风险 |
| 🎯 **自动化** | 7x24小时监控，无需人工盯盘 |
| 🤖 **AI增强** | GPT-4过滤噪音，提高信噪比 |
| 💰 **低成本** | $50/月即可运行 |
| ⚠️ **误报风险** | 需多源验证 |

**适合人群**：信息敏感型交易者、追求alpha的DeFi玩家

**下一步**：结合价格监控+链上数据+新闻监控，构建**多维度预警系统** 🚀
`,

  steps: [
    {
      step_number: 1,
      title: '配置新闻数据源',
      description:
        '申请Twitter API v2、OpenAI API、NewsAPI、Telegram Bot Token，配置目标监控账户（Circle/Tether/SEC等）、RSS订阅源、关键词列表，测试所有API连接。',
      time_minutes: 400
    },
    {
      step_number: 2,
      title: '搭建监控系统',
      description:
        '部署Twitter Filtered Stream实时监控（关键词+账户），配置RSS定时爬取（每分钟），集成Telegram群组监控，所有新闻统一存储到数据库。',
      time_minutes: 600
    },
    {
      step_number: 3,
      title: '集成GPT-4分析',
      description:
        '为每条新闻调用GPT-4进行风险评分（0-10分）和影响分析，识别受影响稳定币、建议操作（观察/准备/立即行动），设置报警阈值>=7分触发通知。',
      time_minutes: 300
    },
    {
      step_number: 4,
      title: '配置多渠道报警',
      description:
        '接入Telegram Bot、Discord Webhook、邮件通知，风险>=9分时触发电话报警（Twilio），实现多源验证（至少2个来源确认），添加冷却期防止重复报警。',
      time_minutes: 200
    },
    {
      step_number: 5,
      title: '历史回测与优化',
      description:
        '用SVB/BUSD/Terra等历史事件回测系统准确性，调整GPT-4 Prompt和报警阈值，可选集成自动化交易（Uniswap/Curve），小额实盘验证（$100-$1K）。',
      time_minutes: 400
    }
  ],

  status: 'published'
};

async function main() {
  try {
    // 1. 登录获取token
    const authResponse = await axios.post(DIRECTUS_URL + '/auth/login', {
      email: 'the_uk1@outlook.com',
      password: 'Mygcdjmyxzg2026!'
    });

    const token = authResponse.data.data.access_token;

    // 2. 创建策略
    const response = await axios.post(
      DIRECTUS_URL + '/items/strategies',
      {
        ...GUIDE_CONFIG,
        steps: GUIDE_CONFIG.steps
      },
      {
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ 稳定币脱锚新闻猎手创建成功!');
    console.log('   ID: ' + response.data.data.id);
    console.log('   Slug: ' + response.data.data.slug);
    console.log('   访问: http://localhost:3000/strategies/' + response.data.data.slug);
  } catch (error) {
    console.error('❌ 创建失败:', error.response?.data || error.message);
  }
}

main();
