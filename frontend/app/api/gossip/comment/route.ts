import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { newsId, content } = await request.json();

    if (!newsId || !content) {
      return NextResponse.json(
        { error: 'News ID and content are required' },
        { status: 400 }
      );
    }

    if (content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Comment content cannot be empty' },
        { status: 400 }
      );
    }

    if (content.length > 500) {
      return NextResponse.json(
        { error: 'Comment is too long (max 500 characters)' },
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

    // Add comment interaction
    const { data: interaction, error: insertError } = await supabase
      .from('gossip_interactions')
      .insert({
        news_id: newsId,
        user_id: user.id,
        interaction_type: 'comment',
        content: content.trim(),
      })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    // Increment comments_count
    const { data: newsData } = await supabase
      .from('news')
      .select('comments_count')
      .eq('id', newsId)
      .single();

    const newCount = (newsData?.comments_count || 0) + 1;

    await supabase
      .from('news')
      .update({ comments_count: newCount })
      .eq('id', newsId);

    return NextResponse.json({
      success: true,
      comment: interaction,
      comments_count: newCount,
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    return NextResponse.json(
      { error: 'Failed to add comment' },
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

    // Get all comments for this news
    const { data: comments, error } = await supabase
      .from('gossip_interactions')
      .select('*')
      .eq('news_id', newsId)
      .eq('interaction_type', 'comment')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      comments: comments || [],
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}
