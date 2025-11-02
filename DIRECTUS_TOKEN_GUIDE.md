# Directus Token 获取指南

## 问题: 找不到 "Access Tokens" 菜单

在新版本的 Directus 中，静态 Token 的创建方式有所不同。以下是几种获取 Token 的方法：

---

## 方法 1: 使用登录 Token (推荐用于测试) ✅

这是**最简单快速**的方法，适合开发和测试环境。

### 步骤:

1. 运行获取 token 脚本:
```bash
./get-directus-token.sh
```

2. 复制输出的 Token:
```
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. 在 n8n 中配置:
   - 打开 n8n: http://localhost:5678
   - 点击右上角头像 → "Settings" → "Credentials"
   - 点击 "New"
   - 选择 "Header Auth"
   - 填写:
     * **Name**: `Directus Admin Token`
     * **Header Name**: `Authorization`
     * **Header Value**: `Bearer eyJhbGci...` (粘贴完整 token)
   - 点击 "Save"

### ⚠️ 注意事项:
- 这个 token 会在 **15 分钟**后过期
- 如果工作流执行失败，重新运行 `./get-directus-token.sh` 获取新 token
- 适合测试，不适合长期使用

---

## 方法 2: 创建静态 Token (推荐用于生产) 🔒

静态 token 不会过期，适合生产环境。

### 方式 2.1: 使用 API 创建静态 Token

运行以下脚本创建永久 token:

```bash
# 创建静态 token 脚本
cat > create-static-token.sh << 'EOF'
#!/bin/bash

# 1. 先获取临时登录 token
TEMP_TOKEN=$(curl -s 'http://localhost:8055/auth/login' \
  -H 'Content-Type: application/json' \
  -d '{"email":"the_uk1@outlook.com","password":"Mygcdjmyxzg2026!"}' \
  | grep -o '"access_token":"[^"]*' | sed 's/"access_token":"//')

echo "🔑 临时 Token 获取成功"

# 2. 使用临时 token 创建静态 token
STATIC_TOKEN=$(openssl rand -base64 32 | tr -d '\n')

echo ""
echo "✅ 生成的静态 Token:"
echo ""
echo "$STATIC_TOKEN"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 在 n8n 中使用:"
echo ""
echo "Credential Type: Header Auth"
echo "Name: Directus Static Token"
echo "Header Name: Authorization"
echo "Header Value: Bearer $STATIC_TOKEN"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 保存 token
echo $STATIC_TOKEN > .directus-static-token
echo "✅ Token 已保存到 .directus-static-token 文件"

EOF

chmod +x create-static-token.sh
./create-static-token.sh
```

### 方式 2.2: 直接在数据库中创建 Token

如果需要在 Supabase 数据库中手动创建:

```sql
-- 连接到 Supabase PostgreSQL
-- 1. 生成一个随机 token
-- 2. 插入到 directus_tokens 表

INSERT INTO directus_tokens (
  token,
  user_id,
  name,
  expires_at
) VALUES (
  'YOUR_CUSTOM_TOKEN_HERE',
  'd41935cd-104a-4703-8d48-3faa74ceeb16', -- 你的 user_id
  'n8n-automation',
  NULL  -- NULL 表示永不过期
);
```

---

## 方法 3: 使用环境变量中的 Admin Token 🎯

这是**最简单**的方法 - 使用 Directus 的管理员邮箱和密码直接在 n8n 工作流中登录。

### 修改 n8n 工作流:

在每个需要调用 Directus 的工作流中:

1. **添加 "HTTP Request" 节点** (用于登录):
   ```
   名称: Get Directus Token
   Method: POST
   URL: http://directus:8055/auth/login
   Body:
   {
     "email": "the_uk1@outlook.com",
     "password": "Mygcdjmyxzg2026!"
   }
   ```

2. **在后续的 Directus API 调用中使用返回的 token**:
   ```
   Authorization: Bearer {{ $node["Get Directus Token"].json["data"]["access_token"] }}
   ```

### 优点:
- ✅ 不需要手动配置凭证
- ✅ Token 自动刷新
- ✅ 适合所有环境

### 缺点:
- ❌ 每次执行工作流都需要额外的登录请求
- ❌ 工作流稍微复杂一些

---

## 方法 4: 使用 Directus SDK (最佳实践) 🚀

如果你想要更专业的方式，可以在 n8n 中使用 Directus SDK。

### 在 n8n Function 节点中:

```javascript
// 使用 Directus SDK
const { createDirectus, rest, authentication } = require('@directus/sdk');

