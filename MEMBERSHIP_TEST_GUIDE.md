# 会员功能测试指南

## 当前状态

✅ **数据库检查完成 - 您的会员记录正常！**

- 用户邮箱: `the_uk1@outlook.com`
- 用户 ID: `24da5b63-cda3-424d-b98e-dfa32cb61278`
- 会员等级: **Pro** (Level 1)
- 订阅状态: **active** (激活中)
- 支付方式: Stripe
- 订阅周期: monthly (月付)
- 开始日期: 2025-10-28
- 到期日期: 2025-11-27
- 剩余天数: **30天**
- 自动续费: 已开启
- Stripe 订阅 ID: `sub_1SNH4WDX3Rjo9YUq4evF25sG`

## 会员权益

您的 Pro 会员包含以下权益：
- ✅ 60%中级内容
- ✅ 无限收藏
- ✅ 无限快讯
- ✅ 高级搜索
- ✅ 无广告
- ✅ 数据导出
- ✅ 优先支持

## 如何查看会员状态

### 方法 1: 通过浏览器访问（推荐）

1. 打开浏览器，访问: http://localhost:3000/auth/login
2. 使用以下凭据登录:
   - 邮箱: `the_uk1@outlook.com`
   - 密码: `Mygcdjmyxzg2026!`
3. 登录成功后，访问: http://localhost:3000/membership
4. 您应该能看到完整的会员信息面板，包括:
   - Pro 会员徽章
   - 订阅状态（激活中）
   - 到期日期和剩余天数
   - 支付信息
   - 会员权益列表

### 方法 2: 通过 API 测试

如果浏览器登录后仍然看不到会员信息，运行以下命令进行调试:

```bash
# 1. 检查数据库中的订阅记录
node /Users/m1/PlayNew_0.3/check-user-subscriptions.js

# 2. 测试 Directus API
node /Users/m1/PlayNew_0.3/fix-permissions-db.js
```

## 常见问题

### Q: 登录后显示 "Free 会员" 或加载中？

**原因**: 前端 API 无法获取订阅信息，可能是以下原因之一:

1. **Supabase session 问题** - 刷新页面重新登录
2. **Directus API token 失效** - 检查 `.env.local` 中的 `DIRECTUS_ADMIN_TOKEN`
3. **CORS 问题** - 确保 Directus 允许前端域名

**解决步骤**:

1. 打开浏览器开发者工具 (F12)
2. 切换到 Console 选项卡
3. 刷新会员页面
4. 查看是否有错误信息
5. 检查 Network 选项卡中 `/api/subscription` 请求的响应

### Q: API 返回 401 Unauthorized?

这意味着 Supabase session 无效。解决方法:
1. 退出登录
2. 重新登录
3. 再次访问会员页面

### Q: API 返回 500 Internal Server Error?

检查后端日志:
```bash
# 查看 Next.js 开发服务器的控制台输出
# 应该能看到详细的错误信息
```

## 技术细节

### 数据流程

```
浏览器
  ↓ (带 Supabase session cookie)
前端 /membership 页面
  ↓ 调用
/api/subscription
  ↓ 使用 Supabase session 获取 user.id
  ↓ 查询
Directus API
  ↓ 查询
user_subscriptions 表 (user_id)
  ↓ 关联查询
memberships 表 (membership_id)
  ↓ 返回
订阅信息 + 会员等级详情
```

### 数据库架构

- `user_subscriptions` - 用户订阅记录表
  - `user_id` (UUID) - 关联 `auth.users.id`
  - `membership_id` (int) - 关联 `memberships.id`
  - `status` (varchar) - active/cancelled/expired
  - `start_date`, `end_date` - 订阅周期

- `memberships` - 会员套餐定义表
  - `id` (int)
  - `name` (varchar) - Free/Pro/Max
  - `level` (int) - 0/1/2
  - `features` (json) - 权益列表

## 验证命令

```bash
# 验证订阅数据
node check-user-subscriptions.js

# 验证 Directus API 权限
node fix-permissions-db.js

# 重启前端服务器
cd frontend
npm run dev
```

## 需要帮助?

如果以上步骤都无法解决问题，请提供以下信息:

1. 浏览器控制台的错误信息
2. Network 选项卡中 `/api/subscription` 的响应
3. 后端开发服务器的日志输出
