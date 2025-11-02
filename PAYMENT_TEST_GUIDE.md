# Stripe 支付测试指南

## 当前状态

✅ Stripe API 密钥已配置
✅ Webhook Secret 已配置
✅ Directus Admin Token 已配置
✅ 前端应用运行中 (http://localhost:3000)

## 开始测试

### 第 1 步: 启动 Stripe Webhook 监听

在新的终端窗口中运行:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

**注意**: 如果 webhook secret 不同,请更新 `.env.local` 中的 `STRIPE_WEBHOOK_SECRET`

### 第 2 步: 访问定价页面

打开浏览器访问:
```
http://localhost:3000/pricing
```

你应该能看到 4 个会员等级:
- Free: $0
- Pro: $39/月 ($390/年)
- Max: $99/月 ($990/年)
- Partner: $200/月 ($2000/年)

### 第 3 步: 选择会员等级

1. 点击任意付费会员等级的 "选择方案" 按钮
2. 选择计费周期 (月付/年付)
3. 进入结账页面

### 第 4 步: 完成支付

在结账页面:
1. 确保已登录 (如未登录会自动跳转到登录页)
2. 确认订单信息和价格
3. 选择支付方式: "信用卡支付 (Stripe)"
4. 点击 "立即支付" 按钮

### 第 5 步: Stripe Checkout

浏览器会跳转到 Stripe Checkout 页面:

**使用测试卡号**:
- 卡号: `4242 4242 4242 4242`
- 过期日期: 任意未来日期 (如 `12/34`)
- CVC: 任意 3 位数 (如 `123`)
- 邮编: 任意邮编 (如 `12345`)
- 邮箱: 任意邮箱

点击 "Subscribe" 完成支付

### 第 6 步: 验证支付成功

支付成功后:
1. 自动跳转到成功页面 (http://localhost:3000/payment/success)
2. 看到 "支付成功!" 提示
3. 显示会员等级和权益

### 第 7 步: 检查 Webhook 事件

查看运行 `stripe listen` 的终端窗口:

应该能看到:
```
✔️  checkout.session.completed [evt_xxx]
```

### 第 8 步: 验证 Directus 数据

访问 Directus 后台: http://localhost:8055/admin

检查以下表:

**1. user_subscriptions 表**
应该有新记录:
- user_id: 你的用户 ID
- membership_id: 选择的会员等级 ID
- status: "active"
- stripe_subscription_id: sub_xxx
- start_date 和 end_date

**2. payments 表**
应该有支付记录:
- user_id: 你的用户 ID
- amount_usd: 支付金额
- payment_method: "stripe"
- status: "completed"
- stripe_payment_id: pi_xxx

## 其他测试卡号

### 成功支付
- `4242 4242 4242 4242` - 标准成功

### 支付失败测试
- `4000 0000 0000 0002` - 卡被拒绝
- `4000 0000 0000 9995` - 资金不足
- `4000 0000 0000 9987` - 丢失卡

### 3D Secure 测试
- `4000 0025 0000 3155` - 需要 3D Secure 验证

## 常见问题排查

### 问题 1: 点击"立即支付"后没反应

**检查**:
- 浏览器控制台是否有错误
- 是否已登录 (查看右上角用户菜单)
- Network 标签中 API 请求是否成功

### 问题 2: Stripe Checkout 页面报错

**检查**:
- `.env.local` 中的 Stripe 密钥是否正确
- 服务器终端是否有错误日志
- API 路由 `/api/create-checkout-session` 是否返回 200

### 问题 3: 支付成功但没有创建订阅记录

**检查**:
- Stripe CLI 是否在运行 `stripe listen`
- Webhook secret 是否正确
- Directus Admin Token 是否有效
- 服务器终端是否有 webhook 处理错误

### 问题 4: 支付成功页面显示错误

**检查**:
- Stripe session_id 是否正确传递
- `/api/verify-payment` 端点是否正常
- Stripe 测试模式是否开启

## 测试检查清单

- [ ] 定价页面显示 4 个会员等级
- [ ] 月付/年付切换正常
- [ ] 年付显示 17% 优惠标记
- [ ] 点击"选择方案"跳转到结账页
- [ ] 结账页显示正确的价格和功能
- [ ] 支付方式可以选择
- [ ] 点击"立即支付"跳转到 Stripe Checkout
- [ ] 测试卡号支付成功
- [ ] 自动跳转到成功页面
- [ ] Stripe CLI 收到 webhook 事件
- [ ] Directus 创建了 subscription 记录
- [ ] Directus 创建了 payment 记录
- [ ] 会员中心显示订阅信息

## 下一步

测试完成后,你可以:

1. **测试取消订阅**:
   - 在 Stripe Dashboard 中取消测试订阅
   - 验证 webhook 更新 Directus 状态

2. **测试续费**:
   - 等待或手动触发续费事件
   - 验证新的支付记录创建

3. **测试失败支付**:
   - 使用失败测试卡号
   - 验证错误处理和用户提示

4. **准备上线**:
   - 切换到 Stripe 生产模式
   - 获取生产环境 API 密钥
   - 配置生产环境 Webhook

---

**开始测试吧!** 🚀

如果遇到任何问题,检查:
1. 浏览器控制台
2. Next.js 开发服务器终端
3. Stripe CLI 终端
4. Directus 后台数据
