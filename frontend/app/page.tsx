import { getStrategies, getCategories, getNews, getPlatformStats, getTotalStrategiesCount } from '@/lib/directus';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AnimatedParticles } from '@/components/shared/AnimatedParticles';
import {
  ArrowRight,
  TrendingUp,
  Shield,
  Zap,
  Newspaper,
  Rocket,
  Sparkles,
  ChevronRight,
  Clock,
  ExternalLink,
  Flame,
  Users,
  DollarSign,
  Target,
  Activity,
  Crown,
  Gift,
  Upload,
  Coins,
} from 'lucide-react';

function getRiskBadge(level: number) {
  const configs = [
    { variant: 'outline' as const, label: '未知', color: 'text-gray-600' },
    { variant: 'secondary' as const, label: '极低', color: 'text-green-600' },
    { variant: 'secondary' as const, label: '低风险', color: 'text-green-600' },
    { variant: 'default' as const, label: '中风险', color: 'text-yellow-600' },
    { variant: 'destructive' as const, label: '中高', color: 'text-orange-600' },
    { variant: 'destructive' as const, label: '高风险', color: 'text-red-600' },
  ];
  const config = configs[level] || configs[0];

  return (
    <Badge variant={config.variant} className="shrink-0">
      {config.label}
    </Badge>
  );
}

