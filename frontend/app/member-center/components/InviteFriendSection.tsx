'use client';

import { useState, useEffect } from 'react';
import { Users, Copy, Check, Loader2, Gift, TrendingUp, Award } from 'lucide-react';
import { toast } from 'sonner';

interface ReferralInfo {
  referral_link: string;
  stats: {
    total_invited: number;
    total_registered: number;
    credits_earned: number;
  };
  recent_referrals: Array<{
    id: string;
    username: string;
    registered_at: string;
    credit_awarded: boolean;
  }>;
}

interface InviteFriendSectionProps {
  userId: string;
}

export default function InviteFriendSection({ userId }: InviteFriendSectionProps) {
  const [referralInfo, setReferralInfo] = useState<ReferralInfo | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReferralInfo();
  }, [userId]);

  async function loadReferralInfo() {
    try {
      // TODO: 从 API 加载实际邀请数据
      // 暂时使用演示数据
      const demoReferralInfo: ReferralInfo = {
        referral_link: `https://playnew.ai/invite/${userId}`,
        stats: {
          total_invited: 5,
          total_registered: 3,
          credits_earned: 300,
        },
        recent_referrals: [
          {
            id: '1',
            username: '用户A',
            registered_at: new Date(Date.now() - 86400000).toISOString(),
            credit_awarded: true,
          },
          {
            id: '2',
            username: '用户B',
            registered_at: new Date(Date.now() - 172800000).toISOString(),
            credit_awarded: true,
          },
        ],
      };

      setReferralInfo(demoReferralInfo);
    } catch (error) {
      console.error('加载邀请信息失败:', error);
      toast.error('加载邀请信息失败');
    } finally {
      setLoading(false);
    }
  }

  const handleCopyLink = () => {
    if (referralInfo?.referral_link) {
      navigator.clipboard.writeText(referralInfo.referral_link);
      setLinkCopied(true);
      toast.success('邀请链接已复制');
      setTimeout(() => setLinkCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-10 h-10 animate-spin text-pink-500" />
      </div>
    );
  }

  if (!referralInfo) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">加载邀请信息失败</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 邀请统计 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-600">已邀请</span>
          </div>
          <div className="text-4xl font-bold text-gray-900">
            {referralInfo.stats.total_invited}
          </div>
          <p className="text-xs text-gray-500 mt-2">点击邀请链接的人数</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-600">已注册</span>
          </div>
          <div className="text-4xl font-bold text-gray-900">
            {referralInfo.stats.total_registered}
          </div>
          <p className="text-xs text-gray-500 mt-2">成功完成注册的人数</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-600">获得积分</span>
          </div>
          <div className="text-4xl font-bold text-gray-900">
            {referralInfo.stats.credits_earned}
          </div>
          <p className="text-xs text-gray-500 mt-2">通过邀请获得的总积分</p>
        </div>
      </div>

      {/* 邀请链接 */}
      <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
            <Gift className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">你的专属邀请链接</h2>
            <p className="text-sm text-gray-500">每成功邀请1人注册获得100积分</p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex-1 px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-pink-600 font-mono text-sm overflow-x-auto">
            {referralInfo.referral_link}
          </div>
          <button
            onClick={handleCopyLink}
            className="px-6 py-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white rounded-xl transition-all flex items-center gap-2 shrink-0 shadow-lg hover:shadow-xl font-semibold"
          >
            {linkCopied ? (
              <>
                <Check className="w-5 h-5" />
                已复制
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                复制链接
              </>
            )}
          </button>
        </div>

        <div className="mt-6 p-4 bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-200 rounded-xl">
          <p className="text-sm text-pink-700 flex items-start gap-2">
            <Gift className="w-4 h-4 mt-0.5 shrink-0" />
            <span>
              分享邀请链接给好友，好友注册成功后你将获得 100 积分奖励！邀请越多，奖励越多
            </span>
          </p>
        </div>
      </div>

      {/* 最近邀请记录 */}
      {referralInfo.recent_referrals && referralInfo.recent_referrals.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            最近邀请
          </h3>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {referralInfo.recent_referrals.map((ref) => (
              <div
                key={ref.id}
                className="p-4 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white text-lg font-bold">
                    {ref.username ? ref.username[0].toUpperCase() : 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {ref.username || '用户'}
                    </p>
                    <p className="text-xs text-gray-500">
                      注册时间: {new Date(ref.registered_at).toLocaleDateString('zh-CN')}
                    </p>
                  </div>
                </div>
                {ref.credit_awarded && (
                  <div className="px-4 py-2 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                    +100 积分
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 邀请规则说明 */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">邀请规则</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 shrink-0">•</span>
            <span>好友通过你的专属链接访问网站并完成注册</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 shrink-0">•</span>
            <span>每成功邀请1位好友，你将获得 100 积分奖励</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 shrink-0">•</span>
            <span>被邀请的好友也会获得新手奖励积分</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 shrink-0">•</span>
            <span>邀请数量不限，多邀多得</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
