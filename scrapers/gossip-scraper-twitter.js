/**
 * 币圈八卦 Twitter 采集器
 *
 * 功能:
 * 1. 监控指定KOL账号的推文
 * 2. 关键词过滤
 * 3. AI分析内容可信度
 * 4. 自动发布到Directus
 */

const axios = require('axios');
const { OpenAI } = require('openai');

// 配置
const CONFIG = {
  // Twitter API (需要申请 Twitter API v2 账号)
  twitter: {
    bearerToken: process.env.TWITTER_BEARER_TOKEN || 'YOUR_TWITTER_TOKEN',
    apiBase: 'https://api.twitter.com/2',
  },

  // Directus
  directus: {
    url: process.env.DIRECTUS_URL || 'http://localhost:8055',
    email: process.env.DIRECTUS_ADMIN_EMAIL || 'the_uk1@outlook.com',
    password: process.env.DIRECTUS_ADMIN_PASSWORD || 'Mygcdjmyxzg2026!',
  },

  // OpenAI (用于AI分析)
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    model: 'gpt-4o-mini', // 使用便宜的模型降低成本
  },

  // 监控的KOL账号列表
  kols: [
    { username: 'VitalikButerin', weight: 100 }, // 权重越高,信息越重要
    { username: 'cz_binance', weight: 100 },
    { username: 'SBF_FTX', weight: 90 },
    { username: 'APompliano', weight: 85 },
    { username: 'WuBlockchain', weight: 95 }, // 吴说
    { username: 'lookonchain', weight: 90 }, // 链上侦探
    { username: 'zachxbt', weight: 95 }, // ZachXBT
    { username: 'cobie', weight: 85 },
    { username: 'HsakaTrades', weight: 80 },
  ],

  // 八卦关键词
  keywords: [
    // 中文
    '传闻', '爆料', '据悉', '消息人士', '内幕', '独家',
    '跑路', '卷款', '崩盘', '离职', '内讧', '解散',
    '被捕', '调查', '诉讼', '清仓', '抛售', '造假',

    // 英文
    'rumor', 'allegedly', 'sources say', 'insider', 'exclusive',
    'exit scam', 'rug pull', 'collapse', 'resign', 'fired',
    'arrested', 'investigation', 'lawsuit', 'dump', 'fake',
  ],

  // 采集间隔(分钟)
  intervalMinutes: 15,
};

class GossipTwitterScraper {
  constructor() {
    this.directusToken = null;
    this.openai = CONFIG.openai.apiKey ? new OpenAI({ apiKey: CONFIG.openai.apiKey }) : null;
  }

  /**
   * 登录Directus获取token
   */
  async loginDirectus() {
    try {
      const response = await axios.post(`${CONFIG.directus.url}/auth/login`, {
        email: CONFIG.directus.email,
        password: CONFIG.directus.password,
      });
      this.directusToken = response.data.data.access_token;
      console.log('✅ Directus login successful');
    } catch (error) {
      console.error('❌ Directus login failed:', error.message);
      throw error;
    }
  }

  /**
   * 获取Twitter用户最新推文
   */
  async fetchUserTweets(username, sinceId = null) {
    try {
      const params = {
        max_results: 10,
        'tweet.fields': 'created_at,public_metrics,entities',
        'user.fields': 'username,verified',
      };

      if (sinceId) {
        params.since_id = sinceId;
      }

      const response = await axios.get(
        `${CONFIG.twitter.apiBase}/tweets/search/recent`,
        {
          headers: {
            Authorization: `Bearer ${CONFIG.twitter.bearerToken}`,
          },
          params: {
            query: `from:${username}`,
            ...params,
          },
        }
      );

      return response.data.data || [];
    } catch (error) {
      if (error.response?.status === 429) {
        console.warn('⚠️  Twitter API rate limit, waiting...');
        await new Promise(resolve => setTimeout(resolve, 60000)); // 等待1分钟
        return [];
      }
      console.error(`❌ Failed to fetch tweets from @${username}:`, error.message);
      return [];
    }
  }

  /**
   * 检查推文是否包含八卦关键词
   */
  containsGossipKeywords(text) {
    const lowerText = text.toLowerCase();
    return CONFIG.keywords.some(keyword =>
      lowerText.includes(keyword.toLowerCase())
    );
  }

  /**
   * 使用AI分析八卦内容
   */
  async analyzeWithAI(tweetText, username) {
    if (!this.openai) {
      console.warn('⚠️  OpenAI not configured, skipping AI analysis');
      return {
        credibility: 50,
        summary: tweetText.substring(0, 200),
        tags: ['未分类'],
        verificationStatus: 'unverified',
      };
    }

    try {
      const prompt = `你是一个加密货币行业的专业分析师。请分析以下Twitter八卦内容:

来源: @${username}
内容: ${tweetText}

请以JSON格式返回分析结果:
{
  "credibility": 0-100的整数(可信度评分),
  "summary": "一句话总结(中文,50字以内)",
  "category": "项目传闻/KOL动态/交易所八卦/团队内幕/融资消息/技术争议",
  "tags": ["标签1", "标签2", "标签3"],
  "verificationStatus": "unverified/verifying/confirmed/debunked",
  "reasoning": "评分理由(简短)"
}

评分标准:
- 90-100: 有明确证据(链上数据/官方确认)
- 70-89: 可信来源,多方验证
- 50-69: 单一来源,待验证
- 30-49: 匿名爆料,证据不足
- 0-29: 明显谣言或已辟谣`;

      const response = await this.openai.chat.completions.create({
        model: CONFIG.openai.model,
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.3,
      });

      const analysis = JSON.parse(response.choices[0].message.content);
      console.log(`   AI分析: 可信度 ${analysis.credibility}%, ${analysis.verificationStatus}`);

      return {
        credibility: analysis.credibility,
        summary: analysis.summary,
        tags: [analysis.category, ...analysis.tags],
        verificationStatus: analysis.verificationStatus,
        aiReasoning: analysis.reasoning,
      };
    } catch (error) {
      console.error('❌ AI analysis failed:', error.message);
      return {
        credibility: 50,
        summary: tweetText.substring(0, 200),
        tags: ['未分类'],
        verificationStatus: 'unverified',
      };
    }
  }

