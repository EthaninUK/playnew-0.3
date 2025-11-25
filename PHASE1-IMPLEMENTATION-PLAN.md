# Phase 1 实施方案:玩法库升级为综合交易平台

## 一、项目概述

### 1.1 目标
在现有"玩法库"基础上,增加**单品售卖**和**任务悬赏**功能,测试用户对"单次购买"模式的接受度。

### 1.2 技术原则
- ✅ 最小化变更:复用现有架构(Directus + Next.js + Stripe)
- ✅ 快速验证:1-2 周完成开发,立即上线测试
- ✅ 低风险:不影响现有会员订阅功能
- ✅ 可回滚:如测试失败,可快速下线

### 1.3 时间规划
- **Week 1**:数据库改造 + 后端 API + Directus 配置
- **Week 2**:前端改造 + 测试 + 上线首批商品

---

## 二、数据库改造方案

### 2.1 扩展 `strategies` 表(核心商品表)

#### 方案 A:直接在 Directus 后台添加字段(推荐)

**优势**:
- 无需写 SQL,通过 UI 操作
- 自动生成 API
- 支持权限控制

**操作步骤**:
1. 登录 Directus Admin(http://localhost:8055)
2. 进入 Settings → Data Model → strategies
3. 添加以下字段:

| 字段名 | 类型 | 默认值 | 说明 | 是否必填 |
|--------|------|--------|------|---------|
| `pricing_model` | Dropdown | `membership` | 定价模式:<br>- `membership`:会员权限<br>- `one_time`:单次购买<br>- `recurring`:订阅(暂不实现) | 否 |
| `price_usd` | Decimal(10,2) | NULL | 单次购买价格(USD) | 否 |
| `is_premium` | Boolean | false | 是否为付费商品 | 否 |
| `product_type` | Dropdown | `guide` | 商品类型:<br>- `guide`:指南/教程<br>- `script`:脚本/工具<br>- `data`:数据/信号<br>- `service`:服务<br>- `task`:任务 | 否 |
| `delivery_type` | Dropdown | `document` | 交付方式:<br>- `document`:文档(Notion/PDF)<br>- `script`:代码包(ZIP/GitHub)<br>- `api_token`:API Token<br>- `service_milestone`:服务(里程碑) | 否 |
| `download_url` | String(长文本) | NULL | 交付链接(购买后可见,支持 Markdown 格式)<br>示例:<br>- GitHub: https://github.com/xxx<br>- 网盘: https://drive.google.com/xxx<br>- Notion: https://notion.so/xxx | 否 |
| `installation_doc` | Text(富文本) | NULL | 安装说明(脚本类商品必填) | 否 |
| `seller_id` | UUID(关联 directus_users) | NULL | 卖家 ID(留空=平台自营) | 否 |
| `commission_rate` | Decimal(5,2) | 0.15 | 平台抽成比例(0.15=15%) | 否 |
| `sales_count` | Integer | 0 | 销售次数 | 否 |
| `refund_count` | Integer | 0 | 退款次数 | 否 |
| `avg_rating` | Decimal(3,2) | NULL | 平均评分(1-5) | 否 |

#### 方案 B:执行 SQL(适用于批量操作)

如果 Directus 后台操作慢,可直接执行 SQL:

```sql
-- 连接数据库(根据你的环境调整)
-- docker-compose exec directus-db psql -U directus -d directus_play

-- 添加新字段
ALTER TABLE strategies ADD COLUMN pricing_model VARCHAR(20) DEFAULT 'membership';
ALTER TABLE strategies ADD COLUMN price_usd DECIMAL(10,2) DEFAULT NULL;
ALTER TABLE strategies ADD COLUMN is_premium BOOLEAN DEFAULT false;
ALTER TABLE strategies ADD COLUMN product_type VARCHAR(20) DEFAULT 'guide';
ALTER TABLE strategies ADD COLUMN delivery_type VARCHAR(20) DEFAULT 'document';
ALTER TABLE strategies ADD COLUMN download_url TEXT;
ALTER TABLE strategies ADD COLUMN installation_doc TEXT;
ALTER TABLE strategies ADD COLUMN seller_id UUID REFERENCES directus_users(id);
ALTER TABLE strategies ADD COLUMN commission_rate DECIMAL(5,2) DEFAULT 0.15;
ALTER TABLE strategies ADD COLUMN sales_count INTEGER DEFAULT 0;
ALTER TABLE strategies ADD COLUMN refund_count INTEGER DEFAULT 0;
ALTER TABLE strategies ADD COLUMN avg_rating DECIMAL(3,2) DEFAULT NULL;

-- 创建索引(优化查询性能)
CREATE INDEX idx_strategies_pricing_model ON strategies(pricing_model);
CREATE INDEX idx_strategies_product_type ON strategies(product_type);
CREATE INDEX idx_strategies_seller_id ON strategies(seller_id);

-- 验证字段是否添加成功
\d strategies
```

---

### 2.2 新建 `orders` 表(单品订单)

#### Directus 后台操作:

1. Settings → Data Model → Create New Collection
2. Collection Name: `orders`
3. 添加字段:

| 字段名 | 类型 | 默认值 | 说明 | 是否必填 |
|--------|------|--------|------|---------|
| `id` | UUID | auto | 主键 | 是 |
| `user_id` | UUID(关联 directus_users) | - | 购买用户 | 是 |
| `product_id` | UUID(关联 strategies) | - | 商品 ID | 是 |
| `amount` | Decimal(10,2) | - | 订单金额(USD) | 是 |
| `payment_method` | Dropdown | - | 支付方式:<br>- `stripe`:信用卡<br>- `crypto`:加密货币 | 是 |
| `payment_status` | Dropdown | `pending` | 支付状态:<br>- `pending`:待支付<br>- `paid`:已支付<br>- `refunded`:已退款<br>- `failed`:支付失败 | 是 |
| `delivery_status` | Dropdown | `pending` | 交付状态:<br>- `pending`:待交付<br>- `delivered`:已交付<br>- `accessed`:已访问 | 是 |
| `stripe_payment_intent_id` | String | NULL | Stripe 支付 ID | 否 |
| `refund_reason` | Text | NULL | 退款原因 | 否 |
| `refund_approved_by` | UUID(关联 directus_users) | NULL | 退款审批人 | 否 |
| `created_at` | Timestamp | now() | 创建时间 | 是 |
| `paid_at` | Timestamp | NULL | 支付时间 | 否 |
| `refunded_at` | Timestamp | NULL | 退款时间 | 否 |

#### SQL 方式:

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES directus_users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES strategies(id) ON DELETE RESTRICT,
  amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(20) NOT NULL,
  payment_status VARCHAR(20) DEFAULT 'pending',
  delivery_status VARCHAR(20) DEFAULT 'pending',
  stripe_payment_intent_id VARCHAR(255),
  refund_reason TEXT,
  refund_approved_by UUID REFERENCES directus_users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  paid_at TIMESTAMP,
  refunded_at TIMESTAMP
);

