# 📖 Directus 权限配置详细步骤(带截图说明)

## 问题现状
- ✅ 16条八卦数据已创建
- ✅ 页面和代码完全正常
- ❌ Public 角色无法访问新字段 (`hotness_score`, `credibility_score` 等)
- ❌ 导致前端显示"暂无八卦内容"

---

## 🎯 解决方案A: Directus 管理面板配置(推荐新手)

### 步骤1: 进入 Directus 管理面板
1. 打开浏览器访问: `http://localhost:8055`
2. 登录
   - 邮箱: `the_uk1@outlook.com`
   - 密码: `Mygcdjmyxzg2026!`

### 步骤2: 进入 Settings (设置)
1. 点击左下角的 **⚙️ 图标**(Settings/设置)
2. 或者点击侧边栏的"Settings"菜单项

### 步骤3: 打开 Roles & Permissions (角色与权限)
1. 在 Settings 页面中,找到 **"Roles & Permissions"**(角色与权限)
2. 点击进入

### 步骤4: 选择 Public 角色
1. 在角色列表中,找到 **"Public"**(公开策略/公开)
2. 点击进入 Public 角色的权限配置页面

### 步骤5: 找到 news 集合
1. 在权限列表中,找到 **"news"** 这一行
2. 你应该能看到右侧有几个图标按钮:
   - 📝 创建 (Create)
   - 👁️ 查看 (Read)
   - ✏️ 更新 (Update)
   - 🗑️ 删除 (Delete)

### 步骤6: 配置 Read (查看) 权限 ⚠️ 关键步骤
1. 点击 **👁️ "查看" / "Read"** 图标(应该是蓝色高亮的,表示已启用)
2. **重要**: 这会弹出或展开一个详细配置面板

### 步骤7: 配置字段权限 ⚠️ 最关键
在弹出的配置面板中:

1. 找到 **"Field Permissions"** 或 **"字段权限"** 部分
2. 你会看到两个选项:
   - ✅ **"All Fields"** 或 **"所有字段"** 或 **"*"**
   - 📝 **"Custom Fields"** 或 **"自定义字段"**

#### 方法A: 选择 "All Fields"(最简单)
- 选择/勾选 **"All Fields"** 或 **"*"**
- 这会允许访问所有字段(包括新增的八卦字段)
- **点击保存**

#### 方法B: 手动勾选字段(如果没有All Fields选项)
如果没有 "All Fields" 选项,则需要手动勾选这些字段:

**必须勾选的八卦字段**:
- ✅ `credibility_score` (可信度分数)
- ✅ `hotness_score` (热度分数)
- ✅ `verification_status` (求证状态)
- ✅ `gossip_tags` (八卦标签)
- ✅ `likes_count` (点赞数)
- ✅ `comments_count` (评论数)

**建议也勾选的常用字段**(如果还没勾选):
- ✅ `id`
- ✅ `title`
- ✅ `content`
- ✅ `summary`
- ✅ `ai_summary`
- ✅ `source`
- ✅ `source_type`
- ✅ `content_published_at`
- ✅ `published_at`
- ✅ `status`
- ✅ `news_type`
- ✅ `category`
- ✅ `slug`
- ✅ `url`
- ✅ `view_count`

### 步骤8: 保存配置
1. 点击右上角的 **✓ "Save"**(保存)按钮
2. 或者点击 **"√"** 图标
3. 确保看到"保存成功"的提示

### 步骤9: 清除缓存(可选但推荐)
1. 在 Directus 管理面板中
2. 进入 **Settings > Project Settings**(设置 > 项目设置)
3. 找到 **"Clear Cache"**(清除缓存)按钮
4. 点击清除

### 步骤10: 验证配置
在终端运行测试命令:

```bash
curl -s 'http://localhost:8055/items/news?filter[news_type][_eq]=gossip&filter[status][_eq]=published&limit=1&fields=hotness_score,credibility_score' | head -20
```

**如果成功**,你应该看到返回的JSON数据包含 `hotness_score` 和 `credibility_score` 字段。

**如果还是403错误**,继续看方案B。

---

## 🎯 解决方案B: 通过 Supabase SQL 直接配置(高级用户)

如果方案A不奏效,使用SQL直接修复权限:

### 步骤1: 登录 Supabase
1. 访问 https://supabase.com
2. 登录你的账号
3. 选择 `directus_play` 项目

### 步骤2: 打开 SQL编辑器
1. 点击左侧菜单的 **"SQL Editor"**(SQL编辑器)
2. 点击 **"New Query"**(新建查询)

