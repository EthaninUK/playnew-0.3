# Directus 配置指南

完成 Directus 安装后，需要在管理面板中配置 Collections 和权限。

## 🎯 安装步骤

### 1. 运行安装脚本

```bash
./directus-setup.sh
```

这会：
- ✅ 创建 directus-backend 目录
- ✅ 安装 Directus 和依赖
- ✅ 生成配置文件 (.env)
- ✅ 创建随机密钥

### 2. 配置 Supabase 连接

编辑 `directus-backend/.env`：

```bash
cd directus-backend
nano .env  # 或使用 VS Code: code .env
```

**必须修改的配置：**

```env
# 从 Supabase Dashboard > Settings > Database 获取
DB_HOST=db.xxxxxxxxxxxxx.supabase.co
DB_PASSWORD=your-supabase-password

# 设置管理员账号
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=YourSecurePassword123!
```

### 3. Bootstrap Directus

```bash
npx directus bootstrap
```

这会：
- 创建 Directus 系统表 (directus_users, directus_collections 等)
- 创建管理员账号
- 初始化配置

### 4. 启动 Directus

```bash
npm start
```

访问：http://localhost:8055

## 📊 Collections 配置

登录 Directus 后，需要配置 Collections 来映射你的 Supabase 表。

### 核心 Collections

#### 1. Strategies（玩法库）

**Settings > Data Model > Create Collection from Existing Table**

选择 `strategies` 表，配置字段：

| 字段 | 类型 | 显示名称 | Interface | 配置 |
|------|------|----------|-----------|------|
| id | UUID | ID | Input (readonly) | Primary Key |
| title | String | 标题 | Input | Required |
| slug | String | URL别名 | Input | Unique |
| content | Text | 内容 | WYSIWYG | Rich text editor |
| category | String | 分类 | Dropdown | Options: airdrop, defi, nft, gamefi, etc. |
| tags | Array | 标签 | Tags | Multiple |
| status | String | 状态 | Dropdown | draft/published/archived |
| author_id | UUID | 作者 | User (M2O) | Relation to users |
| published_at | Timestamp | 发布时间 | Datetime | |
| view_count | Integer | 浏览数 | Input | Default: 0 |
| created_at | Timestamp | 创建时间 | Datetime (readonly) | |
| updated_at | Timestamp | 更新时间 | Datetime (readonly) | |

**Display Template:** `{{title}}`

**Advanced Settings:**
- Archive: Enable soft delete
- Sort Field: `published_at` (DESC)
- Preview URL: `http://localhost:3000/plays/{{slug}}`

#### 2. News（资讯）

选择 `news` 表：

| 字段 | 类型 | 显示名称 | Interface | 配置 |
|------|------|----------|-----------|------|
| id | UUID | ID | Input (readonly) | Primary Key |
| title | String | 标题 | Input | Required |
| slug | String | URL别名 | Input | Unique |
| content | Text | 内容 | WYSIWYG | |
| summary | String |摘要 | Textarea | Max 200 chars |
| source | String | 来源 | Input | |
| source_url | String | 原文链接 | Input | URL validation |
| category | String | 分类 | Dropdown | |
| status | String | 状态 | Dropdown | draft/published |
| published_at | Timestamp | 发布时间 | Datetime | |
| priority | Integer | 优先级 | Slider | 0-10 |
| sentiment | String | 情绪 | Dropdown | bullish/bearish/neutral |

**Display Template:** `{{title}} - {{source}}`

#### 3. Service Providers（服务商）

选择 `service_providers` 表：

| 字段 | 类型 | 显示名称 | Interface | 配置 |
|------|------|----------|-----------|------|
| id | UUID | ID | Input (readonly) | Primary Key |
| name | String | 名称 | Input | Required |
| slug | String | URL别名 | Input | Unique |
| description | Text | 描述 | Textarea | |
| category | String | 分类 | Dropdown | exchange/wallet/tool/oracle |
| subcategory | String | 子分类 | Dropdown | Conditional |
| logo_url | String | Logo | Image | |
| website_url | String | 网站 | Input | URL |
| status | String | 状态 | Dropdown | active/inactive |
| verified | Boolean | 已验证 | Toggle | Default: false |
| rating | Decimal | 评分 | Rating | 0-5 stars |
| view_count | Integer | 浏览数 | Input | Default: 0 |

**Display Template:** `{{name}}`

#### 4. Categories（分类）

选择 `categories` 表：

