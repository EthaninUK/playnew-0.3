# 🗄️ 数据库迁移执行指南

**项目**: 币圈玩法收集录
**迁移日期**: 2025-10-20
**数据库**: Supabase PostgreSQL

---

## 📋 迁移概览

### 目标
- 从 44 张表精简到约 27 张核心表
- 删除日志和AI队列表（约 17 张）
- 重命名 `collected_content` 为 `news`
- 创建新的交互和分类表
- 启用行级安全（RLS）

### 预计时间
- 备份: 2-5 分钟
- 迁移: 5-10 分钟
- 总计: 10-15 分钟

---

## ⚠️ 重要提醒

### 执行前必读

1. **时间选择**: 建议在低峰期执行（如凌晨）
2. **备份确认**: 执行前确保有完整备份
3. **权限检查**: 需要数据库 `service_role` 权限
4. **测试环境**: 建议先在测试数据库上执行一遍
5. **回滚准备**: 准备好恢复脚本

### 风险评估

| 风险等级 | 说明 | 应对措施 |
|---------|------|----------|
| 🟢 低 | 删除空表和日志表 | 已备份，可恢复 |
| 🟡 中 | 重命名表 | 使用事务，失败自动回滚 |
| 🟢 低 | 创建新表 | 不影响现有数据 |
| 🟢 低 | 启用 RLS | 可随时禁用 |

---

## 🚀 执行步骤

### 步骤 0: 准备工作

#### 0.1 检查当前数据库状态

```bash
# 在本地运行检查脚本
npm run check-db
```

#### 0.2 下载当前数据（可选）

登录 Supabase Dashboard → Database → 选择表 → Export as CSV

或使用 pg_dump（如果有访问权限）:
```bash
pg_dump -h db.xxxxx.supabase.co \
  -U postgres \
  -d postgres \
  -f backup_before_migration.sql
```

---

### 步骤 1: 备份所有表 ✅

**文件**: `00_backup_all_tables.sql`
**用时**: 2-5 分钟

#### 执行方式

1. 登录 Supabase Dashboard
2. 进入 **SQL Editor**
3. 创建新查询
4. 复制 `00_backup_all_tables.sql` 内容
5. 点击 **Run** 执行

#### 验证备份

执行后应该看到：
```
✅ 备份完成！所有表已备份到 backups schema
📊 备份表命名格式: backups.[表名]_backup_20251020
```

检查备份:
```sql
SELECT * FROM pg_tables WHERE schemaname = 'backups';
```

应该看到约 25-30 张备份表。

---

### 步骤 2: 删除不必要的表 🗑️

**文件**: `01_drop_unnecessary_tables.sql`
**用时**: 1-2 分钟

#### 将删除的表

- 日志表（7张）: admin_logs, api_logs, audit_logs, error_logs, etc.
- AI队列（3张）: ai_enhancement_queue, ai_processing_queue, ai_usage_logs
- 采集器配置（1张）: collector_configs
- 其他配置表（6张）: feature_flags, version_history, etc.

#### 执行

在 SQL Editor 中运行 `01_drop_unnecessary_tables.sql`

#### 验证

执行后应该看到：
```
✅ 表清理完成！
   - 已删除约 17 张表
   - 剩余表数量: 27 张
   - 节省空间: 约 800KB+
```

---

### 步骤 3: 创建新表 📝

**文件**: `02_create_new_tables.sql`
**用时**: 2-3 分钟

#### 将创建的表

1. **categories** - 统一分类系统（合并 category_l1/l2_config）
2. **user_interactions** - 统一用户交互（点赞、收藏、关注）
3. **comments** - 评论系统（如果不用 Giscus）
4. **plays** - 玩法库视图（strategies 的简化视图）

#### 执行

在 SQL Editor 中运行 `02_create_new_tables.sql`

#### 验证

检查新表:
```sql
SELECT table_name,
       (SELECT COUNT(*) FROM information_schema.columns
        WHERE table_name = t.table_name) as columns
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_name IN ('categories', 'user_interactions', 'comments')
ORDER BY table_name;
```

