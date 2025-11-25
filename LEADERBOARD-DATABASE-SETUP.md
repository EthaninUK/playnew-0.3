# 排行榜数据库迁移 - Supabase 操作指南

## 📋 迁移概览

本次迁移将为 `strategies` 表添加排行榜所需的字段,包括:
- ✅ `hotness_score` - 热度评分
- ✅ `share_count` - 分享次数
- ✅ `comment_count` - 评论数
- ✅ `featured_order` - 编辑精选排序
- ✅ `last_hotness_update` - 最后更新时间

还将创建:
- ✅ `strategy_interactions` 表 - 用户互动记录
- ✅ 性能优化索引
- ✅ 热度分计算函数

---

## 🚀 方法一: 通过 Supabase Dashboard (推荐)

### 步骤:

1. **打开 Supabase Dashboard**
   - 访问: https://app.supabase.com
   - 选择您的项目 (cujpgrzjmmttysphjknu)

2. **进入 SQL Editor**
   - 左侧菜单 → SQL Editor
   - 点击 "New query"

3. **执行迁移脚本**
   - 复制文件内容: `sql/supabase-add-leaderboard-fields.sql`
   - 粘贴到 SQL Editor
   - 点击 "Run" 执行

4. **验证结果**
   - 运行验证脚本:
     ```bash
     node check-database-structure.js
     ```

---

## 🛠️ 方法二: 通过 Supabase CLI

### 前提条件:
```bash
# 安装 Supabase CLI
npm install -g supabase

# 登录
supabase login
```

### 执行迁移:
```bash
# 链接到您的项目
supabase link --project-ref cujpgrzjmmttysphjknu

# 执行迁移
supabase db push --db-url postgresql://postgres:[PASSWORD]@db.cujpgrzjmmttysphjknu.supabase.co:5432/postgres < sql/supabase-add-leaderboard-fields.sql
```

---

## 📊 迁移后验证

运行以下命令检查迁移结果:

```bash
# 检查数据库结构
node check-database-structure.js

# 验证迁移应用
node apply-leaderboard-migration.js
```

预期输出:
```
✅ strategies 表存在

排行榜字段检查:
  hotness_score: ✅ 已存在
  share_count: ✅ 已存在
  comment_count: ✅ 已存在
  featured_order: ✅ 已存在
```

---

## 🔍 迁移详情

### 新增字段:

| 字段名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `hotness_score` | DECIMAL(10,2) | 0 | 热度评分 |
| `share_count` | INTEGER | 0 | 分享次数 |
| `comment_count` | INTEGER | 0 | 评论数 |
| `featured_order` | INTEGER | NULL | 精选排序 |
| `last_hotness_update` | TIMESTAMPTZ | NULL | 最后更新时间 |

### 热度分计算公式:

```
hotness_score = (
  view_count × 0.3 +
  bookmark_count × 2.0 +
  comment_count × 1.5 +
  share_count × 3.0
) × decay_factor

其中:
decay_factor = max(0.5, 1.0 - age_days / 365)
// 新策略权重高,一年后衰减到50%
```

### 创建的索引:

```sql
- idx_strategies_hotness_score   (热度分排序)
- idx_strategies_apy_max          (APY排序)
- idx_strategies_bookmark_count   (收藏数排序)
- idx_strategies_view_count       (浏览量排序)
- idx_strategies_featured         (精选策略)
- idx_strategies_risk_apy         (风险+APY组合)
- idx_strategies_time_commitment  (时间投入排序)
```

---

## 🎯 初始化数据

迁移脚本会自动:
1. ✅ 为所有已发布策略计算初始热度分
2. ✅ 为已精选策略分配 `featured_order`
3. ✅ 创建 `strategy_interactions` 表及索引

---

## 🔧 实用函数

迁移后可使用的 PostgreSQL 函数:

### 1. 计算单个策略热度分
```sql
SELECT calculate_hotness_score('策略UUID');
```

### 2. 批量更新所有策略热度分
```sql
SELECT update_all_hotness_scores();
```

这些函数可以通过 Supabase Edge Function 或定时任务调用。

---

## ⚠️ 注意事项

1. **备份数据库** (可选但推荐)
   - 在 Supabase Dashboard → Database → Backups 中创建手动备份

2. **检查权限**
   - 确保使用 `service_role` key 执行迁移
   - 不要使用 `anon` key

3. **监控性能**
   - 迁移会创建多个索引,可能需要几秒到几分钟
   - 对于138个策略,预计耗时 < 10秒

4. **回滚方案**
   如需回滚,执行:
   ```sql
   ALTER TABLE strategies
   DROP COLUMN IF EXISTS hotness_score,
   DROP COLUMN IF EXISTS share_count,
   DROP COLUMN IF EXISTS comment_count,
   DROP COLUMN IF EXISTS featured_order,
   DROP COLUMN IF EXISTS last_hotness_update;

   DROP TABLE IF EXISTS strategy_interactions;
   ```

---

## 📞 问题排查

### 常见错误:

1. **"permission denied"**
   - 解决: 使用 service_role key,不要用 anon key

2. **"column already exists"**
   - 说明: 迁移已执行,跳过即可
   - 验证: 运行 `node check-database-structure.js`

3. **"syntax error"**
   - 检查: SQL文件是否完整复制
   - 确认: Supabase PostgreSQL 版本支持 (14+)

---

## ✅ 完成检查清单

- [ ] 在 Supabase Dashboard 执行 SQL 迁移
- [ ] 运行 `node check-database-structure.js` 验证
- [ ] 检查新字段是否存在
- [ ] 查看热度分 Top 10
- [ ] 确认索引创建成功
- [ ] 测试热度分计算函数

完成后即可开始开发排行榜 API 和前端页面! 🎉
