'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  DollarSign,
  Users,
  TrendingUp,
  Link as LinkIcon,
  Copy,
  Eye,
  FileText,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface PartnerStats {
  totalEarnings: number;
  pendingEarnings: number;
  paidEarnings: number;
  referralCount: number;
  referralConversions: number;
  contentViews: number;
  contentEarnings: number;
}

interface ReferralLink {
  id: string;
  code: string;
  clicks: number;
  conversions: number;
  total_earnings: number;
  is_active: boolean;
  created_at: string;
}

interface Earning {
  id: string;
  earning_type: 'referral' | 'content';
  amount: number;
  status: 'pending' | 'settled' | 'paid';
  created_at: string;
  settled_at?: string;
  paid_at?: string;
}

export default function PartnerDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<PartnerStats | null>(null);
  const [referralLinks, setReferralLinks] = useState<ReferralLink[]>([]);
  const [earnings, setEarnings] = useState<Earning[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/auth/login?redirect=/dashboard/partner');
      } else {
        // TODO: 检查用户是否是合伙人
        fetchDashboardData();
      }
    }
  }, [user, authLoading, router]);

  const fetchDashboardData = async () => {
    try {
      // TODO: 实现API调用
      // 临时模拟数据
      setStats({
        totalEarnings: 2450.00,
        pendingEarnings: 380.50,
        paidEarnings: 2069.50,
        referralCount: 45,
        referralConversions: 12,
        contentViews: 1250,
        contentEarnings: 875.00,
      });

      setReferralLinks([
        {
          id: '1',
          code: 'PARTNER2024',
          clicks: 156,
          conversions: 8,
          total_earnings: 624.00,
          is_active: true,
          created_at: new Date().toISOString(),
        },
      ]);

      setEarnings([
        {
          id: '1',
          earning_type: 'referral',
          amount: 39.00,
          status: 'paid',
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          paid_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '2',
          earning_type: 'content',
          amount: 68.30,
          status: 'settled',
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          settled_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '3',
          earning_type: 'referral',
          amount: 39.00,
          status: 'pending',
          created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ]);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyReferralLink = (code: string) => {
    const link = `${window.location.origin}/pricing?ref=${code}`;
    navigator.clipboard.writeText(link);
    toast.success('推荐链接已复制到剪贴板');
  };

  const handleCreateReferralLink = () => {
    // TODO: 实现创建推荐链接
    toast.info('创建推荐链接功能开发中');
  };

  const getEarningStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
            <CheckCircle className="h-3 w-3 mr-1" />
            已支付
          </Badge>
        );
      case 'settled':
        return (
          <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
            <Clock className="h-3 w-3 mr-1" />
            已结算
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="text-orange-600">
            <AlertCircle className="h-3 w-3 mr-1" />
            待结算
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getEarningTypeName = (type: string) => {
    return type === 'referral' ? '推荐佣金' : '内容分成';
  };

  if (authLoading || loading) {
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

  // TODO: 检查用户是否是合伙人,如果不是则显示升级提示
  const isPartner = true; // 临时设为true

  if (!isPartner) {
    return (
      <div className="container max-w-5xl mx-auto px-4 py-16">
        <Card className="p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900 mb-4">
            <AlertCircle className="h-8 w-8 text-amber-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">需要合伙人权限</h2>
          <p className="text-muted-foreground mb-6">
            此页面仅对玩法合伙人开放,升级至合伙人方案即可访问
          </p>
          <Button onClick={() => router.push('/pricing')} size="lg">
            升级为合伙人
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold">合伙人仪表板</h1>
          <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
            Partner
          </Badge>
        </div>
        <p className="text-muted-foreground">管理您的推荐链接和收益</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">总收益</span>
            <DollarSign className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold">${stats?.totalEarnings.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground mt-1">
            已支付: ${stats?.paidEarnings.toFixed(2)}
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">待结算</span>
            <Clock className="h-5 w-5 text-orange-500" />
          </div>
          <p className="text-2xl font-bold text-orange-600">
            ${stats?.pendingEarnings.toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            预计 7 天内结算
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">推荐用户</span>
            <Users className="h-5 w-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold">{stats?.referralCount}</p>
          <p className="text-xs text-muted-foreground mt-1">
            转化: {stats?.referralConversions} 人
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">内容收益</span>
            <TrendingUp className="h-5 w-5 text-purple-500" />
          </div>
          <p className="text-2xl font-bold">${stats?.contentEarnings.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground mt-1">
            浏览: {stats?.contentViews} 次
          </p>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">概览</TabsTrigger>
          <TabsTrigger value="referrals">推荐链接</TabsTrigger>
          <TabsTrigger value="earnings">收益记录</TabsTrigger>
          <TabsTrigger value="content">内容管理</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Earnings Chart Placeholder */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">收益趋势</h3>
              <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
                <p className="text-muted-foreground">图表功能开发中</p>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">快速操作</h3>
              <div className="space-y-3">
                <Button
                  onClick={handleCreateReferralLink}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <LinkIcon className="h-4 w-4 mr-2" />
                  创建推荐链接
                </Button>
                <Button
                  onClick={() => router.push('/strategies/new')}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  发布新玩法
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  查看内容数据
                </Button>
              </div>

              <Separator className="my-4" />

              <div className="space-y-3">
                <h4 className="text-sm font-medium">收益说明</h4>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>• 推荐佣金: 新用户付费后获得 20% 佣金</p>
                  <p>• 内容分成: 您的玩法被付费会员访问获得 70% 收益</p>
                  <p>• 结算周期: 每月 1 号结算上月收益</p>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Referrals Tab */}
        <TabsContent value="referrals" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold">我的推荐链接</h3>
              <Button onClick={handleCreateReferralLink}>
                <LinkIcon className="h-4 w-4 mr-2" />
                创建新链接
              </Button>
            </div>

            <div className="space-y-4">
              {referralLinks.map((link) => (
                <Card key={link.id} className="p-4 bg-muted/50">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <code className="text-sm font-mono bg-background px-2 py-1 rounded">
                          {link.code}
                        </code>
                        {link.is_active && (
                          <Badge variant="outline" className="text-green-600">
                            激活
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        创建于 {new Date(link.created_at).toLocaleDateString('zh-CN')}
                      </p>
                    </div>
                    <Button
                      onClick={() => handleCopyReferralLink(link.code)}
                      variant="outline"
                      size="sm"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      复制链接
                    </Button>
                  </div>

                  <Separator className="my-3" />

                  <div className="grid grid-cols-3 gap-4 text-center text-sm">
                    <div>
                      <p className="text-muted-foreground mb-1">点击次数</p>
                      <p className="text-lg font-semibold">{link.clicks}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">转化数</p>
                      <p className="text-lg font-semibold text-blue-600">
                        {link.conversions}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">总收益</p>
                      <p className="text-lg font-semibold text-green-600">
                        ${link.total_earnings.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Earnings Tab */}
        <TabsContent value="earnings" className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-6">收益记录</h3>

            <div className="space-y-3">
              {earnings.map((earning) => (
                <div
                  key={earning.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-2 rounded-lg ${
                        earning.earning_type === 'referral'
                          ? 'bg-blue-100 dark:bg-blue-900'
                          : 'bg-purple-100 dark:bg-purple-900'
                      }`}
                    >
                      {earning.earning_type === 'referral' ? (
                        <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      ) : (
                        <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{getEarningTypeName(earning.earning_type)}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(earning.created_at).toLocaleDateString('zh-CN')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {getEarningStatusBadge(earning.status)}
                    <p className="text-lg font-semibold w-24 text-right">
                      +${earning.amount.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {earnings.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>暂无收益记录</p>
              </div>
            )}
          </Card>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold">我的玩法内容</h3>
              <Button onClick={() => router.push('/strategies/new')}>
                <FileText className="h-4 w-4 mr-2" />
                发布新玩法
              </Button>
            </div>

            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="mb-4">您还没有发布任何玩法</p>
              <Button onClick={() => router.push('/strategies/new')}>
                立即发布
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
