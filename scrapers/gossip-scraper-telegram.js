/**
 * 币圈八卦 Telegram 采集器
 *
 * 使用 Telegram Bot API 监控指定群组
 */

const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const { OpenAI } = require('openai');

const CONFIG = {
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN || '', // 从 @BotFather 获取
    // 监控的群组/频道
    channels: [
      '@cryptogossip', // 示例频道
      '@cryptodrama',
      '@rugsandscams',
      // 添加更多中文八卦群...
    ],
  },

  directus: {
    url: process.env.DIRECTUS_URL || 'http://localhost:8055',
    email: process.env.DIRECTUS_ADMIN_EMAIL || 'the_uk1@outlook.com',
    password: process.env.DIRECTUS_ADMIN_PASSWORD || 'Mygcdjmyxzg2026!',
  },

  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    model: 'gpt-4o-mini',
  },

  // 热度阈值(回复数/转发数)
  minEngagement: 10,

  // 采集关键词
  keywords: [
    '传闻', '爆料', '据悉', '跑路', '卷款', '离职',
    'rumor', 'scam', 'rug', 'exit', 'dump', 'insider',
  ],
};

class GossipTelegramScraper {
  constructor() {
    this.bot = null;
    this.directusToken = null;
    this.openai = CONFIG.openai.apiKey ? new OpenAI({ apiKey: CONFIG.openai.apiKey }) : null;
  }

  async init() {
    if (!CONFIG.telegram.botToken) {
      throw new Error('❌ TELEGRAM_BOT_TOKEN not configured');
    }

    this.bot = new TelegramBot(CONFIG.telegram.botToken, { polling: true });
    await this.loginDirectus();

    console.log('✅ Telegram scraper initialized');
  }

  async loginDirectus() {
    const response = await axios.post(`${CONFIG.directus.url}/auth/login`, {
      email: CONFIG.directus.email,
      password: CONFIG.directus.password,
    });
    this.directusToken = response.data.data.access_token;
  }

  containsKeywords(text) {
    const lowerText = text.toLowerCase();
    return CONFIG.keywords.some(kw => lowerText.includes(kw.toLowerCase()));
  }

  async analyzeMessage(text, channelName) {
    if (!this.openai) {
      return {
        credibility: 40,
        summary: text.substring(0, 150),
        tags: ['未分类'],
        verificationStatus: 'unverified',
      };
    }

    try {
      const prompt = `分析以下来自Telegram频道的八卦消息:

频道: ${channelName}
内容: ${text}

返回JSON:
{
  "credibility": 0-100,
  "summary": "中文总结(50字内)",
  "category": "项目传闻/KOL动态/交易所八卦/团队内幕/融资消息/技术争议",
  "tags": ["标签1", "标签2"],
  "verificationStatus": "unverified/verifying/confirmed/debunked"
}`;

      const response = await this.openai.chat.completions.create({
        model: CONFIG.openai.model,
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.3,
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('AI analysis error:', error.message);
      return {
        credibility: 40,
        summary: text.substring(0, 150),
        tags: ['未分类'],
        verificationStatus: 'unverified',
      };
    }
  }

  async publishGossip(data) {
    try {
      await axios.post(`${CONFIG.directus.url}/items/news`, data, {
        headers: {
          Authorization: `Bearer ${this.directusToken}`,
          'Content-Type': 'application/json',
        },
      });
      console.log(`✅ Published: ${data.title.substring(0, 40)}...`);
    } catch (error) {
      if (!error.response?.data?.errors?.[0]?.message?.includes('duplicate')) {
        console.error('Publish error:', error.message);
      }
    }
  }

  async handleMessage(msg) {
    const text = msg.text || msg.caption;
    if (!text || text.length < 50) return;

    // 关键词过滤
    if (!this.containsKeywords(text)) return;

    console.log(`\n🔍 Potential gossip from ${msg.chat.title || msg.chat.username}`);

    // AI分析
    const analysis = await this.analyzeMessage(text, msg.chat.title || 'Telegram');

    if (analysis.credibility < 30) {
      console.log(`   Low credibility, skipping`);
      return;
    }

    // 构建数据
    const gossipData = {
      title: analysis.summary || text.substring(0, 100),
      summary: analysis.summary,
      content: `# Telegram爆料\n\n**来源**: ${msg.chat.title || msg.chat.username}\n**时间**: ${new Date(msg.date * 1000).toISOString()}\n\n## 内容\n\n${text}`,
      ai_summary: analysis.summary,
      source: `Telegram: ${msg.chat.title || msg.chat.username}`,
      source_type: 'telegram',
      url: msg.forward_from_chat
        ? `https://t.me/${msg.forward_from_chat.username}/${msg.forward_from_message_id}`
        : `https://t.me/${msg.chat.username}`,
      slug: `telegram-gossip-${msg.message_id}-${Date.now()}`,

      news_type: 'gossip',
      credibility_score: analysis.credibility,
      verification_status: analysis.verificationStatus,
      gossip_tags: analysis.tags,
      likes_count: 0,
      comments_count: 0,

      status: analysis.credibility >= 50 ? 'published' : 'draft',
      category: 'crypto-general',
      content_published_at: new Date(msg.date * 1000).toISOString(),
      published_at: new Date().toISOString(),
    };

    await this.publishGossip(gossipData);
  }

  async start() {
    await this.init();

    console.log('🤖 Telegram Gossip Scraper Started');
    console.log(`   Monitoring ${CONFIG.telegram.channels.length} channels\n`);

    this.bot.on('message', async (msg) => {
      try {
        await this.handleMessage(msg);
      } catch (error) {
        console.error('Message handling error:', error);
      }
    });

    this.bot.on('channel_post', async (msg) => {
      try {
        await this.handleMessage(msg);
      } catch (error) {
        console.error('Channel post error:', error);
      }
    });
  }
}

if (require.main === module) {
  const scraper = new GossipTelegramScraper();
  scraper.start().catch(console.error);
}

module.exports = GossipTelegramScraper;
