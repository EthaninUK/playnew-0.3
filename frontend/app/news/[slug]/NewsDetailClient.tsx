'use client';

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
import { Clock, ExternalLink, Calendar, ChevronLeft, AlertTriangle } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  ai_summary?: string;
  content: string;
  category?: string;
  source?: string;
  url?: string;
  published_at?: string;
  created_at: string;
}

interface NewsDetailClientProps {
  newsItem: NewsItem;
}

export function NewsDetailClient({ newsItem }: NewsDetailClientProps) {
  const { isAuthorized, loading } = useAuthGuard();

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">加载中...</div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <LoginRequired
        title="查看资讯详情需要登录"
        description="注册后即可免费查看全站所有资讯内容"
      />
    );
  }

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

  const getCategoryColor = (category?: string) => {
    const colors: Record<string, string> = {
      'market': 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
      'defi': 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300',
      'nft': 'bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-300',
      'regulation': 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300',
      'tech': 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300',
    };
    return category ? (colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300') : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 mb-6 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          返回快讯列表
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 主内容区 */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="space-y-4">
                  {newsItem.category && (
                    <Badge className={getCategoryColor(newsItem.category)}>
                      {newsItem.category}
                    </Badge>
                  )}

                  <CardTitle className="text-3xl md:text-4xl leading-tight">
                    {newsItem.title}
                  </CardTitle>

                  {newsItem.ai_summary && (
                    <p className="text-lg text-muted-foreground">
                      {newsItem.ai_summary}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(newsItem.published_at || newsItem.created_at)}</span>
                    </div>

                    {newsItem.source && (
                      <div className="flex items-center gap-1.5">
                        <span>来源: {newsItem.source}</span>
                        {newsItem.url && (
                          <a
                            href={newsItem.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-primary transition-colors"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="pt-2">
                    <InteractionButtonsWrapper
                      contentId={newsItem.id}
                      contentType="news"
                      initialLikes={0}
                      initialBookmarks={0}
                    />
                  </div>
                </div>
              </CardHeader>

              <Separator />

              <CardContent className="pt-6">
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {newsItem.content}
                  </ReactMarkdown>
                </div>

                {newsItem.url && (
                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">查看原文</span>
                      <a
                        href={newsItem.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-primary hover:underline"
                      >
                        {newsItem.source || '访问链接'}
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 侧边栏 - Sticky 定位 */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* 分享快讯 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">分享此快讯</CardTitle>
                  <CardDescription>
                    将这条快讯分享给你的朋友
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ShareButton
                    title={newsItem.title}
                    url={`/news/${newsItem.id}`}
                    description={newsItem.ai_summary || newsItem.title}
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
