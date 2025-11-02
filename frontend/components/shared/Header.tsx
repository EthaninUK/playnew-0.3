'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Menu, X, User, Heart, LogOut, Settings, Sparkles, Zap, TrendingUp, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchDialog } from './SearchDialog';
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface Subscription {
  membership: {
    id: string;
    name: string;
    level: number;
  };
  status: string;
  end_date: string;
}

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const { user, loading, signOut } = useAuth();

  // Fetch user subscription
  useEffect(() => {
    if (user) {
      fetchSubscription();
    } else {
      setSubscription(null);
    }
  }, [user]);

  const fetchSubscription = async () => {
    try {
      const response = await fetch('/api/subscription');
      const data = await response.json();
      if (data.subscription) {
        setSubscription(data.subscription);
      }
    } catch (error) {
      console.error('Failed to fetch subscription:', error);
    }
  };

  const getMembershipBadge = (level: number) => {
    switch (level) {
      case 0:
        return { label: 'Free', className: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' };
      case 1:
        return { label: 'Pro', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' };
      case 2:
        return { label: 'Max', className: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' };
      case 3:
        return { label: 'Partner', className: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300' };
      default:
        return { label: 'Free', className: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' };
    }
  };

  // Handle keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <>
      <nav className="border-b border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {/* Logo */}
              <Link href="/" className="flex-shrink-0 flex items-center gap-3 group">
                <div className="relative">
                  {/* Logo 背景光效 */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>

                  {/* Logo 图标 */}
                  <div className="relative p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                </div>

                {/* 品牌名称 */}
                <div className="flex flex-col">
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    PlayNew
                  </span>
                  <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 tracking-wider">
                    PLAYNEW.AI
                  </span>
                </div>
              </Link>

              {/* 导航链接 */}
              <div className="hidden md:ml-10 md:flex md:space-x-1">
                <Link
                  href="/"
                  className="group relative px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <span className="relative z-10">首页</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Link>

                <Link
                  href="/strategies"
                  className="group relative px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5"
                >
                  <Zap className="h-3.5 w-3.5" />
                  <span className="relative z-10">玩法库</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Link>

                <Link
                  href="/news"
                  className="group relative px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5"
                >
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span className="relative z-10">快讯</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Link>

                <Link
                  href="/pricing"
                  className="group relative px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center gap-1.5"
                >
                  <Crown className="h-3.5 w-3.5" />
                  <span className="relative z-10">会员</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Search Button */}
              <button
                onClick={() => setSearchOpen(true)}
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-100/80 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-700/50 rounded-xl transition-all group border border-slate-200 dark:border-slate-700"
              >
                <Search className="h-4 w-4 text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                <span className="text-sm text-slate-600 dark:text-slate-400">搜索</span>
                <kbd className="inline-flex h-5 select-none items-center gap-1 rounded bg-white dark:bg-slate-900 px-1.5 font-mono text-[10px] font-medium text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(true)}
                className="md:hidden hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* User Menu */}
              {!loading && (
                <>
                  {user ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email || ''} />
                            <AvatarFallback>
                              {user.email?.charAt(0).toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-64" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                          <div className="flex flex-col space-y-2">
                            <p className="text-sm font-medium leading-none">
                              {user.user_metadata?.username || user.email?.split('@')[0]}
                            </p>
                            <p className="text-xs leading-none text-muted-foreground">
                              {user.email}
                            </p>
                            {subscription && (
                              <div className="flex items-center gap-2 pt-1">
                                <Badge className={getMembershipBadge(subscription.membership.level).className}>
                                  {getMembershipBadge(subscription.membership.level).label}
                                </Badge>
                                {subscription.membership.level > 0 && (
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(subscription.end_date) > new Date()
                                      ? `到期: ${new Date(subscription.end_date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}`
                                      : '已过期'}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/membership" className="cursor-pointer">
                            <Crown className="mr-2 h-4 w-4 text-purple-500" />
                            <span className="font-medium">会员中心</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/profile" className="cursor-pointer">
                            <User className="mr-2 h-4 w-4" />
                            <span>个人中心</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/favorites" className="cursor-pointer">
                            <Heart className="mr-2 h-4 w-4" />
                            <span>我的收藏</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/profile/settings" className="cursor-pointer">
                            <Settings className="mr-2 h-4 w-4" />
                            <span>设置</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => signOut()}
                          className="cursor-pointer text-destructive focus:text-destructive"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>登出</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <div className="hidden md:flex items-center gap-2">
                      <Button variant="ghost" size="sm" asChild className="hover:bg-slate-100 dark:hover:bg-slate-800">
                        <Link href="/auth/login">登录</Link>
                      </Button>
                      <Button size="sm" asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/30">
                        <Link href="/auth/register">注册</Link>
                      </Button>
                    </div>
                  )}
                </>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5 text-slate-700 dark:text-slate-300" />
                ) : (
                  <Menu className="h-5 w-5 text-slate-700 dark:text-slate-300" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-slate-200 dark:border-slate-800">
              <div className="py-4 space-y-1">
                <Link
                  href="/"
                  className="flex items-center gap-2 px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-950/30 dark:hover:to-purple-950/30 rounded-xl mx-2 transition-all group"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="text-base font-medium">首页</span>
                </Link>
                <Link
                  href="/strategies"
                  className="flex items-center gap-2 px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-950/30 dark:hover:to-purple-950/30 rounded-xl mx-2 transition-all group"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Zap className="h-4 w-4" />
                  <span className="text-base font-medium">玩法库</span>
                </Link>
                <Link
                  href="/news"
                  className="flex items-center gap-2 px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-950/30 dark:hover:to-purple-950/30 rounded-xl mx-2 transition-all group"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-base font-medium">快讯</span>
                </Link>
                {/* 暂时隐藏 - 待后续开发
                <Link
                  href="/providers"
                  className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-base font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  服务商目录
                </Link>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-base font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  关于
                </Link>
                */}

                {/* Mobile User Menu */}
                {!loading && (
                  <>
                    {user ? (
                      <>
                        <div className="border-t border-slate-200 dark:border-slate-800 my-3" />
                        {/* Membership Badge in Mobile Menu */}
                        {subscription && (
                          <div className="flex items-center justify-between px-4 py-2 mx-2 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-xl mb-2">
                            <div className="flex items-center gap-2">
                              <Crown className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">当前会员</span>
                            </div>
                            <Badge className={getMembershipBadge(subscription.membership.level).className}>
                              {getMembershipBadge(subscription.membership.level).label}
                            </Badge>
                          </div>
                        )}
                        <Link
                          href="/membership"
                          className="flex items-center gap-2 px-4 py-3 text-purple-600 dark:text-purple-400 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-950/30 dark:hover:to-pink-950/30 rounded-xl mx-2 transition-all font-medium"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Crown className="h-4 w-4" />
                          <span className="text-base font-medium">会员中心</span>
                        </Link>
                        <Link
                          href="/profile"
                          className="flex items-center gap-2 px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl mx-2 transition-all"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <User className="h-4 w-4" />
                          <span className="text-base font-medium">个人中心</span>
                        </Link>
                        <Link
                          href="/favorites"
                          className="flex items-center gap-2 px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl mx-2 transition-all"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Heart className="h-4 w-4" />
                          <span className="text-base font-medium">我的收藏</span>
                        </Link>
                        <button
                          onClick={() => {
                            signOut();
                            setMobileMenuOpen(false);
                          }}
                          className="flex items-center gap-2 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl mx-2 transition-all w-full text-left"
                        >
                          <LogOut className="h-4 w-4" />
                          <span className="text-base font-medium">登出</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="border-t border-slate-200 dark:border-slate-800 my-3" />
                        <Link
                          href="/auth/login"
                          className="block px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl mx-2 transition-all text-center text-base font-medium"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          登录
                        </Link>
                        <Link
                          href="/auth/register"
                          className="block px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 rounded-xl mx-2 mt-2 transition-all text-center text-base font-medium shadow-lg shadow-blue-500/30"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          注册
                        </Link>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
