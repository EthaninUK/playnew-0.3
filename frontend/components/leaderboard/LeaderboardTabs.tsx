/**
 * 排行榜标签切换组件
 * 6个榜单类型的Tab切换
 */

'use client';

import type { LeaderboardType } from '@/lib/leaderboard';

interface LeaderboardTabsProps {
  activeTab: LeaderboardType;
  onTabChange: (tab: LeaderboardType) => void;
}

const TABS = [
  {
    id: 'trending' as LeaderboardType,
    label: '热度榜',
    icon: '🔥',
    description: '最受欢迎',
  },
  {
    id: 'top_apy' as LeaderboardType,
    label: '收益榜',
    icon: '💰',
    description: '高收益',
  },
  {
    id: 'beginner' as LeaderboardType,
    label: '新人榜',
    icon: '🎯',
    description: '新手友好',
  },
  {
    id: 'quick' as LeaderboardType,
    label: '快速榜',
    icon: '⚡',
    description: '快速上手',
  },
  {
    id: 'community' as LeaderboardType,
    label: '社区榜',
    icon: '⭐',
    description: '用户推荐',
  },
  {
    id: 'editor' as LeaderboardType,
    label: '精选榜',
    icon: '✨',
    description: '编辑精选',
  },
];

export function LeaderboardTabs({ activeTab, onTabChange }: LeaderboardTabsProps) {
  return (
    <div className="border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* 移动端: 横向滚动 */}
        <div className="flex overflow-x-auto scrollbar-hide gap-2 py-4 md:justify-center">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  relative flex-shrink-0 group px-6 py-3 rounded-xl font-semibold transition-all duration-300
                  ${isActive
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }
                `}
              >
                {/* 图标和文字 */}
                <div className="flex items-center gap-2">
                  <span className="text-lg">{tab.icon}</span>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-bold whitespace-nowrap">{tab.label}</span>
                    <span className={`text-xs ${isActive ? 'text-purple-100' : 'text-slate-500 dark:text-slate-500'}`}>
                      {tab.description}
                    </span>
                  </div>
                </div>

                {/* 激活指示器 */}
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-white rounded-full" />
                )}

                {/* Hover光效 */}
                {!isActive && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600/0 via-purple-600/5 to-pink-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
