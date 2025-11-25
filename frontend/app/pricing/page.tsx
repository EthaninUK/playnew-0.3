'use client';

import { useEffect, useState } from 'react';
import { Check, Zap, Crown, Sparkles, ArrowRight, MessageCircle, Send, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
// 注释掉原来的 Web3PaymentDialog，改用 CryptoCloud
// import { Web3PaymentDialog } from '@/components/web3/Web3PaymentDialog';
import { CryptoCloudPaymentDialog } from '@/components/payment/CryptoCloudPaymentDialog';

interface Membership {
  id: string;
  name: string;
  level: number;
  price_usd: number; // 美元价格（用于 Web3 支付）
  features: string[];
  description: string;
  popular?: boolean;
  bestValue?: boolean;
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

// 固定的会员方案配置（使用加密货币直接支付）
const MEMBERSHIP_PLANS: Membership[] = [
  {
    id: 'free',
    name: 'Free',
    level: 0,
    price_usd: 0,
    description: '适合新手探索加密玩法',
    features: [
      '访问 20% 基础玩法策略',
      '每日 5 条快讯',
      '最多收藏 5 个内容',
      '基础搜索功能',
      '社区支持'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    level: 1,
    price_usd: 699,
    description: '适合进阶用户深入学习',
    popular: true,
    features: [
      '访问 60% 中级玩法策略',
      '无限快讯访问',
      '无限收藏',
      '高级搜索与筛选',
      '数据导出功能',
      'AI 辅助分析（Beta）',
      '优先客服支持'
    ]
  },
  {
    id: 'max',
    name: 'Max',
    level: 2,
    price_usd: 1299,
    description: '适合专业投资者全面布局',
    bestValue: true,
    features: [
      '访问 100% 全部玩法策略',
      '无限快讯访问',
      '无限收藏',
      '高级搜索与筛选',
      '数据导出功能',
      'AI 智能助手（完整版）',
      '独家深度研报',
      '专属 Discord 社群',
      '1对1 策略咨询（每月1次）'
    ]
  }
];

export default function PricingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [currentSubscription, setCurrentSubscription] = useState<CurrentSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Membership | null>(null);

  useEffect(() => {
    if (user) {
      fetchCurrentSubscription();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchCurrentSubscription = async () => {
    try {
      const response = await fetch('/api/subscription');
      const data = await response.json();
      if (data.subscription) {
        setCurrentSubscription(data.subscription);
      }
    } catch (error) {
      console.error('Failed to fetch current subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMembershipIcon = (level: number) => {
    switch (level) {
      case 0:
        return <Zap className="h-6 w-6 text-slate-500" />;
      case 1:
        return <Sparkles className="h-6 w-6 text-blue-500" />;
      case 2:
        return <Crown className="h-6 w-6 text-purple-500" />;
      default:
        return <Zap className="h-6 w-6" />;
    }
  };

  const getMembershipColor = (level: number) => {
    switch (level) {
      case 0:
        return 'border-slate-200 dark:border-slate-800';
      case 1:
        return 'border-blue-200 dark:border-blue-900 ring-2 ring-blue-500/20';
      case 2:
        return 'border-purple-200 dark:border-purple-900 ring-2 ring-purple-500/20';
      default:
        return 'border-slate-200 dark:border-slate-800';
    }
  };

  const handleSelectPlan = (membership: Membership) => {
    if (!user) {
      router.push('/auth/login?redirect=/pricing');
      return;
    }

    if (membership.level === 0) {
      return; // Free plan
    }

    // 打开 Web3 支付弹窗
    setSelectedPlan(membership);
    setShowPaymentDialog(true);
  };

  const handleContactForPartner = () => {
    window.open('https://t.me/playnew_partner', '_blank');
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="container max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 flex items-center gap-1.5 w-fit mx-auto">
            <Wallet className="h-3.5 w-3.5" />
            使用加密货币支付，年度订阅
          </Badge>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            选择适合您的会员方案
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            解锁更多加密玩法，获取独家策略和深度分析
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
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/member-center')}
                  className="flex-shrink-0 border-blue-300 hover:bg-blue-100 dark:border-blue-700 dark:hover:bg-blue-900"
                >
                  管理订阅
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-5xl mx-auto">
          {MEMBERSHIP_PLANS.map((membership) => {
            const isCurrentPlan = currentSubscription && currentSubscription.membership.level === membership.level;
            const hasHigherPlan = currentSubscription && currentSubscription.membership.level > membership.level;

            return (
              <Card
                key={membership.id}
                className={`relative overflow-hidden transition-all hover:shadow-xl ${getMembershipColor(
                  membership.level
                )} ${membership.popular ? 'scale-105' : ''}`}
              >
                {membership.popular && (
                  <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-4 py-1.5 rounded-bl-lg">
                    🔥 最受欢迎
                  </div>
                )}

                {membership.bestValue && (
                  <div className="absolute top-0 right-0 bg-purple-500 text-white text-xs font-bold px-4 py-1.5 rounded-bl-lg">
                    ⭐ 最超值
                  </div>
                )}

                <div className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    {getMembershipIcon(membership.level)}
                    <h3 className="text-3xl font-bold">{membership.name}</h3>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-2 mb-2">
                      {membership.level > 0 ? (
                        <>
                          <span className="text-sm text-muted-foreground">$</span>
                          <span className="text-5xl font-bold">{membership.price_usd}</span>
                          <span className="text-muted-foreground text-lg">/年</span>
                        </>
                      ) : (
                        <span className="text-5xl font-bold">免费</span>
                      )}
                    </div>
                    {membership.level > 0 && (
                      <p className="text-sm text-muted-foreground">
                        支持 ETH, USDC, USDT 等加密货币
                      </p>
                    )}
                  </div>

                  <p className="text-muted-foreground mb-6 min-h-[48px]">
                    {membership.description}
                  </p>

                  {/* CTA Button */}
                  {isCurrentPlan ? (
                    <Button
                      disabled
                      className="w-full mb-6 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 border-green-300 dark:border-green-700 cursor-not-allowed opacity-100"
                      variant="outline"
                      size="lg"
                    >
                      <Check className="mr-2 h-5 w-5" />
                      当前方案
                    </Button>
                  ) : hasHigherPlan ? (
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
                      className={`w-full mb-6 ${
                        membership.popular
                          ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600'
                          : membership.bestValue
                          ? 'bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600'
                          : ''
                      }`}
                      variant={membership.level > 0 ? 'default' : 'outline'}
                      size="lg"
                    >
                      {!user
                        ? '登录后订阅'
                        : membership.level === 0
                        ? '免费使用'
                        : currentSubscription && membership.level > currentSubscription.membership.level
                        ? '立即升级'
                        : '立即订阅'}
                      {membership.level > 0 && <Wallet className="ml-2 h-4 w-4" />}
                    </Button>
                  )}

                  {/* Features */}
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-muted-foreground mb-3">包含功能：</p>
                    {membership.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Payment Info */}
        <Card className="max-w-3xl mx-auto mb-16 p-6 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50">
          <div className="text-center">
            <h3 className="font-semibold mb-2 flex items-center justify-center gap-2">
              <Wallet className="h-5 w-5" />
              支持的支付方式
            </h3>
            <p className="text-muted-foreground">
              ETH, USDC, USDT 等主流加密货币 · 支持以太坊、Polygon、Arbitrum 等多链
            </p>
          </div>
        </Card>

        {/* Partner Section */}
        <Card className="max-w-5xl mx-auto mb-16 overflow-hidden border-2 border-amber-200 dark:border-amber-900">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-amber-100 dark:bg-amber-900/50 rounded-full">
                    <MessageCircle className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h2 className="text-3xl font-bold">玩法合伙人</h2>
                </div>
                <p className="text-lg text-muted-foreground mb-6">
                  成为 PlayNew 玩法合伙人，发布您的独家策略，与我们一起成长
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">发布玩法获得 70% 收益分成</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">推荐新用户获得 20% 佣金</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">专属数据分析面板</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">优先技术支持</span>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0">
                <Button
                  onClick={handleContactForPartner}
                  size="lg"
                  className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg"
                >
                  <Send className="mr-2 h-5 w-5" />
                  联系我们了解详情
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-2">
                  点击跳转至 Telegram
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">常见问题</h2>
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-2">为什么使用加密货币支付？</h3>
              <p className="text-muted-foreground">
                加密货币支付更灵活、费用更低，支持 ETH、USDC、USDT 等多种代币。无需信用卡，钱包连接即可完成支付，更符合 Web3 用户的使用习惯。
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-2">支持哪些钱包和链？</h3>
              <p className="text-muted-foreground">
                支持 MetaMask、WalletConnect 等主流钱包。支持以太坊主网、Polygon、Arbitrum 等多条链，您可以在支付时选择最合适的网络。
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-2">会员有效期多久？</h3>
              <p className="text-muted-foreground">
                所有付费会员均为年度订阅，有效期为 365 天。到期后需要重新购买续费。
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-2">可以退款吗？</h3>
              <p className="text-muted-foreground">
                由于区块链交易的不可逆性，支付完成后无法退款。请在购买前确认您选择的会员方案。
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-2">如何成为玩法合伙人？</h3>
              <p className="text-muted-foreground">
                点击上方"联系我们了解详情"按钮，通过 Telegram 联系我们的合伙人团队。我们会评估您的背景和内容质量，通过后即可开始发布玩法并获得收益。
              </p>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-2xl p-12 border border-blue-200 dark:border-blue-800">
          <h2 className="text-3xl font-bold mb-4">还有其他问题？</h2>
          <p className="text-lg text-muted-foreground mb-6">
            联系我们的客服团队，我们将为您解答所有问题
          </p>
          <Button size="lg" variant="default" onClick={() => window.open('https://t.me/playnew_support', '_blank')}>
            <MessageCircle className="mr-2 h-5 w-5" />
            联系客服
          </Button>
        </div>
      </div>

      {/* CryptoCloud 支付弹窗 */}
      {selectedPlan && (
        <CryptoCloudPaymentDialog
          open={showPaymentDialog}
          onClose={() => {
            setShowPaymentDialog(false);
            setSelectedPlan(null);
          }}
          membershipId={selectedPlan.id}
          membershipName={selectedPlan.name}
          amount={selectedPlan.price_usd}
          onSuccess={async () => {
            setShowPaymentDialog(false);
            setSelectedPlan(null);
            await fetchCurrentSubscription();
          }}
        />
      )}
    </div>
  );
}
