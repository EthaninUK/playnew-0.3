'use client';

import { useState } from 'react';
import Link from 'next/link';
import { News } from '@/lib/directus';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Flame,
  ThumbsUp,
  MessageCircle,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface GossipCardProps {
  gossip: News;
  index?: number;
}

// 求证状态配置
const VERIFICATION_STATUS_CONFIG = {
  unverified: { label: '未求证', color: 'slate', icon: Clock, bgClass: 'bg-slate-100 dark:bg-slate-800' },
  verifying: { label: '求证中', color: 'blue', icon: Search, bgClass: 'bg-blue-100 dark:bg-blue-900/30' },
  confirmed: { label: '已确认', color: 'green', icon: CheckCircle2, bgClass: 'bg-green-100 dark:bg-green-900/30' },
  debunked: { label: '已辟谣', color: 'red', icon: XCircle, bgClass: 'bg-red-100 dark:bg-red-900/30' },
};

export function GossipCard({ gossip, index }: GossipCardProps) {
  const [likes, setLikes] = useState(gossip.likes_count || 0);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const credibility = gossip.credibility_score || 50;
  const hotness = gossip.hotness_score || 0;
  const verificationStatus = gossip.verification_status || 'unverified';
  const statusConfig = VERIFICATION_STATUS_CONFIG[verificationStatus];
  const StatusIcon = statusConfig.icon;

  // 处理点赞
  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isLiking) return;

    setIsLiking(true);

    // Optimistic UI update
    const wasLiked = hasLiked;
    const previousLikes = likes;

    if (hasLiked) {
      setLikes(prev => prev - 1);
      setHasLiked(false);
    } else {
      setLikes(prev => prev + 1);
      setHasLiked(true);
    }

    try {
      const response = await fetch('/api/gossip/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newsId: gossip.id }),
      });

      if (!response.ok) {
        throw new Error('Failed to toggle like');
      }

      const data = await response.json();

      // Update with server response
      setLikes(data.likes_count);
      setHasLiked(data.liked);
    } catch (error) {
      console.error('Failed to toggle like:', error);
      // Revert optimistic update on error
      setLikes(previousLikes);
      setHasLiked(wasLiked);
    } finally {
      setIsLiking(false);
    }
  };

  // 可信度颜色
  const credibilityColor = credibility >= 80
    ? 'bg-green-500'
    : credibility >= 60
    ? 'bg-yellow-500'
    : 'bg-red-500';

  return (
    <Link href={`/gossip/${gossip.id}`} className="block group">
      <article className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-orange-300 dark:hover:border-orange-700 hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-200 overflow-hidden">
        {/* 卡片头部 */}
        <div className="p-5">
          {/* 顶部元信息 */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              {/* 热度徽章 */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-orange-50 to-pink-50 dark:from-orange-900/20 dark:to-pink-900/20 border border-orange-200 dark:border-orange-800/30">
                <Flame className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400" />
                <span className="text-xs font-bold text-orange-700 dark:text-orange-400">
                  {hotness}
                </span>
              </div>

              {/* 求证状态 */}
              <Badge className={cn(
                "text-xs font-medium",
                statusConfig.bgClass,
                `text-${statusConfig.color}-700 dark:text-${statusConfig.color}-300`
              )}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {statusConfig.label}
              </Badge>

              {/* 八卦标签 */}
              {gossip.gossip_tags && gossip.gossip_tags.length > 0 && (
                <Badge variant="outline" className="text-xs">
                  {gossip.gossip_tags[0]}
                </Badge>
              )}
            </div>

            {/* 可信度指示器 */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-slate-500 dark:text-slate-400">可信度</span>
              <div className="flex items-center gap-1.5">
                <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all", credibilityColor)}
                    style={{ width: `${credibility}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {credibility}%
                </span>
              </div>
            </div>
          </div>

          {/* 标题 */}
          <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug mb-3 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-2">
            {gossip.title}
          </h3>

          {/* AI摘要 */}
          {gossip.ai_summary && (
            <div className="mb-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                💬 {gossip.ai_summary}
              </p>
            </div>
          )}

          {/* 来源信息 */}
          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-4">
            {gossip.source && (
              <span className="flex items-center gap-1">
                <ExternalLink className="h-3 w-3" />
                {gossip.source}
              </span>
            )}
            {gossip.content_published_at && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {new Date(gossip.content_published_at).toLocaleDateString('zh-CN', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            )}
          </div>

          {/* 互动按钮栏 */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              disabled={isLiking}
              className={cn(
                "flex-1 rounded-lg transition-all",
                hasLiked
                  ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 hover:bg-orange-100"
                  : "hover:bg-slate-100 dark:hover:bg-slate-800"
              )}
            >
              <ThumbsUp
                className={cn("h-4 w-4 mr-1.5", hasLiked && "fill-current")}
              />
              <span className="font-medium">{likes}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="flex-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <MessageCircle className="h-4 w-4 mr-1.5" />
              <span className="font-medium">{gossip.comments_count || 0}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="flex-1 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <Search className="h-4 w-4 mr-1.5" />
              <span className="font-medium">求证</span>
            </Button>
          </div>
        </div>

        {/* 趋势指示器(可选) */}
        {hotness > 80 && (
          <div className="px-5 py-2 bg-gradient-to-r from-orange-50 to-pink-50 dark:from-orange-900/10 dark:to-pink-900/10 border-t border-orange-200 dark:border-orange-800/30">
            <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-orange-600 dark:text-orange-400">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>正在热议中</span>
            </div>
          </div>
        )}
      </article>
    </Link>
  );
}
