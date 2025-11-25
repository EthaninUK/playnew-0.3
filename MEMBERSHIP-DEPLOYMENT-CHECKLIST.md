# PlayPass 会员系统部署清单

## ✅ 前置检查

### 1. 环境变量配置

检查 `frontend/.env.local` 文件包含以下变量：

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe (暂时保留，未来可能移除)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. 数据库表检查

运行验证脚本：
```bash
cd /Users/m1/PlayNew_0.3
source frontend/.env.local
./verify-membership-database.sh
```

应该看到：
- ✅ playpass_balances 表存在
- ✅ user_subscriptions 表存在
- ✅ playpass_transactions 表存在

### 3. 创建 RPC 函数

在 Supabase Dashboard → SQL Editor 中执行：
```bash
cat sql/create-deduct-playpass-function.sql
```

或直接在 Supabase SQL Editor 粘贴执行该文件内容。

---

## 🗄️ 数据库表结构验证

### playpass_balances

```sql
CREATE TABLE IF NOT EXISTS playpass_balances (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  current_balance bigint DEFAULT 0 NOT NULL,
  total_earned bigint DEFAULT 0 NOT NULL,
  total_spent bigint DEFAULT 0 NOT NULL,
  last_updated timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_playpass_balances_user_id ON playpass_balances(user_id);

-- RLS 策略
ALTER TABLE playpass_balances ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own balance"
  ON playpass_balances FOR SELECT
  USING (auth.uid() = user_id);
```

### user_subscriptions

```sql
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  membership_id text NOT NULL,
  membership_level integer NOT NULL,
  membership_name text NOT NULL,
  status text DEFAULT 'active',
  start_date timestamp with time zone NOT NULL,
  end_date timestamp with time zone NOT NULL,
  payment_method text DEFAULT 'playpass',
  payment_amount_pp bigint,
  stripe_subscription_id text,
  stripe_customer_id text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);

-- RLS 策略
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription"
  ON user_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription"
  ON user_subscriptions FOR UPDATE
  USING (auth.uid() = user_id);
```

### playpass_transactions

```sql
CREATE TABLE IF NOT EXISTS playpass_transactions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL, -- 'earn' or 'spend'
  amount bigint NOT NULL, -- 正数为充值，负数为消费
  balance_after bigint NOT NULL,
  description text,
  metadata jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_playpass_transactions_user_id ON playpass_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_playpass_transactions_created_at ON playpass_transactions(created_at DESC);

-- RLS 策略
ALTER TABLE playpass_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions"
  ON playpass_transactions FOR SELECT
  USING (auth.uid() = user_id);
```

---

## 🧪 测试流程

### 步骤 1: 创建测试用户

1. 访问 `http://localhost:3000/auth/register`
2. 注册新账号: `test@playnew.com`
3. 登录成功后，系统应该自动创建 `playpass_balances` 记录

### 步骤 2: 充值 PlayPass

1. 访问 `http://localhost:3000/pricing`
2. 点击"充值"按钮
3. 选择充值金额（建议充值至少 70,000 PP 以测试 Pro 会员）
4. 使用测试加密货币完成支付
5. 验证余额更新

**验证命令**:
```sql
SELECT * FROM playpass_balances WHERE user_id = 'YOUR_USER_ID';
```

### 步骤 3: 购买 Pro 会员

1. 确保余额 ≥ 69,900 PP
2. 点击 Pro 方案的"立即订阅"
3. 确认购买对话框
4. 验证：
   - 余额减少 69,900 PP
   - 显示 Pro 会员徽章
   - 会员中心显示到期时间（1年后）

**验证命令**:
```sql
-- 检查余额
SELECT current_balance, total_spent FROM playpass_balances WHERE user_id = 'YOUR_USER_ID';

-- 检查交易记录
SELECT * FROM playpass_transactions
WHERE user_id = 'YOUR_USER_ID'
ORDER BY created_at DESC
LIMIT 5;

-- 检查订阅状态
SELECT * FROM user_subscriptions WHERE user_id = 'YOUR_USER_ID';
```

### 步骤 4: 测试余额不足场景

1. 退出登录，重新注册新账号
2. 不充值，直接尝试购买 Pro 会员
3. 应该看到"余额不足"提示
4. 点击"充值后购买"按钮
5. 充值弹窗打开

### 步骤 5: 测试会员升级

1. 使用 Pro 会员账号
2. 尝试购买 Max 会员
3. 应该显示"立即升级"按钮
4. 完成购买后，会员等级更新为 Max

