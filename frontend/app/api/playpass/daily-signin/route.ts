import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * POST /api/playpass/daily-signin
 * 每日签到，获取 PP 奖励
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const body = await request.json();
    const { user_id } = body;

    if (!user_id) {
      return NextResponse.json(
        { success: false, error: '缺少 user_id 参数' },
        { status: 400 }
      );
    }

    // 1. 获取用户 PP 信息
    const { data: userPP, error: userError } = await supabase
      .from('user_playpass')
      .select('*')
      .eq('user_id', user_id)
      .single();

    if (userError || !userPP) {
      return NextResponse.json(
        { success: false, error: '用户不存在' },
        { status: 404 }
      );
    }

    // 2. MAX 会员特殊处理（仍记录签到，但不奖励 PP）
    if (userPP.is_max_member) {
      // 更新签到天数
      const today = new Date().toISOString().split('T')[0];
      const lastSignin = userPP.last_signin_date;
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];

      let consecutiveDays = userPP.consecutive_signin_days;
      if (lastSignin === yesterday) {
        consecutiveDays += 1;
      } else if (lastSignin === today) {
        // 今天已签到
        return NextResponse.json({
          success: false,
          error: '今天已经签到过了',
          data: {
            already_signed: true,
            last_signin_date: lastSignin,
            consecutive_days: consecutiveDays,
            is_max_member: true,
          },
        });
      } else {
        // 断签
        consecutiveDays = 1;
      }

      // 更新签到记录
      await supabase
        .from('user_playpass')
        .update({
          consecutive_signin_days: consecutiveDays,
          total_signin_days: userPP.total_signin_days + 1,
          last_signin_date: today,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user_id);

      return NextResponse.json({
        success: true,
        message: 'MAX 会员签到成功（无需 PP 奖励）',
        data: {
          user_id,
          earned_pp: 0,
          consecutive_days: consecutiveDays,
          total_signin_days: userPP.total_signin_days + 1,
          is_max_member: true,
          current_balance: 999999,
        },
      });
    }

    // 3. 检查今天是否已签到
    const today = new Date().toISOString().split('T')[0];
    const lastSignin = userPP.last_signin_date;

    if (lastSignin === today) {
      return NextResponse.json({
        success: false,
        error: '今天已经签到过了',
        data: {
          already_signed: true,
          last_signin_date: lastSignin,
          consecutive_days: userPP.consecutive_signin_days,
          next_signin: new Date(Date.now() + 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
        },
      });
    }

    // 4. 查询签到奖励规则
    const { data: rewardRule, error: rewardError } = await supabase
      .from('playpass_reward_config')
      .select('*')
      .eq('action_type', 'daily_signin')
      .eq('is_active', true)
      .single();

    if (rewardError || !rewardRule) {
      console.error('查询签到奖励规则失败:', rewardError);
      return NextResponse.json(
        { success: false, error: '签到奖励规则未配置' },
        { status: 500 }
      );
    }

    // 5. 计算签到奖励
    const baseAmount = rewardRule.pp_amount;
    let earnedPP = baseAmount;

    // 应用活动倍数
    const activityMultiplier = parseFloat(rewardRule.reward_multiplier) || 1.0;
    earnedPP = Math.round(earnedPP * activityMultiplier);

    // 应用会员倍率
    if (rewardRule.apply_multiplier) {
      const membershipMultipliers: Record<number, number> = {
        0: 1.0,   // Free
        1: 1.2,   // Pro
        2: 1.5,   // Premium
        3: 2.0,   // Partner
        4: 999.99 // MAX
      };
      const membershipMultiplier =
        membershipMultipliers[userPP.membership_level] || 1.0;
      earnedPP = Math.round(earnedPP * membershipMultiplier);
    }

    // 6. 连续签到额外奖励（每连续 7 天额外 +10 PP）
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];
    let consecutiveDays = userPP.consecutive_signin_days;

    if (lastSignin === yesterday) {
      // 连续签到
      consecutiveDays += 1;
    } else {
      // 断签，重新开始
      consecutiveDays = 1;
    }

    // 每满 7 天额外奖励
    const streakBonus = Math.floor(consecutiveDays / 7) * 10;
    earnedPP += streakBonus;

    // 7. 检查每日获取上限
    const newDailyEarned = userPP.daily_earned_today + earnedPP;
    const dailyLimit = userPP.daily_earn_limit;

    if (newDailyEarned > dailyLimit && rewardRule.count_towards_daily_limit) {
      const available = Math.max(0, dailyLimit - userPP.daily_earned_today);
      if (available === 0) {
        return NextResponse.json({
          success: false,
          error: '今日 PP 获取已达上限',
          data: {
            daily_limit: dailyLimit,
            daily_earned: userPP.daily_earned_today,
            shortage: earnedPP,
          },
        });
      }
      // 只奖励剩余额度
      earnedPP = available;
    }

    // 8. 更新用户 PP
    const newBalance = userPP.current_balance + earnedPP;
    const newTotalEarned = userPP.total_earned + earnedPP;
    const newDailyEarnedFinal = rewardRule.count_towards_daily_limit
      ? newDailyEarned
      : userPP.daily_earned_today;

    const { error: updateError } = await supabase
      .from('user_playpass')
      .update({
        current_balance: newBalance,
        total_earned: newTotalEarned,
        daily_earned_today: newDailyEarnedFinal,
        consecutive_signin_days: consecutiveDays,
        total_signin_days: userPP.total_signin_days + 1,
        last_signin_date: today,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user_id);

    if (updateError) {
      console.error('更新用户 PP 失败:', updateError);
      return NextResponse.json(
        { success: false, error: '更新用户 PP 失败' },
        { status: 500 }
      );
    }

    // 9. 记录交易
    await supabase.from('playpass_transactions').insert({
      user_id,
      transaction_type: 'earn',
      amount: earnedPP,
      balance_before: userPP.current_balance,
      balance_after: newBalance,
      source_type: 'daily_signin',
      source_id: null,
      source_metadata: {
        consecutive_days: consecutiveDays,
        streak_bonus: streakBonus,
        base_amount: baseAmount,
        activity_multiplier: activityMultiplier,
      },
      description: `每日签到 (连续 ${consecutiveDays} 天)`,
      display_title: '每日签到',
      status: 'completed',
    });

    // 10. 更新奖励规则统计
    try {
      await supabase.rpc('increment_reward_stats', {
        p_action_type: 'daily_signin',
        p_pp_amount: earnedPP,
      });
    } catch (error) {
      // 如果 RPC 不存在，忽略错误
    }

    // 11. 返回成功响应
    return NextResponse.json({
      success: true,
      message: `签到成功！获得 ${earnedPP} PP`,
      data: {
        user_id,
        earned_pp: earnedPP,
        base_amount: baseAmount,
        streak_bonus: streakBonus,
        current_balance: newBalance,
        total_earned: newTotalEarned,
        consecutive_days: consecutiveDays,
        total_signin_days: userPP.total_signin_days + 1,
        daily_earned_today: newDailyEarnedFinal,
        daily_limit: dailyLimit,
        next_signin: new Date(Date.now() + 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
      },
    });
  } catch (error) {
    console.error('每日签到失败:', error);
    return NextResponse.json(
      { success: false, error: '服务器错误' },
      { status: 500 }
    );
  }
}
