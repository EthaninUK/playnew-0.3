import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// CryptoCloud API 配置
const CRYPTOCLOUD_API_URL = 'https://api.cryptocloud.plus/v2';
const CRYPTOCLOUD_API_KEY = process.env.CRYPTOCLOUD_API_KEY!;
const CRYPTOCLOUD_SHOP_ID = process.env.CRYPTOCLOUD_SHOP_ID!;

// 会员方案价格映射（年付，美元）
const MEMBERSHIP_PRICES: Record<string, { amount: number; name: string; level: number }> = {
  'pro': {
    amount: 699,
    name: 'Pro',
    level: 1
  },
  'max': {
    amount: 1299,
    name: 'Max',
    level: 2
  }
};

export async function POST(request: NextRequest) {
  try {
    const { membershipId } = await request.json();

    // 验证用户登录
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 验证会员方案
    const priceInfo = MEMBERSHIP_PRICES[membershipId];
    if (!priceInfo) {
      return NextResponse.json(
        { error: 'Invalid membership plan' },
        { status: 400 }
      );
    }

    // 生成唯一订单号
    const orderId = `membership_${user.id}_${membershipId}_${Date.now()}`;

    // 调用 CryptoCloud API 创建发票
    const invoiceResponse = await fetch(`${CRYPTOCLOUD_API_URL}/invoice/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${CRYPTOCLOUD_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        shop_id: CRYPTOCLOUD_SHOP_ID,
        amount: priceInfo.amount.toString(),
        currency: 'USD',
        order_id: orderId,
        email: user.email || undefined,
      }),
    });

    const invoiceData = await invoiceResponse.json();

    if (!invoiceResponse.ok || invoiceData.status === 'error') {
      console.error('CryptoCloud API error:', invoiceData);
      return NextResponse.json(
        { error: invoiceData.error || 'Failed to create invoice' },
        { status: 500 }
      );
    }

    // 返回支付链接
    // CryptoCloud 返回格式: { status: "success", result: { uuid, link, ... } }
    return NextResponse.json({
      success: true,
      data: {
        invoice_id: invoiceData.result?.uuid || invoiceData.result?.invoice_id,
        payment_url: invoiceData.result?.link || invoiceData.result?.pay_url,
        amount: priceInfo.amount,
        currency: 'USD',
        order_id: orderId,
        membership_name: priceInfo.name,
      }
    });

  } catch (error: any) {
    console.error('Error creating CryptoCloud invoice:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create invoice' },
      { status: 500 }
    );
  }
}