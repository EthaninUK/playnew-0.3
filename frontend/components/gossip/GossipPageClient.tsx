'use client';

import { useState, useMemo } from 'react';
import { News } from '@/lib/directus';
import { GossipFeed } from './GossipFeed';
import { TopicSidebar } from './TopicSidebar';
import { HotnessRanking } from './HotnessRanking';
import { Flame, TrendingUp } from 'lucide-react';

interface GossipPageClientProps {
  initialGossip: News[];
  hotnessRanking: News[];
  totalCount: number;
}

const ITEMS_PER_PAGE = 20;

export function GossipPageClient({ initialGossip, hotnessRanking, totalCount }: GossipPageClientProps) {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'hotness' | 'latest'>('hotness');
  const [currentPage, setCurrentPage] = useState(1);

  // 过滤八卦(根据选中的话题)
  const filteredGossip = useMemo(() => {
    if (!selectedTopic) return initialGossip;

    return initialGossip.filter(gossip =>
      gossip.gossip_tags?.includes(selectedTopic)
    );
  }, [initialGossip, selectedTopic]);

  // 排序八卦
  const sortedGossip = useMemo(() => {
    const gossip = [...filteredGossip];

    if (sortBy === 'hotness') {
      return gossip.sort((a, b) => (b.hotness_score || 0) - (a.hotness_score || 0));
    } else {
      return gossip.sort((a, b) =>
        new Date(b.content_published_at || b.created_at).getTime() -
        new Date(a.content_published_at || a.created_at).getTime()
      );
    }
  }, [filteredGossip, sortBy]);

  // 分页
  const totalPages = Math.ceil(sortedGossip.length / ITEMS_PER_PAGE);
  const paginatedGossip = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return sortedGossip.slice(startIndex, endIndex);
  }, [sortedGossip, currentPage]);

  // 当筛选条件改变时，重置到第一页
  const handleTopicChange = (topic: string | null) => {
    setSelectedTopic(topic);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: 'hotness' | 'latest') => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of gossip feed
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-pink-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 via-pink-500 to-red-500">
        {/* 背景图案 */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

        {/* 动态光晕 */}
        <div className="absolute top-0 left-20 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-0 right-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            {/* 图标 */}
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl mb-6 border border-white/30">
              <Flame className="h-8 w-8 text-white" />
            </div>

            {/* 标题 */}
            <h1 className="text-3xl md:text-5xl font-black mb-4">
              币圈八卦
            </h1>

            {/* Slogan */}
            <p className="text-base md:text-lg mb-6 text-orange-100 font-medium">
              真假参半，吃瓜有风险，求证需谨慎
            </p>

            {/* 统计数据 */}
            <div className="inline-flex items-center gap-6 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20">
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-yellow-300" />
                <span className="text-sm font-semibold">{totalCount} 条八卦</span>
              </div>
              <div className="w-px h-4 bg-white/30" />
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-300" />
                <span className="text-sm font-semibold">实时更新</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 主内容区：三栏布局 */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 左侧：话题侧边栏 (2/12 列) */}
          <div className="lg:col-span-2">
            <div className="sticky top-24">
              <TopicSidebar
                selectedTopic={selectedTopic}
                onTopicChange={handleTopicChange}
                gossipData={initialGossip}
              />
            </div>
          </div>

          {/* 中间：八卦 Feed (7/12 列) */}
          <div className="lg:col-span-7">
            <GossipFeed
              gossipNews={paginatedGossip}
              sortBy={sortBy}
              onSortChange={handleSortChange}
              totalCount={filteredGossip.length}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>

          {/* 右侧：吃瓜榜 (3/12 列) */}
          <div className="lg:col-span-3">
            <div className="sticky top-24">
              <HotnessRanking ranking={hotnessRanking} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
