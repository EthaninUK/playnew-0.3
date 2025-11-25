/**
 * POST /api/web3/verify-transaction
 * 验证链上交易并记录支付
 *
 * 请求参数:
 * - tx_hash: 交易哈希
 * - chain_id: 链 ID
 * - payment_purpose: 'content' | 'recharge'
 * - content_id: 内容 ID (仅 content)
 * - content_type: 内容类型 (仅 content)
 * - amount_usd: 预期金额 USD (用于验证)
 *
 * 返回:
 * - 成功: { success: true, data: { payment_id, access_token?, credits_added? } }
 * - 失败: { success: false, error: string }
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { verifyTransaction } from '@/lib/web3/verify-helper';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      tx_hash,
      chain_id,
      payment_purpose,
      content_id,
      content_type,
      amount_usd,
    } = body;

    // 验证参数
    if (!tx_hash || !chain_id || !payment_purpose || !amount_usd) {
      return NextResponse.json(
        {
          success: false,
          error: '缺少必要参数: tx_hash, chain_id, payment_purpose, amount_usd',
        },
        { status: 400 }
      );
    }

    if (payment_purpose === 'content' && (!content_id || !content_type)) {
      return NextResponse.json(
        {
          success: false,
          error: '购买内容需要提供 content_id 和 content_type',
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
    // 2. 检查交易是否已验证
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

    const { data: existingPayment } = await supabaseService
      .from('web3_payments')
      .select('*')
      .eq('tx_hash', tx_hash)
      .single();

    if (existingPayment) {
      // 交易已存在
      if (existingPayment.status === 'confirmed') {
        // 已确认的交易,直接返回结果
        return NextResponse.json({
          success: true,
          data: {
            payment_id: existingPayment.id,
            status: 'confirmed',
            message: '交易已确认',
            credits_added: existingPayment.recharge_total_pp,
            access_token: existingPayment.access_token,
          },
        });
      } else if (existingPayment.status === 'failed') {
        return NextResponse.json(
          {
            success: false,
            error: '交易验证失败',
            reason: existingPayment.failure_reason,
          },
          { status: 400 }
        );
      } else {
        // pending 状态,可能正在处理
        return NextResponse.json(
          {
            success: false,
            error: '交易正在处理中,请稍后重试',
          },
          { status: 409 }
        );
      }
    }

    // ============================================
    // 3. 验证链上交易
    // ============================================
    console.log(`验证交易: ${tx_hash} on chain ${chain_id}`);

    const verificationResult = await verifyTransaction({
      txHash: tx_hash,
      chainId: chain_id,
      expectedAmountUsd: amount_usd,
    });

    if (!verificationResult.success) {
      // 验证失败,记录失败的交易
      const { data: failedPayment } = await supabaseService
        .from('web3_payments')
        .insert({
          user_id: user.id,
          payment_purpose,
          content_id: payment_purpose === 'content' ? content_id : null,
          content_type: payment_purpose === 'content' ? content_type : null,
          tx_hash,
          chain_id,
          token_symbol: verificationResult.token_symbol || 'UNKNOWN',
          amount_paid_usd: 0,
          status: 'failed',
          failure_reason: verificationResult.error,
        })
        .select()
        .single();

      return NextResponse.json(
        {
          success: false,
          error: '交易验证失败',
          reason: verificationResult.error,
          payment_id: failedPayment?.id,
        },
        { status: 400 }
      );
    }

    // ============================================
    // 4. 记录成功的支付
    // ============================================
    const paymentData: any = {
      user_id: user.id,
      payment_purpose,
      tx_hash,
      chain_id: verificationResult.chain_id,
      from_address: verificationResult.from_address,
      to_address: verificationResult.to_address,
      token_symbol: verificationResult.token_symbol,
      token_address: verificationResult.token_address,
      amount_paid_token: verificationResult.amount_token,
      amount_paid_usd: verificationResult.amount_usd,
      tx_block_number: verificationResult.block_number,
      tx_timestamp: verificationResult.timestamp,
      status: 'confirmed',
      confirmed_at: new Date().toISOString(),
    };

    // 根据支付目的添加额外字段
    if (payment_purpose === 'content') {
      paymentData.content_id = content_id;
      paymentData.content_type = content_type;
      paymentData.access_token = `access_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    } else if (payment_purpose === 'recharge') {
      // 计算充值 PP (基础 + 奖励)
      const ratio = 100; // 1 USD = 100 PP
      const basePP = Math.floor(verificationResult.amount_usd * ratio);

      // 根据充值金额计算奖励
      let bonusPercent = 0;
      if (verificationResult.amount_usd >= 100) {
        bonusPercent = 30;
      } else if (verificationResult.amount_usd >= 50) {
        bonusPercent = 20;
      } else if (verificationResult.amount_usd >= 10) {
        bonusPercent = 10;
      }

      const bonusPP = Math.floor(basePP * (bonusPercent / 100));
      const totalPP = basePP + bonusPP;

      paymentData.recharge_pp_amount = basePP;
      paymentData.recharge_bonus_pp = bonusPP;
      paymentData.recharge_total_pp = totalPP;
      paymentData.pp_credited = false; // 将由触发器自动设置为 true
    }

    const { data: payment, error: paymentError } = await supabaseService
      .from('web3_payments')
      .insert(paymentData)
      .select()
      .single();

    if (paymentError) {
      console.error('支付记录创建失败:', paymentError);
      return NextResponse.json(
        {
          success: false,
          error: '支付记录创建失败',
          details: paymentError.message,
        },
        { status: 500 }
      );
    }

    // ============================================
    // 5. 处理内容访问权限
    // ============================================
    if (payment_purpose === 'content') {
      const { error: accessError } = await supabaseService
        .from('user_content_access')
        .insert({
          user_id: user.id,
          content_id,
          content_type,
          payment_method: 'web3',
          payment_id: payment.id,
          access_token: paymentData.access_token,
          purchased_at: new Date().toISOString(),
          expires_at: null, // 永久访问
        });

      if (accessError) {
        console.error('访问权限创建失败:', accessError);
        // 不影响支付流程,只记录错误
      }

      return NextResponse.json({
        success: true,
        data: {
          payment_id: payment.id,
          status: 'confirmed',
          message: '内容已解锁',
          access_token: paymentData.access_token,
          transaction: {
            tx_hash: payment.tx_hash,
            amount_usd: payment.amount_paid_usd,
            token: payment.token_symbol,
            confirmed_at: payment.confirmed_at,
          },
        },
      });
    }

    // ============================================
    // 6. 处理充值结果
    // ============================================
    if (payment_purpose === 'recharge') {
      // 触发器会自动处理 PP 充值
      // 等待一小段时间确保触发器执行
      await new Promise((resolve) => setTimeout(resolve, 100));

      // 重新查询支付记录确认 PP 已充值
      const { data: updatedPayment } = await supabaseService
        .from('web3_payments')
        .select('*')
        .eq('id', payment.id)
        .single();

      // 查询用户当前积分
      const { data: userProfile } = await supabaseService
        .from('user_profiles')
        .select('credits')
        .eq('id', user.id)
        .single();

      return NextResponse.json({
        success: true,
        data: {
          payment_id: payment.id,
          status: 'confirmed',
          message: '充值成功',
          credits_added: updatedPayment?.recharge_total_pp || payment.recharge_total_pp,
          credits_breakdown: {
            base_pp: payment.recharge_pp_amount,
            bonus_pp: payment.recharge_bonus_pp,
            total_pp: payment.recharge_total_pp,
          },
          current_balance: userProfile?.credits || 0,
          transaction: {
            tx_hash: payment.tx_hash,
            amount_usd: payment.amount_paid_usd,
            token: payment.token_symbol,
            confirmed_at: payment.confirmed_at,
          },
        },
      });
    }

    // 不应该到达这里
    return NextResponse.json(
      {
        success: false,
        error: '未知的支付目的',
      },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Error in /api/web3/verify-transaction:', error);
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
