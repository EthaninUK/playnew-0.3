import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// 会员方案价格（PP 积分）
const MEMBERSHIP_PRICES: Record<string, { pp: number; name: string; level: number }> = {
  'pro': { pp: 69900, name: 'Pro', level: 1 },
  'max': { pp: 129900, name: 'Max', level: 2 }
};

export async function POST(request: NextRequest) {
  try {
    const { membershipId, membershipLevel } = await request.json();

    // 验证用户登录
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 验证会员方案
    const priceInfo = MEMBERSHIP_PRICES[membershipId];
    if (!priceInfo) {
      return NextResponse.json(
        { success: false, error: 'Invalid membership plan' },
        { status: 400 }
      );
    }

    // 获取用户当前余额
    const { data: balanceData, error: balanceError } = await supabase
      .from('playpass_balances')
      .select('current_balance')
      .eq('user_id', user.id)
      .single();

    if (balanceError || !balanceData) {
      return NextResponse.json(
        { success: false, error: '无法获取余额信息' },
        { status: 500 }
      );
    }

    const currentBalance = balanceData.current_balance || 0;

    // 检查余额是否足够
    if (currentBalance < priceInfo.pp) {
      return NextResponse.json(
        {
          success: false,
          error: `余额不足，需要 ${priceInfo.pp} PP，当前余额 ${currentBalance} PP`,
        },
        { status: 400 }
      );
    }

    // 扣除积分
    const { error: deductError } = await supabase.rpc('deduct_playpass', {
      p_user_id: user.id,
      p_amount: priceInfo.pp,
      p_description: `购买 ${priceInfo.name} 会员 (1年)`
    });

    if (deductError) {
      console.error('扣除积分失败:', deductError);
      return NextResponse.json(
        { success: false, error: '扣除积分失败' },
        { status: 500 }
      );
    }

    // 创建/更新订阅记录
    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 1); // 1年后

    const subscriptionData = {
      user_id: user.id,
      membership_id: membershipId,
      membership_level: membershipLevel,
      membership_name: priceInfo.name,
      status: 'active',
      start_date: new Date().toISOString(),
      end_date: endDate.toISOString(),
      payment_method: 'playpass',
      payment_amount_pp: priceInfo.pp,
    };

    // 尝试更新现有订阅，如果不存在则创建
    const { data: existingSub } = await supabase
      .from('user_subscriptions')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (existingSub) {
      // 更新现有订阅
      const { error: updateError } = await supabase
        .from('user_subscriptions')
        .update(subscriptionData)
        .eq('user_id', user.id);

      if (updateError) {
        console.error('更新订阅失败:', updateError);
        return NextResponse.json(
          { success: false, error: '更新订阅失败' },
          { status: 500 }
        );
      }
    } else {
      // 创建新订阅
      const { error: insertError } = await supabase
        .from('user_subscriptions')
        .insert([subscriptionData]);

      if (insertError) {
        console.error('创建订阅失败:', insertError);
        return NextResponse.json(
          { success: false, error: '创建订阅失败' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        membership: priceInfo.name,
        endDate: endDate.toISOString(),
        amountPaid: priceInfo.pp,
        newBalance: currentBalance - priceInfo.pp,
      },
    });
  } catch (error: any) {
    console.error('购买会员失败:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Purchase failed' },
      { status: 500 }
    );
  }
}
