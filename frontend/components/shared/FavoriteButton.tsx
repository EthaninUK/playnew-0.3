'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useFavorites, type FavoriteItemType } from '@/lib/hooks/useFavorites'
import { cn } from '@/lib/utils'

interface FavoriteButtonProps {
  itemId: string
  itemType: FavoriteItemType
  variant?: 'default' | 'ghost' | 'outline'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  showText?: boolean
  className?: string
}

export function FavoriteButton({
  itemId,
  itemType,
  variant = 'outline',
  size = 'default',
  showText = false,
  className,
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites(itemType)
  const [isAnimating, setIsAnimating] = useState(false)
  const favorited = isFavorite(itemId, itemType)

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setIsAnimating(true)
    await toggleFavorite(itemId, itemType)

    setTimeout(() => setIsAnimating(false), 300)
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={cn(
        'group transition-all',
        favorited && 'text-red-500 hover:text-red-600',
        className
      )}
    >
      <Heart
        className={cn(
          'h-4 w-4 transition-all',
          isAnimating && 'scale-125',
          favorited && 'fill-current',
          showText && 'mr-2'
        )}
      />
      {showText && (
        <span>{favorited ? '已收藏' : '收藏'}</span>
      )}
    </Button>
  )
}
