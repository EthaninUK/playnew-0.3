# 🔧 修复会员显示问题 - Token过期问题

## 问题诊断

✅ **已确认根本原因**: `DIRECTUS_ADMIN_TOKEN` 使用的是JWT token，每15分钟就会过期

这导致：
- ❌ Stripe webhook无法创建订阅记录到Directus
- ❌ `/api/subscription` 接口返回 401 Unauthorized
- ❌ 会员中心一直显示 "Free 会员"

## 🛠️ 解决步骤

### 方案A: 生成永久Static Token（推荐）

1. **访问 Directus 管理后台**
   ```
   http://localhost:8055
   ```

2. **登录账号**
   - Email: the_uk1@outlook.com
   - Password: Mygcdjmyxzg2026!

3. **创建Static Token**
   - 点击左侧菜单: **Settings** (设置)
   - 点击: **Access Tokens** (访问令牌)
   - 点击右上角: **Create Token** (创建令牌)
   - 配置：
     - **Name**: `Webhook Admin Token`
     - **Role**: `Administrator`
     - **Expiration**: `Never` (永不过期)
   - 点击 **Save** 保存

4. **复制生成的Token**
   - 复制完整的token字符串（类似 `abc123def456...`）

5. **更新环境变量**
   编辑文件: `/Users/m1/PlayNew_0.3/frontend/.env.local`

   替换这一行：
   ```env
   DIRECTUS_ADMIN_TOKEN=eyJhbGciOiJ... (旧的JWT token)
   ```

   改为：
   ```env
   DIRECTUS_ADMIN_TOKEN=你刚才复制的永久token
   ```

6. **重启前端服务**
   ```bash
   # 停止当前服务
   pkill -f "next-server"

   # 重新启动
   cd /Users/m1/PlayNew_0.3/frontend
   npm run dev
   ```

### 方案B: 使用Directus API生成Static Token（自动化）

运行此脚本自动生成永久token：

```bash
node /Users/m1/PlayNew_0.3/create-permanent-token.js
```

## ✅ 验证修复

1. **测试Directus API访问**
   ```bash
   curl -H "Authorization: Bearer 你的新token" \
     http://localhost:8055/items/user_subscriptions
   ```

   应该返回订阅记录，而不是 401 错误

2. **进行一次测试支付**
   - 访问: http://localhost:3000/pricing
   - 选择会员等级并支付
   - 支付成功后，webhook应该能成功创建订阅记录

3. **检查会员中心**
   - 访问: http://localhost:3000/membership
   - 应该正确显示购买的会员等级

## 🔍 如何确认问题已解决

运行诊断脚本：
```bash
node /Users/m1/PlayNew_0.3/diagnose-membership-issue.js
```

应该看到：
- ✅ 能成功获取订阅记录
- ✅ Stripe webhook事件正常
- ✅ 没有 "Invalid user credentials" 错误

## 📝 为什么会出现这个问题？

之前使用的是通过 `/auth/login` 接口获取的JWT token：
- ❌ 只有15分钟有效期 (`exp: 1761760385`)
- ❌ 需要频繁刷新
- ❌ 不适合用于webhook等后台任务

正确做法是使用Static Token：
- ✅ 永久有效（或设置长期有效期）
- ✅ 专门用于服务器端API调用
- ✅ 可以随时吊销

## 🚀 后续建议

1. **监控Token状态**: 定期检查token是否有效
2. **备份Token**: 将token保存在安全的地方
3. **日志监控**: 定期查看webhook处理日志
4. **测试流程**: 每次部署后测试一次完整支付流程

---

**问题修复后，所有新的支付都会正常创建订阅记录！** 🎉
