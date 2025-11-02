'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Strategy } from '@/lib/directus';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Heart, TrendingUp, DollarSign, Clock, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useViewCount } from '@/hooks/useViewCount';

interface StrategyCardProps {
  strategy: Strategy;
}

export function StrategyCard({ strategy }: StrategyCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const { viewCount, incrementViewCount } = useViewCount(strategy.id, 'strategy');

  const getRiskConfig = (level: number) => {
    if (level <= 2) return {
      label: level === 1 ? '极低风险' : '低风险',
      className: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/30',
      dotColor: 'bg-green-500'
    };
    if (level === 3) return {
      label: '中等风险',
      className: 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/30',
      dotColor: 'bg-yellow-500'
    };
    return {
      label: level === 4 ? '高风险' : '极高风险',
      className: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/30',
      dotColor: 'bg-red-500'
    };
  };

  const riskConfig = getRiskConfig(strategy.risk_level);

  // 格式化 APY 数字，保留2位小数
  const formatAPY = (num: number) => {
    return Number(num).toFixed(2);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  const handleCardClick = () => {
    // Increment view count by 2
    incrementViewCount(2);
  };

  return (
    <Link href={`/strategies/${strategy.slug}`} className="block h-full group" onClick={handleCardClick}>
      <Card className="h-full relative overflow-hidden bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/50 hover:border-primary/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
        {/* 背景光晕效果 */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* 卡片内容 */}
        <div className="relative p-5 flex flex-col h-full">
          {/* 头部：标题和箭头 */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2 flex-1">
              {strategy.title}
            </h3>
            <ArrowUpRight className="h-5 w-5 text-slate-400 group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all shrink-0" />
          </div>

          {/* 风险标签 */}
          <div className="mb-3">
            <Badge variant="outline" className={`text-xs font-medium border ${riskConfig.className}`}>
              <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${riskConfig.dotColor}`} />
              {riskConfig.label}
            </Badge>
          </div>

          {/* 简介 */}
          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4">
            {strategy.summary}
          </p>

          {/* APY 收益 - 突出显示 */}
          <div className="relative overflow-hidden rounded-xl p-4 mb-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800/30">
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-400/10 rounded-full blur-2xl" />
            <div className="relative flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 dark:bg-green-500/20 flex items-center justify-center ring-1 ring-green-500/20 dark:ring-green-500/30">
                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="text-[10px] font-semibold text-green-600 dark:text-green-500 uppercase tracking-wider mb-1">预期收益</div>
                <div className="text-2xl font-bold text-green-700 dark:text-green-400 leading-none">
                  {formatAPY(strategy.apy_min)}-{formatAPY(strategy.apy_max)}%
                </div>
              </div>
            </div>
          </div>

          {/* 资金和时间 */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600/30">
              <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-[10px] text-slate-500 dark:text-slate-400">起投</div>
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">{strategy.threshold_capital}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600/30">
              <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-[10px] text-slate-500 dark:text-slate-400">时间</div>
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">{strategy.time_commitment}</div>
              </div>
            </div>
          </div>

          {/* 标签 */}
          {strategy.tags && strategy.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {strategy.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-[10px] px-2 py-0.5 font-normal">
                  {tag}
                </Badge>
              ))}
              {strategy.tags.length > 3 && (
                <Badge variant="secondary" className="text-[10px] px-2 py-0.5 font-normal text-muted-foreground">
                  +{strategy.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* 底部：统计和操作 */}
          <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-700/50 flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5" />
                <span className="font-medium">{viewCount}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Heart className={`h-3.5 w-3.5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                <span className="font-medium">{(strategy.bookmark_count || 0) + (isLiked ? 1 : 0)}</span>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all ${isLiked ? 'text-red-500' : 'text-slate-400'}`}
                onClick={handleLike}
                aria-label="收藏"
              >
                <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500' : ''}`} />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
