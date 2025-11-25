import { getStrategies, getCategoryGroups, getTotalStrategiesCount, getActualCategoriesCount } from '@/lib/directus';
import { StrategyList } from '@/components/strategies/StrategyList';
import { CategoryTabs } from '@/components/strategies/CategoryTabs';
import { Pagination } from '@/components/shared/Pagination';

export const metadata = {
  title: '玩法库 - PlayNew.ai',
  description: '探索精选的Web3投资策略，从空投机会到收益方案，找到最适合你的玩法',
};

// Enable ISR with 60 second revalidation
export const revalidate = 60;

export default async function StrategiesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; risk?: string; group?: string; page?: string }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || '1', 10);

  const [result, categoryGroups, totalCount, categoriesCount] = await Promise.all([
    getStrategies({
      category: params.category,
      riskLevel: params.risk,
      group: params.group,
      page,
      limit: 15,
    }),
    getCategoryGroups(),
    getTotalStrategiesCount(),
    getActualCategoriesCount(),
  ]);

  const { strategies, total, totalPages } = result;

  // Get all active categories for display (still needed for category filters)
  const allCategories = categoryGroups.flatMap(g => g.children);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* 页面头部 - 超炫酷科技风 */}
      <div className="relative overflow-hidden border-b bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 dark:from-indigo-500/10 dark:via-purple-500/10 dark:to-pink-500/10">
        {/* 动态背景层 */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-600/20 via-transparent to-transparent animate-pulse" />
        <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800 [mask-image:linear-gradient(0deg,transparent,black,transparent)] pointer-events-none" />

        {/* 多层光效 */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-blue-500/30 via-purple-500/30 to-transparent rounded-full blur-3xl animate-[spin_20s_linear_infinite]" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-pink-500/30 via-purple-500/30 to-transparent rounded-full blur-3xl animate-[spin_15s_linear_infinite_reverse]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* 左侧主要内容 */}
            <div className="flex-1 max-w-3xl">
              {/* 状态标签 - 炫酷版 */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-purple-500/20 backdrop-blur-sm text-xs font-semibold mb-4 shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20 transition-all duration-300">
                <div className="relative">
                  <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse" />
                  <div className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-ping" />
                </div>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">实时更新中</span>
              </div>

              {/* 标题 - 3D 效果 */}
              <h1 className="text-3xl md:text-5xl font-black mb-4 relative group">
                <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent blur-2xl opacity-50 group-hover:opacity-70 transition-opacity">
                  玩法库
                </span>
                <span className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-[gradient_3s_ease_infinite] bg-[length:200%_auto]">
                  玩法库
                </span>
              </h1>

              {/* 描述 - 增强版 */}
              <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                探索精选的加密货币投资策略，从稳健收益到高风险高回报，
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold">
                  找到最适合你的玩法
                </span>
              </p>

              {/* 特性标签 */}
              <div className="flex flex-wrap gap-2">
                <div className="px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-semibold backdrop-blur-sm hover:bg-blue-500/20 transition-colors">
                  💎 精选策略
                </div>
                <div className="px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-semibold backdrop-blur-sm hover:bg-purple-500/20 transition-colors">
                  🎯 风险可控
                </div>
                <div className="px-3 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-600 dark:text-pink-400 text-xs font-semibold backdrop-blur-sm hover:bg-pink-500/20 transition-colors">
                  🚀 实时更新
                </div>
              </div>
            </div>

            {/* 右侧统计卡片 - 3D 悬浮效果 */}
            <div className="lg:shrink-0 perspective-1000">
              <div className="relative overflow-hidden rounded-2xl border border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/60 backdrop-blur-xl p-4 shadow-2xl shadow-purple-500/10 min-w-[280px] transform hover:scale-105 transition-all duration-500 hover:shadow-purple-500/20">
                {/* 多层装饰背景 */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />

                <div className="relative">
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-4 tracking-wider uppercase">数据统计</div>

                  <div className="space-y-3">
                    {/* 策略数量 - 炫酷版 */}
                    <div className="group flex items-center gap-3 p-2 rounded-xl hover:bg-blue-500/5 transition-all duration-300">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                        <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-xl shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="text-3xl font-black bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                          {totalCount}
                        </div>
                        <div className="text-xs font-medium text-slate-600 dark:text-slate-400">个策略</div>
                      </div>
                    </div>

                    {/* 分类数量 - 炫酷版 */}
                    <div className="group flex items-center gap-3 p-2 rounded-xl hover:bg-purple-500/5 transition-all duration-300">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                        <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-xl shadow-purple-500/30 group-hover:scale-110 transition-transform duration-300">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="text-3xl font-black bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                          {categoriesCount}
                        </div>
                        <div className="text-xs font-medium text-slate-600 dark:text-slate-400">个分类</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <CategoryTabs
        categoryGroups={categoryGroups}
        currentCategory={params.category}
        currentGroup={params.group}
      />

      {/* 策略列表 */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {params.category && (
          <div className="mb-8 p-6 rounded-xl bg-muted/30 border">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="text-xl">{allCategories.find((c) => c.slug === params.category)?.icon || '📁'}</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {allCategories.find((c) => c.slug === params.category)?.name || '筛选结果'}
                </h2>
                <p className="text-muted-foreground text-sm">
                  找到 {total} 个相关策略
                </p>
              </div>
            </div>
          </div>
        )}

        <StrategyList strategies={strategies} />

        {strategies.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted/50 flex items-center justify-center">
              <svg className="w-10 h-10 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-2">
              暂无符合条件的策略
            </h3>
            <p className="text-muted-foreground">
              试试调整筛选条件或{' '}
              <a href="/strategies" className="text-primary hover:underline">
                查看全部策略
              </a>
            </p>
          </div>
        )}

        {/* 分页组件 */}
        {strategies.length > 0 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            baseUrl="/strategies"
            searchParams={params}
          />
        )}
      </div>
    </div>
  );
}
