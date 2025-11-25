# PlayNew 会员系统完整指南

## 📚 目录

1. [系统概览](#系统概览)
2. [快速开始](#快速开始)
3. [文件结构](#文件结构)
4. [部署步骤](#部署步骤)
5. [测试指南](#测试指南)
6. [常见问题](#常见问题)

---

## 系统概览

PlayNew 会员系统使用 **PlayPass 积分** 作为支付方式，用户通过加密货币充值 PlayPass 积分，然后使用积分购买会员。

### 会员等级

| 等级 | PP 价格 | 美元参考 | 内容访问权限 | 年度价格 |
|------|---------|----------|--------------|----------|
| **Free** | 0 PP | $0 | 20% | 免费 |
| **Pro** | 69,900 PP | $699 | 60% | $699/年 |
| **Max** | 129,900 PP | $1299 | 100% | $1299/年 |

**兑换比例**: 1 USD = 100 PP

### 核心特性

- ✅ 使用 PlayPass 积分购买（Web3 原生）
- ✅ 年度订阅制，无自动续费
- ✅ 支持多种加密货币充值（ETH, USDC, USDT）
- ✅ 实时余额检查和更新
- ✅ 会员升级功能
- ✅ 玩法合伙人计划集成
- ✅ 完整的交易记录

---

## 快速开始

### 前置要求

- Node.js 18+
- PostgreSQL (通过 Supabase)
- 已配置的 PlayPass 充值系统

### 1. 克隆代码

```bash
cd /Users/m1/PlayNew_0.3
git pull origin main
```

### 2. 安装依赖

```bash
cd frontend
npm install
```

### 3. 配置环境变量

编辑 `frontend/.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. 创建数据库表

在 Supabase Dashboard → SQL Editor 执行:

```bash
cat sql/create-membership-tables.sql
```

### 5. 创建 RPC 函数

```bash
cat sql/create-deduct-playpass-function.sql
```

### 6. 启动开发服务器

```bash
cd frontend
npm run dev
```

访问 http://localhost:3000/pricing 查看会员页面。

---

## 文件结构

### 核心文件

```
PlayNew_0.3/
├── frontend/
│   ├── app/
│   │   ├── pricing/
│   │   │   └── page.tsx              # 会员定价页面 (PlayPass 版本)
│   │   ├── api/
│   │   │   ├── memberships/
│   │   │   │   └── route.ts          # 会员方案 API
│   │   │   ├── membership/
│   │   │   │   └── purchase/
│   │   │   │       └── route.ts      # 购买 API (PlayPass)
│   │   │   ├── subscription/
│   │   │   │   └── route.ts          # 订阅状态查询
│   │   │   └── web3/
│   │   │       └── recharge-credits/ # PlayPass 充值 API
│   │   └── payment/
│   │       └── success/
│   │           └── page.tsx          # 支付成功页面 (已弃用)
│   └── components/
│       ├── shared/
│       │   └── Header.tsx            # 导航栏 (含会员链接)
│       └── web3/
│           ├── RechargeDialog.tsx    # 充值弹窗
│           └── BalanceDisplay.tsx    # 余额显示
├── sql/
│   ├── create-membership-tables.sql  # 数据库表创建脚本
│   └── create-deduct-playpass-function.sql  # RPC 函数
├── MEMBERSHIP-PLAYPASS-SETUP.md      # PlayPass 版本说明
├── MEMBERSHIP-DEPLOYMENT-CHECKLIST.md # 部署清单
├── MEMBERSHIP-README.md              # 本文件
├── verify-membership-database.sh     # 数据库验证脚本
├── test-membership-purchase.sh       # 购买测试脚本
└── setup-membership-tiers.js         # Directus 配置脚本 (可选)
```

### 已废弃文件

这些文件是 Stripe 支付版本，已不再使用：

- `app/api/create-checkout-session/route.ts` - Stripe Checkout (已被 PlayPass 替代)
- `app/payment/success/page.tsx` - 支付成功页面 (PlayPass 直接在定价页完成)
- `MEMBERSHIP-SYSTEM-SETUP.md` - Stripe 版本文档

---

## 部署步骤

### 开发环境

1. **验证数据库配置**

```bash
cd /Users/m1/PlayNew_0.3
source frontend/.env.local
./verify-membership-database.sh
```

应该看到所有表都存在。

2. **创建数据库表（如果不存在）**

在 Supabase Dashboard → SQL Editor:

```sql
-- 执行表创建脚本
\i sql/create-membership-tables.sql

-- 执行 RPC 函数脚本
\i sql/create-deduct-playpass-function.sql
```

3. **验证 RPC 函数**

在 Supabase Dashboard → Database → Functions 查看是否有 `deduct_playpass` 函数。

4. **测试购买流程**

```bash
./test-membership-purchase.sh
```

按照提示完成测试。

### 生产环境

参考 [MEMBERSHIP-DEPLOYMENT-CHECKLIST.md](./MEMBERSHIP-DEPLOYMENT-CHECKLIST.md) 完整部署清单。

---

## 测试指南

### 完整测试流程

#### 1. 注册测试账号

```
URL: http://localhost:3000/auth/register
Email: test-member@playnew.com
Password: Test123456!
```

#### 2. 充值 PlayPass

1. 访问 `/pricing` 页面
2. 点击顶部的"充值"按钮
3. 选择充值金额: $700 (至少能购买 Pro)
4. 使用测试加密货币完成支付
5. 验证余额显示为 70,000 PP

**验证命令**:
```sql
SELECT current_balance FROM playpass_balances
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'test-member@playnew.com');
-- 应该返回: 70000
```

#### 3. 购买 Pro 会员

1. 确保页面显示余额 ≥ 69,900 PP
2. 点击 Pro 方案的"立即订阅"按钮
3. 确认购买对话框:
   ```
   确认购买 Pro 会员？

   价格: 69,900 PP
   有效期: 1年
   购买后余额: 100 PP
   ```
4. 点击"确定"
5. 等待购买成功提示
6. 验证：
   - ✅ 余额减少到 100 PP
   - ✅ 页面显示"当前方案"徽章
   - ✅ 会员中心显示 Pro 徽章

**验证命令**:
```sql
-- 检查余额
SELECT current_balance, total_spent FROM playpass_balances
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'test-member@playnew.com');
-- 应该返回: current_balance=100, total_spent=69900

-- 检查交易记录
SELECT type, amount, description FROM playpass_transactions
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'test-member@playnew.com')
ORDER BY created_at DESC LIMIT 1;
-- 应该返回: type='spend', amount=-69900, description='购买 Pro 会员 (1年)'

-- 检查订阅
SELECT membership_name, status, end_date FROM user_subscriptions
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'test-member@playnew.com');
-- 应该返回: membership_name='Pro', status='active', end_date=1年后
```

#### 4. 测试余额不足

1. 退出登录
2. 注册新账号: `test-poor@playnew.com`
3. 不充值，直接访问 `/pricing`
4. 点击 Pro 会员的按钮
5. 应该看到:
   - ⚠️ "余额不足" 警告框
   - 按钮文本变为"充值后购买"
   - 点击按钮打开充值弹窗

#### 5. 测试会员升级

1. 使用 Pro 会员账号登录
2. 充值 130,000 PP（足够购买 Max）
3. 访问 `/pricing`
4. Max 会员卡片应该显示"立即升级"按钮
5. 购买 Max 会员
6. 验证：
   - 会员等级从 Pro 升级到 Max
   - `user_subscriptions` 记录被更新（不是新增）
   - 新的到期时间为当前时间 + 1年

---

## 常见问题

### Q1: "deduct_playpass function not found"

**原因**: RPC 函数未创建

**解决**:
```bash
# 在 Supabase Dashboard → SQL Editor 执行
cat sql/create-deduct-playpass-function.sql
```

### Q2: 购买成功但余额未扣除

**原因**: `deduct_playpass` RPC 执行失败

**检查**:
1. 查看浏览器 Console 是否有错误
2. 查看 Next.js 服务器日志: `扣除积分失败:`
3. 在 Supabase Dashboard → Database → Logs 查看错误

**常见原因**:
- RPC 函数未正确创建
- RPC 函数权限不足（需要 `GRANT EXECUTE TO authenticated`）
- 余额表 `playpass_balances` 不存在

### Q3: 购买后会员状态未更新

**原因**: `user_subscriptions` 表写入失败

**检查**:
```sql
-- 检查表是否存在
SELECT * FROM user_subscriptions LIMIT 1;

-- 检查 RLS 策略
SELECT * FROM pg_policies WHERE tablename = 'user_subscriptions';
```

**解决**:
```bash
# 重新执行表创建脚本
cat sql/create-membership-tables.sql
```

### Q4: 充值成功但余额未显示

**原因**: PlayPass 充值系统问题

**检查**:
1. 访问 `/api/web3/recharge-credits` 查看余额
2. 刷新页面或重新登录
3. 检查 `playpass_balances` 表数据

### Q5: 想要退回 Stripe 支付

如果想要退回 Stripe 支付方式，需要：

1. 恢复 `app/api/create-checkout-session/route.ts`
2. 修改 `app/pricing/page.tsx` 使用 Stripe Checkout
3. 重新启用 `app/payment/success/page.tsx`
4. 配置 Stripe Webhook 处理订阅创建

参考旧版本文档: `MEMBERSHIP-SYSTEM-SETUP.md`（已废弃）

### Q6: 如何批量导入会员？

如果需要从旧系统迁移会员数据：

```sql
-- 示例：批量创建会员记录
INSERT INTO user_subscriptions (
  user_id,
  membership_id,
  membership_level,
  membership_name,
  status,
  start_date,
  end_date,
  payment_method,
  payment_amount_pp
)
SELECT
  u.id,
  'pro',
  1,
  'Pro',
  'active',
  NOW(),
  NOW() + INTERVAL '1 year',
  'playpass',
  69900
FROM auth.users u
WHERE u.email IN ('user1@example.com', 'user2@example.com');
```

---

## API 文档

### GET /api/memberships

获取所有会员方案。

**响应**:
```json
{
  "memberships": [
    {
      "id": "free",
      "name": "Free",
      "level": 0,
      "price_yearly_usd": 0,
      "content_access_level": 20,
      "features": { ... }
    },
    {
      "id": "pro",
      "name": "Pro",
      "level": 1,
      "price_yearly_usd": 699,
      "content_access_level": 60,
      "features": { ... }
    },
    {
      "id": "max",
      "name": "Max",
      "level": 2,
      "price_yearly_usd": 1299,
      "content_access_level": 100,
      "features": { ... }
    }
  ]
}
```

### POST /api/membership/purchase

购买会员。

**请求**:
```json
{
  "membershipId": "pro",
  "membershipLevel": 1
}
```

**响应（成功）**:
```json
{
  "success": true,
  "data": {
    "membership": "Pro",
    "endDate": "2026-11-23T10:00:00Z",
    "amountPaid": 69900,
    "newBalance": 100
  }
}
```

**响应（失败）**:
```json
{
  "success": false,
  "error": "余额不足，需要 69900 PP，当前余额 0 PP"
}
```

### GET /api/subscription

获取当前用户订阅状态。

**响应**:
```json
{
  "subscription": {
    "membership": {
      "id": "pro",
      "name": "Pro",
      "level": 1
    },
    "status": "active",
    "end_date": "2026-11-23T10:00:00Z"
  }
}
```

### GET /api/web3/recharge-credits

获取 PlayPass 余额。

**响应**:
```json
{
  "success": true,
  "data": {
    "balance": {
      "current": 70000,
      "total_earned": 70000,
      "total_spent": 0
    }
  }
}
```

---

## 数据库模型

### playpass_balances

```sql
CREATE TABLE playpass_balances (
  id uuid PRIMARY KEY,
  user_id uuid UNIQUE NOT NULL REFERENCES auth.users(id),
  current_balance bigint DEFAULT 0,
  total_earned bigint DEFAULT 0,
  total_spent bigint DEFAULT 0,
  last_updated timestamp,
  created_at timestamp
);
```

### user_subscriptions

```sql
CREATE TABLE user_subscriptions (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  membership_id text NOT NULL,
  membership_level integer NOT NULL,
  membership_name text NOT NULL,
  status text DEFAULT 'active',
  start_date timestamp NOT NULL,
  end_date timestamp NOT NULL,
  payment_method text DEFAULT 'playpass',
  payment_amount_pp bigint,
  created_at timestamp,
  updated_at timestamp
);
```

### playpass_transactions

```sql
CREATE TABLE playpass_transactions (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  type text NOT NULL,  -- 'earn', 'spend', 'refund'
  amount bigint NOT NULL,
  balance_after bigint NOT NULL,
  description text,
  metadata jsonb,
  created_at timestamp
);
```

---

## 监控和分析

### 会员统计查询

```sql
-- 各等级会员数量
SELECT
  membership_level,
  membership_name,
  COUNT(*) as count,
  SUM(payment_amount_pp) as total_revenue_pp
FROM user_subscriptions
WHERE status = 'active'
GROUP BY membership_level, membership_name
ORDER BY membership_level;

-- 今日新增会员
SELECT COUNT(*) as new_members_today
FROM user_subscriptions
WHERE created_at >= CURRENT_DATE;

-- 本月收入（PP）
SELECT SUM(payment_amount_pp) as monthly_revenue_pp
FROM user_subscriptions
WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)
  AND payment_method = 'playpass';

-- 即将过期的会员（7天内）
SELECT
  u.email,
  s.membership_name,
  s.end_date
FROM user_subscriptions s
JOIN auth.users u ON s.user_id = u.id
WHERE s.status = 'active'
  AND s.end_date BETWEEN NOW() AND NOW() + INTERVAL '7 days'
ORDER BY s.end_date;
```

---

## 支持和联系

- **Telegram 客服**: https://t.me/playnew_support
- **玩法合伙人**: https://t.me/playnew_partner
- **技术文档**: 查看本目录下的其他 MD 文件

---

**最后更新**: 2025-11-23
**版本**: 2.0 (PlayPass 版本)
**状态**: ✅ 已完成，可部署
