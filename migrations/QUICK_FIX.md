# 🔧 快速修复指南

## 问题：SQL 脚本报错

### 错误类型 1: "column does not exist"
```
ERROR: 42703: column "name" does not exist
```
**原因**: 脚本尝试从不存在的表/字段读取数据

### 错误类型 2: "syntax error at or near RAISE"
```
ERROR: 42601: syntax error at or near "RAISE"
```
**原因**: 中文字符或 emoji 导致编码问题

---

## ✅ 解决方案：使用以下版本

### 推荐执行顺序（复制粘贴版）

```
1. ✅ 00_backup_all_tables.sql           <- 原版
2. ✅ 01_drop_unnecessary_tables.sql     <- 原版
3. ✅ 02_create_new_tables_SAFE.sql      <- 使用 SAFE 版本
4. ✅ 03_rename_and_migrate_SIMPLE.sql   <- 使用 SIMPLE 版本（无特殊字符）
5. ✅ 04_create_indexes.sql              <- 原版
6. ✅ 05_enable_rls.sql                  <- 原版
```

---

## 🎯 核心改动

| 原始文件 | 问题 | 使用版本 |
|---------|------|---------|
| 02_create_new_tables.sql | 尝试迁移可能不存在的数据 | **02_create_new_tables_SAFE.sql** |
| 03_rename_and_migrate.sql | 中文/emoji 编码问题 | **03_rename_and_migrate_SIMPLE.sql** |

---

## 📝 版本对比

### 02_create_new_tables

| 版本 | 说明 | 优点 | 缺点 |
|------|------|------|------|
| 原版 | 尝试迁移数据 | 数据不丢失 | 可能报错 |
| **SAFE** | 只创建表 | 不会报错 | 不迁移历史数据 |

**推荐**: SAFE 版本

### 03_rename_and_migrate

| 版本 | 说明 | 优点 | 缺点 |
|------|------|------|------|
| 原版 | 中文注释 | 易读 | 编码错误 |
| SAFE | 中文+emoji | 易读 | 编码错误 |
| **SIMPLE** | 纯英文 | 100%兼容 | 英文注释 |

**推荐**: SIMPLE 版本

---

## 🚀 一键执行命令

在 Supabase SQL Editor 中依次运行：

### Step 1: Backup
```sql
-- 复制并运行: migrations/00_backup_all_tables.sql
```

### Step 2: Drop Tables
```sql
-- 复制并运行: migrations/01_drop_unnecessary_tables.sql
```

### Step 3: Create Tables (SAFE)
```sql
-- 复制并运行: migrations/02_create_new_tables_SAFE.sql
```

### Step 4: Migrate Data (SIMPLE)
```sql
-- 复制并运行: migrations/03_rename_and_migrate_SIMPLE.sql
```

### Step 5: Create Indexes
```sql
-- 复制并运行: migrations/04_create_indexes.sql
```

### Step 6: Enable RLS
```sql
-- 复制并运行: migrations/05_enable_rls.sql
```

---

## ✅ 验证成功

运行以下查询检查：

```sql
-- 1. 检查表数量
SELECT COUNT(*) as total FROM information_schema.tables
WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
-- 应该约 27 张

-- 2. 检查新表
SELECT table_name FROM information_schema.tables
WHERE table_name IN ('categories', 'user_interactions', 'comments', 'news')
ORDER BY table_name;
-- 应该返回 4 行

-- 3. 检查 categories 数据
SELECT COUNT(*) FROM categories;
-- 应该有 11 条

-- 4. 检查 strategies 优化
SELECT column_name FROM information_schema.columns
WHERE table_name = 'strategies' AND column_name IN ('tags', 'search_vector');
-- 应该返回 2 行

-- 5. 检查 plays 视图
SELECT COUNT(*) FROM plays;
-- 应该返回策略数量
```

---

## 🐛 如果还是报错

### 方案 A: 跳过有问题的步骤
如果某个脚本报错，跳过它，继续下一个

### 方案 B: 手动执行关键操作
```sql
-- 1. 创建 categories 表
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  order_index INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 创建 user_interactions 表
CREATE TABLE IF NOT EXISTS user_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  content_type TEXT NOT NULL,
  content_id UUID NOT NULL,
  action TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, content_type, content_id, action)
);

-- 3. 重命名 collected_content（如果存在）
ALTER TABLE IF EXISTS collected_content RENAME TO news;

-- 完成！
```

---

## 📞 需要帮助？

如果遇到其他错误：
1. 复制完整的错误信息
2. 记下是哪个脚本的第几行
3. 查看该行的 SQL 语句

常见错误代码：
- `42703` = 列不存在
- `42601` = 语法错误
- `42P01` = 表不存在
- `23505` = 唯一约束冲突

---

**记住**: 使用 **SAFE** 和 **SIMPLE** 版本！ 🎯
