'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Gift, Users, FileText, Send, Copy, Check, TrendingUp, Award, Clock, Loader2, ArrowUpRight } from 'lucide-react';
import { getCategoryGroups, type CategoryGroup } from '@/lib/directus';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface Play {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  risk_level: number;
  apy_min: number;
  apy_max: number;
  cover_image: string | null;
  card_index: number;
}

interface UserInfo {
  user_id: string;
  email: string;
  credits: number;
  first_draw_used: boolean;
  referral_code: string;
  total_plays: number;
  my_plays: string[];
  has_drawn_today: boolean;
  today_play_id: string | null;
}

interface Submission {
  id: string;
  title: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  credits_awarded: number;
  review_notes: string;
  created_at: string;
  reviewed_at: string;
}

export default function PlayExchangeClient() {
  const router = useRouter();
  const { user: authUser, loading: authLoading, supabase } = useAuth();

  // 用户状态
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [pageLoading, setPageLoading] = useState(true);

  // 分类数据
  const [categoryGroups, setCategoryGroups] = useState<CategoryGroup[]>([]);
  const [allCategories, setAllCategories] = useState<Array<{ name: string; slug: string; icon?: string }>>([]);

  // 今日精选
  const [dailyFeatured, setDailyFeatured] = useState<{
    date: string;
    theme_label: string;
    plays: Play[];
  } | null>(null);

  // 翻牌状态
  const [isDrawing, setIsDrawing] = useState(false);
  const [flippedCards, setFlippedCards] = useState([false, false, false]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [selectedPlay, setSelectedPlay] = useState<Play | null>(null);

  // 提交记录
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [submissionForm, setSubmissionForm] = useState({
    title: '',
    category: '',
    content: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 邀请状态
  const [referralInfo, setReferralInfo] = useState<any>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  // 初始化：检查登录状态和数据
  useEffect(() => {
    loadCategories();
    loadDailyFeatured();
  }, []);

  // 当用户状态变化时，加载用户相关数据
  useEffect(() => {
    async function loadUserData() {
      if (authUser) {
        console.log('✅ 用户已登录:', authUser.email);
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          await loadUserInfo(session.access_token);
          await loadSubmissions(session.access_token);
          await loadReferralInfo(session.access_token);
        }
      } else {
        console.log('⚠️ 用户未登录');
      }
      setPageLoading(false);
    }

    if (!authLoading) {
      loadUserData();
    }
  }, [authUser, authLoading]);

  // 加载用户信息
  async function loadUserInfo(token: string) {
    try {
      const res = await fetch('/api/play-exchange/user-info', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setUserInfo(data.data);
      }
    } catch (error) {
      console.error('加载用户信息失败:', error);
    }
  }

  // 加载分类数据
  async function loadCategories() {
    const groups = await getCategoryGroups();
    setCategoryGroups(groups);

    const allCats: Array<{ name: string; slug: string; icon?: string }> = [];
    groups.forEach(group => {
      group.children.forEach(child => {
        allCats.push({
          name: child.name,
          slug: child.slug,
          icon: child.icon
        });
      });
    });
    setAllCategories(allCats);
  }

  // 加载今日精选
  async function loadDailyFeatured() {
    try {
      const res = await fetch('/api/play-exchange/daily-featured');
      const data = await res.json();
      if (data.success) {
        setDailyFeatured(data.data);
      }
    } catch (error) {
      console.error('加载今日精选失败:', error);
    }
  }

  // 加载提交记录
  async function loadSubmissions(token: string) {
    try {
      const res = await fetch('/api/play-exchange/submit', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setSubmissions(data.data.submissions);
      }
    } catch (error) {
      console.error('加载提交记录失败:', error);
    }
  }

  // 加载邀请信息
  async function loadReferralInfo(token: string) {
    try {
      const res = await fetch('/api/play-exchange/referral', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setReferralInfo(data.data);
      }
    } catch (error) {
      console.error('加载邀请信息失败:', error);
    }
  }

  // 翻牌
  async function handleFlipCard(index: number) {
    if (!authUser) {
      toast.error('请先登录');
      router.push('/auth/login');
      return;
    }

    if (selectedIndex !== null || isDrawing) return;

    setIsDrawing(true);
    setSelectedIndex(index);

    // 翻牌动画
    const newFlipped = [false, false, false];
    newFlipped[index] = true;
    setFlippedCards(newFlipped);

    // 延迟显示结果
    setTimeout(async () => {
      const play = dailyFeatured?.plays[index];
      if (!play) return;

      setSelectedPlay(play);

      // 调用 API 进行交换
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const res = await fetch('/api/play-exchange/draw', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session?.access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            card_index: index,
            play_id: play.id
          })
        });

        const data = await res.json();
        if (data.success) {
          toast.success(data.data.message);
          setShowResult(true);
          // 刷新用户信息
          await loadUserInfo(session!.access_token);
        } else {
          toast.error(data.error);
          setIsDrawing(false);
          setSelectedIndex(null);
          setFlippedCards([false, false, false]);
        }
      } catch (error) {
        console.error('翻牌失败:', error);
        toast.error('翻牌失败，请稍后重试');
        setIsDrawing(false);
        setSelectedIndex(null);
        setFlippedCards([false, false, false]);
      }
    }, 800);
  }

  // 重置翻牌
  function handleReset() {
    setIsDrawing(false);
    setFlippedCards([false, false, false]);
    setSelectedIndex(null);
    setShowResult(false);
    setSelectedPlay(null);
    loadDailyFeatured();
  }

  // 提交玩法
  async function handleSubmitPlay() {
    if (!authUser) {
      toast.error('请先登录');
      router.push('/auth/login');
      return;
    }

    if (!submissionForm.title || !submissionForm.category || !submissionForm.content) {
      toast.error('请填写完整信息');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/api/play-exchange/submit', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submissionForm)
      });

      const data = await res.json();
      if (data.success) {
        toast.success(data.data.message);
        setSubmissionForm({ title: '', category: allCategories[0]?.slug || '', content: '' });
        await loadSubmissions(session!.access_token);
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      console.error('提交失败:', error);
      toast.error('提交失败，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  }

  // 复制邀请链接
  function handleCopyLink() {
    if (referralInfo?.referral_link) {
      navigator.clipboard.writeText(referralInfo.referral_link);
      setLinkCopied(true);
      toast.success('邀请链接已复制');
      setTimeout(() => setLinkCopied(false), 2000);
    }
  }

  // 当分类加载完成后，设置默认分类
  useEffect(() => {
    if (allCategories.length > 0 && !submissionForm.category) {
      setSubmissionForm(prev => ({
        ...prev,
        category: allCategories[0].slug
      }));
    }
  }, [allCategories]);

  if (authLoading || pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <Loader2 className="w-12 h-12 animate-spin text-purple-600 dark:text-purple-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* 页面头部 - 与主网站统一风格 */}
      <div className="relative overflow-hidden border-b bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 dark:from-indigo-500/10 dark:via-purple-500/10 dark:to-pink-500/10">
        {/* 动态背景层 */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-600/20 via-transparent to-transparent animate-pulse" />
        <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800 [mask-image:linear-gradient(0deg,transparent,black,transparent)] pointer-events-none" />

        {/* 多层光效 */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-blue-500/30 via-purple-500/30 to-transparent rounded-full blur-3xl animate-[spin_20s_linear_infinite]" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-pink-500/30 via-purple-500/30 to-transparent rounded-full blur-3xl animate-[spin_15s_linear_infinite_reverse]" />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            {/* 标签徽章 */}
            <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-purple-200/50 dark:border-white/20 shadow-lg">
              <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-semibold text-slate-700 dark:text-white">每日一次免费翻牌</span>
            </div>

            {/* 标题 */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 text-slate-900 dark:text-white">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                今日玩法
              </span>
            </h1>
            <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              每日精选 Web3 策略，免费翻牌获取独家玩法
            </p>

            {/* 用户积分显示 */}
            {authUser && userInfo && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-8 inline-flex items-center gap-6 px-8 py-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-purple-200/50 dark:border-slate-700/50 rounded-2xl shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  <span className="text-slate-700 dark:text-slate-300 font-medium">积分余额:</span>
                  <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">{userInfo.credits}</span>
                </div>
                <div className="w-px h-6 bg-slate-300 dark:bg-slate-700" />
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <span className="text-slate-700 dark:text-slate-300 font-medium">已获得:</span>
                  <span className="text-lg font-semibold text-purple-600 dark:text-purple-400">{userInfo.total_plays}</span>
                  <span className="text-slate-500 dark:text-slate-400 text-sm">个玩法</span>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-7xl">
        {!authUser && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto mb-12 p-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-center shadow-lg"
          >
            <p className="text-slate-700 dark:text-slate-300 mb-6 text-lg">请先登录以使用今日玩法功能</p>
            <button
              onClick={() => router.push('/auth/login')}
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
            >
              立即登录
            </button>
          </motion.div>
        )}

        {/* 今日精选区域 */}
        {authUser && dailyFeatured && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-8 shadow-xl">
              {/* 标题 */}
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-3 text-slate-900 dark:text-white">
                  今天玩什么？
                </h2>
                <p className="text-base text-slate-600 dark:text-slate-400">
                  {userInfo?.first_draw_used
                    ? '每次翻牌消耗 1 积分 · 已拥有的玩法将自动显示'
                    : '首次翻牌免费 · 选择一张卡片获取独家策略'
                  }
                </p>
              </div>

              {/* 魔法卡 */}
              <div className="flex justify-center gap-8 mb-8">
                {dailyFeatured.plays.map((play, index) => {
                  // 检查是否已经拥有这个玩法
                  const alreadyOwned = userInfo?.my_plays?.includes(play.id);
                  // 如果已经拥有，则禁用
                  const isDisabled = alreadyOwned || isDrawing || showResult;

                  return (
                    <MagicCard
                      key={index}
                      index={index}
                      play={play}
                      isFlipped={!!(flippedCards[index] || alreadyOwned)}
                      isSelected={!!(selectedIndex === index || alreadyOwned)}
                      onClick={() => !alreadyOwned && handleFlipCard(index)}
                      disabled={isDisabled}
                    />
                  );
                })}
              </div>

              {/* 翻牌结果 */}
              <AnimatePresence>
                {showResult && selectedPlay && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-center"
                  >
                    <div className="inline-block px-8 py-6 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-2 border-emerald-500/50 rounded-2xl backdrop-blur-sm mb-6">
                      <p className="text-xl font-bold mb-2 text-white flex items-center justify-center gap-2">
                        <Award className="w-6 h-6 text-yellow-400" />
                        恭喜!你获得了:
                      </p>
                      <p className="text-2xl font-bold text-emerald-400 mb-1">
                        {selectedPlay.title}
                      </p>
                      <p className="text-sm text-slate-400">
                        {selectedPlay.category}
                      </p>
                    </div>

                    <div className="flex gap-4 justify-center">
                      <button
                        onClick={handleReset}
                        className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors"
                      >
                        重新翻牌
                      </button>
                      <button
                        onClick={() => router.push(`/strategies/${selectedPlay.slug}`)}
                        className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors flex items-center gap-2"
                      >
                        查看详情
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.section>
        )}


        {/* 我已获得的玩法 */}
        {authUser && userInfo && userInfo.my_plays && userInfo.my_plays.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-12"
          >
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  我已获得的玩法
                  <span className="ml-2 text-lg text-slate-500 dark:text-slate-400">({userInfo.my_plays.length})</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userInfo.my_plays.map((playId: string) => {
                  const play = dailyFeatured?.plays.find(p => p.id === playId);
                  if (!play) return null;

                  return (
                    <button
                      key={playId}
                      onClick={() => router.push(`/strategies/${play.slug}`)}
                      className="p-6 bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-700/50 rounded-xl hover:border-purple-400 dark:hover:border-purple-500/50 hover:shadow-lg transition-all group text-left"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-2xl shrink-0">
                          {play.category === '空投' && '🎁'}
                          {play.category === 'DeFi' && '💰'}
                          {play.category === '套利' && '⚡'}
                          {!['空投', 'DeFi', '套利'].includes(play.category) && '📊'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-1 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                            {play.title}
                          </h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {play.category}
                          </p>
                          {play.apy_min && play.apy_max && (
                            <p className="text-sm text-green-600 dark:text-green-400 mt-2 font-medium">
                              收益: {play.apy_min}-{play.apy_max}%
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.section>
        )}

        {/* 温馨提示 */}
        {authUser && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-500/10 dark:to-orange-500/10 border border-amber-300 dark:border-amber-500/30 rounded-2xl shadow-lg"
          >
            <h4 className="font-bold mb-4 text-amber-700 dark:text-amber-400 flex items-center gap-2 text-lg">
              <Sparkles className="w-5 h-5" />
              温馨提示
            </h4>
            <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-amber-600 dark:text-amber-400 mt-0.5 font-bold">•</span>
                <span>首次翻牌免费，之后每次翻牌消耗 1 积分</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 dark:text-amber-400 mt-0.5 font-bold">•</span>
                <span>提交优质玩法可获得 1-100 积分，前往"提交玩法"页面投稿</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 dark:text-amber-400 mt-0.5 font-bold">•</span>
                <span>邀请好友注册可获得积分，前往"邀请好友"页面获取专属链接</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 dark:text-amber-400 mt-0.5 font-bold">•</span>
                <span>所有获得的玩法都会保存在"我的玩法"中，可随时查看</span>
              </li>
            </ul>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Magic Card Component
interface MagicCardProps {
  index: number;
  play: Play;
  isFlipped: boolean;
  isSelected: boolean;
  onClick: () => void;
  disabled: boolean;
}

function MagicCard({
  index,
  play,
  isFlipped,
  isSelected,
  onClick,
  disabled,
}: MagicCardProps) {
  const router = useRouter();

  // Category slug to Chinese name mapping
  const getCategoryName = (slug: string): string => {
    const categoryMap: Record<string, string> = {
      'points-season': '积分空投',
      'testnet': '测试网',
      'amm': 'AMM 做市',
      'defi-lending': 'DeFi 借贷',
      'staking': '质押挖矿',
      'arbitrage': '套利',
      'node-running': '节点运营',
      'nft-finance': 'NFT 金融',
      'gamefi': 'GameFi',
      'socialfi': 'SocialFi',
    };
    return categoryMap[slug] || slug;
  };

  const getCategoryIcon = (category: string) => {
    if (category.includes('空投') || category.includes('points')) return '🎁';
    if (category.includes('测试') || category.includes('testnet')) return '🧪';
    if (category.includes('AMM') || category.includes('amm')) return '💱';
    if (category.includes('DeFi') || category.includes('借贷')) return '💰';
    if (category.includes('套利')) return '⚡';
    if (category.includes('质押') || category.includes('staking')) return '🔒';
    if (category.includes('挖矿')) return '⛏️';
    if (category.includes('节点')) return '🖥️';
    if (category.includes('NFT')) return '🖼️';
    if (category.includes('Game')) return '🎮';
    return '📊';
  };

  // Handle card click - navigate if flipped, otherwise flip
  const handleClick = () => {
    if (disabled) return;
    if (isFlipped) {
      // Navigate to strategy detail page
      router.push(`/strategies/${play.slug}`);
    } else {
      // Flip the card
      onClick();
    }
  };

  return (
    <motion.div
      className="relative"
      style={{ perspective: '1200px' }}
      whileHover={!disabled && !isFlipped ? { scale: 1.02 } : isFlipped ? { scale: 1.02 } : {}}
      onClick={handleClick}
    >
      <motion.div
        className="relative w-64 h-96 cursor-pointer"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{
          duration: 0.8,
          ease: [0.23, 1, 0.32, 1] // Apple's easing
        }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Card Back - Apple Style */}
        <div
          className="absolute w-full h-full rounded-3xl"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(0deg)',
          }}
        >
          <div className={`
            w-full h-full rounded-3xl relative overflow-hidden
            bg-gradient-to-br from-slate-100 to-slate-200
            dark:from-slate-800 dark:to-slate-900
            border border-slate-200 dark:border-slate-700
            ${disabled ? 'opacity-50' : ''}
          `}
          style={{
            boxShadow: disabled
              ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}
          >
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />

            {/* Content */}
            <div className="relative h-full flex flex-col items-center justify-center p-8">
              {/* Icon */}
              <motion.div
                className="mb-6"
                animate={!disabled && !isFlipped ? {
                  scale: [1, 1.05, 1],
                } : {}}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
                  <span className="text-4xl">✨</span>
                </div>
              </motion.div>

              {/* Text */}
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2 tracking-tight">
                神秘玩法
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                点击翻牌查看
              </p>
            </div>

            {/* Hover effect */}
            {!disabled && !isFlipped && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-indigo-500/0 rounded-3xl"
                whileHover={{
                  background: [
                    'linear-gradient(to bottom right, rgba(139, 92, 246, 0), rgba(99, 102, 241, 0))',
                    'linear-gradient(to bottom right, rgba(139, 92, 246, 0.05), rgba(99, 102, 241, 0.05))'
                  ]
                }}
                transition={{ duration: 0.3 }}
              />
            )}
          </div>
        </div>

        {/* Card Front - Apple Style */}
        <div
          className="absolute w-full h-full rounded-3xl"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div className="
            w-full h-full rounded-3xl relative overflow-hidden
            bg-white dark:bg-slate-800
            border border-slate-200 dark:border-slate-700
          "
          style={{
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}
          >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-indigo-50/50 dark:from-purple-900/10 dark:to-indigo-900/10" />

            {/* Content */}
            <div className="relative h-full flex flex-col p-6">
              {/* Top Section */}
              <div className="flex items-start justify-between mb-4">
                {/* Category Badge */}
                <div className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700/50 backdrop-blur-xl rounded-full">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {getCategoryName(play.category)}
                  </span>
                </div>

                {/* Risk Level */}
                <div className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700/50 backdrop-blur-xl rounded-full">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    风险 {play.risk_level}/5
                  </span>
                </div>
              </div>

              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
                  <span className="text-3xl">
                    {getCategoryIcon(play.category)}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 text-center line-clamp-2 leading-tight tracking-tight">
                {play.title}
              </h3>

              {/* Summary */}
              <p className="text-xs text-slate-600 dark:text-slate-400 text-center line-clamp-4 mb-4 leading-relaxed">
                {play.summary}
              </p>

              {/* APY Badge */}
              {play.apy_min > 0 && play.apy_max > 0 && (
                <div className="flex justify-center mb-4">
                  <div className="px-4 py-2 bg-green-50 dark:bg-green-900/20 rounded-full border border-green-200 dark:border-green-800">
                    <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                      收益 {play.apy_min}-{play.apy_max}%
                    </span>
                  </div>
                </div>
              )}

              {/* Action Badge */}
              <div className="mt-auto flex justify-center">
                {isSelected ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <div className="px-4 py-2 bg-purple-600 rounded-full shadow-lg flex items-center gap-2">
                      <Check className="w-4 h-4 text-white" />
                      <span className="text-sm font-semibold text-white">已选择</span>
                    </div>
                  </motion.div>
                ) : isFlipped ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-full shadow-lg flex items-center gap-2 hover:bg-purple-600 hover:text-white transition-all group">
                      <ArrowUpRight className="w-4 h-4 text-slate-600 dark:text-slate-300 group-hover:text-white" />
                      <span className="text-sm font-semibold text-slate-600 dark:text-slate-300 group-hover:text-white">查看详情</span>
                    </div>
                  </motion.div>
                ) : null}
              </div>

              {/* Not Selected Overlay */}
              {!isSelected && isFlipped && (
                <div className="absolute inset-0 bg-slate-900/10 dark:bg-slate-900/40 backdrop-blur-sm flex items-center justify-center rounded-3xl">
                  <span className="text-xl font-bold text-white/70">
                    未选择
                  </span>
                </div>
              )}
            </div>

            {/* Particles Effect for Selected Card */}
            {isSelected && isFlipped && <ParticleEffect />}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Particle Effect Component
function ParticleEffect() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-yellow-400 rounded-full"
          initial={{
            x: '50%',
            y: '50%',
            scale: 0,
            opacity: 1,
          }}
          animate={{
            x: `${Math.random() * 100}%`,
            y: `${Math.random() * 100}%`,
            scale: [0, 1, 0],
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: 1,
            delay: i * 0.05,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}
