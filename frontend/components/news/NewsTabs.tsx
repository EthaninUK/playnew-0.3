'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { News } from '@/lib/directus';
import { NewsCard } from './NewsCard';
import { Zap, MessageSquare, TrendingUp, Flame } from 'lucide-react';

interface NewsTabsProps {
  realtimeNews: News[];
  gossipNews: News[];
  currentType?: string;
  headlinesOnly?: boolean;
}

export function NewsTabs({ realtimeNews, gossipNews, currentType, headlinesOnly }: NewsTabsProps) {
  const [activeTab, setActiveTab] = useState(currentType || 'realtime');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* 页面头部 */}
      <div className="border-b border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl sticky top-16 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Tab Navigation */}
            <div className="flex items-center justify-between py-6">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg shadow-blue-500/20">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
                    快讯中心
                  </h1>
                </div>
              </div>
            </div>

            {/* Tab List - Modern Design */}
            <TabsList className="w-full justify-start h-auto p-0 bg-transparent border-b border-slate-200 dark:border-slate-800 mb-0">
              <TabsTrigger
                value="realtime"
                className="
                  relative px-8 py-4 gap-3 rounded-none
                  data-[state=inactive]:text-slate-600 dark:data-[state=inactive]:text-slate-400
                  data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400
                  data-[state=active]:bg-blue-50/50 dark:data-[state=active]:bg-blue-950/30
                  data-[state=active]:shadow-none
                  data-[state=active]:border-b-3
                  hover:bg-blue-50/30 dark:hover:bg-blue-950/20
                  transition-all duration-300
                  after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1
                  after:bg-gradient-to-r after:from-blue-500 after:to-indigo-500
                  after:scale-x-0 data-[state=active]:after:scale-x-100
                  after:transition-transform after:duration-300
                "
                asChild
              >
                <Link href="/news?type=realtime" scroll={false}>
                  <div className="relative p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30">
                    <TrendingUp className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-bold text-base">实时资讯</span>
                  <div className="px-2.5 py-1 bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs font-bold rounded-full shadow-md min-w-[28px] text-center">
                    {realtimeNews.length}
                  </div>
                </Link>
              </TabsTrigger>

              <TabsTrigger
                value="gossip"
                className="
                  relative px-8 py-4 gap-3 rounded-none
                  data-[state=inactive]:text-slate-600 dark:data-[state=inactive]:text-slate-400
                  data-[state=active]:text-orange-600 dark:data-[state=active]:text-orange-400
                  data-[state=active]:bg-orange-50/50 dark:data-[state=active]:bg-orange-950/30
                  data-[state=active]:shadow-none
                  hover:bg-orange-50/30 dark:hover:bg-orange-950/20
                  transition-all duration-300
                  after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1
                  after:bg-gradient-to-r after:from-orange-500 after:to-red-500
                  after:scale-x-0 data-[state=active]:after:scale-x-100
                  after:transition-transform after:duration-300
                "
                asChild
              >
                <Link href="/news?type=gossip" scroll={false}>
                  <div className="relative p-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 shadow-lg shadow-orange-500/30">
                    <Flame className="h-4 w-4 text-white animate-pulse" />
                  </div>
                  <span className="font-bold text-base">新鲜八卦</span>
                  <div className="px-2.5 py-1 bg-gradient-to-br from-orange-500 to-red-600 text-white text-xs font-bold rounded-full shadow-md min-w-[28px] text-center">
                    {gossipNews.length}
                  </div>
                </Link>
              </TabsTrigger>
            </TabsList>

            {/* Realtime News Tab Content */}
            <TabsContent value="realtime" className="mt-0">
              <div className="border-b border-slate-200/50 dark:border-slate-800/50 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-slate-600 dark:text-slate-400">实时更新</span>
                      </div>
                      <div className="text-slate-600 dark:text-slate-400">
                        共 <span className="font-semibold text-slate-900 dark:text-white">{realtimeNews.length}</span> 条资讯
                      </div>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      追踪区块链世界的每一个重要瞬间
                    </div>
                  </div>
                </div>
              </div>

              <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {realtimeNews.length === 0 ? (
                  <div className="text-center py-24">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 flex items-center justify-center shadow-lg">
                      <TrendingUp className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">暂无实时资讯</h3>
                    <p className="text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
                      暂时没有发布任何实时资讯，请稍后再来
                    </p>
                  </div>
                ) : (
                  <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-xl shadow-slate-900/5 dark:shadow-none overflow-hidden">
                    <div className="divide-y divide-slate-200/50 dark:divide-slate-800/50">
                      {realtimeNews.map((item) => (
                        <NewsCard key={item.id} news={item} headlinesOnly={headlinesOnly} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Gossip News Tab Content */}
            <TabsContent value="gossip" className="mt-0">
              <div className="border-b border-slate-200/50 dark:border-slate-800/50 bg-gradient-to-r from-orange-50/60 to-red-50/40 dark:from-orange-900/20 dark:to-red-900/10 backdrop-blur-sm">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
                        <span className="text-slate-600 dark:text-slate-400">热门八卦</span>
                      </div>
                      <div className="text-slate-600 dark:text-slate-400">
                        共 <span className="font-semibold text-slate-900 dark:text-white">{gossipNews.length}</span> 条八卦
                      </div>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      币圈热门话题与趣闻八卦
                    </div>
                  </div>
                </div>
              </div>

              <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {gossipNews.length === 0 ? (
                  <div className="text-center py-24">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 flex items-center justify-center shadow-lg">
                      <MessageSquare className="w-10 h-10 text-orange-600 dark:text-orange-400" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">暂无八卦内容</h3>
                    <p className="text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
                      暂时没有发布任何八卦内容，请稍后再来
                    </p>
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-white/70 to-orange-50/50 dark:from-slate-900/70 dark:to-orange-900/10 backdrop-blur-sm rounded-2xl border border-orange-200/50 dark:border-orange-800/30 shadow-xl shadow-orange-900/5 dark:shadow-none overflow-hidden">
                    <div className="divide-y divide-orange-200/50 dark:divide-orange-800/30">
                      {gossipNews.map((item) => (
                        <NewsCard key={item.id} news={item} headlinesOnly={headlinesOnly} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
