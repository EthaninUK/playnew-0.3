# HTTP 402 独立接入方案

## 一、为什么 402 可以单独接入？

HTTP 402 本质上是一个**协议层标准**，而不是具体的支付实现。它的核心思想是：

```
当资源需要付费时 → 返回 402 状态码 → 告知支付方式 → 验证支付 → 授予访问权
```

**关键优势：**
✅ 完全独立于现有系统（Stripe、Supabase等）
✅ 可以逐步接入，不影响现有功能
✅ 支持多种支付后端（从简单到复杂）
✅ 用户无需注册也能购买内容

---

## 二、最简化实现方案（MVP）

### 2.1 最小可行架构

```
┌─────────────────────────────────────────┐
│         用户访问付费内容                 │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│    Next.js Middleware 检查访问权限       │
│    → 未付费则返回 402                    │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│    前端弹出支付对话框                    │
│    → 用户选择支付方式                    │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│    支付完成后获取 token                  │
│    → 带 token 重新访问内容               │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│    Middleware 验证 token                │
│    → 授予访问权限                        │
└─────────────────────────────────────────┘
```

### 2.2 最简单的实现（30分钟可完成）

**步骤1：创建支付访问表**

```sql
-- 最简单的表结构
CREATE TABLE payment_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id TEXT NOT NULL,
  access_token TEXT UNIQUE NOT NULL,
  payment_method TEXT,
  amount DECIMAL(10, 2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,

  INDEX idx_token (access_token),
  INDEX idx_content (content_id, expires_at)
);
```

**步骤2：创建 402 Middleware**

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 定义需要付费的路径
  const paidContentPaths = [
    '/strategies/premium/',
    '/arbitrage/signals/',
    '/api/premium/',
  ];

  const isPaidContent = paidContentPaths.some(path =>
    pathname.startsWith(path)
  );

  if (isPaidContent) {
    // 检查 token
    const token = request.cookies.get('payment_token')?.value ||
                 request.nextUrl.searchParams.get('token');

    if (!token) {
      // 返回 402 Payment Required
      return new NextResponse(
        JSON.stringify({
          error: 'Payment Required',
          price: '$2.99',
          methods: ['stripe', 'crypto'],
        }),
        {
          status: 402,
          headers: {
            'Content-Type': 'application/json',
            'WWW-Authenticate': 'Bearer',
          },
        }
      );
    }

    // TODO: 验证 token（下一步实现）
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/strategies/premium/:path*', '/arbitrage/signals/:path*'],
};
```

**步骤3：创建简单支付 API**

```typescript
// app/api/payment/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  const { contentId, amount, paymentProof } = await request.json();

  // 生成访问 token
  const accessToken = crypto.randomBytes(32).toString('hex');

  // 保存到数据库
  const { error } = await supabase
    .from('payment_access')
    .insert({
      content_id: contentId,
      access_token: accessToken,
      payment_method: 'stripe',
      amount: amount,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7天
    });

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }

  // 返回 token
  return NextResponse.json({
    success: true,
    token: accessToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
}
```

**步骤4：创建前端拦截组件**

```typescript
// components/Payment402Guard.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function Payment402Guard({
  contentId,
  children
}: {
  contentId: string;
  children: React.ReactNode;
}) {
  const [hasAccess, setHasAccess] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAccess();
  }, []);

  async function checkAccess() {
    try {
      const response = await fetch(window.location.href, {
        method: 'HEAD',
      });

      if (response.status === 402) {
        setShowPayment(true);
      } else {
        setHasAccess(true);
      }
    } catch (error) {
      console.error('Access check failed:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (showPayment) {
    return (
      <SimplePaymentDialog
        contentId={contentId}
        onSuccess={() => {
          setShowPayment(false);
          setHasAccess(true);
        }}
      />
    );
  }

  return hasAccess ? <>{children}</> : null;
}
```

---

## 三、渐进式接入方案

### 方案 A：从 Stripe 开始（最快）

**优势：**
- 最容易实现
- 用户接受度高
- 可以立即变现

**实现：**
```typescript
// 1. 使用 Stripe Checkout
async function createStripePayment(contentId: string, amount: number) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: { name: 'Premium Content Access' },
        unit_amount: amount * 100,
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_URL}/content/${contentId}?payment_success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/content/${contentId}`,
    metadata: { contentId },
  });

  return session.url;
}

// 2. Stripe Webhook 处理
export async function POST(request: NextRequest) {
  const sig = request.headers.get('stripe-signature')!;
  const body = await request.text();

  const event = stripe.webhooks.constructEvent(
    body,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET!
  );

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const contentId = session.metadata.contentId;

    // 创建访问 token
    await createAccessToken(contentId, session.id);
  }

  return NextResponse.json({ received: true });
}
```

