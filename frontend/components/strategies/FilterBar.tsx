'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Category } from '@/lib/directus';
import { Badge } from '@/components/ui/badge';
import { Filter, Tag, Shield, ChevronRight, Sparkles } from 'lucide-react';

interface FilterBarProps {
  categories: Category[];
}

export function FilterBar({ categories }: FilterBarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category');
  const currentRisk = searchParams.get('risk');

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    return params.toString();
  };

  const riskLevels = [
    {
      value: '',
      label: '全部',
      icon: '🎯',
      colorClass: 'slate',
    },
    {
      value: '1-2',
      label: '低风险',
      icon: '🛡️',
      colorClass: 'emerald',
    },
    {
      value: '3',
      label: '中等',
      icon: '⚡',
      colorClass: 'amber',
    },
    {
      value: '4-5',
      label: '高风险',
      icon: '🔥',
      colorClass: 'rose',
    },
  ];

  return (
    <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
        {/* 单行布局 */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* 分类筛选 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Tag className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <h3 className="text-xs font-bold text-foreground">玩法分类</h3>
            </div>

            {/* 分类列表 - 横向滚动 */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {/* 全部分类 */}
              <Link href="/strategies">
                <div
                  className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                    !currentCategory
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm'
                      : 'bg-muted hover:bg-muted/80 text-foreground'
                  }`}
                >
                  ✨ 全部
                </div>
              </Link>

              {/* 各个分类 */}
              {categories.map((category) => {
                const isActive = currentCategory === category.slug;
                return (
                  <Link
                    key={category.id}
                    href={`/strategies?${createQueryString('category', category.slug)}`}
                  >
                    <div
                      className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                        isActive
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm'
                          : 'bg-muted hover:bg-muted/80 text-foreground'
                      }`}
                    >
                      {category.icon} {category.name}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* 分隔线 - 仅桌面端显示 */}
          <div className="hidden lg:block w-px bg-border" />

          {/* 风险等级筛选 */}
          <div className="lg:w-auto">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
              <h3 className="text-xs font-bold text-foreground">风险等级</h3>
            </div>

            {/* 风险等级列表 */}
            <div className="flex gap-2">
              {riskLevels.map((risk) => {
                const isActive = currentRisk === risk.value;

                // 根据颜色类别设置样式
                const getColorClasses = () => {
                  if (isActive) {
                    switch (risk.colorClass) {
                      case 'emerald':
                        return 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-sm';
                      case 'amber':
                        return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm';
                      case 'rose':
                        return 'bg-gradient-to-r from-rose-500 to-red-500 text-white shadow-sm';
                      default:
                        return 'bg-gradient-to-r from-slate-500 to-slate-600 text-white shadow-sm';
                    }
                  } else {
                    return 'bg-muted hover:bg-muted/80 text-foreground';
                  }
                };

                return (
                  <Link
                    key={risk.value}
                    href={`/strategies?${createQueryString('risk', risk.value)}`}
                  >
                    <div
                      className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${getColorClasses()}`}
                    >
                      <span>{risk.icon}</span>
                      <span>{risk.label}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
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
