# Directus 权限配置指南

由于 Directus API 对权限配置有严格要求，建议通过 UI 手动配置权限。以下是详细步骤：

## 方法 1: 通过 UI 配置 (推荐)

### 步骤 1: 访问权限设置

1. 打开 Directus: http://localhost:8055/admin
2. 点击左下角的 **Settings** (齿轮图标 ⚙️)
3. 点击 **Access Control** (访问控制)

### 步骤 2: 配置 Public 角色

1. 在 Roles 列表中找到 **Public** 角色
2. 点击 **Public** 进入权限配置页面

### 步骤 3: 为每个集合添加读取权限

对于以下集合，添加 **READ** 权限:

#### 公开可读的集合

| 集合 | 操作 | 说明 |
|------|------|------|
| **strategies** | ✅ Read | 所有人可以查看玩法 |
| **news** | ✅ Read | 所有人可以查看资讯 |
| **service_providers** | ✅ Read | 所有人可以查看服务商 |
| **categories** | ✅ Read | 所有人可以查看分类 |
| **tags** | ✅ Read | 所有人可以查看标签 |
| **chains** | ✅ Read | 所有人可以查看区块链 |
| **protocols** | ✅ Read | 所有人可以查看协议 |

**具体操作:**

1. 点击 **Public** 角色右侧的 ➕ 或 **Add Permission**
2. 选择 Collection (例如: strategies)
3. 勾选 **Read** 操作
4. 在 Field Permissions 中:
   - 选择 **All Fields** 或手动选择需要公开的字段
   - 建议选择 All Fields 简化配置
5. 在 Item Permissions (可选):
   - 留空表示允许读取所有项目
   - 或添加过滤条件,例如只允许读取 `status = published` 的内容
6. 点击 **Save**

重复以上步骤为每个集合添加读取权限。

#### 需要认证的集合

| 集合 | 说明 |
|------|------|
| **users** | ❌ 不配置 Public 权限,保持私有 |
| **comments** | ❌ 不配置 Public 权限,需要登录后才能读写 |
| **user_interactions** | ❌ 不配置 Public 权限,需要登录后才能读写 |

### 步骤 4: 配置过滤规则 (可选但推荐)

对于 **strategies** 和 **news**,建议添加过滤规则只显示已发布的内容:

1. 编辑 strategies 的 Read 权限
2. 在 **Item Permissions** 部分点击 **Set Custom Permissions**
3. 添加过滤条件:
   ```json
   {
     "status": {
       "_eq": "published"
     }
   }
   ```
4. 点击 **Save**

对 news 集合做同样的配置。

### 步骤 5: 测试 API 访问

配置完成后,在终端测试:

```bash
# 测试 categories (应该返回数据或空数组,不应该是 FORBIDDEN 错误)
curl http://localhost:8055/items/categories

# 测试 strategies
curl http://localhost:8055/items/strategies?limit=5

# 测试 news
curl http://localhost:8055/items/news?limit=5
```

如果配置正确,你应该看到 JSON 数据而不是 "FORBIDDEN" 错误。

---

## 方法 2: 创建测试数据

由于 categories 目前是空的,我们可以先添加一些测试数据:

### 通过 Directus UI 添加

1. 访问 http://localhost:8055/admin/content/categories
2. 点击右上角的 **Create Item** (创建项目)
3. 填写数据:
   - **name**: DeFi
   - **slug**: defi
   - **type**: play
   - **order_index**: 1
   - **is_active**: true
4. 点击 **Save**

重复添加更多分类:
- name: 空投, slug: airdrop, type: play
- name: NFT, slug: nft, type: play
- name: 市场分析, slug: market-analysis, type: news

### 通过 API 添加 (需要认证)

```bash
# 1. 先登录获取 token
TOKEN=$(curl -s -X POST http://localhost:8055/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"the_uk1@outlook.com","password":"Mygcdjmyxzg2026!"}' \
  | grep -o '"access_token":"[^"]*"' \
  | cut -d'"' -f4)

# 2. 使用 token 创建分类
curl -X POST http://localhost:8055/items/categories \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "DeFi",
    "slug": "defi",
    "type": "play",
    "order_index": 1,
    "is_active": true
  }'
```

---

## 方法 3: 从数据库导入现有数据

如果你的 Supabase 数据库中已经有分类数据,我们可以通过 SQL 查看:

```sql
-- 查看 categories 表的数据
SELECT * FROM categories LIMIT 10;

-- 查看 strategies 表的数据
SELECT id, title, status, created_at FROM strategies LIMIT 10;

-- 查看 news 表的数据
SELECT id, title, status, created_at FROM news LIMIT 10;
```

如果有数据,Directus 应该能直接显示。如果看不到数据,可能是:
1. 表确实是空的
2. 权限配置不正确
3. Directus 缓存问题 (重启容器解决)

---

## 快速检查清单

配置完成后,检查:

- [ ] 访问 http://localhost:8055/admin/settings/roles-and-permissions
- [ ] Public 角色有 7 个 Read 权限 (strategies, news, service_providers, categories, tags, chains, protocols)
- [ ] 测试 API: `curl http://localhost:8055/items/categories` 不返回 FORBIDDEN
- [ ] Directus Content 界面能看到所有集合
- [ ] 至少有一些测试数据在 categories 或其他集合中

---

## 故障排除

### 问题 1: API 仍然返回 FORBIDDEN

**解决方案:**
1. 确认 Public 角色的权限已保存
2. 重启 Directus 容器: `docker-compose restart directus`
3. 清除浏览器缓存并重新登录

### 问题 2: 看不到任何数据

**解决方案:**
1. 检查数据库中是否有数据: `node verify-db-tables.js`
2. 在 Directus UI 中手动创建几条测试数据
3. 检查 Item Permissions 过滤条件是否太严格

### 问题 3: 字段显示不完整

**解决方案:**
1. 编辑权限,确保 Field Permissions 选择了 **All Fields**
2. 或手动勾选需要显示的字段

---

## 下一步

配置好权限后,你就可以:

1. **开发 Next.js 前端**
   ```typescript
   // app/lib/directus.ts
   import { createDirectus, rest } from '@directus/sdk'

   export const directus = createDirectus('http://localhost:8055').with(rest())

   // app/strategies/page.tsx
   import { directus } from '@/lib/directus'

   const strategies = await directus.request(
     readItems('strategies', {
       filter: { status: { _eq: 'published' } },
       limit: 10
     })
   )
   ```

2. **配置 Meilisearch 搜索引擎**

3. **设置 Webhooks 自动同步数据**

祝配置顺利! 🎉
