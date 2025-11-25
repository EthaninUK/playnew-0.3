/**
 * CryptoCloud 支付弹窗组件
 * 使用 CryptoCloud 支付网关处理加密货币支付
 */

'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, ExternalLink, Wallet, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';

interface CryptoCloudPaymentDialogProps {
  open: boolean;
  onClose: () => void;
  membershipId: string;
  membershipName: string;
  amount: number;
  onSuccess?: () => void;
}

type PaymentStep = 'confirm' | 'creating' | 'redirecting' | 'success' | 'error';

export function CryptoCloudPaymentDialog({
  open,
  onClose,
  membershipId,
  membershipName,
  amount,
  onSuccess,
}: CryptoCloudPaymentDialogProps) {
  const [step, setStep] = useState<PaymentStep>('confirm');
  const [error, setError] = useState<string | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  const handleCreateInvoice = async () => {
    try {
      setStep('creating');
      setError(null);

      const response = await fetch('/api/cryptocloud/create-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          membershipId,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || '创建支付订单失败');
      }

      // 保存支付链接
      setPaymentUrl(data.data.payment_url);
      setStep('redirecting');

      // 自动跳转到支付页面
      window.open(data.data.payment_url, '_blank');

      toast.success('支付页面已打开，请在新窗口完成支付');

    } catch (err: any) {
      console.error('创建发票失败:', err);
      setError(err.message || '创建支付订单失败');
      setStep('error');
      toast.error(err.message || '创建支付订单失败');
    }
  };

  const handlePaymentComplete = () => {
    setStep('success');
    toast.success(`成功购买 ${membershipName} 会员！`);
    if (onSuccess) {
      onSuccess();
    }
    // 3秒后关闭弹窗
    setTimeout(() => {
      onClose();
      // 刷新页面以更新会员状态
      window.location.reload();
    }, 3000);
  };

  const renderStepContent = () => {
    switch (step) {
      case 'confirm':
        return (
          <div className="space-y-6">
            {/* 支付摘要 */}
            <div className="rounded-lg border p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">购买会员</span>
                <span className="font-semibold">{membershipName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">订阅时长</span>
                <span className="font-medium">1 年</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-sm text-muted-foreground">应付金额</span>
                <div className="text-right">
                  <div className="font-bold text-lg">${amount}</div>
                  <div className="text-xs text-muted-foreground">
                    支持 BTC, ETH, USDT, USDC 等
                  </div>
                </div>
              </div>
            </div>

            {/* 支付说明 */}
            <div className="text-sm text-muted-foreground space-y-2">
              <p>点击下方按钮后，将跳转到 CryptoCloud 支付页面。</p>
              <p>支持多种加密货币和网络，选择您方便的支付方式。</p>
            </div>

            {/* 支付按钮 */}
            <Button onClick={handleCreateInvoice} className="w-full" size="lg">
              <Wallet className="mr-2 h-5 w-5" />
              前往支付
            </Button>
          </div>
        );

      case 'creating':
        return (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">正在创建支付订单...</p>
          </div>
        );

      case 'redirecting':
        return (
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                <ExternalLink className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="font-semibold text-lg mb-2">支付页面已打开</p>
              <p className="text-sm text-muted-foreground text-center mb-4">
                请在新窗口中完成支付<br />
                支付完成后点击下方按钮
              </p>
            </div>

            {/* 操作按钮 */}
            <div className="space-y-3">
              {paymentUrl && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => window.open(paymentUrl, '_blank')}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  重新打开支付页面
                </Button>
              )}

              <Button onClick={handlePaymentComplete} className="w-full" size="lg">
                <CheckCircle2 className="mr-2 h-5 w-5" />
                我已完成支付
              </Button>

              <Button
                variant="ghost"
                className="w-full"
                onClick={() => {
                  setStep('confirm');
                  setPaymentUrl(null);
                }}
              >
                取消
              </Button>
            </div>

            {/* 提示 */}
            <p className="text-xs text-muted-foreground text-center">
              支付确认可能需要几分钟，请耐心等待。<br />
              如果支付成功但会员未激活，请联系客服。
            </p>
          </div>
        );

      case 'success':
        return (
          <div className="flex flex-col items-center justify-center py-12">
            <CheckCircle2 className="h-16 w-16 text-green-600 mb-4" />
            <p className="font-semibold text-lg mb-2">支付成功！</p>
            <p className="text-sm text-muted-foreground text-center">
              您已成功购买 {membershipName} 会员<br />
              会员权益有效期 365 天
            </p>
          </div>
        );

      case 'error':
        return (
          <div className="flex flex-col items-center justify-center py-12">
            <XCircle className="h-16 w-16 text-red-600 mb-4" />
            <p className="font-semibold text-lg mb-2">支付失败</p>
            <p className="text-sm text-muted-foreground text-center mb-4">
              {error || '未知错误'}
            </p>
            <Button onClick={() => setStep('confirm')} variant="outline">
              重试
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>购买会员</DialogTitle>
          <DialogDescription>
            使用加密货币购买 {membershipName} 会员，支持多种代币
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">{renderStepContent()}</div>
      </DialogContent>
    </Dialog>
  );
}