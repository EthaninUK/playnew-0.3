# 币圈玩法收集录 - 完整开发文档手册

## 目录

1. [项目架构](#1-项目架构)
2. [技术栈详解](#2-技术栈详解)
3. [数据库设计](#3-数据库设计)
4. [Directus 配置](#4-directus-配置)
5. [Supabase 配置](#5-supabase-配置)
6. [Meilisearch 搜索](#6-meilisearch-搜索)
7. [Next.js 前端开发](#7-nextjs-前端开发)
8. [n8n 数据抓取](#8-n8n-数据抓取)
9. [AI 内容处理](#9-ai-内容处理)
10. [第三方集成](#10-第三方集成)
11. [部署指南](#11-部署指南)
12. [最佳实践](#12-最佳实践)

---

## 1. 项目架构

### 1.1 系统架构图

```
┌─────────────────────────────────────────────────────────────┐
│                         用户层                               │
│  Web App (Next.js) │ Mobile App (React Native - 未来)      │
└────────────────┬────────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────────┐
│                      API 层                                  │
│  Next.js API Routes │ Directus REST/GraphQL API             │
└────────┬──────────┬──────────────┬──────────────────────────┘
         │          │              │
┌────────▼─────┐ ┌──▼──────────┐ ┌▼──────────────┐
│   Supabase   │ │  Directus   │ │ Meilisearch   │
│  (主数据库)   │ │  (CMS管理)   │ │   (搜索引擎)   │
│  + Realtime  │ │             │ │               │
│  + Auth      │ │             │ │               │
└──────────────┘ └─────────────┘ └───────────────┘
         │              │
┌────────▼──────────────▼─────────────────────────────────────┐
│                    数据处理层                                │
│  n8n (数据抓取) → AI APIs (优化/翻译) → 人工审核             │
└─────────────────────────────────────────────────────────────┘
         │
┌────────▼────────────────────────────────────────────────────┐
│                  外部服务层                                  │
│  Giscus │ Plausible │ Resend │ 币圈数据源                   │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 数据流程

#### 用户生成内容流程
```
用户提交 → Next.js API → Supabase (待审核) →
人工审核 → Directus 发布 → Meilisearch 索引 → 前端展示
```

#### 自动抓取内容流程
```
n8n 定时抓取 → 数据清洗 → AI 处理 (翻译/优化) →
Directus (待审核) → 人工审核 → Supabase 发布 →
Meilisearch 索引 → 实时推送到前端
```

---

## 2. 技术栈详解

### 2.1 后端技术栈

| 技术 | 用途 | 选择理由 |
|------|------|----------|
| **Supabase** | 主数据库 + 实时功能 + 认证 | PostgreSQL + 实时订阅 + 开箱即用的认证 |
| **Directus** | Headless CMS + 管理界面 | 强大的管理界面、权限系统、自定义扩展 |
| **Meilisearch** | 全文搜索引擎 | 快速、支持中文分词、易于集成 |
| **n8n** | 工作流自动化 | 可视化编排、丰富的集成选项 |

### 2.2 前端技术栈

| 技术 | 用途 | 版本 |
|------|------|------|
| **Next.js** | React 框架 | 14+ (App Router) |
| **shadcn/ui** | UI 组件库 | 基于 Radix UI |
| **Tailwind CSS** | 样式框架 | 3+ |
| **Lucide React** | 图标库 | Latest |
| **Framer Motion** | 动画库 | Latest |
| **React Hook Form** | 表单处理 | 7+ |
| **Zod** | 数据验证 | 3+ |
| **Zustand** | 状态管理 | 4+ |
| **Recharts** | 图表库 | 2+ |

### 2.3 AI 服务提供商

```typescript
// 支持多个 AI 提供商（按优先级）
const AI_PROVIDERS = {
  openai: {
    endpoint: 'https://api.openai.com/v1/chat/completions',
    models: ['gpt-4-turbo', 'gpt-3.5-turbo']
  },
  anthropic: {
    endpoint: 'https://api.anthropic.com/v1/messages',
    models: ['claude-3-opus', 'claude-3-sonnet']
  },
  deepseek: {
    endpoint: 'https://api.deepseek.com/v1/chat/completions',
    models: ['deepseek-chat']
  }
}
```

---

## 3. 数据库设计

### 3.1 核心数据表

#### 3.1.1 玩法库 (plays)

```sql
CREATE TABLE plays (
  -- 基础字段
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,

  -- 分类和标签
  category TEXT NOT NULL, -- 空投、挖矿、交易、DeFi等
  subcategory TEXT,
  tags TEXT[] DEFAULT '{}',

  -- 难度和收益
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  estimated_profit TEXT, -- 预估收益
  time_commitment TEXT, -- 时间投入

  -- 内容
  content JSONB, -- 富文本内容（步骤、教程等）
  requirements JSONB, -- 前置要求（资金、工具等）
  risks JSONB, -- 风险提示

  -- 相关链接
  related_links JSONB,
  official_website TEXT,

  -- 状态和审核
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'published', 'archived')),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,

  -- 统计数据
  views INT DEFAULT 0,
  likes INT DEFAULT 0,
  favorites INT DEFAULT 0,
  shares INT DEFAULT 0,

  -- 元数据
  author_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,

  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  og_image TEXT
);

-- 索引
CREATE INDEX idx_plays_category ON plays(category);
CREATE INDEX idx_plays_status ON plays(status);
CREATE INDEX idx_plays_published_at ON plays(published_at DESC);
CREATE INDEX idx_plays_tags ON plays USING GIN(tags);

-- 全文搜索
CREATE INDEX idx_plays_search ON plays USING GIN(
  to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(description, ''))
);

-- 自动更新时间戳
CREATE TRIGGER update_plays_updated_at
  BEFORE UPDATE ON plays
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

#### 3.1.2 资讯雷达 (news)

```sql
CREATE TABLE news (
  -- 基础字段
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  summary TEXT,
  content TEXT,

  -- 来源信息
  source TEXT, -- 数据源（Twitter、Medium、官方公告等）
  source_url TEXT,
  author TEXT,
  original_language TEXT DEFAULT 'en',

  -- 分类
  category TEXT NOT NULL, -- 市场动态、项目更新、监管政策等
  tags TEXT[] DEFAULT '{}',
  priority INT DEFAULT 0, -- 优先级（用于排序）

  -- AI 处理标记
  ai_processed BOOLEAN DEFAULT false,
  ai_summary TEXT, -- AI 生成的摘要
  ai_translation JSONB, -- 多语言翻译 {"zh": "...", "en": "..."}

  -- 审核状态
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'published')),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,

  -- 时间
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- 统计
  views INT DEFAULT 0,
  sentiment TEXT, -- 情感分析（positive、negative、neutral）

  -- 元数据
  metadata JSONB -- 存储额外信息（如价格变动、市值等）
);

CREATE INDEX idx_news_category ON news(category);
CREATE INDEX idx_news_status ON news(status);
CREATE INDEX idx_news_published_at ON news(published_at DESC);
CREATE INDEX idx_news_priority ON news(priority DESC, published_at DESC);
```

<!-- 暂不开发服务商功能
#### 3.1.3 服务商 (service_providers)

```sql
-- CREATE TABLE service_providers (
--   -- 基础信息
--   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
--   name TEXT NOT NULL,
--   slug TEXT UNIQUE NOT NULL,
--   description TEXT,
--   logo_url TEXT,
--
--   -- 分类
--   category TEXT NOT NULL, -- 交易所、钱包、工具、审计公司等
--   subcategory TEXT,
--   tags TEXT[] DEFAULT '{}',
--
--   -- 联系方式
--   website TEXT,
--   twitter TEXT,
--   telegram TEXT,
--   discord TEXT,
--   email TEXT,
--
--   -- 详细信息
--   features JSONB, -- 特性列表
--   supported_chains JSONB, -- 支持的区块链
--   fees JSONB, -- 费用信息
--
--   -- 评级
--   rating NUMERIC(3,2) CHECK (rating >= 0 AND rating <= 5),
--   review_count INT DEFAULT 0,
--   trust_score INT, -- 信任分数（自定义算法）
--
--   -- 安全信息
--   security_audits JSONB, -- 审计报告
--   incidents JSONB, -- 安全事件记录
--
--   -- 状态
--   status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'flagged')),
--   verified BOOLEAN DEFAULT false,
--
--   -- 时间
--   created_at TIMESTAMPTZ DEFAULT NOW(),
--   updated_at TIMESTAMPTZ DEFAULT NOW()
-- );
--
-- CREATE INDEX idx_providers_category ON service_providers(category);
-- CREATE INDEX idx_providers_rating ON service_providers(rating DESC);
```
-->

#### 3.1.4 用户交互 (user_interactions)

```sql
CREATE TABLE user_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,

  -- 交互对象
  content_type TEXT NOT NULL, -- 'play', 'news', 'provider'
  content_id UUID NOT NULL,

  -- 交互类型
  action TEXT NOT NULL CHECK (action IN ('like', 'favorite', 'follow', 'share', 'view')),

  -- 元数据
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- 确保每个用户对同一内容的同一操作只能执行一次
  UNIQUE(user_id, content_type, content_id, action)
);

CREATE INDEX idx_interactions_user ON user_interactions(user_id, created_at DESC);
CREATE INDEX idx_interactions_content ON user_interactions(content_type, content_id);
```

#### 3.1.5 用户资料 (user_profiles)

```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,

  -- 社交链接
  twitter TEXT,
  telegram TEXT,
  website TEXT,

  -- 用户等级
  level INT DEFAULT 1,
  experience_points INT DEFAULT 0,

  -- 统计
  total_contributions INT DEFAULT 0,
  reputation_score INT DEFAULT 0,

  -- 偏好设置
  preferences JSONB DEFAULT '{}', -- 语言、主题、通知设置等

  -- 时间
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 3.1.6 评论 (comments)

```sql
-- 如果不使用 Giscus，可以自建评论系统
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,

  -- 关联内容
  content_type TEXT NOT NULL,
  content_id UUID NOT NULL,

  -- 评论内容
  text TEXT NOT NULL,
  parent_id UUID REFERENCES comments(id), -- 支持嵌套评论

  -- 状态
  status TEXT DEFAULT 'published' CHECK (status IN ('published', 'hidden', 'deleted')),

  -- 统计
  likes INT DEFAULT 0,

  -- 时间
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_comments_content ON comments(content_type, content_id, created_at DESC);
CREATE INDEX idx_comments_user ON comments(user_id);
```

### 3.2 视图和函数

#### 3.2.1 热门玩法视图

```sql
CREATE VIEW popular_plays AS
SELECT
  p.*,
  (p.views * 0.3 + p.likes * 2 + p.favorites * 3 + p.shares * 5) AS popularity_score,
  COUNT(DISTINCT c.id) AS comment_count
FROM plays p
LEFT JOIN comments c ON c.content_type = 'play' AND c.content_id = p.id
WHERE p.status = 'published'
GROUP BY p.id
ORDER BY popularity_score DESC;
```

#### 3.2.2 用户统计函数

```sql
CREATE OR REPLACE FUNCTION get_user_stats(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_likes', (SELECT COUNT(*) FROM user_interactions WHERE user_id = user_uuid AND action = 'like'),
    'total_favorites', (SELECT COUNT(*) FROM user_interactions WHERE user_id = user_uuid AND action = 'favorite'),
    'total_contributions', (SELECT total_contributions FROM user_profiles WHERE id = user_uuid),
    'level', (SELECT level FROM user_profiles WHERE id = user_uuid)
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql;
```

### 3.3 Row Level Security (RLS)

```sql
-- 启用 RLS
ALTER TABLE plays ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interactions ENABLE ROW LEVEL SECURITY;

-- 玩法库策略
CREATE POLICY "公开内容任何人可查看"
  ON plays FOR SELECT
  USING (status = 'published');

CREATE POLICY "用户可以查看自己的草稿"
  ON plays FOR SELECT
  USING (auth.uid() = author_id);

CREATE POLICY "认证用户可以创建玩法"
  ON plays FOR INSERT
  WITH CHECK (auth.uid() = author_id);

-- 用户交互策略
CREATE POLICY "用户只能管理自己的交互"
  ON user_interactions FOR ALL
  USING (auth.uid() = user_id);
```

---

## 4. Directus 配置

### 4.1 安装和初始化

#### 4.1.1 使用 Docker Compose

创建 `docker-compose.directus.yml`:

```yaml
version: '3'

services:
  directus:
    image: directus/directus:10.10.0
    ports:
      - 8055:8055
    volumes:
      - ./directus/uploads:/directus/uploads
      - ./directus/extensions:/directus/extensions
    environment:
      # 密钥（生成随机字符串）
      KEY: '替换为随机生成的32字符密钥'
      SECRET: '替换为随机生成的32字符密钥'

      # 管理员账号
      ADMIN_EMAIL: 'admin@cryptoplayhub.com'
      ADMIN_PASSWORD: '替换为强密码'

      # 数据库连接（使用 Supabase）
      DB_CLIENT: 'pg'
      DB_HOST: 'db.xxxxxx.supabase.co'
      DB_PORT: '5432'
      DB_DATABASE: 'postgres'
      DB_USER: 'postgres'
      DB_PASSWORD: '你的Supabase密码'
      DB_SSL: 'true'

      # 公共 URL
      PUBLIC_URL: 'http://localhost:8055'

      # 文件存储（可选：使用 Supabase Storage）
      STORAGE_LOCATIONS: 'supabase'
      STORAGE_SUPABASE_DRIVER: 'supabase'
      STORAGE_SUPABASE_PROJECT_ID: '你的项目ID'
      STORAGE_SUPABASE_KEY: '你的服务密钥'
      STORAGE_SUPABASE_BUCKET: 'directus-files'

      # CORS
      CORS_ENABLED: 'true'
      CORS_ORIGIN: 'true'

      # 缓存
      CACHE_ENABLED: 'true'
      CACHE_STORE: 'redis'
      REDIS: 'redis://redis:6379'

      # 邮件（使用 Resend）
      EMAIL_FROM: 'noreply@cryptoplayhub.com'
      EMAIL_TRANSPORT: 'smtp'
      EMAIL_SMTP_HOST: 'smtp.resend.com'
      EMAIL_SMTP_PORT: '587'
      EMAIL_SMTP_USER: 'resend'
      EMAIL_SMTP_PASSWORD: '你的Resend API密钥'

  redis:
    image: redis:7-alpine
    ports:
      - 6379:6379
```

启动:
```bash
docker-compose -f docker-compose.directus.yml up -d
```

### 4.2 数据模型配置

登录 Directus 管理界面 (http://localhost:8055)，配置数据集合:

#### 4.2.1 配置 plays 集合

在 Directus 中映射 Supabase 的 `plays` 表:

1. **Settings → Data Model → 导入现有表**
2. 选择 `plays` 表
3. 配置字段类型和界面:

```json
{
  "title": {
    "interface": "input",
    "required": true
  },
  "category": {
    "interface": "select-dropdown",
    "options": {
      "choices": [
        { "text": "空投", "value": "airdrop" },
        { "text": "挖矿", "value": "mining" },
        { "text": "DeFi", "value": "defi" },
        { "text": "交易策略", "value": "trading" },
        { "text": "NFT", "value": "nft" }
      ]
    }
  },
  "difficulty": {
    "interface": "select-dropdown",
    "options": {
      "choices": [
        { "text": "初级", "value": "beginner" },
        { "text": "中级", "value": "intermediate" },
        { "text": "高级", "value": "advanced" }
      ]
    }
  },
  "content": {
    "interface": "input-rich-text-md",
    "options": {
      "toolbar": ["bold", "italic", "code", "link", "heading", "image"]
    }
  },
  "tags": {
    "interface": "tags",
    "options": {
      "alphabetize": true,
      "allowCustom": true
    }
  },
  "status": {
    "interface": "select-dropdown",
    "options": {
      "choices": [
        { "text": "草稿", "value": "draft" },
        { "text": "待审核", "value": "pending" },
        { "text": "已发布", "value": "published" },
        { "text": "已归档", "value": "archived" }
      ]
    }
  }
}
```

### 4.3 自定义 Hooks

创建 `directus/extensions/hooks/sync-to-meilisearch/index.js`:

```javascript
export default ({ filter, action }) => {
  // 当玩法发布时，同步到 Meilisearch
  filter('plays.items.create', async (input, { database, schema }) => {
    return input;
  });

  action('plays.items.update', async ({ payload, key }, { database, schema }) => {
    if (payload.status === 'published') {
      // 同步到 Meilisearch
      const MeiliSearch = require('meilisearch');
      const client = new MeiliSearch({
        host: process.env.MEILISEARCH_HOST,
        apiKey: process.env.MEILISEARCH_API_KEY
      });

      const index = client.index('plays');
      await index.addDocuments([{
        id: key,
        ...payload
      }]);
    }
  });

  // 删除时从搜索引擎移除
  action('plays.items.delete', async ({ payload }, { database, schema }) => {
    const MeiliSearch = require('meilisearch');
    const client = new MeiliSearch({
      host: process.env.MEILISEARCH_HOST,
      apiKey: process.env.MEILISEARCH_API_KEY
    });

    const index = client.index('plays');
    await index.deleteDocument(payload);
  });
};
```

### 4.4 自定义 API 端点

创建 `directus/extensions/endpoints/ai-process/index.js`:

```javascript
export default (router, { services, exceptions }) => {
  const { ItemsService } = services;
  const { ServiceUnavailableException } = exceptions;

  // AI 优化内容端点
  router.post('/optimize', async (req, res) => {
    const { content, type } = req.body;

    try {
      // 调用 OpenAI API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4-turbo',
          messages: [
            {
              role: 'system',
              content: '你是一个币圈内容优化专家。请优化以下内容，使其更专业、准确、易懂。'
            },
            { role: 'user', content }
          ]
        })
      });

      const data = await response.json();
      res.json({ optimized: data.choices[0].message.content });
    } catch (error) {
      throw new ServiceUnavailableException('AI 服务暂时不可用');
    }
  });

  // 批量翻译端点
  router.post('/translate', async (req, res) => {
    const { texts, targetLang } = req.body;

    // 批量翻译逻辑
    const translations = await Promise.all(
      texts.map(text => translateText(text, targetLang))
    );

    res.json({ translations });
  });
};

async function translateText(text, targetLang) {
  // 使用 AI 翻译
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `你是一个专业的币圈术语翻译专家。将以下内容翻译成${targetLang}，保持专业术语的准确性。`
        },
        { role: 'user', content: text }
      ]
    })
  });

  const data = await response.json();
  return data.choices[0].message.content;
}
```

### 4.5 权限配置

设置角色和权限:

```
角色设置:
├── 管理员 (Administrator)
│   └── 所有权限
├── 编辑 (Editor)
│   ├── plays: 创建、读取、更新
│   ├── news: 创建、读取、更新
│   └── service_providers: 读取、更新
├── 审核员 (Moderator)
│   ├── plays: 读取、更新（仅 status 字段）
│   └── news: 读取、更新（仅 status 字段）
└── 公开 (Public)
    ├── plays: 读取（status = 'published'）
    ├── news: 读取（status = 'published'）
    └── service_providers: 读取
