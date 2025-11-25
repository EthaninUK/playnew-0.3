'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Layers, Building2, Newspaper } from 'lucide-react';

interface StatsData {
  strategies: number;
  categories: number;
  providers: number;
  news: number;
  updated_at: string;
}

export default function PlatformStats() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/stats');
      const result = await response.json();

      if (result.success) {
        setStats(result.data);
        setError(null);
      } else {
        setError(result.error || '获取统计数据失败');
      }
    } catch (err) {
      setError('网络错误');
      console.error('获取统计数据失败:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 animate-pulse">
            <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
        <p className="text-red-600 dark:text-red-400 text-sm">{error || '加载失败'}</p>
      </div>
    );
  }

  const statItems = [
    {
      label: '个策略',
      value: stats.strategies,
      icon: TrendingUp,
      color: 'blue',
      bgColor: 'bg-blue-50 dark:bg-blue-950/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
      textColor: 'text-blue-900 dark:text-blue-100',
    },
    {
      label: '个分类',
      value: stats.categories,
      icon: Layers,
      color: 'purple',
      bgColor: 'bg-purple-50 dark:bg-purple-950/30',
      iconColor: 'text-purple-600 dark:text-purple-400',
      textColor: 'text-purple-900 dark:text-purple-100',
    },
    {
      label: '个服务商',
      value: stats.providers,
      icon: Building2,
      color: 'green',
      bgColor: 'bg-green-50 dark:bg-green-950/30',
      iconColor: 'text-green-600 dark:text-green-400',
      textColor: 'text-green-900 dark:text-green-100',
    },
    {
      label: '条快讯',
      value: stats.news,
      icon: Newspaper,
      color: 'orange',
      bgColor: 'bg-orange-50 dark:bg-orange-950/30',
      iconColor: 'text-orange-600 dark:text-orange-400',
      textColor: 'text-orange-900 dark:text-orange-100',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">平台数据统计</h3>
        <button
          onClick={fetchStats}
          className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
        >
          刷新
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className={`${item.bgColor} rounded-xl p-4 border border-slate-200 dark:border-slate-800 transition-all hover:shadow-md`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg bg-white dark:bg-slate-800 ${item.iconColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className={`text-2xl font-bold ${item.textColor} mb-1`}>
                {item.value.toLocaleString()}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400">
                {item.label}
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-xs text-slate-500 dark:text-slate-400 text-right">
        最后更新: {new Date(stats.updated_at).toLocaleString('zh-CN')}
      </div>
    </div>
  );
}
