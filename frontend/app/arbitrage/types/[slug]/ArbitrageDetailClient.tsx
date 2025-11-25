'use client';

import { useAuthGuard } from '@/hooks/useAuthGuard';
import { LoginRequired } from '@/components/auth/LoginRequired';

interface ArbitrageDetailClientProps {
  children: React.ReactNode;
}

/**
 * 套利详情页的客户端包装器
 * 用于检查用户登录状态
 */
export function ArbitrageDetailClient({ children }: ArbitrageDetailClientProps) {
  const { isAuthorized, loading } = useAuthGuard();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">加载中...</div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <LoginRequired
        title="查看套利详情需要登录"
        description="注册后即可免费查看全站所有套利策略"
      />
    );
  }

  return <>{children}</>;
}
