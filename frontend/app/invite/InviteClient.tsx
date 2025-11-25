'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Copy, Check, Loader2, ArrowLeft, Gift, TrendingUp, Award } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function InviteClient() {
  const router = useRouter();
  const { user: authUser, loading: authLoading, supabase } = useAuth();

  const [referralInfo, setReferralInfo] = useState<any>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  // 当用户状态变化时，加载邀请信息
  useEffect(() => {
    async function loadUserData() {
      if (authUser) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          await loadReferralInfo(session.access_token);
        }
      }
      setPageLoading(false);
    }

    if (!authLoading) {
      loadUserData();
    }
  }, [authUser, authLoading]);

  // 加载邀请信息
  async function loadReferralInfo(token: string) {
    try {
      const response = await fetch('/api/play-exchange/referral', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success && data.data) {
        setReferralInfo(data.data);
      }
    } catch (error) {
      console.error('加载邀请信息失败:', error);
    }
  }

  // 复制邀请链接
  const handleCopyLink = () => {
    if (referralInfo?.referral_link) {
      navigator.clipboard.writeText(referralInfo.referral_link);
      setLinkCopied(true);
      toast.success('邀请链接已复制');
      setTimeout(() => setLinkCopied(false), 2000);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <Loader2 className="w-12 h-12 animate-spin text-purple-600 dark:text-purple-400" />
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-gradient-to-br from-pink-600 to-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Users className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
            请先登录
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            登录后即可获取专属邀请链接，邀请好友获得积分
          </p>
          <button
            onClick={() => router.push('/auth/login')}
            className="px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white rounded-xl font-semibold transition-all shadow-lg"
          >
            前往登录
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800 bg-gradient-to-br from-pink-500/5 via-rose-500/5 to-purple-500/5 dark:from-pink-500/10 dark:via-rose-500/10 dark:to-purple-500/10">
        {/* Dynamic grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

        {/* Rotating lights */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-pink-500/30 via-rose-500/30 to-transparent rounded-full blur-3xl animate-[spin_20s_linear_infinite]" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-pink-600 dark:hover:text-pink-400 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回</span>
          </button>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-600 to-rose-600 flex items-center justify-center shadow-lg">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black">
                <span className="bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 bg-clip-text text-transparent">
                  邀请好友
                </span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 mt-2">
                每成功邀请1人注册获得1积分
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* 邀请统计卡片 */}
          {referralInfo && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">已邀请</span>
                  </div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white">
                    {referralInfo.stats?.total_invited || 0}
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">已注册</span>
                  </div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white">
                    {referralInfo.stats?.total_registered || 0}
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">获得积分</span>
                  </div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white">
                    {referralInfo.stats?.credits_earned || 0}
                  </div>
                </div>
              </motion.div>

              {/* 邀请链接 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-8 shadow-xl"
              >
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                  <Gift className="w-5 h-5 text-pink-500" />
                  你的专属邀请链接
                </h3>

                <div className="flex gap-3">
                  <div className="flex-1 px-4 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-xl text-pink-600 dark:text-pink-400 font-mono text-sm overflow-x-auto">
                    {referralInfo.referral_link}
                  </div>
                  <button
                    onClick={handleCopyLink}
                    className="px-6 py-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white rounded-xl transition-all flex items-center gap-2 shrink-0 shadow-lg hover:shadow-xl"
                  >
                    {linkCopied ? (
                      <>
                        <Check className="w-5 h-5" />
                        已复制
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5" />
                        复制
                      </>
                    )}
                  </button>
                </div>

                <div className="mt-6 p-4 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-500/10 dark:to-rose-500/10 border border-pink-200 dark:border-pink-500/30 rounded-xl">
                  <p className="text-sm text-pink-700 dark:text-pink-300">
                    💡 分享邀请链接给好友，好友注册成功后你将获得 1 积分奖励
                  </p>
                </div>
              </motion.div>

              {/* 最近邀请记录 */}
              {referralInfo.recent_referrals && referralInfo.recent_referrals.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-8 shadow-xl"
                >
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                    最近邀请
                  </h3>

                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {referralInfo.recent_referrals.map((ref: any) => (
                      <div
                        key={ref.id}
                        className="p-4 bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-700/50 rounded-xl flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white text-sm font-bold">
                            {ref.username ? ref.username[0].toUpperCase() : 'U'}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">
                              {ref.username || '用户'}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {new Date(ref.registered_at).toLocaleDateString('zh-CN')}
                            </p>
                          </div>
                        </div>
                        {ref.credit_awarded && (
                          <div className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm font-semibold rounded-full">
                            +1 积分
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
