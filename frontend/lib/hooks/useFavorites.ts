'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from './useAuth'

export type FavoriteItemType = 'strategy' | 'provider' | 'news'

interface Favorite {
  id: string
  user_id: string
  item_type: FavoriteItemType
  item_id: string
  created_at: string
}

export function useFavorites(itemType?: FavoriteItemType) {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([])
      setLoading(false)
      return
    }

    try {
      let query = supabase
        .from('user_favorites')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (itemType) {
        query = query.eq('item_type', itemType)
      }

      const { data, error } = await query

      if (error) throw error
      setFavorites(data || [])
    } catch (error) {
      console.error('Error fetching favorites:', error)
      setFavorites([])
    } finally {
      setLoading(false)
    }
  }, [user, itemType, supabase])

  useEffect(() => {
    fetchFavorites()
  }, [fetchFavorites])

  const isFavorite = useCallback(
    (itemId: string, type: FavoriteItemType) => {
      return favorites.some(
        (fav) => fav.item_id === itemId && fav.item_type === type
      )
    },
    [favorites]
  )

  const toggleFavorite = useCallback(
    async (itemId: string, type: FavoriteItemType) => {
      if (!user) {
        // Redirect to login or show login modal
        alert('请先登录才能收藏')
        window.location.href = '/auth/login?redirect=' + encodeURIComponent(window.location.pathname)
        return
      }

      const existing = favorites.find(
        (fav) => fav.item_id === itemId && fav.item_type === type
      )

      try {
        if (existing) {
          // Remove favorite
          const { error } = await supabase
            .from('user_favorites')
            .delete()
            .eq('id', existing.id)

          if (error) {
            console.error('Error removing favorite:', error)
            alert('取消收藏失败: ' + error.message)
            throw error
          }

          setFavorites((prev) => prev.filter((fav) => fav.id !== existing.id))
          console.log('✅ 已取消收藏')
        } else {
          // Add favorite
          console.log('📝 正在添加收藏...', { user_id: user.id, item_type: type, item_id: itemId })

          const { data, error } = await supabase
            .from('user_favorites')
            .insert({
              user_id: user.id,
              item_type: type,
              item_id: itemId,
            })
            .select()
            .single()

          if (error) {
            console.error('❌ Error adding favorite:', error)
            alert('收藏失败: ' + error.message)
            throw error
          }

          console.log('✅ 收藏成功!', data)
          setFavorites((prev) => [data, ...prev])
        }
      } catch (error: any) {
        console.error('Error toggling favorite:', error)
      }
    },
    [user, favorites, supabase]
  )

  return {
    favorites,
    loading,
    isFavorite,
    toggleFavorite,
    refetch: fetchFavorites,
  }
}
