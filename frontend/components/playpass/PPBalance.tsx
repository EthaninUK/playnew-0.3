'use client';

import { useState, useEffect } from 'react';
import { Coins, TrendingUp, Award, Zap } from 'lucide-react';

interface PPBalanceData {
  user_id: string;
  current_balance: number;
  total_earned: number;
  total_spent: number;
  membership_level: number;
  membership_name: string;
  is_max_member: boolean;
  earn_multiplier: number;
  daily_earn_limit: number;
  daily_earned_today: number;
  daily_remaining: number;
  pp_level: number;
  level_progress: number;
  consecutive_signin_days: number;
  total_signin_days: number;
  last_signin_date?: string;
}

interface PPBalanceProps {
  userId: string;
  compact?: boolean;
  showDetails?: boolean;
  onBalanceUpdate?: (balance: number) => void;
}

export default function PPBalance({
  userId,
  compact = false,
  showDetails = true,
  onBalanceUpdate,
}: PPBalanceProps) {
  const [data, setData] = useState<PPBalanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 获取余额数据
  const fetchBalance = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/playpass/balance?user_id=${userId}`);
      const result = await response.json();

      if (result.success) {
        setData(result.data);
        onBalanceUpdate?.(result.data.current_balance);
        setError(null);
      } else {
        setError(result.error || '获取余额失败');
      }
    } catch (err) {
      setError('网络错误');
      console.error('获取 PlayPass 余额失败:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchBalance();
    }
  }, [userId]);

  // 刷新余额
  const refreshBalance = () => {
    fetchBalance();
  };

  // 获取会员等级颜色
  const getMembershipColor = (level: number) => {
    const colors: Record<number, string> = {
      0: 'text-gray-600',
      1: 'text-blue-600',
      2: 'text-purple-600',
      3: 'text-orange-600',
      4: 'text-gradient-to-r from-yellow-500 to-orange-500',
    };
    return colors[level] || 'text-gray-600';
  };

  // 获取会员等级背景色
  const getMembershipBgColor = (level: number) => {
    const colors: Record<number, string> = {
      0: 'bg-gray-100',
      1: 'bg-blue-50',
      2: 'bg-purple-50',
      3: 'bg-orange-50',
      4: 'bg-gradient-to-r from-yellow-100 to-orange-100',
    };
    return colors[level] || 'bg-gray-100';
  };

  // 格式化数字
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-24 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600 text-sm">{error || '加载失败'}</p>
      </div>
    );
  }

  // 紧凑模式
  if (compact) {
    return (
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-lg ${getMembershipBgColor(
          data.membership_level
        )}`}
      >
        <Coins className={`w-5 h-5 ${getMembershipColor(data.membership_level)}`} />
        <span className={`font-bold ${getMembershipColor(data.membership_level)}`}>
          {data.is_max_member ? '∞' : formatNumber(data.current_balance)}
        </span>
        <span className="text-xs text-gray-500">PP</span>
      </div>
    );
  }

  // 完整模式
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* 头部 - 余额显示 */}
      <div
        className={`${getMembershipBgColor(
          data.membership_level
        )} px-6 py-6 border-b border-gray-200`}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Coins className={`w-6 h-6 ${getMembershipColor(data.membership_level)}`} />
              <h3 className="text-lg font-semibold text-gray-800">PlayPass 余额</h3>
            </div>
            <div className="flex items-baseline gap-2">
              <span
                className={`text-4xl font-bold ${getMembershipColor(
                  data.membership_level
                )}`}
              >
                {data.is_max_member ? '∞' : formatNumber(data.current_balance)}
              </span>
              <span className="text-gray-500 text-lg">PP</span>
            </div>
          </div>

          {/* 会员徽章 */}
          <div className="text-right">
            <div
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full ${
                data.is_max_member
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white'
                  : `${getMembershipBgColor(data.membership_level)} ${getMembershipColor(
                      data.membership_level
                    )}`
              } font-semibold text-sm`}
            >
              <Award className="w-4 h-4" />
              {data.membership_name}
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {data.earn_multiplier}x 倍率
            </div>
          </div>
        </div>

        {/* MAX 会员特殊提示 */}
        {data.is_max_member && (
          <div className="mt-4 bg-yellow-100 border border-yellow-300 rounded-lg px-4 py-2">
            <p className="text-yellow-800 text-sm font-medium flex items-center gap-2">
              <Zap className="w-4 h-4" />
              MAX 会员特权：无限 PP，全站内容免费访问
            </p>
          </div>
        )}
      </div>

      {/* 详细信息 */}
      {showDetails && !data.is_max_member && (
        <div className="px-6 py-4 space-y-4">
          {/* 每日获取进度 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">今日已获取</span>
              <span className="text-sm font-semibold text-gray-800">
                {data.daily_earned_today} / {data.daily_earn_limit} PP
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(
                    (data.daily_earned_today / data.daily_earn_limit) * 100,
                    100
                  )}%`,
                }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              剩余可获取: {data.daily_remaining} PP
            </p>
          </div>

          {/* 统计数据 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg px-4 py-3">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-xs text-gray-600">累计获得</span>
              </div>
              <p className="text-lg font-bold text-gray-800">
                {formatNumber(data.total_earned)}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg px-4 py-3">
              <div className="flex items-center gap-2 mb-1">
                <Coins className="w-4 h-4 text-orange-600" />
                <span className="text-xs text-gray-600">累计消费</span>
              </div>
              <p className="text-lg font-bold text-gray-800">
                {formatNumber(data.total_spent)}
              </p>
            </div>
          </div>

          {/* 签到信息 */}
          {data.consecutive_signin_days > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-800 font-medium">连续签到</p>
                  <p className="text-xs text-blue-600 mt-1">
                    总签到 {data.total_signin_days} 天
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">
                    {data.consecutive_signin_days}
                  </p>
                  <p className="text-xs text-blue-600">天</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MAX 会员简化信息 */}
      {showDetails && data.is_max_member && (
        <div className="px-6 py-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg px-4 py-3">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-xs text-gray-600">累计获得</span>
              </div>
              <p className="text-lg font-bold text-gray-800">
                {formatNumber(data.total_earned)}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg px-4 py-3">
              <div className="flex items-center gap-2 mb-1">
                <Award className="w-4 h-4 text-yellow-600" />
                <span className="text-xs text-gray-600">连续签到</span>
              </div>
              <p className="text-lg font-bold text-gray-800">
                {data.consecutive_signin_days} 天
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 底部操作按钮 */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <button
          onClick={refreshBalance}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          刷新余额
        </button>
      </div>
    </div>
  );
}
