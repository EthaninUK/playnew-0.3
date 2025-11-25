import { notFound } from 'next/navigation';
import { getNewsItem, getGossipNews } from '@/lib/directus';
import { GossipDetailClient } from '@/components/gossip/GossipDetailClient';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const gossipItem = await getNewsItem(slug);

  if (!gossipItem) {
    return {
      title: '八卦未找到',
    };
  }

  return {
    title: `${gossipItem.title} - 币圈八卦`,
    description: gossipItem.ai_summary || gossipItem.title,
  };
}

export async function generateStaticParams() {
  const gossipNews = await getGossipNews({ limit: 100 });
  return gossipNews.map((item) => ({
    slug: item.id,
  }));
}

// Revalidate every 5 minutes
export const revalidate = 300;

export default async function GossipDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const gossipItem = await getNewsItem(slug);

  if (!gossipItem) {
    notFound();
  }

  return <GossipDetailClient gossip={gossipItem} />;
}
