# 币圈八卦功能 - Supabase 数据库迁移指南

## 📋 执行前检查清单

- [ ] 已登录 Supabase Dashboard
- [ ] 确认 `news` 表存在且包含 `news_type` 字段
- [ ] 确认有管理员权限执行DDL操作
- [ ] 建议在低峰期执行 (如凌晨)

---

## 🚀 执行步骤

### Step 1: 打开 SQL Editor
1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择你的项目
3. 左侧菜单点击 **SQL Editor**

### Step 2: 执行迁移脚本
1. 点击 **New Query** 创建新查询
2. 打开本地文件 `sql/add_gossip_fields.sql`
3. 复制**全部内容**粘贴到 SQL Editor
4. 点击右下角 **Run** 按钮
5. 等待执行完成 (预计 5-10 秒)

### Step 3: 检查执行结果

#### 预期输出 (Output 面板)
```
NOTICE:  ✓ News 表新字段添加成功 (6/6)
NOTICE:  ✓ gossip_interactions 表创建成功
NOTICE:  ✓ 八卦视图创建成功 (3/3)
NOTICE:  ✓ 热度自动更新触发器创建成功

SELECT 1
status: 🎉 币圈八卦功能数据库迁移完成!
```

#### 如果出现错误
- **错误**: `relation "public.news" does not exist`
  **原因**: news 表不存在
  **解决**: 先创建 news 表或检查表名

- **错误**: `column "news_type" does not exist`
  **原因**: news 表缺少 news_type 字段
  **解决**: 先添加字段 `ALTER TABLE news ADD COLUMN news_type VARCHAR(50);`

- **错误**: `permission denied`
  **原因**: 权限不足
  **解决**: 使用 service_role 权限或联系管理员

---

## ✅ 验证迁移结果

### 1. 检查 News 表新字段
```sql
-- 在 SQL Editor 中执行
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'news'
  AND column_name IN (
    'credibility_score',
    'hotness_score',
    'verification_status',
    'gossip_tags',
    'likes_count',
    'comments_count'
  );
```

**预期结果**: 返回 6 行记录

### 2. 检查互动表
```sql
SELECT * FROM public.gossip_interactions LIMIT 1;
```

**预期结果**: 返回空表或现有数据

### 3. 查看热门八卦视图
```sql
SELECT * FROM public.gossip_hotness_ranking LIMIT 5;
```

**预期结果**: 返回热度排序的八卦列表 (如果有数据)

### 4. 测试触发器
```sql
-- 插入测试八卦
INSERT INTO public.news (title, content, news_type, likes_count, comments_count, status)
VALUES ('测试八卦', '测试内容', 'gossip', 10, 5, 'published');

-- 查看热度是否自动计算
SELECT title, likes_count, comments_count, hotness_score FROM public.news WHERE title = '测试八卦';

-- 清理测试数据
DELETE FROM public.news WHERE title = '测试八卦';
```

**预期结果**: `hotness_score` 应该自动计算为一个正整数

---

## 📊 新增的数据库对象总览

### 表 (Tables)
| 表名 | 用途 | 记录数预期 |
|------|------|-----------|
| `gossip_interactions` | 用户互动记录 (点赞/评论/求证) | 随用户增长 |

### 字段 (Columns in news table)
| 字段名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `credibility_score` | INTEGER | 50 | 可信度 (0-100) |
| `hotness_score` | INTEGER | 0 | 热度分数 (自动计算) |
| `verification_status` | VARCHAR(50) | 'unverified' | 求证状态 |
| `gossip_tags` | TEXT[] | {} | 标签数组 |
| `likes_count` | INTEGER | 0 | 点赞数 |
| `comments_count` | INTEGER | 0 | 评论数 |

### 视图 (Views)
| 视图名 | 用途 | 数据来源 |
|--------|------|---------|
| `gossip_hotness_ranking` | 热门八卦 Top 20 | news 表 |
| `gossip_today_hot` | 今日热门八卦 Top 10 | news 表 (过滤今日) |
| `gossip_statistics` | 八卦统计数据 | news 表 (聚合) |

### 函数 (Functions)
| 函数名 | 参数 | 返回值 | 用途 |
|--------|------|--------|------|
| `update_gossip_hotness()` | - | TRIGGER | 自动计算热度 |
| `update_updated_at_column()` | - | TRIGGER | 更新时间戳 |
| `recalculate_all_gossip_hotness()` | - | INTEGER | 手动重算所有热度 |
| `get_user_gossip_interactions()` | user_id, news_id | TABLE | 获取用户互动状态 |

### 触发器 (Triggers)
| 触发器名 | 表 | 触发时机 | 作用 |
|---------|-----|---------|------|
| `trigger_update_gossip_hotness` | news | INSERT/UPDATE | 自动更新热度分数 |
| `trigger_gossip_interactions_updated_at` | gossip_interactions | UPDATE | 更新 updated_at |

### 索引 (Indexes)
- `idx_news_gossip_hotness` - 热度排序优化
- `idx_news_gossip_tags` - 标签搜索优化 (GIN)
- `idx_news_verification_status` - 求证状态查询优化
- `idx_gossip_interactions_news` - 互动记录按新闻查询
- `idx_gossip_interactions_user` - 互动记录按用户查询

---

