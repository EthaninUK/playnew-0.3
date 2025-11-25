import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// CryptoCloud API 配置
const CRYPTOCLOUD_API_URL = 'https://api.cryptocloud.plus/v2/invoice/create';
const CRYPTOCLOUD_API_KEY = process.env.CRYPTOCLOUD_API_KEY;
const CRYPTOCLOUD_SHOP_ID = process.env.CRYPTOCLOUD_SHOP_ID;

/**
 * POST /api/cryptocloud/create-recharge-invoice
 * 创建 CryptoCloud PP 充值订单
 */
export async function POST(request: NextRequest) {
  try {
    console.log('[CryptoCloud Recharge] Creating invoice...');

    const body = await request.json();
    const { amount_usd } = body;

    // 验证参数
    if (!amount_usd || amount_usd < 1) {
      return NextResponse.json(
        { error: '充值金额必须至少为 $1' },
        { status: 400 }
      );
    }

    // 获取登录用户
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

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('[CryptoCloud Recharge] User:', user.email, 'Amount:', amount_usd);

    // 检查 API 配置
    if (!CRYPTOCLOUD_API_KEY || !CRYPTOCLOUD_SHOP_ID) {
      console.error('[CryptoCloud Recharge] Missing API configuration');
      return NextResponse.json(
        { error: 'CryptoCloud 配置错误' },
        { status: 500 }
      );
    }

    // 创建订单ID (格式: recharge_{userId}_{timestamp})
    const orderId = `recharge_${user.id}_${Date.now()}`;

    // 调用 CryptoCloud API 创建发票
    const invoiceData = {
      shop_id: CRYPTOCLOUD_SHOP_ID,
      amount: amount_usd.toString(),
      currency: 'USD',
      order_id: orderId,
      email: user.email || undefined,
    };

    console.log('[CryptoCloud Recharge] Creating invoice:', JSON.stringify(invoiceData, null, 2));

    const response = await fetch(CRYPTOCLOUD_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${CRYPTOCLOUD_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invoiceData),
    });

    const responseText = await response.text();
    console.log('[CryptoCloud Recharge] API Response:', response.status, responseText);

    if (!response.ok) {
      console.error('[CryptoCloud Recharge] API Error:', responseText);
      return NextResponse.json(
        { error: 'Failed to create invoice', details: responseText },
        { status: response.status }
      );
    }

    const result = JSON.parse(responseText);

    if (!result.status || result.status !== 'success') {
      console.error('[CryptoCloud Recharge] Invoice creation failed:', result);
      return NextResponse.json(
        { error: result.message || 'Failed to create invoice' },
        { status: 400 }
      );
    }

    console.log('[CryptoCloud Recharge] Invoice created successfully:', result.result?.uuid);

    // 返回支付链接和发票信息
    return NextResponse.json({
      success: true,
      invoice_id: result.result?.uuid,
      pay_url: result.result?.link,
      amount: amount_usd,
      order_id: orderId,
    });

  } catch (error: any) {
    console.error('[CryptoCloud Recharge] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'CryptoCloud Recharge Invoice API',
    status: 'active'
  });
}
