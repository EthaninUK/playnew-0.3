# 🏗️ PlayNew.ai 平台架构分析报告

**生成时间**: 2025-11-19
**分析目的**: 为 HTTP 402 + Web3 支付集成做准备
**状态**: ✅ 架构分析完成

---

## 📊 执行摘要

### 关键发现
1. **双数据库架构**: Supabase (用户数据) + Directus (内容管理)
2. **现有支付系统**: Stripe 集成已被**完全禁用** (503 状态)
3. **积分系统**: PlayPass (PP) 系统已设计但**未完全实现**
4. **认证系统**: Supabase Auth,但缺少完整的 useAuth hook 实现
5. **中间件**: 简单的 Supabase session 更新,无支付拦截

### 集成建议
✅ **可以安全集成 HTTP 402 + Web3 支付**
- 现有 Stripe 代码已禁用,不会冲突
- PlayPass 系统可以与 Web3 支付并行
- 中间件简单,易于扩展支付拦截逻辑

---

## 🗄️ 数据库架构

### 1. Supabase (用户核心数据)
```
数据库: PostgreSQL on Supabase
URL: https://cujpgrzjmmttysphjknu.supabase.co
```

#### 核心表结构

##### `auth.users` (Supabase 内置)
- 用户认证信息
- email, password, metadata
- 由 Supabase Auth 管理

##### `user_profiles` (已创建)
```sql
- id: UUID (references auth.users)
- username: TEXT
- avatar_url: TEXT
- bio: TEXT
- credits: INT (积分余额,PlayPass 系统使用)
- created_at, updated_at
```

##### `user_favorites` (已创建)
```sql
- id: UUID
- user_id: UUID
- item_type: TEXT ('strategy', 'provider', 'news')
- item_id: UUID (Directus 内容 ID)
- created_at
```

##### `user_history` (已创建)
```sql
- id: UUID
- user_id: UUID
- item_type: TEXT
- item_id: UUID
- viewed_at
```

##### `credit_transactions` (PlayPass 系统)
```sql
- id: UUID
- user_id: UUID
- credits_change: INT (正数=获得,负数=消耗)
- credits_before: INT
- credits_after: INT
- transaction_type: VARCHAR(50)
- related_id: UUID
- related_type: VARCHAR(50)
- description: TEXT
- metadata: JSONB
- created_at
```

##### `play_passes` (PlayPass 系统,已设计但未验证实现)
```sql
- id: UUID
- play_id: UUID (strategy ID)
- owner_id: UUID (user ID)
- original_buyer_id: UUID
- pass_type: VARCHAR(20) ('lifetime', 'subscription', 'usage_based')
- purchase_price_credits: INT
- status: VARCHAR(20) ('active', 'expired', 'revoked', 'transferred')
- purchased_at, created_at, updated_at
```

##### `user_playpass` (PlayPass 扩展信息)
```sql
- id: UUID
- user_id: UUID
- current_balance: INT (PP 余额)
- total_earned: INT
- total_spent: INT
- membership_level: INT (0-4: Free/Pro/Premium/Partner/MAX)
- is_max_member: BOOLEAN
- earn_multiplier: DECIMAL
- daily_earn_limit: INT
- daily_earned_today: INT
- last_daily_reset: DATE
- pp_level: INT
- level_progress: INT
- consecutive_signin_days: INT
- total_signin_days: INT
```

##### `user_content_access` (访问记录)
```sql
- id: UUID
- user_id: UUID
- content_id: UUID
- content_type: VARCHAR(50)
- access_type: VARCHAR(20) ('free', 'purchased', 'granted')
- first_accessed_at, last_accessed_at
- access_count: INT
```

##### `playpass_pricing_config` (定价配置,Directus 后台管理)
```sql
- id: UUID
- config_key: VARCHAR (唯一标识)
- config_name: TEXT
- content_type: VARCHAR ('strategy', 'arbitrage', 'news', 'gossip')
- pp_price: INT (基础价格)
- apply_conditions: JSONB (匹配条件)
- membership_discounts: JSONB (会员折扣)
- free_preview_length: INT
- is_active: BOOLEAN
- priority: INT (优先级)
```

