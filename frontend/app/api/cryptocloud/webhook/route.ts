import { NextRequest, NextResponse } from 'next/server';
import * as jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';

// CryptoCloud 配置
const CRYPTOCLOUD_SECRET = process.env.CRYPTOCLOUD_SECRET!;

// Supabase Admin Client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Directus 配置
const DIRECTUS_URL = process.env.DIRECTUS_URL || process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
const DIRECTUS_ADMIN_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN;

interface CryptoCloudWebhookPayload {
  status: string;
  invoice_id: string;
  amount_crypto: string;
  currency: string;
  order_id: string;
  token: string;
}

// ============================================
// 处理 PP 充值 Webhook
// ============================================
async function handleRechargeWebhook(body: CryptoCloudWebhookPayload, orderParts: string[]) {
  // 格式: recharge_{userId}_{timestamp}
  if (orderParts.length < 3) {
    console.error('[Recharge] Invalid order_id format:', body.order_id);
    return NextResponse.json({ error: 'Invalid order_id format' }, { status: 400 });
  }

  const userId = orderParts[1];

  console.log('[Recharge] Processing PP recharge:', {
    userId,
    invoiceId: body.invoice_id,
    order_id: body.order_id
  });

  try {
    // 1. 从 CryptoCloud API 获取发票详情以获得充值金额
    const invoiceResponse = await fetch(
      `https://api.cryptocloud.plus/v2/invoice/info?uuid=${body.invoice_id}`,
      {
        headers: {
          'Authorization': `Token ${process.env.CRYPTOCLOUD_API_KEY}`,
        },
      }
    );

    if (!invoiceResponse.ok) {
      console.error('[Recharge] Failed to fetch invoice details');
      return NextResponse.json({ error: 'Failed to fetch invoice details' }, { status: 500 });
    }

    const invoiceData = await invoiceResponse.json();
    const amountUSD = parseFloat(invoiceData.result?.amount || '0');

    if (amountUSD <= 0) {
      console.error('[Recharge] Invalid amount:', amountUSD);
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    console.log('[Recharge] Amount USD:', amountUSD);

    // 2. 计算 PP 数量 (1 USD = 100 PP, 根据档位加奖励)
    const { basePP, bonusPP, totalPP } = calculatePPReward(amountUSD);

    console.log('[Recharge] PP Calculation:', { basePP, bonusPP, totalPP });

    // 3. 更新用户 PP 余额
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('credits')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('[Recharge] Failed to get user profile:', profileError);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const currentBalance = userProfile?.credits || 0;
    const newBalance = currentBalance + totalPP;

    // 更新余额
    const { error: updateError } = await supabaseAdmin
      .from('user_profiles')
      .update({
        credits: newBalance,
        total_credits_earned: supabaseAdmin.from('user_profiles').select('total_credits_earned'),
        total_recharged_usd: supabaseAdmin.from('user_profiles').select('total_recharged_usd'),
        last_recharge_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (updateError) {
      console.error('[Recharge] Failed to update balance:', updateError);
      return NextResponse.json({ error: 'Failed to update balance' }, { status: 500 });
    }

    // 4. 记录交易
    const { error: txError } = await supabaseAdmin
      .from('credit_transactions')
      .insert({
        user_id: userId,
        type: 'crypto_recharge',
        amount: totalPP,
        balance_after: newBalance,
        description: `加密货币充值 $${amountUSD} (基础 ${basePP} PP + 奖励 ${bonusPP} PP)`,
        metadata: {
          invoice_id: body.invoice_id,
          order_id: body.order_id,
          amount_usd: amountUSD,
          amount_crypto: body.amount_crypto,
          crypto_currency: body.currency,
          base_pp: basePP,
          bonus_pp: bonusPP,
          payment_method: 'cryptocloud',
        },
      });

    if (txError) {
      console.error('[Recharge] Failed to record transaction:', txError);
    }

    // 5. 记录支付到 payments 表
    const { error: paymentError } = await supabaseAdmin
      .from('payments')
      .insert({
        user_id: userId,
        amount: amountUSD,
        currency: 'USD',
        status: 'completed',
        payment_method: 'cryptocloud',
        payment_id: body.invoice_id,
        metadata: {
          invoice_id: body.invoice_id,
          order_id: body.order_id,
          amount_crypto: body.amount_crypto,
          crypto_currency: body.currency,
          pp_earned: totalPP,
          base_pp: basePP,
          bonus_pp: bonusPP,
        }
      });

    if (paymentError) {
      console.error('[Recharge] Failed to record payment:', paymentError);
    }

    console.log('[Recharge] Successfully processed:', {
      userId,
      amountUSD,
      ppEarned: totalPP,
      newBalance,
    });

    return NextResponse.json({
      success: true,
      message: 'Recharge processed successfully',
      data: {
        amount_usd: amountUSD,
        pp_earned: totalPP,
        new_balance: newBalance,
      }
    });

  } catch (error: any) {
    console.error('[Recharge] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================
// 处理会员购买 Webhook
// ============================================
async function handleMembershipWebhook(body: CryptoCloudWebhookPayload, orderParts: string[]) {
  // 格式: membership_{userId}_{membershipId}_{timestamp}
  if (orderParts.length < 4) {
    console.error('[Membership] Invalid order_id format:', body.order_id);
    return NextResponse.json({ error: 'Invalid order_id format' }, { status: 400 });
  }

  const userId = orderParts[1];
  const membershipId = orderParts[2];

  // 获取会员信息
  const membershipInfo = getMembershipInfo(membershipId);
  if (!membershipInfo) {
    console.error('[Membership] Invalid membership ID:', membershipId);
    return NextResponse.json({ error: 'Invalid membership ID' }, { status: 400 });
  }

  console.log('[Membership] Processing membership purchase:', {
    userId,
    membershipId,
    membershipInfo,
    invoiceId: body.invoice_id
  });

  try {
    // 1. 查询用户信息
    const { data: { user: authUser }, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId);

    if (userError) {
      console.error('[Membership] Failed to get user:', userError);
    }
    const userEmail = authUser?.email || '';

    // 2. 计算会员到期时间 (1年)
    const now = new Date();
    const endDate = new Date(now);
    endDate.setFullYear(endDate.getFullYear() + 1);

    // 3. 记录支付到 Supabase
    const { error: paymentError } = await supabaseAdmin
      .from('payments')
      .insert({
        user_id: userId,
        amount: membershipInfo.amount,
        currency: 'USD',
        status: 'completed',
        payment_method: 'cryptocloud',
        payment_id: body.invoice_id,
        metadata: {
          invoice_id: body.invoice_id,
          order_id: body.order_id,
          amount_crypto: body.amount_crypto,
          crypto_currency: body.currency,
          membership_id: membershipId,
          membership_name: membershipInfo.name,
        }
      });

    if (paymentError) {
      console.error('[Membership] Failed to record payment:', paymentError);
    }

    // 4. 更新用户会员状态到 Directus
    if (DIRECTUS_ADMIN_TOKEN) {
      try {
        const checkResponse = await fetch(
          `${DIRECTUS_URL}/items/user_subscriptions?filter[user_id][_eq]=${userId}`,
          {
            headers: {
              'Authorization': `Bearer ${DIRECTUS_ADMIN_TOKEN}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const existingData = await checkResponse.json();

        if (existingData.data && existingData.data.length > 0) {
          const subscriptionId = existingData.data[0].id;
          await fetch(
            `${DIRECTUS_URL}/items/user_subscriptions/${subscriptionId}`,
            {
              method: 'PATCH',
              headers: {
                'Authorization': `Bearer ${DIRECTUS_ADMIN_TOKEN}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                membership_id: membershipInfo.directus_id,
                status: 'active',
                billing_cycle: 'yearly',
                payment_method: 'cryptocloud',
                amount_paid: membershipInfo.amount,
                crypto_payment_id: body.invoice_id,
                start_date: now.toISOString(),
                end_date: endDate.toISOString(),
                auto_renew: false,
              }),
            }
          );
          console.log('[Membership] Updated subscription in Directus');
        } else {
          await fetch(
            `${DIRECTUS_URL}/items/user_subscriptions`,
            {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${DIRECTUS_ADMIN_TOKEN}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                user_id: userId,
                membership_id: membershipInfo.directus_id,
                status: 'active',
                billing_cycle: 'yearly',
                payment_method: 'cryptocloud',
                amount_paid: membershipInfo.amount,
                crypto_payment_id: body.invoice_id,
                start_date: now.toISOString(),
                end_date: endDate.toISOString(),
                auto_renew: false,
              }),
            }
          );
          console.log('[Membership] Created subscription in Directus');
        }
      } catch (directusError) {
        console.error('[Membership] Failed to update Directus:', directusError);
      }
    }

    console.log('[Membership] Successfully processed:', {
      userId,
      userEmail,
      membershipId,
      membershipName: membershipInfo.name,
      invoiceId: body.invoice_id,
      endDate: endDate.toISOString()
    });

    return NextResponse.json({
      success: true,
      message: 'Membership payment processed successfully'
    });

  } catch (error: any) {
    console.error('[Membership] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================
// 主 Webhook 处理函数
// ============================================
export async function POST(request: NextRequest) {
  try {
    // CryptoCloud 发送的是 URL-encoded 格式，不是 JSON
    const contentType = request.headers.get('content-type') || '';
    let body: CryptoCloudWebhookPayload;

    if (contentType.includes('application/x-www-form-urlencoded')) {
      const text = await request.text();
      const params = new URLSearchParams(text);
      body = {
        status: params.get('status') || '',
        invoice_id: params.get('invoice_id') || '',
        amount_crypto: params.get('amount_crypto') || '',
        currency: params.get('currency') || '',
        order_id: params.get('order_id') || '',
        token: params.get('token') || '',
      };
    } else {
      body = await request.json() as CryptoCloudWebhookPayload;
    }

    console.log('CryptoCloud webhook received:', JSON.stringify(body, null, 2));

    // 验证 JWT token
    if (!body.token) {
      console.error('Missing token in webhook payload');
      return NextResponse.json({ error: 'Missing token' }, { status: 400 });
    }

    try {
      // 验证 token (使用 HS256 算法)
      const decoded = jwt.verify(body.token, CRYPTOCLOUD_SECRET, {
        algorithms: ['HS256']
      });
      console.log('Token verified successfully:', decoded);
    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // 检查支付状态
    if (body.status !== 'success') {
      console.log('Payment not successful, status:', body.status);
      return NextResponse.json({ message: 'Payment not successful' });
    }

    // 解析 order_id 判断是会员购买还是 PP 充值
    const orderParts = body.order_id.split('_');
    const orderType = orderParts[0];

    if (orderType === 'recharge') {
      return await handleRechargeWebhook(body, orderParts);
    } else if (orderType === 'membership') {
      return await handleMembershipWebhook(body, orderParts);
    } else {
      console.error('Invalid order_id format:', body.order_id);
      return NextResponse.json({ error: 'Invalid order_id format' }, { status: 400 });
    }

  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================
// 辅助函数
// ============================================

// 计算 PP 奖励
function calculatePPReward(amountUSD: number): { basePP: number; bonusPP: number; totalPP: number } {
  const ratio = 100; // 1 USD = 100 PP
  const basePP = Math.floor(amountUSD * ratio);

  // 根据充值档位给予奖励
  let bonusPercent = 0;
  if (amountUSD >= 100) {
    bonusPercent = 30;
  } else if (amountUSD >= 50) {
    bonusPercent = 20;
  } else if (amountUSD >= 10) {
    bonusPercent = 10;
  }

  const bonusPP = Math.floor(basePP * (bonusPercent / 100));
  const totalPP = basePP + bonusPP;

  return { basePP, bonusPP, totalPP };
}

// 获取会员信息
function getMembershipInfo(membershipId: string): { amount: number; name: string; level: number; directus_id: number } | null {
  const memberships: Record<string, { amount: number; name: string; level: number; directus_id: number }> = {
    'pro': { amount: 699, name: 'Pro', level: 1, directus_id: 2 },
    'max': { amount: 1299, name: 'Max', level: 2, directus_id: 3 }
  };

  return memberships[membershipId] || null;
}

// 允许 GET 请求用于测试
export async function GET() {
  return NextResponse.json({
    message: 'CryptoCloud webhook endpoint',
    status: 'active'
  });
}
