# HTTP 402 纯 Web3 支付方案

## 一、核心理解

### HTTP 402 的本质
```
HTTP 402 ≠ 支付系统
HTTP 402 = 协议标准（告诉客户端：这个资源需要付费）

┌─────────────────────────────────────────┐
│  HTTP 402 只做一件事：                   │
│  返回 402 状态码 + 支付信息              │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  你需要自己实现：                        │
│  1. 支付 UI（弹窗、表单等）              │
│  2. 钱包连接（Metamask、WalletConnect）  │
│  3. 交易发送和确认                       │
│  4. 支付验证逻辑                         │
└─────────────────────────────────────────┘
```

**为什么不需要 Stripe？**
- ✅ Web3 用户已经有加密钱包
- ✅ 直接链上支付，无中间商
- ✅ 更符合去中心化理念
- ✅ 降低支付手续费

---

## 二、纯 Web3 架构设计

### 2.1 完整流程图

```
用户访问付费内容
      ↓
Next.js Middleware 检测
      ↓
返回 402 状态码
      ↓
┌─────────────────────────────────────┐
│  自定义 UI 弹出（你的设计）         │
│  ┌─────────────────────────────┐   │
│  │  🦊 解锁高级内容             │   │
│  │                              │   │
│  │  价格: 0.001 ETH ($2.99)    │   │
│  │                              │   │
│  │  [连接钱包]  [确认支付]     │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
      ↓
用户确认交易
      ↓
发送链上交易
      ↓
等待确认（显示进度 UI）
      ↓
后端验证交易
      ↓
生成访问 Token
      ↓
刷新页面 → 显示内容
```

### 2.2 技术栈选择

```typescript
// 前端支付 UI
- React/Next.js          // 框架
- wagmi/viem             // Web3 hooks
- RainbowKit             // 钱包连接 UI（可选，也可自己做）
- framer-motion          // 动画效果

// 后端验证
- Next.js API Routes     // API
- ethers.js / viem       // 区块链交互
- Supabase               // 数据存储
```

---

## 三、自定义 UI 设计

### 3.1 支付弹窗组件（完全自定义）