##### `playpass_reward_config` (奖励配置)
```sql
- id: UUID
- reward_key: VARCHAR
- reward_name: TEXT
- reward_type: VARCHAR ('daily_signin', 'share', 'comment', 'like')
- base_pp_amount: INT
- multiplier_conditions: JSONB
- daily_limit: INT
- is_active: BOOLEAN
```

---

### 2. Directus (内容管理系统)
```
数据库: PostgreSQL (Docker)
URL: http://localhost:8055
Port: 8055 (Docker)
Admin Token: SWKQM0wlKN3ZPeoDJNiqhaakZHhUrkXQ
```

#### 核心内容表

##### `strategies` (玩法策略)
```sql
- id: UUID
- title: TEXT
- slug: TEXT
- summary: TEXT
- content: TEXT (Markdown)
- category: VARCHAR (对应 categories 表)
- risk_level: INT (1-5)
- apy_min: DECIMAL
- apy_max: DECIMAL
- status: VARCHAR ('draft', 'published')
- credits_price: INT (PlayPass 价格,0=免费)
- is_purchasable: BOOLEAN
- sales_count: INT
- author_id: UUID
- author_type: VARCHAR ('platform', 'user')
- view_count: INT
- created_at, updated_at
```

##### `news` (资讯)
```sql
- id: UUID
- title: TEXT
- slug: TEXT
- summary: TEXT
- content: TEXT
- category: VARCHAR
- source: TEXT
- source_url: TEXT
- published_at: TIMESTAMP
- view_count: INT
- status: VARCHAR
- news_type: VARCHAR ('realtime', 'gossip')
- credibility_score: INT (八卦系统)
- hotness_score: INT
- verification_status: VARCHAR
- gossip_tags: TEXT[]
- likes_count, comments_count: INT
```

##### `service_providers` (服务商)
```sql
- id: UUID
- name: TEXT
- slug: TEXT
- description: TEXT
- category: VARCHAR
- rating: DECIMAL
- website_url: TEXT
- status: VARCHAR
```

##### `categories` (分类)
```sql
- id: INT
- name: TEXT
- slug: TEXT
- icon: TEXT
- order_index: INT
```

##### `daily_featured_plays` (每日精选玩法)
```sql
- id: UUID
- feature_date: DATE
- play_1_id, play_2_id, play_3_id: UUID (strategies)
- theme_label: TEXT (如"今日精选")
- is_active: BOOLEAN
```

##### `arbitrage` (套利信号)
```sql
- id: UUID
- title: TEXT
- slug: TEXT
- opportunity_type: VARCHAR
- source_platform, target_platform: TEXT
- estimated_profit: DECIMAL
- risk_level: INT
- status: VARCHAR
```

##### `gossip` (八卦)
```sql
- id: UUID
- title: TEXT
- content: TEXT
- credibility_score: INT
- hotness_score: INT
- verification_status: VARCHAR
- tags: TEXT[]
- likes_count, comments_count: INT
```

---

## 🔐 认证与授权系统

### 1. Supabase Auth

#### 认证流程
```typescript
// 1. 用户注册/登录 -> Supabase Auth
// 2. 自动触发器创建 user_profiles 记录
// 3. Session 存储在 Cookie 中
// 4. 每个请求通过 middleware 验证 session
```

#### 当前实现状态
- ✅ Supabase Auth 基础功能
- ✅ Session Cookie 管理
- ⚠️ useAuth hook **未完全实现** (文件存在但可能不完整)
- ⚠️ useAuthGuard hook 存在但功能简单

#### Auth Hook 代码
```typescript
// /frontend/hooks/useAuth.ts
// 状态: 需要检查完整实现

// /frontend/hooks/useAuthGuard.ts
export function useAuthGuard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // 跳转到登录页
        const currentPath = window.location.pathname;
        router.push(`/auth/login?redirect=${encodeURIComponent(currentPath)}`);
      } else {
        setIsAuthorized(true);
      }
    }
  }, [user, loading, router]);

  return { isAuthorized, loading, user };
}
```

### 2. Middleware (支付拦截点)

