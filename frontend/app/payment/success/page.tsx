'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [membership, setMembership] = useState<string>('');

  useEffect(() => {
    if (sessionId) {
      verifyPayment(sessionId);
    } else {
      setStatus('error');
    }
  }, [sessionId]);

  const verifyPayment = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/verify-payment?session_id=${sessionId}`);

      if (!response.ok) {
        throw new Error('Payment verification failed');
      }

      const data = await response.json();
      setMembership(data.membershipName || '');
      setStatus('success');
    } catch (error) {
      console.error('Verification error:', error);
      setStatus('error');
    }
  };

  if (status === 'loading') {
    return (
      <div className="container max-w-2xl mx-auto px-4 py-16">
        <Card className="p-12">
          <div className="text-center">
            <Loader2 className="h-16 w-16 text-purple-600 mx-auto mb-6 animate-spin" />
            <h1 className="text-2xl font-bold mb-2">正在确认支付...</h1>
            <p className="text-muted-foreground">请稍候,我们正在处理您的订单</p>
          </div>
        </Card>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="container max-w-2xl mx-auto px-4 py-16">
        <Card className="p-12 border-red-200 dark:border-red-900">
          <div className="text-center">
            <div className="h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">❌</span>
            </div>
            <h1 className="text-2xl font-bold mb-2">支付验证失败</h1>
            <p className="text-muted-foreground mb-8">
              无法验证您的支付信息,请联系客服或重试
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={() => router.push('/pricing')}>
                返回定价页
              </Button>
              <Button onClick={() => router.push('/membership')}>
                查看会员中心
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto px-4 py-16">
      <Card className="p-12 border-green-200 dark:border-green-900">
        <div className="text-center">
          <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4">支付成功!</h1>
          <p className="text-xl text-muted-foreground mb-8">
            欢迎成为 <span className="font-semibold text-purple-600">{membership}</span> 会员
          </p>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-lg p-6 mb-8">
            <h2 className="font-semibold mb-3">您已解锁以下权益:</h2>
            <div className="space-y-2 text-left max-w-md mx-auto">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span className="text-sm">访问更多高级策略内容</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span className="text-sm">无限制浏览最新快讯</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span className="text-sm">优先获得新功能体验</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span className="text-sm">专属会员徽章</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => router.push('/strategies')}
              className="group"
            >
              开始探索策略
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push('/membership')}
            >
              查看会员信息
            </Button>
          </div>

          <p className="text-xs text-muted-foreground mt-8">
            订阅确认邮件已发送至您的邮箱
          </p>
        </div>
      </Card>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="container max-w-2xl mx-auto px-4 py-16">
          <Card className="p-12">
            <div className="text-center">
              <Loader2 className="h-16 w-16 text-purple-600 mx-auto mb-6 animate-spin" />
              <p className="text-muted-foreground">加载中...</p>
            </div>
          </Card>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
