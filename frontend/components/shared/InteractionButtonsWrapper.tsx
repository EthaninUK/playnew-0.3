'use client'

import dynamic from 'next/dynamic'
import { Eye } from 'lucide-react'
import { cn } from '@/lib/utils'

// 动态导入,禁用 SSR
const InteractionButtons = dynamic(
  () => import('./InteractionButtons').then((mod) => ({ default: mod.InteractionButtons })),
  {
    ssr: false,
    loading: ({ initialViews, className }: any) => (
      <div className={cn('flex items-center gap-2', className)}>
        {/* 浏览量（只读） - 可以在加载状态显示 */}
        {initialViews > 0 && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Eye className="h-4 w-4" />
            <span>{initialViews}</span>
          </div>
        )}
        {/* 按钮骨架加载状态 */}
        <div className="flex items-center gap-2">
          <div className="h-9 w-16 bg-muted/50 rounded-md animate-pulse" />
          <div className="h-9 w-16 bg-muted/50 rounded-md animate-pulse" />
          <div className="h-9 w-20 bg-muted/50 rounded-md animate-pulse" />
        </div>
      </div>
    ),
  }
)

interface InteractionButtonsWrapperProps {
  contentId: string
  contentType: 'strategy' | 'news' | 'provider'
  initialLikes?: number
  initialBookmarks?: number
  initialViews?: number
  className?: string
}

export function InteractionButtonsWrapper(props: InteractionButtonsWrapperProps) {
  return <InteractionButtons {...props} />
}
