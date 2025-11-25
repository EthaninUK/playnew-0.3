import { getNews, getTotalNewsCount } from '@/lib/directus';
import { NewsPageClient } from '@/components/news/NewsPageClient';

export const metadata = {
  title: '快讯中心 - PlayNew.ai',
  description: '实时追踪币圈最新资讯、项目动态和市场趋势 | 新鲜八卦热议话题',
};

// Revalidate every 2 minutes (120 seconds) - news updates frequently
export const revalidate = 120;

export default async function NewsPage() {
  // Fetch only realtime news with reasonable limit for initial load
  // Client-side will handle pagination
  const [realtimeNews, totalCount] = await Promise.all([
    getNews({ limit: 50, newsType: 'realtime' }), // Fetch first 50 for initial page load
    getTotalNewsCount('realtime'),
  ]);

  return (
    <NewsPageClient
      initialNews={realtimeNews}
      totalCount={totalCount}
    />
  );
}
