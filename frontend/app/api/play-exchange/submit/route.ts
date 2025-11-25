import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

interface SubmitRequest {
  title: string;
  category: string;
  content: string;
}

/**
 * POST /api/play-exchange/submit
 * 提交玩法审核
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const body: SubmitRequest = await request.json();

    const { title, category, content } = body;

    // 验证参数
    if (!title || !category || !content) {
      return NextResponse.json({
        success: false,
        error: '请填写完整信息'
      }, { status: 400 });
    }

    if (title.length < 5 || title.length > 200) {
      return NextResponse.json({
        success: false,
        error: '标题长度应在 5-200 字之间'
      }, { status: 400 });
    }

    if (content.length < 50) {
      return NextResponse.json({
        success: false,
        error: '内容至少需要 50 字，请提供详细的操作步骤'
      }, { status: 400 });
    }

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

    // 检查是否有未审核的提交（限制：最多3个pending状态）
    const { data: pendingSubmissions, error: countError } = await supabase
      .from('user_submitted_plays')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'pending');

    if (countError) {
      console.error('查询待审核提交失败:', countError);
    }

    if (pendingSubmissions && pendingSubmissions.length >= 3) {
      return NextResponse.json({
        success: false,
        error: '您有太多待审核的提交，请等待审核完成后再提交'
      }, { status: 400 });
    }

    // 创建提交记录
    const { data: submission, error: submitError } = await supabase
      .from('user_submitted_plays')
      .insert({
        user_id: user.id,
        title,
        category,
        content,
        status: 'pending'
      })
      .select()
      .single();

    if (submitError) {
      console.error('创建提交记录失败:', submitError);
      return NextResponse.json({
        success: false,
        error: '提交失败，请稍后重试'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: {
        submission_id: submission.id,
        status: 'pending',
        message: '✅ 提交成功！管理员将在 24 小时内审核，审核通过后积分将自动发放到您的账户'
      }
    });

  } catch (error) {
    console.error('提交玩法失败:', error);
    return NextResponse.json({
      success: false,
      error: '服务器错误'
    }, { status: 500 });
  }
}

/**
 * GET /api/play-exchange/submit
 * 获取用户的提交记录
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

    // 获取用户的提交记录
    const { data: submissions, error: fetchError } = await supabase
      .from('user_submitted_plays')
      .select('id, title, category, content, status, credits_awarded, review_notes, created_at, reviewed_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('获取提交记录失败:', fetchError);
      return NextResponse.json({
        success: false,
        error: '获取记录失败'
      }, { status: 500 });
    }

    // 统计各状态数量
    const stats = {
      total: submissions?.length || 0,
      pending: submissions?.filter(s => s.status === 'pending').length || 0,
      approved: submissions?.filter(s => s.status === 'approved').length || 0,
      rejected: submissions?.filter(s => s.status === 'rejected').length || 0,
      total_credits_earned: submissions
        ?.filter(s => s.status === 'approved')
        .reduce((sum, s) => sum + (s.credits_awarded || 0), 0) || 0
    };

    return NextResponse.json({
      success: true,
      data: {
        submissions,
        stats
      }
    });

  } catch (error) {
    console.error('获取提交记录失败:', error);
    return NextResponse.json({
      success: false,
      error: '服务器错误'
    }, { status: 500 });
  }
}
