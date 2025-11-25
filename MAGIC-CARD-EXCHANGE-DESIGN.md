# 玩法交换魔法卡系统设计方案
## "翻开魔法卡"概念 + 推广裂变机制

---

## 一、核心设计理念

### 1.1 产品定位
**"玩法盲盒" + "推广裂变" 的游戏化交换系统**

```
用户旅程:
注册 → 获得 1 积分 → 翻开魔法卡(3 选 1)→ 解锁玩法
     ↓
想要更多玩法 → 推广好友注册 → 获得积分 → 继续翻卡
     ↓
主动提交玩法需求 → 平台收集需求 → 后续提供
```

### 1.2 核心机制

#### 积分获取(唯一途径)
```
✅ 注册账号: +1 积分(首次)
✅ 推广好友: +1 积分/人(好友完成注册)
❌ 其他途径: 无(保持稀缺性)
```

#### 玩法交换(防刷机制)
```
✅ 第 1 次翻卡: 固定 3 个新手玩法中随机 1 个
✅ 第 2 次及以后: 从完整玩法库中随机抽取

目的:
- 防止用户注册小号刷高级玩法
- 保证新人都能获得基础玩法
- 制造"抽卡"的期待感
```

---

## 二、页面设计方案

### 2.1 页面布局(单页面设计)

```
┌─────────────────────────────────────────────────────────┐
│ [Header]                               [我的积分: 1 💎]  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│              🎴 玩法交换 - 魔法卡系统 🎴                  │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │                                                     │ │
│ │           [魔法卡翻牌区域] - 核心交互                │ │
│ │                                                     │ │
│ │   当前状态: 你有 1 次翻牌机会(1 积分)                │ │
│ │                                                     │ │
│ │   ┌─────────┐  ┌─────────┐  ┌─────────┐           │ │
│ │   │         │  │         │  │         │           │ │
│ │   │   ？    │  │   ？    │  │   ？    │           │ │
│ │   │         │  │         │  │         │           │ │
│ │   │  神秘卡  │  │  神秘卡  │  │  神秘卡  │           │ │
│ │   │         │  │         │  │         │           │ │
│ │   └─────────┘  └─────────┘  └─────────┘           │ │
│ │                                                     │ │
│ │        [点击任意一张卡片开始翻牌]                    │ │
│ │                                                     │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │  💡 提示:                                            │ │
│ │  - 首次翻牌将从 3 个新手玩法中随机获得 1 个          │ │
│ │  - 之后的翻牌将从完整玩法库中随机获得                │ │
│ │  - 想要更多积分?邀请好友注册即可!                    │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ───────────────────────────────────────────────────────│
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │                                                     │ │
│ │  🎁 如何获得更多积分?                                │ │
│ │                                                     │ │
│ │  📢 邀请好友注册,每成功 1 人 = 1 积分               │ │
│ │                                                     │ │
│ │  你的邀请链接:                                       │ │
│ │  ┌─────────────────────────────────────────────┐   │ │
│ │  │ https://playnew.com/ref/abc123              │   │ │
│ │  │ [复制链接] [分享到 Twitter] [分享到 Telegram] │   │ │
│ │  └─────────────────────────────────────────────┘   │ │
│ │                                                     │ │
│ │  已邀请: 3 人 | 待确认: 1 人 | 获得积分: 3 💎        │ │
│ │                                                     │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ───────────────────────────────────────────────────────│
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │                                                     │ │
│ │  📝 想要特定的玩法?告诉我们!                         │ │
│ │                                                     │ │
│ │  我想要的玩法类型: [下拉选择]                        │ │
│ │  □ 空投玩法                                         │ │
│ │  □ DeFi 挖矿                                        │ │
│ │  □ 套利策略                                         │ │
│ │  □ NFT 交易                                         │ │
│ │  □ 其他: [文本框]                                   │ │
│ │                                                     │ │
│ │  具体需求描述:                                       │ │
│ │  ┌─────────────────────────────────────────────┐   │ │
│ │  │ 例如: 求 LayerZero 空投最新攻略...          │   │ │
│ │  │                                             │   │ │
│ │  └─────────────────────────────────────────────┘   │ │
│ │                                                     │ │
│ │  [提交需求] (提交后可获得 0.5 积分奖励)              │ │
│ │                                                     │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ ───────────────────────────────────────────────────────│
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │  📚 我已解锁的玩法 (3 个)                            │ │
│ │                                                     │ │
│ │  ┌────────────────────────────────────────┐        │ │
│ │  │ ✅ LayerZero 空投完全攻略               │        │ │
│ │  │    解锁时间: 2025-01-13                │        │ │
│ │  │    [查看详情]                          │        │ │
│ │  └────────────────────────────────────────┘        │ │
│ │                                                     │ │
│ │  ┌────────────────────────────────────────┐        │ │
│ │  │ ✅ Arbitrum 生态挖矿指南                │        │ │
│ │  │    解锁时间: 2025-01-12                │        │ │
│ │  │    [查看详情]                          │        │ │
│ │  └────────────────────────────────────────┘        │ │
│ │                                                     │ │
│ │  [查看全部 3 个玩法]                                │ │
│ │                                                     │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 三、交互流程设计

### 3.1 首次翻卡流程(新用户)

#### 步骤 1: 用户进入页面
```
显示:
- 当前积分: 1 💎
- 3 张背面朝上的魔法卡(神秘感)
- 提示文字: "点击任意一张卡片开始翻牌"
```

#### 步骤 2: 点击卡片
```
动画效果:
1. 被点击的卡片开始发光(0.3s)
2. 卡片翻转动画(0.5s)
   - 使用 CSS 3D transform: rotateY(180deg)
   - 翻转到一半时,背景变为白色
