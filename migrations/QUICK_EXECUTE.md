# ⚡ 快速执行指南

**适用人群**: 熟悉 SQL 和数据库操作的开发者
**执行时间**: 约 10-15 分钟

---

## 🚀 一键执行（推荐）

### 步骤 1: 登录 Supabase Dashboard

访问: https://supabase.com/dashboard/project/YOUR_PROJECT_ID

### 步骤 2: 进入 SQL Editor

左侧菜单 → **SQL Editor**

### 步骤 3: 按顺序执行以下脚本

#### ✅ 脚本 1: 备份（必须）
```
复制文件: 00_backup_all_tables.sql
粘贴到 SQL Editor → 点击 Run
等待完成（约 2-3 分钟）
```

#### ✅ 脚本 2: 删除表
```
复制文件: 01_drop_unnecessary_tables.sql
粘贴到 SQL Editor → 点击 Run
等待完成（约 1 分钟）
```

#### ✅ 脚本 3: 创建新表
```
复制文件: 02_create_new_tables.sql
粘贴到 SQL Editor → 点击 Run
等待完成（约 2-3 分钟）
```

#### ✅ 脚本 4: 迁移数据
```
复制文件: 03_rename_and_migrate.sql
粘贴到 SQL Editor → 点击 Run
等待完成（约 2-3 分钟）
```

#### ✅ 脚本 5: 创建索引
```
复制文件: 04_create_indexes.sql
粘贴到 SQL Editor → 点击 Run
等待完成（约 2-3 分钟）
```

#### ✅ 脚本 6: 启用 RLS
```
复制文件: 05_enable_rls.sql
粘贴到 SQL Editor → 点击 Run
等待完成（约 2-3 分钟）
```

---

## ✅ 验证

执行完成后，运行以下查询验证：

```sql
-- 1. 检查表数量（应该约 27 张）
SELECT COUNT(*) FROM information_schema.tables
WHERE table_schema = 'public' AND table_type = 'BASE TABLE';

-- 2. 检查核心数据
SELECT 'users' as table_name, COUNT(*) FROM users
UNION ALL SELECT 'strategies', COUNT(*) FROM strategies
UNION ALL SELECT 'news', COUNT(*) FROM news
UNION ALL SELECT 'service_providers', COUNT(*) FROM service_providers;

-- 3. 检查视图
SELECT COUNT(*) FROM plays;

-- 4. 检查 RLS
SELECT tablename, rowsecurity FROM pg_tables
WHERE schemaname = 'public' ORDER BY tablename;
```

---

## 🎉 完成！

如果所有验证都通过，迁移成功！

### 下一步

1. 刷新物化视图:
```sql
SELECT refresh_plays_view();
```

2. 优化数据库:
```sql
VACUUM ANALYZE;
```

3. 更新应用代码以使用新的表结构

---

## ❌ 如果出错

1. 查看 SQL Editor 的错误信息
2. 参考 [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) 的详细说明
3. 如需回滚，从 backups schema 恢复数据

---

**需要帮助？** 查看完整文档: [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)
