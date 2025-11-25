'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  BookOpen,
  ArrowRight,
  Calculator,
  TrendingUp,
  CheckCircle,
  Lock,
  Zap,
  Target,
  Award,
  Users,
  Clock,
  DollarSign,
  BarChart3,
  Sparkles,
  Crown,
  ArrowUpRight,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function ArbitragePage() {
  // 套利计算器状态
  const [capital, setCapital] = useState('10000');
  const [arbitrageType, setArbitrageType] = useState('spot');
  const [period, setPeriod] = useState('30');

  // 计算收益
  const calculateProfit = () => {
    const amount = parseFloat(capital) || 0;
    const days = parseFloat(period) || 0;

    const rates: Record<string, { daily: number; label: string }> = {
      spot: { daily: 0.003, label: '跨所套利' },
      funding: { daily: 0.015, label: '资金费率' },
      stablecoin: { daily: 0.002, label: '稳定币脱锚' },
      triangle: { daily: 0.004, label: '三角套利' },
    };

    const rate = rates[arbitrageType] || rates.spot;
    const profit = amount * rate.daily * days;
    const roi = (rate.daily * days * 100).toFixed(2);

    return {
      profit: profit.toFixed(2),
      roi,
      label: rate.label,
    };
  };

  const result = calculateProfit();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50 dark:from-emerald-950/20 dark:via-cyan-950/20 dark:to-blue-950/20">
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] dark:bg-grid-slate-100/[0.02]"></div>

        <div className="container relative mx-auto px-4 py-20 sm:py-28">
          <div className="mx-auto max-w-5xl">
            {/* 标签 */}
            <div className="flex justify-center mb-6">
              <Badge className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-6 py-2 text-sm">
                <BookOpen className="h-3.5 w-3.5 mr-2" />
                完整套利知识体系
              </Badge>
            </div>

            {/* 主标题 */}
            <h1 className="text-center text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              币圈套利完全手册
              <br />
              <span className="bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
                从入门到精通
              </span>
            </h1>

            {/* 副标题 */}
            <p className="text-center text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-3xl mx-auto">
              50+ 套利策略详解 • 真实案例分析 • 手把手教学 • 风险控制指南
            </p>

            {/* 统计数据 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              <div className="text-center p-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="text-3xl font-bold text-emerald-600 mb-1">50+</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">套利策略</div>
              </div>
              <div className="text-center p-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="text-3xl font-bold text-cyan-600 mb-1">10</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">大分类</div>
              </div>
              <div className="text-center p-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="text-3xl font-bold text-blue-600 mb-1">100+</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">真实案例</div>
              </div>
              <div className="text-center p-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="text-3xl font-bold text-purple-600 mb-1">零基础</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">即可学习</div>
              </div>
            </div>

            {/* CTA 按钮 */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white shadow-lg shadow-emerald-500/30">
                <Link href="/arbitrage/types">
                  <BookOpen className="mr-2 h-5 w-5" />
                  开始学习
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#calculator">
                  <Calculator className="mr-2 h-5 w-5" />
                  体验收益计算器
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 互动计算器 */}
      <section id="calculator" className="py-20 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 mb-4">
                <Calculator className="h-3.5 w-3.5 mr-2" />
                互动体验
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">套利收益计算器</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                输入你的资金和策略，立即看到潜在收益
              </p>
            </div>

            <Card className="border-2 border-emerald-200 dark:border-emerald-800 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-emerald-950/30 dark:to-cyan-950/30">
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-emerald-600" />
                  计算你的套利收益
                </CardTitle>
                <CardDescription>
                  基于历史数据的收益预估（仅供参考）
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="capital">投入资金 (USDT)</Label>
                    <Input
                      id="capital"
                      type="number"
                      placeholder="10000"
                      value={capital}
                      onChange={(e) => setCapital(e.target.value)}
                      className="text-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">套利类型</Label>
                    <Select value={arbitrageType} onValueChange={setArbitrageType}>
                      <SelectTrigger id="type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="spot">跨所套利 (日均0.3%)</SelectItem>
                        <SelectItem value="funding">资金费率 (日均1.5%)</SelectItem>
                        <SelectItem value="stablecoin">稳定币脱锚 (日均0.2%)</SelectItem>
                        <SelectItem value="triangle">三角套利 (日均0.4%)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="period">持续时间 (天)</Label>
                    <Input
                      id="period"
                      type="number"
                      placeholder="30"
                      value={period}
                      onChange={(e) => setPeriod(e.target.value)}
                      className="text-lg"
                    />
                  </div>
                </div>

                {/* 计算结果 */}
                <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-950/30 dark:to-cyan-950/30 rounded-xl p-6 border-2 border-emerald-200 dark:border-emerald-800">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                    <h3 className="font-semibold text-lg">预估收益</h3>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">策略类型</div>
                      <div className="text-xl font-bold text-slate-900 dark:text-slate-100">
                        {result.label}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">预估收益</div>
                      <div className="text-2xl font-bold text-emerald-600">
                        ${result.profit}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">收益率</div>
                      <div className="text-2xl font-bold text-cyan-600">
                        {result.roi}%
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                    <p className="text-sm text-amber-800 dark:text-amber-200 flex items-start gap-2">
                      <span className="text-lg">⚠️</span>
                      <span>风险提示：以上为理想状态下的理论收益，实际操作中需考虑手续费、滑点、市场波动等因素。</span>
                    </p>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <Button size="lg" asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                    <Link href="/arbitrage/types">
                      <BookOpen className="mr-2 h-5 w-5" />
                      学习如何实操这些策略
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 真实案例展示 */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 mb-4">
              <Award className="h-3.5 w-3.5 mr-2" />
              成功案例
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">真实套利案例分析</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              这些都是历史上真实发生的套利机会，学习如何抓住下一次机会
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* 案例1 */}
            <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                    跨所套利
                  </Badge>
                  <Badge variant="outline">2024-03</Badge>
                </div>
                <CardTitle className="text-xl">BTC价差套利</CardTitle>
                <CardDescription>利用Binance和Bybit价差</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">投入资金</span>
                    <span className="font-semibold">$50,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">价差</span>
                    <span className="font-semibold text-emerald-600">0.34%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">执行时间</span>
                    <span className="font-semibold">15分钟</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t">
                    <span className="text-sm font-medium">净利润</span>
                    <span className="text-xl font-bold text-emerald-600">$61.65</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link href="/arbitrage/types/spot-arbitrage">
                    查看完整案例 <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* 案例2 */}
            <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-purple-200 dark:border-purple-800">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                    资金费率
                  </Badge>
                  <Badge variant="outline">2024-01</Badge>
                </div>
                <CardTitle className="text-xl flex items-center gap-2">
                  ETH资金费率套利
                  <Sparkles className="h-4 w-4 text-purple-500" />
                </CardTitle>
                <CardDescription>牛市期间高费率套利</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">投入资金</span>
                    <span className="font-semibold">$50,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">年化费率</span>
                    <span className="font-semibold text-purple-600">65%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">持有时间</span>
                    <span className="font-semibold">30天</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t">
                    <span className="text-sm font-medium">净利润</span>
                    <span className="text-xl font-bold text-purple-600">$2,600</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link href="/arbitrage/types/funding-rate-arbitrage">
                    查看完整案例 <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* 案例3 */}
            <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge className="bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300">
                    脱锚套利
                  </Badge>
                  <Badge variant="outline">2023-03</Badge>
                </div>
                <CardTitle className="text-xl">USDC脱锚事件</CardTitle>
                <CardDescription>SVB危机期间USDC套利</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">投入资金</span>
                    <span className="font-semibold">$88,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">买入价格</span>
                    <span className="font-semibold text-red-600">$0.88</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">持有时间</span>
                    <span className="font-semibold">3天</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t">
                    <span className="text-sm font-medium">净利润</span>
                    <span className="text-xl font-bold text-cyan-600">$11,000</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link href="/arbitrage/types/stablecoin-depeg-arbitrage">
                    查看完整案例 <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button size="lg" variant="outline" asChild>
              <Link href="/arbitrage/types">
                查看完整100+案例库 <ArrowUpRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 知识库预览 */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 mb-4">
              <BookOpen className="h-3.5 w-3.5 mr-2" />
              完整知识体系
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">50+ 套利策略全解析</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              从基础到高级，10大分类系统讲解每一种套利策略
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: '🔄',
                name: '现货/交易所微观结构',
                count: 8,
                color: 'from-purple-500 to-blue-500',
                items: ['跨所价差', '三角套利', 'CEX↔DEX', 'DEX↔DEX']
              },
              {
                icon: '📊',
                name: '衍生品/合约',
                count: 12,
                color: 'from-blue-500 to-cyan-500',
                items: ['资金费率', '期现套利', '期权对冲', '基差交易']
              },
              {
                icon: '💵',
                name: '稳定币/法币',
                count: 6,
                color: 'from-green-500 to-emerald-500',
                items: ['脱锚套利', '铸赎价差', '区域溢价', '汇率套利']
              },
              {
                icon: '🌉',
                name: '跨链/桥接',
                count: 5,
                color: 'from-orange-500 to-red-500',
                items: ['跨链桥费率', 'L2↔L1', 'Gas窗口', '多链DEX']
              },
              {
                icon: '💧',
                name: '做市/流动性挖矿',
                count: 4,
                color: 'from-indigo-500 to-purple-500',
                items: ['集中流动性', '返佣补贴', '激励对冲', '点差套利']
              },
              {
                icon: '⚡',
                name: 'MEV/链上执行',
                count: 5,
                color: 'from-yellow-500 to-orange-500',
                items: ['闪电贷', '同区块套利', 'CEX-DEX同步', 'Gas竞价']
              },
            ].map((category, idx) => (
              <Card key={idx} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-4xl">{category.icon}</div>
                    <Badge className={`bg-gradient-to-r ${category.color} text-white`}>
                      {category.count}种
                    </Badge>
                  </div>
                  <CardTitle className="text-lg group-hover:text-emerald-600 transition-colors">
                    {category.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    {category.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                        <span>{item}</span>
                      </div>
                    ))}
                    {category.count > 4 && (
                      <div className="text-sm text-slate-500 dark:text-slate-500 pl-5">
                        +{category.count - 4} 更多策略...
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button size="lg" asChild className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white shadow-lg">
              <Link href="/arbitrage/types">
                <BookOpen className="mr-2 h-5 w-5" />
                探索完整知识库
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 会员价值对比 */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 mb-4">
              <Crown className="h-3.5 w-3.5 mr-2" />
              会员权益
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">升级解锁更多价值</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              从学习到实战，Pro会员助你成为套利高手
            </p>
          </div>

          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
            {/* 免费 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">免费会员</CardTitle>
                <div className="text-3xl font-bold">$0</div>
                <CardDescription>基础学习内容</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5" />
                    <span className="text-sm">10个基础套利策略</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5" />
                    <span className="text-sm">简易收益计算器</span>
                  </li>
                  <li className="flex items-start gap-2 opacity-40">
                    <Lock className="h-5 w-5 mt-0.5" />
                    <span className="text-sm line-through">完整50+策略详解</span>
                  </li>
                  <li className="flex items-start gap-2 opacity-40">
                    <Lock className="h-5 w-5 mt-0.5" />
                    <span className="text-sm line-through">100+真实案例库</span>
                  </li>
                  <li className="flex items-start gap-2 opacity-40">
                    <Lock className="h-5 w-5 mt-0.5" />
                    <span className="text-sm line-through">高级计算器工具</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full mt-6" asChild>
                  <Link href="/arbitrage/types">开始学习</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Pro - 推荐 */}
            <Card className="border-2 border-purple-500 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1">
                  推荐
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-xl">Pro 会员</CardTitle>
                <div className="text-3xl font-bold">
                  $29
                  <span className="text-base font-normal text-slate-500">/月</span>
                </div>
                <CardDescription>完整知识库访问</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-purple-500 mt-0.5" />
                    <span className="text-sm font-medium">50+套利策略完整详解</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-purple-500 mt-0.5" />
                    <span className="text-sm font-medium">100+真实案例分析</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-purple-500 mt-0.5" />
                    <span className="text-sm font-medium">高级收益计算器</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-purple-500 mt-0.5" />
                    <span className="text-sm font-medium">风险评估工具</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-purple-500 mt-0.5" />
                    <span className="text-sm font-medium">每周策略更新</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-purple-500 mt-0.5" />
                    <span className="text-sm font-medium">社区讨论权限</span>
                  </li>
                </ul>
                <Button className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700" asChild>
                  <Link href="/pricing">
                    <Crown className="mr-2 h-4 w-4" />
                    立即升级
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Max */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Max 会员</CardTitle>
                <div className="text-3xl font-bold">
                  $99
                  <span className="text-base font-normal text-slate-500">/月</span>
                </div>
                <CardDescription>Pro + 深度服务</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                    <span className="text-sm">Pro 所有权益</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                    <span className="text-sm font-medium">1对1策略咨询</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                    <span className="text-sm font-medium">定制化方案</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                    <span className="text-sm font-medium">API接口访问</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                    <span className="text-sm font-medium">优先客服支持</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full mt-6" asChild>
                  <Link href="/pricing">了解详情</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ + CTA */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">常见问题</h2>
          </div>

          <div className="space-y-4 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">套利真的能赚钱吗？</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-400">
                  是的，但需要正确的知识、工具和风险管理。我们的内容基于真实市场数据和案例，帮助你系统学习套利策略。记住：套利不是"躺赚"，需要学习和实践。
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">我是新手，能学会吗？</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-400">
                  完全可以！我们从最基础的概念开始讲解，提供手把手的教学和真实案例。即使零基础，也能通过系统学习掌握套利技能。
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">需要多少启动资金？</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-400">
                  不同策略需要的资金不同。有些策略$1000就能开始（如跨所套利），有些需要$10000+（如资金费率套利）。我们会为每个策略标注资金需求。
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">你们提供实时套利信号吗？</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-400">
                  目前我们专注于提供完整的套利知识教育和策略分析，帮助你学会自己发现机会。"授人以鱼不如授人以渔" - 掌握方法比依赖信号更有价值。
                </p>
              </CardContent>
            </Card>
          </div>

          {/* 最终CTA */}
          <Card className="bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50 dark:from-emerald-950/30 dark:via-cyan-950/30 dark:to-blue-950/30 border-2 border-emerald-200 dark:border-emerald-800">
            <CardContent className="py-12 text-center">
              <h2 className="text-3xl font-bold mb-4">准备开始你的套利之旅了吗？</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
                加入数千名学员，从零开始学习加密货币套利
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" asChild className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white shadow-lg shadow-emerald-500/30">
                  <Link href="/arbitrage/types">
                    <BookOpen className="mr-2 h-5 w-5" />
                    免费开始学习
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/pricing">
                    <Crown className="mr-2 h-5 w-5" />
                    查看会员计划
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
