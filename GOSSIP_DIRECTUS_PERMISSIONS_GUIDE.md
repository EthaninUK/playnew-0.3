# 币圈八卦 Directus 字段权限配置指南

## 问题现象

访问 `/gossip` 页面时出现以下错误:
```
Error: You don't have permission to access field "hotness_score" in collection "news"
```

这是因为我们在数据库中添加了新的八卦字段,但 Directus 还没有配置这些字段的访问权限。

## 解决方案

### 方案 1: 通过 Directus 管理面板配置 (推荐)

1. **登录 Directus 管理面板**
   - 访问: http://localhost:8055
   - 使用管理员账号登录 (the_uk1@outlook.com)

2. **进入权限设置**
   - 点击左侧菜单 "Settings" (设置图标)
   - 点击 "Roles & Permissions" (角色与权限)

3. **配置 Public 角色**
   - 找到 "Public" 角色并点击进入
   - 找到 "news" 集合的权限设置

4. **添加字段权限**
   - 在 news 集合的 "Read" (读取) 权限中
   - 确保以下字段被勾选允许访问:
     - ✅ `credibility_score` (可信度分数)
     - ✅ `hotness_score` (热度分数)
     - ✅ `verification_status` (求证状态)
     - ✅ `gossip_tags` (八卦标签)
     - ✅ `likes_count` (点赞数)
     - ✅ `comments_count` (评论数)

   **最简单的方式**: 直接勾选 "All Fields" (所有字段) 或 "*"

5. **保存设置**
   - 点击右上角的 "Save" 按钮

### 方案 2: 通过 SQL 直接配置 (高级)

如果你熟悉 SQL,可以在 Supabase SQL 编辑器中执行:

```sql
-- 查找 Public 角色的 news 读取权限
SELECT * FROM directus_permissions
WHERE collection = 'news'
AND action = 'read'
AND role IN (
  SELECT id FROM directus_roles WHERE name = 'Public'
);

-- 如果找到了权限记录,更新它允许所有字段
UPDATE directus_permissions
SET fields = '*'
WHERE collection = 'news'
AND action = 'read'
AND role IN (
  SELECT id FROM directus_roles WHERE name = 'Public'
);

-- 如果没有找到权限记录,需要创建一个
-- (请先在 Directus 管理面板中确认 Public 角色的 ID)
INSERT INTO directus_permissions (role, collection, action, fields, permissions)
VALUES (
  '<PUBLIC_ROLE_ID>',
  'news',
  'read',
  '*',
  '{"status": {"_eq": "published"}}'::jsonb
);
```

### 方案 3: 配置 gossip_interactions 表权限

如果需要用户登录后进行点赞/评论/求证操作,还需要配置:

1. **gossip_interactions 表的权限**:
   - Public 角色: Read (读取) 权限 - 所有字段
   - Authenticated 角色:
     - Read (读取) 权限 - 所有字段
     - Create (创建) 权限 - 允许用户创建自己的互动记录
     - Update (更新) 权限 - 仅允许更新自己的记录
     - Delete (删除) 权限 - 仅允许删除自己的记录

2. **权限规则示例**:
   ```json
   // Create/Update/Delete 的权限规则
   {
     "user_id": {
       "_eq": "$CURRENT_USER"
     }
   }
   ```

## 验证配置是否成功

配置完成后,在浏览器中访问以下 URL 测试:

```bash
# 测试八卦字段是否可访问
curl -s 'http://localhost:8055/items/news?filter[news_type][_eq]=gossip&limit=1&fields=id,hotness_score,credibility_score,verification_status,gossip_tags,likes_count,comments_count'
```

如果返回数据而不是错误,说明配置成功。

然后刷新网站: http://localhost:3000/gossip

## 故障排查

如果配置后仍然无法访问:

1. **检查 Directus 缓存**
   - 在 Directus 管理面板中,进入 Settings > Project Settings
   - 点击 "Clear Cache" 清除缓存

2. **重启 Directus 服务**
   ```bash
   docker-compose restart directus
   ```

3. **检查字段是否在 Directus 中可见**
   - 在 Directus 管理面板中
   - 进入 "Data Model" > "news" 集合
   - 确认新字段已经显示在字段列表中

4. **查看 Directus 日志**
   ```bash
   docker-compose logs directus --tail=50
   ```

## 需要帮助?

如果遇到问题,请提供:
- 错误信息的完整截图
- Directus 版本号
- news 集合的权限配置截图
