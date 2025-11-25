# HTTP 402 支付协议接入设计方案

## 一、方案概述

### 1.1 什么是 HTTP 402 协议

HTTP 402 (Payment Required) 是 HTTP 状态码的一部分，最初为未来的数字支付系统预留。近年来随着 Web Monetization API 和加密货币的发展，402 协议正在成为内容付费的标准化方案。

**核心优势：**
- ✅ 标准化的支付流程
- ✅ 支持微支付（Micropayment）
- ✅ 无需复杂的用户注册流程
- ✅ 适合按需付费内容
- ✅ 支持多种支付方式（加密货币、闪电网络、Web Monetization）

### 1.2 适用场景

**在 PlayNew.ai 平台的应用场景：**
1. **高级策略内容访问** - 付费查看完整策略详情
2. **实时套利信号** - 按次付费获取套利机会
3. **专属数据分析** - 订阅高级数据服务
4. **API 调用计费** - 开发者按调用次数付费
5. **一次性内容购买** - 无需订阅，按需购买

---

## 二、技术架构设计

### 2.1 系统架构图

```
┌─────────────────────────────────────────────────────────────┐
│                      前端应用层                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ 内容请求拦截 │  │ 支付UI组件   │  │ 钱包连接器   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    402 协议中间件层                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ 402 响应处理 │  │ 支付验证     │  │ 状态管理     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      支付网关层                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Lightning    │  │ Web3 Wallet  │  │ Stripe       │      │
│  │ Network      │  │ (Metamask)   │  │ Connect      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    数据持久化层                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Payment DB   │  │ Access Log   │  │ Receipt      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 核心组件

#### A. 402 中间件 (Next.js Middleware)

```typescript
// middleware/payment402.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function payment402Middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 检查是否为付费内容
  if (requiresPayment(pathname)) {
    // 检查用户是否已支付
    const hasAccess = await checkPaymentAccess(request);

    if (!hasAccess) {
      return new NextResponse(null, {
        status: 402,
        headers: {
          'Accept-Payment': 'lightning, web3, stripe',
          'Payment-Required': 'true',
          'Content-Price': getContentPrice(pathname),
          'Payment-Address': getPaymentAddress(),
          'WWW-Authenticate': 'Bearer realm="Premium Content"',
        },
      });
    }
  }

  return NextResponse.next();
}
```

#### B. 支付验证服务

```typescript
// lib/payment402/verifier.ts
export class Payment402Verifier {
  // Lightning Network 验证
  async verifyLightningPayment(invoice: string): Promise<boolean> {
    // 调用 Lightning Node API 验证支付
    const lnd = await connectLND();
    const payment = await lnd.lookupInvoice({ r_hash: invoice });
    return payment.settled;
  }

  // Web3 钱包验证
  async verifyWeb3Payment(txHash: string, amount: string): Promise<boolean> {
    const provider = new ethers.providers.JsonRpcProvider();
    const tx = await provider.getTransaction(txHash);
    return tx && tx.value.toString() === amount;
  }

