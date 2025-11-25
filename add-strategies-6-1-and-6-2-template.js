const axios = require('axios');

const DIRECTUS_URL = 'http://localhost:8055';

// ===== 5.1 NFT 项目白名单获取 =====
const STRATEGY_5_1 = {
  title: 'NFT 项目白名单获取 - 低价铸造优质 NFT',
  slug: 'nft-whitelist-acquisition',
  summary: '通过完成社交任务、Discord 活跃、邀请好友等方式,获得热门 NFT 项目的白名单(WL)资格,以低于公开价格的成本铸造优质 NFT。',

  category: 'whitelist',
  category_l1: 'airdrop',
  category_l2: '白名单/预售',

  difficulty_level: 2,
  risk_level: 3,

  apy_min: 0,
  apy_max: 0,
  threshold_capital: '50-500 美元（铸造成本）',
  threshold_capital_min: 50,
  time_commitment: '每周 3-5 小时',
  time_commitment_minutes: 240,
  threshold_tech_level: 'beginner',

  content: `> **适合人群**: NFT 爱好者、希望低价获取优质 NFT 的玩家
> **阅读时间**: 约 12 分钟
> **关键词**: NFT 白名单 / WL / 铸造 / Discord / 社交任务 / 预售

---

## 🎯 什么是 NFT 白名单?

NFT 白名单(Whitelist, 简称 WL)是项目方给予特定用户的优先铸造资格。白名单用户可以在公开发售前,以更低价格、更少竞争铸造 NFT。

### 白名单的价值

**价格优势**: 白名单价格通常比公开价格低 30-70%
**优先权**: 避免 Gas 战争,优先铸造
**稀缺性**: 热门项目的白名单比铸造本身更难获得

**真实案例**:
- Azuki WL 价格 0.5 ETH → 地板价最高 40 ETH
- Doodles WL 价格 0.123 ETH → 地板价最高 23 ETH

---

## 📋 获取白名单的主要方法

### 方法 1: 社交任务

完成项目方在 Twitter/Discord 发布的任务:
- 关注、转发、点赞
- 加入 Discord 并验证
- 填写 Google 表单
- @ 好友参与

### 方法 2: Discord 活跃

在项目 Discord 保持活跃:
- 每天发言 3-5 次
- 帮助新人解答问题
- 参与 AMA 和活动
- 创作内容(Meme/Fan Art)

### 方法 3: Premint 平台

使用 Premint.xyz 等聚合平台:
- 批量注册多个项目
- 完成任务后自动提交
- 提高中签概率

### 方法 4: 持有特定 NFT

一些项目给老 NFT 持有者发白名单:
- 持有蓝筹 NFT(BAYC/Azuki)
- 持有合作项目 NFT
- 持有同系列早期 NFT

---

## 💰 成本与收益

### 成本

- 时间: 每周 3-5 小时
- 铸造: $150-$300/个
- Gas 费: $20-$50/次

### 收益

**保守**: 获得 3 个 WL,每个赚 $150 = $450
**乐观**: 其中 1 个 10x,总收益 $2,000+

---

## ⚠️ 风险提示

1. **项目破发**: 80% NFT 会跌破铸造价
2. **诈骗风险**: 假项目、Rug Pull
3. **Gas 浪费**: 即使有 WL,Gas 费可能很高

**应对**: 只参与有融资背景、团队公开、艺术质量高的项目

---

## ✅ 行动步骤

1. 设置专业的 Twitter/Discord 账号
2. 关注 NFT 日历和消息账号
3. 每天在 Premint 注册 5-10 个项目
4. 深度参与 3-5 个重点项目
5. 获得 WL 后研究基本面再铸造
`,

  steps: [
    { step_number: 1, title: '设置社交账号', description: '优化 Twitter 和 Discord,建立 NFT 玩家形象。', estimated_time: '30 分钟' },
    { step_number: 2, title: '加入 NFT 社区', description: '加入 20+ 项目 Discord,关注信息渠道。', estimated_time: '1 小时' },
    { step_number: 3, title: '批量注册白名单', description: '在 Premint 注册,完成社交任务。', estimated_time: '每天 15 分钟' },
    { step_number: 4, title: 'Discord 深度参与', description: '在重点项目保持活跃。', estimated_time: '每周 2 小时' },
    { step_number: 5, title: '铸造与售卖', description: '获得 WL 后研究项目,决定铸造策略。', estimated_time: '1-2 小时' },
  ],
};

