/**
 * POST /api/web3/recharge-credits
 * 使用 PlayPass 充值积分 (非 Web3 支付,直接扣除用户 PP)
 *
 * 此 API 用于用户使用现有 PP 为其他用户充值,或使用 PP 购买内容
 * Web3 充值通过 verify-transaction API 处理
 *
 * 请求参数:
 * - amount_pp: 充值的 PP 数量
 * - recipient_user_id: 接收者用户 ID (可选,默认为自己)
 * - purpose: 'gift' | 'self_recharge' (赠送或自己使用)
 *
 * 返回:
 * - 成功: { success: true, data: { transaction_id, new_balance } }
 * - 失败: { success: false, error: string }
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount_pp, recipient_user_id, purpose = 'self_recharge' } = body;

    // 验证参数
    if (!amount_pp || amount_pp <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: '充值数量必须大于 0',
        },
        { status: 400 }
      );
    }

    // ============================================
    // 1. 验证用户登录
    // ============================================
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: '未登录',
          requires_login: true,
        },
        { status: 401 }
      );
    }

    // ============================================
    // 2. 确定接收者
    // ============================================
    const recipientId = recipient_user_id || user.id;
    const isGift = recipientId !== user.id;

    // ============================================
    // 3. 使用 Service Role 进行数据库操作
    // ============================================
    const supabaseService = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          getAll() {
            return [];
          },
          setAll() {},
        },
      }
    );

    // ============================================
    // 4. 检查发送者余额
    // ============================================
    const { data: senderProfile, error: senderError } = await supabaseService
      .from('user_profiles')
      .select('credits')
      .eq('id', user.id)
      .single();

    if (senderError || !senderProfile) {
      return NextResponse.json(
        {
          success: false,
          error: '无法获取用户信息',
        },
        { status: 500 }
      );
    }

    const senderBalance = senderProfile.credits || 0;

    if (senderBalance < amount_pp) {
      return NextResponse.json(
        {
          success: false,
          error: 'PP 余额不足',
          current_balance: senderBalance,
          required_amount: amount_pp,
          shortage: amount_pp - senderBalance,
        },
        { status: 400 }
      );
    }

    // ============================================
    // 5. 执行转账 (使用事务)
    // ============================================

    // 扣除发送者余额
    const { error: deductError } = await supabaseService
      .from('user_profiles')
      .update({
        credits: senderBalance - amount_pp,
        total_credits_spent: supabaseService.from('user_profiles').select('total_credits_spent'),
      })
      .eq('id', user.id);

    if (deductError) {
      console.error('扣除 PP 失败:', deductError);
      return NextResponse.json(
        {
          success: false,
          error: '扣除 PP 失败',
          details: deductError.message,
        },
        { status: 500 }
      );
    }

    // 增加接收者余额
    if (isGift) {
      // 赠送给其他用户
      const { data: recipientProfile, error: recipientError } = await supabaseService
        .from('user_profiles')
        .select('credits')
        .eq('id', recipientId)
        .single();

      if (recipientError || !recipientProfile) {
        // 回滚发送者余额
        await supabaseService
          .from('user_profiles')
          .update({ credits: senderBalance })
          .eq('id', user.id);

        return NextResponse.json(
          {
            success: false,
            error: '接收者不存在',
          },
          { status: 400 }
        );
      }

      const { error: addError } = await supabaseService
        .from('user_profiles')
        .update({
          credits: (recipientProfile.credits || 0) + amount_pp,
        })
        .eq('id', recipientId);

      if (addError) {
        // 回滚发送者余额
        await supabaseService
          .from('user_profiles')
          .update({ credits: senderBalance })
          .eq('id', user.id);

        console.error('增加接收者 PP 失败:', addError);
        return NextResponse.json(
          {
            success: false,
            error: '充值失败',
            details: addError.message,
          },
          { status: 500 }
        );
      }
    }

    // ============================================
    // 6. 记录交易 (发送者)
    // ============================================
    const { data: senderTransaction, error: senderTxError } = await supabaseService
      .from('credit_transactions')
      .insert({
        user_id: user.id,
        type: isGift ? 'gift_sent' : 'self_recharge',
        amount: -amount_pp,
        balance_after: senderBalance - amount_pp,
        description: isGift
          ? `赠送 ${amount_pp} PP 给用户 ${recipientId}`
          : `使用 ${amount_pp} PP 充值`,
        metadata: {
          recipient_id: recipientId,
          purpose,
        },
      })
      .select()
      .single();

    if (senderTxError) {
      console.error('记录发送者交易失败:', senderTxError);
    }

    // ============================================
    // 7. 记录交易 (接收者,如果是赠送)
    // ============================================
    if (isGift) {
      const { data: recipientProfile } = await supabaseService
        .from('user_profiles')
        .select('credits')
        .eq('id', recipientId)
        .single();

      const { error: recipientTxError } = await supabaseService
        .from('credit_transactions')
        .insert({
          user_id: recipientId,
          type: 'gift_received',
          amount: amount_pp,
          balance_after: recipientProfile?.credits || 0,
          description: `收到来自用户 ${user.id} 的 ${amount_pp} PP 赠送`,
          metadata: {
            sender_id: user.id,
          },
        });

      if (recipientTxError) {
        console.error('记录接收者交易失败:', recipientTxError);
      }
    }

    // ============================================
    // 8. 返回结果
    // ============================================
    const { data: updatedSenderProfile } = await supabaseService
      .from('user_profiles')
      .select('credits')
      .eq('id', user.id)
      .single();

    return NextResponse.json({
      success: true,
      data: {
        transaction_id: senderTransaction?.id,
        amount_transferred: amount_pp,
        new_balance: updatedSenderProfile?.credits || 0,
        recipient_id: recipientId,
        is_gift: isGift,
        message: isGift ? `成功赠送 ${amount_pp} PP` : `成功使用 ${amount_pp} PP`,
      },
    });
  } catch (error: any) {
    console.error('Error in /api/web3/recharge-credits:', error);
    return NextResponse.json(
      {
        success: false,
        error: '服务器错误',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/web3/recharge-credits
 * 获取用户当前 PP 余额和充值历史
 */