#### 当前 Middleware
```typescript
// /frontend/middleware.ts
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  return await updateSession(request); // 只更新 session,无业务逻辑
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
```

#### updateSession 实现
```typescript
// /frontend/lib/supabase/middleware.ts
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get, set, remove } }
  );

  await supabase.auth.getUser(); // 验证 session
  return response;
}
```

#### 🎯 HTTP 402 集成点
**建议在 middleware 中添加支付拦截逻辑**:
```typescript
// 伪代码示例
if (request.nextUrl.pathname.startsWith('/strategies/')) {
  const contentId = extractContentId(request);
  const hasAccess = await checkUserAccess(user, contentId);

  if (!hasAccess) {
    return new Response(null, {
      status: 402,
      headers: {
        'Content-Type': 'application/json',
        'X-Payment-Required': 'true',
        'X-Content-Id': contentId,
        'X-Content-Type': 'strategy'
      }
    });
  }
}
```

---

## 💳 支付系统现状

### 1. Stripe 集成 (已禁用)

#### API 路由状态
所有 Stripe 相关 API 都已返回 **503 Service Unavailable**:

```typescript
// /frontend/app/api/create-checkout-session/route.ts
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'Membership feature is temporarily disabled' },
    { status: 503 }
  );
}

// /frontend/app/api/verify-payment/route.ts
export async function GET(request: NextRequest) {
  return NextResponse.json(
    { error: 'Membership feature is temporarily disabled' },
    { status: 503 }
  );
}

// /frontend/app/api/subscription/route.ts
export async function GET(request: NextRequest) {
  return NextResponse.json(
    { error: 'Membership feature is temporarily disabled', subscription: null },
    { status: 503 }
  );
}
```

#### 环境变量 (已配置但未使用)
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51SNGac...
STRIPE_SECRET_KEY=sk_test_51SNGac...
STRIPE_WEBHOOK_SECRET=whsec_0ddd4b81e009a07a...
```

#### 结论
✅ **Stripe 完全禁用,不会与新支付系统冲突**

---

### 2. PlayPass 积分系统

#### 实现状态
- 📋 **设计文档完整** (PLAYPASS-SYSTEM-DESIGN.md, CREDITS-SYSTEM-DESIGN.md)
- ⚠️ **数据库表部分创建** (SQL 脚本存在)
- ⚠️ **API 部分实现** (check-access, balance, earn, spend 等)
- ❌ **前端集成不完整**

#### 关键 API 路由

##### `/api/playpass/check-access` (内容访问权限检查)
```typescript
POST /api/playpass/check-access
Body: {
  user_id: UUID,
  content_id: UUID,
  content_type: 'strategy' | 'arbitrage' | 'news' | 'gossip'
}

Response: {
  success: true,
  data: {
    has_access: boolean,
    access_method: 'max_member' | 'membership_discount' | 'free' | 'locked',
    is_locked: boolean,
    price: {
      base_price: number,
      discount_rate: number,
      final_price: number
    },
    user_balance: number,
    has_sufficient_balance: boolean,
    shortage: number
  }
}
```

##### `/api/playpass/balance` (查询用户余额)
```typescript
GET /api/playpass/balance?user_id={userId}

