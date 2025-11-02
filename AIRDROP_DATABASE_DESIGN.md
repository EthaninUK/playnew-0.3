# 空投任务数据库设计 🗃️

## 📊 核心表：airdrops

### 表结构

```sql
CREATE TABLE airdrops (
  -- 基础信息
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,                    -- 空投标题
  slug VARCHAR(255) UNIQUE NOT NULL,              -- URL 友好标识

  -- 项目信息
  project_name VARCHAR(255) NOT NULL,             -- 项目名称
  project_logo TEXT,                              -- 项目 Logo URL
  project_description TEXT,                       -- 项目描述
  project_website TEXT,                           -- 项目官网
  project_twitter TEXT,                           -- Twitter 账号
  project_discord TEXT,                           -- Discord 链接

  -- 空投详情
  airdrop_type VARCHAR(50),                       -- 类型：retroactive, task-based, snapshot, etc.
  blockchain VARCHAR(100)[],                      -- 支持的链：['Ethereum', 'Arbitrum', 'zkSync']
  total_value VARCHAR(100),                       -- 总价值（美元）
  token_symbol VARCHAR(20),                       -- 代币符号
  token_amount VARCHAR(100),                      -- 代币数量

  -- 任务信息
  tasks JSONB,                                    -- 任务列表（JSON 数组）
  difficulty VARCHAR(20),                         -- 难度：easy, medium, hard
  estimated_time VARCHAR(50),                     -- 预估时间：5分钟、1小时、1周
  requirements TEXT[],                            -- 要求：['钱包地址', '社交媒体账号']

  -- 时间信息
  start_date TIMESTAMP,                           -- 开始时间
  end_date TIMESTAMP,                             -- 结束时间
  distribution_date TIMESTAMP,                    -- 发放时间

  -- 状态
  status VARCHAR(20) DEFAULT 'active',            -- active, ended, distributed, cancelled
  is_verified BOOLEAN DEFAULT false,              -- 是否官方验证
  is_featured BOOLEAN DEFAULT false,              -- 是否精选

  -- 数据来源
  source VARCHAR(100),                            -- 数据源：coinmarketcap, layer3, galxe, etc.
  source_url TEXT,                                -- 原始链接

  -- 质量评分
  quality_score INTEGER DEFAULT 50,               -- 0-100 质量评分
  risk_level VARCHAR(20) DEFAULT 'medium',        -- low, medium, high

  -- 参与统计
  participants_count INTEGER DEFAULT 0,           -- 参与人数
  view_count INTEGER DEFAULT 0,                   -- 浏览次数
  bookmark_count INTEGER DEFAULT 0,               -- 收藏次数

  -- 融资信息
  funding_amount VARCHAR(100),                    -- 融资金额
  backers TEXT[],                                 -- 投资方

  -- SEO
  meta_title VARCHAR(255),
  meta_description TEXT,
  tags VARCHAR(50)[],                             -- 标签：['DeFi', 'NFT', 'GameFi']

  -- 时间戳
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  published_at TIMESTAMP
);

-- 索引
CREATE INDEX idx_airdrops_status ON airdrops(status);
CREATE INDEX idx_airdrops_blockchain ON airdrops USING GIN(blockchain);
CREATE INDEX idx_airdrops_end_date ON airdrops(end_date);
CREATE INDEX idx_airdrops_quality_score ON airdrops(quality_score DESC);
CREATE INDEX idx_airdrops_tags ON airdrops USING GIN(tags);
```

---

## 📋 JSONB 结构：tasks

### 任务列表格式

```json
{
  "tasks": [
    {
      "id": "task-1",
      "title": "连接钱包",
      "description": "使用 MetaMask 或 WalletConnect 连接钱包",
      "type": "wallet_connect",
      "required": true,
      "points": 10,
      "verification": "on-chain",
      "completed": false
    },
    {
      "id": "task-2",
      "title": "关注 Twitter",
      "description": "关注 @ProjectName 并转发置顶推文",
      "type": "social_media",
      "platform": "twitter",
      "action": "follow_and_retweet",
      "target_url": "https://twitter.com/ProjectName",
      "required": true,
      "points": 20,
      "verification": "manual",
      "completed": false
    },
    {
      "id": "task-3",
      "title": "执行 Swap 交易",
      "description": "在 Uniswap 上至少执行 1 次价值 $10 的 Swap",
      "type": "on_chain_action",
      "action": "swap",
      "min_amount": "10",
      "contract_address": "0x...",
      "required": false,
      "points": 50,
      "verification": "on-chain",
      "completed": false
    },
    {
      "id": "task-4",
      "title": "加入 Discord",
      "description": "加入官方 Discord 并获得验证角色",
      "type": "social_media",
      "platform": "discord",
      "action": "join_and_verify",
      "target_url": "https://discord.gg/...",
      "required": false,
      "points": 15,
      "verification": "manual",
      "completed": false
    }
  ]
}
```

### 任务类型 (task.type)

