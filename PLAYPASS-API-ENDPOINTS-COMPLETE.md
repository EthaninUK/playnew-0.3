# 🎉 PlayPass API 端点开发完成

**日期**: 2025-11-17
**版本**: v2.1.0
**状态**: Phase 2 完成 ✅

---

## ✅ 已完成的 7 个 API 端点

### 1. GET /api/playpass/balance ✅

**功能**: 获取用户 PlayPass 余额和会员信息

**文件**: `frontend/app/api/playpass/balance/route.ts`

**请求参数**:
```typescript
GET /api/playpass/balance?user_id={user_id}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "user_id": "xxx",
    "current_balance": 200,
    "total_earned": 200,
    "total_spent": 0,
    "membership_level": 0,
    "membership_name": "Free",
    "is_max_member": false,
    "earn_multiplier": 1.0,
    "daily_earn_limit": 1000,
    "daily_earned_today": 0,
    "daily_remaining": 1000,
    "pp_level": 1,
    "consecutive_signin_days": 0,
    "total_signin_days": 0
  }
}
```

**核心功能**:
- ✅ 自动创建新用户（初始 200 PP）
- ✅ 自动重置每日计数
- ✅ 返回完整会员信息

---

### 2. POST /api/playpass/earn ✅

**功能**: 用户赚取 PlayPass（读取后台奖励配置）

**文件**: `frontend/app/api/playpass/earn/route.ts`

**请求示例**:
```json
{
  "user_id": "xxx",
  "action_type": "read_strategy",
  "source_id": "strategy-id",
  "metadata": {
    "title": "Strategy Title"
  }
}
```

**响应示例**:
```json
{
  "success": true,
  "message": "成功获得 6 PP",
  "data": {
    "user_id": "xxx",
    "earned_amount": 6,
    "current_balance": 206,
    "base_amount": 5,
    "activity_multiplier": 1.0,
    "membership_multiplier": 1.2,
    "daily_earned_today": 6,
    "daily_limit": 1500
  }
}
```

**核心功能**:
- ✅ 从 `playpass_reward_config` 表读取奖励规则
- ✅ 应用活动倍数（双倍 PP 活动）
- ✅ 应用会员倍率
- ✅ 检查每日上限
- ✅ MAX 会员特殊处理

---

### 3. POST /api/playpass/spend ✅

**功能**: 用户消耗 PlayPass 解锁内容

**文件**: `frontend/app/api/playpass/spend/route.ts`

**请求示例**:
```json
{
  "user_id": "xxx",
  "amount": 50,
  "content_id": "strategy-id",
  "content_type": "strategy",
  "content_title": "Uniswap V3 集中流动性",
  "description": "解锁高级策略"
}
```

**响应示例**:
```json
{
  "success": true,
  "message": "成功消耗 50 PP",
  "data": {
    "user_id": "xxx",
    "spent_amount": 50,
    "current_balance": 156,
    "total_spent": 50,
    "unlock_method": "playpass"
  }
}
```

**核心功能**:
- ✅ MAX 会员免费访问（记录但不扣 PP）
- ✅ 余额检查
- ✅ 记录到 `playpass_transactions`
- ✅ 记录到 `user_unlocked_content`

---

### 4. POST /api/playpass/get-price ✅

**功能**: 获取内容价格（读取后台定价配置）

**文件**: `frontend/app/api/playpass/get-price/route.ts`

**请求示例**:
```json
{
  "content_id": "strategy-id",
  "content_type": "strategy",
  "user_membership_level": 1
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "content_id": "strategy-id",
    "content_type": "strategy",
    "base_price": 100,
    "final_price": 90,
    "membership_level": 1,
    "discount_rate": 0.9,
    "discount_amount": 10,
    "is_free": false,
    "is_free_for_max": true,
    "free_preview_length": 500,
    "matched_rule": {
      "config_key": "strategy_high_risk",
      "config_name": "高风险策略定价",
      "priority": 100
    }
  }
}
```

**核心功能**:
- ✅ 从 `playpass_pricing_config` 表读取定价规则
- ✅ 按优先级匹配条件
- ✅ 应用会员折扣
- ✅ MAX 会员免费

**条件匹配示例**:
```json
{
  "apply_conditions": {
    "risk_level": [4, 5],        // 数组条件
    "category_l1": "defi",       // 精确匹配
    "apy_min": {"min": 10}       // 范围条件
  }
}
```

---

### 5. POST /api/playpass/get-reward ✅

**功能**: 获取奖励金额（读取后台奖励配置，预览）

**文件**: `frontend/app/api/playpass/get-reward/route.ts`