### 方案 B：加入 Crypto 支付（更 Web3）

**使用 Coinbase Commerce（最简单的 crypto 支付）：**

```typescript
// app/api/payment/crypto/create/route.ts
import { Client } from 'coinbase-commerce-node';

const client = Client.init(process.env.COINBASE_COMMERCE_API_KEY!);

export async function POST(request: NextRequest) {
  const { contentId, amount } = await request.json();

  const charge = await client.charge.create({
    name: 'Premium Content Access',
    description: `Access to ${contentId}`,
    pricing_type: 'fixed_price',
    local_price: {
      amount: amount.toString(),
      currency: 'USD',
    },
    metadata: {
      contentId: contentId,
    },
  });

  return NextResponse.json({
    success: true,
    chargeUrl: charge.hosted_url,
    chargeId: charge.id,
  });
}
```

### 方案 C：Lightning Network（最适合微支付）

**使用 LNURL 协议（无需运行节点）：**

```typescript
// 使用第三方服务如 OpenNode, BTCPay Server
import axios from 'axios';

async function createLightningInvoice(amount: number, memo: string) {
  const response = await axios.post(
    'https://api.opennode.com/v1/charges',
    {
      amount: amount,
      currency: 'USD',
      description: memo,
      callback_url: `${process.env.NEXT_PUBLIC_URL}/api/payment/lightning/webhook`,
    },
    {
      headers: {
        Authorization: process.env.OPENNODE_API_KEY,
      },
    }
  );

  return {
    invoice: response.data.lightning_invoice.payreq,
    id: response.data.id,
  };
}
```

---

## 四、实战示例：给高级策略加上 402

### 4.1 修改策略详情页

```typescript
// app/strategies/[slug]/page.tsx
import { Payment402Guard } from '@/components/Payment402Guard';

export default async function StrategyDetailPage({
  params
}: {
  params: { slug: string }
}) {
  const strategy = await getStrategy(params.slug);

  // 判断是否为付费内容
  const isPremium = strategy.is_premium;

  return (
    <div>
      {/* 免费内容部分 */}
      <StrategyHeader strategy={strategy} />
      <StrategySummary summary={strategy.summary} />

      {/* 付费内容部分 */}
      {isPremium ? (
        <Payment402Guard contentId={strategy.id}>
          <StrategyFullContent content={strategy.full_content} />
          <StrategyAdvancedAnalysis analysis={strategy.analysis} />
        </Payment402Guard>
      ) : (
        <>
          <StrategyFullContent content={strategy.full_content} />
          <StrategyAdvancedAnalysis analysis={strategy.analysis} />
        </>
      )}
    </div>
  );
}
```

### 4.2 创建简单的支付对话框

```typescript
// components/SimplePaymentDialog.tsx
'use client';

import { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export function SimplePaymentDialog({
  contentId,
  onSuccess
}: {
  contentId: string;
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleStripePayment() {
    setLoading(true);

    // 创建 Stripe Checkout
    const response = await fetch('/api/payment/stripe/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contentId: contentId,
        amount: 2.99,
      }),
    });

    const data = await response.json();

    // 跳转到 Stripe
    window.location.href = data.checkoutUrl;
  }

  async function handleCryptoPayment() {
    setLoading(true);

    const response = await fetch('/api/payment/crypto/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contentId: contentId,
        amount: 2.99,
      }),
    });

    const data = await response.json();
    window.open(data.chargeUrl, '_blank');
  }

  return (
    <Dialog open={true}>
      <div className="max-w-md mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">
          解锁高级内容
        </h2>

        <div className="mb-6">
          <p className="text-3xl font-bold text-purple-600">$2.99</p>
          <p className="text-sm text-slate-600">一次性购买，永久访问</p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleStripePayment}
            disabled={loading}
            className="w-full"
          >
            💳 信用卡支付
          </Button>

          <Button
            onClick={handleCryptoPayment}
            disabled={loading}
            variant="outline"
            className="w-full"
          >
            ₿ 加密货币支付
          </Button>
        </div>

        <p className="text-xs text-slate-500 mt-4 text-center">
          支付后立即获得访问权限
        </p>
      </div>
    </Dialog>
  );
}
```

