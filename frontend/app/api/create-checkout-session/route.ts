import { NextRequest, NextResponse } from 'next/server';

// ============================================================================
// Stripe 支付已禁用
// ============================================================================
// 本项目已改用 CryptoCloud 加密货币支付
// 相关 API: /api/cryptocloud/*
// ============================================================================

export async function POST() {
  return NextResponse.json(
    {
      error: 'Stripe payment is disabled',
      message: 'Please use CryptoCloud payment instead',
      redirect: '/pricing'
    },
    { status: 410 } // 410 Gone - 资源已永久删除
  );
}