3. 卡片正面显示玩法信息(渐入效果)

卡片正面显示:
┌─────────────┐
│ 🎁 恭喜获得  │
│             │
│ LayerZero   │
│ 空投完全攻略 │
│             │
│ 价值: 500💎 │
│ 难度: ⭐⭐⭐  │
│             │
│ [查看详情]   │
└─────────────┘
```

#### 步骤 3: 扣除积分,解锁玩法
```
后端操作:
1. 扣除用户 1 积分(1 → 0)
2. 从"新手玩法池"随机抽取 1 个
3. 创建 play_pass 记录
4. 记录交换历史

前端显示:
- 顶部积分数变化动画: 1 → 0
- Toast 提示: "消耗 1 积分,成功解锁 LayerZero 空投攻略"
- 卡片下方出现"查看详情"按钮
```

#### 步骤 4: 其他两张卡片显示
```
未选中的两张卡片也翻开(慢速,0.8s 延迟):
- 显示"未选择"状态(半透明,灰色)
- 显示卡片内容(让用户看到"错过了什么")

目的:
- 制造"选择的紧张感"
- 激发"下次要选对"的心理
```

---

### 3.2 第二次及以后翻卡流程

#### 步骤 1: 获得积分(通过邀请)
```
用户 A 邀请用户 B 注册:
  ↓
用户 B 完成注册
  ↓
系统自动给用户 A +1 积分
  ↓
推送通知: "恭喜!你的好友 [用户 B] 完成注册,你获得 1 积分"
```

#### 步骤 2: 进入翻卡页面
```
显示变化:
- 提示文字变为: "从完整玩法库中随机抽取 1 个"
- 3 张卡片依然是背面朝上
- 卡片背面可能有不同的等级标识(普通/稀有/史诗)
```

#### 步骤 3: 翻卡逻辑
```
后端随机算法:
- 70% 概率: 普通玩法(价值 100-300 积分)
- 25% 概率: 稀有玩法(价值 300-500 积分)
- 5% 概率: 史诗玩法(价值 500-1000 积分)

