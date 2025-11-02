'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { News } from '@/lib/directus';
import { Clock, Bookmark, Share2, ExternalLink, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NewsItemProps {
  news: News;
  compact?: boolean;
}

export function NewsItem({ news, compact = false }: NewsItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getRelativeTime = (dateString?: string) => {
    if (!dateString) return '最近';

    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return '刚刚';
    if (diffInMinutes < 60) return `${diffInMinutes}分钟前`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}小时前`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}天前`;

    return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' });
  };

  const getPriorityColor = (priority?: number) => {
    if (!priority) return null;
    if (priority >= 9) return 'text-red-600 bg-red-50 dark:bg-red-900/20 border-red-200';
    if (priority >= 7) return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 border-orange-200';
    if (priority >= 5) return 'text-green-600 bg-green-50 dark:bg-green-900/20 border-green-200';
    return null;
  };

  const getPriorityIcon = (priority?: number) => {
    if (!priority) return null;
    if (priority >= 9) return <AlertTriangle className="h-3 w-3" />;
    if (priority >= 7) return <TrendingUp className="h-3 w-3" />;
    if (priority >= 5) return <CheckCircle className="h-3 w-3" />;
    return null;
  };

  const priorityStyle = getPriorityColor(news.priority);
  const priorityIcon = getPriorityIcon(news.priority);
  // Only calculate relative time on client-side to avoid hydration mismatch
  const relativeTime = mounted ? getRelativeTime(news.content_published_at || news.created_at) : '最近';
  const isHighPriority = (news.priority || 0) >= 7;

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    // 实现分享逻辑
    if (navigator.share) {
      navigator.share({
        title: news.title,
        url: window.location.origin + `/news/${news.id}`
      });
    }
  };

  return (
    <Link
      href={`/news/${news.id}`}
      className="block group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <article className={cn(
        "relative rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4",
        "hover:shadow-sm hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-200",
        isHighPriority && "ring-1 ring-slate-200 dark:ring-slate-700"
      )}>

        {/* 顶部：来源 + 时间 + 优先级标签 */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-medium">{news.source || 'ChainCatcher'}</span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{relativeTime}</span>
            </div>
          </div>

          {/* 优先级/情绪徽标 */}
          {priorityStyle && priorityIcon && (
            <div className={cn(
              "inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-xs font-medium",
              priorityStyle
            )}>
              {priorityIcon}
              <span>{news.priority && news.priority >= 9 ? '预警' : news.priority && news.priority >= 7 ? '重要' : '利好'}</span>
            </div>
          )}
        </div>

        {/* 标题 - 最多2行 */}
        <h3 className={cn(
          "font-semibold text-slate-900 dark:text-white mb-2 leading-6 line-clamp-2",
          "group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors",
          compact ? "text-[15px]" : "text-[17px]"
        )}>
          {news.title}
        </h3>

        {/* 摘要 - 最多2行 */}
        {!compact && news.ai_summary && (
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2 mb-3">
            {news.ai_summary}
          </p>
        )}

        {/* 底部：标签 + 动作按钮 */}
        <div className="flex items-center justify-between gap-3">
          {/* 标签区 */}
          <div className="flex items-center gap-2 flex-wrap">
            {news.category && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
                {news.category}
              </span>
            )}
          </div>

          {/* 动作按钮 - Hover时显示 */}
          <div className={cn(
            "flex items-center gap-1 transition-opacity duration-200",
            isHovered ? "opacity-100" : "opacity-0"
          )}>
            <button
              onClick={handleBookmark}
              className={cn(
                "p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors",
                isBookmarked && "text-amber-600"
              )}
              aria-label="收藏"
            >
              <Bookmark className="h-4 w-4" fill={isBookmarked ? "currentColor" : "none"} />
            </button>

            <button
              onClick={handleShare}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="分享"
            >
              <Share2 className="h-4 w-4" />
            </button>

            <div className="p-1.5 text-slate-400">
              <ExternalLink className="h-4 w-4" />
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
