import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getStrategyById, getNewsItem } from '@/lib/directus';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  User,
  Mail,
  Calendar,
  Heart,
  Bookmark,
  Eye,
  TrendingUp,
  Award,
  ChevronRight,
} from 'lucide-react';

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  // 获取用户资料
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // 获取用户交互统计
  const { data: interactions } = await supabase
    .from('user_interactions')
    .select('action')
    .eq('user_id', user.id);

  const stats = {
    likes: interactions?.filter(i => i.action === 'like').length || 0,
    bookmarks: interactions?.filter(i => i.action === 'favorite').length || 0,
    views: interactions?.filter(i => i.action === 'view').length || 0,
  };

  // 获取收藏的策略 IDs
  const { data: favoriteStrategyIds } = await supabase
    .from('user_interactions')
    .select('content_id, content_type, created_at')
    .eq('user_id', user.id)
    .eq('content_type', 'strategy')
    .eq('action', 'favorite')
    .order('created_at', { ascending: false })
    .limit(5);

  // 获取收藏的资讯 IDs
  const { data: favoriteNewsIds } = await supabase
    .from('user_interactions')
    .select('content_id, content_type, created_at')
    .eq('user_id', user.id)
    .eq('content_type', 'news')
    .eq('action', 'favorite')
    .order('created_at', { ascending: false })
    .limit(5);

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

  const favoriteStrategies = strategies.filter(Boolean);

  // 从 Directus 获取完整的资讯信息
  const newsItems = await Promise.all(
    (favoriteNewsIds || []).map(async (fav) => {
      try {
        const newsItem = await getNewsItem(fav.content_id);
        return newsItem ? { ...newsItem, favorited_at: fav.created_at } : null;
      } catch (error) {
        return null;
      }
    })
  );

  const favoriteNews = newsItems.filter(Boolean);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* 用户信息卡片 */}
          <Card>
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                    {profile?.username?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                  {profile?.level && profile.level > 1 && (
                    <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md flex items-center gap-1">
                      <Award className="h-3 w-3" />
                      Lv.{profile.level}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-2xl mb-2">
                    {profile?.username || '未设置用户名'}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {profile?.bio || '这个人很懒，什么都没写...'}
                  </CardDescription>
                  <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Mail className="h-4 w-4" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      <span>加入于 {formatDate(user.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* 统计卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">点赞</CardTitle>
                  <Heart className="h-5 w-5 text-red-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.likes}</div>
                <p className="text-sm text-muted-foreground mt-1">
                  总计点赞数
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">收藏</CardTitle>
                  <Bookmark className="h-5 w-5 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.bookmarks}</div>
                <p className="text-sm text-muted-foreground mt-1">
                  总计收藏数
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">浏览</CardTitle>
                  <Eye className="h-5 w-5 text-purple-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.views}</div>
                <p className="text-sm text-muted-foreground mt-1">
                  总计浏览数
                </p>
              </CardContent>
            </Card>
          </div>

          {/* 用户活动 */}
          <Card>
            <CardHeader>
              <CardTitle>我的活动</CardTitle>
              <CardDescription>
                查看你最近的收藏和互动
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="strategies" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="strategies">收藏的玩法</TabsTrigger>
                  <TabsTrigger value="news">收藏的资讯</TabsTrigger>
                </TabsList>

                <TabsContent value="strategies" className="space-y-4 mt-6">
                  {favoriteStrategies && favoriteStrategies.length > 0 ? (
                    <div className="space-y-3">
                      {favoriteStrategies.map((strategy: any) => (
                        <Link
                          key={strategy.id}
                          href={`/strategies/${strategy.slug}`}
                          className="block"
                        >
                          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted hover:border-purple-500 transition-all border border-transparent">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <TrendingUp className="h-5 w-5 text-green-600 shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium hover:text-purple-600 transition-colors truncate">
                                  {strategy.title}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  收藏于 {formatDate(strategy.favorited_at)}
                                </p>
                              </div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Bookmark className="h-12 w-12 mx-auto mb-4 opacity-20" />
                      <p>还没有收藏任何玩法</p>
                      <p className="text-sm mt-2">去 <Link href="/strategies" className="text-primary hover:underline">玩法库</Link> 发现感兴趣的内容吧</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="news" className="space-y-4 mt-6">
                  {favoriteNews && favoriteNews.length > 0 ? (
                    <div className="space-y-3">
                      {favoriteNews.map((newsItem: any) => (
                        <Link
                          key={newsItem.id}
                          href={`/news/${newsItem.id}`}
                          className="block"
                        >
                          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted hover:border-blue-500 transition-all border border-transparent">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <TrendingUp className="h-5 w-5 text-blue-600 shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium hover:text-blue-600 transition-colors truncate">
                                  {newsItem.title}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  收藏于 {formatDate(newsItem.favorited_at)}
                                </p>
                              </div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Bookmark className="h-12 w-12 mx-auto mb-4 opacity-20" />
                      <p>还没有收藏任何资讯</p>
                      <p className="text-sm mt-2">去 <Link href="/news" className="text-primary hover:underline">资讯雷达</Link> 发现感兴趣的内容吧</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
