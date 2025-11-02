'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, Clock, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NewsFiltersBarProps {
  onFilterChange?: (filters: any) => void;
}

export function NewsFiltersBar({ onFilterChange }: NewsFiltersBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [timeRange, setTimeRange] = useState(searchParams?.get('time') || 'all');
  const [showRead, setShowRead] = useState(searchParams?.get('read') !== 'false');
  const [priority, setPriority] = useState(searchParams?.get('priority') || 'all');

  const timeRanges = [
    { value: 'all', label: '全部' },
    { value: '1h', label: '1小时' },
    { value: '6h', label: '6小时' },
    { value: '24h', label: '24小时' },
    { value: '7d', label: '7天' }
  ];

  const priorityLevels = [
    { value: 'all', label: '全部' },
    { value: 'high', label: '高优先级' },
    { value: 'medium', label: '中等' },
    { value: 'low', label: '低优先级' }
  ];

  const updateFilters = (newFilters: any) => {
    const current = new URLSearchParams(searchParams?.toString());

    Object.keys(newFilters).forEach((key) => {
      if (newFilters[key]) {
        current.set(key, newFilters[key]);
      } else {
        current.delete(key);
      }
    });

    router.push(`/news?${current.toString()}`);
    onFilterChange?.(newFilters);
  };

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
    updateFilters({ time: value === 'all' ? null : value });
  };

  const handlePriorityChange = (value: string) => {
    setPriority(value);
    updateFilters({ priority: value === 'all' ? null : value });
  };

  const toggleShowRead = () => {
    const newValue = !showRead;
    setShowRead(newValue);
    updateFilters({ read: newValue ? null : 'false' });
  };

  return (
    <div className="sticky top-16 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* 快速筛选 */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
            {/* 时间范围 */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
              <Clock className="h-4 w-4 text-slate-500 ml-1" />
              {timeRanges.map((range) => (
                <button
                  key={range.value}
                  onClick={() => handleTimeRangeChange(range.value)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                    timeRange === range.value
                      ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  )}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

        {/* 活跃筛选标签显示 */}
        {(timeRange !== 'all' || priority !== 'all' || !showRead) && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-500 dark:text-slate-400">活跃筛选：</span>
            <div className="flex items-center gap-2 flex-wrap">
              {timeRange !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-xs">
                  <Clock className="h-3 w-3" />
                  {timeRanges.find(r => r.value === timeRange)?.label}
                  <button
                    onClick={() => handleTimeRangeChange('all')}
                    className="ml-1 hover:text-purple-900 dark:hover:text-purple-100"
                  >
                    ×
                  </button>
                </span>
              )}

              {priority !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 text-xs">
                  <Filter className="h-3 w-3" />
                  {priorityLevels.find(p => p.value === priority)?.label}
                  <button
                    onClick={() => handlePriorityChange('all')}
                    className="ml-1 hover:text-orange-900 dark:hover:text-orange-100"
                  >
                    ×
                  </button>
                </span>
              )}

              {!showRead && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs">
                  <EyeOff className="h-3 w-3" />
                  仅未读
                  <button
                    onClick={toggleShowRead}
                    className="ml-1 hover:text-slate-900 dark:hover:text-slate-100"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>

            <button
              onClick={() => {
                setTimeRange('all');
                setPriority('all');
                setShowRead(true);
                router.push('/news');
              }}
              className="ml-auto text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 transition-colors"
            >
              清空筛选
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
