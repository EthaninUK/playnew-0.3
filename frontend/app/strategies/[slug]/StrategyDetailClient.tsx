'use client';

import { useState, useEffect } from 'react';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { LoginRequired } from '@/components/auth/LoginRequired';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { InteractionButtonsWrapper } from '@/components/shared/InteractionButtonsWrapper';
import { ShareButton } from '@/components/shared/ShareButton';
import {
  TrendingUp,
  Shield,
  DollarSign,
  Clock,
  AlertTriangle,
  ChevronLeft,
} from 'lucide-react';

interface Strategy {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  risk_level: number;
  apy_min: number;
  apy_max: number;
  apy_type?: string;
  threshold_capital: string;
  time_commitment: string;
  threshold_tech_level?: string;
  chains?: string[];
  protocols?: string[];
  tags?: string[];
  view_count?: number;
  bookmark_count?: number;
  published_at: string;
}

interface StrategyDetailClientProps {
  strategy: Strategy;
}

export function StrategyDetailClient({ strategy }: StrategyDetailClientProps) {
  const { isAuthorized, loading } = useAuthGuard();
  const [hasScrolled, setHasScrolled] = useState(false);

  // 监听滚动事件
  useEffect(() => {
    const handleScroll = () => {
      // 当滚动超过 100px 时隐藏技术要求框
      setHasScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 加载中显示骨架屏
  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">加载中...</div>
      </div>
    );
  }

  // 未登录显示登录提示
  if (!isAuthorized) {
    return (
      <LoginRequired
        title="查看策略详情需要登录"
        description="注册后即可免费查看全站所有策略内容"
      />
    );
  }

  // 已登录，显示完整内容
  const getRiskVariant = (level: number): "default" | "secondary" | "destructive" => {
    if (level <= 2) return 'secondary';
    if (level <= 3) return 'default';
    return 'destructive';
  };

  const getRiskLabel = (level: number) => {
    const labels = ['未知', '极低风险', '低风险', '中等风险', '高风险', '极高风险'];
    return labels[level] || labels[0];
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* 返回按钮 */}
        <Link
          href="/strategies"
          className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 mb-6 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          返回玩法库
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 主内容区 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 标题和基本信息卡片 */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <CardTitle className="text-3xl md:text-4xl">
                    {strategy.title}
                  </CardTitle>
                  <Badge variant={getRiskVariant(strategy.risk_level)} className="shrink-0">
                    {getRiskLabel(strategy.risk_level)}
                  </Badge>
                </div>
                <CardDescription className="text-base">
                  {strategy.summary}
                </CardDescription>

                {/* 交互按钮 */}
                <div className="pt-4">
                  <InteractionButtonsWrapper
                    contentId={strategy.id}
                    contentType="strategy"
                    initialViews={strategy.view_count || 0}
                    initialLikes={0}
                    initialBookmarks={strategy.bookmark_count || 0}
                  />
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* 关键指标网格 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* 预期收益 */}
                  <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <span className="text-xs text-green-700 dark:text-green-300 font-medium">
                        预期收益
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-green-800 dark:text-green-200">
                      {strategy.apy_min}-{strategy.apy_max}%
                    </div>
                    <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                      {strategy.apy_type || 'APY'}
                    </div>
                  </div>

                  {/* 风险等级 */}
                  <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                        风险等级
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                      {strategy.risk_level}/5
                    </div>
                    <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                      {getRiskLabel(strategy.risk_level)}
                    </div>
                  </div>

                  {/* 资金门槛 */}
                  <div className="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      <span className="text-xs text-purple-700 dark:text-purple-300 font-medium">
                        资金门槛
                      </span>
                    </div>
                    <div className="text-lg font-bold text-purple-800 dark:text-purple-200 line-clamp-2">
                      {strategy.threshold_capital}
                    </div>
                  </div>

                  {/* 时间投入 */}
                  <div className="bg-orange-50 dark:bg-orange-950 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                      <span className="text-xs text-orange-700 dark:text-orange-300 font-medium">
                        时间投入
                      </span>
                    </div>
                    <div className="text-sm font-bold text-orange-800 dark:text-orange-200 break-words line-clamp-3">
                      {strategy.time_commitment}
                    </div>
                  </div>
                </div>

                {/* 标签 */}
                {strategy.tags && strategy.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {strategy.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <Separator />

                {/* 发布日期 */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>发布于 {new Date(strategy.published_at).toLocaleDateString('zh-CN')}</span>
                </div>
              </CardContent>
            </Card>

            {/* 详细内容卡片 */}
            <Card>
              <CardHeader>
                <CardTitle>详细内容</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-lg max-w-none dark:prose-invert">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {strategy.content}
                  </ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 侧边栏 - 添加 sticky 定位 */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
            {/* 技术要求 - 滚动后隐藏 */}
            {!hasScrolled && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">技术要求</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">技术水平</span>
                      <Badge variant="outline">{strategy.threshold_tech_level || '初级'}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 相关链条 */}
            {strategy.chains && strategy.chains.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">支持链</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {strategy.chains.map((chain: string, index: number) => (
                      <div
                        key={index}
                        className="px-3 py-2 bg-muted rounded-md text-sm border"
                      >
                        {chain}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 相关协议 */}
            {strategy.protocols && strategy.protocols.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">涉及协议</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {strategy.protocols.map((protocol: string, index: number) => (
                      <div
                        key={index}
                        className="px-3 py-2 bg-muted rounded-md text-sm border"
                      >
                        {protocol}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 分享按钮 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">分享此策略</CardTitle>
                <CardDescription>
                  将这个策略分享给你的朋友
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ShareButton
                  title={strategy.title}
                  url={`/strategies/${strategy.slug}`}
                  description={strategy.summary}
                />
              </CardContent>
            </Card>

            {/* 风险提示 */}
            <Card className="border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  <CardTitle className="text-lg text-yellow-900 dark:text-yellow-100">
                    风险提示
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  加密货币投资存在高风险，可能导致全部本金损失。请确保充分了解相关风险，并根据自身情况谨慎决策。
                </p>
              </CardContent>
            </Card>

            {/* 内容免责声明 */}
            <Card className="border-slate-200 dark:border-slate-700">
              <CardContent className="pt-6">
                <p className="text-xs text-muted-foreground text-center">
                  本站内容均来自互联网公开信息整理。如有错误或侵权，请联系我们处理。内容仅供参考，不构成投资建议。
                </p>
              </CardContent>
            </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