```

---

## 5. Supabase 配置

### 5.1 项目创建

1. 访问 https://supabase.com
2. 创建新项目
3. 选择区域（建议选择离用户最近的区域）
4. 记录以下信息:
   - Project URL: `https://xxxxxx.supabase.co`
   - anon key: `eyJhbG...`
   - service_role key: `eyJhbG...` (保密!)

### 5.2 认证配置

#### 5.2.1 启用认证提供商

在 **Authentication → Providers** 中启用:
- Email (默认)
- Google OAuth
- Twitter OAuth (可选)
- Wallet Connect (Web3 钱包登录 - 可选)

#### 5.2.2 配置邮件模板

在 **Authentication → Email Templates** 中自定义:

```html
<!-- 确认邮件模板 -->
<h2>欢迎来到币圈玩法收集录!</h2>
<p>点击下面的链接确认您的邮箱:</p>
<p><a href="{{ .ConfirmationURL }}">确认邮箱</a></p>
```

#### 5.2.3 设置 JWT 密钥

```sql
-- 在 SQL 编辑器中执行
ALTER DATABASE postgres SET "app.jwt_secret" TO '你的JWT密钥';
```

### 5.3 Realtime 配置

启用实时订阅:

```sql
-- 为需要实时更新的表启用 Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE plays;
ALTER PUBLICATION supabase_realtime ADD TABLE news;
ALTER PUBLICATION supabase_realtime ADD TABLE user_interactions;

-- 配置 Realtime 策略
CREATE POLICY "允许已认证用户订阅玩法更新"
  ON plays FOR SELECT
  TO authenticated
  USING (status = 'published');
```

