'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ChevronRight, FileText, Shield, HelpCircle, AlertTriangle, Scale, Lock, XCircle } from 'lucide-react';

interface NavItem {
  title: string;
  slug: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  {
    title: '使用指南',
    slug: 'guide',
    icon: FileText,
  },
  {
    title: '常见问题',
    slug: 'faq',
    icon: HelpCircle,
  },
  {
    title: '风险提示',
    slug: 'risk',
    icon: AlertTriangle,
  },
  {
    title: '服务条款',
    slug: 'terms',
    icon: Scale,
  },
  {
    title: '隐私政策',
    slug: 'privacy',
    icon: Lock,
  },
  {
    title: '免责声明',
    slug: 'disclaimer',
    icon: Shield,
  },
];

interface DocsLayoutProps {
  children: React.ReactNode;
  currentSlug: string;
}

export function DocsLayout({ children, currentSlug }: DocsLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="sticky top-0 z-50 w-full border-b bg-white/95 dark:bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-14 items-center px-4">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">PlayNew.ai</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/page/guide"
              className="transition-colors hover:text-foreground/80 text-foreground"
            >
              文档中心
            </Link>
          </nav>
        </div>
      </div>

      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10 px-4 py-6">
        {/* Sidebar */}
        <aside className="fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block">
          <div className="py-6 pr-6 lg:py-8">
            <div className="w-full">
              <div className="pb-4">
                <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-semibold">帮助文档</h4>
              </div>
              <div className="grid grid-flow-row auto-rows-max text-sm">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentSlug === item.slug;

                  return (
                    <Link
                      key={item.slug}
                      href={`/page/${item.slug}`}
                      className={cn(
                        'group flex w-full items-center rounded-md border border-transparent px-2 py-2 hover:bg-slate-100 dark:hover:bg-slate-800',
                        isActive && 'bg-slate-100 dark:bg-slate-800 font-medium text-foreground'
                      )}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
                      {isActive && (
                        <ChevronRight className="ml-auto h-4 w-4" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="relative py-6 lg:gap-10 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
