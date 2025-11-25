/**
 * 排名徽章组件
 * 显示排行榜位置,前三名有特殊样式(金银铜)
 */

interface RankBadgeProps {
  rank: number;
}

export function RankBadge({ rank }: RankBadgeProps) {
  // Top 3 特殊徽章
  if (rank === 1) {
    return (
      <div className="relative">
        {/* 金色光晕 */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-2xl blur-xl opacity-60 animate-pulse" />

        {/* 金牌徽章 */}
        <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-300 via-yellow-400 to-amber-500 shadow-2xl shadow-yellow-500/50 transform hover:scale-110 transition-transform duration-300">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-black text-white drop-shadow-lg">1</span>
            <span className="text-xs font-bold text-yellow-100">🥇</span>
          </div>
        </div>
      </div>
    );
  }

  if (rank === 2) {
    return (
      <div className="relative">
        {/* 银色光晕 */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-500 rounded-2xl blur-xl opacity-50 animate-pulse" />

        {/* 银牌徽章 */}
        <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 shadow-2xl shadow-gray-400/50 transform hover:scale-110 transition-transform duration-300">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-black text-gray-700 drop-shadow-lg">2</span>
            <span className="text-xs font-bold text-gray-600">🥈</span>
          </div>
        </div>
      </div>
    );
  }

  if (rank === 3) {
    return (
      <div className="relative">
        {/* 铜色光晕 */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-amber-700 rounded-2xl blur-xl opacity-50 animate-pulse" />

        {/* 铜牌徽章 */}
        <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-300 via-amber-400 to-amber-600 shadow-2xl shadow-orange-500/50 transform hover:scale-110 transition-transform duration-300">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-black text-white drop-shadow-lg">3</span>
            <span className="text-xs font-bold text-orange-100">🥉</span>
          </div>
        </div>
      </div>
    );
  }

  // 4-10名: 紫色边框徽章
  if (rank <= 10) {
    return (
      <div className="flex items-center justify-center w-14 h-14 rounded-xl border-2 border-purple-500/50 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 shadow-lg hover:shadow-purple-500/30 transition-shadow">
        <span className="text-2xl font-bold bg-gradient-to-br from-purple-600 to-purple-800 bg-clip-text text-transparent">
          {rank}
        </span>
      </div>
    );
  }

  // 11+名: 简洁灰色
  return (
    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
      <span className="text-xl font-semibold text-slate-600 dark:text-slate-400">
        {rank}
      </span>
    </div>
  );
}
