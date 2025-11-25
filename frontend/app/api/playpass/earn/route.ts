import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * POST /api/playpass/earn
 * 用户赚取 PlayPass
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const body = await request.json();
    const { user_id, action_type, source_id, source_metadata, description } = body;

    if (!user_id || !action_type) {
      return NextResponse.json(
        { success: false, error: '缺少必要参数' },
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

    // 2. MAX 会员特殊处理（无限 PP，但仍记录行为）
    if (userPP.is_max_member) {
      return NextResponse.json({
        success: true,
        message: 'MAX 会员无需赚取 PP',
        data: {
          user_id,
          current_balance: 999999,
          earned_amount: 0,
          is_max_member: true,
        },
      });
    }

    // 3. 查询奖励规则
    const { data: rewardRule, error: ruleError } = await supabase
      .from('playpass_reward_config')
      .select('*')
      .eq('action_type', action_type)
      .eq('is_active', true)
      .lte('min_membership_level', userPP.membership_level)
      .single();

    if (ruleError || !rewardRule) {
      return NextResponse.json(
        { success: false, error: '未找到有效的奖励规则' },
        { status: 404 }
      );
    }

    // 4. 检查是否在有效期内
    const now = new Date();
    if (rewardRule.valid_from && new Date(rewardRule.valid_from) > now) {
      return NextResponse.json(
        { success: false, error: '奖励规则尚未生效' },
        { status: 400 }
      );
    }
    if (rewardRule.valid_until && new Date(rewardRule.valid_until) < now) {
      return NextResponse.json(
        { success: false, error: '奖励规则已过期' },
        { status: 400 }
      );
    }

    // 5. 检查每日获取上限
    if (rewardRule.count_towards_daily_limit) {
      if (userPP.daily_earned_today >= userPP.daily_earn_limit) {
        return NextResponse.json(
          {
            success: false,
            error: '已达到每日获取上限',
            daily_limit: userPP.daily_earn_limit,
            daily_earned: userPP.daily_earned_today,
          },
          { status: 400 }
        );
      }
    }

    // 6. 计算实际奖励金额
    let finalAmount = rewardRule.pp_amount;

    // 应用活动倍数
    finalAmount *= parseFloat(rewardRule.reward_multiplier || 1.0);

    // 应用会员倍率
    if (rewardRule.apply_multiplier) {
      finalAmount *= parseFloat(userPP.earn_multiplier);
    }

    finalAmount = Math.round(finalAmount);

    // 7. 检查每日上限（扣除后不能超过）
    if (rewardRule.count_towards_daily_limit) {
      const remaining = userPP.daily_earn_limit - userPP.daily_earned_today;
      if (finalAmount > remaining) {
        finalAmount = remaining;
      }
    }

    if (finalAmount <= 0) {
      return NextResponse.json(
        { success: false, error: '奖励金额为 0' },
        { status: 400 }
      );
    }

    // 8. 更新用户 PP 余额
    const newBalance = userPP.current_balance + finalAmount;
    const newTotalEarned = userPP.total_earned + finalAmount;
    const newDailyEarned = rewardRule.count_towards_daily_limit
      ? userPP.daily_earned_today + finalAmount
      : userPP.daily_earned_today;

    const { data: updatedUserPP, error: updateError } = await supabase
      .from('user_playpass')
      .update({
        current_balance: newBalance,
        total_earned: newTotalEarned,
        daily_earned_today: newDailyEarned,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user_id)
      .select()
      .single();

    if (updateError) {
      console.error('更新用户 PP 失败:', updateError);
      return NextResponse.json(
        { success: false, error: '更新用户 PP 失败' },
        { status: 500 }
      );
    }

    // 9. 记录交易
    const { error: transError } = await supabase
      .from('playpass_transactions')
      .insert({
        user_id,
        transaction_type: 'earn',
        amount: finalAmount,
        balance_before: userPP.current_balance,
        balance_after: newBalance,
        source_type: action_type,
        source_id,
        source_metadata,
        description: description || `获得 ${finalAmount} PP`,
        display_title: rewardRule.reward_name,
        status: 'completed',
      });

    if (transError) {
      console.error('记录交易失败:', transError);
    }

    // 10. 更新奖励规则统计
    await supabase
      .from('playpass_reward_config')
      .update({
        total_completions: (rewardRule.total_completions || 0) + 1,
        total_pp_distributed: (rewardRule.total_pp_distributed || 0) + finalAmount,
      })
      .eq('id', rewardRule.id);

    // 11. 返回成功响应
    return NextResponse.json({
      success: true,
      message: `成功获得 ${finalAmount} PP`,
      data: {
        user_id,
        earned_amount: finalAmount,
        current_balance: newBalance,
        total_earned: newTotalEarned,
        daily_earned_today: newDailyEarned,
        daily_remaining: Math.max(
          0,
          userPP.daily_earn_limit - newDailyEarned
        ),
        reward_name: rewardRule.reward_name,
        action_type,
      },
    });
  } catch (error) {
    console.error('赚取 PlayPass 失败:', error);
    return NextResponse.json(
      { success: false, error: '服务器错误' },
      { status: 500 }
    );
  }
}
