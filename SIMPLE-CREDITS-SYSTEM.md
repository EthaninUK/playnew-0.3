# 简化版积分系统方案

## 一、核心规则（极简版）

### 1. 基本设定
- **初始积分**: 新用户注册 **50 积分**
- **每日登录**: 每天登录送 **5 积分**
- **积分单位**: 最小单位为 **1 积分**
- **无上限**: 积分无最大上限
- **无等级**: 不设用户等级系统

### 2. 内容访问规则

| 板块 | 是否需要积分 | 说明 |
|------|------------|------|
| **玩法库 (Strategies)** | ✅ 部分需要 | 后台可配置每个策略的积分要求 |
| **套利 (Arbitrage)** | ✅ 部分需要 | 后台可配置每个套利信号的积分要求 |
| **新闻 (News)** | ❌ 完全免费 | 所有新闻免费查看 |
| **八卦 (Gossip)** | ❌ 完全免费 | 所有八卦免费查看 |
| **服务商 (Providers)** | ❌ 完全免费 | 所有服务商免费查看 |
| **静态页面** | ❌ 完全免费 | 关于我们、帮助中心等 |

### 3. 积分消耗
- **由后台管理员配置**: 每个策略/套利可单独设置所需积分（0-999）
- **0 积分 = 免费**: 设置为 0 即为免费内容
- **一次性消费**: 查看某个内容后，该内容永久免费（不重复扣费）

### 4. 积分用完后
显示提示：
```
积分不足！

请联系 Telegram 管理员购买无限积分：
👉 [联系管理员](https://t.me/your_admin_username)

购买无限积分后，可永久免费查看所有内容。
```

---

## 二、数据库设计（最简化）

### 表1: user_credits（用户积分表）

```sql
CREATE TABLE user_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL UNIQUE,
  current_credits INT DEFAULT 50 CHECK (current_credits >= 0),
  is_unlimited BOOLEAN DEFAULT FALSE, -- 是否购买了无限积分
  last_daily_reward_at DATE, -- 最后一次领取每日奖励日期
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_user_credits_user_id ON user_credits(user_id);
```

### 表2: credit_transactions（积分交易记录）

```sql
CREATE TABLE credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  credits_change INT NOT NULL, -- 正数为获得，负数为消耗
  credits_before INT NOT NULL,
  credits_after INT NOT NULL,
  transaction_type VARCHAR(50) NOT NULL, -- 'daily_login', 'view_content', 'admin_grant'
  content_id UUID, -- 内容ID（如果适用）
  content_type VARCHAR(50), -- 'strategy', 'arbitrage'
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_credit_trans_user_id ON credit_transactions(user_id);
CREATE INDEX idx_credit_trans_created ON credit_transactions(created_at DESC);
```

### 表3: user_unlocked_content（用户已解锁内容）

```sql
CREATE TABLE user_unlocked_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  content_id UUID NOT NULL,
  content_type VARCHAR(50) NOT NULL, -- 'strategy', 'arbitrage'
  credits_spent INT DEFAULT 0,
  unlocked_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, content_id, content_type)
);

CREATE INDEX idx_unlocked_user_content ON user_unlocked_content(user_id, content_id, content_type);
```

### 表4: 在现有表中添加字段

#### 4.1 strategies 表添加字段

```sql
ALTER TABLE strategies
ADD COLUMN credits_required INT DEFAULT 0 CHECK (credits_required >= 0);

-- 添加注释
COMMENT ON COLUMN strategies.credits_required IS '查看此策略需要的积分，0表示免费';
```

#### 4.2 arbitrage 表添加字段

```sql
ALTER TABLE arbitrage
ADD COLUMN credits_required INT DEFAULT 0 CHECK (credits_required >= 0);

COMMENT ON COLUMN arbitrage.credits_required IS '查看此套利信号需要的积分，0表示免费';
```

---

## 三、API 设计

### 1. GET /api/credits/status
获取用户当前积分状态

**Response:**
```json
{
  "success": true,
  "data": {
    "current_credits": 45,
    "is_unlimited": false,
    "can_claim_daily": true,
    "last_daily_reward": "2025-01-10"
  }
}
```

