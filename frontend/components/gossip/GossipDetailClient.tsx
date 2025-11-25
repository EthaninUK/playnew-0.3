'use client';

import { useState } from 'react';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { LoginRequired } from '@/components/auth/LoginRequired';
import { News } from '@/lib/directus';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  Flame,
  ThumbsUp,
  MessageCircle,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  TrendingUp,
  AlertTriangle,
  Shield,
  Eye,
  Share2,
  Bookmark,
  ChevronLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface GossipDetailClientProps {
  gossip: News;
}

// 求证状态配置
const VERIFICATION_STATUS_CONFIG = {
  unverified: {
    label: '未求证',
    color: 'slate',
    icon: Clock,
    bgClass: 'bg-slate-100 dark:bg-slate-800',
    textClass: 'text-slate-700 dark:text-slate-300',
    description: '该消息尚未经过验证，真实性未知',
  },
  verifying: {
    label: '求证中',
    color: 'blue',
    icon: Search,
    bgClass: 'bg-blue-100 dark:bg-blue-900/30',
    textClass: 'text-blue-700 dark:text-blue-300',
    description: '正在核实消息来源和真实性',
  },
  confirmed: {
    label: '已确认',
    color: 'green',
    icon: CheckCircle2,
    bgClass: 'bg-green-100 dark:bg-green-900/30',
    textClass: 'text-green-700 dark:text-green-300',
    description: '消息已被多方证实为真',
  },
  debunked: {
    label: '已辟谣',
    color: 'red',
    icon: XCircle,
    bgClass: 'bg-red-100 dark:bg-red-900/30',
    textClass: 'text-red-700 dark:text-red-300',
    description: '消息已被证实为虚假信息',
  },
};

