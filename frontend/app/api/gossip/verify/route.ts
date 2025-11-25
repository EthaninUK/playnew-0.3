import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { newsId, content, evidence } = await request.json();

    if (!newsId) {
      return NextResponse.json(
        { error: 'News ID is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if user already submitted verification for this gossip
    const { data: existingVerification } = await supabase
      .from('gossip_interactions')
      .select('id')
      .eq('news_id', newsId)
      .eq('user_id', user.id)
      .eq('interaction_type', 'verify')
      .single();

    if (existingVerification) {
      return NextResponse.json(
        { error: 'You have already submitted verification for this gossip' },
        { status: 400 }
      );
    }

    // Prepare verification data
    const verificationData: any = {
      news_id: newsId,
      user_id: user.id,
      interaction_type: 'verify',
    };

    if (content && content.trim().length > 0) {
      verificationData.content = content.trim();
    }

    if (evidence && evidence.trim().length > 0) {
      verificationData.evidence_url = evidence.trim();
    }

    // Add verification interaction
    const { data: interaction, error: insertError } = await supabase
      .from('gossip_interactions')
      .insert(verificationData)
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    // Update news verification status to 'verifying' if it's currently 'unverified'
    const { data: newsData } = await supabase
      .from('news')
      .select('verification_status')
      .eq('id', newsId)
      .single();

    if (newsData?.verification_status === 'unverified') {
      await supabase
        .from('news')
        .update({ verification_status: 'verifying' })
        .eq('id', newsId);
    }

    return NextResponse.json({
      success: true,
      verification: interaction,
      message: 'Verification submitted successfully',
    });
  } catch (error) {
    console.error('Error submitting verification:', error);
    return NextResponse.json(
      { error: 'Failed to submit verification' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const newsId = searchParams.get('newsId');

    if (!newsId) {
      return NextResponse.json(
        { error: 'News ID is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get all verifications for this news
    const { data: verifications, error } = await supabase
      .from('gossip_interactions')
      .select('*')
      .eq('news_id', newsId)
      .eq('interaction_type', 'verify')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      verifications: verifications || [],
    });
  } catch (error) {
    console.error('Error fetching verifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch verifications' },
      { status: 500 }
    );
  }
}