### 5.4 Storage 配置

创建存储桶:

```sql
-- 创建公开的图片存储桶
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true);

-- 创建私有的文档存储桶
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false);

-- 设置存储策略
CREATE POLICY "任何人可以查看公开图片"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'images');

CREATE POLICY "认证用户可以上传图片"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'images'
    AND auth.role() = 'authenticated'
  );
```

### 5.5 Edge Functions (可选)

创建边缘函数处理复杂逻辑:

```bash
# 安装 Supabase CLI
npm install -g supabase

# 登录
supabase login

# 创建函数
supabase functions new process-news

# 编辑 supabase/functions/process-news/index.ts
```

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { newsId } = await req.json()

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  // 获取新闻
  const { data: news } = await supabase
    .from('news')
    .select('*')
    .eq('id', newsId)
    .single()

  // AI 处理
  const processed = await processWithAI(news.content)

  // 更新
  await supabase
    .from('news')
    .update({ ai_summary: processed })
    .eq('id', newsId)

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

部署:
```bash
supabase functions deploy process-news
```

---

## 6. Meilisearch 搜索

### 6.1 安装和配置

#### 6.1.1 使用 Docker

```bash
docker run -d \
  --name meilisearch \
  -p 7700:7700 \
  -e MEILI_MASTER_KEY='your-master-key-min-16-chars' \
  -e MEILI_ENV='production' \
  -v $(pwd)/meili_data:/meili_data \
  getmeili/meilisearch:v1.6
```

