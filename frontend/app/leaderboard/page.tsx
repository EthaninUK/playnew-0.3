import { Metadata } from 'next';
import { LeaderboardClient } from '@/components/leaderboard/LeaderboardClient';

export const metadata: Metadata = {
  title: '玩法排行榜 - PlayNew.ai',
  description: '探索最热门、收益最高、最适合新手的Web3投资策略排行榜',
};

// Enable ISR with 60 second revalidation
export const revalidate = 60;

export default function LeaderboardPage() {
  return <LeaderboardClient />;
}
