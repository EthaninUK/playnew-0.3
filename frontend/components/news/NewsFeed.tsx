'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { News } from '@/lib/directus';
import { NewsItem } from './NewsItem';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NewsFeedProps {
  initialNews: News[];
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export function NewsFeed({ initialNews, onLoadMore, hasMore = false }: NewsFeedProps) {
  const [news, setNews] = useState<News[]>(initialNews);
  const [newCount, setNewCount] = useState(0);
  const [pendingNews, setPendingNews] = useState<News[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update news when initialNews prop changes (for pagination)
  useEffect(() => {
    setNews(initialNews);
  }, [initialNews]);

  // 模拟轮询检查新内容（实际项目中应该用 WebSocket 或 Server-Sent Events）
  useEffect(() => {
    const interval = setInterval(() => {
      // 这里应该调用 API 检查新内容
      // 现在只是模拟
    }, 30000); // 每30秒检查一次

    return () => clearInterval(interval);
  }, []);

  const handleShowNewContent = () => {
    if (pendingNews.length > 0) {
      setNews([...pendingNews, ...news]);
      setPendingNews([]);
      setNewCount(0);
    }
  };

  const handleLoadMore = async () => {
    if (isLoading || !hasMore || !onLoadMore) return;
    setIsLoading(true);
    await onLoadMore();
    setIsLoading(false);
  };

  // 按时间分组 - 只在客户端执行以避免 hydration 错误
  const groupedNews = useMemo(() => {
    if (!mounted) {
      // 服务端渲染时，返回所有新闻在"全部"分组中
      return { '全部': news };
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const groups: { [key: string]: News[] } = {
      '今天': [],
      '昨天': [],
      '更早': []
    };

    news.forEach(item => {
      const itemDate = new Date(item.content_published_at || item.created_at);
      const itemDay = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate());

      if (itemDay.getTime() === today.getTime()) {
        groups['今天'].push(item);
      } else if (itemDay.getTime() === yesterday.getTime()) {
        groups['昨天'].push(item);
      } else {
        groups['更早'].push(item);
      }
    });

    return groups;
  }, [news, mounted]);

  return (
    <div ref={containerRef} className="relative">
      {/* 新内容提示条 - 固定在顶部 */}
      {newCount > 0 && (
        <div className="sticky top-0 z-20 mb-4">
          <button
            onClick={handleShowNewContent}
            className="w-full py-3 px-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl text-amber-900 dark:text-amber-100 text-sm font-medium hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>有 {newCount} 条新资讯</span>
          </button>
        </div>
      )}

      {/* 新闻列表 - 按时间分组 */}
      <div className="space-y-6">
        {Object.entries(groupedNews).map(([timeLabel, items]) => {
          if (items.length === 0) return null;

          return (
            <div key={timeLabel} className="space-y-3">
              {/* 时间分组标题 */}
              <div className="flex items-center gap-3 px-1">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {timeLabel}
                </div>
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800"></div>
              </div>

              {/* 该时间段的新闻 */}
              <div className="space-y-3">
                {items.map((item) => (
                  <NewsItem key={item.id} news={item} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* 加载更多 */}
      {hasMore && (
        <div className="mt-6 flex justify-center">
          <Button
            onClick={handleLoadMore}
            disabled={isLoading}
            variant="outline"
            className="rounded-xl"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                加载中...
              </>
            ) : (
              '加载更多'
            )}
          </Button>
        </div>
      )}

      {/* 空状态 */}
      {news.length === 0 && (
        <div className="text-center py-16">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 mb-4">
            <AlertCircle className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            暂无资讯
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            暂时没有符合条件的资讯内容
          </p>
        </div>
      )}
    </div>
  );
}
