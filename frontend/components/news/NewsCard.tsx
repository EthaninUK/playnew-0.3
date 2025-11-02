import Link from 'next/link';
import type { News } from '@/lib/directus';
import { Clock, Eye, Flame, TrendingUp, Sparkles, AlertCircle, MessageSquare } from 'lucide-react';

interface NewsCardProps {
  news: News;
  headlinesOnly?: boolean;
}

export function NewsCard({ news, headlinesOnly = false }: NewsCardProps) {
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

  const getCategoryStyle = (category: string) => {
    const styles: Record<string, { name: string; bgColor: string; textColor: string; icon: any }> = {
      'market': {
        name: '市场',
        bgColor: 'bg-orange-100 dark:bg-orange-900/30',
        textColor: 'text-orange-700 dark:text-orange-300',
        icon: TrendingUp
      },
      'defi': {
        name: 'DeFi',
        bgColor: 'bg-blue-100 dark:bg-blue-900/30',
        textColor: 'text-blue-700 dark:text-blue-300',
        icon: Sparkles
      },
      'nft': {
        name: 'NFT',
        bgColor: 'bg-purple-100 dark:bg-purple-900/30',
        textColor: 'text-purple-700 dark:text-purple-300',
        icon: Sparkles
      },
      'tech': {
        name: '技术',
        bgColor: 'bg-green-100 dark:bg-green-900/30',
        textColor: 'text-green-700 dark:text-green-300',
        icon: Sparkles
      },
      'regulation': {
        name: '政策',
        bgColor: 'bg-red-100 dark:bg-red-900/30',
        textColor: 'text-red-700 dark:text-red-300',
        icon: AlertCircle
      },
    };
    return styles[category] || {
      name: '其他',
      bgColor: 'bg-slate-100 dark:bg-slate-800/30',
      textColor: 'text-slate-700 dark:text-slate-300',
      icon: Sparkles
    };
  };

  const categoryStyle = getCategoryStyle(news.category || 'market');
  const CategoryIcon = categoryStyle.icon;
  const relativeTime = getRelativeTime(news.content_published_at || news.published_at || news.created_at);
  const isImportant = (news.priority || 0) >= 8;

  const isGossip = news.news_type === 'gossip';

  return (
    <Link href={`/news/${news.id}`} className="block group">
      <div className={`
        relative px-6 py-6
        transition-all duration-300
        ${isGossip
          ? 'hover:bg-gradient-to-r hover:from-orange-50/80 hover:to-amber-50/60 dark:hover:from-orange-950/30 dark:hover:to-amber-950/20'
          : 'hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-indigo-50/60 dark:hover:from-blue-950/30 dark:hover:to-indigo-950/20'
        }
        border-l-4 border-transparent
        ${isImportant
          ? isGossip
            ? 'hover:border-orange-500'
            : 'hover:border-blue-500'
          : ''
        }
      `}>

        {/* 主要内容容器 */}
        <div className="flex items-start gap-6">

          {/* 左侧：时间戳徽章 */}
          <div className="shrink-0 pt-0.5">
            <div className={`
              relative px-3 py-2 rounded-xl font-medium text-xs
              ${isGossip
                ? 'bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/40 dark:to-amber-900/40 text-orange-700 dark:text-orange-300 shadow-sm shadow-orange-500/20'
                : 'bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 text-blue-700 dark:text-blue-300 shadow-sm shadow-blue-500/20'
              }
              group-hover:shadow-md transition-all duration-300
            `}>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                <span className="whitespace-nowrap">{relativeTime}</span>
              </div>
            </div>
          </div>

          {/* 中间：新闻内容 */}
          <div className="flex-1 min-w-0 space-y-3">

            {/* 标题 + 重要标签 */}
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <h2 className={`
                  flex-1 text-lg font-bold leading-relaxed
                  ${isGossip
                    ? 'text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400'
                    : 'text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400'
                  }
                  transition-colors duration-300
                `}>
                  {news.title}
                </h2>

                {/* 重要标签 - 右上角 */}
                {isImportant && (
                  <div className={`
                    shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full font-semibold text-xs
                    ${isGossip
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/40'
                      : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/40'
                    }
                    animate-pulse
                  `}>
                    <Flame className="h-3.5 w-3.5" />
                    <span>重要</span>
                  </div>
                )}
              </div>
            </div>

            {/* AI摘要 */}
            {!headlinesOnly && news.ai_summary && (
              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {news.ai_summary}
              </p>
            )}

            {/* 底部元数据栏 */}
            <div className="flex items-center gap-3 flex-wrap">

              {/* 分类标签 */}
              <div className={`
                inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-xs
                ${categoryStyle.bgColor} ${categoryStyle.textColor}
                border border-current/20
                transition-all duration-300
                group-hover:scale-105
              `}>
                <CategoryIcon className="h-3.5 w-3.5" />
                <span>{categoryStyle.name}</span>
              </div>

              {/* 来源 */}
              <div className={`
                inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                ${isGossip
                  ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300'
                  : 'bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400'
                }
              `}>
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{news.source || 'ChainCatcher'}</span>
              </div>

              {/* 八卦类型标签 */}
              {isGossip && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-600 dark:text-orange-400 border border-orange-500/30">
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>八卦</span>
                </div>
              )}
            </div>
          </div>

          {/* 右侧：箭头指示器 */}
          <div className="shrink-0 pt-1">
            <div className={`
              w-9 h-9 rounded-xl flex items-center justify-center
              transition-all duration-300
              ${isGossip
                ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 group-hover:bg-orange-500 group-hover:text-white'
                : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 group-hover:bg-blue-500 group-hover:text-white'
              }
              opacity-60 group-hover:opacity-100
              group-hover:scale-110 group-hover:shadow-lg
              ${isGossip ? 'group-hover:shadow-orange-500/30' : 'group-hover:shadow-blue-500/30'}
            `}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

      </div>
    </Link>
  );
}
