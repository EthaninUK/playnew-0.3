'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, TrendingUp, Clock, Loader2, Building2, Newspaper } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';

interface Strategy {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  risk_level: number;
}

interface Provider {
  id: string;
  name: string;
  slug: string;
  description: string;
  type: string;
  verified: boolean;
}

interface NewsItem {
  id: string;
  title: string;
  ai_summary: string;
  category: string;
}

interface SearchResults {
  strategies?: Strategy[];
  providers?: Provider[];
  news?: NewsItem[];
}

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults>({});
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Save to recent searches
  const saveToRecent = (searchQuery: string) => {
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  // Search function with debounce
  const performSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults({});
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setResults({
        strategies: data.strategies || [],
        providers: data.providers || [],
        news: data.news || [],
      });
    } catch (error) {
      console.error('Search error:', error);
      setResults({});
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, performSearch]);

  const handleSelect = (type: 'strategy' | 'provider' | 'news', slug: string) => {
    saveToRecent(query);
    onOpenChange(false);

    if (type === 'strategy') {
      router.push(`/strategies/${slug}`);
    } else if (type === 'provider') {
      router.push(`/providers/${slug}`);
    } else if (type === 'news') {
      router.push(`/news/${slug}`);
    }
  };

  const getRiskBadge = (level: number) => {
    const configs = [
      { variant: 'outline' as const, label: '未知' },
      { variant: 'secondary' as const, label: '极低' },
      { variant: 'secondary' as const, label: '低' },
      { variant: 'default' as const, label: '中' },
      { variant: 'destructive' as const, label: '高' },
      { variant: 'destructive' as const, label: '极高' },
    ];
    return configs[level] || configs[0];
  };

  const hasResults =
    (results.strategies && results.strategies.length > 0) ||
    (results.providers && results.providers.length > 0) ||
    (results.news && results.news.length > 0);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="搜索玩法、服务商、资讯..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {loading && (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {!loading && query.length < 2 && recentSearches.length > 0 && (
          <CommandGroup heading="最近搜索">
            {recentSearches.map((recent, index) => (
              <CommandItem
                key={index}
                onSelect={() => {
                  setQuery(recent);
                  performSearch(recent);
                }}
              >
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{recent}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {!loading && query.length >= 2 && !hasResults && (
          <CommandEmpty>没有找到相关结果</CommandEmpty>
        )}

        {/* 策略结果 */}
        {!loading && results.strategies && results.strategies.length > 0 && (
          <CommandGroup heading="玩法策略">
            {results.strategies.map((strategy) => {
              const riskConfig = getRiskBadge(strategy.risk_level);
              return (
                <CommandItem
                  key={strategy.id}
                  onSelect={() => handleSelect('strategy', strategy.slug)}
                  className="cursor-pointer"
                >
                  <div className="flex items-start gap-3 w-full">
                    <TrendingUp className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium truncate">{strategy.title}</span>
                        <Badge variant={riskConfig.variant} className="shrink-0">
                          {riskConfig.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {strategy.summary}
                      </p>
                    </div>
                  </div>
                </CommandItem>
              );
            })}
          </CommandGroup>
        )}

        {/* 服务商结果 */}
        {!loading && results.providers && results.providers.length > 0 && (
          <CommandGroup heading="服务商">
            {results.providers.map((provider) => (
              <CommandItem
                key={provider.id}
                onSelect={() => handleSelect('provider', provider.slug)}
                className="cursor-pointer"
              >
                <div className="flex items-start gap-3 w-full">
                  <Building2 className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium truncate">{provider.name}</span>
                      {provider.verified && (
                        <Badge variant="secondary" className="shrink-0">
                          已验证
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {provider.description}
                    </p>
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {/* 新闻结果 */}
        {!loading && results.news && results.news.length > 0 && (
          <CommandGroup heading="资讯">
            {results.news.map((news) => (
              <CommandItem
                key={news.id}
                onSelect={() => handleSelect('news', news.id)}
                className="cursor-pointer"
              >
                <div className="flex items-start gap-3 w-full">
                  <Newspaper className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium truncate">{news.title}</span>
                      <Badge variant="outline" className="shrink-0">
                        {news.category}
                      </Badge>
                    </div>
                    {news.ai_summary && (
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {news.ai_summary}
                      </p>
                    )}
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
