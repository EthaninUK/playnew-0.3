import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * POST /api/playpass/spend
 * 用户消耗 PlayPass
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const body = await request.json();
    const {
      user_id,
      amount,
      content_id,
      content_type,
      content_title,
      description,
    } = body;

    if (!user_id || !amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: '缺少必要参数或金额无效' },
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

    // 2. MAX 会员免费访问所有内容
    if (userPP.is_max_member) {
      // 记录解锁（但不消耗 PP）
      if (content_id && content_type) {
        await supabase
          .from('user_unlocked_content')
          .upsert({
            user_id,
            content_id,
            content_type,
            content_title,
            pp_spent: 0,
            original_price: amount,
            unlock_method: 'max_member',
          });
      }

      return NextResponse.json({
        success: true,
        message: 'MAX 会员免费访问',
        data: {
          user_id,
          spent_amount: 0,
          current_balance: 999999,
          is_max_member: true,
          unlock_method: 'max_member',
        },
      });
    }

    // 3. 检查余额是否充足
    if (userPP.current_balance < amount) {
      return NextResponse.json(
        {
          success: false,
          error: 'PlayPass 余额不足',
          current_balance: userPP.current_balance,
          required_amount: amount,
          shortage: amount - userPP.current_balance,
        },
        { status: 400 }
      );
    }

    // 4. 扣除 PP
    const newBalance = userPP.current_balance - amount;
    const newTotalSpent = userPP.total_spent + amount;

    const { data: updatedUserPP, error: updateError } = await supabase
      .from('user_playpass')
      .update({
        current_balance: newBalance,
        total_spent: newTotalSpent,
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

    // 5. 记录交易
    const { error: transError } = await supabase
      .from('playpass_transactions')
      .insert({
        user_id,
        transaction_type: 'spend',
        amount: -amount,
        balance_before: userPP.current_balance,
        balance_after: newBalance,
        source_type: content_type || 'unknown',
        source_id: content_id,
        source_metadata: { content_title },
        description: description || `消耗 ${amount} PP`,
        display_title: content_title || '解锁内容',
        status: 'completed',
      });

    if (transError) {
      console.error('记录交易失败:', transError);
    }

    // 6. 记录解锁内容
    if (content_id && content_type) {
      const { error: unlockError } = await supabase
        .from('user_unlocked_content')
        .upsert({
          user_id,
          content_id,
          content_type,
          content_title,
          pp_spent: amount,
          original_price: amount,
          unlock_method: 'playpass',
        });

      if (unlockError) {
        console.error('记录解锁内容失败:', unlockError);
      }

      // 更新定价配置统计
      if (content_type) {
        try {
          await supabase.rpc('increment_pricing_stats', {
            p_content_type: content_type,
            p_pp_amount: amount,
          });
        } catch (error) {
          // 如果 RPC 不存在，忽略错误
        }
      }
    }

    // 7. 返回成功响应
    return NextResponse.json({
      success: true,
      message: `成功消耗 ${amount} PP`,
      data: {
        user_id,
        spent_amount: amount,
        current_balance: newBalance,
        total_spent: newTotalSpent,
        content_id,
        content_type,
        unlock_method: 'playpass',
      },
    });
  } catch (error) {
    console.error('消耗 PlayPass 失败:', error);
    return NextResponse.json(
      { success: false, error: '服务器错误' },
      { status: 500 }
    );
  }
}
