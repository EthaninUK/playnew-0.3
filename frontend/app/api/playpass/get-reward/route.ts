import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * POST /api/playpass/get-reward
 * 获取奖励金额（根据后台配置的奖励规则）
 *
 * 核心功能：从 playpass_reward_config 表读取奖励规则
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const body = await request.json();
    const { action_type, user_membership_level = 0, metadata = {} } = body;

    if (!action_type) {
      return NextResponse.json(
        { success: false, error: '缺少 action_type 参数' },
        { status: 400 }
      );
    }

    // 1. 查询奖励规则（按优先级降序）
    const { data: rewardRules, error: rulesError } = await supabase
      .from('playpass_reward_config')
      .select('*')
      .eq('action_type', action_type)
      .eq('is_active', true)
      .order('priority', { ascending: false });

    if (rulesError) {
      console.error('查询奖励规则失败:', rulesError);
      return NextResponse.json(
        { success: false, error: '查询奖励规则失败' },
        { status: 500 }
      );
    }

    if (!rewardRules || rewardRules.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          action_type,
          base_amount: 0,
          final_amount: 0,
          is_available: false,
          reason: '未找到奖励规则',
        },
      });
    }

    // 2. 匹配第一个有效的奖励规则
    const now = new Date();
    let matchedRule: any = null;

    for (const rule of rewardRules) {
      // 检查时间范围
      if (rule.valid_from && new Date(rule.valid_from) > now) {
        continue;
      }
      if (rule.valid_until && new Date(rule.valid_until) < now) {
        continue;
      }

      matchedRule = rule;
      break;
    }

    if (!matchedRule) {
      return NextResponse.json({
        success: true,
        data: {
          action_type,
          base_amount: 0,
          final_amount: 0,
          is_available: false,
          reason: '奖励规则已过期',
        },
      });
    }

    // 3. 计算奖励金额
    const baseAmount = matchedRule.pp_amount;
    let finalAmount = baseAmount;

    // 应用活动倍数（如双倍 PP 活动）
    const activityMultiplier = parseFloat(matchedRule.reward_multiplier) || 1.0;
    finalAmount = Math.round(finalAmount * activityMultiplier);

    // 应用会员倍率
    if (matchedRule.apply_multiplier) {
      const membershipMultipliers: Record<number, number> = {
        0: 1.0,   // Free
        1: 1.2,   // Pro
        2: 1.5,   // Premium
        3: 2.0,   // Partner
        4: 999.99 // MAX (实际不会赚取，但显示超高倍率)
      };
      const membershipMultiplier = membershipMultipliers[user_membership_level] || 1.0;
      finalAmount = Math.round(finalAmount * membershipMultiplier);
    }

    // 4. MAX 会员特殊处理
    if (user_membership_level === 4) {
      // MAX 会员不需要赚取 PP（已经无限）
      return NextResponse.json({
        success: true,
        data: {
          action_type,
          base_amount: baseAmount,
          final_amount: 0,
          is_available: false,
          is_max_member: true,
          reason: 'MAX 会员拥有无限 PP，无需赚取',
          matched_rule: {
            reward_key: matchedRule.reward_key,
            reward_name: matchedRule.reward_name,
          },
        },
      });
    }

    // 5. 返回奖励信息
    return NextResponse.json({
      success: true,
      data: {
        action_type,
        base_amount: baseAmount,
        activity_multiplier: activityMultiplier,
        membership_level: user_membership_level,
        final_amount: finalAmount,
        is_available: true,
        limit_type: matchedRule.limit_type,
        limit_count: matchedRule.limit_count,
        cooldown_minutes: matchedRule.cooldown_minutes,
        count_towards_daily_limit: matchedRule.count_towards_daily_limit,
        matched_rule: {
          reward_key: matchedRule.reward_key,
          reward_name: matchedRule.reward_name,
          description: matchedRule.description,
          priority: matchedRule.priority,
          valid_from: matchedRule.valid_from,
          valid_until: matchedRule.valid_until,
        },
      },
    });
  } catch (error) {
    console.error('获取奖励金额失败:', error);
    return NextResponse.json(
      { success: false, error: '服务器错误' },
      { status: 500 }
    );
  }
}