#### 6.1.2 使用 Meilisearch Cloud

访问 https://www.meilisearch.com/cloud 创建实例

### 6.2 创建索引

```bash
# 创建索引脚本 scripts/setup-meilisearch.js
```

```javascript
const { MeiliSearch } = require('meilisearch')

const client = new MeiliSearch({
  host: 'http://localhost:7700',
  apiKey: 'your-master-key'
})

async function setupIndexes() {
  // 创建 plays 索引
  const playsIndex = await client.createIndex('plays', {
    primaryKey: 'id'
  })

  // 配置可搜索字段
  await playsIndex.updateSearchableAttributes([
    'title',
    'description',
    'content',
    'tags',
    'category'
  ])

  // 配置可过滤字段
  await playsIndex.updateFilterableAttributes([
    'category',
    'difficulty',
    'status',
    'tags'
  ])

  // 配置排序字段
  await playsIndex.updateSortableAttributes([
    'created_at',
    'views',
    'likes',
    'published_at'
  ])

  // 配置分面搜索
  await playsIndex.updateFaceting({
    maxValuesPerFacet: 100
  })

  // 配置分词器（支持中文）
  await playsIndex.updateSettings({
    rankingRules: [
      'words',
      'typo',
      'proximity',
      'attribute',
      'sort',
      'exactness'
    ],
    stopWords: ['的', '了', '是', '在', '和'],
    synonyms: {
      '空投': ['airdrop'],
      '挖矿': ['mining'],
      'defi': ['去中心化金融']
    }
  })

  // 创建 news 索引
  const newsIndex = await client.createIndex('news', {
    primaryKey: 'id'
  })

  await newsIndex.updateSearchableAttributes([
    'title',
    'summary',
    'content',
    'tags'
  ])

  await newsIndex.updateFilterableAttributes([
    'category',
    'status',
    'published_at',
    'sentiment'
  ])

  await newsIndex.updateSortableAttributes([
    'published_at',
    'priority',
    'views'
  ])

  console.log('Meilisearch 索引设置完成!')
}

setupIndexes()
```

运行:
```bash
node scripts/setup-meilisearch.js
```

### 6.3 数据同步

创建同步脚本 `scripts/sync-to-meilisearch.js`:

```javascript
const { createClient } = require('@supabase/supabase-js')
const { MeiliSearch } = require('meilisearch')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const meili = new MeiliSearch({
  host: process.env.MEILISEARCH_HOST,
  apiKey: process.env.MEILISEARCH_API_KEY
})

async function syncPlays() {
  console.log('同步玩法数据...')

  const { data: plays } = await supabase
    .from('plays')
    .select('*')
    .eq('status', 'published')

  const index = meili.index('plays')
  await index.addDocuments(plays)

  console.log(`已同步 ${plays.length} 条玩法`)
}

async function syncNews() {
  console.log('同步资讯数据...')

  const { data: news } = await supabase
    .from('news')
    .select('*')
    .eq('status', 'published')

  const index = meili.index('news')
  await index.addDocuments(news)

  console.log(`已同步 ${news.length} 条资讯`)
}

async function main() {
  await syncPlays()
  await syncNews()
  console.log('同步完成!')
}

main()
```

设置定时任务（cron job）:
```bash
# 每小时同步一次
0 * * * * cd /path/to/project && node scripts/sync-to-meilisearch.js
```

---

## 7. Next.js 前端开发

### 7.1 项目初始化

```bash
# 克隆 Next.js SaaS Starter
git clone https://github.com/vercel/nextjs-subscription-payments.git crypto-play-hub
cd crypto-play-hub

# 或从头创建
npx create-next-app@latest crypto-play-hub --typescript --tailwind --app

# 安装核心依赖
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
npm install @directus/sdk
npm install meilisearch
npm install @radix-ui/react-* lucide-react
npm install framer-motion
npm install react-hook-form zod @hookform/resolvers
npm install zustand
npm install recharts
npm install react-markdown remark-gfm
npm install date-fns

# 安装 shadcn/ui
npx shadcn-ui@latest init
```

### 7.2 项目结构