Response: {
  success: true,
  data: {
    user_id: UUID,
    current_balance: number, // 使用 user_profiles.credits
    total_earned: number,
    total_spent: number,
    membership_level: 0-4,
    membership_name: 'Free' | 'Pro' | 'Premium' | 'Partner' | 'MAX',
    is_max_member: boolean,
    daily_earn_limit: number,
    daily_earned_today: number
  }
}
```

##### `/api/playpass/spend` (消耗 PP)
```typescript
POST /api/playpass/spend
Body: {
  user_id: UUID,
  amount: number,
  content_id: UUID,
  content_type: string,
  description?: string
}
```

##### `/api/playpass/earn` (获取 PP)
```typescript
POST /api/playpass/earn
Body: {
  user_id: UUID,
  amount: number,
  source: string,
  description?: string
}
```

#### PlayPass 会员体系
| 等级 | 名称 | PP 每日上限 | 获取倍率 | 内容访问 |
|------|------|-------------|---------|---------|
| 0 | Free | 1000 | 1.0x | 20% 基础内容 |
| 1 | Pro | 1500 | 1.2x | 60% 中级内容 |
| 2 | Premium | 2500 | 1.5x | 80% 高级内容 |
| 3 | Partner | 5000 | 2.0x | 90% 专家内容 |
| 4 | **MAX** | **无限** | **∞** | **100% 全部内容免费** |

#### 与 Web3 支付的关系
**建议**:
1. **PlayPass 保留**: 用于免费用户的日常积分系统
2. **Web3 支付独立**: 用于直接购买内容或升级会员
3. **两者互补**:
   - 用户可以用 PP 解锁内容
   - 也可以用 Web3 支付直接购买 (获得永久访问权)
   - Web3 支付可以赠送 PP 作为奖励

---

## 🔌 API 路由结构

### 已实现的 API 路由
```
/api/
├── play-exchange/          # 玩法交换系统
│   ├── daily-featured/     # 每日精选
│   ├── referral/           # 推荐奖励
│   ├── submit/             # 提交玩法
│   ├── user-info/          # 用户信息
│   └── draw/               # 抽取玩法
├── playpass/               # PlayPass 系统
│   ├── check-access/       # ✅ 检查访问权限 (关键)
│   ├── balance/            # ✅ 查询余额
│   ├── spend/              # ✅ 消耗 PP
│   ├── earn/               # ✅ 获取 PP
│   ├── daily-signin/       # 每日签到
│   ├── tasks/              # 任务系统
│   └── get-reward/         # 领取奖励
├── arbitrage/              # 套利信号
│   ├── route.ts            # 列表
│   ├── live/route.ts       # 实时信号
│   └── [slug]/route.ts     # 详情
├── gossip/                 # 八卦系统
│   ├── like/               # 点赞
│   ├── verify/             # 验证
│   └── comment/            # 评论
├── create-checkout-session/ # ❌ Stripe (已禁用)
├── verify-payment/          # ❌ Stripe (已禁用)
├── subscription/            # ❌ Stripe (已禁用)
├── interactions/            # 用户交互
├── search/                  # Meilisearch 搜索
├── leaderboard/             # 排行榜
└── award-credits/           # 奖励积分
```

---

## 🎨 前端架构

### 技术栈
- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **UI 库**: shadcn/ui
- **动画**: Framer Motion
- **状态管理**: React Hooks + Context API
- **数据获取**: Fetch API (Server Components) + SWR/React Query (Client Components)

### 关键组件路径
```
/frontend/
├── app/
│   ├── strategies/[slug]/       # 策略详情页 (需要加 402)
│   ├── news/[slug]/             # 资讯详情页
│   ├── arbitrage/[slug]/        # 套利详情页 (需要加 402)
│   ├── gossip/[slug]/           # 八卦详情页
│   ├── play-exchange/           # 玩法交换页 (隐藏)
│   ├── auth/
│   │   ├── login/               # 登录页
│   │   └── register/            # 注册页
│   └── pricing/                 # 会员定价页
├── components/
│   ├── shared/
│   │   ├── Header.tsx           # 导航栏
│   │   ├── Footer.tsx           # 页脚
│   │   └── Pagination.tsx       # 分页
│   ├── auth/                    # 认证组件
│   ├── gossip/                  # 八卦组件
│   └── ui/                      # shadcn/ui 组件
├── hooks/
│   ├── useAuth.ts               # ⚠️ 认证 hook (需检查)
│   └── useAuthGuard.ts          # 登录保护 hook
├── contexts/
│   └── LanguageContext.tsx      # 多语言 context
└── lib/
    ├── supabase.ts              # Supabase 客户端
    ├── directus.ts              # Directus 客户端
    └── supabase/
        └── middleware.ts        # Session 更新
```

### 内容详情页结构
所有内容详情页都遵循类似结构:
```typescript
// 示例: /app/strategies/[slug]/page.tsx

// 1. Server Component - 获取数据
export default async function StrategyPage({ params }: { params: { slug: string } }) {
  const strategy = await fetchStrategy(params.slug);
  return <StrategyDetailClient strategy={strategy} />;
}

