import { notFound } from 'next/navigation';
import { getArbitrageType, getArbitrageTypes } from '@/lib/directus';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import {
  ArrowLeft,
  TrendingUp,
  Shield,
  Clock,
  DollarSign,
  Zap,
  AlertTriangle,
  Lightbulb,
  BookOpen,
  Wrench,
  CheckCircle,
  XCircle,
  Target,
} from 'lucide-react';
import { ArbitrageDetailClient } from './ArbitrageDetailClient';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const type = await getArbitrageType(slug);

  if (!type) {
    return {
      title: '套利类型未找到',
    };
  }

  return {
    title: `${type.title} - 套利策略详解 - PlayNew.ai`,
    description: type.summary,
  };
}

export async function generateStaticParams() {
  const types = await getArbitrageTypes();
  return types.map((type) => ({
    slug: type.slug,
  }));
}

// Difficulty badge
function DifficultyBadge({ level }: { level: number }) {
  const configs = {
    1: { label: '初级', className: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300', icon: '🟢' },
    2: { label: '中级', className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300', icon: '🟡' },
    3: { label: '高级', className: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300', icon: '🔴' },
  };
  const config = configs[level as keyof typeof configs] || configs[1];
  return (
    <Badge className={config.className}>
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </Badge>
  );
}

// Risk badge
function RiskBadge({ level }: { level: number }) {
  const configs = {
    1: { label: '低风险', className: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300', icon: <Shield className="h-3 w-3" /> },
    2: { label: '中等风险', className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300', icon: <Shield className="h-3 w-3" /> },
    3: { label: '高风险', className: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300', icon: <AlertTriangle className="h-3 w-3" /> },
  };
  const config = configs[level as keyof typeof configs] || configs[1];
  return (
    <Badge className={`${config.className} flex items-center gap-1`}>
      {config.icon}
      {config.label}
    </Badge>
  );
}

// Capital requirement badge
function CapitalBadge({ requirement }: { requirement?: string }) {
  if (!requirement) return null;

  const configs: Record<string, { label: string; className: string }> = {
    'small': { label: '小额 (<$1K)', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' },
    'medium': { label: '中等 ($1K-$10K)', className: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' },
    'large': { label: '大额 ($10K-$100K)', className: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300' },
    'very-large': { label: '超大 (>$100K)', className: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' },
  };

  const config = configs[requirement] || { label: requirement, className: 'bg-slate-100 text-slate-700' };
  return <Badge className={config.className}>{config.label}</Badge>;
}

export default async function ArbitrageTypeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const type = await getArbitrageType(slug);

  if (!type) {
    notFound();
  }

  return (
    <ArbitrageDetailClient>
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/arbitrage/types"
            className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            返回套利类型列表
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <DifficultyBadge level={type.difficulty_level} />
            <RiskBadge level={type.risk_level} />
            <CapitalBadge requirement={type.capital_requirement} />
            {type.has_realtime_data && (
              <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                <Zap className="h-3 w-3 mr-1" />
                实时数据
              </Badge>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
            {type.title}
          </h1>

          {type.title_en && (
            <div className="text-lg text-slate-500 dark:text-slate-400 font-mono mb-4">
              {type.title_en}
            </div>
          )}

          <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
            {type.summary}
          </p>
        </div>

        {/* Key Metrics */}
        <Card className="mb-8 bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-950/30 dark:to-cyan-950/30 border-emerald-200 dark:border-emerald-800">
          <CardContent className="py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {type.profit_potential && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
                    <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">收益潜力</div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100">
                      {type.profit_potential}
                    </div>
                  </div>
                </div>
              )}

              {type.execution_speed && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">执行速度</div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100">
                      {type.execution_speed === 'seconds' && '秒级执行'}
                      {type.execution_speed === 'minutes' && '分钟级'}
                      {type.execution_speed === 'hours' && '小时级'}
                      {type.execution_speed === 'days' && '天级'}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">浏览量</div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100">
                    {type.view_count.toLocaleString()} 次
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tags */}
        {type.tags && type.tags.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            {type.tags.map((tag, index) => (
              <Badge
                key={index}
                variant="outline"
                className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Main Description */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-emerald-600" />
              策略概述
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {type.description}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>

        {/* How It Works */}
        {type.how_it_works && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                工作原理
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {type.how_it_works}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step by Step */}
        {type.step_by_step && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
                操作步骤
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {type.step_by_step}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Requirements */}
        {type.requirements && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-purple-600" />
                所需条件
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {type.requirements}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Risks */}
        {type.risks && (
          <Card className="mb-8 border-red-200 dark:border-red-900">
            <CardHeader className="bg-red-50 dark:bg-red-950/30">
              <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                <AlertTriangle className="h-5 w-5" />
                风险提示
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:text-red-700 dark:prose-headings:text-red-400">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {type.risks}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tips */}
        {type.tips && (
          <Card className="mb-8 border-yellow-200 dark:border-yellow-900">
            <CardHeader className="bg-yellow-50 dark:bg-yellow-950/30">
              <CardTitle className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
                <Lightbulb className="h-5 w-5" />
                实用技巧
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:text-yellow-700 dark:prose-headings:text-yellow-400">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {type.tips}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Example */}
        {type.example && (
          <Card className="mb-8 border-blue-200 dark:border-blue-900">
            <CardHeader className="bg-blue-50 dark:bg-blue-950/30">
              <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                <BookOpen className="h-5 w-5" />
                实例分析
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:text-blue-700 dark:prose-headings:text-blue-400">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {type.example}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tools & Resources */}
        {type.tools_resources && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-slate-600" />
                工具与资源
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {type.tools_resources}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        )}

        <Separator className="my-8" />

        {/* CTA Section */}
        <Card className="bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-950/30 dark:to-cyan-950/30 border-emerald-200 dark:border-emerald-800">
          <CardContent className="py-8 text-center">
            <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">
              想要深入学习更多套利策略？
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-2xl mx-auto">
              浏览我们的完整套利策略库，发现更多盈利机会
            </p>
            <div className="flex items-center justify-center gap-4">
              {/* 会员功能已暂停 */}
              {/* <Link href="/pricing">
                <button className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white rounded-xl font-medium shadow-lg shadow-emerald-500/30 transition-all">
                  升级会员
                </button>
              </Link> */}
              <Link href="/arbitrage/types">
                <button className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white rounded-xl font-medium shadow-lg shadow-emerald-500/30 transition-all">
                  浏览更多策略
                </button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
          <p>最后更新：{new Date(type.updated_at).toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}</p>
        </div>
      </div>
    </div>
    </ArbitrageDetailClient>
  );
}