| 字段 | 类型 | 显示名称 | Interface | 配置 |
|------|------|----------|-----------|------|
| id | UUID | ID | Input (readonly) | Primary Key |
| name | String | 名称 | Input | Required |
| slug | String | URL别名 | Input | Unique |
| type | String | 类型 | Dropdown | play/news/provider |
| description | Text | 描述 | Textarea | |
| icon | String | 图标 | Icon Picker | |
| order_index | Integer | 排序 | Input | |
| is_active | Boolean | 启用 | Toggle | Default: true |

#### 5. Tags（标签）

选择 `tags` 表：

| 字段 | 类型 | 显示名称 | Interface | 配置 |
|------|------|----------|-----------|------|
| id | UUID | ID | Input (readonly) | Primary Key |
| name | String | 名称 | Input | Required, Unique |
| slug | String | URL别名 | Input | Unique |
| type | String | 类型 | Dropdown | strategy/news/general |
| color | String | 颜色 | Color Picker | Hex color |

#### 6. Users（用户）

**注意：** 使用 Directus 内置的 `directus_users` 或映射到你的 `users` 表。

如果使用自定义 users 表：

| 字段 | 类型 | 显示名称 | Interface |
|------|------|----------|-----------|
| id | UUID | ID | Input (readonly) |
| email | String | 邮箱 | Input |
| username | String | 用户名 | Input |
| wallet_address | String | 钱包地址 | Input |
| tier | String | 会员等级 | Dropdown |
| created_at | Timestamp | 注册时间 | Datetime |

#### 7. User Interactions（用户交互）

选择 `user_interactions` 表：

| 字段 | 类型 | 显示名称 | Interface |
|------|------|----------|-----------|
| id | UUID | ID | Input (readonly) |
| user_id | UUID | 用户 | User (M2O) |
| content_type | String | 内容类型 | Dropdown |
| content_id | UUID | 内容ID | Input |
| action | String | 动作 | Dropdown |
| created_at | Timestamp | 时间 | Datetime |

**Actions:** like, favorite, share, view

#### 8. Comments（评论）

选择 `comments` 表：

| 字段 | 类型 | 显示名称 | Interface |
|------|------|----------|-----------|
| id | UUID | ID | Input (readonly) |
| user_id | UUID | 用户 | User (M2O) |
| content_type | String | 内容类型 | Dropdown |
| content_id | UUID | 内容ID | Input |
| content | Text | 评论内容 | Textarea |
| parent_id | UUID | 父评论 | Comment (M2O) |
| status | String | 状态 | Dropdown |
| created_at | Timestamp | 时间 | Datetime |

## 🔐 权限配置

### Settings > Access Control > Roles

#### 1. Public Role (未登录用户)

**Strategies:**
- Read: ✅ (filter: `status = published`)
- Create: ❌
- Update: ❌
- Delete: ❌

**News:**
- Read: ✅ (filter: `status = published`)
- Create: ❌
- Update: ❌
- Delete: ❌

**Service Providers:**
- Read: ✅ (filter: `status = active`)
- Create: ❌
- Update: ❌
- Delete: ❌

**Categories, Tags:**
- Read: ✅
- Create: ❌
- Update: ❌
- Delete: ❌

**Comments:**
- Read: ✅ (filter: `status = published`)
- Create: ❌
- Update: ❌
- Delete: ❌

#### 2. Authenticated Role (已登录用户)

**Strategies:**
- Read: ✅ (all)
- Create: ✅ (as author)
- Update: ✅ (filter: `author_id = $CURRENT_USER`)
- Delete: ✅ (filter: `author_id = $CURRENT_USER AND status = draft`)

**News:**
- Read: ✅ (filter: `status = published`)
- Create: ❌
- Update: ❌
- Delete: ❌

**User Interactions:**
- Read: ✅ (filter: `user_id = $CURRENT_USER`)
- Create: ✅ (as user)
- Update: ✅ (filter: `user_id = $CURRENT_USER`)
- Delete: ✅ (filter: `user_id = $CURRENT_USER`)

**Comments:**
- Read: ✅ (filter: `status = published`)
- Create: ✅ (as user)
- Update: ✅ (filter: `user_id = $CURRENT_USER`)
- Delete: ✅ (filter: `user_id = $CURRENT_USER`)

#### 3. Editor Role (编辑)

**Strategies:**
- Read: ✅ (all)
- Create: ✅
- Update: ✅ (all)
- Delete: ✅ (filter: `status = draft`)

**News:**
- Read: ✅ (all)
- Create: ✅
- Update: ✅ (all)
- Delete: ✅ (filter: `status = draft`)

**Service Providers:**
- Read: ✅ (all)
- Create: ✅
- Update: ✅ (all)
- Delete: ❌

**Comments:**
- Read: ✅ (all)
- Create: ✅
- Update: ✅ (all)
- Delete: ✅

