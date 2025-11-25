import { notFound } from 'next/navigation';
import { getNewsItem, getNews } from '@/lib/directus';
import { NewsDetailClient } from './NewsDetailClient';

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

  return <NewsDetailClient newsItem={newsItem} />;
}