-- 创建索引
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_product_id ON orders(product_id);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- 添加外键约束
ALTER TABLE orders ADD CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES directus_users(id);
ALTER TABLE orders ADD CONSTRAINT fk_orders_product FOREIGN KEY (product_id) REFERENCES strategies(id);
```

---

### 2.3 新建 `tasks` 表(任务悬赏)

#### Directus 后台操作:

1. Settings → Data Model → Create New Collection
2. Collection Name: `tasks`
3. 添加字段:

| 字段名 | 类型 | 默认值 | 说明 | 是否必填 |
|--------|------|--------|------|---------|
| `id` | UUID | auto | 主键 | 是 |
| `publisher_id` | UUID(关联 directus_users) | - | 发布者(项目方) | 是 |
| `title` | String(200) | - | 任务标题 | 是 |
| `description` | Text(富文本) | - | 任务描述 | 是 |
| `reward_pool` | Decimal(10,2) | - | 总奖励池(USD) | 是 |
| `reward_per_unit` | Decimal(10,2) | - | 单个任务奖励(USD) | 是 |
| `total_slots` | Integer | - | 总名额 | 是 |
| `completed_count` | Integer | 0 | 已完成数量 | 否 |
| `requirements` | JSON | {} | 任务要求(JSON 格式):<br>`{ "wallet": true, "twitter": true, "min_followers": 100 }` | 否 |
| `verification_method` | Dropdown | `manual` | 验证方式:<br>- `auto`:自动(链上验证)<br>- `manual`:人工审核 | 是 |
| `status` | Dropdown | `active` | 状态:<br>- `active`:进行中<br>- `paused`:暂停<br>- `completed`:已完成<br>- `cancelled`:已取消 | 是 |
| `deadline` | Timestamp | - | 截止时间 | 是 |
| `category` | String | - | 任务分类(关联 categories.slug) | 否 |
| `tags` | Tags(多选) | [] | 标签 | 否 |
| `created_at` | Timestamp | now() | 创建时间 | 是 |
| `updated_at` | Timestamp | now() | 更新时间 | 是 |

#### SQL 方式:

```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  publisher_id UUID NOT NULL REFERENCES directus_users(id),
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  reward_pool DECIMAL(10,2) NOT NULL,
  reward_per_unit DECIMAL(10,2) NOT NULL,
  total_slots INTEGER NOT NULL,
  completed_count INTEGER DEFAULT 0,
  requirements JSONB DEFAULT '{}',
  verification_method VARCHAR(20) DEFAULT 'manual',
  status VARCHAR(20) DEFAULT 'active',
  deadline TIMESTAMP NOT NULL,
  category VARCHAR(50),
  tags TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_tasks_publisher_id ON tasks(publisher_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_deadline ON tasks(deadline);
CREATE INDEX idx_tasks_category ON tasks(category);

-- 添加触发器(自动更新 updated_at)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

### 2.4 新建 `task_submissions` 表(任务提交记录)

用于记录用户完成任务的提交凭证。

#### Directus 后台操作:

| 字段名 | 类型 | 默认值 | 说明 | 是否必填 |
|--------|------|--------|------|---------|
| `id` | UUID | auto | 主键 | 是 |
| `task_id` | UUID(关联 tasks) | - | 任务 ID | 是 |
| `user_id` | UUID(关联 directus_users) | - | 提交用户 | 是 |
| `proof` | JSON | {} | 提交凭证(JSON):<br>`{ "wallet": "0x123", "tx_hash": "0xabc", "screenshot": "url" }` | 是 |
| `status` | Dropdown | `pending` | 审核状态:<br>- `pending`:待审核<br>- `approved`:通过<br>- `rejected`:驳回 | 是 |
| `reject_reason` | Text | NULL | 驳回原因 | 否 |
| `reviewed_by` | UUID(关联 directus_users) | NULL | 审核人 | 否 |
| `reviewed_at` | Timestamp | NULL | 审核时间 | 否 |
| `reward_paid` | Boolean | false | 是否已发放奖励 | 否 |
| `created_at` | Timestamp | now() | 提交时间 | 是 |

#### SQL 方式:

```sql
CREATE TABLE task_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES directus_users(id) ON DELETE CASCADE,
  proof JSONB NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  reject_reason TEXT,
  reviewed_by UUID REFERENCES directus_users(id),
  reviewed_at TIMESTAMP,
  reward_paid BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_task_submissions_task_id ON task_submissions(task_id);
CREATE INDEX idx_task_submissions_user_id ON task_submissions(user_id);
CREATE INDEX idx_task_submissions_status ON task_submissions(status);

-- 唯一约束(一个用户只能提交一次同一个任务)
ALTER TABLE task_submissions ADD CONSTRAINT unique_user_task UNIQUE (task_id, user_id);
```

---

## 三、后端 API 设计

### 3.1 商品购买流程 API

#### API 1: 创建支付会话(Stripe Checkout)

**路径**: `POST /api/create-product-checkout`

**请求体**:
```json
{
  "product_id": "uuid",
  "success_url": "https://playnew.ai/payment/success?order_id={ORDER_ID}",
  "cancel_url": "https://playnew.ai/strategies/layerzero-guide"
}
```

**响应**:
```json
{
  "checkout_url": "https://checkout.stripe.com/c/pay/xxx",
  "order_id": "uuid"
}
```

**实现逻辑**:
1. 验证用户登录状态(from Supabase session)
2. 查询商品信息(从 Directus `strategies` 表)
3. 检查用户是否已购买(查询 `orders` 表)
4. 创建订单记录(状态:`pending`)
5. 创建 Stripe Checkout Session
6. 返回支付链接

**代码示例**:
```typescript
// app/api/create-product-checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { directus } from '@/lib/directus';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { product_id, success_url, cancel_url } = await request.json();

    // 1. 验证用户登录
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. 查询商品信息
    const product = await directus.request(
      readItem('strategies', product_id)
    );
    if (!product || product.pricing_model !== 'one_time') {
      return NextResponse.json({ error: 'Invalid product' }, { status: 400 });
    }

    // 3. 检查是否已购买
    const existingOrder = await directus.request(
      readItems('orders', {
        filter: {
          user_id: { _eq: user.id },
          product_id: { _eq: product_id },
          payment_status: { _eq: 'paid' }
        },
        limit: 1
      })
    );
    if (existingOrder.length > 0) {
      return NextResponse.json({ error: 'Already purchased' }, { status: 400 });
    }

    // 4. 创建订单记录
    const order = await directus.request(
      createItem('orders', {
        user_id: user.id,
        product_id: product_id,
        amount: product.price_usd,
        payment_method: 'stripe',
        payment_status: 'pending',
        delivery_status: 'pending'
      })
    );

    // 5. 创建 Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.title,
              description: product.summary,
            },
            unit_amount: Math.round(product.price_usd * 100), // 转为美分
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: success_url.replace('{ORDER_ID}', order.id),
      cancel_url: cancel_url,
      metadata: {
        order_id: order.id,
        product_id: product_id,
        user_id: user.id
      }
    });

    return NextResponse.json({
      checkout_url: session.url,
      order_id: order.id
    });
  } catch (error) {
    console.error('Error creating checkout:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

---

#### API 2: Stripe Webhook(支付成功回调)

**路径**: `POST /api/webhooks/stripe-product`

**功能**:
- 监听 Stripe 的 `checkout.session.completed` 事件
- 更新订单状态为 `paid`
- 增加商品销售计数
- 发送购买成功邮件(可选)

**实现逻辑**:
```typescript
// app/api/webhooks/stripe-product/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { directus } from '@/lib/directus';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const { order_id, product_id } = session.metadata;

    // 更新订单状态
    await directus.request(
      updateItem('orders', order_id, {
        payment_status: 'paid',
        delivery_status: 'delivered',
        stripe_payment_intent_id: session.payment_intent,
        paid_at: new Date().toISOString()
      })
    );

    // 增加商品销售计数
    await directus.request(
      updateItem('strategies', product_id, {
        sales_count: { _increment: 1 }
      })
    );

    // TODO: 发送购买成功邮件
  }

  return NextResponse.json({ received: true });
}
```

---

#### API 3: 检查购买状态

**路径**: `GET /api/check-purchase?product_id={uuid}`

**功能**:
- 检查当前用户是否已购买该商品
- 或者是否有会员权限访问

**响应**:
```json
{
  "can_access": true,
  "access_method": "purchased", // 'purchased' | 'membership' | 'none'
  "order_id": "uuid" // 如果是购买的
}
```

**实现逻辑**:
```typescript
// app/api/check-purchase/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { directus } from '@/lib/directus';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const product_id = searchParams.get('product_id');

  // 验证用户登录
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ can_access: false, access_method: 'none' });
  }

  // 查询商品信息
  const product = await directus.request(readItem('strategies', product_id));
  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  // 情况1:检查是否已购买
  if (product.pricing_model === 'one_time') {
    const orders = await directus.request(
      readItems('orders', {
        filter: {
          user_id: { _eq: user.id },
          product_id: { _eq: product_id },
          payment_status: { _eq: 'paid' }
        },
        limit: 1
      })
    );
    if (orders.length > 0) {
      return NextResponse.json({
        can_access: true,
        access_method: 'purchased',
        order_id: orders[0].id
      });
    }
  }

  // 情况2:检查会员权限
  if (product.pricing_model === 'membership') {
    // 查询用户会员信息(从 Supabase 或 Directus)
    // TODO: 实现会员权限检查逻辑
    const hasAccess = true; // 暂时返回 true
    if (hasAccess) {
      return NextResponse.json({
        can_access: true,
        access_method: 'membership'
      });
    }
  }

  return NextResponse.json({ can_access: false, access_method: 'none' });
}
```

---

### 3.2 任务悬赏流程 API

#### API 4: 获取任务列表

**路径**: `GET /api/tasks?status=active&limit=20`

**响应**:
```json
{
  "tasks": [
    {
      "id": "uuid",
      "title": "zkSync 测试网交互任务",
      "description": "完成 3 笔交互...",
      "reward_per_unit": 5,
      "total_slots": 100,
      "completed_count": 45,
      "deadline": "2024-02-01T00:00:00Z",
      "status": "active"
    }
  ]
}
```

---

#### API 5: 提交任务凭证

**路径**: `POST /api/tasks/submit`

**请求体**:
```json
{
  "task_id": "uuid",
  "proof": {
    "wallet": "0x1234...",
    "tx_hash": "0xabc...",
    "screenshot": "https://..."
  }
}
```

**响应**:
```json
{
  "submission_id": "uuid",
  "status": "pending",
  "message": "提交成功,等待审核"
}
```

---

#### API 6: 任务审核(管理员)

**路径**: `POST /api/tasks/review`

**请求体**:
```json
{
  "submission_id": "uuid",
  "action": "approve", // 'approve' | 'reject'
  "reject_reason": "截图不清晰"
}
```

---

## 四、前端改造方案

### 4.1 更新 TypeScript 类型定义

```typescript
// lib/directus.ts (扩展 Strategy 接口)