```javascript
const TASK_TYPES = {
  // 钱包相关
  WALLET_CONNECT: 'wallet_connect',
  WALLET_HOLD: 'wallet_hold',        // 持有特定代币

  // 社交媒体
  SOCIAL_MEDIA: 'social_media',      // Twitter, Discord, Telegram

  // 链上操作
  ON_CHAIN_ACTION: 'on_chain_action', // Swap, Stake, Bridge
  TRANSACTION: 'transaction',         // 普通转账
  NFT_MINT: 'nft_mint',              // NFT 铸造

  // 其他
  QUIZ: 'quiz',                      // 问卷/测试
  REFERRAL: 'referral',              // 推荐好友
  SNAPSHOT: 'snapshot',              // 快照（特定时间持仓）
  TESTNET: 'testnet'                 // 测试网交互
};
```

---

## 🔗 关联表

### 1. airdrop_categories (空投分类)

```sql
CREATE TABLE airdrop_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 预设分类
INSERT INTO airdrop_categories (name, slug, icon) VALUES
('DeFi 协议', 'defi', '🏦'),
('Layer 2', 'layer2', '⚡'),
('NFT 平台', 'nft', '🎨'),
('GameFi', 'gamefi', '🎮'),
('基础设施', 'infrastructure', '🔧'),
('DAO 治理', 'dao', '🗳️'),
('跨链桥', 'bridge', '🌉'),
('钱包', 'wallet', '👛');
```

### 2. airdrop_category_relation (多对多关系)

```sql
CREATE TABLE airdrop_category_relation (
  airdrop_id UUID REFERENCES airdrops(id) ON DELETE CASCADE,
  category_id UUID REFERENCES airdrop_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (airdrop_id, category_id)
);
```

### 3. user_airdrop_progress (用户进度)

```sql
CREATE TABLE user_airdrop_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,                    -- 关联到 directus_users
  airdrop_id UUID REFERENCES airdrops(id),

  -- 进度
  tasks_completed JSONB DEFAULT '[]'::jsonb, -- 已完成任务 ID 列表
  total_points INTEGER DEFAULT 0,
  completion_percentage INTEGER DEFAULT 0,   -- 0-100

  -- 状态
  status VARCHAR(20) DEFAULT 'in_progress',  -- in_progress, completed, claimed
  is_bookmarked BOOLEAN DEFAULT false,

  -- 时间
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  claimed_at TIMESTAMP,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_user_progress_user ON user_airdrop_progress(user_id);
CREATE INDEX idx_user_progress_airdrop ON user_airdrop_progress(airdrop_id);
```

---

## 🎯 Directus 集合配置

### airdrops 集合字段

```javascript
{
  "collection": "airdrops",
  "fields": [
    // 基础信息
    { "field": "id", "type": "uuid", "interface": "input", "readonly": true },
    { "field": "title", "type": "string", "interface": "input", "required": true },
    { "field": "slug", "type": "string", "interface": "input", "required": true },

    // 项目信息
    { "field": "project_name", "type": "string", "interface": "input", "required": true },
    { "field": "project_logo", "type": "string", "interface": "file-image" },
    { "field": "project_description", "type": "text", "interface": "textarea" },
    { "field": "project_website", "type": "string", "interface": "input" },
    { "field": "project_twitter", "type": "string", "interface": "input" },
    { "field": "project_discord", "type": "string", "interface": "input" },

    // 空投详情
    { "field": "airdrop_type", "type": "string", "interface": "select-dropdown",
      "options": {
        "choices": [
          { "text": "任务式", "value": "task-based" },
          { "text": "追溯式", "value": "retroactive" },
          { "text": "快照式", "value": "snapshot" },
          { "text": "测试网", "value": "testnet" }
        ]
      }
    },
    { "field": "blockchain", "type": "json", "interface": "select-multiple-checkbox",
      "options": {
        "choices": [
          { "text": "Ethereum", "value": "ethereum" },
          { "text": "Arbitrum", "value": "arbitrum" },
          { "text": "Optimism", "value": "optimism" },
          { "text": "zkSync", "value": "zksync" },
          { "text": "Base", "value": "base" },
          { "text": "Polygon", "value": "polygon" }
        ]
      }
    },
    { "field": "total_value", "type": "string", "interface": "input" },
    { "field": "token_symbol", "type": "string", "interface": "input" },

    // 任务信息
    { "field": "tasks", "type": "json", "interface": "input-code",
      "options": { "language": "json" }
    },
    { "field": "difficulty", "type": "string", "interface": "select-dropdown",
      "options": {
        "choices": [
          { "text": "简单", "value": "easy" },
          { "text": "中等", "value": "medium" },
          { "text": "困难", "value": "hard" }
        ]
      }
    },
    { "field": "estimated_time", "type": "string", "interface": "input" },
    { "field": "requirements", "type": "json", "interface": "tags" },

    // 时间信息
    { "field": "start_date", "type": "timestamp", "interface": "datetime" },
    { "field": "end_date", "type": "timestamp", "interface": "datetime" },
    { "field": "distribution_date", "type": "timestamp", "interface": "datetime" },

    // 状态
    { "field": "status", "type": "string", "interface": "select-dropdown",
      "default": "active",
      "options": {
        "choices": [
          { "text": "进行中", "value": "active" },
          { "text": "已结束", "value": "ended" },
          { "text": "已发放", "value": "distributed" },
          { "text": "已取消", "value": "cancelled" }
        ]
      }
    },
    { "field": "is_verified", "type": "boolean", "interface": "boolean", "default": false },
    { "field": "is_featured", "type": "boolean", "interface": "boolean", "default": false },

    // 数据来源
    { "field": "source", "type": "string", "interface": "input" },
    { "field": "source_url", "type": "string", "interface": "input" },

    // 质量评分
    { "field": "quality_score", "type": "integer", "interface": "slider",
      "options": { "min": 0, "max": 100, "step": 1 }
    },
    { "field": "risk_level", "type": "string", "interface": "select-dropdown",
      "options": {
        "choices": [
          { "text": "低风险", "value": "low" },
          { "text": "中风险", "value": "medium" },
          { "text": "高风险", "value": "high" }
        ]
      }
    },

    // 统计
    { "field": "participants_count", "type": "integer", "interface": "input", "default": 0 },
    { "field": "view_count", "type": "integer", "interface": "input", "default": 0 },

    // 融资信息
    { "field": "funding_amount", "type": "string", "interface": "input" },
    { "field": "backers", "type": "json", "interface": "tags" },

    // SEO
    { "field": "tags", "type": "json", "interface": "tags" },

    // 时间戳
    { "field": "created_at", "type": "timestamp", "interface": "datetime", "readonly": true },
    { "field": "updated_at", "type": "timestamp", "interface": "datetime", "readonly": true },
    { "field": "published_at", "type": "timestamp", "interface": "datetime" }
  ]
}
```