```typescript
// components/Web3PaymentDialog.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';
import { motion, AnimatePresence } from 'framer-motion';

interface Web3PaymentDialogProps {
  contentId: string;
  priceUSD: number;
  priceETH: string;
  onSuccess: () => void;
}

export function Web3PaymentDialog({
  contentId,
  priceUSD,
  priceETH,
  onSuccess
}: Web3PaymentDialogProps) {
  const [step, setStep] = useState<'connect' | 'confirm' | 'pending' | 'success'>('connect');
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { sendTransaction, data: txHash } = useSendTransaction();

  // 连接钱包后自动进入确认步骤
  useEffect(() => {
    if (isConnected) {
      setStep('confirm');
    }
  }, [isConnected]);

  // 监听交易状态
  useEffect(() => {
    if (txHash) {
      setStep('pending');
      pollTransactionStatus(txHash);
    }
  }, [txHash]);

  async function handleConnect(connector: any) {
    try {
      await connect({ connector });
    } catch (error) {
      console.error('Connection failed:', error);
    }
  }

  async function handlePayment() {
    try {
      // 发送交易到你的收款地址
      await sendTransaction({
        to: process.env.NEXT_PUBLIC_PAYMENT_WALLET_ADDRESS as `0x${string}`,
        value: parseEther(priceETH),
        data: `0x${Buffer.from(contentId).toString('hex')}`, // 在 data 中记录 contentId
      });
    } catch (error) {
      console.error('Payment failed:', error);
    }
  }

  async function pollTransactionStatus(hash: string) {
    // 轮询交易状态
    const interval = setInterval(async () => {
      const response = await fetch('/api/payment/web3/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          txHash: hash,
          contentId: contentId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        clearInterval(interval);
        setStep('success');
        setTimeout(() => onSuccess(), 2000);
      }
    }, 3000); // 每3秒检查一次
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
        >
          {/* 步骤 1: 连接钱包 */}
          {step === 'connect' && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">连接钱包</h2>
                <p className="text-slate-600 dark:text-slate-400">
                  选择你的 Web3 钱包以继续
                </p>
              </div>

              <div className="space-y-3">
                {connectors.map((connector) => (
                  <button
                    key={connector.id}
                    onClick={() => handleConnect(connector)}
                    className="w-full flex items-center gap-4 p-4 border-2 border-slate-200 dark:border-slate-700 rounded-xl hover:border-purple-500 dark:hover:border-purple-500 transition-colors"
                  >
                    {/* 钱包图标 */}
                    <WalletIcon name={connector.name} />
                    <span className="font-semibold">{connector.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 步骤 2: 确认支付 */}
          {step === 'confirm' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  🔓
                </div>
                <h2 className="text-2xl font-bold mb-2">解锁高级内容</h2>
                <p className="text-slate-600 dark:text-slate-400">
                  确认支付以永久访问此内容
                </p>
              </div>

              {/* 价格显示 */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6">
                <div className="flex items-baseline justify-center gap-2 mb-2">
                  <span className="text-4xl font-bold text-purple-600">
                    {priceETH}
                  </span>
                  <span className="text-xl text-slate-600">ETH</span>
                </div>
                <div className="text-center text-sm text-slate-500">
                  ≈ ${priceUSD} USD
                </div>
              </div>

              {/* 连接的钱包信息 */}
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    支付钱包
                  </span>
                  <span className="font-mono text-sm">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </span>
                </div>
              </div>

              {/* 支付按钮 */}
              <button
                onClick={handlePayment}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
              >
                确认支付
              </button>

              <p className="text-xs text-center text-slate-500">
                交易将在区块链上处理，通常需要 1-2 分钟确认
              </p>
            </div>
          )}

          {/* 步骤 3: 等待确认 */}
          {step === 'pending' && (
            <div className="space-y-6 text-center">
              <div className="w-20 h-20 mx-auto">
                <LoadingSpinner />
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-2">处理中...</h2>
                <p className="text-slate-600 dark:text-slate-400">
                  等待区块链确认交易
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  💡 交易已发送，请勿关闭页面
                </p>
              </div>

              {txHash && (
                <a
                  href={`https://etherscan.io/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-purple-600 hover:underline"
                >
                  在 Etherscan 上查看 →
                </a>
              )}
            </div>
          )}

          {/* 步骤 4: 成功 */}
          {step === 'success' && (
            <div className="space-y-6 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto"
              >
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>

              <div>
                <h2 className="text-2xl font-bold mb-2">支付成功！</h2>
                <p className="text-slate-600 dark:text-slate-400">
                  正在解锁内容...
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// 钱包图标组件
function WalletIcon({ name }: { name: string }) {
  const icons: Record<string, string> = {
    'MetaMask': '🦊',
    'WalletConnect': '🔗',
    'Coinbase Wallet': '🔵',
  };

  return (
    <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-2xl">
      {icons[name] || '💼'}
    </div>
  );
}

// 加载动画组件
function LoadingSpinner() {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className="w-full h-full border-4 border-purple-200 dark:border-purple-800 border-t-purple-600 rounded-full"
    />
  );
}
```

### 3.2 wagmi 配置

```typescript
// lib/wagmi-config.ts
import { createConfig, http } from 'wagmi';
import { mainnet, polygon, base } from 'wagmi/chains';
import { metaMask, walletConnect, coinbaseWallet } from 'wagmi/connectors';

export const wagmiConfig = createConfig({
  chains: [mainnet, polygon, base],
  connectors: [
    metaMask(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    }),
    coinbaseWallet({
      appName: 'PlayNew.ai',
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [base.id]: http(),
  },
});
```

### 3.3 Provider 包装

```typescript
// app/layout.tsx
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiConfig } from '@/lib/wagmi-config';

const queryClient = new QueryClient();

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>
        <WagmiProvider config={wagmiConfig}>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}
