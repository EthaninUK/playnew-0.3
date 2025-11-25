import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

/**
 * GET /api/play-exchange/daily-featured
 * 获取今日精选玩法（3个玩法）
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();

    // 1. 获取今天的精选配置
    const today = new Date().toISOString().split('T')[0];

    const { data: featuredConfig, error: configError } = await supabase
      .from('daily_featured_plays')
      .select('*')
      .eq('feature_date', today)
      .eq('is_active', true)
      .single();

    if (configError || !featuredConfig) {
      return NextResponse.json({
        success: false,
        error: '今日暂无精选玩法'
      }, { status: 404 });
    }

    // 2. 获取三个玩法的详细信息
    const playIds = [
      featuredConfig.play_1_id,
      featuredConfig.play_2_id,
      featuredConfig.play_3_id
    ];

    const { data: plays, error: playsError } = await supabase
      .from('strategies')
      .select('id, title, slug, summary, category, risk_level, apy_min, apy_max, cover_image')
      .in('id', playIds)
      .eq('status', 'published');

    if (playsError) {
      console.error('获取玩法详情失败:', playsError);
      return NextResponse.json({
        success: false,
        error: '获取玩法详情失败'
      }, { status: 500 });
    }

    // 3. 按照原始顺序排列
    const orderedPlays = playIds.map(id =>
      plays?.find(play => play.id === id)
    ).filter(Boolean);

    return NextResponse.json({
      success: true,
      data: {
        date: featuredConfig.feature_date,
        theme_label: featuredConfig.theme_label || '今日精选',
        plays: orderedPlays.map((play, index) => ({
          ...play,
          card_index: index
        }))
      }
    });

  } catch (error) {
    console.error('获取今日精选失败:', error);
    return NextResponse.json({
      success: false,
      error: '服务器错误'
    }, { status: 500 });
  }
}
