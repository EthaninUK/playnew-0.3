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
import { Loader2, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface CryptoCloudPaymentDialogProps {
  open: boolean;
  onClose: () => void;
  amount_usd: number;
  onSuccess?: (data: any) => void;
}

export function CryptoCloudPaymentDialog({
  open,
  onClose,
  amount_usd,
  onSuccess,
}: CryptoCloudPaymentDialogProps) {
  const [loading, setLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [invoiceId, setInvoiceId] = useState<string | null>(null);

  // 创建支付发票
  const handleCreateInvoice = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/cryptocloud/create-recharge-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount_usd,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to create invoice');
      }

      setPaymentUrl(data.pay_url);
      setInvoiceId(data.invoice_id);
      toast.success('支付链接已生成');

      // 自动打开支付页面
      if (data.pay_url) {
        window.open(data.pay_url, '_blank');
      }

    } catch (error: any) {
      console.error('Failed to create invoice:', error);
      toast.error(error.message || '创建支付订单失败');
    } finally {
      setLoading(false);
    }
  };

  // 重置状态
  const handleClose = () => {
    setPaymentUrl(null);
    setInvoiceId(null);
    onClose();
  };

  // 完成支付
  const handleComplete = () => {
    if (onSuccess) {
      onSuccess({ invoice_id: invoiceId });
    }
    toast.success('支付完成！PP 将在几分钟内到账');
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>使用加密货币充值</DialogTitle>
          <DialogDescription>
            安全便捷的加密货币支付方式
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* 充值金额显示 */}
          <div className="rounded-lg border p-4 bg-muted/50">
            <div className="text-sm text-muted-foreground mb-1">充值金额</div>
            <div className="text-3xl font-bold">${amount_usd}</div>
            <div className="text-sm text-muted-foreground mt-1">
              预计获得 {Math.floor(amount_usd * 100)} PP
              {amount_usd >= 10 && (
                <span className="text-green-600 ml-1">
                  + {Math.floor(amount_usd * 100 * (amount_usd >= 100 ? 0.3 : amount_usd >= 50 ? 0.2 : 0.1))} PP 奖励
                </span>
              )}
            </div>
          </div>

          {!paymentUrl ? (
            <>
              {/* 支持的加密货币 */}
              <div className="rounded-lg border p-4">
                <div className="text-sm font-medium mb-2">支持的加密货币</div>
                <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                  <div>• BTC</div>
                  <div>• ETH</div>
                  <div>• USDT</div>
                  <div>• USDC</div>
                  <div>• BNB</div>
                  <div>• TRX</div>
                </div>
              </div>

              {/* 创建订单按钮 */}
              <Button
                onClick={handleCreateInvoice}
                className="w-full"
                size="lg"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                创建支付订单
              </Button>
            </>
          ) : (
            <>
              {/* 支付信息 */}
              <div className="space-y-3">
                <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                  <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900 dark:text-blue-100">
                    <div className="font-medium mb-1">请在新窗口中完成支付</div>
                    <div className="text-blue-700 dark:text-blue-300">
                      支付完成后，PP 将在 2-5 分钟内自动到账
                    </div>
                  </div>
                </div>

                {/* 订单号 */}
                <div className="text-xs text-muted-foreground">
                  订单号: {invoiceId}
                </div>

                {/* 操作按钮 */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => window.open(paymentUrl, '_blank')}
                    variant="outline"
                    className="flex-1"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    打开支付页面
                  </Button>
                  <Button
                    onClick={handleComplete}
                    className="flex-1"
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    已完成支付
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* 提示信息 */}
          <div className="text-xs text-muted-foreground space-y-1">
            <div>• 支付安全由 CryptoCloud 提供保障</div>
            <div>• 支持多种主流加密货币</div>
            <div>• 到账时间约 2-5 分钟</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
