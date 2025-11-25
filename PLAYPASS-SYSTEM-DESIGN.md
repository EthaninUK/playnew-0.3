# 🎟️ PlayNew.ai PlayPass 积分系统 - 完整开发文档

**版本**: v2.1.0 🆕
**设计时间**: 2025-11-17
**系统状态**: 📋 Design Phase
**预计开发周期**: 2-3 周

---

## 🎯 核心调整说明

### 🆕 最新变更 (v2.1.0)

1. ✅ **后台可配置定价**: 新增 `playpass_pricing_config` 表,管理员可在 Directus 后台修改内容价格
2. ✅ **后台可配置奖励**: 新增 `playpass_reward_config` 表,管理员可在后台修改 PP 获取数量
3. ✅ **动态定价规则**: 支持条件匹配 (如风险等级、类别),自动应用不同价格
4. ✅ **活动倍数支持**: 支持双倍 PP 活动、限时优惠等运营活动
5. ✅ **实时统计数据**: 后台可查看解锁次数、PP 流水等数据

### 重要变更 (相比 v1.0)

1. ✅ **代币名称**: PlayPass (简称 PP) - 平台专属通行证
2. ✅ **无支付通道**: 暂不接入 Stripe 等在线支付
3. ✅ **无限积分方案**: 引导用户通过 Telegram 联系管理员 → 直接升级为 **MAX 会员**
4. ✅ **MAX 会员特权**: 无限 PP,全站内容免费访问

---

## 📋 目录

