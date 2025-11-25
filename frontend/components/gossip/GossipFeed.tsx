'use client';

import { News } from '@/lib/directus';
import { GossipCard } from './GossipCard';
import { Button } from '@/components/ui/button';
import { Flame, Clock, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GossipFeedProps {
  gossipNews: News[];
  sortBy: 'hotness' | 'latest';
  onSortChange: (sort: 'hotness' | 'latest') => void;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function GossipFeed({
  gossipNews,
  sortBy,
  onSortChange,
  totalCount,
  currentPage,
  totalPages,
  onPageChange
}: GossipFeedProps) {
  return (
    <div className="space-y-4">
      {/* 筛选栏 */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              共 {totalCount} 条八卦
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSortChange('hotness')}
              className={cn(
                "rounded-lg transition-all",
                sortBy === 'hotness'
                  ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 hover:bg-orange-100"
                  : "text-slate-600 dark:text-slate-400"
              )}
            >
              <Flame className="h-4 w-4 mr-1.5" />
              最热
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSortChange('latest')}
              className={cn(
                "rounded-lg transition-all",
                sortBy === 'latest'
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100"
                  : "text-slate-600 dark:text-slate-400"
              )}
            >
              <Clock className="h-4 w-4 mr-1.5" />
              最新
            </Button>
          </div>
        </div>
      </div>

      {/* 八卦列表 */}
      {gossipNews.length > 0 ? (
        <div className="space-y-4">
          {gossipNews.map((gossip, index) => (
            <GossipCard key={gossip.id} gossip={gossip} index={index} />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 mb-4">
            <Flame className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            暂无八卦内容
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            换个话题试试，或者稍后再来
          </p>
        </div>
      )}

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="rounded-xl"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            上一页
          </Button>

          <div className="flex items-center gap-1">
            {/* First page */}
            {currentPage > 3 && (
              <>
                <Button
                  variant={1 === currentPage ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onPageChange(1)}
                  className="rounded-xl w-10 h-10 p-0"
                >
                  1
                </Button>
                {currentPage > 4 && (
                  <span className="px-2 text-slate-500">...</span>
                )}
              </>
            )}

            {/* Page numbers around current page */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((page) => {
                return (
                  page === currentPage ||
                  page === currentPage - 1 ||
                  page === currentPage - 2 ||
                  page === currentPage + 1 ||
                  page === currentPage + 2
                );
              })
              .map((page) => (
                <Button
                  key={page}
                  variant={page === currentPage ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onPageChange(page)}
                  className="rounded-xl w-10 h-10 p-0"
                >
                  {page}
                </Button>
              ))}

            {/* Last page */}
            {currentPage < totalPages - 2 && (
              <>
                {currentPage < totalPages - 3 && (
                  <span className="px-2 text-slate-500">...</span>
                )}
                <Button
                  variant={totalPages === currentPage ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onPageChange(totalPages)}
                  className="rounded-xl w-10 h-10 p-0"
                >
                  {totalPages}
                </Button>
              </>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="rounded-xl"
          >
            下一页
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