前端显示:
- 卡片颜色区分:
  - 普通: 蓝色边框
  - 稀有: 紫色边框 + 光效
  - 史诗: 金色边框 + 粒子特效
```

---

### 3.3 视觉动画效果细节

#### 卡片翻转动画(核心)
```css
/* 卡片容器 */
.magic-card {
  width: 200px;
  height: 300px;
  perspective: 1000px;
  cursor: pointer;
  position: relative;
}

/* 卡片内层 */
.card-inner {
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  position: relative;
}

/* 翻转效果 */
.magic-card.flipped .card-inner {
  transform: rotateY(180deg);
}

/* 卡片正面和背面 */
.card-front, .card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
}

/* 背面(初始状态) */
.card-back {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 正面(翻转后) */
.card-front {
  background: white;
  transform: rotateY(180deg);
  padding: 20px;
}

/* 悬停效果 */
.magic-card:hover:not(.flipped) {
  transform: translateY(-10px);
  transition: transform 0.3s;
}

.magic-card:hover:not(.flipped) .card-back {
  box-shadow: 0 12px 24px rgba(102, 126, 234, 0.4);
}
```

#### 翻卡时的粒子效果
```javascript
// 使用 Canvas 或 CSS 动画实现粒子爆炸效果
function createParticles(cardElement) {
  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    cardElement.appendChild(particle);

    // 粒子飞出动画
    setTimeout(() => particle.remove(), 1000);
  }
}
```

#### 稀有度光效
```css
/* 普通卡片 */
.card-rarity-common {
  border: 2px solid #3b82f6;
}

/* 稀有卡片(紫色光晕) */
.card-rarity-rare {
  border: 2px solid #a855f7;
  box-shadow: 0 0 20px rgba(168, 85, 247, 0.6);
  animation: pulse-rare 2s infinite;
}

@keyframes pulse-rare {
  0%, 100% { box-shadow: 0 0 20px rgba(168, 85, 247, 0.6); }
  50% { box-shadow: 0 0 30px rgba(168, 85, 247, 0.9); }
}

/* 史诗卡片(金色光晕 + 旋转光束) */
.card-rarity-epic {
  border: 2px solid #f59e0b;
  box-shadow: 0 0 30px rgba(245, 158, 11, 0.8);
  animation: pulse-epic 1.5s infinite;
  position: relative;
  overflow: hidden;
}

@keyframes pulse-epic {
  0%, 100% { box-shadow: 0 0 30px rgba(245, 158, 11, 0.8); }
  50% { box-shadow: 0 0 50px rgba(245, 158, 11, 1); }
}

/* 史诗卡片的旋转光束背景 */
.card-rarity-epic::before {
  content: '';
  position: absolute;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent 30%,
    rgba(255, 215, 0, 0.3) 50%,
    transparent 70%
  );
  animation: rotate-beam 3s linear infinite;
}

