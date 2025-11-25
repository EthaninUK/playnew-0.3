import { NextRequest, NextResponse } from 'next/server';

// 会员功能已暂停 - Stripe webhook 已禁用
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'Membership feature is temporarily disabled' },
    { status: 503 }
  );
}

/* 原始 Stripe Webhook 处理代码已注释
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
});

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';
const DIRECTUS_ADMIN_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN;

export async function POST(request: NextRequest) {
  ... (原始代码已省略 - 处理 Stripe 支付事件)
}
*/