export interface Strategy {
  // 现有字段...
  id: string;
  title: string;
  slug: string;
  // ...

  // 新增字段
  pricing_model?: 'membership' | 'one_time' | 'recurring';
  price_usd?: number;
  is_premium?: boolean;
  product_type?: 'guide' | 'script' | 'data' | 'service' | 'task';
  delivery_type?: 'document' | 'script' | 'api_token' | 'service_milestone';
  download_url?: string;
  installation_doc?: string;
  seller_id?: string;
  sales_count?: number;
  avg_rating?: number;
}

export interface Order {
  id: string;
  user_id: string;
  product_id: string;
  amount: number;
  payment_method: 'stripe' | 'crypto';
  payment_status: 'pending' | 'paid' | 'refunded' | 'failed';
  delivery_status: 'pending' | 'delivered' | 'accessed';
  stripe_payment_intent_id?: string;
  created_at: string;
  paid_at?: string;
}

export interface Task {
  id: string;
  publisher_id: string;
  title: string;
  description: string;
  reward_pool: number;
  reward_per_unit: number;
  total_slots: number;
  completed_count: number;
  requirements: Record<string, any>;
  verification_method: 'auto' | 'manual';
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  deadline: string;
  category?: string;
  tags?: string[];
  created_at: string;
}
```

---

### 4.2 商品详情页改造

**文件**: `app/strategies/[slug]/page.tsx`

**改造内容**:
1. 增加"定价模式"判断逻辑
2. 显示购买按钮(单品)或会员门槛(会员内容)
3. 购买后显示下载按钮/交付链接

**核心代码**:
```typescript
// app/strategies/[slug]/page.tsx