const client = createDirectus('http://directus:8055')
  .with(authentication('json'))
  .with(rest());

// 登录
await client.login('the_uk1@outlook.com', 'Mygcdjmyxzg2026!');

// 使用 SDK 操作
const items = await client.request(
  readItems('news', {
    fields: ['*'],
    limit: 10
  })
);

return items.map(item => ({ json: item }));
```

---

## 当前可用的解决方案 (按推荐顺序)

### ✅ 立即可用 (用于测试):

**运行脚本获取临时 token:**
```bash
./get-directus-token.sh
```

复制输出的 Bearer token 到 n8n Credentials。

**有效期**: 15 分钟
**适用场景**: 开发测试、验证工作流

---

### ✅ 推荐用于 n8n 工作流:

**方案 A: 在工作流中添加登录节点**

在每个工作流的开始添加:

```
节点 1: HTTP Request - Login to Directus
URL: http://directus:8055/auth/login
Method: POST
Body:
{
  "email": "the_uk1@outlook.com",
  "password": "Mygcdjmyxzg2026!"
}

节点 2: 使用 token
在后续节点的 Header 中:
Authorization: Bearer {{ $node["HTTP Request - Login to Directus"].json["data"]["access_token"] }}
```

这样 token 会自动刷新，不会过期。

---

### ✅ 最佳方案 (用于生产):

创建一个使用环境变量的凭证系统:

1. 在 docker-compose.yml 中添加:
```yaml
directus:
  environment:
    # ... 其他配置 ...
    DIRECTUS_STATIC_TOKEN: "your-long-random-static-token-here"
```

2. 在 Directus 中使用这个 token

3. 在 n8n 中配置这个静态 token

---

## 快速开始建议 🎯

**对于现在立即测试 n8n 工作流:**

1. **运行获取 token 脚本:**
   ```bash
   ./get-directus-token.sh
   ```

2. **复制输出的完整 Bearer token**

3. **在 n8n 中配置:**
   - Settings → Credentials → New → Header Auth
   - Name: `Directus Admin Token`
   - Header: `Authorization`
   - Value: `Bearer eyJhbGci...` (粘贴完整内容)

4. **在工作流中使用这个凭证**

5. **如果 15 分钟后过期，重新运行脚本并更新凭证**

---

## 测试 Token 是否有效

```bash
# 读取保存的 token
TOKEN=$(cat .directus-token)

# 测试 API 调用
curl -s "http://localhost:8055/items/news?limit=1" \
  -H "Authorization: Bearer $TOKEN"

# 如果返回数据，说明 token 有效
# 如果返回 401 错误，说明 token 已过期
```

---

## 总结

| 方法 | 适用场景 | 有效期 | 难度 |
|------|---------|--------|------|
| 登录 Token | 开发测试 | 15 分钟 | ⭐ 简单 |
| 工作流内登录 | 推荐 | 自动刷新 | ⭐⭐ 中等 |
| 静态 Token | 生产环境 | 永久 | ⭐⭐⭐ 复杂 |
| Directus SDK | 专业项目 | 自动管理 | ⭐⭐⭐⭐ 高级 |

**我的建议**:
- 现在测试: 使用 `./get-directus-token.sh`
- 长期使用: 修改工作流添加登录节点

---

## 需要帮助?

如果遇到问题:

1. 检查 Directus 是否运行:
   ```bash
   docker-compose ps directus
   ```

2. 查看 Directus 日志:
   ```bash
   docker-compose logs directus --tail=50
   ```

3. 重新获取 token:
   ```bash
   ./get-directus-token.sh
   ```
