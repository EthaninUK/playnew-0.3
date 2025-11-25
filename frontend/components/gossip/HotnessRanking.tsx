'use client';

import Link from 'next/link';
import { News } from '@/lib/directus';
import { Flame, TrendingUp, ThumbsUp, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HotnessRankingProps {
  ranking: News[];
}

export function HotnessRanking({ ranking }: HotnessRankingProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
      {/* 标题 */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 px-4 py-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Flame className="h-5 w-5" />
          吃瓜榜 Top 10
        </h3>
        <p className="text-xs text-orange-100 mt-1">今日最火八卦</p>
      </div>

      {/* 排行榜列表 */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {ranking.length > 0 ? (
          ranking.map((item, index) => (
            <Link key={item.id} href={`/news/${item.id}`}>
              <div className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
                <div className="flex items-start gap-3">
                  {/* 排名徽章 */}
                  <div className={cn(
                    "shrink-0 w-7 h-7 rounded-lg flex items-center justify-center font-bold text-sm",
                    index === 0
                      ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-md"
                      : index === 1
                      ? "bg-gradient-to-br from-gray-300 to-gray-400 text-white shadow-md"
                      : index === 2
                      ? "bg-gradient-to-br from-orange-300 to-orange-400 text-white shadow-md"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  )}>
                    {index + 1}
                  </div>

                  {/* 内容 */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors leading-snug mb-2">
                      {item.title}
                    </h4>

                    {/* 热度指标 */}
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <Flame className="h-3 w-3 text-orange-500" />
                        <span className="font-semibold text-orange-600 dark:text-orange-400">
                          {item.hotness_score || 0}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3" />
                        <span>{item.likes_count || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        <span>{item.comments_count || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="p-8 text-center">
            <Flame className="h-12 w-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              暂无热门八卦
            </p>
          </div>
        )}
      </div>

      {/* 底部提示 */}
      <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800">
        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
          <TrendingUp className="h-3 w-3" />
          <span>每5分钟更新一次</span>
        </p>
      </div>
    </div>
  );
}