function formatNumber(num: number): string {
  if (num >= 10000) {
    return `${(num / 10000).toFixed(1)}万`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return num.toString();
}

// Enable ISR with 60 second revalidation for better performance
export const revalidate = 60;

// 启用静态生成优化
export const dynamic = 'force-static';

export default async function Home() {
  // 优化：使用 Promise.allSettled 避免单个请求失败影响整个页面
  const results = await Promise.allSettled([
    getStrategies({ limit: 6, featured: true }), // 只获取精选策略
    getCategories(),
    getNews({ limit: 5 }),
    getPlatformStats(),
    getTotalStrategiesCount(),
  ]);

  // 解构结果，提供默认值
  const strategiesResult = results[0].status === 'fulfilled'
    ? results[0].value
    : { strategies: [], total: 0, page: 1, totalPages: 1 };
  const categories = results[1].status === 'fulfilled' ? results[1].value : [];
  const news = results[2].status === 'fulfilled' ? results[2].value : [];
  const stats = results[3].status === 'fulfilled'
    ? results[3].value
    : { totalUsers: 20864, totalStrategies: 138, totalNews: 50, totalCategories: 47, activeSubscriptions: 3129, totalRevenue: 935571, monthlyGrowth: 12.5 };
  const totalStrategies = results[4].status === 'fulfilled' ? results[4].value : 138;

  const strategies = strategiesResult.strategies;

  return (
    <div className="min-h-screen">
      {/* Hero Section - Web3 风格设计 */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
        {/* Web3 六边形网格背景 */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(30deg, transparent 48%, rgba(99, 102, 241, 0.3) 49%, rgba(99, 102, 241, 0.3) 51%, transparent 52%),
                linear-gradient(-30deg, transparent 48%, rgba(99, 102, 241, 0.3) 49%, rgba(99, 102, 241, 0.3) 51%, transparent 52%)
              `,
              backgroundSize: '60px 35px',
              backgroundPosition: '0 0, 30px 17.5px'
            }}
          />
        </div>

        {/* 区块链节点连线动画背景 */}
        <AnimatedParticles />

        {/* 渐变光晕 - Web3 主题色 */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob" />
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/2 w-[500px] h-[500px] bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob animation-delay-4000" />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-28">
          <div className="max-w-6xl mx-auto text-center text-white">
            {/* Web3 标签徽章 - 区块链风格 */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 backdrop-blur-md px-5 py-2.5 rounded-full mb-8 border border-cyan-400/30 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
              </div>
              <span className="text-sm font-semibold bg-gradient-to-r from-cyan-200 to-indigo-200 bg-clip-text text-transparent">PlayNew · 新玩意</span>
            </div>

            {/* 核心 Slogan - 保持不变 */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight tracking-tight">
              新玩意
              <br />
              <span className="bg-gradient-to-r from-cyan-300 via-indigo-300 to-purple-300 bg-clip-text text-transparent">
                你在币圈的唯一人脉！
              </span>
            </h1>

            {/* 副标题 - Web3 化 */}
            <p className="text-lg md:text-xl mb-12 text-cyan-100 leading-relaxed max-w-3xl mx-auto font-light">
              <span className="inline-flex items-center gap-2">
                <span className="hidden sm:inline">🌐</span>
                连接 Web3 玩家，共享最新玩法
              </span>
              <br className="hidden md:block" />
              <span className="text-indigo-200">从 DeFi 收益到空投机会，从协议研究到市场洞察</span>
            </p>

            {/* CTA 按钮组 - 加密货币风格 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white shadow-[0_0_30px_rgba(34,211,238,0.3)] font-bold text-lg px-8 h-14 group border-0"
              >
                <Link href="/strategies" className="flex items-center gap-2">
                  <Rocket className="h-5 w-5" />
                  探索玩法库
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>

            {/* Web3 钱包风格数据卡片 - 全新设计 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {/* 活跃用户 - 紫色主题 */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-sm group-hover:blur-md transition-all opacity-50" />
                <div className="relative bg-gradient-to-br from-purple-900/90 to-pink-900/90 backdrop-blur-xl rounded-2xl p-5 border border-purple-400/30 hover:border-purple-400/60 transition-all shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                  <div className="flex items-center justify-center mb-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <Users className="h-6 w-6 text-purple-300" />
                    </div>
                  </div>
                  <div className="text-3xl md:text-4xl font-black mb-1 text-center bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">{formatNumber(stats.totalUsers)}+</div>
                  <div className="text-xs text-purple-200/80 font-medium text-center">活跃用户</div>
                </div>
              </div>

              {/* 精选玩法 - 绿色主题 */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-2xl blur-sm group-hover:blur-md transition-all opacity-50" />
                <div className="relative bg-gradient-to-br from-emerald-900/90 to-cyan-900/90 backdrop-blur-xl rounded-2xl p-5 border border-emerald-400/30 hover:border-emerald-400/60 transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                  <div className="flex items-center justify-center mb-3">
                    <div className="p-2 bg-emerald-500/20 rounded-lg">
                      <Target className="h-6 w-6 text-emerald-300" />
                    </div>
                  </div>
                  <div className="text-3xl md:text-4xl font-black mb-1 text-center bg-gradient-to-r from-emerald-200 to-cyan-200 bg-clip-text text-transparent">{totalStrategies}+</div>
                  <div className="text-xs text-emerald-200/80 font-medium text-center">精选玩法</div>
                </div>
              </div>

              {/* 累计收益 - 金色主题 */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl blur-sm group-hover:blur-md transition-all opacity-50" />
                <div className="relative bg-gradient-to-br from-amber-900/90 to-orange-900/90 backdrop-blur-xl rounded-2xl p-5 border border-amber-400/30 hover:border-amber-400/60 transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                  <div className="flex items-center justify-center mb-3">
                    <div className="p-2 bg-amber-500/20 rounded-lg">
                      <DollarSign className="h-6 w-6 text-amber-300" />
                    </div>
                  </div>
                  <div className="text-3xl md:text-4xl font-black mb-1 text-center bg-gradient-to-r from-amber-200 to-orange-200 bg-clip-text text-transparent">{formatNumber(stats.totalRevenue)}</div>
                  <div className="text-xs text-amber-200/80 font-medium text-center">累计收益(¥)</div>
                </div>
              </div>

              {/* 月度增长 - 蓝色主题 */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-sm group-hover:blur-md transition-all opacity-50" />
                <div className="relative bg-gradient-to-br from-blue-900/90 to-indigo-900/90 backdrop-blur-xl rounded-2xl p-5 border border-blue-400/30 hover:border-blue-400/60 transition-all shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                  <div className="flex items-center justify-center mb-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Activity className="h-6 w-6 text-blue-300" />
                    </div>
                  </div>
                  <div className="text-3xl md:text-4xl font-black mb-1 flex items-center justify-center gap-1 bg-gradient-to-r from-blue-200 to-indigo-200 bg-clip-text text-transparent">
                    <TrendingUp className="h-5 w-5 text-blue-300" />
                    {stats.monthlyGrowth}%
                  </div>
                  <div className="text-xs text-blue-200/80 font-medium text-center">月度增长</div>
                </div>
              </div>
            </div>

            {/* Web3 装饰元素 */}
            <div className="mt-12 flex items-center justify-center gap-6 text-xs text-indigo-300/60 font-mono">
              <span className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                On-Chain
              </span>
              <span className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse animation-delay-500" />
                Decentralized
              </span>
              <span className="hidden sm:flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-purple-400 animate-pulse animation-delay-1000" />
                Community-Driven
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 核心板块导航 */}
      <div className="bg-background border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* 上传玩法赚积分 - 营销横幅 */}
          <Link href="/member-center?tab=submit" className="block max-w-5xl mx-auto mb-8">
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 p-[1px] hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-500">
              <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-violet-600/95 via-purple-600/95 to-fuchsia-600/95 px-6 py-4 backdrop-blur-sm">
                {/* 背景动画光效 */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />

                {/* 左侧内容 */}
                <div className="relative flex items-center gap-4">
                  <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <Gift className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-center sm:text-left">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <span className="text-white font-bold text-lg">分享玩法赚积分</span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-sm">
                        <Sparkles className="h-3 w-3 mr-1" />
                        限时活动
                      </span>
                    </div>
                    <p className="text-purple-100 text-sm mt-1">
                      上传优质玩法，审核通过即获
                      <span className="inline-flex items-center mx-1.5 px-2 py-0.5 rounded-md bg-white/25 font-bold text-white">
                        <Coins className="h-3 w-3 mr-1" />
                        50-200 PP
                      </span>
                      奖励
                    </p>
                  </div>
                </div>

                {/* 右侧按钮 */}
                <div className="relative flex items-center gap-3">
                  <div className="hidden md:flex items-center gap-3 text-purple-200 text-sm">
                    <span className="flex items-center gap-1"><Upload className="h-3.5 w-3.5" />简单</span>
                    <span className="w-1 h-1 rounded-full bg-purple-300/50" />
                    <span className="flex items-center gap-1"><Zap className="h-3.5 w-3.5" />快速</span>
                    <span className="w-1 h-1 rounded-full bg-purple-300/50" />
                    <span className="flex items-center gap-1"><Shield className="h-3.5 w-3.5" />安全</span>
                  </div>
                  <div className="flex items-center gap-2 px-5 py-2.5 bg-white rounded-xl font-bold text-purple-700 shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                    立即参与
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </Link>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* 玩法库入口 */}
            <Link href="/strategies">
              <Card className="h-full border-2 hover:border-purple-500 transition-all duration-300 cursor-pointer group hover:shadow-2xl hover:shadow-purple-500/10">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl group-hover:scale-110 transition-transform">
                      <Rocket className="h-8 w-8 text-white" />
                    </div>
                    <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                      {totalStrategies}+ 玩法
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl mb-2 group-hover:text-purple-600 transition-colors">
                    玩法库
                  </CardTitle>
                  <CardDescription className="text-base">
                    探索经过验证的 DeFi 策略、空投机会、流动性挖矿等多种盈利玩法
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-purple-600 dark:text-purple-400 font-semibold group-hover:translate-x-2 transition-transform">
                    浏览全部玩法
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* 快讯入口 */}
            <Link href="/news">
              <Card className="h-full border-2 hover:border-blue-500 transition-all duration-300 cursor-pointer group hover:shadow-2xl hover:shadow-blue-500/10">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl group-hover:scale-110 transition-transform">
                      <Newspaper className="h-8 w-8 text-white" />
                    </div>
                    <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                      实时更新
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl mb-2 group-hover:text-blue-600 transition-colors">
                    行业快讯
                  </CardTitle>
                  <CardDescription className="text-base">
                    追踪最新的加密货币新闻、协议更新、市场动态和行业洞察
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-blue-600 dark:text-blue-400 font-semibold group-hover:translate-x-2 transition-transform">
                    查看最新快讯
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>

      {/* 热门玩法分类 */}
      <div className="bg-muted/30 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">热门分类</h2>
              <p className="text-muted-foreground">选择你感兴趣的玩法类型</p>
            </div>
            <Button asChild variant="ghost" className="hidden md:flex">
              <Link href="/strategies" className="group">
                查看全部
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.slice(0, 8).map((category: any) => (
              <Link key={category.id} href={`/strategies?category=${category.slug}`}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:border-primary cursor-pointer group hover:-translate-y-1">
                  <CardHeader className="pb-3">
                    <div className="flex flex-col items-center text-center gap-3">
                      <div className="text-4xl group-hover:scale-110 transition-transform">
                        {category.icon || '📊'}
                      </div>
                      <CardTitle className="text-base font-semibold group-hover:text-primary transition-colors">
                        {category.name}
                      </CardTitle>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 精选玩法 */}
      <div className="bg-background py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-orange-400 to-pink-500 rounded-lg">
                <Flame className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold">精选玩法</h2>
                <p className="text-muted-foreground">团队精选的高质量策略</p>
              </div>
            </div>
            <Button asChild variant="outline" className="hidden md:flex">
              <Link href="/strategies" className="group">
                查看全部
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {strategies.map((strategy: any) => (
              <Link key={strategy.id} href={`/strategies/${strategy.slug}`}>
                <Card className="h-full hover:shadow-xl transition-all duration-300 hover:border-purple-500 cursor-pointer group hover:-translate-y-1">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <CardTitle className="text-lg font-bold group-hover:text-purple-600 transition-colors line-clamp-2 flex-1">
                        {strategy.title}
                      </CardTitle>
                      {getRiskBadge(strategy.risk_level)}
                    </div>
                    <CardDescription className="line-clamp-2 text-sm">
                      {strategy.summary}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    {/* 收益展示 */}
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                        <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-muted-foreground mb-0.5">预期收益</div>
                        <div className="font-bold text-green-700 dark:text-green-400 text-sm">
                          {strategy.apy_min === 0 && strategy.apy_max === 0
                            ? '空投潜力'
                            : `${strategy.apy_min}% - ${strategy.apy_max}%`}
                        </div>
                      </div>
                    </div>

                    {/* 门槛信息 */}
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                        <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-muted-foreground mb-0.5">资金门槛</div>
                        <div className="font-bold text-blue-700 dark:text-blue-400 text-sm line-clamp-2">
                          {strategy.threshold_capital}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* 移动端查看更多按钮 */}
          <div className="mt-8 text-center md:hidden">
            <Button asChild variant="outline" size="lg">
              <Link href="/strategies">
                查看全部玩法
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* 最新快讯 */}
      <div className="bg-muted/30 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold">最新快讯</h2>
                <p className="text-muted-foreground">实时追踪行业动态</p>
              </div>
            </div>
            <Button asChild variant="outline" className="hidden md:flex">
              <Link href="/news" className="group">
                查看全部
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-4 max-w-4xl mx-auto">
            {news.slice(0, 5).map((item: any, index: number) => (
              <Link key={item.id} href={`/news/${item.id}`}>
                <Card className="hover:shadow-lg transition-all duration-300 hover:border-blue-500 cursor-pointer group">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      {/* 序号标识 */}
                      <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg ${
                        index === 0
                          ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white'
                          : index === 1
                          ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white'
                          : index === 2
                          ? 'bg-gradient-to-br from-orange-300 to-orange-400 text-white'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {index + 1}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {item.title}
                        </h3>

                        {item.ai_summary && (
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {item.ai_summary}
                          </p>
                        )}

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          {item.category && (
                            <Badge variant="secondary" className="text-xs">
                              {item.category}
                            </Badge>
                          )}
                          {item.source && (
                            <span className="flex items-center gap-1">
                              <ExternalLink className="h-3 w-3" />
                              {item.source}
                            </span>
                          )}
                          {item.content_published_at && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(item.content_published_at).toLocaleDateString('zh-CN')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* 移动端查看更多按钮 */}
          <div className="mt-8 text-center md:hidden">
            <Button asChild variant="outline" size="lg">
              <Link href="/news">
                查看全部快讯
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* 底部 CTA - 更新 Slogan */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 text-white">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem]" />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-white/20">
            <Sparkles className="h-4 w-4 text-yellow-300" />
            <span className="text-sm font-semibold">加入我们的社区</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-black mb-4">
            新玩意，你在币圈的唯一人脉！
          </h2>
          <p className="text-xl text-purple-100 mb-10 max-w-2xl mx-auto">
            {formatNumber(stats.totalUsers)}+ 用户正在使用PlayNew，发现最新的Web3机会
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-purple-600 hover:bg-blue-50 font-bold text-lg px-8 h-14 shadow-2xl"
            >
              <Link href="/strategies">
                立即探索玩法库
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            {/* 会员功能已暂停 */}
            {/* <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 font-semibold text-lg px-8 h-14"
            >
              <Link href="/pricing" className="flex items-center gap-2">
                <Crown className="h-5 w-5" />
                查看会员方案
              </Link>
            </Button> */}
          </div>
        </div>
      </div>
    </div>
  );
}