export default async function StrategyDetailPage({ params }: { params: { slug: string } }) {
  const strategy = await getStrategy(params.slug);
  if (!strategy) return notFound();

  // 检查用户购买状态
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let canAccess = false;
  let accessMethod = 'none';

  if (user) {
    const response = await fetch(`/api/check-purchase?product_id=${strategy.id}`);
    const data = await response.json();
    canAccess = data.can_access;
    accessMethod = data.access_method;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 商品标题 */}
      <h1 className="text-4xl font-bold mb-4">{strategy.title}</h1>

      {/* 定价信息 */}
      <PricingSection strategy={strategy} canAccess={canAccess} accessMethod={accessMethod} />

      {/* 内容展示 */}
      {canAccess ? (
        <ContentSection strategy={strategy} />
      ) : (
        <LockedContent strategy={strategy} />
      )}
    </div>
  );
}

// 定价组件
function PricingSection({ strategy, canAccess, accessMethod }) {
  if (strategy.pricing_model === 'one_time') {
    if (canAccess && accessMethod === 'purchased') {
      return (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <Check className="inline mr-2" />
          您已购买此商品
          {strategy.download_url && (
            <a href={strategy.download_url} className="ml-4 text-blue-600">
              下载/访问 →
            </a>
          )}
        </div>
      );
    }

    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold">${strategy.price_usd}</div>
            <div className="text-sm text-muted-foreground">一次性购买,永久访问</div>
          </div>
          <Button onClick={() => handlePurchase(strategy.id)}>
            立即购买
          </Button>
        </div>
      </div>
    );
  }

  if (strategy.pricing_model === 'membership') {
    return <MembershipGate requiredLevel={strategy.content_access_level} />;
  }

  return null;
}

