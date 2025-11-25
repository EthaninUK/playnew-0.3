'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import {
  PPBalance,
  DailySignin,
  PPTransactions,
} from '@/components/playpass';
// import TaskCenter from './components/TaskCenter'; // 暂时隐藏任务中心
import SubmitPlaySection from './components/SubmitPlaySection';
import InviteFriendSection from './components/InviteFriendSection';
import SettingsSection from './components/SettingsSection';
import MembershipStatus from './components/MembershipStatus';
import { ProfileContent } from '@/app/profile/ProfileContent';
import { FavoritesContent } from '@/app/favorites/FavoritesContent';
import PlatformStats from '@/components/stats/PlatformStats';
import {
  Award,
  // Target, // 暂时隐藏任务中心
  Send,
  Users,
  History,
  Loader2,
  ChevronRight,
  User as UserIcon,
  Heart,
  Settings
} from 'lucide-react';

/**
 * 会员中心主页面 - 左侧边栏布局
 *
 * 功能：
 * 1. PlayPass 积分管理
 * 2. 每日签到
 * 3. 任务中心
 * 4. 提交玩法
 * 5. 邀请好友
 * 6. 交易记录
 */
export default function MemberCenterClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user: authUser, loading: authLoading } = useAuth();
  const [userId, setUserId] = useState<string | null>(null);
  const [membershipLevel, setMembershipLevel] = useState(0);

  // 从 URL 参数获取初始标签页，默认为 'overview'
  const initialTab = (searchParams.get('tab') as 'overview' | 'submit' | 'invite' | 'history' | 'profile' | 'favorites' | 'settings') || 'overview';
  const [activeTab, setActiveTab] = useState<'overview' | 'submit' | 'invite' | 'history' | 'profile' | 'favorites' | 'settings'>(initialTab);
  const [profile, setProfile] = useState<any>(null);
  const [favoriteStats, setFavoriteStats] = useState({
    strategies: 0,
    providers: 0,
    news: 0,
    total: 0
  });

  // 监听 URL 参数变化，更新活动标签页
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab as typeof activeTab);
      // 滚动到页面顶部
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [searchParams]);

  // 检查用户登录状态
  useEffect(() => {
    if (!authLoading) {
      if (!authUser) {
        // 未登录，跳转到登录页
        router.push('/auth/login?redirect=/member-center');
      } else {
        // 已登录，设置用户信息
        setUserId(authUser.id);
        // TODO: 从用户元数据获取会员等级
        setMembershipLevel(1); // 暂时默认为 Pro 会员

        // 加载用户资料和收藏统计
        loadUserData(authUser.id);
      }
    }
  }, [authUser, authLoading, router]);

  // 加载用户数据
  const loadUserData = async (uid: string) => {
    try {
      // 加载用户资料
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();

      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', uid)
        .single();

      if (!profileError && profileData) {
        setProfile(profileData);
      } else {
        // 如果没有资料，创建一个空的资料对象
        setProfile({
          id: uid,
          username: '',
          bio: '',
          avatar_url: '',
          twitter_handle: '',
          telegram_handle: '',
          website: ''
        });
      }

      // 加载收藏统计
      console.log('📊 正在加载收藏统计，用户ID:', uid);
      const { data: favorites, error: favError } = await supabase
        .from('user_favorites')
        .select('item_type')
        .eq('user_id', uid);

      console.log('📊 收藏查询结果:', {
        count: favorites?.length || 0,
        error: favError?.message,
        data: favorites
      });

      if (favorites) {
        const stats = {
          strategies: favorites.filter(f => f.item_type === 'strategy').length,
          providers: favorites.filter(f => f.item_type === 'provider').length,
          news: favorites.filter(f => f.item_type === 'news').length,
          total: favorites.length
        };
        console.log('📊 收藏统计:', stats);
        setFavoriteStats(stats);
      } else {
        console.log('⚠️ 没有收藏数据');
      }
    } catch (error) {
      console.error('加载用户数据失败:', error);
      // 即使出错也设置一个空的资料对象
      setProfile({
        id: uid,
        username: '',
        bio: '',
        avatar_url: '',
        twitter_handle: '',
        telegram_handle: '',
        website: ''
      });
    }
  };

  // 加载中状态
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">加载中...</p>
        </div>
      </div>
    );
  }

  // 未登录状态（会自动跳转）
  if (!authUser || !userId) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">正在跳转到登录页...</p>
        </div>
      </div>
    );
  }

  // 侧边栏菜单项
  const menuItems = [
    {
      id: 'overview',
      label: '总览',
      icon: Award,
      description: 'PlayPass 积分管理'
    },
    // 暂时隐藏任务中心
    // {
    //   id: 'tasks',
    //   label: '任务中心',
    //   icon: Target,
    //   description: '完成任务赚取积分'
    // },
    {
      id: 'submit',
      label: '提交玩法',
      icon: Send,
      description: '分享你的策略'
    },
    {
      id: 'invite',
      label: '邀请好友',
      icon: Users,
      description: '邀请好友获得奖励'
    },
    {
      id: 'history',
      label: '交易记录',
      icon: History,
      description: '查看积分变动'
    },
    {
      id: 'profile',
      label: '个人中心',
      icon: UserIcon,
      description: '管理个人资料'
    },
    {
      id: 'favorites',
      label: '我的收藏',
      icon: Heart,
      description: '查看收藏内容'
    },
    {
      id: 'settings',
      label: '设置',
      icon: Settings,
      description: '账户设置'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* 左侧边栏 */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden sticky top-24">
              {/* 用户信息卡片 */}
              <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {authUser.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {authUser.user_metadata?.username || authUser.email?.split('@')[0]}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {authUser.email}
                    </p>
                  </div>
                </div>

                {/* PP余额 */}
                <div className="flex items-center justify-end">
                  <PPBalance userId={userId} compact />
                </div>
              </div>

              {/* 会员等级状态 */}
              <MembershipStatus
                userId={userId}
                onLevelChange={(level) => setMembershipLevel(level)}
              />

              {/* 导航菜单 */}
              <nav className="p-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id as any);
                        // 滚动到页面顶部
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                        isActive
                          ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Icon className={`w-5 h-5 transition-colors ${
                        isActive ? 'text-blue-500' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                      }`} />
                      <div className="flex-1 text-left">
                        <p className={`text-sm font-medium ${
                          isActive ? 'text-blue-600 dark:text-blue-400' : ''
                        }`}>
                          {item.label}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                          {item.description}
                        </p>
                      </div>
                      {isActive && (
                        <ChevronRight className="w-4 h-4 text-blue-500" />
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* 右侧内容区域 */}
          <main className="flex-1 min-w-0">
            {/* 总览 Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* 余额和签到 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* PlayPass 余额 */}
                  <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                      我的 PlayPass
                    </h2>
                    <PPBalance
                      userId={userId}
                      showDetails
                      onBalanceUpdate={(balance) => {
                        console.log('余额更新:', balance);
                      }}
                    />
                  </div>

                  {/* 每日签到 */}
                  <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                      每日签到
                    </h2>
                    <DailySignin
                      userId={userId}
                      membershipLevel={membershipLevel}
                      onSigninSuccess={(pp) => {
                        console.log(`签到成功！获得 ${pp} PP`);
                      }}
                    />
                  </div>
                </div>

                {/* 暂时隐藏任务预览 */}
                {/* <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                      今日任务
                    </h2>
                    <button
                      onClick={() => setActiveTab('tasks')}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center gap-1"
                    >
                      查看全部
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <TaskCenter userId={userId} compact />
                </div> */}

                {/* 快速操作 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => setActiveTab('submit')}
                    className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950/20 p-6 transition-all group"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <Send className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                      </div>
                      <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                        提交玩法
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        分享你的策略赚取 PP 奖励
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab('invite')}
                    className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-pink-300 dark:hover:border-pink-700 hover:bg-pink-50 dark:hover:bg-pink-950/20 p-6 transition-all group"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-14 h-14 bg-pink-100 dark:bg-pink-900/30 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <Users className="w-7 h-7 text-pink-600 dark:text-pink-400" />
                      </div>
                      <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                        邀请好友
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        邀请好友注册获得 PP 奖励
                      </p>
                    </div>
                  </button>
                </div>

                {/* 平台统计数据 */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                  <PlatformStats />
                </div>
              </div>
            )}

            {/* 暂时隐藏任务中心 Tab */}
            {/* {activeTab === 'tasks' && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                      任务中心
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      完成任务赚取 PlayPass 积分
                    </p>
                  </div>
                </div>
                <TaskCenter userId={userId} />
              </div>
            )} */}

            {/* 提交玩法 Tab */}
            {activeTab === 'submit' && (
              <SubmitPlaySection userId={userId} />
            )}

            {/* 邀请好友 Tab */}
            {activeTab === 'invite' && (
              <InviteFriendSection userId={userId} />
            )}

            {/* 交易记录 Tab */}
            {activeTab === 'history' && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center">
                    <History className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                      交易记录
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      查看 PlayPass 积分变动记录
                    </p>
                  </div>
                </div>
                <PPTransactions
                  userId={userId}
                  limit={50}
                  showFilters
                />
              </div>
            )}

            {/* 个人中心 Tab */}
            {activeTab === 'profile' && authUser && (
              <ProfileContent
                user={authUser}
                profile={profile}
                stats={favoriteStats}
              />
            )}

            {/* 我的收藏 Tab */}
            {activeTab === 'favorites' && (
              <FavoritesContent />
            )}

            {/* 设置 Tab */}
            {activeTab === 'settings' && authUser && (
              <SettingsSection userId={userId!} userEmail={authUser.email || ''} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
