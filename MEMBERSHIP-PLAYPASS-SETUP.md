# PlayNew 会员系统 - PlayPass 积分支付版

## 📋 系统概览

PlayNew 会员系统已改用 **PlayPass 积分** 作为支付方式，取代 Stripe 信用卡支付。用户通过加密货币充值 PlayPass，然后使用积分购买会员。

### 会员等级定价

| 等级 | PP 价格 | 美元参考 | 访问权限 |
|------|---------|----------|----------|
| **Free** | 0 PP | $0 | 20% 基础策略 |
| **Pro** | 69,900 PP | $699 | 60% 中级策略 |
| **Max** | 129,900 PP | $1299 | 100% 全部策略 |

### PlayPass 兑换比例

**1 USD = 100 PP**

### 支付流程

1. 用户充值 PlayPass（通过加密货币：ETH, USDC, USDT等）
2. 选择会员方案
3. 系统检查 PP 余额
4. 确认购买并扣除 PP
5. 激活会员权益（有效期1年）

---

## 🗂️ 文件修改清单

### 1. 定价页面

#### [frontend/app/pricing/page.tsx](frontend/app/pricing/page.tsx)
- ✅ 完全重写，使用 PlayPass 积分定价
- ✅ 显示当前 PP 余额
- ✅ 集成充值弹窗 (RechargeDialog)
- ✅ 余额不足时显示提示
- ✅ 购买前确认对话框
- ✅ 购买成功后刷新余额和订阅状态

**关键功能**:
```typescript
// 检查余额
if (currentBalance < membership.price_pp) {
  setShowRechargeDialog(true);
  return;
}

// 购买会员
const response = await fetch('/api/membership/purchase', {
  method: 'POST',
  body: JSON.stringify({
    membershipId: membership.id,
    membershipLevel: membership.level,
  }),
});
```

### 2. 会员购买 API

#### [frontend/app/api/membership/purchase/route.ts](frontend/app/api/membership/purchase/route.ts)
- ✅ 新建 API 端点
- ✅ 验证用户登录状态
- ✅ 检查 PP 余额是否足够
- ✅ 调用 Supabase RPC 扣除积分
- ✅ 创建/更新订阅记录

**流程**:
1. 验证用户身份
2. 验证会员方案
3. 查询 PP 余额
4. 扣除积分 (`deduct_playpass` RPC)
5. 创建/更新 `user_subscriptions` 记录
6. 返回购买结果

### 3. 会员方案 API

#### [frontend/app/api/memberships/route.ts](frontend/app/api/memberships/route.ts)
- ✅ 更新价格字段为 PP 积分
- ✅ 保持与前端一致的定价

---

## 🚀 部署步骤

### 1. 确保 Supabase 表结构正确

需要以下表：

**playpass_balances**
```sql
- user_id (uuid, FK to auth.users)
- current_balance (bigint)
- total_earned (bigint)
- total_spent (bigint)
- last_updated (timestamp)
```

**user_subscriptions**
```sql
- id (uuid)
- user_id (uuid, FK to auth.users)
- membership_id (text)
- membership_level (int)
- membership_name (text)
- status (text)
- start_date (timestamp)
- end_date (timestamp)
- payment_method (text) -- 'playpass'
- payment_amount_pp (bigint) -- PP 金额
```

### 2. 创建 Supabase RPC 函数

需要创建 `deduct_playpass` 函数：

```sql
CREATE OR REPLACE FUNCTION deduct_playpass(
  p_user_id uuid,
  p_amount bigint,
  p_description text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- 检查余额
  IF (SELECT current_balance FROM playpass_balances WHERE user_id = p_user_id) < p_amount THEN
    RAISE EXCEPTION 'Insufficient balance';
  END IF;

  -- 扣除余额
  UPDATE playpass_balances
  SET
    current_balance = current_balance - p_amount,
    total_spent = total_spent + p_amount,
    last_updated = NOW()
  WHERE user_id = p_user_id;

  -- 记录交易
  INSERT INTO playpass_transactions (
    user_id,
    type,
    amount,
    balance_after,
    description,
    created_at
  )
  VALUES (
    p_user_id,
    'spend',
    -p_amount,
    (SELECT current_balance FROM playpass_balances WHERE user_id = p_user_id),
    p_description,
    NOW()
  );
END;
$$;
```

### 3. 测试购买流程

1. **充值 PlayPass**:
   - 访问 `/pricing` 页面
   - 点击"充值"按钮
   - 使用测试加密货币充值（至少 $699 = 69,900 PP）

2. **购买 Pro 会员**:
   - 确保余额 ≥ 69,900 PP
   - 点击 Pro 方案的"立即订阅"
   - 确认购买
   - 验证会员状态更新