#### 4. Administrator Role (管理员)

**All Collections:**
- Read: ✅
- Create: ✅
- Update: ✅
- Delete: ✅

## 🔄 关系配置

### Many-to-One (M2O)

1. **strategies.author_id → users**
   - Field: `author_id`
   - Related Collection: `directus_users` 或 `users`
   - Display Template: `{{username}} ({{email}})`

2. **comments.user_id → users**
   - Field: `user_id`
   - Related Collection: `directus_users` 或 `users`

3. **comments.parent_id → comments** (自关联)
   - Field: `parent_id`
   - Related Collection: `comments`

### Many-to-Many (M2M)

如果你的数据库有关联表：

1. **strategies ↔ chains** (通过 strategy_chains)
2. **strategies ↔ protocols** (通过 strategy_protocols)

在 Directus 中配置 Junction Collection：
- Settings > Data Model > Create Junction Collection
- 选择两个关联的 collections
- Directus 会自动创建界面

## 🎨 界面自定义

### Layout Options

每个 collection 可以配置多种布局：

1. **Table Layout** (默认)
   - 适合快速浏览和编辑
   - 自定义显示列

2. **Card Layout**
   - 适合有图片的内容（service_providers）
   - 配置卡片模板

3. **Calendar Layout**
   - 适合有时间字段的内容（news, strategies）
   - 按 `published_at` 排序

### Presets

创建常用过滤器预设：

**Strategies:**
- "已发布" - filter: `status = published`
- "我的草稿" - filter: `author_id = $CURRENT_USER AND status = draft`
- "待审核" - filter: `status = pending`

**News:**
- "今日发布" - filter: `published_at >= $NOW(-1 day)`
- "高优先级" - filter: `priority >= 7`
- "看涨" - filter: `sentiment = bullish`

## 🔌 API 使用

配置完成后，可以通过 API 访问数据：

### REST API

```bash
# 获取已发布的玩法
curl http://localhost:8055/items/strategies?filter[status][_eq]=published

# 创建新玩法（需要认证）
curl -X POST http://localhost:8055/items/strategies \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Strategy",
    "content": "Strategy content...",
    "status": "draft"
  }'

# 更新玩法
curl -X PATCH http://localhost:8055/items/strategies/{id} \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "published"}'
```

### GraphQL

访问 http://localhost:8055/graphql

```graphql
query {
  strategies(filter: { status: { _eq: "published" } }) {
    id
    title
    slug
    category
    published_at
    author_id {
      username
      email
    }
  }
}
```

## 🚀 高级功能

### 1. Flows (自动化)

Settings > Flows > Create Flow

**示例：新玩法自动通知**
- Trigger: `items.create` (strategies)
- Action: Send email to editors
- Filter: `status = pending`

### 2. Webhooks

Settings > Webhooks > Create Webhook

**示例：同步到 Meilisearch**
- Trigger: `items.create`, `items.update` (strategies)
- URL: `http://localhost:7700/indexes/strategies/documents`
- Method: POST
- Headers: `Authorization: Bearer MEILI_KEY`

### 3. Extensions

可以开发自定义扩展：
- Custom Interfaces (自定义输入组件)
- Custom Displays (自定义显示组件)
- Custom Modules (自定义页面)
- Custom Endpoints (自定义 API)

## 📝 配置检查清单

完成配置后，检查以下项目：

- [ ] 所有核心 collections 已创建并映射
- [ ] 字段类型和显示正确
- [ ] 关系正确配置（M2O, M2M）
- [ ] Public 角色权限正确（只读已发布内容）
- [ ] Authenticated 角色可以创建和编辑自己的内容
- [ ] Editor 角色可以管理所有内容
- [ ] Administrator 角色有完全权限
- [ ] Display templates 已设置
- [ ] Presets 已创建
- [ ] API 可以正常访问数据

## 🔧 故障排查

### 连接数据库失败
- 检查 Supabase 连接字符串
- 确认防火墙允许连接
- 验证数据库密码

### Bootstrap 失败
- 删除 directus_* 表重试
- 检查数据库权限

### Collection 不显示
- 确认表在 public schema
- 刷新 Directus metadata
- 检查表是否有主键

### 权限问题
- 检查 RLS 策略
- 在开发环境可以临时禁用 RLS
- 使用 service_role key 测试

## 📚 资源

- [Directus 官方文档](https://docs.directus.io)
- [API 参考](https://docs.directus.io/reference/introduction)
- [权限指南](https://docs.directus.io/configuration/users-roles-permissions)
- [Relations 配置](https://docs.directus.io/app/data-model/relationships)
