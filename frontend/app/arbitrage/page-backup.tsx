import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  TrendingUp,
  Shield,
  BookOpen,
  ArrowRight,
  Zap,
  DollarSign,
  BarChart3,
  Calculator,
  Bell,
  BookMarked
} from 'lucide-react';

// 套利类型数据（10大分类）
const arbitrageCategories = [
  {
    id: 'spot-microstructure',
    name: '现货/交易所微观结构',
    slug: 'spot-microstructure',
    count: 8,
    icon: '🔄',
    color: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
    description: '跨所价差、三角套利、CEX↔DEX等基础套利策略',
    types: ['跨所价差', '三角套利', 'CEX↔DEX', 'DEX↔DEX', '多路由价差', '手续费梯度', '结算币种换汇', '同所不同计价对']
  },
  {
    id: 'derivatives',
    name: '衍生品/基差与波动率',
    slug: 'derivatives',
    count: 12,
    icon: '📊',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
    description: '资金费率、期现套利、期权对冲等衍生品策略',
    types: ['资金费率', '期现套利', '永续现金套保', '跨所基差', '日历价差', '期权Delta对冲', '隐含波动率差', '偏度套利', '期权日历价差', 'Box Spread', '逆现金套保', 'Funding×Basis']
  },
  {
    id: 'stablecoin',
    name: '跨币种/稳定币与"外汇"',
    slug: 'stablecoin',
    count: 6,
    icon: '⚖️',
    color: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
    description: '稳定币脱锚、铸赎价差等稳定币套利策略',
    types: ['脱锚/回锚', '铸赎价差', '稳定币池深度差', '区域溢价', '相关性配对', '包装资产溢价']
  },
  {
    id: 'cross-chain',
    name: '跨链/桥接与结算',
    slug: 'cross-chain',
    count: 5,
    icon: '🌉',
    color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300',
    description: '跨链桥费率、L2↔L1等跨链套利策略',
    types: ['跨链桥费率', '同链多版本资产', 'L2↔L1退出折价', 'Gas窗口搬砖', '新链冷启动']
  },
  {
    id: 'liquidity-mining',
    name: '做市/流动性挖矿机制',
    slug: 'liquidity-mining',
    count: 4,
    icon: '💧',
    color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
    description: '集中流动性、做市补贴等DeFi挖矿策略',
    types: ['集中流动性再平衡', '返佣/做市补贴', '激励对冲', '点差套利']
  },
  {
    id: 'oracle-lending',
    name: '预言机/清算/借贷',
    slug: 'oracle-lending',
    count: 5,
    icon: '🔮',
    color: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
    description: '预言机滞后、清算折价等链上借贷策略',
    types: ['预言机滞后价差', '现货-预言机偏离', '借贷清算折价', '保险金库清算', '借贷利差']
  },
  {
    id: 'mev',
    name: 'MEV/链上执行',
    slug: 'mev',
    count: 5,
    icon: '⚡',
    color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300',
    description: '闪电贷、同区块套利等MEV策略',
    types: ['闪电贷跨池', '同区块套利', 'CEX-DEX同步', '失败退款/回扣', 'Gas竞价回扣']
  },
  {
    id: 'nft',
    name: 'NFT/点对点市场',
    slug: 'nft',
    count: 4,
    icon: '🎨',
    color: 'bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300',
    description: '跨市场地板差、NFT碎片化等NFT套利',
    types: ['跨市场地板差', '碎片化vs现货', '拍卖尾段机制差', '租赁/质押收益差']
  },
  {
    id: 'event-driven',
    name: '事件驱动/结构性',
    slug: 'event-driven',
    count: 6,
    icon: '📅',
    color: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
    description: '上线/下架、解锁对冲等事件驱动策略',
    types: ['上线/下架节奏', '解锁对冲', '分叉/快照捕获', '结构性产品溢折价', '期权到期挤压', '调费/规则切换']
  },
  {
    id: 'infrastructure',
    name: '成本/地域与基础设施',
    slug: 'infrastructure',
    count: 4,
    icon: '🏗️',
    color: 'bg-slate-100 text-slate-700 dark:bg-slate-950 dark:text-slate-300',
    description: '资金成本、法币通道等成本套利策略',
    types: ['资金成本利差', '法币入金通道费', '税务/合规成本差', '机房/托管/电价']
  }
];

// 实时机会预览数据（模拟）
const liveOpportunities = [
  {
    type: '跨所价差',
    symbol: 'BTC/USDT',
    details: 'Binance → OKX',
    profit: '0.42%',
    status: 'medium',
    icon: '🔄'
  },
  {
    type: '资金费率',
    symbol: 'ETH-PERP',
    details: 'Bybit 年化: 18.5%',
    profit: '18.5%',
    status: 'high',
    icon: '💰'
  },
  {
    type: '稳定币脱锚',
    symbol: 'USDT',
    details: '当前: $0.998',
    profit: '0.2%',
    status: 'low',
    icon: '⚖️'
  }
];