3. **验证结果**:
   - PP 余额减少 69,900
   - 会员中心显示 Pro 徽章
   - 到期时间为 1 年后
   - `playpass_transactions` 表有扣款记录

---

## 📊 优势对比

### PlayPass 积分 vs Stripe

| 特性 | PlayPass | Stripe |
|------|----------|--------|
| **支付方式** | 加密货币 | 信用卡 |
| **手续费** | 低（链上Gas费） | 2.9% + $0.30 |
| **到账时间** | 即时 | T+2天 |
| **用户体验** | Web3 原生 | 传统 |
| **退款** | 退回PP | 退回卡 |
| **支持币种** | ETH, USDC, USDT等 | USD, EUR等 |

### 为什么选择 PlayPass？

1. **更低成本**: 无信用卡手续费
2. **即时到账**: 链上确认后立即可用
3. **更灵活**: 积分可用于多种场景
4. **Web3 友好**: 符合加密用户习惯
5. **统一生态**: 积分、会员、交易一体化

---

## 🎨 用户界面特性

### 定价页面增强

1. **余额显示**:
   - 顶部显示当前 PP 余额
   - 余额不足时高亮提示
   - 一键充值按钮

2. **智能引导**:
   - 余额不足：显示"充值后购买"
   - 余额充足：显示"立即订阅"
   - 已购买：显示"当前方案"

3. **充值集成**:
   - 弹窗式充值界面
   - 支持多种加密货币
   - 显示兑换比例和奖励

4. **购买确认**:
   - 显示扣除金额
   - 显示购买后余额
   - 明确有效期

---

## 🧪 测试清单

### 前端测试

- [ ] 未登录访问定价页，点击订阅跳转登录
- [ ] 登录后显示当前 PP 余额
- [ ] 余额不足时显示提示信息
- [ ] 点击充值按钮打开充值弹窗
- [ ] 充值成功后余额实时更新
- [ ] 余额充足后可以购买会员
- [ ] 购买确认对话框显示正确
- [ ] 购买成功后会员状态更新
- [ ] 购买后 PP 余额减少正确金额

### API 测试

- [ ] 未登录调用购买 API 返回 401
- [ ] 余额不足返回错误
- [ ] 成功购买返回正确数据
- [ ] `playpass_balances` 余额正确扣除
- [ ] `playpass_transactions` 有交易记录
- [ ] `user_subscriptions` 订阅记录正确
- [ ] 重复购买更新现有订阅

### 数据库测试

```sql
-- 查询用户余额
SELECT * FROM playpass_balances WHERE user_id = 'USER_ID';

-- 查询交易记录
SELECT * FROM playpass_transactions
WHERE user_id = 'USER_ID'
ORDER BY created_at DESC;

-- 查询订阅状态
SELECT * FROM user_subscriptions WHERE user_id = 'USER_ID';
```

---

## 📝 FAQ 更新

定价页面已更新 FAQ，突出 PlayPass 优势：

1. **为什么使用 PlayPass？**: 更灵活、费用更低、支持多种加密货币
2. **如何充值？**: 选择金额 → 加密货币支付 → 即时到账
3. **兑换比例**: 1 USD = 100 PP
4. **退款政策**: 7天内退回 PP 积分

---

## 🔄 后续优化

### 1. 自动续费

- 到期前30天提醒用户
- 一键续费功能
- 自动扣除 PP（需用户授权）

### 2. 会员升级

- Pro → Max 只需补差价
- 按比例计算剩余时间
- 升级后立即生效

### 3. 积分赠送

- 新用户注册送 1,000 PP
- 推荐好友注册送 5,000 PP
- 节日活动充值奖励

### 4. 批量购买

- 支持企业批量购买
- 提供团队管理功能
- 批量购买优惠

---

## ✅ 完成状态

- [x] 修改定价页面使用 PlayPass
- [x] 创建会员购买 API
- [x] 集成充值弹窗
- [x] 余额检查逻辑
- [x] 购买确认流程
- [x] 订阅记录创建
- [x] FAQ 更新

### 已移除

- [x] Stripe Checkout集成
- [x] Stripe Webhook 处理
- [x] 信用卡支付流程
- [x] 支付成功页面（不再需要）

---

## 📞 技术支持

### Telegram

- 客服支持: https://t.me/playnew_support
- 玩法合伙人: https://t.me/playnew_partner

### 相关文档

- [PlayPass 充值系统](./PLAYPASS-README.md)
- [会员权益说明](./MEMBERSHIP-BENEFITS.md)
- [Supabase 数据库设计](./DATABASE-SCHEMA.md)

---

**最后更新**: 2025-11-23
**版本**: 2.0 (PlayPass版本)
**状态**: ✅ 已完成并可用