### 2. POST /api/credits/daily-login
领取每日登录奖励

**Response (成功):**
```json
{
  "success": true,
  "data": {
    "credits_earned": 5,
    "current_credits": 50,
    "next_claim_available": "2025-01-12T00:00:00Z"
  }
}
```

**Response (今日已领取):**
```json
{
  "success": false,
  "error": {
    "code": "ALREADY_CLAIMED",
    "message": "今日奖励已领取",
    "next_claim_available": "2025-01-12T00:00:00Z"
  }
}
```

### 3. POST /api/credits/consume
消耗积分查看内容

**Request:**
```json
{
  "content_type": "strategy",
  "content_id": "uuid-here"
}
```

**Response (成功):**
```json
{
  "success": true,
  "data": {
    "credits_spent": 10,
    "current_credits": 35,
    "content_unlocked": true
  }
}
```

**Response (积分不足):**
```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_CREDITS",
    "message": "积分不足",
    "required": 10,
    "current": 5,
    "telegram_admin": "https://t.me/your_admin_username"
  }
}
```

**Response (已解锁):**
```json
{
  "success": true,
  "data": {
    "credits_spent": 0,
    "current_credits": 35,
    "content_unlocked": true,
    "reason": "already_unlocked"
  }
}
```

**Response (无限积分):**
```json
{
  "success": true,
  "data": {
    "credits_spent": 0,
    "current_credits": 999999,
    "content_unlocked": true,
    "reason": "unlimited_credits"
  }
}
```

### 4. GET /api/credits/check-access
检查是否可以访问内容（不实际扣费）

**Query:**
```
?content_type=strategy&content_id=uuid-here
```

**Response:**
```json
{
  "success": true,
  "data": {
    "can_access": true,
    "credits_required": 10,
    "current_credits": 45,
    "is_free": false,
    "already_unlocked": false,
    "is_unlimited": false
  }
}
```

### 5. GET /api/credits/transactions
查询积分历史

**Query:**
```
?limit=20&offset=0
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "uuid",
        "credits_change": -10,
        "credits_before": 45,
        "credits_after": 35,
        "transaction_type": "view_content",
        "description": "查看策略：Uniswap V3 流动性挖矿",
        "created_at": "2025-01-11T10:30:00Z"
      },
      {
        "id": "uuid",
        "credits_change": 5,
        "credits_before": 40,
        "credits_after": 45,
        "transaction_type": "daily_login",
        "description": "每日登录奖励",
        "created_at": "2025-01-11T08:00:00Z"
      }
    ],
    "total_count": 48,
    "pagination": {
      "limit": 20,
      "offset": 0,
      "has_more": true
    }
  }
}
```

### 6. POST /api/admin/credits/grant (管理员接口)
管理员手动赋予积分或无限积分

**Request:**
```json
{
  "user_id": "uuid-here",
  "credits": 1000, // 赋予积分数量（可选）
  "is_unlimited": true, // 是否给予无限积分（可选）
  "reason": "购买无限积分套餐"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user_id": "uuid-here",
    "current_credits": 1000,
    "is_unlimited": true
  }
}
```

---

## 四、Directus 后台配置

### 4.1 Strategies 集合配置

在 Directus 中为 `strategies` 集合添加字段：

**字段名**: `credits_required`
- **类型**: Integer (整数)
- **默认值**: 0
- **验证规则**: >= 0
- **界面显示**: Input (Number)
- **字段说明**: "查看此策略需要的积分，设置为 0 表示免费"
- **显示位置**: 放在内容管理区域

**界面配置**:
```json
{
  "interface": "input",
  "options": {
    "placeholder": "0",
    "min": 0,
    "max": 999,
    "step": 1,
    "iconLeft": "star"
  },
  "display": "formatted-value",
  "display_options": {
    "suffix": " 积分"
  }
}
```

### 4.2 Arbitrage 集合配置

同上，为 `arbitrage` 集合添加相同的 `credits_required` 字段。

### 4.3 管理界面布局

在 Directus 的内容编辑页面中，字段布局建议：

