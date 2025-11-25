import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * POST /api/playpass/get-price
 * 获取内容价格（根据后台配置的定价规则）
 *
 * 核心功能：从 playpass_pricing_config 表读取定价规则
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const body = await request.json();
    const { content_id, content_type, user_membership_level = 0 } = body;

    if (!content_id || !content_type) {
      return NextResponse.json(
        { success: false, error: '缺少必要参数' },
        { status: 400 }
      );
    }

    // 1. 获取内容信息
    let content: any = null;
    let contentError: any = null;

    // 根据 content_type 查询不同的表
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

    // 2. 查询定价规则（按优先级降序）
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

    // 3. 匹配定价规则
    let matchedRule: any = null;
    let basePrice = 0;

    for (const rule of pricingRules || []) {
      if (matchesConditions(content, rule.apply_conditions)) {
        matchedRule = rule;
        basePrice = rule.pp_price;
        break;
      }
    }

    // 如果没有匹配的规则，使用默认价格 0（免费）
    if (!matchedRule) {
      return NextResponse.json({
        success: true,
        data: {
          content_id,
          content_type,
          base_price: 0,
          final_price: 0,
          membership_level: user_membership_level,
          discount: 0,
          is_free: true,
          matched_rule: null,
        },
      });
    }

    // 4. 应用会员折扣
    const discounts = matchedRule.membership_discounts as Record<string, number> || {
      '0': 1.0,
      '1': 0.9,
      '2': 0.7,
      '3': 0.5,
      '4': 0.0,
    };

    const discountRate = discounts[user_membership_level.toString()] || 1.0;
    const finalPrice = Math.round(basePrice * discountRate);

    // 5. MAX 会员特殊处理
    const isFreeForMax = matchedRule.is_free_for_max !== false;
    const actualFinalPrice = user_membership_level === 4 && isFreeForMax ? 0 : finalPrice;

    // 6. 返回定价信息
    return NextResponse.json({
      success: true,
      data: {
        content_id,
        content_type,
        base_price: basePrice,
        final_price: actualFinalPrice,
        membership_level: user_membership_level,
        discount_rate: discountRate,
        discount_amount: basePrice - finalPrice,
        is_free: actualFinalPrice === 0,
        is_free_for_max: isFreeForMax,
        free_preview_length: matchedRule.free_preview_length || 500,
        matched_rule: {
          config_key: matchedRule.config_key,
          config_name: matchedRule.config_name,
          priority: matchedRule.priority,
        },
      },
    });
  } catch (error) {
    console.error('获取内容价格失败:', error);
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
