'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Crown,
  Calendar,
  CreditCard,
  Check,
  ArrowUpCircle,
  AlertCircle,
  Download,
  Settings as SettingsIcon
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface Membership {
  id: string;
  name: string;
  level: number;
  price_monthly_usd: number;
  price_yearly_usd: number;
  features: Record<string, string>;
  description: string;
}

interface Subscription {
  id: string;
  membership: Membership;
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  billing_cycle: 'monthly' | 'yearly';
  payment_method: 'stripe' | 'crypto';
  amount_paid: number;
  start_date: string;
  end_date: string;
  auto_renew: boolean;
  cancelled_at?: string;
}

export default function MembershipPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('[Membership] useEffect triggered:', { authLoading, user: !!user });
    if (!authLoading) {
      if (!user) {
        // 未登录,跳转到登录页
        console.log('[Membership] No user, redirecting to login');
        router.push('/auth/login?redirect=/membership');
      } else {
        console.log('[Membership] User logged in, fetching subscription');
        fetchSubscription();
      }
    }
  }, [user, authLoading, router]);

  const fetchSubscription = async () => {
    try {
      console.log('[Membership] Calling /api/subscription...');
      const response = await fetch('/api/subscription');
      console.log('[Membership] API response status:', response.status);
      const data = await response.json();
      console.log('[Membership] API data:', data);
      setSubscription(data.subscription);
    } catch (error) {
      console.error('[Membership] Failed to fetch subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = () => {
    router.push('/pricing');
  };

  const handleManageSubscription = () => {
    // TODO: 实现管理订阅功能
    console.log('Manage subscription');
  };

  const handleCancelSubscription = () => {
    // TODO: 实现取消订阅功能
    console.log('Cancel subscription');
  };

  const getMembershipBadgeColor = (level: number) => {
    switch (level) {
      case 0:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
      case 1:
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 2:
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
      case 3:
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">激活中</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="text-orange-600">已取消</Badge>;
      case 'expired':
        return <Badge variant="outline" className="text-red-600">已过期</Badge>;
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600">待激活</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (authLoading || loading) {
    return (
      <div className="container max-w-5xl mx-auto px-4 py-16">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">加载中...</p>
          </div>
        </div>
      </div>
    );
  }

  // 免费用户或无订阅状态
  if (!subscription) {
    return (
      <div className="container max-w-5xl mx-auto px-4 py-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">会员中心</h1>
          <p className="text-muted-foreground">管理您的订阅和会员权益</p>
        </div>

        {/* Free User Card */}
        <Card className="p-8 mb-8 border-2 border-dashed">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
              <Crown className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Free 会员</h2>
            <p className="text-muted-foreground mb-6">
              您当前是免费用户,升级会员即可解锁更多高级功能
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-left">
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="font-medium">当前权益</span>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 20% 基础内容</li>
                  <li>• 5个收藏</li>
                  <li>• 每日5条快讯</li>
                </ul>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="h-4 w-4 text-blue-500" />
                  <span className="font-medium text-blue-700 dark:text-blue-300">Pro 会员</span>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 60% 中级内容</li>
                  <li>• 无限收藏</li>
                  <li>• 高级搜索</li>
                </ul>
                <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-2">
                  $39/月
                </p>
              </div>

              <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="h-4 w-4 text-purple-500" />
                  <span className="font-medium text-purple-700 dark:text-purple-300">Max 会员</span>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 100% 全部内容</li>
                  <li>• AI 助手</li>
                  <li>• 独家报告</li>
                </ul>
                <p className="text-xs font-bold text-purple-600 dark:text-purple-400 mt-2">
                  $99/月
                </p>
              </div>
            </div>

            <Button onClick={handleUpgrade} size="lg" className="w-full md:w-auto">
              <ArrowUpCircle className="mr-2 h-5 w-5" />
              立即升级会员
            </Button>
          </div>
        </Card>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-blue-500" />
              为什么升级?
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>解锁更多高质量加密玩法策略</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>获取独家深度分析和市场洞察</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>使用 AI 助手辅助决策</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>无限制访问所有快讯和资讯</span>
              </li>
            </ul>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Download className="h-5 w-5 text-purple-500" />
              常见问题
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <p className="font-medium mb-1">如何升级会员?</p>
                <p className="text-muted-foreground">
                  点击"立即升级会员"按钮,选择适合的方案并完成支付即可
                </p>
              </li>
              <li>
                <p className="font-medium mb-1">支持哪些支付方式?</p>
                <p className="text-muted-foreground">
                  支持 Stripe 信用卡支付和加密货币支付
                </p>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    );
  }

  // 付费用户状态
  const daysRemaining = Math.ceil(
    (new Date(subscription.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="container max-w-5xl mx-auto px-4 py-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">会员中心</h1>
        <p className="text-muted-foreground">管理您的订阅和会员权益</p>
      </div>

      {/* Current Subscription Card */}
      <Card className="p-6 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge className={getMembershipBadgeColor(subscription.membership.level)}>
                {subscription.membership.name}
              </Badge>
              {getStatusBadge(subscription.status)}
            </div>
            <h2 className="text-2xl font-bold mb-1">
              ${subscription.amount_paid}
              <span className="text-sm font-normal text-muted-foreground ml-2">
                / {subscription.billing_cycle === 'monthly' ? '月' : '年'}
              </span>
            </h2>
            <div
              className="text-sm text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: subscription.membership.description }}
            />
          </div>

          <Button variant="outline" onClick={handleManageSubscription}>
            <SettingsIcon className="h-4 w-4 mr-2" />
            管理订阅
          </Button>
        </div>

        <Separator className="my-6" />

        {/* Subscription Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Calendar className="h-4 w-4" />
              <span>订阅信息</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">开始日期:</span>
                <span className="font-medium">
                  {new Date(subscription.start_date).toLocaleDateString('zh-CN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">到期日期:</span>
                <span className="font-medium">
                  {new Date(subscription.end_date).toLocaleDateString('zh-CN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">剩余天数:</span>
                <span className="font-medium text-blue-600">
                  {daysRemaining} 天
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">自动续费:</span>
                <span className="font-medium">
                  {subscription.auto_renew ? '已开启' : '已关闭'}
                </span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <CreditCard className="h-4 w-4" />
              <span>支付信息</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">支付方式:</span>
                <span className="font-medium">
                  {subscription.payment_method === 'stripe' ? 'Stripe (信用卡)' : '加密货币'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">付费周期:</span>
                <span className="font-medium">
                  {subscription.billing_cycle === 'monthly' ? '按月付费' : '按年付费'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">已支付:</span>
                <span className="font-medium">
                  ${subscription.amount_paid}
                </span>
              </div>
            </div>
          </div>
        </div>

        {subscription.status === 'active' && (
          <>
            <Separator className="my-6" />

            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" onClick={handleUpgrade} className="flex-1">
                <ArrowUpCircle className="h-4 w-4 mr-2" />
                升级方案
              </Button>
              <Button
                variant="outline"
                onClick={handleCancelSubscription}
                className="flex-1 text-red-600 hover:text-red-700"
              >
                取消订阅
              </Button>
            </div>
          </>
        )}
      </Card>

      {/* Features Card */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">您的会员权益</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {subscription.membership.features &&
            Object.entries(subscription.membership.features).map(([key, value]) => (
              <div key={key} className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{value}</span>
              </div>
            ))}
        </div>
      </Card>
    </div>
  );
}