```
crypto-play-hub/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── register/
│   │   └── layout.tsx
│   ├── (main)/
│   │   ├── plays/
│   │   │   ├── page.tsx
│   │   │   ├── [slug]/
│   │   │   │   └── page.tsx
│   │   │   └── category/
│   │   │       └── [category]/
│   │   │           └── page.tsx
│   │   ├── news/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   # <!-- 暂不开发服务商功能
│   │   # ├── providers/
│   │   # │   ├── page.tsx
│   │   # │   └── [slug]/
│   │   # │       └── page.tsx
│   │   # -->
│   │   ├── dashboard/
│   │   │   ├── page.tsx
│   │   │   ├── favorites/
│   │   │   ├── contributions/
│   │   │   └── settings/
│   │   └── layout.tsx
│   ├── api/
│   │   ├── ai/
│   │   │   ├── optimize/
│   │   │   │   └── route.ts
│   │   │   └── translate/
│   │   │       └── route.ts
│   │   ├── search/
│   │   │   └── route.ts
│   │   ├── webhooks/
│   │   │   └── n8n/
│   │   │       └── route.ts
│   │   └── interactions/
│   │       └── route.ts
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── plays/
│   │   ├── PlayCard.tsx
│   │   ├── PlayList.tsx
│   │   ├── PlayDetail.tsx
│   │   └── PlayFilters.tsx
│   ├── news/
│   │   ├── NewsCard.tsx
│   │   ├── NewsFeed.tsx
│   │   └── NewsRadar.tsx
│   # <!-- 暂不开发服务商功能
│   # ├── providers/
│   # │   ├── ProviderCard.tsx
│   # │   └── ProviderList.tsx
│   # -->
│   ├── shared/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── SearchBar.tsx
│   │   ├── UserMenu.tsx
│   │   └── InteractionButtons.tsx
│   └── ui/ (shadcn components)
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── hooks.ts
│   ├── directus/
│   │   └── client.ts
│   ├── meilisearch/
│   │   ├── client.ts
│   │   └── search.ts
│   ├── ai/
│   │   ├── providers.ts
│   │   └── processor.ts
│   └── utils/
│       ├── analytics.ts
│       └── format.ts
├── hooks/
│   ├── useRealtimeNews.ts
│   ├── useSearch.ts
│   ├── useUserInteractions.ts
│   └── useAuth.ts
├── store/
│   ├── authStore.ts
│   ├── searchStore.ts
│   └── uiStore.ts
└── types/
    ├── database.types.ts
    ├── plays.ts
    ├── news.ts
    └── providers.ts
```

### 7.3 核心代码实现

#### 7.3.1 Supabase 客户端

**lib/supabase/client.ts**:
```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**lib/supabase/server.ts**:
```typescript
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Server Component 中的 set cookie 会失败
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // Server Component 中的 remove cookie 会失败
          }
        },
      },
    }
  )
}
```

#### 7.3.2 搜索功能

**lib/meilisearch/search.ts**:
```typescript
import { MeiliSearch } from 'meilisearch'

const client = new MeiliSearch({
  host: process.env.NEXT_PUBLIC_MEILISEARCH_HOST!,
  apiKey: process.env.NEXT_PUBLIC_MEILISEARCH_SEARCH_KEY
})

export interface SearchOptions {
  query: string
  indexName: 'plays' | 'news'  // | 'providers'  // 暂不开发
  filters?: string
  sort?: string[]
  limit?: number
  offset?: number
}

export async function search({
  query,
  indexName,
  filters,
  sort,
  limit = 20,
  offset = 0
}: SearchOptions) {
  const index = client.index(indexName)

  const results = await index.search(query, {
    filter: filters,
    sort: sort,
    limit: limit,
    offset: offset,
    attributesToHighlight: ['title', 'description'],
    highlightPreTag: '<mark>',
    highlightPostTag: '</mark>',
    attributesToCrop: ['description'],
    cropLength: 200
  })

  return results
}

// 搜索建议
export async function searchSuggestions(query: string) {
  if (query.length < 2) return []

  const plays = await search({
    query,
    indexName: 'plays',
    limit: 5
  })

  return plays.hits.map(hit => ({
    title: hit.title,
    type: 'play',
    slug: hit.slug
  }))
}
```

**hooks/useSearch.ts**:
```typescript
'use client'

import { useState, useEffect } from 'react'
import { search, SearchOptions } from '@/lib/meilisearch/search'
import { useDebounce } from './useDebounce'

export function useSearch(options: SearchOptions) {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const debouncedQuery = useDebounce(options.query, 300)

  useEffect(() => {
    if (!debouncedQuery) {
      setResults([])
      return
    }

    setLoading(true)
    search({ ...options, query: debouncedQuery })
      .then(res => setResults(res.hits))
      .finally(() => setLoading(false))
  }, [debouncedQuery])

  return { results, loading }
}
```

#### 7.3.3 实时数据订阅

**hooks/useRealtimeNews.ts**:
```typescript
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { News } from '@/types/news'