  // Stripe 验证
  async verifyStripePayment(paymentIntentId: string): Promise<boolean> {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return paymentIntent.status === 'succeeded';
  }
}
```

---

## 三、数据库设计

### 3.1 支付记录表

```sql
CREATE TABLE payment_402_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 用户信息
  user_id UUID REFERENCES auth.users(id),
  user_address VARCHAR(255), -- 钱包地址（匿名支付）

  -- 内容信息
  content_type VARCHAR(50), -- 'strategy', 'signal', 'api_call'
  content_id UUID,
  content_url TEXT,

  -- 支付信息
  payment_method VARCHAR(50), -- 'lightning', 'web3', 'stripe'
  payment_status VARCHAR(50) DEFAULT 'pending',
  payment_proof TEXT, -- 交易哈希或收据

  -- 金额信息
  amount_cents INTEGER,
  amount_crypto DECIMAL(20, 8),
  currency VARCHAR(10), -- 'USD', 'BTC', 'ETH', 'USDC'

  -- 时间戳
  created_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ, -- 访问过期时间

  -- 索引
  INDEX idx_user_content (user_id, content_id),
  INDEX idx_payment_proof (payment_proof),
  INDEX idx_created_at (created_at)
);
```

### 3.2 访问令牌表

```sql
CREATE TABLE payment_402_access_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 关联交易
  transaction_id UUID REFERENCES payment_402_transactions(id),

  -- 令牌信息
  token TEXT UNIQUE NOT NULL,
  content_id UUID NOT NULL,

  -- 访问控制
  access_count INTEGER DEFAULT 0,
  max_access_count INTEGER, -- NULL = 无限制

  -- 时间控制
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  last_used_at TIMESTAMPTZ,

  -- 索引
  INDEX idx_token (token),
  INDEX idx_content_access (content_id, expires_at)
);
```

### 3.3 定价规则表

```sql
CREATE TABLE payment_402_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 内容类型和ID
  content_type VARCHAR(50) NOT NULL,
  content_id UUID,

  -- 定价信息
  price_usd DECIMAL(10, 2) NOT NULL,
  price_btc_sats INTEGER, -- Satoshis
  price_eth_wei BIGINT, -- Wei

  -- 访问控制
  access_duration INTERVAL, -- 访问时长
  access_count_limit INTEGER, -- 访问次数限制

  -- 元数据
  pricing_tier VARCHAR(50), -- 'basic', 'premium', 'pro'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- 索引
  INDEX idx_content_pricing (content_type, content_id),
  UNIQUE (content_type, content_id, pricing_tier)
);
```

---

## 四、前端实现方案

### 4.1 支付拦截器组件

```typescript
// components/Payment402Interceptor.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Payment402InterceptorProps {
  contentUrl: string;
  children: React.ReactNode;
}

