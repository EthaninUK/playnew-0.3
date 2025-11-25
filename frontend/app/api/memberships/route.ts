import { NextResponse } from 'next/server';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';

// 固定的会员方案配置（与前端保持一致）
const MEMBERSHIP_PLANS = [
  {
    id: 'free',
    name: 'Free',
    level: 0,
    price_monthly_usd: 0,
    price_yearly_usd: 0,
    content_access_level: 20,
    is_active: true,
    sort_order: 1,
    description: '适合新手探索加密玩法',
    features: {
      strategies: '访问 20% 基础玩法策略',
      news: '每日 5 条快讯',
      favorites: '最多收藏 5 个内容',
      search: '基础搜索功能',
      support: '社区支持'
    }
  },
  {
    id: 'pro',
    name: 'Pro',
    level: 1,
    price_monthly_usd: 0, // 不提供月付
    price_yearly_usd: 699,
    content_access_level: 60,
    is_active: true,
    sort_order: 2,
    description: '适合进阶用户深入学习',
    features: {
      strategies: '访问 60% 中级玩法策略',
      news: '无限快讯访问',
      favorites: '无限收藏',
      search: '高级搜索与筛选',
      export: '数据导出功能',
      ai: 'AI 辅助分析（Beta）',
      support: '优先客服支持'
    }
  },
  {
    id: 'max',
    name: 'Max',
    level: 2,
    price_monthly_usd: 0, // 不提供月付
    price_yearly_usd: 1299,
    content_access_level: 100,
    is_active: true,
    sort_order: 3,
    description: '适合专业投资者全面布局',
    features: {
      strategies: '访问 100% 全部玩法策略',
      news: '无限快讯访问',
      favorites: '无限收藏',
      search: '高级搜索与筛选',
      export: '数据导出功能',
      ai: 'AI 智能助手（完整版）',
      reports: '独家深度研报',
      discord: '专属 Discord 社群',
      consulting: '1对1 策略咨询（每月1次）'
    }
  }
];

export async function GET() {
  try {
    // 直接返回固定的会员方案配置
    return NextResponse.json({
      memberships: MEMBERSHIP_PLANS,
    });
  } catch (error) {
    console.error('Error fetching memberships:', error);
    return NextResponse.json(
      { error: 'Failed to fetch memberships' },
      { status: 500 }
    );
  }
}