@keyframes rotate-beam {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

---

## 四、数据库设计

### 4.1 新增表结构

```sql
-- 1. 用户积分表(扩展现有 user_credits)
ALTER TABLE user_credits ADD COLUMN IF NOT EXISTS referral_code VARCHAR(20) UNIQUE;
ALTER TABLE user_credits ADD COLUMN IF NOT EXISTS referred_by_user_id UUID;
ALTER TABLE user_credits ADD COLUMN IF NOT EXISTS referral_count INT DEFAULT 0;

COMMENT ON COLUMN user_credits.referral_code IS '用户的邀请码';
COMMENT ON COLUMN user_credits.referred_by_user_id IS '推荐人 ID';
COMMENT ON COLUMN user_credits.referral_count IS '成功推荐的人数';

-- 2. 玩法交换记录表
CREATE TABLE magic_card_exchanges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),

  -- 抽卡信息
  play_id UUID NOT NULL, -- 抽到的玩法
  exchange_type VARCHAR(20) NOT NULL, -- 'first_draw' | 'regular_draw'
  rarity VARCHAR(20), -- 'common' | 'rare' | 'epic'

  -- 卡池信息(记录当时展示的 3 张卡)
  card_pool JSONB, -- [{play_id, title, rarity}, ...]
  selected_index INT, -- 用户选择了第几张卡(0-2)

  -- 积分消耗
  credits_spent INT DEFAULT 1,

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_magic_exchange_user ON magic_card_exchanges(user_id);
CREATE INDEX idx_magic_exchange_created ON magic_card_exchanges(created_at DESC);

-- 3. 玩法需求表
CREATE TABLE play_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),

  -- 需求信息
  category VARCHAR(50), -- 'airdrop' | 'defi' | 'arbitrage' | 'nft' | 'other'
  description TEXT NOT NULL,

  -- 状态
  status VARCHAR(20) DEFAULT 'pending', -- 'pending' | 'fulfilled' | 'rejected'
  fulfilled_play_id UUID, -- 如果需求被满足,对应的玩法 ID

  -- 奖励
  reward_credits INT DEFAULT 0, -- 提交需求获得的积分奖励(如 0.5)

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_play_requests_user ON play_requests(user_id);
CREATE INDEX idx_play_requests_status ON play_requests(status);

-- 4. 新手玩法池配置表
CREATE TABLE starter_play_pool (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  play_id UUID NOT NULL REFERENCES strategies(id),
  is_active BOOLEAN DEFAULT TRUE,
  weight INT DEFAULT 1, -- 权重(用于随机抽取概率)
  order_index INT DEFAULT 0,

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_starter_pool_active ON starter_play_pool(is_active);

COMMENT ON TABLE starter_play_pool IS '新手玩法池(首次抽卡固定从这里抽)';
```

---

### 4.2 初始化数据

```sql
-- 插入 3 个新手玩法到新手池
-- (需要先在 strategies 表中有这些玩法)

-- 假设已有玩法 ID 为 play_1, play_2, play_3
INSERT INTO starter_play_pool (play_id, weight, order_index)
VALUES
  ('play_id_1', 1, 1), -- LayerZero 空投攻略
  ('play_id_2', 1, 2), -- zkSync 测试网任务
  ('play_id_3', 1, 3); -- Arbitrum 生态挖矿
```

---

## 五、API 设计

### 5.1 核心接口

#### 1. GET /api/magic-card/status
获取用户当前状态

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "credits": 1,
      "referral_code": "ABC123",
      "referral_count": 3,
      "total_exchanges": 1,
      "is_first_draw": true
    },
    "cards_available": true,
    "next_draw_type": "first_draw" // or "regular_draw"
  }
}
```

---

#### 2. POST /api/magic-card/draw
执行抽卡

**Request:**
```json
{
  "selected_index": 0 // 用户选择的卡片索引(0-2)
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "exchange_id": "uuid",

    "card_pool": [
      {
        "index": 0,
        "play_id": "uuid-a",
        "title": "LayerZero 空投攻略",
        "category": "airdrop",
        "rarity": "common",
        "value": 500,
        "is_selected": true
      },
      {
        "index": 1,
        "play_id": "uuid-b",
        "title": "zkSync 测试网任务",
        "category": "airdrop",
        "rarity": "common",
        "value": 300,
        "is_selected": false
      },
      {
        "index": 2,
        "play_id": "uuid-c",
        "title": "Arbitrum 挖矿指南",
        "category": "defi",
        "rarity": "rare",
        "value": 800,
        "is_selected": false
      }
    ],

    "selected_play": {
      "play_id": "uuid-a",
      "title": "LayerZero 空投攻略",
      "slug": "layerzero-airdrop-guide",
      "category": "airdrop",
      "rarity": "common",
      "summary": "完整的 LayerZero 空投攻略...",
      "value": 500
    },

    "credits_remaining": 0,
    "message": "恭喜!消耗 1 积分,成功解锁 LayerZero 空投攻略"
  }
}
```

**Error Response (积分不足):**
```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_CREDITS",
    "message": "积分不足,需要 1 积分",
    "current_credits": 0,
    "required_credits": 1,
    "suggestion": "邀请好友注册可获得积分"
  }
}
```

---

#### 3. GET /api/magic-card/my-plays
查看已解锁的玩法

**Response:**
```json
{
  "success": true,
  "data": {
    "total_count": 3,
    "plays": [
      {
        "play_id": "uuid",
        "title": "LayerZero 空投攻略",
        "slug": "layerzero-airdrop-guide",
        "category": "airdrop",
        "rarity": "common",
        "unlocked_at": "2025-01-13T10:30:00Z",
        "exchange_type": "first_draw"
      },
      {
        "play_id": "uuid",
        "title": "Uniswap V4 策略",
        "category": "defi",
        "rarity": "rare",
        "unlocked_at": "2025-01-12T15:20:00Z",
        "exchange_type": "regular_draw"
      }
    ]
  }
}
```

---

#### 4. POST /api/referral/generate-code
生成邀请码(如果用户还没有)

**Response:**
```json
{
  "success": true,
  "data": {
    "referral_code": "ABC123",
    "referral_url": "https://playnew.com/ref/ABC123"
  }
}
```

---

#### 5. GET /api/referral/stats
查看推广统计

**Response:**
```json
{
  "success": true,
  "data": {
    "referral_code": "ABC123",
    "referral_url": "https://playnew.com/ref/ABC123",
    "total_referrals": 5,
    "pending_referrals": 1,
    "confirmed_referrals": 4,
    "earned_credits": 4,
    "referral_list": [
      {
        "user_id": "uuid",
        "username": "user***",
        "status": "confirmed",
        "registered_at": "2025-01-10T12:00:00Z",
        "credits_earned": 1
      }
    ]
  }
}
```

---

#### 6. POST /api/play-request/submit
提交玩法需求

**Request:**
```json
{
  "category": "airdrop",
  "description": "求 LayerZero 最新空投攻略,包括跨链桥交互策略"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "request_id": "uuid",
    "reward_credits": 0.5,
    "current_credits": 0.5,
    "message": "需求已提交,获得 0.5 积分奖励!我们会尽快处理你的需求"
  }
}
```

---

## 六、抽卡算法设计

### 6.1 首次抽卡(新手池)

```javascript
// 后端逻辑
async function drawFirstCard(userId) {
  // 1. 检查是否首次抽卡
  const exchangeCount = await getExchangeCount(userId);
  if (exchangeCount > 0) {
    throw new Error('不是首次抽卡,无法使用新手池');
  }

  // 2. 从新手池中随机获取 3 个玩法
  const starterPlays = await getStarterPlayPool();

  if (starterPlays.length < 3) {
    throw new Error('新手池玩法不足 3 个');
  }

  // 随机打乱顺序
  const shuffled = starterPlays.sort(() => Math.random() - 0.5);
  const cardPool = shuffled.slice(0, 3);

  // 3. 返回卡池
  return cardPool.map((play, index) => ({
    index,
    play_id: play.id,
    title: play.title,
    category: play.category,
    rarity: 'common', // 新手玩法都是普通等级
    value: play.credits_price || 500
  }));
}
```

---

### 6.2 常规抽卡(完整池)

```javascript
// 稀有度权重配置
const RARITY_WEIGHTS = {
  common: 70,  // 70% 概率
  rare: 25,    // 25% 概率
  epic: 5      // 5% 概率
};