```
┌─────────────────────────────────────┐
│ 标题: [________________]            │
│ 分类: [下拉选择]                     │
│ 状态: [发布/草稿]                    │
│                                     │
│ ✨ 积分设置                          │
│ 所需积分: [__10__] 积分              │
│ (设置为 0 表示免费内容)              │
│                                     │
│ 内容: [富文本编辑器]                 │
└─────────────────────────────────────┘
```

### 4.4 批量设置积分

在 Directus 中可以批量设置积分：

1. 选中多个策略
2. 点击"批量编辑"
3. 设置 `credits_required` 字段
4. 保存

---

## 五、前端实现

### 5.1 Header 中显示积分

```tsx
// components/shared/Header.tsx
import { Coins } from 'lucide-react';

export function Header() {
  const { data: credits } = useCredits();

  return (
    <header>
      {/* 其他内容 */}

      {user && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-50 rounded-lg border border-yellow-200">
          <Coins className="w-4 h-4 text-yellow-600" />
          <span className="text-sm font-medium text-gray-900">
            {credits?.is_unlimited ? '∞' : credits?.current_credits || 0}
          </span>
        </div>
      )}
    </header>
  );
}
```

### 5.2 积分不足弹窗

```tsx
// components/credits/InsufficientCreditsDialog.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle, MessageCircle } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  required: number;
  current: number;
}

export function InsufficientCreditsDialog({ open, onClose, required, current }: Props) {
  const telegramAdmin = process.env.NEXT_PUBLIC_TELEGRAM_ADMIN || 'https://t.me/your_admin';

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-500" />
            积分不足
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-sm text-gray-700">
              查看此内容需要 <strong className="text-yellow-700">{required}</strong> 积分
            </p>
            <p className="text-sm text-gray-700 mt-1">
              您当前仅有 <strong className="text-yellow-700">{current}</strong> 积分
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-900">
              获取更多积分：
            </p>

            <div className="space-y-2">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <MessageCircle className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">
                    购买无限积分
                  </span>
                </div>
                <p className="text-xs text-blue-700 mb-3">
                  一次购买，永久免费查看所有内容
                </p>
                <Button
                  className="w-full"
                  onClick={() => window.open(telegramAdmin, '_blank')}
                >
                  联系 Telegram 管理员
                </Button>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600">
                  💡 提示：每日登录可获得 5 积分
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

### 5.3 内容访问拦截（简化版）

```tsx
// hooks/useCreditsGate.ts
import { useState } from 'react';
import { toast } from 'sonner';

export function useCreditsGate() {
  const [showInsufficientDialog, setShowInsufficientDialog] = useState(false);
  const [insufficientData, setInsufficientData] = useState({ required: 0, current: 0 });

  async function checkAndConsume(
    contentType: 'strategy' | 'arbitrage',
    contentId: string
  ): Promise<boolean> {
    try {
      // 1. 检查访问权限
      const checkRes = await fetch(
        `/api/credits/check-access?content_type=${contentType}&content_id=${contentId}`
      );
      const checkData = await checkRes.json();

      if (!checkData.success) {
        toast.error('检查访问权限失败');
        return false;
      }

      const { can_access, credits_required, current_credits, is_free, already_unlocked, is_unlimited } = checkData.data;

      // 2. 免费内容直接通过
      if (is_free || credits_required === 0) {
        return true;
      }

      // 3. 已解锁或无限积分直接通过
      if (already_unlocked || is_unlimited) {
        return true;
      }

      // 4. 检查积分是否足够
      if (!can_access) {
        setInsufficientData({
          required: credits_required,
          current: current_credits
        });
        setShowInsufficientDialog(true);
        return false;
      }

      // 5. 消耗积分
      const consumeRes = await fetch('/api/credits/consume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content_type: contentType, content_id: contentId })
      });

      if (!consumeRes.ok) {
        toast.error('积分扣除失败');
        return false;
      }

      const consumeData = await consumeRes.json();

      if (consumeData.data.credits_spent > 0) {
        toast.success(`消耗 ${consumeData.data.credits_spent} 积分，剩余 ${consumeData.data.current_credits} 积分`);
      }

      return true;

    } catch (error) {
      console.error('Credits gate error:', error);
      toast.error('系统错误，请稍后重试');
      return false;
    }
  }

  return {
    checkAndConsume,
    showInsufficientDialog,
    setShowInsufficientDialog,
    insufficientData
  };
}
```

### 5.4 在详情页使用

```tsx
// app/strategies/[slug]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useCreditsGate } from '@/hooks/useCreditsGate';
import { InsufficientCreditsDialog } from '@/components/credits/InsufficientCreditsDialog';