## 🔐 RLS 策略 (Row Level Security)

`gossip_interactions` 表已启用 RLS,策略如下:

| 操作 | 权限 | 说明 |
|------|------|------|
| SELECT | 所有人 | 任何人都可以查看互动记录 |
| INSERT | 认证用户 | 只有登录用户可以创建互动 |
| UPDATE | 用户本人 | 只能修改自己的互动记录 |
| DELETE | 用户本人 | 只能删除自己的互动记录 |

---

## 🧪 测试用例

### 测试 1: 点赞功能
```sql
-- 模拟用户点赞
INSERT INTO public.gossip_interactions (user_id, news_id, interaction_type)
VALUES (
  '00000000-0000-0000-0000-000000000001', -- 替换为真实 user_id
  (SELECT id FROM public.news WHERE news_type = 'gossip' LIMIT 1),
  'like'
);

-- 检查 likes_count 是否自动+1
SELECT id, title, likes_count, hotness_score
FROM public.news
WHERE id = (SELECT news_id FROM public.gossip_interactions ORDER BY created_at DESC LIMIT 1);
```

### 测试 2: 热度衰减
```sql
-- 创建不同时间的八卦
INSERT INTO public.news (title, content, news_type, status, likes_count, comments_count, content_published_at)
VALUES
  ('24小时前的八卦', '内容', 'gossip', 'published', 50, 30, NOW() - INTERVAL '24 hours'),
  ('1小时前的八卦', '内容', 'gossip', 'published', 50, 30, NOW() - INTERVAL '1 hour'),
  ('刚发布的八卦', '内容', 'gossip', 'published', 50, 30, NOW());

-- 查看热度差异 (时间越近热度越高)
SELECT title, likes_count, comments_count, hotness_score, content_published_at
FROM public.news
WHERE title LIKE '%八卦'
ORDER BY hotness_score DESC;

-- 清理测试数据
DELETE FROM public.news WHERE title LIKE '%八卦';
```

### 测试 3: 视图数据
```sql
-- 查看热门排行榜
SELECT rank, title, hotness_score, likes_count, comments_count
FROM public.gossip_hotness_ranking
LIMIT 5;

-- 查看今日热门
SELECT * FROM public.gossip_today_hot;

-- 查看统计数据
SELECT * FROM public.gossip_statistics;
```

---

## 🛠️ 常用维护命令

### 手动重算所有八卦热度
```sql
SELECT public.recalculate_all_gossip_hotness();
-- 返回更新的记录数
```

### 查看用户对某条八卦的互动
```sql
SELECT * FROM public.get_user_gossip_interactions(
  '用户UUID',
  '八卦新闻UUID'
);
```

### 清理过期八卦 (7天前的未求证八卦)
```sql
UPDATE public.news
SET status = 'archived'
WHERE news_type = 'gossip'
  AND verification_status = 'unverified'
  AND content_published_at < NOW() - INTERVAL '7 days';
```

### 批量更新八卦标签
```sql
UPDATE public.news
SET gossip_tags = ARRAY['项目传闻', 'KOL动态']
WHERE id IN ('uuid1', 'uuid2', 'uuid3');
```

---

## 🔄 回滚方案 (如需回滚)

```sql
-- 警告: 以下操作将删除所有八卦相关数据!

-- 1. 删除视图
DROP VIEW IF EXISTS public.gossip_hotness_ranking CASCADE;
DROP VIEW IF EXISTS public.gossip_today_hot CASCADE;
DROP VIEW IF EXISTS public.gossip_statistics CASCADE;

-- 2. 删除触发器
DROP TRIGGER IF EXISTS trigger_update_gossip_hotness ON public.news;
DROP TRIGGER IF EXISTS trigger_gossip_interactions_updated_at ON public.gossip_interactions;

-- 3. 删除函数
DROP FUNCTION IF EXISTS public.update_gossip_hotness CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at_column CASCADE;
DROP FUNCTION IF EXISTS public.recalculate_all_gossip_hotness CASCADE;
DROP FUNCTION IF EXISTS public.get_user_gossip_interactions CASCADE;

-- 4. 删除表
DROP TABLE IF EXISTS public.gossip_interactions CASCADE;

-- 5. 删除 news 表字段
ALTER TABLE public.news
DROP COLUMN IF EXISTS credibility_score,
DROP COLUMN IF EXISTS hotness_score,
DROP COLUMN IF EXISTS verification_status,
DROP COLUMN IF EXISTS gossip_tags,
DROP COLUMN IF EXISTS likes_count,
DROP COLUMN IF EXISTS comments_count;

-- 6. 删除索引
DROP INDEX IF EXISTS public.idx_news_gossip_hotness;
DROP INDEX IF EXISTS public.idx_news_gossip_tags;
DROP INDEX IF EXISTS public.idx_news_verification_status;
DROP INDEX IF EXISTS public.idx_gossip_interactions_news;
DROP INDEX IF EXISTS public.idx_gossip_interactions_user;
```

---

## 📞 支持与反馈

如果迁移过程中遇到问题:
1. 检查 Supabase Dashboard 的 Logs 面板查看详细错误
2. 在项目 Issues 中提交问题
3. 联系技术负责人

**迁移完成后,请在团队群通知前端和后端开发人员!**