```

---

## 四、后端实现

### 4.1 交易验证 API

```typescript
// app/api/payment/web3/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

export async function POST(request: NextRequest) {
  const { txHash, contentId } = await request.json();

  try {
    // 1. 获取交易详情
    const transaction = await publicClient.getTransaction({
      hash: txHash as `0x${string}`,
    });

    // 2. 获取交易收据（确认状态）
    const receipt = await publicClient.getTransactionReceipt({
      hash: txHash as `0x${string}`,
    });

    // 3. 验证交易
    if (receipt.status !== 'success') {
      return NextResponse.json(
        { success: false, error: 'Transaction failed' },
        { status: 400 }
      );
    }

    // 4. 验证收款地址
    if (transaction.to?.toLowerCase() !== process.env.PAYMENT_WALLET_ADDRESS?.toLowerCase()) {
      return NextResponse.json(
        { success: false, error: 'Invalid recipient' },
        { status: 400 }
      );
    }

    // 5. 验证金额（允许 5% 误差，考虑 gas 价格波动）
    const expectedAmount = BigInt(process.env.PAYMENT_AMOUNT_WEI!);
    const actualAmount = transaction.value;
    const tolerance = expectedAmount / BigInt(20); // 5%

    if (actualAmount < expectedAmount - tolerance) {
      return NextResponse.json(
        { success: false, error: 'Insufficient payment amount' },
        { status: 400 }
      );
    }

    // 6. 检查是否已经处理过此交易（防重放）
    const { data: existing } = await supabase
      .from('payment_402_transactions')
      .select('id')
      .eq('payment_proof', txHash)
      .single();

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Transaction already used' },
        { status: 400 }
      );
    }

    // 7. 生成访问 Token
    const accessToken = crypto.randomBytes(32).toString('hex');

    // 8. 保存交易记录
    await supabase.from('payment_402_transactions').insert({
      content_id: contentId,
      payment_method: 'web3',
      payment_proof: txHash,
      payment_status: 'completed',
      amount_crypto: transaction.value.toString(),
      currency: 'ETH',
      user_address: transaction.from,
    });

    // 9. 创建访问令牌
    await supabase.from('payment_402_access_tokens').insert({
      content_id: contentId,
      token: accessToken,
      expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1年
    });

    return NextResponse.json({
      success: true,
      token: accessToken,
    });

  } catch (error) {
    console.error('Verification failed:', error);
    return NextResponse.json(
      { success: false, error: 'Verification failed' },
      { status: 500 }
    );
  }
}
```

### 4.2 价格转换 API（实时汇率）

```typescript
// app/api/payment/price/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 从 CoinGecko 获取实时 ETH 价格
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
    );
    const data = await response.json();
    const ethPrice = data.ethereum.usd;

    // 计算内容价格（假设 $2.99）
    const priceUSD = 2.99;
    const priceETH = (priceUSD / ethPrice).toFixed(6);

    return NextResponse.json({
      success: true,
      priceUSD: priceUSD,
      priceETH: priceETH,
      ethUSD: ethPrice,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch price' },
      { status: 500 }
    );
  }
}
```

---

## 五、使用示例

### 5.1 保护策略详情页

```typescript
// app/strategies/[slug]/page.tsx
import { Payment402Guard } from '@/components/Payment402Guard';

export default async function StrategyPage({ params }: { params: { slug: string } }) {
  const strategy = await getStrategy(params.slug);

  return (
    <div>
      {/* 免费预览部分 */}
      <StrategyHeader strategy={strategy} />
      <StrategySummary summary={strategy.summary} />

      {/* 付费完整内容 */}
      {strategy.is_premium ? (
        <Payment402Guard
          contentId={strategy.id}
          priceUSD={2.99}
        >
          <StrategyFullContent content={strategy.full_content} />
          <StrategyBacktest backtest={strategy.backtest_data} />
          <StrategyRiskAnalysis risks={strategy.risks} />
        </Payment402Guard>
      ) : (
        <>
          <StrategyFullContent content={strategy.full_content} />
          <StrategyBacktest backtest={strategy.backtest_data} />
          <StrategyRiskAnalysis risks={strategy.risks} />
        </>
      )}
    </div>
  );
}
```

### 5.2 Payment Guard 组件

```typescript
// components/Payment402Guard.tsx
'use client';

