import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

/**
 * GET /api/play-exchange/user-info
 * 获取当前用户的积分、翻牌状态等信息
 * 需要用户登录
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();

    // 从请求头获取 Authorization token
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({
        success: false,
        error: '未登录'
      }, { status: 401 });
    }

    // 验证用户身份
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return NextResponse.json({
        success: false,
        error: '身份验证失败'
      }, { status: 401 });
    }

    // 获取用户 profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('id, credits, first_draw_used, referral_code')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('获取用户 profile 失败:', profileError);
      return NextResponse.json({
        success: false,
        error: '获取用户信息失败'
      }, { status: 500 });
    }

    // 获取用户已获得的玩法列表
    const { data: exchanges, error: exchangesError } = await supabase
      .from('user_play_exchanges')
      .select('play_id, exchange_type, created_at, featured_date')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (exchangesError) {
      console.error('获取交换记录失败:', exchangesError);
    }

    // 检查今天是否已经翻过牌
    const today = new Date().toISOString().split('T')[0];
    const todayExchange = exchanges?.find(e => e.featured_date === today);

    return NextResponse.json({
      success: true,
      data: {
        user_id: user.id,
        email: user.email,
        credits: profile?.credits || 0,
        first_draw_used: profile?.first_draw_used || false,
        referral_code: profile?.referral_code || '',
        total_plays: exchanges?.length || 0,
        my_plays: exchanges?.map(e => e.play_id) || [],
        has_drawn_today: !!todayExchange,
        today_play_id: todayExchange?.play_id || null
      }
    });

  } catch (error) {
    console.error('获取用户信息失败:', error);
    return NextResponse.json({
      success: false,
      error: '服务器错误'
    }, { status: 500 });
  }
}