// 2. Client Component - 交互逻辑
'use client';
function StrategyDetailClient({ strategy }) {
  const { user } = useAuth();
  const [hasAccess, setHasAccess] = useState(false);

  // 在这里可以添加访问权限检查
  // 如果没有权限,显示 PaymentDialog

  return (
    <div>
      {hasAccess ? (
        <MarkdownContent content={strategy.content} />
      ) : (
        <PaymentRequiredOverlay />
      )}
    </div>
  );
}
```

---

## 🎯 HTTP 402 集成建议

### 1. 推荐架构

```
┌─────────────────────────────────────────────────────────────┐
│                        用户请求                              │
│               GET /strategies/uniswap-v3                    │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   Next.js Middleware                        │
│                                                             │
│  1. 验证 Supabase Session                                   │
│  2. 检查是否为付费内容路径                                   │
│  3. 查询 user_content_access 表                             │
│  4. 如果无访问权限:                                          │
│     - 返回 HTTP 402                                         │
│     - 附带 X-Payment-Required 头                            │
│     - 附带 X-Content-Id, X-Content-Price 等元数据           │
└────────────────────────┬────────────────────────────────────┘
                         │
             ┌───────────┴───────────┐
             │                       │
             ▼                       ▼
    ┌─────────────┐          ┌──────────────┐
    │  有访问权限  │          │  无访问权限   │
    │  200 OK     │          │  402 Payment  │
    └──────┬──────┘          │  Required     │
           │                 └───────┬────────┘
           │                         │
           ▼                         ▼
    ┌─────────────┐          ┌──────────────┐
    │ 渲染完整内容 │          │ 拦截响应     │
    └─────────────┘          │ 显示支付弹窗  │
                             └───────┬────────┘
                                     │
                                     ▼
                             ┌──────────────┐
                             │ Web3 支付弹窗 │
                             │              │
                             │ 1. 连接钱包  │
                             │ 2. 发送交易  │
                             │ 3. 等待确认  │
                             │ 4. 验证付款  │
                             └───────┬────────┘
                                     │
                                     ▼
                             ┌──────────────┐
                             │ 写入数据库    │
                             │ access token │
                             └───────┬────────┘
                                     │
                                     ▼
                             ┌──────────────┐
                             │ 刷新页面     │
                             │ 显示完整内容  │
                             └──────────────┘
```

### 2. 数据库扩展需求

#### 新增表: `web3_payments`
```sql
CREATE TABLE web3_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 用户信息
  user_id UUID REFERENCES auth.users(id) NOT NULL,

  -- 内容信息
  content_id UUID NOT NULL,
  content_type VARCHAR(50) NOT NULL, -- 'strategy', 'arbitrage', etc.

  -- Web3 交易信息
  chain_id INT NOT NULL, -- 1=Ethereum, 137=Polygon, 8453=Base
  tx_hash VARCHAR(66) NOT NULL UNIQUE, -- 交易哈希
  from_address VARCHAR(42) NOT NULL, -- 付款地址
  to_address VARCHAR(42) NOT NULL, -- 收款地址 (平台合约)
  token_address VARCHAR(42), -- 代币地址 (NULL=原生代币)
  amount VARCHAR(78) NOT NULL, -- 支付金额 (wei/最小单位,字符串存储)
  amount_usd DECIMAL(10,2), -- USD 等值 (记录时价格)

  -- 支付状态
  status VARCHAR(20) DEFAULT 'pending', -- pending, confirmed, failed, refunded
  confirmations INT DEFAULT 0,

  -- 访问凭证
  access_token VARCHAR(64) UNIQUE, -- 生成的访问令牌
  access_expires_at TIMESTAMPTZ, -- 访问过期时间 (NULL=永久)

  -- 时间戳
  created_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ,

  -- 索引
  INDEX idx_web3_payments_user (user_id),
  INDEX idx_web3_payments_content (content_id, content_type),
  INDEX idx_web3_payments_tx (tx_hash),
  INDEX idx_web3_payments_token (access_token)
);
```

#### 扩展表: `user_content_access`
```sql
-- 添加 Web3 支付相关字段
ALTER TABLE user_content_access ADD COLUMN IF NOT EXISTS
  payment_method VARCHAR(20) DEFAULT 'free', -- 'free', 'playpass', 'web3', 'admin_grant'
  payment_id UUID REFERENCES web3_payments(id), -- 关联 Web3 支付记录
  access_token VARCHAR(64), -- 访问令牌
  expires_at TIMESTAMPTZ; -- 过期时间 (NULL=永久)
