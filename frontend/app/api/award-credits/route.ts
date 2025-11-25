import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { submissionId } = await request.json();

    if (!submissionId) {
      return NextResponse.json({ error: 'Missing submissionId' }, { status: 400 });
    }

    const supabase = await createClient();

    // 1. 获取提交记录
    const { data: submission, error: submissionError } = await supabase
      .from('user_submitted_plays')
      .select('*')
      .eq('id', submissionId)
      .single();

    if (submissionError || !submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    // 2. 只有 approved 状态才发放积分
    if (submission.status !== 'approved') {
      return NextResponse.json({ error: 'Submission not approved' }, { status: 400 });
    }

    // 3. 检查是否已经发放过积分（防止重复发放）
    if (submission.credits_awarded_at) {
      return NextResponse.json({ message: 'Credits already awarded', alreadyAwarded: true });
    }

    // 4. 获取用户当前积分
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('credits')
      .eq('id', submission.user_id)
      .single();

    if (profileError) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    const currentCredits = profile?.credits || 0;
    const creditsToAward = submission.credits_awarded || 0;
    const newCredits = currentCredits + creditsToAward;

    // 5. 更新用户积分
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({ credits: newCredits })
      .eq('id', submission.user_id);

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update credits' }, { status: 500 });
    }

    // 6. 标记积分已发放
    await supabase
      .from('user_submitted_plays')
      .update({ credits_awarded_at: new Date().toISOString() })
      .eq('id', submissionId);

    return NextResponse.json({
      success: true,
      creditsAwarded: creditsToAward,
      previousCredits: currentCredits,
      newCredits: newCredits,
    });

  } catch (error: any) {
    console.error('Award credits error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
