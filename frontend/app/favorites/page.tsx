import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getStrategyById, getNewsItem } from '@/lib/directus';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Bookmark,
  TrendingUp,
  Newspaper,
  Calendar,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export const metadata = {
  title: '我的收藏 - PlayNew.ai',
  description: '查看你收藏的所有玩法和资讯',
};

export default async function FavoritesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  // 获取收藏的策略 IDs
  const { data: favoriteStrategyIds } = await supabase
    .from('user_interactions')
    .select('content_id, created_at')
    .eq('user_id', user.id)
    .eq('content_type', 'strategy')
    .eq('action', 'favorite')
    .order('created_at', { ascending: false });

  // 获取收藏的资讯 IDs
  const { data: favoriteNewsIds } = await supabase
    .from('user_interactions')
    .select('content_id, created_at')
    .eq('user_id', user.id)
    .eq('content_type', 'news')
    .eq('action', 'favorite')
    .order('created_at', { ascending: false });

  // 从 Directus 获取完整的策略信息
  const strategies = await Promise.all(
    (favoriteStrategyIds || []).map(async (fav) => {
      try {
        const strategy = await getStrategyById(fav.content_id);
        return strategy ? { ...strategy, favorited_at: fav.created_at } : null;
      } catch (error) {
        return null;
      }
    })
  );

  const validStrategies = strategies.filter(Boolean);

  // 从 Directus 获取完整的资讯信息
  const news = await Promise.all(
    (favoriteNewsIds || []).map(async (fav) => {
      try {
        const newsItem = await getNewsItem(fav.content_id);
        return newsItem ? { ...newsItem, favorited_at: fav.created_at } : null;
      } catch (error) {
        return null;
      }
    })
  );

  const validNews = news.filter(Boolean);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getRiskLabel = (level: number) => {
    const labels = ['未知', '极低', '低', '中', '高', '极高'];
    return labels[level] || labels[0];
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-background border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/" className="hover:text-foreground transition-colors">
              首页
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium">我的收藏</span>
          </div>
          <div className="flex items-center gap-3">
            <Bookmark className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold">我的收藏</h1>
              <p className="text-muted-foreground mt-1">
                你收藏的 {validStrategies.length} 个玩法和 {validNews.length} 条资讯
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <Tabs defaultValue="strategies" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="strategies" className="gap-2">
                  <TrendingUp className="h-4 w-4" />
                  玩法 ({validStrategies.length})
                </TabsTrigger>
                <TabsTrigger value="news" className="gap-2">
                  <Newspaper className="h-4 w-4" />
                  资讯 ({validNews.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="strategies" className="mt-6">
                {validStrategies.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2">
                    {validStrategies.map((strategy: any) => (
                      <Link
                        key={strategy.id}
                        href={`/strategies/${strategy.slug}`}
                        className="block group"
                      >
                        <Card className="h-full hover:shadow-lg transition-all duration-300 hover:border-purple-500">
                          <CardHeader>
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <CardTitle className="text-xl group-hover:text-purple-600 transition-colors line-clamp-2">
                                {strategy.title}
                              </CardTitle>
                              <Badge variant="outline">
                                {getRiskLabel(strategy.risk_level)}风险
                              </Badge>
                            </div>
                            <CardDescription className="line-clamp-2">
                              {strategy.summary}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">预期收益</span>
                                <span className="font-semibold text-green-600">
                                  {strategy.apy_min}-{strategy.apy_max}%
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">收藏于</span>
                                <span className="font-medium">
                                  {formatDate(strategy.favorited_at)}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 text-muted-foreground">
                    <Bookmark className="h-16 w-16 mx-auto mb-4 opacity-20" />
                    <p className="text-lg font-medium">还没有收藏任何玩法</p>
                    <p className="text-sm mt-2">
                      去{' '}
                      <Link href="/strategies" className="text-primary hover:underline">
                        玩法库
                      </Link>{' '}
                      发现感兴趣的内容吧
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="news" className="mt-6">
                {validNews.length > 0 ? (
                  <div className="space-y-4">
                    {validNews.map((newsItem: any) => (
                      <Link
                        key={newsItem.id}
                        href={`/news/${newsItem.id}`}
                        className="block group"
                      >
                        <Card className="hover:shadow-lg transition-all duration-300 hover:border-blue-500">
                          <CardHeader>
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  {newsItem.category && (
                                    <Badge variant="secondary">
                                      {newsItem.category}
                                    </Badge>
                                  )}
                                  <span className="text-sm text-muted-foreground">
                                    {formatDate(newsItem.published_at || newsItem.created_at)}
                                  </span>
                                </div>
                                <CardTitle className="text-xl group-hover:text-blue-600 transition-colors line-clamp-2">
                                  {newsItem.title}
                                </CardTitle>
                                {newsItem.ai_summary && (
                                  <CardDescription className="line-clamp-2 mt-2">
                                    {newsItem.ai_summary}
                                  </CardDescription>
                                )}
                              </div>
                              {newsItem.url && (
                                <ExternalLink className="h-5 w-5 text-muted-foreground shrink-0" />
                              )}
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              {newsItem.source && (
                                <span>来源: {newsItem.source}</span>
                              )}
                              <span>•</span>
                              <span>收藏于 {formatDate(newsItem.favorited_at)}</span>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 text-muted-foreground">
                    <Bookmark className="h-16 w-16 mx-auto mb-4 opacity-20" />
                    <p className="text-lg font-medium">还没有收藏任何资讯</p>
                    <p className="text-sm mt-2">
                      去{' '}
                      <Link href="/news" className="text-primary hover:underline">
                        资讯雷达
                      </Link>{' '}
                      发现感兴趣的内容吧
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
