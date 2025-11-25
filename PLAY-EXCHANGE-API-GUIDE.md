# 玩法交换系统 API 使用指南

## 📋 API 端点总览

### 1. 获取今日精选玩法
```
GET /api/play-exchange/daily-featured
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "date": "2025-01-14",
    "theme_label": "DeFi 挖矿专场",
    "plays": [
      {
        "id": "uuid",
        "title": "Uniswap V3 集中流动性挖矿",
        "slug": "uniswap-v3-liquidity",
        "summary": "...",
        "category": "defi-farming",
        "risk_level": 3,
        "apy_min": 5,
        "apy_max": 20,
        "cover_image": "...",
        "card_index": 0
      },
      // 另外两个玩法...
    ]
  }
}
```

---

### 2. 获取用户信息
```
GET /api/play-exchange/user-info
Authorization: Bearer {access_token}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "user_id": "uuid",
    "email": "user@example.com",
    "credits": 5,
    "first_draw_used": false,
    "referral_code": "ABC123",
    "total_plays": 3,
    "my_plays": ["uuid1", "uuid2", "uuid3"]
  }
}
```

---

### 3. 翻牌交换玩法
```
POST /api/play-exchange/draw
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "card_index": 0,
  "play_id": "uuid"
}
```

**业务逻辑**:
- 首次翻牌免费（`first_draw_used = false`）
- 后续翻牌消耗 1 积分
- 检查是否已拥有该玩法
- 自动创建交换记录和积分交易记录

**响应示例**:
```json
{
  "success": true,
  "data": {
    "exchange_type": "first_free",
    "credits_spent": 0,
    "credits_remaining": 5,
    "play": {
      "id": "uuid",
      "title": "Uniswap V3 集中流动性挖矿",
      "slug": "uniswap-v3-liquidity",
      "content": "详细内容..."
    },
    "message": "🎉 恭喜！这是您的首次免费翻牌"
  }
}
```

**错误响应**:
```json
{
  "success": false,
  "error": "积分不足，请先邀请好友或提交玩法获取积分"
}
```

---

### 4. 提交玩法审核
```
POST /api/play-exchange/submit
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "title": "Arbitrum 生态 DeFi 挖矿指南",
  "category": "defi-farming",
  "content": "详细的操作步骤..."
}
```

**验证规则**:
- 标题: 5-200 字
- 内容: 至少 50 字
- 最多 3 个待审核提交

**响应示例**:
```json
{
  "success": true,
  "data": {
    "submission_id": "uuid",
    "status": "pending",
    "message": "✅ 提交成功！管理员将在 24 小时内审核，审核通过后积分将自动发放到您的账户"
  }
}
```

---

### 5. 获取提交记录
```
GET /api/play-exchange/submit
Authorization: Bearer {access_token}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "submissions": [
      {
        "id": "uuid",
        "title": "Arbitrum 生态 DeFi 挖矿指南",
        "category": "defi-farming",
        "content": "...",
        "status": "approved",
        "credits_awarded": 85,
        "review_notes": "内容详实，SOP清晰，优质内容！",
        "created_at": "2025-01-13T10:30:00Z",
        "reviewed_at": "2025-01-13T15:20:00Z"
      }
    ],
    "stats": {
      "total": 3,
      "pending": 1,
      "approved": 1,
      "rejected": 1,
      "total_credits_earned": 85
    }
  }
}
```

---

### 6. 获取邀请信息
```
GET /api/play-exchange/referral
Authorization: Bearer {access_token}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "referral_code": "ABC123",
    "referral_link": "https://example.com/auth/register?ref=ABC123",
    "stats": {
      "total_invited": 5,
      "total_registered": 3,
      "total_credits_earned": 3,
      "pending_count": 2
    },
    "records": [
      {
        "id": "uuid",
        "referred_id": "uuid",
        "referred_username": "crypto_hunter",
        "referral_code": "ABC123",
        "credits_awarded": true,
        "awarded_at": "2025-01-13T12:00:00Z",
        "created_at": "2025-01-13T12:00:00Z",
        "status": "completed"
      }
    ]
  }
}
```

