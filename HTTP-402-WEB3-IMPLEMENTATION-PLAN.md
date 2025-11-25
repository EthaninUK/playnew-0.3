# 🚀 HTTP 402 + Web3 支付实施方案

**版本**: v1.0
**创建时间**: 2025-11-19
**基于**: PLATFORM-ARCHITECTURE-ANALYSIS.md
**预计工期**: 20-25 天 (3-4 周)
**状态**: 📋 Ready to Implement

---

## 📋 目录

1. [架构概述](#架构概述)
2. [技术选型](#技术选型)
3. [数据库设计](#数据库设计)
4. [API 设计](#api-设计)
5. [Middleware 实现](#middleware-实现)
6. [前端组件设计](#前端组件设计)
7. [实施路线图](#实施路线图)
8. [测试方案](#测试方案)
9. [部署计划](#部署计划)

---

## 🏗️ 架构概述

### 系统定位
**HTTP 402 Payment Required + Web3 原生支付** - 为平台内容提供去中心化的付费访问机制

### 核心特性
- ✅ **标准 HTTP 协议**: 使用 HTTP 402 状态码
- ✅ **Web3 原生**: 仅支持加密货币支付,无 Stripe
- ✅ **链上验证**: 所有交易在链上验证,透明可追溯
- ✅ **永久访问**: 一次购买,永久访问
- ✅ **无中心化托管**: 资金直接到平台钱包
- ✅ **多链支持**: Ethereum, Polygon, Base

### 与现有系统关系

```
┌─────────────────────────────────────────────────────────────┐
│                      PlayNew.ai 平台                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [认证系统]                                                  │
│  Supabase Auth ──► user_profiles ──► Session Cookie       │
│                                                             │
│  [内容系统]                                                  │
│  Directus ──► strategies, news, arbitrage, gossip         │
│                                                             │
│  [访问控制] 🆕                                              │
│  ┌──────────────────────────────────────────────┐          │
│  │  Next.js Middleware (HTTP 402 拦截器)         │          │
│  │  ├─ 检查 Session                               │          │
│  │  ├─ 检查 content_id 是否付费内容               │          │
│  │  ├─ 查询 user_content_access 表                │          │
│  │  └─ 无权限 → 返回 402                          │          │
│  └──────────────────────────────────────────────┘          │
│                    ↓ (402 响应)                             │
│  [支付系统] 🆕                                              │
│  ┌──────────────────────────────────────────────┐          │
│  │  Web3PaymentDialog 组件                       │          │
│  │  ├─ RainbowKit 钱包连接                       │          │
│  │  ├─ wagmi 发送交易                            │          │
│  │  ├─ viem 验证交易                             │          │
│  │  └─ API 写入 web3_payments 表                 │          │
│  └──────────────────────────────────────────────┘          │
│                                                             │
│  [PlayPass 系统] (保留,并行运行)                             │
│  ├─ 日常任务赚取 PP                                         │
│  ├─ PP 解锁内容 (临时访问)                                  │
│  └─ Web3 支付赠送 PP 奖励                                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 支付流程图

```
┌────────────┐
│ 用户访问   │
│ 付费内容   │
└─────┬──────┘
      │
      ▼
┌────────────────────────────────────┐
│ Middleware 检查访问权限             │
│ - 已登录?                          │
│ - 已购买?                          │
│ - PlayPass 余额充足?                │
└─────┬──────────────────────────────┘
      │
      ├─────► [有权限] ──► 渲染完整内容
      │
      └─────► [无权限] ──► HTTP 402 Response
                           ↓
              ┌────────────────────────┐
              │ 前端拦截 402 响应       │
              │ 显示 Web3PaymentDialog  │
              └────────┬───────────────┘
                       │
                       ▼
              ┌────────────────────────┐
              │ Step 1: 连接钱包        │
              │ RainbowKit UI          │
              └────────┬───────────────┘
                       │
                       ▼
              ┌────────────────────────┐
              │ Step 2: 确认支付信息    │
              │ - 显示价格              │
              │ - 选择支付链            │
              │ - 选择支付代币          │
              └────────┬───────────────┘
                       │
                       ▼
              ┌────────────────────────┐
              │ Step 3: 发送交易        │
              │ wagmi useSendTransaction│
              └────────┬───────────────┘
                       │
                       ▼
              ┌────────────────────────┐
              │ Step 4: 等待确认        │
              │ wagmi useWaitForTransaction│
              └────────┬───────────────┘
                       │
                       ▼
              ┌────────────────────────┐
              │ Step 5: 验证交易        │
              │ API: /api/web3/verify   │
              │ - 读取链上交易数据      │
              │ - 验证金额/地址         │
              │ - 写入数据库            │
              │ - 生成访问令牌          │
              └────────┬───────────────┘
                       │
                       ▼
              ┌────────────────────────┐
              │ Step 6: 授权访问        │
              │ - 写入 user_content_access│
              │ - 存储 access_token     │
              │ - 刷新页面              │
              └────────┬───────────────┘
                       │
                       ▼
              ┌────────────────────────┐
              │ 显示完整内容            │
              └────────────────────────┘
```

---

## 🛠️ 技术选型

### 前端技术栈

#### Web3 库
```json
{
  "wagmi": "^2.x",           // React Hooks for Ethereum
  "viem": "^2.x",            // TypeScript Interface for Ethereum
  "@rainbow-me/rainbowkit": "^2.x",  // Wallet Connection UI
  "@tanstack/react-query": "^5.x"    // wagmi 依赖
}
```

#### UI 组件 (已有)
- shadcn/ui (Dialog, Button, Card, etc.)
- Framer Motion (动画)
- Tailwind CSS (样式)

### 后端技术栈

#### 链上交互
- **viem** (Server-side): 验证交易、读取链上数据
- **Public RPC**: 免费的 Ethereum/Polygon/Base RPC 节点
- **升级选项**: Alchemy/Infura (商业 RPC,更稳定)

#### 数据库
- **Supabase PostgreSQL**: 存储支付记录、访问权限
- **Directus PostgreSQL**: 内容管理 (不改动)

### 支持的区块链

| 链 | Chain ID | 原生代币 | RPC URL | 平台钱包地址 |
|----|----------|---------|---------|-------------|
| **Ethereum Mainnet** | 1 | ETH | https://eth.public-rpc.com | 待配置 |
| **Polygon** | 137 | MATIC | https://polygon-rpc.com | 待配置 |
| **Base** | 8453 | ETH | https://mainnet.base.org | 待配置 |

### 支持的支付代币

| 代币 | 链 | 合约地址 | 说明 |
|------|-----|---------|------|
| **ETH** | Ethereum | - | 原生代币 |
| **USDC** | Ethereum | 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48 | 稳定币推荐 |
| **USDT** | Ethereum | 0xdAC17F958D2ee523a2206206994597C13D831ec7 | 稳定币备选 |
| **MATIC** | Polygon | - | 原生代币 |
| **USDC** | Polygon | 0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174 | Polygon 稳定币 |
| **ETH** | Base | - | Base 原生代币 |
| **USDC** | Base | 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913 | Base 稳定币 |

---

## 🗄️ 数据库设计

### 新增表

#### 1. `web3_payments` (Web3 支付记录)

```sql
-- ============================================
-- Web3 支付记录表
-- ============================================
CREATE TABLE IF NOT EXISTS web3_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 用户信息
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user_address VARCHAR(42) NOT NULL, -- 用户钱包地址

  -- 内容信息
  content_id UUID NOT NULL,
  content_type VARCHAR(50) NOT NULL, -- 'strategy', 'arbitrage', 'news', 'gossip'

  -- 区块链信息
  chain_id INT NOT NULL, -- 1=Ethereum, 137=Polygon, 8453=Base
  chain_name VARCHAR(50) NOT NULL, -- 'ethereum', 'polygon', 'base'

  -- 交易信息
  tx_hash VARCHAR(66) NOT NULL UNIQUE, -- 交易哈希 (0x...)
  from_address VARCHAR(42) NOT NULL, -- 付款地址 (用户钱包)
  to_address VARCHAR(42) NOT NULL, -- 收款地址 (平台钱包)
  block_number BIGINT, -- 区块高度

  -- 代币信息
  token_address VARCHAR(42), -- 代币合约地址 (NULL=原生代币)
  token_symbol VARCHAR(20) NOT NULL, -- ETH, USDC, USDT, MATIC
  amount VARCHAR(78) NOT NULL, -- 支付金额 (wei/最小单位,字符串存储避免精度问题)
  amount_decimal DECIMAL(36,18), -- 支付金额 (小数形式,用于显示)
  amount_usd DECIMAL(10,2), -- USD 等值 (记录时的价格)

  -- 支付状态
  status VARCHAR(20) DEFAULT 'pending', -- pending, confirmed, failed, expired, refunded
  confirmations INT DEFAULT 0, -- 确认数
  error_message TEXT, -- 失败原因

  -- 访问凭证
  access_token VARCHAR(64) UNIQUE, -- 访问令牌 (成功后生成)
  access_granted_at TIMESTAMPTZ, -- 授权时间

  -- 时间戳
  created_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- 约束
  CONSTRAINT valid_chain_id CHECK (chain_id IN (1, 137, 8453)),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'confirmed', 'failed', 'expired', 'refunded'))
);

-- 索引
CREATE INDEX idx_web3_payments_user ON web3_payments(user_id);
CREATE INDEX idx_web3_payments_content ON web3_payments(content_id, content_type);
CREATE INDEX idx_web3_payments_tx ON web3_payments(tx_hash);
CREATE INDEX idx_web3_payments_token ON web3_payments(access_token);
CREATE INDEX idx_web3_payments_status ON web3_payments(status);
CREATE INDEX idx_web3_payments_chain ON web3_payments(chain_id);
CREATE INDEX idx_web3_payments_created ON web3_payments(created_at DESC);

-- 注释
COMMENT ON TABLE web3_payments IS 'Web3 支付记录表';
COMMENT ON COLUMN web3_payments.amount IS '支付金额(wei/最小单位),字符串存储避免精度问题';
COMMENT ON COLUMN web3_payments.token_address IS '代币合约地址,NULL表示原生代币(ETH/MATIC)';
COMMENT ON COLUMN web3_payments.access_token IS '访问令牌,用于验证用户已付费';

-- 触发器: 自动更新 updated_at
CREATE OR REPLACE FUNCTION update_web3_payments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_web3_payments_updated_at
  BEFORE UPDATE ON web3_payments
  FOR EACH ROW
  EXECUTE FUNCTION update_web3_payments_updated_at();
```

#### 2. 扩展 `user_content_access` 表

```sql
-- ============================================
-- 扩展 user_content_access 表以支持 Web3 支付
-- ============================================

-- 添加 Web3 支付相关字段
ALTER TABLE user_content_access ADD COLUMN IF NOT EXISTS
  payment_method VARCHAR(20) DEFAULT 'free'; -- 'free', 'playpass', 'web3', 'admin_grant'

ALTER TABLE user_content_access ADD COLUMN IF NOT EXISTS
  payment_id UUID REFERENCES web3_payments(id); -- 关联 Web3 支付记录

ALTER TABLE user_content_access ADD COLUMN IF NOT EXISTS
  access_token VARCHAR(64); -- 访问令牌

ALTER TABLE user_content_access ADD COLUMN IF NOT EXISTS
  expires_at TIMESTAMPTZ; -- 过期时间 (NULL=永久访问)

ALTER TABLE user_content_access ADD COLUMN IF NOT EXISTS
  purchased_at TIMESTAMPTZ; -- 购买时间

-- 添加索引
CREATE INDEX IF NOT EXISTS idx_user_content_access_method ON user_content_access(payment_method);
CREATE INDEX IF NOT EXISTS idx_user_content_access_token ON user_content_access(access_token);
CREATE INDEX IF NOT EXISTS idx_user_content_access_payment ON user_content_access(payment_id);

-- 注释
COMMENT ON COLUMN user_content_access.payment_method IS '访问方式: free=免费, playpass=PP解锁, web3=Web3支付, admin_grant=管理员赠送';
COMMENT ON COLUMN user_content_access.expires_at IS '访问过期时间,NULL表示永久访问';
```

#### 3. `web3_payment_config` (支付配置表,可选)

```sql
-- ============================================
-- Web3 支付配置表 (Directus 后台管理)
-- ============================================
CREATE TABLE IF NOT EXISTS web3_payment_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 内容类型定价
  content_type VARCHAR(50) NOT NULL, -- 'strategy', 'arbitrage', 'news', 'gossip'
  content_category VARCHAR(100), -- 具体分类 (可选)

  -- 价格配置 (多币种)
  price_usd DECIMAL(10,2) NOT NULL, -- USD 基准价格
  price_eth VARCHAR(78), -- ETH 价格 (wei)
  price_usdc VARCHAR(78), -- USDC 价格 (6 decimals)
  price_matic VARCHAR(78), -- MATIC 价格 (wei)

  -- 平台钱包地址 (按链分别配置)
  ethereum_wallet VARCHAR(42), -- Ethereum 平台钱包
  polygon_wallet VARCHAR(42), -- Polygon 平台钱包
  base_wallet VARCHAR(42), -- Base 平台钱包

  -- 状态
  is_active BOOLEAN DEFAULT TRUE,
  priority INT DEFAULT 0, -- 优先级 (数字越大优先级越高)

  -- 时间戳
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- 约束
  CONSTRAINT valid_content_type CHECK (content_type IN ('strategy', 'arbitrage', 'news', 'gossip', 'global')),
  CONSTRAINT positive_price CHECK (price_usd > 0)
);

-- 索引
CREATE INDEX idx_web3_config_type ON web3_payment_config(content_type);
CREATE INDEX idx_web3_config_active ON web3_payment_config(is_active);
CREATE INDEX idx_web3_config_priority ON web3_payment_config(priority DESC);

-- 注释
COMMENT ON TABLE web3_payment_config IS 'Web3 支付配置表,管理员可在 Directus 后台修改';
COMMENT ON COLUMN web3_payment_config.content_type IS '内容类型,global表示全局默认配置';
COMMENT ON COLUMN web3_payment_config.price_usd IS 'USD 基准价格,前端实时转换为加密货币价格';
```

---

## 🔌 API 设计

### API 路由结构

```
/api/web3/
├── payment-info/           # GET - 获取支付信息 (价格、钱包地址等)
├── verify-transaction/     # POST - 验证交易并授权访问
├── check-status/           # GET - 检查支付状态
└── pricing/                # GET - 获取定价配置 (可选)
```

---

### 1. `/api/web3/payment-info`

#### 功能
获取内容的支付信息,包括价格、支持的链、平台钱包地址等。

#### 请求
```http
GET /api/web3/payment-info?content_id={uuid}&content_type={type}
```

#### 响应
```typescript
{
  success: true,
  data: {
    content_id: "uuid",
    content_type: "strategy",
    content_title: "Uniswap V3 Concentrated Liquidity",

    // 定价信息
    pricing: {
      usd: 10.00, // USD 基准价格
      eth: "0.003", // ETH 价格 (小数形式)
      eth_wei: "3000000000000000", // ETH 价格 (wei)
      usdc: "10.000000", // USDC 价格 (6 decimals)
      matic: "5.0", // MATIC 价格
    },

    // 支持的链
    supported_chains: [
      {
        chain_id: 1,
        chain_name: "ethereum",
        platform_wallet: "0x...", // 平台钱包地址
        supported_tokens: [
          {
            symbol: "ETH",
            address: null, // 原生代币
            decimals: 18,
            price: "0.003",
            price_wei: "3000000000000000"
          },
          {
            symbol: "USDC",
            address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
            decimals: 6,
            price: "10.000000"
          }
        ]
      },
      {
        chain_id: 137,
        chain_name: "polygon",
        platform_wallet: "0x...",
        supported_tokens: [
          { symbol: "MATIC", address: null, decimals: 18, price: "5.0" },
          { symbol: "USDC", address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", decimals: 6, price: "10.000000" }
        ]
      },
      {
        chain_id: 8453,
        chain_name: "base",
        platform_wallet: "0x...",
        supported_tokens: [
          { symbol: "ETH", address: null, decimals: 18, price: "0.003" },
          { symbol: "USDC", address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", decimals: 6, price: "10.000000" }
        ]
      }
    ],

    // 用户信息
    user: {
      has_access: false,
      wallet_address: "0x...", // 如果已连接钱包
    }
  }
}
```

#### 实现代码
```typescript
// /frontend/app/api/web3/payment-info/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const content_id = searchParams.get('content_id');
  const content_type = searchParams.get('content_type');

  if (!content_id || !content_type) {
    return NextResponse.json(
      { success: false, error: '缺少必要参数' },
      { status: 400 }
    );
  }

  const supabase = createServerSupabaseClient();

  // 1. 获取内容信息
  const { data: content } = await supabase
    .from(content_type === 'strategy' ? 'strategies' : content_type)
    .select('id, title')
    .eq('id', content_id)
    .single();

  if (!content) {
    return NextResponse.json(
      { success: false, error: '内容不存在' },
      { status: 404 }
    );
  }

  // 2. 获取定价配置 (从数据库或环境变量)
  const pricing = await getPricing(content_type);

  // 3. 获取平台钱包地址
  const wallets = {
    ethereum: process.env.PLATFORM_WALLET_ETHEREUM!,
    polygon: process.env.PLATFORM_WALLET_POLYGON!,
    base: process.env.PLATFORM_WALLET_BASE!,
  };

  // 4. 构建响应
  return NextResponse.json({
    success: true,
    data: {
      content_id,
      content_type,
      content_title: content.title,
      pricing,
      supported_chains: [
        {
          chain_id: 1,
          chain_name: 'ethereum',
          platform_wallet: wallets.ethereum,
          supported_tokens: [
            {
              symbol: 'ETH',
              address: null,
              decimals: 18,
              price: pricing.eth,
              price_wei: pricing.eth_wei
            },
            {
              symbol: 'USDC',
              address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
              decimals: 6,
              price: pricing.usdc
            }
          ]
        },
        {
          chain_id: 137,
          chain_name: 'polygon',
          platform_wallet: wallets.polygon,
          supported_tokens: [
            { symbol: 'MATIC', address: null, decimals: 18, price: pricing.matic },
            { symbol: 'USDC', address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', decimals: 6, price: pricing.usdc }
          ]
        },
        {
          chain_id: 8453,
          chain_name: 'base',
          platform_wallet: wallets.base,
          supported_tokens: [
            { symbol: 'ETH', address: null, decimals: 18, price: pricing.eth },
            { symbol: 'USDC', address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', decimals: 6, price: pricing.usdc }
          ]
        }
      ]
    }
  });
}

// 辅助函数:获取定价
async function getPricing(content_type: string) {
  // TODO: 从数据库获取,或使用默认值
  return {
    usd: 10.00,
    eth: '0.003',
    eth_wei: '3000000000000000',
    usdc: '10.000000',
    matic: '5.0'
  };
}
```

---

### 2. `/api/web3/verify-transaction`

#### 功能
验证用户提交的交易,确认支付成功后授予内容访问权限。

#### 请求
```http
POST /api/web3/verify-transaction
Content-Type: application/json

{
  "tx_hash": "0x...",         // 交易哈希
  "chain_id": 1,              // 链 ID
  "content_id": "uuid",       // 内容 ID
  "content_type": "strategy"  // 内容类型
}
```

#### 响应 (成功)
```typescript
{
  success: true,
  data: {
    payment_id: "uuid",           // web3_payments 记录 ID
    access_token: "abc123...",    // 访问令牌
    access_granted: true,
    message: "支付验证成功,访问权限已授予"
  }
}
```

#### 响应 (失败)
```typescript
{
  success: false,
  error: "交易验证失败: 金额不足",
  details: {
    expected_amount: "3000000000000000",
    actual_amount: "2000000000000000"
  }
}
```

#### 实现代码
```typescript
// /frontend/app/api/web3/verify-transaction/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { createPublicClient, http, parseAbi } from 'viem';
import { mainnet, polygon, base } from 'viem/chains';

export async function POST(request: NextRequest) {
  try {
    const { tx_hash, chain_id, content_id, content_type } = await request.json();

    // 1. 验证参数
    if (!tx_hash || !chain_id || !content_id || !content_type) {
      return NextResponse.json(
        { success: false, error: '缺少必要参数' },
        { status: 400 }
      );
    }

    // 2. 获取用户信息
    const supabase = createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: '未登录' },
        { status: 401 }
      );
    }

    // 3. 检查交易是否已处理
    const { data: existingPayment } = await supabase
      .from('web3_payments')
      .select('*')
      .eq('tx_hash', tx_hash)
      .single();

    if (existingPayment) {
      if (existingPayment.status === 'confirmed') {
        return NextResponse.json({
          success: true,
          data: {
            payment_id: existingPayment.id,
            access_token: existingPayment.access_token,
            access_granted: true,
            message: '该交易已处理'
          }
        });
      } else {
        return NextResponse.json(
          { success: false, error: '该交易处理失败或已过期' },
          { status: 400 }
        );
      }
    }

    // 4. 获取链配置
    const chainConfig = getChainConfig(chain_id);
    if (!chainConfig) {
      return NextResponse.json(
        { success: false, error: '不支持的链' },
        { status: 400 }
      );
    }

    // 5. 创建 viem 客户端
    const publicClient = createPublicClient({
      chain: chainConfig.chain,
      transport: http(chainConfig.rpc)
    });

    // 6. 读取链上交易
    const transaction = await publicClient.getTransaction({
      hash: tx_hash as `0x${string}`
    });

    if (!transaction) {
      return NextResponse.json(
        { success: false, error: '交易不存在' },
        { status: 404 }
      );
    }

    // 7. 获取交易收据
    const receipt = await publicClient.getTransactionReceipt({
      hash: tx_hash as `0x${string}`
    });

    if (receipt.status !== 'success') {
      return NextResponse.json(
        { success: false, error: '交易失败' },
        { status: 400 }
      );
    }

    // 8. 验证交易
    const validationResult = await validateTransaction(
      transaction,
      receipt,
      chain_id,
      content_type
    );

    if (!validationResult.valid) {
      return NextResponse.json(
        { success: false, error: validationResult.error },
        { status: 400 }
      );
    }

    // 9. 生成访问令牌
    const access_token = generateAccessToken();

    // 10. 写入 web3_payments 表
    const { data: payment, error: paymentError } = await supabase
      .from('web3_payments')
      .insert({
        user_id: user.id,
        user_address: transaction.from,
        content_id,
        content_type,
        chain_id,
        chain_name: chainConfig.name,
        tx_hash,
        from_address: transaction.from,
        to_address: transaction.to!,
        block_number: Number(receipt.blockNumber),
        token_address: validationResult.token_address,
        token_symbol: validationResult.token_symbol,
        amount: validationResult.amount,
        amount_decimal: validationResult.amount_decimal,
        amount_usd: validationResult.amount_usd,
        status: 'confirmed',
        confirmations: await getConfirmations(publicClient, receipt.blockNumber),
        access_token,
        access_granted_at: new Date().toISOString(),
        confirmed_at: new Date().toISOString()
      })
      .select()
      .single();

    if (paymentError) {
      console.error('写入支付记录失败:', paymentError);
      return NextResponse.json(
        { success: false, error: '服务器错误' },
        { status: 500 }
      );
    }

    // 11. 写入 user_content_access 表
    await supabase
      .from('user_content_access')
      .upsert({
        user_id: user.id,
        content_id,
        content_type,
        access_type: 'purchased',
        payment_method: 'web3',
        payment_id: payment.id,
        access_token,
        expires_at: null, // 永久访问
        purchased_at: new Date().toISOString(),
        first_accessed_at: new Date().toISOString(),
        last_accessed_at: new Date().toISOString()
      });

    // 12. 可选:奖励 PlayPass 积分
    await awardPlayPassBonus(user.id, validationResult.amount_usd);

    // 13. 返回成功
    return NextResponse.json({
      success: true,
      data: {
        payment_id: payment.id,
        access_token,
        access_granted: true,
        message: '支付验证成功,访问权限已授予'
      }
    });

  } catch (error: any) {
    console.error('验证交易失败:', error);
    return NextResponse.json(
      { success: false, error: '服务器错误', details: error.message },
      { status: 500 }
    );
  }
}

// 辅助函数:获取链配置
function getChainConfig(chain_id: number) {
  const configs = {
    1: { chain: mainnet, name: 'ethereum', rpc: 'https://eth.public-rpc.com' },
    137: { chain: polygon, name: 'polygon', rpc: 'https://polygon-rpc.com' },
    8453: { chain: base, name: 'base', rpc: 'https://mainnet.base.org' }
  };
  return configs[chain_id as keyof typeof configs];
}

// 辅助函数:验证交易
async function validateTransaction(
  transaction: any,
  receipt: any,
  chain_id: number,
  content_type: string
) {
  // TODO: 实现验证逻辑
  // - 检查接收地址是否为平台钱包
  // - 检查金额是否符合要求
  // - 检查代币类型
  return {
    valid: true,
    token_address: null,
    token_symbol: 'ETH',
    amount: transaction.value.toString(),
    amount_decimal: '0.003',
    amount_usd: 10.00
  };
}

// 辅助函数:获取确认数
async function getConfirmations(client: any, blockNumber: bigint) {
  const latestBlock = await client.getBlockNumber();
  return Number(latestBlock - blockNumber);
}

// 辅助函数:生成访问令牌
function generateAccessToken() {
  return Array.from({ length: 32 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
}

// 辅助函数:奖励 PlayPass 积分
async function awardPlayPassBonus(user_id: string, amount_usd: number) {
  // TODO: 根据支付金额奖励 PP
  // 例如: 每 $1 = 10 PP
  const pp_bonus = Math.floor(amount_usd * 10);

  await fetch('/api/playpass/earn', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id,
      amount: pp_bonus,
      source: 'web3_payment_bonus',
      description: `Web3 支付奖励 (${amount_usd} USD)`
    })
  });
}
```

---

### 3. `/api/web3/check-status`

#### 功能
检查用户对特定内容的访问状态。

#### 请求
```http
GET /api/web3/check-status?content_id={uuid}&content_type={type}
```

#### 响应
```typescript
{
  success: true,
  data: {
    has_access: true,
    access_method: "web3", // 'free', 'playpass', 'web3', 'admin_grant'
    payment_id: "uuid",
    purchased_at: "2025-11-19T10:00:00Z",
    expires_at: null, // null = 永久访问
    payment_details: {
      tx_hash: "0x...",
      chain_name: "ethereum",
      amount: "0.003 ETH",
      amount_usd: 10.00
    }
  }
}
```

---

## 🔐 Middleware 实现

### 扩展 Next.js Middleware

#### 当前 Middleware
```typescript
// /frontend/middleware.ts
export async function middleware(request: NextRequest) {
  return await updateSession(request);
}
```

#### 扩展后的 Middleware
```typescript
// /frontend/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { checkContentAccess } from '@/lib/web3/access-control';

export async function middleware(request: NextRequest) {
  // 1. 更新 Supabase session
  const response = await updateSession(request);

  // 2. 检查是否为受保护的内容路径
  const protectedPaths = [
    '/strategies/',
    '/arbitrage/types/',
    '/news/',
    '/gossip/'
  ];

  const isProtectedPath = protectedPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (!isProtectedPath) {
    return response;
  }

  // 3. 提取内容 ID 和类型
  const contentInfo = extractContentInfo(request.nextUrl.pathname);
  if (!contentInfo) {
    return response; // 无法提取,放行 (可能是列表页)
  }

  // 4. 检查访问权限
  const accessResult = await checkContentAccess(
    request,
    contentInfo.content_id,
    contentInfo.content_type
  );

  // 5. 如果没有访问权限,返回 402
  if (!accessResult.has_access) {
    return new NextResponse(
      JSON.stringify({
        error: 'Payment Required',
        message: '此内容需要付费访问',
        content_id: contentInfo.content_id,
        content_type: contentInfo.content_type,
        pricing: accessResult.pricing
      }),
      {
        status: 402,
        headers: {
          'Content-Type': 'application/json',
          'X-Payment-Required': 'true',
          'X-Content-Id': contentInfo.content_id,
          'X-Content-Type': contentInfo.content_type,
          'X-Content-Price-USD': accessResult.pricing?.usd.toString() || '0'
        }
      }
    );
  }

  // 6. 有访问权限,继续
  return response;
}

// 辅助函数:提取内容信息
function extractContentInfo(pathname: string): { content_id: string; content_type: string } | null {
  // /strategies/[slug] -> { content_id: slug, content_type: 'strategy' }
  const strategyMatch = pathname.match(/^\/strategies\/([^\/]+)$/);
  if (strategyMatch) {
    return { content_id: strategyMatch[1], content_type: 'strategy' };
  }

  // /arbitrage/types/[slug] -> { content_id: slug, content_type: 'arbitrage' }
  const arbitrageMatch = pathname.match(/^\/arbitrage\/types\/([^\/]+)$/);
  if (arbitrageMatch) {
    return { content_id: arbitrageMatch[1], content_type: 'arbitrage' };
  }

  // /news/[slug] -> { content_id: slug, content_type: 'news' }
  const newsMatch = pathname.match(/^\/news\/([^\/]+)$/);
  if (newsMatch) {
    return { content_id: newsMatch[1], content_type: 'news' };
  }

  // /gossip/[slug] -> { content_id: slug, content_type: 'gossip' }
  const gossipMatch = pathname.match(/^\/gossip\/([^\/]+)$/);
  if (gossipMatch) {
    return { content_id: gossipMatch[1], content_type: 'gossip' };
  }

  return null;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
```

#### 访问控制逻辑
```typescript
// /frontend/lib/web3/access-control.ts
import { NextRequest } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function checkContentAccess(
  request: NextRequest,
  content_id: string,
  content_type: string
) {
  const supabase = createServerSupabaseClient();

  // 1. 获取用户信息
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    // 未登录,返回无权限
    return {
      has_access: false,
      reason: 'not_logged_in',
      pricing: await getPricing(content_type)
    };
  }

  // 2. 检查是否为免费内容
  const isFree = await isContentFree(supabase, content_id, content_type);
  if (isFree) {
    return { has_access: true, reason: 'free_content' };
  }

  // 3. 检查是否已购买 (Web3 或 PlayPass)
  const { data: access } = await supabase
    .from('user_content_access')
    .select('*')
    .eq('user_id', user.id)
    .eq('content_id', content_id)
    .eq('content_type', content_type)
    .single();

  if (access) {
    // 检查是否过期
    if (!access.expires_at || new Date(access.expires_at) > new Date()) {
      return { has_access: true, reason: 'purchased', method: access.payment_method };
    }
  }

  // 4. 检查是否为 MAX 会员
  const { data: profile } = await supabase
    .from('user_playpass')
    .select('is_max_member')
    .eq('user_id', user.id)
    .single();

  if (profile?.is_max_member) {
    return { has_access: true, reason: 'max_member' };
  }

  // 5. 无访问权限
  return {
    has_access: false,
    reason: 'payment_required',
    pricing: await getPricing(content_type)
  };
}

async function isContentFree(supabase: any, content_id: string, content_type: string) {
  // TODO: 检查内容是否免费
  // 例如:查询 strategies 表的 credits_price 字段
  return false;
}

async function getPricing(content_type: string) {
  // TODO: 从数据库或配置获取定价
  return {
    usd: 10.00,
    eth: '0.003',
    usdc: '10.000000'
  };
}
```

---

## 🎨 前端组件设计

### 1. Web3PaymentDialog 组件

#### 组件路径
```
/frontend/components/web3/Web3PaymentDialog.tsx
```

#### 组件代码
```typescript
'use client';

import { useState, useEffect } from 'react';
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, CheckCircle2, XCircle, Wallet } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

interface Web3PaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  contentId: string;
  contentType: string;
  contentTitle: string;
}

export function Web3PaymentDialog({
  isOpen,
  onClose,
  onSuccess,
  contentId,
  contentType,
  contentTitle
}: Web3PaymentDialogProps) {
  const { address, isConnected, chain } = useAccount();
  const [step, setStep] = useState<'connect' | 'select' | 'send' | 'verify' | 'success' | 'error'>('connect');
  const [paymentInfo, setPaymentInfo] = useState<any>(null);
  const [selectedToken, setSelectedToken] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const { sendTransaction, data: txData, isPending: isSendPending } = useSendTransaction();
  const { isLoading: isTxPending, isSuccess: isTxSuccess } = useWaitForTransactionReceipt({
    hash: txData,
  });

  // 1. 加载支付信息
  useEffect(() => {
    if (isOpen && isConnected) {
      fetchPaymentInfo();
    }
  }, [isOpen, isConnected]);

  // 2. 监听钱包连接
  useEffect(() => {
    if (isConnected && step === 'connect') {
      setStep('select');
    }
  }, [isConnected]);

  // 3. 监听交易成功
  useEffect(() => {
    if (isTxSuccess && txData) {
      handleVerifyPayment();
    }
  }, [isTxSuccess, txData]);

  const fetchPaymentInfo = async () => {
    try {
      const res = await fetch(`/api/web3/payment-info?content_id=${contentId}&content_type=${contentType}`);
      const data = await res.json();
      if (data.success) {
        setPaymentInfo(data.data);
        // 默认选择当前链的第一个代币
        const currentChainInfo = data.data.supported_chains.find((c: any) => c.chain_id === chain?.id);
        if (currentChainInfo) {
          setSelectedToken(currentChainInfo.supported_tokens[0]);
        }
      }
    } catch (err) {
      console.error('获取支付信息失败:', err);
      setError('无法加载支付信息');
    }
  };

  const handleSendPayment = async () => {
    if (!selectedToken || !paymentInfo) return;

    setStep('send');

    try {
      const chainInfo = paymentInfo.supported_chains.find((c: any) => c.chain_id === chain?.id);
      if (!chainInfo) {
        setError('当前链不支持支付');
        setStep('error');
        return;
      }

      sendTransaction({
        to: chainInfo.platform_wallet as `0x${string}`,
        value: parseEther(selectedToken.price)
      });
    } catch (err: any) {
      console.error('发送交易失败:', err);
      setError(err.message || '交易失败');
      setStep('error');
    }
  };

  const handleVerifyPayment = async () => {
    setStep('verify');

    try {
      const res = await fetch('/api/web3/verify-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tx_hash: txData,
          chain_id: chain?.id,
          content_id: contentId,
          content_type: contentType
        })
      });

      const data = await res.json();

      if (data.success) {
        setStep('success');
        setTimeout(() => {
          onSuccess();
          onClose();
          window.location.reload(); // 刷新页面显示内容
        }, 2000);
      } else {
        setError(data.error || '验证失败');
        setStep('error');
      }
    } catch (err: any) {
      console.error('验证支付失败:', err);
      setError('验证失败');
      setStep('error');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>解锁内容</DialogTitle>
          <DialogDescription>{contentTitle}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Step 1: 连接钱包 */}
          {step === 'connect' && (
            <div className="flex flex-col items-center gap-4 py-8">
              <Wallet className="h-12 w-12 text-purple-500" />
              <p className="text-center text-muted-foreground">
                请先连接您的 Web3 钱包
              </p>
              <ConnectButton />
            </div>
          )}

          {/* Step 2: 选择支付方式 */}
          {step === 'select' && paymentInfo && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">选择支付代币</h3>
                <div className="grid grid-cols-2 gap-2">
                  {paymentInfo.supported_chains
                    .find((c: any) => c.chain_id === chain?.id)
                    ?.supported_tokens.map((token: any) => (
                      <Card
                        key={token.symbol}
                        className={`p-4 cursor-pointer hover:border-purple-500 transition-colors ${
                          selectedToken?.symbol === token.symbol ? 'border-purple-500 bg-purple-50' : ''
                        }`}
                        onClick={() => setSelectedToken(token)}
                      >
                        <div className="font-semibold">{token.symbol}</div>
                        <div className="text-sm text-muted-foreground">{token.price}</div>
                      </Card>
                    ))}
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <div className="flex justify-between text-sm mb-2">
                  <span>价格 (USD)</span>
                  <span className="font-semibold">${paymentInfo.pricing.usd}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>支付金额</span>
                  <span className="font-semibold">
                    {selectedToken?.price} {selectedToken?.symbol}
                  </span>
                </div>
              </div>

              <Button
                onClick={handleSendPayment}
                disabled={!selectedToken}
                className="w-full"
              >
                确认支付
              </Button>
            </div>
          )}

          {/* Step 3: 发送交易中 */}
          {step === 'send' && (
            <div className="flex flex-col items-center gap-4 py-8">
              <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
              <p className="text-center">请在钱包中确认交易...</p>
            </div>
          )}

          {/* Step 4: 验证交易中 */}
          {(step === 'verify' || isTxPending) && (
            <div className="flex flex-col items-center gap-4 py-8">
              <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
              <p className="text-center">验证交易中,请稍候...</p>
              {txData && (
                <p className="text-xs text-muted-foreground">
                  交易哈希: {txData.slice(0, 10)}...{txData.slice(-8)}
                </p>
              )}
            </div>
          )}

          {/* Step 5: 支付成功 */}
          {step === 'success' && (
            <div className="flex flex-col items-center gap-4 py-8">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
              <p className="text-center font-semibold">支付成功!</p>
              <p className="text-center text-sm text-muted-foreground">
                正在刷新页面...
              </p>
            </div>
          )}

          {/* Step 6: 错误 */}
          {step === 'error' && (
            <div className="flex flex-col items-center gap-4 py-8">
              <XCircle className="h-12 w-12 text-red-500" />
              <p className="text-center font-semibold">支付失败</p>
              <p className="text-center text-sm text-muted-foreground">{error}</p>
              <Button onClick={() => setStep('select')} variant="outline">
                重试
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

---

### 2. 集成到内容详情页

#### 修改策略详情页
```typescript
// /frontend/app/strategies/[slug]/StrategyDetailClient.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Web3PaymentDialog } from '@/components/web3/Web3PaymentDialog';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export function StrategyDetailClient({ strategy }: { strategy: any }) {
  const { user } = useAuth();
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  useEffect(() => {
    if (user) {
      checkAccess();
    } else {
      setLoading(false);
    }
  }, [user]);

  const checkAccess = async () => {
    try {
      const res = await fetch(`/api/web3/check-status?content_id=${strategy.id}&content_type=strategy`);
      const data = await res.json();
      setHasAccess(data.data?.has_access || false);
    } catch (err) {
      console.error('检查访问权限失败:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>加载中...</div>;
  }

  // 如果有访问权限,显示完整内容
  if (hasAccess) {
    return (
      <div className="prose max-w-none">
        <h1>{strategy.title}</h1>
        <ReactMarkdown>{strategy.content}</ReactMarkdown>
      </div>
    );
  }

  // 如果没有访问权限,显示预览和解锁按钮
  return (
    <div className="space-y-6">
      {/* 预览内容 */}
      <div className="prose max-w-none">
        <h1>{strategy.title}</h1>
        <ReactMarkdown>{strategy.summary}</ReactMarkdown>
      </div>

      {/* 模糊遮罩 */}
      <div className="relative">
        <div className="prose max-w-none blur-sm select-none pointer-events-none">
          <ReactMarkdown>{strategy.content.slice(0, 500)}</ReactMarkdown>
        </div>

        {/* 解锁按钮 */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-background via-background/80 to-transparent">
          <div className="text-center space-y-4">
            <Lock className="h-12 w-12 mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">此内容需要付费解锁</p>
            <Button onClick={() => setShowPaymentDialog(true)} size="lg">
              解锁完整内容
            </Button>
          </div>
        </div>
      </div>

      {/* Web3 支付弹窗 */}
      <Web3PaymentDialog
        isOpen={showPaymentDialog}
        onClose={() => setShowPaymentDialog(false)}
        onSuccess={() => setHasAccess(true)}
        contentId={strategy.id}
        contentType="strategy"
        contentTitle={strategy.title}
      />
    </div>
  );
}
```

---

## 📅 实施路线图

### Phase 1: 基础设施 (5-6 天)

#### 第 1-2 天: 数据库迁移
- [ ] 创建 `web3_payments` 表
- [ ] 扩展 `user_content_access` 表
- [ ] 创建 `web3_payment_config` 表 (可选)
- [ ] 编写数据迁移脚本
- [ ] 在测试环境执行迁移
- [ ] 验证表结构和索引

#### 第 3-4 天: 环境配置
- [ ] 生成平台钱包地址 (Ethereum, Polygon, Base)
- [ ] 配置环境变量 (.env.local)
  - `PLATFORM_WALLET_ETHEREUM`
  - `PLATFORM_WALLET_POLYGON`
  - `PLATFORM_WALLET_BASE`
- [ ] 配置 RPC 节点 (Public RPC 或 Alchemy)
- [ ] 安装 Web3 依赖包
  ```bash
  npm install wagmi viem @rainbow-me/rainbowkit @tanstack/react-query
  ```
- [ ] 配置 wagmi 和 RainbowKit

#### 第 5-6 天: API 开发 (核心)
- [ ] 实现 `/api/web3/payment-info` (获取支付信息)
- [ ] 实现 `/api/web3/verify-transaction` (验证交易)
- [ ] 实现 `/api/web3/check-status` (检查访问状态)
- [ ] 编写单元测试
- [ ] 使用 Postman 测试 API

---

### Phase 2: Middleware 集成 (3-4 天)

#### 第 7-8 天: 访问控制逻辑
- [ ] 创建 `/lib/web3/access-control.ts`
- [ ] 实现 `checkContentAccess` 函数
- [ ] 实现 `isContentFree` 函数
- [ ] 实现 `getPricing` 函数
- [ ] 编写单元测试

#### 第 9-10 天: Middleware 扩展
- [ ] 扩展 `/frontend/middleware.ts`
- [ ] 添加路径匹配逻辑 (`extractContentInfo`)
- [ ] 添加 402 响应逻辑
- [ ] 测试 Middleware 拦截功能
- [ ] 测试响应头

---

### Phase 3: 前端开发 (6-8 天)

#### 第 11-12 天: Web3 基础配置
- [ ] 创建 `/lib/web3/config.ts` (wagmi 配置)
- [ ] 在 `app/layout.tsx` 中添加 WagmiProvider
- [ ] 在 `app/layout.tsx` 中添加 RainbowKitProvider
- [ ] 测试钱包连接功能

#### 第 13-15 天: Web3PaymentDialog 组件
- [ ] 创建 `Web3PaymentDialog` 组件
- [ ] 实现 Step 1: 连接钱包
- [ ] 实现 Step 2: 选择支付代币
- [ ] 实现 Step 3: 发送交易
- [ ] 实现 Step 4: 验证交易
- [ ] 实现 Step 5: 支付成功
- [ ] 实现 Step 6: 错误处理
- [ ] 优化 UI/UX

#### 第 16-18 天: 集成到内容详情页
- [ ] 修改 `StrategyDetailClient` 组件
- [ ] 修改 `ArbitrageDetailClient` 组件
- [ ] 修改 `NewsDetailClient` 组件 (可选)
- [ ] 修改 `GossipDetailClient` 组件 (可选)
- [ ] 添加预览模糊效果
- [ ] 添加解锁按钮
- [ ] 测试整个支付流程

---

### Phase 4: 测试与优化 (4-5 天)

#### 第 19-20 天: 功能测试
- [ ] 端到端测试 (E2E)
- [ ] 测试 Ethereum 主网支付
- [ ] 测试 Polygon 支付
- [ ] 测试 Base 支付
- [ ] 测试不同代币 (ETH, USDC, USDT, MATIC)
- [ ] 测试错误场景
  - 交易失败
  - 金额不足
  - 网络错误
  - 钱包拒绝

#### 第 21-22 天: 性能优化
- [ ] 优化 Middleware 性能 (缓存访问权限)
- [ ] 优化链上查询 (RPC 请求优化)
- [ ] 添加加载状态
- [ ] 添加错误重试机制
- [ ] 优化前端组件渲染

#### 第 23 天: 安全审计
- [ ] 代码审计 (防止 SQL 注入、XSS 等)
- [ ] 交易验证逻辑审计
- [ ] 访问控制审计
- [ ] 环境变量安全检查

---

### Phase 5: 部署上线 (2-3 天)

#### 第 24 天: 准备上线
- [ ] 编写部署文档
- [ ] 配置生产环境变量
- [ ] 执行生产数据库迁移
- [ ] 配置 RPC 节点 (Alchemy/Infura)
- [ ] 测试生产环境 API

#### 第 25 天: 正式上线
- [ ] 灰度发布 (10% 用户)
- [ ] 监控错误日志
- [ ] 监控支付成功率
- [ ] 收集用户反馈
- [ ] 100% 发布

---

## 🧪 测试方案

### 单元测试

#### API 路由测试
```typescript
// __tests__/api/web3/payment-info.test.ts
describe('/api/web3/payment-info', () => {
  it('应该返回支付信息', async () => {
    const res = await fetch('/api/web3/payment-info?content_id=123&content_type=strategy');
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.data.pricing).toBeDefined();
  });

  it('应该在缺少参数时返回 400', async () => {
    const res = await fetch('/api/web3/payment-info');
    expect(res.status).toBe(400);
  });
});
```

#### 访问控制测试
```typescript
// __tests__/lib/web3/access-control.test.ts
describe('checkContentAccess', () => {
  it('应该为已付费用户返回 has_access=true', async () => {
    const result = await checkContentAccess(mockRequest, 'content-123', 'strategy');
    expect(result.has_access).toBe(true);
  });

  it('应该为未付费用户返回 has_access=false', async () => {
    const result = await checkContentAccess(mockRequest, 'content-123', 'strategy');
    expect(result.has_access).toBe(false);
  });
});
```

---

### 集成测试

#### Middleware 测试
```typescript
// __tests__/middleware.test.ts
describe('Middleware 402 Interceptor', () => {
  it('应该拦截未付费的策略页面', async () => {
    const req = new NextRequest(new URL('http://localhost:3000/strategies/test-slug'));
    const res = await middleware(req);
    expect(res.status).toBe(402);
  });

  it('应该放行已付费的策略页面', async () => {
    // Mock 用户已付费
    const res = await middleware(mockRequestWithAccess);
    expect(res.status).not.toBe(402);
  });
});
```

---

### E2E 测试 (Playwright)

```typescript
// e2e/web3-payment.spec.ts
import { test, expect } from '@playwright/test';

test('完整支付流程', async ({ page }) => {
  // 1. 访问策略详情页
  await page.goto('/strategies/test-strategy');

  // 2. 点击解锁按钮
  await page.click('text=解锁完整内容');

  // 3. 连接钱包 (使用 MetaMask Test DApp)
  // ...

  // 4. 选择支付代币
  await page.click('text=USDC');

  // 5. 确认支付
  await page.click('text=确认支付');

  // 6. 等待交易确认
  await expect(page.locator('text=支付成功')).toBeVisible({ timeout: 60000 });

  // 7. 验证内容已解锁
  await expect(page.locator('.prose')).toBeVisible();
});
```

---

## 🚀 部署计划

### 环境变量配置

#### 生产环境 (.env.production)
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# 平台钱包地址
PLATFORM_WALLET_ETHEREUM=0x...
PLATFORM_WALLET_POLYGON=0x...
PLATFORM_WALLET_BASE=0x...

# RPC 节点 (Alchemy 推荐)
ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY
POLYGON_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/YOUR_KEY
BASE_RPC_URL=https://base-mainnet.g.alchemy.com/v2/YOUR_KEY

# WalletConnect Project ID
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=xxx
```

---

### 数据库迁移

#### 迁移脚本
```bash
# 1. 备份生产数据库
psql -h xxx.supabase.co -U postgres -d postgres -c "
  CREATE TABLE _backup_user_content_access AS SELECT * FROM user_content_access;
"

# 2. 执行迁移
psql -h xxx.supabase.co -U postgres -d postgres -f migrations/001_add_web3_payments.sql

# 3. 验证迁移
psql -h xxx.supabase.co -U postgres -d postgres -c "
  SELECT table_name FROM information_schema.tables WHERE table_name = 'web3_payments';
"
```

---

### 部署检查清单

- [ ] 数据库迁移已完成
- [ ] 环境变量已配置
- [ ] 平台钱包地址已生成并配置
- [ ] RPC 节点已配置 (Alchemy/Infura)
- [ ] WalletConnect Project ID 已配置
- [ ] 前端构建成功 (`npm run build`)
- [ ] API 路由测试通过
- [ ] Middleware 测试通过
- [ ] E2E 测试通过
- [ ] 监控告警已配置
- [ ] 回滚方案已准备

---

## 📊 监控与告警

### 关键指标

1. **支付成功率**: `(confirmed / total) * 100%`
2. **平均支付时间**: 从发送交易到确认的平均时间
3. **支付失败率**: `(failed / total) * 100%`
4. **402 拦截率**: Middleware 拦截的请求比例
5. **用户转化率**: 从 402 到完成支付的转化率

### 错误监控

- 交易验证失败
- RPC 节点错误
- 数据库写入失败
- Middleware 异常

---

## 🎯 成功标准

### 技术指标
- [ ] 支付成功率 > 95%
- [ ] 平均支付时间 < 3 分钟
- [ ] API 响应时间 < 500ms
- [ ] Middleware 响应时间 < 100ms
- [ ] 零安全漏洞

### 用户体验
- [ ] 支付流程 < 6 步
- [ ] UI 操作简单直观
- [ ] 错误提示清晰
- [ ] 支持主流钱包 (MetaMask, WalletConnect, Coinbase Wallet)

### 业务指标
- [ ] 首月至少 100 笔成功支付
- [ ] 用户满意度 > 4.5/5
- [ ] 付费转化率 > 10%

---

## 📝 总结

本实施方案基于对 PlayNew.ai 平台的深入分析,提供了完整的 HTTP 402 + Web3 支付集成方案。方案的核心优势:

1. ✅ **不破坏现有系统**: Stripe 已禁用,PlayPass 可并行运行
2. ✅ **标准化**: 使用 HTTP 402 标准协议
3. ✅ **Web3 原生**: 完全去中心化,无第三方支付托管
4. ✅ **多链支持**: Ethereum, Polygon, Base
5. ✅ **永久访问**: 一次购买,永久访问
6. ✅ **可扩展**: 易于添加新链和新代币

**下一步**: 等待用户确认后,开始 Phase 1 实施。

---

**文档版本**: v1.0
**创建时间**: 2025-11-19
**预计完成时间**: 2025-12-13 (25 天后)
