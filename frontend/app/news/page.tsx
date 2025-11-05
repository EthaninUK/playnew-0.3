import { getNews, getTotalNewsCount } from '@/lib/directus';
import { NewsPageClient } from '@/components/news/NewsPageClient';

export const metadata = {
  title: '快讯中心 - PlayNew.ai',
  description: '实时追踪币圈最新资讯、项目动态和市场趋势 | 新鲜八卦热议话题',
};

// Revalidate every 5 minutes (300 seconds)
export const revalidate = 300;

export default async function NewsPage() {
  // Fetch both types of news and total count
  const [realtimeNews, gossipNews, totalCount] = await Promise.all([
    getNews({ limit: -1, newsType: 'realtime' }), // Fetch all news
    getNews({ limit: 20, newsType: 'gossip' }),
    getTotalNewsCount('realtime'),
  ]);

  return (
    <NewsPageClient
      initialNews={realtimeNews}
      gossipNews={gossipNews}
      totalCount={totalCount}
    />
  );
}
