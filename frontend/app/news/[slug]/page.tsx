import { notFound } from 'next/navigation';
import { getNewsItem, getNews } from '@/lib/directus';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { InteractionButtonsWrapper } from '@/components/shared/InteractionButtonsWrapper';
import { Clock, ExternalLink, Calendar } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const newsItem = await getNewsItem(slug);

  if (!newsItem) {
    return {
      title: '资讯未找到',
    };
  }

  return {
    title: `${newsItem.title} - 资讯雷达`,
    description: newsItem.ai_summary || newsItem.title,
  };
}

export async function generateStaticParams() {
  const news = await getNews({ limit: 100 });
  return news.map((item) => ({
    slug: item.id,
  }));
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const newsItem = await getNewsItem(slug);

  if (!newsItem) {
    notFound();
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
        <div className="max-w-4xl mx-auto">
          {/* 主内容卡片 */}
          <Card>
            <CardHeader>
              <div className="space-y-4">
                {/* 分类标签 */}
                {newsItem.category && (
                  <Badge className={getCategoryColor(newsItem.category)}>
                    {newsItem.category}
                  </Badge>
                )}

                {/* 标题 */}
                <CardTitle className="text-3xl md:text-4xl leading-tight">
                  {newsItem.title}
                </CardTitle>

                {/* 摘要 */}
                {newsItem.ai_summary && (
                  <p className="text-lg text-muted-foreground">
                    {newsItem.ai_summary}
                  </p>
                )}

                {/* 元信息 */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  {/* 发布时间 */}
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(newsItem.published_at || newsItem.created_at)}</span>
                  </div>

                  {/* 来源 */}
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

                {/* 交互按钮 */}
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
              {/* 正文内容 */}
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {newsItem.content}
                </ReactMarkdown>
              </div>

              {/* 原文链接 */}
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

          {/* 评论区 - 暂时禁用 */}
          {/* <Card className="mt-6">
            <CardHeader>
              <CardTitle>讨论与评论</CardTitle>
              <CardDescription>
                分享你的看法和观点
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Comments
                identifier={`news-${newsItem.id}`}
                title={newsItem.title}
              />
            </CardContent>
          </Card> */}
        </div>
      </div>
    </div>
  );
}
