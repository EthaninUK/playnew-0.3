# PlayNew 会员系统文件索引

本文档列出会员系统的所有相关文件及其用途。

## 📄 文档文件

| 文件 | 用途 | 状态 |
|------|------|------|
| `MEMBERSHIP-README.md` | 🌟 **主文档** - 完整使用指南 | ✅ 最新 |
| `MEMBERSHIP-PLAYPASS-SETUP.md` | PlayPass 积分版本技术说明 | ✅ 最新 |
| `MEMBERSHIP-DEPLOYMENT-CHECKLIST.md` | 部署检查清单 | ✅ 最新 |
| `MEMBERSHIP-FILES-INDEX.md` | 本文件 - 文件索引 | ✅ 最新 |
| `MEMBERSHIP-SYSTEM-SETUP.md` | ⚠️ Stripe 版本（已废弃） | ❌ 已过时 |

## 💻 前端代码

### 页面组件

| 文件 | 说明 | 关键功能 |
|------|------|----------|
| `frontend/app/pricing/page.tsx` | 会员定价页面 | - 显示三个会员等级<br>- 显示 PP 余额<br>- 余额检查<br>- 购买确认<br>- 集成充值弹窗 |
| `frontend/app/payment/success/page.tsx` | ⚠️ 支付成功页（已废弃） | PlayPass 版本不再需要 |

### API 路由

| 文件 | 端点 | 说明 |
|------|------|------|
| `frontend/app/api/memberships/route.ts` | `GET /api/memberships` | 返回会员方案列表 |
| `frontend/app/api/membership/purchase/route.ts` | `POST /api/membership/purchase` | 🌟 **购买会员**<br>- 验证用户<br>- 检查余额<br>- 扣除 PP<br>- 创建订阅 |
| `frontend/app/api/subscription/route.ts` | `GET /api/subscription` | 查询用户订阅状态 |
| `frontend/app/api/create-checkout-session/route.ts` | ⚠️ Stripe Checkout | 已被 PlayPass 替代 |

### 共享组件

| 文件 | 说明 |
|------|------|
| `frontend/components/shared/Header.tsx` | 导航栏，包含会员链接和徽章显示 |
| `frontend/components/web3/RechargeDialog.tsx` | PlayPass 充值弹窗 |
| `frontend/components/web3/BalanceDisplay.tsx` | PlayPass 余额显示组件 |

## 🗄️ 数据库脚本

| 文件 | 用途 |
|------|------|
| `sql/create-membership-tables.sql` | 🌟 **创建数据库表**<br>- playpass_balances<br>- user_subscriptions<br>- playpass_transactions<br>- 触发器和辅助函数 |
| `sql/create-deduct-playpass-function.sql` | 🌟 **创建 RPC 函数**<br>- deduct_playpass()<br>- 扣除积分并记录交易 |

## 🔧 配置和工具脚本

| 文件 | 用途 | 使用场景 |
|------|------|----------|
| `setup-membership-tiers.js` | Directus 会员等级配置 | 可选（如果使用 Directus CMS） |
| `verify-membership-database.sh` | 验证数据库表是否存在 | 部署前检查 |
| `test-membership-purchase.sh` | 购买流程测试指南 | 测试环境 |

## 📊 数据库表结构

### playpass_balances
**用途**: 存储用户 PlayPass 积分余额

| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid | 主键 |
| user_id | uuid | 用户 ID (唯一) |
| current_balance | bigint | 当前余额 (PP) |
| total_earned | bigint | 总充值 (PP) |
| total_spent | bigint | 总消费 (PP) |
| last_updated | timestamp | 最后更新时间 |
| created_at | timestamp | 创建时间 |

### user_subscriptions
**用途**: 存储用户会员订阅记录

| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid | 主键 |
| user_id | uuid | 用户 ID |
| membership_id | text | 会员方案 ID (free/pro/max) |
| membership_level | integer | 会员等级 (0/1/2) |
| membership_name | text | 会员名称 |
| status | text | 状态 (active/expired/cancelled) |
| start_date | timestamp | 开始时间 |
| end_date | timestamp | 结束时间 |
| payment_method | text | 支付方式 (playpass/stripe) |
| payment_amount_pp | bigint | 支付金额 (PP) |
| created_at | timestamp | 创建时间 |
| updated_at | timestamp | 更新时间 |