export default function ArbitragePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-purple-950/20 dark:via-blue-950/20 dark:to-cyan-950/20">
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] dark:bg-grid-slate-100/[0.02]" />
        <div className="container relative mx-auto px-4 py-20 sm:py-24 lg:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-4 bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
              币圈套利完全手册
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              发现价差，捕捉
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                无风险收益
              </span>
              机会
            </h1>
            <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
              50+ 套利类型系统解析 • 实时机会监控 • 零基础也能学会的套利策略
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/arbitrage/types">
                  <BookOpen className="mr-2 h-5 w-5" />
                  开始学习
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/arbitrage/live">
                  <Zap className="mr-2 h-5 w-5" />
                  查看实时机会
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Arbitrage */}
      <section className="container mx-auto px-4 py-16 sm:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">为什么选择套利？</h2>
          <p className="text-muted-foreground text-lg">相比单边交易，套利具有独特的优势</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          <Card>
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
                <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle>相对低风险</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                不依赖行情涨跌，利用价差锁定收益，市场中性策略降低方向性风险
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle>确定性收益</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                价差必然收敛，收益可预测可计算，不是靠运气而是靠套利逻辑
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                <BookOpen className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle>可学习掌握</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                规则明确清晰，有迹可循，通过系统学习和实践可以掌握套利技能
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Live Opportunities Preview */}
      <section className="bg-muted/30 py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                <h2 className="text-3xl font-bold">实时套利机会</h2>
              </div>
              <p className="text-muted-foreground">精选主流套利策略的实时市场数据</p>
            </div>
            <Button variant="outline" asChild className="hidden sm:flex">
              <Link href="/arbitrage/live">
                查看完整看板
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            {liveOpportunities.map((opportunity, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-3xl mb-2">{opportunity.icon}</div>
                      <CardTitle className="text-lg">{opportunity.type}</CardTitle>
                      <CardDescription className="mt-1">{opportunity.symbol}</CardDescription>
                    </div>
                    <Badge variant={
                      opportunity.status === 'high' ? 'default' :
                      opportunity.status === 'medium' ? 'secondary' : 'outline'
                    }>
                      {opportunity.status === 'high' ? '高收益' :
                       opportunity.status === 'medium' ? '中等机会' : '低风险'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{opportunity.details}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">预估收益</span>
                      <span className="text-xl font-bold text-green-600 dark:text-green-400">
                        {opportunity.profit}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center sm:hidden">
            <Button variant="outline" asChild className="w-full">
              <Link href="/arbitrage/live">
                查看完整看板
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Arbitrage Categories */}
      <section className="container mx-auto px-4 py-16 sm:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">50+ 套利类型全解析</h2>
          <p className="text-muted-foreground text-lg">
            从基础到高级，10大分类系统讲解每一种套利策略
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {arbitrageCategories.map((category) => (
            <Card key={category.id} className="hover:shadow-lg transition-shadow group">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{category.icon}</div>
                    <div>
                      <CardTitle className="group-hover:text-primary transition-colors">
                        {category.name}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {category.description}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={category.color}>
                    {category.count}种
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {category.types.slice(0, 4).map((type, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {type}
                    </Badge>
                  ))}
                  {category.types.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{category.types.length - 4}
                    </Badge>
                  )}
                </div>
                <Button variant="ghost" className="w-full" asChild>
                  <Link href={`/arbitrage/types/${category.slug}`}>
                    查看全部 {category.count} 种策略
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button size="lg" asChild>
            <Link href="/arbitrage/types">
              浏览所有套利类型
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Tools & Resources */}
      <section className="bg-muted/30 py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">实用工具与资源</h2>
            <p className="text-muted-foreground text-lg">
              让套利变得更简单高效
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Calculator className="h-8 w-8 text-purple-600 dark:text-purple-400 mb-2" />
                <CardTitle>收益计算器</CardTitle>
                <CardDescription>快速计算净利润和ROI</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/arbitrage/calculator">使用工具</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <BarChart3 className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-2" />
                <CardTitle>交易所对比</CardTitle>
                <CardDescription>费率、提现时间对比</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/arbitrage/tools">查看对比</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Bell className="h-8 w-8 text-green-600 dark:text-green-400 mb-2" />
                <CardTitle>提醒设置</CardTitle>
                <CardDescription>及时捕捉套利机会</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/arbitrage/alerts">设置提醒</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <BookMarked className="h-8 w-8 text-orange-600 dark:text-orange-400 mb-2" />
                <CardTitle>入门指南</CardTitle>
                <CardDescription>从零开始学套利</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/arbitrage/guide">开始学习</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 sm:py-20">
        <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-purple-200 dark:border-purple-800">
          <CardContent className="p-8 sm:p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">准备开始你的套利之旅？</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              加入数千名交易者，系统学习套利策略，发现更多盈利机会
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/arbitrage/types">
                  <BookOpen className="mr-2 h-5 w-5" />
                  浏览套利类型
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/pricing">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  升级高级会员
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
