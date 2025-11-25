/**
 * 排行榜客户端主组件
 * 管理状态、数据获取和页面布局
 */

'use client';

import { useState, useEffect } from 'react';
import { LeaderboardTabs } from './LeaderboardTabs';
import { RankedStrategyCard } from './RankedStrategyCard';
import type { LeaderboardType, RankedStrategy } from '@/lib/leaderboard';

export function LeaderboardClient() {
  const [activeTab, setActiveTab] = useState<LeaderboardType>('trending');
  const [data, setData] = useState<RankedStrategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 风险等级筛选 (仅收益榜使用)
  const [riskLevel, setRiskLevel] = useState<'all' | 'low' | 'medium' | 'high'>('all');

  // 获取排行榜数据
  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          type: activeTab,
          limit: '20',
        });

        // 收益榜添加风险等级参数
        if (activeTab === 'top_apy') {
          params.append('risk', riskLevel);
        }

        const response = await fetch(`/api/leaderboard?${params.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard');
        }

        const result = await response.json();
        setData(result.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [activeTab, riskLevel]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* 页面头部 - 超炫酷科技风 */}
      <div className="relative overflow-hidden border-b bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 dark:from-indigo-500/10 dark:via-purple-500/10 dark:to-pink-500/10">
        {/* 动态背景层 */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-600/20 via-transparent to-transparent animate-pulse" />
        <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800 [mask-image:linear-gradient(0deg,transparent,black,transparent)] pointer-events-none" />

        {/* 多层光效 */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-blue-500/30 via-purple-500/30 to-transparent rounded-full blur-3xl animate-[spin_20s_linear_infinite]" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-pink-500/30 via-purple-500/30 to-transparent rounded-full blur-3xl animate-[spin_15s_linear_infinite_reverse]" />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* 左侧主要内容 */}
            <div className="flex-1 max-w-3xl">
              {/* 状态标签 - 炫酷版 */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-purple-500/20 backdrop-blur-sm text-sm font-semibold mb-6 shadow-lg shadow-purple-500/10">
                <div className="relative">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse" />
                  <div className="absolute inset-0 w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-ping" />
                </div>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">实时更新</span>
              </div>

              {/* 标题 - 3D 效果 */}
              <h1 className="text-3xl md:text-5xl font-black mb-4 relative group">
                <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent blur-2xl opacity-50 group-hover:opacity-70 transition-opacity">
                  玩法排行榜
                </span>
                <span className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  玩法排行榜
                </span>
              </h1>

              {/* 描述 */}
              <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                发现最热门、收益最高、最适合新手的Web3投资策略
              </p>

              {/* 特性标签 */}
              <div className="flex flex-wrap gap-3">
                <div className="px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-sm font-semibold backdrop-blur-sm">
                  🔥 热度排行
                </div>
                <div className="px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-sm font-semibold backdrop-blur-sm">
                  💰 收益排行
                </div>
                <div className="px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-semibold backdrop-blur-sm">
                  🎯 新人友好
                </div>
              </div>
            </div>

            {/* 右侧统计卡片 */}
            <div className="lg:shrink-0">
              <div className="relative overflow-hidden rounded-3xl border border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/60 backdrop-blur-xl p-8 shadow-2xl shadow-purple-500/10 min-w-[300px]">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl" />

                <div className="relative">
                  <div className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-6 tracking-wider uppercase">榜单统计</div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-purple-500/30">
                        6
                      </div>
                      <div>
                        <div className="text-2xl font-black text-slate-900 dark:text-slate-100">6</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">个榜单</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-500/30">
                        {data.length}
                      </div>
                      <div>
                        <div className="text-2xl font-black text-slate-900 dark:text-slate-100">{data.length}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">个策略</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab 切换栏 */}
      <LeaderboardTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 风险等级筛选器 (仅收益榜显示) */}
      {activeTab === 'top_apy' && (
        <div className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">风险等级:</span>
              <div className="flex gap-2">
                {[
                  { value: 'all', label: '全部' },
                  { value: 'low', label: '低风险 (1-2)' },
                  { value: 'medium', label: '中等 (3)' },
                  { value: 'high', label: '高风险 (4-5)' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setRiskLevel(option.value as typeof riskLevel)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      riskLevel === option.value
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-600 hover:border-purple-500'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 排行榜列表 */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-slate-600 dark:text-slate-400">加载中...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-50 dark:bg-red-950 flex items-center justify-center">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-2 text-red-600">加载失败</h3>
            <p className="text-slate-600 dark:text-slate-400">{error}</p>
          </div>
        )}

        {!loading && !error && data.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-2">暂无数据</h3>
            <p className="text-slate-600 dark:text-slate-400">该榜单暂时没有策略</p>
          </div>
        )}

        {!loading && !error && data.length > 0 && (
          <div className="space-y-4">
            {data.map((rankedStrategy) => (
              <RankedStrategyCard
                key={rankedStrategy.strategy.id}
                rankedStrategy={rankedStrategy}
                leaderboardType={activeTab}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
