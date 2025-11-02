'use client'

import dynamic from 'next/dynamic'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { FavoriteItemType } from '@/lib/hooks/useFavorites'

// 动态导入,禁用 SSR
const FavoriteButton = dynamic(
  () => import('./FavoriteButton').then((mod) => ({ default: mod.FavoriteButton })),
  {
    ssr: false,
    loading: ({ variant = 'outline', size = 'default', showText = false, className }: any) => (
      <Button
        variant={variant}
        size={size}
        className={cn('group transition-all', className)}
        disabled
      >
        <Heart className={cn('h-4 w-4 transition-all', showText && 'mr-2')} />
        {showText && <span>收藏</span>}
      </Button>
    ),
  }
)

interface FavoriteButtonWrapperProps {
  itemId: string
  itemType: FavoriteItemType
  variant?: 'default' | 'ghost' | 'outline'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  showText?: boolean
  className?: string
}

export function FavoriteButtonWrapper(props: FavoriteButtonWrapperProps) {
  return <FavoriteButton {...props} />
}