// 购买处理函数
async function handlePurchase(productId: string) {
  const response = await fetch('/api/create-product-checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      product_id: productId,
      success_url: `${window.location.origin}/payment/success?order_id={ORDER_ID}`,
      cancel_url: window.location.href
    })
  });

  const data = await response.json();
  if (data.checkout_url) {
    window.location.href = data.checkout_url;
  }
}
```

---

### 4.3 商品卡片组件更新

**文件**: `components/strategies/StrategyCard.tsx`

**改造内容**:
- 增加价格标签(单品售卖)
- 显示"会员专享"标识(会员内容)
- 显示销售数量

```tsx
// components/strategies/StrategyCard.tsx

export function StrategyCard({ strategy }: { strategy: Strategy }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      {/* 商品类型徽章 */}
      <div className="absolute top-4 right-4">
        {strategy.product_type === 'script' && (
          <Badge variant="secondary">🤖 脚本工具</Badge>
        )}
        {strategy.product_type === 'data' && (
          <Badge variant="secondary">📊 数据信号</Badge>
        )}
      </div>

      {/* 标题 */}
      <h3 className="text-xl font-bold mb-2">{strategy.title}</h3>

      {/* 价格 */}
      <div className="flex items-center justify-between mt-4">
        {strategy.pricing_model === 'one_time' ? (
          <div className="text-2xl font-bold">${strategy.price_usd}</div>
        ) : (
          <Badge>会员专享</Badge>
        )}

        {strategy.sales_count > 0 && (
          <div className="text-sm text-muted-foreground">
            已售 {strategy.sales_count}
          </div>
        )}
      </div>

      <Button asChild className="w-full mt-4">
        <Link href={`/strategies/${strategy.slug}`}>
          {strategy.pricing_model === 'one_time' ? '查看详情' : '立即访问'}
        </Link>
      </Button>
    </Card>
  );
}
```

---

### 4.4 新建任务市场页面

**文件**: `app/tasks/page.tsx`

**功能**:
- 展示任务列表
- 筛选(进行中/已完成)
- 任务详情弹窗
- 提交凭证

```tsx
// app/tasks/page.tsx

