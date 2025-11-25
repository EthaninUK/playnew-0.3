# PlayNew 会员系统重构完成指南

## 📋 系统概览

PlayNew 会员系统已重新设计，提供三个会员等级和一个特殊的玩法合伙人计划。

### 会员等级

| 等级 | 价格 | 访问权限 | 主要功能 |
|------|------|----------|----------|
| **Free** | $0 | 20% 基础策略 | 每日5条快讯、最多5个收藏 |
| **Pro** | $699/年 | 60% 中级策略 | 无限快讯、无限收藏、AI辅助分析 |
| **Max** | $1299/年 | 100% 全部策略 | 完整AI助手、独家研报、1对1咨询 |

### 玩法合伙人

- 不需要付费订阅，直接通过 Telegram 联系
- 收益：发布玩法获得 70% 分成，推荐用户获得 20% 佣金
- 专属数据分析面板和优先技术支持

---

## 🗂️ 文件修改清单

### 1. 前端页面

#### [frontend/app/pricing/page.tsx](frontend/app/pricing/page.tsx)
- ✅ 完全重写定价页面
- ✅ 移除月付选项，仅支持年付
- ✅ 添加玩法合伙人专区
- ✅ 固定会员方案配置（不再从 API 加载）
- ✅ 添加 Telegram 联系入口

#### [frontend/app/payment/success/page.tsx](frontend/app/payment/success/page.tsx)
- ✅ 新建支付成功页面
- ✅ 实时验证支付状态
- ✅ 显示订单信息
- ✅ 引导用户前往会员中心

### 2. API 接口

#### [frontend/app/api/memberships/route.ts](frontend/app/api/memberships/route.ts)
- ✅ 恢复并重写 API
- ✅ 返回固定的会员方案配置
- ✅ 与前端定价一致

#### [frontend/app/api/create-checkout-session/route.ts](frontend/app/api/create-checkout-session/route.ts)
- ✅ 恢复并重写 Stripe Checkout 集成
- ✅ 仅支持 Pro ($699) 和 Max ($1299) 年付
- ✅ 使用 Supabase 验证用户身份
- ✅ 在 metadata 中记录用户和会员信息

### 3. 导航和入口

#### [frontend/components/shared/Header.tsx](frontend/components/shared/Header.tsx)
- ✅ 开放"会员"导航链接
- ✅ 显示当前会员徽章
- ✅ 移动端显示会员状态

### 4. 配置脚本

#### [setup-membership-tiers.js](setup-membership-tiers.js)
- ✅ 新建 Directus 会员等级配置脚本
- ✅ 自动创建/更新三个会员等级
- ✅ 包含完整的功能列表

---

## 🚀 部署步骤

### 1. 配置 Directus 会员数据

```bash
# 运行配置脚本
node setup-membership-tiers.js
```

这将在 Directus 的 `memberships` 表中创建/更新三个会员等级数据。

### 2. 验证 Stripe 配置

确保以下环境变量已配置在 `frontend/.env.local`:

```env
# Stripe 配置
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# 应用URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. 测试支付流程

1. 访问 `/pricing` 页面
2. 选择 Pro 或 Max 会员
3. 点击"立即订阅"
4. 完成 Stripe 测试支付
5. 验证支付成功页面
6. 检查会员中心是否显示新等级

### 4. 配置 Telegram 联系方式

更新以下 Telegram 链接（在 pricing/page.tsx 中）:

- 玩法合伙人: `https://t.me/playnew_partner`
- 客服支持: `https://t.me/playnew_support`

---

## 📊 会员权限控制

### 内容访问级别

系统通过 `content_access_level` 字段控制用户可访问的策略:

- **Free (20)**: 只能访问标记为"基础"的策略
- **Pro (60)**: 可访问"基础"和"中级"策略
- **Max (100)**: 可访问所有策略

### 实施建议

在策略详情页面添加访问控制:

