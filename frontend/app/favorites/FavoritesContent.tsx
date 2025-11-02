'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useFavorites, type FavoriteItemType } from '@/lib/hooks/useFavorites'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, Heart, ExternalLink } from 'lucide-react'

interface ContentItem {
  id: string
  title?: string
  name?: string
  slug?: string
  category?: string
  summary?: string
  description?: string
}

export function FavoritesContent() {
  const { favorites, loading } = useFavorites()
  const [strategyItems, setStrategyItems] = useState<ContentItem[]>([])
  const [providerItems, setProviderItems] = useState<ContentItem[]>([])
  const [newsItems, setNewsItems] = useState<ContentItem[]>([])
  const [loadingItems, setLoadingItems] = useState(true)

  useEffect(() => {
    async function fetchFavoriteItems() {
      if (favorites.length === 0) {
        setLoadingItems(false)
        return
      }

      try {
        // 按类型分组
        const strategyIds = favorites
          .filter((f) => f.item_type === 'strategy')
          .map((f) => f.item_id)
        const providerIds = favorites
          .filter((f) => f.item_type === 'provider')
          .map((f) => f.item_id)
        const newsIds = favorites
          .filter((f) => f.item_type === 'news')
          .map((f) => f.item_id)

        // 并行获取所有数据
        const [strategiesRes, providersRes, newsRes] = await Promise.all([
          strategyIds.length > 0
            ? fetch(
                `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/items/strategies?filter[id][_in]=${strategyIds.join(',')}&fields=id,title,slug,category,summary`
              ).then((r) => r.json())
            : Promise.resolve({ data: [] }),
          providerIds.length > 0
            ? fetch(
                `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/items/service_providers?filter[id][_in]=${providerIds.join(',')}&fields=id,name,slug,category,description`
              ).then((r) => r.json())
            : Promise.resolve({ data: [] }),
          newsIds.length > 0
            ? fetch(
                `${process.env.NEXT_PUBLIC_DIRECTUS_URL}/items/news?filter[id][_in]=${newsIds.join(',')}&fields=id,title,slug,category,ai_summary`
              ).then((r) => r.json())
            : Promise.resolve({ data: [] }),
        ])

        setStrategyItems(strategiesRes.data || [])
        setProviderItems(providersRes.data || [])
        setNewsItems(newsRes.data || [])
      } catch (error) {
        console.error('Error fetching favorite items:', error)
      } finally {
        setLoadingItems(false)
      }
    }

    fetchFavoriteItems()
  }, [favorites])

  if (loading || loadingItems) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (favorites.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Heart className="h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-lg font-medium mb-2">还没有收藏任何内容</p>
          <p className="text-muted-foreground mb-6 text-center">
            浏览玩法、服务商和资讯，点击收藏按钮保存您感兴趣的内容
          </p>
          <div className="flex gap-3">
            <Button asChild>
              <Link href="/strategies">浏览玩法</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/providers">浏览服务商</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="grid w-full max-w-md grid-cols-4">
        <TabsTrigger value="all">
          全部 ({favorites.length})
        </TabsTrigger>
        <TabsTrigger value="strategy">
          玩法 ({strategyItems.length})
        </TabsTrigger>
        <TabsTrigger value="provider">
          服务商 ({providerItems.length})
        </TabsTrigger>
        <TabsTrigger value="news">
          资讯 ({newsItems.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="mt-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {strategyItems.map((item) => (
            <FavoriteCard key={item.id} item={item} type="strategy" />
          ))}
          {providerItems.map((item) => (
            <FavoriteCard key={item.id} item={item} type="provider" />
          ))}
          {newsItems.map((item) => (
            <FavoriteCard key={item.id} item={item} type="news" />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="strategy" className="mt-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {strategyItems.map((item) => (
            <FavoriteCard key={item.id} item={item} type="strategy" />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="provider" className="mt-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {providerItems.map((item) => (
            <FavoriteCard key={item.id} item={item} type="provider" />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="news" className="mt-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {newsItems.map((item) => (
            <FavoriteCard key={item.id} item={item} type="news" />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  )
}

function FavoriteCard({
  item,
  type,
}: {
  item: ContentItem
  type: FavoriteItemType
}) {
  const title = item.title || item.name || ''
  const description = item.summary || item.description || ''
  const href =
    type === 'strategy'
      ? `/strategies/${item.slug}`
      : type === 'provider'
        ? `/providers/${item.slug}`
        : `/news/${item.slug}`

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="line-clamp-2 text-lg">{title}</CardTitle>
            {item.category && (
              <CardDescription className="mt-1">{item.category}</CardDescription>
            )}
          </div>
          <span className="text-xs bg-muted px-2 py-1 rounded">
            {type === 'strategy' ? '玩法' : type === 'provider' ? '服务商' : '资讯'}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
            {description}
          </p>
        )}
        <Button variant="outline" size="sm" asChild className="w-full">
          <Link href={href}>
            查看详情
            <ExternalLink className="ml-2 h-3 w-3" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