import { useEffect, useState } from 'react';
import { Web3PaymentDialog } from './Web3PaymentDialog';
import Cookies from 'js-cookie';

export function Payment402Guard({
  contentId,
  priceUSD,
  children
}: {
  contentId: string;
  priceUSD: number;
  children: React.ReactNode;
}) {
  const [hasAccess, setHasAccess] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [priceETH, setPriceETH] = useState('0');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAccess();
    fetchPrice();
  }, []);

  async function checkAccess() {
    // 检查 Cookie 中的访问令牌
    const token = Cookies.get(`access_${contentId}`);

    if (token) {
      // 验证 token 有效性
      const response = await fetch('/api/payment/verify-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentId, token }),
      });

      const data = await response.json();

      if (data.valid) {
        setHasAccess(true);
      } else {
        setShowPayment(true);
      }
    } else {
      setShowPayment(true);
    }

    setLoading(false);
  }

  async function fetchPrice() {
    const response = await fetch('/api/payment/price');
    const data = await response.json();
    setPriceETH(data.priceETH);
  }

  function handlePaymentSuccess() {
    setShowPayment(false);
    setHasAccess(true);
  }

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (showPayment) {
    return (
      <Web3PaymentDialog
        contentId={contentId}
        priceUSD={priceUSD}
        priceETH={priceETH}
        onSuccess={handlePaymentSuccess}
      />
    );
  }

  return hasAccess ? <>{children}</> : null;
}
```

---

## 六、UI 设计建议

### 6.1 设计原则

```
1. 清晰明确
   - 价格显示突出（ETH + USD）
   - 步骤指示清晰
   - 错误提示友好

2. 信任感
   - 显示区块链交易链接
   - 展示实时交易状态
   - 保证透明度

3. 快速流畅
   - 减少点击步骤
   - 自动检测钱包连接
   - 智能等待和重试
```

### 6.2 可选的 UI 库

```typescript
// 选项 1: 完全自定义（推荐）
- Tailwind CSS + Framer Motion
- 完全控制样式和交互

// 选项 2: 使用 RainbowKit（可选）
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
// 提供现成的钱包连接 UI，但你仍需自己做支付确认 UI

// 选项 3: 混合使用
- RainbowKit 处理钱包连接
- 自定义支付确认和状态 UI
```

---

## 七、总结

### 核心要点

✅ **HTTP 402 是协议，不是产品**
   - 只定义了"如何告知需要付费"
   - 不包含任何 UI 或支付实现

✅ **所有 UI 都需要自己做**
   - 钱包连接界面
   - 支付确认对话框
   - 交易状态展示
   - 成功/失败提示

✅ **纯 Web3 更简单**
   - 不需要 Stripe 集成
   - 不需要处理退款逻辑
   - 直接链上验证
   - 适合 crypto native 用户

### 实施优先级

**Week 1: 基础功能**
- [x] wagmi 配置
- [x] 简单支付 UI
- [x] 交易验证 API

**Week 2: 优化体验**
- [x] 实时价格转换
- [x] 交易状态轮询
- [x] 错误处理

**Week 3: 多链支持**
- [x] Polygon（低 gas）
- [x] Base（快速确认）
- [x] Arbitrum（便宜）

### 预估成本

- **开发时间**: 1-2周
- **Gas费用**: 用户承担
- **运营成本**: 几乎为零
- **收款直接到账**: 无需等待结算

需要我帮你开始实现具体的代码吗？
