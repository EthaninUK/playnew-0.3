'use client';

import { useState, useEffect } from 'react';
import { Heart, Bookmark, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useViewCount } from '@/hooks/useViewCount';

interface InteractionButtonsProps {
  contentType: 'strategy' | 'news' | 'provider';
  contentId: string;
  className?: string;
}

export function InteractionButtons({ contentType, contentId, className = '' }: InteractionButtonsProps) {
  const { user } = useAuth();
  const router = useRouter();
  const { viewCount } = useViewCount(contentId, contentType);

  const [counts, setCounts] = useState({ likes: 0, favorites: 0 });
  const [userInteractions, setUserInteractions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchInteractions();
  }, [contentId, contentType]);

  const fetchInteractions = async () => {
    try {
      const res = await fetch(`/api/interactions?contentType=${contentType}&contentId=${contentId}`);
      const data = await res.json();

      if (data.counts) setCounts(data.counts);
      if (data.userInteractions) setUserInteractions(data.userInteractions);
    } catch (error) {
      console.error('Failed to fetch interactions:', error);
    }
  };

  const handleInteraction = async (action: 'like' | 'favorite') => {
    if (!user) {
      toast.error('请先登录');
      const currentPath = window.location.pathname;
      router.push(`/auth/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }

    setLoading(true);

    try {
      const isActive = userInteractions.includes(action);

      if (isActive) {
        const res = await fetch(
          `/api/interactions?contentType=${contentType}&contentId=${contentId}&action=${action}`,
          { method: 'DELETE' }
        );

        if (!res.ok) throw new Error('Failed to remove');

        setUserInteractions(prev => prev.filter(a => a !== action));
        setCounts(prev => ({
          ...prev,
          [action === 'like' ? 'likes' : 'favorites']: Math.max(0, prev[action === 'like' ? 'likes' : 'favorites'] - 1),
        }));

        toast.success(action === 'like' ? '已取消点赞' : '已取消收藏');
      } else {
        const res = await fetch('/api/interactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contentType, contentId, action }),
        });

        if (!res.ok) throw new Error('Failed to add');

        setUserInteractions(prev => [...prev, action]);
        setCounts(prev => ({
          ...prev,
          [action === 'like' ? 'likes' : 'favorites']: prev[action === 'like' ? 'likes' : 'favorites'] + 1,
        }));

        toast.success(action === 'like' ? '点赞成功' : '收藏成功');
      }
    } catch (error) {
      toast.error('操作失败');
    } finally {
      setLoading(false);
    }
  };

  const isLiked = userInteractions.includes('like');
  const isFavorited = userInteractions.includes('favorite');

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        variant={isLiked ? 'default' : 'outline'}
        size="sm"
        onClick={() => handleInteraction('like')}
        disabled={loading}
        className="gap-1.5"
      >
        <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
        <span className="text-sm">{counts.likes}</span>
      </Button>

      <Button
        variant={isFavorited ? 'default' : 'outline'}
        size="sm"
        onClick={() => handleInteraction('favorite')}
        disabled={loading}
        className="gap-1.5"
      >
        <Bookmark className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
        <span className="text-sm">{counts.favorites}</span>
      </Button>

      <div className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground">
        <Eye className="h-4 w-4" />
        <span>{viewCount}</span>
      </div>
    </div>
  );
}
