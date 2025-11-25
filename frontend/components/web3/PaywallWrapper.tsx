/**
 * 内容付费墙组件
 * 包裹付费内容,自动检查访问权限并显示解锁选项
 */

'use client';

import { useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Lock,
  Unlock,
  Coins,
  Wallet,
  Loader2,
  Crown,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { Web3PaymentDialog } from './Web3PaymentDialog';
import { RechargeDialog } from './RechargeDialog';
import { toast } from 'sonner';
import Link from 'next/link';

// ============================================
// 类型定义
// ============================================

interface PaywallWrapperProps {
  children: ReactNode;
  contentId: string;
  contentType: 'strategy' | 'arbitrage' | 'news' | 'gossip' | string;
  contentTitle: string;
  contentCategory?: string;

  // 自定义提示
  lockedMessage?: string;
  unlockButtonText?: string;

  // 显示模式
  blurContent?: boolean;  // 模糊内容
  hideContent?: boolean;  // 完全隐藏内容
}

interface AccessCheckResult {
  has_access: boolean;
  reason?: string;
  requires_login?: boolean;
  access_method?: string;
  pricing?: {
    price_usd: number;
    price_pp: number;
  };
  user_info?: {
    credits: number;
    has_sufficient_pp: boolean;
    pp_shortage: number;
  };
  payment_options?: Array<{
    method: string;
    available: boolean;
    price: number;
    label: string;
  }>;
}

// ============================================
// 主组件
// ============================================

export function PaywallWrapper({
  children,
  contentId,
  contentType,
  contentTitle,
  contentCategory,
  lockedMessage,
  unlockButtonText = '解锁内容',
  blurContent = true,
  hideContent = false,
}: PaywallWrapperProps) {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [accessCheck, setAccessCheck] = useState<AccessCheckResult | null>(null);
  const [showWeb3Payment, setShowWeb3Payment] = useState(false);
  const [showRecharge, setShowRecharge] = useState(false);

  // ============================================
  // 检查访问权限
  // ============================================
  const checkAccess = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        content_id: contentId,
        content_type: contentType,
      });

      if (contentCategory) {
        params.append('content_category', contentCategory);
      }

      const res = await fetch(`/api/web3/check-access?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setAccessCheck(data.data);
      } else {
        console.error('访问检查失败:', data.error);
        setAccessCheck({
          has_access: false,
          reason: 'check_failed',
        });
      }
    } catch (error) {
      console.error('访问检查失败:', error);
      setAccessCheck({
        has_access: false,
        reason: 'check_failed',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAccess();
  }, [contentId, contentType, user]);

  // ============================================
  // 使用 PlayPass 解锁
  // ============================================
  const handlePPUnlock = async () => {
    if (!user) {
      toast.error('请先登录');
      return;
    }

    if (!accessCheck?.user_info?.has_sufficient_pp) {
      toast.error('PP 余额不足');
      setShowRecharge(true);
      return;
    }

    try {
      const res = await fetch('/api/playpass/purchase-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content_id: contentId,
          content_type: contentType,
          amount_pp: accessCheck.pricing?.price_pp,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success('内容已解锁!');
        checkAccess(); // 刷新访问权限
      } else {
        throw new Error(data.error || '解锁失败');
      }
    } catch (error: any) {
      console.error('解锁失败:', error);
      toast.error(error.message || '解锁失败');
    }
  };

  // ============================================
  // 使用 Web3 解锁
  // ============================================
  const handleWeb3Unlock = () => {
    setShowWeb3Payment(true);
  };

  // ============================================
  // Web3 支付成功回调
  // ============================================
  const handleWeb3Success = () => {
    setShowWeb3Payment(false);
    toast.success('内容已解锁!');
    checkAccess(); // 刷新访问权限
  };

  // ============================================
  // 充值成功回调
  // ============================================
  const handleRechargeSuccess = () => {
    setShowRecharge(false);
    checkAccess(); // 刷新余额
  };

  // ============================================
  // 加载状态
  // ============================================
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // ============================================
  // 有访问权限
  // ============================================
  if (accessCheck?.has_access) {
    return (
      <div className="space-y-4">
        {/* 访问权限提示 */}
        {accessCheck.access_method && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <span>
              {accessCheck.access_method === 'free' && '免费内容'}
              {accessCheck.access_method === 'max_member' && '会员专享'}
              {accessCheck.access_method === 'web3' && '已通过 Web3 解锁'}
              {accessCheck.access_method === 'playpass' && '已通过 PlayPass 解锁'}
            </span>
          </div>
        )}

        {/* 内容 */}
        {children}
      </div>
    );
  }

  // ============================================
  // 需要登录
  // ============================================
  if (accessCheck?.requires_login) {
    return (
      <Card className="p-8 text-center">
        <Lock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">需要登录</h3>
        <p className="text-muted-foreground mb-6">
          请登录后查看此内容
        </p>
        <Link href="/auth/login">
          <Button>
            前往登录
          </Button>
        </Link>
      </Card>
    );
  }

  // ============================================
  // 需要付费
  // ============================================
  if (accessCheck?.reason === 'payment_required') {
    const ppOption = accessCheck.payment_options?.find((o) => o.method === 'playpass');
    const web3Option = accessCheck.payment_options?.find((o) => o.method === 'web3');

    return (
      <>
        <div className="space-y-6">
          {/* 模糊/隐藏的内容预览 */}
          {!hideContent && (
            <div className={blurContent ? 'blur-sm pointer-events-none select-none' : ''}>
              {children}
            </div>
          )}

          {/* 付费墙遮罩 */}
          <Card className="p-8">
            <div className="text-center space-y-6">
              {/* 图标和标题 */}
              <div>
                <Lock className="h-16 w-16 mx-auto mb-4 text-primary" />
                <h3 className="text-2xl font-bold mb-2">
                  {lockedMessage || '解锁此内容'}
                </h3>
                <p className="text-muted-foreground">
                  {contentTitle}
                </p>
              </div>

              {/* 价格信息 */}
              {accessCheck.pricing && (
                <div className="flex items-center justify-center gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted">
                    <Coins className="h-5 w-5 text-amber-600" />
                    <span className="font-bold text-lg">
                      {accessCheck.pricing.price_pp} PP
                    </span>
                  </div>
                  <span className="text-muted-foreground">或</span>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted">
                    <Wallet className="h-5 w-5 text-blue-600" />
                    <span className="font-bold text-lg">
                      ${accessCheck.pricing.price_usd}
                    </span>
                  </div>
                </div>
              )}

              {/* 用户余额信息 */}
              {accessCheck.user_info && (
                <div className="text-sm text-muted-foreground">
                  <p>
                    当前余额: <span className="font-semibold">{accessCheck.user_info.credits} PP</span>
                  </p>
                  {!accessCheck.user_info.has_sufficient_pp && (
                    <p className="text-amber-600 mt-1">
                      还需 {accessCheck.user_info.pp_shortage} PP
                    </p>
                  )}
                </div>
              )}

              {/* 解锁选项 */}
              <div className="grid gap-3 max-w-md mx-auto">
                {/* PlayPass 解锁 */}
                {ppOption && (
                  <Button
                    onClick={
                      ppOption.available ? handlePPUnlock : () => setShowRecharge(true)
                    }
                    size="lg"
                    variant={ppOption.available ? 'default' : 'outline'}
                    className="w-full"
                  >
                    <Coins className="h-5 w-5 mr-2" />
                    {ppOption.available
                      ? `使用 ${ppOption.price} PP 解锁`
                      : `充值 PP 解锁`}
                  </Button>
                )}

                {/* Web3 解锁 */}
                {web3Option && (
                  <Button
                    onClick={handleWeb3Unlock}
                    size="lg"
                    variant="outline"
                    className="w-full"
                  >
                    <Wallet className="h-5 w-5 mr-2" />
                    使用加密货币支付 ${web3Option.price}
                  </Button>
                )}

                {/* 升级会员 */}
                <Link href="/membership">
                  <Button
                    variant="ghost"
                    className="w-full text-muted-foreground hover:text-foreground"
                  >
                    <Crown className="h-4 w-4 mr-2" />
                    升级 MAX 会员畅享全站内容
                  </Button>
                </Link>
              </div>

              {/* 提示信息 */}
              <p className="text-xs text-muted-foreground">
                一次解锁,永久访问 • 支持 Ethereum, Polygon, Base
              </p>
            </div>
          </Card>
        </div>

        {/* Web3 支付弹窗 */}
        <Web3PaymentDialog
          open={showWeb3Payment}
          onClose={() => setShowWeb3Payment(false)}
          purpose="content"
          contentId={contentId}
          contentType={contentType}
          contentTitle={contentTitle}
          onSuccess={handleWeb3Success}
        />

        {/* 充值弹窗 */}
        <RechargeDialog
          open={showRecharge}
          onClose={() => setShowRecharge(false)}
          currentBalance={accessCheck.user_info?.credits || 0}
          onSuccess={handleRechargeSuccess}
        />
      </>
    );
  }

  // ============================================
  // 其他错误情况
  // ============================================
  return (
    <Card className="p-8 text-center">
      <Lock className="h-12 w-12 mx-auto mb-4 text-red-600" />
      <h3 className="text-lg font-semibold mb-2">访问受限</h3>
      <p className="text-muted-foreground mb-6">
        {accessCheck?.reason || '无法访问此内容'}
      </p>
      <Button onClick={checkAccess} variant="outline">
        重试
      </Button>
    </Card>
  );
}