---

## 五、完全独立的实现（不依赖任何现有系统）

### 5.1 使用本地存储 + Cookie

```typescript
// 最简单的方式：客户端存储
function storeAccessToken(contentId: string, token: string) {
  // 存储到 cookie（7天过期）
  document.cookie = `access_${contentId}=${token}; max-age=${7 * 24 * 60 * 60}; path=/`;

  // 同时存储到 localStorage（备份）
  localStorage.setItem(`access_${contentId}`, JSON.stringify({
    token: token,
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
  }));
}

// 验证访问权限
function checkAccess(contentId: string): boolean {
  // 先检查 cookie
  const cookieToken = getCookie(`access_${contentId}`);
  if (cookieToken) return true;

  // 再检查 localStorage
  const stored = localStorage.getItem(`access_${contentId}`);
  if (stored) {
    const data = JSON.parse(stored);
    if (data.expiresAt > Date.now()) {
      return true;
    }
  }

  return false;
}
```

### 5.2 纯前端实现（无需后端）

```typescript
// components/ClientSide402Guard.tsx
'use client';

import { useEffect, useState } from 'react';

export function ClientSide402Guard({
  contentId,
  price,
  children
}: {
  contentId: string;
  price: number;
  children: React.ReactNode;
}) {
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    // 检查本地存储
    const access = checkLocalAccess(contentId);
    setHasAccess(access);
  }, [contentId]);

  if (!hasAccess) {
    return (
      <div className="text-center p-12 border-2 border-dashed rounded-lg">
        <h3 className="text-xl font-bold mb-2">高级内容</h3>
        <p className="text-3xl font-bold text-purple-600 mb-4">${price}</p>
        <button
          onClick={() => handlePayment(contentId)}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg"
        >
          解锁内容
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
```

---

## 六、对比：单独接入 vs 集成到现有系统

| 特性 | 单独接入 | 集成现有系统 |
|------|---------|-------------|
| 开发时间 | 1-2天 | 1-2周 |
| 技术复杂度 | 低 | 中高 |
| 用户体验 | 简单直接 | 更完善 |
| 维护成本 | 低 | 中 |
| 功能完整性 | 基础 | 完整 |
| 扩展性 | 有限 | 强 |

---

## 七、推荐实施步骤

### 第1天：基础框架
- [ ] 创建 `payment_access` 表
- [ ] 实现基础 Middleware
- [ ] 创建简单的 Payment Guard 组件

### 第2天：支付集成
- [ ] 集成 Stripe Checkout（最简单）
- [ ] 实现 Webhook 处理
- [ ] 测试完整流程

### 第3天：优化和部署
- [ ] 添加错误处理
- [ ] 优化用户体验
- [ ] 灰度发布

### 后续迭代
- Week 2: 添加 Crypto 支付
- Week 3: 添加 Lightning Network
- Week 4: 数据分析和优化

---

## 八、最小化代码示例（可直接使用）

```typescript
// 完整的 MVP 实现（约100行代码）

// 1. Middleware
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.includes('/premium/')) {
    const token = request.cookies.get('payment_token')?.value;
    if (!token) {
      return new NextResponse(null, { status: 402 });
    }
  }
  return NextResponse.next();
}

// 2. Payment API
export async function POST(request: NextRequest) {
  const { contentId, stripePaymentId } = await request.json();

  // 验证支付（简化版）
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const payment = await stripe.paymentIntents.retrieve(stripePaymentId);

  if (payment.status === 'succeeded') {
    const token = crypto.randomBytes(32).toString('hex');

    // 存储到数据库
    await supabase.from('payment_access').insert({
      content_id: contentId,
      access_token: token,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return NextResponse.json({ success: true, token });
  }

  return NextResponse.json({ success: false }, { status: 400 });
}

// 3. 前端组件
export function Payment402Guard({ contentId, children }) {
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    checkAccess().then(setHasAccess);
  }, []);

  return hasAccess ? children : <PaymentDialog contentId={contentId} />;
}
```

---

## 总结

**可以单独接入！而且非常简单！**

✅ **最快路径：** 用 Stripe + Cookie，2天完成
✅ **最灵活：** 可以先实现基础功能，后续逐步增强
✅ **不影响现有系统：** 完全独立运行
✅ **ROI 高：** 开发成本低，可以快速验证市场需求

建议从最简单的 Stripe 集成开始，验证用户付费意愿后，再考虑添加 Crypto 和 Lightning 支付。
