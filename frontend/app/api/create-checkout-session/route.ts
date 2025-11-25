import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

// 会员方案价格映射（年付）
const MEMBERSHIP_PRICES: Record<string, { amount: number; name: string; level: number }> = {
  'pro': {
    amount: 69900, // $699 in cents
    name: 'Pro',
    level: 1
  },
  'max': {
    amount: 129900, // $1299 in cents
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

    // 创建 Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `PlayNew ${priceInfo.name} Membership`,
              description: `${priceInfo.name} 会员 - 年度订阅`,
            },
            unit_amount: priceInfo.amount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: user.id,
        userEmail: user.email || '',
        membershipId: membershipId,
        membershipLevel: priceInfo.level.toString(),
        membershipName: priceInfo.name,
      },
      customer_email: user.email || undefined,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/pricing?canceled=true`,
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
