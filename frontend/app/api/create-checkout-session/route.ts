import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
});

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { membershipId, billingCycle, userId } = body;

    if (!membershipId || !billingCycle || !userId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // 获取会员信息
    const membershipResponse = await fetch(
      `${DIRECTUS_URL}/items/memberships/${membershipId}`
    );

    if (!membershipResponse.ok) {
      throw new Error('Failed to fetch membership');
    }

    const membershipData = await membershipResponse.json();
    const membership = membershipData.data;

    // 计算价格
    const amount =
      billingCycle === 'monthly'
        ? membership.price_monthly_usd
        : membership.price_yearly_usd;

    // 创建 Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${membership.name} 会员`,
              description:
                billingCycle === 'monthly'
                  ? '月付订阅'
                  : '年付订阅 (相当于10个月)',
              metadata: {
                membership_id: membershipId,
                membership_name: membership.name,
                membership_level: membership.level.toString(),
              },
            },
            unit_amount: Math.round(amount * 100), // Stripe 使用分作为单位
            recurring:
              billingCycle === 'monthly'
                ? {
                    interval: 'month',
                    interval_count: 1,
                  }
                : {
                    interval: 'year',
                    interval_count: 1,
                  },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?plan=${membershipId}&cycle=${billingCycle}&cancelled=true`,
      metadata: {
        userId,
        membershipId,
        billingCycle,
      },
      subscription_data: {
        metadata: {
          userId,
          membershipId,
          billingCycle,
        },
      },
      customer_email: undefined, // TODO: 可以从 Supabase 获取用户邮箱
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
