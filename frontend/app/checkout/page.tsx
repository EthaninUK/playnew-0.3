'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Wallet, ArrowLeft, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/lib/hooks/useAuth';

interface Membership {
  id: string;
  name: string;
  level: number;
  price_monthly_usd: number;
  price_yearly_usd: number;
  features: Record<string, string>;
  description: string;
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const planId = searchParams.get('plan');
  const cycle = searchParams.get('cycle') as 'monthly' | 'yearly' || 'monthly';

  const [membership, setMembership] = useState<Membership | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'crypto'>('stripe');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (planId) {
      fetchMembership(planId);
    }
  }, [planId]);

  const fetchMembership = async (id: string) => {
    try {
      const response = await fetch('/api/memberships');
      const data = await response.json();
      // Convert string ID to number for comparison
      const found = data.memberships.find((m: Membership) => String(m.id) === id);
      setMembership(found || null);
    } catch (error) {
      console.error('Failed to fetch membership:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPrice = () => {
    if (!membership) return 0;
    return cycle === 'monthly'
      ? membership.price_monthly_usd
      : membership.price_yearly_usd;
  };

  const getSavings = () => {
    if (!membership || cycle === 'monthly') return null;
    const monthlyCost = membership.price_monthly_usd * 12;
    const yearlyCost = membership.price_yearly_usd;
    return monthlyCost - yearlyCost;
  };

  const handlePayment = async () => {
    if (!membership || !user) {
      toast.error('请先登录');
      router.push('/auth/login?redirect=' + encodeURIComponent(window.location.pathname + window.location.search));
      return;
    }

    if (paymentMethod === 'crypto') {
      toast.info('加密货币支付功能即将上线');
      return;
    }

    try {
      setProcessing(true);
      toast.info('正在跳转到支付页面...');

      // 创建 Stripe Checkout Session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          membershipId: membership.id,
          billingCycle: cycle,
          userId: user.id,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create checkout session');
      }

      const { url } = await response.json();

      // 跳转到 Stripe Checkout 页面
      window.location.href = url;
    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error(error.message || '支付失败,请重试');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-16">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">加载中...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!membership) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">未找到会员方案</h1>
          <Button onClick={() => router.push('/pricing')}>返回定价页面</Button>
        </div>
      </div>
    );
  }

  const price = getPrice();
  const savings = getSavings();

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.push('/pricing')}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        返回定价页面
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Order Summary */}
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold mb-6">完成订阅</h1>

          {/* Payment Method Selection */}
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">选择支付方式</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setPaymentMethod('stripe')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  paymentMethod === 'stripe'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="h-6 w-6" />
                  <div className="text-left">
                    <p className="font-semibold">信用卡支付</p>
                    <p className="text-sm text-muted-foreground">Stripe</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setPaymentMethod('crypto')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  paymentMethod === 'crypto'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Wallet className="h-6 w-6" />
                  <div className="text-left">
                    <p className="font-semibold">加密货币</p>
                    <p className="text-sm text-muted-foreground">USDT/ETH/BTC</p>
                  </div>
                </div>
              </button>
            </div>
          </Card>

          {/* Payment Form Placeholder */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              {paymentMethod === 'stripe' ? '支付信息' : '加密货币支付'}
            </h2>

            {paymentMethod === 'stripe' ? (
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Stripe 支付集成将在下一步实现
                </p>
                {/* TODO: Add Stripe payment form */}
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  加密货币支付集成将在下一步实现
                </p>
                {/* TODO: Add crypto payment form */}
              </div>
            )}
          </Card>
        </div>

        {/* Right Column - Order Details */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-4">
            <h2 className="text-xl font-semibold mb-4">订单摘要</h2>

            {/* Membership Details */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-lg">{membership.name}</span>
                <Badge variant="outline">
                  {cycle === 'monthly' ? '月付' : '年付'}
                </Badge>
              </div>
              <div
                className="text-sm text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: membership.description }}
              />
            </div>

            <Separator className="my-4" />

            {/* Features */}
            <div className="mb-4">
              <p className="font-medium mb-3">包含功能:</p>
              <div className="space-y-2">
                {membership.features &&
                  Object.entries(membership.features)
                    .slice(0, 5)
                    .map(([key, value]) => (
                      <div key={key} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{value}</span>
                      </div>
                    ))}
              </div>
            </div>

            <Separator className="my-4" />

            {/* Price Breakdown */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  {cycle === 'monthly' ? '月费' : '年费'}
                </span>
                <span className="font-semibold">${price}</span>
              </div>

              {savings && (
                <div className="flex items-center justify-between text-green-600 dark:text-green-400">
                  <span className="text-sm">年付优惠</span>
                  <span className="text-sm font-semibold">-${savings}</span>
                </div>
              )}

              {cycle === 'yearly' && (
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>平均每月</span>
                  <span>${(price / 12).toFixed(2)}</span>
                </div>
              )}
            </div>

            <Separator className="my-4" />

            {/* Total */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-lg font-semibold">总计</span>
              <span className="text-2xl font-bold">${price}</span>
            </div>

            {/* Pay Button */}
            <Button
              onClick={handlePayment}
              size="lg"
              className="w-full"
              disabled={processing}
            >
              {processing ? '处理中...' : '立即支付'}
            </Button>

            {/* Terms */}
            <p className="text-xs text-muted-foreground mt-4 text-center">
              点击支付即表示您同意我们的
              <a href="/terms" className="underline hover:text-foreground">
                服务条款
              </a>
              和
              <a href="/privacy" className="underline hover:text-foreground">
                隐私政策
              </a>
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="container max-w-4xl mx-auto px-4 py-16">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">加载中...</p>
          </div>
        </div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
