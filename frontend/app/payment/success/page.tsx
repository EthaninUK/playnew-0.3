'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Check, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    if (sessionId) {
      verifyPayment(sessionId);
    } else {
      setLoading(false);
      setVerifying(false);
    }
  }, [sessionId]);

  const verifyPayment = async (sessionId: string) => {
    try {
      const response = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      });

      const data = await response.json();

      if (data.success) {
        setVerifying(false);
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-muted-foreground">正在验证支付...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-12 text-center">
        {verifying ? (
          <>
            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-10 h-10 text-blue-600 dark:text-blue-400 animate-spin" />
            </div>
            <h1 className="text-3xl font-bold mb-4">正在处理您的订阅...</h1>
            <p className="text-lg text-muted-foreground mb-8">
              请稍候，我们正在激活您的会员权益
            </p>
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl font-bold mb-4 text-green-600 dark:text-green-400">
              支付成功！
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              感谢您的订阅！您的会员权益已激活，现在可以享受所有高级功能。
            </p>

            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-6 mb-8">
              <p className="text-sm text-muted-foreground mb-2">
                我们已向您的邮箱发送订阅确认邮件
              </p>
              <p className="text-sm font-medium">
                订单编号: {sessionId?.slice(0, 20)}...
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => router.push('/member-center')}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                前往会员中心
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                onClick={() => router.push('/strategies')}
                size="lg"
                variant="outline"
              >
                浏览玩法策略
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