**请求示例**:
```json
{
  "action_type": "read_strategy",
  "user_membership_level": 1
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "action_type": "read_strategy",
    "base_amount": 5,
    "activity_multiplier": 2.0,
    "membership_level": 1,
    "final_amount": 12,
    "is_available": true,
    "limit_type": "daily",
    "limit_count": 10,
    "cooldown_minutes": 5,
    "count_towards_daily_limit": true,
    "matched_rule": {
      "reward_key": "weekend_double_pp",
      "reward_name": "周末双倍 PP 活动",
      "description": "周末阅读策略获得双倍 PP",
      "priority": 100,
      "valid_from": "2025-12-21",
      "valid_until": "2025-12-22"
    }
  }
}
```

**核心功能**:
- ✅ 从 `playpass_reward_config` 表读取奖励规则
- ✅ 计算最终奖励金额（活动倍数 × 会员倍率）
- ✅ 检查活动有效期
- ✅ 返回限制信息（频率、冷却时间）
- ✅ MAX 会员特殊提示

---

### 6. POST /api/playpass/daily-signin ✅

**功能**: 每日签到获得 PP 奖励

**文件**: `frontend/app/api/playpass/daily-signin/route.ts`

**请求示例**:
```json
{
  "user_id": "xxx"
}
```

**响应示例**:
```json
{
  "success": true,
  "message": "签到成功！获得 22 PP",
  "data": {
    "user_id": "xxx",
    "earned_pp": 22,
    "base_amount": 10,
    "streak_bonus": 10,
    "current_balance": 228,
    "consecutive_days": 8,
    "total_signin_days": 8,
    "daily_earned_today": 22,
    "daily_limit": 1500,
    "next_signin": "2025-11-18"
  }
}
```

**核心功能**:
- ✅ 检查今日是否已签到
- ✅ 连续签到奖励（每 7 天 +10 PP）
- ✅ 应用会员倍率
- ✅ 应用活动倍数（双倍 PP 活动）
- ✅ 检查每日上限
- ✅ MAX 会员记录签到但不奖励 PP

**奖励计算**:
```
最终奖励 = (基础奖励 × 活动倍数 × 会员倍率) + 连续签到奖励
例如: (10 × 1.0 × 1.2) + 10 = 22 PP
```

---

### 7. POST /api/playpass/check-access ✅

**功能**: 检查用户是否有权访问内容

**文件**: `frontend/app/api/playpass/check-access/route.ts`

**请求示例**:
```json
{
  "user_id": "xxx",
  "content_id": "strategy-id",
  "content_type": "strategy"
}
```

**响应示例 - 已解锁**:
```json
{
  "success": true,
  "data": {
    "has_access": true,
    "access_method": "playpass",
    "unlocked_at": "2025-11-17T10:00:00Z",
    "pp_spent": 50,
    "message": "内容已解锁"
  }
}
```

**响应示例 - 锁定但余额充足**:
```json
{
  "success": true,
  "data": {
    "has_access": false,
    "access_method": "locked",
    "is_locked": true,
    "price": {
      "base_price": 100,
      "discount_rate": 0.9,
      "final_price": 90
    },
    "user_balance": 200,
    "has_sufficient_balance": true,
    "shortage": 0,
    "free_preview_length": 500,
    "membership_level": 1,
    "message": "需要 90 PP 解锁"
  }
}
```

**响应示例 - MAX 会员**:
```json
{
  "success": true,
  "data": {
    "has_access": true,
    "access_method": "max_member",
    "is_max_member": true,
    "message": "MAX 会员拥有全站访问权限"
  }
}
```

**核心功能**:
- ✅ MAX 会员无限制访问
- ✅ 检查 `user_unlocked_content` 表
- ✅ 查询定价规则并计算价格
- ✅ 检查余额是否充足
- ✅ 返回免费预览长度

---

## 📊 API 端点完整列表

| 序号 | 端点 | 方法 | 功能 | 状态 |
|------|------|------|------|------|
| 1 | `/api/playpass/balance` | GET | 获取用户余额和会员信息 | ✅ |
| 2 | `/api/playpass/earn` | POST | 赚取 PP（后台配置奖励） | ✅ |
| 3 | `/api/playpass/spend` | POST | 消耗 PP 解锁内容 | ✅ |
| 4 | `/api/playpass/get-price` | POST | 获取内容价格（后台配置定价） | ✅ |
| 5 | `/api/playpass/get-reward` | POST | 获取奖励金额（后台配置） | ✅ |
| 6 | `/api/playpass/daily-signin` | POST | 每日签到 | ✅ |
| 7 | `/api/playpass/check-access` | POST | 检查访问权限 | ✅ |

---

## 🎯 核心设计特点

### 1. 后台可配置定价 ✅

**用户问题**: "内容定价 是否在 后台中可以修改"

**解决方案**: `playpass_pricing_config` 表

**使用的 API**:
- `POST /api/playpass/get-price` - 读取定价配置
- `POST /api/playpass/check-access` - 应用定价规则

