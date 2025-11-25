import { notFound } from 'next/navigation';
import { getStrategy, getStrategies } from '@/lib/directus';
import { StrategyDetailClient } from './StrategyDetailClient';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const strategy = await getStrategy(slug);

  if (!strategy) {
    return {
      title: '策略未找到',
    };
  }

  return {
    title: `${strategy.title} - 币圈玩法收集录`,
    description: strategy.summary,
  };
}

// 生成静态参数
export async function generateStaticParams() {
  const result = await getStrategies({ limit: 100 });
  return result.strategies.map((strategy) => ({
    slug: strategy.slug,
  }));
}

export default async function StrategyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const strategy = await getStrategy(slug);

  if (!strategy) {
    notFound();
  }

  return <StrategyDetailClient strategy={strategy} />;
}
