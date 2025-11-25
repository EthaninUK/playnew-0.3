import { NextRequest, NextResponse } from 'next/server';
import {
  getLeaderboard,
  LeaderboardType,
} from '@/lib/leaderboard';

/**
 * 排行榜 API
 * GET /api/leaderboard?type=trending&window=7d&limit=20
 * GET /api/leaderboard?type=top_apy&risk=low&limit=10
 * GET /api/leaderboard?type=beginner&limit=15
 * GET /api/leaderboard?type=quick&limit=12
 * GET /api/leaderboard?type=community&window=30d&limit=20
 * GET /api/leaderboard?type=editor&limit=15
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // 获取参数
    const type = (searchParams.get('type') || 'trending') as LeaderboardType;
    const window = (searchParams.get('window') || '7d') as '7d' | '30d' | 'all';
    const riskLevel = (searchParams.get('risk') || 'all') as 'low' | 'medium' | 'high' | 'all';
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    // 验证参数
    const validTypes: LeaderboardType[] = ['trending', 'top_apy', 'beginner', 'quick', 'community', 'editor'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        {
          error: 'Invalid leaderboard type',
          validTypes,
        },
        { status: 400 }
      );
    }

    // 获取排行榜数据
    const data = await getLeaderboard(type, {
      window,
      riskLevel,
      limit,
    });

    // 返回响应
    return NextResponse.json({
      type,
      window: type === 'trending' || type === 'community' ? window : undefined,
      riskLevel: type === 'top_apy' ? riskLevel : undefined,
      updatedAt: new Date().toISOString(),
      data,
      total: data.length,
      metadata: {
        calculatedAt: new Date().toISOString(),
        algorithm: 'hotness_v1',
      },
    });
  } catch (error) {
    console.error('Leaderboard API error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch leaderboard',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