---

## 📊 监控和日志

### 查询会员统计

```sql
-- 各等级会员数量
SELECT
  membership_level,
  membership_name,
  COUNT(*) as count
FROM user_subscriptions
WHERE status = 'active'
GROUP BY membership_level, membership_name
ORDER BY membership_level;

-- 今日购买记录
SELECT
  u.email,
  s.membership_name,
  s.payment_amount_pp,
  s.created_at
FROM user_subscriptions s
JOIN auth.users u ON s.user_id = u.id
WHERE s.created_at >= CURRENT_DATE
ORDER BY s.created_at DESC;

-- PlayPass 消费统计
SELECT
  DATE(created_at) as date,
  SUM(ABS(amount)) as total_spent_pp
FROM playpass_transactions
WHERE type = 'spend' AND description LIKE '%会员%'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

### API 错误日志

检查 Next.js 开发服务器输出：
```bash
cd /Users/m1/PlayNew_0.3/frontend
npm run dev
```

查看：
- `购买会员失败:` 开头的错误
- `扣除积分失败:` RPC 调用错误
- `更新订阅失败:` 数据库写入错误

---

## 🚨 常见问题排查

### 问题 1: "deduct_playpass function not found"

**原因**: RPC 函数未创建

**解决**:
```bash
# 在 Supabase Dashboard → SQL Editor 执行
cat /Users/m1/PlayNew_0.3/sql/create-deduct-playpass-function.sql
```

### 问题 2: "Insufficient balance" 但余额充足

**原因**: 可能是并发问题或余额读取延迟

**解决**:
1. 刷新页面重新获取余额
2. 检查 `playpass_balances` 表的 `current_balance` 值
3. 确保没有其他并发购买操作

### 问题 3: 购买成功但会员状态未更新

**原因**: `user_subscriptions` 表写入失败

**解决**:
1. 检查 API 日志是否有 `创建订阅失败` 错误
2. 验证 `user_subscriptions` 表存在且有正确权限
3. 检查 RLS 策略是否阻止写入

### 问题 4: 充值成功但余额未更新

**原因**: PlayPass 充值系统未正确更新余额

**解决**:
1. 检查 `/api/web3/recharge-credits` 端点
2. 验证充值交易是否记录在 `playpass_transactions`
3. 手动刷新页面或重新登录

---

## 🔐 安全检查

### RLS 策略验证

```sql
-- 测试：用户只能看到自己的余额
SELECT * FROM playpass_balances; -- 应该只返回当前用户的记录

-- 测试：用户只能看到自己的订阅
SELECT * FROM user_subscriptions; -- 应该只返回当前用户的记录

-- 测试：用户只能看到自己的交易
SELECT * FROM playpass_transactions; -- 应该只返回当前用户的记录
```

### RPC 函数安全

- ✅ `SECURITY DEFINER` - 以函数创建者权限执行
- ✅ 余额检查 - 防止透支
- ✅ 原子操作 - 扣款和记录事务一致
- ✅ `GRANT EXECUTE TO authenticated` - 只允许登录用户调用

---

## 📝 部署前最后检查

- [ ] 环境变量已配置
- [ ] 数据库表已创建
- [ ] RPC 函数已创建
- [ ] RLS 策略已启用
- [ ] 索引已创建
- [ ] 测试用户购买流程成功
- [ ] 余额扣除正确
- [ ] 交易记录正确
- [ ] 会员状态更新正确
- [ ] API 日志无错误

---

## 🚀 生产环境部署

### 1. 更新环境变量

```bash
# 生产环境 .env.local
NEXT_PUBLIC_SUPABASE_URL=https://prod-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=prod-anon-key
SUPABASE_SERVICE_ROLE_KEY=prod-service-role-key
NEXT_PUBLIC_APP_URL=https://playnew.com
```

### 2. 数据库迁移

在生产环境 Supabase Dashboard 执行：
1. 创建所有表（如果不存在）
2. 创建 `deduct_playpass` RPC 函数
3. 启用 RLS 策略
4. 创建索引

### 3. 部署前端

```bash
cd /Users/m1/PlayNew_0.3/frontend
npm run build
npm run start
```

### 4. 监控

- 设置 Supabase 数据库告警
- 监控 API 错误日志
- 定期检查会员购买统计

---

**最后更新**: 2025-11-23
**版本**: 1.0
**状态**: ✅ 准备部署
