# 币圈玩法收集录 - 快速启动方案

## 项目概述

一个基于 Directus + Supabase 的币圈内容收集与资讯分发平台，提供玩法库、资讯雷达功能。
<!-- 暂不开发服务商功能 -->

## 核心技术栈

- **后端**: Directus (Headless CMS) + Supabase (数据库 + 实时功能 + 认证)
- **前端**: Next.js 14+ (App Router) + shadcn/ui
- **搜索**: Meilisearch
- **数据抓取**: n8n + AI 处理
- **其他服务**: Giscus (评论)、Plausible (分析)、Resend (邮件)

---

## 快速开始（7 天启动计划）

### Day 1-2: 基础设施搭建

#### 1. Supabase 设置
```bash
# 创建 Supabase 项目
# 访问 https://supabase.com 并创建新项目
# 记录：Project URL、anon key、service_role key
```

**创建核心数据表**:
```sql
-- 玩法库表
CREATE TABLE plays (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  difficulty TEXT,
  tags TEXT[],
  content JSONB,
  status TEXT DEFAULT 'draft',
  views INT DEFAULT 0,
  likes INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 资讯表
CREATE TABLE news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT,
  source TEXT,
  category TEXT,
  tags TEXT[],
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- <!-- 暂不开发服务商功能
-- 服务商表
-- CREATE TABLE service_providers (
--   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
--   name TEXT NOT NULL,
--   description TEXT,
--   category TEXT,
--   website TEXT,
--   rating NUMERIC(3,2),
--   created_at TIMESTAMPTZ DEFAULT NOW()
-- );
-- -->

-- 用户交互表
CREATE TABLE user_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  content_type TEXT,
  content_id UUID,
  action TEXT, -- like, favorite, follow
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, content_type, content_id, action)
);

-- 启用 Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE plays;
ALTER PUBLICATION supabase_realtime ADD TABLE news;
```

#### 2. Directus 设置
```bash
# 使用 Docker Compose 快速部署
# 创建 docker-compose.yml

version: '3'
services:
  directus:
    image: directus/directus:latest
    ports:
      - 8055:8055
    environment:
      KEY: 'your-random-key'
      SECRET: 'your-random-secret'
      DB_CLIENT: 'pg'
      DB_HOST: 'db.your-supabase-project.supabase.co'
      DB_PORT: '5432'
      DB_DATABASE: 'postgres'
      DB_USER: 'postgres'
      DB_PASSWORD: 'your-password'
      ADMIN_EMAIL: 'admin@example.com'
      ADMIN_PASSWORD: 'your-admin-password'
```

启动 Directus:
```bash
docker-compose up -d
# 访问 http://localhost:8055
```

#### 3. Meilisearch 设置
```bash
# 使用 Docker 运行
docker run -d \
  --name meilisearch \
  -p 7700:7700 \
  -e MEILI_MASTER_KEY='your-master-key' \
  getmeili/meilisearch:latest

# 或使用 Meilisearch Cloud: https://www.meilisearch.com/cloud
```

### Day 3-4: Next.js 前端搭建

#### 1. 初始化项目
```bash
# 克隆 Next.js SaaS Starter
git clone https://github.com/vercel/nextjs-subscription-payments.git crypto-play-hub
cd crypto-play-hub

# 安装依赖
npm install

# 安装额外依赖
npm install @directus/sdk @supabase/supabase-js meilisearch
npm install @radix-ui/react-* lucide-react framer-motion
npm install react-hook-form zod @hookform/resolvers
npm install zustand recharts
```

#### 2. 环境变量配置
创建 `.env.local`:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Directus
NEXT_PUBLIC_DIRECTUS_URL=http://localhost:8055
DIRECTUS_ADMIN_TOKEN=your-admin-token

# Meilisearch
NEXT_PUBLIC_MEILISEARCH_HOST=http://localhost:7700
MEILISEARCH_API_KEY=your-master-key

# AI APIs (多个备选)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
DEEPSEEK_API_KEY=...

