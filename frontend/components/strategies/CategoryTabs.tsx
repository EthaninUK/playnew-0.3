'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { CategoryGroup } from '@/lib/directus';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CategoryTabsProps {
  categoryGroups: CategoryGroup[];
  currentCategory?: string;
  currentGroup?: string;
}

export function CategoryTabs({ categoryGroups, currentCategory, currentGroup }: CategoryTabsProps) {
  const [activeTab, setActiveTab] = useState(currentGroup || 'all');
  const [isExpanded, setIsExpanded] = useState(true);
  const [isSticky, setIsSticky] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // 监听滚动事件，检测分类栏是否已固定到顶部
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (containerRef.current) {
        // 获取容器相对于视口的位置
        const rect = containerRef.current.getBoundingClientRect();
        const headerHeight = 64; // Header 高度 (top-16)

        // 当分类栏的顶部位置等于或小于 header 高度时，表示已经固定到顶部
        const nowSticky = rect.top <= headerHeight;

        // 如果刚刚变成 sticky 状态
        if (nowSticky && !isSticky) {
          setIsSticky(true);
        } else if (!nowSticky && isSticky) {
          setIsSticky(false);
        }

        // 移除自动收起逻辑 - 让用户手动控制
        // 之前的自动收起会导致用户点击展开后立即收起
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isSticky, lastScrollY]);

  // 切换展开/收起
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // 当切换标签时,自动展开内容
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setIsExpanded(true);
  };

  // 当用户点击二级分类后，自动收起
  const handleCategoryClick = () => {
    setIsExpanded(false);
  };

  return (
    <div ref={containerRef} className="border-b bg-background/95 backdrop-blur-sm sticky top-16 z-30 shadow-md">
      <div className="container mx-auto px-2 sm:px-4 lg:px-8">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          {/* Main Category Tabs */}
          <div className="flex items-center border-b">
            <TabsList className="flex-1 justify-start h-auto p-0 bg-transparent border-b-0 overflow-x-auto flex-nowrap scrollbar-hide snap-x snap-mandatory">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-3 sm:px-4 py-2.5 sm:py-3 text-sm snap-start"
                asChild
              >
                <Link href="/strategies" scroll={false}>
                  全部分类
                </Link>
              </TabsTrigger>

              {categoryGroups.map((group) => (
                <TabsTrigger
                  key={group.parent.id}
                  value={group.parent.slug}
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-3 sm:px-4 py-2.5 sm:py-3 whitespace-nowrap text-sm snap-start"
                  asChild
                >
                  <Link href={`/strategies?group=${group.parent.slug}`} scroll={false}>
                    {group.parent.name}
                  </Link>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Toggle Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleExpanded}
              className="ml-1 sm:ml-2 flex-shrink-0 px-2 sm:px-3"
              aria-label={isExpanded ? "收起分类" : "展开分类"}
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4 sm:mr-1" />
                  <span className="hidden sm:inline text-xs">收起</span>
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 sm:mr-1" />
                  <span className="hidden sm:inline text-xs">展开</span>
                </>
              )}
            </Button>
          </div>

          {/* All Categories View */}
          <TabsContent
            value="all"
            className="mt-0 bg-background"
          >
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              style={{
                maxHeight: isExpanded ? '2000px' : '0',
                paddingTop: isExpanded ? '1.5rem' : '0',
                paddingBottom: isExpanded ? '1.5rem' : '0',
              }}
            >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3">
              {categoryGroups.map((group) =>
                group.children.map((category) => (
                  <Link
                    key={category.id}
                    href={`/strategies?category=${category.slug}`}
                    scroll={false}
                    onClick={handleCategoryClick}
                    className={`group relative overflow-hidden rounded-lg border p-2 sm:p-3 transition-all hover:shadow-lg hover:scale-[1.02] active:scale-95 ${
                      currentCategory === category.slug
                        ? 'bg-primary/10 border-primary shadow-md'
                        : 'bg-card hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-start gap-1.5 sm:gap-2">
                      <div className="text-sm sm:text-base shrink-0">{category.icon}</div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-xs sm:text-sm mb-0.5 truncate group-hover:text-primary transition-colors">
                          {category.name}
                        </h3>
                        {category.description && (
                          <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-1 hidden sm:block">
                            {category.description}
                          </p>
                        )}
                      </div>
                    </div>
                    {/* Decorative gradient */}
                    <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))
              )}
            </div>
            </div>
          </TabsContent>

          {/* Individual Group Views */}
          {categoryGroups.map((group) => (
            <TabsContent
              key={group.parent.id}
              value={group.parent.slug}
              className="mt-0 bg-background"
            >
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                style={{
                  maxHeight: isExpanded ? '2000px' : '0',
                  paddingTop: isExpanded ? '1.5rem' : '0',
                  paddingBottom: isExpanded ? '1.5rem' : '0',
                }}
              >
              <div className="mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">{group.parent.name}</h2>
                <p className="text-muted-foreground text-sm">
                  共 {group.children.length} 个子分类
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3">
                {group.children.map((category) => (
                  <Link
                    key={category.id}
                    href={`/strategies?category=${category.slug}&group=${group.parent.slug}`}
                    scroll={false}
                    onClick={handleCategoryClick}
                    className={`group relative overflow-hidden rounded-lg border p-2 sm:p-3 transition-all hover:shadow-lg hover:scale-[1.02] active:scale-95 ${
                      currentCategory === category.slug
                        ? 'bg-primary/10 border-primary shadow-md'
                        : 'bg-card hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-start gap-1.5 sm:gap-2">
                      <div className="text-sm sm:text-base shrink-0">{category.icon}</div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-xs sm:text-sm mb-0.5 truncate group-hover:text-primary transition-colors">
                          {category.name}
                        </h3>
                        {category.description && (
                          <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-1 hidden sm:block">
                            {category.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Decorative gradient */}
                    <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
