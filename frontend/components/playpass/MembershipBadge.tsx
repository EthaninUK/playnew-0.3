'use client';

import { Award, Zap, TrendingUp, Crown } from 'lucide-react';

interface MembershipBadgeProps {
  level: number;
  isMaxMember?: boolean;
  showDetails?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const MEMBERSHIP_DATA = {
  0: {
    name: 'Free',
    icon: Award,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-300',
    gradient: 'from-gray-400 to-gray-600',
    multiplier: '1.0x',
    dailyLimit: '1000 PP/天',
    discount: '无折扣',
    features: ['基础功能访问', '每日签到', '分享内容'],
  },
  1: {
    name: 'Pro',
    icon: Award,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-300',
    gradient: 'from-blue-400 to-blue-600',
    multiplier: '1.2x',
    dailyLimit: '1500 PP/天',
    discount: '10% OFF',
    features: ['Free 全部功能', '赚取倍率 +20%', '内容折扣 10%', '优先客服'],
  },
  2: {
    name: 'Premium',
    icon: Award,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    borderColor: 'border-purple-300',
    gradient: 'from-purple-400 to-purple-600',
    multiplier: '1.5x',
    dailyLimit: '2500 PP/天',
    discount: '30% OFF',
    features: ['Pro 全部功能', '赚取倍率 +50%', '内容折扣 30%', '专属内容'],
  },
  3: {
    name: 'Partner',
    icon: Crown,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    borderColor: 'border-orange-300',
    gradient: 'from-orange-400 to-orange-600',
    multiplier: '2.0x',
    dailyLimit: '5000 PP/天',
    discount: '50% OFF',
    features: [
      'Premium 全部功能',
      '赚取倍率 +100%',
      '内容折扣 50%',
      '合作伙伴徽章',
    ],
  },
  4: {
    name: 'MAX',
    icon: Zap,
    color: 'text-yellow-600',
    bgColor: 'bg-gradient-to-r from-yellow-100 to-orange-100',
    borderColor: 'border-yellow-400',
    gradient: 'from-yellow-400 to-orange-500',
    multiplier: '∞',
    dailyLimit: '无限制',
    discount: '100% FREE',
    features: [
      '无限 PlayPass',
      '全站内容免费',
      'Telegram 专属频道',
      '优先新功能体验',
      '定制化服务',
    ],
  },
};

export default function MembershipBadge({
  level,
  isMaxMember = false,
  showDetails = false,
  size = 'md',
}: MembershipBadgeProps) {
  const memberLevel = isMaxMember ? 4 : level;
  const data = MEMBERSHIP_DATA[memberLevel as keyof typeof MEMBERSHIP_DATA];
  const Icon = data.icon;

  // 尺寸配置
  const sizeConfig = {
    sm: {
      container: 'px-2 py-1',
      icon: 'w-3 h-3',
      text: 'text-xs',
    },
    md: {
      container: 'px-3 py-2',
      icon: 'w-4 h-4',
      text: 'text-sm',
    },
    lg: {
      container: 'px-4 py-3',
      icon: 'w-5 h-5',
      text: 'text-base',
    },
  };

  const config = sizeConfig[size];

  // 简单徽章模式
  if (!showDetails) {
    return (
      <div
        className={`inline-flex items-center gap-2 ${config.container} rounded-full ${
          isMaxMember
            ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white'
            : `${data.bgColor} ${data.color}`
        } font-semibold ${config.text} border ${data.borderColor}`}
      >
        <Icon className={config.icon} />
        {data.name}
      </div>
    );
  }

  // 详细卡片模式
  return (
    <div
      className={`bg-white rounded-xl shadow-lg border-2 ${data.borderColor} overflow-hidden`}
    >
      {/* 头部 */}
      <div
        className={`${
          isMaxMember
            ? 'bg-gradient-to-r from-yellow-100 to-orange-100'
            : data.bgColor
        } px-6 py-6`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`${
                isMaxMember
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-400'
                  : data.bgColor
              } p-4 rounded-xl ${isMaxMember ? '' : `border-2 ${data.borderColor}`}`}
            >
              <Icon
                className={`w-8 h-8 ${isMaxMember ? 'text-white' : data.color}`}
              />
            </div>
            <div>
              <h3
                className={`text-2xl font-bold ${
                  isMaxMember ? 'text-transparent bg-clip-text bg-gradient-to-r ' + data.gradient : data.color
                }`}
              >
                {data.name}
              </h3>
              <p className="text-sm text-gray-600 mt-1">会员等级</p>
            </div>
          </div>

          {/* 等级数字 */}
          <div className="text-right">
            <div
              className={`text-4xl font-bold ${
                isMaxMember ? 'text-transparent bg-clip-text bg-gradient-to-r ' + data.gradient : data.color
              }`}
            >
              {isMaxMember ? '👑' : `L${level}`}
            </div>
          </div>
        </div>
      </div>

      {/* 权益信息 */}
      <div className="px-6 py-6 space-y-6">
        {/* 核心数据 */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className={`${data.color} font-bold text-lg`}>
              {data.multiplier}
            </div>
            <div className="text-xs text-gray-600 mt-1">赚取倍率</div>
          </div>

          <div className="text-center">
            <div className={`${data.color} font-bold text-lg`}>
              {data.discount}
            </div>
            <div className="text-xs text-gray-600 mt-1">内容折扣</div>
          </div>

          <div className="text-center">
            <div className={`${data.color} font-bold text-xs`}>
              {data.dailyLimit}
            </div>
            <div className="text-xs text-gray-600 mt-1">每日上限</div>
          </div>
        </div>

        {/* 特权列表 */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            会员特权
          </h4>
          <div className="space-y-2">
            {data.features.map((feature, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className={`mt-1 w-1.5 h-1.5 rounded-full ${isMaxMember ? 'bg-gradient-to-r ' + data.gradient : data.bgColor}`}></div>
                <span className="text-sm text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* MAX 会员特殊提示 */}
        {isMaxMember && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-300 rounded-lg px-4 py-3">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-600" />
              <p className="text-sm font-medium text-yellow-800">
                终身会员，尊享至高特权
              </p>
            </div>
          </div>
        )}

        {/* 升级提示 */}
        {!isMaxMember && level < 4 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <p className="text-sm font-medium text-blue-800">升级到下一等级</p>
            </div>
            <p className="text-xs text-blue-600">
              联系客服 Telegram 升级到 {MEMBERSHIP_DATA[((level + 1) as keyof typeof MEMBERSHIP_DATA)].name}，享受更多特权
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
