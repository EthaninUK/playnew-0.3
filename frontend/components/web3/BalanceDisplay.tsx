/**
 * PlayPass 余额显示组件
 * 显示用户 PP 余额和充值按钮
 */

'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Coins, Plus, History, Loader2, TrendingUp, Wallet } from 'lucide-react';
import { RechargeDialog } from './RechargeDialog';
import { toast } from 'sonner';

// ============================================
// 类型定义
// ============================================

interface BalanceData {
  balance: {
    current: number;
    total_earned: number;
    total_spent: number;
  };
  recharge_stats: {
    total_recharged_usd: number;
    last_recharge_at: string | null;
  };
  recent_transactions: Transaction[];
}

interface Transaction {
  id: string;
  type: string;
  amount: number;
  balance_after: number;
  description: string;
  created_at: string;
}

interface BalanceDisplayProps {
  variant?: 'compact' | 'full';
  showRechargeButton?: boolean;
}

// ============================================
// 主组件
// ============================================

export function BalanceDisplay({
  variant = 'compact',
  showRechargeButton = true,
}: BalanceDisplayProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [balanceData, setBalanceData] = useState<BalanceData | null>(null);
  const [showRechargeDialog, setShowRechargeDialog] = useState(false);

  // ============================================
  // 获取余额数据
  // ============================================
  const fetchBalance = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const res = await fetch('/api/web3/recharge-credits');
      const data = await res.json();

      if (data.success) {
        setBalanceData(data.data);
      } else {
        console.error('获取余额失败:', data.error);
      }
    } catch (error) {
      console.error('获取余额失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [user]);

  // ============================================
  // 刷新余额
  // ============================================
  const handleRefresh = () => {
    fetchBalance();
    toast.success('余额已刷新');
  };

  // ============================================
  // 充值成功回调
  // ============================================
  const handleRechargeSuccess = () => {
    fetchBalance();
  };

  // ============================================
  // 未登录状态
  // ============================================
  if (!user) {
    return null;
  }

  // ============================================
  // 加载状态
  // ============================================
  if (loading && !balanceData) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg border">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        <span className="text-sm text-muted-foreground">加载中...</span>
      </div>
    );
  }

  const currentBalance = balanceData?.balance.current || 0;
  const totalEarned = balanceData?.balance.total_earned || 0;
  const totalSpent = balanceData?.balance.total_spent || 0;
  const recentTransactions = balanceData?.recent_transactions || [];

  // ============================================
  // 紧凑模式
  // ============================================
  if (variant === 'compact') {
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2 font-semibold"
            >
              <Coins className="h-4 w-4 text-amber-600" />
              <span>{currentBalance.toLocaleString()}</span>
              <span className="text-xs text-muted-foreground">PP</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-[300px]">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>PlayPass 余额</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  '刷新'
                )}
              </Button>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            {/* 余额统计 */}
            <div className="px-2 py-3 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">当前余额</span>
                <span className="text-xl font-bold">
                  {currentBalance.toLocaleString()} PP
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="rounded-lg border p-2">
                  <div className="text-xs text-muted-foreground mb-1">
                    累计获得
                  </div>
                  <div className="font-semibold text-sm flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                    {totalEarned.toLocaleString()}
                  </div>
                </div>
                <div className="rounded-lg border p-2">
                  <div className="text-xs text-muted-foreground mb-1">
                    累计消费
                  </div>
                  <div className="font-semibold text-sm">
                    {totalSpent.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            <DropdownMenuSeparator />

            {/* 最近交易 */}
            {recentTransactions.length > 0 && (
              <>
                <div className="px-2 py-2">
                  <div className="text-xs text-muted-foreground mb-2">
                    最近交易
                  </div>
                  <div className="space-y-1 max-h-[200px] overflow-y-auto">
                    {recentTransactions.slice(0, 5).map((tx) => (
                      <div
                        key={tx.id}
                        className="flex justify-between items-start text-xs py-1"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="truncate">{tx.description}</div>
                          <div className="text-muted-foreground text-[10px]">
                            {new Date(tx.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <div
                          className={`font-medium ml-2 ${
                            tx.amount > 0 ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {tx.amount > 0 ? '+' : ''}
                          {tx.amount}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <DropdownMenuSeparator />
              </>
            )}

            {/* 充值按钮 */}
            {showRechargeButton && (
              <div className="p-2">
                <Button
                  onClick={() => setShowRechargeDialog(true)}
                  className="w-full"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  充值
                </Button>
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 充值弹窗 */}
        <RechargeDialog
          open={showRechargeDialog}
          onClose={() => setShowRechargeDialog(false)}
          currentBalance={currentBalance}
          onSuccess={handleRechargeSuccess}
        />
      </>
    );
  }

  // ============================================
  // 完整模式
  // ============================================
  return (
    <>
      <div className="rounded-lg border p-6 space-y-6">
        {/* 标题栏 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-amber-600" />
            <h3 className="text-lg font-semibold">PlayPass 余额</h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              '刷新'
            )}
          </Button>
        </div>

        {/* 当前余额 */}
        <div className="text-center py-6 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 rounded-lg">
          <div className="text-sm text-muted-foreground mb-2">当前余额</div>
          <div className="text-5xl font-bold mb-1">
            {currentBalance.toLocaleString()}
          </div>
          <div className="text-muted-foreground">PlayPass</div>
        </div>

        {/* 统计信息 */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 rounded-lg border">
            <div className="text-xs text-muted-foreground mb-1">累计获得</div>
            <div className="font-bold text-green-600">
              {totalEarned.toLocaleString()}
            </div>
          </div>
          <div className="text-center p-3 rounded-lg border">
            <div className="text-xs text-muted-foreground mb-1">累计消费</div>
            <div className="font-bold">{totalSpent.toLocaleString()}</div>
          </div>
          <div className="text-center p-3 rounded-lg border">
            <div className="text-xs text-muted-foreground mb-1">充值金额</div>
            <div className="font-bold">
              ${balanceData?.recharge_stats.total_recharged_usd || 0}
            </div>
          </div>
        </div>

        {/* 最近交易 */}
        {recentTransactions.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <History className="h-4 w-4 text-muted-foreground" />
              <h4 className="font-semibold text-sm">最近交易</h4>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {recentTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex justify-between items-start p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm mb-1">
                      {tx.description}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(tx.created_at).toLocaleString('zh-CN')}
                    </div>
                  </div>
                  <div className="flex flex-col items-end ml-4">
                    <div
                      className={`font-bold ${
                        tx.amount > 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {tx.amount > 0 ? '+' : ''}
                      {tx.amount} PP
                    </div>
                    <div className="text-xs text-muted-foreground">
                      余额: {tx.balance_after}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 充值按钮 */}
        {showRechargeButton && (
          <Button
            onClick={() => setShowRechargeDialog(true)}
            className="w-full"
            size="lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            充值 PlayPass
          </Button>
        )}
      </div>

      {/* 充值弹窗 */}
      <RechargeDialog
        open={showRechargeDialog}
        onClose={() => setShowRechargeDialog(false)}
        currentBalance={currentBalance}
        onSuccess={handleRechargeSuccess}
      />
    </>
  );
}