// ===== 5.2 Alpha Group OG 身份争取 =====
const STRATEGY_5_2 = {
  title: 'Alpha Group OG 身份争取 - 成为项目核心成员',
  slug: 'alpha-group-og-status',
  summary: '加入早期项目的 Alpha 社群,保持高活跃度和高质量贡献,争取 OG(Original Gangster)角色和白名单特权,享受项目长期空投和优先权。',

  category: 'whitelist',
  category_l1: 'airdrop',
  category_l2: '白名单/预售',

  difficulty_level: 3,
  risk_level: 2,

  apy_min: 0,
  apy_max: 0,
  threshold_capital: '0-100 美元（可选）',
  threshold_capital_min: 0,
  time_commitment: '每周 5-10 小时',
  time_commitment_minutes: 450,
  threshold_tech_level: 'intermediate',

  content: `> **适合人群**: 愿意深度参与社区、有时间精力的 Web3 玩家
> **阅读时间**: 约 15 分钟
> **关键词**: OG 角色 / Alpha Group / 社区贡献 / 长期价值 / 空投权重

---

## 🎯 什么是 OG 身份?

OG(Original Gangster)是项目早期核心支持者的身份标识,代表最早加入、贡献最大的社区成员。

### OG 身份的价值

**空投权重**: 通常是普通用户的 2-10 倍
**白名单优先**: 几乎 100% 获得白名单
**额外奖励**: NFT、代币、实物奖励
**信息优势**: 第一时间获得项目内幕

**真实案例**:
- Arbitrum OG: 额外 $1,875 空投
- Blur OG: 3 倍积分权重
- Azuki OG: 白名单省 $300+

---

## 📋 OG 获取标准

### 时间维度
- 在成员 < 1,000 时加入
- 持续活跃 3-6 个月

### 贡献维度
- 高质量发言(不灌水)
- 帮助新人
- 提出有价值建议
- 创作内容

### 互动维度
- 参与 AMA
- 参加投票
- 完成任务

---

## 🚀 6 周 OG 争取计划

### 第 1 周: 建立存在感
- 自我介绍
- 阅读所有公告
- 每天发言 2-3 次

### 第 2 周: 展示专业性
- 高质量技术讨论
- 提供产品反馈
- 帮助新人

### 第 3 周: 内容创作
- 制作 Meme/Fan Art
- 写教程文章
- 录制视频

### 第 4 周: 深度参与活动
- 参加 AMA 并提问
- 完成测试网任务
- 参与社区比赛

### 第 5-6 周: 冲刺收割
- 保持高频互动
- 建立个人品牌
- 等待 OG 发放

---

## 💰 时间回报率

**投入**: 6 周 × 5-10 小时 = 30-60 小时

**收益**:
- 空投额外收益: $750-$2,000
- NFT 白名单省钱: $600-$1,500
- 时间回报率: $25-$50/小时

---

## ⚠️ 注意事项

**避免行为**:
- 灌水刷屏
- 乞讨 OG
- 使用机器人

**应该做的**:
- 真诚参与
- 高质量贡献
- 长期视角
`,

  steps: [
    { step_number: 1, title: '选择优质项目', description: '筛选 1-2 个最有潜力的早期项目。', estimated_time: '2 小时' },
    { step_number: 2, title: '建立存在感', description: '自我介绍,每天发言 2-3 次。', estimated_time: '每周 3 小时' },
    { step_number: 3, title: '展示专业性', description: '高质量发言,帮助新人。', estimated_time: '每周 5 小时' },
    { step_number: 4, title: '内容创作', description: '制作 Meme、教程等内容。', estimated_time: '每周 5 小时' },
    { step_number: 5, title: '冲刺收割', description: '参与活动,等待 OG 发放。', estimated_time: '每周 7 小时' },
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
    const strategies = [STRATEGY_5_1, STRATEGY_5_2];

    console.log('\n开始创建 5.1 和 5.2 策略...\n');

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

      console.log(`✅ [${i + 1}/2] ${strategy.title}`);
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