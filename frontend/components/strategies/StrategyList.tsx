import { Strategy } from '@/lib/directus';
import { StrategyCard } from './StrategyCard';

interface StrategyListProps {
  strategies: Strategy[];
}

export function StrategyList({ strategies }: StrategyListProps) {
  if (!strategies || strategies.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">暂无玩法数据</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {strategies.map((strategy) => (
        <StrategyCard key={strategy.id} strategy={strategy} />
      ))}
    </div>
  );
}