// 稀有度对应的玩法筛选条件
const RARITY_CRITERIA = {
  common: { min_value: 0, max_value: 300 },
  rare: { min_value: 300, max_value: 500 },
  epic: { min_value: 500, max_value: 9999 }
};

async function drawRegularCard(userId) {
  // 1. 为 3 张卡分别随机稀有度
  const card1Rarity = getRandomRarity();
  const card2Rarity = getRandomRarity();
  const card3Rarity = getRandomRarity();

  // 2. 根据稀有度从对应池中抽取玩法
  const card1 = await getPlayByRarity(card1Rarity, userId);
  const card2 = await getPlayByRarity(card2Rarity, userId);
  const card3 = await getPlayByRarity(card3Rarity, userId);

  // 3. 确保不重复
  const uniqueCards = ensureUnique([card1, card2, card3]);

  // 4. 返回卡池
  return uniqueCards.map((play, index) => ({
    index,
    play_id: play.id,
    title: play.title,
    category: play.category,
    rarity: play.rarity,
    value: play.credits_price || 500
  }));
}

// 随机稀有度(基于权重)
function getRandomRarity() {
  const rand = Math.random() * 100;

  if (rand < RARITY_WEIGHTS.common) {
    return 'common';
  } else if (rand < RARITY_WEIGHTS.common + RARITY_WEIGHTS.rare) {
    return 'rare';
  } else {
    return 'epic';
  }
}

