/**
 * Web3 支付弹窗组件
 * 处理内容购买和充值的 Web3 支付流程
 */

'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWalletClient, usePublicClient } from 'wagmi';
import { parseUnits, Address } from 'viem';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, CheckCircle2, XCircle, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

// ============================================
// 类型定义
// ============================================

interface PaymentChain {
  chain_id: number;
  chain_name: string;
  platform_wallet: string;
  supported_tokens: PaymentToken[];
}

interface PaymentToken {
  symbol: string;
  decimals: number;
  token_address?: string | null;
  price_decimal: string;
  price_wei: string;
  is_preferred?: boolean;
}

interface Web3PaymentDialogProps {
  open: boolean;
  onClose: () => void;

  // 支付目的
  purpose: 'content' | 'recharge' | 'membership';

  // 内容购买相关
  contentId?: string;
  contentType?: string;
  contentTitle?: string;

  // 充值相关
  rechargeAmount?: number;  // USD

  // 支付成功回调
  onSuccess?: (data: any) => void;
}

type PaymentStep = 'loading' | 'select_chain' | 'select_token' | 'confirm' | 'sending' | 'verifying' | 'success' | 'error';

// ============================================
// 主组件
// ============================================

export function Web3PaymentDialog({
  open,
  onClose,
  purpose,
  contentId,
  contentType,
  contentTitle,
  rechargeAmount,
  onSuccess,
}: Web3PaymentDialogProps) {
  const { address, isConnected, chain: currentChain } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  // 状态
  const [step, setStep] = useState<PaymentStep>('loading');
  const [paymentInfo, setPaymentInfo] = useState<any>(null);
  const [selectedChain, setSelectedChain] = useState<PaymentChain | null>(null);
  const [selectedToken, setSelectedToken] = useState<PaymentToken | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ============================================
  // 初始化: 获取支付信息
  // ============================================
  useEffect(() => {
    if (!open) return;

    const fetchPaymentInfo = async () => {
      try {
        setStep('loading');
        setError(null);

        const params = new URLSearchParams({
          purpose,
        });

        if (purpose === 'content') {
          if (!contentId || !contentType) {
            throw new Error('缺少内容信息');
          }
          params.append('content_id', contentId);
          params.append('content_type', contentType);
        } else if (purpose === 'recharge') {
          if (!rechargeAmount || rechargeAmount <= 0) {
            throw new Error('充值金额无效');
          }
          params.append('amount', rechargeAmount.toString());
        } else if (purpose === 'membership') {
          if (!contentId || !rechargeAmount) {
            throw new Error('缺少会员信息');
          }
          params.append('membership_id', contentId);
          params.append('amount', rechargeAmount.toString());
        }

        const res = await fetch(`/api/web3/payment-info?${params.toString()}`);
        const data = await res.json();

        if (!data.success) {
          throw new Error(data.error || '获取支付信息失败');
        }

        setPaymentInfo(data.data);
        setStep('select_chain');

        // 如果只有一条链,自动选择
        if (data.data.supported_chains.length === 1) {
          handleSelectChain(data.data.supported_chains[0]);
        }
      } catch (err: any) {
        console.error('获取支付信息失败:', err);
        setError(err.message);
        setStep('error');
      }
    };

    fetchPaymentInfo();
  }, [open, purpose, contentId, contentType, rechargeAmount]);

  // ============================================
  // 选择链
  // ============================================
  const handleSelectChain = (chain: PaymentChain) => {
    setSelectedChain(chain);
    setSelectedToken(null);

    // 如果只有一个代币,自动选择
    if (chain.supported_tokens.length === 1) {
      handleSelectToken(chain.supported_tokens[0]);
    } else {
      setStep('select_token');
    }
  };

  // ============================================
  // 选择代币
  // ============================================
  const handleSelectToken = (token: PaymentToken) => {
    setSelectedToken(token);
    setStep('confirm');
  };

  // ============================================
  // 发起支付
  // ============================================
  const handlePay = async () => {
    if (!walletClient || !selectedChain || !selectedToken || !address) {
      toast.error('请先连接钱包');
      return;
    }

    try {
      setStep('sending');
      setError(null);

      const isNativeToken = !selectedToken.token_address;

      // 原生代币转账 (ETH, MATIC 等)
      if (isNativeToken) {
        const hash = await walletClient.sendTransaction({
          to: selectedChain.platform_wallet as Address,
          value: BigInt(selectedToken.price_wei),
          chain: currentChain,
        });

        setTxHash(hash);
        setStep('verifying');
        await verifyTransaction(hash);
      } else {
        // ERC-20 代币转账
        // TODO: 实现 ERC-20 transfer
        toast.error('ERC-20 转账功能即将推出');
      }
    } catch (err: any) {
      console.error('支付失败:', err);
      setError(err.message || '支付失败');
      setStep('error');
      toast.error('支付失败: ' + (err.message || '未知错误'));
    }
  };

  // ============================================
  // 验证交易
  // ============================================
  const verifyTransaction = async (hash: string) => {
    try {
      const res = await fetch('/api/web3/verify-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tx_hash: hash,
          chain_id: selectedChain!.chain_id,
          payment_purpose: purpose,
          amount_usd: paymentInfo.amount_usd || paymentInfo.pricing?.price_usd,
          content_id: contentId,
          content_type: contentType,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || '交易验证失败');
      }

      setStep('success');
      toast.success(purpose === 'recharge' ? '充值成功!' : purpose === 'membership' ? '会员购买成功!' : '内容已解锁!');

      if (onSuccess) {
        onSuccess(data.data);
      }

      // 3秒后自动关闭
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (err: any) {
      console.error('验证失败:', err);
      setError(err.message);
      setStep('error');
      toast.error('验证失败: ' + (err.message || '未知错误'));
    }
  };

  // ============================================
  // 渲染函数
  // ============================================

  const renderStepContent = () => {
    switch (step) {
      case 'loading':
        return (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">加载支付信息...</p>
          </div>
        );

      case 'select_chain':
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">选择支付网络</p>
            <div className="grid gap-3">
              {paymentInfo.supported_chains.map((chain: PaymentChain) => (
                <Button
                  key={chain.chain_id}
                  variant="outline"
                  className="w-full justify-start h-auto p-4"
                  onClick={() => handleSelectChain(chain)}
                >
                  <div className="flex flex-col items-start">
                    <div className="font-semibold capitalize">{chain.chain_name}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {chain.supported_tokens.length} 种代币可用
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        );

      case 'select_token':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                选择代币 ({selectedChain?.chain_name})
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStep('select_chain')}
              >
                返回
              </Button>
            </div>
            <div className="grid gap-3">
              {selectedChain?.supported_tokens.map((token) => (
                <Button
                  key={token.symbol}
                  variant="outline"
                  className="w-full justify-between h-auto p-4"
                  onClick={() => handleSelectToken(token)}
                >
                  <div className="flex flex-col items-start">
                    <div className="font-semibold">{token.symbol}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {token.price_decimal} {token.symbol}
                    </div>
                  </div>
                  {token.is_preferred && (
                    <Badge variant="secondary">推荐</Badge>
                  )}
                </Button>
              ))}
            </div>
          </div>
        );

      case 'confirm':
        return (
          <div className="space-y-6">
            {/* 支付摘要 */}
            <div className="rounded-lg border p-4 space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-sm text-muted-foreground">
                  {purpose === 'recharge' ? '充值金额' : purpose === 'membership' ? '购买会员' : '内容'}
                </span>
                <div className="text-right">
                  {purpose === 'recharge' ? (
                    <>
                      <div className="font-semibold">${paymentInfo.amount_usd}</div>
                      {paymentInfo.recharge_info && (
                        <div className="text-xs text-muted-foreground">
                          {paymentInfo.recharge_info.total_pp} PP
                          {paymentInfo.recharge_info.bonus_pp > 0 && (
                            <span className="text-green-600 ml-1">
                              (+{paymentInfo.recharge_info.bonus_pp} 奖励)
                            </span>
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="font-semibold">{contentTitle}</div>
                      <div className="text-xs text-muted-foreground">
                        ${paymentInfo.pricing?.price_usd}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">支付网络</span>
                <span className="font-medium capitalize">{selectedChain?.chain_name}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">支付代币</span>
                <span className="font-medium">{selectedToken?.symbol}</span>
              </div>

              <div className="flex justify-between items-start pt-2 border-t">
                <span className="text-sm text-muted-foreground">应付金额</span>
                <div className="text-right">
                  <div className="font-bold text-lg">
                    {selectedToken?.price_decimal} {selectedToken?.symbol}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    + Gas 费用
                  </div>
                </div>
              </div>
            </div>

            {/* 连接钱包或支付按钮 */}
            {!isConnected ? (
              <ConnectButton.Custom>
                {({ openConnectModal }) => (
                  <Button onClick={openConnectModal} className="w-full" size="lg">
                    连接钱包
                  </Button>
                )}
              </ConnectButton.Custom>
            ) : currentChain?.id !== selectedChain?.chain_id ? (
              <div className="space-y-2">
                <p className="text-sm text-amber-600 text-center">
                  请切换到 {selectedChain?.chain_name} 网络
                </p>
                <ConnectButton.Custom>
                  {({ openChainModal }) => (
                    <Button onClick={openChainModal} variant="outline" className="w-full">
                      切换网络
                    </Button>
                  )}
                </ConnectButton.Custom>
              </div>
            ) : (
              <Button onClick={handlePay} className="w-full" size="lg">
                确认支付
              </Button>
            )}

            <div className="flex gap-2">
              <Button
                variant="ghost"
                className="flex-1"
                onClick={() => setStep('select_token')}
              >
                返回
              </Button>
            </div>
          </div>
        );

      case 'sending':
        return (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="font-semibold mb-2">发送交易中...</p>
            <p className="text-sm text-muted-foreground text-center">
              请在钱包中确认交易
            </p>
          </div>
        );

      case 'verifying':
        return (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="font-semibold mb-2">验证交易中...</p>
            <p className="text-sm text-muted-foreground text-center mb-4">
              等待区块确认,通常需要 1-3 分钟
            </p>
            {txHash && (
              <a
                href={`https://etherscan.io/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary flex items-center gap-1 hover:underline"
              >
                查看交易 <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        );

      case 'success':
        return (
          <div className="flex flex-col items-center justify-center py-12">
            <CheckCircle2 className="h-16 w-16 text-green-600 mb-4" />
            <p className="font-semibold text-lg mb-2">
              {purpose === 'recharge' ? '充值成功!' : purpose === 'membership' ? '会员购买成功!' : '内容已解锁!'}
            </p>
            {purpose === 'recharge' && paymentInfo?.recharge_info && (
              <div className="text-center text-sm text-muted-foreground">
                <p>获得 {paymentInfo.recharge_info.total_pp} PP</p>
                {paymentInfo.recharge_info.bonus_pp > 0 && (
                  <p className="text-green-600">
                    包含 {paymentInfo.recharge_info.bonus_pp} PP 奖励
                  </p>
                )}
              </div>
            )}
            {purpose === 'membership' && (
              <div className="text-center text-sm text-muted-foreground">
                <p>会员权益已激活，有效期 365 天</p>
              </div>
            )}
            {txHash && (
              <a
                href={`https://etherscan.io/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary flex items-center gap-1 hover:underline mt-4"
              >
                查看交易 <ExternalLink className="h-3 w-3" />
              </a>
            )}
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
          <DialogTitle>
            {purpose === 'recharge' ? '充值 PlayPass' : purpose === 'membership' ? '购买会员' : '解锁内容'}
          </DialogTitle>
          <DialogDescription>
            {purpose === 'recharge'
              ? '使用加密货币为您的账户充值 PlayPass 积分'
              : purpose === 'membership'
              ? '使用加密货币购买会员，支持多种代币和网络'
              : '使用加密货币一次性解锁此内容'}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">{renderStepContent()}</div>
      </DialogContent>
    </Dialog>
  );
}