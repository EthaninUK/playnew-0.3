/**
 * 排行榜策略卡片组件
 * 展示策略在排行榜中的排名和关键指标
 */

import Link from 'next/link';
import { RankBadge } from './RankBadge';
import type { RankedStrategy } from '@/lib/leaderboard';

interface RankedStrategyCardProps {
  rankedStrategy: RankedStrategy;
  leaderboardType: 'trending' | 'top_apy' | 'beginner' | 'quick' | 'community' | 'editor';
}

export function RankedStrategyCard({ rankedStrategy, leaderboardType }: RankedStrategyCardProps) {
  const { rank, strategy, metrics } = rankedStrategy;

  // 根据排行榜类型显示不同的指标
  const renderMetrics = () => {
    switch (leaderboardType) {
      case 'trending':
        return (
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <span className="text-orange-500">🔥</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {metrics.hotnessScore?.toFixed(1) || 0}
              </span>
              <span className="text-slate-500 dark:text-slate-400">热度</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-blue-500">👁️</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {metrics.viewCount.toLocaleString()}
              </span>
              <span className="text-slate-500 dark:text-slate-400">浏览</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-purple-500">⭐</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {metrics.bookmarkCount}
              </span>
              <span className="text-slate-500 dark:text-slate-400">收藏</span>
            </div>
          </div>
        );

      case 'top_apy':
        return (
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <span className="text-green-500">💰</span>
              <span className="font-bold text-green-600 dark:text-green-400">
                {strategy.apy_min || 0}% - {strategy.apy_max || 0}%
              </span>
              <span className="text-slate-500 dark:text-slate-400">APY</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-amber-500">⚠️</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                风险 {strategy.risk_level}/5
              </span>
            </div>
            {strategy.threshold_capital_min && (
              <div className="flex items-center gap-1.5">
                <span className="text-blue-500">💼</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  ${strategy.threshold_capital_min.toLocaleString()}+
                </span>
              </div>
            )}
          </div>
        );

      case 'beginner':
        return (
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <span className="text-green-500">🎯</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                新手友好
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-blue-500">💼</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                ${strategy.threshold_capital_min || 0}+
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-amber-500">⚠️</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                风险 {strategy.risk_level}/5
              </span>
            </div>
          </div>
        );

      case 'quick':
        return (
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <span className="text-purple-500">⚡</span>
              <span className="font-bold text-purple-600 dark:text-purple-400">
                {strategy.time_commitment_minutes || 0} 分钟
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-blue-500">👁️</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {metrics.viewCount.toLocaleString()}
              </span>
              <span className="text-slate-500 dark:text-slate-400">浏览</span>
            </div>
          </div>
        );

      case 'community':
      case 'editor':
        return (
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <span className="text-purple-500">⭐</span>
              <span className="font-bold text-purple-600 dark:text-purple-400">
                {metrics.bookmarkCount}
              </span>
              <span className="text-slate-500 dark:text-slate-400">收藏</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-blue-500">👁️</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {metrics.viewCount.toLocaleString()}
              </span>
              <span className="text-slate-500 dark:text-slate-400">浏览</span>
            </div>
            {strategy.apy_max && (
              <div className="flex items-center gap-1.5">
                <span className="text-green-500">💰</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  最高 {strategy.apy_max}%
                </span>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // 获取分类图标
  const getCategoryIcon = () => {
    const categoryMap: Record<string, string> = {
      'airdrop-tasks': '🎁',
      'points-season': '⭐',
      'testnet': '🔬',
      'stablecoin-yield': '💰',
      'lending': '🏦',
      'amm': '🔄',
      'vault': '🏰',
    };
    return categoryMap[strategy.category] || '📁';
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300">
      {/* 背景渐变装饰 */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative p-6">
        <div className="flex gap-6">
          {/* 左侧: 排名徽章 */}
          <div className="flex-shrink-0">
            <RankBadge rank={rank} />
          </div>

          {/* 右侧: 策略信息 */}
          <div className="flex-1 min-w-0">
            {/* 分类标签 */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{getCategoryIcon()}</span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {strategy.category_l2 || strategy.category_l1}
              </span>
            </div>

            {/* 标题 */}
            <Link
              href={`/strategies/${strategy.slug}`}
              className="block group/title mb-3"
            >
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover/title:text-purple-600 dark:group-hover/title:text-purple-400 transition-colors line-clamp-2">
                {strategy.title}
              </h3>
            </Link>

            {/* 摘要 */}
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
              {strategy.summary}
            </p>

            {/* 指标 */}
            <div className="mb-4">
              {renderMetrics()}
            </div>

            {/* 操作按钮 */}
            <div className="flex items-center gap-3">
              <Link
                href={`/strategies/${strategy.slug}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
              >
                查看详情
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>

              <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                收藏
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Top 3 特殊边框光效 */}
      {rank <= 3 && (
        <div className="absolute inset-0 rounded-2xl pointer-events-none">
          <div className={`absolute inset-0 rounded-2xl border-2 ${
            rank === 1 ? 'border-yellow-400/30' :
            rank === 2 ? 'border-gray-400/30' :
            'border-orange-400/30'
          } animate-pulse`} />
        </div>
      )}
    </div>
  );
}