  /**
   * 发布八卦到Directus
   */
  async publishToDirectus(gossipData) {
    try {
      const response = await axios.post(
        `${CONFIG.directus.url}/items/news`,
        gossipData,
        {
          headers: {
            Authorization: `Bearer ${this.directusToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log(`✅ Published gossip: ${gossipData.title.substring(0, 50)}...`);
      return response.data.data;
    } catch (error) {
      if (error.response?.data?.errors?.[0]?.message?.includes('duplicate')) {
        console.log(`⚠️  Duplicate gossip, skipping`);
        return null;
      }
      console.error('❌ Failed to publish:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * 处理单条推文
   */
  async processTweet(tweet, username, weight) {
    const text = tweet.text;

    // 1. 关键词过滤
    if (!this.containsGossipKeywords(text)) {
      return null;
    }

    console.log(`\n🔍 Found potential gossip from @${username}:`);
    console.log(`   ${text.substring(0, 100)}...`);

    // 2. 热度过滤(点赞+转发 > 100)
    const engagement = tweet.public_metrics.like_count + tweet.public_metrics.retweet_count;
    if (engagement < 50) {
      console.log(`   ⚠️  Low engagement (${engagement}), skipping`);
      return null;
    }

    // 3. AI分析
    const analysis = await this.analyzeWithAI(text, username);

    // 4. 可信度过滤(至少30%)
    if (analysis.credibility < 30) {
      console.log(`   ⚠️  Low credibility (${analysis.credibility}%), skipping`);
      return null;
    }

    // 5. 构建八卦数据
    const gossipData = {
      title: analysis.summary || text.substring(0, 100),
      summary: analysis.summary,
      content: `# Twitter爆料\n\n**来源**: [@${username}](https://twitter.com/${username})\n**时间**: ${tweet.created_at}\n**热度**: ${engagement} 互动\n\n## 原文\n\n${text}\n\n## AI分析\n\n${analysis.aiReasoning || '待人工审核'}`,
      ai_summary: analysis.summary,
      source: `Twitter @${username}`,
      source_type: 'twitter',
      url: `https://twitter.com/${username}/status/${tweet.id}`,
      slug: `twitter-gossip-${tweet.id}`,

      // 八卦专属字段
      news_type: 'gossip',
      credibility_score: analysis.credibility,
      verification_status: analysis.verificationStatus,
      gossip_tags: analysis.tags,
      likes_count: Math.floor(engagement * 0.3), // 模拟初始点赞
      comments_count: 0,

      // 其他字段
      status: analysis.credibility >= 60 ? 'published' : 'draft', // 高可信度直接发布
      category: 'crypto-general',
      content_published_at: tweet.created_at,
      published_at: new Date().toISOString(),
    };

    // 6. 发布到Directus
    return await this.publishToDirectus(gossipData);
  }

  /**
   * 采集主循环
   */
  async scrape() {
    console.log('\n🚀 Starting gossip scraping...\n');

    await this.loginDirectus();

    const lastTweetIds = {}; // 记录每个账号最后采集的推文ID

    for (const kol of CONFIG.kols) {
      try {
        console.log(`\n📱 Checking @${kol.username}...`);

        const tweets = await this.fetchUserTweets(kol.username, lastTweetIds[kol.username]);

        if (tweets.length === 0) {
          console.log(`   No new tweets`);
          continue;
        }

        console.log(`   Found ${tweets.length} new tweets`);

        // 更新最后的推文ID
        if (tweets.length > 0) {
          lastTweetIds[kol.username] = tweets[0].id;
        }

        // 处理每条推文
        for (const tweet of tweets) {
          await this.processTweet(tweet, kol.username, kol.weight);

          // 延迟避免频率限制
          await new Promise(resolve => setTimeout(resolve, 2000));
        }

      } catch (error) {
        console.error(`❌ Error processing @${kol.username}:`, error.message);
        continue;
      }
    }

    console.log('\n✅ Scraping completed\n');
  }

  /**
   * 启动定时采集
   */
  async start() {
    console.log('🤖 Gossip Twitter Scraper Started');
    console.log(`   Monitoring ${CONFIG.kols.length} accounts`);
    console.log(`   Interval: ${CONFIG.intervalMinutes} minutes\n`);

    // 立即执行一次
    await this.scrape();

    // 定时执行
    setInterval(async () => {
      await this.scrape();
    }, CONFIG.intervalMinutes * 60 * 1000);
  }
}

// 启动采集器
if (require.main === module) {
  const scraper = new GossipTwitterScraper();
  scraper.start().catch(console.error);
}

module.exports = GossipTwitterScraper;
