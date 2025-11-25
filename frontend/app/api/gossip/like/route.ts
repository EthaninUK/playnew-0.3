import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { newsId } = await request.json();

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

    // Check if user already liked this gossip
    const { data: existingLike } = await supabase
      .from('gossip_interactions')
      .select('id')
      .eq('news_id', newsId)
      .eq('user_id', user.id)
      .eq('interaction_type', 'like')
      .single();

    if (existingLike) {
      // Unlike: remove the interaction
      await supabase
        .from('gossip_interactions')
        .delete()
        .eq('id', existingLike.id);

      // Decrement likes_count
      const { data: newsData } = await supabase
        .from('news')
        .select('likes_count')
        .eq('id', newsId)
        .single();

      const newCount = Math.max(0, (newsData?.likes_count || 0) - 1);

      await supabase
        .from('news')
        .update({ likes_count: newCount })
        .eq('id', newsId);

      return NextResponse.json({
        success: true,
        liked: false,
        likes_count: newCount,
      });
    } else {
      // Like: add the interaction
      await supabase.from('gossip_interactions').insert({
        news_id: newsId,
        user_id: user.id,
        interaction_type: 'like',
      });

      // Increment likes_count
      const { data: newsData } = await supabase
        .from('news')
        .select('likes_count')
        .eq('id', newsId)
        .single();

      const newCount = (newsData?.likes_count || 0) + 1;

      await supabase
        .from('news')
        .update({ likes_count: newCount })
        .eq('id', newsId);

      return NextResponse.json({
        success: true,
        liked: true,
        likes_count: newCount,
      });
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    return NextResponse.json(
      { error: 'Failed to toggle like' },
      { status: 500 }
    );
  }
}
