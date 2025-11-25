'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './useAuth';

/**
 * 登录保护 Hook
 * 用于需要登录才能访问的页面
 * 未登录用户会被引导到登录页
 */
export function useAuthGuard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // 未登录，跳转到登录页，并保存当前页面地址用于登录后返回
        const currentPath = window.location.pathname;
        router.push(`/auth/login?redirect=${encodeURIComponent(currentPath)}`);
      } else {
        // 已登录
        setIsAuthorized(true);
      }
    }
  }, [user, loading, router]);

  return { isAuthorized, loading, user };
}
