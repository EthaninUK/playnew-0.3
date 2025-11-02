# Supabase 数据库架构设置指南

## 📋 概述

本指南将帮助您在 Supabase 中创建用户系统所需的数据库表和安全策略。

## 🎯 需要创建的表

1. **user_profiles** - 用户配置表（用户名、头像、简介）
2. **user_favorites** - 用户收藏表（玩法、服务商、资讯）
3. **user_history** - 用户浏览历史表

## 🚀 快速设置（推荐）

### 方法 1: 使用 Supabase Dashboard（最简单）

1. **打开 Supabase SQL Editor**
   - 访问: https://supabase.com/dashboard/project/cujpgrzjmmttysphjknu/sql
   - 或者从你的项目 Dashboard 点击左侧菜单的 "SQL Editor"

2. **创建新查询**
   - 点击 "New query" 按钮

3. **复制粘贴 SQL**
   - 打开项目根目录的 `supabase-schema.sql` 文件
   - 复制所有内容
   - 粘贴到 SQL Editor 中

4. **执行 SQL**
   - 点击右下角的 "Run" 按钮（或按 Cmd/Ctrl + Enter）
   - 等待执行完成

5. **验证**
   - 在左侧菜单点击 "Table Editor"
   - 应该能看到 `user_profiles`, `user_favorites`, `user_history` 三张表

### 方法 2: 使用自动化脚本（实验性）

```bash
# 在项目根目录执行
node setup-supabase.js
```

> ⚠️  注意: 此方法可能因权限限制而失败，推荐使用方法 1

---

## 📊 数据库架构说明

### 1. user_profiles 表

存储用户的公开信息：

| 字段 | 类型 | 说明 |
|-----|-----|-----|
| id | UUID | 主键，关联 auth.users.id |
| username | TEXT | 用户名（唯一） |
| avatar_url | TEXT | 头像URL |
| bio | TEXT | 个人简介 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

**特性:**
- 🔐 启用 RLS (Row Level Security)
- 👁️ 所有人可查看
- ✏️ 仅本人可编辑
- 🤖 用户注册时自动创建

### 2. user_favorites 表

存储用户收藏的内容：

| 字段 | 类型 | 说明 |
|-----|-----|-----|
| id | UUID | 主键 |
| user_id | UUID | 用户ID |
| item_type | TEXT | 类型: strategy/provider/news |
| item_id | UUID | 内容ID（Directus中的ID） |
| created_at | TIMESTAMP | 收藏时间 |

**特性:**
- 🔐 启用 RLS
- 👤 仅本人可见和操作
- 🚫 同一内容不可重复收藏
- 📈 有索引优化查询

### 3. user_history 表

存储用户浏览历史：

| 字段 | 类型 | 说明 |
|-----|-----|-----|
| id | UUID | 主键 |
| user_id | UUID | 用户ID |
| item_type | TEXT | 类型: strategy/provider/news |
| item_id | UUID | 内容ID |
| viewed_at | TIMESTAMP | 浏览时间 |

**特性:**
- 🔐 启用 RLS
- 👤 仅本人可见
- 🔄 同一内容再次浏览会更新时间
- 🧹 提供清理旧记录的函数

---

## 🔒 安全策略 (RLS)

所有表都启用了 Row Level Security (RLS)，确保：

- ✅ 用户只能访问自己的数据
- ✅ 防止数据泄露
- ✅ 符合隐私保护最佳实践

---

## 🧪 测试验证

设置完成后，您可以测试：

### 1. 注册新用户

访问: http://localhost:3000/auth/register

### 2. 检查 profile 是否自动创建

在 Supabase Dashboard > Table Editor > user_profiles 中应该能看到新用户

### 3. 测试收藏功能

- 登录后访问任意玩法详情页
- 点击收藏按钮
- 在 user_favorites 表中应该能看到记录

---

## ❓ 常见问题

### Q: 执行 SQL 时出现权限错误怎么办？

A: 确保你在 Supabase Dashboard 中以项目 Owner 身份登录。

### Q: 如何删除所有表重新开始？

A: 在 SQL Editor 中执行：

```sql
DROP TABLE IF EXISTS public.user_history CASCADE;
DROP TABLE IF EXISTS public.user_favorites CASCADE;
DROP TABLE IF EXISTS public.user_profiles CASCADE;
DROP VIEW IF EXISTS public.user_favorite_stats CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.handle_updated_at() CASCADE;
DROP FUNCTION IF EXISTS public.cleanup_old_history(UUID) CASCADE;
```

然后重新执行 `supabase-schema.sql`

### Q: 用户注册后 profile 没有自动创建？

A: 检查触发器是否正确创建：

```sql
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

### Q: 如何查看某个用户的所有收藏？

A: 在 SQL Editor 中执行：

```sql
SELECT * FROM user_favorites WHERE user_id = '你的用户ID';
```

---

## 📚 相关文档

- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Triggers](https://supabase.com/docs/guides/database/postgres/triggers)
- [Next.js + Supabase Auth](https://supabase.com/docs/guides/auth/server-side/nextjs)

---

## ✅ 设置完成清单

- [ ] 在 Supabase Dashboard 中执行 `supabase-schema.sql`
- [ ] 验证三张表已创建
- [ ] 验证 RLS 策略已启用
- [ ] 测试用户注册
- [ ] 测试收藏功能

完成以上步骤后，用户系统就可以正常使用了！🎉
