/**
 * 排行榜系统 - Supabase API
 * 直接从 Supabase 数据库获取排行榜数据
 */

import { createServerSupabaseClient } from './supabase';
import { Strategy } from './directus';

// 排行榜类型
export type LeaderboardType =
  | 'trending'      // 热度榜
  | 'top_apy'       // 收益榜
  | 'beginner'      // 新人友好榜
  | 'quick'         // 快速上手榜
  | 'community'     // 社区推荐榜
  | 'editor';       // 编辑精选榜

// 排行榜条目 (带排名信息)
export interface RankedStrategy {
  rank: number;
  strategy: Strategy;
  metrics: {
    hotnessScore?: number;
    viewCount: number;
    bookmarkCount: number;
    commentCount?: number;
    shareCount?: number;
    trend?: 'up' | 'down' | 'stable';
  };
}

// 1. 获取热度榜
export async function getTrendingStrategies(options?: {
  window?: '7d' | '30d' | 'all';
  limit?: number;
}): Promise<RankedStrategy[]> {
  try {
    const { window = '7d', limit = 20 } = options || {};
    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase
      .from('strategies')
      .select(`
        id, title, slug, summary, category, category_l1, category_l2,
        risk_level, apy_min, apy_max, threshold_capital_min,
        time_commitment_minutes, hotness_score, view_count,
        bookmark_count, share_count, comment_count, published_at
      `)
      .eq('status', 'published')
      .order('hotness_score', { ascending: false })
      .order('view_count', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return (data || []).map((strategy, index) => ({
      rank: index + 1,
      strategy: strategy as unknown as Strategy,
      metrics: {
        hotnessScore: strategy.hotness_score || 0,
        viewCount: strategy.view_count || 0,
        bookmarkCount: strategy.bookmark_count || 0,
        commentCount: strategy.comment_count || 0,
        shareCount: strategy.share_count || 0,
        trend: 'stable' as const,
      },
    }));
  } catch (error) {
    console.error('Error fetching trending strategies:', error);
    return [];
  }
}

// 2. 获取收益榜
export async function getTopAPYStrategies(options?: {
  riskLevel?: 'low' | 'medium' | 'high' | 'all';
  limit?: number;
}): Promise<RankedStrategy[]> {
  try {
    const { riskLevel = 'all', limit = 10 } = options || {};
    const supabase = createServerSupabaseClient();

    let query = supabase
      .from('strategies')
      .select(`
        id, title, slug, summary, category, category_l1, category_l2,
        risk_level, apy_min, apy_max, apy_type, threshold_capital_min,
        hotness_score, view_count, bookmark_count, published_at
      `)
      .eq('status', 'published');

    // 根据风险等级筛选
    if (riskLevel === 'low') {
      query = query.in('risk_level', [1, 2]);
    } else if (riskLevel === 'medium') {
      query = query.eq('risk_level', 3);
    } else if (riskLevel === 'high') {
      query = query.in('risk_level', [4, 5]);
    }

    const { data, error } = await query
      .order('apy_max', { ascending: false })
      .order('hotness_score', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return (data || []).map((strategy, index) => ({
      rank: index + 1,
      strategy: strategy as unknown as Strategy,
      metrics: {
        hotnessScore: strategy.hotness_score || 0,
        viewCount: strategy.view_count || 0,
        bookmarkCount: strategy.bookmark_count || 0,
        trend: 'stable' as const,
      },
    }));
  } catch (error) {
    console.error('Error fetching top APY strategies:', error);
    return [];
  }
}

// 3. 获取新人友好榜
export async function getBeginnerFriendlyStrategies(options?: {
  limit?: number;
}): Promise<RankedStrategy[]> {
  try {
    const { limit = 15 } = options || {};
    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase
      .from('strategies')
      .select(`
        id, title, slug, summary, category, category_l1, category_l2,
        risk_level, threshold_capital_min, threshold_tech_level,
        time_commitment_minutes, hotness_score, view_count,
        bookmark_count, published_at
      `)
      .eq('status', 'published')
      .lte('risk_level', 3)
      .lte('threshold_capital_min', 1000)
      .order('bookmark_count', { ascending: false })
      .order('hotness_score', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return (data || []).map((strategy, index) => ({
      rank: index + 1,
      strategy: strategy as unknown as Strategy,
      metrics: {
        hotnessScore: strategy.hotness_score || 0,
        viewCount: strategy.view_count || 0,
        bookmarkCount: strategy.bookmark_count || 0,
        trend: 'stable' as const,
      },
    }));
  } catch (error) {
    console.error('Error fetching beginner friendly strategies:', error);
    return [];
  }
}

// 4. 获取快速上手榜
export async function getQuickStartStrategies(options?: {
  limit?: number;
}): Promise<RankedStrategy[]> {
  try {
    const { limit = 12 } = options || {};
    const supabase = createServerSupabaseClient();

    const { data, error} = await supabase
      .from('strategies')
      .select(`
        id, title, slug, summary, category, category_l1, category_l2,
        time_commitment, time_commitment_minutes, hotness_score,
        view_count, bookmark_count, published_at
      `)
      .eq('status', 'published')
      .lte('time_commitment_minutes', 60)
      .order('time_commitment_minutes', { ascending: true })
      .order('hotness_score', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return (data || []).map((strategy, index) => ({
      rank: index + 1,
      strategy: strategy as unknown as Strategy,
      metrics: {
        hotnessScore: strategy.hotness_score || 0,
        viewCount: strategy.view_count || 0,
        bookmarkCount: strategy.bookmark_count || 0,
        trend: 'stable' as const,
      },
    }));
  } catch (error) {
    console.error('Error fetching quick start strategies:', error);
    return [];
  }
}

// 5. 获取社区推荐榜
export async function getCommunityFavorites(options?: {
  window?: '30d' | 'all';
  limit?: number;
}): Promise<RankedStrategy[]> {
  try {
    const { window = '30d', limit = 20 } = options || {};
    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase
      .from('strategies')
      .select(`
        id, title, slug, summary, category, category_l1, category_l2,
        risk_level, apy_min, apy_max, hotness_score,
        view_count, bookmark_count, published_at
      `)
      .eq('status', 'published')
      .gte('bookmark_count', 1)
      .order('bookmark_count', { ascending: false })
      .order('hotness_score', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return (data || []).map((strategy, index) => ({
      rank: index + 1,
      strategy: strategy as unknown as Strategy,
      metrics: {
        hotnessScore: strategy.hotness_score || 0,
        viewCount: strategy.view_count || 0,
        bookmarkCount: strategy.bookmark_count || 0,
        trend: 'stable' as const,
      },
    }));
  } catch (error) {
    console.error('Error fetching community favorites:', error);
    return [];
  }
}

// 6. 获取编辑精选榜
export async function getEditorChoiceStrategies(options?: {
  limit?: number;
}): Promise<RankedStrategy[]> {
  try {
    const { limit = 15 } = options || {};
    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase
      .from('strategies')
      .select(`
        id, title, slug, summary, category, category_l1, category_l2,
        risk_level, apy_min, apy_max, featured_order, hotness_score,
        view_count, bookmark_count, published_at
      `)
      .eq('status', 'published')
      .eq('is_featured', true)
      .order('featured_order', { ascending: true })
      .order('hotness_score', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return (data || []).map((strategy, index) => ({
      rank: index + 1,
      strategy: strategy as unknown as Strategy,
      metrics: {
        hotnessScore: strategy.hotness_score || 0,
        viewCount: strategy.view_count || 0,
        bookmarkCount: strategy.bookmark_count || 0,
        trend: 'stable' as const,
      },
    }));
  } catch (error) {
    console.error('Error fetching editor choice strategies:', error);
    return [];
  }
}

// 7. 通用排行榜获取函数
export async function getLeaderboard(
  type: LeaderboardType,
  options?: {
    window?: '7d' | '30d' | 'all';
    riskLevel?: 'low' | 'medium' | 'high' | 'all';
    limit?: number;
  }
): Promise<RankedStrategy[]> {
  switch (type) {
    case 'trending':
      return getTrendingStrategies({ window: options?.window, limit: options?.limit });
    case 'top_apy':
      return getTopAPYStrategies({ riskLevel: options?.riskLevel, limit: options?.limit });
    case 'beginner':
      return getBeginnerFriendlyStrategies({ limit: options?.limit });
    case 'quick':
      return getQuickStartStrategies({ limit: options?.limit });
    case 'community':
      return getCommunityFavorites({ window: options?.window as '30d' | 'all', limit: options?.limit });
    case 'editor':
      return getEditorChoiceStrategies({ limit: options?.limit });
    default:
      return [];
  }
}
