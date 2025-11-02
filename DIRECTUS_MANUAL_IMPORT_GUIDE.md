# Directus Manual Import Guide

现在 Directus 已经删除了空的集合定义。你需要在 Directus UI 中手动导入现有的数据库表。

## 方法 1: 通过 Data Model 导入 (推荐)

### 步骤 1: 打开 Data Model

1. 访问 http://localhost:8055/admin
2. 点击左侧菜单的 **Settings** (齿轮图标)
3. 点击 **Data Model**

### 步骤 2: 导入数据库表

在 Data Model 页面,你应该能看到数据库中所有的表(即使 Directus 还没有为它们创建集合)。

**对于以下每个表,执行这些操作:**

#### 主要表 (按顺序导入):

1. **categories** (分类)
2. **tags** (标签)
3. **chains** (区块链)
4. **protocols** (协议)
5. **users** (用户)
6. **strategies** (玩法)
7. **news** (资讯)
8. **service_providers** (服务商)
9. **comments** (评论)
10. **user_interactions** (用户交互)

#### 关联表:

11. **strategy_tags** (玩法-标签关联)
12. **news_tags** (资讯-标签关联)
13. **strategy_chains** (玩法-区块链关联)
14. **strategy_protocols** (玩法-协议关联)

### 步骤 3: 为每个表配置元数据

点击每个表名,然后配置:

#### 1. strategies (玩法库)

```
Display Template: {{title}}
Icon: lightbulb
Note: 玩法库 - 各种加密货币玩法策略
Archive Field: status
Archive Value: archived
Unarchive Value: published
Sort Field: published_at
```

**重要字段配置:**
- `id`: Hidden, Read-only
- `title`: Interface = Input, Required
- `slug`: Interface = Input, Required, Unique
- `content`: Interface = WYSIWYG Editor
- `summary`: Interface = Text Area
- `status`: Interface = Dropdown (draft, published, archived)
- `risk_level`: Interface = Dropdown or Slider (1-5)
- `category`: Interface = Dropdown M2O → categories
- `tags`: Interface = Tags (Many to Many) → tags
- `chains`: Interface = Tags (Array) 或 M2M → chains
- `protocols`: Interface = Tags (Array) 或 M2M → protocols

#### 2. news (资讯)

```
Display Template: {{title}}
Icon: article
Note: 资讯 - 加密货币相关新闻资讯
Archive Field: status
Archive Value: archived
Unarchive Value: published
Sort Field: published_at
```

**重要字段配置:**
- `id`: Hidden, Read-only
- `title`: Interface = Input, Required
- `url`: Interface = Input (URL type)
- `content`: Interface = WYSIWYG Editor
- `author`: Interface = Input
- `source`: Interface = Input
- `status`: Interface = Dropdown
- `category`: Interface = Dropdown M2O → categories

#### 3. service_providers (服务商)

```
Display Template: {{name}}
Icon: business
Note: 服务商 - 交易所、钱包等服务提供商
Archive Field: status
Archive Value: inactive
Unarchive Value: active
Sort Field: name
```

**重要字段配置:**
- `name`: Interface = Input, Required
- `type`: Interface = Dropdown (exchange, wallet, defi, tool, other)
- `description`: Interface = WYSIWYG Editor
- `website_url`: Interface = Input (URL type)
- `logo_url`: Interface = Input or File
- `referral_url`: Interface = Input (URL type)
- `rating`: Interface = Slider (0-5)

#### 4. categories (分类)

```
Display Template: {{name}}
Icon: folder
Note: 分类 - 内容分类标签
Sort Field: order_index
```

**重要字段配置:**
- `name`: Interface = Input, Required
- `slug`: Interface = Input, Required, Unique
- `type`: Interface = Dropdown (play, news)
- `parent_id`: Interface = Dropdown M2O → categories (self-reference)
- `order_index`: Interface = Input (number)

#### 5. tags (标签)

```
Display Template: {{name}}
Icon: label
Note: 标签 - 内容标签
Sort Field: name
```

**重要字段配置:**
- `name`: Interface = Input, Required
- `slug`: Interface = Input, Required, Unique
- `type`: Interface = Dropdown (general, technical, risk)
- `usage_count`: Interface = Input, Read-only

#### 6. chains (区块链)

```
Display Template: {{name}} ({{symbol}})
Icon: link
Note: 区块链 - 支持的区块链网络
Sort Field: name
```

**重要字段配置:**
- `name`: Interface = Input, Required
- `symbol`: Interface = Input, Required
- `chain_id`: Interface = Input (number)
- `logo_url`: Interface = Input or File
- `is_testnet`: Interface = Toggle

#### 7. protocols (协议)

```
Display Template: {{name}}
Icon: hub
Note: 协议 - DeFi协议
Archive Field: status
Sort Field: name
```

#### 8. users (用户)

```
Display Template: {{username}} ({{email}})
Icon: person
Note: 用户 - 平台用户
Archive Field: status
Archive Value: suspended
Unarchive Value: active
Sort Field: created_at
```

#### 9. comments (评论)

```
Display Template: {{content}}
Icon: comment
Note: 评论 - 用户评论
Archive Field: status
Sort Field: created_at
```

#### 10. user_interactions (用户交互)

```
Display Template: {{user_id}} - {{interaction_type}}
Icon: thumb_up
Note: 用户交互 - 点赞、收藏等
Sort Field: created_at
```

### 步骤 4: 配置关系 (Relationships)

在导入所有表后,配置以下 Many-to-Many 关系:

#### strategies ↔ tags (通过 strategy_tags)

1. 进入 strategies 集合
2. 添加新字段 (如果不存在) 或配置现有的 tags 字段
3. Interface = Many to Many
4. Related Collection = tags
5. Junction Collection = strategy_tags
6. Junction Field (Current) = strategy_id
7. Junction Field (Related) = tag_id

#### news ↔ tags (通过 news_tags)

类似上面的配置

#### strategies ↔ chains (如果使用 M2M)

根据你的数据结构配置

#### strategies ↔ protocols (如果使用 M2M)

根据你的数据结构配置

---

## 方法 2: 使用 Schema Apply 脚本 (备用)

如果手动导入太繁琐,可以尝试重启 Directus 容器让它自动发现表:

```bash
docker-compose restart directus
```

然后等待 30 秒,访问 Data Model 页面查看是否自动导入了表。

---

## 验证

完成后,检查:

1. ✅ 所有 10 个主要集合都出现在 Content 菜单中
2. ✅ 每个集合都显示正确的字段数量
3. ✅ 字段有正确的中文标签(如果配置了)
4. ✅ 可以在 Content 界面查看和编辑数据

---

## 遇到问题?

如果某些表没有出现:

1. 检查表是否在数据库中存在:
   ```bash
   node verify-db-tables.js
   ```

2. 检查 Directus 日志:
   ```bash
   docker-compose logs directus --tail=50
   ```

3. 尝试重启 Directus:
   ```bash
   docker-compose restart directus
   ```