// 根据稀有度获取玩法(排除用户已拥有的)
async function getPlayByRarity(rarity, userId) {
  const criteria = RARITY_CRITERIA[rarity];

  const plays = await db.query(`
    SELECT s.*
    FROM strategies s
    WHERE s.status = 'published'
      AND s.is_purchasable = TRUE
      AND s.credits_price >= $1
      AND s.credits_price < $2
      AND NOT EXISTS (
        SELECT 1 FROM play_passes pp
        WHERE pp.play_id = s.id
          AND pp.owner_id = $3
          AND pp.status = 'active'
      )
    ORDER BY RANDOM()
    LIMIT 1
  `, [criteria.min_value, criteria.max_value, userId]);

  if (plays.length === 0) {
    // 如果该稀有度池中没有未拥有的玩法,降级到 common
    return await getPlayByRarity('common', userId);
  }

  return {
    ...plays[0],
    rarity
  };
}
```

---

## 七、推广裂变机制

### 7.1 邀请码生成

```javascript
// 生成唯一邀请码
function generateReferralCode(userId) {
  // 方法 1: 基于 user_id 的短码
  const shortId = userId.substring(0, 8).toUpperCase();

  // 方法 2: 随机字符串(更安全)
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 排除易混淆字符
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }

  return code;
}

// 检查邀请码唯一性
async function ensureUniqueReferralCode(code) {
  const existing = await db.query(
    'SELECT 1 FROM user_credits WHERE referral_code = $1',
    [code]
  );

  if (existing.length > 0) {
    // 如果冲突,重新生成
    return ensureUniqueReferralCode(generateReferralCode());
  }

  return code;
}
```

---

### 7.2 注册流程(带邀请码)

```javascript
// 注册时处理邀请码
async function registerUser(email, password, referralCode) {
  // 1. 创建用户账号
  const newUser = await createUser(email, password);

  // 2. 初始化积分(注册送 1 积分)
  await db.query(`
    INSERT INTO user_credits (user_id, balance, referred_by_user_id)
    VALUES ($1, 1, $2)
  `, [newUser.id, null]);

  // 3. 如果有邀请码,处理推荐人奖励
  if (referralCode) {
    const referrer = await db.query(
      'SELECT user_id FROM user_credits WHERE referral_code = $1',
      [referralCode]
    );

    if (referrer.length > 0) {
      const referrerId = referrer[0].user_id;

      // 给推荐人 +1 积分
      await db.query(`
        UPDATE user_credits
        SET balance = balance + 1,
            referral_count = referral_count + 1
        WHERE user_id = $1
      `, [referrerId]);

      // 记录积分交易
      await recordCreditTransaction({
        user_id: referrerId,
        credits_change: 1,
        transaction_type: 'referral_reward',
        description: `推荐用户 ${email} 注册`,
        related_id: newUser.id,
        related_type: 'user'
      });

      // 更新新用户的推荐人
      await db.query(`
        UPDATE user_credits
        SET referred_by_user_id = $1
        WHERE user_id = $2
      `, [referrerId, newUser.id]);

      // 发送通知给推荐人
      await sendNotification(referrerId, {
        type: 'referral_success',
        message: `恭喜!你的好友 ${email} 完成注册,你获得 1 积分`
      });
    }
  }

  return newUser;
}
```

---

## 八、前端组件设计

### 8.1 核心组件结构

```typescript
// components/magic-card/MagicCardExchange.tsx

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Card {
  index: number;
  play_id: string;
  title: string;
  category: string;
  rarity: 'common' | 'rare' | 'epic';
  value: number;
  is_selected?: boolean;
}