export function Payment402Interceptor({
  contentUrl,
  children
}: Payment402InterceptorProps) {
  const [paymentRequired, setPaymentRequired] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAccess();
  }, [contentUrl]);

  async function checkAccess() {
    try {
      const response = await fetch(contentUrl, {
        method: 'HEAD',
      });

      if (response.status === 402) {
        setPaymentRequired(true);
        setPaymentInfo({
          price: response.headers.get('Content-Price'),
          methods: response.headers.get('Accept-Payment')?.split(', '),
          address: response.headers.get('Payment-Address'),
        });
      }
    } catch (error) {
      console.error('Access check failed:', error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (paymentRequired) {
    return (
      <Payment402Dialog
        paymentInfo={paymentInfo}
        contentUrl={contentUrl}
        onSuccess={() => setPaymentRequired(false)}
      />
    );
  }

  return <>{children}</>;
}
```

### 4.2 支付对话框组件

```typescript
// components/Payment402Dialog.tsx
'use client';

import { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function Payment402Dialog({ paymentInfo, contentUrl, onSuccess }) {
  const [selectedMethod, setSelectedMethod] = useState('lightning');

  return (
    <Dialog open={true}>
      <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">
          支付以访问此内容
        </h2>

        <div className="mb-6">
          <p className="text-lg font-semibold text-purple-600">
            价格: {paymentInfo.price}
          </p>
        </div>

        <Tabs value={selectedMethod} onValueChange={setSelectedMethod}>
          <TabsList>
            {paymentInfo.methods.includes('lightning') && (
              <TabsTrigger value="lightning">
                ⚡ Lightning Network
              </TabsTrigger>
            )}
            {paymentInfo.methods.includes('web3') && (
              <TabsTrigger value="web3">
                🦊 Web3 钱包
              </TabsTrigger>
            )}
            {paymentInfo.methods.includes('stripe') && (
              <TabsTrigger value="stripe">
                💳 信用卡
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="lightning">
            <LightningPayment
              amount={paymentInfo.price}
              address={paymentInfo.address}
              onSuccess={onSuccess}
            />
          </TabsContent>

          <TabsContent value="web3">
            <Web3Payment
              amount={paymentInfo.price}
              address={paymentInfo.address}
              onSuccess={onSuccess}
            />
          </TabsContent>

          <TabsContent value="stripe">
            <StripePayment
              amount={paymentInfo.price}
              contentUrl={contentUrl}
              onSuccess={onSuccess}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Dialog>
  );
}
```

### 4.3 Lightning Network 支付组件

```typescript
// components/payment/LightningPayment.tsx
'use client';

import { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';

export function LightningPayment({ amount, address, onSuccess }) {
  const [invoice, setInvoice] = useState('');
  const [status, setStatus] = useState('generating');

  useEffect(() => {
    generateInvoice();
  }, []);

  async function generateInvoice() {
    const response = await fetch('/api/payment/lightning/invoice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, memo: 'PlayNew Content' }),
    });

    const data = await response.json();
    setInvoice(data.invoice);
    setStatus('pending');

    // 开始轮询支付状态
    pollPaymentStatus(data.invoice);
  }

  async function pollPaymentStatus(invoiceId: string) {
    const interval = setInterval(async () => {
      const response = await fetch(`/api/payment/lightning/status/${invoiceId}`);
      const data = await response.json();

      if (data.settled) {
        clearInterval(interval);
        setStatus('confirmed');
        setTimeout(() => onSuccess(), 1000);
      }
    }, 2000);
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {invoice && (
        <>
          <QRCode value={invoice} size={256} />

          <div className="text-center">
            <p className="text-sm text-slate-600 mb-2">
              扫描二维码或复制 Lightning Invoice
            </p>
            <div className="p-3 bg-slate-100 rounded-lg font-mono text-xs break-all">
              {invoice}
            </div>
          </div>

          {status === 'confirmed' && (
            <div className="text-green-600 font-semibold">
              ✓ 支付确认！正在加载内容...
            </div>
          )}
        </>
      )}
    </div>
  );
}
```

---

## 五、后端 API 实现

### 5.1 Lightning Network API

```typescript
// app/api/payment/lightning/invoice/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createInvoice } from '@/lib/lightning/lnd';

export async function POST(request: NextRequest) {
  const { amount, memo } = await request.json();

  try {
    // 创建 Lightning Invoice
    const invoice = await createInvoice({
      value: amount,
      memo: memo,
      expiry: 3600, // 1小时过期
    });

    // 保存到数据库
    await savePaymentTransaction({
      payment_method: 'lightning',
      payment_proof: invoice.payment_request,
      amount_crypto: amount,
      currency: 'BTC',
      payment_status: 'pending',
    });

    return NextResponse.json({
      success: true,
      invoice: invoice.payment_request,
      r_hash: invoice.r_hash,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
```

### 5.2 Web3 支付验证 API

```typescript
// app/api/payment/web3/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';

export async function POST(request: NextRequest) {
  const { txHash, contentId, amount } = await request.json();

  try {
    // 验证交易
    const provider = new ethers.providers.JsonRpcProvider(
      process.env.ETH_RPC_URL
    );

    const tx = await provider.getTransaction(txHash);
    const receipt = await provider.getTransactionReceipt(txHash);

    // 检查交易是否成功
    if (receipt.status !== 1) {
      return NextResponse.json(
        { success: false, error: 'Transaction failed' },
        { status: 400 }
      );
    }

    // 验证金额
    const expectedAmount = ethers.utils.parseEther(amount);
    if (!tx.value.eq(expectedAmount)) {
      return NextResponse.json(
        { success: false, error: 'Incorrect amount' },
        { status: 400 }
      );
    }

    // 生成访问令牌
    const token = await createAccessToken(contentId, txHash);

    return NextResponse.json({
      success: true,
      token: token,
      accessUrl: `/content/${contentId}?token=${token}`,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
```

### 5.3 内容访问验证中间件

```typescript
// lib/payment402/access-control.ts
export async function verifyContentAccess(
  contentId: string,
  token: string
): Promise<boolean> {
  const accessToken = await supabase
    .from('payment_402_access_tokens')
    .select('*')
    .eq('token', token)
    .eq('content_id', contentId)
    .single();

  if (!accessToken.data) {
    return false;
  }

  // 检查是否过期
  if (accessToken.data.expires_at < new Date()) {
    return false;
  }

  // 检查访问次数限制
  if (
    accessToken.data.max_access_count &&
    accessToken.data.access_count >= accessToken.data.max_access_count
  ) {
    return false;
  }

  // 更新访问记录
  await supabase
    .from('payment_402_access_tokens')
    .update({
      access_count: accessToken.data.access_count + 1,
      last_used_at: new Date(),
    })
    .eq('id', accessToken.data.id);

  return true;
}
```

---

## 六、实施路线图

### Phase 1: 基础设施搭建（2周）
- [ ] 数据库表设计和创建
- [ ] 402 中间件开发
- [ ] 基础 UI 组件开发
- [ ] Stripe 集成（最简单，先实现）

### Phase 2: Lightning Network 集成（2周）
- [ ] LND 节点部署和配置
- [ ] Invoice 生成和验证
- [ ] 支付状态轮询
- [ ] QR 码支付流程

### Phase 3: Web3 钱包集成（2周）
- [ ] Metamask 连接
- [ ] 交易签名和验证
- [ ] 多链支持（Ethereum, Polygon, BSC）
- [ ] ERC-20 代币支持

### Phase 4: 测试和优化（1周）
- [ ] 端到端测试
- [ ] 性能优化
- [ ] 用户体验优化
- [ ] 错误处理完善

### Phase 5: 上线和监控（持续）
- [ ] 灰度发布
- [ ] 监控和告警
- [ ] 数据分析
- [ ] 迭代优化

---

## 七、定价策略建议

### 7.1 内容定价

| 内容类型 | 定价 | 访问权限 |
|---------|------|---------|
| 高级策略详情 | $2-5 | 永久访问 |
| 实时套利信号 | $1 | 单次访问 |
| API 调用 | $0.01/次 | 按次计费 |
| 专属分析报告 | $10-20 | 7天访问 |
| 数据订阅 | $50/月 | 无限访问 |

### 7.2 微支付优势

**Lightning Network:**
- 适合 $0.01 - $10 的小额支付
- 即时确认
- 极低手续费（< $0.01）

**推荐场景:**
- 单次内容解锁
- API 调用计费
- 付费查看信号

---

## 八、安全考虑

### 8.1 防重放攻击
```typescript
// 每个支付凭证只能使用一次
async function validatePaymentProof(proof: string) {
  const exists = await checkProofUsed(proof);
  if (exists) {
    throw new Error('Payment proof already used');
  }
  await markProofAsUsed(proof);
}
```

### 8.2 防 DDoS
```typescript
// 限制免费预览次数
async function rateLimitFreeAccess(userId: string) {
  const count = await redis.incr(`free_access:${userId}`);
  if (count > 5) {
    throw new Error('Free access limit exceeded');
  }
  await redis.expire(`free_access:${userId}`, 3600);
}
```

### 8.3 Token 安全
```typescript
// 使用加密的访问令牌
function generateSecureToken(contentId: string, userId: string) {
  const payload = {
    contentId,
    userId,
    timestamp: Date.now(),
  };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '24h',
  });
}
```

---

## 九、监控和分析

### 9.1 关键指标

```typescript
// 跟踪支付转化率
const metrics = {
  // 402 响应次数
  payment_required_count: Counter,

  // 完成支付次数
  payment_completed_count: Counter,

  // 支付成功率
  payment_success_rate: Gauge,

  // 平均支付金额
  avg_payment_amount: Histogram,

  // 各支付方式占比
  payment_method_distribution: Gauge,
};
```

### 9.2 用户行为分析

```sql
-- 分析哪些内容最受欢迎
SELECT
  content_id,
  COUNT(*) as payment_count,
  SUM(amount_cents) as total_revenue,
  AVG(amount_cents) as avg_price
FROM payment_402_transactions
WHERE payment_status = 'completed'
GROUP BY content_id
ORDER BY payment_count DESC
LIMIT 10;
```

---

## 十、总结

### 优势
✅ **标准化** - 基于 HTTP 协议，易于集成
✅ **灵活性** - 支持多种支付方式
✅ **用户体验** - 无需注册，即付即用
✅ **微支付友好** - 适合小额内容变现
✅ **隐私保护** - 支持匿名支付

### 挑战
⚠️ **浏览器支持** - 需要自定义拦截逻辑
⚠️ **用户教育** - 需要引导用户理解新支付方式
⚠️ **技术复杂度** - Lightning Network 和 Web3 需要专业知识

### 建议实施优先级
1. **首先集成 Stripe** - 最成熟，用户接受度高
2. **其次 Lightning Network** - 适合微支付场景
3. **最后 Web3 钱包** - 面向 crypto native 用户

### ROI 预估
- 投入: 2个开发人员，2-3个月开发时间
- 预期收益:
  - 转化率提升 30%（降低支付门槛）
  - 客单价降低但总收入增加（微支付累积）
  - 新用户增长 50%（无需注册即可购买）

---

## 附录：相关资源

- [HTTP 402 RFC Draft](https://www.rfc-editor.org/rfc/rfc7231#section-6.5.2)
- [Web Monetization API](https://webmonetization.org/)
- [Lightning Network](https://lightning.network/)
- [LND Documentation](https://docs.lightning.engineering/)
- [Web3.js Documentation](https://web3js.readthedocs.io/)
