'use client';

import { useMemo } from 'react';
import { News } from '@/lib/directus';
import { cn } from '@/lib/utils';
import { Briefcase, Theater, Building2, Eye, DollarSign, Swords, Hash } from 'lucide-react';

interface TopicSidebarProps {
  selectedTopic: string | null;
  onTopicChange: (topic: string | null) => void;
  gossipData: News[];
}

// 预定义话题配置
const GOSSIP_TOPICS = [
  { id: '项目传闻', name: '项目传闻', icon: Briefcase, color: 'purple', emoji: '💼' },
  { id: 'KOL动态', name: 'KOL动态', icon: Theater, color: 'pink', emoji: '🎭' },
  { id: '交易所', name: '交易所', icon: Building2, color: 'blue', emoji: '🏦' },
  { id: '团队内幕', name: '团队内幕', icon: Eye, color: 'slate', emoji: '🕵️' },
  { id: '融资消息', name: '融资消息', icon: DollarSign, color: 'green', emoji: '💰' },
  { id: '技术争议', name: '技术争议', icon: Swords, color: 'red', emoji: '⚔️' },
];

export function TopicSidebar({ selectedTopic, onTopicChange, gossipData }: TopicSidebarProps) {
  // 统计每个话题的八卦数量
  const topicCounts = useMemo(() => {
    const counts: Record<string, number> = {};

    gossipData.forEach(gossip => {
      if (gossip.gossip_tags) {
        gossip.gossip_tags.forEach(tag => {
          counts[tag] = (counts[tag] || 0) + 1;
        });
      }
    });

    return counts;
  }, [gossipData]);

  return (
    <div className="space-y-4">
      {/* 标题 */}
      <div className="hidden lg:block">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Hash className="h-4 w-4 text-orange-500" />
          热议话题
        </h3>
      </div>

      {/* 移动端：横向滚动 */}
      <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {/* 全部话题 */}
        <button
          onClick={() => onTopicChange(null)}
          className={cn(
            "shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all",
            selectedTopic === null
              ? "bg-orange-500 text-white shadow-md shadow-orange-500/30"
              : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
          )}
        >
          全部
        </button>

        {GOSSIP_TOPICS.map((topic) => {
          const count = topicCounts[topic.id] || 0;

          return (
            <button
              key={topic.id}
              onClick={() => onTopicChange(topic.id)}
              className={cn(
                "shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5",
                selectedTopic === topic.id
                  ? "bg-orange-500 text-white shadow-md shadow-orange-500/30"
                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
              )}
            >
              <span>{topic.emoji}</span>
              <span>{topic.name}</span>
              {count > 0 && (
                <span className={cn(
                  "px-1.5 py-0.5 rounded-full text-xs",
                  selectedTopic === topic.id
                    ? "bg-white/20"
                    : "bg-slate-100 dark:bg-slate-700"
                )}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 桌面端：垂直列表 */}
      <div className="hidden lg:block space-y-2">
        {/* 全部话题 */}
        <button
          onClick={() => onTopicChange(null)}
          className={cn(
            "w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
            selectedTopic === null
              ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg shadow-orange-500/30"
              : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 border border-slate-200 dark:border-slate-700"
          )}
        >
          <div className="flex items-center gap-2">
            <Hash className={cn(
              "h-4 w-4",
              selectedTopic === null ? "text-white" : "text-orange-500"
            )} />
            <span>全部话题</span>
          </div>
          <span className={cn(
            "px-2 py-0.5 rounded-full text-xs font-semibold",
            selectedTopic === null
              ? "bg-white/20 text-white"
              : "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
          )}>
            {gossipData.length}
          </span>
        </button>

        {/* 话题列表 */}
        {GOSSIP_TOPICS.map((topic) => {
          const Icon = topic.icon;
          const count = topicCounts[topic.id] || 0;

          return (
            <button
              key={topic.id}
              onClick={() => onTopicChange(topic.id)}
              className={cn(
                "w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
                selectedTopic === topic.id
                  ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg shadow-orange-500/30"
                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 border border-slate-200 dark:border-slate-700"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-lg transition-all",
                  selectedTopic === topic.id
                    ? "bg-white/20"
                    : `bg-${topic.color}-100 dark:bg-${topic.color}-900/20 group-hover:scale-110`
                )}>
                  <Icon className={cn(
                    "h-4 w-4",
                    selectedTopic === topic.id
                      ? "text-white"
                      : `text-${topic.color}-600 dark:text-${topic.color}-400`
                  )} />
                </div>
                <span>{topic.name}</span>
              </div>
              {count > 0 && (
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-xs font-semibold",
                  selectedTopic === topic.id
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                )}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 提示 */}
      <div className="hidden lg:block mt-6 p-3 rounded-xl bg-amber-50/50 dark:bg-amber-900/10 border border-amber-200/50 dark:border-amber-800/30">
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          💡 八卦内容仅供娱乐参考，请理性判断真伪
        </p>
      </div>
    </div>
  );
}