刷新视图:
```sql
SELECT COUNT(*) FROM plays; -- 应该显示 strategies 中已发布的数量
```

---

### 步骤 4: 重命名和迁移数据 🔄

**文件**: `03_rename_and_migrate.sql`
**用时**: 2-3 分钟

#### 主要操作

1. `collected_content` → `news`
2. 合并 `category_l1/l2_config` → `categories`（已在步骤3完成）
3. 合并 `system_config` + `system_settings` → `app_config`
4. 优化 `strategies` 表（添加全文搜索）
5. 优化 `service_providers` 表（添加全文搜索）

#### 执行

在 SQL Editor 中运行 `03_rename_and_migrate.sql`

#### 验证

检查表重命名:
```sql
-- 应该存在 news 表
SELECT COUNT(*) FROM news;

-- 应该不存在 collected_content 表
SELECT * FROM information_schema.tables
WHERE table_name = 'collected_content'; -- 应该返回空
```

---

### 步骤 5: 创建性能优化索引 🚀

**文件**: `04_create_indexes.sql`
**用时**: 2-3 分钟

#### 将创建的索引

- 单列索引（快速查询）
- 复合索引（常见查询组合）
- GIN 索引（数组和全文搜索）
- 部分索引（节省空间）

#### 执行

在 SQL Editor 中运行 `04_create_indexes.sql`

#### 验证

检查索引:
```sql
SELECT
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('strategies', 'news', 'service_providers')
ORDER BY tablename, indexname;
```

---

### 步骤 6: 启用行级安全 🔒

**文件**: `05_enable_rls.sql`
**用时**: 2-3 分钟

#### RLS 策略概览

| 表 | 策略 |
|----|------|
| users | 用户只能访问自己的数据 |
| strategies | 已发布公开，草稿私有 |
| news | 编辑权限控制 |
| service_providers | 提交者可编辑 |
| user_interactions | 用户私有 |
| comments | 已发布公开 |
| 基础数据表 | 全部公开只读 |

#### 执行

在 SQL Editor 中运行 `05_enable_rls.sql`

#### 验证

检查 RLS 状态:
```sql
SELECT
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

检查策略:
```sql
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

---

## ✅ 迁移完成后的验证

### 1. 检查表数量

```sql
SELECT COUNT(*) as total_tables
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE';
-- 应该约 27 张表
```

### 2. 检查数据完整性

```sql
-- 检查核心数据
SELECT
  'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'strategies', COUNT(*) FROM strategies
UNION ALL
SELECT 'news', COUNT(*) FROM news
UNION ALL
SELECT 'service_providers', COUNT(*) FROM service_providers
UNION ALL
SELECT 'user_interactions', COUNT(*) FROM user_interactions;
```

### 3. 测试查询性能

```sql
-- 测试全文搜索
SELECT id, title
FROM strategies
WHERE search_vector @@ to_tsquery('simple', 'defi | airdrop')
LIMIT 10;

-- 测试视图
SELECT * FROM plays LIMIT 10;

-- 测试索引
EXPLAIN ANALYZE
SELECT * FROM strategies
WHERE category = 'defi'
  AND status = 'published'
ORDER BY published_at DESC
LIMIT 20;
```

### 4. 测试 RLS

```sql
-- 测试匿名访问
SET ROLE anon;
SELECT COUNT(*) FROM strategies; -- 应该只看到已发布的
RESET ROLE;

-- 测试认证用户访问（需要设置 JWT）
-- 这个在应用中测试
```

---

## 🔄 回滚方案

如果迁移出现问题，可以回滚：

### 快速回滚（推荐）

```sql
BEGIN;

-- 1. 禁用所有 RLS
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN SELECT tablename FROM pg_tables WHERE schemaname = 'public'
  LOOP
    EXECUTE 'ALTER TABLE ' || r.tablename || ' DISABLE ROW LEVEL SECURITY';
  END LOOP;
END $$;

-- 2. 恢复重命名的表
ALTER TABLE IF EXISTS news RENAME TO collected_content;

-- 3. 从备份恢复数据
-- 根据需要恢复特定表
-- INSERT INTO table_name SELECT * FROM backups.table_name_backup_20251020;

COMMIT;
```