export function useRealtimeNews() {
  const [news, setNews] = useState<News[]>([])
  const supabase = createClient()

  useEffect(() => {
    // 初始加载
    supabase
      .from('news')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(20)
      .then(({ data }) => setNews(data || []))

    // 订阅新资讯
    const channel = supabase
      .channel('news-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'news',
          filter: 'status=eq.published'
        },
        (payload) => {
          setNews(prev => [payload.new as News, ...prev])
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'news'
        },
        (payload) => {
          setNews(prev =>
            prev.map(item =>
              item.id === payload.new.id ? payload.new as News : item
            )
          )
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [])

  return news
}
```

#### 7.3.4 用户交互

**components/shared/InteractionButtons.tsx**:
```typescript
'use client'

import { useState } from 'react'
import { Heart, Bookmark, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'

interface InteractionButtonsProps {
  contentType: 'play' | 'news'  // | 'provider'  // 暂不开发
  contentId: string
  initialLikes?: number
  initialFavorites?: number
}

export function InteractionButtons({
  contentType,
  contentId,
  initialLikes = 0,
  initialFavorites = 0
}: InteractionButtonsProps) {
  const { user } = useAuth()
  const supabase = createClient()

  const [likes, setLikes] = useState(initialLikes)
  const [favorites, setFavorites] = useState(initialFavorites)
  const [isLiked, setIsLiked] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)

  async function handleLike() {
    if (!user) {
      // 跳转到登录页
      return
    }

    if (isLiked) {
      // 取消点赞
      await supabase
        .from('user_interactions')
        .delete()
        .match({
          user_id: user.id,
          content_type: contentType,
          content_id: contentId,
          action: 'like'
        })

      setLikes(prev => prev - 1)
      setIsLiked(false)
    } else {
      // 点赞
      await supabase
        .from('user_interactions')
        .insert({
          user_id: user.id,
          content_type: contentType,
          content_id: contentId,
          action: 'like'
        })

      setLikes(prev => prev + 1)
      setIsLiked(true)
    }
  }

  async function handleFavorite() {
    if (!user) return

    if (isFavorited) {
      await supabase
        .from('user_interactions')
        .delete()
        .match({
          user_id: user.id,
          content_type: contentType,
          content_id: contentId,
          action: 'favorite'
        })

      setFavorites(prev => prev - 1)
      setIsFavorited(false)
    } else {
      await supabase
        .from('user_interactions')
        .insert({
          user_id: user.id,
          content_type: contentType,
          content_id: contentId,
          action: 'favorite'
        })

      setFavorites(prev => prev + 1)
      setIsFavorited(true)
    }
  }

  async function handleShare() {
    if (navigator.share) {
      await navigator.share({
        title: '分享内容',
        url: window.location.href
      })
    } else {
      // 复制链接
      navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <div className="flex gap-2">
      <Button
        variant={isLiked ? 'default' : 'outline'}
        size="sm"
        onClick={handleLike}
      >
        <Heart className={isLiked ? 'fill-current' : ''} />
        <span className="ml-1">{likes}</span>
      </Button>

      <Button
        variant={isFavorited ? 'default' : 'outline'}
        size="sm"
        onClick={handleFavorite}
      >
        <Bookmark className={isFavorited ? 'fill-current' : ''} />
        <span className="ml-1">{favorites}</span>
      </Button>

      <Button variant="outline" size="sm" onClick={handleShare}>
        <Share2 />
      </Button>
    </div>
  )
}
```

#### 7.3.5 玩法列表页面

**app/(main)/plays/page.tsx**:
```typescript
import { createClient } from '@/lib/supabase/server'
import { PlayList } from '@/components/plays/PlayList'
import { PlayFilters } from '@/components/plays/PlayFilters'
import { SearchBar } from '@/components/shared/SearchBar'

export default async function PlaysPage({
  searchParams
}: {
  searchParams: { category?: string; difficulty?: string; q?: string }
}) {
  const supabase = createClient()

  let query = supabase
    .from('plays')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  // 应用过滤器
  if (searchParams.category) {
    query = query.eq('category', searchParams.category)
  }
  if (searchParams.difficulty) {
    query = query.eq('difficulty', searchParams.difficulty)
  }

  const { data: plays } = await query

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">玩法库</h1>
        <p className="text-muted-foreground">
          收集各种币圈项目、DeFi 协议、空投机会和交易策略
        </p>
      </div>

      <div className="mb-6">
        <SearchBar placeholder="搜索玩法..." />
      </div>

      <div className="flex gap-8">
        <aside className="w-64 shrink-0">
          <PlayFilters />
        </aside>

        <main className="flex-1">
          <PlayList plays={plays || []} />
        </main>
      </div>
    </div>
  )
}
```

---

## 8. n8n 数据抓取

### 8.1 安装 n8n

```bash
# 使用 Docker
docker run -d \
  --name n8n \
  -p 5678:5678 \
  -e N8N_BASIC_AUTH_ACTIVE=true \
  -e N8N_BASIC_AUTH_USER=admin \
  -e N8N_BASIC_AUTH_PASSWORD=your-password \
  -e WEBHOOK_URL=https://your-domain.com \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

访问 http://localhost:5678

### 8.2 创建数据抓取工作流

#### 工作流 1: Twitter 资讯抓取

```
节点流程:
1. Schedule Trigger (每小时执行)
   ↓
2. HTTP Request (抓取 Twitter API)
   - Endpoint: https://api.twitter.com/2/tweets/search/recent
   - Query: (#crypto OR #DeFi OR #airdrop) lang:en
   ↓
3. Function (数据清洗)
   - 提取: 推文内容、作者、链接、时间
   - 去重: 检查是否已抓取
   ↓
4. HTTP Request (调用 AI 翻译)
   - POST https://your-app.com/api/ai/translate
   - Body: { "text": "{{$json.text}}", "targetLang": "zh" }
   ↓
5. HTTP Request (提交到 Directus)
   - POST https://your-directus.com/items/news
   - Body: {
       "title": "{{$json.title}}",
       "content": "{{$json.content}}",
       "ai_translation": "{{$json.translated}}",
       "status": "pending",
       "source": "twitter"
     }
   ↓
6. Slack/Email 通知审核员
```

**Function 节点代码**:
```javascript
// 数据清洗
const items = $input.all();

const cleanedItems = items.map(item => {
  const tweet = item.json;

  return {
    json: {
      title: tweet.text.substring(0, 100) + '...',
      content: tweet.text,
      author: tweet.author_id,
      source_url: `https://twitter.com/user/status/${tweet.id}`,
      published_at: tweet.created_at,
      category: extractCategory(tweet.text),
      tags: extractHashtags(tweet.text)
    }
  };
});

function extractCategory(text) {
  if (text.includes('#airdrop')) return 'airdrop';
  if (text.includes('#DeFi')) return 'defi';
  if (text.includes('#NFT')) return 'nft';
  return 'general';
}

function extractHashtags(text) {
  const matches = text.match(/#\w+/g);
  return matches ? matches.map(tag => tag.slice(1)) : [];
}

return cleanedItems;
```

#### 工作流 2: RSS 订阅抓取

```
节点流程:
1. Schedule Trigger (每30分钟)
   ↓
2. RSS Read
   - URLs:
     * https://cointelegraph.com/rss
     * https://cryptoslate.com/feed/
     * https://decrypt.co/feed
   ↓
3. Function (筛选和清洗)
   ↓
4. HTTP Request (AI 摘要生成)
   - 生成简短摘要
   ↓
5. HTTP Request (提交到 Directus)
   ↓
6. Webhook 通知前端
```

#### 工作流 3: 项目数据爬取

```
节点流程:
1. Schedule Trigger (每天执行)
   ↓
2. HTTP Request (爬取 CoinGecko API)
   - 获取新币列表
   ↓
3. Loop (遍历每个项目)
   ↓
4. HTTP Request (获取项目详情)
   ↓
5. Function (判断是否值得收录)
   - 检查市值、交易量、社交活跃度
   ↓
6. IF 节点 (符合条件)
   ↓
7. HTTP Request (AI 生成玩法教程)
   - "如何参与这个项目"
   ↓
8. HTTP Request (提交到 Directus)
   - 创建草稿玩法
```

### 8.3 Webhook 接收端点

在 Next.js 中创建接收端点:

**app/api/webhooks/n8n/route.ts**:
```typescript
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { meili } from '@/lib/meilisearch/client'

export async function POST(req: Request) {
  const { event, data } = await req.json()

  // 验证 webhook 密钥
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.N8N_WEBHOOK_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient()

  switch (event) {
    case 'news.created':
      // 新资讯创建，发送实时通知
      await supabase
        .from('news')
        .insert(data)
      break

    case 'play.approved':
      // 玩法审核通过，同步到搜索引擎
      const index = meili.index('plays')
      await index.addDocuments([data])
      break

    default:
      console.log('Unknown event:', event)
  }

  return NextResponse.json({ success: true })
}
```

---

## 9. AI 内容处理

### 9.1 AI 服务配置

**lib/ai/providers.ts**:
```typescript
export interface AIProvider {
  name: string
  endpoint: string
  model: string
  apiKey: string
}

export const AI_PROVIDERS: AIProvider[] = [
  {
    name: 'openai',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4-turbo',
    apiKey: process.env.OPENAI_API_KEY!
  },
  {
    name: 'anthropic',
    endpoint: 'https://api.anthropic.com/v1/messages',
    model: 'claude-3-sonnet-20240229',
    apiKey: process.env.ANTHROPIC_API_KEY!
  },
  {
    name: 'deepseek',
    endpoint: 'https://api.deepseek.com/v1/chat/completions',
    model: 'deepseek-chat',
    apiKey: process.env.DEEPSEEK_API_KEY!
  }
]

export async function callAI(
  provider: AIProvider,
  systemPrompt: string,
  userPrompt: string
) {
  if (provider.name === 'anthropic') {
    // Anthropic 有不同的 API 格式
    const response = await fetch(provider.endpoint, {
      method: 'POST',
      headers: {
        'x-api-key': provider.apiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: provider.model,
        max_tokens: 2000,
        messages: [
          { role: 'user', content: `${systemPrompt}\n\n${userPrompt}` }
        ]
      })
    })

    const data = await response.json()
    return data.content[0].text
  } else {
    // OpenAI 和 DeepSeek 使用相同格式
    const response = await fetch(provider.endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${provider.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: provider.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7
      })
    })

    const data = await response.json()
    return data.choices[0].message.content
  }
}

