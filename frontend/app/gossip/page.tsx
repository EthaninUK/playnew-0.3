import { getGossipNews, getGossipHotnessRanking, getTotalGossipCount } from '@/lib/directus';
import { GossipPageClient } from '@/components/gossip/GossipPageClient';

export const metadata = {
  title: '币圈八卦 - PlayNew.ai',
  description: '真假参半,吃瓜有风险,求证需谨慎 | 币圈最新八卦、传闻、内幕消息',
};

// Revalidate every 5 minutes
export const revalidate = 300;

export default async function GossipPage() {
  // Fetch gossip data and ranking
  const [gossipNews, hotnessRanking, totalCount] = await Promise.all([
    getGossipNews({ limit: -1, sortBy: 'hotness' }),  // Get all gossip data
    getGossipHotnessRanking(10),
    getTotalGossipCount(),
  ]);

  return (
    <GossipPageClient
      initialGossip={gossipNews}
      hotnessRanking={hotnessRanking}
      totalCount={totalCount}
    />
  );
}
