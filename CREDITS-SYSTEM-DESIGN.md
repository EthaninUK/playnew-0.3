# 🎖️ PlayNew.ai 积分系统 - 完整开发文档

**版本**: v1.0.0
**设计时间**: 2025-11-16
**系统状态**: 📋 Design Phase
**预计开发周期**: 3-4 周

---

## 📋 目录

1. [系统概述](#系统概述)
2. [核心设计理念](#核心设计理念)
3. [积分系统架构](#积分系统架构)
4. [数据库设计](#数据库设计)
5. [积分获取机制](#积分获取机制)
6. [积分消耗机制](#积分消耗机制)
7. [会员体系集成](#会员体系集成)
8. [API 设计](#api-设计)
9. [前端组件设计](#前端组件设计)
10. [游戏化设计](#游戏化设计)
11. [实施路线图](#实施路线图)
12. [风险评估与应对](#风险评估与应对)

---

## 🎯 系统概述

### 1.1 项目背景

PlayNew.ai 是一个 Web3 玩法策略平台,已经具备:
- ✅ 4级会员体系 (Free/Pro/Premium/Partner)
- ✅ 排行榜系统 (6种榜单)
- ✅ 内容分类系统 (strategies/news/gossip/arbitrage)
- ✅ Supabase + Directus 双架构
- ✅ Next.js 14 + TypeScript 前端

### 1.2 积分系统目标

**核心目标**:
1. 🎮 **增强用户粘性** - 通过积分激励提高 DAU/MAU
2. 💰 **优化商业模式** - 积分与会员体系双轮驱动
3. 🏆 **构建社区生态** - 激励用户贡献优质内容
4. 📈 **数据价值挖掘** - 积分行为反映用户真实偏好
5. 🎁 **灵活运营工具** - 支持活动、推广、用户留存

### 1.3 设计原则

| 原则 | 说明 | 示例 |
|------|------|------|
| **简单易懂** | 规则清晰,新手3分钟理解 | 每日签到 +10 积分 |
| **公平激励** | 多样化获取途径,不唯付费 | 分享内容 +5 积分 |
| **消耗有价值** | 积分消耗带来实际收益 | 解锁高级策略,查看套利信号 |
| **防刷机制** | 防止恶意刷积分 | 每日上限,行为验证 |
| **会员协同** | 与现有会员体系互补 | 会员获得积分倍率加成 |
| **可持续性** | 积分产出与消耗平衡 | 每日产出 ≈ 平均消耗 × 1.2 |

---

## 🏗️ 核心设计理念

### 2.1 积分定位

**PlayNew Coins (PNC)** - PlayNew 平台的通用虚拟积分

- **中文名称**: PlayNew 币 / 玩币
- **英文缩写**: PNC
- **图标**: 🪙 或自定义金币图标
- **性质**: 平台内虚拟积分,不可提现,不可交易

### 2.2 积分流转闭环

```
┌─────────────────────────────────────────────────────────────┐
│                      积分生态系统                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [积分获取]          [积分存储]          [积分消耗]            │
│                                                              │
│  • 每日签到          用户积分池          • 查看高级策略       │
│  • 任务完成    ──►   (Supabase)    ──►   • 解锁套利信号      │
│  • 内容贡献          实时余额            • 下载资料           │
│  • 社交互动          历史记录            • 兑换奖励           │
│  • 会员充值                              • 参与活动           │
│  • 活动奖励                              • 打赏作者           │
│                                                              │
│  [积分回流]                                                   │
│  • 用户消耗 40% → 内容作者                                    │
│  • 用户消耗 10% → 平台奖励池                                 │
│  • 用户消耗 50% → 销毁(通缩设计)                             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 2.3 与现有系统关系

```
┌────────────────┐
│  会员体系      │  ←─── 积分购买会员折扣
│  (4级会员)     │  ←─── 会员获得积分加成
└────────────────┘
        ↓
┌────────────────┐
│  积分系统      │  ←─── 核心激励机制
│  (PNC Coins)   │  ←─── 连接所有功能
└────────────────┘
        ↓
┌────────────────┐       ┌────────────────┐
│  排行榜系统    │       │  内容系统      │
│  (6种榜单)     │       │  (Strategies)  │
└────────────────┘       └────────────────┘
   ↑ 消耗积分查看            ↑ 消耗积分解锁
```

---

## 🗄️ 数据库设计

### 3.1 核心数据表

#### 表1: user_credits (用户积分主表)

```sql
CREATE TABLE user_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL UNIQUE,

  -- 积分余额
  current_balance INT DEFAULT 0 CHECK (current_balance >= 0),
  total_earned INT DEFAULT 0 CHECK (total_earned >= 0),
  total_spent INT DEFAULT 0 CHECK (total_spent >= 0),

  -- 冻结和锁定
  frozen_credits INT DEFAULT 0 CHECK (frozen_credits >= 0),
  locked_credits INT DEFAULT 0 CHECK (locked_credits >= 0),

  -- 会员加成
  membership_bonus_rate DECIMAL(3,2) DEFAULT 0.00, -- 0.00-2.00 (0%-200%)

  -- 等级系统
  credits_level INT DEFAULT 1 CHECK (credits_level >= 1 AND credits_level <= 10),
  level_progress INT DEFAULT 0,

  -- 统计
  daily_earn_limit INT DEFAULT 1000,
  daily_earned_today INT DEFAULT 0,
  last_daily_reset DATE DEFAULT CURRENT_DATE,

  -- 时间戳
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- 约束
  CONSTRAINT valid_balance CHECK (current_balance >= 0),
  CONSTRAINT valid_frozen CHECK (frozen_credits <= current_balance)
);

-- 索引
CREATE INDEX idx_user_credits_user_id ON user_credits(user_id);
CREATE INDEX idx_user_credits_balance ON user_credits(current_balance DESC);
CREATE INDEX idx_user_credits_level ON user_credits(credits_level);
CREATE INDEX idx_user_credits_daily_reset ON user_credits(last_daily_reset);

-- 注释
COMMENT ON TABLE user_credits IS '用户积分主表';
COMMENT ON COLUMN user_credits.current_balance IS '当前可用积分';
COMMENT ON COLUMN user_credits.frozen_credits IS '冻结积分(提现/交易中)';
COMMENT ON COLUMN user_credits.locked_credits IS '锁定积分(活动奖励未到期)';
COMMENT ON COLUMN user_credits.membership_bonus_rate IS '会员积分加成倍率';
```

#### 表2: credit_transactions (积分交易记录)

```sql
CREATE TABLE credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,

  -- 交易基本信息
  transaction_type VARCHAR(50) NOT NULL, -- 'earn', 'spend', 'transfer', 'refund'
  amount INT NOT NULL, -- 正数为收入,负数为支出
  balance_before INT NOT NULL,
  balance_after INT NOT NULL,

  -- 交易来源/用途
  source_type VARCHAR(50) NOT NULL,
  -- earn: 'daily_signin', 'task_complete', 'content_contribute', 'referral'
  -- spend: 'view_strategy', 'unlock_arbitrage', 'download_resource', 'gift_author'
  -- transfer: 'p2p_transfer', 'reward_pool'

  source_id UUID, -- 关联的内容/任务/用户 ID
  source_metadata JSONB, -- 额外信息

  -- 描述
  description TEXT,
  display_title VARCHAR(200), -- 前端显示的标题

  -- 状态
  status VARCHAR(20) DEFAULT 'completed', -- 'pending', 'completed', 'failed', 'refunded'

  -- 过期时间 (用于锁定积分)
  expires_at TIMESTAMPTZ,

  -- 时间戳
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,

  -- 关联订单 (如果是购买积分)
  order_id UUID,

  CONSTRAINT valid_amount CHECK (amount != 0)
);

-- 索引
CREATE INDEX idx_credit_trans_user_id ON credit_transactions(user_id);
CREATE INDEX idx_credit_trans_type ON credit_transactions(transaction_type);
CREATE INDEX idx_credit_trans_source ON credit_transactions(source_type, source_id);
CREATE INDEX idx_credit_trans_created ON credit_transactions(created_at DESC);
CREATE INDEX idx_credit_trans_status ON credit_transactions(status);

-- 注释
COMMENT ON TABLE credit_transactions IS '积分交易流水记录';
COMMENT ON COLUMN credit_transactions.amount IS '积分变动数量,正数为收入,负数为支出';
```

#### 表3: credit_tasks (积分任务配置)

```sql
CREATE TABLE credit_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 任务基本信息
  task_key VARCHAR(50) NOT NULL UNIQUE,
  task_name VARCHAR(100) NOT NULL,
  task_description TEXT,
  task_type VARCHAR(30) NOT NULL, -- 'daily', 'weekly', 'monthly', 'onetime', 'achievement'

  -- 奖励配置
  credits_reward INT NOT NULL CHECK (credits_reward > 0),
  bonus_credits INT DEFAULT 0, -- 额外奖励(连续完成等)

  -- 限制条件
  daily_limit INT DEFAULT 1,
  weekly_limit INT,
  monthly_limit INT,
  total_limit INT, -- 终身次数限制

  -- 会员限制
  min_membership_level INT DEFAULT 0, -- 0=Free, 1=Pro, 2=Premium, 3=Partner

  -- 任务参数
  required_action VARCHAR(50), -- 'login', 'share', 'comment', 'view', 'refer'
  required_count INT DEFAULT 1, -- 需要完成的次数
  required_duration INT, -- 需要的时间(秒)
  required_params JSONB, -- 额外参数 (如评论最少字数)

  -- 状态
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  sort_order INT DEFAULT 0,

  -- UI 配置
  icon VARCHAR(50),
  color VARCHAR(20),
  badge_text VARCHAR(20),

  -- 时间
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_credit_tasks_type ON credit_tasks(task_type);
CREATE INDEX idx_credit_tasks_active ON credit_tasks(is_active);
CREATE INDEX idx_credit_tasks_featured ON credit_tasks(is_featured);

-- 注释
COMMENT ON TABLE credit_tasks IS '积分任务配置表';
```

#### 表4: user_task_progress (用户任务进度)

```sql
CREATE TABLE user_task_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  task_id UUID REFERENCES credit_tasks(id) NOT NULL,

  -- 进度统计
  completed_count INT DEFAULT 0,
  total_credits_earned INT DEFAULT 0,

  -- 时间周期
  period_type VARCHAR(20), -- 'day', 'week', 'month', 'lifetime'
  period_date DATE DEFAULT CURRENT_DATE,

  -- 状态
  is_completed BOOLEAN DEFAULT FALSE,
  last_completed_at TIMESTAMPTZ,
  first_completed_at TIMESTAMPTZ,

  -- 连续完成
  consecutive_days INT DEFAULT 0,
  max_consecutive_days INT DEFAULT 0,

  -- 时间戳
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, task_id, period_type, period_date)
);

-- 索引
CREATE INDEX idx_task_progress_user ON user_task_progress(user_id);
CREATE INDEX idx_task_progress_task ON user_task_progress(task_id);
CREATE INDEX idx_task_progress_period ON user_task_progress(period_type, period_date);
CREATE INDEX idx_task_progress_completed ON user_task_progress(is_completed);
```

#### 表5: credit_rewards_pool (积分奖励池)

```sql
CREATE TABLE credit_rewards_pool (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 奖池信息
  pool_name VARCHAR(100) NOT NULL,
  pool_type VARCHAR(30), -- 'daily', 'weekly', 'monthly', 'event'

  -- 积分池
  total_credits INT DEFAULT 0,
  allocated_credits INT DEFAULT 0,
  remaining_credits INT DEFAULT 0,

  -- 分配规则
  distribution_rule VARCHAR(30), -- 'random', 'rank', 'contribution', 'proportional'
  distribution_params JSONB,

  -- 参与条件
  min_credits_level INT DEFAULT 1,
  min_membership_level INT DEFAULT 0,
  max_participants INT,

  -- 状态
  status VARCHAR(20) DEFAULT 'active', -- 'pending', 'active', 'distributing', 'completed'

  -- 时间
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 注释
COMMENT ON TABLE credit_rewards_pool IS '积分奖励池 - 用于活动和排行榜奖励';
```

#### 表6: user_unlocked_content (已解锁内容)

```sql
CREATE TABLE user_unlocked_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,

  -- 内容信息
  content_id UUID NOT NULL,
  content_type VARCHAR(50) NOT NULL, -- 'strategy', 'arbitrage', 'news', 'resource'
  content_title VARCHAR(200),

  -- 消耗信息
  credits_spent INT NOT NULL,
  original_price INT, -- 原价(可能打折)
  discount_rate DECIMAL(3,2), -- 折扣率

  -- 解锁方式
  unlock_method VARCHAR(30), -- 'credits', 'membership', 'free', 'gift'
  unlock_source UUID, -- 赠送者ID或活动ID

  -- 访问统计
  view_count INT DEFAULT 1,
  last_viewed_at TIMESTAMPTZ DEFAULT NOW(),

  -- 时间戳
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ, -- 过期时间(如限时解锁)

  UNIQUE(user_id, content_id, content_type)
);

-- 索引
CREATE INDEX idx_unlocked_user_content ON user_unlocked_content(user_id, content_id, content_type);
CREATE INDEX idx_unlocked_content_type ON user_unlocked_content(content_type);
CREATE INDEX idx_unlocked_expires ON user_unlocked_content(expires_at);
```

### 3.2 扩展现有表

#### 3.2.1 strategies 表扩展

```sql
-- 添加积分相关字段
ALTER TABLE strategies
ADD COLUMN IF NOT EXISTS credits_price INT DEFAULT 0 CHECK (credits_price >= 0),
ADD COLUMN IF NOT EXISTS original_credits_price INT,
ADD COLUMN IF NOT EXISTS is_credits_only BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS credits_discount_rate DECIMAL(3,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS free_preview_length INT DEFAULT 500;

-- 注释
COMMENT ON COLUMN strategies.credits_price IS '查看策略所需积分,0表示免费';
COMMENT ON COLUMN strategies.original_credits_price IS '原始积分价格(用于显示折扣)';
COMMENT ON COLUMN strategies.is_credits_only IS '是否仅支持积分解锁(不支持会员免费)';
COMMENT ON COLUMN strategies.free_preview_length IS '免费预览字符数';

-- 索引
CREATE INDEX IF NOT EXISTS idx_strategies_credits_price ON strategies(credits_price);
```

#### 3.2.2 arbitrage 表扩展

```sql
ALTER TABLE arbitrage
ADD COLUMN IF NOT EXISTS credits_price INT DEFAULT 10 CHECK (credits_price >= 0),
ADD COLUMN IF NOT EXISTS urgency_multiplier DECIMAL(3,2) DEFAULT 1.00;

COMMENT ON COLUMN arbitrage.credits_price IS '套利信号积分价格';
COMMENT ON COLUMN arbitrage.urgency_multiplier IS '紧急程度价格倍率(紧急套利更贵)';
```

---

## 🎁 积分获取机制

### 4.1 获取途径一览

| 类别 | 行为 | 积分 | 频率限制 | 会员加成 | 说明 |
|------|------|------|---------|---------|------|
| **📅 每日任务** | 每日签到 | +10 | 1次/天 | ✅ | 连续签到有额外奖励 |
| | 浏览5篇策略 | +5 | 1次/天 | ✅ | 需完整阅读 |
| | 分享内容 | +3 | 5次/天 | ✅ | 分享到社交媒体 |
| | 发表评论 | +2 | 10次/天 | ✅ | 评论≥20字 |
| **📝 内容贡献** | 发布策略(审核通过) | +100 | 不限 | ✅ | 优质内容+50 |
| | 发布快讯 | +20 | 不限 | ✅ | 独家快讯+30 |
| | 发布八卦 | +15 | 5次/天 | ✅ | 热门八卦+20 |
| | 优质评论(被点赞) | +5 | 不限 | ❌ | 每10个赞+5 |
| **👥 社交互动** | 邀请新用户注册 | +50 | 不限 | ✅ | 新用户完成首次任务 |
| | 被邀请新用户消费 | +10% | 不限 | ❌ | 永久返佣 |
| | 点赞内容 | +1 | 20次/天 | ❌ | 活跃度奖励 |
| | 关注其他用户 | +2 | 10次/天 | ❌ | 建立社交网络 |
| **🏆 成就系统** | 连续签到7天 | +30 | 每周 | ❌ | 断签重新计算 |
| | 连续签到30天 | +200 | 每月 | ❌ | 超级奖励 |
| | 发布10篇策略 | +150 | 一次性 | ❌ | 内容贡献者徽章 |
| | 累计获得100赞 | +100 | 一次性 | ❌ | 社区明星徽章 |
| **💳 充值购买** | 购买Pro会员 | +500 | 不限 | ❌ | 会员附赠积分 |
| | 购买Premium会员 | +1500 | 不限 | ❌ | 高级会员福利 |
| | 单独购买积分包 | 按套餐 | 不限 | ❌ | 1000币/$9.9起 |
| **🎉 活动奖励** | 参与每周挑战 | +50-200 | 每周 | ✅ | 根据排名分配 |
| | 新人任务完成 | +200 | 一次性 | ❌ | 7日新手任务 |
| | 节日活动 | +100-500 | 不定期 | ✅ | 春节/周年庆等 |

### 4.2 会员积分加成体系

```typescript
// 会员积分倍率配置
const MEMBERSHIP_CREDITS_MULTIPLIER = {
  0: 1.0,   // Free 用户: 基础倍率
  1: 1.2,   // Pro 用户: 1.2x 倍率 (+20%)
  2: 1.5,   // Premium 用户: 1.5x 倍率 (+50%)
  3: 2.0,   // Partner 用户: 2.0x 倍率 (+100%)
};

// 示例计算
// Free 用户每日签到: 10 × 1.0 = 10 积分
// Pro 用户每日签到: 10 × 1.2 = 12 积分
// Premium 用户每日签到: 10 × 1.5 = 15 积分
// Partner 用户每日签到: 10 × 2.0 = 20 积分
```

### 4.3 连续签到奖励机制

```typescript
// 连续签到阶梯奖励
const CONSECUTIVE_SIGNIN_REWARDS = [
  { days: 1, credits: 10 },     // 第1天
  { days: 3, credits: 15 },     // 第3天 (+5 bonus)
  { days: 7, credits: 30 },     // 第7天 (+20 bonus)
  { days: 14, credits: 50 },    // 第14天 (+20 bonus)
  { days: 30, credits: 200 },   // 第30天 (+150 bonus)
  { days: 60, credits: 300 },   // 第60天 (+100 bonus)
  { days: 100, credits: 500 },  // 第100天 (+200 bonus)
];

// 断签规则: 超过48小时未签到,连续天数重置为0
```

### 4.4 每日获取上限

```typescript
// 防止刷积分,设置每日获取上限
const DAILY_EARN_LIMITS = {
  free: 1000,      // Free 用户: 1000积分/天
  pro: 1500,       // Pro 用户: 1500积分/天
  premium: 2500,   // Premium 用户: 2500积分/天
  partner: 5000,   // Partner 用户: 5000积分/天
};

// 特殊说明:
// - 充值购买的积分不计入每日上限
// - 活动奖励不计入每日上限
// - 邀请奖励不计入每日上限
```

---

## 💸 积分消耗机制

### 5.1 消耗场景一览

| 内容类型 | 基础价格 | 会员折扣 | 说明 |
|---------|---------|---------|------|
| **策略详情** | | | |
| 普通策略 | 10积分 | Pro免费 | 基础玩法策略 |
| 精选策略 | 30积分 | Pro -50% | 编辑精选策略 |
| 高级策略 | 50积分 | Premium免费 | 复杂高收益策略 |
| 专家策略 | 100积分 | Premium -30% | 行业专家深度分析 |
| **套利信号** | | | |
| 普通套利 | 20积分 | Pro -30% | 常规套利机会 |
| 紧急套利 | 50积分 | Premium -20% | 时效性强 |
| 高频套利 | 30积分/天 | Premium -50% | 订阅制,1天有效 |
| **快讯&八卦** | | | |
| 普通快讯 | 5积分 | 所有会员免费 | 基础资讯 |
| 深度快讯 | 15积分 | Pro免费 | 深度分析 |
| 独家八卦 | 10积分 | Pro -50% | 爆料内容 |
| **资源下载** | | | |
| PDF报告 | 50积分 | Pro -30% | 研究报告 |
| 数据表格 | 30积分 | Pro -30% | Excel数据 |
| 工具脚本 | 100积分 | Premium -50% | 自动化工具 |
| **社交功能** | | | |
| 打赏作者 | 10-1000 | 不打折 | 自定义金额 |
| 置顶评论 | 50积分 | 不打折 | 评论置顶24h |
| 私信用户 | 5积分/条 | Pro免费 | 防止骚扰 |
| **活动参与** | | | |
| 抽奖一次 | 100积分 | 不打折 | 周度抽奖活动 |
| 竞猜参与 | 50积分 | 不打折 | 预测市场走势 |
| VIP直播 | 200积分 | Premium免费 | 专家线上直播 |

### 5.2 动态定价机制

```typescript
// 策略价格计算公式
function calculateStrategyPrice(strategy: Strategy, user: User): number {
  let basePrice = strategy.credits_price;

  // 1. 会员折扣
  const membershipDiscount = getMembershipDiscount(strategy, user.membership_level);
  basePrice = basePrice * (1 - membershipDiscount);

  // 2. 热度加成 (热门内容更贵)
  if (strategy.hotness_score > 500) {
    basePrice = basePrice * 1.2;
  }

  // 3. 时效性折扣 (旧内容降价)
  const ageInDays = (Date.now() - new Date(strategy.published_at).getTime()) / (1000 * 60 * 60 * 24);
  if (ageInDays > 90) {
    basePrice = basePrice * 0.7; // 3个月后7折
  }

  // 4. 促销活动
  if (strategy.is_on_sale) {
    basePrice = basePrice * strategy.sale_discount_rate;
  }

  // 5. 最小价格保护
  return Math.max(basePrice, 1);
}

// 会员折扣表
const MEMBERSHIP_DISCOUNTS = {
  strategy_normal: { 0: 0, 1: 1.0, 2: 1.0, 3: 1.0 },      // Free不打折,Pro+免费
  strategy_featured: { 0: 0, 1: 0.5, 2: 0.8, 3: 1.0 },    // Pro半价,Premium八折,Partner免费
  strategy_advanced: { 0: 0, 1: 0.3, 2: 1.0, 3: 1.0 },    // Pro七折,Premium+免费
  arbitrage_normal: { 0: 0, 1: 0.3, 2: 0.5, 3: 0.7 },    // Pro七折,Premium半价,Partner三折
};
```

### 5.3 重复访问规则

```typescript
// 已解锁内容访问策略
const CONTENT_ACCESS_POLICY = {
  // 永久解锁 (一次付费,终身使用)
  permanent: [
    'strategy',
    'download_resource',
  ],

  // 限时解锁 (需要定期续费)
  temporary: {
    'arbitrage_signal': 24 * 60 * 60 * 1000,      // 24小时
    'vip_livestream': 7 * 24 * 60 * 60 * 1000,    // 7天回看
  },

  // 消耗型 (每次使用都消耗)
  consumable: [
    'lottery_ticket',
    'prediction_entry',
  ],
};
```

---

## 👑 会员体系集成

### 6.1 会员 vs 积分对比

| 维度 | 会员制 | 积分制 | 组合优势 |
|------|--------|--------|---------|
| **获取方式** | 付费购买 | 免费获得+付费加速 | 降低付费门槛 |
| **内容访问** | 整体权限 | 单次解锁 | 灵活选择 |
| **激励作用** | 一次性激励 | 持续激励 | 提高DAU |
| **付费压力** | 较高($10-$50/月) | 较低(10-100币/次) | 多层次变现 |
| **用户粘性** | 中等 | 高 | 强化粘性 |

### 6.2 会员福利设计

```typescript
// 不同会员等级的积分福利
const MEMBERSHIP_CREDITS_BENEFITS = {
  // Free 用户 (Level 0)
  free: {
    signup_bonus: 200,                 // 注册赠送
    daily_signin: 10,                  // 每日签到
    credits_multiplier: 1.0,           // 获取倍率
    daily_earn_limit: 1000,            // 每日上限
    purchase_discount: 0,              // 购买积分折扣
  },

  // Pro 用户 (Level 1 - $10/月)
  pro: {
    monthly_grant: 500,                // 每月赠送500积分
    credits_multiplier: 1.2,           // 获取积分+20%
    daily_earn_limit: 1500,            // 每日上限提升
    purchase_discount: 0.1,            // 购买积分9折
    free_content: ['strategy_normal'], // 普通策略免费
  },

  // Premium 用户 (Level 2 - $30/月)
  premium: {
    monthly_grant: 1500,               // 每月赠送1500积分
    credits_multiplier: 1.5,           // 获取积分+50%
    daily_earn_limit: 2500,            // 每日上限更高
    purchase_discount: 0.2,            // 购买积分8折
    free_content: ['strategy_normal', 'strategy_featured', 'strategy_advanced'], // 大部分策略免费
  },

  // Partner 用户 (Level 3 - $50/月)
  partner: {
    monthly_grant: 3000,               // 每月赠送3000积分
    credits_multiplier: 2.0,           // 获取积分+100%
    daily_earn_limit: 5000,            // 每日上限最高
    purchase_discount: 0.3,            // 购买积分7折
    free_content: ['all'],             // 全部内容免费
    revenue_share: 0.7,                // 发布内容获得70%收益
  },
};
```

### 6.3 会员购买赠送积分

```typescript
// 购买会员赠送积分方案
const MEMBERSHIP_PURCHASE_CREDITS = {
  pro_monthly: 500,       // Pro月付: +500积分
  pro_yearly: 6000,       // Pro年付: +6000积分 (相当于+1个月免费)
  premium_monthly: 1500,  // Premium月付: +1500积分
  premium_yearly: 18000,  // Premium年付: +18000积分 (+20%奖励)
  partner_monthly: 3000,  // Partner月付: +3000积分
  partner_yearly: 36000,  // Partner年付: +36000积分 (+20%奖励)
};
```

---

## 🎮 游戏化设计

### 7.1 积分等级系统

```typescript
// 积分等级配置
const CREDITS_LEVELS = [
  { level: 1, name: '铜牌玩家', minCredits: 0, badge: '🥉', color: '#CD7F32' },
  { level: 2, name: '银牌玩家', minCredits: 1000, badge: '🥈', color: '#C0C0C0' },
  { level: 3, name: '金牌玩家', minCredits: 5000, badge: '🥇', color: '#FFD700' },
  { level: 4, name: '钻石玩家', minCredits: 15000, badge: '💎', color: '#00BFFF' },
  { level: 5, name: '大师玩家', minCredits: 50000, badge: '👑', color: '#8A2BE2' },
  { level: 6, name: '宗师玩家', minCredits: 150000, badge: '⚡', color: '#FF4500' },
  { level: 7, name: '传奇玩家', minCredits: 500000, badge: '🔥', color: '#FF0000' },
  { level: 8, name: '神话玩家', minCredits: 1500000, badge: '🌟', color: '#FFD700', glow: true },
  { level: 9, name: '永恒玩家', minCredits: 5000000, badge: '🏆', color: '#9400D3', animated: true },
  { level: 10, name: '至尊玩家', minCredits: 10000000, badge: '👑', color: 'rainbow', exclusive: true },
];

// 等级权益
const LEVEL_BENEFITS = {
  1: { discount: 0, daily_limit_bonus: 0 },
  2: { discount: 0.05, daily_limit_bonus: 100 },   // 消费95折,每日上限+100
  3: { discount: 0.10, daily_limit_bonus: 300 },
  4: { discount: 0.15, daily_limit_bonus: 500 },
  5: { discount: 0.20, daily_limit_bonus: 1000, exclusive_content: true },
  6: { discount: 0.25, daily_limit_bonus: 1500, priority_support: true },
  7: { discount: 0.30, daily_limit_bonus: 2000, custom_badge: true },
  8: { discount: 0.35, daily_limit_bonus: 3000, vip_community: true },
  9: { discount: 0.40, daily_limit_bonus: 5000, early_access: true },
  10: { discount: 0.50, daily_limit_bonus: 10000, hall_of_fame: true },
};
```

### 7.2 成就系统

```typescript
// 成就配置
const ACHIEVEMENTS = [
  // 签到类
  {
    id: 'signin_7days',
    name: '持之以恒',
    description: '连续签到7天',
    category: 'daily',
    credits_reward: 50,
    badge: '📅',
    rarity: 'common',
  },
  {
    id: 'signin_30days',
    name: '日日相伴',
    description: '连续签到30天',
    category: 'daily',
    credits_reward: 300,
    badge: '🎖️',
    rarity: 'rare',
  },

  // 内容类
  {
    id: 'publish_10strategies',
    name: '策略大师',
    description: '发布10篇策略',
    category: 'content',
    credits_reward: 200,
    badge: '📝',
    rarity: 'uncommon',
  },
  {
    id: 'get_100likes',
    name: '社区之星',
    description: '累计获得100个点赞',
    category: 'social',
    credits_reward: 150,
    badge: '⭐',
    rarity: 'rare',
  },

  // 消费类
  {
    id: 'spend_1000credits',
    name: '慷慨解囊',
    description: '累计消耗1000积分',
    category: 'spending',
    credits_reward: 100,
    badge: '💰',
    rarity: 'common',
  },

  // 稀有成就
  {
    id: 'first_blood',
    name: '平台首杀',
    description: '成为第1个注册用户',
    category: 'special',
    credits_reward: 10000,
    badge: '🏅',
    rarity: 'legendary',
    unique: true,
  },
];
```

### 7.3 每周挑战赛

```typescript
// 每周挑战赛配置
const WEEKLY_CHALLENGES = {
  week1: {
    name: '策略阅读周',
    description: '本周阅读20篇策略',
    target: 20,
    rewards: [
      { rank: 1, credits: 1000, badge: '🥇' },
      { rank: 2-5, credits: 500, badge: '🥈' },
      { rank: 6-10, credits: 300, badge: '🥉' },
      { rank: 11-50, credits: 100 },
    ],
  },

  week2: {
    name: '社交达人周',
    description: '本周分享内容50次',
    target: 50,
    rewards: [
      { rank: 1, credits: 800, badge: '📢' },
      { rank: 2-10, credits: 400 },
      { rank: 11-30, credits: 200 },
    ],
  },

  // ... more challenges
};
```

---

## 🔌 API 设计

### 8.1 核心 API 端点

#### 1. GET /api/credits/balance
获取用户积分余额

**Response:**
```json
{
  "success": true,
  "data": {
    "user_id": "uuid",
    "current_balance": 1250,
    "total_earned": 5000,
    "total_spent": 3750,
    "frozen_credits": 0,
    "locked_credits": 100,
    "credits_level": 3,
    "level_info": {
      "current": 3,
      "name": "金牌玩家",
      "badge": "🥇",
      "next_level_at": 5000,
      "progress": 25.0
    },
    "membership_bonus_rate": 1.2,
    "daily_earned_today": 65,
    "daily_earn_limit": 1500
  }
}
```

#### 2. POST /api/credits/earn
获得积分

**Request:**
```json
{
  "source_type": "daily_signin",
  "amount": 10,
  "metadata": {
    "consecutive_days": 5
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transaction_id": "uuid",
    "amount": 12,
    "original_amount": 10,
    "bonus_amount": 2,
    "bonus_reason": "会员加成 +20%",
    "balance_before": 1250,
    "balance_after": 1262,
    "daily_earned_today": 77,
    "level_up": false
  }
}
```

#### 3. POST /api/credits/spend
消耗积分

**Request:**
```json
{
  "content_type": "strategy",
  "content_id": "uuid",
  "amount": 30
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transaction_id": "uuid",
    "amount": 30,
    "original_price": 50,
    "discount": 0.4,
    "discount_reason": "Premium会员 -40%",
    "balance_before": 1262,
    "balance_after": 1232,
    "content_unlocked": true,
    "unlock_expires_at": null
  }
}
```

#### 4. POST /api/credits/transfer
积分转账 (用户之间)

**Request:**
```json
{
  "to_user_id": "uuid",
  "amount": 50,
  "message": "感谢分享"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transaction_id": "uuid",
    "from_user_id": "uuid",
    "to_user_id": "uuid",
    "amount": 50,
    "fee": 5,
    "total_deducted": 55,
    "balance_after": 1177,
    "message": "感谢分享"
  }
}
```

#### 5. GET /api/credits/transactions
积分流水查询

**Query Parameters:**
- `limit`: 20 (default)
- `offset`: 0
- `type`: earn | spend | transfer | refund
- `start_date`: 2025-01-01
- `end_date`: 2025-01-31

**Response:**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "uuid",
        "transaction_type": "earn",
        "source_type": "daily_signin",
        "amount": 12,
        "balance_before": 1250,
        "balance_after": 1262,
        "display_title": "每日签到奖励",
        "description": "连续签到第5天",
        "created_at": "2025-11-16T08:00:00Z"
      }
    ],
    "summary": {
      "total_earned": 500,
      "total_spent": 150,
      "net_change": 350
    },
    "pagination": {
      "total": 128,
      "limit": 20,
      "offset": 0,
      "has_more": true
    }
  }
}
```

#### 6. GET /api/credits/tasks
获取可用任务列表

**Response:**
```json
{
  "success": true,
  "data": {
    "daily_tasks": [
      {
        "task_id": "uuid",
        "task_key": "daily_signin",
        "task_name": "每日签到",
        "description": "每天登录平台获得积分",
        "credits_reward": 10,
        "bonus_credits": 2,
        "progress": {
          "current": 1,
          "total": 1,
          "completed": true
        },
        "next_available_at": "2025-11-17T00:00:00Z"
      }
    ],
    "weekly_tasks": [],
    "achievements": [],
    "daily_summary": {
      "tasks_completed": 3,
      "credits_earned": 25,
      "remaining_tasks": 2
    }
  }
}
```

#### 7. POST /api/credits/check-price
检查内容价格 (不实际扣费)

**Request:**
```json
{
  "content_type": "strategy",
  "content_id": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "content_id": "uuid",
    "content_type": "strategy",
    "content_title": "Uniswap V3 流动性挖矿",
    "base_price": 50,
    "final_price": 30,
    "your_balance": 1232,
    "can_afford": true,
    "already_unlocked": false,
    "discounts": [
      {
        "type": "membership",
        "rate": 0.4,
        "amount": 20,
        "reason": "Premium会员折扣"
      }
    ],
    "free_for_members": ["premium", "partner"]
  }
}
```

#### 8. POST /api/credits/purchase
购买积分包

**Request:**
```json
{
  "package_id": "credits_1000",
  "payment_method": "stripe"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "order_id": "uuid",
    "package": {
      "id": "credits_1000",
      "credits": 1000,
      "bonus_credits": 100,
      "price_usd": 9.9
    },
    "payment_url": "https://checkout.stripe.com/...",
    "expires_at": "2025-11-16T09:00:00Z"
  }
}
```

---

## 🎨 前端组件设计

### 9.1 积分显示组件

#### CreditsBalance (Header 积分显示)

```tsx
// components/credits/CreditsBalance.tsx
import { Coins, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface CreditsBalanceProps {
  balance: number;
  level: number;
  levelName: string;
  nextLevelAt: number;
  showProgress?: boolean;
}

export function CreditsBalance({
  balance,
  level,
  levelName,
  nextLevelAt,
  showProgress = false
}: CreditsBalanceProps) {
  const progress = (balance / nextLevelAt) * 100;

  return (
    <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950 dark:to-yellow-950 border border-amber-200 dark:border-amber-800">
      {/* 图标 */}
      <div className="relative">
        <Coins className="w-6 h-6 text-amber-600 dark:text-amber-400" />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse" />
      </div>

      {/* 积分信息 */}
      <div className="flex flex-col gap-0.5">
        <div className="flex items-baseline gap-1.5">
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            {balance.toLocaleString()}
          </span>
          <span className="text-xs text-gray-500">PNC</span>
        </div>

        {showProgress && (
          <>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                Lv.{level} {levelName}
              </span>
              <TrendingUp className="w-3 h-3 text-green-500" />
            </div>
            <Progress value={progress} className="h-1 w-24" />
          </>
        )}
      </div>

      {/* 充值按钮 */}
      <button className="ml-auto px-3 py-1 text-xs font-medium bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-lg hover:shadow-lg transition-all">
        充值
      </button>
    </div>
  );
}
```

#### CreditsTransaction (积分变动动画)

```tsx
// components/credits/CreditsTransaction.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface Transaction {
  id: string;
  amount: number;
  type: 'earn' | 'spend';
  message: string;
}

export function CreditsTransactionToast({ transactions }: { transactions: Transaction[] }) {
  return (
    <div className="fixed top-20 right-4 z-50 space-y-2">
      <AnimatePresence>
        {transactions.map((tx) => (
          <motion.div
            key={tx.id}
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            className={`px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm border ${
              tx.type === 'earn'
                ? 'bg-green-50 border-green-200 text-green-900'
                : 'bg-red-50 border-red-200 text-red-900'
            }`}
          >
            <div className="flex items-center gap-2">
              {tx.type === 'earn' ? (
                <ArrowUp className="w-5 h-5 text-green-600" />
              ) : (
                <ArrowDown className="w-5 h-5 text-red-600" />
              )}
              <div>
                <div className="font-bold">
                  {tx.type === 'earn' ? '+' : '-'}{Math.abs(tx.amount)} PNC
                </div>
                <div className="text-sm opacity-80">{tx.message}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
```

### 9.2 积分任务面板

```tsx
// components/credits/DailyTasksPanel.tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CheckCircle2, Circle, Gift, ChevronRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface Task {
  id: string;
  name: string;
  description: string;
  reward: number;
  progress: { current: number; total: number };
  completed: boolean;
  icon: string;
}

export function DailyTasksPanel({ tasks }: { tasks: Task[] }) {
  return (
    <Card className="border-amber-200 dark:border-amber-800">
      <CardHeader className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950 dark:to-yellow-950">
        <CardTitle className="flex items-center gap-2">
          <Gift className="w-5 h-5 text-amber-600" />
          每日任务
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-6 space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4 flex-1">
              {/* 完成状态 */}
              {task.completed ? (
                <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
              ) : (
                <Circle className="w-6 h-6 text-gray-300 flex-shrink-0" />
              )}

              {/* 任务信息 */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{task.icon}</span>
                  <h4 className="font-semibold">{task.name}</h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {task.description}
                </p>

                {/* 进度条 */}
                {!task.completed && (
                  <div className="flex items-center gap-2">
                    <Progress
                      value={(task.progress.current / task.progress.total) * 100}
                      className="h-2 flex-1"
                    />
                    <span className="text-xs text-gray-500">
                      {task.progress.current}/{task.progress.total}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 奖励 */}
            <div className="flex items-center gap-2 ml-4">
              <div className="text-right">
                <div className="text-lg font-bold text-amber-600">
                  +{task.reward}
                </div>
                <div className="text-xs text-gray-500">PNC</div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
```

### 9.3 积分不足弹窗

```tsx
// components/credits/InsufficientCreditsDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle, Coins, Gift, Share2, Star } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  required: number;
  current: number;
  contentTitle: string;
}

export function InsufficientCreditsDialog({
  open,
  onClose,
  required,
  current,
  contentTitle,
}: Props) {
  const shortfall = required - current;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <AlertCircle className="w-6 h-6 text-amber-500" />
            积分不足
          </DialogTitle>
          <DialogDescription>
            查看「{contentTitle}」需要 <strong className="text-amber-600">{required} PNC</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* 当前状态 */}
          <div className="p-4 bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-200 dark:border-amber-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">当前积分</span>
              <span className="font-bold text-lg">{current} PNC</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">所需积分</span>
              <span className="font-bold text-lg text-amber-600">{required} PNC</span>
            </div>
            <div className="h-px bg-gray-300 dark:bg-gray-600 my-2" />
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-red-600">还差</span>
              <span className="font-bold text-lg text-red-600">{shortfall} PNC</span>
            </div>
          </div>

          {/* 快速获取积分 */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300">
              快速获取积分:
            </h4>

            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={() => window.location.href = '/tasks'}
            >
              <span className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-green-500" />
                完成每日任务
              </span>
              <span className="text-green-600 font-semibold">+30 PNC</span>
            </Button>

            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={() => {/* Share logic */}}
            >
              <span className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-blue-500" />
                分享到社交媒体
              </span>
              <span className="text-blue-600 font-semibold">+5 PNC</span>
            </Button>

            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={() => window.location.href = '/credits/purchase'}
            >
              <span className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-amber-500" />
                购买积分包
              </span>
              <span className="text-amber-600 font-semibold">最快</span>
            </Button>

            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={() => window.location.href = '/pricing'}
            >
              <span className="flex items-center gap-2">
                <Star className="w-4 h-4 text-purple-500" />
                升级会员 (免费访问)
              </span>
              <span className="text-purple-600 font-semibold">推荐</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

---

## 📊 实施路线图

### Phase 1: 数据库和基础架构 (第1周)

**目标**: 建立积分系统的数据基础

**任务清单**:
- [ ] 创建 6 个核心数据表
- [ ] 为现有表添加积分相关字段
- [ ] 编写数据库迁移脚本
- [ ] 为所有现有用户初始化积分记录 (赠送200 PNC)
- [ ] 配置 Supabase RLS 策略
- [ ] 编写数据库触发器和函数

**交付物**:
- `sql/init-credits-system.sql` - 完整初始化脚本
- `sql/migrate-existing-users.sql` - 用户数据迁移
- 数据库设计文档

---

### Phase 2: 后端 API 开发 (第2-3周)

**目标**: 实现所有积分相关 API

**Week 2 任务**:
- [ ] 实现 `/api/credits/balance` - 查询余额
- [ ] 实现 `/api/credits/earn` - 获得积分
- [ ] 实现 `/api/credits/spend` - 消耗积分
- [ ] 实现 `/api/credits/transactions` - 历史记录
- [ ] 编写 API 单元测试

**Week 3 任务**:
- [ ] 实现 `/api/credits/tasks` - 任务系统
- [ ] 实现 `/api/credits/transfer` - 积分转账
- [ ] 实现 `/api/credits/check-price` - 价格查询
- [ ] 实现 `/api/credits/purchase` - 购买积分
- [ ] 集成 Stripe 支付

**交付物**:
- 8 个 API 端点
- API 文档 (Swagger/OpenAPI)
- 测试覆盖率 >80%

---

### Phase 3: 任务和奖励系统 (第3-4周)

**目标**: 实现任务配置和自动奖励

**任务清单**:
- [ ] 配置每日任务 (签到、浏览、分享等)
- [ ] 实现签到逻辑和连续签到奖励
- [ ] 实现成就系统
- [ ] 创建奖励池系统
- [ ] 配置会员积分加成
- [ ] 编写定时任务 (每日重置、奖励发放)

**交付物**:
- 任务配置数据
- 成就系统
- Cron Job 脚本

---

### Phase 4: 前端组件开发 (第4-5周)

**目标**: 实现用户侧积分界面

**Week 4 任务**:
- [ ] Header 积分显示组件
- [ ] 积分变动动画组件
- [ ] 积分不足弹窗
- [ ] 每日任务面板

**Week 5 任务**:
- [ ] 积分历史页面 (`/credits/history`)
- [ ] 积分购买页面 (`/credits/purchase`)
- [ ] 任务中心页面 (`/tasks`)
- [ ] 成就展示页面 (`/achievements`)

**交付物**:
- 10+ React 组件
- 4 个完整页面
- 响应式设计

---

### Phase 5: 内容访问控制集成 (第5-6周)

**目标**: 将积分系统集成到内容访问流程

**任务清单**:
- [ ] 策略详情页集成积分检查
- [ ] 套利信号页集成积分检查
- [ ] 新闻详情页集成积分检查
- [ ] 资源下载集成积分检查
- [ ] 实现内容预览功能
- [ ] 实现已解锁内容免费访问
- [ ] 在 Directus 中配置内容价格

**交付物**:
- `useCreditsGate` Hook
- 内容访问拦截器
- Directus 价格配置

---

### Phase 6: 会员系统整合 (第6周)

**目标**: 积分系统与会员体系无缝对接

**任务清单**:
- [ ] 配置会员积分加成规则
- [ ] 会员购买赠送积分
- [ ] 会员内容折扣系统
- [ ] 更新会员特权说明
- [ ] 更新 Pricing 页面

**交付物**:
- 会员积分联动
- 更新的 Pricing 页面

---

### Phase 7: 游戏化和激励优化 (第7周)

**目标**: 增强用户参与度

**任务清单**:
- [ ] 实现积分等级系统
- [ ] 等级徽章和特效
- [ ] 每周挑战赛
- [ ] 排行榜集成 (积分榜)
- [ ] 新手引导流程
- [ ] 积分使用建议系统

**交付物**:
- 等级系统
- 挑战赛系统
- 新手引导

---

### Phase 8: 测试和优化 (第8周)

**目标**: 确保系统稳定和平衡

**任务清单**:
- [ ] 内部测试 (20人)
- [ ] 压力测试 (模拟1000并发)
- [ ] 安全测试 (防刷积分)
- [ ] 收集反馈并调整参数
- [ ] 修复 Bug
- [ ] 性能优化

**交付物**:
- 测试报告
- Bug 修复列表
- 性能优化报告

---

### Phase 9: 上线和监控 (第9周)

**目标**: 正式发布积分系统

**任务清单**:
- [ ] 部署到生产环境
- [ ] 发布公告和教程
- [ ] 设置数据监控面板
- [ ] 配置告警系统
- [ ] 准备应急回滚方案
- [ ] 客服培训

**交付物**:
- 生产环境部署
- 用户文档和FAQ
- 监控Dashboard

---

## ⚠️ 风险评估与应对

### 风险1: 积分通胀

**风险描述**: 积分产出过多,导致积分贬值

**应对策略**:
1. 严格控制每日获取上限
2. 定期调整任务奖励
3. 引入积分销毁机制 (消费积分50%销毁)
4. 监控积分总量,及时调整

### 风险2: 恶意刷积分

**风险描述**: 用户通过脚本或小号刷积分

**应对策略**:
1. 添加 Google reCAPTCHA
2. 行为检测算法 (异常频率检测)
3. IP限流和设备指纹
4. 人工审核机制
5. 封禁作弊账号,扣除非法积分

### 风险3: 积分系统影响会员销售

**风险描述**: 用户通过积分满足需求,不再购买会员

**应对策略**:
1. 会员专属内容 (积分无法解锁)
2. 会员获得积分加成和折扣
3. 设置积分获取上限
4. 强调会员长期价值
5. 积分与会员互补而非替代

### 风险4: 数据库性能问题

**风险描述**: 积分流水表数据量大,查询慢

**应对策略**:
1. 分表策略 (按月分表)
2. 索引优化
3. Redis缓存用户余额
4. 归档历史数据
5. 异步写入流水

### 风险5: 用户体验问题

**风险描述**: 积分系统过于复杂,新用户不理解

**应对策略**:
1. 简化规则,清晰文档
2. 新手引导流程
3. 可视化展示 (进度条、动画)
4. 及时反馈 (Toast提示)
5. 客服支持和FAQ

---

## 📈 数据监控指标

### 关键指标 (KPI)

| 指标类别 | 具体指标 | 目标值 | 监控频率 |
|---------|---------|--------|---------|
| **用户活跃** | DAU | +30% | 每日 |
| | MAU | +25% | 每周 |
| | 平均停留时间 | +40% | 每日 |
| **积分平衡** | 积分总量 | 稳定增长 | 每日 |
| | 每日产出/消耗比 | 1.1-1.3 | 每日 |
| | 平均用户余额 | 300-800 | 每周 |
| **任务完成** | 签到率 | >60% | 每日 |
| | 任务完成率 | >40% | 每日 |
| | 成就解锁率 | >20% | 每周 |
| **商业价值** | 积分购买转化率 | >5% | 每周 |
| | 会员转化率 | >8% | 每周 |
| | ARPU | +15% | 每月 |

---

## 📚 附录

### A. 积分包定价方案

```typescript
const CREDITS_PACKAGES = [
  {
    id: 'starter',
    name: '新手礼包',
    credits: 500,
    bonus: 50,
    price_usd: 4.99,
    badge: '🎁',
    popular: false,
  },
  {
    id: 'basic',
    name: '基础包',
    credits: 1000,
    bonus: 150,
    price_usd: 9.99,
    badge: '🪙',
    popular: true,
  },
  {
    id: 'premium',
    name: '超值包',
    credits: 3000,
    bonus: 600,
    price_usd: 24.99,
    badge: '💎',
    popular: false,
    discount: '20% OFF',
  },
  {
    id: 'ultimate',
    name: '至尊包',
    credits: 10000,
    bonus: 3000,
    price_usd: 79.99,
    badge: '👑',
    popular: false,
    discount: '30% OFF',
  },
];
```

### B. 内容定价参考

| 内容类型 | 建议价格 | 价格区间 | 定价依据 |
|---------|---------|---------|---------|
| 新手策略 | 5-10 | 5-20 | 内容深度 |
| 中级策略 | 15-30 | 10-50 | 内容价值 |
| 高级策略 | 40-80 | 30-150 | 稀缺性 |
| 套利信号 | 20-50 | 15-100 | 时效性 |
| 深度报告 | 50-100 | 30-200 | 研究成本 |
| 独家八卦 | 10-20 | 5-50 | 爆料程度 |

### C. 环境变量配置

```bash
# .env.local

# 积分系统配置
CREDITS_INITIAL_BALANCE=200
CREDITS_DAILY_SIGNIN_REWARD=10
CREDITS_REFERRAL_REWARD=50

# 会员积分加成
MEMBERSHIP_PRO_MULTIPLIER=1.2
MEMBERSHIP_PREMIUM_MULTIPLIER=1.5
MEMBERSHIP_PARTNER_MULTIPLIER=2.0

# 每日获取上限
CREDITS_DAILY_LIMIT_FREE=1000
CREDITS_DAILY_LIMIT_PRO=1500
CREDITS_DAILY_LIMIT_PREMIUM=2500
CREDITS_DAILY_LIMIT_PARTNER=5000

# Stripe 积分购买
STRIPE_CREDITS_PRODUCT_ID=prod_xxx
```

---

## ✅ 开发清单

### 数据库 (10项)
- [ ] user_credits 表
- [ ] credit_transactions 表
- [ ] credit_tasks 表
- [ ] user_task_progress 表
- [ ] credit_rewards_pool 表
- [ ] user_unlocked_content 表
- [ ] strategies 表扩展
- [ ] arbitrage 表扩展
- [ ] 初始化脚本
- [ ] RLS 策略配置

### API (8项)
- [ ] GET /api/credits/balance
- [ ] POST /api/credits/earn
- [ ] POST /api/credits/spend
- [ ] POST /api/credits/transfer
- [ ] GET /api/credits/transactions
- [ ] GET /api/credits/tasks
- [ ] POST /api/credits/check-price
- [ ] POST /api/credits/purchase

### 前端组件 (12项)
- [ ] CreditsBalance (Header)
- [ ] CreditsTransactionToast
- [ ] DailyTasksPanel
- [ ] InsufficientCreditsDialog
- [ ] CreditsHistory Page
- [ ] CreditsPurchase Page
- [ ] TasksCenter Page
- [ ] Achievements Page
- [ ] useCreditsGate Hook
- [ ] useCreditsBalance Hook
- [ ] Level Badge Component
- [ ] Achievement Badge Component

### 功能集成 (8项)
- [ ] 策略详情页积分检查
- [ ] 套利信号页积分检查
- [ ] 新闻详情页积分检查
- [ ] 资源下载积分检查
- [ ] 会员积分加成
- [ ] 签到系统
- [ ] 成就系统
- [ ] 挑战赛系统

### 测试 (6项)
- [ ] API 单元测试
- [ ] 组件单元测试
- [ ] 集成测试
- [ ] 压力测试
- [ ] 安全测试
- [ ] 用户测试

### 文档 (5项)
- [ ] API 文档
- [ ] 用户使用指南
- [ ] 管理员操作手册
- [ ] FAQ
- [ ] 开发文档

**总计**: 49 项任务

---

## 🎉 总结

PlayNew.ai 积分系统设计完成！

### 核心特点

✅ **完整性** - 涵盖获取、消耗、转账、等级、任务、成就全流程
✅ **灵活性** - 支持动态定价、会员折扣、促销活动
✅ **可扩展** - 预留奖励池、挑战赛、P2P交易等高级功能
✅ **安全性** - 防刷机制、每日上限、行为检测
✅ **商业价值** - 与会员体系协同,多层次变现
✅ **用户体验** - 游戏化设计,清晰反馈,简单易懂

### 预期效果

- 📈 DAU提升 30%+
- 💰 ARPU提升 15%+
- 🏆 内容消费量提升 50%+
- ⭐ 用户留存率提升 25%+

**开始开发吧！** 🚀

---

**文档版本**: v1.0.0
**最后更新**: 2025-11-16
**作者**: Claude Code (Anthropic)
**项目状态**: 📋 Ready for Development