// 带重试和降级的 AI 调用
export async function callAIWithFallback(
  systemPrompt: string,
  userPrompt: string
) {
  for (const provider of AI_PROVIDERS) {
    try {
      return await callAI(provider, systemPrompt, userPrompt)
    } catch (error) {
      console.error(`${provider.name} failed:`, error)
      // 继续尝试下一个提供商
    }
  }

  throw new Error('所有 AI 提供商都不可用')
}
```

### 9.2 内容优化

**app/api/ai/optimize/route.ts**:
```typescript
import { NextResponse } from 'next/server'
import { callAIWithFallback } from '@/lib/ai/providers'

export async function POST(req: Request) {
  const { content, type } = await req.json()

  const systemPrompt = `你是一个专业的币圈内容优化专家。你的任务是优化用户提供的内容，使其:
1. 更加专业和准确
2. 结构清晰，易于理解
3. 保留所有重要的技术细节
4. 添加必要的风险提示
5. 使用适当的术语`

  let userPrompt = ''

  if (type === 'play') {
    userPrompt = `请优化以下币圈玩法教程:\n\n${content}\n\n请保持原有的步骤结构，但使语言更加专业和易懂。`
  } else if (type === 'news') {
    userPrompt = `请优化以下币圈资讯:\n\n${content}\n\n请提取关键信息，使内容更加简洁明了。`
  }

  try {
    const optimized = await callAIWithFallback(systemPrompt, userPrompt)
    return NextResponse.json({ optimized })
  } catch (error) {
    return NextResponse.json(
      { error: 'AI 服务暂时不可用' },
      { status: 503 }
    )
  }
}
```

### 9.3 内容翻译

**app/api/ai/translate/route.ts**:
```typescript
import { NextResponse } from 'next/server'
import { callAIWithFallback } from '@/lib/ai/providers'

export async function POST(req: Request) {
  const { text, targetLang } = await req.json()

  const systemPrompt = `你是一个专业的币圈内容翻译专家。翻译时请注意:
1. 保留专业术语的准确性（如 DeFi、Airdrop、Staking 等）
2. 保持原文的语气和风格
3. 确保翻译自然流畅
4. 保留所有链接和格式`

  const langMap = {
    zh: '中文',
    en: 'English',
    ja: '日本語',
    ko: '한국어'
  }

  const userPrompt = `请将以下内容翻译成${langMap[targetLang] || targetLang}:\n\n${text}`

  try {
    const translated = await callAIWithFallback(systemPrompt, userPrompt)
    return NextResponse.json({ translated })
  } catch (error) {
    return NextResponse.json(
      { error: '翻译服务暂时不可用' },
      { status: 503 }
    )
  }
}
```

### 9.4 自动摘要生成

**app/api/ai/summarize/route.ts**:
```typescript
import { NextResponse } from 'next/server'
import { callAIWithFallback } from '@/lib/ai/providers'

export async function POST(req: Request) {
  const { content, maxLength = 200 } = await req.json()

  const systemPrompt = `你是一个专业的内容摘要生成器。请生成一个简洁的摘要，突出以下内容的核心要点。`

  const userPrompt = `请为以下内容生成一个不超过${maxLength}字的摘要:\n\n${content}`

  const summary = await callAIWithFallback(systemPrompt, userPrompt)

  return NextResponse.json({ summary })
}
```

---

## 10. 第三方集成

### 10.1 Giscus 评论系统

#### 10.1.1 设置

1. 创建 GitHub 仓库（公开）
2. 安装 Giscus App: https://github.com/apps/giscus
3. 启用 Discussions
4. 访问 https://giscus.app 获取配置

#### 10.1.2 集成

**components/shared/Comments.tsx**:
```typescript
'use client'

import Giscus from '@giscus/react'

interface CommentsProps {
  identifier: string // 用于识别评论的唯一标识
}

export function Comments({ identifier }: CommentsProps) {
  return (
    <Giscus
      repo="your-username/your-repo"
      repoId="your-repo-id"
      category="General"
      categoryId="your-category-id"
      mapping="specific"
      term={identifier}
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="top"
      theme="preferred_color_scheme"
      lang="zh-CN"
      loading="lazy"
    />
  )
}
```

使用:
```tsx
// 在玩法详情页
<Comments identifier={play.slug} />
```

### 10.2 Plausible 分析

#### 10.2.1 设置

注册 Plausible 账号: https://plausible.io

#### 10.2.2 集成

**app/layout.tsx**:
```typescript
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Script
          defer
          data-domain="yourdomain.com"
          src="https://plausible.io/js/script.js"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

自定义事件追踪:
```typescript
// 追踪用户操作
function trackEvent(eventName: string, props?: object) {
  if (window.plausible) {
    window.plausible(eventName, { props })
  }
}

// 使用
trackEvent('Play Viewed', { category: play.category })
trackEvent('Favorite Added', { contentType: 'play' })
```

### 10.3 Resend 邮件

**lib/email/client.ts**:
```typescript
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail({
  to,
  subject,
  html
}: {
  to: string
  subject: string
  html: string
}) {
  try {
    await resend.emails.send({
      from: 'CryptoPlayHub <noreply@yourdomain.com>',
      to,
      subject,
      html
    })
  } catch (error) {
    console.error('Email send failed:', error)
  }
}

// 发送审核通知
export async function sendReviewNotification(
  reviewerEmail: string,
  contentTitle: string,
  contentUrl: string
) {
  await sendEmail({
    to: reviewerEmail,
    subject: '新内容待审核',
    html: `
      <h2>新内容待审核</h2>
      <p>有新的内容需要您审核:</p>
      <p><strong>${contentTitle}</strong></p>
      <a href="${contentUrl}">点击查看</a>
    `
  })
}
```

