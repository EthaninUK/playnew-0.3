'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  FileText,
  Users,
  Settings,
  BarChart3,
  MessageSquare,
  Loader2,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState<any>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push('/auth/login?redirect=/admin');
      return;
    }

    // TODO: 添加管理员权限检查
    setAdminUser(user);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const adminTools = [
    {
      title: '玩法审核',
      description: '审核用户提交的玩法内容',
      icon: FileText,
      href: '/admin/submissions',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      title: '用户管理',
      description: '管理用户账号和权限',
      icon: Users,
      href: '/admin/users',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
    },
    {
      title: '数据统计',
      description: '查看平台数据和分析',
      icon: BarChart3,
      href: '/admin/analytics',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50 dark:bg-green-950',
    },
    {
      title: '内容管理',
      description: '管理玩法、新闻等内容',
      icon: MessageSquare,
      href: 'http://localhost:8055/admin',
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50 dark:bg-orange-950',
      external: true,
    },
    {
      title: '系统设置',
      description: '配置平台系统参数',
      icon: Settings,
      href: '/admin/settings',
      color: 'from-gray-500 to-slate-500',
      bgColor: 'bg-gray-50 dark:bg-gray-950',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            管理后台
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            欢迎回来，{adminUser?.email}
          </p>
        </div>

        {/* 快捷导航卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Card
                key={tool.href}
                className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-blue-300 dark:hover:border-blue-700"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${tool.color}`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <CardTitle className="text-xl mt-4">{tool.title}</CardTitle>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {tool.external ? (
                    <a
                      href={tool.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button variant="outline" className="w-full">
                        打开 Directus
                      </Button>
                    </a>
                  ) : (
                    <Link href={tool.href}>
                      <Button variant="outline" className="w-full">
                        进入管理
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* 快速链接 */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            常用链接
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/member-center">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <p className="font-medium">会员中心</p>
                  <p className="text-sm text-gray-500">查看用户视角</p>
                </CardContent>
              </Card>
            </Link>
            <a href="http://localhost:8055/admin/content/strategies" target="_blank" rel="noopener noreferrer">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <p className="font-medium">玩法管理</p>
                  <p className="text-sm text-gray-500">Directus CMS</p>
                </CardContent>
              </Card>
            </a>
            <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <p className="font-medium">数据库管理</p>
                  <p className="text-sm text-gray-500">Supabase Dashboard</p>
                </CardContent>
              </Card>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
