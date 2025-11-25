const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

// ===== 5.9 推特空间 AMA 白名单 =====
const STRATEGY_5_9 = {
  title: '推特空间 AMA 白名单 - 语音互动获取特权',
  slug: 'twitter-space-ama-whitelist',
  summary: '参与项目方 Twitter Space AMA 活动,积极提问互动、上台发言、分享见解,获得特殊白名单奖励和 OG 身份认可。',

  category: 'whitelist',
  category_l1: 'airdrop',
  category_l2: '白名单/预售',

  difficulty_level: 2,
  risk_level: 1,

  apy_min: 0,
  apy_max: 0,
  threshold_capital: '0 美元（零成本）',
  threshold_capital_min: 0,
  time_commitment: '每个 AMA 1-2 小时',
  time_commitment_minutes: 90,
  threshold_tech_level: 'beginner',

  content: `> **适合人群**: 愿意语音互动、英语口语较好的玩家
> **阅读时间**: 约 8 分钟
> **关键词**: Twitter Space / AMA / 语音互动 / 特殊白名单 / 社区认可

---

## 🎯 什么是 Twitter Space AMA?

Twitter Space 是 Twitter 的语音聊天功能,类似 Clubhouse。很多 Web3 项目在 Space 举办 AMA(Ask Me Anything)活动,与社区实时互动。

### AMA 白名单的特殊性

**稀缺性高**: 比普通白名单更难获得
**质量认可**: 证明你是真实且深度参与的用户
**额外权益**: 可能获得 OG 身份或额外空投

---

## 📋 参与 Twitter Space AMA 完整指南

### 第一步: 找到优质 AMA

**信息来源**:
- 关注项目官方 Twitter,开启通知
- 关注 NFT/Crypto KOL,他们会转发 AMA
- 加入项目 Discord,#announcements 频道会公告

**AMA 时间**:
- 通常在美国时间晚上(北京时间早上)
- 周末更常见

### 第二步: 提前准备

**1. 研究项目**:
- 阅读白皮书/Litepaper
- 了解团队背景
- 熟悉路线图和特色功能

**2. 准备问题**:
- 提前写下 2-3 个问题
- 问题要有深度,不要问"什么时候上币"
- 示例好问题:
  - "你们的跨链方案如何解决 MEV 问题?"
  - "NFT 持有者的长期 utility 是什么?"
  - "如何平衡社区治理和团队决策?"

**3. 测试设备**:
- 确保麦克风正常
- 找安静环境
- 如果英语不好,可以准备文字稿

### 第三步: 参与 AMA

**进入 Space**:
1. AMA 开始前 10 分钟进入
2. 点击右下角"Request"请求发言
3. 在聊天区发送问题

**发言技巧**:

**开场白**:
\`\`\`
Hi everyone, this is [你的名字] from [地区/背景].
First, thanks for hosting this AMA!
\`\`\`

**提问**:
\`\`\`
I have a question about [具体话题].
[详细问题]
Would love to hear your thoughts on this.
\`\`\`

**结束语**:
\`\`\`
Thanks for the answer! Really excited about the project.
Looking forward to the launch!
\`\`\`

### 第四步: 后续互动

**AMA 结束后**:
1. 在 Twitter 发推总结 AMA 要点
2. @ 项目方并感谢
3. 在 Discord 分享你的见解
4. 持续关注项目动态

---

## 💡 获得白名单的关键行为

### 行为 1: 高质量提问

**好问题特征**:
- 展示你做了研究
- 关注项目长期价值,不是短期价格
- 提出建设性建议

**示例**:
\`\`\`
I noticed your NFT has a staking mechanism.
Have you considered integrating with [某个协议] to increase utility?
This could attract more long-term holders.
\`\`\`

### 行为 2: 上台发言

**比文字提问更有影响力**:
- 项目方能听到你的声音
- 展示你是真实的人,不是机器人
- 更容易被记住

### 行为 3: 分享 Alpha

如果你有相关行业经验:
- 分享类似项目的成功案例
- 提出技术或营销建议
- 展示你的专业性

### 行为 4: 记笔记并分享

**AMA 后发推**:
\`\`\`
Great AMA with @ProjectName! Key takeaways:
1. [要点 1]
2. [要点 2]
3. [要点 3]

Really bullish on [某个特性]. Can't wait for launch! 🚀
\`\`\`

这种总结推文通常会被项目方转发,提高你的可见度。

---

## 🔥 高级技巧

### 技巧 1: 成为"常客"

**连续参加同一项目的多次 AMA**:
- 项目方会记住你
- 第二次、第三次提问时会认出你
- 建立"熟人"关系

### 技巧 2: 带动氛围

**在 Space 聊天区**:
- 欢迎新来的听众
- 回答其他听众的问题
- 发 emoji 活跃气氛

项目方会注意到活跃且帮助的用户。

### 技巧 3: 跨项目互动

**参加多个项目的 AMA**:
- 建立 Web3 人脉
- 有些 KOL 主持多个项目 AMA,认识他们很有价值
- 可能获得其他项目的推荐

### 技巧 4: 录音并做笔记

**使用录音软件**:
- 录下 AMA(仅自用)
- 事后整理成文章发布
- 成为"社区内容贡献者"

---

## 💰 成本与收益

### 成本

- **时间**: 每个 AMA 1-2 小时
- **资金**: $0
- **语言**: 需要一定英语能力(或使用翻译工具)

### 收益

**白名单价值**: $100-$500/个
**OG 身份**: 长期空投权重 2-5 倍
**人脉价值**: 认识 KOL 和项目方,无法量化

**真实案例**:
- 某用户参加 10 次 AMA,获得 3 个特殊白名单
- 其中 1 个项目成为蓝筹,收益 $5,000+

---

## ⚠️ 注意事项

### 避免的行为

**❌ 不要做**:
- 问"什么时候涨"、"能到多少"
- 乞讨白名单("Can I get WL?")
- 批评项目或攻击他人
- 使用低俗语言

**✅ 应该做**:
- 礼貌尊重
- 专业提问
- 真诚互动
- 感谢主持人

### 时区问题

**如果 AMA 在你的睡眠时间**:
- 设闹钟参加(如果项目值得)
- 或在 Discord 提前提交问题
- 看录播并在 Twitter 总结

---

## ✅ 行动步骤

1. **关注 5-10 个优质项目**,开启 Twitter 通知
2. **每周参加 1-2 个 AMA**
3. **提前准备问题**,展示你的研究
4. **积极互动**,不只是听
5. **持续跟进**,成为项目社区的熟面孔

---

## 🎓 总结

Twitter Space AMA 是展示你真实参与度的最佳机会。虽然需要语言能力和时间投入,但获得的白名单往往更有价值,因为项目方知道你是认真的支持者,不是机器人或女巫。

关键是**质量而非数量** - 深度参与 5 个项目的 AMA,胜过浅层参与 50 个。

祝你在 Twitter Space 中脱颖而出,获得更多特殊白名单!🎤
`,

  steps: [
    { step_number: 1, title: '找到 AMA 信息', description: '关注项目 Twitter,获取 AMA 时间。', estimated_time: '10 分钟' },
    { step_number: 2, title: '研究与准备', description: '研究项目,准备 2-3 个高质量问题。', estimated_time: '1 小时' },
    { step_number: 3, title: '参与 AMA', description: '进入 Space,请求发言并提问。', estimated_time: '1-2 小时' },
    { step_number: 4, title: 'AMA 后互动', description: '发推总结,在 Discord 分享见解。', estimated_time: '30 分钟' },
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
    const strategies = [STRATEGY_5_9];

    console.log('\n开始创建 5.9 策略...\n');

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

      console.log(`✅ [${i + 1}/1] ${strategy.title}`);
      console.log(`   ID: ${response.data.data.id}`);
      console.log(`   Slug: ${response.data.data.slug}\n`);
    }

    console.log('🎉 创建完成！');
    console.log('访问: http://localhost:3000/strategies?category=whitelist\n');
  } catch (error) {
    console.error('\n❌ 创建失败:', error.response?.data || error.message);
  }
}

addStrategies();