export default function StrategyDetailPage({ params }: { params: { slug: string } }) {
  const [canView, setCanView] = useState(false);
  const [strategy, setStrategy] = useState(null);
  const [loading, setLoading] = useState(true);
  const { checkAndConsume, showInsufficientDialog, setShowInsufficientDialog, insufficientData } = useCreditsGate();

  useEffect(() => {
    async function init() {
      setLoading(true);

      // 1. 先获取策略数据（包括 credits_required）
      const strategyRes = await fetch(`/api/strategies/${params.slug}`);
      const strategyData = await strategyRes.json();
      setStrategy(strategyData);

      // 2. 如果需要积分，检查并消耗
      if (strategyData.credits_required > 0) {
        const allowed = await checkAndConsume('strategy', strategyData.id);
        setCanView(allowed);
      } else {
        // 免费内容直接显示
        setCanView(true);
      }

      setLoading(false);
    }

    init();
  }, [params.slug]);

  if (loading) {
    return <div>加载中...</div>;
  }

  if (!canView) {
    return (
      <>
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <h2 className="text-xl font-bold mb-2">此内容需要积分</h2>
            <p className="text-gray-600">
              查看此策略需要 {strategy?.credits_required} 积分
            </p>
          </div>
        </div>

        <InsufficientCreditsDialog
          open={showInsufficientDialog}
          onClose={() => setShowInsufficientDialog(false)}
          required={insufficientData.required}
          current={insufficientData.current}
        />
      </>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1>{strategy.title}</h1>
      {/* 完整内容 */}
    </div>
  );
}
```

### 5.5 每日签到按钮

```tsx
// components/credits/DailyRewardButton.tsx
import { Button } from '@/components/ui/button';
import { Gift } from 'lucide-react';
import { toast } from 'sonner';

export function DailyRewardButton() {
  const { data: credits, mutate } = useCredits();
  const [claiming, setClaiming] = useState(false);

  async function handleClaim() {
    setClaiming(true);
    try {
      const res = await fetch('/api/credits/daily-login', {
        method: 'POST'
      });
      const data = await res.json();

      if (data.success) {
        toast.success(`领取成功！+${data.data.credits_earned} 积分`);
        mutate(); // 刷新积分数据
      } else {
        toast.error(data.error.message);
      }
    } catch (error) {
      toast.error('领取失败，请稍后重试');
    } finally {
      setClaiming(false);
    }
  }

  if (!credits?.can_claim_daily) {
    return null;
  }

  return (
    <Button
      onClick={handleClaim}
      disabled={claiming}
      className="gap-2"
    >
      <Gift className="w-4 h-4" />
      领取每日积分 (+5)
    </Button>
  );
}
```

---

## 六、实施步骤

### Phase 1: 数据库 (1天)
- [ ] 创建 `user_credits` 表
- [ ] 创建 `credit_transactions` 表
- [ ] 创建 `user_unlocked_content` 表
- [ ] 为 `strategies` 表添加 `credits_required` 字段
- [ ] 为 `arbitrage` 表添加 `credits_required` 字段
- [ ] 为所有现有用户初始化 50 积分

### Phase 2: Directus 配置 (1天)
- [ ] 在 Directus 中配置 `credits_required` 字段界面
- [ ] 设置字段权限（管理员可编辑）
- [ ] 批量设置部分策略的积分要求
- [ ] 批量设置部分套利的积分要求

### Phase 3: 后端 API (2天)
- [ ] 实现 `/api/credits/status`
- [ ] 实现 `/api/credits/daily-login`
- [ ] 实现 `/api/credits/consume`
- [ ] 实现 `/api/credits/check-access`
- [ ] 实现 `/api/credits/transactions`
- [ ] 实现 `/api/admin/credits/grant`（管理员接口）
- [ ] 添加定时任务（每日重置签到状态）

### Phase 4: 前端组件 (2天)
- [ ] Header 显示积分
- [ ] 积分不足弹窗
- [ ] 每日签到按钮
- [ ] `useCreditsGate` Hook
- [ ] 策略详情页集成
- [ ] 套利详情页集成

### Phase 5: 测试和上线 (1天)
- [ ] 测试积分扣除逻辑
- [ ] 测试每日签到
- [ ] 测试无限积分功能
- [ ] 测试已解锁内容不重复扣费
- [ ] 部署到生产环境

**总计**: 约 7 天完成

---

## 七、后台管理员操作指南

### 7.1 设置内容所需积分

1. 登录 Directus 后台
2. 进入 `Strategies` 或 `Arbitrage` 集合
3. 点击要编辑的内容
4. 找到"所需积分"字段
5. 输入积分数量（0 = 免费，1-999 = 需要积分）
6. 保存

### 7.2 批量设置积分

1. 在列表页勾选多个内容
2. 点击"批量编辑"
3. 设置"所需积分"字段
4. 应用到所有选中项

### 7.3 给用户开通无限积分

**方法1: 通过 API**
```bash
curl -X POST http://your-domain.com/api/admin/credits/grant \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "user_id": "user-uuid-here",
    "is_unlimited": true,
    "reason": "购买无限积分套餐"
  }'
