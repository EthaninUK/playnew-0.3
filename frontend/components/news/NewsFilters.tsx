'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { FileText, Flame } from 'lucide-react';

export function NewsFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const headlinesOnly = searchParams.get('headlines') === 'true';
  const importantOnly = searchParams.get('important') === 'true';

  const toggleHeadlines = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (headlinesOnly) {
      params.delete('headlines');
    } else {
      params.set('headlines', 'true');
    }
    router.push(`/news?${params.toString()}`);
  };

  const toggleImportant = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (importantOnly) {
      params.delete('important');
    } else {
      params.set('important', 'true');
    }
    router.push(`/news?${params.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      {/* 只看标题 */}
      <button
        onClick={toggleHeadlines}
        className={`group flex items-center gap-2.5 px-4 py-2.5 rounded-xl border-2 transition-all duration-300 ${
          headlinesOnly
            ? 'bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-500/30'
            : 'bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md'
        }`}
      >
        <FileText className={`h-4 w-4 transition-transform ${headlinesOnly ? '' : 'group-hover:scale-110'}`} />
        <span className="text-sm font-medium">只看标题</span>
        <div className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
          headlinesOnly ? 'bg-white/30' : 'bg-slate-200 dark:bg-slate-700'
        }`}>
          <span
            className={`inline-block h-3.5 w-3.5 transform rounded-full transition-transform ${
              headlinesOnly
                ? 'translate-x-[1.125rem] bg-white shadow-sm'
                : 'translate-x-0.5 bg-white dark:bg-slate-400'
            }`}
          />
        </div>
      </button>

      {/* 重要快讯 */}
      <button
        onClick={toggleImportant}
        className={`group flex items-center gap-2.5 px-4 py-2.5 rounded-xl border-2 transition-all duration-300 ${
          importantOnly
            ? 'bg-gradient-to-r from-orange-500 to-red-500 border-orange-500 text-white shadow-lg shadow-orange-500/30'
            : 'bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-orange-300 dark:hover:border-orange-700 hover:shadow-md'
        }`}
      >
        <Flame className={`h-4 w-4 transition-all ${importantOnly ? 'animate-pulse' : 'group-hover:scale-110'}`} />
        <span className="text-sm font-medium">重要快讯</span>
        <div className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
          importantOnly ? 'bg-white/30' : 'bg-slate-200 dark:bg-slate-700'
        }`}>
          <span
            className={`inline-block h-3.5 w-3.5 transform rounded-full transition-transform ${
              importantOnly
                ? 'translate-x-[1.125rem] bg-white shadow-sm'
                : 'translate-x-0.5 bg-white dark:bg-slate-400'
            }`}
          />
        </div>
      </button>
    </div>
  );
}