### 步骤3: 执行 SQL
复制并执行这个 SQL 文件的内容:
📄 `/Users/m1/PlayNew_0.3/sql/fix-public-permissions-for-gossip-fields.sql`

或者直接执行这段SQL:

```sql
-- 更新 Public 角色的 news 读取权限,允许访问所有字段
UPDATE directus_permissions
SET fields = '*'
WHERE collection = 'news'
  AND action = 'read'
  AND role IN (SELECT id FROM directus_roles WHERE name = 'Public');

-- 验证
SELECT
  r.name as role_name,
  p.collection,
  p.action,
  p.fields
FROM directus_permissions p
JOIN directus_roles r ON p.role = r.id
WHERE p.collection = 'news'
  AND r.name = 'Public';
```

### 步骤4: 重启 Directus
在终端执行:
```bash
docker-compose restart directus
```

等待约10秒让Directus重新启动。

---

## 🎯 解决方案C: 重新创建 Directus 权限(终极方案)

如果方案A和B都不行,可能是权限记录损坏,需要重建:

### 在 Supabase SQL编辑器中执行:

```sql
-- 1. 获取 Public 角色 ID
SELECT id, name FROM directus_roles WHERE name = 'Public';
-- 假设返回: 3ed2965e-10a4-4fe4-b84d-905cc22bccd9

-- 2. 删除现有的news读取权限
DELETE FROM directus_permissions
WHERE collection = 'news'
  AND action = 'read'
  AND role = '3ed2965e-10a4-4fe4-b84d-905cc22bccd9'; -- 替换为实际的Public role ID

-- 3. 重新创建权限,允许所有字段
INSERT INTO directus_permissions (role, collection, action, fields, permissions)
VALUES (
  '3ed2965e-10a4-4fe4-b84d-905cc22bccd9', -- 替换为实际的Public role ID
  'news',
  'read',
  '*', -- 允许所有字段
  '{"status": {"_eq": "published"}}'::jsonb
);

-- 4. 验证
SELECT * FROM directus_permissions
WHERE collection = 'news' AND action = 'read';
```

然后重启 Directus:
```bash
docker-compose restart directus
```

---

## ✅ 如何确认配置成功?

### 方法1: 测试 API
在终端运行:
```bash
curl -s 'http://localhost:8055/items/news?filter[news_type][_eq]=gossip&filter[status][_eq]=published&limit=1&fields=id,hotness_score'
```

**成功的响应**: 包含 `hotness_score` 字段
```json
{
  "data": [
    {
      "id": "xxx",
      "hotness_score": 123
    }
  ]
}
```

**失败的响应**: 403 Forbidden
```json
{
  "errors": [
    {
      "message": "You don't have permission to access field \"hotness_score\"..."
    }
  ]
}
```

### 方法2: 访问八卦页面
打开浏览器访问:
```
http://localhost:3000/gossip
```

**成功**: 看到 16 条八卦内容卡片
**失败**: 显示"暂无八卦内容"

---

## 🐛 常见问题排查

### Q1: 我点了"查看"按钮,但没有看到字段权限设置
**A**: 可能需要:
1. 点击"查看"按钮右侧的 **"..."** (更多选项)
2. 或者点击"查看"按钮后向下滚动
3. 或者尝试点击整个 news 行,进入详细配置页面

### Q2: 我勾选了字段,但还是403错误
**A**: 尝试:
1. 清除 Directus 缓存(Settings > Clear Cache)
2. 重启 Directus: `docker-compose restart directus`
3. 硬刷新浏览器: Ctrl+Shift+R (Windows) 或 Cmd+Shift+R (Mac)

### Q3: 我找不到"All Fields"选项
**A**:
1. 可能叫"*"或"所有字段"
2. 或者直接手动勾选所有必需的字段
3. 或者使用 SQL 方案(方案B)

### Q4: SQL方案执行后还是不行
**A**:
1. 确认 SQL 执行成功(没有报错)
2. 确认重启了 Directus
3. 等待30秒让Directus完全启动
4. 查看 Directus 日志: `docker-compose logs directus --tail=50`

---

## 📞 仍然需要帮助?

如果以上所有方案都不奏效,请提供:
1. Directus 管理面板中 Public 角色的 news 权限截图
2. 执行这个命令的输出:
   ```bash
   node /Users/m1/PlayNew_0.3/check-required-fields.js
   ```
3. Directus 日志:
   ```bash
   docker-compose logs directus --tail=100
   ```

祝你配置成功! 🎉
