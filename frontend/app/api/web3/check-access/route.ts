/**
 * GET /api/web3/check-access
 * 检查用户对特定内容的访问权限
 *
 * 返回:
 * - has_access: 是否有访问权限
 * - access_method: 访问方式 (free, playpass, web3, max_member)
 * - payment_info: 如果需要付费,返回支付信息
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getContentPricing } from '@/lib/web3/config-helper';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const contentId = searchParams.get('content_id');
    const contentType = searchParams.get('content_type');

    // 验证参数
    if (!contentId || !contentType) {
      return NextResponse.json(
        {
          success: false,
          error: '缺少必要参数: content_id, content_type',
        },
        { status: 400 }
      );
    }

    // ============================================
    // 1. 获取用户信息
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

    // 未登录用户
    if (authError || !user) {
      return NextResponse.json({
        success: true,
        data: {
          has_access: false,
          reason: 'not_logged_in',
          message: '请先登录',
          requires_login: true,
        },
      });
    }

    // ============================================
    // 2. 检查内容是否免费
    // ============================================
    const pricing = await getContentPricing(contentType);

    if (pricing && pricing.price_usd === 0 && pricing.price_pp === 0) {
      return NextResponse.json({
        success: true,
        data: {
          has_access: true,
          access_method: 'free',
          reason: 'free_content',
          message: '免费内容',
        },
      });
    }

    // ============================================
    // 3. 检查是否为 MAX 会员
    // ============================================
    // 使用 service role key 查询 user_playpass
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

    const { data: userPP } = await supabaseService
      .from('user_playpass')
      .select('is_max_member')
      .eq('user_id', user.id)
      .single();

    if (userPP?.is_max_member) {
      return NextResponse.json({
        success: true,
        data: {
          has_access: true,
          access_method: 'max_member',
          reason: 'max_member',
          message: 'MAX 会员拥有全站访问权限',
        },
      });
    }

    // ============================================
    // 4. 检查是否已购买 (Web3 或 PlayPass)
    // ============================================
    const { data: access } = await supabaseService
      .from('user_content_access')
      .select('*')
      .eq('user_id', user.id)
      .eq('content_id', contentId)
      .eq('content_type', contentType)
      .single();

    if (access) {
      // 检查是否过期
      if (!access.expires_at || new Date(access.expires_at) > new Date()) {
        return NextResponse.json({
          success: true,
          data: {
            has_access: true,
            access_method: access.payment_method,
            reason: 'purchased',
            message: '内容已解锁',
            purchased_at: access.purchased_at,
            expires_at: access.expires_at,
          },
        });
      } else {
        // 已过期
        return NextResponse.json({
          success: true,
          data: {
            has_access: false,
            reason: 'expired',
            message: '访问权限已过期',
            expired_at: access.expires_at,
          },
        });
      }
    }

    // ============================================
    // 5. 无访问权限,返回支付信息
    // ============================================

    // 获取用户 PP 余额
    const { data: userProfile } = await supabaseService
      .from('user_profiles')
      .select('credits')
      .eq('id', user.id)
      .single();

    const userCredits = userProfile?.credits || 0;

    // 检查 PP 是否充足
    const ppPrice = pricing?.price_pp || 0;
    const hasSufficientPP = userCredits >= ppPrice;

    return NextResponse.json({
      success: true,
      data: {
        has_access: false,
        reason: 'payment_required',
        message: '此内容需要付费访问',
        pricing: {
          price_usd: pricing?.price_usd || 0,
          price_pp: ppPrice,
        },
        user_info: {
          credits: userCredits,
          has_sufficient_pp: hasSufficientPP,
          pp_shortage: hasSufficientPP ? 0 : ppPrice - userCredits,
        },
        payment_options: [
          {
            method: 'playpass',
            available: hasSufficientPP,
            price: ppPrice,
            label: `使用 ${ppPrice} PP 解锁`,
          },
          {
            method: 'web3',
            available: true,
            price: pricing?.price_usd || 0,
            label: `使用 Web3 支付 $${pricing?.price_usd || 0}`,
          },
        ],
      },
    });
  } catch (error: any) {
    console.error('Error in /api/web3/check-access:', error);
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
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