export function MagicCardExchange() {
  const [credits, setCredits] = useState(1);
  const [cardPool, setCardPool] = useState<Card[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flippedCards, setFlippedCards] = useState<boolean[]>([false, false, false]);

  // 处理卡片点击
  const handleCardClick = async (index: number) => {
    if (isFlipping || credits < 1) return;

    setIsFlipping(true);
    setSelectedIndex(index);

    try {
      // 调用抽卡 API
      const response = await fetch('/api/magic-card/draw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selected_index: index })
      });

      const data = await response.json();

      if (data.success) {
        setCardPool(data.data.card_pool);
        setCredits(data.data.credits_remaining);

        // 延迟翻开所选卡片
        setTimeout(() => {
          const newFlipped = [false, false, false];
          newFlipped[index] = true;
          setFlippedCards(newFlipped);

          // 再延迟翻开其他卡片
          setTimeout(() => {
            setFlippedCards([true, true, true]);
          }, 800);
        }, 300);

        // 显示成功消息
        toast.success(data.data.message);
      }
    } catch (error) {
      toast.error('抽卡失败,请重试');
    } finally {
      setIsFlipping(false);
    }
  };

  return (
    <div className="magic-card-exchange">
      {/* 顶部积分显示 */}
      <div className="credits-display">
        我的积分: <span className="credits-count">{credits}</span> 💎
      </div>

      {/* 卡片区域 */}
      <div className="cards-container">
        {[0, 1, 2].map((index) => (
          <MagicCard
            key={index}
            index={index}
            card={cardPool[index]}
            isFlipped={flippedCards[index]}
            isSelected={selectedIndex === index}
            onClick={() => handleCardClick(index)}
            disabled={isFlipping || credits < 1}
          />
        ))}
      </div>

      {/* 邀请区域 */}
      <ReferralSection />

      {/* 需求提交区域 */}
      <PlayRequestSection />

      {/* 已解锁玩法列表 */}
      <UnlockedPlaysList />
    </div>
  );
}
```

---

### 8.2 单个魔法卡组件

```typescript
// components/magic-card/MagicCard.tsx

import { motion } from 'framer-motion';
import clsx from 'clsx';

interface MagicCardProps {
  index: number;
  card?: Card;
  isFlipped: boolean;
  isSelected: boolean;
  onClick: () => void;
  disabled: boolean;
}