1. [系统概述](#系统概述)
2. [PlayPass 定义](#playpass-定义)
3. [会员体系设计](#会员体系设计)
4. [数据库设计](#数据库设计) 🆕 新增配置表
5. [PP 获取机制](#pp-获取机制)
6. [PP 消耗机制](#pp-消耗机制)
7. [MAX 会员升级流程](#max-会员升级流程)
8. [API 设计](#api-设计)
9. [前端组件设计](#前端组件设计)
10. [实施路线图](#实施路线图)
11. [Directus 后台配置指南](#directus-后台配置指南) 🆕
12. [附录](#附录)

---

## 🎯 系统概述

### 1.1 PlayPass 是什么?

**PlayPass (PP)** - PlayNew.ai 平台的专属通行证积分

- **中文名称**: PlayPass / 通行证
- **英文缩写**: PP
- **图标**: 🎟️ 或自定义通行证图标
- **性质**: 平台内虚拟积分,**不可提现**,**不可交易**

### 1.2 设计原则

| 原则 | 说明 |
|------|------|
| **完全免费** | 不接入任何支付通道,纯免费获取 |
| **简单直接** | 规则清晰,新手3分钟理解 |
| **Telegram 引导** | 需要无限 PP → 引导联系 TG 管理员 → 升级 MAX 会员 |
| **防刷机制** | 每日获取上限,防止恶意刷 PP |
| **会员优先** | MAX 会员 = 无限 PP + 全站免费 |

---

## 🎟️ PlayPass 定义

### 2.1 PlayPass 特性

```typescript
// PlayPass 核心属性
const PLAYPASS_PROPERTIES = {
  name: 'PlayPass',
  symbol: 'PP',
  decimals: 0,              // 整数,不支持小数
  transferable: false,      // 不可转账
  withdrawable: false,      // 不可提现
  tradable: false,          // 不可交易
  purchasable: false,       // 不可直接购买
  earnableOnly: true,       // 仅可通过平台行为获取
};
```

### 2.2 PlayPass 图标设计

```
🎟️ PlayPass
- 主色: 渐变紫 (#8B5CF6 → #D946EF)
- 辅色: 金色强调 (#F59E0B)
- 风格: 现代、科技感
```

---

## 👑 会员体系设计

### 3.1 会员等级 (简化为 5 级)

| 等级 | 名称 | PP 特权 | 内容访问 | 获取方式 |
|------|------|---------|---------|---------|
| **Level 0** | Free | 每日上限 1000 PP | 20% 基础内容 | 注册即获得 |
| **Level 1** | Pro | 每日上限 1500 PP<br>获取倍率 1.2x | 60% 中级内容<br>普通策略免费 | 完成任务升级 |
| **Level 2** | Premium | 每日上限 2500 PP<br>获取倍率 1.5x | 80% 高级内容<br>大部分策略免费 | 活跃贡献升级 |
| **Level 3** | Partner | 每日上限 5000 PP<br>获取倍率 2.0x | 90% 专家内容<br>几乎全部免费 | 内容创作者 |
| **Level 4** | **MAX** | **无限 PP**<br>**全站免费** | **100% 全部内容**<br>**无需消耗 PP** | **Telegram 联系管理员** |

### 3.2 MAX 会员特权

```typescript
// MAX 会员专属特权
const MAX_MEMBER_PRIVILEGES = {
  // 核心特权
  unlimited_pp: true,              // 无限 PlayPass
  all_content_free: true,          // 全站内容免费
  no_daily_limit: true,            // 无每日获取上限

  // 显示特权
  exclusive_badge: '👑 MAX',       // 专属徽章
  username_color: '#FFD700',       // 金色用户名
  profile_frame: 'golden',         // 金色头像框

  // 功能特权
  priority_support: true,          // 优先客服
  early_access: true,              // 新功能抢先体验
  no_ads: true,                    // 无广告
  custom_theme: true,              // 自定义主题

  // 社区特权
  exclusive_community: true,       // 专属社区
  publish_revenue_share: 0.7,      // 发布内容 70% 收益分成
  referral_bonus: 0.2,             // 推荐用户 20% 返佣
};
```

### 3.3 会员对比表

| 功能 | Free | Pro | Premium | Partner | **MAX** |
|------|------|-----|---------|---------|---------|
| 每日 PP 上限 | 1000 | 1500 | 2500 | 5000 | **无限** |
| 获取倍率 | 1.0x | 1.2x | 1.5x | 2.0x | **∞** |
| 普通策略 | 10 PP | 免费 | 免费 | 免费 | **免费** |
| 精选策略 | 30 PP | 15 PP | 免费 | 免费 | **免费** |
| 高级策略 | 50 PP | 35 PP | 25 PP | 免费 | **免费** |
| 套利信号 | 20 PP | 14 PP | 10 PP | 免费 | **免费** |
| 资源下载 | 50 PP | 35 PP | 25 PP | 10 PP | **免费** |
| 发布内容 | ❌ | ❌ | ✅ | ✅ | **✅** |
| 收益分成 | - | - | 30% | 50% | **70%** |
| 专属徽章 | - | 🔵 | 💜 | ⭐ | **👑** |

---

## 🗄️ 数据库设计

### 4.1 核心表结构

#### 表1: user_playpass (用户 PlayPass 主表)

```sql
CREATE TABLE user_playpass (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL UNIQUE,

  -- PlayPass 余额
  current_balance INT DEFAULT 200 CHECK (current_balance >= 0),
  total_earned INT DEFAULT 200 CHECK (total_earned >= 0),
  total_spent INT DEFAULT 0 CHECK (total_spent >= 0),

  -- 会员等级
  membership_level INT DEFAULT 0 CHECK (membership_level >= 0 AND membership_level <= 4),
  -- 0=Free, 1=Pro, 2=Premium, 3=Partner, 4=MAX

  is_max_member BOOLEAN DEFAULT FALSE, -- MAX 会员标识

  -- PP 获取倍率
  earn_multiplier DECIMAL(3,2) DEFAULT 1.00, -- 1.00 到 2.00 (MAX 会员为 999.99 表示无限)

  -- 每日限制
  daily_earn_limit INT DEFAULT 1000,
  daily_earned_today INT DEFAULT 0,
  last_daily_reset DATE DEFAULT CURRENT_DATE,

  -- 等级进度
  pp_level INT DEFAULT 1 CHECK (pp_level >= 1 AND pp_level <= 10),
  level_progress INT DEFAULT 0,

  -- 时间戳
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_balance CHECK (current_balance >= 0)
);

-- 索引
CREATE INDEX idx_user_playpass_user_id ON user_playpass(user_id);
CREATE INDEX idx_user_playpass_membership ON user_playpass(membership_level);
CREATE INDEX idx_user_playpass_max ON user_playpass(is_max_member);

-- 注释
COMMENT ON TABLE user_playpass IS '用户 PlayPass 主表';
COMMENT ON COLUMN user_playpass.is_max_member IS 'MAX 会员标识,拥有无限 PP';
COMMENT ON COLUMN user_playpass.earn_multiplier IS 'PP 获取倍率,MAX 会员为 999.99';
```

#### 表2: playpass_transactions (PP 交易记录)

```sql
CREATE TABLE playpass_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,

  -- 交易信息
  transaction_type VARCHAR(50) NOT NULL, -- 'earn', 'spend', 'refund', 'admin_grant'
  amount INT NOT NULL, -- 正数为收入,负数为支出
  balance_before INT NOT NULL,
  balance_after INT NOT NULL,

  -- 来源/用途
  source_type VARCHAR(50) NOT NULL,
  -- earn: 'daily_signin', 'task_complete', 'content_share', 'referral'
  -- spend: 'view_strategy', 'unlock_arbitrage', 'download_resource'
  -- admin_grant: 'upgrade_max', 'compensation'

  source_id UUID, -- 关联的内容/任务 ID
  source_metadata JSONB,

  -- 描述
  description TEXT,
  display_title VARCHAR(200),

  -- 状态
  status VARCHAR(20) DEFAULT 'completed',

  -- 时间
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_amount CHECK (amount != 0)
);

-- 索引
CREATE INDEX idx_pp_trans_user_id ON playpass_transactions(user_id);
CREATE INDEX idx_pp_trans_type ON playpass_transactions(transaction_type);
CREATE INDEX idx_pp_trans_source ON playpass_transactions(source_type, source_id);
CREATE INDEX idx_pp_trans_created ON playpass_transactions(created_at DESC);
```

#### 表3: playpass_tasks (PP 任务配置)

```sql
CREATE TABLE playpass_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 任务基本信息
  task_key VARCHAR(50) NOT NULL UNIQUE,
  task_name VARCHAR(100) NOT NULL,
  task_description TEXT,
  task_type VARCHAR(30) NOT NULL, -- 'daily', 'weekly', 'onetime', 'achievement'

  -- 奖励配置
  pp_reward INT NOT NULL CHECK (pp_reward > 0),
  bonus_pp INT DEFAULT 0,

  -- 限制条件
  daily_limit INT DEFAULT 1,
  weekly_limit INT,
  total_limit INT,

  -- 会员限制
  min_membership_level INT DEFAULT 0,

  -- 任务参数
  required_action VARCHAR(50),
  required_count INT DEFAULT 1,
  required_params JSONB,

  -- 状态
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,

  -- UI 配置
  icon VARCHAR(50),
  badge_text VARCHAR(20),

  -- 时间
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_pp_tasks_active ON playpass_tasks(is_active);
CREATE INDEX idx_pp_tasks_type ON playpass_tasks(task_type);
```

#### 表4: user_task_progress (用户任务进度)

```sql
CREATE TABLE user_task_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  task_id UUID REFERENCES playpass_tasks(id) NOT NULL,

  -- 进度统计
  completed_count INT DEFAULT 0,
  total_pp_earned INT DEFAULT 0,

  -- 时间周期
  period_type VARCHAR(20), -- 'day', 'week', 'lifetime'
  period_date DATE DEFAULT CURRENT_DATE,

  -- 状态
  is_completed BOOLEAN DEFAULT FALSE,
  last_completed_at TIMESTAMPTZ,

  -- 连续完成
  consecutive_days INT DEFAULT 0,

  -- 时间戳
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, task_id, period_type, period_date)
);

-- 索引
CREATE INDEX idx_task_progress_user ON user_task_progress(user_id);
CREATE INDEX idx_task_progress_period ON user_task_progress(period_type, period_date);
```

#### 表5: user_unlocked_content (已解锁内容)

```sql
CREATE TABLE user_unlocked_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,

  -- 内容信息
  content_id UUID NOT NULL,
  content_type VARCHAR(50) NOT NULL, -- 'strategy', 'arbitrage', 'news', 'resource'
  content_title VARCHAR(200),

  -- 消耗信息
  pp_spent INT NOT NULL DEFAULT 0,
  original_price INT,

  -- 解锁方式
  unlock_method VARCHAR(30), -- 'playpass', 'max_member', 'free'

  -- 时间戳
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, content_id, content_type)
);

-- 索引
CREATE INDEX idx_unlocked_user_content ON user_unlocked_content(user_id, content_id, content_type);
```

#### 表6: playpass_pricing_config (内容定价配置) 🆕

```sql
CREATE TABLE playpass_pricing_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 定价规则标识
  config_key VARCHAR(100) NOT NULL UNIQUE,
  config_name VARCHAR(200) NOT NULL,
  config_description TEXT,

  -- 内容类型
  content_type VARCHAR(50) NOT NULL, -- 'strategy', 'arbitrage', 'news', 'gossip', 'resource', 'play_exchange'

  -- 定价配置
  pp_price INT NOT NULL DEFAULT 0 CHECK (pp_price >= 0),

  -- 会员折扣 (JSON 格式)
  membership_discounts JSONB DEFAULT '{
    "0": 1.0,
    "1": 0.9,
    "2": 0.7,
    "3": 0.5,
    "4": 0.0
  }'::jsonb,

  -- MAX会员是否免费
  is_free_for_max BOOLEAN DEFAULT TRUE,

  -- 免费预览长度
  free_preview_length INT DEFAULT 500,

  -- 适用条件 (JSON 格式)
  apply_conditions JSONB,
  -- 例如: {"category": "airdrop", "risk_level": 5}
  -- 例如: {"min_apy": 10, "chains": ["ethereum", "arbitrum"]}

  -- 优先级 (数字越大优先级越高)
  priority INT DEFAULT 0,

  -- 状态
  is_active BOOLEAN DEFAULT TRUE,

  -- 统计
  total_unlocks INT DEFAULT 0,
  total_pp_earned INT DEFAULT 0,

  -- 时间
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- 创建者
  created_by UUID REFERENCES auth.users(id)
);

-- 索引
CREATE INDEX idx_pricing_content_type ON playpass_pricing_config(content_type);
CREATE INDEX idx_pricing_active ON playpass_pricing_config(is_active);
CREATE INDEX idx_pricing_priority ON playpass_pricing_config(priority DESC);

-- 注释
COMMENT ON TABLE playpass_pricing_config IS 'PlayPass 内容定价配置表 - Directus 后台可修改';
COMMENT ON COLUMN playpass_pricing_config.pp_price IS '基础价格 (Free会员价格)';
COMMENT ON COLUMN playpass_pricing_config.membership_discounts IS '会员折扣配置: Level 0-4 对应折扣比例';
COMMENT ON COLUMN playpass_pricing_config.apply_conditions IS '定价适用条件,用于动态定价';
COMMENT ON COLUMN playpass_pricing_config.priority IS '当多个规则匹配时,使用优先级最高的';
```

**定价配置示例数据**:

```sql
-- 示例 1: 普通策略定价
INSERT INTO playpass_pricing_config (config_key, config_name, content_type, pp_price) VALUES
('strategy_default', '普通策略默认定价', 'strategy', 50);

-- 示例 2: 高风险策略定价 (更贵)
INSERT INTO playpass_pricing_config (
  config_key, config_name, content_type, pp_price, apply_conditions, priority
) VALUES (
  'strategy_high_risk', '高风险策略定价', 'strategy', 100,
  '{"risk_level": [4, 5]}'::jsonb, 10
);

-- 示例 3: 套利信号定价
INSERT INTO playpass_pricing_config (config_key, config_name, content_type, pp_price) VALUES
('arbitrage_signal', '套利信号定价', 'arbitrage', 30);

-- 示例 4: 新闻免费
INSERT INTO playpass_pricing_config (config_key, config_name, content_type, pp_price) VALUES
('news_free', '新闻免费', 'news', 0);

-- 示例 5: Play Exchange 策略定价 (贵)
INSERT INTO playpass_pricing_config (config_key, config_name, content_type, pp_price) VALUES
('play_exchange_premium', 'Play Exchange 高级策略', 'play_exchange', 200);
```

#### 表7: playpass_reward_config (PP 奖励规则配置) 🆕

```sql
CREATE TABLE playpass_reward_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 奖励规则标识
  reward_key VARCHAR(100) NOT NULL UNIQUE,
  reward_name VARCHAR(200) NOT NULL,
  reward_description TEXT,

  -- 行为类型
  action_type VARCHAR(50) NOT NULL,
  -- 'daily_signin', 'read_strategy', 'share_content', 'comment',
  -- 'publish_strategy', 'publish_news', 'referral', 'achievement'

  -- 奖励金额
  pp_amount INT NOT NULL CHECK (pp_amount > 0),

  -- 是否应用会员倍率
  apply_multiplier BOOLEAN DEFAULT TRUE,

  -- 频率限制
  limit_type VARCHAR(20), -- 'daily', 'weekly', 'monthly', 'total', 'none'
  limit_count INT, -- 每个周期最多完成次数

  -- 冷却时间 (秒)
  cooldown_seconds INT DEFAULT 0,

  -- 会员等级要求
  min_membership_level INT DEFAULT 0 CHECK (min_membership_level >= 0 AND min_membership_level <= 4),

  -- 额外条件 (JSON)
  extra_conditions JSONB,
  -- 例如: {"consecutive_days": 7} - 连续签到7天
  -- 例如: {"min_word_count": 500} - 评论最少500字

  -- 奖励倍数 (特殊活动时可调整)
  reward_multiplier DECIMAL(3,2) DEFAULT 1.0,

  -- 是否计入每日上限
  count_towards_daily_limit BOOLEAN DEFAULT TRUE,

  -- 状态
  is_active BOOLEAN DEFAULT TRUE,

  -- 显示配置
  icon VARCHAR(50),
  badge_text VARCHAR(50),
  display_order INT DEFAULT 0,

  -- 统计
  total_completions INT DEFAULT 0,
  total_pp_distributed INT DEFAULT 0,

  -- 时间
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  valid_from TIMESTAMPTZ,
  valid_until TIMESTAMPTZ,

  -- 创建者
  created_by UUID REFERENCES auth.users(id)
);

-- 索引
CREATE INDEX idx_reward_action_type ON playpass_reward_config(action_type);
CREATE INDEX idx_reward_active ON playpass_reward_config(is_active);
CREATE INDEX idx_reward_display_order ON playpass_reward_config(display_order);

-- 注释
COMMENT ON TABLE playpass_reward_config IS 'PlayPass 奖励规则配置表 - Directus 后台可修改';
COMMENT ON COLUMN playpass_reward_config.pp_amount IS '基础奖励金额';
COMMENT ON COLUMN playpass_reward_config.apply_multiplier IS '是否应用会员倍率 (1.0x-2.0x)';
COMMENT ON COLUMN playpass_reward_config.reward_multiplier IS '活动倍数,如双倍PP活动设为2.0';
COMMENT ON COLUMN playpass_reward_config.count_towards_daily_limit IS '是否计入每日获取上限';
```

**奖励配置示例数据**:

```sql
-- 每日签到
INSERT INTO playpass_reward_config (
  reward_key, reward_name, action_type, pp_amount,
  apply_multiplier, limit_type, limit_count, icon
) VALUES (
  'daily_signin', '每日签到', 'daily_signin', 10,
  TRUE, 'daily', 1, '📅'
);

-- 阅读策略
INSERT INTO playpass_reward_config (
  reward_key, reward_name, action_type, pp_amount,
  apply_multiplier, limit_type, limit_count, icon
) VALUES (
  'read_strategy', '阅读策略', 'read_strategy', 5,
  TRUE, 'daily', 10, '📖'
);

-- 分享内容
INSERT INTO playpass_reward_config (
  reward_key, reward_name, action_type, pp_amount,
  apply_multiplier, limit_type, limit_count, icon
) VALUES (
  'share_content', '分享内容', 'share_content', 3,
  TRUE, 'daily', 5, '📤'
);

-- 发表评论
INSERT INTO playpass_reward_config (
  reward_key, reward_name, action_type, pp_amount,
  apply_multiplier, limit_type, limit_count, icon, extra_conditions
) VALUES (
  'comment_quality', '优质评论', 'comment', 2,
  TRUE, 'daily', 10, '💬', '{"min_length": 50}'::jsonb
);

-- 发布策略 (高奖励)
INSERT INTO playpass_reward_config (
  reward_key, reward_name, action_type, pp_amount,
  apply_multiplier, limit_type, limit_count, icon, count_towards_daily_limit
) VALUES (
  'publish_strategy', '发布策略', 'publish_strategy', 100,
  TRUE, 'none', NULL, '✍️', FALSE
);

-- 邀请新用户
INSERT INTO playpass_reward_config (
  reward_key, reward_name, action_type, pp_amount,
  apply_multiplier, limit_type, limit_count, icon, count_towards_daily_limit
) VALUES (
  'referral', '邀请好友', 'referral', 50,
  FALSE, 'none', NULL, '👥', FALSE
);

-- 连续签到7天奖励
INSERT INTO playpass_reward_config (
  reward_key, reward_name, action_type, pp_amount,
  apply_multiplier, limit_type, limit_count, icon, extra_conditions, count_towards_daily_limit
) VALUES (
  'signin_streak_7', '连续签到7天', 'achievement', 30,
  FALSE, 'none', NULL, '🔥', '{"consecutive_days": 7}'::jsonb, FALSE
);

-- 连续签到30天奖励
INSERT INTO playpass_reward_config (
  reward_key, reward_name, action_type, pp_amount,
  apply_multiplier, limit_type, limit_count, icon, extra_conditions, count_towards_daily_limit
) VALUES (
  'signin_streak_30', '连续签到30天', 'achievement', 200,
  FALSE, 'none', NULL, '🏆', '{"consecutive_days": 30}'::jsonb, FALSE
);
```

### 4.2 扩展现有表

#### strategies 表扩展

```sql
-- 添加 PP 价格字段
ALTER TABLE strategies
ADD COLUMN IF NOT EXISTS pp_price INT DEFAULT 0 CHECK (pp_price >= 0),
ADD COLUMN IF NOT EXISTS is_free_for_max BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS free_preview_length INT DEFAULT 500;

-- 注释
COMMENT ON COLUMN strategies.pp_price IS '查看策略所需 PlayPass,0 表示免费';
COMMENT ON COLUMN strategies.is_free_for_max IS 'MAX 会员是否免费访问';

-- 索引
CREATE INDEX IF NOT EXISTS idx_strategies_pp_price ON strategies(pp_price);
```

#### arbitrage 表扩展

```sql
ALTER TABLE arbitrage
ADD COLUMN IF NOT EXISTS pp_price INT DEFAULT 10 CHECK (pp_price >= 0);

COMMENT ON COLUMN arbitrage.pp_price IS '套利信号 PlayPass 价格';
```

---

## 🎁 PP 获取机制

### 5.1 获取途径总览

| 类别 | 行为 | PP 奖励 | 频率限制 | 会员加成 | MAX会员 |
|------|------|---------|---------|---------|---------|
| **📅 每日任务** | | | | | |
| 每日签到 | +10 PP | 1次/天 | ✅ | ✅ |
| 浏览5篇策略 | +5 PP | 1次/天 | ✅ | ✅ |
| 分享内容 | +3 PP | 5次/天 | ✅ | ✅ |
| 发表评论 | +2 PP | 10次/天 | ✅ | ✅ |
| **📝 内容贡献** | | | | | |
| 发布策略(审核通过) | +100 PP | 不限 | ✅ | ✅ |
| 发布快讯 | +20 PP | 不限 | ✅ | ✅ |
| 发布八卦 | +15 PP | 5次/天 | ✅ | ✅ |
| **👥 社交互动** | | | | | |
| 邀请新用户注册 | +50 PP | 不限 | ✅ | ✅ |
| 点赞内容 | +1 PP | 20次/天 | ❌ | ✅ |
| 关注用户 | +2 PP | 10次/天 | ❌ | ✅ |
| **🏆 成就系统** | | | | | |
| 连续签到7天 | +30 PP | 每周 | ❌ | ✅ |
| 连续签到30天 | +200 PP | 每月 | ❌ | ✅ |
| 发布10篇策略 | +150 PP | 一次性 | ❌ | ✅ |
| 累计100赞 | +100 PP | 一次性 | ❌ | ✅ |
| **🎉 特殊奖励** | | | | | |
| 新人注册礼包 | +200 PP | 一次性 | ❌ | - |
| 节日活动 | +100-500 PP | 不定期 | ✅ | ✅ |
| 管理员赠送 | 自定义 | 不限 | ❌ | ✅ |

### 5.2 会员 PP 倍率

```typescript
// 会员 PlayPass 获取倍率
const MEMBERSHIP_PP_MULTIPLIERS = {
  0: 1.0,   // Free: 基础倍率
  1: 1.2,   // Pro: +20%
  2: 1.5,   // Premium: +50%
  3: 2.0,   // Partner: +100%
  4: 999.99, // MAX: 无限 (实际不需要获取,全站免费)
};

// 示例计算
// Free 用户每日签到: 10 × 1.0 = 10 PP
// Pro 用户每日签到: 10 × 1.2 = 12 PP
// Premium 用户每日签到: 10 × 1.5 = 15 PP
// MAX 用户: 无需获取,全站免费
```

### 5.3 每日获取上限

```typescript
// 防刷机制 - 每日获取上限
const DAILY_EARN_LIMITS = {
  0: 1000,      // Free: 1000 PP/天
  1: 1500,      // Pro: 1500 PP/天
  2: 2500,      // Premium: 2500 PP/天
  3: 5000,      // Partner: 5000 PP/天
  4: 999999,    // MAX: 无限制
};

// 说明:
// - 管理员赠送的 PP 不计入每日上限
// - 活动奖励不计入每日上限
// - 成就奖励不计入每日上限
```

### 5.4 连续签到奖励

```typescript
// 连续签到阶梯奖励
const CONSECUTIVE_SIGNIN_REWARDS = [
  { days: 1, pp: 10 },      // 第1天
  { days: 3, pp: 15 },      // 第3天 (+5 bonus)
  { days: 7, pp: 30 },      // 第7天 (+15 bonus)
  { days: 14, pp: 50 },     // 第14天 (+20 bonus)
  { days: 30, pp: 200 },    // 第30天 (+150 bonus)
  { days: 60, pp: 300 },    // 第60天 (+100 bonus)
  { days: 100, pp: 500 },   // 第100天 (+200 bonus)
];

// 断签规则: 超过48小时未签到,连续天数清零
```

---

## 💸 PP 消耗机制

### 6.1 内容定价表

| 内容类型 | 基础价格 | Free | Pro | Premium | Partner | **MAX** |
|---------|---------|------|-----|---------|---------|---------|
| **策略** | | | | | | |
| 普通策略 | 10 PP | 10 PP | 免费 | 免费 | 免费 | **免费** |
| 精选策略 | 30 PP | 30 PP | 15 PP | 免费 | 免费 | **免费** |
| 高级策略 | 50 PP | 50 PP | 35 PP | 25 PP | 免费 | **免费** |
| 专家策略 | 100 PP | 100 PP | 70 PP | 50 PP | 20 PP | **免费** |
| **套利信号** | | | | | | |
| 普通套利 | 20 PP | 20 PP | 14 PP | 10 PP | 免费 | **免费** |
| 紧急套利 | 50 PP | 50 PP | 35 PP | 25 PP | 10 PP | **免费** |
| **快讯&八卦** | | | | | | |
| 普通快讯 | 5 PP | 5 PP | 免费 | 免费 | 免费 | **免费** |
| 深度快讯 | 15 PP | 15 PP | 免费 | 免费 | 免费 | **免费** |
| 独家八卦 | 10 PP | 10 PP | 5 PP | 免费 | 免费 | **免费** |
| **资源下载** | | | | | | |
| PDF报告 | 50 PP | 50 PP | 35 PP | 25 PP | 10 PP | **免费** |
| 数据表格 | 30 PP | 30 PP | 21 PP | 15 PP | 5 PP | **免费** |
| 工具脚本 | 100 PP | 100 PP | 70 PP | 50 PP | 20 PP | **免费** |

### 6.2 动态定价公式

```typescript
// 计算内容实际价格
function calculateContentPrice(
  content: Content,
  userMembershipLevel: number,
  isMaxMember: boolean
): number {
  // MAX 会员全免费
  if (isMaxMember) {
    return 0;
  }

  let basePrice = content.pp_price;

  // 会员折扣
  const discountRates = {
    strategy_normal: { 0: 0, 1: 1.0, 2: 1.0, 3: 1.0 },
    strategy_featured: { 0: 0, 1: 0.5, 2: 1.0, 3: 1.0 },
    strategy_advanced: { 0: 0, 1: 0.3, 2: 0.5, 3: 1.0 },
    arbitrage: { 0: 0, 1: 0.3, 2: 0.5, 3: 1.0 },
  };

  const discount = discountRates[content.type]?.[userMembershipLevel] || 0;
  basePrice = basePrice * (1 - discount);

  // 热度加成
  if (content.hotness_score > 500) {
    basePrice = basePrice * 1.2;
  }

  // 时效性折扣 (旧内容降价)
  const ageInDays = getDaysOld(content.published_at);
  if (ageInDays > 90) {
    basePrice = basePrice * 0.7;
  }

  // 最小价格
  return Math.max(Math.round(basePrice), 0);
}
```

### 6.3 重复访问规则

```typescript
// 已解锁内容访问策略
const CONTENT_ACCESS_POLICY = {
  // 永久解锁 (一次付费,终身免费)
  permanent: [
    'strategy',
    'download_resource',
    'news',
    'gossip',
  ],

  // MAX 会员: 全部免费,无需解锁
  max_member_free: true,
};
```

---

## 👑 MAX 会员升级流程

### 7.1 升级入口设计

#### 场景1: PP 不足时

```tsx
// 用户 PP 不足,弹窗提示
<InsufficientPPDialog>
  <AlertBox>
    您的 PlayPass 不足!
    需要: 50 PP
    当前: 10 PP
  </AlertBox>

  <QuickActions>
    <Button>完成每日任务 (+30 PP)</Button>
    <Button>分享内容 (+5 PP)</Button>
  </QuickActions>

  <Divider />

  <MaxMemberCTA>
    <Icon>👑</Icon>
    <Title>升级 MAX 会员</Title>
    <Description>
      • 无限 PlayPass
      • 全站内容免费
      • 专属徽章和特权
    </Description>
    <TelegramButton href="https://t.me/playnew_admin">
      💬 联系 Telegram 管理员升级
    </TelegramButton>
  </MaxMemberCTA>
</InsufficientPPDialog>
```

#### 场景2: Pricing 页面

```tsx
// /pricing 页面显示 MAX 会员
<PricingPage>
  <MembershipCard level="MAX" featured>
    <Badge>👑 最高等级</Badge>
    <Title>MAX 会员</Title>
    <Features>
      • 无限 PlayPass
      • 全站内容永久免费
      • 金色专属徽章
      • 优先客服支持
      • 发布内容 70% 收益
    </Features>
    <Price>联系获取</Price>
    <CTAButton href="https://t.me/playnew_admin">
      💬 Telegram 联系管理员
    </CTAButton>
  </MembershipCard>
</PricingPage>
```

#### 场景3: 用户中心

```tsx
// /profile 页面显示升级入口
<ProfilePage>
  <CurrentMembership>
    当前: Pro 会员
    每日 PP 上限: 1500
  </CurrentMembership>

  <UpgradeCTA>
    <Icon>👑</Icon>
    <Text>升级 MAX 会员,解锁无限 PlayPass</Text>
    <TelegramButton>
      💬 联系 Telegram 管理员
    </TelegramButton>
  </UpgradeCTA>
</ProfilePage>
```

### 7.2 Telegram 升级流程

```
用户点击"联系 Telegram 管理员"
    ↓
打开 Telegram 对话
    ↓
用户发送消息: "我想升级 MAX 会员"
    ↓
管理员确认用户身份 (邮箱/用户ID)
    ↓
管理员线下收款 (具体方式由你们决定)
    ↓
管理员在后台执行升级操作
    ↓
用户刷新页面,成为 MAX 会员
    ↓
用户获得: 无限 PP + 全站免费 + 金色徽章
```

### 7.3 管理员升级操作

#### 方法1: 直接修改数据库 (推荐)

```sql
-- 升级用户为 MAX 会员
UPDATE user_playpass
SET
  membership_level = 4,
  is_max_member = TRUE,
  earn_multiplier = 999.99,
  daily_earn_limit = 999999,
  current_balance = 999999,
  updated_at = NOW()
WHERE user_id = 'user-uuid-here';

-- 记录升级交易
INSERT INTO playpass_transactions (
  user_id,
  transaction_type,
  amount,
  balance_before,
  balance_after,
  source_type,
  description
) VALUES (
  'user-uuid-here',
  'admin_grant',
  999999,
  (SELECT current_balance FROM user_playpass WHERE user_id = 'user-uuid-here'),
  999999,
  'upgrade_max',
  'Telegram 管理员手动升级为 MAX 会员'
);
```

#### 方法2: 管理员 API (可选)

```bash
# POST /api/admin/upgrade-max-member
curl -X POST https://playnew.ai/api/admin/upgrade-max-member \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "uuid-here",
    "reason": "Telegram 付费升级"
  }'
```

### 7.4 MAX 会员验证逻辑

```typescript
// 前端 Hook: useIsMaxMember
export function useIsMaxMember() {
  const { user } = useAuth();
  const { data: playpass } = usePlayPass(user?.id);

  return {
    isMaxMember: playpass?.is_max_member === true,
    hasUnlimitedPP: playpass?.membership_level === 4,
  };
}

// 内容访问检查
export async function checkContentAccess(contentId: string, userId: string) {
  const playpass = await getPlayPass(userId);

  // MAX 会员直接通过
  if (playpass.is_max_member) {
    return {
      canAccess: true,
      ppCost: 0,
      reason: 'MAX 会员全站免费',
    };
  }

  // 其他会员正常计算价格
  const content = await getContent(contentId);
  const ppCost = calculateContentPrice(content, playpass.membership_level, false);

  return {
    canAccess: playpass.current_balance >= ppCost,
    ppCost,
    currentBalance: playpass.current_balance,
  };
}
```

---

## 🔌 API 设计

### 8.1 核心 API 端点

#### 1. GET /api/playpass/balance
获取用户 PlayPass 余额

**Response:**
```json
{
  "success": true,
  "data": {
    "user_id": "uuid",
    "current_balance": 1250,
    "total_earned": 5000,
    "total_spent": 3750,
    "membership_level": 2,
    "membership_name": "Premium",
    "is_max_member": false,
    "earn_multiplier": 1.5,
    "daily_earned_today": 65,
    "daily_earn_limit": 2500,
    "pp_level": 3,
    "level_name": "金牌玩家"
  }
}
```

#### 2. POST /api/playpass/earn
获得 PlayPass

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
    "amount": 15,
    "original_amount": 10,
    "bonus_amount": 5,
    "bonus_reason": "会员加成 +50%",
    "balance_before": 1250,
    "balance_after": 1265,
    "daily_earned_today": 80,
    "reached_daily_limit": false
  }
}
```

#### 3. POST /api/playpass/spend
消耗 PlayPass

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
    "discount_reason": "Premium 会员 -40%",
    "balance_before": 1265,
    "balance_after": 1235,
    "content_unlocked": true
  }
}
```

#### 4. POST /api/playpass/check-access
检查内容访问权限

**Request:**
```json
{
  "content_type": "strategy",
  "content_id": "uuid"
}
```

**Response (普通用户):**
```json
{
  "success": true,
  "data": {
    "content_id": "uuid",
    "content_title": "Uniswap V3 流动性挖矿",
    "base_price": 50,
    "final_price": 30,
    "your_balance": 1235,
    "can_afford": true,
    "already_unlocked": false,
    "is_max_member": false
  }
}
```

**Response (MAX 会员):**
```json
{
  "success": true,
  "data": {
    "content_id": "uuid",
    "content_title": "Uniswap V3 流动性挖矿",
    "base_price": 50,
    "final_price": 0,
    "your_balance": 999999,
    "can_afford": true,
    "already_unlocked": true,
    "is_max_member": true,
    "max_member_message": "MAX 会员全站免费"
  }
}
```

#### 5. GET /api/playpass/tasks
获取任务列表

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
        "description": "每天登录获得 PP",
        "pp_reward": 10,
        "progress": {
          "current": 1,
          "total": 1,
          "completed": true
        },
        "next_available_at": "2025-11-17T00:00:00Z"
      }
    ],
    "daily_summary": {
      "tasks_completed": 3,
      "pp_earned": 25,
      "remaining_tasks": 2
    }
  }
}
```

#### 6. GET /api/playpass/transactions
查询 PP 流水

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
        "amount": 15,
        "balance_before": 1250,
        "balance_after": 1265,
        "display_title": "每日签到奖励",
        "created_at": "2025-11-16T08:00:00Z"
      }
    ],
    "pagination": {
      "total": 128,
      "limit": 20,
      "offset": 0
    }
  }
}
```

#### 7. POST /api/admin/upgrade-max-member (管理员)
升级用户为 MAX 会员

**Request:**
```json
{
  "user_id": "uuid",
  "reason": "Telegram 付费升级"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user_id": "uuid",
    "membership_level": 4,
    "is_max_member": true,
    "current_balance": 999999,
    "message": "用户已升级为 MAX 会员"
  }
}
```

---

## 🎨 前端组件设计

### 9.1 PlayPass 余额显示

```tsx
// components/playpass/PlayPassBalance.tsx
import { Ticket, Crown } from 'lucide-react';

export function PlayPassBalance({ balance, isMaxMember, level }: Props) {
  return (
    <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border border-purple-200 dark:border-purple-800">
      {/* 图标 */}
      <div className="relative">
        {isMaxMember ? (
          <Crown className="w-6 h-6 text-amber-500 animate-pulse" />
        ) : (
          <Ticket className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        )}
      </div>

      {/* 余额信息 */}
      <div className="flex flex-col gap-0.5">
        <div className="flex items-baseline gap-1.5">
          {isMaxMember ? (
            <>
              <span className="text-lg font-bold text-amber-600">∞</span>
              <span className="text-xs text-amber-500">MAX</span>
            </>
          ) : (
            <>
              <span className="text-lg font-bold text-purple-900 dark:text-white">
                {balance.toLocaleString()}
              </span>
              <span className="text-xs text-purple-600">PP</span>
            </>
          )}
        </div>

        {!isMaxMember && (
          <span className="text-xs text-purple-500">
            Lv.{level}
          </span>
        )}
      </div>

      {/* MAX 会员徽章 */}
      {isMaxMember && (
        <div className="ml-auto px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs font-bold">
          👑 MAX
        </div>
      )}
    </div>
  );
}
```

### 9.2 PP 不足弹窗

```tsx
// components/playpass/InsufficientPPDialog.tsx
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle, Gift, Share2, Crown } from 'lucide-react';

export function InsufficientPPDialog({
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
        {/* 标题 */}
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-6 h-6 text-purple-500" />
          <h3 className="text-xl font-bold">PlayPass 不足</h3>
        </div>

        {/* 当前状态 */}
        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200 mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">查看内容</span>
            <span className="font-medium">{contentTitle}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">所需 PP</span>
            <span className="font-bold text-purple-600">{required} PP</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600">当前 PP</span>
            <span className="font-bold">{current} PP</span>
          </div>
          <div className="border-t pt-2 mt-2 flex justify-between">
            <span className="text-sm font-medium text-red-600">还差</span>
            <span className="font-bold text-lg text-red-600">{shortfall} PP</span>
          </div>
        </div>

        {/* 快速获取 PP */}
        <div className="space-y-2 mb-4">
          <h4 className="font-semibold text-sm">快速获取 PlayPass:</h4>

          <Button variant="outline" className="w-full justify-between">
            <span className="flex items-center gap-2">
              <Gift className="w-4 h-4 text-green-500" />
              完成每日任务
            </span>
            <span className="text-green-600 font-semibold">+30 PP</span>
          </Button>

          <Button variant="outline" className="w-full justify-between">
            <span className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-blue-500" />
              分享到社交媒体
            </span>
            <span className="text-blue-600 font-semibold">+5 PP</span>
          </Button>
        </div>

        {/* MAX 会员 CTA */}
        <div className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Crown className="w-5 h-5 text-amber-600" />
            <h4 className="font-bold text-amber-900">升级 MAX 会员</h4>
          </div>
          <ul className="text-sm text-amber-800 mb-3 space-y-1">
            <li>• 无限 PlayPass</li>
            <li>• 全站内容永久免费</li>
            <li>• 金色专属徽章</li>
          </ul>
          <Button
            className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600"
            onClick={() => window.open('https://t.me/playnew_admin', '_blank')}
          >
            💬 联系 Telegram 管理员升级
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

### 9.3 MAX 会员卡片

```tsx
// components/playpass/MaxMemberCard.tsx
export function MaxMemberCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-amber-400 bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-50 dark:from-amber-950 dark:via-yellow-950 dark:to-amber-950 p-6">
      {/* 背景装饰 */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-amber-300/30 to-yellow-300/30 rounded-full blur-3xl" />

      {/* 徽章 */}
      <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs font-bold">
        最高等级
      </div>

      <div className="relative">
        {/* 标题 */}
        <div className="flex items-center gap-3 mb-4">
          <Crown className="w-8 h-8 text-amber-600 animate-pulse" />
          <div>
            <h3 className="text-2xl font-black bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
              MAX 会员
            </h3>
            <p className="text-sm text-amber-700">PlayNew.ai 至尊特权</p>
          </div>
        </div>

        {/* 特权列表 */}
        <div className="space-y-2 mb-6">
          {[
            '无限 PlayPass',
            '全站内容永久免费',
            '金色专属徽章',
            '优先客服支持',
            '发布内容 70% 收益',
            '推荐用户 20% 返佣',
          ].map((feature, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-600" />
              <span className="text-sm text-amber-900 dark:text-amber-100">
                {feature}
              </span>
            </div>
          ))}
        </div>

        {/* CTA 按钮 */}
        <Button
          className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-bold text-base h-12"
          onClick={() => window.open('https://t.me/playnew_admin', '_blank')}
        >
          <span className="mr-2">💬</span>
          联系 Telegram 管理员
        </Button>

        <p className="text-xs text-center text-amber-700 mt-2">
          通过 Telegram 私聊管理员获取 MAX 会员资格
        </p>
      </div>
    </div>
  );
}
```

---

## 📊 实施路线图

### Phase 1: 数据库和基础 (第1周)

**任务清单**:
- [ ] 创建 5 个核心表
- [ ] 扩展 strategies/arbitrage 表
- [ ] 编写初始化脚本
- [ ] 为现有用户创建 PlayPass 记录 (200 PP)
- [ ] 配置 Supabase RLS 策略

**交付物**:
- `sql/init-playpass-system.sql`
- 数据库文档

---

### Phase 2: 后端 API 开发 (第2周)

**任务清单**:
- [ ] `/api/playpass/balance` - 查询余额
- [ ] `/api/playpass/earn` - 获得 PP
- [ ] `/api/playpass/spend` - 消耗 PP
- [ ] `/api/playpass/check-access` - 检查访问权限
- [ ] `/api/playpass/tasks` - 任务列表
- [ ] `/api/playpass/transactions` - 流水记录
- [ ] `/api/admin/upgrade-max-member` - 升级 MAX 会员
- [ ] API 单元测试

**交付物**:
- 7 个 API 端点
- API 文档

---

### Phase 3: 前端组件开发 (第3周)

**任务清单**:
- [ ] PlayPassBalance - Header 显示
- [ ] InsufficientPPDialog - PP 不足弹窗
- [ ] MaxMemberCard - MAX 会员卡片
- [ ] DailyTasksPanel - 每日任务面板
- [ ] PlayPassHistory - PP 流水页面
- [ ] usePlayPassGate - 内容访问 Hook
- [ ] Pricing 页面更新 (添加 MAX 会员)

**交付物**:
- 7 个 React 组件
- 1 个 Custom Hook
- 更新的 Pricing 页面

---

### Phase 4: 内容访问集成 (第3-4周)

**任务清单**:
- [ ] 策略详情页 PP 检查
- [ ] 套利信号页 PP 检查
- [ ] 新闻详情页 PP 检查
- [ ] 资源下载 PP 检查
- [ ] 内容预览功能
- [ ] Directus 配置内容价格

**交付物**:
- 内容访问拦截器
- Directus 价格配置

---

### Phase 5: 任务和奖励系统 (第4周)

**任务清单**:
- [ ] 配置每日任务
- [ ] 实现签到逻辑
- [ ] 连续签到奖励
- [ ] 成就系统
- [ ] Cron Job (每日重置)

**交付物**:
- 任务配置
- 定时任务脚本

---

### Phase 6: 测试和上线 (第5周)

**任务清单**:
- [ ] 功能测试
- [ ] 安全测试 (防刷 PP)
- [ ] 压力测试
- [ ] 修复 Bug
- [ ] 编写用户文档
- [ ] 部署生产环境

**交付物**:
- 测试报告
- 用户使用指南
- 生产部署

---

## ✅ 开发清单总览

### 数据库 (7项)
- [ ] user_playpass 表
- [ ] playpass_transactions 表
- [ ] playpass_tasks 表
- [ ] user_task_progress 表
- [ ] user_unlocked_content 表
- [ ] strategies 表扩展
- [ ] arbitrage 表扩展

### API (7项)
- [ ] GET /api/playpass/balance
- [ ] POST /api/playpass/earn
- [ ] POST /api/playpass/spend
- [ ] POST /api/playpass/check-access
- [ ] GET /api/playpass/tasks
- [ ] GET /api/playpass/transactions
- [ ] POST /api/admin/upgrade-max-member

### 前端组件 (7项)
- [ ] PlayPassBalance
- [ ] InsufficientPPDialog
- [ ] MaxMemberCard
- [ ] DailyTasksPanel
- [ ] PlayPassHistory Page
- [ ] usePlayPassGate Hook
- [ ] Pricing Page 更新

### 功能集成 (5项)
- [ ] 策略详情页集成
- [ ] 套利信号页集成
- [ ] 签到系统
- [ ] 成就系统
- [ ] Directus 价格配置

**总计**: 26 项任务

---

## 🎛️ Directus 后台配置指南

### 11.1 配置功能概述

Directus 后台可以灵活配置两个核心功能：

#### ✅ 功能 1: 内容定价配置
**配置表**: `playpass_pricing_config`
**功能**: 管理员可以在后台设置和修改各类内容的 PlayPass 价格

#### ✅ 功能 2: PP 奖励规则配置
**配置表**: `playpass_reward_config`
**功能**: 管理员可以在后台设置和修改获取 PP 的数量和规则

---

### 11.2 内容定价配置 (playpass_pricing_config)

#### 在 Directus 后台创建定价规则

**步骤 1**: 进入 Directus 后台 → PlayPass Pricing Config

**步骤 2**: 点击 "Create Item" 创建新定价规则

**步骤 3**: 填写配置字段

| 字段 | 说明 | 示例 |
|------|------|------|
| **config_key** | 规则唯一标识 | `strategy_high_risk` |
| **config_name** | 规则名称 | `高风险策略定价` |
| **content_type** | 内容类型 | `strategy`, `arbitrage`, `news`, `play_exchange` |
| **pp_price** | 基础价格 (Free会员价格) | `100` |
| **membership_discounts** | 会员折扣 (JSON) | `{"0": 1.0, "1": 0.9, "2": 0.7, "3": 0.5, "4": 0.0}` |
| **is_free_for_max** | MAX会员是否免费 | `true` (勾选) |
| **free_preview_length** | 免费预览长度 (字符数) | `500` |
| **apply_conditions** | 适用条件 (JSON) | `{"risk_level": [4, 5]}` |
| **priority** | 优先级 (越大越优先) | `10` |
| **is_active** | 是否启用 | `true` (勾选) |

#### 示例配置场景

**场景 1: 设置高风险策略价格更贵**

```json
{
  "config_key": "strategy_high_risk",
  "config_name": "高风险策略定价",
  "content_type": "strategy",
  "pp_price": 100,
  "apply_conditions": {
    "risk_level": [4, 5]
  },
  "priority": 10,
  "is_active": true
}
```

**场景 2: 空投类策略免费**

```json
{
  "config_key": "strategy_airdrop_free",
  "config_name": "空投策略免费",
  "content_type": "strategy",
  "pp_price": 0,
  "apply_conditions": {
    "category_l1": "airdrop"
  },
  "priority": 5,
  "is_active": true
}
```

**场景 3: DeFi 高级策略定价**

```json
{
  "config_key": "strategy_defi_premium",
  "config_name": "DeFi 高级策略",
  "content_type": "strategy",
  "pp_price": 150,
  "apply_conditions": {
    "category_l1": "yield",
    "threshold_tech_level": "advanced"
  },
  "membership_discounts": {
    "0": 1.0,
    "1": 0.85,
    "2": 0.6,
    "3": 0.3,
    "4": 0.0
  },
  "priority": 15,
  "is_active": true
}
```

**场景 4: 套利信号分级定价**

```json
// 低风险套利 - 30 PP
{
  "config_key": "arbitrage_low_risk",
  "content_type": "arbitrage",
  "pp_price": 30,
  "apply_conditions": {"risk_level": [1, 2]},
  "priority": 5
}

// 中风险套利 - 50 PP
{
  "config_key": "arbitrage_medium_risk",
  "content_type": "arbitrage",
  "pp_price": 50,
  "apply_conditions": {"risk_level": [3]},
  "priority": 6
}

// 高风险套利 - 100 PP
{
  "config_key": "arbitrage_high_risk",
  "content_type": "arbitrage",
  "pp_price": 100,
  "apply_conditions": {"risk_level": [4, 5]},
  "priority": 10
}
```

#### 定价匹配逻辑

```typescript
// 系统如何选择定价规则
function getPriceForContent(content) {
  // 1. 查询所有激活的定价规则
  const rules = await prisma.playpass_pricing_config.findMany({
    where: {
      content_type: content.type,
      is_active: true
    },
    orderBy: { priority: 'desc' } // 优先级降序
  });

  // 2. 按优先级匹配条件
  for (const rule of rules) {
    if (matchesConditions(content, rule.apply_conditions)) {
      return rule.pp_price;
    }
  }

  // 3. 没有匹配规则,返回默认定价
  return getDefaultPrice(content.type);
}
```

---

### 11.3 PP 奖励规则配置 (playpass_reward_config)

#### 在 Directus 后台创建奖励规则

**步骤 1**: 进入 Directus 后台 → PlayPass Reward Config

**步骤 2**: 点击 "Create Item" 创建新奖励规则

**步骤 3**: 填写配置字段

| 字段 | 说明 | 示例 |
|------|------|------|
| **reward_key** | 奖励唯一标识 | `daily_signin` |
| **reward_name** | 奖励名称 | `每日签到` |
| **action_type** | 行为类型 | `daily_signin`, `read_strategy`, `comment`, `share_content` |
| **pp_amount** | 基础奖励金额 | `10` |
| **apply_multiplier** | 是否应用会员倍率 | `true` (勾选) |
| **limit_type** | 频率限制 | `daily`, `weekly`, `monthly`, `total`, `none` |
| **limit_count** | 每周期最多次数 | `1` (每日签到限1次) |
| **cooldown_seconds** | 冷却时间 (秒) | `0` |
| **min_membership_level** | 会员等级要求 | `0` (所有人), `1` (Pro+), `2` (Premium+) |
| **extra_conditions** | 额外条件 (JSON) | `{"min_length": 50}` |
| **reward_multiplier** | 活动倍数 | `1.0` (普通), `2.0` (双倍活动) |
| **count_towards_daily_limit** | 是否计入每日上限 | `true` (勾选) |
| **is_active** | 是否启用 | `true` (勾选) |
| **icon** | 显示图标 | `📅`, `📖`, `💬` |
| **display_order** | 显示顺序 | `1` |

#### 示例奖励规则

**规则 1: 每日签到**

```json
{
  "reward_key": "daily_signin",
  "reward_name": "每日签到",
  "action_type": "daily_signin",
  "pp_amount": 10,
  "apply_multiplier": true,
  "limit_type": "daily",
  "limit_count": 1,
  "is_active": true,
  "icon": "📅",
  "display_order": 1
}
```

**实际奖励计算**:
- Free 用户: 10 × 1.0 = **10 PP**
- Pro 用户: 10 × 1.2 = **12 PP**
- Premium 用户: 10 × 1.5 = **15 PP**
- Partner 用户: 10 × 2.0 = **20 PP**

---

**规则 2: 阅读策略**

```json
{
  "reward_key": "read_strategy",
  "reward_name": "阅读策略",
  "action_type": "read_strategy",
  "pp_amount": 5,
  "apply_multiplier": true,
  "limit_type": "daily",
  "limit_count": 10,
  "cooldown_seconds": 60,
  "is_active": true,
  "icon": "📖",
  "display_order": 2
}
```

**说明**:
- 每阅读一篇策略奖励 5 PP (应用会员倍率)
- 每天最多 10 次
- 冷却时间 60 秒 (防止刷新页面刷 PP)

---

**规则 3: 发表优质评论**

```json
{
  "reward_key": "comment_quality",
  "reward_name": "优质评论",
  "action_type": "comment",
  "pp_amount": 20,
  "apply_multiplier": true,
  "limit_type": "daily",
  "limit_count": 10,
  "extra_conditions": {
    "min_length": 100
  },
  "is_active": true,
  "icon": "💬",
  "display_order": 3
}
```

**说明**:
- 评论长度必须 ≥ 100 字符
- 每条优质评论 20 PP
- 每天最多 10 条

---

**规则 4: 发布策略 (高奖励)**

```json
{
  "reward_key": "publish_strategy",
  "reward_name": "发布策略",
  "action_type": "publish_strategy",
  "pp_amount": 200,
  "apply_multiplier": true,
  "limit_type": "none",
  "count_towards_daily_limit": false,
  "is_active": true,
  "icon": "✍️",
  "display_order": 5
}
```

**说明**:
- 发布策略通过审核后奖励 200 PP
- 不限次数
- **不计入每日上限** (鼓励内容创作)

---

**规则 5: 连续签到奖励**

```json
{
  "reward_key": "signin_streak_7",
  "reward_name": "连续签到7天",
  "action_type": "achievement",
  "pp_amount": 100,
  "apply_multiplier": false,
  "limit_type": "none",
  "extra_conditions": {
    "consecutive_days": 7
  },
  "count_towards_daily_limit": false,
  "is_active": true,
  "icon": "🔥",
  "display_order": 10
}
```

**说明**:
- 连续签到 7 天一次性奖励 100 PP
- 不应用会员倍率 (固定奖励)
- 不计入每日上限

---

**规则 6: 双倍 PP 活动 (临时)**

```json
{
  "reward_key": "weekend_double_pp",
  "reward_name": "周末双倍 PP",
  "action_type": "read_strategy",
  "pp_amount": 5,
  "apply_multiplier": true,
  "reward_multiplier": 2.0,
  "limit_type": "daily",
  "limit_count": 20,
  "valid_from": "2025-12-21T00:00:00Z",
  "valid_until": "2025-12-22T23:59:59Z",
  "is_active": true,
  "icon": "🎉",
  "display_order": 1
}
```

**说明**:
- 周末双倍 PP 活动
- 阅读策略: 5 × 2.0 × 会员倍率
- 仅在指定时间段生效

---

### 11.4 后台管理界面设计

#### Directus 集合配置

**集合 1: PlayPass Pricing Config**

```json
{
  "collection": "playpass_pricing_config",
  "meta": {
    "collection": "playpass_pricing_config",
    "icon": "price_check",
    "note": "管理内容 PlayPass 定价规则",
    "display_template": "{{config_name}} - {{content_type}} ({{pp_price}} PP)",
    "hidden": false,
    "singleton": false,
    "translations": null,
    "archive_field": null,
    "archive_app_filter": true,
    "archive_value": null,
    "unarchive_value": null,
    "sort_field": "priority",
    "accountability": "all",
    "color": "#9333EA",
    "item_duplication_fields": null,
    "sort": 10,
    "group": "playpass",
    "collapse": "open"
  }
}
```

**字段显示配置**:

```json
// 列表视图显示字段
{
  "layout": "tabular",
  "layoutOptions": {
    "widths": {
      "config_name": 200,
      "content_type": 120,
      "pp_price": 100,
      "is_active": 80,
      "priority": 80
    }
  },
  "layoutQuery": {
    "fields": [
      "id",
      "config_name",
      "content_type",
      "pp_price",
      "membership_discounts",
      "is_active",
      "priority",
      "total_unlocks",
      "created_at"
    ],
    "sort": ["-priority", "content_type"]
  }
}
```

---

**集合 2: PlayPass Reward Config**

```json
{
  "collection": "playpass_reward_config",
  "meta": {
    "collection": "playpass_reward_config",
    "icon": "card_giftcard",
    "note": "管理 PlayPass 奖励规则",
    "display_template": "{{reward_name}} - {{pp_amount}} PP",
    "hidden": false,
    "singleton": false,
    "sort_field": "display_order",
    "color": "#F59E0B",
    "sort": 11,
    "group": "playpass"
  }
}
```

**字段显示配置**:

```json
{
  "layout": "tabular",
  "layoutOptions": {
    "widths": {
      "icon": 60,
      "reward_name": 180,
      "action_type": 120,
      "pp_amount": 100,
      "limit_type": 100,
      "is_active": 80
    }
  },
  "layoutQuery": {
    "fields": [
      "id",
      "icon",
      "reward_name",
      "action_type",
      "pp_amount",
      "apply_multiplier",
      "limit_type",
      "limit_count",
      "is_active",
      "total_completions",
      "total_pp_distributed"
    ],
    "sort": ["display_order"]
  }
}
```

---

### 11.5 API 动态获取配置

#### API 1: 获取内容价格

```typescript
// app/api/playpass/get-price/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  const { content_id, content_type, user_membership_level } = await request.json();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 1. 获取内容信息
  const { data: content } = await supabase
    .from(content_type === 'strategy' ? 'strategies' : 'arbitrage')
    .select('*')
    .eq('id', content_id)
    .single();

  // 2. 查询匹配的定价规则 (按优先级降序)
  const { data: pricingRules } = await supabase
    .from('playpass_pricing_config')
    .select('*')
    .eq('content_type', content_type)
    .eq('is_active', true)
    .order('priority', { ascending: false });

  // 3. 匹配定价规则
  let finalPrice = 0;
  for (const rule of pricingRules || []) {
    if (matchesConditions(content, rule.apply_conditions)) {
      // 应用会员折扣
      const discounts = rule.membership_discounts as Record<string, number>;
      const discount = discounts[user_membership_level] || 1.0;
      finalPrice = Math.round(rule.pp_price * discount);
      break;
    }
  }

  return NextResponse.json({
    success: true,
    data: {
      content_id,
      content_type,
      base_price: finalPrice,
      final_price: finalPrice,
      membership_level: user_membership_level
    }
  });
}

// 条件匹配函数
function matchesConditions(content: any, conditions: any): boolean {
  if (!conditions) return true;

  for (const [key, value] of Object.entries(conditions)) {
    if (Array.isArray(value)) {
      if (!value.includes(content[key])) return false;
    } else {
      if (content[key] !== value) return false;
    }
  }

  return true;
}
```

#### API 2: 获取奖励金额

```typescript
// app/api/playpass/get-reward/route.ts
export async function POST(request: NextRequest) {
  const { action_type, user_id, user_membership_level, extra_data } = await request.json();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 1. 查询奖励规则
  const { data: rewardRule } = await supabase
    .from('playpass_reward_config')
    .select('*')
    .eq('action_type', action_type)
    .eq('is_active', true)
    .lte('min_membership_level', user_membership_level)
    .single();

  if (!rewardRule) {
    return NextResponse.json({ success: false, error: '未找到奖励规则' });
  }

  // 2. 检查额外条件
  if (!matchesExtraConditions(extra_data, rewardRule.extra_conditions)) {
    return NextResponse.json({ success: false, error: '不满足奖励条件' });
  }

  // 3. 计算实际奖励金额
  let finalAmount = rewardRule.pp_amount;

  // 应用活动倍数
  finalAmount *= rewardRule.reward_multiplier;

  // 应用会员倍率
  if (rewardRule.apply_multiplier) {
    const membershipMultipliers = {
      0: 1.0, 1: 1.2, 2: 1.5, 3: 2.0, 4: 999.99
    };
    finalAmount *= membershipMultipliers[user_membership_level];
  }

  finalAmount = Math.round(finalAmount);

  return NextResponse.json({
    success: true,
    data: {
      action_type,
      base_amount: rewardRule.pp_amount,
      final_amount: finalAmount,
      reward_multiplier: rewardRule.reward_multiplier,
      apply_multiplier: rewardRule.apply_multiplier,
      count_towards_daily_limit: rewardRule.count_towards_daily_limit
    }
  });
}
```

---

### 11.6 后台操作常见场景

#### 场景 1: 调整策略价格

**需求**: 将高风险策略价格从 100 PP 调整为 80 PP

**操作步骤**:
1. 进入 Directus → PlayPass Pricing Config
2. 找到 `strategy_high_risk` 规则
3. 修改 `pp_price` 字段: `100` → `80`
4. 点击 Save
5. ✅ 前端实时生效,无需重启服务

---

#### 场景 2: 举办双倍 PP 活动

**需求**: 周末阅读策略获得双倍 PP

**操作步骤**:
1. 进入 Directus → PlayPass Reward Config
2. 找到 `read_strategy` 规则
3. 修改 `reward_multiplier` 字段: `1.0` → `2.0`
4. 设置 `valid_from`: `2025-12-21 00:00:00`
5. 设置 `valid_until`: `2025-12-22 23:59:59`
6. 点击 Save
7. ✅ 活动期间自动生效,结束后自动失效

---

#### 场景 3: 临时关闭某个奖励

**需求**: 暂时关闭分享内容奖励 (防刷)

**操作步骤**:
1. 进入 Directus → PlayPass Reward Config
2. 找到 `share_content` 规则
3. 取消勾选 `is_active`
4. 点击 Save
5. ✅ 用户无法再通过分享获得 PP

---

#### 场景 4: 新增内容类型定价

**需求**: 为新的 "Gossip" 内容设置定价

**操作步骤**:
1. 进入 Directus → PlayPass Pricing Config
2. 点击 "Create Item"
3. 填写:
   - `config_key`: `gossip_default`
   - `config_name`: `八卦内容定价`
   - `content_type`: `gossip`
   - `pp_price`: `5`
   - `is_active`: ✅
4. 点击 Save
5. ✅ 前端查询 Gossip 内容时自动应用此定价

---

### 11.7 配置数据统计面板

在 Directus 后台可以看到实时统计数据：

#### 定价配置统计

| 规则名称 | 内容类型 | 价格 | 解锁次数 | 总收入 PP | 状态 |
|---------|---------|------|---------|----------|------|
| 高风险策略定价 | strategy | 100 PP | 1,234 | 123,400 | ✅ |
| 套利信号定价 | arbitrage | 30 PP | 5,678 | 170,340 | ✅ |
| 新闻免费 | news | 0 PP | 45,678 | 0 | ✅ |

#### 奖励规则统计

| 奖励名称 | 行为类型 | 奖励金额 | 完成次数 | 总发放 PP | 状态 |
|---------|---------|---------|---------|----------|------|
| 每日签到 | daily_signin | 10 PP | 12,345 | 147,678 | ✅ |
| 阅读策略 | read_strategy | 5 PP | 56,789 | 312,456 | ✅ |
| 发布策略 | publish_strategy | 200 PP | 234 | 46,800 | ✅ |

---

## 📚 附录

### A. Telegram 管理员话术模板

**用户咨询**:
```
用户: 你好,我想升级 MAX 会员

管理员回复:
您好!感谢您对 PlayNew.ai 的支持 🎉

MAX 会员特权:
👑 无限 PlayPass
🎁 全站内容永久免费
✨ 金色专属徽章
💼 发布内容 70% 收益分成
🎯 优先客服支持

请提供您的注册邮箱,我会为您开通 MAX 会员资格。
```

**升级完成**:
```
管理员:
已为您开通 MAX 会员! ✅

请刷新页面,即可看到无限 PlayPass 和金色徽章。
祝您在 PlayNew.ai 玩得开心! 🚀
```

### B. 环境变量配置

```bash
# .env.local

# PlayPass 配置
PLAYPASS_INITIAL_BALANCE=200
PLAYPASS_DAILY_SIGNIN_REWARD=10
PLAYPASS_REFERRAL_REWARD=50

# 会员 PP 倍率
MEMBERSHIP_FREE_MULTIPLIER=1.0
MEMBERSHIP_PRO_MULTIPLIER=1.2
MEMBERSHIP_PREMIUM_MULTIPLIER=1.5
MEMBERSHIP_PARTNER_MULTIPLIER=2.0
MEMBERSHIP_MAX_MULTIPLIER=999.99

# 每日获取上限
PP_DAILY_LIMIT_FREE=1000
PP_DAILY_LIMIT_PRO=1500
PP_DAILY_LIMIT_PREMIUM=2500
PP_DAILY_LIMIT_PARTNER=5000
PP_DAILY_LIMIT_MAX=999999

# Telegram 管理员
NEXT_PUBLIC_TELEGRAM_ADMIN_URL=https://t.me/playnew_admin
```

---

## 🎉 总结

PlayPass 积分系统设计完成!

### 核心特点

✅ **PlayPass (PP)** - 简洁易懂的通行证积分
✅ **无支付通道** - 纯免费获取,降低开发成本
✅ **MAX 会员** - Telegram 升级,无限 PP + 全站免费
✅ **5级会员** - Free/Pro/Premium/Partner/MAX
✅ **防刷机制** - 每日上限,行为检测
✅ **游戏化** - 签到奖励,成就系统

### 实施周期

**总计**: 5 周 (约 1.5 个月)
**核心功能**: 3 周可完成 MVP
**完整系统**: 5 周上线

### 预期效果

- 📈 **DAU 提升** 30%+
- 🎯 **用户留存** +25%
- 👑 **MAX 会员转化** 目标 5%+

**开始开发吧!** 🚀

---

**文档版本**: v2.0.0 (简化版)
**最后更新**: 2025-11-16
**作者**: Claude Code (Anthropic)
**项目状态**: 📋 Ready for Development
