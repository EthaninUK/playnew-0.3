import { MeiliSearch } from 'meilisearch';

// 客户端实例（用于浏览器端和服务端）
export function getMeiliClient() {
  // Use MEILISEARCH_API_KEY or MEILISEARCH_MASTER_KEY (fallback)
  const apiKey = process.env.MEILISEARCH_API_KEY || process.env.MEILISEARCH_MASTER_KEY || process.env.NEXT_PUBLIC_MEILISEARCH_SEARCH_KEY;

  // For server-side, always use localhost for better performance
  // For client-side, use the public URL
  const host = typeof window === 'undefined'
    ? 'http://localhost:7700'  // Server-side: use localhost
    : (process.env.NEXT_PUBLIC_MEILISEARCH_HOST || 'http://localhost:7700');  // Client-side: use public URL

  return new MeiliSearch({
    host,
    ...(apiKey && { apiKey }),
  });
}

// 服务端实例（用于 API routes，有写权限）
export function getMeiliAdminClient() {
  const apiKey = process.env.MEILISEARCH_API_KEY || process.env.MEILISEARCH_MASTER_KEY;

  return new MeiliSearch({
    host: 'http://localhost:7700',  // Always use localhost for server-side
    ...(apiKey && { apiKey }),
  });
}

export const STRATEGIES_INDEX = 'strategies';
export const NEWS_INDEX = 'news';
export const PROVIDERS_INDEX = 'providers';