export function MagicCard({
  index,
  card,
  isFlipped,
  isSelected,
  onClick,
  disabled
}: MagicCardProps) {
  return (
    <motion.div
      className={clsx('magic-card', {
        'flipped': isFlipped,
        'selected': isSelected,
        'disabled': disabled
      })}
      whileHover={!disabled && !isFlipped ? { y: -10 } : {}}
      onClick={onClick}
    >
      <motion.div
        className="card-inner"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* 卡片背面 */}
        <div className="card-back">
          <div className="card-back-pattern">
            <div className="mystery-symbol">?</div>
            <div className="card-text">神秘卡</div>
          </div>
        </div>

        {/* 卡片正面 */}
        <div className={clsx('card-front', `rarity-${card?.rarity}`)}>
          {card && (
            <>
              <div className="card-header">
                <span className="rarity-badge">{getRarityLabel(card.rarity)}</span>
              </div>

              <div className="card-content">
                <h3 className="card-title">{card.title}</h3>
                <div className="card-category">{getCategoryLabel(card.category)}</div>
                <div className="card-value">价值: {card.value} 💎</div>
              </div>

              {isSelected && (
                <div className="card-footer">
                  <motion.button
                    className="btn-view-details"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                  >
                    查看详情
                  </motion.button>
                </div>
              )}

              {!isSelected && isFlipped && (
                <div className="card-overlay">
                  <span className="not-selected-label">未选择</span>
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>

      {/* 粒子效果(翻卡时) */}
      {isFlipped && isSelected && <ParticleEffect />}
    </motion.div>
  );
}

function getRarityLabel(rarity: string) {
  const labels = {
    common: '普通',
    rare: '稀有',
    epic: '史诗'
  };
  return labels[rarity] || '未知';
}

function getCategoryLabel(category: string) {
  const labels = {
    airdrop: '空投',
    defi: 'DeFi',
    arbitrage: '套利',
    nft: 'NFT'
  };
  return labels[category] || category;
}
```

---

## 九、实施计划

### 第 1 步: 数据库准备(1 天)
- [ ] 执行数据库迁移脚本
- [ ] 在 strategies 表中标记 3 个新手玩法
- [ ] 插入到 starter_play_pool 表
- [ ] 为现有用户生成邀请码

### 第 2 步: 后端 API 开发(2 天)
- [ ] 实现 6 个核心 API 接口
- [ ] 实现抽卡算法(首次 + 常规)
- [ ] 实现邀请码逻辑
- [ ] 编写单元测试

### 第 3 步: 前端组件开发(3 天)
- [ ] 实现 MagicCard 组件(含翻转动画)
- [ ] 实现 MagicCardExchange 主页面
- [ ] 实现 ReferralSection(邀请区域)
- [ ] 实现 PlayRequestSection(需求提交)
- [ ] 实现 UnlockedPlaysList(已解锁列表)

### 第 4 步: 视觉效果优化(1 天)
- [ ] 卡片翻转动画优化
- [ ] 粒子效果实现
- [ ] 稀有度光效实现
- [ ] 响应式设计

### 第 5 步: 测试与上线(1 天)
- [ ] 完整流程测试
- [ ] 邀请码测试
- [ ] 抽卡概率测试
- [ ] 部署到生产环境

**总计**: 8 天

---

## 十、关键优势

### 10.1 解决冷启动问题
```
✅ 新用户注册即可体验(1 积分免费)
✅ 推广机制自带裂变属性(邀请好友获积分)
✅ 防刷机制(首次固定 3 选 1,防止小号刷高级玩法)
```

### 10.2 游戏化体验
```
✅ "开盲盒"的期待感(不知道会抽到什么)
✅ "稀有度"的收集欲(想抽到史诗卡)
✅ "选择的紧张感"(3 选 1,怕选错)
```

### 10.3 数据驱动优化
```
✅ 记录所有抽卡数据(哪些玩法最受欢迎)
✅ 记录用户需求(知道用户想要什么)
✅ 推广数据可追踪(哪些用户带来了新用户)
```

---

## 总结

这个设计方案:
1. ✅ **简单易懂**:用户一看就明白怎么玩
2. ✅ **自带裂变**:推广机制天然带流量
3. ✅ **防刷机制**:首次固定池,防止薅羊毛
4. ✅ **视觉吸引**:魔法卡翻转,游戏化体验
5. ✅ **数据闭环**:收集用户需求,优化内容

**下一步**:
- 我帮你开始数据库开发?
- 还是先做个前端原型让你看看效果?
- 或者你还想调整哪些细节?

你觉得怎么样?🚀