```typescript
// 示例代码
const userAccessLevel = currentSubscription?.membership?.content_access_level || 20;
const strategyRequiredLevel = strategy.required_access_level || 0;

if (userAccessLevel < strategyRequiredLevel) {
  // 显示升级提示
  return <UpgradePrompt requiredLevel={strategyRequiredLevel} />;
}
```

---

## 🔄 Webhook 处理

### Stripe Webhook 配置

需要设置 Stripe Webhook 来处理支付完成事件:

1. 在 Stripe Dashboard 中配置 Webhook URL:
   ```
   https://your-domain.com/api/webhooks/stripe
   ```

2. 选择以下事件:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`

3. 获取 Webhook 签名密钥并配置在 `.env.local`

### 数据同步

支付成功后，系统需要:

1. 在 Supabase `user_subscriptions` 表中创建订阅记录
2. 更新用户的会员等级
3. 设置订阅到期时间（1年后）
4. 发送确认邮件

---

## 📱 用户界面

### 定价页面特性

- ✅ 响应式设计，适配移动端
- ✅ 深色模式支持
- ✅ 清晰的价格对比
- ✅ 突出显示推荐方案（Pro）和最超值方案（Max）
- ✅ 玩法合伙人专区，直接跳转 Telegram
- ✅ 详细的FAQ解答

### 支付成功页面

- ✅ 实时验证支付状态
- ✅ 显示订单编号
- ✅ 引导用户操作（前往会员中心或浏览策略）
- ✅ 美观的成功动画

---

## 🧪 测试清单

### 功能测试

- [ ] 未登录用户访问定价页面，点击订阅跳转到登录页
- [ ] 登录后选择 Pro，跳转到 Stripe Checkout
- [ ] 使用测试卡号完成支付
- [ ] 支付成功后跳转到成功页面
- [ ] 会员中心显示 Pro 徽章
- [ ] 访问权限正确控制（60% 策略可访问）
- [ ] 点击玩法合伙人按钮跳转到 Telegram

### 测试用信用卡

```
卡号: 4242 4242 4242 4242
日期: 任意未来日期
CVC: 任意3位数
邮编: 任意数字
```

---

## 🎯 后续优化建议

### 1. 自动续费

- 将 Stripe Checkout mode 从 'payment' 改为 'subscription'
- 处理订阅更新和取消事件
- 在会员中心添加"管理订阅"按钮

### 2. 优惠码系统

- Stripe Checkout 已启用 `allow_promotion_codes: true`
- 在 Stripe Dashboard 中创建优惠码
- 用户在结账时可输入优惠码

### 3. 升级/降级

- 添加升级流程（Free → Pro → Max）
- 计算剩余时间的按比例退款
- 实现平滑的会员等级切换

### 4. 发票和收据

- 自动发送 Stripe 发票到用户邮箱
- 在会员中心添加"下载发票"功能
- 支持中文发票模板

### 5. 使用统计

- 跟踪用户的策略访问次数
- 显示剩余配额（如 Free 用户每日快讯限制）
- 在接近限制时显示升级提示

---

## 📞 支持和文档

### Telegram 社群

- 玩法合伙人咨询: https://t.me/playnew_partner
- 客服支持: https://t.me/playnew_support

### 相关文档

- [Stripe Checkout 文档](https://stripe.com/docs/payments/checkout)
- [Stripe Webhook 文档](https://stripe.com/docs/webhooks)
- [Supabase Auth 文档](https://supabase.com/docs/guides/auth)

---

## ✅ 完成状态

- [x] 重新设计会员定价页面
- [x] 添加玩法合伙人入口
- [x] 恢复并更新 memberships API
- [x] 恢复并更新 Stripe checkout 支付流程
- [x] 创建支付成功页面
- [x] 配置 Directus 会员数据脚本
- [x] 更新导航栏显示会员入口

### 待完成项

- [ ] 配置 Stripe Webhook 处理器
- [ ] 实现订阅记录到 Supabase
- [ ] 添加内容访问权限控制
- [ ] 测试完整支付流程
- [ ] 配置生产环境 Telegram 链接

---

**最后更新**: 2025-11-23
**版本**: 1.0
**状态**: 已完成核心功能，待测试和部署