---

## 11. 部署指南

### 11.1 Vercel 部署（Next.js）

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel

# 设置环境变量
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# ... 添加所有环境变量

# 生产部署
vercel --prod
```

**vercel.json**:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/:path*"
    }
  ]
}
```

### 11.2 Directus 部署

#### Railway 部署

1. 访问 https://railway.app
2. 创建新项目
3. 添加 Directus 模板
4. 配置环境变量
5. 部署

#### Docker 部署

```bash
# 构建镜像
docker build -t crypto-directus .

# 运行
docker run -d \
  -p 8055:8055 \
  --env-file .env \
  crypto-directus
```

### 11.3 Meilisearch 部署

#### Meilisearch Cloud

1. 访问 https://www.meilisearch.com/cloud
2. 创建实例
3. 获取 API 密钥
4. 配置索引

#### 自托管（VPS）

```bash
# 使用 Docker
docker run -d \
  --name meilisearch \
  -p 7700:7700 \
  -e MEILI_MASTER_KEY='your-production-key' \
  -e MEILI_ENV='production' \
  -v /var/lib/meilisearch:/meili_data \
  --restart unless-stopped \
  getmeili/meilisearch:v1.6
```

### 11.4 n8n 部署

#### n8n Cloud

访问 https://n8n.io/cloud

#### 自托管

```bash
docker run -d \
  --name n8n \
  -p 5678:5678 \
  -e N8N_HOST=n8n.yourdomain.com \
  -e N8N_PROTOCOL=https \
  -e NODE_ENV=production \
  -e WEBHOOK_URL=https://n8n.yourdomain.com \
  -v ~/.n8n:/home/node/.n8n \
  --restart unless-stopped \
  n8nio/n8n
```

### 11.5 生产环境检查清单

- [ ] 所有 API 密钥已设置为环境变量
- [ ] 数据库备份已配置
- [ ] CORS 已正确配置
- [ ] Rate limiting 已启用
- [ ] 错误监控已设置（Sentry）
- [ ] 日志系统已配置
- [ ] CDN 已配置（Cloudflare）
- [ ] SSL 证书已安装
- [ ] 安全头已设置
- [ ] 性能监控已启用

---

## 12. 最佳实践

### 12.1 代码规范

```typescript
// 使用 TypeScript 严格模式
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true
  }
}

// 使用 ESLint
// .eslintrc.js
module.exports = {
  extends: ['next/core-web-vitals', 'prettier'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'warn'
  }
}
```

### 12.2 性能优化

```typescript
// 1. 使用 Next.js Image 组件
import Image from 'next/image'

<Image
  src={play.image}
  alt={play.title}
  width={400}
  height={300}
  loading="lazy"
/>

// 2. 动态导入减少初始包大小
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
  ssr: false
})

// 3. 使用 React.memo 避免不必要的重渲染
export const PlayCard = React.memo(({ play }) => {
  // ...
})

// 4. 使用 useMemo 缓存计算结果
const sortedPlays = useMemo(
  () => plays.sort((a, b) => b.views - a.views),
  [plays]
)
```

### 12.3 安全最佳实践

```typescript
// 1. 输入验证（使用 Zod）
import { z } from 'zod'

const playSchema = z.object({
  title: z.string().min(5).max(200),
  category: z.enum(['airdrop', 'mining', 'defi', 'trading']),
  content: z.string().min(100)
})

// 2. SQL 注入防护（使用参数化查询）
// Supabase 自动处理，但自定义 SQL 时注意:
const { data } = await supabase
  .from('plays')
  .select('*')
  .eq('id', userInput) // ✅ 安全
// 不要: .select(`* WHERE id = ${userInput}`) // ❌ 危险!

// 3. XSS 防护
import DOMPurify from 'isomorphic-dompurify'

const cleanHtml = DOMPurify.sanitize(userInput)

// 4. CSRF 保护
// Next.js API Routes 自动包含 CSRF 保护
// 额外验证:
if (req.headers.get('x-csrf-token') !== expectedToken) {
  return new Response('Forbidden', { status: 403 })
}
```

### 12.4 测试策略

```typescript
// 单元测试（Vitest）
import { describe, it, expect } from 'vitest'
import { formatDate } from './utils'

describe('formatDate', () => {
  it('should format date correctly', () => {
    expect(formatDate('2024-01-01')).toBe('2024年1月1日')
  })
})

// 集成测试（Playwright）
import { test, expect } from '@playwright/test'

test('should display plays', async ({ page }) => {
  await page.goto('/plays')
  await expect(page.locator('h1')).toContainText('玩法库')
  await expect(page.locator('[data-testid="play-card"]')).toHaveCount(10)
})
```

### 12.5 错误处理

```typescript
// 全局错误边界
// app/error.tsx
'use client'

export default function Error({
  error,
  reset
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div>
      <h2>出错了!</h2>
      <p>{error.message}</p>
      <button onClick={reset}>重试</button>
    </div>
  )
}

// API 错误处理
try {
  const data = await fetchData()
} catch (error) {
  if (error instanceof APIError) {
    // 处理 API 错误
  } else {
    // 记录到 Sentry
    Sentry.captureException(error)
  }
}
```

---

## 附录

### A. 环境变量清单

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Directus
NEXT_PUBLIC_DIRECTUS_URL=
DIRECTUS_ADMIN_TOKEN=

# Meilisearch
NEXT_PUBLIC_MEILISEARCH_HOST=
MEILISEARCH_API_KEY=

# AI APIs
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
DEEPSEEK_API_KEY=

# n8n
N8N_WEBHOOK_SECRET=

# Giscus
NEXT_PUBLIC_GISCUS_REPO=
NEXT_PUBLIC_GISCUS_REPO_ID=
NEXT_PUBLIC_GISCUS_CATEGORY_ID=

# Plausible
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=

# Resend
RESEND_API_KEY=

# 其他
NEXT_PUBLIC_APP_URL=
NODE_ENV=
```

### B. 常用命令

```bash
# 开发
npm run dev

# 构建
npm run build

# 启动生产服务器
npm start

# 类型检查
npm run type-check

# Lint
npm run lint

# 格式化代码
npm run format

# 数据库迁移
supabase db push

# 同步到 Meilisearch
node scripts/sync-to-meilisearch.js
```

### C. 有用的资源

- [Next.js 文档](https://nextjs.org/docs)
- [Supabase 文档](https://supabase.com/docs)
- [Directus 文档](https://docs.directus.io)
- [Meilisearch 文档](https://www.meilisearch.com/docs)
- [n8n 文档](https://docs.n8n.io)
- [shadcn/ui 组件](https://ui.shadcn.com)

---

**版本**: 1.0.0
**最后更新**: 2024-01-XX
**维护者**: Your Name
