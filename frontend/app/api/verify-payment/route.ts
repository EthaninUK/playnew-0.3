import { NextRequest, NextResponse } from 'next/server';

// 会员功能已暂停
export async function GET(request: NextRequest) {
  return NextResponse.json(
    { error: 'Membership feature is temporarily disabled' },
    { status: 503 }
  );
}

/* 原始 Stripe 支付验证代码已注释
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
});

export async function GET(request: NextRequest) {
  ... (原始代码已省略)
}
*/
