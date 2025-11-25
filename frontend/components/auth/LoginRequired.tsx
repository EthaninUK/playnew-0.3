'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, LogIn } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface LoginRequiredProps {
  title?: string;
  description?: string;
}

/**
 * 登录要求组件
 * 显示在未登录用户访问受保护内容时
 */
export function LoginRequired({
  title = '此内容需要登录',
  description = '请先登录或注册以查看完整内容'
}: LoginRequiredProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 dark:bg-blue-950 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription className="text-base mt-2">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Link
              href={`/auth/login?redirect=${encodeURIComponent(pathname)}`}
              className="w-full"
            >
              <Button className="w-full gap-2" size="lg">
                <LogIn className="w-4 h-4" />
                登录
              </Button>
            </Link>

            <Link
              href={`/auth/register?redirect=${encodeURIComponent(pathname)}`}
              className="w-full"
            >
              <Button variant="outline" className="w-full gap-2" size="lg">
                注册新账号
              </Button>
            </Link>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground text-center">
              注册后即可免费查看全站所有内容
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
