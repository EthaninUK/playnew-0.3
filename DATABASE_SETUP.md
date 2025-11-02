# 数据库设置指南

## 第一步：配置 Supabase 连接

### 1. 复制环境变量模板

```bash
cp .env.local.example .env.local
```

### 2. 获取 Supabase 凭证

登录你的 Supabase Dashboard，获取以下信息：

1. **Project URL**:
   - 路径: Settings → API → Project URL
   - 格式: `https://xxxxxx.supabase.co`

2. **anon (public) key**:
   - 路径: Settings → API → Project API keys → anon public
   - 这是公开的密钥，可以在前端使用

3. **service_role key**:
   - 路径: Settings → API → Project API keys → service_role
   - ⚠️ **重要**: 这是私密密钥，只能在服务端使用，永远不要暴露到前端！

### 3. 填写 .env.local

打开 `.env.local` 文件，填入你的信息：

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 第二步：安装依赖

```bash
npm install
```

---

## 第三步：检查现有数据库结构

我们需要了解你现有的 40+ 张表的结构。有两种方法：

### 方法 1: 使用自动检查脚本（推荐）

```bash
npm run check-db
```

这个脚本会：
- ✅ 测试 Supabase 连接
- 📋 自动发现所有表
- 📊 统计每张表的记录数
- 💾 生成报告文件 `database-report.json`

### 方法 2: 手动在 Supabase Dashboard 查询

如果自动脚本无法完整列出所有表，请按以下步骤操作：

1. 登录 Supabase Dashboard
2. 进入 **SQL Editor**
3. 运行以下查询：

```sql
-- 查询所有表
SELECT
  table_name,
  (SELECT COUNT(*)
   FROM information_schema.columns
   WHERE table_schema = 'public'
   AND table_name = t.table_name) as column_count,
  (SELECT COUNT(*)
   FROM information_schema.table_constraints
   WHERE table_schema = 'public'
   AND table_name = t.table_name
   AND constraint_type = 'FOREIGN KEY') as fk_count
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

4. 将结果复制出来（可以导出为 CSV）

---

## 第四步：获取每张表的详细结构

运行这个查询获取所有表的列信息：

```sql
SELECT
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;
```

---

## 第五步：分享给我

请提供以下信息：

### 选项 A: 如果自动脚本成功运行

分享给我：
1. 终端输出的表列表
2. `database-report.json` 文件内容

### 选项 B: 如果使用手动查询

分享给我：
1. 所有表名列表
2. 每张表的用途说明（如果你记得的话）
3. 哪些表有数据，哪些是空的

---

## 接下来我会做什么

收到你的数据库信息后，我会：

1. ✅ **分析表结构** - 识别哪些表对项目有用
2. 🗑️ **识别可删除的表** - 不需要的表
3. ➕ **识别需要新增的表** - 项目缺少的表
4. 🔄 **识别需要修改的表** - 需要调整结构的表
5. 📝 **生成迁移脚本** - 自动化的 SQL 脚本来执行所有更改
6. 🧹 **生成数据清理脚本** - 清空不需要的数据

---

## 常见问题

### Q: 我的数据会被删除吗？

A: 不会！我们会：
1. 先生成备份脚本
2. 然后生成预览脚本（显示将要做什么）
3. 最后由你确认后才执行

### Q: 如果我想保留所有数据怎么办？

A: 完全可以！我们可以：
1. 只删除空表
2. 保留所有有数据的表
3. 只新增必要的表

### Q: 表结构调整会影响现有数据吗？

A: 我们会：
1. 使用安全的迁移策略
2. 先添加新列（带默认值）
3. 再迁移数据
4. 最后才删除旧列

---

## 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量
cp .env.local.example .env.local
# 然后编辑 .env.local 填入你的 Supabase 信息

# 3. 检查数据库
npm run check-db

# 4. 将结果分享给我
```

准备好了吗？请先完成上面的步骤，然后把结果分享给我！ 🚀
