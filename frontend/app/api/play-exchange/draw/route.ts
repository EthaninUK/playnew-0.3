import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

interface DrawRequest {
  card_index: number; // 选择的卡片索引 (0, 1, 2)
  play_id: string;    // 玩法 ID
}

/**
 * POST /api/play-exchange/draw
 * 翻牌交换玩法
 *
 * 业务逻辑:
 * 1. 检查用户是否已登录
 * 2. 检查是否首次翻牌（免费）或需要消耗积分
 * 3. 检查是否已经拥有该玩法
 * 4. 扣除积分（如果需要）
 * 5. 创建交换记录
 * 6. 创建积分交易记录
 * 7. 返回获得的玩法信息
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const body: DrawRequest = await request.json();

    const { card_index, play_id } = body;

    // 验证参数
    if (![0, 1, 2].includes(card_index)) {
      return NextResponse.json({
        success: false,
        error: '无效的卡片索引'
      }, { status: 400 });
    }

    if (!play_id) {
      return NextResponse.json({
        success: false,
        error: '缺少玩法 ID'
      }, { status: 400 });
    }

    // 验证用户身份
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({
        success: false,
        error: '未登录'
      }, { status: 401 });
    }

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
      .select('credits, first_draw_used')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({
        success: false,
        error: '获取用户信息失败'
      }, { status: 500 });
    }

    // 获取今天的日期
    const today = new Date().toISOString().split('T')[0];

    // 检查是否已经拥有该玩法（避免重复获得相同玩法）
    const { data: existingExchange } = await supabase
      .from('user_play_exchanges')
      .select('id')
      .eq('user_id', user.id)
      .eq('play_id', play_id)
      .single();

    if (existingExchange) {
      return NextResponse.json({
        success: false,
        error: '您已经拥有这个玩法了'
      }, { status: 400 });
    }

    // 判断交换类型
    const isFirstFree = !profile.first_draw_used;
    const exchangeType = isFirstFree ? 'first_free' : 'paid_draw';
    const creditsToSpend = isFirstFree ? 0 : 1;

    // 如果需要消耗积分，检查余额
    if (!isFirstFree && profile.credits < 1) {
      return NextResponse.json({
        success: false,
        error: '积分不足，请先邀请好友或提交玩法获取积分'
      }, { status: 400 });
    }

    // 开始事务操作
    // 1. 更新用户积分和首次翻牌状态
    const newCredits = profile.credits - creditsToSpend;
    const { error: updateProfileError } = await supabase
      .from('user_profiles')
      .update({
        credits: newCredits,
        first_draw_used: true
      })
      .eq('id', user.id);

    if (updateProfileError) {
      console.error('更新用户 profile 失败:', updateProfileError);
      return NextResponse.json({
        success: false,
        error: '更新用户信息失败'
      }, { status: 500 });
    }

    // 2. 创建交换记录
    const { error: exchangeError } = await supabase
      .from('user_play_exchanges')
      .insert({
        user_id: user.id,
        play_id: play_id,
        exchange_type: exchangeType,
        credits_spent: creditsToSpend,
        featured_date: today,
        selected_card_index: card_index
      });

    if (exchangeError) {
      console.error('创建交换记录失败:', exchangeError);
      // 回滚：恢复用户积分
      await supabase
        .from('user_profiles')
        .update({
          credits: profile.credits,
          first_draw_used: profile.first_draw_used
        })
        .eq('id', user.id);

      return NextResponse.json({
        success: false,
        error: '创建交换记录失败'
      }, { status: 500 });
    }

    // 3. 创建积分交易记录
    if (creditsToSpend > 0) {
      await supabase
        .from('credit_transactions')
        .insert({
          user_id: user.id,
          credits_change: -creditsToSpend,
          credits_before: profile.credits,
          credits_after: newCredits,
          transaction_type: 'paid_draw',
          related_id: play_id,
          related_type: 'play_exchange',
          description: `翻牌获取玩法`,
          metadata: { card_index }
        });
    }

    // 4. 获取玩法详情
    const { data: playDetail, error: playError } = await supabase
      .from('strategies')
      .select('id, title, slug, summary, category, risk_level, apy_min, apy_max, cover_image, content')
      .eq('id', play_id)
      .single();

    if (playError) {
      console.error('获取玩法详情失败:', playError);
    }

    return NextResponse.json({
      success: true,
      data: {
        exchange_type: exchangeType,
        credits_spent: creditsToSpend,
        credits_remaining: newCredits,
        play: playDetail,
        message: isFirstFree ? '🎉 恭喜！这是您的首次免费翻牌' : '🎊 翻牌成功！消耗 1 积分'
      }
    });

  } catch (error) {
    console.error('翻牌失败:', error);
    return NextResponse.json({
      success: false,
      error: '服务器错误'
    }, { status: 500 });
  }
}
