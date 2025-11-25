'use client';

import Link from 'next/link';
import {
  Sparkles,
  Mail,
  Twitter,
  Github,
  MessageCircle,
  Zap,
  TrendingUp,
  Flame,
  Crown,
  Shield,
  FileText,
  HelpCircle,
  BookOpen
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  const footerLinks = {
    product: [
      { name: t.footer.product.strategies, href: '/strategies', icon: Zap },
      { name: t.footer.product.news, href: '/news', icon: TrendingUp },
      { name: t.footer.product.gossip, href: '/gossip', icon: Flame },
      { name: t.footer.product.membership, href: '/pricing', icon: Crown },
    ],
    resources: [
      { name: t.footer.resources.guide, href: '/page/guide' },
      { name: t.footer.resources.faq, href: '/page/faq' },
      { name: t.footer.resources.risk, href: '/page/risk' },
    ],
    legal: [
      { name: t.footer.legal.terms, href: '/page/terms' },
      { name: t.footer.legal.privacy, href: '/page/privacy' },
      { name: t.footer.legal.disclaimer, href: '/page/disclaimer' },
    ],
  };

  const socialLinks = [
    { name: 'Twitter', href: '#', icon: Twitter, color: 'hover:text-sky-500' },
    { name: 'Telegram', href: '#', icon: MessageCircle, color: 'hover:text-blue-500' },
    { name: 'GitHub', href: '#', icon: Github, color: 'hover:text-slate-900 dark:hover:text-white' },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-slate-50 via-slate-100 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-t border-slate-200/50 dark:border-slate-800/50 mt-auto">
      {/* 装饰性背景 */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        {/* 主要内容区 */}
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* 品牌信息区 - 左侧 */}
            <div className="lg:col-span-4">
              <Link href="/" className="inline-flex items-center gap-3 group mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
                  <div className="relative w-10 h-10 flex items-center justify-center">
                    <img
                      src="/c.svg"
                      alt="PlayNew Logo"
                      width="40"
                      height="40"
                      className="object-contain"
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    PlayNew
                  </span>
                  <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 tracking-wider">
                    PLAYNEW.AI
                  </span>
                </div>
              </Link>

              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6 max-w-sm">
                {t.footer.tagline}
              </p>

              {/* 社交媒体链接 */}
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-lg bg-slate-200/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 ${social.color} transition-all duration-200 hover:scale-110 hover:shadow-lg`}
                    aria-label={social.name}
                  >
                    <social.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* 链接区 - 右侧 */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
              {/* 产品导航 */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-purple-500" />
                  {t.footer.product.title}
                </h3>
                <ul className="space-y-3">
                  {footerLinks.product.map((link) => {
                    const Icon = link.icon;
                    return (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="group flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                        >
                          <Icon className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <span className="group-hover:translate-x-0.5 transition-transform">{link.name}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* 资源 */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-blue-500" />
                  {t.footer.resources.title}
                </h3>
                <ul className="space-y-3">
                  {footerLinks.resources.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors hover:translate-x-0.5 inline-block"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 法律信息 */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  {t.footer.legal.title}
                </h3>
                <ul className="space-y-3">
                  {footerLinks.legal.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-slate-600 dark:text-slate-400 hover:text-green-600 dark:hover:text-green-400 transition-colors hover:translate-x-0.5 inline-block"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 分割线 */}
        <div className="border-t border-slate-200 dark:border-slate-800" />

        {/* 底部版权信息 */}
        <div className="py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-sm text-slate-600 dark:text-slate-400">
              <p>© {currentYear} {t.footer.copyright}</p>
              <div className="hidden sm:block w-1 h-1 rounded-full bg-slate-400" />
              <p className="text-center sm:text-left">{t.footer.slogan}</p>
            </div>

            {/* 风险提示 */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
              <Shield className="h-3.5 w-3.5 text-amber-600 dark:text-amber-500" />
              <span className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                {t.footer.riskWarning}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