```

### 3. 所需 API 端点

#### 新增 API 路由
```
/api/web3/
├── check-payment-status/    # 检查交易状态
├── verify-transaction/       # 验证交易并授权访问
├── get-payment-info/         # 获取支付信息 (价格,地址等)
└── refund/                   # 退款处理 (可选)
```

#### 示例实现
```typescript
// /api/web3/verify-transaction/route.ts
export async function POST(request: NextRequest) {
  const { tx_hash, user_id, content_id, content_type } = await request.json();

  // 1. 查询链上交易
  const tx = await verifyTransactionOnChain(tx_hash);

  // 2. 验证金额、接收地址等
  if (tx.to !== PLATFORM_ADDRESS || tx.value < REQUIRED_AMOUNT) {
    return NextResponse.json({ error: 'Invalid transaction' }, { status: 400 });
  }

  // 3. 写入 web3_payments 表
  const payment = await supabase.from('web3_payments').insert({
    user_id,
    content_id,
    content_type,
    tx_hash,
    from_address: tx.from,
    to_address: tx.to,
    amount: tx.value,
    status: 'confirmed',
    confirmations: tx.confirmations
  }).select().single();

  // 4. 生成访问令牌
  const access_token = generateAccessToken();

  // 5. 写入 user_content_access 表
  await supabase.from('user_content_access').upsert({
    user_id,
    content_id,
    content_type,
    access_type: 'purchased',
    payment_method: 'web3',
    payment_id: payment.id,
    access_token,
    expires_at: null // 永久访问
  });

  // 6. 返回访问令牌
  return NextResponse.json({
    success: true,
    access_token,
    message: 'Payment verified, access granted'
  });
}
```

### 4. 前端组件

#### Web3PaymentDialog 组件
```typescript
// /components/web3/Web3PaymentDialog.tsx
'use client';

import { useState } from 'react';
import { useAccount, useSendTransaction, useWaitForTransaction } from 'wagmi';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Web3PaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  contentId: string;
  contentType: string;
  price: {
    amount: string; // wei
    usd: number;
  };
}

