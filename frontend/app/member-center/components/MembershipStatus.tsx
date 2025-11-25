'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Crown, Zap, Star, ChevronRight, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MembershipStatusProps {
  userId: string;
  onLevelChange?: (level: number) => void;
}

// 会员等级信息
const MEMBERSHIP_TIERS = {
  0: {
    name: 'Free',
    displayName: '免费用户',
    icon: Star,
    color: 'text-slate-500',
    bgColor: 'bg-slate-100 dark:bg-slate-800',
    borderColor: 'border-slate-200 dark:border-slate-700',
    gradientFrom: 'from-slate-400',
    gradientTo: 'to-slate-500',
    benefits: [
      '每日签到获得 PP',
      '浏览所有公开策略',
      '基础搜索功能',
    ],
    price: 0,
  },
  1: {
    name: 'Pro',
    displayName: 'Pro 会员',
    icon: Zap,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    borderColor: 'border-blue-200 dark:border-blue-800',
    gradientFrom: 'from-blue-500',
    gradientTo: 'to-cyan-500',
    benefits: [
      '全部 Free 权益',
      '每日签到 2x PP',
      '高级策略详情',
      '提交玩法优先审核',
      '专属客服支持',
    ],
    price: 699,
  },
  2: {
    name: 'Max',
    displayName: 'Max 会员',
    icon: Crown,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50 dark:bg-purple-950/30',
    borderColor: 'border-purple-200 dark:border-purple-800',
    gradientFrom: 'from-purple-500',
    gradientTo: 'to-pink-500',
    benefits: [
      '全部 Pro 权益',
      '每日签到 3x PP',
      '独家策略抢先看',
      'API 访问权限',
      '1对1 专属顾问',
      '线下活动优先名额',
    ],
    price: 1299,
  },
};

export default function MembershipStatus({ userId, onLevelChange }: MembershipStatusProps) {
  const router = useRouter();
  const [membershipLevel, setMembershipLevel] = useState<number>(0);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 加载用户会员信息 (从 Directus user_subscriptions 表)
  useEffect(() => {
    const loadMembershipInfo = async () => {
      try {
        // 从 /api/subscription 获取会员信息
        const response = await fetch('/api/subscription');
        const data = await response.json();

        if (data.subscription && data.subscription.status === 'active') {
          const level = data.subscription.membership?.level || 0;
          setMembershipLevel(level);
          setExpiresAt(data.subscription.end_date);
          if (onLevelChange) {
            onLevelChange(level);
          }
        } else {
          // 没有订阅或已过期
          setMembershipLevel(0);
          setExpiresAt(null);
          if (onLevelChange) {
            onLevelChange(0);
          }
        }
      } catch (error) {
        console.error('Failed to load membership info:', error);
        setMembershipLevel(0);
        if (onLevelChange) {
          onLevelChange(0);
        }
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      loadMembershipInfo();
    }
  }, [userId, onLevelChange]);

  // 计算剩余天数
  const getDaysRemaining = () => {
    if (!expiresAt) return null;
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = expires.getTime() - now.getTime();
    if (diff <= 0) return 0;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  // 获取下一级会员信息
  const getNextTier = () => {
    if (membershipLevel >= 2) return null;
    return MEMBERSHIP_TIERS[(membershipLevel + 1) as 0 | 1 | 2];
  };

  const currentTier = MEMBERSHIP_TIERS[membershipLevel as 0 | 1 | 2] || MEMBERSHIP_TIERS[0];
  const nextTier = getNextTier();
  const daysRemaining = getDaysRemaining();
  const TierIcon = currentTier.icon;

  if (loading) {
    return (
      <div className="p-4 animate-pulse">
        <div className="h-20 bg-slate-200 dark:bg-slate-700 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="border-b border-slate-200 dark:border-slate-800">
      {/* 当前会员状态 */}
      <div className={`p-4 ${currentTier.bgColor}`}>
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${currentTier.gradientFrom} ${currentTier.gradientTo} flex items-center justify-center`}>
            <TierIcon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className={`font-bold text-sm ${currentTier.color}`}>
                {currentTier.displayName}
              </span>
              {membershipLevel > 0 && (
                <Sparkles className={`w-3 h-3 ${currentTier.color}`} />
              )}
            </div>
            {membershipLevel > 0 && daysRemaining !== null && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {daysRemaining > 0
                  ? `还剩 ${daysRemaining} 天`
                  : '已过期'}
              </p>
            )}
          </div>
        </div>

        {/* 当前等级权益 */}
        <div className="space-y-1.5 mb-3">
          {currentTier.benefits.slice(0, 3).map((benefit, index) => (
            <div key={index} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
              <Check className={`w-3 h-3 ${currentTier.color} flex-shrink-0`} />
              <span>{benefit}</span>
            </div>
          ))}
          {currentTier.benefits.length > 3 && (
            <p className="text-xs text-slate-400 dark:text-slate-500 pl-5">
              +{currentTier.benefits.length - 3} 项更多权益
            </p>
          )}
        </div>

        {/* 升级按钮 */}
        {nextTier && (
          <Button
            onClick={() => router.push('/pricing')}
            size="sm"
            className={`w-full bg-gradient-to-r ${nextTier.gradientFrom} ${nextTier.gradientTo} hover:opacity-90 text-white border-0`}
          >
            <span className="flex items-center gap-1.5">
              升级到 {nextTier.name}
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </Button>
        )}

        {/* 已是最高等级 */}
        {!nextTier && membershipLevel > 0 && (
          <div className="text-center py-2">
            <div className="flex items-center justify-center gap-1.5 text-xs text-purple-600 dark:text-purple-400">
              <Crown className="w-3.5 h-3.5" />
              <span className="font-medium">尊享最高等级会员</span>
            </div>
          </div>
        )}
      </div>

      {/* 升级预览 - 显示下一级的新增权益 */}
      {nextTier && (
        <div className="p-3 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800/50">
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">
            升级 {nextTier.name} 解锁:
          </p>
          <div className="space-y-1">
            {nextTier.benefits
              .filter(b => !currentTier.benefits.includes(b) && !b.includes('全部'))
              .slice(0, 2)
              .map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 text-xs">
                  <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${nextTier.gradientFrom} ${nextTier.gradientTo}`} />
                  <span className="text-slate-600 dark:text-slate-300">{benefit}</span>
                </div>
              ))}
          </div>
          <button
            onClick={() => router.push('/pricing')}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-2 flex items-center gap-1"
          >
            查看完整权益对比
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}