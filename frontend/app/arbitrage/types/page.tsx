import { getArbitrageTypes } from '@/lib/directus';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowRight, TrendingUp, Shield, Zap, Clock, DollarSign } from 'lucide-react';

export const metadata = {
  title: '套利类型大全 - PlayNew.ai',
  description: '探索50+加密货币套利策略，从跨所搬砖到资金费率套利，全面的套利知识库。',
};

// Category mapping
const categoryInfo: Record<string, { name: string; icon: string; color: string; description: string }> = {
  'spot-microstructure': {
    name: '现货/交易所微观结构',
    icon: '🔄',
    color: 'from-purple-500 to-blue-500',
    description: '跨所价差、三角套利、CEX↔DEX等基础套利策略'
  },
  'derivatives': {
    name: '衍生品/合约',
    icon: '📊',
    color: 'from-blue-500 to-cyan-500',
    description: '资金费率、期现套利、期权策略'
  },
  'stablecoin-fiat': {
    name: '稳定币/法币',
    icon: '💵',
    color: 'from-green-500 to-emerald-500',
    description: '稳定币脱锚、汇率套利、C2C溢价'
  },
  'cross-chain': {
    name: '链与链之间',
    icon: '🌉',
    color: 'from-orange-500 to-red-500',
    description: '跨链桥套利、多链DEX价差'
  },
  'defi-internal': {
    name: 'DeFi内部',
    icon: '🏦',
    color: 'from-pink-500 to-purple-500',
    description: 'AMM套利、闪电贷、协议价差'
  },
  'temporal': {
    name: '周期/时间相关',
    icon: '⏰',
    color: 'from-yellow-500 to-orange-500',
    description: '期限套利、到期策略、季节性机会'
  },
  'governance': {
    name: '治理/机制',
    icon: '🗳️',
    color: 'from-indigo-500 to-blue-500',
    description: '空投套利、治理挖矿、投票激励'
  },
  'information-driven': {
    name: '信息/事件驱动',
    icon: '📰',
    color: 'from-red-500 to-pink-500',
    description: '上线抢跑、新闻交易、信息不对称'
  },
  'mev-trading': {
    name: 'MEV/交易策略',
    icon: '⚙️',
    color: 'from-slate-500 to-gray-500',
    description: '三明治攻击、抢跑、套利机器人'
  },
  'regulatory': {
    name: '监管/合规',
    icon: '⚖️',
    color: 'from-blue-500 to-indigo-500',
    description: '税收优化、监管套利、地域差异'
  },
};

// Difficulty badge
function DifficultyBadge({ level }: { level: number }) {
  const configs = {
    1: { label: '初级', className: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' },
    2: { label: '中级', className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' },
    3: { label: '高级', className: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' },
  };
  const config = configs[level as keyof typeof configs] || configs[1];
  return <Badge className={config.className}>{config.label}</Badge>;
}

// Risk badge
function RiskBadge({ level }: { level: number }) {
  const configs = {
    1: { label: '低风险', className: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' },
    2: { label: '中等', className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' },
    3: { label: '高风险', className: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' },
  };
  const config = configs[level as keyof typeof configs] || configs[1];
  return <Badge className={config.className}>{config.label}</Badge>;
}

export default async function ArbitrageTypesPage() {
  const allTypes = await getArbitrageTypes();

  // Group by category
  const typesByCategory: Record<string, typeof allTypes> = {};
  allTypes.forEach((type) => {
    if (!typesByCategory[type.category]) {
      typesByCategory[type.category] = [];
    }
    typesByCategory[type.category].push(type);
  });

  const categories = Object.keys(typesByCategory).sort();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-block mb-4">
            <Badge className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-sm px-4 py-1">
              套利知识库
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
            加密货币套利类型大全
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            深度解析50+种加密货币套利策略，从基础到高级，助你发现无风险收益机会
          </p>
          <div className="flex items-center justify-center gap-6 mt-6 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              <span>{allTypes.length} 种策略</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-500" />
              <span>{categories.length} 个分类</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-purple-500" />
              <span>持续更新</span>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-16">
          {categories.map((categorySlug) => {
            const category = categoryInfo[categorySlug];
            const types = typesByCategory[categorySlug];

            return (
              <div key={categorySlug} id={categorySlug}>
                {/* Category Header */}
                <div className="mb-8">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="text-4xl">{category?.icon || '📊'}</div>
                    <div>
                      <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                        {category?.name || categorySlug}
                      </h2>
                      <p className="text-slate-600 dark:text-slate-400 mt-1">
                        {category?.description}
                      </p>
                    </div>
                  </div>
                  <Badge className={`bg-gradient-to-r ${category?.color} text-white`}>
                    {types.length} 种策略
                  </Badge>
                </div>

                {/* Types Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {types.map((type) => (
                    <Link
                      key={type.id}
                      href={`/arbitrage/types/${type.slug}`}
                      className="group"
                    >
                      <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-slate-200 dark:border-slate-800">
                        <CardHeader>
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex gap-2 flex-wrap">
                              <DifficultyBadge level={type.difficulty_level} />
                              <RiskBadge level={type.risk_level} />
                            </div>
                            {type.has_realtime_data && (
                              <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 text-xs">
                                实时数据
                              </Badge>
                            )}
                          </div>
                          <CardTitle className="text-xl group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            {type.title}
                          </CardTitle>
                          {type.title_en && (
                            <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                              {type.title_en}
                            </div>
                          )}
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <CardDescription className="line-clamp-3">
                            {type.summary}
                          </CardDescription>

                          {/* Key Metrics */}
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            {type.profit_potential && (
                              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
                                <span className="truncate">{type.profit_potential}</span>
                              </div>
                            )}
                            {type.execution_speed && (
                              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                <Clock className="h-3.5 w-3.5 text-blue-500" />
                                <span>
                                  {type.execution_speed === 'seconds' && '秒级'}
                                  {type.execution_speed === 'minutes' && '分钟级'}
                                  {type.execution_speed === 'hours' && '小时级'}
                                  {type.execution_speed === 'days' && '天级'}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Tags */}
                          {type.tags && type.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {type.tags.slice(0, 3).map((tag, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs bg-slate-50 dark:bg-slate-900"
                                >
                                  {tag}
                                </Badge>
                              ))}
                              {type.tags.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{type.tags.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}

                          {/* Learn More */}
                          <div className="flex items-center text-sm text-emerald-600 dark:text-emerald-400 font-medium pt-2 group-hover:gap-2 transition-all">
                            <span>查看详情</span>
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <Card className="bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-950/30 dark:to-cyan-950/30 border-emerald-200 dark:border-emerald-800">
            <CardContent className="py-12">
              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
                想要获取实时套利机会？
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-2xl mx-auto">
                升级到Pro会员，解锁实时套利信号、专属工具和高级策略分析
              </p>
              <div className="flex items-center justify-center gap-4">
                <Link href="/pricing">
                  <button className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white rounded-xl font-medium shadow-lg shadow-emerald-500/30 transition-all">
                    查看会员计划
                  </button>
                </Link>
                <Link href="/arbitrage">
                  <button className="px-6 py-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-medium border border-slate-300 dark:border-slate-600 transition-all">
                    返回首页
                  </button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
