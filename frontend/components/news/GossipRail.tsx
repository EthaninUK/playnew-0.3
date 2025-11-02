'use client';

import { useState } from 'react';
import Link from 'next/link';
import { News } from '@/lib/directus';
import { Flame, ThumbsUp, MessageCircle, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GossipRailProps {
  gossipNews: News[];
  topics?: string[];
}

interface GossipCardProps {
  news: News;
  compact?: boolean;
}

function GossipCard({ news, compact = false }: GossipCardProps) {
  const [likes, setLikes] = useState(Math.floor(Math.random() * 50) + 10);
  const [hasLiked, setHasLiked] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const credibility = Math.floor(Math.random() * 40) + 60; // 60-100%
  const hotness = Math.floor(Math.random() * 100);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    if (hasLiked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setHasLiked(!hasLiked);
  };

  const handleVerify = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsVerifying(!isVerifying);
  };

  return (
    <Link href={`/news/${news.id}`} className="block group">
      <article className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 hover:shadow-sm hover:border-orange-200 dark:hover:border-orange-900/30 transition-all duration-200">

        {/* 头部：热度 + 可信度 */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-xs font-bold">
            <Flame className="h-3.5 w-3.5" />
            <span>{hotness}</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 dark:text-slate-400">可信度</span>
            <div className="flex items-center gap-1">
              <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    credibility >= 80 ? "bg-green-500" : credibility >= 60 ? "bg-yellow-500" : "bg-red-500"
                  )}
                  style={{ width: `${credibility}%` }}
                />
              </div>
              <span className="font-medium text-slate-700 dark:text-slate-300">{credibility}%</span>
            </div>
          </div>
        </div>

        {/* 标题 - 最多2行 */}
        <h4 className="text-[15px] font-semibold text-slate-900 dark:text-white leading-snug line-clamp-2 mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
          {news.title}
        </h4>

        {/* 来源 */}
        <div className="text-xs text-slate-500 dark:text-slate-400 mb-3">
          来源：{news.source || 'CryptoWhisper'}
        </div>

        {/* 评论摘录（可选） */}
        {news.ai_summary && (
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 mb-3">
            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
              💬 {news.ai_summary.substring(0, 60)}...
            </p>
          </div>
        )}

        {/* 底部：互动按钮 */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleLike}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
              hasLiked
                ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            )}
          >
            <ThumbsUp className="h-3.5 w-3.5" fill={hasLiked ? "currentColor" : "none"} />
            <span>{likes}</span>
          </button>

          <button
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-medium transition-colors"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            <span>吃瓜🍉</span>
          </button>

          <button
            onClick={handleVerify}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
              isVerifying
                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            )}
          >
            <Search className="h-3.5 w-3.5" />
            <span>求证</span>
          </button>
        </div>
      </article>
    </Link>
  );
}

export function GossipRail({ gossipNews, topics = [] }: GossipRailProps) {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [showAllGossip, setShowAllGossip] = useState(false);

  // 默认话题
  const defaultTopics = topics.length > 0 ? topics : [
    '#项目传闻',
    '#KOL动态',
    '#交易所八卦',
    '#团队内幕',
    '#融资消息',
    '#技术争议'
  ];

  // 过滤八卦
  const filteredGossip = showAllGossip
    ? gossipNews
    : gossipNews.filter(item => (item.priority || 0) >= 5); // 只显示初步求证的

  return (
    <div className="space-y-6">
      {/* 顶部：热议话题横向滚动 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            🔥 热议话题
          </h3>
          <button
            onClick={() => setShowAllGossip(!showAllGossip)}
            className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 transition-colors"
          >
            {showAllGossip ? '仅已求证' : '全部八卦'}
          </button>
        </div>

        {/* 话题胶囊 - 横向滚动 */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {defaultTopics.map((topic) => (
            <button
              key={topic}
              onClick={() => setSelectedTopic(selectedTopic === topic ? null : topic)}
              className={cn(
                "shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                selectedTopic === topic
                  ? "bg-orange-500 text-white shadow-md"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              )}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* 八卦卡片列表 */}
      <div className="space-y-4">
        {filteredGossip.length > 0 ? (
          filteredGossip.map((item) => (
            <GossipCard key={item.id} news={item} />
          ))
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 mb-3">
              <MessageCircle className="h-6 w-6 text-slate-400" />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              暂无八卦内容
            </p>
          </div>
        )}
      </div>

      {/* 提示 */}
      <div className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-900/10 border border-amber-200/50 dark:border-amber-800/30">
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          💡 八卦内容仅供娱乐参考，请理性判断
        </p>
      </div>
    </div>
  );
}
