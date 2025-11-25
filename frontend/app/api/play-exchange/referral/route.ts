import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

/**
 * GET /api/play-exchange/referral
 * 获取用户的邀请信息和记录
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();

    // 验证用户身份
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({
        success: false,
        error: '未登录'
      }, { status: 401 });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return NextResponse.json({
        success: false,
        error: '身份验证失败'
      }, { status: 401 });
    }

    // 获取用户的邀请码
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('referral_code')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({
        success: false,
        error: '获取用户信息失败'
      }, { status: 500 });
    }

    // 获取邀请记录
    const { data: referrals, error: referralsError } = await supabase
      .from('referrals')
      .select(`
        id,
        referred_id,
        referral_code,
        credits_awarded,
        awarded_at,
        created_at
      `)
      .eq('referrer_id', user.id)
      .order('created_at', { ascending: false });

    if (referralsError) {
      console.error('获取邀请记录失败:', referralsError);
    }

    // 获取被邀请人的用户名
    const referredIds = referrals?.map(r => r.referred_id) || [];
    let referredUsers: any[] = [];

    if (referredIds.length > 0) {
      const { data: users, error: usersError } = await supabase
        .from('user_profiles')
        .select('id, username, display_name')
        .in('id', referredIds);

      if (!usersError && users) {
        referredUsers = users;
      }
    }

    // 合并数据
    const referralRecords = referrals?.map(referral => {
      const referredUser = referredUsers.find(u => u.id === referral.referred_id);
      return {
        ...referral,
        referred_username: referredUser?.username || referredUser?.display_name || '匿名用户',
        status: referral.credits_awarded ? 'completed' : 'pending'
      };
    }) || [];

    // 统计
    const stats = {
      total_invited: referrals?.length || 0,
      total_registered: referrals?.filter(r => r.credits_awarded).length || 0,
      total_credits_earned: referrals?.filter(r => r.credits_awarded).length || 0, // 每个成功邀请1积分
      pending_count: referrals?.filter(r => !r.credits_awarded).length || 0
    };

    // 生成邀请链接
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const referralLink = `${baseUrl}/auth/register?ref=${profile.referral_code}`;

    return NextResponse.json({
      success: true,
      data: {
        referral_code: profile.referral_code,
        referral_link: referralLink,
        stats,
        records: referralRecords
      }
    });

  } catch (error) {
    console.error('获取邀请信息失败:', error);
    return NextResponse.json({
      success: false,
      error: '服务器错误'
    }, { status: 500 });
  }
}

/**
 * POST /api/play-exchange/referral
 * 记录邀请关系（在用户注册时调用）
 *
 * Request body:
 * {
 *   "referral_code": "ABC123",
 *   "referred_user_id": "uuid"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const body = await request.json();

    const { referral_code, referred_user_id } = body;

    if (!referral_code || !referred_user_id) {
      return NextResponse.json({
        success: false,
        error: '缺少必要参数'
      }, { status: 400 });
    }

    // 查找邀请人
    const { data: referrer, error: referrerError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('referral_code', referral_code)
      .single();

    if (referrerError || !referrer) {
      return NextResponse.json({
        success: false,
        error: '邀请码无效'
      }, { status: 400 });
    }

    // 不能自己邀请自己
    if (referrer.id === referred_user_id) {
      return NextResponse.json({
        success: false,
        error: '不能使用自己的邀请码'
      }, { status: 400 });
    }

    // 检查是否已经被邀请过
    const { data: existingReferral } = await supabase
      .from('referrals')
      .select('id')
      .eq('referred_id', referred_user_id)
      .single();

    if (existingReferral) {
      return NextResponse.json({
        success: false,
        error: '该用户已经被邀请过了'
      }, { status: 400 });
    }

    // 创建邀请记录
    const { error: createError } = await supabase
      .from('referrals')
      .insert({
        referrer_id: referrer.id,
        referred_id: referred_user_id,
        referral_code: referral_code,
        credits_awarded: false // 初始为未奖励
      });

    if (createError) {
      console.error('创建邀请记录失败:', createError);
      return NextResponse.json({
        success: false,
        error: '记录邀请关系失败'
      }, { status: 500 });
    }

    // 奖励邀请人1积分
    const { data: referrerProfile } = await supabase
      .from('user_profiles')
      .select('credits')
      .eq('id', referrer.id)
      .single();

    const newCredits = (referrerProfile?.credits || 0) + 1;

    await supabase
      .from('user_profiles')
      .update({ credits: newCredits })
      .eq('id', referrer.id);

    // 更新邀请记录为已奖励
    await supabase
      .from('referrals')
      .update({
        credits_awarded: true,
        awarded_at: new Date().toISOString()
      })
      .eq('referrer_id', referrer.id)
      .eq('referred_id', referred_user_id);

    // 创建积分交易记录
    await supabase
      .from('credit_transactions')
      .insert({
        user_id: referrer.id,
        credits_change: 1,
        credits_before: referrerProfile?.credits || 0,
        credits_after: newCredits,
        transaction_type: 'referral',
        related_id: referred_user_id,
        related_type: 'user_referral',
        description: '邀请好友注册奖励'
      });

    return NextResponse.json({
      success: true,
      data: {
        message: '✅ 邀请关系已建立，邀请人获得 1 积分奖励'
      }
    });

  } catch (error) {
    console.error('处理邀请关系失败:', error);
    return NextResponse.json({
      success: false,
      error: '服务器错误'
    }, { status: 500 });
  }
}
