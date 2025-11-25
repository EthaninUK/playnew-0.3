import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * POST /api/playpass/check-access
 * 检查用户是否有权访问内容
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const body = await request.json();
    const { user_id, content_id, content_type } = body;

    if (!user_id || !content_id || !content_type) {
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

    // 2. MAX 会员无限制访问
    if (userPP.is_max_member) {
      return NextResponse.json({
        success: true,
        data: {
          has_access: true,
          access_method: 'max_member',
          is_max_member: true,
          message: 'MAX 会员拥有全站访问权限',
        },
      });
    }

    // 3. 检查是否已解锁
    const { data: unlocked, error: unlockedError } = await supabase
      .from('user_unlocked_content')
      .select('*')
      .eq('user_id', user_id)
      .eq('content_id', content_id)
      .eq('content_type', content_type)
      .single();

    if (!unlockedError && unlocked) {
      return NextResponse.json({
        success: true,
        data: {
          has_access: true,
          access_method: unlocked.unlock_method,
          unlocked_at: unlocked.unlocked_at,
          pp_spent: unlocked.pp_spent,
          message: '内容已解锁',
        },
      });
    }

    // 4. 获取内容信息
    let content: any = null;
    let contentError: any = null;

    if (content_type === 'strategy') {
      const { data, error } = await supabase
        .from('strategies')
        .select('*')
        .eq('id', content_id)
        .single();
      content = data;
      contentError = error;
    } else if (content_type === 'arbitrage') {
      const { data, error } = await supabase
        .from('arbitrage')
        .select('*')
        .eq('id', content_id)
        .single();
      content = data;
      contentError = error;
    } else if (content_type === 'news') {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', content_id)
        .single();
      content = data;
      contentError = error;
    } else if (content_type === 'gossip') {
      const { data, error } = await supabase
        .from('gossip')
        .select('*')
        .eq('id', content_id)
        .single();
      content = data;
      contentError = error;
    }

    if (contentError || !content) {
      return NextResponse.json(
        { success: false, error: '内容不存在' },
        { status: 404 }
      );
    }

    // 5. 查询定价规则
    const { data: pricingRules, error: rulesError } = await supabase
      .from('playpass_pricing_config')
      .select('*')
      .eq('content_type', content_type)
      .eq('is_active', true)
      .order('priority', { ascending: false });

    if (rulesError) {
      console.error('查询定价规则失败:', rulesError);
      return NextResponse.json(
        { success: false, error: '查询定价规则失败' },
        { status: 500 }
      );
    }

    // 6. 匹配定价规则
    let matchedRule: any = null;
    let basePrice = 0;

    for (const rule of pricingRules || []) {
      if (matchesConditions(content, rule.apply_conditions)) {
        matchedRule = rule;
        basePrice = rule.pp_price;
        break;
      }
    }

    // 如果没有匹配的规则或价格为 0，则免费访问
    if (!matchedRule || basePrice === 0) {
      return NextResponse.json({
        success: true,
        data: {
          has_access: true,
          access_method: 'free',
          price: 0,
          message: '免费内容',
        },
      });
    }

    // 7. 计算价格（应用会员折扣）
    const discounts = matchedRule.membership_discounts as Record<string, number> || {
      '0': 1.0,
      '1': 0.9,
      '2': 0.7,
      '3': 0.5,
      '4': 0.0,
    };

    const discountRate = discounts[userPP.membership_level.toString()] || 1.0;
    const finalPrice = Math.round(basePrice * discountRate);

    // 8. 检查用户余额是否充足
    const hasSufficientBalance = userPP.current_balance >= finalPrice;

    // 9. 返回访问权限信息
    return NextResponse.json({
      success: true,
      data: {
        has_access: finalPrice === 0, // 如果价格为 0（会员折扣后），则可以访问
        access_method: finalPrice === 0 ? 'membership_discount' : 'locked',
        is_locked: finalPrice > 0,
        price: {
          base_price: basePrice,
          discount_rate: discountRate,
          final_price: finalPrice,
        },
        user_balance: userPP.current_balance,
        has_sufficient_balance: hasSufficientBalance,
        shortage: hasSufficientBalance ? 0 : finalPrice - userPP.current_balance,
        free_preview_length: matchedRule.free_preview_length || 500,
        membership_level: userPP.membership_level,
        matched_rule: {
          config_key: matchedRule.config_key,
          config_name: matchedRule.config_name,
        },
        message: finalPrice === 0
          ? '会员折扣后免费'
          : hasSufficientBalance
          ? `需要 ${finalPrice} PP 解锁`
          : `余额不足，需要 ${finalPrice} PP，当前余额 ${userPP.current_balance} PP`,
      },
    });
  } catch (error) {
    console.error('检查访问权限失败:', error);
    return NextResponse.json(
      { success: false, error: '服务器错误' },
      { status: 500 }
    );
  }
}

/**
 * 检查内容是否匹配定价条件
 */
function matchesConditions(content: any, conditions: any): boolean {
  if (!conditions) return true;

  for (const [key, value] of Object.entries(conditions)) {
    const contentValue = content[key];

    if (Array.isArray(value)) {
      // 数组条件：内容值必须在数组中
      if (!value.includes(contentValue)) {
        return false;
      }
    } else if (typeof value === 'object' && value !== null) {
      // 对象条件：支持范围判断等
      if ('min' in value && contentValue < (value as any).min) return false;
      if ('max' in value && contentValue > (value as any).max) return false;
    } else {
      // 普通条件：精确匹配
      if (contentValue !== value) {
        return false;
      }
    }
  }

  return true;
}