---

### 7. 记录邀请关系（注册时调用）
```
POST /api/play-exchange/referral
Content-Type: application/json

{
  "referral_code": "ABC123",
  "referred_user_id": "uuid"
}
```

**业务逻辑**:
- 验证邀请码有效性
- 检查是否已被邀请
- 创建邀请记录
- 奖励邀请人 1 积分
- 创建积分交易记录

**响应示例**:
```json
{
  "success": true,
  "data": {
    "message": "✅ 邀请关系已建立，邀请人获得 1 积分奖励"
  }
}
```

---

## 🧪 测试流程

### 1. 准备测试数据
```bash
# 在 Supabase 中执行 SQL 脚本
node add-daily-featured-sample.js
```

### 2. 测试 API

#### 获取今日精选（无需登录）
```bash
curl http://localhost:3000/api/play-exchange/daily-featured
```

#### 获取用户信息（需要登录）
```bash
# 先在前端登录获取 access_token
curl http://localhost:3000/api/play-exchange/user-info \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### 翻牌交换
```bash
curl -X POST http://localhost:3000/api/play-exchange/draw \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "card_index": 0,
    "play_id": "PLAY_UUID_FROM_DAILY_FEATURED"
  }'
```

#### 提交玩法
```bash
curl -X POST http://localhost:3000/api/play-exchange/submit \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "测试玩法提交",
    "category": "defi-farming",
    "content": "这是一个测试的详细内容，至少需要50个字符才能通过验证。我会描述详细的操作步骤..."
  }'
```

---

## 🔐 认证说明

大多数 API 需要用户登录。前端需要:

1. 通过 Supabase Auth 登录获取 `access_token`
2. 在请求头中携带: `Authorization: Bearer {access_token}`

示例代码:
```typescript
import { supabase } from '@/lib/supabase';

// 获取当前用户的 token
const { data: { session } } = await supabase.auth.getSession();
const accessToken = session?.access_token;

// 调用 API
const response = await fetch('/api/play-exchange/user-info', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});
```

---

## 📊 数据库表关系

```
auth.users (Supabase Auth)
    ↓
user_profiles (扩展信息: credits, referral_code, first_draw_used)
    ↓
├─ user_play_exchanges (交换记录)
├─ user_submitted_plays (提交审核)
├─ credit_transactions (积分流水)
└─ referrals (邀请关系)

daily_featured_plays (今日精选配置)
    ↓ 关联 3 个
strategies (玩法详情)
```

---

## 🎯 积分系统规则

### 获取积分
- ✅ **邀请好友注册**: +1 积分/人
- ✅ **提交玩法审核通过**: +1~100 积分（根据质量评分）

### 消耗积分
- ❌ **首次翻牌**: 免费
- ❌ **后续翻牌**: -1 积分/次

### 积分查询
- 所有积分变动都记录在 `credit_transactions` 表
- 可以追溯每笔积分的来源和用途

---

## ⚠️ 注意事项

1. **幂等性**:
   - 翻牌 API 会检查是否已拥有该玩法，防止重复获取
   - 邀请关系只能建立一次

2. **限流**:
   - 提交玩法: 最多 3 个待审核
   - 邀请奖励: 自动发放，无需手动触发

3. **错误处理**:
   - 所有 API 都返回统一格式
   - `success: true/false`
   - 失败时提供 `error` 字段说明原因

4. **事务处理**:
   - 翻牌 API 包含积分扣除、记录创建、交易记录
   - 失败时会尝试回滚

---

## 🚀 下一步

1. ✅ 数据库迁移完成
2. ✅ Directus 权限配置完成
3. ✅ 后端 API 实现完成
4. ⏳ 前端页面集成
5. ⏳ 完整流程测试