import { getTasks } from '@/lib/directus';
import { TaskList } from '@/components/tasks/TaskList';

export default async function TasksPage() {
  const tasks = await getTasks({ status: 'active' });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">任务市场</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}

function TaskCard({ task }) {
  const progress = (task.completed_count / task.total_slots) * 100;

  return (
    <Card>
      <h3 className="text-xl font-bold mb-2">{task.title}</h3>
      <p className="text-sm text-muted-foreground mb-4">
        {task.description.substring(0, 100)}...
      </p>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>奖励</span>
          <span className="font-bold">${task.reward_per_unit}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span>名额</span>
          <span>
            {task.completed_count} / {task.total_slots}
          </span>
        </div>

        <Progress value={progress} />

        <div className="flex justify-between text-sm text-muted-foreground">
          <span>截止时间</span>
          <span>{new Date(task.deadline).toLocaleDateString('zh-CN')}</span>
        </div>
      </div>

      <Button asChild className="w-full mt-4">
        <Link href={`/tasks/${task.id}`}>
          立即参与
        </Link>
      </Button>
    </Card>
  );
}
```

---

### 4.5 个人中心增加"我的订单"

**文件**: `app/profile/orders/page.tsx`

**功能**:
- 展示购买历史
- 下载/访问已购商品
- 申请退款(7 天内)

```tsx
// app/profile/orders/page.tsx

export default async function OrdersPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const orders = await fetch(`/api/orders?user_id=${user.id}`);
  const data = await orders.json();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">我的订单</h1>

      <div className="space-y-4">
        {data.orders.map(order => (
          <Card key={order.id} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold">{order.product.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.created_at).toLocaleDateString('zh-CN')}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="font-bold">${order.amount}</div>
                  <Badge variant={order.payment_status === 'paid' ? 'success' : 'secondary'}>
                    {order.payment_status}
                  </Badge>
                </div>

                {order.payment_status === 'paid' && order.product.download_url && (
                  <Button asChild>
                    <a href={order.product.download_url} target="_blank">
                      访问/下载
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

---

## 五、Directus 后台配置

### 5.1 配置字段权限

1. Settings → Access Control → Public Role
2. 设置 `strategies` 表权限:
   - ✅ Read:允许(但隐藏 `download_url` 字段,仅购买用户可见)
   - ❌ Create/Update/Delete:禁止

3. 设置 `orders` 表权限:
   - ✅ Read:仅自己的订单
   - ❌ Create/Update/Delete:禁止(通过 API 创建)

### 5.2 配置字段展示条件

在 Directus 后台,可以设置"字段条件展示":
- `download_url`:仅当 `pricing_model = 'one_time'` 时显示
- `installation_doc`:仅当 `product_type = 'script'` 时显示

---

## 六、测试与上线计划

### 6.1 Week 1 任务清单

**Day 1-2:数据库改造**
- [ ] 在 Directus 后台添加 `strategies` 表新字段
- [ ] 创建 `orders` 表
- [ ] 创建 `tasks` 表
- [ ] 创建 `task_submissions` 表
- [ ] 验证字段和索引

**Day 3-4:后端 API 开发**
- [ ] 实现 `/api/create-product-checkout`
- [ ] 实现 `/api/webhooks/stripe-product`
- [ ] 实现 `/api/check-purchase`
- [ ] 实现 `/api/tasks` 系列 API
- [ ] 测试 Stripe 支付流程(沙盒环境)

**Day 5:Directus 配置**
- [ ] 配置权限控制
- [ ] 配置字段展示条件
- [ ] 创建测试数据(5 个付费商品)

---

### 6.2 Week 2 任务清单

**Day 1-3:前端开发**
- [ ] 更新 TypeScript 类型定义
- [ ] 改造 `StrategyCard` 组件(显示价格)
- [ ] 改造 `StrategyDetailPage`(购买按钮)
- [ ] 新建 `TasksPage` 页面
- [ ] 新建 `OrdersPage` 页面

**Day 4:测试**
- [ ] 端到端测试:浏览 → 购买 → 支付 → 访问
- [ ] 测试会员权限与单品购买的优先级逻辑
- [ ] 测试任务提交流程
- [ ] 修复 Bug

**Day 5:上线准备**
- [ ] 准备首批 5-10 个付费商品(Guide + Script)
- [ ] 撰写商品描述和使用说明
- [ ] 配置 Stripe 生产环境
- [ ] 部署到生产环境
- [ ] 灰度发布(先对部分用户开放)

---

### 6.3 首批试水商品建议

| 商品名称 | 类型 | 定价 | 目标 |
|---------|------|------|------|
| 《LayerZero 空投完全指南》 | Guide | $49 | 测试用户对"单品购买"的接受度 |
| 《zkSync 生态早鸟攻略》 | Guide | $29 | 测试低价商品转化率 |
| 多钱包批量交互脚本(Python) | Script | $99 | 测试工具类商品需求 |
| 资金费率监控 API(7 天试用) | Data | $19 | 测试订阅类商品(虽然 Phase 1 未完整实现,可作为"7 天体验包") |
| zkSync 测试网任务包 | Task | $3/次 | 测试任务悬赏功能 |

---

## 七、关键指标监控

### 7.1 Phase 1 验证指标

**核心问题**:用户更喜欢"订阅会员"还是"单品购买"?

**监控指标**:

| 指标 | 目标 | 验证标准 |
|------|------|---------|
| 单品购买转化率 | ≥5% | ✅ 继续扩充品类 |
| 会员订阅转化率 | ≥3% | - |
| 单品购买客单价 | ≥$40 | - |
| 退款率 | <10% | - |
| 复购率(30 天内) | ≥15% | ✅ 用户认可商品质量 |
| 任务完成率 | ≥80% | ✅ 任务设计合理 |

**决策点**(运行 1 个月后):
- ✅ 单品转化率 > 5%,且用户反馈正面 → 进入 Phase 2,扩充品类
- ❌ 单品转化率 < 2%,且用户更倾向订阅 → 专注优化会员体系,暂停商城计划

---

### 7.2 数据采集方案

**使用 Plausible 或 Google Analytics 追踪**:

```typescript
// 商品详情页
useEffect(() => {
  plausible('Product View', {
    props: {
      product_id: strategy.id,
      product_type: strategy.product_type,
      price: strategy.price_usd,
      pricing_model: strategy.pricing_model
    }
  });
}, [strategy]);

// 点击购买按钮
function handlePurchase() {
  plausible('Click Purchase Button', {
    props: {
      product_id: strategy.id,
      price: strategy.price_usd
    }
  });
  // ...
}

// 支付成功页
plausible('Purchase Complete', {
  props: {
    order_id: orderId,
    amount: amount,
    payment_method: 'stripe'
  }
});
```

---

## 八、风险与应对

### 8.1 技术风险

| 风险 | 概率 | 影响 | 应对措施 |
|------|------|------|---------|
| Stripe Webhook 丢失 | 中 | 高 | 增加定时任务,每小时检查未完成订单 |
| 用户退款率过高 | 中 | 中 | 提供 7 天退款保障,明确退款条款 |
| 数据库字段冲突 | 低 | 低 | 充分测试后再上线 |

---

### 8.2 运营风险

| 风险 | 概率 | 影响 | 应对措施 |
|------|------|------|---------|
| 商品质量不达预期 | 中 | 高 | 人工审核首批商品,建立退款机制 |
| 用户对单品购买兴趣低 | 中 | 中 | 1 个月后复盘数据,决定是否继续 |
| 任务作弊 | 高 | 中 | 人工抽检 20%,建立黑名单机制 |

---

## 九、后续扩展路径

### Phase 2 预览(3-6 个月)

如果 Phase 1 验证成功,后续可扩展:

1. **数据/信号订阅商品**
   - API Token 管理系统
   - Webhook 推送服务
   - TG Bot 集成

2. **服务类商品(托管交易)**
   - Stripe 分阶段支付
   - Milestone 管理系统
   - 纠纷仲裁流程

3. **AI Persona 自营**
   - n8n 自动化生产流水线
   - 4-6 个 AI 虚拟卖家
   - 周产出 8-10 个商品

4. **开放真人卖家入驻**
   - 卖家后台
   - 分润系统
   - 质量评分机制

---

## 十、一句话总结

**Phase 1 = 最小化改造 + 快速验证 + 低成本试错**

**核心思路**:
- 在现有 `strategies` 表增加几个字段
- 新建 `orders` 和 `tasks` 表
- 复用 Stripe 支付能力
- 1-2 周完成开发
- 上线 5-10 个试水商品
- 1 个月后复盘数据,决定是否进入 Phase 2

**如果成功**:你将拥有一个"玩法+工具+服务"综合交易平台
**如果失败**:也只花了 2 周时间,可以快速回滚

---

**下一步行动**:
1. 确认是否启动 Phase 1?
2. 如果启动,我可以帮你生成:
   - 数据库迁移 SQL 脚本
   - API 实现代码
   - 前端组件代码
   - Directus 配置指南

你想先做哪个?