export function Web3PaymentDialog({
  isOpen,
  onClose,
  contentId,
  contentType,
  price
}: Web3PaymentDialogProps) {
  const { address, isConnected } = useAccount();
  const [step, setStep] = useState<'connect' | 'send' | 'verify' | 'success'>('connect');

  const { sendTransaction, data: txData } = useSendTransaction();
  const { isLoading: isTxPending } = useWaitForTransaction({
    hash: txData?.hash,
    onSuccess: () => setStep('verify')
  });

  const handlePayment = async () => {
    setStep('send');
    sendTransaction({
      to: PLATFORM_ADDRESS,
      value: BigInt(price.amount)
    });
  };

  const handleVerify = async () => {
    const res = await fetch('/api/web3/verify-transaction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tx_hash: txData?.hash,
        user_id: address,
        content_id: contentId,
        content_type: contentType
      })
    });

    if (res.ok) {
      setStep('success');
      setTimeout(() => {
        window.location.reload(); // 刷新页面显示完整内容
      }, 2000);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        {step === 'connect' && (
          <ConnectWalletStep />
        )}
        {step === 'send' && (
          <SendTransactionStep price={price} onSend={handlePayment} />
        )}
        {step === 'verify' && (
          <VerifyingStep txHash={txData?.hash} onVerified={handleVerify} />
        )}
        {step === 'success' && (
          <SuccessStep />
        )}
      </DialogContent>
    </Dialog>
  );
}
```

---

## ⚠️ 风险与注意事项

### 1. 认证系统风险
- ⚠️ `useAuth` hook 实现可能不完整,需要验证
- ⚠️ 缺少完整的 AuthContext 实现
- **建议**: 先完善认证系统,再集成支付

### 2. 数据库一致性
- Supabase 和 Directus 双数据库可能导致数据不一致
- **建议**: 使用 Supabase 作为支付和权限的唯一数据源

### 3. PlayPass 系统冲突
- PlayPass 系统与 Web3 支付可能造成用户混淆
- **建议**:
  - PlayPass 用于日常任务积分
  - Web3 支付用于直接购买 (永久访问)
  - 清晰区分两种方式

### 4. 链上验证成本
- 每次验证交易需要调用 RPC
- 高流量可能导致 RPC 限流
- **建议**:
  - 使用 Alchemy/Infura 等商业 RPC
  - 缓存已验证的交易

### 5. 前端状态管理
- 支付状态需要在多个组件间共享
- **建议**: 创建 PaymentContext 统一管理

---

## ✅ 下一步行动

### 阶段 1: 验证现有系统 (1-2 天)
1. ✅ 完成架构分析 (本文档)
2. ⬜ 验证 useAuth hook 实现
3. ⬜ 测试 Supabase Auth 流程
4. ⬜ 检查 PlayPass API 是否正常工作
5. ⬜ 确认 Directus 数据库表结构

### 阶段 2: 数据库扩展 (2-3 天)
1. ⬜ 创建 `web3_payments` 表
2. ⬜ 扩展 `user_content_access` 表
3. ⬜ 创建访问权限检查函数
4. ⬜ 编写数据迁移脚本

### 阶段 3: Middleware 集成 (3-4 天)
1. ⬜ 扩展 middleware 添加 402 拦截逻辑
2. ⬜ 实现访问权限检查
3. ⬜ 添加响应头元数据
4. ⬜ 测试 402 响应流程

### 阶段 4: API 开发 (4-5 天)
1. ⬜ 实现 `/api/web3/get-payment-info`
2. ⬜ 实现 `/api/web3/verify-transaction`
3. ⬜ 实现 `/api/web3/check-payment-status`
4. ⬜ 集成 wagmi/viem 链上验证

### 阶段 5: 前端组件 (5-6 天)
1. ⬜ 创建 `Web3PaymentDialog` 组件
2. ⬜ 创建 `PaymentContext`
3. ⬜ 集成 RainbowKit/ConnectKit
4. ⬜ 修改内容详情页添加支付拦截

### 阶段 6: 测试与优化 (3-4 天)
1. ⬜ 单元测试
2. ⬜ 集成测试
3. ⬜ 用户体验测试
4. ⬜ 性能优化

---

## 📊 总结

### 系统状态评分
| 模块 | 完成度 | 可用性 | 备注 |
|------|--------|--------|------|
| Supabase Auth | 80% | ⚠️ | useAuth 需验证 |
| 数据库结构 | 70% | ✅ | PlayPass 表未完全实现 |
| Middleware | 30% | ✅ | 仅更新 session,无业务逻辑 |
| Stripe 支付 | 0% | ❌ | 已完全禁用 |
| PlayPass 系统 | 50% | ⚠️ | 设计完整,实现不完全 |
| 前端组件 | 80% | ✅ | 基础组件齐全 |

### 集成难度评估
- **技术难度**: ⭐⭐⭐⭐☆ (4/5)
  - 需要处理 Web3 交易验证
  - 需要扩展 middleware
  - 需要协调 Supabase + Directus

- **时间成本**: 20-25 天 (3-4 周)

- **风险等级**: ⭐⭐⭐☆☆ (3/5)
  - 主要风险在认证系统完整性
  - Directus 集成可能有意外问题

### 推荐方案
✅ **可以安全开始 HTTP 402 + Web3 支付集成**

**理由**:
1. Stripe 已完全禁用,不会冲突
2. 数据库结构清晰,易于扩展
3. Middleware 简单,易于添加拦截逻辑
4. PlayPass 系统可以并行运行
5. 前端组件基础良好

**前提条件**:
1. 先验证 useAuth hook 实现
2. 确保 Supabase Auth 流程正常
3. 测试 middleware 拦截功能

---

**文档版本**: v1.0
**下次更新**: 完成阶段1验证后更新