**示例**:
```sql
-- 在 Directus 后台修改
UPDATE playpass_pricing_config
SET pp_price = 200
WHERE config_key = 'strategy_high_risk';

-- API 立即生效，无需重启
```

### 2. 后台可配置奖励 ✅

**用户问题**: "获取pp 的 数量是否也可以在 后台进行修改"

**解决方案**: `playpass_reward_config` 表

**使用的 API**:
- `POST /api/playpass/earn` - 读取奖励配置并发放 PP
- `POST /api/playpass/get-reward` - 预览奖励金额
- `POST /api/playpass/daily-signin` - 读取签到奖励配置

**示例**:
```sql
-- 在 Directus 后台举办双倍 PP 活动
UPDATE playpass_reward_config
SET reward_multiplier = 2.0,
    valid_from = '2025-12-21',
    valid_until = '2025-12-22'
WHERE reward_key = 'weekend_double_pp';

-- API 自动应用活动倍数
```

### 3. MAX 会员特权 ✅

所有 7 个 API 都正确处理 MAX 会员:

- `balance`: 显示 999,999 余额
- `earn`: 记录但不增加余额（已无限）
- `spend`: 免费访问，记录但不扣 PP
- `get-price`: 返回价格 0
- `get-reward`: 提示无需赚取
- `daily-signin`: 记录签到但不奖励 PP
- `check-access`: 直接返回 `has_access: true`

### 4. 会员倍率体系 ✅

| 等级 | 名称 | 赚取倍率 | 消费折扣 | 每日上限 |
|------|------|----------|----------|----------|
| 0 | Free | 1.0x | 100% | 1000 PP |
| 1 | Pro | 1.2x | 90% | 1500 PP |
| 2 | Premium | 1.5x | 70% | 2500 PP |
| 3 | Partner | 2.0x | 50% | 5000 PP |
| 4 | MAX | 999.99x | 0% (免费) | 无限 |

### 5. 防刷机制 ✅

- ✅ 每日获取上限（1000-5000 PP）
- ✅ 频率限制（`limit_type`, `limit_count`）
- ✅ 冷却时间（`cooldown_minutes`）
- ✅ 签到检查（每天只能签到一次）
- ✅ 交易记录审计

---

## 🔄 API 调用流程示例

### 场景 1: 用户访问策略页面

```typescript
// 1. 获取用户余额
const balanceRes = await fetch('/api/playpass/balance?user_id=xxx');
const { data: userInfo } = await balanceRes.json();

// 2. 检查访问权限
const accessRes = await fetch('/api/playpass/check-access', {
  method: 'POST',
  body: JSON.stringify({
    user_id: 'xxx',
    content_id: 'strategy-id',
    content_type: 'strategy'
  })
});
const { data: access } = await accessRes.json();

if (access.has_access) {
  // 显示完整内容
  showFullContent();
} else {
  // 显示预览 + 解锁按钮
  showPreview(access.free_preview_length);
  showUnlockButton(access.price.final_price);
}
```

### 场景 2: 用户解锁内容

```typescript
// 1. 获取价格
const priceRes = await fetch('/api/playpass/get-price', {
  method: 'POST',
  body: JSON.stringify({
    content_id: 'strategy-id',
    content_type: 'strategy',
    user_membership_level: 1
  })
});
const { data: pricing } = await priceRes.json();

// 2. 用户确认解锁
if (confirm(`解锁需要 ${pricing.final_price} PP，是否继续？`)) {
  // 3. 消耗 PP
  const spendRes = await fetch('/api/playpass/spend', {
    method: 'POST',
    body: JSON.stringify({
      user_id: 'xxx',
      amount: pricing.final_price,
      content_id: 'strategy-id',
      content_type: 'strategy',
      content_title: 'Strategy Title'
    })
  });

  if (spendRes.ok) {
    // 解锁成功，显示完整内容
    showFullContent();
    updateBalance();
  }
}
```

### 场景 3: 用户阅读策略赚取 PP

```typescript
// 用户阅读策略 5 分钟后
setTimeout(async () => {
  const earnRes = await fetch('/api/playpass/earn', {
    method: 'POST',
    body: JSON.stringify({
      user_id: 'xxx',
      action_type: 'read_strategy',
      source_id: 'strategy-id',
      metadata: { title: 'Strategy Title' }
    })
  });

  const { data } = await earnRes.json();
  showNotification(`恭喜获得 ${data.earned_amount} PP！`);
  updateBalance();
}, 5 * 60 * 1000);
```

### 场景 4: 每日签到