export function GossipDetailClient({ gossip }: GossipDetailClientProps) {
  const { isAuthorized, loading } = useAuthGuard();
  const [likes, setLikes] = useState(gossip.likes_count || 0);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasBookmarked, setHasBookmarked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  // 加载中显示骨架屏
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">加载中...</div>
      </div>
    );
  }

  // 未登录显示登录提示
  if (!isAuthorized) {
    return (
      <LoginRequired
        title="查看八卦详情需要登录"
        description="注册后即可免费查看全站所有八卦内容"
      />
    );
  }

  const credibility = gossip.credibility_score || 50;
  const hotness = gossip.hotness_score || 0;
  const verificationStatus = gossip.verification_status || 'unverified';
  const statusConfig = VERIFICATION_STATUS_CONFIG[verificationStatus];
  const StatusIcon = statusConfig.icon;

  // 处理点赞
  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);

    const wasLiked = hasLiked;
    const previousLikes = likes;

    if (hasLiked) {
      setLikes(prev => prev - 1);
      setHasLiked(false);
    } else {
      setLikes(prev => prev + 1);
      setHasLiked(true);
    }

    try {
      const response = await fetch('/api/gossip/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newsId: gossip.id }),
      });

      if (!response.ok) throw new Error('Failed to toggle like');
      const data = await response.json();
      setLikes(data.likes_count);
      setHasLiked(data.liked);
    } catch (error) {
      console.error('Failed to toggle like:', error);
      setLikes(previousLikes);
      setHasLiked(wasLiked);
    } finally {
      setIsLiking(false);
    }
  };

  // 处理收藏
  const handleBookmark = () => {
    setHasBookmarked(!hasBookmarked);
    // TODO: 实现收藏API
  };

  // 处理分享
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: gossip.title,
          text: gossip.ai_summary || '',
          url: window.location.href,
        });
      } catch (error) {
        console.error('Share failed:', error);
      }
    }
  };

  // 可信度等级
  const getCredibilityLevel = (score: number) => {
    if (score >= 80) return { label: '高度可信', color: 'text-green-600 dark:text-green-400', icon: Shield };
    if (score >= 60) return { label: '部分可信', color: 'text-yellow-600 dark:text-yellow-400', icon: AlertTriangle };
    return { label: '低可信度', color: 'text-red-600 dark:text-red-400', icon: AlertTriangle };
  };

  const credibilityLevel = getCredibilityLevel(credibility);
  const CredibilityIcon = credibilityLevel.icon;

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-pink-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 返回按钮 */}
        <Link
          href="/gossip"
          className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 mb-6 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          返回八卦列表
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 主内容区 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 主卡片 */}
            <Card className="border-2 border-orange-200 dark:border-orange-900/30 overflow-hidden">
              {/* 热度条 */}
              {hotness > 70 && (
                <div className="bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 px-4 py-2">
                  <div className="flex items-center justify-center gap-2 text-white">
                    <Flame className="h-4 w-4" />
                    <span className="text-sm font-bold">🔥 超级热门八卦</span>
                    <Flame className="h-4 w-4" />
                  </div>
                </div>
              )}

              <CardHeader className="space-y-6">
                {/* 顶部徽章 */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* 热度徽章 */}
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-orange-100 to-pink-100 dark:from-orange-900/30 dark:to-pink-900/30 border border-orange-300 dark:border-orange-700">
                    <Flame className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    <span className="text-sm font-bold text-orange-700 dark:text-orange-400">
                      热度 {hotness}
                    </span>
                  </div>

                  {/* 求证状态 */}
                  <Badge className={cn(
                    "px-3 py-1.5",
                    statusConfig.bgClass,
                    statusConfig.textClass
                  )}>
                    <StatusIcon className="h-4 w-4 mr-1.5" />
                    {statusConfig.label}
                  </Badge>

                  {/* 八卦标签 */}
                  {gossip.gossip_tags && gossip.gossip_tags.length > 0 && (
                    gossip.gossip_tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="px-3 py-1.5">
                        #{tag}
                      </Badge>
                    ))
                  )}
                </div>

                {/* 标题 */}
                <h1 className="text-3xl md:text-4xl font-black leading-tight text-slate-900 dark:text-white">
                  {gossip.title}
                </h1>

                {/* AI摘要 */}
                {gossip.ai_summary && (
                  <div className="p-4 rounded-xl bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800/50 dark:to-blue-900/20 border border-slate-200 dark:border-slate-700">
                    <div className="flex gap-3">
                      <div className="shrink-0">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                          💬
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                          AI 提炼摘要
                        </p>
                        <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                          {gossip.ai_summary}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 元信息 */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                  {gossip.content_published_at && (
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      <span>{formatDate(gossip.content_published_at)}</span>
                    </div>
                  )}
                  {gossip.source && (
                    <div className="flex items-center gap-1.5">
                      <span>来源: {gossip.source}</span>
                      {gossip.url && (
                        <a
                          href={gossip.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <Eye className="h-4 w-4" />
                    <span>{(gossip as any).view_count || 0} 次浏览</span>
                  </div>
                </div>

                {/* 互动按钮组 */}
                <div className="flex items-center gap-3 pt-2">
                  <Button
                    size="lg"
                    onClick={handleLike}
                    disabled={isLiking}
                    className={cn(
                      "flex-1 rounded-xl transition-all font-semibold",
                      hasLiked
                        ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-900/40"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                    )}
                  >
                    <ThumbsUp className={cn("h-5 w-5 mr-2", hasLiked && "fill-current")} />
                    {likes}
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    className="flex-1 rounded-xl font-semibold"
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    {gossip.comments_count || 0}
                  </Button>

                  <Button
                    size="lg"
                    onClick={handleBookmark}
                    variant="outline"
                    className={cn(
                      "rounded-xl",
                      hasBookmarked && "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                    )}
                  >
                    <Bookmark className={cn("h-5 w-5", hasBookmarked && "fill-current")} />
                  </Button>

                  <Button
                    size="lg"
                    onClick={handleShare}
                    variant="outline"
                    className="rounded-xl"
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>

              <Separator />

              <CardContent className="pt-6">
                {/* 正文内容 */}
                <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-orange-600 dark:prose-a:text-orange-400 prose-strong:text-slate-900 dark:prose-strong:text-white">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {gossip.content}
                  </ReactMarkdown>
                </div>

                {/* 原文链接 */}
                {gossip.url && (
                  <div className="mt-8 p-4 rounded-xl bg-gradient-to-r from-slate-50 to-orange-50 dark:from-slate-800 dark:to-orange-900/20 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        查看原文消息来源
                      </span>
                      <a
                        href={gossip.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm font-medium text-orange-600 dark:text-orange-400 hover:underline"
                      >
                        {gossip.source || '访问链接'}
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 求证提醒卡片 */}
            <Card className="border-orange-200 dark:border-orange-900/30 bg-gradient-to-br from-orange-50/50 to-pink-50/50 dark:from-orange-950/20 dark:to-pink-950/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="shrink-0">
                    <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                      <AlertTriangle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                      ⚠️ 吃瓜需谨慎
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                      本站八卦内容来源于互联网公开信息，仅供娱乐和参考。内容真实性未经完全核实，建议保持理性判断，不要盲目相信传言。如需做出重要决策，请务必寻找官方渠道进行验证。
                    </p>
                    <Button
                      size="sm"
                      className="bg-orange-600 hover:bg-orange-700 text-white rounded-lg"
                    >
                      <Search className="h-4 w-4 mr-2" />
                      我要求证
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 侧边栏 */}
          <div className="space-y-6">
            {/* 可信度评估卡片 */}
            <Card className="border-2 border-orange-200 dark:border-orange-900/30 sticky top-24">
              <CardHeader>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <CredibilityIcon className={cn("h-5 w-5", credibilityLevel.color)} />
                  可信度评估
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 可信度进度条 */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      综合评分
                    </span>
                    <span className={cn("text-2xl font-black", credibilityLevel.color)}>
                      {credibility}%
                    </span>
                  </div>
                  <Progress
                    value={credibility}
                    className="h-3 bg-slate-200 dark:bg-slate-800"
                    indicatorClassName={cn(
                      credibility >= 80
                        ? 'bg-green-500'
                        : credibility >= 60
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    )}
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {credibilityLevel.label}
                  </p>
                </div>

                <Separator />

                {/* 求证状态说明 */}
                <div className={cn(
                  "p-3 rounded-lg",
                  statusConfig.bgClass
                )}>
                  <div className="flex items-start gap-2">
                    <StatusIcon className={cn("h-5 w-5 mt-0.5", statusConfig.textClass)} />
                    <div>
                      <p className={cn("text-sm font-semibold mb-1", statusConfig.textClass)}>
                        {statusConfig.label}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {statusConfig.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 评估维度 */}
                <div className="space-y-3 pt-2">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                    评估维度
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-400">来源可信度</span>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            className={cn(
                              "w-3 h-3 rounded-sm",
                              i <= Math.ceil(credibility / 20)
                                ? "bg-orange-500"
                                : "bg-slate-200 dark:bg-slate-700"
                            )}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-400">内容完整性</span>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            className={cn(
                              "w-3 h-3 rounded-sm",
                              i <= 4 ? "bg-orange-500" : "bg-slate-200 dark:bg-slate-700"
                            )}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-400">时效性</span>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            className={cn(
                              "w-3 h-3 rounded-sm",
                              i <= 5 ? "bg-orange-500" : "bg-slate-200 dark:bg-slate-700"
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 热门讨论 */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  热门讨论
                </h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">
                  评论功能即将上线...
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
