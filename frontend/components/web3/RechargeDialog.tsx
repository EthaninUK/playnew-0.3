/**
 * 充值弹窗组件
 * 集成 Web3 支付和 PlayPass 支付两种充值方式
 */

'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Loader2, Coins, Wallet, Info } from 'lucide-react';
import { toast } from 'sonner';
import { CryptoCloudPaymentDialog } from './CryptoCloudPaymentDialog';

// ============================================
// 类型定义
// ============================================

interface RechargeDialogProps {
  open: boolean;
  onClose: () => void;
  currentBalance?: number;
  onSuccess?: (data: any) => void;
}

interface RechargeTier {
  min: number;
  max: number;
  bonus: number;
  label: string;
  recommended?: boolean;
}

// 充值档位
const RECHARGE_TIERS: RechargeTier[] = [
  { min: 1, max: 9, bonus: 0, label: '小额充值' },
  { min: 10, max: 49, bonus: 10, label: '标准充值', recommended: true },
  { min: 50, max: 99, bonus: 20, label: '超值充值' },
  { min: 100, max: 999999, bonus: 30, label: '豪华充值' },
];

const QUICK_AMOUNTS = [10, 50, 100, 200];

// ============================================
// 主组件
// ============================================

export function RechargeDialog({
  open,
  onClose,
  currentBalance = 0,
  onSuccess,
}: RechargeDialogProps) {
  const [amount, setAmount] = useState<string>('10');
  const [calculatedPP, setCalculatedPP] = useState<{
    base: number;
    bonus: number;
    total: number;
    bonusPercent: number;
  } | null>(null);

  const [showCryptoPayment, setShowCryptoPayment] = useState(false);
  const [loading, setLoading] = useState(false);

  // ============================================
  // 计算 PP
  // ============================================
  useEffect(() => {
    const amountNum = parseFloat(amount) || 0;
    if (amountNum <= 0) {
      setCalculatedPP(null);
      return;
    }

    const tier = RECHARGE_TIERS.find(
      (t) => amountNum >= t.min && amountNum <= t.max
    );

    if (!tier) {
      setCalculatedPP(null);
      return;
    }

    const ratio = 100; // 1 USD = 100 PP
    const basePP = Math.floor(amountNum * ratio);
    const bonusPP = Math.floor(basePP * (tier.bonus / 100));
    const totalPP = basePP + bonusPP;

    setCalculatedPP({
      base: basePP,
      bonus: bonusPP,
      total: totalPP,
      bonusPercent: tier.bonus,
    });
  }, [amount]);

  // ============================================
  // 快速选择金额
  // ============================================
  const handleQuickSelect = (value: number) => {
    setAmount(value.toString());
  };

  // ============================================
  // 加密货币充值
  // ============================================
  const handleCryptoRecharge = () => {
    const amountNum = parseFloat(amount);
    if (!amountNum || amountNum <= 0) {
      toast.error('请输入有效的充值金额');
      return;
    }

    if (amountNum < 1) {
      toast.error('最低充值金额为 $1');
      return;
    }

    setShowCryptoPayment(true);
  };

  // ============================================
  // PlayPass 充值 (转赠)
  // ============================================
  const handlePPRecharge = async () => {
    // TODO: 实现 PP 转赠功能
    toast.info('PP 转赠功能即将推出');
  };

  // ============================================
  // 支付成功回调
  // ============================================
  const handlePaymentSuccess = (data: any) => {
    setShowCryptoPayment(false);
    toast.success('充值成功! PP 将在几分钟内到账');

    if (onSuccess) {
      onSuccess(data);
    }

    // 关闭充值弹窗
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  // ============================================
  // 获取当前档位
  // ============================================
  const getCurrentTier = () => {
    const amountNum = parseFloat(amount) || 0;
    return RECHARGE_TIERS.find(
      (t) => amountNum >= t.min && amountNum <= t.max
    );
  };

  const currentTier = getCurrentTier();

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5" />
              充值 PlayPass
            </DialogTitle>
            <DialogDescription>
              使用加密货币或 PlayPass 为您的账户充值积分
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* 当前余额 */}
            <div className="rounded-lg border p-4 bg-muted/50">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">当前余额</span>
                <span className="text-2xl font-bold">{currentBalance.toLocaleString()} PP</span>
              </div>
            </div>

            {/* 充值金额输入 */}
            <div className="space-y-3">
              <Label htmlFor="amount">充值金额 (USD)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  id="amount"
                  type="number"
                  min="1"
                  step="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-7 text-lg font-semibold"
                  placeholder="输入金额"
                />
              </div>

              {/* 快速选择金额 */}
              <div className="flex gap-2">
                {QUICK_AMOUNTS.map((value) => (
                  <Button
                    key={value}
                    variant={amount === value.toString() ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleQuickSelect(value)}
                    className="flex-1"
                  >
                    ${value}
                  </Button>
                ))}
              </div>
            </div>

            {/* 充值明细 */}
            {calculatedPP && (
              <div className="rounded-lg border p-4 space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">充值明细</span>
                  {currentTier && currentTier.bonus > 0 && (
                    <Badge variant="secondary" className="ml-auto">
                      {currentTier.bonus}% 奖励
                    </Badge>
                  )}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">基础积分</span>
                    <span className="font-medium">{calculatedPP.base.toLocaleString()} PP</span>
                  </div>

                  {calculatedPP.bonus > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">奖励积分</span>
                      <span className="font-medium text-green-600">
                        +{calculatedPP.bonus.toLocaleString()} PP
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between pt-2 border-t">
                    <span className="font-semibold">总计获得</span>
                    <span className="font-bold text-lg">
                      {calculatedPP.total.toLocaleString()} PP
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 充值档位提示 */}
            <div className="grid grid-cols-2 gap-2">
              {RECHARGE_TIERS.map((tier) => (
                <div
                  key={tier.label}
                  className={`rounded-lg border p-3 text-center ${
                    currentTier?.label === tier.label
                      ? 'border-primary bg-primary/5'
                      : 'border-muted'
                  }`}
                >
                  <div className="text-xs text-muted-foreground mb-1">{tier.label}</div>
                  <div className="font-semibold text-sm">
                    ${tier.min}
                    {tier.max < 999999 ? `-$${tier.max}` : '+'}
                  </div>
                  <div className="text-xs mt-1">
                    {tier.bonus > 0 ? (
                      <span className="text-green-600">+{tier.bonus}% 奖励</span>
                    ) : (
                      <span className="text-muted-foreground">无奖励</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* 充值方式选择 */}
            <Tabs defaultValue="web3" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="web3" className="flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  Web3 充值
                </TabsTrigger>
                <TabsTrigger value="pp" className="flex items-center gap-2" disabled>
                  <Coins className="h-4 w-4" />
                  PP 转赠
                </TabsTrigger>
              </TabsList>

              <TabsContent value="web3" className="mt-4 space-y-3">
                <p className="text-sm text-muted-foreground">
                  使用加密货币充值,支持 BTC, ETH, USDT, USDC 等
                </p>
                <Button
                  onClick={handleCryptoRecharge}
                  className="w-full"
                  size="lg"
                  disabled={!calculatedPP || loading}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  使用加密货币充值
                </Button>
              </TabsContent>

              <TabsContent value="pp" className="mt-4 space-y-3">
                <p className="text-sm text-muted-foreground">
                  接收其他用户转赠的 PlayPass 积分
                </p>
                <Button
                  onClick={handlePPRecharge}
                  className="w-full"
                  size="lg"
                  variant="outline"
                  disabled
                >
                  即将推出
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      {/* CryptoCloud 支付弹窗 */}
      <CryptoCloudPaymentDialog
        open={showCryptoPayment}
        onClose={() => setShowCryptoPayment(false)}
        amount_usd={parseFloat(amount) || 0}
        onSuccess={handlePaymentSuccess}
      />
    </>
  );
}