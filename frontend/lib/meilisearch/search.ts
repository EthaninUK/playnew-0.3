import { getMeiliClient, STRATEGIES_INDEX, PROVIDERS_INDEX, NEWS_INDEX } from './client';

export interface SearchOptions {
  query: string;
  limit?: number;
  offset?: number;
  filter?: string;
  sort?: string[];
}

export interface SearchResult {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: string;
  risk_level: number;
  _formatted?: {
    title: string;
    summary: string;
  };
}

export interface ProviderSearchResult {
  id: string;
  name: string;
  slug: string;
  description: string;
  type: string;
  category: string;
  rating: number;
  verified: boolean;
  _formatted?: {
    name: string;
    description: string;
  };
}

export interface NewsSearchResult {
  id: string;
  title: string;
  ai_summary: string;
  category: string;
  source: string;
  published_at: string;
  _formatted?: {
    title: string;
    ai_summary: string;
  };
}

/**
 * 搜索策略
 */
export async function searchStrategies({
  query,
  limit = 20,
  offset = 0,
  filter,
  sort,
}: SearchOptions) {
  const client = getMeiliClient();
  const index = client.index(STRATEGIES_INDEX);

  try {
    const results = await index.search<SearchResult>(query, {
      limit,
      offset,
      filter,
      sort,
      attributesToHighlight: ['title', 'summary'],
      highlightPreTag: '<mark class="bg-yellow-200 dark:bg-yellow-800">',
      highlightPostTag: '</mark>',
      attributesToCrop: ['summary'],
      cropLength: 100,
    });

    return {
      hits: results.hits,
      totalHits: results.estimatedTotalHits || 0,
      query,
      processingTimeMs: results.processingTimeMs,
    };
  } catch (error) {
    console.error('Meilisearch error:', error);
    return {
      hits: [],
      totalHits: 0,
      query,
      processingTimeMs: 0,
    };
  }
}

/**
 * 搜索服务商
 */
export async function searchProviders({
  query,
  limit = 20,
  offset = 0,
  filter,
  sort,
}: SearchOptions) {
  const client = getMeiliClient();
  const index = client.index(PROVIDERS_INDEX);

  try {
    const results = await index.search<ProviderSearchResult>(query, {
      limit,
      offset,
      filter,
      sort,
      attributesToHighlight: ['name', 'description'],
      highlightPreTag: '<mark class="bg-yellow-200 dark:bg-yellow-800">',
      highlightPostTag: '</mark>',
      attributesToCrop: ['description'],
      cropLength: 100,
    });

    return {
      hits: results.hits,
      totalHits: results.estimatedTotalHits || 0,
      query,
      processingTimeMs: results.processingTimeMs,
    };
  } catch (error) {
    console.error('Meilisearch error:', error);
    return {
      hits: [],
      totalHits: 0,
      query,
      processingTimeMs: 0,
    };
  }
}

/**
 * 搜索新闻
 */
export async function searchNews({
  query,
  limit = 20,
  offset = 0,
  filter,
  sort,
}: SearchOptions) {
  const client = getMeiliClient();
  const index = client.index(NEWS_INDEX);

  try {
    const results = await index.search<NewsSearchResult>(query, {
      limit,
      offset,
      filter,
      sort,
      attributesToHighlight: ['title', 'ai_summary'],
      highlightPreTag: '<mark class="bg-yellow-200 dark:bg-yellow-800">',
      highlightPostTag: '</mark>',
      attributesToCrop: ['ai_summary'],
      cropLength: 100,
    });

    return {
      hits: results.hits,
      totalHits: results.estimatedTotalHits || 0,
      query,
      processingTimeMs: results.processingTimeMs,
    };
  } catch (error) {
    console.error('Meilisearch error:', error);
    return {
      hits: [],
      totalHits: 0,
      query,
      processingTimeMs: 0,
    };
  }
}

/**
 * 全局搜索（所有类型）
 */
export async function searchAll(query: string, limit = 5) {
  if (query.length < 2) {
    return {
      strategies: [],
      providers: [],
      news: [],
      totalHits: 0,
    };
  }

  const [strategies, providers, news] = await Promise.all([
    searchStrategies({ query, limit }),
    searchProviders({ query, limit }),
    searchNews({ query, limit }),
  ]);

  return {
    strategies: strategies.hits,
    providers: providers.hits,
    news: news.hits,
    totalHits: strategies.totalHits + providers.totalHits + news.totalHits,
  };
}

/**
 * 获取搜索建议（自动完成）
 */
export async function getSearchSuggestions(query: string, limit = 5) {
  if (query.length < 2) {
    return [];
  }

  const results = await searchAll(query, limit);

  return [
    ...results.strategies.map((hit) => ({
      title: hit.title,
      slug: hit.slug,
      type: 'strategy' as const,
      category: hit.category,
    })),
    ...results.providers.map((hit) => ({
      title: hit.name,
      slug: hit.slug,
      type: 'provider' as const,
      category: hit.type || hit.category,
    })),
    ...results.news.map((hit) => ({
      title: hit.title,
      slug: hit.id,
      type: 'news' as const,
      category: hit.category,
    })),
  ];
}
