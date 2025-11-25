'use client';

import { useState, useMemo } from 'react';
import { News } from '@/lib/directus';
import { NewsFeed } from './NewsFeed';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface NewsPageClientProps {
  initialNews: News[];
  totalCount: number;
}

const ITEMS_PER_PAGE = 50;

export function NewsPageClient({ initialNews, totalCount }: NewsPageClientProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination
  const totalPages = Math.ceil(initialNews.length / ITEMS_PER_PAGE);
  const paginatedNews = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return initialNews.slice(startIndex, endIndex);
  }, [initialNews, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of news feed
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F7F7F8] dark:bg-slate-950">
      {/* 主内容区：全宽单栏布局 */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 标题栏 */}
        <div className="mb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                📰 实时资讯
              </h2>
            </div>
          </div>

          {/* News Feed */}
          <NewsFeed initialNews={paginatedNews} />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
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
                      onClick={() => handlePageChange(1)}
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
                      onClick={() => handlePageChange(page)}
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
                      onClick={() => handlePageChange(totalPages)}
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
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="rounded-xl"
              >
                下一页
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
      </div>
    </div>
  );
}