```typescript
// 用户点击签到按钮
const signinRes = await fetch('/api/playpass/daily-signin', {
  method: 'POST',
  body: JSON.stringify({ user_id: 'xxx' })
});

const { success, message, data } = await signinRes.json();

if (success) {
  showNotification(message); // "签到成功！获得 12 PP"
  showStreakInfo(`连续签到 ${data.consecutive_days} 天`);
  if (data.consecutive_days % 7 === 0) {
    showBonus(`连续签到 7 天，额外奖励 ${data.streak_bonus} PP！`);
  }
} else {
  showError(message); // "今天已经签到过了"
}
```

---

## 📈 数据库表关联

```
用户操作流程:
┌─────────────────┐
│   用户访问内容   │
└────────┬────────┘
         │
         ├─→ check-access API
         │   ├─→ 查询 user_playpass (余额)
         │   ├─→ 查询 user_unlocked_content (已解锁?)
         │   └─→ 查询 playpass_pricing_config (定价规则)
         │
         ├─→ get-price API
         │   └─→ 查询 playpass_pricing_config (计算价格)
         │
         ├─→ spend API (解锁)
         │   ├─→ 更新 user_playpass (扣除余额)
         │   ├─→ 插入 playpass_transactions (记录交易)
         │   └─→ 插入 user_unlocked_content (记录解锁)
         │
         └─→ earn API (赚取)
             ├─→ 查询 playpass_reward_config (奖励规则)
             ├─→ 更新 user_playpass (增加余额)
             └─→ 插入 playpass_transactions (记录交易)
```

---

## 🎓 后台配置指南

### 修改内容定价

1. 登录 Directus 后台
2. 导航到 **PlayPass Pricing Config**
3. 找到要修改的定价规则
4. 修改 `pp_price` 字段
5. 保存 → ✅ 立即生效

### 举办双倍 PP 活动

1. 登录 Directus 后台
2. 导航到 **PlayPass Reward Config**
3. 找到要加倍的奖励规则
4. 修改 `reward_multiplier` 为 `2.0`
5. 设置 `valid_from` 和 `valid_until`
6. 保存 → ✅ 活动自动生效和结束

### 创建新的定价规则

```json
{
  "config_key": "strategy_vip_content",
  "config_name": "VIP 专属策略",
  "content_type": "strategy",
  "pp_price": 500,
  "apply_conditions": {
    "is_vip": true
  },
  "membership_discounts": {
    "0": 1.0,
    "1": 0.9,
    "2": 0.7,
    "3": 0.5,
    "4": 0.0
  },
  "priority": 200,
  "is_active": true
}
```

---

## 📝 测试建议

### 1. 测试余额查询

```bash
curl 'http://localhost:3000/api/playpass/balance?user_id=test-user-1'
```

### 2. 测试签到

```bash
curl -X POST 'http://localhost:3000/api/playpass/daily-signin' \
  -H 'Content-Type: application/json' \
  -d '{"user_id": "test-user-1"}'
```

### 3. 测试获取价格

```bash
curl -X POST 'http://localhost:3000/api/playpass/get-price' \
  -H 'Content-Type: application/json' \
  -d '{
    "content_id": "strategy-id",
    "content_type": "strategy",
    "user_membership_level": 1
  }'
```

### 4. 测试访问权限

```bash
curl -X POST 'http://localhost:3000/api/playpass/check-access' \
  -H 'Content-Type: application/json' \
  -d '{
    "user_id": "test-user-1",
    "content_id": "strategy-id",
    "content_type": "strategy"
  }'
```

---

## 🚀 下一步: Phase 3 - 前端组件

现在 API 端点已全部完成，下一步是开发前端组件:

1. **PlayPass 余额显示组件** (`PPBalance.tsx`)
2. **内容解锁组件** (`ContentUnlock.tsx`)
3. **每日签到组件** (`DailySignin.tsx`)
4. **PP 交易记录组件** (`PPTransactions.tsx`)
5. **会员等级展示组件** (`MembershipBadge.tsx`)

---

## ✅ Phase 2 完成总结

**已完成**:
- ✅ 7 个 API 端点全部开发完成
- ✅ 完整实现后台可配置定价
- ✅ 完整实现后台可配置奖励
- ✅ MAX 会员特权处理
- ✅ 会员倍率体系
- ✅ 防刷机制

**文件清单**:
```
frontend/app/api/playpass/
├── balance/route.ts          ✅
├── earn/route.ts             ✅
├── spend/route.ts            ✅
├── get-price/route.ts        ✅
├── get-reward/route.ts       ✅
├── daily-signin/route.ts     ✅
└── check-access/route.ts     ✅
```

**代码统计**:
- 总行数: ~1400 行
- TypeScript 类型安全
- 完整错误处理
- 详细注释

---

**准备好继续 Phase 3 前端组件开发了吗？** 🚀

---

**项目**: PlayNew.ai PlayPass 系统
**版本**: v2.1.0
**作者**: Claude Code (Anthropic)
**日期**: 2025-11-17