---

## 🚀 快速开始 SQL

### 创建表（在 Directus 数据库中执行）

```sql
-- 1. 创建 airdrops 表（简化版，先不包含所有字段）
CREATE TABLE airdrops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status VARCHAR(20) DEFAULT 'draft',

  -- 基础信息
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  project_name VARCHAR(255) NOT NULL,
  project_logo TEXT,
  project_description TEXT,
  project_website TEXT,

  -- 空投信息
  airdrop_type VARCHAR(50),
  blockchain TEXT[],
  total_value VARCHAR(100),
  token_symbol VARCHAR(20),

  -- 任务
  tasks JSONB,
  difficulty VARCHAR(20),
  estimated_time VARCHAR(50),

  -- 时间
  start_date TIMESTAMP,
  end_date TIMESTAMP,

  -- 数据源
  source VARCHAR(100),
  source_url TEXT,

  -- 质量
  quality_score INTEGER DEFAULT 50,
  risk_level VARCHAR(20) DEFAULT 'medium',

  -- 统计
  view_count INTEGER DEFAULT 0,

  -- 标签
  tags TEXT[],

  -- 时间戳
  date_created TIMESTAMP DEFAULT NOW(),
  date_updated TIMESTAMP DEFAULT NOW()
);

-- 2. 创建索引
CREATE INDEX idx_airdrops_status ON airdrops(status);
CREATE INDEX idx_airdrops_end_date ON airdrops(end_date);
CREATE INDEX idx_airdrops_quality ON airdrops(quality_score DESC);
```

---

## 📝 示例数据

```sql
INSERT INTO airdrops (
  title,
  slug,
  project_name,
  project_description,
  project_website,
  airdrop_type,
  blockchain,
  total_value,
  token_symbol,
  difficulty,
  estimated_time,
  start_date,
  end_date,
  source,
  source_url,
  quality_score,
  risk_level,
  tags,
  tasks,
  status
) VALUES (
  'zkSync Era 生态空投',
  'zksync-era-ecosystem-airdrop',
  'zkSync',
  'zkSync Era 是以太坊的 Layer 2 扩容解决方案，使用 zkRollup 技术提供低成本、高速度的交易。',
  'https://zksync.io',
  'task-based',
  ARRAY['zksync', 'ethereum'],
  '$100M',
  'ZK',
  'medium',
  '2-3 小时',
  '2025-01-01 00:00:00',
  '2025-03-31 23:59:59',
  'official',
  'https://zksync.io/airdrop',
  85,
  'low',
  ARRAY['Layer2', 'zkRollup', 'DeFi'],
  '{"tasks": [
    {
      "id": "task-1",
      "title": "连接钱包",
      "description": "使用 MetaMask 连接到 zkSync Era 主网",
      "type": "wallet_connect",
      "required": true,
      "points": 10
    },
    {
      "id": "task-2",
      "title": "桥接资产",
      "description": "从以太坊主网桥接至少 0.01 ETH 到 zkSync Era",
      "type": "on_chain_action",
      "action": "bridge",
      "min_amount": "0.01",
      "required": true,
      "points": 50
    },
    {
      "id": "task-3",
      "title": "执行 Swap",
      "description": "在 zkSync Era 上至少执行 3 次 Swap 交易",
      "type": "on_chain_action",
      "action": "swap",
      "min_count": 3,
      "required": true,
      "points": 30
    }
  ]}'::jsonb,
  'published'
);
```

---

需要我继续实现数据抓取脚本吗？我建议从 **CoinMarketCap API** 开始！
