'use client';

import { useEffect, useState } from 'react';
import { Check, Zap, Crown, Handshake, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface Membership {
  id: string;
  name: string;
  level: number;
  price_monthly_usd: number;
  price_yearly_usd: number;
  content_access_level: number;
  features: Record<string, string>;
  description: string;
  sort_order: number;
}

interface CurrentSubscription {
  membership: {
    id: string;
    name: string;
    level: number;
  };
  status: string;
  end_date: string;
}

export default function PricingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<CurrentSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  useEffect(() => {
    fetchMemberships();
    if (user) {
      fetchCurrentSubscription();
    }
  }, [user]);

  const fetchMemberships = async () => {
    try {
      const response = await fetch('/api/memberships');
      const data = await response.json();
      setMemberships(data.memberships || []);
    } catch (error) {
      console.error('Failed to fetch memberships:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentSubscription = async () => {
    try {
      const response = await fetch('/api/subscription');
      const data = await response.json();
      if (data.subscription) {
        setCurrentSubscription(data.subscription);
      }
    } catch (error) {
      console.error('Failed to fetch current subscription:', error);
    }
  };

  const getMembershipIcon = (level: number) => {
    switch (level) {
      case 0:
        return <Zap className="h-6 w-6" />;
      case 1:
        return <Zap className="h-6 w-6 text-blue-500" />;
      case 2:
        return <Crown className="h-6 w-6 text-purple-500" />;
      case 3:
        return <Handshake className="h-6 w-6 text-amber-500" />;
      default:
        return <Zap className="h-6 w-6" />;
    }
  };

  const getMembershipColor = (level: number) => {
    switch (level) {
      case 0:
        return 'border-gray-200 dark:border-gray-800';
      case 1:
        return 'border-blue-200 dark:border-blue-900 ring-2 ring-blue-500/20';
      case 2:
        return 'border-purple-200 dark:border-purple-900 ring-2 ring-purple-500/20';
      case 3:
        return 'border-amber-200 dark:border-amber-900 ring-2 ring-amber-500/20';
      default:
        return 'border-gray-200 dark:border-gray-800';
    }
  };

  const getPrice = (membership: Membership) => {
    return billingCycle === 'monthly'
      ? membership.price_monthly_usd
      : membership.price_yearly_usd;
  };

  const getMonthlySavings = (membership: Membership) => {
    if (billingCycle === 'yearly' && membership.price_yearly_usd > 0) {
      const monthlyCost = membership.price_monthly_usd * 12;
      const yearlyCost = membership.price_yearly_usd;
      const savings = monthlyCost - yearlyCost;
      const savingsPercent = Math.round((savings / monthlyCost) * 100);
      return { amount: savings, percent: savingsPercent };
    }
    return null;
  };

  const handleSelectPlan = (membership: Membership) => {
    if (membership.level === 0) {
      // Free plan - redirect to signup
      router.push('/auth/signup');
    } else {
      // Paid plans - redirect to checkout
      router.push(`/checkout?plan=${membership.id}&cycle=${billingCycle}`);
    }
  };

  if (loading) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">加载中...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">选择适合您的会员方案</h1>
        <p className="text-xl text-muted-foreground mb-8">
          解锁更多加密玩法,获取独家策略和深度分析
        </p>

        {/* Current Subscription Notice */}
        {currentSubscription && (
          <Card className="max-w-2xl mx-auto mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                    您当前是 {currentSubscription.membership.name} 会员
                  </h3>
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                    {currentSubscription.status === 'active' ? '激活中' : currentSubscription.status}
                  </Badge>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  到期时间: {new Date(currentSubscription.end_date).toLocaleDateString('zh-CN')}
                  {' · '}
                  {currentSubscription.membership.level < 2 && (
                    <span className="font-medium">升级可解锁更多高级功能</span>
                  )}
                  {currentSubscription.membership.level === 2 && (
                    <span className="font-medium">您已享受最高级别会员权益</span>
                  )}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/membership')}
                className="flex-shrink-0 border-blue-300 hover:bg-blue-100 dark:border-blue-700 dark:hover:bg-blue-900"
              >
                查看详情
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </Card>
        )}

        {/* Billing Toggle */}
        <div className="inline-flex items-center gap-4 p-1 bg-muted rounded-lg">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-2 rounded-md transition-colors ${
              billingCycle === 'monthly'
                ? 'bg-background shadow-sm font-medium'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            按月付费
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-6 py-2 rounded-md transition-colors ${
              billingCycle === 'yearly'
                ? 'bg-background shadow-sm font-medium'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            按年付费
            <Badge variant="secondary" className="ml-2 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
              省 17%
            </Badge>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {memberships.map((membership) => {
          const price = getPrice(membership);
          const savings = getMonthlySavings(membership);

          return (
            <Card
              key={membership.id}
              className={`relative overflow-hidden transition-all hover:shadow-lg ${getMembershipColor(
                membership.level
              )}`}
            >
              {/* Popular Badge */}
              {membership.level === 1 && (
                <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                  最受欢迎
                </div>
              )}

              {/* Best Value Badge */}
              {membership.level === 2 && (
                <div className="absolute top-0 right-0 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                  最超值
                </div>
              )}

              <div className="p-6">
                {/* Icon & Name */}
                <div className="flex items-center gap-3 mb-4">
                  {getMembershipIcon(membership.level)}
                  <h3 className="text-2xl font-bold">{membership.name}</h3>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">
                      ${price}
                    </span>
                    {membership.level > 0 && (
                      <span className="text-muted-foreground">
                        /{billingCycle === 'monthly' ? '月' : '年'}
                      </span>
                    )}
                  </div>
                  {savings && (
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                      每年节省 ${savings.amount} ({savings.percent}%)
                    </p>
                  )}
                  {billingCycle === 'yearly' && membership.level > 0 && (
                    <p className="text-sm text-muted-foreground mt-1">
                      相当于 ${(price / 10).toFixed(2)}/月
                    </p>
                  )}
                </div>

                {/* Description */}
                <div
                  className="text-sm text-muted-foreground mb-6 min-h-[60px]"
                  dangerouslySetInnerHTML={{ __html: membership.description }}
                />

                {/* CTA Button */}
                {currentSubscription && currentSubscription.membership.level === membership.level ? (
                  <Button
                    disabled
                    className="w-full mb-6 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 border-green-300 dark:border-green-700 cursor-not-allowed opacity-100"
                    variant="outline"
                    size="lg"
                  >
                    <Check className="mr-2 h-5 w-5" />
                    当前方案
                  </Button>
                ) : currentSubscription && currentSubscription.membership.level > membership.level ? (
                  <Button
                    disabled
                    className="w-full mb-6 opacity-50 cursor-not-allowed"
                    variant="outline"
                    size="lg"
                  >
                    已拥有更高等级
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleSelectPlan(membership)}
                    className="w-full mb-6"
                    variant={membership.level === 1 ? 'default' : 'outline'}
                    size="lg"
                  >
                    {currentSubscription && membership.level > currentSubscription.membership.level ? '升级' : membership.level === 0 ? '免费开始' : '立即订阅'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}

                {/* Features */}
                <div className="space-y-3">
                  {membership.features && Object.entries(membership.features).map(([key, value]) => (
                    <div key={key} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{value}</span>
                    </div>
                  ))}
                </div>

                {/* Partner Special */}
                {membership.level === 3 && (
                  <div className="mt-6 pt-6 border-t">
                    <p className="text-sm font-medium text-amber-600 dark:text-amber-400 mb-2">
                      合伙人专属权益:
                    </p>
                    <ul className="text-sm space-y-2 text-muted-foreground">
                      <li>• 推荐新用户获得 20% 佣金</li>
                      <li>• 发布自己的玩法获得 70% 收益</li>
                      <li>• 专属数据分析面板</li>
                    </ul>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Feature Comparison Table */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold text-center mb-8">功能对比</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-4 px-4 font-semibold">功能</th>
                {memberships.map((m) => (
                  <th key={m.id} className="text-center py-4 px-4 font-semibold">
                    {m.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-4 px-4">玩法策略访问</td>
                <td className="text-center py-4 px-4">20% 基础</td>
                <td className="text-center py-4 px-4">60% 中级</td>
                <td className="text-center py-4 px-4">100% 全部</td>
                <td className="text-center py-4 px-4">100% 全部</td>
              </tr>
              <tr className="border-b">
                <td className="py-4 px-4">快讯访问</td>
                <td className="text-center py-4 px-4">每日5条</td>
                <td className="text-center py-4 px-4">无限制</td>
                <td className="text-center py-4 px-4">无限制</td>
                <td className="text-center py-4 px-4">无限制</td>
              </tr>
              <tr className="border-b">
                <td className="py-4 px-4">收藏数量</td>
                <td className="text-center py-4 px-4">5个</td>
                <td className="text-center py-4 px-4">无限制</td>
                <td className="text-center py-4 px-4">无限制</td>
                <td className="text-center py-4 px-4">无限制</td>
              </tr>
              <tr className="border-b">
                <td className="py-4 px-4">高级搜索</td>
                <td className="text-center py-4 px-4">-</td>
                <td className="text-center py-4 px-4">
                  <Check className="h-5 w-5 text-green-500 mx-auto" />
                </td>
                <td className="text-center py-4 px-4">
                  <Check className="h-5 w-5 text-green-500 mx-auto" />
                </td>
                <td className="text-center py-4 px-4">
                  <Check className="h-5 w-5 text-green-500 mx-auto" />
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-4 px-4">数据导出</td>
                <td className="text-center py-4 px-4">-</td>
                <td className="text-center py-4 px-4">
                  <Check className="h-5 w-5 text-green-500 mx-auto" />
                </td>
                <td className="text-center py-4 px-4">
                  <Check className="h-5 w-5 text-green-500 mx-auto" />
                </td>
                <td className="text-center py-4 px-4">
                  <Check className="h-5 w-5 text-green-500 mx-auto" />
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-4 px-4">AI 助手</td>
                <td className="text-center py-4 px-4">-</td>
                <td className="text-center py-4 px-4">-</td>
                <td className="text-center py-4 px-4">
                  <Check className="h-5 w-5 text-green-500 mx-auto" />
                </td>
                <td className="text-center py-4 px-4">
                  <Check className="h-5 w-5 text-green-500 mx-auto" />
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-4 px-4">独家报告</td>
                <td className="text-center py-4 px-4">-</td>
                <td className="text-center py-4 px-4">-</td>
                <td className="text-center py-4 px-4">
                  <Check className="h-5 w-5 text-green-500 mx-auto" />
                </td>
                <td className="text-center py-4 px-4">
                  <Check className="h-5 w-5 text-green-500 mx-auto" />
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-4 px-4">发布玩法</td>
                <td className="text-center py-4 px-4">-</td>
                <td className="text-center py-4 px-4">-</td>
                <td className="text-center py-4 px-4">-</td>
                <td className="text-center py-4 px-4">
                  <Check className="h-5 w-5 text-green-500 mx-auto" />
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-4 px-4">收益分成</td>
                <td className="text-center py-4 px-4">-</td>
                <td className="text-center py-4 px-4">-</td>
                <td className="text-center py-4 px-4">-</td>
                <td className="text-center py-4 px-4">
                  <Check className="h-5 w-5 text-green-500 mx-auto" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-16 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">常见问题</h2>
        <div className="space-y-6">
          <div className="border rounded-lg p-6">
            <h3 className="font-semibold mb-2">支持哪些支付方式?</h3>
            <p className="text-muted-foreground">
              我们支持 Stripe 信用卡支付和加密货币支付 (USDT, USDC, ETH, BTC)。
            </p>
          </div>
          <div className="border rounded-lg p-6">
            <h3 className="font-semibold mb-2">可以随时取消订阅吗?</h3>
            <p className="text-muted-foreground">
              是的,您可以随时在会员中心取消订阅。取消后,您可以继续使用至当前付费周期结束。
            </p>
          </div>
          <div className="border rounded-lg p-6">
            <h3 className="font-semibold mb-2">年付可以退款吗?</h3>
            <p className="text-muted-foreground">
              订阅后 7 天内可以申请全额退款。超过 7 天后,不支持退款,但可以取消自动续费。
            </p>
          </div>
          <div className="border rounded-lg p-6">
            <h3 className="font-semibold mb-2">合伙人如何获得收益?</h3>
            <p className="text-muted-foreground">
              合伙人通过推荐链接邀请新用户付费可获得 20% 佣金,发布的玩法内容被付费会员访问可获得 70% 收益分成。
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-16 text-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-2xl p-12">
        <h2 className="text-3xl font-bold mb-4">还有疑问?</h2>
        <p className="text-lg text-muted-foreground mb-6">
          联系我们的客服团队,我们将为您解答所有问题
        </p>
        <Button size="lg" variant="default">
          联系客服
        </Button>
      </div>
    </div>
  );
}