# 其他服务
NEXT_PUBLIC_GISCUS_REPO=your-username/your-repo
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=yourdomain.com
RESEND_API_KEY=re_...
```

#### 3. 快速搭建核心页面
```bash
# 创建核心目录结构
mkdir -p app/(main)/{plays,news}
mkdir -p components/{plays,news,shared}
mkdir -p lib/{directus,supabase,meilisearch,ai}
# <!-- 暂不开发: providers -->
```

### Day 5-6: 核心功能开发

#### 1. 创建 API 客户端

**lib/supabase/client.ts**:
```typescript
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

**lib/directus/client.ts**:
```typescript
import { createDirectus, rest, authentication } from '@directus/sdk'

export const directus = createDirectus(process.env.NEXT_PUBLIC_DIRECTUS_URL!)
  .with(authentication())
  .with(rest())
```

**lib/meilisearch/client.ts**:
```typescript
import { MeiliSearch } from 'meilisearch'

export const meili = new MeiliSearch({
  host: process.env.NEXT_PUBLIC_MEILISEARCH_HOST!,
  apiKey: process.env.MEILISEARCH_API_KEY
})
```

#### 2. 实现搜索功能
```typescript
// lib/meilisearch/search.ts
export async function searchContent(query: string, filters?: any) {
  const index = meili.index('content')
  return await index.search(query, {
    filter: filters,
    attributesToHighlight: ['title', 'description'],
    limit: 20
  })
}
```

#### 3. 创建实时订阅
```typescript
// hooks/useRealtimeNews.ts
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export function useRealtimeNews() {
  const [news, setNews] = useState([])

  useEffect(() => {
    const channel = supabase
      .channel('news-changes')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'news' },
        (payload) => {
          setNews(prev => [payload.new, ...prev])
        }
      )
      .subscribe()

    return () => { channel.unsubscribe() }
  }, [])

  return news
}
```

### Day 7: n8n 工作流 + AI 处理

#### 1. n8n 设置
```bash
# 使用 Docker 运行 n8n
docker run -d \
  --name n8n \
  -p 5678:5678 \
  -e N8N_BASIC_AUTH_ACTIVE=true \
  -e N8N_BASIC_AUTH_USER=admin \
  -e N8N_BASIC_AUTH_PASSWORD=your-password \
  n8nio/n8n
```

#### 2. 创建数据抓取工作流
在 n8n 中创建工作流:
1. **HTTP Request** - 抓取币圈资讯源
2. **Function** - 数据清洗
3. **HTTP Request** - 调用平台 AI API 进行翻译/优化
4. **HTTP Request** - POST 到 Directus (待审核状态)

#### 3. AI 处理 API
```typescript
// app/api/ai/process/route.ts
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { content, action } = await req.json()

  // 使用 OpenAI/Anthropic/DeepSeek 处理
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: '你是币圈内容优化专家' },
        { role: 'user', content: `请${action}: ${content}` }
      ]
    })
  })

  const data = await response.json()
  return NextResponse.json({ result: data.choices[0].message.content })
}
```

---

## 最小可行产品 (MVP) 功能清单

### ✅ 第一周完成
- [ ] Supabase 数据库 + 实时功能
- [ ] Directus 管理后台
- [ ] Next.js 基础框架
- [ ] 玩法库列表页面
- [ ] 资讯展示页面
- [ ] 基础搜索功能
- [ ] n8n 数据抓取工作流

### 🚀 第二周完成
- [ ] 用户认证系统
- [ ] 点赞/收藏/关注功能
- [ ] Giscus 评论集成
- [ ] AI 内容处理
- [ ] 人工审核界面
- [ ] 移动端适配

---

## 关键命令速查

```bash
# 启动开发环境
docker-compose up -d        # Directus
docker start meilisearch    # 搜索
docker start n8n            # 数据抓取
npm run dev                 # Next.js

# 部署
vercel deploy              # 前端部署到 Vercel
# Directus/n8n 部署到 Railway/Render
```

---

## 下一步

查看 [DEV_HANDBOOK.md](./DEV_HANDBOOK.md) 获取完整的开发文档和详细实现指南。

---

**预估成本**:
- Supabase Free Tier: $0 (500MB 数据库)
- Directus Cloud Starter: $15/月 (或自托管 $0)
- Meilisearch Cloud: $0 (Sandbox) - $29/月
- Vercel Hobby: $0
- n8n Cloud: $20/月 (或自托管 $0)
- **总计**: $0-65/月