### 完整回滚

如果需要完全恢复到迁移前状态：

1. 从备份 schema 恢复所有表
2. 删除新创建的表
3. 恢复旧的配置表

参考 `99_rollback.sql`（如需要可以生成）

---

## 📊 迁移后优化

### 1. 刷新物化视图

```sql
SELECT refresh_plays_view();
```

设置定时刷新（每小时）:
```sql
-- 需要 pg_cron 扩展
SELECT cron.schedule(
  'refresh-plays-view',
  '0 * * * *',
  $$SELECT refresh_plays_view();$$
);
```

### 2. 更新统计信息

```sql
VACUUM ANALYZE;
```

### 3. 同步到 Meilisearch

```bash
# 在本地运行同步脚本
npm run sync-to-meilisearch
```

---

## 🐛 常见问题

### Q1: 执行脚本时出现 "permission denied"

**A**: 确保使用的是 `service_role` key，而不是 `anon` key。

### Q2: 表重命名失败："relation already exists"

**A**: 可能 `news` 表已经存在。检查并手动处理:
```sql
SELECT * FROM information_schema.tables
WHERE table_name IN ('news', 'collected_content');
```

### Q3: RLS 导致查询失败

**A**: 临时禁用 RLS 进行调试:
```sql
ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;
```

### Q4: 物化视图刷新失败

**A**: 删除并重新创建:
```sql
DROP MATERIALIZED VIEW IF EXISTS plays;
-- 然后重新运行 02_create_new_tables.sql 中的视图创建部分
```

---

## 📞 需要帮助？

如果遇到问题：

1. 检查 SQL Editor 的错误信息
2. 查看 Supabase Dashboard 的 Logs
3. 参考 [DATABASE_ANALYSIS.md](../DATABASE_ANALYSIS.md)
4. 联系技术支持

---

## 📝 迁移检查清单

执行迁移时，请按顺序勾选：

- [ ] **准备工作**
  - [ ] 已在测试环境测试过
  - [ ] 已选择低峰期时间
  - [ ] 已通知团队成员
  - [ ] 已准备回滚方案

- [ ] **执行备份**
  - [ ] 运行 00_backup_all_tables.sql
  - [ ] 验证备份表已创建
  - [ ] 记录备份表数量: _____

- [ ] **删除表**
  - [ ] 运行 01_drop_unnecessary_tables.sql
  - [ ] 验证删除成功
  - [ ] 记录剩余表数量: _____

- [ ] **创建新表**
  - [ ] 运行 02_create_new_tables.sql
  - [ ] 验证新表已创建
  - [ ] 测试视图查询

- [ ] **迁移数据**
  - [ ] 运行 03_rename_and_migrate.sql
  - [ ] 验证表重命名成功
  - [ ] 检查数据完整性

- [ ] **创建索引**
  - [ ] 运行 04_create_indexes.sql
  - [ ] 验证索引已创建
  - [ ] 测试查询性能

- [ ] **启用 RLS**
  - [ ] 运行 05_enable_rls.sql
  - [ ] 验证 RLS 策略
  - [ ] 测试权限控制

- [ ] **后续优化**
  - [ ] 刷新物化视图
  - [ ] 运行 VACUUM ANALYZE
  - [ ] 同步到 Meilisearch
  - [ ] 更新应用代码

- [ ] **验证和测试**
  - [ ] 前端功能测试
  - [ ] API 接口测试
  - [ ] 性能测试
  - [ ] 用户权限测试

---

**迁移执行人**: _______________
**执行时间**: _______________
**完成时间**: _______________
**状态**: ⭕ 成功 / ❌ 失败 / 🔄 部分成功

---

**🎉 祝迁移顺利！**