```

**方法2: 直接修改数据库**
```sql
UPDATE user_credits
SET is_unlimited = true
WHERE user_id = 'user-uuid-here';
```

### 7.4 查看用户积分使用情况

```sql
-- 查看某用户的积分记录
SELECT * FROM credit_transactions
WHERE user_id = 'user-uuid-here'
ORDER BY created_at DESC
LIMIT 20;

-- 统计积分消耗最多的内容
SELECT
  content_id,
  content_type,
  COUNT(*) as view_count,
  SUM(ABS(credits_change)) as total_credits_spent
FROM credit_transactions
WHERE transaction_type = 'view_content'
GROUP BY content_id, content_type
ORDER BY total_credits_spent DESC
LIMIT 10;
```

---

## 八、环境变量配置

在 `.env.local` 中添加：

```bash
# Telegram 管理员联系方式
NEXT_PUBLIC_TELEGRAM_ADMIN=https://t.me/your_admin_username

# 每日登录奖励积分数
DAILY_LOGIN_CREDITS=5

# 新用户初始积分
INITIAL_CREDITS=50
```

---

## 九、FAQ

**Q1: 用户查看过的内容还会再扣积分吗？**
A: 不会。用户查看过一次后，该内容会被标记为"已解锁"，之后可以无限次免费查看。

**Q2: 如何给用户退积分？**
A: 使用管理员接口 `/api/admin/credits/grant`，传入正数的 `credits` 参数即可增加积分。

**Q3: 如果用户购买了无限积分，还能看到积分数吗？**
A: 可以。前端会显示 `∞` 符号，表示无限积分。

**Q4: 每日登录奖励几点刷新？**
A: 每天 00:00 (UTC+8) 刷新，用户可以再次领取。

**Q5: 如何批量设置所有策略为免费？**
A: 在 Directus 中选中所有策略，批量编辑 `credits_required` 为 `0`。

**Q6: 新闻和八卦需要在后台设置吗？**
A: 不需要。新闻和八卦板块完全免费，不添加 `credits_required` 字段。

---

## 十、对比原方案的优势

| 特性 | 原复杂方案 | 简化方案 |
|-----|----------|---------|
| 数据表数量 | 6 个 | 3 个 |
| API 端点 | 7 个 | 6 个 |
| 用户等级 | 4 级 | 无等级 |
| 体力恢复 | 自动恢复 | 手动签到 |
| 任务系统 | 复杂 | 仅每日签到 |
| 后台配置 | 复杂 | 单个字段 |
| 实施周期 | 6 周 | 1 周 |
| 维护成本 | 高 | 低 |

---

**方案版本**: v2.0 (简化版)
**更新时间**: 2025-01-11
**适用场景**: 快速上线、简单运营

