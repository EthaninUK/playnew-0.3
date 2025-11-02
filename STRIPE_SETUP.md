# Stripe 支付集成设置指南

## 1. 注册 Stripe 账号

1. 访问 [Stripe Dashboard](https://dashboard.stripe.com/register)
2. 注册一个 Stripe 账号
3. 完成邮箱验证

## 2. 获取 API 密钥

### 测试环境密钥

1. 登录 [Stripe Dashboard](https://dashboard.stripe.com)
2. 确保右上角切换到 **测试模式** (Test Mode)
3. 进入 **Developers > API keys**
4. 复制以下密钥:
   - **Publishable key** (以 `pk_test_` 开头)
   - **Secret key** (以 `sk_test_` 开头,点击 "Reveal test key" 查看)

### 添加到环境变量

编辑 `/frontend/.env.local` 文件,替换以下值:

```bash
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_KEY_HERE
STRIPE_SECRET_KEY=sk_test_YOUR_ACTUAL_KEY_HERE
```

## 3. 配置 Webhook

Webhook 用于接收 Stripe 的支付状态更新通知。

### 本地开发环境

使用 Stripe CLI 进行本地测试:

1. **安装 Stripe CLI**:
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe

   # Windows
   # 下载: https://github.com/stripe/stripe-cli/releases
   ```

2. **登录 Stripe CLI**:
   ```bash
   stripe login
   ```

3. **转发 webhook 到本地**:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

4. **获取 webhook 签名密钥**:
   执行上面命令后,会输出类似这样的密钥:
   ```
   > Ready! Your webhook signing secret is whsec_xxxxx...
   ```

5. **添加到 .env.local**:
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE
   ```

### 生产环境

1. 进入 [Stripe Dashboard > Developers > Webhooks](https://dashboard.stripe.com/test/webhooks)
2. 点击 **Add endpoint**
3. 输入端点 URL:
   ```
   https://yourdomain.com/api/webhooks/stripe
   ```

4. 选择要监听的事件:
   - `checkout.session.completed` - 支付完成
   - `customer.subscription.updated` - 订阅更新
   - `customer.subscription.deleted` - 订阅取消
   - `invoice.payment_succeeded` - 发票支付成功
   - `invoice.payment_failed` - 发票支付失败

5. 点击 **Add endpoint** 保存

6. 复制 **Signing secret** (以 `whsec_` 开头)

7. 添加到生产环境的环境变量中

## 4. 配置 Directus Admin Token

Webhook 需要 Directus 管理员权限来创建订阅记录。

1. 登录 Directus 后台: `http://localhost:8055/admin`

2. 进入 **Settings > Access Tokens**

3. 点击 **Create Token**

4. 设置:
   - **Name**: Stripe Webhook
   - **Role**: Administrator
   - **Expiration**: Never (或设置较长期限)

5. 复制生成的 token

6. 添加到 `.env.local`:
   ```bash
   DIRECTUS_ADMIN_TOKEN=your-admin-token-here
   ```

## 5. 测试支付流程

### 使用测试卡号

Stripe 提供测试卡号用于开发测试:

| 卡号 | 用途 |
|------|------|
| `4242 4242 4242 4242` | 支付成功 |
| `4000 0000 0000 0002` | 卡被拒绝 |
| `4000 0000 0000 9995` | 资金不足 |

- **过期日期**: 任何未来日期 (如 `12/34`)
- **CVC**: 任意 3 位数字 (如 `123`)
- **邮编**: 任意邮编 (如 `12345`)

### 测试步骤

1. 启动开发服务器:
   ```bash
   cd frontend
   npm run dev
   ```

2. 在另一个终端启动 Stripe webhook 监听:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

3. 访问定价页面:
   ```
   http://localhost:3000/pricing
   ```

4. 选择会员等级,点击 "选择方案"

5. 进入结账页面,选择支付方式为 "信用卡支付"

6. 点击 "立即支付",跳转到 Stripe Checkout 页面

7. 使用测试卡号 `4242 4242 4242 4242` 完成支付

8. 支付成功后,会自动跳转到成功页面

9. 检查 Directus 后台:
   - `user_subscriptions` 表应该有新记录
   - `payments` 表应该有支付记录

10. 检查 Stripe CLI 输出,应该能看到 webhook 事件日志

## 6. 常见问题

### 问题 1: Webhook 签名验证失败

**错误信息**: `Webhook signature verification failed`

**解决方法**:
- 确保 `.env.local` 中的 `STRIPE_WEBHOOK_SECRET` 正确
- 重启 Next.js 开发服务器
- 如果使用 Stripe CLI,确保转发地址正确

### 问题 2: 支付成功但没有创建订阅记录

**原因**:
- Directus Admin Token 无效或权限不足
- Webhook 处理出错

**解决方法**:
- 检查 `.env.local` 中的 `DIRECTUS_ADMIN_TOKEN`
- 查看 Next.js 控制台错误日志
- 查看 Stripe Dashboard > Developers > Webhooks 中的事件日志

### 问题 3: 本地测试时 webhook 未触发

**解决方法**:
- 确保 Stripe CLI 正在运行 `stripe listen`
- 检查转发地址是否正确: `localhost:3000/api/webhooks/stripe`
- 查看 Stripe CLI 输出是否有错误信息

## 7. 生产环境部署清单

- [ ] 切换到 Stripe 生产模式 (Live Mode)
- [ ] 获取生产环境 API 密钥 (`pk_live_` 和 `sk_live_`)
- [ ] 配置生产环境 Webhook 端点
- [ ] 更新生产环境的环境变量
- [ ] 测试完整支付流程
- [ ] 配置 Stripe 账户信息 (公司名称、地址等)
- [ ] 启用所需的支付方式
- [ ] 配置发票和收据邮件模板
- [ ] 设置退款政策
- [ ] 启用欺诈检测功能

## 8. 安全建议

1. **永远不要**将 Secret Key 提交到 Git 仓库
2. **使用环境变量**存储所有敏感信息
3. **验证 Webhook 签名**防止伪造请求
4. **定期轮换** API 密钥和 Admin Token
5. **监控异常**支付行为和订阅状态
6. **备份**订阅和支付数据

## 9. 相关文档

- [Stripe 官方文档](https://stripe.com/docs)
- [Stripe Checkout 文档](https://stripe.com/docs/payments/checkout)
- [Stripe Webhooks 文档](https://stripe.com/docs/webhooks)
- [Stripe CLI 文档](https://stripe.com/docs/stripe-cli)
- [Stripe 测试卡号](https://stripe.com/docs/testing)

---

**最后更新**: 2025-10-29