export async function GET(request: NextRequest) {
  try {
    // ============================================
    // 1. 验证用户登录
    // ============================================
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: '未登录',
          requires_login: true,
        },
        { status: 401 }
      );
    }

    // ============================================
    // 2. 获取用户信息
    // ============================================
    const supabaseService = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          getAll() {
            return [];
          },
          setAll() {},
        },
      }
    );

    const { data: profile, error: profileError } = await supabaseService
      .from('user_profiles')
      .select('credits, total_credits_earned, total_credits_spent, total_recharged_usd, last_recharge_at')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('获取用户信息失败:', profileError);
      return NextResponse.json(
        {
          success: false,
          error: '无法获取用户信息',
        },
        { status: 500 }
      );
    }

    // ============================================
    // 3. 获取最近交易记录
    // ============================================
    const { data: transactions, error: txError } = await supabaseService
      .from('credit_transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    if (txError) {
      console.error('获取交易记录失败:', txError);
    }

    // ============================================
    // 4. 返回数据
    // ============================================
    return NextResponse.json({
      success: true,
      data: {
        balance: {
          current: profile?.credits || 0,
          total_earned: profile?.total_credits_earned || 0,
          total_spent: profile?.total_credits_spent || 0,
        },
        recharge_stats: {
          total_recharged_usd: profile?.total_recharged_usd || 0,
          last_recharge_at: profile?.last_recharge_at,
        },
        recent_transactions: transactions || [],
      },
    });
  } catch (error: any) {
    console.error('Error in /api/web3/recharge-credits GET:', error);
    return NextResponse.json(
      {
        success: false,
        error: '服务器错误',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
