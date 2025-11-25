'use client';

import { useState, useEffect } from 'react';
import { Lock, Unlock, Coins, AlertCircle, CheckCircle, Zap } from 'lucide-react';

interface ContentUnlockProps {
  userId: string;
  contentId: string;
  contentType: 'strategy' | 'arbitrage' | 'news' | 'gossip';
  contentTitle: string;
  membershipLevel?: number;
  onUnlock?: () => void;
  onError?: (error: string) => void;
}

interface PriceData {
  base_price: number;
  final_price: number;
  membership_level: number;
  discount_rate: number;
  discount_amount: number;
  is_free: boolean;
  free_preview_length: number;
  matched_rule?: {
    config_key: string;
    config_name: string;
  };
}

interface AccessData {
  has_access: boolean;
  access_method: string;
  is_locked: boolean;
  price?: PriceData;
  user_balance: number;
  has_sufficient_balance: boolean;
  shortage: number;
  free_preview_length: number;
  is_max_member?: boolean;
  unlocked_at?: string;
  pp_spent?: number;
}

export default function ContentUnlock({
  userId,
  contentId,
  contentType,
  contentTitle,
  membershipLevel = 0,
  onUnlock,
  onError,
}: ContentUnlockProps) {
  const [access, setAccess] = useState<AccessData | null>(null);
  const [loading, setLoading] = useState(true);
  const [unlocking, setUnlocking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 检查访问权限
  const checkAccess = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/playpass/check-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          content_id: contentId,
          content_type: contentType,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setAccess(result.data);
        setError(null);
      } else {
        setError(result.error || '检查权限失败');
      }
    } catch (err) {
      setError('网络错误');
      console.error('检查访问权限失败:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId && contentId) {
      checkAccess();
    }
  }, [userId, contentId]);

  // 解锁内容
  const handleUnlock = async () => {
    if (!access?.price) return;

    try {
      setUnlocking(true);
      const response = await fetch('/api/playpass/spend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          amount: access.price.final_price,
          content_id: contentId,
          content_type: contentType,
          content_title: contentTitle,
          description: `解锁 ${contentTitle}`,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // 刷新访问权限
        await checkAccess();
        onUnlock?.();
      } else {
        const errorMsg = result.error || '解锁失败';
        setError(errorMsg);
        onError?.(errorMsg);
      }
    } catch (err) {
      const errorMsg = '网络错误';
      setError(errorMsg);
      onError?.(errorMsg);
      console.error('解锁内容失败:', err);
    } finally {
      setUnlocking(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-32 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  if (error || !access) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-600 text-sm">{error || '加载失败'}</p>
        </div>
      </div>
    );
  }

  // 已解锁
  if (access.has_access) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          {access.is_max_member ? (
            <>
              <Zap className="w-6 h-6 text-yellow-600" />
              <div>
                <p className="font-semibold text-green-800 flex items-center gap-2">
                  MAX 会员特权访问
                </p>
                <p className="text-sm text-green-600 mt-1">
                  您可以免费访问全站所有内容
                </p>
              </div>
            </>
          ) : (
            <>
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-semibold text-green-800">内容已解锁</p>
                {access.unlocked_at && (
                  <p className="text-sm text-green-600 mt-1">
                    解锁时间: {new Date(access.unlocked_at).toLocaleDateString('zh-CN')}
                    {access.pp_spent !== undefined && ` • 消耗 ${access.pp_spent} PP`}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // 免费内容
  if (access.access_method === 'free') {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Unlock className="w-6 h-6 text-blue-600" />
          <div>
            <p className="font-semibold text-blue-800">免费内容</p>
            <p className="text-sm text-blue-600 mt-1">无需 PlayPass 即可访问</p>
          </div>
        </div>
      </div>
    );
  }

  // 需要解锁
  const price = access.price!;
  const hasSufficientBalance = access.has_sufficient_balance;

  return (
    <div className="bg-white border-2 border-orange-300 rounded-xl shadow-lg overflow-hidden">
      {/* 头部 */}
      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 px-6 py-4 border-b border-orange-200">
        <div className="flex items-center gap-3">
          <div className="bg-orange-100 p-2 rounded-lg">
            <Lock className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800">内容已锁定</h3>
            <p className="text-sm text-gray-600 mt-1">
              解锁后可永久访问完整内容
            </p>
          </div>
        </div>
      </div>

      {/* 价格信息 */}
      <div className="px-6 py-4 space-y-4">
        {/* 价格展示 */}
        <div className="bg-gray-50 rounded-lg px-4 py-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">解锁价格</span>
            <div className="text-right">
              {price.discount_amount > 0 && (
                <div className="text-xs text-gray-400 line-through">
                  {price.base_price} PP
                </div>
              )}
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-orange-600">
                  {price.final_price}
                </span>
                <span className="text-gray-600">PP</span>
              </div>
            </div>
          </div>

          {/* 会员折扣 */}
          {price.discount_amount > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-green-600">会员折扣 ({Math.round((1 - price.discount_rate) * 100)}% OFF)</span>
                <span className="text-green-600 font-semibold">
                  -{price.discount_amount} PP
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 余额检查 */}
        <div className="bg-blue-50 rounded-lg px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-700">当前余额</span>
            </div>
            <span className="font-bold text-blue-600">
              {access.user_balance} PP
            </span>
          </div>
        </div>

        {/* 余额不足提示 */}
        {!hasSufficientBalance && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-red-800">余额不足</p>
                <p className="text-xs text-red-600 mt-1">
                  还需要 {access.shortage} PP 才能解锁
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 免费预览提示 */}
        {access.free_preview_length > 0 && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg px-4 py-3">
            <p className="text-sm text-purple-800">
              📖 免费预览前 {access.free_preview_length} 字
            </p>
          </div>
        )}

        {/* 定价规则信息 */}
        {price.matched_rule && (
          <div className="text-xs text-gray-500 text-center">
            定价规则: {price.matched_rule.config_name}
          </div>
        )}
      </div>

      {/* 底部操作 */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        {hasSufficientBalance ? (
          <button
            onClick={handleUnlock}
            disabled={unlocking}
            className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {unlocking ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                解锁中...
              </>
            ) : (
              <>
                <Unlock className="w-5 h-5" />
                花费 {price.final_price} PP 解锁
              </>
            )}
          </button>
        ) : (
          <div className="space-y-2">
            <button
              disabled
              className="w-full bg-gray-300 text-gray-500 font-bold py-3 px-6 rounded-lg cursor-not-allowed"
            >
              余额不足
            </button>
            <p className="text-xs text-center text-gray-600">
              💡 提示: 通过每日签到、阅读内容等方式获取更多 PP
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
