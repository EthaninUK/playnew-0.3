import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * GET /api/playpass/balance
 * 获取用户 PlayPass 余额和会员信息
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 从 URL 参数获取 user_id
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: '缺少 user_id 参数' },
        { status: 400 }
      );
    }

    // 查询用户档案（使用 user_profiles.credits 作为积分来源）
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('查询用户档案失败:', profileError);
      return NextResponse.json(
        { success: false, error: '查询用户档案失败' },
        { status: 500 }
      );
    }

    // 查询或创建 PlayPass 扩展信息（用于会员等级、签到等）
    let { data: userPP, error } = await supabase
      .from('user_playpass')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      // 如果不存在 PlayPass 记录，创建一个
      if (error.code === 'PGRST116') {
        const { data: newUserPP, error: createError } = await supabase
          .from('user_playpass')
          .insert({
            user_id: userId,
            current_balance: userProfile.credits || 0, // 使用 user_profiles.credits
            total_earned: userProfile.credits || 0,
            total_spent: 0,
            membership_level: 0,
            is_max_member: false,
            earn_multiplier: 1.0,
            daily_earn_limit: 1000,
            daily_earned_today: 0,
            last_daily_reset: new Date().toISOString().split('T')[0],
            pp_level: 1,
            level_progress: 0,
            consecutive_signin_days: 0,
            total_signin_days: 0,
          })
          .select()
          .single();

        if (createError) {
          console.error('创建用户 PP 记录失败:', createError);
        }

        userPP = newUserPP;
      }
    }

    // 检查是否需要重置每日计数
    const today = new Date().toISOString().split('T')[0];
    const lastReset = userPP?.last_daily_reset;

    if (userPP && lastReset !== today) {
      // 重置每日获取计数
      const { data: updatedUserPP, error: updateError } = await supabase
        .from('user_playpass')
        .update({
          daily_earned_today: 0,
          last_daily_reset: today,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (updateError) {
        console.error('重置每日计数失败:', updateError);
      } else if (updatedUserPP) {
        userPP.daily_earned_today = 0;
        userPP.last_daily_reset = today;
      }
    }

    // 使用 user_profiles.credits 作为当前余额
    const currentBalance = userProfile.credits || 0;

    // 返回用户 PP 信息（优先使用 user_profiles.credits）
    return NextResponse.json({
      success: true,
      data: {
        user_id: userId,
        current_balance: currentBalance, // 使用 user_profiles.credits
        total_earned: userPP?.total_earned || currentBalance,
        total_spent: userPP?.total_spent || 0,
        membership_level: userPP?.membership_level || 0,
        membership_name: getMembershipName(userPP?.membership_level || 0),
        is_max_member: userPP?.is_max_member || false,
        earn_multiplier: parseFloat(userPP?.earn_multiplier || '1.0'),
        daily_earn_limit: userPP?.daily_earn_limit || 1000,
        daily_earned_today: userPP?.daily_earned_today || 0,
        daily_remaining: userPP?.is_max_member
          ? 999999
          : Math.max(0, (userPP?.daily_earn_limit || 1000) - (userPP?.daily_earned_today || 0)),
        pp_level: userPP?.pp_level || 1,
        level_progress: userPP?.level_progress || 0,
        consecutive_signin_days: userPP?.consecutive_signin_days || 0,
        total_signin_days: userPP?.total_signin_days || 0,
        last_signin_date: userPP?.last_signin_date,
      },
    });
  } catch (error) {
    console.error('获取 PlayPass 余额失败:', error);
    return NextResponse.json(
      { success: false, error: '服务器错误' },
      { status: 500 }
    );
  }
}

/**
 * 获取会员等级名称
 */
function getMembershipName(level: number): string {
  const names: Record<number, string> = {
    0: 'Free',
    1: 'Pro',
    2: 'Premium',
    3: 'Partner',
    4: 'MAX',
  };
  return names[level] || 'Free';
}
