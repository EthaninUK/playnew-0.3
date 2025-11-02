import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET - Get user's interactions or content's interaction counts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const contentType = searchParams.get('contentType');
  const contentId = searchParams.get('contentId');
  const userId = searchParams.get('userId');

  const supabase = await createClient();

  try {
    // If contentId is provided, get interaction counts for that content
    if (contentId && contentType) {
      const { data, error } = await supabase
        .from('user_interactions')
        .select('action, user_id')
        .eq('content_type', contentType)
        .eq('content_id', contentId);

      if (error) throw error;

      // Count interactions by type
      const counts = {
        likes: data?.filter(i => i.action === 'like').length || 0,
        favorites: data?.filter(i => i.action === 'favorite').length || 0,
        views: data?.filter(i => i.action === 'view').length || 0,
      };

      // Check if current user has interacted
      const { data: { user } } = await supabase.auth.getUser();
      const userInteractions = user ? data?.filter(i => i.user_id === user.id).map(i => i.action) || [] : [];

      return NextResponse.json({
        counts,
        userInteractions,
      });
    }

    // If userId is provided, get user's interactions
    if (userId) {
      const { data, error } = await supabase
        .from('user_interactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return NextResponse.json({ interactions: data });
    }

    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Add an interaction
export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { contentType, contentId, action, metadata } = body;

    if (!contentType || !contentId || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Insert interaction (will fail if duplicate due to unique constraint)
    const { data, error } = await supabase
      .from('user_interactions')
      .insert({
        user_id: user.id,
        content_type: contentType,
        content_id: contentId,
        action,
        metadata: metadata || {},
      })
      .select()
      .single();

    if (error) {
      // If duplicate, return existing interaction
      if (error.code === '23505') {
        return NextResponse.json({ 
          message: 'Already exists',
          exists: true 
        }, { status: 200 });
      }
      throw error;
    }

    return NextResponse.json({ data, success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Remove an interaction
export async function DELETE(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const contentType = searchParams.get('contentType');
    const contentId = searchParams.get('contentId');
    const action = searchParams.get('action');

    if (!contentType || !contentId || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { error } = await supabase
      .from('user_interactions')
      .delete()
      .eq('user_id', user.id)
      .eq('content_type', contentType)
      .eq('content_id', contentId)
      .eq('action', action);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