### playpass_transactions
**用途**: 记录所有 PlayPass 交易

| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid | 主键 |
| user_id | uuid | 用户 ID |
| type | text | 类型 (earn/spend/refund) |
| amount | bigint | 金额（正数=充值，负数=消费） |
| balance_after | bigint | 交易后余额 |
| description | text | 描述 |
| metadata | jsonb | 附加信息 |
| created_at | timestamp | 创建时间 |

## 🔑 RPC 函数

### deduct_playpass(p_user_id, p_amount, p_description)
**用途**: 扣除用户 PlayPass 积分并记录交易

**参数**:
- `p_user_id` (uuid): 用户 ID
- `p_amount` (bigint): 扣除金额 (PP)
- `p_description` (text): 交易描述

**逻辑**:
1. 检查余额是否足够
2. 原子更新 `playpass_balances` 表
3. 插入交易记录到 `playpass_transactions`

**安全性**:
- `SECURITY DEFINER`: 以函数创建者权限执行
- `GRANT EXECUTE TO authenticated`: 只允许登录用户调用
- 余额检查防止透支

## 📋 快速导航

### 从零开始部署
1. 阅读 [`MEMBERSHIP-README.md`](MEMBERSHIP-README.md)
2. 执行 [`sql/create-membership-tables.sql`](sql/create-membership-tables.sql)
3. 执行 [`sql/create-deduct-playpass-function.sql`](sql/create-deduct-playpass-function.sql)
4. 运行 [`verify-membership-database.sh`](verify-membership-database.sh)
5. 参考 [`MEMBERSHIP-DEPLOYMENT-CHECKLIST.md`](MEMBERSHIP-DEPLOYMENT-CHECKLIST.md) 完成部署

### 了解技术实现
1. [`MEMBERSHIP-PLAYPASS-SETUP.md`](MEMBERSHIP-PLAYPASS-SETUP.md) - 系统架构
2. [`frontend/app/pricing/page.tsx`](frontend/app/pricing/page.tsx:1) - 前端实现
3. [`frontend/app/api/membership/purchase/route.ts`](frontend/app/api/membership/purchase/route.ts:1) - 购买 API

### 测试和验证
1. [`test-membership-purchase.sh`](test-membership-purchase.sh) - 测试指南
2. [`MEMBERSHIP-DEPLOYMENT-CHECKLIST.md`](MEMBERSHIP-DEPLOYMENT-CHECKLIST.md) - 测试清单

## 🎯 核心购买流程

```
用户点击"立即订阅"
    ↓
检查登录状态 (frontend/app/pricing/page.tsx:164)
    ↓
检查余额是否足够 (frontend/app/pricing/page.tsx:175)
    ↓
显示确认对话框 (frontend/app/pricing/page.tsx:183)
    ↓
调用 POST /api/membership/purchase
    ↓
验证用户和会员方案 (route.ts:15-32)
    ↓
查询 playpass_balances (route.ts:35-39)
    ↓
调用 deduct_playpass RPC (route.ts:62-66)
    ├─ 扣除余额（原子操作）
    └─ 记录交易
    ↓
创建/更新 user_subscriptions (route.ts:93-126)
    ↓
返回成功响应 (route.ts:128-136)
    ↓
刷新余额和订阅状态 (page.tsx:211-212)
    ↓
显示成功提示
```

## 🔄 版本历史

| 版本 | 日期 | 说明 |
|------|------|------|
| 2.0 | 2025-11-23 | 🌟 **PlayPass 积分版本**<br>- 移除 Stripe 依赖<br>- 使用 PlayPass 积分支付<br>- 集成充值系统 |
| 1.0 | 2024-10-29 | Stripe 信用卡版本（已废弃） |

## 📞 获取帮助

- **文档问题**: 查看 [`MEMBERSHIP-README.md`](MEMBERSHIP-README.md) FAQ 部分
- **技术问题**: 查看 [`MEMBERSHIP-DEPLOYMENT-CHECKLIST.md`](MEMBERSHIP-DEPLOYMENT-CHECKLIST.md) 故障排查
- **Telegram 支持**: https://t.me/playnew_support

---

**最后更新**: 2025-11-23
**维护者**: PlayNew 开发团队
