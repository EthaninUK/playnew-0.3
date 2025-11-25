'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Home } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

interface BreadcrumbSegment {
  label: string;
  href: string;
  dynamic?: boolean; // 是否需要动态获取
  fetchUrl?: string; // 动态获取的 API URL
}

export function Breadcrumbs() {
  const pathname = usePathname();
  const [segments, setSegments] = useState<BreadcrumbSegment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBreadcrumbs() {
      // 不显示面包屑的页面
      if (
        pathname === '/' ||
        pathname.startsWith('/strategies') && !pathname.includes('/strategies/') ||
        pathname.startsWith('/news') && !pathname.includes('/news/') ||
        pathname === '/providers' ||
        pathname === '/arbitrage' ||
        pathname === '/arbitrage/types'
      ) {
        setSegments([]);
        setLoading(false);
        return;
      }

      const initialSegments = generateBreadcrumbs(pathname);

      // 查找需要动态获取的片段
      const dynamicSegments = initialSegments.filter(s => s.dynamic && s.fetchUrl);

      if (dynamicSegments.length > 0) {
        // 并行获取所有动态内容
        const results = await Promise.all(
          dynamicSegments.map(async (segment) => {
            try {
              const response = await fetch(segment.fetchUrl!);
              if (response.ok) {
                const data = await response.json();
                return { segment, title: data.title };
              }
            } catch (error) {
              console.error('Failed to fetch breadcrumb title:', error);
            }
            return { segment, title: null };
          })
        );

        // 更新标签
        const updatedSegments = initialSegments.map(segment => {
          if (segment.dynamic) {
            const result = results.find(r => r.segment === segment);
            if (result && result.title) {
              return { ...segment, label: result.title, dynamic: false };
            }
          }
          return segment;
        });

        setSegments(updatedSegments);
      } else {
        setSegments(initialSegments);
      }

      setLoading(false);
    }

    loadBreadcrumbs();
  }, [pathname]);

  if (loading || segments.length === 0) {
    return null;
  }

  return (
    <div className="border-b bg-background/95 backdrop-blur-sm sticky top-16 z-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <Breadcrumb>
          <BreadcrumbList>
            {/* 首页 */}
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/" className="flex items-center gap-1.5">
                  <Home className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">首页</span>
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            {segments.map((segment, index) => {
              const isLast = index === segments.length - 1;

              return (
                <div key={segment.href} className="flex items-center gap-1.5">
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>{segment.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link href={segment.href}>{segment.label}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </div>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
}

function generateBreadcrumbs(pathname: string): BreadcrumbSegment[] {
  const segments: BreadcrumbSegment[] = [];

  // 解析 URL 路径
  const pathParts = pathname.split('/').filter(Boolean);

  // 策略详情页
  if (pathParts[0] === 'strategies' && pathParts[1] && !pathParts[1].startsWith('?')) {
    // 先添加玩法库层级
    segments.push({
      label: '玩法库',
      href: '/strategies',
    });

    const slug = pathParts[1];

    // 动态获取策略标题
    segments.push({
      label: '加载中...',
      href: `/strategies/${slug}`,
      dynamic: true,
      fetchUrl: `/api/strategy-title/${slug}`,
    });
  }

  // 快讯详情页
  else if (pathParts[0] === 'news' && pathParts[1]) {
    // 先添加快讯层级
    segments.push({
      label: '快讯',
      href: '/news',
    });

    // 动态获取快讯标题
    segments.push({
      label: '加载中...',
      href: `/news/${pathParts[1]}`,
      dynamic: true,
      fetchUrl: `/api/news-title/${pathParts[1]}`,
    });
  }

  // 套利详情页
  else if (pathParts[0] === 'arbitrage' && pathParts[1] === 'types' && pathParts[2]) {
    // 先添加套利类型层级
    segments.push({
      label: '套利类型',
      href: '/arbitrage/types',
    });

    const slug = pathParts[2];

    // 动态获取套利类型标题
    segments.push({
      label: '加载中...',
      href: `/arbitrage/types/${slug}`,
      dynamic: true,
      fetchUrl: `/api/arbitrage-title/${slug}`,
    });
  }

  // 服务商页面 (暂时注释，未来使用)
  // else if (pathParts[0] === 'providers') {
  //   segments.push({
  //     label: '服务商',
  //     href: '/providers',
  //   });
  //
  //   if (pathParts[1]) {
  //     segments.push({
  //       label: formatSlugToTitle(pathParts[1]),
  //       href: `/providers/${pathParts[1]}`,
  //     });
  //   }
  // }

  // 个人中心
  else if (pathParts[0] === 'profile') {
    segments.push({
      label: '个人中心',
      href: '/profile',
    });
  }

  // 登录/注册
  else if (pathParts[0] === 'auth') {
    if (pathParts[1] === 'login') {
      segments.push({
        label: '登录',
        href: '/auth/login',
      });
    } else if (pathParts[1] === 'signup') {
      segments.push({
        label: '注册',
        href: '/auth/signup',
      });
    }
  }

  return segments;
}
