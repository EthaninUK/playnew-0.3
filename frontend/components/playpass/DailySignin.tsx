'use client';

import { useState, useEffect } from 'react';
import { Calendar, Gift, TrendingUp, Zap, CheckCircle, Clock } from 'lucide-react';

interface DailySigninProps {
  userId: string;
  membershipLevel?: number;
  onSigninSuccess?: (earnedPP: number) => void;
}

interface SigninData {
  user_id: string;
  earned_pp: number;
  base_amount: number;
  streak_bonus: number;
  current_balance: number;
  consecutive_days: number;
  total_signin_days: number;
  daily_earned_today: number;
  daily_limit: number;
  next_signin: string;
}

export default function DailySignin({
  userId,
  membershipLevel = 0,
  onSigninSuccess,
}: DailySigninProps) {
  const [signed, setSigned] = useState(false);
  const [signinData, setSigninData] = useState<SigninData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showReward, setShowReward] = useState(false);

  // 检查今日是否已签到
  const checkSigninStatus = async () => {
    try {
      const response = await fetch(`/api/playpass/balance?user_id=${userId}`);
      const result = await response.json();

      if (result.success) {
        const today = new Date().toISOString().split('T')[0];
        const lastSignin = result.data.last_signin_date;
        setSigned(lastSignin === today);
      }
    } catch (err) {
      console.error('检查签到状态失败:', err);
    }
  };

  useEffect(() => {
    if (userId) {
      checkSigninStatus();
    }
  }, [userId]);

  // 每日签到
  const handleSignin = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/playpass/daily-signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId }),
      });

      const result = await response.json();

      if (result.success) {
        setSigninData(result.data);
        setSigned(true);
        setShowReward(true);
        onSigninSuccess?.(result.data.earned_pp);

        // 3秒后隐藏奖励动画
        setTimeout(() => {
          setShowReward(false);
        }, 3000);
      } else {
        setError(result.error || '签到失败');
      }
    } catch (err) {
      setError('网络错误');
      console.error('签到失败:', err);
    } finally {
      setLoading(false);
    }
  };

  // 获取连续签到进度 (7天一个周期)
  const getStreakProgress = () => {
    if (!signinData) return 0;
    return (signinData.consecutive_days % 7) || 7;
  };

  // 获取会员倍率
  const getMembershipMultiplier = () => {
    const multipliers: Record<number, number> = {
      0: 1.0,
      1: 1.2,
      2: 1.5,
      3: 2.0,
      4: 999.99,
    };
    return multipliers[membershipLevel] || 1.0;
  };

  // 已签到状态
  if (signed && signinData) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* 成功状态 */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">今日已签到</h3>
                <p className="text-sm text-gray-600 mt-1">
                  获得 {signinData.earned_pp} PP
                </p>
              </div>
            </div>

            {/* 奖励展示 */}
            {showReward && (
              <div className="animate-bounce">
                <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg px-4 py-2">
                  <p className="text-yellow-800 font-bold text-lg">
                    +{signinData.earned_pp} PP
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 签到详情 */}
        <div className="px-6 py-4 space-y-4">
          {/* 连续签到进度 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">
                连续签到进度
              </span>
              <span className="text-sm text-gray-600">
                {getStreakProgress()} / 7 天
              </span>
            </div>

            {/* 7天进度条 */}
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                <div
                  key={day}
                  className={`flex-1 h-2 rounded-full ${
                    day <= getStreakProgress()
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                      : 'bg-gray-200'
                  }`}
                ></div>
              ))}
            </div>

            <p className="text-xs text-gray-500 mt-2">
              {getStreakProgress() === 7
                ? '🎉 完成本周期！下次签到开始新周期'
                : `再签到 ${7 - getStreakProgress()} 天可获得额外奖励`}
            </p>
          </div>

          {/* 统计信息 */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-blue-50 rounded-lg px-3 py-3 text-center">
              <p className="text-2xl font-bold text-blue-600">
                {signinData.consecutive_days}
              </p>
              <p className="text-xs text-gray-600 mt-1">连续天数</p>
            </div>

            <div className="bg-purple-50 rounded-lg px-3 py-3 text-center">
              <p className="text-2xl font-bold text-purple-600">
                {signinData.total_signin_days}
              </p>
              <p className="text-xs text-gray-600 mt-1">累计签到</p>
            </div>

            <div className="bg-green-50 rounded-lg px-3 py-3 text-center">
              <p className="text-2xl font-bold text-green-600">
                {signinData.streak_bonus}
              </p>
              <p className="text-xs text-gray-600 mt-1">连签奖励</p>
            </div>
          </div>

          {/* 明日签到提醒 */}
          <div className="bg-gray-50 rounded-lg px-4 py-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-700">
                明天可再次签到: {new Date(signinData.next_signin).toLocaleDateString('zh-CN')}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 未签到状态
  return (
    <div className="bg-white rounded-xl shadow-lg border-2 border-blue-300 overflow-hidden">
      {/* 头部 */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-3 rounded-full">
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">每日签到</h3>
            <p className="text-sm text-gray-600 mt-1">
              每天签到获取免费 PP
            </p>
          </div>
        </div>
      </div>

      {/* 签到内容 */}
      <div className="px-6 py-6 space-y-6">
        {/* 奖励预览 */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Gift className="w-10 h-10 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">今日签到可获得</p>
                <p className="text-3xl font-bold text-yellow-600 mt-1">
                  {Math.round(10 * getMembershipMultiplier())} PP
                </p>
              </div>
            </div>
            <Zap className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        {/* 奖励说明 */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">基础奖励</p>
              <p className="text-xs text-gray-600">
                10 PP × {getMembershipMultiplier()}x 会员倍率
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Gift className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">连签奖励</p>
              <p className="text-xs text-gray-600">
                每连续签到 7 天额外获得 10 PP
              </p>
            </div>
          </div>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* 签到按钮 */}
        <button
          onClick={handleSignin}
          disabled={loading || signed}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              签到中...
            </>
          ) : (
            <>
              <Calendar className="w-5 h-5" />
              立即签到
            </>
          )}
        </button>

        {/* 提示 */}
        <p className="text-xs text-center text-gray-500">
          💡 每天 00:00 重置，连续签到获得更多奖励
        </p>
      </div>
    </div>
  );
}
